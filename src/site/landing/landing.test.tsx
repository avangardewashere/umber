import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import Home from "@/app/page";
import { generateStaticParams } from "@/app/components/[name]/page";
import { COMPONENTS } from "@/site/catalog";
import { COPIED_FOR_MS } from "@/site/copy-button";
import { REPO_URL } from "@/site/shell";
import { SNIPPET } from "./landing";

function liveCard(): HTMLElement {
  return screen.getByRole("figure");
}

// B1-T1
describe("B1-T1 the page", () => {
  test("has exactly one h1, and it is the library name", () => {
    render(<Home />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Umber");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(<Home />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// B1-T2
describe("B1-T2 the hero links", () => {
  test('"Browse components" links to /components', () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: "Browse components" })).toHaveAttribute(
      "href",
      "/components",
    );
  });

  test('"GitHub" links to the repo, opens in a new tab, with noopener', () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", REPO_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});

// B1-T3
describe("B1-T3 the live card", () => {
  test("contains a button in every variant", () => {
    render(<Home />);
    const variants = within(liveCard())
      .getAllByRole("button")
      .map((b) => b.getAttribute("data-variant"));
    expect(new Set(variants)).toEqual(new Set(["primary", "secondary", "ghost", "danger"]));
  });

  test("contains an input reachable by its label, and a badge", () => {
    render(<Home />);
    expect(within(liveCard()).getByLabelText("Email address")).toBeInTheDocument();
    expect(liveCard().querySelectorAll('[data-slot="badge"]').length).toBeGreaterThan(0);
  });

  test("the dialog trigger opens a named dialog, and Keep invite closes it", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const trigger = within(liveCard()).getByRole("button", { name: "Revoke" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Revoke Jordan's invite?" });
    expect(dialog).toHaveAttribute("open");

    await user.click(within(dialog).getByRole("button", { name: "Keep invite" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("regression: after Escape (a cancel event with no close event) the dialog can open again", async () => {
    // Found in Chrome during Block 1: Escape fired "cancel" and closed the dialog, but "close"
    // never arrived, so React thought it was still open and Revoke stopped working.
    const user = userEvent.setup();
    render(<Home />);
    const trigger = within(liveCard()).getByRole("button", { name: "Revoke" });

    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    act(() => {
      dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Revoke Jordan's invite?" })).toHaveAttribute("open");
  });

  test("it is real: an empty submit shows an error, a valid email reports success", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const input = within(liveCard()).getByLabelText("Email address");

    await user.click(within(liveCard()).getByRole("button", { name: "Send invite" }));
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/enter an email address/i);

    await user.type(input, "ana@example.com");
    expect(input).not.toHaveAttribute("aria-invalid");
    await user.click(within(liveCard()).getByRole("button", { name: "Send invite" }));
    expect(within(liveCard()).getByText("Invite sent to ana@example.com.")).toBeInTheDocument();
  });
});

// B1-T4 and B1-T5
describe("the copy button", () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test("B1-T4 copies the snippet, says Copied, and resets after two seconds", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    const button = screen.getByRole("button", { name: "Copy code" });

    await user.click(button);
    expect(await navigator.clipboard.readText()).toBe(SNIPPET);
    expect(button).toHaveTextContent("Copied");

    act(() => jest.advanceTimersByTime(COPIED_FOR_MS - 1));
    expect(button).toHaveTextContent("Copied");
    act(() => jest.advanceTimersByTime(1));
    expect(button).toHaveTextContent("Copy code");
  });

  test("B1-T5 if the clipboard refuses, it says Press Ctrl+C, selects the code, and does not throw", async () => {
    const user = userEvent.setup();
    render(<Home />);
    jest.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    const button = screen.getByRole("button", { name: "Copy code" });

    await user.click(button);
    expect(button).toHaveTextContent("Press Ctrl+C");
    expect(screen.getByText(/copying failed/i)).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe(SNIPPET);
  });
});

// B1-T6
describe("B1-T6 the five", () => {
  test("the cap list is exactly the five, in order", () => {
    expect(COMPONENTS.map((c) => c.name)).toEqual(["Button", "Badge", "Input", "Card", "Dialog"]);
  });

  test("each of the five cards links to its docs page", () => {
    render(<Home />);
    const section = screen.getByRole("region", { name: /five parts/i });
    const docLinks = within(section)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((href) => href?.startsWith("/components/"));
    expect(docLinks).toEqual(COMPONENTS.map((c) => `/components/${c.slug}`));
  });

  test("the docs route exists for exactly the five", () => {
    expect(generateStaticParams()).toEqual(COMPONENTS.map((c) => ({ name: c.slug })));
  });
});

// B1-T8
describe("B1-T8 keyboard order", () => {
  test("Tab reaches the hero links, then the live card, then the copy button", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const card = within(liveCard());
    const expected = [
      screen.getByRole("link", { name: "Browse components" }),
      screen.getByRole("link", { name: "GitHub" }),
      card.getByLabelText("Email address"),
      card.getByRole("button", { name: "Cancel" }),
      card.getByRole("button", { name: "Send invite" }),
      card.getByRole("button", { name: "Resend" }),
      card.getByRole("button", { name: "Revoke" }),
      screen.getByRole("button", { name: "Copy code" }),
    ];
    for (const element of expected) {
      await user.tab();
      expect(document.activeElement).toBe(element);
    }
  });
});
