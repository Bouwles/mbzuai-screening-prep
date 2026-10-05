import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { num } from '../../../lib/tex';

type Cand = { value: number; why: string };

/** Keep 3 candidates that differ from the answer and each other (by value and by rendered text). */
function pickThree(answer: number, pool: Cand[], fallbacks: Cand[], render: (v: number) => string): Cand[] {
  const out: Cand[] = [];
  for (const c of [...pool, ...fallbacks]) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value) || c.value === answer || render(c.value) === render(answer)) continue;
    if (out.some((x) => x.value === c.value || render(x.value) === render(c.value))) continue;
    out.push(c);
  }
  if (out.length < 3) throw new Error('could not build 3 distinct distractors');
  return out;
}

const FN_NAMES = ['f', 'g', 'h', 'calc', 'rec'];

// ================================================================ generator 1: trace a recursive function to its value

/** "a * x + b" in Python with a clean sign. */
function pyAffine(a: number, call: string, b: number): string {
  return `${a} * ${call} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
}
/** Same in LaTeX with a known numeric value in place of the call. */
function texAffine(a: number, x: number, b: number): string {
  return `${a} \\times ${num(x)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
}

function traceTable(rows: [string, string, number][], fname: string): string {
  return (
    `| $n$ | Working | \`${fname}(n)\` |\n| --- | --- | --- |\n` +
    rows.map(([n, w, v]) => `| ${n} | ${w} | ${num(v)} |`).join('\n')
  );
}

function genTrace(rng: Rng): GeneratedCore {
  const fname = rng.pick(FN_NAMES);
  const kind = rng.pick(['affine', 'sum', 'two'] as const);
  const code = (v: number) => `\`${num(v)}\``;

  let source: string;
  let N: number;
  let answer: number;
  let table: string;
  let intro: string;
  let pool: Cand[];

  if (kind === 'affine') {
    const a = rng.int(2, 3);
    let b = rng.pick([-2, -1, 1, 2, 3, 4, 5]);
    const c = rng.int(2, 4);
    // avoid a fixed point (a*c + b = c gives a constant, boring sequence)
    while (a * c + b === c) b = rng.pick([-1, 1, 2, 3, 4, 5]);
    N = a === 3 ? rng.int(3, 4) : rng.int(3, 5);
    const f = (n: number): number => (n === 0 ? c : a * f(n - 1) + b);
    answer = f(N);
    source = `def ${fname}(n):\n    if n == 0:\n        return ${c}\n    return ${pyAffine(a, `${fname}(n - 1)`, b)}\n\nprint(${fname}(${N}))`;
    const rows: [string, string, number][] = [['0', 'base case', c]];
    for (let n = 1; n <= N; n++) rows.push([String(n), `$${texAffine(a, f(n - 1), b)}$`, f(n)]);
    table = traceTable(rows, fname);
    intro = `The base case is \`${fname}(0)\` = ${c}. Every other call multiplies the previous value by ${a} and then ${b < 0 ? `subtracts ${-b}` : `adds ${b}`}. Work upwards from the base case:`;
    const noB = c * a ** N;
    const g = (n: number): number => (n === 0 ? c : a * (g(n - 1) + b));
    pool = [
      { value: f(N - 1), why: `This is \`${fname}(${N - 1})\`: you stopped one level too early. The first call is \`${fname}(${N})\`, which applies the rule once more.` },
      { value: noB + b, why: `This applies the ${b < 0 ? `$-${-b}$` : `$+${b}$`} only once, at the end. In the code it is applied at **every** level, after each multiplication.` },
      { value: g(N), why: `This ${b < 0 ? 'subtracts' : 'adds'} before multiplying, as if the code were \`${a} * (${fname}(n - 1) ${b < 0 ? '-' : '+'} ${Math.abs(b)})\`. Multiplication is done first, so the ${b < 0 ? 'subtraction' : 'addition'} comes after.` },
      { value: f(N + 1), why: `This is \`${fname}(${N + 1})\`: one level too many. The base case \`${fname}(0)\` just returns ${c}; it does not apply the rule.` },
      { value: noB, why: `This ignores the ${b < 0 ? `$-${-b}$` : `$+${b}$`} completely and only multiplies by ${a} at each level.` },
    ];
  } else if (kind === 'sum') {
    const k = rng.int(1, 4);
    const c = rng.int(1, 6);
    N = rng.int(4, 8);
    const f = (n: number): number => (n === 1 ? c : f(n - 1) + k * n);
    answer = f(N);
    const kn = k === 1 ? 'n' : `${k} * n`;
    source = `def ${fname}(n):\n    if n == 1:\n        return ${c}\n    return ${fname}(n - 1) + ${kn}\n\nprint(${fname}(${N}))`;
    const rows: [string, string, number][] = [['1', 'base case', c]];
    for (let n = 2; n <= N; n++) rows.push([String(n), k === 1 ? `$${f(n - 1)} + ${n}$` : `$${f(n - 1)} + ${k} \\times ${n}$`, f(n)]);
    table = traceTable(rows, fname);
    intro = `The base case is \`${fname}(1)\` = ${c}. Every other call adds ${k === 1 ? '`n`' : `${k} times \`n\``} to the previous value. Work upwards from the base case:`;
    const useN1 = (n: number): number => (n === 1 ? c : useN1(n - 1) + k * (n - 1));
    pool = [
      { value: f(N - 1), why: `This is \`${fname}(${N - 1})\`: you stopped one level too early. The first call \`${fname}(${N})\` still adds ${k * N}.` },
      { value: answer - c + k, why: `This uses the rule for $n = 1$ as well, so the bottom value becomes ${k === 1 ? '1' : `$${k} \\times 1 = ${k}$`} instead of ${c}. But \`${fname}(1)\` is the base case: it returns exactly ${c} and does not apply the rule.` },
      { value: useN1(N), why: `This adds ${k === 1 ? '`n - 1`' : `${k} times \`n - 1\``} at each level instead of using the current \`n\`. Each call uses its own value of \`n\`.` },
      { value: f(N + 1), why: `This is \`${fname}(${N + 1})\`: one level too many.` },
      { value: answer - c, why: `This leaves out the base-case value ${c}, as if the base case returned 0.` },
    ];
  } else {
    const p = rng.int(1, 3);
    let q = rng.int(2, 5);
    if (q === p) q = p + 2;
    N = rng.int(5, 8);
    const mk = (b0: number, b1: number) => {
      const fn = (n: number): number => (n === 0 ? b0 : n === 1 ? b1 : fn(n - 1) + fn(n - 2));
      return fn;
    };
    const f = mk(p, q);
    answer = f(N);
    source = `def ${fname}(n):\n    if n == 0:\n        return ${p}\n    if n == 1:\n        return ${q}\n    return ${fname}(n - 1) + ${fname}(n - 2)\n\nprint(${fname}(${N}))`;
    const rows: [string, string, number][] = [
      ['0', 'base case', p],
      ['1', 'base case', q],
    ];
    for (let n = 2; n <= N; n++) rows.push([String(n), `$${f(n - 1)} + ${f(n - 2)}$`, f(n)]);
    table = traceTable(rows, fname);
    intro = `There are two base cases: \`${fname}(0)\` = ${p} and \`${fname}(1)\` = ${q}. Every other value is the sum of the previous two. Build a table upwards instead of drawing the whole call tree:`;
    pool = [
      { value: f(N - 1), why: `This is \`${fname}(${N - 1})\`: you stopped one row too early in the table.` },
      { value: mk(q, p)(N), why: `This swaps the two base cases (using ${q} for $n = 0$ and ${p} for $n = 1$). Read the base cases carefully.` },
      { value: f(N + 1), why: `This is \`${fname}(${N + 1})\`: one row too many in the table.` },
      { value: f(N - 1) * 2, why: `This adds \`${fname}(${N - 1})\` to itself in the last step. The second call is \`${fname}(n - 2)\`, so the last step is \`${fname}(${N - 1})\` + \`${fname}(${N - 2})\`.` },
    ];
  }

  const fallbacks: Cand[] = [
    { value: answer + 1, why: 'This is an arithmetic slip of one in the final addition; recheck each row of the table.' },
    { value: answer - 1, why: 'This is an arithmetic slip of one in the final step; recheck each row of the table.' },
  ];
  const ds = pickThree(answer, pool, fallbacks, code);
  const ans = code(answer);
  return {
    stem: 'What does this Python code print?',
    code: { lang: 'python', source },
    answer: ans,
    answerValue: answer,
    distractors: ds.map((d) => ({ text: code(d.value), value: d.value, why: d.why })),
    solution: `${intro}\n\n${table}\n\nSo \`${fname}(${N})\` returns ${num(answer)}, and that is printed.\n\nAnswer: ${ans}`,
    keyIdea: 'To trace a recursive function, start from the base case and apply the recursive rule once per level, keeping a table of values.',
    python: { stdout: `${answer}\n` },
  };
}

// ================================================================ generator 2: count the calls

function genCount(rng: Rng): GeneratedCore {
  const kind = rng.pick(['fib', 'linear', 'halve', 'double'] as const);
  const dollars = (v: number) => `$${num(v)}$`;
  let source: string;
  let callText: string;
  let answer: number;
  let solution: string;
  let pool: Cand[];

  if (kind === 'fib') {
    const fname = rng.pick(['fib', 'f', 'seq']);
    const baseRet = rng.pick(['n', '1']);
    const N = rng.int(4, 8);
    source = `def ${fname}(n):\n    if n <= 1:\n        return ${baseRet}\n    return ${fname}(n - 1) + ${fname}(n - 2)`;
    callText = `${fname}(${N})`;
    const C: number[] = [1, 1];
    for (let n = 2; n <= N; n++) C.push(1 + C[n - 1] + C[n - 2]);
    const val = (n: number): number => (n <= 1 ? (baseRet === 'n' ? n : 1) : val(n - 1) + val(n - 2));
    answer = C[N];
    const header = `| $n$ | ${C.map((_, i) => i).join(' | ')} |\n| --- | ${C.map(() => '---').join(' | ')} |\n| $C(n)$ | ${C.join(' | ')} |`;
    solution =
      `Let $C(n)$ be the number of calls made when \`${fname}(n)\` is evaluated, counting that call itself.\n\n` +
      `- \`${fname}(0)\` and \`${fname}(1)\` are base cases and make no further calls, so $C(0) = C(1) = 1$.\n` +
      `- Any other call is 1 call plus all the calls made by \`${fname}(n - 1)\` plus all the calls made by \`${fname}(n - 2)\`:\n\n` +
      `$$C(n) = 1 + C(n-1) + C(n-2)$$\n\n${header}\n\n` +
      `For example $C(${N}) = 1 + ${C[N - 1]} + ${C[N - 2]} = ${C[N]}$.\n\nAnswer: ${dollars(answer)}`;
    pool = [
      { value: val(N), why: `This is the **value** that \`${fname}(${N})\` returns, not the number of calls made.` },
      { value: N + 1, why: `This counts one call per value ${N}, ${N - 1}, ..., 0, as if each value were computed once. The two-call version recomputes the same values many times.` },
      { value: C[N - 1], why: `This is $C(${N - 1})$, the count for \`${fname}(${N - 1})\`. You need one more level: $C(${N}) = 1 + C(${N - 1}) + C(${N - 2})$.` },
      { value: C[N] - 1, why: `This forgets to count the original call \`${fname}(${N})\` itself (it counts only the calls it causes).` },
      { value: 2 ** N, why: `This assumes the call tree is a perfect binary tree with $2^{${N}}$ calls. The \`n - 2\` branch is shorter, so there are fewer calls.` },
    ];
  } else if (kind === 'linear') {
    const fname = rng.pick(['total', 'add_up', 'f']);
    const base = rng.pick([0, 1]);
    const N = rng.int(5, 20);
    source = `def ${fname}(n):\n    if n == ${base}:\n        return ${base}\n    return n + ${fname}(n - 1)`;
    callText = `${fname}(${N})`;
    answer = N - base + 1;
    const value = (N * (N + 1)) / 2;
    solution =
      `Each call makes exactly **one** recursive call, with \`n\` reduced by 1, until \`n == ${base}\`:\n\n` +
      `$$${N} \\to ${N - 1} \\to ${N - 2} \\to \\dots \\to ${base}$$\n\n` +
      `The calls are \`${fname}(n)\` for every whole number $n$ from ${N} down to ${base}. That is ${base === 0 ? `$${N} + 1 = ${answer}$` : `$${N}$`} calls (the base-case call \`${fname}(${base})\` counts too).\n\nAnswer: ${dollars(answer)}`;
    pool = [
      { value: base === 0 ? N : N + 1, why: base === 0 ? `This forgets the base-case call \`${fname}(0)\`: the values ${N}, ${N - 1}, ..., 1, 0 give ${N + 1} calls, not ${N}.` : `This assumes the calls go down to \`${fname}(0)\`. The base case is \`n == 1\`, so \`${fname}(1)\` returns without calling \`${fname}(0)\`.` },
      { value: answer - 1, why: `This counts only the recursive calls and leaves out the original call \`${fname}(${N})\` made by the main program.` },
      { value: value, why: `This is the **value** returned ($${N} + ${N - 1} + \\dots$), not the number of calls.` },
      { value: 2 * answer, why: 'This counts every call twice (once going down and once coming back). A call is made once; returning is not a new call.' },
    ];
  } else if (kind === 'halve') {
    const b = rng.int(2, 5);
    const E = rng.int(5, 60);
    source = `def power(b, e):\n    if e == 0:\n        return 1\n    half = power(b, e // 2)\n    if e % 2 == 0:\n        return half * half\n    return b * half * half`;
    callText = `power(${b}, ${E})`;
    const chain: number[] = [];
    for (let e = E; ; e = Math.floor(e / 2)) {
      chain.push(e);
      if (e === 0) break;
    }
    answer = chain.length;
    solution =
      `Each call makes exactly **one** recursive call, with the exponent halved and rounded down (\`e // 2\`), until \`e == 0\`:\n\n` +
      `$$${chain.join(' \\to ')}$$\n\n` +
      `Count the exponents in the chain, including the first call and the base case: there are ${answer} calls.\n\nAnswer: ${dollars(answer)}`;
    pool = [
      { value: E + 1, why: `This is the count for the simple version \`b * power(b, e - 1)\`, which goes ${E}, ${E - 1}, ..., 0. This version **halves** the exponent each time.` },
      { value: answer - 1, why: `This forgets the base-case call: when \`e\` is 1, \`1 // 2\` = 0, so \`power(${b}, 0)\` is still called.` },
      // "goes down by 2" only makes sense for an even exponent (an odd one would skip over 0)
      ...(E % 2 === 0
        ? [{ value: E / 2 + 1, why: `This treats the exponent as going down by 2 each time (${E}, ${E - 2}, ..., 2, 0, which is ${E / 2 + 1} calls). It is **halved** each time, which shrinks it much faster.` }]
        : []),
      { value: answer - 2, why: `This counts the halving steps from ${E} down to 1 (there are ${answer - 2} of them). The number of calls is one more than the number of steps, and the base-case call \`power(${b}, 0)\` must be added too.` },
      { value: E, why: `This counts one call per unit of the exponent (as for repeated multiplication). Halving needs far fewer calls.` },
    ];
  } else {
    const fname = rng.pick(['f', 'split', 'tree']);
    const N = rng.int(2, 6);
    source = `def ${fname}(n):\n    if n == 0:\n        return\n    ${fname}(n - 1)\n    ${fname}(n - 1)`;
    callText = `${fname}(${N})`;
    answer = 2 ** (N + 1) - 1;
    const levels = Array.from({ length: N + 1 }, (_, i) => 2 ** i);
    solution =
      `Each call with $n > 0$ makes **two** calls with $n - 1$, so the number of calls doubles at every level of the call tree:\n\n` +
      `| Level | ${levels.map((_, i) => `\`${fname}(${N - i})\``).join(' | ')} |\n| --- | ${levels.map(() => '---').join(' | ')} |\n| Calls | ${levels.join(' | ')} |\n\n` +
      `Total: $${levels.join(' + ')} = ${answer}$, which is $2^{${N + 1}} - 1$.\n\nAnswer: ${dollars(answer)}`;
    pool = [
      { value: 2 ** N, why: `This counts only the bottom level of the call tree (the $2^{${N}}$ base-case calls) and leaves out the calls above it.` },
      { value: N + 1, why: `This follows only one branch (${N}, ${N - 1}, ..., 0). Each call makes **two** calls, so the tree doubles at every level.` },
      { value: 2 * N + 1, why: 'This assumes each level adds just 2 calls. In fact the number of calls **doubles** at each level.' },
      { value: 2 ** (N + 1), why: `This is $2^{${N + 1}}$. The total of $1 + 2 + 4 + \\dots$ is always one less than the next power of 2.` },
    ];
  }

  const fallbacks: Cand[] = [
    { value: answer + 1, why: 'This counts the original call twice (once as the call from the main program and once as a recursive call).' },
    { value: answer + 2, why: 'This adds extra calls below the base case; the base case returns straight away without calling again.' },
  ];
  const ds = pickThree(answer, pool, fallbacks, dollars);
  return {
    stem: `The main program calls \`${callText}\` once. Counting that first call, how many calls to the function are made **in total**?`,
    code: { lang: 'python', source },
    answer: dollars(answer),
    answerValue: answer,
    distractors: ds.map((d) => ({ text: dollars(d.value), value: d.value, why: d.why })),
    solution,
    keyIdea: 'To count calls, look at how many recursive calls each call makes and how fast the input shrinks: one call per level is linear, halving is logarithmic, two calls per level doubles.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-recursion-trace-value',
    subtopic: 'recursion',
    difficulty: 'exam',
    title: 'Trace a recursive function to find what it prints',
    generate: genTrace,
  },
  {
    id: 'gen-recursion-count-calls',
    subtopic: 'recursion',
    difficulty: 'challenge',
    title: 'Count the calls a recursive function makes',
    generate: genCount,
  },
];
