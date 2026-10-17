# GOAXIS CONSULTANCY — Part 5: Testing, Security & Deployment

This checklist adds the release-preparation layer for the existing Cloudflare Pages site and Pages Functions backend. Repository checks do not prove that a live deployment, payment, or production credential has been verified.

## 1. Current release status

- Parts 1–3: frontend pages and browser-only demo workflows are present.
- Part 4: Pages Functions API dispatcher, D1 migration, R2 upload route, Cashfree sandbox integration and admin API are present in the repository.
- Part 5 adds Cloudflare Pages security headers, automated JavaScript syntax/file checks and this release runbook.
- Do not collect real customer data or accept live payments until the deployment checks below pass. Confirm that frontend signup/login/dashboard/enquiry forms call the server API rather than relying on browser-only demo/local storage. The presence of an API does not prove every page is wired to it.

## 2. Required Cloudflare configuration

1. In Cloudflare, open the Pages project connected to arpit-ae/GOAXIS and confirm the production branch is main.
2. Build output directory is . for the current static HTML project; this repository does not currently define an npm build step.
3. Confirm wrangler.toml has the real D1 database_id; replace REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID before deployment.
4. Create/confirm the D1 database named goaxis-consultancy-db and the R2 bucket goaxis-customer-documents.
5. Confirm bindings DB and R2_BUCKET are configured for both Preview and Production.
6. Apply the D1 migration to the intended environment:
   npx wrangler d1 migrations apply goaxis-consultancy-db --remote
7. Add secrets in Cloudflare Pages project settings or the associated Worker environment, never in Git:
   - CASHFREE_APP_ID
   - CASHFREE_SECRET_KEY
   - CASHFREE_ENV=sandbox for testing.
8. Check that production credentials are absent from GitHub files, browser JavaScript, build output, logs and screenshots.
9. Deploy a Preview first. Promote to Production only after the tests below pass.

## 3. Local validation

Install a current Node.js LTS release and Wrangler. From the repository root:

    node --check app.js
    node --check admin.js
    node --check part2.js
    node --check part3.js
    node --check src/worker.js
    node --check 'functions/api/[[path]].js'
    npx wrangler pages dev .

In a second terminal, run the smoke test against the local Pages dev server (default port 8788):

    node scripts/smoke-test.mjs

For a deployed Preview URL:

    GOAXIS_BASE_URL=https://YOUR-PAGES-PREVIEW-URL node scripts/smoke-test.mjs

On Windows PowerShell:

    $env:GOAXIS_BASE_URL = "https://YOUR-PAGES-PREVIEW-URL"
    node scripts/smoke-test.mjs

The smoke test checks public page availability and GET /api/health. It does not create users, upload documents, or charge a payment method.

## 4. End-to-end acceptance checklist

Run these tests in Preview using test data and Cashfree sandbox credentials. Record date, environment, result and any issue before launch.

- [ ] Homepage, service catalogue, service detail, website-builder, policies, signup, login, dashboard, admin and payment-return pages load on desktop and mobile.
- [ ] Navigation, footer links, service query parameters and browser back/forward work.
- [ ] Contact, service-enquiry and website quotation forms validate required fields and submit to POST /api/enquiry; a lead is visible to an authorized admin.
- [ ] Signup with valid data creates a D1 user and secure session; duplicate email is rejected.
- [ ] Login accepts the correct password, rejects an incorrect password and sets a Secure, HttpOnly, SameSite cookie; logout invalidates the session.
- [ ] Dashboard/profile/order screens read and write server-side data. A customer cannot read or alter another customer's orders.
- [ ] Order creation never trusts a client-supplied price. An order cannot be paid until an admin approves a positive amount.
- [ ] Admin routes reject non-admin users. Public signup cannot set the admin role.
- [ ] Document uploads reject unsupported types and oversize files; files land in private R2; metadata is stored in D1; another customer cannot access a file.
- [ ] Cashfree sandbox order creation works; failed/cancelled payments remain unpaid; only a valid verified webhook marks an order paid; duplicate webhook delivery is safe.
- [ ] API errors do not expose stack traces, credentials, session tokens or personal data.
- [ ] Keyboard navigation, visible focus, labels, contrast and mobile layout are reviewed.
- [ ] The deployed site has HTTPS and the expected security headers.
- [ ] A backup/export and rollback approach for D1 schema/data changes is documented before launch.

## 5. Security requirements before real customer use

- Keep payment secrets only in Cloudflare secrets; rotate immediately if exposed.
- Apply server-side validation and prepared SQL statements to every mutating endpoint.
- Add rate limiting for login/signup/enquiry/payment endpoints and abuse monitoring before public launch.
- Complete email verification and a secure password-reset flow before relying on accounts for sensitive orders.
- Confirm CSRF/origin protection for cookie-authenticated mutations and enforce ownership checks on every order/document endpoint.
- Keep R2 private. Do not expose permanent public object URLs; authorize downloads and consider malware scanning before staff open customer files.
- Review privacy notice, terms, refund/cancellation policy, retention/deletion process and contact details against actual business requirements.
- Never store Aadhaar, PAN, identity documents or other sensitive customer data in logs. Collect only the minimum documents needed for the requested service.
- Review the _headers CSP against all pages and third-party checkout redirects before production. If a page needs external assets, allow only specific required origins rather than removing the policy wholesale.

## 6. Payment production gate

Keep Cashfree in sandbox until the merchant account is approved and all sandbox tests pass. Before switching to production, confirm production credentials and API base URL, webhook endpoint and signature verification, allowed return URLs, settlement/refund operations, amount/currency consistency, and reconciliation of D1 orders with gateway records. Never test live payments with a real customer order.

## 7. Deployment and rollback

1. Review GitHub Actions checks on the Part 5 branch.
2. Deploy a Preview; run the smoke test and end-to-end acceptance checklist.
3. Verify D1 migration status and bindings in the same environment that serves the Preview.
4. Check Pages deployment logs, browser console, API responses and Cloudflare logs.
5. Promote/merge only after blockers are resolved and business contact/policy text is approved.
6. Verify custom domain, DNS, SSL certificate and security headers after production deploy.
7. Keep the previous known-good Pages deployment available for rollback. Back up D1 before schema changes; do not roll back code in a way that is incompatible with the current schema.

## 8. Definition of done

Part 5 is release-ready only when automated checks pass and the environment-specific acceptance checklist is completed. GitHub automation cannot validate Cloudflare account bindings, DNS, private R2 permissions, real webhook delivery or merchant approval without access to those environments.
