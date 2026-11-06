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

/** Treatment is optional context (set when a visitor clicks a specific service); not a visible field. */
export const treatmentLabel = (value) => TREATMENTS.find((t) => t.value === value)?.label ?? 'Not specified';

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

/**
 * Visible fields: name, mobile, location (sent as `city`).
 * Returns an object of field -> error message. Empty object means valid.
 */
export function validateLead(v = {}) {
  const errors = {};
  const name = String(v.name ?? '').trim();
  const location = String(v.city ?? '').trim();

  if (!name) errors.name = 'Please enter your full name.';
  else if (name.length < 2 || name.length > 80 || !/^[\p{L}][\p{L} .'-]*$/u.test(name))
    errors.name = 'Please enter a valid name (letters only).';

  if (!String(v.mobile ?? '').trim()) errors.mobile = 'Please enter your mobile number.';
  else if (!isValidIndianMobile(v.mobile)) errors.mobile = 'Enter a valid 10-digit Indian mobile number.';

  if (!location) errors.city = 'Please enter your location.';
  else if (location.length < 2 || location.length > 80 || !/^[\p{L}\d][\p{L}\d .,'/-]*$/u.test(location))
    errors.city = 'Please enter a valid location.';

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
