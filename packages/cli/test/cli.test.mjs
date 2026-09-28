import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { runCommand } from '../dist/app.js';

const example = resolve('examples/commonjs-app');

test('CLI plans a repository and returns machine-readable JSON', async () => {
  const plan = JSON.parse(await runCommand(['plan', example]));
  assert.equal(plan.repository.scannedFiles, 1);
  assert.deepEqual(plan.findings.map(finding => finding.kind), [
    'require-call',
    'module-exports-assignment',
    'commonjs-path-global',
  ]);
});

test('CLI writes a plan once and refuses to overwrite it', async () => {
  const root = await mkdtemp(join(tmpdir(), 'semigratex-cli-'));
  try {
    const output = join(root, 'plan.json');
    const args = ['plan', example, '--output', output];
    assert.match(await runCommand(args), /Wrote migration plan/);
    assert.equal(JSON.parse(await readFile(output, 'utf8')).schemaVersion, 1);
    await assert.rejects(runCommand(args), { code: 'EEXIST' });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('CLI rejects unknown commands and incomplete options', async () => {
  await assert.rejects(runCommand(['apply']), /Unknown command/);
  await assert.rejects(runCommand(['plan', example, '--output']), /requires a file path/);
});
