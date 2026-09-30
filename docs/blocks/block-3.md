# Block 3: Badge, Input, Card, Dialog

Built 2026-09-30 on branch `block-3-components`, stacked on `block-2-docs` (PRs #1 and #2 are still
open; merging is yours). You said "continue with the block 3".

## What we built

| File | What it is |
|---|---|
| `src/ui/badge.tsx`, `badge.meta.ts`, `badge.test.tsx` | Badge finished: five variants, documented `BadgeOwnProps`, the dot hidden from screen readers so the text carries the meaning |
| `src/ui/input.tsx`, `input.meta.ts`, `input.test.tsx` | Input finished: `label` required by the type, `description` and `error` wired with `aria-describedby`, `aria-invalid` on error, your `id` respected, `ref` and native props pass through |
| `src/ui/card.tsx`, `card.meta.ts`, `card.test.tsx` | Card finished: five parts, each with a `data-slot`; `CardTitle` takes `as` for the heading level, h2 to h6 only |
| `src/ui/dialog.tsx`, `dialog.meta.ts`, `dialog.test.tsx` | Dialog finished: native `<dialog>`, reports `onOpenChange(false)` exactly once per opening however it closes, returns focus to the opener itself if the browser did not |
| `src/site/docs/demos/*` | A live preview for each: Badge variant, Input toggles, Card heading level, a real Dialog with a form |
| `src/site/docs/registry.ts` | All five registered; the placeholder page and the "Docs soon" badge are gone |
| `src/site/docs/docs-all.test.tsx` | Every page: h1, `aria-current`, axe, every file byte for byte, props table from the types |
| `scripts/stranger-test.mjs`, `npm run stranger` | The stranger test as a script: takes the code off the running site, pastes it into a fresh app, builds it |
| `src/ui/meta.ts` | `propsNote` added, so a compound component (Card) can explain whose props the table shows |

## The one new idea

*(Your words, after the walkthrough.)* "Report once, however it closes." The browser can close a
dialog several ways, and fires different events for each, sometimes two for one closing. A controlled
component has to collapse all of them into one message to its parent, or the parent's state and the
screen disagree.

## Other ideas to take away

- **Make the wrong thing impossible to write.** `label` on Input is required by the type, and
  `CardTitle` refuses `as="h1"` and `as="div"`. A test asserts those compile errors with
  `@ts-expect-error`, so the restriction itself is tested.
- **Colour is never the only signal.** Badge shows a dot and text; the dot is decoration and hidden
  from screen readers. A test checks that the badge's spoken text is only its label.
- **Focus return belongs to the component too.** Browsers restore focus after `showModal()`, but the
  component checks and does it if they did not. The test moves focus into the dialog by hand, then
  closes it, and expects the trigger to have focus again.

## Decisions made

- **Dialog reports on your own close too.** When your Cancel button sets `open={false}`, the native
  `close` event still fires and Dialog reports `onOpenChange(false)` once. I first wrote the test
  expecting zero and then changed it to one: the documented promise is "once, however it closes",
  and one message is easier to reason about than "sometimes none".
- **The shipped Dialog test carries its own 10-line `<dialog>` stand-in** for jsdom, and fires the
  `cancel` event the browser would fire on Escape. It does not fake focus trapping or Escape itself;
  those stay in the browser check.
- **`propsNote`** on the meta type, so Card's table reads "Props CardTitle adds…" instead of
  "Props Card adds…". The other four use the default caption.
- **The stranger script keeps one fresh app** at `STRANGER_DIR` (default in the OS temp folder) and
  empties `components/ui/` before every run, so each run pastes from scratch without a new
  `create-next-app` (which takes minutes).

## Deviations from the plan

- **Block 2's test "still a placeholder until Block 3"** now runs against the finished pages. It
  passes unchanged, because it only checks the h1 and `aria-current`, both still true. Its title is
  stale; the file was not touched, per the rule about earlier tests.
- **B3-T7's Tab cycling** is outside Jest, as the plan allowed. Checked in Chrome (below).
- **The stranger script had two bugs of its own** before it ran clean: the repo path kept the URL
  encoding of the space in "Shipped Products", and two examples both imported `Button` into the
  generated page. Neither touched the library.
- **Three planted bugs beyond the plan's three**, one per component file, so every component has at
  least one.
- No earlier test changed. Blocks 0, 1 and 2 pass unchanged.

## Testing phase

| Row | Proves | File |
|---|---|---|
| B3-T1 | Badge: each variant renders its text in a `<span>` with no axe violations; the dot is `aria-hidden`; not interactive; unknown variant fails to compile | `src/ui/badge.test.tsx` |
| B3-T2 | Input: reachable by its label and the label focuses it; description read after the label; error sets `aria-invalid` and joins the description; no `aria-invalid` without error; axe clean plain, with description, with error, disabled | `src/ui/input.test.tsx` |
| B3-T3 | Input: `<Input />` without a label fails to compile; `ref` reaches the `<input>`; controlled value updates; works in a plain form with name, type, required, autoComplete; your `id` is used | same |
| B3-T4 | Card: parts render in order; h3 by default; `as` h2 to h6 renders that level; valid outline under an h1 (axe); pure layout; props and className pass through; `as="h1"` and `as="div"` fail to compile | `src/ui/card.test.tsx` |
| B3-T5 | Dialog: closed and empty until opened; title is the accessible name and description the accessible description; Escape (`cancel`) closes and reports exactly once; focus returns to the opener | `src/ui/dialog.test.tsx` |
| B3-T6 | Dialog: backdrop click closes and reports once; a click inside does not; axe clean while open | same |
| B3-T7 | Dialog: a form inside submits and closes; your own Cancel closes and reports once; opens again with fresh content. Tab cycling: outside Jest | same |
| B3-T8 | Every one of the five: registered with files and a test; one h1, `aria-current`, axe; every source file and the test file byte for byte; props table exactly the extracted props with descriptions; at least three accessibility notes. Index lists exactly the five, no placeholders | `src/site/docs/docs-all.test.tsx` |
| B3-T9 | Stranger test for all five (below) | `scripts/stranger-test.mjs` |
| *(added)* | Each preview's control does what it says: Badge variant, Input error and disabled, Card heading level, Dialog rename | `src/site/docs/docs-all.test.tsx` |

`npm test`: 15 suites, 191 tests, green (about two minutes with nothing else running). `npm run lint`,
`npm run typecheck`, `npm run build`: green. One note for this laptop: with the dev server and a
production build running at the same time, the five full-page axe tests and one Block 0 test timed
out; run alone, all pass. CI: see the pull request.

## How we know the tests work

| Planted bug | Result |
|---|---|
| Input: `aria-describedby` dropped | 3 Input tests failed (B3-T2, B3-T3) |
| Dialog: focus not returned to the opener | 1 Dialog test failed (B3-T5) |
| Dialog: any click closes, even inside | 3 Dialog tests failed (B3-T6, B3-T7) |
| Dialog: the once-guard removed, so Escape reports twice | 2 Dialog tests failed (B3-T5) |
| Card: `as` ignored, always h3 | 5 Card tests failed (B3-T4) |
| Badge: the dot no longer `aria-hidden` | 1 Badge test failed (B3-T1) |

Each file was restored and compared byte for byte with its backup.

## The stranger test (B3-T9)

`npm run stranger` against the running site and the fresh app from Block 2:

| Check | Result |
|---|---|
| `cn.ts`, `button.tsx`, `button-styles.ts`, `badge.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx` as the site shows them | all byte for byte the repo files |
| `npm install clsx tailwind-merge`, tokens pasted after `@import "tailwindcss";` | ok |
| `next build` of a Server Component page using all five (Dialog through a small client wrapper) | ok |
| Rendered page has a `data-slot` for each of the five | ok |
| Built CSS has the Umber tokens and classes | ok |

## Checked outside Jest

| Check | Result |
|---|---|
| Dialog in Chrome: opens as a modal, focus lands on the name field, four Tabs stay inside, Escape closes, focus returns to "Rename project", no console errors | ✅ Claude |
| Badge, Input, Card, Dialog pages at 360 px, dark: exactly 360 px wide | ✅ Claude |
| The pages on your Android, and the copy buttons | ⏭️ Vercel not connected yet |

## Deliberately NOT in this block

A sixth component. Search, a theme toggle, an npm package (v2). Renaming Block 2's stale test title.

## Summary

Block 3 completes the five: Badge, Input, Card and Dialog are finished, each with its own tests,
docs page and live preview, and the stranger test is now one command that pastes all five into a
fresh app and builds it. A developer can build an accessible form inside a card inside a dialog from
copied code alone.

## Gate

*(Filled in when you answer.)*
