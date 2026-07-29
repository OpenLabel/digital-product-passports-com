# Complete Fix Batch — Post-Verification Remediation

Implements all items A–F from the audit report in one pass. Ordered so the test gate is restored first, then fixes land in dependency order.

## Phase A — Unbreak the test gate (blocking)

1. **`src/pages/Dashboard.test.tsx`** — hoist a module-level stable `mockPassports: Passport[] = []` and return the same reference from the `usePassports` mock (kills the infinite render loop / OOM caused by BUG-14's sync effect).
2. Add BUG-14 regression test: render Dashboard with one passport, rerender with `[]`, assert `dashboard.noPassports` renders and no `passport-card` remains.

## Phase B — Complete the partial fixes

3. **BUG-03** `useAutoTranslate.ts` — change init latch to only fire once a non-empty `value` arrives; deps `[value, existingTranslations]`. Add test: mount with `existingTranslations={fr:'manual'}`, value arrives post-mount → no overwrite.
4. **BUG-16** `useAuth.tsx` — in `onAuthStateChange`, on `SIGNED_IN` retry pending `getReferralCode()` insert; clear only on success.
5. **BUG-17** `WinePublicPassport.tsx` — key packaging table columns on each material's unique `m.id` (not `typeId`); use `getMaterialTypeName(m)` for header; look rows up by `id`. Test: two custom components render two distinct columns.
6. **BUG-29 display half** `WineFields.tsx` — pass `''` (not `0`) to nutrition inputs when `*_manual && stored === ''`. Fix all four fields (energy_kcal, carbs, fat, protein equivalents at :908/930/953/976).
7. **BUG-23** `PassportPreview.tsx` — apply the same `titleKey/labelKey/option-labelKey` resolution used in `PublicPassport.tsx`.
8. **BUG-21** `sanitizeUrl.ts` — allowlist scheme approach: parse and accept only `http:`, `https:`, `mailto:`, `tel:`, plus relative/scheme-relative; otherwise return `undefined`. Wrap `CategoryQuestions.tsx:201` `href={value}` with it. Anchors omitted rather than `href="#"`.
9. **BUG-15** — add error toast in `usePassports.reorderPassports.onError`.

## Phase C — Two untouched bugs

10. **BUG-18** — add `wine.recycling.types.<id>`, `.compositions.<id>`, `.disposal.<id>` keys to `en.json` and all 24 other locales (25 files total). Use them in `WinePublicPassport.tsx` `getMaterialTypeName` and disposal/composition renders with English fallback. Delete orphan `recycling.componentTypes` map. French render test asserts translated disposal.
11. **BUG-30** — add 7 keys (`qrDialog.urlMismatch`, `qrDialog.printSizeInstruction`, `qrDialog.openPassport`, `qrDialog.downloadSvg`, `qrDialog.downloadPng`, `passport.productInfo`, `passport.description`) to all 25 locales; replace inline English defaults in `QRCodeDialog.tsx` (270/449/461/491/494) and `PassportForm.tsx` (577/587) with `t()`.

## Phase D — Regressions the batch introduced

12. **NEW-02** `ImageUpload` + `PassportForm` — defer storage deletions until after successful save; skip delete if any other passport row references the same `image_url`. `duplicatePassport` copies the storage object rather than aliasing the URL.
13. **NEW-03** `CounterfeitProtection` + `usePassports` — persist `counterfeit_request_sent_at` before/with create-flow navigation; `updatePassport.onSuccess` invalidates `['passport', id]`; render Disable control whenever `enabled === true`; backfill `counterfeit_request_sent_at` for pre-existing enabled rows; make `send-counterfeit-request` idempotent per slug.
14. **NEW-04** `ResetPassword.tsx` — also treat page as recovery-eligible when URL contains `type=recovery` on mount OR persist a sessionStorage flag when `PASSWORD_RECOVERY` fires.
15. **NEW-05** `WinePublicPassport.tsx` + `WinePassportPreview.tsx` — normalize `'' → undefined` for all nutrition reads so cleared values don't render `" kJ"` and don't suppress `wine.negligibleAmounts` notice.
16. **NEW-07** — add `auth.recoveryLinkRequired` to all 25 locales.

## Phase E — Mandatory tests (FIX_SPEC §B.2)

Add tests for: BUG-01 setup-mode auth routing, BUG-02 late `content` prop syncs into editor DOM, BUG-04 `__ai_autofill` stripped and no re-run on second mount, BUG-05 sulfite bolding via real selection path + integrity test that 4 sulfite ids are allergens in both `wineIngredients.ts` and `wine-label-ocr`, BUG-06 yes/no/unknown declaration texts, BUG-07 `false` checkbox hidden under `i18n.language='fr'`, BUG-08 exported `<g>` transform contains `scale(250/cells)`, BUG-09 zh-CN render, BUG-11 8-hex slug accepted, BUG-12 failed `site_config` fetch → `isSetupRequired === false`, BUG-19 stored `0` renders and clearing stores `null`.

## Phase F — Housekeeping (P3)

- **BUG-37** replace remaining `catch (error: any)` with `catch (error: unknown)` + narrowing in: `Dashboard.tsx` (109/119/129), `ResetPassword.tsx:72`, `Setup.tsx:94`, `PassportForm.tsx:286`, `Admin.tsx` (93/107), `Auth.tsx:86`, `ImageUpload.tsx:101`.
- **NEW-06** `buildVerboseStatus` — clean or timestamp-gate reads of `test-results/` and `coverage/` so stale artifacts can't leak a bogus `pass`.
- **NEW-09** `CounterfeitProtection.tsx` — drop dead hardcoded loading; add pre-save enable feedback.
- **NEW-10** cosmetics: trailing newlines in locale JSONs, `WineRecycling.tsx:84` redundant ternary, dead `isCustomComposition*` fields, no-op `data-viewbox`.
- Fix pre-existing `recycling_materials`/`packaging_materials` key mismatch at `WineFields.tsx:505`.

## Verification

Run and report:
- `tsgo --noEmit` → clean
- Full `bunx vitest run` (no shard workaround in committed config) → all pass, no OOM
- `bunx eslint .` → not regressed
- `npm run build` → pass

## Technical notes

- Test gate ordering matters: Phase A must land before running the suite locally, otherwise the OOM masks all other results.
- Locale changes touch 25 files each (en + 23 EU + zh-CN); duplicate-key + completeness tests will enforce parity.
- `WinePublicPassport` column keying change is a data-shape change to how the table is built, not a schema change — no migration.
- `send-counterfeit-request` idempotency is server-side only; client already guards on `counterfeit_request_sent_at`.
- No threshold/policy relaxation anywhere; `vite.config.ts` test-gate config stays as-is.
