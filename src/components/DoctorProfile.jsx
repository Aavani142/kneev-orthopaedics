import { DOCTOR } from '../content/doctor.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { Button, DevNote } from './ui.jsx';

export default function DoctorProfile() {
  const { openLeadModal } = useLeadModal();
  return (
    <section id="doctor" aria-labelledby="doctor-title" data-track-section="doctor" className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-7">
          <p className="kicker">About the Doctor</p>
          <h2 id="doctor-title" className="h-section mt-4">Clinical Expertise. Individual Attention.</h2>

          <div className="mt-10 border-t border-line pt-8">
            <h3 className="text-2xl font-bold sm:text-[1.75rem]">{DOCTOR.name}</h3>
            <p className="mt-1 font-heading font-semibold text-forest">{DOCTOR.title}</p>
            <p className="mt-3 text-muted">{DOCTOR.qualifications.join(' · ')}</p>
            {DOCTOR.experience && <p className="mt-2 text-charcoal">{DOCTOR.experience}</p>}
            {DOCTOR.affiliations?.length > 0 && <p className="mt-2 text-muted">{DOCTOR.affiliations.join('; ')}</p>}
            <DevNote>
              Years of experience and hospital affiliations are hidden because the clinic website states them differently on
              different pages. Confirm with the clinic and set them in src/content/doctor.js.
            </DevNote>
          </div>

          <div className="prose-body mt-8 text-[1.02rem] leading-relaxed text-charcoal/85">
            {DOCTOR.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-heading text-sm font-bold tracking-[0.12em] text-grey uppercase">Areas of clinical focus</h4>
              <ul className="list-square mt-4 space-y-2 text-charcoal/90">
                {DOCTOR.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold tracking-[0.12em] text-grey uppercase">Clinical philosophy</h4>
              <blockquote className="mt-4 border-l-2 border-ember pl-4 font-heading text-[1.05rem] leading-relaxed font-semibold text-forest-deep">
                {DOCTOR.philosophy}
              </blockquote>
            </div>
          </div>

          <Button data-cta="consultation" size="lg" className="mt-10" onClick={() => openLeadModal({ source: 'doctor' })}>
            Book a Consultation
          </Button>
        </div>

        <figure className="reveal lg:col-span-5">
          <img
            src={DOCTOR.photo}
            alt={DOCTOR.photoAlt}
            width="640"
            height="747"
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover object-top lg:sticky lg:top-24"
          />
        </figure>
      </div>
    </section>
  );
}
