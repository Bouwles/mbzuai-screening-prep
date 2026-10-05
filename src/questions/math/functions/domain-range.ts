import type { StaticQuestion } from '../../../types';

// ---- helpers used only by the answer checks (not shown to students) ----
// Sample points -10, -9.75, ..., 10 (all exact in binary floating point).
const GRID = Array.from({ length: 81 }, (_, i) => -10 + i * 0.25);
/** Which grid points the real function is defined at ("1" = defined). JS gives NaN/Infinity where maths is undefined. */
const domSig = (f: (x: number) => number): string => GRID.map((x) => (Number.isFinite(f(x)) ? '1' : '0')).join('');
/** Same signature for a set described by a predicate (an option's claimed domain). */
const setSig = (p: (x: number) => boolean): string => GRID.map((x) => (p(x) ? '1' : '0')).join('');

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'domain-range-001',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'Given $f(x) = 3x^2 - 2x + 1$, find $f(-2)$.',
    options: ['$-7$', '$9$', '$17$', '$41$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$f(-2)$ means: replace **every** $x$ with $-2$, keeping it in brackets.\n\n' +
        '$$f(-2) = 3(-2)^2 - 2(-2) + 1$$\n\n' +
        '1. Square first: $(-2)^2 = 4$, so $3(-2)^2 = 3 \\times 4 = 12$.\n' +
        '2. Next term: $-2 \\times (-2) = +4$.\n' +
        '3. Add up: $12 + 4 + 1 = 17$.\n\n' +
        'So $f(-2) = 17$.',
      whyWrong: [
        'This comes from writing $(-2)^2$ as $-4$, giving $-12 + 4 + 1$. A negative number squared is positive: $(-2)^2 = 4$.',
        'This comes from a sign slip on the middle term: $-2 \\times (-2)$ is $+4$, not $-4$ (that would give $12 - 4 + 1$).',
        null,
        'This squares $3 \\times (-2)$ instead of just $-2$, giving $36 + 4 + 1$. In $3x^2$ only the $x$ is squared.',
      ],
      keyIdea: 'To evaluate $f(a)$, substitute $a$ in brackets for every $x$ and follow the order of operations (powers before multiplication).',
    },
    check: {
      optionValues: [-7, 9, 17, 41],
      compute: () => {
        const f = (x: number) => 3 * x ** 2 - 2 * x + 1;
        return f(-2);
      },
    },
  },
  {
    id: 'domain-range-002',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'What is the largest possible domain of the real function $f(x) = \\frac{5}{x - 4}$?',
    options: ['$x \\ne 4$', '$x \\ne -4$', '$x > 4$', 'All real numbers $x$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The only thing that can go wrong in a fraction is **dividing by zero**.\n\n' +
        '1. Set the denominator equal to zero: $x - 4 = 0$.\n' +
        '2. Solve: $x = 4$.\n' +
        '3. Every other real number works (for example $x = 0$ gives $-\\frac{5}{4}$ and $x = 3$ gives $-5$; negative outputs are fine).\n\n' +
        'So the domain is all real $x$ with $x \\ne 4$.',
      whyWrong: [
        null,
        'This is a sign slip when solving $x - 4 = 0$. Check it: at $x = -4$ the denominator is $-8$, which is fine; the problem is at $x = 4$.',
        'This wrongly assumes the output must be positive. Values like $x = 3$ give $f(3) = -5$, which is a perfectly good real number, so $x < 4$ is allowed too.',
        'This forgets that a denominator can never be zero. At $x = 4$ you would have to calculate $\\frac{5}{0}$, which is not defined.',
      ],
      keyIdea: 'For a fraction, exclude exactly the $x$-values that make the denominator zero.',
    },
    check: {
      optionValues: [
        setSig((x) => x !== 4),
        setSig((x) => x !== -4),
        setSig((x) => x > 4),
        setSig(() => true),
      ],
      compute: () => domSig((x) => 5 / (x - 4)),
    },
  },
  {
    id: 'domain-range-003',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'What is the largest possible domain of the real function $g(x) = \\sqrt{x - 5}$?',
    options: ['$x > 5$', '$x \\ge -5$', '$x \\ge 0$', '$x \\ge 5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'You cannot take the square root of a negative number (in the real numbers), but $\\sqrt{0} = 0$ is fine.\n\n' +
        '1. So the inside must be zero or positive: $x - 5 \\ge 0$.\n' +
        '2. Add 5 to both sides: $x \\ge 5$.\n\n' +
        'Check: $g(5) = \\sqrt{0} = 0$ works, $g(4) = \\sqrt{-1}$ does not.',
      whyWrong: [
        'This leaves out $x = 5$, but $g(5) = \\sqrt{0} = 0$ is perfectly defined. Square roots need the inside $\\ge 0$, not $> 0$.',
        'This is a sign slip when solving $x - 5 \\ge 0$. Try $x = 0$: $\\sqrt{0 - 5} = \\sqrt{-5}$ is not real.',
        'This applies the rule "$x \\ge 0$" to $x$ itself, but the rule is about the **whole inside** of the root, $x - 5$.',
        null,
      ],
      keyIdea: 'For $\\sqrt{\\text{stuff}}$, solve $\\text{stuff} \\ge 0$.',
    },
    check: {
      optionValues: [setSig((x) => x > 5), setSig((x) => x >= -5), setSig((x) => x >= 0), setSig((x) => x >= 5)],
      compute: () => domSig((x) => Math.sqrt(x - 5)),
    },
  },
  {
    id: 'domain-range-004',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'What is the range of $f(x) = x^2 + 3$, where $x$ can be any real number?',
    options: ['All real numbers', '$f(x) \\ge 3$', '$f(x) \\ge 0$', '$f(x) > 3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The **range** is the set of all possible **outputs**.\n\n' +
        '1. A square is never negative: $x^2 \\ge 0$ for every real $x$, and $x^2 = 0$ when $x = 0$.\n' +
        '2. Add 3 to everything: $x^2 + 3 \\ge 3$.\n' +
        '3. The value 3 is actually reached: $f(0) = 0 + 3 = 3$. Any bigger value is reached too (e.g. $f(x) = 7$ when $x = 2$).\n\n' +
        'So the range is $f(x) \\ge 3$.',
      whyWrong: [
        'This confuses range with domain. Every $x$ is allowed as an input, but the outputs can never drop below 3 because $x^2$ is never negative.',
        null,
        'This is the range of $x^2$ alone. Adding 3 lifts every output up by 3.',
        'This leaves out 3, but $f(0) = 3$, so 3 is an output. Use $\\ge$ when the smallest value is actually reached.',
      ],
      keyIdea: 'Start from a known range ($x^2 \\ge 0$) and apply each operation in the formula to the inequality.',
    },
    check: {
      optionValues: ['all', 'ge:3', 'ge:0', 'gt:3'],
      compute: () => {
        // x^2 + 3 has its smallest output at x = 0 (a grid point), so the minimum is reached: "ge"
        const ys = GRID.map((x) => x ** 2 + 3);
        return `ge:${Math.min(...ys)}`;
      },
    },
  },
  {
    id: 'domain-range-005',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    stem: 'A piecewise function is defined by\n\n$$f(x) = \\begin{cases} 2x + 1 & \\text{if } x < 3 \\\\ x^2 - 4 & \\text{if } x \\ge 3 \\end{cases}$$\n\nFind $f(3)$.',
    options: ['$5$', '$7$', '$12$', '$2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'First decide **which piece** to use, then substitute.\n\n' +
        '1. Is $3 < 3$? No. Is $3 \\ge 3$? Yes, so use the second piece, $x^2 - 4$.\n' +
        '2. Substitute: $f(3) = 3^2 - 4 = 9 - 4 = 5$.\n\n' +
        'So $f(3) = 5$.',
      whyWrong: [
        null,
        'This uses the top piece: $2(3) + 1 = 7$. But that piece is only for $x < 3$, and 3 is not less than 3.',
        'This adds the results of both pieces ($7 + 5$). For each input exactly one piece applies.',
        'This treats $x^2$ as $2x$, giving $2(3) - 4 = 2$. Squaring means multiplying by itself: $3^2 = 9$.',
      ],
      keyIdea: 'For a piecewise function, check the conditions first; the boundary value goes to the piece whose condition includes "equal to".',
    },
    check: {
      optionValues: [5, 7, 12, 2],
      compute: () => {
        const f = (x: number) => (x < 3 ? 2 * x + 1 : x ** 2 - 4);
        return f(3);
      },
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'domain-range-006',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'Given $f(x) = x^2 - 3x$, which expression is equal to $f(x + 2)$?',
    options: ['$x^2 - 3x - 2$', '$x^2 + x + 6$', '$x^2 - 3x + 2$', '$x^2 + x - 2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Replace every $x$ in the formula with the whole bracket $(x + 2)$.\n\n' +
        '1. $f(x + 2) = (x + 2)^2 - 3(x + 2)$\n' +
        '2. Expand the square: $(x + 2)^2 = x^2 + 4x + 4$.\n' +
        '3. Expand the bracket: $-3(x + 2) = -3x - 6$.\n' +
        '4. Collect like terms: $x^2 + 4x + 4 - 3x - 6 = x^2 + x - 2$.\n\n' +
        'Quick check with $x = 1$: $f(3) = 9 - 9 = 0$ and $1 + 1 - 2 = 0$. They match.',
      whyWrong: [
        'This expands $(x + 2)^2$ as $x^2 + 4$, forgetting the middle term $4x$. Remember $(x + 2)^2 = (x + 2)(x + 2) = x^2 + 4x + 4$.',
        'This multiplies only the $x$ in $-3(x + 2)$ by $-3$ and writes $-3x + 2$. The $-3$ must multiply both terms: $-3x - 6$.',
        'This is $f(x) + 2$ (adding 2 to the output), not $f(x + 2)$ (adding 2 to the input).',
        null,
      ],
      keyIdea: '$f(x + 2)$ means substitute the whole bracket $(x + 2)$ for $x$; it is not the same as $f(x) + 2$.',
    },
    check: {
      // evaluate every option at x = 3 and compare with f(3 + 2)
      optionValues: [
        (x: number) => x ** 2 - 3 * x - 2,
        (x: number) => x ** 2 + x + 6,
        (x: number) => x ** 2 - 3 * x + 2,
        (x: number) => x ** 2 + x - 2,
      ].map((g) => g(3)),
      compute: () => {
        const f = (x: number) => x ** 2 - 3 * x;
        return f(3 + 2);
      },
    },
  },
  {
    id: 'domain-range-007',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the largest possible domain of $h(x) = \\sqrt{6 - 2x}$?',
    options: ['$x \\ge 3$', '$x \\le 3$', '$x < 3$', '$x \\le -3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The inside of a square root must be zero or positive.\n\n' +
        '1. $6 - 2x \\ge 0$\n' +
        '2. Subtract 6 from both sides: $-2x \\ge -6$.\n' +
        '3. Divide both sides by $-2$. Dividing by a **negative** number **reverses** the inequality: $x \\le 3$.\n\n' +
        'Check: $x = 0$ gives $\\sqrt{6}$ (fine), $x = 3$ gives $\\sqrt{0} = 0$ (fine), $x = 4$ gives $\\sqrt{-2}$ (not real).\n\n' +
        'Easier alternative: $6 - 2x \\ge 0$ means $6 \\ge 2x$, so $3 \\ge x$.',
      whyWrong: [
        'This forgets to flip the inequality when dividing by $-2$. Test $x = 4$: $\\sqrt{6 - 8} = \\sqrt{-2}$ is not real, so $x \\ge 3$ cannot be right.',
        null,
        'This leaves out $x = 3$, but $h(3) = \\sqrt{0} = 0$ is defined. Square roots need the inside $\\ge 0$, not $> 0$.',
        'This moves the 6 across without changing its sign ($-2x \\ge 6$). Test $x = 0$: $\\sqrt{6}$ is fine, yet $x = 0$ is not in $x \\le -3$.',
      ],
      keyIdea: 'Solve "inside $\\ge 0$", and reverse the inequality sign whenever you multiply or divide by a negative number.',
    },
    check: {
      optionValues: [setSig((x) => x >= 3), setSig((x) => x <= 3), setSig((x) => x < 3), setSig((x) => x <= -3)],
      compute: () => domSig((x) => Math.sqrt(6 - 2 * x)),
    },
  },
  {
    id: 'domain-range-008',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the largest possible domain of $f(x) = \\ln(5 - x) + \\sqrt{x + 2}$?',
    options: ['$-2 < x < 5$', '$-2 \\le x \\le 5$', '$-2 \\le x < 5$', '$2 \\le x < 5$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Both parts must be defined at the same time, so find each condition and keep the overlap.\n\n' +
        '1. Logarithm: the input must be **strictly positive**: $5 - x > 0$, so $x < 5$.\n' +
        '2. Square root: the inside must be **zero or positive**: $x + 2 \\ge 0$, so $x \\ge -2$.\n' +
        '3. Both together: $-2 \\le x < 5$.\n\n' +
        'Check the ends: $x = -2$ gives $\\ln 7 + \\sqrt{0}$ (fine); $x = 5$ gives $\\ln 0$ (not defined).',
      whyWrong: [
        'This excludes $x = -2$, but $\\sqrt{0} = 0$ is fine. Only the log end ($x = 5$) must be strict.',
        'This includes $x = 5$, but then you need $\\ln 0$, which is not defined. A log needs its input strictly greater than 0.',
        null,
        'This is a sign slip in $x + 2 \\ge 0$, giving $x \\ge 2$. The correct step is to subtract 2: $x \\ge -2$. For example $x = 0$ works: $\\ln 5 + \\sqrt{2}$.',
      ],
      keyIdea: 'Log needs input $> 0$, square root needs inside $\\ge 0$; when a function has several parts, the domain is where all conditions hold together.',
    },
    check: {
      optionValues: [
        setSig((x) => -2 < x && x < 5),
        setSig((x) => -2 <= x && x <= 5),
        setSig((x) => -2 <= x && x < 5),
        setSig((x) => 2 <= x && x < 5),
      ],
      compute: () => domSig((x) => Math.log(5 - x) + Math.sqrt(x + 2)),
    },
  },
  {
    id: 'domain-range-009',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'Which values must be excluded from the domain of $f(x) = \\frac{x + 1}{x^2 - 5x + 6}$?',
    options: ['$x = -2$ and $x = -3$ only', '$x = 2$ and $x = 3$ only', '$x = -1$ only', '$x = -1$, $x = 2$ and $x = 3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Only the **denominator** can cause a problem (division by zero).\n\n' +
        '1. Set the denominator to zero: $x^2 - 5x + 6 = 0$.\n' +
        '2. Factorise: find two numbers that multiply to $6$ and add to $-5$: they are $-2$ and $-3$. So $(x - 2)(x - 3) = 0$.\n' +
        '3. Solve: $x = 2$ or $x = 3$.\n\n' +
        'The numerator being zero (at $x = -1$) just gives $f(-1) = \\frac{0}{12} = 0$, which is fine.\n\n' +
        'So exclude $x = 2$ and $x = 3$ only.',
      whyWrong: [
        'This is a sign error from the factors: $(x - 2)(x - 3) = 0$ gives $x = 2$ and $x = 3$, not $-2$ and $-3$. Check: $(-2)^2 - 5(-2) + 6 = 20 \\ne 0$.',
        null,
        'This sets the numerator to zero instead of the denominator. A zero on top is fine: $\\frac{0}{12} = 0$.',
        'This also excludes the zero of the numerator. Only the denominator matters; $f(-1) = 0$ is a valid output.',
      ],
      keyIdea: 'For a fraction, solve denominator $= 0$ and exclude those values; zeros of the numerator are allowed.',
    },
    check: {
      optionValues: [
        setSig((x) => x !== -2 && x !== -3),
        setSig((x) => x !== 2 && x !== 3),
        setSig((x) => x !== -1),
        setSig((x) => x !== -1 && x !== 2 && x !== 3),
      ],
      compute: () => domSig((x) => (x + 1) / (x ** 2 - 5 * x + 6)),
    },
  },
  {
    id: 'domain-range-010',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the range of $f(x) = x^2 - 6x + 11$, $x \\in \\mathbb{R}$?',
    options: ['$f(x) \\ge 11$', '$f(x) \\ge 3$', '$f(x) \\le 2$', '$f(x) \\ge 2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The coefficient of $x^2$ is positive, so the graph is a U-shaped parabola: the range starts at the **lowest point** (the vertex) and goes up forever.\n\n' +
        '**Method 1: vertex formula.**\n\n' +
        '1. $x$-coordinate of the vertex: $x = \\frac{-b}{2a} = \\frac{6}{2} = 3$.\n' +
        '2. Lowest value: $f(3) = 9 - 18 + 11 = 2$.\n\n' +
        '**Method 2: complete the square.** $x^2 - 6x + 11 = (x - 3)^2 - 9 + 11 = (x - 3)^2 + 2$. Since $(x - 3)^2 \\ge 0$, $f(x) \\ge 2$.\n\n' +
        'So the range is $f(x) \\ge 2$.',
      whyWrong: [
        'This uses $f(0) = 11$, the $y$-intercept. The lowest point is at the vertex $x = 3$, not at $x = 0$; for example $f(3) = 2 < 11$.',
        'This uses the $x$-coordinate of the vertex (3) instead of the $y$-value there. The range is about outputs: $f(3) = 2$.',
        'This has the correct value but the wrong direction. With a positive $x^2$ coefficient the parabola opens upwards, so 2 is a minimum, not a maximum.',
        null,
      ],
      keyIdea: 'For a quadratic on all real numbers, the range is "$\\ge$" (or "$\\le$") the $y$-value of the vertex, depending on whether it opens up or down.',
    },
    check: {
      optionValues: ['ge:11', 'ge:3', 'le:2', 'ge:2'],
      compute: () => {
        const a = 1;
        const b = -6;
        const c = 11;
        const xv = -b / (2 * a);
        return `${a > 0 ? 'ge' : 'le'}:${a * xv * xv + b * xv + c}`;
      },
    },
  },
  {
    id: 'domain-range-011',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'What is the range of $g(x) = 2^x + 3$, $x \\in \\mathbb{R}$?',
    options: ['$g(x) > 0$', '$g(x) > 3$', '$g(x) \\ge 3$', '$g(x) \\ge 4$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Start with the basic exponential: $2^x > 0$ for every real $x$. It gets very close to 0 for large negative $x$ (e.g. $2^{-10} \\approx 0.001$) but never reaches 0.\n' +
        '2. Add 3: $2^x + 3 > 3$.\n' +
        '3. Every value above 3 is reached (the graph rises without limit), but 3 itself is never reached: the line $y = 3$ is a horizontal asymptote.\n\n' +
        'So the range is $g(x) > 3$.',
      whyWrong: [
        'This is the range of $2^x$ alone. Adding 3 shifts the whole graph (and its asymptote) up by 3.',
        null,
        'This includes 3, but $g(x) = 3$ would need $2^x = 0$, which never happens. An asymptote value is not reached.',
        'This assumes the smallest value is at $x = 0$ ($g(0) = 1 + 3 = 4$). Negative $x$ give smaller values, e.g. $g(-1) = 3.5$.',
      ],
      keyIdea: '$a^x > 0$ always (never equal to 0), so $a^x + k > k$: the horizontal asymptote value is excluded from the range.',
    },
    check: {
      optionValues: ['gt:0', 'gt:3', 'ge:3', 'ge:4'],
      compute: () => {
        const g = (x: number) => 2 ** x + 3;
        // 2^x > 0 for every x, so every output is above the limit as x -> -infinity (2^-2000 underflows to 0)
        const bound = g(-2000);
        if (!GRID.every((x) => g(x) > bound)) throw new Error('bound not strict');
        return `gt:${bound}`;
      },
    },
  },
  {
    id: 'domain-range-012',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'Which of these functions is **one-to-one** on the given domain?',
    options: [
      '$f(x) = x^2$, $x \\in \\mathbb{R}$',
      '$f(x) = |x - 1|$, $x \\in \\mathbb{R}$',
      '$f(x) = x^2$, $x \\ge 0$',
      '$f(x) = \\sin x$, $0 \\le x \\le \\pi$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'A function is **one-to-one** if different inputs always give different outputs. On a graph: every horizontal line crosses it **at most once**. To show a function is *not* one-to-one, find two different inputs with the same output.\n\n' +
        '- $x^2$ on all reals: $f(-2) = f(2) = 4$. Not one-to-one.\n' +
        '- $|x - 1|$: $f(0) = 1$ and $f(2) = 1$. Not one-to-one.\n' +
        '- $\\sin x$ on $0 \\le x \\le \\pi$: $\\sin\\frac{\\pi}{6} = \\sin\\frac{5\\pi}{6} = \\frac{1}{2}$. Not one-to-one (the graph goes up and back down).\n' +
        '- $x^2$ on $x \\ge 0$: only the right half of the parabola, which is always increasing, so each output comes from exactly one input. **One-to-one.**',
      whyWrong: [
        'On all real numbers $x^2$ is not one-to-one: $(-2)^2 = 2^2 = 4$. A horizontal line crosses the parabola twice.',
        'The V-shaped graph of $|x - 1|$ fails the horizontal line test: $|0 - 1| = |2 - 1| = 1$.',
        null,
        'On $0 \\le x \\le \\pi$ the sine curve rises to 1 and falls back, so $\\sin\\frac{\\pi}{6} = \\sin\\frac{5\\pi}{6} = \\frac{1}{2}$.',
      ],
      keyIdea: 'One-to-one means each output comes from only one input (horizontal line test); restricting the domain can make a function one-to-one.',
    },
  },
  {
    id: 'domain-range-013',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'A function is defined by\n\n$$f(x) = \\begin{cases} x^2 - 1 & \\text{if } x < 2 \\\\ 3x - 4 & \\text{if } x \\ge 2 \\end{cases}$$\n\nFind $f(f(-2))$.',
    options: ['$8$', '$3$', '$99$', '$5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Work from the inside out, and choose the piece separately each time.\n\n' +
        '1. Inner: $-2 < 2$, so use $x^2 - 1$: $f(-2) = (-2)^2 - 1 = 4 - 1 = 3$.\n' +
        '2. Outer: now find $f(3)$. Since $3 \\ge 2$, use $3x - 4$: $f(3) = 9 - 4 = 5$.\n\n' +
        'So $f(f(-2)) = 5$.',
      whyWrong: [
        'This uses the top piece again for $f(3)$: $3^2 - 1 = 8$. But $3 \\ge 2$, so the second piece $3x - 4$ applies.',
        'This stops after the first step: $f(-2) = 3$. The question asks for $f$ applied **twice**.',
        'This uses the wrong piece for $-2$: $3(-2) - 4 = -10$, then $f(-10) = 100 - 1 = 99$. Since $-2 < 2$, the top piece applies first.',
        null,
      ],
      keyIdea: 'For $f(f(a))$, evaluate the inside first, then feed that output back in, rechecking which piece applies.',
    },
    check: {
      optionValues: [8, 3, 99, 5],
      compute: () => {
        const f = (x: number) => (x < 2 ? x ** 2 - 1 : 3 * x - 4);
        return f(f(-2));
      },
    },
  },
  {
    id: 'domain-range-014',
    subtopic: 'domain-range',
    difficulty: 'exam',
    stem: 'This Python function is a piecewise function. What does the program print?',
    code: {
      lang: 'python',
      source:
        'def f(x):\n    if x < 0:\n        return -x\n    elif x < 10:\n        return 2 * x\n    else:\n        return x - 3\n\nprint(f(-4), f(5), f(10))',
    },
    options: ['`4 10 20`', '`4 10 7`', '`-4 10 7`', '`-8 10 7`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Python checks the conditions **top to bottom** and uses the first one that is `True`.\n\n' +
        '| call | `x < 0`? | `x < 10`? | returns |\n' +
        '|---|---|---|---|\n' +
        '| `f(-4)` | True | (not checked) | `-(-4)` = 4 |\n' +
        '| `f(5)` | False | True | `2 * 5` = 10 |\n' +
        '| `f(10)` | False | False | `10 - 3` = 7 |\n\n' +
        '`print` with three arguments separates them with spaces, so the output is `4 10 7`.',
      whyWrong: [
        'This treats 10 as satisfying `x < 10`. But $10 < 10$ is False (strict inequality), so the `else` branch runs and returns $10 - 3 = 7$.',
        null,
        'This reads `-x` as "the number stays negative". `-x` means negate $x$: $-(-4) = 4$.',
        'This skips the first test and applies `2 * x` to $-4$. Since $-4 < 0$ is True, the first branch returns before the `elif` is ever checked.',
      ],
      keyIdea: 'A piecewise function in code is an if/elif/else chain: the first true condition decides the formula, and boundaries depend on `<` versus `<=`.',
    },
    python: { stdout: '4 10 7\n' },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'domain-range-015',
    subtopic: 'domain-range',
    difficulty: 'challenge',
    stem: 'What is the largest possible domain of $f(x) = \\sqrt{\\frac{x - 1}{x + 3}}$?',
    options: ['$x < -3$ or $x \\ge 1$', '$x \\ge 1$', '$x \\le -3$ or $x \\ge 1$', '$-3 < x \\le 1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Two conditions: the fraction inside the root must be $\\ge 0$, and its denominator must not be 0.\n\n' +
        '1. Critical values: numerator zero at $x = 1$, denominator zero at $x = -3$.\n' +
        '2. Sign table:\n\n' +
        '| region | $x - 1$ | $x + 3$ | fraction |\n' +
        '|---|---|---|---|\n' +
        '| $x < -3$ (try $-4$) | $-$ | $-$ | $+$ |\n' +
        '| $-3 < x < 1$ (try 0) | $-$ | $+$ | $-$ |\n' +
        '| $x > 1$ (try 2) | $+$ | $+$ | $+$ |\n\n' +
        '3. The fraction is positive for $x < -3$ and for $x > 1$.\n' +
        '4. At $x = 1$ the fraction is $0$ and $\\sqrt{0} = 0$: include it. At $x = -3$ we divide by zero: exclude it.\n\n' +
        'Domain: $x < -3$ or $x \\ge 1$.',
      whyWrong: [
        null,
        'This only looks at the numerator ($x - 1 \\ge 0$). A negative divided by a negative is positive, so values like $x = -4$ also work: $\\sqrt{\\frac{-5}{-1}} = \\sqrt{5}$.',
        'This includes $x = -3$, where the denominator is 0 and the fraction is not defined.',
        'This picks the region where the fraction is **negative** (try $x = 0$: $\\sqrt{-\\frac{1}{3}}$ is not real).',
      ],
      keyIdea: 'For $\\sqrt{\\frac{p}{q}}$ use a sign table: you need $\\frac{p}{q} \\ge 0$ with $q \\ne 0$, and a negative over a negative is positive.',
    },
    check: {
      optionValues: [
        setSig((x) => x < -3 || x >= 1),
        setSig((x) => x >= 1),
        setSig((x) => x <= -3 || x >= 1),
        setSig((x) => -3 < x && x <= 1),
      ],
      compute: () => domSig((x) => Math.sqrt((x - 1) / (x + 3))),
    },
  },
  {
    id: 'domain-range-016',
    subtopic: 'domain-range',
    difficulty: 'challenge',
    stem: 'The function $f(x) = \\frac{2x + 1}{x - 3}$ has domain $x \\ne 3$. Which value is **not** in its range?',
    options: ['$3$', '$-\\frac{1}{3}$', '$2$', 'None: every real number is in the range'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A value $y$ is in the range if we can solve $f(x) = y$ for some allowed $x$.\n\n' +
        '1. Set $\\frac{2x + 1}{x - 3} = y$.\n' +
        '2. Multiply by $(x - 3)$: $2x + 1 = y(x - 3) = yx - 3y$.\n' +
        '3. Put the $x$ terms together: $2x - yx = -3y - 1$, so $x(2 - y) = -3y - 1$.\n' +
        '4. Divide: $x = \\frac{-3y - 1}{2 - y}$. This works for every $y$ **except** $y = 2$ (division by zero).\n' +
        '5. Check $y = 2$ directly: $2x + 1 = 2x - 6$ gives $1 = -6$, impossible.\n\n' +
        'So 2 is not in the range (the line $y = 2$ is the horizontal asymptote; for large $x$, $f(x) \\approx \\frac{2x}{x} = 2$).',
      whyWrong: [
        'This mixes up domain and range: 3 is the excluded **input** (vertical asymptote $x = 3$). As an output, 3 is reached: $f(10) = \\frac{21}{7} = 3$.',
        'This is $f(0)$, the $y$-intercept, so it is definitely **in** the range.',
        null,
        'A function like this has a horizontal asymptote, and its value is never reached: solving $f(x) = 2$ gives $1 = -6$, which is impossible.',
      ],
      keyIdea: 'To find the range of $\\frac{ax + b}{cx + d}$, rearrange $y = f(x)$ for $x$; the $y$ that makes this impossible is $\\frac{a}{c}$, the horizontal asymptote.',
    },
    check: {
      optionValues: [3, -1 / 3, 2, null],
      compute: () => {
        // y(cx + d) = ax + b  =>  x(cy - a) = b - dy : no solution when cy - a = 0 (and b - dy != 0)
        const a = 2;
        const b = 1;
        const c = 1;
        const d = -3;
        const y = a / c;
        if (b - d * y === 0) throw new Error('degenerate');
        return y;
      },
    },
  },
  {
    id: 'domain-range-017',
    subtopic: 'domain-range',
    difficulty: 'challenge',
    stem: 'The function $f(x) = x^2 - 4x + 1$ is defined only for $0 \\le x \\le 5$. What is its range?',
    options: ['$1 \\le f(x) \\le 6$', '$-3 \\le f(x) \\le 6$', '$f(x) \\ge -3$', '$-3 \\le f(x) \\le 1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'With a restricted domain, check the **vertex** (if it lies inside the domain) and **both endpoints**.\n\n' +
        '1. Vertex: $x = \\frac{-b}{2a} = \\frac{4}{2} = 2$, which is inside $0 \\le x \\le 5$.\n' +
        '2. $f(2) = 4 - 8 + 1 = -3$ (the minimum, since the parabola opens upwards).\n' +
        '3. Endpoints: $f(0) = 1$ and $f(5) = 25 - 20 + 1 = 6$.\n' +
        '4. The largest of these is $6$, the smallest is $-3$.\n\n' +
        'Range: $-3 \\le f(x) \\le 6$.',
      whyWrong: [
        'This only uses the endpoints $f(0) = 1$ and $f(5) = 6$, missing the dip down to the vertex: $f(2) = -3$.',
        null,
        'This is the range for all real $x$. With $x$ stopped at 5, the outputs cannot go above $f(5) = 6$.',
        'This takes $f(0) = 1$ as the maximum, but the right endpoint is further from the vertex: $f(5) = 6 > 1$.',
      ],
      keyIdea: 'On a restricted domain, the range of a quadratic comes from the vertex (if inside) and the two endpoint values.',
    },
    check: {
      optionValues: ['1,6', '-3,6', null, '-3,1'],
      compute: () => {
        const f = (x: number) => x ** 2 - 4 * x + 1;
        const ys = Array.from({ length: 5001 }, (_, i) => f(i / 1000));
        return `${Math.min(...ys)},${Math.max(...ys)}`;
      },
    },
  },
  {
    id: 'domain-range-018',
    subtopic: 'domain-range',
    difficulty: 'challenge',
    stem: 'The function $f(x) = x^2 - 6x + 10$ is given the domain $x \\ge k$. What is the **smallest** value of $k$ for which $f$ is one-to-one?',
    options: ['$1$', '$-3$', '$0$', '$3$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'A parabola is not one-to-one because it goes down and then back up. To make it one-to-one, keep only one side of the vertex.\n\n' +
        '1. Complete the square: $x^2 - 6x + 10 = (x - 3)^2 - 9 + 10 = (x - 3)^2 + 1$.\n' +
        '2. The vertex is at $(3, 1)$. To the right of $x = 3$ the graph only increases.\n' +
        '3. So $x \\ge 3$ works, and any $k < 3$ includes points on both sides of the vertex (e.g. with $k = 2$: $f(2) = 2 = f(4)$).\n\n' +
        'Smallest $k = 3$.',
      whyWrong: [
        'This uses the $y$-coordinate of the vertex $(3, 1)$. The domain restriction is about $x$-values, so use $x = 3$.',
        'This reads the vertex from $(x - 3)^2$ with the wrong sign. $(x - 3)^2$ is smallest when $x = 3$, not $-3$.',
        'This assumes $x \\ge 0$ is always enough, but with $k = 0$: $f(2) = 2$ and $f(4) = 2$, two inputs with the same output.',
        null,
      ],
      keyIdea: 'Restrict a quadratic to one side of its vertex ($x \\ge$ vertex $x$-coordinate) to make it one-to-one.',
    },
    check: {
      optionValues: [1, -3, 0, 3],
      compute: () => {
        const f = (x: number) => x ** 2 - 6 * x + 10;
        // smallest integer k in [-10, 10] such that f takes no repeated value on a grid over [k, k + 20]
        for (let k = -10; k <= 10; k++) {
          const ys = Array.from({ length: 81 }, (_, i) => f(k + i * 0.25));
          if (new Set(ys).size === ys.length) return k;
        }
        throw new Error('none');
      },
    },
  },
  {
    id: 'domain-range-019',
    subtopic: 'domain-range',
    difficulty: 'challenge',
    stem: 'A quadratic function $f(x) = ax^2 + bx + c$ satisfies $f(0) = 3$, $f(1) = 2$ and $f(-1) = 8$. Find $f(2)$.',
    options: ['$5$', '$-5$', '$2$', '$17$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each piece of information is an equation in $a$, $b$, $c$.\n\n' +
        '1. $f(0) = c = 3$.\n' +
        '2. $f(1) = a + b + c = 2$, so $a + b = -1$.\n' +
        '3. $f(-1) = a - b + c = 8$, so $a - b = 5$.\n' +
        '4. Add the last two equations: $2a = 4$, so $a = 2$. Then $b = -1 - 2 = -3$.\n' +
        '5. So $f(x) = 2x^2 - 3x + 3$. Check: $f(-1) = 2 + 3 + 3 = 8$. Correct.\n' +
        '6. $f(2) = 2(4) - 3(2) + 3 = 8 - 6 + 3 = 5$.',
      whyWrong: [
        null,
        'This swaps $a$ and $b$ ($a = -3$, $b = 2$), giving $-12 + 4 + 3$. Adding the equations eliminates $b$ and gives $2a = 4$.',
        'This forgets the constant $c = 3$ at the end: $8 - 6 = 2$.',
        'This uses $b = 3$ instead of $-3$ (sign slip when subtracting), giving $8 + 6 + 3$. Check: then $f(1)$ would be $8$, not $2$.',
      ],
      keyIdea: 'Each fact "$f(p) = q$" is an equation: substitute, solve the simultaneous equations, then evaluate.',
    },
    check: {
      optionValues: [5, -5, 2, 17],
      compute: () => {
        const f0 = 3;
        const f1 = 2;
        const fm1 = 8;
        const c = f0;
        const a = (f1 + fm1) / 2 - c;
        const b = (f1 - fm1) / 2;
        return a * 4 + b * 2 + c;
      },
    },
  },
];
