// ============================================================================
//  EXAM SETTINGS — the only file you need to edit to match the real exam.
// ============================================================================
// Sources (see RESEARCH_NOTES.md for links):
//  - MBZUAI undergraduate admissions page + "Screening Exam Guide" for Fall 2027:
//    every BSc applicant takes it; online, AI-proctored (Inspera Exam Portal), one sitting,
//    one attempt, 60 MINUTES, 4-option multiple choice, no negative marking,
//    paper + pen + calculator allowed. The QUESTION COUNT IS NOT PUBLISHED.
//  - A score of 75% OR ABOVE waives the AED 200 application fee. It is NOT a published pass mark.
//  - 40 questions / 45 minutes is the 2023 *graduate* entry-exam format, not the BSc format.
//  - Question counts, topic weights and difficulty mixes below are ESTIMATES (marked as such in the UI).
//    If you learn the real numbers (applicant portal), change them here and save.
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
  /**
   * Target line in percent: 75% or above (>=) waives the application fee.
   * It is not an official pass mark (MBZUAI publishes none).
   */
  targetPercent: 75,

  /**
   * ESTIMATED pace in seconds per question, used by practice timers and mock lengths.
   * The real count is unpublished; 67.5 s (the old graduate pace) is a deliberately brisk guess,
   * so training at it leaves a margin if the real exam has fewer questions.
   */
  secondsPerQuestion: (45 * 60) / 40,

  /** Mock exam formats. Minutes are real for 'full' (60); every question count is an estimate at ~67 s per question. */
  mockFormats: [
    { id: 'full', label: 'Full-length mock', minutes: 60, questions: 53, blurb: 'The official BSc exam length is 60 minutes. The question count is not published; 53 is an estimate (about 67 seconds each).' },
    { id: 'm15', label: '15-minute mock', minutes: 15, questions: 13, blurb: 'A quick timed burst at the estimated pace.' },
    { id: 'm30', label: '30-minute mock', minutes: 30, questions: 27, blurb: 'A solid half-length session.' },
    { id: 'grad45', label: 'Graduate-format drill', minutes: 45, questions: 40, blurb: "40 questions in 45 minutes: MBZUAI's 2023 graduate format, not the BSc one. Use it as a speed drill." },
  ] as MockFormat[],

  /**
   * Share of questions from each area in a mock exam (must add up to 1).
   * ESTIMATES: MBZUAI does not publish topic weights. The 4 official BSc sample questions are
   * 2 Math + 2 Data & AI, which this mix leans towards. Update these if you learn the real mix.
   */
  areaWeights: {
    math: 0.4, // Math
    data: 0.25, // Data & AI Reasoning
    prog: 0.2, // Programming Fundamentals
    ctl: 0.15, // Computational Thinking & Logic
  },

  /**
   * Difficulty mix in mock exams (must add up to 1). ESTIMATE: the guide only says "varying difficulty".
   * Challenge questions are optional enrichment above the level of the official samples, so mocks leave them out.
   */
  difficultyMix: {
    foundation: 0.3,
    exam: 0.7,
    challenge: 0,
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
