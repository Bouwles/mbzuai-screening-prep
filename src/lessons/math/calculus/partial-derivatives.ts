import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'partial-derivatives',
  know:
    '### Functions of two variables\n\n' +
    'So far most functions you have met take **one** input, like $f(x) = x^2$. A function of two variables takes a **pair** of inputs and gives one output, for example $f(x, y) = x^2y + 3y$. To evaluate it, substitute both numbers in order: $f(2, -1) = 2^2 \\times (-1) + 3 \\times (-1) = -7$.\n\n' +
    'A helpful picture: think of $f(x, y)$ as the **height of a landscape** above the point $(x, y)$ on a map. In machine learning the loss $L(w_1, w_2)$ is exactly such a landscape over the possible weight values, and training a model means walking downhill on it.\n\n' +
    '### Partial derivatives: change one variable at a time\n\n' +
    'The **partial derivative** $\\frac{\\partial f}{\\partial x}$ (also written $f_x$) measures how fast $f$ changes when **only** $x$ changes. To find it, differentiate with respect to $x$ and treat $y$ as if it were a fixed number. Likewise $\\frac{\\partial f}{\\partial y}$ treats $x$ as a constant. The curly $\\partial$ simply signals "there are other variables, and they are being held still".\n\n' +
    'All your usual rules (power rule, chain rule, product rule, derivatives of $e^x$, $\\sin$, $\\cos$, $\\ln$) work exactly as before. The only new skill is deciding what counts as a constant:\n\n' +
    '| Term | $\\frac{\\partial}{\\partial x}$ | $\\frac{\\partial}{\\partial y}$ |\n' +
    '| --- | --- | --- |\n' +
    '| $5y^2$ | $0$ (no $x$ at all) | $10y$ |\n' +
    '| $3x^2y$ | $6xy$ ($y$ is a multiplier) | $3x^2$ |\n' +
    '| $4xy$ | $4y$ | $4x$ |\n' +
    '| $e^{xy}$ | $ye^{xy}$ (chain rule) | $xe^{xy}$ |\n\n' +
    'Two golden rules: a term with **no** $x$ in it vanishes when you differentiate with respect to $x$; a factor that only involves $y$ **stays** as a multiplier. For $f = 3x^2 + 5xy - 2y^3$ this gives $f_x = 6x + 5y$ and $f_y = 5x - 6y^2$.\n\n' +
    '### Second and mixed partial derivatives\n\n' +
    'You can differentiate again. $f_{xx} = \\frac{\\partial^2 f}{\\partial x^2}$ means differentiate with respect to $x$ twice. A **mixed** partial derivative differentiates once with respect to each variable: $\\frac{\\partial^2 f}{\\partial y \\, \\partial x}$ means "first $x$, then $y$". For $f = x^3y^2 + 5xy$: $f_x = 3x^2y^2 + 5y$, then $f_{xy} = 6x^2y + 5$.\n\n' +
    'For every function you will meet in this exam, the order does **not** matter: differentiating $y$ first gives $f_y = 2x^3y + 5x$ and then $6x^2y + 5$ again. This makes a great self-check.\n\n' +
    '### The gradient vector\n\n' +
    'Collect the partial derivatives into a vector, always with $x$ first:\n\n' +
    '$$\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$$\n\n' +
    'To evaluate the gradient at a point, find both partial derivatives, then substitute. For $f = x^2 + 3xy - y^2$ at $(1, 2)$: $f_x = 2x + 3y = 8$ and $f_y = 3x - 2y = -1$, so $\\nabla f = \\left(8, -1\\right)$.\n\n' +
    '### Steepest ascent and descent\n\n' +
    '- $\\nabla f$ points in the direction in which $f$ **increases fastest** (steepest ascent).\n' +
    '- $-\\nabla f$ points in the direction of **steepest descent**.\n' +
    '- The greatest rate of increase is the length $|\\nabla f| = \\sqrt{f_x^2 + f_y^2}$.\n' +
    '- Moving at right angles to $\\nabla f$ keeps $f$ (momentarily) constant: you walk along a contour.\n' +
    '- At a minimum or maximum the landscape is flat, so $\\nabla f = (0, 0)$. Points where $\\nabla f = (0, 0)$ are called **stationary points**; find them by solving $f_x = 0$ and $f_y = 0$ together. (A stationary point can also be a *saddle*, like the middle of a horse saddle: uphill one way, downhill the other.)\n\n' +
    '### Gradient descent\n\n' +
    'Gradient descent finds the weights that make a loss $L$ small by repeatedly stepping downhill:\n\n' +
    '$$\\mathbf{w} := \\mathbf{w} - \\eta \\nabla L$$\n\n' +
    'Here $\\eta$ (eta) is the **learning rate**, a small positive number. Each weight uses its own partial derivative: $w_i := w_i - \\eta \\frac{\\partial L}{\\partial w_i}$. The recipe:\n\n' +
    '1. Find the partial derivatives of the loss with respect to each weight.\n' +
    '2. Evaluate them at the current weights.\n' +
    '3. Multiply by $\\eta$.\n' +
    '4. **Subtract** from the current weights.\n' +
    '5. For another step, recompute the gradient at the new point.\n\n' +
    'Notice that gradient descent differentiates the loss with respect to the **weights** (the things we are allowed to change), not the inputs. If $\\eta$ is too large the steps overshoot the minimum; if it is too small, training is very slow. Near a minimum the gradient gets small, so the steps shrink automatically.',
  formulas: [
    { label: 'Partial derivative with respect to x', tex: '\\frac{\\partial f}{\\partial x} \\;:\\; \\text{differentiate in } x \\text{, treating } y \\text{ as a constant}' },
    { label: 'Partial derivative with respect to y', tex: '\\frac{\\partial f}{\\partial y} \\;:\\; \\text{differentiate in } y \\text{, treating } x \\text{ as a constant}' },
    { label: 'Mixed partial derivatives (order does not matter)', tex: '\\frac{\\partial^2 f}{\\partial y \\, \\partial x} = \\frac{\\partial^2 f}{\\partial x \\, \\partial y}', note: 'True for all the smooth functions met in this exam; a useful check.' },
    { label: 'Gradient vector', tex: '\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)' },
    { label: 'Greatest rate of increase', tex: '|\\nabla f| = \\sqrt{\\left(\\frac{\\partial f}{\\partial x}\\right)^2 + \\left(\\frac{\\partial f}{\\partial y}\\right)^2}' },
    { label: 'Direction of steepest ascent / descent', tex: '\\text{ascent: } \\nabla f \\qquad \\text{descent: } -\\nabla f' },
    { label: 'Gradient descent update', tex: '\\mathbf{w} := \\mathbf{w} - \\eta \\nabla L \\quad\\text{i.e.}\\quad w_i := w_i - \\eta \\frac{\\partial L}{\\partial w_i}', note: '$\\eta$ is the learning rate (a small positive number).' },
    { label: 'Stationary point', tex: '\\frac{\\partial f}{\\partial x} = 0 \\quad\\text{and}\\quad \\frac{\\partial f}{\\partial y} = 0' },
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
      title: 'A mixed partial derivative at a point',
      problem: 'For $f(x, y) = x^2e^{y}$, find $\\frac{\\partial^2 f}{\\partial y \\, \\partial x}$ at $(3, 0)$.',
      steps: [
        'Differentiate with respect to $x$ ($e^{y}$ is a constant multiplier): $f_x = 2xe^{y}$.',
        'Differentiate that with respect to $y$ ($2x$ is now the constant): $f_{xy} = 2xe^{y}$.',
        'Check the other order: $f_y = x^2e^{y}$, then $f_{yx} = 2xe^{y}$. The same.',
        'Substitute $x = 3$, $y = 0$: $2 \\times 3 \\times e^{0} = 6 \\times 1 = 6$.',
      ],
      answer: '$6$',
    },
    {
      title: 'Gradient, steepest ascent and its rate',
      problem: 'For $f(x, y) = xy + y^2$, find $\\nabla f$ at $(-2, 3)$, the direction of steepest descent there, and the greatest rate of increase.',
      steps: [
        'Partial derivatives: $f_x = y$ and $f_y = x + 2y$.',
        'At $(-2, 3)$: $f_x = 3$ and $f_y = -2 + 6 = 4$, so $\\nabla f = \\left(3, 4\\right)$.',
        'Steepest ascent is along $\\nabla f = \\left(3, 4\\right)$, so steepest descent is along $-\\nabla f = \\left(-3, -4\\right)$.',
        'Greatest rate of increase: $|\\nabla f| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.',
      ],
      answer: '$\\nabla f = \\left(3, 4\\right)$, steepest descent along $\\left(-3, -4\\right)$, greatest rate $5$',
    },
    {
      title: 'One step of gradient descent (exam level)',
      problem: 'A loss is $L(w_1, w_2) = w_1^2 + 2w_1w_2 + 3w_2^2$. The weights are $(1, -1)$ and the learning rate is $\\eta = 0.1$. Find the weights after one step of gradient descent.',
      steps: [
        'Partial derivatives: $\\frac{\\partial L}{\\partial w_1} = 2w_1 + 2w_2$ and $\\frac{\\partial L}{\\partial w_2} = 2w_1 + 6w_2$.',
        'At $(1, -1)$: $\\frac{\\partial L}{\\partial w_1} = 2 - 2 = 0$ and $\\frac{\\partial L}{\\partial w_2} = 2 - 6 = -4$.',
        'Update $w_1$: $1 - 0.1 \\times 0 = 1$ (a zero partial derivative means that weight does not move).',
        'Update $w_2$: $-1 - 0.1 \\times (-4) = -1 + 0.4 = -0.6$.',
        'Sense check: the loss falls from $1 - 2 + 3 = 2$ to $1 - 1.2 + 1.08 = 0.88$.',
      ],
      answer: '$(w_1, w_2) = \\left(1, -0.6\\right)$',
    },
  ],
  traps: [
    'Treating the other variable as **zero** instead of a constant. $\\frac{\\partial}{\\partial x}(5xy) = 5y$, not $0$. Only terms with no $x$ in them disappear.',
    'Differentiating every term as if it were an ordinary derivative. In $\\frac{\\partial}{\\partial x}$, a term like $-2y^3$ is a constant, so it gives $0$, not $-6y^2$.',
    'Swapping the order. The gradient is $\\left(f_x, f_y\\right)$ with $x$ first, and the point $(a, b)$ means $x = a$, $y = b$. Swapped components are a favourite distractor.',
    'Getting the sign of the update wrong. Gradient descent **subtracts** $\\eta \\nabla L$; adding it is gradient ascent and makes the loss bigger.',
    'Forgetting the learning rate, or reusing the old gradient on a second step. Multiply by $\\eta$ every time, and recompute the gradient at each new point.',
    'Adding the components for the rate of steepest ascent. $|\\nabla f| = \\sqrt{f_x^2 + f_y^2}$: for $\\left(3, 4\\right)$ that is $5$, not $7$ or $25$.',
  ],
  examTip:
    'Expect a formula for $f(x, y)$ or a loss $L(w_1, w_2)$ and four candidate derivatives, gradients or updated weights. Wrong options are usually built from one slip: the other partial derivative (for example $f_y$ offered for $f_x$), swapped vector components, a forgotten cross term, a lost power-rule factor 2, or a gradient-descent step with the wrong sign or no learning rate. Work out the answer yourself first, then match it. To check an expression option, pick a test point such as $(2, 3)$ and compare with a calculator estimate $\\frac{f(2.001, 3) - f(1.999, 3)}{0.002}$. For mixed partials, differentiating in the other order should give the same result. For gradient descent, a quick sense check: the new weights should lower the loss (substitute back if you have time), and each weight should move **against** the sign of its partial derivative.',
};
