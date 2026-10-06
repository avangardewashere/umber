# Umber

Five accessible React components you copy into your project. No package to install, nothing to
update: each component is one file you own, with its tests beside it.

**Site:** https://umber-green-rho.vercel.app · **Licence:** MIT

| Component | What it does |
|---|---|
| **Button** | Four variants, three sizes, always a real `<button>`. `loading` keeps keyboard focus instead of dropping it |
| **Badge** | Short status labels that never rely on colour alone |
| **Input** | A label you cannot forget (the type requires it), and errors wired for screen readers |
| **Card** | Header, content and footer, with the heading level you choose |
| **Dialog** | The browser's own `<dialog>`: focus trap, Escape and backdrop built in, reported to you exactly once |

**The cap:** Umber holds exactly five components until v2. Want a sixth? Open an issue and say which.

## Use it

For a React project with Tailwind CSS 4 and TypeScript, such as a new `create-next-app`.

1. **Install the two helpers.**
   ```bash
   npm install clsx tailwind-merge
   ```
2. **Add the Umber tokens** to your global CSS, after `@import "tailwindcss";`. The site's
   *Components → Set up once* shows them with a copy button. Change the values to rebrand everything.
3. **Add `components/ui/cn.ts`**, also from *Set up once*.
4. **Copy any component** from its page into `components/ui/`. Button is two files
   (`button.tsx` and `button-styles.ts`); the rest are one. Copy its test file too if you want it.

Every file on the site is the exact file this repo runs. A script proves it: see below.

## What makes it different

- **Accessible by default.** Every component passes an automated axe check and works with a keyboard
  alone. Labels are required, not suggested. Colour contrast is tested at the token level in both themes.
- **Tests included.** Each component ships with its Jest tests. Copy them with the code.
- **Docs that cannot lie.** The docs pages read the component files from disk at build time, and the
  props tables are generated from the TypeScript types.
- **The stranger test.** `npm run stranger` takes the code off the running site exactly as shown,
  pastes it into a fresh `create-next-app` nobody has touched, and builds it. It has found two real
  bugs that 110 passing tests could not see.

## Working on it

```bash
npm install
npm run dev          # http://localhost:3005
npm test             # Jest: components, pages, contrast, the lint wall
npm run lint
npm run typecheck    # also checks the @ts-expect-error lines in the shipped tests
npm run build
npm run stranger     # needs `npm run dev` running; see scripts/stranger-test.mjs
```

`src/ui/` is the library, flat: one file per component plus `cn.ts`. An ESLint rule stops it
importing anything from the website (`src/site/`, `src/app/`), so a copied component never drags the
site along. The build guide, with every block's tests and decisions, is in [docs/PLAN.md](docs/PLAN.md);
each block's note is in [docs/blocks/](docs/blocks/).

Built with Next.js 16, React 19, Tailwind CSS 4 and TypeScript. Highlighting by Shiki.
