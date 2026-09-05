import { allLessons, lessonKey } from './curriculum.js';
import type { Lesson } from '../types/curriculum.js';
import type { State } from '../types/progress.js';

export function nextLesson(lesson: Lesson): Lesson | undefined {
  const index = allLessons.findIndex(l => lessonKey(l) === lessonKey(lesson));
  return index < 0 ? undefined : allLessons[index + 1];
}
export function continueLesson(state: State): Lesson | undefined {
  const current = allLessons.find(l => l.moduleId === state.currentModule && l.id === state.currentLesson);
  if (current && !state.completedLessons.includes(lessonKey(current))) return current;
  if (current) {
    const later = allLessons.slice(allLessons.indexOf(current) + 1).find(l => !state.completedLessons.includes(lessonKey(l)));
    if (later) return later;
  }
  return allLessons.find(l => !state.completedLessons.includes(lessonKey(l)));
}
