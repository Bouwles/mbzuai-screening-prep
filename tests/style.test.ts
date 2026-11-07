// House-style checks for the question bank (SPEC.md, sections 1-4 and 10).
//
// Run everything:              npm test
// Only some subtopics:         SUBTOPIC=loops,strings npx vitest run tests/style.test.ts
// Per-subtopic counts:         npm run report
import { describe, expect, it } from 'vitest';
import type { CodeBlock, Generator, Lesson, StaticQuestion } from '../src/types';
import { SUBTOPICS, subtopicInfo } from '../src/syllabus';
import { Rng } from '../src/lib/rng';
import { toPlain } from '../src/lib/richtext';
import { norm } from './validate';
import { dialectProblems, runPseudo } from './pseudo';

const FILTER = (process.env.SUBTOPIC ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const GEN_N = Number(process.env.STYLE_GEN_N ?? 300);
const baseName = (p: string) => p.split('/').pop()!.replace(/\.ts$/, '');
const wanted = (p: string) => FILTER.length === 0 || FILTER.includes(baseName(p));

// Loaded one file at a time, so a run for some subtopics only reads those subtopics' files.
const qLoaders = import.meta.glob<{ questions: StaticQuestion[] }>('../src/questions/**/*.ts');
const gLoaders = import.meta.glob<{ generators: Generator[] }>('../src/generators/**/*.ts');
const lLoaders = import.meta.glob<{ lesson: Lesson }>('../src/lessons/**/*.ts');
async function loadAll<T>(loaders: Record<string, () => Promise<T>>) {
  const out: [string, T][] = [];
  for (const [path, load] of Object.entries(loaders)) if (wanted(path)) out.push([path, await load()]);
  return out;
}
const STATIC = (await loadAll(qLoaders)).flatMap(([, m]) => m.questions ?? []);
const GENS = (await loadAll(gLoaders)).flatMap(([, m]) => m.generators ?? []);
const LESSONS = (await loadAll(lLoaders)).map(([p, m]) => ({ path: p, lesson: m.lesson }));

/** Words in a stem, counting each piece of maths and each inline code span as one word. */
export function stemWords(stem: string): number {
  const flat = stem
    .replace(/\$\$[\s\S]*?\$\$/g, ' M ')
    .replace(/\$[^$]*\$/g, 'M')
    .replace(/`[^`]*`/g, 'C');
  return flat.trim().split(/\s+/).filter(Boolean).length;
}

/** "About 35" words: allow a little slack, as the rule itself does. */
const STEM_LIMIT = 38;
const SCENARIO_LIMIT = 60;
/** Reading the context is the skill in these subtopics, so their stems get the higher limit. */
const SCENARIO_SUBS = new Set([
  'reading-charts',
  'data-calculations',
  'valid-conclusions',
  'conditional-probability',
  'ml-basics',
  'training-generalisation',
  'regression-gradient-descent',
  'evaluation-metrics',
  'classic-algorithms',
  'neural-networks',
]);
const limitFor = (sub: string) => (SCENARIO_SUBS.has(sub) ? SCENARIO_LIMIT : STEM_LIMIT);

/** Python may only teach reading basic Python: variables, if/elif/else, while, for-range, def/return. */
const PY_BANNED: [RegExp, string][] = [
  [/\bf["']/, 'f-string'],
  [/\blambda\b/, 'lambda'],
  [/\b(map|filter|sorted|type|isinstance|enumerate|zip)\(/, 'Python-only built-in'],
  [/\[.*\bfor\b.*\]/, 'comprehension'],
  [/\b(global|nonlocal|class|import|try|except|yield|with)\b/, 'Python-only keyword'],
  [/\bis\b/, '"is"'],
  [/\.[a-zA-Z_]+\(/, 'method call'],
  [/[[{]/, 'list, dict, set or slice'],
];

function pyProblems(code: CodeBlock): string[] {
  return PY_BANNED.filter(([re]) => re.test(code.source)).map(([, why]) => `Python: ${why} is not allowed`);
}

const LETTER_OPTION = /^\s*[A-D]( only)?\s*$|\b(both|neither|either) [A-D] (and|nor|or) [A-D]\b|\boption [A-D]\b/i;
const LETTER_TEXT = /\b(option|answer|choice) [A-D]\b/;

const INFINITE = /infinite|never (stops|ends|terminates|finishes)/i;

/** Compare what a snippet really does with the marked option. Returns problems. */
/** An option or an output as plain characters: "$8$" and "8" compare equal. */
const plainKey = (s: string) => norm(s).replace(/[$\\{}]/g, '');

function runProblems(src: string, stem: string, correct: string, wrong: string[]): { problems: string[]; verified: boolean } {
  const r = runPseudo(src);
  const correctInf = INFINITE.test(toPlain(correct));
  if (r.status === 'unrunnable') {
    // A snippet that needs an input can't be run on its own. One marked "Infinite loop" must be runnable, though.
    return { problems: correctInf ? [`marked as never stopping, but it can't run: ${r.why}`] : [], verified: false };
  }
  if (r.status === 'infinite') return { problems: correctInf ? [] : [`this snippet never stops, but the marked answer is "${correct}"`], verified: correctInf };
  if (correctInf) return { problems: [`marked as never stopping, but it finishes and prints ${JSON.stringify(r.stdout)}`], verified: false };
  const out = plainKey(r.stdout);
  if (!out) return { problems: [], verified: false };
  if (plainKey(correct) === out) return { problems: [], verified: true };
  // The stem may ask something other than the output ("how many times..."): then no option need equal it.
  if (/how many|which line|what (does|is) .*(compute|calculate)|number of|complexity/i.test(stem)) return { problems: [], verified: false };
  const clash = wrong.find((w) => plainKey(w) === out);
  return { problems: clash ? [`it prints ${JSON.stringify(r.stdout)}, which is a wrong option, not the marked answer "${correct}"`] : [], verified: false };
}

function codeProblems(code: CodeBlock | undefined, stem: string, solution: string, sub: string): string[] {
  if (!code) return [];
  const p: string[] = [];
  if (code.lang === 'python') {
    if (subtopicInfo(sub).area.id !== 'prog') p.push('Python is only allowed in the Programming area');
    if (!/python/i.test(stem)) p.push('a Python question must say so in its stem');
    p.push(...pyProblems(code));
    if (/\brange\(/.test(code.source) && !/(not includ|stops? before|exclud|up to but)/i.test(solution)) p.push('explain the range rule in the solution (it stops before the end value)');
  } else {
    p.push(...dialectProblems(code.source));
    if (/\b[A-Za-z_]\w*\[/.test(code.source) && !/indexed from 1/i.test(stem)) p.push('arrays: the stem must say "Arrays are indexed from 1."');
  }
  return p;
}

describe('static question style', () => {
  it('no Challenge questions', () => {
    expect(STATIC.filter((q) => !['foundation', 'exam'].includes(q.difficulty)).map((q) => q.id)).toEqual([]);
  });

  it('stems are short', () => {
    const over = STATIC.filter((q) => stemWords(q.stem) > limitFor(q.subtopic)).map((q) => `${q.id}: ${stemWords(q.stem)} words`);
    expect(over).toEqual([]);
  });

  it('options and mark schemes never depend on letters', () => {
    const bad = STATIC.flatMap((q) => [
      ...q.options.filter((o) => LETTER_OPTION.test(toPlain(o))).map((o) => `${q.id}: option "${o}"`),
      ...[q.stem, q.markScheme.solution, q.markScheme.keyIdea, ...q.markScheme.whyWrong.filter((w): w is string => !!w)]
        .filter((t) => LETTER_TEXT.test(t))
        .map((t) => `${q.id}: "${t.slice(0, 60)}..."`),
    ]);
    expect(bad).toEqual([]);
  });

  it('code follows the house rules', () => {
    const bad = STATIC.flatMap((q) => codeProblems(q.code, q.stem, q.markScheme.solution, q.subtopic).map((x) => `${q.id}: ${x}`));
    expect(bad).toEqual([]);
  });

  it('pseudocode answers match what the code really does', () => {
    const bad: string[] = [];
    for (const q of STATIC) {
      if (q.code?.lang !== 'pseudocode') continue;
      const wrong = q.options.filter((_, i) => i !== q.correctIndex);
      const r = runProblems(q.code.source, q.stem, q.options[q.correctIndex], wrong);
      bad.push(...r.problems.map((x) => `${q.id}: ${x}`));
      if (r.verified && !q.check) bad.push(`${q.id}: a runnable trace needs a check that recomputes the answer in TypeScript`);
    }
    expect(bad).toEqual([]);
  });

  it('no Python in the code of areas other than Programming, and at most 20% in Programming', () => {
    if (FILTER.length) return;
    const nonProg = STATIC.filter((q) => q.code?.lang === 'python' && subtopicInfo(q.subtopic).area.id !== 'prog').map((q) => q.id);
    expect(nonProg).toEqual([]);
    const prog = STATIC.filter((q) => q.code && subtopicInfo(q.subtopic).area.id === 'prog');
    const py = prog.filter((q) => q.code!.lang === 'python');
    expect(py.length / prog.length).toBeLessThanOrEqual(0.2);
  });
});

describe('generators', () => {
  it('none is Challenge level', () => {
    expect(GENS.filter((g) => !['foundation', 'exam'].includes(g.difficulty)).map((g) => g.id)).toEqual([]);
  });
  for (const g of GENS) {
    it(`${g.id}: stems, code and answers`, () => {
      const bad = new Set<string>();
      for (let seed = 1; seed <= GEN_N && bad.size < 10; seed++) {
        const core = g.generate(new Rng(seed));
        const words = stemWords(core.stem);
        if (words > limitFor(g.subtopic)) bad.add(`stem has ${words} words: ${core.stem.slice(0, 80)}`);
        if (core.code?.lang === 'python') bad.add('generators output pseudocode, not Python');
        if (core.code?.lang === 'pseudocode') {
          for (const x of codeProblems(core.code, core.stem, core.solution, g.subtopic)) bad.add(`seed ${seed}: ${x}`);
          for (const x of runProblems(core.code.source, core.stem, core.answer, core.distractors.map((d) => d.text)).problems) bad.add(`seed ${seed}: ${x}`);
        }
      }
      expect([...bad]).toEqual([]);
    });
  }
});

describe('lessons', () => {
  const FENCE = /```pseudocode\n([\s\S]*?)```/g;
  for (const { path, lesson } of LESSONS) {
    it(`pseudocode in ${baseName(path)} is in the dialect`, () => {
      const texts = [lesson.know, lesson.simple, lesson.examTip, ...lesson.traps, ...lesson.examples.flatMap((e) => [e.problem, e.answer, ...e.steps])];
      const bad: string[] = [];
      for (const t of texts) for (const m of t.matchAll(FENCE)) bad.push(...dialectProblems(m[1].trimEnd()).map((x) => `${x}\n${m[1]}`));
      expect(bad).toEqual([]);
    });
  }
});

describe('coverage minimums', () => {
  const subs = FILTER.length ? SUBTOPICS.filter((s) => FILTER.includes(s.id)) : SUBTOPICS;
  it('every subtopic has at least 15 static questions, 6 at Exam level and 5 at Foundation', () => {
    const bad = subs.flatMap((s) => {
      const qs = STATIC.filter((q) => q.subtopic === s.id);
      const e = qs.filter((q) => q.difficulty === 'exam').length;
      const f = qs.filter((q) => q.difficulty === 'foundation').length;
      return qs.length >= 15 && e >= 6 && f >= 5 ? [] : [`${s.id}: ${qs.length} total, ${e} exam, ${f} foundation`];
    });
    expect(bad).toEqual([]);
  });

  it('prints the per-subtopic counts', () => {
    const rows = subs.map((s) => {
      const qs = STATIC.filter((q) => q.subtopic === s.id);
      const c = (d: string) => qs.filter((q) => q.difficulty === d).length;
      const py = qs.filter((q) => q.code?.lang === 'python').length;
      const ps = qs.filter((q) => q.code?.lang === 'pseudocode').length;
      const g = GENS.filter((x) => x.subtopic === s.id).length;
      return `${s.id.padEnd(30)} ${String(qs.length).padStart(4)} static  ${String(c('foundation')).padStart(3)} F  ${String(c('exam')).padStart(3)} E  ${String(ps).padStart(3)} pseudo  ${String(py).padStart(2)} py  ${String(g).padStart(2)} gens`;
    });
    const prog = STATIC.filter((q) => q.code && subtopicInfo(q.subtopic).area.id === 'prog');
    const py = prog.filter((q) => q.code!.lang === 'python').length;
    console.log(
      [
        ...rows,
        '',
        `TOTAL ${STATIC.length} static, ${STATIC.filter((q) => q.difficulty === 'foundation').length} Foundation, ${STATIC.filter((q) => q.difficulty === 'exam').length} Exam, ${GENS.length} generators, ${LESSONS.length} lessons`,
        `Programming code questions: ${prog.length}, Python ${py} (${prog.length ? Math.round((100 * py) / prog.length) : 0}%)`,
      ].join('\n'),
    );
    expect(rows.length).toBeGreaterThan(0);
  });
});
