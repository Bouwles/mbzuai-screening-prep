// Chooses which question to show next in each mode.
import { EXAM } from '../config/exam';
import { SUBTOPICS, subtopicInfo } from '../syllabus';
import type { AreaId, Difficulty, QRef } from '../types';
import { Rng, freshSeed } from '../lib/rng';
import { GENERATORS, STATIC, refKey } from './bank';
import { accuracyBySub, getState, lastResultByKey, type MistakeCard } from '../store/progress';

export type DiffChoice = Difficulty | 'mixed';

const genRef = (id: string, seed = freshSeed()): QRef => ({ kind: 'gen', id, seed });

/**
 * Next question for Topic Practice: unseen static questions first, then ones last answered wrong,
 * then generated variants (endless).
 */
export function nextPractice(subs: string[], diff: DiffChoice, used: Set<string>, rng: Rng): QRef | null {
  const last = lastResultByKey(getState());
  const okDiff = (d: Difficulty) => diff === 'mixed' || d === diff;
  const pool = STATIC.filter((q) => subs.includes(q.subtopic) && okDiff(q.difficulty) && !used.has(q.id));
  const gens = GENERATORS.filter((g) => subs.includes(g.subtopic) && okDiff(g.difficulty));
  const allGens = gens.length ? gens : GENERATORS.filter((g) => subs.includes(g.subtopic));
  const unseen = pool.filter((q) => !last.has(q.id));
  const wrong = pool.filter((q) => last.get(q.id) === false);
  // About one in four questions is a fresh generated variant, for variety.
  // Once every static question is answered correctly, it is generated variants from then on.
  if (allGens.length && (rng.bool(0.25) || (!unseen.length && !wrong.length))) return genRef(rng.pick(allGens).id);
  if (unseen.length) return { kind: 'static', id: rng.pick(unseen).id };
  if (wrong.length) return { kind: 'static', id: rng.pick(wrong).id };
  if (pool.length) return { kind: 'static', id: rng.pick(pool).id };
  return allGens.length ? genRef(rng.pick(allGens).id) : null;
}

/** Weight of each subtopic in the mixed feed: weaker and less-practised subtopics come up more. */
export function subtopicWeights(): Map<string, number> {
  const acc = accuracyBySub(getState());
  const w = new Map<string, number>();
  for (const s of SUBTOPICS) {
    const a = acc.get(s.id);
    const areaW = EXAM.areaWeights[s.area.id] / s.area.topics.reduce((n, t) => n + t.subtopics.length, 0);
    let k = 1;
    if (!a || a.attempts < 3) k = 1.6; // not enough data yet: explore
    else k = 0.4 + 2.2 * (1 - a.correct / a.attempts); // 0.4 (perfect) .. 2.6 (all wrong)
    w.set(s.id, areaW * k);
  }
  return w;
}

function weightedPick<T>(items: [T, number][], rng: Rng): T {
  const total = items.reduce((n, [, w]) => n + w, 0);
  let r = rng.next() * total;
  for (const [x, w] of items) {
    r -= w;
    if (r <= 0) return x;
  }
  return items[items.length - 1][0];
}

/** Next question for the endless mixed feed. Due mistakes are slipped in every few questions. */
export function nextFeed(used: Set<string>, rng: Rng, count: number, dueCards: MistakeCard[]): QRef {
  if (count % 5 === 4 && dueCards.length) {
    const r = refForMistake(dueCards[0]);
    if (r && !used.has(refKey(r))) return r;
  }
  const sub = weightedPick([...subtopicWeights().entries()], rng);
  return nextPractice([sub], 'mixed', used, rng) ?? genRef(rng.pick(GENERATORS).id);
}

/** Question to show for a Mistakes card: the same static question, or a fresh variant of the template. */
export function refForMistake(c: MistakeCard): QRef | null {
  if (c.key.startsWith('tpl:')) {
    const id = c.key.slice(4);
    return GENERATORS.some((g) => g.id === id) ? genRef(id) : null;
  }
  return STATIC.some((q) => q.id === c.key) ? { kind: 'static', id: c.key } : null;
}

/** Split `total` into integer parts proportional to `weights` (largest remainder). */
export function apportion<K extends string>(total: number, weights: Record<K, number>): Record<K, number> {
  const keys = Object.keys(weights) as K[];
  const sumW = keys.reduce((n, k) => n + weights[k], 0);
  const raw = keys.map((k) => (total * weights[k]) / sumW);
  const out = Object.fromEntries(keys.map((k, i) => [k, Math.floor(raw[i])])) as Record<K, number>;
  let left = total - keys.reduce((n, k) => n + out[k], 0);
  const order = keys.map((k, i) => [k, raw[i] - Math.floor(raw[i])] as [K, number]).sort((a, b) => b[1] - a[1]);
  for (let i = 0; left > 0; i = (i + 1) % order.length, left--) out[order[i][0]]++;
  return out;
}

/** Build a mock exam: area weights and difficulty mix from the config, unseen static questions preferred. */
export function buildMock(n: number, seed: number): QRef[] {
  const rng = new Rng(seed);
  const last = lastResultByKey(getState());
  const perArea = apportion(n, EXAM.areaWeights as Record<AreaId, number>);
  const diffs: Difficulty[] = [];
  const perDiff = apportion(n, EXAM.difficultyMix as Record<Difficulty, number>);
  (Object.keys(perDiff) as Difficulty[]).forEach((d) => diffs.push(...Array(perDiff[d]).fill(d)));
  const diffQueue = rng.shuffle(diffs);
  const refs: QRef[] = [];
  const used = new Set<string>();
  const usedGen = new Set<string>();
  for (const area of Object.keys(perArea) as AreaId[]) {
    // only subtopics that actually have questions
    const subs = SUBTOPICS.filter((s) => s.area.id === area)
      .map((s) => s.id)
      .filter((id) => STATIC.some((q) => q.subtopic === id) || GENERATORS.some((g) => g.subtopic === id));
    for (let i = 0; i < perArea[area]; i++) {
      const diff = diffQueue.pop() ?? 'exam';
      // spread over subtopics: pick a random subtopic, favouring ones not yet used in this mock
      const usedSubs = refs.map((r) => (r.kind === 'static' ? STATIC.find((q) => q.id === r.id)?.subtopic : GENERATORS.find((g) => g.id === r.id)?.subtopic));
      const fresh = subs.filter((s) => !usedSubs.includes(s));
      const sub = rng.pick(fresh.length ? fresh : subs);
      const wantGen = rng.bool(EXAM.generatedShare);
      const gens = GENERATORS.filter((g) => g.subtopic === sub && !usedGen.has(g.id));
      const gensD = gens.filter((g) => g.difficulty === diff);
      const stat = STATIC.filter((q) => q.subtopic === sub && q.difficulty === diff && !used.has(q.id));
      const statAny = STATIC.filter((q) => q.subtopic === sub && !used.has(q.id));
      let ref: QRef | null = null;
      if (wantGen && (gensD.length || gens.length)) {
        const g = rng.pick(gensD.length ? gensD : gens);
        usedGen.add(g.id);
        ref = { kind: 'gen', id: g.id, seed: rng.int(1, 2 ** 31 - 1) };
      } else {
        const pool = stat.length ? stat : statAny;
        if (pool.length) {
          const unseen = pool.filter((q) => !last.has(q.id));
          const q = rng.pick(unseen.length ? unseen : pool);
          used.add(q.id);
          ref = { kind: 'static', id: q.id };
        } else if (gens.length) {
          const g = rng.pick(gens);
          usedGen.add(g.id);
          ref = { kind: 'gen', id: g.id, seed: rng.int(1, 2 ** 31 - 1) };
        }
      }
      if (ref) refs.push(ref);
    }
  }
  // Mix areas together so the exam is not grouped by topic.
  return rng.shuffle(refs);
}

export function areaOfSub(sub: string): AreaId {
  return subtopicInfo(sub).area.id;
}
