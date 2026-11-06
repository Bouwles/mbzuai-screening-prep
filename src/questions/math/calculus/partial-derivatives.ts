import type { StaticQuestion } from '../../../types';
import { round } from '../../../lib/mathx';

// ---- helpers used only by the answer checks (re-derive answers in code) ----
// A polynomial in x and y as a list of terms [coefficient, power of x, power of y].
type Poly = [number, number, number][];
const ev = (p: Poly, x: number, y: number): number => p.reduce((s, [c, a, b]) => s + c * x ** a * y ** b, 0);
const dx = (p: Poly): Poly => p.filter(([, a]) => a > 0).map(([c, a, b]) => [c * a, a - 1, b] as [number, number, number]);
const dy = (p: Poly): Poly => p.filter(([, , b]) => b > 0).map(([c, a, b]) => [c * b, a, b - 1] as [number, number, number]);
// Numeric (central difference) derivatives for squared-error losses.
type F2 = (x: number, y: number) => number;
const H = 1e-4;
const nx = (f: F2, x: number, y: number): number => (f(x + H, y) - f(x - H, y)) / (2 * H);
const ny = (f: F2, x: number, y: number): number => (f(x, y + H) - f(x, y - H)) / (2 * H);
const n1 = (f: (w: number) => number, w: number): number => (f(w + H) - f(w - H)) / (2 * H);
/** A 2D vector as a comparable string, e.g. "8,-1". */
const vec = (a: number, b: number): string => `${round(a, 6)},${round(b, 6)}`;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'partial-derivatives-002',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'Let $f(x, y) = 3x^2 + 5xy - 2y^3$. Which of the following is the partial derivative $\\frac{\\partial f}{\\partial x}$?',
    options: ['$6x + 5y - 6y^2$', '$6x + 5y$', '$5x - 6y^2$', '$6x$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'To find $\\frac{\\partial f}{\\partial x}$, differentiate with respect to $x$ and treat $y$ as if it were a fixed number (a constant).\n\n' +
        '- $3x^2$ differentiates to $6x$.\n' +
        '- $5xy = (5y) \\times x$: with $y$ fixed this is a constant times $x$, so it differentiates to $5y$.\n' +
        '- $-2y^3$ contains no $x$ at all, so it is a constant and differentiates to $0$.\n\n' +
        'So $\\frac{\\partial f}{\\partial x} = 6x + 5y$.',
      whyWrong: [
        'This also differentiates $-2y^3$ as if it depended on $x$. When differentiating with respect to $x$, a term with no $x$ in it is a constant, so its derivative is $0$.',
        null,
        'This is $\\frac{\\partial f}{\\partial y}$ (differentiating with respect to $y$ and holding $x$ fixed), not $\\frac{\\partial f}{\\partial x}$.',
        'This treats $5xy$ as a constant and throws it away. It does contain $x$: with $y$ fixed it behaves like $5y \\times x$, whose derivative is $5y$.',
      ],
      keyIdea: 'For $\\frac{\\partial f}{\\partial x}$, treat $y$ as a constant: terms with no $x$ vanish, and $y$ factors in other terms stay as multipliers.',
    },
    check: {
      // evaluate each option at the test point (2, 3) and compare with the true partial derivative there
      optionValues: [12 + 15 - 54, 12 + 15, 10 - 54, 12],
      compute: () => ev(dx([[3, 2, 0], [5, 1, 1], [-2, 0, 3]]), 2, 3),
    },
  },
  {
    id: 'partial-derivatives-003',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'Let $f(x, y) = x^3y^2$. Which of the following is $\\frac{\\partial f}{\\partial y}$?',
    options: ['$3x^2y^2$', '$6x^2y$', '$2y$', '$2x^3y$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Differentiate with respect to $y$, treating $x$ (and so $x^3$) as a constant multiplier.\n\n' +
        '$$f(x, y) = x^3 \\times y^2$$\n\n' +
        'The derivative of $y^2$ with respect to $y$ is $2y$, and the constant multiplier $x^3$ stays where it is:\n\n' +
        '$$\\frac{\\partial f}{\\partial y} = x^3 \\times 2y = 2x^3y$$',
      whyWrong: [
        'This is $\\frac{\\partial f}{\\partial x}$: it differentiates $x^3$ and keeps $y^2$ fixed, the wrong way round.',
        'This differentiates **both** factors ($3x^2 \\times 2y$). A partial derivative changes only one variable; $x^3$ is a constant here.',
        'This throws away $x^3$ as if it were an added constant. It is a **multiplied** constant, so it stays in the answer (like the 5 in the derivative of $5y^2$).',
        null,
      ],
      keyIdea: 'A constant that multiplies the variable stays in the derivative; only an added constant disappears.',
    },
    check: {
      // values of the options at the test point (2, 3)
      optionValues: [3 * 4 * 9, 6 * 4 * 3, 6, 2 * 8 * 3],
      compute: () => ev(dy([[1, 3, 2]]), 2, 3),
    },
  },
  {
    id: 'partial-derivatives-004',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'The **gradient** $\\nabla f$ of a function of two variables is the vector of its partial derivatives. For $f(x, y) = x^2 + 4y$, what is $\\nabla f$?',
    options: ['$\\left(2x, 4\\right)$', '$2x + 4$', '$\\left(4, 2x\\right)$', '$\\left(2x, 4y\\right)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The gradient is $\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$, always with the $x$-derivative first.\n\n' +
        '- $\\frac{\\partial f}{\\partial x}$: $x^2$ gives $2x$, and $4y$ is a constant, giving $0$. So $\\frac{\\partial f}{\\partial x} = 2x$.\n' +
        '- $\\frac{\\partial f}{\\partial y}$: $x^2$ is a constant, giving $0$, and $4y$ gives $4$. So $\\frac{\\partial f}{\\partial y} = 4$.\n\n' +
        'Therefore $\\nabla f = \\left(2x, 4\\right)$.',
      whyWrong: [
        null,
        'This adds the two partial derivatives into a single expression. The gradient is a **vector**: its components must be kept separate.',
        'The right components in the wrong order. The first component of $\\nabla f$ is always $\\frac{\\partial f}{\\partial x}$.',
        'The derivative of $4y$ with respect to $y$ is $4$, not $4y$; the $y$ was not differentiated.',
      ],
      keyIdea: 'The gradient lists the partial derivatives in order: $\\nabla f = \\left(f_x, f_y\\right)$.',
    },
    check: {
      // each option evaluated at the test point (3, 2), as a vector string
      optionValues: ['6,4', '10', '4,6', '6,8'],
      compute: () => {
        const P: Poly = [[1, 2, 0], [4, 0, 1]];
        return vec(ev(dx(P), 3, 2), ev(dy(P), 3, 2));
      },
    },
  },
  {
    id: 'partial-derivatives-020',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'When you find $\\frac{\\partial f}{\\partial x}$ for a function $f(x, y)$, how do you treat $y$?',
    options: ['As a constant', 'As zero', 'As equal to $x$', 'As another variable to differentiate'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A partial derivative changes one variable at a time. For $\\frac{\\partial f}{\\partial x}$, only $x$ changes, so $y$ is held fixed and treated like an ordinary number: a constant.',
      whyWrong: [
        null,
        'A constant is not the same as zero. For example, $\\frac{\\partial}{\\partial x}(5xy) = 5y$, not $0$.',
        'The two variables are independent, so $y$ does not change when $x$ changes.',
        'Only $x$ is differentiated here. Differentiating $y$ as well would not be a partial derivative with respect to $x$.',
      ],
      keyIdea: 'In a partial derivative, every other variable is held constant.',
    },
  },
  {
    id: 'partial-derivatives-021',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'Let $f(x, y) = 7y^2$. What is $\\frac{\\partial f}{\\partial x}$?',
    options: ['$0$', '$14y$', '$7y^2$', '$14$'],
    correctIndex: 0,
    markScheme: {
      solution: 'The function has no $x$ in it. With $y$ held constant, $7y^2$ is just a constant, so its derivative with respect to $x$ is $0$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial y}$. The question asks for the derivative with respect to $x$.',
        'This leaves the term unchanged. A constant differentiates to $0$; it does not stay as it is.',
        'This differentiates with respect to $y$ and also drops the $y$. A term with no $x$ gives $0$.',
      ],
      keyIdea: 'A term with no $x$ in it vanishes when you differentiate with respect to $x$.',
    },
    check: {
      // values of the options at the test point (2, 3)
      optionValues: [0, 42, 63, 14],
      compute: () => ev(dx([[7, 0, 2]]), 2, 3),
    },
  },
  {
    id: 'partial-derivatives-022',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'Let $f(x, y) = 3x + 2y$. What is $\\frac{\\partial f}{\\partial y}$?',
    options: ['$2$', '$3$', '$2y$', '$3x + 2$'],
    correctIndex: 0,
    markScheme: {
      solution: 'Hold $x$ constant. The term $3x$ is then a constant and gives $0$, and $2y$ gives $2$. So $\\frac{\\partial f}{\\partial y} = 2$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial x}$. The question asks for the derivative with respect to $y$.',
        'This keeps the $y$. The derivative of $2y$ with respect to $y$ is $2$.',
        'This keeps the term $3x$. With $x$ held constant, an added constant differentiates to $0$.',
      ],
      keyIdea: 'Added terms without the variable vanish; the variable\'s own term follows the usual rules.',
    },
    check: {
      // values of the options at the test point (2, 3)
      optionValues: [2, 3, 6, 8],
      compute: () => ev(dy([[3, 1, 0], [2, 0, 1]]), 2, 3),
    },
  },
  {
    id: 'partial-derivatives-023',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'Let $f(x, y) = xy$. What is $\\frac{\\partial f}{\\partial x}$?',
    options: ['$y$', '$x$', '$1$', '$xy$'],
    correctIndex: 0,
    markScheme: {
      solution: 'Hold $y$ constant, so $xy$ behaves like a number times $x$. Just as $\\frac{d}{dx}(5x) = 5$, we get $\\frac{\\partial}{\\partial x}(xy) = y$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial y}$, where $x$ is held constant instead.',
        'This differentiates the $x$ but loses the multiplier $y$. A multiplied constant stays in the answer.',
        'This leaves the term unchanged. The $x$ must be differentiated.',
      ],
      keyIdea: 'A factor of the other variable stays as a multiplier.',
    },
    check: {
      // values of the options at the test point (2, 3)
      optionValues: [3, 2, 1, 6],
      compute: () => ev(dx([[1, 1, 1]]), 2, 3),
    },
  },
  {
    id: 'partial-derivatives-024',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'What is the **gradient** $\\nabla f$ of a function $f(x, y)$?',
    options: [
      'The vector $\\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$',
      'The vector $\\left(\\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial x}\\right)$',
      'The sum $\\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y}$',
      'The value of $f$ at the point $(x, y)$',
    ],
    correctIndex: 0,
    markScheme: {
      solution: 'The gradient collects the partial derivatives into a vector, with the $x$-derivative first: $\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$.',
      whyWrong: [
        null,
        'The components are in the wrong order. The first component is always the $x$-derivative.',
        'The gradient keeps its two components separate as a vector. It is not their sum.',
        'That is the function itself. The gradient is made from its derivatives.',
      ],
      keyIdea: '$\\nabla f = \\left(f_x, f_y\\right)$, with the $x$-derivative first.',
    },
  },
  {
    id: 'partial-derivatives-025',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'Find the derivative of the squared error $(w - 3)^2$ with respect to $w$.',
    options: ['$2(w - 3)$', '$w - 3$', '$2w$', '$2(w - 3)^2$'],
    correctIndex: 0,
    markScheme: {
      solution: 'Use the chain rule: bring down the power $2$, keep the bracket, reduce the power by $1$, and multiply by the derivative of the inside, which is $1$. This gives $2(w - 3)$.',
      whyWrong: [
        null,
        'This forgets the factor $2$ that the power rule brings down.',
        'This differentiates $w^2$ only and ignores the $-3$ in the bracket.',
        'This brings the $2$ down but forgets to reduce the power from $2$ to $1$.',
      ],
      keyIdea: 'The derivative of a squared error is $2 \\times$ (error) $\\times$ (derivative of the inside).',
    },
    check: {
      // the options at w = 5
      optionValues: [4, 2, 10, 8],
      compute: () => n1((w) => (w - 3) ** 2, 5),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'partial-derivatives-006',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = x^2y^3 + 4x - y$. Find the value of $\\frac{\\partial f}{\\partial x}$ at the point $(1, 2)$.',
    options: ['$20$', '$16$', '$11$', '$8$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: differentiate with respect to $x$** (treat $y$ as a constant).\n\n' +
        '- $x^2y^3 = y^3 \\times x^2$ gives $2xy^3$.\n' +
        '- $4x$ gives $4$.\n' +
        '- $-y$ has no $x$, so it gives $0$.\n\n' +
        '$$\\frac{\\partial f}{\\partial x} = 2xy^3 + 4$$\n\n' +
        '**Step 2: substitute** $x = 1$, $y = 2$:\n\n' +
        '$$2 \\times 1 \\times 2^3 + 4 = 16 + 4 = 20$$',
      whyWrong: [
        null,
        'This forgets the $+4$ that comes from differentiating $4x$; only the $2xy^3$ part was evaluated.',
        'This is $\\frac{\\partial f}{\\partial y} = 3x^2y^2 - 1$ evaluated at the point: $12 - 1 = 11$. The question asks for the $x$-derivative.',
        'This substitutes the coordinates the wrong way round ($x = 2$, $y = 1$): $2 \\times 2 \\times 1 + 4 = 8$.',
      ],
      keyIdea: 'Differentiate first (holding the other variable constant), then substitute the point.',
    },
    check: {
      optionValues: [20, 16, 11, 8],
      compute: () => ev(dx([[1, 2, 3], [4, 1, 0], [-1, 0, 1]]), 1, 2),
    },
  },
  {
    id: 'partial-derivatives-008',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = x^2 + 3xy - y^2$. What is the gradient $\\nabla f$ at the point $(1, 2)$?',
    options: ['$\\left(-1, 8\\right)$', '$\\left(8, -1\\right)$', '$\\left(2, -4\\right)$', '$\\left(8, 7\\right)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: the partial derivatives.**\n\n' +
        '- $\\frac{\\partial f}{\\partial x} = 2x + 3y$ (the $-y^2$ term is constant in $x$).\n' +
        '- $\\frac{\\partial f}{\\partial y} = 3x - 2y$ (the $x^2$ term is constant in $y$).\n\n' +
        '**Step 2: substitute** $x = 1$, $y = 2$:\n\n' +
        '- $\\frac{\\partial f}{\\partial x} = 2 + 6 = 8$\n' +
        '- $\\frac{\\partial f}{\\partial y} = 3 - 4 = -1$\n\n' +
        'So $\\nabla f(1, 2) = \\left(8, -1\\right)$.',
      whyWrong: [
        'The right numbers in the wrong order. The first component of the gradient is $\\frac{\\partial f}{\\partial x}$.',
        null,
        'This ignores the cross term $3xy$ in both derivatives (giving only $2x = 2$ and $-2y = -4$). With the other variable held constant, $3xy$ still contributes $3y$ and $3x$.',
        'This is a sign slip on $-y^2$: its $y$-derivative is $-2y = -4$, so $\\frac{\\partial f}{\\partial y} = 3 - 4$, not $3 + 4$.',
      ],
      keyIdea: 'Find both partial derivatives, then substitute the point into each; keep the order $\\left(f_x, f_y\\right)$.',
    },
    check: {
      optionValues: ['-1,8', '8,-1', '2,-4', '8,7'],
      compute: () => {
        const P: Poly = [[1, 2, 0], [3, 1, 1], [-1, 0, 2]];
        return vec(ev(dx(P), 1, 2), ev(dy(P), 1, 2));
      },
    },
  },
  {
    id: 'partial-derivatives-009',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'For the squared-error loss $L(w) = (w - 5)^2$, find $\\frac{dL}{dw}$ at $w = 1$.',
    options: ['$-8$', '$8$', '$-4$', '$16$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: the derivative** (chain rule): $\\frac{dL}{dw} = 2(w - 5)$.\n\n' +
        '**Step 2: substitute** $w = 1$: $2(1 - 5) = 2 \\times (-4) = -8$.\n\n' +
        'The negative sign makes sense: the loss is smallest at $w = 5$, so at $w = 1$ increasing $w$ lowers the loss.',
      whyWrong: [
        null,
        'This has the sign wrong, as if the bracket were $5 - w$ with no chain-rule factor of $-1$. The derivative of $(w - 5)^2$ is $2(w - 5)$.',
        'This forgets the factor $2$ from the power rule, using $w - 5 = -4$.',
        'This is the value of the loss at $w = 1$, $(1 - 5)^2 = 16$, not its derivative.',
      ],
      keyIdea: 'Differentiate a squared error with the chain rule, then substitute the current weight.',
    },
    check: {
      optionValues: [-8, 8, -4, 16],
      compute: () => n1((w) => (w - 5) ** 2, 1),
    },
  },
  {
    id: 'partial-derivatives-010',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'A squared-error loss is $L(w_1, w_2) = (w_1 - 3)^2 + (w_2 + 1)^2$. What is the gradient $\\nabla L$ at $(w_1, w_2) = (1, 1)$?',
    options: ['$\\left(-4, 4\\right)$', '$\\left(4, -4\\right)$', '$\\left(-2, 2\\right)$', '$\\left(4, 4\\right)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: partial derivatives.** Each bracket contains only one of the weights, so the other bracket is a constant.\n\n' +
        '- $\\frac{\\partial L}{\\partial w_1} = 2(w_1 - 3)$\n' +
        '- $\\frac{\\partial L}{\\partial w_2} = 2(w_2 + 1)$\n\n' +
        '**Step 2: substitute** $(1, 1)$:\n\n' +
        '- $2(1 - 3) = -4$\n' +
        '- $2(1 + 1) = 4$\n\n' +
        'So $\\nabla L = \\left(-4, 4\\right)$.',
      whyWrong: [
        null,
        'Every sign is flipped, as if each bracket were written the other way round. Keep the brackets exactly as given.',
        'This forgets the factor $2$ from the power rule, using only the values of the brackets.',
        'This squares each bracket, which gives the two parts of the loss. The gradient needs their derivatives.',
      ],
      keyIdea: 'Differentiate a sum of squared errors one weight at a time, then keep the components in order.',
    },
    check: {
      optionValues: ['-4,4', '4,-4', '-2,2', '4,4'],
      compute: () => {
        const L: F2 = (a, b) => (a - 3) ** 2 + (b + 1) ** 2;
        return vec(nx(L, 1, 1), ny(L, 1, 1));
      },
    },
  },
  {
    id: 'partial-derivatives-014',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'For the squared-error loss $L = (wx + b - y)^2$ with $x = 2$, $y = 7$, $w = 1$ and $b = 1$, find $\\frac{\\partial L}{\\partial w}$.',
    options: ['$-8$', '$16$', '$-16$', '$-32$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: chain rule.** Let $e = wx + b - y$ (the error), so $L = e^2$. Holding $x$, $b$ and $y$ constant, $\\frac{\\partial e}{\\partial w} = x$. Therefore\n\n' +
        '$$\\frac{\\partial L}{\\partial w} = 2e \\times \\frac{\\partial e}{\\partial w} = 2(wx + b - y)x$$\n\n' +
        '**Step 2: the error.** $wx + b = 1 \\times 2 + 1 = 3$, so $e = 3 - 7 = -4$.\n\n' +
        '**Step 3: substitute.** $\\frac{\\partial L}{\\partial w} = 2 \\times (-4) \\times 2 = -16$.\n\n' +
        'The negative sign makes sense: increasing $w$ would raise the prediction towards 7 and lower the loss.',
      whyWrong: [
        'This forgets the inner derivative $x = 2$ from the chain rule: $2 \\times (-4) = -8$. (That value is actually $\\frac{\\partial L}{\\partial b}$, since $\\frac{\\partial e}{\\partial b} = 1$.)',
        'This is a sign error: it uses $y - wx - b = 4$ as the error but forgets that differentiating it with respect to $w$ gives $-x$, which puts the minus sign back.',
        null,
        'This multiplies by $x^2 = 4$ instead of $x$: the inner derivative of $wx + b - y$ with respect to $w$ is just $x$.',
      ],
      keyIdea: 'For $L = (wx + b - y)^2$, the chain rule gives $\\frac{\\partial L}{\\partial w} = 2(\\text{error}) \\times x$ and $\\frac{\\partial L}{\\partial b} = 2(\\text{error})$.',
    },
    check: {
      optionValues: [-8, 16, -16, -32],
      compute: () => {
        const [x, y, b] = [2, 7, 1];
        return n1((w) => (w * x + b - y) ** 2, 1);
      },
    },
  },
  {
    id: 'partial-derivatives-018',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = ax^2 + bxy$, where $a$ and $b$ are constants. At the point $(1, 2)$ it is known that $\\frac{\\partial f}{\\partial x} = 10$ and $\\frac{\\partial f}{\\partial y} = 3$. Find $a$ and $b$.',
    options: ['$a = 3.5,\\ b = 3$', '$a = 4,\\ b = 3$', '$a = 2,\\ b = 3$', '$a = 3.5,\\ b = 1.5$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: partial derivatives** ($a$ and $b$ are just constants).\n\n' +
        '- $\\frac{\\partial f}{\\partial x} = 2ax + by$\n' +
        '- $\\frac{\\partial f}{\\partial y} = bx$\n\n' +
        '**Step 2: use the information at** $(1, 2)$.\n\n' +
        '- $\\frac{\\partial f}{\\partial y} = b \\times 1 = 3$, so $b = 3$.\n' +
        '- $\\frac{\\partial f}{\\partial x} = 2a \\times 1 + 3 \\times 2 = 2a + 6 = 10$, so $2a = 4$ and $a = 2$.\n\n' +
        '**Check:** $f = 2x^2 + 3xy$ gives $f_x = 4x + 3y = 4 + 6 = 10$ and $f_y = 3x = 3$ at $(1, 2)$. So $a = 2$, $b = 3$.',
      whyWrong: [
        'This forgets to multiply $b$ by $y = 2$ in $\\frac{\\partial f}{\\partial x}$, solving $2a + 3 = 10$. The $x$-derivative of $bxy$ is $by$.',
        'This forgets the factor 2 when differentiating $ax^2$, solving $a + 2b = 10$ with $b = 3$, so $a = 4$.',
        null,
        'This takes $\\frac{\\partial f}{\\partial y}$ to be $by$ instead of $bx$, so $2b = 3$ gives $b = 1.5$ (and then $a = 3.5$). Differentiating $bxy$ with respect to $y$ leaves $bx$.',
      ],
      keyIdea: 'Write both partial derivatives in terms of the unknown constants, substitute the point, and solve the resulting equations.',
    },
    check: {
      optionValues: ['3.5,3', '4,3', '2,3', '3.5,1.5'],
      compute: () => {
        // brute-force search over a, b in steps of 0.5
        const hits: string[] = [];
        for (let i = -40; i <= 40; i++)
          for (let j = -40; j <= 40; j++) {
            const P: Poly = [[i / 2, 2, 0], [j / 2, 1, 1]];
            if (ev(dx(P), 1, 2) === 10 && ev(dy(P), 1, 2) === 3) hits.push(vec(i / 2, j / 2));
          }
        return hits.join(';');
      },
    },
  },
  {
    id: 'partial-derivatives-026',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = 2x^2y + 3y^2$. Find the value of $\\frac{\\partial f}{\\partial y}$ at the point $(1, 3)$.',
    options: ['$20$', '$12$', '$18$', '$24$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: differentiate with respect to $y$** (treat $x$ as a constant).\n\n' +
        '- $2x^2y$ gives $2x^2$.\n' +
        '- $3y^2$ gives $6y$.\n\n' +
        'So $\\frac{\\partial f}{\\partial y} = 2x^2 + 6y$.\n\n' +
        '**Step 2: substitute** $x = 1$, $y = 3$: $2 + 18 = 20$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial x} = 4xy$ at the point. The question asks for the $y$-derivative.',
        'This drops the term $2x^2y$ as if it were an added constant. It contains $y$, so it contributes $2x^2$.',
        'This substitutes the coordinates the wrong way round, using $x = 3$ and $y = 1$: $18 + 6 = 24$.',
      ],
      keyIdea: 'Differentiate first with the other variable held constant, then substitute the point in the right order.',
    },
    check: {
      optionValues: [20, 12, 18, 24],
      compute: () => ev(dy([[2, 2, 1], [3, 0, 2]]), 1, 3),
    },
  },
  {
    id: 'partial-derivatives-027',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'For the squared-error loss $L = (wx + b - y)^2$ with $x = 3$, $y = 4$, $w = 2$ and $b = 1$, find $\\frac{\\partial L}{\\partial b}$.',
    options: ['$6$', '$18$', '$9$', '$3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: chain rule.** The derivative of the inside with respect to $b$ is $1$, so $\\frac{\\partial L}{\\partial b} = 2(wx + b - y)$.\n\n' +
        '**Step 2: the error.** $wx + b - y = 2 \\times 3 + 1 - 4 = 3$.\n\n' +
        '**Step 3: substitute.** $\\frac{\\partial L}{\\partial b} = 2 \\times 3 = 6$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial L}{\\partial w} = 2(\\text{error}) \\times x$. The derivative of the inside with respect to $b$ is $1$, not $x$.',
        'This is the value of the loss, $3^2 = 9$, not its derivative.',
        'This is the error itself. It forgets the factor $2$ from the power rule.',
      ],
      keyIdea: 'For a squared error, $\\frac{\\partial L}{\\partial b} = 2(\\text{error})$, because $b$ has coefficient $1$ inside the bracket.',
    },
    check: {
      optionValues: [6, 18, 9, 3],
      compute: () => {
        const [x, y, w] = [3, 4, 2];
        return n1((b) => (w * x + b - y) ** 2, 1);
      },
    },
  },
  {
    id: 'partial-derivatives-028',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'A squared-error loss over two examples is $L(w) = (w - 3)^2 + (2w - 5)^2$. Find $\\frac{dL}{dw}$ at $w = 1$.',
    options: ['$-16$', '$-10$', '$-5$', '$13$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: differentiate each bracket** with the chain rule.\n\n' +
        '- $(w - 3)^2$ gives $2(w - 3)$.\n' +
        '- $(2w - 5)^2$ gives $2(2w - 5) \\times 2 = 4(2w - 5)$.\n\n' +
        '**Step 2: substitute** $w = 1$: $2(-2) + 4(-3) = -4 - 12 = -16$.',
      whyWrong: [
        null,
        'This forgets the inner derivative $2$ in the second bracket, working out $2(-2) + 2(-3)$.',
        'This forgets the factor $2$ from the power rule in both brackets, and the inner derivative too, working out $-2 - 3$.',
        'This is the value of the loss at $w = 1$, $4 + 9 = 13$, not its derivative.',
      ],
      keyIdea: 'Differentiate a sum of squared errors term by term, including the inner derivative of each bracket.',
    },
    check: {
      optionValues: [-16, -10, -5, 13],
      compute: () => n1((w) => (w - 3) ** 2 + (2 * w - 5) ** 2, 1),
    },
  },
  {
    id: 'partial-derivatives-029',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'A squared-error loss is $L(w_1, w_2) = (w_1 + w_2 - 4)^2$. What is the gradient $\\nabla L$ at $(w_1, w_2) = (1, 2)$?',
    options: ['$\\left(-2, -2\\right)$', '$\\left(2, 2\\right)$', '$\\left(-1, -1\\right)$', '$\\left(-2, -4\\right)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: the error.** $w_1 + w_2 - 4 = 1 + 2 - 4 = -1$.\n\n' +
        '**Step 2: partial derivatives.** Each weight has coefficient $1$ inside the bracket, so both partial derivatives equal $2 \\times$ the error:\n\n' +
        '$$\\frac{\\partial L}{\\partial w_1} = \\frac{\\partial L}{\\partial w_2} = 2(w_1 + w_2 - 4) = -2$$\n\n' +
        'So $\\nabla L = \\left(-2, -2\\right)$.',
      whyWrong: [
        null,
        'This loses the sign of the error, which is $-1$ here.',
        'This forgets the factor $2$ from the power rule.',
        'This multiplies by the value of each weight instead of its coefficient. The inner derivative is $1$ for each weight.',
      ],
      keyIdea: 'The inner derivative is the coefficient of that weight inside the bracket, not the weight\'s value.',
    },
    check: {
      optionValues: ['-2,-2', '2,2', '-1,-1', '-2,-4'],
      compute: () => {
        const L: F2 = (a, b) => (a + b - 4) ** 2;
        return vec(nx(L, 1, 2), ny(L, 1, 2));
      },
    },
  },
];
