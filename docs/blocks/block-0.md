# Block 0: Groundwork

Closed 2026-09-23. Repo: https://github.com/avangardewashere/umber

## What we built

| File | What it is |
|---|---|
| `src/app/globals.css` | The Umber tokens: 14 `--umber-*` CSS variables, defined once for light and once for dark, then handed to Tailwind through `@theme inline` so classes like `bg-accent` and `border-border` exist |
| `src/ui/cn.ts` | The one helper every component uses: `clsx` + `tailwind-merge`, so later Tailwind classes win a conflict |
| `src/site/shell.tsx` | Header (name, GitHub link), main, footer. Kept out of `layout.tsx` so a test can render it without `<html>` |
| `src/app/layout.tsx`, `src/app/page.tsx` | Root layout using the shell and Geist fonts; a placeholder page that Block 1 replaces |
| `eslint.config.mjs` | The wall: `no-restricted-imports` scoped to `src/ui/**`, blocking `@/site`, `@/app` and relative climbs into them |
| `jest.config.ts`, `jest.setup.ts` | Jest 30 through `next/jest`, jsdom by default, jest-dom and jest-axe matchers |
| `.github/workflows/ci.yml` | Lint, typecheck, test, build on every push |
| `LICENSE`, `README.md`, `.gitattributes` | MIT; the five-component cap written down; line endings pinned to LF |
| `docs/PLAN.md` | The build guide |

## The one new idea

*(Your words, after the walkthrough.)* The lint wall: `src/ui` is the product a stranger copies, so a
lint rule makes it impossible for a component to import anything from the website that shows it.

## Other ideas to take away

- Two colour blocks that must define the same list is a rule worth a test, because a missing dark
  token fails silently: the browser just uses the light value.
- ESLint start-up costs about 20 seconds on this PC. One run over five probe files instead of five
  runs took the suite from 166 s to 15 s.

## Decisions made

- Name **Umber**, chosen over *Piyesa*. npm `umber` free on 2026-09-23; `umber.vercel.app` taken.
- Default branch renamed from `master` (create-next-app's default) to `main`, matching the other projects.
- Dev server on port 3005, in the shared `.claude/launch.json`.
- The lint-wall test spawns ESLint as a child process. Jest's module system cannot `import()` the
  ESM config, so the Node API was not an option.

## Deviations from the plan

- `Shell` uses Next's `Link` for the home link instead of `<a>`: the Next lint rule requires it.
- Planted a third bug (removing the wall from the ESLint config) beyond the two planned, because
  B0-T2 is the block's most important test.
- No earlier tests exist, so none changed.

## Testing phase

| Row | Proves | File |
|---|---|---|
| B0-T1 | Shell renders the `Umber` h1; GitHub link is `target=_blank` with `noopener`; jest-axe clean | `src/site/shell.test.tsx` |
| B0-T2 | Lint wall: site and app imports inside `src/ui` are exactly one error each (alias and relative); `src/ui` and site-from-ui are clean | `src/ui/lint-wall.test.ts` |
| B0-T3 | `cn()` merges, drops falsy, later class wins, accepts arrays/objects, empty input | `src/ui/cn.test.ts` |
| B0-T4 | Light and dark define exactly the same `--umber-*` list, no duplicates, core tokens present | `src/app/tokens.test.ts` |
| B0-T5 | CI green: lint, typecheck, test, build | `.github/workflows/ci.yml`; run [35796418974](https://github.com/avangardewashere/umber/actions/runs/35796418974), success in 50 s |

`npm test`: 4 suites, 16 tests, green in 15 s. `npm run lint`, `npm run typecheck`, `npm run build`: green.

## How we know the tests work

| Planted bug | Result |
|---|---|
| `cn()` reverses its inputs so earlier classes win | 4 of 5 `cn` tests failed |
| `--umber-ring` deleted from the dark block | 1 of 3 token tests failed ("light and dark define exactly the same token list") |
| The wall block removed from `eslint.config.mjs` | 3 of 5 lint-wall tests failed |

Each file was restored after its run and the suite went green again.

## Checked outside Jest

| Check | Result |
|---|---|
| Desktop Chrome, dark: shell renders, no console errors | ✅ Claude |
| Desktop Chrome, light, phone width (375 px): renders, no horizontal scroll (scrollWidth 375 = innerWidth 375), body background `#faf7f2`, text `#1c1917` | ✅ Claude |
| Text contrast in both themes (DevTools) | ⏭️ to be checked in Block 1 when there is real text on the page |
| Preview link on your Android | ⏭️ Vercel not connected yet (you do this; see Gate) |

## Deliberately NOT in this block

Any component. The landing page. A theme toggle (system preference only until v2). Vercel connection
(needs your dashboard login).

## Summary

Block 0 built the workshop: a Next.js 16 app with Jest, jest-axe, CI and a public repo, the Umber
colour tokens in light and dark, a page shell, and a lint wall that keeps the library from ever
importing the website. Sixteen tests, three planted bugs caught.

## Gate

*(Filled in when you answer.)*
