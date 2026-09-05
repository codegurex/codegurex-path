import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, readdir, rm, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Storage, dataDirectory } from '../src/core/storage.js';
import { completeLesson } from '../src/core/progress.js';
import { allLessons } from '../src/core/curriculum.js';

let dir: string;
beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), 'codegurex-test-')); });
afterEach(async () => { await rm(dir, { recursive: true, force: true }); });

describe('safe local persistence', () => {
  it('reads first-use defaults without creating any files', async () => {
    const store = new Storage(join(dir, 'missing'));
    expect((await store.read()).xp).toBe(0);
    expect(await readdir(dir)).toEqual([]);
  });
  it('persists updates and merges changes from separate sessions', async () => {
    const first = new Storage(dir);
    const second = new Storage(dir);
    await first.update(s => { completeLesson(s, allLessons[0]!); });
    await second.update(s => { completeLesson(s, allLessons[1]!); });
    const saved = await first.read();
    expect(saved.xp).toBe(20);
    expect(saved.completedLessons).toHaveLength(2);
    expect(await readdir(dir)).toEqual(['state.json']);
  });
  it('preserves corrupt data and archives it only on explicit reset', async () => {
    const store = new Storage(dir);
    await writeFile(store.file, '{broken');
    await expect(store.update(s => { s.xp = 0; })).rejects.toThrow('corrupt');
    expect(await readFile(store.file, 'utf8')).toBe('{broken');
    const backup = await store.reset();
    expect(await readFile(backup!, 'utf8')).toBe('{broken');
    expect((await store.read()).completedLessons).toEqual([]);
  });
  it('refuses overlapping saves and leaves the current state intact', async () => {
    const store = new Storage(dir);
    await store.update(() => {});
    const before = await readFile(store.file, 'utf8');
    await writeFile(join(dir, 'state.lock'), 'another session');
    await expect(store.update(s => { completeLesson(s, allLessons[0]!); })).rejects.toThrow('Another session');
    expect(await readFile(store.file, 'utf8')).toBe(before);
  });
  it('rejects invalid updates without destroying a valid state', async () => {
    const store = new Storage(dir);
    await store.update(() => {});
    await expect(store.update(s => { s.xp = -10; })).rejects.toThrow('invalid');
    expect((await store.read()).xp).toBe(0);
    expect(await readdir(dir)).toEqual(['state.json']);
  });
  it.skipIf(process.platform === 'win32')('rejects symbolic links to unrelated data', async () => {
    const store = new Storage(dir);
    const unrelated = join(dir, 'unrelated.json');
    await writeFile(unrelated, '{}');
    await symlink(unrelated, store.file);
    await expect(store.read()).rejects.toThrow('unlinked');
    await expect(store.reset()).rejects.toThrow('unlinked');
    expect(await readFile(unrelated, 'utf8')).toBe('{}');
  });
  it('resolves native user directories and rejects relative overrides', () => {
    expect(dataDirectory('win32', { APPDATA: dir }, dir)).toBe(join(dir, 'codegurex-path'));
    expect(dataDirectory('linux', { XDG_CONFIG_HOME: dir }, dir)).toBe(join(dir, 'codegurex-path'));
    expect(dataDirectory('darwin', {}, dir)).toBe(join(dir, '.config', 'codegurex-path'));
    expect(() => dataDirectory('linux', { CODEGUREX_PATH_HOME: './here' }, dir)).toThrow('absolute');
  });
});
