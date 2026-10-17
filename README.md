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

## Part 3 delivered — customer portal integrated

- signup.html and login.html call the server-side account endpoints; passwords are not held in browser storage.
- dashboard.html loads the signed-in user's profile and orders, supports service requests, edits the profile, and uploads files against an order.
- part3.js handles authenticated API requests, feedback, logout, order status and Cashfree hosted checkout.
- Customer order and document access is enforced on the server; the browser cannot set a payable amount.
- Cloudflare bindings/secrets and end-to-end tests are required before real use; email verification and password reset are not included.

## Part 4 delivered in code — configuration still required

- src/worker.js: API handlers for accounts/sessions, services, enquiries, orders, admin operations, private document access, and Cashfree payments.
- migrations/0002_part4_backend.sql: namespaced D1 tables preserve the earlier prototype schema and migration history.
- admin.html, admin.js and admin.css: administrator portal to review leads, quote orders, update workflow status and verify documents.
- functions/api/[[path]].js routes /api/* requests to the Worker module.
- payment-return.html and payment-result.js check payment status through the server rather than treating a redirect as proof of payment.
- Homepage, service and website-builder enquiries now submit to the API instead of showing a prototype-only success message.

**Important:** these are code changes, not a claim that the live Cloudflare site is deployed. Follow PART4-SETUP.md to apply the migration, replace the D1 ID placeholder, verify R2 bindings and add Cashfree sandbox secrets. Complete Part 5 end-to-end tests before live payments or real sensitive-document collection.

## Preview locally

Open `index.html` directly, or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Current form behaviour and limitations

Enquiry forms call /api/enquiry and save records to D1 when the Cloudflare backend is correctly configured and deployed. Opening index.html from a file URL or using a static-only server does not provide the API. For browser testing, run the site through Cloudflare Pages/Wrangler with D1/R2 bindings configured. Email notifications and password reset are not implemented. Do not upload real sensitive documents before Part 5 security checks.

Before launch, add verified contact details, confirm branding and language, review the legal drafts, connect secure APIs with server-side validation, and test the full workflow. Keep API secrets in hosting secrets, never in GitHub or frontend code.

## Five-part roadmap

1. **Part 1 — Complete:** Homepage and responsive frontend foundation.
2. **Part 2 — Complete (frontend):** Service catalogue, service detail pages, website-builder packages and browser-validated enquiry/quotation forms.
3. **Part 3 — Integrated with Part 4 APIs:** Signup/login, customer dashboard, persistent order tracking, profile editor and authenticated private document upload; live use requires Cloudflare resources and testing.
4. **Part 4 — Implemented in branch:** Pages Functions API, D1 migration, server-side accounts/sessions, private R2 upload/download, Cashfree hosted checkout/webhook checks, admin APIs/console and frontend wiring. Cloudflare bindings/secrets and end-to-end verification remain.
5. **Part 5 — Pending:** Browser and payment-sandbox end-to-end tests, malware scanning, security/privacy review, deployment and launch checklist.

## Part 2 static integration checks

Earlier static checks covered page links, service keys, package selection and form validation. Part 4 changes enquiries to API submissions; a browser/device test against configured Cloudflare preview resources is still required.


## Part 4 implementation branch

Backend implementation is on feature/part4-backend-payments. See PART4-SETUP.md for migration, D1/R2 setup, Cashfree sandbox secrets, one-time admin bootstrap and security boundaries. This is not live until the branch is merged/deployed and the configured preview passes end-to-end tests.
