import { useLeadModal } from './LeadModalContext.jsx';
import { DrawLine, Reveal, Stagger, StaggerItem } from './motion.jsx';
import { Button, SectionIntro } from './ui.jsx';

const STEPS = [
  ['Initial Enquiry', 'You contact the clinic or request an appointment. Our team helps you choose a convenient time.'],
  ['Orthopaedic Consultation', 'The doctor understands your symptoms, medical history and functional limitations.'],
  ['Clinical Assessment', 'Physical examination, with imaging reviewed where indicated. Bring any previous reports or scans.'],
  ['Treatment Planning', 'Appropriate options are explained — conservative management, rehabilitation or surgical evaluation.'],
  ['Treatment & Follow-up', 'Treatment follows the agreed clinical plan, with monitoring and rehabilitation along the way.'],
];

export default function PatientJourney() {
  const { openLeadModal } = useLeadModal();
  return (
    <section id="journey" aria-labelledby="journey-title" data-track-section="journey" className="on-dark bg-forest-deep py-20 text-white sm:py-24 lg:py-32">
      <div className="container-page">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <SectionIntro id="journey-title" light className="lg:col-span-8" kicker="Your journey" title="What happens after *you contact KNEEV*" />
          <Reveal delay={0.2} className="lg:col-span-4 lg:text-right">
            <Button data-cta="consultation" variant="accent" arrow onClick={() => openLeadModal({ source: 'journey' })}>
              Start with an enquiry
            </Button>
          </Reveal>
        </div>

        <div className="relative mt-16 lg:mt-24">
          <DrawLine className="absolute top-6 right-0 left-0 hidden h-px text-white/25 lg:block" />
          <Stagger as="ol" gap={0.12} className="grid lg:grid-cols-5 lg:gap-8">
            {STEPS.map(([t, d], i) => (
              <StaggerItem as="li" key={t} className="relative flex gap-6 border-l border-white/15 pb-10 pl-6 last:pb-0 lg:block lg:border-l-0 lg:pb-0 lg:pl-0">
                <span className="relative z-10 -ml-[2.05rem] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-forest-deep font-serif text-xl text-ember-light lg:ml-0">
                  {i + 1}
                </span>
                <div className="lg:mt-8">
                  <h3 className="font-serif text-[1.2rem] leading-tight font-bold !text-white">{t}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">{d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
