// NOTE FOR CLINIC: have this policy reviewed by your legal adviser before launch.
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/img/logo.png';
import { SITE } from '../config/site.js';

const SECTIONS = [
  {
    h: 'Information we collect',
    p: [
      'When you submit a consultation request we collect your name, mobile number, city, the treatment you are interested in, your preferred contact time, and the date and time you gave consent to be contacted.',
      'We also record how you reached this page, such as Google Ads click identifiers (GCLID, GBRAID, WBRAID) and campaign (UTM) parameters, along with basic technical details such as your browser type.',
    ],
  },
  {
    h: 'How we use it',
    p: [
      'We use your details only to contact you by phone call or WhatsApp about your enquiry and to arrange a consultation. Enquiries are stored securely on our server and shared with the clinic team by email or WhatsApp notification. Please do not send medical reports through the website form. Campaign information helps us understand which advertisements are useful, so we can improve them.',
    ],
  },
  {
    h: 'Sharing',
    p: [
      'We do not sell your information. It is processed by service providers that help us run this website and receive enquiries — for example email delivery, WhatsApp Business messaging (Meta) and Google Analytics / Google Ads — only for these purposes.',
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
          <a href="/"><img src={logo} alt="KNEEV Orthopaedic Center" className="h-10 w-auto" /></a>
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
