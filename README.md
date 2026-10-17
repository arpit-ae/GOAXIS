# GOAXIS CONSULTANCY

Responsive static homepage and frontend foundation for a five-part consultancy website build.

## Part 1 delivered
- Responsive homepage, sticky navigation and mobile navigation menu
- Service cards: website development, GST/Udyam, FSSAI, IEC/APEDA, business documents
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

## Part 1 limitations
The enquiry form does not send or store data. Customer accounts, orders, uploads, database, admin tools, quotations and online payments are planned for later parts. Do not enter actual sensitive information on this preview. Legal pages are drafts and must be reviewed before production. Contact details are placeholders. Prices are omitted until approved.

## Five-part roadmap
1. Part 1 — Homepage and responsive frontend foundation (current).
2. Part 2 — Service catalogue, website-builder requirements and enquiry/quotation workflow.
3. Part 3 — Customer registration/login, dashboard, orders and document interface.
4. Part 4 — Cloudflare Workers backend, D1, R2, admin operations and payment gateway.
5. Part 5 — Security, testing, deployment and launch checklist.

Before launch: add verified contact details, confirm logo/branding and language, review legal pages, and connect a secure backend before accepting enquiries, documents or payments. Keep API secrets in hosting secrets, never in GitHub or frontend code.