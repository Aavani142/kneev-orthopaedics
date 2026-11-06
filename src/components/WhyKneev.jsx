import consultationRoom from '../assets/img/consultation-room.webp';
import { DrawLine, ImageReveal, Reveal, ScrollWords, Stagger, StaggerItem } from './motion.jsx';

const FLOW = ['Evaluate', 'Plan', 'Rehabilitate', 'Surgery when clinically indicated'];

const PILLARS = [
  ['Conservative-first philosophy', 'Non-surgical options are considered before surgical intervention whenever clinically appropriate.'],
  ['Evidence-based evaluation', 'Treatment decisions are guided by your symptoms, physical examination, imaging and functional assessment.'],
  ['Integrated rehabilitation', 'Physiotherapy and rehabilitation are part of the treatment journey, with care delivered at the clinic.'],
  ['Transparent communication', 'You receive a clear explanation of your condition, your options and the next steps.'],
  ['Individualised treatment', 'No two patients have identical needs. Plans reflect your clinical findings and your functional goals.'],
];

export default function WhyKneev() {
  return (
    <section id="why-kneev" aria-labelledby="why-title" data-track-section="why-kneev" className="bg-ivory py-20 sm:py-24 lg:py-32">
      <div className="container-page">
        <Reveal as="p" className="kicker">
          Why KNEEV
        </Reveal>
        <h2 id="why-title" className="sr-only">
          Orthopaedic Care Guided by Clinical Judgement
        </h2>
        <Reveal as="p" delay={0.05} className="mt-6 font-serif text-lg text-forest sm:text-xl">
          Orthopaedic care guided by clinical judgement.
        </Reveal>

        {/* Statement that lights up word by word while scrolling */}
        <ScrollWords
          text="At KNEEV, surgery is the last resort, not the first option. Every decision follows a clear clinical sequence, explained to you at every step."
          className="mt-8 max-w-5xl font-serif text-[1.7rem] leading-[1.18] text-forest-deep sm:text-[2.4rem] lg:text-[3rem]"
        />

        {/* Clinical sequence */}
        <div className="relative mt-16 lg:mt-24">
          <DrawLine className="absolute top-5 right-0 left-0 hidden h-px text-forest/30 lg:block" />
          <Stagger as="ol" gap={0.14} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="The KNEEV approach">
            {FLOW.map((step, i) => (
              <StaggerItem as="li" key={step} className="relative flex items-center gap-4 lg:flex-col lg:items-start">
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-lg ${
                    i === 3 ? 'bg-ember text-forest-night' : 'bg-forest text-white'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-serif text-[1.25rem] leading-tight text-forest-deep lg:mt-5">{step}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="mt-20 grid items-start gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <figure className="lg:sticky lg:top-28 lg:col-span-5">
            <ImageReveal
              src={consultationRoom}
              alt="Consultation room at KNEEV Orthopaedic Center"
              width={1000}
              height={562}
              className="aspect-[4/5] w-full"
              imgClassName="object-[18%_center]"
            />
            <figcaption className="mt-3 text-sm text-muted">The consultation room at KNEEV, Jayanagar.</figcaption>
          </figure>
          <Stagger as="dl" gap={0.09} className="border-t border-line lg:col-span-7">
            {PILLARS.map(([t, d], i) => (
              <StaggerItem key={t} className="grid gap-2 border-b border-line py-8 sm:grid-cols-[4rem_1fr]">
                <span className="font-serif text-xl text-ember-ink">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <dt className="font-serif text-[1.4rem] leading-tight text-forest-deep">{t}</dt>
                  <dd className="mt-2 max-w-xl leading-relaxed text-muted">{d}</dd>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
