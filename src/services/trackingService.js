/**
 * Google Tag Manager / GA4 / Google Ads hooks.
 *
 * - VITE_GTM_ID set: only GTM loads; every event is pushed to window.dataLayer.
 *   Configure GA4 + Ads tags inside GTM (prevents double counting).
 * - Otherwise gtag.js loads for VITE_GA4_ID and/or VITE_GOOGLE_ADS_ID and events
 *   plus Ads conversions are sent directly.
 * - Nothing configured: events still go to dataLayer (harmless, useful in QA).
 *
 * Events: consultation_popup_open, consultation_cta_click, phone_click,
 * whatsapp_click, whatsapp_enquiry_opened (valid form submitted and WhatsApp opened with the
 * enquiry; the site cannot confirm the visitor then tapped Send).
 */
import { getAttribution } from './attribution.js';

const env = import.meta.env;
const GTM_ID = env.VITE_GTM_ID;
const GA4_ID = env.VITE_GA4_ID;
const ADS_ID = env.VITE_GOOGLE_ADS_ID;
const ENHANCED = env.VITE_GOOGLE_ADS_ENHANCED_CONVERSIONS === 'true';
const CONVERSION_LABELS = {
  whatsapp_enquiry_opened: env.VITE_GOOGLE_ADS_LEAD_LABEL,
  phone_click: env.VITE_GOOGLE_ADS_CALL_LABEL,
  whatsapp_click: env.VITE_GOOGLE_ADS_WHATSAPP_LABEL,
};

window.dataLayer = window.dataLayer || [];
function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
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
  } else if (GA4_ID || ADS_ID) {
    window.gtag = gtag;
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID || ADS_ID)}`);
    gtag('js', new Date());
    if (GA4_ID) gtag('config', GA4_ID);
    if (ADS_ID) gtag('config', ADS_ID, ENHANCED ? { allow_enhanced_conversions: true } : {});
  }

  document.addEventListener('click', onDocumentClick, { capture: true });
}

export function track(event, params = {}) {
  window.dataLayer.push({ event, ...params });
  if (GTM_ID || !(GA4_ID || ADS_ID)) return;
  gtag('event', event, params);
  const label = CONVERSION_LABELS[event];
  if (ADS_ID && label) {
    gtag('event', 'conversion', {
      send_to: `${ADS_ID}/${label}`,
      ...(params.lead_id ? { transaction_id: params.lead_id } : {}),
    });
  }
}

export function trackPopupOpen(trigger) {
  track('consultation_popup_open', { trigger });
}

/**
 * Valid enquiry form submitted and WhatsApp opened with the pre-filled message.
 * This is intent, not a confirmed delivery: WhatsApp gives the website no "sent" signal.
 */
export function trackWhatsAppEnquiry({ source, treatment }) {
  const { gclid, gbraid, wbraid, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = getAttribution();
  track('whatsapp_enquiry_opened', {
    form_location: source,
    treatment,
    gclid,
    gbraid,
    wbraid,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
  });
}

/** tel:, WhatsApp and consultation buttons anywhere on the page are tracked automatically. */
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
