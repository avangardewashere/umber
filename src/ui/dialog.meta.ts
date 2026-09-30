import type { ComponentMeta } from "./meta";

export const dialogMeta = {
  propsType: "DialogOwnProps",
  element: "dialog",
  accessibility: [
    "Built on the native <dialog> opened with showModal(). The browser traps focus inside, closes on Escape, dims the page behind, and makes it inert. No focus-trap library, no portal.",
    "The title is the dialog's accessible name (aria-labelledby) and the description its accessible description, so a screen reader announces both on open.",
    "Focus moves into the dialog on open and returns to the element that opened it on close. Browsers do the return themselves; Dialog also checks and does it if they did not.",
    "onOpenChange(false) is called exactly once per opening, whether the dialog closed by Escape, backdrop click, or your own button.",
    "Clicking the dimmed backdrop closes the dialog; clicking anywhere inside does not, because the content fills the element.",
    "Put a visible close or cancel button inside. Not everyone knows that Escape or the backdrop closes a dialog.",
  ],
} satisfies ComponentMeta;
