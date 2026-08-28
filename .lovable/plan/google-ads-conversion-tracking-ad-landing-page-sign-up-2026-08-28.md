# Google Ads conversion tracking: ad → landing page → sign-up

## What already exists

- A dedicated campaign landing page at `/cypheme/passport`, styled with the Cypheme brand system and set to `noindex` so it is only reachable from the ad or a direct URL.
- Its orange calls to action all point at the sign-up page (`https://open-label.eu/auth`), which is the same app on a custom domain, so the visit stays in one site.
- A referral capture helper that reads a `ref` value from the URL and keeps it until the account is created — useful as a rough source label, but it is not ad measurement.
- Account creation happens in one known place in the app, so there is a single clean point to report a conversion from.

## What is missing

- No Google Ads account is connected to this project yet.
- No conversion definition exists for "account created".
- No Google tag or any analytics/tag script is loaded anywhere in the app.
- No consent handling for visitors in regions that require it.
- No click identifier carried from the landing page to the sign-up page, so a sign-up cannot be attributed if the visitor navigates across domains.

## Proposed work

1. **Connect Google Ads and set up the project's ad account.** Guided in chat; the new-vs-existing account choice happens in the setup dialog.
2. **Create the conversion definition** for a completed account creation (sign-up category, no monetary value, used for bidding).
3. **Decide consent handling.** Two routes: a region-gated consent banner shown only to visitors in regions that require it, or skipping tracking in those regions. This choice is put to you before any tracking code is installed.
4. **Install the Google tag once**, app-wide, with a consent default matching the chosen route, and send a page view on client-side route changes so the landing page and the sign-up page both register.
5. **Report the conversion on successful account creation**, fired once per new account (not on sign-in, not on failed sign-ups, and not repeated on re-render).
6. **Keep attribution across the domains.** Ensure the landing-page CTAs preserve the ad click identifier and campaign parameters when sending the visitor to the sign-up page, so a sign-up on `open-label.eu` is attributed to the click on the landing page.
7. **Publish**, then verify with a real test sign-up that the event fires and the tag is healthy. Conversion data lags several hours, so a first empty report is expected.
8. **Create the campaign** only after those checks pass; budget, markets, languages, and bidding are confirmed on the approval card, and nothing spends before you approve it.

## Technical notes

- Tag bootstrap in a small `src/lib/adsTracking.ts` initialised from `src/main.tsx`, with route-change page views wired to the router.
- The conversion call sits at the successful sign-up branch of `src/hooks/useAuth.tsx`, guarded so it fires once.
- Landing-page CTA targets in `src/pages/CyphemePassport.tsx` gain forwarded click/campaign parameters; `CyButton` already handles external links.
- The consent banner, if chosen, is built with the project's design system, reads the visitor country client-side, fails open to showing the banner, and its strings are added to all 25 locales per project policy.
- Tests are added for the tracking helper and the fire-once conversion behaviour, keeping coverage at or above the existing threshold.
