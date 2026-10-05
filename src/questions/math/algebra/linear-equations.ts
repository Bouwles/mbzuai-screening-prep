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
    id: 'linear-equations-002',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'Solve $5(x - 2) = 3x + 4$.',
    options: ['$x = 7$', '$x = 3$', '$x = \\frac{7}{4}$', '$x = -3$'],
    correctIndex: 0,
    markScheme: {
      solution:
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
    difficulty: 'foundation',
    stem: 'Solve the inequality $-2x + 5 > 11$.',
    options: ['$x > -3$', '$x < -3$', '$x < -8$', '$x > 3$'],
    correctIndex: 1,
    markScheme: {
      solution:
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
    id: 'linear-equations-004',
    subtopic: 'linear-equations',
    difficulty: 'foundation',
    stem: 'The formula $v = u + at$ gives the final speed $v$ of an object. Make $t$ the subject of the formula.',
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

  // ------------------------------------------------------------ exam
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
    stem: 'The total surface area of a closed cylinder is $A = 2\\pi r^2 + 2\\pi rh$. Make $h$ the subject of the formula.',
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
    stem: 'The period of a simple pendulum is $T = 2\\pi\\sqrt{\\frac{L}{g}}$. Make $L$ the subject of the formula.',
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
    stem: 'Gym plan P costs a one-off joining fee of AED 200 plus AED 50 per month. Gym plan Q has no joining fee and costs AED 80 per month. What is the smallest whole number of months for which plan P is **cheaper** than plan Q?',
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
        'This divides the joining fee by plan P\'s monthly cost ($200 \\div 50 = 4$). The fee is paid back by the **difference** in monthly costs, $80 - 50 = 30$ per month.',
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

  // ------------------------------------------------------------ challenge
  {
    id: 'linear-equations-015',
    subtopic: 'linear-equations',
    difficulty: 'challenge',
    stem: 'Solve $|x + 1| = 2x - 4$.',
    options: ['$x = 5$ or $x = 1$', '$x = 1$ only', '$x = 5$ or $x = \\frac{5}{3}$', '$x = 5$ only'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Split into the two cases, then **check** each answer in the original equation (the right-hand side $2x - 4$ could be negative, and an absolute value never is).\n\n' +
        '- Case 1: $x + 1 = 2x - 4$. Subtract $x$ and add 4: $x = 5$.\n' +
        '- Case 2: $-(x + 1) = 2x - 4$, i.e. $-x - 1 = 2x - 4$. Add $x$ and add 4: $3 = 3x$, so $x = 1$.\n\n' +
        'Check:\n\n' +
        '- $x = 5$: left $|6| = 6$, right $2(5) - 4 = 6$. Works.\n' +
        '- $x = 1$: left $|2| = 2$, right $2(1) - 4 = -2$. Fails, so reject it.\n\n' +
        'Quick way to see it: $|x + 1| \\ge 0$, so we need $2x - 4 \\ge 0$, i.e. $x \\ge 2$. Only $x = 5$ qualifies.',
      whyWrong: [
        'This solves both cases correctly but forgets to **check** them. $x = 1$ gives $|2| = 2$ on the left but $-2$ on the right; an absolute value can never equal a negative number, so $x = 1$ must be rejected.',
        'This rejects the wrong root. $x = 5$ works ($|6| = 6$ and $2(5) - 4 = 6$), while $x = 1$ makes the right side $-2$, which an absolute value can never equal.',
        'This expands $-(x + 1)$ as $-x + 1$ in the second case. The minus sign applies to both terms: $-(x + 1) = -x - 1$. (And $x = \\frac{5}{3}$ fails the check anyway, because it makes $2x - 4$ negative.)',
        null,
      ],
      keyIdea: 'When the other side of an absolute value equation contains $x$, solve both cases and then check each answer, rejecting any that make that side negative.',
    },
    check: {
      optionValues: ['1,5', '1', '1.6667,5', '5'],
      compute: () => solutionSet((x) => Math.abs(x + 1) === 2 * x - 4),
    },
  },
  {
    id: 'linear-equations-016',
    subtopic: 'linear-equations',
    difficulty: 'challenge',
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
    id: 'linear-equations-017',
    subtopic: 'linear-equations',
    difficulty: 'challenge',
    stem: 'Solve $|2x - 1| = |x + 4|$.',
    options: ['$x = -1$ or $x = 5$', '$x = 5$ only', '$x = \\frac{5}{3}$ or $x = 5$', '$x = -\\frac{5}{3}$ or $x = 5$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Two absolute values are equal when the insides are **equal** or **opposite**.\n\n' +
        '- Case 1: $2x - 1 = x + 4$. Subtract $x$, add 1: $x = 5$.\n' +
        '- Case 2: $2x - 1 = -(x + 4) = -x - 4$. Add $x$, add 1: $3x = -3$, so $x = -1$.\n\n' +
        'Check: $x = 5$ gives $|9| = 9$ and $|9| = 9$; $x = -1$ gives $|-3| = 3$ and $|3| = 3$. Both work.\n\n' +
        '(Other sign combinations just repeat these two equations.)',
      whyWrong: [
        null,
        'This only solves $2x - 1 = x + 4$. Equal absolute values also happen when the insides are opposite, so you also need $2x - 1 = -(x + 4)$.',
        'This writes $-(x + 4)$ as $-x + 4$, so the second case becomes $2x - 1 = -x + 4$. The minus sign multiplies both terms: $-(x + 4) = -x - 4$.',
        'This writes $-(2x - 1)$ as $-2x - 1$, so the second case becomes $-2x - 1 = x + 4$. In fact $-(2x - 1) = -2x + 1$.',
      ],
      keyIdea: '$|A| = |B|$ means $A = B$ or $A = -B$; solve both linear equations.',
    },
    check: {
      optionValues: ['-1,5', '5', '1.6667,5', '-1.6667,5'],
      compute: () => solutionSet((x) => Math.abs(2 * x - 1) === Math.abs(x + 4)),
    },
  },
  {
    id: 'linear-equations-018',
    subtopic: 'linear-equations',
    difficulty: 'challenge',
    stem: 'For which value of $k$ does the equation $k(x - 2) = 3x + 4$ have **no** solution?',
    options: ['$k = -2$', '$k = 3$', '$k = -3$', '$k = 0$'],
    correctIndex: 1,
    markScheme: {
      solution:
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
    id: 'linear-equations-019',
    subtopic: 'linear-equations',
    difficulty: 'challenge',
    stem: 'The lens formula is $\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$. Make $v$ the subject.',
    options: ['$v = f - u$', '$v = \\frac{u - f}{uf}$', '$v = \\frac{uf}{f - u}$', '$v = \\frac{uf}{u - f}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Subtract $\\frac{1}{u}$ from both sides: $\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u}$.\n' +
        '2. Use the common denominator $uf$: $\\frac{1}{v} = \\frac{u}{uf} - \\frac{f}{uf} = \\frac{u - f}{uf}$.\n' +
        '3. Take the reciprocal (flip) of both sides: $v = \\frac{uf}{u - f}$.\n\n' +
        'Check: $u = 6$ and $v = 3$ give $\\frac{1}{f} = \\frac{1}{6} + \\frac{1}{3} = \\frac{1}{2}$, so $f = 2$; then $\\frac{uf}{u - f} = \\frac{12}{4} = 3$.',
      whyWrong: [
        'This flips each term separately, turning $\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u}$ into $v = f - u$. The reciprocal of a difference is not the difference of the reciprocals: $\\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$, whose reciprocal is 6, not $2 - 3$.',
        'This correctly finds $\\frac{1}{v} = \\frac{u - f}{uf}$ but forgets the last step: you still have to take the reciprocal to get $v$ itself.',
        'This makes a sign slip combining the fractions: $\\frac{1}{f} - \\frac{1}{u} = \\frac{u - f}{uf}$, not $\\frac{f - u}{uf}$.',
        null,
      ],
      keyIdea: 'Combine the fractions into a single fraction first, and only then take the reciprocal of both sides.',
    },
    check: {
      // evaluate each option at u = 6, f = 2 and solve 1/u + 1/v = 1/f for v numerically
      optionValues: [2 - 6, (6 - 2) / (6 * 2), (6 * 2) / (2 - 6), (6 * 2) / (6 - 2)],
      compute: () => {
        const u = 6;
        const f = 2;
        return bisect((v) => 1 / u + 1 / v - 1 / f, 0.1, 1000);
      },
    },
  },
  {
    id: 'linear-equations-020',
    subtopic: 'linear-equations',
    difficulty: 'challenge',
    stem: 'Solve the inequality $|3 - 2x| \\ge 5$.',
    options: ['$-1 \\le x \\le 4$', '$x \\le -4$ or $x \\ge 1$', '$x \\le -1$ or $x \\ge 4$', '$x \\le -1$ only'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$|3 - 2x| \\ge 5$ means $3 - 2x$ is at least 5 away from 0, so **either** $3 - 2x \\ge 5$ **or** $3 - 2x \\le -5$.\n\n' +
        '- Case 1: $3 - 2x \\ge 5$. Subtract 3: $-2x \\ge 2$. Divide by $-2$ and flip: $x \\le -1$.\n' +
        '- Case 2: $3 - 2x \\le -5$. Subtract 3: $-2x \\le -8$. Divide by $-2$ and flip: $x \\ge 4$.\n\n' +
        'So $x \\le -1$ or $x \\ge 4$.\n\n' +
        'Check: $x = 5$ gives $|-7| = 7 \\ge 5$ (true); $x = 0$ gives $|3| = 3$, which is not $\\ge 5$ (false).',
      whyWrong: [
        'This gives the values **between** $-1$ and 4, which is the answer to $|3 - 2x| \\le 5$. For "greater than or equal to", the solution is the two outer pieces.',
        'This adds 3 instead of subtracting it in each case (for example $3 - 2x \\ge 5$ becomes $-2x \\ge 8$). Subtracting 3 gives $-2x \\ge 2$ and $-2x \\le -8$.',
        null,
        'This only solves $3 - 2x \\ge 5$ and forgets the second case $3 - 2x \\le -5$, which adds the values $x \\ge 4$.',
      ],
      keyIdea: '$|A| \\ge c$ splits into $A \\ge c$ or $A \\le -c$ (two outer pieces); remember to flip when dividing by a negative.',
    },
    check: {
      optionValues: ['-1<=x<=4', 'x<=-4 or x>=1', 'x<=-1 or x>=4', 'x<=-1'],
      compute: () =>
        matchSet((x) => Math.abs(3 - 2 * x) >= 5, {
          '-1<=x<=4': (x) => -1 <= x && x <= 4,
          'x<=-4 or x>=1': (x) => x <= -4 || x >= 1,
          'x<=-1 or x>=4': (x) => x <= -1 || x >= 4,
          'x<=-1': (x) => x <= -1,
        }),
    },
  },
];
