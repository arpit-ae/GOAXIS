# GOAXIS CONSULTANCY — Five-Part Build Tracker

Continue cumulatively from this repository. Do not restart or overwrite completed work.

| Part | Scope | Status |
|---|---|---|
| 1 | Homepage and responsive frontend foundation | Complete |
| 2 | Service catalogue, website-builder requirements and enquiry/quotation workflow | Complete — frontend |
| 3 | Customer accounts, dashboard, orders and document interface | Pending |
| 4 | Backend, database, admin dashboard and payment integration | Pending |
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
- [x] Static integration checks: 9/9 passed (links, service keys, form wiring, package mapping, validation indicators and responsive styles)

## Part 2 boundaries

The pages and forms are a frontend prototype. They do not create leads, email the administrator, save customer data, upload documents or take payments. Connect forms to secure APIs and server-side validation in the later backend part. Never collect Aadhaar/PAN numbers, passwords, bank details or identity documents through the initial enquiry form.

## Defaults used

Text-based logo, navy/mint colours, English copy, request-a-quote rather than invented prices, contact placeholders and tagline “Build. Register. Grow.”

Government registrations and licences remain subject to authority rules, eligibility and decisions. Never promise guaranteed approvals or commit payment secrets, passwords or customer documents.
