import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'differentiation',
  know:
    '### What a derivative is\n\n' +
    'The **derivative** of a function tells you its **gradient** (steepness, or rate of change) at every point. For a straight line the gradient is the same everywhere, but a curve like $y = x^{2}$ gets steeper as $x$ grows. The derivative is a new function that gives the gradient at each $x$.\n\n' +
    'Notation: if $y = f(x)$, the derivative is written $f\'(x)$ or $\\frac{dy}{dx}$. Both mean the same thing. In machine learning this is exactly what **gradient descent** uses: the derivative of the loss tells the model which way to change a weight.\n\n' +
    '### The power rule (the one you use most)\n\n' +
    'For $x^{n}$: **multiply by the power, then reduce the power by 1.** So $x^{5} \\to 5x^{4}$ and $4x^{3} \\to 12x^{2}$. Two special cases:\n\n' +
    '- $ax$ becomes $a$ (for example $7x \\to 7$), because $x$ has a hidden power of 1 and $x^{0} = 1$.\n' +
    '- A constant on its own (like $-2$) becomes $0$: a flat line has gradient zero.\n\n' +
    'Differentiate a sum **term by term**. The power rule works for **any** power, including negative and fractional ones, but you must first **rewrite** the term as a power of $x$:\n\n' +
    '| Looks like | Rewrite as | Derivative |\n' +
    '| --- | --- | --- |\n' +
    '| $\\sqrt{x}$ | $x^{\\frac{1}{2}}$ | $\\frac{1}{2}x^{-\\frac{1}{2}} = \\frac{1}{2\\sqrt{x}}$ |\n' +
    '| $\\frac{1}{x}$ | $x^{-1}$ | $-x^{-2} = -\\frac{1}{x^{2}}$ |\n' +
    '| $\\frac{4}{x^{2}}$ | $4x^{-2}$ | $-8x^{-3} = -\\frac{8}{x^{3}}$ |\n\n' +
    'Careful: $-2 - 1 = -3$, so negative powers move **away** from zero.\n\n' +
    '### Standard derivatives to memorise\n\n' +
    '| $f(x)$ | $f\'(x)$ |\n' +
    '| --- | --- |\n' +
    '| $e^{x}$ | $e^{x}$ (its own derivative) |\n' +
    '| $\\ln x$ | $\\frac{1}{x}$ |\n' +
    '| $\\sin x$ | $\\cos x$ |\n' +
    '| $\\cos x$ | $-\\sin x$ |\n\n' +
    'Do **not** use the power rule on $e^{x}$: there the $x$ is in the exponent, not the base. Trig derivatives only work in **radians**.\n\n' +
    '### Product rule: two functions multiplied\n\n' +
    'If $y = uv$ (for example $x^{2}e^{x}$), then $\\frac{dy}{dx} = u\'v + uv\'$. In words: differentiate the first and keep the second, **plus** keep the first and differentiate the second. The derivative of a product is **not** the product of the derivatives.\n\n' +
    '### Quotient rule: one function divided by another\n\n' +
    'If $y = \\frac{u}{v}$, then $\\frac{dy}{dx} = \\frac{u\'v - uv\'}{v^{2}}$. The order on top matters (it has a minus sign), and the bottom is **squared**. If the bottom is just a number or a power of $x$, it is often faster to rewrite and use the power rule instead.\n\n' +
    '### Chain rule: a function inside a function\n\n' +
    'Things like $(3x^{2} - 1)^{5}$, $e^{-2x}$, $\\sin(4x)$ and $\\ln(x^{2} + 1)$ have an **outside** and an **inside**. The chain rule says:\n\n' +
    '**derivative of the outside (leave the inside alone) times derivative of the inside.**\n\n' +
    '- $(3x^{2} - 1)^{5} \\to 5(3x^{2} - 1)^{4} \\times 6x$\n' +
    '- $e^{kx} \\to ke^{kx}$ and $\\sin(kx) \\to k\\cos(kx)$\n' +
    '- $\\ln(g(x)) \\to \\frac{g\'(x)}{g(x)}$ ("derivative of the inside over the inside")\n\n' +
    'Forgetting the "times derivative of the inside" is the number one calculus mistake. With several layers, like $\\sin^{2}(3x)$, multiply one factor per layer.\n\n' +
    '### Evaluating a derivative at a point\n\n' +
    'To find the gradient at $x = 2$: **differentiate first, then substitute** $x = 2$ into $f\'(x)$. Substituting into $f(x)$ gives the height of the curve, not its gradient.\n\n' +
    '### The second derivative\n\n' +
    '$f\'\'(x)$ (or $\\frac{d^{2}y}{dx^{2}}$) means **differentiate twice**. It measures how the gradient itself is changing (the curve\'s "bend"). It is not $\\left(f\'(x)\\right)^{2}$. Constants vanish at every step.',
  formulas: [
    { label: 'Power rule', tex: '\\frac{d}{dx}\\left(ax^{n}\\right) = nax^{n-1}', note: 'Works for any power $n$, including negative and fractional powers.' },
    { label: 'Constants and linear terms', tex: '\\frac{d}{dx}(c) = 0 \\qquad \\frac{d}{dx}(ax) = a' },
    { label: 'Sum rule', tex: '\\frac{d}{dx}\\left(f + g\\right) = f\' + g\'', note: 'Differentiate term by term; constant multiples stay in front.' },
    { label: 'Exponential', tex: '\\frac{d}{dx}\\left(e^{x}\\right) = e^{x} \\qquad \\frac{d}{dx}\\left(e^{kx}\\right) = ke^{kx}' },
    { label: 'Natural log', tex: '\\frac{d}{dx}(\\ln x) = \\frac{1}{x} \\qquad \\frac{d}{dx}\\ln(g(x)) = \\frac{g\'(x)}{g(x)}', note: 'For $x > 0$. Note that $\\ln(kx)$ also differentiates to $\\frac{1}{x}$.' },
    { label: 'Sine and cosine', tex: '\\frac{d}{dx}(\\sin x) = \\cos x \\qquad \\frac{d}{dx}(\\cos x) = -\\sin x', note: '$x$ in radians.' },
    { label: 'Trig with a multiple', tex: '\\frac{d}{dx}\\sin(kx) = k\\cos(kx) \\qquad \\frac{d}{dx}\\cos(kx) = -k\\sin(kx)' },
    { label: 'Product rule', tex: '\\frac{d}{dx}(uv) = u\'v + uv\'' },
    { label: 'Quotient rule', tex: '\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u\'v - uv\'}{v^{2}}', note: 'Order on top matters; the bottom is squared.' },
    { label: 'Chain rule', tex: '\\frac{dy}{dx} = \\frac{dy}{du} \\times \\frac{du}{dx}', note: 'Derivative of the outside (inside unchanged) times derivative of the inside.' },
    { label: 'Chain rule on a power of a bracket', tex: '\\frac{d}{dx}\\left[g(x)\\right]^{n} = n\\left[g(x)\\right]^{n-1}g\'(x)' },
    { label: 'Second derivative', tex: 'f\'\'(x) = \\frac{d^{2}y}{dx^{2}} = \\frac{d}{dx}\\left(f\'(x)\\right)', note: 'Differentiate twice.' },
  ],
  examples: [
    {
      title: 'Power rule with roots and fractions, then a gradient',
      problem: 'Find the gradient of $y = x^{3} + \\frac{2}{x}$ at $x = 1$.',
      steps: [
        'Rewrite the fraction as a power: $y = x^{3} + 2x^{-1}$.',
        'Power rule on each term: $x^{3} \\to 3x^{2}$ and $2x^{-1} \\to -1 \\times 2x^{-2} = -2x^{-2}$.',
        'So $\\frac{dy}{dx} = 3x^{2} - \\frac{2}{x^{2}}$.',
        'Substitute $x = 1$: $3(1)^{2} - \\frac{2}{1^{2}} = 3 - 2 = 1$.',
      ],
      answer: 'The gradient at $x = 1$ is $1$.',
    },
    {
      title: 'Product rule',
      problem: 'Differentiate $y = x^{3}\\sin x$.',
      steps: [
        'Identify the two factors: $u = x^{3}$ and $v = \\sin x$.',
        'Differentiate each: $u\' = 3x^{2}$ and $v\' = \\cos x$.',
        'Product rule $u\'v + uv\'$: $\\frac{dy}{dx} = 3x^{2}\\sin x + x^{3}\\cos x$.',
        'Optionally factorise: $\\frac{dy}{dx} = x^{2}(3\\sin x + x\\cos x)$.',
      ],
      answer: '$\\frac{dy}{dx} = 3x^{2}\\sin x + x^{3}\\cos x$',
    },
    {
      title: 'Chain rule at a point',
      problem: 'Given $f(x) = (2x - 3)^{4}$, find $f\'(2)$.',
      steps: [
        'Outside: $u^{4} \\to 4u^{3}$, so $4(2x - 3)^{3}$ (inside unchanged).',
        'Inside: $\\frac{d}{dx}(2x - 3) = 2$.',
        'Multiply: $f\'(x) = 4(2x - 3)^{3} \\times 2 = 8(2x - 3)^{3}$.',
        'At $x = 2$ the inside is $2(2) - 3 = 1$, so $f\'(2) = 8 \\times 1^{3} = 8$.',
      ],
      answer: '$f\'(2) = 8$',
    },
    {
      title: 'Quotient rule and second derivative (exam level)',
      problem: 'Given $f(x) = \\frac{x}{x + 1}$, find $f\'(x)$ and $f\'\'(0)$.',
      steps: [
        '$u = x$, $u\' = 1$; $v = x + 1$, $v\' = 1$.',
        'Quotient rule: $f\'(x) = \\frac{1 \\cdot (x + 1) - x \\cdot 1}{(x + 1)^{2}} = \\frac{1}{(x + 1)^{2}}$.',
        'Rewrite for the next step: $f\'(x) = (x + 1)^{-2}$.',
        'Chain rule: $f\'\'(x) = -2(x + 1)^{-3} \\times 1 = -\\frac{2}{(x + 1)^{3}}$.',
        'Substitute $x = 0$: $f\'\'(0) = -\\frac{2}{(0 + 1)^{3}} = -2$.',
      ],
      answer: '$f\'(x) = \\frac{1}{(x + 1)^{2}}$ and $f\'\'(0) = -2$',
    },
  ],
  traps: [
    '**Forgetting the chain-rule factor.** $\\frac{d}{dx}(3x^{2} - 1)^{5}$ is $30x(3x^{2} - 1)^{4}$, not $5(3x^{2} - 1)^{4}$. Every time there is something other than plain $x$ inside, multiply by its derivative.',
    '**Multiplying derivatives for a product.** $\\frac{d}{dx}\\left(x^{2}e^{x}\\right)$ is not $2xe^{x}$. Use $u\'v + uv\'$, which gives $2xe^{x} + x^{2}e^{x}$.',
    '**Sign slips with trig and negative powers.** $\\cos x \\to -\\sin x$ (but $\\sin x \\to +\\cos x$), and $x^{-2} \\to -2x^{-3}$ (the power goes down to $-3$, not up to $-1$).',
    '**Substituting into the wrong function.** The gradient at a point comes from $f\'(x)$, not $f(x)$. A wrong option is very often just $f$ evaluated at that point.',
    '**Power rule on the wrong thing.** $e^{x}$ is not $xe^{x - 1}$, and $\\ln(3x)$ is not $\\ln 3 \\times \\ln x$: it equals $\\ln 3 + \\ln x$, so its derivative is $\\frac{1}{x}$.',
    '**Quotient rule order and the squared bottom.** It is $\\frac{u\'v - uv\'}{v^{2}}$. Swapping the top flips the sign; forgetting to square the bottom is also common.',
  ],
  examTip:
    'Most questions either ask "which expression is the derivative?" or "what is the gradient / $f\'\'$ at this point?". The wrong options are built from the traps above (missing chain factor, $f$ instead of $f\'$, product of derivatives, sign slip), so name the trap each option represents and cross it out.\n\n' +
    '- **Plug-in test for expression answers:** pick an easy $x$ (like $x = 1$ or $x = 2$) and compare each option with the slope from your calculator: $\\frac{f(x + 0.001) - f(x - 0.001)}{0.002}$. Only one option will match. Many calculators also have a built-in $\\frac{d}{dx}$ button.\n' +
    '- **Check simple points:** at $x = 0$, $e^{0} = 1$ and $\\sin 0 = 0$, which quickly kills wrong options.\n' +
    '- **Sign sense:** if the curve is clearly falling at that point (for example $e^{-2x}$), the gradient must be negative.\n' +
    '- Set the calculator to **radians** for any trig question.',
};
