const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  existsSync,
  symlinkSync,
} = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");

function fixture(t) {
  const directory = mkdtempSync(path.join(tmpdir(), "sdd-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const repo = path.join(directory, "checkout");
  mkdirSync(repo);
  const git = (...args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
  git("init", "-q");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  writeFileSync(path.join(repo, "tracked.txt"), "base\n");
  git("add", ".");
  git("commit", "-qm", "base");
  return { directory, repo, git };
}

function cli(...args) {
  return spawnSync(process.execPath, [path.join(__dirname, "workspace.cjs"), ...args], {
    encoding: "utf8",
  });
}

function reportArgs(repo, reportsDirectory = ".scratch/2026-10-23-demo/reports") {
  return ["--workspace", repo, "--reports-dir", reportsDirectory, "--ticket", "03"];
}

test("workspace resolves durable reports inside the current checkout without modifying them", (t) => {
  const { repo, git } = fixture(t);
  const reportsDirectory = ".scratch/2026-10-23-demo/reports";
  const absoluteReportsDirectory = path.join(repo, reportsDirectory);
  mkdirSync(absoluteReportsDirectory, { recursive: true });
  const implementation = path.join(absoluteReportsDirectory, "03-implementation.md");
  writeFileSync(implementation, "Existing report\n");
  const before = git("status", "--porcelain=v1");

  const result = cli(...reportArgs(repo, reportsDirectory), "--round", "2");

  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.workspace, repo);
  assert.equal(data.reportsDirectory, absoluteReportsDirectory);
  assert.deepEqual(Object.keys(data.reports), [
    "implementation",
    "codeReview",
    "taskReview",
    "scopedReview",
    "finalReview",
    "finalFixReview",
  ]);
  assert.equal(data.reports.implementation.relative, `${reportsDirectory}/03-implementation.md`);
  assert.equal(data.reports.implementation.absolute, implementation);
  assert.equal(data.reports.scopedReview.relative, `${reportsDirectory}/03-round-2-review.md`);
  assert.equal(data.reports.finalReview.relative, `${reportsDirectory}/final-review.md`);
  assert.equal(data.reports.finalFixReview.relative, `${reportsDirectory}/final-fix-review.md`);
  assert.equal(readFileSync(implementation, "utf8"), "Existing report\n");
  assert.equal(git("status", "--porcelain=v1"), before);
});

test("workspace rejects report paths outside .scratch, ignored paths, and invalid identifiers", (t) => {
  const { directory, repo } = fixture(t);
  symlinkSync(directory, path.join(repo, "outside"));
  writeFileSync(path.join(repo, ".gitignore"), ".scratch/ignored/\n");

  for (const reportsDirectory of [
    "../outside/reports",
    "reports",
    ".scratch/../reports",
    ".git/reports",
    "outside/reports",
    ".scratch/ignored/reports",
  ]) {
    const result = cli(...reportArgs(repo, reportsDirectory));
    assert.notEqual(result.status, 0, reportsDirectory);
    assert.equal(result.stdout, "", reportsDirectory);
    assert.match(result.stderr, /script:/, reportsDirectory);
  }

  for (const [flag, value] of [
    ["--ticket", "00"],
    ["--ticket", "../03"],
    ["--round", "0"],
  ]) {
    const args = reportArgs(repo);
    if (flag === "--ticket") args[args.length - 1] = value;
    else args.push(flag, value);
    const result = cli(...args);
    assert.notEqual(result.status, 0, `${flag} ${value}`);
    assert.match(result.stderr, /script:/);
  }
});

test("workspace requires a checkout root and reports invalid CLI usage", (t) => {
  const { repo } = fixture(t);
  const nested = path.join(repo, "nested");
  mkdirSync(nested);

  for (const args of [
    [],
    [...reportArgs(repo), "--unknown", "value"],
    [...reportArgs(nested)],
    [...reportArgs(repo), "--round", "2", "--round", "3"],
  ]) {
    const result = cli(...args);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /script:|Usage:/);
  }

  const help = cli("--help");
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /--reports-dir \.scratch/);
  assert.equal(existsSync(path.join(repo, ".scratch")), false);
});
