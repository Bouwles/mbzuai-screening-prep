import type { StaticQuestion } from '../../../types';

// Numerical derivatives used ONLY by the answer checks (independent of the hand-worked algebra).
const D = (f: (x: number) => number, x: number, h = 1e-5): number => (f(x + h) - f(x - h)) / (2 * h);
const D2 = (f: (x: number) => number, x: number, h = 1e-4): number => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'differentiation-001',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: 'Differentiate $f(x) = 4x^{3} - 5x^{2} + 7x - 2$. Which of these is $f\'(x)$?',
    options: ['$12x^{3} - 10x^{2} + 7x$', '$12x^{2} - 10x$', '$12x^{2} - 10x + 7$', '$4x^{2} - 5x + 7$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Use the **power rule** on each term separately: bring the power down in front, then reduce the power by 1. That is, $\\frac{d}{dx}(ax^{n}) = nax^{n-1}$.\n\n' +
        '- $4x^{3}$: $3 \\times 4x^{2} = 12x^{2}$\n' +
        '- $-5x^{2}$: $2 \\times (-5)x = -10x$\n' +
        '- $7x$ has a hidden power of 1: $1 \\times 7x^{0} = 7$\n' +
        '- $-2$ is a constant, and the derivative of a constant is $0$\n\n' +
        'Put the pieces together: $f\'(x) = 12x^{2} - 10x + 7$.',
      whyWrong: [
        'This multiplies by the power but forgets to **reduce** the power by 1 afterwards (for example $4x^{3}$ became $12x^{3}$ instead of $12x^{2}$).',
        'This treats $7x$ as if it were a constant and sends it to $0$. Only a plain number like $-2$ disappears; $7x$ differentiates to $7$.',
        null,
        'This reduces each power by 1 but forgets to **multiply** by the old power first (for example $4x^{3}$ became $4x^{2}$ instead of $12x^{2}$).',
      ],
      keyIdea: 'Power rule term by term: multiply by the power, then reduce the power by one; constants vanish and $ax$ becomes $a$.',
    },
    check: {
      optionValues: [12 * 8 - 10 * 4 + 7 * 2, 12 * 4 - 10 * 2, 12 * 4 - 10 * 2 + 7, 4 * 4 - 5 * 2 + 7],
      compute: () => D((x) => 4 * x ** 3 - 5 * x ** 2 + 7 * x - 2, 2),
    },
  },
  {
    id: 'differentiation-002',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: 'If $f(x) = 2\\sin x + 3\\cos x$, which of these is $f\'(x)$?',
    options: ['$2\\cos x - 3\\sin x$', '$2\\cos x + 3\\sin x$', '$-2\\cos x + 3\\sin x$', '$-2\\cos x - 3\\sin x$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The two trig derivatives to memorise are:\n\n' +
        '- $\\frac{d}{dx}(\\sin x) = \\cos x$\n' +
        '- $\\frac{d}{dx}(\\cos x) = -\\sin x$ (the minus sign belongs to the cosine rule)\n\n' +
        'Constants in front just stay in front:\n\n' +
        '- $2\\sin x \\to 2\\cos x$\n' +
        '- $3\\cos x \\to 3 \\times (-\\sin x) = -3\\sin x$\n\n' +
        'So $f\'(x) = 2\\cos x - 3\\sin x$.',
      whyWrong: [
        null,
        'This forgets the minus sign in $\\frac{d}{dx}(\\cos x) = -\\sin x$.',
        'This puts the minus sign on the wrong function, using $\\sin x \\to -\\cos x$ and $\\cos x \\to \\sin x$. Those are the **integration** results, not the derivatives.',
        'This uses $\\sin x \\to -\\cos x$. Differentiating $\\sin x$ gives $+\\cos x$; only differentiating $\\cos x$ brings a minus sign.',
      ],
      keyIdea: '$\\sin x$ differentiates to $\\cos x$, and $\\cos x$ differentiates to $-\\sin x$.',
    },
    check: {
      optionValues: [
        2 * Math.cos(1) - 3 * Math.sin(1),
        2 * Math.cos(1) + 3 * Math.sin(1),
        -2 * Math.cos(1) + 3 * Math.sin(1),
        -2 * Math.cos(1) - 3 * Math.sin(1),
      ],
      compute: () => D((x) => 2 * Math.sin(x) + 3 * Math.cos(x), 1),
    },
  },
  {
    id: 'differentiation-003',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: 'Find $\\frac{dy}{dx}$ when $y = 3e^{x} - 2\\ln x + 5$ (for $x > 0$).',
    options: ['$3xe^{x - 1} - \\frac{2}{x}$', '$3e^{x} - \\frac{2}{x}$', '$3e^{x} - \\frac{2}{x} + 5$', '$3e^{x} - 2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Differentiate term by term using the standard results:\n\n' +
        '- $\\frac{d}{dx}(e^{x}) = e^{x}$, so $3e^{x} \\to 3e^{x}$ (it is its own derivative)\n' +
        '- $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$, so $-2\\ln x \\to -\\frac{2}{x}$\n' +
        '- $5$ is a constant, so it differentiates to $0$\n\n' +
        'So $\\frac{dy}{dx} = 3e^{x} - \\frac{2}{x}$.',
      whyWrong: [
        'This wrongly applies the power rule to $e^{x}$. The power rule only works when the **variable** is the base ($x^{n}$); here $x$ is in the exponent, and $e^{x}$ is its own derivative.',
        null,
        'This keeps the constant $5$. A constant does not change, so its derivative is $0$.',
        'This treats $\\ln x$ as if it were $x$ (derivative $1$). The derivative of $\\ln x$ is $\\frac{1}{x}$.',
      ],
      keyIdea: '$e^{x}$ is its own derivative, $\\ln x$ differentiates to $\\frac{1}{x}$, and constants vanish.',
    },
    check: {
      optionValues: [
        3 * 2 * Math.exp(1) - 1,
        3 * Math.exp(2) - 1,
        3 * Math.exp(2) - 1 + 5,
        3 * Math.exp(2) - 2,
      ],
      compute: () => D((x) => 3 * Math.exp(x) - 2 * Math.log(x) + 5, 2),
    },
  },
  {
    id: 'differentiation-004',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: 'Given $f(x) = x^{3} - 4x$, find the value of $f\'(2)$.',
    options: ['$0$', '$8$', '$12$', '$32$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: differentiate first.** $f\'(x) = 3x^{2} - 4$.\n\n' +
        '**Step 2: then substitute** $x = 2$:\n\n' +
        '$$f\'(2) = 3(2)^{2} - 4 = 3 \\times 4 - 4 = 12 - 4 = 8$$\n\n' +
        'So the gradient of the curve at $x = 2$ is $8$.',
      whyWrong: [
        'This substitutes $x = 2$ into $f(x)$ instead of $f\'(x)$: $f(2) = 8 - 8 = 0$. That is the height of the curve, not its gradient.',
        null,
        'This differentiates $-4x$ to $0$ (as if it were a constant), giving $3(2)^{2} = 12$. The derivative of $-4x$ is $-4$.',
        'This works out $3x^{2}$ as $(3x)^{2} = 36$ and then subtracts 4. The power applies only to $x$: $3x^{2} = 3 \\times 4 = 12$.',
      ],
      keyIdea: 'Differentiate first, then substitute the $x$ value into $f\'(x)$, not into $f(x)$.',
    },
    check: {
      optionValues: [0, 8, 12, 32],
      compute: () => D((x) => x ** 3 - 4 * x, 2),
    },
  },
  {
    id: 'differentiation-005',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: 'For $f(x) = 2x^{4} - 3x^{2} + x$, which of these is the **second** derivative $f\'\'(x)$?',
    options: ['$8x^{3} - 6x + 1$', '$24x^{2} - 5$', '$(8x^{3} - 6x + 1)^{2}$', '$24x^{2} - 6$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The second derivative means **differentiate twice**.\n\n' +
        '**First derivative:** $f\'(x) = 4 \\times 2x^{3} - 2 \\times 3x + 1 = 8x^{3} - 6x + 1$.\n\n' +
        '**Second derivative:** differentiate $f\'(x)$ term by term:\n\n' +
        '- $8x^{3} \\to 24x^{2}$\n' +
        '- $-6x \\to -6$\n' +
        '- $1 \\to 0$ (a constant)\n\n' +
        'So $f\'\'(x) = 24x^{2} - 6$.',
      whyWrong: [
        'This is only the **first** derivative $f\'(x)$. The question asks for the second derivative, so you must differentiate once more.',
        'This keeps the constant $1$ from $f\'(x)$ when differentiating again ($-6 + 1 = -5$). The derivative of the constant $1$ is $0$.',
        'This squares the first derivative. The notation $f\'\'(x)$ means "differentiate $f\'(x)$ again", not $\\left(f\'(x)\\right)^{2}$.',
        null,
      ],
      keyIdea: 'The second derivative is the derivative of the derivative: differentiate twice.',
    },
    check: {
      optionValues: [8 - 6 + 1, 24 - 5, (8 - 6 + 1) ** 2, 24 - 6],
      compute: () => D2((x) => 2 * x ** 4 - 3 * x ** 2 + x, 1),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'differentiation-006',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'Find $\\frac{dy}{dx}$ when $y = 6\\sqrt{x} + \\frac{4}{x^{2}}$ (for $x > 0$).',
    options: [
      '$\\frac{3}{\\sqrt{x}} - \\frac{8}{x}$',
      '$3\\sqrt{x} - \\frac{8}{x^{3}}$',
      '$\\frac{3}{\\sqrt{x}} + \\frac{2}{x}$',
      '$\\frac{3}{\\sqrt{x}} - \\frac{8}{x^{3}}$',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: rewrite every term as a power of $x$** so the power rule can be used.\n\n' +
        '$$y = 6x^{\\frac{1}{2}} + 4x^{-2}$$\n\n' +
        '**Step 2: power rule** (multiply by the power, then subtract 1 from the power):\n\n' +
        '- $6x^{\\frac{1}{2}} \\to \\frac{1}{2} \\times 6x^{\\frac{1}{2} - 1} = 3x^{-\\frac{1}{2}}$\n' +
        '- $4x^{-2} \\to -2 \\times 4x^{-2 - 1} = -8x^{-3}$\n\n' +
        '**Step 3: rewrite without negative powers:** $3x^{-\\frac{1}{2}} = \\frac{3}{\\sqrt{x}}$ and $-8x^{-3} = -\\frac{8}{x^{3}}$.\n\n' +
        'So $\\frac{dy}{dx} = \\frac{3}{\\sqrt{x}} - \\frac{8}{x^{3}}$.',
      whyWrong: [
        'This lowers the power $-2$ to $-1$ (moving towards zero). Subtracting 1 from $-2$ gives $-3$, so the second term is $-\\frac{8}{x^{3}}$.',
        'This multiplies $6$ by $\\frac{1}{2}$ but forgets to reduce the power of $\\sqrt{x} = x^{\\frac{1}{2}}$ to $x^{-\\frac{1}{2}}$.',
        'This differentiates the **bottom** of $\\frac{4}{x^{2}}$ on its own, giving $\\frac{4}{2x} = \\frac{2}{x}$. You must first write the term as $4x^{-2}$ and then use the power rule.',
        null,
      ],
      keyIdea: 'Rewrite roots and fractions as powers ($\\sqrt{x} = x^{\\frac{1}{2}}$, $\\frac{1}{x^{2}} = x^{-2}$) before using the power rule.',
    },
    check: {
      optionValues: [3 / 2 - 8 / 4, 3 * 2 - 8 / 64, 3 / 2 + 2 / 4, 3 / 2 - 8 / 64],
      compute: () => D((x) => 6 * Math.sqrt(x) + 4 / x ** 2, 4),
    },
  },
  {
    id: 'differentiation-007',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'Use the product rule to differentiate $y = x^{2}e^{x}$.',
    options: ['$2xe^{x}$', '$x^{2}e^{x}$', '$xe^{x}(x + 2)$', '$2xe^{x} - x^{2}e^{x}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The **product rule**: if $y = uv$ then $\\frac{dy}{dx} = u\'v + uv\'$.\n\n' +
        '- $u = x^{2}$, so $u\' = 2x$\n' +
        '- $v = e^{x}$, so $v\' = e^{x}$\n\n' +
        'Substitute: $\\frac{dy}{dx} = 2x \\cdot e^{x} + x^{2} \\cdot e^{x} = 2xe^{x} + x^{2}e^{x}$.\n\n' +
        'Factorise out the common factor $xe^{x}$: $\\frac{dy}{dx} = xe^{x}(2 + x) = xe^{x}(x + 2)$.',
      whyWrong: [
        'This just multiplies the two derivatives together ($2x \\times e^{x}$). The derivative of a product is **not** the product of the derivatives.',
        'This differentiates only the $e^{x}$ part and leaves $x^{2}$ alone. Both factors depend on $x$, so you need both terms of the product rule.',
        null,
        'This uses a minus sign between the two terms, mixing the product rule up with the quotient rule. The product rule has a **plus**: $u\'v + uv\'$.',
      ],
      keyIdea: 'Product rule: $(uv)\' = u\'v + uv\'$, with a plus sign and both terms.',
    },
    check: {
      optionValues: [6 * Math.exp(3), 9 * Math.exp(3), 3 * Math.exp(3) * 5, 6 * Math.exp(3) - 9 * Math.exp(3)],
      compute: () => D((x) => x ** 2 * Math.exp(x), 3),
    },
  },
  {
    id: 'differentiation-008',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'Differentiate $y = \\frac{2x + 1}{x - 3}$ (for $x \\ne 3$).',
    options: ['$-\\frac{7}{(x - 3)^{2}}$', '$\\frac{7}{(x - 3)^{2}}$', '$2$', '$-\\frac{5}{(x - 3)^{2}}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **quotient rule**: if $y = \\frac{u}{v}$ then $\\frac{dy}{dx} = \\frac{u\'v - uv\'}{v^{2}}$ ("bottom times derivative of top, minus top times derivative of bottom, over bottom squared").\n\n' +
        '- $u = 2x + 1$, so $u\' = 2$\n' +
        '- $v = x - 3$, so $v\' = 1$\n\n' +
        'Substitute:\n\n' +
        '$$\\frac{dy}{dx} = \\frac{2(x - 3) - (2x + 1)(1)}{(x - 3)^{2}}$$\n\n' +
        'Expand the top carefully (the minus sign multiplies **both** terms of $2x + 1$):\n\n' +
        '$$2x - 6 - 2x - 1 = -7$$\n\n' +
        'So $\\frac{dy}{dx} = -\\frac{7}{(x - 3)^{2}}$.',
      whyWrong: [
        null,
        'This puts the numerator the wrong way round ($uv\' - u\'v$). The order matters in the quotient rule: it is $u\'v - uv\'$.',
        'This divides the derivative of the top by the derivative of the bottom ($2 \\div 1 = 2$). The derivative of a quotient is not the quotient of the derivatives.',
        'This makes a sign slip when expanding $-(2x + 1)$, writing $-2x + 1$ instead of $-2x - 1$, so the top becomes $-5$.',
      ],
      keyIdea: 'Quotient rule: $\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^{2}}$, and expand the minus sign over the whole bracket.',
    },
    check: {
      optionValues: [-7, 7, 2, -5],
      compute: () => D((x) => (2 * x + 1) / (x - 3), 4),
    },
  },
  {
    id: 'differentiation-009',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'Find $\\frac{dy}{dx}$ when $y = (3x^{2} - 1)^{5}$.',
    options: ['$5(3x^{2} - 1)^{4}$', '$30x(3x^{2} - 1)^{4}$', '$5(6x)^{4}$', '$30x(3x^{2} - 1)^{5}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'This is a function inside a function, so use the **chain rule**: differentiate the outside (leaving the inside alone), then multiply by the derivative of the inside.\n\n' +
        'Let $u = 3x^{2} - 1$, so $y = u^{5}$.\n\n' +
        '- Outside: $\\frac{dy}{du} = 5u^{4} = 5(3x^{2} - 1)^{4}$\n' +
        '- Inside: $\\frac{du}{dx} = 6x$\n\n' +
        'Multiply: $\\frac{dy}{dx} = 5(3x^{2} - 1)^{4} \\times 6x = 30x(3x^{2} - 1)^{4}$.',
      whyWrong: [
        'This differentiates the outside but forgets to multiply by the derivative of the inside ($6x$). That missing factor is the whole point of the chain rule.',
        null,
        'This replaces the inside by its derivative and keeps it in the bracket. The bracket should stay as $3x^{2} - 1$; its derivative $6x$ is multiplied on the outside.',
        'This multiplies by $5$ and by $6x$ correctly but forgets to reduce the power from $5$ to $4$.',
      ],
      keyIdea: 'Chain rule: derivative of the outside (inside unchanged) times the derivative of the inside.',
    },
    check: {
      optionValues: [5 * 2 ** 4, 30 * 2 ** 4, 5 * 6 ** 4, 30 * 2 ** 5],
      compute: () => D((x) => (3 * x ** 2 - 1) ** 5, 1),
    },
  },
  {
    id: 'differentiation-010',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'Given $f(x) = \\ln(x^{2} + 1)$, find the value of $f\'(1)$.',
    options: ['$\\frac{1}{2}$', '$\\ln 2$', '$2$', '$1$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use the chain rule with the log rule $\\frac{d}{dx}\\ln(g(x)) = \\frac{g\'(x)}{g(x)}$ ("derivative of the inside over the inside").\n\n' +
        'Here $g(x) = x^{2} + 1$ and $g\'(x) = 2x$, so\n\n' +
        '$$f\'(x) = \\frac{2x}{x^{2} + 1}$$\n\n' +
        'Substitute $x = 1$: $f\'(1) = \\frac{2(1)}{1^{2} + 1} = \\frac{2}{2} = 1$.',
      whyWrong: [
        'This uses $\\frac{1}{x^{2} + 1}$ and forgets to multiply by the derivative of the inside, $2x$.',
        'This substitutes into $f(x)$ instead of $f\'(x)$: $f(1) = \\ln 2$. That is the value of the function, not its gradient.',
        'This uses only the derivative of the inside ($2x$, which is $2$ at $x = 1$) and forgets to divide by the inside $x^{2} + 1$.',
        null,
      ],
      keyIdea: '$\\frac{d}{dx}\\ln(g(x)) = \\frac{g\'(x)}{g(x)}$: derivative of the inside over the inside.',
    },
    check: {
      optionValues: [0.5, Math.log(2), 2, 1],
      compute: () => D((x) => Math.log(x * x + 1), 1),
    },
  },
  {
    id: 'differentiation-011',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'If $f(x) = \\cos(4x)$, find the value of $f\'\\left(\\frac{\\pi}{8}\\right)$.',
    options: ['$4$', '$-1$', '$-4$', '$0$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: differentiate with the chain rule.** The outside is $\\cos(\\ldots)$, which differentiates to $-\\sin(\\ldots)$; the inside is $4x$, whose derivative is $4$.\n\n' +
        '$$f\'(x) = -\\sin(4x) \\times 4 = -4\\sin(4x)$$\n\n' +
        '**Step 2: substitute** $x = \\frac{\\pi}{8}$: $4x = \\frac{\\pi}{2}$ and $\\sin\\left(\\frac{\\pi}{2}\\right) = 1$.\n\n' +
        '$$f\'\\left(\\frac{\\pi}{8}\\right) = -4 \\times 1 = -4$$\n\n' +
        '(Calculator check: make sure it is in **radians**.)',
      whyWrong: [
        'This forgets the minus sign: the derivative of $\\cos$ is $-\\sin$, not $\\sin$.',
        'This forgets the chain-rule factor $4$ from the inside $4x$, giving $-\\sin\\left(\\frac{\\pi}{2}\\right) = -1$.',
        null,
        'This substitutes into $f(x)$ instead of $f\'(x)$: $\\cos\\left(\\frac{\\pi}{2}\\right) = 0$.',
      ],
      keyIdea: '$\\frac{d}{dx}\\cos(kx) = -k\\sin(kx)$: keep the minus sign and the chain-rule factor $k$.',
    },
    check: {
      optionValues: [4, -1, -4, 0],
      compute: () => D((x) => Math.cos(4 * x), Math.PI / 8),
    },
  },
  {
    id: 'differentiation-012',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'Given $f(x) = x^{3} - 6x^{2} + 4x$, find the value of $f\'\'(1)$.',
    options: ['$-6$', '$-5$', '$-1$', '$-2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**First derivative:** $f\'(x) = 3x^{2} - 12x + 4$.\n\n' +
        '**Second derivative:** differentiate again. $3x^{2} \\to 6x$, $-12x \\to -12$, and the constant $4 \\to 0$:\n\n' +
        '$$f\'\'(x) = 6x - 12$$\n\n' +
        '**Substitute** $x = 1$: $f\'\'(1) = 6(1) - 12 = -6$.',
      whyWrong: [
        null,
        'This is $f\'(1) = 3 - 12 + 4 = -5$, the **first** derivative at $x = 1$. You need to differentiate a second time.',
        'This is $f(1) = 1 - 6 + 4 = -1$, the value of the function itself.',
        'This keeps the constant $4$ when differentiating $f\'(x)$, giving $f\'\'(x) = 6x - 8$. The constant should become $0$.',
      ],
      keyIdea: 'Differentiate twice (constants vanish each time), then substitute.',
    },
    check: {
      optionValues: [-6, -5, -1, -2],
      compute: () => D2((x) => x ** 3 - 6 * x ** 2 + 4 * x, 1),
    },
  },
  {
    id: 'differentiation-013',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'What is the gradient of the curve $y = 5e^{-2x}$ at the point where $x = 0$?',
    options: ['$5$', '$-10$', '$10$', '$-2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The gradient is the value of $\\frac{dy}{dx}$.\n\n' +
        '**Step 1:** use $\\frac{d}{dx}e^{kx} = ke^{kx}$ (chain rule: the exponential stays, times the derivative of the power). Here $k = -2$:\n\n' +
        '$$\\frac{dy}{dx} = 5 \\times (-2)e^{-2x} = -10e^{-2x}$$\n\n' +
        '**Step 2:** substitute $x = 0$. Since $e^{0} = 1$:\n\n' +
        '$$\\frac{dy}{dx} = -10 \\times 1 = -10$$',
      whyWrong: [
        'This is the $y$-value at $x = 0$ ($5e^{0} = 5$), not the gradient.',
        null,
        'This loses the minus sign from the power $-2x$. The chain-rule factor is $-2$, so the gradient is negative (the curve is decreasing).',
        'This uses the chain-rule factor $-2$ but drops the constant multiple $5$ in front.',
      ],
      keyIdea: '$\\frac{d}{dx}\\left(Ae^{kx}\\right) = Ake^{kx}$, and $e^{0} = 1$.',
    },
    check: {
      optionValues: [5, -10, 10, -2],
      compute: () => D((x) => 5 * Math.exp(-2 * x), 0),
    },
  },
  {
    id: 'differentiation-014',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'For $x > 0$, what is the derivative of $f(x) = \\ln(3x)$?',
    options: ['$\\frac{3}{x}$', '$\\frac{1}{3x}$', '$\\frac{1}{x}$', '$\\frac{\\ln 3}{x}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Method 1 (chain rule):** derivative of the inside over the inside:\n\n' +
        '$$f\'(x) = \\frac{3}{3x} = \\frac{1}{x}$$\n\n' +
        '**Method 2 (log laws first):** $\\ln(3x) = \\ln 3 + \\ln x$. The term $\\ln 3$ is just a constant (about $1.0986$), so its derivative is $0$, leaving\n\n' +
        '$$f\'(x) = 0 + \\frac{1}{x} = \\frac{1}{x}$$\n\n' +
        'Both methods agree: $f\'(x) = \\frac{1}{x}$.',
      whyWrong: [
        'This multiplies by the inside derivative $3$ but forgets to divide by the whole inside $3x$ (it divides by $x$ only).',
        'This uses $\\frac{1}{\\text{inside}}$ but forgets to multiply by the derivative of the inside, which is $3$.',
        null,
        'This uses the false log law $\\ln(3x) = \\ln 3 \\times \\ln x$. The correct law is $\\ln(3x) = \\ln 3 + \\ln x$, and the constant $\\ln 3$ differentiates to $0$.',
      ],
      keyIdea: '$\\ln(kx) = \\ln k + \\ln x$, so its derivative is $\\frac{1}{x}$ for any positive constant $k$.',
    },
    check: {
      optionValues: [3 / 2, 1 / 6, 1 / 2, Math.log(3) / 2],
      compute: () => D((x) => Math.log(3 * x), 2),
    },
  },
  {
    id: 'differentiation-015',
    subtopic: 'differentiation',
    difficulty: 'exam',
    stem: 'For $x > 0$, which of these is the derivative of $y = \\frac{\\ln x}{x}$?',
    options: ['$\\frac{1 - \\ln x}{x^{2}}$', '$\\frac{\\ln x - 1}{x^{2}}$', '$\\frac{1}{x}$', '$\\frac{1 - \\ln x}{x}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Use the quotient rule $\\frac{dy}{dx} = \\frac{u\'v - uv\'}{v^{2}}$.\n\n' +
        '- $u = \\ln x$, so $u\' = \\frac{1}{x}$\n' +
        '- $v = x$, so $v\' = 1$\n\n' +
        'Substitute:\n\n' +
        '$$\\frac{dy}{dx} = \\frac{\\frac{1}{x} \\cdot x - \\ln x \\cdot 1}{x^{2}}$$\n\n' +
        'Simplify the top: $\\frac{1}{x} \\cdot x = 1$, so\n\n' +
        '$$\\frac{dy}{dx} = \\frac{1 - \\ln x}{x^{2}}$$',
      whyWrong: [
        null,
        'This writes the numerator the wrong way round ($uv\' - u\'v$), which flips the sign of the answer.',
        'This divides the derivative of the top ($\\frac{1}{x}$) by the derivative of the bottom ($1$). That is not the quotient rule.',
        'This gets the numerator right but forgets to **square** the denominator: the bottom should be $v^{2} = x^{2}$.',
      ],
      keyIdea: 'Quotient rule: $\\frac{u\'v - uv\'}{v^{2}}$; check the order of the top and remember to square the bottom.',
    },
    check: {
      optionValues: [(1 - Math.log(2)) / 4, (Math.log(2) - 1) / 4, 1 / 2, (1 - Math.log(2)) / 2],
      compute: () => D((x) => Math.log(x) / x, 2),
    },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'differentiation-016',
    subtopic: 'differentiation',
    difficulty: 'challenge',
    stem: 'Differentiate $f(x) = x(2x + 1)^{3}$ and give the answer in fully factorised form.',
    options: ['$(2x + 1)^{2}(5x + 1)$', '$6(2x + 1)^{2}$', '$(2x + 1)^{2}(1 - 4x)$', '$(2x + 1)^{2}(8x + 1)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'This is a **product** $uv$ where one factor needs the **chain rule**.\n\n' +
        '- $u = x$, so $u\' = 1$\n' +
        '- $v = (2x + 1)^{3}$, so by the chain rule $v\' = 3(2x + 1)^{2} \\times 2 = 6(2x + 1)^{2}$\n\n' +
        'Product rule:\n\n' +
        '$$f\'(x) = u\'v + uv\' = (2x + 1)^{3} + 6x(2x + 1)^{2}$$\n\n' +
        'Take out the common factor $(2x + 1)^{2}$:\n\n' +
        '$$f\'(x) = (2x + 1)^{2}\\left[(2x + 1) + 6x\\right] = (2x + 1)^{2}(8x + 1)$$\n\n' +
        'Quick check at $x = 0$: $f\'(0) = 1^{3} + 6(0)(1)^{2} = 1$, and $(1)^{2}(0 + 1) = 1$. It matches.',
      whyWrong: [
        'This forgets the chain-rule factor $2$ when differentiating $(2x + 1)^{3}$, giving $v\' = 3(2x + 1)^{2}$ and so $(2x + 1) + 3x = 5x + 1$ in the bracket.',
        'This multiplies the two derivatives ($1 \\times 6(2x + 1)^{2}$) instead of using the product rule.',
        'This uses a minus sign between the two product-rule terms ($u\'v - uv\'$), as if it were the quotient rule, giving $(2x + 1) - 6x = 1 - 4x$.',
        null,
      ],
      keyIdea: 'Product rule with a chain rule inside it, then factor out the common bracket.',
    },
    check: {
      optionValues: [25 * 11, 6 * 25, 25 * (1 - 8), 25 * 17],
      compute: () => D((x) => x * (2 * x + 1) ** 3, 2),
    },
  },
  {
    id: 'differentiation-017',
    subtopic: 'differentiation',
    difficulty: 'challenge',
    stem: 'The function $f(x) = ax^{3} + bx^{2} + cx$ satisfies $f\'(0) = -4$, $f\'\'(0) = 6$ and $f\'(1) = 5$. Find $a$, $b$ and $c$.',
    options: [
      '$a = -1,\\ b = 6,\\ c = -4$',
      '$a = 3,\\ b = 6,\\ c = -4$',
      '$a = 1,\\ b = 3,\\ c = -4$',
      '$a = -\\frac{1}{3},\\ b = 3,\\ c = -4$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: find the derivatives.**\n\n' +
        '$$f\'(x) = 3ax^{2} + 2bx + c \\qquad f\'\'(x) = 6ax + 2b$$\n\n' +
        '**Step 2: use each condition.**\n\n' +
        '1. $f\'(0) = c = -4$, so $c = -4$.\n' +
        '2. $f\'\'(0) = 2b = 6$, so $b = 3$.\n' +
        '3. $f\'(1) = 3a + 2b + c = 5$, so $3a + 6 - 4 = 5$, giving $3a = 3$ and $a = 1$.\n\n' +
        '**Step 3: check.** $f\'(x) = 3x^{2} + 6x - 4$, so $f\'(1) = 3 + 6 - 4 = 5$. Correct.\n\n' +
        'So $a = 1$, $b = 3$, $c = -4$.',
      whyWrong: [
        'This takes $f\'\'(0) = b$ (forgetting the factor $2$ in $2b$), so $b = 6$, and then $3a + 12 - 4 = 5$ gives $a = -1$.',
        'This forgets to multiply by the powers when differentiating, using $f\'(x) = ax^{2} + bx + c$ and $f\'\'(x) = 2ax + b$. Then $b = 6$ and $a + 6 - 4 = 5$ gives $a = 3$.',
        null,
        'This leaves $c$ out of $f\'(1)$, solving $3a + 2b = 5$ instead of $3a + 2b + c = 5$, which gives $a = -\\frac{1}{3}$.',
      ],
      keyIdea: 'Differentiate the general function first, then turn each given condition into an equation for the unknowns.',
    },
    check: {
      optionValues: ['-1,6,-4', '3,6,-4', '1,3,-4', '-1/3,3,-4'],
      compute: () => {
        // f'(0) = c, f''(0) = 2b, f'(1) = 3a + 2b + c: search a small grid of rationals for the unique solution.
        const sols: string[] = [];
        for (let a3 = -30; a3 <= 30; a3++) {
          const a = a3 / 3;
          for (let b = -10; b <= 10; b++)
            for (let c = -10; c <= 10; c++) {
              const fp = (x: number) => 3 * a * x * x + 2 * b * x + c;
              const fpp = (x: number) => 6 * a * x + 2 * b;
              if (Math.abs(fp(0) + 4) < 1e-9 && Math.abs(fpp(0) - 6) < 1e-9 && Math.abs(fp(1) - 5) < 1e-9)
                sols.push(`${a3 % 3 === 0 ? a3 / 3 : `${a3}/3`},${b},${c}`);
            }
        }
        return sols.join(';');
      },
    },
  },
  {
    id: 'differentiation-018',
    subtopic: 'differentiation',
    difficulty: 'challenge',
    stem: 'Find the value of $\\frac{dy}{dx}$ for $y = \\sin^{2}(3x)$ at $x = \\frac{\\pi}{12}$.',
    options: ['$3$', '$1$', '$-3$', '$3\\sqrt{2}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Write $y = \\left(\\sin(3x)\\right)^{2}$. There are **three layers**: squaring, then $\\sin$, then $3x$. Apply the chain rule layer by layer:\n\n' +
        '- Square: $2\\sin(3x)$\n' +
        '- $\\sin$: times $\\cos(3x)$\n' +
        '- $3x$: times $3$\n\n' +
        '$$\\frac{dy}{dx} = 2\\sin(3x) \\cdot \\cos(3x) \\cdot 3 = 6\\sin(3x)\\cos(3x)$$\n\n' +
        'At $x = \\frac{\\pi}{12}$: $3x = \\frac{\\pi}{4}$, and $\\sin\\left(\\frac{\\pi}{4}\\right) = \\cos\\left(\\frac{\\pi}{4}\\right) = \\frac{\\sqrt{2}}{2}$.\n\n' +
        '$$\\frac{dy}{dx} = 6 \\times \\frac{\\sqrt{2}}{2} \\times \\frac{\\sqrt{2}}{2} = 6 \\times \\frac{2}{4} = 3$$',
      whyWrong: [
        null,
        'This handles the square and the $\\sin$ but forgets the innermost factor $3$ from $3x$: $2\\sin(3x)\\cos(3x) = 1$ at this point.',
        'This uses $\\frac{d}{dx}\\sin = -\\cos$, which flips the sign. The derivative of $\\sin$ is $+\\cos$.',
        'This brings down the $2$ but replaces $\\sin(3x)$ by $\\cos(3x)$ instead of keeping it and multiplying by $\\cos(3x)$: $2\\cos(3x) \\times 3 = 6 \\times \\frac{\\sqrt{2}}{2} = 3\\sqrt{2}$.',
      ],
      keyIdea: 'For nested functions, apply the chain rule once per layer and multiply all the factors.',
    },
    check: {
      optionValues: [3, 1, -3, 3 * Math.SQRT2],
      compute: () => D((x) => Math.sin(3 * x) ** 2, Math.PI / 12),
    },
  },
  {
    id: 'differentiation-019',
    subtopic: 'differentiation',
    difficulty: 'challenge',
    stem: 'Given $f(x) = xe^{3x}$, find the value of $f\'\'(0)$.',
    options: ['$9$', '$1$', '$6$', '$2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**First derivative** (product rule with $u = x$, $v = e^{3x}$, $u\' = 1$, $v\' = 3e^{3x}$):\n\n' +
        '$$f\'(x) = 1 \\cdot e^{3x} + x \\cdot 3e^{3x} = e^{3x} + 3xe^{3x}$$\n\n' +
        '**Second derivative:** differentiate each term.\n\n' +
        '- $e^{3x} \\to 3e^{3x}$\n' +
        '- $3xe^{3x}$ is another product: $3e^{3x} + 3x \\cdot 3e^{3x} = 3e^{3x} + 9xe^{3x}$\n\n' +
        '$$f\'\'(x) = 3e^{3x} + 3e^{3x} + 9xe^{3x} = 6e^{3x} + 9xe^{3x}$$\n\n' +
        '**Substitute** $x = 0$ ($e^{0} = 1$): $f\'\'(0) = 6e^{0} + 9(0)e^{0} = 6$.',
      whyWrong: [
        'This multiplies derivatives instead of using the product rule: it treats $f\'(x)$ as $1 \\times 3e^{3x}$, then $f\'\'(x) = 9e^{3x}$, which gives $9$.',
        'This is $f\'(0) = e^{0} + 3(0)e^{0} = 1$, the **first** derivative at $0$.',
        null,
        'This forgets the chain-rule factor $3$ every time $e^{3x}$ is differentiated, getting $f\'\'(x) = 2e^{3x} + xe^{3x}$ and so $2$.',
      ],
      keyIdea: 'Second derivative of a product: apply the product rule twice, with the chain rule on $e^{kx}$ each time.',
    },
    check: {
      optionValues: [9, 1, 6, 2],
      compute: () => D2((x) => x * Math.exp(3 * x), 0),
    },
  },
  {
    id: 'differentiation-020',
    subtopic: 'differentiation',
    difficulty: 'challenge',
    stem: 'The **sigmoid** function $\\sigma(x) = \\frac{1}{1 + e^{-x}}$ is used in logistic regression and neural networks. What is $\\sigma\'(0)$?',
    options: ['$\\frac{1}{2}$', '$\\frac{1}{4}$', '$-\\frac{1}{4}$', '$-1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Write $\\sigma(x) = (1 + e^{-x})^{-1}$ and use the chain rule.\n\n' +
        '- Outside: $(\\ldots)^{-1} \\to -(\\ldots)^{-2}$\n' +
        '- Inside: $\\frac{d}{dx}(1 + e^{-x}) = -e^{-x}$\n\n' +
        'Multiply:\n\n' +
        '$$\\sigma\'(x) = -(1 + e^{-x})^{-2} \\times (-e^{-x}) = \\frac{e^{-x}}{(1 + e^{-x})^{2}}$$\n\n' +
        'At $x = 0$, $e^{0} = 1$:\n\n' +
        '$$\\sigma\'(0) = \\frac{1}{(1 + 1)^{2}} = \\frac{1}{4}$$\n\n' +
        '(Useful fact: $\\sigma\'(x) = \\sigma(x)\\left(1 - \\sigma(x)\\right)$, and $\\sigma(0) = \\frac{1}{2}$, so $\\sigma\'(0) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$.)',
      whyWrong: [
        'This is $\\sigma(0) = \\frac{1}{1 + 1} = \\frac{1}{2}$, the value of the function, not its derivative.',
        null,
        'This forgets the inner chain-rule factor: the derivative of $e^{-x}$ is $-e^{-x}$, and the two minus signs should cancel to give a positive answer.',
        'This differentiates only the denominator and puts it under the $1$, as if $\\left(\\frac{1}{g}\\right)\' = \\frac{1}{g\'}$: $\\frac{1}{-e^{0}} = -1$.',
      ],
      keyIdea: 'Write a reciprocal as a power $-1$ and use the chain rule; for the sigmoid, $\\sigma\' = \\sigma(1 - \\sigma)$.',
    },
    check: {
      optionValues: [0.5, 0.25, -0.25, -1],
      compute: () => D((x) => 1 / (1 + Math.exp(-x)), 0),
    },
  },
];
