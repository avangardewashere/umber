import path from "node:path";
import ts from "typescript";

export type PropDoc = {
  name: string;
  /** The allowed values, written out: `"sm" | "md" | "lg"`, not the alias name. */
  type: string;
  required: boolean;
  /** From the `@default` JSDoc tag, or null if there is none. */
  defaultValue: string | null;
  /** The JSDoc comment above the prop. */
  description: string;
};

const cache = new Map<string, PropDoc[]>();

/**
 * Reads a props type straight from a component's source with the TypeScript compiler, so the
 * props table on the website can never drift from the code. Runs at build time only.
 */
export function extractProps(file: string, typeName: string): PropDoc[] {
  const absolute = path.resolve(/*turbopackIgnore: true*/ file);
  const key = `${absolute}#${typeName}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const program = ts.createProgram([absolute], {
    strict: true,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    esModuleInterop: true,
    skipLibCheck: true,
    noEmit: true,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(absolute);
  if (!source) throw new Error(`Cannot read ${file}`);

  const declaration = source.statements.find(
    (s): s is ts.TypeAliasDeclaration | ts.InterfaceDeclaration =>
      (ts.isTypeAliasDeclaration(s) || ts.isInterfaceDeclaration(s)) && s.name.text === typeName,
  );
  if (!declaration) throw new Error(`No type named ${typeName} in ${file}`);

  const type = checker.getTypeAtLocation(declaration.name);
  const props = checker.getPropertiesOfType(type).map((symbol): PropDoc => {
    const at = symbol.valueDeclaration ?? symbol.declarations?.[0] ?? declaration;
    const propType = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(symbol, at));
    const defaultTag = symbol.getJsDocTags(checker).find((tag) => tag.name === "default");
    return {
      name: symbol.getName(),
      type: printType(checker, propType),
      required: (symbol.flags & ts.SymbolFlags.Optional) === 0,
      defaultValue: defaultTag ? ts.displayPartsToString(defaultTag.text).trim() : null,
      description: ts
        .displayPartsToString(symbol.getDocumentationComment(checker))
        .replace(/\s+/g, " ")
        .trim(),
    };
  });

  cache.set(key, props);
  return props;
}

function printType(checker: ts.TypeChecker, type: ts.Type): string {
  if (type.flags & ts.TypeFlags.Boolean) return "boolean";
  if (type.isUnion()) return type.types.map((t) => checker.typeToString(t)).join(" | ");
  return checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation);
}
