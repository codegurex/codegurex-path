import type { Lesson, Practice } from '../types/curriculum.js';

export type LessonSeed = [id: string, title: string, explanation: string, why: string,
  example: string, concepts: string[], practice: Practice, prompt: string,
  choices: string[], answer: number, feedback: string];

export function lessons(moduleId: string, seeds: LessonSeed[]): Lesson[] {
  return seeds.map(([id, title, explanation, whyItMatters, example, keyConcepts, practice,
    prompt, choices, answer, feedback], index) => ({
    id, moduleId, order: index + 1, title, explanation, whyItMatters, example, keyConcepts,
    practice, question: { prompt, choices, answer, explanation: feedback },
  }));
}
