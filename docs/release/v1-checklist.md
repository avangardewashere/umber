# v1 release checklist

From the guide's "v1 release (after Block 3)". Prepared 2026-10-07 on branch `v1-release`.

| Step | Who | Status |
|---|---|---|
| Blocks 0 to 3 built, each with its tests green and its block note | Claude | ✅ done (PRs #1, #2, #3) |
| Merge PRs #1, #2, #3, #4 into `main`, in order | **You** (merging is blocked for Claude) | ⏳ still open on 2026-10-07; the live site shows Block 0 until this is done |
| Connect Vercel: import `avangardewashere/umber`, default Next.js settings | **You** | ✅ 2026-10-07, https://umber-green-rho.vercel.app (deploys `main`) |
| Put the production URL in `README.md` (the *Site:* line) and in `docs/PLAN.md` | Claude | ✅ this branch |
| On your Android: landing page, a component page, Copy, open the Dialog and close it with the back gesture, paste the link into Messenger for the preview card | **You** | ⏳ |
| Tag `v1.0.0` and create the GitHub release (`gh release create v1.0.0 --generate-notes`) | Claude, after the merges | ⏳ |
| README updated with the five, the copy steps, the stranger test | Claude | ✅ this branch |
| Launch post drafted (`docs/release/v1-post.md`) | Claude | ✅ this branch |
| **The stranger who is not you:** one developer opens the site cold and copies one component. Their notes go to `docs/feedback/v1.md` | **You** find them; Claude writes up the notes | ⏳ |
| Post in one place, then watch the first ten visitors | **You** | ⏳ |
| Re-plan v2 with what the stranger said | Claude, after the feedback | ⏳ |

## Known at release

- Copy-paste only; `npm install umber` is v2.
- React only; Tailwind CSS 4 required.
- No theme toggle (system preference), no search, no versioned docs.
- Full test suite on the dev laptop needs the dev server stopped (see `docs/blocks/block-3.md`).
