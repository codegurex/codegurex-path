import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

let dir: string;
beforeAll(() => { dir = mkdtempSync(join(tmpdir(), 'codegurex-cli-')); });
afterAll(() => { rmSync(dir, { recursive: true, force: true }); });
const cli = (...args: string[]) => spawnSync(process.execPath, [resolve('dist/index.js'), ...args], {
  env: { ...process.env, CODEGUREX_PATH_HOME: dir, NO_COLOR: '1' }, encoding: 'utf8', timeout: 10000,
});
describe('built CLI smoke checks', () => {
  it('shows help, version and non-TTY startup without creating state', () => {
    for (const args of [[], ['--help'], ['--version']]) {
      const result = cli(...args);
      expect(result.status, result.stderr).toBe(0);
      expect(result.stdout).not.toContain('\x1b[');
    }
    expect(cli('--version').stdout.trim()).toBe('0.1.0');
    expect(readdirSync(dir)).toEqual([]);
  });
  it('renders roadmap, lessons, practice, progress, settings and about offline', () => {
    for (const args of [['roadmap'], ['learn', 'networking'], ['lesson', 'networking', 'dns'], ['practice', 'networking', 'ip-addresses'], ['progress'], ['settings'], ['about']]) {
      const result = cli(...args);
      expect(result.status, result.stderr).toBe(0);
      expect(result.stdout.length).toBeGreaterThan(20);
      expect(result.stdout).not.toContain('\x1b[');
    }
    expect(JSON.parse(cli('progress', '--json').stdout).xp).toBe(0);
    expect(readdirSync(dir)).toEqual([]);
  });
  it('fails politely on unknown targets, invalid options and non-TTY quiz', () => {
    for (const args of [['wat'], ['learn', 'cloud'], ['lesson', 'networking', 'missing'], ['quiz', 'linux'], ['--bad-option'], ['start']]) {
      const result = cli(...args);
      expect(result.status).toBe(1);
      expect(result.stderr).not.toContain('at async');
      expect(result.stderr.length).toBeGreaterThan(5);
    }
  });
  it('requires explicit reset confirmation and can recover corrupt state', () => {
    writeFileSync(join(dir, 'state.json'), '{corrupt');
    expect(cli('reset').status).toBe(1);
    expect(cli('reset', '--confirm', 'no').stdout).toContain('Cancelled');
    expect(readFileSync(join(dir, 'state.json'), 'utf8')).toBe('{corrupt');
    expect(cli('progress').status).toBe(1);
    const result = cli('reset', '--confirm', 'RESET');
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(cli('progress', '--json').stdout).xp).toBe(0);
    const backup = readdirSync(dir).find(f => f.startsWith('state-backup-'));
    expect(readFileSync(join(dir, backup!), 'utf8')).toBe('{corrupt');
  });
});
