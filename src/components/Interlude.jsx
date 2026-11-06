import { Phone } from 'lucide-react';
import { telHref, whatsappHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { Reveal, SplitHeading } from './motion.jsx';
import { Button, WhatsAppIcon } from './ui.jsx';

/** Full-width conversion strip placed between chapters. */
export default function Interlude({ title, text, source, tone = 'stone' }) {
  const { openLeadModal } = useLeadModal();
  const dark = tone === 'dark';
  return (
    <aside data-track-section={source} className={`${dark ? 'on-dark bg-forest text-white' : 'bg-stone'} py-14 sm:py-16`}>
      <div className="container-page grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SplitHeading as="p" text={title} className={`font-serif text-[1.7rem] leading-[1.15] sm:text-[2.4rem] ${dark ? 'text-white' : 'text-forest-deep'}`} />
          <Reveal as="p" delay={0.15} className={`mt-4 max-w-xl ${dark ? 'text-white/70' : 'text-muted'}`}>
            {text}
          </Reveal>
        </div>
        <Reveal delay={0.2} className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          <Button data-cta="consultation" variant="accent" arrow onClick={() => openLeadModal({ source })}>
            Book a Consultation
          </Button>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Button as="a" href={telHref} variant={dark ? 'outlineLight' : 'outline'}>
              <Phone size={16} aria-hidden="true" /> Call
            </Button>
            <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="whatsapp">
              <WhatsAppIcon size={17} /> WhatsApp
            </Button>
          </div>
        </Reveal>
      </div>
    </aside>
  );
}
