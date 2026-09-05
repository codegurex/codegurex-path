import { allLessons, modules } from '../core/curriculum.js';
import { continueLesson } from '../core/navigation.js';
import { percentage } from '../core/progress.js';
import { choose, requireInteractive } from '../ui/prompts.js';
import { t } from '../i18n/index.js';
import { refresh, update, type Context } from './context.js';
import { learn, lessonSession } from './learning.js';
import { quiz } from './quiz.js';
import { settings } from './settings.js';
import { about, practice, progress, roadmap } from './views.js';

async function selectModule(ctx: Context): Promise<string> {
  return choose('Choose a module', [...modules.map(m => ({ name: m.title, value: m.id })), { name: t('back'), value: 'back' }], ctx.ui);
}
export async function start(ctx: Context): Promise<void> {
  requireInteractive();
  await update(ctx, () => {});
  ctx.ui.banner();
  if (!ctx.state.settings.onboardingDone) {
    ctx.ui.line(t('welcome'));
    const action = await choose('How would you like to begin?', [
      { name: t('start'), value: 'start' }, { name: t('roadmap'), value: 'roadmap' },
      { name: t('experienced'), value: 'modules' }, { name: t('exit'), value: 'exit' },
    ], ctx.ui);
    if (action === 'exit') return;
    await update(ctx, s => { s.settings.onboardingDone = true; });
    if (action === 'start') await lessonSession(ctx, allLessons[0]!);
    else if (action === 'roadmap') roadmap(ctx);
    else { const id = await selectModule(ctx); if (id !== 'back') await learn(ctx, id); }
  }
  while (true) {
    await refresh(ctx);
    ctx.ui.line(`\nOverall progress: ${percentage(ctx.state)}% | XP: ${ctx.state.xp}\nCurrent path: ${ctx.state.currentModule || 'Not started'}\nLast lesson: ${ctx.state.currentLesson || 'None'}`);
    const actions = ['continue', 'roadmap', 'modules', 'practice', 'quiz', 'progress', 'settings', 'about', 'exit'] as const;
    const action = await choose(t('choose'), actions.map(value => ({ name: t(value), value })), ctx.ui);
    if (action === 'exit') return;
    ctx.ui.clear();
    if (action === 'continue') {
      const lesson = continueLesson(ctx.state);
      if (lesson) await lessonSession(ctx, lesson); else ctx.ui.line(t('allDone'));
    } else if (action === 'roadmap') roadmap(ctx);
    else if (action === 'progress') progress(ctx);
    else if (action === 'about') about(ctx);
    else if (action === 'settings') await settings(ctx);
    else {
      const id = await selectModule(ctx);
      if (id === 'back') continue;
      if (action === 'modules') await learn(ctx, id);
      else if (action === 'quiz') await quiz(ctx, id);
      else {
        const module = modules.find(m => m.id === id)!;
        const lessonId = await choose('Choose a practice', [...module.lessons.map(l => ({ name: l.title, value: l.id })), { name: t('back'), value: 'back' }], ctx.ui);
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) practice(ctx, lesson);
      }
    }
  }
}
