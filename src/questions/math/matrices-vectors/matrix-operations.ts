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
        'This counts rows and columns from 0, as Python list indexing does (`A[2][3]`). In maths, $a_{23}$ counts from 1, so it is row 2, column 3.',
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
    stem: 'What does this Python program print?',
    code: {
      lang: 'python',
      source:
        'A = [[1, 2], [3, 4]]\n' +
        'B = [[2, 0], [1, 3]]\n' +
        'C = [[0, 0], [0, 0]]\n' +
        'for i in range(2):\n' +
        '    for j in range(2):\n' +
        '        for k in range(2):\n' +
        '            C[i][j] += A[i][k] * B[k][j]\n' +
        'print(C)',
    },
    options: ['`[[2, 0], [3, 12]]`', '`[[2, 4], [10, 14]]`', '`[[4, 6], [10, 12]]`', '`[[2, 7], [6, 15]]`'],
    correctIndex: 2,
    python: { stdout: '[[4, 6], [10, 12]]' },
    markScheme: {
      solution:
        'The triple loop sets `C[i][j]` to the sum over `k` of `A[i][k] * B[k][j]`: row `i` of `A` times column `j` of `B`. That is exactly the matrix product $AB$ (indices start at 0 in Python).\n\n' +
        '| `i` | `j` | sum over `k` | `C[i][j]` |\n' +
        '|---|---|---|---|\n' +
        '| 0 | 0 | `1*2 + 2*1` | 4 |\n' +
        '| 0 | 1 | `1*0 + 2*3` | 6 |\n' +
        '| 1 | 0 | `3*2 + 4*1` | 10 |\n' +
        '| 1 | 1 | `3*0 + 4*3` | 12 |\n\n' +
        'So the program prints `[[4, 6], [10, 12]]`.',
      whyWrong: [
        'This multiplies entries in matching positions (`A[i][j] * B[i][j]`). The loop over `k` adds up a whole row times a whole column.',
        'This is $BA$. The code uses `A[i][k] * B[k][j]`: rows of `A` with columns of `B`, so it computes $AB$.',
        null,
        'This uses rows of `B` instead of columns (`B[j][k]`), which gives $AB^{T}$. The code reads `B[k][j]`, walking down column `j`.',
      ],
      keyIdea: '`C[i][j] = sum of A[i][k] * B[k][j]` over `k` is the definition of the matrix product $AB$.',
    },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'matrix-operations-017',
    subtopic: 'matrix-operations',
    difficulty: 'challenge',
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
    id: 'matrix-operations-018',
    subtopic: 'matrix-operations',
    difficulty: 'challenge',
    stem: `Let $A = ${matrix([[1, 2], [0, 1]])}$. What is the top-right entry of $A^{10}$?`,
    options: ['$1024$', '$20$', '$18$', '$10$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work out the first few powers and look for a pattern.\n\n' +
        `- $A^{2} = ${matrix([[1, 2], [0, 1]])}${matrix([[1, 2], [0, 1]])} = ${matrix([['1 \\times 1 + 2 \\times 0', '1 \\times 2 + 2 \\times 1'], ['0 \\times 1 + 1 \\times 0', '0 \\times 2 + 1 \\times 1']])} = ${matrix([[1, 4], [0, 1]])}$\n` +
        `- $A^{3} = A^{2}A = ${matrix([[1, 4], [0, 1]])}${matrix([[1, 2], [0, 1]])} = ${matrix([[1, 6], [0, 1]])}$\n\n` +
        'Each extra factor of $A$ adds 2 to the top-right entry, while the other entries stay the same. So\n\n' +
        `$$A^{n} = ${matrix([[1, '2n'], [0, 1]])}$$\n\n` +
        'For $n = 10$ the top-right entry is $2 \\times 10 = 20$.',
      whyWrong: [
        'This raises the entry to the power: $2^{10} = 1024$. Matrix powers are repeated matrix products, and here the top-right entry grows by adding 2 each time, not by doubling.',
        null,
        'This is an off-by-one slip in the pattern ($2(n - 1)$). Check against $A^{2}$, whose top-right entry is $4 = 2 \\times 2$, so $A^{n}$ has $2n$.',
        'This is the pattern for $\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}$, whose powers have top-right entry $n$. Here the entry starts at 2, so it grows by 2 each time.',
      ],
      keyIdea: 'Find matrix powers by multiplying out $A^{2}$ and $A^{3}$ and spotting the pattern; never raise the entries to the power.',
    },
    check: {
      optionValues: [1024, 20, 18, 10],
      compute: () => {
        const A = [[1, 2], [0, 1]];
        let P = identity(2);
        for (let i = 0; i < 10; i++) P = matMul(P, A);
        return P[0][1];
      },
    },
  },
  {
    id: 'matrix-operations-019',
    subtopic: 'matrix-operations',
    difficulty: 'challenge',
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
    id: 'matrix-operations-020',
    subtopic: 'matrix-operations',
    difficulty: 'challenge',
    stem: `Find integers $a$, $b$, $c$ such that $${matrix([[2, 'a'], ['b', 1]])}${matrix([[1, 3], [2, 'c']])} = ${matrix([[8, 18], [1, 1]])}$.`,
    options: ['$a = 3$, $b = -1$, $c = 4$', '$a = 3$, $b = 1$, $c = 4$', '$a = 4$, $b = -1$, $c = 3$', '$a = 3$, $b = -1$, $c = 6$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Multiply out the left-hand side (row times column):\n\n' +
        `$$${matrix([[2, 'a'], ['b', 1]])}${matrix([[1, 3], [2, 'c']])} = ${matrix([['2 + 2a', '6 + ac'], ['b + 2', '3b + c']])}$$\n\n` +
        'Set each entry equal to the matching entry on the right:\n\n' +
        '1. Top-left: $2 + 2a = 8$, so $2a = 6$ and $a = 3$.\n' +
        '2. Top-right: $6 + ac = 18$, so $3c = 12$ and $c = 4$.\n' +
        '3. Bottom-left: $b + 2 = 1$, so $b = -1$.\n' +
        '4. Bottom-right (check): $3b + c = 3(-1) + 4 = 1$. Correct.\n\n' +
        'So $a = 3$, $b = -1$, $c = 4$.\n\n' +
        '**Exam shortcut:** substitute each option into the four entries; only the correct one makes all four match.',
      whyWrong: [
        null,
        'This comes from a sign slip in $b + 2 = 1$ (taking $b = 2 - 1$). With $b = 1$ the bottom-left entry is $1 + 2 = 3$, not 1.',
        'This solves $2 + 2a = 8$ as $2a = 8$ (forgetting the $2 + $), giving $a = 4$ and then $c = 3$. With these values the top-left entry is $2 + 8 = 10$, not 8.',
        'This sets $ac = 18$, forgetting the $2 \\times 3 = 6$ part of the top-right entry. With $c = 6$ the top-right entry is $6 + 18 = 24$ and the bottom-right is $3$, not 1.',
      ],
      keyIdea: 'Multiply out the product, then equate entries one at a time; use the last entry to check (or plug the options in).',
    },
    check: {
      optionValues: ['3,-1,4', '3,1,4', '4,-1,3', '3,-1,6'],
      compute: () => {
        const target = [[8, 18], [1, 1]];
        const found: string[] = [];
        for (let a = -10; a <= 10; a++)
          for (let b = -10; b <= 10; b++)
            for (let c = -10; c <= 10; c++)
              if (J(matMul([[2, a], [b, 1]], [[1, 3], [2, c]])) === J(target)) found.push(`${a},${b},${c}`);
        return found.join(' | ');
      },
    },
  },
  {
    id: 'matrix-operations-021',
    subtopic: 'matrix-operations',
    difficulty: 'challenge',
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
];
