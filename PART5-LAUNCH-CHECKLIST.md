# GOAXIS CONSULTANCY — Part 5 Production Launch Checklist

Part 5 connects the customer-facing workflows to the Part 4 API, adds a static integration test, prepares security headers, and defines the release gate. This checklist is deliberately strict: a source-code change cannot create Cloudflare resources, activate merchant credentials, verify a domain, or prove an end-to-end payment works.

## 1. Cloudflare setup

- [ ] Create the production D1 database; replace the placeholder D1 database ID in wrangler.toml with the real ID.
- [ ] Create the private R2 bucket with the exact configured name and confirm the DB and R2_BUCKET bindings exist in both Preview and Production.
- [ ] Apply D1 migrations to the intended environment using the Wrangler version and migration command verified for your account.
- [ ] Add Cashfree credentials as encrypted Cloudflare secrets. Keep the environment in sandbox until the merchant and webhook setup are verified.
- [ ] Deploy a Preview environment and verify GET /api/health, GET /api/services, signup, login, logout and customer order ownership checks.
- [ ] Verify HTTPS and the custom domain certificate before testing cookie-backed accounts. Configure domain/DNS only after confirming the intended domain.
- [ ] Run any database migration on Preview first. Back up existing customer data before production migration and document rollback steps.

## 2. Accounts and access control

- [ ] Create the initial owner account, verify the owner's email out-of-band, then promote only that verified account in D1: UPDATE Users SET role='admin' WHERE email='YOUR_VERIFIED_ADMIN_EMAIL';. Never expose admin promotion in public signup.
- [ ] Test incorrect passwords, duplicate email, expired/invalid sessions, logout, unauthenticated dashboard access and attempts to read another customer's order.
- [ ] Implement and verify production email verification and password reset before enabling public customer registration. These flows need a verified sender and email provider and are not implemented in the current repository.
- [ ] Configure edge rate limits/WAF rules for /api/login, /api/signup, /api/enquiry, /api/orders and /api/payments/create. Test 429 responses and tune thresholds; code tests cannot confirm dashboard rules.
- [ ] Review session lifetime and account recovery. Keep session tokens HttpOnly, Secure and SameSite; never log passwords, tokens or payment secrets.

## 3. Enquiries and customer workflows

- [ ] Submit homepage enquiry, service enquiry and website quote forms. Confirm exactly one Leads record is created with the expected contact and requirement details.
- [ ] Confirm the dashboard loads server-backed customer/profile/order data, updates profile details, creates an order with a server-generated ID and displays the server's status.
- [ ] Confirm the server—not browser input—sets order price. Approve a test quotation from the admin console, then verify the approved amount appears in the dashboard.
- [ ] Upload test PDF, JPG and PNG files under 10 MB. Confirm a document row is added and the object lands in private R2. Reject empty, oversized, unsupported and MIME-mismatched files.
- [ ] Configure malware scanning/quarantine and an incident/retention process before accepting real identity or business documents. The current upload endpoint checks the declared MIME type and size but does not scan the file bytes. Use only non-sensitive test documents until this is resolved.
- [ ] Confirm public enquiries are not lost silently when the backend is unavailable. Verify error messages are visible and users can retry without accidentally creating duplicate leads.

## 4. Cashfree sandbox payment tests

- [ ] Use sandbox credentials only. Confirm the customer order has an approved amount greater than zero before starting checkout.
- [ ] Verify checkout starts using the server-created payment_session_id; never send the Cashfree secret to the browser.
- [ ] Configure the correct Cashfree webhook URL for each environment: https://YOUR_DOMAIN/api/payments/webhook.
- [ ] Verify valid, invalid-signature, failed, duplicate and delayed webhook cases. A redirect to payment-return.html is not evidence of payment; only the verified server webhook can mark the order paid.
- [ ] Confirm the dashboard reflects Paid only after the verified webhook updates D1. Test cancellation and failed checkout without marking the order paid.
- [ ] Do not enable Cashfree production mode until the merchant account is approved, webhook configuration is verified, and end-to-end tests pass.

## 5. Policies, headers and final review

- [ ] Review and replace the draft Privacy Policy and Terms & Conditions with business-specific details, contact information, collection purposes, retention periods, third-party processors, refund/cancellation terms, taxes, government/third-party fees, complaint contact and appropriate legal review.
- [ ] Confirm _headers is in the Pages static output. Cloudflare documents that _headers applies to static assets, not responses from Pages Functions; API responses need security headers in Worker code as well.
- [ ] Test Content Security Policy and the Cashfree checkout iframe in a real browser. Adjust only the minimum required Cashfree origins if a verified checkout flow is blocked.
- [ ] Verify there are no credentials or customer data in source control, browser storage, public R2 URLs, source maps, error responses or CI logs.
- [ ] Run node tests/part5-smoke.mjs and every node --check command in the committed CI workflow.
- [ ] Complete manual end-to-end tests on Chrome/Android and desktop browsers: keyboard navigation, mobile menu, navigation links, network failures, 404 handling, order ownership, file upload, checkout, failed/delayed payment and return handling.
- [ ] Verify response headers, API logs, error monitoring, backups/restore strategy, database migration rollback and a documented rollback to the last known-good Pages deployment.

## 6. Release decision

Do not announce production readiness until every applicable checkbox is complete, including email verification/password reset, edge rate limiting, malware scanning or an approved safe document workflow, legal review and verified Cashfree webhook tests. Keep checkout in sandbox otherwise.

