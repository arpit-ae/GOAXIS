# GOAXIS CONSULTANCY

Responsive static website for a consultancy offering website development and practical business registration, compliance and import-export documentation assistance.

## Part 1 delivered — homepage foundation

- Responsive homepage, sticky navigation and mobile navigation
- Service highlights for website development, GST/Udyam, FSSAI, IEC/APEDA and business documentation
- About, process/how-it-works and contact sections
- Enquiry form UI with browser-side validation
- Draft Privacy Policy and Terms & Conditions

## Part 2 delivered — service catalogue and quotation workflow

- `services.html`: catalogue of eight service areas, with links to detailed service pages
- `service.html?service=<key>`: service descriptions, scope/checklist guidance and service enquiry form for GST, Udyam, FSSAI, IEC, APEDA, business documents and other requirements
- `website-builder.html`: Basic Business Website, E-commerce Website and Custom Website/Web App packages
- Website project brief captures package, project name, contact person, email, phone, approximate page count, design preferences, required features/integrations and target timeline
- Service enquiry captures contact information, optional business context and the requirement
- Client-side validation, responsive styles, shared navigation and package-to-form selection
- Quote-only prices until actual fees are approved; government approvals and timelines are not guaranteed

## Preview locally

Open `index.html` directly, or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Current form behaviour and limitations

The homepage, service-enquiry and website-quotation forms are frontend previews. Browser validation runs, but form details are **not sent to an administrator or saved**. There is no database, customer account system, document upload, lead creation, email notification or payment processing yet. Those require later backend implementation. Do not enter actual sensitive information into the preview forms.

Before launch, add verified contact details, confirm branding and language, review the legal drafts, connect secure APIs with server-side validation, and test the full workflow. Keep API secrets in hosting secrets, never in GitHub or frontend code.

## Five-part roadmap

1. **Part 1 — Complete:** Homepage and responsive frontend foundation.
2. **Part 2 — Complete (frontend):** Service catalogue, service detail pages, website-builder packages and browser-validated enquiry/quotation forms.
3. **Part 3 — Pending:** Customer registration/login, dashboard, orders and document interface.
4. **Part 4 — Pending:** Cloudflare Workers APIs, D1 database, R2 document storage, admin operations and payment gateway.
5. **Part 5 — Pending:** Security review, end-to-end tests, deployment and launch checklist.

## Part 2 static integration checks

The implementation was checked for the existence of all Part 2 files, local page links, matching service-query keys, enquiry form wiring, package selection mapping, browser validation markers, truthful frontend-only submission notices and responsive CSS. All 10 checks passed. These are static integration checks; a full browser/device and production end-to-end test remains part of the final QA work.
