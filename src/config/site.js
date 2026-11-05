/**
 * Public clinic details, taken from kneevorthopaediccenter.com.
 * Every value can be overridden with the VITE_* variables in .env.
 * Nothing in this file is secret — it ships to the browser.
 */
const env = import.meta.env;

export const SITE = {
  name: 'KNEEV Orthopaedic Center',
  phoneDisplay: env.VITE_CLINIC_PHONE_DISPLAY || '+91 636 670 0736',
  phoneE164: env.VITE_CLINIC_PHONE || '+916366700736',
  whatsapp: env.VITE_CLINIC_WHATSAPP || '916366700736', // digits only, with country code
  email: env.VITE_CLINIC_EMAIL || 'kneevorthopaediccenter@gmail.com',
  address: {
    line1: 'Ground Floor, 334/28, 14th Cross Road',
    line2: '2nd Block, Jayanagar',
    city: 'Bengaluru',
    region: 'Karnataka',
    postalCode: '560011',
  },
  // From the clinic's "Why KNEEV" page. Re-confirm before launch.
  directionsNote: 'About a 5-minute walk from South End Circle Metro. Limited car parking at the building; two-wheeler parking is usually available.',
  mapsUrl: env.VITE_CLINIC_MAPS_URL || 'https://share.google/GduFqF1jzGn6mgBLs',
  mapEmbed:
    env.VITE_CLINIC_MAP_EMBED ||
    'https://www.google.com/maps?q=KNEEV+Orthopaedic+Center,+14th+Cross+Rd,+2nd+Block,+Jayanagar,+Bengaluru+560011&output=embed',
  hours: [
    { days: 'Monday – Saturday', time: '9:00 AM – 7:00 PM' },
    { days: 'Sunday', time: 'By appointment' },
  ],
  mainSite: 'https://www.kneevorthopaediccenter.com/',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/kneevorthopaediccenter' },
    { label: 'YouTube', href: 'https://www.youtube.com/@KneevOrthopaedicCenter' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61580938515787' },
  ],
  privacyPath: '/privacy-policy.html',
};

export const LEAD_ENDPOINT = env.VITE_LEAD_ENDPOINT || '/api/lead';
export const POPUP_DELAY_MS = Number(env.VITE_POPUP_DELAY_MS || 6000);
export const POPUP_SNOOZE_DAYS = Number(env.VITE_POPUP_SNOOZE_DAYS || 30);

export const DISCLAIMER =
  'Information on this website is for general educational purposes and does not replace a medical consultation or individual clinical assessment.';

export const telHref = `tel:${SITE.phoneE164}`;

export function whatsappHref(message) {
  const text = message || 'Hello KNEEV Orthopaedic Center, I would like to enquire about an orthopaedic consultation.';
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
