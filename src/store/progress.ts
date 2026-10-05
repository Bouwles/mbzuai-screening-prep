// All progress lives in one localStorage entry and is written synchronously after every change,
// so closing the tab never loses anything.
import { useSyncExternalStore } from 'react';
import { EXAM } from '../config/exam';
import type { QRef } from '../types';

export type Mode = 'practice' | 'feed' | 'mock' | 'lesson' | 'mistakes' | 'bank';

export interface Attempt {
  key: string;
  sourceId: string;
  sub: string;
  correct: boolean;
  chosen: number;
  ms: number;
  at: number;
  mode: Mode;
  /** Seed for generated variants (also part of `key`). */
  seed?: number;
}

export interface MistakeCard {
  /** Static question id, or "tpl:<generatorId>" for generated questions (a fresh variant comes back). */
  key: string;
  sub: string;
  /** 0..3 -> intervals 1, 3, 7, 14 days. */
  level: number;
  due: number;
  added: number;
}

export interface MockRecord {
  id: string;
  formatId: string;
  label: string;
  startedAt: number;
  durationSec: number;
  refs: QRef[];
  answers: (number | null)[];
  flags: boolean[];
  current: number;
  /** Highest question index visited (the Submit button appears once the last one is reached). */
  maxVisited: number;
  submittedAt?: number;
  score?: number;
  timeUsedSec?: number;
}

export interface State {
  v: 1;
  attempts: Attempt[];
  read: string[];
  flags: string[];
  mistakes: Record<string, MistakeCard>;
  mastered: number;
  mocks: MockRecord[];
  activeMockId: string | null;
  theme: 'dark' | 'light';
  practiceTimer: boolean;
  daily: Record<string, number>;
  last: { path: string; label: string; at: number } | null;
}

const KEY = 'mbzuai-prep-v1';
const DAY = 86_400_000;

export const emptyState = (): State => ({
  v: 1,
  attempts: [],
  read: [],
  flags: [],
  mistakes: {},
  mastered: 0,
  mocks: [],
  activeMockId: null,
  theme: 'light',
  practiceTimer: true,
  daily: {},
  last: null,
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}

let state: State = typeof localStorage === 'undefined' ? emptyState() : load();
const listeners = new Set<() => void>();

function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Could not save progress', e);
  }
  listeners.forEach((l) => l());
}

export function getState(): State {
  return state;
}
export function update(fn: (s: State) => State) {
  commit(fn(state));
}
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => sel(state),
  );
}

// Keep tabs in sync if the site is open twice.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

export const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function mistakeKeyFor(sourceId: string, generated: boolean) {
  return generated ? `tpl:${sourceId}` : sourceId;
}

/** Record an answer. Wrong answers enter (or reset) the Mistakes deck; reviews move cards up a level. */
export function recordAttempt(a: Attempt, generated: boolean) {
  update((s) => {
    const mistakes = { ...s.mistakes };
    let mastered = s.mastered;
    const mk = mistakeKeyFor(a.sourceId, generated);
    const card = mistakes[mk];
    if (!a.correct) {
      mistakes[mk] = { key: mk, sub: a.sub, level: 0, due: a.at + EXAM.mistakeIntervalsDays[0] * DAY, added: card?.added ?? a.at };
    } else if (card && a.mode === 'mistakes') {
      const level = card.level + 1;
      if (level >= EXAM.mistakeIntervalsDays.length) {
        delete mistakes[mk];
        mastered += 1;
      } else mistakes[mk] = { ...card, level, due: a.at + EXAM.mistakeIntervalsDays[level] * DAY };
    }
    const dk = dayKey(a.at);
    const attempts = s.attempts.length > 40000 ? s.attempts.slice(-30000) : s.attempts;
    return { ...s, attempts: [...attempts, a], mistakes, mastered, daily: { ...s.daily, [dk]: (s.daily[dk] ?? 0) + 1 } };
  });
}

export function setLast(path: string, label: string) {
  update((s) => ({ ...s, last: { path, label, at: Date.now() } }));
}

export function toggleFlag(key: string) {
  update((s) => ({ ...s, flags: s.flags.includes(key) ? s.flags.filter((k) => k !== key) : [...s.flags, key] }));
}

export function markRead(sub: string, read = true) {
  update((s) => ({ ...s, read: read ? [...new Set([...s.read, sub])] : s.read.filter((x) => x !== sub) }));
}

// ------------------------------------------------------------------ derived stats
export interface Acc {
  attempts: number;
  correct: number;
}
export function accuracyBySub(s: State): Map<string, Acc> {
  const m = new Map<string, Acc>();
  for (const a of s.attempts) {
    const x = m.get(a.sub) ?? { attempts: 0, correct: 0 };
    x.attempts++;
    if (a.correct) x.correct++;
    m.set(a.sub, x);
  }
  return m;
}

/** Latest result per question key. */
export function lastResultByKey(s: State): Map<string, boolean> {
  const m = new Map<string, boolean>();
  for (const a of s.attempts) m.set(a.key, a.correct);
  return m;
}

export function streak(s: State): number {
  const target = EXAM.streakDailyTarget;
  let t = Date.now();
  let n = 0;
  if ((s.daily[dayKey(t)] ?? 0) < target) t -= DAY; // today still in progress
  while ((s.daily[dayKey(t)] ?? 0) >= target) {
    n++;
    t -= DAY;
  }
  return n;
}

export function dueMistakes(s: State, now = Date.now()): MistakeCard[] {
  return Object.values(s.mistakes)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due);
}

// ------------------------------------------------------------------ export / import / reset
export function exportJson(): string {
  return JSON.stringify({ app: 'mbzuai-screening-prep', exportedAt: new Date().toISOString(), state }, null, 1);
}
export function importJson(text: string): void {
  const parsed = JSON.parse(text);
  const s = parsed?.state ?? parsed;
  if (!s || s.v !== 1 || !Array.isArray(s.attempts)) throw new Error('This file is not a progress export from this app.');
  commit({ ...emptyState(), ...s });
}
export function resetAll() {
  commit({ ...emptyState(), theme: state.theme });
}
