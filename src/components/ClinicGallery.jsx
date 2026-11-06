import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { GALLERY } from '../content/gallery.js';
import { ImageReveal, Reveal } from './motion.jsx';
import { SectionIntro } from './ui.jsx';

function Shot({ g, className, aspect }) {
  return (
    <figure className={className}>
      <ImageReveal src={g.src} alt={g.alt} width={g.w} height={g.h} className={`${aspect} w-full`} parallax={5} />
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm text-muted">
        <span>{g.caption}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </figcaption>
    </figure>
  );
}

export default function ClinicGallery() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Columns drift at slightly different speeds on desktop.
  const slow = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);
  const fast = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const [a, b, c, d, e, f] = GALLERY;

  return (
    <section ref={ref} id="clinic" aria-labelledby="clinic-title" data-track-section="gallery" className="overflow-hidden bg-white py-20 sm:py-24 lg:pt-28 lg:pb-20">
      <div className="container-page">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <SectionIntro id="clinic-title" className="lg:col-span-8" kicker="Inside KNEEV" title="A clinic built for *orthopaedic care*" />
          <Reveal as="p" delay={0.15} className="max-w-sm text-muted lg:col-span-4">
            Photographs of our centre on 14th Cross Road, 2nd Block, Jayanagar.
          </Reveal>
        </div>

        {/* Desktop: three asymmetric columns with parallax */}
        <div className="mt-16 hidden gap-8 lg:grid lg:grid-cols-12">
          <m.div style={{ y: reduce ? 0 : slow }} className="col-span-5 space-y-8">
            <Shot g={a} aspect="aspect-[4/5]" />
            <Shot g={d} aspect="aspect-[4/3]" />
          </m.div>
          <m.div style={{ y: reduce ? 0 : fast }} className="col-span-4 space-y-8 pt-24">
            <Shot g={b} aspect="aspect-[3/4]" />
            <Shot g={e} aspect="aspect-square" />
          </m.div>
          <m.div style={{ y: reduce ? 0 : slow }} className="col-span-3 space-y-8 pt-8">
            <Shot g={c} aspect="aspect-[3/4]" />
            <Shot g={f} aspect="aspect-[4/5]" />
          </m.div>
        </div>
      </div>

      {/* Mobile/tablet: horizontal scroll */}
      <ul className="container-page mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] lg:hidden">
        {GALLERY.map((g) => (
          <li key={g.caption} className="w-[78%] shrink-0 snap-start sm:w-[45%]">
            <Shot g={g} aspect="aspect-[4/5]" />
          </li>
        ))}
      </ul>
    </section>
  );
}
