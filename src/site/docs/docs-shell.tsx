import type { ReactNode } from "react";
import Link from "next/link";
import { COMPONENTS } from "@/site/catalog";
import { cn } from "@/ui/cn";

/** The docs layout: the five in a side nav (a scrolling row on phones), and the page beside it. */
export function DocsShell({ current, children }: { current?: string; children: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Components" className="lg:sticky lg:top-6 lg:self-start">
        <Link
          href="/components"
          aria-current={current === undefined ? "page" : undefined}
          className="text-xs font-medium tracking-wide text-muted uppercase hover:text-fg aria-[current=page]:text-fg"
        >
          Components
        </Link>
        <ul className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1 lg:flex-col lg:overflow-visible">
          {COMPONENTS.map((c) => {
            const isCurrent = c.slug === current;
            return (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/components/${c.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "block rounded-umber px-3 py-1.5 text-sm transition-colors",
                    isCurrent ? "bg-fg/5 font-medium text-fg" : "text-muted hover:bg-fg/5 hover:text-fg",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
