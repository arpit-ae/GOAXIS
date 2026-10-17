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

## Part 3 delivered — customer portal frontend preview

- `signup.html`: registration form with name, email, optional company/phone and password confirmation.
- `login.html`: browser-session demo sign-in.
- `dashboard.html`: example order cards and IDs, progress tracking, profile editor and document-selection interface.
- `part3.css` and `part3.js`: responsive portal styling, client-side validation, session-only demo profile and logout.
- Customer Login navigation added to the existing homepage, services catalogue, service details and website-builder pages.

**Important security boundary:** Part 3 is a UI prototype, not real authentication. Passwords are not stored; the profile is held in browser session storage. Demo order records are hardcoded and document selection only previews the filename—the file is not uploaded. Do not use real passwords or sensitive customer documents. Part 4 must replace the demo with server-side authentication, secure session cookies, D1 persistence, authorization checks and private R2 uploads before any real customer data is collected.

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
3. **Part 3 — Complete (frontend preview):** Signup/login UI, customer dashboard, sample order tracking, profile editor and document-selection UI. Server authentication and persistence are deferred to Part 4.
4. **Part 4 — Implemented in branch:** Cloudflare Pages API routes, D1 schema, server-side account/session APIs, private R2 upload endpoint, Cashfree sandbox payment/webhook handling, admin APIs and admin console. Cloudflare bindings/secrets and frontend API wiring are still required before real use.
5. **Part 5 — Pending:** Connect all existing forms/dashboard to the API, security review, browser/end-to-end tests, deployment and launch checklist.

## Part 2 static integration checks

The implementation was checked for the existence of all Part 2 files, local page links, matching service-query keys, enquiry form wiring, package selection mapping, browser validation markers, truthful frontend-only submission notices and responsive CSS. All 10 checks passed. These are static integration checks; a full browser/device and production end-to-end test remains part of the final QA work.


## Part 4 implementation branch

Backend implementation is merged into `main`. See `PART4-SETUP.md` for required Cloudflare setup, secret names, first-admin promotion, API routes and security boundaries. This is not live until the D1/R2 bindings and Cashfree sandbox secrets are configured and deployed. Existing Part 3 pages still use their frontend demo behavior; Part 5 must connect those forms to the APIs.
