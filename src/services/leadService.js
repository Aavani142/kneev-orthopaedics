import { LEAD_ENDPOINT, SITE, whatsappHref } from '../config/site.js';
import { CONSENT_TEXT, normalizeMobile, treatmentLabel } from '../../shared/lead-schema.js';
import { getAttribution } from './attribution.js';

/*
 * Browser storage holds ONLY non-identifying status (state + timestamps + id),
 * never names, phone numbers or medical details.
 */
const STATUS_KEY = 'kneev_enquiry_status';

export function getLeadStatus() {
  try {
    return JSON.parse(localStorage.getItem(STATUS_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setLeadStatus(status) {
  try {
    localStorage.setItem(STATUS_KEY, JSON.stringify(status));
  } catch {
    /* storage unavailable */
  }
}

function newLeadId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * POSTs the enquiry. Resolves { ok: true } only when the server confirms the
 * clinic was notified. leadId is reused on retry so the server can de-duplicate.
 */
export async function submitLead(values, source, leadId = newLeadId()) {
  const submittedAt = new Date().toISOString();
  const payload = {
    leadId,
    name: values.name.trim(),
    mobile: normalizeMobile(values.mobile),
    city: values.city.trim(),
    treatment: values.treatment,
    contactTime: values.contactTime,
    consent: values.consent === true,
    consentText: CONSENT_TEXT,
    consentAt: values.consentAt || submittedAt,
    submittedAt,
    source,
    company: values.company || '', // honeypot
    attribution: getAttribution(),
    page: window.location.href.slice(0, 500),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      setLeadStatus({ state: 'submitted', submittedAt, consentAt: payload.consentAt, leadId });
      return { ok: true, leadId };
    }
    return { ok: false, leadId, error: data.error || `http_${res.status}`, fieldErrors: data.fieldErrors };
  } catch (err) {
    return { ok: false, leadId, error: err.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

/** Prefilled WhatsApp message to the clinic with the visitor's enquiry. */
export function leadWhatsAppHref(values) {
  const mobile = normalizeMobile(values.mobile);
  return whatsappHref(
    [
      `Hello ${SITE.name}, I would like to request a consultation.`,
      '',
      `Name: ${values.name?.trim() || '-'}`,
      `Mobile: ${mobile ? `+91 ${mobile}` : '-'}`,
      `City: ${values.city?.trim() || '-'}`,
      `Treatment of interest: ${values.treatment ? treatmentLabel(values.treatment) : '-'}`,
      `Preferred contact time: ${values.contactTime || '-'}`,
    ].join('\n'),
  );
}
