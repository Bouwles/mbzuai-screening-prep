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

// ---------------------------------------------------------------- 1. which branch of an if/elif/else chain runs
interface Theme {
  v: string;
  /** Labels from the lowest band (the else) to the highest band. */
  labels: [string, string, string, string];
  base: [number, number];
  step: [number, number];
}

const THEMES: Theme[] = [
  { v: 'temp', labels: ['cold', 'mild', 'warm', 'hot'], base: [5, 15], step: [5, 10] },
  { v: 'score', labels: ['F', 'C', 'B', 'A'], base: [40, 55], step: [10, 15] },
  { v: 'speed', labels: ['slow', 'normal', 'fast', 'speeding'], base: [20, 40], step: [10, 30] },
  { v: 'level', labels: ['empty', 'low', 'ok', 'full'], base: [10, 25], step: [15, 25] },
];

type Op = '>=' | '>';
const passes = (x: number, op: Op, t: number) => (op === '>=' ? x >= t : x > t);

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

  const src =
    `${th.v} = ${x}\n` +
    conds.map((k, i) => `${i === 0 ? 'if' : 'elif'} ${th.v} ${op} ${k.t}:\n    print("${k.label}")`).join('\n') +
    `\nelse:\n    print("${L0}")`;

  const pool: Cand[] = [];
  if (trueConds.length >= 2) {
    const all = trueConds.map((k) => k.label).join(' ');
    pool.push({
      text: code(all),
      value: all,
      why: 'This runs every branch whose condition is True, as if each `elif` were a separate `if`. In an if/elif/else chain only the first true branch runs.',
    });
    const last = trueConds[trueConds.length - 1];
    pool.push({
      text: code(last.label),
      value: last.label,
      why: `This picks the last condition that is True (${code(`${th.v} ${op} ${last.t}`)}). Python checks from the top and runs the first true branch, which is ${code(`${th.v} ${op} ${firstTrue.t}`)}.`,
    });
  }
  const flipped = run(flip);
  const edge = conds.find((k) => passes(x, op, k.t) !== passes(x, flip, k.t));
  if (edge) {
    pool.push({
      text: code(flipped),
      value: flipped,
      why: `This treats ${code(op)} as ${code(flip)}. Here ${th.v} equals the boundary ${edge.t}, and ${code(`${x} ${op} ${edge.t}`)} is ${passes(x, op, edge.t) ? 'True' : 'False'}, while ${code(`${x} ${flip} ${edge.t}`)} would be ${passes(x, flip, edge.t) ? 'True' : 'False'}.`,
    });
  }
  if (correct !== L0) {
    const both = `${correct} ${L0}`;
    pool.push({
      text: code(both),
      value: both,
      why: 'This also runs the `else` branch. `else` runs only when every condition above it is False.',
    });
  }
  // Fallbacks: every other single label, with the exact reason it cannot be printed.
  for (const L of [L0, L1, L2, L3]) {
    if (L === correct) continue;
    let why: string;
    if (L === L0) {
      why = `The ${code('else')} branch only runs when every condition is False, but ${code(`${x} ${op} ${firstTrue ? firstTrue.t : 0}`)} is True.`;
    } else {
      const k = conds.find((q) => q.label === L)!;
      why = passes(x, op, k.t)
        ? `${code(`${x} ${op} ${k.t}`)} is True, but an earlier condition in the chain is also True, and Python only runs the first true branch.`
        : `This branch needs ${code(`${th.v} ${op} ${k.t}`)}, but ${code(`${x} ${op} ${k.t}`)} is False, so it cannot run.`;
    }
    pool.push({ text: code(L), value: L, why });
  }
  const answer = code(correct);
  const distractors = pickDistinct(answer, correct, pool);

  const steps: string[] = [];
  let i = 1;
  for (const k of conds) {
    if (passes(x, op, k.t)) {
      steps.push(`${i}. ${code(`${th.v} ${op} ${k.t}`)}: ${code(`${x} ${op} ${k.t}`)} is True, so Python prints ${code(k.label)} and skips the rest of the chain.`);
      break;
    }
    steps.push(`${i}. ${code(`${th.v} ${op} ${k.t}`)}: ${code(`${x} ${op} ${k.t}`)} is False, so move on.`);
    i++;
  }
  if (!firstTrue) steps.push(`${i}. None of the conditions is True, so the ${code('else')} branch runs and prints ${code(L0)}.`);
  const later = trueConds.slice(1);
  const note = later.length
    ? `\n\nLater conditions such as ${code(`${th.v} ${op} ${later[0].t}`)} are also True, but they are never checked, because only the first true branch runs.`
    : '';

  return {
    stem: 'What does this Python code print? (If more than one line is printed, the lines are shown separated by spaces.)',
    code: { lang: 'python', source: src },
    answer,
    answerValue: correct,
    distractors,
    solution:
      'Python checks the conditions **from the top down** and runs only the **first** branch whose condition is True. ' +
      `Here ${code(th.v)} is ${x} and every test uses ${code(op)}${op === '>=' ? ' (the boundary value counts)' : ' (strict: the boundary value does not count)'}.\n\n` +
      steps.join('\n') +
      note +
      `\n\nAnswer: ${answer}`,
    keyIdea: 'In an if/elif/else chain only the first branch (from the top) whose condition is True runs; the `else` runs only if every condition is False.',
    python: { stdout: `${correct}\n` },
  };
}

// ---------------------------------------------------------------- 2. count list items passing a compound condition
type Form = 'and' | 'or' | 'chain' | 'not';

interface CountSetup {
  form: Form;
  nums: number[];
  cond: string;
  correct: (n: number) => boolean;
  pool: { f: (n: number) => boolean | number; why: string }[];
  /** Columns of the trace table: header + evaluator. */
  cols: { h: string; f: (n: number) => boolean }[];
}

function countSetup(rng: Rng): CountSetup {
  const form = rng.pick(['and', 'or', 'chain', 'not'] as const);
  const all = Array.from({ length: 40 }, (_, i) => i + 1);
  const nums = rng.sample(all, 8);
  const ensure = (v: number) => {
    if (!nums.includes(v)) nums[rng.int(0, nums.length - 1)] = v;
  };
  if (form === 'chain') {
    const lo = rng.int(5, 15);
    const hi = lo + rng.int(8, 18);
    if (rng.bool(0.7)) ensure(lo);
    if (rng.bool(0.7)) ensure(hi);
    const cond = `${lo} < n <= ${hi}`;
    return {
      form,
      nums,
      cond,
      correct: (n) => lo < n && n <= hi,
      pool: [
        {
          f: () => true,
          why: `This evaluates the chain left to right like C or Java, as ${code(`(${lo} < n) <= ${hi}`)}. Then ${code(`${lo} < n`)} gives True or False (1 or 0), which is always ${code(`<= ${hi}`)}, so every number would be counted. Python reads it as ${code(`${lo} < n and n <= ${hi}`)}.`,
        },
        { f: (n) => lo <= n && n <= hi, why: `This counts ${lo} itself, treating the strict ${code('<')} as ${code('<=')}.` },
        { f: (n) => lo < n && n < hi, why: `This leaves out ${hi}, treating ${code('<=')} as the strict ${code('<')}.` },
        { f: (n) => lo < n, why: `This only checks ${code(`${lo} < n`)} and forgets the upper limit ${code(`n <= ${hi}`)}.` },
      ],
      cols: [
        { h: code(`${lo} < n`), f: (n) => lo < n },
        { h: code(`n <= ${hi}`), f: (n) => n <= hi },
      ],
    };
  }
  const k = rng.pick([3, 4, 5]);
  const t = rng.bool(0.6) ? k * rng.int(Math.ceil(10 / k), Math.floor(30 / k)) : rng.int(10, 30);
  if (rng.bool(0.7)) ensure(t);
  const div = (n: number) => n % k === 0;
  const divH = code(`n % ${k} == 0`);
  if (form === 'and') {
    return {
      form,
      nums,
      cond: `n % ${k} == 0 and n > ${t}`,
      correct: (n) => div(n) && n > t,
      pool: [
        { f: (n) => div(n) || n > t, why: 'This reads `and` as `or`, counting numbers that pass either test. `and` needs both tests to be True.' },
        { f: (n) => div(n) && n >= t, why: `This counts ${t} itself, treating the strict ${code('>')} as ${code('>=')}.` },
        { f: (n) => div(n), why: `This only checks ${divH} and ignores the second test ${code(`n > ${t}`)}.` },
        { f: (n) => n > t, why: `This only checks ${code(`n > ${t}`)} and ignores the divisibility test ${divH}.` },
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
      cond: `n % ${k} == 0 or n > ${t}`,
      correct: (n) => div(n) || n > t,
      pool: [
        { f: (n) => div(n) && n > t, why: 'This reads `or` as `and`, counting only numbers that pass both tests. `or` needs just one of them to be True.' },
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
    cond: `not n % ${k} == 0 and n < ${t}`,
    correct: (n) => !div(n) && n < t,
    pool: [
      {
        f: (n) => !(div(n) && n < t),
        why: `This applies ${code('not')} to the whole condition, as if it were ${code(`not (n % ${k} == 0 and n < ${t})`)}. But ${code('not')} binds more tightly than ${code('and')}, so it only negates ${divH}.`,
      },
      { f: (n) => div(n) && n < t, why: `This ignores the ${code('not')}, counting the multiples of ${k} below ${t} instead of the non-multiples.` },
      { f: (n) => !div(n) && n <= t, why: `This counts ${t} itself, treating the strict ${code('<')} as ${code('<=')}.` },
      { f: (n) => !div(n) || n < t, why: 'This reads `and` as `or`, counting numbers that pass either test. `and` needs both parts to be True.' },
    ],
    cols: [
      { h: divH, f: div },
      { h: code(`not n % ${k} == 0`), f: (n) => !div(n) },
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

  const { nums, cond, cols, correct } = setup;
  const src = `nums = [${nums.join(', ')}]\ncount = 0\nfor n in nums:\n    if ${cond}:\n        count += 1\nprint(count)`;
  const tf = (b: boolean) => (b ? 'True' : 'False');
  let running = 0;
  const rows = nums.map((n) => {
    const ok = correct(n);
    if (ok) running++;
    return `| ${n} | ${cols.map((c) => tf(c.f(n))).join(' | ')} | ${tf(ok)} | ${running} |`;
  });
  const header = `| n | ${cols.map((c) => c.h).join(' | ')} | condition | count |\n|${'---|'.repeat(cols.length + 3)}`;
  const intro: Record<Form, string> = {
    and: '`and` is True only when **both** tests are True.',
    or: '`or` is True when **at least one** test is True.',
    chain: `A chained comparison like ${code(cond)} means ${code(cond.replace(' < n <= ', ' < n and n <= '))}: n must be above the lower limit (strictly) and at most the upper limit.`,
    not: `${code('not')} binds more tightly than ${code('and')} (but less tightly than ${code('==')}), so the condition means ${code(`(not (${cond.slice(4, cond.indexOf(' and '))})) and ${cond.slice(cond.indexOf(' and ') + 5)}`)}: n must **not** be a multiple and must be below the limit.`,
  };
  const answer = code(String(ans));

  return {
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: src },
    answer,
    answerValue: ans,
    distractors,
    solution:
      `The loop adds 1 to ${code('count')} for every number that makes ${code(cond)} True. ${intro[setup.form]}\n\n` +
      `${header}\n${rows.join('\n')}\n\n` +
      `The condition is True for ${ans} of the ${nums.length} numbers, so ${code('count')} ends at ${ans}.\n\n` +
      `Answer: ${answer}`,
    keyIdea: 'Check every item against the whole condition, using the precedence comparisons > `not` > `and` > `or`, and add 1 only when the full condition is True.',
    python: { stdout: `${ans}\n` },
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-conditionals-elif-branch',
    subtopic: 'conditionals',
    difficulty: 'exam',
    title: 'Which branch of an if/elif/else chain runs?',
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
