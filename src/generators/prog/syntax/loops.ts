import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

type Cand = { value: number; why: string };

const code = (v: number) => `\`${v}\``;

/** Up to 3 candidates that differ from the answer and from each other; tops up with guaranteed-different fallbacks. */
function pickDistinct(answer: number, pool: Cand[], fallback: (k: number) => Cand): Cand[] {
  const out: Cand[] = [];
  const ok = (v: number) => Number.isInteger(v) && v > 0 && v !== answer && !out.some((o) => o.value === v);
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

function toCore(
  stem: string,
  source: string,
  answer: number,
  ds: Cand[],
  solution: string,
  keyIdea: string,
): GeneratedCore {
  return {
    stem,
    code: { lang: 'python', source },
    answer: code(answer),
    answerValue: answer,
    distractors: ds.map((d) => ({ text: code(d.value), value: d.value, why: d.why })),
    solution: `${solution}\n\nAnswer: ${code(answer)}`,
    keyIdea,
    python: { stdout: `${answer}\n` },
  };
}

function rangeVals(start: number, stop: number, step: number): number[] {
  const out: number[] = [];
  for (let v = start; step > 0 ? v < stop : v > stop; v += step) out.push(v);
  return out;
}

// ---------------------------------------------------------------- 1. sum over a range with a step
const rangeSum: Generator = {
  id: 'gen-loops-range-sum',
  subtopic: 'loops',
  difficulty: 'exam',
  title: 'Accumulate a total over range(start, stop, step)',
  generate(rng: Rng) {
    const step = rng.pick([1, 2, 2, 3, 3, 4, 5]);
    const start = rng.int(0, 12);
    const k = step === 1 ? rng.int(4, 8) : rng.int(3, 7); // number of values produced
    const last = start + (k - 1) * step;
    // stop sits after the last value, up to and including the next value of the pattern
    const stop = rng.bool(0.5) ? last + step : last + rng.int(1, step);
    const vals = rangeVals(start, stop, step);
    const total = vals.reduce((s, v) => s + v, 0);
    const next = start + k * step;
    const rangeCall = step === 1 ? `range(${start}, ${stop})` : `range(${start}, ${stop}, ${step})`;
    const source = ['total = 0', `for i in ${rangeCall}:`, '    total = total + i', 'print(total)'].join('\n');

    const pool: Cand[] = [
      {
        value: total + next,
        why:
          stop === next
            ? `This also adds the stop value ${stop}, as if \`range\` included it. The stop is never included, so the last value is ${last}.`
            : `This adds one extra value, ${next}, as if the loop ran one more pass. ${next} is not less than ${stop}, so the loop ends after ${last}.`,
      },
      {
        value: total - start,
        why: `This leaves out the start value ${start}. \`range\` always includes its start, so ${start} is the first value added.`,
      },
      {
        value: rangeVals(start, stop, 1).reduce((s, v) => s + v, 0),
        why: `This ignores the step and adds every whole number from ${start} to ${stop - 1}. The step of ${step} means jump by ${step} each time.`,
      },
      {
        value: total - last,
        why: `This stops one value early and misses ${last}. ${last} is still less than ${stop}, so it is included.`,
      },
      {
        value: k,
        why: `This counts the passes of the loop (${k}) instead of adding up the values of \`i\`, as if the line were \`total = total + 1\`.`,
      },
    ];
    const ds = pickDistinct(total, pool, (j) => ({
      value: total + j * step + 1,
      why: `This comes from adding the values incorrectly. Listing them first (${vals.join(', ')}) and then adding avoids slips.`,
    }));

    const stepWords = step === 1 ? 'goes up by 1 each time' : `goes up by ${step} each time`;
    const solution =
      `\`${rangeCall}\` starts at ${start}, ${stepWords}, and stops **before** reaching ${stop} (the stop is never included).\n\n` +
      `Values of \`i\`: ${vals.join(', ')}. The next one would be ${next}, which is not less than ${stop}, so the loop ends after ${last}. That is ${k} passes.\n\n` +
      `\`total\` starts at 0 and each pass adds \`i\`:\n\n` +
      `$$${vals.join(' + ')} = ${total}$$\n\n` +
      `The \`print\` is after the loop, so it runs once.`;
    return toCore(
      'What does this Python code print?',
      source,
      total,
      ds,
      solution,
      '`range(start, stop, step)` includes start, jumps by step and excludes stop; an accumulator adds each value in turn.',
    );
  },
};

// ---------------------------------------------------------------- 2. counting while-loop passes
const whileCount: Generator = {
  id: 'gen-loops-while-count',
  subtopic: 'loops',
  difficulty: 'exam',
  title: 'Count the passes of a while loop',
  generate(rng: Rng) {
    const mult = rng.bool(0.4);
    const op = rng.pick(['<', '<='] as const);
    let start: number;
    let d: number;
    let limit: number;
    if (mult) {
      start = rng.int(1, 5);
      d = rng.pick([2, 2, 3]);
      const m = rng.int(3, d === 2 ? 7 : 5);
      const exact = start * d ** m;
      limit = rng.bool(0.4) ? exact : exact - rng.int(1, Math.max(1, Math.floor(exact / 3)));
    } else {
      start = rng.int(0, 15);
      d = rng.int(2, 9);
      const m = rng.int(3, 9);
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
    const source = [`x = ${start}`, 'count = 0', `while x ${op} ${limit}:`, `    ${update}`, '    count = count + 1', 'print(count)'].join('\n');
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
      {
        value: finalX,
        why: `This is the final value of \`x\`, not of \`count\`. The code prints \`count\`.`,
      },
      {
        value: count + 1,
        why: `This runs one pass too many. Once \`x\` becomes ${finalX}, the check \`${finalX} ${op} ${limit}\` is false and the loop stops.`,
      },
    ];
    const ds = pickDistinct(count, pool, (j) => ({
      value: count + 1 + j,
      why: `This miscounts the passes. A trace table (check, new \`x\`, \`count\`) shows exactly when the condition first fails.`,
    }));

    const table =
      `| check $x ${opTex} ${limit}$ | new \`x\` | \`count\` |\n|---|---|---|\n` +
      main.rows.map(([x, nx, c]) => `| $${x} ${opTex} ${limit}$ true | ${nx} | ${c} |`).join('\n') +
      `\n| $${finalX} ${opTex} ${limit}$ false: stop | | |`;
    const solution =
      `The condition is checked at the **top** of each pass; each pass does \`${update}\` and adds 1 to \`count\`.\n\n` +
      `${table}\n\n` +
      `The loop body ran ${count} times, so \`count\` is ${count}.`;
    return toCore(
      'What does this Python code print?',
      source,
      count,
      ds,
      solution,
      'Count while-loop passes with a trace table: check, update, count, and stop at the first check that is false.',
    );
  },
};

// ---------------------------------------------------------------- 3. nested-loop counting
type Inner = { src: (n: number, m: number) => string; len: (i: number, n: number, m: number) => number; desc: (n: number, m: number) => string };
const INNERS: Inner[] = [
  { src: (_n, m) => `range(${m})`, len: (_i, _n, m) => m, desc: (_n, m) => `runs ${m} times` },
  { src: () => 'range(i)', len: (i) => i, desc: () => 'runs $i$ times' },
  { src: () => 'range(i + 1)', len: (i) => i + 1, desc: () => 'runs $i + 1$ times' },
  { src: (n) => `range(i, ${n})`, len: (i, n) => n - i, desc: (n) => `runs $${n} - i$ times` },
  { src: (n) => `range(i + 1, ${n})`, len: (i, n) => n - i - 1, desc: (n) => `runs $${n} - i - 1$ times` },
];

const nestedCount: Generator = {
  id: 'gen-loops-nested-count',
  subtopic: 'loops',
  difficulty: 'challenge',
  title: 'Count how often a nested-loop body runs',
  generate(rng: Rng) {
    const typeIdx = rng.int(0, INNERS.length - 1);
    const inner = INNERS[typeIdx];
    // n >= 4 when the inner range depends on i: with n = 3 several mistakes give the same value
    const n = typeIdx === 0 ? rng.int(3, 10) : rng.int(4, 10);
    let m = rng.int(2, 9);
    if (typeIdx === 0 && m === n) m = n + 1;
    const innerSrc = inner.src(n, m);
    const source = ['count = 0', `for i in range(${n}):`, `    for j in ${innerSrc}:`, '        count = count + 1', 'print(count)'].join('\n');
    const lens = Array.from({ length: n }, (_, i) => inner.len(i, n, m));
    const count = lens.reduce((s, v) => s + v, 0);

    let pool: Cand[];
    if (typeIdx === 0) {
      pool = [
        { value: n + m, why: `This adds the two loop lengths (${n} + ${m}). The inner loop runs completely **for each** outer pass, so the counts multiply.` },
        { value: (n + 1) * (m + 1), why: `This includes the stop values, as if \`range(${n})\` ran ${n + 1} times and \`range(${m})\` ran ${m + 1} times. \`range(k)\` runs exactly $k$ times.` },
        { value: (n - 1) * (m - 1), why: `This assumes \`range(k)\` runs $k - 1$ times. It gives $0, 1, \\dots, k - 1$, which is $k$ values.` },
        { value: n, why: `This counts only the outer loop. The \`count\` line is inside the inner loop, so it runs ${m} times per outer pass.` },
      ];
    } else {
      const first = `Check the first pass: when $i = 0$ the inner loop \`${innerSrc}\` runs ${lens[0]} time${lens[0] === 1 ? '' : 's'}.`;
      // "one pass too short": each inner loop stops one value earlier, but a loop cannot run fewer than 0 times
      const shortCount = lens.reduce((s, l) => s + Math.max(0, l - 1), 0);
      const shortLost = count - shortCount;
      pool = [
        { value: n * n, why: `This multiplies ${n} by ${n}, as if the inner loop always ran ${n} times. Here the inner loop \`${innerSrc}\` changes length as \`i\` changes.` },
        {
          value: shortCount,
          why: `This makes the inner loop one pass too short on every outer pass where it runs at all (as if it stopped one value earlier), losing ${shortLost} in total. ${first}`,
        },
        {
          value: count + n,
          why: `This makes the inner loop one pass too long on every outer pass, as if the stop of the inner \`range\` were included, adding ${n} too many. ${first}`,
        },
        { value: n, why: `This counts only the outer loop passes. The \`count\` line is inside the inner loop, so it runs once per **inner** pass.` },
        { value: n * Math.max(...lens), why: `This multiplies the ${n} outer passes by the longest inner loop (${Math.max(...lens)} passes). The inner loop \`${innerSrc}\` is shorter on some passes, so add the lengths one by one.` },
      ];
    }
    const ds = pickDistinct(count, pool, (j) => ({
      value: count + j * n,
      why: 'This miscounts the inner loop. Make a table of each value of `i` and how many times the inner loop runs, then add.',
    }));

    const rows = lens.map((l, i) => `| ${i} | ${l} |`).join('\n');
    const solution =
      `The outer loop \`range(${n})\` gives $i = ${lens.map((_, i) => i).join(', ')}$ (${n} passes). For each $i$ the inner loop \`${innerSrc}\` ${inner.desc(n, m)}, and every inner pass adds 1 to \`count\`.\n\n` +
      `| \`i\` | inner passes |\n|---|---|\n${rows}\n\n` +
      (typeIdx === 0 ? `Total: $${n} \\times ${m} = ${count}$.` : `Total${lens.includes(0) ? ' (passes with 0 inner runs add nothing)' : ''}: $${lens.filter((l) => l > 0).join(' + ')} = ${count}$.`);
    return toCore(
      'What does this Python code print?',
      source,
      count,
      ds,
      solution,
      'For nested loops, add up the inner-loop length for every outer pass; it is a simple product only when the inner range does not depend on i.',
    );
  },
};

export const generators: Generator[] = [rangeSum, whileCount, nestedCount];
