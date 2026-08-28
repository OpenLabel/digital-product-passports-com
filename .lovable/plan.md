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

## Approach: scoped token layer

Create a `.cypheme-theme` scope. Every token is redefined inside that class only, so nothing outside the landing route changes and dark mode / DPP theming stay untouched.

```text
:root                -> existing Open-Label tokens (unchanged)
.cypheme-theme       -> Cypheme brand tokens override the same variable names
                        + new landing-only variables (gradients, tints, pill radius)
```

Because shadcn components already read `--primary`, `--radius`, etc., existing buttons/cards automatically pick up the Cypheme look inside the wrapper — no rewrite of every element.

## What gets built

1. **Token layer** in `src/index.css`: a `.cypheme-theme` block with HSL values for background, foreground, primary (orange), secondary (blue), accent (gold), muted, border, ring, plus landing-only tokens: `--landing-tint-warm`, `--landing-tint-cool`, `--landing-navy`, `--landing-gradient-hero`, `--landing-gradient-cta`, `--landing-radius-pill`, `--landing-shadow-card`.
2. **Tailwind mapping** in `tailwind.config.ts`: expose the new landing tokens as utilities (`bg-landing-tint-warm`, `text-landing-navy`, `rounded-pill`, `shadow-landing`) and register `font-display` (Poppins) / `font-body` (Roboto).
3. **Fonts**: Poppins + Roboto via Google Fonts, injected only on the landing route (link tags added/removed by the layout component) so the app bundle and DPP pages stay unaffected.
4. **Landing UI primitives** in `src/components/landing/`:
   - `LandingLayout.tsx` — applies `.cypheme-theme`, font classes, and the Google Fonts injection.
   - `LandingSection.tsx` — standard `max-w-4xl` section wrapper with consistent vertical rhythm.
   - `LandingHeading.tsx` — h1/h2/h3 scale with the navy/gradient variants.
   - `LandingButton.tsx` — pill CTA with `primary` (orange), `secondary` (blue outline), `gradient` variants; replaces the local `CtaButton`.
   - `LandingCard.tsx` — tinted surface card; `TimelineCard` and the comparison table are refactored onto it.
5. **Migration of the page**: `CyphemeLanding.tsx`, `TimelineCard.tsx`, `PassportShowcase.tsx` switch from ad-hoc Tailwind color classes (`violet-600`, `blue-50`, …) to the landing tokens. Layout, copy, and section order stay exactly as they are today — only styling changes.
6. **Guardrail test**: a unit test asserting that landing components emit no hardcoded color utilities and that the theme class is present, so the scoped system can't leak or rot.

## Scope and safety

- Only `/cypheme/digital-product/passport` uses this system; the home page, dashboard and DPPs are untouched.
- No changes to i18n (this page is English-only marketing copy), no backend changes.
- Full test suite is run after the change; no threshold changes.

## Open point

The rebuild will visually shift the page toward orange-led Cypheme branding, away from the current blue/violet Open-Label look. Confirm that is intended for this page.
