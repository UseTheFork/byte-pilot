const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function options(allowed, required, usage) {
  if (process.argv.length === 3 && process.argv[2] === "--help") {
    process.stdout.write(`${usage}\n`);
    process.exit(0);
  }
  const result = {};
  const args = process.argv.slice(2);
  while (args.length) {
    const flag = args.shift();
    if (!allowed.includes(flag) || flag in result || !args.length || args[0].startsWith("--")) {
      throw new Error(usage);
    }
    result[flag] = args.shift();
  }
  if (required.some((flag) => !result[flag])) throw new Error(usage);
  return result;
}

function git(cwd, args, accepted = [0]) {
  const result = spawnSync("git", ["--no-pager", "-c", "color.ui=false", ...args], {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
  });
  if (result.error) throw result.error;
  if (!accepted.includes(result.status)) {
    throw new Error(`git ${args[0]} failed (${result.status}): ${result.stderr.trim()}`);
  }
  return result;
}

function checkout(input) {
  const root = fs.realpathSync(git(input, ["rev-parse", "--show-toplevel"]).stdout.trim());
  return {
    root,
    head: git(root, ["rev-parse", "--verify", "HEAD^{commit}"]).stdout.trim(),
    branch: git(root, ["branch", "--show-current"]).stdout.trim(),
  };
}

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return (
    relative === "" ||
    (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`))
  );
}

function main(run) {
  try {
    run();
  } catch (error) {
    process.stderr.write(`script: ${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { options, git, checkout, inside, main };
