import type { ComponentMeta } from "./meta";

export const buttonMeta = {
  propsType: "ButtonOwnProps",
  element: "button",
  accessibility: [
    "Renders a real <button>, so Enter and Space work and screen readers announce it as a button.",
    'Defaults to type="button", so it only submits a form when you ask for type="submit".',
    "While loading, it sets aria-busy and aria-disabled but keeps keyboard focus, and ignores clicks. A native disabled button would drop focus.",
    "The spinner is hidden from screen readers; the label stays, so the button's name never changes.",
    "The focus ring uses the ring token, tested at 3:1 or better against the page in both themes.",
    "For navigation, use a link styled with buttonStyles(), not a Button with an onClick.",
  ],
} satisfies ComponentMeta;
