import {expect, test} from 'vitest';
import {run} from '../../src/cli/run.js';
test('help and version succeed', async () => {
  expect(await run(['--help'], '0.0.0')).toMatchObject({exitCode: 0, stderr: ''});
  expect((await run(['--version'], '0.0.0')).stdout).toBe('0.0.0\n');
});
for (const args of [[], ['other'], ['validate'], ['validate', 'a', '--format', 'yaml'], ['validate', 'a', 'extra'], ['--help', 'extra']]) {
  test('reject arguments ' + JSON.stringify(args), async () => {
    expect((await run(args, '0.0.0')).exitCode).toBe(2);
  });
}
test('read failures produce JSON stdout only', async () => {
  const result = await run(['validate', 'missing', '--format', 'json'], '0.0.0', async () => { throw new Error('private detail'); });
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toMatchObject({status: 'tool-error', diagnostics: [{code: 'AFIR-TOOL-002'}]});
  expect(result.stdout).not.toContain('private');
});
test('parse failure exits 1; unsupported validation exits 2', async () => {
  for (const [text, code] of [['{', 1], ['{}', 2]] as const) {
    const result = await run(['validate', 'file', '--format', 'json'], '0.0.0', async () => text);
    expect(result.exitCode).toBe(code);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout).diagnostics).toHaveLength(1);
  }
});
