/**
 * Google Ads / GA4 / GTM hooks.
 *
 * The Google tag for Google Ads (AW-18111261649) is installed with Google's official
 * snippet in the <head> of index.html and privacy-policy.html. This file does not load
 * gtag.js a second time; it only sends events and conversions through that tag.
 *
 * - VITE_GTM_ID set: GTM also loads and events are pushed to window.dataLayer for GTM
 *   to use. Direct Ads conversions are then switched off here, so build the conversion
 *   tags inside GTM instead (otherwise every conversion would be counted twice).
 * - VITE_GA4_ID set: GA4 is configured on the same Google tag.
 *
 * Events: consultation_popup_open, consultation_cta_click, phone_click, whatsapp_click,
 * generate_lead (enquiry confirmed saved by the Apps Script backend — the "Submit Lead Form" conversion).
 */

const env = import.meta.env;
const GTM_ID = env.VITE_GTM_ID;
const GA4_ID = env.VITE_GA4_ID;
/** Must match the ID in the <head> snippet of index.html and privacy-policy.html. */
const ADS_ID = env.VITE_GOOGLE_ADS_ID || 'AW-18111261649';
const ENHANCED = env.VITE_GOOGLE_ADS_ENHANCED_CONVERSIONS === 'true';

/**
 * Google Ads conversion labels: the part after the slash in a conversion's
 * send_to value, e.g. send_to: 'AW-18111261649/AbC-D_efG-h12_34-567' → 'AbC-D_efG-h12_34-567'.
 * Paste each label from Google Ads (Goals → Conversions → the action → Tag setup →
 * "Install the tag yourself" → Event snippet), or set the VITE_* variable instead.
 * While a label is empty or still the placeholder, that conversion is not sent
 * (its event still reaches the Google tag).
 */
const PLACEHOLDER_LABEL = 'ADD_LABEL_HERE';

/** "Submit Lead Form" conversion: enquiry confirmed saved by the Apps Script backend. */
export const GOOGLE_ADS_CONVERSION_ID = ADS_ID;
// Google Ads conversion action for the ACL patient enquiry form: send_to AW-18111261649/pZpCCJbLu7sdENHXj7xD
export const GOOGLE_ADS_CONVERSION_LABEL = env.VITE_GOOGLE_ADS_LEAD_LABEL || 'pZpCCJbLu7sdENHXj7xD';
/** Value and currency from the enquiry conversion's event snippet (sent with that conversion only). */
const LEAD_CONVERSION_VALUE = { value: 1.0, currency: 'INR' };

const CONVERSION_LABELS = {
  generate_lead: GOOGLE_ADS_CONVERSION_LABEL,
  // "Phone call click": send_to AW-18111261649/jiy_CJDz77odENHXj7xD
  phone_click: env.VITE_GOOGLE_ADS_CALL_LABEL || 'jiy_CJDz77odENHXj7xD',
  // "WhatsApp Button Click": send_to AW-18111261649/RuF8CIKx8bodENHXj7xD
  whatsapp_click: env.VITE_GOOGLE_ADS_WHATSAPP_LABEL || 'RuF8CIKx8bodENHXj7xD',
};

const isRealLabel = (label) => !!label && label !== PLACEHOLDER_LABEL && /^[\w-]+$/.test(label);

window.dataLayer = window.dataLayer || [];
function gtag() {
  // Same as Google's snippet; uses window.gtag from the <head> when it is there.
  // eslint-disable-next-line prefer-rest-params
  if (typeof window.gtag === 'function') window.gtag.apply(window, arguments);
  // eslint-disable-next-line prefer-rest-params
  else window.dataLayer.push(arguments);
}

function loadScript(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

let initialised = false;

export function initTracking() {
  if (initialised) return;
  initialised = true;

  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`);
  }

  const headTag = typeof window.gtag === 'function'; // Google's snippet in <head> already ran
  if (!headTag) {
    // Fallback for a page without the <head> snippet: load the same tag once.
    window.gtag = gtag;
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ADS_ID)}`);
    gtag('js', new Date());
    gtag('config', ADS_ID);
  }
  if (ENHANCED) gtag('set', 'allow_enhanced_conversions', true);
  if (GA4_ID) gtag('config', GA4_ID);

  document.addEventListener('click', onDocumentClick, { capture: true });
}

export function track(event, params = {}) {
  window.dataLayer.push({ event, ...params });
  gtag('event', event, params);
  const label = CONVERSION_LABELS[event];
  if (GTM_ID || !isRealLabel(label)) return; // with GTM, conversions are GTM's job
  // Only the enquiry conversion carries a value (per its Google Ads snippet); phone and WhatsApp send none.
  gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_CONVERSION_ID}/${label}`,
    ...(event === 'generate_lead' ? LEAD_CONVERSION_VALUE : {}),
    ...(params.transaction_id ? { transaction_id: params.transaction_id } : {}),
    // Opening WhatsApp can move the visitor to the app straight away; a beacon still delivers the hit.
    ...(event === 'whatsapp_click' ? { transport_type: 'beacon' } : {}),
  });
}

export function trackPopupOpen(trigger) {
  track('consultation_popup_open', { trigger });
}

const trackedLeads = new Set();

/**
 * "Submit Lead Form": call ONLY after the Apps Script backend confirmed the enquiry was saved.
 * Sent once per submission id (re-renders or repeat calls are ignored); Google Ads also
 * de-duplicates on transaction_id.
 */
export function trackLeadSubmitted({ source, treatment, transactionId }) {
  if (!transactionId || trackedLeads.has(transactionId)) return;
  trackedLeads.add(transactionId);
  track('generate_lead', { transaction_id: transactionId, form_location: source, treatment: treatment || 'not specified' });
}

const handledClicks = new WeakSet();
const PHONE_REPEAT_MS = 2000; // a double tap on a call link counts as one call click
let lastPhoneClickAt = -Infinity;
const WHATSAPP_REPEAT_MS = 2000; // likewise for a double tap on a WhatsApp link
let lastWhatsAppClickAt = -Infinity;

/**
 * tel:, WhatsApp and consultation buttons anywhere on the page are tracked automatically.
 * One listener on the document, in the capture phase (before the browser follows the link);
 * it never calls preventDefault, so tel: links still open the dialler as normal.
 */
function onDocumentClick(e) {
  if (handledClicks.has(e)) return; // the same click is only ever tracked once
  handledClicks.add(e);
  const el = e.target.closest?.('a, button');
  if (!el) return;
  const location = el.closest('[data-track-section]')?.getAttribute('data-track-section') || 'unknown';
  const href = el.getAttribute('href') || '';
  if (href.startsWith('tel:')) {
    const now = Date.now();
    if (now - lastPhoneClickAt < PHONE_REPEAT_MS) return;
    lastPhoneClickAt = now;
    track('phone_click', { link_location: location });
  }
  else if (href.includes('wa.me/') || href.includes('api.whatsapp.com')) {
    // Tracking never blocks the link: the browser opens WhatsApp as normal (new tab / app).
    const now = Date.now();
    if (now - lastWhatsAppClickAt < WHATSAPP_REPEAT_MS) return;
    lastWhatsAppClickAt = now;
    track('whatsapp_click', { link_location: location });
  } else if (el.dataset.cta === 'consultation')
    track('consultation_cta_click', { link_location: location, cta_text: el.textContent.trim().slice(0, 60) });
}
