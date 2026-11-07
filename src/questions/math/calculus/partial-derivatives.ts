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
      asking: 'How does $f$ change when $x$ changes and $y$ stays fixed?',
      solution:
        '$\\frac{\\partial f}{\\partial x}$ is called a **partial derivative**. It asks how $f$ changes as $x$ changes while $y$ stays fixed. So we treat $y$ like an ordinary number and differentiate with respect to $x$.\n\n' +
        'Take $3x^{2}$. By the power rule (multiply by the power, then lower the power by 1) it becomes $6x$.\n\n' +
        'Take $5xy$. With $y$ fixed, this is $5y \\times x$: a fixed amount times $x$. The derivative of a fixed amount times $x$ is just that amount, so it becomes $5y$.\n\n' +
        'Take $-2y^{3}$. It has no $x$ in it, so it acts like a plain number, and its derivative is 0.\n\n' +
        'Add the three results: $\\frac{\\partial f}{\\partial x} = 6x + 5y$.',
      conclusion: 'Treating $y$ as fixed, the terms give $6x$, $5y$ and 0, so the partial derivative is $6x + 5y$.',
      whyWrong: [
        'This also differentiates $-2y^3$ as if it depended on $x$. When differentiating with respect to $x$, a term with no $x$ in it is a constant, so its derivative is $0$.',
        null,
        'This is $\\frac{\\partial f}{\\partial y}$ (differentiating with respect to $y$ and holding $x$ fixed), not $\\frac{\\partial f}{\\partial x}$.',
        'This treats $5xy$ as a constant and throws it away. It does contain $x$: with $y$ fixed it behaves like $5y \\times x$, whose derivative is $5y$.',
      ],
      keyIdea: 'For $\\frac{\\partial f}{\\partial x}$: go term by term, pretending every $y$ is a number. Terms with no $x$ become 0, and a $y$ multiplying a term stays as a multiplier. Swap the roles for $\\frac{\\partial f}{\\partial y}$.',
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
      asking: 'How does $f$ change when $y$ changes and $x$ stays fixed?',
      solution:
        '$\\frac{\\partial f}{\\partial y}$ is a **partial derivative**: it asks how $f$ changes when only $y$ changes. So $y$ is the variable, and $x$ is treated as a fixed number.\n\n' +
        'With $x$ fixed, $x^{3}$ is just a number multiplying the rest, like the 5 in $5y^{2}$. A number multiplying a term stays in the answer.\n\n' +
        'Differentiate $y^{2}$ with the power rule (multiply by the power, then lower the power by 1): it becomes $2y$.\n\n' +
        'Keep the $x^{3}$ in front: $x^{3} \\times 2y = 2x^3y$.',
      conclusion: 'Only the $y^{2}$ part changes, and $x^{3}$ stays as a multiplier, so the answer is $2x^3y$.',
      whyWrong: [
        'This is $\\frac{\\partial f}{\\partial x}$: it differentiates $x^3$ and keeps $y^2$ fixed, the wrong way round.',
        'This differentiates **both** factors ($3x^2 \\times 2y$). A partial derivative changes only one variable; $x^3$ is a constant here.',
        'This throws away $x^3$ as if it were an added constant. It is a **multiplied** constant, so it stays in the answer (like the 5 in the derivative of $5y^2$).',
        null,
      ],
      keyIdea: 'In a product like $x^{3}y^{2}$, only one factor changes. Keep the other factor as a multiplier and differentiate the factor that has your variable. A multiplied factor stays; it doesn\'t vanish.',
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
      asking: 'What are the two partial derivatives of $f$, written as a pair?',
      solution:
        '$\\nabla f$, said "grad $f$", is a pair of partial derivatives: the $x$ one first, then the $y$ one. It is written as $\\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$.\n\n' +
        'Find $\\frac{\\partial f}{\\partial x}$, treating $y$ as a fixed number. By the power rule (multiply by the power, then lower the power by 1), $x^{2}$ becomes $2x$. $4y$ has no $x$ in it, so it becomes 0. So $\\frac{\\partial f}{\\partial x} = 2x$.\n\n' +
        'Find $\\frac{\\partial f}{\\partial y}$, treating $x$ as a fixed number. $x^{2}$ has no $y$ in it, so it becomes 0. $4y$ is 4 times $y$, so it becomes 4. So $\\frac{\\partial f}{\\partial y} = 4$.\n\n' +
        'Write them as a pair, $x$ part first: $\\left(2x, 4\\right)$.',
      conclusion: 'The $x$ part is $2x$ and the $y$ part is 4, so the gradient is $\\left(2x, 4\\right)$.',
      whyWrong: [
        null,
        'This adds the two partial derivatives into a single expression. The gradient is a **vector**: its components must be kept separate.',
        'The right components in the wrong order. The first component of $\\nabla f$ is always $\\frac{\\partial f}{\\partial x}$.',
        'The derivative of $4y$ with respect to $y$ is $4$, not $4y$; the $y$ was not differentiated.',
      ],
      keyIdea: 'For $\\nabla f$, find $\\frac{\\partial f}{\\partial x}$ and $\\frac{\\partial f}{\\partial y}$ separately, then write them as a pair in that order. Keep it as a vector, and never add the two parts.',
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
      asking: 'While you differentiate with respect to $x$, what do you do with $y$?',
      solution:
        'The **partial** derivative $\\frac{\\partial f}{\\partial x}$ asks: if only $x$ changes, how does $f$ change? So $y$ must stay fixed at whatever value it has.\n\n' +
        'A value that stays fixed behaves like a plain number, which is called a constant. For example, take $5xy$. With $y$ fixed, it is $5y \\times x$, and differentiating with respect to $x$ gives $5y$.',
      conclusion: 'Only $x$ is allowed to change, so you treat $y$ as a constant.',
      whyWrong: [
        null,
        'A constant is not the same as zero. For example, $\\frac{\\partial}{\\partial x}(5xy) = 5y$, not $0$.',
        'The two variables are independent, so $y$ does not change when $x$ changes.',
        'Only $x$ is differentiated here. Differentiating $y$ as well would not be a partial derivative with respect to $x$.',
      ],
      keyIdea: 'In a partial derivative, only the variable under the $\\partial$ changes. Treat every other letter as a number: when it multiplies a term it stays, and when it stands alone it becomes 0.',
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
      asking: 'How does $7y^{2}$ change when only $x$ changes?',
      solution:
        '$\\frac{\\partial f}{\\partial x}$ asks how $f$ changes when only $x$ changes, with $y$ held fixed.\n\n' +
        '$7y^{2}$ contains no $x$. With $y$ held fixed, $7y^{2}$ is just a fixed number, and changing $x$ does nothing to it.\n\n' +
        'A fixed number doesn\'t change at all, so its derivative is 0.',
      conclusion: 'With no $x$ in it, $f$ stays the same as $x$ changes, so the answer is $0$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial y}$. The question asks for the derivative with respect to $x$.',
        'This leaves the term unchanged. A constant differentiates to $0$; it does not stay as it is.',
        'This differentiates with respect to $y$ and also drops the $y$. A term with no $x$ gives $0$.',
      ],
      keyIdea: 'Before differentiating, ask whether each term contains the variable you are differentiating by. If it doesn\'t, that term contributes 0.',
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
      asking: 'How does $f$ change when only $y$ changes?',
      solution:
        '$\\frac{\\partial f}{\\partial y}$ asks how $f$ changes when only $y$ changes. So we treat $x$ as a fixed number.\n\n' +
        '$3x$ has no $y$ in it. With $x$ fixed it is just a number added on, so its derivative is 0.\n\n' +
        '$2y$ is a number times $y$, and the derivative of a number times $y$ is that number. So it becomes 2, and that is the total.',
      conclusion: 'The $3x$ gives 0 and the $2y$ gives 2, so the partial derivative is $2$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial x}$. The question asks for the derivative with respect to $y$.',
        'This keeps the $y$. The derivative of $2y$ with respect to $y$ is $2$.',
        'This keeps the term $3x$. With $x$ held constant, an added constant differentiates to $0$.',
      ],
      keyIdea: 'In a sum like $3x + 2y$, handle the terms separately. If a term contains your variable, differentiate it. If it doesn\'t, it becomes 0.',
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
      asking: 'How does $xy$ change when only $x$ changes?',
      solution:
        'We are differentiating with respect to $x$, so $y$ is treated as a fixed number.\n\n' +
        'Imagine $y$ is 5 for a moment. Then $f = 5x$, and its derivative is 5, the number multiplying $x$.\n\n' +
        'Now put the letter back. The fixed amount multiplying $x$ is $y$, so the derivative is $y$.',
      conclusion: '$y$ is the fixed amount multiplying $x$, so the partial derivative is $y$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial y}$, where $x$ is held constant instead.',
        'This differentiates the $x$ but loses the multiplier $y$. A multiplied constant stays in the answer.',
        'This leaves the term unchanged. The $x$ must be differentiated.',
      ],
      keyIdea: 'To differentiate a fixed amount times $x$ with respect to $x$, the result is that fixed amount. If a letter confuses you, swap it for a number like 5, differentiate, then swap it back.',
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
      asking: 'What is the gradient of a function of two variables made of?',
      solution:
        '$f$ has two inputs, $x$ and $y$, so it can change in two directions. Each direction has its own **partial derivative**. $\\frac{\\partial f}{\\partial x}$ holds $y$ fixed, and $\\frac{\\partial f}{\\partial y}$ holds $x$ fixed.\n\n' +
        'The **gradient** $\\nabla f$ collects both into a **vector**, which is a list of numbers in a fixed order. The $x$ part goes first and the $y$ part second. For example, $f = x^{2} + 3y$ has gradient $(2x, 3)$.',
      conclusion: 'One slot for each variable, in order, means the gradient is the vector $\\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$.',
      whyWrong: [
        null,
        'The components are in the wrong order. The first component is always the $x$-derivative.',
        'The gradient keeps its two components separate as a vector. It is not their sum.',
        'That is the function itself. The gradient is made from its derivatives.',
      ],
      keyIdea: 'To write a gradient: use one slot per variable, each holding the partial derivative for that variable, in the same order as the variables. It is a vector, never a sum.',
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
      asking: 'What is the gradient formula for $(w - 3)^{2}$?',
      solution:
        'A squared bracket is a function inside a function. Call the inside $u$, so $u = w - 3$ and the error is $u^{2}$. The **chain rule** says: differentiate the outside, then multiply by the derivative of the inside.\n\n' +
        'Differentiate the inside. $w$ gives 1, and the plain number $-3$ gives 0. So the derivative of the inside is 1.\n\n' +
        'Differentiate the outside. $u^{2}$ becomes $2u$, which is $2(w - 3)$. Multiplying by 1 changes nothing, so the result is $2(w - 3)$.',
      conclusion: 'Expanding agrees: $(w - 3)^{2} = w^{2} - 6w + 9$, whose derivative is $2w - 6$. That equals $2(w - 3)$.',
      whyWrong: [
        null,
        'This forgets the factor $2$ that the power rule brings down.',
        'This differentiates $w^2$ only and ignores the $-3$ in the bracket.',
        'This brings the $2$ down but forgets to reduce the power from $2$ to $1$.',
      ],
      keyIdea: 'For a squared error $(w - a)^{2}$, the derivative is $2(w - a)$. More generally, $(\\text{inside})^{2}$ gives $2(\\text{inside})$ times the derivative of the inside.',
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
      asking: 'How fast does $f$ change with $x$ alone at the point $(1, 2)$?',
      solution:
        '$\\frac{\\partial f}{\\partial x}$ asks how $f$ changes when only $x$ changes. So treat $y$ as a fixed number and go through each term:\n\n| Term | With $y$ fixed, it is | Derivative with respect to $x$ |\n|---|---|---|\n| $x^{2}y^{3}$ | a number times $x^{2}$ | $2xy^{3}$ |\n| $4x$ | 4 times $x$ | $4$ |\n| $-y$ | a plain number | $0$ |\n\n' +
        'Add the results: $\\frac{\\partial f}{\\partial x} = 2xy^{3} + 4$.\n\n' +
        'The point $(1, 2)$ means $x = 1$ and $y = 2$. Work out the power first, $2^{3} = 8$. Then $2 \\times 1 \\times 8 + 4 = 16 + 4 = 20$.',
      conclusion: 'The formula $2xy^{3} + 4$ gives $16 + 4$ at the point $(1, 2)$, which is $20$.',
      whyWrong: [
        null,
        'This forgets the $+4$ that comes from differentiating $4x$; only the $2xy^3$ part was evaluated.',
        'This is $\\frac{\\partial f}{\\partial y} = 3x^2y^2 - 1$ evaluated at the point: $12 - 1 = 11$. The question asks for the $x$-derivative.',
        'This substitutes the coordinates the wrong way round ($x = 2$, $y = 1$): $2 \\times 2 \\times 1 + 4 = 8$.',
      ],
      keyIdea: 'For a partial derivative at a point: differentiate first, with the other letter fixed. Only then substitute both coordinates, with the first as $x$ and the second as $y$.',
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
      asking: 'At the point $(1, 2)$, how fast does $f$ change with $x$ alone, and with $y$ alone?',
      solution:
        'The gradient $\\nabla f$ is the pair $\\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$. So we need two partial derivatives, each holding the other letter fixed.\n\n' +
        'For $\\frac{\\partial f}{\\partial x}$, hold $y$ fixed. By the power rule (multiply by the power, then lower the power by 1), $x^{2}$ gives $2x$. $3xy$ gives $3y$, the amount multiplying $x$. $-y^{2}$ has no $x$, so it gives 0. So $\\frac{\\partial f}{\\partial x} = 2x + 3y$.\n\n' +
        'For $\\frac{\\partial f}{\\partial y}$, hold $x$ fixed. $x^{2}$ has no $y$, so it gives 0. $3xy$ gives $3x$, the amount multiplying $y$. $-y^{2}$ gives $-2y$. So $\\frac{\\partial f}{\\partial y} = 3x - 2y$.\n\n' +
        'Substitute $x = 1$ and $y = 2$ into the first: $2 \\times 1 + 3 \\times 2 = 2 + 6 = 8$.\n\n' +
        'Substitute into the second: $3 \\times 1 - 2 \\times 2 = 3 - 4 = -1$. Written as a pair, $x$ part first, the gradient is $\\left(8, -1\\right)$.',
      conclusion: 'The $x$ part is 8 and the $y$ part is $-1$, so the gradient at the point is $\\left(8, -1\\right)$.',
      whyWrong: [
        'The right numbers in the wrong order. The first component of the gradient is $\\frac{\\partial f}{\\partial x}$.',
        null,
        'This ignores the cross term $3xy$ in both derivatives (giving only $2x = 2$ and $-2y = -4$). With the other variable held constant, $3xy$ still contributes $3y$ and $3x$.',
        'This is a sign slip on $-y^2$: its $y$-derivative is $-2y = -4$, so $\\frac{\\partial f}{\\partial y} = 3 - 4$, not $3 + 4$.',
      ],
      keyIdea: 'Gradient at a point: find each partial derivative with the other variable fixed, substitute the point into both, and write them as a pair, $x$ part first. A mixed term like $3xy$ feeds both parts.',
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
      asking: 'How fast does the loss change as $w$ changes, when $w$ is 1?',
      solution:
        '$L$ is a **loss**: a number measuring how wrong a model is. $\\frac{dL}{dw}$ is the rate at which it changes as $w$ changes.\n\n' +
        'A squared bracket is a function inside a function, so use the **chain rule**. Let $u = w - 5$, so $L = u^{2}$. The outside, $u^{2}$, gives $2u$. The inside, $w - 5$, has derivative 1.\n\n' +
        'Multiply them: $\\frac{dL}{dw} = 2(w - 5) \\times 1 = 2(w - 5)$.\n\n' +
        'Substitute $w = 1$. The bracket is $1 - 5 = -4$, so $\\frac{dL}{dw} = 2 \\times (-4) = -8$.',
      conclusion: 'The derivative is $2(w - 5)$, and at $w = 1$ that is twice $-4$, which is $-8$.',
      whyWrong: [
        null,
        'This has the sign wrong, as if the bracket were $5 - w$ with no chain-rule factor of $-1$. The derivative of $(w - 5)^2$ is $2(w - 5)$.',
        'This forgets the factor $2$ from the power rule, using $w - 5 = -4$.',
        'This is the value of the loss at $w = 1$, $(1 - 5)^2 = 16$, not its derivative.',
      ],
      keyIdea: '$(w - a)^{2}$ has derivative $2(w - a)$. Substitute $w$ and keep the sign of the bracket. A negative answer means increasing $w$ would reduce the loss.',
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
      asking: 'At $(1, 1)$, how fast does $L$ change with $w_1$ alone, and with $w_2$ alone?',
      solution:
        '$w_1$ and $w_2$ are just two variables. The gradient $\\nabla L$ is the pair $\\left(\\frac{\\partial L}{\\partial w_1}, \\frac{\\partial L}{\\partial w_2}\\right)$, so we need two partial derivatives.\n\n' +
        'For $\\frac{\\partial L}{\\partial w_1}$, hold $w_2$ fixed. The second bracket has no $w_1$, so it gives 0. The first bracket is a square, so use the **chain rule**: differentiate the outside, then multiply by the derivative of the inside. The outside gives $2(w_1 - 3)$, and the inside, $w_1 - 3$, has derivative 1. So this part is $2(w_1 - 3) \\times 1 = 2(w_1 - 3)$.\n\n' +
        'For $\\frac{\\partial L}{\\partial w_2}$, hold $w_1$ fixed. The first bracket has no $w_2$, so it gives 0. The second bracket gives $2(w_2 + 1) \\times 1 = 2(w_2 + 1)$.\n\n' +
        'Substitute $w_1 = 1$: $2(1 - 3) = 2 \\times (-2) = -4$.\n\n' +
        'Substitute $w_2 = 1$: $2(1 + 1) = 2 \\times 2 = 4$. Written as a pair, $w_1$ part first, the gradient is $\\left(-4, 4\\right)$.',
      conclusion: 'The two brackets give $-4$ and 4 at this point, so the gradient is $\\left(-4, 4\\right)$.',
      whyWrong: [
        null,
        'Every sign is flipped, as if each bracket were written the other way round. Keep the brackets exactly as given.',
        'This forgets the factor $2$ from the power rule, using only the values of the brackets.',
        'This squares each bracket, which gives the two parts of the loss. The gradient needs their derivatives.',
      ],
      keyIdea: 'When each variable has its own bracket, as in $(w_1 - a)^{2} + (w_2 - b)^{2}$, the gradient is $\\left(2(w_1 - a), 2(w_2 - b)\\right)$. Substitute and keep each bracket\'s sign.',
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
      asking: 'How fast does the loss change when only $w$ changes?',
      solution:
        '$L$ is the square of the error between the prediction $wx + b$ and the true value $y$. $\\frac{\\partial L}{\\partial w}$ asks how $L$ changes when only $w$ changes. So $x$, $b$ and $y$ stay fixed.\n\n' +
        'A squared bracket is a function inside a function, so use the **chain rule**. Call the inside $e = wx + b - y$, the **error**, so $L = e^{2}$. The outside, $e^{2}$, gives $2e$.\n\n' +
        'Now differentiate the inside with respect to $w$. In $wx$, $x$ is the fixed number multiplying $w$, so it gives $x$. $b$ and $y$ are fixed, so they give 0. The inside\'s derivative is $x$.\n\n' +
        'Multiply outside by inside: $\\frac{\\partial L}{\\partial w} = 2e \\times x$.\n\n' +
        'Work out the error with the given numbers: $e = 1 \\times 2 + 1 - 7 = -4$.\n\n' +
        'Substitute $e = -4$ and $x = 2$: $2 \\times (-4) \\times 2 = -16$.',
      conclusion: 'With an error of $-4$ and $x = 2$, the formula $2ex$ gives $-16$.',
      whyWrong: [
        'This forgets the inner derivative $x = 2$ from the chain rule: $2 \\times (-4) = -8$. (That value is actually $\\frac{\\partial L}{\\partial b}$, since $\\frac{\\partial e}{\\partial b} = 1$.)',
        'This is a sign error: it uses $y - wx - b = 4$ as the error but forgets that differentiating it with respect to $w$ gives $-x$, which puts the minus sign back.',
        null,
        'This multiplies by $x^2 = 4$ instead of $x$: the inner derivative of $wx + b - y$ with respect to $w$ is just $x$.',
      ],
      keyIdea: 'For $L = (wx + b - y)^{2}$: find the error $e = wx + b - y$ first. Then $\\frac{\\partial L}{\\partial w} = 2ex$ and $\\frac{\\partial L}{\\partial b} = 2e$, because the inside differentiates to $x$ and to 1.',
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
      asking: 'What values of $a$ and $b$ make the two partial derivatives equal 10 and 3 at $(1, 2)$?',
      solution:
        '$a$ and $b$ are unknown fixed numbers. We have two facts, so we can build two equations and solve them.\n\n' +
        'Find $\\frac{\\partial f}{\\partial x}$, holding $y$ fixed. By the power rule (multiply by the power, then lower the power by 1), $ax^{2}$ gives $2ax$. $bxy$ gives $by$, the amount multiplying $x$. So $\\frac{\\partial f}{\\partial x} = 2ax + by$.\n\n' +
        'Find $\\frac{\\partial f}{\\partial y}$, holding $x$ fixed. $ax^{2}$ has no $y$, so it gives 0. $bxy$ gives $bx$, the amount multiplying $y$. So $\\frac{\\partial f}{\\partial y} = bx$.\n\n' +
        'Put in $x = 1$ and $y = 2$ with the given values. The first fact gives $2a + 2b = 10$. The second gives $b = 3$.\n\n' +
        'Put $b = 3$ into the first equation: $2a + 6 = 10$. Take 6 from both sides: $2a = 4$. Divide by 2: $a = 2$. So $a = 2,\\ b = 3$.',
      conclusion: 'Both facts hold with $a = 2,\\ b = 3$: the first gives $2 \\times 2 + 2 \\times 3 = 10$, and the second gives 3.',
      whyWrong: [
        'This forgets to multiply $b$ by $y = 2$ in $\\frac{\\partial f}{\\partial x}$, solving $2a + 3 = 10$. The $x$-derivative of $bxy$ is $by$.',
        'This forgets the factor 2 when differentiating $ax^2$, solving $a + 2b = 10$ with $b = 3$, so $a = 4$.',
        null,
        'This takes $\\frac{\\partial f}{\\partial y}$ to be $by$ instead of $bx$, so $2b = 3$ gives $b = 1.5$ (and then $a = 3.5$). Differentiating $bxy$ with respect to $y$ leaves $bx$.',
      ],
      keyIdea: 'With unknown constants: differentiate as usual, treating the constants like numbers. Substitute the point into each partial derivative, set it equal to the given value, then solve the equations.',
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
      asking: 'How fast does $f$ change with $y$ alone at the point $(1, 3)$?',
      solution:
        '$\\frac{\\partial f}{\\partial y}$ asks how $f$ changes when only $y$ changes. So hold $x$ fixed, like a number.\n\n' +
        'Take $2x^{2}y$. With $x$ fixed, $2x^{2}$ is the amount multiplying $y$, so the derivative is $2x^{2}$.\n\n' +
        'Take $3y^{2}$. By the power rule (multiply by the power, then lower the power by 1) it becomes $6y$.\n\n' +
        'Add the results: $\\frac{\\partial f}{\\partial y} = 2x^{2} + 6y$.\n\n' +
        'The point $(1, 3)$ means $x = 1$ and $y = 3$. Substitute: $2 \\times 1^{2} + 6 \\times 3 = 2 + 18 = 20$.',
      conclusion: 'The formula $2x^{2} + 6y$ gives $2 + 18$ at this point, which is $20$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial f}{\\partial x} = 4xy$ at the point. The question asks for the $y$-derivative.',
        'This drops the term $2x^2y$ as if it were an added constant. It contains $y$, so it contributes $2x^2$.',
        'This substitutes the coordinates the wrong way round, using $x = 3$ and $y = 1$: $18 + 6 = 24$.',
      ],
      keyIdea: 'In $\\frac{\\partial f}{\\partial y}$, look at each term: a bare $y$ leaves its multiplier behind, and $y^{2}$ uses the power rule. Substitute only after differentiating, with the first coordinate as $x$ and the second as $y$.',
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
      asking: 'How fast does the loss change when only $b$ changes?',
      solution:
        '$\\frac{\\partial L}{\\partial b}$ asks how the loss $L$ changes when only $b$ changes. So $w$, $x$ and $y$ stay fixed.\n\n' +
        'A squared bracket is a function inside a function, so use the **chain rule**. Call the inside $e = wx + b - y$, the **error**, so $L = e^{2}$. The outside, $e^{2}$, gives $2e$.\n\n' +
        'Now differentiate the inside with respect to $b$. $wx$ and $y$ are fixed, so they give 0, and $b$ gives 1. So $\\frac{\\partial L}{\\partial b} = 2e \\times 1 = 2e$.\n\n' +
        'Work out the error with the given numbers: $e = 2 \\times 3 + 1 - 4 = 6 + 1 - 4 = 3$.\n\n' +
        'Substitute $e = 3$: $2 \\times 3 = 6$.',
      conclusion: 'The error is 3, and $\\frac{\\partial L}{\\partial b}$ is twice the error, so the answer is $6$.',
      whyWrong: [
        null,
        'This is $\\frac{\\partial L}{\\partial w} = 2(\\text{error}) \\times x$. The derivative of the inside with respect to $b$ is $1$, not $x$.',
        'This is the value of the loss, $3^2 = 9$, not its derivative.',
        'This is the error itself. It forgets the factor $2$ from the power rule.',
      ],
      keyIdea: '$\\frac{\\partial L}{\\partial b} = 2e$ because $b$ stands alone in the bracket, so the inside differentiates to 1. For $w$ the inside differentiates to $x$, so $\\frac{\\partial L}{\\partial w} = 2ex$. Work out the error first.',
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
      asking: 'How fast does this total loss change as $w$ changes, when $w$ is 1?',
      solution:
        '$L$ is a sum of two squared brackets, so differentiate each bracket separately and add. Each one uses the **chain rule**: differentiate the outside, then multiply by the derivative of the inside.\n\n' +
        'First bracket, $(w - 3)^{2}$. The outside gives $2(w - 3)$. The inside, $w - 3$, has derivative 1. So this part is $2(w - 3)$.\n\n' +
        'Second bracket, $(2w - 5)^{2}$. The outside gives $2(2w - 5)$. The inside, $2w - 5$, has derivative 2, because of the $2w$. So this part is $2(2w - 5) \\times 2 = 4(2w - 5)$.\n\n' +
        'Add the two parts: $\\frac{dL}{dw} = 2(w - 3) + 4(2w - 5)$.\n\n' +
        'Substitute $w = 1$: $2(1 - 3) + 4(2 - 5) = 2 \\times (-2) + 4 \\times (-3) = -4 - 12 = -16$.',
      conclusion: 'The two brackets contribute $-4$ and $-12$ at $w = 1$, and adding them gives $-16$.',
      whyWrong: [
        null,
        'This forgets the inner derivative $2$ in the second bracket, working out $2(-2) + 2(-3)$.',
        'This forgets the factor $2$ from the power rule in both brackets, and the inner derivative too, working out $-2 - 3$.',
        'This is the value of the loss at $w = 1$, $4 + 9 = 13$, not its derivative.',
      ],
      keyIdea: 'For a sum of squared brackets, differentiate each as $2 \\times$ the bracket $\\times$ the number in front of $w$ inside it, then add. Don\'t lose that inside number when it isn\'t 1.',
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
      asking: 'At $(1, 2)$, how fast does $L$ change with $w_1$ alone, and with $w_2$ alone?',
      solution:
        'The gradient is the pair $\\left(\\frac{\\partial L}{\\partial w_1}, \\frac{\\partial L}{\\partial w_2}\\right)$. Both variables sit inside the same squared bracket, so we use the **chain rule** each time: differentiate the outside, then multiply by the derivative of the inside.\n\n' +
        'For $w_1$, hold $w_2$ fixed. The outside gives 2 times the bracket. Inside, $w_1$ gives 1, while $w_2$ and $-4$ give 0. So $\\frac{\\partial L}{\\partial w_1} = 2(w_1 + w_2 - 4)$.\n\n' +
        'For $w_2$, hold $w_1$ fixed. The same working gives $\\frac{\\partial L}{\\partial w_2} = 2(w_1 + w_2 - 4)$.\n\n' +
        'Substitute $w_1 = 1$ and $w_2 = 2$. The bracket is $1 + 2 - 4 = -1$.\n\n' +
        'So each part is $2 \\times (-1) = -2$, and the gradient is $\\left(-2, -2\\right)$.',
      conclusion: 'Each variable has 1 in front of it, so both parts equal 2 times the bracket, giving $\\left(-2, -2\\right)$.',
      whyWrong: [
        null,
        'This loses the sign of the error, which is $-1$ here.',
        'This forgets the factor $2$ from the power rule.',
        'This multiplies by the value of each weight instead of its coefficient. The inner derivative is $1$ for each weight.',
      ],
      keyIdea: 'For one squared bracket holding several variables: work out the bracket\'s value, then each part of the gradient is $2 \\times$ the bracket $\\times$ that variable\'s number inside it. No number written means 1.',
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
