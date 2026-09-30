// Tests for Card. Needs Jest with a jsdom environment, React Testing Library,
// @testing-library/jest-dom and jest-axe.
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

expect.extend(toHaveNoViolations);

function Example({ as }: { as?: "h2" | "h3" | "h4" | "h5" | "h6" }) {
  return (
    <Card data-testid="card">
      <CardHeader>
        <CardTitle as={as}>Invite to workspace</CardTitle>
        <p>Teammates can open every project.</p>
      </CardHeader>
      <CardContent>Body</CardContent>
      <CardFooter>
        <button type="button">Cancel</button>
      </CardFooter>
    </Card>
  );
}

describe("Card", () => {
  test("renders its parts in order", () => {
    render(<Example />);
    const card = screen.getByTestId("card");
    const slots = [...card.querySelectorAll("[data-slot]")].map((el) => el.getAttribute("data-slot"));
    expect(slots).toEqual(["card-header", "card-title", "card-content", "card-footer"]);
    expect(within(card).getByText("Body")).toBeInTheDocument();
    expect(within(card).getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("the title is an h3 by default", () => {
    render(<Example />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Invite to workspace");
  });

  test.each(["h2", "h3", "h4", "h5", "h6"] as const)("as=%s renders that heading level", (as) => {
    render(<Example as={as} />);
    const level = Number(as[1]);
    expect(screen.getByRole("heading", { level })).toHaveTextContent("Invite to workspace");
  });

  test("keeps the page outline valid under an h1", async () => {
    const { container } = render(
      <main>
        <h1>Team</h1>
        <Example as="h2" />
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("is pure layout: no role, not focusable, not a click target", () => {
    render(<Example />);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
  });

  test("every part passes other props through and merges className", () => {
    render(
      <Card className="max-w-sm" aria-label="Summary">
        <CardHeader className="pb-2" data-testid="header" />
        <CardTitle className="text-lg" id="t">
          T
        </CardTitle>
        <CardContent className="grid" data-testid="content" />
        <CardFooter className="justify-end" data-testid="footer" />
      </Card>,
    );
    expect(screen.getByLabelText("Summary").className).toContain("max-w-sm");
    expect(screen.getByLabelText("Summary").className).toContain("border");
    expect(screen.getByTestId("header").className).toContain("pb-2");
    expect(screen.getByRole("heading")).toHaveAttribute("id", "t");
    expect(screen.getByRole("heading").className).toContain("text-lg");
    expect(screen.getByTestId("content").className).toContain("grid");
    expect(screen.getByTestId("footer").className).toContain("justify-end");
  });

  test("types: only real heading levels compile", () => {
    // @ts-expect-error a card title is never the page's h1
    const h1 = <CardTitle as="h1">x</CardTitle>;
    // @ts-expect-error not a heading at all
    const div = <CardTitle as="div">x</CardTitle>;
    expect([h1, div]).toHaveLength(2);
  });
});
