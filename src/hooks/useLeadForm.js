import { useCallback, useRef, useState } from 'react';
import { validateLead } from '../../shared/lead-schema.js';
import { enquiryWhatsAppHref, openWhatsApp } from '../services/leadService.js';
import { trackWhatsAppEnquiry } from '../services/trackingService.js';

// `treatment` is hidden context (from the service a visitor clicked); `city` is labelled "Location".
const EMPTY = { name: '', mobile: '', city: '', treatment: '', company: '' };
export const FIELD_ORDER = ['name', 'mobile', 'city'];

/**
 * Form state, validation and WhatsApp hand-off for the consultation form.
 * status: idle | opened (WhatsApp opened, visitor must tap Send) | blocked (browser blocked the new window)
 * Entered values are kept in every state so the visitor never has to retype.
 */
export function useLeadForm({ source, defaultTreatment = '' }) {
  const [values, setValues] = useState(() => ({ ...EMPTY, treatment: defaultTreatment }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const valuesRef = useRef(values);
  const touchedRef = useRef(touched);

  const setField = useCallback((name, value) => {
    const next = { ...valuesRef.current, [name]: value };
    valuesRef.current = next;
    setValues(next);
    if (touchedRef.current[name]) setErrors(validateLead(next));
  }, []);

  const touch = useCallback((name) => {
    touchedRef.current = { ...touchedRef.current, [name]: true };
    setTouched(touchedRef.current);
    setErrors(validateLead(valuesRef.current));
  }, []);

  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  /**
   * Synchronous on purpose: WhatsApp must open inside the same click, or browsers block it.
   * Returns the first invalid field name (for focusing), otherwise null.
   */
  const submit = useCallback(() => {
    const current = valuesRef.current;
    const errs = validateLead(current);
    setErrors(errs);
    touchedRef.current = Object.fromEntries(FIELD_ORDER.map((f) => [f, true]));
    setTouched(touchedRef.current);
    const firstInvalid = FIELD_ORDER.find((f) => errs[f]);
    if (firstInvalid) return firstInvalid;
    if (current.company) return null; // honeypot filled: silently ignore bots

    const opened = openWhatsApp(enquiryWhatsAppHref(current));
    setStatus(opened ? 'opened' : 'blocked');
    if (opened) trackWhatsAppEnquiry({ source, treatment: current.treatment });
    return null;
  }, [source]);

  /** Back to the form with all entered details intact. */
  const edit = useCallback(() => setStatus('idle'), []);

  return { values, setField, touch, errorFor, status, submit, edit };
}
