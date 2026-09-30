"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/ui/button";
import { Dialog } from "@/ui/dialog";
import { Input } from "@/ui/input";

const SNIPPET = `const [open, setOpen] = useState(false);

<Button variant="secondary" aria-haspopup="dialog" onClick={() => setOpen(true)}>
  Rename project
</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Rename project"
  description="The old name stops working right away."
>
  <form onSubmit={save}>
    <Input label="New name" name="name" required />
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Dialog>`;

/** The Dialog preview: a real dialog with a form inside. Try Escape, the backdrop and Tab. */
export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Umber");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = String(new FormData(event.currentTarget).get("name")).trim();
    if (next) setName(next);
    setOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface">
      <div
        data-testid="dialog-preview"
        className="grid min-h-44 place-items-center gap-3 bg-[radial-gradient(var(--umber-border)_1px,transparent_1px)] [background-size:14px_14px] p-8"
      >
        <p className="text-sm text-muted">
          Project: <span className="font-medium text-fg">{name}</span>
        </p>
        <Button variant="secondary" aria-haspopup="dialog" onClick={() => setOpen(true)}>
          Rename project
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Rename project"
          description="The old name stops working right away."
        >
          <form onSubmit={save} className="mt-4">
            <Input label="New name" name="name" defaultValue={name} required autoComplete="off" />
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Dialog>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs text-muted">
        Open it, then try Escape, a click on the dark backdrop, and Tab: focus stays inside, and comes
        back to the button when it closes.
      </p>
      <div className="overflow-x-auto border-t border-border px-4 py-3">
        <code data-testid="dialog-snippet" className="block font-mono text-xs whitespace-pre">
          {SNIPPET}
        </code>
      </div>
    </div>
  );
}
