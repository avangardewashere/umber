"use client";

import { useState } from "react";
import { Badge, type BadgeVariant } from "@/ui/badge";
import { Choice } from "./choice";

const VARIANTS = ["neutral", "info", "success", "warning", "danger"] as const satisfies readonly BadgeVariant[];
const SAMPLE: Record<BadgeVariant, string> = {
  neutral: "Draft",
  info: "Beta",
  success: "3 seats left",
  warning: "Pending",
  danger: "Revoked",
};

/** The Badge preview: pick a variant and see the code for it. */
export function BadgeDemo() {
  const [variant, setVariant] = useState<BadgeVariant>("neutral");
  const text = SAMPLE[variant];
  const snippet = `<Badge${variant === "neutral" ? "" : ` variant="${variant}"`}>${text}</Badge>`;

  return (
    <div className="overflow-hidden rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface">
      <div
        data-testid="badge-preview"
        className="grid min-h-44 place-items-center bg-[radial-gradient(var(--umber-border)_1px,transparent_1px)] [background-size:14px_14px] p-8"
      >
        <Badge variant={variant} className="text-sm">
          {text}
        </Badge>
      </div>
      <div className="border-t border-border p-4">
        <Choice legend="Variant" name="badge-variant" options={VARIANTS} value={variant} onChange={setVariant} />
      </div>
      <div className="overflow-x-auto border-t border-border px-4 py-3">
        <code data-testid="badge-snippet" className="font-mono text-xs whitespace-pre">
          {snippet}
        </code>
      </div>
    </div>
  );
}
