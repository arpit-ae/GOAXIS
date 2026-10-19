# GOAXIS CONSULTANCY

Static website hosted on Cloudflare Pages with a Pages Function for enquiry submission.

## Phase 1 — Working enquiry forms

- Homepage enquiry, Contact enquiry, Service enquiry and Website quotation forms submit to `POST /api/enquiry`.
- The Pages Function validates inputs, checks the request origin, applies length limits and stores valid enquiries in the D1 `Leads` table.
- Successful submissions receive a reference such as `ENQ-2026-00001`.
- Form errors are displayed to the visitor; the form is not presented as successful if the API or database is unavailable.
- A simple honeypot helps reduce basic automated spam. It is not a substitute for edge rate limiting or a WAF rule.
- Do not collect identity documents, Aadhaar/PAN numbers, passwords, OTPs or bank details through these public enquiry forms.

## Cloudflare Pages setup

- GitHub repository: `arpit-ae/GOAXIS`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`
- The project uses `wrangler.toml` for the D1 binding named `DB`.
- Confirm that the configured D1 database exists in the intended Cloudflare account before deployment.
- Apply the migration in `migrations/0002_phase1_enquiries.sql` to the intended database before testing the live form.
- Test in a Preview deployment first. Do not merge or deploy until the database binding and migration have been verified.

## Test checklist

1. Submit a valid enquiry from each of the four forms.
2. Confirm each request returns a reference and creates exactly one `Leads` row.
3. Confirm missing name/email/service/message is rejected.
4. Confirm invalid email and invalid phone are rejected.
5. Confirm wrong Origin, non-JSON request and oversized body are rejected.
6. Simulate a missing DB binding and confirm the page displays a retryable error, not a false success.
7. Check mobile and desktop layouts and keyboard accessibility.

## Important release limitations

- This phase only implements enquiry capture. Admin review/notification workflows are a later phase.
- Edge rate limiting/WAF configuration, monitoring, final privacy/legal review and full production security testing remain launch requirements.
- The privacy policy is still a draft and must be completed before collecting real customer information.
- The GitHub branch is not automatically live merely because code is committed. Confirm the Cloudflare Pages Git connection and deploy a Preview before merging to `main`.
