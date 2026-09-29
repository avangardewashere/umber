import Link from "next/link";
import { Badge } from "@/ui/badge";
import { buttonStyles } from "@/ui/button-styles";
import { COMPONENTS } from "@/site/catalog";
import { CopyButton } from "@/site/copy-button";
import { REPO_URL } from "@/site/shell";
import { Specimen } from "./specimen";

export const SNIPPET = `import { Button } from "@/components/ui/button";

export function SaveButton() {
  return (
    <Button variant="primary" type="submit">
      Save changes
    </Button>
  );
}`;

const WHY = [
  {
    title: "Accessible by default",
    body: "Every component passes an automated axe check and works with a keyboard alone. Labels are required, not suggested.",
  },
  {
    title: "Tests included",
    body: "Each component ships with its Jest tests. Copy them with the code, and your CI checks the parts you now own.",
  },
  {
    title: "Nothing to install",
    body: "React, Tailwind and two tiny helpers, clsx and tailwind-merge. No package, no wrapper, no version to keep up with.",
  },
];

/** The landing page. Built only from Umber's own five components. */
export function Landing() {
  return (
    <div className="flex flex-col gap-24 pb-12 sm:gap-32">
      <section
        aria-labelledby="hero-title"
        className="grid items-center gap-12 pt-2 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-16"
      >
        <div>
          <Badge>Five components · MIT</Badge>
          <h1
            id="hero-title"
            className="mt-6 text-6xl font-semibold tracking-tighter sm:text-8xl"
          >
            Umber
          </h1>
          <p className="mt-5 max-w-xl text-2xl leading-snug font-medium text-balance sm:text-3xl">
            Five accessible React components. <span className="text-muted">Copy, paste, ship.</span>
          </p>
          <p className="mt-5 max-w-lg text-pretty text-muted">
            Each component is one file you own, with its tests beside it. No package to install and
            nothing to update.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/components" className={buttonStyles({ size: "lg" })}>
              Browse components
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              GitHub
            </a>
          </div>
        </div>

        <figure className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-3 -inset-y-6 rounded-[2rem] sm:-inset-6 bg-[radial-gradient(var(--umber-border-strong)_1px,transparent_1px)] [background-size:14px_14px] opacity-40 [mask-image:radial-gradient(closest-side,black,transparent)]"
          />
          <Specimen />
          <figcaption className="relative mt-4 text-center text-xs text-muted">
            Live, not a screenshot. Every control above is an Umber component.
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="copy-title"
        className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-16"
      >
        <div>
          <h2 id="copy-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Copy it. Own it.
          </h2>
          <p className="mt-4 max-w-md text-pretty text-muted">
            Paste the file next to your code and change whatever you like. There is no wrapper to
            fight, because there is no package.
          </p>
        </div>
        <div className="min-w-0 overflow-hidden rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
            <span className="font-mono text-xs text-muted">save-button.tsx</span>
            <CopyButton text={SNIPPET} targetId="snippet-code" />
          </div>
          <pre
            tabIndex={0}
            aria-label="Code example"
            className="overflow-x-auto p-4 text-[13px] leading-relaxed sm:text-sm"
          >
            <code id="snippet-code" className="font-mono">
              {SNIPPET}
            </code>
          </pre>
        </div>
      </section>

      <section aria-labelledby="five-title">
        <h2 id="five-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Five parts. That&apos;s the whole library.
        </h2>
        <p className="mt-4 max-w-xl text-pretty text-muted">
          Each one does a single job properly. A sixth waits until these five are right.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMPONENTS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/components/${c.slug}`}
                className="flex h-full flex-col rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface p-5 transition-colors hover:border-border-strong"
              >
                <span className="font-mono text-xs text-muted">{c.file}</span>
                <span className="mt-6 text-lg font-semibold">{c.name}</span>
                <span className="mt-1 text-sm text-pretty text-muted">{c.summary}</span>
              </Link>
            </li>
          ))}
          <li>
            <a
              href={`${REPO_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col justify-end rounded-[calc(var(--umber-radius)*1.5)] border border-dashed border-border-strong p-5 text-sm text-muted transition-colors hover:text-fg"
            >
              <span className="text-lg font-semibold text-fg">A sixth?</span>
              <span className="mt-1">Tell us which one you need. Requests shape the next version.</span>
            </a>
          </li>
        </ul>
      </section>

      <section aria-labelledby="why-title">
        <h2 id="why-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Why Umber
        </h2>
        <ul className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {WHY.map((w) => (
            <li key={w.title} className="border-t border-border-strong pt-5">
              <h3 className="font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-pretty text-muted">{w.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
