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
const NEVER = 'The function never stops';

// ================================================================ generator 1: trace a recursive function to its value

/** "a * x + b" in pseudocode with a clean sign. */
function codeAffine(a: number, call: string, b: number): string {
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

/** Sum of N, N - step, N - 2 step, ... while the terms stay positive. */
function sumDown(N: number, step: number): number {
  let t = 0;
  for (let n = N; n > 0; n -= step) t += n;
  return t;
}

/** `n + f(n - 2)` with base case `n == 0`: odd inputs jump over the base case and never stop. */
function genStepTwo(rng: Rng, fname: string): GeneratedCore {
  const N = rng.int(4, 9);
  const source = `function ${fname}(n)\n   if n == 0\n      return 0\n   end if\n   return n + ${fname}(n - 2)\nend function\n\nprint(${fname}(${N}))`;
  const down: number[] = [];
  for (let n = N; n >= -1; n -= 2) down.push(n);
  const code = (v: number) => `\`${num(v)}\``;
  const keyIdea = 'Every recursive call must move towards the base case; a step that can jump over it means the function never stops.';
  if (N % 2 === 1) {
    return {
      stem: 'What does this pseudocode print?',
      code: { lang: 'pseudocode', source },
      answer: NEVER,
      answerValue: NEVER,
      distractors: [
        { text: code(sumDown(N, 2)), value: sumDown(N, 2), why: `This adds down to 1 and assumes the calls stop there. The base case is \`n == 0\`, and 1 is not 0, so the next call is \`${fname}(-1)\`.` },
        { text: code(sumDown(N, 1)), value: sumDown(N, 1), why: 'This reads the step as 1. The code calls the function on `n - 2`.' },
        { text: code(sumDown(N, 2) - 1), value: sumDown(N, 2) - 1, why: 'This stops before adding 1. The function only stops when `n` is exactly 0, which never happens.' },
      ],
      solution:
        `The base case is \`n == 0\`, but each call subtracts 2. Starting from the odd number ${N}, the input goes ${down.join(', ')} and so on.\n\n` +
        `It jumps from 1 straight to $-1$, so it never equals 0. No call ever returns and nothing is printed.\n\nAnswer: ${NEVER}`,
      keyIdea,
    };
  }
  const answer = sumDown(N, 2);
  return {
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source },
    answer: code(answer),
    answerValue: answer,
    distractors: [
      { text: NEVER, value: NEVER, why: `Each call subtracts 2, but ${N} is even, so the input does reach 0 and the base case stops the calls.` },
      { text: code(sumDown(N, 1)), value: sumDown(N, 1), why: 'This reads the step as 1. The code calls the function on `n - 2`.' },
      { text: code(sumDown(N - 2, 2)), value: sumDown(N - 2, 2), why: `This is \`${fname}(${N - 2})\`: you stopped one level too early. The first call still adds ${N}.` },
    ],
    solution:
      `The base case is \`${fname}(0)\` = 0, and each call adds \`n\` and subtracts 2. Starting from the even number ${N}, the input goes ${down.join(', ')}, so it reaches the base case.\n\n` +
      `Adding on the way back up: ${down.filter((x) => x > 0).join(' + ')} = ${answer}.\n\nAnswer: ${code(answer)}`,
    keyIdea,
  };
}

function genTrace(rng: Rng): GeneratedCore {
  const fname = rng.pick(FN_NAMES);
  const kind = rng.pick(['affine', 'affine', 'sum', 'sum', 'two', 'two', 'stepTwo'] as const);
  if (kind === 'stepTwo') return genStepTwo(rng, fname);
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
    N = rng.int(3, 4);
    const f = (n: number): number => (n === 0 ? c : a * f(n - 1) + b);
    answer = f(N);
    source = `function ${fname}(n)\n   if n == 0\n      return ${c}\n   end if\n   return ${codeAffine(a, `${fname}(n - 1)`, b)}\nend function\n\nprint(${fname}(${N}))`;
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
    N = rng.int(3, 5);
    const f = (n: number): number => (n === 1 ? c : f(n - 1) + k * n);
    answer = f(N);
    const kn = k === 1 ? 'n' : `${k} * n`;
    source = `function ${fname}(n)\n   if n == 1\n      return ${c}\n   end if\n   return ${fname}(n - 1) + ${kn}\nend function\n\nprint(${fname}(${N}))`;
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
    N = rng.int(3, 5);
    const mk = (b0: number, b1: number) => {
      const fn = (n: number): number => (n === 0 ? b0 : n === 1 ? b1 : fn(n - 1) + fn(n - 2));
      return fn;
    };
    const f = mk(p, q);
    answer = f(N);
    source = `function ${fname}(n)\n   if n == 0\n      return ${p}\n   end if\n   if n == 1\n      return ${q}\n   end if\n   return ${fname}(n - 1) + ${fname}(n - 2)\nend function\n\nprint(${fname}(${N}))`;
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
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source },
    answer: ans,
    answerValue: answer,
    distractors: ds.map((d) => ({ text: code(d.value), value: d.value, why: d.why })),
    solution: `${intro}\n\n${table}\n\nSo \`${fname}(${N})\` returns ${num(answer)}, and that is printed.\n\nAnswer: ${ans}`,
    keyIdea: 'To trace a recursive function, start from the base case and apply the recursive rule once per level, keeping a table of values.',
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
];
