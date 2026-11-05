import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQ_GROUPS } from '../content/faqs.js';
import { DevNote, SectionIntro } from './ui.jsx';

export default function FAQ() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(0);
  const tabRefs = useRef([]);
  const group = FAQ_GROUPS[tab];

  const selectTab = (i) => {
    setTab(i);
    setOpen(0);
    tabRefs.current[i]?.focus();
  };

  const onTabKey = (e) => {
    if (e.key === 'ArrowRight') selectTab((tab + 1) % FAQ_GROUPS.length);
    if (e.key === 'ArrowLeft') selectTab((tab - 1 + FAQ_GROUPS.length) % FAQ_GROUPS.length);
  };

  return (
    <section id="faq" aria-labelledby="faq-title" data-track-section="faq" className="bg-ivory py-16 sm:py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-4">
          <SectionIntro id="faq-title" kicker="FAQs" title="Frequently Asked Questions" />
          <p className="mt-4 text-muted">
            General information only. Your doctor will explain what applies to your own condition.
          </p>
          <DevNote>FAQ answers must be reviewed by the treating doctor before publication (src/content/faqs.js).</DevNote>
        </div>

        <div className="reveal lg:col-span-8">
          <div role="tablist" aria-label="FAQ topics" className="flex border-b border-line">
            {FAQ_GROUPS.map((g, i) => (
              <button
                key={g.id}
                ref={(el) => (tabRefs.current[i] = el)}
                role="tab"
                type="button"
                id={`faq-tab-${g.id}`}
                aria-selected={tab === i}
                aria-controls={`faq-panel-${g.id}`}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => selectTab(i)}
                onKeyDown={onTabKey}
                className={`-mb-px min-h-12 border-b-2 px-1 font-heading font-bold transition-colors sm:px-2 ${
                  i > 0 ? 'ml-6' : ''
                } ${tab === i ? 'border-forest text-forest-deep' : 'border-transparent text-grey hover:text-forest'}`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <ul id={`faq-panel-${group.id}`} role="tabpanel" aria-labelledby={`faq-tab-${group.id}`} className="divide-y divide-line border-b border-line">
            {group.items.map((f, i) => {
              const isOpen = open === i;
              const pid = `faq-${group.id}-${i}`;
              return (
                <li key={f.q}>
                  <h3 className="text-base">
                    <button
                      type="button"
                      id={`${pid}-btn`}
                      aria-expanded={isOpen}
                      aria-controls={pid}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-start justify-between gap-4 py-5 text-left font-heading text-[1.02rem] font-semibold text-forest-deep sm:text-[1.08rem]"
                    >
                      {f.q}
                      <Plus size={20} className={`mt-0.5 shrink-0 text-forest transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={pid}
                    role="region"
                    aria-labelledby={`${pid}-btn`}
                    className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden" {...(isOpen ? {} : { inert: '' })}>
                      <p className="max-w-3xl pr-8 pb-6 leading-relaxed text-muted">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
