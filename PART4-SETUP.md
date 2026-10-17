# GOAXIS CONSULTANCY — Part 4 Cloudflare setup

Part 4 adds a Cloudflare Pages Functions API, D1 application tables, private R2 document storage, an administrator console (admin.html) and Cashfree hosted checkout. Existing static pages and the earlier prototype schema are preserved; Part 4 uses namespaced app_* tables so the migration can run after the original Part 1–3 schema.

## 1. Create Cloudflare resources

Install/use Wrangler and sign in from the repository folder:

    npm install --save-dev wrangler
    npx wrangler login
    npx wrangler d1 create goaxis-consultancy-db
    npx wrangler r2 bucket create goaxis-customer-documents

If the resources already exist, reuse them. A D1 create command prints its database ID. Put that real ID in wrangler.toml in place of REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID. Never invent the ID.

## 2. Apply the Part 4 migration

Run the migrations in order:

    npx wrangler d1 migrations apply goaxis-consultancy-db --remote

The original 0001_initial.sql creates the prototype schema. 0002_part4_backend.sql creates the new app_* tables and seeds eight services with no fixed price. This preserves existing prototype tables/data. Use a separate local/test database for development.

## 3. Check Pages bindings

The current wrangler.toml declares:
- D1 variable DB → goaxis-consultancy-db (replace its placeholder ID).
- R2 variable R2_BUCKET → goaxis-customer-documents.
- CASHFREE_ENV = sandbox.

If deploying from the Cloudflare Pages dashboard, verify the same D1 and R2 bindings exist under Workers & Pages → goaxis-consultancy → Settings → Bindings for both Preview and Production. Save and redeploy. Keep R2 private; do not enable public access for customer documents.

The Pages Function router at functions/api/[[path]].js forwards /api/* requests to src/worker.js.

## 4. Add Cashfree sandbox secrets

In Cloudflare Pages → Settings → Variables and Secrets, add:
- CASHFREE_APP_ID as a secret containing the Cashfree sandbox App ID.
- CASHFREE_SECRET_KEY as a secret containing the Cashfree sandbox Secret Key.

Keep CASHFREE_ENV=sandbox while testing. Do not put credentials in HTML, JavaScript, TOML, .env.example, screenshots, or GitHub commits.

## 5. Bootstrap the first administrator once

Generate a long random one-time token privately using a password manager or secure local generator. Add it as Cloudflare secret ADMIN_BOOTSTRAP_TOKEN and redeploy. Then call this endpoint once over HTTPS:

    curl -X POST "https://YOUR-PAGES-DOMAIN/api/admin/bootstrap"       -H "Content-Type: application/json"       -H "X-Admin-Bootstrap-Token: YOUR_ONE_TIME_TOKEN"       -d '{"name":"Admin Name","email":"YOUR_ADMIN_EMAIL","password":"USE_A_UNIQUE_PASSWORD_OF_12_OR_MORE_CHARACTERS"}'

Only the first administrator can be bootstrapped. Immediately remove ADMIN_BOOTSTRAP_TOKEN from Cloudflare secrets and redeploy after success. Sign in at login.html, then open admin.html. Never commit the token or admin password.

## 6. Customer and operations workflow

1. Customers register/login at signup.html and login.html. Passwords are PBKDF2-hashed server-side. Sessions use random opaque cookie tokens whose hashes are stored in D1.
2. Homepage, service and website-builder enquiry forms write leads to D1.
3. Customers submit service requests through dashboard.html; they initially have status REQUESTED and no price.
4. An administrator reviews the enquiry/order, confirms the scope and agrees a professional fee. The fee is stored server-side in paise; the browser cannot set its own payable amount. A payable order requires an agreed quote.
5. Customers should add a valid 10-digit Indian mobile number to their profile before starting Cashfree hosted checkout.
6. Cashfree webhooks are verified using HMAC-SHA256 over the timestamp plus raw request body. The API retrieves payment records from Cashfree, compares amount and currency, and only then marks the order paid. The return page does not independently claim payment success.
7. Customer files are stored in private R2 and can only be downloaded through authenticated owner/admin checks.

Upload limits/types: PDF, DOC, DOCX, JPG/JPEG, PNG; maximum 5 MB. File signature and MIME/extension checks are a first filter only, not malware scanning. Before handling sensitive identity documents, add malware scanning, retention/deletion procedures, backups, access auditing, and a reviewed privacy/data-handling policy.

## 7. Sandbox and production checks

- Check https://YOUR-PAGES-DOMAIN/api/health and /api/services after deployment.
- Test signup/login/logout, duplicate email, invalid credentials, session expiry, customer isolation, admin-only routes, enquiry submission, quotes, status transitions, file ownership, bad files, upload limits and missing bindings.
- In Cashfree sandbox test successful, pending, failed and duplicate webhook deliveries. A browser return alone must never mark an order paid.
- Confirm webhook endpoint https://YOUR-PAGES-DOMAIN/api/payments/webhook is enabled/configured in Cashfree if required.
- Switch to production only after merchant activation and end-to-end tests pass: set CASHFREE_APP_ID and CASHFREE_SECRET_KEY to live secrets and change CASHFREE_ENV to production.
- Verify the real domain, contact details, privacy/terms pages, written quote policy, fee disclosure, reconciliation and support route before accepting live payments.

## Part 5 still required

Part 4 code is integrated but must still be deployed and verified in a real Cloudflare preview. Part 5 should run browser end-to-end tests, exercise payment failure/retry paths, add malware scanning and operational monitoring, and review legal/privacy obligations. Email notifications and password-reset flows are not included in Part 4. Do not collect real sensitive documents or enable live payments until the remaining checks are complete.
