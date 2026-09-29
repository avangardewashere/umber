"use client";

import { useState } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/ui/button";
import { Choice } from "./choice";

const VARIANTS = ["primary", "secondary", "ghost", "danger"] as const satisfies readonly ButtonVariant[];
const SIZES = ["sm", "md", "lg"] as const satisfies readonly ButtonSize[];

/** The Button preview: pick a variant, a size and loading, and see the code for it. */
export function ButtonDemo() {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("md");
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);

  const attributes = [
    variant !== "primary" && `variant="${variant}"`,
    size !== "md" && `size="${size}"`,
    loading && "loading",
  ].filter(Boolean);
  const snippet = `<Button${attributes.length ? ` ${attributes.join(" ")}` : ""}>Save changes</Button>`;

  return (
    <div className="overflow-hidden rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface">
      <div
        data-testid="button-preview"
        className="grid min-h-44 place-items-center gap-3 bg-[radial-gradient(var(--umber-border)_1px,transparent_1px)] [background-size:14px_14px] p-8"
      >
        <Button variant={variant} size={size} loading={loading} onClick={() => setClicks((n) => n + 1)}>
          Save changes
        </Button>
        <p aria-live="polite" className="text-xs text-muted">
          {clicks === 0 ? "Not clicked yet" : `Clicked ${clicks} ${clicks === 1 ? "time" : "times"}`}
        </p>
      </div>
      <div className="grid gap-5 border-t border-border p-4 sm:grid-cols-[auto_auto_1fr] sm:gap-8">
        <Choice legend="Variant" name="button-variant" options={VARIANTS} value={variant} onChange={setVariant} />
        <Choice legend="Size" name="button-size" options={SIZES} value={size} onChange={setSize} />
        <label className="flex items-center gap-2 self-end pb-1 text-sm">
          <input
            type="checkbox"
            checked={loading}
            onChange={(e) => setLoading(e.target.checked)}
            className="size-4 accent-(--umber-accent)"
          />
          Loading
        </label>
      </div>
      <div className="overflow-x-auto border-t border-border px-4 py-3">
        <code data-testid="button-snippet" className="font-mono text-xs whitespace-pre">
          {snippet}
        </code>
      </div>
    </div>
  );
}
