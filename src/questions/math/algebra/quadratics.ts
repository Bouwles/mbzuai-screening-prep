import type { StaticQuestion } from '../../../types';

// ---- helpers used only by the answer checks (re-derive answers in code) ----

/** Evaluate a polynomial (coefficients in descending powers) at x, by Horner's rule. */
const polyAt = (coeffs: number[], x: number): number => coeffs.reduce((acc, c) => acc * x + c, 0);

/** Real roots of ax^2 + bx + c = 0 (ascending), straight from the formula. */
function realRoots(a: number, b: number, c: number): number[] {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  if (d === 0) return [-b / (2 * a)];
  const r = [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)];
  return r.sort((p, q) => p - q);
}

/** Synthetic division of a polynomial by (x - h): returns quotient coefficients and remainder. */
function synthDiv(coeffs: number[], h: number): { q: number[]; r: number } {
  const out: number[] = [];
  let carry = 0;
  for (const c of coeffs) {
    carry = carry * h + c;
    out.push(carry);
  }
  const r = out.pop()!;
  return { q: out, r };
}

/** Multiply two polynomials given as descending coefficient arrays. */
function polyMul(p: number[], q: number[]): number[] {
  const out = new Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (out[i + j] += a * b)));
  return out;
}

/** A 0/1 "fingerprint" of a solution set, sampled on a grid: two sets with the same fingerprint agree on every grid point. */
function sig(pred: (x: number) => boolean, lo = -12, hi = 12): string {
  let s = '';
  for (let i = lo * 4; i <= hi * 4; i++) s += pred(i / 4) ? '1' : '0';
  return s;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'quadratics-001',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'Factorise $x^2 - x - 12$.',
    options: ['$(x + 4)(x - 3)$', '$(x - 6)(x + 2)$', '$(x - 4)(x + 3)$', '$(x - 12)(x + 1)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'For $x^2 + bx + c$ we need two numbers that **multiply to** $c = -12$ and **add to** $b = -1$.\n\n' +
        'List the pairs that multiply to $-12$ and check their sums:\n\n' +
        '- $1$ and $-12$: sum $-11$\n' +
        '- $-1$ and $12$: sum $11$\n' +
        '- $2$ and $-6$: sum $-4$\n' +
        '- $-2$ and $6$: sum $4$\n' +
        '- $3$ and $-4$: sum $-1$ (this one)\n\n' +
        'So $x^2 - x - 12 = (x + 3)(x - 4)$, which is the same as $(x - 4)(x + 3)$.\n\n' +
        'Check by expanding: $(x - 4)(x + 3) = x^2 + 3x - 4x - 12 = x^2 - x - 12$.',
      whyWrong: [
        'The numbers $4$ and $-3$ multiply to $-12$ but add to $+1$, so this expands to $x^2 + x - 12$: the signs are the wrong way round.',
        'The numbers $-6$ and $2$ multiply to $-12$ but add to $-4$, so this expands to $x^2 - 4x - 12$, not $x^2 - x - 12$.',
        null,
        'The numbers $-12$ and $1$ multiply to $-12$ but add to $-11$, so this expands to $x^2 - 11x - 12$. Only the product was checked, not the sum.',
      ],
      keyIdea: 'To factorise $x^2 + bx + c$, find two numbers that multiply to $c$ AND add to $b$; always check both.',
    },
    check: {
      // evaluate every option at x = 2 and compare with the original expression at x = 2
      optionValues: [(2 + 4) * (2 - 3), (2 - 6) * (2 + 2), (2 - 4) * (2 + 3), (2 - 12) * (2 + 1)],
      compute: () => polyAt([1, -1, -12], 2),
    },
  },
  {
    id: 'quadratics-002',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'How many real roots does the equation $3x^2 - 5x + 3 = 0$ have?',
    options: ['No real roots', 'Exactly one (repeated) real root', 'Two distinct real roots', 'It depends on the value of $x$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Use the discriminant $\\Delta = b^2 - 4ac$ with $a = 3$, $b = -5$, $c = 3$:\n\n' +
        '$$\\Delta = (-5)^2 - 4(3)(3) = 25 - 36 = -11$$\n\n' +
        'Since $\\Delta < 0$, the square root in the quadratic formula would be $\\sqrt{-11}$, which is not a real number. So the equation has **no real roots** (the graph is a U-shape sitting entirely above the $x$-axis).',
      whyWrong: [
        null,
        'One repeated root needs $\\Delta = 0$ exactly, i.e. $b^2 = 4ac$. Here $b^2 = 25$ but $4ac = 36$.',
        'Two distinct roots needs $\\Delta > 0$. You get a positive value only if you add $4ac$ instead of subtracting it ($25 + 36 = 61$), or if you assume every quadratic crosses the $x$-axis twice.',
        'The number of roots is a fixed property of the equation, decided by $a$, $b$ and $c$. The letter $x$ is the unknown we solve for, not something we choose.',
      ],
      keyIdea: 'The discriminant $b^2 - 4ac$ decides the number of real roots: positive gives 2, zero gives 1, negative gives none.',
    },
    check: {
      optionValues: [0, 1, 2, null],
      compute: () => realRoots(3, -5, 3).length,
    },
  },
  {
    id: 'quadratics-003',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'Expand and simplify $(2x - 3)(x + 5)$.',
    options: ['$2x^2 - 15$', '$2x^2 + 7x - 15$', '$2x^2 + 13x - 15$', '$2x^2 - 7x - 15$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Multiply every term in the first bracket by every term in the second (First, Outer, Inner, Last):\n\n' +
        '- First: $2x \\times x = 2x^2$\n' +
        '- Outer: $2x \\times 5 = 10x$\n' +
        '- Inner: $-3 \\times x = -3x$\n' +
        '- Last: $-3 \\times 5 = -15$\n\n' +
        'Add them and collect the $x$ terms: $2x^2 + 10x - 3x - 15 = 2x^2 + 7x - 15$.\n\n' +
        'Quick check with $x = 2$: $(4 - 3)(2 + 5) = 7$ and $2(4) + 7(2) - 15 = 7$.',
      whyWrong: [
        'This only multiplies the first terms and the last terms and forgets the two middle products $10x$ and $-3x$.',
        null,
        'This treats the inner product $-3 \\times x$ as $+3x$, giving $10x + 3x = 13x$. The minus sign belongs to the 3.',
        'This gets the signs of both middle products wrong ($-10x + 3x = -7x$). The outer product $2x \\times 5$ is positive.',
      ],
      keyIdea: 'When expanding two brackets, there are four products; the two middle ones combine into the $x$ term, keeping their signs.',
    },
    check: {
      // each option evaluated at x = 2
      optionValues: [2 * 4 - 15, 2 * 4 + 7 * 2 - 15, 2 * 4 + 13 * 2 - 15, 2 * 4 - 7 * 2 - 15],
      compute: () => polyAt(polyMul([2, -3], [1, 5]), 2),
    },
  },
  {
    id: 'quadratics-004',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'What is the **sum** of the roots of $2x^2 - 8x + 3 = 0$?',
    options: ['$-4$', '$\\frac{3}{2}$', '$8$', '$4$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'For $ax^2 + bx + c = 0$ with roots $\\alpha$ and $\\beta$:\n\n' +
        '$$\\alpha + \\beta = -\\frac{b}{a}, \\qquad \\alpha\\beta = \\frac{c}{a}$$\n\n' +
        'Here $a = 2$, $b = -8$, $c = 3$ (and $\\Delta = 64 - 24 = 40 > 0$, so the two roots are real).\n\n' +
        '$$\\alpha + \\beta = -\\frac{-8}{2} = \\frac{8}{2} = 4$$',
      whyWrong: [
        'This uses $\\frac{b}{a}$ instead of $-\\frac{b}{a}$: the minus sign in the formula was dropped.',
        'This is $\\frac{c}{a}$, the **product** of the roots, not the sum.',
        'This is $-b$ without dividing by $a = 2$. The formula only gives $-b$ when the $x^2$ coefficient is 1.',
        null,
      ],
      keyIdea: 'Sum of roots $= -\\frac{b}{a}$ and product of roots $= \\frac{c}{a}$; divide by $a$ and watch the sign.',
    },
    check: {
      optionValues: [-4, 3 / 2, 8, 4],
      compute: () => {
        const r = realRoots(2, -8, 3);
        return r[0] + r[1];
      },
    },
  },
  {
    id: 'quadratics-005',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'Write $x^2 - 6x + 11$ in the form $(x - p)^2 + q$.',
    options: ['$(x - 3)^2 + 2$', '$(x - 3)^2 + 20$', '$(x - 6)^2 - 25$', '$(x + 3)^2 + 2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Halve the coefficient of $x$: half of $-6$ is $-3$, so the bracket is $(x - 3)$.\n\n' +
        'Expanding the bracket gives one number too many: $(x - 3)^2 = x^2 - 6x + 9$.\n\n' +
        'So $x^2 - 6x = (x - 3)^2 - 9$, and\n\n' +
        '$$x^2 - 6x + 11 = (x - 3)^2 - 9 + 11 = (x - 3)^2 + 2$$\n\n' +
        'Check with $x = 1$: $1 - 6 + 11 = 6$ and $(1 - 3)^2 + 2 = 4 + 2 = 6$.',
      whyWrong: [
        null,
        'This adds the 9 instead of taking it away. $(x - 3)^2$ already contains $+9$, so it must be removed: $11 - 9 = 2$, not $11 + 9 = 20$.',
        'This forgets to halve the $-6$. $(x - 6)^2 = x^2 - 12x + 36$, which has the wrong $x$ term.',
        'The sign inside the bracket is wrong: $(x + 3)^2 = x^2 + 6x + 9$ gives $+6x$, but we need $-6x$.',
      ],
      keyIdea: 'Completing the square: $x^2 + bx = \\left(x + \\frac{b}{2}\\right)^2 - \\left(\\frac{b}{2}\\right)^2$.',
    },
    check: {
      // each option evaluated at x = 1
      optionValues: [(1 - 3) ** 2 + 2, (1 - 3) ** 2 + 20, (1 - 6) ** 2 - 25, (1 + 3) ** 2 + 2],
      compute: () => polyAt([1, -6, 11], 1),
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'quadratics-006',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Find the remainder when $f(x) = 2x^3 + x^2 - 5x + 4$ is divided by $(x + 2)$.',
    options: ['$14$', '$-6$', '$2$', '$-18$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Remainder theorem:** the remainder when $f(x)$ is divided by $(x - h)$ is $f(h)$.\n\n' +
        'Here $x + 2 = x - (-2)$, so $h = -2$ (set the divisor equal to zero: $x + 2 = 0$ gives $x = -2$).\n\n' +
        '$$f(-2) = 2(-2)^3 + (-2)^2 - 5(-2) + 4$$\n\n' +
        '- $2(-2)^3 = 2(-8) = -16$\n' +
        '- $(-2)^2 = 4$\n' +
        '- $-5(-2) = 10$\n\n' +
        'So $f(-2) = -16 + 4 + 10 + 4 = 2$. The remainder is $2$.',
      whyWrong: [
        'This is $f(2)$. Dividing by $(x + 2)$ means substituting $x = -2$, not $x = 2$.',
        'This works out $(-2)^2$ as $-4$. A negative number squared is positive: $(-2)^2 = 4$.',
        null,
        'This works out $-5(-2)$ as $-10$. Negative times negative is positive: $-5(-2) = +10$.',
      ],
      keyIdea: 'The remainder on dividing $f(x)$ by $(x - h)$ is $f(h)$; for $(x + 2)$ use $h = -2$.',
    },
    check: {
      optionValues: [14, -6, 2, -18],
      compute: () => synthDiv([2, 1, -5, 4], -2).r,
    },
  },
  {
    id: 'quadratics-007',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Given that $(x - 3)$ is a factor of $x^3 - 4x^2 + kx + 6$, find the value of $k$.',
    options: ['$-19$', '$1$', '$-1$', '$7$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Factor theorem:** $(x - h)$ is a factor of $f(x)$ exactly when $f(h) = 0$.\n\n' +
        'So we need $f(3) = 0$:\n\n' +
        '$$f(3) = 3^3 - 4(3^2) + 3k + 6 = 27 - 36 + 3k + 6 = 3k - 3$$\n\n' +
        'Set it to zero: $3k - 3 = 0$, so $3k = 3$ and $k = 1$.\n\n' +
        'Check: $x^3 - 4x^2 + x + 6 = (x - 3)(x^2 - x - 2) = (x - 3)(x - 2)(x + 1)$.',
      whyWrong: [
        'This sets $f(-3) = 0$: $-27 - 36 - 3k + 6 = 0$ gives $k = -19$. But the factor $(x - 3)$ means $x = 3$ makes $f$ zero, not $x = -3$.',
        null,
        'This comes from a sign slip when moving the $-3$ across: writing $3k - 3 = 0$ as $3k = -3$. Adding 3 to both sides gives $3k = 3$, so $k = 1$, not $-1$.',
        'This works out $3^3$ as $3 \\times 3 = 9$ instead of $27$: then $9 - 36 + 3k + 6 = 0$ gives $k = 7$.',
      ],
      keyIdea: 'If $(x - h)$ is a factor then $f(h) = 0$; substitute and solve for the unknown coefficient.',
    },
    check: {
      optionValues: [-19, 1, -1, 7],
      compute: () => {
        for (let k = -50; k <= 50; k++) if (polyAt([1, -4, k, 6], 3) === 0) return k;
        return NaN;
      },
    },
  },
  {
    id: 'quadratics-008',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'What is the minimum value of $2x^2 + 12x + 7$?',
    options: ['$-3$', '$-29$', '$-11$', '$-2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Complete the square. First take out the factor 2 from the $x^2$ and $x$ terms only:\n\n' +
        '$$2x^2 + 12x + 7 = 2(x^2 + 6x) + 7$$\n\n' +
        'Inside the bracket: $x^2 + 6x = (x + 3)^2 - 9$. So\n\n' +
        '$$2\\left[(x + 3)^2 - 9\\right] + 7 = 2(x + 3)^2 - 18 + 7 = 2(x + 3)^2 - 11$$\n\n' +
        'A square is never negative, so $2(x + 3)^2 \\ge 0$, and it equals 0 when $x = -3$. The smallest value of the expression is therefore $-11$ (at $x = -3$).\n\n' +
        'Check: $2(-3)^2 + 12(-3) + 7 = 18 - 36 + 7 = -11$.',
      whyWrong: [
        'This is the $x$-value where the minimum happens ($x = -3$), not the minimum value of the expression.',
        'This ignores the leading 2 and completes the square on $x^2 + 12x + 7 = (x + 6)^2 - 29$. That is a different quadratic.',
        null,
        'This forgets to multiply the $-9$ by the 2 outside the bracket: $2(x + 3)^2 - 9 + 7$ gives $-2$. The 2 multiplies everything inside the square bracket.',
      ],
      keyIdea: 'Write $ax^2 + bx + c$ as $a(x - h)^2 + k$; for $a > 0$ the minimum value is $k$, reached at $x = h$.',
    },
    check: {
      optionValues: [-3, -29, -11, -2],
      compute: () => {
        let best = Infinity;
        for (let i = -10000; i <= 10000; i++) best = Math.min(best, polyAt([2, 12, 7], i / 1000));
        return best;
      },
    },
  },
  {
    id: 'quadratics-009',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Solve $x^2 - 4x - 1 = 0$, giving your answers in exact form.',
    options: ['$x = -2 \\pm \\sqrt{5}$', '$x = 2 \\pm \\sqrt{3}$', '$x = 4 \\pm \\sqrt{5}$', '$x = 2 \\pm \\sqrt{5}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'It does not factorise nicely, so use the quadratic formula with $a = 1$, $b = -4$, $c = -1$:\n\n' +
        '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n' +
        'Discriminant: $b^2 - 4ac = (-4)^2 - 4(1)(-1) = 16 + 4 = 20$.\n\n' +
        '$$x = \\frac{4 \\pm \\sqrt{20}}{2} = \\frac{4 \\pm 2\\sqrt{5}}{2} = 2 \\pm \\sqrt{5}$$\n\n' +
        '(using $\\sqrt{20} = \\sqrt{4 \\times 5} = 2\\sqrt{5}$). Calculator check: $2 + \\sqrt{5} \\approx 4.236$ and $4.236^2 - 4(4.236) - 1 \\approx 0$.',
      whyWrong: [
        'This uses $+b$ instead of $-b$ at the start of the formula. With $b = -4$, $-b = +4$.',
        'This works out the discriminant as $16 - 4 = 12$, forgetting that $c = -1$ is negative, so $-4ac = +4$. That gives $\\frac{4 \\pm 2\\sqrt{3}}{2}$.',
        'This divides only the square-root part by 2 and leaves the 4 alone. The whole top, $4 \\pm \\sqrt{20}$, must be divided by $2a = 2$.',
        null,
      ],
      keyIdea: 'In the quadratic formula, the whole numerator $-b \\pm \\sqrt{b^2 - 4ac}$ is divided by $2a$; substitute negative values in brackets.',
    },
    check: {
      // larger root of each option
      optionValues: [-2 + Math.sqrt(5), 2 + Math.sqrt(3), 4 + Math.sqrt(5), 2 + Math.sqrt(5)],
      compute: () => Math.max(...realRoots(1, -4, -1)),
    },
  },
  {
    id: 'quadratics-010',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Solve the inequality $x^2 - x - 6 < 0$.',
    options: ['$x < -2$ or $x > 3$', '$-2 < x < 3$', '$-2 \\le x \\le 3$', '$-3 < x < 2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: find the critical values** by solving $x^2 - x - 6 = 0$:\n\n' +
        '$$x^2 - x - 6 = (x - 3)(x + 2) = 0 \\quad \\Rightarrow \\quad x = 3 \\text{ or } x = -2$$\n\n' +
        '**Step 2: sketch.** The graph of $y = x^2 - x - 6$ is a U-shape (positive $x^2$) crossing the $x$-axis at $-2$ and $3$. It is **below** the axis between the roots.\n\n' +
        '**Step 3:** we want $< 0$ (below the axis), so $-2 < x < 3$. The inequality is strict, so the endpoints are not included.\n\n' +
        'Check with $x = 0$: the expression is $-6$, which is negative, and 0 is inside the interval.',
      whyWrong: [
        'This is where the graph is **above** the axis, i.e. the solution of $x^2 - x - 6 > 0$. Test $x = 0$: it gives $-6 < 0$, so 0 must be in the answer.',
        null,
        'The endpoints should not be included: at $x = -2$ and $x = 3$ the expression equals 0, and $0 < 0$ is false.',
        'This has the signs of the critical values swapped: it comes from factorising as $(x + 3)(x - 2)$, which expands to $x^2 + x - 6$.',
      ],
      keyIdea: 'For a positive quadratic, $< 0$ means between the roots and $> 0$ means outside the roots.',
    },
    check: {
      optionValues: [
        sig((x) => x < -2 || x > 3),
        sig((x) => -2 < x && x < 3),
        sig((x) => -2 <= x && x <= 3),
        sig((x) => -3 < x && x < 2),
      ],
      compute: () => sig((x) => polyAt([1, -1, -6], x) < 0),
    },
  },
  {
    id: 'quadratics-011',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'The roots of $x^2 - 5x + 3 = 0$ are $\\alpha$ and $\\beta$. Without solving the equation, find $\\alpha^2 + \\beta^2$.',
    options: ['$19$', '$22$', '$31$', '$25$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Sum and product of roots ($a = 1$, $b = -5$, $c = 3$):\n\n' +
        '$$\\alpha + \\beta = -\\frac{b}{a} = 5, \\qquad \\alpha\\beta = \\frac{c}{a} = 3$$\n\n' +
        'Use the identity $(\\alpha + \\beta)^2 = \\alpha^2 + 2\\alpha\\beta + \\beta^2$, rearranged:\n\n' +
        '$$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = 5^2 - 2(3) = 25 - 6 = 19$$',
      whyWrong: [
        null,
        'This subtracts $\\alpha\\beta$ only once: $25 - 3 = 22$. The expansion of $(\\alpha + \\beta)^2$ contains $2\\alpha\\beta$.',
        'This adds $2\\alpha\\beta$ instead of subtracting it: $25 + 6 = 31$.',
        'This assumes $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2$, forgetting the middle term $2\\alpha\\beta$ in the expansion.',
      ],
      keyIdea: '$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$, then use sum $= -\\frac{b}{a}$ and product $= \\frac{c}{a}$.',
    },
    check: {
      optionValues: [19, 22, 31, 25],
      compute: () => realRoots(1, -5, 3).reduce((s, r) => s + r * r, 0),
    },
  },
  {
    id: 'quadratics-012',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Find all values of $k$ for which $x^2 + kx + 9 = 0$ has two distinct real roots.',
    options: ['$-6 < k < 6$', '$k > 6$', '$k < -3$ or $k > 3$', '$k < -6$ or $k > 6$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Two distinct real roots means the discriminant is **positive**: $b^2 - 4ac > 0$.\n\n' +
        'With $a = 1$, $b = k$, $c = 9$:\n\n' +
        '$$k^2 - 4(1)(9) > 0 \\quad \\Rightarrow \\quad k^2 - 36 > 0 \\quad \\Rightarrow \\quad (k - 6)(k + 6) > 0$$\n\n' +
        'This is a quadratic inequality in $k$. The critical values are $k = -6$ and $k = 6$, and $k^2 - 36$ is a U-shape, so it is positive **outside** the roots:\n\n' +
        '$$k < -6 \\text{ or } k > 6$$\n\n' +
        'Check: $k = -7$ gives $49 - 36 = 13 > 0$ (two roots), and $k = 0$ gives $-36 < 0$ (no roots).',
      whyWrong: [
        'This is where $k^2 - 36 < 0$, i.e. the values of $k$ that give **no** real roots.',
        'This takes only the positive square root of $k^2 > 36$. Negative $k$ works too: $k = -7$ gives $\\Delta = 13 > 0$.',
        'This forgets the 4 in $4ac$ and solves $k^2 - 9 > 0$.',
        null,
      ],
      keyIdea: 'Two distinct real roots means $b^2 - 4ac > 0$; solving $k^2 > 36$ gives $k < -6$ or $k > 6$, not just $k > 6$.',
    },
    check: {
      optionValues: [
        sig((k) => -6 < k && k < 6),
        sig((k) => k > 6),
        sig((k) => k < -3 || k > 3),
        sig((k) => k < -6 || k > 6),
      ],
      compute: () => sig((k) => realRoots(1, k, 9).length === 2),
    },
  },
  {
    id: 'quadratics-013',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Divide $x^3 - 2x^2 - 5x + 6$ by $(x - 1)$. What is the quotient?',
    options: ['$x^2 - 2x - 5$', '$x^2 - 3x - 2$', '$x^2 - x - 6$', '$x^2 - 3x - 8$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'First note $f(1) = 1 - 2 - 5 + 6 = 0$, so $(x - 1)$ is a factor and the remainder will be 0.\n\n' +
        '**Synthetic division** by $(x - 1)$ uses the number $1$ and the coefficients $1, -2, -5, 6$:\n\n' +
        '1. Bring down the $1$.\n' +
        '2. $1 \\times 1 = 1$; add to $-2$: $-1$.\n' +
        '3. $-1 \\times 1 = -1$; add to $-5$: $-6$.\n' +
        '4. $-6 \\times 1 = -6$; add to $6$: $0$ (the remainder).\n\n' +
        'The numbers $1, -1, -6$ are the quotient coefficients, one power lower: $x^2 - x - 6$.\n\n' +
        'Check: $(x - 1)(x^2 - x - 6) = x^3 - x^2 - 6x - x^2 + x + 6 = x^3 - 2x^2 - 5x + 6$.',
      whyWrong: [
        'This just divides each term by $x$ and drops the constant, as if dividing by $x$ rather than by $(x - 1)$.',
        'This does the synthetic division with $-1$ instead of $1$ (or subtracts instead of adding at each step). It also leaves a remainder of 8, which should be a warning since $f(1) = 0$.',
        null,
        'This comes from a sign slip in the first long-division subtraction: $-2x^2 - (-x^2)$ was worked out as $-3x^2$ instead of $-x^2$. The error carries through and leaves a remainder of $-2$.',
      ],
      keyIdea: 'Divide by $(x - h)$ with synthetic division using $h$: bring down, multiply by $h$, add, repeat; the last number is the remainder.',
    },
    check: {
      // each option evaluated at x = 4; the true quotient is found by synthetic division
      optionValues: [16 - 8 - 5, 16 - 12 - 2, 16 - 4 - 6, 16 - 12 - 8],
      compute: () => polyAt(synthDiv([1, -2, -5, 6], 1).q, 4),
    },
  },
  {
    id: 'quadratics-014',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Solve $2x^2 + 5x - 3 = 0$.',
    options: [
      '$x = -\\frac{1}{2}$ or $x = 3$',
      '$x = 1$ or $x = -3$',
      '$x = \\frac{3}{2}$ or $x = -1$',
      '$x = \\frac{1}{2}$ or $x = -3$',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Factorise using the "$ac$ method". $a \\times c = 2 \\times (-3) = -6$. Find two numbers that multiply to $-6$ and add to $b = 5$: they are $6$ and $-1$.\n\n' +
        'Split the middle term and group:\n\n' +
        '$$2x^2 + 6x - x - 3 = 2x(x + 3) - (x + 3) = (2x - 1)(x + 3)$$\n\n' +
        'Set each bracket to zero:\n\n' +
        '- $2x - 1 = 0$ gives $x = \\frac{1}{2}$\n' +
        '- $x + 3 = 0$ gives $x = -3$\n\n' +
        'Check $x = \\frac{1}{2}$: $2\\left(\\frac{1}{4}\\right) + \\frac{5}{2} - 3 = \\frac{1}{2} + \\frac{5}{2} - 3 = 0$.',
      whyWrong: [
        'Both signs are flipped. From $(2x - 1)(x + 3) = 0$, the bracket $x + 3$ is zero when $x = -3$, not $3$.',
        'This solves $2x - 1 = 0$ as $x = 1$, forgetting to divide by the 2.',
        'This uses the factorisation $(2x - 3)(x + 1)$: the outer and inner products don\'t add to $5x$ (it expands to $2x^2 - x - 3$).',
        null,
      ],
      keyIdea: 'When $a \\ne 1$, split the middle term using two numbers that multiply to $ac$ and add to $b$, then factorise by grouping.',
    },
    check: {
      // larger root of each option
      optionValues: [3, 1, 3 / 2, 1 / 2],
      compute: () => Math.max(...realRoots(2, 5, -3)),
    },
  },
  {
    id: 'quadratics-015',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Find the coefficient of $x^2$ in the expansion of $(2x - 1)(x^2 + 3x - 5)$.',
    options: ['$5$', '$7$', '$6$', '$-13$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'You don\'t need the full expansion: just find every pair of terms whose powers of $x$ add up to 2.\n\n' +
        '- $2x \\times 3x = 6x^2$\n' +
        '- $-1 \\times x^2 = -x^2$\n\n' +
        'Total: $6x^2 - x^2 = 5x^2$, so the coefficient is $5$.\n\n' +
        '(Full expansion for checking: $2x^3 + 6x^2 - 10x - x^2 - 3x + 5 = 2x^3 + 5x^2 - 13x + 5$.)',
      whyWrong: [
        null,
        'This treats $-1 \\times x^2$ as $+x^2$, losing the minus sign: $6 + 1 = 7$.',
        'This finds only $2x \\times 3x = 6x^2$ and misses the second $x^2$ term, $-1 \\times x^2$.',
        'This is the coefficient of $x$ (from $-10x - 3x$), not of $x^2$.',
      ],
      keyIdea: 'To find one coefficient, collect only the products whose powers add to the power you want, keeping every sign.',
    },
    check: {
      optionValues: [5, 7, 6, -13],
      compute: () => {
        const p = polyMul([2, -1], [1, 3, -5]); // descending: x^3, x^2, x, 1
        return p[p.length - 3];
      },
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'quadratics-016',
    subtopic: 'quadratics',
    difficulty: 'challenge',
    stem: 'Solve the inequality $(x - 1)(x + 2) \\ge 4$.',
    options: ['$x \\le -3$ or $x \\ge 2$', '$-3 \\le x \\le 2$', '$x \\le -2$ or $x \\ge 1$', '$x \\ge 2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'You can only use the "sign of each bracket" idea when one side is **zero**, so first rearrange.\n\n' +
        'Expand: $(x - 1)(x + 2) = x^2 + x - 2$. So the inequality is\n\n' +
        '$$x^2 + x - 2 \\ge 4 \\quad \\Rightarrow \\quad x^2 + x - 6 \\ge 0$$\n\n' +
        'Factorise: $(x + 3)(x - 2) \\ge 0$. Critical values: $x = -3$ and $x = 2$.\n\n' +
        'The graph of $y = x^2 + x - 6$ is a U-shape, so it is $\\ge 0$ **outside** (and at) the roots:\n\n' +
        '$$x \\le -3 \\text{ or } x \\ge 2$$\n\n' +
        'Check $x = -4$: $(-5)(-2) = 10 \\ge 4$. Check $x = 0$: $(-1)(2) = -2$, which is not $\\ge 4$.',
      whyWrong: [
        null,
        'This is the region **between** the roots, where $x^2 + x - 6 \\le 0$. Test $x = 0$: $(0 - 1)(0 + 2) = -2$, which is not $\\ge 4$.',
        'This solves $(x - 1)(x + 2) \\ge 0$, ignoring the 4 on the right. Move everything to one side before factorising.',
        'This misses the negative region. Large negative $x$ also works: $x = -4$ gives $(-5)(-2) = 10 \\ge 4$.',
      ],
      keyIdea: 'Move everything to one side so the other side is 0, factorise, find the critical values, then use the shape of the parabola.',
    },
    check: {
      optionValues: [
        sig((x) => x <= -3 || x >= 2),
        sig((x) => -3 <= x && x <= 2),
        sig((x) => x <= -2 || x >= 1),
        sig((x) => x >= 2),
      ],
      compute: () => sig((x) => (x - 1) * (x + 2) >= 4),
    },
  },
  {
    id: 'quadratics-017',
    subtopic: 'quadratics',
    difficulty: 'challenge',
    stem: 'The two roots of $x^2 - 7x + k = 0$ differ by 3. Find $k$.',
    options: ['$11.5$', '$10$', '$20$', '$-10$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let the roots be $\\alpha$ and $\\beta$ with $\\alpha - \\beta = 3$.\n\n' +
        'Sum of roots: $\\alpha + \\beta = -\\frac{b}{a} = 7$. Product: $\\alpha\\beta = k$.\n\n' +
        '**Method 1 (simultaneous equations):** adding $\\alpha + \\beta = 7$ and $\\alpha - \\beta = 3$ gives $2\\alpha = 10$, so $\\alpha = 5$ and $\\beta = 2$. Then $k = \\alpha\\beta = 5 \\times 2 = 10$.\n\n' +
        '**Method 2 (identity):** $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta$, so $9 = 49 - 4k$, giving $4k = 40$ and $k = 10$.\n\n' +
        'Check: $x^2 - 7x + 10 = (x - 2)(x - 5)$, roots 2 and 5, which differ by 3.',
      whyWrong: [
        'This sets $49 - 4k = 3$, forgetting to square the difference: it is $(\\alpha - \\beta)^2 = 9$, not 3.',
        null,
        'This uses $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$, mixing it up with the identity for $\\alpha^2 + \\beta^2$. The correct identity has $4\\alpha\\beta$.',
        'This uses $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 + 4\\alpha\\beta$ with the wrong sign, so $9 = 49 + 4k$.',
      ],
      keyIdea: 'Combine the root difference with the sum $-\\frac{b}{a}$ to find the roots, then the product $\\frac{c}{a}$ gives the unknown.',
    },
    check: {
      optionValues: [11.5, 10, 20, -10],
      compute: () => {
        for (let i = -200; i <= 200; i++) {
          const k = i / 2;
          const r = realRoots(1, -7, k);
          if (r.length === 2 && Math.abs(r[1] - r[0] - 3) < 1e-9) return k;
        }
        return NaN;
      },
    },
  },
  {
    id: 'quadratics-018',
    subtopic: 'quadratics',
    difficulty: 'challenge',
    stem: 'Let $f(x) = x^3 + ax^2 + bx - 6$. Given that $(x - 1)$ is a factor of $f(x)$, and that the remainder when $f(x)$ is divided by $(x + 1)$ is $-4$, find $a$ and $b$.',
    options: ['$a = 3$, $b = 2$', '$a = -2$, $b = 1$', '$a = 4$, $b = 1$', '$a = 4$, $b = -3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Factor theorem:** $(x - 1)$ is a factor, so $f(1) = 0$:\n\n' +
        '$$1 + a + b - 6 = 0 \\quad \\Rightarrow \\quad a + b = 5$$\n\n' +
        '**Remainder theorem:** dividing by $(x + 1)$ leaves $f(-1)$, so $f(-1) = -4$:\n\n' +
        '$$(-1)^3 + a(-1)^2 + b(-1) - 6 = -1 + a - b - 6 = -4 \\quad \\Rightarrow \\quad a - b = 3$$\n\n' +
        'Add the two equations: $2a = 8$, so $a = 4$. Then $b = 5 - 4 = 1$.\n\n' +
        'Check: $f(x) = x^3 + 4x^2 + x - 6 = (x - 1)(x + 2)(x + 3)$ and $f(-1) = -1 + 4 - 1 - 6 = -4$.',
      whyWrong: [
        'This works out $(-1)^3$ as $+1$, giving $1 + a - b - 6 = -4$, i.e. $a - b = 1$. An odd power of $-1$ is $-1$.',
        'This forgets the constant term $-6$ in both equations ($1 + a + b = 0$ and $-1 + a - b = -4$).',
        null,
        'This swaps the two conditions: it uses $f(-1) = 0$ and $f(1) = -4$. The factor $(x - 1)$ means $f(1) = 0$; the divisor $(x + 1)$ means use $f(-1)$.',
      ],
      keyIdea: 'Each factor or remainder condition gives one equation via $f(h)$; two conditions give two simultaneous equations.',
    },
    check: {
      optionValues: ['3,2', '-2,1', '4,1', '4,-3'],
      compute: () => {
        for (let a = -20; a <= 20; a++)
          for (let b = -20; b <= 20; b++)
            if (polyAt([1, a, b, -6], 1) === 0 && synthDiv([1, a, b, -6], -1).r === -4) return `${a},${b}`;
        return 'none';
      },
    },
  },
  {
    id: 'quadratics-019',
    subtopic: 'quadratics',
    difficulty: 'challenge',
    stem: 'Find all values of $k$ for which $2x^2 + kx + 8 > 0$ for **every** real number $x$.',
    options: ['$k < -8$ or $k > 8$', '$-4\\sqrt{2} < k < 4\\sqrt{2}$', '$-8 \\le k \\le 8$', '$-8 < k < 8$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The parabola $y = 2x^2 + kx + 8$ opens upwards ($a = 2 > 0$). It is above the $x$-axis for every $x$ exactly when it **never touches** the axis, i.e. it has no real roots: $\\Delta < 0$.\n\n' +
        '$$\\Delta = k^2 - 4(2)(8) = k^2 - 64 < 0$$\n\n' +
        'So $(k - 8)(k + 8) < 0$, which is true **between** the roots:\n\n' +
        '$$-8 < k < 8$$\n\n' +
        'The endpoints are excluded: when $k = 8$, $2x^2 + 8x + 8 = 2(x + 2)^2$, which equals 0 at $x = -2$, so it is not $> 0$ for every $x$.',
      whyWrong: [
        'This is where $\\Delta > 0$: then the parabola crosses the axis twice and dips below it, so it is not positive everywhere.',
        'This forgets $a = 2$ in $4ac$ and solves $k^2 - 4(8) < 0$, i.e. $k^2 < 32$.',
        'This includes $\\Delta = 0$. At $k = \\pm 8$ the parabola touches the axis, so the expression equals 0 somewhere and is not strictly positive.',
        null,
      ],
      keyIdea: 'An upward parabola is positive for all $x$ exactly when $\\Delta < 0$ (no real roots).',
    },
    check: {
      optionValues: [
        sig((k) => k < -8 || k > 8),
        sig((k) => k * k < 32),
        sig((k) => -8 <= k && k <= 8),
        sig((k) => -8 < k && k < 8),
      ],
      // the parabola's lowest point is at x = -k/4; positive everywhere iff that lowest value is > 0
      compute: () => sig((k) => polyAt([2, k, 8], -k / 4) > 0),
    },
  },
  {
    id: 'quadratics-020',
    subtopic: 'quadratics',
    difficulty: 'challenge',
    stem: 'Find all **real** solutions of $x^4 - 3x^2 - 4 = 0$.',
    options: ['$x = 4$ or $x = -1$', '$x = \\pm 2$', '$x = \\pm 2$ or $x = \\pm 1$', '$x = 2$ only'],
    correctIndex: 1,
    markScheme: {
      solution:
        'This is a quadratic "in disguise". Let $u = x^2$, so $x^4 = u^2$:\n\n' +
        '$$u^2 - 3u - 4 = 0 \\quad \\Rightarrow \\quad (u - 4)(u + 1) = 0 \\quad \\Rightarrow \\quad u = 4 \\text{ or } u = -1$$\n\n' +
        'Now go back to $x$:\n\n' +
        '- $x^2 = 4$ gives $x = 2$ or $x = -2$.\n' +
        '- $x^2 = -1$ has **no real solutions** (a real square is never negative).\n\n' +
        'So the real solutions are $x = \\pm 2$. Check: $2^4 - 3(2^2) - 4 = 16 - 12 - 4 = 0$, and the same for $-2$.',
      whyWrong: [
        'These are the values of $u = x^2$, not of $x$. You still need to solve $x^2 = 4$ and $x^2 = -1$.',
        null,
        'This treats $x^2 = -1$ as giving $x = \\pm 1$. But $1^2 = 1$, not $-1$; check: $1 - 3 - 4 = -6 \\ne 0$.',
        'This forgets the negative square root: $x^2 = 4$ also has $x = -2$, since $(-2)^4 - 3(-2)^2 - 4 = 0$.',
      ],
      keyIdea: 'Substitute $u = x^2$ to get a quadratic, solve for $u$, then solve $x^2 = u$, rejecting negative $u$ and keeping both $\\pm$ roots.',
    },
    check: {
      optionValues: ['-1,4', '-2,2', '-2,-1,1,2', '2'],
      compute: () => {
        const xs: number[] = [];
        for (const u of realRoots(1, -3, -4)) if (u >= 0) xs.push(-Math.sqrt(u), Math.sqrt(u));
        return xs
          .map((x) => Math.round(x))
          .sort((p, q) => p - q)
          .join(',');
      },
    },
  },
  {
    id: 'quadratics-021',
    subtopic: 'quadratics',
    difficulty: 'challenge',
    stem: 'The roots of $x^2 - 3x + 1 = 0$ are $\\alpha$ and $\\beta$. Which equation has roots $\\alpha^2$ and $\\beta^2$?',
    options: ['$x^2 - 7x + 1 = 0$', '$x^2 - 9x + 1 = 0$', '$x^2 + 7x + 1 = 0$', '$x^2 - 11x + 1 = 0$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'From the original equation: $\\alpha + \\beta = 3$ and $\\alpha\\beta = 1$.\n\n' +
        'A quadratic with roots $p$ and $q$ is $x^2 - (p + q)x + pq = 0$. So we need the sum and product of the **new** roots $\\alpha^2$ and $\\beta^2$:\n\n' +
        '- Sum: $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = 9 - 2 = 7$\n' +
        '- Product: $\\alpha^2\\beta^2 = (\\alpha\\beta)^2 = 1^2 = 1$\n\n' +
        'New equation: $x^2 - 7x + 1 = 0$.',
      whyWrong: [
        null,
        'This uses $(\\alpha + \\beta)^2 = 9$ as the new sum, forgetting to subtract $2\\alpha\\beta$.',
        'This gets the sign of the middle term wrong. The equation is $x^2 - (\\text{sum})x + \\text{product} = 0$, so a sum of 7 gives $-7x$.',
        'This adds $2\\alpha\\beta$ instead of subtracting it: $9 + 2 = 11$.',
      ],
      keyIdea: 'A quadratic with roots $p$ and $q$ is $x^2 - (p + q)x + pq = 0$; find the new sum and product from the old ones.',
    },
    check: {
      // coefficient of x in each option; the true one is -(alpha^2 + beta^2) from the actual roots
      optionValues: [-7, -9, 7, -11],
      compute: () => -realRoots(1, -3, 1).reduce((s, r) => s + r * r, 0),
    },
  },
];
