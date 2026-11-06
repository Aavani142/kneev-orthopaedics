import { whatsappHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { ACLIllustration } from './illustrations.jsx';
import { DrawLine, Reveal, SplitHeading, Stagger, StaggerItem } from './motion.jsx';
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
      {/* Part 1 — dark chapter */}
      <div className="on-dark bg-forest-night py-20 text-white sm:py-24 lg:py-32">
        <div className="container-page">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <Reveal className="text-ember-light/70 lg:order-2 lg:col-span-3 lg:text-right" y={40}>
              <span className="chapter-num" aria-hidden="true">02</span>
            </Reveal>
            <SectionIntro
              id="acl-title"
              light
              className="lg:order-1 lg:col-span-9"
              kicker="Chapter two · ACL Reconstruction"
              title="ACL reconstruction: *restoring knee stability*"
              lede="An anterior cruciate ligament injury can affect knee stability, confidence and participation in everyday or sporting activities. A specialist evaluation helps determine the appropriate treatment."
            />
          </div>

          <div className="mt-20 grid items-center gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
            <Reveal as="figure" className="border border-white/10 p-5 sm:p-10 lg:col-span-6">
              <ACLIllustration className="mx-auto w-full max-w-md" />
              <figcaption className="mt-3 text-xs text-white/50">Front view of the knee. Simplified illustration.</figcaption>
            </Reveal>
            <Reveal delay={0.1} className="prose-body text-[1.04rem] leading-relaxed text-white/75 lg:col-span-6">
              <h3 className="h-sub mb-6 !text-white">Understanding the ACL</h3>
              <p>
                The anterior cruciate ligament is one of the four main ligaments of the knee. It lies deep in the centre of the
                joint, running diagonally from the thigh bone (femur) to the front of the shin bone (tibia). It crosses the
                posterior cruciate ligament (PCL) — together they form a cross, which gives the “cruciate” ligaments their
                name.
              </p>
              <p>
                The ACL stops the shin bone from sliding too far forward and helps control rotation of the knee. It is
                especially important during pivoting, cutting and landing movements.
              </p>
              <p>
                Many ACL injuries happen without any contact — when the knee twists while the foot is planted, or during an
                awkward landing.
              </p>
            </Reveal>
          </div>

          <div className="mt-20 grid gap-12 md:grid-cols-2 lg:mt-28 lg:gap-20">
            {[
              ['Common causes', CAUSES],
              ['Common symptoms', SYMPTOMS],
            ].map(([title, items]) => (
              <div key={title}>
                <SplitHeading as="h3" text={title} className="font-serif text-[1.6rem] font-bold !text-white" />
                <Stagger as="ul" gap={0.06} className="mt-6 border-t border-white/12">
                  {items.map((it) => (
                    <StaggerItem as="li" key={it} className="border-b border-white/12 py-4 text-white/85">
                      {it}
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}
          </div>
          <Reveal as="p" className="mt-8 text-sm text-white/55">
            Symptoms vary, and other knee injuries can feel similar. A clinical assessment is needed to confirm the diagnosis.
          </Reveal>
        </div>
      </div>

      {/* Part 2 — light */}
      <div className="bg-sage py-20 sm:py-24 lg:py-32">
        <div className="container-page">
          <SplitHeading as="h3" text="Diagnosis *and evaluation*" className="h-sub" />
          <Stagger as="ol" gap={0.08} className="mt-10 grid gap-px bg-forest/15 sm:grid-cols-2 lg:grid-cols-5">
            {DIAGNOSIS.map(([t, d], i) => (
              <StaggerItem as="li" key={t} className="bg-sage py-6 sm:pr-6 lg:py-2 lg:pl-6 lg:first:pl-0">
                <span className="font-serif text-3xl text-ember-ink/80">{i + 1}</span>
                <p className="mt-3 font-semibold text-forest-deep">{t}</p>
                <p className="mt-1 text-[0.94rem] text-muted">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-24 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SplitHeading as="h3" text="Treatment *options*" className="h-sub" />
              <Reveal as="p" className="mt-5 text-charcoal/85">
                Treatment depends on the severity of the injury, age, activity level, associated injuries and functional
                requirements. Not every ACL tear needs surgery.
              </Reveal>
            </div>
            <Stagger gap={0.12} className="grid gap-px bg-forest/15 sm:grid-cols-2 lg:col-span-7">
              <StaggerItem className="bg-white p-7">
                <p className="kicker">Non-surgical</p>
                <ul className="list-square mt-5 space-y-2.5 text-charcoal/90">
                  <li>Structured physiotherapy</li>
                  <li>Activity modification</li>
                  <li>Bracing when indicated</li>
                </ul>
                <p className="mt-5 text-sm text-muted">May suit people with lower-demand activities whose knee feels stable with rehabilitation.</p>
              </StaggerItem>
              <StaggerItem className="bg-white p-7">
                <p className="kicker">Surgical</p>
                <ul className="list-square mt-5 space-y-2.5 text-charcoal/90">
                  <li>ACL reconstruction when clinically appropriate</li>
                </ul>
                <p className="mt-5 text-sm text-muted">
                  Often considered for ongoing instability, pivoting or high-demand activities, or associated injuries that need
                  treatment.
                </p>
              </StaggerItem>
            </Stagger>
          </div>

          <div className="mt-24 lg:mt-28">
            <SplitHeading as="h3" text="What is *ACL reconstruction?*" className="h-sub" />
            <Stagger as="dl" gap={0.07} className="mt-8 grid gap-x-14 md:grid-cols-2">
              {RECON.map(([t, d]) => (
                <StaggerItem key={t} className="border-t border-forest/20 py-6">
                  <dt className="font-semibold text-forest-deep">{t}</dt>
                  <dd className="mt-1.5 text-[0.99rem] text-muted">{d}</dd>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="mt-24 lg:mt-28">
            <SplitHeading as="h3" text="Rehabilitation, *phase by phase*" className="h-sub" />
            <Reveal as="p" className="mt-4 max-w-2xl text-charcoal/85">
              Progress from one phase to the next is based on clinical criteria — such as swelling, movement, strength and
              control — not on a fixed timeline.
            </Reveal>
            <div className="relative mt-12">
              <DrawLine className="absolute top-0 right-0 left-0 hidden h-px text-forest/40 lg:block" />
              <Stagger as="ol" gap={0.1} className="grid sm:grid-cols-2 lg:grid-cols-6">
                {REHAB.map(([t, d], i) => (
                  <StaggerItem as="li" key={t} className="relative border-l border-forest/25 pb-8 pl-6 lg:border-l-0 lg:pt-8 lg:pr-5 lg:pb-0 lg:pl-0">
                    <span
                      className="absolute top-1.5 -left-[5px] h-[9px] w-[9px] rounded-full bg-forest lg:-top-[4px] lg:left-0"
                      style={{ opacity: 0.4 + i * 0.12 }}
                      aria-hidden="true"
                    />
                    <span className="text-[0.7rem] font-semibold tracking-[0.18em] text-ember-ink uppercase">Phase {i + 1}</span>
                    <p className="mt-2 font-serif text-[1.15rem] leading-tight text-forest-deep">{t}</p>
                    <p className="mt-1.5 text-sm text-muted">{d}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          <Reveal className="mt-14 flex flex-col gap-3 border-t border-forest/20 pt-10 sm:flex-row">
            <Button data-cta="consultation" size="lg" arrow onClick={() => openLeadModal({ source: 'acl', treatment: 'acl-reconstruction' })}>
              Book an ACL Injury Assessment
            </Button>
            <Button
              as="a"
              href={whatsappHref('Hello KNEEV Orthopaedic Center, I would like to enquire about an ACL / knee ligament injury.')}
              target="_blank"
              rel="noopener"
              variant="outline"
              size="lg"
            >
              <WhatsAppIcon size={18} /> Ask on WhatsApp
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
