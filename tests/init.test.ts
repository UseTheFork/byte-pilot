import assert from "node:assert/strict";
import { readFile, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { makeJustStubDir, makeTempDir, pathWith, runCli } from "./helpers.ts";

let justDirectory: string;

before(async () => {
  justDirectory = await makeJustStubDir();
});

after(async () => {
  await rm(justDirectory, { recursive: true, force: true });
});

async function runInit(args: string[]) {
  const project = await makeTempDir();
  try {
    return { project, result: runCli(project, ["init", ...args], pathWith(justDirectory)) };
  } catch (error) {
    await rm(project, { recursive: true, force: true });
    throw error;
  }
}

test("init installs the placeholder skill and records repeatable stack flags", async () => {
  const { project, result } = await runInit(["--stack", "php-laravel", "--stack", "typescript"]);

  try {
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(await readFile(join(project, ".github/spindle.json"), "utf8")), {
      stacks: ["php-laravel", "typescript"],
      variables: {},
    });
    const skill = await readFile(
      join(project, ".github/skills/spindle-placeholder/SKILL.md"),
      "utf8",
    );
    assert.match(skill, /^---\nname: spindle-placeholder\nversion: \d+\.\d+\.\d+\n/m);
    assert.match(skill, /# Spindle placeholder/);
    assert.deepEqual(await readdir(join(project, ".github/skills")), ["spindle-placeholder"]);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("init fails clearly and writes nothing when no stack is selected", async () => {
  const { project, result } = await runInit([]);

  try {
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /at least one --stack/i);
    await assert.rejects(readFile(join(project, ".github/spindle.json")));
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("init rejects unsupported stack ids with a clear error", async () => {
  const { project, result } = await runInit(["--stack", "ruby"]);

  try {
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /invalid stack.*ruby|unsupported stack.*ruby/i);
    await assert.rejects(readFile(join(project, ".github/spindle.json")));
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
