import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'matrix-operations',
  know:
    '### What is a matrix?\n\n' +
    'A **matrix** is a rectangle of numbers arranged in rows and columns. In AI, matrices are everywhere: a dataset is a matrix (one row per example, one column per feature), and a layer of a neural network is a matrix of weights.\n\n' +
    'The **order** (or dimensions) of a matrix is written **rows $\\times$ columns**, always rows first. $\\begin{bmatrix} 5 & -2 & 1 \\\\ 0 & 7 & 4 \\end{bmatrix}$ has 2 rows and 3 columns, so it is $2 \\times 3$ ("2 by 3").\n\n' +
    'The entry in row $i$ and column $j$ is called $a_{ij}$. In the matrix above, $a_{23} = 4$ (row 2, column 3). Maths counts from 1; Python lists count from 0, so `A[1][2]` is the same entry.\n\n' +
    '### Adding and scalar multiplying\n\n' +
    'These are the easy operations, done **entry by entry**:\n\n' +
    '- **Addition / subtraction:** only for matrices of the **same order**. Add (or subtract) matching entries.\n' +
    '- **Scalar multiplication:** $kA$ multiplies **every** entry of $A$ by the number $k$.\n\n' +
    'Two matrices are **equal** only if they have the same order and every matching entry is equal. So a matrix equation like $2X + B = C$ is really one ordinary equation per entry.\n\n' +
    '### Matrix multiplication\n\n' +
    'This is the important one, and it is **not** entry by entry. Each entry of $AB$ is a **row of $A$ times a column of $B$**: multiply matching entries and add up.\n\n' +
    '$$\\begin{bmatrix} 1 & 3 \\\\ 2 & -1 \\end{bmatrix}\\begin{bmatrix} 2 & 0 \\\\ -1 & 4 \\end{bmatrix} = \\begin{bmatrix} 1 \\times 2 + 3 \\times (-1) & 1 \\times 0 + 3 \\times 4 \\\\ 2 \\times 2 + (-1) \\times (-1) & 2 \\times 0 + (-1) \\times 4 \\end{bmatrix} = \\begin{bmatrix} -1 & 12 \\\\ 5 & -4 \\end{bmatrix}$$\n\n' +
    'To find just one entry, say row 2, column 1, you only need row 2 of $A$ and column 1 of $B$. Exam questions often ask for a single entry to save time.\n\n' +
    '### When is a product defined, and what size is it?\n\n' +
    'A row of $A$ must have as many entries as a column of $B$. Write the orders side by side:\n\n' +
    '$$(m \\times \\underline{n})(\\underline{n} \\times p) \\rightarrow m \\times p$$\n\n' +
    '- The **inner** numbers must match, otherwise the product is **not defined**.\n' +
    '- The **outer** numbers give the order of the answer.\n\n' +
    '| $A$ | $B$ | $AB$ | $BA$ |\n' +
    '|---|---|---|---|\n' +
    '| $2 \\times 3$ | $3 \\times 4$ | $2 \\times 4$ | not defined |\n' +
    '| $2 \\times 3$ | $3 \\times 2$ | $2 \\times 2$ | $3 \\times 3$ |\n' +
    '| $2 \\times 2$ | $2 \\times 2$ | $2 \\times 2$ | $2 \\times 2$ (usually different) |\n\n' +
    '### Order matters: $AB \\ne BA$\n\n' +
    'With ordinary numbers $3 \\times 5 = 5 \\times 3$. With matrices, $AB$ and $BA$ are usually **different**: one might not exist, they might be different sizes, and even for square matrices the entries usually differ. This is called being **non-commutative**. One big consequence:\n\n' +
    '$$(A + B)^{2} = A^{2} + AB + BA + B^{2}$$\n\n' +
    'which is **not** $A^{2} + 2AB + B^{2}$. Also, $A^{2}$ means $AA$ (a matrix product), never "square each entry".\n\n' +
    '### The transpose\n\n' +
    'The **transpose** $A^{T}$ turns rows into columns: row 1 of $A$ becomes column 1 of $A^{T}$, and so on. An $m \\times n$ matrix becomes $n \\times m$, and $(A^{T})_{ij} = a_{ji}$. Useful rules:\n\n' +
    '- $(A^{T})^{T} = A$ and $(A + B)^{T} = A^{T} + B^{T}$\n' +
    '- $(kA)^{T} = kA^{T}$\n' +
    '- $(AB)^{T} = B^{T}A^{T}$: the order **reverses** (like taking off socks and shoes in the opposite order you put them on).\n\n' +
    '### Special square matrices\n\n' +
    '- **Identity** $I$: 1s on the main diagonal (top-left to bottom-right), 0s elsewhere. It acts like the number 1: $AI = IA = A$. So $A - 2I$ only changes the diagonal entries of $A$.\n' +
    '- **Diagonal** matrix: every entry off the main diagonal is 0. Diagonal matrices are easy to work with: $DA$ multiplies the **rows** of $A$ by the diagonal entries, $AD$ multiplies the **columns**, and $D^{n}$ just raises each diagonal entry to the power $n$.\n' +
    '- **Symmetric** matrix: $A^{T} = A$, so $a_{ij} = a_{ji}$; the matrix is a mirror image of itself across the main diagonal. It must be square. For any matrix $A$, both $AA^{T}$ and $A^{T}A$ are symmetric. Every diagonal matrix (including $I$) is symmetric.',
  formulas: [
    { label: 'Order of a matrix', tex: '\\text{order} = \\text{rows} \\times \\text{columns}', note: '$a_{ij}$ is the entry in row $i$, column $j$ (counting from 1).' },
    { label: 'Addition and scalar multiplication', tex: '(A + B)_{ij} = a_{ij} + b_{ij}, \\qquad (kA)_{ij} = k\\,a_{ij}', note: 'Addition needs both matrices to have the same order.' },
    { label: 'Matrix product (one entry)', tex: '(AB)_{ij} = \\sum_{k=1}^{n} a_{ik}\\,b_{kj}', note: 'Row $i$ of $A$ times column $j$ of $B$: multiply the matching entries and add the products.' },
    { label: 'When a product is defined', tex: '(m \\times n)(n \\times p) = m \\times p', note: 'Inner numbers must match; outer numbers give the order.' },
    { label: 'Non-commutativity', tex: 'AB \\ne BA \\text{ in general}, \\qquad (A + B)^{2} = A^{2} + AB + BA + B^{2}' },
    { label: 'Transpose rules', tex: '(A^{T})^{T} = A, \\quad (A + B)^{T} = A^{T} + B^{T}, \\quad (kA)^{T} = kA^{T}' },
    { label: 'Transpose of a product', tex: '(AB)^{T} = B^{T}A^{T}', note: 'The order reverses.' },
    { label: 'Identity matrix', tex: 'I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\qquad AI = IA = A' },
    { label: 'Symmetric matrix', tex: 'A^{T} = A \\iff a_{ij} = a_{ji}', note: '$AA^{T}$ and $A^{T}A$ are always symmetric.' },
    { label: 'Powers of a diagonal matrix', tex: '\\begin{bmatrix} a & 0 \\\\ 0 & b \\end{bmatrix}^{n} = \\begin{bmatrix} a^{n} & 0 \\\\ 0 & b^{n} \\end{bmatrix}', note: 'Only works because the matrix is diagonal.' },
  ],
  examples: [
    {
      title: 'Scalar multiples and subtraction',
      problem: 'Let $A = \\begin{bmatrix} 4 & -3 \\\\ 1 & 2 \\end{bmatrix}$ and $B = \\begin{bmatrix} 2 & 1 \\\\ -3 & 5 \\end{bmatrix}$. Find $3A - 2B$.',
      steps: [
        'Multiply every entry of $A$ by 3: $3A = \\begin{bmatrix} 12 & -9 \\\\ 3 & 6 \\end{bmatrix}$.',
        'Multiply every entry of $B$ by 2: $2B = \\begin{bmatrix} 4 & 2 \\\\ -6 & 10 \\end{bmatrix}$.',
        'Subtract entry by entry: $\\begin{bmatrix} 12 - 4 & -9 - 2 \\\\ 3 - (-6) & 6 - 10 \\end{bmatrix}$.',
        'Simplify, taking care that $3 - (-6) = 3 + 6 = 9$: $\\begin{bmatrix} 8 & -11 \\\\ 9 & -4 \\end{bmatrix}$.',
      ],
      answer: '$3A - 2B = \\begin{bmatrix} 8 & -11 \\\\ 9 & -4 \\end{bmatrix}$',
    },
    {
      title: 'Is the product defined, and what size is it?',
      problem: '$A$ is $2 \\times 3$, $B$ is $3 \\times 4$ and $C$ is $4 \\times 2$. Find the order of $ABC$, and decide whether $BA$ is defined.',
      steps: [
        '$AB$: $(2 \\times 3)(3 \\times 4)$. Inner numbers 3 and 3 match, so $AB$ is $2 \\times 4$.',
        '$(AB)C$: $(2 \\times 4)(4 \\times 2)$. Inner numbers 4 and 4 match, so $ABC$ is $2 \\times 2$.',
        '$BA$: $(3 \\times 4)(2 \\times 3)$. Inner numbers 4 and 2 do not match, so $BA$ is not defined.',
      ],
      answer: '$ABC$ is $2 \\times 2$; $BA$ is not defined.',
    },
    {
      title: 'One entry of a product',
      problem: 'Let $A = \\begin{bmatrix} 2 & -1 & 3 \\\\ 1 & 4 & -2 \\end{bmatrix}$ and $B = \\begin{bmatrix} 1 & 0 \\\\ -3 & 2 \\\\ 2 & 5 \\end{bmatrix}$. Find the entry in row 2, column 1 of $AB$.',
      steps: [
        '$A$ is $2 \\times 3$ and $B$ is $3 \\times 2$, so $AB$ is defined and is $2 \\times 2$.',
        'Take row 2 of $A$: $1, 4, -2$. Take column 1 of $B$: $1, -3, 2$.',
        'Multiply matching entries: $1 \\times 1 = 1$, $4 \\times (-3) = -12$, $(-2) \\times 2 = -4$.',
        'Add: $1 - 12 - 4 = -15$.',
      ],
      answer: '$(AB)_{21} = -15$',
    },
    {
      title: 'Transpose of a product (exam level)',
      problem: 'Let $A = \\begin{bmatrix} 2 & 1 \\\\ 0 & -1 \\end{bmatrix}$ and $B = \\begin{bmatrix} 1 & 3 \\\\ 2 & -2 \\end{bmatrix}$. Find $(AB)^{T}$.',
      steps: [
        'Row 1 of $A$ with the columns of $B$: $2 \\times 1 + 1 \\times 2 = 4$ and $2 \\times 3 + 1 \\times (-2) = 4$.',
        'Row 2 of $A$ with the columns of $B$: $0 \\times 1 + (-1) \\times 2 = -2$ and $0 \\times 3 + (-1) \\times (-2) = 2$.',
        'So $AB = \\begin{bmatrix} 4 & 4 \\\\ -2 & 2 \\end{bmatrix}$.',
        'Transpose (row 1 becomes column 1, row 2 becomes column 2): $(AB)^{T} = \\begin{bmatrix} 4 & -2 \\\\ 4 & 2 \\end{bmatrix}$.',
        'Check with the rule $(AB)^{T} = B^{T}A^{T}$: $\\begin{bmatrix} 1 & 2 \\\\ 3 & -2 \\end{bmatrix}\\begin{bmatrix} 2 & 0 \\\\ 1 & -1 \\end{bmatrix} = \\begin{bmatrix} 4 & -2 \\\\ 4 & 2 \\end{bmatrix}$, the same. The wrong order $A^{T}B^{T}$ gives $\\begin{bmatrix} 2 & 4 \\\\ -2 & 4 \\end{bmatrix}$, a different matrix.',
      ],
      answer: '$(AB)^{T} = \\begin{bmatrix} 4 & -2 \\\\ 4 & 2 \\end{bmatrix}$',
    },
    {
      title: 'Making a matrix symmetric',
      problem: 'Find $k$ so that $M = \\begin{bmatrix} 1 & 2k & 0 \\\\ 6 & 4 & k - 1 \\\\ 0 & 2 & 5 \\end{bmatrix}$ is symmetric.',
      steps: [
        'Symmetric means $m_{ij} = m_{ji}$ for every mirror pair across the main diagonal. A $3 \\times 3$ matrix has three such pairs.',
        '$m_{12} = m_{21}$: $2k = 6$, so $k = 3$.',
        '$m_{23} = m_{32}$: $k - 1 = 2$, so $k = 3$.',
        '$m_{13} = m_{31}$: $0 = 0$, already fine.',
        'Both conditions give the same value, so $k = 3$ works: $M = \\begin{bmatrix} 1 & 6 & 0 \\\\ 6 & 4 & 2 \\\\ 0 & 2 & 5 \\end{bmatrix}$, which equals its transpose.',
      ],
      answer: '$k = 3$',
    },
  ],
  traps: [
    'Writing the order as columns $\\times$ rows. It is always **rows first**: a matrix with 3 rows and 2 columns is $3 \\times 2$.',
    'Multiplying matrices entry by entry (or squaring each entry for $A^{2}$). Matrix multiplication is always **row times column**.',
    'Assuming $AB = BA$. The order matters, so $(A + B)^{2} \\ne A^{2} + 2AB + B^{2}$ and $AB$ and $BA$ can even have different sizes.',
    'Forgetting to reverse the order when transposing a product: $(AB)^{T} = B^{T}A^{T}$, not $A^{T}B^{T}$.',
    'Treating $I$ as a matrix full of 1s. $A - 2I$ only subtracts 2 from the **diagonal** entries.',
    'Using the inner numbers for the size of a product. In $(2 \\times 3)(3 \\times 4)$ the 3s only have to match; the answer is $2 \\times 4$.',
  ],
  examTip:
    'In the exam these questions are quick if you avoid doing unnecessary work.\n\n' +
    '- **Size first.** Before multiplying anything, check the orders. Any option with the wrong size can be crossed out, and "not defined" options are settled by the inner-numbers rule in seconds.\n' +
    '- **Compute one entry, not the whole matrix.** If the options are full matrices, work out just the top-left entry of the answer; this often leaves only one option. If two options remain, compute one more entry where they differ.\n' +
    '- **Know the classic distractors.** Wrong options are usually: the entry-by-entry product, $BA$ instead of $AB$, the answer without the transpose, $A^{T}B^{T}$ instead of $B^{T}A^{T}$, or the "$2AB$" expansion.\n' +
    '- **Plug the options in.** For "find $x$, $y$" questions, substitute each option into the matrix equation and check entry by entry; usually one entry rules out each wrong option.\n' +
    '- **Signs.** Most arithmetic slips come from negative entries, so bracket them: $(-1) \\times (-2) = +2$.',
};
