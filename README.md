# GOAXIS CONSULTANCY

Cloudflare Pages website with static HTML/CSS/JavaScript, Pages Functions API, Cloudflare D1 database, and private R2 document storage.

## Cloudflare Pages deployment

This repository is configured for **Cloudflare Pages**, not a standalone Worker deployment.

Use these Pages build settings:
- Git repository: `arpit-ae/GOAXIS`
- Production branch: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`
- Root directory: leave blank (repository root)

The repository has no package-install/build step. Do **not** use `npx wrangler deploy` (that is the Worker deployment command and caused the earlier entry-point error). For Pages, use the Pages Git integration or `npx wrangler pages deploy . --project-name=goaxis-consultancy --branch=main`.

### Connect GitHub when Cloudflare says “Missing git connection”

1. Open Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Choose GitHub and authorize/install the Cloudflare Pages GitHub application.
3. Grant it access to the `arpit-ae/GOAXIS` repository (not only a different repository such as `arpit-ae/axis`).
4. Select `main`, use the build settings above, and select **Save and Deploy**.
5. If the existing Pages project was created with **Direct Upload**, Cloudflare does not let that project switch to Git integration. Create a new Pages project using **Connect to Git** instead; do not delete the old project until the new deployment is verified.

A repository commit cannot itself authorize Cloudflare's GitHub app or fix an account-level API token. If Cloudflare's Git connection is missing, resolve the GitHub installation/authorization in Cloudflare and GitHub settings.

## Runtime bindings and secrets

`wrangler.toml` is the Pages Functions configuration and declares:
- D1 binding `DB`, database `goaxis-consultancy-db`
- R2 binding `R2_BUCKET`, bucket `goaxis-customer-documents`
- `CASHFREE_ENV = "sandbox"`

Before using the API, confirm that the configured D1 database ID exists in the same Cloudflare account and that the R2 bucket exists with the exact name above. Wrangler configuration does not create either resource automatically.

From a terminal logged in to the correct Cloudflare account, run:
```bash
npx wrangler whoami
npx wrangler pages project list
npx wrangler d1 list
npx wrangler r2 bucket list
npx wrangler d1 migrations apply goaxis-consultancy-db --remote
```

If the configured database or bucket is missing, create it in the same account and update the corresponding values in `wrangler.toml` to the actual resource IDs/names. Do not replace a valid database ID with a guessed value. Apply the SQL migration only after confirming the intended database.

In the Pages project, configure these **server-side secrets** for both Preview and Production as appropriate:
- `CASHFREE_APP_ID`
- `CASHFREE_SECRET_KEY`

Keep secrets out of Git, HTML, JavaScript, and public variables. Cashfree is intentionally set to sandbox. Do not switch to production until merchant approval and end-to-end payment/webhook tests are complete.

## API and database

- `functions/api/[[path]].js` routes `/api/*` requests to `src/worker.js`.
- `migrations/0001_initial.sql` creates users, sessions, service catalogue, enquiries, orders, payments and document metadata, and seeds starter services.
- `GET /api/health` is the deployment smoke test.
- Other routes cover signup/login/logout, user profile, service catalogue, enquiries, orders, private document uploads, Cashfree payment creation/webhook, and admin overview/order updates/document verification.
- Customer passwords are hashed server-side; sessions use secure HttpOnly cookies. Public signup cannot assign the admin role.

After deployment, test:
1. Open `https://<your-pages-domain>/`.
2. Open `https://<your-pages-domain>/api/health`; expect JSON with `ok: true`.
3. Test `GET /api/services`.
4. Test signup/login with a throwaway account.
5. Test enquiries, document uploads and Cashfree **sandbox** only after confirming D1/R2 bindings and secrets.
6. Promote the verified admin account manually in the D1 console:
   ```sql
   UPDATE Users SET role='admin' WHERE email='YOUR_VERIFIED_ADMIN_EMAIL';
   ```
   Then visit `/admin.html`.

## Frontend status and launch limitations

- Homepage, services, service details, website-builder, terms and privacy pages are static HTML.
- The API/backend implementation is present, but parts of the customer-facing portal and enquiry forms still contain **Part 3 demo/local-browser behavior** and are not all wired to the production API. A successful Pages deployment does not mean every form/payment workflow is production-ready.
- The backend has no email verification/password reset, abuse/rate limiting, antivirus scanning or complete production monitoring yet.
- The R2 bucket is private. Do not expose it publicly or return raw object URLs.
- Review and replace legal-policy drafts and confirm real business contact details before collecting customer information.

## Key files

- `index.html`, `styles.css`, `app.js`: homepage
- `services.html`, `service.html`, `website-builder.html`: service catalogue and website packages
- `signup.html`, `login.html`, `dashboard.html`, `part3.js`, `part3.css`: customer portal prototype
- `admin.html`, `admin.js`: admin UI
- `functions/api/[[path]].js`, `src/worker.js`: Pages Functions API
- `migrations/0001_initial.sql`: D1 schema and seed data
- `wrangler.toml`: Pages output directory and bindings
- `_headers`: baseline security headers
