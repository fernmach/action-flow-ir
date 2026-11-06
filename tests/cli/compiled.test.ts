import {spawnSync} from 'node:child_process';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {expect, test} from 'vitest';
test('compiled CLI runs in Node with real filesystem inputs', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'afir-'));
  const cli = fileURLToPath(new URL('../../dist/cli/main.js', import.meta.url));
  const call = (args: string[]) => spawnSync(process.execPath, [cli, ...args], {encoding: 'utf8'});
  try {
    expect(call(['--help']).status).toBe(0);
    expect(call(['--version']).stdout.trim()).toBe('0.0.0');
    const file = join(directory, 'input.json');
    await writeFile(file, '{');
    expect(call(['validate', file]).status).toBe(1);
    await writeFile(file, '{}');
    const unsupported = call(['validate', file, '--format', 'json']);
    expect(unsupported.status).toBe(2);
    expect(unsupported.stderr).toBe('');
    expect(JSON.parse(unsupported.stdout)).toMatchObject({status: 'tool-error'});
    expect(call(['validate', join(directory, 'missing')]).status).toBe(2);
    expect(call(['validate', directory]).status).toBe(2);
  } finally { await rm(directory, {recursive: true, force: true}); }
});
