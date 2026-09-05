export interface QuizScore {
  score: number;
  total: number;
  at: string;
  strong: string[];
  review: string[];
}
export interface State {
  version: 1;
  startedAt: string;
  lastOpenedAt: string;
  currentModule: string | null;
  currentLesson: string | null;
  completedLessons: string[];
  completedModules: string[];
  quizScores: Record<string, QuizScore>;
  xp: number;
  settings: { locale: 'en'; color: 'auto' | 'off'; unicode: 'auto' | 'off'; onboardingDone: boolean };
}
