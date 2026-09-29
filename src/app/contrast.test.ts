/**
 * @jest-environment node
 */
import { readFileSync } from "node:fs";
import path from "node:path";

// B1-T9 (added in Block 1): colour contrast of the tokens, in both themes, against WCAG 2.2 AA.
// jest-axe cannot check contrast in jsdom, so this checks the token values directly.
// Text needs 4.5:1. Focus rings and input outlines need 3:1.
const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    if (depth === 0) return css.slice(open, i + 1);
  }
  throw new Error(`Unclosed "${marker}" block`);
}

type RGB = [number, number, number];

function tokens(block: string): Record<string, RGB> {
  const out: Record<string, RGB> = {};
  for (const m of block.matchAll(/--umber-([a-z-]+)\s*:\s*#([0-9a-f]{6})\b/gi)) {
    const hex = m[2];
    out[m[1]] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
  }
  return out;
}

function luminance([r, g, b]: RGB): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** `share` of `top` laid over `under`, like Tailwind's bg-info/10 on a surface. */
function tint(top: RGB, under: RGB, share: number): RGB {
  return top.map((v, i) => Math.round(v * share + under[i] * (1 - share))) as RGB;
}

const themes = {
  light: tokens(blockAfter(":root")),
  dark: tokens(blockAfter("@media (prefers-color-scheme: dark)")),
};

describe.each(Object.entries(themes))("B1-T9 contrast, %s theme", (_name, t) => {
  test("sanity: the calculator gives 21:1 for black on white", () => {
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
  });

  test.each([
    ["fg", "bg"],
    ["fg", "surface"],
    ["muted", "bg"],
    ["muted", "surface"],
    ["accent", "bg"],
    ["accent-fg", "accent"],
    ["danger-fg", "danger"],
  ])("text %s on %s is at least 4.5:1", (text, back) => {
    expect(contrast(t[text], t[back])).toBeGreaterThanOrEqual(4.5);
  });

  test.each(["info", "success", "warning", "danger"])(
    "badge text %s on its own 10%% tint is at least 4.5:1",
    (k) => {
      expect(contrast(t[k], tint(t[k], t.surface, 0.1))).toBeGreaterThanOrEqual(4.5);
    },
  );

  test.each([
    ["ring", "bg"],
    ["ring", "surface"],
    ["border-strong", "surface"],
    ["border-strong", "bg"],
  ])("%s against %s is at least 3:1", (edge, back) => {
    expect(contrast(t[edge], t[back])).toBeGreaterThanOrEqual(3);
  });
});
