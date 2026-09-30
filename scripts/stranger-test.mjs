// The stranger test: does the code work for someone who only has the website?
//
// It takes each component's code out of the running site exactly as the page shows it, pastes it
// into a fresh Next.js app that nobody has touched by hand, and builds that app. If the build
// fails, or the rendered page is missing a component, the site is lying to strangers.
//
//   npm run stranger                 all five components
//   npm run stranger -- button card  just these
//
// Needs the site running (npm run dev) at UMBER_URL (default http://localhost:3005).
// The fresh app lives at STRANGER_DIR (default <os tmp>/umber-stranger) and is created with
// create-next-app on the first run, which takes a few minutes.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const { JSDOM } = require("jsdom");

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.env.UMBER_URL ?? "http://localhost:3005";
const APP = process.env.STRANGER_DIR ?? path.join(os.tmpdir(), "umber-stranger");
const ALL = ["button", "badge", "input", "card", "dialog"];
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

const USAGE = {
  button: `<Button>Primary</Button>
      <Button variant="secondary" size="sm">Secondary</Button>
      <Button variant="danger" loading>Danger</Button>
      <Link href="/about" className={buttonStyles({ variant: "ghost" })}>A link styled as a button</Link>`,
  badge: `<Badge variant="success">3 seats left</Badge>
      <Badge variant="danger">Revoked</Badge>`,
  input: `<Input label="Email address" type="email" description="We only use it to send the invite." />
      <Input label="Name" error="Enter your name." />`,
  card: `<Card>
        <CardHeader><CardTitle as="h2">Invite to workspace</CardTitle></CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter><Button variant="ghost">Cancel</Button></CardFooter>
      </Card>`,
  dialog: `<DialogExample />`,
};
// [module, ...names]; a default import is written as "default:Name".
const IMPORTS = {
  button: [
    ["next/link", "default:Link"],
    ["@/components/ui/button", "Button"],
    ["@/components/ui/button-styles", "buttonStyles"],
  ],
  badge: [["@/components/ui/badge", "Badge"]],
  input: [["@/components/ui/input", "Input"]],
  card: [
    ["@/components/ui/card", "Card", "CardContent", "CardFooter", "CardHeader", "CardTitle"],
    ["@/components/ui/button", "Button"],
  ],
  dialog: [["./dialog-example", "DialogExample"]],
};
const DIALOG_EXAMPLE = `"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";

export function DialogExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open</button>
      <Dialog open={open} onOpenChange={setOpen} title="Hello" description="From the stranger test.">
        <button type="button" onClick={() => setOpen(false)}>Close</button>
      </Dialog>
    </>
  );
}
`;

function importLines(map) {
  return [...map]
    .map(([mod, names]) => {
      const def = [...names].find((n) => n.startsWith("default:"))?.slice(8);
      const named = [...names].filter((n) => !n.startsWith("default:")).sort();
      const parts = [def, named.length ? `{ ${named.join(", ")} }` : null].filter(Boolean);
      return `import ${parts.join(", ")} from "${mod}";`;
    })
    .join("\n");
}

let failed = false;
/** Records a pass or a failure with its message. */
const check = (passed, good, failure) => (passed ? ok(good) : bad(failure));
const ok = (msg) => console.log(`  ok   ${msg}`);
const bad = (msg) => {
  failed = true;
  console.log(`  FAIL ${msg}`);
};

async function pageOf(route) {
  const res = await fetch(SITE + route);
  if (!res.ok) throw new Error(`${route}: HTTP ${res.status}. Is the site running at ${SITE}?`);
  return new JSDOM(await res.text()).window.document;
}

/** Every code block in the "Code" section: the file name from its header, the code as text. */
function codeBlocks(doc, sectionId) {
  const section = doc.querySelector(`section[aria-labelledby="${sectionId}"]`);
  if (!section) throw new Error(`No section ${sectionId}`);
  return [...section.querySelectorAll(".umber-code")].map((block) => ({
    file: block.previousElementSibling.querySelector("span").textContent.trim(),
    code: block.textContent,
  }));
}

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, shell: true, encoding: "utf8" });
  return { status: r.status, out: `${r.stdout}\n${r.stderr}` };
}

function ensureApp() {
  if (!existsSync(path.join(APP, "package.json"))) {
    console.log(`Creating a fresh Next.js app at ${APP} (a few minutes)...`);
    mkdirSync(path.dirname(APP), { recursive: true });
    const r = run(
      "npx",
      ["--yes", "create-next-app@latest", `"${APP}"`, "--ts", "--tailwind", "--eslint", "--app", "--src-dir", "--import-alias", '"@/*"', "--use-npm", "--disable-git", "--yes"],
      path.dirname(APP),
    );
    if (r.status !== 0) throw new Error(`create-next-app failed:\n${r.out}`);
  }
  // Wipe anything a previous run pasted, so every run starts from the fresh app.
  const ui = path.join(APP, "src/components/ui");
  mkdirSync(ui, { recursive: true });
  for (const f of readdirSync(ui)) writeFileSync(path.join(ui, f), "");
}

async function main() {
  console.log(`Stranger test: ${slugs.join(", ")}\n  site ${SITE}\n  app  ${APP}\n`);
  ensureApp();

  console.log("Set up once (from /components):");
  const index = await pageOf("/components");
  const install = index.getElementById("setup-install").textContent.trim();
  const tokens = index.getElementById("setup-tokens").textContent;
  const cn = index.getElementById("setup-cn").textContent;
  const repo = (p) => readFileSync(path.join(REPO, p), "utf8").replace(/\r\n/g, "\n");
  check(cn === repo("src/ui/cn.ts"), "cn.ts as shown is the repo file", "cn.ts as shown differs from the repo file");

  const pkg = JSON.parse(readFileSync(path.join(APP, "package.json"), "utf8"));
  const [, , ...packages] = install.split(/\s+/);
  if (packages.every((p) => pkg.dependencies?.[p])) ok(`${install} (already installed)`);
  else {
    const r = run(install, [], APP);
    check(r.status === 0, install, `${install}\n${r.out}`);
  }

  const cssPath = path.join(APP, "src/app/globals.css");
  const css = readFileSync(cssPath, "utf8");
  if (!css.includes("--umber-accent:")) {
    writeFileSync(cssPath, css.replace('@import "tailwindcss";', `@import "tailwindcss";\n\n${tokens}`));
  }
  ok("tokens pasted after @import \"tailwindcss\"");
  writeFileSync(path.join(APP, "src/components/ui/cn.ts"), cn);

  const imports = new Map(); // module -> Set of names
  const usage = [];
  for (const slug of slugs) {
    console.log(`\n${slug} (from /components/${slug}):`);
    const doc = await pageOf(`/components/${slug}`);
    for (const { file, code } of codeBlocks(doc, "code-title")) {
      const base = path.basename(file);
      check(code === repo(`src/ui/${base}`), `${file} as shown is the repo file`, `${file} as shown differs from the repo file`);
      writeFileSync(path.join(APP, "src/components/ui", base), code);
    }
    for (const [mod, ...names] of IMPORTS[slug]) {
      if (!imports.has(mod)) imports.set(mod, new Set());
      names.forEach((n) => imports.get(mod).add(n));
    }
    usage.push(USAGE[slug]);
  }

  writeFileSync(path.join(APP, "src/app/dialog-example.tsx"), DIALOG_EXAMPLE);
  writeFileSync(
    path.join(APP, "src/app/page.tsx"),
    `${importLines(imports)}\n\nexport default function Home() {\n  return (\n    <main className="grid gap-6 p-8">\n      ${usage.join("\n      ")}\n    </main>\n  );\n}\n`,
  );

  console.log("\nBuilding the fresh app...");
  const build = run("npx", ["next", "build"], APP);
  if (build.status !== 0) {
    bad(`next build failed:\n${build.out.split("\n").filter((l) => /error|Error|⨯/.test(l)).join("\n")}`);
  } else {
    ok("next build succeeded");
    const html = readFileSync(path.join(APP, ".next/server/app/index.html"), "utf8");
    for (const slug of slugs) {
      check(html.includes(`data-slot="${slug}"`), `rendered a <${slug}> (data-slot="${slug}")`, `no data-slot="${slug}" in the rendered page`);
    }
    const built = readdirSync(path.join(APP, ".next/static"), { recursive: true })
      .filter((f) => String(f).endsWith(".css"))
      .map((f) => readFileSync(path.join(APP, ".next/static", String(f)), "utf8"))
      .join("");
    check(
      built.includes("--umber-accent:") && /\.bg-accent\{/.test(built),
      "the built CSS has the Umber tokens and classes",
      "the built CSS is missing the Umber tokens or classes",
    );
  }

  console.log(failed ? "\nStranger test FAILED" : "\nStranger test passed");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
