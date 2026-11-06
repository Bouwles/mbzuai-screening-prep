import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { m, matrix, num, paren } from '../../../lib/tex';
import { det3 } from '../../../lib/mathx';

type FM = Frac[][];
const encF = (a: FM) => a.flat().map((x) => x.toString()).join(',');
const mapF = (a: FM, f: (x: Frac) => Frac): FM => a.map((r) => r.map(f));

/** Pick up to 3 candidates whose value and rendered text differ from the answer and from each other. */
function pickDistinct<T extends { key: string; text: string }>(answer: { key: string; text: string }, pool: T[]): T[] {
  const out: T[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (d.key === answer.key || d.text === answer.text) continue;
    if (out.some((x) => x.key === d.key || x.text === d.text)) continue;
    out.push(d);
  }
  return out;
}

// ---------------------------------------------------------------- 2x2 inverse
function inverse2(rng: Rng) {
  for (;;) {
    const a = rng.int(-4, 9);
    const b = rng.intNonZero(-6, 6);
    const c = rng.intNonZero(-6, 6);
    const d = rng.int(-4, 9);
    const D = a * d - b * c;
    if (a === d || D === 0 || Math.abs(D) > 6) continue;
    const A = [
      [a, b],
      [c, d],
    ];
    const adj: FM = [
      [new Frac(d), new Frac(-b)],
      [new Frac(-c), new Frac(a)],
    ];
    const inv = mapF(adj, (x) => x.div(D));
    const ans = { key: encF(inv), text: m(matrix(inv)) };
    const mk = (mat: FM, why: string) => ({ key: encF(mat), text: m(matrix(mat)), why });
    const pool = [
      mk(mapF([[new Frac(a), new Frac(-b)], [new Frac(-c), new Frac(d)]], (x) => x.div(D)),
        `The off-diagonal entries were negated and everything was divided by the determinant, but the leading-diagonal entries ($${a}$ top-left, $${d}$ bottom-right) were **not swapped**.`),
      mk(mapF([[new Frac(d), new Frac(b)], [new Frac(c), new Frac(a)]], (x) => x.div(D)),
        `The leading-diagonal entries were swapped, but the off-diagonal entries (top-right $${b}$, bottom-left $${c}$) did **not change sign**.`),
      mk(adj, `This is the swapped-and-negated matrix, but it was **not divided by the determinant** $${D}$. Multiplying it by $A$ gives $${D === -1 ? '-I' : `${D}I`}$, not $I$.`),
      mk(mapF(adj, (x) => x.div(-D)), `This divides by $bc - ad = ${-D}$ instead of $ad - bc = ${D}$ (the determinant has the wrong sign), so every entry has the wrong sign.`),
      mk(mapF([[new Frac(d), new Frac(-c)], [new Frac(-b), new Frac(a)]], (x) => x.div(D)),
        `The off-diagonal entries were also **swapped** with each other. Only the leading-diagonal entries swap; the top-right and bottom-left entries stay where they are and just change sign.`),
      mk(mapF(adj, (x) => x.mul(D)), `This **multiplies** by the determinant $${D}$ instead of dividing by it.`),
    ];
    // Shuffle so that every kind of mistake (not just the first three) appears across variants.
    const ds = pickDistinct(ans, rng.shuffle(pool));
    if (ds.length < 3) continue;
    const scaleStep =
      D === 1
        ? `Divide by the determinant $1$, which changes nothing.`
        : D === -1
          ? `Divide by the determinant $-1$, which changes the sign of every entry:`
          : `Divide every entry by the determinant $${D}$:`;
    const factor = D === 1 ? '' : D === -1 ? '-' : `\\frac{1}{${D}}`.replace('\\frac{1}{-', '-\\frac{1}{');
    return {
      stem: `Find the inverse of $A = ${matrix(A)}$.`,
      answer: ans.text,
      answerValue: ans.key,
      distractors: ds.map((x) => ({ text: x.text, value: x.key, why: x.why })),
      solution:
        `For $A = ${matrix([['a', 'b'], ['c', 'd']])}$, $A^{-1} = \\frac{1}{ad - bc}${matrix([['d', '-b'], ['-c', 'a']])}$.\n\n` +
        `1. Determinant: $${num(a)} \\times ${paren(d)} - ${paren(b)} \\times ${paren(c)} = ${num(a * d)} - ${paren(b * c)} = ${D}$. It is not $0$, so $A^{-1}$ exists.\n` +
        `2. Swap $${a}$ and $${d}$, and change the signs of $${b}$ and $${c}$: $${matrix(adj)}$.\n` +
        `3. ${scaleStep}\n\n` +
        (D === 1 ? `$$A^{-1} = ${matrix(inv)}$$\n\n` : `$$A^{-1} = ${factor}${matrix(adj)} = ${matrix(inv)}$$\n\n`) +
        `Answer: ${ans.text}`,
      keyIdea: 'Inverse of a 2 by 2 matrix: swap a and d, change the signs of b and c, then divide every entry by ad minus bc.',
    };
  }
}

// ---------------------------------------------------------------- 3x3 determinant
const NZ = [-4, -3, -2, -1, 1, 2, 3, 4, 5];
function determinant3(rng: Rng) {
  for (;;) {
    const e = Array.from({ length: 9 }, () => rng.pick(NZ));
    const [a, b, c, d, f, g, hh, i, j] = e; // rows: a b c / d f g / hh i j
    const A = [
      [a, b, c],
      [d, f, g],
      [hh, i, j],
    ];
    const m1 = f * j - g * i;
    const m2 = d * j - g * hh;
    const m3 = d * i - f * hh;
    if (m1 === 0 || m2 === 0 || m3 === 0) continue;
    const t1 = a * m1;
    const t2 = b * m2;
    const t3 = c * m3;
    const D = t1 - t2 + t3;
    if (D !== det3(A) || D === 0 || Math.abs(D) > 150) continue;
    const ans = { key: String(D), text: m(num(D)) };
    const mk = (v: number, why: string) => ({ key: String(v), text: m(num(v)), v, why });
    const addMin = a * (f * j + g * i) - b * (d * j + g * hh) + c * (d * i + f * hh);
    const forward = a * f * j + b * g * hh + c * d * i;
    const pool = [
      mk(t1 + t2 + t3, `This forgets the **minus** sign on the middle term: it uses $+\\;+\\;+$ instead of the pattern $+\\;-\\;+$ along the first row.`),
      mk(addMin, `This **adds** the two products inside each $2 \\times 2$ minor instead of subtracting them (each minor is $ad - bc$).`),
      mk(-D, `This works out each $2 \\times 2$ minor in the wrong order ($bc - ad$), which flips the sign of the whole answer.`),
      mk(forward, `This adds only the three "downward" diagonal products of the rule of Sarrus and forgets to subtract the three "upward" ones.`),
      mk(t1, `This keeps only the first term of the expansion, $${num(a)} \\times ${paren(m1)}$, and forgets the other two entries of the row.`),
    ];
    const ds = pickDistinct(ans, pool);
    if (ds.length < 3) continue;
    const minor = (p: number, q: number, r: number, s: number, v: number) =>
      `${paren(p)} \\times ${paren(q)} - ${paren(r)} \\times ${paren(s)} = ${num(v)}`;
    return {
      stem: `Find $\\det(A)$ for $A = ${matrix(A)}$.`,
      answer: ans.text,
      answerValue: D,
      distractors: ds.map((x) => ({ text: x.text, value: x.v, why: x.why })),
      solution:
        `Expand along the first row with the sign pattern $+\\;-\\;+$:\n\n` +
        `$$\\det(A) = ${num(a)}\\begin{vmatrix} ${f} & ${g} \\\\ ${i} & ${j} \\end{vmatrix} - ${paren(b)}\\begin{vmatrix} ${d} & ${g} \\\\ ${hh} & ${j} \\end{vmatrix} + ${paren(c)}\\begin{vmatrix} ${d} & ${f} \\\\ ${hh} & ${i} \\end{vmatrix}$$\n\n` +
        `Work out each $2 \\times 2$ minor (cover the row and column of the entry, then $ad - bc$):\n\n` +
        `- $${minor(f, j, g, i, m1)}$\n` +
        `- $${minor(d, j, g, hh, m2)}$\n` +
        `- $${minor(d, i, f, hh, m3)}$\n\n` +
        `Combine:\n\n` +
        `$$\\det(A) = ${num(a)} \\times ${paren(m1)} - ${paren(b)} \\times ${paren(m2)} + ${paren(c)} \\times ${paren(m3)} = ${num(t1)} - ${paren(t2)} + ${paren(t3)} = ${num(D)}$$\n\n` +
        `Answer: ${ans.text}`,
      keyIdea: 'A 3 by 3 determinant is found by expanding along a row with signs plus, minus, plus, each entry times its 2 by 2 minor.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-determinants-inverses-inverse-2x2',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    title: 'Find the inverse of a 2 by 2 matrix',
    generate: inverse2,
  },
  {
    id: 'gen-determinants-inverses-det-3x3',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    title: 'Determinant of a 3 by 3 matrix',
    generate: determinant3,
  },
];
