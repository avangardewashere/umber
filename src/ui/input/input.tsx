"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "../cn";

export type InputProps = ComponentProps<"input"> & {
  /** Required. Every input needs a visible label; the type makes it impossible to forget. */
  label: string;
  /** Help text under the field, read out by screen readers after the label. */
  description?: string;
  /** Error text. Marks the field invalid and is read out by screen readers. */
  error?: string;
};

export function Input({ label, description, error, id, className, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div data-slot="input" className="grid gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-10 w-full min-w-0 rounded-umber border border-border-strong bg-surface px-3 text-sm text-fg",
          "placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
          "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
          className,
        )}
        {...props}
      />
      {description ? (
        <p id={descriptionId} className="text-xs text-muted">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
