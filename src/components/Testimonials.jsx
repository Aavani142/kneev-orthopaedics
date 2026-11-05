import { REVIEWS_URL, TESTIMONIALS } from '../content/testimonials.js';
import { SectionIntro } from './ui.jsx';

// Not rendered until genuine, patient-approved testimonials are added in src/content/testimonials.js
export default function Testimonials() {
  if (!TESTIMONIALS.length) return null;
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" data-track-section="testimonials" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <SectionIntro id="testimonials-title" className="reveal" kicker="Patient Feedback" title="In Our Patients’ Words" />
        <ul className="reveal mt-10 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name + t.quote.slice(0, 20)} className="border-t border-forest/20 py-6">
              <blockquote className="leading-relaxed text-charcoal/90">“{t.quote}”</blockquote>
              <p className="mt-4 font-heading font-bold text-forest-deep">{t.name}</p>
              {(t.detail || t.source) && <p className="text-sm text-muted">{[t.detail, t.source].filter(Boolean).join(' · ')}</p>}
            </li>
          ))}
        </ul>
        {REVIEWS_URL && (
          <a href={REVIEWS_URL} target="_blank" rel="noopener" className="mt-6 inline-block font-heading font-semibold text-forest underline underline-offset-4">
            Read reviews on Google
          </a>
        )}
      </div>
    </section>
  );
}
