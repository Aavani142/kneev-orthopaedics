import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Phone } from 'lucide-react';
import { SITE, telHref, whatsappHref } from '../config/site.js';
import { EASE } from './motion.jsx';
import { WhatsAppIcon } from './ui.jsx';

const WA_MESSAGE = 'Hello KNEEV Orthopaedic Center, I would like to enquire about a knee consultation.';

/**
 * Fixed WhatsApp + phone buttons on the right edge.
 * They slide away while the enquiry form section is on screen, so they never cover its fields or submit button.
 * On phones they sit above the bottom action bar.
 */
export default function FloatingContact() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = ['book'].map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return undefined;
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const base =
    'group relative flex h-11 w-11 items-center justify-center rounded-full shadow-[0_10px_28px_-10px_rgb(11_42_34/0.6)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 sm:h-14 sm:w-14';
  const tip =
    'pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full bg-forest-night px-4 py-2 text-xs font-semibold text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block';

  return (
    <m.div
      data-track-section="floating"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: hidden ? 0 : 1, x: hidden ? 40 : 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: hidden ? 0 : 0.8 }}
      className={`fixed right-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 flex flex-col gap-3 sm:right-5 md:bottom-7 ${hidden ? 'pointer-events-none' : ''}`}
      aria-hidden={hidden || undefined}
    >
      <a
        href={whatsappHref(WA_MESSAGE)}
        target="_blank"
        rel="noopener"
        aria-label="Chat with KNEEV on WhatsApp"
        tabIndex={hidden ? -1 : undefined}
        className={`${base} bg-[#25D366] text-white`}
      >
        <WhatsAppIcon size={26} />
        <span className={tip}>Chat on WhatsApp</span>
      </a>
      <a href={telHref} aria-label={`Call KNEEV on ${SITE.phoneDisplay}`} tabIndex={hidden ? -1 : undefined} className={`${base} bg-forest text-white`}>
        <Phone size={21} aria-hidden="true" />
        <span className={tip}>Call {SITE.phoneDisplay}</span>
      </a>
    </m.div>
  );
}
