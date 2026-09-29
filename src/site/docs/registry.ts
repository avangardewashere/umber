import type { ComponentType } from "react";
import { buttonMeta } from "@/ui/button.meta";
import type { ComponentMeta } from "@/ui/meta";
import { ButtonDemo } from "./demos/button-demo";

export type DocsEntry = {
  meta: ComponentMeta;
  /** The component's source files, relative to the repo root. The first holds the props type. */
  files: string[];
  /** Its test file, shown under "Tests included". */
  testFile: string;
  /** The live preview with controls. */
  Demo: ComponentType;
};

/** Components with a finished docs page. The rest show a placeholder until Block 3. */
export const DOCS: Readonly<Record<string, DocsEntry | undefined>> = {
  button: {
    meta: buttonMeta,
    files: ["src/ui/button.tsx", "src/ui/button-styles.ts"],
    testFile: "src/ui/button.test.tsx",
    Demo: ButtonDemo,
  },
};
