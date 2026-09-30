import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import ComponentPage from "@/app/components/[name]/page";
import ComponentsPage from "@/app/components/page";
import { COMPONENTS } from "@/site/catalog";
import { codeId } from "./component-docs";
import { extractProps } from "./props";
import { DOCS } from "./registry";

// Shiki is ESM-only and Jest cannot load it; see docs.test.tsx.
jest.mock("@/site/docs/highlight", () => ({
  highlight: async (code: string) =>
    `<pre tabindex="0"><code>${code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`,
}));

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");
const userPath = (p: string) => `components/ui/${path.basename(p)}`;

type PageArgs = Parameters<typeof ComponentPage>[0];

async function renderComponentPage(name: string) {
  const ui = await ComponentPage({ params: Promise.resolve({ name }) } as unknown as PageArgs);
  return render(ui);
}

// B3-T8: every one of the five has a real docs page, built from its own files.
describe.each(COMPONENTS)("B3-T8 $name docs page", (c) => {
  const entry = DOCS[c.slug]!;

  test("is registered with at least one source file and a test file", () => {
    expect(entry).toBeDefined();
    expect(entry.files.length).toBeGreaterThan(0);
    expect(entry.testFile).toMatch(/\.test\.tsx$/);
  });

  test("has one h1 with the name, marks itself current, and passes axe", async () => {
    const { container } = await renderComponentPage(c.slug);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(c.name);
    const nav = screen.getByRole("navigation", { name: "Components" });
    expect(within(nav).getByRole("link", { name: c.name })).toHaveAttribute("aria-current", "page");
    expect(await axe(container)).toHaveNoViolations();
  }, 30_000); // axe over a page with three code blocks and a table takes a while

  test("shows every source file and the test file byte for byte", async () => {
    await renderComponentPage(c.slug);
    for (const file of [...entry.files, entry.testFile]) {
      expect(document.getElementById(codeId(userPath(file)))?.textContent).toBe(read(file));
      expect(screen.getByRole("button", { name: `Copy ${userPath(file)}` })).toBeInTheDocument();
    }
  });

  test("its props table is exactly what the types say", async () => {
    await renderComponentPage(c.slug);
    const props = extractProps(entry.files[0], entry.meta.propsType);
    expect(props.length).toBeGreaterThan(0);
    const table = screen.getByRole("region", { name: `${c.name} props` });
    const rows = within(table).getAllByRole("rowheader");
    expect(rows.map((th) => th.textContent?.replace(" (required)", ""))).toEqual(props.map((p) => p.name));
    for (const p of props) {
      expect(p.description.length).toBeGreaterThan(10);
      expect(within(table).getAllByText(p.type, { exact: true }).length).toBeGreaterThan(0);
    }
  });

  test("lists accessibility notes", async () => {
    await renderComponentPage(c.slug);
    const section = screen.getByRole("region", { name: "Accessibility" });
    expect(within(section).getAllByRole("listitem").length).toBeGreaterThanOrEqual(3);
  });
});

describe("B3-T8 the index", () => {
  test("lists exactly the five, with no placeholders left", async () => {
    render(await ComponentsPage());
    const grid = screen.getAllByRole("list")[1];
    expect(within(grid).getAllByRole("link").map((a) => a.textContent)).toEqual(
      COMPONENTS.map((c) => c.name + c.summary),
    );
    expect(screen.queryByText(/docs soon/i)).not.toBeInTheDocument();
  });
});

// The previews (site UI), one interaction each.
describe("the previews", () => {
  test("Badge: choosing a variant updates the badge and its code", async () => {
    const user = userEvent.setup();
    await renderComponentPage("badge");
    await user.click(screen.getByRole("radio", { name: "danger" }));
    const preview = screen.getByTestId("badge-preview");
    expect(preview.querySelector('[data-slot="badge"]')).toHaveAttribute("data-variant", "danger");
    expect(preview).toHaveTextContent("Revoked");
    expect(screen.getByTestId("badge-snippet")).toHaveTextContent('<Badge variant="danger">Revoked</Badge>');
  });

  test("Input: the Error toggle marks the field invalid and shows in the code", async () => {
    const user = userEvent.setup();
    await renderComponentPage("input");
    const preview = screen.getByTestId("input-preview");
    const input = within(preview).getByLabelText("Email address");
    expect(input).not.toHaveAttribute("aria-invalid");
    await user.click(screen.getByRole("checkbox", { name: "Error" }));
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/enter an email address/i);
    expect(screen.getByTestId("input-snippet")).toHaveTextContent('error="Enter an email address');
    await user.click(screen.getByRole("checkbox", { name: "Disabled" }));
    expect(input).toBeDisabled();
  });

  test("Card: the heading level control changes the real heading", async () => {
    const user = userEvent.setup();
    await renderComponentPage("card");
    const preview = screen.getByTestId("card-preview");
    expect(within(preview).getByRole("heading", { level: 3 })).toHaveTextContent("Invite to workspace");
    await user.click(screen.getByRole("radio", { name: "h5" }));
    expect(within(preview).getByRole("heading", { level: 5 })).toHaveTextContent("Invite to workspace");
    expect(screen.getByTestId("card-snippet")).toHaveTextContent('<CardTitle as="h5">');
  });

  test("Dialog: the preview opens a real dialog, and saving renames the project", async () => {
    const user = userEvent.setup();
    await renderComponentPage("dialog");
    const preview = screen.getByTestId("dialog-preview");
    await user.click(within(preview).getByRole("button", { name: "Rename project" }));
    const dialog = screen.getByRole("dialog", { name: "Rename project" });
    const field = within(dialog).getByLabelText("New name");
    await user.clear(field);
    await user.type(field, "Ochre");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(preview).toHaveTextContent("Project: Ochre");
  });
});
