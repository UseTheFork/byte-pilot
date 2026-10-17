#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);

function usage() {
  console.error("usage: task-brief.cjs PLAN_FILE TASK_NUMBER [OUTFILE]");
  process.exit(2);
}

if (args.length < 2 || args.length > 3) {
  usage();
}

const [plan, taskNumber, specifiedOutput] = args;
let planIsFile = false;

try {
  planIsFile = fs.statSync(plan).isFile();
} catch {}

if (!planIsFile) {
  console.error(`no such plan file: ${plan}`);
  process.exit(2);
}

let output;

if (specifiedOutput !== undefined) {
  output = specifiedOutput;
} else {
  const workspaceScript = path.join(__dirname, "sdd-workspace.cjs");
  let directory;

  try {
    directory = execFileSync(process.execPath, [workspaceScript, plan], {
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
      stdio: ["ignore", "pipe", "inherit"],
    }).replace(/\n+$/, "");
  } catch (error) {
    process.exit(error.status ?? 1);
  }

  output = path.join(directory, `task-${taskNumber}-brief.md`);
}

const planText = fs.readFileSync(plan, "utf8");
const headingStart = /^#+[ \t]+Task[ \t]+[0-9]+/;
const taskHeading = new RegExp(`^#+[ \\t]+Task[ \\t]+${taskNumber}([^0-9]|$)`);
const lines = planText.split("\n");

if (planText.endsWith("\n")) {
  lines.pop();
}

let inFence = false;
let inTask = false;
const taskLines = [];

for (const line of lines) {
  if (line.startsWith("```")) {
    inFence = !inFence;
  }

  if (!inFence && headingStart.test(line)) {
    inTask = taskHeading.test(line);
  }

  if (inTask) {
    taskLines.push(line);
  }
}

try {
  fs.writeFileSync(output, taskLines.map((line) => `${line}\n`).join(""));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

if (taskLines.length === 0) {
  console.error(
    `task ${taskNumber} not found in ${plan} (no heading matching 'Task ${taskNumber}')`,
  );
  process.exit(3);
}

console.log(`wrote ${output}: ${taskLines.length} lines`);
