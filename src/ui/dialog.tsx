"use client";

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "./cn";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

/**
 * A modal built on the browser's own <dialog>. showModal() gives focus trapping, Escape to close,
 * the dimmed backdrop and an inert page behind it, with no library.
 */
export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Tell the parent once, however the dialog was closed. The browser can close it by itself
  // (Escape fires "cancel", and "close" may arrive late or not at all), so both events report
  // here, and the `open` check stops a second report.
  function requestClose() {
    if (open) onOpenChange(false);
  }

  // A click on the backdrop lands on the <dialog> element itself, because the content sits in an
  // inner element that fills it. Clicks inside the content never reach this check.
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) requestClose();
  }

  return (
    <dialog
      ref={ref}
      data-slot="dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={requestClose}
      onClose={requestClose}
      onClick={handleClick}
      className={cn(
        "m-auto w-[min(28rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-auto p-0",
        "rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface text-fg shadow-xl",
        "backdrop:bg-black/50",
        className,
      )}
    >
      {open ? (
        <div className="p-6">
          <h2 id={titleId} className="text-lg font-semibold leading-tight">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="mt-2 text-sm text-muted">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
