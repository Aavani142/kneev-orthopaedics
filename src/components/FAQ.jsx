import { useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQ_GROUPS } from '../content/faqs.js';
import { EASE, Reveal } from './motion.jsx';
import { SectionIntro } from './ui.jsx';

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
    <section id="faq" aria-labelledby="faq-title" data-track-section="faq" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionIntro id="faq-title" kicker="FAQs" title="Questions, *answered*" />
            <Reveal as="p" delay={0.15} className="mt-6 text-muted">
              General information only. Your doctor will explain what applies to your own condition.
            </Reveal>
          </div>
        </div>

        <Reveal className="lg:col-span-8">
          <div role="tablist" aria-label="FAQ topics" className="flex gap-8 border-b border-line">
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
                className={`relative -mb-px min-h-12 pb-3 font-serif text-lg transition-colors ${tab === i ? 'text-forest-deep' : 'text-grey hover:text-forest'}`}
              >
                {g.label}
                <span
                  aria-hidden="true"
                  className={`absolute right-0 bottom-0 left-0 h-[2px] origin-left bg-ember transition-transform duration-500 ${tab === i ? 'scale-x-100' : 'scale-x-0'}`}
                />
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
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left text-[1.05rem] font-semibold text-forest-deep sm:text-[1.12rem]"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">{f.q}</span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                          isOpen ? 'border-forest bg-forest text-white' : 'border-line-strong text-forest'
                        }`}
                      >
                        <Plus size={17} aria-hidden="true" className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={pid}
                        role="region"
                        aria-labelledby={`${pid}-btn`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-3xl pr-14 pb-7 leading-relaxed text-muted">{f.a}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
