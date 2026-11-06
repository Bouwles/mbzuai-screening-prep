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
      solution:
        'The gradient of the tangent at a point is the value of the **derivative** at that point.\n\n' +
        '1. Differentiate: $\\frac{dy}{dx} = 3x^{2} - 2$.\n' +
        '2. Substitute $x = 2$: $3(2)^{2} - 2 = 3 \\times 4 - 2 = 10$.\n\n' +
        'So the gradient of the tangent is $10$.',
      whyWrong: [
        '$4$ is the **$y$-value** at $x = 2$ (because $2^{3} - 2(2) = 4$), not the gradient. You must differentiate first.',
        'This forgets that the derivative of $-2x$ is $-2$, and uses only $3x^{2} = 12$.',
        null,
        'This differentiates $x^{3}$ as $3x^{3}$ (keeping the old power), giving $3(8) - 2 = 22$. The power drops by one: $x^{3}$ becomes $3x^{2}$.',
      ],
      keyIdea: 'The gradient of the tangent at $x = a$ is $f\'(a)$: differentiate, then substitute.',
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
      solution:
        'A stationary point is where the gradient is zero, so solve $\\frac{dy}{dx} = 0$.\n\n' +
        '1. Differentiate: $\\frac{dy}{dx} = 2x - 6$.\n' +
        '2. Solve $2x - 6 = 0$, so $x = 3$.\n' +
        '3. Find $y$ by substituting $x = 3$ into the **original** equation: $y = 3^{2} - 6(3) + 5 = 9 - 18 + 5 = -4$.\n\n' +
        'The stationary point is $(3, -4)$.',
      whyWrong: [
        null,
        'This comes from a sign slip when solving: $2x - 6 = 0$ gives $x = 3$, not $x = -3$.',
        'The $x$-value is right but the arithmetic for $y$ slipped: $9 - 18 + 5 = -4$, not $4$.',
        '$(1, 0)$ is where the curve crosses the $x$-axis ($y = 0$). Stationary points come from $\\frac{dy}{dx} = 0$, not from $y = 0$.',
      ],
      keyIdea: 'Stationary point: set the derivative to zero to find $x$, then put $x$ back into the original function to find $y$.',
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
      solution:
        'A function is **decreasing** where its gradient is negative, that is where $f\'(x) < 0$.\n\n' +
        '1. Differentiate: $f\'(x) = 2x - 4$.\n' +
        '2. Solve $2x - 4 < 0$: $2x < 4$, so $x < 2$.\n\n' +
        'Check with a value on each side: $f\'(0) = -4 < 0$ (going down) and $f\'(3) = 2 > 0$ (going up). So $f$ is decreasing for $x < 2$.',
      whyWrong: [
        'This is where $f\'(x) > 0$, which is where $f$ is **increasing**, not decreasing.',
        null,
        'This is where $f(x) < 0$, where the graph is **below the $x$-axis**. Decreasing is about the gradient $f\'(x)$ being negative, not the value $f(x)$.',
        'This forgets to differentiate the $-4x$ term (its derivative is $-4$), solving $2x < 0$ instead of $2x - 4 < 0$.',
      ],
      keyIdea: 'Increasing means $f\'(x) > 0$ and decreasing means $f\'(x) < 0$; look at the gradient, not the height of the graph.',
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
      solution:
        'Velocity is the rate of change of height with respect to time, $\\frac{dh}{dt}$.\n\n' +
        '1. Differentiate: $\\frac{dh}{dt} = 20 - 10t$.\n' +
        '2. Substitute $t = 1$: $20 - 10(1) = 10$.\n\n' +
        'The velocity is $10$ m/s. It is positive, so the ball is still going up.',
      whyWrong: [
        '$15$ m is the **height** at $t = 1$ ($20 - 5 = 15$), not the rate of change of height.',
        'This drops the minus sign when differentiating $-5t^{2}$, getting $20 + 10t = 30$.',
        '$-10$ is the **second** derivative $\\frac{d^{2}h}{dt^{2}}$ (the acceleration), not the velocity.',
        null,
      ],
      keyIdea: '"Rate of change" means derivative: differentiate with respect to time, then substitute the time.',
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
      solution:
        'Use the **second derivative test** at a stationary point (where $f\'(a) = 0$):\n\n' +
        '- $f\'\'(a) < 0$: the curve bends downwards like a hill, so it is a **local maximum**.\n' +
        '- $f\'\'(a) > 0$: the curve bends upwards like a valley, so it is a **local minimum**.\n' +
        '- $f\'\'(a) = 0$: the test gives no conclusion.\n\n' +
        'Here $f\'\'(a) = -3 < 0$, so it is a local maximum.',
      whyWrong: [
        null,
        'This mixes up the signs. A **positive** second derivative means a minimum and a negative one means a maximum (think of the hill $y = -x^{2}$, which has $y\'\' = -2$).',
        'A point of inflection needs the second derivative to be zero (and change sign). Here $f\'\'(a) = -3$, which is not zero.',
        'Stationary means $f\'(a) = 0$; it says nothing about $f\'\'(a)$. The value of $f\'\'(a)$ only tells us the **type** of stationary point.',
      ],
      keyIdea: 'Second derivative test: negative means maximum (hill), positive means minimum (valley), zero means the test is inconclusive.',
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
      solution:
        '**Step 1: the point.** $y = 1^{2} + 3(1) = 4$, so the tangent passes through $(1, 4)$.\n\n' +
        '**Step 2: the gradient.** $\\frac{dy}{dx} = 2x + 3$, so at $x = 1$ the gradient is $m = 2(1) + 3 = 5$.\n\n' +
        '**Step 3: the line.** Use $y - y_1 = m(x - x_1)$: $y - 4 = 5(x - 1)$.\n\n' +
        'Expand: $y - 4 = 5x - 5$, so $y = 5x - 1$. Check: at $x = 1$ the line gives $5 - 1 = 4$, which matches the curve.',
      whyWrong: [
        'This uses the $y$-coordinate $4$ as the $y$-intercept. The point $(1, 4)$ is not on the $y$-axis, so you must use $y - 4 = 5(x - 1)$ to find the intercept.',
        null,
        'This is just the derivative $\\frac{dy}{dx} = 2x + 3$ written as a line. The tangent needs the gradient **at** $x = 1$ (the number $5$) and must pass through $(1, 4)$.',
        'This is the **normal** (gradient $-\\frac{1}{5}$, perpendicular to the tangent), not the tangent.',
      ],
      keyIdea: 'Tangent line: point from the curve, gradient from the derivative at that point, then $y - y_1 = m(x - x_1)$.',
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
      solution:
        'The normal is the line **perpendicular** to the tangent at that point.\n\n' +
        '1. Gradient of the tangent: $\\frac{dy}{dx} = 3x^{2}$, so at $x = 1$ it is $3$.\n' +
        '2. Gradient of the normal: the negative reciprocal, $m = -\\frac{1}{3}$ (check: $3 \\times \\left(-\\frac{1}{3}\\right) = -1$).\n' +
        '3. Use $y - y_1 = m(x - x_1)$: $y - 1 = -\\frac{1}{3}(x - 1)$.\n' +
        '4. Expand: $y = -\\frac{1}{3}x + \\frac{1}{3} + 1 = -\\frac{1}{3}x + \\frac{4}{3}$.',
      whyWrong: [
        'This is the **tangent** at $(1, 1)$ (gradient $3$), not the normal.',
        'This takes the negative of $3$ but forgets to take the reciprocal. The normal gradient must satisfy $m \\times 3 = -1$, so $m = -\\frac{1}{3}$, not $-3$.',
        'This takes the reciprocal of $3$ but forgets the minus sign. Perpendicular gradients multiply to $-1$, but $3 \\times \\frac{1}{3} = 1$.',
        null,
      ],
      keyIdea: 'The normal gradient is the negative reciprocal of the tangent gradient: $m_{\\text{normal}} = -\\frac{1}{m_{\\text{tangent}}}$.',
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
      solution:
        'On a closed interval the maximum is either at a stationary point **inside** the interval or at an **endpoint**, so check both.\n\n' +
        '1. $f\'(x) = 3x^{2} - 3 = 3(x - 1)(x + 1)$, so $f\'(x) = 0$ at $x = 1$ and $x = -1$.\n' +
        '2. Only $x = 1$ lies in $0 \\le x \\le 3$. $f(1) = 1 - 3 = -2$ (a local minimum, since $f\'\'(1) = 6 > 0$).\n' +
        '3. Endpoints: $f(0) = 0$ and $f(3) = 27 - 9 = 18$.\n\n' +
        'Comparing $-2$, $0$ and $18$, the maximum value is $18$ (at $x = 3$).',
      whyWrong: [
        '$2 = f(-1)$ is a local maximum value, but $x = -1$ is **outside** the interval $0 \\le x \\le 3$, so it does not count.',
        '$-2 = f(1)$ is the value at the stationary point inside the interval, but it is a local **minimum**. On a closed interval you must also check the endpoints.',
        null,
        '$1$ is the $x$-coordinate of the stationary point, not a value of $f$, and that stationary point is a minimum anyway.',
      ],
      keyIdea: 'On a closed interval, compare the function values at the stationary points inside the interval AND at both endpoints.',
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
      solution:
        '**Step 1: stationary points.** $\\frac{dy}{dx} = 3x^{2} - 12x + 9 = 3(x^{2} - 4x + 3) = 3(x - 1)(x - 3)$, which is $0$ at $x = 1$ and $x = 3$.\n\n' +
        '**Step 2: which is the maximum?** $\\frac{d^{2}y}{dx^{2}} = 6x - 12$. At $x = 1$: $6 - 12 = -6 < 0$, so this is a **maximum**. At $x = 3$: $18 - 12 = 6 > 0$, so that one is a minimum.\n\n' +
        '**Step 3: the $y$-coordinate.** At $x = 1$: $y = 1 - 6 + 9 + 1 = 5$, so the local maximum is $(1, 5)$.',
      whyWrong: [
        null,
        '$(3, 1)$ is the other stationary point, but $\\frac{d^{2}y}{dx^{2}} = 6 > 0$ there, so it is the local **minimum**.',
        '$(2, 3)$ is where $\\frac{d^{2}y}{dx^{2}} = 0$ (the point of inflection). The gradient there is $3(1)(-1) = -3$, not $0$, so it is not even stationary.',
        'This factorises with the wrong signs, as $3(x + 1)(x + 3)$, and uses $x = -1$. Check: $3(-1)^{2} - 12(-1) + 9 = 24 \\ne 0$, so $x = -1$ is not stationary.',
      ],
      keyIdea: 'Find where $\\frac{dy}{dx} = 0$, then use the sign of $\\frac{d^{2}y}{dx^{2}}$ to decide which stationary point is the maximum.',
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
      solution:
        'Let $x$ be the length of each of the two sides perpendicular to the wall. The side parallel to the wall uses the rest of the fencing: $60 - 2x$.\n\n' +
        '1. Area: $A = x(60 - 2x) = 60x - 2x^{2}$.\n' +
        '2. Differentiate: $\\frac{dA}{dx} = 60 - 4x$.\n' +
        '3. Set to zero: $60 - 4x = 0$, so $x = 15$.\n' +
        '4. Check it is a maximum: $\\frac{d^{2}A}{dx^{2}} = -4 < 0$.\n' +
        '5. The pen is $15$ m by $60 - 30 = 30$ m, so $A = 15 \\times 30 = 450 \\text{ m}^{2}$.',
      whyWrong: [
        'This fences all **four** sides: a $15 \\times 15$ square uses all $60$ m. With the wall as one side you only fence three sides, so you can do better.',
        null,
        'This assumes the three fenced sides are equal ($20$ m each), giving $20 \\times 20$. The best shape has the side along the wall twice as long as the other two.',
        'This writes the parallel side as $60 - x$ instead of $60 - 2x$, forgetting there are **two** sides of length $x$. Then $x = 30$ and $A = 30 \\times 30 = 900$, which would need $90$ m of fencing.',
      ],
      keyIdea: 'Optimisation: write the quantity in terms of one variable using the constraint, differentiate, set to zero, and check it is a maximum.',
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
      solution:
        '1. Differentiate: $f\'(x) = 6x^{2} - 18x + 12 = 6(x^{2} - 3x + 2) = 6(x - 1)(x - 2)$.\n' +
        '2. $f\'(x) = 0$ at $x = 1$ and $x = 2$. These split the number line into three parts.\n' +
        '3. Test one value in each part:\n\n' +
        '| Interval | Test value | Sign of $f\'(x)$ | $f$ is |\n' +
        '| --- | --- | --- | --- |\n' +
        '| $x < 1$ | $x = 0$ | $6(-1)(-2) > 0$ | increasing |\n' +
        '| $1 < x < 2$ | $x = 1.5$ | $6(0.5)(-0.5) < 0$ | decreasing |\n' +
        '| $x > 2$ | $x = 3$ | $6(2)(1) > 0$ | increasing |\n\n' +
        'So $f$ is decreasing for $1 < x < 2$.',
      whyWrong: [
        'This is where $f\'(x) > 0$, which is where $f$ is **increasing**.',
        'This factorises with the wrong signs, as $6(x + 1)(x + 2)$. Expanding that gives $6x^{2} + 18x + 12$, not $6x^{2} - 18x + 12$.',
        null,
        'This solves $f\'\'(x) = 12x - 18 > 0$. The second derivative tells you how the curve bends (concavity), not whether $f$ is increasing or decreasing.',
      ],
      keyIdea: 'Find where $f\'(x) = 0$, then test the sign of $f\'(x)$ between those points: negative means decreasing.',
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
      solution:
        'Parallel lines have the **same gradient**. The line $y = 3x + 1$ has gradient $3$.\n\n' +
        '1. Gradient of the curve: $\\frac{dy}{dx} = 2x - 5$.\n' +
        '2. Set it equal to $3$: $2x - 5 = 3$.\n' +
        '3. Solve: $2x = 8$, so $x = 4$.\n\n' +
        'Check: at $x = 4$ the gradient is $2(4) - 5 = 3$.',
      whyWrong: [
        null,
        'This uses the line\'s $y$-intercept $1$ instead of its gradient: $2x - 5 = 1$ gives $x = 3$.',
        'This reaches $2x = 8$ but forgets to divide by $2$.',
        'This uses the **perpendicular** gradient $-\\frac{1}{3}$: $2x - 5 = -\\frac{1}{3}$ gives $x = \\frac{7}{3}$. Parallel means equal gradients.',
      ],
      keyIdea: 'A tangent parallel to a line has the same gradient as the line: set $\\frac{dy}{dx}$ equal to that gradient and solve.',
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
      solution:
        'Two facts give two equations.\n\n' +
        '1. The point $(1, -4)$ is **on** the curve: $a(1)^{3} + b(1) = -4$, so $a + b = -4$.\n' +
        '2. The point is **stationary**, so $\\frac{dy}{dx} = 3ax^{2} + b$ is zero at $x = 1$: $3a + b = 0$.\n' +
        '3. Subtract the first equation from the second: $(3a + b) - (a + b) = 0 - (-4)$, so $2a = 4$ and $a = 2$.\n' +
        '4. Then $b = -4 - a = -4 - 2 = -6$.\n\n' +
        'Check: $y = 2x^{3} - 6x$ gives $y(1) = 2 - 6 = -4$, and $\\frac{dy}{dx} = 6x^{2} - 6 = 0$ at $x = 1$.',
      whyWrong: [
        'This swaps the two conditions, using $3a + b = -4$ and $a + b = 0$. At a stationary point the **gradient** is $0$; the $y$-value is $-4$.',
        'This uses $a + b = 4$ (a sign slip on the $y$-coordinate). Check: with $a = -2$, $b = 6$ the curve gives $y(1) = -2 + 6 = 4$, not $-4$.',
        'This differentiates $bx$ as $0$ instead of $b$, so $3a = 0$ forces $a = 0$. But then $y = -4x$ is a straight line with gradient $-4$, which has no stationary point.',
        null,
      ],
      keyIdea: 'A stationary point gives two equations: the point lies on the curve, and the derivative is zero there.',
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
      solution: 'A **stationary point** is where the curve is momentarily flat, so its gradient is zero: $f\'(x) = 0$.',
      whyWrong: [
        null,
        'This is where the curve meets the $x$-axis. A stationary point can be at any height.',
        'The second derivative helps classify a stationary point. It need not be $0$ there; at a maximum it is usually negative.',
        'A gradient of $1$ means the curve is rising. A flat point has gradient $0$.',
      ],
      keyIdea: "A stationary point is where $f'(x) = 0$.",
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
      solution: 'A positive derivative means a positive gradient, so the graph goes uphill as $x$ increases: $f$ is **increasing**.',
      whyWrong: [
        null,
        'Decreasing needs $f\'(x) < 0$, a negative gradient.',
        'This confuses the gradient with the height. A curve can be below the $x$-axis and still be rising.',
        '$f$ need not have a maximum: $f(x) = x$ on $0 < x < 1$ has $f\'(x) > 0$ and no largest value. A turning point would need the gradient to reach $0$, but here it stays positive.',
      ],
      keyIdea: "$f'(x) > 0$ means increasing; $f'(x) < 0$ means decreasing.",
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
      solution: 'The **normal** passes through the same point as the tangent and is at right angles to it. If the tangent has gradient $m$, the normal has gradient $-\\frac{1}{m}$.',
      whyWrong: [
        null,
        'A line through the point and parallel to the tangent is just the tangent again. The normal is perpendicular to it.',
        'The tangent touches the curve with the same gradient as the curve. The normal is a different line, perpendicular to it.',
        'A horizontal line is the tangent at a stationary point, not the normal in general.',
      ],
      keyIdea: 'The normal is perpendicular to the tangent at the same point.',
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
      solution:
        '1. Differentiate: $\\frac{dy}{dx} = 3x^{2} - 12$.\n' +
        '2. Set to zero: $3x^{2} = 12$, so $x^{2} = 4$.\n' +
        '3. Take both square roots: $x = 2$ or $x = -2$.',
      whyWrong: [
        null,
        'This forgets the negative square root. $x^{2} = 4$ has two solutions.',
        'This stops at $x^{2} = 4$ and treats the $4$ as the value of $x$. You still have to take the square root.',
        'This works from $y = 0$ rather than $\\frac{dy}{dx} = 0$, and it also forgets the square root. Stationary points come from the derivative.',
      ],
      keyIdea: 'Set the derivative to zero, and keep both square roots.',
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
      solution:
        '"Slope" means the same as "gradient".\n\n' +
        '1. Rewrite as a power: $y = 4x^{-1}$.\n' +
        '2. Differentiate: $\\frac{dy}{dx} = -4x^{-2} = -\\frac{4}{x^{2}}$.\n' +
        '3. Substitute $x = 2$: $-\\frac{4}{4} = -1$.',
      whyWrong: [
        null,
        'This loses the minus sign that comes from the power $-1$.',
        'This is the height of the curve at $x = 2$, not its slope.',
        'This uses $-\\frac{4}{x}$, forgetting that the power drops from $-1$ to $-2$.',
      ],
      keyIdea: 'Rewrite fractions as negative powers before differentiating, then substitute.',
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
      solution:
        "1. Differentiate: $f'(x) = 2x - 4$.\n" +
        '2. Set to zero: $x = 2$. Since $f\'\'(x) = 2 > 0$, this is a minimum.\n' +
        '3. Substitute into the **original** function: $f(2) = 4 - 8 + 7 = 3$.',
      whyWrong: [
        null,
        'This is the $x$-value where the minimum occurs. The question asks for the value of $f$ there.',
        'This is $f(0)$, the $y$-intercept. The minimum is at the stationary point, $x = 2$.',
        'This solves $2x - 4 = 0$ with a sign slip and uses $x = -2$: $f(-2) = 4 + 8 + 7 = 19$.',
      ],
      keyIdea: 'Find $x$ from the derivative, then put it into the original function for the minimum value.',
    },
    check: {
      optionValues: [3, 2, 7, 19],
      compute: () => -gridMax((x) => -(x ** 2 - 4 * x + 7), -10, 10),
    },
  },
];
