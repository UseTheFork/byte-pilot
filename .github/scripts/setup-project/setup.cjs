const fs = require("node:fs");
const path = require("node:path");
const { options, main } = require("../utils/common.cjs");

const usage = "Usage: just setup-project::setup-project --workspace ABSOLUTE_PROJECT_ROOT";
const templates = path.resolve(__dirname, "../../skills/setup-project/templates");

main(() => {
  const args = options(["--workspace"], ["--workspace"], usage);
  if (!path.isAbsolute(args["--workspace"])) {
    throw new Error("Workspace must be an absolute project directory.");
  }
  const workspace = fs.realpathSync(args["--workspace"]);
  if (!fs.statSync(workspace).isDirectory()) {
    throw new Error("Workspace must be a directory.");
  }
  const created = [];
  const preserved = [];
  for (const relative of ["docs", "docs/adr", ".scratch", "docs/agents"]) {
    const target = path.join(workspace, relative);
    const entry = fs.lstatSync(target, { throwIfNoEntry: false });
    if (entry) {
      if (!entry.isDirectory()) {
        throw new Error(`${relative} must be a real directory, not a file or symlink.`);
      }
      preserved.push(relative);
    } else {
      fs.mkdirSync(target);
      created.push(relative);
    }
  }
  for (const [source, relative] of [
    ["domain.md", "docs/agents/domain.md"],
    ["issue-tracker-local.md", "docs/agents/issue-tracker.md"],
    ["triage-labels.md", "docs/agents/triage-labels.md"],
    ["tooling.md", "docs/agents/tooling.md"],
  ]) {
    const target = path.join(workspace, relative);
    const entry = fs.lstatSync(target, { throwIfNoEntry: false });
    if (entry) {
      if (!entry.isFile()) {
        throw new Error(`${relative} must be a regular file, not a directory or symlink.`);
      }
      preserved.push(relative);
    } else {
      fs.copyFileSync(path.join(templates, source), target, fs.constants.COPYFILE_EXCL);
      created.push(relative);
    }
  }
  process.stdout.write(`${JSON.stringify({ workspace, created, preserved }, null, 2)}\n`);
});
