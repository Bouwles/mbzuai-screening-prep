// Registry of every static question, generator and lesson.
// Files are discovered automatically: drop a new file in the right folder and it appears.
//   src/questions/<area>/<topic>/<subtopic>.ts   -> export const questions: StaticQuestion[]
//   src/generators/<area>/<topic>/<subtopic>.ts  -> export const generators: Generator[]
//   src/lessons/<area>/<topic>/<subtopic>.ts     -> export const lesson: Lesson
import type { Generator, Lesson, QRef, ServedQuestion, StaticQuestion } from '../types';
import { serveGenerated, serveStatic } from './materialize';

const qMods = import.meta.glob<{ questions: StaticQuestion[] }>('../questions/**/*.ts', { eager: true });
const gMods = import.meta.glob<{ generators: Generator[] }>('../generators/**/*.ts', { eager: true });
const lMods = import.meta.glob<{ lesson: Lesson }>('../lessons/**/*.ts', { eager: true });

export const STATIC: StaticQuestion[] = Object.values(qMods).flatMap((m) => m.questions ?? []);
export const GENERATORS: Generator[] = Object.values(gMods).flatMap((m) => m.generators ?? []);
export const LESSONS: Lesson[] = Object.values(lMods)
  .map((m) => m.lesson)
  .filter(Boolean);

export const STATIC_BY_ID = new Map(STATIC.map((q) => [q.id, q]));
export const GEN_BY_ID = new Map(GENERATORS.map((g) => [g.id, g]));
export const LESSON_BY_SUBTOPIC = new Map(LESSONS.map((l) => [l.subtopic, l]));

export function staticForSubtopic(sub: string): StaticQuestion[] {
  return STATIC.filter((q) => q.subtopic === sub);
}
export function generatorsForSubtopic(sub: string): Generator[] {
  return GENERATORS.filter((g) => g.subtopic === sub);
}

const cache = new Map<string, ServedQuestion>();

export function refKey(r: QRef): string {
  return r.kind === 'static' ? r.id : `gen:${r.id}:${r.seed}`;
}

export function keyToRef(key: string): QRef | null {
  if (key.startsWith('gen:')) {
    const [, id, seed] = key.split(':');
    return { kind: 'gen', id, seed: Number(seed) };
  }
  return { kind: 'static', id: key };
}

/** Rebuild a question from its reference (null if it no longer exists). */
export function serve(r: QRef): ServedQuestion | null {
  const k = refKey(r);
  const hit = cache.get(k);
  if (hit) return hit;
  let q: ServedQuestion | null = null;
  if (r.kind === 'static') {
    const s = STATIC_BY_ID.get(r.id);
    q = s ? serveStatic(s) : null;
  } else {
    const g = GEN_BY_ID.get(r.id);
    q = g ? serveGenerated(g, r.seed) : null;
  }
  if (q) cache.set(k, q);
  return q;
}
