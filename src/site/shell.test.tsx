import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Shell } from "./shell";
import Home from "@/app/page";

// B0-T1: the shell renders a heading with the library name, and jest-axe finds nothing.
describe("Shell", () => {
  test("renders the placeholder page with the library name as a heading", () => {
    render(
      <Shell>
        <Home />
      </Shell>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Umber" })).toBeInTheDocument();
  });

  test("has a GitHub link that opens safely in a new tab", () => {
    render(<Shell>x</Shell>);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(
      <Shell>
        <Home />
      </Shell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
