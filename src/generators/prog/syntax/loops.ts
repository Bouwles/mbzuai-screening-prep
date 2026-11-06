import type { Generator, GeneratedCore } from '../../../types';
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

function toCore(stem: string, source: string, answer: number | string, ds: Cand[], solution: string, keyIdea: string): GeneratedCore {
  return {
    stem,
    code: { lang: 'pseudocode', source },
    answer: show(answer),
    answerValue: answer,
    distractors: ds.map((d) => ({ text: show(d.value), value: d.value, why: d.why })),
    solution: `${solution}\n\nAnswer: ${show(answer)}`,
    keyIdea,
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

    let source: string;
    let intro: string;
    let extraWhy: string;
    let shortWhy: string;
    if (step === 1) {
      source = ['total = 0', `for i = ${start} to ${last}`, '   total = total + i', 'end for', 'print(total)'].join('\n');
      intro = `\`for i = ${start} to ${last}\` includes **both** ends, so \`i\` takes each whole number from ${start} to ${last}.`;
      extraWhy = `This adds one extra value, ${next}. The loop finishes after its end value ${last}.`;
      shortWhy = `This stops one value early and misses ${last}. The end value of a \`for\` loop is included.`;
    } else {
      const inclusive = rng.bool(0.5);
      const limit = inclusive ? rng.int(last, next - 1) : rng.int(last + 1, next);
      const op = inclusive ? '<=' : '<';
      source = ['total = 0', `i = ${start}`, `while (i ${op} ${limit})`, '   total = total + i', `   i = i + ${step}`, 'end while', 'print(total)'].join('\n');
      intro = `\`i\` starts at ${start} and goes up by ${step} on each pass. The loop runs while \`i ${op} ${limit}\`, so the first value to fail the check is ${next}.`;
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

    const solution =
      `${intro}\n\n` +
      `Values of \`i\`: ${vals.join(', ')}. That is ${k} passes.\n\n` +
      '`total` starts at 0 and each pass adds `i`:\n\n' +
      `$$${vals.join(' + ')} = ${total}$$\n\n` +
      'The `print` is after the loop, so it runs once.';
    return toCore(PRINTS, source, total, ds, solution, 'Check the first and last value of the counter; an accumulator then adds each value in turn.');
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
      const solution =
        `\`x\` takes the values ${start}, ${start + d}, ${start + 2 * d}, and so on, going up by ${d} each pass.\n\n` +
        `The values either side of ${limit} are ${lastBelow} and ${after}, so \`x\` jumps over ${limit} and never equals it.\n\n` +
        `The test \`x != ${limit}\` therefore stays true for ever.`;
      return toCore(stem, source, INFINITE, ds, solution, 'A `!=` stopping condition is dangerous: if the counter can jump over the target value, the loop never ends.');
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
    const opTex = op === '<' ? '<' : '\\le';
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

    const table =
      `| check $x ${opTex} ${limit}$ | new \`x\` | passes so far |\n|---|---|---|\n` +
      main.rows.map(([x, nx, c]) => `| $${x} ${opTex} ${limit}$ true | ${nx} | ${c} |`).join('\n') +
      `\n| $${finalX} ${opTex} ${limit}$ false: stop | | |`;
    const solution =
      `The condition is checked at the **top** of each pass, and each pass does \`${update}\`.\n\n` +
      `${table}\n\n` +
      `The loop body ran ${count} times.`;
    return toCore(stem, source, count, ds, solution, 'Count while-loop passes with a trace table: check, update, count, and stop at the first check that is false.');
  },
};

// ---------------------------------------------------------------- 3. nested-loop counting
type Inner = { src: (n: number, m: number) => string; len: (i: number, n: number, m: number) => number; desc: (n: number, m: number) => string };
const INNERS: Inner[] = [
  { src: (_n, m) => `for j = 1 to ${m}`, len: (_i, _n, m) => m, desc: (_n, m) => `runs ${m} times` },
  { src: () => 'for j = 1 to i', len: (i) => i, desc: () => 'runs $i$ times' },
  { src: () => 'for j = 1 to i - 1', len: (i) => i - 1, desc: () => 'runs $i - 1$ times' },
  { src: (n) => `for j = i to ${n}`, len: (i, n) => n - i + 1, desc: (n) => `runs $${n} - i + 1$ times` },
  { src: (n) => `for j = i + 1 to ${n}`, len: (i, n) => n - i, desc: (n) => `runs $${n} - i$ times` },
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

    const rows = lens.map((l, i) => `| ${i + 1} | ${l} |`).join('\n');
    const solution =
      `The outer loop gives $i = ${lens.map((_, i) => i + 1).join(', ')}$ (${n} passes). For each $i$ the inner loop \`${innerSrc}\` ${inner.desc(n, m)}, and every inner pass adds 1 to \`count\`.\n\n` +
      `| \`i\` | inner passes |\n|---|---|\n${rows}\n\n` +
      (typeIdx === 0 ? `Total: $${n} \\times ${m} = ${count}$.` : `Total${lens.includes(0) ? ' (a pass with 0 inner runs adds nothing)' : ''}: $${lens.filter((l) => l > 0).join(' + ')} = ${count}$.`);
    return toCore(PRINTS, source, count, ds, solution, 'For nested loops, add up the inner-loop length for every outer pass; it is a simple product only when the inner range does not depend on i.');
  },
};

export const generators: Generator[] = [rangeSum, whileCount, nestedCount];
