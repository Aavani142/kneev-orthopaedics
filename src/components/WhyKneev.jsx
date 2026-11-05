import consultationRoom from '../assets/img/consultation-room.webp';
import { SectionIntro } from './ui.jsx';

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
    <section id="why-kneev" aria-labelledby="why-title" data-track-section="why-kneev" className="bg-ivory py-16 sm:py-20 lg:py-28">
      <div className="container-page">
        <div className="reveal grid items-end gap-8 lg:grid-cols-12">
          <SectionIntro
            id="why-title"
            className="lg:col-span-7"
            kicker="Why KNEEV"
            title="Orthopaedic Care Guided by Clinical Judgement"
          />
          <p className="lede lg:col-span-5">
            At KNEEV, surgery is the last resort, not the first option. Every decision follows a clear clinical sequence.
          </p>
        </div>

        {/* Philosophy flow */}
        <ol className="reveal mt-12 grid border-y border-forest/20 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4" aria-label="The KNEEV approach">
          {FLOW.map((step, i) => (
            <li key={step} className={`flex items-center gap-4 py-5 sm:py-7 lg:px-6 lg:first:pl-0 ${i > 0 ? 'border-t border-forest/20 sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:border-l sm:border-forest/20 sm:pl-6' : ''} ${i === 2 ? 'sm:border-t sm:border-forest/20 lg:border-t-0 lg:border-l' : ''} ${i === 3 ? 'sm:border-t lg:border-t-0' : ''}`}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${i === 3 ? 'bg-ember text-forest-deep' : 'bg-forest text-white'}`}>
                {i + 1}
              </span>
              <span className="font-heading font-bold text-forest-deep">{step}</span>
            </li>
          ))}
        </ol>

        <div className="reveal mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <figure className="lg:col-span-5">
            <img
              src={consultationRoom}
              alt="Consultation room at KNEEV Orthopaedic Center"
              width="1000"
              height="562"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover object-left"
            />
            <figcaption className="mt-3 text-sm text-muted">The consultation room at KNEEV, Jayanagar.</figcaption>
          </figure>
          <dl className="lg:col-span-7">
            {PILLARS.map(([t, d], i) => (
              <div key={t} className="grid gap-1 border-b border-line py-6 first:pt-0 sm:grid-cols-[3.25rem_1fr]">
                <span className="font-heading text-sm font-bold text-ember-ink">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <dt className="text-lg font-bold text-forest-deep font-heading">{t}</dt>
                  <dd className="mt-1.5 leading-relaxed text-muted">{d}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
