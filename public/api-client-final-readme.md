# API Client — E-Library (Final)

This document describes the `public/api-client-final.html` interactive API client included with the E-Library project. The client is a single-file, no-build, accessible, and themeable interface for testing and demoing the backend API (auth, books, uploads, downloads).

## Features
- Modern, responsive layout (sidebar + main area) with card-style components.
- User Authentication (login/logout, token storage in localStorage).
- Request Composer (method, endpoint, JSON body, custom headers).
- Request History (replay and edit saved requests).
- Book Catalog (search, sort, paginate) with cover thumbnails and select/preview.
- Book Editor modal (pre-filled fields, upload cover image, minimal update payloads).
- Download action (requests `/download/:id`, sends JWT if available, downloads Watermarked PDF blob).
- Theme system: light/dark toggle + dynamic accent color picker.
- Demo mode: `Load Demo` populates the catalog with demo data and auto-logs a demo user for quick evaluation.
- Accessibility: ARIA attributes, focus outlines, large touch targets; keyboard-friendly controls.
- Inline feedback: toasts, status, success/error indicators, collapsible response panel.
- No build step — open `api-client-final.html` in a browser served by the same origin as the API.

## Setup & Quick Start
1. Ensure the backend server is running (Node.js + Express + MongoDB). From the project root:

```powershell
# install dependencies (only if not installed)
npm i
# seed demo users (if seeder is provided):
node seeder.js
# start the server (development)
npm run dev
# or production
npm start
```

2. Open the client in your browser (same origin):

- http://localhost:3000/api-client-final.html

3. Demo mode: Click `Load Demo` to auto-fill demo data and login as a demo librarian. This works without a backend and is useful for UX evaluation.

4. Test flows:
- Login with a seeded account or register via the composer (POST /auth/register).
- Browse the catalog, click `Select` then `Edit Selected` to open the editor.
- Upload a cover image (client uploads to `/upload/image` then includes the returned path in a PUT /books/:id).
- Download a book via `Download` (requests `/download/:id`; attach JWT if logged in).
- Use the Request Composer to call any API endpoint; check the Response Viewer for status and body.

## Security Notes
- Tokens are stored in `localStorage` for convenience. For production, prefer short-lived tokens, refresh tokens, or secure storage.
- The client hides the full token in the UI; copying is on demand. Do not paste secrets in the composer fields.
- Ensure server routes that accept file uploads (`/upload/image`, `/upload/book`) are protected with auth & role middleware in production.

## Accessibility Notes
- Interactive elements include focus outlines and ARIA attributes where relevant.
- All form fields are labeled and have descriptive placeholders and helper text.
- Toasts and the user status area use `aria-live` to announce changes to assistive tech.
- Keyboard navigation: catalog items are focusable and actionable with keyboard.
- Contrast: the default theme passes basic contrast checks; the dark theme and accent picker are included for user preference.

## Endpoints (expected server)
- POST /auth/login — { email, password } → { token }
- POST /auth/register — { name, email, password }
- GET /users/me — returns user info (requires JWT)
- GET /books — list books (q=, page, limit)
- GET /books/:id — book details
- PUT /books/:id — update book metadata (requires role)
- POST /upload/image — multipart file upload (returns path/filename)
- GET /download/:id — secure, watermarked PDF download (requires JWT for protected books)

The client assumes standard RESTful responses (JSON bodies and appropriate HTTP status codes).

## Demo accounts (if you run the seeder)
- admin@example.com / password
- librarian@example.com / password
- user@example.com / password

## Developer tips
- The client is intentionally single-file and framework-free to simplify demos and hackathon usage.
- If you need to extend: split the JS into modules, use a build pipeline, or replace with a framework (Vue/React) for large features.
- To protect uploads: add `middleware/auth.js` + `middleware/role.js` to `routes/upload.js` for the image upload endpoint.

## Test Mode
- Click `Load Demo` to switch into offline demo mode (no backend necessary). The demo populates `state.books` with sample objects and sets a fake token.
- Click `Clear` to revert.

## Screenshots
- (Placeholders) For a demo/hackathon, open the client and take screenshots of the Catalog, Editor, and Response Viewer.

## Changelog
- v1.0 — Finalized accessible client with demo mode, editor modal, JWT handling, and theme system.

---
If you want, I can now:
- Wire client-side image resizing before upload and add server-side thumbnailing with `sharp`.
- Protect `/upload/image` with auth and role checks and update the client to handle 401/403.
- Add a small Cypress or Jest + Puppeteer smoke test to verify the main flows automatically.

Tell me which follow-up you prefer and I'll implement it next.