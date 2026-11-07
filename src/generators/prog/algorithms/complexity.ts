import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';
import { m, num } from '../../../lib/tex';

type NumCand = { v: number; why: string };

/** Keep 3 candidates that differ from the answer and from each other; fallbacks guarantee 3. */
function pickNums(answer: number, pool: NumCand[], fallbacks: NumCand[]): NumCand[] {
  const out: NumCand[] = [];
  for (const d of [...pool, ...fallbacks]) {
    if (out.length === 3) break;
    if (!Number.isFinite(d.v) || d.v < 0 || d.v === answer || out.some((x) => x.v === d.v)) continue;
    out.push(d);
  }
  if (out.length < 3) throw new Error('not enough distinct distractors');
  return out;
}

/** 1234567 -> "1,234,567" (plain text). */
function commas(x: number): string {
  return num(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
/** 1234567 -> "1\,234\,567" (LaTeX thin spaces). */
function texBig(x: number): string {
  return num(x).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
}

// ---------------------------------------------------------------- loop counting
interface LoopCase {
  code: string;
  count: number;
  pool: NumCand[];
  /** When set, "Infinite loop" replaces the last distractor, with this explanation. */
  infiniteWhy?: string;
  asking: string;
  steps: string;
  conclusion: string;
  idea: string;
}

function halvingTrace(start: number, stopAbove: number): number[] {
  const vals = [start];
  let n = start;
  while (n > stopAbove) {
    n = Math.floor(n / 2);
    vals.push(n);
  }
  return vals;
}

function loopCase(rng: Rng): LoopCase {
  const kind = rng.pick(['rect', 'tri', 'halve', 'double', 'outerHalve'] as const);
  if (kind === 'rect') {
    const A = rng.int(4, 12);
    const B = rng.int(3, 12);
    const count = (A - 1) * B;
    return {
      code: `count = 0\nfor i = 2 to ${A}\n   for j = 1 to ${B}\n      count = count + 1\n   end for\nend for\nprint(count)`,
      count,
      pool: [
        { v: A * B, why: `This assumes \`for i = 2 to ${A}\` runs ${A} times. It starts at 2, so it gives ${A - 1} values.` },
        { v: A - 1 + B, why: `This adds the two loop sizes (${m(`${A - 1} + ${B}`)}). Nested loops **multiply**: the inner loop runs completely for every pass of the outer loop.` },
        { v: (A - 2) * B, why: `This stops the outer loop before ${A}. Both ends of \`for i = 2 to ${A}\` are included, so it runs ${A - 1} times.` },
        { v: (A - 1) * (B - 1), why: `This assumes \`for j = 1 to ${B}\` runs ${B - 1} times. Both ends are included, so it runs ${B} times.` },
      ],
      asking: 'How many times does the line `count = count + 1` run in total?',
      steps: steps(
        '`count` goes up by 1 each time line 4 runs, so we need to know how many times line 4 runs.',
        `The outer loop \`for i = 2 to ${A}\` includes both ends. Its number of passes is end minus start plus 1: ${m(`${A} - 2 + 1 = ${A - 1}`)}.`,
        `The inner loop \`for j = 1 to ${B}\` runs all the way through on every outer pass. Each time it makes ${m(`${B} - 1 + 1 = ${B}`)} runs.`,
        `So line 4 runs ${B} times on each of the ${A - 1} outer passes. One loop is inside the other, so the counts multiply: ${m(`${A - 1} \\times ${B} = ${count}`)}. Line 7 prints this value.`,
      ),
      conclusion: `${A - 1} outer passes with ${B} inner runs each make ${count} runs of line 4, so the answer is ${count}.`,
      idea: 'Nested loops multiply: outer passes times inner runs per pass. A loop `for i = a to b` has $b - a + 1$ passes. Two nested loops of size $n$ make $n \\times n$ runs, so the work grows like $n^2$, written $O(n^2)$.',
    };
  }
  if (kind === 'tri') {
    const N = rng.int(5, 16);
    const fromI = rng.bool();
    const count = fromI ? (N * (N + 1)) / 2 : (N * (N - 1)) / 2;
    const start = fromI ? 'i' : 'i + 1';
    const inner = `for j = ${start} to ${N}`;
    const pool: NumCand[] = fromI
      ? [
          { v: N * N, why: `This assumes the inner loop always runs ${N} times. It starts at \`j = i\`, so it gets shorter as $i$ grows.` },
          { v: (N * (N - 1)) / 2, why: `This is $\\frac{${N} \\times ${N - 1}}{2}$, which counts the inner loop as ${m(`${N - 1}, ${N - 2}, \\dots, 0`)} runs. For $i = 1$ it actually runs ${N} times, so the runs are ${m(`${N}, ${N - 1}, \\dots, 1`)}.` },
          { v: N, why: 'This counts only the outer loop. The counted line is inside the inner loop, which runs several times per outer pass.' },
          { v: N * (N + 1), why: `This forgets to divide by 2 in $\\frac{n(n+1)}{2}$.` },
        ]
      : [
          { v: N * N, why: `This assumes the inner loop always runs ${N} times. It starts at \`j = i + 1\`, so it gets shorter as $i$ grows.` },
          { v: (N * (N + 1)) / 2, why: `This counts the inner loop as starting at \`j = i\`. It starts at \`j = i + 1\`, so the runs are ${m(`${N - 1}, ${N - 2}, \\dots, 0`)}.` },
          { v: N, why: 'This counts only the outer loop. The counted line is inside the inner loop, which runs several times per outer pass.' },
          { v: N * (N - 1), why: `This forgets to divide by 2 in $\\frac{n(n-1)}{2}$.` },
        ];
    // The largest number of inner runs: the sum is t + (t - 1) + ... + 1.
    const t = fromI ? N : N - 1;
    const runsFor = (i: number) => (fromI ? N - i + 1 : N - i);
    const rowFor = (i: number): (string | number)[] => {
      const first = fromI ? i : i + 1;
      return [i, first > N ? `none, as ${first} is past ${N}` : `${first} to ${N}`, runsFor(i)];
    };
    const shown: (string | number)[][] =
      N <= 6 ? Array.from({ length: N }, (_, x) => rowFor(x + 1)) : [rowFor(1), rowFor(2), rowFor(3), ['...', '...', '...'], rowFor(N - 1), rowFor(N)];
    const sum = `${t} + ${t - 1} + ${t - 2} + \\dots + 1`;
    return {
      code: `count = 0\nfor i = 1 to ${N}\n   ${inner}\n      count = count + 1\n   end for\nend for\nprint(count)`,
      count,
      pool,
      asking: 'How many times does the line `count = count + 1` run in total?',
      steps: steps(
        '`count` goes up by 1 each time line 4 runs, so we need to know how many times line 4 runs.',
        `The inner loop starts at \`j = ${start}\`, so it gets shorter as \`i\` grows. Count its runs for each value of \`i\`:`,
        table(['`i`', '`j` goes', 'Runs of line 4'], shown),
        `So the total is ${m(sum)}.`,
        `To add this quickly, write the sum twice, once forwards and once backwards. Each column then adds to ${m(`${t} + 1 = ${t + 1}`)}, and there are ${t} columns. So twice the sum is ${m(`${t} \\times ${t + 1}`)}.`,
        `Halve that to get the sum itself: ${m(`\\frac{${t} \\times ${t + 1}}{2} = ${count}`)}. Line 7 prints this value.`,
      ),
      conclusion: `The inner runs are ${m(sum)}, which adds up to ${count}, so the answer is ${count}.`,
      idea: 'An inner loop that shrinks by one each pass gives $1 + 2 + \\dots + t = \\frac{t(t + 1)}{2}$ runs, where $t$ is the runs on the first pass. That grows like $\\frac{n^2}{2}$, written $O(n^2)$ once the number in front is dropped.',
    };
  }
  if (kind === 'halve') {
    const N = rng.int(20, 1000);
    const strict1 = rng.bool(); // condition n > 1 (true) or n > 0 (false)
    const trace = halvingTrace(N, strict1 ? 1 : 0);
    const count = trace.length - 1;
    const cond = strict1 ? 'n > 1' : 'n > 0';
    return {
      code: `n = ${N}\ncount = 0\nwhile (${cond})\n   n = div(n,2) // div is integer division\n   count = count + 1\nend while\nprint(count)`,
      count,
      pool: [
        strict1
          ? { v: count + 1, why: 'This counts one pass too many, as if the condition were `n > 0`. With `n > 1` the loop stops as soon as `n` reaches 1.' }
          : { v: count - 1, why: 'This stops when `n` reaches 1, as if the condition were `n > 1`. With `n > 0` the pass that turns 1 into 0 also runs.' },
        { v: Math.floor(N / 2), why: `This is the value of \`n\` after the first pass (\`div(${N},2)\`), not the number of passes.` },
        { v: strict1 ? N - 1 : N, why: 'This assumes `n` goes down by 1 each pass, as in `n = n - 1`. Halving shrinks `n` much faster.' },
      ],
      infiniteWhy: `\`div(n,2)\` makes \`n\` smaller on every pass, so \`${cond}\` eventually fails and the loop stops.`,
      asking: 'How many times is `n` halved before the loop stops?',
      steps: steps(
        `\`div(n,2)\` divides by 2 and drops any remainder. For example, \`div(${N},2)\` is ${Math.floor(N / 2)}.`,
        `The loop on line 3 keeps going while \`${cond}\`. Each pass halves \`n\` and adds 1 to \`count\`, so \`count\` is the number of passes:`,
        table(['Pass', '`n` at the start', '`n` after line 4', '`count`'], trace.slice(0, count - 1).map((v, x) => [x + 1, v, trace[x + 1], x + 1])),
        `On the next pass \`n\` starts at ${trace[count - 1]} and line 4 makes it ${trace[count]}, so \`count\` becomes ${count}. Now \`${cond}\` is false, so the loop stops and line 7 prints ${count}.`,
      ),
      conclusion: `Halving takes \`n\` from ${N} down to ${trace[count]} in ${count} passes, so the answer is ${count}.`,
      idea: 'A loop that halves `n` runs about $\\log_2 n$ times, so it is $O(\\log n)$: doubling $n$ adds only one pass. For the exact count, list the values and test the stopping condition.',
    };
  }
  if (kind === 'double') {
    const N = rng.int(10, 1000);
    const le = rng.bool(); // i <= N (true) or i < N (false)
    const cond = le ? `i <= ${N}` : `i < ${N}`;
    const vals = [1];
    let i = 1;
    while (le ? i <= N : i < N) {
      i *= 2;
      vals.push(i);
    }
    const count = vals.length - 1;
    const other = (() => {
      let c = 0;
      let x = 1;
      while (le ? x < N : x <= N) {
        x *= 2;
        c++;
      }
      return c;
    })();
    return {
      code: `i = 1\ncount = 0\nwhile (${cond})\n   i = i * 2\n   count = count + 1\nend while\nprint(count)`,
      count,
      pool: [
        { v: i, why: `This is the final value of \`i\` (${i}), not the number of passes stored in \`count\`.` },
        { v: other, why: le ? 'This uses `<` instead of `<=`, which changes whether the final pass runs.' : 'This uses `<=` instead of `<`, which changes whether the final pass runs.' },
        { v: le ? N : N - 1, why: 'This assumes `i` goes up by 1 each pass, as in `i = i + 1`. Doubling grows `i` much faster.' },
        { v: count - 1, why: 'This misses the last pass: count every time the loop body runs, including the one that takes `i` past the limit.' },
      ],
      infiniteWhy: `\`i\` doubles on every pass, so it passes ${N} and \`${cond}\` fails.`,
      asking: 'How many times is `i` doubled before the loop stops?',
      steps: steps(
        `The loop on line 3 keeps going while \`${cond}\`. Line 4 doubles \`i\`, and line 5 adds 1 to \`count\`, so \`count\` is the number of passes.`,
        'Here is each pass up to the last one:',
        table(['Pass', '`i` at the start', '`i` after line 4', '`count`'], vals.slice(0, count - 1).map((v, x) => [x + 1, v, vals[x + 1], x + 1])),
        `On the next pass \`i\` starts at ${vals[count - 1]} and line 4 makes it ${i}, so \`count\` becomes ${count}. Now \`${le ? `${i} <= ${N}` : `${i} < ${N}`}\` is false, so the loop stops and line 7 prints ${count}.`,
      ),
      conclusion: `After ${count} doublings \`i\` is ${i}, which fails the test \`${cond}\`, so the answer is ${count}.`,
      idea: 'A loop that doubles a variable up to $n$ runs about $\\log_2 n$ times, so it is $O(\\log n)$. For the exact count, list the powers of 2, and see whether the test is `<` or `<=`.',
    };
  }
  // outer loop of A passes, each running a halving loop on N
  const A = rng.int(3, 9);
  const N = rng.int(10, 200);
  const trace = halvingTrace(N, 1);
  const h = trace.length - 1;
  const count = A * h;
  return {
    code: `count = 0\nfor k = 1 to ${A}\n   n = ${N}\n   while (n > 1)\n      n = div(n,2) // div is integer division\n      count = count + 1\n   end while\nend for\nprint(count)`,
    count,
    pool: [
      { v: A * N, why: `This assumes the inner loop runs ${N} times. It halves \`n\`, so it runs only ${h} times.` },
      { v: A + h, why: `This adds the loop counts (${m(`${A} + ${h}`)}). Nested loops **multiply**: the inner loop runs fully on each of the ${A} outer passes.` },
      { v: h, why: `This is one run of the inner loop. The outer loop repeats it ${A} times, because \`n\` is reset to ${N} each time.` },
      { v: A * (h + 1), why: 'This counts one extra inner pass each time, as if the condition were `n > 0`.' },
    ],
    asking: 'How many times does the line `count = count + 1` run in total?',
    steps: steps(
      '`count` goes up by 1 each time line 6 runs, so we need to know how many times line 6 runs.',
      `Line 5 halves \`n\`, because \`div\` divides by 2 and drops any remainder. Starting at ${N}, \`n\` goes ${m(trace.map((v) => texBig(v)).join(' \\to '))}. That is ${h} halvings, and then \`n > 1\` is false.`,
      `Line 3 sets \`n\` back to ${N} at the start of every outer pass. So the inner loop makes those same ${h} runs every time.`,
      `\`for k = 1 to ${A}\` makes ${A} outer passes. One loop is inside the other, so the counts multiply: ${m(`${A} \\times ${h} = ${count}`)}. Line 9 prints this value.`,
    ),
    conclusion: `${A} outer passes with ${h} halvings each make ${count} runs of line 6, so the answer is ${count}.`,
    idea: 'For a halving loop inside an outer loop, count the halvings, then multiply by the outer passes. With $n$ outer passes and about $\\log_2 n$ halvings, that is $O(n\\log n)$.',
  };
}

// ---------------------------------------------------------------- dominant term
interface TermType {
  key: string;
  tex: string;
  big: string;
  rank: number;
  /** The term's value, with no coefficient, at a given n. */
  at: (n: number) => number;
}
const TERM_TYPES: TermType[] = [
  { key: 'log', tex: '\\log_2 n', big: '\\log n', rank: 1, at: (n) => Math.log2(n) },
  { key: 'sqrt', tex: '\\sqrt{n}', big: '\\sqrt{n}', rank: 2, at: (n) => Math.sqrt(n) },
  { key: 'n', tex: 'n', big: 'n', rank: 3, at: (n) => n },
  { key: 'nlog', tex: 'n\\log_2 n', big: 'n\\log n', rank: 4, at: (n) => n * Math.log2(n) },
  { key: 'n2', tex: 'n^2', big: 'n^2', rank: 5, at: (n) => n ** 2 },
  { key: 'n3', tex: 'n^3', big: 'n^3', rank: 6, at: (n) => n ** 3 },
  { key: 'exp', tex: '2^n', big: '2^n', rank: 7, at: (n) => 2 ** n },
];
/** A convenient large n: its square root and its log are whole numbers. */
const TRY_N = 64;
/** A term's value for the table: exact while it is readable, otherwise rounded. */
function growthValue(x: number): string {
  if (x < 1e9) return commas(x);
  const [mantissa, power] = x.toExponential(1).split('e');
  return `about ${m(`${mantissa} \\times 10^{${Number(power)}}`)}`;
}
const LADDER = '1 < \\log n < \\sqrt{n} < n < n\\log n < n^2 < n^3 < 2^n';

function termTex(c: number, t: TermType): string {
  if (c === 1) return t.tex;
  return t.key === 'exp' ? `${c} \\cdot 2^n` : `${c}${t.tex}`;
}

export const generators: Generator[] = [
  {
    id: 'gen-complexity-loop-count',
    subtopic: 'complexity',
    difficulty: 'exam',
    title: 'Count how many times a loop body runs',
    generate(rng) {
      const c = loopCase(rng);
      const fallbacks: NumCand[] = [
        { v: c.count + 1, why: 'This is one too many: an off-by-one slip when counting where the loop starts or stops.' },
        { v: c.count - 1, why: 'This is one too few: an off-by-one slip when counting where the loop starts or stops.' },
        { v: c.count * 2, why: 'This doubles the true count, as if the counted line ran twice per pass.' },
      ];
      const ds = pickNums(c.count, c.pool, fallbacks);
      const distractors: { text: string; value: number | string; why: string }[] = ds.map((d) => ({ text: String(d.v), value: d.v, why: d.why }));
      if (c.infiniteWhy) distractors[2] = { text: 'Infinite loop', value: 'Infinite loop', why: c.infiniteWhy };
      const answer = String(c.count);
      return {
        stem: 'What is printed?',
        code: { lang: 'pseudocode', source: c.code },
        answer,
        answerValue: c.count,
        distractors,
        asking: c.asking,
        solution: c.steps,
        conclusion: c.conclusion,
        keyIdea: c.idea,
      };
    },
  },

  {
    id: 'gen-complexity-scaling',
    subtopic: 'complexity',
    difficulty: 'exam',
    title: 'Estimate running time for a bigger input from the Big-O',
    generate(rng) {
      const kind = rng.pick(['n', 'n2', 'n3', 'log', 'exp'] as const);
      const unit = rng.pick(['seconds', 'milliseconds'] as const);
      const t = rng.pick([2, 3, 4, 5, 6, 8, 10]);
      const fmtT = (v: number) => `${commas(v)} ${unit}`;
      let stem: string;
      let ans: number;
      let pool: NumCand[];
      let working: string;
      let asking: string;
      let conclusion: string;
      let idea: string;
      if (kind === 'log') {
        const a = rng.pick([5, 8, 10]);
        const j = rng.pick([2, 3]);
        const b = a * j;
        const n0 = 2 ** a;
        const n1 = 2 ** b;
        ans = t * j;
        stem = `A search algorithm runs in $O(\\log n)$ time. It takes ${fmtT(t)} when ${m(`n = ${texBig(n0)}`)}. Assuming the running time is proportional to $\\log_2 n$, estimate the time when ${m(`n = ${texBig(n1)}`)}.`;
        pool = [
          { v: t, why: 'This assumes $O(\\log n)$ means the time does not change at all. It grows, just slowly: in proportion to $\\log_2 n$.' },
          { v: t * 2 ** (b - a), why: `This scales the time in proportion to $n$ itself (linear), multiplying by ${m(`\\frac{${texBig(n1)}}{${texBig(n0)}} = ${texBig(2 ** (b - a))}`)}. For $O(\\log n)$ only $\\log_2 n$ matters.` },
          { v: t * j * j, why: `This squares the scale factor (${m(`${j}^2`)}), as if the algorithm were $O((\\log n)^2)$.` },
          { v: t + (b - a), why: `This adds the increase in $\\log_2 n$ (${m(`${b} - ${a} = ${b - a}`)}) to the time instead of multiplying the time by ${m(`\\frac{${b}}{${a}}`)}.` },
          { v: t * (j - 1), why: 'This works out only the **extra** time and forgets to add the original time.' },
        ];
        asking = `About how long does it take once ${m(`n = ${texBig(n1)}`)}?`;
        working = steps(
          '$\\log_2 n$ asks how many times you must double, starting from 1, to reach $n$. For example, $\\log_2 8 = 3$, because $2^3 = 8$.',
          'The running time grows in proportion to $\\log_2 n$, so work out that value for both sizes.',
          `${m(`\\log_2 ${texBig(n0)} = ${a}`)} because ${m(`2^{${a}} = ${texBig(n0)}`)}, and ${m(`\\log_2 ${texBig(n1)} = ${b}`)} because ${m(`2^{${b}} = ${texBig(n1)}`)}.`,
          `So the number of steps is multiplied by ${m(`\\frac{${b}}{${a}} = ${j}`)}.`,
          `The time grows by the same factor: ${m(`${t} \\times ${j} = ${ans}`)} ${unit}.`,
        );
        conclusion = `${m(`\\log_2 n`)} goes from ${a} to ${b}, which is ${j} times as big, so the time is ${fmtT(ans)}.`;
        idea = 'For $O(\\log n)$, work out $\\log_2$ of both sizes, then multiply the old time by new log divided by old log. Even a huge jump in $n$ only adds a little to $\\log_2 n$.';
      } else if (kind === 'exp') {
        const n0 = rng.pick([20, 25, 30, 40]);
        const d = rng.int(2, 5);
        const n1 = n0 + d;
        const f = 2 ** d;
        ans = t * f;
        stem = `A brute-force algorithm runs in $O(2^n)$ time. It takes ${fmtT(t)} when ${m(`n = ${n0}`)}. Assuming the running time is proportional to $2^n$, estimate the time when ${m(`n = ${n1}`)}.`;
        pool = [
          { v: t * d, why: `This multiplies the time by ${d} (the increase in $n$) instead of by ${m(`2^{${d}}`)}. Each extra 1 in $n$ **doubles** the time.` },
          { v: t + f, why: `This adds ${m(`2^{${d}} = ${f}`)} to the time instead of multiplying by it.` },
          { v: t * d * d, why: `This multiplies by ${m(`${d}^2`)}, treating the change like a polynomial. For $2^n$ the factor is ${m(`2^{${d}}`)}.` },
          { v: t + d, why: `This adds ${d} to the time, as if each extra 1 in $n$ added one ${unit.slice(0, -1)}.` },
          { v: t * 2 ** (d + 1), why: 'This doubles the time one time too many: $n$ goes up by exactly the difference between the two sizes.' },
        ];
        asking = `About how long does it take once ${m(`n = ${n1}`)}?`;
        working = steps(
          '$2^n$ means 2 multiplied by itself $n$ times. Adding 1 to $n$ adds one more $\\times 2$, so each extra 1 doubles the number of steps.',
          `$n$ goes from ${n0} to ${n1}, an increase of ${d}. So the steps double ${d} times.`,
          `Doubling ${d} times multiplies the steps by ${m(`2^{${d}} = ${f}`)}.`,
          `The time grows by the same factor: ${m(`${t} \\times ${f} = ${ans}`)} ${unit}.`,
        );
        conclusion = `Adding ${d} to $n$ doubles the time ${d} times, so ${fmtT(t)} becomes ${fmtT(ans)}.`;
        idea = 'For $O(2^n)$, each increase of 1 in $n$ doubles the time, so adding $d$ to $n$ multiplies the time by $2^d$. Look at the difference between the two sizes, not their ratio.';
      } else {
        const p = kind === 'n' ? 1 : kind === 'n2' ? 2 : 3;
        const n0 = rng.pick([500, 1000, 2000, 5000, 10000]);
        const k = p === 3 ? rng.pick([2, 3, 4]) : rng.pick([2, 3, 4, 5, 10]);
        const n1 = n0 * k;
        const f = k ** p;
        ans = t * f;
        const bigO = p === 1 ? 'n' : `n^${p}`;
        stem = `An algorithm runs in ${m(`O(${bigO})`)} time. It takes ${fmtT(t)} when ${m(`n = ${texBig(n0)}`)}. Assuming the running time is proportional to ${m(bigO)}, estimate the time when ${m(`n = ${texBig(n1)}`)}.`;
        const names = ['', 'an $O(n)$', 'an $O(n^2)$', 'an $O(n^3)$'];
        pool = [];
        for (const q of [1, 2, 3]) {
          if (q === p) continue;
          pool.push({
            v: t * k ** q,
            why: `This multiplies the time by ${q === 1 ? `${k}` : m(`${k}^${q} = ${k ** q}`)}, which would be right for ${names[q]} algorithm, not ${m(`O(${bigO})`)}.`,
          });
        }
        if (p > 1) pool.push({ v: t ** p, why: `This raises the **time** to the power ${p} (${m(`${t}^${p}`)}) instead of the scale factor of $n$, which is ${k}.` });
        pool.push({ v: t + f, why: `This adds the factor ${f} to the time instead of multiplying the time by it.` });
        pool.push({ v: t * 2 ** k, why: `This multiplies by ${m(`2^{${k}}`)}, treating the algorithm as exponential.` });
        const meaning =
          p === 1
            ? '$O(n)$ means the steps grow in step with $n$, as in one loop over the items.'
            : p === 2
              ? '$O(n^2)$ means about $n \\times n$ steps, as in a loop inside a loop.'
              : '$O(n^3)$ means about $n \\times n \\times n$ steps, as in three loops nested together.';
        const growth =
          p === 1
            ? `There is one $n$ in the count, so the steps are also multiplied by ${k}.`
            : `Each $n$ in that product becomes ${k} times bigger, so the steps are multiplied by ${m(`${Array(p).fill(k).join(' \\times ')} = ${f}`)}.`;
        asking = `About how long does it take once ${m(`n = ${texBig(n1)}`)}?`;
        working = steps(
          meaning,
          `Find how many times bigger $n$ gets: ${m(`\\frac{${texBig(n1)}}{${texBig(n0)}} = ${k}`)}.`,
          growth,
          `The time grows by the same factor: ${m(`${t} \\times ${f} = ${texBig(ans)}`)} ${unit}.`,
        );
        conclusion = `Making $n$ ${k} times bigger multiplies the work by ${commas(f)}, so ${fmtT(t)} becomes ${fmtT(ans)}.`;
        idea = 'For time proportional to $n^p$, find $k$, the new size divided by the old size. Then multiply the old time by $k^p$. So $O(n)$ multiplies by $k$, and $O(n^2)$ by $k^2$.';
      }
      const ds = pickNums(ans, pool, [
        { v: ans * 2, why: 'This is double the correct estimate, as if the time were doubled once more at the end. Multiply the original time by the scale factor once only.' },
        { v: ans + t, why: 'This adds the original time on top of the correct estimate, as if the scaled time were only the **extra** time. The scaled time is already the whole new running time.' },
      ]);
      const answer = fmtT(ans);
      return {
        stem,
        answer,
        answerValue: ans,
        distractors: ds.map((d) => ({ text: fmtT(d.v), value: d.v, why: d.why })),
        asking,
        solution: working,
        conclusion,
        keyIdea: idea,
      };
    },
  },

  {
    id: 'gen-complexity-dominant-term',
    subtopic: 'complexity',
    difficulty: 'foundation',
    title: 'Find the Big-O of a step-count formula',
    generate(rng) {
      const types = rng.sample(TERM_TYPES, 3).sort((a, b) => a.rank - b.rank);
      const dom = types[2];
      const lows = types.slice(0, 2);
      const coefs = new Map<string, number>();
      coefs.set(dom.key, dom.key === 'exp' ? rng.int(1, 3) : rng.int(1, 5));
      const bigCoefs = rng.sample([10, 20, 25, 40, 50, 100, 200, 500], 2);
      lows.forEach((t, i) => coefs.set(t.key, bigCoefs[i]));
      const c0 = rng.pick([1000, 2000, 3000, 5000, 8000, 10000]);
      const order = rng.shuffle(types);
      const expr = order.map((t) => termTex(coefs.get(t.key)!, t)).join(' + ') + ` + ${c0}`;
      const bigCoefTerm = coefs.get(lows[0].key)! > coefs.get(lows[1].key)! ? lows[0] : lows[1];
      const otherLow = bigCoefTerm === lows[0] ? lows[1] : lows[0];
      const domT = termTex(coefs.get(dom.key)!, dom);
      const answer = m(`O(${dom.big})`);
      const distractors = [
        {
          text: m(`O(${bigCoefTerm.big})`),
          value: bigCoefTerm.key,
          why: `This picks ${m(termTex(coefs.get(bigCoefTerm.key)!, bigCoefTerm))} because it has the biggest coefficient (${coefs.get(bigCoefTerm.key)}). Coefficients do not change the growth rate: ${m(dom.tex)} grows faster than ${m(bigCoefTerm.tex)}, so for large $n$ the term ${m(domT)} overtakes it.`,
        },
        {
          text: m(`O(${otherLow.big})`),
          value: otherLow.key,
          why: `${m(termTex(coefs.get(otherLow.key)!, otherLow))} grows more slowly than ${m(domT)} (on the growth ladder ${m(otherLow.big)} is below ${m(dom.big)}), so it is not the dominant term.`,
        },
        {
          text: '$O(1)$',
          value: 'const',
          why: `This picks the constant ${c0}, the biggest number in the formula. A constant does not grow with $n$ at all, so for large $n$ it becomes negligible.`,
        },
      ];
      const domCoef = coefs.get(dom.key)!;
      const solution = steps(
        '$T(n)$ counts the steps for an input of size $n$. Big-O asks how that count grows as $n$ gets very large, so only the fastest-growing part matters.',
        `The parts of this formula are ${order.map((t) => m(termTex(coefs.get(t.key)!, t))).join(', ')} and the constant ${c0}. A constant never changes with $n$, so it gets left behind.`,
        `To compare the other parts, cover up the numbers in front of them and try a large value, ${m(`n = ${TRY_N}`)}:`,
        table(['Part', `Value at ${m(`n = ${TRY_N}`)}`], types.map((t) => [m(t.tex), growthValue(t.at(TRY_N))])),
        types.some((t) => t.key === 'log' || t.key === 'nlog') &&
          `$\\log_2 n$ asks how many times you must double, starting from 1, to reach $n$. At ${m(`n = ${TRY_N}`)} that is ${Math.log2(TRY_N)}, because ${m(`2^{${Math.log2(TRY_N)}} = ${TRY_N}`)}.${types.some((t) => t.key === 'nlog') ? ` So $n\\log_2 n$ is ${m(`${TRY_N} \\times ${Math.log2(TRY_N)} = ${TRY_N * Math.log2(TRY_N)}`)}.` : ''}`,
        `Why cover up the numbers in front? They only multiply by a fixed amount. Even with ${coefs.get(bigCoefTerm.key)} in front, ${m(bigCoefTerm.tex)} is left behind by ${m(dom.tex)} once $n$ is big enough.`,
        domCoef === 1
          ? `The fastest-growing part is ${m(domT)}, and it has no number in front to drop. So the Big-O is ${answer}.`
          : `The fastest-growing part is ${m(domT)}. Big-O drops the ${domCoef} in front of it, which leaves ${answer}.`,
      );
      return {
        stem: `An algorithm performs ${m(`T(n) = ${expr}`)} steps on an input of size $n$. What is the simplest, tightest Big-O description of $T(n)$?`,
        answer,
        answerValue: dom.key,
        distractors,
        asking: 'Which part of this step-count formula grows fastest as $n$ gets huge, and what Big-O does that give?',
        solution,
        conclusion: `For large $n$ the part ${m(domT)} outgrows everything else, so the answer is ${answer}.`,
        keyIdea: `Big-O keeps the part highest on this ladder and drops the number in front of it: ${m(LADDER)}. Big numbers in front do not change a part's place on the ladder.`,
      };
    },
  },
];
