import type { StaticQuestion } from '../../../types';

// Small helpers used only by the answer checks below (they re-derive answers in code).
const pt = (x: number, y: number) => `(${x},${y})`;
/** Quadratic through three points (x = 0, 1, 2) -> [A, B, C] for y = Ax^2 + Bx + C. */
function quadFrom012(y0: number, y1: number, y2: number): [number, number, number] {
  const C = y0;
  // A + B = y1 - C ; 4A + 2B = y2 - C
  const s1 = y1 - C;
  const s2 = y2 - C;
  const A = (s2 - 2 * s1) / 2;
  const B = s1 - A;
  return [A, B, C];
}
/** Bisection root finder for an increasing/decreasing continuous function on [lo, hi]. */
function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  const fa = f(a);
  for (let i = 0; i < 200; i++) {
    const mid = (a + b) / 2;
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(fa)) a = mid;
    else b = mid;
  }
  return (a + b) / 2;
}

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'function-families-001',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'A straight line passes through the points $(2, 3)$ and $(6, 11)$. What is its gradient?',
    options: ['$\\frac{1}{2}$', '$2$', '$\\frac{7}{4}$', '$-2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The gradient is "rise over run": the change in $y$ divided by the change in $x$.\n\n' +
        '$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{11 - 3}{6 - 2} = \\frac{8}{4} = 2$$\n\n' +
        'Sense check: moving 4 to the right, the line goes up 8, so it rises 2 for every 1 step across. The line goes **up** from left to right, so the gradient must be positive.\n\n' +
        'The gradient is $2$.',
      whyWrong: [
        'This is run over rise, $\\frac{6 - 2}{11 - 3} = \\frac{4}{8}$: the fraction has been turned upside down. The change in $y$ goes on top.',
        null,
        'This comes from **adding** the coordinates, $\\frac{11 + 3}{6 + 2} = \\frac{14}{8}$. The gradient uses the *differences* between the coordinates.',
        'This mixes up the order of subtraction: $\\frac{11 - 3}{2 - 6} = \\frac{8}{-4}$. Subtract the $x$-values in the same order as the $y$-values.',
      ],
      keyIdea: 'Gradient = (change in $y$) divided by (change in $x$), subtracting both coordinates in the same order.',
    },
    check: {
      optionValues: [0.5, 2, 1.75, -2],
      compute: () => {
        const [x1, y1, x2, y2] = [2, 3, 6, 11];
        return (y2 - y1) / (x2 - x1);
      },
    },
  },
  {
    id: 'function-families-002',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'What are the gradient and the $y$-intercept of the line $3x + 2y = 12$?',
    options: [
      'Gradient $-\\frac{3}{2}$, $y$-intercept $12$',
      'Gradient $3$, $y$-intercept $12$',
      'Gradient $\\frac{3}{2}$, $y$-intercept $6$',
      'Gradient $-\\frac{3}{2}$, $y$-intercept $6$',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Rearrange into the form $y = mx + c$, where $m$ is the gradient and $c$ is the $y$-intercept.\n\n' +
        '1. Start: $3x + 2y = 12$\n' +
        '2. Subtract $3x$ from both sides: $2y = -3x + 12$\n' +
        '3. Divide **every** term by 2: $y = -\\frac{3}{2}x + 6$\n\n' +
        'So the gradient is $-\\frac{3}{2}$ and the $y$-intercept is $6$.\n\n' +
        'Check the intercept: put $x = 0$ into the original equation, $2y = 12$, so $y = 6$.',
      whyWrong: [
        'This divides the $x$-term by 2 but forgets to divide the constant 12 by 2 as well.',
        'This reads the numbers straight off $3x + 2y = 12$ without rearranging. The equation must be in the form $y = mx + c$ first.',
        'This loses the minus sign: moving $3x$ to the other side of the equation turns it into $-3x$.',
        null,
      ],
      keyIdea: 'Rearrange to $y = mx + c$ (divide every term by the coefficient of $y$) before reading off the gradient and intercept.',
    },
    check: {
      optionValues: ['-1.5|12', '3|12', '1.5|6', '-1.5|6'],
      compute: () => {
        const [a, b, k] = [3, 2, 12]; // ax + by = k  ->  y = (-a/b)x + k/b
        return `${-a / b}|${k / b}`;
      },
    },
  },
  {
    id: 'function-families-003',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'Which of these lines is **parallel** to the line $2y = 6x + 1$?',
    options: ['$y = 6x - 4$', '$y = -\\frac{1}{3}x + 2$', '$y = 3x - 4$', '$y = -3x + 5$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Parallel lines have the **same gradient**. First find the gradient of $2y = 6x + 1$ by making $y$ the subject:\n\n' +
        '$$y = 3x + \\frac{1}{2}$$\n\n' +
        'So the gradient is $3$. We need another line with gradient $3$:\n\n' +
        '- $y = 6x - 4$: gradient $6$\n' +
        '- $y = -\\frac{1}{3}x + 2$: gradient $-\\frac{1}{3}$\n' +
        '- $y = 3x - 4$: gradient $3$ (and a different intercept, so it is a separate line)\n' +
        '- $y = -3x + 5$: gradient $-3$\n\n' +
        'The parallel line is $y = 3x - 4$.',
      whyWrong: [
        'This uses gradient $6$, which comes from forgetting to divide by 2. The line must be written as $y = \\ldots$ before reading the gradient.',
        'This has gradient $-\\frac{1}{3}$, the negative reciprocal of $3$. That is the rule for a **perpendicular** line, not a parallel one.',
        null,
        'This has gradient $-3$. Parallel lines have exactly the same gradient, with no change of sign.',
      ],
      keyIdea: 'Parallel lines have equal gradients; always rearrange to $y = mx + c$ first.',
    },
    check: {
      optionValues: [6, -1 / 3, 3, -3],
      compute: () => {
        const [coefY, coefX] = [2, 6];
        return coefX / coefY;
      },
    },
  },
  {
    id: 'function-families-004',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'What is the equation of the axis of symmetry of the parabola $y = x^2 - 6x + 5$?',
    options: ['$x = 3$', '$x = -3$', '$x = 6$', '$x = -4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'For $y = ax^2 + bx + c$ the axis of symmetry is the vertical line\n\n' +
        '$$x = -\\frac{b}{2a}$$\n\n' +
        'Here $a = 1$, $b = -6$, $c = 5$, so\n\n' +
        '$$x = -\\frac{-6}{2 \\times 1} = \\frac{6}{2} = 3$$\n\n' +
        'Check: the roots are $x = 1$ and $x = 5$ (since $x^2 - 6x + 5 = (x - 1)(x - 5)$), and the axis of symmetry is exactly halfway between them: $\\frac{1 + 5}{2} = 3$.\n\n' +
        'The axis of symmetry is $x = 3$.',
      whyWrong: [
        null,
        'This drops the minus sign in $x = -\\frac{b}{2a}$: with $b = -6$ the two minus signs cancel to give $+3$.',
        'This forgets the 2 in the denominator, working out $-\\frac{b}{a} = 6$ instead of $-\\frac{b}{2a}$.',
        'This is the $y$-coordinate of the vertex ($3^2 - 6 \\times 3 + 5 = -4$), not the axis of symmetry, which is a vertical line $x = \\ldots$',
      ],
      keyIdea: 'The axis of symmetry of $y = ax^2 + bx + c$ is $x = -\\frac{b}{2a}$, halfway between the roots.',
    },
    check: {
      optionValues: [3, -3, 6, -4],
      compute: () => {
        const [a, b] = [1, -6];
        return -b / (2 * a);
      },
    },
  },
  {
    id: 'function-families-005',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'What is the equation of the horizontal asymptote of the graph of $y = 3^x - 2$?',
    options: ['$y = 0$', '$y = -2$', '$x = -2$', '$y = 3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Start from the basic exponential $y = 3^x$. It is always positive, and as $x$ becomes very negative it gets closer and closer to $0$ without ever reaching it:\n\n' +
        '| $x$ | $-1$ | $-3$ | $-5$ |\n' +
        '| --- | --- | --- | --- |\n' +
        '| $3^x$ | $\\frac{1}{3}$ | $\\frac{1}{27}$ | $\\frac{1}{243}$ |\n\n' +
        'So $y = 3^x$ has asymptote $y = 0$. Subtracting 2 moves the whole graph **down 2**, so the values of $3^x - 2$ get closer and closer to $0 - 2 = -2$.\n\n' +
        'The horizontal asymptote is $y = -2$.',
      whyWrong: [
        'This is the asymptote of $y = 3^x$ before the shift. The $-2$ moves the whole graph, including its asymptote, down by 2.',
        null,
        'This is a **vertical** line. An exponential graph has a horizontal asymptote, of the form $y = \\ldots$',
        'This uses the base 3. The base controls how fast the graph grows, not where the asymptote is.',
      ],
      keyIdea: 'For $y = a \\cdot b^x + c$ the horizontal asymptote is $y = c$.',
    },
    check: {
      optionValues: ['y=0', 'y=-2', 'x=-2', 'y=3'],
      compute: () => {
        const f = (x: number) => 3 ** x - 2;
        return `y=${Math.round(f(-60))}`; // value far to the left = level of the asymptote
      },
    },
  },
  {
    id: 'function-families-006',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'Which of these points lies on the graph of $y = \\log_2 x$?',
    options: ['$(3, 8)$', '$(0, 1)$', '$(8, 3)$', '$(2, 0)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$y = \\log_2 x$ means "$y$ is the power you raise 2 to in order to get $x$", i.e. $2^y = x$.\n\n' +
        'Test each point by checking whether $2^y = x$:\n\n' +
        '- $(3, 8)$: $2^8 = 256$, not $3$\n' +
        '- $(0, 1)$: no power of 2 equals $0$, so $\\log_2 0$ does not exist\n' +
        '- $(8, 3)$: $2^3 = 8$, which works\n' +
        '- $(2, 0)$: $2^0 = 1$, not $2$\n\n' +
        'So $(8, 3)$ lies on the graph, because $\\log_2 8 = 3$.',
      whyWrong: [
        'The coordinates are swapped: $(3, 8)$ lies on $y = 2^x$, the inverse function, not on $y = \\log_2 x$.',
        'This is the $y$-intercept of $y = 2^x$. The graph of $y = \\log_2 x$ never touches the $y$-axis because the log of 0 does not exist.',
        null,
        'This confuses the point with $(1, 0)$, which every graph $y = \\log_b x$ passes through. Actually $\\log_2 2 = 1$, so the point would be $(2, 1)$.',
      ],
      keyIdea: '$y = \\log_b x$ is the same statement as $b^y = x$; its graph passes through $(1, 0)$ and $(b, 1)$.',
    },
    check: {
      optionValues: [pt(3, 8), pt(0, 1), pt(8, 3), pt(2, 0)],
      compute: () => {
        const cands: [number, number][] = [
          [3, 8],
          [0, 1],
          [8, 3],
          [2, 0],
        ];
        const hit = cands.filter(([x, y]) => x > 0 && Math.abs(Math.log2(x) - y) < 1e-12);
        return hit.length === 1 ? pt(hit[0][0], hit[0][1]) : 'none';
      },
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'function-families-007',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'Line $L$ passes through the point $(4, 1)$ and is **perpendicular** to the line $y = 2x - 3$. At what value of $y$ does $L$ cross the $y$-axis?',
    options: ['$3$', '$-7$', '$9$', '$-1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. The given line $y = 2x - 3$ has gradient $2$.\n' +
        '2. Perpendicular gradients multiply to $-1$, so the gradient of $L$ is the negative reciprocal: $m = -\\frac{1}{2}$.\n' +
        '3. Use the point-gradient form $y - y_1 = m(x - x_1)$ with $(4, 1)$:\n\n' +
        '$$y - 1 = -\\frac{1}{2}(x - 4)$$\n\n' +
        '4. Expand: $y - 1 = -\\frac{1}{2}x + 2$, so $y = -\\frac{1}{2}x + 3$.\n\n' +
        'The $y$-intercept (where $x = 0$) is $3$.\n\n' +
        'Check: $2 \\times \\left(-\\frac{1}{2}\\right) = -1$, and the point fits: $-\\frac{1}{2}(4) + 3 = 1$.',
      whyWrong: [
        null,
        'This uses gradient $2$, the same as the given line, giving $y = 2x - 7$. That line is **parallel**, not perpendicular.',
        'This uses gradient $-2$: the sign was changed but the gradient was not flipped (no reciprocal), giving $y = -2x + 9$.',
        'This uses gradient $\\frac{1}{2}$: the gradient was flipped but its sign was not changed, giving $y = \\frac{1}{2}x - 1$.',
      ],
      keyIdea: 'A perpendicular gradient is the negative reciprocal: flip the fraction AND change the sign.',
    },
    check: {
      optionValues: [3, -7, 9, -1],
      compute: () => {
        const m0 = 2;
        const m = -1 / m0;
        const [x1, y1] = [4, 1];
        return y1 - m * x1;
      },
    },
  },
  {
    id: 'function-families-008',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'Where does the graph of $y = 2x^2 - 5x - 3$ cross the $x$-axis?',
    options: [
      '$x = \\frac{1}{2}$ and $x = -3$',
      '$x = -1$ and $x = 6$',
      '$x = -\\frac{1}{2}$ and $x = 3$',
      '$x = -1$ and $x = 3$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'The graph crosses the $x$-axis where $y = 0$, so solve $2x^2 - 5x - 3 = 0$.\n\n' +
        '**Method 1: factorise.** We need two numbers that multiply to $2 \\times (-3) = -6$ and add to $-5$: these are $-6$ and $1$.\n\n' +
        '$$2x^2 - 6x + x - 3 = 2x(x - 3) + (x - 3) = (2x + 1)(x - 3)$$\n\n' +
        'So $2x + 1 = 0$, giving $x = -\\frac{1}{2}$, or $x - 3 = 0$, giving $x = 3$.\n\n' +
        '**Method 2: quadratic formula** with $a = 2$, $b = -5$, $c = -3$:\n\n' +
        '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} = \\frac{5 \\pm \\sqrt{25 + 24}}{4} = \\frac{5 \\pm 7}{4}$$\n\n' +
        'which gives $\\frac{12}{4} = 3$ or $\\frac{-2}{4} = -\\frac{1}{2}$.\n\n' +
        'The roots are $x = -\\frac{1}{2}$ and $x = 3$.',
      whyWrong: [
        'This uses $+b$ instead of $-b$ in the quadratic formula: $\\frac{-5 \\pm 7}{4}$ gives $\\frac{1}{2}$ and $-3$, both with the wrong sign.',
        'This divides by $2$ instead of $2a = 4$ in the quadratic formula: $\\frac{5 \\pm 7}{2}$ gives $6$ and $-1$.',
        null,
        'This solves $2x + 1 = 0$ as $x = -1$, forgetting to divide by 2 after subtracting 1.',
      ],
      keyIdea: 'Roots (x-intercepts) are where $y = 0$; in the quadratic formula the denominator is $2a$ and the numerator starts with $-b$.',
    },
    check: {
      optionValues: ['-3,0.5', '-1,6', '-0.5,3', '-1,3'],
      compute: () => {
        const [a, b, c] = [2, -5, -3];
        const d = Math.sqrt(b * b - 4 * a * c);
        const roots = [(-b - d) / (2 * a), (-b + d) / (2 * a)].sort((p, q) => p - q);
        return roots.join(',');
      },
    },
  },
  {
    id: 'function-families-009',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'What are the coordinates of the vertex (turning point) of $y = 2x^2 + 8x + 3$?',
    options: ['$(2, 27)$', '$(-4, 3)$', '$(-2, -21)$', '$(-2, -5)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. The $x$-coordinate of the vertex is on the axis of symmetry: $x = -\\frac{b}{2a} = -\\frac{8}{2 \\times 2} = -2$.\n' +
        '2. Substitute $x = -2$ to get the $y$-coordinate (brackets around the negative number!):\n\n' +
        '$$y = 2(-2)^2 + 8(-2) + 3 = 2(4) - 16 + 3 = -5$$\n\n' +
        'So the vertex is $(-2, -5)$. Since $a = 2 > 0$, the parabola opens upwards and this is a minimum point.\n\n' +
        'Check by completing the square: $2x^2 + 8x + 3 = 2(x^2 + 4x) + 3 = 2(x + 2)^2 - 8 + 3 = 2(x + 2)^2 - 5$, vertex $(-2, -5)$.',
      whyWrong: [
        'This loses the minus sign in $x = -\\frac{b}{2a}$ and uses $x = 2$, giving $y = 8 + 16 + 3 = 27$.',
        'This forgets the 2 in $2a$: $x = -\\frac{8}{2} = -4$, giving $y = 32 - 32 + 3 = 3$.',
        'The $x$-coordinate is right, but $(-2)^2$ was worked out as $-4$ (typing $-2^2$ into a calculator without brackets), giving $y = -8 - 16 + 3 = -21$.',
        null,
      ],
      keyIdea: 'Vertex: $x = -\\frac{b}{2a}$, then substitute that $x$ (in brackets) to find $y$.',
    },
    check: {
      optionValues: [pt(2, 27), pt(-4, 3), pt(-2, -21), pt(-2, -5)],
      compute: () => {
        const [a, b, c] = [2, 8, 3];
        const h = -b / (2 * a);
        return pt(h, a * h * h + b * h + c);
      },
    },
  },
  {
    id: 'function-families-010',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'A car is bought for AED 80,000. Its value falls by 15% each year (so each year it is worth 15% less than the year before). What is the car worth after 3 years?',
    options: ['AED 49,130', 'AED 44,000', 'AED 270', 'AED 121,670'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Losing 15% means keeping $100\\% - 15\\% = 85\\%$ of the value, so each year the value is **multiplied by** $0.85$. This is exponential decay:\n\n' +
        '$$V = 80000 \\times 0.85^t$$\n\n' +
        'After $t = 3$ years:\n\n' +
        '- Year 1: $80000 \\times 0.85 = 68000$\n' +
        '- Year 2: $68000 \\times 0.85 = 57800$\n' +
        '- Year 3: $57800 \\times 0.85 = 49130$\n\n' +
        'Or in one go: $80000 \\times 0.85^3 = 80000 \\times 0.614125 = 49130$.\n\n' +
        'The car is worth AED 49,130.',
      whyWrong: [
        null,
        'This takes off 15% of the **original** price each year ($3 \\times 15\\% = 45\\%$ of 80,000). That is linear decrease; here each 15% is taken from the current, smaller value.',
        'This multiplies by $0.15$ each year ($80000 \\times 0.15^3$), which is the amount *lost*, not the fraction kept. The multiplier is $1 - 0.15 = 0.85$.',
        'This uses the growth multiplier $1.15$ ($80000 \\times 1.15^3$). The value is falling, so the multiplier must be less than 1.',
      ],
      keyIdea: 'A fall of $r\\%$ per period means multiplying by $\\left(1 - \\frac{r}{100}\\right)$ each period: $V = V_0\\left(1 - \\frac{r}{100}\\right)^t$.',
    },
    check: {
      optionValues: [49130, 44000, 270, 121670],
      compute: () => {
        let v = 80000;
        for (let year = 1; year <= 3; year++) v -= v * 0.15;
        return v;
      },
    },
  },
  {
    id: 'function-families-011',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'The graph of $f(x) = a \\cdot 2^x + c$ has horizontal asymptote $y = 2$ and crosses the $y$-axis at $(0, 5)$. What is $f(3)$?',
    options: ['$42$', '$24$', '$26$', '$20$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. **Asymptote.** As $x$ becomes very negative, $2^x$ gets closer to $0$, so $f(x)$ gets closer to $c$. The asymptote is $y = 2$, so $c = 2$.\n' +
        '2. **$y$-intercept.** At $x = 0$, $2^0 = 1$, so $f(0) = a + c = a + 2$. This equals $5$, so $a = 3$.\n' +
        '3. So $f(x) = 3 \\cdot 2^x + 2$ and\n\n' +
        '$$f(3) = 3 \\times 2^3 + 2 = 3 \\times 8 + 2 = 26$$',
      whyWrong: [
        'This takes $a = 5$ (the $y$-intercept) and gets $5 \\times 8 + 2$. But the $y$-intercept is $a + c$, not $a$, because of the shift up by $c$.',
        'This finds $a = 3$ correctly but forgets to add $c = 2$ at the end: $3 \\times 8 = 24$.',
        null,
        'This treats $2^3$ as $2 \\times 3 = 6$, giving $3 \\times 6 + 2 = 20$. A power means repeated multiplication: $2^3 = 2 \\times 2 \\times 2 = 8$.',
      ],
      keyIdea: 'In $y = a \\cdot b^x + c$, the asymptote is $y = c$ and the $y$-intercept is $a + c$.',
    },
    check: {
      optionValues: [42, 24, 26, 20],
      compute: () => {
        const asym = 2;
        const yInt = 5;
        const c = asym;
        const a = yInt - c; // because 2^0 = 1
        return a * 2 ** 3 + c;
      },
    },
  },
  {
    id: 'function-families-012',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'For the graph of $y = \\log_3(x - 2)$, what are the vertical asymptote and the $x$-intercept?',
    options: [
      'Asymptote $x = 2$; $x$-intercept $(3, 0)$',
      'Asymptote $x = -2$; $x$-intercept $(-1, 0)$',
      'Asymptote $x = 0$; $x$-intercept $(1, 0)$',
      'Asymptote $x = 2$; $x$-intercept $(1, 0)$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Asymptote.** You can only take the log of a positive number, so we need $x - 2 > 0$, i.e. $x > 2$. As $x$ gets close to 2 from the right, $x - 2$ gets close to 0 and the log plunges towards $-\\infty$. So the vertical asymptote is $x = 2$.\n\n' +
        '**$x$-intercept.** Set $y = 0$:\n\n' +
        '$$\\log_3(x - 2) = 0 \\implies x - 2 = 3^0 = 1 \\implies x = 3$$\n\n' +
        'So the asymptote is $x = 2$ and the $x$-intercept is $(3, 0)$. (This is the graph of $y = \\log_3 x$ moved 2 to the right: asymptote $x = 0$ moves to $x = 2$ and the point $(1, 0)$ moves to $(3, 0)$.)',
      whyWrong: [
        null,
        'This shifts the graph the wrong way. Replacing $x$ by $x - 2$ moves the graph 2 to the **right**, not to the left.',
        'These belong to $y = \\log_3 x$ before the shift; the $-2$ inside the bracket moves both features 2 to the right.',
        'The asymptote is correct, but $(1, 0)$ is not on this graph: at $x = 1$, $x - 2 = -1$ and the log of a negative number does not exist. The log is 0 when the **bracket** equals 1.',
      ],
      keyIdea: 'For $y = \\log_b(x - h)$ the vertical asymptote is $x = h$ and the $x$-intercept is where the bracket equals 1.',
    },
    check: {
      optionValues: ['2|3', '-2|-1', '0|1', '2|1'],
      compute: () => {
        const h = 2; // bracket x - h
        const asym = h; // bracket = 0
        const xInt = 1 + h; // bracket = 1  (log of 1 is 0)
        return `${asym}|${xInt}`;
      },
    },
  },
  {
    id: 'function-families-013',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'The graph below shows a quadratic function, plotted for $x$ from $-1$ to $5$. Which equation matches the graph?',
    chart: {
      kind: 'line',
      title: 'A quadratic function',
      xLabel: 'x',
      yLabel: 'y',
      categories: ['-1', '0', '1', '2', '3', '4', '5'],
      series: [{ name: 'y', values: [8, 3, 0, -1, 0, 3, 8] }],
    },
    options: ['$y = (x + 1)(x + 3)$', '$y = -(x - 1)(x - 3)$', '$y = (x - 2)^2 + 1$', '$y = x^2 - 4x + 3$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Read the key features from the graph:\n\n' +
        '- It crosses the $x$-axis at $x = 1$ and $x = 3$ (the roots).\n' +
        '- It crosses the $y$-axis at $y = 3$.\n' +
        '- It is U-shaped (opens upwards) with its lowest point, the vertex, at $(2, -1)$.\n\n' +
        'Roots 1 and 3 mean $y = a(x - 1)(x - 3)$. Using the $y$-intercept: $a(0 - 1)(0 - 3) = 3a = 3$, so $a = 1$.\n\n' +
        '$$y = (x - 1)(x - 3) = x^2 - 4x + 3$$\n\n' +
        'Check the vertex: $x = 2$ gives $4 - 8 + 3 = -1$, which matches.\n\n' +
        'The equation is $y = x^2 - 4x + 3$.',
      whyWrong: [
        'This has the right shape, but its roots are $x = -1$ and $x = -3$. A root at $x = 1$ gives the factor $(x - 1)$, with a minus sign.',
        'This has the right roots, but the minus sign in front makes it an upside-down (n-shaped) parabola. The graph opens upwards.',
        'This has the right axis of symmetry, $x = 2$, but its vertex is at $(2, 1)$, above the $x$-axis. The graph has its vertex at $(2, -1)$, so it would be $(x - 2)^2 - 1$.',
        null,
      ],
      keyIdea: 'Match a parabola by its roots (factors), $y$-intercept, direction of opening and vertex.',
    },
    check: {
      // Each option evaluated at x = 10; compute fits a quadratic to the plotted points and evaluates it at x = 10.
      optionValues: [(10 + 1) * (10 + 3), -(10 - 1) * (10 - 3), (10 - 2) ** 2 + 1, 10 ** 2 - 4 * 10 + 3],
      compute: () => {
        const ys = [8, 3, 0, -1, 0, 3, 8]; // x = -1..5
        const [A, B, C] = quadFrom012(ys[1], ys[2], ys[3]);
        // confirm the fitted quadratic passes through every plotted point
        const ok = ys.every((y, i) => Math.abs(A * (i - 1) ** 2 + B * (i - 1) + C - y) < 1e-9);
        return ok ? A * 100 + B * 10 + C : NaN;
      },
    },
  },
  {
    id: 'function-families-014',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'The table shows some values of a function. Which equation fits **all** of the values?',
    table: {
      headers: ['$x$', '$y$'],
      rows: [
        [0, 3],
        [1, 6],
        [2, 12],
        [3, 24],
      ],
    },
    options: ['$y = 3 \\cdot 2^x$', '$y = 2 \\cdot 3^x$', '$y = 3x + 3$', '$y = 6^x$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Look at how $y$ changes each time $x$ goes up by 1:\n\n' +
        '- Differences: $6 - 3 = 3$, $12 - 6 = 6$, $24 - 12 = 12$. Not constant, so the function is **not linear**.\n' +
        '- Ratios: $\\frac{6}{3} = 2$, $\\frac{12}{6} = 2$, $\\frac{24}{12} = 2$. Constant, so the function is **exponential** with multiplier $b = 2$.\n\n' +
        'For $y = a \\cdot b^x$, the value at $x = 0$ is $a$ (since $b^0 = 1$), so $a = 3$.\n\n' +
        '$$y = 3 \\cdot 2^x$$\n\n' +
        'Check: $3 \\cdot 2^3 = 3 \\times 8 = 24$.',
      whyWrong: [
        null,
        'This swaps the starting value and the multiplier. At $x = 0$ it gives $2$, not $3$, and at $x = 1$ it gives $6$ but at $x = 2$ it gives $18$, not $12$.',
        'This fits only the first two points (it assumes the $+3$ step continues). At $x = 2$ it gives $9$, not $12$: the differences are not constant, so the function is not linear.',
        'This multiplies the starting value 3 by the multiplier 2 to get a base of 6. But $6^0 = 1$, not $3$, and $6^2 = 36$, not $12$.',
      ],
      keyIdea: 'Constant differences mean linear; constant ratios mean exponential $y = a \\cdot b^x$ with $a$ = value at $x = 0$ and $b$ = the ratio.',
    },
    check: {
      optionValues: [3 * 2 ** 5, 2 * 3 ** 5, 3 * 5 + 3, 6 ** 5],
      compute: () => {
        const ys = [3, 6, 12, 24];
        const a = ys[0];
        const b = ys[1] / ys[0];
        const constantRatio = ys.every((y, i) => i === 0 || y / ys[i - 1] === b);
        return constantRatio ? a * b ** 5 : NaN; // evaluate the fitted model at x = 5
      },
    },
  },
  {
    id: 'function-families-015',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'For which value of $k$ does the graph of $y = x^2 - 6x + k$ touch the $x$-axis at exactly one point?',
    options: ['$36$', '$9$', '$-9$', '$3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The number of $x$-intercepts of $y = ax^2 + bx + c$ depends on the discriminant $\\Delta = b^2 - 4ac$:\n\n' +
        '- $\\Delta > 0$: two roots\n' +
        '- $\\Delta = 0$: exactly one (repeated) root, so the graph just touches the axis\n' +
        '- $\\Delta < 0$: no roots\n\n' +
        'Here $a = 1$, $b = -6$, $c = k$. Set the discriminant to zero:\n\n' +
        '$$(-6)^2 - 4(1)(k) = 0 \\implies 36 - 4k = 0 \\implies k = 9$$\n\n' +
        'Check: $x^2 - 6x + 9 = (x - 3)^2$, which touches the $x$-axis only at $x = 3$.',
      whyWrong: [
        'This forgets the 4 in $b^2 - 4ac$, solving $36 - k = 0$.',
        null,
        'This gets the sign wrong, solving $36 + 4k = 0$. With $c = k$ the discriminant is $36 - 4k$.',
        'This halves $b$ (giving 3) but forgets to square it. To complete the square, $x^2 - 6x$ needs $\\left(\\frac{6}{2}\\right)^2 = 9$ added.',
      ],
      keyIdea: 'A parabola touches the $x$-axis exactly once when the discriminant $b^2 - 4ac = 0$.',
    },
    check: {
      optionValues: [36, 9, -9, 3],
      compute: () => {
        const [a, b] = [1, -6];
        // b^2 - 4ak = 0
        return (b * b) / (4 * a);
      },
    },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'function-families-016',
    subtopic: 'function-families',
    difficulty: 'challenge',
    stem: 'A parabola crosses the $x$-axis at $x = 1$ and $x = 5$, and passes through the point $(3, 8)$. Where does it cross the $y$-axis?',
    options: ['$y = 10$', '$y = -10$', '$y = \\frac{5}{4}$', '$y = 5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Roots at 1 and 5 give the factors $(x - 1)$ and $(x - 5)$, so $y = a(x - 1)(x - 5)$ for some number $a$.\n' +
        '2. Use the point $(3, 8)$ to find $a$:\n\n' +
        '$$8 = a(3 - 1)(3 - 5) = a(2)(-2) = -4a \\implies a = -2$$\n\n' +
        '3. The $y$-intercept is at $x = 0$:\n\n' +
        '$$y = -2(0 - 1)(0 - 5) = -2 \\times 5 = -10$$\n\n' +
        'Sense check: the vertex $(3, 8)$ is **above** the $x$-axis between the roots, so the parabola is n-shaped ($a < 0$) and must be below the axis at $x = 0$, outside the roots.\n\n' +
        'It crosses the $y$-axis at $y = -10$.',
      whyWrong: [
        'This works out $3 - 5$ as $+2$, giving $a = 2$ and a $y$-intercept of $+10$. The sign check above shows the answer must be negative.',
        null,
        'This writes the factors as $(x + 1)(x + 5)$: then $8 = a(4)(8)$, so $a = \\frac{1}{4}$ and the intercept is $\\frac{5}{4}$. A root at $x = 1$ gives the factor $(x - 1)$.',
        'This multiplies out $(0 - 1)(0 - 5) = 5$ but forgets to multiply by $a = -2$.',
      ],
      keyIdea: 'If a quadratic has roots $p$ and $q$, write $y = a(x - p)(x - q)$ and use one more point to find $a$.',
    },
    check: {
      optionValues: [10, -10, 5 / 4, 5],
      compute: () => {
        const [p, q] = [1, 5];
        const [x0, y0] = [3, 8];
        const a = y0 / ((x0 - p) * (x0 - q));
        return a * (0 - p) * (0 - q);
      },
    },
  },
  {
    id: 'function-families-017',
    subtopic: 'function-families',
    difficulty: 'challenge',
    stem: 'The graph of $y = a \\cdot b^x$ (with $b > 0$) passes through $(1, 6)$ and $(3, 54)$. What is the value of $y$ when $x = 4$?',
    options: ['$486$', '$4374$', '$78$', '$162$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Substitute both points:\n\n' +
        '$$a b = 6 \\qquad a b^3 = 54$$\n\n' +
        '2. Divide the second equation by the first, so $a$ cancels:\n\n' +
        '$$\\frac{a b^3}{a b} = b^2 = \\frac{54}{6} = 9 \\implies b = 3 \\quad (b > 0)$$\n\n' +
        '3. Then $a = \\frac{6}{b} = \\frac{6}{3} = 2$, so $y = 2 \\cdot 3^x$.\n' +
        '4. At $x = 4$: $y = 2 \\times 3^4 = 2 \\times 81 = 162$.\n\n' +
        'Check: $2 \\times 3^3 = 54$.',
      whyWrong: [
        'This uses $a = 6$, treating the value at $x = 1$ as the starting value. The starting value $a$ is the value at $x = 0$, which is $\\frac{6}{3} = 2$.',
        'This takes $b = 9$, forgetting that from $x = 1$ to $x = 3$ there are **two** multiplications by $b$, so $b^2 = 9$, not $b = 9$.',
        'This assumes the graph is a straight line: it goes up $\\frac{54 - 6}{2} = 24$ per step, giving $54 + 24 = 78$. Exponential graphs grow by a constant **ratio**, not a constant amount.',
        null,
      ],
      keyIdea: 'For $y = a \\cdot b^x$ through two points, divide the two equations to cancel $a$ and find $b$.',
    },
    check: {
      optionValues: [486, 4374, 78, 162],
      compute: () => {
        const [x1, y1, x2, y2] = [1, 6, 3, 54];
        const b = (y2 / y1) ** (1 / (x2 - x1));
        const a = y1 / b ** x1;
        return a * b ** 4;
      },
    },
  },
  {
    id: 'function-families-018',
    subtopic: 'function-families',
    difficulty: 'challenge',
    stem: 'Where does the graph of $y = \\log_2(x - 3) + 1$ cross the $x$-axis?',
    options: ['$x = 4$', '$x = \\frac{7}{2}$', '$x = 5$', '$x = 1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Set $y = 0$ and solve:\n\n' +
        '1. $\\log_2(x - 3) + 1 = 0$\n' +
        '2. Subtract 1: $\\log_2(x - 3) = -1$\n' +
        '3. Rewrite the log as a power ($\\log_2 A = k$ means $A = 2^k$): $x - 3 = 2^{-1} = \\frac{1}{2}$\n' +
        '4. Add 3: $x = 3 + \\frac{1}{2} = \\frac{7}{2}$\n\n' +
        'Check: $x - 3 = \\frac{1}{2}$ is positive, so the log exists, and $\\log_2 \\frac{1}{2} + 1 = -1 + 1 = 0$.\n\n' +
        'The graph crosses the $x$-axis at $x = \\frac{7}{2}$.',
      whyWrong: [
        'This solves $\\log_2(x - 3) = 0$, ignoring the $+1$. That is the $x$-intercept of the graph before it was moved up by 1.',
        null,
        'This moves the $+1$ across without changing its sign, solving $\\log_2(x - 3) = 1$ to get $x - 3 = 2$.',
        'This works out $2^{-1}$ as $-2$, giving $x - 3 = -2$. A negative power means a reciprocal: $2^{-1} = \\frac{1}{2}$. Also, $x = 1$ makes $x - 3$ negative, so the log would not even exist.',
      ],
      keyIdea: 'To solve a log equation, isolate the log, then rewrite $\\log_b A = k$ as $A = b^k$.',
    },
    check: {
      optionValues: [4, 3.5, 5, 1],
      compute: () => bisect((x) => Math.log2(x - 3) + 1, 3 + 1e-9, 100),
    },
  },
  {
    id: 'function-families-019',
    subtopic: 'function-families',
    difficulty: 'challenge',
    stem: 'The graph shows a function of the form $y = a \\cdot b^x + c$, plotted for $x$ from $0$ to $6$. As $x$ increases, the values level off towards a horizontal asymptote. Which equation matches the graph?',
    chart: {
      kind: 'line',
      title: 'Exponential decay towards an asymptote',
      xLabel: 'x',
      yLabel: 'y',
      categories: ['0', '1', '2', '3', '4', '5', '6'],
      series: [{ name: 'y', values: [18, 10, 6, 4, 3, 2.5, 2.25] }],
    },
    options: ['$y = 18(0.5)^x$', '$y = 16(2)^x + 2$', '$y = 16(0.5)^x + 2$', '$y = 18(0.5)^x + 2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. **Asymptote.** The values $4, 3, 2.5, 2.25$ get closer and closer to $2$, and the gap to 2 halves each time ($2, 1, 0.5, 0.25$). So $c = 2$.\n' +
        '2. **Starting value.** At $x = 0$, $b^0 = 1$, so $y = a + c = 18$, giving $a = 16$.\n' +
        '3. **Multiplier.** At $x = 1$: $16b + 2 = 10$, so $16b = 8$ and $b = 0.5$. The graph is falling, so $0 < b < 1$ (decay) makes sense.\n' +
        '4. Check at $x = 2$: $16 \\times 0.25 + 2 = 6$, which matches.\n\n' +
        'The equation is $y = 16(0.5)^x + 2$.',
      whyWrong: [
        'This has no $+2$, so its asymptote would be $y = 0$. It also gives $9$ at $x = 1$ instead of $10$, and the graph clearly levels off at 2, not 0.',
        'This has the right starting value ($16 + 2 = 18$) and asymptote, but base $2$ means growth: the values would shoot **up**, not fall towards 2.',
        null,
        'This uses the $y$-intercept 18 as $a$. With the $+2$ shift, $y(0) = a + c = 20$, which does not match the graph. The $y$-intercept is $a + c$, so $a = 18 - 2 = 16$.',
      ],
      keyIdea: 'For $y = a \\cdot b^x + c$: the asymptote gives $c$, the $y$-intercept gives $a + c$, and one more point gives $b$.',
    },
    check: {
      // Each option evaluated at x = 10.
      optionValues: [18 * 0.5 ** 10, 16 * 2 ** 10 + 2, 16 * 0.5 ** 10 + 2, 18 * 0.5 ** 10 + 2],
      compute: () => {
        const ys = [18, 10, 6, 4, 3, 2.5, 2.25];
        // For y = a b^x + c, consecutive gaps (y - c) have a constant ratio: solve for c from three points.
        const [y0, y1, y2] = ys;
        const c = (y0 * y2 - y1 * y1) / (y0 + y2 - 2 * y1);
        const b = (y1 - c) / (y0 - c);
        const a = y0 - c;
        const fits = ys.every((y, x) => Math.abs(a * b ** x + c - y) < 1e-9);
        return fits ? a * b ** 10 + c : NaN;
      },
    },
  },
  {
    id: 'function-families-020',
    subtopic: 'function-families',
    difficulty: 'challenge',
    stem: 'The points $A(1, 2)$ and $B(5, 10)$ are joined by a line segment. The line that is perpendicular to $AB$ and passes through the midpoint of $AB$ is drawn. Where does this line cross the $x$-axis?',
    options: ['$x = 0$', '$x = 6$', '$x = 5$', '$x = 15$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. **Midpoint** of $AB$: $\\left(\\frac{1 + 5}{2}, \\frac{2 + 10}{2}\\right) = (3, 6)$.\n' +
        '2. **Gradient** of $AB$: $\\frac{10 - 2}{5 - 1} = \\frac{8}{4} = 2$.\n' +
        '3. **Perpendicular gradient**: negative reciprocal of 2, which is $-\\frac{1}{2}$.\n' +
        '4. **Equation** through $(3, 6)$: $y - 6 = -\\frac{1}{2}(x - 3)$, so $y = -\\frac{1}{2}x + \\frac{3}{2} + 6 = -\\frac{1}{2}x + \\frac{15}{2}$.\n' +
        '5. **$x$-axis**: set $y = 0$: $\\frac{1}{2}x = \\frac{15}{2}$, so $x = 15$.\n\n' +
        'The line crosses the $x$-axis at $x = 15$.',
      whyWrong: [
        'This uses the gradient of $AB$ itself (2) through the midpoint, giving $y = 2x$, which is just the line $AB$ again. The new line must be perpendicular.',
        'This uses gradient $-2$: the sign was changed but the gradient was not flipped, giving $y = -2x + 12$.',
        'This uses the correct gradient $-\\frac{1}{2}$ but through point $A(1, 2)$ instead of the midpoint, giving $y = -\\frac{1}{2}x + \\frac{5}{2}$.',
        null,
      ],
      keyIdea: 'A perpendicular bisector goes through the midpoint and has the negative reciprocal gradient.',
    },
    check: {
      optionValues: [0, 6, 5, 15],
      compute: () => {
        const [x1, y1, x2, y2] = [1, 2, 5, 10];
        const [mx, my] = [(x1 + x2) / 2, (y1 + y2) / 2];
        const m = -1 / ((y2 - y1) / (x2 - x1));
        // y - my = m(x - mx); y = 0  ->  x = mx - my / m
        return mx - my / m;
      },
    },
  },
];
