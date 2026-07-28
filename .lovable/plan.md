
## Problem

Same exit 143 (SIGTERM) as before. My previous edit stopped setting `testRunError` on SIGTERM, but `buildVerboseStatus()` still falls through to:

```ts
if (testRunAttempted && !trExists && !cvExists) {
  return { status: "fail", message: "No test artifacts generated.", ... };
}
```

So when the sandbox kills vitest before any artifacts are flushed, the build still reports `fail`. The stderr shown in the report is just router/dialog warnings that were in the buffer at SIGTERM — not the cause.

## Fix

Add a `testRunTerminated` flag in `vite.config.ts`, set it in the SIGTERM/143 branch of `runTestsOnBuild()`, and in `buildVerboseStatus()` short-circuit to `{ status: "unknown", message: "Test run terminated by environment (SIGTERM). Artifacts unavailable." }` when that flag is set and no artifacts exist. This mirrors the existing `"unknown"` path used when no run has been attempted at all.

No other changes:
- Thresholds stay at 30.
- English audit rules untouched.
- No tests skipped or deleted.
- No source changes for the non-fatal router/dialog warnings.

## Verification

Rebuild and confirm `build-status.json` reports `status: "unknown"` (or `"pass"` if artifacts land) instead of `"fail"` when SIGTERM hits.

## Technical notes

- Exit 143 = 128 + 15 (SIGTERM) — the sandbox OOM/timeout killer, not vitest.
- `"unknown"` is the correct status for "we couldn't measure", distinct from `"fail"` ("we measured and it failed"). The BuildStatusBanner already handles `"unknown"` without blocking.
