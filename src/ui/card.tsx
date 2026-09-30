import type { ComponentProps } from "react";
import { cn } from "./cn";

/** The props CardTitle adds. Card, CardHeader, CardContent and CardFooter take plain <div> props. */
export type CardTitleOwnProps = {
  /**
   * The heading level. Pick the one that fits where the card sits on the page, so the page
   * outline stays correct: a card under an h1 gets "h2", a card under an h2 gets "h3".
   * @default "h3"
   */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
};

export type CardTitleProps = Omit<ComponentProps<"h3">, keyof CardTitleOwnProps> & CardTitleOwnProps;

/** A bordered surface for one thing: a form, a summary, a list entry. Compose it from the parts below. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="card"
      className={cn(
        "rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface text-fg shadow-sm",
        className,
      )}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="card-header" className={cn("flex flex-col gap-1.5 p-5 pb-0", className)} />;
}

export function CardTitle({ as: Heading = "h3", className, ...props }: CardTitleProps) {
  return (
    <Heading
      {...props}
      data-slot="card-title"
      className={cn("text-base font-semibold leading-tight", className)}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} data-slot="card-content" className={cn("p-5", className)} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div {...props} data-slot="card-footer" className={cn("flex items-center gap-2 p-5 pt-0", className)} />
  );
}
