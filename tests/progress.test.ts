import { describe, expect, it } from 'vitest';
import { allLessons, getModule } from '../src/core/curriculum.js';
import { continueLesson, nextLesson } from '../src/core/navigation.js';
import { completeLesson, initialState, percentage } from '../src/core/progress.js';
import { validateState } from '../src/core/validation.js';

describe('progress and navigation', () => {
  it('awards XP only once and derives module completion', () => {
    const state = initialState();
    const module = getModule('foundations');
    expect(percentage(state)).toBe(0);
    expect(completeLesson(state, module.lessons[0]!)).toBe(true);
    expect(completeLesson(state, module.lessons[0]!)).toBe(false);
    expect(state.xp).toBe(10);
    module.lessons.forEach(l => completeLesson(state, l));
    expect(state.completedModules).toEqual(['foundations']);
    expect(percentage(state, module.lessons)).toBe(100);
    expect(percentage(state)).toBe(15);
    expect(percentage(state, [])).toBe(0);
    expect(validateState(state)).toEqual(state);
  });
  it('continues an unfinished lesson, then advances and eventually fills earlier gaps', () => {
    const state = initialState();
    expect(continueLesson(state)).toEqual(allLessons[0]);
    state.currentModule = allLessons[5]!.moduleId;
    state.currentLesson = allLessons[5]!.id;
    expect(continueLesson(state)).toEqual(allLessons[5]);
    completeLesson(state, allLessons[5]!);
    expect(continueLesson(state)).toEqual(allLessons[6]);
    allLessons.slice(6).forEach(l => completeLesson(state, l));
    expect(continueLesson(state)).toEqual(allLessons[0]);
    allLessons.forEach(l => completeLesson(state, l));
    expect(continueLesson(state)).toBeUndefined();
    expect(nextLesson(allLessons.at(-1)!)).toBeUndefined();
    expect(percentage(state)).toBe(100);
  });
  it('rejects incompatible, inconsistent or fabricated persisted values', () => {
    const state = initialState();
    for (const patch of [{ version: 2 }, { xp: 999 }, { completedLessons: ['no/such'] }, { currentModule: 'linux' }, { settings: { locale: 'es' } }, { quizScores: { '__proto__': null, unknown: {} } }]) {
      expect(() => validateState({ ...state, ...patch })).toThrow('invalid');
    }
    expect(() => validateState(null)).toThrow();
    expect(() => validateState({ ...state, settings: { ...state.settings, color: ['auto'] } })).toThrow('invalid');
  });
});
