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
/** Minimum of a unimodal function on [lo, hi] by ternary search. */
function ternaryMin(f: Fn, lo: number, hi: number): number {
  for (let i = 0; i < 300; i++) {
    const a = lo + (hi - lo) / 3;
    const b = hi - (hi - lo) / 3;
    if (f(a) < f(b)) hi = b;
    else lo = a;
  }
  return f((lo + hi) / 2);
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
    difficulty: 'foundation',
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
    stem: 'A ball is thrown upwards. Its height after $t$ seconds is $h = 20t - 5t^{2}$ metres. What is its velocity (the rate of change of height) at $t = 1$ second?',
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
        '1. Find the point: $y = 1^{2} + 3(1) = 4$, so the point is $(1, 4)$.\n' +
        '2. Find the gradient: $\\frac{dy}{dx} = 2x + 3$, so at $x = 1$ the gradient is $m = 2(1) + 3 = 5$.\n' +
        '3. Use $y - y_1 = m(x - x_1)$: $y - 4 = 5(x - 1)$.\n' +
        '4. Expand: $y - 4 = 5x - 5$, so $y = 5x - 1$.\n\n' +
        'Check: at $x = 1$ the line gives $5 - 1 = 4$, which matches the curve.',
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
        '1. Differentiate: $\\frac{dy}{dx} = 3x^{2} - 12x + 9 = 3(x^{2} - 4x + 3) = 3(x - 1)(x - 3)$.\n' +
        '2. Stationary points where $\\frac{dy}{dx} = 0$: $x = 1$ and $x = 3$.\n' +
        '3. Second derivative: $\\frac{d^{2}y}{dx^{2}} = 6x - 12$.\n' +
        '4. At $x = 1$: $6 - 12 = -6 < 0$, so this is a **maximum**. At $x = 3$: $18 - 12 = 6 > 0$, so that one is a minimum.\n' +
        '5. Find $y$ at $x = 1$: $1 - 6 + 9 + 1 = 5$.\n\n' +
        'The local maximum is $(1, 5)$.',
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
    stem: 'A farmer has $60$ m of fencing to make a rectangular pen against a long straight wall. The wall forms one side, so fencing is needed for only **three** sides. What is the largest possible area of the pen?',
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
    id: 'derivative-applications-011',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    stem: 'The side of a square is increasing at $2$ cm per second. How fast is the **area** of the square increasing at the moment when the side is $5$ cm?',
    options: ['$10 \\text{ cm}^{2}/\\text{s}$', '$25 \\text{ cm}^{2}/\\text{s}$', '$4 \\text{ cm}^{2}/\\text{s}$', '$20 \\text{ cm}^{2}/\\text{s}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Let the side be $s$, so the area is $A = s^{2}$. We know $\\frac{ds}{dt} = 2$ and want $\\frac{dA}{dt}$ when $s = 5$.\n\n' +
        '1. Differentiate with respect to $s$: $\\frac{dA}{ds} = 2s$.\n' +
        '2. Chain rule: $\\frac{dA}{dt} = \\frac{dA}{ds} \\times \\frac{ds}{dt} = 2s \\times 2 = 4s$.\n' +
        '3. At $s = 5$: $\\frac{dA}{dt} = 4 \\times 5 = 20$.\n\n' +
        'The area is increasing at $20 \\text{ cm}^{2}/\\text{s}$.',
      whyWrong: [
        '$10 = 2s$ is $\\frac{dA}{ds}$, how fast the area changes per cm of side. You still need to multiply by $\\frac{ds}{dt} = 2$ (chain rule).',
        '$25 \\text{ cm}^{2}$ is the **area** at that moment, not its rate of change.',
        'This squares the rate, $2^{2} = 4$, as if the rate of change of $s^{2}$ were $\\left(\\frac{ds}{dt}\\right)^{2}$. The chain rule gives $\\frac{dA}{dt} = 2s \\frac{ds}{dt}$.',
        null,
      ],
      keyIdea: 'Connected rates of change: $\\frac{dA}{dt} = \\frac{dA}{ds} \\times \\frac{ds}{dt}$.',
    },
    check: {
      optionValues: [10, 25, 4, 20],
      compute: () => nd((t) => (5 + 2 * t) ** 2, 0), // side = 5 + 2t, area = side squared
    },
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
  // ------------------------------------------------------------------ challenge
  {
    id: 'derivative-applications-014',
    subtopic: 'derivative-applications',
    difficulty: 'challenge',
    stem: 'A square sheet of card has side $12$ cm. Equal squares of side $x$ cm are cut from each corner and the sides are folded up to make an open box. What is the maximum possible volume of the box, in $\\text{cm}^{3}$?',
    options: ['$256$', '$128$', '$64$', '$2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'After cutting, the base is a square of side $12 - 2x$ (a piece of length $x$ is removed at **both** ends of each edge) and the height is $x$.\n\n' +
        '1. Volume: $V = x(12 - 2x)^{2} = x(144 - 48x + 4x^{2}) = 4x^{3} - 48x^{2} + 144x$.\n' +
        '2. Differentiate: $\\frac{dV}{dx} = 12x^{2} - 96x + 144 = 12(x^{2} - 8x + 12) = 12(x - 2)(x - 6)$.\n' +
        '3. Stationary points: $x = 2$ or $x = 6$. But $x = 6$ makes the base side $12 - 12 = 0$ (no box), so we need $0 < x < 6$.\n' +
        '4. Check $x = 2$: $\\frac{d^{2}V}{dx^{2}} = 24x - 96 = 48 - 96 = -48 < 0$, so it is a maximum.\n' +
        '5. Volume: $V = 2 \\times (12 - 4)^{2} = 2 \\times 64 = 128 \\text{ cm}^{3}$.',
      whyWrong: [
        'This takes the base side as $12 - x$, forgetting that a square is cut from **both** ends of each edge. Then $V = x(12 - x)^{2}$ peaks at $x = 4$ with $V = 256$.',
        null,
        'This swaps the dimensions, using $V = x^{2}(12 - 2x)$ (base side $x$, height $12 - 2x$). The height is the cut size $x$ and the base side is $12 - 2x$.',
        '$2$ is the best cut size $x$ (in cm), not the volume. Substitute it back: $V = 2(12 - 4)^{2} = 128$.',
      ],
      keyIdea: 'Build the volume formula from the diagram first (base side $12 - 2x$, height $x$), then differentiate and reject stationary points that make no physical sense.',
    },
    check: { optionValues: [256, 128, 64, 2], compute: () => gridMax((x) => x * (12 - 2 * x) ** 2, 0, 6) },
  },
  {
    id: 'derivative-applications-015',
    subtopic: 'derivative-applications',
    difficulty: 'challenge',
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
  {
    id: 'derivative-applications-016',
    subtopic: 'derivative-applications',
    difficulty: 'challenge',
    stem: 'What is the shortest distance from the point $(0, 2)$ to the curve $y = x^{2}$?',
    options: ['$2$', '$\\frac{7}{4}$', '$\\frac{\\sqrt{7}}{2}$', '$\\frac{\\sqrt{6}}{2}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Take a general point $(x, x^{2})$ on the curve. It is easier to minimise the **squared** distance $D = d^{2}$: it has its minimum at the same point and there is no square root to differentiate.\n\n' +
        '1. $D = x^{2} + (x^{2} - 2)^{2} = x^{2} + x^{4} - 4x^{2} + 4 = x^{4} - 3x^{2} + 4$.\n' +
        '2. $\\frac{dD}{dx} = 4x^{3} - 6x = 2x(2x^{2} - 3)$, which is zero at $x = 0$ or $x^{2} = \\frac{3}{2}$.\n' +
        '3. Nature: $\\frac{d^{2}D}{dx^{2}} = 12x^{2} - 6$. At $x = 0$ this is $-6 < 0$, a local **maximum** of the distance. At $x^{2} = \\frac{3}{2}$ it is $18 - 6 = 12 > 0$, a minimum.\n' +
        '4. Minimum: $D = \\left(\\frac{3}{2}\\right)^{2} - 3 \\times \\frac{3}{2} + 4 = \\frac{9}{4} - \\frac{18}{4} + \\frac{16}{4} = \\frac{7}{4}$.\n' +
        '5. Distance: $d = \\sqrt{\\frac{7}{4}} = \\frac{\\sqrt{7}}{2} \\approx 1.32$.',
      whyWrong: [
        '$2$ is the distance to $(0, 0)$, from the stationary point $x = 0$. But $\\frac{d^{2}D}{dx^{2}} = -6 < 0$ there, so it is a local **maximum** of the distance, not the minimum.',
        '$\\frac{7}{4}$ is the minimum of the **squared** distance $d^{2}$. You must take the square root at the end.',
        null,
        '$\\frac{\\sqrt{6}}{2} = \\sqrt{\\frac{3}{2}}$ is the $x$-coordinate of the closest point, not the distance.',
      ],
      keyIdea: 'To minimise a distance, minimise its square instead, and use the second derivative to reject stationary points that are maxima.',
    },
    check: {
      optionValues: [2, 7 / 4, Math.sqrt(7) / 2, Math.sqrt(6) / 2],
      compute: () => ternaryMin((x) => Math.sqrt(x ** 2 + (x ** 2 - 2) ** 2), 0, 3),
    },
  },
  {
    id: 'derivative-applications-017',
    subtopic: 'derivative-applications',
    difficulty: 'challenge',
    stem: 'A $10$ m ladder leans against a vertical wall. The bottom of the ladder slides away from the wall at $1$ m/s. How fast is the top of the ladder sliding **down** the wall at the moment when the bottom is $6$ m from the wall?',
    options: ['$\\frac{3}{4}$ m/s', '$\\frac{4}{3}$ m/s', '$1$ m/s', '$\\frac{3}{5}$ m/s'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Let $x$ be the distance of the bottom from the wall and $y$ the height of the top. By Pythagoras, $x^{2} + y^{2} = 100$.\n\n' +
        '1. When $x = 6$: $y = \\sqrt{100 - 36} = \\sqrt{64} = 8$.\n' +
        '2. Differentiate both sides with respect to time $t$: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$.\n' +
        '3. Substitute $x = 6$, $y = 8$, $\\frac{dx}{dt} = 1$: $2(6)(1) + 2(8)\\frac{dy}{dt} = 0$, so $12 + 16\\frac{dy}{dt} = 0$.\n' +
        '4. Solve: $\\frac{dy}{dt} = -\\frac{12}{16} = -\\frac{3}{4}$.\n\n' +
        'The minus sign means $y$ is decreasing, so the top slides down at $\\frac{3}{4}$ m/s.',
      whyWrong: [
        null,
        'This flips the ratio, using $\\frac{y}{x} = \\frac{8}{6}$ instead of $\\frac{x}{y} = \\frac{6}{8}$. From $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0$, the speed down the wall is $\\frac{x}{y} \\times \\frac{dx}{dt}$.',
        'This assumes the top moves at the same speed as the bottom. The ladder length is fixed, but the two ends move at different rates that depend on the position.',
        'This divides by the ladder length $10$ instead of the height $y = 8$, giving $\\frac{6}{10}$. Differentiating $x^{2} + y^{2} = 100$ gives $\\frac{dy}{dt} = -\\frac{x}{y} \\times \\frac{dx}{dt}$.',
      ],
      keyIdea: 'Connected rates: write an equation linking the quantities, differentiate both sides with respect to time, then substitute the values at that instant.',
    },
    check: {
      optionValues: [3 / 4, 4 / 3, 1, 3 / 5],
      compute: () => -nd((t) => Math.sqrt(100 - (6 + t) ** 2), 0), // bottom at 6 + t, top at sqrt(100 - x^2)
    },
  },
  {
    id: 'derivative-applications-018',
    subtopic: 'derivative-applications',
    difficulty: 'challenge',
    stem: 'The tangent to the curve $y = \\frac{1}{x}$ at the point where $x = 2$ meets the $x$-axis and the $y$-axis. What is the area of the triangle formed by this tangent and the two axes?',
    options: ['$4$', '$\\frac{9}{4}$', '$\\frac{1}{2}$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Point: at $x = 2$, $y = \\frac{1}{2}$, so the point is $\\left(2, \\frac{1}{2}\\right)$.\n' +
        '2. Gradient: $y = x^{-1}$, so $\\frac{dy}{dx} = -x^{-2} = -\\frac{1}{x^{2}}$. At $x = 2$: $m = -\\frac{1}{4}$.\n' +
        '3. Tangent: $y - \\frac{1}{2} = -\\frac{1}{4}(x - 2)$, so $y = -\\frac{1}{4}x + \\frac{1}{2} + \\frac{1}{2} = -\\frac{1}{4}x + 1$.\n' +
        '4. Intercepts: when $x = 0$, $y = 1$; when $y = 0$, $\\frac{1}{4}x = 1$, so $x = 4$.\n' +
        '5. Area $= \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 4 \\times 1 = 2$.',
      whyWrong: [
        'This forgets the $\\frac{1}{2}$ in the triangle area formula: $4 \\times 1 = 4$.',
        'This differentiates $x^{-1}$ as $-x^{-1}$ (not lowering the power), giving gradient $-\\frac{1}{2}$. The tangent becomes $y = -\\frac{1}{2}x + \\frac{3}{2}$ with intercepts $3$ and $\\frac{3}{2}$, so the area is $\\frac{9}{4}$.',
        'This loses the constant when expanding the bracket. Since $-\\frac{1}{4}(x - 2) = -\\frac{1}{4}x + \\frac{1}{2}$, the tangent is $y = -\\frac{1}{4}x + 1$, not $y = -\\frac{1}{4}x + \\frac{1}{2}$. The wrong line has intercepts $2$ and $\\frac{1}{2}$, giving area $\\frac{1}{2}$.',
        null,
      ],
      keyIdea: 'Find the tangent with $y - y_1 = m(x - x_1)$, then its intercepts come from setting $x = 0$ and $y = 0$.',
    },
    check: {
      optionValues: [4, 9 / 4, 1 / 2, 2],
      compute: () => {
        const f: Fn = (x) => 1 / x;
        const mGrad = nd(f, 2);
        const c = f(2) - mGrad * 2; // y-intercept
        const xInt = -c / mGrad;
        return 0.5 * xInt * c;
      },
    },
  },
];
