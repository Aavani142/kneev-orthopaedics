import { CalendarCheck, Phone } from 'lucide-react';
import { telHref, whatsappHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { WhatsAppIcon } from './ui.jsx';

// Fixed bar on phones. The footer carries matching bottom padding so nothing is hidden behind it.
export default function MobileActionBar() {
  const { openLeadModal } = useLeadModal();
  const item = 'flex flex-col items-center justify-center gap-1 font-heading text-[0.7rem] font-bold tracking-[0.1em] uppercase';
  return (
    <nav
      aria-label="Quick contact"
      data-track-section="mobile-bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(16_58_47/0.4)] md:hidden"
    >
      <div className="grid h-16 grid-cols-[1fr_1fr_1.35fr]">
        <a href={telHref} className={`${item} text-forest`}>
          <Phone size={19} aria-hidden="true" /> Call
        </a>
        <a href={whatsappHref()} target="_blank" rel="noopener" className={`${item} border-l border-line text-forest`}>
          <WhatsAppIcon size={20} /> WhatsApp
        </a>
        <button type="button" data-cta="consultation" onClick={() => openLeadModal({ source: 'mobile-bar' })} className={`${item} bg-forest text-white`}>
          <CalendarCheck size={19} aria-hidden="true" /> Consultation
        </button>
      </div>
    </nav>
  );
}
