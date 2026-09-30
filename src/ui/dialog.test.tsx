// Tests for Dialog. Needs Jest with a jsdom environment, React Testing Library,
// @testing-library/user-event, @testing-library/jest-dom and jest-axe.
import "@testing-library/jest-dom";
import { useState } from "react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { Dialog } from "./dialog";

expect.extend(toHaveNoViolations);

// jsdom (the pretend browser Jest uses) has <dialog> but not showModal() or close(). This stand-in
// toggles the `open` attribute and fires "close". It does not trap focus, move focus, handle Escape
// or draw a backdrop: those are real-browser behaviours. Where a test needs them, it fires the
// event the browser would fire (Escape fires "cancel") or moves focus itself.
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

function Example({
  onOpenChange = () => {},
  onSubmit = () => {},
}: {
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        Rename
      </button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
        title="Rename project"
        description="The old name stops working right away."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(String(new FormData(e.currentTarget).get("name")));
            setOpen(false);
          }}
        >
          <label>
            New name <input name="name" />
          </label>
          <button type="button" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </form>
      </Dialog>
    </>
  );
}

/** What the browser fires when the person presses Escape on an open modal dialog. */
function pressEscape(dialog: HTMLElement) {
  act(() => {
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
  });
}

describe("Dialog", () => {
  test("is closed and empty until opened, then opens with its title as the accessible name", async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Rename project")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Rename" }));
    const dialog = screen.getByRole("dialog", { name: "Rename project" });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleDescription("The old name stops working right away.");
  });

  test("passes axe while open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.click(screen.getByRole("button", { name: "Rename" }));
    expect(await axe(container)).toHaveNoViolations();
  });

  test("Escape closes it and reports exactly once", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Rename" }));

    pressEscape(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("returns focus to the element that opened it", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Rename" });
    await user.click(trigger);
    // A real browser moves focus into the dialog on open; jsdom does not, so do it here.
    within(screen.getByRole("dialog")).getByLabelText("New name").focus();
    expect(trigger).not.toHaveFocus();

    pressEscape(screen.getByRole("dialog"));
    expect(trigger).toHaveFocus();
  });

  test("a click on the backdrop closes it; a click inside does not", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Rename" }));
    const dialog = screen.getByRole("dialog");

    await user.click(within(dialog).getByText("The old name stops working right away."));
    expect(dialog).toHaveAttribute("open");
    expect(onOpenChange).not.toHaveBeenCalled();

    // The backdrop is the <dialog> element itself: the content sits in an inner element.
    await user.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  test("your own Cancel button closes it, and still reports once", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Once, however it closed: the native "close" event fires after your state change,
    // and Dialog reports it exactly one time.
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("a form inside submits and closes", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<Example onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.type(screen.getByLabelText("New name"), "Umber v2");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith("Umber v2");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("can open again after closing, with fresh content", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Rename" });
    await user.click(trigger);
    await user.type(screen.getByLabelText("New name"), "draft");
    pressEscape(screen.getByRole("dialog"));

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Rename project" })).toHaveAttribute("open");
    expect(screen.getByLabelText("New name")).toHaveValue("");
  });

  test("types: title and the open pair are required", () => {
    // @ts-expect-error title is required
    const noTitle = <Dialog open onOpenChange={() => {}} />;
    // @ts-expect-error open and onOpenChange are required: Dialog is always controlled
    const uncontrolled = <Dialog title="x" />;
    expect([noTitle, uncontrolled]).toHaveLength(2);
  });
});
