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
      asking: 'How many rows and how many columns does this matrix have?',
      solution:
        'A **matrix** is a grid of numbers. Its **order** (or dimensions) says how big the grid is, and it is always written as rows $\\times$ columns.\n\n' +
        '**Rows** run across, like rows of seats. Here they are $5, -2$ and $0, 7$ and $3, 1$. That makes 3 rows.\n\n' +
        '**Columns** run up and down. Here they are $5, 0, 3$ and $-2, 7, 1$. That makes 2 columns.\n\n' +
        'Write the rows first and the columns second: 3 rows and 2 columns gives $3 \\times 2$.',
      conclusion: 'The matrix has 3 rows and 2 columns, so its order is $3 \\times 2$.',
      whyWrong: [
        'This writes columns first and rows second. The convention is always rows $\\times$ columns, so this matrix is $3 \\times 2$, not $2 \\times 3$.',
        null,
        'This is the number of **entries** ($3 \\times 2 = 6$), not the order. The order must say how many rows and how many columns there are.',
        'This adds the number of rows and columns ($3 + 2$). The order is written as rows $\\times$ columns, not as a single number.',
      ],
      keyIdea: 'To find an order, count the rows going across, then the columns going up and down, and write rows $\\times$ columns. Think "RC": rows, then columns.',
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
      asking: 'Which number sits in row 2, column 3 of the matrix?',
      solution:
        'The small numbers in $a_{23}$ give a position. The **first number is the row** and the **second is the column**. So $a_{23}$ means row 2, column 3.\n\n' +
        'Rows are counted from the top, so row 2 is $6, 3, -5, 1$.\n\n' +
        'Columns are counted from the left, so move along row 2 to the third number: 6 is first, 3 is second and $-5$ is third.',
      conclusion: 'Row 2, column 3 holds $-5$, and the minus sign is part of the entry.',
      whyWrong: [
        'This is $a_{32}$ (row 3, column 2). It mixes up the order: the first subscript is the row, the second is the column.',
        'This counts rows and columns from 0, which lands on row 3, column 4. In maths, $a_{23}$ counts from 1, so it is row 2, column 3.',
        'This finds the right position (row 2, column 3) but drops the minus sign. The entry is $-5$.',
        null,
      ],
      keyIdea: 'For $a_{ij}$, go down to row $i$, then across to column $j$, counting both from 1. Copy the entry with its sign.',
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
      asking: 'Double matrix $A$, then take away matrix $B$. What matrix do you get?',
      solution:
        'The 2 in $2A$ is a **scalar** (an ordinary number multiplying a matrix). It multiplies every entry: $2A = \\begin{bmatrix} 2 \\times 3 & 2 \\times (-1) \\\\ 2 \\times 2 & 2 \\times 4 \\end{bmatrix} = \\begin{bmatrix} 6 & -2 \\\\ 4 & 8 \\end{bmatrix}$.\n\n' +
        'Only $A$ is doubled, so $B$ stays as it is.\n\n' +
        'To subtract matrices, subtract the entries in matching positions. Watch the bottom left: subtracting a negative means adding, so $4 - (-2) = 4 + 2$.\n\n' +
        'Work through the four positions:\n\n| Position | $2A$ entry minus $B$ entry | Result |\n|---|---|---|\n| Top left | $6 - 1$ | $5$ |\n| Top right | $-2 - 5$ | $-7$ |\n| Bottom left | $4 - (-2)$ | $6$ |\n| Bottom right | $8 - 3$ | $5$ |',
      conclusion: 'Putting the four results back in their positions gives $\\begin{bmatrix} 5 & -7 \\\\ 6 & 5 \\end{bmatrix}$.',
      whyWrong: [
        null,
        'This is $2(A - B)$: it doubles $B$ as well. Only $A$ is multiplied by 2.',
        'This is $A - B$: it forgets to multiply $A$ by 2 first.',
        'This slips on the bottom-left entry, working out $4 - (-2)$ as $2$. Subtracting a negative number adds it: $4 - (-2) = 6$.',
      ],
      keyIdea: 'For $pA - qB$: multiply every entry of $A$ by $p$ and every entry of $B$ by $q$, then subtract position by position. Put negative entries in brackets so you keep their signs.',
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
      asking: 'What size is the result when a $3 \\times 2$ matrix multiplies a $2 \\times 4$ matrix?',
      solution:
        'The **order** of a matrix is rows $\\times$ columns. Write the two orders side by side, in the same order as the product $AB$: $(3 \\times 2)(2 \\times 4)$.\n\n' +
        'The two middle numbers are the **inner numbers**, here 2 and 2. They must be equal or the product doesn\'t exist. Each row of $A$ has 2 numbers and each column of $B$ has 2 numbers, so they pair up exactly.\n\n' +
        'The two end numbers are the **outer numbers**, here 3 and 4. They give the order of the product: 3 rows from $A$ and 4 columns from $B$, so $3 \\times 4$.',
      conclusion: 'The inner numbers match and the outer numbers are 3 and 4, so $AB$ has order $3 \\times 4$.',
      whyWrong: [
        'This uses the **inner** numbers. The inner numbers only have to match; the order of the product comes from the outer numbers, $3 \\times 4$.',
        'This writes the outer numbers backwards. The product has the rows of $A$ (3) and the columns of $B$ (4), so it is $3 \\times 4$.',
        null,
        'The product **is** defined: $A$ has 2 columns and $B$ has 2 rows, and those are the numbers that must match.',
      ],
      keyIdea: 'Write the orders side by side: $(m \\times n)(n \\times p)$. If the inner numbers match, the product exists and its order is the outer numbers, $m \\times p$.',
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
      asking: 'What matrix do you get when you take 2 times the identity matrix away from $A$?',
      solution:
        'The **identity matrix** $I$ has 1s on the main diagonal (top left to bottom right) and 0s everywhere else. Here it is $2 \\times 2$, so $I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$.\n\n' +
        'The 2 multiplies every entry, so $2I = \\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix}$.\n\n' +
        'Now subtract position by position. Taking away a 0 changes nothing, so the top-right $-2$ and the bottom-left $1$ stay as they are.\n\n' +
        'Only the diagonal entries change: $4 - 2 = 2$ and $5 - 2 = 3$. So $A - 2I = \\begin{bmatrix} 2 & -2 \\\\ 1 & 3 \\end{bmatrix}$.',
      conclusion: 'Subtracting $2I$ takes 2 off each diagonal entry and leaves the rest alone, which gives $\\begin{bmatrix} 2 & -2 \\\\ 1 & 3 \\end{bmatrix}$.',
      whyWrong: [
        'This subtracts 2 from **every** entry, as if $I$ were a matrix full of 1s. The identity has 0s off the diagonal, so the off-diagonal entries stay the same.',
        'This is $A - I$: it forgets to multiply $I$ by 2.',
        'This puts the 2s on the wrong diagonal (top-right to bottom-left). The identity has its 1s on the main diagonal, top-left to bottom-right.',
        null,
      ],
      keyIdea: '$A - kI$ only changes the main diagonal: subtract $k$ from each diagonal entry and leave every other entry alone. $A + kI$ works the same way with adding.',
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
      asking: 'Which matrix stays the same when you flip it across the line from top left to bottom right?',
      solution:
        'A matrix is **symmetric** when it is a mirror image across its **main diagonal** (top left to bottom right). In symbols, $a_{ij} = a_{ji}$: the entry in row $i$, column $j$ equals the entry in row $j$, column $i$.\n\n' +
        'A $3 \\times 3$ matrix has three mirror pairs to compare: $a_{12}$ with $a_{21}$, $a_{13}$ with $a_{31}$, and $a_{23}$ with $a_{32}$. The diagonal entries have no partner, so they can be anything.\n\n' +
        'Compare the pairs in each matrix:\n\n| Matrix | $a_{12}$, $a_{21}$ | $a_{13}$, $a_{31}$ | $a_{23}$, $a_{32}$ | All equal? |\n|---|---|---|---|---|\n| $\\begin{bmatrix} 1 & 4 & -2 \\\\ -4 & 3 & 5 \\\\ 2 & -5 & 0 \\end{bmatrix}$ | $4$, $-4$ | $-2$, $2$ | $5$, $-5$ | No |\n| $\\begin{bmatrix} 2 & 7 & 1 \\\\ 3 & 5 & 7 \\\\ 6 & 3 & 2 \\end{bmatrix}$ | $7$, $3$ | $1$, $6$ | $7$, $3$ | No |\n| $\\begin{bmatrix} 1 & 4 & -2 \\\\ 4 & 3 & 5 \\\\ -2 & 6 & 0 \\end{bmatrix}$ | $4$, $4$ | $-2$, $-2$ | $5$, $6$ | No |\n| $\\begin{bmatrix} 1 & 4 & -2 \\\\ 4 & 3 & 5 \\\\ -2 & 5 & 0 \\end{bmatrix}$ | $4$, $4$ | $-2$, $-2$ | $5$, $5$ | Yes |',
      conclusion: 'Only one matrix has all three mirror pairs equal, so the symmetric one is $\\begin{bmatrix} 1 & 4 & -2 \\\\ 4 & 3 & 5 \\\\ -2 & 5 & 0 \\end{bmatrix}$.',
      whyWrong: [
        'Here each mirror pair has opposite signs ($a_{12} = 4$ but $a_{21} = -4$). The sizes match but the signs do not, and symmetric needs $a_{ij} = a_{ji}$ exactly, sign included.',
        'This matrix is a mirror image across the **other** diagonal (top-right to bottom-left). Symmetric means a mirror across the main diagonal: here $a_{12} = 7$ but $a_{21} = 3$.',
        null,
        'The first row and first column match, but $a_{23} = 5$ while $a_{32} = 6$. Every mirror pair must be checked, not just the first row.',
      ],
      keyIdea: 'To test for symmetry, compare each entry above the main diagonal with its mirror image below. One mismatch, even just a sign, rules the matrix out, so test every pair.',
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
      asking: 'What matrix do you get when you multiply $A$ by $B$, in that order?',
      solution:
        'Matrix multiplication isn\'t done position by position. Each entry of $AB$ comes from **one row of $A$ and one column of $B$**: multiply matching numbers, then add.\n\n' +
        'Here is the top-left entry (row 1, column 1). Row 1 of $A$ is $2, 1$ and column 1 of $B$ is $4, -2$. So it is $2 \\times 4 + 1 \\times (-2) = 8 - 2 = 6$.\n\n' +
        'Do the same for all four entries. The columns of $B$ are $4, -2$ and $1, 5$, and the rows of $A$ are $2, 1$ and $3, -1$:\n\n| Entry of $AB$ | Working | Value |\n|---|---|---|\n| Row 1, column 1 | $2 \\times 4 + 1 \\times (-2)$ | $6$ |\n| Row 1, column 2 | $2 \\times 1 + 1 \\times 5$ | $7$ |\n| Row 2, column 1 | $3 \\times 4 + (-1) \\times (-2)$ | $14$ |\n| Row 2, column 2 | $3 \\times 1 + (-1) \\times 5$ | $-2$ |',
      conclusion: 'Placing each value in its row and column gives $\\begin{bmatrix} 6 & 7 \\\\ 14 & -2 \\end{bmatrix}$.',
      whyWrong: [
        'This multiplies entries in the same position ($2 \\times 4$, $1 \\times 1$, ...). That is not matrix multiplication: each entry must be a row of $A$ times a column of $B$.',
        'This is $BA$ (rows of $B$ times columns of $A$). Matrix multiplication is not commutative, so the order matters.',
        'This multiplies rows of $A$ by **rows** of $B$ (which gives $AB^{T}$). Each entry must use a row of $A$ and a **column** of $B$.',
        null,
      ],
      keyIdea: 'The entry in row $i$, column $j$ of $AB$ is row $i$ of $A$ times column $j$ of $B$: multiply matching numbers and add. Fill the grid one entry at a time.',
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
      asking: 'Which single number sits in row 2, column 1 of $AB$?',
      solution:
        'You don\'t need the whole product. Each entry of $AB$ comes from one row of $A$ and one column of $B$. Row 2, column 1 uses **row 2 of $A$** and **column 1 of $B$**.\n\n' +
        'Read them off. Row 2 of $A$ is $3, -2, 4$. Column 1 of $B$, reading downwards, is $2, 5, 3$.\n\n' +
        'Multiply matching numbers: $3 \\times 2 = 6$, then $(-2) \\times 5 = -10$, then $4 \\times 3 = 12$.\n\n' +
        'Add the three products, keeping their signs: $6 - 10 + 12 = 8$.',
      conclusion: 'Row 2 of $A$ with column 1 of $B$ gives $6 - 10 + 12$, so the entry is $8$.',
      whyWrong: [
        'This is the entry in row 1, column 2 (row 1 of $A$ with column 2 of $B$: $1 - 6 - 2 = -7$). The row number comes first.',
        null,
        'This is row 2, column 1 of $BA$ (row 2 of $B$ with column 1 of $A$: $5 \\times 1 + (-3) \\times 3 = -4$). The order of the product matters.',
        'This loses the minus sign in $(-2) \\times 5$, giving $6 + 10 + 12 = 28$. A negative times a positive is negative.',
      ],
      keyIdea: 'The entry in row $i$, column $j$ of $AB$ needs only row $i$ of $A$ and column $j$ of $B$. Pair them up, multiply each pair and add. Skip the rest of the product.',
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
      asking: 'Do $AB$ and $BA$ both exist, what size is each one, and can they be equal?',
      solution:
        'To test a product, write the orders (rows $\\times$ columns) side by side. The two middle numbers, the **inner numbers**, must match for the product to exist. The two end numbers, the **outer numbers**, give its size.\n\n' +
        'For $AB$: $(2 \\times 3)(3 \\times 2)$. The inner numbers are 3 and 3, so it exists. The outer numbers are 2 and 2, so $AB$ is $2 \\times 2$.\n\n' +
        'For $BA$: $(3 \\times 2)(2 \\times 3)$. The inner numbers are 2 and 2, so it exists. The outer numbers are 3 and 3, so $BA$ is $3 \\times 3$.\n\n' +
        'Two matrices can only be equal if they are the same size. One of these has 4 entries and the other has 9, so they can\'t be equal.',
      conclusion: 'Both products exist but their sizes differ: $AB$ is a $2 \\times 2$ matrix and $BA$ is a $3 \\times 3$ matrix, so $AB \\ne BA$.',
      whyWrong: [
        '$BA$ is also defined: $B$ has 2 columns and $A$ has 2 rows, so the inner numbers match. It is a $3 \\times 3$ matrix.',
        null,
        'Being defined does not make two products equal. Here $AB$ is $2 \\times 2$ and $BA$ is $3 \\times 3$, so they cannot even be the same size. In general $AB \\ne BA$.',
        'This uses the inner numbers instead of the outer numbers. $(2 \\times 3)(3 \\times 2)$ gives $2 \\times 2$, and $(3 \\times 2)(2 \\times 3)$ gives $3 \\times 3$.',
      ],
      keyIdea: 'For any statement about $AB$ and $BA$, work out each one separately using $(m \\times n)(n \\times p)$ gives $m \\times p$. Different sizes mean the two products can\'t be equal.',
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
      asking: 'Multiply $A$ by $B$, then swap the rows and columns of the result. What matrix do you get?',
      solution:
        'The brackets say to work out $AB$ first. Each entry of $AB$ is one row of $A$ times one column of $B$: multiply matching numbers, then add.\n\n' +
        'Work through the four entries, using rows $1, 2$ and $-1, 3$ of $A$, and columns $2, 4$ and $1, -1$ of $B$:\n\n| Entry of $AB$ | Working | Value |\n|---|---|---|\n| Row 1, column 1 | $1 \\times 2 + 2 \\times 4$ | $10$ |\n| Row 1, column 2 | $1 \\times 1 + 2 \\times (-1)$ | $-1$ |\n| Row 2, column 1 | $(-1) \\times 2 + 3 \\times 4$ | $10$ |\n| Row 2, column 2 | $(-1) \\times 1 + 3 \\times (-1)$ | $-4$ |\n\n$$AB = \\begin{bmatrix} 10 & -1 \\\\ 10 & -4 \\end{bmatrix}$$\n\n' +
        'The $T$ means **transpose**: each row becomes a column. The first row, $10, -1$, becomes the first column, and the second row, $10, -4$, becomes the second column. That gives $(AB)^{T} = \\begin{bmatrix} 10 & 10 \\\\ -1 & -4 \\end{bmatrix}$.',
      conclusion: 'Multiplying and then turning rows into columns gives $\\begin{bmatrix} 10 & 10 \\\\ -1 & -4 \\end{bmatrix}$.',
      whyWrong: [
        'This is $AB$ itself: it forgets the final transpose (swap rows and columns).',
        'This is $A^{T}B^{T}$, which equals $(BA)^{T}$. The rule is $(AB)^{T} = B^{T}A^{T}$: the order must reverse.',
        null,
        'This is $BA$. It multiplies in the wrong order and also forgets to transpose.',
      ],
      keyIdea: 'For $(AB)^{T}$, multiply first, then turn rows into columns. If you transpose first instead, the order must reverse: $(AB)^{T} = B^{T}A^{T}$.',
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
      asking: 'Which of these four products can\'t be calculated, given the sizes of the matrices?',
      solution:
        'A product exists only when the columns of the left matrix equal the rows of the right matrix. Write the orders (rows $\\times$ columns) side by side and compare the two middle numbers, the **inner numbers**.\n\n' +
        '$A^{T}$ is the **transpose** of $A$, which swaps its rows and columns. $A$ is $2 \\times 3$, so $A^{T}$ is $3 \\times 2$.\n\n' +
        '$ABC$ has three matrices, so take one product at a time. $AB$ is $(2 \\times 3)(3 \\times 4)$, which exists and gives $2 \\times 4$. We then need $(2 \\times 4)(4 \\times 2)$ to work.\n\n' +
        'Compare the inner numbers for each one:\n\n| Product | Orders side by side | Inner numbers | Defined? |\n|---|---|---|---|\n| $ABC$ | $(2 \\times 4)(4 \\times 2)$ | 4 and 4 | Yes |\n| $CA$ | $(4 \\times 2)(2 \\times 3)$ | 2 and 2 | Yes |\n| $A^{T}A$ | $(3 \\times 2)(2 \\times 3)$ | 2 and 2 | Yes |\n| $BA$ | $(3 \\times 4)(2 \\times 3)$ | 4 and 2 | No |',
      conclusion: 'Only one product has inner numbers that differ, 4 and 2, so the product that is not defined is $BA$.',
      whyWrong: [
        '$ABC$ is defined: $AB$ is $2 \\times 4$ and $(2 \\times 4)(4 \\times 2)$ gives a $2 \\times 2$ matrix. Check one product at a time.',
        '$CA$ is defined: $(4 \\times 2)(2 \\times 3)$ has matching inner numbers and gives $4 \\times 3$. Order matters, but this order works.',
        null,
        '$A^{T}A$ is always defined: transposing $A$ ($2 \\times 3$) gives $3 \\times 2$, and $(3 \\times 2)(2 \\times 3)$ gives $3 \\times 3$.',
      ],
      keyIdea: 'Replace each matrix by its order, swapping the two numbers for a transpose, and compare the inner numbers. For three matrices, multiply two first and carry the new order forward.',
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
      asking: 'What size is the matrix you get from the transpose of $A$ times $B$?',
      solution:
        '$A^{T}$ is the **transpose** of $A$: its rows become columns and its columns become rows. $A$ is $3 \\times 2$, so $A^{T}$ is $2 \\times 3$.\n\n' +
        'Write the orders (rows $\\times$ columns) side by side: $A^{T}B$ is $(2 \\times 3)(3 \\times 4)$.\n\n' +
        'The two middle numbers, the **inner numbers**, are 3 and 3. They match, so the product exists.\n\n' +
        'The two end numbers, the **outer numbers**, give the size of the product. They are 2 and 4, so it is $2 \\times 4$.',
      conclusion: 'After transposing, the outer numbers are 2 and 4, so $A^{T}B$ has order $2 \\times 4$.',
      whyWrong: [
        'This writes the outer numbers in reverse order. The product has the rows of $A^{T}$ (2) and the columns of $B$ (4), so it is $2 \\times 4$.',
        'This uses the **inner** numbers of $(2 \\times 3)(3 \\times 4)$. Those only have to match; the outer numbers give the order.',
        'This forgets to transpose $A$ first: $AB$ would be $(3 \\times 2)(3 \\times 4)$, which is not defined. But $A^{T}$ is $2 \\times 3$, so $A^{T}B$ is defined.',
        null,
      ],
      keyIdea: 'Transpose first by swapping the two numbers in the order. Then $(m \\times n)(n \\times p)$ gives $m \\times p$: the inner numbers must match and the outer numbers give the answer.',
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
      asking: 'What values of $x$ and $y$ make this matrix equation true?',
      solution:
        'Two matrices are equal only if every matching entry is equal. So we combine the left-hand side into one matrix, then compare it with the right-hand side.\n\n' +
        'The 2 multiplies every entry of the first matrix: $2\\begin{bmatrix} x & 3 \\\\ 1 & y \\end{bmatrix} = \\begin{bmatrix} 2x & 6 \\\\ 2 & 2y \\end{bmatrix}$.\n\n' +
        'Add the second matrix position by position: $\\begin{bmatrix} 2x + 1 & 6 + (-2) \\\\ 2 + 4 & 2y + 3 \\end{bmatrix} = \\begin{bmatrix} 2x + 1 & 4 \\\\ 6 & 2y + 3 \\end{bmatrix}$.\n\n' +
        'Compare with the right-hand matrix. The top-right 4 and bottom-left 6 already match. The other two positions give $2x + 1 = 7$ and $2y + 3 = -5$.\n\n' +
        'Solve the first equation. Take 1 from both sides to get $2x = 6$, then divide by 2 to get $x$ on its own: $x = 3$.\n\n' +
        'Solve the second the same way. Take 3 from both sides to get $2y = -8$, then divide by 2: $y = -4$.',
      conclusion: 'Those two equations give $x = 3$, $y = -4$, and the other two positions already agree.',
      whyWrong: [
        'This solves $2x = 6$ and $2y = -8$ correctly but forgets to divide by 2 at the end.',
        null,
        'This adds the second matrix to the right-hand side instead of subtracting it: $2x = 7 + 1$ and $2y = -5 + 3$.',
        'The value of $x$ is right, but $y$ comes from a sign slip: it adds the 3 to the right-hand side ($2y = -5 + 3 = -2$) instead of subtracting it ($2y = -5 - 3 = -8$).',
      ],
      keyIdea: 'When unknowns sit inside matrices, simplify the left side into one matrix, then match entries to get ordinary equations. Solve each one for its unknown.',
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
      asking: 'What matrix do you get when you multiply $A$ by itself?',
      solution:
        '$A^{2}$ means $A \\times A$, a full matrix multiplication. Squaring each entry on its own doesn\'t give it.\n\n' +
        'Each entry of the product is one row of the first $A$ times one column of the second $A$: multiply matching numbers, then add. The rows of $A$ are $1, 2$ and $3, -1$. The columns are $1, 3$ and $2, -1$.\n\n' +
        'Work through the four entries:\n\n| Entry | Working | Value |\n|---|---|---|\n| Row 1, column 1 | $1 \\times 1 + 2 \\times 3$ | $7$ |\n| Row 1, column 2 | $1 \\times 2 + 2 \\times (-1)$ | $0$ |\n| Row 2, column 1 | $3 \\times 1 + (-1) \\times 3$ | $0$ |\n| Row 2, column 2 | $3 \\times 2 + (-1) \\times (-1)$ | $7$ |',
      conclusion: 'Placing each value in its row and column gives $\\begin{bmatrix} 7 & 0 \\\\ 0 & 7 \\end{bmatrix}$.',
      whyWrong: [
        null,
        'This squares each entry separately. $A^{2}$ is the matrix product $AA$: rows of $A$ times columns of $A$.',
        'This is $2A$ (doubling every entry), not $A \\times A$.',
        'This is $AA^{T}$: it multiplies rows of $A$ by rows of $A$. For $A^{2}$, use rows of the first $A$ and **columns** of the second.',
      ],
      keyIdea: 'For $A^{2}$, write $A$ twice side by side and multiply rows by columns, one entry at a time. Never square the entries on their own.',
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
      asking: 'What matrix do you get when you multiply $A$ by $D$, with $D$ on the left?',
      solution:
        'Each entry of $DA$ is one row of $D$ times one column of $A$: multiply matching numbers, then add. The rows of $D$ are $2, 0$ and $0, 3$. The columns of $A$ are $1, 5$ and $4, 2$.\n\n' +
        'Work through the four entries. The zeros in $D$ wipe out one product each time:\n\n| Entry | Working | Value |\n|---|---|---|\n| Row 1, column 1 | $(2 \\times 1) + (0 \\times 5)$ | $2$ |\n| Row 1, column 2 | $(2 \\times 4) + (0 \\times 2)$ | $8$ |\n| Row 2, column 1 | $(0 \\times 1) + (3 \\times 5)$ | $15$ |\n| Row 2, column 2 | $(0 \\times 4) + (3 \\times 2)$ | $6$ |',
      conclusion: 'Row 1 of $A$ was multiplied by 2 and row 2 by 3, which gives $\\begin{bmatrix} 2 & 8 \\\\ 15 & 6 \\end{bmatrix}$.',
      whyWrong: [
        'This is $AD$, which scales the **columns** of $A$ (column 1 times 2, column 2 times 3). With $D$ on the left, the **rows** are scaled.',
        'This multiplies only the diagonal entries of $A$ by 2 and 3 and leaves the rest alone. Every entry in row 2 must be multiplied by 3.',
        'This multiplies entries in matching positions (so the zeros of $D$ wipe out entries). Matrix multiplication uses rows times columns.',
        null,
      ],
      keyIdea: 'A **diagonal** matrix (zeros everywhere off the main diagonal) on the left multiplies each row by its diagonal number. On the right, it multiplies each column instead.',
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
      asking: 'What number is in `s` when the loop ends and it gets printed?',
      solution:
        'Lines 1 and 2 store each matrix as a list of rows, so $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ and $B = \\begin{bmatrix} 2 & 0 \\\\ 1 & 3 \\end{bmatrix}$. `A[i][j]` means row `i`, column `j`.\n\n' +
        'On line 5, `A[2][k]` keeps the row fixed at 2 and changes the column, so it walks along row 2 of `A`. `B[k][1]` keeps the column fixed at 1 and changes the row, so it walks down column 1 of `B`.\n\n' +
        'Line 3 starts `s` at 0. Line 4 makes `k` take the values 1 and 2, and line 5 adds one product to `s` on each pass.\n\n' +
        'Here is every pass. After the loop, line 7 prints `s`.\n\n| `k` | `A[2][k]` | `B[k][1]` | Product | `s` becomes |\n|---|---|---|---|---|\n| 1 | 3 | 2 | 6 | 6 |\n| 2 | 4 | 1 | 4 | 10 |',
      conclusion: 'After both passes `s` holds 10, so the output is `10`.',
      whyWrong: [
        'This uses row 1 of `A` (`1*2 + 2*1`). The code reads `A[2][k]`, which is row 2.',
        'This stops after the first pass, when `s` is 6. The loop `for k = 1 to 2` includes `k = 2`.',
        null,
        'This uses column 2 of `B` (`3*0 + 4*3`). The code reads `B[k][1]`, which walks down column 1.',
      ],
      keyIdea: 'When a loop uses array indexes, write the arrays out as grids and draw one table row per pass. See which index changes: `A[2][k]` moves along a row and `B[k][1]` moves down a column.',
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
      asking: 'Which value of $k$ makes this matrix match its own mirror image across the main diagonal?',
      solution:
        '**Symmetric** means a mirror image across the main diagonal (top left to bottom right). So each entry must equal its partner on the other side of that line.\n\n' +
        'List the three mirror pairs, where $a_{ij}$ means the entry in row $i$, column $j$:\n\n| Pair | Entries | What it needs |\n|---|---|---|\n| $a_{12}$ and $a_{21}$ | $k^{2}$ and $4$ | $k^{2} = 4$ |\n| $a_{13}$ and $a_{31}$ | $3$ and $3$ | Already equal |\n| $a_{23}$ and $a_{32}$ | $k + 1$ and $-1$ | $k + 1 = -1$ |\n\n' +
        'Solve $k^{2} = 4$. Both 2 and $-2$ square to 4, so keep both for now.\n\n' +
        '$k$ must satisfy every pair at the same time, so test both values in $k + 1 = -1$:\n\n| $k$ | $k + 1$ | Equal to $-1$? |\n|---|---|---|\n| $2$ | $3$ | No |\n| $-2$ | $-1$ | Yes |',
      conclusion: 'Only one value passes every pair, so the answer is $k = -2$.',
      whyWrong: [
        'This uses only the first pair ($k^{2} = 4$) and takes the positive root. With $k = 2$, $a_{23} = 3$ but $a_{32} = -1$, so $A$ is not symmetric.',
        'This solves $k^{2} = 4$ but never checks the second pair. $k = 2$ makes $a_{23} = 3 \\ne -1$, so only $k = -2$ works.',
        'This tries only $k = 2$ (the positive root) and gives up. The negative root $k = -2$ satisfies both conditions.',
        null,
      ],
      keyIdea: 'For an unknown in a symmetric matrix, write an equation for every mirror pair. Solve the simplest, then test its solutions in the others. A squared unknown gives two candidates, and often only one survives.',
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
      asking: 'Which of these four expressions always gives a matrix equal to its own transpose?',
      solution:
        'A matrix is **symmetric** if it equals its own **transpose** (the matrix with rows and columns swapped). Swapping must keep the same shape, so a symmetric matrix has to be square.\n\n' +
        '$A$ is $2 \\times 3$, so $A^{T}$ is $3 \\times 2$. Three of the expressions fail on size alone:\n\n| Expression | Size check | Result |\n|---|---|---|\n| $A + A^{T}$ | Adding needs equal orders, but these are $2 \\times 3$ and $3 \\times 2$ | Doesn\'t exist |\n| $A^{2}$ | $(2 \\times 3)(2 \\times 3)$ has middle numbers 3 and 2, which differ | Doesn\'t exist |\n| $(A^{T})^{T}$ | Transposing twice gives $A$ back, which is $2 \\times 3$ | Not square |\n\n' +
        'That leaves $AA^{T}$, which is $(2 \\times 3)(3 \\times 2)$, a square $2 \\times 2$ matrix. Now transpose it. A transpose of a product reverses the order, and transposing twice undoes itself: $(AA^{T})^{T} = (A^{T})^{T}A^{T} = AA^{T}$. It equals its own transpose.',
      conclusion: 'It is the only one that exists, is square and equals its own transpose, so the answer is $AA^{T}$.',
      whyWrong: [
        '$A + A^{T}$ is symmetric when $A$ is **square**, but here $A$ is $2 \\times 3$ and $A^{T}$ is $3 \\times 2$, so they cannot be added.',
        '$A^{2}$ is not defined for a non-square matrix: $(2 \\times 3)(2 \\times 3)$ has inner numbers $3$ and $2$.',
        null,
        'Transposing twice gives back $A$ itself, which is $2 \\times 3$. A non-square matrix can never be symmetric.',
      ],
      keyIdea: 'To test an expression for symmetry, first check that it exists and is square. Then transpose it using $(XY)^{T} = Y^{T}X^{T}$ and $(X^{T})^{T} = X$. Getting the same expression back means symmetric.',
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
      asking: 'Add $A$ and $B$, then multiply the result by itself. What matrix do you get?',
      solution:
        'Brackets come first, so add $A$ and $B$ position by position: $A + B = \\begin{bmatrix} 1 + 1 & 2 + (-1) \\\\ 3 + 2 & 1 + 1 \\end{bmatrix} = \\begin{bmatrix} 2 & 1 \\\\ 5 & 2 \\end{bmatrix}$.\n\n' +
        'Squaring means multiplying this matrix by itself. It is a full matrix multiplication: each entry is one row times one column, so multiply matching numbers and add.\n\n' +
        'The rows are $2, 1$ and $5, 2$. The columns are $2, 5$ and $1, 2$. Work through the four entries:\n\n| Entry | Working | Value |\n|---|---|---|\n| Row 1, column 1 | $2 \\times 2 + 1 \\times 5$ | $9$ |\n| Row 1, column 2 | $2 \\times 1 + 1 \\times 2$ | $4$ |\n| Row 2, column 1 | $5 \\times 2 + 2 \\times 5$ | $20$ |\n| Row 2, column 2 | $5 \\times 1 + 2 \\times 2$ | $9$ |',
      conclusion: 'Placing each value in its row and column gives $\\begin{bmatrix} 9 & 4 \\\\ 20 & 9 \\end{bmatrix}$.',
      whyWrong: [
        'This is $A^{2} + 2AB + B^{2}$. That expansion assumes $AB = BA$, which is false for these matrices. The correct expansion is $A^{2} + AB + BA + B^{2}$.',
        'This is $A^{2} + B^{2}$: it drops the cross terms $AB + BA$ completely.',
        'This squares each entry of $A + B$ separately. Squaring a matrix means multiplying it by itself (rows times columns).',
        null,
      ],
      keyIdea: 'For $(A + B)^{2}$, add first, then square the single matrix. Expanding is slower and has four terms, $A^{2} + AB + BA + B^{2}$, because $AB$ and $BA$ are usually different.',
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
      asking: 'Which pair of matrix sizes can\'t be multiplied together?',
      solution:
        'Each entry of a product pairs a row of the first matrix with a column of the second, number by number. So a row of the first must be as long as a column of the second.\n\n' +
        'A row has one number per column, and a column has one number per row. So the **columns of the first must equal the rows of the second**. These are the **inner numbers** when you write the orders side by side.\n\n' +
        'Compare the inner numbers for each pair:\n\n| Product | Inner numbers | Match? |\n|---|---|---|\n| $(3 \\times 4)(4 \\times 2)$ | 4 and 4 | Yes |\n| $(2 \\times 5)(5 \\times 5)$ | 5 and 5 | Yes |\n| $(1 \\times 3)(3 \\times 1)$ | 3 and 3 | Yes |\n| $(3 \\times 2)(3 \\times 2)$ | 2 and 3 | No |',
      conclusion: 'Only one pair has inner numbers that differ, 2 and 3, so the product that is not defined is a $3 \\times 2$ matrix with a $3 \\times 2$.',
      whyWrong: [
        'This product is defined: the inner dimensions $4$ and $4$ match. The outer numbers differing does not matter; they only give the size, $3 \\times 2$.',
        'This product is defined: the inner dimensions $5$ and $5$ match. A square second matrix causes no problem, and the result is $2 \\times 5$.',
        null,
        'This product is defined: the inner dimensions $3$ and $3$ match. A $1 \\times 1$ result is still a valid matrix.',
      ],
      keyIdea: 'Write the two orders side by side and look only at the middle two numbers. Equal means the product exists. Two matrices of the same order can only be multiplied if they are square.',
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
      asking: 'Which pair of matrix sizes can be multiplied, in the order given?',
      solution:
        'A product exists only when the columns of the first matrix equal the rows of the second. That\'s because each row of the first has to pair up, number by number, with each column of the second.\n\n' +
        'Write the orders (rows $\\times$ columns) side by side. The two middle numbers, the **inner numbers**, are the ones that must match.\n\n' +
        'Compare them for each pair:\n\n| Product | Inner numbers | Match? |\n|---|---|---|\n| $(2 \\times 3)(2 \\times 3)$ | 3 and 2 | No |\n| $(2 \\times 4)(3 \\times 2)$ | 4 and 3 | No |\n| $(3 \\times 5)(4 \\times 3)$ | 5 and 4 | No |\n| $(4 \\times 2)(2 \\times 5)$ | 2 and 2 | Yes |',
      conclusion: 'Only one pair has matching inner numbers, so the product that is defined is a $4 \\times 2$ matrix times a $2 \\times 5$ matrix.',
      whyWrong: [
        'Having the same order does not make a product defined. Same order is the condition for **adding** matrices; here the inner dimensions are $3$ and $2$.',
        null,
        'This order fails because the inner dimensions are $4$ and $3$. The product would only work the other way round, $(3 \\times 2)(2 \\times 4)$, and order matters.',
        'This matches the **outer** dimensions ($3$ and $3$) instead of the inner ones. The inner dimensions are $5$ and $4$, so it is not defined.',
      ],
      keyIdea: 'Check only the middle two numbers. Equal orders are the rule for adding, not multiplying, and matching outer numbers don\'t help. The order counts too: $(3 \\times 2)(2 \\times 4)$ works, but $(2 \\times 4)(3 \\times 2)$ doesn\'t.',
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
      asking: 'What does the matrix called the unit matrix look like?',
      solution:
        'The **unit matrix** (also called the identity matrix) does for matrices what the number 1 does for numbers: multiplying by it changes nothing.\n\n' +
        'To leave a matrix unchanged, it needs 1s on the **main diagonal** (top left to bottom right) and 0s everywhere else. **Order $m$** means it is square, with $m$ rows and $m$ columns. For example, order 2 is $\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$.',
      conclusion: 'So the unit matrix of order $m$ is the $m \\times m$ matrix with $1$s on the main diagonal and $0$s elsewhere.',
      whyWrong: [
        null,
        'This reads "unit" as "every entry is $1$". The unit matrix has $0$s off the main diagonal.',
        '"Order $m$" describes a square $m \\times m$ matrix, not a single column of $m$ entries.',
        'This is the zero matrix of order $m$. Multiplying by it gives zero, whereas the unit matrix leaves a matrix unchanged.',
      ],
      keyIdea: 'To test a claim about the unit matrix, picture the order 2 case and multiply it by another matrix. The other matrix should come back unchanged.',
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
      asking: 'What must be true about the sizes of $A$ and $B$ so that $AB$ can be calculated?',
      solution:
        '$m \\times n$ means $m$ rows and $n$ columns. So $A$ has $n$ columns, and $B$ has $p$ rows.\n\n' +
        'Each entry of $AB$ comes from one row of $A$ and one column of $B$, multiplied number by number. A row of $A$ holds $n$ numbers, one per column. A column of $B$ holds $p$ numbers, one per row.\n\n' +
        'For every number to have a partner, those two lengths must be equal, so $n$ and $p$ must be the same.',
      conclusion: 'The columns of $A$ must equal the rows of $B$, so $AB$ is defined when $n = p$.',
      whyWrong: [
        null,
        'This compares the **rows** of $A$ with the rows of $B$. It is the columns of $A$ that must equal the rows of $B$.',
        'This compares the **columns** of both matrices. The columns of $A$ must equal the **rows** of $B$.',
        'This is the condition for $BA$ (columns of $B$ equal rows of $A$), not for $AB$.',
      ],
      keyIdea: 'Write the sizes side by side, $(m \\times n)(p \\times q)$, and set the two middle letters equal. This works with letters just as it does with numbers.',
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
      asking: 'If you swap the rows and columns of a $3 \\times 5$ matrix, what size is the new matrix?',
      solution:
        'The **transpose** $A^{T}$ turns each row into a column: row 1 becomes column 1, row 2 becomes column 2, and so on.\n\n' +
        '$A$ is $3 \\times 5$, so it has 3 rows and 5 columns. Its 3 rows become 3 columns, and its 5 columns become 5 rows.\n\n' +
        'An order is written rows first, so 5 rows and 3 columns gives $5 \\times 3$.',
      conclusion: 'The transpose swaps the two numbers of the order, so $A^{T}$ has order $5 \\times 3$.',
      whyWrong: [
        null,
        'This keeps the order unchanged. Transposing swaps rows and columns, so the order changes unless the matrix is square.',
        'This is the order of $A^{T}A$, which is $(5 \\times 3)(3 \\times 5)$. The question asks about $A^{T}$ alone.',
        'This is the order of $AA^{T}$, which is $(3 \\times 5)(5 \\times 3)$. The question asks about $A^{T}$ alone.',
      ],
      keyIdea: 'A transpose swaps the two numbers in the order: $m \\times n$ becomes $n \\times m$. A square matrix keeps its order.',
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
      asking: 'What matrix do you get when the rows become the columns?',
      solution:
        'The **transpose** swaps rows and columns: the first row becomes the first column, and the second row becomes the second column.\n\n' +
        'The first row is $1, 2, 3$. Write it downwards as the first column. The second row is $4, 5, 6$. Write it downwards as the second column.\n\n' +
        'The original was $2 \\times 3$, so the result is $3 \\times 2$: $\\begin{bmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{bmatrix}$.',
      conclusion: 'Each row is now a column with its numbers in the same order, so the transpose is $\\begin{bmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{bmatrix}$.',
      whyWrong: [
        null,
        'This is the original matrix. A $2 \\times 3$ matrix must become $3 \\times 2$ when transposed.',
        'This swaps the two rows with each other. Transposing turns rows into columns; it does not reorder the rows.',
        'This reverses the entries within each row. Transposing turns rows into columns; it does not reverse them.',
      ],
      keyIdea: 'To transpose, copy each row downwards as a column, keeping its numbers in the same order. The order of the matrix must flip, for example $2 \\times 3$ to $3 \\times 2$.',
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
      asking: 'Which of the two products, $AB$ and $BA$, can be calculated?',
      solution:
        'A product exists only when the two middle numbers match, once the orders (rows $\\times$ columns) are written side by side. These are called the **inner numbers**.\n\n' +
        'Test $AB$: it is $(2 \\times 3)(4 \\times 2)$. The inner numbers are 3 and 4. They differ, so $AB$ doesn\'t exist.\n\n' +
        'Test $BA$: it is $(4 \\times 2)(2 \\times 3)$. The inner numbers are 2 and 2. They match, so $BA$ exists.',
      conclusion: 'Only one order works, so the true statement is that $BA$ is defined but $AB$ is not.',
      whyWrong: [
        'This has the two orders the wrong way round. For $AB$ the inner dimensions are $3$ and $4$, which do not match.',
        null,
        'This assumes that if one order works the other does too. Here only $BA$ has matching inner dimensions.',
        'This checks only $AB$ and stops. $BA$ is $(4 \\times 2)(2 \\times 3)$, whose inner dimensions match.',
      ],
      keyIdea: 'Always test both orders separately, because swapping the matrices changes which numbers are in the middle. One order can work while the other fails.',
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
      asking: 'Which of these four expressions can be calculated for a $2 \\times 3$ matrix?',
      solution:
        '$A$ has 2 rows and 3 columns. Its **transpose** $A^{T}$ swaps rows and columns, so $A^{T}$ is $3 \\times 2$.\n\n' +
        'Each expression has its own size rule. A product needs equal middle numbers when the orders are written side by side. A sum needs two matrices of the same order. An **inverse** $A^{-1}$ needs a square matrix.\n\n' +
        'Test each expression against its rule:\n\n| Expression | Size check | Defined? |\n|---|---|---|\n| $A^{2}$ | $(2 \\times 3)(2 \\times 3)$: middle numbers 3 and 2 | No |\n| $A + A^{T}$ | $2 \\times 3$ and $3 \\times 2$: different orders | No |\n| $A^{-1}$ | $A$ isn\'t square | No |\n| $A^{T}A$ | $(3 \\times 2)(2 \\times 3)$: middle numbers 2 and 2 | Yes |',
      conclusion: 'Only one expression passes its size rule, so the one that is defined is $A^{T}A$.',
      whyWrong: [
        null,
        '$A^{2}$ needs $A$ to be square: $(2 \\times 3)(2 \\times 3)$ has inner dimensions $3$ and $2$.',
        'Adding needs equal orders, but $A$ is $2 \\times 3$ and $A^{T}$ is $3 \\times 2$. This sum only exists for a square matrix.',
        'Only a square matrix can have an inverse, and $A$ is $2 \\times 3$.',
      ],
      keyIdea: 'Use the three size rules: products need matching middle numbers, sums need equal orders, inverses need a square matrix. For any matrix, $A^{T}A$ and $AA^{T}$ always exist.',
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
      asking: 'Which expression can be calculated and comes out with 2 rows and 2 columns?',
      solution:
        '$A$ is $2 \\times 3$, so its **transpose** $A^{T}$, with rows and columns swapped, is $3 \\times 2$.\n\n' +
        'For a product, write the orders side by side. The middle numbers must match, and the end numbers give the size. A sum needs two matrices of the same order.\n\n' +
        'Test each expression:\n\n| Expression | Orders | Defined? | Size |\n|---|---|---|---|\n| $A^{2}$ | $(2 \\times 3)(2 \\times 3)$ | No: middle numbers 3 and 2 | None |\n| $A + A^{T}$ | $2 \\times 3$ and $3 \\times 2$ | No: different orders | None |\n| $A^{T}A$ | $(3 \\times 2)(2 \\times 3)$ | Yes | $3 \\times 3$ |\n| $AA^{T}$ | $(2 \\times 3)(3 \\times 2)$ | Yes | $2 \\times 2$ |',
      conclusion: 'Two of them exist, but only $AA^{T}$ has order $2 \\times 2$.',
      whyWrong: [
        '$A^{T}A$ is defined, but it is $3 \\times 3$. The outer dimensions of $(3 \\times 2)(2 \\times 3)$ give the size.',
        null,
        '$A^{2}$ is not defined: $(2 \\times 3)(2 \\times 3)$ has inner dimensions $3$ and $2$.',
        '$A + A^{T}$ is not defined, because $2 \\times 3$ and $3 \\times 2$ are different orders.',
      ],
      keyIdea: 'For an $m \\times n$ matrix, $AA^{T}$ is $m \\times m$ and $A^{T}A$ is $n \\times n$. Look at the outer letters: the matrix on the far left gives the rows, and the one on the far right gives the columns.',
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
      asking: 'What size must $B$ be so that $A$ times $B$ gives a $4 \\times 5$ matrix?',
      solution:
        'Call the order of $B$ $r \\times c$, meaning $r$ rows and $c$ columns. Then what we know is that $(4 \\times 3)(r \\times c)$ gives $4 \\times 5$.\n\n' +
        'The two middle numbers must match for the product to exist. The first matrix ends in 3, so $r = 3$.\n\n' +
        'The two end numbers give the order of the product, which is $4 \\times 5$. It ends in 5, so $c = 5$.\n\n' +
        'So $B$ has 3 rows and 5 columns: it is $3 \\times 5$.',
      conclusion: '$(4 \\times 3)(3 \\times 5)$ has matching middle numbers and gives $4 \\times 5$, so $B$ has order $3 \\times 5$.',
      whyWrong: [
        null,
        'This has the rows and columns of $B$ the wrong way round. $(4 \\times 3)(5 \\times 3)$ is not defined.',
        'This copies the order of $AB$. But $(4 \\times 3)(4 \\times 5)$ is not defined, because the inner dimensions are $3$ and $4$.',
        'This reverses the order of $A$. Then $AB$ would be $(4 \\times 3)(3 \\times 4)$, which is $4 \\times 4$, not $4 \\times 5$.',
      ],
      keyIdea: 'To work backwards, write $(m \\times n)(r \\times c)$ gives $m \\times c$. The missing matrix\'s rows equal the middle number $n$, and its columns equal the last number of the product.',
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
      asking: 'What size is the transpose of the product $AB$, written in letters?',
      solution:
        'Do the brackets first. Write the orders (rows $\\times$ columns) side by side: $(m \\times n)(n \\times p)$. The middle letters match, so the product exists.\n\n' +
        'The end letters give the order of the product, so $AB$ is $m \\times p$.\n\n' +
        'The $T$ means **transpose**, which swaps rows and columns. So $m \\times p$ becomes $p \\times m$.',
      conclusion: '$AB$ is $m \\times p$ and the transpose swaps those letters, so $(AB)^{T}$ has order $p \\times m$.',
      whyWrong: [
        null,
        'This is the order of $AB$ itself. The transpose then swaps rows and columns.',
        'This uses the inner dimensions. They only have to match; the outer dimensions give the size.',
        'This transposes $A$ alone. The transpose applies to the whole product $AB$, which is $m \\times p$.',
      ],
      keyIdea: 'Do the brackets first, then the transpose. To test a letters answer, try small numbers: if $A$ is $2 \\times 3$ and $B$ is $3 \\times 4$, then $AB$ is $2 \\times 4$ and $(AB)^{T}$ is $4 \\times 2$.',
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
      asking: 'Which of these four products can\'t be calculated?',
      solution:
        '$P$ is $3 \\times 2$, so its **transpose** $P^{T}$, with rows and columns swapped, is $2 \\times 3$. $Q$ is $2 \\times 2$.\n\n' +
        'A product exists only when the two middle numbers match, once the orders are written side by side. Test each one:\n\n| Product | Orders side by side | Middle numbers | Defined? |\n|---|---|---|---|\n| $PQ$ | $(3 \\times 2)(2 \\times 2)$ | 2 and 2 | Yes |\n| $QP^{T}$ | $(2 \\times 2)(2 \\times 3)$ | 2 and 2 | Yes |\n| $P^{T}P$ | $(2 \\times 3)(3 \\times 2)$ | 3 and 3 | Yes |\n| $QP$ | $(2 \\times 2)(3 \\times 2)$ | 2 and 3 | No |',
      conclusion: 'Only one product has middle numbers that differ, so the one that is not defined is $QP$.',
      whyWrong: [
        '$PQ$ is defined: the inner dimensions $2$ and $2$ match, giving $3 \\times 2$.',
        null,
        '$QP^{T}$ is defined: after transposing, $P^{T}$ is $2 \\times 3$, so the inner dimensions match.',
        '$P^{T}P$ is defined for any matrix $P$: here $(2 \\times 3)(3 \\times 2)$ gives $2 \\times 2$.',
      ],
      keyIdea: 'Replace each matrix by its order, swapping the two numbers for a transpose, then compare the middle numbers. Being square doesn\'t help a matrix on its own: it still needs a matching neighbour.',
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
