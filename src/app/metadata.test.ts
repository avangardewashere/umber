/**
 * @jest-environment node
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { metadata } from "./layout";

// B1-T7: title, description and Open Graph are set, so a pasted link previews properly.
describe("B1-T7 site metadata", () => {
  test("has a title with the name, and a title template for other pages", () => {
    expect(metadata.title).toEqual({
      default: expect.stringContaining("Umber"),
      template: "%s · Umber",
    });
  });

  test("has a description naming all five components", () => {
    for (const name of ["Button", "Badge", "Input", "Card", "Dialog"]) {
      expect(metadata.description).toContain(name);
    }
  });

  test("has Open Graph and Twitter fields, and a base URL to make image links absolute", () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.openGraph).toMatchObject({
      siteName: "Umber",
      type: "website",
      title: expect.stringContaining("Umber"),
      description: metadata.description,
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  test("the Open Graph image file exists (its rendering is checked in the browser)", () => {
    expect(existsSync(path.join(process.cwd(), "src/app/opengraph-image.tsx"))).toBe(true);
  });
});
