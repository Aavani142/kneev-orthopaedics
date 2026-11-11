# KNEEV Orthopaedic Center: Campaign Landing Page

Google Ads landing page for Knee Replacement and ACL enquiries.
Stack: React 18, Vite 6, Tailwind CSS 4, Framer Motion and Lucide icons. It's a static site with no backend.

## Run

```bash
npm install
npm run dev              # http://localhost:5180
```

`npm run build` creates `dist/`, which you can deploy to any static host (Vercel, Netlify, S3 and so on).
To serve it with Node instead, run `npm start` (port 3000).

## How enquiries work

The popup form and the on-page form share one component, `src/components/LeadForm.jsx`, with its logic in `src/hooks/useLeadForm.js`.

1. The visitor enters their full name, mobile number and location.
2. The form validates these with the shared rules in `shared/lead-schema.js`. Mobile numbers must be valid Indian numbers.
3. On Submit, WhatsApp opens (`https://wa.me/<number>?text=…`) with a pre-filled, URL-encoded message. The message is built in `src/services/leadService.js`.
4. The visitor taps **Send** in WhatsApp. The page tells them clearly that the enquiry is only sent once they do this.
5. If the browser blocks the new window, the page shows an **Open WhatsApp** button instead. The entered details are kept in every state, and **Edit details** goes back to the filled-in form.

The WhatsApp number is set by `VITE_CLINIC_WHATSAPP`, or comes from the default in `src/config/site.js`. It's the same number used by every WhatsApp button on the site.

The website can't see whether the visitor actually tapped Send, and it never claims that a message was delivered.

## Tracking (`src/services/trackingService.js`)

The page sends these events:
- `consultation_popup_open`
- `consultation_cta_click`
- `phone_click`
- `whatsapp_click`
- `whatsapp_enquiry_opened`, sent when a valid form opens WhatsApp. This records intent only; WhatsApp gives no "sent" signal back to the page.

If you set `VITE_GTM_ID`, the page pushes events to the dataLayer and you configure tags in GTM. Otherwise set `VITE_GA4_ID`, `VITE_GOOGLE_ADS_ID` and the conversion labels.

GCLID, GBRAID, WBRAID and all UTM parameters are captured on landing and attached to `whatsapp_enquiry_opened`.

## Needs clinic confirmation before launch

| Item | Where |
| --- | --- |
| Confirm the WhatsApp number that should receive enquiries | `VITE_CLINIC_WHATSAPP` / `src/config/site.js` |
| Years of experience and hospital affiliations | `src/content/doctor.js` (currently hidden) |
| Directions note (South End Circle Metro, parking) | `src/config/site.js` |
| Genuine, approved testimonials (not shown on the current page) | `src/content/testimonials.js` |
| Privacy policy legal review | `src/pages/PrivacyPolicy.jsx` |
| Absolute `og:image` URL on the live domain | `index.html` |
| Permission to use the clinic photographs in ads | `src/assets/img/` |
