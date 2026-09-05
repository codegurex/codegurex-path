import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { getLesson, getModule, modules, validateCurriculum } from './core/curriculum.js';
import { initialState } from './core/progress.js';
import { Storage } from './core/storage.js';
import { Terminal } from './ui/terminal.js';
import { start } from './commands/start.js';
import { about, practice, progress, roadmap } from './commands/views.js';
import { learn, lessonSession } from './commands/learning.js';
import { quiz } from './commands/quiz.js';
import { reset, settings } from './commands/settings.js';
import type { Context } from './commands/context.js';

export async function run(argv = process.argv): Promise<void> {
  validateCurriculum(modules);
  const metadata = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
  const cli = new Command().name('codegurex-path').description('Learn how systems work. Then learn how to secure them.')
    .version(metadata.version).option('--plain', 'Use plain ASCII output and numbered interactive prompts')
    .option('--no-color', 'Disable colors').showHelpAfterError().exitOverride();
  const context = async (readState = true): Promise<Context> => {
    const storage = new Storage();
    const state = readState ? await storage.read() : initialState();
    const options = cli.opts<{ plain?: boolean; color?: boolean }>();
    const plain = Boolean(options.plain);
    if (options.color === false) process.env.NO_COLOR = '1';
    const ui = new Terminal();
    ui.configure(state.settings, plain);
    return { ui, storage, state, plain };
  };
  const readOnly = (): boolean => !process.stdin.isTTY || !process.stdout.isTTY;
  cli.action(async () => {
    if (readOnly()) { const ctx = await context(false); ctx.ui.banner(); cli.outputHelp(); return; }
    await start(await context());
  });
  cli.command('start').description('Open onboarding and the interactive learning menu').action(async () => { await start(await context()); });
  cli.command('roadmap').description('Show all 13 stages and local completion').action(async () => { roadmap(await context()); });
  cli.command('learn <module>').description('Choose a lesson; lists lessons when output is redirected').action(async (id: string) => { getModule(id); await learn(await context(), id, readOnly()); });
  cli.command('lesson <module> <lesson>').description('Read a lesson and answer its knowledge check')
    .option('--read-only', 'Print the lesson without prompting or saving').action(async (module: string, id: string, options: { readOnly?: boolean }) => {
      const lesson = getLesson(module, id); await lessonSession(await context(), lesson, Boolean(options.readOnly) || readOnly());
    });
  cli.command('quiz <module>').description('Take a module quiz; requires an interactive terminal').action(async (id: string) => { getModule(id); await quiz(await context(), id); });
  cli.command('practice <module> [lesson]').description('Show safe exercises; never runs their commands').action(async (id: string, lessonId?: string) => {
    const module = getModule(id);
    const lessons = lessonId ? [getLesson(id, lessonId)] : module.lessons;
    const ctx = await context(false);
    for (const lesson of lessons) { ctx.ui.title(`${module.title} / ${lesson.title}`); practice(ctx, lesson); }
  });
  cli.command('progress').description('Show local completion, XP and latest quiz scores')
    .option('--json', 'Print machine-readable progress').action(async (options: { json?: boolean }) => {
      const ctx = await context(); if (options.json) console.log(JSON.stringify(ctx.state, null, 2)); else progress(ctx);
    });
  cli.command('settings').description('Edit display preferences; prints settings outside a terminal').action(async () => { await settings(await context()); });
  cli.command('reset').description('Archive progress and settings, then start fresh; requires confirmation')
    .option('--confirm <word>', 'Explicit non-interactive confirmation: RESET').action(async (options: { confirm?: string }) => { await reset(await context(false), options.confirm); });
  cli.command('about').description('Show the project philosophy and brand').action(async () => { about(await context(false)); });
  await cli.parseAsync(argv);
}
