# GOAXIS CONSULTANCY

Responsive static homepage and frontend foundation for a five-part consultancy website build.

## Part 1 delivered
- Responsive homepage, sticky navigation and mobile navigation menu
- Service cards: website development, GST/Udyam, FSSAI, IEC/APEDA and business documents
- Website Builder section and quote-request calls to action
- How-it-works, About and contact sections
- Enquiry form UI with browser-side validation
- Draft Privacy Policy and Terms & Conditions
- Static files with no API credentials or secrets

## Preview locally
Open `index.html` directly, or run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Part 2 delivered (feature branch)
- Service catalogue at `services.html` with website development, GST, Udyam, FSSAI, IEC, APEDA/export documentation, business documents and custom enquiries.
- Reusable service detail/enquiry page at `service.html?service=<key>`; current keys: `gst`, `udyam`, `fssai`, `iec`, `apeda`, `documents`, `other`.
- Website Builder packages and requirements/quotation form at `website-builder.html`.
- Client-side required-field, email and basic phone validation; accessible feedback and responsive styles in `part2.css` / `part2.js`.
- Homepage navigation and service links connect to the new pages.
- No fixed prices are published: all services show “Quotation required” until pricing is approved. Government/third-party fees and approval caveats are explicit.

## Part 2 limitations
The forms are prototypes: validation runs in the browser, but no lead is sent or saved. Do not enter actual sensitive information. No file uploads, login, database, email delivery or payment collection is implemented yet. Before production, connect forms to a secured backend with server-side validation, spam/rate controls, a privacy notice, and appropriate retention/access controls.

## Part 1 limitations
The enquiry form does not send or store data. Customer accounts, orders, uploads, database, admin tools, quotations and online payments are planned for later parts. Do not enter actual sensitive information on this preview. Legal pages are drafts and must be reviewed before production. Contact details are placeholders. Prices are omitted until approved.

## Five-part roadmap
1. Part 1 — Homepage and responsive frontend foundation (current).
2. Part 2 — Service catalogue, website-builder requirements and enquiry/quotation workflow (implemented on feature branch; frontend-only).
3. Part 3 — Customer registration/login, dashboard, orders and document interface.
4. Part 4 — Cloudflare Workers backend, D1, R2, admin operations and payment gateway.
5. Part 5 — Security, testing, deployment and launch checklist.

Before launch: add verified contact details, confirm logo/branding and language, review legal pages, and connect a secure backend before accepting enquiries, documents or payments. Keep API secrets in hosting secrets, never in GitHub or frontend code.