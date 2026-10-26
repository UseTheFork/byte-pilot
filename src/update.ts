import { mkdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

import chalk from "chalk";

import {
  exists,
  installDirectory,
  listSkillStubs,
  stubsRoot,
  validateStacks,
  type ConflictPolicy,
} from "./install.js";
import { promptOutdated } from "./prompts.js";
import { loadVariableDefinitions } from "./variables.js";
import { compareSemver, parseSemver, readSkillVersion } from "./version.js";

const missingConfig = (reason: string) =>
  new Error(`${reason} Run \`spindle init\` to create .github/spindle.json.`);

async function readConfig(path: string, definitionsRoot: string) {
  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw missingConfig("This repository has no .github/spindle.json.");
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw missingConfig(".github/spindle.json is not valid JSON.");
  }

  const config = parsed as { stacks?: unknown; variables?: unknown } | null;
  const stacks = config?.stacks;
  const stored = config?.variables ?? {};
  if (
    typeof config !== "object" ||
    config === null ||
    !Array.isArray(stacks) ||
    stacks.length === 0 ||
    !stacks.every((stack) => typeof stack === "string") ||
    typeof stored !== "object" ||
    stored === null ||
    Array.isArray(stored) ||
    !Object.values(stored).every((value) => typeof value === "string")
  ) {
    throw missingConfig(
      '.github/spindle.json is malformed; expected {"stacks": [...], "variables": {...}}.',
    );
  }
  validateStacks(stacks as string[]);

  // Resolved on every run so hand-edits and newly added manifest variables are honoured.
  const variables: Record<string, string> = {};
  for (const definition of await loadVariableDefinitions(definitionsRoot)) {
    const value = (stored as Record<string, string>)[definition.name] ?? definition.default;
    if (value === undefined) {
      throw new Error(
        `Variable '${definition.name}' (${definition.description}) has no value in .github/spindle.json and no default; add it under "variables".`,
      );
    }
    variables[definition.name] = value;
  }
  return { stacks: stacks as string[], variables };
}

export async function update(interactive: boolean, policy: ConflictPolicy | undefined) {
  const githubDirectory = join(process.cwd(), ".github");
  const skillsDirectory = join(githubDirectory, "skills");
  const stubsDirectory = join(stubsRoot(), "skills");
  const context = await readConfig(join(githubDirectory, "spindle.json"), stubsRoot());

  const outdated: { name: string; installed: string; available: string }[] = [];
  let upToDate = 0;
  let warned = 0;
  for (const name of await listSkillStubs()) {
    const target = join(skillsDirectory, name);
    if (!(await exists(target))) continue;

    const available = await readSkillVersion(join(stubsDirectory, name, "SKILL.md"));
    const installed = await readSkillVersion(join(target, "SKILL.md"));
    const availableVersion = available === null ? null : parseSemver(available);
    const installedVersion = installed === null ? null : parseSemver(installed);
    if (!availableVersion || available === null) {
      throw new Error(`The shipped stub '${name}' has no valid semver version in its SKILL.md.`);
    }
    if (!installedVersion || installed === null) {
      console.error(
        chalk.yellow(
          `Skipping '${name}': installed SKILL.md has ${installed === null ? "no version" : `non-semver version '${installed}'`}.`,
        ),
      );
      warned += 1;
      continue;
    }
    if (compareSemver(availableVersion, installedVersion) > 0) {
      outdated.push({ name, installed, available });
    } else {
      upToDate += 1;
    }
  }

  const decisions = new Map<string, ConflictPolicy>();
  for (const skill of outdated) {
    if (policy) {
      decisions.set(skill.name, policy);
    } else if (interactive) {
      decisions.set(skill.name, await promptOutdated(skill.name, skill.installed, skill.available));
    } else {
      throw new Error(
        `Skill '${skill.name}' is outdated (${skill.installed} -> ${skill.available}); pass --on-conflict <overwrite|skip> to choose what to do in non-interactive runs.`,
      );
    }
  }

  let updated = 0;
  let skipped = warned;
  for (const skill of outdated) {
    if (decisions.get(skill.name) === "skip") {
      skipped += 1;
      continue;
    }
    const target = join(skillsDirectory, skill.name);
    await rm(target, { recursive: true, force: true });
    await mkdir(skillsDirectory, { recursive: true });
    await installDirectory(join(stubsDirectory, skill.name), target, context);
    updated += 1;
  }

  console.log(
    `${chalk.green("✔")} Updated ${updated}, skipped ${skipped}, up to date ${upToDate} skill(s)`,
  );
}
