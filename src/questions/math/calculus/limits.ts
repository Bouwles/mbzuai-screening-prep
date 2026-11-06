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
  // ------------------------------------------------------------------ recall and short calculations
  {
    id: 'limits-019',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'What is $\\lim_{x \\to \\infty} \\frac{1}{x}$?',
    options: ['$0$', '$1$', '$\\infty$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      solution:
        'As $x$ grows without bound, $\\frac{1}{x}$ gets smaller and smaller: $\\frac{1}{10} = 0.1$, $\\frac{1}{1000} = 0.001$, and so on.\n\n' +
        'The values settle towards $0$, so the limit is $0$.',
      whyWrong: [
        null,
        'This looks only at the top of the fraction. The bottom keeps growing, so the fraction shrinks well below $1$.',
        'This looks only at the bottom, which grows without bound. The fraction itself shrinks towards $0$.',
        'The values settle towards one number, so the limit exists, even though $\\frac{1}{x}$ never actually equals $0$.',
      ],
      keyIdea: 'A fixed number divided by something growing without bound tends to $0$.',
    },
    check: {
      optionValues: [0, 1, null, null],
      compute: () => 1 / 1e9,
    },
  },
  {
    id: 'limits-020',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'Substituting into a limit gives $\\frac{0}{0}$. What does this tell you?',
    options: ['The form is indeterminate, so simplify first', 'The limit is $0$', 'The limit is $1$', 'The limit does not exist'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$\\frac{0}{0}$ is called an **indeterminate** form: it does not give a value at all. It means more work is needed, usually factorising and cancelling, and then substituting again.\n\n' +
        'For example, $\\frac{x^2 - 9}{x - 3}$ gives $\\frac{0}{0}$ at $x = 3$, but its limit there is $6$.',
      whyWrong: [
        null,
        'This looks only at the top. The bottom is also $0$, so the fraction is not simply $0$.',
        'This uses $\\frac{a}{a} = 1$, which only works when $a$ is not $0$.',
        'A limit of this form often does exist. Giving up here misses that the expression can be simplified.',
      ],
      keyIdea: 'A $\\frac{0}{0}$ result means "simplify, then substitute again"; it is not an answer.',
    },
  },
  {
    id: 'limits-021',
    subtopic: 'limits',
    difficulty: 'foundation',
    stem: 'When does the two-sided limit $\\lim_{x \\to a} f(x)$ exist?',
    options: ['When both one-sided limits exist and are equal', 'When $f(a) = 0$', 'When $f(a)$ is defined', 'When at least one one-sided limit exists'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The two-sided limit looks at values of $f(x)$ on **both** sides of $x = a$. It exists exactly when the left-hand limit and the right-hand limit both exist and are equal.\n\n' +
        'What happens exactly at $x = a$ does not matter.',
      whyWrong: [
        null,
        'The value of the function at $a$ does not decide the limit, and the limit need not be $0$.',
        'A limit depends on values **near** $a$, not at $a$. For example, $\\frac{x^2 - 9}{x - 3}$ is not defined at $x = 3$, yet its limit there is $6$.',
        'One side is not enough. For $\\frac{|x|}{x}$ at $0$ the one-sided limits are $-1$ and $1$, so there is no two-sided limit.',
      ],
      keyIdea: 'A two-sided limit exists only if the left-hand and right-hand limits agree.',
    },
  },
  {
    id: 'limits-022',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to 2} \\dfrac{x^2 - 5x + 6}{x - 2}$.',
    options: ['$-1$', '$5$', '$0$', '$-3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Substituting $x = 2$ gives top $= 4 - 10 + 6 = 0$ and bottom $= 0$, so this is $\\frac{0}{0}$ and we simplify first.\n\n' +
        '1. Factorise the top: $x^2 - 5x + 6 = (x - 2)(x - 3)$.\n' +
        '2. Cancel the common factor: $\\frac{(x - 2)(x - 3)}{x - 2} = x - 3$ for $x \\ne 2$.\n' +
        '3. Substitute again: $2 - 3 = -1$.',
      whyWrong: [
        null,
        'This factorises with a sign slip, as $(x - 2)(x + 3)$, and gets $2 + 3$. But $(x - 2)(x + 3)$ expands to $x^2 + x - 6$.',
        'This looks only at the top, which is $0$ at $x = 2$. The bottom is also $0$, so simplify first.',
        'This cancels correctly to $x - 3$ but then keeps only the $-3$. You still have to substitute $x = 2$.',
      ],
      keyIdea: 'If $x = a$ gives $\\frac{0}{0}$, factorise, cancel $(x - a)$ and substitute again.',
    },
    check: {
      optionValues: [-1, 5, 0, -3],
      compute: () => near((x) => (x * x - 5 * x + 6) / (x - 2), 2),
    },
  },
  {
    id: 'limits-023',
    subtopic: 'limits',
    difficulty: 'exam',
    stem: 'Find $\\lim_{x \\to \\infty} \\dfrac{5x - 3x^2}{6x^2 + 1}$.',
    options: ['$-\\frac{1}{2}$', '$\\frac{5}{6}$', '$\\frac{1}{2}$', '$-2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Top and bottom both have degree $2$, so the limit is the ratio of the leading coefficients (the numbers in front of the highest powers).\n\n' +
        'The leading coefficient on top is $-3$ and on the bottom it is $6$, so the limit is $\\frac{-3}{6} = -\\frac{1}{2}$.\n\n' +
        'Check by dividing every term by $x^2$: $\\frac{\\frac{5}{x} - 3}{6 + \\frac{1}{x^2}} \\to \\frac{-3}{6}$.',
      whyWrong: [
        null,
        'This uses the first number written on top, $5$. The leading coefficient belongs to the highest power, which is $-3x^2$.',
        'This drops the minus sign on $-3x^2$.',
        'This divides the coefficients the wrong way round, $\\frac{6}{-3}$. It is top over bottom.',
      ],
      keyIdea: 'With equal degrees, the limit at infinity is the ratio of the coefficients of the highest powers, whichever term is written first.',
    },
    check: {
      optionValues: [-1 / 2, 5 / 6, 1 / 2, -2],
      compute: () => ((x: number) => (5 * x - 3 * x * x) / (6 * x * x + 1))(1e8),
    },
  },
];
