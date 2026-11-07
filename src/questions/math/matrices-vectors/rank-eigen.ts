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
      asking: 'Which two numbers are the eigenvalues of this matrix?',
      solution:
        'An **eigenvalue** of $A$ is a number $\\lambda$ (the Greek letter lambda) with $A\\mathbf{v} = \\lambda\\mathbf{v}$ for some non-zero vector $\\mathbf{v}$. In words, $A$ only stretches $\\mathbf{v}$, by a factor of $\\lambda$.\n\n' +
        'To find eigenvalues, solve $\\det(A - \\lambda I) = 0$. Here $A - \\lambda I$ means subtract $\\lambda$ from each entry on the main diagonal (top left to bottom right), and $\\det$ means the determinant, $ad - bc$.\n\n' +
        'That gives $\\begin{vmatrix} 3 - \\lambda & 5 \\\\ 0 & -2 - \\lambda \\end{vmatrix} = (3 - \\lambda)(-2 - \\lambda) - 5 \\times 0$. The 0 below the diagonal removes the second part, leaving $(3 - \\lambda)(-2 - \\lambda) = 0$.\n\n' +
        'A product is 0 only if one bracket is 0. $3 - \\lambda = 0$ gives $\\lambda = 3$, and $-2 - \\lambda = 0$ gives $\\lambda = -2$.',
      conclusion: 'With a 0 below the diagonal, the eigenvalues are the diagonal entries, $3$ and $-2$.',
      whyWrong: [
        'This reads along the **top row** instead of down the main diagonal. The eigenvalues of a triangular matrix are the diagonal entries $3$ and $-2$.',
        'This is a sign slip in the characteristic equation: writing $\\lambda^2 + \\lambda - 6 = 0$ instead of $\\lambda^2 - \\lambda - 6 = 0$ flips both roots.',
        null,
        'These are the off-diagonal entries. Off-diagonal entries do not give eigenvalues; the diagonal entries of a triangular matrix do.',
      ],
      keyIdea: 'If all the entries below (or all above) the main diagonal are 0, the matrix is triangular: read the eigenvalues straight off the diagonal. For any other $2 \\times 2$ matrix, solve $\\det(A - \\lambda I) = 0$.',
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
      asking: 'How many rows of $B$ give genuinely new information?',
      solution:
        'The **rank** of a matrix is the number of **independent** rows. A row is independent if it can\'t be built from the other rows by multiplying them by numbers and adding.\n\n' +
        'Compare the two rows. Doubling row 1, which is $(1, 2, 3)$, gives $(2, 4, 6)$. That is exactly row 2.\n\n' +
        'So row 2 adds nothing new. Row 1 isn\'t all zeros, so it counts. That leaves 1 independent row.',
      conclusion: 'Row 2 is just double row 1, so only one row is independent and the rank is $1$.',
      whyWrong: [
        null,
        'This counts the **rows**, assuming they are independent. Row 2 is twice row 1, so it adds nothing new.',
        'This counts the **columns**. The rank can never exceed the number of rows ($2$ here), and in fact it is only $1$.',
        'Rank $0$ belongs only to the zero matrix. Having a dependent row lowers the rank, but row 1 is non-zero so the rank is at least $1$.',
      ],
      keyIdea: 'To find a rank, look for rows that are multiples or combinations of other rows and cross them out. Count the non-zero rows that remain.',
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
      asking: 'Given the two eigenvalues, what are the trace and determinant of the matrix?',
      solution:
        'An **eigenvalue** of $A$ is a number $\\lambda$ (lambda) with $A\\mathbf{v} = \\lambda\\mathbf{v}$ for some non-zero vector $\\mathbf{v}$: $A$ only stretches $\\mathbf{v}$ by that factor. The **trace** is the sum of the entries on the main diagonal (top left to bottom right). The **determinant** is the number $ad - bc$ for a $2 \\times 2$ matrix.\n\n' +
        'Two rules connect them. The trace equals the **sum** of the eigenvalues. The determinant equals the **product** of the eigenvalues.\n\n' +
        'Add the eigenvalues to get the trace: $3 + (-5) = 3 - 5 = -2$.\n\n' +
        'Multiply them to get the determinant: $3 \\times (-5) = -15$.',
      conclusion: 'The sum gives the trace and the product gives the determinant, so the answer is trace $-2$, determinant $-15$.',
      whyWrong: [
        'The two rules are swapped: the trace is the **sum** of the eigenvalues and the determinant is the **product**.',
        null,
        'This drops the minus sign on $-5$, using $3 + 5$ and $3 \\times 5$.',
        'This reads the trace off the characteristic equation $\\lambda^2 + 2\\lambda - 15 = 0$ without the minus sign. The equation is $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$, so the trace is $-2$.',
      ],
      keyIdea: 'Eigenvalues link to a matrix by two rules: sum of eigenvalues = trace, product of eigenvalues = determinant. Use them in either direction, and bracket negative eigenvalues.',
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
      asking: 'Which of these vectors does $A$ only stretch, without changing its direction?',
      solution:
        'An **eigenvector** of $A$ is a non-zero vector that keeps its direction when multiplied by $A$. So $A\\mathbf{v}$ must be a number times $\\mathbf{v}$. That number is called the **eigenvalue**.\n\n' +
        'The zero vector can\'t count, because the definition needs a non-zero vector.\n\n' +
        'Test the other three by multiplying by $A$, each row times the vector:\n\n| $\\mathbf{v}$ | $A\\mathbf{v}$ | A multiple of $\\mathbf{v}$? |\n|---|---|---|\n| $\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$ | $\\begin{bmatrix} 2 \\times 1 + 1 \\times 0 \\\\ 1 \\times 1 + 2 \\times 0 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}$ | No: 0 can\'t be multiplied up to 1 |\n| $\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}$ | $\\begin{bmatrix} 2 \\times 1 + 1 \\times 2 \\\\ 1 \\times 1 + 2 \\times 2 \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 5 \\end{bmatrix}$ | No: top is times 4, bottom isn\'t |\n| $\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}$ | $\\begin{bmatrix} 2 \\times 1 + 1 \\times 1 \\\\ 1 \\times 1 + 2 \\times 1 \\end{bmatrix} = \\begin{bmatrix} 3 \\\\ 3 \\end{bmatrix}$ | Yes: both are times 3 |',
      conclusion: 'Only one vector comes back as a multiple of itself, with eigenvalue 3, so the eigenvector is $\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}$.',
      whyWrong: [
        `This assumes the standard basis vectors are always eigenvectors. That is only true for diagonal matrices; here $A${V([1, 0])} = ${V([2, 1])}$, which points in a different direction.`,
        'The zero vector satisfies $A\\mathbf{0} = \\lambda\\mathbf{0}$ for every $\\lambda$, which is exactly why the definition requires an eigenvector to be **non-zero**.',
        `Multiplying gives $A${V([1, 2])} = ${V([4, 5])}$, which is not a scalar multiple of $${V([1, 2])}$, so its direction changes.`,
        null,
      ],
      keyIdea: 'To test for an eigenvector, multiply it by the matrix. If the result is the same number times the original vector, it is an eigenvector and that number is its eigenvalue. Reject the zero vector.',
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
      asking: 'How many independent rows does this matrix have?',
      solution:
        'The **rank** is the number of **independent** rows: rows that can\'t be built from the others by multiplying them by numbers and adding.\n\n' +
        'A row of all zeros gives no information, so it never counts. Row 2 is all zeros, so cross it out.\n\n' +
        'Rows 1 and 3 are $(2, 0, 0)$ and $(0, 0, 5)$. Each has its non-zero number in a different column, so no multiple of one can ever make the other. That leaves 2 independent rows.',
      conclusion: 'One row is all zeros and the other two are independent, so the rank is $2$.',
      whyWrong: [
        'This is the size of the matrix. The zero row means only two rows are independent, so the rank is less than $3$.',
        null,
        'This is the trace, the sum of the diagonal entries $2$, $0$ and $5$. The rank counts independent rows, it is not a sum of entries.',
        'This confuses "determinant is $0$" with "rank is $0$". A zero determinant only says the rank is less than full; two rows are still non-zero.',
      ],
      keyIdea: 'For a diagonal matrix, the rank is the number of non-zero diagonal entries. In general, cross out zero rows and rows built from others, then count what is left.',
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
      asking: 'What are the two eigenvalues of $A$?',
      solution:
        'An **eigenvalue** is a number $\\lambda$ (lambda) with $A\\mathbf{v} = \\lambda\\mathbf{v}$ for some non-zero vector $\\mathbf{v}$. To find them, solve the **characteristic equation** $\\det(A - \\lambda I) = 0$, where $I$ is the identity matrix.\n\n' +
        '$A - \\lambda I$ means subtract $\\lambda$ from each entry on the main diagonal (top left to bottom right): $\\begin{bmatrix} 5 - \\lambda & 2 \\\\ 1 & 4 - \\lambda \\end{bmatrix}$.\n\n' +
        'Its determinant, $ad - bc$, is $(5 - \\lambda)(4 - \\lambda) - 2 \\times 1$.\n\n' +
        'Multiply out the bracket: $20 - 5\\lambda - 4\\lambda + \\lambda^{2} = \\lambda^{2} - 9\\lambda + 20$. Take away the 2 to get $\\lambda^{2} - 9\\lambda + 18 = 0$.\n\n' +
        'Factorise. We need two numbers that multiply to 18 and add to $-9$, which are $-3$ and $-6$. So $(\\lambda - 3)(\\lambda - 6) = 0$, giving $\\lambda = 3$ or $\\lambda = 6$.',
      conclusion: 'The eigenvalues are $3$ and $6$. They add to 9, the sum of the diagonal, and multiply to 18, the determinant.',
      whyWrong: [
        'These are the diagonal entries. Reading eigenvalues off the diagonal only works for triangular or diagonal matrices, and this one has non-zero entries on both sides of the diagonal.',
        null,
        'This is a sign slip: using $\\lambda^2 + 9\\lambda + 18 = 0$ (adding the trace term instead of subtracting it) flips both roots.',
        'These are the trace and the determinant, which are the **sum** and **product** of the eigenvalues, not the eigenvalues themselves.',
      ],
      keyIdea: 'For a $2 \\times 2$ matrix, use $\\lambda^{2} - (\\text{trace})\\lambda + \\det = 0$, where the trace is the sum of the diagonal and $\\det$ is $ad - bc$. Factorise, then test that the roots add to the trace.',
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
      asking: 'How many rows of $C$ give genuinely new information?',
      solution:
        'The **rank** is the number of **independent** rows: rows that can\'t be built from the others by multiplying them by numbers and adding.\n\n' +
        'Rows 1 and 2 aren\'t multiples of each other. Multiplying $(1, 2, 3)$ by 4 gives $(4, 8, 12)$, which isn\'t $(4, 5, 6)$. So those two are independent.\n\n' +
        'Can row 3 be built from them? Look at the pattern: each entry goes up by 3 from row 1 to row 2, and up by 3 again from row 2 to row 3. That suggests row 2 doubled, minus row 1.\n\n' +
        'Try it: $2(4, 5, 6) - (1, 2, 3) = (8 - 1, 10 - 2, 12 - 3) = (7, 8, 9)$. That is exactly row 3, so it adds nothing new and only rows 1 and 2 remain.',
      conclusion: 'Row 3 can be built from rows 1 and 2, which are independent, so the rank is $2$.',
      whyWrong: [
        'This assumes three rows must be independent because none is a multiple of another. But $R_3 = 2R_2 - R_1$, so row 3 adds nothing new (and $\\det C = 0$).',
        'Rank $1$ would need every row to be a multiple of a single row. $(4, 5, 6)$ is not a multiple of $(1, 2, 3)$, so the rank is at least $2$.',
        'This confuses $\\det C = 0$ with rank $0$. A zero determinant only means the rank is less than $3$; only the zero matrix has rank $0$.',
        null,
      ],
      keyIdea: 'For a $3 \\times 3$ matrix: if two rows aren\'t multiples, the rank is at least 2. Then test whether the third row is a mix of them. A determinant of 0 confirms that it is.',
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
      asking: 'Which vector gets multiplied by exactly 2 when $A$ acts on it?',
      solution:
        'An **eigenvector** for $\\lambda = 2$ is a non-zero vector $\\mathbf{v}$ with $A\\mathbf{v} = 2\\mathbf{v}$. So $A$ only stretches it, by a factor of 2.\n\n' +
        'Write $\\mathbf{v} = \\begin{bmatrix} x \\\\ y \\end{bmatrix}$ and multiply each row of $A$ by it: $A\\mathbf{v} = \\begin{bmatrix} 3x + y \\\\ 2y \\end{bmatrix}$. We need this to equal $2\\mathbf{v} = \\begin{bmatrix} 2x \\\\ 2y \\end{bmatrix}$.\n\n' +
        'The bottom row says $2y = 2y$, which is always true and tells us nothing.\n\n' +
        'The top row says $3x + y = 2x$. Take $2x$ from both sides to get $x + y = 0$, so $y = -x$.\n\n' +
        'Any non-zero pair with $y = -x$ works. Choosing $x = 1$ gives $y = -1$, so $\\mathbf{v} = \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}$.',
      conclusion: '$A$ turns this vector into $\\begin{bmatrix} 2 \\\\ -2 \\end{bmatrix}$, which is 2 times it. So the eigenvector is $\\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}$.',
      whyWrong: [
        `This is an eigenvector for the **other** eigenvalue: $A${V([1, 0])} = ${V([3, 0])} = 3${V([1, 0])}$, so its eigenvalue is $3$, not $2$.`,
        null,
        `This is a sign slip when solving $x + y = 0$ (taking $y = x$). Check: $A${V([1, 1])} = ${V([4, 2])}$, not a multiple of $${V([1, 1])}$.`,
        `This assumes the second diagonal entry goes with the second standard basis vector, which is only true for diagonal matrices. Here $A${V([0, 1])} = ${V([1, 2])}$.`,
      ],
      keyIdea: 'To find an eigenvector, write $\\mathbf{v}$ with entries $x$ and $y$, set $A\\mathbf{v} = \\lambda\\mathbf{v}$ and find how $y$ relates to $x$. With options given, you can also multiply each one by $A$ and see which is stretched by $\\lambda$.',
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
      asking: 'What must $k$ be for 4 to be an eigenvalue of this matrix?',
      solution:
        'An **eigenvalue** $\\lambda$ of $A$ must satisfy $\\det(A - \\lambda I) = 0$, where $A - \\lambda I$ means subtract $\\lambda$ from each entry on the main diagonal. We are told $\\lambda = 4$ works, so put in 4.\n\n' +
        'Subtract 4 from the two diagonal entries: $A - 4I = \\begin{bmatrix} k - 4 & 2 \\\\ 3 & 1 - 4 \\end{bmatrix} = \\begin{bmatrix} k - 4 & 2 \\\\ 3 & -3 \\end{bmatrix}$.\n\n' +
        'Find its determinant, $ad - bc$: $(k - 4)(-3) - 2 \\times 3 = -3k + 12 - 6 = -3k + 6$.\n\n' +
        'Set it to 0: $-3k + 6 = 0$. Add $3k$ to both sides to get $6 = 3k$, then divide by 3 to get $k = 2$.',
      conclusion: 'With $k = 2$ the matrix has sum of diagonal 3 and determinant $-4$, which fit eigenvalues 4 and $-1$. So $k$ is $2$.',
      whyWrong: [
        'This adds $bc$ instead of subtracting it: $(k - 4)(-3) + 6 = 0$ gives $k = 6$. The determinant is $ad - bc$.',
        'This subtracts $\\lambda$ from the top-left entry only, solving $(k - 4)(1) - 6 = 0$. You must subtract $\\lambda$ from **every** diagonal entry.',
        null,
        'This sets the trace $k + 1$ equal to $4$. The trace is the **sum of both** eigenvalues, not one eigenvalue.',
      ],
      keyIdea: 'When you are given one eigenvalue and asked for an unknown entry: subtract the eigenvalue from the diagonal, set the determinant to 0 and solve. You don\'t need the other eigenvalue.',
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
      asking: 'If 0 is an eigenvalue of $A$, what has to be true about $A$?',
      solution:
        'An **eigenvalue** is a number $\\lambda$ with $A\\mathbf{v} = \\lambda\\mathbf{v}$ for some non-zero vector $\\mathbf{v}$. A useful rule: the **determinant** of a square matrix, which is a single number worked out from it, equals the product of all its eigenvalues.\n\n' +
        'A $3 \\times 3$ matrix has three eigenvalues. Call them $0$, $\\lambda_{2}$ and $\\lambda_{3}$. Then $\\det A = 0 \\times \\lambda_{2} \\times \\lambda_{3}$.\n\n' +
        'Anything multiplied by 0 is 0, so this product must be 0, whatever the other two eigenvalues are.',
      conclusion: 'One eigenvalue of 0 makes the whole product 0, so the statement that must be true is $\\det A = 0$.',
      whyWrong: [
        'This is the opposite of the truth: $\\det A = 0$, and a matrix with zero determinant has **no** inverse.',
        'Only one eigenvalue is $0$. The diagonal matrix with entries $1, 2, 0$ has eigenvalue $0$ but is not the zero matrix.',
        null,
        'The trace is the **sum** of the eigenvalues; one of them being $0$ does not make the sum $0$ (for $1, 2, 0$ the trace is $3$). It is the **product** that becomes $0$.',
      ],
      keyIdea: 'Product of eigenvalues = determinant, and sum of eigenvalues = trace. To reject a "must be true" claim, try one example, such as a diagonal matrix with entries 1, 2, 0.',
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
      asking: 'Which value of $k$ leaves this matrix with just one independent row?',
      solution:
        'The **rank** is the number of **independent** rows: rows that can\'t be built from the others. Rank 1 means only one row is independent, so row 2 must be a multiple of row 1.\n\n' +
        'Find the multiplier from the first column, which has no unknown. Row 1 starts with 1 and row 2 starts with 3, so row 2 must be 3 times row 1.\n\n' +
        'Apply the same multiplier to the second column. Row 1 has 2 there, so row 2 must have $3 \\times 2 = 6$. That entry is $k$, so $k = 6$.',
      conclusion: 'With $k = 6$ row 2 is $(3, 6)$, exactly 3 times $(1, 2)$. So the rank is 1 when $k$ is $6$.',
      whyWrong: [
        'This cross-multiplies the wrong pair, solving $1 \\times 2 = 3k$. Row 2 must be $3$ times row 1, so $k = 3 \\times 2 = 6$.',
        'This uses $\\det A = ad + bc$, giving $k + 6 = 0$. The determinant is $ad - bc$.',
        'This makes row 2 equal to row 1 **plus** $2$: $(1 + 2, 2 + 2) = (3, 4)$. Dependent rows must be scalar **multiples**, not shifted by adding a number.',
        null,
      ],
      keyIdea: 'For rank 1, every row must be a multiple of one row. Find the multiplier from a column with no unknown, then apply it to the unknown. For a $2 \\times 2$ matrix, $ad - bc = 0$ also works.',
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
      asking: 'What is the determinant of this matrix, worked out from its eigenvalues?',
      solution:
        'An **eigenvalue** is a number $\\lambda$ with $A\\mathbf{v} = \\lambda\\mathbf{v}$ for some non-zero vector $\\mathbf{v}$. This matrix has only zeros below the main diagonal, so it is **triangular**, and its eigenvalues are its diagonal entries.\n\n' +
        'Read them off the diagonal: $2$, $-3$ and $5$.\n\n' +
        'The **determinant**, a single number worked out from a square matrix, equals the **product** of the eigenvalues, so $\\det A = 2 \\times (-3) \\times 5$.\n\n' +
        'Multiply in two stages: $2 \\times (-3) = -6$, then $-6 \\times 5 = -30$.',
      conclusion: 'The eigenvalues are 2, $-3$ and 5, and their product gives $\\det A$ as $-30$.',
      whyWrong: [
        'This is the **sum** of the eigenvalues, $2 - 3 + 5 = 4$, which is the trace. The determinant is the **product**.',
        null,
        'This drops the negative sign of $-3$. An odd number of negative factors makes the product negative.',
        'This assumes the zeros below the diagonal make the determinant $0$. A determinant is $0$ only if an eigenvalue (here a diagonal entry) is $0$.',
      ],
      keyIdea: 'For a triangular matrix, the eigenvalues are the diagonal entries and the determinant is their product. Count the negative numbers: an odd count means a negative result.',
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
      asking: 'What are the two eigenvalues of $S$?',
      solution:
        'An **eigenvalue** is a number $\\lambda$ (lambda) that solves $\\det(S - \\lambda I) = 0$. Here $S - \\lambda I$ means subtract $\\lambda$ from each entry on the main diagonal: $\\begin{bmatrix} 2 - \\lambda & 3 \\\\ 3 & 2 - \\lambda \\end{bmatrix}$.\n\n' +
        'Its determinant, $ad - bc$, is $(2 - \\lambda)(2 - \\lambda) - 3 \\times 3 = (2 - \\lambda)^{2} - 9$.\n\n' +
        'Set it to 0 and add 9 to both sides: $(2 - \\lambda)^{2} = 9$.\n\n' +
        'Take the square root. A number squared gives 9 if it is 3 or $-3$, so $2 - \\lambda = 3$ or $2 - \\lambda = -3$.\n\n' +
        'Solve each one for $\\lambda$. $2 - \\lambda = 3$ gives $\\lambda = -1$, and $2 - \\lambda = -3$ gives $\\lambda = 5$.',
      conclusion: 'The eigenvalues are $5$ and $-1$. They add to 4, the sum of the diagonal, and multiply to $-5$, the determinant.',
      whyWrong: [
        'This is a sign slip on the trace term: $\\lambda^2 + 4\\lambda - 5 = 0$ gives $-5$ and $1$. The characteristic equation is $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$.',
        'These are just the two different entries of the matrix. The matrix is not triangular, so the eigenvalues must come from the characteristic equation.',
        null,
        'This forgets to square root: from $(2 - \\lambda)^2 = 9$ it uses $2 - \\lambda = \\pm 9$ instead of $\\pm 3$.',
      ],
      keyIdea: 'For a matrix of the form $\\begin{bmatrix} a & b \\\\ b & a \\end{bmatrix}$, the determinant step gives $(a - \\lambda)^{2} = b^{2}$. So the eigenvalues are $a + b$ and $a - b$.',
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
      asking: 'Which vector gets multiplied by exactly 5 when $A$ acts on it?',
      solution:
        'An **eigenvector** for the eigenvalue 5 is a non-zero vector $\\mathbf{v}$ with $A\\mathbf{v} = 5\\mathbf{v}$. Rearranging gives $(A - 5I)\\mathbf{v} = \\mathbf{0}$, where $I$ is the identity matrix.\n\n' +
        '$A - 5I$ means subtract 5 from each entry on the main diagonal: $\\begin{bmatrix} 1 - 5 & 2 \\\\ 4 & 3 - 5 \\end{bmatrix} = \\begin{bmatrix} -4 & 2 \\\\ 4 & -2 \\end{bmatrix}$.\n\n' +
        'Multiply this by $\\mathbf{v} = \\begin{bmatrix} x \\\\ y \\end{bmatrix}$. The first row gives $-4x + 2y = 0$. The second row gives $4x - 2y = 0$, the same equation with the signs flipped, so one is enough.\n\n' +
        'Solve it. Add $4x$ to both sides to get $2y = 4x$, then divide by 2 to get $y = 2x$.\n\n' +
        'Any non-zero pair with $y = 2x$ works. Choosing $x = 1$ gives $y = 2$, so $\\mathbf{v} = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}$.',
      conclusion: '$A$ turns this vector into $\\begin{bmatrix} 5 \\\\ 10 \\end{bmatrix}$, which is 5 times it. So the eigenvector is $\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}$.',
      whyWrong: [
        `This is the first column of $A$. A column of $A$ is not an eigenvector in general: $A${V([1, 4])} = ${V([9, 16])}$, not a multiple of $${V([1, 4])}$.`,
        `This swaps $x$ and $y$ when solving $y = 2x$. Check: $A${V([2, 1])} = ${V([4, 11])}$, not a multiple of $${V([2, 1])}$.`,
        `This is the eigenvector for the **other** eigenvalue: $A${V([1, -1])} = ${V([-1, 1])} = -1 \\times ${V([1, -1])}$.`,
        null,
      ],
      keyIdea: 'To find an eigenvector: subtract the eigenvalue from the main diagonal, write one row as an equation equal to 0, and find how $y$ relates to $x$. Pick a simple $x$. Any non-zero multiple is also correct.',
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
      asking: 'If $A$ has eigenvalues 2 and $-3$, what are the eigenvalues of $A^{2} + I$?',
      solution:
        'An **eigenvalue** $\\lambda$ goes with a non-zero vector $\\mathbf{v}$ such that $A\\mathbf{v} = \\lambda\\mathbf{v}$. In other words, $A$ acting on $\\mathbf{v}$ just multiplies it by $\\lambda$.\n\n' +
        'Apply $A$ twice: $A^{2}\\mathbf{v} = A(\\lambda\\mathbf{v}) = \\lambda(A\\mathbf{v}) = \\lambda^{2}\\mathbf{v}$. So $A^{2}$ multiplies $\\mathbf{v}$ by $\\lambda^{2}$.\n\n' +
        '$I$ is the identity matrix, so $I\\mathbf{v} = \\mathbf{v}$. Adding gives $(A^{2} + I)\\mathbf{v} = \\lambda^{2}\\mathbf{v} + \\mathbf{v} = (\\lambda^{2} + 1)\\mathbf{v}$. So each eigenvalue $\\lambda$ becomes $\\lambda^{2} + 1$.\n\n' +
        'Put in each eigenvalue, with brackets around the negative one: $2^{2} + 1 = 4 + 1 = 5$, and $(-3)^{2} + 1 = 9 + 1 = 10$.',
      conclusion: 'Each eigenvalue $\\lambda$ becomes $\\lambda^{2} + 1$, so the new eigenvalues are $5$ and $10$.',
      whyWrong: [
        'These are the eigenvalues of $A^2$; the $+I$ adds $1$ to every eigenvalue, which was forgotten.',
        null,
        'This squares $-3$ as $-3^2 = -9$ instead of $(-3)^2 = 9$. Always bracket a negative number before squaring.',
        'These are the eigenvalues of $A + I$: the squaring step was skipped.',
      ],
      keyIdea: 'Whatever you do to the matrix, do to each eigenvalue: $A^{2}$ squares them and $A + kI$ adds $k$. So replace $A$ with $\\lambda$ in the expression and calculate. Bracket negative values before squaring.',
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
      asking: 'What are the ranks of $A$ and $B$, if multiplying them gives the unit matrix?',
      solution:
        'The **rank** $r(X)$ counts the independent rows of $X$: rows that can\'t be built from the others. This always equals the number of independent columns. So a rank can\'t be more than the number of rows or the number of columns.\n\n' +
        'Find an upper limit. $A$ has $m$ rows and $B$ has $m$ columns, so $r(A) \\le m$ and $r(B) \\le m$.\n\n' +
        'Now find a lower limit. A product can\'t have a higher rank than either factor, so $r(AB) \\le r(A)$ and $r(AB) \\le r(B)$.\n\n' +
        '$AB$ equals $I_{m}$, the unit matrix (1s on the main diagonal, 0s elsewhere). Each of its $m$ rows has its 1 in a different column, so all are independent and $r(AB) = m$. So $m \\le r(A)$ and $m \\le r(B)$.\n\n' +
        'Each rank is at most $m$ and at least $m$, so each must be exactly $m$.',
      conclusion: 'Both ranks are squeezed between the two limits, so $r(A) = m$, $r(B) = m$.',
      whyWrong: [
        null,
        'This takes the rank of $B$ to be $n$ because $B$ has $n$ rows. But $B$ has only $m$ columns, so its rank is at most $m$, which is less than $n$.',
        'This takes the rank of $A$ to be $n$ because $A$ has $n$ columns. But $A$ has only $m$ rows, so its rank is at most $m$, which is less than $n$.',
        'This uses the larger dimension for both. A rank can never exceed the smaller dimension, which is $m$ for each matrix.',
      ],
      keyIdea: 'For rank questions with products, find two limits. The smaller dimension gives an upper limit. $r(AB) \\le \\min(r(A), r(B))$ gives a lower limit when you know $r(AB)$. If they agree, you have the rank.',
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
      asking: 'What can we always say about the rank of $PQ$, given that $q$ is smaller than $p$?',
      solution:
        'The **rank** $r(X)$ counts the independent rows of $X$: rows that can\'t be built from the others. This always equals the number of independent columns. So a rank can\'t be more than the number of rows or the number of columns.\n\n' +
        '$P$ is $p \\times q$, so it has only $q$ columns. That means $r(P) \\le q$.\n\n' +
        'A product can\'t have a higher rank than either of its factors, so $r(PQ) \\le r(P)$.\n\n' +
        'Put the two together: $r(PQ) \\le r(P) \\le q$.',
      conclusion: '$PQ$ is $p \\times p$, but its rank can never pass $q$. So the statement that is always true is $r(PQ) \\le q$.',
      whyWrong: [
        null,
        'This picks $p$ because $PQ$ is $p \\times p$. The size only gives an upper limit; here the rank is at most $q$, which is less than $p$.',
        'A $p \\times p$ matrix is invertible only when its rank is $p$, but here the rank is at most $q < p$.',
        'Rank does not come from subtracting dimensions. If $P$ and $Q$ are zero matrices then $r(PQ) = 0$, while $p - q > 0$.',
      ],
      keyIdea: 'The rank of a product is limited by the smallest dimension of its factors, even if the product itself is bigger. Write down each factor\'s dimensions and take the smallest.',
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
      asking: 'What is the largest rank a matrix with 3 rows and 5 columns can have?',
      solution:
        'The **rank** is the number of **independent** rows: rows that can\'t be built from the others by multiplying them by numbers and adding. It also equals the number of independent columns.\n\n' +
        'So a rank can\'t be more than the number of rows, and it can\'t be more than the number of columns. Here those limits are 3 and 5.\n\n' +
        'The smaller limit wins, which is 3. It can be reached: the rows $(1, 0, 0, 0, 0)$, $(0, 1, 0, 0, 0)$ and $(0, 0, 1, 0, 0)$ are all independent.',
      conclusion: 'With only 3 rows, at most 3 can be independent, so the maximum rank is $3$.',
      whyWrong: [
        null,
        'This uses the larger dimension. There are only $3$ rows, so at most $3$ rows can be independent.',
        'This adds the dimensions. The rank is limited by the smaller dimension, not their sum.',
        'This is the number of entries, $3 \\times 5$. The rank counts independent rows, not entries.',
      ],
      keyIdea: 'The largest possible rank of any matrix is the smaller of its two dimensions: $\\min(\\text{rows}, \\text{columns})$.',
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
      asking: 'What is the biggest rank a matrix with fewer rows than columns can have?',
      solution:
        'The **rank** $r(A)$ is the number of **independent** rows of $A$: rows that can\'t be built from the others. It also equals the number of independent columns.\n\n' +
        '$A$ is $p \\times q$, meaning $p$ rows and $q$ columns. So the rank can\'t be more than $p$, and it can\'t be more than $q$.\n\n' +
        'We are told $p < q$, so $p$ is the tighter limit. For example, a $2 \\times 3$ matrix has at most rank 2, which is $p$.',
      conclusion: 'There are only $p$ rows and $p$ is the smaller dimension, so the largest possible value of $r(A)$ is $p$.',
      whyWrong: [
        null,
        'This picks $q$ because $A$ has $q$ columns. With only $p$ rows, at most $p$ rows can be independent, and $p < q$.',
        'This adds the dimensions. The rank is limited by the smaller dimension, not their sum.',
        'This is the number of entries in $A$. The rank counts independent rows, not entries.',
      ],
      keyIdea: 'The largest rank is the smaller of the two dimensions. With letters, use the given inequality to see which is smaller, and try small numbers such as $2 \\times 3$ to test your choice.',
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
      asking: 'What does the word rank mean for a matrix?',
      solution:
        'A row is **linearly independent** if you can\'t build it by multiplying the other rows by numbers and adding them. In $\\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}$, row 2 is twice row 1, so it isn\'t independent of row 1.\n\n' +
        'The **rank** counts how many rows are left once you remove any that can be built from others. That example has two rows but rank 1.',
      conclusion: 'So the rank is the maximum number of linearly independent rows.',
      whyWrong: [
        null,
        'This counts every row. A row that is a multiple of another row adds nothing, so it does not raise the rank.',
        'This counts entries. $\\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}$ has four non-zero entries but rank $1$.',
        'The determinant is a different number, and it exists only for square matrices. It tells you whether a square matrix has full rank, not what the rank is.',
      ],
      keyIdea: 'Think of rank as the number of rows that carry new information. Cross out any row that is a multiple or a mix of others, then count what is left.',
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
      asking: 'What is the rank of the $m \\times m$ matrix with 1s on its diagonal and 0s elsewhere?',
      solution:
        'The **rank** is the number of **independent** rows: rows that can\'t be built from the others. The unit matrix $I_{m}$ has $m$ rows, with 1s on the main diagonal and 0s elsewhere.\n\n' +
        'Each row has its 1 in a different column. Row 1 has it in column 1, row 2 in column 2, and so on.\n\n' +
        'To build a row from the others, you would need to make that 1. Every other row has 0 in that column, so they can\'t. All $m$ rows are independent.',
      conclusion: 'No row can be built from the others, so all of them count and $r(I_{m})$ is $m$.',
      whyWrong: [
        null,
        'This reads "unit" as "rank one". Each row of $I_{m}$ has its $1$ in a different column, so all $m$ rows count.',
        'Only the zero matrix has rank $0$. Having many zero entries does not make the rank zero.',
        'This is the number of entries in $I_{m}$. The rank counts independent rows, and there are only $m$ rows.',
      ],
      keyIdea: 'If each row has a non-zero entry in a column where all the other rows have 0, every row is independent. So the rank equals the number of rows.',
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
      asking: 'What is the name of the number $\\lambda$ in the equation $A\\mathbf{v} = \\lambda\\mathbf{v}$?',
      solution:
        'Read the equation in words. Multiplying the vector $\\mathbf{v}$ by the matrix $A$ gives the same vector multiplied by an ordinary number, $\\lambda$ (lambda). So $A$ only stretches $\\mathbf{v}$.\n\n' +
        'That stretch number $\\lambda$ is called an **eigenvalue**, and the vector $\\mathbf{v}$ is called an **eigenvector**. For example, $\\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix}\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} = 2\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$, so 2 is an eigenvalue.',
      conclusion: '$\\lambda$ is the stretch factor in the equation, which makes it an eigenvalue of $A$.',
      whyWrong: [
        null,
        'The eigenvector is the vector $\\mathbf{v}$. Here $\\lambda$ is a number, the stretch factor.',
        'The rank counts independent rows. It does not appear in the equation $A\\mathbf{v} = \\lambda\\mathbf{v}$.',
        'The trace is the sum of the diagonal entries, which equals the sum of **all** the eigenvalues, not one of them.',
      ],
      keyIdea: 'In $A\\mathbf{v} = \\lambda\\mathbf{v}$, the bold letter is a vector, called the eigenvector, and the plain letter is a number, called the eigenvalue. Use that to match each name to its symbol.',
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
      asking: 'What is the biggest rank the product $AB$ could have?',
      solution:
        'The **rank** $r(X)$ counts the independent rows of $X$: rows that can\'t be built from the others. This always equals the number of independent columns.\n\n' +
        'Multiplying can\'t create new independent rows or columns. Every row of $AB$ is built from the rows of $B$, and every column of $AB$ is built from the columns of $A$. So $r(AB) \\le r(B)$ and $r(AB) \\le r(A)$.\n\n' +
        'Both limits hold, so the smaller rank is the limit: $r(AB) \\le \\min(3, 2)$, which is 2. It can be reached: if $A$ is the $3 \\times 3$ unit matrix, then $AB = B$, which has rank 2.',
      conclusion: 'The rank of a product can\'t pass the smaller rank, so the largest possible value of $r(AB)$ is $2$.',
      whyWrong: [
        null,
        'This uses the larger rank. The product is limited by **both** factors, so the smaller rank is the limit.',
        'This adds the ranks. Multiplying matrices can never increase the rank beyond that of either factor.',
        'This multiplies the ranks. The limit is the smaller rank, not the product of the ranks.',
      ],
      keyIdea: 'The rank of a product is at most the smaller rank: $r(AB) \\le \\min(r(A), r(B))$. Like a chain, it is only as strong as its weakest link. Ranks never add or multiply.',
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
      asking: 'What rule always links the rank of $AB$ to the ranks of $A$ and $B$?',
      solution:
        'The **rank** $r(X)$ counts the independent rows of $X$: rows that can\'t be built from the others. It always equals the number of independent columns too.\n\n' +
        'Each row of $AB$ is made by adding multiples of the rows of $B$. So $AB$ can\'t have more independent rows than $B$, which gives $r(AB) \\le r(B)$.\n\n' +
        'Each column of $AB$ is made by adding multiples of the columns of $A$. So $AB$ can\'t have more independent columns than $A$, which gives $r(AB) \\le r(A)$.\n\n' +
        'Both limits hold at once, so $r(AB)$ is at most the smaller of the two ranks.',
      conclusion: 'That is the rule $r(AB) \\le \\min(r(A), r(B))$.',
      whyWrong: [
        null,
        'Ranks do not add under multiplication. With $A = B = I_{2}$, $r(AB) = 2$, not $4$.',
        'Ranks do not multiply either. With $A = B = I_{3}$, $r(AB) = 3$, not $9$.',
        'This has the inequality the wrong way round. A zero matrix times any matrix has rank $0$.',
      ],
      keyIdea: 'Test rank rules on simple cases. $A = B = I_{2}$, the $2 \\times 2$ unit matrix (1s on the main diagonal, 0s elsewhere), gives $r(AB) = 2$, which rules out adding and multiplying ranks. A zero matrix for $A$ rules out any rule with $\\ge$.',
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
      asking: 'If an $n \\times n$ matrix has rank $n$, what must be true about it?',
      solution:
        'The **rank** is the number of **independent** rows: rows that can\'t be built from the others. $r(A) = n$ means all $n$ rows are independent, which is called **full rank**.\n\n' +
        'The **determinant** is a single number worked out from a square matrix. It is 0 exactly when some row can be built from the others. For example, $\\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}$ has determinant $4 - 4 = 0$.\n\n' +
        'Here no row can be built from the others, so the determinant can\'t be 0.',
      conclusion: 'All $n$ rows are independent, so the determinant is non-zero: $\\det(A) \\ne 0$.',
      whyWrong: [
        null,
        'A zero determinant means the rank is **less** than $n$, which is the opposite of what is given.',
        'The unit matrix of order $n$ (the $n \\times n$ identity) has rank $n$, but so do many other matrices, such as $2I_{n}$.',
        'This reverses the fact. A square matrix of full rank always has an inverse.',
      ],
      keyIdea: 'For a square matrix, these all mean the same thing: full rank, $\\det \\ne 0$, has an inverse. Given any one of them, you can state the others.',
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
      asking: 'What does a zero determinant tell us about the rank of a $4 \\times 4$ matrix?',
      solution:
        'The **rank** $r(A)$ is the number of **independent** rows: rows that can\'t be built from the others. A $4 \\times 4$ matrix has rank 4 only if all 4 rows are independent.\n\n' +
        'The **determinant** is a single number worked out from a square matrix. It is 0 exactly when at least one row can be built from the others. So here, not all 4 rows are independent.\n\n' +
        'That means the rank is below 4. It could be 0, 1, 2 or 3, and the determinant alone can\'t tell us which.',
      conclusion: 'A zero determinant only rules out full rank, so the statement that must be true is $r(A) < 4$.',
      whyWrong: [
        null,
        'A zero determinant does not mean rank $0$. It only means the rank is less than $4$; only the zero matrix has rank $0$.',
        'Rank $4$ would need $\\det A \\ne 0$, which is the opposite of what is given.',
        'Many non-zero matrices have determinant $0$, for example any matrix with two equal rows.',
      ],
      keyIdea: '$\\det = 0$ means not full rank, and says nothing more. To reject a "must be true" claim, try an example: a matrix with two equal rows has determinant 0, yet it isn\'t the zero matrix.',
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
      asking: 'Can all 6 columns of a $4 \\times 6$ matrix be independent of each other?',
      solution:
        'Columns are **linearly independent** if none of them can be built from the others by multiplying them by numbers and adding. Here that would take 6 independent columns.\n\n' +
        'The **rank** of a matrix is its number of independent rows, and this always equals its number of independent columns.\n\n' +
        'A $4 \\times 6$ matrix has only 4 rows, so its rank can\'t be more than 4. So at most 4 columns can be independent.\n\n' +
        'There are 6 columns, so at least 2 of them can always be built from the others.',
      conclusion: 'Six columns can\'t all be independent when only 4 can be, so the answer is: No, because the rank is at most $4$.',
      whyWrong: [
        null,
        'More columns does not mean more independence. Each column has only $4$ entries, and at most $4$ such vectors can be independent.',
        'A $4 \\times 6$ matrix can never have rank $6$, because the rank is at most the smaller dimension, $4$.',
        'Non-zero columns can still depend on each other. With $6$ columns and rank at most $4$, some column is always a combination of the others.',
      ],
      keyIdea: 'More columns than rows means the columns can\'t all be independent, because rank is at most the smaller dimension. Likewise, more rows than columns means the rows can\'t all be independent.',
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
      asking: 'What is the rank of $A$, given that $AB$ is the $3 \\times 3$ unit matrix?',
      solution:
        'The **rank** $r(X)$ counts the independent rows of $X$: rows that can\'t be built from the others. Start with an upper limit: $A$ has only 3 rows, so $r(A) \\le 3$.\n\n' +
        '$I_{3}$ has 1s on the main diagonal and 0s elsewhere, so each row has its 1 in a different column. All 3 rows are independent, so $r(AB) = r(I_{3}) = 3$.\n\n' +
        'A product can\'t have a higher rank than either factor, so $r(AB) \\le r(A)$. That gives a lower limit: $3 \\le r(A)$.\n\n' +
        '$r(A)$ is at most 3 and at least 3, so it must be exactly 3.',
      conclusion: 'The two limits meet, so $r(A)$ is $3$.',
      whyWrong: [
        null,
        'This picks $5$ because $A$ has $5$ columns. With only $3$ rows, the rank of $A$ cannot exceed $3$.',
        'This subtracts the dimensions, $5 - 3$. Rank does not come from subtracting, and a rank of $2$ would limit $AB$ to rank $2$, so it could not be $I_{3}$.',
        'This is the number of entries in $A$. The rank counts independent rows.',
      ],
      keyIdea: 'Squeeze the rank between two limits. The smaller dimension gives the upper limit. $r(AB) \\le r(A)$ gives the lower limit when you know $r(AB)$.',
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
      asking: 'If $AB$ is the unit matrix, what must be true about $A$?',
      solution:
        '$I_{n}$ is the unit matrix: 1s on the main diagonal and 0s elsewhere. Its **determinant** (the single number worked out from a square matrix) is 1.\n\n' +
        'Take the determinant of both sides of $AB = I_{n}$. The determinant of a product is the product of the determinants, so $\\det(A) \\times \\det(B) = 1$.\n\n' +
        'If $\\det(A)$ were 0, the left side would be 0, not 1. So $\\det(A) \\ne 0$.\n\n' +
        'The **rank** $r(A)$ is the number of independent rows: rows that can\'t be built from the others. A square matrix with a non-zero determinant has all its rows independent, so $r(A) = n$.',
      conclusion: 'Both facts hold, so the true statement is $r(A) = n$ and $\\det(A) \\ne 0$.',
      whyWrong: [
        null,
        'A rank below $n$ would make $\\det A = 0$, and then $\\det A \\det B$ could not equal $1$.',
        'If $\\det A = 0$ then $\\det(AB) = 0$, but $\\det(I_{n}) = 1$.',
        '$AB = I_{n}$ says $B$ is the inverse of $A$, which is usually a different matrix. For example, $A = 2I_{n}$ has $B = \\frac{1}{2}I_{n}$.',
      ],
      keyIdea: 'When a product of square matrices equals $I$, take determinants of both sides. Neither factor can have determinant 0, so both have full rank and an inverse.',
    },
  },
];
