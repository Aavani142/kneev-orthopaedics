import { DrawLine, Reveal, ScrollWords, Stagger, StaggerItem } from './motion.jsx';

const FLOW = ['Evaluate', 'Plan', 'Rehabilitate', 'Surgery when clinically indicated'];

export default function WhyKneev() {
  return (
    <section id="why-kneev" aria-labelledby="why-title" data-track-section="why-kneev" className="bg-ivory py-20 sm:py-24 lg:py-28">
      <div className="container-page">
        <Reveal as="p" className="kicker">
          Why Kneev
        </Reveal>
        <h2 id="why-title" className="sr-only">
          Orthopaedic Care Guided by Clinical Judgement
        </h2>
        <Reveal as="p" delay={0.05} className="mt-6 font-serif text-lg text-forest sm:text-xl">
          Orthopaedic care guided by clinical judgement.
        </Reveal>

        {/* Statement that lights up word by word while scrolling */}
        <ScrollWords
          text="At Kneev, surgery is the last resort, not the first option. Every decision follows a clear clinical sequence, explained to you at every step."
          className="mt-8 max-w-5xl font-serif text-[1.7rem] leading-[1.18] text-forest-deep sm:text-[2.4rem] lg:text-[3rem]"
        />

        {/* Clinical sequence */}
        <div className="relative mt-16 lg:mt-20">
          <DrawLine className="absolute top-5 right-0 left-0 hidden h-px text-forest/30 lg:block" />
          <Stagger as="ol" gap={0.14} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="The Kneev approach">
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
      </div>
    </section>
  );
}
