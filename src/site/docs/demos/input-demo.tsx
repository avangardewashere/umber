"use client";

import { useState } from "react";
import { Input } from "@/ui/input";

const DESCRIPTION = "We only use it to send the invite.";
const ERROR = "Enter an email address, like ana@example.com.";

/** The Input preview: toggle the description, the error and disabled, and see the code for it. */
export function InputDemo() {
  const [description, setDescription] = useState(true);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState("");

  const attributes = [
    `label="Email address"`,
    `type="email"`,
    description && `description="${DESCRIPTION}"`,
    error && `error="${ERROR}"`,
    disabled && "disabled",
  ].filter(Boolean);
  const snippet = `<Input\n  ${attributes.join("\n  ")}\n/>`;

  return (
    <div className="overflow-hidden rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface">
      <div
        data-testid="input-preview"
        className="grid min-h-44 place-items-center bg-[radial-gradient(var(--umber-border)_1px,transparent_1px)] [background-size:14px_14px] p-8"
      >
        <div className="w-full max-w-xs">
          <Input
            label="Email address"
            type="email"
            autoComplete="off"
            placeholder="ana@example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            description={description ? DESCRIPTION : undefined}
            error={error ? ERROR : undefined}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-6 border-t border-border p-4 text-sm">
        {(
          [
            ["Description", description, setDescription],
            ["Error", error, setError],
            ["Disabled", disabled, setDisabled],
          ] as const
        ).map(([label, checked, set]) => (
          <label key={label} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => set(e.target.checked)}
              className="size-4 accent-(--umber-accent)"
            />
            {label}
          </label>
        ))}
      </div>
      <div className="overflow-x-auto border-t border-border px-4 py-3">
        <code data-testid="input-snippet" className="block font-mono text-xs whitespace-pre">
          {snippet}
        </code>
      </div>
    </div>
  );
}
