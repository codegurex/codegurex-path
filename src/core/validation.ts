import { allLessons, lessonKey, modules } from './curriculum.js';
import type { State } from '../types/progress.js';

const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === 'string');
const date = (v: unknown): boolean => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v));
export function validateState(v: unknown): State {
  const fail = (): never => { throw new Error('Saved data is invalid or from an unsupported version. It was preserved. Use reset to archive it and start again.'); };
  if (!record(v) || v.version !== 1) return fail();
  if (!date(v.startedAt) || !date(v.lastOpenedAt) || !strings(v.completedLessons) || !strings(v.completedModules)) return fail();
  const validKeys = new Set(allLessons.map(lessonKey));
  if (v.completedLessons.some(k => !validKeys.has(k)) || new Set(v.completedLessons).size !== v.completedLessons.length) return fail();
  if (v.xp !== v.completedLessons.length * 10) return fail();
  const completed = v.completedLessons;
  const expectedModules = modules.filter(m => m.lessons.every(l => completed.includes(lessonKey(l)))).map(m => m.id);
  if (v.completedModules.length !== expectedModules.length || new Set(v.completedModules).size !== v.completedModules.length || v.completedModules.some(id => !expectedModules.includes(id))) return fail();
  if (!(v.currentModule === null && v.currentLesson === null) && !allLessons.some(l => l.moduleId === v.currentModule && l.id === v.currentLesson)) return fail();
  if (!record(v.settings) || v.settings.locale !== 'en' || (v.settings.color !== 'auto' && v.settings.color !== 'off') || (v.settings.unicode !== 'auto' && v.settings.unicode !== 'off') || typeof v.settings.onboardingDone !== 'boolean') return fail();
  if (!record(v.quizScores)) return fail();
  for (const [id, score] of Object.entries(v.quizScores)) {
    const module = modules.find(m => m.id === id);
    if (!module || !record(score) || !Number.isInteger(score.score) || typeof score.score !== 'number' || score.score < 0 || score.total !== module.lessons.length || score.score > module.lessons.length || !date(score.at) || !strings(score.strong) || !strings(score.review)) return fail();
    const combined = [...score.strong, ...score.review];
    if (score.strong.length !== score.score || combined.length !== module.lessons.length || new Set(combined).size !== combined.length || combined.some(key => !module.lessons.some(l => l.id === key))) return fail();
  }
  return v as unknown as State;
}
