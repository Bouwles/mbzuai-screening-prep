// ============================================================================
//  EXAM SETTINGS — the only file you need to edit to match the real exam.
// ============================================================================
// Sources (see RESEARCH_NOTES.md for links):
//  - MBZUAI undergraduate admissions page + "Screening Exam Guide" for Fall 2027:
//    every BSc applicant takes it; online, AI-proctored (Inspera Exam Portal), one sitting,
//    one attempt, 60 MINUTES, no negative marking, paper + pen + calculator allowed.
//    A score of 75% OR ABOVE waives the application fee. Question count is NOT published.
//  - MBZUAI's 2023 *graduate* entry-exam PDF: 40 multiple-choice questions in 45 minutes,
//    4 options each, Submit button appears only after the last item.
//  - The exact BSc question count is only in the applicant-portal knowledge article.
//    When you read it, change the numbers below and save — that's all.
// ============================================================================

export interface MockFormat {
  id: string;
  /** Label shown on the Mock Exams page. */
  label: string;
  /** Time limit in minutes. */
  minutes: number;
  /** Number of questions. */
  questions: number;
  /** Short description shown under the label. */
  blurb: string;
}

export const EXAM = {
  /** Target line in percent. A score of 75% or above (>=) waives the application fee. */
  targetPercent: 75,

  /** Real-exam pace in seconds per question (45 min / 40 questions = 67.5 s). Used by practice timers. */
  secondsPerQuestion: (45 * 60) / 40,

  /** Mock exam formats. Question counts follow the real pace (~67.5 s per question). */
  mockFormats: [
    { id: 'full', label: 'Full format', minutes: 45, questions: 40, blurb: "40 questions in 45 minutes, the format in MBZUAI's official exam document." },
    { id: 'm15', label: '15-minute mock', minutes: 15, questions: 13, blurb: 'A quick timed burst at real-exam pace.' },
    { id: 'm30', label: '30-minute mock', minutes: 30, questions: 27, blurb: 'A solid half-length session.' },
    { id: 'm60', label: '1-hour mock', minutes: 60, questions: 53, blurb: 'The official BSc exam length (60 minutes). The real question count is unpublished; 53 keeps the 67-second pace.' },
  ] as MockFormat[],

  /**
   * Share of questions from each area in a mock exam (must add up to 1).
   * ESTIMATES: MBZUAI does not publish topic weights. Update these if you learn the real mix.
   * (The 4 official BSc sample questions are 2 Math + 2 Data & AI, so Math 0.40 / Data 0.25 /
   * Programming 0.20 / CT & Logic 0.15 is a reasonable alternative.)
   */
  areaWeights: {
    math: 0.45, // Math
    prog: 0.25, // Programming Fundamentals
    data: 0.15, // Data & AI Reasoning
    ctl: 0.15, // Computational Thinking & Logic
  },

  /** Difficulty mix in mock exams (must add up to 1). */
  difficultyMix: {
    foundation: 0.3,
    exam: 0.5,
    challenge: 0.2,
  },

  /** Share of mock-exam questions taken from generators (fresh variants) rather than the static bank. */
  generatedShare: 0.35,

  /** Spaced-repetition intervals for the Mistakes deck, in days (level 1, 2, 3, 4). */
  mistakeIntervalsDays: [1, 3, 7, 14],

  /** A day counts towards your streak when you answer at least this many questions. */
  streakDailyTarget: 10,

  /** Weakest-topics list: only subtopics with at least this many attempts are ranked. */
  weakTopicMinAttempts: 5,
} as const;
