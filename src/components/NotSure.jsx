import { ArrowDown } from 'lucide-react';
import { Reveal } from './motion.jsx';

/** Compact prompt between "How we can help" and the enquiry form. */
export default function NotSure() {
  const toForm = (e) => {
    const target = document.getElementById('book');
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // Move focus to the first field once the scroll settles, without jumping.
    setTimeout(() => target.querySelector('form input')?.focus({ preventScroll: true }), reduce ? 0 : 700);
  };

  return (
    <aside aria-labelledby="not-sure-title" data-track-section="not-sure" className="bg-ivory pb-16 sm:pb-20">
      <div className="container-page">
        <Reveal className="flex flex-col gap-5 rounded-2xl border border-forest/15 bg-sage px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10">
          <div className="max-w-2xl">
            <h2 id="not-sure-title" className="font-serif text-[1.35rem] leading-tight sm:text-[1.6rem]">
              Not sure which treatment is right for you?
            </h2>
            <p className="mt-2 text-[0.97rem] text-muted">
              Our team can help you understand your options and guide you towards the right consultation.
            </p>
          </div>
          <a
            href="#book"
            onClick={toForm}
            data-cta="consultation"
            className="group/btn inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-forest px-6 font-heading text-[0.93rem] font-semibold text-white transition-colors duration-300 hover:bg-forest-deep sm:self-auto"
          >
            Contact Us
            <ArrowDown size={16} aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </aside>
  );
}
