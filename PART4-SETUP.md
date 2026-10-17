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
Create a normal account using signup, verify its email out-of-band, then promote it in the D1 console:
UPDATE Users SET role='admin' WHERE email='YOUR_VERIFIED_ADMIN_EMAIL';
Public signup cannot set the admin role. Visit /admin.html after signing in.

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

Before collecting real customer data, Part 5 must connect signup/login/dashboard/enquiry forms to these APIs, add rate limiting, email verification and password reset, verify R2 access/download policy and malware scanning, run browser tests, and verify payment sandbox webhooks. The R2 bucket is private; no public object URLs are returned.
