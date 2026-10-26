import { readFile } from "node:fs/promises";

const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;

interface Semver {
  core: [number, number, number];
  prerelease: string[];
}

export function parseSemver(value: string): Semver | null {
  const match = semverPattern.exec(value);
  if (!match) return null;
  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] ? match[4].split(".") : [],
  };
}

function comparePrerelease(a: string[], b: string[]) {
  // A version without a prerelease outranks one with it.
  if (a.length === 0 || b.length === 0) return b.length - a.length;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const numA = /^\d+$/.test(a[i]);
    const numB = /^\d+$/.test(b[i]);
    if (numA && numB) {
      if (Number(a[i]) !== Number(b[i])) return Number(a[i]) < Number(b[i]) ? -1 : 1;
    } else if (numA !== numB) {
      return numA ? -1 : 1;
    } else if (a[i] !== b[i]) {
      return a[i] < b[i] ? -1 : 1;
    }
  }
  return Math.sign(a.length - b.length);
}

export function compareSemver(a: Semver, b: Semver) {
  for (let i = 0; i < 3; i++) {
    if (a.core[i] !== b.core[i]) return a.core[i] < b.core[i] ? -1 : 1;
  }
  return comparePrerelease(a.prerelease, b.prerelease);
}

// Returns the raw `version` value from SKILL.md frontmatter, or null when absent or the file is unreadable.
export async function readSkillVersion(skillFile: string): Promise<string | null> {
  let content: string;
  try {
    content = await readFile(skillFile, "utf8");
  } catch {
    return null;
  }
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);
  if (!frontmatter) return null;
  const line = /^version:[ \t]*(.*?)[ \t]*$/m.exec(frontmatter[1]);
  if (!line) return null;
  return line[1].replace(/^(["'])(.*)\1$/, "$2");
}
