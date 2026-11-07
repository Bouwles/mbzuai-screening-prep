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
      asking: 'What is the formula for the gradient of this curve?',
      solution:
        '$f\'(x)$ is the **derivative** of $f$: a formula for the gradient (steepness) of the curve at any $x$. To find it, we go through the terms one at a time.\n\n' +
        'For powers of $x$ use the **power rule**: multiply by the power, then lower the power by 1. For example, in $4x^{3}$ we do $4 \\times 3 = 12$, and the power drops from 3 to 2, giving $12x^{2}$.\n\n' +
        'Two special cases. $7x$ has power 1, so it becomes $7 \\times 1 = 7$, with power 0, and $x^{0} = 1$. A plain number like $-2$ never changes as $x$ changes, so its derivative is 0.\n\n' +
        'Do every term the same way. Together they give $f\'(x) = 12x^{2} - 10x + 7$.\n\n| Term | Multiply by the power | New power | Result |\n|---|---|---|---|\n| $4x^{3}$ | $4 \\times 3 = 12$ | 2 | $12x^{2}$ |\n| $-5x^{2}$ | $-5 \\times 2 = -10$ | 1 | $-10x$ |\n| $7x$ | $7 \\times 1 = 7$ | 0 | $7$ |\n| $-2$ | no $x$ in it | none | $0$ |',
      conclusion: 'Applying the power rule to each term and adding the results gives $12x^{2} - 10x + 7$.',
      whyWrong: [
        'This multiplies by the power but forgets to **reduce** the power by 1 afterwards (for example $4x^{3}$ became $12x^{3}$ instead of $12x^{2}$).',
        'This treats $7x$ as if it were a constant and sends it to $0$. Only a plain number like $-2$ disappears; $7x$ differentiates to $7$.',
        null,
        'This reduces each power by 1 but forgets to **multiply** by the old power first (for example $4x^{3}$ became $4x^{2}$ instead of $12x^{2}$).',
      ],
      keyIdea: 'To differentiate a polynomial, go term by term: multiply by the power, then lower the power by 1. A term in $x$ leaves just its number, and a plain number disappears.',
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
      asking: 'What is the gradient formula for a mix of sine and cosine?',
      solution:
        'We need two standard derivatives. The derivative of $\\sin x$ is $\\cos x$. The derivative of $\\cos x$ is $-\\sin x$. Only the cosine one brings a minus sign.\n\n' +
        'We differentiate terms that are added one at a time, and a number multiplying a term just stays in front.\n\n' +
        'First term: $\\sin x$ becomes $\\cos x$, and the 2 stays in front. So $2\\sin x$ becomes $2\\cos x$.\n\n' +
        'Second term: $\\cos x$ becomes $-\\sin x$, and the 3 stays in front. So $3\\cos x$ becomes $-3\\sin x$. Together, $f\'(x) = 2\\cos x - 3\\sin x$.',
      conclusion: 'Sine turns into cosine with no sign change, and cosine turns into minus sine, so the answer is $2\\cos x - 3\\sin x$.',
      whyWrong: [
        null,
        'This forgets the minus sign in $\\frac{d}{dx}(\\cos x) = -\\sin x$.',
        'This puts the minus sign on the wrong function, using $\\sin x \\to -\\cos x$ and $\\cos x \\to \\sin x$. Those are the **integration** results, not the derivatives.',
        'This uses $\\sin x \\to -\\cos x$. Differentiating $\\sin x$ gives $+\\cos x$; only differentiating $\\cos x$ brings a minus sign.',
      ],
      keyIdea: 'Use the cycle $\\sin x \\to \\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x$, where each arrow means differentiate once. Keep the numbers in front and work term by term.',
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
      asking: 'What is the gradient formula for this mix of $e^{x}$, $\\ln x$ and a number?',
      solution:
        '$\\frac{dy}{dx}$ means the derivative of $y$: how fast $y$ changes as $x$ changes. We differentiate each of the three terms on its own.\n\n' +
        '$e^{x}$ is special, because its derivative is itself. The 3 stays in front, so $3e^{x}$ stays as $3e^{x}$. The power rule doesn\'t apply here, because $x$ is in the power rather than the base.\n\n' +
        '$\\ln x$ (the natural logarithm) has derivative $\\frac{1}{x}$. The $-2$ stays in front, so $-2\\ln x$ becomes $-2 \\times \\frac{1}{x} = -\\frac{2}{x}$.\n\n' +
        'The plain number 5 never changes, so its derivative is 0 and it disappears. Adding the results gives $\\frac{dy}{dx} = 3e^{x} - \\frac{2}{x}$.',
      conclusion: 'The $e^{x}$ term keeps its form, the logarithm becomes a fraction and the 5 vanishes, leaving $3e^{x} - \\frac{2}{x}$.',
      whyWrong: [
        'This wrongly applies the power rule to $e^{x}$. The power rule only works when the **variable** is the base ($x^{n}$); here $x$ is in the exponent, and $e^{x}$ is its own derivative.',
        null,
        'This keeps the constant $5$. A constant does not change, so its derivative is $0$.',
        'This treats $\\ln x$ as if it were $x$ (derivative $1$). The derivative of $\\ln x$ is $\\frac{1}{x}$.',
      ],
      keyIdea: 'Know these three: $e^{x}$ differentiates to $e^{x}$, $\\ln x$ to $\\frac{1}{x}$, and a plain number to 0. Work term by term and keep the number in front of each term.',
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
      asking: 'How steep is the curve at $x = 2$?',
      solution:
        '$f\'(2)$ means the gradient of the curve at $x = 2$. So we need the gradient formula $f\'(x)$ first, and then we put in 2.\n\n' +
        'Use the power rule: multiply by the power, then lower the power by 1. $x^{3}$ becomes $3x^{2}$, and $-4x$ becomes $-4$. So $f\'(x) = 3x^{2} - 4$.\n\n' +
        'Substitute $x = 2$. The power goes first: $2^{2} = 4$. So $f\'(2) = 3 \\times 4 - 4$.\n\n' +
        'Multiply, then subtract: $12 - 4 = 8$.',
      conclusion: 'The gradient formula gives $12 - 4$ at $x = 2$, which is $8$.',
      whyWrong: [
        'This substitutes $x = 2$ into $f(x)$ instead of $f\'(x)$: $f(2) = 8 - 8 = 0$. That is the height of the curve, not its gradient.',
        null,
        'This differentiates $-4x$ to $0$ (as if it were a constant), giving $3(2)^{2} = 12$. The derivative of $-4x$ is $-4$.',
        'This works out $3x^{2}$ as $(3x)^{2} = 36$ and then subtracts 4. The power applies only to $x$: $3x^{2} = 3 \\times 4 = 12$.',
      ],
      keyIdea: 'To find $f\'(a)$: differentiate first, then substitute $x = a$ into $f\'(x)$. Substituting into $f(x)$ gives the height of the curve, not its gradient.',
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
      asking: 'What do we get if we differentiate this function twice?',
      solution:
        '$f\'\'(x)$ is the **second derivative**. To find it, differentiate $f(x)$ to get $f\'(x)$, then differentiate that result again.\n\n' +
        'First derivative, using the power rule (multiply by the power, then lower the power by 1): $2x^{4}$ becomes $8x^{3}$, $-3x^{2}$ becomes $-6x$, and $x$ becomes 1. So $f\'(x) = 8x^{3} - 6x + 1$.\n\n' +
        'Differentiate each term of that again: $8x^{3}$ becomes $24x^{2}$, because $8 \\times 3 = 24$. $-6x$ becomes $-6$. The plain number 1 becomes 0. So $f\'\'(x) = 24x^{2} - 6$.',
      conclusion: 'Differentiating twice, and letting the constant drop away on the second pass, gives $24x^{2} - 6$.',
      whyWrong: [
        'This is only the **first** derivative $f\'(x)$. The question asks for the second derivative, so you must differentiate once more.',
        'This keeps the constant $1$ from $f\'(x)$ when differentiating again ($-6 + 1 = -5$). The derivative of the constant $1$ is $0$.',
        'This squares the first derivative. The notation $f\'\'(x)$ means "differentiate $f\'(x)$ again", not $\\left(f\'(x)\\right)^{2}$.',
        null,
      ],
      keyIdea: 'For $f\'\'(x)$: differentiate, write the result out in full, then differentiate it again. Any plain number left in $f\'(x)$ disappears on the second pass.',
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
      asking: 'What is the gradient formula when the terms contain a square root and a fraction?',
      solution:
        'The power rule only works on powers of $x$, so rewrite each term as one. A square root is a power of one half: $\\sqrt{x} = x^{\\frac{1}{2}}$. Dividing by a power makes it negative: $\\frac{1}{x^{2}} = x^{-2}$.\n\n' +
        'So $y = 6x^{\\frac{1}{2}} + 4x^{-2}$.\n\n' +
        'First term. Multiply by the power: $6 \\times \\frac{1}{2} = 3$. Lower the power by 1: $\\frac{1}{2} - 1 = -\\frac{1}{2}$. This gives $3x^{-\\frac{1}{2}}$.\n\n' +
        'Second term. Multiply by the power: $4 \\times (-2) = -8$. Lower the power by 1: $-2 - 1 = -3$. This gives $-8x^{-3}$.\n\n' +
        'Turn the negative powers back into fractions: $3x^{-\\frac{1}{2}} = \\frac{3}{\\sqrt{x}}$ and $-8x^{-3} = -\\frac{8}{x^{3}}$. So the derivative is $\\frac{3}{\\sqrt{x}} - \\frac{8}{x^{3}}$.',
      conclusion: 'Writing both terms as powers lets the power rule work, and it gives $\\frac{3}{\\sqrt{x}} - \\frac{8}{x^{3}}$.',
      whyWrong: [
        'This lowers the power $-2$ to $-1$ (moving towards zero). Subtracting 1 from $-2$ gives $-3$, so the second term is $-\\frac{8}{x^{3}}$.',
        'This multiplies $6$ by $\\frac{1}{2}$ but forgets to reduce the power of $\\sqrt{x} = x^{\\frac{1}{2}}$ to $x^{-\\frac{1}{2}}$.',
        'This differentiates the **bottom** of $\\frac{4}{x^{2}}$ on its own, giving $\\frac{4}{2x} = \\frac{2}{x}$. You must first write the term as $4x^{-2}$ and then use the power rule.',
        null,
      ],
      keyIdea: 'Before differentiating roots or fractions, rewrite them as powers: $\\sqrt{x} = x^{\\frac{1}{2}}$ and $\\frac{1}{x^{n}} = x^{-n}$. Then use the power rule. Lowering a negative power by 1 moves it away from 0, so $-2$ becomes $-3$.',
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
      asking: 'What is the gradient formula for $x^{2}$ multiplied by $e^{x}$?',
      solution:
        '$y$ is two functions of $x$ **multiplied** together, so we use the **product rule**. If $y = uv$, then $\\frac{dy}{dx} = u\'v + uv\'$, where $u\'$ and $v\'$ are the derivatives of $u$ and $v$.\n\n' +
        'Name the two parts: $u = x^{2}$ and $v = e^{x}$. Their derivatives are $u\' = 2x$ (the power rule) and $v\' = e^{x}$ ($e^{x}$ is its own derivative).\n\n' +
        'Substitute into the rule: $\\frac{dy}{dx} = 2x \\times e^{x} + x^{2} \\times e^{x} = 2xe^{x} + x^{2}e^{x}$.\n\n' +
        'The options are factorised, so take out what both terms share. Both contain $x$ and $e^{x}$, so $2xe^{x} + x^{2}e^{x} = xe^{x}(2 + x)$. That is the same as $xe^{x}(x + 2)$.',
      conclusion: 'The product rule gives $2xe^{x} + x^{2}e^{x}$, and factorising that gives $xe^{x}(x + 2)$.',
      whyWrong: [
        'This just multiplies the two derivatives together ($2x \\times e^{x}$). The derivative of a product is **not** the product of the derivatives.',
        'This differentiates only the $e^{x}$ part and leaves $x^{2}$ alone. Both factors depend on $x$, so you need both terms of the product rule.',
        null,
        'This uses a minus sign between the two terms, mixing the product rule up with the quotient rule. The product rule has a **plus**: $u\'v + uv\'$.',
      ],
      keyIdea: 'For two functions of $x$ multiplied: name them $u$ and $v$, find $u\'$ and $v\'$, then write $u\'v + uv\'$. If the options are factorised, take out whatever both terms share.',
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
      asking: 'What is the gradient formula for this fraction with $x$ on top and bottom?',
      solution:
        '$y$ is one function of $x$ **divided** by another, so we use the **quotient rule**. If $y = \\frac{u}{v}$, then $\\frac{dy}{dx} = \\frac{u\'v - uv\'}{v^{2}}$, where $u\'$ and $v\'$ are the derivatives of $u$ and $v$.\n\n' +
        'Name the parts: $u = 2x + 1$ (the top) and $v = x - 3$ (the bottom). Their derivatives are $u\' = 2$ and $v\' = 1$.\n\n' +
        'Substitute into the rule, keeping brackets around $u$ and $v$:\n\n$$\\frac{dy}{dx} = \\frac{2(x - 3) - (2x + 1) \\times 1}{(x - 3)^{2}}$$\n\n' +
        'Multiply out the top. $2(x - 3) = 2x - 6$. The minus sign reaches both terms of the next bracket, so $-(2x + 1) = -2x - 1$. The top is now $2x - 6 - 2x - 1$.\n\n' +
        'The $2x$ and $-2x$ cancel, and $-6 - 1 = -7$. So $\\frac{dy}{dx} = -\\frac{7}{(x - 3)^{2}}$.',
      conclusion: 'The $x$ terms on top cancel, leaving $-7$ over the squared bottom, so the answer is $-\\frac{7}{(x - 3)^{2}}$.',
      whyWrong: [
        null,
        'This puts the numerator the wrong way round ($uv\' - u\'v$). The order matters in the quotient rule: it is $u\'v - uv\'$.',
        'This divides the derivative of the top by the derivative of the bottom ($2 \\div 1 = 2$). The derivative of a quotient is not the quotient of the derivatives.',
        'This makes a sign slip when expanding $-(2x + 1)$, writing $-2x + 1$ instead of $-2x - 1$, so the top becomes $-5$.',
      ],
      keyIdea: 'For one function divided by another: name the top $u$ and the bottom $v$, then use $\\frac{u\'v - uv\'}{v^{2}}$. The rule\'s top starts with $u\'$, so the order matters. Bracket $u$ so the minus sign reaches every term.',
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
      asking: 'What is the gradient formula for a bracket raised to the power 5?',
      solution:
        'This is a bracket raised to a power, with more than just $x$ inside. That makes it a function inside a function, so use the **chain rule**: differentiate the outside, then multiply by the derivative of the inside.\n\n' +
        'Call the inside $u = 3x^{2} - 1$, so that $y = u^{5}$. For the outside, use the power rule and leave $u$ alone: $u^{5}$ becomes $5u^{4}$, which is $5(3x^{2} - 1)^{4}$.\n\n' +
        'For the inside, differentiate $3x^{2} - 1$. The $3x^{2}$ gives $6x$, and the plain number $-1$ gives 0. So the derivative of the inside is $6x$.\n\n' +
        'Multiply them: $5(3x^{2} - 1)^{4} \\times 6x$. The numbers combine as $5 \\times 6x = 30x$, giving $30x(3x^{2} - 1)^{4}$.',
      conclusion: 'Outside times inside is $5(3x^{2} - 1)^{4} \\times 6x$, which simplifies to $30x(3x^{2} - 1)^{4}$.',
      whyWrong: [
        'This differentiates the outside but forgets to multiply by the derivative of the inside ($6x$). That missing factor is the whole point of the chain rule.',
        null,
        'This replaces the inside by its derivative and keeps it in the bracket. The bracket should stay as $3x^{2} - 1$; its derivative $6x$ is multiplied on the outside.',
        'This multiplies by $5$ and by $6x$ correctly but forgets to reduce the power from $5$ to $4$.',
      ],
      keyIdea: 'For $(\\text{inside})^{n}$: write $n(\\text{inside})^{n-1}$, then multiply by the derivative of the inside. The bracket\'s contents stay the same, and only its power drops.',
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
      asking: 'How steep is the curve $y = \\ln(x^{2} + 1)$ at $x = 1$?',
      solution:
        '$\\ln$ is the natural logarithm. $\\ln$ of a whole expression is a function inside a function, so use the **chain rule**. For $\\ln(u)$, the derivative is $\\frac{1}{u} \\times u\'$, where $u$ is the inside and $u\'$ is the derivative of the inside.\n\n' +
        'Here the inside is $u = x^{2} + 1$, and its derivative is $u\' = 2x$.\n\n' +
        'Put these into the rule: $f\'(x) = \\frac{1}{x^{2} + 1} \\times 2x = \\frac{2x}{x^{2} + 1}$.\n\n' +
        'Substitute $x = 1$: $f\'(1) = \\frac{2 \\times 1}{1^{2} + 1} = \\frac{2}{2} = 1$.',
      conclusion: 'The gradient formula $\\frac{2x}{x^{2} + 1}$ equals $\\frac{2}{2}$ at $x = 1$, which is $1$.',
      whyWrong: [
        'This uses $\\frac{1}{x^{2} + 1}$ and forgets to multiply by the derivative of the inside, $2x$.',
        'This substitutes into $f(x)$ instead of $f\'(x)$: $f(1) = \\ln 2$. That is the value of the function, not its gradient.',
        'This uses only the derivative of the inside ($2x$, which is $2$ at $x = 1$) and forgets to divide by the inside $x^{2} + 1$.',
        null,
      ],
      keyIdea: 'For $\\ln(\\text{inside})$, the derivative is the derivative of the inside divided by the inside. Build that fraction first, then substitute your value of $x$.',
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
      asking: 'How steep is the curve $y = \\cos(4x)$ at $x = \\frac{\\pi}{8}$?',
      solution:
        '$\\cos(4x)$ has $4x$ inside the cosine, so use the **chain rule**: differentiate the outside, then multiply by the derivative of the inside.\n\n' +
        'Outside: the derivative of $\\cos$ is $-\\sin$, and the inside stays the same. That gives $-\\sin(4x)$.\n\n' +
        'Inside: the derivative of $4x$ is 4. Multiplying gives $f\'(x) = -4\\sin(4x)$.\n\n' +
        'Put in $x = \\frac{\\pi}{8}$. Work out the inside first: $4 \\times \\frac{\\pi}{8} = \\frac{\\pi}{2}$, which is an angle of $90^{\\circ}$.\n\n' +
        'Since $\\sin\\left(\\frac{\\pi}{2}\\right) = 1$, we get $f\'\\left(\\frac{\\pi}{8}\\right) = -4 \\times 1 = -4$.',
      conclusion: 'The chain rule gives $-4\\sin(4x)$, and at this point the sine equals 1, so the gradient is $-4$.',
      whyWrong: [
        'This forgets the minus sign: the derivative of $\\cos$ is $-\\sin$, not $\\sin$.',
        'This forgets the chain-rule factor $4$ from the inside $4x$, giving $-\\sin\\left(\\frac{\\pi}{2}\\right) = -1$.',
        null,
        'This substitutes into $f(x)$ instead of $f\'(x)$: $\\cos\\left(\\frac{\\pi}{2}\\right) = 0$.',
      ],
      keyIdea: 'The derivative of $\\cos(kx)$ is $-k\\sin(kx)$, and of $\\sin(kx)$ is $k\\cos(kx)$. Differentiate first, then work out the angle inside the bracket before finding its trig value.',
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
      asking: 'What do we get if we differentiate this function twice and then put in $x = 1$?',
      solution:
        '$f\'\'(1)$ means: differentiate $f(x)$ twice, then put in $x = 1$.\n\n' +
        'First derivative, using the power rule (multiply by the power, then lower the power by 1): $f\'(x) = 3x^{2} - 12x + 4$.\n\n' +
        'Differentiate each term again. $3x^{2}$ becomes $6x$, $-12x$ becomes $-12$, and the plain number 4 disappears. So $f\'\'(x) = 6x - 12$.\n\n' +
        'Substitute $x = 1$: $f\'\'(1) = 6 \\times 1 - 12 = 6 - 12 = -6$.',
      conclusion: 'The second derivative is $6x - 12$, and at $x = 1$ that equals $-6$.',
      whyWrong: [
        null,
        'This is $f\'(1) = 3 - 12 + 4 = -5$, the **first** derivative at $x = 1$. You need to differentiate a second time.',
        'This is $f(1) = 1 - 6 + 4 = -1$, the value of the function itself.',
        'This keeps the constant $4$ when differentiating $f\'(x)$, giving $f\'\'(x) = 6x - 8$. The constant should become $0$.',
      ],
      keyIdea: 'For $f\'\'(a)$: differentiate, differentiate again, and only then substitute $a$. A plain number left in $f\'(x)$ becomes 0 on the second pass.',
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
      asking: 'How steep is the curve at the point where $x = 0$?',
      solution:
        'The gradient of a curve at a point is the value of $\\frac{dy}{dx}$ there. So we differentiate first.\n\n' +
        '$e^{-2x}$ has $-2x$ in the power, so use the **chain rule**: $e^{u}$ stays as $e^{u}$, where $u$ is the power, and we multiply by the derivative of the power. The derivative of $-2x$ is $-2$.\n\n' +
        'The 5 in front stays, so $\\frac{dy}{dx} = 5 \\times (-2) \\times e^{-2x} = -10e^{-2x}$.\n\n' +
        'Put in $x = 0$. The power becomes $-2 \\times 0 = 0$, and $e^{0} = 1$, since any non-zero number to the power 0 is 1. So the gradient is $-10 \\times 1 = -10$.',
      conclusion: 'The derivative is $-10e^{-2x}$, and $e^{0} = 1$ at this point, so the gradient is $-10$.',
      whyWrong: [
        'This is the $y$-value at $x = 0$ ($5e^{0} = 5$), not the gradient.',
        null,
        'This loses the minus sign from the power $-2x$. The chain-rule factor is $-2$, so the gradient is negative (the curve is decreasing).',
        'This uses the chain-rule factor $-2$ but drops the constant multiple $5$ in front.',
      ],
      keyIdea: 'The derivative of $e^{kx}$ is $ke^{kx}$: the number multiplying $x$ comes down in front, with its sign. For a gradient at a point, substitute after differentiating, and use $e^{0} = 1$.',
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
      asking: 'What is the gradient formula for the logarithm of $3x$?',
      solution:
        '$\\ln(3x)$ has $3x$ inside the logarithm, so use the **chain rule**. For $\\ln(u)$, the derivative is $\\frac{1}{u} \\times u\'$, where $u\'$ is the derivative of the inside.\n\n' +
        'Here $u = 3x$ and $u\' = 3$. So $f\'(x) = \\frac{1}{3x} \\times 3 = \\frac{3}{3x}$.\n\n' +
        'The 3s on top and bottom cancel, leaving $\\frac{1}{x}$.',
      conclusion: 'A log law agrees: $\\ln(3x) = \\ln 3 + \\ln x$, and the constant $\\ln 3$ differentiates to 0, leaving $\\frac{1}{x}$.',
      whyWrong: [
        'This multiplies by the inside derivative $3$ but forgets to divide by the whole inside $3x$ (it divides by $x$ only).',
        'This uses $\\frac{1}{\\text{inside}}$ but forgets to multiply by the derivative of the inside, which is $3$.',
        null,
        'This uses the false log law $\\ln(3x) = \\ln 3 \\times \\ln x$. The correct law is $\\ln(3x) = \\ln 3 + \\ln x$, and the constant $\\ln 3$ differentiates to $0$.',
      ],
      keyIdea: 'For $\\ln(kx)$, the derivative is $\\frac{1}{x}$, whatever the number $k$ is. The reason: $\\ln(kx) = \\ln k + \\ln x$, and $\\ln k$ is a constant, so it gives 0.',
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
      asking: 'What is the gradient formula for $\\ln x$ divided by $x$?',
      solution:
        '$y$ is one function of $x$ **divided** by another, so we use the **quotient rule**. If $y = \\frac{u}{v}$, then $\\frac{dy}{dx} = \\frac{u\'v - uv\'}{v^{2}}$, where $u\'$ and $v\'$ are the derivatives of $u$ and $v$.\n\n' +
        'Name the parts: $u = \\ln x$ (the top, where $\\ln$ is the natural logarithm) and $v = x$ (the bottom). Their derivatives are $u\' = \\frac{1}{x}$ and $v\' = 1$.\n\n' +
        'Substitute into the rule:\n\n$$\\frac{dy}{dx} = \\frac{\\frac{1}{x} \\times x - \\ln x \\times 1}{x^{2}}$$\n\n' +
        'Simplify the top. $\\frac{1}{x} \\times x = 1$, because the $x$ cancels. And $\\ln x \\times 1 = \\ln x$. The bottom stays as $x^{2}$, so this gives $\\frac{1 - \\ln x}{x^{2}}$.',
      conclusion: 'The quotient rule\'s top simplifies to $1 - \\ln x$ and its bottom is $x^{2}$, so the answer is $\\frac{1 - \\ln x}{x^{2}}$.',
      whyWrong: [
        null,
        'This writes the numerator the wrong way round ($uv\' - u\'v$), which flips the sign of the answer.',
        'This divides the derivative of the top ($\\frac{1}{x}$) by the derivative of the bottom ($1$). That is not the quotient rule.',
        'This gets the numerator right but forgets to **square** the denominator: the bottom should be $v^{2} = x^{2}$.',
      ],
      keyIdea: 'To use the quotient rule, write $u$, $v$, $u\'$ and $v\'$ in a list first, then substitute into $\\frac{u\'v - uv\'}{v^{2}}$. Always square the bottom, and start the top with $u\'$.',
    },
    check: {
      optionValues: [(1 - Math.log(2)) / 4, (Math.log(2) - 1) / 4, 1 / 2, (1 - Math.log(2)) / 2],
      compute: () => D((x) => Math.log(x) / x, 2),
    },
  },
  // ------------------------------------------------------------------ recall
  {
    id: 'differentiation-021',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: 'What is $\\frac{d}{dx}(7)$?',
    options: ['$0$', '$7$', '$1$', '$7x$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How fast does the number 7 change as $x$ changes?',
      solution:
        '$\\frac{d}{dx}$ means: how fast does this change as $x$ changes?\n\n' +
        'The number 7 is a **constant**: it stays at 7 whatever $x$ is. Its graph is a flat horizontal line, and a flat line has gradient 0.',
      conclusion: 'A constant never changes, so its derivative is $0$.',
      whyWrong: [
        null,
        'This keeps the constant unchanged. A derivative measures change, and a constant does not change.',
        'This is the derivative of $x$, not of a constant.',
        'This **integrates** $7$. Differentiating a constant gives $0$.',
      ],
      keyIdea: 'Any term with no $x$ in it, like $7$, $-2$ or $\\pi$, has derivative 0. Spot these first in a long expression and drop them.',
    },
    check: {
      optionValues: [0, 7, 1, 14],
      compute: () => D(() => 7, 2),
    },
  },
  {
    id: 'differentiation-022',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: "What does $f'(a)$ tell you about the curve $y = f(x)$?",
    options: ['The slope (gradient) of the tangent at $x = a$', 'The height of the curve at $x = a$', 'The area under the curve up to $x = a$', 'Where the curve crosses the $x$-axis'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the derivative measure at one point on a curve?',
      solution:
        'A **tangent** is a straight line that just touches a curve at one point and runs in the same direction as the curve there. Its **slope**, also called its **gradient**, says how steep it is.\n\n' +
        '$f\'(x)$ gives the steepness of the curve at each $x$. For example, $f(x) = x^{2}$ has $f\'(x) = 2x$, so the steepness at $x = 3$ is 6.\n\n' +
        'Putting in $x = a$ gives the steepness of the curve at that one point. That is the same as the steepness of the tangent drawn there.',
      conclusion: '$f\'(a)$ measures steepness at one point, so it tells you the slope (gradient) of the tangent at $x = a$.',
      whyWrong: [
        null,
        'The height of the curve is $f(a)$, not $f\'(a)$.',
        'Area under a curve comes from **integrating**, not differentiating.',
        'Crossings of the $x$-axis come from solving $f(x) = 0$. The derivative is about steepness.',
      ],
      keyIdea: 'Keep the two apart. $f(a)$ is the height of the curve at $x = a$. $f\'(a)$ is its steepness there: positive means rising, negative means falling, 0 means flat.',
    },
  },
  {
    id: 'differentiation-023',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    stem: 'Which of these is $\\frac{d}{dx}\\left(x^{n}\\right)$?',
    options: ['$nx^{n-1}$', '$x^{n-1}$', '$nx^{n}$', '$\\frac{x^{n+1}}{n+1}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the general rule for differentiating a power of $x$?',
      solution:
        'The rule has two moves: bring the power down to multiply at the front, then lower the power by 1. See it with a number first: $x^{3}$ has power 3, so 3 comes to the front and the new power is 2, giving $3x^{2}$.\n\n' +
        'Now do the same with the letter $n$ as the power. $n$ comes to the front and the new power is $n - 1$, giving $nx^{n-1}$.',
      conclusion: 'Bringing the power down and lowering it by 1 gives $nx^{n-1}$.',
      whyWrong: [
        null,
        'This reduces the power but forgets to multiply by the old power $n$.',
        'This multiplies by the power but forgets to reduce the power by $1$.',
        'This is the **integral** of $x^{n}$. Integrating raises the power; differentiating lowers it.',
      ],
      keyIdea: 'For any power of $x$: multiply by the power, then lower the power by 1. Test a rule on $x^{2}$: it should give $2x$. Integrating goes the other way, raising the power and then dividing.',
    },
    check: {
      // the options at n = 4, x = 3
      optionValues: [4 * 27, 27, 4 * 81, 243 / 5],
      compute: () => D((x) => x ** 4, 3),
    },
  },
];
