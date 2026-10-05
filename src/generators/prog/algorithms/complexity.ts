import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
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
  steps: string;
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
      code: `count = 0\nfor i in range(1, ${A}):\n    for j in range(${B}):\n        count += 1\nprint(count)`,
      count,
      pool: [
        { v: A * B, why: `This assumes \`range(1, ${A})\` runs ${A} times. It starts at 1 and stops **before** ${A}, so it gives ${A - 1} values.` },
        { v: A - 1 + B, why: `This adds the two loop sizes (${m(`${A - 1} + ${B}`)}). Nested loops **multiply**: the inner loop runs completely for every pass of the outer loop.` },
        { v: (A - 1) * (B - 1), why: `This assumes \`range(${B})\` runs ${B - 1} times. It gives $0, 1, \\dots, ${B - 1}$, which is ${B} values.` },
        { v: A * (B - 1), why: `This gets both loop lengths wrong by one: \`range(1, ${A})\` runs ${A - 1} times and \`range(${B})\` runs ${B} times.` },
      ],
      steps:
        `- The outer loop \`range(1, ${A})\` gives $i = 1, 2, \\dots, ${A - 1}$: that is ${A - 1} passes.\n` +
        `- For each pass, the inner loop \`range(${B})\` gives $j = 0, 1, \\dots, ${B - 1}$: that is ${B} runs.\n` +
        `- Nested loops multiply: ${m(`${A - 1} \\times ${B} = ${count}`)}.`,
      idea: 'Nested loops multiply: (outer passes) times (inner runs per pass); remember `range(a, b)` gives $b - a$ values.',
    };
  }
  if (kind === 'tri') {
    const N = rng.int(5, 16);
    const fromI = rng.bool();
    const count = fromI ? (N * (N + 1)) / 2 : (N * (N - 1)) / 2;
    const inner = fromI ? `range(i, ${N})` : 'range(i)';
    const pool: NumCand[] = fromI
      ? [
          { v: N * N, why: `This assumes the inner loop always runs ${N} times. \`range(i, ${N})\` gets shorter as $i$ grows.` },
          { v: (N * (N - 1)) / 2, why: `This is $\\frac{${N} \\times ${N - 1}}{2}$, which counts the inner loop as ${m(`${N - 1}, ${N - 2}, \\dots, 0`)} runs. For $i = 0$ it actually runs ${N} times, so the runs are ${m(`${N}, ${N - 1}, \\dots, 1`)}.` },
          { v: N, why: 'This counts only the outer loop. The counted line is inside the inner loop, which runs several times per outer pass.' },
          { v: N * (N + 1), why: `This forgets to divide by 2 in $\\frac{n(n+1)}{2}$.` },
        ]
      : [
          { v: N * N, why: `This assumes the inner loop always runs ${N} times. \`range(i)\` runs only $i$ times, which starts at 0.` },
          { v: (N * (N + 1)) / 2, why: `This counts the inner loop as $i + 1$ runs. \`range(i)\` gives $0, 1, \\dots, i - 1$, which is only $i$ values, so the runs are ${m(`0, 1, \\dots, ${N - 1}`)}.` },
          { v: N, why: 'This counts only the outer loop. The counted line is inside the inner loop, which runs several times per outer pass.' },
          { v: N * (N - 1), why: `This forgets to divide by 2 in $\\frac{n(n-1)}{2}$.` },
        ];
    const runs = fromI ? `${N}, ${N - 1}, ${N - 2}, \\dots, 1` : `0, 1, 2, \\dots, ${N - 1}`;
    const formula = fromI ? `\\frac{${N} \\times ${N + 1}}{2}` : `\\frac{${N} \\times ${N - 1}}{2}`;
    return {
      code: `count = 0\nfor i in range(${N}):\n    for j in ${inner}:\n        count += 1\nprint(count)`,
      count,
      pool,
      steps:
        `- The outer loop gives $i = 0, 1, \\dots, ${N - 1}$.\n` +
        `- The inner loop \`${inner}\` runs ${fromI ? `$${N} - i$` : '$i$'} times, so the runs are ${m(runs)}.\n` +
        `- Add them with the triangular-number formula: ${m(`${formula} = ${count}`)}.\n` +
        '- In general this is about $\\frac{n^2}{2}$, so the algorithm is $O(n^2)$.',
      idea: 'A triangular nested loop runs $1 + 2 + \\dots$ times, given by $\\frac{n(n+1)}{2}$ or $\\frac{n(n-1)}{2}$: still $O(n^2)$.',
    };
  }
  if (kind === 'halve') {
    const N = rng.int(20, 3000);
    const strict1 = rng.bool(); // condition n > 1 (true) or n > 0 (false)
    const trace = halvingTrace(N, strict1 ? 1 : 0);
    const count = trace.length - 1;
    const cond = strict1 ? 'n > 1' : 'n > 0';
    return {
      code: `n = ${N}\ncount = 0\nwhile ${cond}:\n    n = n // 2\n    count += 1\nprint(count)`,
      count,
      pool: [
        strict1
          ? { v: count + 1, why: 'This counts one pass too many, as if the condition were `n > 0`. With `n > 1` the loop stops as soon as `n` reaches 1.' }
          : { v: count - 1, why: 'This stops when `n` reaches 1, as if the condition were `n > 1`. With `n > 0` the pass that turns 1 into 0 also runs.' },
        { v: Math.floor(N / 2), why: `This is the value of \`n\` after the first pass (\`${N} // 2\`), not the number of passes.` },
        { v: strict1 ? N - 1 : N, why: 'This assumes `n` goes down by 1 each pass, as in `n = n - 1`. Halving shrinks `n` much faster.' },
        { v: Math.ceil(Math.log2(N)) + (strict1 ? 0 : 1), why: `This rounds $\\log_2 ${N}$ up. Integer division \`//\` rounds down at every step, so count the passes exactly.` },
      ],
      steps:
        '`n // 2` halves `n` and rounds down. The values of `n` are:\n\n' +
        `${m(trace.map((v) => texBig(v)).join(' \\to '))}\n\n` +
        `- That is ${count} arrows, so ${count} passes; then \`${cond}\` is false and the loop stops.\n` +
        `- Check: ${m(`2^{${Math.floor(Math.log2(N))}} \\le ${texBig(N)} < 2^{${Math.floor(Math.log2(N)) + 1}}`)}, so it takes ${Math.floor(Math.log2(N))} halvings to reach 1${strict1 ? '' : ', plus one more pass to reach 0'}.\n` +
        '- A loop that halves is $O(\\log n)$.',
      idea: 'A loop that halves $n$ runs about $\\log_2 n$ times; check the stopping condition to get the exact count.',
    };
  }
  if (kind === 'double') {
    const N = rng.int(10, 3000);
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
      code: `i = 1\ncount = 0\nwhile ${cond}:\n    i = i * 2\n    count += 1\nprint(count)`,
      count,
      pool: [
        { v: i, why: `This is the final value of \`i\` (${i}), not the number of passes stored in \`count\`.` },
        { v: other, why: le ? 'This uses `<` instead of `<=`, which changes whether the final pass runs.' : 'This uses `<=` instead of `<`, which changes whether the final pass runs.' },
        { v: le ? N : N - 1, why: 'This assumes `i` goes up by 1 each pass, as in `i = i + 1`. Doubling grows `i` much faster.' },
        { v: count - 1, why: 'This misses the last pass: count every time the loop body runs, including the one that takes `i` past the limit.' },
      ],
      steps:
        'Each pass doubles `i`. The values of `i` are:\n\n' +
        `${m(vals.map((v) => texBig(v)).join(' \\to '))}\n\n` +
        `- After ${count} passes \`i\` is ${i}, so \`${cond}\` is false and the loop stops.\n` +
        `- So \`count\` is ${count}. A loop that doubles up to $n$ runs about $\\log_2 n$ times: $O(\\log n)$.`,
      idea: 'A loop that doubles a variable up to $n$ runs about $\\log_2 n$ times: $O(\\log n)$.',
    };
  }
  // outer loop of A passes, each running a halving loop on N
  const A = rng.int(3, 9);
  const N = rng.int(10, 200);
  const trace = halvingTrace(N, 1);
  const h = trace.length - 1;
  const count = A * h;
  return {
    code: `count = 0\nfor k in range(${A}):\n    n = ${N}\n    while n > 1:\n        n = n // 2\n        count += 1\nprint(count)`,
    count,
    pool: [
      { v: A * N, why: `This assumes the inner loop runs ${N} times. It halves \`n\`, so it runs only ${h} times.` },
      { v: A + h, why: `This adds the loop counts (${m(`${A} + ${h}`)}). Nested loops **multiply**: the inner loop runs fully on each of the ${A} outer passes.` },
      { v: h, why: `This is one run of the inner loop. The outer loop repeats it ${A} times, because \`n\` is reset to ${N} each time.` },
      { v: A * (h + 1), why: 'This counts one extra inner pass each time, as if the condition were `n > 0`.' },
    ],
    steps:
      `- Inner loop: \`n\` goes ${m(trace.map((v) => texBig(v)).join(' \\to '))}, which is ${h} passes (then \`n > 1\` is false).\n` +
      `- \`n\` is reset to ${N} at the start of every outer pass, so the inner loop does ${h} passes every time.\n` +
      `- Outer loop: \`range(${A})\` runs ${A} times. Nested loops multiply: ${m(`${A} \\times ${h} = ${count}`)}.`,
    idea: 'A halving loop inside an outer loop: multiply the outer count by the number of halvings (about $\\log_2 n$).',
  };
}

// ---------------------------------------------------------------- dominant term
interface TermType {
  key: string;
  tex: string;
  big: string;
  rank: number;
}
const TERM_TYPES: TermType[] = [
  { key: 'log', tex: '\\log_2 n', big: '\\log n', rank: 1 },
  { key: 'sqrt', tex: '\\sqrt{n}', big: '\\sqrt{n}', rank: 2 },
  { key: 'n', tex: 'n', big: 'n', rank: 3 },
  { key: 'nlog', tex: 'n\\log_2 n', big: 'n\\log n', rank: 4 },
  { key: 'n2', tex: 'n^2', big: 'n^2', rank: 5 },
  { key: 'n3', tex: 'n^3', big: 'n^3', rank: 6 },
  { key: 'exp', tex: '2^n', big: '2^n', rank: 7 },
];
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
      const answer = `\`${c.count}\``;
      return {
        stem: 'What does this Python code print?',
        code: { lang: 'python', source: c.code },
        answer,
        answerValue: c.count,
        distractors: ds.map((d) => ({ text: `\`${d.v}\``, value: d.v, why: d.why })),
        solution: `${c.steps}\n\nThe code prints the final value of \`count\`.\n\nAnswer: ${answer}`,
        keyIdea: c.idea,
        python: { stdout: `${c.count}\n` },
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
      let steps: string;
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
        steps =
          `- Time is proportional to $\\log_2 n$.\n` +
          `- ${m(`\\log_2 ${texBig(n0)} = ${a}`)} because ${m(`2^{${a}} = ${texBig(n0)}`)}, and ${m(`\\log_2 ${texBig(n1)} = ${b}`)} because ${m(`2^{${b}} = ${texBig(n1)}`)}.\n` +
          `- The time is multiplied by ${m(`\\frac{${b}}{${a}} = ${j}`)}.\n` +
          `- New time ${m(`= ${t} \\times ${j} = ${ans}`)} ${unit}.`;
        idea = 'For $O(\\log n)$, multiplying $n$ by a huge factor only adds a little to $\\log_2 n$, so the time grows very slowly.';
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
        steps =
          `- Time is proportional to $2^n$, so every increase of 1 in $n$ doubles the time.\n` +
          `- $n$ goes from ${n0} to ${n1}, an increase of ${d}.\n` +
          `- The time is multiplied by ${m(`2^{${d}} = ${f}`)}.\n` +
          `- New time ${m(`= ${t} \\times ${f} = ${ans}`)} ${unit}.`;
        idea = 'For $O(2^n)$, each increase of 1 in $n$ doubles the running time.';
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
        steps =
          `- Time is proportional to ${m(bigO)}.\n` +
          `- Scale factor for $n$: ${m(`\\frac{${texBig(n1)}}{${texBig(n0)}} = ${k}`)}.\n` +
          (p === 1 ? `- So the time is also multiplied by ${k}.\n` : `- So the time is multiplied by ${m(`${k}^${p} = ${f}`)}.\n`) +
          `- New time ${m(`= ${t} \\times ${f} = ${texBig(ans)}`)} ${unit}.`;
        idea = 'For $O(n^p)$, multiplying $n$ by $k$ multiplies the running time by $k^p$.';
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
        solution: `${steps}\n\nAnswer: ${answer}`,
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
      const solution =
        `Big-O keeps only the fastest-growing term and drops its coefficient.\n\n` +
        `1. The terms are ${order.map((t) => m(termTex(coefs.get(t.key)!, t))).join(', ')} and the constant ${m(String(c0))}.\n` +
        `2. Ignore the coefficients and compare the growth rates using the ladder ${m(LADDER)}.\n` +
        `3. The highest on the ladder is ${m(dom.tex)}, so the dominant term is ${m(domT)}, even though other terms have bigger coefficients.\n` +
        (coefs.get(dom.key) === 1
          ? `4. This term has no coefficient to drop, so ${m(`T(n) = O(${dom.big})`)}.\n\n`
          : `4. Drop the coefficient ${coefs.get(dom.key)}: ${m(`T(n) = O(${dom.big})`)}.\n\n`) +
        `Answer: ${answer}`;
      return {
        stem: `An algorithm performs ${m(`T(n) = ${expr}`)} steps on an input of size $n$. What is the simplest, tightest Big-O description of $T(n)$?`,
        answer,
        answerValue: dom.key,
        distractors,
        solution,
        keyIdea: 'The term highest on the growth ladder dominates for large $n$, whatever the coefficients; drop the coefficient to get the Big-O.',
      };
    },
  },
];
