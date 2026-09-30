// Tests for Badge. Needs Jest with a jsdom environment, React Testing Library,
// @testing-library/jest-dom and jest-axe.
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Badge, type BadgeVariant } from "./badge";

expect.extend(toHaveNoViolations);

const VARIANTS: BadgeVariant[] = ["neutral", "info", "success", "warning", "danger"];

describe("Badge", () => {
  test.each(VARIANTS)("%s: renders its text in a <span> with no accessibility violations", async (variant) => {
    const { container } = render(<Badge variant={variant}>Pending</Badge>);
    const badge = screen.getByText("Pending");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-variant", variant);
    expect(await axe(container)).toHaveNoViolations();
  });

  test("defaults to the neutral variant", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft")).toHaveAttribute("data-variant", "neutral");
  });

  test("the text carries the meaning: the dot is hidden from screen readers", () => {
    render(<Badge variant="danger">Revoked</Badge>);
    const badge = screen.getByText("Revoked");
    expect(badge).toHaveTextContent(/^Revoked$/);
    expect(badge.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  test("is not interactive: no role, not focusable", () => {
    render(<Badge>Beta</Badge>);
    const badge = screen.getByText("Beta");
    expect(badge).not.toHaveAttribute("role");
    expect(badge).not.toHaveAttribute("tabindex");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("passes other props to the <span>, and merges className", () => {
    render(
      <Badge data-testid="b" title="Three seats" className="ml-2">
        3 left
      </Badge>,
    );
    const badge = screen.getByTestId("b");
    expect(badge).toHaveAttribute("title", "Three seats");
    expect(badge.className).toContain("ml-2");
    expect(badge.className).toContain("rounded-full");
  });

  test("types: only the documented variants compile", () => {
    // @ts-expect-error "primary" is a Button variant, not a Badge variant
    const wrong = <Badge variant="primary">x</Badge>;
    expect(wrong).toBeTruthy();
  });
});
