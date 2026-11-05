# KNEEV Orthopaedic Center: Campaign Landing Page

Google Ads landing page for Knee Replacement and ACL Reconstruction enquiries.
Stack: React 18, Vite 6, Tailwind CSS 4, Lucide icons. The backend is plain Node with no framework.

## Run

```bash
npm install
cp .env.example .env     # for local testing set LEAD_DEV_ECHO=true
npm run dev              # http://localhost:5180
```

Production on any Node 18+ host (VPS, container, Render, Railway and similar):

```bash
npm run build
npm start                # serves dist/ and POST /api/lead on PORT (default 3000)
```

## Lead pipeline (`server/lead-handler.js`)

1. **Validate.** The browser and server share the same rules (`shared/lead-schema.js`), including Indian mobile numbers.
2. **Block spam.** A honeypot field, per-IP rate limiting, an optional `ALLOWED_ORIGINS` list, and duplicate blocking (same lead ID, or the same mobile and treatment within 15 minutes).
3. **Store.** Each lead is appended to `data/leads.jsonl`. The file is outside the public web root, has file mode 0600 and is ignored by git.
4. **Notify.** Email goes out by SMTP or Resend, WhatsApp by the Meta Cloud API (needs an approved template), and an optional webhook can forward to a CRM or Google Sheets.
5. **Report honestly.** The browser shows success only when at least one notification channel actually delivered. Otherwise it shows an error with WhatsApp and call fallbacks. The success screen also offers a prefilled WhatsApp message to the clinic.

The browser stores only a status flag and timestamps, never names or phone numbers.

## Tracking (`src/services/trackingService.js`)

The page sends these events: `consultation_popup_open`, `consultation_cta_click`, `phone_click`, `whatsapp_click`, and `generate_lead`. `generate_lead` fires only after the server confirms the lead.

If you set `VITE_GTM_ID`, the page pushes events to the dataLayer and you configure tags in GTM. Otherwise set `VITE_GA4_ID`, `VITE_GOOGLE_ADS_ID` and the conversion labels.

GCLID, GBRAID, WBRAID and all UTM parameters are captured on landing, kept for 90 days, and sent with every lead.

## Needs clinic confirmation before launch

| Item | Where |
| --- | --- |
| Years of experience ("over a decade" on the home page vs "15+ years" on the Why KNEEV page) | `src/content/doctor.js` (currently hidden) |
| Hospital affiliations (worded differently on different pages) | `src/content/doctor.js` (currently hidden) |
| Medical review of all treatment content and FAQ answers | `src/components/KneeReplacement.jsx`, `ACLReconstruction.jsx`, `src/content/faqs.js` |
| Medical review of the knee diagrams | `src/components/illustrations.jsx` |
| Phone, WhatsApp and email are authorised for campaign enquiries | `.env` (`VITE_CLINIC_*`, `LEAD_EMAIL_TO`, `WHATSAPP_TO`) |
| Directions note (South End Circle Metro, parking), taken from the clinic site | `src/config/site.js` |
| Exact Google Maps embed link | `VITE_CLINIC_MAP_EMBED` |
| Genuine, approved testimonials (the section stays hidden while empty) | `src/content/testimonials.js` |
| Privacy policy legal review | `src/pages/PrivacyPolicy.jsx` |
| Absolute `og:image` URL on the live domain | `index.html` |
| Permission to use the clinic photographs in ads (taken from the clinic website) | `src/assets/img/` |

In development builds, dashed "Dev note" boxes mark the places that need confirmation. They never appear in production builds.
