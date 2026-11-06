import { REVIEWS_URL, TESTIMONIALS } from '../content/testimonials.js';
import { Stagger, StaggerItem } from './motion.jsx';
import { SectionIntro } from './ui.jsx';

// Not rendered until genuine, patient-approved testimonials are added in src/content/testimonials.js
export default function Testimonials() {
  if (!TESTIMONIALS.length) return null;
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" data-track-section="testimonials" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-page">
        <SectionIntro id="testimonials-title" kicker="Patient feedback" title="In our *patients’ words*" />
        <Stagger as="ul" gap={0.1} className="mt-14 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <StaggerItem as="li" key={t.name + t.quote.slice(0, 20)} className="border-t border-forest/20 py-8">
              <blockquote className="font-serif text-[1.15rem] leading-snug text-forest-deep">“{t.quote}”</blockquote>
              <p className="mt-5 font-semibold text-forest-deep">{t.name}</p>
              {(t.detail || t.source) && <p className="text-sm text-muted">{[t.detail, t.source].filter(Boolean).join(' · ')}</p>}
            </StaggerItem>
          ))}
        </Stagger>
        {REVIEWS_URL && (
          <a href={REVIEWS_URL} target="_blank" rel="noopener" className="link-line mt-6 inline-block font-semibold text-forest">
            Read reviews on Google
          </a>
        )}
      </div>
    </section>
  );
}
