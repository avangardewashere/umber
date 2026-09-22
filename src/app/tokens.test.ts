/**
 * @jest-environment node
 */
import { readFileSync } from "node:fs";
import path from "node:path";

// B0-T4: every --umber-* token defined for light is also defined for dark, and vice versa.
// If a token is missing from one block, that colour silently falls back in that theme.
const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

function tokensIn(block: string): string[] {
  return [...block.matchAll(/--umber-[a-z-]+(?=\s*:)/g)].map((m) => m[0]).sort();
}

function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  if (start === -1) throw new Error(`No "${marker}" block in globals.css`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    if (depth === 0) return css.slice(open, i + 1);
  }
  throw new Error(`Unclosed "${marker}" block`);
}

describe("colour tokens", () => {
  const light = tokensIn(blockAfter(":root"));
  const dark = tokensIn(blockAfter("@media (prefers-color-scheme: dark)"));

  test("the light block defines at least the core tokens", () => {
    expect(light).toEqual(
      expect.arrayContaining(["--umber-bg", "--umber-fg", "--umber-accent", "--umber-border"]),
    );
  });

  test("light and dark define exactly the same token list", () => {
    expect(dark).toEqual(light);
  });

  test("no token is defined twice in one block", () => {
    expect(new Set(light).size).toBe(light.length);
    expect(new Set(dark).size).toBe(dark.length);
  });
});
