import type { StaticQuestion } from '../../../types';
import { det3 } from '../../../lib/mathx';

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
/** Angle in radians -> number of twelfths of pi (rounded). */
const twelfths = (x: number) => Math.round(x / (Math.PI / 12));

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
    id: 'trig-equations-003',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'Which expression is equal to $\\sin 2\\theta$ for **every** angle $\\theta$?',
    options: ['$2\\sin\\theta$', '$\\cos^2\\theta - \\sin^2\\theta$', '$\\sin\\theta\\cos\\theta$', '$2\\sin\\theta\\cos\\theta$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The double-angle formula for sine is\n\n$$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$$\n\n' +
        'Test it with $\\theta = 30^\\circ$: $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$ and $2\\sin 30^\\circ\\cos 30^\\circ = 2 \\times \\frac{1}{2} \\times \\frac{\\sqrt{3}}{2} = \\frac{\\sqrt{3}}{2}$. They match.\n\n' +
        'The same test rules out the others: $2\\sin 30^\\circ = 1$, $\\cos^2 30^\\circ - \\sin^2 30^\\circ = \\frac{3}{4} - \\frac{1}{4} = \\frac{1}{2}$, and $\\sin 30^\\circ\\cos 30^\\circ = \\frac{\\sqrt{3}}{4}$.',
      whyWrong: [
        'This treats the 2 as if it can be pulled out of the sine. It cannot: with $\\theta = 90^\\circ$, $\\sin 180^\\circ = 0$ but $2\\sin 90^\\circ = 2$.',
        'This is the double-angle formula for $\\cos 2\\theta$, not for $\\sin 2\\theta$.',
        'Right ingredients but the factor 2 is missing: $\\sin\\theta\\cos\\theta$ is only half of $\\sin 2\\theta$.',
        null,
      ],
      keyIdea: '$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$; a quick test with one angle such as $30^\\circ$ exposes wrong formulas.',
    },
    check: {
      // evaluate every option at theta = 0.7 rad and compare with sin(1.4)
      optionValues: [2 * Math.sin(0.7), Math.cos(0.7) ** 2 - Math.sin(0.7) ** 2, Math.sin(0.7) * Math.cos(0.7), 2 * Math.sin(0.7) * Math.cos(0.7)],
      compute: () => Math.sin(2 * 0.7),
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
  {
    id: 'trig-equations-005',
    subtopic: 'trig-equations',
    difficulty: 'foundation',
    stem: 'If $\\cos\\theta = 0.6$, what is $\\cos 2\\theta$?',
    options: ['$1.2$', '$0.36$', '$-0.28$', '$0.28$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Use the version of the double-angle formula that only needs $\\cos\\theta$:\n\n$$\\cos 2\\theta = 2\\cos^2\\theta - 1$$\n\n' +
        '1. $\\cos^2\\theta = 0.6^2 = 0.36$\n' +
        '2. $2 \\times 0.36 = 0.72$\n' +
        '3. $0.72 - 1 = -0.28$\n\n' +
        'So $\\cos 2\\theta = -0.28$.',
      whyWrong: [
        'This is $2\\cos\\theta$. The 2 is inside the cosine, so $\\cos 2\\theta \\ne 2\\cos\\theta$.',
        'This is just $\\cos^2\\theta$: the formula still needs doubling and then subtracting 1.',
        null,
        'This uses $1 - 2\\cos^2\\theta$, the formula with the signs reversed. The sine version is $1 - 2\\sin^2\\theta$; the cosine version is $2\\cos^2\\theta - 1$.',
      ],
      keyIdea: '$\\cos 2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta = \\cos^2\\theta - \\sin^2\\theta$.',
    },
    check: {
      optionValues: [1.2, 0.36, -0.28, 0.28],
      compute: () => Math.cos(2 * Math.acos(0.6)),
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
    id: 'trig-equations-008',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $2\\sin^2 x - \\sin x - 1 = 0$ for $0^\\circ \\le x \\le 360^\\circ$.',
    options: ['$90^\\circ$, $210^\\circ$, $330^\\circ$', '$30^\\circ$, $150^\\circ$, $270^\\circ$', '$90^\\circ$ only', '$90^\\circ$, $330^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'This is a quadratic in $\\sin x$. Let $s = \\sin x$:\n\n$$2s^2 - s - 1 = 0$$\n\n' +
        '1. Factorise: $(2s + 1)(s - 1) = 0$. (Check: $2s^2 - 2s + s - 1 = 2s^2 - s - 1$.)\n' +
        '2. So $s = 1$ or $s = -\\frac{1}{2}$. Both are between $-1$ and $1$, so both are allowed.\n' +
        '3. $\\sin x = 1$: $x = 90^\\circ$.\n' +
        '4. $\\sin x = -\\frac{1}{2}$: reference angle $30^\\circ$; sine is negative in the third and fourth quadrants, so $x = 180^\\circ + 30^\\circ = 210^\\circ$ or $x = 360^\\circ - 30^\\circ = 330^\\circ$.\n\n' +
        'Solutions: $90^\\circ$, $210^\\circ$, $330^\\circ$.',
      whyWrong: [
        null,
        'The signs in the factorisation are swapped: $(2s - 1)(s + 1) = 2s^2 + s - 1$, which is not the given quadratic. That gives $\\sin x = \\frac{1}{2}$ or $-1$ instead.',
        'This throws away $\\sin x = -\\frac{1}{2}$ as if sine could not be negative. Only values outside $-1 \\le \\sin x \\le 1$ are rejected.',
        'The calculator gives $-30^\\circ$ for $\\sin x = -\\frac{1}{2}$; adding $360^\\circ$ gives $330^\\circ$, but the third-quadrant solution $180^\\circ + 30^\\circ = 210^\\circ$ was missed.',
      ],
      keyIdea: 'Treat $\\sin x$ as the unknown of a quadratic, factorise, then solve each simpler equation over the whole interval.',
    },
    check: {
      optionValues: ['90,210,330', '30,150,270', '90', '90,330'],
      compute: () => solveDeg((x) => 2 * Math.sin(x) ** 2 - Math.sin(x) - 1, 0, 360),
    },
  },
  {
    id: 'trig-equations-009',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Solve $2\\cos^2 x + 3\\sin x - 3 = 0$ for $0^\\circ \\le x \\le 360^\\circ$.',
    options: [
      '$210^\\circ$, $270^\\circ$, $330^\\circ$',
      '$30^\\circ$, $90^\\circ$',
      '$30^\\circ$, $90^\\circ$, $150^\\circ$',
      '$30^\\circ$, $90^\\circ$, $150^\\circ$, $270^\\circ$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'There is a mix of $\\cos^2 x$ and $\\sin x$, so replace $\\cos^2 x$ with $1 - \\sin^2 x$ to get everything in terms of $\\sin x$.\n\n' +
        '1. $2(1 - \\sin^2 x) + 3\\sin x - 3 = 0$\n' +
        '2. $2 - 2\\sin^2 x + 3\\sin x - 3 = 0$, so $-2\\sin^2 x + 3\\sin x - 1 = 0$\n' +
        '3. Multiply by $-1$: $2\\sin^2 x - 3\\sin x + 1 = 0$\n' +
        '4. Factorise: $(2\\sin x - 1)(\\sin x - 1) = 0$, so $\\sin x = \\frac{1}{2}$ or $\\sin x = 1$.\n' +
        '5. $\\sin x = \\frac{1}{2}$: $x = 30^\\circ$ or $x = 180^\\circ - 30^\\circ = 150^\\circ$.\n' +
        '6. $\\sin x = 1$: $x = 90^\\circ$ (only once per turn).\n\n' +
        'Solutions: $30^\\circ$, $90^\\circ$, $150^\\circ$.',
      whyWrong: [
        'A sign error in the factorisation gives $\\sin x = -\\frac{1}{2}$ or $\\sin x = -1$. Check: $(2\\sin x + 1)(\\sin x + 1)$ expands to $2\\sin^2 x + 3\\sin x + 1$, which is the wrong quadratic.',
        'This misses $150^\\circ$: $\\sin x = \\frac{1}{2}$ has a second solution $180^\\circ - 30^\\circ = 150^\\circ$.',
        null,
        '$\\sin x = 1$ has only one solution per turn, $90^\\circ$. At $270^\\circ$ the sine is $-1$, not $1$.',
      ],
      keyIdea: 'Use $\\cos^2 x = 1 - \\sin^2 x$ to turn a mixed equation into a quadratic in one trig function.',
    },
    check: {
      optionValues: ['210,270,330', '30,90', '30,90,150', '30,90,150,270'],
      compute: () => solveDeg((x) => 2 * Math.cos(x) ** 2 + 3 * Math.sin(x) - 3, 0, 360),
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
    id: 'trig-equations-011',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'How many solutions does $\\sin 2x = \\sin x$ have for $0^\\circ \\le x \\le 360^\\circ$?',
    options: ['2', '3', '4', '5'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Use $\\sin 2x = 2\\sin x\\cos x$: $2\\sin x\\cos x = \\sin x$.\n' +
        '2. Bring everything to one side: $2\\sin x\\cos x - \\sin x = 0$.\n' +
        '3. Factorise (do **not** divide by $\\sin x$): $\\sin x\\,(2\\cos x - 1) = 0$.\n' +
        '4. $\\sin x = 0$: $x = 0^\\circ$, $180^\\circ$, $360^\\circ$ (three solutions, both endpoints are included).\n' +
        '5. $2\\cos x - 1 = 0$, so $\\cos x = \\frac{1}{2}$: $x = 60^\\circ$ or $x = 360^\\circ - 60^\\circ = 300^\\circ$.\n\n' +
        'Solutions: $0^\\circ$, $60^\\circ$, $180^\\circ$, $300^\\circ$, $360^\\circ$, which is **5** solutions.',
      whyWrong: [
        'This divides both sides by $\\sin x$, which throws away every solution of $\\sin x = 0$. Only $60^\\circ$ and $300^\\circ$ are left.',
        'This solves only the factor $\\sin x = 0$ ($0^\\circ$, $180^\\circ$, $360^\\circ$) and forgets the second factor $2\\cos x - 1 = 0$.',
        'This misses one endpoint: in a closed interval $\\sin x = 0$ has three solutions, $0^\\circ$, $180^\\circ$ and $360^\\circ$.',
        null,
      ],
      keyIdea: 'Never divide by a trig function that could be zero; factorise instead so no solutions are lost.',
    },
    check: {
      optionValues: [2, 3, 4, 5],
      compute: () => solveDeg((x) => Math.sin(2 * x) - Math.sin(x), 0, 360).split(',').length,
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
    id: 'trig-equations-013',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    stem: 'Given that $\\sin\\theta = \\frac{3}{5}$ and $\\theta$ is obtuse ($90^\\circ < \\theta < 180^\\circ$), find the exact value of $\\sin 2\\theta$.',
    options: ['$\\frac{24}{25}$', '$\\frac{6}{5}$', '$-\\frac{24}{25}$', '$\\frac{7}{25}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. Find $\\cos\\theta$: $\\cos^2\\theta = 1 - \\frac{9}{25} = \\frac{16}{25}$, so $\\cos\\theta = \\pm\\frac{4}{5}$.\n' +
        '2. $\\theta$ is obtuse (second quadrant), where cosine is negative: $\\cos\\theta = -\\frac{4}{5}$.\n' +
        '3. $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2 \\times \\frac{3}{5} \\times \\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$.\n\n' +
        'Sense check: $\\theta \\approx 143^\\circ$, so $2\\theta \\approx 286^\\circ$, in the fourth quadrant where sine is negative.',
      whyWrong: [
        'This takes $\\cos\\theta = +\\frac{4}{5}$, ignoring that cosine is negative for an obtuse angle.',
        'This is $2\\sin\\theta$. The 2 belongs inside the sine; $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$.',
        null,
        'This is $1 - 2\\sin^2\\theta = \\frac{7}{25}$, which is the formula for $\\cos 2\\theta$, not $\\sin 2\\theta$.',
      ],
      keyIdea: 'For $\\sin 2\\theta$ you need both $\\sin\\theta$ and $\\cos\\theta$, with the signs fixed by the quadrant.',
    },
    check: {
      optionValues: [24 / 25, 6 / 5, -24 / 25, 7 / 25],
      compute: () => Math.sin(2 * (Math.PI - Math.asin(3 / 5))),
    },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'trig-equations-014',
    subtopic: 'trig-equations',
    difficulty: 'challenge',
    stem:
      'Find the angles $(\\alpha, \\beta, \\gamma)$, with $0 \\le \\alpha \\le \\frac{\\pi}{2}$, $0 \\le \\beta \\le \\frac{\\pi}{2}$ and $0 \\le \\gamma < \\frac{\\pi}{2}$, such that\n\n' +
      '$$\\begin{aligned} 2\\sin\\alpha + 3\\cos\\beta + \\tan\\gamma &= 2 \\\\ 4\\sin\\alpha - \\cos\\beta + 2\\tan\\gamma &= 4 \\\\ 6\\sin\\alpha + 2\\cos\\beta - \\tan\\gamma &= 2 \\end{aligned}$$',
    options: [
      '$\\left(\\frac{\\pi}{3}, \\frac{\\pi}{2}, \\frac{\\pi}{4}\\right)$',
      '$\\left(\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{\\pi}{4}\\right)$',
      '$\\left(\\frac{\\pi}{6}, 0, \\frac{\\pi}{4}\\right)$',
      '$\\left(\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let $u = \\sin\\alpha$, $v = \\cos\\beta$, $w = \\tan\\gamma$. The system is now ordinary linear simultaneous equations:\n\n' +
        '$$\\begin{aligned} 2u + 3v + w &= 2 \\quad (1) \\\\ 4u - v + 2w &= 4 \\quad (2) \\\\ 6u + 2v - w &= 2 \\quad (3) \\end{aligned}$$\n\n' +
        '1. Eliminate $w$ using (2) minus $2 \\times$ (1): $(4u - 4u) + (-v - 6v) + (2w - 2w) = 4 - 4$, so $-7v = 0$ and $v = 0$.\n' +
        '2. Eliminate $w$ using (1) + (3): $8u + 5v = 4$. With $v = 0$: $8u = 4$, so $u = \\frac{1}{2}$.\n' +
        '3. Back into (1): $2 \\times \\frac{1}{2} + 3 \\times 0 + w = 2$, so $w = 1$.\n' +
        '4. Check in (3): $6 \\times \\frac{1}{2} + 2 \\times 0 - 1 = 2$. Correct.\n\n' +
        'Now convert back to angles in the given ranges:\n\n' +
        '- $\\sin\\alpha = \\frac{1}{2}$ gives $\\alpha = \\frac{\\pi}{6}$\n' +
        '- $\\cos\\beta = 0$ gives $\\beta = \\frac{\\pi}{2}$\n' +
        '- $\\tan\\gamma = 1$ gives $\\gamma = \\frac{\\pi}{4}$\n\n' +
        'Answer: $\\left(\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{\\pi}{4}\\right)$.',
      whyWrong: [
        'This mixes up the sine and cosine values: $\\sin\\frac{\\pi}{3} = \\frac{\\sqrt{3}}{2}$, not $\\frac{1}{2}$. It is $\\cos\\frac{\\pi}{3}$ that equals $\\frac{1}{2}$.',
        null,
        'This uses $\\beta = 0$ for $\\cos\\beta = 0$, but $\\cos 0 = 1$. It is $\\sin 0$ that equals 0; $\\cos\\frac{\\pi}{2} = 0$.',
        'This treats $\\tan\\gamma = 1$ like $\\sin\\gamma = 1$. In fact $\\tan\\frac{\\pi}{4} = 1$, and $\\tan\\frac{\\pi}{2}$ is not defined (it is not even in the allowed range).',
      ],
      keyIdea: 'Substitute $u = \\sin\\alpha$, $v = \\cos\\beta$, $w = \\tan\\gamma$, solve the linear system, then turn each value back into an angle.',
    },
    check: {
      // multiples of pi/12: pi/6 = 2, pi/3 = 4, pi/2 = 6, pi/4 = 3
      optionValues: ['4,6,3', '2,6,3', '2,0,3', '2,6,6'],
      compute: () => {
        const A = [
          [2, 3, 1],
          [4, -1, 2],
          [6, 2, -1],
        ];
        const b = [2, 4, 2];
        const D = det3(A);
        const col = (j: number) => A.map((row, i) => row.map((v, k) => (k === j ? b[i] : v)));
        const [u, v, w] = [0, 1, 2].map((j) => det3(col(j)) / D); // Cramer's rule
        return [twelfths(Math.asin(u)), twelfths(Math.acos(v)), twelfths(Math.atan(w))].join(',');
      },
    },
  },
  {
    id: 'trig-equations-015',
    subtopic: 'trig-equations',
    difficulty: 'challenge',
    stem: 'Solve $\\cos 2x = \\cos x$ for $0^\\circ \\le x < 360^\\circ$.',
    options: [
      '$60^\\circ$, $180^\\circ$, $300^\\circ$',
      '$120^\\circ$, $240^\\circ$',
      '$0^\\circ$, $120^\\circ$, $240^\\circ$, $360^\\circ$',
      '$0^\\circ$, $120^\\circ$, $240^\\circ$',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Choose the double-angle formula that only involves $\\cos x$: $\\cos 2x = 2\\cos^2 x - 1$.\n\n' +
        '1. $2\\cos^2 x - 1 = \\cos x$, so $2\\cos^2 x - \\cos x - 1 = 0$.\n' +
        '2. Let $c = \\cos x$: $2c^2 - c - 1 = (2c + 1)(c - 1) = 0$, so $c = 1$ or $c = -\\frac{1}{2}$.\n' +
        '3. $\\cos x = 1$: $x = 0^\\circ$ ($360^\\circ$ is **not** allowed because the interval is $x < 360^\\circ$).\n' +
        '4. $\\cos x = -\\frac{1}{2}$: reference angle $60^\\circ$, cosine negative in quadrants 2 and 3, so $x = 180^\\circ - 60^\\circ = 120^\\circ$ or $x = 180^\\circ + 60^\\circ = 240^\\circ$.\n\n' +
        'Solutions: $0^\\circ$, $120^\\circ$, $240^\\circ$.',
      whyWrong: [
        'This uses the wrong double-angle formula $\\cos 2x = 1 - 2\\cos^2 x$, which leads to $\\cos x = \\frac{1}{2}$ or $\\cos x = -1$. The correct one is $2\\cos^2 x - 1$ (or $1 - 2\\sin^2 x$).',
        'This misses the root $\\cos x = 1$, which gives $x = 0^\\circ$.',
        'This includes $360^\\circ$, but the interval is $0^\\circ \\le x < 360^\\circ$, so $360^\\circ$ is excluded.',
        null,
      ],
      keyIdea: 'Pick the form of $\\cos 2x$ that matches the rest of the equation, solve the quadratic, and respect strict or non-strict interval ends.',
    },
    check: {
      optionValues: ['60,180,300', '120,240', '0,120,240,360', '0,120,240'],
      compute: () => solveDeg((x) => Math.cos(2 * x) - Math.cos(x), 0, 359),
    },
  },
  {
    id: 'trig-equations-016',
    subtopic: 'trig-equations',
    difficulty: 'challenge',
    stem:
      'Find $x$ and $y$, with $0^\\circ \\le x \\le 180^\\circ$ and $0^\\circ \\le y \\le 180^\\circ$, such that\n\n' +
      '$$\\begin{aligned} \\sin x + 2\\cos y &= 2 \\\\ 3\\sin x - 2\\cos y &= 2 \\end{aligned}$$',
    options: ['$x = 90^\\circ$, $y = 60^\\circ$', '$x = 90^\\circ$, $y = 30^\\circ$', '$x = 0^\\circ$, $y = 60^\\circ$', '$x = 90^\\circ$, $y = 120^\\circ$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Treat $\\sin x$ and $\\cos y$ as two unknowns.\n\n' +
        '1. Add the equations: the $2\\cos y$ terms cancel, giving $4\\sin x = 4$, so $\\sin x = 1$.\n' +
        '2. Substitute into the first equation: $1 + 2\\cos y = 2$, so $2\\cos y = 1$ and $\\cos y = \\frac{1}{2}$.\n' +
        '3. $\\sin x = 1$ with $0^\\circ \\le x \\le 180^\\circ$: $x = 90^\\circ$.\n' +
        '4. $\\cos y = \\frac{1}{2}$ with $0^\\circ \\le y \\le 180^\\circ$: $y = 60^\\circ$ (the other cosine solution, $300^\\circ$, is outside the range).\n\n' +
        'Check in the second equation: $3 \\times 1 - 2 \\times \\frac{1}{2} = 2$. Correct.\n\n' +
        'Answer: $x = 90^\\circ$, $y = 60^\\circ$.',
      whyWrong: [
        null,
        'This uses the sine value: $\\sin 30^\\circ = \\frac{1}{2}$, but the equation is $\\cos y = \\frac{1}{2}$, and $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$.',
        'This confuses $\\sin x = 1$ with $\\cos x = 1$: $\\sin 0^\\circ = 0$, and it is $\\sin 90^\\circ$ that equals 1.',
        'A sign slip when back-substituting gives $\\cos y = -\\frac{1}{2}$. From $1 + 2\\cos y = 2$ we get $\\cos y = +\\frac{1}{2}$.',
      ],
      keyIdea: 'In a system of trig equations, treat each trig expression as an unknown, eliminate, then convert the values back to angles within the given ranges.',
    },
    check: {
      optionValues: ['90,60', '90,30', '0,60', '90,120'],
      compute: () => {
        // [1 2; 3 -2] [u v]^T = [2 2]^T by Cramer's rule
        const d = 1 * -2 - 2 * 3;
        const u = (2 * -2 - 2 * 2) / d;
        const v = (1 * 2 - 3 * 2) / d;
        const toDeg = (r: number) => Math.round((r * 180) / Math.PI);
        return `${toDeg(Math.asin(u))},${toDeg(Math.acos(v))}`;
      },
    },
  },
  {
    id: 'trig-equations-017',
    subtopic: 'trig-equations',
    difficulty: 'challenge',
    stem: 'What is the **sum** of all the solutions of $2\\sin^2 x = 1 + \\cos x$ for $0 \\le x \\le 2\\pi$?',
    options: ['$2\\pi$', '$4\\pi$', '$3\\pi$', '$\\frac{4\\pi}{3}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. Replace $\\sin^2 x$ with $1 - \\cos^2 x$: $2(1 - \\cos^2 x) = 1 + \\cos x$.\n' +
        '2. Expand and collect: $2 - 2\\cos^2 x - 1 - \\cos x = 0$, so $2\\cos^2 x + \\cos x - 1 = 0$.\n' +
        '3. Factorise with $c = \\cos x$: $(2c - 1)(c + 1) = 0$, so $\\cos x = \\frac{1}{2}$ or $\\cos x = -1$.\n' +
        '4. $\\cos x = \\frac{1}{2}$: $x = \\frac{\\pi}{3}$ or $x = 2\\pi - \\frac{\\pi}{3} = \\frac{5\\pi}{3}$.\n' +
        '5. $\\cos x = -1$: $x = \\pi$.\n' +
        '6. Sum: $\\frac{\\pi}{3} + \\pi + \\frac{5\\pi}{3} = \\frac{\\pi + 3\\pi + 5\\pi}{3} = \\frac{9\\pi}{3} = 3\\pi$.',
      whyWrong: [
        'This loses the solution $x = \\pi$. That happens if you write $2(1 - \\cos x)(1 + \\cos x) = 1 + \\cos x$ and divide by $1 + \\cos x$, which is zero when $\\cos x = -1$.',
        'A sign error in the factorisation gives $\\cos x = -\\frac{1}{2}$ or $\\cos x = 1$, with solutions $0$, $\\frac{2\\pi}{3}$, $\\frac{4\\pi}{3}$, $2\\pi$ that add to $4\\pi$.',
        null,
        'This adds only the calculator values $\\frac{\\pi}{3}$ and $\\pi$, missing the second cosine solution $\\frac{5\\pi}{3}$.',
      ],
      keyIdea: 'Use $\\sin^2 x = 1 - \\cos^2 x$ to make a quadratic in $\\cos x$, find every solution in the interval, and never divide by an expression that can be zero.',
    },
    check: {
      optionValues: [2 * Math.PI, 4 * Math.PI, 3 * Math.PI, (4 * Math.PI) / 3],
      compute: () =>
        solvePi12((x) => 2 * Math.sin(x) ** 2 - 1 - Math.cos(x), 24)
          .map((k) => (k * Math.PI) / 12)
          .reduce((a, b) => a + b, 0),
    },
  },
  {
    id: 'trig-equations-018',
    subtopic: 'trig-equations',
    difficulty: 'challenge',
    stem: 'Given that $\\sin x + \\cos x = \\frac{7}{5}$, find the value of $\\sin 2x$.',
    options: ['$\\frac{24}{25}$', '$-\\frac{24}{25}$', '$\\frac{12}{25}$', '$\\frac{49}{25}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Square both sides, because squaring creates both $\\sin^2 x + \\cos^2 x$ and $2\\sin x\\cos x$.\n\n' +
        '1. $(\\sin x + \\cos x)^2 = \\left(\\frac{7}{5}\\right)^2 = \\frac{49}{25}$\n' +
        '2. Expand the left side: $\\sin^2 x + 2\\sin x\\cos x + \\cos^2 x = \\frac{49}{25}$\n' +
        '3. Use $\\sin^2 x + \\cos^2 x = 1$ and $2\\sin x\\cos x = \\sin 2x$: $1 + \\sin 2x = \\frac{49}{25}$\n' +
        '4. $\\sin 2x = \\frac{49}{25} - 1 = \\frac{24}{25}$\n\n' +
        'Check with a 3-4-5 triangle: $\\sin x = \\frac{3}{5}$, $\\cos x = \\frac{4}{5}$ gives $\\sin x + \\cos x = \\frac{7}{5}$ and $\\sin 2x = 2 \\times \\frac{3}{5} \\times \\frac{4}{5} = \\frac{24}{25}$.',
      whyWrong: [
        null,
        'This expands $(\\sin x + \\cos x)^2$ with a minus sign in the middle, $\\sin^2 x - 2\\sin x\\cos x + \\cos^2 x$. That is the expansion of $(\\sin x - \\cos x)^2$.',
        'This is $\\sin x\\cos x$, i.e. the factor 2 in $\\sin 2x = 2\\sin x\\cos x$ was forgotten.',
        'This is $(\\sin x + \\cos x)^2$ itself; the $\\sin^2 x + \\cos^2 x = 1$ part was never subtracted. It is also bigger than 1, which a sine can never be.',
      ],
      keyIdea: '$(\\sin x + \\cos x)^2 = 1 + \\sin 2x$, so squaring a sum of sine and cosine gives the double angle directly.',
    },
    check: {
      optionValues: [24 / 25, -24 / 25, 12 / 25, 49 / 25],
      compute: () => {
        // sin x + cos x = sqrt(2) sin(x + pi/4) = 7/5
        const x = Math.asin(7 / 5 / Math.SQRT2) - Math.PI / 4;
        return Math.sin(2 * x);
      },
    },
  },
];
