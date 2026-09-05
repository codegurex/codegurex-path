export interface Question {
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
}
export interface Practice {
  instruction: string;
  observation: string;
  commands?: Partial<Record<'win32' | 'linux' | 'darwin' | 'all', string>>;
}
export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  explanation: string;
  whyItMatters: string;
  example: string;
  keyConcepts: string[];
  practice: Practice;
  question: Question;
}
export interface LearningModule {
  id: string;
  title: string;
  lessons: Lesson[];
}
export interface FutureStage { id: string; title: string; topics: string[] }
