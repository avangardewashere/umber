// Tests for Input. Needs Jest with a jsdom environment, React Testing Library,
// @testing-library/user-event, @testing-library/jest-dom and jest-axe.
import "@testing-library/jest-dom";
import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { Input } from "./input";

expect.extend(toHaveNoViolations);

describe("Input", () => {
  test("is reachable by its label, and the label focuses it", async () => {
    render(<Input label="Email address" />);
    const input = screen.getByLabelText("Email address");
    expect(input.tagName).toBe("INPUT");
    await userEvent.click(screen.getByText("Email address"));
    expect(input).toHaveFocus();
  });

  test("the description is read after the label", () => {
    render(<Input label="Email address" description="We only use it to send the invite." />);
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription(
      "We only use it to send the invite.",
    );
  });

  test("an error marks the field invalid and is read as its description", () => {
    render(<Input label="Email address" description="Work email." error="Enter an email address." />);
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Work email. Enter an email address.");
  });

  test("without an error, the field is not marked invalid", () => {
    render(<Input label="Email address" />);
    const input = screen.getByLabelText("Email address");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  test.each([
    ["plain", {}],
    ["with a description", { description: "Work email." }],
    ["with an error", { error: "Enter an email address." }],
    ["disabled", { disabled: true }],
  ])("%s: no accessibility violations", async (_name, props) => {
    const { container } = render(<Input label="Email address" {...props} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  test("passes ref through to the real <input>", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email address" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText("Email address"));
  });

  test("works as a controlled input", async () => {
    function Form() {
      const [value, setValue] = useState("");
      return (
        <>
          <Input label="Name" value={value} onChange={(e) => setValue(e.target.value)} />
          <output>{value.toUpperCase()}</output>
        </>
      );
    }
    render(<Form />);
    await userEvent.type(screen.getByLabelText("Name"), "ana");
    expect(screen.getByLabelText("Name")).toHaveValue("ana");
    expect(screen.getByRole("status")).toHaveTextContent("ANA");
  });

  test("works inside a plain form: name, type and required land on the <input>", async () => {
    const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return new FormData(e.currentTarget).get("email");
    });
    render(
      <form onSubmit={onSubmit}>
        <Input label="Email address" name="email" type="email" required autoComplete="email" />
        <button type="submit">Send</button>
      </form>,
    );
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("autocomplete", "email");
    await userEvent.type(input, "ana@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.results[0].value).toBe("ana@example.com");
  });

  test("uses your id when you pass one, so an external element can point at the field", () => {
    render(<Input label="Search" id="site-search" description="Press / to focus." />);
    const input = screen.getByLabelText("Search");
    expect(input).toHaveAttribute("id", "site-search");
    expect(input).toHaveAttribute("aria-describedby", "site-search-description");
  });

  test("types: the label cannot be left out", () => {
    // @ts-expect-error label is required
    const unlabelled = <Input />;
    expect(unlabelled).toBeTruthy();
  });
});
