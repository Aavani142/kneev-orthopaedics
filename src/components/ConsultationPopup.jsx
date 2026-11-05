import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLeadModal } from './LeadModalContext.jsx';
import LeadForm from './LeadForm.jsx';
import consultRoom from '../assets/img/hero-portrait-600.webp';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

function Dialog({ modal, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const root = document.getElementById('root');
    root?.setAttribute('inert', '');
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    // Auto popup: focus the dialog (no surprise keyboard on phones).
    // Opened from a button: focus the first field.
    requestAnimationFrame(() => {
      if (modal.auto) panelRef.current?.focus();
      else panelRef.current?.querySelector('input:not([type="hidden"])')?.focus();
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        const items = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      root?.removeAttribute('inert');
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [modal.auto, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-5" data-track-section="popup">
      <div className="animate-fade-in absolute inset-0 bg-forest-deep/70" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        aria-describedby="lead-modal-desc"
        tabIndex={-1}
        className="animate-modal-in relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-xl bg-white shadow-soft outline-none sm:max-h-[92dvh] sm:max-w-[30rem] sm:rounded-xl md:max-w-[54rem]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal transition-colors hover:bg-ivory"
          aria-label="Close consultation form"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto overscroll-contain md:grid-cols-[0.82fr_1.18fr]">
          {/* Desktop: photograph + short message */}
          <aside className="relative hidden overflow-hidden bg-forest-deep md:block">
            <img src={consultRoom} alt="" className="absolute inset-0 h-full w-full object-cover object-[60%_center]" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-forest-deep/0" />
            <div className="relative flex h-full flex-col justify-end p-7 text-white">
              <p className="kicker kicker-light">KNEEV Orthopaedic Center</p>
              <p className="mt-3 font-heading text-xl leading-snug font-semibold">
                Every consultation is personally conducted by the treating surgeon.
              </p>
              <p className="mt-3 text-sm text-white/75">Jayanagar, Bengaluru · Monday – Saturday, 9 AM – 7 PM</p>
            </div>
          </aside>

          <div className="p-5 pt-6 sm:p-8">
            <div className="pr-10">
              <h2 id="lead-modal-title" className="text-[1.45rem] leading-tight font-bold sm:text-[1.7rem]">
                Book Your Orthopaedic Consultation
              </h2>
              <p id="lead-modal-desc" className="mt-2 text-[0.95rem] text-muted">
                Tell us a little about your concern. Our team will help you with the next steps.
              </p>
            </div>
            <div className="mt-6">
              <LeadForm source={modal.source} defaultTreatment={modal.treatment} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsultationPopup() {
  const { modal, closeLeadModal } = useLeadModal();
  if (!modal.open) return null;
  return createPortal(<Dialog key={modal.key} modal={modal} onClose={closeLeadModal} />, document.body);
}
