/**
 * The five components, in the order the site lists them. This is the cap: a sixth entry here is a
 * deviation from the plan and needs a yes first (a test pins the list).
 */
export type CatalogEntry = {
  slug: string;
  name: string;
  file: string;
  summary: string;
};

export const COMPONENTS = [
  {
    slug: "button",
    name: "Button",
    file: "button.tsx",
    summary: "Four variants, three sizes, and always a real <button>.",
  },
  {
    slug: "badge",
    name: "Badge",
    file: "badge.tsx",
    summary: "Short status labels that never rely on colour alone.",
  },
  {
    slug: "input",
    name: "Input",
    file: "input.tsx",
    summary: "A label you cannot forget, and errors wired for screen readers.",
  },
  {
    slug: "card",
    name: "Card",
    file: "card.tsx",
    summary: "Header, content and footer, with the heading level you choose.",
  },
  {
    slug: "dialog",
    name: "Dialog",
    file: "dialog.tsx",
    summary: "The browser's own <dialog>: focus, Escape and backdrop built in.",
  },
] as const satisfies readonly CatalogEntry[];

export function findComponent(slug: string): CatalogEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}
