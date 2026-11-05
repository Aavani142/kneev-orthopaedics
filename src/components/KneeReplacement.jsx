import { ArrowRight, Check, Info } from 'lucide-react';
import { useLeadModal } from './LeadModalContext.jsx';
import { KneeArthritisComparison, KneeReplacementIllustration } from './illustrations.jsx';
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
  {
    name: 'Total Knee Replacement',
    text: 'The worn joint surfaces of the knee are resurfaced with implant components. Generally considered when arthritis affects most of the joint.',
  },
  {
    name: 'Partial Knee Replacement',
    text: 'Only the damaged compartment of the knee is resurfaced, preserving healthy bone, cartilage and ligaments. Suitable only for selected patients whose arthritis is limited to one area of the knee.',
  },
  {
    name: 'Revision Knee Replacement',
    text: 'A previous knee replacement is partly or fully replaced — for example because of wear, loosening, instability, infection or persistent symptoms. These procedures are more complex and need detailed planning.',
  },
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
      <h4 className="font-heading text-sm font-bold tracking-[0.12em] text-ember-ink uppercase">{title}</h4>
      <ol className="mt-5 border-l border-forest/20">
        {items.map(([t, d]) => (
          <li key={t} className="relative pb-6 pl-6 last:pb-0">
            <span className="absolute top-1.5 -left-[5px] h-[9px] w-[9px] rounded-full border-2 border-forest bg-white" aria-hidden="true" />
            <p className="font-heading font-semibold text-forest-deep">{t}</p>
            <p className="mt-0.5 text-[0.95rem] text-muted">{d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function KneeReplacement() {
  const { openLeadModal } = useLeadModal();
  return (
    <section id="knee-replacement" aria-labelledby="knee-title" data-track-section="knee-replacement" className="bg-ivory py-16 sm:py-20 lg:py-28">
      <div className="container-page">
        {/* Intro */}
        <div className="reveal grid gap-6 lg:grid-cols-12">
          <SectionIntro
            id="knee-title"
            className="lg:col-span-7"
            kicker="Knee Replacement"
            title="Understanding Knee Replacement Surgery"
            lede="When knee joint damage begins to affect walking, everyday activities and quality of life, an orthopaedic evaluation can help determine the most appropriate treatment."
          />
        </div>

        {/* Anatomy + arthritis */}
        <div className="reveal mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="prose-body text-[1.02rem] leading-relaxed text-charcoal/85 lg:col-span-6">
            <h3 className="h-sub mb-4">The knee joint and osteoarthritis</h3>
            <p>
              The knee is where the thigh bone (femur) meets the shin bone (tibia), with the kneecap (patella) at the
              front. The ends of these bones are covered with smooth articular cartilage, which allows the joint to glide
              and absorb load with every step. Two crescent-shaped menisci cushion the joint, and strong ligaments keep it
              stable.
            </p>
            <p>
              In osteoarthritis, this cartilage gradually wears and thins. The joint space narrows, the underlying bone
              can become irritated and small bony spurs may form at the joint margins. These changes become more common
              with age, and can also follow earlier injuries, meniscus or ligament damage, alignment problems, excess body
              weight or inflammatory arthritis.
            </p>
            <p>
              Changes on an X-ray do not always match how much pain a person has. That is why symptoms, examination and
              everyday function are always assessed together.
            </p>
          </div>
          <figure className="border border-line bg-white p-5 sm:p-8 lg:col-span-6">
            <KneeArthritisComparison className="w-full" />
            <figcaption className="mt-4 grid gap-3 border-t border-line pt-4 text-sm text-charcoal/85 sm:grid-cols-2">
              <p>
                <span className="font-heading font-bold text-forest-deep">Healthy knee:</span> smooth cartilage and an even joint space.
              </p>
              <p>
                <span className="font-heading font-bold text-forest-deep">Osteoarthritis:</span> worn cartilage, a narrowed joint space and bone spurs.
              </p>
              <p className="text-xs text-muted sm:col-span-2">Simplified illustration. Not to scale.</p>
            </figcaption>
          </figure>
        </div>

        {/* Symptoms */}
        <div className="reveal mt-16 lg:mt-24">
          <h3 className="h-sub">Symptoms that affect everyday life</h3>
          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {SYMPTOMS.map(([t, d]) => (
              <li key={t} className="border-t border-forest/20 py-5">
                <p className="font-heading font-semibold text-forest-deep">{t}</p>
                <p className="mt-1 text-[0.95rem] text-muted">{d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[0.95rem] text-muted">Knee pain has many causes, and most of them do not require surgery.</p>
        </div>

        {/* When considered */}
        <div className="reveal mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h3 className="h-sub">When might knee replacement be considered?</h3>
            <p className="mt-3 text-muted">A specialist may evaluate whether knee replacement is appropriate in situations such as:</p>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {CONSIDERED.map((c, i) => (
                <li key={c} className="flex gap-5 py-4">
                  <span className="font-heading text-sm font-bold text-ember-ink tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-charcoal/90">{c}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex gap-2.5 text-[0.95rem] text-charcoal/85">
              <Info size={18} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
              The final decision depends on a clinical evaluation, and is made together with you after a clear discussion
              of the expected benefits and risks.
            </p>
          </div>
          <aside className="self-start bg-sage p-6 sm:p-8 lg:col-span-5">
            <p className="kicker">Conservative first</p>
            <h4 className="mt-3 text-lg font-bold">Non-surgical care is usually explored first</h4>
            <ul className="list-square mt-4 space-y-2 text-[0.95rem] text-charcoal/85">
              {NON_SURGICAL.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">Surgery is considered when structured non-surgical care does not provide adequate relief.</p>
          </aside>
        </div>

        {/* Types */}
        <div className="reveal mt-16 grid items-start gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-14">
          <figure className="order-2 border border-line bg-white p-5 sm:p-8 lg:order-1 lg:col-span-5">
            <KneeReplacementIllustration className="mx-auto w-full max-w-sm" />
            <figcaption className="mt-3 text-xs text-muted">Components of a total knee replacement. Simplified illustration.</figcaption>
          </figure>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <h3 className="h-sub">Types of knee replacement</h3>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {TYPES.map((t, i) => (
                <div key={t.name} className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr]">
                  <span className="font-heading text-sm font-bold text-ember-ink">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 className="text-lg font-bold">{t.name}</h4>
                    <p className="mt-1.5 text-[0.98rem] leading-relaxed text-muted">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[0.95rem] text-charcoal/85">
              The appropriate procedure, if any, depends on the extent and location of joint damage, the condition of the
              ligaments, alignment, general health, activity level and clinical findings.
            </p>
          </div>
        </div>

        {/* Evaluation */}
        <div className="reveal mt-16 bg-forest px-6 py-10 text-white sm:px-10 lg:mt-24 lg:px-14 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="kicker kicker-light">Surgical evaluation</p>
              <h3 className="h-sub mt-3 !text-white">Careful evaluation and planning</h3>
              <p className="mt-3 text-white/75">
                Before surgery is recommended, your knee and general health are assessed in detail, and the plan is made for
                you as an individual.
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:col-span-7">
              {EVALUATION.map((e) => (
                <li key={e} className="flex gap-3 text-[0.98rem] text-white/90">
                  <Check size={18} className="mt-0.5 shrink-0 text-ember-light" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Before / after */}
        <div className="reveal mt-16 lg:mt-24">
          <h3 className="h-sub">Before and after surgery</h3>
          <div className="mt-8 grid gap-10 md:grid-cols-2 lg:gap-16">
            <Timeline title="Before surgery" items={BEFORE} />
            <Timeline title="After surgery" items={AFTER} />
          </div>
          <p className="mt-8 max-w-3xl border-l-2 border-ember pl-4 text-[0.95rem] text-charcoal/85">
            Recovery differs from person to person. Your team will explain what to expect in your situation — no fixed
            recovery period or outcome can be guaranteed.
          </p>
          <Button
            data-cta="consultation"
            size="lg"
            className="mt-10 w-full sm:w-auto"
            onClick={() => openLeadModal({ source: 'knee-replacement', treatment: 'knee-replacement' })}
          >
            Discuss Knee Replacement With Our Orthopaedic Team <ArrowRight size={18} aria-hidden="true" className="hidden sm:block" />
          </Button>
        </div>
      </div>
    </section>
  );
}
