// UI copy is separate from stable content IDs and persistence keys.
export const en = {
  choose: 'What would you like to do?', back: 'Back', exit: 'Exit', next: 'Next lesson',
  continue: 'Continue learning', roadmap: 'Explore roadmap', modules: 'Start another module',
  practice: 'Practice', quiz: 'Take a quiz', progress: 'View progress', settings: 'Settings',
  about: 'About CodeGurex Path', what: 'WHAT IT IS', why: 'WHY IT MATTERS',
  example: 'EXAMPLE', concepts: 'KEY CONCEPTS', try: 'TRY IT', observation: 'WHAT TO OBSERVE',
  question: 'QUESTION', correct: 'Correct.', incorrect: 'Not quite.',
  completed: 'Lesson completed.', earned: '+10 XP', already: 'Already completed; XP unchanged.',
  noTTY: 'Open an interactive terminal for this action. Use --help for direct commands.',
  safety: 'Practice only on systems you own or are explicitly authorized to use. Commands are examples; nothing is executed by CodeGurex Path.',
  welcome: 'Welcome to CodeGurex Path. Cybersecurity starts with understanding systems.',
  start: 'Start from zero', experienced: 'I already know the fundamentals',
  reset: 'Type RESET to archive all progress and settings and start again',
  cancelled: 'Cancelled. Saved progress is unchanged.',
  allDone: 'All V0.1 lessons completed. Review a module or take a quiz.',
};
export type MessageKey = keyof typeof en;
