import type { ComponentProps } from "react";
import { cn } from "./cn";

export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

const variants: Record<BadgeVariant, string> = {
  neutral: "border-border bg-fg/5 text-muted",
  info: "border-info/30 bg-info/10 text-info",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

export type BadgeProps = ComponentProps<"span"> & { variant?: BadgeVariant };

/**
 * A short status label. The text carries the meaning; the colour and the dot only support it,
 * so the badge still reads correctly for people who cannot tell the colours apart.
 */
export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
