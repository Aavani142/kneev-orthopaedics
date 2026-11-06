import { Info } from 'lucide-react';
import { useLeadModal } from './LeadModalContext.jsx';
import { KneeArthritisComparison, KneeReplacementIllustration } from './illustrations.jsx';
import { DrawLine, Reveal, SplitHeading, Stagger, StaggerItem } from './motion.jsx';
import { Button, SectionIntro } from './ui.jsx';

const SYMPTOMS = [
  ['Persistent knee pain', 'Pain with walking or standing that lingers or keeps returning.'],
  ['Joint stiffness', 'Especially after resting, or first thing in the morning.'],
  ['Swelling', 'Recurring puffiness around the knee after activity.'],
  ['Difficulty walking', 'Shorter walking distances, limping or needing support.'],
  ['Difficulty with stairs', 'Pain or weakness climbing stairs or rising from a chair.'],
  ['Reduced range of motion', 'Difficulty fully bending or straightening the knee.'],
  ['Disturbed sleep', 'Pain at rest or at night.'],
  ['Everyday activities', 'Limits on work, travel, squatting or sitting cross-legged.'],
];

const CONSIDERED = [
  'Advanced knee osteoarthritis confirmed on examination and imaging',
  'Persistent pain despite appropriate treatment',
  'Significant limitation in walking and daily function',
  'Structural joint damage or progressive deformity',
  'Symptoms that affect sleep and everyday life',
  'Insufficient benefit from suitable non-surgical options',
];

const NON_SURGICAL = [
  'Activity modification',
  'Targeted physiotherapy and strengthening',
  'Weight management',
  'Medicines when indicated',
  'Injection therapies when clinically indicated',
  'Orthotics and bracing',
];

const TYPES = [
  ['Total Knee Replacement', 'The worn joint surfaces of the knee are resurfaced with implant components. Generally considered when arthritis affects most of the joint.'],
  ['Partial Knee Replacement', 'Only the damaged compartment of the knee is resurfaced, preserving healthy bone, cartilage and ligaments. Suitable only for selected patients whose arthritis is limited to one area of the knee.'],
  ['Revision Knee Replacement', 'A previous knee replacement is partly or fully replaced — for example because of wear, loosening, instability, infection or persistent symptoms. These procedures are more complex and need detailed planning.'],
];

const EVALUATION = [
  'Medical history and current symptoms',
  'Physical examination of the knee',
  'Assessment of joint movement, stability and alignment',
  'Imaging review when indicated',
  'Medical fitness assessment',
  'Discussion of risks, expected benefits and alternatives',
  'Individualised surgical planning',
];

const BEFORE = [
  ['Clinical assessment', 'History, examination and imaging review to understand the joint.'],
  ['Treatment discussion', 'Options, benefits and risks explained so you can decide with clarity.'],
  ['Pre-operative preparation', 'Required tests, guidance on exercises and planning for home.'],
  ['Medical optimisation', 'Conditions such as diabetes or blood pressure are managed before surgery.'],
];
const AFTER = [
  ['Pain management', 'A planned approach to keep you comfortable.'],
  ['Early mobilisation', 'Getting you moving safely, as early as is appropriate.'],
  ['Physiotherapy', 'Structured exercises to restore movement and strength.'],
  ['Functional rehabilitation', 'Walking, stairs and daily activities, progressed step by step.'],
  ['Follow-up monitoring', 'Regular reviews of the wound, movement and progress.'],
];

function Timeline({ title, items }) {
  return (
    <div>
      <p className="kicker">{title}</p>
      <div className="relative mt-6">
        <DrawLine vertical className="absolute top-2 bottom-2 left-[4px] w-px text-forest/30" />
        <Stagger as="ol" gap={0.1}>
          {items.map(([t, d]) => (
            <StaggerItem as="li" key={t} className="relative pb-7 pl-8 last:pb-0">
              <span className="absolute top-2 left-0 h-[9px] w-[9px] rounded-full border border-forest bg-ivory" aria-hidden="true" />
              <p className="font-semibold text-forest-deep">{t}</p>
              <p className="mt-1 text-[0.95rem] text-muted">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

export default function KneeReplacement() {
  const { openLeadModal } = useLeadModal();
  return (
    <section id="knee-replacement" aria-labelledby="knee-title" data-track-section="knee-replacement" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-page">
        {/* Chapter opener */}
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Reveal className="text-ember-ink/70 lg:col-span-3" y={40}>
            <span className="chapter-num" aria-hidden="true">01</span>
          </Reveal>
          <SectionIntro
            id="knee-title"
            className="lg:col-span-9"
            kicker="Chapter one · Knee Replacement"
            title="Understanding *knee replacement* surgery"
            lede="When knee joint damage begins to affect walking, everyday activities and quality of life, an orthopaedic evaluation can help determine the most appropriate treatment."
          />
        </div>

        {/* Anatomy */}
        <div className="mt-20 grid items-start gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <Reveal className="prose-body text-[1.04rem] leading-relaxed text-charcoal/85 lg:col-span-5">
            <h3 className="h-sub mb-6">The knee joint and osteoarthritis</h3>
            <p>
              The knee is where the thigh bone (femur) meets the shin bone (tibia), with the kneecap (patella) at the front.
              The ends of these bones are covered with smooth articular cartilage, which allows the joint to glide and
              absorb load with every step. Two crescent-shaped menisci cushion the joint, and strong ligaments keep it
              stable.
            </p>
            <p>
              In osteoarthritis, this cartilage gradually wears and thins. The joint space narrows, the underlying bone can
              become irritated and small bony spurs may form at the joint margins. These changes become more common with
              age, and can also follow earlier injuries, meniscus or ligament damage, alignment problems, excess body weight
              or inflammatory arthritis.
            </p>
            <p>
              Changes on an X-ray do not always match how much pain a person has. That is why symptoms, examination and
              everyday function are always assessed together.
            </p>
          </Reveal>
          <Reveal as="figure" delay={0.1} className="bg-ivory p-5 sm:p-10 lg:col-span-7">
            <KneeArthritisComparison className="w-full" />
            <figcaption className="mt-5 grid gap-3 border-t border-line pt-5 text-sm text-charcoal/85 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-forest-deep">Healthy knee:</span> smooth cartilage and an even joint space.
              </p>
              <p>
                <span className="font-semibold text-forest-deep">Osteoarthritis:</span> worn cartilage, a narrowed joint space and bone spurs.
              </p>
              <p className="text-xs text-muted sm:col-span-2">Simplified illustration. Not to scale.</p>
            </figcaption>
          </Reveal>
        </div>

        {/* Symptoms */}
        <div className="mt-24 lg:mt-32">
          <SplitHeading as="h3" text="Symptoms that affect *everyday life*" className="h-sub" />
          <Stagger as="ul" gap={0.06} className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {SYMPTOMS.map(([t, d]) => (
              <StaggerItem as="li" key={t} className="border-t border-forest/20 py-6">
                <p className="font-semibold text-forest-deep">{t}</p>
                <p className="mt-1.5 text-[0.95rem] text-muted">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal as="p" className="mt-4 font-serif text-lg text-forest">
            Knee pain has many causes, and most of them do not require surgery.
          </Reveal>
        </div>

        {/* When considered */}
        <div className="mt-24 grid gap-12 lg:mt-32 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SplitHeading as="h3" text="When might knee replacement *be considered?*" className="h-sub" />
            <Reveal as="p" className="mt-4 text-muted">
              A specialist may evaluate whether knee replacement is appropriate in situations such as:
            </Reveal>
            <Stagger as="ol" gap={0.07} className="mt-8 border-t border-line">
              {CONSIDERED.map((c, i) => (
                <StaggerItem as="li" key={c} className="flex items-baseline gap-6 border-b border-line py-5">
                  <span className="font-serif text-lg text-ember-ink">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[1.02rem] text-charcoal/90">{c}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal as="p" className="mt-6 flex gap-3 text-[0.95rem] text-charcoal/85">
              <Info size={18} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
              The final decision depends on a clinical evaluation, and is made together with you after a clear discussion of
              the expected benefits and risks.
            </Reveal>
          </div>
          <Reveal as="aside" delay={0.15} className="self-start bg-forest-deep p-8 text-white sm:p-10 lg:col-span-5 lg:mt-16">
            <p className="kicker kicker-light">Conservative first</p>
            <h4 className="mt-5 font-serif text-[1.5rem] leading-tight font-bold text-white">Non-surgical care is usually explored first</h4>
            <ul className="list-square mt-6 space-y-2.5 text-white/85">
              {NON_SURGICAL.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/15 pt-5 text-sm text-white/65">
              Surgery is considered when structured non-surgical care does not provide adequate relief.
            </p>
          </Reveal>
        </div>

        {/* Types */}
        <div className="mt-24 grid items-start gap-12 lg:mt-32 lg:grid-cols-12 lg:gap-16">
          <Reveal as="figure" className="order-2 bg-ivory p-6 sm:p-10 lg:order-1 lg:sticky lg:top-28 lg:col-span-5">
            <KneeReplacementIllustration className="mx-auto w-full max-w-sm" />
            <figcaption className="mt-4 text-xs text-muted">Components of a total knee replacement. Simplified illustration.</figcaption>
          </Reveal>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <SplitHeading as="h3" text="Types of *knee replacement*" className="h-sub" />
            <Stagger gap={0.1} className="mt-8 border-t border-line">
              {TYPES.map(([name, text], i) => (
                <StaggerItem key={name} className="grid gap-3 border-b border-line py-8 sm:grid-cols-[5rem_1fr]">
                  <span className="font-serif text-4xl leading-none text-ember-ink/80">{i + 1}</span>
                  <div>
                    <h4 className="font-serif text-[1.35rem] leading-tight font-bold">{name}</h4>
                    <p className="mt-2 text-[1rem] leading-relaxed text-muted">{text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal as="p" className="mt-6 text-[0.98rem] text-charcoal/85">
              The appropriate procedure, if any, depends on the extent and location of joint damage, the condition of the
              ligaments, alignment, general health, activity level and clinical findings.
            </Reveal>
          </div>
        </div>
      </div>

      {/* Evaluation — full-bleed band */}
      <div className="on-dark mt-24 bg-forest py-16 text-white lg:mt-32 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="kicker kicker-light">Surgical evaluation</p>
            <SplitHeading as="h3" text="Careful evaluation *and planning*" className="h-sub mt-5 !text-white" />
            <Reveal as="p" className="mt-5 text-white/70">
              Before surgery is recommended, your knee and general health are assessed in detail, and the plan is made for you
              as an individual.
            </Reveal>
          </div>
          <Stagger as="ul" gap={0.06} className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
            {EVALUATION.map((e, i) => (
              <StaggerItem as="li" key={e} className="flex gap-4 border-b border-white/12 py-4 text-white/90">
                <span className="font-serif text-ember-light">{String(i + 1).padStart(2, '0')}</span>
                {e}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* Before / after */}
      <div className="container-page mt-24 lg:mt-32">
        <SplitHeading as="h3" text="Before and *after surgery*" className="h-sub" />
        <div className="mt-10 grid gap-12 md:grid-cols-2 lg:gap-20">
          <Timeline title="Before surgery" items={BEFORE} />
          <Timeline title="After surgery" items={AFTER} />
        </div>
        <Reveal className="mt-14 flex flex-col gap-8 border-t border-line pt-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl font-serif text-[1.15rem] leading-snug text-forest-deep">
            Recovery differs from person to person. Your team will explain what to expect in your situation — no fixed
            recovery period or outcome can be guaranteed.
          </p>
          <Button
            data-cta="consultation"
            size="lg"
            arrow
            className="shrink-0"
            onClick={() => openLeadModal({ source: 'knee-replacement', treatment: 'knee-replacement' })}
          >
            Discuss Knee Replacement With Our Team
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
