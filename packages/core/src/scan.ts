import { readFile, readdir, stat } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import type { FindingKind, MigrationFinding, MigrationPlan, PlanRequest } from './types.js';

/** Directories containing generated or dependency code are outside the migration target. */
const EXCLUDED_DIRECTORIES = new Set([
  '.git', '.hg', '.svn', 'node_modules', 'dist', 'build', 'coverage', '.next', 'target',
]);

/** These extensions are parsed using TypeScript's JavaScript and TypeScript grammars. */
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.cts', '.mts']);

/** Return the grammar that matches a source file's extension. */
function scriptKind(file: string): ts.ScriptKind {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  if (file.endsWith('.ts') || file.endsWith('.cts') || file.endsWith('.mts')) return ts.ScriptKind.TS;
  return ts.ScriptKind.JS;
}

/** Match an identifier without treating property names as standalone bindings. */
function isIdentifier(node: ts.Node, name: string): node is ts.Identifier {
  return ts.isIdentifier(node) && node.text === name;
}

/** Match `module.exports`, including when it is nested in a property assignment. */
function isModuleExports(node: ts.Node): boolean {
  return ts.isPropertyAccessExpression(node)
    && isIdentifier(node.expression, 'module')
    && node.name.text === 'exports';
}

/** Classify CommonJS assignments while leaving their semantics for later review. */
function assignedExportKind(left: ts.Expression): FindingKind | undefined {
  if (isModuleExports(left)) return 'module-exports-assignment';
  if (ts.isPropertyAccessExpression(left) && isIdentifier(left.expression, 'exports')) {
    return 'exports-property-assignment';
  }
  if (ts.isPropertyAccessExpression(left) && isModuleExports(left.expression)) {
    return 'exports-property-assignment';
  }
  if (ts.isElementAccessExpression(left) && isIdentifier(left.expression, 'exports')) {
    return 'exports-property-assignment';
  }
  return undefined;
}

/** Parse one source file and collect syntax locations without changing its bytes. */
function scanSource(file: string, relativeFile: string, source: string): MigrationFinding[] {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind(file));
  const findings: MigrationFinding[] = [];

  function record(node: ts.Node, kind: FindingKind, symbol: string): void {
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    findings.push({
      kind,
      location: { file: relativeFile, line: position.line + 1, column: position.character + 1 },
      symbol,
      action: 'manual-review',
    });
  }

  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node) && isIdentifier(node.expression, 'require')) {
      record(node, 'require-call', 'require');
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const kind = assignedExportKind(node.left);
      if (kind !== undefined) record(node.left, kind, node.left.getText(sourceFile));
    }
    if (ts.isIdentifier(node) && (node.text === '__dirname' || node.text === '__filename')) {
      record(node, 'commonjs-path-global', node.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return findings;
}

/** Walk regular source files in stable path order and avoid following symlinks. */
async function sourceFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  const pending = [root];
  while (pending.length > 0) {
    const directory = pending.pop();
    if (directory === undefined) break;
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory() && !EXCLUDED_DIRECTORIES.has(entry.name)) pending.push(path);
      if (entry.isFile() && [...SOURCE_EXTENSIONS].some(extension => entry.name.endsWith(extension))) {
        files.push(path);
      }
    }
  }
  return files.sort();
}

/**
 * Build a deterministic, read-only CommonJS migration plan for one repository.
 *
 * @param request - Repository root and supported recipe.
 * @returns Syntax findings with paths relative to the repository root.
 * @throws If the root is not a readable directory or a source file cannot be read.
 */
export async function planMigration(request: PlanRequest): Promise<MigrationPlan> {
  const recipe = request.recipe ?? 'commonjs-to-esm';
  if (recipe !== 'commonjs-to-esm') throw new Error(`Unsupported recipe: ${recipe}`);
  const root = resolve(request.repositoryRoot);
  const rootStat = await stat(root);
  if (!rootStat.isDirectory()) throw new Error(`Repository root is not a directory: ${root}`);

  const files = await sourceFiles(root);
  const findings: MigrationFinding[] = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const relativeFile = relative(root, file).split(sep).join('/');
    findings.push(...scanSource(file, relativeFile, source));
  }
  findings.sort((a, b) =>
    a.location.file.localeCompare(b.location.file)
    || a.location.line - b.location.line
    || a.location.column - b.location.column
    || a.kind.localeCompare(b.kind));

  return {
    schemaVersion: 1,
    recipe,
    repository: { root, scannedFiles: files.length },
    findings,
    summary: {
      totalFindings: findings.length,
      filesWithFindings: new Set(findings.map(finding => finding.location.file)).size,
    },
  };
}
