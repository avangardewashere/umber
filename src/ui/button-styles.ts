import { cn } from "./cn";

// Kept out of button.tsx on purpose. button.tsx is a client component, and a function exported
// from a client file cannot be called on the server. This file has no "use client", so
// buttonStyles() works anywhere, including a Server Component styling a <Link>.

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-umber font-medium transition-colors select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent/90",
  secondary: "border border-border bg-surface text-fg hover:bg-fg/5",
  ghost: "text-fg hover:bg-fg/5",
  danger: "bg-danger text-danger-fg hover:bg-danger/90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/**
 * The button look, without the <button>. Use it to style a link that should look like a button:
 * a link that navigates stays a link, so screen readers announce it correctly.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}
