#!/usr/bin/env node
import { constants } from "node:fs";
import { access, copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import chalk from "chalk";

import { promptConflict, promptStacks, promptVariable } from "./prompts.js";
import { renderFile, type RenderContext } from "./render.js";
import { loadVariableDefinitions, parseVariableFlags } from "./variables.js";

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

// SPINDLE_STUBS_DIR overrides the stubs root (the directory containing `skills/`); tests use it for fixture stubs.
function stubsRoot() {
  return process.env.SPINDLE_STUBS_DIR ?? fileURLToPath(new URL("./stubs/", import.meta.url));
}

async function installDirectory(source: string, target: string, context: RenderContext) {
  await mkdir(target, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(target, entry.name);
    if (entry.isDirectory()) {
      await installDirectory(from, to, context);
      continue;
    }
    const rendered = await renderFile(from, context);
    if (rendered === null) {
      await copyFile(from, to);
    } else {
      await writeFile(to, rendered);
    }
  }
}

type ConflictPolicy = "overwrite" | "skip";

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function init(
  stacks: string[],
  variables: Record<string, string>,
  interactive: boolean,
  policy: ConflictPolicy | undefined,
) {
  const githubDirectory = join(process.cwd(), ".github");
  const skillsDirectory = join(githubDirectory, "skills");
  const stubsDirectory = join(stubsRoot(), "skills");
  const stubNames = await readdir(stubsDirectory, { withFileTypes: true });
  const skillStubs = stubNames.filter((entry) => entry.isDirectory());

  if (skillStubs.length === 0) {
    throw new Error("No skill stubs are available to install.");
  }

  const decisions = new Map<string, ConflictPolicy>();
  for (const stub of skillStubs) {
    if (!(await exists(join(skillsDirectory, stub.name)))) {
      continue;
    }
    if (policy) {
      decisions.set(stub.name, policy);
    } else if (interactive) {
      decisions.set(stub.name, await promptConflict(stub.name));
    } else {
      throw new Error(
        `Skill '${stub.name}' already exists; pass --on-conflict <overwrite|skip> to choose what to do in non-interactive runs.`,
      );
    }
  }

  await mkdir(skillsDirectory, { recursive: true });
  let installed = 0;
  let skipped = 0;
  for (const stub of skillStubs) {
    const target = join(skillsDirectory, stub.name);
    const decision = decisions.get(stub.name);
    if (decision === "skip") {
      skipped += 1;
      continue;
    }
    if (decision === "overwrite") {
      await rm(target, { recursive: true, force: true });
    }
    await installDirectory(join(stubsDirectory, stub.name), target, { stacks, variables });
    installed += 1;
  }

  await writeFile(
    join(githubDirectory, "spindle.json"),
    `${JSON.stringify({ stacks, variables }, null, 2)}\n`,
  );

  console.log(
    `${chalk.green("✔")} Installed ${installed} skill(s) for ${chalk.cyan(stacks.join(", "))}${skipped > 0 ? `. Skipped ${skipped} existing skill(s)` : ""}`,
  );
}

const helpText = `${chalk.bold("Usage:")} spindle init [options]

Install the spindle skills into .github/skills and save .github/spindle.json.

${chalk.bold("Options:")}
  --stack <id>          Stack to install; repeat for several (${supportedStacks.join(", ")})
  --var <name>=<value>  Set a variable; repeat for several. Unset variables use their default
  --on-conflict <overwrite|skip>
                        Policy for skill directories that already exist; required when
                        non-interactive and any exist (interactive runs prompt per skill)
  --no-interactive      Never prompt; missing required input is an error
  --help                Show this help

Fails if .github/spindle.json already exists; use \`spindle update\` instead.
Prompts are also disabled when stdin or stdout is not a terminal.
`;

async function main() {
  await requireJust();

  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      stack: { type: "string", multiple: true },
      var: { type: "string", multiple: true },
      "no-interactive": { type: "boolean" },
      "on-conflict": { type: "string" },
      help: { type: "boolean" },
    },
    allowPositionals: true,
    strict: true,
  });

  if (values.help) {
    console.log(helpText);
    return;
  }

  if (positionals[0] !== "init" || positionals.length !== 1) {
    throw new Error(
      "Usage: spindle init [--stack <id>] [--var <name>=<value>] [--on-conflict <overwrite|skip>] [--no-interactive]. See --help.",
    );
  }

  if (await exists(join(process.cwd(), ".github", "spindle.json"))) {
    throw new Error(
      "This repository already has .github/spindle.json; run `spindle update` instead of `init`.",
    );
  }

  const policy = values["on-conflict"];
  if (policy !== undefined && policy !== "overwrite" && policy !== "skip") {
    throw new Error(`Invalid --on-conflict '${policy}'. Use overwrite or skip.`);
  }

  const interactive =
    !values["no-interactive"] && Boolean(process.stdin.isTTY) && Boolean(process.stdout.isTTY);

  const definitions = await loadVariableDefinitions(stubsRoot());
  const supplied = parseVariableFlags(values.var ?? [], definitions);

  let stacks = [...new Set(values.stack ?? [])];
  for (const stack of stacks) {
    if (!supportedStacks.includes(stack as (typeof supportedStacks)[number])) {
      throw new Error(`Invalid stack '${stack}'. Supported stacks: ${supportedStacks.join(", ")}.`);
    }
  }
  if (stacks.length === 0) {
    if (!interactive) {
      throw new Error(
        `Provide at least one --stack flag <${supportedStacks.join("|")}> (or run interactively).`,
      );
    }
    stacks = await promptStacks(supportedStacks);
  }

  const variables: Record<string, string> = {};
  for (const definition of definitions) {
    if (definition.name in supplied) {
      variables[definition.name] = supplied[definition.name];
    } else if (interactive) {
      variables[definition.name] = await promptVariable(definition);
    } else if (definition.default !== undefined) {
      variables[definition.name] = definition.default;
    } else {
      throw new Error(
        `Variable '${definition.name}' (${definition.description}) has no default; provide --var ${definition.name}=<value>.`,
      );
    }
  }

  await init(stacks, variables, interactive, policy);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${chalk.red.bold("spindle:")} ${message}`);
  process.exitCode = 1;
});
