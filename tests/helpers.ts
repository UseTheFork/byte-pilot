import { spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { delimiter, join, resolve } from "node:path";

const cli = resolve(process.cwd(), "src/index.ts");
const tsxLoader = import.meta.resolve("tsx");

export async function makeTempDir(prefix = "spindle-cli-") {
  const parent = join(process.cwd(), ".scratch");
  await mkdir(parent, { recursive: true });
  return mkdtemp(join(parent, prefix));
}

// A directory holding a stub executable `just`, so the prerequisite check passes.
export async function makeJustStubDir() {
  const directory = await makeTempDir("spindle-just-");
  const name = process.platform === "win32" ? "just.exe" : "just";
  await writeFile(join(directory, name), "#!/bin/sh\nexit 0\n");
  await chmod(join(directory, name), 0o755);
  return directory;
}

// Runs the real CLI in `project`; node and tsx are addressed by absolute path so `searchPath` is free to exclude them.
// Colors are off unless a test opts in, so output assertions stay independent of the parent's terminal.
export function runCli(
  project: string,
  args: string[],
  searchPath: string,
  env: Record<string, string> = {},
) {
  return spawnSync(process.execPath, ["--import", tsxLoader, cli, ...args], {
    cwd: project,
    encoding: "utf8",
    env: { ...process.env, FORCE_COLOR: "0", ...env, PATH: searchPath, Path: searchPath },
  });
}

export function pathWith(directory: string) {
  return `${directory}${delimiter}${process.env.PATH ?? ""}`;
}
