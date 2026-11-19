import { useCallback, useRef, useState } from 'react';
import { normalizeMobile } from '../../shared/lead-schema.js';
import { validateLead } from '../../shared/lead-schema.js';
import { newSubmissionId, submitLead } from '../services/leadService.js';
import { trackLeadSubmitted } from '../services/trackingService.js';

// `treatment` is hidden context (from the service a visitor clicked); `city` is labelled "Location".
const EMPTY = { name: '', mobile: '', city: '', treatment: '', company: '' };
export const FIELD_ORDER = ['name', 'mobile', 'city'];

/**
 * Form state, validation and submission (Google Apps Script) for the consultation form.
 * status: idle | submitting | success | error
 * On error the entered values are kept so the visitor never has to retype; the form is
 * cleared only after a confirmed success.
 */
export function useLeadForm({ source, defaultTreatment = '' }) {
  const [values, setValues] = useState(() => ({ ...EMPTY, treatment: defaultTreatment }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitted, setSubmitted] = useState(null); // { firstName, mobile } for the thank-you message
  const valuesRef = useRef(values);
  const touchedRef = useRef(touched);
  const busyRef = useRef(false); // blocks double clicks before React re-renders
  // One id per enquiry; reused if the same details are retried, so the Ads conversion is counted once.
  const submissionIdRef = useRef(null);

  const setField = useCallback((name, value) => {
    const next = { ...valuesRef.current, [name]: value };
    valuesRef.current = next;
    setValues(next);
    submissionIdRef.current = null; // changed details are a new enquiry
    if (touchedRef.current[name]) setErrors(validateLead(next));
  }, []);

  const touch = useCallback((name) => {
    touchedRef.current = { ...touchedRef.current, [name]: true };
    setTouched(touchedRef.current);
    setErrors(validateLead(valuesRef.current));
  }, []);

  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  /** Returns the first invalid field name (for focusing), otherwise null. Sending happens in the background. */
  const submit = useCallback(() => {
    if (busyRef.current) return null;
    const current = valuesRef.current;
    const errs = validateLead(current);
    setErrors(errs);
    touchedRef.current = Object.fromEntries(FIELD_ORDER.map((f) => [f, true]));
    setTouched(touchedRef.current);
    const firstInvalid = FIELD_ORDER.find((f) => errs[f]);
    if (firstInvalid) return firstInvalid;
    if (current.company) return null; // honeypot filled: silently ignore bots

    busyRef.current = true;
    setStatus('submitting');
    const submissionId = submissionIdRef.current || (submissionIdRef.current = newSubmissionId());

    submitLead(current)
      .then(() => {
        setSubmitted({ firstName: current.name.trim().split(/\s+/)[0], mobile: normalizeMobile(current.mobile) });
        // Reset only after a confirmed success (the hidden treatment context is kept).
        const cleared = { ...EMPTY, treatment: current.treatment };
        valuesRef.current = cleared;
        setValues(cleared);
        touchedRef.current = {};
        setTouched({});
        setErrors({});
        setStatus('success');
        // Only here: the Apps Script backend confirmed the enquiry was saved.
        trackLeadSubmitted({ source, treatment: current.treatment, transactionId: submissionId });
        submissionIdRef.current = null;
      })
      .catch(() => {
        setStatus('error'); // details stay in the form for a retry
      })
      .finally(() => {
        busyRef.current = false;
      });
    return null;
  }, [source]);

  return { values, setField, touch, errorFor, status, submit, submitted };
}
