# GOAXIS CONSULTANCY — Static Website

This repository is a simple static website built with HTML, CSS and browser-side JavaScript. It is intended for Cloudflare Pages Git deployment.

## Cloudflare Pages deployment

- Repository: `arpit-ae/GOAXIS`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`
- Root directory: leave blank

Connect the repository in Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git. Authorize the Cloudflare GitHub app for this repository, then save and deploy.

If Cloudflare shows **Missing Git connection**, resolve the GitHub authorization/installation in Cloudflare and GitHub settings. Repository file changes cannot grant account-level authorization. If the existing project was created by Direct Upload, create a new Pages project using Connect to Git rather than deleting the old one first.

## Website pages

- `index.html` — homepage, service overview, about section and contact enquiry form
- `services.html` — full service catalogue
- `service.html` — service details and enquiry form
- `website-builder.html` — website packages and project brief
- `privacy.html` — privacy policy draft
- `terms.html` — terms and conditions draft
- `styles.css`, `part2.css` — styling
- `app.js`, `part2.js` — mobile navigation and client-side form validation
- `assets/favicon.svg` — site icon
- `_headers` — baseline response security headers

## Static-site limitation

This website intentionally has **no server, API, database, login portal, admin panel, or online payment integration**. Forms run only in the visitor's browser; they do not transmit or save enquiry details. Before publishing for real customers, add verified business contact details and a suitable form-delivery method, or update the forms to use a verified email/contact endpoint. Do not describe the forms as submitting successfully.

The Privacy Policy and Terms & Conditions are drafts. Review them and add accurate business details before launch. Government registration and licence outcomes must not be represented as guaranteed.

## Local preview

Open `index.html` in a browser, or run a simple local web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.
