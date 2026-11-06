#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {run} from './run.js';
try {
  const metadata: unknown = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
  if (typeof metadata !== 'object' || metadata === null || !('version' in metadata) || typeof metadata.version !== 'string') {
    throw new Error('Invalid package metadata');
  }
  const result = await run(process.argv.slice(2), metadata.version);
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exitCode = result.exitCode;
} catch {
  const result = {status: 'tool-error', diagnostics: [{code: 'AFIR-TOOL-004', severity: 'error', message: 'Cannot initialize CLI.'}]};
  if (process.argv.includes('--format') && process.argv.includes('json')) process.stdout.write(JSON.stringify(result) + '\n');
  else process.stderr.write('error AFIR-TOOL-004: Cannot initialize CLI.\n');
  process.exitCode = 2;
}
