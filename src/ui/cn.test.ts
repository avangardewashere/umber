/**
 * @jest-environment node
 */
import { cn } from "./cn";

// B0-T3: cn() merges classes, drops falsy values, and later Tailwind classes win.
describe("cn", () => {
  test("later Tailwind class wins a conflict", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-fg", "text-muted")).toBe("text-muted");
  });

  test("drops falsy values", () => {
    const off = false as boolean;
    expect(cn("a", off && "b", undefined, null, "", "c")).toBe("a c");
  });

  test("keeps classes that do not conflict, in order", () => {
    expect(cn("rounded-umber", "px-3", "py-2")).toBe("rounded-umber px-3 py-2");
  });

  test("accepts arrays and objects like clsx", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });

  test("returns an empty string for no input", () => {
    expect(cn()).toBe("");
  });
});
