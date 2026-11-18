/**
 * POST /api/lead — emails a consultation enquiry to the clinic through Resend.
 *
 * Runs as a Vercel serverless function (this file's location makes it /api/lead).
 * The same handler serves `npm run dev` (vite.config.js) and `npm start` (server/standalone.js).
 *
 * Responds 200 { ok: true, id } ONLY after Resend has accepted the email (HTTP 200 with an
 * email id). Every other outcome is an error status with { ok: false, error }, and the
 * browser then shows an error and does not count a Google Ads conversion.
 *
 * Server-side environment variables (never VITE_*; they must not reach the browser):
 *   RESEND_API_KEY    required  Resend API key (re_...)
 *   LEAD_EMAIL_TO     optional  recipient(s), comma-separated. Default: kneevorthopaediccenter@gmail.com
 *   LEAD_EMAIL_FROM   optional  sender. Default: "Kneev Website <onboarding@resend.dev>", which Resend
 *                               only delivers to the Resend account owner's own address. Use an
 *                               address on a domain verified in Resend for anything else.
 *   LEAD_ALLOWED_ORIGINS optional  extra allowed Origins, comma-separated (same host is always allowed)
 */
import { ATTRIBUTION_KEYS, normalizeMobile, treatmentLabel, validateLead } from '../shared/lead-schema.js';

const DEFAULT_TO = 'kneevorthopaediccenter@gmail.com';
const DEFAULT_FROM = 'Kneev Website <onboarding@resend.dev>';
const SUBJECT = 'New Patient Enquiry – Kneev Orthopaedic Center';
const MAX_BODY_BYTES = 16 * 1024;

/** Which form was used: the on-page appointment form, or the popup opened from a given button. */
function formLocation(source) {
  if (source === 'appointment-section') return 'Appointment form on the page';
  return source ? `Consultation popup (opened from: ${source.replace(/-/g, ' ')})` : 'Consultation popup';
}

// Best-effort abuse limit per warm server instance: 5 enquiries per IP per 10 minutes.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body; // Vercel already parsed JSON
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) throw Object.assign(new Error('Body too large'), { status: 413 });
  }
  return JSON.parse(raw || '{}');
}

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin form posts from some browsers omit it
  let host;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  if (host === req.headers.host || host === req.headers['x-forwarded-host']) return true;
  const extra = (process.env.LEAD_ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return extra.includes(origin);
}

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max);

/** Optional fields: accepted when the form sends them, validated, shown only if present. */
function validateOptional(body) {
  const errors = {};
  const email = clean(body.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email address.';
  const message = clean(body.message, 2000);
  return { errors, email, message };
}

function buildEmail(lead) {
  const rows = [
    ['Patient name', lead.name],
    ['Phone number', lead.phone],
    lead.email && ['Email address', lead.email],
    ['Location', lead.location],
    ['Treatment / service', lead.treatment],
    lead.message && ['Message', lead.message],
    ['Submitted', lead.submittedAt],
    ['Form', lead.formLocation],
  ].filter(Boolean);
  const campaign = Object.entries(lead.attribution).filter(([, v]) => v);

  const rowHtml = ([k, v]) =>
    `<tr><td style="padding:10px 14px;border-bottom:1px solid #e6e2d8;color:#5b6660;font-size:13px;width:170px;vertical-align:top">${esc(k)}</td>` +
    `<td style="padding:10px 14px;border-bottom:1px solid #e6e2d8;color:#13231d;font-size:15px;white-space:pre-wrap">${esc(v)}</td></tr>`;

  const html = `<!doctype html><html><body style="margin:0;background:#f5f1e8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1e8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden">
<tr><td style="background:#103a2f;padding:22px 24px;color:#ffffff">
<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#e9a15a">Website enquiry</div>
<div style="font-size:21px;font-weight:bold;margin-top:6px">New Patient Enquiry</div>
<div style="font-size:13px;color:#cfdcd5;margin-top:4px">Kneev Orthopaedic Center · acl.kneevorthopaediccenter.com</div>
</td></tr>
<tr><td style="padding:8px 10px 4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.map(rowHtml).join('')}</table></td></tr>
<tr><td style="padding:16px 24px 6px">
<a href="tel:+91${esc(lead.mobile)}" style="display:inline-block;background:#103a2f;color:#ffffff;text-decoration:none;padding:11px 18px;border-radius:6px;font-size:14px;font-weight:bold">Call ${esc(lead.phone)}</a>
</td></tr>
${
  campaign.length
    ? `<tr><td style="padding:14px 24px 4px;color:#5b6660;font-size:12px"><strong>Campaign details</strong><br>${campaign
        .map(([k, v]) => `${esc(k)}: ${esc(v)}`)
        .join('<br>')}</td></tr>`
    : ''
}
<tr><td style="padding:16px 24px 22px;color:#8a938e;font-size:11px">Sent automatically from the website enquiry form. Reply to the patient by phone; this email address is not monitored by the patient.</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    'New Patient Enquiry – Kneev Orthopaedic Center',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ...(campaign.length ? ['', 'Campaign details', ...campaign.map(([k, v]) => `${k}: ${v}`)] : []),
  ].join('\n');

  return { html, text };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  if (!originAllowed(req)) return send(res, 403, { ok: false, error: 'forbidden' });

  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    return send(res, err.status || 400, { ok: false, error: 'invalid_body' });
  }
  if (!body || typeof body !== 'object') return send(res, 400, { ok: false, error: 'invalid_body' });

  // Honeypot filled: a bot. Reply like a success so it learns nothing; send no email.
  if (clean(body.company, 200)) return send(res, 200, { ok: true, id: null });

  const fieldErrors = validateLead(body);
  const optional = validateOptional(body);
  Object.assign(fieldErrors, optional.errors);
  if (Object.keys(fieldErrors).length) return send(res, 422, { ok: false, error: 'validation', fields: fieldErrors });

  const submissionId = clean(body.submissionId, 64);
  if (!/^[\w-]{8,64}$/.test(submissionId)) return send(res, 400, { ok: false, error: 'invalid_submission_id' });

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (rateLimited(ip)) return send(res, 429, { ok: false, error: 'rate_limited' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[lead] RESEND_API_KEY is not set');
    return send(res, 503, { ok: false, error: 'email_not_configured' });
  }

  const mobile = normalizeMobile(body.mobile);
  const attributionIn = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};
  const attribution = {};
  for (const key of [...ATTRIBUTION_KEYS, 'landing_page']) attribution[key] = clean(attributionIn[key], 300);

  const lead = {
    name: clean(body.name, 80),
    mobile,
    phone: `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`,
    email: optional.email,
    location: clean(body.city, 80),
    treatment: treatmentLabel(clean(body.treatment, 40)),
    message: optional.message,
    formLocation: formLocation(clean(body.source, 60).replace(/[^\w-]/g, '')),
    submittedAt: `${new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date())} IST`,
    attribution,
  };

  const { html, text } = buildEmail(lead);
  const to = (process.env.LEAD_EMAIL_TO || DEFAULT_TO).split(',').map((s) => s.trim()).filter(Boolean);

  let resendRes;
  let resendBody = {};
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Resend sends at most one email per key within 24 h, so a retried submission is not emailed twice.
        'Idempotency-Key': `lead-${submissionId}`,
      },
      body: JSON.stringify({
        from: process.env.LEAD_EMAIL_FROM || DEFAULT_FROM,
        to,
        subject: SUBJECT,
        html,
        text,
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    resendBody = await resendRes.json().catch(() => ({}));
  } catch (err) {
    console.error('[lead] Resend request failed:', err?.message);
    return send(res, 502, { ok: false, error: 'email_failed' });
  }

  if (!resendRes.ok || !resendBody.id) {
    console.error('[lead] Resend rejected the email:', resendRes.status, JSON.stringify(resendBody).slice(0, 300));
    return send(res, 502, { ok: false, error: 'email_failed' });
  }

  return send(res, 200, { ok: true, id: resendBody.id });
}
