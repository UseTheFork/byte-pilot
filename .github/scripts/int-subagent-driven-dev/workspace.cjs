const fs = require("node:fs");
const path = require("node:path");
const { options, git, checkout, inside, main } = require("../utils/common.cjs");

const usage =
  "Usage: just sdd::workspace --workspace CHECKOUT_ROOT --reports-dir .scratch/FEATURE/reports --ticket NN [--round R]";

main(() => {
  const args = options(
    ["--workspace", "--reports-dir", "--ticket", "--round"],
    ["--workspace", "--reports-dir", "--ticket"],
    usage,
  );
  const workspacePath = args["--workspace"];
  const workspace = checkout(workspacePath);
  const { root } = workspace;
  if (!path.isAbsolute(workspacePath) || fs.realpathSync(workspacePath) !== root) {
    throw new Error("Workspace must be the absolute checkout root.");
  }

  const relative = args["--reports-dir"];
  const segments = relative.split("/");
  if (
    !relative.startsWith(".scratch/") ||
    path.isAbsolute(relative) ||
    relative.includes("\\") ||
    segments.some((part) => !part || part === "." || part === ".." || part.toLowerCase() === ".git")
  ) {
    throw new Error("Reports directory must be inside .scratch without path traversal.");
  }

  const directory = path.join(root, ...segments);
  let ancestor = directory;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  if (!fs.statSync(ancestor).isDirectory() || !inside(root, fs.realpathSync(ancestor))) {
    throw new Error("Reports directory must remain inside this checkout.");
  }
  if (
    git(root, ["check-ignore", "--quiet", "--no-index", "--", `${relative}/sdd-report.md`], [0, 1])
      .status === 0
  ) {
    throw new Error("Reports directory is ignored.");
  }

  const ticket = args["--ticket"];
  const round = args["--round"];
  if (!/^(0[1-9]|[1-9][0-9]*)$/.test(ticket)) {
    throw new Error("Ticket must be a positive numeric identifier, for example 03.");
  }
  if (round !== undefined && !/^[1-9][0-9]*$/.test(round)) {
    throw new Error("Round must be a positive integer.");
  }

  const report = (name) => ({
    relative: `${relative}/${name}.md`,
    absolute: path.join(directory, `${name}.md`),
  });
  const reports = {
    implementation: report(`${ticket}-implementation`),
    codeReview: report(`${ticket}-code-review`),
    taskReview: report(`${ticket}-task-review`),
    ...(round ? { scopedReview: report(`${ticket}-round-${round}-review`) } : {}),
    finalReview: report("final-review"),
    finalFixReview: report("final-fix-review"),
  };

  for (const destination of Object.values(reports)) {
    if (
      git(root, ["check-ignore", "--quiet", "--no-index", "--", destination.relative], [0, 1])
        .status === 0
    ) {
      throw new Error(`Report destination is ignored: ${destination.relative}`);
    }
    if (fs.existsSync(destination.absolute) && !fs.lstatSync(destination.absolute).isFile()) {
      throw new Error(`Report destination is not a regular file: ${destination.relative}`);
    }
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        workspace: root,
        reportsDirectory: directory,
        reports,
      },
      null,
      2,
    )}\n`,
  );
});
