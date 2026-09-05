import { allLessons, lessonKey, modules } from './curriculum.js';
import type { Lesson } from '../types/curriculum.js';
import type { State } from '../types/progress.js';

export function initialState(): State {
  const now = new Date().toISOString();
  return { version: 1, startedAt: now, lastOpenedAt: now, currentModule: null, currentLesson: null,
    completedLessons: [], completedModules: [], quizScores: {}, xp: 0,
    settings: { locale: 'en', color: 'auto', unicode: 'auto', onboardingDone: false } };
}
export function percentage(state: State, lessons: Lesson[] = allLessons): number {
  if (!lessons.length) return 0;
  const count = lessons.filter(l => state.completedLessons.includes(lessonKey(l))).length;
  return Math.round(count / lessons.length * 100);
}
export function completeLesson(state: State, lesson: Lesson): boolean {
  const key = lessonKey(lesson);
  if (state.completedLessons.includes(key)) return false;
  state.completedLessons.push(key);
  state.xp = state.completedLessons.length * 10;
  state.completedModules = modules.filter(m => m.lessons.every(l => state.completedLessons.includes(lessonKey(l)))).map(m => m.id);
  return true;
}
