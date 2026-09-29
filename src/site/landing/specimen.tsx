"use client";

import { useState, type FormEvent } from "react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { Dialog } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { cn } from "@/ui/cn";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The live example in the hero. Every control is an Umber component, and every one works:
 * the form validates, Resend reports back, and Revoke asks first in a real dialog.
 */
export function Specimen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState("");
  const [revoked, setRevoked] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setError("Enter an email address, like ana@example.com.");
      setStatus("");
      return;
    }
    setError(undefined);
    setEmail("");
    setStatus(`Invite sent to ${value}.`);
  }

  function reset() {
    setEmail("");
    setError(undefined);
    setStatus("");
  }

  return (
    <Card className="relative">
      <form onSubmit={submit} noValidate>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle as="h2">Invite to workspace</CardTitle>
            <Badge variant="success">3 seats left</Badge>
          </div>
          <p className="text-sm text-muted">Teammates can open every project.</p>
        </CardHeader>
        <CardContent>
          <Input
            label="Email address"
            type="email"
            autoComplete="off"
            placeholder="ana@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            description={error ? undefined : "The invite link expires in 7 days."}
            error={error}
          />
          <p role="status" className="mt-2 min-h-5 text-sm font-medium text-success">
            {status}
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="ghost" onClick={reset}>
            Cancel
          </Button>
          <Button type="submit">Send invite</Button>
        </CardFooter>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-fg"
          >
            JR
          </span>
          <div className="min-w-0">
            <p className={cn("truncate text-sm font-medium", revoked && "text-muted line-through")}>
              jordan@example.com
            </p>
            <Badge variant={revoked ? "danger" : "warning"} className="mt-1">
              {revoked ? "Revoked" : "Pending"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={revoked}
            onClick={() => setStatus("Invite resent to jordan@example.com.")}
          >
            Resend
          </Button>
          <Button
            variant="danger"
            size="sm"
            aria-haspopup="dialog"
            disabled={revoked}
            onClick={() => setConfirmOpen(true)}
          >
            Revoke
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Revoke Jordan's invite?"
        description="The link stops working right away. You can invite Jordan again later."
      >
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Keep invite
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setRevoked(true);
              setConfirmOpen(false);
              setStatus("Invite for jordan@example.com revoked.");
            }}
          >
            Revoke invite
          </Button>
        </div>
      </Dialog>
    </Card>
  );
}
