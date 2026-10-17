# GOAXIS CONSULTANCY — Five-Part Build Tracker

Continue cumulatively from this repository. Do not restart or overwrite completed work.

| Part | Scope | Status |
|---|---|---|
| 1 | Homepage and responsive frontend foundation | Complete |
| 2 | Service catalogue, website-builder requirements and enquiry/quotation workflow | Complete — frontend |
| 3 | Customer accounts, dashboard, orders and document interface | API-integrated; deployment and tests pending |
| 4 | Backend, database, admin dashboard and payment integration | Implemented in branch; Cloudflare configuration and testing pending |
| 5 | Security, testing, deployment and final launch review | Pending |

## Part 1 acceptance

- [x] Homepage, main navigation, services and website-builder teaser
- [x] Responsive layout and mobile navigation
- [x] About and how-it-works sections
- [x] Homepage enquiry form UI and basic browser validation
- [x] Draft Privacy Policy and Terms & Conditions
- [ ] Add verified contact information
- [ ] Confirm logo, colours and language
- [ ] Review legal pages before launch

## Part 2 acceptance

- [x] Services catalogue at `services.html`
- [x] Service detail and enquiry page at `service.html?service=<key>`
- [x] Service information for GST, Udyam, FSSAI, IEC, APEDA, business documents and custom requirements
- [x] Website Builder page with Basic, E-commerce and Custom packages
- [x] Service-enquiry form with contact, business context and requirements fields
- [x] Website quotation form with package, business/project name, contact details, page count, design preferences, features/integrations and timeline
- [x] Browser-side required-field, email, length and phone-pattern validation where applicable
- [x] Package selection buttons populate the quotation form
- [x] Responsive styling and mobile navigation on the new pages
- [x] Quote-only messaging; no unapproved prices or guaranteed government approvals
- [x] Service and website enquiry forms submit to /api/enquiry with consent and feedback (Cloudflare configuration required)
- [x] Static integration checks: 10/10 passed (links, service keys, form wiring, package mapping, validation indicators and responsive styles)

## Part 3 acceptance

- [x] Registration form wired to server signup; name/email/password validation and confirmation
- [x] Login wired to server authentication and secure session cookie
- [x] Customer dashboard redirects unauthenticated visitors to login
- [x] Profile, order list and service-request form wired to persistent APIs
- [x] Private customer document upload/download UI connected to authenticated endpoints
- [x] Cashfree checkout button is offered only for a server-priced order awaiting payment
- [x] Logout clears the server-side session
- [ ] Browser/device and deployed end-to-end tests (Part 5)

## Part 3 boundaries

Frontend code is integrated but will not operate as a complete portal from a static file URL. It requires the Pages Function API, D1/R2 bindings and correctly configured payment secrets. Email verification and password reset are not included. Do not collect real sensitive documents before Part 5 malware-scanning, retention and privacy controls are reviewed.

## Part 2 boundaries

The pages and forms are a frontend prototype. They do not create leads, email the administrator, save customer data, upload documents or take payments. Connect forms to secure APIs and server-side validation in the later backend part. Never collect Aadhaar/PAN numbers, passwords, bank details or identity documents through the initial enquiry form.

## Defaults used

Text-based logo, navy/mint colours, English copy, request-a-quote rather than invented prices, contact placeholders and tagline “Build. Register. Grow.”

Government registrations and licences remain subject to authority rules, eligibility and decisions. Never promise guaranteed approvals or commit payment secrets, passwords or customer documents.


## Part 4 implementation checklist

- [x] Route /api/* from Pages Functions to src/worker.js
- [x] Add migration 0002_part4_backend.sql with namespaced app_* D1 tables and service catalogue
- [x] Add password hashing, opaque hashed session tokens, HttpOnly/Secure/SameSite cookies and basic login throttling
- [x] Add profile, service list, enquiry, order request/list/detail APIs
- [x] Add owner/admin authorization for private R2 upload and download; supported types and 5 MB cap
- [x] Add admin lead review, quote creation, workflow status and document verification APIs and UI
- [x] Add Cashfree hosted checkout, raw-body webhook signature checks, server-side verification and amount/currency matching
- [x] Wire signup/login/dashboard/home/service/website enquiry forms to API endpoints
- [x] Document bindings, Cashfree secrets, first-admin bootstrap and sandbox checks
- [ ] Replace the D1 database ID placeholder and create/verify Cloudflare D1/R2 resources
- [ ] Add Cashfree sandbox secrets and bootstrap the first administrator
- [ ] Run live preview smoke tests and payment sandbox tests during Part 5

Code changes are implemented on the Part 4 feature branch; deployment and actual gateway testing are not claimed complete.
