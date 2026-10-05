// Turns a static question or a (generator, seed) pair into a ServedQuestion with shuffled options.
// Pure: no registry imports, so tests can use it on single files.
import type { Generator, ServedQuestion, StaticQuestion } from '../types';
import { Rng, hashSeed } from '../lib/rng';
import { subtopicInfo } from '../syllabus';

function shuffleWithKey<T>(items: T[], seed: number): { items: T[]; order: number[] } {
  const order = new Rng(seed).shuffle(items.map((_, i) => i));
  return { items: order.map((i) => items[i]), order };
}

export function serveStatic(q: StaticQuestion): ServedQuestion {
  const info = subtopicInfo(q.subtopic);
  let options = q.options;
  let correctIndex = q.correctIndex;
  let whyWrong = q.markScheme.whyWrong;
  if (!q.fixedOrder) {
    const { items, order } = shuffleWithKey(q.options, hashSeed(q.id));
    options = items;
    correctIndex = order.indexOf(q.correctIndex);
    whyWrong = order.map((i) => q.markScheme.whyWrong[i]);
  }
  return {
    key: q.id,
    sourceId: q.id,
    generated: false,
    subtopic: q.subtopic,
    topic: info.topic.id,
    area: info.area.id,
    difficulty: q.difficulty,
    stem: q.stem,
    code: q.code,
    chart: q.chart,
    table: q.table,
    options,
    correctIndex,
    markScheme: { ...q.markScheme, whyWrong },
    fixedOrder: q.fixedOrder,
  };
}

export function serveGenerated(g: Generator, seed: number): ServedQuestion {
  const info = subtopicInfo(g.subtopic);
  const core = g.generate(new Rng(seed));
  const raw = [
    { text: core.answer, why: null as string | null },
    ...core.distractors.map((d) => ({ text: d.text, why: d.why as string | null })),
  ];
  const { items } = shuffleWithKey(raw, (seed ^ 0x5bd1e995) >>> 0);
  return {
    key: `gen:${g.id}:${seed}`,
    sourceId: g.id,
    generated: true,
    seed,
    subtopic: g.subtopic,
    topic: info.topic.id,
    area: info.area.id,
    difficulty: g.difficulty,
    templateTitle: g.title,
    stem: core.stem,
    code: core.code,
    chart: core.chart,
    table: core.table,
    options: items.map((x) => x.text),
    correctIndex: items.findIndex((x) => x.why === null),
    markScheme: { solution: core.solution, whyWrong: items.map((x) => x.why), keyIdea: core.keyIdea },
  };
}
