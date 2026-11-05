import { ArrowRight } from 'lucide-react';
import { whatsappHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { ACLIllustration } from './illustrations.jsx';
import { Button, SectionIntro, WhatsAppIcon } from './ui.jsx';

const CAUSES = [
  'Sudden changes in direction',
  'Pivoting or twisting on a planted foot',
  'Landing incorrectly after a jump',
  'Sports-related injuries, especially in pivoting sports',
  'Sudden deceleration or stopping',
  'Direct trauma to the knee',
];
const SYMPTOMS = [
  'A popping sensation at the time of injury',
  'Rapid swelling, often within hours',
  'A feeling that the knee is unstable or gives way',
  'Difficulty bearing weight',
  'Reduced range of movement',
  'Difficulty returning to sport or physical activity',
];
const DIAGNOSIS = [
  ['Injury history', 'How the injury happened and what you felt at the time.'],
  ['Physical examination', 'Swelling, movement, tenderness and overall knee function.'],
  ['Ligament stability tests', 'Specific clinical tests to check how stable the knee is.'],
  ['MRI when indicated', 'Imaging to confirm the injury when clinically required.'],
  ['Associated injuries', 'Checking the menisci, cartilage and other ligaments.'],
];
const RECON = [
  ['Purpose', 'To restore stability to the knee so it can be used with confidence, and to reduce repeated episodes of giving way.'],
  ['Graft tissue', 'A torn ACL usually cannot be stitched back together, so it is replaced with a graft — a piece of tendon — that acts as a new ligament.'],
  ['Arthroscopic approach', 'Where appropriate, the procedure is performed through small keyhole incisions using an arthroscope.'],
  ['Individual planning', 'Timing, graft choice and treatment of any associated injuries are planned for each patient.'],
  ['Rehabilitation', 'Structured rehabilitation after surgery is essential to the result.'],
];
const REHAB = [
  ['Early recovery', 'Swelling and pain management, protecting the knee.'],
  ['Movement', 'Restoring bending and full straightening.'],
  ['Strength', 'Progressive strengthening of the thigh and hip muscles.'],
  ['Balance & control', 'Neuromuscular and balance training.'],
  ['Function', 'Running, jumping and agility progressed step by step.'],
  ['Return to sport', 'Assessment of readiness, where relevant.'],
];

export default function ACLReconstruction() {
  const { openLeadModal } = useLeadModal();
  return (
    <section id="acl-reconstruction" aria-labelledby="acl-title" data-track-section="acl">
      {/* Part 1 — anatomy, causes, symptoms (dark) */}
      <div className="bg-forest-deep py-16 text-white sm:py-20 lg:py-28">
        <div className="container-page">
          <SectionIntro
            id="acl-title"
            light
            className="reveal"
            kicker="ACL Reconstruction"
            title="ACL Reconstruction: Restoring Knee Stability"
            lede="An anterior cruciate ligament injury can affect knee stability, confidence and participation in everyday or sporting activities. A specialist evaluation helps determine the appropriate treatment."
          />

          <div className="reveal mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
            <figure className="border border-white/10 p-4 sm:p-8 lg:col-span-5">
              <ACLIllustration className="mx-auto w-full max-w-md" />
              <figcaption className="mt-2 text-xs text-white/55">Front view of the knee. Simplified illustration.</figcaption>
            </figure>
            <div className="prose-body text-[1.02rem] leading-relaxed text-white/80 lg:col-span-7">
              <h3 className="h-sub mb-4 !text-white">Understanding the ACL</h3>
              <p>
                The anterior cruciate ligament is one of the four main ligaments of the knee. It lies deep in the centre of
                the joint, running diagonally from the thigh bone (femur) to the front of the shin bone (tibia). It crosses
                the posterior cruciate ligament (PCL) — together they form a cross, which gives the “cruciate” ligaments
                their name.
              </p>
              <p>
                The ACL stops the shin bone from sliding too far forward and helps control rotation of the knee. It is
                especially important during pivoting, cutting and landing movements.
              </p>
              <p>
                Many ACL injuries happen without any contact — when the knee twists while the foot is planted, or during an
                awkward landing.
              </p>
            </div>
          </div>

          <div className="reveal mt-14 grid gap-px bg-white/10 md:grid-cols-2 lg:mt-20">
            {[
              ['Common causes', CAUSES],
              ['Common symptoms', SYMPTOMS],
            ].map(([title, items]) => (
              <div key={title} className="bg-forest-deep py-2 md:px-8 md:first:pl-0">
                <h3 className="font-heading text-sm font-bold tracking-[0.12em] text-ember-light uppercase">{title}</h3>
                <ul className="mt-4 divide-y divide-white/10">
                  {items.map((i) => (
                    <li key={i} className="py-3 text-white/85">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="reveal mt-6 text-sm text-white/60">
            Symptoms vary, and other knee injuries can feel similar. A clinical assessment is needed to confirm the diagnosis.
          </p>
        </div>
      </div>

      {/* Part 2 — diagnosis, treatment, reconstruction, rehab (light) */}
      <div className="bg-sage py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="reveal">
            <h3 className="h-sub">Diagnosis and evaluation</h3>
            <ol className="mt-6 grid gap-px bg-forest/15 sm:grid-cols-2 lg:grid-cols-5">
              {DIAGNOSIS.map(([t, d], i) => (
                <li key={t} className="bg-sage py-5 sm:px-5 sm:first:pl-0 lg:py-2">
                  <span className="font-heading text-sm font-bold text-ember-ink">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-2 font-heading font-semibold text-forest-deep">{t}</p>
                  <p className="mt-1 text-[0.93rem] text-muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h3 className="h-sub">Treatment options</h3>
              <p className="mt-3 text-charcoal/85">
                Treatment depends on the severity of the injury, age, activity level, associated injuries and functional
                requirements. Not every ACL tear needs surgery.
              </p>
            </div>
            <div className="grid gap-px bg-forest/15 sm:grid-cols-2 lg:col-span-7">
              <div className="bg-white p-6">
                <p className="kicker">Non-surgical</p>
                <ul className="list-square mt-4 space-y-2 text-charcoal/90">
                  <li>Structured physiotherapy</li>
                  <li>Activity modification</li>
                  <li>Bracing when indicated</li>
                </ul>
                <p className="mt-4 text-sm text-muted">May suit people with lower-demand activities whose knee feels stable with rehabilitation.</p>
              </div>
              <div className="bg-white p-6">
                <p className="kicker">Surgical</p>
                <ul className="list-square mt-4 space-y-2 text-charcoal/90">
                  <li>ACL reconstruction when clinically appropriate</li>
                </ul>
                <p className="mt-4 text-sm text-muted">
                  Often considered for ongoing instability, pivoting or high-demand activities, or associated injuries that
                  need treatment.
                </p>
              </div>
            </div>
          </div>

          <div className="reveal mt-16 lg:mt-20">
            <h3 className="h-sub">What is ACL reconstruction?</h3>
            <dl className="mt-6 grid gap-x-10 md:grid-cols-2">
              {RECON.map(([t, d]) => (
                <div key={t} className="border-t border-forest/20 py-5">
                  <dt className="font-heading font-semibold text-forest-deep">{t}</dt>
                  <dd className="mt-1 text-[0.98rem] text-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="reveal mt-16 lg:mt-20">
            <h3 className="h-sub">Rehabilitation, phase by phase</h3>
            <p className="mt-3 max-w-2xl text-charcoal/85">
              Progress from one phase to the next is based on clinical criteria — such as swelling, movement, strength and
              control — not on a fixed timeline.
            </p>
            <ol className="mt-8 grid gap-0 sm:grid-cols-2 lg:grid-cols-6">
              {REHAB.map(([t, d], i) => (
                <li key={t} className="relative border-l-2 border-forest/25 pb-6 pl-5 lg:border-t-2 lg:border-l-0 lg:pt-5 lg:pr-4 lg:pb-0 lg:pl-0">
                  <span
                    className="absolute top-0 -left-[7px] h-3 w-3 rounded-full bg-forest lg:-top-[7px] lg:left-0"
                    style={{ opacity: 0.45 + i * 0.11 }}
                    aria-hidden="true"
                  />
                  <span className="font-heading text-xs font-bold tracking-[0.12em] text-ember-ink uppercase">Phase {i + 1}</span>
                  <p className="mt-1 font-heading font-semibold text-forest-deep">{t}</p>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal mt-12 flex flex-col gap-3 sm:flex-row">
            <Button data-cta="consultation" size="lg" onClick={() => openLeadModal({ source: 'acl', treatment: 'acl-reconstruction' })}>
              Book an ACL Injury Assessment <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button
              as="a"
              href={whatsappHref('Hello KNEEV Orthopaedic Center, I would like to enquire about an ACL / knee ligament injury.')}
              target="_blank"
              rel="noopener"
              variant="outline"
              size="lg"
            >
              <WhatsAppIcon /> Ask on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
