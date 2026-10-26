import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { after, before, test } from "node:test";

import { makeJustStubDir, makeTempDir, pathWith, runCli } from "./helpers.ts";

let justDirectory: string;

before(async () => {
  justDirectory = await makeJustStubDir();
});

after(async () => {
  await rm(justDirectory, { recursive: true, force: true });
});

const binary = Buffer.from([0xff, 0xfe, 0x00, 0xc3, 0x28, 0x80, 0x0d, 0x0a, 0xff]);

// Builds a fixture stubs directory, runs init against it, and hands the installed skills path to `check`.
async function withInstall(
  files: Record<string, string | Buffer>,
  args: string[],
  check: (result: ReturnType<typeof runCli>, skills: string) => Promise<void>,
) {
  const stubs = await makeTempDir("spindle-stubs-");
  const project = await makeTempDir();
  try {
    for (const [path, content] of Object.entries(files)) {
      const target = join(stubs, "skills", path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }
    const result = runCli(project, ["init", ...args], pathWith(justDirectory), {
      SPINDLE_STUBS_DIR: stubs,
    });
    await check(result, join(project, ".github", "skills"));
  } finally {
    await rm(stubs, { recursive: true, force: true });
    await rm(project, { recursive: true, force: true });
  }
}

test("variable output and tags render against stacks", async () => {
  await withInstall(
    {
      "demo/SKILL.md":
        "stacks=<%= stacks | join(',') %>\n<% if 'python' in stacks %>PY<% endif %>\n<% if 'typescript' in stacks %>TS<% endif %>\n",
    },
    ["--stack", "python", "--stack", "php-laravel"],
    async (result, skills) => {
      assert.equal(result.status, 0, result.stderr);
      assert.equal(
        await readFile(join(skills, "demo", "SKILL.md"), "utf8"),
        "stacks=python,php-laravel\nPY\n\n",
      );
    },
  );
});

test("VSCODE placeholders and braces are preserved literally, without escaping", async () => {
  const text = '{{VSCODE_FOO}} {{ x }} {% y %} {# z #} <b>&</b> "q"\n';
  await withInstall({ "demo/SKILL.md": text }, ["--stack", "python"], async (result, skills) => {
    assert.equal(result.status, 0, result.stderr);
    assert.equal(await readFile(join(skills, "demo", "SKILL.md"), "utf8"), text);
  });
});

test("an undefined variable fails init instead of rendering blank", async () => {
  await withInstall(
    { "demo/SKILL.md": "hello <%= variables.missing %>\n" },
    ["--stack", "python"],
    async (result) => {
      assert.equal(result.status, 1);
      assert.match(result.stderr, /spindle:/);
      assert.match(result.stderr, /undefined/);
    },
  );
});

test("sub-files install alongside the skill including nested directories, rendered", async () => {
  await withInstall(
    {
      "demo/SKILL.md": "top\n",
      "demo/templates/a.md": "a <%= stacks | join(',') %>\n",
      "demo/templates/sub/x.md": "x {{VSCODE_FOO}} <%= stacks | join('+') %>\n",
    },
    ["--stack", "python", "--stack", "typescript"],
    async (result, skills) => {
      assert.equal(result.status, 0, result.stderr);
      assert.equal(
        await readFile(join(skills, "demo", "templates", "a.md"), "utf8"),
        "a python,typescript\n",
      );
      assert.equal(
        await readFile(join(skills, "demo", "templates", "sub", "x.md"), "utf8"),
        "x {{VSCODE_FOO}} python+typescript\n",
      );
    },
  );
});

test("non-text files are copied byte for byte", async () => {
  await withInstall(
    {
      "demo/SKILL.md": "top\n",
      "demo/assets/blob.bin": binary,
      "demo/assets/image.png": binary,
      // Text extension but NUL bytes: must not be rendered or re-encoded.
      "demo/assets/odd.md": Buffer.concat([Buffer.from("<%= nope %>"), binary]),
    },
    ["--stack", "python"],
    async (result, skills) => {
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(await readFile(join(skills, "demo", "assets", "blob.bin")), binary);
      assert.deepEqual(await readFile(join(skills, "demo", "assets", "image.png")), binary);
      assert.deepEqual(
        await readFile(join(skills, "demo", "assets", "odd.md")),
        Buffer.concat([Buffer.from("<%= nope %>"), binary]),
      );
    },
  );
});
