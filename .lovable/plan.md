# Cypheme landing-only design system

Goal: build a **new** page at `/cypheme/passport` that uses a real Cypheme-branded design system, fully isolated from the app. The existing `/cypheme/digital-product/passport` page stays exactly as it is today.

## Derived brand values (scraped from cypheme.com/dpp-ppc — please review)

| Role | Value |
|---|---|
| Brand orange (primary CTA) | `#ff6600` |
| Brand blue (secondary/links) | `#0094f9` |
| Deep navy (headings) | `#1b225c` |
| Gold accent | `#c9973a` |
| Orange tint surface | `#fff3eb` |
| Blue tint surface | `#e8f4fd` |
| Neutral line / muted | `#ebebeb` / `#888888` |
| Heading font | Poppins (600/700) |
| Body font | Roboto (300/400/500) |
| Button radius | pill (50px) |
| Card / section radius | 16px, large blocks ~1.5vw–3vw |

Tell me if any of these are wrong or if there are official brand values I should use instead — everything downstream is generated from this table.

## Approach: isolated token scope

All Cypheme tokens live in a dedicated stylesheet, `src/styles/cypheme.css`, imported only by the new landing page. Tokens are defined under a `.cypheme-theme` class — never on `:root` — so no app, dashboard or DPP surface can inherit them.

```text
:root                -> existing Open-Label tokens (untouched)
.cypheme-theme       -> Cypheme brand tokens (same variable names, overridden locally)
                        + landing-only variables (tints, gradients, pill radius, shadows)
```

Because shadcn components read `--primary`, `--radius`, etc., any component rendered inside the wrapper picks up the Cypheme look automatically, and reverts outside it.

## What gets built

1. **`src/styles/cypheme.css`** — `.cypheme-theme` block with HSL values for background, foreground, primary (orange), secondary (blue), accent (gold), muted, border, ring, radius, plus landing-only tokens: `--cy-tint-warm`, `--cy-tint-cool`, `--cy-navy`, `--cy-gradient-hero`, `--cy-gradient-cta`, `--cy-radius-pill`, `--cy-shadow-card`. Imported by the landing layout only, not by `src/index.css`.
2. **Tailwind mapping** in `tailwind.config.ts`: additive-only entries — `cy` color group, `rounded-pill`, `shadow-cy`, `font-cy-display` (Poppins) / `font-cy-body` (Roboto). No existing key is modified, so app styling is unchanged.
3. **Fonts**: Poppins + Roboto loaded from Google Fonts by the landing layout on mount and removed on unmount, so other routes never download them.
4. **Landing primitives** in `src/components/cypheme/`:
   - `CyphemeThemeProvider.tsx` — wraps children in `.cypheme-theme font-cy-body`, handles font injection and page metadata.
   - `CySection.tsx` — section wrapper with consistent max width and vertical rhythm.
   - `CyHeading.tsx` — h1/h2/h3 scale with navy and gradient variants.
   - `CyButton.tsx` — pill CTA: `primary` (orange), `outline` (blue), `gradient`.
   - `CyCard.tsx` — tinted surface card.
   - `CyTimelineCard.tsx`, `CyPassportShowcase.tsx` — Cypheme-styled counterparts of the existing components (the current `TimelineCard` / `PassportShowcase` are left untouched).
5. **New page** `src/pages/CyphemePassport.tsx`, route `/cypheme/passport` in `src/App.tsx` (registered in both the setup-required and normal route trees, like the current landing page). Content mirrors the existing landing page's sections — hero, passport showcase, timeline, comparison, CTA — rebuilt on the Cypheme primitives.
6. **Tests**: a render smoke test for the new page, tests for each new primitive, and an isolation test asserting the Cypheme tokens are only emitted under `.cypheme-theme` and that no `:root` rule is added.

## Scope and safety

- `/cypheme/digital-product/passport` and all its components are left byte-identical.
- No changes to `src/index.css` `:root`/`.dark`; Tailwind changes are additive only.
- No i18n changes (English-only marketing copy), no backend changes.
- Full test suite run afterwards; no threshold changes.

