import type { ReactNode } from "react";
import Link from "next/link";

export const REPO_URL = "https://github.com/avangardewashere/umber";

/**
 * The page shell: header, main area, footer. Used by the root layout.
 * Kept out of layout.tsx so it can be rendered in a test without <html>.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <nav
          aria-label="Main"
          className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3"
        >
          <Link href="/" className="font-semibold tracking-tight">
            Umber
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-fg"
          >
            GitHub
          </a>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 text-sm text-muted">
          <span>MIT licence</span>
          <span>Built with its own five components</span>
        </div>
      </footer>
    </div>
  );
}
