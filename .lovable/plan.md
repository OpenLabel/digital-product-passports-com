
# Apply FIX_SPEC.md — Full Audit Remediation Plan

Execute all 37 fixes from `FIX_SPEC.md` in 4 phases by severity. Each phase ends with `npm test` + `tsc --noEmit` green before moving on. New tests are added per the spec's B.2 checklist. No thresholds lowered.

## Phase 1 — P0 (must ship first)

**BUG-01** Fresh-install redirect loop
- `src/App.tsx`: in the `isSetupRequired` branch, add `<Route path="/auth" element={<Auth/>} />` and `<Route path="/reset-password" element={<ResetPassword/>} />` before the catch-all.
- Test: render `<App/>` with `isSetupRequired=true`, navigate to `/auth`, assert Auth page mounts (no loop).

## Phase 2 — P1 (data-loss / regulatory / core flows)

**BUG-02** RichTextEditor content sync
- Add `useEffect([content, editor])` calling `editor.commands.setContent(content||'', { emitUpdate:false })` when it differs from `editor.getHTML()`.
- Test: mount with `''`, rerender with `'<p>hello</p>'`, assert visible.

**BUG-03** Auto-translate mount overwrite
- `useAutoTranslate.ts`: add `didInitRef`; on first mount if `existingTranslations` non-empty, seed `lastTranslatedValueRef.current = value` so the debounced pass no-ops.
- Test: mount with `existingTranslations={fr:'manual'}`, advance timers, assert `onTranslationsGenerated` not called.

**BUG-04** Wine `__ai_autofill` sentinel loop
- `WineFields.tsx`: pass `cleanData` into `handleAIAutofill`, merge from `cleanData` (never stale `data`), single `onChange(mergedWithoutSentinel)`.
- Test: seed `data.__ai_autofill`, mount, assert no sentinel in emitted data; second mount with persisted data does not re-run.

**BUG-05** Sulfites allergen flag
- `src/data/wineIngredients.ts`: add `isAllergen:true` to `sulfites`, `sulfur_dioxide`, `potassium_bisulfite`, `potassium_metabisulfite`.
- Mirror in `supabase/functions/wine-label-ocr/index.ts` `KNOWN_INGREDIENTS`.
- `WinePublicPassport.tsx`: re-derive `isAllergen = ing.isAllergen || getIngredientById(ing.id)?.isAllergen`.
- Update render test + add integrity test across both sources.

**BUG-06** Toy false "no fragrances declared"
- `ToyPublicPassport.tsx:504-517`: branch on `has_allergenic_fragrances`. `'no'` → `noFragrancesDeclared`. `'yes' && list.length>0` → `fragrancesDeclared`. `'unknown'` / `'yes'`-empty → new key `toyPublic.values.fragrancesNotAssessed`.
- Add key to all 25 locales.
- Tests for all three branches.

**BUG-07** Inverted checkbox display in non-EN
- `PublicPassport.tsx` + `PassportPreview.tsx`: filter by raw `value`, not translated string. `if (question.type==='checkbox' || typeof value==='boolean') { if (!value) return null; } else if (!displayValue) return null;`
- Test: French locale, false checkbox is hidden.

**BUG-08** QR SVG print scale broken
- `QRCodeDialog.tsx handleDownloadSvg`: read `viewBox` cells, apply `translate(padding,yOffset) scale(qrSize/cells)` on `<g>`.
- Test: exported `<g>` transform contains `scale(...)`.

**BUG-09** `zh-CN` broken by `.split('-')[0]`
- New `src/lib/dppLanguage.ts` with `toDppLanguage()`.
- Replace `.split('-')[0]` in the 12 files listed in spec §BUG-09.
- `DPPLanguagePicker.tsx`: use it in `getEffectiveLanguage` and mount effect so `zh-CN` recognized as supported.
- `supabase/functions/translate-text/index.ts`: `.max(24)` → `.max(25)`.
- Unit tests for `toDppLanguage` + render test showing zh-CN translation.

**BUG-10** Counterfeit email never sent on new-passport enable
- `PassportForm.handleSubmit`: after successful save, if `category_data.counterfeit_protection_enabled && !category_data.counterfeit_request_sent_at`, invoke `send-counterfeit-request`, then persist `counterfeit_request_sent_at` for idempotency.
- `CounterfeitProtection.tsx`: only show "email sent" panel when timestamp exists.
- Widen `send-counterfeit-request` slug regex to `{8,16,32}` (see BUG-11).

## Phase 3 — P2 (correctness / UX / minor security)

- **BUG-11** widen slug regex in `get-public-passport` and `send-counterfeit-request` to `^[a-f0-9]{8}$|^[a-f0-9]{16}$|^[a-f0-9]{32}$`. Edge fn test with 8-char.
- **BUG-12** `useSiteConfig`: add `error` flag; on fetch error keep prior config, do NOT default to `setup_complete:false`. `App.tsx` gates setup routing on `isSetupRequired && !error`. Test.
- **BUG-13** `PassportForm`: `beforeunload` guard while dirty; optional localStorage draft autosave keyed by id/`new`.
- **BUG-14** `Dashboard.tsx`: sync effect uses `if (!isLoading) setLocalPassports(passports)`. Pull `isLoading` from `usePassports()`. Test empty state after delete.
- **BUG-15** `reorderPassports`: create RPC `reorder_passports(p_ids uuid[])` in a migration doing single-transaction update scoped to `auth.uid()`; call from hook; `onError` toast + `invalidateQueries`.
- **BUG-16** `useAuth.tsx`: don't `clearReferralCode()` unless insert succeeds; on `SIGNED_IN` retry pending insert. Log errors.
- **BUG-17** `WineRecycling.tsx`: assign UUID id per component (standard + custom); public table keys off unique id.
- **BUG-18** i18n keys for wine `packagingMaterialTypes` / `materialCompositions` / `disposalMethods` (`wine.recycling.types.*`, `.compositions.*`, `.disposal.*`) in all 25 locales; look them up in `WinePublicPassport.tsx`.
- **BUG-19** `CategoryQuestions.tsx` number input: `value={value === 0 || value ? String(value) : ''}`; onChange stores `null` for empty.
- **BUG-20** `PublicPassport.tsx:114-116`: title fallback chain includes `passport.name`.
- **BUG-21** new `src/lib/sanitizeUrl.ts`; wrap `href` in `ToyPublicPassport.tsx:258,473,582`. Test `javascript:` neutralized.

## Phase 4 — P3 (cleanup / hardening)

- **BUG-22** `wineCalculations.ts`: kJ from grams via Annex XIV (alcohol 29, carb 17, org acid 13, polyol 10). Organic acid 3.12→3. Update tests.
- **BUG-23** Generic renderer i18n: resolve `titleKey`/`labelKey` with English fallback (mirror `CategoryQuestions.tsx`).
- **BUG-24** `toys.ts`: mark selected safety channel detail field required via `showWhen`+`required`.
- **BUG-25** `battery.ts`: add unique identifier field; add `lead` recycled-content when chemistry is lead-acid; correct `weee`→battery-crossed-bin logo mapping.
- **BUG-26** `WineRecycling.tsx`: implement custom composition input path OR remove the dead option.
- **BUG-27** `WinePublicPassport.tsx`: when `carbon_dioxide` is present as additive gas, list explicitly instead of collapsing.
- **BUG-28** `WineIngredients.handleApplyFromPicker`: merge into current ordered list preserving order, don't concat standard-then-custom.
- **BUG-29** `WineFields.tsx` nutrition inputs: empty stores `null`/`''`, not `Number('')`.
- **BUG-30** Add missing keys (`qrDialog.urlMismatch`, `.printSizeInstruction`, `.openPassport`, `.downloadSvg`, `.downloadPng`, `passport.productInfo`, `passport.description`) to `en.json` + all 25 locales.
- **BUG-31** `ImageUpload.tsx`: delete previous storage object on replace/remove; enforce MIME + size (already partial).
- **BUG-32** `use-toast.ts`: dep array `[state]` → `[]`.
- **BUG-33** `BuildStatusBanner.tsx`: use `useLocation()`; AbortController for fetch.
- **BUG-34** `ResetPassword.tsx`: gate form on `isRecovery` or remove the dead state.
- **BUG-35** `AdminLeaderboard.tsx` + `Admin.tsx`: send admin token via `Authorization: Bearer` header only; stop appending `?token=`.
- **BUG-36** `useAuth.tsx` log referral insert error; `useReferral.ts` bound code length (`.slice(0,64)`).
- **BUG-37** Lint: rename `Infinity` var in `Index.tsx`; type `catch (e: unknown)` in listed files; replace `require()` in `tailwind.config.ts`; add explicit disable/comment on empty catches in `vite.config.ts`.
- **BUG-38** `usePassports.tsx`: add `.eq('user_id', user.id)` on update/delete/reorder mutations (defense-in-depth).

## Verification (after each phase)

```
npx tsc --noEmit
npm test
```

Final phase also runs `npm run build`.

## Notes / risk

- Scope is very large (~50+ file edits, 1 migration, ~10 new tests, translation additions across 25 locale files for BUG-06/18/30). Will proceed phase-by-phase committing tests alongside each fix so a failure in one phase doesn't block the next.
- Migration for BUG-15 (`reorder_passports` RPC) requires `GRANT EXECUTE TO authenticated` and a `SECURITY DEFINER` with `auth.uid()` scoping.
- Locale additions will trigger the audit tests — any new English strings will be added to `technicalTerms` allowlist only when truly language-neutral (per project convention).
- If any P3 fix would break existing green tests in a non-obvious way, I'll stop and surface it rather than adjusting the test.
