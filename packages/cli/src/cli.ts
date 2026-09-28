#!/usr/bin/env node
import { runCommand } from './app.js';

/** Keep process I/O at the executable entry point for library-level verification. */
runCommand(process.argv.slice(2)).then(
  output => { process.stdout.write(output); },
  error => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\nRun semigratex --help for usage.\n`);
    process.exitCode = 1;
  },
);
