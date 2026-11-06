import { useCallback, useRef, useState } from 'react';
import { normalizeMobile, validateLead } from '../../shared/lead-schema.js';
import { submitLead } from '../services/leadService.js';
import { trackLead } from '../services/trackingService.js';

// `treatment` is hidden context (from the service a visitor clicked); `city` is labelled "Location".
const EMPTY = { name: '', mobile: '', city: '', treatment: '', company: '' };
export const FIELD_ORDER = ['name', 'mobile', 'city'];

/**
 * Form state, validation and submission for the consultation form.
 * status: idle | submitting | success | error
 */
export function useLeadForm({ source, defaultTreatment = '' }) {
  const [values, setValues] = useState(() => ({ ...EMPTY, treatment: defaultTreatment }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [errorCode, setErrorCode] = useState('');
  const valuesRef = useRef(values);
  const touchedRef = useRef(touched);
  const busyRef = useRef(false);
  const leadIdRef = useRef(undefined); // reused on retry for server-side de-duplication

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

  /** Returns the first invalid field name (for focusing), otherwise null. */
  const submit = useCallback(async () => {
    if (busyRef.current) return null;
    const current = valuesRef.current;
    const errs = validateLead(current);
    setErrors(errs);
    touchedRef.current = Object.fromEntries(FIELD_ORDER.map((f) => [f, true]));
    setTouched(touchedRef.current);
    const firstInvalid = FIELD_ORDER.find((f) => errs[f]);
    if (firstInvalid) return firstInvalid;

    busyRef.current = true;
    setStatus('submitting');
    setErrorCode('');
    const result = await submitLead(current, source, leadIdRef.current);
    busyRef.current = false;
    leadIdRef.current = result.leadId;
    if (result.ok) {
      trackLead({ leadId: result.leadId, treatment: current.treatment, source, mobile: normalizeMobile(current.mobile) });
      setStatus('success');
    } else if (result.fieldErrors) {
      setErrors(result.fieldErrors);
      setStatus('idle');
    } else {
      setErrorCode(result.error);
      setStatus('error');
    }
    return null;
  }, [source]);

  return { values, setField, touch, errorFor, status, errorCode, submit };
}
