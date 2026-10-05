import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'trig-equations',
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
    '### Double-angle formulas\n\n' +
    'These rewrite $\\sin 2x$ and $\\cos 2x$ using $\\sin x$ and $\\cos x$:\n\n' +
    '- $\\sin 2x = 2\\sin x\\cos x$\n' +
    '- $\\cos 2x = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x$\n\n' +
    'Pick the version of $\\cos 2x$ that matches the rest of the equation: if the equation also has $\\cos x$, use $2\\cos^2 x - 1$; if it has $\\sin x$, use $1 - 2\\sin^2 x$. Remember $\\sin 2x$ is **not** $2\\sin x$.\n\n' +
    '### Solving an equation in an interval: the method\n\n' +
    '1. Rearrange to get **one** trig function equal to a number, e.g. $\\cos x = -\\frac{1}{2}$.\n' +
    '2. Find the **reference angle**: the acute angle for the positive value (here $60^\\circ$).\n' +
    '3. Use CAST to decide which two quadrants the answers live in (cos negative: 2nd and 3rd).\n' +
    '4. Build the answers: 1st $= \\alpha$, 2nd $= 180^\\circ - \\alpha$, 3rd $= 180^\\circ + \\alpha$, 4th $= 360^\\circ - \\alpha$.\n' +
    '5. Add or subtract $360^\\circ$ (or $180^\\circ$ for tan) to find any more answers inside the interval, and check the endpoints.\n\n' +
    'Shortcut patterns for one full turn: $\\sin x = k$ gives $\\alpha$ and $180^\\circ - \\alpha$; $\\cos x = k$ gives $\\alpha$ and $360^\\circ - \\alpha$; $\\tan x = k$ gives $\\alpha$ and $\\alpha + 180^\\circ$ (here $\\alpha$ is the calculator value). If the calculator gives a negative angle (for a negative sine or tangent), add $360^\\circ$ to bring it into the interval: for example $\\sin x = -\\frac{1}{2}$ gives $\\alpha = -30^\\circ$, so the solutions are $-30^\\circ + 360^\\circ = 330^\\circ$ and $180^\\circ - (-30^\\circ) = 210^\\circ$.\n\n' +
    '**Multiple angles.** For $\\sin 2x = k$ on $0^\\circ \\le x \\le 360^\\circ$, let $u = 2x$, so $0^\\circ \\le u \\le 720^\\circ$: solve for $u$ over the bigger interval, then halve. Doubling the angle doubles the number of solutions.\n\n' +
    '### Equations that are quadratics in disguise\n\n' +
    '$2\\sin^2 x - \\sin x - 1 = 0$ is just $2s^2 - s - 1 = 0$ with $s = \\sin x$. Factorise, get values of $\\sin x$, throw away any outside $[-1, 1]$, then solve each simple equation. If the equation mixes $\\sin^2 x$ and $\\cos x$, use $\\sin^2 x = 1 - \\cos^2 x$ first so only one function is left. **Never divide by** $\\sin x$ or $\\cos x$ (or $1 + \\cos x$): factorise instead, or you lose solutions.\n\n' +
    '### Systems of trig equations (like the official sample)\n\n' +
    'In a system such as $2\\sin\\alpha - \\cos\\beta + 3\\tan\\gamma = 3$ (with two more equations), the trig expressions are the real unknowns. Write $u = \\sin\\alpha$, $v = \\cos\\beta$, $w = \\tan\\gamma$, solve the **linear** system by elimination (or the calculator), then turn each value into an angle in its given range. Often it is faster to plug the four options straight into the equations.',
  formulas: [
    { label: 'Pythagorean identity', tex: '\\sin^2\\theta + \\cos^2\\theta = 1', note: 'Works for every angle. Rearranged: $\\cos^2\\theta = 1 - \\sin^2\\theta$.' },
    { label: 'Tangent', tex: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}', note: 'Not defined when $\\cos\\theta = 0$.' },
    { label: 'Double angle (sine)', tex: '\\sin 2\\theta = 2\\sin\\theta\\cos\\theta' },
    { label: 'Double angle (cosine)', tex: '\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta', note: 'Choose the form that matches the rest of the equation.' },
    { label: 'Solutions of sin x = k in one turn', tex: 'x = \\alpha \\quad\\text{or}\\quad x = 180^\\circ - \\alpha', note: 'Here $\\alpha = \\sin^{-1} k$; in radians use $\\pi - \\alpha$. If $\\alpha$ is negative, also add $360^\\circ$ to it.' },
    { label: 'Solutions of cos x = k in one turn', tex: 'x = \\alpha \\quad\\text{or}\\quad x = 360^\\circ - \\alpha', note: 'Here $\\alpha = \\cos^{-1} k$; in radians use $2\\pi - \\alpha$.' },
    { label: 'Solutions of tan x = k in one turn', tex: 'x = \\alpha \\quad\\text{or}\\quad x = \\alpha + 180^\\circ', note: 'Tangent repeats every $180^\\circ$ ($\\pi$ radians). If $\\alpha$ is negative, use $\\alpha + 180^\\circ$ and $\\alpha + 360^\\circ$.' },
    { label: 'Degrees and radians', tex: '180^\\circ = \\pi \\text{ rad}' },
    { label: 'Square of a sum', tex: '(\\sin x + \\cos x)^2 = 1 + \\sin 2x' },
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
      title: 'A double-angle equation that becomes a quadratic',
      problem: 'Solve $\\cos 2x + \\sin x = 0$ for $0 \\le x \\le 2\\pi$.',
      steps: [
        'The equation already contains $\\sin x$, so use $\\cos 2x = 1 - 2\\sin^2 x$: $1 - 2\\sin^2 x + \\sin x = 0$.',
        'Multiply by $-1$: $2\\sin^2 x - \\sin x - 1 = 0$.',
        'Factorise with $s = \\sin x$: $(2s + 1)(s - 1) = 0$, so $\\sin x = 1$ or $\\sin x = -\\frac{1}{2}$.',
        '$\\sin x = 1$: $x = \\frac{\\pi}{2}$.',
        '$\\sin x = -\\frac{1}{2}$: reference angle $\\frac{\\pi}{6}$, third and fourth quadrants: $x = \\pi + \\frac{\\pi}{6} = \\frac{7\\pi}{6}$ or $x = 2\\pi - \\frac{\\pi}{6} = \\frac{11\\pi}{6}$.',
      ],
      answer: '$x = \\frac{\\pi}{2}$, $\\frac{7\\pi}{6}$ or $\\frac{11\\pi}{6}$',
    },
    {
      title: 'A system in sin, cos and tan (exam style)',
      problem:
        'Find $(\\alpha, \\beta, \\gamma)$ with $0 \\le \\alpha \\le \\frac{\\pi}{2}$, $0 \\le \\beta \\le \\pi$, $0 \\le \\gamma < \\frac{\\pi}{2}$ such that $\\sin\\alpha + \\cos\\beta + \\tan\\gamma = 1$, $2\\sin\\alpha - \\cos\\beta + \\tan\\gamma = 4$ and $\\sin\\alpha + 2\\cos\\beta - \\tan\\gamma = -2$.',
      steps: [
        'Let $u = \\sin\\alpha$, $v = \\cos\\beta$, $w = \\tan\\gamma$: (1) $u + v + w = 1$, (2) $2u - v + w = 4$, (3) $u + 2v - w = -2$.',
        'Add (1) and (3) to remove $w$: $2u + 3v = -1$.',
        'Add (2) and (3) to remove $w$: $3u + v = 2$, so $v = 2 - 3u$.',
        'Substitute: $2u + 3(2 - 3u) = -1$, so $2u + 6 - 9u = -1$, so $-7u = -7$ and $u = 1$.',
        'Then $v = 2 - 3 = -1$, and from (1): $w = 1 - u - v = 1 - 1 + 1 = 1$.',
        'Check in (2): $2 \\times 1 - (-1) + 1 = 4$. Correct.',
        'Convert: $\\sin\\alpha = 1$ gives $\\alpha = \\frac{\\pi}{2}$; $\\cos\\beta = -1$ gives $\\beta = \\pi$; $\\tan\\gamma = 1$ gives $\\gamma = \\frac{\\pi}{4}$.',
      ],
      answer: '$\\left(\\frac{\\pi}{2}, \\pi, \\frac{\\pi}{4}\\right)$',
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
    'In the multiple-choice exam the options are usually lists of angles, so **plug the options back in** instead of solving from scratch: with a calculator in the right mode (degrees or radians!), test one angle from each option and cross out any option containing an angle that fails. Count first: a basic equation over one full turn usually has 2 solutions, $\\sin 2x$ or $\\cos 2x$ over one turn has 4, and a quadratic in $\\sin x$ can have up to 4 (often 3, when one root is $\\pm 1$), so options with the wrong number of angles often go immediately. Check signs with CAST (an option putting a negative-sine answer in the first or second quadrant is wrong) and remember $-1 \\le \\sin x, \\cos x \\le 1$: any value outside this range must be rejected. For systems like the official sample, substituting the three angles of each option into the first equation alone usually leaves only one survivor in under 30 seconds.',
};
