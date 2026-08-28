# Manual Testing Guide for the Full App

## Goal
Produce a complete, step-by-step manual QA guide (`TESTING.md` at repo root) that lets anyone test every screen of the app, including auth-gated pages and routes that need specific parameters (slugs, referral codes, admin hash password).

## Deliverable
A single `TESTING.md` document (documentation only — no code changes) organized by area, with exact URLs, prerequisites, and expected results for each screen.

## Content outline

### 1. Public pages (no auth)
- `/` — landing page: hero, categories timeline (Wine active, Batteries 2027, full rollout 2027-30), AI autofill section, language switcher (25 languages), footer links.
- `/legal`, `/privacy-policy`, `/terms` — static legal pages.
- `/p/:slug` — public passport view:
  - Demo passport: `/p/de00000000000001` (Chateau Example 2022, wine).
  - Language override via `?lang=it` (and other EU codes + zh-CN).
  - "Powered by Open-Label.eu" attribution must be visible.
- `/cypheme/passport` — Cypheme landing page (isolated design system, noindex meta tag present in page source, CTAs link to `/auth`).
- `/referral/:code` — referral stats page with a code.
- `/referral-leaderboard` — public leaderboard.
- 404 behavior: any unknown route (e.g. `/legal-mentions`) shows NotFound.

### 2. Auth flow
- `/auth` — sign up (email + password + Company Name), sign in, forgot password → `/reset-password`.
- Referral capture: visit `/?ref=CODE` before sign-up, verify code attribution.
- Conversion/tracking notes if Google Ads params are configured.

### 3. Authenticated pages
Prerequisite: a signed-in account.
- `/dashboard` — passport list, create/duplicate/delete, drag-and-drop reorder (toast appears), QR dialog with PNG/SVG download and "Open Passport", mobile stacked layout.
- `/passport/new` and `/passport/:id/edit` — full form: Wine category fields, ingredients picker, recycling materials, image upload (save keeps image), translations tab (Generate with AI), live preview with language picker decoupled from app language, ⌘+S / Ctrl+S save shortcut.
- Publishing flow: publish → public URL with 16-char hex slug works logged-out.

### 4. Admin / restricted pages
- `/admin-leaderboard` — deep leaderboard gated by the big password passed in the URL **hash** (`/admin-leaderboard#<password>`); instructions on where the password is configured and the failure case (wrong/missing hash).
- `/admin` — admin page (site admin account, e.g. the configured admin email).

### 5. Setup flow
- `/setup` — first-boot behavior when `setup_complete` is false; auth routes remain reachable during setup; redirect to `/` once complete. Note: test only on a fresh instance.

### 6. Cross-cutting checks
- Language completeness: switch UI through several of the 25 locales; no English leaks on forms or public DPP.
- Rate limiting on public data endpoints (edge functions).
- Mobile viewport pass (375px) for landing, dashboard, form, public passport.

## Notes / technical details
- Documentation-only change; no source edits, so no new translations or tests are required by project rules.
- The guide will reference the demo slug `de00000000000001` and mark steps that need a specific account or a fresh database.
