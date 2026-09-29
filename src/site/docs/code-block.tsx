import { CopyButton } from "@/site/copy-button";
import type { CodeFile } from "./load";

/** A highlighted file with its name and a copy button. `id` must be unique on the page. */
export function CodeBlock({ id, file }: { id: string; file: CodeFile }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="truncate font-mono text-xs text-muted">{file.path}</span>
        <CopyButton text={file.code} targetId={id} what={file.path} />
      </div>
      {/* Shiki's <pre> is focusable (tabindex=0), so keyboard users can scroll long files. */}
      <div id={id} className="umber-code" dangerouslySetInnerHTML={{ __html: file.html }} />
    </div>
  );
}
