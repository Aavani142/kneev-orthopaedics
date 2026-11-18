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
 * generate_lead (enquiry form emailed to the clinic — the "Submit Lead Form" conversion).
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

/** "Submit Lead Form" conversion: enquiry form emailed to the clinic. */
export const GOOGLE_ADS_CONVERSION_ID = ADS_ID;
export const GOOGLE_ADS_CONVERSION_LABEL = env.VITE_GOOGLE_ADS_LEAD_LABEL || PLACEHOLDER_LABEL; // TODO: paste the label

const CONVERSION_LABELS = {
  generate_lead: GOOGLE_ADS_CONVERSION_LABEL,
  phone_click: env.VITE_GOOGLE_ADS_CALL_LABEL || '', // TODO: "Phone call click" label
  whatsapp_click: env.VITE_GOOGLE_ADS_WHATSAPP_LABEL || '', // TODO: "WhatsApp click" label
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
  // No value/currency: a patient enquiry has no real monetary value to report.
  gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_CONVERSION_ID}/${label}`,
    ...(params.transaction_id ? { transaction_id: params.transaction_id } : {}),
  });
}

export function trackPopupOpen(trigger) {
  track('consultation_popup_open', { trigger });
}

const trackedLeads = new Set();

/**
 * "Submit Lead Form": call ONLY after /api/lead confirmed the email provider accepted the enquiry.
 * Sent once per submission id (re-renders or repeat calls are ignored); Google Ads also
 * de-duplicates on transaction_id.
 */
export function trackLeadSubmitted({ source, treatment, transactionId }) {
  if (!transactionId || trackedLeads.has(transactionId)) return;
  trackedLeads.add(transactionId);
  track('generate_lead', { transaction_id: transactionId, form_location: source, treatment: treatment || 'not specified' });
}

/**
 * tel:, WhatsApp and consultation buttons anywhere on the page are tracked automatically.
 * Runs in the capture phase, before the browser follows the link.
 */
function onDocumentClick(e) {
  const el = e.target.closest?.('a, button');
  if (!el) return;
  const location = el.closest('[data-track-section]')?.getAttribute('data-track-section') || 'unknown';
  const href = el.getAttribute('href') || '';
  if (href.startsWith('tel:')) track('phone_click', { link_location: location });
  else if (href.includes('wa.me/') || href.includes('api.whatsapp.com')) track('whatsapp_click', { link_location: location });
  else if (el.dataset.cta === 'consultation')
    track('consultation_cta_click', { link_location: location, cta_text: el.textContent.trim().slice(0, 60) });
}
