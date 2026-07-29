# Fix Cycle 3 — Implementation Plan

Scope mirrors the Round 2 verification report exactly. Grouped by risk, P2 regressions first.

## A. P2 Regression: legacy wine recycling table (NEW-11)

`src/components/wine/WinePublicPassport.tsx` (~L311-316, L547-573): the `m.id`-keyed column model breaks passports saved before ids existed — every column re-does `packagingMaterials.find(p => p.id === col.id)`, which returns the first match for all id-less rows, so one component's composition/code/disposal renders under every header (with duplicate React keys).

Fix: build columns that carry the material object.
```ts
const columns = packagingMaterials.map((m, i) => ({
  key: m.id ?? `${m.typeId}_${i}`,
  name: getMaterialTypeName(m),
  material: m,
}));
```
Render every cell from `col.material` and drop the `.find(...)` lookups. Use `col.key` for React keys.

Test additions in `src/components/wine/WinePublicPassport.render.test.tsx`:
- Two id-less materials (`typeId: 'bottle'` + `typeId: 'cork'`, distinct compositions) — each column shows its own composition.
- Two custom-typed materials (both `typeId: 'custom'`, with ids) — asserts two distinct columns render (also closes the BUG-17 test gap).

## B. P2 Data-loss: duplicated-passport image deletion (NEW-02-R)

`src/pages/PassportForm.tsx` L255-276: `pendingImageDeletionsRef` flush blindly removes storage objects. Duplicated passports share a URL, so replacing one image then saving deletes the sibling's live asset.

Fix: before deleting, query `passports.image_url` for the current user for each pending URL; only delete URLs not referenced by any other row. Keep existing sequencing (flush only after successful save).

## C. Two remaining code gaps

1. **BUG-23** — `src/components/PassportPreview.tsx` L233, L251, L256: apply the same `titleKey` / `labelKey` / option `labelKey` i18n resolution already present in `src/pages/PublicPassport.tsx` L194, L214, L218. No more raw English labels in preview.
2. **BUG-15** — `src/hooks/usePassports.tsx` `reorderPassports.onError` (L154-157): add a user-visible `toast.error` (sonner) alongside the cache invalidation so reorder failures surface.

## D. Seven still-missing §B.2 tests

| Bug | New test |
|---|---|
| BUG-01 | `App.test.tsx`: mock `isSetupRequired:true` + no user, navigate to `/auth`, assert Auth renders (no redirect loop to `/setup`). |
| BUG-03 | `useAutoTranslate` hook test: initial `value:''` + empty translations, rerender to `value:'Wine'` + `{fr:'manual'}`, advance fake timers past `debounceMs`, assert translate edge function never invoked. |
| BUG-04 | `WineFields`: mount with `data.__ai_autofill` seeded; assert `onChange` payload has no `__ai_autofill` key and a remount with cleaned data does not re-fire autofill merge. |
| BUG-05 | Add integrity assertion for the 4 sulfite ids in `supabase/functions/wine-label-ocr` `KNOWN_INGREDIENTS` (new test file next to it or in existing wine ingredients integrity test). Replace hard-coded `isAllergen:true` at `WinePublicPassport.render.test.tsx:114` with `getIngredientById('sulfites')`. |
| BUG-06 | `ToyPublicPassport` × 3 renders: `has_allergenic_fragrances` = `no` / `yes` + list / `unknown`, assert each localized declaration renders. |
| BUG-07 | Section with a `false` checkbox under `i18n.language='fr'`; assert the row is absent. |
| BUG-08 | Assert `handleDownloadSvg`'s exported `<g transform>` contains `scale(250/cells)` derived from the clone's viewBox (`QRCodeDialog`). |
| BUG-09 | Strengthen `fixSpecRegressions.test.tsx` L61-81: add `product_name_translations:{'zh-CN':'示例酒庄'}`, drive `displayLanguage` via `previewLanguage` prop, assert Chinese value renders. |

## E. Small fixes

1. **NEW-12** — Add `counterfeit.pendingSend` = "The partner will be notified the next time you save this passport." to `en.json` + all 24 other locales (parity tests enforce).
2. **NEW-13** — `src/components/WineFields.tsx` L913, L935, L960, L983: `value={calculatedValues.energyKcal ?? ''}` (and kJ / carbohydrates / sugar) to fix controlled→uncontrolled flip.
3. **NEW-03-R** — Backfill `counterfeit_request_sent_at` for legacy-enabled passports via a one-off migration; make `send-counterfeit-request` idempotent per slug; on send-success/persist-failure, retry the DB update instead of toasting a send error.

## F. Housekeeping (P3)

- **NEW-06**: `buildVerboseStatus` should clean and timestamp-gate `test-results/` + `coverage/`.
- **NEW-09**: remove dead `const loading = false` branch in `CounterfeitProtection.tsx` L42.
- **NEW-10 leftovers**:
  - Redundant ternary at `WineRecycling.tsx` L84.
  - Dead `isCustomComposition*` fields in `wineRecycling.ts` L141-143.
  - No-op `data-viewbox` in `QRCodeDialog.tsx` L349.
  - Orphaned `recycling.componentTypes` map in `en.json`.
- Replace `catch (error: any)` with `unknown` + narrowing in `Admin.tsx` L93, L107 and `ImageUpload.tsx` L114.

## Guard rails

- Do not weaken any gate: no `;` chaining, keep `&&` fail-closed.
- `npm run build` remains production-build-only (tests stay in `verify`).
- No skipped/deleted tests, no lowered thresholds, no locale audit relaxation.
- All new user-visible strings (only NEW-12) added to all 25 locales.

## Final verification

Run in order and report:
1. `tsgo --noEmit`
2. Full sharded `vitest run`
3. `npm run build`

Reported as PASS/FAIL with counts.
