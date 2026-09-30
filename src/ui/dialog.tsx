"use client";

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "./cn";

/** The props Dialog takes. It renders a native <dialog>; extra element props are not passed through. */
export type DialogOwnProps = {
  /**
   * Whether the dialog is open. Dialog is always controlled: you hold the state.
   */
  open: boolean;
  /**
   * Called with `false` when the dialog asks to close: Escape, a click on the backdrop, or your
   * own close button. Called once per opening, however it closes.
   */
  onOpenChange: (open: boolean) => void;
  /**
   * The heading. It becomes the dialog's accessible name.
   */
  title: string;
  /**
   * One or two sentences under the title, read by screen readers as the dialog's description.
   */
  description?: string;
  /**
   * The body: a form, a warning, buttons. Rendered only while open.
   */
  children?: ReactNode;
  /**
   * Extra classes for the <dialog> element, for example a different width.
   */
  className?: string;
};

export type DialogProps = DialogOwnProps;

/**
 * A modal built on the browser's own <dialog>. showModal() gives focus trapping, Escape to close,
 * the dimmed backdrop and an inert page behind it, with no library.
 */
export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const reported = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      reported.current = false;
      if (!dialog.open) {
        opener.current = document.activeElement as HTMLElement | null;
        dialog.showModal();
      }
      return;
    }
    if (dialog.open) dialog.close();
    // Give focus back to whatever opened the dialog. Browsers do this themselves after
    // showModal(), but not every browser does it every time, so Dialog makes sure.
    const el = opener.current;
    opener.current = null;
    const focusIsLost = document.activeElement === document.body || dialog.contains(document.activeElement);
    if (el && el.isConnected && focusIsLost) el.focus();
  }, [open]);

  // Tell the parent once, however the dialog was closed. The browser can close it by itself
  // (Escape fires "cancel", then "close"), so both events report here, and the flag stops a
  // second report before the parent has re-rendered with open={false}.
  function requestClose() {
    if (reported.current) return;
    reported.current = true;
    onOpenChange(false);
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
