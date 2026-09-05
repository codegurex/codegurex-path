#!/usr/bin/env node
import { run } from './cli.js';
import { Cancelled } from './ui/prompts.js';

process.stdout.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EPIPE') process.exit(0);
  process.stderr.write('Unable to write terminal output.\n');
  process.exitCode = 1;
});
try { await run(); }
catch (error: unknown) {
  const name = error instanceof Error ? error.name : '';
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
  if (code === 'commander.helpDisplayed' || code === 'commander.version') { /* Commander already rendered output. */ }
  else if (typeof code === 'string' && code.startsWith('commander.')) process.exitCode = 1;
  else if (error instanceof Cancelled || name === 'ExitPromptError' || name === 'AbortPromptError') {
    process.stderr.write('\nSession closed. Completed work remains saved.\n'); process.exitCode = 130;
  } else {
    const message = code === 'EACCES' || code === 'EPERM' ? 'Cannot access local data. Check your user-directory permissions or CODEGUREX_PATH_HOME.'
      : error instanceof Error ? error.message : 'Unexpected failure. Please try again.';
    process.stderr.write(`CodeGurex Path: ${message.replace(/[\x00-\x1f\x7f-\x9f]/g, ' ')}\n`);
    process.exitCode = 1;
  }
}
