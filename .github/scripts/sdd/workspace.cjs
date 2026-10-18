#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function fail(message, status = 1) {
  console.error(message);
  process.exit(status);
}

function runGit(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    }).replace(/\n+$/, "");
  } catch (error) {
    process.exit(error.status ?? 1);
  }
}

function physicalPath(filePath) {
  return fs.realpathSync(filePath);
}

function owns(directory, planId) {
  const markerPath = path.join(directory, "plan-path");

  if (fs.existsSync(markerPath)) {
    try {
      return fs.readFileSync(markerPath, "utf8").replace(/\n+$/, "") === planId;
    } catch {
      return false;
    }
  }

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(markerPath, `${planId}\n`);
  return true;
}

const args = process.argv.slice(2);

if (args.length !== 1) {
  fail("usage: workspace.cjs PLAN_FILE", 2);
}

const [plan] = args;
let planIsFile = false;

try {
  planIsFile = fs.statSync(plan).isFile();
} catch {}

if (!planIsFile) {
  fail(`no such plan file: ${plan}`, 2);
}

const slug = path.basename(plan, ".md");

if (!slug || slug === "." || slug === "..") {
  fail(`cannot derive a workspace name from: ${plan}`, 2);
}

const root = physicalPath(runGit(["rev-parse", "--show-toplevel"]));
const base = path.join(root, ".github", "knowledge", "sdd");
const planDirectory = physicalPath(path.dirname(plan));
const absolutePlan = path.join(planDirectory, path.basename(plan));
const relativePlan = path.relative(root, absolutePlan);
const isInRepository =
  relativePlan !== ".." &&
  !relativePlan.startsWith(`..${path.sep}`) &&
  !path.isAbsolute(relativePlan);
const planId = isInRepository ? relativePlan : absolutePlan;

let directory = path.join(base, slug);

if (!owns(directory, planId)) {
  const parent = path.basename(planDirectory);
  directory = path.join(base, `${slug}-${parent}`);

  if (!owns(directory, planId)) {
    let number = 2;

    while (!owns(path.join(base, `${slug}-${parent}-${number}`), planId)) {
      number += 1;
    }

    directory = path.join(base, `${slug}-${parent}-${number}`);
  }
}

const ignorePath = path.join(base, ".gitignore");

if (!fs.existsSync(ignorePath)) {
  fs.writeFileSync(ignorePath, "*\n");
}

console.log(directory);
