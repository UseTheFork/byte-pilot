#!/usr/bin/env node
import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const supportedStacks = ["php-laravel", "python", "typescript"] as const;

async function init(stacks: string[]) {
  const githubDirectory = join(process.cwd(), ".github");
  const skillsDirectory = join(githubDirectory, "skills");
  const stubsDirectory = fileURLToPath(new URL("./stubs/skills/", import.meta.url));
  const stubNames = await readdir(stubsDirectory, { withFileTypes: true });
  const skillStubs = stubNames.filter((entry) => entry.isDirectory());

  if (skillStubs.length === 0) {
    throw new Error("No skill stubs are available to install.");
  }

  await mkdir(skillsDirectory, { recursive: true });
  for (const stub of skillStubs) {
    await cp(join(stubsDirectory, stub.name), join(skillsDirectory, stub.name), {
      recursive: true,
    });
  }

  await writeFile(
    join(githubDirectory, "spindle.json"),
    `${JSON.stringify({ stacks, variables: {} }, null, 2)}\n`,
  );
}

async function main() {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    options: { stack: { type: "string", multiple: true } },
    allowPositionals: true,
    strict: true,
  });

  if (positionals[0] !== "init" || positionals.length !== 1) {
    throw new Error(
      "Usage: spindle init --stack <php-laravel|python|typescript> [--stack <stack>]",
    );
  }

  const stacks = values.stack ?? [];
  if (stacks.length === 0) {
    throw new Error("Provide at least one --stack flag <php-laravel|python|typescript>.");
  }

  for (const stack of stacks) {
    if (!supportedStacks.includes(stack as (typeof supportedStacks)[number])) {
      throw new Error(`Invalid stack '${stack}'. Supported stacks: ${supportedStacks.join(", ")}.`);
    }
  }

  await init([...new Set(stacks)]);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`spindle: ${message}`);
  process.exitCode = 1;
});
