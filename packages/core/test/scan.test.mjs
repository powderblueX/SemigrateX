import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { planMigration } from '../dist/index.js';

test('planning reports source locations and ignores comments, strings, and dependencies', async () => {
  const root = await mkdtemp(join(tmpdir(), 'semigratex-core-'));
  try {
    await mkdir(join(root, 'src'));
    await mkdir(join(root, 'node_modules'));
    await writeFile(join(root, 'src', 'index.js'), [
      '// require("comment")',
      'const text = "module.exports = ignored";',
      'const value = require("real");',
      'exports.value = value;',
      'module.exports = __dirname;',
      '',
    ].join('\n'));
    await writeFile(join(root, 'node_modules', 'ignored.js'), 'require("dependency");\n');

    const plan = await planMigration({ repositoryRoot: root });
    assert.equal(plan.schemaVersion, 1);
    assert.equal(plan.repository.scannedFiles, 1);
    assert.deepEqual(plan.findings.map(finding => [finding.kind, finding.location.line]), [
      ['require-call', 3],
      ['exports-property-assignment', 4],
      ['module-exports-assignment', 5],
      ['commonjs-path-global', 5],
    ]);
    assert.equal(plan.summary.totalFindings, 4);
    assert.equal(plan.summary.filesWithFindings, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('planning rejects a file as repository root', async () => {
  const root = await mkdtemp(join(tmpdir(), 'semigratex-root-'));
  try {
    const file = join(root, 'file.js');
    await writeFile(file, 'module.exports = 1;\n');
    await assert.rejects(planMigration({ repositoryRoot: file }), /not a directory/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
