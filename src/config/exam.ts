// ============================================================================
//  EXAM SETTINGS — the only file you need to edit to match the real exam.
// ============================================================================
// Sources (see RESEARCH_NOTES.md for links):
//  - MBZUAI undergraduate admissions page + "Screening Exam Guide" for Fall 2027:
//    every BSc applicant takes it; online, AI-proctored (Inspera Exam Portal), one sitting,
//    one attempt, 60 MINUTES, 4-option multiple choice, no negative marking,
//    paper + pen + calculator allowed.
//  - A score of 75% OR ABOVE waives the AED 200 application fee. It is NOT a published pass mark.
//  - 40 questions / 45 minutes is the 2023 *graduate* entry-exam format, not the BSc format.
//  - Topic weights and difficulty mixes below are ESTIMATES (marked as such in the UI).
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
   * Pace in seconds per question (60 minutes for 50 questions), used to size the shorter mocks.
   */
  secondsPerQuestion: (60 * 60) / 50,

  /** Mock exam formats. The 15 and 30 minute mocks keep the full mock's pace of about 72 s per question. */
  mockFormats: [
    { id: 'full', label: 'Full-length mock', minutes: 60, questions: 50, blurb: '50 questions in 60 minutes, the length of the real BSc exam (72 seconds each).' },
    { id: 'm15', label: '15-minute mock', minutes: 15, questions: 13, blurb: 'A quick timed burst at the full exam pace.' },
    { id: 'm30', label: '30-minute mock', minutes: 30, questions: 25, blurb: 'A solid half-length session.' },
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

  /** Difficulty mix in mock exams (must add up to 1). An estimate, weighted towards one-step questions. */
  difficultyMix: {
    foundation: 0.4,
    exam: 0.6,
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
