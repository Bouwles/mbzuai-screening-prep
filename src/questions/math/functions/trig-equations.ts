import type { StaticQuestion } from '../../../types';

// ---- helpers used only by the answer checks (re-derive answers by brute force) ----
const rad = (d: number) => (d * Math.PI) / 180;
/** Every whole degree d in [lo, hi] where f(d in radians) = 0, joined as "a,b,c". */
const solveDeg = (f: (x: number) => number, lo: number, hi: number): string => {
  const out: number[] = [];
  for (let d = lo; d <= hi; d++) if (Math.abs(f(rad(d))) < 1e-9) out.push(d);
  return out.join(',');
};
/** Every k in [0, kMax] where f(k*pi/12) = 0, joined as "k1,k2". */
const solvePi12 = (f: (x: number) => number, kMax: number): number[] => {
  const out: number[] = [];
  for (let k = 0; k <= kMax; k++) if (Math.abs(f((k * Math.PI) / 12)) < 1e-9) out.push(k);
  return out;
};

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'trig-equations-001',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: '$\\theta$ is an acute angle and $\\sin\\theta = \\frac{3}{5}$. What is $\\cos\\theta$?',
    options: ['$\\frac{2}{5}$', '$\\frac{16}{25}$', '$\\frac{4}{5}$', '$\\frac{3}{4}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Use the identity $\\sin^2\\theta + \\cos^2\\theta = 1$.\n\n' +
        '1. $\\cos^2\\theta = 1 - \\sin^2\\theta = 1 - \\left(\\frac{3}{5}\\right)^2 = 1 - \\frac{9}{25} = \\frac{16}{25}$\n' +
        '2. $\\cos\\theta = \\pm\\sqrt{\\frac{16}{25}} = \\pm\\frac{4}{5}$\n' +
        '3. $\\theta$ is acute (between $0^\\circ$ and $90^\\circ$), so $\\cos\\theta$ is positive: $\\cos\\theta = \\frac{4}{5}$.\n\n' +
        'Quick check with a right-angled triangle: opposite 3, hypotenuse 5, so the adjacent side is 4 (the 3-4-5 triangle) and $\\cos\\theta = \\frac{4}{5}$.',
      whyWrong: [
        'This is $1 - \\frac{3}{5}$: it assumes $\\sin\\theta + \\cos\\theta = 1$. The identity is about the **squares**: $\\sin^2\\theta + \\cos^2\\theta = 1$.',
        'This is $\\cos^2\\theta$, not $\\cos\\theta$: the square root was never taken at the end.',
        null,
        'This is $\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{3}{4}$, not $\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$.',
      ],
      keyIdea: 'Use $\\sin^2\\theta + \\cos^2\\theta = 1$ to get one ratio from the other, then choose the sign from the quadrant.',
    },
    check: {
      optionValues: [2 / 5, 16 / 25, 4 / 5, 3 / 4],
      compute: () => Math.cos(Math.asin(3 / 5)),
    },
  },
  {
    id: 'trig-equations-002',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'For an angle $\\theta$, $\\sin\\theta = \\frac{3}{5}$ and $\\cos\\theta = -\\frac{4}{5}$. What is $\\tan\\theta$?',
    options: ['$-\\frac{4}{3}$', '$-\\frac{3}{4}$', '$\\frac{3}{4}$', '$-\\frac{12}{25}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$:\n\n' +
        '$$\\tan\\theta = \\frac{\\frac{3}{5}}{-\\frac{4}{5}} = \\frac{3}{5} \\times \\left(-\\frac{5}{4}\\right) = -\\frac{3}{4}$$\n\n' +
        'The sign makes sense: sine positive and cosine negative means $\\theta$ is in the second quadrant, where tangent is negative.',
      whyWrong: [
        'This is $\\frac{\\cos\\theta}{\\sin\\theta}$, the fraction upside down. Tangent is **sine over cosine**.',
        null,
        'The size is right but the sign is lost: a positive divided by a negative is negative.',
        'This is $\\sin\\theta \\times \\cos\\theta$. Tangent is a division, not a multiplication.',
      ],
      keyIdea: '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$, and the signs follow the usual rules for division.',
    },
    check: {
      optionValues: [-4 / 3, -3 / 4, 3 / 4, -12 / 25],
      compute: () => {
        const theta = Math.PI - Math.asin(3 / 5); // the angle with sin = 3/5 and cos = -4/5
        return Math.tan(theta);
      },
    },
  },
  {
    id: 'trig-equations-004',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'Solve $\\sin x = \\frac{1}{2}$ for $0^\\circ \\le x \\le 360^\\circ$.',
    options: ['$x = 30^\\circ$ or $x = 150^\\circ$', '$x = 30^\\circ$ only', '$x = 30^\\circ$ or $x = 330^\\circ$', '$x = 30^\\circ$ or $x = 210^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Find the reference angle first, then ask in which quadrants sine is positive: there is usually more than one solution per turn.\n\n' +
        '1. Calculator (or exact values): $\\sin^{-1}\\left(\\frac{1}{2}\\right) = 30^\\circ$. This is the reference angle.\n' +
        '2. Sine is **positive** in the first and second quadrants (think of the sine graph: it is above the axis from $0^\\circ$ to $180^\\circ$).\n' +
        '3. First quadrant: $x = 30^\\circ$.\n' +
        '4. Second quadrant: $x = 180^\\circ - 30^\\circ = 150^\\circ$.\n' +
        '5. The next ones, $390^\\circ$ and $510^\\circ$, are outside the interval.\n\n' +
        'So $x = 30^\\circ$ or $x = 150^\\circ$. Check: $\\sin 150^\\circ = \\sin 30^\\circ = \\frac{1}{2}$.',
      whyWrong: [
        null,
        'This is only the calculator value. Sine is positive in **two** quadrants, so $180^\\circ - 30^\\circ = 150^\\circ$ is a second solution.',
        'This uses the cosine pattern $360^\\circ - x$. But $\\sin 330^\\circ = -\\frac{1}{2}$, not $\\frac{1}{2}$.',
        'This uses the tangent pattern $x + 180^\\circ$. But $\\sin 210^\\circ = -\\frac{1}{2}$, not $\\frac{1}{2}$.',
      ],
      keyIdea: 'For $\\sin x = k$ the two solutions in one turn are $x$ and $180^\\circ - x$.',
    },
    check: {
      optionValues: ['30,150', '30', '30,330', '30,210'],
      compute: () => solveDeg((x) => Math.sin(x) - 0.5, 0, 360),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'trig-equations-006',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $2\\cos x + 1 = 0$ for $0 \\le x \\le 2\\pi$.',
    options: [
      '$x = \\frac{\\pi}{3}$ or $x = \\frac{5\\pi}{3}$',
      '$x = \\frac{2\\pi}{3}$ or $x = \\frac{4\\pi}{3}$',
      '$x = \\frac{\\pi}{3}$ or $x = \\frac{2\\pi}{3}$',
      '$x = \\frac{2\\pi}{3}$ only',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Make $\\cos x$ the subject first, then use the reference angle and the quadrants where cosine has that sign.\n\n' +
        '1. Rearrange: $2\\cos x = -1$, so $\\cos x = -\\frac{1}{2}$.\n' +
        '2. Reference angle: $\\cos\\frac{\\pi}{3} = \\frac{1}{2}$, so the reference angle is $\\frac{\\pi}{3}$.\n' +
        '3. Cosine is **negative** in the second and third quadrants.\n' +
        '4. Second quadrant: $x = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$.\n' +
        '5. Third quadrant: $x = \\pi + \\frac{\\pi}{3} = \\frac{4\\pi}{3}$.\n\n' +
        'Both are in $[0, 2\\pi]$, so $x = \\frac{2\\pi}{3}$ or $x = \\frac{4\\pi}{3}$.',
      whyWrong: [
        'Sign slip: these solve $\\cos x = +\\frac{1}{2}$. Moving the $+1$ across the equals sign makes it $-1$.',
        null,
        'This keeps $\\frac{2\\pi}{3}$ and then uses the sine rule $\\pi - x$ to get $\\frac{\\pi}{3}$. But $\\cos\\frac{\\pi}{3} = +\\frac{1}{2}$, so it does not satisfy the equation; for cosine the partner is $2\\pi - x$.',
        'This is only the calculator value. Cosine is negative in two quadrants, so $2\\pi - \\frac{2\\pi}{3} = \\frac{4\\pi}{3}$ also works.',
      ],
      keyIdea: 'For $\\cos x = k$ the two solutions in one turn are $x$ and $2\\pi - x$; rearrange carefully so the sign of $k$ is right.',
    },
    check: {
      // answers written as multiples of pi/12: 2pi/3 = 8, 4pi/3 = 16, pi/3 = 4, 5pi/3 = 20
      optionValues: ['4,20', '8,16', '4,8', '8'],
      compute: () => solvePi12((x) => 2 * Math.cos(x) + 1, 24).join(','),
    },
  },
  {
    id: 'trig-equations-007',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\sin 2x = \\frac{1}{2}$ for $0^\\circ \\le x \\le 180^\\circ$.',
    options: ['$x = 30^\\circ$ or $x = 150^\\circ$', '$x = 15^\\circ$ only', '$x = 15^\\circ$ or $x = 165^\\circ$', '$x = 15^\\circ$ or $x = 75^\\circ$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Let $u = 2x$. Since $0^\\circ \\le x \\le 180^\\circ$, the new interval is $0^\\circ \\le u \\le 360^\\circ$.\n\n' +
        '1. Solve $\\sin u = \\frac{1}{2}$ in $[0^\\circ, 360^\\circ]$: $u = 30^\\circ$ or $u = 180^\\circ - 30^\\circ = 150^\\circ$.\n' +
        '2. The next solutions, $390^\\circ$ and $510^\\circ$, are outside the $u$-interval.\n' +
        '3. Halve to get back to $x$: $x = 15^\\circ$ or $x = 75^\\circ$.\n\n' +
        'Check: $\\sin 30^\\circ = \\frac{1}{2}$ and $\\sin 150^\\circ = \\frac{1}{2}$.',
      whyWrong: [
        'These are the values of $2x$, not $x$: the last step (halving) was forgotten.',
        'This is only the calculator value. $2x = 150^\\circ$ also has sine $\\frac{1}{2}$, giving $x = 75^\\circ$.',
        'This halves first and then applies $180^\\circ - x$ to $x$ instead of to $2x$. Check: $\\sin(2 \\times 165^\\circ) = \\sin 330^\\circ = -\\frac{1}{2}$.',
        null,
      ],
      keyIdea: 'For $\\sin 2x = k$, solve for $2x$ over the doubled interval first, then divide every solution by 2.',
    },
    check: {
      optionValues: ['30,150', '15', '15,165', '15,75'],
      compute: () => solveDeg((x) => Math.sin(2 * x) - 0.5, 0, 180),
    },
  },
  {
    id: 'trig-equations-010',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\sin x = \\sqrt{3}\\cos x$ for $0 \\le x < 2\\pi$.',
    options: [
      '$x = \\frac{\\pi}{3}$ or $x = \\frac{2\\pi}{3}$',
      '$x = \\frac{\\pi}{3}$ or $x = \\frac{4\\pi}{3}$',
      '$x = \\frac{\\pi}{6}$ or $x = \\frac{7\\pi}{6}$',
      '$x = \\frac{\\pi}{3}$ only',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. $\\cos x$ cannot be 0 here (if $\\cos x = 0$ the equation forces $\\sin x = 0$ too, which is impossible since $\\sin^2 x + \\cos^2 x = 1$). So divide both sides by $\\cos x$:\n\n$$\\frac{\\sin x}{\\cos x} = \\sqrt{3} \\quad\\Rightarrow\\quad \\tan x = \\sqrt{3}$$\n\n' +
        '2. Reference angle: $\\tan\\frac{\\pi}{3} = \\sqrt{3}$, so $x = \\frac{\\pi}{3}$.\n' +
        '3. Tangent repeats every $\\pi$: the other solution is $\\frac{\\pi}{3} + \\pi = \\frac{4\\pi}{3}$.\n' +
        '4. $\\frac{4\\pi}{3} + \\pi = \\frac{7\\pi}{3}$ is past $2\\pi$, so stop.\n\n' +
        'Answer: $x = \\frac{\\pi}{3}$ or $x = \\frac{4\\pi}{3}$.',
      whyWrong: [
        'This uses the sine pattern $\\pi - x$. But $\\tan\\frac{2\\pi}{3} = -\\sqrt{3}$; tangent solutions are $\\pi$ apart.',
        null,
        'This rearranges to $\\tan x = \\frac{1}{\\sqrt{3}}$ instead of $\\tan x = \\sqrt{3}$: the $\\sqrt{3}$ was moved to the denominator, as if $\\frac{\\cos x}{\\sin x} = \\sqrt{3}$. Check: $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$ but $\\sqrt{3}\\cos\\frac{\\pi}{6} = \\frac{3}{2}$.',
        'This is only the calculator value. Tangent has period $\\pi$, so $\\frac{\\pi}{3} + \\pi = \\frac{4\\pi}{3}$ is also a solution.',
      ],
      keyIdea: 'An equation of the form $\\sin x = k\\cos x$ becomes $\\tan x = k$ after dividing by $\\cos x$; tangent solutions repeat every $\\pi$.',
    },
    check: {
      // multiples of pi/12: pi/3 = 4, 2pi/3 = 8, 4pi/3 = 16, pi/6 = 2, 7pi/6 = 14
      optionValues: ['4,8', '4,16', '2,14', '4'],
      compute: () => solvePi12((x) => Math.sin(x) - Math.sqrt(3) * Math.cos(x), 23).join(','),
    },
  },
  {
    id: 'trig-equations-012',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Given that $\\cos\\theta = -\\frac{5}{13}$ and $90^\\circ < \\theta < 180^\\circ$, find $\\tan\\theta$.',
    options: ['$-\\frac{12}{5}$', '$\\frac{12}{5}$', '$-\\frac{5}{12}$', '$\\frac{12}{13}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'You need $\\sin\\theta$ before you can find $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$: get it from $\\sin^2\\theta + \\cos^2\\theta = 1$ and choose its sign from the quadrant.\n\n' +
        '1. Find $\\sin\\theta$: $\\sin^2\\theta = 1 - \\left(-\\frac{5}{13}\\right)^2 = 1 - \\frac{25}{169} = \\frac{144}{169}$, so $\\sin\\theta = \\pm\\frac{12}{13}$.\n' +
        '2. In the second quadrant sine is positive: $\\sin\\theta = \\frac{12}{13}$.\n' +
        '3. $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{12}{13} \\div \\left(-\\frac{5}{13}\\right) = -\\frac{12}{5}$.\n\n' +
        'Sign check: tangent is negative in the second quadrant, as expected.',
      whyWrong: [
        null,
        'The sign is lost. In the second quadrant cosine is negative and sine positive, so tangent is negative.',
        'This is $\\frac{\\cos\\theta}{\\sin\\theta}$, the fraction upside down. Tangent is sine divided by cosine.',
        'This stops at $\\sin\\theta = \\frac{12}{13}$ and never divides by $\\cos\\theta$.',
      ],
      keyIdea: 'Find the missing ratio with $\\sin^2\\theta + \\cos^2\\theta = 1$, fix its sign from the quadrant, then use $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$.',
    },
    check: {
      optionValues: [-12 / 5, 12 / 5, -5 / 12, 12 / 13],
      compute: () => Math.tan(Math.acos(-5 / 13)), // acos gives the angle in (90°, 180°)
    },
  },
  {
    id: 'trig-equations-019',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'Which identity is true for every angle $\\theta$?',
    options: ['$\\sin^2\\theta + \\cos^2\\theta = 1$', '$\\sin\\theta + \\cos\\theta = 1$', '$\\sin^2\\theta - \\cos^2\\theta = 1$', '$\\sin\\theta\\cos\\theta = 1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A point on the circle of radius $1$ has coordinates $(\\cos\\theta, \\sin\\theta)$. Pythagoras then gives $\\cos^2\\theta + \\sin^2\\theta = 1$ for every angle.',
      whyWrong: [
        null,
        'This forgets the squares. At $\\theta = 45^\\circ$ the left side is about $1.41$.',
        'The two squares are added, not subtracted. At $\\theta = 0^\\circ$ this would say $0 - 1 = 1$.',
        'This multiplies instead of adding squares. At $\\theta = 0^\\circ$ the left side is $0$.',
      ],
      keyIdea: '$\\sin^2\\theta + \\cos^2\\theta = 1$ is Pythagoras on the unit circle.',
    },
    check: {
      optionValues: ['squares added', 'plain sum', 'squares subtracted', 'product'],
      compute: () => {
        const ids: [string, (t: number) => number][] = [
          ['squares added', (t) => Math.sin(t) ** 2 + Math.cos(t) ** 2],
          ['plain sum', (t) => Math.sin(t) + Math.cos(t)],
          ['squares subtracted', (t) => Math.sin(t) ** 2 - Math.cos(t) ** 2],
          ['product', (t) => Math.sin(t) * Math.cos(t)],
        ];
        return ids.filter(([, f]) => [10, 47, 123, 290].every((d) => Math.abs(f(rad(d)) - 1) < 1e-9))[0][0];
      },
    },
  },
  {
    id: 'trig-equations-020',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'Which expression equals $\\tan\\theta$ whenever $\\cos\\theta \\ne 0$?',
    options: ['$\\frac{\\sin\\theta}{\\cos\\theta}$', '$\\frac{\\cos\\theta}{\\sin\\theta}$', '$\\sin\\theta\\cos\\theta$', '$\\frac{1}{\\sin\\theta}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'In a right-angled triangle, $\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$. Dividing the top and bottom by the hypotenuse gives $\\frac{\\sin\\theta}{\\cos\\theta}$.',
      whyWrong: [
        null,
        'This is the fraction upside down. Tangent is sine over cosine.',
        'This multiplies the two ratios instead of dividing them.',
        'This uses only the sine. It is the reciprocal of $\\sin\\theta$, and it does not involve the adjacent side at all.',
      ],
      keyIdea: '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$.',
    },
    check: {
      optionValues: [
        Math.sin(rad(50)) / Math.cos(rad(50)),
        Math.cos(rad(50)) / Math.sin(rad(50)),
        Math.sin(rad(50)) * Math.cos(rad(50)),
        1 / Math.sin(rad(50)),
      ],
      compute: () => Math.tan(rad(50)),
    },
  },
  {
    id: 'trig-equations-021',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'How many solutions does $\\sin x = 2$ have for $0^\\circ \\le x < 360^\\circ$?',
    options: ['$0$', '$1$', '$2$', '$4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The sine of an angle always lies between $-1$ and $1$.\n\n' +
        'Since $2 > 1$, no angle has a sine of $2$, so there are no solutions.',
      whyWrong: [
        null,
        'A calculator gives an error for $\\sin^{-1} 2$, not one answer: no angle has this sine.',
        'Two is the usual count for one full turn, but only when the value lies between $-1$ and $1$.',
        'Four solutions in one turn would need something like $\\sin 2x = k$. Here the value $2$ is out of reach for any angle.',
      ],
      keyIdea: '$\\sin x = k$ and $\\cos x = k$ have no solutions when $k$ is outside $[-1, 1]$.',
    },
    check: {
      optionValues: [0, 1, 2, 4],
      compute: () => {
        const s = solveDeg((x) => Math.sin(x) - 2, 0, 359);
        return s === '' ? 0 : s.split(',').length;
      },
    },
  },
  {
    id: 'trig-equations-022',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'Solve $\\tan x = 1$ for $0^\\circ \\le x < 360^\\circ$.',
    options: ['$x = 45^\\circ$ or $x = 225^\\circ$', '$x = 45^\\circ$ only', '$x = 45^\\circ$ or $x = 135^\\circ$', '$x = 45^\\circ$ or $x = 315^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Tangent repeats every $180^\\circ$.\n\n' +
        '1. $\\tan 45^\\circ = 1$, so $x = 45^\\circ$ is one solution.\n' +
        '2. Add $180^\\circ$: $x = 225^\\circ$.\n' +
        '3. Adding another $180^\\circ$ gives $405^\\circ$, which is outside the interval.',
      whyWrong: [
        null,
        'This is only the calculator value. Tangent is positive in two quadrants, the first and third.',
        'This uses the sine pattern $180^\\circ - x$. But $\\tan 135^\\circ = -1$.',
        'This uses the cosine pattern $360^\\circ - x$. But $\\tan 315^\\circ = -1$.',
      ],
      keyIdea: 'For $\\tan x = k$, the two solutions in one turn are $180^\\circ$ apart.',
    },
    check: {
      optionValues: ['45,225', '45', '45,135', '45,315'],
      compute: () => solveDeg((x) => Math.tan(x) - 1, 0, 359),
    },
  },
  {
    id: 'trig-equations-023',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'How many solutions does $\\cos x = 0.3$ have for $0^\\circ \\le x < 360^\\circ$?',
    options: ['$2$', '$1$', '$0$', '$4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The value $0.3$ lies between $-1$ and $1$, and it is not $\\pm 1$.\n\n' +
        'The cosine graph crosses a horizontal line at this height twice in one full turn: once in the first quadrant and once in the fourth, where cosine is positive. So there are $2$ solutions.',
      whyWrong: [
        null,
        'This counts only the calculator value. Cosine is positive in **two** quadrants, so there is a second solution.',
        '$0.3$ is inside the range of cosine, so solutions do exist, even though the angle is not a standard one.',
        'Four solutions in one turn would need something like $\\cos 2x = k$, not $\\cos x = k$.',
      ],
      keyIdea: 'For $-1 < k < 1$, $\\cos x = k$ has exactly two solutions in one full turn.',
    },
    check: {
      optionValues: [2, 1, 0, 4],
      compute: () => {
        let crossings = 0;
        for (let d = 0; d < 360; d++) if ((Math.cos(rad(d)) - 0.3) * (Math.cos(rad(d + 1)) - 0.3) < 0) crossings++;
        return crossings;
      },
    },
  },
  {
    id: 'trig-equations-024',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\cos x = -\\frac{\\sqrt{3}}{2}$ for $0^\\circ \\le x \\le 360^\\circ$.',
    options: ['$x = 150^\\circ$ or $x = 210^\\circ$', '$x = 30^\\circ$ or $x = 330^\\circ$', '$x = 150^\\circ$ or $x = 330^\\circ$', '$x = 120^\\circ$ or $x = 240^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Reference angle: $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$, so it is $30^\\circ$.\n' +
        '2. Cosine is negative in the second and third quadrants.\n' +
        '3. Second quadrant: $x = 180^\\circ - 30^\\circ = 150^\\circ$.\n' +
        '4. Third quadrant: $x = 180^\\circ + 30^\\circ = 210^\\circ$.',
      whyWrong: [
        null,
        'This ignores the minus sign. These angles solve $\\cos x = \\frac{\\sqrt{3}}{2}$.',
        '$330^\\circ$ is in the fourth quadrant, where cosine is positive. These two quadrants are where **tangent** is negative.',
        'This uses the reference angle $60^\\circ$, which belongs to $\\cos x = -\\frac{1}{2}$.',
      ],
      keyIdea: 'Find the reference angle from the positive value, then use the sign to choose the two quadrants.',
    },
    check: {
      optionValues: ['150,210', '30,330', '150,330', '120,240'],
      compute: () => solveDeg((x) => Math.cos(x) + Math.sqrt(3) / 2, 0, 360),
    },
  },
  {
    id: 'trig-equations-025',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\sqrt{2}\\sin x + 1 = 0$ for $0 \\le x < 2\\pi$.',
    options: ['$x = \\frac{5\\pi}{4}$ or $x = \\frac{7\\pi}{4}$', '$x = \\frac{\\pi}{4}$ or $x = \\frac{3\\pi}{4}$', '$x = \\frac{3\\pi}{4}$ or $x = \\frac{5\\pi}{4}$', '$x = \\frac{7\\pi}{6}$ or $x = \\frac{11\\pi}{6}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Rearrange: $\\sin x = -\\frac{1}{\\sqrt{2}}$.\n' +
        '2. Reference angle: $\\sin\\frac{\\pi}{4} = \\frac{1}{\\sqrt{2}}$, so it is $\\frac{\\pi}{4}$.\n' +
        '3. Sine is negative in the third and fourth quadrants.\n' +
        '4. Third quadrant: $x = \\pi + \\frac{\\pi}{4} = \\frac{5\\pi}{4}$.\n' +
        '5. Fourth quadrant: $x = 2\\pi - \\frac{\\pi}{4} = \\frac{7\\pi}{4}$.',
      whyWrong: [
        null,
        'A sign slip when rearranging: these angles solve $\\sin x = +\\frac{1}{\\sqrt{2}}$.',
        'These are the quadrants where **cosine** is negative. Sine is negative in the third and fourth quadrants.',
        'This uses the reference angle $\\frac{\\pi}{6}$, which belongs to $\\sin x = -\\frac{1}{2}$. The $\\sqrt{2}$ was not divided correctly.',
      ],
      keyIdea: 'Get $\\sin x$ on its own, then the reference angle and the sign give the two solutions.',
    },
    check: {
      // answers written as multiples of pi/12
      optionValues: ['15,21', '3,9', '9,15', '14,22'],
      compute: () => solvePi12((x) => Math.sqrt(2) * Math.sin(x) + 1, 23).join(','),
    },
  },
  {
    id: 'trig-equations-026',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\cos 2x = \\frac{1}{2}$ for $0^\\circ \\le x \\le 180^\\circ$.',
    options: ['$x = 30^\\circ$ or $x = 150^\\circ$', '$x = 60^\\circ$ or $x = 300^\\circ$', '$x = 30^\\circ$ only', '$x = 30^\\circ$ or $x = 330^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Let $u = 2x$. Since $0^\\circ \\le x \\le 180^\\circ$, we have $0^\\circ \\le u \\le 360^\\circ$.\n' +
        '2. Solve $\\cos u = \\frac{1}{2}$: $u = 60^\\circ$ or $u = 360^\\circ - 60^\\circ = 300^\\circ$.\n' +
        '3. Halve: $x = 30^\\circ$ or $x = 150^\\circ$.',
      whyWrong: [
        null,
        'These are the values of $2x$. You still have to halve them to get $x$.',
        'This is only the first solution. Solving for $u$ over $0^\\circ$ to $360^\\circ$ gives a second one.',
        'This applies the partner rule $360^\\circ - x$ to $x$ instead of to $2x$. And $330^\\circ$ is outside the interval.',
      ],
      keyIdea: 'For a multiple angle, solve for $u = 2x$ over the doubled interval, then halve.',
    },
    check: {
      optionValues: ['30,150', '60,300', '30', '30,330'],
      compute: () => solveDeg((x) => Math.cos(2 * x) - 0.5, 0, 180),
    },
  },
  {
    id: 'trig-equations-027',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\sin(x - 30^\\circ) = \\frac{\\sqrt{3}}{2}$ for $0^\\circ \\le x \\le 360^\\circ$.',
    options: ['$x = 90^\\circ$ or $x = 150^\\circ$', '$x = 60^\\circ$ or $x = 120^\\circ$', '$x = 30^\\circ$ or $x = 90^\\circ$', '$x = 90^\\circ$ only'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Let $u = x - 30^\\circ$, so $-30^\\circ \\le u \\le 330^\\circ$.\n' +
        '2. Solve $\\sin u = \\frac{\\sqrt{3}}{2}$: $u = 60^\\circ$ or $u = 180^\\circ - 60^\\circ = 120^\\circ$.\n' +
        '3. Add $30^\\circ$: $x = 90^\\circ$ or $x = 150^\\circ$.',
      whyWrong: [
        null,
        'These are the values of $x - 30^\\circ$. You still have to add $30^\\circ$ to get $x$.',
        'This subtracts $30^\\circ$ from $u$. Since $u = x - 30^\\circ$, undoing it means adding $30^\\circ$.',
        'This keeps only one value of $u$. Sine is positive in two quadrants, so $u = 120^\\circ$ gives a second solution.',
      ],
      keyIdea: 'Replace the bracket by $u$, solve for $u$, then undo the shift.',
    },
    check: {
      optionValues: ['90,150', '60,120', '30,90', '90'],
      compute: () => solveDeg((x) => Math.sin(x - rad(30)) - Math.sqrt(3) / 2, 0, 360),
    },
  },
  {
    id: 'trig-equations-028',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\cos^2 x = \\frac{1}{4}$ for $0^\\circ \\le x < 360^\\circ$.',
    options: ['$60^\\circ$, $120^\\circ$, $240^\\circ$, $300^\\circ$', '$60^\\circ$, $300^\\circ$', '$120^\\circ$, $240^\\circ$', '$30^\\circ$, $150^\\circ$, $210^\\circ$, $330^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Take the square root, with both signs: $\\cos x = \\frac{1}{2}$ or $\\cos x = -\\frac{1}{2}$.\n' +
        '2. $\\cos x = \\frac{1}{2}$: $x = 60^\\circ$ or $x = 300^\\circ$.\n' +
        '3. $\\cos x = -\\frac{1}{2}$: $x = 120^\\circ$ or $x = 240^\\circ$.',
      whyWrong: [
        null,
        'This takes only the positive square root. $\\cos x = -\\frac{1}{2}$ also squares to $\\frac{1}{4}$.',
        'This takes only the negative square root. $\\cos x = \\frac{1}{2}$ also squares to $\\frac{1}{4}$.',
        'These angles solve $\\sin^2 x = \\frac{1}{4}$. The reference angle for $\\cos x = \\frac{1}{2}$ is $60^\\circ$, not $30^\\circ$.',
      ],
      keyIdea: 'A square root has two signs, so solve both $\\cos x = k$ and $\\cos x = -k$.',
    },
    check: {
      optionValues: ['60,120,240,300', '60,300', '120,240', '30,150,210,330'],
      compute: () => solveDeg((x) => Math.cos(x) ** 2 - 0.25, 0, 359),
    },
  },
  {
    id: 'trig-equations-029',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $\\sin x \\cos x = 0$ for $0^\\circ \\le x < 360^\\circ$.',
    options: ['$0^\\circ$, $90^\\circ$, $180^\\circ$, $270^\\circ$', '$0^\\circ$, $180^\\circ$', '$90^\\circ$, $270^\\circ$', '$45^\\circ$, $225^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A product is zero when either factor is zero.\n\n' +
        '1. $\\sin x = 0$: $x = 0^\\circ$ or $x = 180^\\circ$.\n' +
        '2. $\\cos x = 0$: $x = 90^\\circ$ or $x = 270^\\circ$.\n\n' +
        'Together these give four solutions.',
      whyWrong: [
        null,
        'This solves only $\\sin x = 0$, as if $\\cos x$ had been divided away. Dividing by $\\cos x$ loses the solutions where it is zero.',
        'This solves only $\\cos x = 0$, as if $\\sin x$ had been divided away. Dividing by $\\sin x$ loses the solutions where it is zero.',
        'These angles solve $\\sin x = \\cos x$. The product is zero when one factor is zero, not when the two are equal.',
      ],
      keyIdea: 'If a product equals zero, set each factor to zero; never divide by a trig function that can be zero.',
    },
    check: {
      optionValues: ['0,90,180,270', '0,180', '90,270', '45,225'],
      compute: () => solveDeg((x) => Math.sin(x) * Math.cos(x), 0, 359),
    },
  },
  {
    id: 'trig-equations-030',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'What is the principal value of $\\sin^{-1}\\left(\\frac{1}{2}\\right)$?',
    options: ['$30^\\circ$', '$60^\\circ$', '$150^\\circ$', '$45^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **principal value** is the single angle that a calculator returns. For $\\sin^{-1}$, it lies between $-90^\\circ$ and $90^\\circ$.\n\n' +
        'Since $\\sin 30^\\circ = \\frac{1}{2}$ and $30^\\circ$ is in that interval, the principal value is $30^\\circ$.',
      whyWrong: [
        null,
        '$\\cos 60^\\circ = \\frac{1}{2}$, but $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$. This mixes up sine and cosine.',
        '$\\sin 150^\\circ = \\frac{1}{2}$ is true, but $150^\\circ$ is outside the interval for the principal value. It is the second solution of the equation.',
        '$\\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$, not $\\frac{1}{2}$.',
      ],
      keyIdea: 'The principal value of $\\sin^{-1} k$ is the one angle between $-90^\\circ$ and $90^\\circ$ whose sine is $k$.',
    },
    check: {
      optionValues: [30, 60, 150, 45],
      compute: () => (Math.asin(0.5) * 180) / Math.PI,
    },
  },];
