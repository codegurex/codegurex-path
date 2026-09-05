import { describe, expect, it } from 'vitest';
import { allLessons, futureStages, getLesson, getModule, modules, validateCurriculum } from '../src/core/curriculum.js';
import { gradeQuiz } from '../src/core/quiz.js';

describe('curriculum contracts', () => {
  it('loads 40 complete, ordered lessons across four modules and nine future stages', () => {
    expect(allLessons).toHaveLength(40);
    expect(modules.map(m => m.lessons.length)).toEqual([6, 14, 11, 9]);
    expect(futureStages).toHaveLength(9);
    expect(() => validateCurriculum(modules)).not.toThrow();
    expect(getLesson('networking', 'dns').title).toBe('DNS');
  });
  it('rejects unavailable modules and invalid lessons', () => {
    expect(() => getModule('ai-security')).toThrow('unavailable');
    expect(() => getLesson('networking', '../../file')).toThrow('Unknown lesson');
    const copy = structuredClone(modules);
    copy[0]!.lessons[0]!.question.answer = 100;
    expect(() => validateCurriculum(copy)).toThrow('question');
  });
  it('rejects duplicate identities and incomplete content', () => {
    const duplicate = structuredClone(modules);
    duplicate[0]!.lessons[1]!.id = duplicate[0]!.lessons[0]!.id;
    expect(() => validateCurriculum(duplicate)).toThrow('identity');
    const incomplete = structuredClone(modules);
    incomplete[0]!.lessons[0]!.practice.observation = '';
    expect(() => validateCurriculum(incomplete)).toThrow('incomplete');
  });
  it('scores conceptual answers and identifies review areas', () => {
    const module = getModule('foundations');
    const answers = module.lessons.map(l => l.question.answer);
    answers[0] = (answers[0]! + 1) % module.lessons[0]!.question.choices.length;
    const result = gradeQuiz(module, answers);
    expect(result.score).toBe(5);
    expect(result.review).toEqual(['computers']);
    expect(result.strong).toHaveLength(5);
    expect(() => gradeQuiz(module, [])).toThrow('Answer every');
    expect(() => gradeQuiz(module, answers.map(() => -1))).toThrow('valid choice');
  });
});
