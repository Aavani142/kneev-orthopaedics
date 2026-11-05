import { useLeadModal } from './LeadModalContext.jsx';
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
    <section id="journey" aria-labelledby="journey-title" data-track-section="journey" className="bg-sage py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionIntro id="journey-title" kicker="Your Journey" title="What Happens After You Contact KNEEV" />
          <Button data-cta="consultation" variant="outline" className="self-start lg:self-auto" onClick={() => openLeadModal({ source: 'journey' })}>
            Start with an enquiry
          </Button>
        </div>

        <ol className="reveal relative mt-12 grid gap-0 lg:mt-16 lg:grid-cols-5 lg:gap-6">
          {/* connecting line (desktop) */}
          <span className="absolute top-5 right-[10%] left-[10%] hidden h-px bg-forest/25 lg:block" aria-hidden="true" />
          {STEPS.map(([t, d], i) => (
            <li key={t} className="relative flex gap-5 pb-8 last:pb-0 lg:flex-col lg:items-center lg:gap-0 lg:pb-0 lg:text-center">
              {/* vertical line (mobile) */}
              {i < STEPS.length - 1 && <span className="absolute top-10 bottom-0 left-5 w-px bg-forest/25 lg:hidden" aria-hidden="true" />}
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-forest bg-sage font-heading text-sm font-bold text-forest">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="lg:mt-5">
                <h3 className="font-heading text-[1.05rem] font-bold">{t}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
