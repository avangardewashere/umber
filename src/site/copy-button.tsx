"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/ui/button";

type CopyState = "idle" | "copied" | "failed";

export const COPIED_FOR_MS = 2000;

/**
 * Copies `text` to the clipboard. Shows "Copied" for two seconds, then goes back to "Copy".
 * If the browser refuses (no permission, not HTTPS), it selects the code in `targetId` instead
 * and tells the person to press Ctrl+C, so copying still works by hand.
 */
export function CopyButton({
  text,
  targetId,
  what = "code",
}: {
  text: string;
  targetId: string;
  /** Finishes the accessible name, "Copy <what>", so several copy buttons on a page differ. */
  what?: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function selectTarget() {
    const target = document.getElementById(targetId);
    const selection = window.getSelection();
    if (!target || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function copy() {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), COPIED_FOR_MS);
    } catch {
      setState("failed");
      selectTarget();
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={copy}>
        {state === "idle" ? (
          <>
            Copy<span className="sr-only"> {what}</span>
          </>
        ) : state === "copied" ? (
          "Copied"
        ) : (
          "Press Ctrl+C"
        )}
      </Button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Code copied to the clipboard."
          : state === "failed"
            ? "Copying failed. The code is selected; press Ctrl+C to copy it."
            : ""}
      </span>
    </>
  );
}
