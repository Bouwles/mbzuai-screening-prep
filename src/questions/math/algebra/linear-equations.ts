import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- check helpers (re-derive answers in code)

/** Root of a LINEAR function f(x) = Ax + B, found from two evaluations. */
function linRoot(f: (x: number) => number): number {
  const f0 = f(0);
  const f1 = f(1);
  return -f0 / (f1 - f0);
}

/** Root of a monotone function on [lo, hi] by bisection. */
function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let flo = f(lo);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm < 0 === flo < 0) {
      lo = mid;
      flo = fm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Test points -40, -39.875, ..., 40 (multiples of 1/8 are exact in floating point). */
const GRID = Array.from({ length: 641 }, (_, i) => (i - 320) / 8);

/** The label of the ONE candidate set that agrees with the true condition at every grid point ('none' otherwise). */
function matchSet(truth: (x: number) => boolean, cands: Record<string, (x: number) => boolean>): string {
  const hits = Object.entries(cands)
    .filter(([, p]) => GRID.every((x) => p(x) === truth(x)))
    .map(([k]) => k);
  return hits.length === 1 ? hits[0] : 'none';
}

/** All grid points satisfying an equation, as a sorted comma-separated string. */
function solutionSet(pred: (x: number) => boolean): string {
  return GRID.filter(pred)
    .map((x) => Number(x.toFixed(4)))
    .sort((a, b) => a - b)
    .join(',');
}

/** Slope of ax + by = c, worked out from two points on the line. */
function lineSlope(a: number, b: number, c: number): number {
  const y = (x: number) => (c - a * x) / b;
  return y(1) - y(0);
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------ foundation
  {
    id: 'linear-equations-001',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Solve $3x - 7 = 11$.',
    options: ['$x = \\frac{4}{3}$', '$x = 18$', '$x = 6$', '$x = 54$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Undo the operations in reverse order, doing the same thing to both sides.\n\n' +
        '1. Add 7 to both sides: $3x = 11 + 7 = 18$.\n' +
        '2. Divide both sides by 3: $x = \\frac{18}{3} = 6$.\n\n' +
        'Check: $3(6) - 7 = 18 - 7 = 11$, which matches the right-hand side.',
      whyWrong: [
        'This subtracts 7 from 11 instead of adding it: $3x = 11 - 7 = 4$. To undo "$-7$" you must **add** 7 to both sides.',
        'This stops half-way. $3x = 18$ is correct, but 18 is the value of $3x$, not of $x$: you still need to divide by 3.',
        null,
        'This multiplies by 3 instead of dividing: $18 \\times 3 = 54$. To undo "times 3" you divide by 3.',
      ],
      keyIdea: 'Undo each operation with its inverse, doing exactly the same thing to both sides.',
    },
    check: {
      optionValues: [4 / 3, 18, 6, 54],
      compute: () => linRoot((x) => 3 * x - 7 - 11),
    },
  },
  {
    id: 'linear-equations-004',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Make $t$ the subject of the formula $v = u + at$.',
    options: ['$t = \\frac{v}{a} - u$', '$t = \\frac{u - v}{a}$', '$t = a(v - u)$', '$t = \\frac{v - u}{a}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Treat it like an equation: undo what is being done to $t$.\n\n' +
        '1. Subtract $u$ from both sides: $v - u = at$.\n' +
        '2. Divide both sides by $a$: $t = \\frac{v - u}{a}$.\n\n' +
        'Check with numbers: if $u = 2$, $a = 3$ and $t = 4$, then $v = 2 + 12 = 14$, and $\\frac{14 - 2}{3} = 4$, as it should be.',
      whyWrong: [
        'This divides $v$ and $at$ by $a$ but forgets to divide $u$ as well (it treats the formula as $\\frac{v}{a} = u + t$). Every term would need dividing; it is simpler to remove $u$ first and then divide the **whole** of $v - u$ by $a$.',
        'This has a sign error: subtracting $u$ from both sides gives $at = v - u$, not $u - v$.',
        'This multiplies by $a$ instead of dividing. In the formula $t$ is multiplied by $a$, so you undo it by dividing by $a$.',
        null,
      ],
      keyIdea: 'Changing the subject works exactly like solving an equation: undo the operations on the new subject in reverse order.',
    },
    check: {
      // evaluate each option at u = 2, a = 3, v = 14 and solve u + a t = v for t directly
      optionValues: [14 / 3 - 2, (2 - 14) / 3, 3 * (14 - 2), (14 - 2) / 3],
      compute: () => {
        const u = 2;
        const a = 3;
        const v = 14;
        return linRoot((t) => u + a * t - v);
      },
    },
  },
  {
    id: 'linear-equations-005',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Solve $|x - 4| = 7$.',
    options: ['$x = 11$ or $x = -3$', '$x = 11$ only', '$x = 3$ or $x = -11$', '$x = 11$ or $x = -11$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$|x - 4| = 7$ means that $x - 4$ is either 7 or $-7$ (the distance between $x$ and 4 on the number line is 7).\n\n' +
        '- Case 1: $x - 4 = 7$, so $x = 11$.\n' +
        '- Case 2: $x - 4 = -7$, so $x = -3$.\n\n' +
        'Check: $|11 - 4| = |7| = 7$ and $|-3 - 4| = |-7| = 7$. Both work, so $x = 11$ or $x = -3$.',
      whyWrong: [
        null,
        'This only solves the positive case $x - 4 = 7$. The distance from $x$ to 4 can be 7 in **either** direction, so you must also solve $x - 4 = -7$.',
        'This solves $|x + 4| = 7$ instead, so both signs are reversed. Inside the bars it is $x - 4$, so $x = 4 + 7$ or $x = 4 - 7$.',
        'This puts the $\\pm$ on the final answer ($x = \\pm 11$) instead of on the 7. The two cases are $x - 4 = 7$ and $x - 4 = -7$, which give 11 and $-3$.',
      ],
      keyIdea: '$|A| = c$ (with $c > 0$) splits into two equations: $A = c$ or $A = -c$.',
    },
    check: {
      optionValues: ['-3,11', '11', '-11,3', '-11,11'],
      compute: () => solutionSet((x) => Math.abs(x - 4) === 7),
    },
  },
  {
    id: 'linear-equations-021',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'What is the slope of the line $y = 5 - 2x$?',
    options: ['$-2$', '$2$', '$5$', '$\\frac{5}{2}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Compare with $y = mx + c$, where $m$, the number multiplying $x$, is the slope (also called the gradient).\n\n' +
        'Rewrite the line as $y = -2x + 5$, so $m = -2$.',
      whyWrong: [
        null,
        'This drops the minus sign. The term is $-2x$, so the line falls as $x$ increases and the slope is negative.',
        '$5$ is the constant term, which is the $y$-intercept, not the slope.',
        '$\\frac{5}{2}$ is the $x$-intercept, the value of $x$ when $y = 0$, not the slope.',
      ],
      keyIdea: 'In $y = mx + c$ the slope is the number multiplying $x$, wherever that term is written.',
    },
    check: {
      optionValues: [-2, 2, 5, 5 / 2],
      compute: () => {
        const y = (x: number) => 5 - 2 * x;
        return y(1) - y(0);
      },
    },
  },
  {
    id: 'linear-equations-022',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'What is the $y$-intercept of the line $y = 3x - 7$?',
    options: ['$-7$', '$3$', '$7$', '$\\frac{7}{3}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The $y$-intercept is the value of $y$ where the line crosses the $y$-axis, that is, when $x = 0$.\n\n' +
        'Put $x = 0$: $y = 3(0) - 7 = -7$.',
      whyWrong: [
        null,
        '$3$ is the slope, the number multiplying $x$. The intercept is the constant term.',
        'This drops the minus sign. The constant term is $-7$, so the line crosses the $y$-axis below the origin.',
        '$\\frac{7}{3}$ is the $x$-intercept, the value of $x$ when $y = 0$.',
      ],
      keyIdea: 'In $y = mx + c$ the $y$-intercept is $c$, the value of $y$ when $x = 0$.',
    },
    check: {
      optionValues: [-7, 3, 7, 7 / 3],
      compute: () => 3 * 0 - 7,
    },
  },
  {
    id: 'linear-equations-023',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Two different non-vertical lines are parallel exactly when:',
    options: ['their slopes are equal', 'their slopes multiply to $-1$', 'their $y$-intercepts are equal', 'their slopes add to $0$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Parallel lines rise at the same rate, so they never meet. That means their slopes are equal.\n\n' +
        'For example, $y = 2x + 1$ and $y = 2x - 5$ are parallel: both have slope 2.',
      whyWrong: [
        null,
        'Slopes that multiply to $-1$ give **perpendicular** lines, which meet at a right angle.',
        'Equal $y$-intercepts mean both lines pass through the same point on the $y$-axis, so two different lines would meet there.',
        'Slopes such as $2$ and $-2$ add to $0$, but one line rises while the other falls, so the lines cross.',
      ],
      keyIdea: 'Parallel lines have equal slopes.',
    },
  },
  {
    id: 'linear-equations-024',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Two lines with slopes $m_1$ and $m_2$ are perpendicular when:',
    options: ['$m_1 m_2 = -1$', '$m_1 = m_2$', '$m_1 m_2 = 1$', '$m_1 + m_2 = 0$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Perpendicular means meeting at a right angle. For two lines with non-zero slopes this happens exactly when the product of the slopes is $-1$, so each slope is the negative reciprocal of the other.\n\n' +
        'For example, slopes $2$ and $-\\frac{1}{2}$ multiply to $-1$.',
      whyWrong: [
        null,
        'Equal slopes give parallel lines, which never meet.',
        'A product of $1$ flips the slope without changing its sign. Slopes $2$ and $\\frac{1}{2}$ both rise, so the lines do not meet at a right angle.',
        'A sum of $0$ changes the sign without flipping the slope. Slopes $2$ and $-2$ cross, but not at a right angle.',
      ],
      keyIdea: 'Perpendicular slopes multiply to $-1$: flip the fraction and change the sign.',
    },
  },
  {
    id: 'linear-equations-025',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'In the equation of a straight line $y = mx + c$, what does $m$ represent?',
    options: ['The slope (gradient)', 'The $y$-intercept', 'The $x$-intercept', 'The value of $y$ at $x = 1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$m$ multiplies $x$, so it tells you how much $y$ changes when $x$ goes up by 1. That is the slope, also called the gradient.\n\n' +
        'The constant $c$ is the $y$-intercept.',
      whyWrong: [
        null,
        'That is $c$, the value of $y$ when $x = 0$.',
        'The $x$-intercept is $-\\frac{c}{m}$, the value of $x$ when $y = 0$, so it depends on both numbers.',
        'At $x = 1$ the value of $y$ is $m + c$, which also includes $c$. $m$ is the change in $y$ for each unit of $x$.',
      ],
      keyIdea: 'In $y = mx + c$, $m$ is the slope and $c$ is the $y$-intercept.',
    },
  },
  {
    id: 'linear-equations-026',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Which of the following equations is linear in $x$?',
    options: ['$3x + 1 = 7$', '$x^2 = 9$', '$\\frac{1}{x} = 2$', '$\\sqrt{x} = 4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'An equation is **linear** in $x$ when $x$ appears only to the power 1.\n\n' +
        'In $3x + 1 = 7$ the only power of $x$ is 1. The other equations contain $x^2$, $x^{-1}$ and $x^{\\frac{1}{2}}$.',
      whyWrong: [
        null,
        'Here $x$ has the power 2, so this equation is quadratic.',
        'Here $x$ is on the bottom of a fraction, which is the power $-1$.',
        'A square root of $x$ is the power $\\frac{1}{2}$, not the power 1.',
      ],
      keyIdea: 'A linear equation contains the unknown only to the power 1.',
    },
  },
  {
    id: 'linear-equations-027',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Find the slope of the horizontal line $y = 4$.',
    options: ['$0$', '$4$', '$1$', 'Undefined'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A horizontal line does not rise at all: $y$ stays at 4 whatever $x$ is.\n\n' +
        'Slope is the change in $y$ divided by the change in $x$, and the change in $y$ is 0, so the slope is 0. You can also write the line as $y = 0x + 4$.',
      whyWrong: [
        null,
        '$4$ is the $y$-intercept, where the line crosses the $y$-axis.',
        'This assumes a coefficient that is not written must be 1, as in $y = x + 4$. Here there is no $x$ term at all, so its coefficient is 0.',
        'A **vertical** line, such as $x = 4$, is the one with no defined slope. This line is horizontal.',
      ],
      keyIdea: 'A horizontal line has slope 0; a vertical line has no defined slope.',
    },
    check: {
      optionValues: [0, 4, 1, null],
      compute: () => lineSlope(0, 1, 4),
    },
  },
  {
    id: 'linear-equations-028',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'What is the slope of the line through $(1, 2)$ and $(3, 8)$?',
    options: ['$3$', '$\\frac{1}{3}$', '$-3$', '$5$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Slope is the change in $y$ divided by the change in $x$:\n\n' +
        '$$\\frac{8 - 2}{3 - 1} = \\frac{6}{2} = 3$$',
      whyWrong: [
        null,
        'This divides the change in $x$ by the change in $y$. Slope is the change in $y$ over the change in $x$.',
        'This subtracts in opposite orders, $\\frac{2 - 8}{3 - 1}$. Use the same point first on the top and on the bottom.',
        'This adds the $y$-values on top, $\\frac{8 + 2}{3 - 1}$. Slope uses the **difference** of the $y$-values.',
      ],
      keyIdea: 'Slope $= \\frac{y_2 - y_1}{x_2 - x_1}$, with the points in the same order on the top and the bottom.',
    },
    check: {
      optionValues: [3, 1 / 3, -3, 5],
      compute: () => (8 - 2) / (3 - 1),
    },
  },

  // ------------------------------------------------------------ exam
  {
    id: 'linear-equations-002',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Solve $5(x - 2) = 3x + 4$.',
    options: ['$x = 7$', '$x = 3$', '$x = \\frac{7}{4}$', '$x = -3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Expand the bracket first, then collect the $x$ terms on one side and the numbers on the other.\n\n' +
        '1. Expand the bracket (the 5 multiplies **both** terms): $5x - 10 = 3x + 4$.\n' +
        '2. Subtract $3x$ from both sides: $2x - 10 = 4$.\n' +
        '3. Add 10 to both sides: $2x = 14$.\n' +
        '4. Divide both sides by 2: $x = 7$.\n\n' +
        'Check: left side $5(7 - 2) = 25$, right side $3(7) + 4 = 25$.',
      whyWrong: [
        null,
        'This expands the bracket as $5x - 2$, multiplying only the $x$ by 5. Then $5x - 2 = 3x + 4$ gives $2x = 6$. The 5 multiplies both terms: $5(x - 2) = 5x - 10$.',
        'This moves $3x$ to the left by adding it, giving $8x = 14$. To remove $3x$ from the right you **subtract** $3x$ from both sides, leaving $2x$.',
        'This moves the $-10$ across without changing its sign: $2x = 4 - 10 = -6$. To remove $-10$ from the left you **add** 10 to both sides.',
      ],
      keyIdea: 'Expand brackets fully first, then collect the $x$ terms on one side and the numbers on the other.',
    },
    check: {
      optionValues: [7, 3, 7 / 4, -3],
      compute: () => linRoot((x) => 5 * (x - 2) - (3 * x + 4)),
    },
  },
  {
    id: 'linear-equations-003',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Solve the inequality $-2x + 5 > 11$.',
    options: ['$x > -3$', '$x < -3$', '$x < -8$', '$x > 3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Solve it like an equation, but watch what happens to the inequality sign if you divide by a negative number.\n\n' +
        '1. Subtract 5 from both sides: $-2x > 6$.\n' +
        '2. Divide both sides by $-2$. Because you are dividing by a **negative** number, the inequality sign flips: $x < \\frac{6}{-2}$, so $x < -3$.\n\n' +
        'Check with numbers: $x = -4$ (less than $-3$) gives $-2(-4) + 5 = 13$, and $13 > 11$ is true. $x = 0$ gives $5 > 11$, which is false. So the solution is $x < -3$.',
      whyWrong: [
        'This forgets to flip the inequality sign. Dividing both sides by a negative number ($-2$) reverses the direction, so $>$ becomes $<$.',
        null,
        'This adds 5 to both sides instead of subtracting it, getting $-2x > 16$ and then $x < -8$. To remove $+5$ you subtract 5.',
        'This ignores the minus sign in $-2x$, solving $2x > 6$ instead of $-2x > 6$. Dividing by 2 instead of $-2$ gives the number the wrong sign and leaves the inequality unflipped.',
      ],
      keyIdea: 'Multiplying or dividing both sides of an inequality by a negative number flips the inequality sign.',
    },
    check: {
      optionValues: ['x>-3', 'x<-3', 'x<-8', 'x>3'],
      compute: () =>
        matchSet((x) => -2 * x + 5 > 11, {
          'x>-3': (x) => x > -3,
          'x<-3': (x) => x < -3,
          'x<-8': (x) => x < -8,
          'x>3': (x) => x > 3,
        }),
    },
  },
  {
    id: 'linear-equations-006',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Solve $\\frac{x + 3}{4} - \\frac{x - 1}{3} = 1$.',
    options: ['$x = -7$', '$x = 12$', '$x = 1$', '$x = -3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Clear the fractions by multiplying **every** term by the lowest common denominator, 12.\n\n' +
        '1. $12 \\times \\frac{x + 3}{4} = 3(x + 3)$ and $12 \\times \\frac{x - 1}{3} = 4(x - 1)$, so the equation becomes $3(x + 3) - 4(x - 1) = 12$.\n' +
        '2. Expand, being careful that $-4 \\times (-1) = +4$: $3x + 9 - 4x + 4 = 12$.\n' +
        '3. Simplify the left side: $-x + 13 = 12$.\n' +
        '4. Subtract 13: $-x = -1$, so $x = 1$.\n\n' +
        'Check: with $x = 1$ the left side is $\\frac{4}{4} - \\frac{0}{3} = 1$.',
      whyWrong: [
        'This forgets that the minus sign in front of the second fraction applies to its whole numerator. $-4(x - 1) = -4x + 4$, not $-4x - 4$; with the wrong sign you get $-x + 5 = 12$.',
        'This multiplies the fractions by 12 but forgets to multiply the right-hand side, solving $-x + 13 = 1$. Every term, on both sides, must be multiplied by 12.',
        null,
        'This multiplies the numerators by the wrong numbers, writing $4(x + 3) - 3(x - 1) = 12$. Multiplying $\\frac{x + 3}{4}$ by 12 gives $3(x + 3)$, because $12 \\div 4 = 3$.',
      ],
      keyIdea: 'Multiply every term on both sides by the lowest common denominator, and keep each numerator in a bracket so a minus sign in front applies to all of it.',
    },
    check: {
      optionValues: [-7, 12, 1, -3],
      compute: () => linRoot((x) => (x + 3) / 4 - (x - 1) / 3 - 1),
    },
  },
  {
    id: 'linear-equations-007',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Solve the inequality $\\frac{4 - 3x}{2} \\le x + 7$.',
    options: ['$x \\le -2$', '$x \\ge -\\frac{3}{5}$', '$x \\ge -\\frac{5}{2}$', '$x \\ge -2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Clear the fraction by multiplying both sides by 2, then solve as an equation, remembering to flip the sign if you divide by a negative number.\n\n' +
        '1. Multiply both sides by 2 (a positive number, so the sign stays the same): $4 - 3x \\le 2x + 14$.\n' +
        '2. Subtract $2x$ from both sides: $4 - 5x \\le 14$.\n' +
        '3. Subtract 4 from both sides: $-5x \\le 10$.\n' +
        '4. Divide both sides by $-5$ and **flip** the sign: $x \\ge -2$.\n\n' +
        'Check: $x = 0$ gives $2 \\le 7$ (true), while $x = -4$ gives $\\frac{16}{2} = 8 \\le 3$ (false). So the solution is $x \\ge -2$.',
      whyWrong: [
        'This forgets to flip the sign when dividing by $-5$. From $-5x \\le 10$, dividing by a negative number turns $\\le$ into $\\ge$.',
        'This multiplies the $x$ on the right by 2 but forgets the 7, solving $4 - 3x \\le 2x + 7$. The whole right side must be doubled: $2(x + 7) = 2x + 14$.',
        'This multiplies the 7 by 2 but not the $x$, solving $4 - 3x \\le x + 14$, which gives $-4x \\le 10$. Both terms on the right must be doubled: $2x + 14$.',
        null,
      ],
      keyIdea: 'Clear the fraction by multiplying the whole of both sides, then solve as an equation, flipping the sign only when you multiply or divide by a negative.',
    },
    check: {
      optionValues: ['x<=-2', 'x>=-3/5', 'x>=-5/2', 'x>=-2'],
      compute: () =>
        matchSet((x) => (4 - 3 * x) / 2 <= x + 7, {
          'x<=-2': (x) => x <= -2,
          'x>=-3/5': (x) => x >= -3 / 5,
          'x>=-5/2': (x) => x >= -5 / 2,
          'x>=-2': (x) => x >= -2,
        }),
    },
  },
  {
    id: 'linear-equations-008',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Make $h$ the subject of the formula $A = 2\\pi r^2 + 2\\pi rh$.',
    options: [
      '$h = \\frac{A}{2\\pi r} - 2\\pi r^2$',
      '$h = \\frac{A - 2\\pi r^2}{2\\pi r}$',
      '$h = \\frac{A + 2\\pi r^2}{2\\pi r}$',
      '$h = \\frac{A - 2\\pi r^2}{2\\pi}$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '$h$ appears only in the term $2\\pi rh$, so isolate that term first.\n\n' +
        '1. Subtract $2\\pi r^2$ from both sides: $A - 2\\pi r^2 = 2\\pi rh$.\n' +
        '2. Divide both sides by $2\\pi r$: $h = \\frac{A - 2\\pi r^2}{2\\pi r}$.\n\n' +
        '(This can also be written $h = \\frac{A}{2\\pi r} - r$, which is the same thing.)\n\n' +
        'Check with numbers: $r = 1$ and $h = 2$ give $A = 2\\pi + 4\\pi = 6\\pi$, and $\\frac{6\\pi - 2\\pi}{2\\pi} = 2$.',
      whyWrong: [
        'This divides only $A$ by $2\\pi r$. Once you have $A - 2\\pi r^2 = 2\\pi rh$, the **whole** left side must be divided by $2\\pi r$.',
        null,
        'This has a sign error: to move $2\\pi r^2$ to the other side you subtract it from both sides, so it becomes $-2\\pi r^2$.',
        'This divides by $2\\pi$ but forgets the $r$. In the formula $h$ is multiplied by $2\\pi r$, so you must divide by all of $2\\pi r$.',
      ],
      keyIdea: 'Isolate the term containing the new subject first, then divide the whole of the other side by its coefficient.',
    },
    check: {
      // evaluate each option at A = 30, r = 1.5 and solve the original formula for h
      optionValues: [
        30 / (2 * Math.PI * 1.5) - 2 * Math.PI * 1.5 ** 2,
        (30 - 2 * Math.PI * 1.5 ** 2) / (2 * Math.PI * 1.5),
        (30 + 2 * Math.PI * 1.5 ** 2) / (2 * Math.PI * 1.5),
        (30 - 2 * Math.PI * 1.5 ** 2) / (2 * Math.PI),
      ],
      compute: () => {
        const A = 30;
        const r = 1.5;
        return linRoot((h) => 2 * Math.PI * r * r + 2 * Math.PI * r * h - A);
      },
    },
  },
  {
    id: 'linear-equations-009',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Solve the inequality $|2x - 3| < 7$.',
    options: ['$-2 < x < 5$', '$x < 5$', '$x < -2$ or $x > 5$', '$-5 < x < 2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$|2x - 3| < 7$ means $2x - 3$ is less than 7 away from 0, so it lies **between** $-7$ and 7:\n\n' +
        '$$-7 < 2x - 3 < 7$$\n\n' +
        '1. Add 3 to all three parts: $-4 < 2x < 10$.\n' +
        '2. Divide all three parts by 2: $-2 < x < 5$.\n\n' +
        'Check: $x = 0$ gives $|-3| = 3 < 7$ (true); $x = 6$ gives $|9| = 9$, which is not less than 7 (false).',
      whyWrong: [
        null,
        'This only uses $2x - 3 < 7$ and forgets the other half, $2x - 3 > -7$. "Less than 7 in size" means between $-7$ and 7.',
        'This is the solution of $|2x - 3| > 7$. A "less than" absolute value inequality gives the values **between** two numbers, not outside them.',
        'This subtracts 3 from each part instead of adding it, getting $-10 < 2x < 4$. To undo $-3$ you add 3.',
      ],
      keyIdea: '$|A| < c$ means $-c < A < c$: one "sandwich" inequality, solved by doing the same thing to all three parts.',
    },
    check: {
      optionValues: ['-2<x<5', 'x<5', 'x<-2 or x>5', '-5<x<2'],
      compute: () =>
        matchSet((x) => Math.abs(2 * x - 3) < 7, {
          '-2<x<5': (x) => -2 < x && x < 5,
          'x<5': (x) => x < 5,
          'x<-2 or x>5': (x) => x < -2 || x > 5,
          '-5<x<2': (x) => -5 < x && x < 2,
        }),
    },
  },
  {
    id: 'linear-equations-010',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'A taxi charges a fixed fee of AED 12 plus AED 2.50 per kilometre. A ride cost AED 47 in total. How long was the ride?',
    options: ['$18.8$ km', '$23.6$ km', '$14$ km', '$35$ km'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $d$ be the distance in km. Total cost = fixed fee + (cost per km) times (number of km), so\n\n' +
        '$$12 + 2.5d = 47$$\n\n' +
        '1. Subtract 12 from both sides: $2.5d = 35$.\n' +
        '2. Divide both sides by 2.5: $d = \\frac{35}{2.5} = 14$.\n\n' +
        'Check: $12 + 2.5 \\times 14 = 12 + 35 = 47$. The ride was 14 km.',
      whyWrong: [
        'This divides the whole fare by 2.50 ($47 \\div 2.5 = 18.8$), forgetting that AED 12 of the fare is the fixed fee, not distance.',
        'This adds the fixed fee instead of subtracting it: $(47 + 12) \\div 2.5 = 23.6$.',
        null,
        'This is $47 - 12 = 35$, the amount paid for the distance in AED, not the number of kilometres. You still need to divide by 2.50 per km.',
      ],
      keyIdea: 'Turn the words into an equation (fixed part + rate times amount = total), then solve it.',
    },
    check: {
      optionValues: [18.8, 23.6, 14, 35],
      compute: () => linRoot((d) => 12 + 2.5 * d - 47),
    },
  },
  {
    id: 'linear-equations-011',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'How many **integers** $x$ satisfy $-3 \\le 2x + 5 < 11$?',
    options: ['$8$', '$6$', '$4$', '$7$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Solve the "sandwich" by doing the same thing to all three parts.\n\n' +
        '1. Subtract 5 from all three parts: $-8 \\le 2x < 6$.\n' +
        '2. Divide all three parts by 2 (positive, so no flip): $-4 \\le x < 3$.\n' +
        '3. List the integers: $-4, -3, -2, -1, 0, 1, 2$. The value $-4$ is included (because of $\\le$) but 3 is not (because of $<$).\n\n' +
        'That is **7** integers.',
      whyWrong: [
        'This also counts $x = 3$, treating $<$ as $\\le$. At $x = 3$, $2x + 5 = 11$, which is not **less than** 11.',
        'This leaves out $x = -4$ (or works out $2 - (-4) = 6$, which undercounts by one). At $x = -4$, $2x + 5 = -3$, and $-3 \\le -3$ is true, so $-4$ counts.',
        'This subtracts 5 from the middle part only, getting $-3 \\le 2x < 6$, so $-1.5 \\le x < 3$, which contains just the integers $-1, 0, 1, 2$. Whatever you do to the middle you must do to **all three** parts: $-8 \\le 2x < 6$.',
        null,
      ],
      keyIdea: 'Solve the double inequality first, then count integers carefully: $\\le$ includes the end value, $<$ does not.',
    },
    check: {
      optionValues: [8, 6, 4, 7],
      compute: () => {
        let count = 0;
        for (let x = -100; x <= 100; x++) if (-3 <= 2 * x + 5 && 2 * x + 5 < 11) count++;
        return count;
      },
    },
  },
  {
    id: 'linear-equations-012',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Make $L$ the subject of the formula $T = 2\\pi\\sqrt{\\frac{L}{g}}$.',
    options: ['$L = \\frac{gT^2}{4\\pi^2}$', '$L = \\frac{gT}{2\\pi}$', '$L = \\frac{gT^2}{2\\pi^2}$', '$L = \\frac{T^2}{4\\pi^2 g}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Peel off the operations around $L$ from the outside in.\n\n' +
        '1. Divide both sides by $2\\pi$: $\\frac{T}{2\\pi} = \\sqrt{\\frac{L}{g}}$.\n' +
        '2. Square both sides (squaring undoes the square root): $\\frac{T^2}{4\\pi^2} = \\frac{L}{g}$, because $(2\\pi)^2 = 4\\pi^2$.\n' +
        '3. Multiply both sides by $g$: $L = \\frac{gT^2}{4\\pi^2}$.',
      whyWrong: [
        null,
        'This forgets to square. After dividing by $2\\pi$ you have $\\sqrt{\\frac{L}{g}}$, and a square root is undone by **squaring** both sides.',
        'This squares $T$ and $\\pi$ but not the 2. The whole of $2\\pi$ must be squared: $(2\\pi)^2 = 4\\pi^2$, not $2\\pi^2$.',
        'This divides by $g$ at the end instead of multiplying. In the formula $L$ is divided by $g$, so to undo that you multiply by $g$.',
      ],
      keyIdea: 'Undo the operations around the new subject in reverse order: a square root is undone by squaring, and squaring a product squares every factor.',
    },
    check: {
      // evaluate each option at g = 9.8, T = 3 and solve the original formula for L numerically
      optionValues: [
        (9.8 * 3 ** 2) / (4 * Math.PI ** 2),
        (9.8 * 3) / (2 * Math.PI),
        (9.8 * 3 ** 2) / (2 * Math.PI ** 2),
        3 ** 2 / (4 * Math.PI ** 2 * 9.8),
      ],
      compute: () => {
        const g = 9.8;
        const T = 3;
        return bisect((L) => 2 * Math.PI * Math.sqrt(L / g) - T, 0, 100);
      },
    },
  },
  {
    id: 'linear-equations-013',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Solve $4 - 3(2x - 5) = 2(x + 1) - 7$.',
    options: ['$x = -\\frac{3}{4}$', '$x = 3$', '$x = \\frac{25}{8}$', '$x = -6$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Expand both sides first, taking care with the $-3$ in front of the bracket: it multiplies both terms inside.\n\n' +
        '1. Expand the left side. The $-3$ multiplies both terms, and $-3 \\times (-5) = +15$: $4 - 6x + 15 = 19 - 6x$.\n' +
        '2. Expand the right side: $2x + 2 - 7 = 2x - 5$.\n' +
        '3. The equation is now $19 - 6x = 2x - 5$. Add $6x$ to both sides: $19 = 8x - 5$.\n' +
        '4. Add 5 to both sides: $24 = 8x$.\n' +
        '5. Divide by 8: $x = 3$.\n\n' +
        'Check: left side $4 - 3(6 - 5) = 4 - 3 = 1$; right side $2(4) - 7 = 1$.',
      whyWrong: [
        'This gets the sign wrong in $-3 \\times (-5)$, writing $-6x - 15$. The product of two negatives is positive: $-3(2x - 5) = -6x + 15$. With the wrong sign you get $-6 = 8x$.',
        null,
        'This multiplies only the $x$ in $2(x + 1)$ by 2, writing $2x + 1$ instead of $2x + 2$. Then $19 - 6x = 2x - 6$ gives $25 = 8x$.',
        'This moves $-6x$ to the right without changing its sign, getting $24 = 2x - 6x = -4x$. Adding $6x$ to both sides gives $24 = 8x$.',
      ],
      keyIdea: 'A negative number in front of a bracket multiplies every term inside, so minus times minus gives plus.',
    },
    check: {
      optionValues: [-3 / 4, 3, 25 / 8, -6],
      compute: () => linRoot((x) => 4 - 3 * (2 * x - 5) - (2 * (x + 1) - 7)),
    },
  },
  {
    id: 'linear-equations-014',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Plan P costs a one-off fee of AED 200 plus AED 50 per month. Plan Q costs AED 80 per month. After how many whole months does P first become **cheaper** than Q?',
    options: ['$6$', '$4$', '$7$', '$2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $m$ be the number of months. Plan P costs $200 + 50m$ and plan Q costs $80m$ (in AED).\n\n' +
        '1. Plan P is cheaper when $200 + 50m < 80m$.\n' +
        '2. Subtract $50m$ from both sides: $200 < 30m$.\n' +
        '3. Divide by 30: $m > \\frac{20}{3} \\approx 6.67$.\n' +
        '4. The smallest whole number greater than $6.67$ is 7.\n\n' +
        'Check: after 7 months P costs AED 550 and Q costs AED 560, so P is cheaper. After 6 months P costs AED 500 but Q costs AED 480, so P is not yet cheaper.',
      whyWrong: [
        'This rounds $6.67$ down. After 6 months plan P costs AED 500 but plan Q costs AED 480, so P is not cheaper yet. Since $m$ must be **greater** than $6.67$, round up.',
        'This divides the one-off fee by plan P\'s monthly cost ($200 \\div 50 = 4$). The fee is paid back by the **difference** in monthly costs, $80 - 50 = 30$ per month.',
        null,
        'This divides the fee by the **sum** of the monthly costs ($200 \\div 130 \\approx 1.5$, rounded up to 2). The saving each month is the difference, $80 - 50 = 30$.',
      ],
      keyIdea: 'Write the comparison as an inequality, solve it, then round in the direction the inequality demands (here: up).',
    },
    check: {
      optionValues: [6, 4, 7, 2],
      compute: () => {
        let m = 1;
        while (!(200 + 50 * m < 80 * m)) m++;
        return m;
      },
    },
  },
  {
    id: 'linear-equations-016',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Make $x$ the subject of $y = \\frac{2x + 3}{x - 1}$.',
    options: ['$x = \\frac{3 - y}{y - 2}$', '$x = \\frac{4}{y - 2}$', '$x = \\frac{y + 3}{y - 2}$', '$x = \\frac{y + 3}{2 - y}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$x$ appears twice, so gather the $x$ terms together and factorise.\n\n' +
        '1. Multiply both sides by $(x - 1)$: $y(x - 1) = 2x + 3$.\n' +
        '2. Expand: $xy - y = 2x + 3$.\n' +
        '3. Put the $x$ terms on the left and everything else on the right (subtract $2x$, add $y$): $xy - 2x = y + 3$.\n' +
        '4. Factorise out $x$: $x(y - 2) = y + 3$.\n' +
        '5. Divide by $(y - 2)$: $x = \\frac{y + 3}{y - 2}$.\n\n' +
        'Check: $x = 4$ gives $y = \\frac{11}{3}$, and then $\\frac{y + 3}{y - 2} = \\frac{20}{3} \\div \\frac{5}{3} = 4$.',
      whyWrong: [
        'This moves $-y$ across without changing its sign. From $xy - y = 2x + 3$, adding $y$ to both sides gives $xy - 2x = y + 3$, not $3 - y$.',
        'This expands $y(x - 1)$ as $xy - 1$, forgetting to multiply the 1 by $y$. It should be $xy - y$.',
        null,
        'This makes a sign slip when collecting the $x$ terms: $xy - 2x = x(y - 2)$, not $x(2 - y)$. The result has the right size but the wrong sign.',
      ],
      keyIdea: 'If the new subject appears in more than one place, clear fractions, collect all its terms on one side and factorise it out.',
    },
    check: {
      // evaluate each option at y = 5 and solve y(x - 1) = 2x + 3 (linear in x) directly
      optionValues: [(3 - 5) / (5 - 2), 4 / (5 - 2), (5 + 3) / (5 - 2), (5 + 3) / (2 - 5)],
      compute: () => {
        const y = 5;
        return linRoot((x) => y * (x - 1) - (2 * x + 3));
      },
    },
  },
  {
    id: 'linear-equations-018',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'For which value of $k$ does the equation $k(x - 2) = 3x + 4$ have **no** solution?',
    options: ['$k = -2$', '$k = 3$', '$k = -3$', '$k = 0$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Rearrange into the form $ax = b$ (a number times $x$ equals a number) and ask when you cannot divide by $a$.\n\n' +
        '1. Expand: $kx - 2k = 3x + 4$.\n' +
        '2. Collect the $x$ terms on the left and the rest on the right: $kx - 3x = 2k + 4$, so $(k - 3)x = 2k + 4$.\n' +
        '3. Normally you would divide by $(k - 3)$ to get exactly one solution. That is impossible only when $k - 3 = 0$, i.e. $k = 3$.\n' +
        '4. With $k = 3$ the equation becomes $3x - 6 = 3x + 4$, i.e. $-6 = 4$, which is never true. So there is **no** solution.\n\n' +
        '(If the right side $2k + 4$ had also been 0, every $x$ would work: infinitely many solutions. Here it is $10 \\ne 0$.)',
      whyWrong: [
        'This makes the constant $2k + 4$ equal to zero. With $k = -2$ the equation becomes $-5x = 0$, which has exactly one solution, $x = 0$.',
        null,
        'This makes a sign slip collecting the $x$ terms, getting $(k + 3)x$ instead of $(k - 3)x$. With $k = -3$ the equation is $-6x = -2$, which has the solution $x = \\frac{1}{3}$.',
        'With $k = 0$ the left side is 0, but the equation $0 = 3x + 4$ still has the solution $x = -\\frac{4}{3}$. Making one side zero does not remove the solution.',
      ],
      keyIdea: 'A linear equation $ax = b$ has no solution exactly when $a = 0$ but $b \\ne 0$.',
    },
    check: {
      optionValues: [-2, 3, -3, 0],
      compute: () => {
        for (let k = -10; k <= 10; k++) {
          const f = (x: number) => k * (x - 2) - (3 * x + 4);
          const slope = f(1) - f(0);
          if (slope === 0 && f(0) !== 0) return k;
        }
        return NaN;
      },
    },
  },
  {
    id: 'linear-equations-029',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Find the slope of the line $3x + 6y = 2$.',
    options: ['$-0.5$', '$0.5$', '$-2$', '$2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Rearrange into the form $y = mx + c$, where $m$ is the slope.\n\n' +
        '1. Subtract $3x$ from both sides: $6y = -3x + 2$.\n' +
        '2. Divide every term by 6: $y = -\\frac{1}{2}x + \\frac{1}{3}$.\n\n' +
        'The number multiplying $x$ is $-\\frac{1}{2} = -0.5$.\n\n' +
        'Shortcut: for $ax + by = c$ the slope is $-\\frac{a}{b} = -\\frac{3}{6}$.',
      whyWrong: [
        null,
        '$0.5$ is $\\frac{a}{b}$: the sign was lost. Moving $3x$ across the equals sign makes it $-3x$.',
        '$-2$ is $-\\frac{b}{a}$: the fraction is upside down. You divide by the coefficient of $y$, which is 6, not by 3.',
        '$2$ is $\\frac{b}{a}$: the fraction is upside down and the sign was lost as well.',
      ],
      keyIdea: 'The slope of $ax + by = c$ is $-\\frac{a}{b}$: rearrange to $y = mx + c$ and read off the number multiplying $x$.',
    },
    check: {
      optionValues: [-0.5, 0.5, -2, 2],
      compute: () => lineSlope(3, 6, 2),
    },
  },
  {
    id: 'linear-equations-030',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Find the slope of the line $4x - 4y = 9$.',
    options: ['$1$', '$-1$', '$-\\frac{9}{4}$', '$0$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Rearrange into the form $y = mx + c$.\n\n' +
        '1. Subtract $4x$ from both sides: $-4y = -4x + 9$.\n' +
        '2. Divide every term by $-4$: $y = x - \\frac{9}{4}$.\n\n' +
        'The number multiplying $x$ is 1, so the slope is 1.\n\n' +
        'Shortcut: $-\\frac{a}{b} = -\\frac{4}{-4} = 1$.',
      whyWrong: [
        null,
        '$-1$ is $\\frac{a}{b} = \\frac{4}{-4}$: the minus sign in $-\\frac{a}{b}$ was left out.',
        '$-\\frac{9}{4}$ is $\\frac{c}{b}$, the $y$-intercept, not the slope.',
        '$0$ comes from adding the coefficients, $4 + (-4)$. The slope is a ratio of the coefficients, not their sum.',
      ],
      keyIdea: 'Slope $= -\\frac{a}{b}$, which can simplify to a whole number; take care when $b$ is negative.',
    },
    check: {
      optionValues: [1, -1, -9 / 4, 0],
      compute: () => lineSlope(4, -4, 9),
    },
  },
  {
    id: 'linear-equations-031',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'What is the gradient of the straight line $2x + 5y = 10$?',
    options: ['$-\\frac{2}{5}$', '$\\frac{2}{5}$', '$-\\frac{5}{2}$', '$2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '"Gradient" is another word for slope. Rearrange into the form $y = mx + c$.\n\n' +
        '1. Subtract $2x$ from both sides: $5y = -2x + 10$.\n' +
        '2. Divide every term by 5: $y = -\\frac{2}{5}x + 2$.\n\n' +
        'The number multiplying $x$ is $-\\frac{2}{5}$.',
      whyWrong: [
        null,
        '$\\frac{2}{5}$ is $\\frac{a}{b}$: the sign was lost when $2x$ moved across the equals sign.',
        '$-\\frac{5}{2}$ is $-\\frac{b}{a}$: the fraction is upside down. Divide by the coefficient of $y$.',
        '$2$ is $\\frac{c}{b}$, the $y$-intercept, not the gradient.',
      ],
      keyIdea: 'Gradient and slope mean the same thing: for $ax + by = c$ it is $-\\frac{a}{b}$.',
    },
    check: {
      optionValues: [-2 / 5, 2 / 5, -5 / 2, 2],
      compute: () => lineSlope(2, 5, 10),
    },
  },
  {
    id: 'linear-equations-032',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Find the $y$-intercept of the line $4x + 3y = 12$.',
    options: ['$4$', '$3$', '$12$', '$-\\frac{4}{3}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The line crosses the $y$-axis where $x = 0$.\n\n' +
        '1. Put $x = 0$: $3y = 12$.\n' +
        '2. Divide by 3: $y = 4$.\n\n' +
        'In general the $y$-intercept of $ax + by = c$ is $\\frac{c}{b}$.',
      whyWrong: [
        null,
        '$3$ is the $x$-intercept: putting $y = 0$ gives $4x = 12$, so $x = 3$.',
        '$12$ forgets to divide by the coefficient of $y$. $3y = 12$ gives $y = 4$.',
        '$-\\frac{4}{3}$ is the slope, $-\\frac{a}{b}$, not the intercept.',
      ],
      keyIdea: 'To find the $y$-intercept, put $x = 0$; for $ax + by = c$ this gives $\\frac{c}{b}$.',
    },
    check: {
      optionValues: [4, 3, 12, -4 / 3],
      compute: () => (12 - 4 * 0) / 3,
    },
  },
  {
    id: 'linear-equations-033',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Which line is parallel to $2x + y = 5$?',
    options: ['$y = -2x + 1$', '$y = 2x + 5$', '$y = \\frac{1}{2}x + 3$', '$y = -\\frac{1}{2}x + 5$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Rearrange the given line: $y = -2x + 5$, so its slope is $-2$.\n' +
        '2. Parallel lines have equal slopes, so look for slope $-2$.\n\n' +
        'Only $y = -2x + 1$ has slope $-2$. The intercept does not matter for being parallel.',
      whyWrong: [
        null,
        'Slope $2$ comes from losing the minus sign when $2x$ moves across the equals sign.',
        'Slope $\\frac{1}{2}$ is the negative reciprocal of $-2$, so this line is **perpendicular** to the given line.',
        'Slope $-\\frac{1}{2}$ is $-\\frac{b}{a}$: the fraction is upside down.',
      ],
      keyIdea: 'Parallel lines have equal slopes, so rearrange to $y = mx + c$ and match $m$.',
    },
    check: {
      // the slope of each option
      optionValues: [-2, 2, 1 / 2, -1 / 2],
      compute: () => lineSlope(2, 1, 5),
    },
  },
  {
    id: 'linear-equations-034',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Find the slope of a line perpendicular to $3x - 2y = 7$.',
    options: ['$-\\frac{2}{3}$', '$\\frac{3}{2}$', '$\\frac{2}{3}$', '$-\\frac{3}{2}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Slope of the given line: $-\\frac{a}{b} = -\\frac{3}{-2} = \\frac{3}{2}$.\n' +
        '2. Perpendicular slopes multiply to $-1$, so flip the fraction and change the sign: $-\\frac{2}{3}$.\n\n' +
        'Check: $\\frac{3}{2} \\times \\left(-\\frac{2}{3}\\right) = -1$.',
      whyWrong: [
        null,
        '$\\frac{3}{2}$ is the slope of the given line itself, which would make the lines parallel.',
        '$\\frac{2}{3}$ flips the fraction but keeps the sign, so the product of the slopes is $+1$, not $-1$.',
        '$-\\frac{3}{2}$ changes the sign but does not flip the fraction, so the product is $-\\frac{9}{4}$, not $-1$.',
      ],
      keyIdea: 'Find the slope first, then take its negative reciprocal.',
    },
    check: {
      optionValues: [-2 / 3, 3 / 2, 2 / 3, -3 / 2],
      compute: () => -1 / lineSlope(3, -2, 7),
    },
  },
  {
    id: 'linear-equations-035',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Find the equation of the line through $(2, 5)$ that is parallel to $y = 3x - 4$.',
    options: ['$y = 3x - 1$', '$y = 3x + 5$', '$y = 3x - 4$', '$y = -\\frac{1}{3}x + \\frac{17}{3}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. A parallel line has the same slope, so it has the form $y = 3x + c$.\n' +
        '2. Substitute the point $(2, 5)$: $5 = 3(2) + c$, so $c = -1$.\n\n' +
        'The line is $y = 3x - 1$. Check: at $x = 2$, $y = 6 - 1 = 5$.',
      whyWrong: [
        null,
        'This uses the $y$-coordinate of the point as the intercept. 5 is the height at $x = 2$, not at $x = 0$.',
        'This is the given line itself. At $x = 2$ it gives $y = 2$, not $5$, so it does not pass through the point.',
        'This line has the perpendicular slope, $-\\frac{1}{3}$. It passes through the point but meets the given line at a right angle.',
      ],
      keyIdea: 'Keep the slope, then substitute the point to find the new intercept.',
    },
    check: {
      // the intercept of each option
      optionValues: [-1, 5, -4, 17 / 3],
      compute: () => 5 - lineSlope(-3, 1, -4) * 2,
    },
  },
  {
    id: 'linear-equations-036',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    stem: 'Which line passes through $(0, 2)$ and is perpendicular to $2x + 4y = 5$?',
    options: ['$y = 2x + 2$', '$y = -2x + 2$', '$y = -\\frac{1}{2}x + 2$', '$y = \\frac{1}{2}x + 2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Slope of the given line: $-\\frac{a}{b} = -\\frac{2}{4} = -\\frac{1}{2}$.\n' +
        '2. The perpendicular slope is the negative reciprocal: $2$.\n' +
        '3. The point $(0, 2)$ is on the $y$-axis, so the intercept is 2.\n\n' +
        'The line is $y = 2x + 2$. Check: $-\\frac{1}{2} \\times 2 = -1$.',
      whyWrong: [
        null,
        'Slope $-2$ flips the fraction but keeps the sign, so the product of the slopes is $+1$, not $-1$.',
        'Slope $-\\frac{1}{2}$ is the slope of the given line itself, which would make the lines parallel.',
        'Slope $\\frac{1}{2}$ changes the sign but does not flip the fraction, so the product is $-\\frac{1}{4}$, not $-1$.',
      ],
      keyIdea: 'Perpendicular slopes multiply to $-1$, and a point on the $y$-axis gives the intercept directly.',
    },
    check: {
      // the slope of each option
      optionValues: [2, -2, -1 / 2, 1 / 2],
      compute: () => -1 / lineSlope(2, 4, 5),
    },
  },
];
