import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { matrix } from '../../../lib/tex';
import { det2, det3, inv2, matMul, rank, transpose, type Mat } from '../../../lib/mathx';

// String.raw keeps LaTeX backslashes as written; real line breaks come from L(...).
const t = String.raw;
const L = (...lines: string[]) => lines.join('\n');
const M = (rows: (number | Frac | string)[][]) => matrix(rows);
/** Encode a matrix of numbers/fractions as a comparable string, e.g. "3,-2,-7,5". */
const enc = (rows: (number | Frac)[][]) => rows.flat().map((x) => Frac.of(x).toString()).join(',');
const scale = (k: number, a: Mat): Mat => a.map((r) => r.map((v) => k * v));
const h = (n: number) => new Frac(n, 2);

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'determinants-inverses-001',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`Find the determinant of $A = ${M([[3, 5], [2, 4]])}$.`,
    options: ['$2$', '$22$', '$-2$', '$7$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`For a $2 \times 2$ matrix $${M([['a', 'b'], ['c', 'd']])}$ the determinant is`,
        '',
        t`$$\det = ad - bc$$`,
        '',
        t`(leading diagonal product **minus** the other diagonal product).`,
        '',
        t`Here $a = 3$, $b = 5$, $c = 2$, $d = 4$:`,
        '',
        t`$$\det(A) = 3 \times 4 - 5 \times 2 = 12 - 10 = 2$$`,
      ),
      whyWrong: [
        null,
        t`This is $12 + 10$: the two diagonal products were **added**. The determinant subtracts the second product: $ad - bc$.`,
        t`This is $bc - ad = 10 - 12$: the diagonals were subtracted in the wrong order. Always start with the leading diagonal (top-left times bottom-right).`,
        t`This is $3 + 4$, the sum of the leading diagonal (the trace), not the determinant.`,
      ],
      keyIdea: 'For a 2 by 2 matrix, the determinant is ad minus bc: leading diagonal product minus the other diagonal product.',
    },
    check: { optionValues: [2, 22, -2, 7], compute: () => det2([[3, 5], [2, 4]]) },
  },
  {
    id: 'determinants-inverses-002',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`For which value of $k$ is the matrix $${M([['k', 6], [2, 3]])}$ **singular** (not invertible)?`,
    options: ['$k = -4$', '$k = 4$', '$k = 9$', '$k = 0$'],
    correctIndex: 1,
    markScheme: {
      solution: L(
        'A matrix is singular exactly when its determinant is $0$.',
        '',
        t`$$\det = k \times 3 - 6 \times 2 = 3k - 12$$`,
        '',
        t`Set it equal to zero: $3k - 12 = 0$, so $3k = 12$ and $k = 4$.`,
        '',
        t`Check: $${M([[4, 6], [2, 3]])}$ has $\det = 12 - 12 = 0$. Notice the top row is exactly $2$ times the bottom row, which is what "singular" looks like.`,
      ),
      whyWrong: [
        t`This comes from writing the determinant as $3k + 12$, i.e. adding $bc$ instead of subtracting it.`,
        null,
        t`This comes from multiplying entries in the same **column** ($k \times 2 - 6 \times 3 = 0$) instead of along the diagonals.`,
        t`A zero entry does not make a matrix singular. With $k = 0$ the determinant is $0 - 12 = -12 \ne 0$, so the matrix is invertible.`,
      ],
      keyIdea: 'Singular means determinant equals zero, so set ad minus bc equal to 0 and solve for the unknown.',
    },
    check: {
      optionValues: [-4, 4, 9, 0],
      compute: () => {
        for (let k = -20; k <= 20; k++) if (det2([[k, 6], [2, 3]]) === 0) return k;
        return NaN;
      },
    },
  },
  {
    id: 'determinants-inverses-003',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`Find the inverse of $A = ${M([[5, 2], [7, 3]])}$.`,
    options: [
      `$${M([[5, -2], [-7, 3]])}$`,
      `$${M([[3, 2], [7, 5]])}$`,
      `$${M([[3, -2], [-7, 5]])}$`,
      `$${M([[3, -7], [-2, 5]])}$`,
    ],
    correctIndex: 2,
    markScheme: {
      solution: L(
        t`For $A = ${M([['a', 'b'], ['c', 'd']])}$:`,
        '',
        t`$$A^{-1} = \frac{1}{ad - bc}${M([['d', '-b'], ['-c', 'a']])}$$`,
        '',
        t`1. Determinant: $5 \times 3 - 2 \times 7 = 15 - 14 = 1$.`,
        t`2. Swap the leading-diagonal entries ($5$ and $3$) and change the sign of the other two ($2 \to -2$, $7 \to -7$): $${M([[3, -2], [-7, 5]])}$.`,
        t`3. Divide by the determinant, $1$, which changes nothing.`,
        '',
        t`Check: $${M([[5, 2], [7, 3]])}${M([[3, -2], [-7, 5]])} = ${M([[15 - 14, -10 + 10], [21 - 21, -14 + 15]])} = I$.`,
        '',
        t`So $A^{-1} = ${M([[3, -2], [-7, 5]])}$.`,
      ),
      whyWrong: [
        t`The off-diagonal signs were changed, but $5$ and $3$ were **not swapped**. Multiplying this by $A$ does not give $I$.`,
        t`The $5$ and $3$ were swapped, but the signs of $2$ and $7$ were **not changed**.`,
        null,
        t`The $2$ and $7$ were also swapped with each other. Only the leading-diagonal entries swap; the other two stay in place and just change sign.`,
      ],
      keyIdea: 'Inverse of a 2 by 2: swap a and d, change the signs of b and c, then divide by the determinant.',
    },
    check: {
      optionValues: ['5,-2,-7,3', '3,2,7,5', '3,-2,-7,5', '3,-7,-2,5'],
      compute: () => enc(inv2([[5, 2], [7, 3]])),
    },
  },
  {
    id: 'determinants-inverses-004',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`$A$ is a $3 \times 3$ matrix with $\det(A) = 5$. What is $\det(2A)$?`,
    options: ['$10$', '$40$', '$20$', '$30$'],
    correctIndex: 1,
    markScheme: {
      solution: L(
        t`Multiplying a matrix by $k$ multiplies **every row** by $k$. Each row multiplied by $k$ multiplies the determinant by $k$, so for an $n \times n$ matrix:`,
        '',
        t`$$\det(kA) = k^{n}\det(A)$$`,
        '',
        t`Here $n = 3$ and $k = 2$:`,
        '',
        t`$$\det(2A) = 2^{3} \times 5 = 8 \times 5 = 40$$`,
      ),
      whyWrong: [
        t`This is $2 \times 5$: the determinant was multiplied by $k$ only once. All three rows are doubled, so the factor is $2^{3}$.`,
        null,
        t`This uses $2^{2}$, the rule for a $2 \times 2$ matrix. For a $3 \times 3$ matrix the power is $3$.`,
        t`This multiplies by $2 \times 3 = 6$ (the scalar times the size) instead of $2^{3} = 8$.`,
      ],
      keyIdea: 'For an n by n matrix, det(kA) equals k to the power n times det(A), because every one of the n rows is scaled.',
    },
    check: {
      optionValues: [10, 40, 20, 30],
      compute: () => det3(scale(2, [[5, 1, 0], [0, 1, 2], [0, 0, 1]])),
    },
  },
  {
    id: 'determinants-inverses-005',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: 'Which one of these matrices is **singular**?',
    options: [
      `$${M([[0, 1], [1, 0]])}$`,
      `$${M([[2, -6], [1, 3]])}$`,
      `$${M([[4, 2], [2, 3]])}$`,
      `$${M([[2, 6], [1, 3]])}$`,
    ],
    correctIndex: 3,
    markScheme: {
      solution: L(
        'A matrix is singular when its determinant is $0$. Work out $ad - bc$ for each:',
        '',
        t`- $${M([[0, 1], [1, 0]])}$: $0 \times 0 - 1 \times 1 = -1$`,
        t`- $${M([[2, -6], [1, 3]])}$: $2 \times 3 - \left(-6\right) \times 1 = 6 + 6 = 12$`,
        t`- $${M([[4, 2], [2, 3]])}$: $4 \times 3 - 2 \times 2 = 12 - 4 = 8$`,
        t`- $${M([[2, 6], [1, 3]])}$: $2 \times 3 - 6 \times 1 = 6 - 6 = 0$`,
        '',
        t`Only $${M([[2, 6], [1, 3]])}$ has determinant $0$. Its top row is $2$ times its bottom row, so it is singular.`,
      ),
      whyWrong: [
        t`Zeros in a matrix do not make it singular. Its determinant is $0 \times 0 - 1 \times 1 = -1 \ne 0$, so it is invertible (it is its own inverse).`,
        t`The rows look like multiples, but the sign differs: $\left(2, -6\right)$ is not a multiple of $\left(1, 3\right)$. The determinant is $6 + 6 = 12$.`,
        t`Being symmetric has nothing to do with being singular. The determinant is $12 - 4 = 8 \ne 0$.`,
        null,
      ],
      keyIdea: 'A matrix is singular exactly when its determinant is 0, which for a 2 by 2 matrix means one row is a multiple of the other.',
    },
    check: {
      optionValues: ['0,1,1,0', '2,-6,1,3', '4,2,2,3', '2,6,1,3'],
      compute: () => {
        const cands: Mat[] = [[[0, 1], [1, 0]], [[2, -6], [1, 3]], [[4, 2], [2, 3]], [[2, 6], [1, 3]]];
        return enc(cands.find((a) => det2(a) === 0)!);
      },
    },
  },
  {
    id: 'determinants-inverses-006',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`Find $\det(A)$ for $A = ${M([[2, 5, -1], [0, 3, 4], [0, 0, -2]])}$.`,
    options: ['$3$', '$-12$', '$0$', '$12$'],
    correctIndex: 1,
    markScheme: {
      solution: L(
        'All the entries below the leading diagonal are $0$, so $A$ is **upper triangular**. The determinant of a triangular matrix is the product of its diagonal entries:',
        '',
        t`$$\det(A) = 2 \times 3 \times \left(-2\right) = -12$$`,
        '',
        'Check by expanding down the first column (only the top entry is non-zero):',
        '',
        t`$$\det(A) = 2 \times \left(3 \times \left(-2\right) - 4 \times 0\right) = 2 \times \left(-6\right) = -12$$`,
      ),
      whyWrong: [
        t`This is $2 + 3 + \left(-2\right)$: the diagonal entries were **added** (that is the trace). For a triangular matrix you **multiply** them.`,
        null,
        t`Zeros below the diagonal do not make the determinant $0$; a whole row or column of zeros would. Here the diagonal entries are all non-zero.`,
        t`The minus sign on the $-2$ was lost: $2 \times 3 \times 2 = 12$.`,
      ],
      keyIdea: 'The determinant of a triangular (or diagonal) matrix is the product of its diagonal entries.',
    },
    check: { optionValues: [3, -12, 0, 12], compute: () => det3([[2, 5, -1], [0, 3, 4], [0, 0, -2]]) },
  },
  {
    id: 'determinants-inverses-007',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`The system $2x + 3y = 7$, $x - 4y = -2$ is written as $AX = B$ with $X = ${M([['x'], ['y']])}$ and $B = ${M([[7], [-2]])}$. What is $A$?`,
    options: [
      `$${M([[2, 1], [3, -4]])}$`,
      `$${M([[2, 3], [1, 4]])}$`,
      `$${M([[2, 3], [1, -4]])}$`,
      `$${M([[2, 3, 7], [1, -4, -2]])}$`,
    ],
    correctIndex: 2,
    markScheme: {
      solution: L(
        'Each **row** of $A$ holds the coefficients of one equation, in the order $x$ then $y$:',
        '',
        t`- Row 1 from $2x + 3y = 7$: $\left(2, 3\right)$`,
        t`- Row 2 from $x - 4y = -2$: $\left(1, -4\right)$ (the $x$ has coefficient $1$, the $y$ has coefficient $-4$)`,
        '',
        t`Check by multiplying out: $${M([[2, 3], [1, -4]])}${M([['x'], ['y']])} = ${M([['2x + 3y'], ['x - 4y']])}$, which matches the left-hand sides.`,
        '',
        t`So $A = ${M([[2, 3], [1, -4]])}$.`,
      ),
      whyWrong: [
        t`The coefficients were written in **columns** instead of rows. Multiplying this by $X$ gives $2x + y$ on the top row, which is not the first equation.`,
        t`The minus sign of $-4y$ was dropped. The coefficient of $y$ in the second equation is $-4$.`,
        null,
        t`This is the **augmented** matrix $\left[A \mid B\right]$: it includes the right-hand sides. $A$ holds only the coefficients, and a $2 \times 3$ matrix cannot multiply the $2 \times 1$ vector $X$.`,
      ],
      keyIdea: 'In AX = B, each row of A lists the coefficients of one equation, with the variables in the same order as in X.',
    },
    check: {
      optionValues: ['2,1,3,-4', '2,3,1,4', '2,3,1,-4', '2,3,7,1,-4,-2'],
      compute: () => {
        // Left-hand sides of the two equations; column j of A is the LHS evaluated at the j-th unit vector.
        const eqs = [(x: number, y: number) => 2 * x + 3 * y, (x: number, y: number) => x - 4 * y];
        return enc(eqs.map((e) => [e(1, 0), e(0, 1)]));
      },
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'determinants-inverses-008',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`Find $\det(A)$ for $A = ${M([[2, 1, 3], [0, -1, 4], [1, 2, 1]])}$.`,
    options: ['$-19$', '$7$', '$11$', '$-11$'],
    correctIndex: 3,
    markScheme: {
      solution: L(
        t`Expand along the first row, using the sign pattern $+\;-\;+$:`,
        '',
        t`$$\det(A) = 2\begin{vmatrix} -1 & 4 \\ 2 & 1 \end{vmatrix} - 1\begin{vmatrix} 0 & 4 \\ 1 & 1 \end{vmatrix} + 3\begin{vmatrix} 0 & -1 \\ 1 & 2 \end{vmatrix}$$`,
        '',
        'Each small determinant is found by covering the row and column of that entry:',
        '',
        t`- $\left(-1\right) \times 1 - 4 \times 2 = -1 - 8 = -9$`,
        t`- $0 \times 1 - 4 \times 1 = -4$`,
        t`- $0 \times 2 - \left(-1\right) \times 1 = 0 + 1 = 1$`,
        '',
        t`$$\det(A) = 2\left(-9\right) - 1\left(-4\right) + 3\left(1\right) = -18 + 4 + 3 = -11$$`,
        '',
        t`Check with the rule of Sarrus: down-diagonals $2 \times \left(-1\right) \times 1 + 1 \times 4 \times 1 + 3 \times 0 \times 2 = 2$; up-diagonals $3 \times \left(-1\right) \times 1 + 2 \times 4 \times 2 + 1 \times 0 \times 1 = 13$; $2 - 13 = -11$.`,
      ),
      whyWrong: [
        t`This forgets the **minus** sign on the middle term: $-18 + 1\left(-4\right) + 3 = -19$. The signs along the first row are $+\;-\;+$.`,
        t`This adds the products inside each $2 \times 2$ minor instead of subtracting them: $2\left(-1 + 8\right) - 1\left(0 + 4\right) + 3\left(0 - 1\right) = 14 - 4 - 3 = 7$.`,
        t`This works out every $2 \times 2$ minor as $bc - ad$ (wrong order), which flips the sign of the whole answer.`,
        null,
      ],
      keyIdea: 'Expand a 3 by 3 determinant along a row with signs plus, minus, plus, multiplying each entry by the 2 by 2 determinant left when its row and column are covered.',
    },
    check: { optionValues: [-19, 7, 11, -11], compute: () => det3([[2, 1, 3], [0, -1, 4], [1, 2, 1]]) },
  },
  {
    id: 'determinants-inverses-009',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`Find $A^{-1}$ for $A = ${M([[3, 4], [1, 2]])}$.`,
    options: [
      `$${M([[1, -2], [h(-1), h(3)]])}$`,
      `$${M([[2, -4], [-1, 3]])}$`,
      `$${M([[h(3), -2], [h(-1), 1]])}$`,
      `$${M([[4, -8], [-2, 6]])}$`,
    ],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`1. Determinant: $3 \times 2 - 4 \times 1 = 6 - 4 = 2$ (not zero, so $A^{-1}$ exists).`,
        t`2. Swap $3$ and $2$, change the signs of $4$ and $1$: $${M([[2, -4], [-1, 3]])}$.`,
        t`3. Divide every entry by the determinant $2$:`,
        '',
        t`$$A^{-1} = \frac{1}{2}${M([[2, -4], [-1, 3]])} = ${M([[1, -2], [h(-1), h(3)]])}$$`,
        '',
        t`Check: $${M([[3, 4], [1, 2]])}${M([[1, -2], [h(-1), h(3)]])} = ${M([['3 - 2', '-6 + 6'], ['1 - 1', '-2 + 3']])} = ${M([[1, 0], [0, 1]])}$.`,
      ),
      whyWrong: [
        null,
        t`This is the swapped-and-negated matrix, but it was **not divided by the determinant** $2$. Multiplying it by $A$ gives $2I$, not $I$.`,
        t`This was divided by $2$, but $3$ and $2$ were **not swapped**.`,
        t`This **multiplies** by the determinant instead of dividing by it. Multiplying it by $A$ gives $4I$.`,
      ],
      keyIdea: 'The inverse of a 2 by 2 matrix is one over the determinant times the swapped-and-negated matrix; check by multiplying back to get I.',
    },
    check: {
      optionValues: [enc([[1, -2], [h(-1), h(3)]]), '2,-4,-1,3', enc([[h(3), -2], [h(-1), 1]]), '4,-8,-2,6'],
      compute: () => enc(inv2([[3, 4], [1, 2]])),
    },
  },
  {
    id: 'determinants-inverses-010',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`Let $A = ${M([[2, 1], [1, 3]])}$ and $B = ${M([[1, 4], [-1, 2]])}$. What is $\det(AB)$?`,
    options: ['$11$', '$30$', '$16$', '$15$'],
    correctIndex: 1,
    markScheme: {
      solution: L(
        t`Use the product rule $\det(AB) = \det(A)\det(B)$, so you never need to multiply the matrices.`,
        '',
        t`- $\det(A) = 2 \times 3 - 1 \times 1 = 5$`,
        t`- $\det(B) = 1 \times 2 - 4 \times \left(-1\right) = 2 + 4 = 6$`,
        '',
        t`$$\det(AB) = 5 \times 6 = 30$$`,
        '',
        t`Check the long way: $AB = ${M([[1, 10], [-2, 10]])}$ and $1 \times 10 - 10 \times \left(-2\right) = 10 + 20 = 30$.`,
      ),
      whyWrong: [
        t`This **adds** the determinants, $5 + 6$. The rule for a product is $\det(AB) = \det A \times \det B$.`,
        null,
        t`This multiplies matching entries ($2 \times 1$, $1 \times 4$, ...) to get $${M([[2, 4], [-1, 6]])}$, whose determinant is $16$. Matrix multiplication is rows times columns, not entry by entry.`,
        t`This is $\det(A + B)$: $A + B = ${M([[3, 5], [0, 5]])}$ has determinant $15$. The question asks for the product $AB$.`,
      ],
      keyIdea: 'The determinant of a product is the product of the determinants: det(AB) = det(A) det(B).',
    },
    check: { optionValues: [11, 30, 16, 15], compute: () => det2(matMul([[2, 1], [1, 3]], [[1, 4], [-1, 2]])) },
  },
  {
    id: 'determinants-inverses-011',
    subtopic: 'determinants-inverses',
    difficulty: 'challenge',
    stem: t`$A$ and $B$ are $3 \times 3$ matrices with $\det(A) = 3$ and $\det(B) = -6$. Find $\det\left(2A^{T}B^{-1}\right)$.`,
    options: ['$-1$', '$-144$', '$-4$', '$-2$'],
    correctIndex: 2,
    markScheme: {
      solution: L(
        'Use four rules, one at a time:',
        '',
        t`- $\det(kM) = k^{n}\det(M)$, with $n = 3$, so the scalar $2$ gives a factor $2^{3} = 8$`,
        t`- $\det(PQ) = \det(P)\det(Q)$`,
        t`- $\det\left(A^{T}\right) = \det(A) = 3$`,
        t`- $\det\left(B^{-1}\right) = \frac{1}{\det(B)} = -\frac{1}{6}$`,
        '',
        'Put them together:',
        '',
        t`$$\det\left(2A^{T}B^{-1}\right) = 2^{3} \times 3 \times \left(-\frac{1}{6}\right) = -\frac{24}{6} = -4$$`,
      ),
      whyWrong: [
        t`This uses the factor $2$ instead of $2^{3}$: $2 \times 3 \times \left(-\frac{1}{6}\right) = -1$. Scaling a $3 \times 3$ matrix by $2$ scales all three rows.`,
        t`This uses $\det B = -6$ instead of $\det\left(B^{-1}\right) = -\frac{1}{6}$: $8 \times 3 \times \left(-6\right) = -144$.`,
        null,
        t`This uses $2^{2} = 4$ (the $2 \times 2$ rule): $4 \times 3 \times \left(-\frac{1}{6}\right) = -2$. For $3 \times 3$ matrices the power is $3$.`,
      ],
      keyIdea: 'Break the expression into pieces: scalars give k to the power n, transposes change nothing, inverses give 1 over the determinant, and products multiply.',
    },
    check: {
      optionValues: [-1, -144, -4, -2],
      compute: () => {
        const A: Mat = [[3, 1, 2], [0, 1, 4], [0, 0, 1]]; // det 3
        const Binv: Mat = [[-1 / 6, 0, 0], [0, 1, 0], [0, 0, 1]]; // inverse of diag(-6, 1, 1)
        return det3(matMul(scale(2, transpose(A)), Binv));
      },
    },
  },
  {
    id: 'determinants-inverses-012',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`The system $3x - 2y = 5$, $6x + ky = 12$ has **no solution**. What is $k$?`,
    options: ['$k = -4$', '$k = 4$', '$k = -2$', t`any $k$ except $-4$`],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`Write it as $AX = B$ with $A = ${M([[3, -2], [6, 'k']])}$. A system with no solution cannot have a unique solution, so $\det(A)$ must be $0$:`,
        '',
        t`$$\det(A) = 3k - \left(-2\right) \times 6 = 3k + 12 = 0 \quad\Rightarrow\quad k = -4$$`,
        '',
        t`Now check the constants. With $k = -4$ the second equation is $6x - 4y = 12$. Doubling the first equation gives $6x - 4y = 10$. The same left-hand side cannot equal both $12$ and $10$, so there is **no solution** (parallel lines).`,
        '',
        t`So $k = -4$.`,
      ),
      whyWrong: [
        null,
        t`This comes from losing the minus sign of $-2$ and writing the determinant as $3k - 12$.`,
        t`This makes the $y$-coefficients match ($-2$ and $-2$), but the $x$-coefficient doubled from $3$ to $6$, so the $y$-coefficient must double too: $-4$. With $k = -2$ the determinant is $-6 + 12 = 6 \ne 0$ and there is exactly one solution.`,
        t`This is the condition for exactly **one** solution ($\det \ne 0$). The question asks when there is **no** solution.`,
      ],
      keyIdea: 'No solution or infinitely many needs det = 0; then compare the constants to decide which one it is.',
    },
    check: {
      optionValues: [-4, 4, -2, null],
      compute: () => {
        for (let k = -20; k <= 20; k++) {
          const A: Mat = [[3, -2], [6, k]];
          const aug: Mat = [[3, -2, 5], [6, k, 12]];
          if (det2(A) === 0 && rank(A) < rank(aug)) return k;
        }
        return NaN;
      },
    },
  },
  {
    id: 'determinants-inverses-013',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`Solve $AX = B$, where $A = ${M([[2, 1], [5, 3]])}$, $X = ${M([['x'], ['y']])}$ and $B = ${M([[4], [11]])}$.`,
    options: ['$x = -3$, $y = 13$', '$x = 19$, $y = 53$', '$x = 23$, $y = 42$', '$x = 1$, $y = 2$'],
    correctIndex: 3,
    markScheme: {
      solution: L(
        t`Multiply both sides on the **left** by $A^{-1}$: $X = A^{-1}B$.`,
        '',
        t`1. $\det(A) = 2 \times 3 - 1 \times 5 = 1$.`,
        t`2. Swap $2$ and $3$, change the signs of $1$ and $5$, and divide by $1$: $A^{-1} = ${M([[3, -1], [-5, 2]])}$.`,
        t`3. $X = ${M([[3, -1], [-5, 2]])}${M([[4], [11]])} = ${M([['12 - 11'], ['-20 + 22']])} = ${M([[1], [2]])}$.`,
        '',
        t`Check in the original equations: $2(1) + 2 = 4$ and $5(1) + 3(2) = 11$. Both work, so $x = 1$, $y = 2$.`,
      ),
      whyWrong: [
        t`This uses $${M([[2, -1], [-5, 3]])}$ as the inverse: the signs were changed but $2$ and $3$ were not swapped.`,
        t`This is $AB$, not $A^{-1}B$: the matrix was multiplied by $B$ instead of being inverted first.`,
        t`This uses $${M([[3, 1], [5, 2]])}$ as the inverse: $2$ and $3$ were swapped but the signs of $1$ and $5$ were not changed.`,
        null,
      ],
      keyIdea: 'If AX = B and A is invertible, then X = A inverse times B, with A inverse on the left.',
    },
    check: {
      optionValues: ['-3,13', '19,53', '23,42', '1,2'],
      compute: () => {
        const Ai = inv2([[2, 1], [5, 3]]);
        const b = [4, 11];
        return Ai.map((row) => row[0].mul(b[0]).add(row[1].mul(b[1])).toString()).join(',');
      },
    },
  },
  {
    id: 'determinants-inverses-014',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`For which value of $k$ is $${M([[1, 2, 'k'], [0, 1, 2], [2, 1, 4]])}$ singular?`,
    options: ['$k = 5$', '$k = -3$', '$k = -5$', '$k = 1$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`Expand along the first row with signs $+\;-\;+$:`,
        '',
        t`$$\det = 1\begin{vmatrix} 1 & 2 \\ 1 & 4 \end{vmatrix} - 2\begin{vmatrix} 0 & 2 \\ 2 & 4 \end{vmatrix} + k\begin{vmatrix} 0 & 1 \\ 2 & 1 \end{vmatrix}$$`,
        '',
        t`- $1 \times 4 - 2 \times 1 = 2$`,
        t`- $0 \times 4 - 2 \times 2 = -4$`,
        t`- $0 \times 1 - 1 \times 2 = -2$`,
        '',
        t`$$\det = 1(2) - 2\left(-4\right) + k\left(-2\right) = 2 + 8 - 2k = 10 - 2k$$`,
        '',
        t`Singular means $\det = 0$: $10 - 2k = 0$, so $k = 5$.`,
      ),
      whyWrong: [
        null,
        t`This forgets the minus sign on the middle term: $2 + 2\left(-4\right) - 2k = -6 - 2k = 0$ gives $k = -3$.`,
        t`This works out the last minor in the wrong order ($bc - ad$), getting $2$ instead of $-2$, so $10 + 2k = 0$ and $k = -5$.`,
        t`This adds inside every minor instead of subtracting: $1(4 + 2) - 2(0 + 4) + k(0 + 2) = 2k - 2 = 0$ gives $k = 1$.`,
      ],
      keyIdea: 'Find the 3 by 3 determinant in terms of k by cofactor expansion, then set it equal to 0.',
    },
    check: {
      optionValues: [5, -3, -5, 1],
      compute: () => {
        for (let k = -20; k <= 20; k++) if (det3([[1, 2, k], [0, 1, 2], [2, 1, 4]]) === 0) return k;
        return NaN;
      },
    },
  },
  {
    id: 'determinants-inverses-015',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`$A$ is a $3 \times 3$ matrix with $\det(A) = 0$ and $B$ is a $3 \times 1$ column vector. Which statement about the system $AX = B$ is true?`,
    options: [
      t`It has exactly one solution, $X = A^{-1}B$.`,
      'It has either no solution or infinitely many solutions, depending on $B$.',
      'It never has a solution.',
      'It always has infinitely many solutions.',
    ],
    correctIndex: 1,
    markScheme: {
      solution: L(
        t`- If $\det(A) \ne 0$, $A^{-1}$ exists and $X = A^{-1}B$ is the **one and only** solution.`,
        t`- If $\det(A) = 0$, $A^{-1}$ does not exist and there can never be exactly one solution.`,
        '',
        t`When $\det(A) = 0$, what happens depends on $B$:`,
        '',
        t`- if the equations contradict each other (like $x + y = 1$ and $x + y = 2$), there is **no solution**;`,
        t`- if one equation is just a combination of the others, there are **infinitely many** solutions.`,
        '',
        t`For example, with $A = ${M([[1, 1, 1], [1, 1, 1], [0, 0, 1]])}$ (determinant $0$), $B = ${M([[1], [2], [0]])}$ gives no solution while $B = ${M([[1], [1], [0]])}$ gives infinitely many.`,
        '',
        'So the system has either no solution or infinitely many, depending on $B$.',
      ),
      whyWrong: [
        t`$A^{-1}$ only exists when $\det A \ne 0$. With $\det A = 0$ you cannot write $X = A^{-1}B$, and there is never exactly one solution.`,
        null,
        t`This forgets the consistent case. For example, $B = 0$ always has at least the solution $X = 0$, and when $\det A = 0$ it then has infinitely many.`,
        t`This forgets the inconsistent case, where two equations contradict each other (same left-hand side, different right-hand sides), giving no solution.`,
      ],
      keyIdea: 'det(A) not zero means exactly one solution; det(A) = 0 means no solution or infinitely many, and the constants decide which.',
    },
  },
  {
    id: 'determinants-inverses-016',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`For which values of $k$ is $${M([['k', 2], [3, 'k - 1']])}$ **not** invertible?`,
    options: ['$k = -3$ or $k = 2$', '$k = 0$ or $k = 1$', '$k = 3$ or $k = -2$', 'There is no such value of $k$'],
    correctIndex: 2,
    markScheme: {
      solution: L(
        'Not invertible means the determinant is $0$:',
        '',
        t`$$\det = k(k - 1) - 2 \times 3 = k^{2} - k - 6$$`,
        '',
        t`Solve $k^{2} - k - 6 = 0$. Factorise: two numbers that multiply to $-6$ and add to $-1$ are $-3$ and $2$, so`,
        '',
        t`$$(k - 3)(k + 2) = 0 \quad\Rightarrow\quad k = 3 \text{ or } k = -2$$`,
        '',
        t`Check $k = -2$: $${M([[-2, 2], [3, -3]])}$ has $\det = 6 - 6 = 0$. Check $k = 3$: $${M([[3, 2], [3, 2]])}$ has two equal rows, so $\det = 0$.`,
      ),
      whyWrong: [
        t`This has the signs of the roots the wrong way round: $(k - 3)(k + 2) = 0$ gives $k = 3$ and $k = -2$, not $-3$ and $2$.`,
        t`This sets only $k(k - 1) = 0$ and forgets to subtract $bc = 2 \times 3 = 6$.`,
        null,
        t`This comes from **adding** $bc$: $k^{2} - k + 6 = 0$ has no real roots. The determinant is $ad - bc$, so the $6$ is subtracted.`,
      ],
      keyIdea: 'A matrix with an unknown is not invertible when its determinant, often a quadratic in k, equals 0.',
    },
    check: {
      optionValues: ['-3,2', '0,1', '-2,3', 'none'],
      compute: () => {
        const roots: number[] = [];
        for (let k = -50; k <= 50; k++) if (det2([[k, 2], [3, k - 1]]) === 0) roots.push(k);
        return roots.length ? roots.join(',') : 'none';
      },
    },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'determinants-inverses-017',
    subtopic: 'determinants-inverses',
    difficulty: 'challenge',
    stem: L(
      'Consider the system',
      '',
      t`$$x + y + z = 1, \qquad x + 2y + 3z = 2, \qquad x + 3y + kz = 3$$`,
      '',
      t`There is exactly one value of $k$ for which the system does **not** have a unique solution. What is that value, and how many solutions are there then?`,
    ),
    options: [
      '$k = 5$; infinitely many solutions',
      '$k = 5$; no solution',
      t`$k = \frac{9}{2}$; infinitely many solutions`,
      '$k = 7$; infinitely many solutions',
    ],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`**Step 1: find when $\det(A) = 0$.** With $A = ${M([[1, 1, 1], [1, 2, 3], [1, 3, 'k']])}$, expand along the first row:`,
        '',
        t`$$\det(A) = 1(2k - 9) - 1(k - 3) + 1(3 - 2) = 2k - 9 - k + 3 + 1 = k - 5$$`,
        '',
        t`So the solution is not unique exactly when $k = 5$.`,
        '',
        t`**Step 2: decide between none and infinitely many.** Put $k = 5$ and subtract the first equation from the other two:`,
        '',
        t`- Equation 2 minus equation 1: $y + 2z = 1$`,
        t`- Equation 3 minus equation 1: $2y + 4z = 2$`,
        '',
        t`The second is exactly twice the first, so there is no contradiction: only two independent equations for three unknowns. Pick any $z$, then $y = 1 - 2z$ and $x = 1 - y - z = z$. That is **infinitely many** solutions.`,
        '',
        t`So $k = 5$, with infinitely many solutions.`,
      ),
      whyWrong: [
        null,
        t`$\det A = 0$ does not automatically mean "no solution". You must check the constants: here equation 3 minus equation 1 is exactly twice equation 2 minus equation 1, so the system is consistent.`,
        t`This keeps only the first term of the expansion, $2k - 9 = 0$, and forgets the other two terms.`,
        t`This works out the last minor as $1 \times 2 - 1 \times 3 = -1$ instead of $1 \times 3 - 2 \times 1 = 1$, giving $\det = k - 7$.`,
      ],
      keyIdea: 'Find the parameter value that makes det = 0, then substitute it back and use elimination to see whether the equations are consistent.',
    },
    check: {
      optionValues: ['5,inf', '5,none', '4.5,inf', '7,inf'],
      compute: () => {
        for (let k2 = -40; k2 <= 40; k2++) {
          const k = k2 / 2;
          const A: Mat = [[1, 1, 1], [1, 2, 3], [1, 3, k]];
          if (det3(A) !== 0) continue;
          const aug: Mat = A.map((r, i) => [...r, [1, 2, 3][i]]);
          return `${k},${rank(A) === rank(aug) ? 'inf' : 'none'}`;
        }
        return 'unique';
      },
    },
  },
  {
    id: 'determinants-inverses-018',
    subtopic: 'determinants-inverses',
    difficulty: 'challenge',
    stem: t`$A$ is an **invertible** $2 \times 2$ matrix with $A^{2} = 3A$. What is $\det(A)$?`,
    options: ['$3$', '$0$', '$27$', '$9$'],
    correctIndex: 3,
    markScheme: {
      solution: L(
        '**Method 1 (determinants).** Take the determinant of both sides of $A^{2} = 3A$:',
        '',
        t`- Left: $\det\left(A^{2}\right) = \det(A)\det(A) = \det(A)^{2}$`,
        t`- Right: $\det(3A) = 3^{2}\det(A) = 9\det(A)$ (a $2 \times 2$ matrix has two rows to scale)`,
        '',
        t`So $\det(A)^{2} = 9\det(A)$, i.e. $\det(A)\left(\det(A) - 9\right) = 0$. Because $A$ is invertible, $\det(A) \ne 0$, so $\det(A) = 9$.`,
        '',
        t`**Method 2 (inverse).** Multiply $A^{2} = 3A$ on the left by $A^{-1}$: $A = 3I = ${M([[3, 0], [0, 3]])}$, so $\det(A) = 3 \times 3 = 9$.`,
      ),
      whyWrong: [
        t`This uses $\det(3A) = 3\det A$, forgetting the power: for a $2 \times 2$ matrix it is $3^{2}\det A$.`,
        t`This is the other root of $\det A\left(\det A - 9\right) = 0$, but an invertible matrix cannot have determinant $0$.`,
        t`This uses $3^{3}$, the factor for a $3 \times 3$ matrix. $A$ is $2 \times 2$, so the factor is $3^{2}$.`,
        null,
      ],
      keyIdea: 'Taking determinants turns a matrix equation into a number equation; remember det(kA) = k to the n times det(A) and that invertible means det is not 0.',
    },
    check: {
      optionValues: [3, 0, 27, 9],
      compute: () => {
        // A^2 = 3A with A invertible forces A = 3I; confirm the equation holds, then take det.
        const A: Mat = [[3, 0], [0, 3]];
        const ok = JSON.stringify(matMul(A, A)) === JSON.stringify(scale(3, A)) && det2(A) !== 0;
        return ok ? det2(A) : NaN;
      },
    },
  },
  {
    id: 'determinants-inverses-019',
    subtopic: 'determinants-inverses',
    difficulty: 'challenge',
    stem: t`Given that $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = 5$, find $\begin{vmatrix} 2a & 2b \\ c - 3a & d - 3b \end{vmatrix}$.`,
    options: ['$20$', '$10$', '$-30$', '$5$'],
    correctIndex: 1,
    markScheme: {
      solution: L(
        'Expand directly with $ad - bc$:',
        '',
        t`$$2a(d - 3b) - 2b(c - 3a) = 2ad - 6ab - 2bc + 6ab = 2(ad - bc)$$`,
        '',
        t`The $6ab$ terms cancel, leaving $2(ad - bc) = 2 \times 5 = 10$.`,
        '',
        'The row-operation view gives the same answer quickly:',
        '',
        t`- Multiplying **one row** by $2$ multiplies the determinant by $2$.`,
        t`- Subtracting a multiple of one row from another row does **not** change the determinant.`,
        '',
        'So the new determinant is $2 \times 5 = 10$.',
      ),
      whyWrong: [
        t`This uses $\det(2A) = 2^{2}\det A$, but only **one** row was doubled, not the whole matrix.`,
        null,
        t`This treats "subtract $3$ times row 1" as multiplying the determinant by $-3$. Adding or subtracting a multiple of another row leaves the determinant unchanged.`,
        t`This assumes no row operation changes the determinant. Subtracting a multiple of a row does not, but doubling a row does multiply it by $2$.`,
      ],
      keyIdea: 'Scaling one row by k scales the determinant by k, but adding a multiple of one row to another leaves it unchanged.',
    },
    check: {
      optionValues: [20, 10, -30, 5],
      compute: () => {
        const [a, b, c, d] = [3, 2, 2, 3]; // ad - bc = 5
        if (det2([[a, b], [c, d]]) !== 5) return NaN;
        return det2([[2 * a, 2 * b], [c - 3 * a, d - 3 * b]]);
      },
    },
  },
  {
    id: 'determinants-inverses-020',
    subtopic: 'determinants-inverses',
    difficulty: 'challenge',
    stem: t`Let $A = ${M([[1, 2], [1, 3]])}$ and $B = ${M([[2, 5], [1, 4]])}$. Find the matrix $X$ such that $XA = B$.`,
    options: [
      `$${M([[4, 7], [-1, -1]])}$`,
      `$${M([[7, 19], [5, 14]])}$`,
      `$${M([[1, 1], [-1, 2]])}$`,
      `$${M([[-3, 11], [-3, 10]])}$`,
    ],
    correctIndex: 2,
    markScheme: {
      solution: L(
        t`$A$ is on the **right** of $X$, so multiply both sides on the **right** by $A^{-1}$: $XAA^{-1} = BA^{-1}$, so $X = BA^{-1}$.`,
        '',
        t`**Step 1.** $\det(A) = 1 \times 3 - 2 \times 1 = 1$, so $A^{-1} = ${M([[3, -2], [-1, 1]])}$.`,
        '',
        t`**Step 2.** $X = BA^{-1} = ${M([[2, 5], [1, 4]])}${M([[3, -2], [-1, 1]])}$, row by column:`,
        '',
        t`- Row 1: $\left(2 \times 3 + 5 \times \left(-1\right),\ 2 \times \left(-2\right) + 5 \times 1\right) = \left(1, 1\right)$`,
        t`- Row 2: $\left(1 \times 3 + 4 \times \left(-1\right),\ 1 \times \left(-2\right) + 4 \times 1\right) = \left(-1, 2\right)$`,
        '',
        t`Check: $XA = ${M([[1, 1], [-1, 2]])}${M([[1, 2], [1, 3]])} = ${M([[2, 5], [1, 4]])} = B$.`,
        '',
        t`So $X = ${M([[1, 1], [-1, 2]])}$.`,
      ),
      whyWrong: [
        t`This is $A^{-1}B$, which solves $AX = B$. Matrix multiplication is not commutative, so for $XA = B$ the inverse must go on the right: $X = BA^{-1}$.`,
        t`This is $BA$: $B$ was multiplied by $A$ instead of by $A^{-1}$.`,
        null,
        t`This uses $${M([[1, -2], [-1, 3]])}$ as $A^{-1}$: the signs were changed but $1$ and $3$ were not swapped.`,
      ],
      keyIdea: 'Order matters: XA = B gives X = B times A inverse (inverse on the right), while AX = B gives X = A inverse times B.',
    },
    check: {
      optionValues: ['4,7,-1,-1', '7,19,5,14', '1,1,-1,2', '-3,11,-3,10'],
      compute: () => {
        const Ai = inv2([[1, 2], [1, 3]]).map((r) => r.map((f) => f.value()));
        return matMul([[2, 5], [1, 4]], Ai).flat().join(',');
      },
    },
  },
];
