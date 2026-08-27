# Cypheme Landing Page

## Goal
Add a minimal, public landing page at `/cypheme/digital-product/passport` that links back to the main Open-Label homepage.

## Plan

1. **Create the page component**
   - Add `src/pages/CyphemeLanding.tsx` with the standard OLPL license header.
   - Render a centered, empty-ish layout containing only the Open-Label brand mark and a single link/button back to `/`.
   - Re-use existing translation keys (e.g. `nav.getStarted`) so no new i18n keys are required.

2. **Wire up the route**
   - Register `<Route path="/cypheme/digital-product/passport" element={<CyphemeLanding />} />` in `src/App.tsx`.
   - Make it available both before and after setup (like the other public pages: `/legal`, `/terms`, etc.).

3. **Add a smoke test**
   - Create `src/pages/CyphemeLanding.test.tsx` that renders the page and asserts the link to `/` is present.

## Non-goals
- No new translation keys or locale files.
- No navigation/header/footer additions unless requested later.
- No backend or database changes.
