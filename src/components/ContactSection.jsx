import { useEffect, useRef, useState } from 'react';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { SITE, telHref, whatsappHref } from '../config/site.js';
import { Button, SectionIntro, WhatsAppIcon } from './ui.jsx';

/** Map iframe is created only when it scrolls near view (keeps the page fast). */
function LazyMap() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return setShow(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShow(true), io.disconnect()), { rootMargin: '400px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-full min-h-[320px] bg-sage">
      {show ? (
        <iframe
          title="Map showing KNEEV Orthopaedic Center, 2nd Block, Jayanagar, Bengaluru"
          src={SITE.mapEmbed}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">Loading map…</p>
      )}
    </div>
  );
}

const row = 'flex gap-4 border-b border-line py-5';
const icon = 'mt-0.5 shrink-0 text-forest';

export default function ContactSection() {
  const { address: a } = SITE;
  return (
    <section id="contact" aria-labelledby="contact-title" data-track-section="contact" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="reveal lg:col-span-5">
          <SectionIntro id="contact-title" kicker="Location & Contact" title="Visit KNEEV in Jayanagar" />
          <address className="mt-8 border-t border-line not-italic">
            <div className={row}>
              <MapPin size={20} className={icon} aria-hidden="true" />
              <div>
                <p className="font-heading font-bold text-forest-deep">{SITE.name}</p>
                <p className="mt-1 text-charcoal/85">
                  {a.line1},<br />
                  {a.line2}, {a.city},<br />
                  {a.region} {a.postalCode}
                </p>
                <p className="mt-2 text-sm text-muted">{SITE.directionsNote}</p>
              </div>
            </div>
            <div className={row}>
              <Clock size={20} className={icon} aria-hidden="true" />
              <div className="text-charcoal/85">
                {SITE.hours.map((h) => (
                  <p key={h.days}>
                    <span className="font-semibold text-charcoal">{h.days}:</span> {h.time}
                  </p>
                ))}
              </div>
            </div>
            <div className={row}>
              <Phone size={20} className={icon} aria-hidden="true" />
              <a href={telHref} className="font-semibold text-forest-deep hover:underline">{SITE.phoneDisplay}</a>
            </div>
            <div className={row}>
              <Mail size={20} className={icon} aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="break-all text-forest-deep hover:underline">{SITE.email}</a>
            </div>
          </address>
          <div className="mt-8 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            <Button as="a" href={telHref}>
              <Phone size={17} aria-hidden="true" /> Call the Clinic
            </Button>
            <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="outline">
              <WhatsAppIcon size={19} /> WhatsApp
            </Button>
            <Button as="a" href={SITE.mapsUrl} target="_blank" rel="noopener" variant="outline" className="min-[400px]:col-span-2">
              <Navigation size={17} aria-hidden="true" /> Get Directions
            </Button>
          </div>
        </div>
        <div className="reveal min-h-[320px] overflow-hidden border border-line lg:col-span-7">
          <LazyMap />
        </div>
      </div>
    </section>
  );
}
