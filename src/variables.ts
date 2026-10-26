import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface VariableDefinition {
  name: string;
  description: string;
  default?: string;
}

// A missing manifest means the stubs define no variables.
export async function loadVariableDefinitions(stubsRoot: string): Promise<VariableDefinition[]> {
  let raw: string;
  try {
    raw = await readFile(join(stubsRoot, "variables.json"), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("variables.json must be an array.");
  return parsed.map((entry: unknown) => {
    const item = entry as Partial<VariableDefinition> | null;
    if (
      typeof item?.name !== "string" ||
      typeof item.description !== "string" ||
      (item.default !== undefined && typeof item.default !== "string")
    ) {
      throw new Error(
        "variables.json entries need string `name`, `description` and optional `default`.",
      );
    }
    return { name: item.name, description: item.description, default: item.default };
  });
}

export function parseVariableFlags(
  flags: string[],
  definitions: VariableDefinition[],
): Record<string, string> {
  const known = new Set(definitions.map((definition) => definition.name));
  const supplied: Record<string, string> = {};
  for (const flag of flags) {
    const separator = flag.indexOf("=");
    if (separator <= 0) {
      throw new Error(`Invalid --var '${flag}'. Use --var <name>=<value>.`);
    }
    const name = flag.slice(0, separator);
    if (!known.has(name)) {
      const available = [...known].join(", ") || "none";
      throw new Error(`Unknown variable '${name}'. Available variables: ${available}.`);
    }
    supplied[name] = flag.slice(separator + 1);
  }
  return supplied;
}
