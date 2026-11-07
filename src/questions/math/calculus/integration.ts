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
      asking: 'Which function has $x^{4}$ as its derivative?',
      solution:
        'The symbol $\\int$ means **integrate**: find the function whose derivative is the expression inside. The $dx$ says that $x$ is the variable.\n\n' +
        'For a power of $x$, use the **reverse power rule**: $\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1} + C$. Add 1 to the power, then divide by the new power. $C$ stands for any constant, because a constant vanishes when you differentiate.\n\n' +
        'Here $n = 4$. Add 1 to the power: $4 + 1 = 5$. Then divide by the new power, 5. That gives $\\frac{x^{5}}{5} + C$.',
      conclusion: 'Differentiating brings the 5 down, and $\\frac{5x^{4}}{5} = x^{4}$, the expression we began with. So the answer is $\\frac{x^{5}}{5} + C$.',
      whyWrong: [
        'This is the **derivative** of $x^{4}$ (multiply by the power, reduce the power by 1). Integration goes the other way: raise the power, then divide.',
        null,
        'This raises the power to 5 but forgets to divide by 5. Differentiating $x^{5}$ gives $5x^{4}$, not $x^{4}$.',
        'This divides by the **old** power 4 instead of the new power 5. Differentiating $\\frac{x^{5}}{4}$ gives $\\frac{5}{4}x^{4}$, not $x^{4}$.',
      ],
      keyIdea: 'For $\\int x^{n}\\,dx$: add 1 to the power, divide by the new power, and write $+ C$. To test any answer, differentiate it: you should get back what was inside the integral.',
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
      asking: 'Which function has $e^{x} + \\frac{3}{x}$ as its derivative?',
      solution:
        'Integrating means finding what differentiates to the expression inside. A sum can be integrated one part at a time.\n\n' +
        '$e^{x}$ differentiates to itself, so it also integrates to itself: $\\int e^{x}\\,dx = e^{x}$.\n\n' +
        'Write $\\frac{3}{x}$ as $3 \\times \\frac{1}{x}$, with the 3 staying in front. The reverse power rule fails for $\\frac{1}{x} = x^{-1}$: adding 1 gives the power 0, and we would divide by 0.\n\n' +
        'Instead, use the standard result $\\int \\frac{1}{x}\\,dx = \\ln|x|$, which works because the derivative of $\\ln x$ is $\\frac{1}{x}$. The bars $|x|$ mean the size of $x$, ignoring its sign. So $\\frac{3}{x}$ integrates to $3\\ln|x|$.\n\n' +
        'Add the two parts and include the constant $C$: $e^{x} + 3\\ln|x| + C$.',
      conclusion: 'Differentiating $e^{x} + 3\\ln|x| + C$ gives back $e^{x}$ and $\\frac{3}{x}$, so that is the integral.',
      whyWrong: [
        'This **differentiates** $\\frac{3}{x} = 3x^{-1}$ (giving $-3x^{-2}$) instead of integrating it. The integral of $\\frac{1}{x}$ is $\\ln|x|$.',
        'This applies the reverse power rule to $e^{x}$ as if $x$ were a power. The power rule is only for $x^{n}$; $e^{x}$ simply integrates to $e^{x}$.',
        null,
        'This moves the 3 inside the logarithm. But $\\ln|3x| = \\ln 3 + \\ln|x|$, whose derivative is only $\\frac{1}{x}$; you need $3\\ln|x|$ to get $\\frac{3}{x}$.',
      ],
      keyIdea: 'Know these two: $\\int e^{x}\\,dx = e^{x} + C$ and $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$. Numbers multiplying a term stay in front. Integrate a sum term by term and add one $C$ at the end.',
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
      asking: 'Which function has $3\\cos x + 2\\sin x$ as its derivative?',
      solution:
        'Integrating is differentiating in reverse. So for each part, ask: what differentiates to this? We do the two parts separately, and the numbers in front stay.\n\n' +
        'For $\\cos x$: the derivative of $\\sin x$ is $\\cos x$, so $\\int \\cos x\\,dx = \\sin x$. With the 3 in front, $3\\cos x$ integrates to $3\\sin x$.\n\n' +
        'For $\\sin x$: the derivative of $\\cos x$ is $-\\sin x$, which has an unwanted minus sign. So we use $-\\cos x$, whose derivative is $\\sin x$. With the 2 in front, $2\\sin x$ integrates to $-2\\cos x$.\n\n' +
        'Add the two parts and include the constant $C$: $3\\sin x - 2\\cos x + C$.',
      conclusion: 'Differentiating $3\\sin x - 2\\cos x + C$ gives back $3\\cos x + 2\\sin x$, so that is the integral.',
      whyWrong: [
        null,
        'This uses $\\int \\sin x\\,dx = \\cos x$, missing the minus sign. Since $\\frac{d}{dx}(\\cos x) = -\\sin x$, you need $-\\cos x$ to get back $+\\sin x$.',
        'This is the **derivative** of $3\\cos x + 2\\sin x$, not its integral. Differentiating and integrating go in opposite directions.',
        'This gets the sine term right but uses $\\int \\cos x\\,dx = -\\sin x$. The minus sign belongs only to the integral of $\\sin x$; the integral of $\\cos x$ is $+\\sin x$.',
      ],
      keyIdea: 'Keep two integrals ready: $\\int \\cos x\\,dx = \\sin x + C$ and $\\int \\sin x\\,dx = -\\cos x + C$. The minus sign belongs to the sine one. Differentiate your result to test it.',
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
      asking: 'What number do you get by integrating $2x + 1$ and using the limits 1 and 3?',
      solution:
        'The numbers on the integral sign are **limits**, with 3 at the top and 1 at the bottom. This is a **definite integral**, which gives a number. We integrate first, then use the limits.\n\n' +
        'Integrate each term: add 1 to the power, then divide by the new power. $2x$ becomes $\\frac{2x^{2}}{2} = x^{2}$. The plain number 1 becomes $x$. So $F(x) = x^{2} + x$, where $F$ is our name for the integrated function.\n\n' +
        'Now put in each limit. The top limit gives $F(3) = 3^{2} + 3 = 12$. The bottom limit gives $F(1) = 1^{2} + 1 = 2$.\n\n' +
        'A definite integral is the top value minus the bottom value: $12 - 2 = 10$.',
      conclusion: 'The top limit gives 12 and the bottom limit gives 2, and subtracting leaves $10$.',
      whyWrong: [
        'This is only $F(3)$: it forgets to subtract the value at the lower limit, $F(1) = 2$.',
        'This substitutes the limits into the original function $2x + 1$ (giving $7 - 3 = 4$) without integrating first.',
        'This subtracts the wrong way round, $F(1) - F(3)$. It is always upper limit minus lower limit.',
        null,
      ],
      keyIdea: 'Definite integral: integrate (no $C$ needed), then calculate $F(\\text{top}) - F(\\text{bottom})$. Work out each value on its own line, and always subtract the bottom value from the top value.',
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
      asking: 'How big is the region under the curve between $x = 0$ and $x = 2$?',
      solution:
        'The area between a curve, the $x$-axis and two vertical lines is a **definite integral**, with the two lines as its limits. Here that is $\\int_{0}^{2} 3x^{2}\\,dx$.\n\n' +
        'Integrate: add 1 to the power, giving $x^{3}$, then divide by the new power. That gives $\\frac{3x^{3}}{3} = x^{3}$. So $F(x) = x^{3}$, where $F$ is our name for the integrated function.\n\n' +
        'Put in the top limit: $F(2) = 2^{3} = 8$. Put in the bottom limit: $F(0) = 0^{3} = 0$. Top minus bottom means taking 0 from 8, which leaves 8.',
      conclusion: 'The curve stays above the axis the whole way, so the area equals the integral\'s value, $8$.',
      whyWrong: [
        'This is $f(2) = 3 \\times 2^{2} = 12$, the **height** of the curve at $x = 2$, not the area under it. (Dividing by the old power, $\\frac{3x^{3}}{2}$, also lands on $12$.)',
        null,
        'This raises the power to get $3x^{3}$ but forgets to divide by the new power 3: $3 \\times 2^{3} = 24$.',
        'This subtracts the wrong way round, $F(0) - F(2)$. Do upper limit minus lower limit; a region above the $x$-axis has a positive area.',
      ],
      keyIdea: 'For the area under a curve between $x = a$ and $x = b$: integrate, then work out $F(b) - F(a)$. If the curve stays above the $x$-axis, that value is the area.',
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
      asking: 'Which function has $3\\sqrt{x} + \\frac{2}{x^{2}}$ as its derivative?',
      solution:
        'The reverse power rule needs powers of $x$, so rewrite first: $\\sqrt{x} = x^{\\frac{1}{2}}$ and $\\frac{1}{x^{2}} = x^{-2}$. So we are integrating $3x^{\\frac{1}{2}} + 2x^{-2}$.\n\n' +
        'First term. Add 1 to the power: $\\frac{1}{2} + 1 = \\frac{3}{2}$. Then divide by the new power, which gives $3x^{\\frac{3}{2}} \\div \\frac{3}{2}$.\n\n' +
        'Dividing by $\\frac{3}{2}$ is the same as multiplying by $\\frac{2}{3}$. So the number in front is $3 \\times \\frac{2}{3} = 2$, and the first term becomes $2x^{\\frac{3}{2}}$.\n\n' +
        'Second term. Add 1 to the power: $-2 + 1 = -1$. Divide by the new power: $\\frac{2x^{-1}}{-1} = -2x^{-1}$. A negative power is a fraction, so this is $-\\frac{2}{x}$.\n\n' +
        'Add the two parts and include the constant $C$: $2x^{\\frac{3}{2}} - \\frac{2}{x} + C$.',
      conclusion: 'Writing each term as a power lets the reverse power rule work, and that gives $2x^{\\frac{3}{2}} - \\frac{2}{x} + C$.',
      whyWrong: [
        null,
        'This **multiplies** by the new power $\\frac{3}{2}$ instead of dividing by it: $3 \\times \\frac{3}{2} = \\frac{9}{2}$. Dividing by $\\frac{3}{2}$ means multiplying by $\\frac{2}{3}$, giving $2$.',
        'This loses the minus sign: $x^{-2}$ integrates to $\\frac{x^{-1}}{-1} = -x^{-1}$, so the term is $-\\frac{2}{x}$, not $+\\frac{2}{x}$.',
        'This **differentiates** $2x^{-2}$ (giving $-4x^{-3}$) instead of integrating it. Integrating raises the power from $-2$ to $-1$.',
      ],
      keyIdea: 'Rewrite roots and fractions as powers first. Then add 1 to the power and divide by the new power. Dividing by a fraction means multiplying by its flip. Turn negative powers back into fractions at the end.',
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
      asking: 'Which function has $(2x + 1)^{4}$ as its derivative?',
      solution:
        'This is a bracket to a power, with just a number times $x$ plus a number inside. Multiplying it out would be slow. Instead, treat the bracket like $x$, then correct the result.\n\n' +
        'Use the reverse power rule on the bracket: raise the power from 4 to 5 and divide by 5. That gives a first guess of $\\frac{(2x + 1)^{5}}{5}$.\n\n' +
        'Test the guess by differentiating it. The chain rule brings the 5 down and multiplies by the derivative of the inside, which is 2. That gives $2(2x + 1)^{4}$, which is twice what we want.\n\n' +
        'So divide the guess by 2: $\\frac{(2x + 1)^{5}}{5 \\times 2}$. Then add the constant $C$ to get $\\frac{(2x + 1)^{5}}{10} + C$.',
      conclusion: 'Differentiating this brings out a 5 and a 2, which cancel the 10 and leave $(2x + 1)^{4}$, so the answer is $\\frac{(2x + 1)^{5}}{10} + C$.',
      whyWrong: [
        'This forgets to divide by 2, the coefficient of $x$ inside the bracket. Differentiating $\\frac{(2x + 1)^{5}}{5}$ gives $2(2x + 1)^{4}$, which is twice too big.',
        'This **multiplies** by 2 (as the chain rule does when differentiating) instead of dividing by 2. Its derivative is $4(2x + 1)^{4}$.',
        null,
        'This is the **derivative** of $(2x + 1)^{4}$ (chain rule: $4(2x + 1)^{3} \\times 2$), not its integral.',
      ],
      keyIdea: '$\\int (ax + b)^{n}\\,dx = \\frac{(ax + b)^{n+1}}{a(n+1)} + C$. Raise the power, divide by the new power, and also divide by $a$, the number multiplying $x$. This only works when the inside is $ax + b$.',
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
      asking: 'What number do you get by integrating $e^{2x}$ and using the limits 0 and $\\ln 3$?',
      solution:
        'First integrate $e^{2x}$. Differentiating $e^{2x}$ gives $2e^{2x}$, because the chain rule brings the 2 down. We only want $e^{2x}$, so we divide by 2. That gives $F(x) = \\frac{1}{2}e^{2x}$, where $F$ is our name for the integrated function.\n\n' +
        'Top limit, $x = \\ln 3$. The power becomes $2\\ln 3$, and $e^{2\\ln 3} = \\left(e^{\\ln 3}\\right)^{2}$. Since $e$ and $\\ln$ undo each other, $e^{\\ln 3} = 3$. So this is $3^{2} = 9$, and $F(\\ln 3) = \\frac{9}{2}$.\n\n' +
        'Bottom limit, $x = 0$. The power becomes 0, and $e^{0} = 1$, so $F(0) = \\frac{1}{2}$. This limit doesn\'t give 0, even though $x$ is 0.\n\n' +
        'Top minus bottom: $\\frac{9}{2} - \\frac{1}{2} = \\frac{8}{2} = 4$.',
      conclusion: 'The top limit gives $\\frac{9}{2}$ and the bottom limit gives $\\frac{1}{2}$, and subtracting leaves $4$.',
      whyWrong: [
        'This forgets to divide by 2 when integrating $e^{2x}$: $\\left[e^{2x}\\right]_{0}^{\\ln 3} = 9 - 1 = 8$.',
        'This **multiplies** by 2 (the chain rule for differentiating) instead of dividing: $\\left[2e^{2x}\\right]_{0}^{\\ln 3} = 18 - 2 = 16$.',
        'This treats the lower limit as contributing nothing because $x = 0$ there. But $e^{0} = 1$, not $0$, so you must subtract $\\frac{1}{2}$.',
        null,
      ],
      keyIdea: '$\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C$: divide by the number multiplying $x$. With limits, use $e^{\\ln a} = a$ and $e^{0} = 1$. A lower limit of 0 does not make the $e$ term 0.',
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
      asking: 'How big is the region trapped between this curve and the $x$-axis?',
      solution:
        'The region lies between the points where the curve meets the $x$-axis, so find those first. Set $y = 0$: $x^{2} - 4x = 0$. Take out $x$: $x(x - 4) = 0$. So $x = 0$ or $x = 4$.\n\n' +
        'The area comes from a **definite integral**, with those two values as its **limits**. Integrate $x^{2} - 4x$: add 1 to each power, then divide by the new power. $x^{2}$ becomes $\\frac{x^{3}}{3}$, and $-4x$ becomes $-\\frac{4x^{2}}{2} = -2x^{2}$. So $F(x) = \\frac{x^{3}}{3} - 2x^{2}$, where $F$ is our name for the integrated function.\n\n' +
        'Top limit: $F(4) = \\frac{64}{3} - 2 \\times 16 = \\frac{64}{3} - \\frac{96}{3} = -\\frac{32}{3}$. Bottom limit: $F(0) = 0$. Top minus bottom makes the integral $-\\frac{32}{3}$.\n\n' +
        'It is negative because the region is below the axis. For example, at $x = 2$ the curve is at $y = 4 - 8 = -4$. An area can\'t be negative, so drop the minus sign: the area is $\\frac{32}{3}$.',
      conclusion: 'The minus sign on the integral only says the region lies below the axis, so the area is its size, $\\frac{32}{3}$.',
      whyWrong: [
        'This is the value of the integral, which is negative because the region lies **below** the $x$-axis. An area cannot be negative, so take its absolute value.',
        null,
        'This forgets to divide $4x$ by its new power 2, using $\\frac{x^{3}}{3} - 4x^{2}$: then $\\frac{64}{3} - 64 = -\\frac{128}{3}$, whose size is $\\frac{128}{3}$.',
        'This forgets to divide $x^{2}$ by its new power 3, using $x^{3} - 2x^{2}$: then $64 - 32 = 32$.',
      ],
      keyIdea: 'Area enclosed by a curve and the $x$-axis: set $y = 0$ to find the limits, integrate, and subtract. If the result is negative, the region is below the axis, so drop the minus sign.',
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
      asking: 'How much area is under one hump of the sine curve, from 0 to $\\pi$?',
      solution:
        'First integrate. The derivative of $\\cos x$ is $-\\sin x$, so the derivative of $-\\cos x$ is $\\sin x$. That means $F(x) = -\\cos x$, where $F$ is our name for the integrated function.\n\n' +
        'Top limit: $F(\\pi) = -\\cos \\pi$. Since $\\cos \\pi = -1$, this is $-(-1) = 1$.\n\n' +
        'Bottom limit: $F(0) = -\\cos 0$. Since $\\cos 0 = 1$, this is $-1$.\n\n' +
        'Top minus bottom: $1 - (-1) = 1 + 1 = 2$.',
      conclusion: 'The top limit gives 1 and the bottom limit gives $-1$, and subtracting gives $2$.',
      whyWrong: [
        'This uses $\\int \\sin x\\,dx = \\cos x$ (no minus sign): $\\cos \\pi - \\cos 0 = -1 - 1 = -2$. A negative answer is impossible here because $\\sin x$ is never negative on $[0, \\pi]$.',
        'This takes $\\cos \\pi = 1$; in fact $\\cos \\pi = -1$. With the wrong value, $-1 + 1 = 0$.',
        null,
        'This uses only the upper limit, $-\\cos \\pi = 1$, assuming the lower limit gives $0$ because $x = 0$. But $-\\cos 0 = -1$, which must be subtracted.',
      ],
      keyIdea: 'For trig integrals use $\\int \\sin x\\,dx = -\\cos x$ and $\\int \\cos x\\,dx = \\sin x$. Substitute each limit in full and put brackets around negative values. $\\sin x$ is positive on $[0, \\pi]$, so a negative result means a slip.',
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
      asking: 'Which function has $\\frac{1}{2x + 5}$ as its derivative?',
      solution:
        'This looks like $\\frac{1}{x}$, which integrates to $\\ln|x|$. So expect a logarithm. The bars mean the size of the number, since a logarithm needs a positive input.\n\n' +
        'Make a first guess by treating the whole bottom like $x$: $\\ln|2x + 5|$.\n\n' +
        'Test the guess by differentiating. The chain rule says $\\ln(\\text{inside})$ gives the derivative of the inside divided by the inside. That is $\\frac{2}{2x + 5}$, which is twice what we want.\n\n' +
        'So divide the guess by 2 and add the constant $C$: $\\frac{1}{2}\\ln|2x + 5| + C$.',
      conclusion: 'Differentiating this gives $\\frac{1}{2} \\times \\frac{2}{2x + 5} = \\frac{1}{2x + 5}$, so the answer is $\\frac{1}{2}\\ln|2x + 5| + C$.',
      whyWrong: [
        null,
        'This forgets to divide by 2, the coefficient of $x$. Its derivative is $\\frac{2}{2x + 5}$, twice the integrand.',
        'This **multiplies** by 2 (as when differentiating with the chain rule) instead of dividing. Its derivative is $\\frac{4}{2x + 5}$.',
        'This **differentiates** $(2x + 5)^{-1}$ (giving $-2(2x + 5)^{-2}$) instead of integrating. The power rule cannot be used for power $-1$; that case gives a logarithm.',
      ],
      keyIdea: '$\\int \\frac{1}{ax + b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C$. Spot a number on top and $ax + b$ on the bottom. Use a logarithm, then divide by $a$, the number multiplying $x$.',
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
      asking: 'What number do you get by integrating $\\cos 3x$ and using the limits 0 and $\\frac{\\pi}{6}$?',
      solution:
        'First integrate. $\\cos$ integrates to $\\sin$, so try $\\sin 3x$. Differentiating $\\sin 3x$ gives $3\\cos 3x$, because the chain rule multiplies by the derivative of the inside, $3x$. That is 3 times too big. So divide by 3: $F(x) = \\frac{1}{3}\\sin 3x$, where $F$ is our name for the integrated function.\n\n' +
        'Top limit, $x = \\frac{\\pi}{6}$. The angle inside is $3 \\times \\frac{\\pi}{6} = \\frac{\\pi}{2}$, and $\\sin\\frac{\\pi}{2} = 1$.\n\n' +
        'Bottom limit, $x = 0$. The angle inside is $3 \\times 0 = 0$, and $\\sin 0 = 0$.\n\n' +
        'Top minus bottom: $\\frac{1}{3} \\times 1 - \\frac{1}{3} \\times 0 = \\frac{1}{3}$.',
      conclusion: 'The sine is 1 at the top limit and 0 at the bottom limit, so only the $\\frac{1}{3}$ in front remains, giving $\\frac{1}{3}$.',
      whyWrong: [
        'This forgets to divide by 3: $\\left[\\sin 3x\\right]_{0}^{\\frac{\\pi}{6}} = 1$. Differentiating $\\sin 3x$ gives $3\\cos 3x$, three times too big.',
        'This **multiplies** by 3 (the chain rule for differentiating) instead of dividing: $\\left[3\\sin 3x\\right]_{0}^{\\frac{\\pi}{6}} = 3$.',
        'This uses $\\int \\cos x\\,dx = -\\sin x$. The minus sign belongs to the integral of $\\sin x$, not of $\\cos x$.',
        null,
      ],
      keyIdea: '$\\int \\cos kx\\,dx = \\frac{1}{k}\\sin kx + C$ and $\\int \\sin kx\\,dx = -\\frac{1}{k}\\cos kx + C$. Divide by $k$, the number multiplying $x$. Work out the angle inside before finding the trig value.',
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
      asking: 'If we know the gradient formula of $f$ and one value of $f$, what is $f(2)$?',
      solution:
        'We know the gradient formula $f\'(x)$ and want $f$ itself. Integrating undoes differentiating, so we integrate $f\'(x)$.\n\n' +
        'Add 1 to each power, then divide by the new power. $6x^{2}$ becomes $\\frac{6x^{3}}{3} = 2x^{3}$. $-2x$ becomes $-\\frac{2x^{2}}{2} = -x^{2}$. So $f(x) = 2x^{3} - x^{2} + C$.\n\n' +
        '$C$ is still unknown, and it isn\'t 0 automatically. Use the fact $f(1) = 5$: $2 \\times 1^{3} - 1^{2} + C = 5$. That is $1 + C = 5$, so $C = 4$.\n\n' +
        'So $f(x) = 2x^{3} - x^{2} + 4$. Now put in $x = 2$: $f(2) = 2 \\times 8 - 4 + 4 = 16 - 4 + 4 = 16$.',
      conclusion: 'With $C = 4$ the full function is $2x^{3} - x^{2} + 4$, and at $x = 2$ this is $16$.',
      whyWrong: [
        'This leaves out the constant of integration (takes $C = 0$): $2 \\times 8 - 4 = 12$. The condition $f(1) = 5$ is there to find $C$.',
        null,
        'This uses the given value 5 directly as $C$. But $C$ must satisfy $f(1) = 5$, which gives $1 + C = 5$, so $C = 4$, not 5.',
        "This substitutes $x = 2$ into $f'(x)$: $24 - 4 = 20$. That is the gradient at $x = 2$, not the value of $f$.",
      ],
      keyIdea: 'Given $f\'(x)$ and one value of $f$: integrate and keep $+ C$. Substitute the known value to find $C$, then write out $f(x)$ in full and substitute the new $x$.',
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
      asking: 'How big is the region under the curve $y = \\frac{2}{x}$ between $x = 1$ and $x = 4$?',
      solution:
        'The area under a curve between two lines is a definite integral, here $\\int_{1}^{4} \\frac{2}{x}\\,dx$. The curve is above the axis here, because $\\frac{2}{x}$ is positive for positive $x$.\n\n' +
        'Integrate. $\\frac{1}{x}$ integrates to $\\ln|x|$, and the 2 stays in front. Since $x$ is positive here, we can drop the bars, so $F(x) = 2\\ln x$.\n\n' +
        'Top limit: $F(4) = 2\\ln 4$. Bottom limit: $F(1) = 2\\ln 1$. And $\\ln 1 = 0$, because $e^{0} = 1$. So the bottom limit gives 0, and the area is $2\\ln 4$.\n\n' +
        'The options use $\\ln 2$, so rewrite. Since $4 = 2^{2}$, the log law $\\ln(a^{b}) = b\\ln a$ gives $\\ln 4 = 2\\ln 2$. So the area is $2 \\times 2\\ln 2 = 4\\ln 2$.',
      conclusion: 'The integral comes to $2\\ln 4$, and writing 4 as $2^{2}$ turns this into $4\\ln 2$.',
      whyWrong: [
        'This drops the factor 2 from $\\frac{2}{x}$: $\\ln 4 = 2\\ln 2$. Constant multiples stay in front, so the answer is $2\\ln 4$.',
        'This works out $2\\ln(4 - 1)$, subtracting the limits **inside** the logarithm. The rule is $F(4) - F(1) = 2\\ln 4 - 2\\ln 1$, which is not the same as $2\\ln(4 - 1)$.',
        null,
        'This **differentiates** $2x^{-1}$ to $-2x^{-2}$ and evaluates $\\left[-\\frac{2}{x^{2}}\\right]_{1}^{4} = -\\frac{1}{8} + 2 = \\frac{15}{8}$. The integral of $\\frac{1}{x}$ is $\\ln|x|$.',
      ],
      keyIdea: 'Integrating $\\frac{k}{x}$ gives $k\\ln x$. Then use $\\ln 1 = 0$ and simplify with $\\ln(a^{b}) = b\\ln a$, writing the number as a power of a smaller one, such as $4 = 2^{2}$.',
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
      asking: 'What number do you get by simplifying this fraction, integrating it, and using the limits 1 and 2?',
      solution:
        'We can\'t integrate the top and bottom of a fraction separately. So first simplify, by dividing each term on top by $x$.\n\n' +
        '$\\frac{x^{3}}{x} = x^{2}$ and $\\frac{2x}{x} = 2$. So the fraction is just $x^{2} + 2$.\n\n' +
        'Integrate: add 1 to the power, then divide by the new power. $x^{2}$ becomes $\\frac{x^{3}}{3}$, and the plain number 2 becomes $2x$. So $F(x) = \\frac{x^{3}}{3} + 2x$, where $F$ is our name for the integrated function.\n\n' +
        'Top limit: $F(2) = \\frac{8}{3} + 4 = \\frac{8}{3} + \\frac{12}{3} = \\frac{20}{3}$.\n\n' +
        'Bottom limit: $F(1) = \\frac{1}{3} + 2 = \\frac{1}{3} + \\frac{6}{3} = \\frac{7}{3}$.\n\n' +
        'Top minus bottom: $\\frac{20}{3} - \\frac{7}{3} = \\frac{13}{3}$.',
      conclusion: 'Once the fraction becomes $x^{2} + 2$, the limits give $\\frac{20}{3}$ and $\\frac{7}{3}$, and subtracting leaves $\\frac{13}{3}$.',
      whyWrong: [
        null,
        'This integrates the top and the bottom separately and divides the results: $\\frac{27}{4} \\div \\frac{3}{2} = \\frac{9}{2}$. The integral of a fraction is not the fraction of the integrals; simplify first.',
        'This divides only the $x^{3}$ by $x$ and leaves $2x$ unchanged, integrating $x^{2} + 2x$ to get $\\frac{16}{3}$. Every term on top must be divided by $x$.',
        'This is only the upper-limit value $\\frac{20}{3}$; it forgets to subtract the lower-limit value $\\frac{7}{3}$.',
      ],
      keyIdea: 'If a fraction has a single term on the bottom, split it before integrating by dividing every term on top by the bottom. Then integrate each power. Never integrate the top and bottom separately.',
    },
    check: {
      optionValues: [13 / 3, 9 / 2, 16 / 3, 20 / 3],
      compute: () => integrate((x) => (x ** 3 + 2 * x) / x, 1, 2),
    },
  },

  {
    id: 'integration-016',
    subtopic: 'integration',
    difficulty: 'exam',
    stem: 'Find the **total** area of the regions between the curve $y = x^{2} - 1$ and the $x$-axis for $0 \\le x \\le 2$.',
    options: ['$\\frac{2}{3}$', '$\\frac{4}{3}$', '$\\frac{8}{3}$', '$2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'If every region counts as positive, how much area is there between this curve and the $x$-axis?',
      solution:
        '**Total** area means every region counts as positive. Area comes from a definite integral, but a single integral would subtract the part below the axis. So we split where the curve crosses the axis.\n\n' +
        'Set $y = 0$: $x^{2} - 1 = 0$, so $x^{2} = 1$. Between 0 and 2, the only solution is $x = 1$. Left of it, $y$ is negative: $y = -1$ at $x = 0$. Right of it, $y$ is positive: $y = 3$ at $x = 2$.\n\n' +
        'Integrate (add 1 to each power, then divide by the new power): $F(x) = \\frac{x^{3}}{3} - x$, where $F$ is our name for the integrated function. The values we need are $F(0) = 0$, then $F(1) = \\frac{1}{3} - 1 = -\\frac{2}{3}$, and $F(2) = \\frac{8}{3} - 2 = \\frac{2}{3}$.\n\n' +
        'Below the axis, from 0 to 1: $F(1) - F(0) = -\\frac{2}{3}$. The minus sign only says the region is below the axis, so its area is $\\frac{2}{3}$.\n\n' +
        'Above the axis, from 1 to 2: $F(2) - F(1) = \\frac{2}{3} - \\left(-\\frac{2}{3}\\right) = \\frac{4}{3}$.\n\n' +
        'Add the two areas: $\\frac{2}{3} + \\frac{4}{3} = \\frac{6}{3} = 2$.',
      conclusion: 'The region below the axis has area $\\frac{2}{3}$ and the region above has area $\\frac{4}{3}$, so the total is $2$.',
      whyWrong: [
        'This is $\\int_{0}^{2} (x^{2} - 1)\\,dx$ in one go. The negative part below the axis cancels some of the positive part, so it gives the **net** value, not the total area.',
        'This is only the area of the part **above** the axis (from $x = 1$ to $x = 2$); it misses the region below the axis between $x = 0$ and $x = 1$.',
        'This forgets to integrate the constant $-1$ (it should become $-x$), working out only $\\left[\\frac{x^{3}}{3}\\right]_{0}^{2} = \\frac{8}{3}$.',
        null,
      ],
      keyIdea: 'For total area, find where the curve crosses the $x$-axis inside the interval and split the integral there. Integrate each piece, drop any minus signs, then add. Without the split, the regions partly cancel.',
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
    difficulty: 'exam',
    stem: 'Given that $k > 0$ and $\\int_{0}^{k} (2x + 3)\\,dx = 10$, find $k$.',
    options: ['$5$', '$2$', '$\\frac{7}{2}$', '$\\sqrt{10}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What top limit $k$ makes this integral equal 10?',
      solution:
        'Integrate $2x + 3$: add 1 to each power, then divide by the new power. $2x$ becomes $\\frac{2x^{2}}{2} = x^{2}$, and the plain number 3 becomes $3x$. So $F(x) = x^{2} + 3x$, where $F$ is our name for the integrated function.\n\n' +
        'Use the limits. The top limit gives $F(k) = k^{2} + 3k$. The bottom limit gives $F(0) = 0$. The integral is top minus bottom, so it is just $k^{2} + 3k$.\n\n' +
        'The integral must equal 10, so $k^{2} + 3k = 10$. Take 10 from both sides to get a quadratic equal to 0: $k^{2} + 3k - 10 = 0$.\n\n' +
        'Factorise. We need two numbers that multiply to $-10$ and add to 3. Those are 5 and $-2$, so $(k + 5)(k - 2) = 0$.\n\n' +
        'A product is 0 only when one bracket is 0, so $k = -5$ or $k = 2$. The question says $k > 0$, so we keep $k = 2$.',
      conclusion: 'Putting it back in gives $2^{2} + 3 \\times 2 = 10$, which matches, so $k$ is $2$.',
      whyWrong: [
        'This drops the minus sign from the rejected root $k = -5$ (equivalently, it factorises with the signs swapped). Check: $5^{2} + 3 \\times 5 = 40$, not $10$.',
        null,
        'This sets the integrand equal to 10 ($2k + 3 = 10$) instead of integrating it first.',
        'This integrates $2x$ to $x^{2}$ but loses the $3x$ from the constant 3, solving $k^{2} = 10$.',
      ],
      keyIdea: 'When the unknown is a limit: integrate, substitute the limits to get an expression in that letter, set it equal to the given value, and solve. Use any condition like $k > 0$ to reject a root.',
    },
    check: {
      optionValues: [5, 2, 7 / 2, Math.sqrt(10)],
      compute: () => bisect((k) => integrate((x) => 2 * x + 3, 0, k) - 10, 0.001, 10),
    },
  },
  // ------------------------------------------------------------------ recall
  {
    id: 'integration-021',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'Integration is the reverse of which operation?',
    options: ['Differentiation', 'Multiplication', 'Substitution', 'Factorising'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which operation does integrating undo?',
      solution:
        'To **differentiate** a function is to find its gradient formula. For example, differentiating $x^{2}$ gives $2x$.\n\n' +
        '**Integrating** goes back the other way. Starting from $2x$, it finds the function that $2x$ came from, which is $x^{2} + C$. So integrating undoes that first step.',
      conclusion: 'Integration takes a derivative back to the function it came from, so it is the reverse of differentiation.',
      whyWrong: [
        null,
        'The reverse of multiplication is division. Integration undoes a derivative.',
        'Substitution means putting a value or expression in place of a variable. It is a step you may use, not the reverse of integration.',
        'Factorising is reversed by expanding brackets. Integration undoes a derivative.',
      ],
      keyIdea: 'You can test any integral with this link: differentiate your result, and you should get back the expression inside the integral sign.',
    },
  },
  {
    id: 'integration-022',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'What is the $C$ in $\\int f(x)\\,dx = F(x) + C$ called?',
    options: ['The constant of integration', 'The limit of integration', 'The gradient', 'The integrand'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the name of the $C$ added after integrating?',
      solution:
        'Differentiating removes any plain number. So $x^{2}$, $x^{2} + 5$ and $x^{2} - 3$ all differentiate to $2x$.\n\n' +
        'So when we integrate $2x$, we can\'t tell which plain number was there. We write $x^{2} + C$, where $C$ stands for any fixed number. It appears because of integrating, so it is called the **constant of integration**.',
      conclusion: '$C$ is a fixed number that appears when integrating, so it is called the constant of integration.',
      whyWrong: [
        null,
        'The limits of integration are the numbers $a$ and $b$ in a definite integral $\\int_{a}^{b}$.',
        'The gradient is the derivative of a function. $C$ does not affect the gradient at all.',
        'The integrand is the function being integrated, here $f(x)$.',
      ],
      keyIdea: 'Write $+ C$ on every integral without limits. Finding its value takes one extra fact, such as $f(1) = 5$. Integrals with limits don\'t need $C$, because it cancels.',
    },
  },
  {
    id: 'integration-023',
    subtopic: 'integration',
    difficulty: 'foundation',
    stem: 'What is the value of $\\int_{a}^{a} f(x)\\,dx$?',
    options: ['$0$', '$f(a)$', '$a$', '$2f(a)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is an integral worth when its top and bottom limits are the same?',
      solution:
        'A definite integral is worked out as top limit minus bottom limit: $\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$, where $F$ is the integrated function.\n\n' +
        'Here both limits are $a$, so we get $F(a) - F(a)$. Anything minus itself is 0.',
      conclusion: 'Thinking of area, a region from $x = a$ to $x = a$ has no width, so the value is $0$.',
      whyWrong: [
        null,
        'This is the height of the curve at $x = a$. An integral gives an area, and here the width is $0$.',
        'This reads off the limit itself. The integral is $F(a) - F(a)$, which cancels to $0$.',
        'This adds the values at the two limits. A definite integral subtracts, and it uses $F$, not $f$.',
      ],
      keyIdea: 'When both limits are the same, the value is 0 with no integrating needed. More generally, use $F(\\text{top}) - F(\\text{bottom})$, so swapping the limits flips the sign.',
    },
    check: {
      // the options for f(x) = x^2 + 1 and a = 2
      optionValues: [0, 5, 2, 10],
      compute: () => integrate((x) => x ** 2 + 1, 2, 2),
    },
  },
];
