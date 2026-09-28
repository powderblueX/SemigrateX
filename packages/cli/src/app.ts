import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { planMigration } from '@semigratex/core';

/** Text shown for both the explicit help command and argument errors. */
const HELP = `SemigrateX 0.1.0 — inspect a repository before migration

Usage:
  semigratex plan [repository] [--output plan.json]
  semigratex --help
  semigratex --version

The current release analyzes CommonJS syntax and does not edit source files.
`;

/** Parse the narrow v0.1 CLI grammar so unsupported requests fail explicitly. */
function parsePlanArguments(args: readonly string[]): { repository: string; output?: string } {
  let repository: string | undefined;
  let output: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--output') {
      const next = args[index + 1];
      if (next === undefined || next.startsWith('--')) throw new Error('--output requires a file path');
      if (output !== undefined) throw new Error('--output may be specified once');
      output = next;
      index += 1;
    } else if (value !== undefined && !value.startsWith('-') && repository === undefined) {
      repository = value;
    } else {
      throw new Error(`Unexpected argument: ${value}`);
    }
  }
  return { repository: repository ?? process.cwd(), ...(output === undefined ? {} : { output }) };
}

/**
 * Execute a CLI command and return its standard-output text.
 *
 * @param args - Command arguments after the executable name.
 * @returns JSON, help, version, or the written-plan location.
 * @throws For an invalid command, unreadable repository, or existing output file.
 */
export async function runCommand(args: readonly string[]): Promise<string> {
  if (args.length === 0 || args[0] === '--help' || args[0] === 'help') return HELP;
  if (args[0] === '--version') return '0.1.0\n';
  if (args[0] !== 'plan') throw new Error(`Unknown command: ${args[0]}`);
  const options = parsePlanArguments(args.slice(1));
  const plan = await planMigration({ repositoryRoot: options.repository });
  const json = `${JSON.stringify(plan, null, 2)}\n`;
  if (options.output === undefined) return json;
  const destination = resolve(options.output);
  await writeFile(destination, json, { flag: 'wx' });
  return `Wrote migration plan to ${destination}\n`;
}
