import foundations from '../content/foundations.js';
import networking from '../content/networking.js';
import linux from '../content/linux.js';
import programming from '../content/programming.js';
import type { LearningModule, Lesson } from '../types/curriculum.js';
export { futureStages } from '../content/roadmap.js';

export const modules: LearningModule[] = [
  { id: 'foundations', title: 'Foundations', lessons: foundations },
  { id: 'networking', title: 'Networking', lessons: networking },
  { id: 'linux', title: 'Linux', lessons: linux },
  { id: 'programming', title: 'Programming', lessons: programming },
];
export const allLessons = modules.flatMap(m => m.lessons);
export const lessonKey = (lesson: Lesson): string => `${lesson.moduleId}/${lesson.id}`;
export function getModule(id: string): LearningModule {
  const module = modules.find(m => m.id === id);
  if (!module) throw new Error(`Module "${id}" is unavailable. Choose: ${modules.map(m => m.id).join(', ')}. See roadmap for future stages.`);
  return module;
}
export function getLesson(moduleId: string, id: string): Lesson {
  const module = getModule(moduleId);
  const lesson = module.lessons.find(l => l.id === id);
  if (!lesson) throw new Error(`Unknown lesson "${id}". Run: codegurex-path learn ${moduleId}`);
  return lesson;
}
export function validateCurriculum(curriculum: LearningModule[]): void {
  const ids = new Set<string>();
  for (const module of curriculum) {
    if (!/^[a-z][a-z0-9-]*$/.test(module.id) || ids.has(module.id) || !module.title || !module.lessons.length) throw new Error('Invalid or duplicate module.');
    ids.add(module.id);
    const lessons = new Set<string>();
    module.lessons.forEach((l, index) => {
      if (!/^[a-z][a-z0-9-]*$/.test(l.id) || lessons.has(l.id) || l.moduleId !== module.id || l.order !== index + 1) throw new Error('Invalid lesson identity or order.');
      lessons.add(l.id);
      if ([l.title, l.explanation, l.whyItMatters, l.example, l.practice.instruction, l.practice.observation, l.question.prompt, l.question.explanation].some(s => !s?.trim()) || !l.keyConcepts.length) throw new Error('Lesson content is incomplete.');
      const q = l.question;
      if (q.choices.length < 2 || new Set(q.choices).size !== q.choices.length || q.choices.some(s => !s.trim()) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) throw new Error('Invalid question.');
    });
  }
}
