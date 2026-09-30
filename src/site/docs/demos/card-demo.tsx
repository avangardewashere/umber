"use client";

import { useState } from "react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, type CardTitleOwnProps } from "@/ui/card";
import { Choice } from "./choice";

type Level = NonNullable<CardTitleOwnProps["as"]>;
const LEVELS = ["h2", "h3", "h4", "h5", "h6"] as const satisfies readonly Level[];

/** The Card preview: pick the heading level and see the code for it. */
export function CardDemo() {
  const [level, setLevel] = useState<Level>("h3");
  const snippet = `<Card>
  <CardHeader>
    <CardTitle${level === "h3" ? "" : ` as="${level}"`}>Invite to workspace</CardTitle>
    <p className="text-sm text-muted">Teammates can open every project.</p>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter className="justify-end">
    <Button variant="ghost">Cancel</Button>
    <Button>Send invite</Button>
  </CardFooter>
</Card>`;

  return (
    <div className="overflow-hidden rounded-[calc(var(--umber-radius)*1.5)] border border-border bg-surface">
      <div
        data-testid="card-preview"
        className="grid min-h-44 place-items-center bg-[radial-gradient(var(--umber-border)_1px,transparent_1px)] [background-size:14px_14px] p-6 sm:p-8"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle as={level}>Invite to workspace</CardTitle>
              <Badge variant="success">3 seats left</Badge>
            </div>
            <p className="text-sm text-muted">Teammates can open every project.</p>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            The heading above is an <code className="font-mono text-fg">{`<${level}>`}</code>.
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="ghost">Cancel</Button>
            <Button>Send invite</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="border-t border-border p-4">
        <Choice legend="Heading level" name="card-level" options={LEVELS} value={level} onChange={setLevel} />
      </div>
      <div className="overflow-x-auto border-t border-border px-4 py-3">
        <code data-testid="card-snippet" className="block font-mono text-xs whitespace-pre">
          {snippet}
        </code>
      </div>
    </div>
  );
}
