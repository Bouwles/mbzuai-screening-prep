import type { StaticQuestion } from '../../../types';
import { round } from '../../../lib/mathx';

// ---- helpers used only by the answer checks (re-derive answers in code) ----
// A polynomial in x and y as a list of terms [coefficient, power of x, power of y].
type Poly = [number, number, number][];
const ev = (p: Poly, x: number, y: number): number => p.reduce((s, [c, a, b]) => s + c * x ** a * y ** b, 0);
const dx = (p: Poly): Poly => p.filter(([, a]) => a > 0).map(([c, a, b]) => [c * a, a - 1, b] as [number, number, number]);
const dy = (p: Poly): Poly => p.filter(([, , b]) => b > 0).map(([c, a, b]) => [c * b, a, b - 1] as [number, number, number]);
// Numeric (central difference) partial derivatives for non-polynomial functions.
type F2 = (x: number, y: number) => number;
const H = 1e-4;
const nx = (f: F2, x: number, y: number): number => (f(x + H, y) - f(x - H, y)) / (2 * H);
const ny = (f: F2, x: number, y: number): number => (f(x, y + H) - f(x, y - H)) / (2 * H);
const nxy = (f: F2, x: number, y: number): number =>
  (f(x + H, y + H) - f(x + H, y - H) - f(x - H, y + H) + f(x - H, y - H)) / (4 * H * H);
/** A 2D vector as a comparable string, e.g. "8,-1". */
const vec = (a: number, b: number): string => `${round(a, 6)},${round(b, 6)}`;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'partial-derivatives-001',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'A function of two variables is defined by $f(x, y) = x^2y + 3y$. What is the value of $f(2, -1)$?',
    options: ['$8$', '$1$', '$-7$', '$7$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A function of two variables takes a **pair** of inputs and gives one output. In $f(2, -1)$ the first number is $x$ and the second is $y$, so $x = 2$ and $y = -1$.\n\n' +
        'Substitute, keeping the negative number in brackets:\n\n' +
        '$$f(2, -1) = 2^2 \\times (-1) + 3 \\times (-1) = 4 \\times (-1) - 3 = -4 - 3 = -7$$',
      whyWrong: [
        'This swaps the inputs, using $x = -1$ and $y = 2$: $(-1)^2 \\times 2 + 3 \\times 2 = 8$. The first number in $f(2, -1)$ is always $x$.',
        'This reads $x^2y$ as $(xy)^2$: $(2 \\times (-1))^2 + 3 \\times (-1) = 4 - 3 = 1$. Only $x$ is squared, then multiplied by $y$.',
        null,
        'This drops the minus sign on $y$, effectively using $y = 1$: $4 + 3 = 7$.',
      ],
      keyIdea: 'To evaluate $f(a, b)$, substitute $x = a$ and $y = b$ (in that order), bracketing negative numbers.',
    },
    check: {
      optionValues: [8, 1, -7, 7],
      compute: () => ev([[1, 2, 1], [3, 0, 1]], 2, -1),
    },
  },
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
    id: 'partial-derivatives-005',
    subtopic: 'partial-derivatives',
    difficulty: 'foundation',
    stem: 'In gradient descent, a model\'s weights $\\mathbf{w}$ are updated step by step to make a loss function $L$ smaller. At each step, in which direction are the weights moved?',
    options: [
      'In the direction of the gradient, $\\nabla L$',
      'Perpendicular to the gradient $\\nabla L$',
      'In the direction of the negative gradient, $-\\nabla L$',
      'Straight towards the point where every weight equals zero',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'The gradient $\\nabla L$ points in the direction in which $L$ **increases** fastest (steepest ascent).\n\n' +
        'We want $L$ to **decrease**, so we step the opposite way, in the direction of $-\\nabla L$ (steepest descent). That is exactly what the update rule does:\n\n' +
        '$$\\mathbf{w} := \\mathbf{w} - \\eta \\nabla L$$\n\n' +
        'where $\\eta$ (the learning rate) is a small positive number controlling the step size.',
      whyWrong: [
        'Moving along $\\nabla L$ is steepest **ascent**: it makes the loss increase as fast as possible. That is gradient ascent, the opposite of what we want.',
        'Moving at right angles to the gradient follows a contour (level curve) of $L$, where the loss stays (to first order) the same, so it does not reduce the loss.',
        null,
        'The minimum of a loss is generally not at $\\mathbf{w} = \\mathbf{0}$. Gradient descent uses the slope of the loss, not the distance to the origin.',
      ],
      keyIdea: 'The gradient points uphill (steepest ascent), so gradient descent steps along $-\\nabla L$.',
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
    id: 'partial-derivatives-007',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = x^3y^2 + 5xy$. Find the mixed partial derivative $\\frac{\\partial^2 f}{\\partial y \\, \\partial x}$ (differentiate with respect to $x$, then differentiate the result with respect to $y$).',
    options: ['$6x^2y$', '$6xy^2$', '$2x^3$', '$6x^2y + 5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: differentiate with respect to $x$** (hold $y$ constant):\n\n' +
        '$$\\frac{\\partial f}{\\partial x} = 3x^2y^2 + 5y$$\n\n' +
        '**Step 2: differentiate that with respect to $y$** (hold $x$ constant):\n\n' +
        '- $3x^2y^2$ gives $3x^2 \\times 2y = 6x^2y$.\n' +
        '- $5y$ gives $5$.\n\n' +
        '$$\\frac{\\partial^2 f}{\\partial y \\, \\partial x} = 6x^2y + 5$$\n\n' +
        '**Check** the other order: $\\frac{\\partial f}{\\partial y} = 2x^3y + 5x$, then with respect to $x$: $6x^2y + 5$. The same, as expected for smooth functions.',
      whyWrong: [
        'This loses the $+5$: after the first step $5xy$ becomes $5y$, and $5y$ differentiated with respect to $y$ is $5$, not $0$.',
        'This is $\\frac{\\partial^2 f}{\\partial x^2}$: it differentiates with respect to $x$ twice instead of $x$ then $y$.',
        'This is $\\frac{\\partial^2 f}{\\partial y^2}$: it differentiates with respect to $y$ twice.',
        null,
      ],
      keyIdea: 'A mixed partial means differentiate with respect to one variable, then the other; the order does not change the answer for smooth functions.',
    },
    check: {
      // values of the options at the test point (2, 3)
      optionValues: [6 * 4 * 3, 6 * 2 * 9, 2 * 8, 6 * 4 * 3 + 5],
      compute: () => ev(dy(dx([[1, 3, 2], [5, 1, 1]])), 2, 3),
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
    stem: 'A model has one weight $w$ and loss $L(w) = (w - 5)^2$. The current weight is $w = 1$ and the learning rate is $\\eta = 0.1$. What is $w$ after **one** gradient descent update $w := w - \\eta \\frac{dL}{dw}$?',
    options: ['$0.2$', '$9$', '$1.8$', '$1.4$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: the derivative** (chain rule): $\\frac{dL}{dw} = 2(w - 5)$.\n\n' +
        '**Step 2: evaluate at** $w = 1$: $2(1 - 5) = -8$.\n\n' +
        '**Step 3: update.**\n\n' +
        '$$w := 1 - 0.1 \\times (-8) = 1 + 0.8 = 1.8$$\n\n' +
        'Sense check: the loss is smallest at $w = 5$, and the weight moved from 1 towards 5. The loss fell from $16$ to $(1.8 - 5)^2 = 10.24$.',
      whyWrong: [
        'This adds $\\eta \\times$ gradient instead of subtracting it: $1 + 0.1 \\times (-8) = 0.2$. That moves uphill, away from the minimum at $w = 5$.',
        'This forgets the learning rate: $1 - (-8) = 9$. The gradient must be multiplied by $\\eta = 0.1$ first.',
        null,
        'This forgets the factor 2 from the power rule, using $\\frac{dL}{dw} = w - 5 = -4$, so $1 - 0.1 \\times (-4) = 1.4$.',
      ],
      keyIdea: 'Gradient descent: new weight = old weight minus learning rate times the derivative at the old weight.',
    },
    check: {
      optionValues: [0.2, 9, 1.8, 1.4],
      compute: () => {
        const L = (w: number) => (w - 5) ** 2;
        const w = 1;
        const eta = 0.1;
        const g = (L(w + H) - L(w - H)) / (2 * H);
        return w - eta * g;
      },
    },
  },
  {
    id: 'partial-derivatives-010',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'A loss function is $L(w_1, w_2) = w_1^2 + 2w_2^2$. The current weights are $(w_1, w_2) = (3, -2)$ and the learning rate is $\\eta = 0.1$. What are the weights after one gradient descent step $\\mathbf{w} := \\mathbf{w} - \\eta \\nabla L$?',
    options: ['$\\left(2.4, -1.2\\right)$', '$\\left(3.6, -2.8\\right)$', '$\\left(-3, 6\\right)$', '$\\left(2.4, -1.6\\right)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: partial derivatives.** $\\frac{\\partial L}{\\partial w_1} = 2w_1$ and $\\frac{\\partial L}{\\partial w_2} = 4w_2$.\n\n' +
        '**Step 2: gradient at** $(3, -2)$: $\\nabla L = \\left(2 \\times 3, 4 \\times (-2)\\right) = \\left(6, -8\\right)$.\n\n' +
        '**Step 3: update each weight.**\n\n' +
        '- $w_1 := 3 - 0.1 \\times 6 = 3 - 0.6 = 2.4$\n' +
        '- $w_2 := -2 - 0.1 \\times (-8) = -2 + 0.8 = -1.2$\n\n' +
        'New weights: $\\left(2.4, -1.2\\right)$. Both moved towards the minimum at $(0, 0)$.',
      whyWrong: [
        null,
        'This adds $\\eta \\nabla L$ instead of subtracting it ($3 + 0.6$ and $-2 - 0.8$), which is a step of gradient **ascent**.',
        'This forgets the learning rate and subtracts the whole gradient: $3 - 6 = -3$ and $-2 + 8 = 6$.',
        'This differentiates $2w_2^2$ as $2w_2$ (forgetting to bring the power down), so the second gradient component is $-4$ and $w_2 = -2 + 0.4 = -1.6$.',
      ],
      keyIdea: 'Update every weight with its own partial derivative: $w_i := w_i - \\eta \\frac{\\partial L}{\\partial w_i}$.',
    },
    check: {
      optionValues: ['2.4,-1.2', '3.6,-2.8', '-3,6', '2.4,-1.6'],
      compute: () => {
        const L: F2 = (a, b) => a ** 2 + 2 * b ** 2;
        const [w1, w2, eta] = [3, -2, 0.1];
        return vec(w1 - eta * nx(L, w1, w2), w2 - eta * ny(L, w1, w2));
      },
    },
  },
  {
    id: 'partial-derivatives-011',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = x^2y$. In which direction does $f$ increase **most rapidly** at the point $(1, 3)$?',
    options: [
      'In the direction of the vector $\\left(-6, -1\\right)$',
      'In the direction of the vector $\\left(1, 6\\right)$',
      'In the direction of the vector $\\left(2, 1\\right)$',
      'In the direction of the vector $\\left(6, 1\\right)$',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'The direction of steepest **ascent** is the direction of the gradient.\n\n' +
        '**Step 1:** $\\frac{\\partial f}{\\partial x} = 2xy$ and $\\frac{\\partial f}{\\partial y} = x^2$.\n\n' +
        '**Step 2:** at $(1, 3)$: $\\frac{\\partial f}{\\partial x} = 2 \\times 1 \\times 3 = 6$ and $\\frac{\\partial f}{\\partial y} = 1^2 = 1$.\n\n' +
        'So $\\nabla f(1, 3) = \\left(6, 1\\right)$, and $f$ increases fastest in the direction of $\\left(6, 1\\right)$.',
      whyWrong: [
        'This is $-\\nabla f$, the direction of steepest **descent** (where $f$ decreases fastest).',
        'The gradient components are swapped. The first component is $\\frac{\\partial f}{\\partial x} = 6$.',
        'This drops the $y$ when differentiating $x^2y$ with respect to $x$ (using $2x$ instead of $2xy$), giving $\\frac{\\partial f}{\\partial x} = 2$.',
        null,
      ],
      keyIdea: 'The gradient $\\nabla f$ points in the direction of steepest ascent; $-\\nabla f$ points in the direction of steepest descent.',
    },
    check: {
      optionValues: ['-6,-1', '1,6', '2,1', '6,1'],
      compute: () => {
        const P: Poly = [[1, 2, 1]];
        return vec(ev(dx(P), 1, 3), ev(dy(P), 1, 3));
      },
    },
  },
  {
    id: 'partial-derivatives-012',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = e^{xy}$. Which of the following is $\\frac{\\partial f}{\\partial x}$?',
    options: ['$e^{xy}$', '$ye^{xy}$', '$xe^{xy}$', '$xye^{xy - 1}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use the chain rule: the derivative of $e^{u}$ is $e^{u} \\times \\frac{\\partial u}{\\partial x}$.\n\n' +
        'Here $u = xy$. Holding $y$ constant, $\\frac{\\partial u}{\\partial x} = y$.\n\n' +
        '$$\\frac{\\partial f}{\\partial x} = e^{xy} \\times y = ye^{xy}$$',
      whyWrong: [
        'This forgets the chain rule. The exponent is $xy$, not just $x$, so you must multiply by its derivative $\\frac{\\partial}{\\partial x}(xy) = y$.',
        null,
        'This is $\\frac{\\partial f}{\\partial y}$: differentiating the exponent $xy$ with respect to $y$ gives $x$.',
        'This applies the power rule to an exponential. The power rule is for $x^n$ with a **constant** power; $e^{u}$ differentiates to $e^{u}$ times the derivative of $u$.',
      ],
      keyIdea: 'All the usual rules (including the chain rule) still apply to partial derivatives; just treat the other variable as a constant.',
    },
    check: {
      // values of the options at the test point (0.5, 2), compared with a numeric derivative
      optionValues: [Math.E, 2 * Math.E, 0.5 * Math.E, 1],
      compute: () => nx((x, y) => Math.exp(x * y), 0.5, 2),
    },
  },
  {
    id: 'partial-derivatives-013',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'Let $f(x, y) = x^2 \\sin y$, where $y$ is in radians. Find the value of $\\frac{\\partial f}{\\partial y}$ at the point $(3, 0)$.',
    options: ['$9$', '$0$', '$6$', '$-9$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1:** hold $x$ constant, so $x^2$ is a constant multiplier. The derivative of $\\sin y$ is $\\cos y$:\n\n' +
        '$$\\frac{\\partial f}{\\partial y} = x^2 \\cos y$$\n\n' +
        '**Step 2:** substitute $x = 3$, $y = 0$:\n\n' +
        '$$3^2 \\times \\cos 0 = 9 \\times 1 = 9$$',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial x} = 2x \\sin y$, which is $6 \\times \\sin 0 = 0$ at this point. The question asks for the $y$-derivative.',
        'This differentiates $x^2$ as well, giving $2x \\cos y = 6$. In a partial derivative with respect to $y$, $x^2$ is a constant multiplier and is not differentiated.',
        'The derivative of $\\sin y$ is $+\\cos y$. The minus sign belongs to the derivative of $\\cos y$, which is $-\\sin y$.',
      ],
      keyIdea: 'When differentiating with respect to $y$, a factor that only involves $x$ is a constant multiplier and stays unchanged.',
    },
    check: {
      optionValues: [9, 0, 6, -9],
      compute: () => ny((x, y) => x ** 2 * Math.sin(y), 3, 0),
    },
  },
  {
    id: 'partial-derivatives-014',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    stem: 'A linear model predicts $\\hat{y} = wx + b$. For one training example the squared-error loss is $L = (wx + b - y)^2$. For the example $x = 2$, $y = 7$, with current parameters $w = 1$ and $b = 1$, what is $\\frac{\\partial L}{\\partial w}$?',
    options: ['$-8$', '$16$', '$-16$', '$-32$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: chain rule.** Let $e = wx + b - y$ (the error), so $L = e^2$. Holding $x$, $b$ and $y$ constant, $\\frac{\\partial e}{\\partial w} = x$. Therefore\n\n' +
        '$$\\frac{\\partial L}{\\partial w} = 2e \\times \\frac{\\partial e}{\\partial w} = 2(wx + b - y)x$$\n\n' +
        '**Step 2: the error.** $\\hat{y} = 1 \\times 2 + 1 = 3$, so $e = 3 - 7 = -4$.\n\n' +
        '**Step 3: substitute.** $\\frac{\\partial L}{\\partial w} = 2 \\times (-4) \\times 2 = -16$.\n\n' +
        'The negative sign makes sense: increasing $w$ would raise the prediction towards 7 and lower the loss.',
      whyWrong: [
        'This forgets the inner derivative $x = 2$ from the chain rule: $2 \\times (-4) = -8$. (That value is actually $\\frac{\\partial L}{\\partial b}$, since $\\frac{\\partial e}{\\partial b} = 1$.)',
        'This is a sign error: it uses $y - \\hat{y} = 4$ as the error but forgets that differentiating $y - wx - b$ with respect to $w$ gives $-x$, which puts the minus sign back.',
        null,
        'This multiplies by $x^2 = 4$ instead of $x$: the inner derivative of $wx + b - y$ with respect to $w$ is just $x$.',
      ],
      keyIdea: 'For $L = (wx + b - y)^2$, the chain rule gives $\\frac{\\partial L}{\\partial w} = 2(\\text{error}) \\times x$ and $\\frac{\\partial L}{\\partial b} = 2(\\text{error})$.',
    },
    check: {
      optionValues: [-8, 16, -16, -32],
      compute: () => {
        const [x, y, b] = [2, 7, 1];
        const L = (w: number) => (w * x + b - y) ** 2;
        return (L(1 + H) - L(1 - H)) / (2 * H);
      },
    },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'partial-derivatives-015',
    subtopic: 'partial-derivatives',
    difficulty: 'challenge',
    stem: 'Let $f(x, y) = x^2y + 2y$. What is the **greatest rate of increase** of $f$ at the point $(1, 2)$ (that is, the largest possible directional derivative there)?',
    options: ['$7$', '$25$', '$\\sqrt{17}$', '$5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The greatest rate of increase is in the direction of $\\nabla f$, and its value is the **length** of the gradient, $|\\nabla f|$.\n\n' +
        '**Step 1:** $\\frac{\\partial f}{\\partial x} = 2xy$ and $\\frac{\\partial f}{\\partial y} = x^2 + 2$.\n\n' +
        '**Step 2:** at $(1, 2)$: $\\frac{\\partial f}{\\partial x} = 2 \\times 1 \\times 2 = 4$ and $\\frac{\\partial f}{\\partial y} = 1 + 2 = 3$, so $\\nabla f = \\left(4, 3\\right)$.\n\n' +
        '**Step 3:** $|\\nabla f| = \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5$.',
      whyWrong: [
        'This adds the components, $4 + 3 = 7$. The length of a vector is $\\sqrt{a^2 + b^2}$, not $a + b$.',
        'This forgets the square root: $4^2 + 3^2 = 25$ is $|\\nabla f|^2$, not $|\\nabla f|$.',
        'This loses the $+2$ in $\\frac{\\partial f}{\\partial y}$ (differentiating $2y$ gives 2), so it uses $\\nabla f = \\left(4, 1\\right)$ and gets $\\sqrt{17}$.',
        null,
      ],
      keyIdea: 'The maximum rate of increase of $f$ at a point is $|\\nabla f| = \\sqrt{f_x^2 + f_y^2}$, achieved in the direction of $\\nabla f$.',
    },
    check: {
      optionValues: [7, 25, Math.sqrt(17), 5],
      compute: () => {
        const P: Poly = [[1, 2, 1], [2, 0, 1]];
        return Math.hypot(ev(dx(P), 1, 2), ev(dy(P), 1, 2));
      },
    },
  },
  {
    id: 'partial-derivatives-016',
    subtopic: 'partial-derivatives',
    difficulty: 'challenge',
    stem: 'The loss $L(w_1, w_2) = (w_1 - 2)^2 + (w_2 + 1)^2$ is minimised by gradient descent, starting at $(w_1, w_2) = (0, 0)$ with learning rate $\\eta = 0.25$. What are the weights after **two** steps?',
    options: ['$\\left(1, -0.5\\right)$', '$\\left(1.5, -0.75\\right)$', '$\\left(2, -1\\right)$', '$\\left(-2.5, 1.25\\right)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Partial derivatives: $\\frac{\\partial L}{\\partial w_1} = 2(w_1 - 2)$ and $\\frac{\\partial L}{\\partial w_2} = 2(w_2 + 1)$.\n\n' +
        '**Step 1** (from $(0, 0)$): $\\nabla L = \\left(2(0 - 2), 2(0 + 1)\\right) = \\left(-4, 2\\right)$.\n\n' +
        '- $w_1 = 0 - 0.25 \\times (-4) = 1$\n' +
        '- $w_2 = 0 - 0.25 \\times 2 = -0.5$\n\n' +
        '**Step 2** (from $(1, -0.5)$, so the gradient must be **recomputed**): $\\nabla L = \\left(2(1 - 2), 2(-0.5 + 1)\\right) = \\left(-2, 1\\right)$.\n\n' +
        '- $w_1 = 1 - 0.25 \\times (-2) = 1.5$\n' +
        '- $w_2 = -0.5 - 0.25 \\times 1 = -0.75$\n\n' +
        'After two steps: $\\left(1.5, -0.75\\right)$, moving closer to the minimum at $(2, -1)$.',
      whyWrong: [
        'This is the position after only **one** step; the question asks for two.',
        null,
        'This reuses the first gradient $\\left(-4, 2\\right)$ for the second step instead of recalculating it at the new point. It happens to land on the minimum, but that is not what two steps of gradient descent give.',
        'This adds $\\eta \\nabla L$ at each step (gradient ascent): first $(-1, 0.5)$, then the gradient there is $(-6, 3)$, giving $(-2.5, 1.25)$, moving away from the minimum.',
      ],
      keyIdea: 'In gradient descent the gradient is recalculated at every new point, so equal learning rates give shrinking steps as you approach the minimum.',
    },
    check: {
      optionValues: ['1,-0.5', '1.5,-0.75', '2,-1', '-2.5,1.25'],
      compute: () => {
        const L: F2 = (a, b) => (a - 2) ** 2 + (b + 1) ** 2;
        let [w1, w2] = [0, 0];
        const eta = 0.25;
        for (let step = 0; step < 2; step++) {
          const g1 = nx(L, w1, w2);
          const g2 = ny(L, w1, w2);
          [w1, w2] = [w1 - eta * g1, w2 - eta * g2];
        }
        return vec(w1, w2);
      },
    },
  },
  {
    id: 'partial-derivatives-017',
    subtopic: 'partial-derivatives',
    difficulty: 'challenge',
    stem: 'Let $f(x, y) = x^2 + xy + y^2 - 3x$. At which point is $\\nabla f = (0, 0)$, i.e. where is the stationary point at which gradient descent would stop?',
    options: ['$\\left(2, -1\\right)$', '$\\left(1.5, 0\\right)$', '$\\left(1.2, 0.6\\right)$', '$\\left(-2, 1\\right)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: set both partial derivatives to zero.**\n\n' +
        '- $\\frac{\\partial f}{\\partial x} = 2x + y - 3 = 0$\n' +
        '- $\\frac{\\partial f}{\\partial y} = x + 2y = 0$\n\n' +
        '**Step 2: solve the simultaneous equations.** From the second, $x = -2y$. Substitute into the first:\n\n' +
        '$$2(-2y) + y - 3 = 0 \\;\\Rightarrow\\; -3y = 3 \\;\\Rightarrow\\; y = -1$$\n\n' +
        'Then $x = -2 \\times (-1) = 2$.\n\n' +
        '**Check:** $\\frac{\\partial f}{\\partial x} = 4 - 1 - 3 = 0$ and $\\frac{\\partial f}{\\partial y} = 2 - 2 = 0$. The stationary point is $\\left(2, -1\\right)$.',
      whyWrong: [
        null,
        'This ignores the $xy$ term in both partial derivatives, solving $2x - 3 = 0$ and $2y = 0$. The cross term contributes $y$ to $\\frac{\\partial f}{\\partial x}$ and $x$ to $\\frac{\\partial f}{\\partial y}$.',
        'This rearranges $x + 2y = 0$ as $x = 2y$ (losing the minus sign), giving $5y = 3$, so $y = 0.6$ and $x = 1.2$.',
        'This makes a sign slip on $-3x$, writing $\\frac{\\partial f}{\\partial x} = 2x + y + 3$, which leads to $y = 1$ and $x = -2$.',
      ],
      keyIdea: 'A stationary point of $f(x, y)$ is where both partial derivatives are zero: solve $f_x = 0$ and $f_y = 0$ simultaneously.',
    },
    check: {
      optionValues: ['2,-1', '1.5,0', '1.2,0.6', '-2,1'],
      compute: () => {
        // f_x and f_y are linear: write each as A x + B y + C and solve by Cramer's rule
        const P: Poly = [[1, 2, 0], [1, 1, 1], [1, 0, 2], [-3, 1, 0]];
        const lin = (Q: Poly) => {
          const c = ev(Q, 0, 0);
          return [ev(Q, 1, 0) - c, ev(Q, 0, 1) - c, c];
        };
        const [a1, b1, c1] = lin(dx(P));
        const [a2, b2, c2] = lin(dy(P));
        const det = a1 * b2 - a2 * b1;
        return vec((-c1 * b2 + c2 * b1) / det, (-a1 * c2 + a2 * c1) / det);
      },
    },
  },
  {
    id: 'partial-derivatives-018',
    subtopic: 'partial-derivatives',
    difficulty: 'challenge',
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
    id: 'partial-derivatives-019',
    subtopic: 'partial-derivatives',
    difficulty: 'challenge',
    stem: 'Let $f(x, y) = e^{2x}y^3$. Find the value of the mixed partial derivative $\\frac{\\partial^2 f}{\\partial y \\, \\partial x}$ at the point $(0, 2)$.',
    options: ['$16$', '$32$', '$12$', '$24$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: differentiate with respect to $x$** ($y^3$ is a constant multiplier; the chain rule gives $\\frac{d}{dx}e^{2x} = 2e^{2x}$):\n\n' +
        '$$\\frac{\\partial f}{\\partial x} = 2e^{2x}y^3$$\n\n' +
        '**Step 2: differentiate with respect to $y$** ($2e^{2x}$ is now the constant multiplier):\n\n' +
        '$$\\frac{\\partial^2 f}{\\partial y \\, \\partial x} = 2e^{2x} \\times 3y^2 = 6e^{2x}y^2$$\n\n' +
        '**Step 3: substitute** $x = 0$, $y = 2$ (and $e^{0} = 1$):\n\n' +
        '$$6 \\times 1 \\times 2^2 = 24$$',
      whyWrong: [
        'This stops after the first derivative: $\\frac{\\partial f}{\\partial x} = 2e^{2x}y^3 = 2 \\times 8 = 16$ at the point.',
        'This differentiates with respect to $x$ twice: $\\frac{\\partial^2 f}{\\partial x^2} = 4e^{2x}y^3 = 32$ at the point.',
        'This forgets the chain-rule factor 2 from $e^{2x}$, using $\\frac{\\partial f}{\\partial x} = e^{2x}y^3$, which gives $3e^{2x}y^2 = 12$.',
        null,
      ],
      keyIdea: 'For a mixed partial, differentiate one variable at a time, applying the chain rule fully at each stage, then substitute.',
    },
    check: {
      optionValues: [16, 32, 12, 24],
      compute: () => round(nxy((x, y) => Math.exp(2 * x) * y ** 3, 0, 2), 3),
    },
  },
];
