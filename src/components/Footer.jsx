import logo from '../assets/img/logo.png';
import { DISCLAIMER, SITE, telHref } from '../config/site.js';

export default function Footer() {
  const { address: a } = SITE;
  return (
    <footer data-track-section="footer" className="bg-forest-deep pt-14 pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-sm text-white/70 md:pb-10">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src={logo} alt="KNEEV Orthopaedic Center" width="400" height="178" loading="lazy" className="h-12 w-auto brightness-0 invert" />
            <p className="mt-4 max-w-xs">Conservative-first orthopaedic care in Jayanagar, Bengaluru.</p>
          </div>
          <div className="lg:col-span-3">
            <p className="font-heading font-bold text-white">Address</p>
            <p className="mt-3 leading-relaxed">
              {a.line1}, {a.line2},<br />
              {a.city}, {a.region} {a.postalCode}
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="font-heading font-bold text-white">Contact</p>
            <p className="mt-3 leading-relaxed">
              <a href={telHref} className="hover:text-white">{SITE.phoneDisplay}</a>
              <br />
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">{SITE.email}</a>
              <br />
              Mon – Sat: 9:00 AM – 7:00 PM
              <br />
              Sunday: By appointment
            </p>
          </div>
          <div className="lg:col-span-2">
            <p className="font-heading font-bold text-white">More</p>
            <ul className="mt-3 space-y-1.5">
              <li><a href={SITE.privacyPath} className="hover:text-white">Privacy Policy</a></li>
              <li><a href={SITE.mainSite} target="_blank" rel="noopener" className="hover:text-white">Main website</a></li>
              {SITE.socials.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener" className="hover:text-white">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60">{DISCLAIMER}</p>
        <p className="mt-2 text-xs text-white/60">© {new Date().getFullYear()} KNEEV Orthopaedic Center. All rights reserved.</p>
      </div>
    </footer>
  );
}
