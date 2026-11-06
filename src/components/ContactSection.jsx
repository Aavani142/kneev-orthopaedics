import { useEffect, useRef, useState } from 'react';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { SITE, telHref, whatsappHref } from '../config/site.js';
import { Button, SectionIntro, WhatsAppIcon } from './ui.jsx';
import { Reveal } from './motion.jsx';

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
    <div ref={ref} className="relative h-full bg-stone grayscale-[35%]">
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

const row = 'flex gap-4 border-b border-line py-6';
const icon = 'mt-0.5 shrink-0 text-forest';

/** Location & contact details, then a full-width Google Map directly above the footer. */
export default function ContactSection() {
  const { address: a } = SITE;
  return (
    <>
      <section id="contact" aria-labelledby="contact-title" data-track-section="contact" className="bg-ivory py-20 sm:py-24 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionIntro id="contact-title" kicker="Location & Contact" title="Visit KNEEV *in Jayanagar*" />
            <div className="mt-8 flex flex-col gap-3">
              <Button as="a" href={telHref}>
                <Phone size={17} aria-hidden="true" /> Call the Clinic
              </Button>
              <Button as="a" href={whatsappHref()} target="_blank" rel="noopener" variant="whatsapp">
                <WhatsAppIcon size={19} /> WhatsApp
              </Button>
              <Button as="a" href={SITE.mapsUrl} target="_blank" rel="noopener" variant="outline">
                <Navigation size={17} aria-hidden="true" /> Get Directions
              </Button>
            </div>
          </div>

          <Reveal as="address" delay={0.1} className="grid gap-x-12 border-t border-line not-italic sm:grid-cols-2 lg:col-span-8">
            <div className={row}>
              <MapPin size={20} className={icon} aria-hidden="true" />
              <div>
                <p className="font-serif text-xl text-forest-deep">{SITE.name}</p>
                <p className="mt-1 text-charcoal/85">
                  {a.line1},<br />
                  {a.line2}, {a.city},<br />
                  {a.region} {a.postalCode}
                </p>
              </div>
            </div>
            <div className={row}>
              <Navigation size={20} className={icon} aria-hidden="true" />
              <div>
                <p className="font-serif text-xl text-forest-deep">Getting here</p>
                <p className="mt-1 text-charcoal/85">{SITE.directionsNote}</p>
              </div>
            </div>
            <div className={row}>
              <Clock size={20} className={icon} aria-hidden="true" />
              <div>
                <p className="font-serif text-xl text-forest-deep">Clinic hours</p>
                <div className="mt-1 text-charcoal/85">
                  {SITE.hours.map((h) => (
                    <p key={h.days}>
                      <span className="font-semibold text-charcoal">{h.days}:</span> {h.time}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className={row}>
              <Phone size={20} className={icon} aria-hidden="true" />
              <div>
                <p className="font-serif text-xl text-forest-deep">Phone &amp; email</p>
                <p className="mt-1">
                  <a href={telHref} className="font-semibold text-forest-deep hover:underline">{SITE.phoneDisplay}</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={15} className="shrink-0 text-forest" aria-hidden="true" />
                  <a href={`mailto:${SITE.email}`} className="break-all text-forest-deep hover:underline">{SITE.email}</a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Google Maps: full width, directly above the footer */}
      <section aria-label="Map showing the clinic location" data-track-section="map" className="relative h-[360px] bg-stone sm:h-[440px]">
        <LazyMap />
      </section>
    </>
  );
}
