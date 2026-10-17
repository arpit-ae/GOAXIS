PART 4 — BACKEND, ADMIN AND PAYMENTS

IMPLEMENTED IN THIS BRANCH
- Cloudflare Pages Function routes /api/* to src/worker.js.
- D1 migration for users, sessions, services, leads, orders, payments and document metadata, with seed service catalogue.
- Password hashing with PBKDF2-SHA-256 and unique salt; server-side sessions with hashed random tokens and secure HttpOnly/SameSite cookies.
- Service listing, enquiries, customer profile, order creation/list/detail and ownership checks.
- Private R2 document upload endpoint (PDF/JPG/PNG, maximum 10 MB).
- Cashfree sandbox order creation and webhook signature verification; order is marked paid only on a verified success webhook.
- Admin API for overview, status changes, price approval and document verification; admin console at admin.html.
- Client cannot set order price at creation. Seed prices are zero until admin approves a quote.

CLOUDFLARE SETUP REQUIRED BEFORE IT CAN RUN
1. Create a D1 database and replace the placeholder database_id in wrangler.toml.
2. Create the R2 bucket matching goaxis-customer-documents.
3. Apply migration: npx wrangler d1 migrations apply goaxis-consultancy-db --remote
4. Add Cashfree sandbox secrets to the Pages/Worker environment: CASHFREE_APP_ID and CASHFREE_SECRET_KEY. Keep them out of GitHub and browser code.
5. Confirm bindings named DB and R2_BUCKET in Preview and Production.
6. Deploy Pages and verify /api/health.

FIRST ADMIN ACCOUNT
Public signup is disabled by default with ENABLE_PUBLIC_SIGNUP=false. For a controlled bootstrap only, temporarily set ENABLE_PUBLIC_SIGNUP=true in a non-public Preview environment, create the intended owner account, verify ownership out of band, and promote that account in D1:
UPDATE Users SET role='admin' WHERE email='YOUR_VERIFIED_ADMIN_EMAIL';
Then set ENABLE_PUBLIC_SIGNUP=false again and redeploy. Do not enable open customer registration on production until email verification, password reset and rate-limiting safeguards are implemented and tested. Public signup cannot set the admin role. Visit /admin.html after signing in.

API ROUTES
GET /api/health
POST /api/signup, /api/login, /api/logout
GET/PUT /api/user/me
GET /api/services, /api/services/:id
POST /api/enquiry
POST/GET /api/orders; GET /api/orders/:id
POST /api/orders/:id/upload
POST /api/payments/create; POST /api/payments/webhook
GET /api/admin/overview; PATCH /api/admin/orders/:id; PATCH /api/admin/documents/:id/verify

AMOUNT AND PRODUCTION NOTES
Order amounts are whole INR rupees, not paise. Seed prices are zero (quotation required); checkout rejects zero-value orders. Admin must set an approved amount before checkout. Cashfree is sandbox by default. Do not switch to production until merchant verification and end-to-end tests pass.

Part 5 connects the signup/login/dashboard/enquiry forms to these APIs, checks webhook amount/currency against the recorded payment, adds security headers and a static smoke-test workflow. Before collecting real customer data, configure rate limiting, email verification and password reset, confirm R2 access policy and malware scanning, run browser tests, and verify payment sandbox webhooks. See PART5-LAUNCH-CHECKLIST.md. The R2 bucket is private; no public object URLs are returned.
