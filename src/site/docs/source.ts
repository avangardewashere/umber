import { readFileSync } from "node:fs";
import path from "node:path";

/** Reads a file from this repo, with line endings normalised. Build time only. */
export function readRepoFile(relativePath: string): string {
  // Build-time read of our own files. The comment stops Next tracing the whole repo into the deploy.
  return readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath), "utf8").replace(/\r\n/g, "\n");
}

const START = "/* umber:tokens:start */";
const END = "/* umber:tokens:end */";

/** The part of globals.css a user copies: the tokens and the Tailwind theme that reads them. */
export function tokensCss(): string {
  const css = readRepoFile("src/app/globals.css");
  const start = css.indexOf(START);
  const end = css.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("globals.css is missing the umber:tokens markers");
  }
  return `${css.slice(start + START.length, end).trim()}\n`;
}

/** Where a copied file goes in the user's project. */
export function userPath(repoPath: string): string {
  return `components/ui/${path.basename(repoPath)}`;
}
