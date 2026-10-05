import type { StaticQuestion } from '../../../types';

// Numeric helpers for the answer checks (independent of the worked solutions).
/** Two-sided numerical limit at a: average of the values just left and just right of a. */
const near = (f: (x: number) => number, a: number, h = 1e-6): number => (f(a + h) + f(a - h)) / 2;
/** Value just to the right of a. */
const rightOf = (f: (x: number) => number, a: number): number => f(a + 1e-9);
/** Value just to the left of a. */
const leftOf = (f: (x: number) => number, a: number): number => f(a - 1e-9);
/** Central-difference derivative. */
const deriv = (f: (x: number) => number, a: number, h = 1e-5): number => (f(a + h) - f(a - h)) / (2 * h);

export const questions: StaticQuestion[] = [
  {
    id: 'limits-001',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Find $\\lim_{x \\to 3} (x^2 + 2x - 1)$.',
    options: ['$11$', '$15$', '$14$', '$16$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A polynomial has no gaps, jumps or division by zero, so the limit is found by **direct substitution**: put $x = 3$ into the expression.\n\n' +
        '$$3^2 + 2(3) - 1 = 9 + 6 - 1 = 14$$\n\n' +
        'So $\\lim_{x \\to 3} (x^2 + 2x - 1) = 14$.',
      whyWrong: [
        '$11$ comes from working out $3^2$ as $3 \\times 2 = 6$ instead of $3 \\times 3 = 9$: $6 + 6 - 1 = 11$.',
        '$15$ is $9 + 6$ with the $-1$ forgotten. Every term must be substituted.',
        null,
        '$16$ comes from a sign slip: adding the last term instead of subtracting it ($9 + 6 + 1$).',
      ],
      keyIdea: 'If substituting the value gives an ordinary number (no division by zero), that number is the limit.',
    },
    check: {
      optionValues: [11, 15, 14, 16],
      compute: () => near((x) => x * x + 2 * x - 1, 3),
    },
  },
  {
    id: 'limits-002',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Find $\\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3}$.',
    options: ['$6$', '$0$', '$1$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Substituting $x = 3$ gives $\\frac{9 - 9}{3 - 3} = \\frac{0}{0}$. This is **indeterminate**: it does not mean 0, 1 or "no limit". It means "simplify first".\n\n' +
        'Factorise the top as a difference of two squares: $x^2 - 9 = (x - 3)(x + 3)$.\n\n' +
        '$$\\frac{x^2 - 9}{x - 3} = \\frac{(x - 3)(x + 3)}{x - 3} = x + 3 \\quad (x \\ne 3)$$\n\n' +
        'Near $x = 3$ (but not at it) the expression equals $x + 3$, so the limit is $3 + 3 = 6$.\n\n' +
        'Calculator check: at $x = 3.001$ the expression is $\\frac{0.006001}{0.001} = 6.001$.',
      whyWrong: [
        null,
        'This uses only the top: $3^2 - 9 = 0$, then calls the answer 0. But the bottom is also 0, and $\\frac{0}{0}$ is not 0.',
        'This treats $\\frac{0}{0}$ as 1 (as if $\\frac{a}{a} = 1$ worked for $a = 0$). $\\frac{0}{0}$ is indeterminate: factorise and cancel first.',
        'Getting $\\frac{0}{0}$ does not mean the limit fails to exist. It means the expression needs simplifying; after cancelling $(x - 3)$ the limit is an ordinary number.',
      ],
      keyIdea: 'A $\\frac{0}{0}$ result means "factorise, cancel the common factor, then substitute again".',
    },
    check: {
      optionValues: [6, 0, 1, null],
      compute: () => near((x) => (x * x - 9) / (x - 3), 3),
    },
  },
  {
    id: 'limits-003',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Find $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 5}{6x^2 - x}$.',
    options: ['$2$', '$0$', '$\\infty$', '$\\frac{1}{2}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'For a limit at infinity of a rational function, divide every term by the highest power of $x$ in the denominator, here $x^2$:\n\n' +
        '$$\\frac{3x^2 + 5}{6x^2 - x} = \\frac{3 + \\frac{5}{x^2}}{6 - \\frac{1}{x}}$$\n\n' +
        'As $x \\to \\infty$, $\\frac{5}{x^2} \\to 0$ and $\\frac{1}{x} \\to 0$, leaving\n\n' +
        '$$\\frac{3}{6} = \\frac{1}{2}$$\n\n' +
        'Shortcut: the degrees are equal (both 2), so the limit is the ratio of the leading coefficients, $\\frac{3}{6} = \\frac{1}{2}$.',
      whyWrong: [
        '$2$ is the ratio upside down: $\\frac{6}{3}$. Divide the top coefficient by the bottom coefficient: $\\frac{3}{6}$.',
        '$0$ comes from thinking every term "disappears" as $x$ gets huge. Only terms like $\\frac{5}{x^2}$ and $\\frac{1}{x}$ go to 0 after dividing by $x^2$; the leading terms leave $\\frac{3}{6}$.',
        'Top and bottom both grow without bound, but at the same rate (both are $x^2$ terms), so their ratio settles to a finite number, not $\\infty$.',
        null,
      ],
      keyIdea: 'When the top and bottom have the same degree, the limit as $x \\to \\infty$ is the ratio of the leading coefficients.',
    },
    check: {
      optionValues: [2, 0, null, 0.5],
      compute: () => ((x: number) => (3 * x * x + 5) / (6 * x * x - x))(1e7),
    },
  },
  {
    id: 'limits-004',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'With $x$ measured in **radians**, what is $\\lim_{x \\to 0} \\dfrac{\\sin x}{x}$?',
    options: ['$0$', '$1$', 'The limit does not exist', '$\\frac{\\pi}{180}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Substituting gives $\\frac{\\sin 0}{0} = \\frac{0}{0}$, which is indeterminate, so we cannot just plug in.\n\n' +
        'This is a **standard limit** to know by heart:\n\n' +
        '$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\quad (x \\text{ in radians})$$\n\n' +
        'You can see it on a calculator in radian mode:\n\n' +
        '| $x$ | $\\frac{\\sin x}{x}$ |\n' +
        '| --- | --- |\n' +
        '| $0.1$ | $0.99833$ |\n' +
        '| $0.01$ | $0.99998$ |\n' +
        '| $0.001$ | $0.9999998$ |\n\n' +
        'The values get as close to 1 as we like, so the limit is 1. (For small angles in radians, $\\sin x \\approx x$.)',
      whyWrong: [
        '$0$ comes from looking only at the top ($\\sin 0 = 0$). The bottom is also heading to 0, so the fraction is $\\frac{0}{0}$, which needs more thought.',
        null,
        'A $\\frac{0}{0}$ form does not mean the limit fails to exist. The values of $\\frac{\\sin x}{x}$ clearly settle on one number as $x \\to 0$ from either side.',
        '$\\frac{\\pi}{180}$ is the limit if $x$ is measured in **degrees** (a calculator left in degree mode). The standard result $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ is for radians.',
      ],
      keyIdea: 'In radians, $\\sin x \\approx x$ for small $x$, so $\\frac{\\sin x}{x} \\to 1$ as $x \\to 0$.',
    },
    check: {
      optionValues: [0, 1, null, Math.PI / 180],
      compute: () => near((x) => Math.sin(x) / x, 0),
    },
  },
  {
    id: 'limits-005',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Let $f(x) = \\dfrac{|x|}{x}$ for $x \\ne 0$. What is the **right-hand limit** $\\lim_{x \\to 0^{+}} f(x)$?',
    options: ['$1$', '$-1$', '$0$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$x \\to 0^{+}$ means $x$ approaches 0 **from the right**, through positive values such as $0.1$, $0.01$, $0.001$.\n\n' +
        'For $x > 0$, $|x| = x$, so $f(x) = \\frac{x}{x} = 1$.\n\n' +
        'Every value just to the right of 0 is exactly 1, so $\\lim_{x \\to 0^{+}} f(x) = 1$.\n\n' +
        '(From the left, $x < 0$ gives $|x| = -x$ and $f(x) = -1$, so the left-hand limit is $-1$. Because the two one-sided limits differ, the **two-sided** limit $\\lim_{x \\to 0} f(x)$ does not exist, but the question asks only for the right-hand limit.)',
      whyWrong: [
        null,
        '$-1$ is the **left**-hand limit (values like $x = -0.01$, where $|x| = -x$). The $0^{+}$ means approaching from the right, through positive $x$.',
        '$0$ comes from substituting $x = 0$ as if $\\frac{|0|}{0}$ were 0. The function is not even defined at 0; a limit looks at values **near** 0, which are all 1 on the right.',
        'The **two-sided** limit does not exist because the left and right limits differ, but the question asks only for the right-hand limit, which is 1.',
      ],
      keyIdea: 'A one-sided limit only looks at values on one side of the point; the two-sided limit exists only if both sides agree.',
    },
    check: {
      optionValues: [1, -1, 0, null],
      compute: () => rightOf((x) => Math.abs(x) / x, 0),
    },
  },
  {
    id: 'limits-006',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to 1} \\dfrac{x^2 + 3x - 4}{x^2 - 1}$.',
    options: ['$1$', '$5$', '$\\frac{5}{2}$', '$0$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Substitute $x = 1$: top $= 1 + 3 - 4 = 0$ and bottom $= 1 - 1 = 0$. We get $\\frac{0}{0}$, so factorise.\n\n' +
        '- Top: two numbers that multiply to $-4$ and add to $3$ are $4$ and $-1$, so $x^2 + 3x - 4 = (x + 4)(x - 1)$.\n' +
        '- Bottom: difference of two squares, $x^2 - 1 = (x - 1)(x + 1)$.\n\n' +
        'Cancel the common factor $(x - 1)$ (allowed because $x \\ne 1$ while approaching):\n\n' +
        '$$\\frac{(x + 4)(x - 1)}{(x - 1)(x + 1)} = \\frac{x + 4}{x + 1}$$\n\n' +
        'Now substitute: $\\frac{1 + 4}{1 + 1} = \\frac{5}{2}$.',
      whyWrong: [
        '$1$ is the ratio of the $x^2$ coefficients. That shortcut is for limits as $x \\to \\infty$, not as $x \\to 1$.',
        '$5$ comes from factorising the top correctly but cancelling the whole denominator, as if $x^2 - 1$ were just $(x - 1)$. In fact $x^2 - 1 = (x - 1)(x + 1)$, so a factor $(x + 1) \\to 2$ is left on the bottom.',
        null,
        '$0$ looks only at the numerator, which is 0 at $x = 1$. The denominator is also 0, so $\\frac{0}{0}$ needs factorising, not a quick answer.',
      ],
      keyIdea: 'If $x = a$ gives $\\frac{0}{0}$, then $(x - a)$ is a factor of both top and bottom: factorise, cancel it, and substitute again.',
    },
    check: {
      optionValues: [1, 5, 2.5, 0],
      compute: () => near((x) => (x * x + 3 * x - 4) / (x * x - 1), 1),
    },
  },
  {
    id: 'limits-007',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to 4} \\dfrac{\\sqrt{x} - 2}{x - 4}$.',
    options: ['$\\frac{1}{6}$', '$\\frac{1}{4}$', '$\\frac{1}{2}$', '$0$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Substituting $x = 4$ gives $\\frac{2 - 2}{0} = \\frac{0}{0}$, so simplify first.\n\n' +
        'Treat $x - 4$ as a difference of two squares, $(\\sqrt{x})^2 - 2^2$:\n\n' +
        '$$x - 4 = (\\sqrt{x} - 2)(\\sqrt{x} + 2)$$\n\n' +
        'So\n\n' +
        '$$\\frac{\\sqrt{x} - 2}{x - 4} = \\frac{\\sqrt{x} - 2}{(\\sqrt{x} - 2)(\\sqrt{x} + 2)} = \\frac{1}{\\sqrt{x} + 2}$$\n\n' +
        'Now substitute $x = 4$: $\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{2 + 2} = \\frac{1}{4}$.\n\n' +
        '(Multiplying top and bottom by the conjugate $\\sqrt{x} + 2$ gives the same result.)',
      whyWrong: [
        '$\\frac{1}{6}$ comes from simplifying correctly to $\\frac{1}{\\sqrt{x} + 2}$ but then substituting $4$ instead of $\\sqrt{4} = 2$: $\\frac{1}{4 + 2}$.',
        null,
        '$\\frac{1}{2}$ comes from cancelling to $\\frac{1}{\\sqrt{x}}$ (forgetting the $+2$ in the factor $\\sqrt{x} + 2$) and substituting: $\\frac{1}{\\sqrt{4}} = \\frac{1}{2}$.',
        '$0$ uses only the numerator, $\\sqrt{4} - 2 = 0$. The denominator is also 0, so the form $\\frac{0}{0}$ must be simplified first.',
      ],
      keyIdea: 'With square roots, write $x - 4$ as $(\\sqrt{x} - 2)(\\sqrt{x} + 2)$, or multiply by the conjugate, so the zero factor cancels.',
    },
    check: {
      optionValues: [1 / 6, 1 / 4, 1 / 2, 0],
      compute: () => near((x) => (Math.sqrt(x) - 2) / (x - 4), 4),
    },
  },
  {
    id: 'limits-008',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to \\infty} \\dfrac{4x^2 + 7x}{2x^3 - 1}$.',
    options: ['$2$', '$\\frac{1}{2}$', '$\\infty$', '$0$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The highest power in the denominator is $x^3$. Divide every term by $x^3$:\n\n' +
        '$$\\frac{4x^2 + 7x}{2x^3 - 1} = \\frac{\\frac{4}{x} + \\frac{7}{x^2}}{2 - \\frac{1}{x^3}}$$\n\n' +
        'As $x \\to \\infty$, $\\frac{4}{x}$, $\\frac{7}{x^2}$ and $\\frac{1}{x^3}$ all go to 0. The top goes to 0 while the bottom goes to 2:\n\n' +
        '$$\\lim_{x \\to \\infty} \\frac{4x^2 + 7x}{2x^3 - 1} = \\frac{0}{2} = 0$$\n\n' +
        'Rule of thumb: if the degree of the top (2) is **less** than the degree of the bottom (3), the limit at infinity is 0. Calculator check: at $x = 1000$ the value is about $0.002$.',
      whyWrong: [
        '$2$ is $\\frac{4}{2}$, the ratio of the leading coefficients. That shortcut only works when the top and bottom have the **same** degree; here the bottom has $x^3$ and the top only $x^2$.',
        '$\\frac{1}{2}$ is $\\frac{2}{4}$: the coefficients divided the wrong way round, and it also ignores that the degrees are different.',
        'The top does grow without bound, but the bottom grows faster ($x^3$ beats $x^2$), so the fraction shrinks towards 0 instead of blowing up.',
        null,
      ],
      keyIdea: 'If the bottom has the higher degree, the fraction tends to $0$ as $x \\to \\infty$.',
    },
    check: {
      optionValues: [2, 0.5, null, 0],
      compute: () => ((x: number) => (4 * x * x + 7 * x) / (2 * x ** 3 - 1))(1e8),
    },
  },
  {
    id: 'limits-009',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'With $x$ in radians, find $\\lim_{x \\to 0} \\dfrac{\\sin(3x)}{5x}$.',
    options: ['$\\frac{3}{5}$', '$1$', '$\\frac{5}{3}$', '$0$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Substituting gives $\\frac{0}{0}$. Use the standard limit $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$, which needs the **same** expression inside the sine and underneath.\n\n' +
        'The sine contains $3x$, so we want $3x$ on the bottom. Rewrite:\n\n' +
        '$$\\frac{\\sin(3x)}{5x} = \\frac{3}{5} \\cdot \\frac{\\sin(3x)}{3x}$$\n\n' +
        'As $x \\to 0$, $u = 3x \\to 0$ too, so $\\frac{\\sin(3x)}{3x} \\to 1$. Therefore\n\n' +
        '$$\\lim_{x \\to 0} \\frac{\\sin(3x)}{5x} = \\frac{3}{5} \\times 1 = \\frac{3}{5}$$\n\n' +
        'Quick check: for small $x$, $\\sin(3x) \\approx 3x$, so the fraction is about $\\frac{3x}{5x} = \\frac{3}{5}$.',
      whyWrong: [
        null,
        '$1$ applies $\\frac{\\sin u}{u} \\to 1$ without matching the bottom to the inside of the sine. The bottom is $5x$, not $3x$, so a factor $\\frac{3}{5}$ is left over.',
        '$\\frac{5}{3}$ has the correction factor upside down. Since $\\sin(3x) \\approx 3x$ for small $x$, the fraction is close to $\\frac{3x}{5x}$, not $\\frac{5x}{3x}$.',
        '$0$ looks only at the top, $\\sin 0 = 0$. The bottom is also 0, so this is a $\\frac{0}{0}$ form that needs the standard limit.',
      ],
      keyIdea: 'For small $x$ (radians), $\\sin(kx) \\approx kx$, so $\\frac{\\sin(ax)}{bx} \\to \\frac{a}{b}$ as $x \\to 0$.',
    },
    check: {
      optionValues: [3 / 5, 1, 5 / 3, 0],
      compute: () => near((x) => Math.sin(3 * x) / (5 * x), 0),
    },
  },
  {
    id: 'limits-010',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{n \\to \\infty} \\left(1 + \\frac{2}{n}\\right)^{n}$.',
    options: ['$1$', '$e$', '$e^2$', '$2e$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The standard limit is\n\n' +
        '$$\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^{n} = e \\approx 2.71828$$\n\n' +
        'and more generally\n\n' +
        '$$\\lim_{n \\to \\infty} \\left(1 + \\frac{k}{n}\\right)^{n} = e^{k}$$\n\n' +
        'Why: let $n = 2m$. Then $\\left(1 + \\frac{2}{n}\\right)^{n} = \\left(1 + \\frac{1}{m}\\right)^{2m} = \\left[\\left(1 + \\frac{1}{m}\\right)^{m}\\right]^{2}$. As $m \\to \\infty$ the inside tends to $e$, so the whole thing tends to $e^2$.\n\n' +
        'Here $k = 2$, so the limit is $e^2 \\approx 7.389$. Calculator check: $n = 1000$ gives $1.002^{1000} \\approx 7.374$, already close to $7.389$.',
      whyWrong: [
        '$1$ comes from saying $\\frac{2}{n} \\to 0$, so the bracket is 1 and $1^{n} = 1$. But the power $n$ grows at the same time as the bracket shrinks to 1; this "$1^{\\infty}$" form is indeterminate, and the true value is $e^2$.',
        '$e$ is the limit of $\\left(1 + \\frac{1}{n}\\right)^{n}$. With $\\frac{2}{n}$ inside, the limit becomes $e^{2}$, not $e$.',
        null,
        '$2e$ multiplies by 2 instead of raising to the power 2. The rule is $\\left(1 + \\frac{k}{n}\\right)^{n} \\to e^{k}$, and $e^2 \\approx 7.39$ while $2e \\approx 5.44$.',
      ],
      keyIdea: 'As $n \\to \\infty$, $\\left(1 + \\frac{k}{n}\\right)^{n} \\to e^{k}$.',
    },
    check: {
      optionValues: [1, Math.E, Math.E ** 2, 2 * Math.E],
      compute: () => {
        const n = 1e9;
        return Math.exp(n * Math.log1p(2 / n));
      },
    },
  },
  {
    id: 'limits-011',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Evaluate $\\lim_{h \\to 0} \\dfrac{(3 + h)^2 - 9}{h}$.',
    options: ['$9$', '$6$', '$0$', '$3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Substituting $h = 0$ gives $\\frac{9 - 9}{0} = \\frac{0}{0}$, so expand and simplify first.\n\n' +
        '1. Expand: $(3 + h)^2 = 9 + 6h + h^2$.\n' +
        '2. Subtract 9: $(3 + h)^2 - 9 = 6h + h^2$.\n' +
        '3. Divide by $h$ (allowed, since $h \\ne 0$ while approaching): $\\frac{6h + h^2}{h} = 6 + h$.\n' +
        '4. Let $h \\to 0$: $6 + h \\to 6$.\n\n' +
        "So the limit is 6. This is exactly the first-principles definition of the derivative of $f(x) = x^2$ at $x = 3$, and indeed $f'(x) = 2x$ gives $f'(3) = 6$.",
      whyWrong: [
        '$9$ is $f(3) = 3^2$, the value of the function, not the limit of the difference quotient (which measures the gradient).',
        null,
        '$0$ comes from expanding $(3 + h)^2$ as $9 + h^2$ (forgetting the middle term $6h$): then the quotient is $\\frac{h^2}{h} = h \\to 0$.',
        '$3$ comes from expanding $(3 + h)^2$ as $9 + 3h + h^2$, missing the doubling of the middle term. Correctly, $(3 + h)^2 = 9 + 2(3)(h) + h^2 = 9 + 6h + h^2$.',
      ],
      keyIdea: 'Expand, cancel the $h$ that causes $\\frac{0}{0}$, then let $h \\to 0$: this is the derivative from first principles.',
    },
    check: {
      optionValues: [9, 6, 0, 3],
      compute: () => near((h) => ((3 + h) ** 2 - 9) / h, 0),
    },
  },
  {
    id: 'limits-012',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'With angles in radians, what is the value of $\\lim_{h \\to 0} \\dfrac{\\sin\\left(\\frac{\\pi}{3} + h\\right) - \\sin\\left(\\frac{\\pi}{3}\\right)}{h}$?',
    options: ['$\\frac{\\sqrt{3}}{2}$', '$0$', '$-\\frac{1}{2}$', '$\\frac{1}{2}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Compare with the definition of the derivative:\n\n' +
        "$$f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}$$\n\n" +
        "This limit has exactly that shape with $f(x) = \\sin x$ and $a = \\frac{\\pi}{3}$, so it equals $f'\\left(\\frac{\\pi}{3}\\right)$.\n\n" +
        'The derivative of $\\sin x$ is $\\cos x$, so the limit is\n\n' +
        '$$\\cos\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}$$\n\n' +
        'Calculator check (radian mode): with $h = 0.001$ the quotient is about $0.4996$, close to $0.5$.',
      whyWrong: [
        '$\\frac{\\sqrt{3}}{2}$ is $\\sin\\left(\\frac{\\pi}{3}\\right)$, the value of the function at the point. The limit asks for the **rate of change** (derivative), which is $\\cos\\left(\\frac{\\pi}{3}\\right)$.',
        '$0$ comes from putting $h = 0$ in the numerator only. The denominator is also 0, so this is a $\\frac{0}{0}$ form; it is the derivative in disguise.',
        '$-\\frac{1}{2}$ uses the wrong derivative, $\\frac{d}{dx} \\sin x = -\\cos x$. The minus sign belongs to the derivative of $\\cos x$, not $\\sin x$.',
        null,
      ],
      keyIdea: "A limit of the form $\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}$ is the derivative $f'(a)$.",
    },
    check: {
      optionValues: [Math.sqrt(3) / 2, 0, -0.5, 0.5],
      compute: () => deriv(Math.sin, Math.PI / 3),
    },
  },
  {
    id: 'limits-013',
    subtopic: 'limits',
    difficulty: 'exam',
    stem:
      'A function is defined by\n\n' +
      '$$f(x) = \\begin{cases} x^2 + 1, & x < 2 \\\\ 3x - k, & x \\ge 2 \\end{cases}$$\n\n' +
      'For which value of $k$ does $\\lim_{x \\to 2} f(x)$ exist?',
    options: ['$k = 1$', '$k = -1$', '$k = 5$', '$k = 11$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A two-sided limit exists only when the **left-hand** and **right-hand** limits are equal.\n\n' +
        '- Left of 2 ($x < 2$) we use $x^2 + 1$: $\\lim_{x \\to 2^{-}} f(x) = 2^2 + 1 = 5$.\n' +
        '- Right of 2 ($x \\ge 2$) we use $3x - k$: $\\lim_{x \\to 2^{+}} f(x) = 3(2) - k = 6 - k$.\n\n' +
        'Set them equal: $6 - k = 5$, so $k = 6 - 5 = 1$.\n\n' +
        'Check: with $k = 1$ both pieces give 5 at $x = 2$, so the graph joins up and the limit is 5.',
      whyWrong: [
        null,
        '$k = -1$ comes from reaching $-k = -1$ and forgetting to divide both sides by $-1$. Check: $6 - (-1) = 7$, which is not 5.',
        '$k = 5$ sets $k$ equal to the left-hand limit itself, instead of making the right-hand limit $6 - k$ equal to 5.',
        '$k = 11$ comes from rearranging $6 - k = 5$ as $k = 6 + 5$ (treating the piece as $k - 6$). The correct rearrangement is $k = 6 - 5 = 1$.',
      ],
      keyIdea: 'For a piecewise function, the limit at the join exists only if the left-hand and right-hand limits are equal.',
    },
    check: {
      optionValues: [1, -1, 5, 11],
      compute: () => {
        const left = leftOf((x) => x * x + 1, 2);
        for (let k = -20; k <= 20; k++) if (Math.abs(rightOf((x) => 3 * x - k, 2) - left) < 1e-6) return k;
        return NaN;
      },
    },
  },
  {
    id: 'limits-014',
    subtopic: 'limits',
    difficulty: 'challenge',
    stem: 'Find $\\lim_{x \\to \\infty} \\dfrac{\\sqrt{4x^2 + 1}}{3x - 2}$.',
    options: ['$\\frac{4}{3}$', '$0$', '$\\frac{2}{3}$', '$\\infty$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The denominator behaves like $3x$ for large $x$, so divide top and bottom by $x$. For $x > 0$, $x = \\sqrt{x^2}$, so dividing the square root by $x$ means dividing **inside** it by $x^2$:\n\n' +
        '$$\\frac{\\sqrt{4x^2 + 1}}{x} = \\sqrt{\\frac{4x^2 + 1}{x^2}} = \\sqrt{4 + \\frac{1}{x^2}}$$\n\n' +
        'So\n\n' +
        '$$\\frac{\\sqrt{4x^2 + 1}}{3x - 2} = \\frac{\\sqrt{4 + \\frac{1}{x^2}}}{3 - \\frac{2}{x}}$$\n\n' +
        'As $x \\to \\infty$, $\\frac{1}{x^2} \\to 0$ and $\\frac{2}{x} \\to 0$, giving $\\frac{\\sqrt{4}}{3} = \\frac{2}{3}$.\n\n' +
        'Intuition: for huge $x$, $\\sqrt{4x^2 + 1} \\approx \\sqrt{4x^2} = 2x$, so the fraction is about $\\frac{2x}{3x} = \\frac{2}{3}$.',
      whyWrong: [
        '$\\frac{4}{3}$ forgets the square root: the leading behaviour of $\\sqrt{4x^2 + 1}$ is $\\sqrt{4x^2} = 2x$, not $4x$.',
        '$0$ comes from thinking a square root grows more slowly than any linear term, so the bottom "wins". But $\\sqrt{4x^2 + 1}$ grows like $2x$, the same rate as $3x - 2$.',
        null,
        '$\\infty$ comes from seeing $x^2$ on top and $x$ on the bottom and concluding the top has the higher degree. The square root halves the power: $\\sqrt{4x^2 + 1}$ behaves like $2x$, degree 1.',
      ],
      keyIdea: 'For large positive $x$, $\\sqrt{x^2} = x$, so compare the leading terms after taking the root: $\\sqrt{4x^2 + 1}$ behaves like $2x$.',
    },
    check: {
      optionValues: [4 / 3, 0, 2 / 3, null],
      compute: () => ((x: number) => Math.sqrt(4 * x * x + 1) / (3 * x - 2))(1e8),
    },
  },
  {
    id: 'limits-015',
    subtopic: 'limits',
    difficulty: 'challenge',
    stem:
      'The constants $a$ and $b$ are such that\n\n' +
      '$$\\lim_{x \\to 2} \\frac{x^2 + ax + b}{x - 2} = 7$$\n\n' +
      'Find $(a, b)$.',
    options: ['$(5, -14)$', '$(3, -10)$', '$(7, 10)$', '$(3, 10)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'As $x \\to 2$ the denominator tends to 0. For the limit to be a finite number (7), the numerator must also tend to 0, otherwise the fraction would blow up. So\n\n' +
        '$$2^2 + 2a + b = 0 \\quad \\Rightarrow \\quad b = -4 - 2a$$\n\n' +
        'So $x = 2$ is a root of the numerator and $(x - 2)$ is a factor: $x^2 + ax + b = (x - 2)(x + c)$ for some number $c$.\n\n' +
        'Cancelling $(x - 2)$ leaves $x + c$, whose limit as $x \\to 2$ is $2 + c$. Set $2 + c = 7$, so $c = 5$.\n\n' +
        'Expand: $(x - 2)(x + 5) = x^2 + 3x - 10$, so $a = 3$ and $b = -10$.\n\n' +
        'Check: $\\frac{x^2 + 3x - 10}{x - 2} = \\frac{(x - 2)(x + 5)}{x - 2} = x + 5 \\to 7$. Also $b = -4 - 2(3) = -10$ agrees.',
      whyWrong: [
        '$(5, -14)$ comes from setting $c = 7$ directly, i.e. using $(x - 2)(x + 7) = x^2 + 5x - 14$. After cancelling, the limit is $2 + c$, not $c$, so $c$ must be 5.',
        null,
        '$(7, 10)$ comes from using the factor $(x + 2)$ instead of $(x - 2)$: $(x + 2)(x + 5) = x^2 + 7x + 10$. That numerator is not 0 at $x = 2$, so the limit would not even be finite.',
        '$(3, 10)$ has the right $a$ but a sign error in $b$: from $4 + 2(3) + b = 0$ we get $b = -10$, not $10$. With $b = 10$ the numerator is 20 at $x = 2$ and the fraction blows up.',
      ],
      keyIdea: 'If the bottom tends to 0 but the limit is finite, the top must also tend to 0, so $(x - 2)$ is a factor of the top.',
    },
    check: {
      optionValues: ['5,-14', '3,-10', '7,10', '3,10'],
      compute: () => {
        const found: string[] = [];
        for (let a = -20; a <= 20; a++)
          for (let b = -20; b <= 20; b++) {
            if (4 + 2 * a + b !== 0) continue;
            const L = near((x) => (x * x + a * x + b) / (x - 2), 2);
            if (Math.abs(L - 7) < 1e-6) found.push(`${a},${b}`);
          }
        return found.join(';');
      },
    },
  },
  {
    id: 'limits-016',
    subtopic: 'limits',
    difficulty: 'challenge',
    stem: 'With $x$ in radians, find $\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2}$.',
    options: ['$0$', '$1$', '$2$', '$\\frac{1}{2}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Substituting gives $\\frac{1 - 1}{0} = \\frac{0}{0}$. Multiply top and bottom by $1 + \\cos x$ to use $1 - \\cos^2 x = \\sin^2 x$:\n\n' +
        '$$\\frac{1 - \\cos x}{x^2} \\cdot \\frac{1 + \\cos x}{1 + \\cos x} = \\frac{1 - \\cos^2 x}{x^2(1 + \\cos x)} = \\frac{\\sin^2 x}{x^2} \\cdot \\frac{1}{1 + \\cos x}$$\n\n' +
        'Now take each part separately as $x \\to 0$:\n\n' +
        '- $\\frac{\\sin^2 x}{x^2} = \\left(\\frac{\\sin x}{x}\\right)^2 \\to 1^2 = 1$\n' +
        '- $\\frac{1}{1 + \\cos x} \\to \\frac{1}{1 + 1} = \\frac{1}{2}$\n\n' +
        'So the limit is $1 \\times \\frac{1}{2} = \\frac{1}{2}$.\n\n' +
        'Calculator check (radians): $x = 0.01$ gives $\\frac{1 - \\cos 0.01}{0.0001} \\approx 0.499996$.',
      whyWrong: [
        '$0$ comes from mixing this up with $\\lim_{x \\to 0} \\frac{1 - \\cos x}{x} = 0$, or from looking only at the numerator. Dividing by $x^2$ instead of $x$ changes the answer.',
        '$1$ treats the expression as if it were the standard limit $\\frac{\\sin x}{x} \\to 1$. After rewriting, a factor $\\frac{1}{1 + \\cos x} \\to \\frac{1}{2}$ remains.',
        '$2$ comes from multiplying by $1 + \\cos x \\to 2$ instead of dividing by it: the factor $(1 + \\cos x)$ ends up in the **denominator**.',
        null,
      ],
      keyIdea: 'Multiply by the conjugate $1 + \\cos x$ to turn $1 - \\cos x$ into $\\sin^2 x$, then use $\\frac{\\sin x}{x} \\to 1$.',
    },
    check: {
      optionValues: [0, 1, 2, 0.5],
      compute: () => ((x: number) => (1 - Math.cos(x)) / (x * x))(1e-3),
    },
  },
  {
    id: 'limits-017',
    subtopic: 'limits',
    difficulty: 'challenge',
    stem: 'Find $\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + 6x} - x\\right)$.',
    options: ['$3$', '$0$', '$6$', '$\\infty$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Both $\\sqrt{x^2 + 6x}$ and $x$ grow without bound, so this is an "$\\infty - \\infty$" form: you cannot just say the answer is 0. Multiply by the conjugate over itself:\n\n' +
        '$$\\left(\\sqrt{x^2 + 6x} - x\\right) \\cdot \\frac{\\sqrt{x^2 + 6x} + x}{\\sqrt{x^2 + 6x} + x} = \\frac{(x^2 + 6x) - x^2}{\\sqrt{x^2 + 6x} + x} = \\frac{6x}{\\sqrt{x^2 + 6x} + x}$$\n\n' +
        'Divide top and bottom by $x$ (for $x > 0$, dividing the root by $x$ means dividing inside it by $x^2$):\n\n' +
        '$$\\frac{6}{\\sqrt{1 + \\frac{6}{x}} + 1}$$\n\n' +
        'As $x \\to \\infty$, $\\frac{6}{x} \\to 0$, giving $\\frac{6}{\\sqrt{1} + 1} = \\frac{6}{2} = 3$.\n\n' +
        'Calculator check: $x = 1000$ gives $\\sqrt{1006000} - 1000 \\approx 2.996$.',
      whyWrong: [
        null,
        '$0$ comes from saying "$\\infty - \\infty = 0$". Both parts grow, but $\\sqrt{x^2 + 6x}$ stays about 3 ahead of $x$, so the difference settles at 3.',
        '$6$ comes from rationalising correctly to $\\frac{6x}{\\sqrt{x^2 + 6x} + x}$ but then treating the denominator as $x$ instead of about $2x$ (it is $\\sqrt{x^2 + 6x} + x \\approx x + x$).',
        '$\\infty$ comes from thinking the square-root part "wins" because it contains $x^2$. But $\\sqrt{x^2 + 6x}$ grows only like $x$, and the gap between it and $x$ stays finite.',
      ],
      keyIdea: 'For an $\\infty - \\infty$ form with a square root, multiply by the conjugate to turn it into a fraction.',
    },
    check: {
      optionValues: [3, 0, 6, null],
      compute: () => ((x: number) => Math.sqrt(x * x + 6 * x) - x)(1e7),
    },
  },
  {
    id: 'limits-018',
    subtopic: 'limits',
    difficulty: 'challenge',
    stem: "Let $f(x) = \\dfrac{1}{x}$. Using first principles, $f'(2) = \\lim_{h \\to 0} \\dfrac{f(2 + h) - f(2)}{h}$. What is the value of this limit?",
    options: ['$\\frac{1}{4}$', '$-\\frac{1}{2}$', '$-\\frac{1}{4}$', '$0$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write out the difference quotient:\n\n' +
        '$$\\frac{f(2 + h) - f(2)}{h} = \\frac{\\frac{1}{2 + h} - \\frac{1}{2}}{h}$$\n\n' +
        '**Step 1.** Combine the two fractions on top over the common denominator $2(2 + h)$:\n\n' +
        '$$\\frac{1}{2 + h} - \\frac{1}{2} = \\frac{2 - (2 + h)}{2(2 + h)} = \\frac{-h}{2(2 + h)}$$\n\n' +
        '**Step 2.** Divide by $h$ (allowed, since $h \\ne 0$ while approaching):\n\n' +
        '$$\\frac{-h}{2(2 + h)} \\div h = \\frac{-1}{2(2 + h)}$$\n\n' +
        '**Step 3.** Let $h \\to 0$: $\\frac{-1}{2(2)} = -\\frac{1}{4}$.\n\n' +
        "So $f'(2) = -\\frac{1}{4}$. Check with the power rule: $f(x) = x^{-1}$ gives $f'(x) = -x^{-2} = -\\frac{1}{x^2}$, which is $-\\frac{1}{4}$ at $x = 2$.",
      whyWrong: [
        '$\\frac{1}{4}$ loses the minus sign when simplifying $2 - (2 + h)$, which is $-h$, not $h$. The function $\\frac{1}{x}$ is decreasing for $x > 0$, so its gradient must be negative.',
        '$-\\frac{1}{2}$ comes from forgetting the $(2 + h)$ in the common denominator, using $\\frac{-h}{2}$ instead of $\\frac{-h}{2(2 + h)}$; it is $-\\frac{1}{x}$ at $x = 2$ instead of $-\\frac{1}{x^2}$.',
        null,
        '$0$ comes from substituting $h = 0$ straight away: the top becomes $\\frac{1}{2} - \\frac{1}{2} = 0$, but the bottom is also 0, so the quotient must be simplified first.',
      ],
      keyIdea: 'In first-principles questions, combine fractions, cancel the factor $h$, and only then let $h \\to 0$.',
    },
    check: {
      optionValues: [0.25, -0.5, -0.25, 0],
      compute: () => near((h) => (1 / (2 + h) - 1 / 2) / h, 0),
    },
  },
];
