# GOAXIS CONSULTANCY — Five-Part Build Tracker

Continue cumulatively from this repository. Do not restart or overwrite completed work.

| Part | Scope | Status |
|---|---|---|
| 1 | Homepage and responsive frontend foundation | Complete |
| 2 | Service catalogue, website-builder requirements and enquiry/quotation workflow | Complete — frontend |
| 3 | Customer accounts, dashboard, orders and document interface | Complete — frontend preview |
| 4 | Backend, database, admin dashboard and payment integration | Backend committed; Cloudflare configuration and testing pending |
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
- [x] Forms disclose that submissions are preview-only and are not sent or saved
- [x] Static integration checks: 10/10 passed (links, service keys, form wiring, package mapping, validation indicators and responsive styles)

## Part 3 acceptance

- [x] Registration page with required name/email/password and confirmation validation
- [x] Login preview and redirect to dashboard for a matching session profile
- [x] Dashboard route checks for a demo session and redirects to login otherwise
- [x] Profile display and browser-session profile editing
- [x] Example order IDs, status cards and progress milestones
- [x] Document selection UI with file type/size checks and clear preview-only messaging
- [x] Logout action and customer-login links added to existing public pages
- [x] Responsive styling and accessible form feedback
- [ ] Production authentication, persistent orders and real document upload (Part 4)
- [ ] Browser/device and production end-to-end testing (Part 5)

## Part 3 boundaries

This is only a frontend demonstration. It does not store passwords, authenticate users securely, create real orders, save profile data to a server, or upload files. The demo profile exists only in the browser session. Never enter real passwords or sensitive identity documents. Part 4 must implement server-side identity, secure sessions, authorization, D1 persistence and private R2 storage before collecting real customer information.

## Part 2 boundaries

The pages and forms are a frontend prototype. They do not create leads, email the administrator, save customer data, upload documents or take payments. Connect forms to secure APIs and server-side validation in the later backend part. Never collect Aadhaar/PAN numbers, passwords, bank details or identity documents through the initial enquiry form.

## Defaults used

Text-based logo, navy/mint colours, English copy, request-a-quote rather than invented prices, contact placeholders and tagline “Build. Register. Grow.”

Government registrations and licences remain subject to authority rules, eligibility and decisions. Never promise guaranteed approvals or commit payment secrets, passwords or customer documents.


## Part 4 implementation checklist

- [x] Add Pages Function API router and Worker handlers
- [x] Add D1 migration for users, sessions, services, leads, orders, payments and documents
- [x] Add server-side password hashing and hashed session tokens
- [x] Add customer, service, enquiry and order API endpoints with authorization
- [x] Add private R2 upload endpoint with file size/type checks
- [x] Add Cashfree sandbox order creation and signed webhook handling
- [x] Add admin overview, order status/price approval and document verification APIs
- [x] Add admin operations UI and setup documentation
- [ ] Replace wrangler.toml placeholder database ID and create D1/R2 resources
- [ ] Add Cashfree sandbox secrets in Cloudflare (not GitHub)
- [ ] Promote a verified account to admin using the documented D1 command
- [ ] Connect Part 3 frontend forms/dashboard and enquiry forms to APIs
- [ ] Run sandbox webhook, upload, browser and authorization tests in Part 5
