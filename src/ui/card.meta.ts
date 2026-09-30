import type { ComponentMeta } from "./meta";

export const cardMeta = {
  propsType: "CardTitleOwnProps",
  element: "div",
  propsNote: "Props CardTitle adds. Card, CardHeader, CardContent and CardFooter take every native <div> prop.",
  accessibility: [
    "Card is a plain <div>: pure layout, no role. Screen readers move straight through it to the content.",
    "CardTitle is a real heading. Choose its level with `as` so the page outline stays in order; a wrong level is the most common accessibility bug in card layouts.",
    "Nothing inside a Card is hidden or clipped, and the card itself is never the click target. Put a Button or a link inside instead of making the whole card clickable.",
    "The border uses the plain border token: it is decoration, not information, so it does not need 3:1 contrast.",
  ],
} satisfies ComponentMeta;
