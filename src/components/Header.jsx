import { useEffect, useRef, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import logo from '../assets/img/logo.png';
import { SITE, telHref } from '../config/site.js';
import { useLeadModal } from './LeadModalContext.jsx';
import { Button } from './ui.jsx';

const LINKS = [
  { href: '#knee-replacement', label: 'Knee Replacement' },
  { href: '#acl-reconstruction', label: 'ACL Surgery' },
  { href: '#doctor', label: 'About the Doctor' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const { openLeadModal } = useLeadModal();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      data-track-section="header"
      className={`sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-sm transition-[border-color,box-shadow] ${
        scrolled || menuOpen ? 'border-line shadow-[0_6px_24px_-18px_rgb(16_58_47/0.45)]' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <a href="#top" className="shrink-0" aria-label="KNEEV Orthopaedic Center, back to top">
          <img src={logo} alt="KNEEV Orthopaedic Center" width="400" height="178" className="h-10 w-auto lg:h-11" />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 font-heading text-[0.9rem] font-semibold text-charcoal/80">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="py-2 transition-colors hover:text-forest">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          <a href={telHref} className="hidden items-center gap-2 font-heading text-[0.9rem] font-semibold text-forest-deep xl:flex">
            <Phone size={16} aria-hidden="true" className="text-forest" />
            {SITE.phoneDisplay}
          </a>
          <span className="hidden sm:block">
            <Button data-cta="consultation" size="sm" className="min-h-11 px-5" onClick={() => openLeadModal({ source: 'header' })}>
              Book a Consultation
            </Button>
          </span>
          <a
            href={telHref}
            className="flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-sage sm:hidden"
            aria-label={`Call the clinic on ${SITE.phoneDisplay}`}
          >
            <Phone size={20} aria-hidden="true" />
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-forest-deep hover:bg-sage lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="animate-fade-in border-t border-line bg-ivory lg:hidden">
          <ul className="container-page py-2">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-line last:border-0">
                <a href={l.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center font-heading font-semibold text-forest-deep">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-3 sm:hidden">
              <Button
                data-cta="consultation"
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  openLeadModal({ source: 'mobile-menu' });
                }}
              >
                Book a Consultation
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
