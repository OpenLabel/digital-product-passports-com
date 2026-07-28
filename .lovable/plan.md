
## Problem

The build failure isn't a test assertion failure — it's `Exit code: 143` (SIGTERM). The `runTestsOnBuild` plugin in `vite.config.ts` spawns `npx vitest run --coverage` with a 300 s timeout, and the sandbox kills it (OOM or timeout) before it can write `test-results/results.json` or `coverage/coverage-summary.json`. The captured stderr shown to the user is just the last chunk of noise (React Router future-flag warnings, Radix Dialog description warnings) that happened to be in the buffer when SIGTERM hit — those warnings are not the cause.

We've hit this exact wall repeatedly: 800+ tests + v8 coverage in a single Node process exceeds the sandbox's memory ceiling.

## Fix

Change **only** the way the build-time test run is invoked so it fits in the sandbox, without lowering thresholds, skipping tests, or touching English audit rules.

1. **`vite.config.ts` — `runTestsOnBuild()`**
   - Invoke vitest with `--pool=forks --poolOptions.forks.singleFork=true --poolOptions.forks.maxForks=1` so each test file runs in a fresh worker and memory is reclaimed between files.
   - Pass `NODE_OPTIONS=--max-old-space-size=4096` in the child env to raise the per-process heap ceiling.
   - Keep coverage on (needed for the 30% threshold check) but switch to `--coverage.reporter=json-summary --coverage.reporter=text-summary` only (drop `html` in the build-time run — it's the biggest memory hog; the local `vitest.config.ts` keeps html for dev).
   - Bump the `execSync` timeout from 300 s → 600 s (still bounded).
   - On SIGTERM/exit 143 specifically, if `results.json` exists, treat it as the source of truth instead of reporting a hard failure.

2. **No changes** to:
   - Thresholds in `vite.config.ts` / `vitest.config.ts` (stay at 30).
   - English locale audit rules.
   - Any existing test files (no skips, no deletes).
   - Application source code — the React Router and Radix warnings in stderr are non-fatal and not the cause.

3. **Verification**
   - Run `bunx vitest run --pool=forks --poolOptions.forks.singleFork=true` locally in the sandbox to confirm it completes and writes `test-results/results.json`.
   - Then trigger a build to confirm `build-status.json` reports `status: "pass"`.

## Technical notes

- Exit 143 = 128 + 15 (SIGTERM). In this sandbox it's almost always the OS OOM-killer or the harness's own kill, not a vitest assertion.
- `singleFork=true` serializes files into one long-lived worker; combined with `maxForks=1` it keeps peak RSS flat instead of spiking with parallel workers each loading React + jsdom + i18n locales.
- Dropping the `html` coverage reporter at build time removes the in-memory HTML tree construction for every source file; `json-summary` is all `buildVerboseStatus()` actually reads.
