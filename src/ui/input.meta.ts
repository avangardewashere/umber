import type { ComponentMeta } from "./meta";

export const inputMeta = {
  propsType: "InputOwnProps",
  element: "input",
  accessibility: [
    "The label is a required prop and a real <label for>, so clicking it focuses the field and screen readers announce it.",
    "The description and the error are linked with aria-describedby. A screen reader reads them after the label when the field gets focus.",
    "An error also sets aria-invalid, so assistive technology announces the field as invalid, and the border turns red for everyone else.",
    "The border uses the border-strong token, tested at 3:1 or better in both themes, so the field's edge is visible to people with low vision.",
    "Pass the native props you would anyway: type, autoComplete, inputMode, required. They land on the <input>.",
  ],
} satisfies ComponentMeta;
