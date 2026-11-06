import type { StaticQuestion } from '../../../types';
import { matrix, vec } from '../../../lib/tex';
import { det, det2, matMul, rank, transpose } from '../../../lib/mathx';
import type { Mat } from '../../../lib/mathx';

// ---- helpers used only by the answer checks ----
/** Canonical "small,large" key for an unordered pair of numbers. */
const pairKey = (a: number, b: number): string => [a, b].sort((x, y) => x - y).join(',');
/** Eigenvalues of a 2x2 matrix from the characteristic equation, as a pair key. */
function eig2(A: Mat): string {
  const t = A[0][0] + A[1][1];
  const d = det2(A);
  const disc = Math.sqrt(t * t - 4 * d);
  return pairKey((t - disc) / 2, (t + disc) / 2);
}
/** Root of a function that is linear in k: f(k) = C k + D. */
const linearRoot = (f: (k: number) => number): number => -f(0) / (f(1) - f(0));
/** Is v (non-zero) an eigenvector of A with eigenvalue lam? */
const isEigvec = (A: Mat, v: number[], lam: number): boolean =>
  (v[0] !== 0 || v[1] !== 0) && A.every((row, i) => row[0] * v[0] + row[1] * v[1] === lam * v[i]);
/** Is v (non-zero) an eigenvector of A for SOME eigenvalue? */
const isAnyEigvec = (A: Mat, v: number[]): boolean => {
  if (v[0] === 0 && v[1] === 0) return false;
  const Av = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
  return Av[0] * v[1] - Av[1] * v[0] === 0;
};

const M = (rows: (number | string)[][]) => matrix(rows);
const V = (e: number[]) => vec(e);

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'rank-eigen-001',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: `What are the eigenvalues of $A = ${M([[3, 5], [0, -2]])}$?`,
    options: ['$3$ and $5$', '$-3$ and $2$', '$3$ and $-2$', '$5$ and $0$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The matrix is **upper triangular**: the entry below the main diagonal is $0$.\n\n' +
        'Characteristic equation:\n\n' +
        `$$\\det(A - \\lambda I) = \\begin{vmatrix} 3 - \\lambda & 5 \\\\ 0 & -2 - \\lambda \\end{vmatrix} = (3 - \\lambda)(-2 - \\lambda) - 5 \\times 0 = (3 - \\lambda)(-2 - \\lambda)$$\n\n` +
        'Setting this to $0$ gives $\\lambda = 3$ or $\\lambda = -2$.\n\n' +
        'Shortcut: for a triangular (or diagonal) matrix the eigenvalues are simply the **diagonal entries**, here $3$ and $-2$.\n\n' +
        'Check: sum $3 + (-2) = 1$ = trace $3 + (-2)$, product $3 \\times (-2) = -6 = \\det A$.',
      whyWrong: [
        'This reads along the **top row** instead of down the main diagonal. The eigenvalues of a triangular matrix are the diagonal entries $3$ and $-2$.',
        'This is a sign slip in the characteristic equation: writing $\\lambda^2 + \\lambda - 6 = 0$ instead of $\\lambda^2 - \\lambda - 6 = 0$ flips both roots.',
        null,
        'These are the off-diagonal entries. Off-diagonal entries do not give eigenvalues; the diagonal entries of a triangular matrix do.',
      ],
      keyIdea: 'For a triangular or diagonal matrix, the eigenvalues are exactly the entries on the main diagonal.',
    },
    check: {
      optionValues: ['3,5', '-3,2', '-2,3', '0,5'],
      compute: () => eig2([[3, 5], [0, -2]]),
    },
  },
  {
    id: 'rank-eigen-002',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: `What is the rank of $B = ${M([[1, 2, 3], [2, 4, 6]])}$?`,
    options: ['$1$', '$2$', '$3$', '$0$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **rank** is the number of linearly independent rows (equivalently, columns).\n\n' +
        '- Row 2 is $(2, 4, 6) = 2 \\times (1, 2, 3)$, so row 2 is just a multiple of row 1.\n' +
        '- Row 1 is not all zeros, so it counts as one independent row.\n\n' +
        'Row reduce to confirm: $R_2 \\to R_2 - 2R_1$ gives' +
        `$$${M([[1, 2, 3], [0, 0, 0]])}$$` +
        'One non-zero row remains, so the rank is $1$.',
      whyWrong: [
        null,
        'This counts the **rows**, assuming they are independent. Row 2 is twice row 1, so it adds nothing new.',
        'This counts the **columns**. The rank can never exceed the number of rows ($2$ here), and in fact it is only $1$.',
        'Rank $0$ belongs only to the zero matrix. Having a dependent row lowers the rank, but row 1 is non-zero so the rank is at least $1$.',
      ],
      keyIdea: 'Rank = number of linearly independent rows; a row that is a multiple of another row does not add to the rank.',
    },
    check: {
      optionValues: [1, 2, 3, 0],
      compute: () => rank([[1, 2, 3], [2, 4, 6]]),
    },
  },
  {
    id: 'rank-eigen-003',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: 'A $2 \\times 2$ matrix $A$ has eigenvalues $3$ and $-5$. What are the trace and the determinant of $A$?',
    options: [
      'trace $-15$, determinant $-2$',
      'trace $-2$, determinant $-15$',
      'trace $8$, determinant $15$',
      'trace $2$, determinant $-15$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Two facts that hold for every square matrix:\n\n' +
        '- trace (sum of the diagonal entries) = **sum** of the eigenvalues\n' +
        '- determinant = **product** of the eigenvalues\n\n' +
        'Trace: $3 + (-5) = -2$.\n\n' +
        'Determinant: $3 \\times (-5) = -15$.\n\n' +
        'So trace $= -2$ and $\\det A = -15$.',
      whyWrong: [
        'The two rules are swapped: the trace is the **sum** of the eigenvalues and the determinant is the **product**.',
        null,
        'This drops the minus sign on $-5$, using $3 + 5$ and $3 \\times 5$.',
        'This reads the trace off the characteristic equation $\\lambda^2 + 2\\lambda - 15 = 0$ without the minus sign. The equation is $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$, so the trace is $-2$.',
      ],
      keyIdea: 'Trace = sum of eigenvalues, determinant = product of eigenvalues.',
    },
    check: {
      optionValues: ['-15,-2', '-2,-15', '8,15', '2,-15'],
      compute: () => {
        const ev = [3, -5];
        return `${ev[0] + ev[1]},${ev[0] * ev[1]}`;
      },
    },
  },
  {
    id: 'rank-eigen-004',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: `Which of these vectors is an eigenvector of $A = ${M([[2, 1], [1, 2]])}$?`,
    options: [`$${V([1, 0])}$`, `$${V([0, 0])}$`, `$${V([1, 2])}$`, `$${V([1, 1])}$`],
    correctIndex: 3,
    markScheme: {
      solution:
        'A non-zero vector $\\mathbf{v}$ is an eigenvector if $A\\mathbf{v} = \\lambda\\mathbf{v}$: multiplying by $A$ only **stretches** it (no change of direction).\n\n' +
        'Test each candidate:\n\n' +
        `- $A${V([1, 1])} = ${V([2 + 1, 1 + 2])} = 3${V([1, 1])}$: a multiple of the vector, so it **is** an eigenvector (eigenvalue $3$).\n` +
        `- $A${V([1, 0])} = ${V([2, 1])}$: not a multiple of $${V([1, 0])}$.\n` +
        `- $A${V([1, 2])} = ${V([4, 5])}$: not a multiple of $${V([1, 2])}$ ($4 = 4 \\times 1$ but $5 \\ne 4 \\times 2$).\n` +
        '- The zero vector is **never** called an eigenvector, by definition.\n\n' +
        `So the eigenvector is $${V([1, 1])}$.`,
      whyWrong: [
        `This assumes the standard basis vectors are always eigenvectors. That is only true for diagonal matrices; here $A${V([1, 0])} = ${V([2, 1])}$, which points in a different direction.`,
        'The zero vector satisfies $A\\mathbf{0} = \\lambda\\mathbf{0}$ for every $\\lambda$, which is exactly why the definition requires an eigenvector to be **non-zero**.',
        `Multiplying gives $A${V([1, 2])} = ${V([4, 5])}$, which is not a scalar multiple of $${V([1, 2])}$, so its direction changes.`,
        null,
      ],
      keyIdea: 'Test a candidate eigenvector by computing $A\\mathbf{v}$ and checking it is a scalar multiple of $\\mathbf{v}$ (and $\\mathbf{v} \\ne \\mathbf{0}$).',
    },
    check: {
      optionValues: ['1,0', '0,0', '1,2', '1,1'],
      compute: () => {
        const A = [[2, 1], [1, 2]];
        const cands = [[1, 0], [0, 0], [1, 2], [1, 1]];
        return cands.filter((v) => isAnyEigvec(A, v)).map((v) => v.join(',')).join('|');
      },
    },
  },
  {
    id: 'rank-eigen-005',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: `What is the rank of $D = ${M([[2, 0, 0], [0, 0, 0], [0, 0, 5]])}$?`,
    options: ['$3$', '$2$', '$7$', '$0$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'For a **diagonal** matrix the rank is the number of **non-zero** diagonal entries.\n\n' +
        '- Row 1 $(2, 0, 0)$ and row 3 $(0, 0, 5)$ are non-zero and point in different directions, so they are independent.\n' +
        '- Row 2 is all zeros, and a zero row never counts.\n\n' +
        'So there are $2$ independent rows: the rank is $2$.\n\n' +
        'Note: $\\det(D) = 2 \\times 0 \\times 5 = 0$, which tells you the rank is **less than** $3$, but not that it is $0$.',
      whyWrong: [
        'This is the size of the matrix. The zero row means only two rows are independent, so the rank is less than $3$.',
        null,
        'This is the trace, the sum of the diagonal entries $2$, $0$ and $5$. The rank counts independent rows, it is not a sum of entries.',
        'This confuses "determinant is $0$" with "rank is $0$". A zero determinant only says the rank is less than full; two rows are still non-zero.',
      ],
      keyIdea: 'The rank of a diagonal matrix is the number of non-zero entries on its diagonal.',
    },
    check: {
      optionValues: [3, 2, 7, 0],
      compute: () => rank([[2, 0, 0], [0, 0, 0], [0, 0, 5]]),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'rank-eigen-006',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `Find the eigenvalues of $A = ${M([[5, 2], [1, 4]])}$.`,
    options: ['$5$ and $4$', '$3$ and $6$', '$-3$ and $-6$', '$9$ and $18$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Solve the characteristic equation $\\det(A - \\lambda I) = 0$.\n\n' +
        `$$\\begin{vmatrix} 5 - \\lambda & 2 \\\\ 1 & 4 - \\lambda \\end{vmatrix} = (5 - \\lambda)(4 - \\lambda) - 2 \\times 1$$\n\n` +
        'Expand: $(5 - \\lambda)(4 - \\lambda) = 20 - 9\\lambda + \\lambda^2$, so the equation is\n\n' +
        '$$\\lambda^2 - 9\\lambda + 18 = 0$$\n\n' +
        'Factorise: $(\\lambda - 3)(\\lambda - 6) = 0$, so $\\lambda = 3$ or $\\lambda = 6$.\n\n' +
        'Check: $3 + 6 = 9$ = trace $5 + 4$, and $3 \\times 6 = 18 = 5 \\times 4 - 2 \\times 1 = \\det A$.',
      whyWrong: [
        'These are the diagonal entries. Reading eigenvalues off the diagonal only works for triangular or diagonal matrices, and this one has non-zero entries on both sides of the diagonal.',
        null,
        'This is a sign slip: using $\\lambda^2 + 9\\lambda + 18 = 0$ (adding the trace term instead of subtracting it) flips both roots.',
        'These are the trace and the determinant, which are the **sum** and **product** of the eigenvalues, not the eigenvalues themselves.',
      ],
      keyIdea: 'For a $2 \\times 2$ matrix, the eigenvalues solve $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$.',
    },
    check: {
      optionValues: ['4,5', '3,6', '-6,-3', '9,18'],
      compute: () => eig2([[5, 2], [1, 4]]),
    },
  },
  {
    id: 'rank-eigen-007',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `What is the rank of $C = ${M([[1, 2, 3], [4, 5, 6], [7, 8, 9]])}$?`,
    options: ['$3$', '$1$', '$0$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Row reduce, using row 1 to clear the first column:\n\n' +
        '- $R_2 \\to R_2 - 4R_1$: $(4, 5, 6) - (4, 8, 12) = (0, -3, -6)$\n' +
        '- $R_3 \\to R_3 - 7R_1$: $(7, 8, 9) - (7, 14, 21) = (0, -6, -12)$\n\n' +
        'Now $R_3 \\to R_3 - 2R_2$: $(0, -6, -12) - (0, -6, -12) = (0, 0, 0)$.\n\n' +
        `$$${M([[1, 2, 3], [0, -3, -6], [0, 0, 0]])}$$\n\n` +
        'Two non-zero rows remain, so the rank is $2$.\n\n' +
        'Quick check: $R_1 + R_3 = (8, 10, 12) = 2R_2$, so one row is a combination of the other two, while $R_1$ and $R_2$ are clearly not multiples of each other.',
      whyWrong: [
        'This assumes three rows must be independent because none is a multiple of another. But $R_3 = 2R_2 - R_1$, so row 3 adds nothing new (and $\\det C = 0$).',
        'Rank $1$ would need every row to be a multiple of a single row. $(4, 5, 6)$ is not a multiple of $(1, 2, 3)$, so the rank is at least $2$.',
        'This confuses $\\det C = 0$ with rank $0$. A zero determinant only means the rank is less than $3$; only the zero matrix has rank $0$.',
        null,
      ],
      keyIdea: 'Row reduce and count the non-zero rows that remain: that count is the rank.',
    },
    check: {
      optionValues: [3, 1, 0, 2],
      compute: () => rank([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
    },
  },
  {
    id: 'rank-eigen-008',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `The matrix $A = ${M([[3, 1], [0, 2]])}$ has eigenvalue $\\lambda = 2$. Which vector is an eigenvector for $\\lambda = 2$?`,
    options: [`$${V([1, 0])}$`, `$${V([1, -1])}$`, `$${V([1, 1])}$`, `$${V([0, 1])}$`],
    correctIndex: 1,
    markScheme: {
      solution:
        'Solve $(A - 2I)\\mathbf{v} = \\mathbf{0}$.\n\n' +
        `$$A - 2I = ${M([[3 - 2, 1], [0, 2 - 2]])} = ${M([[1, 1], [0, 0]])}$$\n\n` +
        'With $\\mathbf{v} = (x, y)$, the first row gives $x + y = 0$, so $y = -x$. The second row gives $0 = 0$ (no information).\n\n' +
        `Choose $x = 1$: $\\mathbf{v} = ${V([1, -1])}$.\n\n` +
        `Check: $A${V([1, -1])} = ${V([3 - 1, -2])} = 2${V([1, -1])}$.`,
      whyWrong: [
        `This is an eigenvector for the **other** eigenvalue: $A${V([1, 0])} = ${V([3, 0])} = 3${V([1, 0])}$, so its eigenvalue is $3$, not $2$.`,
        null,
        `This is a sign slip when solving $x + y = 0$ (taking $y = x$). Check: $A${V([1, 1])} = ${V([4, 2])}$, not a multiple of $${V([1, 1])}$.`,
        `This assumes the second diagonal entry goes with the second standard basis vector, which is only true for diagonal matrices. Here $A${V([0, 1])} = ${V([1, 2])}$.`,
      ],
      keyIdea: 'To find an eigenvector for $\\lambda$, solve $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ and pick any non-zero solution.',
    },
    check: {
      optionValues: ['1,0', '1,-1', '1,1', '0,1'],
      compute: () => {
        const A = [[3, 1], [0, 2]];
        const cands = [[1, 0], [1, -1], [1, 1], [0, 1]];
        return cands.filter((v) => isEigvec(A, v, 2)).map((v) => v.join(',')).join('|');
      },
    },
  },
  {
    id: 'rank-eigen-009',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `The matrix $A = ${M([['k', 2], [3, 1]])}$ has $\\lambda = 4$ as an eigenvalue. Find $k$.`,
    options: ['$6$', '$10$', '$2$', '$3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'If $4$ is an eigenvalue then $\\det(A - 4I) = 0$.\n\n' +
        `$$A - 4I = ${M([['k - 4', 2], [3, -3]])}$$\n\n` +
        '$$\\det(A - 4I) = (k - 4)(-3) - 2 \\times 3 = -3k + 12 - 6 = -3k + 6$$\n\n' +
        'Set it to $0$: $-3k + 6 = 0$, so $k = 2$.\n\n' +
        'Check with $k = 2$: trace $= 3$, det $= 2 - 6 = -4$, so $\\lambda^2 - 3\\lambda - 4 = (\\lambda - 4)(\\lambda + 1) = 0$. Yes, $4$ is an eigenvalue.',
      whyWrong: [
        'This adds $bc$ instead of subtracting it: $(k - 4)(-3) + 6 = 0$ gives $k = 6$. The determinant is $ad - bc$.',
        'This subtracts $\\lambda$ from the top-left entry only, solving $(k - 4)(1) - 6 = 0$. You must subtract $\\lambda$ from **every** diagonal entry.',
        null,
        'This sets the trace $k + 1$ equal to $4$. The trace is the **sum of both** eigenvalues, not one eigenvalue.',
      ],
      keyIdea: '$\\lambda$ is an eigenvalue exactly when $\\det(A - \\lambda I) = 0$; substitute $\\lambda$ and solve for the unknown.',
    },
    check: {
      optionValues: [6, 10, 2, 3],
      compute: () => linearRoot((k) => det2([[k - 4, 2], [3, 1 - 4]])),
    },
  },
  {
    id: 'rank-eigen-010',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'A $3 \\times 3$ matrix $A$ has $0$ as one of its eigenvalues. Which statement **must** be true?',
    options: ['$A$ is invertible', '$A$ is the zero matrix', '$\\det A = 0$', '$\\operatorname{tr}(A) = 0$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The determinant is the **product** of the eigenvalues: $\\det A = \\lambda_1 \\lambda_2 \\lambda_3$.\n\n' +
        'If one eigenvalue is $0$, the product is $0$, so $\\det A = 0$.\n\n' +
        'Equivalently: an eigenvalue $0$ means $A\\mathbf{v} = 0\\mathbf{v} = \\mathbf{0}$ for some non-zero $\\mathbf{v}$, so the columns of $A$ are linearly dependent, the rank is less than $3$, and $A$ has no inverse.\n\n' +
        'The others need not hold, e.g. $A = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}$ has eigenvalues $1, 2, 0$, is not the zero matrix and has trace $3$.',
      whyWrong: [
        'This is the opposite of the truth: $\\det A = 0$, and a matrix with zero determinant has **no** inverse.',
        'Only one eigenvalue is $0$. The diagonal matrix with entries $1, 2, 0$ has eigenvalue $0$ but is not the zero matrix.',
        null,
        'The trace is the **sum** of the eigenvalues; one of them being $0$ does not make the sum $0$ (for $1, 2, 0$ the trace is $3$). It is the **product** that becomes $0$.',
      ],
      keyIdea: 'Eigenvalue $0$ $\\iff$ $\\det A = 0$ $\\iff$ rank less than full $\\iff$ $A$ is not invertible.',
    },
  },
  {
    id: 'rank-eigen-011',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `For which value of $k$ does $A = ${M([[1, 2], [3, 'k']])}$ have rank $1$?`,
    options: ['$\\frac{2}{3}$', '$-6$', '$4$', '$6$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'A $2 \\times 2$ matrix has rank $1$ (rather than $2$) when its rows are multiples of each other, i.e. when its determinant is $0$ (and it is not the zero matrix).\n\n' +
        '$$\\det A = 1 \\times k - 2 \\times 3 = k - 6$$\n\n' +
        'Set $k - 6 = 0$, so $k = 6$.\n\n' +
        'Check: row 2 is $(3, 6) = 3 \\times (1, 2)$, a multiple of row 1.',
      whyWrong: [
        'This cross-multiplies the wrong pair, solving $1 \\times 2 = 3k$. Row 2 must be $3$ times row 1, so $k = 3 \\times 2 = 6$.',
        'This uses $\\det A = ad + bc$, giving $k + 6 = 0$. The determinant is $ad - bc$.',
        'This makes row 2 equal to row 1 **plus** $2$: $(1 + 2, 2 + 2) = (3, 4)$. Dependent rows must be scalar **multiples**, not shifted by adding a number.',
        null,
      ],
      keyIdea: 'A non-zero $2 \\times 2$ matrix has rank $1$ exactly when its determinant is $0$.',
    },
    check: {
      optionValues: [2 / 3, -6, 4, 6],
      compute: () => linearRoot((k) => det2([[1, 2], [3, k]])),
    },
  },
  {
    id: 'rank-eigen-012',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `Using its eigenvalues, find $\\det A$ for $A = ${M([[2, 7, -1], [0, -3, 4], [0, 0, 5]])}$.`,
    options: ['$4$', '$-30$', '$30$', '$0$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '$A$ is **upper triangular** (all zeros below the main diagonal), so its eigenvalues are the diagonal entries: $2$, $-3$ and $5$.\n\n' +
        'The determinant is the product of the eigenvalues:\n\n' +
        '$$\\det A = 2 \\times (-3) \\times 5 = -30$$\n\n' +
        'The entries above the diagonal ($7$, $-1$, $4$) do not affect the eigenvalues or the determinant of a triangular matrix.',
      whyWrong: [
        'This is the **sum** of the eigenvalues, $2 - 3 + 5 = 4$, which is the trace. The determinant is the **product**.',
        null,
        'This drops the negative sign of $-3$. An odd number of negative factors makes the product negative.',
        'This assumes the zeros below the diagonal make the determinant $0$. A determinant is $0$ only if an eigenvalue (here a diagonal entry) is $0$.',
      ],
      keyIdea: 'For a triangular matrix, eigenvalues = diagonal entries and determinant = their product.',
    },
    check: {
      optionValues: [4, -30, 30, 0],
      compute: () => det([[2, 7, -1], [0, -3, 4], [0, 0, 5]]),
    },
  },
  {
    id: 'rank-eigen-013',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `Find the eigenvalues of the symmetric matrix $S = ${M([[2, 3], [3, 2]])}$.`,
    options: ['$-5$ and $1$', '$2$ and $3$', '$5$ and $-1$', '$11$ and $-7$'],
    correctIndex: 2,
    markScheme: {
      solution:
        `$$\\det(S - \\lambda I) = \\begin{vmatrix} 2 - \\lambda & 3 \\\\ 3 & 2 - \\lambda \\end{vmatrix} = (2 - \\lambda)^2 - 9$$\n\n` +
        'Set to $0$: $(2 - \\lambda)^2 = 9$, so $2 - \\lambda = 3$ or $2 - \\lambda = -3$.\n\n' +
        '- $2 - \\lambda = 3 \\Rightarrow \\lambda = -1$\n' +
        '- $2 - \\lambda = -3 \\Rightarrow \\lambda = 5$\n\n' +
        '(Or expand: $\\lambda^2 - 4\\lambda - 5 = (\\lambda - 5)(\\lambda + 1) = 0$.)\n\n' +
        'Check: $5 + (-1) = 4$ = trace, $5 \\times (-1) = -5 = 4 - 9 = \\det(S)$.',
      whyWrong: [
        'This is a sign slip on the trace term: $\\lambda^2 + 4\\lambda - 5 = 0$ gives $-5$ and $1$. The characteristic equation is $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$.',
        'These are just the two different entries of the matrix. The matrix is not triangular, so the eigenvalues must come from the characteristic equation.',
        null,
        'This forgets to square root: from $(2 - \\lambda)^2 = 9$ it uses $2 - \\lambda = \\pm 9$ instead of $\\pm 3$.',
      ],
      keyIdea: 'Set $\\det(S - \\lambda I) = 0$; with equal diagonal entries it becomes $(a - \\lambda)^2 = b^2$, so $\\lambda = a \\pm b$.',
    },
    check: {
      optionValues: ['-5,1', '2,3', '-1,5', '-7,11'],
      compute: () => eig2([[2, 3], [3, 2]]),
    },
  },
  {
    id: 'rank-eigen-014',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: `The matrix $A = ${M([[1, 2], [4, 3]])}$ has eigenvalues $5$ and $-1$. Which vector is an eigenvector for the eigenvalue $5$?`,
    options: [`$${V([1, 4])}$`, `$${V([2, 1])}$`, `$${V([1, -1])}$`, `$${V([1, 2])}$`],
    correctIndex: 3,
    markScheme: {
      solution:
        'Solve $(A - 5I)\\mathbf{v} = \\mathbf{0}$.\n\n' +
        `$$A - 5I = ${M([[1 - 5, 2], [4, 3 - 5]])} = ${M([[-4, 2], [4, -2]])}$$\n\n` +
        'Row 1 gives $-4x + 2y = 0$, so $y = 2x$. (Row 2, $4x - 2y = 0$, says the same thing.)\n\n' +
        `Take $x = 1$, $y = 2$: $\\mathbf{v} = ${V([1, 2])}$.\n\n` +
        `Check: $A${V([1, 2])} = ${V([1 + 4, 4 + 6])} = ${V([5, 10])} = 5${V([1, 2])}$.`,
      whyWrong: [
        `This is the first column of $A$. A column of $A$ is not an eigenvector in general: $A${V([1, 4])} = ${V([9, 16])}$, not a multiple of $${V([1, 4])}$.`,
        `This swaps $x$ and $y$ when solving $y = 2x$. Check: $A${V([2, 1])} = ${V([4, 11])}$, not a multiple of $${V([2, 1])}$.`,
        `This is the eigenvector for the **other** eigenvalue: $A${V([1, -1])} = ${V([-1, 1])} = -1 \\times ${V([1, -1])}$.`,
        null,
      ],
      keyIdea: 'Each eigenvalue has its own eigenvectors: substitute that $\\lambda$ into $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$.',
    },
    check: {
      optionValues: ['1,4', '2,1', '1,-1', '1,2'],
      compute: () => {
        const A = [[1, 2], [4, 3]];
        const cands = [[1, 4], [2, 1], [1, -1], [1, 2]];
        return cands.filter((v) => isEigvec(A, v, 5)).map((v) => v.join(',')).join('|');
      },
    },
  },
  {
    id: 'rank-eigen-016',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'A $2 \\times 2$ matrix $A$ has eigenvalues $2$ and $-3$. What are the eigenvalues of $A^2 + I$?',
    options: ['$4$ and $9$', '$5$ and $10$', '$5$ and $-8$', '$3$ and $-2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'If $A\\mathbf{v} = \\lambda\\mathbf{v}$, then\n\n' +
        '- $A^2\\mathbf{v} = A(\\lambda\\mathbf{v}) = \\lambda A\\mathbf{v} = \\lambda^2\\mathbf{v}$\n' +
        '- $(A^2 + I)\\mathbf{v} = \\lambda^2\\mathbf{v} + \\mathbf{v} = (\\lambda^2 + 1)\\mathbf{v}$\n\n' +
        'So each eigenvalue $\\lambda$ of $A$ becomes $\\lambda^2 + 1$:\n\n' +
        '- $\\lambda = 2$: $2^2 + 1 = 5$\n' +
        '- $\\lambda = -3$: $(-3)^2 + 1 = 9 + 1 = 10$\n\n' +
        'The eigenvalues of $A^2 + I$ are $5$ and $10$.',
      whyWrong: [
        'These are the eigenvalues of $A^2$; the $+I$ adds $1$ to every eigenvalue, which was forgotten.',
        null,
        'This squares $-3$ as $-3^2 = -9$ instead of $(-3)^2 = 9$. Always bracket a negative number before squaring.',
        'These are the eigenvalues of $A + I$: the squaring step was skipped.',
      ],
      keyIdea: 'If $\\lambda$ is an eigenvalue of $A$, then $\\lambda^2$ is an eigenvalue of $A^2$ and $\\lambda + c$ is an eigenvalue of $A + cI$.',
    },
    check: {
      optionValues: ['4,9', '5,10', '-8,5', '-2,3'],
      compute: () => {
        const [p, q] = [2, -3].map((l) => l * l + 1);
        return pairKey(p, q);
      },
    },
  },
  // ------------------------------------------------------------------ symbolic rank facts
  {
    id: 'rank-eigen-020',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'Let $A$ be a $m \\times n$ matrix and $B$ a $n \\times m$ matrix with $m < n$, such that $AB = I_{m}$, the unit matrix of order $m$. Then for $r(X)$ as the rank of a matrix $X$:',
    options: ['$r(A) = m$, $r(B) = m$', '$r(A) = m$, $r(B) = n$', '$r(A) = n$, $r(B) = m$', '$r(A) = n$, $r(B) = n$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **unit matrix of order $m$**, $I_{m}$, is the $m \\times m$ identity matrix, and $r(X)$ means the rank of $X$. All $m$ rows of $I_{m}$ are independent, so $r(I_{m}) = m$.\n\n' +
        '1. The rank of a product is at most the rank of each factor, so $m = r(AB) \\le r(A)$ and $m \\le r(B)$.\n' +
        '2. A rank cannot exceed the smaller dimension. $A$ has $m$ rows and $B$ has $m$ columns, so $r(A) \\le m$ and $r(B) \\le m$.\n' +
        '3. Both bounds together give $r(A) = m$ and $r(B) = m$.',
      whyWrong: [
        null,
        'This takes the rank of $B$ to be $n$ because $B$ has $n$ rows. But $B$ has only $m$ columns, so its rank is at most $m$, which is less than $n$.',
        'This takes the rank of $A$ to be $n$ because $A$ has $n$ columns. But $A$ has only $m$ rows, so its rank is at most $m$, which is less than $n$.',
        'This uses the larger dimension for both. A rank can never exceed the smaller dimension, which is $m$ for each matrix.',
      ],
      keyIdea: 'If $AB = I_{m}$ then $m \\le r(A)$ and $m \\le r(B)$, and the size limits then force $r(A) = r(B) = m$.',
    },
    check: {
      optionValues: ['m,m', 'm,n', 'n,m', 'n,n'],
      compute: () => {
        // A concrete case with m = 2, n = 3 and AB equal to the 2 x 2 identity.
        const A = [[1, 0, 0], [0, 1, 0]];
        const B = [[1, 0], [0, 1], [0, 0]];
        const [mm, nn] = [A.length, A[0].length];
        if (JSON.stringify(matMul(A, B)) !== JSON.stringify([[1, 0], [0, 1]])) return 'bad example';
        const name = (r: number) => (r === mm ? 'm' : r === nn ? 'n' : String(r));
        return `${name(rank(A))},${name(rank(B))}`;
      },
    },
  },
  {
    id: 'rank-eigen-021',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'Let $P$ be a $p \\times q$ matrix and $Q$ a $q \\times p$ matrix with $q < p$. Which statement about $PQ$ is always true?',
    options: ['$r(PQ) \\le q$', '$r(PQ) = p$', '$PQ$ is invertible', '$r(PQ) = p - q$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $r(X)$ means the rank of $X$.\n\n' +
        '1. $PQ$ is $(p \\times q)(q \\times p)$, which is a $p \\times p$ matrix.\n' +
        '2. $Q$ has only $q$ rows, so $r(Q) \\le q$.\n' +
        '3. The rank of a product is at most the rank of each factor: $r(PQ) \\le r(Q) \\le q$.\n\n' +
        'Since $q < p$, the $p \\times p$ matrix $PQ$ never has full rank, so it is never invertible.',
      whyWrong: [
        null,
        'This picks $p$ because $PQ$ is $p \\times p$. The size only gives an upper limit; here the rank is at most $q$, which is less than $p$.',
        'A $p \\times p$ matrix is invertible only when its rank is $p$, but here the rank is at most $q < p$.',
        'Rank does not come from subtracting dimensions. If $P$ and $Q$ are zero matrices then $r(PQ) = 0$, while $p - q > 0$.',
      ],
      keyIdea: 'A product can never have a higher rank than either of its factors, whatever the size of the result.',
    },
  },
  {
    id: 'rank-eigen-022',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: 'What is the maximum possible rank of a $3 \\times 5$ matrix?',
    options: ['$3$', '$5$', '$8$', '$15$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A rank cannot exceed the number of rows or the number of columns, so it is at most the smaller of the two.\n\n' +
        'For a $3 \\times 5$ matrix the maximum is $\\min(3, 5) = 3$.',
      whyWrong: [
        null,
        'This uses the larger dimension. There are only $3$ rows, so at most $3$ rows can be independent.',
        'This adds the dimensions. The rank is limited by the smaller dimension, not their sum.',
        'This is the number of entries, $3 \\times 5$. The rank counts independent rows, not entries.',
      ],
      keyIdea: 'A $p \\times q$ matrix has rank at most $\\min(p, q)$.',
    },
    check: {
      optionValues: [3, 5, 8, 15],
      compute: () => rank([[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0]]),
    },
  },
  {
    id: 'rank-eigen-023',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: 'Let $A$ be a $p \\times q$ matrix with $p < q$. What is the largest possible value of $r(A)$, the rank of $A$?',
    options: ['$p$', '$q$', '$p + q$', '$pq$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $r(A)$ means the rank of $A$. The rank is at most the smaller dimension: $r(A) \\le \\min(p, q)$.\n\n' +
        'Since $p < q$, the largest possible value is $p$.',
      whyWrong: [
        null,
        'This picks $q$ because $A$ has $q$ columns. With only $p$ rows, at most $p$ rows can be independent, and $p < q$.',
        'This adds the dimensions. The rank is limited by the smaller dimension, not their sum.',
        'This is the number of entries in $A$. The rank counts independent rows, not entries.',
      ],
      keyIdea: 'The rank of a matrix is at most its smaller dimension.',
    },
  },
  {
    id: 'rank-eigen-024',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: 'What is the **rank** of a matrix?',
    options: ['The maximum number of linearly independent rows', 'The total number of rows', 'The number of non-zero entries', 'The value of its determinant'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The rank is the largest number of rows you can pick so that none of the picked rows can be built from the others (**linearly independent** rows). Counting columns the same way always gives the same number.',
      whyWrong: [
        null,
        'This counts every row. A row that is a multiple of another row adds nothing, so it does not raise the rank.',
        'This counts entries. $\\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}$ has four non-zero entries but rank $1$.',
        'The determinant is a different number, and it exists only for square matrices. It tells you whether a square matrix has full rank, not what the rank is.',
      ],
      keyIdea: 'Rank = maximum number of linearly independent rows = maximum number of linearly independent columns.',
    },
  },
  {
    id: 'rank-eigen-025',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: 'What is $r(I_{m})$, the rank of the unit matrix of order $m$?',
    options: ['$m$', '$1$', '$0$', '$m^{2}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **unit matrix of order $m$**, $I_{m}$, is the $m \\times m$ identity matrix: $1$s on the main diagonal and $0$s elsewhere.\n\n' +
        'Its $m$ rows are all independent, because each has its single $1$ in a different column. So $r(I_{m}) = m$.',
      whyWrong: [
        null,
        'This reads "unit" as "rank one". Each row of $I_{m}$ has its $1$ in a different column, so all $m$ rows count.',
        'Only the zero matrix has rank $0$. Having many zero entries does not make the rank zero.',
        'This is the number of entries in $I_{m}$. The rank counts independent rows, and there are only $m$ rows.',
      ],
      keyIdea: 'The unit matrix of order $m$ has full rank: $r(I_{m}) = m$.',
    },
    check: {
      optionValues: [4, 1, 0, 16],
      compute: () => rank([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]),
    },
  },
  {
    id: 'rank-eigen-026',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: 'If $A\\mathbf{v} = \\lambda\\mathbf{v}$ with $\\mathbf{v} \\ne \\mathbf{0}$, what is $\\lambda$ called?',
    options: ['An eigenvalue of $A$', 'An eigenvector of $A$', 'The rank of $A$', 'The trace of $A$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'In $A\\mathbf{v} = \\lambda\\mathbf{v}$, the matrix only stretches $\\mathbf{v}$. The number $\\lambda$ is the stretch factor, called an **eigenvalue**, and the vector $\\mathbf{v}$ is an **eigenvector**.',
      whyWrong: [
        null,
        'The eigenvector is the vector $\\mathbf{v}$. Here $\\lambda$ is a number, the stretch factor.',
        'The rank counts independent rows. It does not appear in the equation $A\\mathbf{v} = \\lambda\\mathbf{v}$.',
        'The trace is the sum of the diagonal entries, which equals the sum of **all** the eigenvalues, not one of them.',
      ],
      keyIdea: 'In $A\\mathbf{v} = \\lambda\\mathbf{v}$, $\\mathbf{v}$ is the eigenvector and $\\lambda$ is the eigenvalue.',
    },
  },
  {
    id: 'rank-eigen-027',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'Matrices $A$ and $B$ have $AB$ defined, with $r(A) = 3$ and $r(B) = 2$. What is the largest possible value of $r(AB)$?',
    options: ['$2$', '$3$', '$5$', '$6$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $r(X)$ means the rank of $X$. The rank of a product is limited by both factors:\n\n' +
        '$$r(AB) \\le \\min(r(A), r(B))$$\n\n' +
        'So $r(AB) \\le \\min(3, 2) = 2$.',
      whyWrong: [
        null,
        'This uses the larger rank. The product is limited by **both** factors, so the smaller rank is the limit.',
        'This adds the ranks. Multiplying matrices can never increase the rank beyond that of either factor.',
        'This multiplies the ranks. The limit is the smaller rank, not the product of the ranks.',
      ],
      keyIdea: '$r(AB) \\le \\min(r(A), r(B))$.',
    },
    check: {
      optionValues: [2, 3, 5, 6],
      compute: () => {
        // Rank 3 and rank 2 matrices whose product reaches the limit.
        const A = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        const B = [[1, 0, 0], [0, 1, 0], [0, 0, 0]];
        return rank(matMul(A, B));
      },
    },
  },
  {
    id: 'rank-eigen-028',
    subtopic: 'rank-eigen',
    difficulty: 'foundation',
    stem: 'Which statement is always true for matrices $A$ and $B$ with $AB$ defined?',
    options: ['$r(AB) \\le \\min(r(A), r(B))$', '$r(AB) = r(A) + r(B)$', '$r(AB) = r(A) \\times r(B)$', '$r(AB) \\ge \\max(r(A), r(B))$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $r(X)$ means the rank of $X$. Multiplying matrices can keep or lose independent rows and columns, but it cannot create new ones, so the rank of $AB$ is at most the smaller of $r(A)$ and $r(B)$.',
      whyWrong: [
        null,
        'Ranks do not add under multiplication. With $A = B = I_{2}$, $r(AB) = 2$, not $4$.',
        'Ranks do not multiply either. With $A = B = I_{3}$, $r(AB) = 3$, not $9$.',
        'This has the inequality the wrong way round. A zero matrix times any matrix has rank $0$.',
      ],
      keyIdea: 'A product cannot have a higher rank than either factor.',
    },
  },
  {
    id: 'rank-eigen-029',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'Let $A$ be a $n \\times n$ matrix with $r(A) = n$. Which statement must be true?',
    options: ['$\\det(A) \\ne 0$', '$\\det(A) = 0$', '$A$ is the unit matrix of order $n$', '$A$ has no inverse'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $r(A)$ means the rank of $A$, and $r(A) = n$ is called **full rank**. For a square matrix these three statements go together:\n\n' +
        '$$r(A) = n \\iff A \\text{ is invertible} \\iff \\det(A) \\ne 0$$\n\n' +
        'So $\\det(A) \\ne 0$.',
      whyWrong: [
        null,
        'A zero determinant means the rank is **less** than $n$, which is the opposite of what is given.',
        'The unit matrix of order $n$ (the $n \\times n$ identity) has rank $n$, but so do many other matrices, such as $2I_{n}$.',
        'This reverses the fact. A square matrix of full rank always has an inverse.',
      ],
      keyIdea: 'For a square matrix: full rank, invertible and non-zero determinant all mean the same thing.',
    },
  },
  {
    id: 'rank-eigen-030',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: '$A$ is a $4 \\times 4$ matrix with $\\det(A) = 0$. Which statement must be true?',
    options: ['$r(A) < 4$', '$r(A) = 0$', '$r(A) = 4$', '$A$ is the zero matrix'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $r(A)$ means the rank of $A$. A square matrix has full rank exactly when its determinant is non-zero.\n\n' +
        'Since $\\det(A) = 0$, the rank is less than full: $r(A) < 4$. It could still be $1$, $2$ or $3$.',
      whyWrong: [
        null,
        'A zero determinant does not mean rank $0$. It only means the rank is less than $4$; only the zero matrix has rank $0$.',
        'Rank $4$ would need $\\det A \\ne 0$, which is the opposite of what is given.',
        'Many non-zero matrices have determinant $0$, for example any matrix with two equal rows.',
      ],
      keyIdea: '$\\det(A) = 0$ means the rank is less than full, not that the rank is zero.',
    },
  },
  {
    id: 'rank-eigen-031',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'Can the columns of a $4 \\times 6$ matrix be linearly independent?',
    options: ['No, because the rank is at most $4$', 'Yes, always', 'Yes, if the rank is $6$', 'Yes, if no column is all zeros'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Six independent columns would need rank $6$.\n\n' +
        'But the rank is at most the smaller dimension: $\\min(4, 6) = 4$. So at most $4$ of the $6$ columns can be independent, and the columns are always dependent.',
      whyWrong: [
        null,
        'More columns does not mean more independence. Each column has only $4$ entries, and at most $4$ such vectors can be independent.',
        'A $4 \\times 6$ matrix can never have rank $6$, because the rank is at most the smaller dimension, $4$.',
        'Non-zero columns can still depend on each other. With $6$ columns and rank at most $4$, some column is always a combination of the others.',
      ],
      keyIdea: 'A matrix with more columns than rows always has dependent columns.',
    },
    check: {
      optionValues: ['no', 'always', 'rank 6', 'non-zero columns'],
      compute: () => {
        // Even the fullest possible 4 x 6 matrix reaches only rank 4, short of its 6 columns.
        const M46 = [[1, 0, 0, 0, 1, 2], [0, 1, 0, 0, 3, 1], [0, 0, 1, 0, 2, 5], [0, 0, 0, 1, 7, 4]];
        return rank(M46) < M46[0].length ? 'no' : 'always';
      },
    },
  },
  {
    id: 'rank-eigen-032',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'Let $A$ be a $3 \\times 5$ matrix and $B$ a $5 \\times 3$ matrix with $AB = I_{3}$, the unit matrix of order $3$. What is $r(A)$?',
    options: ['$3$', '$5$', '$2$', '$15$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **unit matrix of order $3$**, $I_{3}$, is the $3 \\times 3$ identity matrix, and it has rank $3$. Here $r(A)$ means the rank of $A$.\n\n' +
        '1. $3 = r(AB) \\le r(A)$, because a product cannot have a higher rank than its factors.\n' +
        '2. $r(A) \\le 3$, because $A$ has only $3$ rows.\n\n' +
        'So $r(A) = 3$.',
      whyWrong: [
        null,
        'This picks $5$ because $A$ has $5$ columns. With only $3$ rows, the rank of $A$ cannot exceed $3$.',
        'This subtracts the dimensions, $5 - 3$. Rank does not come from subtracting, and a rank of $2$ would limit $AB$ to rank $2$, so it could not be $I_{3}$.',
        'This is the number of entries in $A$. The rank counts independent rows.',
      ],
      keyIdea: 'If $AB$ is the unit matrix of order $m$, then $A$ and $B$ both have rank at least $m$.',
    },
    check: {
      optionValues: [3, 5, 2, 15],
      compute: () => {
        const A = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0]];
        const B = transpose(A);
        return JSON.stringify(matMul(A, B)) === JSON.stringify([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) ? rank(A) : NaN;
      },
    },
  },
  {
    id: 'rank-eigen-033',
    subtopic: 'rank-eigen',
    difficulty: 'exam',
    stem: 'Let $A$ and $B$ be $n \\times n$ matrices with $AB = I_{n}$, the unit matrix of order $n$. Which statement must be true?',
    options: ['$r(A) = n$ and $\\det(A) \\ne 0$', '$r(A) < n$', '$\\det(A) = 0$', '$A = B$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **unit matrix of order $n$**, $I_{n}$, is the $n \\times n$ identity matrix, whose determinant is $1$. Here $r(A)$ means the rank of $A$.\n\n' +
        '1. $\\det(A)\\det(B) = \\det(AB) = \\det(I_{n}) = 1$, so $\\det(A) \\ne 0$.\n' +
        '2. A square matrix with a non-zero determinant has full rank, so $r(A) = n$.',
      whyWrong: [
        null,
        'A rank below $n$ would make $\\det A = 0$, and then $\\det A \\det B$ could not equal $1$.',
        'If $\\det A = 0$ then $\\det(AB) = 0$, but $\\det(I_{n}) = 1$.',
        '$AB = I_{n}$ says $B$ is the inverse of $A$, which is usually a different matrix. For example, $A = 2I_{n}$ has $B = \\frac{1}{2}I_{n}$.',
      ],
      keyIdea: 'If $AB = I_{n}$ for square matrices, then $A$ is invertible, so it has full rank and a non-zero determinant.',
    },
  },
];
