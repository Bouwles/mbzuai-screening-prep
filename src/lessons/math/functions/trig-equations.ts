import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'trig-equations',
  simple:
    'Solving a trig equation means finding every angle that gives a certain value, for example every $x$ with $\\sin x = \\frac{1}{2}$. ' +
    'Because the sine and cosine waves repeat, there is usually **more than one** answer in a full turn, so the calculator answer is only the start. ' +
    'An **identity** such as $\\sin^2 x + \\cos^2 x = 1$ is a fact that is true for every angle; you use it to swap one ratio for another.',
  methods: [
    { cue: 'Solve $\\sin x = k$, $\\cos x = k$ or $\\tan x = k$ in an interval', method: 'Find the reference angle, then use CAST: $\\sin$ partners are $x$ and $180^\\circ - x$, $\\cos$ partners $x$ and $360^\\circ - x$, $\\tan$ solutions are $180^\\circ$ apart.' },
    { cue: 'Given one ratio and the quadrant, find another', method: 'Use $\\sin^2\\theta + \\cos^2\\theta = 1$, pick the sign from the quadrant, then $\\tan = \\frac{\\sin}{\\cos}$.' },
    { cue: 'A multiple angle or a shift, such as $\\sin 2x = k$ or $\\sin(x - 30^\\circ) = k$', method: 'Replace the bracket by $u$, change the interval to match, solve for $u$, then undo the change to get $x$.' },
    { cue: 'A square such as $\\cos^2 x = k$', method: 'Take the square root with both signs, then solve $\\cos x = \\sqrt{k}$ and $\\cos x = -\\sqrt{k}$ separately.' },
    { cue: 'A product such as $\\sin x \\cos x = 0$, or $\\sin x = k\\cos x$', method: 'For a product equal to zero, solve each factor (never divide by something that can be $0$). $\\sin x = k\\cos x$ becomes $\\tan x = k$.' },
  ],
  know:
    '### Start here: what sin, cos and tan really are\n\n' +
    'Picture a point moving round a circle of radius 1 centred at the origin. After turning through an angle $\\theta$ (measured anticlockwise from the positive $x$-axis), the point is at $(\\cos\\theta, \\sin\\theta)$. So **cos is the $x$-coordinate** and **sin is the $y$-coordinate**. That one picture explains almost everything in this topic.\n\n' +
    '- Because the point is on a circle of radius 1, Pythagoras gives $\\sin^2\\theta + \\cos^2\\theta = 1$ for **every** angle.\n' +
    '- Tangent is the slope of the radius: $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$ (not defined when $\\cos\\theta = 0$, e.g. at $90^\\circ$).\n' +
    '- Both sine and cosine are always between $-1$ and $1$. An equation like $\\sin x = 2$ has **no** solutions.\n\n' +
    '### Signs in the four quadrants (CAST)\n\n' +
    'Going anticlockwise from the first quadrant, the positive functions are: **A**ll (1st), **S**in (2nd), **T**an (3rd), **C**os (4th). Start at the fourth quadrant and go anticlockwise (4th, 1st, 2nd, 3rd) and the letters spell **CAST**.\n\n' +
    '| Quadrant | Angles (degrees) | Positive |\n|---|---|---|\n| 1st | $0^\\circ$ to $90^\\circ$ | all three |\n| 2nd | $90^\\circ$ to $180^\\circ$ | sin only |\n| 3rd | $180^\\circ$ to $270^\\circ$ | tan only |\n| 4th | $270^\\circ$ to $360^\\circ$ | cos only |\n\n' +
    'Radians: $180^\\circ = \\pi$, so $90^\\circ = \\frac{\\pi}{2}$, $60^\\circ = \\frac{\\pi}{3}$, $45^\\circ = \\frac{\\pi}{4}$, $30^\\circ = \\frac{\\pi}{6}$. If the interval is written with $\\pi$, give answers in radians.\n\n' +
    '### Exact values you should know by heart\n\n' +
    '| Angle | $0^\\circ$ | $30^\\circ$ | $45^\\circ$ | $60^\\circ$ | $90^\\circ$ |\n|---|---|---|---|---|---|\n| sin | $0$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ | $1$ |\n| cos | $1$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ | $0$ |\n| tan | $0$ | $\\frac{1}{\\sqrt{3}}$ | $1$ | $\\sqrt{3}$ | not defined |\n\n' +
    'Memory trick: the sine row is $\\frac{\\sqrt{0}}{2}, \\frac{\\sqrt{1}}{2}, \\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{3}}{2}, \\frac{\\sqrt{4}}{2}$, and the cosine row is the same list backwards.\n\n' +
    '### Getting one ratio from another\n\n' +
    'If you know $\\sin\\theta$, find $\\cos\\theta$ from $\\cos^2\\theta = 1 - \\sin^2\\theta$, take the square root, and then **choose the sign from the quadrant**. Pythagorean triples (3-4-5, 5-12-13, 8-15-17) make the numbers come out nicely.\n\n' +
    '### Solving an equation in an interval: the method\n\n' +
    '1. Rearrange to get **one** trig function equal to a number, e.g. $\\cos x = -\\frac{1}{2}$.\n' +
    '2. Find the **reference angle**: the acute angle for the positive value (here $60^\\circ$).\n' +
    '3. Use CAST to decide which two quadrants the answers live in (cos negative: 2nd and 3rd).\n' +
    '4. Build the answers: 1st $= \\alpha$, 2nd $= 180^\\circ - \\alpha$, 3rd $= 180^\\circ + \\alpha$, 4th $= 360^\\circ - \\alpha$.\n' +
    '5. Add or subtract $360^\\circ$ (or $180^\\circ$ for tan) to find any more answers inside the interval, and check the endpoints.\n\n' +
    'Shortcut patterns for one full turn: $\\sin x = k$ gives $\\alpha$ and $180^\\circ - \\alpha$; $\\cos x = k$ gives $\\alpha$ and $360^\\circ - \\alpha$; $\\tan x = k$ gives $\\alpha$ and $\\alpha + 180^\\circ$ (here $\\alpha$ is the calculator value). If the calculator gives a negative angle (for a negative sine or tangent), add $360^\\circ$ to bring it into the interval: for example $\\sin x = -\\frac{1}{2}$ gives $\\alpha = -30^\\circ$, so the solutions are $-30^\\circ + 360^\\circ = 330^\\circ$ and $180^\\circ - (-30^\\circ) = 210^\\circ$.\n\n' +
    '**Multiple angles.** For $\\sin 2x = k$ on $0^\\circ \\le x \\le 360^\\circ$, let $u = 2x$, so $0^\\circ \\le u \\le 720^\\circ$: solve for $u$ over the bigger interval, then halve. Doubling the angle doubles the number of solutions.\n\n' +
    '### Squares and products\n\n' +
    'For $\\cos^2 x = \\frac{1}{4}$, take the square root with **both** signs and solve $\\cos x = \\frac{1}{2}$ and $\\cos x = -\\frac{1}{2}$. For a product equal to zero, such as $\\sin x \\cos x = 0$, solve each factor. **Never divide by** $\\sin x$ or $\\cos x$: that loses every solution where it is zero.',
  formulas: [
    { label: 'Pythagorean identity', tex: '\\sin^2\\theta + \\cos^2\\theta = 1', note: 'Works for every angle. Rearranged: $\\cos^2\\theta = 1 - \\sin^2\\theta$.' },
    { label: 'Tangent', tex: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}', note: 'Not defined when $\\cos\\theta = 0$.' },
    { label: 'Solutions of sin x = k in one turn', tex: 'x = \\alpha \\quad\\text{or}\\quad x = 180^\\circ - \\alpha', note: 'Here $\\alpha = \\sin^{-1} k$; in radians use $\\pi - \\alpha$. If $\\alpha$ is negative, also add $360^\\circ$ to it.' },
    { label: 'Solutions of cos x = k in one turn', tex: 'x = \\alpha \\quad\\text{or}\\quad x = 360^\\circ - \\alpha', note: 'Here $\\alpha = \\cos^{-1} k$; in radians use $2\\pi - \\alpha$.' },
    { label: 'Solutions of tan x = k in one turn', tex: 'x = \\alpha \\quad\\text{or}\\quad x = \\alpha + 180^\\circ', note: 'Tangent repeats every $180^\\circ$ ($\\pi$ radians). If $\\alpha$ is negative, use $\\alpha + 180^\\circ$ and $\\alpha + 360^\\circ$.' },
    { label: 'Degrees and radians', tex: '180^\\circ = \\pi \\text{ rad}' },
  ],
  examples: [
    {
      title: 'Finding cos from sin using the quadrant',
      problem: 'Given $\\sin\\theta = \\frac{5}{13}$ and $90^\\circ < \\theta < 180^\\circ$, find $\\cos\\theta$ and $\\tan\\theta$.',
      steps: [
        '$\\cos^2\\theta = 1 - \\left(\\frac{5}{13}\\right)^2 = 1 - \\frac{25}{169} = \\frac{144}{169}$.',
        'So $\\cos\\theta = \\pm\\frac{12}{13}$.',
        '$\\theta$ is in the second quadrant, where only sine is positive, so $\\cos\\theta = -\\frac{12}{13}$.',
        '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{5}{13} \\div \\left(-\\frac{12}{13}\\right) = -\\frac{5}{12}$.',
      ],
      answer: '$\\cos\\theta = -\\frac{12}{13}$ and $\\tan\\theta = -\\frac{5}{12}$',
    },
    {
      title: 'A basic equation with a negative value',
      problem: 'Solve $2\\sin x + \\sqrt{3} = 0$ for $0^\\circ \\le x \\le 360^\\circ$.',
      steps: [
        'Rearrange: $2\\sin x = -\\sqrt{3}$, so $\\sin x = -\\frac{\\sqrt{3}}{2}$.',
        'Reference angle: $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$, so $\\alpha = 60^\\circ$.',
        'Sine is negative in the third and fourth quadrants.',
        'Third quadrant: $x = 180^\\circ + 60^\\circ = 240^\\circ$.',
        'Fourth quadrant: $x = 360^\\circ - 60^\\circ = 300^\\circ$.',
      ],
      answer: '$x = 240^\\circ$ or $x = 300^\\circ$',
    },
    {
      title: 'A multiple angle on a shorter interval',
      problem: 'Solve $\\sin 2x = \\frac{\\sqrt{3}}{2}$ for $0^\\circ \\le x \\le 180^\\circ$.',
      steps: [
        'Let $u = 2x$. Since $0^\\circ \\le x \\le 180^\\circ$, we have $0^\\circ \\le u \\le 360^\\circ$.',
        'Solve $\\sin u = \\frac{\\sqrt{3}}{2}$: $u = 60^\\circ$ or $u = 180^\\circ - 60^\\circ = 120^\\circ$.',
        'Halve each value: $x = 30^\\circ$ or $x = 60^\\circ$.',
      ],
      answer: '$x = 30^\\circ$ or $x = 60^\\circ$',
    },
    {
      title: 'Turning sin and cos into tan',
      problem: 'Solve $\\sin x = \\cos x$ for $0 \\le x < 2\\pi$.',
      steps: [
        'If $\\cos x = 0$ then $\\sin x = \\pm 1$, so the equation fails there. It is therefore safe to divide by $\\cos x$: $\\tan x = 1$.',
        'Reference angle: $\\tan\\frac{\\pi}{4} = 1$, so it is $\\frac{\\pi}{4}$.',
        'Tangent is positive in the first and third quadrants: $x = \\frac{\\pi}{4}$ or $x = \\pi + \\frac{\\pi}{4} = \\frac{5\\pi}{4}$.',
      ],
      answer: '$x = \\frac{\\pi}{4}$ or $x = \\frac{5\\pi}{4}$',
    },
  ],
  traps: [
    'Stopping at the calculator value. Inside one full turn, $\\sin x = k$, $\\cos x = k$ and $\\tan x = k$ almost always have **two** solutions; use CAST to find the second.',
    'Using the wrong partner angle: $180^\\circ - \\alpha$ is for **sine**, $360^\\circ - \\alpha$ is for **cosine**, $\\alpha + 180^\\circ$ is for **tangent**.',
    'Treating the 2 in $\\sin 2x$ or $\\cos 2x$ as a multiplier outside: $\\sin 2x \\ne 2\\sin x$. For $\\sin 2x = k$, solve for $2x$ over the doubled interval and only then halve.',
    'Dividing both sides by $\\sin x$ or $\\cos x$. This silently deletes every solution where that function is zero; factorise instead.',
    'Forgetting the sign when finding one ratio from another: $\\cos\\theta = \\pm\\sqrt{1 - \\sin^2\\theta}$, and the quadrant decides which sign.',
    'Ignoring the interval: check whether the ends are included ($\\le$) or excluded ($<$), and whether the answer should be in degrees or radians.',
  ],
  examTip:
    'In the multiple-choice exam the options are usually lists of angles, so **plug the options back in** instead of solving from scratch: with a calculator in the right mode (degrees or radians!), test one angle from each option and cross out any option containing an angle that fails. Count first: a basic equation over one full turn usually has 2 solutions, and $\\sin 2x$ or $\\cos 2x$ over one turn has 4, so options with the wrong number of angles often go immediately. Check signs with CAST (an option putting a negative-sine answer in the first or second quadrant is wrong) and remember $-1 \\le \\sin x, \\cos x \\le 1$: any value outside this range must be rejected.',
};
