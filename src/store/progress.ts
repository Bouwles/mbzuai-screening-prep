// All progress lives in one localStorage entry and is written synchronously after every change,
// so closing the tab never loses anything.
import { useSyncExternalStore } from 'react';
import { EXAM } from '../config/exam';
import { GEN_BY_ID, STATIC_BY_ID } from '../engine/bank';
import { hasSubtopic } from '../syllabus';
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
  /** Hints revealed before answering. Only hint-free answers count towards mastery. */
  hints?: number;
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
  daily: Record<string, number>;
  last: { path: string; label: string; at: number } | null;
  /** Furthest lesson stage reached per subtopic (0 = Understand ... 4 = Exam level). */
  stage: Record<string, number>;
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
  daily: {},
  last: null,
  stage: {},
});

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const staticExists = (id: unknown) => typeof id === 'string' && STATIC_BY_ID.has(id);
const genExists = (id: unknown) => typeof id === 'string' && GEN_BY_ID.has(id);

/** A flag key: a static id, or "gen:<generatorId>:<seed>". */
const flagExists = (k: unknown) => typeof k === 'string' && (k.startsWith('gen:') ? genExists(k.split(':')[1]) : staticExists(k));
/** A Mistakes card key: a static id, or "tpl:<generatorId>". */
const cardExists = (k: string) => (k.startsWith('tpl:') ? genExists(k.slice(4)) : staticExists(k));
const refExists = (r: unknown) => isObject(r) && (r.kind === 'gen' ? genExists(r.id) : staticExists(r.id));

function cleanMock(m: Record<string, unknown>): MockRecord | null {
  if (!Array.isArray(m.refs) || !Array.isArray(m.answers) || !Array.isArray(m.flags)) return null;
  const rec = m as unknown as MockRecord;
  // A finished mock keeps its score; its review simply skips anything that no longer exists.
  if (rec.submittedAt) return rec;
  const keep = rec.refs.map((r) => refExists(r));
  const refs = rec.refs.filter((_, i) => keep[i]);
  if (!refs.length) return null;
  const before = (n: number) => keep.slice(0, n).filter(Boolean).length;
  const last = refs.length - 1;
  return {
    ...rec,
    refs,
    answers: rec.answers.filter((_, i) => keep[i]),
    flags: rec.flags.filter((_, i) => keep[i]),
    current: Math.min(before(rec.current ?? 0), last),
    maxVisited: Math.max(0, Math.min(before((rec.maxVisited ?? 0) + 1) - 1, last)),
  };
}

/**
 * Makes saved or imported progress safe to use: anything that refers to a question, generator or
 * subtopic that no longer exists is dropped, and everything else is kept. Never throws.
 */
export function sanitizeState(raw: unknown): State {
  const base = emptyState();
  if (!isObject(raw)) return base;
  // Unknown keys pass through; only `practiceTimer`, which no longer exists, is removed.
  const { practiceTimer: _removed, ...r } = raw;
  const attempts = Array.isArray(r.attempts)
    ? (r.attempts as unknown[]).filter((a): a is Attempt => isObject(a) && (staticExists(a.sourceId) || genExists(a.sourceId)) && typeof a.sub === 'string' && hasSubtopic(a.sub))
    : [];
  const mistakes = isObject(r.mistakes)
    ? (Object.fromEntries(Object.entries(r.mistakes).filter(([k, c]) => cardExists(k) && isObject(c) && typeof c.sub === 'string' && hasSubtopic(c.sub))) as Record<string, MistakeCard>)
    : {};
  const mocks = Array.isArray(r.mocks) ? (r.mocks as unknown[]).flatMap((m) => (isObject(m) ? (cleanMock(m) ?? []) : [])) : [];
  const stage = isObject(r.stage) ? (Object.fromEntries(Object.entries(r.stage).filter(([k]) => hasSubtopic(k))) as Record<string, number>) : {};
  const lastSub = isObject(r.last) && typeof r.last.path === 'string' ? r.last.path.match(/^\/learn\/(.+)$/)?.[1] : undefined;
  const clean: State = {
    ...base,
    ...r,
    v: 1,
    attempts,
    read: Array.isArray(r.read) ? (r.read as unknown[]).filter((x): x is string => typeof x === 'string' && hasSubtopic(x)) : [],
    flags: Array.isArray(r.flags) ? (r.flags as unknown[]).filter((k): k is string => flagExists(k)) : [],
    mistakes,
    mastered: typeof r.mastered === 'number' ? r.mastered : 0,
    mocks,
    activeMockId: mocks.some((m) => m.id === r.activeMockId && !m.submittedAt) ? (r.activeMockId as string) : null,
    theme: r.theme === 'dark' ? 'dark' : 'light',
    daily: isObject(r.daily) ? (r.daily as Record<string, number>) : {},
    last: isObject(r.last) && !(lastSub && !hasSubtopic(lastSub)) ? (r.last as State['last']) : null,
    stage,
  };
  if ((clean as unknown as Record<string, unknown>).practiceDiff === 'challenge') (clean as unknown as Record<string, unknown>).practiceDiff = 'mixed';
  return clean;
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    return sanitizeState(JSON.parse(raw));
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

export function setStage(sub: string, stage: number) {
  update((s) => ({ ...s, stage: { ...s.stage, [sub]: Math.max(stage, s.stage[sub] ?? 0) } }));
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
  commit(sanitizeState(s));
}
export function resetAll() {
  commit({ ...emptyState(), theme: state.theme });
}
