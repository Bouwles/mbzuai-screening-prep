import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { matMul, type Mat } from '../../../lib/mathx';
import { m, matrix, num, paren, signed } from '../../../lib/tex';

/** Random rows x cols matrix with non-zero integer entries in [lo, hi]. */
function randMat(rng: Rng, rows: number, cols: number, lo = -5, hi = 6): Mat {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => rng.intNonZero(lo, hi)));
}

interface Cand {
  text: string;
  value: number | string;
  why: string;
}

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistractors(answerText: string, answerValue: number | string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (String(c.value) === String(answerValue) || c.text === answerText) continue;
    if (out.some((o) => String(o.value) === String(c.value) || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

const ord = (r: number, c: number) => m(`${r} \\times ${c}`);
const ordinal = (k: number) => ['first', 'second', 'third', 'fourth'][k - 1];

export const generators: Generator[] = [
  // ------------------------------------------------------------------ 1. one entry of a product
  {
    id: 'gen-matrix-operations-product-entry',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    title: 'Find one entry of a matrix product',
    generate(rng) {
      for (;;) {
        const rowsA = rng.int(2, 3);
        const inner = rng.int(2, 3);
        const colsB = rng.int(2, 3);
        const A = randMat(rng, rowsA, inner);
        const B = randMat(rng, inner, colsB);
        const i = rng.int(1, rowsA);
        const j = rng.int(1, colsB);
        const AB = matMul(A, B);
        const ans = AB[i - 1][j - 1];
        const rowI = A[i - 1];
        const colJ = B.map((r) => r[j - 1]);
        const prods = rowI.map((a, k) => a * colJ[k]);

        const pool: Cand[] = [];
        // swapped indices
        if (j <= rowsA && i <= colsB && i !== j)
          pool.push({
            text: m(num(AB[j - 1][i - 1])),
            value: AB[j - 1][i - 1],
            why: `This is the entry in row ${j}, column ${i}: the row and column numbers have been swapped. The first number is the row.`,
          });
        // dropped minus signs
        if (prods.some((p) => p < 0)) {
          const v = prods.reduce((s, p) => s + Math.abs(p), 0);
          pool.push({
            text: m(num(v)),
            value: v,
            why: 'This treats every product as positive, losing the minus signs. A negative times a positive is negative.',
          });
        }
        // BA instead of AB
        if (colsB === rowsA && i <= inner && j <= inner) {
          const BA = matMul(B, A);
          pool.push({
            text: m(num(BA[i - 1][j - 1])),
            value: BA[i - 1][j - 1],
            why: `This is the entry in row ${i}, column ${j} of $BA$, not $AB$. Matrix multiplication is not commutative, so the order matters.`,
          });
        }
        // row of A times ROW of B
        if (inner === colsB && j <= inner) {
          const v = rowI.reduce((s, a, k) => s + a * B[j - 1][k], 0);
          pool.push({
            text: m(num(v)),
            value: v,
            why: `This multiplies row ${i} of $A$ by **row** ${j} of $B$. Each entry of $AB$ uses a row of $A$ and a **column** of $B$.`,
          });
        }
        // forgot the last product
        {
          const v = ans - prods[prods.length - 1];
          pool.push({
            text: m(num(v)),
            value: v,
            why: `This leaves out the last product (${m(`${paren(rowI[inner - 1])} \\times ${paren(colJ[inner - 1])}`)}). There must be one product for every entry in the row.`,
          });
        }
        // added instead of multiplied
        {
          const v = rowI.reduce((s, a, k) => s + a + colJ[k], 0);
          pool.push({
            text: m(num(v)),
            value: v,
            why: 'This adds each pair of matching entries instead of multiplying them. The rule is: multiply matching entries, then add the products.',
          });
        }
        const answer = m(num(ans));
        const distractors = pickDistractors(answer, ans, pool);
        if (distractors.length < 3) continue;

        const expansion = rowI.map((a, k) => `${paren(a)} \\times ${paren(colJ[k])}`).join(' + ');
        const prodSum = prods.map((p, k) => (k === 0 ? num(p) : signed(p))).join('');
        return {
          stem:
            `Let $A = ${matrix(A)}$ and $B = ${matrix(B)}$.\n\n` +
            `What is the entry in row ${i}, column ${j} of the product $AB$?`,
          answer,
          answerValue: ans,
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution:
            `$A$ is ${ord(rowsA, inner)} and $B$ is ${ord(inner, colsB)}. The inner numbers match, so $AB$ is defined (it is ${ord(rowsA, colsB)}).\n\n` +
            `The entry in row ${i}, column ${j} uses the ${ordinal(i)} row of $A$ and the ${ordinal(j)} column of $B$:\n\n` +
            `- Row ${i} of $A$: ${m(rowI.map(num).join(',\\ '))}\n` +
            `- Column ${j} of $B$: ${m(colJ.map(num).join(',\\ '))}\n\n` +
            `Multiply matching entries and add:\n\n` +
            `$$(AB)_{${i}${j}} = ${expansion} = ${prodSum} = ${num(ans)}$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Entry $(i, j)$ of $AB$ is row $i$ of $A$ times column $j$ of $B$: multiply matching entries and add.',
        };
      }
    },
  },
  // ------------------------------------------------------------------ 2. kA + lB
  {
    id: 'gen-matrix-operations-linear-combination',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    title: 'Scalar multiples and sums of matrices',
    generate(rng) {
      for (;;) {
        const A = randMat(rng, 2, 2);
        const B = randMat(rng, 2, 2);
        const k = rng.int(2, 4);
        const l = rng.int(1, 3);
        const s = rng.pick([1, -1] as const);
        const comb = (ka: number, lb: number): Mat => A.map((r, x) => r.map((v, y) => ka * v + lb * B[x][y]));
        const res = comb(k, s * l);
        const J = (M: Mat) => JSON.stringify(M);
        const T = (M: Mat) => m(matrix(M));
        const op = s === 1 ? '+' : '-';
        const lB = l === 1 ? 'B' : `${l}B`;
        const expr = `${k}A ${op} ${lB}`;

        const pool: Cand[] = [];
        if (l !== k)
          pool.push({
            text: T(comb(k, s * k)),
            value: J(comb(k, s * k)),
            why: `This multiplies $B$ by ${k} as well, as if the expression were ${m(`${k}(A ${op} B)`)}. Only $A$ is multiplied by ${k}.`,
          });
        pool.push({
          text: T(comb(1, s * l)),
          value: J(comb(1, s * l)),
          why: `This forgets to multiply $A$ by ${k} before ${s === 1 ? 'adding' : 'subtracting'}.`,
        });
        pool.push({
          text: T(comb(k, -s * l)),
          value: J(comb(k, -s * l)),
          why: `This ${s === 1 ? 'subtracts' : 'adds'} ${m(lB)} instead of ${s === 1 ? 'adding' : 'subtracting'} it.`,
        });
        if (l !== 1)
          pool.push({
            text: T(comb(k, s)),
            value: J(comb(k, s)),
            why: `This forgets to multiply $B$ by ${l}.`,
          });
        // sign slip with negative entries of lB when subtracting: a - (-b) done as a - b
        if (s === -1 && B.flat().some((v) => v < 0)) {
          const slip = A.map((r, x) => r.map((v, y) => k * v - l * Math.abs(B[x][y])));
          pool.push({
            text: T(slip),
            value: J(slip),
            why: 'This slips on subtracting negative entries: subtracting a negative number means adding, e.g. $5 - (-2) = 7$.',
          });
        }
        // entries of kA added instead of multiplied: k + a
        {
          const slip = A.map((r, x) => r.map((v, y) => k + v + s * l * B[x][y]));
          pool.push({
            text: T(slip),
            value: J(slip),
            why: `This adds ${k} to each entry of $A$ instead of multiplying each entry by ${k}.`,
          });
        }
        const answer = T(res);
        const distractors = pickDistractors(answer, J(res), pool);
        if (distractors.length < 3) continue;

        const kA = A.map((r) => r.map((v) => k * v));
        const lBm = B.map((r) => r.map((v) => l * v));
        const work = kA.map((r, x) => r.map((v, y) => `${num(v)} ${op} ${paren(lBm[x][y])}`));
        return {
          stem: `Let $A = ${matrix(A)}$ and $B = ${matrix(B)}$. Find ${m(expr)}.`,
          answer,
          answerValue: J(res),
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution:
            'Scalar multiplication multiplies **every** entry; adding or subtracting matrices works entry by entry.\n\n' +
            `First, ${m(`${k}A = ${matrix(kA)}`)}` +
            (l === 1 ? '.\n\n' : ` and ${m(`${l}B = ${matrix(lBm)}`)}.\n\n`) +
            `Now ${s === 1 ? 'add' : 'subtract'} entry by entry:\n\n` +
            `$$${expr} = ${matrix(work)} = ${matrix(res)}$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Multiply every entry by the scalar, then add or subtract matching entries.',
        };
      }
    },
  },
  // ------------------------------------------------------------------ 3. order of a product with transposes
  {
    id: 'gen-matrix-operations-product-order',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    title: 'Order of a matrix product (with transposes)',
    generate(rng) {
      const [p, q, r] = rng.sample([2, 3, 4, 5, 6], 3);
      const kind = rng.pick(['AB', 'ATB', 'ABT', 'ABtransposed'] as const);
      // shapes of A and B, the expression, and the working
      let sa: [number, number];
      let sb: [number, number];
      let expr: string;
      let left: [number, number];
      let right: [number, number];
      let finalT = false;
      if (kind === 'AB') {
        sa = [p, q];
        sb = [q, r];
        expr = 'AB';
        left = sa;
        right = sb;
      } else if (kind === 'ATB') {
        sa = [q, p];
        sb = [q, r];
        expr = 'A^{T}B';
        left = [p, q];
        right = sb;
      } else if (kind === 'ABT') {
        sa = [p, q];
        sb = [r, q];
        expr = 'AB^{T}';
        left = sa;
        right = [q, r];
      } else {
        sa = [p, q];
        sb = [q, r];
        expr = '(AB)^{T}';
        left = sa;
        right = sb;
        finalT = true;
      }
      const prod: [number, number] = [left[0], right[1]];
      const res: [number, number] = finalT ? [prod[1], prod[0]] : prod;
      const key = (x: [number, number]) => `${x[0]}x${x[1]}`;
      const answer = ord(res[0], res[1]);

      const pool: Cand[] = [];
      pool.push({
        text: ord(res[1], res[0]),
        value: key([res[1], res[0]]),
        why: finalT
          ? `This is the order of $AB$ itself: it forgets that the final transpose swaps rows and columns.`
          : `This writes the order backwards. The product has the rows of the left matrix (${res[0]}) and the columns of the right matrix (${res[1]}).`,
      });
      pool.push({
        text: ord(left[1], right[0]),
        value: key([left[1], right[0]]),
        why: `This uses the **inner** numbers (${left[1]} and ${right[0]}). They only have to match; the outer numbers give the order.`,
      });
      if (kind === 'ATB' || kind === 'ABT')
        pool.push({
          text: `${m(expr)} is not defined`,
          value: 'undefined',
          why: `This forgets to transpose first: ${m('AB')} would be ${m(`(${sa[0]} \\times ${sa[1]})(${sb[0]} \\times ${sb[1]})`)}, which is not defined, but after transposing the inner numbers match.`,
        });
      else
        pool.push({
          text: `${m(expr)} is not defined`,
          value: 'undefined',
          why:
            `${m('AB')} is defined: $A$ has ${q} columns and $B$ has ${q} rows, and those are the numbers that must match.` +
            (finalT ? ' Every matrix has a transpose, so $(AB)^{T}$ is defined too.' : ''),
        });
      pool.push({
        text: ord(left[0], left[1]),
        value: key(left),
        why: 'This just copies the order of the left-hand matrix. A product takes its rows from the left matrix and its columns from the right matrix.',
      });
      const distractors = pickDistractors(answer, key(res), pool);

      const steps: string[] = [];
      if (kind === 'ATB') steps.push(`Transposing swaps rows and columns, so ${m('A^{T}')} is ${ord(p, q)}.`);
      if (kind === 'ABT') steps.push(`Transposing swaps rows and columns, so ${m('B^{T}')} is ${ord(q, r)}.`);
      const lName = kind === 'ATB' ? 'A^{T}' : 'A';
      const rName = kind === 'ABT' ? 'B^{T}' : 'B';
      steps.push(
        `Write the orders side by side: ${m(`${lName}${rName}`)} is ${m(`(${left[0]} \\times ${left[1]})(${right[0]} \\times ${right[1]})`)}. ` +
          `The inner numbers (${left[1]} and ${right[0]}) match, so the product is defined, and the outer numbers give ${ord(prod[0], prod[1])}.`,
      );
      if (finalT) steps.push(`Finally, transposing swaps rows and columns, so ${m('(AB)^{T}')} is ${ord(res[0], res[1])}. (This matches ${m('B^{T}A^{T}')}: ${m(`(${r} \\times ${q})(${q} \\times ${p})`)}.)`);
      return {
        stem: `$A$ is a ${ord(sa[0], sa[1])} matrix and $B$ is a ${ord(sb[0], sb[1])} matrix. What is the order of ${m(expr)}?`,
        answer,
        answerValue: key(res),
        distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution: steps.join('\n\n') + `\n\nAnswer: ${answer}`,
        keyIdea: '$(m \\times n)(n \\times p)$ gives $m \\times p$, and a transpose swaps the two numbers of an order.',
      };
    },
  },
];
