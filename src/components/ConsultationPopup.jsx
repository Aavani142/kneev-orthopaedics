import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { EASE } from './motion.jsx';
import { X } from 'lucide-react';
import { useLeadModal } from './LeadModalContext.jsx';
import LeadForm from './LeadForm.jsx';
import avatar from '../assets/img/doctor-portrait.webp';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5" data-track-section="popup">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 bg-forest-night/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <m.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.55, ease: EASE }}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        aria-describedby="lead-modal-desc"
        tabIndex={-1}
        className="relative flex max-h-[min(90dvh,860px)] w-full max-w-[34rem] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-24px_rgb(16_58_47/0.55)] outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-charcoal transition-colors hover:bg-sage"
          aria-label="Close consultation form"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-6 sm:px-8 sm:pt-7 sm:pb-8">
          <div className="flex items-center gap-3 pr-12">
            <img src={avatar} alt="" width="44" height="44" className="h-11 w-11 shrink-0 rounded-full object-cover object-[50%_18%]" />
            <p className="text-sm leading-snug text-muted">
              <span className="block font-heading font-bold text-forest-deep">Kneev Orthopaedic Center</span>
              Jayanagar, Bengaluru · Mon–Sat, 10 AM–7:30 PM
            </p>
          </div>
          <h2 id="lead-modal-title" className="mt-5 text-[1.6rem] leading-[1.15] font-bold sm:text-[1.9rem]">
            Book Your Orthopaedic Consultation
          </h2>
          <p id="lead-modal-desc" className="mt-2 text-[0.95rem] text-muted">
            Share your details and send them to our team on WhatsApp. We will help you with the next steps.
          </p>
          <div className="mt-5">
            <LeadForm source={modal.source} defaultTreatment={modal.treatment} />
          </div>
        </div>
      </m.div>
    </div>
  );
}

export default function ConsultationPopup() {
  const { modal, closeLeadModal } = useLeadModal();
  return createPortal(
    <AnimatePresence>{modal.open && <Dialog key={modal.key} modal={modal} onClose={closeLeadModal} />}</AnimatePresence>,
    document.body,
  );
}
