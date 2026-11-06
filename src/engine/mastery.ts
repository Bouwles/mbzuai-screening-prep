// Mastery per subtopic, from independent performance only: answers given without hints,
// in any mode (lesson, practice, feed, mistakes, mock). Reading a lesson does not count.
import type { Difficulty } from '../types';
import type { Attempt, State } from '../store/progress';
import { GEN_BY_ID, STATIC_BY_ID } from './bank';

export type MasteryLevel = 'new' | 'started' | 'weak' | 'developing' | 'mastered';

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  new: 'Not started',
  started: 'Started',
  weak: 'Needs work',
  developing: 'Getting there',
  mastered: 'Mastered',
};

/** How many recent independent answers decide the level, so old results fade out. */
export const MASTERY_WINDOW = 10;

export interface Mastery {
  level: MasteryLevel;
  /** Independent answers in the window. */
  n: number;
  correct: number;
  /** Correct answers at Exam level in the window. */
  examCorrect: number;
}

export function difficultyOf(a: Pick<Attempt, 'sourceId'>): Difficulty | undefined {
  return STATIC_BY_ID.get(a.sourceId)?.difficulty ?? GEN_BY_ID.get(a.sourceId)?.difficulty;
}

/**
 * - fewer than 4 independent answers: started
 * - at least 80% right and at least 3 right at Exam level: mastered
 * - at least 60% right: getting there
 * - otherwise: needs work
 */
export function levelFor(window: { correct: boolean; diff?: Difficulty }[]): Mastery {
  const n = window.length;
  const correct = window.filter((a) => a.correct).length;
  const examCorrect = window.filter((a) => a.correct && a.diff === 'exam').length;
  let level: MasteryLevel;
  if (n === 0) level = 'new';
  else if (n < 4) level = 'started';
  else if (correct / n >= 0.8 && examCorrect >= 3) level = 'mastered';
  else if (correct / n >= 0.6) level = 'developing';
  else level = 'weak';
  return { level, n, correct, examCorrect };
}

const cache = new WeakMap<Attempt[], Map<string, Mastery>>();

/** Mastery for every subtopic that has at least one answer (memoised per attempts array). */
export function masteryBySub(s: Pick<State, 'attempts'>): Map<string, Mastery> {
  const hit = cache.get(s.attempts);
  if (hit) return hit;
  const recent = new Map<string, { correct: boolean; diff?: Difficulty }[]>();
  for (let i = s.attempts.length - 1; i >= 0; i--) {
    const a = s.attempts[i];
    if (a.hints) continue;
    const xs = recent.get(a.sub) ?? [];
    if (xs.length < MASTERY_WINDOW) xs.push({ correct: a.correct, diff: difficultyOf(a) });
    recent.set(a.sub, xs);
  }
  const out = new Map([...recent].map(([sub, xs]) => [sub, levelFor(xs)]));
  cache.set(s.attempts, out);
  return out;
}

export function masteryOf(s: Pick<State, 'attempts'>, sub: string): Mastery {
  return masteryBySub(s).get(sub) ?? levelFor([]);
}
