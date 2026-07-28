## Fix 3 verification findings

### Issue 1 — Stabilize empty-passports reference (infinite loop)
File: `src/hooks/usePassports.tsx`
- Add module-level `const EMPTY_PASSPORTS: Passport[] = []`.
- Change `passports: passports || []` → `passports: passports ?? EMPTY_PASSPORTS`.
- Preserves BUG-14 sync semantics but keeps referential stability across renders when the query returns no data, breaking the Dashboard `useEffect` loop.

### Issue 2 — Update stale PassportPreview test expectation
File: `src/components/PassportPreview.test.tsx` line 71
- The rendered logo id is now `battery-crossed-bin` (BUG-25 rename), formatted to `Battery Crossed Bin` by the component's title-case transform.
- Update expectation from `getByText('Weee')` to `getByText('Battery Crossed Bin')`.

### Issue 3 — Fail-closed build gate
File: `package.json`
- Change `"build": "vitest run --coverage; vite build"` to use `&&` so a non-zero test exit aborts the build.
- Additionally clean stale results before the run so the status pipeline can't read a previous artifact when tests are killed. Update `build` to:
  `"rm -rf test-results coverage && vitest run --coverage && vite build"`
- This makes the vite plugin's `buildVerboseStatus` (which now returns `unknown` on missing artifacts) accurately reflect the current run, and prevents `pass` from leaking through when tests fail.

### Verification
Run in sequence and report each result:
1. `bunx tsgo --noEmit`
2. `bunx vitest run` (full suite — should no longer OOM once Issue 1 is fixed)
3. `bun run lint`
4. `bun run build`
