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
- `dashboard.html`: dynamically generated demo request IDs, request creation, 11-stage illustrative status tracking, profile editor, and document-metadata preview.
- `part3.css` and `part3.js`: responsive portal styling, signup/login password-verifier demonstration, browser-tab session gate, local-only demo order creation, unique `GOAX-YYYY-00001`-style IDs, document metadata selection, and logout.
- Customer Login navigation added to the existing homepage, services catalogue, service details and website-builder pages.

**Important security boundary:** Part 3 is a browser-only UI/workflow prototype, not production authentication. The raw password is not stored, but a salted PBKDF2 verifier and profile are held in this tab's session storage for the sign-in demonstration. Demo orders and file metadata also stay in this tab; they are not sent to GOAXIS and do not sync across tabs/devices. Selecting a file never uploads or reads its contents. Do not use real or reused passwords or sensitive customer documents. Part 4 must replace the demo with server-side authentication, secure sessions, D1 persistence, authorization checks and private R2 uploads before collecting real customer data.

## Preview locally

You can open `index.html` directly to inspect the static pages. To test the Part 3 signup/login flow, run a local HTTP server so the browser's Web Crypto API is available:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. The customer account, request records and selected-file metadata remain local to the current browser tab and are cleared when that tab session ends.

## Current form behaviour and limitations

The homepage, service-enquiry and website-quotation forms are frontend previews. Browser validation runs, but form details are **not sent to an administrator or saved**. Part 3 adds a separate browser-only account and order workflow demonstration; it is not a server-backed customer account system. There is no database, real document upload, lead creation, email notification or payment processing yet. Those require later backend implementation. Do not enter actual sensitive information into the preview forms.

Before launch, add verified contact details, confirm branding and language, review the legal drafts, connect secure APIs with server-side validation, and test the full workflow. Keep API secrets in hosting secrets, never in GitHub or frontend code.

## Five-part roadmap

1. **Part 1 — Complete:** Homepage and responsive frontend foundation.
2. **Part 2 — Complete (frontend):** Service catalogue, service detail pages, website-builder packages and browser-validated enquiry/quotation forms.
3. **Part 3 — Complete (frontend prototype):** Signup/login with browser-tab password-verifier check, protected-by-JavaScript dashboard gate, generated demo request IDs, 11 illustrative status stages, profile editing and document metadata preview. Real server authentication and persistence remain Part 4 work.
4. **Part 4 — Implemented in branch:** Cloudflare Pages API routes, D1 schema, server-side account/session APIs, private R2 upload endpoint, Cashfree sandbox payment/webhook handling, admin APIs and admin console. Cloudflare bindings/secrets and frontend API wiring are still required before real use.
5. **Part 5 — Release preparation added:** Cloudflare Pages security headers, GitHub Actions static validation, configurable deployment smoke test and `PART5-DEPLOYMENT.md` launch runbook. Cloudflare resources/secrets, full frontend-to-API wiring, rate limiting, email verification/password reset and end-to-end sandbox tests remain launch blockers; see `PART5-DEPLOYMENT.md`.

## Part 2 static integration checks

The implementation was checked for the existence of all Part 2 files, local page links, matching service-query keys, enquiry form wiring, package selection mapping, browser validation markers, truthful frontend-only submission notices and responsive CSS. All 10 checks passed. These are static integration checks; a full browser/device and production end-to-end test remains part of the final QA work.


## Part 4 implementation branch

Backend implementation is merged into `main`. See `PART4-SETUP.md` for required Cloudflare setup, secret names, first-admin promotion, API routes and security boundaries. This is not live until the D1/R2 bindings and Cashfree sandbox secrets are configured and deployed. Existing Part 3 pages still use their frontend demo behavior; Part 5 must connect those forms to the APIs.
