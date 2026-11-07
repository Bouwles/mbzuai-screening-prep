import type { StaticQuestion } from '../../../types';
import { round } from '../../../lib/mathx';

// ---- helpers used only by the answer checks (re-derive every answer numerically) ----
type Fn = (x: number) => number;
const H = 1e-5;
/** Central-difference numerical derivative. */
const nd = (f: Fn, x: number): number => (f(x + H) - f(x - H)) / (2 * H);
/** Root of g on [lo, hi] by bisection (g must change sign). */
function bisect(g: Fn, lo: number, hi: number): number {
  let gLo = g(lo);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const gMid = g(mid);
    if (Math.sign(gMid) === Math.sign(gLo)) {
      lo = mid;
      gLo = gMid;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}
/** Largest value of f on the grid lo, lo + 1/scale, ..., hi (integer-indexed so endpoints are hit exactly). */
function gridMax(f: Fn, lo: number, hi: number, scale = 1000): number {
  let best = -Infinity;
  for (let i = Math.round(lo * scale); i <= Math.round(hi * scale); i++) best = Math.max(best, f(i / scale));
  return best;
}
/**
 * Where f is decreasing, found numerically: locate the sign changes of the numerical
 * derivative on [-20, 20], then test the sign of f' in each gap. Returns e.g. "x<2" or "1<x<2".
 */
function decreasingSet(f: Fn): string {
  const fp: Fn = (x) => nd(f, x);
  const step = 1 / 1024;
  const roots: number[] = [];
  for (let x = -20; x < 20; x += step) {
    if (Math.sign(fp(x)) !== Math.sign(fp(x + step))) {
      const r = round(bisect(fp, x, x + step), 6);
      if (!roots.includes(r)) roots.push(r);
    }
  }
  const pts = [-Infinity, ...roots, Infinity];
  const parts: string[] = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const test = a === -Infinity ? b - 1 : b === Infinity ? a + 1 : (a + b) / 2;
    if (fp(test) < 0) parts.push(a === -Infinity ? `x<${b}` : b === Infinity ? `x>${a}` : `${a}<x<${b}`);
  }
  return parts.join(' or ');
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'derivative-applications-001',
    subtopic: 'derivative-applications',
    difficulty: 'foundation',
    stem: 'What is the gradient of the tangent to the curve $y = x^{3} - 2x$ at the point where $x = 2$?',
    options: ['$4$', '$12$', '$10$', '$22$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How steep is this curve at $x = 2$?',
      solution:
        'A **tangent** is the straight line that just touches a curve at one point. Its gradient is the same as the curve\'s gradient at that point, and $\\frac{dy}{dx}$ gives us that.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1). $x^{3}$ becomes $3x^{2}$, and $-2x$ becomes $-2$. So $\\frac{dy}{dx} = 3x^{2} - 2$.\n\n' +
        'Substitute $x = 2$, doing the power first: $3 \\times 2^{2} - 2 = 3 \\times 4 - 2 = 12 - 2 = 10$.',
      conclusion: 'The gradient formula gives $12 - 2$ at $x = 2$, so the tangent\'s gradient is $10$.',
      whyWrong: [
        '$4$ is the **$y$-value** at $x = 2$ (because $2^{3} - 2(2) = 4$), not the gradient. You must differentiate first.',
        'This forgets that the derivative of $-2x$ is $-2$, and uses only $3x^{2} = 12$.',
        null,
        'This differentiates $x^{3}$ as $3x^{3}$ (keeping the old power), giving $3(8) - 2 = 22$. The power drops by one: $x^{3}$ becomes $3x^{2}$.',
      ],
      keyIdea: 'For the gradient of a tangent at a point: differentiate, then substitute the $x$ value into $\\frac{dy}{dx}$. Putting $x$ into $y$ gives the height instead.',
    },
    check: { optionValues: [4, 12, 10, 22], compute: () => nd((x) => x ** 3 - 2 * x, 2) },
  },
  {
    id: 'derivative-applications-002',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'The curve $y = x^{2} - 6x + 5$ has one stationary point. What are its coordinates?',
    options: ['$(3, -4)$', '$(-3, 32)$', '$(3, 4)$', '$(1, 0)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'At what point on this curve is the gradient zero?',
      solution:
        'A **stationary point** is where the curve is flat for a moment, so its gradient is 0. That means we need to solve $\\frac{dy}{dx} = 0$.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1): $\\frac{dy}{dx} = 2x - 6$.\n\n' +
        'Set this to 0 and solve. From $2x - 6 = 0$, add 6 to both sides: $2x = 6$. Divide by 2: $x = 3$.\n\n' +
        'The question wants coordinates, so we also need $y$. Put $x = 3$ into the original curve: $y = 3^{2} - 6 \\times 3 + 5 = 9 - 18 + 5 = -4$. So the point is $(3, -4)$.',
      conclusion: 'The gradient is 0 at $x = 3$, where $y = -4$, so the stationary point is $(3, -4)$.',
      whyWrong: [
        null,
        'This comes from a sign slip when solving: $2x - 6 = 0$ gives $x = 3$, not $x = -3$.',
        'The $x$-value is right but the arithmetic for $y$ slipped: $9 - 18 + 5 = -4$, not $4$.',
        '$(1, 0)$ is where the curve crosses the $x$-axis ($y = 0$). Stationary points come from $\\frac{dy}{dx} = 0$, not from $y = 0$.',
      ],
      keyIdea: 'To find a stationary point: solve $\\frac{dy}{dx} = 0$ to get $x$, then put that $x$ into the original equation, not the derivative, to get $y$.',
    },
    check: {
      optionValues: ['3,-4', '-3,32', '3,4', '1,0'],
      compute: () => {
        const f: Fn = (x) => x ** 2 - 6 * x + 5;
        const x = bisect((t) => nd(f, t), -10, 10);
        return `${round(x, 6)},${round(f(x), 6)}`;
      },
    },
  },
  {
    id: 'derivative-applications-003',
    subtopic: 'derivative-applications',
    difficulty: 'foundation',
    stem: 'For which values of $x$ is the function $f(x) = x^{2} - 4x$ **decreasing**?',
    options: ['$x > 2$', '$x < 2$', '$0 < x < 4$', '$x < 0$'],
    correctIndex: 1,
    markScheme: {
      asking: 'For which $x$ values does the graph of $f$ go downhill?',
      solution:
        'A function is **decreasing** where its graph goes downhill as you move right. Downhill means a negative gradient, so we need $f\'(x) < 0$.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1): $f\'(x) = 2x - 4$.\n\n' +
        'Solve $2x - 4 < 0$. Add 4 to both sides: $2x < 4$. Divide by 2: $x < 2$.',
      conclusion: 'The gradient is negative at $x = 0$, where it is $-4$, and positive at $x = 3$, where it is 2. It changes at 2, so the answer is $x < 2$.',
      whyWrong: [
        'This is where $f\'(x) > 0$, which is where $f$ is **increasing**, not decreasing.',
        null,
        'This is where $f(x) < 0$, where the graph is **below the $x$-axis**. Decreasing is about the gradient $f\'(x)$ being negative, not the value $f(x)$.',
        'This forgets to differentiate the $-4x$ term (its derivative is $-4$), solving $2x < 0$ instead of $2x - 4 < 0$.',
      ],
      keyIdea: 'Decreasing means $f\'(x) < 0$, and increasing means $f\'(x) > 0$. Differentiate, then solve that inequality. Don\'t use $f(x) < 0$, which only says the graph is below the axis.',
    },
    check: { optionValues: ['x>2', 'x<2', '0<x<4', 'x<0'], compute: () => decreasingSet((x) => x ** 2 - 4 * x) },
  },
  {
    id: 'derivative-applications-004',
    subtopic: 'derivative-applications',
    difficulty: 'foundation',
    stem: 'The height of a ball after $t$ seconds is $h = 20t - 5t^{2}$ metres. Find its velocity (the rate of change of height) at $t = 1$.',
    options: ['$15$ m/s', '$30$ m/s', '$-10$ m/s', '$10$ m/s'],
    correctIndex: 3,
    markScheme: {
      asking: 'How fast is the ball\'s height changing after 1 second?',
      solution:
        'Velocity is the rate of change of height: how fast $h$ changes as the time $t$ passes. A rate of change is a derivative, so we need $\\frac{dh}{dt}$.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1), with $t$ playing the part of $x$. $20t$ becomes 20, and $-5t^{2}$ becomes $-10t$. So $\\frac{dh}{dt} = 20 - 10t$.\n\n' +
        'Substitute $t = 1$: $20 - 10 \\times 1 = 20 - 10 = 10$. Height is in metres and time in seconds, so the velocity is 10 m/s.',
      conclusion: 'At $t = 1$ the height is changing at $20 - 10$ metres per second, so the velocity is $10$ m/s.',
      whyWrong: [
        '$15$ m is the **height** at $t = 1$ ($20 - 5 = 15$), not the rate of change of height.',
        'This drops the minus sign when differentiating $-5t^{2}$, getting $20 + 10t = 30$.',
        '$-10$ is the **second** derivative $\\frac{d^{2}h}{dt^{2}}$ (the acceleration), not the velocity.',
        null,
      ],
      keyIdea: 'Rate of change means derivative. Differentiate the height or position formula to get velocity, then substitute the time. Differentiate once more to get acceleration.',
    },
    check: { optionValues: [15, 30, -10, 10], compute: () => nd((t) => 20 * t - 5 * t ** 2, 1) },
  },
  {
    id: 'derivative-applications-005',
    subtopic: 'derivative-applications',
    difficulty: 'foundation',
    stem: 'A function $f$ has a stationary point at $x = a$, and $f\'\'(a) = -3$. What kind of stationary point is it?',
    options: ['A local maximum', 'A local minimum', 'A point of inflection', 'It cannot be a stationary point, because $f\'\'(a) \\ne 0$'],
    correctIndex: 0,
    markScheme: {
      asking: 'If the second derivative is negative at a flat point, what shape is the curve there?',
      solution:
        'A **stationary point** is where the curve is flat, so $f\'(a) = 0$. The second derivative $f\'\'$ tells us how the gradient itself is changing as $x$ increases.\n\n' +
        'A negative $f\'\'(a)$ means the gradient is falling as we pass through $a$. It goes from positive (uphill), through 0 (flat), to negative (downhill).\n\n' +
        'Here $f\'\'(a) = -3$, which is negative, so the curve goes uphill, flat, then downhill. That shape is the top of a hill, which is called a **local maximum**.',
      conclusion: 'A negative second derivative at a flat point means the curve bends downwards there, so it is a local maximum.',
      whyWrong: [
        null,
        'This mixes up the signs. A **positive** second derivative means a minimum and a negative one means a maximum (think of the hill $y = -x^{2}$, which has $y\'\' = -2$).',
        'A point of inflection needs the second derivative to be zero (and change sign). Here $f\'\'(a) = -3$, which is not zero.',
        'Stationary means $f\'(a) = 0$; it says nothing about $f\'\'(a)$. The value of $f\'\'(a)$ only tells us the **type** of stationary point.',
      ],
      keyIdea: 'Second derivative test at a stationary point: $f\'\' < 0$ means a maximum (the curve bends like a frown), and $f\'\' > 0$ means a minimum (it bends like a smile). If $f\'\' = 0$, the test can\'t decide.',
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'derivative-applications-006',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'Find the equation of the tangent to the curve $y = x^{2} + 3x$ at the point where $x = 1$.',
    options: ['$y = 5x + 4$', '$y = 5x - 1$', '$y = 2x + 3$', '$y = -\\frac{1}{5}x + \\frac{21}{5}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the straight line that just touches this curve at $x = 1$?',
      solution:
        'A straight line needs a point and a gradient. A **tangent** touches the curve and has the same gradient as the curve there, so both come from the curve at $x = 1$.\n\n' +
        'For the point, put $x = 1$ into the curve: $y = 1^{2} + 3 \\times 1 = 4$. So the tangent passes through $(1, 4)$.\n\n' +
        'For the gradient, differentiate using the power rule (multiply by the power, then lower the power by 1): $\\frac{dy}{dx} = 2x + 3$. At $x = 1$ this is $2 \\times 1 + 3 = 5$.\n\n' +
        'Use the line formula $y - y_1 = m(x - x_1)$, where $m$ is the gradient and $(x_1, y_1)$ is the point: $y - 4 = 5(x - 1)$.\n\n' +
        'Multiply out the bracket: $y - 4 = 5x - 5$. Add 4 to both sides: $y = 5x - 1$.',
      conclusion: 'Setting $x = 1$ gives $y = 4$, so the line passes through the point with gradient 5. The tangent is $y = 5x - 1$.',
      whyWrong: [
        'This uses the $y$-coordinate $4$ as the $y$-intercept. The point $(1, 4)$ is not on the $y$-axis, so you must use $y - 4 = 5(x - 1)$ to find the intercept.',
        null,
        'This is just the derivative $\\frac{dy}{dx} = 2x + 3$ written as a line. The tangent needs the gradient **at** $x = 1$ (the number $5$) and must pass through $(1, 4)$.',
        'This is the **normal** (gradient $-\\frac{1}{5}$, perpendicular to the tangent), not the tangent.',
      ],
      keyIdea: 'Tangent at $x = a$: find $y$ at $a$ from the curve, find the gradient by putting $a$ into $\\frac{dy}{dx}$, then use $y - y_1 = m(x - x_1)$ and rearrange.',
    },
    check: {
      // each line evaluated at x = 2
      optionValues: [14, 9, 7, 19 / 5],
      compute: () => {
        const f: Fn = (x) => x ** 2 + 3 * x;
        return f(1) + nd(f, 1) * (2 - 1);
      },
    },
  },
  {
    id: 'derivative-applications-007',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'Find the equation of the **normal** to the curve $y = x^{3}$ at the point $(1, 1)$.',
    options: ['$y = 3x - 2$', '$y = -3x + 4$', '$y = \\frac{1}{3}x + \\frac{2}{3}$', '$y = -\\frac{1}{3}x + \\frac{4}{3}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the straight line through $(1, 1)$ that is at right angles to the curve?',
      solution:
        'The **normal** is the line through the point at right angles to the tangent. So we find the tangent\'s gradient first.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1): $\\frac{dy}{dx} = 3x^{2}$. At $x = 1$ this is $3 \\times 1^{2} = 3$. So the tangent\'s gradient is 3.\n\n' +
        'Two perpendicular lines have gradients that multiply to $-1$. So the normal\'s gradient $m$ must satisfy $m \\times 3 = -1$. Dividing by 3 gives $m = -\\frac{1}{3}$.\n\n' +
        'Use the line formula $y - y_1 = m(x - x_1)$ with the point $(1, 1)$: $y - 1 = -\\frac{1}{3}(x - 1)$.\n\n' +
        'Multiply out the bracket: $y - 1 = -\\frac{1}{3}x + \\frac{1}{3}$. Add 1 to both sides, using $\\frac{1}{3} + 1 = \\frac{4}{3}$: $y = -\\frac{1}{3}x + \\frac{4}{3}$.',
      conclusion: 'The line through $(1, 1)$ with gradient $-\\frac{1}{3}$ is $y = -\\frac{1}{3}x + \\frac{4}{3}$.',
      whyWrong: [
        'This is the **tangent** at $(1, 1)$ (gradient $3$), not the normal.',
        'This takes the negative of $3$ but forgets to take the reciprocal. The normal gradient must satisfy $m \\times 3 = -1$, so $m = -\\frac{1}{3}$, not $-3$.',
        'This takes the reciprocal of $3$ but forgets the minus sign. Perpendicular gradients multiply to $-1$, but $3 \\times \\frac{1}{3} = 1$.',
        null,
      ],
      keyIdea: 'Normal at a point: find the tangent\'s gradient $m$ from $\\frac{dy}{dx}$, then flip it and change its sign to get $-\\frac{1}{m}$. Use $y - y_1 = m(x - x_1)$ with that new gradient.',
    },
    check: {
      // each line evaluated at x = 4
      optionValues: [10, -8, 2, 0],
      compute: () => {
        const f: Fn = (x) => x ** 3;
        return f(1) - (1 / nd(f, 1)) * (4 - 1);
      },
    },
  },
  {
    id: 'derivative-applications-008',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'What is the **maximum** value of $f(x) = x^{3} - 3x$ on the interval $0 \\le x \\le 3$?',
    options: ['$2$', '$-2$', '$18$', '$1$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the largest value $f$ reaches when $x$ stays between 0 and 3?',
      solution:
        'On an interval with ends like $0 \\le x \\le 3$, the largest value can be at a stationary point inside the interval, or at an end. So we have to check both kinds.\n\n' +
        'Find the stationary points, where the gradient is 0. Differentiating with the power rule (multiply by the power, then lower the power by 1) gives $f\'(x) = 3x^{2} - 3$. Setting that to 0 gives $3x^{2} = 3$, so $x^{2} = 1$, which means $x = 1$ or $x = -1$.\n\n' +
        '$x = -1$ is outside the interval, so we ignore it. That leaves $x = 1$ and the two ends, $x = 0$ and $x = 3$.\n\n' +
        'Work out $f$ at each one, then pick the largest, which is 18.\n\n| $x$ | Working | $f(x)$ |\n|---|---|---|\n| 0 | $0^{3} - 3 \\times 0$ | 0 |\n| 1 | $1^{3} - 3 \\times 1$ | $-2$ |\n| 3 | $3^{3} - 3 \\times 3 = 27 - 9$ | 18 |',
      conclusion: 'Of the values 0, $-2$ and 18, the largest comes at the end $x = 3$, so the maximum is $18$.',
      whyWrong: [
        '$2 = f(-1)$ is a local maximum value, but $x = -1$ is **outside** the interval $0 \\le x \\le 3$, so it does not count.',
        '$-2 = f(1)$ is the value at the stationary point inside the interval, but it is a local **minimum**. On a closed interval you must also check the endpoints.',
        null,
        '$1$ is the $x$-coordinate of the stationary point, not a value of $f$, and that stationary point is a minimum anyway.',
      ],
      keyIdea: 'For the largest or smallest value on an interval: make a table of $f$ at every stationary point inside the interval and at both ends, then pick from it. Ignore stationary points outside the interval.',
    },
    check: { optionValues: [2, -2, 18, 1], compute: () => gridMax((x) => x ** 3 - 3 * x, 0, 3) },
  },
  {
    id: 'derivative-applications-009',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'Find the coordinates of the local **maximum** of the curve $y = x^{3} - 6x^{2} + 9x + 1$.',
    options: ['$(1, 5)$', '$(3, 1)$', '$(2, 3)$', '$(-1, -15)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Where is the top of the hill on this curve?',
      solution:
        'A **local maximum** is the top of a hill on the curve. The gradient is 0 there, so we start by solving $\\frac{dy}{dx} = 0$.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1): $\\frac{dy}{dx} = 3x^{2} - 12x + 9$.\n\n' +
        'Set it to 0 and divide everything by 3: $x^{2} - 4x + 3 = 0$. Two numbers that multiply to 3 and add to $-4$ are $-1$ and $-3$. So $(x - 1)(x - 3) = 0$, giving $x = 1$ or $x = 3$.\n\n' +
        'To see which is the hilltop, differentiate again to get the second derivative, $\\frac{d^{2}y}{dx^{2}} = 6x - 12$. At a flat point, negative means a maximum, and positive means a minimum.\n\n' +
        'At $x = 1$: $6 \\times 1 - 12 = -6$, which is negative, so this is the maximum. At $x = 3$: $6 \\times 3 - 12 = 6$, which is positive, so that one is a minimum.\n\n' +
        'Get $y$ at $x = 1$ from the original curve: $y = 1^{3} - 6 \\times 1^{2} + 9 \\times 1 + 1 = 1 - 6 + 9 + 1 = 5$. So the local maximum is $(1, 5)$.',
      conclusion: 'Only $x = 1$ has a negative second derivative, and the curve\'s height there is 5, so the local maximum is $(1, 5)$.',
      whyWrong: [
        null,
        '$(3, 1)$ is the other stationary point, but $\\frac{d^{2}y}{dx^{2}} = 6 > 0$ there, so it is the local **minimum**.',
        '$(2, 3)$ is where $\\frac{d^{2}y}{dx^{2}} = 0$ (the point of inflection). The gradient there is $3(1)(-1) = -3$, not $0$, so it is not even stationary.',
        'This factorises with the wrong signs, as $3(x + 1)(x + 3)$, and uses $x = -1$. Check: $3(-1)^{2} - 12(-1) + 9 = 24 \\ne 0$, so $x = -1$ is not stationary.',
      ],
      keyIdea: 'To find and classify: solve $\\frac{dy}{dx} = 0$, test each $x$ in the second derivative (negative is a maximum, positive is a minimum), then get $y$ from the original equation.',
    },
    check: {
      optionValues: ['1,5', '3,1', '2,3', '-1,-15'],
      compute: () => {
        const f: Fn = (x) => x ** 3 - 6 * x ** 2 + 9 * x + 1;
        for (let i = -5000; i <= 5000; i++) {
          const x = i / 1000;
          if (f(x) > f(x - 0.001) && f(x) > f(x + 0.001)) return `${round(x, 3)},${round(f(x), 3)}`;
        }
        return 'none';
      },
    },
  },
  {
    id: 'derivative-applications-010',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'A rectangular pen against a straight wall uses $60$ m of fencing for its other **three** sides. What is the largest possible area of the pen?',
    options: ['$225 \\text{ m}^{2}$', '$450 \\text{ m}^{2}$', '$400 \\text{ m}^{2}$', '$900 \\text{ m}^{2}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'With 60 m of fence and a wall as one side, what is the biggest area you can enclose?',
      solution:
        'Choose a letter. Let $x$ be the length of each of the two sides that stick out from the wall. The third side, parallel to the wall, uses the fence that is left, which is $60 - 2x$ metres.\n\n' +
        'Area is length times width, so $A = x(60 - 2x) = 60x - 2x^{2}$. We want the largest value of $A$.\n\n' +
        'At the largest value, the gradient of $A$ is 0. Differentiating with the power rule (multiply by the power, then lower the power by 1) gives $\\frac{dA}{dx} = 60 - 4x$.\n\n' +
        'Set it to 0: $60 - 4x = 0$. Add $4x$ to both sides: $4x = 60$. Divide by 4: $x = 15$.\n\n' +
        'Make sure this is a maximum. Differentiating again gives the second derivative, $\\frac{d^{2}A}{dx^{2}} = -4$, which is negative, so this is the top of a hill.\n\n' +
        'The side along the wall is $60 - 2 \\times 15 = 30$. So the area is $15 \\times 30 = 450 \\text{ m}^{2}$.',
      conclusion: 'The best pen measures 15 m by 30 m, so the largest area is $450 \\text{ m}^{2}$.',
      whyWrong: [
        'This fences all **four** sides: a $15 \\times 15$ square uses all $60$ m. With the wall as one side you only fence three sides, so you can do better.',
        null,
        'This assumes the three fenced sides are equal ($20$ m each), giving $20 \\times 20$. The best shape has the side along the wall twice as long as the other two.',
        'This writes the parallel side as $60 - x$ instead of $60 - 2x$, forgetting there are **two** sides of length $x$. Then $x = 30$ and $A = 30 \\times 30 = 900$, which would need $90$ m of fencing.',
      ],
      keyIdea: 'Use the fixed total, here the fencing, to write the quantity with only one letter. Differentiate, set the derivative to 0 and solve. Confirm the type with the second derivative, then substitute back.',
    },
    check: { optionValues: [225, 450, 400, 900], compute: () => gridMax((x) => x * (60 - 2 * x), 0, 30) },
  },
  {
    id: 'derivative-applications-012',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'On which interval is the function $f(x) = 2x^{3} - 9x^{2} + 12x$ decreasing?',
    options: ['$x < 1$ or $x > 2$', '$-2 < x < -1$', '$1 < x < 2$', '$x > \\frac{3}{2}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Between which $x$ values does the graph of $f$ go downhill?',
      solution:
        'Decreasing means the graph goes downhill as you move right, so the gradient is negative. We need $f\'(x) < 0$.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1): $f\'(x) = 6x^{2} - 18x + 12$.\n\n' +
        'Factorise. First take out the common factor 6: $6(x^{2} - 3x + 2)$. Two numbers that multiply to 2 and add to $-3$ are $-1$ and $-2$. So $f\'(x) = 6(x - 1)(x - 2)$.\n\n' +
        'The gradient is 0 at $x = 1$ and $x = 2$. These split the number line into three parts, so test one value in each. Only the middle part is negative, so $f$ is decreasing on $1 < x < 2$.\n\n| Part | Test value | $6(x - 1)(x - 2)$ | Sign |\n|---|---|---|---|\n| $x < 1$ | $x = 0$ | $6(-1)(-2) = 12$ | positive |\n| $1 < x < 2$ | $x = 1.5$ | $6(0.5)(-0.5) = -1.5$ | negative |\n| $x > 2$ | $x = 3$ | $6(2)(1) = 12$ | positive |',
      conclusion: 'The gradient is negative only between its two zeros, so the interval is $1 < x < 2$.',
      whyWrong: [
        'This is where $f\'(x) > 0$, which is where $f$ is **increasing**.',
        'This factorises with the wrong signs, as $6(x + 1)(x + 2)$. Expanding that gives $6x^{2} + 18x + 12$, not $6x^{2} - 18x + 12$.',
        null,
        'This solves $f\'\'(x) = 12x - 18 > 0$. The second derivative tells you how the curve bends (concavity), not whether $f$ is increasing or decreasing.',
      ],
      keyIdea: 'To find where $f$ rises or falls, factorise $f\'(x)$ and mark its zeros on a number line. Test one value in each part. Negative means decreasing, positive means increasing.',
    },
    check: {
      optionValues: ['x<1 or x>2', '-2<x<-1', '1<x<2', 'x>1.5'],
      compute: () => decreasingSet((x) => 2 * x ** 3 - 9 * x ** 2 + 12 * x),
    },
  },
  {
    id: 'derivative-applications-013',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'At which value of $x$ is the tangent to the curve $y = x^{2} - 5x + 2$ **parallel** to the line $y = 3x + 1$?',
    options: ['$x = 4$', '$x = 3$', '$x = 8$', '$x = \\frac{7}{3}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'At what $x$ does this curve have the same gradient as the line $y = 3x + 1$?',
      solution:
        '**Parallel** lines have the same gradient. So the tangent must have the same gradient as $y = 3x + 1$.\n\n' +
        'A line written as $y = mx + c$ has gradient $m$, so this line\'s gradient is 3. The $+1$ only says where it crosses the $y$-axis.\n\n' +
        'The tangent\'s gradient at any point on the curve comes from differentiating with the power rule (multiply by the power, then lower the power by 1): $\\frac{dy}{dx} = 2x - 5$.\n\n' +
        'Make them equal: $2x - 5 = 3$. Add 5 to both sides: $2x = 8$. Divide by 2: $x = 4$.',
      conclusion: 'At this point the curve\'s gradient is $2 \\times 4 - 5 = 3$, matching the line, so the answer is $x = 4$.',
      whyWrong: [
        null,
        'This uses the line\'s $y$-intercept $1$ instead of its gradient: $2x - 5 = 1$ gives $x = 3$.',
        'This reaches $2x = 8$ but forgets to divide by $2$.',
        'This uses the **perpendicular** gradient $-\\frac{1}{3}$: $2x - 5 = -\\frac{1}{3}$ gives $x = \\frac{7}{3}$. Parallel means equal gradients.',
      ],
      keyIdea: 'For a tangent parallel to a given line: read the line\'s gradient $m$, then solve $\\frac{dy}{dx} = m$. For a tangent perpendicular to it, solve $\\frac{dy}{dx} = -\\frac{1}{m}$ instead.',
    },
    check: {
      optionValues: [4, 3, 8, 7 / 3],
      compute: () => bisect((x) => nd((t) => t ** 2 - 5 * t + 2, x) - 3, -10, 10),
    },
  },
  {
    id: 'derivative-applications-015',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'The curve $y = ax^{3} + bx$ has a stationary point at $(1, -4)$. What are the values of $a$ and $b$?',
    options: ['$a = -2$, $b = 2$', '$a = -2$, $b = 6$', '$a = 0$, $b = -4$', '$a = 2$, $b = -6$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What must $a$ and $b$ be for the curve to pass through $(1, -4)$ and be flat there?',
      solution:
        'We have two unknowns, so we need two equations. The stationary point gives us both: the point is on the curve, and the gradient there is 0.\n\n' +
        'The point is on the curve, so substitute $x = 1$ and $y = -4$ into $y = ax^{3} + bx$. This gives $-4 = a \\times 1^{3} + b \\times 1$, so $a + b = -4$.\n\n' +
        'The gradient is 0. Differentiate using the power rule (multiply by the power, then lower the power by 1), treating $a$ and $b$ as ordinary numbers: $\\frac{dy}{dx} = 3ax^{2} + b$. At $x = 1$ this is $3a + b$, so $3a + b = 0$.\n\n' +
        'Take the first equation away from the second to remove $b$: $(3a + b) - (a + b) = 0 - (-4)$. This simplifies to $2a = 4$, so $a = 2$.\n\n' +
        'Put $a = 2$ into $a + b = -4$: $2 + b = -4$. Take 2 from both sides: $b = -6$. So $a = 2$, $b = -6$.',
      conclusion: 'These values fit both equations: $2 + (-6) = -4$ and $3 \\times 2 + (-6) = 0$. So $a = 2$, $b = -6$.',
      whyWrong: [
        'This swaps the two conditions, using $3a + b = -4$ and $a + b = 0$. At a stationary point the **gradient** is $0$; the $y$-value is $-4$.',
        'This uses $a + b = 4$ (a sign slip on the $y$-coordinate). Check: with $a = -2$, $b = 6$ the curve gives $y(1) = -2 + 6 = 4$, not $-4$.',
        'This differentiates $bx$ as $0$ instead of $b$, so $3a = 0$ forces $a = 0$. But then $y = -4x$ is a straight line with gradient $-4$, which has no stationary point.',
        null,
      ],
      keyIdea: 'A stationary point at $(p, q)$ gives two equations: put the point into the curve\'s equation, and put $x = p$ into $\\frac{dy}{dx} = 0$. Then solve the two equations together.',
    },
    check: {
      optionValues: ['-2,2', '-2,6', '0,-4', '2,-6'],
      compute: () => {
        // Unknowns a, b.  On curve: x0^3 a + x0 b = y0.  Stationary: 3 x0^2 a + b = 0.  Solve by Cramer's rule.
        const x0 = 1;
        const y0 = -4;
        const [p, q, r] = [x0 ** 3, x0, y0];
        const [s, t, u] = [3 * x0 ** 2, 1, 0];
        const det = p * t - q * s;
        return `${(r * t - q * u) / det},${(p * u - r * s) / det}`;
      },
    },
  },
  // ------------------------------------------------------------------ recall and short calculations
  {
    id: 'derivative-applications-019',
    subtopic: 'derivative-applications',
    difficulty: 'foundation',
    stem: 'What is true of $f\'(x)$ at a stationary point of $f$?',
    options: ['$f\'(x) = 0$', '$f(x) = 0$', '$f\'\'(x) = 0$', '$f\'(x) = 1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the gradient of a curve at a stationary point?',
      solution:
        '**Stationary** means not moving. At a stationary point, the curve is neither going up nor going down for that moment, so it is flat.\n\n' +
        '$f\'(x)$ gives the gradient of the curve, and a flat line has gradient 0. For example, $f(x) = x^{2}$ has $f\'(x) = 2x$, which is 0 at the bottom of the curve, $x = 0$. So at any stationary point, $f\'(x) = 0$.',
      conclusion: 'Flat means zero gradient, so at a stationary point $f\'(x) = 0$.',
      whyWrong: [
        null,
        'This is where the curve meets the $x$-axis. A stationary point can be at any height.',
        'The second derivative helps classify a stationary point. It need not be $0$ there; at a maximum it is usually negative.',
        'A gradient of $1$ means the curve is rising. A flat point has gradient $0$.',
      ],
      keyIdea: 'To find the stationary points of any curve, differentiate and solve $f\'(x) = 0$. Maximum and minimum points are stationary points, so use this whenever a question asks for either.',
    },
  },
  {
    id: 'derivative-applications-020',
    subtopic: 'derivative-applications',
    difficulty: 'foundation',
    stem: 'If $f\'(x) > 0$ for every $x$ in an interval, what can you say about $f$ on that interval?',
    options: ['$f$ is increasing', '$f$ is decreasing', '$f$ is positive', '$f$ has a maximum'],
    correctIndex: 0,
    markScheme: {
      asking: 'If the gradient is positive everywhere in an interval, what is the graph doing?',
      solution:
        '$f\'(x)$ is the gradient of the curve $y = f(x)$. A positive gradient means the curve goes uphill as you move right.\n\n' +
        'If the gradient is positive at every $x$ in the interval, the curve goes uphill all the way across. So each larger $x$ gives a larger $f(x)$, and that is what **increasing** means.',
      conclusion: 'A positive gradient everywhere means the graph only ever goes up, so $f$ is increasing.',
      whyWrong: [
        null,
        'Decreasing needs $f\'(x) < 0$, a negative gradient.',
        'This confuses the gradient with the height. A curve can be below the $x$-axis and still be rising.',
        '$f$ need not have a maximum: $f(x) = x$ on $0 < x < 1$ has $f\'(x) > 0$ and no largest value. A turning point would need the gradient to reach $0$, but here it stays positive.',
      ],
      keyIdea: 'Read the sign of $f\'$ as a direction. $f\' > 0$ means rising, $f\' < 0$ means falling, and $f\' = 0$ means flat. It says nothing about whether $f$ itself is positive or negative.',
    },
  },
  {
    id: 'derivative-applications-021',
    subtopic: 'derivative-applications',
    difficulty: 'foundation',
    stem: 'What is the **normal** to a curve at a point?',
    options: ['The line through the point perpendicular to the tangent', 'The line through the point parallel to the tangent', 'The tangent itself', 'The horizontal line through the point'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the word normal mean for a curve?',
      solution:
        'The **tangent** is the straight line that just touches the curve at the point and runs in the curve\'s direction there.\n\n' +
        'The **normal** goes through the same point, but at right angles to the tangent. **Perpendicular** means at right angles. For example, if the tangent has gradient 2, the normal has gradient $-\\frac{1}{2}$, because the two gradients multiply to $-1$.',
      conclusion: 'The normal is the line through the point perpendicular to the tangent.',
      whyWrong: [
        null,
        'A line through the point and parallel to the tangent is just the tangent again. The normal is perpendicular to it.',
        'The tangent touches the curve with the same gradient as the curve. The normal is a different line, perpendicular to it.',
        'A horizontal line is the tangent at a stationary point, not the normal in general.',
      ],
      keyIdea: 'To get a normal\'s gradient, take the tangent\'s gradient $m$ and use $-\\frac{1}{m}$. The normal passes through the same point, so use $y - y_1 = -\\frac{1}{m}(x - x_1)$.',
    },
  },
  {
    id: 'derivative-applications-022',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'Find the $x$-coordinates of the stationary points of $y = x^{3} - 12x$.',
    options: ['$x = 2$ and $x = -2$', '$x = 2$ only', '$x = 4$ and $x = -4$', '$x = 0$ and $x = 12$'],
    correctIndex: 0,
    markScheme: {
      asking: 'At which $x$ values is this curve flat?',
      solution:
        'A **stationary point** is where the curve is flat, so its gradient is 0. That means we solve $\\frac{dy}{dx} = 0$.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1). $x^{3}$ gives $3x^{2}$, and $-12x$ gives $-12$. So $\\frac{dy}{dx} = 3x^{2} - 12$.\n\n' +
        'Set it to 0: $3x^{2} - 12 = 0$. Add 12 to both sides: $3x^{2} = 12$. Divide by 3: $x^{2} = 4$.\n\n' +
        'Take the square root. Both a positive and a negative number square to 4, because $2^{2} = 4$ and $(-2)^{2} = 4$. So $x = 2$ and $x = -2$.',
      conclusion: 'The gradient is 0 where $x^{2} = 4$, which has two solutions, so the answer is $x = 2$ and $x = -2$.',
      whyWrong: [
        null,
        'This forgets the negative square root. $x^{2} = 4$ has two solutions.',
        'This stops at $x^{2} = 4$ and treats the $4$ as the value of $x$. You still have to take the square root.',
        'This works from $y = 0$ rather than $\\frac{dy}{dx} = 0$, and it also forgets the square root. Stationary points come from the derivative.',
      ],
      keyIdea: 'Solve $\\frac{dy}{dx} = 0$. When you reach $x^{2} = k$, take the square root and keep both signs: $x = \\sqrt{k}$ and $x = -\\sqrt{k}$.',
    },
    check: {
      optionValues: ['-2,2', '2', '-4,4', '0,12'],
      compute: () => {
        const f: Fn = (x) => x ** 3 - 12 * x;
        const xs: number[] = [];
        for (let x = -20; x <= 20; x++) if (Math.abs(nd(f, x)) < 1e-6) xs.push(x);
        return xs.join(',');
      },
    },
  },
  {
    id: 'derivative-applications-023',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'Find the slope of the tangent to the curve $y = \\frac{4}{x}$ at $x = 2$.',
    options: ['$-1$', '$1$', '$2$', '$-2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How steep is the curve at $x = 2$?',
      solution:
        'The slope of the tangent is the value of $\\frac{dy}{dx}$ at that point. To use the power rule, first write the fraction as a power: $\\frac{4}{x} = 4x^{-1}$, because dividing by $x$ is the same as multiplying by $x^{-1}$.\n\n' +
        'Use the power rule. Multiply by the power: $4 \\times (-1) = -4$. Lower the power by 1: $-1 - 1 = -2$. So $\\frac{dy}{dx} = -4x^{-2}$, which is the same as $-\\frac{4}{x^{2}}$.\n\n' +
        'Substitute $x = 2$: $-\\frac{4}{2^{2}} = -\\frac{4}{4} = -1$.',
      conclusion: 'The gradient formula $-\\frac{4}{x^{2}}$ equals $-\\frac{4}{4}$ at $x = 2$, so the slope is $-1$.',
      whyWrong: [
        null,
        'This loses the minus sign that comes from the power $-1$.',
        'This is the height of the curve at $x = 2$, not its slope.',
        'This uses $-\\frac{4}{x}$, forgetting that the power drops from $-1$ to $-2$.',
      ],
      keyIdea: 'With $x$ on the bottom of a fraction, rewrite it first: $\\frac{k}{x^{n}} = kx^{-n}$. Then use the power rule, lowering the power by 1, so $-1$ becomes $-2$. Substitute last.',
    },
    check: {
      optionValues: [-1, 1, 2, -2],
      compute: () => nd((x) => 4 / x, 2),
    },
  },
  {
    id: 'derivative-applications-024',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'Find the minimum value of $f(x) = x^{2} - 4x + 7$.',
    options: ['$3$', '$2$', '$7$', '$19$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the smallest value this function ever reaches?',
      solution:
        'At a minimum, the curve is flat for a moment, so its gradient is 0. So we solve $f\'(x) = 0$ to find where the minimum is.\n\n' +
        'Differentiate using the power rule (multiply by the power, then lower the power by 1): $f\'(x) = 2x - 4$. Set it to 0: $2x - 4 = 0$. So $2x = 4$ and $x = 2$.\n\n' +
        'Make sure this is a minimum. Differentiating again gives the second derivative, $f\'\'(x) = 2$, which is positive, so the curve bends upwards like a valley.\n\n' +
        'The question wants the value of $f$, not of $x$, so put $x = 2$ into $f$: $f(2) = 2^{2} - 4 \\times 2 + 7 = 4 - 8 + 7 = 3$.',
      conclusion: 'The lowest point of the curve is at $x = 2$, and the function\'s value there is $3$.',
      whyWrong: [
        null,
        'This is the $x$-value where the minimum occurs. The question asks for the value of $f$ there.',
        'This is $f(0)$, the $y$-intercept. The minimum is at the stationary point, $x = 2$.',
        'This solves $2x - 4 = 0$ with a sign slip and uses $x = -2$: $f(-2) = 4 + 8 + 7 = 19$.',
      ],
      keyIdea: 'For a minimum or maximum value: solve $f\'(x) = 0$ to find $x$, then substitute that $x$ into $f(x)$. Keep where it happens (the $x$) separate from the value (the $f(x)$).',
    },
    check: {
      optionValues: [3, 2, 7, 19],
      compute: () => -gridMax((x) => -(x ** 2 - 4 * x + 7), -10, 10),
    },
  },
];
