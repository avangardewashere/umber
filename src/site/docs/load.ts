import type { ComponentType } from "react";
import { findComponent } from "@/site/catalog";
import { highlight } from "./highlight";
import { extractProps, type PropDoc } from "./props";
import { DOCS } from "./registry";
import { readRepoFile, tokensCss, userPath } from "./source";

export type CodeFile = { path: string; code: string; html: string };

export type DocsData = {
  slug: string;
  name: string;
  summary: string;
  element: string;
  propsNote?: string;
  accessibility: string[];
  props: PropDoc[];
  /** The files to copy, main file first. */
  sources: CodeFile[];
  tests: CodeFile;
  Demo: ComponentType;
};

async function codeFile(repoPath: string): Promise<CodeFile> {
  const code = readRepoFile(repoPath);
  const lang = repoPath.endsWith(".tsx") ? "tsx" : "ts";
  return { path: userPath(repoPath), code, html: await highlight(code, lang) };
}

/** Everything a component's docs page shows, read from the code at build time. */
export async function loadDocs(slug: string): Promise<DocsData | null> {
  const entry = DOCS[slug];
  const catalog = findComponent(slug);
  if (!entry || !catalog) return null;

  const [tests, ...sources] = await Promise.all([entry.testFile, ...entry.files].map(codeFile));
  return {
    slug,
    name: catalog.name,
    summary: catalog.summary,
    element: entry.meta.element,
    propsNote: entry.meta.propsNote,
    accessibility: entry.meta.accessibility,
    props: extractProps(entry.files[0], entry.meta.propsType),
    sources,
    tests,
    Demo: entry.Demo,
  };
}

export type SetupData = { install: CodeFile; tokens: CodeFile; cn: CodeFile };

export const INSTALL_COMMAND = "npm install clsx tailwind-merge";

/** The one-time setup every component needs. */
export async function loadSetup(): Promise<SetupData> {
  const tokens = tokensCss();
  const [installHtml, tokensHtml, cn] = await Promise.all([
    highlight(INSTALL_COMMAND, "bash"),
    highlight(tokens, "css"),
    (async () => {
      const code = readRepoFile("src/ui/cn.ts");
      return { path: userPath("src/ui/cn.ts"), code, html: await highlight(code, "ts") };
    })(),
  ]);
  return {
    install: { path: "Terminal", code: INSTALL_COMMAND, html: installHtml },
    tokens: { path: "app/globals.css", code: tokens, html: tokensHtml },
    cn,
  };
}
