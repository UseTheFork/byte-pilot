const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const templates = path.resolve(__dirname, "../../skills/setup-project/templates");
const copies = [
  ["domain.md", "docs/agents/domain.md"],
  ["issue-tracker-local.md", "docs/agents/issue-tracker.md"],
  ["triage-labels.md", "docs/agents/triage-labels.md"],
  ["tooling.md", "docs/agents/tooling.md"],
];

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "setup-project-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function cli(...args) {
  return spawnSync(process.execPath, [path.join(__dirname, "setup.cjs"), ...args], {
    encoding: "utf8",
  });
}

test("bootstrap creates the required directories and exact bundled defaults", (t) => {
  const root = fixture(t);
  const result = cli("--workspace", root);
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.workspace, root);
  assert.deepEqual(data.created, [
    "docs",
    "docs/adr",
    ".scratch",
    "docs/agents",
    "docs/agents/domain.md",
    "docs/agents/issue-tracker.md",
    "docs/agents/triage-labels.md",
    "docs/agents/tooling.md",
  ]);
  assert.deepEqual(data.preserved, []);
  for (const directory of ["docs/adr", ".scratch", "docs/agents"]) {
    assert.equal(fs.statSync(path.join(root, directory)).isDirectory(), true);
  }
  for (const [source, destination] of copies) {
    assert.equal(
      fs.readFileSync(path.join(root, destination), "utf8"),
      fs.readFileSync(path.join(templates, source), "utf8"),
    );
  }
  assert.equal(fs.existsSync(path.join(root, "GLOSSARY.md")), false);
  assert.equal(fs.existsSync(path.join(root, ".github")), false);
});

test("bootstrap preserves custom files and content on repeated runs", (t) => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, "docs/agents"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs/agents/domain.md"), "custom domain\n");
  fs.writeFileSync(path.join(root, "docs/agents/tooling.md"), "custom tooling\n");
  const first = cli("--workspace", root);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(JSON.parse(first.stdout).preserved.includes("docs/agents/domain.md"), true);
  assert.equal(JSON.parse(first.stdout).preserved.includes("docs/agents/tooling.md"), true);
  const before = copies.map(([, file]) => fs.readFileSync(path.join(root, file), "utf8"));
  const second = cli("--workspace", root);
  assert.equal(second.status, 0, second.stderr);
  assert.deepEqual(JSON.parse(second.stdout).created, []);
  assert.equal(JSON.parse(second.stdout).preserved.length, 8);
  assert.equal(
    fs.readFileSync(path.join(root, "docs/agents/domain.md"), "utf8"),
    "custom domain\n",
  );
  assert.equal(
    fs.readFileSync(path.join(root, "docs/agents/tooling.md"), "utf8"),
    "custom tooling\n",
  );
  assert.deepEqual(
    copies.map(([, file]) => fs.readFileSync(path.join(root, file), "utf8")),
    before,
  );
});

test("bootstrap refuses symlink destinations including dangling file links", (t) => {
  const root = fixture(t);
  const outside = path.join(root, "outside");
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(root, "docs"));
  const directory = cli("--workspace", root);
  assert.notEqual(directory.status, 0);
  assert.match(directory.stderr, /symlink/);
  assert.deepEqual(fs.readdirSync(outside), []);
  fs.unlinkSync(path.join(root, "docs"));
  fs.mkdirSync(path.join(root, "docs/agents"), { recursive: true });
  const escapedFile = path.join(outside, "escaped.md");
  fs.symlinkSync(escapedFile, path.join(root, "docs/agents/domain.md"));
  const file = cli("--workspace", root);
  assert.notEqual(file.status, 0);
  assert.match(file.stderr, /symlink/);
  assert.equal(fs.existsSync(escapedFile), false);
  assert.equal(file.stdout, "");
});

test("bootstrap rejects invalid inputs and file-directory conflicts explicitly", (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, "docs"), "preserve\n");
  for (const args of [
    [],
    ["--workspace", "."],
    ["--workspace", path.join(root, "missing")],
    ["--workspace", path.join(root, "docs")],
    ["--workspace", root],
  ]) {
    const result = cli(...args);
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /script:/);
  }
  assert.equal(fs.readFileSync(path.join(root, "docs"), "utf8"), "preserve\n");
});

test("bootstrap help needs no workspace", () => {
  const result = cli("--help");
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /just setup-project::setup-project --workspace ABSOLUTE_PROJECT_ROOT/,
  );
});
