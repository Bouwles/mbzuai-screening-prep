import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

type Cand = { text: string; why: string };

/** Keep up to 3 candidates whose text differs from the answer and from each other. */
function pickDistinct(answer: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const key = (s: string) => s.replace(/\s+/g, ' ').trim();
  for (const c of pool) {
    if (out.length === 3) break;
    if (key(c.text) === key(answer)) continue;
    if (out.some((o) => key(o.text) === key(c.text))) continue;
    out.push(c);
  }
  return out;
}

const setTex = (xs: number[]) => `\\{${xs.join(', ')}\\}`;
const setLit = (xs: number[]) => `$${setTex(xs)}$`;
const sortNum = (xs: number[]) => [...xs].sort((a, b) => a - b);
const uniq = (xs: number[]) => [...new Set(xs)];

// ------------------------------------------------------------------ set operations
type OpId = 'union' | 'inter' | 'diff' | 'sym';
const OPS: { op: OpId; tex: string; name: string; meaning: string }[] = [
  { op: 'union', tex: 'A \\cup B', name: 'union', meaning: 'every value that is in $A$ or in $B$ (or both)' },
  { op: 'inter', tex: 'A \\cap B', name: 'intersection', meaning: 'only the values that are in both $A$ and $B$' },
  { op: 'diff', tex: 'A \\setminus B', name: 'difference', meaning: 'the values in $A$ that are not in $B$' },
  { op: 'sym', tex: '(A \\cup B) \\setminus (A \\cap B)', name: 'symmetric difference', meaning: 'the values in exactly one of $A$ and $B$ (not in both)' },
];

function applyOp(op: OpId, A: number[], B: number[]): number[] {
  const sa = new Set(A);
  const sb = new Set(B);
  switch (op) {
    case 'union':
      return sortNum(uniq([...A, ...B]));
    case 'inter':
      return sortNum(A.filter((x) => sb.has(x)));
    case 'diff':
      return sortNum(A.filter((x) => !sb.has(x)));
    case 'sym':
      return sortNum([...A.filter((x) => !sb.has(x)), ...B.filter((x) => !sa.has(x))]);
  }
}

function genSetOps(rng: Rng): GeneratedCore {
  for (;;) {
    // distinct values 1..12; A and B overlap in 1-3 values, each has 1-3 values of its own
    const pool = rng.shuffle(Array.from({ length: 12 }, (_, i) => i + 1));
    const nCommon = rng.int(1, 3);
    const nOnlyA = rng.int(1, 3);
    const nOnlyB = rng.int(1, 3);
    const common = pool.slice(0, nCommon);
    const onlyA = pool.slice(nCommon, nCommon + nOnlyA);
    const onlyB = pool.slice(nCommon + nOnlyA, nCommon + nOnlyA + nOnlyB);
    const A = sortNum([...common, ...onlyA]);
    const B = sortNum([...common, ...onlyB]);
    const { op, tex, name, meaning } = rng.pick(OPS);

    const ans = applyOp(op, A, B);
    const answer = setLit(ans);

    const cands: Cand[] = [];
    const add = (xs: number[], why: string) => cands.push({ text: setLit(xs), why });
    if (op === 'diff') add(applyOp('diff', B, A), 'This is $B \\setminus A$ (the values in $B$ that are not in $A$). Set difference is not symmetric: $A \\setminus B$ starts from $A$.');
    // most tempting confusions first
    const order: Record<OpId, OpId[]> = { union: ['sym', 'inter'], inter: ['union', 'diff'], diff: ['sym', 'inter', 'union'], sym: ['union', 'diff', 'inter'] };
    for (const o2 of order[op]) {
      const info = OPS.find((o) => o.op === o2)!;
      add(applyOp(o2, A, B), `This is the ${info.name} $${info.tex}$, not the ${name}. The ${name} gives ${meaning}.`);
    }
    if (op === 'union' || op === 'sym') add(sortNum([...A, ...B]), 'This joins the two sets without removing the shared values, so they appear twice. A set never contains duplicates.');
    add(applyOp('diff', A, B), `This is $A \\setminus B$ (the values of $A$ that are not in $B$), not the ${name}.`);
    add(A, `This is just the set $A$ itself; it ignores what the ${name} does with $B$.`);
    add(B, `This is just the set $B$ itself; it ignores what the ${name} does with $A$.`);
    const ds = pickDistinct(answer, cands);
    if (ds.length < 3) continue;

    const solution =
      `1. Values in both sets: ${setLit(sortNum(common))}. Only in $A$: ${setLit(sortNum(onlyA))}. Only in $B$: ${setLit(sortNum(onlyB))}.\n` +
      `2. $${tex}$ is the ${name}: ${meaning}.\n\n` +
      `Answer: ${answer}`;
    return {
      stem: `Let $A = ${setTex(A)}$ and $B = ${setTex(B)}$. Find $${tex}$.`,
      answer,
      answerValue: ans.join(','),
      distractors: ds.map((d) => ({ text: d.text, value: d.text, why: d.why })),
      solution,
      keyIdea: 'Union is either, intersection is both, difference is one-way (order matters) and symmetric difference is exactly one; sets never hold duplicates.',
    };
  }
}

// ------------------------------------------------------------------ counting with an array
function genCounting(rng: Rng): GeneratedCore {
  for (;;) {
    const k = rng.int(2, 4);
    const n = rng.int(k + 2, 7);
    // every value 1..k appears at least once
    const values = Array.from({ length: k }, (_, i) => i + 1);
    const items = rng.shuffle([...values, ...Array.from({ length: n - k }, () => rng.int(1, k))]);
    const counts = values.map((v) => items.filter((x) => x === v).length);
    const repeated = values.filter((v) => counts[v - 1] >= 2);
    if (!repeated.length) continue;
    const t = rng.pick(repeated);
    const c = counts[t - 1];

    const answer = String(c);
    const cands: Cand[] = [
      { text: String(n), why: `This is the length of \`A\`. \`C[${t}]\` counts only the elements equal to ${t}.` },
      { text: '1', why: 'This assumes the count is reset to 1 each time. The line adds 1 to the count so far, so every repeat adds to it.' },
      { text: String(c - 1), why: `This counts only the repeats of ${t}, after its first appearance. The first appearance also adds 1.` },
      { text: String(t === c ? k : t), why: t === c ? 'This is the number of different values. `C[t]` is how many times one value appears.' : `This is the index ${t} itself. \`C[${t}]\` holds how many times ${t} appears.` },
      { text: String(k), why: 'This is the number of different values. `C[t]` is how many times one value appears.' },
    ];
    const ds = pickDistinct(answer, cands);
    if (ds.length < 3) continue;

    const zeros = `[${values.map(() => 0).join(', ')}]`;
    const lines = [`A = [${items.join(', ')}]`, `C = ${zeros}`, 'for i = 1 to length(A)', '   C[A[i]] = C[A[i]] + 1', 'end for', `print(C[${t}])`];
    const running = values.map(() => 0);
    const rows = items
      .map((x, i) => {
        running[x - 1]++;
        return `| ${i + 1} | ${x} | \`[${running.join(', ')}]\` |`;
      })
      .join('\n');
    const solution =
      'Each element of `A` is used as an index into `C`, and that count goes up by 1.\n\n' +
      `| i | A[i] | \`C\` afterwards |\n|---|---|---|\n${rows}\n\n` +
      `So \`C[${t}]\` is ${c}, because ${t} appears ${c} times in \`A\`.\n\n` +
      `Answer: ${answer}`;
    return {
      stem: 'Arrays are indexed from 1. `C` counts how often each value appears in `A`. What does this pseudocode print?',
      code: { lang: 'pseudocode', source: lines.join('\n') },
      answer,
      answerValue: c,
      distractors: ds.map((x) => ({ text: x.text, value: Number(x.text), why: x.why })),
      solution,
      keyIdea: 'A counting array uses each value as an index, just as a map counts by key.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-dicts-sets-set-ops',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    title: 'Result of a set operation',
    generate: genSetOps,
  },
  {
    id: 'gen-dicts-sets-counting',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    title: 'Count values with a 1-based array',
    generate: genCounting,
  },
];
