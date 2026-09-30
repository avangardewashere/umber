import type { Metadata } from "next";
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
  if (!docs) notFound();

  return (
    <DocsShell current={name}>
      <ComponentDocs docs={docs} />
    </DocsShell>
  );
}
