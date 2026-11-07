import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { matrix } from '../../../lib/tex';
import { det2, det3, inv2, matMul, rank, transpose, type Mat } from '../../../lib/mathx';

// String.raw keeps LaTeX backslashes as written; real line breaks come from L(...).
const t = String.raw;
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
      asking: 'What number does the determinant formula give for this matrix?',
      solution:
        'The **determinant** is a single number worked out from a square matrix. For a $2 \\times 2$ matrix $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, the formula is $ad - bc$.\n\n' +
        'Match the letters to this matrix: $a = 3$, $b = 5$, $c = 2$, $d = 4$.\n\n' +
        'Multiply along the main diagonal (top left to bottom right): $ad = 3 \\times 4 = 12$.\n\n' +
        'Multiply along the other diagonal: $bc = 5 \\times 2 = 10$.\n\n' +
        'Subtract the second product from the first: $12 - 10 = 2$.',
      conclusion: 'The two diagonal products are 12 and 10, and their difference gives a determinant of $2$.',
      whyWrong: [
        null,
        t`This is $12 + 10$: the two diagonal products were **added**. The determinant subtracts the second product: $ad - bc$.`,
        t`This is $bc - ad = 10 - 12$: the diagonals were subtracted in the wrong order. Always start with the leading diagonal (top-left times bottom-right).`,
        t`This is $3 + 4$, the sum of the leading diagonal (the trace), not the determinant.`,
      ],
      keyIdea: 'For a $2 \\times 2$ determinant: main diagonal product minus other diagonal product, always in that order, $ad - bc$.',
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
      asking: 'What value of $k$ makes the determinant of this matrix zero?',
      solution:
        '**Singular** means the matrix has no inverse (no matrix that undoes it). That happens exactly when its **determinant** is 0, so we need the determinant to equal 0.\n\n' +
        'The determinant of $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ is $ad - bc$. Here $a = k$, $b = 6$, $c = 2$ and $d = 3$, so it is $k \\times 3 - 6 \\times 2 = 3k - 12$.\n\n' +
        'Set it equal to 0: $3k - 12 = 0$. Add 12 to both sides to get $3k = 12$.\n\n' +
        'Divide both sides by 3 to get $k$ on its own: $k = 4$.',
      conclusion: 'With $k = 4$ the first row $4, 6$ is twice the second row $2, 3$, so the determinant is 0.',
      whyWrong: [
        t`This comes from writing the determinant as $3k + 12$, i.e. adding $bc$ instead of subtracting it.`,
        null,
        t`This comes from multiplying entries in the same **column** ($k \times 2 - 6 \times 3 = 0$) instead of along the diagonals.`,
        t`A zero entry does not make a matrix singular. With $k = 0$ the determinant is $0 - 12 = -12 \ne 0$, so the matrix is invertible.`,
      ],
      keyIdea: 'When a question says singular or not invertible, write $ad - bc = 0$ and solve for the unknown. A matrix like this is singular when one row is a multiple of the other.',
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
      asking: 'Which matrix undoes $A$, so that multiplying the two together gives the identity matrix?',
      solution:
        'The **inverse** $A^{-1}$ is the matrix that multiplies with $A$ to give the identity matrix $I$ (1s on the main diagonal, 0s elsewhere). For a $2 \\times 2$ matrix the formula is:\n\n$$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$$\n\n' +
        'First find $ad - bc$, called the **determinant**. Here $a = 5$, $b = 2$, $c = 7$ and $d = 3$, so it is $5 \\times 3 - 2 \\times 7 = 15 - 14 = 1$. Dividing by 1 changes nothing.\n\n' +
        'Now swap the 5 and the 3. Change the signs of the 2 and the 7, leaving them where they are. That gives $\\begin{bmatrix} 3 & -2 \\\\ -7 & 5 \\end{bmatrix}$.',
      conclusion: 'Row 1 of $A$ times column 1 of this matrix is $15 - 14 = 1$, and the other entries also match $I$. So the inverse is $\\begin{bmatrix} 3 & -2 \\\\ -7 & 5 \\end{bmatrix}$.',
      whyWrong: [
        t`The off-diagonal signs were changed, but $5$ and $3$ were **not swapped**. Multiplying this by $A$ does not give $I$.`,
        t`The $5$ and $3$ were swapped, but the signs of $2$ and $7$ were **not changed**.`,
        null,
        t`The $2$ and $7$ were also swapped with each other. Only the leading-diagonal entries swap; the other two stay in place and just change sign.`,
      ],
      keyIdea: 'For a $2 \\times 2$ inverse: find $ad - bc$, swap $a$ and $d$, change the signs of $b$ and $c$, then divide every entry by $ad - bc$. To test it, multiply by the original and look for $I$.',
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
      asking: 'If every entry of a $3 \\times 3$ matrix is doubled, what happens to its determinant of 5?',
      solution:
        'The **determinant** is a single number worked out from a square matrix. If you multiply just one row by 2, the determinant is multiplied by 2. For example, doubling the top row of a $2 \\times 2$ matrix gives $(2a)d - (2b)c = 2(ad - bc)$.\n\n' +
        '$2A$ means every entry of $A$ is doubled. A $3 \\times 3$ matrix has 3 rows, so all 3 rows are multiplied by 2.\n\n' +
        'Each row brings its own factor of 2, which gives $2 \\times 2 \\times 2 = 2^{3} = 8$. So $\\det(2A) = 8 \\times \\det(A)$.\n\n' +
        'Substitute $\\det(A) = 5$: $8 \\times 5 = 40$.',
      conclusion: 'Doubling all 3 rows multiplies the determinant by 8, so $\\det(2A)$ is $40$.',
      whyWrong: [
        t`This is $2 \times 5$: the determinant was multiplied by $k$ only once. All three rows are doubled, so the factor is $2^{3}$.`,
        null,
        t`This uses $2^{2}$, the rule for a $2 \times 2$ matrix. For a $3 \times 3$ matrix the power is $3$.`,
        t`This multiplies by $2 \times 3 = 6$ (the scalar times the size) instead of $2^{3} = 8$.`,
      ],
      keyIdea: 'For an $n \\times n$ matrix, $\\det(kA) = k^{n}\\det(A)$, where the power $n$ is the number of rows. Don\'t just multiply the determinant by $k$ once.',
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
      asking: 'Which of these matrices has a determinant of zero?',
      solution:
        '**Singular** means the matrix has no inverse, which happens exactly when its **determinant** is 0. For $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ the determinant is $ad - bc$.\n\n' +
        'Work out $ad - bc$ for each matrix:\n\n| Matrix | $ad - bc$ | Value |\n|---|---|---|\n| $\\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$ | $0 \\times 0 - 1 \\times 1$ | $-1$ |\n| $\\begin{bmatrix} 2 & -6 \\\\ 1 & 3 \\end{bmatrix}$ | $2 \\times 3 - (-6) \\times 1$ | $12$ |\n| $\\begin{bmatrix} 4 & 2 \\\\ 2 & 3 \\end{bmatrix}$ | $4 \\times 3 - 2 \\times 2$ | $8$ |\n| $\\begin{bmatrix} 2 & 6 \\\\ 1 & 3 \\end{bmatrix}$ | $2 \\times 3 - 6 \\times 1$ | $0$ |',
      conclusion: 'Only one determinant is 0, and its first row is twice its second row. So the singular matrix is $\\begin{bmatrix} 2 & 6 \\\\ 1 & 3 \\end{bmatrix}$.',
      whyWrong: [
        t`Zeros in a matrix do not make it singular. Its determinant is $0 \times 0 - 1 \times 1 = -1 \ne 0$, so it is invertible (it is its own inverse).`,
        t`The rows look like multiples, but the sign differs: $\left(2, -6\right)$ is not a multiple of $\left(1, 3\right)$. The determinant is $6 + 6 = 12$.`,
        t`Being symmetric has nothing to do with being singular. The determinant is $12 - 4 = 8 \ne 0$.`,
        null,
      ],
      keyIdea: 'Work out $ad - bc$ for each matrix and look for 0. A quick spot: a $2 \\times 2$ matrix is singular when one row is a multiple of the other, sign included.',
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
      asking: 'What is the determinant of this matrix, which has only zeros below the diagonal?',
      solution:
        '$\\det(A)$ is the **determinant** of $A$: a single number worked out from a square matrix. This is a **triangular matrix**: every entry below the main diagonal (top left to bottom right) is 0. Its determinant is just the diagonal entries multiplied together.\n\n' +
        'Here is why. A $3 \\times 3$ determinant can be worked out down the first column: each entry multiplies the $2 \\times 2$ determinant left when you cover that entry\'s row and column. Only the 2 is non-zero, so only the 2 counts. Covering its row and column leaves $\\begin{vmatrix} 3 & 4 \\\\ 0 & -2 \\end{vmatrix}$. That is the main diagonal product minus the other diagonal product: $3 \\times (-2) - 4 \\times 0 = 3 \\times (-2)$.\n\n' +
        'So the determinant is $2 \\times 3 \\times (-2)$, the three diagonal entries multiplied together.\n\n' +
        'Multiply in two stages: $2 \\times 3 = 6$, then $6 \\times (-2) = -12$.',
      conclusion: 'The diagonal entries are 2, 3 and $-2$, and their product gives a determinant of $-12$.',
      whyWrong: [
        t`This is $2 + 3 + \left(-2\right)$: the diagonal entries were **added** (that is the trace). For a triangular matrix you **multiply** them.`,
        null,
        t`Zeros below the diagonal do not make the determinant $0$; a whole row or column of zeros would. Here the diagonal entries are all non-zero.`,
        t`The minus sign on the $-2$ was lost: $2 \times 3 \times 2 = 12$.`,
      ],
      keyIdea: 'Spot zeros all below (or all above) the main diagonal. Then the determinant is the product of the diagonal entries, signs included. A zero on the diagonal makes it 0.',
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
      asking: 'Which matrix holds the numbers in front of $x$ and $y$ in these two equations?',
      solution:
        '$AX = B$ writes the two equations as one matrix equation. $A$ holds the **coefficients** (the numbers multiplying $x$ and $y$), $X$ holds the unknowns, and $B$ holds the right-hand sides.\n\n' +
        'Each equation gives one row of $A$: the $x$ number first, then the $y$ number. In $2x + 3y = 7$ they are 2 and 3, so row 1 is $2, 3$.\n\n' +
        'In $x - 4y = -2$, $x$ on its own means one $x$, so its number is 1. The minus sign belongs to the 4, so the $y$ number is $-4$. Row 2 is $1, -4$.\n\n' +
        'Stack the two rows: $A = \\begin{bmatrix} 2 & 3 \\\\ 1 & -4 \\end{bmatrix}$.',
      conclusion: 'Multiplying this by $X$ gives $2x + 3y$ on top and $x - 4y$ below, matching the equations. So $A$ is $\\begin{bmatrix} 2 & 3 \\\\ 1 & -4 \\end{bmatrix}$.',
      whyWrong: [
        t`The coefficients were written in **columns** instead of rows. Multiplying this by $X$ gives $2x + y$ on the top row, which is not the first equation.`,
        t`The minus sign of $-4y$ was dropped. The coefficient of $y$ in the second equation is $-4$.`,
        null,
        t`This is the **augmented** matrix $\left[A \mid B\right]$: it includes the right-hand sides. $A$ holds only the coefficients, and a $2 \times 3$ matrix cannot multiply the $2 \times 1$ vector $X$.`,
      ],
      keyIdea: 'Line up each equation with $x$ first, then $y$. Each equation becomes a row of coefficients, signs included. The right-hand sides go in $B$, never in $A$.',
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
      asking: 'What is the determinant of this $3 \\times 3$ matrix?',
      solution:
        'The **determinant** is a single number worked out from a square matrix. For a $3 \\times 3$ matrix, use the first row: each entry multiplies a small $2 \\times 2$ determinant, and the signs go $+\\;-\\;+$.\n\n' +
        'To find the small determinant for an entry, cover that entry\'s row and column. Four numbers are left, and $\\begin{vmatrix} p & q \\\\ r & s \\end{vmatrix} = ps - qr$.\n\n' +
        'The first row is $2, 1, 3$. Here is the small determinant for each entry:\n\n| Entry | Numbers left | Small determinant |\n|---|---|---|\n| $2$ | $\\begin{vmatrix} -1 & 4 \\\\ 2 & 1 \\end{vmatrix}$ | $(-1) \\times 1 - 4 \\times 2 = -9$ |\n| $1$ | $\\begin{vmatrix} 0 & 4 \\\\ 1 & 1 \\end{vmatrix}$ | $0 \\times 1 - 4 \\times 1 = -4$ |\n| $3$ | $\\begin{vmatrix} 0 & -1 \\\\ 1 & 2 \\end{vmatrix}$ | $0 \\times 2 - (-1) \\times 1 = 1$ |\n\n' +
        'Combine them with the signs $+\\;-\\;+$: $2 \\times (-9) - 1 \\times (-4) + 3 \\times 1$.\n\n' +
        'Work it out. Taking away $-4$ adds 4, so this is $-18 + 4 + 3 = -11$.',
      conclusion: 'The three terms are $-18$, $+4$ and $+3$, so the determinant is $-11$.',
      whyWrong: [
        t`This forgets the **minus** sign on the middle term: $-18 + 1\left(-4\right) + 3 = -19$. The signs along the first row are $+\;-\;+$.`,
        t`This adds the products inside each $2 \times 2$ minor instead of subtracting them: $2\left(-1 + 8\right) - 1\left(0 + 4\right) + 3\left(0 - 1\right) = 14 - 4 - 3 = 7$.`,
        t`This works out every $2 \times 2$ minor as $bc - ad$ (wrong order), which flips the sign of the whole answer.`,
        null,
      ],
      keyIdea: 'For a $3 \\times 3$ determinant: go along the first row, cover each entry\'s row and column, find the $2 \\times 2$ determinant left, and combine as first $-$ second $+$ third.',
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
      asking: 'Which matrix undoes $A$, so that multiplying the two together gives the identity matrix?',
      solution:
        'The **inverse** $A^{-1}$ is the matrix that multiplies with $A$ to give the identity matrix $I$ (1s on the main diagonal, 0s elsewhere). For a $2 \\times 2$ matrix the formula is:\n\n$$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$$\n\n' +
        'First find $ad - bc$, called the **determinant**. Here $a = 3$, $b = 4$, $c = 1$ and $d = 2$, so it is $3 \\times 2 - 4 \\times 1 = 6 - 4 = 2$.\n\n' +
        'Swap the 3 and the 2. Change the signs of the 4 and the 1, leaving them where they are. That gives $\\begin{bmatrix} 2 & -4 \\\\ -1 & 3 \\end{bmatrix}$.\n\n' +
        'Divide every entry by the determinant, 2: $\\frac{1}{2}\\begin{bmatrix} 2 & -4 \\\\ -1 & 3 \\end{bmatrix} = \\begin{bmatrix} 1 & -2 \\\\ -\\frac{1}{2} & \\frac{3}{2} \\end{bmatrix}$.',
      conclusion: 'Row 1 of $A$ times column 1 of this matrix is $3 - 2 = 1$, and the other entries also match $I$. So $A^{-1}$ is $\\begin{bmatrix} 1 & -2 \\\\ -\\frac{1}{2} & \\frac{3}{2} \\end{bmatrix}$.',
      whyWrong: [
        null,
        t`This is the swapped-and-negated matrix, but it was **not divided by the determinant** $2$. Multiplying it by $A$ gives $2I$, not $I$.`,
        t`This was divided by $2$, but $3$ and $2$ were **not swapped**.`,
        t`This **multiplies** by the determinant instead of dividing by it. Multiplying it by $A$ gives $4I$.`,
      ],
      keyIdea: 'For a $2 \\times 2$ inverse: find $ad - bc$, swap $a$ and $d$, change the signs of $b$ and $c$, then divide every entry by $ad - bc$. Forgetting that last division is the usual slip.',
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
      asking: 'What is the determinant of the product of $A$ and $B$?',
      solution:
        'The **determinant** of $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ is the number $ad - bc$. We could multiply $A$ by $B$ first, but there is a shortcut: $\\det(AB) = \\det(A) \\times \\det(B)$. So find each determinant on its own.\n\n' +
        'For $A$: $\\det(A) = 2 \\times 3 - 1 \\times 1 = 6 - 1 = 5$.\n\n' +
        'For $B$: $\\det(B) = 1 \\times 2 - 4 \\times (-1) = 2 + 4 = 6$. Taking away $-4$ means adding 4.\n\n' +
        'Multiply the two results: $\\det(AB) = 5 \\times 6 = 30$.',
      conclusion: 'The determinant of a product is the product of the determinants, so $\\det(AB)$ is $30$.',
      whyWrong: [
        t`This **adds** the determinants, $5 + 6$. The rule for a product is $\det(AB) = \det A \times \det B$.`,
        null,
        t`This multiplies matching entries ($2 \times 1$, $1 \times 4$, ...) to get $${M([[2, 4], [-1, 6]])}$, whose determinant is $16$. Matrix multiplication is rows times columns, not entry by entry.`,
        t`This is $\det(A + B)$: $A + B = ${M([[3, 5], [0, 5]])}$ has determinant $15$. The question asks for the product $AB$.`,
      ],
      keyIdea: 'When you see $\\det(AB)$, find $\\det(A)$ and $\\det(B)$ separately and multiply them. It saves working out the product, and it works for square matrices of any size.',
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
      asking: 'What value of $k$ makes these two equations impossible to solve together?',
      solution:
        'Write the numbers in front of $x$ and $y$ as a matrix: $\\begin{bmatrix} 3 & -2 \\\\ 6 & k \\end{bmatrix}$. If its **determinant** ($ad - bc$) isn\'t 0, there is exactly one solution. If it is 0, there is either no solution or infinitely many.\n\n' +
        'So for no solution, the determinant must be 0. Work it out: $3 \\times k - (-2) \\times 6 = 3k + 12$.\n\n' +
        'Set it to 0 and solve: $3k + 12 = 0$. Take 12 from both sides to get $3k = -12$, then divide by 3 to get $k = -4$.',
      conclusion: 'With $k = -4$, halving the second equation gives $3x - 2y = 6$, which contradicts $3x - 2y = 5$. So there is no solution.',
      whyWrong: [
        null,
        t`This comes from losing the minus sign of $-2$ and writing the determinant as $3k - 12$.`,
        t`This makes the $y$-coefficients match ($-2$ and $-2$), but the $x$-coefficient doubled from $3$ to $6$, so the $y$-coefficient must double too: $-4$. With $k = -2$ the determinant is $-6 + 12 = 6 \ne 0$ and there is exactly one solution.`,
        t`This is the condition for exactly **one** solution ($\det \ne 0$). The question asks when there is **no** solution.`,
      ],
      keyIdea: 'For no solution: set $ad - bc = 0$ to find the unknown, then compare the equations. Same left side with different right sides means no solution. Same on both sides means infinitely many.',
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
      asking: 'What values of $x$ and $y$ satisfy this matrix equation?',
      solution:
        '$AX = B$ is like $3x = 6$ with matrices. To undo $A$, multiply both sides by its **inverse** $A^{-1}$ (the matrix that undoes $A$). That gives $X = A^{-1}B$.\n\n' +
        'For the inverse, first find the **determinant**, $ad - bc$: $2 \\times 3 - 1 \\times 5 = 6 - 5 = 1$.\n\n' +
        'Swap the 2 and the 3, change the signs of the 1 and the 5, then divide by the determinant. Dividing by 1 changes nothing, so $A^{-1} = \\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}$.\n\n' +
        'Multiply $A^{-1}$ by $B$, each row times the column:\n\n$$\\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}\\begin{bmatrix} 4 \\\\ 11 \\end{bmatrix} = \\begin{bmatrix} 3 \\times 4 + (-1) \\times 11 \\\\ (-5) \\times 4 + 2 \\times 11 \\end{bmatrix} = \\begin{bmatrix} 12 - 11 \\\\ -20 + 22 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}$$',
      conclusion: 'The top entry is $x$ and the bottom entry is $y$, so $x = 1$, $y = 2$. These fit the originals: $2 + 2 = 4$ and $5 + 6 = 11$.',
      whyWrong: [
        t`This uses $${M([[2, -1], [-5, 3]])}$ as the inverse: the signs were changed but $2$ and $3$ were not swapped.`,
        t`This is $AB$, not $A^{-1}B$: the matrix was multiplied by $B$ instead of being inverted first.`,
        t`This uses $${M([[3, 1], [5, 2]])}$ as the inverse: $2$ and $3$ were swapped but the signs of $1$ and $5$ were not changed.`,
        null,
      ],
      keyIdea: 'To solve $AX = B$: find $A^{-1}$, then work out $X = A^{-1}B$ with $A^{-1}$ on the left. Test by putting the values back into the original equations.',
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
      asking: 'What value of $k$ makes the determinant of this matrix zero?',
      solution:
        '**Singular** means the matrix has no inverse, which happens when its **determinant** is 0. So we work out the determinant and set it equal to 0.\n\n' +
        'Use the first row to break up a $3 \\times 3$ determinant. Each entry multiplies the $2 \\times 2$ determinant left when you cover that entry\'s row and column, and the signs go $+\\;-\\;+$.\n\n' +
        'The first row is $2, 0, 0$. Each 0 multiplies its small determinant to give 0, so only the 2 counts.\n\n' +
        'Cover the 2\'s row and column. That leaves $\\begin{vmatrix} k & 3 \\\\ 2 & 1 \\end{vmatrix}$, which is $k \\times 1 - 3 \\times 2 = k - 6$. So the whole determinant is $2(k - 6)$.\n\n' +
        'Set it to 0: $2(k - 6) = 0$. Divide both sides by 2 to get $k - 6 = 0$, then add 6 to get $k = 6$.',
      conclusion: 'The determinant is $2(k - 6)$, which is 0 only when $k = 6$.',
      whyWrong: [
        null,
        t`This adds inside the minor, using $ad + bc$: $k + 6 = 0$ gives $k = -6$. The determinant is $ad - bc$.`,
        t`This multiplies the wrong pairs in the minor, solving $2k - 3 = 0$. Use the diagonals: $k \times 1 - 3 \times 2$.`,
        t`This keeps only the first diagonal product, $2 \times k \times 1 = 0$, and forgets to subtract $3 \times 2$.`,
      ],
      keyIdea: 'To find where a $3 \\times 3$ matrix is singular, expand along the first row with signs $+\\;-\\;+$, set the result to 0 and solve. Zeros in that row remove whole terms.',
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
      asking: 'When $\\det(A) = 0$, how many solutions can $AX = B$ have?',
      solution:
        'The **determinant** $\\det(A)$ is a single number worked out from a square matrix. A value of 0 means $A$ has no **inverse** (no matrix that undoes it), so we can\'t write $X = A^{-1}B$. It also means one row of $A$ can be built from the others, so one equation\'s left side repeats information.\n\n' +
        'What happens next depends on the right-hand sides in $B$. Here is a small example with two equations, where the second left side is double the first:\n\n| Equations | What happens | Solutions |\n|---|---|---|\n| $x + y = 2$ and $2x + 2y = 5$ | Doubling the first gives $2x + 2y = 4$, which contradicts 5 | None |\n| $x + y = 2$ and $2x + 2y = 4$ | The second just repeats the first | Infinitely many |\n\n' +
        'The same two cases happen with 3 equations. Exactly one solution is impossible when the determinant is 0, and $B$ decides which of the two cases you get.',
      conclusion: 'A zero determinant rules out a single solution, so the true statement is: It has either no solution or infinitely many solutions, depending on $B$.',
      whyWrong: [
        t`$A^{-1}$ only exists when $\det A \ne 0$. With $\det A = 0$ you cannot write $X = A^{-1}B$, and there is never exactly one solution.`,
        null,
        t`This forgets the consistent case. For example, $B = 0$ always has at least the solution $X = 0$, and when $\det A = 0$ it then has infinitely many.`,
        t`This forgets the inconsistent case, where two equations contradict each other (same left-hand side, different right-hand sides), giving no solution.`,
      ],
      keyIdea: 'Link the determinant to the solutions: $\\det \\ne 0$ means exactly one solution. $\\det = 0$ means none or infinitely many, and you decide by comparing the right-hand sides of the repeated equations.',
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
      asking: 'Which values of $k$ make the determinant of this matrix zero?',
      solution:
        '**Not invertible** means the matrix has no inverse, which happens when its **determinant** is 0. For $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ the determinant is $ad - bc$.\n\n' +
        'Here $a = k$, $b = 2$, $c = 3$ and $d = k - 1$. So the determinant is $k(k - 1) - 2 \\times 3$.\n\n' +
        'Multiply out the bracket: $k(k - 1) = k^{2} - k$. Also $2 \\times 3 = 6$. Setting the determinant to 0 gives the quadratic $k^{2} - k - 6 = 0$.\n\n' +
        'Factorise it. We need two numbers that multiply to $-6$ and add to $-1$, which are $-3$ and $2$. So $(k - 3)(k + 2) = 0$.\n\n' +
        'A product is 0 only if one bracket is 0. $k - 3 = 0$ gives $k = 3$, and $k + 2 = 0$ gives $k = -2$.',
      conclusion: 'Both values make the determinant 0, so the matrix is not invertible for $k = 3$ or $k = -2$.',
      whyWrong: [
        t`This has the signs of the roots the wrong way round: $(k - 3)(k + 2) = 0$ gives $k = 3$ and $k = -2$, not $-3$ and $2$.`,
        t`This sets only $k(k - 1) = 0$ and forgets to subtract $bc = 2 \times 3 = 6$.`,
        null,
        t`This comes from **adding** $bc$: $k^{2} - k + 6 = 0$ has no real roots. The determinant is $ad - bc$, so the $6$ is subtracted.`,
      ],
      keyIdea: 'When $k$ appears on the main diagonal, $ad - bc = 0$ becomes a quadratic. Multiply out, collect terms on one side, factorise, and set each bracket to 0. Expect two values.',
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
      asking: 'What is the formula for the determinant of a $2 \\times 2$ matrix?',
      solution:
        'The **determinant** is a single number worked out from a square matrix. For a $2 \\times 2$ matrix, it uses the two diagonals.\n\n' +
        'Multiply along the main diagonal (top left to bottom right) to get $ad$. Multiply along the other diagonal to get $bc$.\n\n' +
        'Subtract the second from the first to get $ad - bc$. For example, $\\begin{bmatrix} 3 & 5 \\\\ 2 & 4 \\end{bmatrix}$ gives $12 - 10 = 2$.',
      conclusion: 'Main diagonal minus other diagonal gives $ad - bc$.',
      whyWrong: [
        null,
        'This adds the two diagonal products. The second product is subtracted.',
        'This multiplies along the rows ($a$ with $b$, and $c$ with $d$). The determinant uses the diagonals.',
        'This multiplies down the columns ($a$ with $c$, and $b$ with $d$). The determinant uses the diagonals.',
      ],
      keyIdea: 'Picture a cross over the four entries. Multiply along each line of the cross, then take the line starting at top left minus the line starting at top right.',
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
      asking: 'What has to be true of a square matrix for it to have an inverse?',
      solution:
        'The **inverse** $A^{-1}$ is the matrix that undoes $A$, just as $\\frac{1}{5}$ undoes 5. Multiplying the two gives the identity matrix, which acts like the number 1.\n\n' +
        'The $2 \\times 2$ formula shows the condition: $A^{-1} = \\frac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$. It divides by $ad - bc$, which is the **determinant**.\n\n' +
        'You can\'t divide by 0, so an inverse exists only when the determinant isn\'t 0. This rule holds for square matrices of every size.',
      conclusion: 'A square matrix has an inverse exactly when $\\det(A) \\ne 0$.',
      whyWrong: [
        null,
        'This is the condition for having **no** inverse. The inverse formula divides by the determinant, so it cannot be $0$.',
        t`Zero entries do not stop a matrix being invertible: $${M([[0, 1], [1, 0]])}$ has determinant $-1$ and is its own inverse.`,
        t`Being symmetric has nothing to do with it: $${M([[1, 1], [1, 1]])}$ is symmetric but has determinant $0$.`,
      ],
      keyIdea: 'The words invertible and non-singular both mean $\\det \\ne 0$. Singular means $\\det = 0$. Judge any claim by the determinant, whether or not entries are zero or the matrix is symmetric.',
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
      asking: 'What do you get when you multiply a matrix by its inverse?',
      solution:
        '$A^{-1}$ is the **inverse** of $A$, the matrix that undoes it. With numbers, $5 \\times \\frac{1}{5} = 1$, and the inverse works the same way for matrices.\n\n' +
        'For matrices, the result that plays the part of 1 is the **unit matrix** $I_{n}$: the $n \\times n$ matrix with 1s on the main diagonal and 0s elsewhere. Multiplying by it changes nothing, just like multiplying by 1.',
      conclusion: 'That is what inverse means, so $AA^{-1}$ is $I_{n}$, the unit matrix of order $n$.',
      whyWrong: [
        null,
        'This treats $A^{-1}$ like $-A$, as if the two cancel to zero. An inverse undoes a product, so the result is the identity.',
        'A matrix product is a matrix, not a number. The unit matrix plays the role that the number $1$ plays for ordinary numbers.',
        'This reads $A^{-1}$ as another copy of $A$. The power $-1$ means the inverse.',
      ],
      keyIdea: 'Whenever a matrix sits right next to its own inverse, replace the pair with $I$. This is the key move when solving $AX = B$ or simplifying products of inverses.',
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
      asking: 'What is the determinant of the $3 \\times 3$ matrix with 1s on its diagonal and 0s elsewhere?',
      solution:
        'The unit matrix of order 3 is $I_{3} = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$.\n\n' +
        'It is a **diagonal matrix**: everything off the main diagonal is 0. The **determinant** is a single number worked out from a square matrix, and for a diagonal matrix it is the diagonal entries multiplied together.\n\n' +
        'So $\\det(I_{3}) = 1 \\times 1 \\times 1 = 1$.',
      conclusion: 'Multiplying the three diagonal 1s gives a determinant of $1$.',
      whyWrong: [
        null,
        'This adds the diagonal entries, which gives the trace. The determinant of a diagonal matrix is their **product**.',
        'Zeros off the diagonal do not make the determinant $0$. Only a zero on the diagonal of a diagonal matrix would.',
        'This counts the entries of the matrix. The determinant is the product of the diagonal entries.',
      ],
      keyIdea: 'For a diagonal or triangular matrix, multiply the diagonal entries to get the determinant. Every unit matrix has determinant 1, whatever its size.',
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
      asking: 'If $A$ has determinant 4, what is the determinant of its inverse?',
      solution:
        '$A^{-1}$ is the matrix that undoes $A$, so $AA^{-1} = I$. Here $I$ is the unit matrix, with 1s on the main diagonal and 0s elsewhere.\n\n' +
        'Take the **determinant** (a single number worked out from a square matrix) of both sides. The determinant of a product is the product of the determinants, and $\\det(I) = 1$. So $\\det(A) \\times \\det(A^{-1}) = 1$.\n\n' +
        'Substitute $\\det(A) = 4$: $4 \\times \\det(A^{-1}) = 1$. Divide both sides by 4 to get $\\det(A^{-1})$ on its own: it equals $\\frac{1}{4}$.',
      conclusion: 'The two determinants must multiply to 1, so $\\det(A^{-1})$ is $\\frac{1}{4}$.',
      whyWrong: [
        null,
        'This treats the power $-1$ as a change of sign. It means the reciprocal: $\\frac{1}{4}$, not $-4$.',
        'This assumes inverting leaves the determinant unchanged. That is true of the transpose, not the inverse.',
        'This squares the $4$ before taking the reciprocal. The rule is simply one over the determinant.',
      ],
      keyIdea: '$\\det(A^{-1}) = \\frac{1}{\\det(A)}$: take the reciprocal (one over the number). If you forget, take the determinant of both sides of $AA^{-1} = I$.',
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
      asking: 'What single matrix undoes the product $AB$?',
      solution:
        'The **inverse** of a matrix is whatever multiplies it to give $I$, the unit matrix (which acts like the number 1). So we need a matrix that turns $AB$ into $I$.\n\n' +
        'Try keeping the same order: $(AB)(A^{-1}B^{-1})$. Now $B$ sits next to $A^{-1}$. They aren\'t inverses of each other, and matrices can\'t generally swap places, so nothing cancels.\n\n' +
        'Now try the reverse order: $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1}$. $B$ now sits next to its own inverse, so $BB^{-1} = I$, and multiplying by $I$ changes nothing.\n\n' +
        'That leaves $AA^{-1}$, which is $I$. So the reverse order does the job.',
      conclusion: 'Multiplying $AB$ by $B^{-1}A^{-1}$ gives $I$, so $(AB)^{-1}$ is $B^{-1}A^{-1}$.',
      whyWrong: [
        null,
        t`This keeps the same order. In $(AB)\left(A^{-1}B^{-1}\right)$ nothing cancels, because $B$ and $A^{-1}$ are not next to their own inverses.`,
        t`This reverses the order but forgets to invert the two matrices.`,
        t`Inverses do not split over a product by adding. The rule is a product in reverse order.`,
      ],
      keyIdea: 'The inverse of a product reverses the order, like taking off shoes before socks. To test a candidate, multiply it by the product and see whether neighbouring matrices cancel to $I$.',
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
      asking: 'What is the determinant of the transpose of $A$ with every entry doubled?',
      solution:
        '$2A^{T}$ means take the **transpose** of $A$ (swap its rows and columns), then double every entry. Work out how each of these changes the determinant.\n\n' +
        'A transpose doesn\'t change the determinant. $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ and $\\begin{bmatrix} a & c \\\\ b & d \\end{bmatrix}$ both give $ad - bc$. So $\\det(A^{T}) = 3$.\n\n' +
        'Doubling every entry of a $2 \\times 2$ matrix multiplies the determinant by 4, because $(2a)(2d) - (2b)(2c) = 4(ad - bc)$. So the 2 acts twice, once for each row.\n\n' +
        'Put these together: $\\det(2A^{T}) = 4 \\times 3 = 12$.',
      conclusion: 'The transpose leaves 3 unchanged and the doubling multiplies it by 4, so the determinant is $12$.',
      whyWrong: [
        null,
        t`This multiplies by $2$ only once. Both rows are doubled, so the factor is $2^{2}$.`,
        t`This uses $2^{3}$, the factor for a $3 \times 3$ matrix. Here $n = 2$.`,
        t`This ignores the scalar $2$. Transposing leaves the determinant alone, but the scalar does not.`,
      ],
      keyIdea: 'For an $n \\times n$ matrix, $\\det(kA) = k^{n}\\det(A)$, so multiply by $k$ once for each row. A transpose can be ignored, because $\\det(A^{T}) = \\det(A)$.',
    },
    check: {
      optionValues: [12, 6, 24, 3],
      compute: () => det2(scale(2, transpose([[3, 1], [0, 1]]))),
    },
  },
];
