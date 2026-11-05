import { Activity, ClipboardList, MapPin, Phone, Stethoscope, Footprints } from 'lucide-react';
import portrait from '../assets/img/hero-portrait.webp';
import portraitSm from '../assets/img/hero-portrait-600.webp';
import { telHref } from '../config/site.js';
import { DOCTOR } from '../content/doctor.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { Button } from './ui.jsx';

const TRUST = [
  { icon: Stethoscope, label: 'Orthopaedic consultation' },
  { icon: Footprints, label: 'Knee and joint care' },
  { icon: ClipboardList, label: 'Individualised treatment planning' },
  { icon: Activity, label: 'Rehabilitation support' },
];

export default function Hero() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <section id="top" data-track-section="hero" className="bg-ivory">
        <div className="container-page grid items-center gap-10 pt-8 pb-12 sm:pt-12 lg:grid-cols-12 lg:gap-14 lg:pt-14 lg:pb-20">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-2 font-heading text-[0.8rem] font-bold tracking-[0.14em] text-forest uppercase">
              <MapPin size={15} className="text-ember-ink" aria-hidden="true" />
              Jayanagar, Bengaluru
            </p>

            <h1 className="mt-5 text-[clamp(2.05rem,1.35rem+2.7vw,3.3rem)] leading-[1.08] font-bold tracking-[-0.025em]">
              Expert Orthopaedic Care for Your Next Step Forward.
            </h1>
            <p className="mt-5 font-heading text-[clamp(1.08rem,1rem+0.4vw,1.3rem)] leading-snug font-semibold text-forest">
              Knee Replacement &amp; ACL Reconstruction in Jayanagar, Bengaluru.
            </p>
            <p className="lede mt-4 max-w-[34rem]">
              From persistent knee pain to complex ligament injuries, receive a thorough orthopaedic evaluation and
              understand the treatment options appropriate for your condition.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button data-cta="consultation" variant="accent" size="lg" onClick={() => openLeadModal({ source: 'hero' })}>
                Book an Orthopaedic Consultation
              </Button>
              <Button as="a" href={telHref} variant="outline" size="lg">
                <Phone size={18} aria-hidden="true" /> Speak to Our Team
              </Button>
            </div>

            <dl className="mt-10 grid max-w-[34rem] grid-cols-1 gap-5 border-t border-line pt-6 text-sm min-[430px]:grid-cols-2">
              <div>
                <dt className="font-heading text-xs font-bold tracking-[0.12em] text-grey uppercase">Consultation with</dt>
                <dd className="mt-1.5 font-semibold text-charcoal">{DOCTOR.name}</dd>
                <dd className="text-muted">{DOCTOR.qualifications.slice(0, 2).join(', ')} · Fellowship-trained</dd>
              </div>
              <div>
                <dt className="font-heading text-xs font-bold tracking-[0.12em] text-grey uppercase">Clinic hours</dt>
                <dd className="mt-1.5 font-semibold text-charcoal">Mon – Sat, 9:00 AM – 7:00 PM</dd>
                <dd className="text-muted">Sunday by appointment</dd>
              </div>
            </dl>
          </div>

          <figure className="lg:col-span-6">
            <img
              src={portrait}
              srcSet={`${portraitSm} 600w, ${portrait} 960w`}
              sizes="(min-width: 1024px) 45vw, 100vw"
              width="960"
              height="1066"
              fetchPriority="high"
              alt="Dr. Amith P. Shetty, orthopaedic surgeon, at the reception of KNEEV Orthopaedic Center in Jayanagar"
              className="aspect-[5/4] w-full rounded-t-lg object-cover object-[50%_22%] sm:aspect-[4/3] lg:aspect-[9/10]"
            />
            <figcaption className="flex items-center justify-between gap-4 rounded-b-lg border border-t-0 border-line bg-white px-5 py-4">
              <span>
                <span className="block font-heading font-bold text-forest-deep">{DOCTOR.name}</span>
                <span className="text-sm text-muted">{DOCTOR.title}</span>
              </span>
              <a href="#doctor" className="shrink-0 font-heading text-sm font-semibold text-forest underline-offset-4 hover:underline">
                Profile
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="What we offer" className="border-y border-line bg-white">
        <ul className="container-page grid grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, label }, i) => (
            <li
              key={label}
              className={`flex items-center gap-3 py-5 pr-3 text-[0.9rem] leading-snug font-medium text-charcoal sm:py-6 ${
                i % 2 ? 'pl-4 sm:pl-6' : ''
              } ${i % 2 === 0 && i > 0 ? 'lg:pl-6' : ''} ${i > 0 ? 'lg:border-l lg:border-line' : ''} ${
                i % 2 ? 'border-l border-line' : ''
              } ${i < 2 ? 'border-b border-line lg:border-b-0' : ''}`}
            >
              <Icon size={20} className="shrink-0 text-forest" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
