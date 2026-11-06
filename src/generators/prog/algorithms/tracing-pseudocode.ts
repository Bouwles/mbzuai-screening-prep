import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { m } from '../../../lib/tex';

type Cand = { v: number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: number, pool: Cand[], fallbacks: Cand[]): Cand[] {
  const out: Cand[] = [];
  const ok = (c: Cand) =>
    Number.isInteger(c.v) &&
    c.v !== answer &&
    m(String(c.v)) !== m(String(answer)) &&
    !out.some((x) => x.v === c.v || m(String(x.v)) === m(String(c.v)));
  for (const c of pool) {
    if (out.length === 3) break;
    if (ok(c)) out.push(c);
  }
  for (const c of fallbacks) {
    if (out.length === 3) break;
    if (ok(c)) out.push(c);
  }
  if (out.length < 3) throw new Error('could not build 3 distinct distractors');
  return out;
}

/** "3, 5, 7, 9" (or a shortened list "3, 5, 7, \dots, 21" when long), as inline maths. */
function listVals(vals: number[]): string {
  if (vals.length <= 10) return m(vals.join(', '));
  return m(`${vals.slice(0, 4).join(', ')}, \\dots, ${vals.slice(-2).join(', ')}`);
}

// ---------------------------------------------------------------- loop counting
type LoopForm = 'for' | 'whileLt' | 'whileLe' | 'down';

function loopCode(form: LoopForm, a: number, b: number, s: number): string {
  if (form === 'for') return [`for i = ${a} to ${b}`, '   print(i)', 'end for'].join('\n');
  if (form === 'down') return [`i = ${b}`, `while (i > ${a})`, '   print(i)', `   i = i - ${s}`, 'end while'].join('\n');
  const op = form === 'whileLt' ? '<' : '<=';
  return [`i = ${a}`, `while (i ${op} ${b})`, '   print(i)', `   i = i + ${s}`, 'end while'].join('\n');
}

/** Values of i for which the body runs, by direct simulation of the loop. */
function loopValues(form: LoopForm, a: number, b: number, s: number): { vals: number[]; after: number } {
  const vals: number[] = [];
  let i: number;
  if (form === 'down') {
    for (i = b; i > a; i -= s) vals.push(i);
  } else if (form === 'whileLt') {
    for (i = a; i < b; i += s) vals.push(i);
  } else {
    for (i = a; i <= b; i += s) vals.push(i);
  }
  return { vals, after: i };
}

function genLoopCount(rng: Rng) {
  const form = rng.pick<LoopForm>(['for', 'whileLt', 'whileLe', 'down']);
  const ask: 'count' | 'final' = form === 'for' ? 'count' : rng.bool(0.6) ? 'count' : 'final';
  const s = form === 'for' ? 1 : rng.pick([1, 1, 2, 3, 4, 5]);
  const k = rng.int(3, 10);
  const r = s === 1 ? 0 : rng.int(0, s - 1);
  const a = rng.int(2, 9);
  const b = a + s * k + r;
  const { vals, after } = loopValues(form, a, b, s);
  const count = vals.length;
  const code = loopCode(form, a, b, s);
  const strict = form === 'whileLt' || form === 'down';
  const up = form !== 'down';
  const opWord = form === 'whileLt' ? `i < ${b}` : form === 'whileLe' ? `i <= ${b}` : `i > ${a}`;

  const stem = ask === 'count' ? 'How many times is `print(i)` executed?' : 'What is the value of `i` after this loop has finished?';

  const listing = `The body runs for ${listVals(vals)}, which is ${count} value${count === 1 ? '' : 's'}.`;
  const lastVal = vals[vals.length - 1];
  const next = up ? lastVal + s : lastVal - s;
  const stopLine =
    form === 'for'
      ? `The next value would be ${m(String(next))}, which is past ${m(String(b))}, so the loop stops.`
      : `After the last pass ${m(`i = ${lastVal}`)} is updated to ${m(`i = ${next}`)}, and the check ${m(opWord.replace('<=', '\\le').replace('>=', '\\ge'))} is false, so the loop stops.`;

  let answerV: number;
  let pool: Cand[];
  let fallbacks: Cand[];
  let method: string;
  if (ask === 'count') {
    answerV = count;
    const span = b - a;
    if (strict) {
      method =
        `Shortcut for a strict condition: ${m(`\\left\\lceil \\frac{${span}}{${s}} \\right\\rceil = ${count}`)} passes (divide the distance ${m(`${b} - ${a} = ${span}`)} by the step and round **up**).`;
    } else {
      method =
        `Shortcut for an inclusive range: ${m(`\\left\\lfloor \\frac{${span}}{${s}} \\right\\rfloor + 1 = ${Math.floor(span / s)} + 1 = ${count}`)} passes (divide the distance ${m(`${b} - ${a} = ${span}`)} by the step, round **down**, then add 1 for the first value).`;
    }
    if (s === 1) method = strict ? `Shortcut: ${m(`${b} - ${a} = ${count}`)} passes (the end value is not used).` : `Shortcut: ${m(`${b} - ${a} + 1 = ${count}`)} passes (both ends are used).`;
    pool = [];
    if (strict) {
      pool.push({
        v: Math.floor(span / s) + 1,
        why: `This treats the strict test \`${opWord}\` as if it included ${m(String(up ? b : a))}, so it counts one pass for the boundary value as well.`,
      });
      pool.push({
        v: Math.floor(span / s),
        why: `This divides ${m(`${span} \\div ${s}`)} and rounds down, but the last partial step still gives a pass: whenever \`i\` is still on the right side of the boundary, the body runs.`,
      });
    } else {
      pool.push({
        v: Math.floor(span / s),
        why: `This is the fencepost error: ${s === 1 ? m(`${b} - ${a} = ${span}`) : m(`\\left\\lfloor \\frac{${span}}{${s}} \\right\\rfloor = ${Math.floor(span / s)}`)} counts the steps between values, but you must add 1 for the first value ${m(`i = ${a}`)}.`,
      });
      if (form === 'whileLe')
        pool.push({
          v: Math.ceil(span / s),
          why: `This counts as if the test were \`i < ${b}\`. With \`<=\` the value ${m(String(b))} itself would still run the body if \`i\` reached it.`,
        });
    }
    if (s > 1) {
      pool.push({
        v: span + (strict ? 0 : 1),
        why: `This ignores the step of ${s} and counts every whole number between ${m(String(a))} and ${m(String(b))}.`,
      });
    } else {
      pool.push({
        v: up ? b + (strict ? 0 : 1) : b,
        why: up
          ? `This counts as if \`i\` started at 0. It starts at ${m(String(a))}, so the values below ${m(String(a))} are never used.`
          : `This counts every value from ${m(String(b))} down to 1, as if the test were \`i > 0\`. The loop stops as soon as \`i\` is no longer greater than ${m(String(a))}.`,
      });
    }
    pool.push({
      v: count + 1,
      why:
        form === 'for'
          ? `This counts one pass too many: after ${m(`i = ${lastVal}`)} the next value ${m(String(next))} is past ${m(String(b))}, so it is never used.`
          : `This counts the number of times the condition is **checked** (${count + 1}). The last check is false, so the body does not run that time.`,
    });
    pool.push({
      v: count - 1,
      why: `This misses the very first pass, when ${m(`i = ${up ? a : b}`)}. The condition is true at the start, so the body runs straight away.`,
    });
    fallbacks = [
      { v: count + 2, why: `This adds two extra passes: one for the boundary value and one for the final failed check. Neither runs the body.` },
      { v: count - 2, why: `This leaves out both the first value and the last value of \`i\`, but the body runs for both of them.` },
    ];
  } else {
    answerV = after;
    method = `So the final value of \`i\` is ${m(String(after))}: it is the first value that fails the test, not the last value printed.`;
    pool = [
      {
        v: lastVal,
        why: `${m(String(lastVal))} is the last value **printed**, but after printing, the update ${m(`i = i ${up ? '+' : '-'} ${s}`)} still runs once more before the loop stops.`,
      },
      {
        v: up ? b : a,
        why: `This assumes \`i\` stops exactly at the boundary ${m(String(up ? b : a))}. \`i\` only changes in steps of ${s}, so it ends at the first value that fails the test.`,
      },
      {
        v: up ? after + s : after - s,
        why: `This does one update too many. As soon as \`i\` becomes ${m(String(after))}, the test is false and nothing else runs.`,
      },
    ];
    fallbacks = [
      {
        v: up ? after - 2 * s : after + 2 * s,
        why: `This is the second-last value printed. It misses the last pass (when ${m(`i = ${lastVal}`)}) and also forgets the update that runs after it.`,
      },
      { v: up ? after + 2 * s : after - 2 * s, why: 'This does two extra updates after the loop should already have stopped.' },
    ];
  }
  const ds = pickDistinct(answerV, pool, fallbacks);
  const answer = String(answerV);
  const solution =
    'Trace the values that `i` takes.\n\n' +
    `${listing}\n\n` +
    `${stopLine}\n\n` +
    `${method}\n\n` +
    `Answer: ${answer}`;
  return {
    stem,
    code: { lang: 'pseudocode' as const, source: code },
    answer,
    answerValue: answerV,
    distractors: ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
    solution,
    keyIdea:
      ask === 'count'
        ? 'Count loop passes by listing the values of the counter (first, step, last) and checking whether the end value is included.'
        : 'After a while loop ends, the counter holds the first value that made the condition false, not the last value used inside the loop.',
  };
}

// ---------------------------------------------------------------- accumulator with a condition
function genAccumulator(rng: Rng) {
  const n = rng.int(8, 20);
  const k = rng.int(2, 5);
  const eq = rng.bool(0.5);
  const v = rng.pick(['total', 'sum', 's']);
  const pass = (i: number) => (eq ? i % k === 0 : i % k !== 0);
  const range = (hi: number) => Array.from({ length: hi }, (_, j) => j + 1);
  const chosen = range(n).filter(pass);
  const other = range(n).filter((i) => !pass(i));
  const sumOf = (xs: number[]) => xs.reduce((x, y) => x + y, 0);
  const S = sumOf(chosen);
  const all = (n * (n + 1)) / 2;
  const cond = `mod(i,${k}) ${eq ? '==' : '!='} 0`;
  const code = [`${v} = 0`, `for i = 1 to ${n}`, `   if ${cond} // mod is the modulus operator`, `      ${v} = ${v} + i`, '   end if', 'end for', `print(${v})`].join('\n');
  const stem = 'What is printed?';
  const condWords = eq ? `a multiple of ${k}` : `not a multiple of ${k}`;
  const pool: Cand[] = [
    {
      v: sumOf(range(n - 1).filter(pass)),
      why: `This stops at ${m(String(n - 1))}, treating \`to ${n}\` as if ${m(String(n))} were excluded. In this pseudocode the end value ${m(String(n))} is included (and it passes the test).`,
    },
    {
      v: sumOf(other),
      why: `This reverses the condition and adds the numbers that are ${eq ? `not multiples of ${k}` : `multiples of ${k}`}. \`${eq ? '==' : '!='}\` means ${eq ? '"is equal to"' : '"is not equal to"'}.`,
    },
    { v: all, why: `This ignores the \`if\` and adds every number from 1 to ${n}. Only the numbers that are ${condWords} are added.` },
    { v: chosen.length, why: `This **counts** how many numbers pass the test (${chosen.length}) instead of adding them up: the line adds \`i\`, not 1.` },
    {
      v: chosen[chosen.length - 1],
      why: `This keeps only the last number that passes the test, as if the line were \`${v} = i\`. Because it says \`${v} = ${v} + i\`, the earlier values are kept.`,
    },
  ];
  const fallbacks: Cand[] = [
    {
      v: S + n,
      why: pass(n)
        ? `This adds the end value ${m(String(n))} twice. Each value of \`i\` is visited only once.`
        : `This adds the end value ${m(String(n))} as well, even though it fails the test.`,
    },
    { v: S - chosen[0], why: `This misses the first number that passes the test, ${m(String(chosen[0]))}.` },
  ];
  const ds = pickDistinct(S, pool, fallbacks);
  const answer = String(S);
  let working: string;
  const vTex = `\\text{${v}}`;
  if (eq) {
    working =
      chosen.length === 1
        ? `Only one value of \`i\` from 1 to ${n} is ${condWords}: ${m(String(chosen[0]))}. So it is the only number added, and ${m(`${vTex} = ${S}`)}.`
        : `The values of \`i\` from 1 to ${n} that are ${condWords} are ${listVals(chosen)}.\n\n` +
          `Adding them: ${m(`${chosen.join(' + ')} = ${S}`)}.`;
  } else {
    const mult = other;
    const skipped =
      mult.length === 1
        ? `The only skipped multiple is ${m(String(mult[0]))}.`
        : `Sum of the skipped multiples: ${m(`${mult.join(' + ')} = ${sumOf(mult)}`)}.`;
    working =
      `The test is true for every \`i\` that is ${condWords}, so the loop adds everything from 1 to ${n} **except** ${listVals(mult)}.\n\n` +
      `Sum of all the numbers: ${m(`1 + 2 + \\dots + ${n} = \\frac{${n} \\times ${n + 1}}{2} = ${all}`)}.\n\n` +
      `${skipped}\n\n` +
      `So ${m(`${vTex} = ${all} - ${sumOf(mult)} = ${S}`)}.`;
  }
  const solution =
    `\`${v}\` starts at 0 and, on each pass, \`i\` is added only if \`${cond}\` is true, which means \`i\` is ${condWords}.\n\n` +
    `${working}\n\n` +
    `Answer: ${answer}`;
  return {
    stem,
    code: { lang: 'pseudocode' as const, source: code },
    answer,
    answerValue: S,
    distractors: ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
    solution,
    keyIdea: 'An `if` inside a loop filters which passes update the accumulator; list the values that pass the test, then add them.',
  };
}

// ---------------------------------------------------------------- while (true) with a mod accumulator
const INFINITE = 'Infinite loop';
const posMod = (a: number, b: number) => ((a % b) + b) % b;

type Brk = '<' | '<=';
type Row = { n: number; r: number; t: number };

/** Run the loop as the code does: add first, then move n, then test for the break. Passes are capped by the caller's choice of start. */
function simulate(start: number, step: number, md: number, extra: number, brk: Brk): { rows: Row[]; t: number; last: number } {
  const rows: Row[] = [];
  let n = start;
  let t = 0;
  for (;;) {
    const r = posMod(n, md);
    t += r + extra;
    rows.push({ n, r, t });
    n -= step;
    if (brk === '<' ? n < 0 : n <= 0) return { rows, t, last: n };
  }
}

function modLine(md: number, extra: number): string {
  return `   t = t + mod(n,${md})${extra ? ` + ${extra}` : ''} // mod is the modulus operator`;
}

function genWhileTrueMod(rng: Rng): GeneratedCore {
  let step: number;
  let md: number;
  let start: number;
  do {
    step = rng.int(4, 9);
    md = rng.int(2, 5);
    // At most about 7 passes, so a trace fits in the time available.
    const maxStart = Math.min(60, step * 7);
    start = rng.int(15, maxStart);
    // Landing exactly on 0 is the case where <0 and <=0 behave differently.
    if (rng.bool(0.35)) start = step * rng.int(Math.ceil(15 / step), Math.floor(maxStart / step));
    // Every remainder being 0 would leave nothing to trace.
  } while (simulate(start, step, md, 0, '<').t === 0);
  const brk: Brk = rng.bool() ? '<' : '<=';
  const extra = rng.bool(0.3) ? 1 : 0;
  const addTex = extra ? `\\text{mod}(n, ${md}) + ${extra}` : `\\text{mod}(n, ${md})`;
  const table = (rows: Row[]) => `| \`n\` | \`mod(n,${md})\` | \`t\` |\n|---|---|---|\n${rows.map((x) => `| ${x.n} | ${x.r} | ${x.t} |`).join('\n')}`;
  const keyIdea = 'In a `while (true)` loop, keep one row per pass and test the `break` straight after `n` changes.';
  const trueLoop = simulate(start, step, md, extra, brk);

  if (rng.bool(0.15)) {
    // A version that never breaks: n moves away from the test, or jumps over an exact value.
    const skip = start % step !== 0 && rng.bool();
    const update = skip ? `   n = n - ${step}` : `   n = n + ${step}`;
    const test = skip ? 'n==0' : `n${brk}0`;
    const code = [`n = ${start}`, 't = 0', 'while (true)', modLine(md, extra), update, `   if ${test}`, '      break', '   end if', 'end while', 'print(t)'].join('\n');
    const shown: Row[] = [];
    let n = start;
    let t = 0;
    for (let i = 0; i < 4; i++) {
      const r = posMod(n, md);
      t += r + extra;
      shown.push({ n, r, t });
      n += skip ? -step : step;
    }
    const finish = simulate(start, step, md, extra, skip ? '<=' : brk);
    const lastRow = finish.rows[finish.rows.length - 1];
    const first = posMod(start, md) + extra;
    const pool: Cand[] = [
      {
        v: finish.t,
        why: skip
          ? `This stops as soon as \`n\` passes 0, as if the test were \`n<=0\`. The test is \`n==0\`, and \`n\` jumps straight past 0.`
          : `This reads \`n + ${step}\` as \`n - ${step}\`, so that \`n\` falls below 0. The code adds ${step}, so \`n\` keeps growing.`,
      },
      { v: first, why: 'This stops after the first pass, as if the `break` test were true straight away. It is false on every pass.' },
      {
        v: finish.t - lastRow.r - extra,
        why: 'This assumes the loop ends one pass before `n` crosses 0. The `break` test is never true, so the loop does not end at all.',
      },
      { v: 0, why: 'This is the starting value of `t`. The `print` line is never reached, so nothing is printed.' },
    ];
    const noTotal = 'This assumes the loop ends with a final total. The `break` test is never true, so there is no final total.';
    const ds = pickDistinct(-1, pool, [
      { v: finish.t + 1, why: noTotal },
      { v: finish.t + 2, why: noTotal },
      { v: finish.t + 3, why: noTotal },
    ]);
    const why = skip
      ? `\`n\` takes the values ${start}, ${start - step}, ${start - 2 * step}, and so on. ${start} is not a multiple of ${step}, so \`n\` is never exactly 0 and \`n==0\` is never true.`
      : `\`n\` starts positive and goes up by ${step} on every pass, so \`${test}\` is never true.`;
    return {
      stem: 'What is printed?',
      code: { lang: 'pseudocode', source: code },
      answer: INFINITE,
      answerValue: INFINITE,
      distractors: ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
      solution: `The first few passes, with \`n\` as it is at the start of each pass:\n\n${table(shown)}\n\n${why} The \`break\` never runs, so the loop never ends and \`print(t)\` is never reached.\n\nAnswer: ${INFINITE}`,
      keyIdea: 'Check which values the loop variable really takes: if it can never satisfy the `break` test, the loop never ends.',
    };
  }

  const code = [`n = ${start}`, 't = 0', 'while (true)', modLine(md, extra), `   n = n - ${step}`, `   if n${brk}0`, '      break', '   end if', 'end while', 'print(t)'].join('\n');
  const answer = trueLoop.t;
  const otherBrk: Brk = brk === '<' ? '<=' : '<';
  const wrongBreak = simulate(start, step, md, extra, otherBrk).t;
  const lastRow = trueLoop.rows[trueLoop.rows.length - 1];
  const numeric: Cand[] = [
    {
      v: wrongBreak,
      why:
        brk === '<'
          ? 'This breaks as soon as `n` reaches 0, as if the test were `n<=0`. With `n<0` the value 0 is not enough, so one more pass runs.'
          : 'This keeps going when `n` reaches 0, as if the test were `n<0`. With `n<=0` the loop breaks at 0.',
    },
    {
      v: answer + posMod(trueLoop.last, md) + extra,
      why: `This runs one extra pass with ${m(`n = ${trueLoop.last}`)}. The \`break\` is tested straight after \`n\` changes, so that pass never happens.`,
    },
    {
      v: answer - lastRow.r - extra,
      why: `This leaves out the last pass, with ${m(`n = ${lastRow.n}`)}. The \`break\` test only becomes true after that pass has added to \`t\`.`,
    },
    {
      v: posMod(start, md) + extra,
      why: 'This stops after the first pass, reading the `break` test backwards. It only becomes true once `n` has fallen far enough.',
    },
  ];
  const ds = pickDistinct(answer, numeric, [
    { v: answer + 1, why: 'This adds 1 too many: an off-by-one slip in the running total. Keep one row per pass and add each remainder once.' },
    { v: answer + 2, why: 'This adds 2 too many, usually from counting a pass twice. Keep one row per pass and add each remainder once.' },
    { v: answer + 3, why: 'This adds 3 too many, usually from a remainder worked out wrongly. Recheck each value of `mod(n,m)`.' },
  ]).slice(0, 2);
  return {
    stem: 'What is printed?',
    code: { lang: 'pseudocode', source: code },
    answer: String(answer),
    answerValue: answer,
    distractors: [
      ...ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
      { text: INFINITE, value: INFINITE, why: `\`n\` falls by ${step} on every pass, so \`n${brk}0\` eventually becomes true and the \`break\` runs.` },
    ],
    solution:
      `Each pass adds ${m(addTex)} to \`t\`, then lowers \`n\` by ${step}, then tests for the \`break\`. With \`n\` as it is at the start of each pass:\n\n` +
      `${table(trueLoop.rows)}\n\n` +
      `After the last row \`n\` becomes ${m(String(trueLoop.last))}, so \`n${brk}0\` is true and the loop breaks. It prints the value of \`t\`.\n\nAnswer: ${answer}`,
    keyIdea,
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-tracing-pseudocode-loop-count',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    title: 'Count the passes of a loop (or the final counter value)',
    generate: genLoopCount,
  },
  {
    id: 'gen-tracing-pseudocode-accumulator',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    title: 'Trace an accumulator with an if inside a loop',
    generate: genAccumulator,
  },
  {
    id: 'gen-pseudo-while-true-mod',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    title: 'Trace a while (true) loop with a mod accumulator',
    generate: genWhileTrueMod,
  },
];
