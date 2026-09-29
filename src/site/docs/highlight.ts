export type CodeLanguage = "tsx" | "ts" | "css" | "bash";

/**
 * Syntax highlighting at build time. The HTML carries both theme colours as CSS variables;
 * globals.css picks one to match the page. Both themes were checked at 4.5:1 or better on
 * Umber's surface colour for every token colour in the component sources.
 *
 * Shiki is loaded only when something is highlighted. Importing the docs route (as the landing
 * page tests do, to list its paths) must not load it: Shiki is ESM-only and Jest cannot run it.
 */
export async function highlight(code: string, lang: CodeLanguage): Promise<string> {
  const { codeToHtml } = await import("shiki");
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: false,
  });
}
