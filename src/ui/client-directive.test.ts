/**
 * @jest-environment node
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// B2-T8 (the part Jest can check): a component that uses React hooks or attaches its own event
// handlers only works in the browser, so it must start with "use client". Without it, a user who
// renders it from a Server Component page (the Next.js default) gets a build error.
// Found by the Block 2 stranger test: Button gained its own onClick guard and broke there.
const UI = path.join(process.cwd(), "src/ui");
const NEEDS_BROWSER = /\buse(State|Effect|Ref|Id|LayoutEffect|Reducer|Callback|Memo)\s*\(|\son[A-Z]\w*=\{/;

const components = readdirSync(UI).filter((f) => /\.tsx?$/.test(f) && !f.includes(".test."));

describe('B2-T8 "use client" where it is needed', () => {
  test("there are components to check", () => {
    expect(components).toEqual(expect.arrayContaining(["button.tsx", "button-styles.ts", "cn.ts"]));
  });

  test.each(components)("%s", (file) => {
    const source = readFileSync(path.join(UI, file), "utf8");
    const firstLine = source.split(/\r?\n/, 1)[0].trim();
    if (NEEDS_BROWSER.test(source)) {
      expect(firstLine).toBe('"use client";');
    } else {
      expect(firstLine).not.toBe('"use client";');
    }
  });
});
