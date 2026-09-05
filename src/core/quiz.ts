import type { LearningModule } from '../types/curriculum.js';
import type { QuizScore } from '../types/progress.js';
export function gradeQuiz(module: LearningModule, answers: number[]): QuizScore {
  if (answers.length !== module.lessons.length || answers.some((a, i) => !Number.isInteger(a) || a < 0 || a >= module.lessons[i]!.question.choices.length)) throw new Error('Answer every question with a valid choice.');
  const strong: string[] = [];
  const review: string[] = [];
  module.lessons.forEach((l, index) => (answers[index] === l.question.answer ? strong : review).push(l.id));
  return { score: strong.length, total: module.lessons.length, at: new Date().toISOString(), strong, review };
}
