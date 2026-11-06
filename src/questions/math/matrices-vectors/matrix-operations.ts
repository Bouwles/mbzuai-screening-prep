import type { StaticQuestion } from '../../../types';
import { matMul, transpose, type Mat } from '../../../lib/mathx';
import { matrix } from '../../../lib/tex';

// Inline matrix as rich text, e.g. T([[1, 2], [3, 4]]) -> "$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$".
const T = (rows: (number | string)[][]) => `$${matrix(rows)}$`;
// Matrix -> comparable string for answer checks.
const J = (a: Mat) => JSON.stringify(a);
const add = (a: Mat, b: Mat): Mat => a.map((r, i) => r.map((v, j) => v + b[i][j]));
const scale = (k: number, a: Mat): Mat => a.map((r) => r.map((v) => k * v));
const identity = (n: number): Mat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
const zeros = (r: number, c: number): Mat => Array.from({ length: r }, () => Array(c).fill(0));
/** Order "rxc" of a product of matrices given only their shapes, or 'undefined' if some step is not allowed. */
function productOrder(...shapes: [number, number][]): string {
  let cur = shapes[0];
  for (const s of shapes.slice(1)) {
    if (cur[1] !== s[0]) return 'undefined';
    cur = [cur[0], s[1]];
  }
  return `${cur[0]}x${cur[1]}`;
}
const isSymmetric = (a: Mat) => a.length === a[0].length && J(a) === J(transpose(a));
type Shape = [number, number];
/** The pairs of shapes whose product is (or is not) defined, as "3x4,4x2" keys. */
const pairsWhere = (defined: boolean, pairs: [Shape, Shape][]) =>
  pairs
    .filter(([a, b]) => (productOrder(a, b) !== 'undefined') === defined)
    .map(([a, b]) => `${a[0]}x${a[1]},${b[0]}x${b[1]}`)
    .join('|');

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'matrix-operations-001',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: `What is the order (dimensions) of the matrix ${T([[5, -2], [0, 7], [3, 1]])}?`,
    options: ['$2 \\times 3$', '$3 \\times 2$', '$6$', '$5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The order of a matrix is written **rows** $\\times$ **columns** (always rows first).\n\n' +
        '- Count the rows (horizontal lines): $\\begin{bmatrix} 5 & -2 \\end{bmatrix}$, $\\begin{bmatrix} 0 & 7 \\end{bmatrix}$, $\\begin{bmatrix} 3 & 1 \\end{bmatrix}$, so there are 3 rows.\n' +
        '- Count the columns (vertical lines): each row has 2 entries, so there are 2 columns.\n\n' +
        'So the order is $3 \\times 2$ ("3 by 2").',
      whyWrong: [
        'This writes columns first and rows second. The convention is always rows $\\times$ columns, so this matrix is $3 \\times 2$, not $2 \\times 3$.',
        null,
        'This is the number of **entries** ($3 \\times 2 = 6$), not the order. The order must say how many rows and how many columns there are.',
        'This adds the number of rows and columns ($3 + 2$). The order is written as rows $\\times$ columns, not as a single number.',
      ],
      keyIdea: 'The order of a matrix is rows $\\times$ columns, rows always first.',
    },
    check: {
      optionValues: ['2x3', '3x2', '6', '5'],
      compute: () => {
        const A = [[5, -2], [0, 7], [3, 1]];
        return `${A.length}x${A[0].length}`;
      },
    },
  },
  {
    id: 'matrix-operations-002',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: `Let $A = ${matrix([[2, -1, 4, 9], [6, 3, -5, 1], [-7, 8, 2, 10]])}$. What is the entry $a_{23}$?`,
    options: ['$8$', '$10$', '$5$', '$-5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'In $a_{ij}$ the **first** number $i$ is the row and the **second** number $j$ is the column, both counted from 1.\n\n' +
        '- $a_{23}$ means row 2, column 3.\n' +
        '- Row 2 is $\\begin{bmatrix} 6 & 3 & -5 & 1 \\end{bmatrix}$.\n' +
        '- Its 3rd entry is $-5$.\n\n' +
        'So $a_{23} = -5$.',
      whyWrong: [
        'This is $a_{32}$ (row 3, column 2). It mixes up the order: the first subscript is the row, the second is the column.',
        'This counts rows and columns from 0, which lands on row 3, column 4. In maths, $a_{23}$ counts from 1, so it is row 2, column 3.',
        'This finds the right position (row 2, column 3) but drops the minus sign. The entry is $-5$.',
        null,
      ],
      keyIdea: 'In $a_{ij}$, $i$ is the row and $j$ is the column, both counted from 1.',
    },
    check: {
      optionValues: [8, 10, 5, -5],
      compute: () => {
        const A = [[2, -1, 4, 9], [6, 3, -5, 1], [-7, 8, 2, 10]];
        return A[2 - 1][3 - 1];
      },
    },
  },
  {
    id: 'matrix-operations-003',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: `Let $A = ${matrix([[3, -1], [2, 4]])}$ and $B = ${matrix([[1, 5], [-2, 3]])}$. Find $2A - B$.`,
    options: [T([[5, -7], [6, 5]]), T([[4, -12], [8, 2]]), T([[2, -6], [4, 1]]), T([[5, -7], [2, 5]])],
    correctIndex: 0,
    markScheme: {
      solution:
        'Scalar multiplication multiplies **every** entry; subtraction works entry by entry.\n\n' +
        `First $2A = ${matrix([[6, -2], [4, 8]])}$.\n\n` +
        'Now subtract $B$ entry by entry:\n\n' +
        `$$2A - B = ${matrix([['6 - 1', '-2 - 5'], ['4 - (-2)', '8 - 3']])} = ${matrix([[5, -7], [6, 5]])}$$\n\n` +
        'Take care with $4 - (-2) = 4 + 2 = 6$.',
      whyWrong: [
        null,
        'This is $2(A - B)$: it doubles $B$ as well. Only $A$ is multiplied by 2.',
        'This is $A - B$: it forgets to multiply $A$ by 2 first.',
        'This slips on the bottom-left entry, working out $4 - (-2)$ as $2$. Subtracting a negative number adds it: $4 - (-2) = 6$.',
      ],
      keyIdea: 'Scalar multiplication and addition/subtraction of matrices are done entry by entry.',
    },
    check: {
      optionValues: [J([[5, -7], [6, 5]]), J([[4, -12], [8, 2]]), J([[2, -6], [4, 1]]), J([[5, -7], [2, 5]])],
      compute: () => J(add(scale(2, [[3, -1], [2, 4]]), scale(-1, [[1, 5], [-2, 3]]))),
    },
  },
  {
    id: 'matrix-operations-004',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: '$A$ is a $3 \\times 2$ matrix and $B$ is a $2 \\times 4$ matrix. What is the order of the product $AB$?',
    options: ['$2 \\times 2$', '$4 \\times 3$', '$3 \\times 4$', '$AB$ is not defined'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write the orders side by side: $(3 \\times 2)(2 \\times 4)$.\n\n' +
        '- The **inner** numbers (columns of $A$, rows of $B$) are $2$ and $2$. They match, so $AB$ is defined.\n' +
        '- The **outer** numbers give the order of the answer: $3 \\times 4$.\n\n' +
        'So $AB$ is a $3 \\times 4$ matrix.',
      whyWrong: [
        'This uses the **inner** numbers. The inner numbers only have to match; the order of the product comes from the outer numbers, $3 \\times 4$.',
        'This writes the outer numbers backwards. The product has the rows of $A$ (3) and the columns of $B$ (4), so it is $3 \\times 4$.',
        null,
        'The product **is** defined: $A$ has 2 columns and $B$ has 2 rows, and those are the numbers that must match.',
      ],
      keyIdea: '$(m \\times n)(n \\times p)$ gives an $m \\times p$ matrix: inner numbers must match, outer numbers give the answer.',
    },
    check: {
      optionValues: ['2x2', '4x3', '3x4', 'undefined'],
      compute: () => {
        const P = matMul(zeros(3, 2), zeros(2, 4));
        return `${P.length}x${P[0].length}`;
      },
    },
  },
  {
    id: 'matrix-operations-005',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: `Let $A = ${matrix([[4, -2], [1, 5]])}$ and let $I$ be the $2 \\times 2$ identity matrix. Find $A - 2I$.`,
    options: [T([[2, -4], [-1, 3]]), T([[3, -2], [1, 4]]), T([[4, -4], [-1, 5]]), T([[2, -2], [1, 3]])],
    correctIndex: 3,
    markScheme: {
      solution:
        `The identity matrix has 1s on the main diagonal (top-left to bottom-right) and 0s everywhere else: $I = ${matrix([[1, 0], [0, 1]])}$.\n\n` +
        `So $2I = ${matrix([[2, 0], [0, 2]])}$.\n\n` +
        `$$A - 2I = ${matrix([['4 - 2', '-2'], ['1', '5 - 2']])} = ${matrix([[2, -2], [1, 3]])}$$\n\n` +
        'Only the diagonal entries change.',
      whyWrong: [
        'This subtracts 2 from **every** entry, as if $I$ were a matrix full of 1s. The identity has 0s off the diagonal, so the off-diagonal entries stay the same.',
        'This is $A - I$: it forgets to multiply $I$ by 2.',
        'This puts the 2s on the wrong diagonal (top-right to bottom-left). The identity has its 1s on the main diagonal, top-left to bottom-right.',
        null,
      ],
      keyIdea: '$A - kI$ only changes the main-diagonal entries of $A$: subtract $k$ from each of them.',
    },
    check: {
      optionValues: [J([[2, -4], [-1, 3]]), J([[3, -2], [1, 4]]), J([[4, -4], [-1, 5]]), J([[2, -2], [1, 3]])],
      compute: () => J(add([[4, -2], [1, 5]], scale(-2, identity(2)))),
    },
  },
  {
    id: 'matrix-operations-006',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: 'Which of the following matrices is **symmetric**?',
    options: [
      T([[1, 4, -2], [-4, 3, 5], [2, -5, 0]]),
      T([[2, 7, 1], [3, 5, 7], [6, 3, 2]]),
      T([[1, 4, -2], [4, 3, 5], [-2, 5, 0]]),
      T([[1, 4, -2], [4, 3, 5], [-2, 6, 0]]),
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'A matrix is symmetric when $A^{T} = A$, which means $a_{ij} = a_{ji}$ for every pair: the matrix is a mirror image of itself across the **main diagonal** (top-left to bottom-right).\n\n' +
        'Check the three pairs of mirror positions in each matrix:\n\n' +
        `For ${T([[1, 4, -2], [4, 3, 5], [-2, 5, 0]])}:\n\n` +
        '- $a_{12} = 4$ and $a_{21} = 4$\n' +
        '- $a_{13} = -2$ and $a_{31} = -2$\n' +
        '- $a_{23} = 5$ and $a_{32} = 5$\n\n' +
        'All three pairs match, so this matrix is symmetric. (The diagonal entries $1, 3, 0$ can be anything.)',
      whyWrong: [
        'Here each mirror pair has opposite signs ($a_{12} = 4$ but $a_{21} = -4$). The sizes match but the signs do not, and symmetric needs $a_{ij} = a_{ji}$ exactly, sign included.',
        'This matrix is a mirror image across the **other** diagonal (top-right to bottom-left). Symmetric means a mirror across the main diagonal: here $a_{12} = 7$ but $a_{21} = 3$.',
        null,
        'The first row and first column match, but $a_{23} = 5$ while $a_{32} = 6$. Every mirror pair must be checked, not just the first row.',
      ],
      keyIdea: 'Symmetric means $A^{T} = A$: every entry equals its mirror image across the main diagonal ($a_{ij} = a_{ji}$).',
    },
    check: {
      optionValues: [
        J([[1, 4, -2], [-4, 3, 5], [2, -5, 0]]),
        J([[2, 7, 1], [3, 5, 7], [6, 3, 2]]),
        J([[1, 4, -2], [4, 3, 5], [-2, 5, 0]]),
        J([[1, 4, -2], [4, 3, 5], [-2, 6, 0]]),
      ],
      compute: () =>
        [
          [[1, 4, -2], [-4, 3, 5], [2, -5, 0]],
          [[2, 7, 1], [3, 5, 7], [6, 3, 2]],
          [[1, 4, -2], [4, 3, 5], [-2, 5, 0]],
          [[1, 4, -2], [4, 3, 5], [-2, 6, 0]],
        ]
          .filter(isSymmetric)
          .map(J)
          .join(' | '),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'matrix-operations-007',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `Let $A = ${matrix([[2, 1], [3, -1]])}$ and $B = ${matrix([[4, 1], [-2, 5]])}$. Find $AB$.`,
    options: [T([[8, 1], [-6, -5]]), T([[11, 3], [11, -7]]), T([[9, 1], [11, -11]]), T([[6, 7], [14, -2]])],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each entry of $AB$ is **row of $A$** times **column of $B$**: multiply matching entries and add.\n\n' +
        '- $(AB)_{11}$: row 1 of $A$ with column 1 of $B$: $2 \\times 4 + 1 \\times (-2) = 8 - 2 = 6$\n' +
        '- $(AB)_{12}$: row 1 of $A$ with column 2 of $B$: $2 \\times 1 + 1 \\times 5 = 2 + 5 = 7$\n' +
        '- $(AB)_{21}$: row 2 of $A$ with column 1 of $B$: $3 \\times 4 + (-1) \\times (-2) = 12 + 2 = 14$\n' +
        '- $(AB)_{22}$: row 2 of $A$ with column 2 of $B$: $3 \\times 1 + (-1) \\times 5 = 3 - 5 = -2$\n\n' +
        `So $AB = ${matrix([[6, 7], [14, -2]])}$.`,
      whyWrong: [
        'This multiplies entries in the same position ($2 \\times 4$, $1 \\times 1$, ...). That is not matrix multiplication: each entry must be a row of $A$ times a column of $B$.',
        'This is $BA$ (rows of $B$ times columns of $A$). Matrix multiplication is not commutative, so the order matters.',
        'This multiplies rows of $A$ by **rows** of $B$ (which gives $AB^{T}$). Each entry must use a row of $A$ and a **column** of $B$.',
        null,
      ],
      keyIdea: 'Entry $(i, j)$ of $AB$ is row $i$ of $A$ times column $j$ of $B$ (multiply matching entries and add).',
    },
    check: {
      optionValues: [J([[8, 1], [-6, -5]]), J([[11, 3], [11, -7]]), J([[9, 1], [11, -11]]), J([[6, 7], [14, -2]])],
      compute: () => J(matMul([[2, 1], [3, -1]], [[4, 1], [-2, 5]])),
    },
  },
  {
    id: 'matrix-operations-008',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `Let $A = ${matrix([[1, 2, -1], [3, -2, 4]])}$ and $B = ${matrix([[2, 1], [5, -3], [3, 2]])}$. What is the entry in row 2, column 1 of $AB$?`,
    options: ['$-7$', '$8$', '$-4$', '$28$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '$A$ is $2 \\times 3$ and $B$ is $3 \\times 2$, so $AB$ is defined and is $2 \\times 2$.\n\n' +
        'The entry in row 2, column 1 uses **row 2 of $A$** and **column 1 of $B$**:\n\n' +
        '- Row 2 of $A$: $3, -2, 4$\n' +
        '- Column 1 of $B$: $2, 5, 3$\n\n' +
        '$$(AB)_{21} = 3 \\times 2 + (-2) \\times 5 + 4 \\times 3 = 6 - 10 + 12 = 8$$',
      whyWrong: [
        'This is the entry in row 1, column 2 (row 1 of $A$ with column 2 of $B$: $1 - 6 - 2 = -7$). The row number comes first.',
        null,
        'This is row 2, column 1 of $BA$ (row 2 of $B$ with column 1 of $A$: $5 \\times 1 + (-3) \\times 3 = -4$). The order of the product matters.',
        'This loses the minus sign in $(-2) \\times 5$, giving $6 + 10 + 12 = 28$. A negative times a positive is negative.',
      ],
      keyIdea: 'To get one entry of a product you only need one row of the first matrix and one column of the second.',
    },
    check: {
      optionValues: [-7, 8, -4, 28],
      compute: () => matMul([[1, 2, -1], [3, -2, 4]], [[2, 1], [5, -3], [3, 2]])[1][0],
    },
  },
  {
    id: 'matrix-operations-009',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is a $2 \\times 3$ matrix and $B$ is a $3 \\times 2$ matrix. Which statement is **true**?',
    options: [
      '$AB$ is defined but $BA$ is not defined',
      '$AB$ is a $2 \\times 2$ matrix and $BA$ is a $3 \\times 3$ matrix, so $AB \\ne BA$',
      '$AB = BA$, because both products are defined',
      '$AB$ is a $3 \\times 3$ matrix and $BA$ is a $2 \\times 2$ matrix',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Check each product with the "inner numbers match, outer numbers give the answer" rule.\n\n' +
        '- $AB$: $(2 \\times 3)(3 \\times 2)$. Inner numbers $3, 3$ match, so it is defined; outer numbers give $2 \\times 2$.\n' +
        '- $BA$: $(3 \\times 2)(2 \\times 3)$. Inner numbers $2, 2$ match, so it is defined; outer numbers give $3 \\times 3$.\n\n' +
        'Both products exist, but they have **different sizes**, so they cannot be equal. This is one example of matrix multiplication not being commutative.',
      whyWrong: [
        '$BA$ is also defined: $B$ has 2 columns and $A$ has 2 rows, so the inner numbers match. It is a $3 \\times 3$ matrix.',
        null,
        'Being defined does not make two products equal. Here $AB$ is $2 \\times 2$ and $BA$ is $3 \\times 3$, so they cannot even be the same size. In general $AB \\ne BA$.',
        'This uses the inner numbers instead of the outer numbers. $(2 \\times 3)(3 \\times 2)$ gives $2 \\times 2$, and $(3 \\times 2)(2 \\times 3)$ gives $3 \\times 3$.',
      ],
      keyIdea: 'Matrix multiplication is not commutative: $AB$ and $BA$ may have different sizes, and even when both are square they are usually different.',
    },
  },
  {
    id: 'matrix-operations-010',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `Let $A = ${matrix([[1, 2], [-1, 3]])}$ and $B = ${matrix([[2, 1], [4, -1]])}$. Find $(AB)^{T}$.`,
    options: [T([[10, -1], [10, -4]]), T([[1, 5], [7, 5]]), T([[10, 10], [-1, -4]]), T([[1, 7], [5, 5]])],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: find $AB$** (row of $A$ times column of $B$).\n\n' +
        '- $(AB)_{11} = 1 \\times 2 + 2 \\times 4 = 10$\n' +
        '- $(AB)_{12} = 1 \\times 1 + 2 \\times (-1) = -1$\n' +
        '- $(AB)_{21} = (-1) \\times 2 + 3 \\times 4 = 10$\n' +
        '- $(AB)_{22} = (-1) \\times 1 + 3 \\times (-1) = -4$\n\n' +
        `So $AB = ${matrix([[10, -1], [10, -4]])}$.\n\n` +
        '**Step 2: transpose** (rows become columns).\n\n' +
        `$$(AB)^{T} = ${matrix([[10, 10], [-1, -4]])}$$\n\n` +
        `**Check** with the rule $(AB)^{T} = B^{T}A^{T}$ (the order reverses): $B^{T}A^{T} = ${matrix([[2, 4], [1, -1]])}${matrix([[1, -1], [2, 3]])} = ${matrix([['2 + 8', '-2 + 12'], ['1 - 2', '-1 - 3']])} = ${matrix([[10, 10], [-1, -4]])}$, the same answer. Multiplying in the wrong order, $A^{T}B^{T}$, gives a different matrix.`,
      whyWrong: [
        'This is $AB$ itself: it forgets the final transpose (swap rows and columns).',
        'This is $A^{T}B^{T}$, which equals $(BA)^{T}$. The rule is $(AB)^{T} = B^{T}A^{T}$: the order must reverse.',
        null,
        'This is $BA$. It multiplies in the wrong order and also forgets to transpose.',
      ],
      keyIdea: 'The transpose of a product reverses the order: $(AB)^{T} = B^{T}A^{T}$.',
    },
    check: {
      optionValues: [J([[10, -1], [10, -4]]), J([[1, 5], [7, 5]]), J([[10, 10], [-1, -4]]), J([[1, 7], [5, 5]])],
      compute: () => J(transpose(matMul([[1, 2], [-1, 3]], [[2, 1], [4, -1]]))),
    },
  },
  {
    id: 'matrix-operations-011',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is $2 \\times 3$, $B$ is $3 \\times 4$ and $C$ is $4 \\times 2$. Which of the following products is **not** defined?',
    options: ['$ABC$', '$CA$', '$BA$', '$A^{T}A$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A product is defined when the number of columns of the left matrix equals the number of rows of the right matrix. Go through each option:\n\n' +
        '- $ABC$: $(2 \\times 3)(3 \\times 4)$ gives $2 \\times 4$; then $(2 \\times 4)(4 \\times 2)$ gives $2 \\times 2$. Defined.\n' +
        '- $CA$: $(4 \\times 2)(2 \\times 3)$ gives $4 \\times 3$. Defined.\n' +
        '- $BA$: $(3 \\times 4)(2 \\times 3)$. Inner numbers are $4$ and $2$, which do not match. **Not defined.**\n' +
        '- $A^{T}A$: $A^{T}$ is $3 \\times 2$, so $(3 \\times 2)(2 \\times 3)$ gives $3 \\times 3$. Defined.',
      whyWrong: [
        '$ABC$ is defined: $AB$ is $2 \\times 4$ and $(2 \\times 4)(4 \\times 2)$ gives a $2 \\times 2$ matrix. Check one product at a time.',
        '$CA$ is defined: $(4 \\times 2)(2 \\times 3)$ has matching inner numbers and gives $4 \\times 3$. Order matters, but this order works.',
        null,
        '$A^{T}A$ is always defined: transposing $A$ ($2 \\times 3$) gives $3 \\times 2$, and $(3 \\times 2)(2 \\times 3)$ gives $3 \\times 3$.',
      ],
      keyIdea: 'Write the orders next to each other: a product is defined only when the inner numbers match.',
    },
    check: {
      optionValues: ['ABC', 'CA', 'BA', 'ATA'],
      compute: () => {
        const A: [number, number] = [2, 3];
        const B: [number, number] = [3, 4];
        const C: [number, number] = [4, 2];
        const AT: [number, number] = [A[1], A[0]];
        const products: Record<string, [number, number][]> = { ABC: [A, B, C], CA: [C, A], BA: [B, A], ATA: [AT, A] };
        return Object.keys(products)
          .filter((k) => productOrder(...products[k]) === 'undefined')
          .join(',');
      },
    },
  },
  {
    id: 'matrix-operations-012',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is a $3 \\times 2$ matrix and $B$ is a $3 \\times 4$ matrix. What is the order of $A^{T}B$?',
    options: ['$4 \\times 2$', '$3 \\times 3$', '$A^{T}B$ is not defined', '$2 \\times 4$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Transposing swaps rows and columns, so $A^{T}$ is $2 \\times 3$.\n\n' +
        'Now $A^{T}B$ is $(2 \\times 3)(3 \\times 4)$:\n\n' +
        '- inner numbers $3$ and $3$ match, so it is defined;\n' +
        '- outer numbers give the order: $2 \\times 4$.',
      whyWrong: [
        'This writes the outer numbers in reverse order. The product has the rows of $A^{T}$ (2) and the columns of $B$ (4), so it is $2 \\times 4$.',
        'This uses the **inner** numbers of $(2 \\times 3)(3 \\times 4)$. Those only have to match; the outer numbers give the order.',
        'This forgets to transpose $A$ first: $AB$ would be $(3 \\times 2)(3 \\times 4)$, which is not defined. But $A^{T}$ is $2 \\times 3$, so $A^{T}B$ is defined.',
        null,
      ],
      keyIdea: 'If $A$ is $m \\times n$ then $A^{T}$ is $n \\times m$; then apply the inner/outer rule.',
    },
    check: {
      optionValues: ['4x2', '3x3', 'undefined', '2x4'],
      compute: () => {
        const A: [number, number] = [3, 2];
        return productOrder([A[1], A[0]], [3, 4]);
      },
    },
  },
  {
    id: 'matrix-operations-013',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `Find $x$ and $y$ if $2${matrix([['x', 3], [1, 'y']])} + ${matrix([[1, -2], [4, 3]])} = ${matrix([[7, 4], [6, -5]])}$.`,
    options: ['$x = 6$, $y = -8$', '$x = 3$, $y = -4$', '$x = 4$, $y = -1$', '$x = 3$, $y = -1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        `First multiply out: $2${matrix([['x', 3], [1, 'y']])} = ${matrix([['2x', 6], [2, '2y']])}$.\n\n` +
        `Add the second matrix entry by entry: $${matrix([['2x + 1', 4], [6, '2y + 3']])} = ${matrix([[7, 4], [6, -5]])}$.\n\n` +
        'Two matrices are equal when **every** matching entry is equal:\n\n' +
        '- Top-left: $2x + 1 = 7$, so $2x = 6$ and $x = 3$.\n' +
        '- Bottom-right: $2y + 3 = -5$, so $2y = -8$ and $y = -4$.\n' +
        '- The other two entries ($4 = 4$ and $6 = 6$) agree, as they should.\n\n' +
        'So $x = 3$, $y = -4$.',
      whyWrong: [
        'This solves $2x = 6$ and $2y = -8$ correctly but forgets to divide by 2 at the end.',
        null,
        'This adds the second matrix to the right-hand side instead of subtracting it: $2x = 7 + 1$ and $2y = -5 + 3$.',
        'The value of $x$ is right, but $y$ comes from a sign slip: it adds the 3 to the right-hand side ($2y = -5 + 3 = -2$) instead of subtracting it ($2y = -5 - 3 = -8$).',
      ],
      keyIdea: 'Equal matrices have equal entries in every position, so a matrix equation gives one ordinary equation per entry.',
    },
    check: {
      optionValues: ['6,-8', '3,-4', '4,-1', '3,-1'],
      compute: () => {
        const B = [[1, -2], [4, 3]];
        const C = [[7, 4], [6, -5]];
        // brute force: integer x, y with 2X + B = C
        for (let x = -20; x <= 20; x++)
          for (let y = -20; y <= 20; y++) {
            const S = add(scale(2, [[x, 3], [1, y]]), B);
            if (J(S) === J(C)) return `${x},${y}`;
          }
        return 'none';
      },
    },
  },
  {
    id: 'matrix-operations-014',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `Let $A = ${matrix([[1, 2], [3, -1]])}$. Find $A^{2}$.`,
    options: [T([[7, 0], [0, 7]]), T([[1, 4], [9, 1]]), T([[2, 4], [6, -2]]), T([[5, 1], [1, 10]])],
    correctIndex: 0,
    markScheme: {
      solution:
        '$A^{2}$ means $A \\times A$ (matrix multiplication), **not** squaring each entry.\n\n' +
        '- $(A^{2})_{11} = 1 \\times 1 + 2 \\times 3 = 7$\n' +
        '- $(A^{2})_{12} = 1 \\times 2 + 2 \\times (-1) = 0$\n' +
        '- $(A^{2})_{21} = 3 \\times 1 + (-1) \\times 3 = 0$\n' +
        '- $(A^{2})_{22} = 3 \\times 2 + (-1) \\times (-1) = 7$\n\n' +
        `So $A^{2} = ${matrix([[7, 0], [0, 7]])} = 7I$.`,
      whyWrong: [
        null,
        'This squares each entry separately. $A^{2}$ is the matrix product $AA$: rows of $A$ times columns of $A$.',
        'This is $2A$ (doubling every entry), not $A \\times A$.',
        'This is $AA^{T}$: it multiplies rows of $A$ by rows of $A$. For $A^{2}$, use rows of the first $A$ and **columns** of the second.',
      ],
      keyIdea: '$A^{2} = AA$ is a matrix product; it is not found by squaring the entries.',
    },
    check: {
      optionValues: [J([[7, 0], [0, 7]]), J([[1, 4], [9, 1]]), J([[2, 4], [6, -2]]), J([[5, 1], [1, 10]])],
      compute: () => {
        const A = [[1, 2], [3, -1]];
        return J(matMul(A, A));
      },
    },
  },
  {
    id: 'matrix-operations-015',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `Let $D = ${matrix([[2, 0], [0, 3]])}$ and $A = ${matrix([[1, 4], [5, 2]])}$. Find $DA$.`,
    options: [T([[2, 12], [10, 6]]), T([[2, 4], [5, 6]]), T([[2, 0], [0, 6]]), T([[2, 8], [15, 6]])],
    correctIndex: 3,
    markScheme: {
      solution:
        '$D$ is a **diagonal** matrix (zeros off the main diagonal). Multiply as usual, row of $D$ times column of $A$:\n\n' +
        '- $(DA)_{11} = (2)(1) + (0)(5) = 2$\n' +
        '- $(DA)_{12} = (2)(4) + (0)(2) = 8$\n' +
        '- $(DA)_{21} = (0)(1) + (3)(5) = 15$\n' +
        '- $(DA)_{22} = (0)(4) + (3)(2) = 6$\n\n' +
        `So $DA = ${matrix([[2, 8], [15, 6]])}$.\n\n` +
        '**Shortcut:** a diagonal matrix on the **left** multiplies each **row** of $A$ by the matching diagonal entry (row 1 times 2, row 2 times 3). On the right ($AD$) it would scale the columns instead.',
      whyWrong: [
        'This is $AD$, which scales the **columns** of $A$ (column 1 times 2, column 2 times 3). With $D$ on the left, the **rows** are scaled.',
        'This multiplies only the diagonal entries of $A$ by 2 and 3 and leaves the rest alone. Every entry in row 2 must be multiplied by 3.',
        'This multiplies entries in matching positions (so the zeros of $D$ wipe out entries). Matrix multiplication uses rows times columns.',
        null,
      ],
      keyIdea: 'Multiplying by a diagonal matrix on the left scales the rows; on the right it scales the columns.',
    },
    check: {
      optionValues: [J([[2, 12], [10, 6]]), J([[2, 4], [5, 6]]), J([[2, 0], [0, 6]]), J([[2, 8], [15, 6]])],
      compute: () => J(matMul([[2, 0], [0, 3]], [[1, 4], [5, 2]])),
    },
  },
  {
    id: 'matrix-operations-016',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: 'Arrays are indexed from 1, and `A[i][j]` is the entry in row `i`, column `j`. What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source:
        'A = [[1, 2], [3, 4]]\n' +
        'B = [[2, 0], [1, 3]]\n' +
        's = 0\n' +
        'for k = 1 to 2\n' +
        '   s = s + A[2][k] * B[k][1]\n' +
        'end for\n' +
        'print(s)',
    },
    options: ['`4`', '`6`', '`10`', '`12`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The loop multiplies row 2 of `A` by column 1 of `B`, entry by entry, and adds the results. That is the entry in row 2, column 1 of the matrix product $AB$.\n\n' +
        '| `k` | `A[2][k]` | `B[k][1]` | `s` |\n' +
        '|---|---|---|---|\n' +
        '| 1 | 3 | 2 | 6 |\n' +
        '| 2 | 4 | 1 | 10 |\n\n' +
        'So the program prints `10`.',
      whyWrong: [
        'This uses row 1 of `A` (`1*2 + 2*1`). The code reads `A[2][k]`, which is row 2.',
        'This stops after the first pass, when `s` is 6. The loop `for k = 1 to 2` includes `k = 2`.',
        null,
        'This uses column 2 of `B` (`3*0 + 4*3`). The code reads `B[k][1]`, which walks down column 1.',
      ],
      keyIdea: 'Adding `A[i][k] * B[k][j]` over `k` gives the entry in row `i`, column `j` of the product $AB$.',
    },
    check: {
      optionValues: [4, 6, 10, 12],
      compute: () => {
        const A = [[1, 2], [3, 4]];
        const B = [[2, 0], [1, 3]];
        let s = 0;
        for (let k = 1; k <= 2; k++) s += A[2 - 1][k - 1] * B[k - 1][1 - 1];
        return s;
      },
    },
  },
  {
    id: 'matrix-operations-017',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `For which value(s) of $k$ is the matrix $A = ${matrix([[1, 'k^{2}', 3], [4, 2, 'k + 1'], [3, -1, 0]])}$ symmetric?`,
    options: ['$k = 2$', '$k = 2$ or $k = -2$', 'No value of $k$ makes $A$ symmetric', '$k = -2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Symmetric means $a_{ij} = a_{ji}$ for **every** pair of mirror positions. There are three pairs:\n\n' +
        '- $a_{13} = 3$ and $a_{31} = 3$: already equal.\n' +
        '- $a_{12} = a_{21}$: $k^{2} = 4$, so $k = 2$ or $k = -2$.\n' +
        '- $a_{23} = a_{32}$: $k + 1 = -1$, so $k = -2$.\n\n' +
        'Both conditions must hold at the same time. Only $k = -2$ satisfies both.\n\n' +
        'Check: with $k = -2$, $k^{2} = 4$ and $k + 1 = -1$, so $A = ' +
        matrix([[1, 4, 3], [4, 2, -1], [3, -1, 0]]) +
        '$, which equals its transpose.',
      whyWrong: [
        'This uses only the first pair ($k^{2} = 4$) and takes the positive root. With $k = 2$, $a_{23} = 3$ but $a_{32} = -1$, so $A$ is not symmetric.',
        'This solves $k^{2} = 4$ but never checks the second pair. $k = 2$ makes $a_{23} = 3 \\ne -1$, so only $k = -2$ works.',
        'This tries only $k = 2$ (the positive root) and gives up. The negative root $k = -2$ satisfies both conditions.',
        null,
      ],
      keyIdea: 'For symmetry every mirror pair $a_{ij} = a_{ji}$ must hold simultaneously; solve each condition and keep the values common to all.',
    },
    check: {
      optionValues: [2, null, null, -2],
      compute: () => {
        const ok: number[] = [];
        for (let k = -10; k <= 10; k++) {
          const A = [[1, k * k, 3], [4, 2, k + 1], [3, -1, 0]];
          if (isSymmetric(A)) ok.push(k);
        }
        return ok.length === 1 ? ok[0] : ok.join(',');
      },
    },
  },
  {
    id: 'matrix-operations-019',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is a $2 \\times 3$ matrix (with no special pattern in its entries). Which of the following is **always** a symmetric matrix?',
    options: ['$A + A^{T}$', '$A^{2}$', '$AA^{T}$', '$(A^{T})^{T}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A symmetric matrix must be **square** and satisfy $M^{T} = M$. Check each option.\n\n' +
        '- $A + A^{T}$: $A$ is $2 \\times 3$ and $A^{T}$ is $3 \\times 2$. Different sizes cannot be added, so this is not even defined.\n' +
        '- $A^{2} = AA$: $(2 \\times 3)(2 \\times 3)$, inner numbers $3$ and $2$ do not match. Not defined.\n' +
        '- $AA^{T}$: $(2 \\times 3)(3 \\times 2)$ gives a $2 \\times 2$ matrix. Using $(XY)^{T} = Y^{T}X^{T}$:\n\n' +
        '$$(AA^{T})^{T} = (A^{T})^{T}A^{T} = AA^{T}$$\n\n' +
        'so $AA^{T}$ equals its own transpose: it is always symmetric.\n' +
        '- $(A^{T})^{T}$ is just $A$, a $2 \\times 3$ matrix. It is not square, so it cannot be symmetric.',
      whyWrong: [
        '$A + A^{T}$ is symmetric when $A$ is **square**, but here $A$ is $2 \\times 3$ and $A^{T}$ is $3 \\times 2$, so they cannot be added.',
        '$A^{2}$ is not defined for a non-square matrix: $(2 \\times 3)(2 \\times 3)$ has inner numbers $3$ and $2$.',
        null,
        'Transposing twice gives back $A$ itself, which is $2 \\times 3$. A non-square matrix can never be symmetric.',
      ],
      keyIdea: '$(AA^{T})^{T} = (A^{T})^{T}A^{T} = AA^{T}$, so $AA^{T}$ is symmetric for any matrix $A$.',
    },
  },
  {
    id: 'matrix-operations-021',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: `Let $A = ${matrix([[1, 2], [3, 1]])}$ and $B = ${matrix([[1, -1], [2, 1]])}$. Find $(A + B)^{2}$.`,
    options: [T([[16, 4], [20, 2]]), T([[6, 2], [10, 6]]), T([[4, 1], [25, 4]]), T([[9, 4], [20, 9]])],
    correctIndex: 3,
    markScheme: {
      solution:
        'The safest route is to add first, then square.\n\n' +
        `**Step 1:** $A + B = ${matrix([['1 + 1', '2 + (-1)'], ['3 + 2', '1 + 1']])} = ${matrix([[2, 1], [5, 2]])}$.\n\n` +
        '**Step 2:** square it (multiply it by itself):\n\n' +
        '- top-left: $2 \\times 2 + 1 \\times 5 = 9$\n' +
        '- top-right: $2 \\times 1 + 1 \\times 2 = 4$\n' +
        '- bottom-left: $5 \\times 2 + 2 \\times 5 = 20$\n' +
        '- bottom-right: $5 \\times 1 + 2 \\times 2 = 9$\n\n' +
        `So $(A + B)^{2} = ${matrix([[9, 4], [20, 9]])}$.\n\n` +
        '**Why the usual expansion fails:** $(A + B)^{2} = (A + B)(A + B) = A^{2} + AB + BA + B^{2}$. Because $AB \\ne BA$ for matrices, you cannot combine $AB + BA$ into $2AB$. Here ' +
        `$AB = ${matrix([[5, 1], [5, -2]])}$ but $BA = ${matrix([[-2, 1], [5, 5]])}$.`,
      whyWrong: [
        'This is $A^{2} + 2AB + B^{2}$. That expansion assumes $AB = BA$, which is false for these matrices. The correct expansion is $A^{2} + AB + BA + B^{2}$.',
        'This is $A^{2} + B^{2}$: it drops the cross terms $AB + BA$ completely.',
        'This squares each entry of $A + B$ separately. Squaring a matrix means multiplying it by itself (rows times columns).',
        null,
      ],
      keyIdea: 'For matrices $(A + B)^{2} = A^{2} + AB + BA + B^{2}$, which is not $A^{2} + 2AB + B^{2}$ unless $AB = BA$.',
    },
    check: {
      optionValues: [J([[16, 4], [20, 2]]), J([[6, 2], [10, 6]]), J([[4, 1], [25, 4]]), J([[9, 4], [20, 9]])],
      compute: () => {
        const S = add([[1, 2], [3, 1]], [[1, -1], [2, 1]]);
        return J(matMul(S, S));
      },
    },
  },
  // ------------------------------------------------------------------ foundation: products and definitions
  {
    id: 'matrix-operations-022',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: 'Which of the following matrix products is **not** defined?',
    options: [
      'a $3 \\times 4$ matrix with a $4 \\times 2$',
      'a $2 \\times 5$ matrix with a $5 \\times 5$',
      'a $3 \\times 2$ matrix with a $3 \\times 2$',
      'a $1 \\times 3$ matrix with a $3 \\times 1$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Inner dimensions must match; outer dimensions give the size. The columns of the first matrix must equal the rows of the second.\n\n' +
        '- $(3 \\times 4)(4 \\times 2)$: inner $4$ and $4$ match, giving $3 \\times 2$.\n' +
        '- $(2 \\times 5)(5 \\times 5)$: inner $5$ and $5$ match, giving $2 \\times 5$.\n' +
        '- $(3 \\times 2)(3 \\times 2)$: inner $2$ and $3$ do not match, so this product is **not defined**.\n' +
        '- $(1 \\times 3)(3 \\times 1)$: inner $3$ and $3$ match, giving $1 \\times 1$.',
      whyWrong: [
        'This product is defined: the inner dimensions $4$ and $4$ match. The outer numbers differing does not matter; they only give the size, $3 \\times 2$.',
        'This product is defined: the inner dimensions $5$ and $5$ match. A square second matrix causes no problem, and the result is $2 \\times 5$.',
        null,
        'This product is defined: the inner dimensions $3$ and $3$ match. A $1 \\times 1$ result is still a valid matrix.',
      ],
      keyIdea: 'Inner dimensions must match; outer dimensions give the size.',
    },
    check: {
      optionValues: ['3x4,4x2', '2x5,5x5', '3x2,3x2', '1x3,3x1'],
      compute: () => pairsWhere(false, [[[3, 4], [4, 2]], [[2, 5], [5, 5]], [[3, 2], [3, 2]], [[1, 3], [3, 1]]]),
    },
  },
  {
    id: 'matrix-operations-023',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: 'Which of the following matrix products **is** defined?',
    options: [
      'a $2 \\times 3$ matrix times a $2 \\times 3$ matrix',
      'a $4 \\times 2$ matrix times a $2 \\times 5$ matrix',
      'a $2 \\times 4$ matrix times a $3 \\times 2$ matrix',
      'a $3 \\times 5$ matrix times a $4 \\times 3$ matrix',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'A product is defined when the columns of the left matrix equal the rows of the right matrix (the inner dimensions match).\n\n' +
        '- $(2 \\times 3)(2 \\times 3)$: inner $3$ and $2$, not defined.\n' +
        '- $(4 \\times 2)(2 \\times 5)$: inner $2$ and $2$ match, so it is defined and gives $4 \\times 5$.\n' +
        '- $(2 \\times 4)(3 \\times 2)$: inner $4$ and $3$, not defined.\n' +
        '- $(3 \\times 5)(4 \\times 3)$: inner $5$ and $4$, not defined.',
      whyWrong: [
        'Having the same order does not make a product defined. Same order is the condition for **adding** matrices; here the inner dimensions are $3$ and $2$.',
        null,
        'This order fails because the inner dimensions are $4$ and $3$. The product would only work the other way round, $(3 \\times 2)(2 \\times 4)$, and order matters.',
        'This matches the **outer** dimensions ($3$ and $3$) instead of the inner ones. The inner dimensions are $5$ and $4$, so it is not defined.',
      ],
      keyIdea: 'Compare the columns of the left matrix with the rows of the right matrix; nothing else decides whether a product exists.',
    },
    check: {
      optionValues: ['2x3,2x3', '4x2,2x5', '2x4,3x2', '3x5,4x3'],
      compute: () => pairsWhere(true, [[[2, 3], [2, 3]], [[4, 2], [2, 5]], [[2, 4], [3, 2]], [[3, 5], [4, 3]]]),
    },
  },
  {
    id: 'matrix-operations-024',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: 'What is the **unit matrix of order $m$**?',
    options: [
      'The $m \\times m$ matrix with $1$s on the main diagonal and $0$s elsewhere',
      'The $m \\times m$ matrix with every entry equal to $1$',
      'The $m \\times 1$ matrix with every entry equal to $1$',
      'The $m \\times m$ matrix with every entry equal to $0$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **unit matrix of order $m$**, written $I_{m}$, is another name for the $m \\times m$ identity matrix: $1$s on the main diagonal (top-left to bottom-right) and $0$s everywhere else.\n\n' +
        `For example, $I_{2} = ${matrix([[1, 0], [0, 1]])}$. It acts like the number $1$: $AI_{m} = A$ whenever the product is defined.`,
      whyWrong: [
        null,
        'This reads "unit" as "every entry is $1$". The unit matrix has $0$s off the main diagonal.',
        '"Order $m$" describes a square $m \\times m$ matrix, not a single column of $m$ entries.',
        'This is the zero matrix of order $m$. Multiplying by it gives zero, whereas the unit matrix leaves a matrix unchanged.',
      ],
      keyIdea: 'The unit matrix of order $m$, $I_{m}$, is the $m \\times m$ identity matrix.',
    },
  },
  {
    id: 'matrix-operations-025',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: 'Let $A$ be a $m \\times n$ matrix and $B$ a $p \\times q$ matrix. When is the product $AB$ defined?',
    options: ['When $n = p$', 'When $m = p$', 'When $n = q$', 'When $m = q$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '"A $m \\times n$ matrix" means $m$ rows and $n$ columns.\n\n' +
        'Each entry of $AB$ is a row of $A$ times a column of $B$. A row of $A$ has $n$ entries and a column of $B$ has $p$ entries, so these must be equal: $n = p$.\n\n' +
        'In $(m \\times n)(p \\times q)$ these are the inner dimensions.',
      whyWrong: [
        null,
        'This compares the **rows** of $A$ with the rows of $B$. It is the columns of $A$ that must equal the rows of $B$.',
        'This compares the **columns** of both matrices. The columns of $A$ must equal the **rows** of $B$.',
        'This is the condition for $BA$ (columns of $B$ equal rows of $A$), not for $AB$.',
      ],
      keyIdea: '$AB$ is defined exactly when the number of columns of $A$ equals the number of rows of $B$.',
    },
  },
  {
    id: 'matrix-operations-026',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: 'If $A$ is a $3 \\times 5$ matrix, what is the order of its transpose $A^{T}$?',
    options: ['$5 \\times 3$', '$3 \\times 5$', '$5 \\times 5$', '$3 \\times 3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The transpose turns rows into columns, so the two numbers of the order swap.\n\n' +
        'An $m \\times n$ matrix has an $n \\times m$ transpose, so $A^{T}$ is $5 \\times 3$.',
      whyWrong: [
        null,
        'This keeps the order unchanged. Transposing swaps rows and columns, so the order changes unless the matrix is square.',
        'This is the order of $A^{T}A$, which is $(5 \\times 3)(3 \\times 5)$. The question asks about $A^{T}$ alone.',
        'This is the order of $AA^{T}$, which is $(3 \\times 5)(5 \\times 3)$. The question asks about $A^{T}$ alone.',
      ],
      keyIdea: 'If $A$ is $m \\times n$ then $A^{T}$ is $n \\times m$.',
    },
    check: {
      optionValues: ['5x3', '3x5', '5x5', '3x3'],
      compute: () => {
        const T5 = transpose(zeros(3, 5));
        return `${T5.length}x${T5[0].length}`;
      },
    },
  },
  {
    id: 'matrix-operations-027',
    subtopic: 'matrix-operations',
    difficulty: 'foundation',
    stem: `What is the transpose of ${T([[1, 2, 3], [4, 5, 6]])}?`,
    options: [T([[1, 4], [2, 5], [3, 6]]), T([[1, 2, 3], [4, 5, 6]]), T([[4, 5, 6], [1, 2, 3]]), T([[3, 2, 1], [6, 5, 4]])],
    correctIndex: 0,
    markScheme: {
      solution:
        'The transpose turns each row into a column: row 1 becomes column 1, and row 2 becomes column 2.\n\n' +
        `So the transpose of the $2 \\times 3$ matrix is the $3 \\times 2$ matrix ${T([[1, 4], [2, 5], [3, 6]])}.`,
      whyWrong: [
        null,
        'This is the original matrix. A $2 \\times 3$ matrix must become $3 \\times 2$ when transposed.',
        'This swaps the two rows with each other. Transposing turns rows into columns; it does not reorder the rows.',
        'This reverses the entries within each row. Transposing turns rows into columns; it does not reverse them.',
      ],
      keyIdea: 'Row $i$ of $A$ becomes column $i$ of $A^{T}$.',
    },
    check: {
      optionValues: [J([[1, 4], [2, 5], [3, 6]]), J([[1, 2, 3], [4, 5, 6]]), J([[4, 5, 6], [1, 2, 3]]), J([[3, 2, 1], [6, 5, 4]])],
      compute: () => J(transpose([[1, 2, 3], [4, 5, 6]])),
    },
  },
  // ------------------------------------------------------------------ exam: products from dimensions
  {
    id: 'matrix-operations-028',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is a $2 \\times 3$ matrix and $B$ is a $4 \\times 2$ matrix. Which statement is true?',
    options: ['$AB$ is defined but $BA$ is not', '$BA$ is defined but $AB$ is not', 'Both $AB$ and $BA$ are defined', 'Neither $AB$ nor $BA$ is defined'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Check each order separately.\n\n' +
        '- $AB$ is $(2 \\times 3)(4 \\times 2)$: inner dimensions $3$ and $4$ do not match, so it is not defined.\n' +
        '- $BA$ is $(4 \\times 2)(2 \\times 3)$: inner dimensions $2$ and $2$ match, so it is defined and is $4 \\times 3$.',
      whyWrong: [
        'This has the two orders the wrong way round. For $AB$ the inner dimensions are $3$ and $4$, which do not match.',
        null,
        'This assumes that if one order works the other does too. Here only $BA$ has matching inner dimensions.',
        'This checks only $AB$ and stops. $BA$ is $(4 \\times 2)(2 \\times 3)$, whose inner dimensions match.',
      ],
      keyIdea: 'Matrix order matters: $BA$ can be defined when $AB$ is not.',
    },
    check: {
      optionValues: ['AB', 'BA', 'both', 'neither'],
      compute: () => {
        const ab = productOrder([2, 3], [4, 2]) !== 'undefined';
        const ba = productOrder([4, 2], [2, 3]) !== 'undefined';
        return ab && ba ? 'both' : ab ? 'AB' : ba ? 'BA' : 'neither';
      },
    },
  },
  {
    id: 'matrix-operations-029',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is a $2 \\times 3$ matrix. Which of the following is defined?',
    options: ['$A^{T}A$', '$A^{2}$', '$A + A^{T}$', '$A^{-1}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $A^{T}$ is $3 \\times 2$.\n\n' +
        '- $A^{T}A$ is $(3 \\times 2)(2 \\times 3)$: inner dimensions match, giving $3 \\times 3$. Defined.\n' +
        '- $A^{2} = AA$ is $(2 \\times 3)(2 \\times 3)$: inner $3$ and $2$. Not defined.\n' +
        '- $A + A^{T}$ adds a $2 \\times 3$ matrix to a $3 \\times 2$ matrix. Addition needs the same order, so it is not defined.\n' +
        '- $A^{-1}$: only square matrices can have an inverse, so it is not defined.',
      whyWrong: [
        null,
        '$A^{2}$ needs $A$ to be square: $(2 \\times 3)(2 \\times 3)$ has inner dimensions $3$ and $2$.',
        'Adding needs equal orders, but $A$ is $2 \\times 3$ and $A^{T}$ is $3 \\times 2$. This sum only exists for a square matrix.',
        'Only a square matrix can have an inverse, and $A$ is $2 \\times 3$.',
      ],
      keyIdea: 'For a non-square $A$, the products $A^{T}A$ and $AA^{T}$ exist, but $A^{2}$, $A + A^{T}$ and $A^{-1}$ do not.',
    },
    check: {
      optionValues: ['ATA', 'A2', 'A+AT', 'Ainv'],
      compute: () => {
        const A: Shape = [2, 3];
        const AT: Shape = [A[1], A[0]];
        const ok: string[] = [];
        if (productOrder(AT, A) !== 'undefined') ok.push('ATA');
        if (productOrder(A, A) !== 'undefined') ok.push('A2');
        if (A[0] === AT[0] && A[1] === AT[1]) ok.push('A+AT');
        if (A[0] === A[1]) ok.push('Ainv');
        return ok.join(',');
      },
    },
  },
  {
    id: 'matrix-operations-030',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is a $2 \\times 3$ matrix. Which of these is defined **and** has order $2 \\times 2$?',
    options: ['$A^{T}A$', '$AA^{T}$', '$A^{2}$', '$A + A^{T}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Here $A^{T}$ is $3 \\times 2$.\n\n' +
        '- $AA^{T}$ is $(2 \\times 3)(3 \\times 2)$, which gives $2 \\times 2$.\n' +
        '- $A^{T}A$ is $(3 \\times 2)(2 \\times 3)$, which gives $3 \\times 3$.\n' +
        '- $A^{2}$ is $(2 \\times 3)(2 \\times 3)$, which is not defined.\n' +
        '- $A + A^{T}$ adds matrices of different orders, which is not defined.',
      whyWrong: [
        '$A^{T}A$ is defined, but it is $3 \\times 3$. The outer dimensions of $(3 \\times 2)(2 \\times 3)$ give the size.',
        null,
        '$A^{2}$ is not defined: $(2 \\times 3)(2 \\times 3)$ has inner dimensions $3$ and $2$.',
        '$A + A^{T}$ is not defined, because $2 \\times 3$ and $3 \\times 2$ are different orders.',
      ],
      keyIdea: 'For a $m \\times n$ matrix $A$, $AA^{T}$ is $m \\times m$ and $A^{T}A$ is $n \\times n$.',
    },
    check: {
      optionValues: ['ATA', 'AAT', 'A2', 'A+AT'],
      compute: () => {
        const A: Shape = [2, 3];
        const AT: Shape = [A[1], A[0]];
        const orders: Record<string, string> = { ATA: productOrder(AT, A), AAT: productOrder(A, AT), A2: productOrder(A, A), 'A+AT': 'undefined' };
        return Object.keys(orders).filter((k) => orders[k] === '2x2').join(',');
      },
    },
  },
  {
    id: 'matrix-operations-031',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$A$ is a $4 \\times 3$ matrix and the product $AB$ is a $4 \\times 5$ matrix. What is the order of $B$?',
    options: ['$3 \\times 5$', '$5 \\times 3$', '$4 \\times 5$', '$3 \\times 4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Write the orders side by side: $(4 \\times 3)(r \\times c)$ gives $4 \\times 5$.\n\n' +
        '- The inner dimensions must match, so $r = 3$.\n' +
        '- The outer dimensions give the size, so $c = 5$.\n\n' +
        'So $B$ is $3 \\times 5$.',
      whyWrong: [
        null,
        'This has the rows and columns of $B$ the wrong way round. $(4 \\times 3)(5 \\times 3)$ is not defined.',
        'This copies the order of $AB$. But $(4 \\times 3)(4 \\times 5)$ is not defined, because the inner dimensions are $3$ and $4$.',
        'This reverses the order of $A$. Then $AB$ would be $(4 \\times 3)(3 \\times 4)$, which is $4 \\times 4$, not $4 \\times 5$.',
      ],
      keyIdea: 'Rows of $B$ = columns of $A$, and columns of $B$ = columns of $AB$.',
    },
    check: {
      optionValues: ['3x5', '5x3', '4x5', '3x4'],
      compute: () => {
        const shapes: Shape[] = [[3, 5], [5, 3], [4, 5], [3, 4]];
        return shapes.filter((b) => productOrder([4, 3], b) === '4x5').map((b) => `${b[0]}x${b[1]}`).join('|');
      },
    },
  },
  {
    id: 'matrix-operations-032',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: 'Let $A$ be a $m \\times n$ matrix and $B$ a $n \\times p$ matrix. What is the order of $(AB)^{T}$?',
    options: ['$p \\times m$', '$m \\times p$', '$n \\times n$', '$n \\times m$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '"A $m \\times n$ matrix" means $m$ rows and $n$ columns.\n\n' +
        '1. $AB$ is $(m \\times n)(n \\times p)$. The inner dimensions match and the outer dimensions give $m \\times p$.\n' +
        '2. Transposing swaps the two numbers, so $(AB)^{T}$ is $p \\times m$.',
      whyWrong: [
        null,
        'This is the order of $AB$ itself. The transpose then swaps rows and columns.',
        'This uses the inner dimensions. They only have to match; the outer dimensions give the size.',
        'This transposes $A$ alone. The transpose applies to the whole product $AB$, which is $m \\times p$.',
      ],
      keyIdea: 'Find the order of the product first with the inner/outer rule, then swap the two numbers for the transpose.',
    },
  },
  {
    id: 'matrix-operations-033',
    subtopic: 'matrix-operations',
    difficulty: 'exam',
    stem: '$P$ is a $3 \\times 2$ matrix and $Q$ is a $2 \\times 2$ matrix. Which of the following is **not** defined?',
    options: ['$PQ$', '$QP$', '$QP^{T}$', '$P^{T}P$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Here $P^{T}$ is $2 \\times 3$.\n\n' +
        '- $PQ$ is $(3 \\times 2)(2 \\times 2)$, which gives $3 \\times 2$.\n' +
        '- $QP$ is $(2 \\times 2)(3 \\times 2)$: inner $2$ and $3$ do not match, so it is **not defined**.\n' +
        '- $QP^{T}$ is $(2 \\times 2)(2 \\times 3)$, which gives $2 \\times 3$.\n' +
        '- $P^{T}P$ is $(2 \\times 3)(3 \\times 2)$, which gives $2 \\times 2$.',
      whyWrong: [
        '$PQ$ is defined: the inner dimensions $2$ and $2$ match, giving $3 \\times 2$.',
        null,
        '$QP^{T}$ is defined: after transposing, $P^{T}$ is $2 \\times 3$, so the inner dimensions match.',
        '$P^{T}P$ is defined for any matrix $P$: here $(2 \\times 3)(3 \\times 2)$ gives $2 \\times 2$.',
      ],
      keyIdea: 'Transpose first where needed, then check the inner dimensions of each product.',
    },
    check: {
      optionValues: ['PQ', 'QP', 'QPT', 'PTP'],
      compute: () => {
        const P: Shape = [3, 2];
        const Q: Shape = [2, 2];
        const PT: Shape = [P[1], P[0]];
        const products: Record<string, Shape[]> = { PQ: [P, Q], QP: [Q, P], QPT: [Q, PT], PTP: [PT, P] };
        return Object.keys(products).filter((k) => productOrder(...products[k]) === 'undefined').join(',');
      },
    },
  },
];
