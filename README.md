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
5. **Part 5 — Pending:** Connect all existing forms/dashboard to the API, security review, browser/end-to-end tests, deployment and launch checklist.

## Part 2 static integration checks

The implementation was checked for the existence of all Part 2 files, local page links, matching service-query keys, enquiry form wiring, package selection mapping, browser validation markers, truthful frontend-only submission notices and responsive CSS. All 10 checks passed. These are static integration checks; a full browser/device and production end-to-end test remains part of the final QA work.


## Part 4 implementation branch

The Part 4 backend has been merged into `main`. See `PART4-SETUP.md` for required Cloudflare setup, secret names, first-admin promotion, API routes and security boundaries. It is not live until the D1/R2 bindings and Cashfree sandbox secrets are configured and deployed.

## Part 5 — integration and release readiness

Part 5 is in `feature/part5-production-readiness` for review. It connects homepage, service and website-quotation forms to the enquiry API; switches signup/login to server-side session cookies; connects customer orders, profile updates, private document upload and Cashfree sandbox checkout; and changes the payment-return page to display server-confirmed order status. The browser-only Part 3 handlers are disabled when `part5.js` is loaded. Security response headers are configured for static assets and API responses, a GitHub Actions syntax/smoke-test workflow is included, and `PART5-LAUNCH-CHECKLIST.md` records the remaining release gates.

**Release status: not production-ready yet.** Replace the D1 placeholder, configure the real Cloudflare D1/R2 bindings and sandbox secrets, configure rate limiting, implement email verification and password reset, arrange malware scanning or a safe document-upload policy, finish legal-policy review, and run full browser/payment end-to-end tests. Keep Cashfree in sandbox until these checks pass. The included smoke test is a static integration test, not proof that the live account, database, object storage or gateway works.
