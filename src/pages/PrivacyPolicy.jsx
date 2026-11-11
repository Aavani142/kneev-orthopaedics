// NOTE FOR CLINIC: have this policy reviewed by your legal adviser before launch.
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/img/logo.png';
import { SITE } from '../config/site.js';

const SECTIONS = [
  {
    h: 'Information we collect',
    p: [
      'When you submit the consultation form, your name, mobile number and location are placed into a WhatsApp message addressed to the clinic. Nothing is sent until you choose to send that message in WhatsApp, and the form details are not stored by this website.',
      'This page also measures, through Google Analytics and Google Ads, how visitors reached it (for example Google Ads click identifiers and campaign parameters) and whether the enquiry form was used. These measurements do not include your name or phone number.',
    ],
  },
  {
    h: 'How we use it',
    p: [
      'We use the details you send us on WhatsApp only to respond to your enquiry and arrange a consultation. Messages you send on WhatsApp are handled under WhatsApp’s own terms and privacy policy. Campaign information helps us understand which advertisements are useful, so we can improve them.',
    ],
  },
  {
    h: 'Sharing',
    p: [
      'We do not sell your information. It is processed by service providers that help us run this website and receive enquiries — for example WhatsApp (Meta) and Google Analytics / Google Ads — only for these purposes.',
    ],
  },
  {
    h: 'Cookies and analytics',
    p: [
      'This page may use cookies and similar technologies from Google to measure visits and advertising performance. You can block or delete cookies in your browser settings.',
    ],
  },
  {
    h: 'Retention and your rights',
    p: [
      'We keep enquiry details only as long as needed to respond to you and to meet legal obligations. Under the Digital Personal Data Protection Act, 2023, you may ask to access, correct or delete your information, or withdraw your consent to be contacted, at any time.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <a href="/"><img src={logo} alt="Kneev Orthopaedic Center" className="h-10 w-auto" /></a>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </a>
        </div>
      </header>
      <main className="container-page max-w-3xl py-12">
        <h1 className="font-heading text-4xl font-semibold text-forest-deep">Privacy Policy</h1>
        <p className="mt-3 text-muted">How {SITE.name} handles the information you share through this website.</p>
        {SECTIONS.map((s) => (
          <section key={s.h} className="mt-8">
            <h2 className="text-xl font-semibold text-forest-deep">{s.h}</h2>
            {s.p.map((t) => <p key={t.slice(0, 20)} className="mt-2 leading-relaxed text-charcoal/85">{t}</p>)}
          </section>
        ))}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-forest-deep">Contact</h2>
          <p className="mt-2 leading-relaxed text-charcoal/85">
            For any privacy request, email <a className="font-semibold text-forest underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phoneDisplay}.
            <br />
            {SITE.name}, {SITE.address.line1}, {SITE.address.line2}, {SITE.address.city} {SITE.address.postalCode}.
          </p>
        </section>
      </main>
    </div>
  );
}
