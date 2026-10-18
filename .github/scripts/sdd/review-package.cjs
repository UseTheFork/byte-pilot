#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);

function usage() {
  console.error("usage: review-package.cjs PLAN_FILE BASE HEAD [OUTFILE]");
  process.exit(2);
}

function gitSucceeds(gitArgs) {
  try {
    execFileSync("git", gitArgs, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function runGit(gitArgs) {
  try {
    return execFileSync("git", gitArgs, {
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
      stdio: ["ignore", "pipe", "inherit"],
    });
  } catch (error) {
    process.exit(error.status ?? 1);
  }
}

function trimCommandOutput(output) {
  return output.replace(/\n+$/, "");
}

if (args.length < 3 || args.length > 4) {
  usage();
}

const [plan, base, head, specifiedOutput] = args;

let planIsFile = false;

try {
  planIsFile = fs.statSync(plan).isFile();
} catch {}

if (!planIsFile) {
  console.error(`no such plan file: ${plan}`);
  process.exit(2);
}

if (!gitSucceeds(["rev-parse", "--verify", "--quiet", base])) {
  console.error(`bad BASE: ${base}`);
  process.exit(2);
}

if (!gitSucceeds(["rev-parse", "--verify", "--quiet", head])) {
  console.error(`bad HEAD: ${head}`);
  process.exit(2);
}

const range = `${base}..${head}`;

if (!gitSucceeds(["merge-base", "--is-ancestor", base, head])) {
  console.error(`HEAD is not a descendant of BASE: ${range}`);
  process.exit(3);
}

const commits = Number.parseInt(runGit(["rev-list", "--count", range]), 10);

if (commits <= 0) {
  console.error(`empty commit range: ${range}`);
  process.exit(3);
}

let output;

if (specifiedOutput !== undefined) {
  output = specifiedOutput;
} else {
  const workspaceScript = path.join(__dirname, "workspace.cjs");
  let directory;

  try {
    directory = execFileSync(process.execPath, [workspaceScript, plan], {
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
      stdio: ["ignore", "pipe", "inherit"],
    });
  } catch (error) {
    process.exit(error.status ?? 1);
  }

  directory = trimCommandOutput(directory);
  const shortBase = trimCommandOutput(runGit(["rev-parse", "--short", base]));
  const shortHead = trimCommandOutput(runGit(["rev-parse", "--short", head]));
  output = path.join(directory, `review-${shortBase}..${shortHead}.diff`);
}

const log = runGit(["log", "--oneline", range]);
const stat = runGit(["diff", "--stat", range]);
const diff = runGit(["diff", "-U10", range]);
const reviewPackage =
  `# Review package: ${range}\n\n` +
  `## Commits\n${log}\n` +
  `## Files changed\n${stat}\n` +
  `## Diff\n${diff}`;

try {
  fs.writeFileSync(output, reviewPackage);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`wrote ${output}: ${commits} commit(s), ${Buffer.byteLength(reviewPackage)} bytes`);
