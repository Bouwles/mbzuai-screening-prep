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
        t`**Step 1: determinant.** $3 \times 2 - 4 \times 1 = 6 - 4 = 2$ (not zero, so $A^{-1}$ exists).`,
        '',
        t`**Step 2: swap and change signs.** Swap $3$ and $2$, change the signs of $4$ and $1$: $${M([[2, -4], [-1, 3]])}$.`,
        '',
        t`**Step 3:** divide every entry by the determinant $2$.`,
        '',
        t`So $A^{-1} = \frac{1}{2}${M([[2, -4], [-1, 3]])} = ${M([[1, -2], [h(-1), h(3)]])}$. Check: $${M([[3, 4], [1, 2]])}${M([[1, -2], [h(-1), h(3)]])} = ${M([['3 - 2', '-6 + 6'], ['1 - 1', '-2 + 3']])} = ${M([[1, 0], [0, 1]])}$.`,
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
    stem: t`For which value of $k$ is $${M([[2, 0, 0], [1, 'k', 3], [4, 2, 1]])}$ singular?`,
    options: ['$k = 6$', '$k = -6$', '$k = \\frac{3}{2}$', '$k = 0$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`Expand along the first row, because two of its entries are $0$ and their terms vanish:`,
        '',
        t`$$\det = 2\begin{vmatrix} k & 3 \\ 2 & 1 \end{vmatrix} = 2\left(k \times 1 - 3 \times 2\right) = 2(k - 6)$$`,
        '',
        t`Singular means $\det = 0$: $2(k - 6) = 0$, so $k = 6$.`,
      ),
      whyWrong: [
        null,
        t`This adds inside the minor, using $ad + bc$: $k + 6 = 0$ gives $k = -6$. The determinant is $ad - bc$.`,
        t`This multiplies the wrong pairs in the minor, solving $2k - 3 = 0$. Use the diagonals: $k \times 1 - 3 \times 2$.`,
        t`This keeps only the first diagonal product, $2 \times k \times 1 = 0$, and forgets to subtract $3 \times 2$.`,
      ],
      keyIdea: 'Expand a 3 by 3 determinant along a row with zeros to shorten it, then set it equal to 0.',
    },
    check: {
      optionValues: [6, -6, 3 / 2, 0],
      compute: () => {
        for (let k = -20; k <= 20; k++) if (det3([[2, 0, 0], [1, k, 3], [4, 2, 1]]) === 0) return k;
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
  // ------------------------------------------------------------------ recall and rules
  {
    id: 'determinants-inverses-021',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`What is the determinant of $${M([['a', 'b'], ['c', 'd']])}$?`,
    options: ['$ad - bc$', '$ad + bc$', '$ab - cd$', '$ac - bd$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        'The determinant of a $2 \\times 2$ matrix is the leading diagonal product **minus** the other diagonal product:',
        '',
        t`$$\det = ad - bc$$`,
      ),
      whyWrong: [
        null,
        'This adds the two diagonal products. The second product is subtracted.',
        'This multiplies along the rows ($a$ with $b$, and $c$ with $d$). The determinant uses the diagonals.',
        'This multiplies down the columns ($a$ with $c$, and $b$ with $d$). The determinant uses the diagonals.',
      ],
      keyIdea: 'For a 2 by 2 matrix, the determinant is ad minus bc.',
    },
    check: {
      // the options at a = 2, b = 3, c = 5, d = 7
      optionValues: [14 - 15, 14 + 15, 6 - 35, 10 - 21],
      compute: () => det2([[2, 3], [5, 7]]),
    },
  },
  {
    id: 'determinants-inverses-022',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: 'When does a square matrix $A$ have an inverse?',
    options: ['Exactly when $\\det(A) \\ne 0$', 'Exactly when $\\det(A) = 0$', 'Exactly when every entry is non-zero', 'Exactly when $A$ is symmetric'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`A square matrix has an inverse exactly when its determinant is not $0$. A matrix with $\det(A) = 0$ is called **singular**, and it has no inverse.`,
        '',
        t`For a $2 \times 2$ matrix you can see this in the formula for $A^{-1}$, which divides by $\det(A)$.`,
      ),
      whyWrong: [
        null,
        'This is the condition for having **no** inverse. The inverse formula divides by the determinant, so it cannot be $0$.',
        t`Zero entries do not stop a matrix being invertible: $${M([[0, 1], [1, 0]])}$ has determinant $-1$ and is its own inverse.`,
        t`Being symmetric has nothing to do with it: $${M([[1, 1], [1, 1]])}$ is symmetric but has determinant $0$.`,
      ],
      keyIdea: 'A square matrix is invertible exactly when its determinant is not 0.',
    },
  },
  {
    id: 'determinants-inverses-023',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: 'For an invertible $n \\times n$ matrix $A$, what is $AA^{-1}$?',
    options: ['$I_{n}$, the unit matrix of order $n$', 'The zero matrix', 'The number $1$', '$A^{2}$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`The inverse is defined by $AA^{-1} = A^{-1}A = I_{n}$.`,
        '',
        t`The **unit matrix of order $n$**, $I_{n}$, is the $n \times n$ identity matrix: $1$s on the main diagonal and $0$s elsewhere.`,
      ),
      whyWrong: [
        null,
        'This treats $A^{-1}$ like $-A$, as if the two cancel to zero. An inverse undoes a product, so the result is the identity.',
        'A matrix product is a matrix, not a number. The unit matrix plays the role that the number $1$ plays for ordinary numbers.',
        'This reads $A^{-1}$ as another copy of $A$. The power $-1$ means the inverse.',
      ],
      keyIdea: 'A matrix times its inverse gives the unit matrix of the same order.',
    },
    check: {
      optionValues: ['1,0,0,1', '0,0,0,0', '1', '39,16,56,23'],
      compute: () => {
        const A: Mat = [[5, 2], [7, 3]];
        const Ai = inv2(A);
        return enc(A.map((r) => [0, 1].map((j) => Ai[0][j].mul(r[0]).add(Ai[1][j].mul(r[1])))));
      },
    },
  },
  {
    id: 'determinants-inverses-024',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`What is $\det(I_{3})$, where $I_{3}$ is the unit matrix of order $3$?`,
    options: ['$1$', '$3$', '$0$', '$9$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`The **unit matrix of order $3$**, $I_{3}$, is the $3 \times 3$ identity matrix. It is diagonal, so its determinant is the product of its diagonal entries:`,
        '',
        t`$$\det(I_{3}) = 1 \times 1 \times 1 = 1$$`,
      ),
      whyWrong: [
        null,
        'This adds the diagonal entries, which gives the trace. The determinant of a diagonal matrix is their **product**.',
        'Zeros off the diagonal do not make the determinant $0$. Only a zero on the diagonal of a diagonal matrix would.',
        'This counts the entries of the matrix. The determinant is the product of the diagonal entries.',
      ],
      keyIdea: 'The determinant of a unit matrix of any order is 1.',
    },
    check: {
      optionValues: [1, 3, 0, 9],
      compute: () => det3([[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
    },
  },
  {
    id: 'determinants-inverses-025',
    subtopic: 'determinants-inverses',
    difficulty: 'foundation',
    stem: t`An invertible matrix $A$ has $\det(A) = 4$. What is $\det\left(A^{-1}\right)$?`,
    options: ['$\\frac{1}{4}$', '$-4$', '$4$', '$\\frac{1}{16}$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`Since $AA^{-1} = I$ and $\det(I) = 1$, the product rule gives $\det(A)\det\left(A^{-1}\right) = 1$.`,
        '',
        t`So $\det\left(A^{-1}\right) = \frac{1}{\det(A)} = \frac{1}{4}$.`,
      ),
      whyWrong: [
        null,
        'This treats the power $-1$ as a change of sign. It means the reciprocal: $\\frac{1}{4}$, not $-4$.',
        'This assumes inverting leaves the determinant unchanged. That is true of the transpose, not the inverse.',
        'This squares the $4$ before taking the reciprocal. The rule is simply one over the determinant.',
      ],
      keyIdea: 'The determinant of the inverse is the reciprocal of the determinant.',
    },
    check: {
      optionValues: [1 / 4, -4, 4, 1 / 16],
      compute: () => {
        const Ai = inv2([[4, 0], [0, 1]]);
        return Ai[0][0].mul(Ai[1][1]).sub(Ai[0][1].mul(Ai[1][0])).value();
      },
    },
  },
  {
    id: 'determinants-inverses-026',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: 'For invertible $n \\times n$ matrices $A$ and $B$, what is $(AB)^{-1}$?',
    options: ['$B^{-1}A^{-1}$', '$A^{-1}B^{-1}$', '$BA$', '$A^{-1} + B^{-1}$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`Test the candidate by multiplying it by $AB$:`,
        '',
        t`$$(AB)\left(B^{-1}A^{-1}\right) = A\left(BB^{-1}\right)A^{-1} = AIA^{-1} = AA^{-1} = I$$`,
        '',
        t`So $(AB)^{-1} = B^{-1}A^{-1}$: the order reverses, just as it does for the transpose of a product.`,
      ),
      whyWrong: [
        null,
        t`This keeps the same order. In $(AB)\left(A^{-1}B^{-1}\right)$ nothing cancels, because $B$ and $A^{-1}$ are not next to their own inverses.`,
        t`This reverses the order but forgets to invert the two matrices.`,
        t`Inverses do not split over a product by adding. The rule is a product in reverse order.`,
      ],
      keyIdea: 'The inverse of a product reverses the order: (AB) inverse is B inverse times A inverse.',
    },
  },
  {
    id: 'determinants-inverses-027',
    subtopic: 'determinants-inverses',
    difficulty: 'exam',
    stem: t`$A$ is a $2 \times 2$ matrix with $\det(A) = 3$. What is $\det\left(2A^{T}\right)$?`,
    options: ['$12$', '$6$', '$24$', '$3$'],
    correctIndex: 0,
    markScheme: {
      solution: L(
        t`1. Transposing does not change the determinant: $\det\left(A^{T}\right) = 3$.`,
        t`2. Multiplying a $2 \times 2$ matrix by $2$ doubles both rows, so the determinant is multiplied by $2^{2} = 4$.`,
        t`3. $\det\left(2A^{T}\right) = 4 \times 3 = 12$.`,
      ),
      whyWrong: [
        null,
        t`This multiplies by $2$ only once. Both rows are doubled, so the factor is $2^{2}$.`,
        t`This uses $2^{3}$, the factor for a $3 \times 3$ matrix. Here $n = 2$.`,
        t`This ignores the scalar $2$. Transposing leaves the determinant alone, but the scalar does not.`,
      ],
      keyIdea: 'For an n by n matrix, det(kA) is k to the power n times det(A), and transposing changes nothing.',
    },
    check: {
      optionValues: [12, 6, 24, 3],
      compute: () => det2(scale(2, transpose([[3, 1], [0, 1]]))),
    },
  },
];
