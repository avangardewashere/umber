/**
 * @jest-environment node
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

// B0-T2: the lint wall. A file inside src/ui that imports from src/site or src/app
// must produce exactly one ESLint error. The same kind of file importing from src/ui
// must produce none, and the site may import from src/ui (the wall is one-way).
//
// ESLint runs once as a child process over five probe files (not through its Node API,
// because Jest's module system cannot load the ESM config file with a dynamic import;
// and once, not five times, because each ESLint start-up costs about 20 seconds here).

const root = process.cwd();
const uiProbeDir = path.join(root, "src", "ui", "lint-probe-tmp");
const siteProbe = path.join(root, "src", "site", "lint-probe-tmp.ts");

const probes = {
  fromSite: {
    file: path.join(uiProbeDir, "from-site.ts"),
    code: `import { REPO_URL } from "@/site/shell";\nexport const url: string = REPO_URL;\n`,
  },
  fromApp: {
    file: path.join(uiProbeDir, "from-app.ts"),
    code: `import Home from "@/app/page";\nexport const page = Home;\n`,
  },
  relativeToSite: {
    file: path.join(uiProbeDir, "relative-to-site.ts"),
    code: `import { REPO_URL } from "../../site/shell";\nexport const url: string = REPO_URL;\n`,
  },
  fromUi: {
    file: path.join(uiProbeDir, "from-ui.ts"),
    code: `import { cn } from "@/ui/cn";\nexport const c: string = cn("a");\n`,
  },
  siteFromUi: {
    file: siteProbe,
    code: `import { cn } from "@/ui/cn";\nexport const c: string = cn("a");\n`,
  },
};

type Message = { ruleId: string | null; message: string };
type Result = { filePath: string; messages: Message[] };

let byFile: Map<string, Message[]>;

beforeAll(() => {
  mkdirSync(uiProbeDir, { recursive: true });
  for (const p of Object.values(probes)) writeFileSync(p.file, p.code);

  const eslintBin = path.join(root, "node_modules", "eslint", "bin", "eslint.js");
  const run = spawnSync(
    process.execPath,
    [eslintBin, "--format", "json", ...Object.values(probes).map((p) => p.file)],
    { encoding: "utf8", cwd: root },
  );
  if (run.error) throw run.error;
  if (!run.stdout) throw new Error(`ESLint produced no output.\n${run.stderr}`);
  const results = JSON.parse(run.stdout) as Result[];
  byFile = new Map(results.map((r) => [path.normalize(r.filePath), r.messages]));
});

afterAll(() => {
  rmSync(uiProbeDir, { recursive: true, force: true });
  rmSync(siteProbe, { force: true });
});

function messagesFor(file: string): Message[] {
  const m = byFile.get(path.normalize(file));
  if (!m) throw new Error(`ESLint returned no result for ${file}`);
  return m;
}

describe("lint wall around src/ui", () => {
  test("importing from src/site inside src/ui is exactly one error", () => {
    const messages = messagesFor(probes.fromSite.file);
    expect(messages).toHaveLength(1);
    expect(messages[0].ruleId).toBe("no-restricted-imports");
  });

  test("importing from src/app inside src/ui is exactly one error", () => {
    const messages = messagesFor(probes.fromApp.file);
    expect(messages).toHaveLength(1);
    expect(messages[0].ruleId).toBe("no-restricted-imports");
  });

  test("a relative import that climbs out to src/site is also caught", () => {
    const messages = messagesFor(probes.relativeToSite.file);
    expect(messages).toHaveLength(1);
    expect(messages[0].ruleId).toBe("no-restricted-imports");
  });

  test("importing from src/ui inside src/ui is fine", () => {
    expect(messagesFor(probes.fromUi.file)).toEqual([]);
  });

  test("the site may import from src/ui (the wall is one-way)", () => {
    expect(messagesFor(probes.siteFromUi.file)).toEqual([]);
  });
});
