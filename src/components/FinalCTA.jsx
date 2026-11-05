import { Phone } from 'lucide-react';
import team from '../assets/img/team.webp';
import { telHref, whatsappHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { Button, WhatsAppIcon } from './ui.jsx';

export default function FinalCTA() {
  const { openLeadModal } = useLeadModal();
  return (
    <section aria-labelledby="final-title" data-track-section="final-cta" className="grid bg-forest lg:grid-cols-2">
      <img
        src={team}
        alt="Dr. Amith P. Shetty with the KNEEV clinical team"
        width="1000"
        height="667"
        loading="lazy"
        decoding="async"
        className="aspect-[3/2] h-full w-full object-cover lg:aspect-auto"
      />
      <div className="flex items-center px-[1.125rem] py-14 sm:px-10 lg:px-16 lg:py-24 xl:px-20">
        <div className="reveal max-w-xl text-white">
          <p className="kicker kicker-light">Book a Consultation</p>
          <h2 id="final-title" className="h-section mt-4 !text-white">Get Clarity on Your Knee Condition.</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-white/80">
            Whether you are experiencing persistent knee pain, considering knee replacement or dealing with an ACL injury,
            an orthopaedic consultation can help you understand the next steps.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button data-cta="consultation" variant="accent" size="lg" onClick={() => openLeadModal({ source: 'final-cta' })}>
              Request a Consultation
            </Button>
            <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="light" size="lg">
              <WhatsAppIcon /> WhatsApp the Clinic
            </Button>
            <Button as="a" href={telHref} variant="outlineLight" size="lg">
              <Phone size={18} aria-hidden="true" /> Call Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
