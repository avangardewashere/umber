import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/site/catalog";

export const metadata: Metadata = { title: "Components" };

// Placeholder index until Block 2 builds the docs pages.
export default function ComponentsPage() {
  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
      <p className="mt-3 max-w-prose text-muted">
        Five, on purpose. Full documentation for each one is on its way. Until then, all five are
        live on the home page.
      </p>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {COMPONENTS.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/components/${c.slug}`}
              className="flex flex-col gap-1 py-4 hover:text-accent sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="w-24 shrink-0 font-medium">{c.name}</span>
              <span className="text-sm text-muted">{c.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
