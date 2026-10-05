import type { StaticQuestion } from '../../../types';

// Numerical integration used ONLY by the answer checks (independent of the hand-worked algebra).
// Composite Simpson's rule with n (even) strips: very accurate for the smooth integrands used here.
const integrate = (f: (x: number) => number, a: number, b: number, n = 2000): number => {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
};

/** Root of g on [lo, hi] by bisection (g must change sign on the interval). */
const bisect = (g: (x: number) => number, lo: number, hi: number): number => {
  let a = lo;
  let b = hi;
  const ga = g(a);
  for (let i = 0; i < 100; i++) {
    const mid = (a + b) / 2;
    if (Math.sign(g(mid)) === Math.sign(ga)) a = mid;
    else b = mid;
  }
  return (a + b) / 2;
};

/** F(b) - F(a) for an antiderivative F: used to give each expression option a comparable number. */
const diff = (F: (x: number) => number, a: number, b: number): number => F(b) - F(a);

const E = Math.E;
const ln = Math.log;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'integration-001',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'Find $\\int x^{4}\\,dx$.',
    options: ['$4x^{3} + C$', '$\\frac{x^{5}}{5} + C$', '$x^{5} + C$', '$\\frac{x^{5}}{4} + C$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use the **reverse power rule**: add 1 to the power, then divide by the **new** power.\n\n' +
        '$$\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1} + C$$\n\n' +
        'Here $n = 4$, so the new power is $4 + 1 = 5$:\n\n' +
        '$$\\int x^{4}\\,dx = \\frac{x^{5}}{5} + C$$\n\n' +
        'Check by differentiating: $\\frac{d}{dx}\\left(\\frac{x^{5}}{5}\\right) = \\frac{5x^{4}}{5} = x^{4}$. Correct.\n\n' +
        'The $+C$ is there because any constant differentiates to $0$, so $\\frac{x^{5}}{5} + 7$, $\\frac{x^{5}}{5} - 2$, ... all have derivative $x^{4}$.',
      whyWrong: [
        'This is the **derivative** of $x^{4}$ (multiply by the power, reduce the power by 1). Integration goes the other way: raise the power, then divide.',
        null,
        'This raises the power to 5 but forgets to divide by 5. Differentiating $x^{5}$ gives $5x^{4}$, not $x^{4}$.',
        'This divides by the **old** power 4 instead of the new power 5. Differentiating $\\frac{x^{5}}{4}$ gives $\\frac{5}{4}x^{4}$, not $x^{4}$.',
      ],
      keyIdea: 'Reverse power rule: add one to the power, divide by the new power, and add $+C$.',
    },
    check: {
      optionValues: [
        diff((x) => 4 * x ** 3, 1, 2),
        diff((x) => x ** 5 / 5, 1, 2),
        diff((x) => x ** 5, 1, 2),
        diff((x) => x ** 5 / 4, 1, 2),
      ],
      compute: () => integrate((x) => x ** 4, 1, 2),
    },
  },
  {
    id: 'integration-002',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'Find $\\int \\left(e^{x} + \\frac{3}{x}\\right)dx$ for $x \\ne 0$.',
    options: [
      '$e^{x} - \\frac{3}{x^{2}} + C$',
      '$\\frac{e^{x+1}}{x+1} + 3\\ln|x| + C$',
      '$e^{x} + 3\\ln|x| + C$',
      '$e^{x} + \\ln|3x| + C$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Integrate term by term using two standard results.\n\n' +
        '- $e^{x}$ is its own derivative, so it is also its own integral: $\\int e^{x}\\,dx = e^{x}$.\n' +
        '- $\\frac{d}{dx}\\ln|x| = \\frac{1}{x}$, so $\\int \\frac{1}{x}\\,dx = \\ln|x|$. A constant multiple stays in front: $\\int \\frac{3}{x}\\,dx = 3\\ln|x|$.\n\n' +
        'Together (one $+C$ covers both terms):\n\n' +
        '$$\\int \\left(e^{x} + \\frac{3}{x}\\right)dx = e^{x} + 3\\ln|x| + C$$\n\n' +
        'Check: $\\frac{d}{dx}\\left(e^{x} + 3\\ln|x|\\right) = e^{x} + \\frac{3}{x}$. Correct.',
      whyWrong: [
        'This **differentiates** $\\frac{3}{x} = 3x^{-1}$ (giving $-3x^{-2}$) instead of integrating it. The integral of $\\frac{1}{x}$ is $\\ln|x|$.',
        'This applies the reverse power rule to $e^{x}$ as if $x$ were a power. The power rule is only for $x^{n}$; $e^{x}$ simply integrates to $e^{x}$.',
        null,
        'This moves the 3 inside the logarithm. But $\\ln|3x| = \\ln 3 + \\ln|x|$, whose derivative is only $\\frac{1}{x}$; you need $3\\ln|x|$ to get $\\frac{3}{x}$.',
      ],
      keyIdea: '$\\int e^{x}\\,dx = e^{x} + C$ and $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$; constant multiples stay in front.',
    },
    check: {
      optionValues: [
        diff((x) => E ** x - 3 / x ** 2, 1, 2),
        diff((x) => E ** (x + 1) / (x + 1) + 3 * ln(x), 1, 2),
        diff((x) => E ** x + 3 * ln(x), 1, 2),
        diff((x) => E ** x + ln(3 * x), 1, 2),
      ],
      compute: () => integrate((x) => E ** x + 3 / x, 1, 2),
    },
  },
  {
    id: 'integration-003',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'Find $\\int \\left(3\\cos x + 2\\sin x\\right)dx$.',
    options: [
      '$3\\sin x - 2\\cos x + C$',
      '$3\\sin x + 2\\cos x + C$',
      '$-3\\sin x + 2\\cos x + C$',
      '$-3\\sin x - 2\\cos x + C$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Start from the derivatives you know and run them backwards:\n\n' +
        '- $\\frac{d}{dx}(\\sin x) = \\cos x$, so $\\int \\cos x\\,dx = \\sin x$.\n' +
        '- $\\frac{d}{dx}(\\cos x) = -\\sin x$, so $\\int \\sin x\\,dx = -\\cos x$.\n\n' +
        'Integrate term by term, keeping the constants in front:\n\n' +
        '$$\\int \\left(3\\cos x + 2\\sin x\\right)dx = 3\\sin x + 2(-\\cos x) + C = 3\\sin x - 2\\cos x + C$$\n\n' +
        'Check: $\\frac{d}{dx}(3\\sin x - 2\\cos x) = 3\\cos x - 2(-\\sin x) = 3\\cos x + 2\\sin x$. Correct.',
      whyWrong: [
        null,
        'This uses $\\int \\sin x\\,dx = \\cos x$, missing the minus sign. Since $\\frac{d}{dx}(\\cos x) = -\\sin x$, you need $-\\cos x$ to get back $+\\sin x$.',
        'This is the **derivative** of $3\\cos x + 2\\sin x$, not its integral. Differentiating and integrating go in opposite directions.',
        'This gets the sine term right but uses $\\int \\cos x\\,dx = -\\sin x$. The minus sign belongs only to the integral of $\\sin x$; the integral of $\\cos x$ is $+\\sin x$.',
      ],
      keyIdea: '$\\int \\cos x\\,dx = \\sin x + C$ and $\\int \\sin x\\,dx = -\\cos x + C$: the minus sign goes with the integral of sine.',
    },
    check: {
      optionValues: [
        diff((x) => 3 * Math.sin(x) - 2 * Math.cos(x), 0, Math.PI / 2),
        diff((x) => 3 * Math.sin(x) + 2 * Math.cos(x), 0, Math.PI / 2),
        diff((x) => -3 * Math.sin(x) + 2 * Math.cos(x), 0, Math.PI / 2),
        diff((x) => -3 * Math.sin(x) - 2 * Math.cos(x), 0, Math.PI / 2),
      ],
      compute: () => integrate((x) => 3 * Math.cos(x) + 2 * Math.sin(x), 0, Math.PI / 2),
    },
  },
  {
    id: 'integration-004',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'Evaluate $\\int_{1}^{3} (2x + 1)\\,dx$.',
    options: ['$12$', '$4$', '$-10$', '$10$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: integrate.** $\\int (2x + 1)\\,dx = x^{2} + x$ (no $+C$ needed for a definite integral, because it cancels).\n\n' +
        '**Step 2: substitute the limits, top minus bottom.** Let $F(x) = x^{2} + x$.\n\n' +
        '- $F(3) = 9 + 3 = 12$\n' +
        '- $F(1) = 1 + 1 = 2$\n\n' +
        '$$\\int_{1}^{3} (2x + 1)\\,dx = F(3) - F(1) = 12 - 2 = 10$$',
      whyWrong: [
        'This is only $F(3)$: it forgets to subtract the value at the lower limit, $F(1) = 2$.',
        'This substitutes the limits into the original function $2x + 1$ (giving $7 - 3 = 4$) without integrating first.',
        'This subtracts the wrong way round, $F(1) - F(3)$. It is always upper limit minus lower limit.',
        null,
      ],
      keyIdea: 'A definite integral is $F(b) - F(a)$: integrate first, then substitute the top limit minus the bottom limit.',
    },
    check: { optionValues: [12, 4, -10, 10], compute: () => integrate((x) => 2 * x + 1, 1, 3) },
  },
  {
    id: 'integration-005',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'Find the area of the region between the curve $y = 3x^{2}$, the $x$-axis and the lines $x = 0$ and $x = 2$.',
    options: ['$12$', '$8$', '$24$', '$-8$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The curve $y = 3x^{2}$ is never below the $x$-axis, so the area is simply the definite integral.\n\n' +
        '**Step 1: integrate.** $\\int 3x^{2}\\,dx = \\frac{3x^{3}}{3} = x^{3}$.\n\n' +
        '**Step 2: substitute the limits.**\n\n' +
        '$$\\int_{0}^{2} 3x^{2}\\,dx = \\left[x^{3}\\right]_{0}^{2} = 2^{3} = 8$$\n\n' +
        'So the area is $8$ square units.',
      whyWrong: [
        'This is $f(2) = 3 \\times 2^{2} = 12$, the **height** of the curve at $x = 2$, not the area under it. (Dividing by the old power, $\\frac{3x^{3}}{2}$, also lands on $12$.)',
        null,
        'This raises the power to get $3x^{3}$ but forgets to divide by the new power 3: $3 \\times 2^{3} = 24$.',
        'This subtracts the wrong way round, $F(0) - F(2)$. Do upper limit minus lower limit; a region above the $x$-axis has a positive area.',
      ],
      keyIdea: 'For a curve above the $x$-axis, the area from $x = a$ to $x = b$ is $\\int_{a}^{b} f(x)\\,dx$.',
    },
    check: { optionValues: [12, 8, 24, -8], compute: () => integrate((x) => 3 * x ** 2, 0, 2) },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'integration-006',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Find $\\int \\left(3\\sqrt{x} + \\frac{2}{x^{2}}\\right)dx$ for $x > 0$.',
    options: [
      '$2x^{\\frac{3}{2}} - \\frac{2}{x} + C$',
      '$\\frac{9}{2}x^{\\frac{3}{2}} - \\frac{2}{x} + C$',
      '$2x^{\\frac{3}{2}} + \\frac{2}{x} + C$',
      '$2x^{\\frac{3}{2}} - \\frac{4}{x^{3}} + C$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: rewrite every term as a power of $x$.** $3\\sqrt{x} = 3x^{\\frac{1}{2}}$ and $\\frac{2}{x^{2}} = 2x^{-2}$.\n\n' +
        '**Step 2: reverse power rule on each term** (add 1 to the power, divide by the new power).\n\n' +
        '- $3x^{\\frac{1}{2}}$: new power $\\frac{1}{2} + 1 = \\frac{3}{2}$, so $\\frac{3x^{\\frac{3}{2}}}{\\frac{3}{2}} = 3 \\times \\frac{2}{3}x^{\\frac{3}{2}} = 2x^{\\frac{3}{2}}$.\n' +
        '- $2x^{-2}$: new power $-2 + 1 = -1$, so $\\frac{2x^{-1}}{-1} = -2x^{-1} = -\\frac{2}{x}$.\n\n' +
        '$$\\int \\left(3\\sqrt{x} + \\frac{2}{x^{2}}\\right)dx = 2x^{\\frac{3}{2}} - \\frac{2}{x} + C$$\n\n' +
        'Check: $\\frac{d}{dx}\\left(2x^{\\frac{3}{2}} - 2x^{-1}\\right) = 3x^{\\frac{1}{2}} + 2x^{-2}$. Correct.',
      whyWrong: [
        null,
        'This **multiplies** by the new power $\\frac{3}{2}$ instead of dividing by it: $3 \\times \\frac{3}{2} = \\frac{9}{2}$. Dividing by $\\frac{3}{2}$ means multiplying by $\\frac{2}{3}$, giving $2$.',
        'This loses the minus sign: $x^{-2}$ integrates to $\\frac{x^{-1}}{-1} = -x^{-1}$, so the term is $-\\frac{2}{x}$, not $+\\frac{2}{x}$.',
        'This **differentiates** $2x^{-2}$ (giving $-4x^{-3}$) instead of integrating it. Integrating raises the power from $-2$ to $-1$.',
      ],
      keyIdea: 'Rewrite roots and fractions as powers of $x$ first, then add one to the power and divide by the new power (watch the signs of negative powers).',
    },
    check: {
      optionValues: [
        diff((x) => 2 * x ** 1.5 - 2 / x, 1, 4),
        diff((x) => 4.5 * x ** 1.5 - 2 / x, 1, 4),
        diff((x) => 2 * x ** 1.5 + 2 / x, 1, 4),
        diff((x) => 2 * x ** 1.5 - 4 / x ** 3, 1, 4),
      ],
      compute: () => integrate((x) => 3 * Math.sqrt(x) + 2 / x ** 2, 1, 4),
    },
  },
  {
    id: 'integration-007',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Find $\\int (2x + 1)^{4}\\,dx$.',
    options: [
      '$\\frac{(2x + 1)^{5}}{5} + C$',
      '$\\frac{2(2x + 1)^{5}}{5} + C$',
      '$\\frac{(2x + 1)^{5}}{10} + C$',
      '$8(2x + 1)^{3} + C$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'The bracket is a **linear** expression $ax + b$ with $a = 2$, so use\n\n' +
        '$$\\int (ax + b)^{n}\\,dx = \\frac{(ax + b)^{n+1}}{a(n+1)} + C$$\n\n' +
        '**Step 1:** treat the bracket like $x$: raise the power from 4 to 5 and divide by 5, giving $\\frac{(2x + 1)^{5}}{5}$.\n\n' +
        '**Step 2:** divide by $a = 2$, the number in front of $x$ (this undoes the chain rule): $\\frac{(2x + 1)^{5}}{5 \\times 2} = \\frac{(2x + 1)^{5}}{10}$.\n\n' +
        'Answer: $\\frac{(2x + 1)^{5}}{10} + C$.\n\n' +
        'Check: $\\frac{d}{dx}\\left(\\frac{(2x + 1)^{5}}{10}\\right) = \\frac{5(2x + 1)^{4} \\times 2}{10} = (2x + 1)^{4}$. Correct.',
      whyWrong: [
        'This forgets to divide by 2, the coefficient of $x$ inside the bracket. Differentiating $\\frac{(2x + 1)^{5}}{5}$ gives $2(2x + 1)^{4}$, which is twice too big.',
        'This **multiplies** by 2 (as the chain rule does when differentiating) instead of dividing by 2. Its derivative is $4(2x + 1)^{4}$.',
        null,
        'This is the **derivative** of $(2x + 1)^{4}$ (chain rule: $4(2x + 1)^{3} \\times 2$), not its integral.',
      ],
      keyIdea: 'For a function of $ax + b$, integrate as if the bracket were $x$, then divide by $a$.',
    },
    check: {
      optionValues: [
        diff((x) => (2 * x + 1) ** 5 / 5, 0, 1),
        diff((x) => (2 * (2 * x + 1) ** 5) / 5, 0, 1),
        diff((x) => (2 * x + 1) ** 5 / 10, 0, 1),
        diff((x) => 8 * (2 * x + 1) ** 3, 0, 1),
      ],
      compute: () => integrate((x) => (2 * x + 1) ** 4, 0, 1),
    },
  },
  {
    id: 'integration-008',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Evaluate $\\int_{0}^{\\ln 3} e^{2x}\\,dx$.',
    options: ['$8$', '$16$', '$\\frac{9}{2}$', '$4$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: integrate.** For $e^{kx}$, divide by $k$: $\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x}$.\n\n' +
        '**Step 2: upper limit.** $e^{2\\ln 3} = e^{\\ln 9} = 9$ (using $2\\ln 3 = \\ln 3^{2}$), so $\\frac{1}{2}e^{2\\ln 3} = \\frac{9}{2}$.\n\n' +
        '**Step 3: lower limit.** $e^{0} = 1$, so $\\frac{1}{2}e^{0} = \\frac{1}{2}$.\n\n' +
        '**Step 4: subtract.**\n\n' +
        '$$\\int_{0}^{\\ln 3} e^{2x}\\,dx = \\frac{9}{2} - \\frac{1}{2} = 4$$',
      whyWrong: [
        'This forgets to divide by 2 when integrating $e^{2x}$: $\\left[e^{2x}\\right]_{0}^{\\ln 3} = 9 - 1 = 8$.',
        'This **multiplies** by 2 (the chain rule for differentiating) instead of dividing: $\\left[2e^{2x}\\right]_{0}^{\\ln 3} = 18 - 2 = 16$.',
        'This treats the lower limit as contributing nothing because $x = 0$ there. But $e^{0} = 1$, not $0$, so you must subtract $\\frac{1}{2}$.',
        null,
      ],
      keyIdea: '$\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C$, and remember $e^{0} = 1$ when substituting a lower limit of $0$.',
    },
    check: { optionValues: [8, 16, 9 / 2, 4], compute: () => integrate((x) => E ** (2 * x), 0, ln(3)) },
  },
  {
    id: 'integration-009',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Find the area of the region enclosed by the curve $y = x^{2} - 4x$ and the $x$-axis.',
    options: ['$-\\frac{32}{3}$', '$\\frac{32}{3}$', '$\\frac{128}{3}$', '$32$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: find where the curve meets the $x$-axis.** $x^{2} - 4x = x(x - 4) = 0$, so $x = 0$ and $x = 4$.\n\n' +
        '**Step 2: is the region above or below the axis?** Test $x = 1$: $y = 1 - 4 = -3 < 0$, so the region is **below** the axis.\n\n' +
        '**Step 3: integrate between the roots.**\n\n' +
        '$$\\int_{0}^{4} (x^{2} - 4x)\\,dx = \\left[\\frac{x^{3}}{3} - 2x^{2}\\right]_{0}^{4} = \\left(\\frac{64}{3} - 32\\right) - (0) = -\\frac{32}{3}$$\n\n' +
        '**Step 4:** the integral is negative because the region is below the $x$-axis. An area is always positive, so take the size: the area is $\\frac{32}{3}$ square units.',
      whyWrong: [
        'This is the value of the integral, which is negative because the region lies **below** the $x$-axis. An area cannot be negative, so take its absolute value.',
        null,
        'This forgets to divide $4x$ by its new power 2, using $\\frac{x^{3}}{3} - 4x^{2}$: then $\\frac{64}{3} - 64 = -\\frac{128}{3}$, whose size is $\\frac{128}{3}$.',
        'This forgets to divide $x^{2}$ by its new power 3, using $x^{3} - 2x^{2}$: then $64 - 32 = 32$.',
      ],
      keyIdea: 'An integral over a region below the $x$-axis comes out negative; the area is its absolute value.',
    },
    check: {
      optionValues: [-32 / 3, 32 / 3, 128 / 3, 32],
      compute: () => Math.abs(integrate((x) => x ** 2 - 4 * x, 0, 4)),
    },
  },
  {
    id: 'integration-010',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Evaluate $\\int_{0}^{\\pi} \\sin x\\,dx$.',
    options: ['$-2$', '$0$', '$2$', '$1$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: integrate.** $\\int \\sin x\\,dx = -\\cos x$.\n\n' +
        '**Step 2: substitute, top minus bottom.**\n\n' +
        '$$\\left[-\\cos x\\right]_{0}^{\\pi} = (-\\cos \\pi) - (-\\cos 0)$$\n\n' +
        '**Step 3: use the values** $\\cos \\pi = -1$ and $\\cos 0 = 1$:\n\n' +
        '$$(-(-1)) - (-1) = 1 + 1 = 2$$\n\n' +
        'This makes sense: $\\sin x \\ge 0$ for $0 \\le x \\le \\pi$, so the answer must be positive (it is the area of one arch of the sine curve).',
      whyWrong: [
        'This uses $\\int \\sin x\\,dx = \\cos x$ (no minus sign): $\\cos \\pi - \\cos 0 = -1 - 1 = -2$. A negative answer is impossible here because $\\sin x$ is never negative on $[0, \\pi]$.',
        'This takes $\\cos \\pi = 1$; in fact $\\cos \\pi = -1$. With the wrong value, $-1 + 1 = 0$.',
        null,
        'This uses only the upper limit, $-\\cos \\pi = 1$, assuming the lower limit gives $0$ because $x = 0$. But $-\\cos 0 = -1$, which must be subtracted.',
      ],
      keyIdea: '$\\int \\sin x\\,dx = -\\cos x$; evaluate carefully using $\\cos 0 = 1$ and $\\cos \\pi = -1$.',
    },
    check: { optionValues: [-2, 0, 2, 1], compute: () => integrate(Math.sin, 0, Math.PI) },
  },
  {
    id: 'integration-011',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Find $\\int \\frac{1}{2x + 5}\\,dx$.',
    options: [
      '$\\frac{1}{2}\\ln|2x + 5| + C$',
      '$\\ln|2x + 5| + C$',
      '$2\\ln|2x + 5| + C$',
      '$-\\frac{2}{(2x + 5)^{2}} + C$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1:** treat the bracket like $x$. Since $\\int \\frac{1}{x}\\,dx = \\ln|x|$, start with $\\ln|2x + 5|$.\n\n' +
        '**Step 2:** check by differentiating (chain rule): $\\frac{d}{dx}\\ln|2x + 5| = \\frac{2}{2x + 5}$. That is **twice** what we want.\n\n' +
        '**Step 3:** so divide by 2, the coefficient of $x$:\n\n' +
        '$$\\int \\frac{1}{2x + 5}\\,dx = \\frac{1}{2}\\ln|2x + 5| + C$$\n\n' +
        'General rule: $\\int \\frac{1}{ax + b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C$.',
      whyWrong: [
        null,
        'This forgets to divide by 2, the coefficient of $x$. Its derivative is $\\frac{2}{2x + 5}$, twice the integrand.',
        'This **multiplies** by 2 (as when differentiating with the chain rule) instead of dividing. Its derivative is $\\frac{4}{2x + 5}$.',
        'This **differentiates** $(2x + 5)^{-1}$ (giving $-2(2x + 5)^{-2}$) instead of integrating. The power rule cannot be used for power $-1$; that case gives a logarithm.',
      ],
      keyIdea: '$\\int \\frac{1}{ax + b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C$: a logarithm, divided by the coefficient of $x$.',
    },
    check: {
      optionValues: [
        diff((x) => 0.5 * ln(2 * x + 5), 0, 1),
        diff((x) => ln(2 * x + 5), 0, 1),
        diff((x) => 2 * ln(2 * x + 5), 0, 1),
        diff((x) => -2 / (2 * x + 5) ** 2, 0, 1),
      ],
      compute: () => integrate((x) => 1 / (2 * x + 5), 0, 1),
    },
  },
  {
    id: 'integration-012',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Evaluate $\\int_{0}^{\\frac{\\pi}{6}} \\cos 3x\\,dx$.',
    options: ['$1$', '$3$', '$-\\frac{1}{3}$', '$\\frac{1}{3}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: integrate.** $\\int \\cos x\\,dx = \\sin x$, and the inside is $3x$, so divide by 3: $\\int \\cos 3x\\,dx = \\frac{1}{3}\\sin 3x$.\n\n' +
        '**Step 2: upper limit.** $x = \\frac{\\pi}{6}$ gives $3x = \\frac{\\pi}{2}$, and $\\sin \\frac{\\pi}{2} = 1$, so the value is $\\frac{1}{3}$.\n\n' +
        '**Step 3: lower limit.** $x = 0$ gives $\\frac{1}{3}\\sin 0$, which is zero.\n\n' +
        '$$\\int_{0}^{\\frac{\\pi}{6}} \\cos 3x\\,dx = \\frac{1}{3}\\sin\\frac{\\pi}{2} - \\frac{1}{3}\\sin 0 = \\frac{1}{3}$$',
      whyWrong: [
        'This forgets to divide by 3: $\\left[\\sin 3x\\right]_{0}^{\\frac{\\pi}{6}} = 1$. Differentiating $\\sin 3x$ gives $3\\cos 3x$, three times too big.',
        'This **multiplies** by 3 (the chain rule for differentiating) instead of dividing: $\\left[3\\sin 3x\\right]_{0}^{\\frac{\\pi}{6}} = 3$.',
        'This uses $\\int \\cos x\\,dx = -\\sin x$. The minus sign belongs to the integral of $\\sin x$, not of $\\cos x$.',
        null,
      ],
      keyIdea: '$\\int \\cos kx\\,dx = \\frac{1}{k}\\sin kx + C$: divide by the number multiplying $x$.',
    },
    check: {
      optionValues: [1, 3, -1 / 3, 1 / 3],
      compute: () => integrate((x) => Math.cos(3 * x), 0, Math.PI / 6),
    },
  },
  {
    id: 'integration-013',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: "A function $f$ has $f'(x) = 6x^{2} - 2x$ and $f(1) = 5$. What is $f(2)$?",
    options: ['$12$', '$16$', '$17$', '$20$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: integrate $f\'(x)$ to get $f(x)$, including $+C$.**\n\n' +
        '$$f(x) = \\int (6x^{2} - 2x)\\,dx = 2x^{3} - x^{2} + C$$\n\n' +
        '**Step 2: use $f(1) = 5$ to find $C$.** $f(1) = 2 - 1 + C = 1 + C = 5$, so $C = 4$.\n\n' +
        'So $f(x) = 2x^{3} - x^{2} + 4$.\n\n' +
        '**Step 3: substitute $x = 2$.** $f(2) = 2 \\times 8 - 4 + 4 = 16$.',
      whyWrong: [
        'This leaves out the constant of integration (takes $C = 0$): $2 \\times 8 - 4 = 12$. The condition $f(1) = 5$ is there to find $C$.',
        null,
        'This uses the given value 5 directly as $C$. But $C$ must satisfy $f(1) = 5$, which gives $1 + C = 5$, so $C = 4$, not 5.',
        "This substitutes $x = 2$ into $f'(x)$: $24 - 4 = 20$. That is the gradient at $x = 2$, not the value of $f$.",
      ],
      keyIdea: 'Integrate with $+C$, then use the given point to find $C$ before substituting.',
    },
    check: {
      optionValues: [12, 16, 17, 20],
      compute: () => 5 + integrate((x) => 6 * x ** 2 - 2 * x, 1, 2),
    },
  },
  {
    id: 'integration-014',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Find the exact area of the region between the curve $y = \\frac{2}{x}$, the $x$-axis and the lines $x = 1$ and $x = 4$.',
    options: ['$2\\ln 2$', '$2\\ln 3$', '$4\\ln 2$', '$\\frac{15}{8}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'For $x > 0$ the curve is above the $x$-axis, so the area is the definite integral.\n\n' +
        '**Step 1: integrate.** $\\int \\frac{2}{x}\\,dx = 2\\ln|x|$.\n\n' +
        '**Step 2: substitute the limits.**\n\n' +
        '$$\\int_{1}^{4} \\frac{2}{x}\\,dx = 2\\ln 4 - 2\\ln 1 = 2\\ln 4$$\n\n' +
        'since $\\ln 1 = 0$.\n\n' +
        '**Step 3: simplify.** $\\ln 4 = \\ln 2^{2} = 2\\ln 2$, so $2\\ln 4 = 4\\ln 2$ (about $2.77$ square units).',
      whyWrong: [
        'This drops the factor 2 from $\\frac{2}{x}$: $\\ln 4 = 2\\ln 2$. Constant multiples stay in front, so the answer is $2\\ln 4$.',
        'This works out $2\\ln(4 - 1)$, subtracting the limits **inside** the logarithm. The rule is $F(4) - F(1) = 2\\ln 4 - 2\\ln 1$, which is not the same as $2\\ln(4 - 1)$.',
        null,
        'This **differentiates** $2x^{-1}$ to $-2x^{-2}$ and evaluates $\\left[-\\frac{2}{x^{2}}\\right]_{1}^{4} = -\\frac{1}{8} + 2 = \\frac{15}{8}$. The integral of $\\frac{1}{x}$ is $\\ln|x|$.',
      ],
      keyIdea: '$\\int \\frac{k}{x}\\,dx = k\\ln|x| + C$; use $\\ln 1 = 0$ and the log laws to simplify.',
    },
    check: {
      optionValues: [2 * ln(2), 2 * ln(3), 4 * ln(2), 15 / 8],
      compute: () => integrate((x) => 2 / x, 1, 4),
    },
  },
  {
    id: 'integration-015',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Evaluate $\\int_{1}^{2} \\frac{x^{3} + 2x}{x}\\,dx$.',
    options: ['$\\frac{13}{3}$', '$\\frac{9}{2}$', '$\\frac{16}{3}$', '$\\frac{20}{3}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: simplify first.** There is no "quotient rule" for integration, so divide each term on top by $x$:\n\n' +
        '$$\\frac{x^{3} + 2x}{x} = \\frac{x^{3}}{x} + \\frac{2x}{x} = x^{2} + 2$$\n\n' +
        '**Step 2: integrate.** $\\int (x^{2} + 2)\\,dx = \\frac{x^{3}}{3} + 2x$.\n\n' +
        '**Step 3: substitute the limits.**\n\n' +
        '- Upper: $\\frac{8}{3} + 4 = \\frac{20}{3}$\n' +
        '- Lower: $\\frac{1}{3} + 2 = \\frac{7}{3}$\n\n' +
        '$$\\int_{1}^{2} \\frac{x^{3} + 2x}{x}\\,dx = \\frac{20}{3} - \\frac{7}{3} = \\frac{13}{3}$$',
      whyWrong: [
        null,
        'This integrates the top and the bottom separately and divides the results: $\\frac{27}{4} \\div \\frac{3}{2} = \\frac{9}{2}$. The integral of a fraction is not the fraction of the integrals; simplify first.',
        'This divides only the $x^{3}$ by $x$ and leaves $2x$ unchanged, integrating $x^{2} + 2x$ to get $\\frac{16}{3}$. Every term on top must be divided by $x$.',
        'This is only the upper-limit value $\\frac{20}{3}$; it forgets to subtract the lower-limit value $\\frac{7}{3}$.',
      ],
      keyIdea: 'Before integrating a fraction with a single power of $x$ underneath, split it into separate powers of $x$.',
    },
    check: {
      optionValues: [13 / 3, 9 / 2, 16 / 3, 20 / 3],
      compute: () => integrate((x) => (x ** 3 + 2 * x) / x, 1, 2),
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'integration-016',
    subtopic: 'integration',
    difficulty: 'challenge',
    stem: 'Find the **total** area of the regions between the curve $y = x^{2} - 1$ and the $x$-axis for $0 \\le x \\le 2$.',
    options: ['$\\frac{2}{3}$', '$\\frac{4}{3}$', '$\\frac{8}{3}$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: find where the curve crosses the axis.** $x^{2} - 1 = 0$ gives $x = 1$ (and $x = -1$, outside the interval). For $0 \\le x < 1$ the curve is **below** the axis (e.g. $y(0) = -1$); for $1 < x \\le 2$ it is above.\n\n' +
        '**Step 2: integrate each part separately.** Let $F(x) = \\frac{x^{3}}{3} - x$, so $F(0) = 0$, $F(1) = -\\frac{2}{3}$, $F(2) = \\frac{8}{3} - 2 = \\frac{2}{3}$.\n\n' +
        '- $\\int_{0}^{1 } (x^{2} - 1)\\,dx = F(1) - F(0) = -\\frac{2}{3}$, so this area is $\\frac{2}{3}$.\n' +
        '- $\\int_{1}^{2} (x^{2} - 1)\\,dx = F(2) - F(1) = \\frac{2}{3} + \\frac{2}{3} = \\frac{4}{3}$.\n\n' +
        '**Step 3: add the sizes of the areas.** $\\frac{2}{3} + \\frac{4}{3} = 2$ square units.',
      whyWrong: [
        'This is $\\int_{0}^{2} (x^{2} - 1)\\,dx$ in one go. The negative part below the axis cancels some of the positive part, so it gives the **net** value, not the total area.',
        'This is only the area of the part **above** the axis (from $x = 1$ to $x = 2$); it misses the region below the axis between $x = 0$ and $x = 1$.',
        'This forgets to integrate the constant $-1$ (it should become $-x$), working out only $\\left[\\frac{x^{3}}{3}\\right]_{0}^{2} = \\frac{8}{3}$.',
        null,
      ],
      keyIdea: 'When a curve crosses the $x$-axis, split the integral at the crossing point and add the absolute values of the pieces.',
    },
    check: {
      optionValues: [2 / 3, 4 / 3, 8 / 3, 2],
      compute: () => {
        const f = (x: number) => x ** 2 - 1;
        const root = bisect(f, 0, 2);
        return Math.abs(integrate(f, 0, root)) + Math.abs(integrate(f, root, 2));
      },
    },
  },
  {
    id: 'integration-017',
    subtopic: 'integration',
    difficulty: 'challenge',
    stem: 'Given that $k > 0$ and $\\int_{0}^{k} (2x + 3)\\,dx = 10$, find $k$.',
    options: ['$5$', '$2$', '$\\frac{7}{2}$', '$\\sqrt{10}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: integrate.** $\\int (2x + 3)\\,dx = x^{2} + 3x$.\n\n' +
        '**Step 2: substitute the limits.** $\\left[x^{2} + 3x\\right]_{0}^{k} = k^{2} + 3k$ (the lower limit gives zero).\n\n' +
        '**Step 3: set equal to 10 and solve.** $k^{2} + 3k = 10$, so $k^{2} + 3k - 10 = 0$, which factorises as $(k + 5)(k - 2) = 0$.\n\n' +
        'So $k = 2$ or $k = -5$. Since $k > 0$, $k = 2$.\n\n' +
        'Check: $2^{2} + 3 \\times 2 = 4 + 6 = 10$. Correct.',
      whyWrong: [
        'This drops the minus sign from the rejected root $k = -5$ (equivalently, it factorises with the signs swapped). Check: $5^{2} + 3 \\times 5 = 40$, not $10$.',
        null,
        'This sets the integrand equal to 10 ($2k + 3 = 10$) instead of integrating it first.',
        'This integrates $2x$ to $x^{2}$ but loses the $3x$ from the constant 3, solving $k^{2} = 10$.',
      ],
      keyIdea: 'An unknown limit turns a definite integral into an equation: integrate, substitute the limits, then solve.',
    },
    check: {
      optionValues: [5, 2, 7 / 2, Math.sqrt(10)],
      compute: () => bisect((k) => integrate((x) => 2 * x + 3, 0, k) - 10, 0.001, 10),
    },
  },
  {
    id: 'integration-018',
    subtopic: 'integration',
    difficulty: 'challenge',
    stem: 'Given that $\\int_{1}^{3} f(x)\\,dx = 7$ and $\\int_{3}^{1 } g(x)\\,dx = 2$, find $\\int_{1}^{3} \\left(2f(x) - 3g(x) + 1\\right)dx$.',
    options: ['$10$', '$21$', '$22$', '$20$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: fix the limits on $g$.** Swapping the limits changes the sign: $\\int_{1}^{3} g(x)\\,dx = -\\int_{3}^{1 } g(x)\\,dx = -2$.\n\n' +
        '**Step 2: split the integral term by term** (constants come out in front):\n\n' +
        '$$\\int_{1}^{3} \\left(2f - 3g + 1\\right)dx = 2\\int_{1}^{3} f\\,dx - 3\\int_{1}^{3} g\\,dx + \\int_{1}^{3} 1\\,dx$$\n\n' +
        '**Step 3: the constant term.** $\\int_{1}^{3} 1\\,dx = \\left[x\\right]_{1}^{3} = 3 - 1 = 2$ (the width of the interval).\n\n' +
        '**Step 4: substitute.** $2(7) - 3(-2) + 2 = 14 + 6 + 2 = 22$.',
      whyWrong: [
        'This ignores the reversed limits and uses $\\int_{1}^{3} g\\,dx = 2$: $14 - 6 + 2 = 10$. Swapping the limits of an integral changes its sign.',
        'This treats $\\int_{1}^{3} 1\\,dx$ as $1$. Integrating 1 gives $x$, so the value is the width $3 - 1 = 2$.',
        null,
        'This drops the $+1$ term completely, as if a constant integrates to $0$ (that happens when you differentiate, not integrate). It should contribute $2$.',
      ],
      keyIdea: 'Definite integrals split term by term, swapping the limits flips the sign, and $\\int_{a}^{b} 1\\,dx = b - a$.',
    },
    check: {
      optionValues: [10, 21, 22, 20],
      compute: () => {
        const intF13 = 7;
        const intG31 = 2;
        const intG13 = -intG31; // reversing the limits flips the sign
        return 2 * intF13 - 3 * intG13 + integrate(() => 1, 1, 3);
      },
    },
  },
  {
    id: 'integration-019',
    subtopic: 'integration',
    difficulty: 'challenge',
    stem: 'Given that $k > 0$ and $\\int_{0}^{k} e^{2x}\\,dx = 4$, find the exact value of $k$.',
    options: ['$\\ln 3$', '$\\frac{1}{2}\\ln 8$', '$\\frac{1}{2}\\ln 5$', '$\\ln 9$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: integrate.** $\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x}$.\n\n' +
        '**Step 2: substitute the limits** (remember $e^{0} = 1$):\n\n' +
        '$$\\left[\\frac{1}{2}e^{2x}\\right]_{0}^{k} = \\frac{1}{2}e^{2k} - \\frac{1}{2} = \\frac{e^{2k} - 1}{2}$$\n\n' +
        '**Step 3: solve.** $\\frac{e^{2k} - 1}{2} = 4$, so $e^{2k} - 1 = 8$ and $e^{2k} = 9$.\n\n' +
        '**Step 4: take natural logs.** $2k = \\ln 9$, so $k = \\frac{1}{2}\\ln 9 = \\ln 9^{\\frac{1}{2}} = \\ln 3$.\n\n' +
        'Check: $\\frac{e^{2\\ln 3} - 1}{2} = \\frac{9 - 1}{2} = 4$. Correct.',
      whyWrong: [
        null,
        'This takes $e^{0}$ as $0$, so the lower limit disappears: $\\frac{1}{2}e^{2k} = 4$ gives $e^{2k} = 8$. But $e^{0} = 1$, so $\\frac{1}{2}$ must be subtracted.',
        'This forgets the $\\frac{1}{2}$ when integrating $e^{2x}$: $e^{2k} - 1 = 4$ gives $e^{2k} = 5$.',
        'This finds $e^{2k} = 9$ correctly but then forgets to divide by 2: from $2k = \\ln 9$, $k = \\frac{1}{2}\\ln 9 = \\ln 3$, not $\\ln 9$.',
      ],
      keyIdea: 'Integrate, substitute both limits (with $e^{0} = 1$), then undo the exponential with $\\ln$ and the log laws.',
    },
    check: {
      optionValues: [ln(3), ln(8) / 2, ln(5) / 2, ln(9)],
      compute: () => bisect((k) => integrate((x) => E ** (2 * x), 0, k) - 4, 0.001, 3),
    },
  },
  {
    id: 'integration-020',
    subtopic: 'integration',
    difficulty: 'challenge',
    stem: 'A particle moves along a straight line with velocity $v(t) = 3t^{2} - 12$ metres per second, for $0 \\le t \\le 3$ seconds. What is the **total distance** travelled by the particle?',
    options: ['$9$ m', '$-9$ m', '$7$ m', '$23$ m'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Distance is the area between the velocity graph and the $t$-axis, counting parts below the axis as positive.\n\n' +
        '**Step 1: when does the particle change direction?** $3t^{2} - 12 = 0$ gives $t^{2} = 4$, so $t = 2$. For $0 \\le t < 2$, $v < 0$ (e.g. $v(0) = -12$, moving backwards); for $2 < t \\le 3$, $v > 0$.\n\n' +
        '**Step 2: integrate each part.** Let $s(t) = t^{3} - 12t$, so $s(0) = 0$, $s(2) = 8 - 24 = -16$, $s(3) = 27 - 36 = -9$.\n\n' +
        '- $\\int_{0}^{2} v\\,dt = s(2) - s(0) = -16$: it travels $16$ m backwards.\n' +
        '- $\\int_{2}^{3} v\\,dt = s(3) - s(2) = -9 + 16 = 7$: it travels $7$ m forwards.\n\n' +
        '**Step 3: add the distances.** $16 + 7 = 23$ m.\n\n' +
        '(The **displacement** is $\\int_{0}^{3} v\\,dt = -9$ m, because the forward and backward parts partly cancel.)',
      whyWrong: [
        'This is the size of the **displacement**, $\\left|\\int_{0}^{3} v\\,dt\\right| = 9$: the 16 m backwards and 7 m forwards partly cancel. Distance must add them.',
        'This is the displacement $\\int_{0}^{3} v\\,dt = -9$, computed without splitting where $v$ changes sign. A distance can never be negative.',
        'This counts only the forward part from $t = 2$ to $t = 3$ and ignores the 16 m travelled backwards while $v < 0$.',
        null,
      ],
      keyIdea: 'Parts of a graph below the axis give negative integrals; for total distance (or total area) split at the sign change and add the sizes.',
    },
    check: {
      optionValues: [9, -9, 7, 23],
      compute: () => {
        const v = (t: number) => 3 * t ** 2 - 12;
        const t0 = bisect(v, 0, 3);
        return Math.abs(integrate(v, 0, t0)) + Math.abs(integrate(v, t0, 3));
      },
    },
  },
];
