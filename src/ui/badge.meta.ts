import type { ComponentMeta } from "./meta";

export const badgeMeta = {
  propsType: "BadgeOwnProps",
  element: "span",
  accessibility: [
    "Renders a plain <span>. A badge is read, never pressed, so it has no role and takes no focus.",
    "The text carries the meaning. The colour and the dot only support it, so the badge still reads correctly for people who cannot tell the colours apart.",
    "Every variant's text colour is tested at 4.5:1 or better on its own tinted background, in both themes (see the contrast test).",
    "Keep the text short and literal: \"Pending\", not a symbol. Screen readers read exactly what is written.",
  ],
} satisfies ComponentMeta;
