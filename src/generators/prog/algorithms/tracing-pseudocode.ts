import type { GeneratedCore, Generator } from '../../../types';
import { steps, table } from '../../../lib/explanation';
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

  const lastVal = vals[vals.length - 1];
  const next = up ? lastVal + s : lastVal - s;

  // One row per check, as the loop runs it: the last check is the one that fails.
  const value = (v: number) => (v < 0 ? m(String(v)) : String(v));
  const trace = [
    ...vals.map((v, j) => [j + 1, value(v), 'yes', value(up ? v + s : v - s)]),
    ['', value(after), 'no, stop', ''],
  ];
  const work =
    form === 'for'
      ? [
          `\`for i = ${a} to ${b}\` starts \`i\` at ${a}, goes up by 1 and includes ${b}. The line \`print(i)\` runs once for each value.`,
          `So \`i\` takes these values, one at a time: ${listVals(vals)}.`,
          `Counting them gives ${count}. The rule end $-$ start $+ 1$ agrees: ${m(`${b} - ${a} + 1 = ${count}`)}.`,
        ]
      : [
          `\`i\` starts at ${up ? a : b}. The check \`${opWord}\` is at the top of each pass. If it is true, the body prints \`i\`, and then line 4 ${up ? `adds ${s} to \`i\`` : `takes ${s} off \`i\``}.`,
          'Trace every check:',
          table(['Pass', '`i` at the check', `\`${opWord}\`?`, '`i` becomes'], trace),
          ask === 'count' ? `The check was true ${count} times, so \`print(i)\` ran ${count} times.` : `\`i\` is now ${value(after)}, and nothing changes it after the loop.`,
        ];

  let answerV: number;
  let pool: Cand[];
  let fallbacks: Cand[];
  let keyIdea: string;
  if (ask === 'count') {
    answerV = count;
    const span = b - a;
    keyIdea =
      form === 'for'
        ? 'For `for i = a to b`, passes = end $-$ start $+ 1$, because both ends are included. A plain subtraction counts the gaps between values and comes out one too small.'
        : `To count passes without a table, divide the distance between the start and the limit by the step. With a strict test (\`<\` or \`>\`), round up. With \`<=\`, round down and add 1. Here the distance is ${span} and the step is ${s}.`;
    pool = [];
    if (strict) {
      pool.push({
        v: Math.floor(span / s) + 1,
        why: `This treats the strict test \`${opWord}\` as if it included ${m(String(up ? b : a))}, so it counts one pass for the boundary value as well.`,
      });
      pool.push({
        v: Math.floor(span / s),
        why: `This divides ${m(`${span} \\div ${s}`)} and rounds down. There is a part-step left over, and \`${opWord}\` is still true after the last whole step, so the body runs once more.`,
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
    keyIdea = 'After a `while` loop ends, the counter holds the first value that made the check fail, not the last value used inside the loop. Trace until a check fails and read off that value.';
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
  return {
    stem,
    code: { lang: 'pseudocode' as const, source: code },
    answer,
    answerValue: answerV,
    distractors: ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
    asking: ask === 'count' ? 'How many values does `i` take while the loop is running?' : "Which value of `i` first makes the loop's check fail?",
    solution: steps(...work),
    conclusion:
      ask === 'count'
        ? `The body runs once for each value of \`i\`, which is ${count} values, so the answer is ${answer}.`
        : `The loop stops as soon as the check fails, with \`i\` at ${value(after)}, so the answer is ${answer}.`,
    keyIdea,
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
  let sofar = 0;
  const rows = chosen.map((c) => {
    const row = [c, `$${sofar} + ${c} = ${sofar + c}$`];
    sofar += c;
    return row;
  });
  const whichPass = eq
    ? chosen.length === 1
      ? `From 1 to ${n}, only ${chosen[0]} passes the test:`
      : `From 1 to ${n}, the values that pass are ${chosen.join(', ')}. Keep a running total:`
    : `From 1 to ${n}, skip ${other.join(', ')}. Add the remaining values, keeping a running total:`;
  return {
    stem,
    code: { lang: 'pseudocode' as const, source: code },
    answer,
    answerValue: S,
    distractors: ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
    asking: eq ? `What do the multiples of ${k} from 1 to ${n} add up to?` : `What do the numbers from 1 to ${n} add up to, if you leave out the multiples of ${k}?`,
    solution: steps(
      `\`mod(i,${k})\` is the remainder after dividing \`i\` by ${k}. For example, \`mod(${k + 1},${k})\` is 1 and \`mod(${2 * k},${k})\` is 0. A remainder of 0 means \`i\` is a multiple of ${k}.`,
      `${eq ? '' : '`!=` means "not equal". '}So the test on line 3 is true when \`i\` is ${condWords}. Only then does line 4 add \`i\` to \`${v}\`, which starts at 0.`,
      whichPass,
      table(['`i`', `\`${v}\` becomes`], rows),
      `Line 7 prints \`${v}\`, which is ${S}.`,
    ),
    conclusion: chosen.length === 1 ? `Only ${chosen[0]} passes the test, so it is the only value added and the answer is ${answer}.` : `The values that pass add up to ${S}, so the answer is ${answer}.`,
    keyIdea: 'An `if` with `mod` inside a loop filters the numbers. List the values that pass, then add them with a running total. For "all except the multiples", you can also add 1 to $n$ with $\\frac{n(n + 1)}{2}$ and subtract the left-out values.',
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
  const trueLoop = simulate(start, step, md, extra, brk);

  if (rng.bool(0.15)) {
    // A version that never breaks: n moves away from the test, or jumps over an exact value.
    const skip = start % step !== 0 && rng.bool();
    const update = skip ? `   n = n - ${step}` : `   n = n + ${step}`;
    const test = skip ? 'n==0' : `n${brk}0`;
    const code = [`n = ${start}`, 't = 0', 'while (true)', modLine(md, extra), update, `   if ${test}`, '      break', '   end if', 'end while', 'print(t)'].join('\n');
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
    const closest = start % step; // the last value of n above 0 when it falls past 0
    return {
      stem: 'What is printed?',
      code: { lang: 'pseudocode', source: code },
      answer: INFINITE,
      answerValue: INFINITE,
      distractors: ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why })),
      asking: skip ? 'Does `n` ever equal exactly 0, so that the `break` can run?' : `Can \`${test}\` ever be true when \`n\` keeps growing?`,
      solution: steps(
        `\`while (true)\` never stops by itself. The only way out is the \`break\` on line 7, which needs \`${test}\` to be true.`,
        'Line 4 only changes `t`, so it has no effect on stopping. Only line 5 changes `n`.',
        skip
          ? `\`n\` starts at ${start} and falls by ${step} on each pass: ${m(`${start - step}, ${start - 2 * step}, ${start - 3 * step}`)}, and so on.`
          : `\`n\` starts at ${start} and goes up by ${step} on each pass: ${m(`${start + step}, ${start + 2 * step}, ${start + 3 * step}`)}, and so on.`,
        skip
          ? `${start} is not a multiple of ${step}, so \`n\` never lands on 0. The last value above 0 is ${closest}, and the next is ${m(String(closest - step))}, which jumps straight over 0.`
          : `\`n\` starts positive and only gets bigger, so \`${test}\` is false every time.`,
        'So `break` never runs, and `print(t)` on line 10 is never reached.',
      ),
      conclusion: `The \`break\` test can never be true, so the loop has no way out. The answer is: ${INFINITE}.`,
      keyIdea: 'Write down the values the loop variable really takes and compare them with the `break` test. If it moves away from the test, or jumps over an exact value, the `break` never runs and the loop never ends.',
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
    asking: `What total is in \`t\` by the time \`n\` is ${brk === '<' ? 'below 0' : '0 or below'}?`,
    solution: steps(
      `\`mod(n,${md})\` is the remainder after dividing \`n\` by ${md}. For example, ${
        posMod(start, md) === 0
          ? `${md} goes into ${start} exactly ${start / md} times, so \`mod(${start},${md})\` is 0.`
          : `${m(`${start} = ${Math.floor(start / md)} \\times ${md} + ${posMod(start, md)}`)}, so \`mod(${start},${md})\` is ${posMod(start, md)}.`
      }`,
      `\`while (true)\` only ends through the \`break\` on line 7, which runs once \`n\` is ${brk === '<' ? 'below 0' : '0 or below'}. Each pass adds ${extra ? `the remainder plus ${extra}` : 'the remainder'} to \`t\`, takes ${step} off \`n\`, then tests \`n\`.`,
      'Trace it:',
      table(
        ['Pass', '`n` at start', `\`mod(n,${md})\``, '`t` becomes', '`n` becomes', `\`n${brk}0\`?`],
        trueLoop.rows.map((x, i) => {
          const after = x.n - step;
          return [i + 1, x.n, x.r, x.t, after < 0 ? m(String(after)) : after, i === trueLoop.rows.length - 1 ? 'yes' : 'no'];
        }),
      ),
      '`break` jumps to line 10, which prints `t`.',
    ),
    conclusion: `The loop breaks after pass ${trueLoop.rows.length} with \`t\` at ${answer}, so the answer is ${answer}.`,
    keyIdea: 'For a `while (true)` loop, draw one row per pass with a column for each variable. Update them in the order of the code, and test the `break` straight after `n` changes. The value that triggers `break` never starts a row of its own.',
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
