import { getModule } from '../core/curriculum.js';
import { gradeQuiz } from '../core/quiz.js';
import { choose, requireInteractive } from '../ui/prompts.js';
import { t } from '../i18n/index.js';
import { update, type Context } from './context.js';

export async function quiz(ctx: Context, moduleId: string): Promise<void> {
  const module = getModule(moduleId);
  requireInteractive();
  const answers: number[] = [];
  for (const lesson of module.lessons) {
    ctx.ui.title(`${module.title.toUpperCase()} QUIZ / ${answers.length + 1} of ${module.lessons.length}`);
    const answer = await choose(lesson.question.prompt, [
      ...lesson.question.choices.map((name, index) => ({ name, value: String(index) })),
      { name: 'Back (discard this attempt)', value: 'back' },
    ], ctx.ui);
    if (answer === 'back') { ctx.ui.line(t('cancelled')); return; }
    answers.push(Number(answer));
    ctx.ui.line(`${Number(answer) === lesson.question.answer ? t('correct') : t('incorrect')} ${lesson.question.explanation}`);
  }
  const score = gradeQuiz(module, answers);
  await update(ctx, state => { state.quizScores[moduleId] = score; });
  ctx.ui.title(`${module.title.toUpperCase()} QUIZ COMPLETE`);
  ctx.ui.line(`Score: ${score.score}/${score.total}\nAccuracy: ${Math.round(score.score / score.total * 100)}%`);
  const titles = (ids: string[]): string => ids.map(id => module.lessons.find(l => l.id === id)!.title).join('\n') || 'None';
  ctx.ui.section('STRONG AREAS', titles(score.strong));
  ctx.ui.section('REVIEW', titles(score.review));
  ctx.ui.line('Quiz scores do not mark lessons complete or award additional XP.');
}
