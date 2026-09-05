import { getModule, lessonKey } from '../core/curriculum.js';
import { completeLesson } from '../core/progress.js';
import { nextLesson } from '../core/navigation.js';
import { choose } from '../ui/prompts.js';
import { t } from '../i18n/index.js';
import type { Lesson } from '../types/curriculum.js';
import type { Context } from './context.js';
import { update } from './context.js';
import { practice } from './views.js';

export function renderLesson(ctx: Context, lesson: Lesson): void {
  const module = getModule(lesson.moduleId);
  ctx.ui.title(`${module.title.toUpperCase()} / ${lesson.order} of ${module.lessons.length}\n${lesson.title}`);
  ctx.ui.section(t('what'), lesson.explanation);
  ctx.ui.section(t('why'), lesson.whyItMatters);
  ctx.ui.section(t('example'), lesson.example);
  ctx.ui.section(t('concepts'), lesson.keyConcepts.join(' | '));
  practice(ctx, lesson);
}

export async function lessonSession(ctx: Context, first: Lesson, readOnly = false): Promise<void> {
  let lesson: Lesson | undefined = first;
  while (lesson) {
    const current = lesson;
    if (!readOnly) await update(ctx, state => { state.currentModule = current.moduleId; state.currentLesson = current.id; });
    renderLesson(ctx, current);
    if (readOnly) {
      ctx.ui.section(t('question'), current.question.prompt);
      current.question.choices.forEach((value, index) => ctx.ui.line(`${index + 1}. ${value}`));
      ctx.ui.line('\nRead-only view. Open this lesson in an interactive terminal to answer and save progress.');
      return;
    }
    let passed = false;
    while (!passed) {
      const answer = await choose(current.question.prompt, [
        ...current.question.choices.map((name, index) => ({ name, value: String(index) })),
        { name: t('back'), value: 'back' },
      ], ctx.ui);
      if (answer === 'back') return;
      passed = Number(answer) === current.question.answer;
      ctx.ui.line(`${passed ? t('correct') : t('incorrect')} ${current.question.explanation}`);
      if (!passed) {
        const action = await choose('Review and try again?', [{ name: 'Try again', value: 'retry' }, { name: t('back'), value: 'back' }], ctx.ui);
        if (action === 'back') return;
      }
    }
    let earned = false;
    await update(ctx, state => { earned = completeLesson(state, current); });
    ctx.ui.line(`${t('completed')} ${earned ? t('earned') : t('already')}`);
    const next = nextLesson(current);
    const action = await choose('Continue?', [
      ...(next ? [{ name: `${t('next')}: ${next.title}`, value: 'next' }] : []),
      { name: t('back'), value: 'back' },
    ], ctx.ui);
    if (action === 'back') return;
    lesson = next;
    ctx.ui.clear();
  }
}

export async function learn(ctx: Context, moduleId: string, readOnly = false): Promise<void> {
  const module = getModule(moduleId);
  if (readOnly) {
    ctx.ui.title(module.title);
    module.lessons.forEach(l => ctx.ui.line(`${ctx.state.completedLessons.includes(lessonKey(l)) ? '[x]' : '[ ]'} ${l.order}. ${l.title}\n  codegurex-path lesson ${module.id} ${l.id}`));
    return;
  }
  while (true) {
    const id = await choose(`${module.title} / Choose a lesson`, [
      ...module.lessons.map(l => ({ name: `${ctx.state.completedLessons.includes(lessonKey(l)) ? '[x]' : '[ ]'} ${l.title}`, value: l.id })),
      { name: t('back'), value: 'back' },
    ], ctx.ui);
    if (id === 'back') return;
    await lessonSession(ctx, module.lessons.find(l => l.id === id)!);
  }
}
