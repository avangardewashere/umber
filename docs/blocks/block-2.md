# Block 2: Component page + Button

Built 2026-09-30 on branch `block-2-docs`, stacked on `block-1-landing` because PR #1 is not merged
yet (merging it was blocked by a permission check; that is yours to do). You said "continue with the
block 2", which I took as the yes to both halves of the gate: merge PR #1, and add Shiki.

## What we built

| File | What it is |
|---|---|
| `src/ui/button.tsx` | Button, finished. Own props documented in `ButtonOwnProps`; `loading` with a spinner, `aria-busy` and `aria-disabled`; `ref` and every native prop pass through. Starts with `"use client"` |
| `src/ui/button-styles.ts` | `buttonStyles()` and the variant and size types, split out so server code can call them |
| `src/ui/button.test.tsx` | Button's tests. Shipped to users under "Tests included", so it sets up its own matchers |
| `src/ui/button.meta.ts`, `src/ui/meta.ts` | Accessibility notes and the name of the props type, for the site |
| `src/site/docs/props.ts` | Builds the props table from the TypeScript types with the TypeScript compiler, at build time |
| `src/site/docs/highlight.ts` | Shiki highlighting at build time, light and dark themes as CSS variables |
| `src/site/docs/load.ts`, `source.ts`, `registry.ts` | Read each component's files from disk and gather what its page shows. `tokensCss()` cuts the token block out of `globals.css` between two marker comments |
| `src/site/docs/component-docs.tsx` | The docs template: header, Preview, Code, Props, Accessibility, Tests included |
| `src/site/docs/docs-shell.tsx` | The five in a side nav (a scrolling row on phones), current page marked with `aria-current` |
| `src/site/docs/code-block.tsx`, `props-table.tsx` | A highlighted file with a copy button; the props table |
| `src/site/docs/demos/button-demo.tsx`, `choice.tsx` | The live preview: variant, size and loading controls, and the code line for the current choice |
| `src/app/components/page.tsx` | The index: the five, and "Set up once" (install command, tokens, `cn.ts`) |
| `src/app/components/[name]/page.tsx` | Button's full page; the other four stay placeholders until Block 3 |
| `src/ui/client-directive.test.ts` | Guards the bug the stranger test found (below) |

## The one new idea

*(Your words, after the walkthrough.)* Docs that cannot lie: the page reads the component's own
files at build time, and the props table comes from the component's own types. Change the code and
the page changes; there is nothing to keep in sync by hand.

## Other ideas to take away

- **`disabled` versus `aria-disabled`.** A disabled button drops keyboard focus, so a screen reader
  user who pressed Save is thrown back to the top of the page. While loading, Button uses
  `aria-disabled` instead, keeps focus, and ignores clicks itself.
- **Client and server code.** A file that starts with `"use client"` can be *rendered* from server
  code, but its functions cannot be *called* there. That is why `buttonStyles()` lives in its own file.
- **The stranger test earns its place.** Every test inside this repo passed while Button was broken
  for a real user, because Umber's own site only ever used Button inside client components.

## Decisions made

- **Shiki added**, with the `github-light-default` and `github-dark-default` themes. The older GitHub
  themes have token colours below 4.5:1 on Umber's surfaces (orange at 3.49:1 in light, grey
  comments at 3.56:1 in dark). The chosen pair's worst colours are 4.55:1 in light and 5.57:1 in dark.
- **Shiki loads lazily**, inside `highlight()`. Shiki is ESM-only and Jest cannot load it. The
  Block 1 landing test imports the docs route to list its paths, and must not change.
- **The props table reads a dedicated type**, `ButtonOwnProps`, not all of `ButtonProps`. The native
  `<button>` props would add about 300 rows; the table's caption says they all work.
- **`type` is documented as an own prop** because Umber changes its default to `"button"`.
- **Setup lives on `/components`** ("Set up once"), linked from every component page.
- **Loading uses `aria-disabled`**, not `disabled`. The guide's B2-T2 said "disables the button"; I
  read that as "blocks it", and chose the version that keeps focus. Tests check `aria-disabled`.
- **Build-time file reads carry `/*turbopackIgnore: true*/`.** Without it, Next warned it would trace
  the whole repo into the deployment.

## Deviations from the plan

- **Flat `src/ui/`, not one folder per component.** Pasted into a user's `components/ui/`, the old
  `../cn` import broke; flat, `./cn` works in both places. Block 1's files moved; no test changed.
- **Button is two files**, `button.tsx` and `button-styles.ts`. The docs page shows and copies both.
- **Two real bugs, found by the stranger test and fixed:**
  1. Button had no `"use client"`. Its own click handler (the loading guard) made it browser-only, so
     `<Button>` in an ordinary Server Component page failed the build. Umber's site never hit it.
  2. Adding `"use client"` then broke every server caller of `buttonStyles()`, including Umber's own
     landing page. Fixed by the split into `button-styles.ts`.
- **B2-T8 gained a Jest half:** `client-directive.test.ts` checks every `src/ui` file. Files using
  hooks or their own event handlers must start with `"use client"`; all others must not.
- **B2-T9 added:** the preview controls.
- **Two layout bugs fixed.** At 360 px, the "Set up once" steps were 650 px wide: grid items keep
  their widest code line unless told otherwise. The Block 1 landing page was also 8 px too wide; its
  dot pattern stuck out. The Block 1 note is corrected.
- **No earlier test changed.** The Block 1 landing test passes unchanged, including its import of the
  docs route.

## Testing phase

| Row | Proves | File |
|---|---|---|
| B2-T1 | All 12 variant × size combinations render a named button with no axe violations | `src/ui/button.test.tsx` |
| B2-T2 | Loading: `aria-busy` and `aria-disabled`, the name is unchanged, the spinner is hidden from screen readers, clicks are ignored, focus is kept, a loading submit button does not submit (and a normal one does) | same |
| B2-T3 | `ref` reaches the real `<button>`; `data-testid`, `name`, `value`, `disabled` land on it; `className` merges | same |
| B2-T4 | `variant="primry"` and `size="xl"` fail to compile (`@ts-expect-error`, checked by `npm run typecheck`) | same |
| B2-T5 | The Code blocks are byte for byte `button.tsx` and `button-styles.ts`, in that order; the test block is `button.test.tsx`; each copy button names its file | `src/site/docs/docs.test.tsx` |
| B2-T6 | `extractProps` reads variant, size, loading, type with their values, defaults and docs; the page table has exactly those rows; a prop added to a fixture type appears with nothing else changed | same |
| B2-T7 | Button page: one h1, `aria-current` on Button only, no axe violations. Other four: placeholder in the same nav. Unknown name: 404. Index: the five links, the setup blocks match the files, tokens without site-only lines, no axe violations | same |
| B2-T8 | Stranger test (below). Jest half: `"use client"` exactly where needed | `src/ui/client-directive.test.ts` |
| B2-T9 *(added)* | Preview controls update the preview and its code line; Loading makes it busy and it ignores clicks | `src/site/docs/docs.test.tsx` |

`npm test`: 10 suites, 114 tests, green. A warm run takes about 30 seconds. `npm run lint`,
`npm run typecheck`, `npm run build`: green, with no build warnings. CI: see the pull request.

## How we know the tests work

| Planted bug | Result |
|---|---|
| `ref` swallowed instead of passed to `<button>` | 1 Button test failed (B2-T3) |
| `onClick` still fires while loading | 2 failed: Button's "ignores clicks" (B2-T2) and the preview's (B2-T9) |
| Props table hardcoded as variant, size, loading | 1 docs test failed (B2-T6) |
| `ButtonVariant` loosened to `string` | typecheck failed: "Unused '@ts-expect-error' directive" (B2-T4) |
| `"use client"` removed from `button.tsx` | 1 directive test failed (B2-T8) |
| Dialog without `onCancel` (Block 1's regression, re-checked) | still covered by the Block 1 test |

The first three were run twice: once on the first version of Button, and again after the split into
two files. Every file was restored and compared byte for byte with its backup.

## The stranger test (B2-T8)

A fresh `create-next-app` (TypeScript, Tailwind, App Router, `src/`) in the scratchpad, never touched
by hand. A script fetched `/components/button` and `/components` from the running site, took the
code out of the page exactly as shown, and checked it was byte for byte the repo file:

| File as the site shows it | Same as repo? |
|---|---|
| `button.tsx` | yes |
| `button-styles.ts` | yes |
| `cn.ts` | yes |
| Install command | `npm install clsx tailwind-merge` |

It ran the install command, pasted the tokens after `@import "tailwindcss";`, saved the three files
in `src/components/ui/`, and wrote a Server Component home page with four Buttons (one loading)
and a Next `Link` styled with `buttonStyles()`.

| Run | Result |
|---|---|
| 1st, Button as first written | ❌ build failed: "Event handlers cannot be passed to Client Component props" |
| 2nd, after the split and `"use client"` | ✅ builds; 4 real `<button type="button">`s, only the loading one has `aria-busy="true"`; the link has the button classes; `.bg-accent` is generated and `--umber-accent` is defined |

The script is not in the repo yet. Block 3 needs it four more times, so it is worth turning into
`scripts/stranger-test.mjs` then.

## Checked outside Jest

| Check | Result |
|---|---|
| Button page, desktop, light: renders, Shiki colours applied, props table rows from the types, no console errors | ✅ Claude |
| Preview: danger plus loading shows the spinner, `aria-busy`, and the code line `<Button variant="danger" loading>` | ✅ Claude |
| Dark mode: code switches to the dark theme colours | ✅ Claude |
| 360 px: Button page, a placeholder page, the index and the landing page are all exactly 360 px wide; the props table and code scroll inside themselves | ✅ Claude, after the two layout fixes |
| Copy buttons in a real browser, and the pages on your Android | ⏭️ Vercel not connected yet |

## Deliberately NOT in this block

Docs for Badge, Input, Card and Dialog (Block 3). A stranger-test script. Search, a theme toggle,
versioned docs.

## Summary

Block 2 ships the docs machine and the first finished component: every Button page shows the exact
files the site runs, a props table built from the types, and the tests that ship with it. The
stranger test caught two real bugs that 110 passing tests could not see, and both are fixed and
guarded.

## Gate

*(Filled in when you answer.)*
