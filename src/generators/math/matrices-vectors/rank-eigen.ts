import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { gcd } from '../../../lib/frac';
import { det3, rank } from '../../../lib/mathx';
import { m, dm, matrix, vec, paren, poly, sum, term } from '../../../lib/tex';

const L = '\\lambda';

/** "(\lambda - 3)" / "(\lambda + 2)" factor. */
const factor = (r: number) => `(${sum([[1, L], [-r, '']])})`;
/** Diagonal entry of A - λI: "5 - \lambda". */
const diagMinus = (a: number) => `${a} - ${L}`;

interface Mat2 {
  a: number;
  b: number;
  c: number;
  d: number;
  l1: number; // smaller eigenvalue
  l2: number; // larger eigenvalue
}

/** A 2x2 integer matrix with two distinct non-zero integer eigenvalues and non-zero off-diagonal entries. */
function makeMat2(rng: Rng): Mat2 {
  for (;;) {
    const e1 = rng.intNonZero(-5, 7);
    const e2 = rng.intNonZero(-5, 7);
    if (e1 === e2) continue;
    const s = e1 + e2;
    const p = e1 * e2;
    const a = rng.intNonZero(-4, 7);
    const d = s - a;
    if (d === 0 || Math.abs(d) > 9) continue;
    const q = a * d - p; // must equal b*c
    if (q === 0) continue;
    const divs: number[] = [];
    for (let k = 1; k <= 6; k++) if (q % k === 0 && Math.abs(q / k) <= 9) divs.push(k, -k);
    if (!divs.length) continue;
    const b = rng.pick(divs);
    const c = q / b;
    return { a, b, c, d, l1: Math.min(e1, e2), l2: Math.max(e1, e2) };
  }
}

const pairKey = (x: number, y: number) => [x, y].sort((u, v) => u - v).join(',');
const pairText = (x: number, y: number) => {
  const [u, v] = [x, y].sort((p, q) => p - q);
  return `${m(String(u))} and ${m(String(v))}`;
};

/** Integer roots of x^2 - s x + p = 0 if they are distinct integers, else null. */
function intRoots(s: number, p: number): [number, number] | null {
  const disc = s * s - 4 * p;
  if (disc <= 0) return null;
  const r = Math.round(Math.sqrt(disc));
  if (r * r !== disc || (s + r) % 2 !== 0) return null;
  return [(s - r) / 2, (s + r) / 2];
}

/** Normalise a 2-vector: divide by gcd, make the first non-zero entry positive. */
function normVec(v: [number, number]): [number, number] {
  const g = gcd(v[0], v[1]) || 1;
  let x = v[0] / g;
  let y = v[1] / g;
  if (x < 0 || (x === 0 && y < 0)) {
    x = -x;
    y = -y;
  }
  return [x + 0, y + 0];
}
/** "A - 3I", "A - I", "A + 2I", "A + I". */
const shiftA = (lam: number) => (lam > 0 ? `A - ${lam === 1 ? '' : lam}I` : `A + ${lam === -1 ? '' : -lam}I`);
const parallel = (u: [number, number], v: [number, number]) => u[0] * v[1] - u[1] * v[0] === 0;

/** Builds the eigenvalue question for one matrix, or null if it lacks three genuine-mistake distractors. */
function eigenvalueQuestion(mat: Mat2): GeneratedCore | null {
  const { a, b, c, d, l1, l2 } = mat;
  const s = a + d;
  const p = a * d - b * c;
  const A = matrix([[a, b], [c, d]]);
  const ansKey = pairKey(l1, l2);

  const pool: { x: number; y: number; why: string }[] = [];
  if (a !== d)
    pool.push({
      x: a,
      y: d,
      why: `These are the diagonal entries. Reading eigenvalues off the diagonal only works for a triangular or diagonal matrix, and here both off-diagonal entries are non-zero.`,
    });
  pool.push({
    x: -l1,
    y: -l2,
    why: `This is a sign slip: the characteristic equation is ${m(`${L}^2 - (\\text{trace})${L} + \\det = 0`)}. Using ${m(`+(\\text{trace})${L}`)} flips the sign of both roots.`,
  });
  if (s !== p)
    pool.push({
      x: s,
      y: p,
      why: `These are the trace (${m(String(s))}) and the determinant (${m(String(p))}). They are the **sum** and **product** of the eigenvalues, not the eigenvalues themselves.`,
    });
  const wrongDet = intRoots(s, a * d + b * c);
  if (wrongDet)
    pool.push({
      x: wrongDet[0],
      y: wrongDet[1],
      why: `This uses ${m('ad + bc')} for the determinant, giving ${m(`${poly([1, -s, a * d + b * c], L)} = 0`)}. The determinant is ${m('ad - bc')}.`,
    });
  pool.push({
    x: 2 * l1,
    y: 2 * l2,
    why: `This forgets to divide by ${m('2')} in the quadratic formula: ${m(`${L} = \\frac{${s} \\pm \\sqrt{${(l2 - l1) ** 2}}}{2} = \\frac{${s} \\pm ${l2 - l1}}{2}`)} gives ${m(String(l1))} and ${m(String(l2))}, but without the ${m('2')} underneath you get ${m(String(2 * l1))} and ${m(String(2 * l2))}.`,
  });
  pool.push({
    x: l1,
    y: -l2,
    why: `This makes a sign slip in one bracket when factorising: the factors are ${m(`${factor(l1)}${factor(l2)}`)}, so the roots are ${m(String(l1))} and ${m(String(l2))}.`,
  });
  pool.push({
    x: -l1,
    y: l2,
    why: `This makes a sign slip in one bracket when factorising: the factors are ${m(`${factor(l1)}${factor(l2)}`)}, so the roots are ${m(String(l1))} and ${m(String(l2))}.`,
  });

  const seen = new Set<string>([ansKey]);
  const distractors: { text: string; value: string; why: string }[] = [];
  for (const o of pool) {
    if (distractors.length === 3) break;
    if (o.x === o.y) continue;
    const k = pairKey(o.x, o.y);
    if (seen.has(k)) continue;
    seen.add(k);
    distractors.push({ text: pairText(o.x, o.y), value: k, why: o.why });
  }
  if (distractors.length < 3) return null;

  const answer = pairText(l1, l2);
  const charPoly = poly([1, -s, p], L);
  const solution =
    `Solve the characteristic equation ${m(`\\det(A - ${L} I) = 0`)}.` +
    dm(
      `\\begin{vmatrix} ${diagMinus(a)} & ${b} \\\\ ${c} & ${diagMinus(d)} \\end{vmatrix} = (${diagMinus(a)})(${diagMinus(d)}) - ${paren(b)} \\times ${paren(c)}`,
    ) +
    `Expand: ${m(`(${diagMinus(a)})(${diagMinus(d)}) = ${poly([1, -s, a * d], L)}`)} and ${m(`${paren(b)} \\times ${paren(c)} = ${b * c}`)}, so` +
    dm(`${charPoly} = 0`) +
    `(This is ${m(`${L}^2 - (\\text{trace})${L} + \\det`)} with trace ${m(`${a} + ${paren(d)} = ${s}`)} and determinant ${m(`${a * d} - ${paren(b * c)} = ${p}`)}.)\n\n` +
    `Factorise: ${m(`${factor(l1)}${factor(l2)} = 0`)}.\n\n` +
    `Check: ${m(`${l1} + ${paren(l2)} = ${s}`)} = trace and ${m(`${l1} \\times ${paren(l2)} = ${p}`)} = determinant.\n\n` +
    `Answer: ${answer}`;

  return {
    stem: `Find the eigenvalues of ${m(`A = ${A}`)}.`,
    answer,
    answerValue: ansKey,
    distractors,
    solution,
    keyIdea: `For a ${m('2 \\times 2')} matrix the eigenvalues solve ${m(`${L}^2 - (\\text{trace})${L} + \\det = 0`)}; check that they add to the trace and multiply to the determinant.`,
  };
}

export const generators: Generator[] = [
  // ------------------------------------------------------------------ eigenvalues of a 2x2
  {
    id: 'gen-rank-eigen-eigenvalues-2x2',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    title: 'Eigenvalues of a 2x2 matrix from the characteristic equation',
    generate(rng) {
      // Re-draw the matrix until three distinct distractors, each from a genuine mistake, exist.
      for (;;) {
        const built = eigenvalueQuestion(makeMat2(rng));
        if (built) return built;
      }
    },
  },
  // ------------------------------------------------------------------ eigenvector of a 2x2
  {
    id: 'gen-rank-eigen-eigenvector-2x2',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    title: 'Find an eigenvector for a given eigenvalue',
    generate(rng) {
      const { a, b, c, d, l1, l2 } = makeMat2(rng);
      const useFirst = rng.bool();
      const lam = useFirst ? l1 : l2;
      const other = useFirst ? l2 : l1;
      const A = matrix([[a, b], [c, d]]);
      // eigenvector from row 1 of (A - λI): (a-λ)x + b y = 0  ->  (x, y) = (b, λ - a)
      const raw: [number, number] = [b, lam - a];
      const v = normVec(raw);
      const w = normVec([b, other - a]);
      const vText = (u: [number, number]) => m(vec(u));
      const Au = (u: [number, number]) => vec([a * u[0] + b * u[1], c * u[0] + d * u[1]]);
      const times = (k: number) => (k === 1 ? '' : k === -1 ? '-' : paren(k));
      const ansKey = v.join(',');

      const pool: { u: [number, number]; why: string }[] = [
        {
          u: w,
          why: `This is an eigenvector for the **other** eigenvalue ${m(String(other))}: ${m(`A${vec(w)} = ${vec([a * w[0] + b * w[1], c * w[0] + d * w[1]])} = ${times(other)}${vec(w)}`)}.`,
        },
        {
          u: normVec([v[1], v[0]]),
          why: `This swaps ${m('x')} and ${m('y')} when solving ${m(`${sum([[a - lam, 'x'], [b, 'y']])} = 0`)}. Check: ${m(`A${vec(normVec([v[1], v[0]]))} = ${Au(normVec([v[1], v[0]]))}`)}, which is not a multiple of that vector.`,
        },
        {
          u: normVec([v[0], -v[1]]),
          why: `This is a sign slip when solving ${m(`${sum([[a - lam, 'x'], [b, 'y']])} = 0`)} for ${m('y')}. Check: ${m(`A${vec(normVec([v[0], -v[1]]))} = ${Au(normVec([v[0], -v[1]]))}`)}, which is not a multiple of that vector.`,
        },
        {
          u: normVec([a - lam, b]),
          why: `This takes the first row of ${m(`${shiftA(lam)}`)} itself as the eigenvector. The eigenvector must make that row give ${m('0')}, i.e. it is **perpendicular** to the row.`,
        },
        {
          u: [1, 0],
          why: `This assumes the standard basis vector is an eigenvector. ${m(vec([1, 0]))} is an eigenvector only when the bottom-left entry of ${m('A')} is ${m('0')}; here ${m(`A${vec([1, 0])} = ${vec([a, c])}`)}, which is not a multiple of ${m(vec([1, 0]))}.`,
        },
        {
          u: [0, 1],
          why: `This assumes the standard basis vector is an eigenvector. ${m(vec([0, 1]))} is an eigenvector only when the top-right entry of ${m('A')} is ${m('0')}; here ${m(`A${vec([0, 1])} = ${vec([b, d])}`)}, which is not a multiple of ${m(vec([0, 1]))}.`,
        },
      ];
      const chosen: [number, number][] = [v];
      const distractors: { text: string; value: string; why: string }[] = [];
      for (const o of pool) {
        if (distractors.length === 3) break;
        if (o.u[0] === 0 && o.u[1] === 0) continue;
        if (chosen.some((cv) => parallel(cv, o.u))) continue;
        chosen.push(o.u);
        distractors.push({ text: vText(o.u), value: o.u.join(','), why: o.why });
      }
      if (distractors.length < 3) throw new Error('eigenvector generator: not enough distractors');

      const Av = [a * v[0] + b * v[1], c * v[0] + d * v[1]];
      const g = gcd(raw[0], raw[1]);
      const rowEq = `${sum([[a - lam, 'x'], [b, 'y']])} = 0`;
      const solution =
        `Solve ${m(`(${shiftA(lam)})\\mathbf{v} = \\mathbf{0}`)} with ${m('\\mathbf{v} = (x, y)')}.` +
        dm(`${shiftA(lam)} = ${matrix([[a - lam, b], [c, d - lam]])}`) +
        `The first row gives ${m(rowEq)}. (The second row gives the same condition, because ${m(`\\det(${shiftA(lam)}) = 0`)}.)\n\n` +
        `One solution is ${m(`x = ${b}`)}, ${m(`y = ${lam - a}`)}: check ${m(`${paren(a - lam)} \\times ${paren(b)} + ${paren(b)} \\times ${paren(lam - a)} = 0`)}.\n\n` +
        (g !== 1 || raw[0] < 0
          ? `Any non-zero multiple is also an eigenvector, so simplify ${m(vec(raw))} to ${m(vec(v))}.\n\n`
          : '') +
        `Check: ${m(`A${vec(v)} = ${vec(Av)} = ${times(lam)}${vec(v)}`)}.\n\n` +
        `Answer: ${vText(v)}`;

      return {
        stem: `The matrix ${m(`A = ${A}`)} has eigenvalues ${m(String(l1))} and ${m(String(l2))}. Which vector is an eigenvector of ${m('A')} for the eigenvalue ${m(`${L} = ${lam}`)}?`,
        answer: vText(v),
        answerValue: ansKey,
        distractors,
        solution,
        keyIdea: `To find an eigenvector for ${m(L)}, solve ${m(`(A - ${L} I)\\mathbf{v} = \\mathbf{0}`)}; for a non-zero row ${m('(p, q)')} one solution is ${m('\\mathbf{v} = (q, -p)')}.`,
      };
    },
  },
  // ------------------------------------------------------------------ rank of a 3x3
  {
    id: 'gen-rank-eigen-rank-3x3',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    title: 'Rank of a 3x3 matrix',
    generate(rng) {
      const roll = rng.next();
      const target = roll < 0.3 ? 1 : roll < 0.75 ? 2 : 3;
      let rows: number[][] = [];
      let reason = '';
      const R = (i: number) => `R_{${i + 1}}`;
      const rowTex = (r: number[]) => `(${r.join(', ')})`;

      if (target === 1) {
        for (;;) {
          const v = [rng.int(-3, 4), rng.int(-3, 4), rng.int(-3, 4)];
          if (v.filter((x) => x !== 0).length < 2) continue;
          const mults = rng.sample([-3, -2, -1, 2, 3], 2);
          const us = rng.shuffle([1, ...mults]);
          rows = us.map((u) => v.map((x) => u * x));
          const base = us.indexOf(1);
          reason =
            `Every row is a multiple of ${m(`${R(base)} = ${rowTex(v)}`)}:\n\n` +
            us.map((u, i) => (i === base ? '' : `- ${m(`${R(i)} = ${rowTex(rows[i])} = ${term(u, R(base), true)}`)}\n`)).join('') +
            `\nSo only one row is independent: row reducing leaves one non-zero row and two zero rows. The rank is ${m('1')}.`;
          break;
        }
      } else if (target === 2) {
        for (;;) {
          const r1 = [rng.int(-3, 5), rng.int(-3, 5), rng.int(-3, 5)];
          const r2 = [rng.int(-3, 5), rng.int(-3, 5), rng.int(-3, 5)];
          if (rank([r1, r2]) !== 2) continue;
          if (r1.every((x) => x === 0) || r2.every((x) => x === 0)) continue;
          const al = rng.pick([-2, -1, 1, 2]);
          const be = rng.pick([-2, -1, 1, 2]);
          const r3 = r1.map((x, i) => al * x + be * r2[i]);
          if (r3.some((x) => Math.abs(x) > 15) || r3.every((x) => x === 0)) continue;
          // r3 must not be a plain multiple of a single row (keeps the question honest: a real combination)
          if (rank([r1, r3]) < 2 || rank([r2, r3]) < 2) continue;
          const pos = rng.int(0, 2); // where the combination row goes
          const others = [0, 1, 2].filter((i) => i !== pos);
          rows = [];
          rows[others[0]] = r1;
          rows[others[1]] = r2;
          rows[pos] = r3;
          reason =
            `Look for a row that is a combination of the other two:` +
            dm(`${sum([[al, R(others[0])], [be, R(others[1])]])} = ${rowTex(r1.map((x) => al * x))} + ${rowTex(r2.map((x) => be * x))} = ${rowTex(r3)} = ${R(pos)}`) +
            `So ${m(R(pos))} adds nothing new (and ${m('\\det = 0')}). But ${m(R(others[0]))} and ${m(R(others[1]))} are not multiples of each other, so two rows are independent. The rank is ${m('2')}.`;
          break;
        }
      } else {
        for (;;) {
          const cand = [0, 1, 2].map(() => [rng.int(-3, 5), rng.int(-3, 5), rng.int(-3, 5)]);
          const D = det3(cand);
          if (cand[0].some((v) => v === 0)) continue;
          if (D === 0 || Math.abs(D) > 120) continue;
          if (cand.some((r) => r.every((x) => x === 0))) continue;
          rows = cand;
          const [[p, q, r], [s, t, u], [x, y, z]] = cand;
          const m1 = t * z - u * y;
          const m2 = s * z - u * x;
          const m3 = s * y - t * x;
          reason =
            `Test the determinant (expand along row 1):` +
            dm(`\\det = ${p} \\times ${paren(m1)} - ${paren(q)} \\times ${paren(m2)} + ${paren(r)} \\times ${paren(m3)} = ${D}`) +
            `Since ${m(`\\det = ${D} \\ne 0`)}, no row is a combination of the others: all three rows are independent. The rank is ${m('3')}.`;
          break;
        }
      }
      if (rank(rows) !== target) throw new Error('rank generator: construction failed');

      const whyFor = (k: number): string => {
        if (k === 0) return `Rank ${m('0')} belongs only to the zero matrix. This matrix has non-zero entries, so its rank is at least ${m('1')}.`;
        if (k === 3)
          return `This assumes all three rows are independent because none of them is zero${target === 2 ? ' or a simple multiple of another' : ''}. But ${target === 1 ? 'every row is a multiple of the same row' : 'one row is a combination of the other two'}, so ${m('\\det = 0')} and the rank is less than ${m('3')}.`;
        if (k === 1)
          return target === 2
            ? `Rank ${m('1')} would need every row to be a multiple of a single row. Spotting one dependent row only removes one row; the other two are not multiples of each other.`
            : `Rank ${m('1')} would need every row to be a multiple of a single row, but ${m('\\det \\ne 0')} here, so all three rows are independent.`;
        // k === 2
        return target === 1
          ? `This stops after removing one dependent row. In fact **every** row is a multiple of the same row, so only one independent row remains.`
          : `Rank ${m('2')} would mean one row is a combination of the other two, which would make ${m('\\det = 0')}. Here the determinant is non-zero.`;
      };
      const distractors = [0, 1, 2, 3]
        .filter((k) => k !== target)
        .map((k) => ({ text: m(String(k)), value: k, why: whyFor(k) }));

      const answer = m(String(target));
      return {
        stem: `What is the rank of ${m(`A = ${matrix(rows)}`)}?`,
        answer,
        answerValue: target,
        distractors,
        solution:
          `The rank is the number of linearly independent rows. Label the rows ${m('R_{1}, R_{2}, R_{3}')}.\n\n` + reason + `\n\nAnswer: ${answer}`,
        keyIdea: 'Rank = number of linearly independent rows: look for rows that are multiples or combinations of others, or use the determinant (non-zero means full rank).',
      };
    },
  },
];
