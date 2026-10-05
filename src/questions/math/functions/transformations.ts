import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------------------
// Helpers for the answer checks (used only by the tests).
// A transformed graph is written as g(x) = outer(f(inner(x))).
// ---------------------------------------------------------------------------

/**
 * The point (p0, p1) is on y = f(x). On y = outer(f(inner(x))) the matching point has the x
 * that makes inner(x) = p0 (found by scanning a fine grid, NOT by using the "opposite" rule),
 * and the y-value outer(p1). Returns "x,y".
 */
function preimagePoint(p: [number, number], inner: (x: number) => number, outer: (y: number) => number): string {
  for (let x = -200; x <= 200; x += 0.25) {
    if (Math.abs(inner(x) - p[0]) < 1e-9) return `${x},${outer(p[1])}`;
  }
  throw new Error('no matching x found');
}

/**
 * Geometric view: every point (a, f(a)) of the original graph is moved to (mapX(a), mapY(f(a))).
 * Returns the height of the moved graph at x0 (found by scanning a grid of a-values).
 */
function imageHeight(f: (x: number) => number, mapX: (a: number) => number, mapY: (y: number) => number, x0: number): number {
  for (let a = -200; a <= 200; a += 0.25) {
    if (Math.abs(mapX(a) - x0) < 1e-9) return mapY(f(a));
  }
  throw new Error('no preimage found');
}

/** Root of a continuous increasing-or-decreasing function on [lo, hi] by bisection. */
function bisect(g: (x: number) => number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  const ga = g(a);
  for (let i = 0; i < 200; i++) {
    const mid = (a + b) / 2;
    if (Math.sign(g(mid)) === Math.sign(ga)) a = mid;
    else b = mid;
  }
  return (a + b) / 2;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'transformations-001',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'The point $(3, 5)$ lies on the graph of $y = f(x)$. Which point must lie on the graph of $y = f(x) + 2$?',
    options: ['$(5, 5)$', '$(1, 5)$', '$(3, 7)$', '$(3, 3)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The $+2$ is **outside** the function, so it changes the output ($y$-value) and leaves $x$ alone.\n\n' +
        '- At $x = 3$ the original graph has height $f(3) = 5$.\n' +
        '- The new graph has height $f(3) + 2 = 5 + 2 = 7$ at the same $x$.\n\n' +
        'So the point moves 2 units **up**: $(3, 5) \\to (3, 7)$.',
      whyWrong: [
        'This moves the point 2 units to the right. The $+2$ is outside the bracket, so it acts on the $y$-value, not on $x$.',
        'This moves the point 2 units to the left, treating the $+2$ as a horizontal shift. That would be $y = f(x + 2)$, with the 2 inside the bracket.',
        null,
        'This subtracts 2. Adding 2 outside the function moves the graph **up**, so the $y$-coordinate increases.',
      ],
      keyIdea: 'A number added outside the function, $f(x) + a$, moves the graph vertically by $a$: add $a$ to every $y$-coordinate.',
    },
    check: {
      optionValues: ['5,5', '1,5', '3,7', '3,3'],
      compute: () => preimagePoint([3, 5], (x) => x, (y) => y + 2),
    },
  },
  {
    id: 'transformations-002',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'Which of the following describes how the graph of $y = f(x - 4)$ is obtained from the graph of $y = f(x)$?',
    options: [
      'A translation of 4 units to the left',
      'A translation of 4 units to the right',
      'A translation of 4 units up',
      'A translation of 4 units down',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'The $-4$ is **inside** the bracket, so the change is horizontal, and inside the bracket everything works the *opposite* way to how it looks.\n\n' +
        'Check with one point: suppose $f(0) = 7$. On the new graph we need $x - 4 = 0$, so $x = 4$, and there the height is $f(0) = 7$.\n\n' +
        'The height that was at $x = 0$ is now at $x = 4$: the whole graph has moved **4 units to the right**.\n\n' +
        'In vector form this is a translation by $\\begin{pmatrix} 4 \\\\ 0 \\end{pmatrix}$.',
      whyWrong: [
        'This is the most common slip: $-4$ looks like it should mean "left", but inside the bracket the effect is reversed. $f(x - 4)$ reaches each height 4 units *later*, so the graph moves right.',
        null,
        'A change outside the bracket moves the graph vertically. Here the $-4$ is inside the bracket, so the move is horizontal.',
        'That would be $y = f(x) - 4$, where the 4 is subtracted outside the function.',
      ],
      keyIdea: '$f(x - a)$ moves the graph $a$ units to the right: changes inside the bracket act on $x$ and do the opposite of what they look like.',
    },
  },
  {
    id: 'transformations-003',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'The point $(2, -6)$ lies on the graph of $y = f(x)$. Which point must lie on the graph of $y = -f(x)$?',
    options: ['$(-2, -6)$', '$(-2, 6)$', '$(-6, 2)$', '$(2, 6)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The minus sign is **outside** the function, so it changes the sign of every output ($y$-value). The $x$-values stay the same.\n\n' +
        '- At $x = 2$: original height $f(2) = -6$.\n' +
        '- New height: $-f(2) = -(-6) = 6$.\n\n' +
        'So $(2, -6) \\to (2, 6)$. This is a reflection in the $x$-axis.',
      whyWrong: [
        'This changes the sign of $x$, which is a reflection in the $y$-axis: that is what $y = f(-x)$ does (minus **inside** the bracket).',
        'This changes both signs, a reflection in both axes, which is $y = -f(-x)$. Here the minus is only outside, so only $y$ changes.',
        'This swaps the coordinates, $(2, -6) \\to (-6, 2)$, which is a reflection in the line $y = x$ (the graph of the inverse function), not a reflection in the $x$-axis.',
        null,
      ],
      keyIdea: '$y = -f(x)$ reflects the graph in the $x$-axis: $(x, y) \\to (x, -y)$.',
    },
    check: {
      optionValues: ['-2,-6', '-2,6', '-6,2', '2,6'],
      compute: () => preimagePoint([2, -6], (x) => x, (y) => -y),
    },
  },
  {
    id: 'transformations-004',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'Which transformation maps the graph of $y = f(x)$ onto the graph of $y = 3f(x)$?',
    options: [
      'A vertical stretch with scale factor 3 (parallel to the $y$-axis)',
      'A horizontal stretch with scale factor 3 (parallel to the $x$-axis)',
      'A horizontal stretch with scale factor $\\frac{1}{3}$ (parallel to the $x$-axis)',
      'A translation of 3 units up',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'The 3 multiplies the **output** of the function, so every $y$-value is multiplied by 3 while every $x$-value stays the same.\n\n' +
        'For example, if $(1, 2)$ is on $y = f(x)$, then $(1, 6)$ is on $y = 3f(x)$.\n\n' +
        'Points move away from the $x$-axis by a factor of 3: a **vertical stretch, scale factor 3**. Points on the $x$-axis (where $y = 0$) do not move.',
      whyWrong: [
        null,
        'Multiplying outside the function changes the $y$-values. A horizontal stretch by factor 3 would be $y = f\\left(\\frac{x}{3}\\right)$, with the change inside the bracket.',
        'That is $y = f(3x)$, where the 3 multiplies $x$ inside the bracket and squashes the graph towards the $y$-axis.',
        'That would be $y = f(x) + 3$. Adding 3 shifts the graph; multiplying by 3 stretches it.',
      ],
      keyIdea: '$y = af(x)$ is a vertical stretch with scale factor $a$: multiply every $y$-coordinate by $a$.',
    },
  },
  {
    id: 'transformations-005',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'The graph of $y = x^2$ is translated 5 units to the **left**. What is the equation of the new graph?',
    options: ['$y = (x - 5)^2$', '$y = x^2 + 5$', '$y = (x + 5)^2$', '$y = x^2 - 5$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A horizontal translation changes $x$ **inside** the function. To move left by 5 we replace $x$ with $x + 5$:\n\n' +
        '$$y = f(x + 5) = (x + 5)^2$$\n\n' +
        'Check with the vertex: $y = x^2$ has its vertex at $(0, 0)$. For $y = (x + 5)^2$ the lowest point is where $x + 5 = 0$, i.e. $x = -5$. The vertex is now at $(-5, 0)$, which is 5 units to the left.',
      whyWrong: [
        'This moves the graph 5 units to the **right**: the vertex of $y = (x - 5)^2$ is at $x = 5$. Inside the bracket the sign works the opposite way.',
        'Adding 5 outside the function moves the graph 5 units **up**, not left.',
        null,
        'Subtracting 5 outside the function moves the graph 5 units **down**, not left.',
      ],
      keyIdea: 'To translate $a$ units left, replace $x$ by $x + a$; to translate right, replace $x$ by $x - a$.',
    },
    check: {
      // value of each option at x = 1
      optionValues: [16, 6, 36, -4],
      compute: () => imageHeight((x) => x * x, (a) => a - 5, (y) => y, 1),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'transformations-006',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The point $(4, -2)$ lies on the graph of $y = f(x)$. Which point must lie on the graph of $y = f(2x)$?',
    options: ['$(8, -2)$', '$(2, -2)$', '$(4, -4)$', '$(2, -4)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The 2 multiplies $x$ **inside** the bracket, so only the $x$-coordinate changes.\n\n' +
        'We want the new graph to use the same output $f(4) = -2$. That happens when the input to $f$ is 4:\n\n' +
        '$$2x = 4 \\quad\\Rightarrow\\quad x = 2$$\n\n' +
        'So the new graph has height $f(4) = -2$ at $x = 2$: the point is $(2, -2)$.\n\n' +
        'This is a horizontal stretch with scale factor $\\frac{1}{2}$ (a squash towards the $y$-axis): every $x$-coordinate is halved.',
      whyWrong: [
        'This multiplies the $x$-coordinate by 2. Inside the bracket the effect is the opposite: $f(2x)$ is a horizontal stretch with scale factor $\\frac{1}{2}$, so $x$ is halved.',
        null,
        'This doubles the $y$-coordinate, which is what $y = 2f(x)$ does (a vertical stretch). The 2 here is inside the bracket.',
        'This halves $x$ correctly but also doubles $y$. $f(2x)$ changes only the $x$-coordinates.',
      ],
      keyIdea: '$y = f(ax)$ is a horizontal stretch with scale factor $\\frac{1}{a}$: divide every $x$-coordinate by $a$.',
    },
    check: {
      optionValues: ['8,-2', '2,-2', '4,-4', '2,-4'],
      compute: () => preimagePoint([4, -2], (x) => 2 * x, (y) => y),
    },
  },
  {
    id: 'transformations-007',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of a quadratic function $y = f(x)$ has its vertex at $(3, 1)$. What is the vertex of the graph of $y = 2f(x - 1) + 4$?',
    options: ['$(4, 10)$', '$(2, 6)$', '$(4, 5)$', '$(4, 6)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Treat the $x$- and $y$-coordinates separately.\n\n' +
        '**$x$-coordinate (inside the bracket, do the opposite):** we need $x - 1 = 3$, so $x = 4$. The graph moves 1 unit right.\n\n' +
        '**$y$-coordinate (outside, do what you see, in the order of operations):** first multiply by 2, then add 4:\n\n' +
        '$$2 \\times 1 + 4 = 6$$\n\n' +
        'The vertex moves from $(3, 1)$ to $(4, 6)$. (The stretch factor 2 is positive, so the vertex is still a minimum or maximum of the same type.)',
      whyWrong: [
        'This adds 4 before multiplying by 2: $2 \\times (1 + 4) = 10$. In $2f(x - 1) + 4$ the output is doubled first and then 4 is added.',
        'This moves the vertex 1 unit to the left. Inside the bracket the sign is reversed: $x - 1$ means a move to the **right**.',
        'This adds 4 but forgets the vertical stretch: the $y$-value must be multiplied by 2 first ($2 \\times 1 = 2$).',
        null,
      ],
      keyIdea: 'For $y = af(x - h) + k$, a point $(p, q)$ moves to $(p + h, aq + k)$: multiply the $y$-value first, then add.',
    },
    check: {
      optionValues: ['4,10', '2,6', '4,5', '4,6'],
      compute: () => preimagePoint([3, 1], (x) => x - 1, (y) => 2 * y + 4),
    },
  },
  {
    id: 'transformations-008',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = x^2 - 4x + 7$ is translated 3 units to the left and 5 units down. What are the coordinates of the vertex of the new graph?',
    options: ['$(-1, -2)$', '$(5, -2)$', '$(-1, 8)$', '$(-5, -2)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: find the vertex of the original graph** by completing the square. Half of $-4$ is $-2$:\n\n' +
        '$$x^2 - 4x + 7 = (x - 2)^2 - 4 + 7 = (x - 2)^2 + 3$$\n\n' +
        'So the original vertex is $(2, 3)$.\n\n' +
        '**Step 2: move the vertex.**\n\n' +
        '- 3 units left: $x$-coordinate $2 - 3 = -1$\n' +
        '- 5 units down: $y$-coordinate $3 - 5 = -2$\n\n' +
        'New vertex: $(-1, -2)$. (The new equation is $y = (x + 1)^2 - 2$.)',
      whyWrong: [
        null,
        'This moves the vertex 3 units to the **right** ($2 + 3 = 5$) instead of to the left.',
        'This moves the vertex 5 units **up** ($3 + 5 = 8$) instead of down.',
        'This starts from the wrong vertex $(-2, 3)$. In $(x - 2)^2 + 3$ the bracket is zero when $x = 2$, so the vertex is at $x = 2$, not $x = -2$.',
      ],
      keyIdea: 'Find the vertex by completing the square, then a translation moves the vertex by exactly the same amounts.',
    },
    check: {
      optionValues: ['-1,-2', '5,-2', '-1,8', '-5,-2'],
      compute: () => {
        // new graph: left 3 means g(x) = f(x + 3), down 5 means subtract 5; find its lowest point by scanning
        const f = (x: number) => x * x - 4 * x + 7;
        const g = (x: number) => f(x + 3) - 5;
        let bx = -20;
        for (let x = -20; x <= 20; x += 0.5) if (g(x) < g(bx)) bx = x;
        return `${bx},${g(bx)}`;
      },
    },
  },
  {
    id: 'transformations-009',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = \\frac{1}{x}$ has asymptotes $x = 0$ and $y = 0$. It is transformed into the graph of $y = \\frac{1}{x - 2} + 3$. What are the asymptotes of the new graph?',
    options: ['$x = -2$ and $y = 3$', '$x = 3$ and $y = 2$', '$x = 2$ and $y = -3$', '$x = 2$ and $y = 3$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Write the new graph as $y = f(x - 2) + 3$ with $f(x) = \\frac{1}{x}$: a translation **2 right** and **3 up**. Asymptotes move with the graph.\n\n' +
        '- Vertical asymptote: $x = 0$ moves 2 right to $x = 2$. (Check: the denominator $x - 2$ is zero when $x = 2$, and you cannot divide by zero.)\n' +
        '- Horizontal asymptote: $y = 0$ moves 3 up to $y = 3$. (Check: for very large $x$, $\\frac{1}{x - 2}$ is almost 0, so $y$ is almost 3.)\n\n' +
        'Asymptotes: $x = 2$ and $y = 3$.',
      whyWrong: [
        'This moves the vertical asymptote the wrong way. The denominator $x - 2$ is zero when $x = 2$, which is a shift 2 to the right.',
        'This swaps the two shifts. The number with $x$ inside the denominator controls the vertical asymptote; the number added outside controls the horizontal one.',
        'The $+3$ outside moves the whole graph **up** 3, so the horizontal asymptote rises from $y = 0$ to $y = 3$.',
        null,
      ],
      keyIdea: 'Asymptotes move exactly like the graph: $y = \\frac{1}{x - h} + k$ has asymptotes $x = h$ and $y = k$.',
    },
    check: {
      optionValues: ['-2,3', '3,2', '2,-3', '2,3'],
      compute: () => {
        const g = (x: number) => 1 / (x - 2) + 3;
        let va = NaN;
        for (let x = -10; x <= 10; x += 0.5) if (Math.abs(g(x + 1e-7)) > 1e5) va = x;
        const ha = Math.round(g(1e9) * 1e6) / 1e6;
        return `${va},${ha}`;
      },
    },
  },
  {
    id: 'transformations-010',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = 2^x$ is reflected in the $x$-axis and **then** translated 3 units up. Which statement about the new graph is correct?',
    options: [
      'Horizontal asymptote $y = 0$; $y$-intercept $(0, 2)$',
      'Horizontal asymptote $y = 3$; $y$-intercept $(0, 4)$',
      'Horizontal asymptote $y = 3$; $y$-intercept $(0, 2)$',
      'Horizontal asymptote $y = -3$; $y$-intercept $(0, -4)$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Build the equation one step at a time.\n\n' +
        '1. Reflect in the $x$-axis: $y = -2^x$.\n' +
        '2. Translate 3 up: $y = -2^x + 3 = 3 - 2^x$.\n\n' +
        '**Asymptote:** $y = 2^x$ has asymptote $y = 0$. Reflecting keeps it at $y = 0$, then moving up 3 gives $y = 3$. (Check: when $x$ is very negative, $2^x$ is almost 0, so $y$ is almost 3.)\n\n' +
        '**$y$-intercept:** put $x = 0$: $y = 3 - 2^0 = 3 - 1 = 2$, so $(0, 2)$.',
      whyWrong: [
        'The $y$-intercept is right, but the asymptote moves with the graph: shifting up 3 moves $y = 0$ to $y = 3$.',
        'This forgets the reflection: $2^0 + 3 = 4$. After reflecting, the curve passes through $(0, -1)$, and moving up 3 gives $(0, 2)$.',
        null,
        'This translates first and reflects afterwards: $-(2^x + 3) = -2^x - 3$. The question says reflect **then** translate.',
      ],
      keyIdea: 'Apply the steps in the order given, then read off the asymptote (it moves only with vertical shifts) and put $x = 0$ for the $y$-intercept.',
    },
    check: {
      optionValues: ['0,2', '3,4', '3,2', '-3,-4'],
      compute: () => {
        const reflected = (x: number) => -(2 ** x);
        const g = (x: number) => reflected(x) + 3;
        const ha = Math.round(g(-60) * 1e6) / 1e6;
        return `${ha},${g(0)}`;
      },
    },
  },
  {
    id: 'transformations-011',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = f(x)$ crosses the $x$-axis only at $x = -2$ and $x = 6$. Where does the graph of $y = 3f\\left(\\frac{1}{2}x\\right)$ cross the $x$-axis?',
    options: ['$x = -1$ and $x = 3$', '$x = -4$ and $x = 12$', '$x = -2$ and $x = 6$', '$x = -6$ and $x = 18$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The graph crosses the $x$-axis where $y = 0$, i.e. where $3f\\left(\\frac{1}{2}x\\right) = 0$, i.e. where $f\\left(\\frac{1}{2}x\\right) = 0$.\n\n' +
        '**The 3 outside:** a vertical stretch. A point with $y = 0$ stays at $y = 3 \\times 0 = 0$, so it does not change the roots.\n\n' +
        '**The $\\frac{1}{2}$ inside:** $f$ is zero when its input is $-2$ or $6$, so we need\n\n' +
        '$$\\frac{1}{2}x = -2 \\Rightarrow x = -4 \\qquad \\frac{1}{2}x = 6 \\Rightarrow x = 12$$\n\n' +
        'So the new graph crosses the $x$-axis at $x = -4$ and $x = 12$ (a horizontal stretch with scale factor 2).',
      whyWrong: [
        'This halves the roots. Inside the bracket the effect is reversed: multiplying $x$ by $\\frac{1}{2}$ stretches the graph horizontally by factor 2, so the roots double.',
        null,
        'This correctly notices that the vertical stretch by 3 keeps the roots fixed, but forgets the horizontal stretch caused by $\\frac{1}{2}x$.',
        'This applies the factor 3 to the $x$-coordinates. The 3 is outside the function, so it only stretches vertically, and points on the $x$-axis stay where they are.',
      ],
      keyIdea: 'Vertical stretches never move roots; a horizontal stretch $f(ax)$ divides every root by $a$.',
    },
    check: {
      optionValues: ['-1,3', '-4,12', '-2,6', '-6,18'],
      compute: () => {
        const f = (x: number) => (x + 2) * (x - 6); // any f with roots exactly -2 and 6
        const g = (x: number) => 3 * f(x / 2);
        const roots: number[] = [];
        for (let x = -50; x <= 50; x += 0.5) if (Math.abs(g(x)) < 1e-12) roots.push(x);
        return roots.join(',');
      },
    },
  },
  {
    id: 'transformations-012',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'Let $f(x) = 2x^2 - 3x + 1$. The graph of $y = f(x)$ is reflected in the $y$-axis. What is the equation of the new graph?',
    options: ['$y = -2x^2 + 3x - 1$', '$y = -2x^2 + 3x + 1$', '$y = 2x^2 + 3x + 1$', '$y = -2x^2 - 3x - 1$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A reflection in the $y$-axis is $y = f(-x)$: replace **every** $x$ with $(-x)$.\n\n' +
        '$$f(-x) = 2(-x)^2 - 3(-x) + 1$$\n\n' +
        '- $(-x)^2 = x^2$ (a negative squared is positive), so $2(-x)^2 = 2x^2$.\n' +
        '- $-3(-x) = +3x$.\n' +
        '- The constant 1 has no $x$, so it does not change.\n\n' +
        'So $y = 2x^2 + 3x + 1$.\n\n' +
        'Check at $x = 2$: the new graph should equal the old graph at $x = -2$. Old: $f(-2) = 8 + 6 + 1 = 15$. New: $2(4) + 3(2) + 1 = 15$. They match.',
      whyWrong: [
        'This is $-f(x)$, a reflection in the $x$-axis: every sign has been changed. A reflection in the $y$-axis changes the sign of $x$ only.',
        'This treats $(-x)^2$ as $-x^2$. Squaring a negative gives a positive, $(-x)^2 = x^2$, so the $x^2$ term keeps its sign.',
        null,
        'This is $-f(-x)$, which reflects in **both** axes. A reflection in the $y$-axis alone is just $f(-x)$.',
      ],
      keyIdea: '$y = f(-x)$ reflects in the $y$-axis: replace every $x$ with $(-x)$, so only the odd powers of $x$ change sign.',
    },
    check: {
      // value of each option at x = 2
      optionValues: [-3, -1, 15, -15],
      compute: () => imageHeight((x) => 2 * x * x - 3 * x + 1, (a) => -a, (y) => y, 2),
    },
  },
  {
    id: 'transformations-013',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = f(x)$ has a **maximum** point at $(2, 5)$. Which of the following is true for the graph of $y = 4 - f(x)$?',
    options: [
      'It has a maximum point at $(2, -1)$',
      'It has a minimum point at $(2, -1)$',
      'It has a maximum point at $(2, 9)$',
      'It has a minimum point at $(-2, -1)$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Rewrite: $y = 4 - f(x) = -f(x) + 4$. Both changes are **outside** the function, so only $y$-values change, in this order:\n\n' +
        '1. $-f(x)$: reflect in the $x$-axis. $(2, 5) \\to (2, -5)$. The graph is turned upside down, so the hilltop (maximum) becomes a valley (**minimum**).\n' +
        '2. $+4$: move up 4. $(2, -5) \\to (2, -1)$.\n\n' +
        'So the new graph has a **minimum** point at $(2, -1)$.',
      whyWrong: [
        'The coordinates are right, but reflecting in the $x$-axis turns the graph upside down, so a maximum becomes a minimum.',
        null,
        'This adds 4 to 5 and ignores the minus sign in front of $f(x)$, which reflects the graph.',
        'This also changes the sign of $x$. That would need $f(-x)$; here the minus is outside the function, so only $y$-values change.',
      ],
      keyIdea: 'A reflection in the $x$-axis swaps maximum points and minimum points; $x$-coordinates of turning points do not change.',
    },
  },
  {
    id: 'transformations-014',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = x^2$ is stretched vertically with scale factor 2, then translated 3 units to the right and 1 unit down. What is the equation of the new graph?',
    options: ['$y = 2x^2 + 12x + 17$', '$y = 2x^2 - 12x + 16$', '$y = 2x^2 - 6x + 17$', '$y = 2x^2 - 12x + 17$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Apply the steps in order.\n\n' +
        '1. Vertical stretch, factor 2: $y = 2x^2$.\n' +
        '2. 3 units right: replace $x$ with $x - 3$: $y = 2(x - 3)^2$.\n' +
        '3. 1 unit down: subtract 1: $y = 2(x - 3)^2 - 1$.\n\n' +
        'Expand: $(x - 3)^2 = x^2 - 6x + 9$, so\n\n' +
        '$$y = 2(x^2 - 6x + 9) - 1 = 2x^2 - 12x + 18 - 1 = 2x^2 - 12x + 17$$\n\n' +
        'Quick check: the vertex should be $(3, -1)$. At $x = 3$: $2(9) - 36 + 17 = -1$.',
      whyWrong: [
        'This equals $2(x + 3)^2 - 1$, which moves the graph 3 units to the **left**. Moving right by 3 replaces $x$ with $x - 3$.',
        'This equals $2\\left((x - 3)^2 - 1\\right)$: the translation down was done before the stretch, so the $-1$ was also doubled to $-2$.',
        'This expands $(x - 3)^2$ as $x^2 - 3x + 9$, forgetting that the middle term is $2 \\times (-3)x = -6x$.',
        null,
      ],
      keyIdea: 'Build the equation step by step in the given order (vertex form $a(x - h)^2 + k$), then expand carefully.',
    },
    check: {
      // value of each option at x = 1
      optionValues: [31, 6, 13, 7],
      compute: () => imageHeight((x) => x * x, (a) => a + 3, (y) => 2 * y - 1, 1),
    },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'transformations-015',
    subtopic: 'transformations',
    difficulty: 'challenge',
    stem: 'The point $(4, 1)$ lies on the graph of $y = f(x)$. Which point must lie on the graph of $y = f(2x + 6)$?',
    options: ['$(14, 1)$', '$(-1, 1)$', '$(5, 1)$', '$(-4, 1)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Only the inside of the bracket changed, so only $x$ changes; the height stays $f(4) = 1$.\n\n' +
        '**Method 1 (solve):** the new graph has height $f(4)$ where the input equals 4:\n\n' +
        '$$2x + 6 = 4 \\Rightarrow 2x = -2 \\Rightarrow x = -1$$\n\n' +
        '**Method 2 (factorise):** $f(2x + 6) = f\\big(2(x + 3)\\big)$. Starting from $(4, 1)$: horizontal stretch factor $\\frac{1}{2}$ gives $(2, 1)$, then 3 units left gives $(-1, 1)$.\n\n' +
        'Both methods give $(-1, 1)$.',
      whyWrong: [
        'This applies the operations to the $x$-coordinate directly ($2 \\times 4 + 6 = 14$). Changes inside the bracket must be undone: solve $2x + 6 = 4$.',
        null,
        'This adds 6 instead of subtracting it: $\\frac{4 + 6}{2} = 5$. Solving $2x + 6 = 4$ means subtracting 6 first.',
        'This halves and then subtracts 6 ($\\frac{4}{2} - 6 = -4$), treating it as a shift of 6. Since $2x + 6 = 2(x + 3)$, the shift is only 3 units.',
      ],
      keyIdea: 'For $f(bx + c)$ find the new $x$ by solving $bx + c = $ old $x$ (or factor as $f\\big(b(x + \\frac{c}{b})\\big)$: the shift is $\\frac{c}{b}$, not $c$).',
    },
    check: {
      optionValues: ['14,1', '-1,1', '5,1', '-4,1'],
      compute: () => preimagePoint([4, 1], (x) => 2 * x + 6, (y) => y),
    },
  },
  {
    id: 'transformations-016',
    subtopic: 'transformations',
    difficulty: 'challenge',
    stem: 'Under the transformation $y = f(x) \\to y = af(x - b)$, where $a$ and $b$ are constants, the point $(2, 3)$ on the graph of $y = f(x)$ is mapped to the point $(5, -6)$. Find $a$ and $b$.',
    options: ['$a = -2$, $b = -3$', '$a = 2$, $b = 3$', '$a = -2$, $b = 3$', '$a = -9$, $b = 3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Under $y = af(x - b)$ a point $(p, q)$ moves to $(p + b, aq)$: $x - b$ inside moves the graph $b$ units right, and $a$ outside multiplies the $y$-value.\n\n' +
        '**$x$-coordinates:** $2 + b = 5$, so $b = 3$.\n\n' +
        '**$y$-coordinates:** $a \\times 3 = -6$, so $a = -2$.\n\n' +
        'Check: with $a = -2$, $b = 3$ the point on $y = -2f(x - 3)$ at $x = 5$ has height $-2f(5 - 3) = -2f(2) = -2 \\times 3 = -6$. Correct.\n\n' +
        'So $a = -2$ (vertical stretch factor 2 with a reflection in the $x$-axis) and $b = 3$.',
      whyWrong: [
        'This gets the sign of $b$ backwards. With $b = -3$ the bracket is $x + 3$, which moves the graph 3 units **left**, to $x = -1$, not $x = 5$.',
        'This ignores the sign change of the $y$-value: with $a = 2$ the image would be $(5, 6)$. Going from $3$ to $-6$ needs a negative multiplier.',
        null,
        'This treats the change in $y$ as a translation ($3 + (-9) = -6$). But $a$ **multiplies** the $y$-value: $3a = -6$.',
      ],
      keyIdea: 'Match coordinates separately: horizontal changes come from inside the bracket ($p + b$), vertical changes from outside ($aq$).',
    },
    check: {
      optionValues: ['-2,-3', '2,3', '-2,3', '-9,3'],
      compute: () => {
        const found: string[] = [];
        for (let a = -10; a <= 10; a++)
          for (let b = -10; b <= 10; b++) {
            if (a === 0) continue;
            if (preimagePoint([2, 3], (x) => x - b, (y) => a * y) === '5,-6') found.push(`${a},${b}`);
          }
        return found.join('|');
      },
    },
  },
  {
    id: 'transformations-017',
    subtopic: 'transformations',
    difficulty: 'challenge',
    stem: 'The graph of $y = \\frac{1}{x}$ is translated 1 unit to the left, then stretched vertically with scale factor 2, then reflected in the $x$-axis, then translated 3 units up. Where does the final graph cross the $x$-axis?',
    options: ['$x = -\\frac{1}{3}$', '$x = \\frac{5}{3}$', '$x = -\\frac{5}{3}$', '$x = \\frac{2}{3}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Build the equation one step at a time:\n\n' +
        '1. 1 unit left (replace $x$ with $x + 1$): $y = \\frac{1}{x + 1}$\n' +
        '2. Vertical stretch, factor 2: $y = \\frac{2}{x + 1}$\n' +
        '3. Reflect in the $x$-axis: $y = -\\frac{2}{x + 1}$\n' +
        '4. 3 units up: $y = 3 - \\frac{2}{x + 1}$\n\n' +
        'It crosses the $x$-axis where $y = 0$:\n\n' +
        '$$3 - \\frac{2}{x + 1} = 0 \\Rightarrow \\frac{2}{x + 1} = 3 \\Rightarrow x + 1 = \\frac{2}{3} \\Rightarrow x = \\frac{2}{3} - 1 = -\\frac{1}{3}$$\n\n' +
        'Check: $x + 1 = \\frac{2}{3}$, so $\\frac{2}{x + 1} = 3$ and $y = 3 - 3 = 0$.',
      whyWrong: [
        null,
        'This uses $x - 1$ in the denominator, which moves the graph 1 unit **right**. Moving left replaces $x$ with $x + 1$.',
        'This forgets the reflection: solving $3 + \\frac{2}{x + 1} = 0$ gives $x + 1 = -\\frac{2}{3}$, so $x = -\\frac{5}{3}$.',
        'This forgets the translation 1 unit left and solves $3 - \\frac{2}{x} = 0$, giving $x = \\frac{2}{3}$.',
      ],
      keyIdea: 'For a chain of transformations, write the equation after each step in the order given, then solve $y = 0$ for the $x$-intercept.',
    },
    check: {
      optionValues: [-1 / 3, 5 / 3, -5 / 3, 2 / 3],
      compute: () => {
        const f0 = (x: number) => 1 / x;
        const f1 = (x: number) => f0(x + 1); // 1 left
        const f2 = (x: number) => 2 * f1(x); // vertical stretch 2
        const f3 = (x: number) => -f2(x); // reflect in x-axis
        const f4 = (x: number) => f3(x) + 3; // 3 up
        // for x > -1, f4 is increasing; for x < -1, f4 > 3 > 0, so the only root is in (-1, 100)
        return bisect(f4, -0.999999, 100);
      },
    },
  },
  {
    id: 'transformations-018',
    subtopic: 'transformations',
    difficulty: 'challenge',
    stem: 'The graph of $y = f(x)$ is reflected in the $y$-axis and **then** translated 2 units to the right. Which is the equation of the final graph?',
    options: ['$y = f(-x - 2)$', '$y = f(2 - x)$', '$y = -f(x - 2)$', '$y = f(-x) - 2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work one step at a time, and remember each horizontal change replaces **every** $x$.\n\n' +
        '1. Reflect in the $y$-axis: replace $x$ with $-x$: $y = f(-x)$.\n' +
        '2. Translate 2 right: replace $x$ with $(x - 2)$ **everywhere**: $y = f\\big(-(x - 2)\\big) = f(2 - x)$.\n\n' +
        'Check with a point: if $(1, 7)$ is on $y = f(x)$, reflecting gives $(-1, 7)$ and moving right 2 gives $(1, 7)$. On $y = f(2 - x)$ at $x = 1$: $f(2 - 1) = f(1) = 7$. Correct.\n\n' +
        'On $y = f(-x - 2)$ at $x = 1$ we would get $f(-3)$, which is not the right height in general.',
      whyWrong: [
        'This just writes "$-2$" after the $-x$. But a move right by 2 must replace every $x$: $-(x - 2) = 2 - x$. The graph of $f(-x - 2)$ is the reflected graph moved 2 units **left**.',
        null,
        'This reflects in the $x$-axis (minus outside the function) instead of the $y$-axis.',
        'This moves the reflected graph 2 units **down**. A change outside the function is vertical, not horizontal.',
      ],
      keyIdea: 'Horizontal transformations act on $x$ itself: to move $f(-x)$ right by 2, replace $x$ with $x - 2$ to get $f(-(x - 2)) = f(2 - x)$.',
    },
    check: {
      // test function f(t) = t^3 + 1; value of each option at x = 5
      optionValues: [-342, -26, -28, -126],
      compute: () => imageHeight((t) => t ** 3 + 1, (a) => -a + 2, (y) => y, 5),
    },
  },
  {
    id: 'transformations-019',
    subtopic: 'transformations',
    difficulty: 'challenge',
    stem: 'The table shows some values of a function $f$. The function $g$ is defined by $g(x) = 3 - 2f(1 - x)$. Find $g(2)$.',
    table: {
      headers: ['$x$', '$-3$', '$-2$', '$-1$', '$0$', '$1$', '$2$', '$3$'],
      rows: [['$f(x)$', 7, 4, 5, -1, 2, 6, -2]],
    },
    options: ['$-7$', '$-1$', '$7$', '$-11$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Work from the inside out.\n\n' +
        '1. Input to $f$: $1 - x = 1 - 2 = -1$.\n' +
        '2. Read from the table: $f(-1) = 5$.\n' +
        '3. Outside: multiply by 2 first, then subtract from 3: $g(2) = 3 - 2 \\times 5 = 3 - 10 = -7$.\n\n' +
        'So $g(2) = -7$.',
      whyWrong: [
        null,
        'This uses $f(1) = 2$, reading $1 - x$ as $x - 1$: then $3 - 2 \\times 2 = -1$. With $x = 2$, $1 - x = -1$.',
        'This uses $f(3) = -2$, i.e. the input $x + 1$: then $3 - 2 \\times (-2) = 7$. The input is $1 - x = -1$.',
        'This uses $f(-3) = 7$, writing $1 - x$ as $-(x + 1)$ (a sign slip): then $3 - 2 \\times 7 = -11$. In fact $1 - x = -(x - 1)$.',
      ],
      keyIdea: 'To evaluate a transformed function, work from the inside out: find the input to $f$, look up $f$, then apply the outside operations.',
    },
    check: {
      optionValues: [-7, -1, 7, -11],
      compute: () => {
        const xs = [-3, -2, -1, 0, 1, 2, 3];
        const fs = [7, 4, 5, -1, 2, 6, -2];
        const f = (x: number) => fs[xs.indexOf(x)];
        const g = (x: number) => 3 - 2 * f(1 - x);
        return g(2);
      },
    },
  },
];
