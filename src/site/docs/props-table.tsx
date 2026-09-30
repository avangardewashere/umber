import type { PropDoc } from "./props";

/** The props table, built from the component's own types (see props.ts). */
export function PropsTable({
  props,
  element,
  name,
  note,
}: {
  props: PropDoc[];
  element: string;
  name: string;
  note?: string;
}) {
  return (
    <div
      role="region"
      aria-label={`${name} props`}
      tabIndex={0}
      className="overflow-x-auto rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface"
    >
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="border-b border-border px-4 py-3 text-left text-sm text-muted">
          {note ?? (
            <>
              Props {name} adds. Every native <code className="font-mono text-fg">&lt;{element}&gt;</code>{" "}
              prop, including <code className="font-mono text-fg">ref</code>, also works.
            </>
          )}
        </caption>
        <thead>
          <tr className="border-b border-border text-xs text-muted">
            <th scope="col" className="px-4 py-2 font-medium">Prop</th>
            <th scope="col" className="px-4 py-2 font-medium">Type</th>
            <th scope="col" className="px-4 py-2 font-medium">Default</th>
            <th scope="col" className="px-4 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-border align-top last:border-b-0">
              <th scope="row" className="px-4 py-3 font-mono text-[13px] font-medium whitespace-nowrap">
                {p.name}
                {p.required ? <span className="text-danger"> (required)</span> : null}
              </th>
              <td className="px-4 py-3 font-mono text-[13px] text-muted">{p.type}</td>
              <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap text-muted">
                {p.defaultValue ?? "–"}
              </td>
              <td className="px-4 py-3 text-pretty text-muted">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
