import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import ComponentPage from "@/app/components/[name]/page";
import ComponentsPage from "@/app/components/page";
import { COMPONENTS } from "@/site/catalog";
import { INSTALL_COMMAND } from "./load";
import { extractProps } from "./props";

// Shiki is ESM-only and Jest cannot load it, so tests use a plain stand-in that escapes the
// code into <pre><code>. The real highlighting is checked in the browser.
jest.mock("@/site/docs/highlight", () => ({
  highlight: async (code: string) =>
    `<pre tabindex="0"><code>${code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`,
}));

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");

type PageArgs = Parameters<typeof ComponentPage>[0];

async function renderComponentPage(name: string) {
  const ui = await ComponentPage({ params: Promise.resolve({ name }) } as unknown as PageArgs);
  return render(ui);
}

// B2-T5
describe("B2-T5 the docs page shows the code that is on disk", () => {
  test("the Code section is exactly button.tsx and button-styles.ts, in that order", async () => {
    await renderComponentPage("button");
    expect(document.getElementById("code-button-tsx")?.textContent).toBe(read("src/ui/button.tsx"));
    expect(document.getElementById("code-button-styles-ts")?.textContent).toBe(
      read("src/ui/button-styles.ts"),
    );
    const code = screen.getByRole("region", { name: "Code" });
    expect(
      within(code)
        .getAllByRole("button", { name: /^Copy / })
        .map((b) => b.textContent),
    ).toEqual(["Copy components/ui/button.tsx", "Copy components/ui/button-styles.ts"]);
  });

  test("the Tests included block is exactly src/ui/button.test.tsx", async () => {
    await renderComponentPage("button");
    expect(document.getElementById("code-button-test-tsx")?.textContent).toBe(read("src/ui/button.test.tsx"));
  });

  test("files are labelled with where they go in the user's project", async () => {
    await renderComponentPage("button");
    expect(screen.getByRole("button", { name: "Copy components/ui/button.tsx" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy components/ui/button.test.tsx" })).toBeInTheDocument();
  });
});

// B2-T6
describe("B2-T6 the props table comes from the types", () => {
  test("extractProps reads Button's own props with their values, defaults and docs", () => {
    const props = extractProps("src/ui/button.tsx", "ButtonOwnProps");
    expect(props.map((p) => p.name)).toEqual(["variant", "size", "loading", "type"]);
    expect(props[0]).toMatchObject({
      type: '"primary" | "secondary" | "ghost" | "danger"',
      required: false,
      defaultValue: '"primary"',
    });
    expect(props[1]).toMatchObject({ type: '"sm" | "md" | "lg"', defaultValue: '"md"' });
    expect(props[2]).toMatchObject({ type: "boolean", defaultValue: "false" });
    expect(props[3]).toMatchObject({ type: '"button" | "submit" | "reset"', defaultValue: '"button"' });
    for (const p of props) expect(p.description.length).toBeGreaterThan(10);
  });

  test("the page's table has exactly the extracted props, in order", async () => {
    await renderComponentPage("button");
    const table = screen.getByRole("region", { name: "Button props" });
    const rowNames = within(table)
      .getAllByRole("rowheader")
      .map((th) => th.textContent);
    expect(rowNames).toEqual(
      extractProps("src/ui/button.tsx", "ButtonOwnProps").map((p) => p.name),
    );
    expect(within(table).getByText('"sm" | "md" | "lg"')).toBeInTheDocument();
  });

  test("a prop added to a type appears without touching the page", () => {
    const fixture = path.join(process.cwd(), "src/site/docs/props-fixture.tmp.ts");
    writeFileSync(
      fixture,
      [
        "export type FixtureProps = {",
        '  /** Existing prop. @default "a" */',
        '  tone?: "a" | "b";',
        "  /** A brand new prop, added by the test. */",
        "  glow: boolean;",
        "};",
        "",
      ].join("\n"),
    );
    try {
      const props = extractProps(fixture, "FixtureProps");
      expect(props.map((p) => p.name)).toEqual(["tone", "glow"]);
      expect(props[1]).toEqual({
        name: "glow",
        type: "boolean",
        required: true,
        defaultValue: null,
        description: "A brand new prop, added by the test.",
      });
    } finally {
      rmSync(fixture, { force: true });
    }
  });
});

// B2-T7
describe("B2-T7 the docs pages", () => {
  test("the Button page has one h1, no axe violations, and marks Button as the current page", async () => {
    const { container } = await renderComponentPage("button");
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Button");

    const nav = screen.getByRole("navigation", { name: "Components" });
    const current = within(nav)
      .getAllByRole("link")
      .filter((a) => a.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Button");

    expect(await axe(container)).toHaveNoViolations();
  });

  test.each(COMPONENTS.filter((c) => c.slug !== "button"))(
    "$name: still a placeholder until Block 3, inside the same nav",
    async (c) => {
      await renderComponentPage(c.slug);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(c.name);
      expect(screen.getByRole("link", { name: c.name })).toHaveAttribute("aria-current", "page");
    },
  );

  test("an unknown name is a 404", async () => {
    await expect(
      ComponentPage({ params: Promise.resolve({ name: "select" }) } as unknown as PageArgs),
    ).rejects.toThrow();
  });

  test("the index lists the five and the one-time setup, with no axe violations", async () => {
    const { container } = render(await ComponentsPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Components");
    const main = screen.getAllByRole("list")[1];
    expect(
      within(main)
        .getAllByRole("link")
        .map((a) => a.getAttribute("href")),
    ).toEqual(COMPONENTS.map((c) => `/components/${c.slug}`));

    expect(document.getElementById("setup-install")?.textContent).toBe(INSTALL_COMMAND);
    expect(document.getElementById("setup-cn")?.textContent).toBe(read("src/ui/cn.ts"));
    const tokens = document.getElementById("setup-tokens")?.textContent ?? "";
    expect(tokens).toContain("--umber-accent:");
    expect(tokens).toContain("@theme inline");
    expect(tokens).not.toContain("geist");
    expect(tokens).not.toContain("umber:tokens");

    expect(await axe(container)).toHaveNoViolations();
  });
});

// B2-T9 (added in Block 2)
describe("B2-T9 the Button preview controls", () => {
  test("choosing a variant and size updates the preview and its code", async () => {
    const user = userEvent.setup();
    await renderComponentPage("button");
    const preview = screen.getByTestId("button-preview");
    const button = within(preview).getByRole("button", { name: "Save changes" });

    expect(screen.getByTestId("button-snippet")).toHaveTextContent("<Button>Save changes</Button>");
    await user.click(screen.getByRole("radio", { name: "danger" }));
    await user.click(screen.getByRole("radio", { name: "sm" }));
    expect(button).toHaveAttribute("data-variant", "danger");
    expect(screen.getByTestId("button-snippet")).toHaveTextContent(
      '<Button variant="danger" size="sm">Save changes</Button>',
    );
  });

  test("Loading makes the preview busy and it ignores clicks", async () => {
    const user = userEvent.setup();
    await renderComponentPage("button");
    const preview = screen.getByTestId("button-preview");
    const button = within(preview).getByRole("button", { name: "Save changes" });

    await user.click(button);
    expect(within(preview).getByText("Clicked 1 time")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Loading" }));
    expect(button).toHaveAttribute("aria-busy", "true");
    await user.click(button);
    expect(within(preview).getByText("Clicked 1 time")).toBeInTheDocument();
  });
});
