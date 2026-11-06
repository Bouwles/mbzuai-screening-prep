import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'partial-derivatives',
  simple:
    'Many functions depend on two inputs, like a hill whose height depends on how far east ($x$) and how far north ($y$) you stand. ' +
    'A **partial derivative** is the slope in one direction only: for $\\frac{\\partial f}{\\partial x}$ you treat $y$ as a fixed number and differentiate as usual. ' +
    'The **gradient** $\\nabla f$ puts both slopes into one vector. In machine learning the same idea is applied to a **squared-error loss**, to see how each weight affects the error.',
  methods: [
    { cue: 'Find $\\frac{\\partial f}{\\partial x}$ or $\\frac{\\partial f}{\\partial y}$, possibly at a point', method: 'Treat the other variable as a constant: terms without the variable vanish, and factors of the other variable stay as multipliers. Differentiate first, then substitute.' },
    { cue: 'The **gradient** $\\nabla f$ at a point', method: '$\\nabla f = (f_x, f_y)$, $x$-component first. Find both partial derivatives, then substitute the point into each.' },
    { cue: 'A squared-error loss such as $L = (wx + b - y)^{2}$', method: 'Chain rule: $\\frac{\\partial L}{\\partial w} = 2(\\text{error}) \\times x$ and $\\frac{\\partial L}{\\partial b} = 2(\\text{error})$, where the error is $wx + b - y$.' },
    { cue: 'Find unknown constants from given partial derivatives', method: 'Write both partial derivatives, set them to the given values, and solve the equations.' },
  ],
  know:
    '### Functions of two variables\n\n' +
    'So far most functions you have met take **one** input, like $f(x) = x^2$. A function of two variables takes a **pair** of inputs and gives one output, for example $f(x, y) = x^2y + 3y$. To evaluate it, substitute both numbers in order: $f(2, -1) = 2^2 \\times (-1) + 3 \\times (-1) = -7$.\n\n' +
    'A helpful picture: think of $f(x, y)$ as the **height of a landscape** above the point $(x, y)$ on a map. In machine learning the loss $L(w_1, w_2)$ is exactly such a landscape over the possible weight values.\n\n' +
    '### Partial derivatives: change one variable at a time\n\n' +
    'The **partial derivative** $\\frac{\\partial f}{\\partial x}$ (also written $f_x$) measures how fast $f$ changes when **only** $x$ changes. To find it, differentiate with respect to $x$ and treat $y$ as if it were a fixed number. Likewise $\\frac{\\partial f}{\\partial y}$ treats $x$ as a constant. The curly $\\partial$ simply signals "there are other variables, and they are being held still".\n\n' +
    'The power rule and chain rule work exactly as before. The only new skill is deciding what counts as a constant:\n\n' +
    '| Term | $\\frac{\\partial}{\\partial x}$ | $\\frac{\\partial}{\\partial y}$ |\n' +
    '| --- | --- | --- |\n' +
    '| $5y^2$ | $0$ (no $x$ at all) | $10y$ |\n' +
    '| $3x^2y$ | $6xy$ ($y$ is a multiplier) | $3x^2$ |\n' +
    '| $4xy$ | $4y$ | $4x$ |\n\n' +
    'Two golden rules: a term with **no** $x$ in it vanishes when you differentiate with respect to $x$; a factor that only involves $y$ **stays** as a multiplier. For $f = 3x^2 + 5xy - 2y^3$ this gives $f_x = 6x + 5y$ and $f_y = 5x - 6y^2$.\n\n' +
    '### The gradient vector\n\n' +
    'Collect the partial derivatives into a vector, always with $x$ first:\n\n' +
    '$$\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$$\n\n' +
    'To evaluate the gradient at a point, find both partial derivatives, then substitute. For $f = x^2 + 3xy - y^2$ at $(1, 2)$: $f_x = 2x + 3y = 8$ and $f_y = 3x - 2y = -1$, so $\\nabla f = \\left(8, -1\\right)$.\n\n' +
    '### The gradient of a squared-error loss\n\n' +
    'A squared-error loss measures how far a prediction is from its target. For one example it is $L = (wx + b - y)^2$, where the bracket is the **error**. Differentiate it with respect to the **weights** $w$ and $b$ (the things we are allowed to change), using the chain rule: $2 \\times$ (error) $\\times$ (derivative of the inside).\n\n' +
    '- The inside changes by $x$ when $w$ changes, so $\\frac{\\partial L}{\\partial w} = 2(wx + b - y)x$.\n' +
    '- The inside changes by $1$ when $b$ changes, so $\\frac{\\partial L}{\\partial b} = 2(wx + b - y)$.\n\n' +
    'A loss over several examples is a sum of such squares: differentiate each bracket separately and add. The method of gradient descent uses this gradient to update the weights, and it is covered in the regression lesson.',
  formulas: [
    { label: 'Partial derivative with respect to x', tex: '\\frac{\\partial f}{\\partial x} \\;:\\; \\text{differentiate in } x \\text{, treating } y \\text{ as a constant}' },
    { label: 'Partial derivative with respect to y', tex: '\\frac{\\partial f}{\\partial y} \\;:\\; \\text{differentiate in } y \\text{, treating } x \\text{ as a constant}' },
    { label: 'Gradient vector', tex: '\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)' },
    { label: 'Squared-error loss for one example', tex: 'L = (wx + b - y)^2 \\;\\Rightarrow\\; \\frac{\\partial L}{\\partial w} = 2(wx + b - y)x, \\quad \\frac{\\partial L}{\\partial b} = 2(wx + b - y)' },
  ],
  examples: [
    {
      title: 'Finding both partial derivatives',
      problem: 'Find $\\frac{\\partial f}{\\partial x}$ and $\\frac{\\partial f}{\\partial y}$ for $f(x, y) = 4x^3y + 2y^2 - 7x$.',
      steps: [
        'For $\\frac{\\partial f}{\\partial x}$, hold $y$ constant. $4x^3y = (4y)x^3$ differentiates to $12x^2y$.',
        '$2y^2$ has no $x$, so it differentiates to $0$. And $-7x$ differentiates to $-7$.',
        'So $\\frac{\\partial f}{\\partial x} = 12x^2y - 7$.',
        'For $\\frac{\\partial f}{\\partial y}$, hold $x$ constant. $4x^3y = (4x^3)y$ differentiates to $4x^3$.',
        '$2y^2$ differentiates to $4y$, and $-7x$ has no $y$, so it gives $0$.',
        'So $\\frac{\\partial f}{\\partial y} = 4x^3 + 4y$.',
      ],
      answer: '$\\frac{\\partial f}{\\partial x} = 12x^2y - 7$ and $\\frac{\\partial f}{\\partial y} = 4x^3 + 4y$',
    },
    {
      title: 'A partial derivative at a point',
      problem: 'For $f(x, y) = 2x^2y + y^3$, find $\\frac{\\partial f}{\\partial x}$ at $(3, -1)$.',
      steps: [
        'Hold $y$ constant. $2x^2y = (2y)x^2$ differentiates to $4xy$, and $y^3$ has no $x$, so it gives $0$.',
        'So $\\frac{\\partial f}{\\partial x} = 4xy$.',
        'Substitute $x = 3$, $y = -1$: $4 \\times 3 \\times (-1) = -12$.',
      ],
      answer: '$-12$',
    },
    {
      title: 'The gradient at a point',
      problem: 'For $f(x, y) = xy + y^2$, find $\\nabla f$ at $(-2, 3)$.',
      steps: [
        'Partial derivatives: $f_x = y$ and $f_y = x + 2y$.',
        'Substitute $x = -2$, $y = 3$: $f_x = 3$ and $f_y = -2 + 6 = 4$.',
        'Keep the $x$-derivative first: $\\nabla f = \\left(3, 4\\right)$.',
      ],
      answer: '$\\nabla f = \\left(3, 4\\right)$',
    },
    {
      title: 'The gradient of a squared-error loss (exam level)',
      problem: 'For $L = (wx + b - y)^2$ with $x = 2$, $y = 5$, $w = 1$ and $b = 1$, find $\\frac{\\partial L}{\\partial w}$ and $\\frac{\\partial L}{\\partial b}$.',
      steps: [
        'The error is $wx + b - y = 1 \\times 2 + 1 - 5 = -2$.',
        'Chain rule for $w$: the inside changes by $x$, so $\\frac{\\partial L}{\\partial w} = 2 \\times (-2) \\times 2 = -8$.',
        'Chain rule for $b$: the inside changes by $1$, so $\\frac{\\partial L}{\\partial b} = 2 \\times (-2) = -4$.',
      ],
      answer: '$\\frac{\\partial L}{\\partial w} = -8$ and $\\frac{\\partial L}{\\partial b} = -4$',
    },
  ],
  traps: [
    'Treating the other variable as **zero** instead of a constant. $\\frac{\\partial}{\\partial x}(5xy) = 5y$, not $0$. Only terms with no $x$ in them disappear.',
    'Differentiating every term as if it were an ordinary derivative. In $\\frac{\\partial}{\\partial x}$, a term like $-2y^3$ is a constant, so it gives $0$, not $-6y^2$.',
    'Swapping the order. The gradient is $\\left(f_x, f_y\\right)$ with $x$ first, and the point $(a, b)$ means $x = a$, $y = b$. Swapped components are a favourite distractor.',
    'Forgetting the inner derivative of a squared error. $\\frac{\\partial}{\\partial w}(wx + b - y)^2 = 2(wx + b - y)x$: the factor $x$ is easy to lose.',
    'Giving the value of the loss instead of its derivative. For an error of $3$, the loss is $9$, but $\\frac{\\partial L}{\\partial b}$ is $6$.',
  ],
  examTip:
    'Expect a formula for $f(x, y)$ or a loss and four candidate derivatives or gradients. Wrong options are usually built from one slip: the other partial derivative (for example $f_y$ offered for $f_x$), swapped vector components, a forgotten cross term, a lost power-rule factor 2, or the value of the loss itself. Work out the answer yourself first, then match it. To check an expression option, pick a test point such as $(2, 3)$ and compare with a calculator estimate $\\frac{f(2.001, 3) - f(1.999, 3)}{0.002}$.',
};
