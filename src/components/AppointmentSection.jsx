import { Phone } from 'lucide-react';
import { SITE, telHref, whatsappHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import LeadForm from './LeadForm.jsx';
import { Reveal, SplitHeading, Stagger, StaggerItem } from './motion.jsx';
import { Button, WhatsAppIcon } from './ui.jsx';

const NEXT = [
  'Our team calls you back during clinic hours.',
  'We arrange a consultation slot that suits you.',
  'Your knee is assessed and your options explained clearly.',
];

/**
 * Enquiry section directly above the footer.
 * Uses the SAME <LeadForm> as the popup: identical fields, validation, submission and backend.
 */
export default function AppointmentSection() {
  const { markEngaged } = useLeadModal();
  return (
    <section id="book" aria-labelledby="book-title" data-track-section="appointment-form" className="on-dark relative overflow-hidden bg-forest-night text-white">
      <div className="container-page grid items-center gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-6">
          <Reveal as="p" className="kicker kicker-light">
            Book a Consultation
          </Reveal>
          <SplitHeading as="h2" id="book-title" text="Get clarity on your *knee condition.*" className="display mt-6 !text-white" />
          <Reveal as="p" delay={0.2} className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-white/70">
            Whether you are experiencing persistent knee pain, considering knee replacement or dealing with an ACL injury, an
            orthopaedic consultation can help you understand the next steps.
          </Reveal>

          <Stagger as="ol" gap={0.1} className="mt-10 border-t border-white/12">
            {NEXT.map((t, i) => (
              <StaggerItem as="li" key={t} className="flex items-baseline gap-5 border-b border-white/12 py-4 text-white/85">
                <span className="font-serif text-xl text-ember-light">0{i + 1}</span>
                {t}
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-10">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-white/50 uppercase">Prefer to talk now?</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href={telHref} variant="light" size="lg">
                <Phone size={17} aria-hidden="true" /> {SITE.phoneDisplay}
              </Button>
              <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="whatsapp" size="lg">
                <WhatsAppIcon size={19} /> WhatsApp Us
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-6 lg:pl-6">
          <div className="bg-white p-6 text-charcoal shadow-[0_40px_80px_-40px_rgb(0_0_0/0.7)] sm:p-10 lg:sticky lg:top-28">
            <h3 className="font-serif text-[1.6rem] leading-tight font-bold">Request a callback</h3>
            <p className="mt-2 text-[0.95rem] text-muted">Share a few details and the KNEEV team will contact you.</p>
            <div className="mt-8">
              <LeadForm source="appointment-section" onEngaged={markEngaged} submitLabel="Submit Enquiry" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
