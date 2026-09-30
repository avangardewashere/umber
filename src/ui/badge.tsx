import type { ComponentProps } from "react";
import { cn } from "./cn";

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

/** The props Badge adds. Every native <span> prop also works. */
export type BadgeOwnProps = {
  /**
   * The colour of the badge. The text must carry the meaning on its own; the colour only
   * supports it, so the badge still reads correctly for people who cannot tell colours apart.
   * @default "neutral"
   */
  variant?: BadgeVariant;
};

export type BadgeProps = Omit<ComponentProps<"span">, keyof BadgeOwnProps> & BadgeOwnProps;

const variants: Record<BadgeVariant, string> = {
  neutral: "border-border bg-fg/5 text-muted",
  info: "border-info/30 bg-info/10 text-info",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

/**
 * A short status label: "Pending", "3 seats left", "Beta". Not a button and not a link;
 * a badge is read, never pressed.
 */
export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      data-slot="badge"
      data-variant={variant}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  );
}
