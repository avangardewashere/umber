// Adds DOM matchers like toBeInTheDocument() to every test's expect().
import "@testing-library/jest-dom";
// Adds toHaveNoViolations() for jest-axe accessibility checks.
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom (the pretend browser) has <dialog> but not its methods. This stand-in only toggles the
// `open` attribute and fires "close". It does NOT trap focus, handle Escape or draw a backdrop:
// those are real-browser behaviours, checked outside Jest.
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  if (!("open" in HTMLDialogElement.prototype)) {
    Object.defineProperty(HTMLDialogElement.prototype, "open", {
      get(this: HTMLDialogElement) {
        return this.hasAttribute("open");
      },
    });
  }
}
