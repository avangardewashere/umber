import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/site/catalog";
import { CodeBlock } from "@/site/docs/code-block";
import { DocsShell } from "@/site/docs/docs-shell";
import { loadSetup } from "@/site/docs/load";

export const metadata: Metadata = {
  title: "Components",
  description: "The five Umber components, and the one-time setup they share.",
};

export default async function ComponentsPage() {
  const setup = await loadSetup();

  return (
    <DocsShell>
      <div className="flex flex-col gap-14">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
          <p className="mt-3 max-w-prose text-pretty text-muted">
            Five, on purpose. Set up once, then copy any of them into your project.
          </p>
        </header>

        <ul className="grid gap-3 sm:grid-cols-2">
          {COMPONENTS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/components/${c.slug}`}
                className="flex h-full flex-col rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface p-5 transition-colors hover:border-border-strong"
              >
                <span className="text-lg font-semibold">{c.name}</span>
                <span className="mt-1 text-sm text-pretty text-muted">{c.summary}</span>
              </Link>
            </li>
          ))}
        </ul>

        <section id="setup" aria-labelledby="setup-title" className="scroll-mt-6">
          <h2 id="setup-title" className="text-2xl font-semibold tracking-tight">
            Set up once
          </h2>
          <p className="mt-3 max-w-prose text-pretty text-muted">
            For a React project with Tailwind CSS 4 and TypeScript, such as a new{" "}
            <code className="font-mono text-fg">create-next-app</code>. Every component uses these
            three things.
          </p>
          <ol className="mt-8 grid grid-cols-1 gap-10">
            <li className="min-w-0">
              <h3 className="font-semibold">1. Install the two helpers</h3>
              <div className="mt-3">
                <CodeBlock id="setup-install" file={setup.install} />
              </div>
            </li>
            <li className="min-w-0">
              <h3 className="font-semibold">2. Add the Umber tokens to your global CSS</h3>
              <p className="mt-1 max-w-prose text-sm text-pretty text-muted">
                Paste them after <code className="font-mono text-fg">@import &quot;tailwindcss&quot;;</code>.
                Change the values to rebrand every component at once.
              </p>
              <div className="mt-3">
                <CodeBlock id="setup-tokens" file={setup.tokens} />
              </div>
            </li>
            <li className="min-w-0">
              <h3 className="font-semibold">3. Add cn.ts</h3>
              <p className="mt-1 max-w-prose text-sm text-pretty text-muted">
                Save it as <code className="font-mono text-fg">{setup.cn.path}</code>. Components go
                in the same folder.
              </p>
              <div className="mt-3">
                <CodeBlock id="setup-cn" file={setup.cn} />
              </div>
            </li>
          </ol>
        </section>
      </div>
    </DocsShell>
  );
}
