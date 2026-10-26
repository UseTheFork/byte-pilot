#!/usr/bin/env node
import { constants } from "node:fs";
import { access, cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import chalk from "chalk";

const supportedStacks = ["php-laravel", "python", "typescript"] as const;

const justInstallUrl = "https://just.systems/man/en/installation.html";

async function isExecutable(path: string) {
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function requireJust() {
  const extensions =
    process.platform === "win32"
      ? ["", ...(process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean)]
      : [""];
  const searchPath = process.env.PATH ?? process.env.Path ?? "";

  for (const directory of searchPath.split(delimiter).filter(Boolean)) {
    for (const extension of extensions) {
      if (await isExecutable(join(directory, `just${extension}`))) {
        return;
      }
    }
  }

  throw new Error(
    `\`just\` is not installed or not on PATH. spindle requires it; install it from ${justInstallUrl}`,
  );
}

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

  console.log(
    `${chalk.green("✔")} Installed ${skillStubs.length} skill(s) for ${chalk.cyan(stacks.join(", "))}`,
  );
}

async function main() {
  await requireJust();

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
  console.error(`${chalk.red.bold("spindle:")} ${message}`);
  process.exitCode = 1;
});
