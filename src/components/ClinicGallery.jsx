import { GALLERY } from '../content/gallery.js';
import { SectionIntro } from './ui.jsx';

// Desktop: one wide image beside two stacked, then a row of three.
const LAYOUT = [
  'lg:col-span-7 lg:row-span-2',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
];

export default function ClinicGallery() {
  return (
    <section id="clinic" aria-labelledby="clinic-title" data-track-section="gallery" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <div className="reveal flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <SectionIntro id="clinic-title" kicker="Inside KNEEV" title="The Clinic" />
          <p className="max-w-sm text-muted">Photographs of our centre in 2nd Block, Jayanagar.</p>
        </div>
      </div>
      <ul className="reveal container-page mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:auto-rows-[220px] lg:grid-cols-12 lg:gap-4 lg:overflow-visible lg:pb-0">
        {GALLERY.map((g, i) => (
          <li key={g.caption} className={`w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-auto ${LAYOUT[i]}`}>
            <figure className="h-full">
              <img
                src={g.src}
                alt={g.alt}
                width={g.w}
                height={g.h}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] h-auto w-full object-cover lg:aspect-auto lg:h-[calc(100%-2rem)]"
              />
              <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
