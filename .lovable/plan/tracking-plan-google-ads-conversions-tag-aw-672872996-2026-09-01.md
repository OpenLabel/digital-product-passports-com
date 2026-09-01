# Tracking plan — Google Ads conversions (tag AW-672872996)

## Goal

Measure, per ad click, which orange button on `/cypheme/passport` was clicked (secondary conversions) and whether the visit ended in an account creation (primary conversion `openlabel_accountcreation`).

## Conversion actions to create in Google Ads

Because this project uses the manual-parameter route, each conversion below is created by you in the Google Ads UI (Goals → Conversions → New conversion action → Website). Each one returns a **send-to label** (`AW-672872996/xxxxx`) that you paste back to me; I wire each label into the code.

| # | Conversion name (exact) | Fires when | Bidding | Category suggestion |
|---|---|---|---|---|
| 1 | `click_openlabel_landing_hero_get_dpp` | Hero "Get My DPP Now" click | Secondary | Outbound click |
| 2 | `click_openlabel_landing_stay_compliant` | "Stay Compliant" click (comparison section) | Secondary | Outbound click |
| 3 | `click_openlabel_landing_prepare_products` | "Prepare Your Products Today" click (timeline section) | Secondary | Outbound click |
| 4 | `click_openlabel_landing_secure_products` | "Secure Your Products" click (final gradient section) | Secondary | Outbound click |
| 5 | `click_openlabel_landing_final_get_dpp` | Bottom "Get My DPP Now" click (closing section) | Secondary | Outbound click |
| 6 | `openlabel_accountcreation` | Successful account creation on `/auth` | **Primary** | Sign-up |

Notes:
- The two "Get My DPP Now" buttons get distinct names (`hero_` vs `final_`) so you can tell top-of-page from bottom-of-page intent.
- Secondary = observed, campaigns do not optimize toward them. Primary = the single action bidding optimizes toward. This matches Google's recommendation of one primary sign-up goal.
- Count setting recommendation: "One" for account creation (a person signs up once); "Every" is fine for button clicks, though "One" also works if you only care whether they clicked at all.

## Code changes (after you paste the 6 labels)

1. **`src/lib/googleAdsTracking.ts`** — add a conversion registry mapping each action name to its send-to label, plus a `trackButtonConversion(action)` helper (fires every click) alongside the existing `trackConversionOnce` (used for account creation).
2. **`src/components/cypheme/CyButton.tsx`** — accept an optional `trackAction` prop; on click, fire the matching conversion before navigating.
3. **`src/pages/CyphemePassport.tsx`** — pass the correct `trackAction` to each of the 5 orange CTAs.
4. **`src/pages/Auth.tsx`** — on successful `signUp` (no error returned), fire `openlabel_accountcreation` once via `trackConversionOnce`. Because `/auth` is same-app, the tag and `gclid` forwarding already in place carry attribution through.
5. **Tests** — extend `googleAdsTracking.test.ts` (registry, per-click firing) and add a CyButton click test and an Auth sign-up conversion test. Full suite must stay green (853+ tests).

## Verification before the campaign spends

- Tag `AW-672872996` loads exactly once app-wide (already in place).
- Each of the 6 labels in code matches an action that exists in the Google Ads account.
- Test click + test sign-up with a real browser; conversions appear in Google Ads within a few hours (reporting lag is normal).

## Out of scope / already settled

- Consent banner for regulated regions remains unimplemented (deferred earlier; can be added later).
- Budgets, keywords, and campaign creation are handled in the Google Ads UI under the manual route.

## What I need from you

1. Confirm the 6 conversion names above (or adjust).
2. Create them in Google Ads and paste the 6 send-to labels.
