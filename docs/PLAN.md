# Umber: build guide

> **Umber** is a pigment: a plain earth colour that painters mix into everything else. The name is a
> pseudonym, chosen 2026-09-23, with nothing to live up to. Tagline: **Five parts. Copy, paste, ship.**
> A public, frontend-only React component library with its own website. Developers land on the site,
> see the components working, and copy the code into their own project. No accounts, no backend,
> no database. The product *is* the website.

## Goal

Take a fifth project from an empty folder to shipped, **three features at a time**, with **at most
five components** until v2 so the build stays small enough to finish. The new skill this project
teaches is **building for other developers**: a component is only "done" when a stranger can copy it,
paste it, and have it work with no help from you. That means accessibility by default, a props table
that is generated from the code (not typed by hand), and tests that ship with every component.

## Who it's for

| | |
|---|---|
| **Main user** | A React developer on a small project who wants five solid, accessible components without adopting a 60-component framework. They arrive from GitHub or a link, and decide in under 30 seconds whether to stay |
| **Second user** | You, on every future Shipped Products project. Habibit, Sipat, Tipon and Tantya each rebuilt a button. This library ends that |
| **Not for** | Vue, Svelte or plain-HTML users (React only); teams that need themes, RTL or design tokens across a big org; anyone who wants an `npm install` in v1 (that is v2) |

## How we work: the rules of this guide

The same five rules as Tantya, unchanged:

1. **Three features per version.** No more, no fewer.
2. **One feature per block.** A *feature* is one new thing a **developer visiting the site** can do.
3. **Every block has its own testing phase**, and it must pass before the block can close.
4. **Every block ends with a summary of one to three sentences.**
5. **Claude asks before starting the next block**, before using a cut line, before changing an earlier
   test, and before adding a new tool.

**One new rule for this project: the five-component cap.** Until v2 starts, the library holds exactly
Button, Badge, Input, Card and Dialog. A sixth component, however tempting, goes to the
[Backlog](#backlog). A UI library is the easiest project in the world to never finish.

### The block loop

```
 plan the block ─► write the test rows ─► build ─► TESTING PHASE
 (read this file)                                    │ red? fix, run again
                                                     ▼
        ASK ◄── SUMMARY ◄── block note ◄── WALKTHROUGH ◄── YOUR ANDROID CHECKS ◄─┘
 "Start Block N+1?"  (1–3        (docs/blocks/)  (Claude walks you through
  wait for a yes     sentences)                   the new files; you ask)
```

No worked-by-hand examples this time: there is no maths. The step that replaces it is the
**stranger test** (below), because the failure mode of this project is "works on my machine".

### What "testing phase" means

A block's testing phase is done only when all six are true:

1. **Every row in this file exists as a test, or as a named check.** Every row has an ID (`B1-T3`).
   The block note links each row to the file that proves it.
2. **`npm test` is green** on this PC and in CI. No timezone pinning: there is no date code anywhere
   in this project, and if one is ever proposed it is a deviation.
3. **Planted bugs go red.** Realistic bugs are planted one at a time. Each must fail at least one test,
   then the file is restored.
4. **Every earlier block's tests still pass, unchanged.**
5. **CI is green on GitHub:** lint, typecheck, test, build.
6. **The "outside Jest" list is run by hand.** Desktop Chrome by Claude, Android Chrome by you.
   iOS is never required. From Block 2 this list always includes the **stranger test**: a fresh
   `create-next-app` in a temp folder, paste the component exactly as the site shows it, and it must
   compile and render with no edits. Claude runs this on the PC; the block note records the result.

### The test tools

| Tool | Used for |
|---|---|
| **Jest 30** through `next/jest` | Everything |
| **React Testing Library + user-event** | Components and pages: click, type, tab, press Escape, find things by role and label |
| **jest-axe** | Every component in every variant, and every page. It cannot check colour contrast, so contrast stays in the outside-Jest list |
| **Type tests** (`expectTypeOf` from `expect-type`, one small dependency) | Block 2 onward. A library's props *are* its product, so "this prop does not accept that value" is a test |

Components and pages run in **jsdom**. The one thing to know before Block 3: jsdom's `<dialog>`
support is partial. If `showModal` is missing, the test file adds a small polyfill and the block note
says so. The real behaviour is then covered by the outside-Jest list.

### What the ask sounds like

> Block 1 is done. *(summary, 1–3 sentences)* Tests: 34 passing, 3 planted bugs caught, CI green.
> Outside Jest: 3 ✅ (landing at phone width on desktop and your Android; contrast checked).
> **Shall I start Block 2, the component page and Button?**

## Before you say yes

**Size.** A session is about two hours. Block 0 about 2 sessions, Block 1 about 3, Block 2 about 4,
Block 3 about 5 (four components). **v1 is roughly 14 sessions** plus the release.

**Your part, which Claude cannot do for you:**
- Choose the name. It becomes the repo, the URL, and later the npm package name.
- Run the Android checks every block.
- Create the GitHub repo and connect Vercel yourself (no Vercel CLI on this PC). Claude walks you through it.
- Before the v1 release, find **one developer who is not you** to open the site cold and try to use
  one component. Their first confused question becomes the first item of the v2 re-plan.

**What a yes to Block 0 accepts:** every row in [Decisions](#decisions) marked "Block 0".

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | Same as the four before. The site and the library live in one repo, one app |
| Language | TypeScript, strict | Props are the product. `variant="primry"` must fail before it ships |
| Styling | Tailwind CSS 4 + CSS variables for colour | Tailwind because that is what the copy-paste model assumes the user has. CSS variables so a user changes five values to rebrand |
| Class merging | `clsx` + `tailwind-merge` | The only two runtime dependencies a copied component needs. Standard, tiny, and users likely have them |
| Variants | Hand-written variant maps, no `cva` | One fewer dependency for the user. Five components do not need a variant engine |
| Code display | **Shiki** (server-side highlighting) from Block 2 | Decision row. Zero client JavaScript; highlighting happens at build |
| Tests | Jest 30, RTL, user-event, jest-axe, expect-type | See above |
| CI | GitHub Actions | Every push: lint, typecheck, test, build |
| Hosting | Vercel free tier | Connected in Block 0. Every block's branch gets a preview link for your phone |
| Distribution (v1) | **Copy and paste** from the site | No publish pipeline, no versioning, no breaking changes to manage. The shadcn model. npm is v2 |

## The folder contract

```
src/ui/                        the library, flat (changed in Block 2, see below):
  cn.ts                          the class helper every component imports as "./cn"
  button.tsx                     the component. This exact file is what the site shows and what users copy
  button-styles.ts               server-safe parts a component may need (Button only)
  button.test.tsx                its tests. Also shown on the site ("tests included")
  button.meta.ts                 accessibility notes and the name of the props type, for the site only
src/site/                      the website: landing page, docs pages, nav, code block, copy button
src/app/                       Next.js routes only, thin
```

**Why flat (Block 2 deviation):** users paste files into their own `components/ui/`. With one folder
per component, `button.tsx` imported `../cn`, which breaks the moment a stranger pastes it next to
`cn.ts`. Flat, the import is `./cn` in both places, and `@/components/ui/button` is a real path.

**The rule that keeps docs honest:** the docs page **reads `button.tsx` from disk at build time** and
shows that. The props table is **generated from the TypeScript types** at build time. Nothing about a
component is written twice. If the code changes, the page changes. An ESLint rule stops `src/ui`
importing anything from `src/site` or `src/app`, so a copied component never drags the website along.

## The look (decided in Block 0, used everywhere)

A UI library site is judged on its own components in the first three seconds, so the landing page is
**built only from the five components**. Nothing on it that a user cannot copy. One accent colour,
one neutral scale, one typeface for text and one monospace for code, all as CSS variables. Light and
dark from Block 0 (via `prefers-color-scheme`; a toggle is v2).

## Roadmap: three versions, nine features

| Version | Theme | Feature 1 | Feature 2 | Feature 3 |
|---|---|---|---|---|
| **v1** | See it, copy it. Five components, zero install | **1** Landing page | **2** Component page + Button | **3** Badge, Input, Card, Dialog |
| **v2** | Install it. Still five components | **4** `npm install umber` (the package) | **5** Theme page: change five variables, see all five components update, copy the CSS | **6** Search and keyboard navigation across the docs |
| **v3** | Grow it, carefully | **7** Components 6 to 10 (re-planned, one block) | **8** Playground: edit props live in the browser | **9** Changelog and versioned docs |

**Progress:** guide written 2026-09-22. **Block 0 closed 2026-09-23.** **Block 1 built 2026-09-29**
(PR #1). **Block 2 built 2026-09-30** (PR #2). **Block 3 built 2026-09-30** on `block-3-components`,
stacked on Block 2 (`docs/blocks/block-3.md`): all five components finished, documented and passed the
stranger test, which is now `npm run stranger`. **v1 release prepared 2026-10-07** on `v1-release`
(`docs/release/v1-checklist.md`): README and launch post drafted. PRs #1 to #4 open, in order. Blocked on
you for the merges, Vercel, the Android check and the stranger who is not you; the tag follows the merge.

v1 is planned in full. v2 and v3 are the current best guess and get re-planned when they start.

---

## Block 0: Groundwork (not a feature)

**What we build**
- `create-next-app` in `Shipped Products/umber`: Next.js 16, React 19, strict TS, Tailwind 4, `src/`.
- Jest through `next/jest`, RTL, user-event, jest-dom, jest-axe, expect-type.
- The folder contract above, with the ESLint wall (`src/ui` cannot import `src/site` or `src/app`).
- The look: CSS variables for colour (light and dark), type scale, radius, spacing. The page shell
  (header with name and GitHub link, empty main, footer with licence).
- `clsx` + `tailwind-merge` wrapped in one `cn()` helper inside `src/ui`, since every component uses it
  and every copied component needs it.
- MIT `LICENSE` file, `README.md` with one paragraph and the five-component cap written down.
- GitHub repo, Actions workflow, Vercel connected now. An `umber` entry in `.claude/launch.json`, port 3005.

**What you learn.** *The one new idea:* the lint wall between a library and the site that shows it.
*Also:* why a public repo needs a licence file before the first component exists.

**Testing phase**

| ID | Proves |
|---|---|
| B0-T1 | Smoke: the shell renders a heading with the library name, and jest-axe finds nothing |
| B0-T2 | The lint wall: a Jest test runs ESLint on a small file inside `src/ui` that imports from `src/site`, and expects exactly one error |
| B0-T3 | `cn()`: merges classes, drops falsy values, and later Tailwind classes win (`cn('p-2', 'p-4')` is `'p-4'`) |
| B0-T4 | Dark mode: the CSS variable file defines every colour token in both the light block and the dark block (a test reads the file and compares the two lists) |
| B0-T5 | CI is green: lint, typecheck, test, build (a named check) |

**Planted bugs:** swap `clsx` order so earlier classes win; delete one dark-mode token.

**Outside Jest:** the preview link opens on your Android; light and dark both render with no
unstyled flash; contrast of text on both backgrounds passes in Chrome DevTools.

**Cut line:** none.

> **Summary:** Block 0 builds the workshop: a Next.js app with Jest, CI, a preview link, the shared
> look in light and dark, and a wall that keeps the library separate from the site that shows it.
>
> **Gate:** "Groundwork is done. Before Block 1 I need your yes on the landing page copy (the
> one-sentence pitch) and the three 'why' points. Shall I start Block 1, the landing page?"

## Block 1: Landing page

**The feature:** a developer opens the site and, in under 30 seconds, knows what this is, sees the
components working, and can copy the first snippet.

**Why first:** you asked for it, and you are right. The site is the product, and the landing page is
the only page most visitors will see. Its job is to make a stranger click "Components".

**What we build** (from top to bottom, all phone-first)
- **Hero:** name, one sentence, two buttons ("Browse components", "GitHub"). Beside or below it, a
  **live card** with a Button in each variant, an Input with a label, a Badge, and an "Open dialog"
  button. Every one of them is real and interactive, not a screenshot. *(This means the five
  components exist in a first, rough form in Block 1. They are finished, tested and documented in
  Blocks 2 and 3. The landing page is their first user.)*
- **Copy strip:** one code block showing a Button being used, with a copy button. Copied state
  ("Copied") shows for two seconds.
- **The five:** five cards, one per component, each linking to its docs page (empty pages until
  Block 2; the links exist so the structure is real).
- **Why:** three short points. Proposed: *accessible by default (every component passes axe and
  works by keyboard)*, *tests included (you copy the test with the component)*, *nothing to install
  (React, Tailwind, two tiny helpers)*. You confirm or rewrite these at the Block 0 gate.
- **Footer:** GitHub, MIT, "built with its own five components".
- Metadata: title, description, Open Graph image (a static PNG for now) so the link looks right when
  pasted into Messenger or X.

**What you learn.** *The one new idea:* dogfooding as a constraint, and the discipline of a landing page
that only makes claims a test backs up. *Also:* Open Graph tags; why "Copied" needs a timer and a test.

**Testing phase**

| ID | Proves |
|---|---|
| B1-T1 | The page renders a level-1 heading with the name, exactly one `h1`, and jest-axe finds nothing |
| B1-T2 | "Browse components" is a link to `/components`; "GitHub" is a link to the repo with `rel="noopener"` and opens in a new tab |
| B1-T3 | The live card contains a button for each variant, an input reachable by its label, a badge, and a dialog trigger |
| B1-T4 | Copy: clicking the copy button writes the snippet to the clipboard (mocked), the button text becomes "Copied", and returns to "Copy" after two seconds (fake timers) |
| B1-T5 | Copy failure: if the clipboard call rejects, the button shows "Press Ctrl+C" and does not throw |
| B1-T6 | The five cards each link to `/components/<name>`, and the five names are exactly the cap list |
| B1-T7 | Metadata: title, description and Open Graph image are set (test reads the exported `metadata`) |
| B1-T8 | Keyboard: tabbing from the top reaches the two hero buttons, then the live card controls, then the copy button, in that order |
| B1-T9 | *(added in Block 1)* Contrast of every token pairing in both themes: text 4.5:1, focus ring and input outline 3:1 |

**Planted bugs:** forget `rel="noopener"`; remove the `setTimeout` reset; render two `h1`s.

**Outside Jest:** phone width on desktop Chrome and on your Android; no horizontal scroll at 360 px;
light and dark; paste the preview link into Messenger and check the card preview appears.

**Cut line:** the Open Graph image becomes a plain title-only image (drops nothing; B1-T7 still passes).

> **Summary:** Block 1 ships the front door: a landing page built only from the library's own five
> components, with a copy button that is tested to work and to fail gracefully.
>
> **Gate:** "Block 1 is done. Shall I start Block 2, the component page and Button?"

## Block 2: Component page + Button

**The feature:** a developer opens `/components/button`, sees every variant, reads the props, and
copies the exact source file.

**What we build**
- **The docs page template** used by all five: left nav (the five names), then for one component:
  live preview with variant and size controls, the source code (read from disk at build time,
  highlighted by Shiki, with a copy button), the **props table generated from the types**, the
  accessibility notes from `meta.ts`, and the test file under "Tests included".
- **Button, finished:** variants `primary | secondary | ghost | danger`, sizes `sm | md | lg`,
  `loading` (spinner, `aria-busy`, disabled). A plain `<button>`; links stay links.
  Forwards `ref`. Spreads the rest of the props to the element.
- `/components` index page listing the five with descriptions.

**What you learn.** *The one new idea:* docs that cannot lie, because they are read from the code at
build time. *Also:* forwarding refs; why `disabled` and `aria-disabled` are different; type tests.

**Testing phase**

| ID | Proves |
|---|---|
| B2-T1 | Button renders each variant × size, and jest-axe finds nothing in any of the twelve |
| B2-T2 | `loading`: sets `aria-busy`, disables the button, still shows the label to screen readers, and `onClick` does not fire |
| B2-T3 | `ref` reaches the real `<button>`; unknown props such as `data-testid` and `type="submit"` land on it |
| B2-T4 | Type test: `variant="primry"` is a type error; `size` accepts only the three values |
| B2-T5 | The docs page shows the source that is actually on disk (test reads `button.tsx` and expects the page text to contain its first line) |
| B2-T6 | The props table lists `variant`, `size`, `loading` with their allowed values, and a prop added to the type appears without editing the page (test uses a fixture type) |
| B2-T7 | The docs page passes jest-axe, has one `h1`, and the left nav marks the current page with `aria-current` |
| B2-T8 | Stranger test (named check, outside Jest, recorded in the block note): pasted into a fresh app, it compiles and renders. *Plus, in Jest since Block 2:* every `src/ui` file that uses hooks or its own event handlers starts with `"use client"`, and no other file does |
| B2-T9 | *(added in Block 2)* The preview controls: variant and size update the preview and its code line; Loading makes it busy and it ignores clicks |

**Planted bugs:** drop `forwardRef`; let `onClick` fire while loading; hardcode the props table.

**Outside Jest:** the stranger test; focus ring visible in both themes; the copy button on the phone.

**Cut line:** Shiki highlighting drops to a plain `<pre>` (drops no test rows; B2-T5 still passes).

> **Summary:** Block 2 ships the machine that documents a component from its own source, and the
> first finished component running through it.
>
> **Gate:** "Block 2 is done. Shall I start Block 3, the remaining four components?"

## Block 3: Badge, Input, Card, Dialog

**The feature:** a developer can build a real form-in-a-card-in-a-dialog from the library alone.

**What we build**, each through the Block 2 template, each with meta, tests and a stranger test:
- **Badge:** variants `neutral | info | success | warning | danger`; renders as `<span>`; never
  conveys meaning by colour alone (a dot or text always present).
- **Input:** label required (the type makes `label` mandatory), `description`, `error` text wired
  with `aria-describedby` and `aria-invalid`, forwards `ref`, works inside a plain `<form>`.
- **Card:** `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`. Pure layout; heading
  level is a prop so it never breaks the page outline.
- **Dialog:** built on the native `<dialog>` element. Opens with `showModal`, closes on Escape,
  closes on backdrop click, returns focus to the trigger, `aria-labelledby` its title. Controlled
  (`open`, `onOpenChange`). No portal library, no focus-trap library: the browser does it.

**What you learn.** *The one new idea:* the native `<dialog>` element does what libraries used to do.
*Also:* `aria-describedby` wiring; compound components; making a prop mandatory through the type.

**Testing phase**

| ID | Proves |
|---|---|
| B3-T1 | Badge: every variant passes axe; each renders visible text; type test rejects an unknown variant |
| B3-T2 | Input: reachable by its label; `error` sets `aria-invalid` and the error text is announced via `aria-describedby`; passes axe with and without an error |
| B3-T3 | Input: type test says `<Input />` without a label is an error; `ref` reaches the `<input>`; typing updates a controlled value |
| B3-T4 | Card: renders the heading at the level given (`as="h2"`), passes axe, and slots render in order |
| B3-T5 | Dialog: opens on trigger, Escape closes it and `onOpenChange(false)` fires once, focus returns to the trigger |
| B3-T6 | Dialog: backdrop click closes; a click inside does not; the title is the accessible name |
| B3-T7 | Dialog: a form with an Input inside submits and closes; Tab cycles inside the dialog while open (if jsdom cannot do this, it moves to outside-Jest and the block note says so) |
| B3-T8 | The `/components` index lists exactly five, and each docs page passes axe |
| B3-T9 | Stranger test for all four (named check, block note). *Since Block 3:* `npm run stranger`, a script in `scripts/`, runs it for any or all of the five against the running site |

**Planted bugs:** drop `aria-describedby`; forget to return focus; let backdrop click close on inside clicks.

**Outside Jest:** the dialog on your Android, including the back gesture (should close it, it is
native); the Input with the Android keyboard open; all four stranger tests.

**Cut line:** Dialog's backdrop-click close (drops B3-T6's first half; Escape and the close button
remain). Never cut a component: the cap is five, not "up to five".

> **Summary:** Block 3 completes the five. A developer can now build an accessible form inside a card
> inside a dialog from copied code alone.
>
> **Gate:** "Block 3 is done. Shall I start the v1 release?"

## v1 release (after Block 3)

- Tag `v1.0.0` on GitHub. Vercel production URL is the site.
- The README gets the five components, the copy-paste instructions, and a link to the site.
- **The stranger who is not you** tries it. Their notes go to `docs/feedback/v1.md`.
- Post it in one place you already are (a dev Discord, X, or the Facebook dev groups you know).
  One place. Watch what the first ten visitors do with the copy button.
- Re-plan v2 with what you learned.

## v2 and v3 (sketch, re-planned when they start)

- **Block 4, the npm package:** `tsup` build, ESM + types, `peerDependencies` on React and Tailwind,
  a Tailwind preset so users get the CSS variables. The site adds an "Install" tab beside "Copy".
  This is the first block with a publish pipeline and the first time a mistake cannot be un-shipped.
- **Block 5, the theme page:** five CSS variables, live preview of all five components, copy the CSS.
- **Block 6, search and keyboard nav:** `/` focuses search, arrow keys move through results.
- **v3:** lift the cap to ten (one block, re-planned with real requests), a live playground,
  changelog and versioned docs.

## Decisions

| Needed by | Decision | My recommendation | Status |
|---|---|---|---|
| Block 0 | **Name** | **Umber.** A pseudonym, not a Tagalog word (the first pick, *Piyesa*, was rejected as cringe). npm `umber` was free on 2026-09-23. `umber.vercel.app` is taken, so Vercel assigns a longer subdomain until a custom domain is added | **decided 2026-09-23** |
| Block 0 | Distribution in v1 | Copy and paste from the site, npm in v2 | **decided** |
| Block 0 | The five components | Button, Badge, Input, Card, Dialog. Alternatives considered: Tabs, Toast, Tooltip, Select. Dialog stays because it is the one that teaches accessibility properly | **decided** |
| Block 0 | Styling | Tailwind 4 + CSS variables (the copy-paste model assumes Tailwind) | **decided** |
| Block 0 | Licence | MIT | **decided** |
| Block 0 gate | The one-sentence pitch and the three "why" points | Drafted in Block 1 above | waiting |
| Block 2 | Add Shiki | Yes: build-time highlighting, zero client JS. Themes github-light-default and github-dark-default, both 4.5:1 or better on Umber's surface | **decided 2026-09-30** ("continue with the block 2") |
| Block 4 | Package name, `tsup`, publish from CI or by hand | Re-planned at v2 | later |

## Known limits (on purpose)

- React only. No Vue, Svelte, or web components.
- Requires Tailwind in the user's project. No plain-CSS build in v1.
- Five components. A visitor who needs a Select leaves, and that is fine for v1.
- No theme toggle (system preference only), no search, no versioning until v2.
- Colour contrast is tested at the token level (B1-T9), not per rendered pixel. A colour written outside the tokens is not covered.

## Backlog

Anything cut, and every sixth-component idea: Tabs, Toast, Tooltip, Select, Checkbox, Switch,
Skeleton, Avatar. Nothing here is built until the v3 re-plan.

## Words used in this guide

| Word | Means |
|---|---|
| **Copy-paste model** | The user copies the component's source into their own project instead of installing a package. They own the code; there is nothing to update |
| **Dogfooding** | Using your own product to build your own product. Here: the site is built from the library |
| **Stranger test** | Pasting a component into a fresh app to prove it works with no help |
| **Props table** | The list of a component's inputs, their types, and defaults |
| **Variant** | A named visual style of a component (`primary`, `danger`) |
| **Compound component** | Several small components meant to be used together (`Card`, `CardHeader`) |
| **Native `<dialog>`** | The browser's built-in modal element, which handles focus, Escape and layering |
| **Peer dependency** | A package the library expects the user to already have (React), rather than bringing its own |

## Block note template (`docs/blocks/block-N.md`)

Same as Tantya, minus "Worked examples", plus a **Stranger test** section from Block 2.
