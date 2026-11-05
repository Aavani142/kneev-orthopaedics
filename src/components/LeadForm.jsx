import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, Check, CheckCircle2, ChevronDown, Loader2, Lock, Phone } from 'lucide-react';
import { CONTACT_TIMES, TREATMENTS, normalizeMobile } from '../../shared/lead-schema.js';
import { SITE, telHref } from '../config/site.js';
import { useLeadForm } from '../hooks/useLeadForm.js';
import { getLeadStatus, leadWhatsAppHref } from '../services/leadService.js';
import { Button, WhatsAppIcon } from './ui.jsx';

const ERROR_COPY = {
  rate_limited: 'Several requests were sent in a short time. Please call or WhatsApp the clinic instead.',
  default:
    'Your request could not be sent just now. Please try again, or contact the clinic directly — your details are ready to send on WhatsApp.',
};

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm text-[#b42318]">
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

const labelCls = 'mb-1.5 block text-sm font-medium text-charcoal';

export default function LeadForm({ source, defaultTreatment = '', onEngaged, submitLabel = 'Request a Callback' }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const formRef = useRef(null);
  const successRef = useRef(null);
  const [previous] = useState(() => getLeadStatus());
  const { values, setField, touch, errorFor, status, errorCode, submit } = useLeadForm({ source, defaultTreatment });

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  async function onSubmit(e) {
    e.preventDefault();
    const firstInvalid = await submit();
    if (firstInvalid) formRef.current?.querySelector(`[data-field="${firstInvalid}"]`)?.focus();
  }

  const describe = (name) => (errorFor(name) ? id(`${name}-err`) : undefined);

  if (status === 'success') {
    const firstName = values.name.trim().split(/\s+/)[0];
    const time = values.contactTime.startsWith('Any') ? 'during clinic hours' : `in the ${values.contactTime.split(' (')[0].toLowerCase()}`;
    return (
      <div className="animate-fade-in py-2" role="status" aria-live="polite">
        <CheckCircle2 size={40} className="text-forest" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="mt-4 text-2xl font-bold outline-none">
          Thank you, {firstName}.
        </h3>
        <p className="mt-2 text-muted">
          Your request has been received. A member of our team will call you on{' '}
          <strong className="whitespace-nowrap text-charcoal">+91 {normalizeMobile(values.mobile)}</strong> {time}.
        </p>
        <p className="mt-2 text-sm text-muted">Clinic hours: Monday – Saturday, 9:00 AM – 7:00 PM.</p>
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-sm font-medium text-charcoal">Prefer WhatsApp?</p>
          <p className="mt-0.5 text-sm text-muted">Send the same details to the clinic in one tap.</p>
          <Button as="a" href={leadWhatsAppHref(values)} target="_blank" rel="noopener" variant="outline" className="mt-3 w-full">
            <WhatsAppIcon size={19} /> Send details on WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onFocus={onEngaged} aria-busy={submitting} className="space-y-4">
      {previous?.state === 'submitted' && (
        <p className="rounded-md bg-sage px-3 py-2 text-sm text-forest">
          We already have a request from you. Submit again only if your details have changed.
        </p>
      )}

      <div>
        <label htmlFor={id('name')} className={labelCls}>Full name</label>
        <input
          id={id('name')} data-field="name" className="field-input" name="name" autoComplete="name"
          placeholder="Your full name" maxLength={80} value={values.name}
          onChange={(e) => setField('name', e.target.value)} onBlur={() => touch('name')}
          aria-invalid={!!errorFor('name')} aria-describedby={describe('name')} required
        />
        <FieldError id={id('name-err')} message={errorFor('name')} />
      </div>

      <div>
        <label htmlFor={id('mobile')} className={labelCls}>Mobile number</label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-line pr-3 pl-3.5 text-[0.95rem] text-muted">
            +91
          </span>
          <input
            id={id('mobile')} data-field="mobile" className="field-input pl-[4.1rem]" name="mobile" type="tel"
            inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile number" maxLength={16}
            value={values.mobile} onChange={(e) => setField('mobile', e.target.value.replace(/[^\d+\s-]/g, ''))}
            onBlur={() => touch('mobile')} aria-invalid={!!errorFor('mobile')} aria-describedby={describe('mobile')} required
          />
        </div>
        <FieldError id={id('mobile-err')} message={errorFor('mobile')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id('city')} className={labelCls}>City</label>
          <input
            id={id('city')} data-field="city" className="field-input" name="city" autoComplete="address-level2"
            placeholder="e.g. Bengaluru" maxLength={60} value={values.city}
            onChange={(e) => setField('city', e.target.value)} onBlur={() => touch('city')}
            aria-invalid={!!errorFor('city')} aria-describedby={describe('city')} required
          />
          <FieldError id={id('city-err')} message={errorFor('city')} />
        </div>
        <div>
          <label htmlFor={id('time')} className={labelCls}>Preferred contact time</label>
          <div className="relative">
            <select
              id={id('time')} data-field="contactTime" name="contactTime" value={values.contactTime}
              className={`field-input appearance-none pr-10 ${values.contactTime ? '' : 'text-[#8b918c]'}`}
              onChange={(e) => setField('contactTime', e.target.value)} onBlur={() => touch('contactTime')}
              aria-invalid={!!errorFor('contactTime')} aria-describedby={describe('contactTime')} required
            >
              <option value="" disabled>Select a time</option>
              {CONTACT_TIMES.map((t) => (
                <option key={t} value={t} className="text-charcoal">{t}</option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
          <FieldError id={id('contactTime-err')} message={errorFor('contactTime')} />
        </div>
      </div>

      <fieldset aria-describedby={describe('treatment')}>
        <legend className={labelCls}>Treatment of interest</legend>
        <div className="grid grid-cols-2 gap-2">
          {TREATMENTS.map((t, i) => (
            <label
              key={t.value}
              className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-md border border-line-strong bg-white px-3 py-2 text-[0.875rem] leading-snug text-charcoal transition-colors hover:border-forest/50 has-[:checked]:border-forest has-[:checked]:bg-sage has-[:checked]:font-medium has-[:checked]:text-forest-deep has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ember"
            >
              <input
                type="radio" name={id('treatment')} value={t.value} className="peer sr-only"
                data-field={i === 0 ? 'treatment' : undefined} checked={values.treatment === t.value}
                onChange={() => { touch('treatment'); setField('treatment', t.value); }}
              />
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#a9afa9] peer-checked:border-forest peer-checked:bg-forest" aria-hidden="true">
                <Check size={11} strokeWidth={3} className="text-white" />
              </span>
              {t.label}
            </label>
          ))}
        </div>
        <FieldError id={id('treatment-err')} message={errorFor('treatment')} />
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.825rem] leading-snug text-muted">
          <input
            type="checkbox" data-field="consent" checked={values.consent}
            onChange={(e) => { touch('consent'); setField('consent', e.target.checked); }}
            aria-invalid={!!errorFor('consent')} aria-describedby={describe('consent')}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-forest" required
          />
          <span>
            I agree to be contacted by KNEEV Orthopaedic Center by phone call or WhatsApp about my enquiry, and I have read the{' '}
            <a href={SITE.privacyPath} target="_blank" rel="noopener" className="font-medium text-forest underline underline-offset-2">Privacy Policy</a>.
          </span>
        </label>
        <FieldError id={id('consent-err')} message={errorFor('consent')} />
      </div>

      {/* Honeypot: hidden from people, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label>Company<input tabIndex={-1} autoComplete="off" name="company" value={values.company} onChange={(e) => setField('company', e.target.value)} /></label>
      </div>

      {status === 'error' && (
        <div role="alert" className="rounded-md border border-[#f1c9c4] bg-[#fdf3f2] p-4">
          <p className="flex gap-2 text-sm text-[#8a1c12]">
            <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
            {ERROR_COPY[errorCode] || ERROR_COPY.default}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button as="a" href={leadWhatsAppHref(values)} target="_blank" rel="noopener" size="sm">
              <WhatsAppIcon size={17} /> WhatsApp
            </Button>
            <Button as="a" href={telHref} variant="outline" size="sm">
              <Phone size={16} aria-hidden="true" /> Call
            </Button>
          </div>
        </div>
      )}

      <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <><Loader2 size={19} className="animate-spin" aria-hidden="true" /> Sending your request…</>
        ) : status === 'error' ? 'Try Again' : submitLabel}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <Lock size={12} aria-hidden="true" /> Please do not share medical reports here. Your details are used only to respond to your enquiry.
      </p>
    </form>
  );
}
