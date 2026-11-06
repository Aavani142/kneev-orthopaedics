import { DOCTOR } from '../content/doctor.js';
import credentials from '../assets/img/credentials.webp';
import { useLeadModal } from './LeadModalContext.jsx';
import { ImageReveal, Reveal, SplitHeading, Stagger, StaggerItem } from './motion.jsx';
import { Button } from './ui.jsx';

export default function DoctorProfile() {
  const { openLeadModal } = useLeadModal();
  return (
    <section id="doctor" aria-labelledby="doctor-title" data-track-section="doctor" className="overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-0">
        {/* Asymmetric photo stack */}
        <div className="relative lg:col-span-5">
          <ImageReveal
            src={DOCTOR.photo}
            alt={DOCTOR.photoAlt}
            width={640}
            height={747}
            parallax={6}
            className="aspect-[4/5] w-[88%] lg:w-full"
            imgClassName="object-top"
          />
          <ImageReveal
            src={credentials}
            alt="Framed qualifications and certificates at KNEEV"
            width={1000}
            height={667}
            parallax={0}
            from="left"
            className="absolute right-0 -bottom-10 aspect-[4/3] w-[46%] border-[6px] border-white shadow-soft lg:-right-14 lg:-bottom-12 lg:w-[52%]"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal as="p" className="kicker">
            About the Doctor
          </Reveal>
          <SplitHeading as="h2" id="doctor-title" text="Clinical expertise. *Individual attention.*" className="h-section mt-5" />

          <Reveal className="mt-12 border-t border-line pt-8">
            <h3 className="font-serif text-[1.9rem] leading-tight font-bold sm:text-[2.4rem]">{DOCTOR.name}</h3>
            <p className="mt-3 font-semibold text-forest">{DOCTOR.title}</p>
            <p className="mt-2 text-muted">{DOCTOR.qualifications.join(' · ')}</p>
            {DOCTOR.experience && <p className="mt-2 text-charcoal">{DOCTOR.experience}</p>}
            {DOCTOR.affiliations?.length > 0 && <p className="mt-2 text-muted">{DOCTOR.affiliations.join('; ')}</p>}
          </Reveal>

          <Reveal delay={0.1} className="prose-body mt-8 text-[1.04rem] leading-relaxed text-charcoal/85">
            {DOCTOR.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>

          <Reveal as="blockquote" delay={0.1} className="mt-10 border-l border-ember pl-6 font-serif text-[1.2rem] leading-snug text-forest-deep">
            “{DOCTOR.philosophy}”
          </Reveal>

          <div className="mt-10">
            <p className="kicker">Areas of clinical focus</p>
            <Stagger as="ul" gap={0.05} className="mt-5 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
              {DOCTOR.focus.map((f) => (
                <StaggerItem as="li" key={f} className="border-b border-line py-3 text-charcoal/90">
                  {f}
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal className="mt-10">
            <Button data-cta="consultation" size="lg" arrow onClick={() => openLeadModal({ source: 'doctor' })}>
              Book a Consultation
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
