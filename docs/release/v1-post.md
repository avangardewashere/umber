# v1 launch post (draft)

Post it in **one** place you already are. Pick the version that fits, fill in the link, and watch what
the first ten visitors do with the copy button. Their first confused question starts the v2 re-plan.

## Short (X, Discord, a group chat)

> I made Umber: five accessible React components you copy into your project. Button, Badge, Input,
> Card, Dialog. No package, no updates to chase. Each one ships with its own tests, and the docs are
> generated from the code so they can't drift. Five on purpose; tell me which sixth you'd want.
> [link]

## Longer (a dev forum, Facebook dev group, a blog)

> **Umber: five React components, copy and paste, tests included**
>
> Most UI libraries are 60 components and an npm dependency. Umber is five, and you paste the file.
>
> - Button, Badge, Input, Card, Dialog. That's the whole library, on purpose, until a sixth is
>   actually asked for.
> - Every component passes an automated accessibility check and works with a keyboard alone. The
>   Input's label is required by the type: you can't forget it. The Dialog is the browser's own
>   `<dialog>`, no focus-trap library.
> - Each component ships with its Jest tests. Copy them with the code and your CI owns them.
> - The docs can't lie: the pages read the component files from disk at build time, and the props
>   tables come from the TypeScript types.
> - There's a "stranger test": a script pastes the code off the site into a fresh create-next-app and
>   builds it. It caught two real bugs that 110 passing unit tests missed.
>
> It needs React, Tailwind CSS 4 and two tiny helpers (clsx, tailwind-merge). No npm package yet; that's v2.
>
> I'd love one thing from you: open a component page, copy it into a project, and tell me the first
> moment you were confused. [link]

## What not to claim

- Not "production-ready for everyone": it has had one outside tester at most.
- Not "framework-agnostic": React only, Tailwind required.
- No download numbers, no comparisons to named libraries.
