import { access, copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { renderFile, type RenderContext } from "./render.js";

export const supportedStacks = ["php-laravel", "python", "typescript"] as const;

export type ConflictPolicy = "overwrite" | "skip";

// SPINDLE_STUBS_DIR overrides the stubs root (the directory containing `skills/`); tests use it for fixture stubs.
export function stubsRoot() {
  return process.env.SPINDLE_STUBS_DIR ?? fileURLToPath(new URL("./stubs/", import.meta.url));
}

export async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function listSkillStubs() {
  const entries = await readdir(join(stubsRoot(), "skills"), { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export async function installDirectory(source: string, target: string, context: RenderContext) {
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

export function validateStacks(stacks: string[]) {
  for (const stack of stacks) {
    if (!supportedStacks.includes(stack as (typeof supportedStacks)[number])) {
      throw new Error(`Invalid stack '${stack}'. Supported stacks: ${supportedStacks.join(", ")}.`);
    }
  }
}

export function parseConflictPolicy(policy: string | undefined): ConflictPolicy | undefined {
  if (policy !== undefined && policy !== "overwrite" && policy !== "skip") {
    throw new Error(`Invalid --on-conflict '${policy}'. Use overwrite or skip.`);
  }
  return policy;
}
