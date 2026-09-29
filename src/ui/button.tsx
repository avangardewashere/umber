"use client";

import type { ComponentProps, MouseEvent } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./button-styles";

export type { ButtonSize, ButtonVariant };

/** The props Button adds. Every other native <button> prop, including `ref`, also works. */
export type ButtonOwnProps = {
  /**
   * The visual style. Use `danger` only for actions that destroy something.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Height, padding and text size.
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * Shows a spinner, sets `aria-busy`, and ignores clicks. The button keeps its label and its
   * keyboard focus, so screen reader users are not thrown back to the top of the page.
   * @default false
   */
  loading?: boolean;
  /**
   * The native button type. Umber defaults to `"button"`, not the browser's `"submit"`, so a
   * button inside a form never submits it by accident.
   * @default "button"
   */
  type?: "button" | "submit" | "reset";
};

export type ButtonProps = Omit<ComponentProps<"button">, keyof ButtonOwnProps> & ButtonOwnProps;

/**
 * A real <button>. While `loading`, it uses `aria-disabled` instead of `disabled`: a disabled
 * button drops keyboard focus, an aria-disabled one keeps it. Clicks are ignored either way.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  type = "button",
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      // Also stops a type="submit" button from submitting its form.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      {...props}
      type={type}
      data-slot="button"
      data-variant={variant}
      aria-busy={loading || undefined}
      aria-disabled={loading ? true : props["aria-disabled"]}
      className={buttonStyles({ variant, size, className })}
      onClick={handleClick}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="size-4 shrink-0 motion-safe:animate-spin"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
