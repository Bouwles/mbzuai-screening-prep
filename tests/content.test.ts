// Content correctness tests: every static question, every generator (2,000 variants each),
// every lesson, plus syllabus coverage.
//
// Run everything:              npm test
// Only some subtopics:         SUBTOPIC=quadratics,vectors npx vitest run tests/content.test.ts
// Fewer generator variants:    GEN_N=200 npx vitest run tests/content.test.ts
import { describe, expect, it } from 'vitest';
import type { Generator, GeneratedCore, Lesson, StaticQuestion } from '../src/types';
import { SUBTOPICS, hasSubtopic, subtopicInfo } from '../src/syllabus';
import { Rng } from '../src/lib/rng';
import { approxEqual } from '../src/lib/mathx';
import { serveGenerated, serveStatic } from '../src/engine/materialize';
import { findPython, norm, outNorm, richProblems, runPythonBatch, visualProblems } from './validate';

const FILTER = (process.env.SUBTOPIC ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const GEN_N = Number(process.env.GEN_N ?? 2000);
const baseName = (p: string) => p.split('/').pop()!.replace(/\.ts$/, '');
const wanted = (p: string) => FILTER.length === 0 || FILTER.includes(baseName(p));
const pathInfo = (p: string) => {
  const parts = p.split('/');
  const n = parts.length;
  return { area: parts[n - 3], topic: parts[n - 2], sub: baseName(p) };
};

const qLoaders = import.meta.glob<{ questions: StaticQuestion[] }>('../src/questions/**/*.ts');
const gLoaders = import.meta.glob<{ generators: Generator[] }>('../src/generators/**/*.ts');
const lLoaders = import.meta.glob<{ lesson: Lesson }>('../src/lessons/**/*.ts');

async function loadAll<T>(loaders: Record<string, () => Promise<T>>) {
  const out: { path: string; mod: T }[] = [];
  for (const [path, load] of Object.entries(loaders)) if (wanted(path)) out.push({ path, mod: await load() });
  return out;
}

const qFiles = await loadAll(qLoaders);
const gFiles = await loadAll(gLoaders);
const lFiles = await loadAll(lLoaders);
const allStatic = qFiles.flatMap((f) => f.mod.questions ?? []);
const allGens = gFiles.flatMap((f) => f.mod.generators ?? []);
const PY = findPython();

function placementProblems(path: string, sub: string): string[] {
  const out: string[] = [];
  const pi = pathInfo(path);
  if (!hasSubtopic(sub)) return [`unknown subtopic "${sub}"`];
  const info = subtopicInfo(sub);
  if (pi.sub !== sub) out.push(`subtopic "${sub}" does not match file name "${pi.sub}"`);
  if (pi.area !== info.area.id || pi.topic !== info.topic.id)
    out.push(`file should be in ${info.area.id}/${info.topic.id}/, found ${pi.area}/${pi.topic}/`);
  return out;
}

function staticProblems(q: StaticQuestion, path: string): string[] {
  const p: string[] = [];
  if (!/^[a-z0-9-]+$/.test(q.id ?? '')) p.push('id must be lowercase letters/digits/dashes');
  p.push(...placementProblems(path, q.subtopic));
  if (!['foundation', 'exam', 'challenge'].includes(q.difficulty)) p.push(`bad difficulty ${q.difficulty}`);
  if (!q.stem || q.stem.trim().length < 10) p.push('stem too short');
  if (!Array.isArray(q.options) || q.options.length !== 4) return [...p, 'must have exactly 4 options'];
  if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) p.push('correctIndex must be 0..3');
  const normed = q.options.map(norm);
  if (new Set(normed).size !== 4) p.push(`options not distinct: ${JSON.stringify(q.options)}`);
  if (q.options.some((o) => !o || !o.trim())) p.push('empty option');
  const ms = q.markScheme;
  if (!ms) return [...p, 'missing markScheme'];
  if (!ms.solution || ms.solution.trim().length < 40) p.push('solution too short (needs full worked steps)');
  if (!ms.keyIdea || ms.keyIdea.trim().length < 10) p.push('keyIdea missing');
  if (!Array.isArray(ms.whyWrong) || ms.whyWrong.length !== 4) p.push('whyWrong must have 4 entries');
  else
    ms.whyWrong.forEach((w, i) => {
      if (i === q.correctIndex && w !== null) p.push('whyWrong[correctIndex] must be null');
      if (i !== q.correctIndex && (typeof w !== 'string' || w.trim().length < 15)) p.push(`whyWrong[${i}] needs a real explanation`);
      if (i !== q.correctIndex && !q.fixedOrder && typeof w === 'string' && /\b(option|answer|choice) [A-D]\b|\(([A-D])\)/.test(w))
        p.push(`whyWrong[${i}] refers to an option letter, but options are shuffled`);
    });
  const fields: [string, string][] = [
    ['stem', q.stem],
    ...q.options.map((o, i) => [`option ${i}`, o] as [string, string]),
    ['solution', ms.solution],
    ['keyIdea', ms.keyIdea],
    ...(ms.whyWrong ?? []).filter((w): w is string => typeof w === 'string').map((w, i) => [`whyWrong ${i}`, w] as [string, string]),
  ];
  for (const [f, t] of fields) p.push(...richProblems(f, t));
  p.push(...visualProblems(q.chart, q.table));
  if (q.code && (!q.code.source || !['python', 'pseudocode'].includes(q.code.lang))) p.push('bad code block');
  if (q.python && q.code?.lang !== 'python') p.push('python check needs a python code block');
  if (q.check) {
    const { optionValues, compute } = q.check;
    if (!Array.isArray(optionValues) || optionValues.length !== 4) p.push('check.optionValues must have 4 entries');
    else {
      const v = compute();
      const matches = optionValues
        .map((ov, i) => ({ ov, i }))
        .filter(({ ov }) => ov !== null && (typeof v === 'number' && typeof ov === 'number' ? approxEqual(v, ov, 1e-6) : String(ov) === String(v)));
      if (matches.length !== 1 || matches[0].i !== q.correctIndex)
        p.push(`check: computed ${JSON.stringify(v)} matches options ${JSON.stringify(matches.map((x) => x.i))}, expected only ${q.correctIndex}`);
    }
  }
  try {
    const s = serveStatic(q);
    if (norm(s.options[s.correctIndex]) !== norm(q.options[q.correctIndex])) p.push('shuffle broke the correct answer');
  } catch (e) {
    p.push(`serveStatic failed: ${(e as Error).message}`);
  }
  return p;
}

function generatedProblems(core: GeneratedCore, seed: number): string[] {
  const p: string[] = [];
  const at = `seed ${seed}`;
  if (!Array.isArray(core.distractors) || core.distractors.length !== 3) return [`${at}: needs exactly 3 distractors`];
  const texts = [core.answer, ...core.distractors.map((d) => d.text)];
  if (texts.some((t) => typeof t !== 'string' || !t.trim())) p.push(`${at}: empty option`);
  if (new Set(texts.map((t) => norm(String(t)))).size !== 4) p.push(`${at}: options not distinct ${JSON.stringify(texts)}`);
  if (core.answerValue !== undefined) {
    core.distractors.forEach((d, i) => {
      if (d.value === undefined) return;
      const same =
        typeof d.value === 'number' && typeof core.answerValue === 'number'
          ? approxEqual(d.value, core.answerValue, 1e-9)
          : String(d.value) === String(core.answerValue);
      if (same) p.push(`${at}: distractor ${i} has the same value as the answer (${d.value})`);
    });
  }
  if (!core.solution || core.solution.length < 40) p.push(`${at}: solution too short`);
  else if (!core.solution.replace(/\s+/g, ' ').includes(core.answer.replace(/\s+/g, ' ')))
    p.push(`${at}: solution must state the final answer exactly as the correct option: ${core.answer}`);
  if (!core.keyIdea || core.keyIdea.length < 10) p.push(`${at}: keyIdea missing`);
  core.distractors.forEach((d, i) => {
    if (!d.why || d.why.length < 15) p.push(`${at}: distractor ${i} needs a real explanation`);
  });
  const fields: [string, string][] = [
    ['stem', core.stem],
    ['answer', core.answer],
    ['solution', core.solution],
    ['keyIdea', core.keyIdea],
    ...core.distractors.flatMap((d, i) => [
      [`distractor ${i}`, d.text] as [string, string],
      [`why ${i}`, d.why] as [string, string],
    ]),
  ];
  for (const [f, t] of fields) p.push(...richProblems(f, t).map((x) => `${at}: ${x}`));
  p.push(...visualProblems(core.chart, core.table).map((x) => `${at}: ${x}`));
  if (core.code && /NaN|undefined|Infinity/.test(core.code.source)) p.push(`${at}: code contains NaN/undefined`);
  return p;
}

describe('static questions', () => {
  it('ids are unique', () => {
    const seen = new Set<string>();
    const dups = allStatic.filter((q) => (seen.has(q.id) ? true : (seen.add(q.id), false))).map((q) => q.id);
    expect(dups).toEqual([]);
  });
  for (const f of qFiles) {
    it(`valid: ${f.path.replace('../src/', '')}`, () => {
      expect(Array.isArray(f.mod.questions), 'file must export `questions` array').toBe(true);
      const problems = f.mod.questions.flatMap((q) => staticProblems(q, f.path).map((x) => `${q.id}: ${x}`));
      expect(problems).toEqual([]);
    });
  }
  it('python output questions match real Python', () => {
    const qs = allStatic.filter((q) => q.python);
    if (!qs.length) return;
    if (!PY) {
      console.warn(`Python not found: ${qs.length} code questions not executed:\n${qs.map((q) => q.id).join('\n')}`);
      return;
    }
    const res = runPythonBatch(qs.map((q) => q.code!.source));
    const problems: string[] = [];
    qs.forEach((q, i) => {
      const r = res[i];
      const exp = q.python!;
      if (exp.error) {
        if (r.error !== exp.error) problems.push(`${q.id}: expected ${exp.error}, got error=${r.error} stdout=${JSON.stringify(r.stdout)}`);
        return;
      }
      if (r.error) problems.push(`${q.id}: raised ${r.error}`);
      if (r.stdout.trimEnd() !== (exp.stdout ?? '').trimEnd())
        problems.push(`${q.id}: real stdout ${JSON.stringify(r.stdout)} != expected ${JSON.stringify(exp.stdout)}`);
      const correct = outNorm(q.options[q.correctIndex]);
      if (correct !== outNorm(r.stdout)) problems.push(`${q.id}: correct option "${correct}" != real output "${outNorm(r.stdout)}"`);
      q.options.forEach((o, j) => {
        if (j !== q.correctIndex && outNorm(o) === outNorm(r.stdout)) problems.push(`${q.id}: wrong option ${j} equals the real output`);
      });
    });
    expect(problems).toEqual([]);
  });
});

describe('generators', () => {
  it('ids are unique', () => {
    const ids = allGens.map((g) => g.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });
  for (const f of gFiles) {
    for (const g of f.mod.generators ?? []) {
      it(`${g.id}: ${GEN_N} variants valid`, () => {
        const problems: string[] = [];
        if (!/^gen-[a-z0-9-]+$/.test(g.id)) problems.push('id must start with "gen-"');
        problems.push(...placementProblems(f.path, g.subtopic));
        if (!['foundation', 'exam', 'challenge'].includes(g.difficulty)) problems.push('bad difficulty');
        if (!g.title) problems.push('missing title');
        const stems = new Set<string>();
        const pyCases: { seed: number; code: string; core: GeneratedCore }[] = [];
        for (let seed = 1; seed <= GEN_N && problems.length < 20; seed++) {
          let core: GeneratedCore;
          try {
            core = g.generate(new Rng(seed));
          } catch (e) {
            problems.push(`seed ${seed}: threw ${(e as Error).message}`);
            continue;
          }
          // determinism
          if (seed <= 20 && JSON.stringify(g.generate(new Rng(seed))) !== JSON.stringify(core)) problems.push(`seed ${seed}: not deterministic`);
          problems.push(...generatedProblems(core, seed));
          stems.add(core.stem + JSON.stringify(core.code ?? '') + JSON.stringify(core.chart ?? '') + JSON.stringify(core.table ?? ''));
          if (core.python && core.code && pyCases.length < 300) pyCases.push({ seed, code: core.code.source, core });
          if (seed <= 50) {
            const s = serveGenerated(g, seed);
            if (s.options.length !== 4 || s.correctIndex < 0 || norm(s.options[s.correctIndex]) !== norm(core.answer))
              problems.push(`seed ${seed}: serving broke the correct answer`);
          }
        }
        if (stems.size < Math.min(25, GEN_N / 4)) problems.push(`only ${stems.size} distinct variants in ${GEN_N} seeds — not enough variety`);
        if (pyCases.length && PY) {
          const res = runPythonBatch(pyCases.map((c) => c.code));
          pyCases.forEach((c, i) => {
            const r = res[i];
            const exp = c.core.python!;
            if (exp.error) {
              if (r.error !== exp.error) problems.push(`seed ${c.seed}: expected ${exp.error}, got ${r.error}`);
            } else {
              if (r.error) problems.push(`seed ${c.seed}: python raised ${r.error}`);
              if (exp.stdout !== undefined && r.stdout.trimEnd() !== exp.stdout.trimEnd())
                problems.push(`seed ${c.seed}: python stdout ${JSON.stringify(r.stdout)} != expected ${JSON.stringify(exp.stdout)}`);
              if (outNorm(c.core.answer) !== outNorm(r.stdout)) problems.push(`seed ${c.seed}: answer "${outNorm(c.core.answer)}" != python "${outNorm(r.stdout)}"`);
              c.core.distractors.forEach((d, j) => {
                if (outNorm(d.text) === outNorm(r.stdout)) problems.push(`seed ${c.seed}: distractor ${j} equals real output`);
              });
            }
          });
        }
        expect(problems.slice(0, 20)).toEqual([]);
      });
    }
  }
});

describe('lessons', () => {
  it('lesson files load', () => expect(lFiles.every((f) => f.mod.lesson)).toBe(true));
  for (const f of lFiles) {
    it(`valid: ${f.path.replace('../src/', '')}`, () => {
      const l = f.mod.lesson;
      expect(l, 'file must export `lesson`').toBeTruthy();
      const p: string[] = [...placementProblems(f.path, l.subtopic)];
      if (!l.know || l.know.length < 600) p.push('"know" section too short (explain from the basics up)');
      if (!l.formulas?.length) p.push('needs at least one formula/rule');
      if (!l.examples || l.examples.length < 3) p.push('needs at least 3 worked examples');
      if (!l.traps || l.traps.length < 3) p.push('needs at least 3 common traps');
      if (!l.examTip || l.examTip.length < 60) p.push('exam tip too short');
      const fields: [string, string][] = [
        ['know', l.know],
        ['examTip', l.examTip],
        ...l.traps.map((t, i) => [`trap ${i}`, t] as [string, string]),
        ...l.examples.flatMap((e, i) => [
          [`example ${i} title`, e.title] as [string, string],
          [`example ${i} problem`, e.problem] as [string, string],
          [`example ${i} answer`, e.answer] as [string, string],
          ...e.steps.map((s, j) => [`example ${i} step ${j}`, s] as [string, string]),
        ]),
        ...l.formulas.flatMap((fm, i) => [[`formula ${i} label`, fm.label] as [string, string], ...(fm.note ? [[`formula ${i} note`, fm.note] as [string, string]] : [])]),
      ];
      l.examples.forEach((e, i) => {
        if (!e.steps || e.steps.length < 2) p.push(`example ${i}: needs every step shown`);
      });
      for (const [fl, t] of fields) p.push(...richProblems(fl, t));
      l.formulas.forEach((fm, i) => p.push(...richProblems(`formula ${i}`, `$$${fm.tex}$$`)));
      expect(p).toEqual([]);
    });
  }
});

describe('coverage', () => {
  const subs = FILTER.length ? SUBTOPICS.filter((s) => FILTER.includes(s.id)) : SUBTOPICS;
  it('every subtopic has a lesson, >= 15 static questions and >= 1 generator', () => {
    const p: string[] = [];
    for (const s of subs) {
      const nq = allStatic.filter((q) => q.subtopic === s.id).length;
      const ng = allGens.filter((g) => g.subtopic === s.id).length;
      const nl = lFiles.filter((f) => f.mod.lesson?.subtopic === s.id).length;
      if (nq < 15) p.push(`${s.id}: ${nq} static questions`);
      if (ng < 1) p.push(`${s.id}: no generator`);
      if (nl !== 1) p.push(`${s.id}: ${nl} lessons`);
      const diffs = new Set(allStatic.filter((q) => q.subtopic === s.id).map((q) => q.difficulty));
      if (nq && diffs.size < 3) p.push(`${s.id}: needs foundation, exam and challenge questions`);
    }
    expect(p).toEqual([]);
  });
  if (!FILTER.length) {
    it('totals: >= 800 static questions and >= 80 generators', () => {
      console.log(`STATIC=${allStatic.length} GENERATORS=${allGens.length} LESSONS=${lFiles.length} SUBTOPICS=${SUBTOPICS.length}`);
      expect(allStatic.length).toBeGreaterThanOrEqual(800);
      expect(allGens.length).toBeGreaterThanOrEqual(80);
    });
  }
});
