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
      asking: 'What number can $x$ be so that 3 times it, minus 7, gives 11?',
      solution:
        'Solving means finding the value of $x$ that makes the equation true. We want $x$ on its own, so we undo what has been done to it, one thing at a time.\n\n' +
        'The left side has $-7$. To undo taking away 7, add 7 to both sides. Doing the same to both sides keeps them equal: $3x - 7 + 7 = 11 + 7$, which gives $3x = 18$.\n\n' +
        '$3x$ means 3 times $x$. To undo times 3, divide both sides by 3: $x = 18 \\div 3 = 6$.',
      conclusion: 'Putting it back in gives $3 \\times 6 - 7 = 18 - 7 = 11$, which matches, so the answer is $x = 6$.',
      whyWrong: [
        'This subtracts 7 from 11 instead of adding it: $3x = 11 - 7 = 4$. To undo "$-7$" you must **add** 7 to both sides.',
        'This stops half-way. $3x = 18$ is correct, but 18 is the value of $3x$, not of $x$: you still need to divide by 3.',
        null,
        'This multiplies by 3 instead of dividing: $18 \\times 3 = 54$. To undo "times 3" you divide by 3.',
      ],
      keyIdea: 'For a linear equation (no powers of $x$), undo the operations in reverse order: first remove added or subtracted numbers, then divide by the number in front of $x$. Do the same to both sides every time.',
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
      asking: 'Rearrange the formula so it starts with $t =$ and $t$ appears nowhere else.',
      solution:
        '"Make $t$ the subject" means get $t$ on its own on one side. It works just like solving an equation, only with letters.\n\n' +
        'Here $t$ is multiplied by $a$, and $u$ is added on. Undo the adding first by subtracting $u$ from both sides: $v - u = at$.\n\n' +
        'Now $t$ is only being multiplied by $a$. Divide both sides by $a$ to leave it alone. The whole of $v - u$ gets divided: $\\frac{v - u}{a} = t$.',
      conclusion: 'Written with $t$ first, that is $t = \\frac{v - u}{a}$.',
      whyWrong: [
        'This divides $v$ and $at$ by $a$ but forgets to divide $u$ as well (it treats the formula as $\\frac{v}{a} = u + t$). Every term would need dividing; it is simpler to remove $u$ first and then divide the **whole** of $v - u$ by $a$.',
        'This has a sign error: subtracting $u$ from both sides gives $at = v - u$, not $u - v$.',
        'This multiplies by $a$ instead of dividing. In the formula $t$ is multiplied by $a$, so you undo it by dividing by $a$.',
        null,
      ],
      keyIdea: 'To change the subject, treat the target letter like the unknown in an equation: move added or subtracted terms across first, then divide everything on the other side by whatever multiplies the letter.',
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
      asking: 'Which values of $x$ make $x - 4$ have a size of exactly 7?',
      solution:
        'The bars in $|x - 4|$ mean **absolute value**: the size of a number, ignoring its sign. For example, $|7| = 7$ and $|-7| = 7$.\n\n' +
        'So whatever is inside the bars must be either 7 or $-7$, because both have size 7. That gives two separate equations: $x - 4 = 7$ and $x - 4 = -7$.\n\n' +
        'Solve each one by adding 4 to both sides. The first gives $x = 7 + 4 = 11$. The second gives $x = -7 + 4 = -3$.',
      conclusion: 'Both work, since $|11 - 4| = 7$ and $|-3 - 4| = |-7| = 7$, so the answer is $x = 11$ or $x = -3$.',
      whyWrong: [
        null,
        'This only solves the positive case $x - 4 = 7$. The distance from $x$ to 4 can be 7 in **either** direction, so you must also solve $x - 4 = -7$.',
        'This solves $|x + 4| = 7$ instead, so both signs are reversed. Inside the bars it is $x - 4$, so $x = 4 + 7$ or $x = 4 - 7$.',
        'This puts the $\\pm$ on the final answer ($x = \\pm 11$) instead of on the 7. The two cases are $x - 4 = 7$ and $x - 4 = -7$, which give 11 and $-3$.',
      ],
      keyIdea: 'When bars equal a positive number $c$, remove the bars and write two equations: inside $= c$ and inside $= -c$. Solve each one. There are usually two answers.',
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
      asking: 'What number tells us how steep the line $y = 5 - 2x$ is?',
      solution:
        'The **slope** (also called the gradient) tells you how much $y$ changes when $x$ goes up by 1. In the form $y = mx + c$, the slope is $m$, the number multiplying $x$.\n\n' +
        'Reorder the terms so that the $x$ term comes first: $y = -2x + 5$. A term keeps its own sign when it moves, so it stays $-2x$.\n\n' +
        'Now compare with $y = mx + c$. The number multiplying $x$ is $-2$, so $m = -2$.',
      conclusion: 'The number multiplying $x$ is the slope, and the minus sign shows the line falls, so the answer is $-2$.',
      whyWrong: [
        null,
        'This drops the minus sign. The term is $-2x$, so the line falls as $x$ increases and the slope is negative.',
        '$5$ is the constant term, which is the $y$-intercept, not the slope.',
        '$\\frac{5}{2}$ is the $x$-intercept, the value of $x$ when $y = 0$, not the slope.',
      ],
      keyIdea: 'Rewrite the line as $y = mx + c$, with the $x$ term first. The number multiplying $x$, including its sign, is the slope. The number on its own is where the line crosses the $y$-axis.',
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
      asking: 'At what height does the line $y = 3x - 7$ cross the vertical $y$-axis?',
      solution:
        'The **$y$-intercept** is where the line crosses the $y$-axis. Every point on the $y$-axis has $x = 0$, so we put $x = 0$ into the equation.\n\n' +
        'Substitute: $y = 3 \\times 0 - 7 = 0 - 7 = -7$.',
      conclusion: 'The line crosses the $y$-axis where $y$ is $-7$, so the answer is $-7$.',
      whyWrong: [
        null,
        '$3$ is the slope, the number multiplying $x$. The intercept is the constant term.',
        'This drops the minus sign. The constant term is $-7$, so the line crosses the $y$-axis below the origin.',
        '$\\frac{7}{3}$ is the $x$-intercept, the value of $x$ when $y = 0$.',
      ],
      keyIdea: 'To find a $y$-intercept, put $x = 0$ into the equation. If the line is already in the form $y = mx + c$, the intercept is just the number $c$, with its sign.',
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
      asking: 'What must be true about two lines for them never to meet?',
      solution:
        '**Parallel** lines run side by side and never meet, like train tracks. To stay the same distance apart, they must rise or fall at the same rate.\n\n' +
        'The **slope** of a line measures that rate of rising or falling. So parallel lines need the same slope, such as $y = 2x + 1$ and $y = 2x + 5$.',
      conclusion: 'Equal steepness means the gap never changes, so the lines never cross. That is why the answer is: their slopes are equal.',
      whyWrong: [
        null,
        'Slopes that multiply to $-1$ give **perpendicular** lines, which meet at a right angle.',
        'Equal $y$-intercepts mean both lines pass through the same point on the $y$-axis, so two different lines would meet there.',
        'Slopes such as $2$ and $-2$ add to $0$, but one line rises while the other falls, so the lines cross.',
      ],
      keyIdea: 'Compare the numbers multiplying $x$ once both lines are in the form $y = mx + c$. The same slope with different intercepts means parallel. Slopes that multiply to $-1$ mean perpendicular.',
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
      asking: 'What must be true about the two slopes for the lines to meet at a right angle?',
      solution:
        '**Perpendicular** lines cross at a right angle ($90^\\circ$), like the corner of a square.\n\n' +
        'Turn a line through a right angle and its rise and run swap places, and one changes sign. A slope of 2 is a rise of 2 for a run of 1. After turning, it is a rise of 1 for a run of 2, going down, so its slope is $-\\frac{1}{2}$.\n\n' +
        'Multiply those two slopes: $2 \\times \\left(-\\frac{1}{2}\\right) = -1$. The flip cancels the sizes, and the sign change leaves a minus. This happens for any perpendicular pair.',
      conclusion: 'Multiplying two perpendicular slopes always gives $-1$, so the answer is $m_1 m_2 = -1$.',
      whyWrong: [
        null,
        'Equal slopes give parallel lines, which never meet.',
        'A product of $1$ flips the slope without changing its sign. Slopes $2$ and $\\frac{1}{2}$ both rise, so the lines do not meet at a right angle.',
        'A sum of $0$ changes the sign without flipping the slope. Slopes $2$ and $-2$ cross, but not at a right angle.',
      ],
      keyIdea: 'For a perpendicular slope, flip the fraction and change the sign: $\\frac{2}{3}$ becomes $-\\frac{3}{2}$. To test two slopes, multiply them. If the result is $-1$, the lines are perpendicular.',
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
      asking: 'What does the letter $m$ tell you about a straight line?',
      solution:
        'Take a line with real numbers in it: $y = 2x + 1$, where $m = 2$. Try $x = 0$, then $x = 1$, then $x = 2$. The values of $y$ are 1, 3, 5.\n\n' +
        'Each time $x$ goes up by 1, $y$ goes up by 2, and that 2 is $m$. It measures how steep the line is, which is called the **slope** or **gradient**.',
      conclusion: '$m$ is the amount $y$ changes for each step of 1 in $x$, so $m$ is the slope (gradient).',
      whyWrong: [
        null,
        'That is $c$, the value of $y$ when $x = 0$.',
        'The $x$-intercept is $-\\frac{c}{m}$, the value of $x$ when $y = 0$, so it depends on both numbers.',
        'At $x = 1$ the value of $y$ is $m + c$, which also includes $c$. $m$ is the change in $y$ for each unit of $x$.',
      ],
      keyIdea: 'In $y = mx + c$, $m$ multiplies $x$ and gives the slope. $c$ stands alone and gives the height where the line crosses the $y$-axis. Put $x = 0$ to see $c$ appear on its own.',
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
      asking: 'In which equation does $x$ appear only to the power 1?',
      solution:
        'An equation is **linear** in $x$ when $x$ only appears to the power 1: plain $x$, with no squares, no roots and no $x$ on the bottom of a fraction. Its graph is a straight line.\n\n' +
        'Check each equation:\n\n| Equation | How $x$ appears | Linear? |\n|---|---|---|\n| $3x + 1 = 7$ | plain $x$ | Yes |\n| $x^2 = 9$ | $x$ squared | No |\n| $\\frac{1}{x} = 2$ | $x$ on the bottom | No |\n| $\\sqrt{x} = 4$ | square root of $x$ | No |',
      conclusion: 'Only one equation has plain $x$, so the answer is $3x + 1 = 7$.',
      whyWrong: [
        null,
        'Here $x$ has the power 2, so this equation is quadratic.',
        'Here $x$ is on the bottom of a fraction, which is the power $-1$.',
        'A square root of $x$ is the power $\\frac{1}{2}$, not the power 1.',
      ],
      keyIdea: 'To spot a linear equation, look at how $x$ appears in each term. It must be plain $x$ or a number times $x$. Any other power, a root, or $x$ in a denominator rules it out.',
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
      asking: 'How steep is a flat line that stays at height 4?',
      solution:
        'The **slope** is how much $y$ changes when $x$ goes up by 1.\n\n' +
        'The equation $y = 4$ says $y$ is always 4, whatever $x$ is. For example, the points $(1, 4)$ and $(2, 4)$ are both on the line.\n\n' +
        'When $x$ goes from 1 to 2, $y$ changes by $4 - 4 = 0$. So the slope is $0 \\div 1 = 0$.',
      conclusion: 'The line never rises or falls, so the answer is $0$.',
      whyWrong: [
        null,
        '$4$ is the $y$-intercept, where the line crosses the $y$-axis.',
        'This assumes a coefficient that is not written must be 1, as in $y = x + 4$. Here there is no $x$ term at all, so its coefficient is 0.',
        'A **vertical** line, such as $x = 4$, is the one with no defined slope. This line is horizontal.',
      ],
      keyIdea: 'A line $y = k$, with no $x$ in it, is horizontal and has slope 0. A line $x = k$ is vertical and has no defined slope. If unsure, pick two points and divide the change in $y$ by the change in $x$.',
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
      asking: 'How much does $y$ go up for each step of 1 in $x$ between these two points?',
      solution:
        'The **slope** of a line is the change in $y$ divided by the change in $x$: $m = \\frac{y_2 - y_1}{x_2 - x_1}$. Here $(x_1, y_1)$ and $(x_2, y_2)$ are the two points.\n\n' +
        'Label them: $(x_1, y_1) = (1, 2)$ and $(x_2, y_2) = (3, 8)$.\n\n' +
        'Find the change in $y$: $8 - 2 = 6$. Find the change in $x$: $3 - 1 = 2$.\n\n' +
        'Divide: $m = \\frac{6}{2} = 3$.',
      conclusion: '$y$ rises 6 while $x$ rises 2, which is 3 for each step in $x$, so the answer is $3$.',
      whyWrong: [
        null,
        'This divides the change in $x$ by the change in $y$. Slope is the change in $y$ over the change in $x$.',
        'This subtracts in opposite orders, $\\frac{2 - 8}{3 - 1}$. Use the same point first on the top and on the bottom.',
        'This adds the $y$-values on top, $\\frac{8 + 2}{3 - 1}$. Slope uses the **difference** of the $y$-values.',
      ],
      keyIdea: 'Given two points, use slope $= \\frac{y_2 - y_1}{x_2 - x_1}$. Take the same point first on the top and on the bottom, so the signs come out right.',
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
      asking: 'What value of $x$ makes both sides of this equation equal?',
      solution:
        'First remove the bracket. The 5 outside multiplies everything inside: $5 \\times x = 5x$ and $5 \\times (-2) = -10$. So the equation becomes $5x - 10 = 3x + 4$.\n\n' +
        'We want all the $x$ terms on one side. Subtract $3x$ from both sides, which removes it from the right: $5x - 3x - 10 = 4$, so $2x - 10 = 4$.\n\n' +
        'Now move the number away from the $x$ term. Add 10 to both sides to cancel the $-10$: $2x = 4 + 10 = 14$.\n\n' +
        '$2x$ means 2 times $x$, so divide both sides by 2: $x = 14 \\div 2 = 7$.',
      conclusion: 'The left side is $5(7 - 2) = 25$ and the right side is $3 \\times 7 + 4 = 25$. They match, so the answer is $x = 7$.',
      whyWrong: [
        null,
        'This expands the bracket as $5x - 2$, multiplying only the $x$ by 5. Then $5x - 2 = 3x + 4$ gives $2x = 6$. The 5 multiplies both terms: $5(x - 2) = 5x - 10$.',
        'This moves $3x$ to the left by adding it, giving $8x = 14$. To remove $3x$ from the right you **subtract** $3x$ from both sides, leaving $2x$.',
        'This moves the $-10$ across without changing its sign: $2x = 4 - 10 = -6$. To remove $-10$ from the left you **add** 10 to both sides.',
      ],
      keyIdea: 'For an equation with brackets and $x$ on both sides: expand the brackets, collect the $x$ terms on one side and plain numbers on the other, then divide by the number in front of $x$.',
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
      asking: 'Which values of $x$ make $-2x + 5$ bigger than 11?',
      solution:
        'An **inequality** is solved almost like an equation, but the answer is a range of values. Start by removing the $+5$: subtract 5 from both sides. That gives $-2x > 11 - 5$, so $-2x > 6$.\n\n' +
        'To get $x$ alone we must divide by $-2$. There is one special rule: dividing both sides by a negative number flips the inequality sign.\n\n' +
        'See why with real numbers. $3 > 1$ is true. Divide both by $-1$ and you get $-3$ and $-1$, and $-3$ is less than $-1$. So the sign has to flip.\n\n' +
        'So $>$ becomes $<$, and $6 \\div (-2) = -3$. That gives $x < -3$.',
      conclusion: 'Test $x = -4$, which should work: $-2(-4) + 5 = 13$, and 13 is greater than 11. So the answer is $x < -3$.',
      whyWrong: [
        'This forgets to flip the inequality sign. Dividing both sides by a negative number ($-2$) reverses the direction, so $>$ becomes $<$.',
        null,
        'This adds 5 to both sides instead of subtracting it, getting $-2x > 16$ and then $x < -8$. To remove $+5$ you subtract 5.',
        'This ignores the minus sign in $-2x$, solving $2x > 6$ instead of $-2x > 6$. Dividing by 2 instead of $-2$ gives the number the wrong sign and leaves the inequality unflipped.',
      ],
      keyIdea: 'Solve an inequality like an equation, with one extra rule: whenever you multiply or divide both sides by a negative number, flip the sign. Then test one value from your answer in the original.',
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
      asking: 'What value of $x$ makes this equation with two fractions true?',
      solution:
        'Fractions are hard to work with, so clear them first. Find a number that both 4 and 3 divide into. The smallest is 12, so multiply every term, on both sides, by 12.\n\n' +
        'Do it term by term. $12 \\times \\frac{x + 3}{4} = 3(x + 3)$, because $12 \\div 4 = 3$. $12 \\times \\frac{x - 1}{3} = 4(x - 1)$, because $12 \\div 3 = 4$. And $12 \\times 1 = 12$.\n\n' +
        'Keep the minus sign between the fractions. The equation is now $3(x + 3) - 4(x - 1) = 12$.\n\n' +
        'Expand the brackets. $3(x + 3) = 3x + 9$. The $-4$ multiplies both terms in the second bracket: $-4 \\times x = -4x$ and $-4 \\times (-1) = +4$.\n\n' +
        'So $3x + 9 - 4x + 4 = 12$. Collect like terms: $3x - 4x = -x$ and $9 + 4 = 13$, which gives $-x + 13 = 12$.\n\n' +
        'Subtract 13 from both sides: $-x = -1$. Multiply both sides by $-1$ to remove the minus sign: $x = 1$.',
      conclusion: 'Putting it in gives $\\frac{4}{4} - \\frac{0}{3} = 1$, which matches the right side, so the answer is $x = 1$.',
      whyWrong: [
        'This forgets that the minus sign in front of the second fraction applies to its whole numerator. $-4(x - 1) = -4x + 4$, not $-4x - 4$; with the wrong sign you get $-x + 5 = 12$.',
        'This multiplies the fractions by 12 but forgets to multiply the right-hand side, solving $-x + 13 = 1$. Every term, on both sides, must be multiplied by 12.',
        null,
        'This multiplies the numerators by the wrong numbers, writing $4(x + 3) - 3(x - 1) = 12$. Multiplying $\\frac{x + 3}{4}$ by 12 gives $3(x + 3)$, because $12 \\div 4 = 3$.',
      ],
      keyIdea: 'With fractions in an equation, multiply every term by the lowest common multiple of the denominators. Put brackets round each top, keep any minus sign in front of a bracket with it, then solve as usual.',
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
      asking: 'Which values of $x$ make the left side less than or equal to the right side?',
      solution:
        'The $\\le$ sign means "less than or equal to". We solve it like an equation, but dividing by a negative number will flip the sign.\n\n' +
        'Clear the fraction by multiplying both sides by 2. This is positive, so the sign stays the same. The whole right side doubles: $4 - 3x \\le 2(x + 7)$, so $4 - 3x \\le 2x + 14$.\n\n' +
        'Collect the $x$ terms on the left by subtracting $2x$ from both sides: $4 - 5x \\le 14$.\n\n' +
        'Subtract 4 from both sides to get the numbers on the right: $-5x \\le 10$.\n\n' +
        'Divide both sides by $-5$ to get $x$ alone. Dividing by a negative flips the sign, so $\\le$ becomes $\\ge$: $x \\ge 10 \\div (-5)$, which is $x \\ge -2$.',
      conclusion: 'Test $x = 0$, which should work: the left side is 2 and the right side is 7, and $2 \\le 7$ is true. So the answer is $x \\ge -2$.',
      whyWrong: [
        'This forgets to flip the sign when dividing by $-5$. From $-5x \\le 10$, dividing by a negative number turns $\\le$ into $\\ge$.',
        'This multiplies the $x$ on the right by 2 but forgets the 7, solving $4 - 3x \\le 2x + 7$. The whole right side must be doubled: $2(x + 7) = 2x + 14$.',
        'This multiplies the 7 by 2 but not the $x$, solving $4 - 3x \\le x + 14$, which gives $-4x \\le 10$. Both terms on the right must be doubled: $2x + 14$.',
        null,
      ],
      keyIdea: 'Clear fractions first by multiplying both sides by the denominator (a positive number, so no flip). Then collect terms as in an equation, and flip the sign only if you divide by a negative.',
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
      asking: 'Rearrange the formula so that $h$ is on its own on one side.',
      solution:
        'We want $h$ alone. Only the second term on the right contains $h$, so the first term, $2\\pi r^2$, is in the way.\n\n' +
        'Remove that term by subtracting it from both sides: $A - 2\\pi r^2 = 2\\pi rh$.\n\n' +
        'Now $h$ is multiplied by $2\\pi r$, which is three things multiplied together: 2, $\\pi$ and $r$. Treat them as one block.\n\n' +
        'To undo that multiplication, divide both sides by $2\\pi r$. The whole left side goes on top: $\\frac{A - 2\\pi r^2}{2\\pi r} = h$.',
      conclusion: 'Written with $h$ first, that is $h = \\frac{A - 2\\pi r^2}{2\\pi r}$.',
      whyWrong: [
        'This divides only $A$ by $2\\pi r$. Once you have $A - 2\\pi r^2 = 2\\pi rh$, the **whole** left side must be divided by $2\\pi r$.',
        null,
        'This has a sign error: to move $2\\pi r^2$ to the other side you subtract it from both sides, so it becomes $-2\\pi r^2$.',
        'This divides by $2\\pi$ but forgets the $r$. In the formula $h$ is multiplied by $2\\pi r$, so you must divide by all of $2\\pi r$.',
      ],
      keyIdea: 'To change the subject: first move any terms without the target letter to the other side, then divide the whole of that side by everything multiplying the letter.',
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
      asking: 'Which values of $x$ keep the size of $2x - 3$ below 7?',
      solution:
        'The bars mean **absolute value**, the size of a number ignoring its sign. If a number\'s size is less than 7, the number lies between $-7$ and 7.\n\n' +
        'So the inequality means $-7 < 2x - 3 < 7$. This has three parts, and whatever we do, we do to all three.\n\n' +
        'Add 3 to all three parts to undo the $-3$: $-7 + 3 < 2x < 7 + 3$, so $-4 < 2x < 10$.\n\n' +
        'Divide all three parts by 2. It is positive, so the signs stay the same: $-2 < x < 5$.',
      conclusion: 'Test $x = 0$: the size of $2 \\times 0 - 3$ is 3, which is below 7, and 0 lies in the range. So the answer is $-2 < x < 5$.',
      whyWrong: [
        null,
        'This only uses $2x - 3 < 7$ and forgets the other half, $2x - 3 > -7$. "Less than 7 in size" means between $-7$ and 7.',
        'This is the solution of $|2x - 3| > 7$. A "less than" absolute value inequality gives the values **between** two numbers, not outside them.',
        'This subtracts 3 from each part instead of adding it, getting $-10 < 2x < 4$. To undo $-3$ you add 3.',
      ],
      keyIdea: '$|A| < c$ means $A$ is between two values: write $-c < A < c$, then do the same to all three parts. $|A| > c$ means $A$ is outside them: $A < -c$ or $A > c$.',
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
      asking: 'How many kilometres long was a ride that cost AED 47 in total?',
      solution:
        'Let $d$ be the distance in km. The cost has two parts: a fixed fee of 12, paid once, and 2.50 for each km, which is $2.5d$.\n\n' +
        'So the total is $12 + 2.5d$, and we know the total was 47. Write that as an equation: $12 + 2.5d = 47$.\n\n' +
        'Subtract 12 from both sides to remove the fixed fee: $2.5d = 35$. So AED 35 was paid for the distance.\n\n' +
        'Divide both sides by 2.5 to find the number of km: $d = 35 \\div 2.5 = 14$.',
      conclusion: 'Putting it back in gives $12 + 2.5 \\times 14 = 12 + 35 = 47$. So the ride was $14$ km.',
      whyWrong: [
        'This divides the whole fare by 2.50 ($47 \\div 2.5 = 18.8$), forgetting that AED 12 of the fare is the fixed fee, not distance.',
        'This adds the fixed fee instead of subtracting it: $(47 + 12) \\div 2.5 = 23.6$.',
        null,
        'This is $47 - 12 = 35$, the amount paid for the distance in AED, not the number of kilometres. You still need to divide by 2.50 per km.',
      ],
      keyIdea: 'For "fixed fee plus a rate" problems, write total $=$ fixed amount $+$ rate $\\times$ quantity. Take off the fixed amount first, then divide by the rate.',
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
      asking: 'How many whole numbers $x$ put $2x + 5$ in the range from $-3$ up to just below 11?',
      solution:
        'This has three parts, with $2x + 5$ in the middle. Whatever we do to the middle, we do to all three. **Integers** are whole numbers: positive, negative or zero.\n\n' +
        'Subtract 5 from all three parts: $-3 - 5 \\le 2x < 11 - 5$, so $-8 \\le 2x < 6$.\n\n' +
        'Divide all three parts by 2. It is positive, so the signs stay the same: $-4 \\le x < 3$.\n\n' +
        'Now read the signs. $\\le$ means $-4$ is included. $<$ means 3 is not included.\n\n' +
        'List the integers from $-4$ up to, but not including, 3: $-4, -3, -2, -1, 0, 1, 2$. Count them: there are 7.',
      conclusion: 'The list has 7 integers, so the answer is $7$.',
      whyWrong: [
        'This also counts $x = 3$, treating $<$ as $\\le$. At $x = 3$, $2x + 5 = 11$, which is not **less than** 11.',
        'This leaves out $x = -4$ (or works out $2 - (-4) = 6$, which undercounts by one). At $x = -4$, $2x + 5 = -3$, and $-3 \\le -3$ is true, so $-4$ counts.',
        'This subtracts 5 from the middle part only, getting $-3 \\le 2x < 6$, so $-1.5 \\le x < 3$, which contains just the integers $-1, 0, 1, 2$. Whatever you do to the middle you must do to **all three** parts: $-8 \\le 2x < 6$.',
        null,
      ],
      keyIdea: 'To count integers in a double inequality: do the same to all three parts until $x$ is alone, see which ends are included, then list the integers and count them. Subtracting the two ends can miss one.',
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
      asking: 'Rearrange the formula so that $L$ is on its own on one side.',
      solution:
        '$L$ is buried inside a square root that is multiplied by $2\\pi$. We peel the layers off from the outside, doing the same to both sides.\n\n' +
        'The outside layer is the multiplication by $2\\pi$. Divide both sides by $2\\pi$: $\\frac{T}{2\\pi} = \\sqrt{\\frac{L}{g}}$.\n\n' +
        'The next layer is the square root. Squaring undoes a square root, so square both sides: $\\left(\\frac{T}{2\\pi}\\right)^2 = \\frac{L}{g}$.\n\n' +
        'Square the top and the bottom of the left fraction. The whole of $2\\pi$ is squared: $(2\\pi)^2 = 2^2 \\times \\pi^2 = 4\\pi^2$. So $\\frac{T^2}{4\\pi^2} = \\frac{L}{g}$.\n\n' +
        'The last layer is $L$ being divided by $g$. Multiply both sides by $g$ to undo it: $\\frac{gT^2}{4\\pi^2} = L$.',
      conclusion: 'Written with $L$ first, that is $L = \\frac{gT^2}{4\\pi^2}$.',
      whyWrong: [
        null,
        'This forgets to square. After dividing by $2\\pi$ you have $\\sqrt{\\frac{L}{g}}$, and a square root is undone by **squaring** both sides.',
        'This squares $T$ and $\\pi$ but not the 2. The whole of $2\\pi$ must be squared: $(2\\pi)^2 = 4\\pi^2$, not $2\\pi^2$.',
        'This divides by $g$ at the end instead of multiplying. In the formula $L$ is divided by $g$, so to undo that you multiply by $g$.',
      ],
      keyIdea: 'To change the subject with a root, peel from the outside: divide off anything multiplying the root, square both sides to remove the root, then undo what remains. Square every part of a bracket.',
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
      asking: 'What value of $x$ makes both sides of this equation equal?',
      solution:
        'Expand the left bracket. The $-3$ multiplies both terms: $-3 \\times 2x = -6x$ and $-3 \\times (-5) = +15$, because two negatives multiply to a positive. The left side is now $4 - 6x + 15$.\n\n' +
        'Combine the plain numbers on the left: $4 + 15 = 19$. So the left side is $19 - 6x$.\n\n' +
        'Expand the right bracket: $2(x + 1) = 2x + 2$. The right side is $2x + 2 - 7$, and $2 - 7 = -5$, so it is $2x - 5$.\n\n' +
        'The equation is now $19 - 6x = 2x - 5$. Add $6x$ to both sides to gather the $x$ terms on the right, where they stay positive: $19 = 8x - 5$.\n\n' +
        'Add 5 to both sides: $24 = 8x$.\n\n' +
        'Divide both sides by 8: $x = 24 \\div 8 = 3$.',
      conclusion: 'The left side is $4 - 3(6 - 5) = 1$ and the right side is $2(3 + 1) - 7 = 1$. They match, so the answer is $x = 3$.',
      whyWrong: [
        'This gets the sign wrong in $-3 \\times (-5)$, writing $-6x - 15$. The product of two negatives is positive: $-3(2x - 5) = -6x + 15$. With the wrong sign you get $-6 = 8x$.',
        null,
        'This multiplies only the $x$ in $2(x + 1)$ by 2, writing $2x + 1$ instead of $2x + 2$. Then $19 - 6x = 2x - 6$ gives $25 = 8x$.',
        'This moves $-6x$ to the right without changing its sign, getting $24 = 2x - 6x = -4x$. Adding $6x$ to both sides gives $24 = 8x$.',
      ],
      keyIdea: 'Expand each bracket with the sign in front of it: a minus outside changes both signs inside. Simplify each side separately before moving anything across, then solve.',
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
      asking: 'How many whole months until the total paid on plan P is less than on plan Q?',
      solution:
        'Let $m$ be the number of months. Plan P\'s total is the fee plus 50 a month: $200 + 50m$. Plan Q\'s total is 80 a month: $80m$.\n\n' +
        'P is cheaper when its total is less than Q\'s: $200 + 50m < 80m$.\n\n' +
        'Subtract $50m$ from both sides: $200 < 30m$. This says P saves AED 30 each month, and those savings must beat the AED 200 fee.\n\n' +
        'Divide both sides by 30: $m > 200 \\div 30$, which is about 6.67.\n\n' +
        'Months must be whole, and $m$ must be more than 6.67. So 6 is too small, and the first whole number above it is 7.',
      conclusion: 'After 7 months P costs AED 550 and Q costs AED 560. After 6 months P is still dearer, at 500 against 480. So the answer is $7$.',
      whyWrong: [
        'This rounds $6.67$ down. After 6 months plan P costs AED 500 but plan Q costs AED 480, so P is not cheaper yet. Since $m$ must be **greater** than $6.67$, round up.',
        'This divides the one-off fee by plan P\'s monthly cost ($200 \\div 50 = 4$). The fee is paid back by the **difference** in monthly costs, $80 - 50 = 30$ per month.',
        null,
        'This divides the fee by the **sum** of the monthly costs ($200 \\div 130 \\approx 1.5$, rounded up to 2). The saving each month is the difference, $80 - 50 = 30$.',
      ],
      keyIdea: 'To find when one plan becomes cheaper: write each total in terms of time, set up an inequality and solve it. For a whole-number answer, round up to the first whole number that satisfies the inequality, then test it.',
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
      asking: 'Rearrange the formula so that $x$ is on its own, with no $x$ on the other side.',
      solution:
        '$x$ appears twice, once on top and once on the bottom. We need to bring them together. First clear the fraction by multiplying both sides by $x - 1$: $y(x - 1) = 2x + 3$.\n\n' +
        'Expand the bracket. $y$ multiplies both terms: $xy - y = 2x + 3$.\n\n' +
        'Put every term containing $x$ on the left and everything else on the right. Subtract $2x$ from both sides and add $y$ to both sides: $xy - 2x = y + 3$.\n\n' +
        'Both terms on the left contain $x$, so take $x$ out as a common factor: $x(y - 2) = y + 3$. Now $x$ appears only once.\n\n' +
        'Divide both sides by $y - 2$ to leave $x$ alone: $x = \\frac{y + 3}{y - 2}$.',
      conclusion: 'Those steps leave $x$ alone with no $x$ on the other side, so the answer is $x = \\frac{y + 3}{y - 2}$.',
      whyWrong: [
        'This moves $-y$ across without changing its sign. From $xy - y = 2x + 3$, adding $y$ to both sides gives $xy - 2x = y + 3$, not $3 - y$.',
        'This expands $y(x - 1)$ as $xy - 1$, forgetting to multiply the 1 by $y$. It should be $xy - y$.',
        null,
        'This makes a sign slip when collecting the $x$ terms: $xy - 2x = x(y - 2)$, not $x(2 - y)$. The result has the right size but the wrong sign.',
      ],
      keyIdea: 'If the target letter appears twice: clear fractions, expand, collect all terms with that letter on one side, factorise it out so it appears once, then divide by the bracket.',
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
      asking: 'For which $k$ is there no value of $x$ that makes this equation true?',
      solution:
        'We want to collect all the $x$ terms together, so we can see what multiplies $x$. Expand the bracket: $kx - 2k = 3x + 4$.\n\n' +
        'Subtract $3x$ from both sides and add $2k$ to both sides: $kx - 3x = 2k + 4$.\n\n' +
        'Take $x$ out as a common factor on the left: $(k - 3)x = 2k + 4$.\n\n' +
        'Normally we would divide by $k - 3$ to find $x$. The only thing that can stop us is $k - 3$ being zero, because you cannot divide by zero.\n\n' +
        'Set $k - 3 = 0$, which gives $k = 3$. The equation becomes $0 \\times x = 2 \\times 3 + 4$, so $0 = 10$. That is false for every $x$, so there is no solution.',
      conclusion: 'At $k = 3$ the $x$ terms cancel and leave the false statement $0 = 10$, so the answer is $k = 3$.',
      whyWrong: [
        'This makes the constant $2k + 4$ equal to zero. With $k = -2$ the equation becomes $-5x = 0$, which has exactly one solution, $x = 0$.',
        null,
        'This makes a sign slip collecting the $x$ terms, getting $(k + 3)x$ instead of $(k - 3)x$. With $k = -3$ the equation is $-6x = -2$, which has the solution $x = \\frac{1}{3}$.',
        'With $k = 0$ the left side is 0, but the equation $0 = 3x + 4$ still has the solution $x = -\\frac{4}{3}$. Making one side zero does not remove the solution.',
      ],
      keyIdea: 'To find when an equation has no solution: collect it into the form (number)$\\times x =$ (number), set the number multiplying $x$ to 0, and test that the other side is not also 0. If both are 0, every $x$ works.',
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
      asking: 'What number multiplies $x$ once this line is written as $y = mx + c$?',
      solution:
        'The **slope** is easy to read when the line is written as $y = mx + c$, because it is $m$, the number multiplying $x$. So rearrange to get $y$ on its own.\n\n' +
        'Subtract $3x$ from both sides: $6y = -3x + 2$.\n\n' +
        'Divide every term by 6 to leave $y$ alone: $y = -\\frac{3}{6}x + \\frac{2}{6}$.\n\n' +
        'Simplify the number multiplying $x$: $-\\frac{3}{6} = -\\frac{1}{2} = -0.5$.',
      conclusion: 'The number multiplying $x$ is $-\\frac{1}{2}$, which as a decimal is the answer, $-0.5$.',
      whyWrong: [
        null,
        'This is $\\frac{3}{6}$ without its minus sign. Moving $3x$ across the equals sign makes it $-3x$.',
        'This is $-\\frac{6}{3}$: the fraction is upside down. You divide by the number multiplying $y$, which is 6, not by 3.',
        'This is $\\frac{6}{3}$: the fraction is upside down and the minus sign was lost as well.',
      ],
      keyIdea: 'For $ax + by = c$, where $a$ and $b$ are the numbers multiplying $x$ and $y$: rearrange to get $y$ on its own and read off the number multiplying $x$. The quick version is that the slope is always $-\\frac{a}{b}$.',
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
      asking: 'What number multiplies $x$ once this line is written as $y = mx + c$?',
      solution:
        'The **slope** is the $m$ in $y = mx + c$, the number multiplying $x$. So rearrange to get $y$ on its own.\n\n' +
        'Subtract $4x$ from both sides: $-4y = -4x + 9$.\n\n' +
        'Divide every term by $-4$, which changes each sign: $y = \\frac{-4}{-4}x + \\frac{9}{-4}$, so $y = x - \\frac{9}{4}$.\n\n' +
        'No number is written in front of $x$, which means it is multiplied by 1. So the slope is 1.',
      conclusion: '$x$ is the same as one lot of $x$, so the number multiplying it is the answer, $1$.',
      whyWrong: [
        null,
        'This is $\\frac{4}{-4}$: the minus sign that appears when $4x$ moves across the equals sign was left out.',
        'This is $\\frac{9}{-4}$, the $y$-intercept (the number on its own in $y = x - \\frac{9}{4}$), not the slope.',
        'This adds the numbers in front of $x$ and $y$, $4 + (-4)$. The slope comes from dividing them, not adding them.',
      ],
      keyIdea: 'For $ax + by = c$, rearrange to get $y$ on its own and read off the number multiplying $x$. Divide by the number multiplying $y$, keeping its sign. If $x$ has no number in front, its number is 1.',
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
      asking: 'How steep is the line $2x + 5y = 10$, as a number?',
      solution:
        'The **gradient** is another word for slope: how much $y$ changes when $x$ goes up by 1. It is the $m$ in $y = mx + c$, so rearrange to get $y$ on its own.\n\n' +
        'Subtract $2x$ from both sides: $5y = -2x + 10$.\n\n' +
        'Divide every term by 5 to leave $y$ alone: $y = -\\frac{2}{5}x + 2$.',
      conclusion: 'The number multiplying $x$ is the gradient, so the answer is $-\\frac{2}{5}$.',
      whyWrong: [
        null,
        'This is the fraction without its minus sign. The sign changes when $2x$ moves across the equals sign.',
        'This is the fraction upside down. You divide by 5, the number multiplying $y$, so 5 goes on the bottom.',
        'This is $\\frac{10}{5}$, the $y$-intercept (the number on its own in $y = -\\frac{2}{5}x + 2$), not the gradient.',
      ],
      keyIdea: 'To find a gradient from $ax + by = c$: move the $x$ term across, which changes its sign, then divide every term by the number multiplying $y$. Read off the number multiplying $x$.',
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
      asking: 'At what height does this line cross the $y$-axis?',
      solution:
        'The **$y$-intercept** is where the line crosses the $y$-axis. Every point on that axis has $x = 0$, so put $x = 0$ into the equation.\n\n' +
        'Substitute: $4 \\times 0 + 3y = 12$, so $3y = 12$.\n\n' +
        'Divide both sides by 3: $y = 12 \\div 3 = 4$.',
      conclusion: 'The line crosses the $y$-axis at the point $(0, 4)$, so the $y$-intercept is $4$.',
      whyWrong: [
        null,
        '$3$ is the $x$-intercept: putting $y = 0$ gives $4x = 12$, so $x = 3$.',
        '$12$ forgets to divide by the coefficient of $y$. $3y = 12$ gives $y = 4$.',
        '$-\\frac{4}{3}$ is the slope (the number multiplying $x$ once $y$ is alone), not the intercept.',
      ],
      keyIdea: 'To find a $y$-intercept from $ax + by = c$, put $x = 0$ and solve for $y$. To find an $x$-intercept, put $y = 0$ and solve for $x$.',
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
      asking: 'Which line has the same steepness as $2x + y = 5$?',
      solution:
        '**Parallel** lines never meet, so they must have the same slope. The slope is $m$ in $y = mx + c$, the number multiplying $x$. So find the slope of the given line first.\n\n' +
        'Rearrange to get $y$ alone. Subtract $2x$ from both sides: $y = -2x + 5$. The number multiplying $x$ is $-2$, so its slope is $-2$.\n\n' +
        'Now look at the number multiplying $x$ in each choice. They are $-2$, $2$, $\\frac{1}{2}$ and $-\\frac{1}{2}$, so only one line matches: $y = -2x + 1$.',
      conclusion: 'It has the same slope, $-2$, and a different intercept, so the two lines never meet. The answer is $y = -2x + 1$.',
      whyWrong: [
        null,
        'Slope $2$ comes from losing the minus sign when $2x$ moves across the equals sign.',
        'Slope $\\frac{1}{2}$ is the negative reciprocal of $-2$, so this line is **perpendicular** to the given line.',
        'Slope $-\\frac{1}{2}$ has the fraction upside down. $2x + y = 5$ rearranges to a slope of $-2$, not $-\\frac{1}{2}$.',
      ],
      keyIdea: 'To pick a parallel line, rearrange the given line to $y = mx + c$ and read off $m$. A parallel line has the same $m$ and a different number on the end.',
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
      asking: 'What slope would a line need to meet $3x - 2y = 7$ at a right angle?',
      solution:
        'First find the slope of the given line by rearranging to $y = mx + c$. Subtract $3x$ from both sides: $-2y = -3x + 7$.\n\n' +
        'Divide every term by $-2$: $y = \\frac{3}{2}x - \\frac{7}{2}$. So the given line has slope $\\frac{3}{2}$.\n\n' +
        '**Perpendicular** lines meet at a right angle, and their slopes multiply to $-1$. So we need a slope $m$ with $\\frac{3}{2} \\times m = -1$.\n\n' +
        'Solve it by dividing $-1$ by $\\frac{3}{2}$, which is the same as multiplying by $\\frac{2}{3}$: $m = -1 \\times \\frac{2}{3} = -\\frac{2}{3}$. In short, flip the fraction and change the sign.',
      conclusion: 'Multiplying the slopes gives $\\frac{3}{2} \\times \\left(-\\frac{2}{3}\\right) = -1$, so the answer is $-\\frac{2}{3}$.',
      whyWrong: [
        null,
        '$\\frac{3}{2}$ is the slope of the given line itself, which would make the lines parallel.',
        '$\\frac{2}{3}$ flips the fraction but keeps the sign, so the product of the slopes is $+1$, not $-1$.',
        '$-\\frac{3}{2}$ changes the sign but does not flip the fraction, so the product is $-\\frac{9}{4}$, not $-1$.',
      ],
      keyIdea: 'For a perpendicular slope: rearrange the line to get its slope, flip the fraction, and change the sign. To test it, multiply the two slopes, which must give $-1$.',
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
      asking: 'What is the equation of the line with the same slope as $y = 3x - 4$ that goes through $(2, 5)$?',
      solution:
        'A straight line can be written as $y = mx + c$. Here $m$ is the slope and $c$ is where it crosses the $y$-axis. We need to find both.\n\n' +
        '**Parallel** lines have the same slope. The given line has $m = 3$, the number multiplying $x$. So our line also has $m = 3$, which gives $y = 3x + c$.\n\n' +
        'To find $c$, use the point $(2, 5)$. It lies on the line, so $x = 2$ and $y = 5$ must fit the equation: $5 = 3 \\times 2 + c$, so $5 = 6 + c$.\n\n' +
        'Subtract 6 from both sides: $c = 5 - 6 = -1$.\n\n' +
        'Put $m$ and $c$ into the equation: $y = 3x - 1$.',
      conclusion: 'At $x = 2$ this gives $3 \\times 2 - 1 = 5$, the right height for the point. So the answer is $y = 3x - 1$.',
      whyWrong: [
        null,
        'This uses the $y$-coordinate of the point as the intercept. 5 is the height at $x = 2$, not at $x = 0$.',
        'This is the given line itself. At $x = 2$ it gives $y = 2$, not $5$, so it does not pass through the point.',
        'This line has the perpendicular slope, $-\\frac{1}{3}$. It passes through the point but meets the given line at a right angle.',
      ],
      keyIdea: 'For a line through a point with a known slope: write $y = mx + c$ with the slope filled in, put the point\'s $x$ and $y$ in to find $c$, then write the final equation.',
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
      asking: 'Which line goes through $(0, 2)$ and meets $2x + 4y = 5$ at a right angle?',
      solution:
        'First find the slope of the given line. Subtract $2x$ from both sides: $4y = -2x + 5$.\n\n' +
        'Divide every term by 4: $y = -\\frac{2}{4}x + \\frac{5}{4}$, so $y = -\\frac{1}{2}x + \\frac{5}{4}$. Its slope is $-\\frac{1}{2}$, the number multiplying $x$.\n\n' +
        '**Perpendicular** lines meet at a right angle, and their slopes multiply to $-1$. To get the new slope, flip the fraction and change the sign: $-\\frac{1}{2}$ becomes $2$, since $-\\frac{1}{2} \\times 2 = -1$.\n\n' +
        'The point $(0, 2)$ has $x = 0$, so it is on the $y$-axis. That means the line crosses the $y$-axis at 2, so $c = 2$ in $y = mx + c$.\n\n' +
        'Use $m = 2$ and $c = 2$: $y = 2x + 2$.',
      conclusion: 'The slope 2 is perpendicular to $-\\frac{1}{2}$, and at $x = 0$ the line gives $y = 2$. So the answer is $y = 2x + 2$.',
      whyWrong: [
        null,
        'Slope $-2$ flips the fraction but keeps the sign, so the product of the slopes is $+1$, not $-1$.',
        'Slope $-\\frac{1}{2}$ is the slope of the given line itself, which would make the lines parallel.',
        'Slope $\\frac{1}{2}$ changes the sign but does not flip the fraction, so the product is $-\\frac{1}{4}$, not $-1$.',
      ],
      keyIdea: 'For a perpendicular line through a point: rearrange the given line to find its slope, flip the fraction and change the sign, then use the point to find $c$ in $y = mx + c$.',
    },
    check: {
      // the slope of each option
      optionValues: [2, -2, -1 / 2, 1 / 2],
      compute: () => -1 / lineSlope(2, 4, 5),
    },
  },
];
