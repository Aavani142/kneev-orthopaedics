/**
 * Lead form schema shared by the browser and the server.
 * Keep validation rules in this one file so both sides agree.
 */

export const TREATMENTS = [
  { value: 'knee-replacement', label: 'Knee Replacement' },
  { value: 'acl-reconstruction', label: 'ACL Reconstruction' },
  { value: 'knee-pain', label: 'Knee Pain Consultation' },
  { value: 'not-sure', label: 'Other / Not Sure' },
];

export const CONTACT_TIMES = [
  'Morning (9 AM – 12 PM)',
  'Afternoon (12 PM – 4 PM)',
  'Evening (4 PM – 7 PM)',
  'Any time during clinic hours',
];

export const CONSENT_TEXT =
  'I agree to be contacted by KNEEV Orthopaedic Center by phone call or WhatsApp about my enquiry, and I have read the Privacy Policy.';

export const treatmentLabel = (value) =>
  TREATMENTS.find((t) => t.value === value)?.label ?? value;

/** Strip formatting and an optional +91 / 91 / 0 prefix. Returns 10 digits or the cleaned input. */
export function normalizeMobile(input) {
  let digits = String(input ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export function isValidIndianMobile(input) {
  const d = normalizeMobile(input);
  return /^[6-9]\d{9}$/.test(d) && !/^(\d)\1{9}$/.test(d);
}

/** Returns an object of field -> error message. Empty object means valid. */
export function validateLead(v = {}) {
  const errors = {};
  const name = String(v.name ?? '').trim();
  const city = String(v.city ?? '').trim();

  if (!name) errors.name = 'Please enter your full name.';
  else if (name.length < 2 || name.length > 80 || !/^[\p{L}][\p{L} .'-]*$/u.test(name))
    errors.name = 'Please enter a valid name (letters only).';

  if (!String(v.mobile ?? '').trim()) errors.mobile = 'Please enter your mobile number.';
  else if (!isValidIndianMobile(v.mobile))
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.';

  if (!city) errors.city = 'Please enter your city.';
  else if (city.length < 2 || city.length > 60 || !/^[\p{L}][\p{L} .'-]*$/u.test(city))
    errors.city = 'Please enter a valid city name.';

  if (!TREATMENTS.some((t) => t.value === v.treatment))
    errors.treatment = 'Please choose what you need help with.';

  if (!CONTACT_TIMES.includes(v.contactTime))
    errors.contactTime = 'Please choose a preferred time.';

  if (v.consent !== true) errors.consent = 'Please confirm consent so our team can contact you.';

  return errors;
}

export const ATTRIBUTION_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
];
