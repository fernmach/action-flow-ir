import {readFile} from 'node:fs/promises';
import {toolError} from '../validator/diagnostics.js';
import type {ValidationResult} from '../validator/diagnostics.js';
import {validateDocument} from '../validator/index.js';
export interface CommandResult {exitCode: number; stdout: string; stderr: string}
const help = 'Usage: afir --help | --version | validate <file> [--format text|json]\n';
export async function run(
  args: string[], version: string,
  read: (path: string) => Promise<string> = path => readFile(path, 'utf8'),
): Promise<CommandResult> {
  if (args.length === 1 && args[0] === '--help') return {exitCode: 0, stdout: help, stderr: ''};
  if (args.length === 1 && args[0] === '--version') return {exitCode: 0, stdout: version + '\n', stderr: ''};
  const format = args.some((arg, i) => arg === '--format' && args[i + 1] === 'json') ? 'json' : 'text';
  function render(result: ValidationResult): CommandResult {
    const exitCode = result.status === 'valid' ? 0 : result.status === 'invalid' ? 1 : 2;
    const output = format === 'json' ? JSON.stringify(result) + '\n'
      : result.diagnostics.map(d => d.severity + ' ' + d.code + ': ' + d.message + '\n').join('');
    return {exitCode, stdout: format === 'json' || exitCode === 0 ? output : '',
      stderr: format === 'text' && exitCode !== 0 ? output : ''};
  }
  const file = args[1];
  if (args[0] !== 'validate' || !file || file.startsWith('-') ||
      !(args.length === 2 || (args.length === 4 && args[2] === '--format' && ['text', 'json'].includes(args[3] ?? '')))) {
    return render(toolError('AFIR-TOOL-001', help.trim()));
  }
  let text: string;
  try { text = await read(file); }
  catch { return render(toolError('AFIR-TOOL-002', 'Cannot read input file.')); }
  try { return render(validateDocument(text)); }
  catch { return render(toolError('AFIR-TOOL-004', 'Unexpected validation failure.')); }
}
