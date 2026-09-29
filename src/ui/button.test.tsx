// Tests for Button. Needs Jest with a jsdom environment, React Testing Library,
// @testing-library/user-event, @testing-library/jest-dom and jest-axe.
import "@testing-library/jest-dom";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button, type ButtonSize, type ButtonVariant } from "./button";

expect.extend(toHaveNoViolations);

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "danger"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];
const EVERY_COMBINATION = VARIANTS.flatMap((v) => SIZES.map((s) => [v, s] as const));

describe("Button", () => {
  test.each(EVERY_COMBINATION)(
    "%s %s: renders a named button with no accessibility violations",
    async (variant, size) => {
      const { container } = render(
        <Button variant={variant} size={size}>
          Save
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Save" });
      expect(button).toHaveAttribute("data-variant", variant);
      expect(await axe(container)).toHaveNoViolations();
    },
  );

  test("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('defaults to type="button", so it never submits a form by accident', async () => {
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Save</Button>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  describe("loading", () => {
    test("sets aria-busy and aria-disabled, keeps its accessible name, shows a spinner", () => {
      render(<Button loading>Save</Button>);
      const button = screen.getByRole("button", { name: "Save" });
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    test("ignores clicks", async () => {
      const onClick = jest.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
      expect(onClick).not.toHaveBeenCalled();
    });

    test("keeps keyboard focus when loading starts (a disabled button would drop it)", () => {
      const { rerender } = render(<Button>Save</Button>);
      const button = screen.getByRole("button", { name: "Save" });
      button.focus();
      rerender(<Button loading>Save</Button>);
      expect(button).toHaveFocus();
      expect(button).not.toBeDisabled();
    });

    test("a loading submit button does not submit its form", async () => {
      const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit" loading>
            Save
          </Button>
        </form>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test("without loading, the same submit button does submit", async () => {
      const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit">Save</Button>
        </form>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test("passes ref through to the real <button>", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole("button", { name: "Save" }));
  });

  test("passes other props to the <button>, and merges className", () => {
    render(
      <Button data-testid="save" name="intent" value="save" className="w-full" disabled>
        Save
      </Button>,
    );
    const button = screen.getByTestId("save");
    expect(button).toHaveAttribute("name", "intent");
    expect(button).toHaveAttribute("value", "save");
    expect(button).toBeDisabled();
    expect(button.className).toContain("w-full");
  });

  test("types: only the documented variants and sizes compile", () => {
    // TypeScript checks these lines (npm run typecheck). If a typo ever compiles,
    // the @ts-expect-error comment itself becomes an error.
    // @ts-expect-error "primry" is not a variant
    const typo = <Button variant="primry">Save</Button>;
    // @ts-expect-error "xl" is not a size
    const tooBig = <Button size="xl">Save</Button>;
    expect([typo, tooBig]).toHaveLength(2);
  });
});
