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
      asking: 'How steep is the line joining $(2, 3)$ and $(6, 11)$?',
      solution:
        'The **gradient** of a line measures how steep it is: how much $y$ changes for each 1 unit that $x$ changes.\n\n' +
        'Use the formula: gradient $= \\frac{y_2 - y_1}{x_2 - x_1}$. Here $(x_1, y_1)$ and $(x_2, y_2)$ are the two points. Let $(2, 3)$ be the first point and $(6, 11)$ the second.\n\n' +
        'Change in $y$: $11 - 3 = 8$. Change in $x$: $6 - 2 = 4$.\n\n' +
        'Divide the change in $y$ by the change in $x$: $\\frac{8}{4} = 2$.',
      conclusion: '$y$ goes up 8 while $x$ goes up 4, so $y$ rises 2 for every 1 across, and the gradient is $2$.',
      whyWrong: [
        'This is run over rise, $\\frac{6 - 2}{11 - 3} = \\frac{4}{8}$: the fraction has been turned upside down. The change in $y$ goes on top.',
        null,
        'This comes from **adding** the coordinates, $\\frac{11 + 3}{6 + 2} = \\frac{14}{8}$. The gradient uses the *differences* between the coordinates.',
        'This mixes up the order of subtraction: $\\frac{11 - 3}{2 - 6} = \\frac{8}{-4}$. Subtract the $x$-values in the same order as the $y$-values.',
      ],
      keyIdea: 'For the gradient through two points, use $\\frac{\\text{change in } y}{\\text{change in } x}$, with the $y$ values on top. Subtract in the same order on the top and the bottom, so that the sign comes out right.',
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
      asking: 'How steep is the line $3x + 2y = 12$, and where does it cross the $y$-axis?',
      solution:
        'To read a line\'s features, rewrite its equation as $y = mx + c$. Here $m$ is the **gradient** (steepness) and $c$ is the **$y$-intercept** (the height at which the line crosses the $y$-axis).\n\n' +
        'We need $y$ alone on the left. Subtract $3x$ from both sides: $2y = -3x + 12$.\n\n' +
        'Divide every term by 2: $y = -\\frac{3}{2}x + 6$.\n\n' +
        'Compare with $y = mx + c$. The number multiplying $x$ is $m = -\\frac{3}{2}$, and the number on its own is $c = 6$.',
      conclusion: 'Written as $y = -\\frac{3}{2}x + 6$, the line has gradient $-\\frac{3}{2}$, $y$-intercept $6$.',
      whyWrong: [
        'This divides the $x$-term by 2 but forgets to divide the constant 12 by 2 as well.',
        'This reads the numbers straight off $3x + 2y = 12$ without rearranging. The equation must be in the form $y = mx + c$ first.',
        'This loses the minus sign: moving $3x$ to the other side of the equation turns it into $-3x$.',
        null,
      ],
      keyIdea: 'Whenever a line isn\'t in the form $y = mx + c$, rearrange it until $y$ stands alone with no number in front. Then $m$ is the number next to $x$, with its sign, and $c$ is the number on its own.',
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
      asking: 'Which line has the same steepness as $2y = 6x + 1$?',
      solution:
        '**Parallel** lines never meet, so they have the same steepness. In other words, they have the same **gradient**.\n\n' +
        'Find the gradient of the given line. Write it as $y = mx + c$, where $m$ is the gradient. Divide every term of $2y = 6x + 1$ by 2: $y = 3x + \\frac{1}{2}$. So $m = 3$.\n\n' +
        'Now read the number multiplying $x$ in each option. Only one is 3:\n\n| Line | Gradient |\n|---|---|\n| $y = 6x - 4$ | $6$ |\n| $y = -\\frac{1}{3}x + 2$ | $-\\frac{1}{3}$ |\n| $y = 3x - 4$ | $3$ |\n| $y = -3x + 5$ | $-3$ |',
      conclusion: 'Both lines have gradient 3, and the different constant just means they never meet, so the parallel line is $y = 3x - 4$.',
      whyWrong: [
        'This uses gradient $6$, which comes from forgetting to divide by 2. The line must be written as $y = \\ldots$ before reading the gradient.',
        'This has gradient $-\\frac{1}{3}$, the negative reciprocal of $3$. That is the rule for a **perpendicular** line, not a parallel one.',
        null,
        'This has gradient $-3$. Parallel lines have exactly the same gradient, with no change of sign.',
      ],
      keyIdea: 'For parallel-line questions, rearrange every line into $y = mx + c$ first, then compare only the $m$ values. Parallel means equal $m$, with the same sign. The value of $c$ doesn\'t matter.',
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
      asking: 'Which vertical line cuts this curve into two mirror-image halves?',
      solution:
        'A **parabola** is the U-shaped graph of a quadratic. Its **axis of symmetry** is the vertical line that splits it into two mirror-image halves. It passes through the turning point.\n\n' +
        'For $y = ax^2 + bx + c$, the axis is at $x = -\\frac{b}{2a}$. Here $a = 1$ is the number in front of $x^2$, and $b = -6$ is the number in front of $x$.\n\n' +
        'Substitute: $x = -\\frac{-6}{2 \\times 1}$. The two minus signs cancel, which gives $x = \\frac{6}{2} = 3$.',
      conclusion: 'As a check, $x^2 - 6x + 5 = (x - 1)(x - 5)$, so the curve crosses the $x$-axis at 1 and 5. Halfway between those is 3, so the axis is $x = 3$.',
      whyWrong: [
        null,
        'This drops the minus sign in $x = -\\frac{b}{2a}$: with $b = -6$ the two minus signs cancel to give $+3$.',
        'This forgets the 2 in the denominator, working out $-\\frac{b}{a} = 6$ instead of $-\\frac{b}{2a}$.',
        'This is the $y$-coordinate of the vertex ($3^2 - 6 \\times 3 + 5 = -4$), not the axis of symmetry, which is a vertical line $x = \\ldots$',
      ],
      keyIdea: 'Use $x = -\\frac{b}{2a}$ for the axis of symmetry of any quadratic, putting the sign of $b$ in brackets. As a test, the axis lies halfway between the two $x$-axis crossings.',
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
      asking: 'Which flat line does the graph of $y = 3^x - 2$ approach but never reach?',
      solution:
        'A **horizontal asymptote** is a flat line that a graph gets closer and closer to but never touches.\n\n' +
        'Start with $y = 3^x$. As $x$ gets very negative, it gets tiny: $3^{-1} = \\frac{1}{3}$ and $3^{-5} = \\frac{1}{243}$. It gets close to 0 but never reaches it, since no power of 3 is 0. So its asymptote is $y = 0$.\n\n' +
        'The $-2$ subtracts 2 from every output, so the whole graph moves down 2, and the asymptote moves with it. Its height becomes $0 - 2 = -2$.',
      conclusion: 'When $3^x$ is almost 0, $y$ is almost $-2$, so the asymptote is $y = -2$.',
      whyWrong: [
        'This is the asymptote of $y = 3^x$ before the shift. The $-2$ moves the whole graph, including its asymptote, down by 2.',
        null,
        'This is a **vertical** line. An exponential graph has a horizontal asymptote, of the form $y = \\ldots$',
        'This uses the base 3. The base controls how fast the graph grows, not where the asymptote is.',
      ],
      keyIdea: 'For $y = a \\cdot b^x + c$, the horizontal asymptote is $y = c$, the number added on the end. The reason is that $b^x$ can get as close to 0 as we like, which leaves just $c$.',
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
      asking: 'Which point fits the rule $y = \\log_2 x$?',
      solution:
        '$\\log_2 x$ means: what power of 2 gives $x$? For example, $\\log_2 16 = 4$, because $2^4 = 16$.\n\n' +
        'So $y = \\log_2 x$ says the same thing as $2^y = x$. That form is easier to test, because we can work out powers of 2.\n\n' +
        'Test each point $(x, y)$ by working out $2^y$ and comparing it with $x$. Only one matches:\n\n| Point | $2^y$ | Equal to $x$? |\n|---|---|---|\n| $(3, 8)$ | $2^8 = 256$ | no, $x$ is 3 |\n| $(0, 1)$ | $2$ | no, $x$ is 0 |\n| $(8, 3)$ | $2^3 = 8$ | yes |\n| $(2, 0)$ | $2^0 = 1$ | no, $x$ is 2 |',
      conclusion: 'Since $2^3 = 8$, we have $\\log_2 8 = 3$, so the point on the graph is $(8, 3)$.',
      whyWrong: [
        'The coordinates are swapped: $(3, 8)$ lies on $y = 2^x$, the inverse function, not on $y = \\log_2 x$.',
        'This is the $y$-intercept of $y = 2^x$. The graph of $y = \\log_2 x$ never touches the $y$-axis because the log of 0 does not exist.',
        null,
        'This confuses the point with $(1, 0)$, which every graph $y = \\log_b x$ passes through. Actually $\\log_2 2 = 1$, so the point would be $(2, 1)$.',
      ],
      keyIdea: 'Rewrite $y = \\log_b x$ as $b^y = x$, then test each point in that form. Logs are powers in disguise, and $y$ is the power.',
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
      asking: 'What is the height of line $L$ where $x = 0$?',
      solution:
        '**Perpendicular** lines cross at a right angle. Their gradients (steepness values) multiply to $-1$.\n\n' +
        'The line $y = 2x - 3$ is in the form $y = mx + c$, so its gradient is 2.\n\n' +
        'Find the gradient of $L$. Call it $m$. Then $2 \\times m = -1$. Divide both sides by 2: $m = -\\frac{1}{2}$.\n\n' +
        'Write $L$ as $y = -\\frac{1}{2}x + c$, where $c$ is the $y$ value at which $L$ crosses the $y$-axis. That is the number we want.\n\n' +
        '$L$ passes through $(4, 1)$, so substitute $x = 4$ and $y = 1$: $1 = -\\frac{1}{2} \\times 4 + c$. That simplifies to $1 = -2 + c$.\n\n' +
        'Add 2 to both sides to get $c$ alone: $c = 3$.',
      conclusion: 'So $L$ is $y = -\\frac{1}{2}x + 3$, and it crosses the $y$-axis at $y = 3$. The answer is $3$.',
      whyWrong: [
        null,
        'This uses gradient $2$, the same as the given line, giving $y = 2x - 7$. That line is **parallel**, not perpendicular.',
        'This uses gradient $-2$: the sign was changed but the gradient was not flipped (no reciprocal), giving $y = -2x + 9$.',
        'This uses gradient $\\frac{1}{2}$: the gradient was flipped but its sign was not changed, giving $y = \\frac{1}{2}x - 1$.',
      ],
      keyIdea: 'For a perpendicular line, flip the gradient and change its sign to get the new $m$. Then put the given point into $y = mx + c$ and solve for $c$. For a parallel line, keep the same $m$.',
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
      asking: 'At which $x$ values is the height of this curve 0?',
      solution:
        'The graph crosses the $x$-axis where $y = 0$, so solve $2x^2 - 5x - 3 = 0$.\n\n' +
        'Factorise it, which means writing it as two brackets multiplied. The $2x^2$ must come from $2x \\times x$, so the brackets start $(2x \\ldots)(x \\ldots)$. The two missing numbers must multiply to $-3$.\n\n' +
        'Try $+1$ and $-3$: $(2x + 1)(x - 3)$. Multiply out to test it: $2x^2 - 6x + x - 3 = 2x^2 - 5x - 3$, which matches.\n\n' +
        'If two brackets multiply to 0, one of them must be 0. So $2x + 1 = 0$ or $x - 3 = 0$.\n\n' +
        'From $2x + 1 = 0$: subtract 1 to get $2x = -1$, then divide by 2 to get $x = -\\frac{1}{2}$. From $x - 3 = 0$: add 3 to get $x = 3$.',
      conclusion: 'The curve has height 0 at both values, so it crosses at $x = -\\frac{1}{2}$ and $x = 3$.',
      whyWrong: [
        'This uses $+b$ instead of $-b$ in the quadratic formula: $\\frac{-5 \\pm 7}{4}$ gives $\\frac{1}{2}$ and $-3$, both with the wrong sign.',
        'This divides by $2$ instead of $2a = 4$ in the quadratic formula: $\\frac{5 \\pm 7}{2}$ gives $6$ and $-1$.',
        null,
        'This solves $2x + 1 = 0$ as $x = -1$, forgetting to divide by 2 after subtracting 1.',
      ],
      keyIdea: 'To find where a quadratic crosses the $x$-axis, set $y = 0$ and solve by factorising or with the quadratic formula. When a bracket has a number in front of $x$, you must divide as well as move the constant.',
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
      asking: 'What are the $x$ and $y$ coordinates of the lowest point of this curve?',
      solution:
        'The **vertex** (turning point) is the lowest or highest point of a parabola. For $y = ax^2 + bx + c$, its $x$-coordinate is $x = -\\frac{b}{2a}$. Here $a = 2$, $b = 8$ and $c = 3$.\n\n' +
        'Substitute: $x = -\\frac{8}{2 \\times 2} = -\\frac{8}{4} = -2$.\n\n' +
        'Put $x = -2$ into the equation to get the height, with brackets around the negative: $y = 2(-2)^2 + 8(-2) + 3$.\n\n' +
        'Work out the power first: $(-2)^2 = 4$, so $2 \\times 4 = 8$. Then $8 \\times (-2) = -16$. So $y = 8 - 16 + 3 = -5$.',
      conclusion: 'The turning point has $x = -2$ and $y = -5$, so the vertex is $(-2, -5)$.',
      whyWrong: [
        'This loses the minus sign in $x = -\\frac{b}{2a}$ and uses $x = 2$, giving $y = 8 + 16 + 3 = 27$.',
        'This forgets the 2 in $2a$: $x = -\\frac{8}{2} = -4$, giving $y = 32 - 32 + 3 = 3$.',
        'The $x$-coordinate is right, but $(-2)^2$ was worked out as $-4$ (typing $-2^2$ into a calculator without brackets), giving $y = -8 - 16 + 3 = -21$.',
        null,
      ],
      keyIdea: 'For the vertex of $y = ax^2 + bx + c$, find $x = -\\frac{b}{2a}$, then substitute that $x$ in brackets to get $y$. Completing the square gives the same point, as $y = a(x - h)^2 + k$ has vertex $(h, k)$.',
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
    stem: 'A car worth AED 80,000 loses 15% of its value each year. What is it worth after 3 years?',
    options: ['AED 49,130', 'AED 44,000', 'AED 270', 'AED 121,670'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is 80,000 after losing 15% three times, each time from the latest value?',
      solution:
        'Losing 15% each year means 85% of the value remains, since $100\\% - 15\\% = 85\\%$. So each year we multiply the value by $0.85$. This number is called the **multiplier**.\n\n' +
        'Each 15% comes off the latest value, not the original price. So we can\'t just take off 45% in one go.\n\n' +
        'Multiply once for each year, always starting from the latest value:\n\n| Year | Working | Value (AED) |\n|---|---|---|\n| 1 | $80000 \\times 0.85$ | 68,000 |\n| 2 | $68000 \\times 0.85$ | 57,800 |\n| 3 | $57800 \\times 0.85$ | 49,130 |',
      conclusion: 'Three multiplications by 0.85 are the same as $80000 \\times 0.85^3$, so the car is worth AED 49,130.',
      whyWrong: [
        null,
        'This takes off 15% of the **original** price each year ($3 \\times 15\\% = 45\\%$ of 80,000). That is linear decrease; here each 15% is taken from the current, smaller value.',
        'This multiplies by $0.15$ each year ($80000 \\times 0.15^3$), which is the amount *lost*, not the fraction kept. The multiplier is $1 - 0.15 = 0.85$.',
        'This uses the growth multiplier $1.15$ ($80000 \\times 1.15^3$). The value is falling, so the multiplier must be less than 1.',
      ],
      keyIdea: 'For repeated percentage change, use $\\text{final} = \\text{start} \\times \\text{multiplier}^{n}$, where $n$ is the number of periods. The multiplier is $1 - \\frac{r}{100}$ for a loss of $r$%, and $1 + \\frac{r}{100}$ for a gain.',
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
      asking: 'Once we have found $a$ and $c$ from the graph\'s features, what is the value at $x = 3$?',
      solution:
        'A **horizontal asymptote** is a flat line a graph gets closer to but never reaches. In $a \\cdot 2^x + c$, the $2^x$ part can get as close to 0 as we like, leaving just $c$. So the asymptote is $y = c$.\n\n' +
        'We are told the asymptote is $y = 2$, so $c = 2$.\n\n' +
        'The graph crosses the $y$-axis at $(0, 5)$, so $f(0) = 5$. Since $2^0 = 1$, this gives $a \\times 1 + 2 = 5$.\n\n' +
        'Subtract 2 from both sides: $a = 3$. So $f(x) = 3 \\cdot 2^x + 2$.\n\n' +
        'Now put in $x = 3$. First the power: $2^3 = 2 \\times 2 \\times 2 = 8$. Then $f(3) = 3 \\times 8 + 2 = 24 + 2 = 26$.',
      conclusion: 'The function is $f(x) = 3 \\cdot 2^x + 2$, and at $x = 3$ it gives $26$.',
      whyWrong: [
        'This takes $a = 5$ (the $y$-intercept) and gets $5 \\times 8 + 2$. But the $y$-intercept is $a + c$, not $a$, because of the shift up by $c$.',
        'This finds $a = 3$ correctly but forgets to add $c = 2$ at the end: $3 \\times 8 = 24$.',
        null,
        'This treats $2^3$ as $2 \\times 3 = 6$, giving $3 \\times 6 + 2 = 20$. A power means repeated multiplication: $2^3 = 2 \\times 2 \\times 2 = 8$.',
      ],
      keyIdea: 'For $y = a \\cdot b^x + c$, read $c$ from the asymptote, then use the $y$-intercept, which is $a + c$ because $b^0 = 1$. Any further point gives $b$, if it is unknown.',
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
      asking: 'Which upright line does this log graph approach, and where does it cross the $x$-axis?',
      solution:
        '$\\log_3$ means: what power of 3 gives this number? A log only takes positive inputs, because powers of 3 are always positive. So here $x - 2 > 0$, which means $x > 2$.\n\n' +
        'A **vertical asymptote** is an upright line a graph gets closer to but never touches. As $x$ comes down towards 2, the input $x - 2$ gets close to 0 and the log heads to very negative values. So the asymptote is $x = 2$.\n\n' +
        'The **$x$-intercept** is where the graph crosses the $x$-axis, which is where $y = 0$. So solve $\\log_3(x - 2) = 0$.\n\n' +
        'Rewrite it as a power. A log equal to 0 means "3 to the power 0 gives the input", and $3^0 = 1$. So $x - 2 = 1$.\n\n' +
        'Add 2 to both sides: $x = 3$. The graph crosses the $x$-axis at the point $(3, 0)$.',
      conclusion: 'Testing: $\\log_3(3 - 2) = \\log_3 1 = 0$. So the answer is Asymptote $x = 2$; $x$-intercept $(3, 0)$.',
      whyWrong: [
        null,
        'This shifts the graph the wrong way. Replacing $x$ by $x - 2$ moves the graph 2 to the **right**, not to the left.',
        'These belong to $y = \\log_3 x$ before the shift; the $-2$ inside the bracket moves both features 2 to the right.',
        'The asymptote is correct, but $(1, 0)$ is not on this graph: at $x = 1$, $x - 2 = -1$ and the log of a negative number does not exist. The log is 0 when the **bracket** equals 1.',
      ],
      keyIdea: 'For $y = \\log_b(x - h)$, the vertical asymptote is where the bracket equals 0, at $x = h$. The $x$-intercept is where the bracket equals 1, because $\\log_b 1 = 0$. So it is at $x = h + 1$.',
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
      asking: 'Which equation produces the curve in the chart?',
      solution:
        'A quadratic\'s graph crosses the $x$-axis at its **roots**. Read the chart: $y = 0$ at $x = 1$ and at $x = 3$.\n\n' +
        'A root at $x = 1$ comes from the factor $(x - 1)$, because that bracket is 0 at $x = 1$. Likewise $x = 3$ gives $(x - 3)$. So the equation is $y = a(x - 1)(x - 3)$ for some number $a$.\n\n' +
        'To find $a$, use another point. The chart gives $y = 3$ at $x = 0$. Substitute: $3 = a(0 - 1)(0 - 3) = a \\times (-1) \\times (-3) = 3a$. So $a = 1$.\n\n' +
        'Multiply out the brackets: $(x - 1)(x - 3) = x^2 - 3x - x + 3 = x^2 - 4x + 3$.',
      conclusion: 'Testing the lowest point: at $x = 2$, $4 - 8 + 3 = -1$, which matches the chart. So the equation is $y = x^2 - 4x + 3$.',
      whyWrong: [
        'This has the right shape, but its roots are $x = -1$ and $x = -3$. A root at $x = 1$ gives the factor $(x - 1)$, with a minus sign.',
        'This has the right roots, but the minus sign in front makes it an upside-down (n-shaped) parabola. The graph opens upwards.',
        'This has the right axis of symmetry, $x = 2$, but its vertex is at $(2, 1)$, above the $x$-axis. The graph has its vertex at $(2, -1)$, so it would be $(x - 2)^2 - 1$.',
        null,
      ],
      keyIdea: 'To match a quadratic to its graph, read the roots and write $y = a(x - r_1)(x - r_2)$. Then use one more point to find $a$. Test your result at the vertex or the $y$-intercept.',
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
      asking: 'Which formula gives the right $y$ for every row of the table?',
      solution:
        'To find the type of function, look at how $y$ changes each time $x$ goes up by 1. Differences: $6 - 3 = 3$, $12 - 6 = 6$, $24 - 12 = 12$. They aren\'t equal, so the function isn\'t linear (a straight line).\n\n' +
        'Now try ratios, dividing each $y$ by the one before: $\\frac{6}{3} = 2$, $\\frac{12}{6} = 2$, $\\frac{24}{12} = 2$. They are all 2. A constant ratio means the function is **exponential**, of the form $y = a \\cdot b^x$.\n\n' +
        'In that form, $b$ is the number we keep multiplying by, so $b = 2$. And $a$ is the value at $x = 0$, because $b^0 = 1$. The table gives $y = 3$ at $x = 0$, so $a = 3$.\n\n' +
        'Put them together: $y = 3 \\cdot 2^x$.',
      conclusion: 'At $x = 3$ this gives $3 \\times 8 = 24$, matching the table, so the equation is $y = 3 \\cdot 2^x$.',
      whyWrong: [
        null,
        'This swaps the starting value and the multiplier. At $x = 0$ it gives $2$, not $3$, and at $x = 1$ it gives $6$ but at $x = 2$ it gives $18$, not $12$.',
        'This fits only the first two points (it assumes the $+3$ step continues). At $x = 2$ it gives $9$, not $12$: the differences are not constant, so the function is not linear.',
        'This multiplies the starting value 3 by the multiplier 2 to get a base of 6. But $6^0 = 1$, not $3$, and $6^2 = 36$, not $12$.',
      ],
      keyIdea: 'Given a table with $x$ going up in 1s: equal differences mean linear, and equal ratios mean exponential. For $y = a \\cdot b^x$, $a$ is the value at $x = 0$ and $b$ is the ratio. Test every row.',
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
      asking: 'What must $k$ be for this curve to just touch the $x$-axis?',
      solution:
        'Touching the $x$-axis at exactly one point means the equation $x^2 - 6x + k = 0$ has exactly one solution.\n\n' +
        'The **discriminant** tells us how many solutions a quadratic has. For $ax^2 + bx + c = 0$, it is $b^2 - 4ac$. If it is positive there are two solutions, if it is 0 there is one, and if it is negative there are none.\n\n' +
        'Here $a = 1$, $b = -6$ and $c = k$. So the discriminant is $(-6)^2 - 4 \\times 1 \\times k = 36 - 4k$.\n\n' +
        'We want exactly one solution, so set it to 0: $36 - 4k = 0$.\n\n' +
        'Add $4k$ to both sides: $36 = 4k$. Divide by 4: $k = 9$.',
      conclusion: 'With this value the quadratic is $x^2 - 6x + 9 = (x - 3)^2$, which is 0 only at $x = 3$. So the answer is $9$.',
      whyWrong: [
        'This forgets the 4 in $b^2 - 4ac$, solving $36 - k = 0$.',
        null,
        'This gets the sign wrong, solving $36 + 4k = 0$. With $c = k$ the discriminant is $36 - 4k$.',
        'This halves $b$ (giving 3) but forgets to square it. To complete the square, $x^2 - 6x$ needs $\\left(\\frac{6}{2}\\right)^2 = 9$ added.',
      ],
      keyIdea: 'Whenever a graph touches the axis, or a line is a tangent, think "one solution": set $b^2 - 4ac = 0$ and solve for the unknown. Two crossings means $> 0$. No crossings means $< 0$.',
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

  {
    id: 'function-families-016',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'A parabola crosses the $x$-axis at $x = 1$ and $x = 5$, and passes through the point $(3, 8)$. Where does it cross the $y$-axis?',
    options: ['$y = 10$', '$y = -10$', '$y = \\frac{5}{4}$', '$y = 5$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the height of this parabola at $x = 0$?',
      solution:
        'A **parabola** is the U-shaped graph of a quadratic. One that crosses the $x$-axis at $x = 1$ and $x = 5$ has the factors $(x - 1)$ and $(x - 5)$, since those brackets are 0 there. So $y = a(x - 1)(x - 5)$, where $a$ is a number we need to find.\n\n' +
        'Use the third point, $(3, 8)$, to find $a$. Substitute $x = 3$ and $y = 8$: $8 = a(3 - 1)(3 - 5)$.\n\n' +
        'Work out the brackets: $3 - 1 = 2$ and $3 - 5 = -2$. So $8 = a \\times 2 \\times (-2) = -4a$.\n\n' +
        'Divide both sides by $-4$: $a = -2$. So $y = -2(x - 1)(x - 5)$.\n\n' +
        'The graph crosses the $y$-axis where $x = 0$. Substitute: $y = -2(0 - 1)(0 - 5) = -2 \\times (-1) \\times (-5)$.\n\n' +
        'Two negatives multiply to a positive: $(-1) \\times (-5) = 5$. Then $-2 \\times 5 = -10$.',
      conclusion: 'The height at $x = 0$ is $-10$, so the parabola crosses the $y$-axis at $y = -10$.',
      whyWrong: [
        'This works out $3 - 5$ as $+2$, giving $a = 2$ and a $y$-intercept of $+10$. In fact $3 - 5 = -2$, so $a$ is negative.',
        null,
        'This writes the factors as $(x + 1)(x + 5)$: then $8 = a(4)(8)$, so $a = \\frac{1}{4}$ and the intercept is $\\frac{5}{4}$. A root at $x = 1$ gives the factor $(x - 1)$.',
        'This multiplies out $(0 - 1)(0 - 5) = 5$ but forgets to multiply by $a = -2$.',
      ],
      keyIdea: 'If you know a parabola\'s roots, start from $y = a(x - r_1)(x - r_2)$. Substitute the extra point to find $a$, then put $x = 0$ for the $y$-intercept, which is $a \\times r_1 \\times r_2$.',
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
    difficulty: 'exam',
    stem: 'The graph of $y = a \\cdot b^x$ (with $b > 0$) passes through $(1, 6)$ and $(3, 54)$. What is the value of $y$ when $x = 4$?',
    options: ['$486$', '$4374$', '$78$', '$162$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Given two points on this exponential curve, what is $y$ at $x = 4$?',
      solution:
        'In $y = a \\cdot b^x$, each step of 1 in $x$ multiplies $y$ by $b$. Going from $x = 1$ to $x = 3$ is two steps, so $y$ is multiplied by $b$ twice.\n\n' +
        'So $6 \\times b \\times b = 54$, which is $6b^2 = 54$. Divide both sides by 6: $b^2 = 9$.\n\n' +
        '$b^2 = 9$ gives $b = 3$ or $b = -3$. The question says $b > 0$, so $b = 3$.\n\n' +
        'We can now go one more step, from $x = 3$ to $x = 4$, by multiplying by $b$ once more: $y = 54 \\times 3 = 162$.',
      conclusion: 'Multiplying by 3 for each step of 1 goes 6, 18, 54, so at $x = 4$ the value is $162$.',
      whyWrong: [
        'This uses $a = 6$, treating the value at $x = 1$ as the starting value. The starting value $a$ is the value at $x = 0$, which is $\\frac{6}{3} = 2$.',
        'This takes $b = 9$, forgetting that from $x = 1$ to $x = 3$ there are **two** multiplications by $b$, so $b^2 = 9$, not $b = 9$.',
        'This assumes the graph is a straight line: it goes up $\\frac{54 - 6}{2} = 24$ per step, giving $54 + 24 = 78$. Exponential graphs grow by a constant **ratio**, not a constant amount.',
        null,
      ],
      keyIdea: 'For an exponential through two points, the ratio of the $y$ values equals $b$ to the power of the gap in $x$. Solve for $b$, then multiply along to the $x$ you need. You don\'t always need $a$.',
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
    difficulty: 'exam',
    stem: 'Where does the graph of $y = \\log_2(x - 3) + 1$ cross the $x$-axis?',
    options: ['$x = 4$', '$x = \\frac{7}{2}$', '$x = 5$', '$x = 1$'],
    correctIndex: 1,
    markScheme: {
      asking: 'At what value of $x$ is the height of this log graph 0?',
      solution:
        'The graph crosses the $x$-axis where $y = 0$, so solve $\\log_2(x - 3) + 1 = 0$.\n\n' +
        'Subtract 1 from both sides to get the log alone: $\\log_2(x - 3) = -1$.\n\n' +
        '$\\log_2$ asks what power of 2 gives the input. Here the power is $-1$, so the input is 2 to the power $-1$: $x - 3 = 2^{-1}$.\n\n' +
        'A negative power means "one over": $2^{-1} = \\frac{1}{2}$. So $x - 3 = \\frac{1}{2}$.\n\n' +
        'Add 3 to both sides, writing 3 as $\\frac{6}{2}$ so the fractions can be added: $x = \\frac{1}{2} + \\frac{6}{2} = \\frac{7}{2}$.',
      conclusion: 'Testing: $\\log_2\\left(\\frac{1}{2}\\right) + 1 = -1 + 1 = 0$. So the graph crosses at $x = \\frac{7}{2}$.',
      whyWrong: [
        'This solves $\\log_2(x - 3) = 0$, ignoring the $+1$. That is the $x$-intercept of the graph before it was moved up by 1.',
        null,
        'This moves the $+1$ across without changing its sign, solving $\\log_2(x - 3) = 1$ to get $x - 3 = 2$.',
        'This works out $2^{-1}$ as $-2$, giving $x - 3 = -2$. A negative power means a reciprocal: $2^{-1} = \\frac{1}{2}$. Also, $x = 1$ makes $x - 3$ negative, so the log would not even exist.',
      ],
      keyIdea: 'To solve a log equation, get the log alone, then rewrite $\\log_b(\\text{input}) = k$ as input $= b^k$. Negative powers are reciprocals: $b^{-1} = \\frac{1}{b}$. Test your result: the input must come out positive.',
    },
    check: {
      optionValues: [4, 3.5, 5, 1],
      compute: () => bisect((x) => Math.log2(x - 3) + 1, 3 + 1e-9, 100),
    },
  },
  {
    id: 'function-families-019',
    subtopic: 'function-families',
    difficulty: 'exam',
    stem: 'The graph shows a function of the form $y = a \\cdot b^x + c$ for $x$ from $0$ to $6$, levelling off towards a horizontal asymptote. Which equation matches the graph?',
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
      asking: 'Which equation produces the falling curve in the chart?',
      solution:
        'In $y = a \\cdot b^x + c$, the graph levels off at height $c$, as $b^x$ fades towards 0. That flat line is the **asymptote**. The values 18, 10, 6, 4, 3, 2.5, 2.25 are closing in on 2. So $c = 2$.\n\n' +
        'At $x = 0$, $b^0 = 1$, so $y = a + c$. The chart gives $y = 18$ at $x = 0$, so $a + 2 = 18$. Subtract 2 from both sides: $a = 16$.\n\n' +
        'To find $b$, take the 2 off two neighbouring values, then divide. At $x = 0$: $18 - 2 = 16$. At $x = 1$: $10 - 2 = 8$. So $b = \\frac{8}{16} = 0.5$.\n\n' +
        'Put them together: $y = 16(0.5)^x + 2$.',
      conclusion: 'Testing at $x = 2$: $16 \\times 0.25 + 2 = 6$, which matches the chart. So the equation is $y = 16(0.5)^x + 2$.',
      whyWrong: [
        'This has no $+2$, so its asymptote would be $y = 0$. It also gives $9$ at $x = 1$ instead of $10$, and the graph levels off at 2, not 0.',
        'This has the right starting value ($16 + 2 = 18$) and asymptote, but base $2$ means growth: the values would shoot **up**, not fall towards 2.',
        null,
        'This uses the $y$-intercept 18 as $a$. With the $+2$ shift, $y(0) = a + c = 20$, which does not match the graph. The $y$-intercept is $a + c$, so $a = 18 - 2 = 16$.',
      ],
      keyIdea: 'To match an exponential graph: $c$ is the level it settles at, $a$ is the starting value minus $c$, and $b$ is the ratio of neighbouring values after subtracting $c$. A $b$ below 1 means decay, and above 1 means growth.',
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
    id: 'function-families-021',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'Two perpendicular lines, neither of them vertical, have slopes $m_1$ and $m_2$. What is $m_1 m_2$?',
    options: ['$-1$', '$1$', '$0$', '$m_1^2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do you get if you multiply the slopes of two lines at a right angle?',
      solution:
        'The **slope** (or gradient) of a line measures how steep it is. Turning a line through a right angle flips that steepness upside down and changes its sign.\n\n' +
        'For example, a line with slope 2 has a perpendicular partner with slope $-\\frac{1}{2}$. Multiply them: $2 \\times \\left(-\\frac{1}{2}\\right) = -1$.',
      conclusion: 'The flip and the sign change give this result for every such pair, so $m_1 m_2$ equals $-1$.',
      whyWrong: [
        null,
        'This takes the reciprocal but forgets the minus sign. One slope must be positive and the other negative.',
        'A product of $0$ needs one slope to be $0$. That is only one special case, and its perpendicular partner would be vertical.',
        'This is what **parallel** lines give: they have equal slopes, so $m_1 m_2 = m_1^2$.',
      ],
      keyIdea: 'For perpendicular lines, $m_1 m_2 = -1$, so flip the slope and change its sign. For parallel lines, $m_1 = m_2$. A question using "perpendicular" or "right angle" calls for the first rule.',
    },
    check: {
      optionValues: [-1, 1, 0, null],
      compute: () => {
        const m1 = 3;
        // the direction (-m1, 1) is at right angles to the direction (1, m1)
        const m2 = 1 / -m1;
        return m1 * m2;
      },
    },
  },
  {
    id: 'function-families-022',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'The parabola $y = ax^2 + bx + c$ opens downwards exactly when:',
    options: ['$a < 0$', '$a > 0$', '$b < 0$', '$c < 0$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which number decides whether a parabola is an upside-down U?',
      solution:
        '$a$ is the number multiplying $x^2$. For large $x$, positive or negative, the $x^2$ term is much bigger than the others. So $a$ controls what the two ends of the graph do.\n\n' +
        'If $a$ is positive, the ends go up: $y = x^2$ is a U shape. If $a$ is negative, the ends go down: $y = -x^2$ is an upside-down U. So opening downwards happens exactly when $a$ is below 0.',
      conclusion: 'Only the sign of $a$ decides the direction, so the parabola opens downwards exactly when $a < 0$.',
      whyWrong: [
        null,
        'This is the condition for opening **upwards**, as $y = x^2$ does.',
        '$b$ moves the axis of symmetry sideways, but it does not change which way the parabola opens.',
        '$c$ is the $y$-intercept. It moves the graph up or down, but it does not change which way it opens.',
      ],
      keyIdea: 'To decide which way a parabola opens, look only at the sign of the number multiplying $x^2$: positive opens up with a minimum, negative opens down with a maximum. $b$ moves the axis sideways, and $c$ is the $y$-intercept.',
    },
  },
  {
    id: 'function-families-023',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'What is the slope (gradient) of a horizontal line?',
    options: ['$0$', '$1$', 'Undefined', '$-1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How steep is a flat line?',
      solution:
        '**Slope** (or gradient) is the change in $y$ divided by the change in $x$, as you move along a line.\n\n' +
        'On a horizontal line, the height never changes. For example, on $y = 4$ the points $(1, 4)$ and $(5, 4)$ have the same $y$. So the slope is $\\frac{4 - 4}{5 - 1} = \\frac{0}{4} = 0$.',
      conclusion: 'A horizontal line doesn\'t rise at all as you move across, so its slope is $0$.',
      whyWrong: [
        null,
        'A slope of $1$ means the line rises $1$ unit for every $1$ unit across, as $y = x$ does.',
        'Undefined slope belongs to a **vertical** line, where the change in $x$ is $0$.',
        'A slope of $-1$ means the line falls $1$ unit for every $1$ unit across, as $y = -x$ does.',
      ],
      keyIdea: 'Know the two extremes. A horizontal line has slope 0, because the change in $y$ is 0. A vertical line has no slope value at all, because the change in $x$ is 0, and we can\'t divide by 0.',
    },
  },
  {
    id: 'function-families-024',
    subtopic: 'function-families',
    difficulty: 'foundation',
    stem: 'Which of these functions has a **vertical** asymptote?',
    options: ['$y = \\ln x$', '$y = e^x$', '$y = x^2$', '$y = 2x + 1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which graph has an upright line that it approaches but never touches?',
      solution:
        'A **vertical asymptote** is an upright line $x = k$ that a graph gets closer and closer to but never touches. The graph\'s values grow without limit as $x$ gets close to $k$.\n\n' +
        '$y = x^2$ and $y = 2x + 1$ work for every $x$, with no breaks, so they have none. $y = e^x$ also works for every $x$. It only has a flat asymptote, $y = 0$.\n\n' +
        '$y = \\ln x$ exists only for $x > 0$. As $x$ gets close to 0 from the right, $\\ln x$ keeps falling with no limit: $\\ln 0.001 \\approx -6.9$. So $x = 0$ is a vertical asymptote of $y = \\ln x$.',
      conclusion: 'Only the logarithm falls without limit as $x$ nears a fixed value, so the answer is $y = \\ln x$.',
      whyWrong: [
        null,
        '$y = e^x$ has a **horizontal** asymptote, $y = 0$, and no vertical one: it is defined for every $x$.',
        'A parabola is defined for every $x$ and has no asymptotes.',
        'A straight line is defined for every $x$ and has no asymptotes.',
      ],
      keyIdea: 'Vertical asymptotes appear where a function stops being defined and its values grow without limit: a denominator equal to 0, or a log\'s input equal to 0. Polynomials and exponentials work for every $x$, so they never have one.',
    },
  },];
