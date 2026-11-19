import { normalizeMobile } from '../../shared/lead-schema.js';

/*
 * Enquiries go to the clinic's Google Apps Script web app, which appends a row to
 * the enquiries Google Sheet and emails the clinic.
 *
 * Why the request looks like this (Apps Script web apps are not a normal JSON API):
 *  - Content-Type is text/plain, not application/json. That keeps it a CORS "simple
 *    request", so the browser sends no OPTIONS preflight (Apps Script cannot answer one).
 *    The body is still JSON; the script reads it with JSON.parse(e.postData.contents).
 *  - Apps Script replies with a 302 redirect to script.googleusercontent.com; fetch follows
 *    it (redirect: 'follow') and that final response carries Access-Control-Allow-Origin: *,
 *    so the reply CAN be read and checked. We never use mode: 'no-cors' (its response is
 *    opaque, so success could not be confirmed).
 *  - Success is only accepted when the script's reply explicitly says so (see isSuccess).
 *
 * The endpoint URL is public by design (it is called from every visitor's browser); it
 * is not a secret. Override with VITE_LEAD_ENDPOINT if the script is redeployed.
 */
const ENDPOINT =
  import.meta.env.VITE_LEAD_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyUYPpiohHOOp8dAu3UgEERZ2O5ZhTrSfHwXbd-H9Z4JOioIcPOydULQCH4ysnyvE09nw/exec';

const TIMEOUT_MS = 20000;

/** Set for the current browser session after an enquiry is saved (pauses the auto popup). */
export const ENQUIRY_SENT_SESSION_KEY = 'kneev_enquiry_sent';

/** A random id for one enquiry, used to count the Google Ads conversion exactly once. */
export function newSubmissionId() {
  return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/** The only three fields the backend receives (and the only patient data collected). */
export function toBackendPayload(values) {
  return {
    name: values.name.trim(),
    phone: normalizeMobile(values.mobile), // 10 digits, e.g. "9876543210"
    location: values.city.trim(), // the form's "Location" field
  };
}

/**
 * Decides whether the Apps Script reply confirms the enquiry was saved.
 * Accepts JSON such as {"status":"success"}, {"result":"success"}, {"success":true}
 * or {"ok":true}, or a plain-text reply of exactly "success" / "ok".
 * Anything else (HTML login/error pages, {"status":"error"}, empty body) is a failure.
 */
function isSuccess(text) {
  const raw = String(text || '').trim();
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (data && typeof data === 'object') {
      const status = String(data.status ?? data.result ?? '').toLowerCase();
      if (status === 'error' || data.error) return false;
      return status === 'success' || status === 'ok' || data.success === true || data.ok === true;
    }
  } catch {
    /* not JSON: fall through to plain text */
  }
  return /^(success|ok)$/i.test(raw);
}

/**
 * Sends the enquiry. Resolves only when the backend confirms success; otherwise throws
 * an Error with a .code ('network' | 'timeout' | 'http' | 'rejected'). The codes are for
 * logging/branching only; patients see one friendly message.
 */
export async function submitLead(values) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(toBackendPayload(values)),
      redirect: 'follow',
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });
  } catch (err) {
    throw Object.assign(new Error('Request failed'), { code: err?.name === 'AbortError' ? 'timeout' : 'network' });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { code: 'http' });
  const text = await res.text().catch(() => '');
  if (!isSuccess(text)) throw Object.assign(new Error('Backend did not confirm success'), { code: 'rejected' });

  try {
    sessionStorage.setItem(ENQUIRY_SENT_SESSION_KEY, '1');
  } catch {
    /* storage unavailable */
  }
  return true;
}
