import { Phone } from 'lucide-react';
import logo from '../assets/img/logo.png';
import { DISCLAIMER, SITE, telHref, whatsappHref } from '../config/site.js';
import { Reveal } from './motion.jsx';
import { Button, WhatsAppIcon } from './ui.jsx';

export default function Footer() {
  const { address: a } = SITE;
  return (
    <footer data-track-section="footer" className="bg-forest-night pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-sm text-white/65 md:pb-10">
      <div className="container-page">
        <div className="flex flex-col gap-6 border-t border-white/10 py-12 md:flex-row md:items-center md:justify-between">
          <Reveal as="p" className="font-serif text-[1.6rem] leading-tight text-white sm:text-[2rem]">
            Speak with the <span className="text-ember-light">KNEEV team.</span>
          </Reveal>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as="a" href={telHref} variant="light">
              <Phone size={16} aria-hidden="true" /> {SITE.phoneDisplay}
            </Button>
            <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="whatsapp">
              <WhatsAppIcon size={18} /> WhatsApp
            </Button>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src={logo} alt="KNEEV Orthopaedic Center" width="400" height="178" loading="lazy" className="h-12 w-auto brightness-0 invert" />
            <p className="mt-4 max-w-xs">Conservative-first orthopaedic care in Jayanagar, Bengaluru.</p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-white uppercase">Address</p>
            <p className="mt-4 leading-relaxed">
              {a.line1}, {a.line2},<br />
              {a.city}, {a.region} {a.postalCode}
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-white uppercase">Contact</p>
            <p className="mt-4 leading-relaxed">
              <a href={telHref} className="link-line hover:text-white">{SITE.phoneDisplay}</a>
              <br />
              <a href={`mailto:${SITE.email}`} className="link-line break-all hover:text-white">{SITE.email}</a>
              <br />
              Mon – Sat: 9:00 AM – 7:00 PM
              <br />
              Sunday: By appointment
            </p>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-white uppercase">More</p>
            <ul className="mt-4 space-y-1.5">
              <li><a href={SITE.privacyPath} className="link-line hover:text-white">Privacy Policy</a></li>
              <li><a href={SITE.mainSite} target="_blank" rel="noopener" className="link-line hover:text-white">Main website</a></li>
              {SITE.socials.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener" className="link-line hover:text-white">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-14 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/55">{DISCLAIMER}</p>
        <p className="mt-2 text-xs text-white/55">© {new Date().getFullYear()} KNEEV Orthopaedic Center. All rights reserved.</p>
      </div>
    </footer>
  );
}
