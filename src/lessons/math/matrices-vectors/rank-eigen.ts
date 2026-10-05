import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'rank-eigen',
  know:
    '### Rank: how much "real information" a matrix holds\n\n' +
    'Think of each row of a matrix as an arrow (a vector). A set of rows is **linearly independent** if no row can be built from the others by multiplying by numbers and adding. The **rank** of a matrix is the number of linearly independent rows. (Amazingly, counting independent **columns** always gives the same number.)\n\n' +
    'Some quick facts:\n\n' +
    '- A row of all zeros never counts.\n' +
    '- A row that is a multiple of another row (like $(2, 4, 6) = 2(1, 2, 3)$) adds nothing new.\n' +
    '- A row that is a **combination** of others (like $R_3 = 2R_2 - R_1$) adds nothing new either.\n' +
    '- An $m \\times n$ matrix has rank at most the smaller of $m$ and $n$. Only the zero matrix has rank $0$.\n\n' +
    '### How to find the rank\n\n' +
    '1. **Spot it**: look for zero rows, rows that are multiples of each other, or one row that is the sum or difference of others.\n' +
    '2. **Row reduce**: subtract multiples of one row from the others to create zeros (like solving simultaneous equations). The number of non-zero rows left is the rank.\n' +
    '3. **Determinant test** (square matrices only): if $\\det(A) \\ne 0$, the matrix has **full rank** ($n$ for an $n \\times n$ matrix). If $\\det(A) = 0$, the rank is **less** than $n$, but not necessarily $0$.\n\n' +
    'For a **diagonal** matrix, the rank is simply the number of non-zero diagonal entries.\n\n' +
    '### Eigenvalues and eigenvectors: the idea\n\n' +
    'Multiplying a vector by a matrix usually changes its direction. A few special vectors only get **stretched** (or squashed, or flipped). These are **eigenvectors**, and the stretch factor is the **eigenvalue** $\\lambda$:\n\n' +
    '$$A\\mathbf{v} = \\lambda\\mathbf{v}, \\quad \\mathbf{v} \\ne \\mathbf{0}$$\n\n' +
    'For example, $\\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 3 \\\\ 3 \\end{bmatrix} = 3\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}$, so $(1, 1)$ is an eigenvector with eigenvalue $3$. The zero vector is never allowed as an eigenvector, but an eigen**value** of $0$ is fine.\n\n' +
    '### Finding eigenvalues: the characteristic equation\n\n' +
    'Rewrite $A\\mathbf{v} = \\lambda\\mathbf{v}$ as $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. A non-zero solution exists only when $A - \\lambda I$ squashes something to zero, i.e. when\n\n' +
    '$$\\det(A - \\lambda I) = 0$$\n\n' +
    'This is the **characteristic equation**. To form $A - \\lambda I$, subtract $\\lambda$ from **each diagonal entry only**. For $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ it always becomes a quadratic:\n\n' +
    '$$\\lambda^2 - (a + d)\\lambda + (ad - bc) = 0$$\n\n' +
    'That is $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$, where the **trace** is the sum of the diagonal entries. Solve it by factorising or with the quadratic formula.\n\n' +
    '### Finding eigenvectors\n\n' +
    'Once you know an eigenvalue $\\lambda$, put it into $A - \\lambda I$ and solve $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. For a $2 \\times 2$ matrix both rows give the **same** equation, such as $-4x + 2y = 0$ (or one row is all zeros and tells you nothing, which is fine: use the other row). Pick a convenient $x$, find $y$, done. Any non-zero multiple of an eigenvector is also an eigenvector, so $(1, 2)$, $(2, 4)$ and $(-1, -2)$ are "the same answer".\n\n' +
    '### Shortcuts that save time\n\n' +
    '| Fact | Why it helps |\n' +
    '| --- | --- |\n' +
    '| Triangular or diagonal matrix: eigenvalues = diagonal entries | No algebra needed |\n' +
    '| Sum of eigenvalues = trace | Instant check of your answer |\n' +
    '| Product of eigenvalues = determinant | Instant check, and finds $\\det$ fast |\n' +
    '| Eigenvalue $0$ $\\iff$ $\\det(A) = 0$ $\\iff$ not full rank | Links rank and eigenvalues |\n' +
    '| $A^k$ has eigenvalues $\\lambda^k$; $A + cI$ has $\\lambda + c$ | Same eigenvectors, no new working |\n\n' +
    '### Why AI cares\n\n' +
    'Rank tells you how many truly independent features a data set has (redundant columns lower the rank). Eigenvectors of a covariance matrix are the directions of greatest spread used in **PCA** (Principal Component Analysis), and eigenvalues say how much spread lies along each one.',
  formulas: [
    { label: 'Rank bound', tex: '\\operatorname{rank}(A) \\le \\min(m, n)', note: 'For an $m \\times n$ matrix. Rank = number of independent rows = number of independent columns.' },
    { label: 'Full rank test (square matrix)', tex: '\\operatorname{rank}(A) = n \\iff \\det(A) \\ne 0', note: 'If $\\det(A) = 0$ the rank is less than $n$, not necessarily $0$.' },
    { label: 'Eigenvalue equation', tex: 'A\\mathbf{v} = \\lambda\\mathbf{v}, \\quad \\mathbf{v} \\ne \\mathbf{0}' },
    { label: 'Characteristic equation', tex: '\\det(A - \\lambda I) = 0', note: 'Subtract $\\lambda$ from the diagonal entries only.' },
    { label: '2x2 characteristic equation', tex: '\\lambda^2 - (a + d)\\lambda + (ad - bc) = 0', note: 'For $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$: $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$.' },
    { label: 'Trace = sum of eigenvalues', tex: '\\operatorname{tr}(A) = \\lambda_1 + \\lambda_2 + \\dots + \\lambda_n' },
    { label: 'Determinant = product of eigenvalues', tex: '\\det(A) = \\lambda_1 \\lambda_2 \\cdots \\lambda_n' },
    { label: 'Triangular / diagonal matrix', tex: '\\lambda_i = a_{ii}', note: 'The eigenvalues are the diagonal entries.' },
    { label: 'Eigenvector for a 2x2', tex: '(A - \\lambda I)\\mathbf{v} = \\mathbf{0}', note: 'If a non-zero row of $A - \\lambda I$ is $(p, q)$, then $\\mathbf{v} = (q, -p)$ works.' },
    { label: 'Powers and shifts', tex: 'A^k\\mathbf{v} = \\lambda^k\\mathbf{v}, \\quad (A + cI)\\mathbf{v} = (\\lambda + c)\\mathbf{v}', note: 'Same eigenvectors; for an invertible $A$, $A^{-1}$ has eigenvalues $\\frac{1}{\\lambda}$.' },
  ],
  examples: [
    {
      title: 'Rank of a 3x3 matrix',
      problem: 'Find the rank of $A = \\begin{bmatrix} 1 & 2 & 0 \\\\ 2 & 1 & 3 \\\\ 3 & 3 & 3 \\end{bmatrix}$.',
      steps: [
        'Rows 1 and 2, $(1, 2, 0)$ and $(2, 1, 3)$, are not multiples of each other, so the rank is at least $2$.',
        'Look for a combination: $R_1 + R_2 = (1 + 2, 2 + 1, 0 + 3) = (3, 3, 3) = R_3$.',
        'So row 3 adds nothing new. Row reducing ($R_3 \\to R_3 - R_1 - R_2$) would turn it into a zero row.',
        'Two independent rows remain, so the rank is $2$. (Consistent with $\\det(A) = 0$.)',
      ],
      answer: '$\\operatorname{rank}(A) = 2$',
    },
    {
      title: 'Eigenvalues of a 2x2 matrix',
      problem: 'Find the eigenvalues of $A = \\begin{bmatrix} 4 & 1 \\\\ 2 & 3 \\end{bmatrix}$.',
      steps: [
        'Trace $= 4 + 3 = 7$ and $\\det(A) = 4 \\times 3 - 1 \\times 2 = 10$.',
        'Characteristic equation: $\\lambda^2 - 7\\lambda + 10 = 0$.',
        'Factorise: two numbers that multiply to $10$ and add to $7$ are $2$ and $5$, so $(\\lambda - 2)(\\lambda - 5) = 0$.',
        'Check: $2 + 5 = 7$ (trace) and $2 \\times 5 = 10$ (determinant).',
      ],
      answer: '$\\lambda = 2$ and $\\lambda = 5$',
    },
    {
      title: 'An eigenvector',
      problem: 'For the same $A = \\begin{bmatrix} 4 & 1 \\\\ 2 & 3 \\end{bmatrix}$, find an eigenvector for $\\lambda = 5$.',
      steps: [
        '$A - 5I = \\begin{bmatrix} -1 & 1 \\\\ 2 & -2 \\end{bmatrix}$.',
        'Row 1 gives $-x + y = 0$, so $y = x$. (Row 2, $2x - 2y = 0$, says the same.)',
        'Take $x = 1$: $\\mathbf{v} = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}$.',
        'Check: $A\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 5 \\end{bmatrix} = 5\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}$.',
      ],
      answer: '$\\mathbf{v} = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}$ (or any non-zero multiple)',
    },
    {
      title: 'Unknown entry from an eigenvalue (exam level)',
      problem: 'The matrix $A = \\begin{bmatrix} k & 4 \\\\ 1 & 2 \\end{bmatrix}$ has eigenvalue $6$. Find $k$ and the other eigenvalue.',
      steps: [
        '$6$ is an eigenvalue, so $\\det(A - 6I) = 0$: $\\begin{vmatrix} k - 6 & 4 \\\\ 1 & -4 \\end{vmatrix} = -4(k - 6) - 4 = 0$.',
        'Expand: $-4k + 24 - 4 = 0$, so $-4k + 20 = 0$ and $k = 5$.',
        'Trace $= 5 + 2 = 7$ = sum of eigenvalues, so the other eigenvalue is $7 - 6 = 1$.',
        'Check with the determinant: $5 \\times 2 - 4 \\times 1 = 6 = 6 \\times 1$.',
      ],
      answer: '$k = 5$; the other eigenvalue is $1$',
    },
  ],
  traps: [
    'Reading eigenvalues off the diagonal when the matrix is **not** triangular. For $\\begin{bmatrix} 5 & 2 \\\\ 1 & 4 \\end{bmatrix}$ the eigenvalues are $3$ and $6$, not $5$ and $4$.',
    'Sign slips in the characteristic equation: it is $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$ with a **minus** before the trace term, and $\\det = ad - bc$ (minus, not plus).',
    'Subtracting $\\lambda$ from every entry, or from only one diagonal entry. $A - \\lambda I$ changes the **diagonal entries only**, and all of them.',
    'Thinking $\\det(A) = 0$ means rank $0$. It only means the rank is less than full; only the zero matrix has rank $0$.',
    'Mixing up the eigenvectors of different eigenvalues, or giving the zero vector. Always check $A\\mathbf{v} = \\lambda\\mathbf{v}$ for the eigenvalue you were asked about.',
    'Squaring negative eigenvalues carelessly: if $\\lambda = -3$, then $A^2$ has eigenvalue $(-3)^2 = 9$, not $-9$.',
  ],
  examTip:
    'In a 4-option question you rarely need to solve everything from scratch. For **eigenvalue** options, check two things in seconds: do they **add** to the trace and **multiply** to the determinant? Usually only one option passes both. For **eigenvector** options, multiply $A$ by each candidate and see which comes out as a multiple of itself. For **rank**, look first for zero rows, multiples and simple sums of rows; if your calculator has a matrix mode, its determinant tells you instantly whether a square matrix has full rank (non-zero means full rank). When a question has an unknown $k$, plug each option back in: it is often faster than the algebra. Be suspicious of options that are just the diagonal entries, the trace and determinant themselves, or the right numbers with the wrong signs: those are the classic traps.',
};
