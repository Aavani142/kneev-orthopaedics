import { normalizeMobile } from '../../shared/lead-schema.js';
import { getAttribution } from './attribution.js';

/*
 * Enquiries are emailed to the clinic by the serverless function at /api/lead (api/lead.js),
 * which sends them through Resend. The API key lives only on the server.
 *
 * Browser storage holds only a session flag, never names, phone numbers or medical details.
 */

/** Set for the current browser session after an enquiry is delivered (pauses the auto popup). */
export const ENQUIRY_SENT_SESSION_KEY = 'kneev_enquiry_sent';

const ENDPOINT = '/api/lead';

/** A random id for one enquiry. Retries reuse it so the clinic gets one email and Ads counts one lead. */
export function newSubmissionId() {
  return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Sends the enquiry. Resolves only when the server confirms the email provider accepted it;
 * throws an Error (with .code) otherwise.
 */
export async function submitLead(values, { source, submissionId }) {
  const { gclid, gbraid, wbraid, utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id, landing_page } =
    getAttribution();

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId,
        source,
        name: values.name.trim(),
        mobile: normalizeMobile(values.mobile),
        city: values.city.trim(),
        treatment: values.treatment || '',
        company: values.company || '', // honeypot
        attribution: { gclid, gbraid, wbraid, utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id, landing_page },
      }),
      signal: AbortSignal.timeout?.(20000),
    });
  } catch {
    throw Object.assign(new Error('Network error'), { code: 'network' });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true || !data.id) {
    throw Object.assign(new Error(data.error || `HTTP ${res.status}`), { code: data.error || 'server', fields: data.fields });
  }

  try {
    sessionStorage.setItem(ENQUIRY_SENT_SESSION_KEY, '1');
  } catch {
    /* storage unavailable */
  }
  return data;
}
