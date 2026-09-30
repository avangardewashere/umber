import type { ComponentType } from "react";
import { badgeMeta } from "@/ui/badge.meta";
import { buttonMeta } from "@/ui/button.meta";
import { cardMeta } from "@/ui/card.meta";
import { dialogMeta } from "@/ui/dialog.meta";
import { inputMeta } from "@/ui/input.meta";
import type { ComponentMeta } from "@/ui/meta";
import { BadgeDemo } from "./demos/badge-demo";
import { ButtonDemo } from "./demos/button-demo";
import { CardDemo } from "./demos/card-demo";
import { DialogDemo } from "./demos/dialog-demo";
import { InputDemo } from "./demos/input-demo";

export type DocsEntry = {
  meta: ComponentMeta;
  /** The component's source files, relative to the repo root. The first holds the props type. */
  files: string[];
  /** Its test file, shown under "Tests included". */
  testFile: string;
  /** The live preview with controls. */
  Demo: ComponentType;
};

/** The five, each with a finished docs page. */
export const DOCS: Readonly<Record<string, DocsEntry | undefined>> = {
  button: {
    meta: buttonMeta,
    files: ["src/ui/button.tsx", "src/ui/button-styles.ts"],
    testFile: "src/ui/button.test.tsx",
    Demo: ButtonDemo,
  },
  badge: {
    meta: badgeMeta,
    files: ["src/ui/badge.tsx"],
    testFile: "src/ui/badge.test.tsx",
    Demo: BadgeDemo,
  },
  input: {
    meta: inputMeta,
    files: ["src/ui/input.tsx"],
    testFile: "src/ui/input.test.tsx",
    Demo: InputDemo,
  },
  card: {
    meta: cardMeta,
    files: ["src/ui/card.tsx"],
    testFile: "src/ui/card.test.tsx",
    Demo: CardDemo,
  },
  dialog: {
    meta: dialogMeta,
    files: ["src/ui/dialog.tsx"],
    testFile: "src/ui/dialog.test.tsx",
    Demo: DialogDemo,
  },
};
