import { readFile } from "node:fs/promises";
import { extname } from "node:path";

import nunjucks from "nunjucks";

// Text vs binary: known text extensions are rendered unless the content contains a NUL byte or is not valid UTF-8.
const textExtensions = new Set([
  ".md",
  ".txt",
  ".json",
  ".yml",
  ".yaml",
  ".toml",
  ".sh",
  ".ts",
  ".js",
  ".py",
  ".php",
  ".html",
  ".css",
  ".xml",
  ".j2",
  ".njk",
  "",
]);

// Nunjucks tries the block delimiter before the variable one, so `<%=` would lex as a block start.
// Make the tokenizer skip the block delimiter when it is really the variable delimiter.
interface Tokenizer {
  _extractString(value: string): string | null;
  _matches(value: string): boolean;
  nextToken(): { type: string } | null;
}
const lexer = (nunjucks as unknown as { lexer: { lex(src: string, opts: unknown): Tokenizer } })
  .lexer;
const lex = lexer.lex.bind(lexer);
lexer.lex = (src, opts) => {
  const tokenizer = lex(src, opts);
  const extract = tokenizer._extractString.bind(tokenizer);
  tokenizer._extractString = (value) =>
    value.startsWith("<%") && !value.startsWith("<%=") && tokenizer._matches("<%=")
      ? null
      : extract(value);

  // Both delimiters close with `%>`; report the closer that matches the opener.
  const next = tokenizer.nextToken.bind(tokenizer);
  let inVariable = false;
  tokenizer.nextToken = () => {
    const token = next();
    if (token?.type === "variable-start") inVariable = true;
    else if (token?.type === "block-start") inVariable = false;
    else if (token?.type === "block-end" && inVariable) token.type = "variable-end";
    return token;
  };
  return tokenizer;
};

const environment = new nunjucks.Environment(null, {
  autoescape: false,
  throwOnUndefined: true,
  tags: {
    blockStart: "<%",
    blockEnd: "%>",
    variableStart: "<%=",
    variableEnd: "%>",
    commentStart: "<#",
    commentEnd: "#>",
  },
});

export interface RenderContext {
  stacks: string[];
  variables: Record<string, string>;
}

export function renderText(source: string, context: RenderContext) {
  return environment.renderString(source, context);
}

// Returns rendered text, or null when the file must be copied unchanged.
export async function renderFile(path: string, context: RenderContext) {
  const content = await readFile(path);
  if (!textExtensions.has(extname(path).toLowerCase()) || content.includes(0)) {
    return null;
  }
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(content);
  } catch {
    return null;
  }
  return renderText(text, context);
}
