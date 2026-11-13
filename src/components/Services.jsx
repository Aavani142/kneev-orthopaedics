import { m } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLeadModal } from './LeadModalContext.jsx';
import { EASE, Reveal } from './motion.jsx';
import { SectionIntro } from './ui.jsx';

// Services listed on kneevorthopaediccenter.com, ordered for this campaign.
const SERVICES = [
  { title: 'Knee Replacement', text: 'Total, partial and revision knee replacement when arthritis limits daily life.', treatment: 'knee-replacement' },
  { title: 'Robotic Knee Replacement', text: 'Robotic-assisted knee replacement for precise implant positioning, with the surgeon in control throughout.', treatment: 'knee-replacement' },
  { title: 'ACL Injury & Reconstruction', text: 'Assessment of ligament injuries, with reconstruction when clinically appropriate.', treatment: 'acl-reconstruction' },
  { title: 'Knee Pain Consultation', text: 'A thorough evaluation to find the cause of your knee pain and the right next step.', treatment: 'knee-pain' },
  { title: 'Sports Knee Injuries', text: 'Meniscus and ligament injuries, with rehabilitation tailored to your sport and goals.', treatment: 'acl-reconstruction' },
  { title: 'Second Opinion', text: 'Already advised surgery? We review your reports and talk through your options.', treatment: 'not-sure' },
  { title: 'Physiotherapy & Rehabilitation', text: 'In-house rehabilitation with structured, goal-based progression.', treatment: 'knee-pain' },
];

export default function Services() {
  const { openLeadModal } = useLeadModal();
  return (
    <section id="services" aria-labelledby="services-title" data-track-section="services" className="bg-ivory pt-20 pb-14 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-16">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionIntro id="services-title" kicker="How we can help" title="What brings you to *Kneev* today?" />
            <Reveal as="p" delay={0.2} className="mt-6 max-w-sm text-muted">
              Choose your concern to learn more, or send an enquiry and our team will guide you to the right assessment.
            </Reveal>
          </div>
        </div>

        <ol className="border-t border-line lg:col-span-8">
          {SERVICES.map((s, i) => (
            <m.li
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }}
              className="group relative border-b border-line"
            >
              {/* hover wash */}
              <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
              <div className="relative grid cursor-pointer gap-3 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:gap-6 sm:px-4 lg:py-8">
                <span className="font-serif text-xl text-ember-ink">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-serif text-[1.4rem] leading-tight font-bold transition-transform duration-500 group-hover:translate-x-1.5 sm:text-[1.6rem]">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 max-w-lg text-[0.97rem] text-muted">{s.text}</p>
                </div>
                {/* The button's ::after stretches over the whole row, so clicking anywhere on the box opens the enquiry popup. */}
                <button
                  type="button"
                  data-cta="consultation"
                  onClick={() => openLeadModal({ source: `service-${s.treatment}`, treatment: s.treatment })}
                  aria-label={`Enquire about ${s.title}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-forest/25 text-forest transition-colors duration-300 after:absolute after:inset-0 after:content-[''] group-hover:border-forest group-hover:bg-forest group-hover:text-white"
                >
                  <ArrowUpRight size={19} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </div>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
