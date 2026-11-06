import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

type Cand = { text: string; value: string | number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answerText: string, answerValue: string | number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.text === answerText || String(c.value) === String(answerValue)) continue;
    if (out.some((o) => o.text === c.text || String(o.value) === String(c.value))) continue;
    out.push(c);
  }
  return out;
}

const code = (s: string) => `\`${s}\``;

// ---------------------------------------------------------------- 1. which branch of a nested if/else runs
interface Theme {
  v: string;
  /** Labels from the lowest band (the final else) to the highest band. */
  labels: [string, string, string, string];
  base: [number, number];
  step: [number, number];
}

const THEMES: Theme[] = [
  { v: 'temp', labels: ['cold', 'mild', 'warm', 'hot'], base: [5, 15], step: [5, 10] },
  { v: 'score', labels: ['fail', 'pass', 'merit', 'top'], base: [40, 55], step: [10, 15] },
  { v: 'speed', labels: ['slow', 'normal', 'fast', 'speeding'], base: [20, 40], step: [10, 30] },
  { v: 'level', labels: ['empty', 'low', 'ok', 'full'], base: [10, 25], step: [15, 25] },
];

type Op = '>=' | '>';
const passes = (x: number, op: Op, t: number) => (op === '>=' ? x >= t : x > t);

/** Lines of a chain written as nested if/else, 3 spaces per level. */
function nestedIf(v: string, op: Op, conds: { t: number; label: string }[], elseLabel: string, i = 0, depth = 0): string[] {
  const pad = '   '.repeat(depth);
  if (i === conds.length) return [`${pad}print("${elseLabel}")`];
  return [
    `${pad}if ${v} ${op} ${conds[i].t}`,
    `${pad}   print("${conds[i].label}")`,
    `${pad}else`,
    ...nestedIf(v, op, conds, elseLabel, i + 1, depth + 1),
    `${pad}end if`,
  ];
}

function elifBranch(rng: Rng): GeneratedCore {
  const th = rng.pick(THEMES);
  const m5 = (lo: number, hi: number) => 5 * rng.int(lo / 5, hi / 5);
  const a = m5(th.base[0], th.base[1]);
  const b = a + m5(th.step[0], th.step[1]);
  const c = b + m5(th.step[0], th.step[1]);
  const x = rng.bool(0.5) ? rng.pick([a, b, c]) : rng.int(Math.max(0, a - 6), c + 6);
  const order: 'desc' | 'asc' = rng.bool(0.5) ? 'desc' : 'asc';
  const op: Op = rng.pick(['>=', '>'] as const);
  const flip: Op = op === '>=' ? '>' : '>=';
  const [L0, L1, L2, L3] = th.labels;
  const conds =
    order === 'desc'
      ? [
          { t: c, label: L3 },
          { t: b, label: L2 },
          { t: a, label: L1 },
        ]
      : [
          { t: a, label: L1 },
          { t: b, label: L2 },
          { t: c, label: L3 },
        ];
  const run = (o: Op) => conds.find((k) => passes(x, o, k.t))?.label ?? L0;
  const correct = run(op);
  const trueConds = conds.filter((k) => passes(x, op, k.t));
  const firstTrue = trueConds[0];

  const src = [`${th.v} = ${x}`, ...nestedIf(th.v, op, conds, L0)].join('\n');

  const pool: Cand[] = [];
  if (trueConds.length >= 2) {
    const all = trueConds.map((k) => k.label).join(' ');
    pool.push({
      text: code(all),
      value: all,
      why: 'This runs every branch whose condition is true. Each later `if` sits inside an `else`, so it is reached only when the tests above it are false.',
    });
    const last = trueConds[trueConds.length - 1];
    pool.push({
      text: code(last.label),
      value: last.label,
      why: `This picks the last condition that is true (${code(`${th.v} ${op} ${last.t}`)}). The tests run from the top, and the first true one is ${code(`${th.v} ${op} ${firstTrue.t}`)}.`,
    });
  }
  const flipped = run(flip);
  const edge = conds.find((k) => passes(x, op, k.t) !== passes(x, flip, k.t));
  if (edge) {
    pool.push({
      text: code(flipped),
      value: flipped,
      why: `This treats ${code(op)} as ${code(flip)}. Here ${th.v} equals the boundary ${edge.t}, and ${code(`${x} ${op} ${edge.t}`)} is ${passes(x, op, edge.t) ? 'true' : 'false'}, while ${code(`${x} ${flip} ${edge.t}`)} would be ${passes(x, flip, edge.t) ? 'true' : 'false'}.`,
    });
  }
  if (correct !== L0) {
    const both = `${correct} ${L0}`;
    pool.push({
      text: code(both),
      value: both,
      why: 'This also runs the final `else`. It runs only when every test above it is false.',
    });
  }
  // Fallbacks: every other single label, with the exact reason it cannot be printed.
  for (const L of [L0, L1, L2, L3]) {
    if (L === correct) continue;
    let why: string;
    if (L === L0) {
      why = `The final ${code('else')} only runs when every test is false, but ${code(`${x} ${op} ${firstTrue ? firstTrue.t : 0}`)} is true.`;
    } else {
      const k = conds.find((q) => q.label === L)!;
      why = passes(x, op, k.t)
        ? `${code(`${x} ${op} ${k.t}`)} is true, but an earlier test is also true, so this one is never reached.`
        : `This branch needs ${code(`${th.v} ${op} ${k.t}`)}, but ${code(`${x} ${op} ${k.t}`)} is false, so it cannot run.`;
    }
    pool.push({ text: code(L), value: L, why });
  }
  const answer = code(correct);
  const distractors = pickDistinct(answer, correct, pool);

  const steps: string[] = [];
  let i = 1;
  for (const k of conds) {
    if (passes(x, op, k.t)) {
      steps.push(`${i}. ${code(`${th.v} ${op} ${k.t}`)}: ${code(`${x} ${op} ${k.t}`)} is true, so ${code(k.label)} is printed and the matching ${code('else')} is skipped.`);
      break;
    }
    steps.push(`${i}. ${code(`${th.v} ${op} ${k.t}`)}: ${code(`${x} ${op} ${k.t}`)} is false, so move on to the ${code('else')}.`);
    i++;
  }
  if (!firstTrue) steps.push(`${i}. None of the tests is true, so the final ${code('else')} prints ${code(L0)}.`);
  const later = trueConds.slice(1);
  const note = later.length
    ? `\n\nLater tests such as ${code(`${th.v} ${op} ${later[0].t}`)} are also true, but they are never reached.`
    : '';

  return {
    stem: 'What does this pseudocode print? Output lines are shown separated by a space.',
    code: { lang: 'pseudocode', source: src },
    answer,
    answerValue: correct,
    distractors,
    solution:
      'The tests run **from the top down**, and each later test is reached only if the ones above it are false. ' +
      `Here ${code(th.v)} is ${x} and every test uses ${code(op)}${op === '>=' ? ' (the boundary value counts)' : ' (strict: the boundary value does not count)'}.\n\n` +
      steps.join('\n') +
      note +
      `\n\nAnswer: ${answer}`,
    keyIdea: 'In a chain of nested if/else, only the first true branch from the top runs; the final else runs only if every test is false.',
  };
}

// ---------------------------------------------------------------- 2. count array items passing a compound condition
type Form = 'and' | 'or' | 'between' | 'not';

interface CountSetup {
  form: Form;
  nums: number[];
  cond: string;
  usesMod: boolean;
  correct: (n: number) => boolean;
  pool: { f: (n: number) => boolean | number; why: string }[];
  /** Columns of the trace table: header + evaluator. */
  cols: { h: string; f: (n: number) => boolean }[];
}

function countSetup(rng: Rng): CountSetup {
  const form = rng.pick(['and', 'or', 'between', 'not'] as const);
  const all = Array.from({ length: 40 }, (_, i) => i + 1);
  const nums = rng.sample(all, 6);
  const ensure = (v: number) => {
    if (!nums.includes(v)) nums[rng.int(0, nums.length - 1)] = v;
  };
  if (form === 'between') {
    const lo = rng.int(5, 15);
    const hi = lo + rng.int(8, 18);
    if (rng.bool(0.7)) ensure(lo);
    if (rng.bool(0.7)) ensure(hi);
    const cond = `n > ${lo} and n <= ${hi}`;
    return {
      form,
      nums,
      cond,
      usesMod: false,
      correct: (n) => lo < n && n <= hi,
      pool: [
        { f: (n) => lo <= n && n <= hi, why: `This counts ${lo} itself, treating the strict ${code('>')} as ${code('>=')}.` },
        { f: (n) => lo < n && n < hi, why: `This leaves out ${hi}, treating ${code('<=')} as the strict ${code('<')}.` },
        { f: (n) => lo < n, why: `This only checks ${code(`n > ${lo}`)} and forgets the upper limit ${code(`n <= ${hi}`)}.` },
        { f: (n) => lo < n || n <= hi, why: 'This reads `and` as `or`, counting numbers that pass either test. `and` needs both tests to be true.' },
      ],
      cols: [
        { h: code(`n > ${lo}`), f: (n) => lo < n },
        { h: code(`n <= ${hi}`), f: (n) => n <= hi },
      ],
    };
  }
  const k = rng.pick([3, 4, 5]);
  const t = rng.bool(0.6) ? k * rng.int(Math.ceil(10 / k), Math.floor(30 / k)) : rng.int(10, 30);
  if (rng.bool(0.7)) ensure(t);
  const div = (n: number) => n % k === 0;
  const divH = code(`mod(n,${k}) == 0`);
  if (form === 'and') {
    return {
      form,
      nums,
      cond: `mod(n,${k}) == 0 and n > ${t}`,
      usesMod: true,
      correct: (n) => div(n) && n > t,
      pool: [
        { f: (n) => div(n) || n > t, why: 'This reads `and` as `or`, counting numbers that pass either test. `and` needs both tests to be true.' },
        { f: (n) => div(n) && n >= t, why: `This counts ${t} itself, treating the strict ${code('>')} as ${code('>=')}.` },
        { f: (n) => div(n), why: `This only checks ${divH} and ignores the second test ${code(`n > ${t}`)}.` },
        { f: (n) => n > t, why: `This only checks ${code(`n > ${t}`)} and ignores the first test ${divH}.` },
      ],
      cols: [
        { h: divH, f: div },
        { h: code(`n > ${t}`), f: (n) => n > t },
      ],
    };
  }
  if (form === 'or') {
    return {
      form,
      nums,
      cond: `mod(n,${k}) == 0 or n > ${t}`,
      usesMod: true,
      correct: (n) => div(n) || n > t,
      pool: [
        { f: (n) => div(n) && n > t, why: 'This reads `or` as `and`, counting only numbers that pass both tests. `or` needs just one of them to be true.' },
        {
          f: (n) => (div(n) ? 1 : 0) + (n > t ? 1 : 0),
          why: 'This adds the number of multiples to the number of large values, so a number that passes both tests is counted twice. Each number can add at most 1 to `count`.',
        },
        { f: (n) => div(n) || n >= t, why: `This counts ${t} itself, treating the strict ${code('>')} as ${code('>=')}.` },
        { f: (n) => div(n), why: `This only checks ${divH} and ignores the second test ${code(`n > ${t}`)}.` },
      ],
      cols: [
        { h: divH, f: div },
        { h: code(`n > ${t}`), f: (n) => n > t },
      ],
    };
  }
  // form === 'not'
  return {
    form,
    nums,
    cond: `not mod(n,${k}) == 0 and n < ${t}`,
    usesMod: true,
    correct: (n) => !div(n) && n < t,
    pool: [
      {
        f: (n) => !(div(n) && n < t),
        why: `This applies ${code('not')} to the whole condition, as if it were ${code(`not (mod(n,${k}) == 0 and n < ${t})`)}. But ${code('not')} is done before ${code('and')}, so it only negates ${divH}.`,
      },
      { f: (n) => div(n) && n < t, why: `This ignores the ${code('not')}, counting the multiples of ${k} below ${t} instead of the non-multiples.` },
      { f: (n) => !div(n) && n <= t, why: `This counts ${t} itself, treating the strict ${code('<')} as ${code('<=')}.` },
      { f: (n) => !div(n) || n < t, why: 'This reads `and` as `or`, counting numbers that pass either test. `and` needs both parts to be true.' },
    ],
    cols: [
      { h: divH, f: div },
      { h: code(`not mod(n,${k}) == 0`), f: (n) => !div(n) },
      { h: code(`n < ${t}`), f: (n) => n < t },
    ],
  };
}

function countCompound(rng: Rng): GeneratedCore {
  let setup: CountSetup = countSetup(rng);
  let ans = 0;
  let distractors: Cand[] = [];
  for (let tries = 0; tries < 40; tries++) {
    if (tries > 0) setup = countSetup(rng);
    const s = setup;
    ans = s.nums.filter(s.correct).length;
    const pool: Cand[] = s.pool.map((p) => {
      const v = s.nums.reduce((acc, n) => acc + Number(p.f(n)), 0);
      return { text: code(String(v)), value: v, why: p.why };
    });
    distractors = pickDistinct(code(String(ans)), ans, pool);
    if (distractors.length === 3) break;
  }
  // Guaranteed-different fallbacks (rarely needed).
  for (const d of [ans + 1, ans - 1, ans + 2, ans + 3]) {
    if (distractors.length === 3) break;
    if (d < 0 || d === ans || distractors.some((x) => x.value === d)) continue;
    distractors.push({
      text: code(String(d)),
      value: d,
      why: `This is a miscount: checking each number against the condition ${code(setup.cond)} row by row gives ${ans}, not ${d}.`,
    });
  }

  const { nums, cond, cols, correct, usesMod } = setup;
  const src = [
    `A = [${nums.join(', ')}]`,
    'count = 0',
    'for i = 1 to length(A)',
    '   n = A[i]',
    `   if ${cond}${usesMod ? ' // mod is the modulus operator' : ''}`,
    '      count = count + 1',
    '   end if',
    'end for',
    'print(count)',
  ].join('\n');
  const tf = (b: boolean) => (b ? 'true' : 'false');
  let running = 0;
  const rows = nums.map((n) => {
    const ok = correct(n);
    if (ok) running++;
    return `| ${n} | ${cols.map((c) => tf(c.f(n))).join(' | ')} | ${tf(ok)} | ${running} |`;
  });
  const header = `| n | ${cols.map((c) => c.h).join(' | ')} | condition | count |\n|${'---|'.repeat(cols.length + 3)}`;
  const intro: Record<Form, string> = {
    and: '`and` is true only when **both** tests are true.',
    or: '`or` is true when **at least one** test is true.',
    between: 'Both parts must hold: `n` must be above the lower limit (strictly) and at most the upper limit.',
    not: `${code('not')} is done before ${code('and')} (but after ${code('==')}), so it negates only the test next to it: n must **not** be a multiple and must be below the limit.`,
  };
  const answer = code(String(ans));

  return {
    stem: 'What does this pseudocode print? Arrays are indexed from 1.',
    code: { lang: 'pseudocode', source: src },
    answer,
    answerValue: ans,
    distractors,
    solution:
      `The loop adds 1 to ${code('count')} for every number that makes ${code(cond)} true. ${intro[setup.form]}\n\n` +
      `${header}\n${rows.join('\n')}\n\n` +
      `The condition is true for ${ans} of the ${nums.length} numbers, so ${code('count')} ends at ${ans}.\n\n` +
      `Answer: ${answer}`,
    keyIdea: 'Check every item against the whole condition, in the order comparisons, `not`, `and`, `or`, and add 1 only when the full condition is true.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-conditionals-elif-branch',
    subtopic: 'conditionals',
    difficulty: 'exam',
    title: 'Which branch of a nested if/else runs?',
    generate: elifBranch,
  },
  {
    id: 'gen-conditionals-count-compound',
    subtopic: 'conditionals',
    difficulty: 'exam',
    title: 'Count the items that pass a compound condition',
    generate: countCompound,
  },
];
