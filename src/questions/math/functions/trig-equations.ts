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
      asking: 'Given that $\\sin\\theta = \\frac{3}{5}$ for an angle under $90^\\circ$, what is $\\cos\\theta$?',
      solution:
        'In a right-angled triangle, $\\sin\\theta$ is the opposite side over the hypotenuse. So $\\sin\\theta = \\frac{3}{5}$ describes a triangle whose opposite side is 3 and whose hypotenuse is 5.\n\n' +
        'Find the third side, the adjacent one, with Pythagoras\' theorem: $\\text{adjacent}^2 = 5^2 - 3^2 = 25 - 9 = 16$. So the adjacent side is $\\sqrt{16} = 4$.\n\n' +
        '$\\cos\\theta$ is the adjacent side over the hypotenuse: $\\frac{4}{5}$. An acute angle (under $90^\\circ$) has a positive cosine, so no minus sign is needed.',
      conclusion: 'The identity $\\sin^2\\theta + \\cos^2\\theta = 1$, true for every angle, agrees: $\\cos^2\\theta = 1 - \\frac{9}{25} = \\frac{16}{25}$. So $\\cos\\theta$ is $\\frac{4}{5}$.',
      whyWrong: [
        'This is $1 - \\frac{3}{5}$: it assumes $\\sin\\theta + \\cos\\theta = 1$. The identity is about the **squares**: $\\sin^2\\theta + \\cos^2\\theta = 1$.',
        'This is $\\cos^2\\theta$, not $\\cos\\theta$: the square root was never taken at the end.',
        null,
        'This is $\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{3}{4}$, not $\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$.',
      ],
      keyIdea: 'Given one ratio, draw a right-angled triangle with those two sides and use Pythagoras for the third. Then read off the ratio you need. The sign depends on the quadrant (the quarter of the circle the angle ends in), and all the ratios of an acute angle are positive.',
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
      asking: 'Given the sine and cosine of an angle, what is its tangent?',
      solution:
        'For any angle, $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$. We know both values, so we only have to divide.\n\n' +
        'Substitute: $\\tan\\theta = \\frac{3}{5} \\div \\left(-\\frac{4}{5}\\right)$.\n\n' +
        'To divide by a fraction, flip it and multiply: $\\frac{3}{5} \\times \\left(-\\frac{5}{4}\\right)$. The 5s cancel, which leaves $-\\frac{3}{4}$.',
      conclusion: 'A positive divided by a negative is negative, so $\\tan\\theta$ is $-\\frac{3}{4}$.',
      whyWrong: [
        'This is $\\frac{\\cos\\theta}{\\sin\\theta}$, the fraction upside down. Tangent is **sine over cosine**.',
        null,
        'The size is right but the sign is lost: a positive divided by a negative is negative.',
        'This is $\\sin\\theta \\times \\cos\\theta$. Tangent is a division, not a multiplication.',
      ],
      keyIdea: 'If you know $\\sin\\theta$ and $\\cos\\theta$, use $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$. When both fractions have the same bottom, the bottoms cancel, so just divide the tops and keep the sign.',
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
      asking: 'Which angles in one full turn have a sine of $\\frac{1}{2}$?',
      solution:
        'Find the first angle from the exact values: $\\sin 30^\\circ = \\frac{1}{2}$. So $x = 30^\\circ$ is one solution, and $30^\\circ$ is the **reference angle** (the acute angle with the right size).\n\n' +
        'Sine is the height of a point on the unit circle (a circle of radius 1). A positive height happens twice in a full turn: once in the first quadrant (top right), and once in the second quadrant (top left).\n\n' +
        'The second solution is the mirror image of $30^\\circ$ across the vertical axis: $x = 180^\\circ - 30^\\circ = 150^\\circ$.',
      conclusion: 'Both angles have a height of $\\frac{1}{2}$ on the circle, so the answer is $x = 30^\\circ$ or $x = 150^\\circ$.',
      whyWrong: [
        null,
        'This is only the calculator value. Sine is positive in **two** quadrants, so $180^\\circ - 30^\\circ = 150^\\circ$ is a second solution.',
        'This uses the cosine pattern $360^\\circ - x$. But $\\sin 330^\\circ = -\\frac{1}{2}$, not $\\frac{1}{2}$.',
        'This uses the tangent pattern $x + 180^\\circ$. But $\\sin 210^\\circ = -\\frac{1}{2}$, not $\\frac{1}{2}$.',
      ],
      keyIdea: 'For $\\sin x = k$, find the first angle $\\alpha$, then the partner $180^\\circ - \\alpha$. For $\\cos x = k$, the partner is $360^\\circ - \\alpha$. For $\\tan x = k$, it is $180^\\circ + \\alpha$. Keep those inside the interval.',
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
      asking: 'Which angles between 0 and $2\\pi$ make this equation true?',
      solution:
        'First get $\\cos x$ alone. Subtract 1 from both sides: $2\\cos x = -1$. Divide by 2: $\\cos x = -\\frac{1}{2}$.\n\n' +
        'Ignore the minus for a moment and find the **reference angle**, the acute angle with the right size. $\\cos\\frac{\\pi}{3} = \\frac{1}{2}$ (that is $\\cos 60^\\circ$), so the reference angle is $\\frac{\\pi}{3}$.\n\n' +
        'Now the sign. Cosine is the $x$-coordinate on the unit circle (a circle of radius 1), so it is negative on the left side: the second and third quadrants.\n\n' +
        'Second quadrant: $\\frac{\\pi}{3}$ short of a half turn ($\\pi$), so $x = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$.\n\n' +
        'Third quadrant: $\\frac{\\pi}{3}$ past a half turn, so $x = \\pi + \\frac{\\pi}{3} = \\frac{4\\pi}{3}$.',
      conclusion: 'Both angles are in the interval and have a cosine of $-\\frac{1}{2}$, so the answer is $x = \\frac{2\\pi}{3}$ or $x = \\frac{4\\pi}{3}$.',
      whyWrong: [
        'Sign slip: these solve $\\cos x = +\\frac{1}{2}$. Moving the $+1$ across the equals sign makes it $-1$.',
        null,
        'This keeps $\\frac{2\\pi}{3}$ and then uses the sine rule $\\pi - x$ to get $\\frac{\\pi}{3}$. But $\\cos\\frac{\\pi}{3} = +\\frac{1}{2}$, so it does not satisfy the equation; for cosine the partner is $2\\pi - x$.',
        'This is only the calculator value. Cosine is negative in two quadrants, so $2\\pi - \\frac{2\\pi}{3} = \\frac{4\\pi}{3}$ also works.',
      ],
      keyIdea: 'To solve $a\\cos x + b = 0$, get the function alone, find the reference angle $\\alpha$ from the size, and use the sign to pick two quadrants. The angles are: first $\\alpha$, second $\\pi - \\alpha$, third $\\pi + \\alpha$, fourth $2\\pi - \\alpha$.',
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
      asking: 'Which values of $x$ from $0^\\circ$ to $180^\\circ$ make the sine of $2x$ equal $\\frac{1}{2}$?',
      solution:
        'The $2x$ inside makes this different from a basic equation. Let $u = 2x$, so we now solve $\\sin u = \\frac{1}{2}$.\n\n' +
        'Change the interval too. If $x$ goes from $0^\\circ$ to $180^\\circ$, then $u = 2x$ goes from $0^\\circ$ to $360^\\circ$.\n\n' +
        'Solve for $u$. We know $\\sin 30^\\circ = \\frac{1}{2}$, so $u = 30^\\circ$. Sine is also positive in the second quadrant ($90^\\circ$ to $180^\\circ$), where the partner angle is $30^\\circ$ short of a half turn: $u = 180^\\circ - 30^\\circ = 150^\\circ$.\n\n' +
        'Those are values of $u$, which is $2x$. Divide each by 2 to get $x$: $x = 15^\\circ$ or $x = 75^\\circ$.',
      conclusion: 'Testing: doubling gives $30^\\circ$ and $150^\\circ$, and both have a sine of $\\frac{1}{2}$. So the answer is $x = 15^\\circ$ or $x = 75^\\circ$.',
      whyWrong: [
        'These are the values of $2x$, not $x$: the last step (halving) was forgotten.',
        'This is only the calculator value. $2x = 150^\\circ$ also has sine $\\frac{1}{2}$, giving $x = 75^\\circ$.',
        'This halves first and then applies $180^\\circ - x$ to $x$ instead of to $2x$. Check: $\\sin(2 \\times 165^\\circ) = \\sin 330^\\circ = -\\frac{1}{2}$.',
        null,
      ],
      keyIdea: 'For $\\sin(bx) = k$, let $u = bx$, multiply the ends of the interval by $b$, solve for $u$ over that wider interval, then divide every solution by $b$.',
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
      asking: 'Which angles from 0 up to $2\\pi$ make sine equal $\\sqrt{3}$ times cosine?',
      solution:
        'This has both sine and cosine. We can combine them, because $\\tan x = \\frac{\\sin x}{\\cos x}$. So divide both sides by $\\cos x$.\n\n' +
        'Is dividing safe? Only if $\\cos x \\ne 0$. If $\\cos x = 0$, the equation would need $\\sin x = 0$ too, but sine and cosine are never both 0. So no solution is lost.\n\n' +
        'After dividing: $\\frac{\\sin x}{\\cos x} = \\sqrt{3}$, so $\\tan x = \\sqrt{3}$.\n\n' +
        '$\\tan\\frac{\\pi}{3} = \\sqrt{3}$ (that is $\\tan 60^\\circ$), so one solution is $x = \\frac{\\pi}{3}$.\n\n' +
        'Tangent repeats every $\\pi$ radians (half a turn), so add $\\pi$ for the other: $x = \\frac{\\pi}{3} + \\frac{3\\pi}{3} = \\frac{4\\pi}{3}$. Adding $\\pi$ again would pass $2\\pi$, so stop there.',
      conclusion: 'The solutions are half a turn apart, and both are in the interval, so the answer is $x = \\frac{\\pi}{3}$ or $x = \\frac{4\\pi}{3}$.',
      whyWrong: [
        'This uses the sine pattern $\\pi - x$. But $\\tan\\frac{2\\pi}{3} = -\\sqrt{3}$; tangent solutions are $\\pi$ apart.',
        null,
        'This rearranges to $\\tan x = \\frac{1}{\\sqrt{3}}$ instead of $\\tan x = \\sqrt{3}$: the $\\sqrt{3}$ was moved to the denominator, as if $\\frac{\\cos x}{\\sin x} = \\sqrt{3}$. Check: $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$ but $\\sqrt{3}\\cos\\frac{\\pi}{6} = \\frac{3}{2}$.',
        'This is only the calculator value. Tangent has period $\\pi$, so $\\frac{\\pi}{3} + \\pi = \\frac{4\\pi}{3}$ is also a solution.',
      ],
      keyIdea: 'When $\\sin x$ and $\\cos x$ appear once each, divide by $\\cos x$ to get $\\tan x = k$, after confirming that $\\cos x = 0$ isn\'t a solution. Then list the solutions by adding $\\pi$ ($180^\\circ$) until you leave the interval.',
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
      asking: 'Given $\\cos\\theta$ and which quadrant the angle is in, what is $\\tan\\theta$?',
      solution:
        '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$, so we need $\\sin\\theta$. Use the identity $\\sin^2\\theta + \\cos^2\\theta = 1$, where $\\sin^2\\theta$ means $\\sin\\theta$ multiplied by itself.\n\n' +
        'Substitute: $\\sin^2\\theta + \\left(-\\frac{5}{13}\\right)^2 = 1$, so $\\sin^2\\theta + \\frac{25}{169} = 1$.\n\n' +
        'Subtract $\\frac{25}{169}$ from both sides: $\\sin^2\\theta = \\frac{169}{169} - \\frac{25}{169} = \\frac{144}{169}$. Take the square root: $\\sin\\theta = \\pm\\frac{12}{13}$.\n\n' +
        '$\\theta$ is between $90^\\circ$ and $180^\\circ$, the second quadrant. Sine is the height on the unit circle (a circle of radius 1), and the height is positive there. So $\\sin\\theta = \\frac{12}{13}$.\n\n' +
        'Divide: $\\tan\\theta = \\frac{12}{13} \\div \\left(-\\frac{5}{13}\\right) = \\frac{12}{13} \\times \\left(-\\frac{13}{5}\\right)$. The 13s cancel, which leaves $-\\frac{12}{5}$.',
      conclusion: 'In the second quadrant, sine is positive and cosine is negative, so $\\tan\\theta$ is $-\\frac{12}{5}$.',
      whyWrong: [
        null,
        'The sign is lost. In the second quadrant cosine is negative and sine positive, so tangent is negative.',
        'This is $\\frac{\\cos\\theta}{\\sin\\theta}$, the fraction upside down. Tangent is sine divided by cosine.',
        'This stops at $\\sin\\theta = \\frac{12}{13}$ and never divides by $\\cos\\theta$.',
      ],
      keyIdea: 'Given one ratio and the quadrant, find the missing ratio from $\\sin^2\\theta + \\cos^2\\theta = 1$, choose its sign from the quadrant, then divide sine by cosine.',
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
      asking: 'Which of these equations holds for all angles?',
      solution:
        'On the unit circle (radius 1, centred at the origin), the point at angle $\\theta$ has coordinates $(\\cos\\theta, \\sin\\theta)$.\n\n' +
        'Draw a right-angled triangle from that point to the $x$-axis. Its two shorter sides are $\\cos\\theta$ and $\\sin\\theta$, and its hypotenuse is the radius, 1. Pythagoras\' theorem then gives $\\sin^2\\theta + \\cos^2\\theta = 1$.',
      conclusion: 'This comes from Pythagoras\' theorem on the unit circle, so the true identity is $\\sin^2\\theta + \\cos^2\\theta = 1$.',
      whyWrong: [
        null,
        'This forgets the squares. At $\\theta = 45^\\circ$ the left side is about $1.41$.',
        'The two squares are added, not subtracted. At $\\theta = 0^\\circ$ this would say $0 - 1 = 1$.',
        'This multiplies instead of adding squares. At $\\theta = 0^\\circ$ the left side is $0$.',
      ],
      keyIdea: 'Test each proposed identity at $\\theta = 45^\\circ$, where $\\sin\\theta$ and $\\cos\\theta$ are both about 0.71, and then at a second angle. One angle isn\'t always enough: $\\sin\\theta + \\cos\\theta = 1$ works at $0^\\circ$, where $\\sin\\theta = 0$ and $\\cos\\theta = 1$, but fails at $45^\\circ$.',
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
      asking: 'How can $\\tan\\theta$ be written using sine and cosine?',
      solution:
        'In a right-angled triangle, $\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}$ and $\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$.\n\n' +
        'Divide the first by the second, and the hypotenuses cancel: $\\frac{\\sin\\theta}{\\cos\\theta} = \\frac{\\text{opposite}}{\\text{adjacent}}$. That is exactly what $\\tan\\theta$ is.',
      conclusion: 'Opposite over adjacent is $\\tan\\theta$, so the expression is $\\frac{\\sin\\theta}{\\cos\\theta}$.',
      whyWrong: [
        null,
        'This is the fraction upside down. Tangent is sine over cosine.',
        'This multiplies the two ratios instead of dividing them.',
        'This uses only the sine. It is the reciprocal of $\\sin\\theta$, and it does not involve the adjacent side at all.',
      ],
      keyIdea: 'Use $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$ whenever an equation mixes $\\sin$ and $\\cos$. It also explains why $\\tan\\theta$ has no value wherever $\\cos\\theta = 0$, as at $90^\\circ$.',
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
      asking: 'How many angles in one full turn have a sine of 2?',
      solution:
        '$\\sin x$ is the height of a point on the unit circle, a circle of radius 1. So its value is always between $-1$ and 1.\n\n' +
        'The equation asks for a height of 2, which is above the top of the circle. No angle can do that, so there are no solutions.',
      conclusion: '2 is outside what sine can produce, so the number of solutions is $0$.',
      whyWrong: [
        null,
        'A calculator gives an error for $\\sin^{-1} 2$, not one answer: no angle has this sine.',
        'Two is the usual count for one full turn, but only when the value lies between $-1$ and $1$.',
        'Four solutions in one turn would need something like $\\sin 2x = k$. Here the value $2$ is out of reach for any angle.',
      ],
      keyIdea: 'Before solving $\\sin x = k$ or $\\cos x = k$, test the size of $k$. If $k$ is above 1 or below $-1$, there are no solutions. For $\\tan x = k$, any $k$ is possible.',
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
      asking: 'Which angles in one full turn have a tangent of 1?',
      solution:
        'Find the first solution from the exact value. $\\tan 45^\\circ = 1$, because a $45^\\circ$ right-angled triangle has equal opposite and adjacent sides. So $x = 45^\\circ$ is one solution.\n\n' +
        'Tangent is sine divided by cosine. It is positive in the first quadrant (top right of the circle), and also in the third (bottom left), where both are negative and a negative divided by a negative is positive.\n\n' +
        'The third-quadrant solution is half a turn further on, because tangent repeats every $180^\\circ$: $x = 45^\\circ + 180^\\circ = 225^\\circ$.',
      conclusion: 'Adding another $180^\\circ$ gives $405^\\circ$, past the interval, so the answer is $x = 45^\\circ$ or $x = 225^\\circ$.',
      whyWrong: [
        null,
        'This is only the calculator value. Tangent is positive in two quadrants, the first and third.',
        'This uses the sine pattern $180^\\circ - x$. But $\\tan 135^\\circ = -1$.',
        'This uses the cosine pattern $360^\\circ - x$. But $\\tan 315^\\circ = -1$.',
      ],
      keyIdea: 'For $\\tan x = k$, find the first angle, then keep adding $180^\\circ$ until you leave the interval. Tangent\'s partner is always half a turn away, unlike those of sine and cosine.',
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
      asking: 'How many angles in one full turn have a cosine of 0.3?',
      solution:
        'We don\'t need the actual angles, only how many there are. First, does a solution exist? Cosine takes values from $-1$ to 1, and 0.3 is inside that, so yes.\n\n' +
        'Cosine is the $x$-coordinate of a point on the unit circle (a circle of radius 1). Draw a vertical line at $x = 0.3$. That line is inside the circle, so it crosses the circle at two points: one above the axis and one below.\n\n' +
        'Each crossing is one angle in the full turn, so there is one in the first quadrant (top right) and one in the fourth (bottom right). That makes 2 angles.',
      conclusion: 'A vertical line at 0.3 crosses the circle twice, so the number of solutions is $2$.',
      whyWrong: [
        null,
        'This counts only the calculator value. Cosine is positive in **two** quadrants, so there is a second solution.',
        '$0.3$ is inside the range of cosine, so solutions do exist, even though the angle is not a standard one.',
        'Four solutions in one turn would need something like $\\cos 2x = k$, not $\\cos x = k$.',
      ],
      keyIdea: 'To count solutions in one turn for sine or cosine: if $k$ is beyond 1 or $-1$ there are none. If $k$ is strictly between them there are 2. At exactly 1 or $-1$ there is 1. For $\\cos 2x = k$, double the count.',
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
      asking: 'Which angles in one full turn have a cosine of $-\\frac{\\sqrt{3}}{2}$?',
      solution:
        'Ignore the minus for a moment and find the **reference angle**, the acute angle with the right size. $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$, so the reference angle is $30^\\circ$.\n\n' +
        'Now the sign. Cosine is the $x$-coordinate on the unit circle (a circle of radius 1), so it is negative on the left side: the second and third quadrants.\n\n' +
        'Second quadrant: $30^\\circ$ short of a half turn, so $x = 180^\\circ - 30^\\circ = 150^\\circ$.\n\n' +
        'Third quadrant: $30^\\circ$ past a half turn, so $x = 180^\\circ + 30^\\circ = 210^\\circ$.',
      conclusion: 'The reference angle gives the size and the left side of the circle gives the sign, so the answer is $x = 150^\\circ$ or $x = 210^\\circ$.',
      whyWrong: [
        null,
        'This ignores the minus sign. These angles solve $\\cos x = \\frac{\\sqrt{3}}{2}$.',
        '$330^\\circ$ is in the fourth quadrant, where cosine is positive. These two quadrants are where **tangent** is negative.',
        'This uses the reference angle $60^\\circ$, which belongs to $\\cos x = -\\frac{1}{2}$.',
      ],
      keyIdea: 'Find the reference angle $\\alpha$ from the size of the value, then use the sign to pick two quadrants. The angles are: first $\\alpha$, second $180^\\circ - \\alpha$, third $180^\\circ + \\alpha$, fourth $360^\\circ - \\alpha$.',
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
      asking: 'Which angles from 0 up to $2\\pi$ make this equation true?',
      solution:
        'Get $\\sin x$ alone. Subtract 1 from both sides: $\\sqrt{2}\\sin x = -1$. Divide by $\\sqrt{2}$: $\\sin x = -\\frac{1}{\\sqrt{2}}$.\n\n' +
        'Ignore the minus and find the **reference angle**, the acute angle with the right size. $\\sin\\frac{\\pi}{4} = \\frac{1}{\\sqrt{2}}$ (that is $\\sin 45^\\circ$), so the reference angle is $\\frac{\\pi}{4}$.\n\n' +
        'Sine is the height on the unit circle (a circle of radius 1), so it is negative in the bottom half: the third and fourth quadrants.\n\n' +
        'Third quadrant: $\\frac{\\pi}{4}$ past a half turn ($\\pi$), so $x = \\pi + \\frac{\\pi}{4} = \\frac{4\\pi}{4} + \\frac{\\pi}{4} = \\frac{5\\pi}{4}$.\n\n' +
        'Fourth quadrant: $\\frac{\\pi}{4}$ short of a full turn ($2\\pi$), so $x = 2\\pi - \\frac{\\pi}{4} = \\frac{8\\pi}{4} - \\frac{\\pi}{4} = \\frac{7\\pi}{4}$.',
      conclusion: 'Both angles are in the bottom half of the circle with a reference angle of $\\frac{\\pi}{4}$, so the answer is $x = \\frac{5\\pi}{4}$ or $x = \\frac{7\\pi}{4}$.',
      whyWrong: [
        null,
        'A sign slip when rearranging: these angles solve $\\sin x = +\\frac{1}{\\sqrt{2}}$.',
        'These are the quadrants where **cosine** is negative. Sine is negative in the third and fourth quadrants.',
        'This uses the reference angle $\\frac{\\pi}{6}$, which belongs to $\\sin x = -\\frac{1}{2}$. The $\\sqrt{2}$ was not divided correctly.',
      ],
      keyIdea: 'Rearrange to $\\sin x = k$, find the reference angle $\\alpha$ from the size of $k$, then use the sign. Sine is positive in quadrants 1 and 2, and negative in 3 and 4. In radians, the angles are $\\alpha$, $\\pi - \\alpha$, $\\pi + \\alpha$, $2\\pi - \\alpha$.',
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
      asking: 'Which values of $x$ from $0^\\circ$ to $180^\\circ$ make the cosine of $2x$ equal $\\frac{1}{2}$?',
      solution:
        'Let $u = 2x$ to simplify the equation: $\\cos u = \\frac{1}{2}$.\n\n' +
        'Change the interval too. As $x$ goes from $0^\\circ$ to $180^\\circ$, $u = 2x$ goes from $0^\\circ$ to $360^\\circ$.\n\n' +
        'Solve for $u$. We know $\\cos 60^\\circ = \\frac{1}{2}$, so $u = 60^\\circ$. Cosine is also positive in the fourth quadrant ($270^\\circ$ to $360^\\circ$), where the partner angle is $60^\\circ$ short of a full turn: $u = 360^\\circ - 60^\\circ = 300^\\circ$.\n\n' +
        'Those are values of $2x$. Divide each by 2 to get $x$: $x = 30^\\circ$ or $x = 150^\\circ$.',
      conclusion: 'Testing: doubling gives $60^\\circ$ and $300^\\circ$, and both have a cosine of $\\frac{1}{2}$. So the answer is $x = 30^\\circ$ or $x = 150^\\circ$.',
      whyWrong: [
        null,
        'These are the values of $2x$. You still have to halve them to get $x$.',
        'This is only the first solution. Solving for $u$ over $0^\\circ$ to $360^\\circ$ gives a second one.',
        'This applies the partner rule $360^\\circ - x$ to $x$ instead of to $2x$. And $330^\\circ$ is outside the interval.',
      ],
      keyIdea: 'For $\\cos(bx) = k$, let $u = bx$, multiply the ends of the interval by $b$, find all values of $u$ in that interval, then divide them by $b$. Apply the partner rule to $u$, not to $x$.',
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
      asking: 'Which values of $x$ make the sine of $x - 30^\\circ$ equal $\\frac{\\sqrt{3}}{2}$?',
      solution:
        'Let $u = x - 30^\\circ$, so the equation becomes $\\sin u = \\frac{\\sqrt{3}}{2}$.\n\n' +
        'Change the interval too. Subtract $30^\\circ$ from both ends: $x$ from $0^\\circ$ to $360^\\circ$ means $u$ from $-30^\\circ$ to $330^\\circ$.\n\n' +
        'Solve for $u$. $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$, so $u = 60^\\circ$. Sine is also positive in the second quadrant ($90^\\circ$ to $180^\\circ$), where the partner angle is $60^\\circ$ short of a half turn: $u = 180^\\circ - 60^\\circ = 120^\\circ$. Both lie in the interval.\n\n' +
        'Undo the substitution. Since $u = x - 30^\\circ$, we have $x = u + 30^\\circ$. So $x = 60^\\circ + 30^\\circ = 90^\\circ$ or $x = 120^\\circ + 30^\\circ = 150^\\circ$.',
      conclusion: 'Testing: taking away $30^\\circ$ gives $60^\\circ$ and $120^\\circ$, which both work. So the answer is $x = 90^\\circ$ or $x = 150^\\circ$.',
      whyWrong: [
        null,
        'These are the values of $x - 30^\\circ$. You still have to add $30^\\circ$ to get $x$.',
        'This subtracts $30^\\circ$ from $u$. Since $u = x - 30^\\circ$, undoing it means adding $30^\\circ$.',
        'This keeps only one value of $u$. Sine is positive in two quadrants, so $u = 120^\\circ$ gives a second solution.',
      ],
      keyIdea: 'For $\\sin(x - c) = k$, let $u = x - c$, shift the ends of the interval by the same amount, solve for $u$, then add $c$ back to every solution.',
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
      asking: 'Which angles in one full turn have a cosine that squares to $\\frac{1}{4}$?',
      solution:
        '$\\cos^2 x$ means $\\cos x$ multiplied by itself. Take the square root of both sides to undo the square. Both signs count, because $\\frac{1}{2}$ and $-\\frac{1}{2}$ both square to $\\frac{1}{4}$. So $\\cos x = \\frac{1}{2}$ or $\\cos x = -\\frac{1}{2}$.\n\n' +
        'In both cases the **reference angle** (the acute angle with the right size) is $60^\\circ$, because $\\cos 60^\\circ = \\frac{1}{2}$.\n\n' +
        'Case $\\cos x = \\frac{1}{2}$: cosine is the $x$-coordinate on a circle of radius 1, so it is positive on the right side, the first and fourth quadrants. So $x = 60^\\circ$, or $60^\\circ$ short of a full turn: $x = 360^\\circ - 60^\\circ = 300^\\circ$.\n\n' +
        'Case $\\cos x = -\\frac{1}{2}$: cosine is negative on the left side, the second and third quadrants. The angles are $60^\\circ$ either side of a half turn: $x = 180^\\circ - 60^\\circ = 120^\\circ$ or $x = 180^\\circ + 60^\\circ = 240^\\circ$.',
      conclusion: 'The two cases give four angles in total: $60^\\circ$, $120^\\circ$, $240^\\circ$, $300^\\circ$.',
      whyWrong: [
        null,
        'This takes only the positive square root. $\\cos x = -\\frac{1}{2}$ also squares to $\\frac{1}{4}$.',
        'This takes only the negative square root. $\\cos x = \\frac{1}{2}$ also squares to $\\frac{1}{4}$.',
        'These angles solve $\\sin^2 x = \\frac{1}{4}$. The reference angle for $\\cos x = \\frac{1}{2}$ is $60^\\circ$, not $30^\\circ$.',
      ],
      keyIdea: 'For $\\cos^2 x = k$ or $\\sin^2 x = k$, take the square root and write both the positive and the negative. That gives two separate equations, usually with two solutions each, so expect four angles in a full turn.',
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
      asking: 'Which angles in one full turn make $\\sin x$ times $\\cos x$ equal 0?',
      solution:
        'A product is 0 only when at least one factor is 0. So either $\\sin x = 0$ or $\\cos x = 0$. Don\'t divide by $\\cos x$ or $\\sin x$, because that would lose solutions.\n\n' +
        'Case $\\sin x = 0$: sine is the height on the unit circle (a circle of radius 1). The height is 0 where the point lies on the horizontal axis, at $0^\\circ$ and $180^\\circ$. The interval stops before $360^\\circ$.\n\n' +
        'Case $\\cos x = 0$: cosine is the $x$-coordinate. It is 0 where the point lies on the vertical axis, at $90^\\circ$ and $270^\\circ$.',
      conclusion: 'Together the two cases give $0^\\circ$, $90^\\circ$, $180^\\circ$, $270^\\circ$.',
      whyWrong: [
        null,
        'This solves only $\\sin x = 0$, as if $\\cos x$ had been divided away. Dividing by $\\cos x$ loses the solutions where it is zero.',
        'This solves only $\\cos x = 0$, as if $\\sin x$ had been divided away. Dividing by $\\sin x$ loses the solutions where it is zero.',
        'These angles solve $\\sin x = \\cos x$. The product is zero when one factor is zero, not when the two are equal.',
      ],
      keyIdea: 'When a trig equation is a product equal to 0, set each factor to 0 and solve separately. Never divide by a trig function, because that throws away the solutions where it equals 0.',
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
      asking: 'Which single angle does $\\sin^{-1}$ give for $\\frac{1}{2}$?',
      solution:
        '$\\sin^{-1}\\left(\\frac{1}{2}\\right)$ asks: which angle has a sine of $\\frac{1}{2}$? More than one angle does, so we need a rule to pick one.\n\n' +
        'The rule is a fixed interval. The **principal value** of $\\sin^{-1}$ is the answer between $-90^\\circ$ and $90^\\circ$. It is what a calculator shows.\n\n' +
        'In that interval the angle is $30^\\circ$, because $\\sin 30^\\circ = \\frac{1}{2}$. The other common angle, $150^\\circ$, is outside the interval.',
      conclusion: 'Only one angle between $-90^\\circ$ and $90^\\circ$ has this sine, so the principal value is $30^\\circ$.',
      whyWrong: [
        null,
        '$\\cos 60^\\circ = \\frac{1}{2}$, but $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$. This mixes up sine and cosine.',
        '$\\sin 150^\\circ = \\frac{1}{2}$ is true, but $150^\\circ$ is outside the interval for the principal value. It is the second solution of the equation.',
        '$\\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$, not $\\frac{1}{2}$.',
      ],
      keyIdea: 'Principal values: $\\sin^{-1}$ gives an angle from $-90^\\circ$ to $90^\\circ$, $\\cos^{-1}$ from $0^\\circ$ to $180^\\circ$, and $\\tan^{-1}$ between $-90^\\circ$ and $90^\\circ$. Use the interval to choose between the possible angles.',
    },
    check: {
      optionValues: [30, 60, 150, 45],
      compute: () => (Math.asin(0.5) * 180) / Math.PI,
    },
  },];
