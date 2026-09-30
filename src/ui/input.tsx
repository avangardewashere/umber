"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "./cn";

/** The props Input adds. Every native <input> prop, including `ref`, also works. */
export type InputOwnProps = {
  /**
   * The visible label. Required: the type makes an unlabelled input impossible to write.
   */
  label: string;
  /**
   * Help text under the field. Screen readers read it after the label.
   */
  description?: string;
  /**
   * The error to show. Sets `aria-invalid` and is read by screen readers when the field is focused.
   * Pass it only when there is an error; an empty string means no error.
   */
  error?: string;
};

export type InputProps = Omit<ComponentProps<"input">, keyof InputOwnProps> & InputOwnProps;

/**
 * A labelled text field. Label, description and error are wired together for screen readers,
 * so you only supply the words.
 */
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
        {...props}
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-10 w-full min-w-0 rounded-umber border border-border-strong bg-surface px-3 text-sm text-fg",
          "placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
          "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
          className,
        )}
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
