import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "./code-block";
import type { DocsData } from "./load";
import { PropsTable } from "./props-table";

/** A stable element id for a file's code block: "components/ui/button.tsx" becomes "code-button-tsx". */
export function codeId(filePath: string): string {
  return `code-${filePath.split("/").pop()!.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-6">
      <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** One component's docs page. Everything on it comes from the component's own files. */
export function ComponentDocs({ docs }: { docs: DocsData }) {
  const { Demo } = docs;
  return (
    <article className="flex flex-col gap-14">
      <header>
        <p className="font-mono text-xs text-muted">{docs.sources[0].path}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{docs.name}</h1>
        <p className="mt-3 max-w-prose text-pretty text-muted">{docs.summary}</p>
        <p className="mt-5 max-w-prose rounded-umber border border-border bg-surface px-4 py-3 text-sm text-muted">
          First Umber component in this project? It needs <code className="font-mono text-fg">cn.ts</code>,
          the Umber tokens, and two small packages.{" "}
          <Link href="/components#setup" className="font-medium text-fg underline underline-offset-4">
            Set up once
          </Link>
          .
        </p>
      </header>

      <Section id="preview" title="Preview">
        <Demo />
      </Section>

      <Section id="code" title="Code">
        <p className="mb-4 max-w-prose text-sm text-pretty text-muted">
          {docs.sources.length === 1 ? "Save this file" : `Save these ${docs.sources.length} files`} in{" "}
          <code className="font-mono text-fg">components/ui/</code>, next to{" "}
          <code className="font-mono text-fg">cn.ts</code>. They are the exact files this site runs.
        </p>
        <div className="grid grid-cols-1 gap-4">
          {docs.sources.map((file) => (
            <CodeBlock key={file.path} id={codeId(file.path)} file={file} />
          ))}
        </div>
      </Section>

      <Section id="props" title="Props">
        <PropsTable props={docs.props} element={docs.element} name={docs.name} note={docs.propsNote} />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul className="grid max-w-prose gap-3 text-sm text-pretty">
          {docs.accessibility.map((point) => (
            <li key={point} className="border-l-2 border-border-strong pl-4">
              {point}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="tests" title="Tests included">
        <p className="mb-4 max-w-prose text-sm text-pretty text-muted">
          Save this as <code className="font-mono text-fg">{docs.tests.path}</code>. It runs with Jest
          in a jsdom environment, React Testing Library, user-event, jest-dom and jest-axe.
        </p>
        <CodeBlock id={codeId(docs.tests.path)} file={docs.tests} />
      </Section>
    </article>
  );
}
