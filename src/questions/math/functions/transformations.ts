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
      asking: 'Where does the point $(3, 5)$ move to when we add 2 to the function?',
      solution:
        '$(3, 5)$ on the graph of $y = f(x)$ means that when $x = 3$, the output is 5. So $f(3) = 5$.\n\n' +
        '$y = f(x) + 2$ uses the same input and then adds 2 to the output. So at $x = 3$ the new output is $f(3) + 2 = 5 + 2 = 7$.\n\n' +
        'The $x$-value hasn\'t changed, because the $+2$ is outside the bracket. So the point moves straight up by 2, to $(3, 7)$.',
      conclusion: 'Adding 2 outside the bracket raises the height only, so the new point is $(3, 7)$.',
      whyWrong: [
        'This moves the point 2 units to the right. The $+2$ is outside the bracket, so it acts on the $y$-value, not on $x$.',
        'This moves the point 2 units to the left, treating the $+2$ as a horizontal shift. That would be $y = f(x + 2)$, with the 2 inside the bracket.',
        null,
        'This subtracts 2. Adding 2 outside the function moves the graph **up**, so the $y$-coordinate increases.',
      ],
      keyIdea: 'A number added outside the bracket changes only the $y$-coordinate: $y = f(x) + k$ sends $(a, b)$ to $(a, b + k)$. So the graph moves up by $k$, or down if $k$ is negative.',
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
      asking: 'Which way, and how far, does the graph move when $x$ becomes $x - 4$ inside the bracket?',
      solution:
        'A **translation** slides a graph without changing its shape. A change inside the bracket affects the input $x$, so the graph slides sideways, not up or down.\n\n' +
        'To see which way, follow one point. Suppose $f(0) = 7$, so the original graph has height 7 at $x = 0$.\n\n' +
        'On $y = f(x - 4)$, the bracket must equal 0 to give that same height. Solve $x - 4 = 0$ by adding 4 to both sides: $x = 4$.\n\n' +
        'So the height that was at $x = 0$ is now at $x = 4$. Every point has moved 4 units in the direction of increasing $x$, which is to the right.',
      conclusion: 'Each height now appears 4 units later along the $x$-axis, so the answer is a translation of 4 units to the right.',
      whyWrong: [
        'This is the most common slip: $-4$ looks like it should mean "left", but inside the bracket the effect is reversed. $f(x - 4)$ reaches each height 4 units *later*, so the graph moves right.',
        null,
        'A change outside the bracket moves the graph vertically. Here the $-4$ is inside the bracket, so the move is horizontal.',
        'That would be $y = f(x) - 4$, where the 4 is subtracted outside the function.',
      ],
      keyIdea: 'Inside the bracket, the sign does the opposite of what it looks like: $f(x - a)$ moves right by $a$, and $f(x + a)$ moves left by $a$. To test it, solve bracket $= 0$ to see where the old $x = 0$ goes.',
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
      asking: 'Where does the point $(2, -6)$ move to when the whole function is made negative?',
      solution:
        '$(2, -6)$ on $y = f(x)$ means $f(2) = -6$: when the input is 2, the output is $-6$.\n\n' +
        '$y = -f(x)$ takes the same input and changes the sign of the output. The minus is outside the bracket, so $x$ is not touched.\n\n' +
        'At $x = 2$, the new output is $-f(2) = -(-6) = 6$. So the point is $(2, 6)$.',
      conclusion: 'The $x$-value stays at 2 and the height changes sign, so the new point is $(2, 6)$.',
      whyWrong: [
        'This changes the sign of $x$, which is a reflection in the $y$-axis: that is what $y = f(-x)$ does (minus **inside** the bracket).',
        'This changes both signs, a reflection in both axes, which is $y = -f(-x)$. Here the minus is only outside, so only $y$ changes.',
        'This swaps the coordinates, $(2, -6) \\to (-6, 2)$, which is a reflection in the line $y = x$ (the graph of the inverse function), not a reflection in the $x$-axis.',
        null,
      ],
      keyIdea: 'A minus outside, $-f(x)$, changes the sign of $y$ only: a reflection in the $x$-axis. A minus inside, $f(-x)$, changes the sign of $x$ only: a reflection in the $y$-axis.',
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
    options: ['Vertical stretch, scale factor $3$', 'Horizontal stretch, scale factor $3$', 'Horizontal stretch, scale factor $\\frac{1}{3}$', 'Translation of $3$ units up'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does multiplying a function by 3 do to its graph?',
      solution:
        'In $y = 3f(x)$, the 3 is outside the bracket, so the input $x$ is unchanged. Only the outputs (the heights) change, and each one is multiplied by 3.\n\n' +
        'Try some points: $(2, 5)$ moves to $(2, 15)$, and $(4, -1)$ moves to $(4, -3)$. Each point ends up 3 times as far from the $x$-axis as it was.\n\n' +
        'Moving points away from the $x$-axis like this is called a **vertical stretch**. The **scale factor** is the number each height is multiplied by, which here is 3.',
      conclusion: 'Every height is multiplied by 3 while $x$ stays put, so the answer is vertical stretch, scale factor $3$.',
      whyWrong: [
        null,
        'Multiplying outside the function changes the $y$-values. A horizontal stretch by factor 3 would be $y = f\\left(\\frac{x}{3}\\right)$, with the change inside the bracket.',
        'That is $y = f(3x)$, where the 3 multiplies $x$ inside the bracket and squashes the graph towards the $y$-axis.',
        'That would be $y = f(x) + 3$. Adding 3 shifts the graph; multiplying by 3 stretches it.',
      ],
      keyIdea: 'A number multiplying outside the bracket, $af(x)$, is a vertical stretch with scale factor $a$. A number multiplying $x$ inside, $f(ax)$, is a horizontal stretch with scale factor $\\frac{1}{a}$. A number added is a translation.',
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
      asking: 'What equation do we get when the curve $y = x^2$ slides 5 units left?',
      solution:
        'A **translation** slides a graph without changing its shape. Moving sideways changes the input, so the change goes inside the bracket, with $x$.\n\n' +
        'The lowest point of $y = x^2$ is at $x = 0$, because the thing being squared is 0 there. After moving 5 to the left, the lowest point must be at $x = -5$.\n\n' +
        'So we need a bracket that is 0 when $x = -5$. Try $x + 5$: at $x = -5$ it gives $-5 + 5 = 0$, which works.\n\n' +
        'Square that bracket in place of $x$: $y = (x + 5)^2$.',
      conclusion: 'The lowest point is now where $x + 5 = 0$, at $x = -5$, so the equation is $y = (x + 5)^2$.',
      whyWrong: [
        'This moves the graph 5 units to the **right**: the vertex of $y = (x - 5)^2$ is at $x = 5$. Inside the bracket the sign works the opposite way.',
        'Adding 5 outside the function moves the graph 5 units **up**, not left.',
        null,
        'Subtracting 5 outside the function moves the graph 5 units **down**, not left.',
      ],
      keyIdea: 'To move a graph left by $a$, replace $x$ with $(x + a)$. To move it right by $a$, replace $x$ with $(x - a)$. To test it, solve bracket $= 0$ and see where the lowest point lands.',
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
      asking: 'Where does the point $(4, -2)$ move to when $x$ becomes $2x$ inside the bracket?',
      solution:
        '$(4, -2)$ on $y = f(x)$ means that when the input to $f$ is 4, the output is $-2$. So $f(4) = -2$.\n\n' +
        'On $y = f(2x)$, the input to $f$ is $2x$. To get the same output $-2$, that input must be 4: $2x = 4$.\n\n' +
        'Divide both sides by 2: $x = 2$. So at $x = 2$ the new graph has height $-2$, which is the point $(2, -2)$.',
      conclusion: 'The bracket needs $2x = 4$, which halves the $x$-coordinate and leaves the height alone, so the point is $(2, -2)$.',
      whyWrong: [
        'This multiplies the $x$-coordinate by 2. Inside the bracket the effect is the opposite: $f(2x)$ is a horizontal stretch with scale factor $\\frac{1}{2}$, so $x$ is halved.',
        null,
        'This doubles the $y$-coordinate, which is what $y = 2f(x)$ does (a vertical stretch). The 2 here is inside the bracket.',
        'This halves $x$ correctly but also doubles $y$. $f(2x)$ changes only the $x$-coordinates.',
      ],
      keyIdea: 'For a point on $y = f(\\text{something})$, set the bracket equal to the old $x$-coordinate and solve. The height stays the same. So $f(2x)$ halves $x$-coordinates, and $f\\left(\\frac{1}{2}x\\right)$ doubles them.',
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
      asking: 'Where does the turning point $(3, 1)$ end up on the new graph?',
      solution:
        'The **vertex** is the turning point of the curve. We can track it like any other point, handling $x$ and $y$ separately. Here $f(3) = 1$.\n\n' +
        'Find the new $x$. The value we want to use is $f(3)$, so the bracket must equal 3: $x - 1 = 3$. Add 1 to both sides: $x = 4$.\n\n' +
        'Find the new $y$. At that $x$, the equation gives $2f(3) + 4$. Replace $f(3)$ with 1: $2 \\times 1 + 4$.\n\n' +
        'Follow the order in the equation: multiply first, then add. $2 \\times 1 = 2$, and $2 + 4 = 6$. So the new vertex has $x = 4$ and $y = 6$.',
      conclusion: 'Stretches and translations carry the turning point along with them, so the new vertex is $(4, 6)$.',
      whyWrong: [
        'This adds 4 before multiplying by 2: $2 \\times (1 + 4) = 10$. In $2f(x - 1) + 4$ the output is doubled first and then 4 is added.',
        'This moves the vertex 1 unit to the left. Inside the bracket the sign is reversed: $x - 1$ means a move to the **right**.',
        'This adds 4 but forgets the vertical stretch: the $y$-value must be multiplied by 2 first ($2 \\times 1 = 2$).',
        null,
      ],
      keyIdea: 'Under $y = af(x - h) + k$, a point $(p, q)$ moves to $(p + h, aq + k)$. For $x$, solve bracket $= p$. For $y$, multiply by $a$ first, and then add $k$.',
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
      asking: 'Where is the turning point of this curve after it slides left and down?',
      solution:
        'The **vertex** is the turning point of the parabola. A translation slides every point the same way, including the vertex. So find the vertex, then move it.\n\n' +
        'Find the vertex by completing the square. Halve the $-4$ to get $-2$, so use the bracket $(x - 2)^2$, which expands to $x^2 - 4x + 4$.\n\n' +
        'We need $+7$, not $+4$, so add 3: $x^2 - 4x + 7 = (x - 2)^2 + 3$.\n\n' +
        'A square is never negative, so the lowest value of $(x - 2)^2$ is 0, when $x = 2$. At that point $y = 0 + 3 = 3$. So the vertex is $(2, 3)$.\n\n' +
        'Now move it. Left 3 means subtract 3 from $x$: $2 - 3 = -1$. Down 5 means subtract 5 from $y$: $3 - 5 = -2$.',
      conclusion: 'Starting at $(2, 3)$ and moving left 3 and down 5, the new vertex is $(-1, -2)$.',
      whyWrong: [
        null,
        'This moves the vertex 3 units to the **right** ($2 + 3 = 5$) instead of to the left.',
        'This moves the vertex 5 units **up** ($3 + 5 = 8$) instead of down.',
        'This starts from the wrong vertex $(-2, 3)$. In $(x - 2)^2 + 3$ the bracket is zero when $x = 2$, so the vertex is at $x = 2$, not $x = -2$.',
      ],
      keyIdea: 'For a translated parabola, find the vertex by completing the square or with $x = -\\frac{b}{2a}$. Then change its coordinates directly: right adds to $x$, left subtracts, up adds to $y$, down subtracts. No new equation is needed.',
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
      asking: 'Which vertical and horizontal lines does the new graph approach but never touch?',
      solution:
        'An **asymptote** is a line that a graph gets closer and closer to but never reaches. A vertical one sits where the function breaks. A horizontal one is the height the graph settles at for huge $x$.\n\n' +
        'Vertical asymptote: the fraction breaks when its bottom is 0, since we can\'t divide by 0. Solve $x - 2 = 0$ by adding 2 to both sides: $x = 2$.\n\n' +
        'Horizontal asymptote: when $x$ is huge, say 1,000,000, the fraction $\\frac{1}{x - 2}$ is almost 0. So $y$ is almost $0 + 3 = 3$. It never quite gets there, because a fraction with 1 on top is never exactly 0. So the line is $y = 3$.',
      conclusion: 'The bottom is 0 at $x = 2$ and the graph settles at height 3, so the asymptotes are $x = 2$ and $y = 3$.',
      whyWrong: [
        'This moves the vertical asymptote the wrong way. The denominator $x - 2$ is zero when $x = 2$, which is a shift 2 to the right.',
        'This swaps the two shifts. The number with $x$ inside the denominator controls the vertical asymptote; the number added outside controls the horizontal one.',
        'The $+3$ outside moves the whole graph **up** 3, so the horizontal asymptote rises from $y = 0$ to $y = 3$.',
        null,
      ],
      keyIdea: 'For $y = \\frac{a}{x - h} + k$, the vertical asymptote is where the bottom is 0, $x = h$. The horizontal asymptote is the number added on the end, $y = k$. The number on top, $a$, moves neither.',
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
      asking: 'After the flip and the slide, where is the asymptote and where does the graph cross the $y$-axis?',
      solution:
        'Apply the changes in the order given, starting from $y = 2^x$. Its **horizontal asymptote**, the flat line the graph approaches but never reaches, is $y = 0$. That is because $2^x$ gets close to 0 for very negative $x$, but never equals it.\n\n' +
        'Reflecting in the $x$-axis turns every output into its negative, so the equation becomes $y = -2^x$. The line $y = 0$ is the mirror itself, so the asymptote stays where it is.\n\n' +
        'Translating up 3 adds 3 to every output: $y = -2^x + 3$. The asymptote moves up with the graph, to $y = 3$.\n\n' +
        'The $y$-intercept is where the graph crosses the $y$-axis, so where $x = 0$. There $2^0 = 1$, so $y = -1 + 3 = 2$. That is the point $(0, 2)$.',
      conclusion: 'The new graph is $y = -2^x + 3$, so the answer is: Horizontal asymptote $y = 3$; $y$-intercept $(0, 2)$.',
      whyWrong: [
        'The $y$-intercept is right, but the asymptote moves with the graph: shifting up 3 moves $y = 0$ to $y = 3$.',
        'This forgets the reflection: $2^0 + 3 = 4$. After reflecting, the curve passes through $(0, -1)$, and moving up 3 gives $(0, 2)$.',
        null,
        'This translates first and reflects afterwards: $-(2^x + 3) = -2^x - 3$. The question says reflect **then** translate.',
      ],
      keyIdea: 'Apply the transformations to the equation in order, one at a time. Then read off the features: for $y = a \\cdot b^x + c$, the asymptote is $y = c$, and setting $x = 0$ gives the $y$-intercept, $a + c$.',
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
      asking: 'Where does the new graph have a height of 0?',
      solution:
        'A graph crosses the $x$-axis where $y = 0$. So we need to solve $3f\\left(\\frac{1}{2}x\\right) = 0$.\n\n' +
        'Divide both sides by 3: $f\\left(\\frac{1}{2}x\\right) = 0$. So the 3 doesn\'t change the crossing points. A vertical stretch keeps a height of 0 at 0.\n\n' +
        'We know $f$ equals 0 only when its input is $-2$ or 6. Here its input is $\\frac{1}{2}x$. So $\\frac{1}{2}x = -2$ or $\\frac{1}{2}x = 6$.\n\n' +
        'Multiply each by 2 to get $x$ alone: $x = -4$ or $x = 12$.',
      conclusion: 'The crossing points double because of the $\\frac{1}{2}$ inside the bracket, so the answer is $x = -4$ and $x = 12$.',
      whyWrong: [
        'This halves the roots. Inside the bracket the effect is reversed: multiplying $x$ by $\\frac{1}{2}$ stretches the graph horizontally by factor 2, so the roots double.',
        null,
        'This correctly notices that the vertical stretch by 3 keeps the roots fixed, but forgets the horizontal stretch caused by $\\frac{1}{2}x$.',
        'This applies the factor 3 to the $x$-coordinates. The 3 is outside the function, so it only stretches vertically, and points on the $x$-axis stay where they are.',
      ],
      keyIdea: 'To find the new roots of $y = af(bx)$, set the bracket equal to each old root and solve. The outside number $a$ has no effect on roots, because $a \\times 0 = 0$.',
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
      asking: 'What is the equation of this curve after a left-right flip?',
      solution:
        'A reflection in the $y$-axis swaps left and right: the height at $x = 2$ moves to $x = -2$, and so on. In an equation, this means replacing $x$ with $-x$, which gives $y = f(-x)$.\n\n' +
        'Substitute, with brackets: $f(-x) = 2(-x)^2 - 3(-x) + 1$.\n\n' +
        'Work out the first term. $(-x)^2 = (-x) \\times (-x) = x^2$, since two negatives multiply to a positive. So it stays as $2x^2$.\n\n' +
        'Work out the second term: $-3 \\times (-x) = 3x$. The $+1$ has no $x$ in it, so it stays the same.\n\n' +
        'Put it together: $y = 2x^2 + 3x + 1$.',
      conclusion: 'Replacing $x$ with $-x$ flips only the sign of the $x$ term, so the new graph is $y = 2x^2 + 3x + 1$.',
      whyWrong: [
        'This is $-f(x)$, a reflection in the $x$-axis: every sign has been changed. A reflection in the $y$-axis changes the sign of $x$ only.',
        'This treats $(-x)^2$ as $-x^2$. Squaring a negative gives a positive, $(-x)^2 = x^2$, so the $x^2$ term keeps its sign.',
        null,
        'This is $-f(-x)$, which reflects in **both** axes. A reflection in the $y$-axis alone is just $f(-x)$.',
      ],
      keyIdea: 'Reflection in the $y$-axis: replace $x$ with $-x$, so even powers and constants keep their sign and odd powers flip. Reflection in the $x$-axis: put a minus in front of the whole function, so every sign flips.',
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
      asking: 'What happens to the highest point $(2, 5)$ on the graph of $y = 4 - f(x)$?',
      solution:
        'Rewrite the equation to see its parts: $y = 4 - f(x)$ is the same as $y = -f(x) + 4$. So there are two changes: a minus sign in front of $f$, then adding 4.\n\n' +
        'The minus sign reflects the graph in the $x$-axis, turning it upside down. So the maximum (highest point) becomes a **minimum** (lowest point). The height 5 becomes $-5$, giving $(2, -5)$.\n\n' +
        'Adding 4 moves the graph up 4 without changing its shape, so it is still a minimum. The height becomes $-5 + 4 = -1$.\n\n' +
        'Neither change touches $x$, since nothing happens inside the bracket. So the new point is a minimum with $x = 2$ and $y = -1$.',
      conclusion: 'The graph is flipped and then raised, so it has a minimum point at $(2, -1)$.',
      whyWrong: [
        'The coordinates are right, but reflecting in the $x$-axis turns the graph upside down, so a maximum becomes a minimum.',
        null,
        'This adds 4 to 5 and ignores the minus sign in front of $f(x)$, which reflects the graph.',
        'This also changes the sign of $x$. That would need $f(-x)$; here the minus is outside the function, so only $y$-values change.',
      ],
      keyIdea: 'Rewrite $c - f(x)$ as $-f(x) + c$, then apply it to the turning point: reflect first (maximum and minimum swap, and the height changes sign), then add $c$. The $x$-coordinate stays the same when everything happens outside the bracket.',
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
      asking: 'What is the expanded equation of $y = x^2$ after the stretch and the slides?',
      solution:
        'Apply each change to the equation in the order given. First, the stretch. A vertical stretch with scale factor 2 multiplies every output by 2: $y = 2x^2$.\n\n' +
        'Next, moving right 3 means replacing $x$ with $(x - 3)$. The sign looks opposite because the lowest point must now be where the bracket is 0, at $x = 3$. That gives $y = 2(x - 3)^2$.\n\n' +
        'Moving down 1 means subtracting 1 from every output: $y = 2(x - 3)^2 - 1$.\n\n' +
        'Expand the bracket by multiplying it by itself: $(x - 3)(x - 3) = x^2 - 3x - 3x + 9 = x^2 - 6x + 9$.\n\n' +
        'Multiply by 2: $2x^2 - 12x + 18$. Then subtract 1: $y = 2x^2 - 12x + 17$.',
      conclusion: 'Expanding $2(x - 3)^2 - 1$ gives $2x^2 - 12x + 18 - 1$, so the equation is $y = 2x^2 - 12x + 17$.',
      whyWrong: [
        'This equals $2(x + 3)^2 - 1$, which moves the graph 3 units to the **left**. Moving right by 3 replaces $x$ with $x - 3$.',
        'This equals $2\\left((x - 3)^2 - 1\\right)$: the translation down was done before the stretch, so the $-1$ was also doubled to $-2$.',
        'This expands $(x - 3)^2$ as $x^2 - 3x + 9$, forgetting that the middle term is $2 \\times (-3)x = -6x$.',
        null,
      ],
      keyIdea: 'Build the equation in the stated order: a stretch multiplies the outputs, a move right by $h$ replaces $x$ with $(x - h)$, and a move up by $k$ adds $k$. Expand only at the end.',
    },
    check: {
      // value of each option at x = 1
      optionValues: [31, 6, 13, 7],
      compute: () => imageHeight((x) => x * x, (a) => a + 3, (y) => 2 * y - 1, 1),
    },
  },
  {
    id: 'transformations-015',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The point $(4, 1)$ lies on the graph of $y = f(x)$. Which point must lie on the graph of $y = f(2x + 6)$?',
    options: ['$(14, 1)$', '$(-1, 1)$', '$(5, 1)$', '$(-4, 1)$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Where does the point $(4, 1)$ move to when the bracket becomes $2x + 6$?',
      solution:
        '$(4, 1)$ on $y = f(x)$ means $f(4) = 1$: when the input to $f$ is 4, the output is 1.\n\n' +
        'On $y = f(2x + 6)$, the input to $f$ is $2x + 6$. For the output to be 1 again, that input must be 4: $2x + 6 = 4$.\n\n' +
        'Subtract 6 from both sides: $2x = -2$.\n\n' +
        'Divide both sides by 2: $x = -1$. The height is unchanged, because nothing changed outside the bracket. So the point has $x = -1$ and $y = 1$.',
      conclusion: 'Testing: at $x = -1$ the bracket is $-2 + 6 = 4$, which gives $f(4) = 1$. So the point is $(-1, 1)$.',
      whyWrong: [
        'This applies the operations to the $x$-coordinate directly ($2 \\times 4 + 6 = 14$). Changes inside the bracket must be undone: solve $2x + 6 = 4$.',
        null,
        'This adds 6 instead of subtracting it: $\\frac{4 + 6}{2} = 5$. Solving $2x + 6 = 4$ means subtracting 6 first.',
        'This halves and then subtracts 6 ($\\frac{4}{2} - 6 = -4$), treating it as a shift of 6. Since $2x + 6 = 2(x + 3)$, the shift is only 3 units.',
      ],
      keyIdea: 'For a point on $y = f(\\text{expression})$, don\'t apply the operations to the old $x$. Set the expression equal to the old $x$ and solve: this gives the new $x$, and the height stays the same.',
    },
    check: {
      optionValues: ['14,1', '-1,1', '5,1', '-4,1'],
      compute: () => preimagePoint([4, 1], (x) => 2 * x + 6, (y) => y),
    },
  },
  {
    id: 'transformations-016',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'Under the transformation $y = f(x) \\to y = af(x - b)$, where $a$ and $b$ are constants, the point $(2, 3)$ on the graph of $y = f(x)$ is mapped to the point $(5, -6)$. Find $a$ and $b$.',
    options: ['$a = -2$, $b = -3$', '$a = 2$, $b = 3$', '$a = -2$, $b = 3$', '$a = -9$, $b = 3$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What must $a$ and $b$ be for $(2, 3)$ to land on $(5, -6)$?',
      solution:
        'Handle the two coordinates separately. We know $f(2) = 3$. In $y = af(x - b)$, $b$ changes the input and $a$ multiplies the output.\n\n' +
        'The new point has $x = 5$ and it must use $f(2)$. So the bracket must equal 2 when $x = 5$: $5 - b = 2$.\n\n' +
        'Solve it. Add $b$ to both sides: $5 = 2 + b$. Subtract 2: $b = 3$.\n\n' +
        'The new height is $a \\times f(2) = a \\times 3$, and the question says it is $-6$. So $3a = -6$.\n\n' +
        'Divide both sides by 3: $a = -2$.',
      conclusion: 'Testing: at $x = 5$, $-2 \\times f(5 - 3) = -2 \\times 3 = -6$, which matches. So the answer is $a = -2$, $b = 3$.',
      whyWrong: [
        'This gets the sign of $b$ backwards. With $b = -3$ the bracket is $x + 3$, which moves the graph 3 units **left**, to $x = -1$, not $x = 5$.',
        'This ignores the sign change of the $y$-value: with $a = 2$ the image would be $(5, 6)$. Going from $3$ to $-6$ needs a negative multiplier.',
        null,
        'This treats the change in $y$ as a translation ($3 + (-9) = -6$). But $a$ **multiplies** the $y$-value: $3a = -6$.',
      ],
      keyIdea: 'With $y = af(x - b)$ and a point $(p, q)$ mapped to $(r, s)$, split it in two. The input gives $r - b = p$, and the output gives $aq = s$. $a$ multiplies, so solve it by dividing, not subtracting.',
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
    id: 'transformations-018',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = f(x)$ is reflected in the $y$-axis and **then** translated 2 units to the right. Which is the equation of the final graph?',
    options: ['$y = f(-x - 2)$', '$y = f(2 - x)$', '$y = -f(x - 2)$', '$y = f(-x) - 2$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the equation after the left-right flip and then the slide to the right?',
      solution:
        'Apply the changes in the order given. Each one changes $x$ in the equation so far.\n\n' +
        'Reflecting $y = f(x)$ in the $y$-axis means replacing $x$ with $-x$. The equation becomes $y = f(-x)$.\n\n' +
        'Moving a graph 2 units right means replacing **every** $x$ with $(x - 2)$. The only $x$ in $f(-x)$ is the one after the minus sign, so we get $y = f(-(x - 2))$.\n\n' +
        'Multiply out the minus sign: $-(x - 2) = -x + 2$, which is the same as $2 - x$. So $y = f(2 - x)$.',
      conclusion: 'A point at $x = a$ reflects to $-a$ and slides to $2 - a$, where the bracket $2 - x$ equals $a$ again. So the equation is $y = f(2 - x)$.',
      whyWrong: [
        'This just writes "$-2$" after the $-x$. But a move right by 2 must replace every $x$: $-(x - 2) = 2 - x$. The graph of $f(-x - 2)$ is the reflected graph moved 2 units **left**.',
        null,
        'This reflects in the $x$-axis (minus outside the function) instead of the $y$-axis.',
        'This moves the reflected graph 2 units **down**. A change outside the function is vertical, not horizontal.',
      ],
      keyIdea: 'When several sideways changes are combined, change $x$ one step at a time: replace every $x$ in the current equation, keeping the brackets. Never just attach a number after $-x$. Then test with one point.',
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
    difficulty: 'exam',
    stem: 'The table shows some values of a function $f$. The function $g$ is defined by $g(x) = 3 - 2f(1 - x)$. Find $g(2)$.',
    table: {
      headers: ['$x$', '$-3$', '$-2$', '$-1$', '$0$', '$1$', '$2$', '$3$'],
      rows: [['$f(x)$', 7, 4, 5, -1, 2, 6, -2]],
    },
    options: ['$-7$', '$-1$', '$7$', '$-11$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What number does the rule for $g$ give when $x = 2$?',
      solution:
        '$g(x) = 3 - 2f(1 - x)$ is a rule. To find $g(2)$, replace each $x$ with 2: $g(2) = 3 - 2f(1 - 2)$.\n\n' +
        'Work out the bracket first, because the table needs one number as the input: $1 - 2 = -1$. So $g(2) = 3 - 2f(-1)$.\n\n' +
        'Read $f(-1)$ from the table. Find $-1$ in the $x$ row. The value below it is 5, so $f(-1) = 5$.\n\n' +
        'Substitute this value: $g(2) = 3 - 2 \\times 5$.\n\n' +
        'Multiply before subtracting: $2 \\times 5 = 10$, and $3 - 10 = -7$.',
      conclusion: 'The bracket gives $-1$, the table gives 5, and the arithmetic gives $3 - 10$, so the answer is $-7$.',
      whyWrong: [
        null,
        'This uses $f(1) = 2$, reading $1 - x$ as $x - 1$: then $3 - 2 \\times 2 = -1$. With $x = 2$, $1 - x = -1$.',
        'This uses $f(3) = -2$, i.e. the input $x + 1$: then $3 - 2 \\times (-2) = 7$. The input is $1 - x = -1$.',
        'This uses $f(-3) = 7$, writing $1 - x$ as $-(x + 1)$ (a sign slip): then $3 - 2 \\times 7 = -11$. In fact $1 - x = -(x - 1)$.',
      ],
      keyIdea: 'To evaluate a transformed function from a table: substitute, work out the bracket to get one number, read $f$ of that number from the table, then finish the arithmetic, multiplying before adding or subtracting.',
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
  {
    id: 'transformations-020',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'Which transformation maps the graph of $y = f(x)$ onto the graph of $y = -f(x)$?',
    options: ['Reflection in the $x$-axis', 'Reflection in the $y$-axis', 'Reflection in the line $y = x$', 'Translation of $1$ unit down'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does a minus sign in front of $f(x)$ do to the graph?',
      solution:
        'In $y = -f(x)$, the minus is outside the bracket. So the input stays the same and every output changes sign. For example, $(2, 5)$ moves to $(2, -5)$, and $(3, -4)$ moves to $(3, 4)$.\n\n' +
        'Each point stays at the same $x$ and goes to the opposite side of the $x$-axis, the same distance away. That is exactly what a mirror lying along the $x$-axis does.',
      conclusion: 'Every height changes sign while $x$ stays the same, so the answer is a reflection in the $x$-axis.',
      whyWrong: [
        null,
        'A reflection in the $y$-axis changes the inputs: that is $y = f(-x)$, with the minus sign inside the bracket.',
        'A reflection in $y = x$ swaps the coordinates, which gives the graph of the inverse function.',
        'A translation down is $y = f(x) - 1$. It subtracts from each output; it does not change their signs.',
      ],
      keyIdea: 'A minus outside the bracket, $-f(x)$, changes $y$ and reflects in the $x$-axis. A minus inside, $f(-x)$, changes $x$ and reflects in the $y$-axis. Try it on one point to decide.',
    },
  },
  {
    id: 'transformations-021',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'Which transformation maps the graph of $y = f(x)$ onto the graph of $y = f(-x)$?',
    options: ['Reflection in the $y$-axis', 'Reflection in the $x$-axis', 'Reflection in the line $y = x$', 'Translation of $1$ unit left'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does a minus sign in front of the $x$ inside the bracket do to the graph?',
      solution:
        'In $y = f(-x)$, the minus is inside the bracket. So it changes the input, not the output. Whatever height $f$ had at $x = 2$, the new graph has at $x = -2$.\n\n' +
        'So each point $(a, b)$ moves to $(-a, b)$. For example, $(2, 5)$ moves to $(-2, 5)$: the same height, on the opposite side of the $y$-axis. That is what a mirror lying along the $y$-axis does.',
      conclusion: 'Every point keeps its height and swaps sides, so the answer is a reflection in the $y$-axis.',
      whyWrong: [
        null,
        'A reflection in the $x$-axis changes the outputs: that is $y = -f(x)$, with the minus sign outside the bracket.',
        'A reflection in $y = x$ swaps the coordinates, which gives the graph of the inverse function.',
        'A translation left is $y = f(x + 1)$. Here each input changes sign; nothing is added to it.',
      ],
      keyIdea: 'Decide by where the minus is. Inside the bracket it acts on $x$: $f(-x)$ reflects in the $y$-axis. Outside it acts on $y$: $-f(x)$ reflects in the $x$-axis. To confirm, try the point $(2, 5)$.',
    },
  },
  {
    id: 'transformations-022',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'The graph of $y = f(x) - 6$ is the graph of $y = f(x)$ translated:',
    options: ['$6$ units down', '$6$ units up', '$6$ units left', '$6$ units right'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which way does the graph move when 6 is subtracted from $f(x)$?',
      solution:
        'The $-6$ is outside the bracket. So $x$ is unchanged, and we subtract 6 from every output. For example, a point $(2, 10)$ moves to $(2, 4)$.\n\n' +
        'Each point stays at the same $x$ and its height falls by 6. That is a move straight down by 6, with no change of shape.',
      conclusion: 'Every height falls by 6 while $x$ stays the same, so the graph moves $6$ units down.',
      whyWrong: [
        null,
        'Outside the bracket the sign means what it says: subtracting $6$ lowers every output.',
        'A horizontal move needs a change inside the bracket: $6$ units left is $y = f(x + 6)$.',
        'A horizontal move needs a change inside the bracket: $6$ units right is $y = f(x - 6)$.',
      ],
      keyIdea: 'Outside the bracket, the sign means what it says: $f(x) + k$ is up $k$, and $f(x) - k$ is down $k$. Inside the bracket it is reversed: $f(x + k)$ is left $k$, and $f(x - k)$ is right $k$.',
    },
  },
  {
    id: 'transformations-023',
    subtopic: 'transformations',
    difficulty: 'foundation',
    stem: 'Which transformation maps the graph of $y = f(x)$ onto the graph of $y = f(2x)$?',
    options: ['Horizontal stretch, scale factor $\\frac{1}{2}$', 'Horizontal stretch, scale factor $2$', 'Vertical stretch, scale factor $2$', 'Translation of $2$ units left'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does replacing $x$ with $2x$ inside the bracket do to the graph?',
      solution:
        'The 2 is inside the bracket, so it affects the inputs. That means a horizontal change, and the heights stay the same.\n\n' +
        'Follow one point. Suppose $f(8) = 3$. On $y = f(2x)$, the bracket must be 8 to give that height: $2x = 8$, so $x = 4$. The point $(8, 3)$ has moved to $(4, 3)$.\n\n' +
        'Every $x$-coordinate is halved, so the graph is squashed towards the $y$-axis. This is called a **horizontal stretch**. Its **scale factor** is what each $x$-coordinate is multiplied by, which is $\\frac{1}{2}$.',
      conclusion: 'All the $x$-coordinates are multiplied by $\\frac{1}{2}$, so the answer is horizontal stretch, scale factor $\\frac{1}{2}$.',
      whyWrong: [
        null,
        'A horizontal stretch with scale factor $2$ is $y = f\\left(\\frac{1}{2}x\\right)$. Inside the bracket the effect is the reciprocal of the number.',
        'A vertical stretch with scale factor $2$ is $y = 2f(x)$, with the $2$ outside the bracket.',
        'A translation left is $y = f(x + 2)$, which adds to $x$ instead of multiplying it.',
      ],
      keyIdea: 'Inside the bracket the effect is the reciprocal: $f(ax)$ is a horizontal stretch with scale factor $\\frac{1}{a}$. Outside, $af(x)$ is a vertical stretch with scale factor $a$. Try it on a single point to confirm.',
    },
  },
  {
    id: 'transformations-024',
    subtopic: 'transformations',
    difficulty: 'exam',
    stem: 'The graph of $y = x^2$ is translated by the vector $\\binom{3}{-2}$. What is the equation of the new graph?',
    options: ['$y = (x - 3)^2 - 2$', '$y = (x + 3)^2 - 2$', '$y = (x - 3)^2 + 2$', '$y = (x + 2)^2 + 3$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the equation of $y = x^2$ after it slides right 3 and down 2?',
      solution:
        'A **translation** by the vector $\\binom{3}{-2}$ slides the graph without changing its shape. The top number is the move across: 3 means 3 units right. The bottom number is the move up: $-2$ means 2 units down.\n\n' +
        'Moving right 3 means replacing $x$ with $(x - 3)$. The sign looks opposite because the lowest point must now be where the bracket is 0, at $x = 3$. This gives $y = (x - 3)^2$.\n\n' +
        'Moving down 2 means subtracting 2 from every output: $y = (x - 3)^2 - 2$.',
      conclusion: 'The lowest point moves from $(0, 0)$ to $(3, -2)$, matching the vector, so the equation is $y = (x - 3)^2 - 2$.',
      whyWrong: [
        null,
        'This moves the graph left. A move of $3$ units right replaces $x$ by $x - 3$, not $x + 3$.',
        'This moves the graph up. The $-2$ in the vector means $2$ units down.',
        'This swaps the two parts of the vector. The top number is the horizontal move and the bottom number the vertical one.',
      ],
      keyIdea: 'To translate $y = f(x)$ by $\\binom{a}{b}$, write $y = f(x - a) + b$. The top number goes in the bracket with the opposite sign. The bottom number goes outside with the same sign.',
    },
    check: {
      optionValues: [2, 62, 6, 52],
      compute: () => {
        // the image of (t, t^2) is (t + 3, t^2 - 2); read off the new graph at x = 5
        const t = 5 - 3;
        return t * t - 2;
      },
    },
  },];
