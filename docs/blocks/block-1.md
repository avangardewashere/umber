# Block 1: Landing page

Built 2026-09-29 on branch `block-1-landing`. You said "continue with the block 1", which I took as
your yes to the drafted pitch and the three "why" points.

## What we built

| File | What it is |
|---|---|
| `src/site/landing/landing.tsx` | The landing page: hero, the copy strip, the five, and "Why Umber". Built only from Umber's own components |
| `src/site/landing/specimen.tsx` | The live card in the hero. A working invite form (validates, reports success), a pending invite with Resend, and Revoke, which asks first in a real dialog |
| `src/site/copy-button.tsx` | Copies the snippet. "Copied" for two seconds; if the browser refuses, it selects the code and says "Press Ctrl+C" |
| `src/site/catalog.ts` | The five: slug, name, file, one-line summary. The cap lives here, pinned by a test |
| `src/ui/button`, `badge`, `input`, `card`, `dialog` | The five components in a first working form. Blocks 2 and 3 finish, document and fully test them |
| `src/app/layout.tsx` | Site metadata: title template, description, Open Graph and Twitter fields, and a base URL that follows Vercel's production URL |
| `src/app/opengraph-image.tsx` | The link-preview picture, drawn in code and generated at build time |
| `src/app/components/page.tsx`, `components/[name]/page.tsx` | Placeholder docs routes so the five cards never lead to a 404. Only the five names exist; anything else is a 404 |
| `src/app/globals.css` | New `--umber-border-strong` token for input outlines, and a visible focus ring on every focusable element |
| `jest.setup.ts` | A stand-in for `<dialog>`'s methods, which jsdom lacks |

## The one new idea

*(Your words, after the walkthrough.)* Dogfooding as a constraint: the landing page may only use the
five components, so it is the components' first real user. It found a real bug in Dialog on day one.

## Other ideas to take away

- A link that navigates stays an `<a>`, even when it looks like a button. `buttonStyles()` gives a
  link the button look without lying to screen readers about what it is.
- The copy button's accessible name is "Copy code" while its visible text is just "Copy": the word
  "code" is in a visually hidden span, so the visible label is part of the spoken one.
- The browser can close a `<dialog>` by itself. A controlled component has to listen for every way
  that can happen, not just the one you expect.

## Decisions made

- **Pitch and "why" points** as drafted in the guide, with your "continue" as the yes.
- **Live card story:** an invite form plus a pending invite, so all four Button variants, three Badge
  variants, an Input with a working error, a Card and a Dialog appear naturally, not as a swatch board.
- **Open Graph image generated in code** (`opengraph-image.tsx`) instead of a static PNG. No image
  editor needed, and it is rebuilt if the text changes.
- **`--umber-border-strong`** added: `#8f857a` light, `#766c62` dark. The plain border is only 1.4:1,
  fine for decoration but too faint for an input's outline, which needs 3:1.
- **A sixth grid cell** on the landing page links to GitHub issues ("A sixth? Tell us which"). It fills
  the three-column grid and sends sixth-component ideas where the cap says they go.
- **Placeholder docs routes** for the five, so the cards work now. Block 2 replaces them.

## Deviations from the plan

- **Added B1-T9, a contrast test.** Block 0 deferred contrast to Block 1. Instead of a one-off DevTools
  check, a test now computes WCAG ratios from the token values in both themes. That changes a
  "Known limits" line in the guide: contrast is now tested at the token level.
- **Added a regression test to B1-T3** for the Dialog bug below.
- **Fixed a real bug in Dialog.** In Chrome, Escape fired `cancel` and closed the dialog, but `close`
  never arrived, so React still thought it was open and Revoke stopped working. Dialog now treats
  `cancel` and `close` as close requests and reports once. Block 3 still owns the full Dialog tests.
- **B1-T7 checks that the Open Graph image file exists, not what it draws.** The image renderer
  cannot run inside Jest. The picture was checked in the browser (below).
- No earlier test changed. Block 0's tests all pass unchanged, including B0-T1, which renders the new
  home page.

## Testing phase

| Row | Proves | File |
|---|---|---|
| B1-T1 | Exactly one h1, it says "Umber"; jest-axe clean on the whole page | `src/site/landing/landing.test.tsx` |
| B1-T2 | "Browse components" links to `/components`; "GitHub" links to the repo, new tab, `noopener` | same |
| B1-T3 | Live card has all four Button variants, an Input found by its label, a Badge, and a dialog trigger that opens a named dialog; Keep invite closes it; the form really validates and reports; **regression:** after a `cancel` with no `close`, the dialog opens again | same |
| B1-T4 | Copy writes the exact snippet, shows "Copied", still "Copied" at 1,999 ms, back to "Copy code" at 2,000 ms | same |
| B1-T5 | Clipboard refuses: shows "Press Ctrl+C", announces the failure, selects exactly the snippet, no throw | same |
| B1-T6 | The cap list is exactly the five in order; the five cards link to their pages; the docs route exists for exactly the five | same |
| B1-T7 | Title and template, description naming all five, Open Graph and Twitter fields, base URL; image file exists | `src/app/metadata.test.ts` |
| B1-T8 | Tab order: Browse components, GitHub, email, Cancel, Send invite, Resend, Revoke, Copy code | `src/site/landing/landing.test.tsx` |
| B1-T9 *(added)* | Contrast in both themes: text 4.5:1 on backgrounds, button text on its fill, badge text on its tint; ring and input outline 3:1 | `src/app/contrast.test.ts` |

`npm test`: 7 suites, 67 tests, green. A warm run takes about a minute; a cold run about three,
mostly compilation and the axe checks. `npm run lint`, `npm run typecheck`, `npm run build`: green.
CI: see the pull request.

## How we know the tests work

| Planted bug | Result |
|---|---|
| GitHub hero link without `rel="noopener"` | 1 landing test failed (B1-T2) |
| "Copied" never resets (the `setTimeout` removed) | 1 landing test failed (B1-T4) |
| "Copy it. Own it." made a second h1 | 1 landing test failed (B1-T1) |
| Light `--umber-muted` made paler (`#a39a90`) | 2 contrast tests failed (B1-T9) |
| Dialog without `onCancel` (the real bug, put back) | the regression test failed (B1-T3) |

Each file was restored and compared byte for byte with its backup; the suite went green again.

## Checked outside Jest

| Check | Result |
|---|---|
| Desktop Chrome, 1280 px, light: hero renders as designed, no console errors | ✅ Claude |
| Real `<dialog>` in Chrome: opens modal, focus moves inside, Escape closes, focus returns to Revoke, reopens after Escape, backdrop click closes, click inside does not | ✅ Claude (after the fix) |
| Copy button in Chrome: the pane refused clipboard access, so the failure path ran: "Press Ctrl+C", code selected, failure announced | ✅ Claude (failure path) |
| Copy button success path in a real browser | ⏭️ Your Android check. Jest covers it; the pane could not |
| Phone width (360 px), light and dark: no horizontal scroll; the code block scrolls inside itself; dark tokens apply | ❌ **Corrected in Block 2.** I compared the page width with a viewport the browser had already widened to 368 px, so I missed that the dot pattern behind the live card stuck out 8 px. Fixed in Block 2; now exactly 360 px |
| Open Graph image: served as PNG, 1200×630, looks right | ✅ Claude |
| `/components/select` is a 404; the five docs routes and `/components` are 200 | ✅ Claude |
| Colour contrast | ✅ now a test (B1-T9) |
| Preview link on your Android, and the Messenger link preview | ⏭️ Vercel not connected yet |

## Deliberately NOT in this block

Finished, documented components (Blocks 2 and 3). Syntax highlighting (Shiki, Block 2). A theme
toggle. Real docs pages. Any claim on the page that a test does not back.

## Summary

Block 1 ships the front door: a landing page built only from Umber's five components, with a working
live example, a copy button tested to work and to fail gracefully, link-preview metadata, and a
contrast test for every colour pairing. Using the components for real found and fixed a Dialog bug
before any stranger could.

## Gate

*(Filled in when you answer.)*
