import { useEffect, useId, useRef } from 'react';
import { AlertCircle, ArrowLeft, Lock, Phone } from 'lucide-react';
import { normalizeMobile } from '../../shared/lead-schema.js';
import { SITE, telHref, whatsappHref } from '../config/site.js';
import { useLeadForm } from '../hooks/useLeadForm.js';
import { enquiryWhatsAppHref } from '../services/leadService.js';
import { Button, WhatsAppIcon } from './ui.jsx';

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

export default function LeadForm({ source, defaultTreatment = '', onEngaged, submitLabel = 'Send Enquiry on WhatsApp' }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const formRef = useRef(null);
  const resultRef = useRef(null);
  const { values, setField, touch, errorFor, status, submit, edit } = useLeadForm({ source, defaultTreatment });

  useEffect(() => {
    if (status === 'opened' || status === 'blocked') resultRef.current?.focus();
  }, [status]);

  function onSubmit(e) {
    e.preventDefault();
    const firstInvalid = submit(); // synchronous so the browser allows WhatsApp to open
    if (firstInvalid) formRef.current?.querySelector(`[data-field="${firstInvalid}"]`)?.focus();
  }

  const describe = (name) => (errorFor(name) ? id(`${name}-err`) : undefined);
  const waHref = enquiryWhatsAppHref(values);

  if (status === 'opened' || status === 'blocked') {
    const blocked = status === 'blocked';
    return (
      <div className="animate-fade-in py-1" role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white">
          <WhatsAppIcon size={26} />
        </span>
        <h3 ref={resultRef} tabIndex={-1} className="mt-4 text-2xl font-bold outline-none">
          {blocked ? 'Open WhatsApp to send your enquiry' : 'One last step: tap Send in WhatsApp'}
        </h3>
        <p className="mt-2 text-muted">
          {blocked
            ? 'Your browser did not open WhatsApp automatically. Tap the button below. Your details are already filled in.'
            : 'We have opened WhatsApp with your enquiry ready to go. Your enquiry is only sent to the clinic once you tap Send in WhatsApp.'}
        </p>
        <ol className="mt-4 space-y-1.5 rounded-md bg-sage px-4 py-3 text-sm text-forest-deep">
          <li>1. {blocked ? 'Tap "Open WhatsApp" below.' : 'Switch to the WhatsApp window or app.'}</li>
          <li>2. Check the pre-filled message.</li>
          <li>3. Tap <strong>Send</strong>.</li>
        </ol>

        <div className="mt-5 grid gap-2.5">
          <Button as="a" href={waHref} target="_blank" rel="noopener" variant="whatsapp" size="lg" className="w-full">
            <WhatsAppIcon size={19} /> {blocked ? 'Open WhatsApp' : 'Open WhatsApp again'}
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button as="a" href={telHref} variant="outline">
              <Phone size={16} aria-hidden="true" /> Call
            </Button>
            <Button variant="outline" onClick={edit}>
              <ArrowLeft size={16} aria-hidden="true" /> Edit details
            </Button>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          WhatsApp not installed? Call us on{' '}
          <a href={telHref} className="font-semibold text-forest underline underline-offset-2">{SITE.phoneDisplay}</a>{' '}
          (Mon – Sat, 10 AM – 7:30 PM). Your mobile: +91 {normalizeMobile(values.mobile)}.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onFocus={onEngaged} className="space-y-4">
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

      <div>
        <label htmlFor={id('city')} className={labelCls}>Location</label>
        <input
          id={id('city')} data-field="city" className="field-input" name="location" autoComplete="address-level2"
          placeholder="e.g. Jayanagar, Bengaluru" maxLength={80} value={values.city}
          onChange={(e) => setField('city', e.target.value)} onBlur={() => touch('city')}
          aria-invalid={!!errorFor('city')} aria-describedby={describe('city')} required
        />
        <FieldError id={id('city-err')} message={errorFor('city')} />
      </div>

      {/* Honeypot: hidden from people, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label>Company<input tabIndex={-1} autoComplete="off" name="company" value={values.company} onChange={(e) => setField('company', e.target.value)} /></label>
      </div>

      <Button type="submit" variant="whatsapp" size="lg" className="w-full">
        <WhatsAppIcon size={19} /> {submitLabel}
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button as="a" href={telHref} variant="outline" size="sm">
          <Phone size={15} aria-hidden="true" /> Call instead
        </Button>
        <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="outline" size="sm">
          <WhatsAppIcon size={15} /> Chat on WhatsApp
        </Button>
      </div>
      <p className="flex items-start justify-center gap-1.5 text-center text-xs text-muted">
        <Lock size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          Submitting opens WhatsApp with your details. Your enquiry is sent when you tap Send.{' '}
          <a href={SITE.privacyPath} target="_blank" rel="noopener" className="underline underline-offset-2">Privacy Policy</a>
        </span>
      </p>
    </form>
  );
}
