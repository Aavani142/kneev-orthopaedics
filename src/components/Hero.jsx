import { m } from 'framer-motion';
import { Phone } from 'lucide-react';
import portrait from '../assets/img/hero-portrait.webp';
import portraitSm from '../assets/img/hero-portrait-600.webp';
import { telHref, whatsappHref } from '../config/site.js';
import { DOCTOR } from '../content/doctor.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { EASE, ImageReveal, Marquee, SplitHeading } from './motion.jsx';
import { Button, WhatsAppIcon } from './ui.jsx';

// Verified facts from kneevorthopaediccenter.com — no invented statistics.
const FACTS = [
  'Fellowship-trained orthopaedic surgeon',
  'On-site digital X-ray',
  'In-house physiotherapy & rehabilitation',
  'Conservative-first: surgery only when indicated',
];

const TOPICS = ['Knee Replacement', 'ACL Reconstruction', 'Knee Pain', 'Sports Knee Injuries', 'Second Opinions', 'Rehabilitation'];

const up = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

/*
 * Desktop (lg+): the hero is exactly one screen tall (100svh). Type, spacing and the
 * photo scale with viewport HEIGHT as well as width, so everything — headline, copy,
 * buttons, photo and the facts row — fits above the fold on wide-but-short screens too.
 * Very short screens (< 760px tall) drop the secondary WhatsApp link and description.
 */
export default function Hero() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <section
        id="top"
        data-track-section="hero"
        className="relative flex flex-col overflow-hidden bg-[#eef2ec] text-charcoal lg:h-[100svh] lg:min-h-[600px]"
      >
        <div className="container-page relative grid flex-1 items-center gap-12 pt-28 pb-14 sm:pt-32 lg:min-h-0 lg:grid-cols-12 lg:gap-10 lg:pt-[calc(5rem+3vh)] lg:pb-[3vh]">
          {/* Copy */}
          <div className="relative z-10 lg:col-span-7 lg:pr-6">
            <m.p {...up(0.1)} className="kicker">
              Jayanagar, Bengaluru
            </m.p>

            <SplitHeading
              as="h1"
              onLoad
              delay={0.2}
              text="Expert orthopaedic care for your *next step forward.*"
              className="mt-6 font-serif text-[clamp(2.1rem,1.3rem+3.8vw,3.4rem)] leading-[1.08] font-bold tracking-[-0.035em] text-forest-deep lg:mt-[2.4vh] lg:text-[clamp(2.4rem,min(3.9vw,7.2vh),4.4rem)]"
            />

            <m.p {...up(0.75)} className="mt-8 max-w-xl text-lg font-semibold text-forest sm:text-xl lg:mt-[3.2vh] lg:text-[clamp(1.05rem,2.2vh,1.25rem)]">
              Knee Replacement &amp; ACL Reconstruction in Jayanagar, Bengaluru.
            </m.p>
            <m.p
              {...up(0.85)}
              className="mt-3 max-w-xl text-[1.05rem] leading-relaxed text-muted lg:mt-[1.2vh] lg:text-[clamp(0.95rem,1.9vh,1.05rem)] [@media(min-width:1024px)_and_(max-height:700px)]:hidden"
            >
              From persistent knee pain to complex ligament injuries, receive a thorough orthopaedic evaluation and understand
              the treatment options appropriate for your condition.
            </m.p>

            <m.div {...up(0.95)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-[4vh]">
              <Button data-cta="consultation" variant="accent" size="lg" arrow onClick={() => openLeadModal({ source: 'hero' })}>
                Book an Orthopaedic Consultation
              </Button>
              <Button as="a" href={telHref} variant="outline" size="lg">
                <Phone size={17} aria-hidden="true" /> Speak to Our Team
              </Button>
            </m.div>
            <m.a
              {...up(1.05)}
              href={whatsappHref()}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-forest hover:text-forest-deep lg:mt-[2.4vh] [@media(min-width:1024px)_and_(max-height:760px)]:hidden"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon size={17} />
              </span>
              <span className="link-line">Or chat with us on WhatsApp</span>
            </m.a>
          </div>

          {/* Portrait — height-capped on desktop so it always fits the screen */}
          <div className="relative lg:col-span-5 lg:flex lg:h-full lg:max-h-[min(66svh,680px)] lg:items-center">
            <ImageReveal
              priority
              parallax={5}
              src={portrait}
              srcSet={`${portraitSm} 600w, ${portrait} 960w`}
              sizes="(min-width: 1024px) 38vw, 100vw"
              width={960}
              height={1066}
              alt="Dr. Amith P. Shetty, orthopaedic surgeon, at the reception of KNEEV Orthopaedic Center in Jayanagar"
              className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-auto lg:h-full"
              imgClassName="object-[50%_22%]"
            />
            <m.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.1 }}
              className="relative -mt-16 ml-4 w-[min(20rem,calc(100%-2rem))] bg-white p-5 text-charcoal shadow-soft sm:ml-8 lg:absolute lg:bottom-6 lg:-left-16 lg:mt-0 lg:ml-0 lg:p-[clamp(0.9rem,2vh,1.25rem)]"
            >
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.18em] text-forest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" />
                </span>
                Consultations open
              </p>
              <p className="mt-3 font-serif text-xl leading-tight text-forest-deep">{DOCTOR.name}</p>
              <p className="mt-0.5 text-sm text-muted">{DOCTOR.title}</p>
              <p className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                <span>Mon – Sat, 9 AM – 7 PM</span>
                <a href={telHref} className="link-line font-semibold text-forest">Call</a>
              </p>
            </m.div>
          </div>
        </div>

        {/* Verified facts — pinned to the bottom of the hero */}
        <div className="container-page relative shrink-0">
          <ul className="grid grid-cols-2 border-t border-forest/15 lg:grid-cols-4">
            {FACTS.map((f, i) => (
              <m.li
                key={f}
                {...up(1.1 + i * 0.08)}
                className={`py-6 pr-4 text-[0.92rem] leading-snug font-medium text-forest-deep lg:py-[2.2vh] ${i % 2 ? 'border-l border-forest/15 pl-4 lg:pl-6' : ''} ${
                  i === 2 ? 'lg:border-l lg:border-forest/15 lg:pl-6' : ''
                } ${i < 2 ? 'border-b border-forest/15 lg:border-b-0' : ''}`}
              >
                <span className="mb-1.5 block font-serif text-lg text-ember-accent">0{i + 1}</span>
                {f}
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Topic band — sits directly below the one-screen hero */}
      <Marquee items={TOPICS} className="on-dark bg-forest py-5 font-serif text-lg text-white/90 sm:text-xl" />
    </>
  );
}
