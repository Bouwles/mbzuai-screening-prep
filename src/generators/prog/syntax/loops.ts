import type { Generator, GeneratedCore } from '../../../types';
import { steps, table } from '../../../lib/explanation';
import type { Rng } from '../../../lib/rng';

type Cand = { value: number | string; why: string };

const INFINITE = 'Infinite loop';
const PRINTS = 'What does this pseudocode print?';
const BODY_RUNS = 'How many times does the loop body run?';

const show = (v: number | string) => (typeof v === 'string' ? v : `\`${v}\``);

/** Up to 3 candidates that differ from the answer and from each other; tops up with guaranteed-different fallbacks. */
function pickDistinct(answer: number | string, pool: Cand[], fallback: (k: number) => Cand): Cand[] {
  const out: Cand[] = [];
  const ok = (v: number | string) => (typeof v === 'string' || (Number.isInteger(v) && v > 0)) && v !== answer && !out.some((o) => o.value === v);
  for (const c of pool) {
    if (out.length === 3) break;
    if (ok(c.value)) out.push(c);
  }
  for (let k = 1; out.length < 3 && k < 100; k++) {
    const c = fallback(k);
    if (ok(c.value)) out.push(c);
  }
  return out;
}

/** The explanation of one question, built from its own numbers. */
type Why = { asking: string; solution: string; conclusion: string; keyIdea: string };

function toCore(stem: string, source: string, answer: number | string, ds: Cand[], why: Why): GeneratedCore {
  return {
    stem,
    code: { lang: 'pseudocode', source },
    answer: show(answer),
    answerValue: answer,
    distractors: ds.map((d) => ({ text: show(d.value), value: d.value, why: d.why })),
    ...why,
  };
}

// ---------------------------------------------------------------- 1. sum over a counting loop
const rangeSum: Generator = {
  id: 'gen-loops-range-sum',
  subtopic: 'loops',
  difficulty: 'exam',
  title: 'Accumulate a total over a counting loop',
  generate(rng: Rng) {
    const step = rng.pick([1, 1, 2, 3, 4, 5]);
    const start = rng.int(1, 12);
    const k = step === 1 ? rng.int(4, 8) : rng.int(3, 7); // number of values produced
    const vals = Array.from({ length: k }, (_, i) => start + i * step);
    const last = vals[k - 1];
    const next = last + step;
    const total = vals.reduce((s, v) => s + v, 0);

    // total after each value of i
    let sofar = 0;
    const running = vals.map((v) => {
      const row = `$${sofar} + ${v} = ${sofar + v}$`;
      sofar += v;
      return row;
    });

    let source: string;
    let trace: string[];
    let extraWhy: string;
    let shortWhy: string;
    if (step === 1) {
      source = ['total = 0', `for i = ${start} to ${last}`, '   total = total + i', 'end for', 'print(total)'].join('\n');
      trace = [
        `\`for i = ${start} to ${last}\` gives \`i\` each whole number from ${start} to ${last}. Both ends are included, so that is ${k} passes.`,
        '`total` starts at 0, and line 3 adds the current `i` on each pass:',
        table(['`i`', '`total` becomes'], vals.map((v, j) => [v, running[j]])),
        `Line 5 prints \`total\`, which is ${total}.`,
      ];
      extraWhy = `This adds one extra value, ${next}. The loop finishes after its end value ${last}.`;
      shortWhy = `This stops one value early and misses ${last}. The end value of a \`for\` loop is included.`;
    } else {
      const inclusive = rng.bool(0.5);
      const limit = inclusive ? rng.int(last, next - 1) : rng.int(last + 1, next);
      const op = inclusive ? '<=' : '<';
      source = ['total = 0', `i = ${start}`, `while (i ${op} ${limit})`, '   total = total + i', `   i = i + ${step}`, 'end while', 'print(total)'].join('\n');
      trace = [
        `\`i\` starts at ${start}. The check \`i ${op} ${limit}\` is at the top of each pass. If it is true, the body adds \`i\` to \`total\` and then raises \`i\` by ${step}.`,
        'Trace every check, with `total` starting at 0:',
        table(['`i` at the check', `\`i ${op} ${limit}\`?`, '`total` becomes'], [...vals.map((v, j) => [v, 'yes', running[j]]), [next, 'no, stop', '']]),
        `Line 7 prints \`total\`, which is ${total}.`,
      ];
      extraWhy = `This adds one extra value, ${next}. The check \`${next} ${op} ${limit}\` is false, so the loop ends after ${last}.`;
      shortWhy = `This stops one value early and misses ${last}. The check \`${last} ${op} ${limit}\` is still true, so it is included.`;
    }

    const pool: Cand[] = [
      ...(rng.bool(0.4) ? [{ value: INFINITE, why: '`i` goes up on every pass and the loop has a fixed end, so it does stop.' }] : []),
      { value: total + next, why: extraWhy },
      { value: total - start, why: `This leaves out the start value ${start}, which is the first value added.` },
      { value: total - last, why: shortWhy },
      ...(step > 1
        ? [
            {
              value: Array.from({ length: last - start + 1 }, (_, i) => start + i).reduce((s, v) => s + v, 0),
              why: `This adds every whole number from ${start} to ${last}. \`i\` jumps by ${step} each time.`,
            },
          ]
        : []),
      { value: k, why: `This counts the passes of the loop (${k}) instead of adding up the values of \`i\`, as if the line were \`total = total + 1\`.` },
    ];
    const ds = pickDistinct(total, pool, (j) => ({
      value: total + j * step + 1,
      why: `This comes from adding the values incorrectly. Listing them first (${vals.join(', ')}) and then adding avoids slips.`,
    }));

    return toCore(PRINTS, source, total, ds, {
      asking: 'What does `total` hold after adding up every value of `i`?',
      solution: steps(...trace),
      conclusion: `The values of \`i\` add up as $${vals.join(' + ')} = ${total}$, so the answer is ${show(total)}.`,
      keyIdea: 'For `total = total + i`, write out every value of `i` first: the first, the step, and the last one the loop allows. Then keep a running total with one row per value.',
    });
  },
};

// ---------------------------------------------------------------- 2. counting while-loop passes
const whileCount: Generator = {
  id: 'gen-loops-while-count',
  subtopic: 'loops',
  difficulty: 'exam',
  title: 'Count the passes of a while loop',
  generate(rng: Rng) {
    const askPasses = rng.bool(0.5);
    let start = 0;
    const build = (cond: string, update: string) =>
      askPasses
        ? [`x = ${start}`, `while (${cond})`, `   ${update}`, 'end while'].join('\n')
        : [`x = ${start}`, 'count = 0', `while (${cond})`, `   ${update}`, '   count = count + 1', 'end while', 'print(count)'].join('\n');
    const stem = askPasses ? BODY_RUNS : PRINTS;
    const mult = rng.bool(0.4);

    // About 15% of the time the counter jumps over the value in a != test, so the loop never stops.
    if (!mult && rng.bool(0.15)) {
      start = rng.int(0, 15);
      const d = rng.int(2, 9);
      const m = rng.int(3, 7);
      const limit = start + d * m + rng.int(1, d - 1);
      const lastBelow = start + d * m;
      const after = lastBelow + d;
      const source = build(`x != ${limit}`, `x = x + ${d}`);
      const ds = pickDistinct(
        INFINITE,
        [
          { value: m + 1, why: `This treats \`!=\` as \`<\`, stopping once \`x\` passes ${limit}. The test is \`x != ${limit}\`, and \`${after} != ${limit}\` is still true.` },
          { value: m, why: `This stops at ${lastBelow}, the last value below ${limit}. Even there the test \`x != ${limit}\` is true.` },
          { value: after, why: `This is the first value of \`x\` above ${limit}. Nothing stops the loop there.` },
        ],
        (j) => ({ value: m + 1 + j, why: `\`x\` never equals ${limit}, so no number of passes makes the test false.` }),
      );
      return toCore(stem, source, INFINITE, ds, {
        asking: `Does adding ${d} again and again to ${start} ever land exactly on ${limit}?`,
        solution: steps(
          `The loop stops only when \`x != ${limit}\` is false, which needs \`x\` to be exactly ${limit}.`,
          `\`x\` starts at ${start} and goes up by ${d} on each pass: ${start}, ${start + d}, ${start + 2 * d}, and so on.`,
          `Look at the values around ${limit}. \`x\` reaches ${lastBelow}, and the next value is $${lastBelow} + ${d} = ${after}$. So it jumps straight over ${limit}.`,
          `After that \`x\` only grows, so it never equals ${limit}. The test stays true every time, and the loop never ends.`,
        ),
        conclusion: `\`x\` never lands on ${limit}, so the condition can never become false. The answer is: ${INFINITE}.`,
        keyIdea: 'A `!=` stopping test is risky. Write down the values the variable takes and see whether it lands exactly on the target. If it jumps over, the loop never ends.',
      });
    }

    const op = rng.pick(['<', '<='] as const);
    let d: number;
    let limit: number;
    if (mult) {
      start = rng.int(1, 5);
      d = rng.pick([2, 2, 3]);
      const m = rng.int(3, d === 2 ? 6 : 4);
      const exact = start * d ** m;
      limit = rng.bool(0.4) ? exact : exact - rng.int(1, Math.max(1, Math.floor(exact / 3)));
    } else {
      start = rng.int(0, 15);
      d = rng.int(2, 9);
      const m = rng.int(3, 7);
      limit = start + d * m - (rng.bool(0.4) ? 0 : rng.int(1, d - 1));
    }
    const holds = (x: number, o: '<' | '<=') => (o === '<' ? x < limit : x <= limit);
    const step = (x: number) => (mult ? x * d : x + d);
    const run = (o: '<' | '<=') => {
      let x = start;
      let c = 0;
      const rows: [number, number, number][] = [];
      while (holds(x, o) && c < 100) {
        const nx = step(x);
        c++;
        rows.push([x, nx, c]);
        x = nx;
      }
      return { x, c, rows };
    };
    const main = run(op);
    const other = run(op === '<' ? '<=' : '<');
    const count = main.c;
    const finalX = main.x;
    const otherOp = op === '<' ? '<=' : '<';
    const update = mult ? `x = x * ${d}` : `x = x + ${d}`;
    const source = build(`x ${op} ${limit}`, update);
    const lastX = main.rows[main.rows.length - 1][0];

    const pool: Cand[] = [
      {
        value: other.c,
        why: `This reads the condition as \`x ${otherOp} ${limit}\` instead of \`x ${op} ${limit}\`. The difference matters when \`x\` lands exactly on ${limit}.`,
      },
      {
        value: count - 1,
        why: `This stops one pass early. When \`x\` is ${lastX} the check \`${lastX} ${op} ${limit}\` is still true, so the loop runs once more.`,
      },
      ...(rng.bool(0.5) ? [{ value: INFINITE, why: `\`x\` grows on every pass, so the check \`x ${op} ${limit}\` eventually fails and the loop stops.` }] : []),
      {
        value: finalX,
        why: `This is the final value of \`x\`, not the number of passes.`,
      },
      {
        value: count + 1,
        why: `This runs one pass too many. Once \`x\` becomes ${finalX}, the check \`${finalX} ${op} ${limit}\` is false and the loop stops.`,
      },
    ];
    const ds = pickDistinct(count, pool, (j) => ({
      value: count + 1 + j,
      why: 'This miscounts the passes. A trace table (check, new `x`, pass number) shows exactly when the condition first fails.',
    }));

    return toCore(stem, source, count, ds, {
      asking: mult ? `How many times is \`x\` multiplied by ${d} before \`x ${op} ${limit}\` fails?` : `How many times is ${d} added to \`x\` before \`x ${op} ${limit}\` fails?`,
      solution: steps(
        `The check \`x ${op} ${limit}\` is at the top of the loop. If it is true, the body runs and then it checks again. The loop stops at the first false check. \`${op}\` means a value equal to ${limit} ${op === '<=' ? 'still passes' : 'does not pass'}.`,
        askPasses ? `Each pass does \`${update}\`:` : `Each pass does \`${update}\`, then adds 1 to \`count\`:`,
        table(['Pass', '`x` at the check', `\`x ${op} ${limit}\`?`, '`x` becomes'], [...main.rows.map(([x, nx, c]) => [c, x, 'yes', nx]), ['', finalX, 'no, stop', '']]),
        askPasses ? `The check was true ${count} times, so the body ran ${count} times.` : `Line 7 prints \`count\`, which is ${count}.`,
      ),
      conclusion: `The loop stops at the first failed check, when \`x\` is ${finalX}, after ${count} passes. So the answer is ${show(count)}.`,
      keyIdea: 'Count `while` passes with a table: one row per check. Write the value, test it, then run the body. The count is the number of rows where the check is true, so the row that fails is not a pass.',
    });
  },
};

// ---------------------------------------------------------------- 3. nested-loop counting
type Inner = { src: (n: number, m: number) => string; len: (i: number, n: number, m: number) => number; range: (i: number, n: number, m: number) => [number, number] };
const INNERS: Inner[] = [
  { src: (_n, m) => `for j = 1 to ${m}`, len: (_i, _n, m) => m, range: (_i, _n, m) => [1, m] },
  { src: () => 'for j = 1 to i', len: (i) => i, range: (i) => [1, i] },
  { src: () => 'for j = 1 to i - 1', len: (i) => i - 1, range: (i) => [1, i - 1] },
  { src: (n) => `for j = i to ${n}`, len: (i, n) => n - i + 1, range: (i, n) => [i, n] },
  { src: (n) => `for j = i + 1 to ${n}`, len: (i, n) => n - i, range: (i, n) => [i + 1, n] },
];

const nestedCount: Generator = {
  id: 'gen-loops-nested-count',
  subtopic: 'loops',
  difficulty: 'exam',
  title: 'Count how often a nested-loop body runs',
  generate(rng: Rng) {
    const typeIdx = rng.int(0, INNERS.length - 1);
    const inner = INNERS[typeIdx];
    // n >= 4 when the inner range depends on i: with n = 3 several mistakes give the same value
    const n = typeIdx === 0 ? rng.int(3, 8) : rng.int(4, 8);
    let m = rng.int(2, 9);
    if (typeIdx === 0 && m === n) m = n + 1;
    const innerSrc = inner.src(n, m);
    const source = ['count = 0', `for i = 1 to ${n}`, `   ${innerSrc}`, '      count = count + 1', '   end for', 'end for', 'print(count)'].join('\n');
    const lens = Array.from({ length: n }, (_, i) => inner.len(i + 1, n, m));
    const count = lens.reduce((s, v) => s + v, 0);

    let pool: Cand[];
    if (typeIdx === 0) {
      pool = [
        { value: n + m, why: `This adds the two loop lengths (${n} + ${m}). The inner loop runs completely **for each** outer pass, so the counts multiply.` },
        { value: (n + 1) * (m + 1), why: `This adds one pass to each loop. \`for i = 1 to ${n}\` runs exactly ${n} times and \`for j = 1 to ${m}\` runs exactly ${m} times.` },
        { value: (n - 1) * (m - 1), why: `This removes one pass from each loop, as if the end values were excluded. Both ends of a \`for\` range are included.` },
        { value: n, why: `This counts only the outer loop. The \`count\` line is inside the inner loop, so it runs ${m} times per outer pass.` },
      ];
    } else {
      const first = `Check the first pass: when $i = 1$ the inner loop \`${innerSrc}\` runs ${lens[0]} time${lens[0] === 1 ? '' : 's'}.`;
      // "one pass too short": each inner loop stops one value earlier, but a loop cannot run fewer than 0 times
      const shortCount = lens.reduce((s, l) => s + Math.max(0, l - 1), 0);
      const shortLost = count - shortCount;
      pool = [
        { value: n * n, why: `This multiplies ${n} by ${n}, as if the inner loop always ran ${n} times. Here the inner loop \`${innerSrc}\` changes length as \`i\` changes.` },
        {
          value: shortCount,
          why: `This makes the inner loop one pass too short on every outer pass where it runs at all, losing ${shortLost} in total. ${first}`,
        },
        {
          value: count + n,
          why: `This makes the inner loop one pass too long on every outer pass, adding ${n} too many. ${first}`,
        },
        { value: n, why: 'This counts only the outer loop passes. The `count` line is inside the inner loop, so it runs once per **inner** pass.' },
        { value: n * Math.max(...lens), why: `This multiplies the ${n} outer passes by the longest inner loop (${Math.max(...lens)} passes). The inner loop \`${innerSrc}\` is shorter on some passes, so add the lengths one by one.` },
      ];
    }
    const ds = pickDistinct(count, pool, (j) => ({
      value: count + j * n,
      why: 'This miscounts the inner loop. Make a table of each value of `i` and how many times the inner loop runs, then add.',
    }));

    const shownRange = (i: number) => {
      const [from, to] = inner.range(i, n, m);
      return to < from ? 'none' : from === to ? String(from) : `${from} to ${to}`;
    };
    const work =
      typeIdx === 0
        ? [
            `The outer loop, \`for i = 1 to ${n}\`, makes ${n} passes. Both ends are included.`,
            `The inner loop, \`${innerSrc}\`, does not use \`i\`, so it runs ${m} times on every outer pass.`,
            `Multiply the two: $${n} \\times ${m} = ${count}$.`,
          ]
        : [
            `The inner loop, \`${innerSrc}\`, uses \`i\`, so its length changes on each outer pass. Both ends of a \`for\` range are included.${lens.includes(0) ? ' A range whose start is bigger than its end does not run at all.' : ''}`,
            'Count the inner passes for each value of `i`:',
            table(['`i`', 'Values of `j`', 'Inner passes'], lens.map((l, i) => [i + 1, shownRange(i + 1), l])),
            `Add the last column: $${lens.filter((l) => l > 0).join(' + ')} = ${count}$.`,
          ];
    return toCore(PRINTS, source, count, ds, {
      asking: 'How many times does the line `count = count + 1` run in total?',
      solution: steps('`count = count + 1` is inside both loops, so it runs once for every pass of the inner loop.', ...work),
      conclusion:
        typeIdx === 0
          ? `${n} outer passes times ${m} inner passes gives ${count}, so the answer is ${show(count)}.`
          : `The inner passes add up to ${count}, and \`count\` goes up once per inner pass, so the answer is ${show(count)}.`,
      keyIdea: 'For nested loops, make a table with one row per outer value and write how many times the inner loop runs, using end $-$ start $+ 1$. Add the column. Multiply only when the inner length never changes.',
    });
  },
};

export const generators: Generator[] = [rangeSum, whileCount, nestedCount];
