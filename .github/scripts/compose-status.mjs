import fs from "node:fs";

const THRESHOLDS = { lines: 30, branches: 30, functions: 30, statements: 30 };
const trPath = "test-results/results.json";
const cvPath = "coverage/coverage-summary.json";

const problems = [];
let failedTests = [];
let counts = { total: 0, passed: 0, failed: 0 };
let coverage = null;

if (fs.existsSync(trPath)) {
  const d = JSON.parse(fs.readFileSync(trPath, "utf-8"));
  counts = {
    total: d.numTotalTests ?? 0,
    passed: d.numPassedTests ?? 0,
    failed: d.numFailedTests ?? 0,
  };
  if (counts.failed > 0) {
    problems.push(`${counts.failed} test(s) failed`);
    for (const suite of d.testResults ?? []) {
      for (const a of suite.assertionResults ?? []) {
        if (a.status === "failed" && failedTests.length < 50) {
          const msg = (a.failureMessages ?? []).join(" ").slice(0, 200);
          failedTests.push(msg ? `${a.fullName} — ${msg}` : a.fullName);
        }
      }
    }
  }
} else {
  problems.push("No test results file produced");
}

if (fs.existsSync(cvPath)) {
  coverage = JSON.parse(fs.readFileSync(cvPath, "utf-8")).total;
  for (const [metric, threshold] of Object.entries(THRESHOLDS)) {
    const actual = coverage[metric]?.pct ?? 0;
    if (actual < threshold) problems.push(`${metric}: ${actual}% < ${threshold}%`);
  }
} else {
  problems.push("No coverage summary produced");
}

const status =
  problems.length === 0
    ? { status: "pass" }
    : {
        status: "fail",
        message: problems.join("; "),
        failedTests: failedTests.length ? failedTests : undefined,
      };

fs.writeFileSync("public/build-status.json", JSON.stringify(status));
console.log("build-status:", JSON.stringify(status).slice(0, 300));

// Append a log entry only on scheduled/manual runs (keeps history readable;
// push runs still refresh build-status.json above).
if (process.env.TRIGGER !== "push") {
  const logPath = "TEST_LOG.md";
  const header = "# Test Log\n\nUpdated automatically by `.github/workflows/tests.yml` (weekly cron + manual runs). Newest first.\n";
  const cov = (m) => (coverage ? `${coverage[m].pct}%` : "n/a");
  const entry = [
    `## ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC — ${process.env.TRIGGER}`,
    `- Commit: ${(process.env.GITHUB_SHA ?? "local").slice(0, 7)}`,
    `- Tests: ${counts.passed}/${counts.total} passed, ${counts.failed} failed`,
    `- Coverage: lines ${cov("lines")} · statements ${cov("statements")} · functions ${cov("functions")} · branches ${cov("branches")}`,
    `- Status: ${status.status.toUpperCase()}${status.message ? ` — ${status.message}` : ""}`,
    ...(failedTests.length ? [`- Failed: ${failedTests.slice(0, 5).join(" | ").slice(0, 500)}`] : []),
    "",
  ].join("\n");
  const existing = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf-8") : header;
  const body = existing.startsWith("# Test Log")
    ? existing.replace(/^(# Test Log\n(?:[^\n#][^\n]*\n)*\n?)/, `$1\n${entry}\n`)
    : `${header}\n${entry}\n${existing}`;
  fs.writeFileSync(logPath, body);
  console.log("TEST_LOG.md updated");
}
