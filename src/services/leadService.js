import { whatsappHref } from '../config/site.js';
import { normalizeMobile } from '../../shared/lead-schema.js';

/*
 * Enquiries are sent through WhatsApp click-to-chat (wa.me): the form builds a
 * pre-filled message to the clinic's WhatsApp number (the same number used by
 * every WhatsApp button on the site) and the visitor taps Send in WhatsApp.
 *
 * The website cannot see whether the message was actually sent, so nothing
 * here claims delivery. Browser storage holds only a session flag, never
 * names, phone numbers or medical details.
 */

/** Set for the current browser session once WhatsApp has been opened with an enquiry (pauses the auto popup). */
export const ENQUIRY_SENT_SESSION_KEY = 'kneev_enquiry_sent';

/** The exact enquiry text sent to the clinic. */
export function buildEnquiryMessage(values) {
  const mobile = normalizeMobile(values.mobile);
  return [
    'New Consultation Enquiry – Kneev',
    '',
    `Name: ${values.name.trim()}`,
    `Mobile: +91 ${mobile}`,
    `Location: ${values.city.trim()}`,
    '',
    'Source: Kneev Website',
    '',
    'I would like to enquire about an orthopaedic consultation.',
  ].join('\n');
}

/** wa.me click-to-chat link with the URL-encoded enquiry. */
export function enquiryWhatsAppHref(values) {
  return whatsappHref(buildEnquiryMessage(values));
}

/**
 * Opens WhatsApp in a new tab/window (on phones this hands over to the WhatsApp app).
 * Must be called directly inside the click/submit handler so browsers allow it.
 * Returns false when the browser blocked the new window.
 */
export function openWhatsApp(url) {
  const win = window.open(url, '_blank');
  if (!win) return false;
  try {
    win.opener = null; // the opened page cannot control this one
  } catch {
    /* cross-origin: ignore */
  }
  try {
    sessionStorage.setItem(ENQUIRY_SENT_SESSION_KEY, '1');
  } catch {
    /* storage unavailable */
  }
  return true;
}
