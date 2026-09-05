import { modules, futureStages, lessonKey } from '../core/curriculum.js';
import { percentage } from '../core/progress.js';
import { t } from '../i18n/index.js';
import type { Lesson } from '../types/curriculum.js';
import type { Context } from './context.js';

export function roadmap({ ui, state }: Context): void {
  ui.title('CODEGUREX SECURITY ROADMAP');
  ui.line('[x] Completed  [~] In progress  [ ] Available  [future] Planned');
  modules.forEach((m, index) => {
    const count = m.lessons.filter(l => state.completedLessons.includes(lessonKey(l))).length;
    ui.section(`${String(index + 1).padStart(2, '0')} / ${m.title} ${count === m.lessons.length ? '[x]' : count || state.currentModule === m.id ? '[~]' : '[ ]'}`, `${count}/${m.lessons.length} lessons`);
    m.lessons.forEach(l => ui.line(`  ${state.completedLessons.includes(lessonKey(l)) ? '[x]' : '[ ]'} ${l.title} (${l.id})`));
    ui.line(ui.caps.unicode ? '    ↓' : '    |');
  });
  futureStages.forEach((stage, index) => ui.section(`${String(index + 5).padStart(2, '0')} / ${stage.title} [future]`, stage.topics.join(' | ')));
  ui.line('\nFuture stages are not playable in V0.1. Local exercises are available now through practice.');
}
export function progress({ ui, state }: Context): void {
  ui.title('YOUR PROGRESS');
  ui.line(`Overall ${ui.bar(percentage(state))}`);
  for (const m of modules) ui.line(`${m.title}\n${ui.bar(percentage(state, m.lessons))}`);
  ui.line(`\nCompleted lessons: ${state.completedLessons.length}\nXP: ${state.xp}\nLast lesson: ${state.currentModule || 'None'} / ${state.currentLesson || 'None'}`);
  for (const [module, score] of Object.entries(state.quizScores)) ui.line(`Latest ${module} quiz: ${score.score}/${score.total} (${Math.round(score.score / score.total * 100)}%)`);
}
export function about({ ui }: Context): void {
  ui.title('ABOUT CODEGUREX PATH');
  ui.line('An open learning project by CodeGurex Security.\nHelp people understand how modern systems work before teaching them how to secure them.\nSecurity for the AI Era.\ncodegurex.com');
  ui.section('OUR PHILOSOPHY', 'Learn how systems work before trying to break them.\nBuild before attacking.\nUnderstand the protocol, not only the tool.\nAutomate what you understand.\nPractice only in authorized environments.\nDocument everything.\nSecurity is engineering.');
}
export function practice(ctx: Context, lesson: Lesson): void {
  const { ui } = ctx;
  ui.section(t('try'), lesson.practice.instruction);
  const commands = lesson.practice.commands;
  if (commands) {
    const platform = process.platform as 'win32' | 'linux' | 'darwin';
    const command = commands[platform] || commands.all;
    if (command) { ui.line(`For ${process.platform}:`); ui.code(command); }
    else ui.line('Use an existing Linux/Bash learning environment for this exercise, or study it conceptually.');
    for (const [os, value] of Object.entries(commands)) if (os !== platform && os !== 'all') { ui.line(`Alternative (${os}):`); ui.code(value); }
  }
  ui.section(t('observation'), lesson.practice.observation);
  ui.line(t('safety'));
}
