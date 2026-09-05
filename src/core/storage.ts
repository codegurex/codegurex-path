import { mkdir, lstat, open, readFile, rename, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { initialState } from './progress.js';
import { validateState } from './validation.js';
import type { State } from '../types/progress.js';

export function dataDirectory(platform = process.platform, env = process.env, home = homedir()): string {
  if (env.CODEGUREX_PATH_HOME) {
    if (!isAbsolute(env.CODEGUREX_PATH_HOME)) throw new Error('CODEGUREX_PATH_HOME must be an absolute path.');
    return resolve(env.CODEGUREX_PATH_HOME);
  }
  const base = platform === 'win32' ? env.APPDATA || join(home, 'AppData', 'Roaming') : env.XDG_CONFIG_HOME || join(home, '.config');
  if (!isAbsolute(base)) throw new Error('The user configuration directory must be an absolute path.');
  return join(base, 'codegurex-path');
}
const hasCode = (error: unknown, code: string): boolean => error instanceof Error && 'code' in error && error.code === code;

export class Storage {
  readonly file: string;
  constructor(readonly directory = dataDirectory()) { this.file = join(directory, 'state.json'); }

  private async inspect(path: string, directory = false): Promise<boolean> {
    try {
      const info = await lstat(path);
      if (info.isSymbolicLink() || (directory ? !info.isDirectory() : !info.isFile()) || (!directory && info.nlink > 1)) throw new Error('Saved data must be a regular, unlinked file in a real directory.');
      if (!directory && info.size > 1_000_000) throw new Error('Saved data is too large. Preserve it and use reset to start again.');
      return true;
    } catch (error) { if (hasCode(error, 'ENOENT')) return false; throw error; }
  }

  async read(): Promise<State> {
    if (!(await this.inspect(this.directory, true)) || !(await this.inspect(this.file))) return initialState();
    let value: unknown;
    try { value = JSON.parse(await readFile(this.file, 'utf8')); }
    catch (error) {
      if (error instanceof SyntaxError) throw new Error('Saved data is corrupt. It was preserved. Use reset to archive it and start again.');
      throw error;
    }
    return validateState(value);
  }

  private async locked<T>(action: () => Promise<T>): Promise<T> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    await this.inspect(this.directory, true);
    const lock = join(this.directory, 'state.lock');
    const handle = await open(lock, 'wx', 0o600).catch(error => {
      if (hasCode(error, 'EEXIST')) throw new Error(`Another session is saving, or a stale lock exists at ${lock}. Close other sessions; if none are running, remove only state.lock and retry.`);
      throw error;
    });
    try { await handle.writeFile(String(process.pid)); return await action(); }
    finally { await handle.close(); await unlink(lock); }
  }

  private async write(state: State): Promise<void> {
    validateState(state);
    const temp = join(this.directory, `.state-${randomUUID()}.tmp`);
    const handle = await open(temp, 'wx', 0o600);
    try {
      try {
        await handle.writeFile(JSON.stringify(state, null, 2) + '\n');
        await handle.sync();
      } finally { await handle.close(); }
      await rename(temp, this.file);
    }
    finally { await unlink(temp).catch(error => { if (!hasCode(error, 'ENOENT')) throw error; }); }
  }

  async update(change: (state: State) => void): Promise<State> {
    return this.locked(async () => {
      const state = await this.read();
      change(state);
      state.lastOpenedAt = new Date().toISOString();
      await this.write(state);
      return state;
    });
  }

  async reset(): Promise<string | undefined> {
    return this.locked(async () => {
      let backup: string | undefined;
      // Reset can recover malformed JSON but never follows a link or removes unrelated files.
      try {
        const info = await lstat(this.file);
        if (!info.isFile() || info.isSymbolicLink() || info.nlink > 1) throw new Error('Reset refused: state.json is not a regular, unlinked file.');
        backup = join(this.directory, `state-backup-${randomUUID()}.json`);
        await rename(this.file, backup);
      } catch (error) { if (!hasCode(error, 'ENOENT')) throw error; }
      await this.write(initialState());
      return backup;
    });
  }
}
