/**
 * Framework-agnostic lead handler, used by:
 *   - server/standalone.js   (production Node server: `npm start`)
 *   - vite.config.js         (local `npm run dev` / `npm run preview`)
 * Any other Node host can call handleLead() from its own route.
 *
 * Pipeline: validate -> spam/duplicate checks -> store -> notify (email,
 * WhatsApp, webhook). All secrets come from server-side environment
 * variables only; nothing here is bundled into the browser.
 */
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  ATTRIBUTION_KEYS,
  normalizeMobile,
  treatmentLabel,
  validateLead,
} from '../shared/lead-schema.js';

/* ----------------------------- abuse controls ----------------------------- */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map(); // per-IP timestamps (per process)
const recent = new Map(); // dedupe key -> { at, leadId }

function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_MAX;
}

function findDuplicate(keys, windowMs) {
  const now = Date.now();
  for (const [k, v] of recent) if (now - v.at > windowMs) recent.delete(k);
  for (const key of keys) if (recent.has(key)) return recent.get(key);
  return null;
}

/* --------------------------------- helpers -------------------------------- */

const clip = (v, n = 300) => String(v ?? '').slice(0, n);
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function buildLead(body, meta) {
  const attribution = {};
  const src = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};
  for (const key of [...ATTRIBUTION_KEYS, 'landing_page', 'referrer', 'first_visit', 'first_utm_source']) {
    if (src[key]) attribution[key] = clip(src[key], 500);
  }
  return {
    leadId: clip(body.leadId, 80) || `srv-${Date.now()}`,
    name: clip(body.name, 80).trim(),
    mobile: normalizeMobile(body.mobile),
    city: clip(body.city, 80).trim(), // shown to visitors as "Location"
    treatment: treatmentLabel(body.treatment),
    submittedAt: clip(body.submittedAt, 40),
    receivedAt: new Date().toISOString(),
    source: clip(body.source, 40),
    page: clip(body.page, 500),
    attribution,
    ip: meta.ip || '',
    userAgent: clip(meta.userAgent, 300),
  };
}

function leadRows(lead) {
  return [
    ['Name', lead.name],
    ['Mobile', `+91 ${lead.mobile}`],
    ['Location', lead.city],
    ['Treatment', lead.treatment],
    ['Form', lead.source],
    ['Submitted at', lead.submittedAt],
    ['Received at (server)', lead.receivedAt],
    ...Object.entries(lead.attribution),
    ['Lead ID', lead.leadId],
  ];
}

const campaignOf = (lead) =>
  lead.attribution.utm_campaign || (lead.attribution.gclid || lead.attribution.gbraid || lead.attribution.wbraid ? 'Google Ads' : 'Direct / organic');

/* --------------------------------- storage -------------------------------- */

async function storeLead(lead, env) {
  if (env.LEAD_STORE_DISABLED === 'true') return { configured: false };
  const file = path.resolve(env.LEAD_STORE_PATH || 'data/leads.jsonl');
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, `${JSON.stringify(lead)}\n`, { encoding: 'utf8', mode: 0o600 });
  return { configured: true, ok: true };
}

/* ------------------------------ notifications ----------------------------- */

function emailContent(lead) {
  const rows = leadRows(lead)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#5E645F">${esc(k)}</td><td style="padding:6px 12px"><strong>${esc(v)}</strong></td></tr>`)
    .join('');
  return {
    subject: `New enquiry: ${lead.treatment} – ${lead.name}`,
    html: `<div style="font-family:Arial,sans-serif;color:#252925"><h2 style="color:#174B3B">New consultation enquiry</h2><table style="border-collapse:collapse">${rows}</table></div>`,
    text: leadRows(lead).map(([k, v]) => `${k}: ${v}`).join('\n'),
  };
}

async function sendEmail(lead, env) {
  const to = (env.LEAD_EMAIL_TO || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!to.length) return { configured: false };
  const { subject, html, text } = emailContent(lead);

  // Option A: SMTP (e.g. Google Workspace / Gmail app password, Zoho, SES SMTP)
  if (env.SMTP_HOST) {
    const { default: nodemailer } = await import('nodemailer');
    const transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 465),
      secure: (env.SMTP_SECURE ?? 'true') === 'true',
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({ from: env.LEAD_EMAIL_FROM || env.SMTP_USER, to, subject, html, text });
    return { configured: true, ok: true };
  }

  // Option B: Resend HTTP API
  if (env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.LEAD_EMAIL_FROM, to, subject, html, text }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return { configured: true, ok: true };
  }
  return { configured: false };
}

async function sendWhatsApp(lead, env) {
  const { WHATSAPP_ACCESS_TOKEN: token, WHATSAPP_PHONE_NUMBER_ID: phoneId, WHATSAPP_TO: to } = env;
  if (!token || !phoneId || !to) return { configured: false };
  const campaign = campaignOf(lead);

  // Business-initiated WhatsApp messages need an approved template with five
  // body parameters: {{1}} name, {{2}} mobile, {{3}} location, {{4}} treatment, {{5}} campaign/source.
  const message = env.WHATSAPP_TEMPLATE_NAME
    ? {
        type: 'template',
        template: {
          name: env.WHATSAPP_TEMPLATE_NAME,
          language: { code: env.WHATSAPP_TEMPLATE_LANG || 'en' },
          components: [
            {
              type: 'body',
              parameters: [lead.name, `+91 ${lead.mobile}`, lead.city, lead.treatment, campaign].map((text) => ({
                type: 'text',
                text: clip(text, 120) || '-',
              })),
            },
          ],
        },
      }
    : {
        // Free-form text is only delivered inside an open 24-hour conversation window.
        type: 'text',
        text: {
          body: [
            '*New KNEEV consultation enquiry*',
            `Name: ${lead.name}`,
            `Mobile: +91 ${lead.mobile}`,
            `Location: ${lead.city}`,
            `Treatment: ${lead.treatment}`,
            `Source: ${campaign}`,
          ].join('\n'),
        },
      };

  const version = env.WHATSAPP_API_VERSION || 'v21.0';
  const res = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: to.replace(/\D/g, ''), ...message }),
  });
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return { configured: true, ok: true };
}

async function sendWebhook(lead, env) {
  if (!env.LEAD_WEBHOOK_URL) return { configured: false };
  const res = await fetch(env.LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(env.LEAD_WEBHOOK_SECRET ? { 'X-Webhook-Secret': env.LEAD_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return { configured: true, ok: true };
}

async function attempt(fn, lead, env, name) {
  try {
    return await fn(lead, env);
  } catch (err) {
    console.error(`[lead] ${name} failed:`, err.message);
    return { configured: true, ok: false };
  }
}

/* --------------------------------- handler -------------------------------- */

/** @returns {Promise<{status:number, json:object}>} */
export async function handleLead(body, { env = {}, ip = '', userAgent = '', origin = '' } = {}) {
  if (!body || typeof body !== 'object') return { status: 400, json: { ok: false, error: 'invalid_body' } };

  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (allowed.length && origin && !allowed.includes(origin)) return { status: 403, json: { ok: false, error: 'forbidden_origin' } };

  // Honeypot: bots fill the hidden "company" field. Respond normally, deliver nothing.
  if (body.company) return { status: 200, json: { ok: true } };

  if (rateLimited(ip)) return { status: 429, json: { ok: false, error: 'rate_limited' } };

  const fieldErrors = validateLead(body);
  if (Object.keys(fieldErrors).length) return { status: 422, json: { ok: false, error: 'validation', fieldErrors } };

  const lead = buildLead(body, { ip, userAgent });

  // Duplicate protection: same request retried, or same person + treatment shortly after.
  const dedupeKeys = [`id:${lead.leadId}`, `p:${lead.mobile}|${lead.treatment}`];
  const windowMs = Number(env.LEAD_DEDUPE_MINUTES || 15) * 60 * 1000;
  const dup = findDuplicate(dedupeKeys, windowMs);
  if (dup) return { status: 200, json: { ok: true, duplicate: true, leadId: dup.leadId } };

  const stored = await attempt(storeLead, lead, env, 'storage');
  const [email, whatsapp, webhook] = await Promise.all([
    attempt(sendEmail, lead, env, 'email'),
    attempt(sendWhatsApp, lead, env, 'whatsapp'),
    attempt(sendWebhook, lead, env, 'webhook'),
  ]);
  const notify = { email, whatsapp, webhook };
  const configured = Object.values(notify).filter((c) => c.configured);
  const delivered = configured.filter((c) => c.ok);

  // A lead only counts as received when the clinic has actually been notified.
  if (!configured.length) {
    if (env.LEAD_DEV_ECHO === 'true' && env.NODE_ENV !== 'production') {
      console.info('[lead] LEAD_DEV_ECHO – no notification channel configured. Lead:\n', lead);
      dedupeKeys.forEach((k) => recent.set(k, { at: Date.now(), leadId: lead.leadId }));
      return { status: 200, json: { ok: true, devEcho: true, leadId: lead.leadId } };
    }
    console.error('[lead] No notification channel configured (email / WhatsApp / webhook).');
    return { status: 503, json: { ok: false, error: 'not_configured' } };
  }
  if (!delivered.length) return { status: 502, json: { ok: false, error: 'delivery_failed' } };

  dedupeKeys.forEach((k) => recent.set(k, { at: Date.now(), leadId: lead.leadId }));
  const state = (c) => (c.configured ? (c.ok ? 'sent' : 'failed') : 'off');
  return {
    status: 200,
    json: {
      ok: true,
      leadId: lead.leadId,
      channels: { stored: state(stored), email: state(email), whatsapp: state(whatsapp), webhook: state(webhook) },
    },
  };
}
