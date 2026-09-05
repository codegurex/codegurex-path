import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { choose } from '../src/ui/prompts.js';
import { Storage } from '../src/core/storage.js';
import { Terminal } from '../src/ui/terminal.js';
import { getModule } from '../src/core/curriculum.js';
import { lessonSession } from '../src/commands/learning.js';
import { quiz } from '../src/commands/quiz.js';
import type { Context } from '../src/commands/context.js';

vi.mock('../src/ui/prompts.js', () => ({ choose: vi.fn(), requireInteractive: vi.fn() }));
let ctx: Context;
beforeEach(async () => {
  const dir = await mkdtemp(join(tmpdir(), 'codegurex-flow-'));
  const storage = new Storage(dir);
  ctx = { storage, state: await storage.read(), ui: new Terminal(), plain: true };
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.mocked(choose).mockReset();
});
afterEach(async () => { vi.restoreAllMocks(); await rm(ctx.storage.directory, { recursive: true, force: true }); });

describe('learning workflows', () => {
  it('does not complete a lesson after a wrong answer followed by Back', async () => {
    const lesson = getModule('foundations').lessons[0]!;
    vi.mocked(choose).mockResolvedValueOnce('0').mockResolvedValueOnce('back');
    await lessonSession(ctx, lesson);
    expect((await ctx.storage.read()).xp).toBe(0);
    expect((await ctx.storage.read()).currentLesson).toBe('computers');
  });
  it('saves a successful check and prevents repeated XP through the actual command flow', async () => {
    const lesson = getModule('foundations').lessons[0]!;
    for (let i = 0; i < 2; i++) {
      vi.mocked(choose).mockResolvedValueOnce(String(lesson.question.answer)).mockResolvedValueOnce('back');
      await lessonSession(ctx, lesson);
    }
    expect((await ctx.storage.read()).xp).toBe(10);
    expect((await ctx.storage.read()).completedLessons).toEqual(['foundations/computers']);
  });
  it('leaves no state change when reading a lesson without interaction', async () => {
    await lessonSession(ctx, getModule('networking').lessons[0]!, true);
    expect(choose).not.toHaveBeenCalled();
    expect((await ctx.storage.read()).currentLesson).toBeNull();
  });
  it('saves full quiz results but discards a later cancelled attempt', async () => {
    const module = getModule('foundations');
    for (const lesson of module.lessons) vi.mocked(choose).mockResolvedValueOnce(String(lesson.question.answer));
    await quiz(ctx, module.id);
    const before = await ctx.storage.read();
    expect(before.quizScores.foundations!.score).toBe(6);
    expect(before.xp).toBe(0);
    vi.mocked(choose).mockResolvedValueOnce('back');
    await quiz(ctx, module.id);
    expect(await ctx.storage.read()).toEqual(before);
  });
});
