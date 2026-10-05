import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

/**
 * Numerically solves f(y) = target for y on [lo, hi] by bisection.
 * Used by the answer checks to re-derive inverse-function values without using the algebra.
 * Requires f to be continuous on [lo, hi] with f(lo) - target and f(hi) - target of opposite signs.
 */
function solveFor(f: (x: number) => number, target: number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  const sa = Math.sign(f(a) - target);
  if (sa === Math.sign(f(b) - target)) throw new Error('solveFor: no sign change');
  for (let i = 0; i < 200; i++) {
    const mid = (a + b) / 2;
    const sm = Math.sign(f(mid) - target);
    if (sm === 0) return mid;
    if (sm === sa) a = mid;
    else b = mid;
  }
  return (a + b) / 2;
}

/** True if g(g(t)) = t at several test points (a numerical self-inverse test). */
function isSelfInverse(g: (x: number) => number, pts: number[]): boolean {
  return pts.every((t) => Math.abs(g(g(t)) - t) < 1e-9);
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'composite-inverse-001',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'Let $f(x) = 2x + 3$ and $g(x) = x^2$. Find $f(g(3))$.',
    options: ['$21$', '$81$', '$18$', '$39$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Work from the **inside out**: the function closest to the $3$ acts first.\n\n' +
        '1. Inside: $g(3) = 3^2 = 9$.\n' +
        '2. Outside: $f(9) = 2 \\times 9 + 3 = 21$.\n\n' +
        'So $f(g(3)) = 21$.',
      whyWrong: [
        null,
        'This is $g(f(3))$, the composition in the wrong order: $f(3) = 9$ and then $g(9) = 81$. In $f(g(3))$ the inner function $g$ acts first.',
        'This adds the two outputs: $f(3) + g(3) = 9 + 9 = 18$. A composite feeds one output into the other function; it does not add them.',
        'This squares $2x$ instead of replacing $x$ by $x^2$: $(2 \\times 3)^2 + 3 = 39$. The correct composite is $f(g(x)) = 2x^2 + 3$.',
      ],
      keyIdea: 'In $f(g(x))$ you apply $g$ first, then put its output into $f$.',
    },
    check: {
      optionValues: [21, 81, 18, 39],
      compute: () => {
        const f = (x: number) => 2 * x + 3;
        const g = (x: number) => x * x;
        return f(g(3));
      },
    },
  },
  {
    id: 'composite-inverse-002',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The function $f$ is defined by $f(x) = 3x - 6$. Which of the following is $f^{-1}(x)$?',
    options: ['$f^{-1}(x) = \\frac{1}{3x-6}$', '$f^{-1}(x) = \\frac{x+6}{3}$', '$f^{-1}(x) = \\frac{x-6}{3}$', '$f^{-1}(x) = \\frac{x}{3} + 6$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Write $y = 3x - 6$.\n' +
        '2. Swap $x$ and $y$: $x = 3y - 6$.\n' +
        '3. Make $y$ the subject: add $6$ to both sides, $x + 6 = 3y$.\n' +
        '4. Divide by $3$: $y = \\frac{x+6}{3}$.\n\n' +
        'So $f^{-1}(x) = \\frac{x+6}{3}$.\n\n' +
        'Check: $f(4) = 12 - 6 = 6$ and $f^{-1}(6) = \\frac{6+6}{3} = 4$. The inverse takes us back to where we started.',
      whyWrong: [
        'This is the reciprocal $\\frac{1}{f(x)}$. The $-1$ in $f^{-1}$ means "inverse function" (undo $f$), not "one over".',
        null,
        'This divides by $3$ correctly but keeps the $-6$. To undo "subtract $6$" you must **add** $6$.',
        'This undoes the steps in the wrong order: it divides by $3$ first and then adds $6$. Since $f$ multiplies by $3$ first and subtracts $6$ last, the inverse must add $6$ first and divide by $3$ last.',
      ],
      keyIdea: 'To find an inverse, swap $x$ and $y$ and make $y$ the subject (undo the steps in reverse order).',
    },
    check: {
      // value of each option at x = 6
      optionValues: [1 / 12, 4, 0, 8],
      compute: () => solveFor((x) => 3 * x - 6, 6, -100, 100),
    },
  },
  {
    id: 'composite-inverse-003',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'Given $f(x) = 2x + 1$, find $f^{-1}(7)$.',
    options: ['$15$', '$4$', '$3$', '$\\frac{1}{15}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$f^{-1}(7)$ is the input that $f$ turns into $7$. So solve $f(x) = 7$:\n\n' +
        '1. $2x + 1 = 7$\n' +
        '2. $2x = 6$\n' +
        '3. $x = 3$\n\n' +
        'Check: $f(3) = 2 \\times 3 + 1 = 7$. So $f^{-1}(7) = 3$.',
      whyWrong: [
        'This is $f(7) = 2 \\times 7 + 1 = 15$: it applies $f$ instead of undoing it.',
        'This undoes the $+1$ by adding $1$: $\\frac{7+1}{2} = 4$. To undo "add $1$" you subtract $1$.',
        null,
        'This is $\\frac{1}{f(7)}$. The notation $f^{-1}$ means the inverse function, not the reciprocal.',
      ],
      keyIdea: '$f^{-1}(k)$ is the value of $x$ that solves $f(x) = k$.',
    },
    check: {
      optionValues: [15, 4, 3, 1 / 15],
      compute: () => solveFor((x) => 2 * x + 1, 7, -100, 100),
    },
  },
  {
    id: 'composite-inverse-004',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The graph of $y = f^{-1}(x)$ can always be obtained from the graph of $y = f(x)$ by a reflection in which line?',
    options: ['the $x$-axis', 'the $y$-axis', 'the line $y = -x$', 'the line $y = x$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The inverse swaps inputs and outputs: if $f(a) = b$ then $f^{-1}(b) = a$.\n\n' +
        'So every point $(a, b)$ on $y = f(x)$ becomes the point $(b, a)$ on $y = f^{-1}(x)$.\n\n' +
        'Swapping the coordinates of every point is exactly a **reflection in the line** $y = x$. For example $(1, 4)$ and $(4, 1)$ are mirror images in $y = x$.',
      whyWrong: [
        'Reflecting in the $x$-axis sends $(a, b)$ to $(a, -b)$, which gives the graph of $y = -f(x)$, not the inverse.',
        'Reflecting in the $y$-axis sends $(a, b)$ to $(-a, b)$, which gives the graph of $y = f(-x)$, not the inverse.',
        'Reflecting in $y = -x$ sends $(a, b)$ to $(-b, -a)$: the coordinates are swapped **and** made negative. The inverse only swaps them.',
        null,
      ],
      keyIdea: 'An inverse swaps $x$ and $y$, so its graph is the mirror image of $y = f(x)$ in the line $y = x$.',
    },
  },
  {
    id: 'composite-inverse-005',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The point $(2, 5)$ lies on the graph of the one-to-one function $y = f(x)$. Which point **must** lie on the graph of $y = f^{-1}(x)$?',
    options: ['$(2, \\frac{1}{5})$', '$(5, 2)$', '$(-2, -5)$', '$(-5, -2)$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '$(2, 5)$ on $y = f(x)$ means $f(2) = 5$.\n\n' +
        'The inverse undoes this, so $f^{-1}(5) = 2$.\n\n' +
        'That means the point $(5, 2)$ is on $y = f^{-1}(x)$: just swap the coordinates (reflection in $y = x$).',
      whyWrong: [
        'This takes the reciprocal of the $y$-coordinate, mixing up $f^{-1}$ with $\\frac{1}{f}$. The inverse swaps the coordinates instead.',
        null,
        'This makes both coordinates negative, which is a rotation of $180^{\\circ}$ about the origin (the graph of $y = -f(-x)$), not the inverse.',
        'This is the reflection in the line $y = -x$ (swap **and** change both signs). The inverse is the reflection in $y = x$, which only swaps.',
      ],
      keyIdea: 'If $(a, b)$ is on $y = f(x)$ then $(b, a)$ is on $y = f^{-1}(x)$.',
    },
    check: {
      optionValues: ['2,0.2', '5,2', '-2,-5', '-5,-2'],
      compute: () => {
        const p = [2, 5];
        return `${p[1]},${p[0]}`;
      },
    },
  },
  {
    id: 'composite-inverse-006',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    stem: 'The function $f(x) = \\frac{3x-1}{x+4}$, $x \\ne -4$, has an inverse $f^{-1}$. What is the value of $f(f^{-1}(6))$?',
    options: ['$\\frac{17}{10}$', '$1$', '$6$', '$-\\frac{25}{3}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'An inverse **undoes** the function. Doing $f^{-1}$ and then $f$ gets you back to the number you started with:\n\n' +
        '$$f(f^{-1}(x)) = x$$\n\n' +
        'So $f(f^{-1}(6)) = 6$, with no algebra needed.\n\n' +
        'Check (optional): $f^{-1}(6)$ solves $\\frac{3x-1}{x+4} = 6$, so $3x - 1 = 6x + 24$, giving $x = -\\frac{25}{3}$. Then $f\\left(-\\frac{25}{3}\\right) = \\frac{-25-1}{-\\frac{25}{3}+4} = \\frac{-26}{-\\frac{13}{3}} = 6$.',
      whyWrong: [
        'This is $f(6) = \\frac{17}{10}$: it ignores the $f^{-1}$ completely.',
        'This treats $f$ and $f^{-1}$ like a number and its reciprocal that multiply to $1$. Composition is not multiplication: $f$ undoes $f^{-1}$ and returns the input $6$.',
        null,
        'This is only $f^{-1}(6) = -\\frac{25}{3}$; it stops halfway and forgets to apply $f$ to the result.',
      ],
      keyIdea: 'A function and its inverse cancel: $f(f^{-1}(x)) = x$ and $f^{-1}(f(x)) = x$.',
    },
    check: {
      optionValues: [17 / 10, 1, 6, -25 / 3],
      compute: () => {
        const f = (x: number) => (3 * x - 1) / (x + 4);
        const inv = solveFor(f, 6, -100, -4.0001);
        return Math.round(f(inv) * 1e6) / 1e6;
      },
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'composite-inverse-007',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Let $f(x) = x^2 + 1$ and $g(x) = 2x - 3$. Find $(f \\circ g)(x)$.',
    options: ['$2x^2 - 1$', '$4x^2 + 10$', '$4x^2 - 12x + 10$', '$2x^3 - 3x^2 + 2x - 3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$(f \\circ g)(x)$ means $f(g(x))$: apply $g$ first, then $f$.\n\n' +
        '1. Replace every $x$ in $f$ by $g(x) = 2x - 3$: $f(g(x)) = (2x-3)^2 + 1$.\n' +
        '2. Expand the bracket: $(2x-3)^2 = 4x^2 - 12x + 9$.\n' +
        '3. Add $1$: $4x^2 - 12x + 10$.\n\n' +
        'Check with $x = 2$: $g(2) = 1$, $f(1) = 2$, and $4(4) - 24 + 10 = 2$. Correct.',
      whyWrong: [
        'This is $(g \\circ f)(x) = 2(x^2+1) - 3 = 2x^2 - 1$, the composition in the wrong order.',
        'This expands $(2x-3)^2$ as $4x^2 + 9$, forgetting the middle term $2 \\times 2x \\times (-3) = -12x$.',
        null,
        'This multiplies the two functions: $(x^2+1)(2x-3)$. Composition substitutes one function into the other; it is not a product.',
      ],
      keyIdea: '$(f \\circ g)(x) = f(g(x))$: substitute the whole of $g(x)$ for $x$ in $f$, then simplify.',
    },
    check: {
      // value of each option at x = 2
      optionValues: [7, 26, 2, 5],
      compute: () => {
        const f = (x: number) => x * x + 1;
        const g = (x: number) => 2 * x - 3;
        return f(g(2));
      },
    },
  },
  {
    id: 'composite-inverse-008',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f$ is defined by $f(x) = \\frac{2x+1}{x-3}$, $x \\ne 3$. Find $f^{-1}(x)$.',
    options: ['$\\frac{3x+1}{2-x}$', '$\\frac{x-3}{2x+1}$', '$\\frac{3x-1}{x-2}$', '$\\frac{3x+1}{x-2}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Write $y = \\frac{2x+1}{x-3}$ and swap $x$ and $y$: $x = \\frac{2y+1}{y-3}$.\n' +
        '2. Multiply both sides by $(y - 3)$: $xy - 3x = 2y + 1$.\n' +
        '3. Collect the $y$ terms on one side: $xy - 2y = 3x + 1$.\n' +
        '4. Factorise: $y(x - 2) = 3x + 1$.\n' +
        '5. Divide: $y = \\frac{3x+1}{x-2}$.\n\n' +
        'So $f^{-1}(x) = \\frac{3x+1}{x-2}$, $x \\ne 2$.\n\n' +
        'Check: $f(4) = \\frac{9}{4-3} = 9$ and $f^{-1}(9) = \\frac{28}{7} = 4$.',
      whyWrong: [
        'This has a sign slip when collecting the $y$ terms (writing $y(2 - x)$ instead of $y(x - 2)$ while keeping $3x + 1$). The result is the negative of the true inverse.',
        'This is the reciprocal $\\frac{1}{f(x)}$, not the inverse function.',
        'This has a sign slip when moving the constant: from $xy - 3x = 2y + 1$ the $+1$ stays $+1$ on the right; it should not become $-1$.',
        null,
      ],
      keyIdea: 'For a fraction, swap $x$ and $y$, multiply out, collect the $y$ terms, factorise out $y$ and divide.',
    },
    check: {
      // value of each option at x = 4
      optionValues: [-6.5, 1 / 9, 5.5, 6.5],
      compute: () => solveFor((x) => (2 * x + 1) / (x - 3), 4, 3.0001, 1000),
    },
  },
  {
    id: 'composite-inverse-009',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f(x) = \\sqrt{x-2} + 3$ has domain $x \\ge 2$. What is the **domain** of the inverse function $f^{-1}$?',
    options: ['$x \\ge 2$', '$x \\ge 3$', '$x \\ge 0$', 'all real numbers $x$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The inverse swaps inputs and outputs, so:\n\n' +
        '- domain of $f^{-1}$ = range of $f$\n' +
        '- range of $f^{-1}$ = domain of $f$\n\n' +
        'Range of $f$: the square root is never negative, $\\sqrt{x-2} \\ge 0$, and it equals $0$ when $x = 2$. Adding $3$ gives $f(x) \\ge 3$.\n\n' +
        'So the domain of $f^{-1}$ is $x \\ge 3$. (For reference, $f^{-1}(x) = (x-3)^2 + 2$, $x \\ge 3$.)',
      whyWrong: [
        'This is the domain of $f$ itself. For the inverse, domain and range swap roles.',
        null,
        'This is the range of $\\sqrt{x-2}$ on its own; it forgets the $+3$ that shifts every output up by $3$.',
        'The formula $(x-3)^2 + 2$ can be evaluated for any $x$, but the inverse can only accept the outputs of $f$, which are all at least $3$.',
      ],
      keyIdea: 'The domain of $f^{-1}$ is the range of $f$ (and the range of $f^{-1}$ is the domain of $f$).',
    },
    check: {
      optionValues: [2, 3, 0, null],
      compute: () => {
        const f = (x: number) => Math.sqrt(x - 2) + 3;
        const outs: number[] = [];
        for (let x = 2; x <= 200; x += 0.25) outs.push(f(x));
        return Math.min(...outs);
      },
    },
  },
  {
    id: 'composite-inverse-010',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f(x) = x^3 + 2x - 7$ is increasing for all $x$, so it has an inverse. Find $f^{-1}(5)$.',
    options: ['$2$', '$128$', '$\\frac{1}{128}$', '$6$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$f^{-1}(5)$ is the input that gives an output of $5$, so solve $f(x) = 5$:\n\n' +
        '1. $x^3 + 2x - 7 = 5$\n' +
        '2. $x^3 + 2x = 12$\n' +
        '3. Try small whole numbers: $x = 2$ gives $8 + 4 = 12$. It works.\n\n' +
        'Because $f$ is increasing, this is the only solution. So $f^{-1}(5) = 2$.\n\n' +
        'You never need the formula for $f^{-1}$ (which would be very hard to find here).',
      whyWrong: [
        null,
        'This is $f(5) = 125 + 10 - 7 = 128$: it applies $f$ instead of undoing it.',
        'This is $\\frac{1}{f(5)}$, treating $f^{-1}$ as a reciprocal.',
        'This "undoes" only the linear part, $\\frac{5+7}{2} = 6$, ignoring the $x^3$ term. Check: $f(6) = 221$, not $5$.',
      ],
      keyIdea: 'To find $f^{-1}(k)$ you do not need a formula for $f^{-1}$: just solve $f(x) = k$.',
    },
    check: {
      optionValues: [2, 128, 1 / 128, 6],
      compute: () => solveFor((x) => x ** 3 + 2 * x - 7, 5, -10, 10),
    },
  },
  {
    id: 'composite-inverse-011',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Let $f(x) = 2x + 1$ and $g(x) = x^2 - 3$. Solve $g(f(x)) = 6$.',
    options: ['$x = 1$ or $x = -2$', '$x = 1$ only', '$x = 1$ or $x = -1$', '$x = 3$ or $x = -3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Build the composite (inner function $f$ first): $g(f(x)) = (2x+1)^2 - 3$.\n' +
        '2. Set it equal to $6$: $(2x+1)^2 - 3 = 6$, so $(2x+1)^2 = 9$.\n' +
        '3. Square root, keeping **both** signs: $2x + 1 = 3$ or $2x + 1 = -3$.\n' +
        '4. Solve each: $2x = 2$ gives $x = 1$; $2x = -4$ gives $x = -2$.\n\n' +
        'Check: $f(-2) = -3$ and $g(-3) = 9 - 3 = 6$. Both values work.',
      whyWrong: [
        null,
        'This keeps only the positive square root. $(2x+1)^2 = 9$ also allows $2x + 1 = -3$, which gives $x = -2$.',
        'This has an arithmetic slip in the negative case: $2x + 1 = -3$ gives $2x = -4$, not $-2$.',
        'These are the values of $f(x)$ (the solutions of $u^2 - 3 = 6$). You still have to solve $2x + 1 = \\pm 3$ to get $x$.',
      ],
      keyIdea: 'Write out the composite, solve for the inner expression first, then solve for $x$, keeping both square-root signs.',
    },
    check: {
      optionValues: ['-2,1', '1', '-1,1', '-3,3'],
      compute: () => {
        const f = (x: number) => 2 * x + 1;
        const g = (x: number) => x * x - 3;
        const sols: number[] = [];
        for (let x = -50; x <= 50; x += 0.5) if (g(f(x)) === 6) sols.push(x);
        return sols.join(',');
      },
    },
  },
  {
    id: 'composite-inverse-012',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Given $g(x) = x^2 + 1$ and $(f \\circ g)(x) = 2x^2 + 5$, find $f(x)$.',
    options: ['$f(x) = 2x + 5$', '$f(x) = 2x + 3$', '$f(x) = 2x^2 + 3$', '$f(x) = \\frac{2x^2+5}{x^2+1}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'We need $f(x^2 + 1) = 2x^2 + 5$.\n\n' +
        '1. Rewrite the right-hand side in terms of $x^2 + 1$: $2x^2 + 5 = 2(x^2 + 1) + 3$.\n' +
        '2. So $f(\\text{input}) = 2 \\times \\text{input} + 3$, where the input is $x^2 + 1$.\n' +
        '3. Hence $f(x) = 2x + 3$.\n\n' +
        'Check: $f(g(x)) = 2(x^2 + 1) + 3 = 2x^2 + 5$. Correct.',
      whyWrong: [
        'This just replaces $x^2$ by $x$ and forgets that $g$ also adds $1$. Check: $2(x^2+1) + 5 = 2x^2 + 7$, not $2x^2 + 5$.',
        null,
        'This correctly writes $2x^2 + 5 = 2(x^2 + 1) + 3$, but then replaces the block $x^2 + 1$ by $x^2$ instead of by $x$. Check: $f(g(x)) = 2(x^2+1)^2 + 3$ contains an $x^4$ term, so it cannot equal $2x^2 + 5$.',
        'This divides $(f \\circ g)(x)$ by $g(x)$, treating composition as multiplication. Composition means substitution.',
      ],
      keyIdea: 'To find the outer function, rewrite $(f \\circ g)(x)$ in terms of the inner expression $g(x)$.',
    },
    check: {
      // value of each option at x = 2
      optionValues: [9, 7, 11, 13 / 5],
      compute: () => {
        // f(2) = (f o g)(t) where g(t) = 2, i.e. t = 1
        const t = Math.sqrt(2 - 1);
        return 2 * t * t + 5;
      },
    },
  },
  {
    id: 'composite-inverse-013',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'A function is **self-inverse** if $f^{-1}(x) = f(x)$ for every $x$ in its domain. Which of these functions is self-inverse?',
    options: ['$f(x) = 5 - x$', '$f(x) = x - 5$', '$f(x) = 5x$', '$f(x) = \\frac{x}{5}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Self-inverse means applying the function twice gets you back to the start: $f(f(x)) = x$.\n\n' +
        '- $f(x) = 5 - x$: $f(f(x)) = 5 - (5 - x) = x$. Self-inverse.\n' +
        '- $f(x) = x - 5$: $f(f(x)) = x - 10$. Not self-inverse.\n' +
        '- $f(x) = 5x$: $f(f(x)) = 25x$. Not self-inverse.\n' +
        '- $f(x) = \\frac{x}{5}$: $f(f(x)) = \\frac{x}{25}$. Not self-inverse.\n\n' +
        'Graph check: $y = 5 - x$ has gradient $-1$ and is perpendicular to $y = x$, so it is its own reflection in $y = x$.',
      whyWrong: [
        null,
        'Applying it twice gives $x - 10$, not $x$. Its inverse is $x + 5$, a different function.',
        'Applying it twice gives $25x$. Its inverse is $\\frac{x}{5}$, a different function.',
        'Applying it twice gives $\\frac{x}{25}$. It is the inverse of $5x$, but it is not the inverse of itself.',
      ],
      keyIdea: '$f$ is self-inverse exactly when $f(f(x)) = x$; its graph is symmetric in the line $y = x$.',
    },
    check: {
      optionValues: ['5-x', 'x-5', '5x', 'x/5'],
      compute: () => {
        const cands: [string, (x: number) => number][] = [
          ['5-x', (x) => 5 - x],
          ['x-5', (x) => x - 5],
          ['5x', (x) => 5 * x],
          ['x/5', (x) => x / 5],
        ];
        return cands.filter(([, g]) => isSelfInverse(g, [0, 1, 2.5, 7])).map(([l]) => l).join('|');
      },
    },
  },
  {
    id: 'composite-inverse-014',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'Let $f(x) = 2x - 3$. At which point do the graphs of $y = f(x)$ and $y = f^{-1}(x)$ intersect?',
    options: ['$(1, -1)$', '$(0, -3)$', '$(\\frac{3}{2}, 0)$', '$(3, 3)$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Find the inverse: $y = 2x - 3$, swap to $x = 2y - 3$, so $f^{-1}(x) = \\frac{x+3}{2}$.\n' +
        '2. Set the two equal: $2x - 3 = \\frac{x+3}{2}$.\n' +
        '3. Multiply by $2$: $4x - 6 = x + 3$, so $3x = 9$ and $x = 3$.\n' +
        '4. Then $y = f(3) = 3$.\n\n' +
        'The intersection is $(3, 3)$. It lies on the line $y = x$, as expected: the two graphs are reflections in $y = x$. Shortcut for an increasing $f$: solve $f(x) = x$ directly, $2x - 3 = x$, $x = 3$.',
      whyWrong: [
        'This comes from solving $f(x) = -x$ (using the line $y = -x$ instead of $y = x$), or from the wrong inverse $\\frac{x-3}{2}$.',
        'This is just the $y$-intercept of $y = f(x)$; the inverse graph does not pass through it ($f^{-1}(0) = \\frac{3}{2}$, not $-3$).',
        'This is just the $x$-intercept of $y = f(x)$; it is on the graph of $f$ but not on the graph of $f^{-1}$.',
        null,
      ],
      keyIdea: 'Graphs of $f$ and $f^{-1}$ are mirror images in $y = x$, so for an increasing $f$ they meet where $f(x) = x$.',
    },
    check: {
      optionValues: ['1,-1', '0,-3', '1.5,0', '3,3'],
      compute: () => {
        const f = (x: number) => 2 * x - 3;
        const finv = (y: number) => solveFor(f, y, -1000, 1000);
        const hits: string[] = [];
        for (let x = -10; x <= 10; x += 0.5) if (Math.abs(f(x) - finv(x)) < 1e-9) hits.push(`${x},${f(x)}`);
        return hits.join('|');
      },
    },
  },
  {
    id: 'composite-inverse-015',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    stem: 'The function $f(x) = \\ln(x-1) + 2$ has domain $x > 1$. Find $f^{-1}(x)$.',
    options: ['$f^{-1}(x) = e^{x-1} + 2$', '$f^{-1}(x) = e^{x+2} - 1$', '$f^{-1}(x) = \\frac{1}{\\ln(x-1) + 2}$', '$f^{-1}(x) = e^{x-2} + 1$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. Write $y = \\ln(x-1) + 2$ and swap: $x = \\ln(y-1) + 2$.\n' +
        '2. Subtract $2$: $x - 2 = \\ln(y-1)$.\n' +
        '3. Undo $\\ln$ by taking $e$ to the power of both sides: $e^{x-2} = y - 1$.\n' +
        '4. Add $1$: $y = e^{x-2} + 1$.\n\n' +
        'So $f^{-1}(x) = e^{x-2} + 1$. Its domain is all real $x$ (the range of $f$) and its range is $y > 1$ (the domain of $f$).\n\n' +
        'Check: $f(2) = \\ln 1 + 2 = 2$ and $f^{-1}(2) = e^{0} + 1 = 2$.',
      whyWrong: [
        'This only swaps $\\ln$ for $e$ to the power and leaves the $-1$ and the $+2$ where they were. The other two steps of $f$ must be undone as well, in reverse order: subtract $2$ first, then take $e$ to the power, then add $1$.',
        'This keeps the right order but uses the wrong opposite operations: to undo "add $2$" you subtract $2$, and to undo "subtract $1$" you add $1$.',
        'This is the reciprocal $\\frac{1}{f(x)}$, not the inverse function.',
        null,
      ],
      keyIdea: 'Undo the operations in reverse order: the last step of $f$ is the first step undone, and $e^{x}$ undoes $\\ln x$.',
    },
    check: {
      // value of each option at x = 2
      optionValues: [Math.E + 2, Math.exp(4) - 1, 1 / 2, 2],
      compute: () => solveFor((x) => Math.log(x - 1) + 2, 2, 1 + 1e-7, 100),
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'composite-inverse-016',
    subtopic: 'composite-inverse',
    difficulty: 'challenge',
    stem: 'The one-to-one functions $f$ and $g$ are defined on $\\{1, 2, 3, 4, 5\\}$ by the table below. Find $(f \\circ g)^{-1}(5)$.',
    table: {
      headers: ['$x$', '1', '2', '3', '4', '5'],
      rows: [
        ['$f(x)$', 3, 5, 4, 1, 2],
        ['$g(x)$', 2, 4, 1, 5, 3],
      ],
    },
    options: ['$3$', '$4$', '$1$', '$2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '$(f \\circ g)^{-1}(5)$ is the input $x$ with $f(g(x)) = 5$. Undo the **outer** function first:\n\n' +
        '1. $f(\\text{something}) = 5$: from the table $f(2) = 5$, so $g(x) = 2$.\n' +
        '2. $g(x) = 2$: from the table $g(1) = 2$, so $x = 1$.\n\n' +
        'Check: $g(1) = 2$ and $f(2) = 5$. So $(f \\circ g)^{-1}(5) = 1$.\n\n' +
        'In symbols: $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$ (socks and shoes: the last thing put on is the first thing taken off).',
      whyWrong: [
        'This undoes in the wrong order, $f^{-1}(g^{-1}(5))$: $g^{-1}(5) = 4$ and $f^{-1}(4) = 3$. Since $g$ acts first in $f \\circ g$, you must undo $f$ first.',
        'This works forwards instead of backwards: $f(g(5)) = f(3) = 4$.',
        null,
        'This is only $f^{-1}(5) = 2$; it forgets the second step of undoing $g$.',
      ],
      keyIdea: '$(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$: undo the outer function first, then the inner one.',
    },
    check: {
      optionValues: [3, 4, 1, 2],
      compute: () => {
        const f: Record<number, number> = { 1: 3, 2: 5, 3: 4, 4: 1, 5: 2 };
        const g: Record<number, number> = { 1: 2, 2: 4, 3: 1, 4: 5, 5: 3 };
        return [1, 2, 3, 4, 5].filter((x) => f[g[x]] === 5)[0];
      },
    },
  },
  {
    id: 'composite-inverse-017',
    subtopic: 'composite-inverse',
    difficulty: 'challenge',
    stem: 'The function $f(x) = \\frac{2x+5}{x+k}$, $x \\ne -k$, is **self-inverse**. Find the value of the constant $k$.',
    options: ['$2$', '$-2$', 'There is no such value of $k$', '$\\frac{5}{2}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Find $f^{-1}$ and make it match $f$.\n\n' +
        '1. Swap: $x = \\frac{2y+5}{y+k}$.\n' +
        '2. Multiply out: $xy + kx = 2y + 5$.\n' +
        '3. Collect $y$: $xy - 2y = 5 - kx$, so $y(x - 2) = 5 - kx$.\n' +
        '4. So $f^{-1}(x) = \\frac{-kx + 5}{x - 2}$.\n' +
        '5. Compare with $f(x) = \\frac{2x + 5}{x + k}$: the denominators match when $k = -2$, and then the numerator is $2x + 5$ as well.\n\n' +
        'So $k = -2$. Check with $f(x) = \\frac{2x+5}{x-2}$: $f(3) = 11$ and $f(11) = \\frac{27}{9} = 3$. Applying $f$ twice returns $3$.\n\n' +
        'General rule: $\\frac{ax+b}{cx+d}$ is self-inverse when $d = -a$.',
      whyWrong: [
        'This comes from a sign slip, thinking the rule is $d = a$. With $k = 2$: $f(0) = \\frac{5}{2}$ but $f\\left(\\frac{5}{2}\\right) = \\frac{20}{9} \\ne 0$, so $f$ is not self-inverse.',
        null,
        'There is a value: $k = -2$ makes $f^{-1}(x) = \\frac{2x+5}{x-2} = f(x)$.',
        'This sets $2k - 5 = 0$. That makes the top exactly $2$ times the bottom, so $f(x) = 2$ for every $x$: a constant function, which has no inverse at all.',
      ],
      keyIdea: 'Self-inverse means $f^{-1} = f$ (equivalently $f(f(x)) = x$); for $\\frac{ax+b}{cx+d}$ this happens when $d = -a$.',
    },
    check: {
      optionValues: [2, -2, null, 5 / 2],
      compute: () => {
        const found: number[] = [];
        for (let k = -10; k <= 10; k += 0.5) {
          if (2 * k - 5 === 0) continue; // degenerate (constant) function
          const f = (x: number) => (2 * x + 5) / (x + k);
          if (isSelfInverse(f, [0.3, 1.7, 4.1, -6.9])) found.push(k);
        }
        return found.length === 1 ? found[0] : NaN;
      },
    },
  },
  {
    id: 'composite-inverse-018',
    subtopic: 'composite-inverse',
    difficulty: 'challenge',
    stem: 'A linear function $f(x) = ax + b$ satisfies $f^{-1}(7) = 2$ and $f^{-1}(1) = -1$. Find $f(f(1))$.',
    options: ['$13$', '$5$', '$-2$', '$25$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '$f^{-1}(7) = 2$ means $f(2) = 7$, and $f^{-1}(1) = -1$ means $f(-1) = 1$.\n\n' +
        '1. $f(2) = 7$: $2a + b = 7$.\n' +
        '2. $f(-1) = 1$: $-a + b = 1$.\n' +
        '3. Subtract the second from the first: $3a = 6$, so $a = 2$. Then $b = 1 + a = 3$.\n' +
        '4. So $f(x) = 2x + 3$.\n' +
        '5. $f(1) = 5$, then $f(f(1)) = f(5) = 13$.',
      whyWrong: [
        null,
        'This is only $f(1) = 5$; it stops after applying $f$ once.',
        'This reads $f^{-1}(7) = 2$ as $f(7) = 2$ (and $f^{-1}(1) = -1$ as $f(1) = -1$), giving the wrong line $f(x) = \\frac{x - 3}{2}$, and then $f(f(1)) = f(-1) = -2$.',
        'This squares $f(1)$: $5^2 = 25$. But $f(f(1))$ means apply $f$ twice, not multiply $f(1)$ by itself.',
      ],
      keyIdea: '$f^{-1}(b) = a$ is the same fact as $f(a) = b$; turn inverse information into ordinary equations.',
    },
    check: {
      optionValues: [13, 5, -2, 25],
      compute: () => {
        // 2a + b = 7, -a + b = 1 solved by Cramer's rule with exact fractions
        const det = 2 * 1 - 1 * -1;
        const a = new Frac(7 * 1 - 1 * 1, det);
        const b = new Frac(2 * 1 - -1 * 7, det);
        const f = (x: Frac) => a.mul(x).add(b);
        return f(f(new Frac(1))).value();
      },
    },
  },
  {
    id: 'composite-inverse-019',
    subtopic: 'composite-inverse',
    difficulty: 'challenge',
    stem: 'Given $g(x) = 2x - 1$ and $(g \\circ f)(x) = 6x + 5$, find $f^{-1}(x)$.',
    options: ['$\\frac{x+1}{2}$', '$3x + 3$', '$\\frac{x-5}{6}$', '$\\frac{x-3}{3}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. $(g \\circ f)(x) = g(f(x)) = 2f(x) - 1$.\n' +
        '2. Set equal: $2f(x) - 1 = 6x + 5$, so $2f(x) = 6x + 6$ and $f(x) = 3x + 3$.\n' +
        '3. Invert: $y = 3x + 3$, swap to $x = 3y + 3$, so $3y = x - 3$ and $y = \\frac{x-3}{3}$.\n\n' +
        'So $f^{-1}(x) = \\frac{x-3}{3}$. Check: $f(2) = 9$ and $f^{-1}(9) = \\frac{6}{3} = 2$.',
      whyWrong: [
        'This is $g^{-1}(x)$, the inverse of the wrong function.',
        'This is $f(x)$ itself; it forgets the final step of inverting.',
        'This is $(g \\circ f)^{-1}(x)$, the inverse of the whole composite $6x + 5$, not of $f$.',
        null,
      ],
      keyIdea: 'Find the unknown inner function from the composite first, then invert it.',
    },
    check: {
      // value of each option at x = 9
      optionValues: [5, 30, 2 / 3, 2],
      compute: () => {
        const gf = (x: number) => 6 * x + 5;
        const f = (x: number) => (gf(x) + 1) / 2; // undo g
        return solveFor(f, 9, -100, 100);
      },
    },
  },
  {
    id: 'composite-inverse-020',
    subtopic: 'composite-inverse',
    difficulty: 'challenge',
    stem: 'The function $f(x) = x^2 - 4x + 7$ has domain $x \\ge 2$. Which of the following is its inverse?',
    options: [
      '$f^{-1}(x) = 2 - \\sqrt{x-3}$, $x \\ge 3$',
      '$f^{-1}(x) = 2 + \\sqrt{x-3}$, $x \\ge 3$',
      '$f^{-1}(x) = 2 + \\sqrt{x+3}$, $x \\ge -3$',
      '$f^{-1}(x) = \\sqrt{x-3} - 2$, $x \\ge 3$',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Complete the square: $x^2 - 4x + 7 = (x-2)^2 - 4 + 7 = (x-2)^2 + 3$.\n' +
        '2. So the range of $f$ (for $x \\ge 2$) is $y \\ge 3$; this will be the domain of $f^{-1}$.\n' +
        '3. Swap: $x = (y-2)^2 + 3$, so $(y-2)^2 = x - 3$.\n' +
        '4. Square root: $y - 2 = \\pm\\sqrt{x-3}$. The original domain was $x \\ge 2$, so the outputs of $f^{-1}$ must be at least $2$: take the $+$ sign.\n' +
        '5. $y = 2 + \\sqrt{x-3}$.\n\n' +
        'So $f^{-1}(x) = 2 + \\sqrt{x-3}$, $x \\ge 3$. Check: $f(5) = 25 - 20 + 7 = 12$ and $f^{-1}(12) = 2 + 3 = 5$.',
      whyWrong: [
        'This takes the negative square root, which gives outputs of $2$ or less. That is the inverse of the **other** half of the parabola ($x \\le 2$), not of this $f$.',
        null,
        'This completes the square wrongly as $(x-2)^2 - 3$: since $(x-2)^2 = x^2 - 4x + 4$, you need $+3$ to reach $+7$.',
        'This undoes the $-2$ inside the bracket by subtracting $2$; to undo "subtract $2$" you must add $2$.',
      ],
      keyIdea: 'Complete the square to invert a quadratic, and use the restricted domain to choose the sign of the square root.',
    },
    check: {
      // value of each option at x = 12
      optionValues: [-1, 5, 2 + Math.sqrt(15), 1],
      compute: () => solveFor((x) => x * x - 4 * x + 7, 12, 2, 100),
    },
  },
  {
    id: 'composite-inverse-021',
    subtopic: 'composite-inverse',
    difficulty: 'challenge',
    stem: 'Let $f(x) = \\frac{1}{1-x}$. Start with $x_0 = 2$ and apply $f$ repeatedly: $x_1 = f(x_0)$, $x_2 = f(x_1)$, and so on. What is $x_{100}$?',
    options: ['$\\frac{1}{2}$', '$2$', '$1$', '$-1$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Work out the first few values:\n\n' +
        '1. $x_1 = f(2) = \\frac{1}{1-2} = -1$\n' +
        '2. $x_2 = f(-1) = \\frac{1}{1-(-1)} = \\frac{1}{2}$\n' +
        '3. $x_3 = f\\left(\\frac{1}{2}\\right) = \\frac{1}{1 - \\frac{1}{2}} = 2$\n\n' +
        'We are back at $2$, so the values repeat in a cycle of length $3$: $2, -1, \\frac{1}{2}, 2, -1, \\frac{1}{2}, \\dots$ (in fact $f(f(f(x))) = x$).\n\n' +
        'So $x_n$ depends only on the remainder when $n$ is divided by $3$. $100 = 3 \\times 33 + 1$, remainder $1$, so $x_{100} = x_1 = -1$.',
      whyWrong: [
        'This is $x_2$ (or $x_{101}$): an off-by-one slip when matching the remainder to the cycle. Remainder $1$ matches $x_1 = -1$.',
        'This assumes $x_{100}$ is back at the start, but the cycle returns to $2$ only at multiples of $3$ ($x_{99} = 2$), and $100$ is not a multiple of $3$.',
        'This treats applying $f$ one hundred times as raising $f(2)$ to the power $100$: $(-1)^{100} = 1$. Repeated composition is not a power of the output.',
        null,
      ],
      keyIdea: 'When repeated composition cycles back to the start, use the remainder of the step count to find any later value.',
    },
    check: {
      optionValues: [1 / 2, 2, 1, -1],
      compute: () => {
        let x = new Frac(2);
        for (let i = 0; i < 100; i++) x = new Frac(1).div(new Frac(1).sub(x));
        return x.value();
      },
    },
  },
];
