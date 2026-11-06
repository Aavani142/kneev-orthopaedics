import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion';
import { Phone } from 'lucide-react';
import logo from '../assets/img/logo.png';
import { SITE, telHref, whatsappHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { EASE } from './motion.jsx';
import { Button, WhatsAppIcon } from './ui.jsx';

const LINKS = [
  { href: '#services', label: 'How We Help' },
  { href: '#why-kneev', label: 'Why KNEEV' },
  { href: '#clinic', label: 'Inside KNEEV' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const { openLeadModal } = useLeadModal();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef(null);

  // Transparent over the dark hero; solid paper once scrolled. Hides on scroll down, returns on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > prev && y > 320);
  });

  useEffect(() => {
    if (!menuOpen) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const light = !solid && !menuOpen; // transparent over the light hero

  return (
    <>
      <m.header
        data-track-section="header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%', opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 ${
          light ? 'border-b border-forest/10 bg-transparent' : menuOpen ? 'border-b border-white/10 bg-forest-night' : 'border-b border-line bg-ivory/90 backdrop-blur-md'
        }`}
      >
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-6 lg:h-20">
          <a href="#top" className="relative z-10 shrink-0" aria-label="KNEEV Orthopaedic Center, back to top">
            <img
              src={logo}
              alt="KNEEV Orthopaedic Center"
              width="400"
              height="178"
              className={`h-10 w-auto transition-[filter] duration-500 lg:h-11 ${menuOpen ? 'brightness-0 invert' : ''}`}
            />
          </a>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className={`flex items-center gap-9 text-[0.88rem] font-medium transition-colors duration-500 text-charcoal/80`}>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-line py-1.5 hover:text-current">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-5">
            <a
              href={telHref}
              className={`hidden items-center gap-2 text-[0.88rem] font-semibold transition-colors duration-500 xl:flex text-forest-deep`}
            >
              <Phone size={15} aria-hidden="true" />
              {SITE.phoneDisplay}
            </a>
            <span className="hidden sm:block">
              <Button data-cta="consultation" variant="accent" size="sm" className="min-h-11 px-5" onClick={() => openLeadModal({ source: 'header' })}>
                Book a Consultation
              </Button>
            </span>
            <a
              href={telHref}
              aria-label={`Call the clinic on ${SITE.phoneDisplay}`}
              className={`flex h-11 w-11 items-center justify-center rounded-full sm:hidden ${menuOpen ? 'text-white' : 'text-forest'}`}
            >
              <Phone size={20} aria-hidden="true" />
            </a>
            <button
              ref={menuBtn}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
              className={`relative flex h-11 w-11 items-center justify-center lg:hidden ${menuOpen ? 'text-white' : 'text-forest-deep'}`}
            >
              <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </div>
      </m.header>

      <AnimatePresence>
        {menuOpen && (
          <m.nav
            id="mobile-menu"
            aria-label="Main"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="on-dark fixed inset-0 z-30 flex flex-col bg-forest-night px-5 pt-24 pb-10 text-white sm:px-8 lg:hidden"
          >
            <ul className="flex-1">
              {LINKS.map((l, i) => (
                <m.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.07 }}
                  className="border-b border-white/10"
                >
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="flex items-baseline gap-4 py-4 font-serif text-[1.9rem] leading-none">
                    <span className="font-sans text-xs text-ember-light">0{i + 1}</span>
                    {l.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-3">
              <Button
                data-cta="consultation"
                variant="accent"
                size="lg"
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  openLeadModal({ source: 'mobile-menu' });
                }}
              >
                Book a Consultation
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button as="a" href={telHref} variant="outlineLight">
                  <Phone size={16} aria-hidden="true" /> Call
                </Button>
                <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="whatsapp">
                  <WhatsAppIcon size={17} /> WhatsApp
                </Button>
              </div>
            </m.div>
          </m.nav>
        )}
      </AnimatePresence>
    </>
  );
}
