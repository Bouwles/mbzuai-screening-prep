// Every explanation must teach: the four parts are present, plain and short, and the conclusion
// states the marked answer. Correct working is checked separately, by running code and recomputing.
//
// Run everything:              npx vitest run tests/explanations.test.ts
// Only some subtopics:         SUBTOPIC=loops,strings npx vitest run tests/explanations.test.ts
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Explanation } from '../src/components/Explanation';
import { serveStatic } from '../src/engine/materialize';
import { explanationOf, splitSteps, steps, table } from '../src/lib/explanation';
import { Rng } from '../src/lib/rng';
import { toPlain } from '../src/lib/richtext';
import type { Generator, MarkScheme, ServedQuestion, StaticQuestion } from '../src/types';
import { dialectProblems } from './pseudo';
import { richProblems } from './validate';

const FILTER = (process.env.SUBTOPIC ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const baseName = (p: string) => p.split('/').pop()!.replace(/\.ts$/, '');
const wanted = (p: string) => FILTER.length === 0 || FILTER.includes(baseName(p));
const SEEDS = Number(process.env.EXPLAIN_SEEDS ?? 100);

// Loaded one file at a time, so a run for some subtopics only reads those subtopics' files.
const qLoaders = import.meta.glob<{ questions: StaticQuestion[] }>('../src/questions/**/*.ts');
const gLoaders = import.meta.glob<{ generators: Generator[] }>('../src/generators/**/*.ts');
async function loadAll<T>(loaders: Record<string, () => Promise<T>>) {
  const out: [string, T][] = [];
  for (const [path, load] of Object.entries(loaders)) if (wanted(path)) out.push([path, await load()]);
  return out;
}
const qFiles = await loadAll(qLoaders);
const GENS = (await loadAll(gLoaders)).flatMap(([, m]) => m.generators ?? []);

/** Advice that doesn't tell anyone what to actually do. */
const GENERIC = /\b(read (the question |it |each \w+ )?(carefully|slowly)|practi[sc]e (more|makes)|be careful|take your time|double[- ]check|check your (work|answer)|don'?t rush|pay attention|stay calm|remember the (formula|rule)|learn the (formula|rule))\b/i;
/** Words that make a beginner feel lost, or that stand in for a step that should be shown. */
const TEXTBOOK = /\b(obviously|trivially|clearly|it is easy to see|easy to see|it follows that|by inspection|without loss of generality|wlog|recall that|hence|thus|therefore|henceforth|we note that|as required|straightforward)\b/i;
const LETTERS = /\b(option|answer|choice) [A-D]\b/;

/** Plain prose only: code, tables and maths don't count as words to read. */
const prose = (s: string) =>
  s
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*\|.*\|\s*$/gm, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' M ')
    .replace(/\$[^$]*\$/g, 'M')
    .replace(/`[^`]*`/g, 'C');
const wordCount = (s: string) => prose(s).trim().split(/\s+/).filter(Boolean).length;
const sentences = (s: string) => prose(s).split(/[.?!:;](?:\s|$)|\n+/).map((x) => x.trim()).filter(Boolean);
const plainKey = (s: string) => toPlain(s).replace(/[\s$]/g, '').toLowerCase();

const LIMITS = { asking: 30, step: 60, sentence: 32, steps: 12, conclusion: 45, methodMin: 8, method: 60, whyWrong: 50 };

function problems(stem: string, answer: string, ms: Partial<MarkScheme>): string[] {
  const p: string[] = [];
  const { asking, solution, conclusion, keyIdea } = ms;
  if (!asking?.trim()) p.push('missing "asking": what is the question asking?');
  else {
    if (wordCount(asking) > LIMITS.asking) p.push(`"asking" has ${wordCount(asking)} words: keep it to one simple sentence`);
    if (plainKey(asking) === plainKey(stem)) p.push('"asking" only repeats the stem: put it in simpler words');
  }
  if (!conclusion?.trim()) p.push('missing "conclusion": why is this the answer?');
  else {
    if (wordCount(conclusion) > LIMITS.conclusion) p.push(`"conclusion" has ${wordCount(conclusion)} words`);
    const key = plainKey(answer);
    if (key.length <= 80 && !plainKey(conclusion).includes(key)) p.push(`"conclusion" must state the answer exactly as the option does: ${answer}`);
  }
  const parts = splitSteps(solution);
  if (!parts.length) p.push('no solution steps');
  if (parts.length > LIMITS.steps) p.push(`${parts.length} steps: use a table instead of many similar steps`);
  parts.forEach((step, i) => {
    if (wordCount(step) > LIMITS.step) p.push(`step ${i + 1} has ${wordCount(step)} words: split it`);
    for (const s of sentences(step)) if (s.split(/\s+/).length > LIMITS.sentence) p.push(`step ${i + 1} has a ${s.split(/\s+/).length}-word sentence: "${s.slice(0, 50)}..."`);
    for (const m of step.matchAll(/```pseudocode\n([\s\S]*?)```/g)) p.push(...dialectProblems(m[1].trimEnd()).map((x) => `step ${i + 1} code: ${x}`));
  });
  if (!keyIdea?.trim()) p.push('missing "keyIdea": how do I solve similar questions?');
  else {
    const n = wordCount(keyIdea);
    if (n < LIMITS.methodMin || n > LIMITS.method) p.push(`"keyIdea" has ${n} words: it should be one short, usable technique`);
    if (GENERIC.test(keyIdea)) p.push(`"keyIdea" is generic advice: "${keyIdea.match(GENERIC)![0]}". Give a technique`);
    if (conclusion && plainKey(keyIdea) === plainKey(conclusion)) p.push('"keyIdea" repeats the conclusion');
  }
  for (const [name, t] of [['asking', asking], ['solution', solution], ['conclusion', conclusion], ['keyIdea', keyIdea]] as const) {
    if (!t) continue;
    const hit = prose(t).match(TEXTBOOK);
    if (hit) p.push(`${name} says "${hit[0]}": show the step in plain words instead`);
    if (LETTERS.test(t)) p.push(`${name} refers to an option letter, but options have no letters`);
  }
  for (const w of ms.whyWrong ?? []) if (w && wordCount(w) > LIMITS.whyWrong) p.push(`a whyWrong entry has ${wordCount(w)} words: "${w.slice(0, 40)}..."`);
  for (const [name, t] of [['asking', asking], ['conclusion', conclusion]] as const) if (t) p.push(...richProblems(name, t));
  return p;
}

describe('every static explanation', () => {
  for (const [path, m] of qFiles) {
    it(baseName(path), () => {
      const bad = (m.questions ?? []).flatMap((q) => problems(q.stem, q.options[q.correctIndex], q.markScheme).map((x) => `${q.id}: ${x}`));
      expect(bad).toEqual([]);
    });
  }
});

describe('every generated explanation', () => {
  for (const g of GENS) {
    it(g.id, () => {
      const bad = new Set<string>();
      for (let seed = 1; seed <= SEEDS && bad.size < 8; seed++) {
        const c = g.generate(new Rng(seed));
        for (const x of problems(c.stem, c.answer, { asking: c.asking, solution: c.solution, conclusion: c.conclusion, keyIdea: c.keyIdea, whyWrong: c.distractors.map((d) => d.why) })) bad.add(`seed ${seed}: ${x}`);
      }
      expect([...bad]).toEqual([]);
    });
  }
});

describe('splitting a solution into steps', () => {
  it('one step per block', () => {
    expect(splitSteps('First.\n\nSecond.\n\nThird.')).toEqual(['First.', 'Second.', 'Third.']);
  });
  it('tables, display maths, code and bullets stay with the sentence before them', () => {
    expect(splitSteps('Trace it:\n\n| a |\n|---|\n| 1 |\n\nSo $$x = 1$$ here.\n\n$$y = 2$$\n\nCode:\n\n```pseudocode\nx = 1\n\nprint(x)\n```\n\nPoints:\n\n- one\n- two')).toEqual([
      'Trace it:\n\n| a |\n|---|\n| 1 |',
      'So $$x = 1$$ here.\n\n$$y = 2$$',
      'Code:\n\n```pseudocode\nx = 1\n\nprint(x)\n```',
      'Points:\n\n- one\n- two',
    ]);
  });
  it('a numbered list becomes separate steps', () => {
    expect(splitSteps('1. Put $x = 0$.\n2. Divide by 3.')).toEqual(['Put $x = 0$.', 'Divide by 3.']);
  });
  it('the helpers build steps and tables', () => {
    expect(steps('a', false, null, 'b')).toBe('a\n\nb');
    expect(table(['n', 't'], [[40, 4]])).toBe('| n | t |\n| --- | --- |\n| 40 | 4 |');
    expect(splitSteps(steps('Trace:', table(['n'], [[1]])))).toHaveLength(1);
  });
});

describe('missing or malformed explanation data', () => {
  const base: ServedQuestion = {
    ...serveStatic({ id: 'x-1', subtopic: 'loops', difficulty: 'exam', stem: 'What is $1 + 1$?', options: ['$2$', '$3$', '$4$', '$5$'], correctIndex: 0, fixedOrder: true, markScheme: { solution: 'Add them.\n\nYou get $2$.', whyWrong: [null, 'Too big by one.', 'Too big by two.', 'Too big by three.'], keyIdea: 'Add the two numbers together.' } }),
  };
  const draw = (q: ServedQuestion, selected: number | null = 1) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Explanation, { q, selected })));

  it('a complete explanation shows all four parts and both answers', () => {
    const html = draw({ ...base, markScheme: { ...base.markScheme, asking: 'What do you get?', conclusion: 'So it is $2$.' } });
    for (const t of ['Correct answer', 'Your answer', 'What is it asking?', 'How to solve it', 'Why this is the answer', 'For similar questions', 'Why the other options are wrong', 'Too big by one.']) expect(html).toContain(t);
  });
  it('older data without the new fields still draws, with steps and the answer', () => {
    const html = draw(base);
    expect(html).toContain('How to solve it');
    expect(html).toContain('Correct answer');
    expect(html).not.toContain('What is it asking?');
    expect(html).not.toContain('Why this is the answer');
  });
  it('broken data never throws, and the answer stays visible', () => {
    const cases: unknown[] = [undefined, null, {}, 'nonsense', 3, { solution: 42, whyWrong: 'x', keyIdea: {} }, { solution: '', whyWrong: [] }, { asking: 7, conclusion: [], solution: null, keyIdea: null, whyWrong: [null, null] }];
    for (const markScheme of cases) {
      const q = { ...base, markScheme } as unknown as ServedQuestion;
      expect(() => explanationOf(q)).not.toThrow();
      const html = draw(q);
      expect(html).toContain('Correct answer');
      expect(html).toContain("isn&#x27;t available");
    }
  });
  it('a blank answer in a mock review shows no "Your answer" box', () => {
    expect(draw(base, -1)).not.toContain('Your answer');
    expect(draw(base, null)).not.toContain('Your answer');
    expect(draw(base, 0)).not.toContain('Your answer');
  });
});
