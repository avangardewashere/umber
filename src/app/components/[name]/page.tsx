import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPONENTS, findComponent } from "@/site/catalog";
import { ComponentDocs } from "@/site/docs/component-docs";
import { DocsShell } from "@/site/docs/docs-shell";
import { loadDocs } from "@/site/docs/load";

// Only the five exist. Any other name is a 404, not a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ name: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[name]">): Promise<Metadata> {
  const { name } = await params;
  const component = findComponent(name);
  return component
    ? { title: component.name, description: `${component.name}: ${component.summary}` }
    : { title: "Not found" };
}

export default async function ComponentPage({ params }: PageProps<"/components/[name]">) {
  const { name } = await params;
  const component = findComponent(name);
  if (!component) notFound();
  const docs = await loadDocs(name);

  return (
    <DocsShell current={name}>
      {docs ? (
        <ComponentDocs docs={docs} />
      ) : (
        <section>
          <p className="font-mono text-xs text-muted">components/ui/{component.file}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{component.name}</h1>
          <p className="mt-3 max-w-prose text-muted">{component.summary}</p>
          <p className="mt-8 max-w-prose">
            The full documentation for {component.name} is being written. You can try it live on
            the{" "}
            <Link href="/" className="underline underline-offset-4">
              home page
            </Link>
            .
          </p>
        </section>
      )}
    </DocsShell>
  );
}
