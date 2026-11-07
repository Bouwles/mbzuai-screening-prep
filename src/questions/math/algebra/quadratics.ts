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
      asking: 'Write $x^2 - x - 12$ as two brackets multiplied together.',
      solution:
        '**Factorise** means write the expression as two brackets multiplied together, in the form $(x + p)(x + q)$, where $p$ and $q$ are numbers.\n\n' +
        'Multiply that form out: $(x + p)(x + q) = x^2 + (p + q)x + pq$. So $p$ and $q$ must **add** to the number in front of $x$, and **multiply** to the number at the end.\n\n' +
        'Here the number in front of $x$ is $-1$, since $-x$ means $-1$ lot of $x$. The number at the end is $-12$. So we need two numbers that multiply to $-12$ and add to $-1$.\n\n' +
        'List the pairs that multiply to $-12$, with their sums:\n\n| Pair | Multiply | Add |\n|---|---|---|\n| $1$ and $-12$ | $-12$ | $-11$ |\n| $2$ and $-6$ | $-12$ | $-4$ |\n| $3$ and $-4$ | $-12$ | $-1$ |\n| $4$ and $-3$ | $-12$ | $1$ |\n\n' +
        'The pair $3$ and $-4$ adds to $-1$, so these are the numbers in the brackets: $(x - 4)(x + 3)$.',
      conclusion: 'Multiplying back gives $x^2 + 3x - 4x - 12 = x^2 - x - 12$, the expression we started with. So the answer is $(x - 4)(x + 3)$.',
      whyWrong: [
        'The numbers $4$ and $-3$ multiply to $-12$ but add to $+1$, so this expands to $x^2 + x - 12$: the signs are the wrong way round.',
        'The numbers $-6$ and $2$ multiply to $-12$ but add to $-4$, so this expands to $x^2 - 4x - 12$, not $x^2 - x - 12$.',
        null,
        'The numbers $-12$ and $1$ multiply to $-12$ but add to $-11$, so this expands to $x^2 - 11x - 12$. Only the product was checked, not the sum.',
      ],
      keyIdea: 'To factorise $x^2 + bx + c$, find two numbers that multiply to $c$ and add to $b$, then put them in brackets. If $c$ is negative, exactly one number is negative. List the pairs in a small table.',
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
      asking: 'How many real numbers $x$ make $3x^2 - 5x + 3$ equal to 0?',
      solution:
        'A **root** is a value of $x$ that makes the equation true. For a quadratic $ax^2 + bx + c = 0$, a number called the **discriminant**, $b^2 - 4ac$, tells you how many real roots there are.\n\n' +
        'It comes from the quadratic formula, $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, where it sits under the square root. Its sign decides the number of roots:\n\n| $b^2 - 4ac$ | Real roots |\n|---|---|\n| positive | 2 |\n| zero | 1 (repeated) |\n| negative | none |\n\n' +
        'Read off the numbers in $3x^2 - 5x + 3 = 0$: $a = 3$ (in front of $x^2$), $b = -5$ (in front of $x$) and $c = 3$ (the number alone).\n\n' +
        'Substitute: $b^2 - 4ac = (-5)^2 - 4 \\times 3 \\times 3 = 25 - 36 = -11$.\n\n' +
        'The result is negative. A negative number has no real square root, so the formula cannot give any real value of $x$.',
      conclusion: 'The discriminant is $-11$, which is below 0, so the answer is No real roots.',
      whyWrong: [
        null,
        'One repeated root needs $\\Delta = 0$ exactly, i.e. $b^2 = 4ac$. Here $b^2 = 25$ but $4ac = 36$.',
        'Two distinct roots needs $\\Delta > 0$. You get a positive value only if you add $4ac$ instead of subtracting it ($25 + 36 = 61$), or if you assume every quadratic crosses the $x$-axis twice.',
        'The number of roots is a fixed property of the equation, decided by $a$, $b$ and $c$. The letter $x$ is the unknown we solve for, not something we choose.',
      ],
      keyIdea: 'For "how many roots" questions, work out $b^2 - 4ac$. Positive gives two real roots, zero gives one, negative gives none. Copy the signs of $a$, $b$ and $c$ exactly: $(-5)^2$ is positive.',
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
      asking: 'Multiply the two brackets together and tidy up the result.',
      solution:
        'Every term in the first bracket must multiply every term in the second. There are two terms in each, so there are four products to find.\n\n' +
        'Find them, keeping the minus sign with the 3:\n\n| Multiply | Result |\n|---|---|\n| $2x \\times x$ | $2x^2$ |\n| $2x \\times 5$ | $10x$ |\n| $-3 \\times x$ | $-3x$ |\n| $-3 \\times 5$ | $-15$ |\n\n' +
        'Write them all together: $2x^2 + 10x - 3x - 15$.\n\n' +
        '$10x$ and $-3x$ are **like terms** (both contain just $x$), so combine them: $10x - 3x = 7x$. This gives $2x^2 + 7x - 15$.',
      conclusion: 'After combining the two middle terms, the answer is $2x^2 + 7x - 15$.',
      whyWrong: [
        'This only multiplies the first terms and the last terms and forgets the two middle products $10x$ and $-3x$.',
        null,
        'This treats the inner product $-3 \\times x$ as $+3x$, giving $10x + 3x = 13x$. The minus sign belongs to the 3.',
        'This gets the signs of both middle products wrong ($-10x + 3x = -7x$). The outer product $2x \\times 5$ is positive.',
      ],
      keyIdea: 'To expand two brackets, multiply each term in the first by each term in the second, which gives four products. Keep each sign with its number, then combine the two middle terms.',
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
      asking: 'If you added the two solutions of this equation, what would you get?',
      solution:
        'The **roots** are the two values of $x$ that solve the equation. There is a shortcut for their sum, so we do not have to find the roots themselves.\n\n' +
        'For $ax^2 + bx + c = 0$, the sum of the roots is $-\\frac{b}{a}$. Here $a$ is the number in front of $x^2$ and $b$ is the number in front of $x$. It works because the quadratic formula, $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, gives $\\frac{-b}{2a}$ plus or minus the same amount. Adding the two roots cancels that amount and leaves $\\frac{-b}{2a} + \\frac{-b}{2a} = -\\frac{b}{a}$.\n\n' +
        'Read off the numbers: $a = 2$ and $b = -8$.\n\n' +
        'Substitute: $-\\frac{b}{a} = -\\frac{-8}{2} = \\frac{8}{2} = 4$.',
      conclusion: 'The two minus signs cancel and $8 \\div 2 = 4$, so the answer is $4$.',
      whyWrong: [
        'This uses $\\frac{b}{a}$ instead of $-\\frac{b}{a}$: the minus sign in the formula was dropped.',
        'This is $\\frac{c}{a}$, the **product** of the roots, not the sum.',
        'This is $-b$ without dividing by $a = 2$. The formula only gives $-b$ when the $x^2$ coefficient is 1.',
        null,
      ],
      keyIdea: 'For $ax^2 + bx + c = 0$: the sum of the roots is $-\\frac{b}{a}$ and the product is $\\frac{c}{a}$. Use these whenever a question asks about the roots without needing their actual values.',
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
    id: 'quadratics-022',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'For $ax^2 + bx + c = 0$, which expression is the discriminant?',
    options: ['$b^2 - 4ac$', '$b^2 + 4ac$', '$\\sqrt{b^2 - 4ac}$', '$-\\frac{b}{2a}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which expression is called the discriminant of a quadratic?',
      solution:
        'The quadratic formula solves $ax^2 + bx + c = 0$: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.\n\n' +
        'The **discriminant** is just the part under the square root sign, without the root itself. It tells you how many real solutions there are. Here that part is $b^2 - 4ac$.',
      conclusion: 'The part under the root in the formula is the discriminant, so the answer is $b^2 - 4ac$.',
      whyWrong: [
        null,
        'The sign is wrong: the formula has $-4ac$, so the discriminant is $b^2 - 4ac$.',
        'This is the whole square root. The discriminant is only the expression **under** the root sign.',
        'This is the $x$-coordinate of the vertex of the parabola, not the discriminant.',
      ],
      keyIdea: 'Picture the quadratic formula and look under the root: that expression is the discriminant. Positive means two real roots, zero means one, negative means none.',
    },
    check: {
      // each option evaluated for a = 1, b = 5, c = 4, where the discriminant is (difference of the roots)^2
      optionValues: [25 - 16, 25 + 16, Math.sqrt(25 - 16), -5 / 2],
      compute: () => {
        const r = realRoots(1, 5, 4);
        return (r[1] - r[0]) ** 2;
      },
    },
  },
  {
    id: 'quadratics-023',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'A quadratic equation has discriminant $0$. How many distinct real roots does it have?',
    options: ['One', 'Two', 'None', 'Infinitely many'],
    correctIndex: 0,
    markScheme: {
      asking: 'If the discriminant is exactly 0, how many different real solutions are there?',
      solution:
        'The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. The **discriminant** is $b^2 - 4ac$, the part under the root. The $\\pm$ means one root uses $+$ and the other uses $-$.\n\n' +
        'If the discriminant is 0, then the root is $\\sqrt{0}$, which is 0. So the formula has nothing left to add or subtract.\n\n' +
        'Both versions of the formula now equal $\\frac{-b}{2a}$. The two roots are the same number, so there is just one distinct root. For example, $(x - 1)^2 = 0$ only has $x = 1$.',
      conclusion: 'With nothing under the root, the $\\pm$ makes no difference, so the answer is One.',
      whyWrong: [
        null,
        'Two distinct real roots need a **positive** discriminant, so that $\\pm\\sqrt{\\Delta}$ gives two different values.',
        'No real roots needs a **negative** discriminant, because the square root of a negative number is not real.',
        'A quadratic equation can never have more than two roots, because a parabola meets a straight line at most twice.',
      ],
      keyIdea: 'Discriminant zero means one repeated root, and the graph of the quadratic (a U-shaped curve called a parabola) just touches the $x$-axis. Use this when a question says "equal roots" or "touches": set $b^2 - 4ac = 0$.',
    },
    check: {
      // x^2 + 2x + 1 = 0 has discriminant 0
      optionValues: [1, 2, 0, null],
      compute: () => realRoots(1, 2, 1).length,
    },
  },
  {
    id: 'quadratics-024',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'The roots of $ax^2 + bx + c = 0$ are $\\alpha$ and $\\beta$. What is their product $\\alpha\\beta$?',
    options: ['$\\frac{c}{a}$', '$-\\frac{b}{a}$', '$\\frac{a}{c}$', '$-\\frac{c}{a}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do you get if you multiply the two solutions of the quadratic?',
      solution:
        '$\\alpha$ and $\\beta$ (the Greek letters alpha and beta) are just names for the two roots, the values of $x$ that solve the equation. Each bracket in $a(x - \\alpha)(x - \\beta)$ is zero at one root, so this is the same quadratic.\n\n' +
        'Multiply out the brackets: $a(x - \\alpha)(x - \\beta) = ax^2 - a(\\alpha + \\beta)x + a\\alpha\\beta$.\n\n' +
        'Compare this with $ax^2 + bx + c$. The terms with no $x$ must match, so $a\\alpha\\beta = c$. Divide both sides by $a$: $\\alpha\\beta = \\frac{c}{a}$.',
      conclusion: 'Matching the terms with no $x$ in the two forms gives the answer, $\\frac{c}{a}$.',
      whyWrong: [
        null,
        'This is the **sum** of the roots, not the product.',
        'This is upside down. The $x^2$ coefficient $a$ goes on the bottom: for $2x^2 - 8x + 6 = 0$ the roots 1 and 3 have product $\\frac{6}{2} = 3$.',
        'The minus sign belongs to the sum of the roots only. For $x^2 - 5x + 6 = 0$ the roots 2 and 3 have product $+6$.',
      ],
      keyIdea: 'For $ax^2 + bx + c = 0$: the sum of the roots is $-\\frac{b}{a}$ and the product is $\\frac{c}{a}$. A quick test: $x^2 - 5x + 6 = 0$ has roots 2 and 3, and $2 \\times 3 = 6$.',
    },
    check: {
      // each option evaluated for a = 2, b = -8, c = 6, whose roots are 1 and 3
      optionValues: [6 / 2, 8 / 2, 2 / 6, -6 / 2],
      compute: () => {
        const r = realRoots(2, -8, 6);
        return r[0] * r[1];
      },
    },
  },
  {
    id: 'quadratics-025',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'What is the degree of the polynomial $3x^4 - 2x^2 + 7$?',
    options: ['$4$', '$2$', '$3$', '$7$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the highest power of $x$ in this expression?',
      solution:
        'A **polynomial** is a sum of terms, each a number times a power of $x$. Its **degree** is the highest power of $x$ that appears.\n\n' +
        'List the powers: $3x^4$ has power 4, $-2x^2$ has power 2, and $7$ has no $x$, so power 0. The biggest of these is 4.',
      conclusion: 'The highest power of $x$ is 4, so the degree is $4$.',
      whyWrong: [
        null,
        '$2$ is the power in the middle term. The degree is the **highest** power.',
        '$3$ is the coefficient of $x^4$, not a power of $x$.',
        '$7$ is the constant term, not a power of $x$.',
      ],
      keyIdea: 'To find a degree, look only at the small powers on $x$ and pick the largest. Ignore the numbers in front of $x$ and any constant. Expand brackets first if there are any.',
    },
    check: {
      optionValues: [4, 2, 3, 7],
      compute: () => [3, 0, -2, 0, 7].length - 1, // descending coefficients
    },
  },
  {
    id: 'quadratics-026',
    subtopic: 'quadratics',
    difficulty: 'foundation',
    stem: 'Which of the following is the axis of symmetry of the parabola $y = ax^2 + bx + c$?',
    options: ['$x = -\\frac{b}{2a}$', '$x = \\frac{b}{2a}$', '$y = c$', '$x = -\\frac{b}{a}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which vertical line cuts this parabola into two mirror-image halves?',
      solution:
        'A **parabola** is the U-shaped graph of a quadratic. The **axis of symmetry** is the vertical line that folds it exactly in half, so it passes through the lowest or highest point.\n\n' +
        'The **roots**, where the parabola crosses the $x$-axis, come from the quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. That is $\\frac{-b}{2a}$ plus or minus the same amount, so they sit equally far either side of $\\frac{-b}{2a}$.\n\n' +
        'That middle value is where the mirror line must be, so the line is $x = -\\frac{b}{2a}$.',
      conclusion: 'It is the value exactly halfway between the two roots, so the answer is $x = -\\frac{b}{2a}$.',
      whyWrong: [
        null,
        'The sign is lost: the formula starts with $-b$.',
        '$y = c$ is a horizontal line through the $y$-intercept. The axis of symmetry of this parabola is vertical.',
        '$-\\frac{b}{a}$ is the **sum** of the roots. The axis is at their average, which is half of that.',
      ],
      keyIdea: 'For $y = ax^2 + bx + c$, use $x = -\\frac{b}{2a}$ to find the axis of symmetry. This is also the $x$-value of the lowest or highest point. Substitute it back in to find that point\'s $y$-value.',
    },
    check: {
      // each option evaluated for a = 1, b = -6, c = 8, whose roots are 2 and 4
      optionValues: [3, -3, 8, 6],
      compute: () => {
        const r = realRoots(1, -6, 8);
        return (r[0] + r[1]) / 2;
      },
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'quadratics-005',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Write $x^2 - 6x + 11$ in the form $(x - p)^2 + q$.',
    options: ['$(x - 3)^2 + 2$', '$(x - 3)^2 + 20$', '$(x - 6)^2 - 25$', '$(x + 3)^2 + 2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Rewrite $x^2 - 6x + 11$ so that $x$ appears only once, inside a squared bracket.',
      solution:
        'This method is called **completing the square**. We want a bracket whose square starts with $x^2 - 6x$.\n\n' +
        'Take the number in front of $x$, which is $-6$, and halve it: $-6 \\div 2 = -3$. That number goes in the bracket, giving $(x - 3)^2$.\n\n' +
        'Multiply the bracket out to see what it really gives: $(x - 3)^2 = x^2 - 6x + 9$.\n\n' +
        'That matches the start of our expression, but it ends in $+9$ and we need $+11$. We are 2 short, because $11 - 9 = 2$.\n\n' +
        'So add 2 after the bracket: $x^2 - 6x + 11 = (x - 3)^2 + 2$.',
      conclusion: 'Multiplying back out gives $x^2 - 6x + 9 + 2 = x^2 - 6x + 11$, the expression we started with, so the answer is $(x - 3)^2 + 2$.',
      whyWrong: [
        null,
        'This adds the 9 instead of taking it away. $(x - 3)^2$ already contains $+9$, so it must be removed: $11 - 9 = 2$, not $11 + 9 = 20$.',
        'This forgets to halve the $-6$. $(x - 6)^2 = x^2 - 12x + 36$, which has the wrong $x$ term.',
        'The sign inside the bracket is wrong: $(x + 3)^2 = x^2 + 6x + 9$ gives $+6x$, but we need $-6x$.',
      ],
      keyIdea: 'To write $x^2 + bx + c$ as a squared bracket: halve $b$ and put it in the bracket, square that halved number, then subtract the result from $c$ to get the number outside.',
    },
    check: {
      // each option evaluated at x = 1
      optionValues: [(1 - 3) ** 2 + 2, (1 - 3) ** 2 + 20, (1 - 6) ** 2 - 25, (1 + 3) ** 2 + 2],
      compute: () => polyAt([1, -6, 11], 1),
    },
  },
  {
    id: 'quadratics-006',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Find the remainder when $f(x) = 2x^3 + x^2 - 5x + 4$ is divided by $(x + 2)$.',
    options: ['$14$', '$-6$', '$2$', '$-18$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is left over when $f(x)$ is divided by $(x + 2)$?',
      solution:
        'The **remainder** is what is left over after dividing. We could do long division, but the **remainder theorem** is much quicker.\n\n' +
        'The theorem says: to find the remainder when $f(x)$ is divided by a bracket, put in the value of $x$ that makes the bracket zero. Then work out $f$ at that value.\n\n' +
        'It works because $f(x)$ equals the bracket times the result of the division, plus the remainder. When the bracket is zero, that first part is zero and only the remainder is left.\n\n' +
        'The bracket $(x + 2)$ is zero when $x = -2$. So we need $f(-2)$.\n\n' +
        'Substitute $x = -2$ term by term:\n\n| Term | Working | Value |\n|---|---|---|\n| $2x^3$ | $2 \\times (-2)^3 = 2 \\times (-8)$ | $-16$ |\n| $x^2$ | $(-2)^2$ | $4$ |\n| $-5x$ | $-5 \\times (-2)$ | $10$ |\n| $4$ | no $x$ here | $4$ |\n\n' +
        'Add the values: $-16 + 4 + 10 + 4 = 2$.',
      conclusion: 'Substituting $x = -2$ gives $f(-2) = 2$, and that value is the remainder, so the answer is $2$.',
      whyWrong: [
        'This is $f(2)$. Dividing by $(x + 2)$ means substituting $x = -2$, not $x = 2$.',
        'This works out $(-2)^2$ as $-4$. A negative number squared is positive: $(-2)^2 = 4$.',
        null,
        'This works out $-5(-2)$ as $-10$. Negative times negative is positive: $-5(-2) = +10$.',
      ],
      keyIdea: 'To find a remainder after dividing by a bracket, set the bracket to zero to get $x$, then substitute that $x$ into the expression. Put negative numbers in brackets so the powers come out right.',
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
      asking: 'What number must $k$ be so that $x = 3$ makes this expression zero?',
      solution:
        'A **factor** divides in exactly, leaving no remainder. The **factor theorem** says: if $(x - 3)$ is a factor of $f(x)$, then $f(3) = 0$. The value that makes the bracket zero makes the whole expression zero.\n\n' +
        'Substitute $x = 3$ into $x^3 - 4x^2 + kx + 6$: $3^3 - 4 \\times 3^2 + k \\times 3 + 6$.\n\n' +
        'Work out each number: $3^3 = 27$ and $4 \\times 3^2 = 4 \\times 9 = 36$. So the expression is $27 - 36 + 3k + 6$.\n\n' +
        'Combine the plain numbers: $27 - 36 + 6 = -3$. So it equals $3k - 3$.\n\n' +
        'Set this to 0 and solve: $3k - 3 = 0$, so $3k = 3$, so $k = 1$.',
      conclusion: 'Only $k = 1$ makes $f(3) = 0$, so the answer is $1$.',
      whyWrong: [
        'This sets $f(-3) = 0$: $-27 - 36 - 3k + 6 = 0$ gives $k = -19$. But the factor $(x - 3)$ means $x = 3$ makes $f$ zero, not $x = -3$.',
        null,
        'This comes from a sign slip when moving the $-3$ across: writing $3k - 3 = 0$ as $3k = -3$. Adding 3 to both sides gives $3k = 3$, so $k = 1$, not $-1$.',
        'This works out $3^3$ as $3 \\times 3 = 9$ instead of $27$: then $9 - 36 + 3k + 6 = 0$ gives $k = 7$.',
      ],
      keyIdea: 'When you are told $(x - a)$ is a factor, write $f(a) = 0$. Substitute, tidy up the numbers, and solve for the unknown letter. Mind the sign: $(x - 3)$ means put in $+3$.',
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
      asking: 'What is the lowest value that $2x^2 + 12x + 7$ can ever reach?',
      solution:
        'We want to write this as a squared bracket plus a number. A square can never be negative, so it is at its lowest when it equals 0. This is called **completing the square**.\n\n' +
        'Completing the square needs a plain $x^2$ with no number in front. So take the 2 out of the first two terms only: $2x^2 + 12x + 7 = 2(x^2 + 6x) + 7$.\n\n' +
        'Complete the square inside. Halve the 6 to get 3: $(x + 3)^2 = x^2 + 6x + 9$. That is 9 too many, so $x^2 + 6x = (x + 3)^2 - 9$.\n\n' +
        'Put that back in, and multiply out with the 2: $2[(x + 3)^2 - 9] + 7 = 2(x + 3)^2 - 18 + 7 = 2(x + 3)^2 - 11$.\n\n' +
        'Now look at $2(x + 3)^2$. It is never negative, and its smallest value is 0, when $x = -3$. At that point the whole expression equals $0 - 11 = -11$.',
      conclusion: 'The expression is lowest at $x = -3$, where the squared part vanishes, so the answer is $-11$.',
      whyWrong: [
        'This is the $x$-value where the minimum happens ($x = -3$), not the minimum value of the expression.',
        'This ignores the leading 2 and completes the square on $x^2 + 12x + 7 = (x + 6)^2 - 29$. That is a different quadratic.',
        null,
        'This forgets to multiply the $-9$ by the 2 outside the bracket: $2(x + 3)^2 - 9 + 7$ gives $-2$. The 2 multiplies everything inside the square bracket.',
      ],
      keyIdea: 'To find the minimum of $ax^2 + bx + c$ with $a > 0$: complete the square into $a(x + p)^2 + q$. The minimum value is $q$, reached when the bracket is 0. Or put $x = -\\frac{b}{2a}$ into the expression.',
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
      asking: 'Which exact values of $x$ solve this equation, with square roots left in?',
      solution:
        'This does not factorise with whole numbers, because no whole numbers multiply to $-1$ and add to $-4$. So use the **quadratic formula**: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.\n\n' +
        'Read the numbers from $ax^2 + bx + c = 0$: $a = 1$, $b = -4$, $c = -1$. Keep the minus signs.\n\n' +
        'Work out the part under the root: $b^2 - 4ac = (-4)^2 - 4 \\times 1 \\times (-1) = 16 + 4 = 20$.\n\n' +
        'Put it in the formula. The top starts with $-b$, and $-(-4) = 4$, so $x = \\frac{4 \\pm \\sqrt{20}}{2 \\times 1} = \\frac{4 \\pm \\sqrt{20}}{2}$.\n\n' +
        'Simplify the root. $20 = 4 \\times 5$, so $\\sqrt{20} = \\sqrt{4} \\times \\sqrt{5} = 2\\sqrt{5}$. That gives $x = \\frac{4 \\pm 2\\sqrt{5}}{2}$.\n\n' +
        'Divide both parts of the top by 2: $4 \\div 2 = 2$ and $2\\sqrt{5} \\div 2 = \\sqrt{5}$. So $x = 2 \\pm \\sqrt{5}$.',
      conclusion: 'The $\\pm$ gives both roots at once, so the answer is $x = 2 \\pm \\sqrt{5}$.',
      whyWrong: [
        'This uses $+b$ instead of $-b$ at the start of the formula. With $b = -4$, $-b = +4$.',
        'This works out the discriminant as $16 - 4 = 12$, forgetting that $c = -1$ is negative, so $-4ac = +4$. That gives $\\frac{4 \\pm 2\\sqrt{3}}{2}$.',
        'This divides only the square-root part by 2 and leaves the 4 alone. The whole top, $4 \\pm \\sqrt{20}$, must be divided by $2a = 2$.',
        null,
      ],
      keyIdea: 'When you need exact roots and factorising fails, use the quadratic formula. Simplify the square root by pulling out a square number, then divide every term on top by the bottom.',
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
      asking: 'For which values of $x$ is $x^2 - x - 6$ negative?',
      solution:
        'First find where the expression equals 0, because that is where it can change from positive to negative. Factorise: we need two numbers that multiply to $-6$ and add to $-1$. They are $-3$ and $2$, so we get $(x - 3)(x + 2)$.\n\n' +
        'Each bracket is zero at one value: $x - 3 = 0$ gives $x = 3$, and $x + 2 = 0$ gives $x = -2$.\n\n' +
        'The graph of $y = x^2 - x - 6$ is a U-shape, because the $x^2$ term is positive. It crosses the $x$-axis at $-2$ and $3$.\n\n' +
        '"Less than 0" means below the $x$-axis. A U-shape is below the axis only between its two crossing points. At the crossings the value is exactly 0, which is not less than 0, so the ends are left out.\n\n' +
        'So $x$ must lie between $-2$ and $3$: $-2 < x < 3$.',
      conclusion: 'Test $x = 0$: it gives $-6$, which is negative, and 0 is in the range. So the answer is $-2 < x < 3$.',
      whyWrong: [
        'This is where the graph is **above** the axis, i.e. the solution of $x^2 - x - 6 > 0$. Test $x = 0$: it gives $-6 < 0$, so 0 must be in the answer.',
        null,
        'The endpoints should not be included: at $x = -2$ and $x = 3$ the expression equals 0, and $0 < 0$ is false.',
        'This has the signs of the critical values swapped: it comes from factorising as $(x + 3)(x - 2)$, which expands to $x^2 + x - 6$.',
      ],
      keyIdea: 'For a quadratic inequality: move everything to one side, factorise, find the two roots and sketch the U-shape. "Less than 0" is between the roots. "Greater than 0" is the two outer parts.',
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
      asking: 'What is the sum of the squares of the two roots, worked out without finding the roots?',
      solution:
        '$\\alpha$ and $\\beta$ (alpha and beta) stand for the two roots, the solutions of the equation. For $ax^2 + bx + c = 0$ we know the sum $\\alpha + \\beta = -\\frac{b}{a}$ and the product $\\alpha\\beta = \\frac{c}{a}$.\n\n' +
        'Here $a = 1$, $b = -5$ and $c = 3$. So the sum is $-(-5) \\div 1 = 5$ and the product is $3 \\div 1 = 3$.\n\n' +
        'We need $\\alpha^2 + \\beta^2$ written using only the sum and the product. Expand the square of the sum: $(\\alpha + \\beta)^2 = \\alpha^2 + 2\\alpha\\beta + \\beta^2$.\n\n' +
        'Take $2\\alpha\\beta$ from both sides: $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$.\n\n' +
        'Substitute 5 and 3: $\\alpha^2 + \\beta^2 = 5^2 - 2 \\times 3 = 25 - 6 = 19$.',
      conclusion: 'Using the sum 5 and the product 3 gives $25 - 6$, so the answer is $19$.',
      whyWrong: [
        null,
        'This subtracts $\\alpha\\beta$ only once: $25 - 3 = 22$. The expansion of $(\\alpha + \\beta)^2$ contains $2\\alpha\\beta$.',
        'This adds $2\\alpha\\beta$ instead of subtracting it: $25 + 6 = 31$.',
        'This assumes $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2$, forgetting the middle term $2\\alpha\\beta$ in the expansion.',
      ],
      keyIdea: 'When a question says "without solving", find the sum and product of the roots from $-\\frac{b}{a}$ and $\\frac{c}{a}$. Then rewrite the target using them. For squares, use $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$.',
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
      asking: 'Which values of $k$ give this equation two different real solutions?',
      solution:
        'The number of real roots depends on the **discriminant**, $b^2 - 4ac$, the part under the root in the quadratic formula. Two different real roots need it to be positive.\n\n' +
        'Read the numbers from $x^2 + kx + 9 = 0$: $a = 1$, $b = k$ and $c = 9$.\n\n' +
        'Substitute into the discriminant: $k^2 - 4 \\times 1 \\times 9 = k^2 - 36$.\n\n' +
        'Two distinct roots need $k^2 - 36 > 0$. Add 36 to both sides: $k^2 > 36$.\n\n' +
        'Which numbers square to more than 36? Numbers above 6 do: $7^2 = 49$. Numbers below $-6$ do too: $(-7)^2 = 49$. Numbers between do not: $2^2 = 4$. So $k < -6$ or $k > 6$.',
      conclusion: 'Large positive and large negative values of $k$ both make $k^2$ exceed 36, so the answer is $k < -6$ or $k > 6$.',
      whyWrong: [
        'This is where $k^2 - 36 < 0$, i.e. the values of $k$ that give **no** real roots.',
        'This takes only the positive square root of $k^2 > 36$. Negative $k$ works too: $k = -7$ gives $\\Delta = 13 > 0$.',
        'This forgets the 4 in $4ac$ and solves $k^2 - 9 > 0$.',
        null,
      ],
      keyIdea: 'When a question says "two distinct real roots", set $b^2 - 4ac > 0$ and solve for the unknown. One repeated root means $= 0$, no real roots means $< 0$. For $k^2 > n$, $k$ lies outside $\\pm\\sqrt{n}$.',
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
      asking: 'What expression do you get when $x^3 - 2x^2 - 5x + 6$ is divided by $(x - 1)$?',
      solution:
        'The **quotient** is the result of a division. We build it one term at a time using long division, working from the highest power down.\n\n' +
        'What times $x$ gives $x^3$? It is $x^2$. Multiply: $x^2(x - 1) = x^3 - x^2$. Subtract that from the start: $(x^3 - 2x^2) - (x^3 - x^2) = -x^2$. Bring down $-5x$ to get $-x^2 - 5x$.\n\n' +
        'What times $x$ gives $-x^2$? It is $-x$. Multiply: $-x(x - 1) = -x^2 + x$. Subtract: $(-x^2 - 5x) - (-x^2 + x) = -6x$. Bring down $+6$ to get $-6x + 6$.\n\n' +
        'What times $x$ gives $-6x$? It is $-6$. Multiply: $-6(x - 1) = -6x + 6$. Subtracting leaves 0, so there is no remainder.\n\n' +
        'The three terms we found make the quotient: $x^2 - x - 6$.',
      conclusion: 'Multiplying back, $(x - 1)(x^2 - x - 6)$ expands to $x^3 - 2x^2 - 5x + 6$, the original. So the answer is $x^2 - x - 6$.',
      whyWrong: [
        'This just divides each term by $x$ and drops the constant, as if dividing by $x$ rather than by $(x - 1)$.',
        'This does the synthetic division with $-1$ instead of $1$ (or subtracts instead of adding at each step). It also leaves a remainder of 8, which should be a warning since $f(1) = 0$.',
        null,
        'This comes from a sign slip in the first long-division subtraction: $-2x^2 - (-x^2)$ was worked out as $-3x^2$ instead of $-x^2$. The error carries through and leaves a remainder of $-2$.',
      ],
      keyIdea: 'For polynomial long division: divide the first term by the $x$ in the bracket, multiply back, subtract, and bring down the next term. Repeat until nothing is left. Multiply your result by the bracket to test it.',
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
      asking: 'Which two values of $x$ make $2x^2 + 5x - 3$ equal to 0?',
      solution:
        'Try factorising. Because of the $2x^2$, one bracket starts with $2x$ and the other with $x$. The two missing numbers must multiply to $-3$, so they are $1$ and $-3$, or $-1$ and $3$.\n\n' +
        'Try each arrangement and see which gives the middle term $+5x$. The middle term comes from the outer product (the two end terms multiplied) plus the inner product (the two middle terms multiplied):\n\n| Try | Outer + inner | Middle term |\n|---|---|---|\n| $(2x + 1)(x - 3)$ | $-6x + x$ | $-5x$ |\n| $(2x - 1)(x + 3)$ | $6x - x$ | $5x$ |\n| $(2x + 3)(x - 1)$ | $-2x + 3x$ | $x$ |\n| $(2x - 3)(x + 1)$ | $2x - 3x$ | $-x$ |\n\n' +
        'The second row works, so the equation is $(2x - 1)(x + 3) = 0$.\n\n' +
        'If two things multiply to 0, at least one of them must be 0. So either $2x - 1 = 0$ or $x + 3 = 0$.\n\n' +
        'Solve each. For $2x - 1 = 0$, add 1 to get $2x = 1$, then divide by 2 to get $x = \\frac{1}{2}$. For $x + 3 = 0$, subtract 3 to get $x = -3$.',
      conclusion: 'Each value makes one bracket zero, so the whole product is zero. The answer is $x = \\frac{1}{2}$ or $x = -3$.',
      whyWrong: [
        'Both signs are flipped. From $(2x - 1)(x + 3) = 0$, the bracket $x + 3$ is zero when $x = -3$, not $3$.',
        'This solves $2x - 1 = 0$ as $x = 1$, forgetting to divide by the 2.',
        'This uses the factorisation $(2x - 3)(x + 1)$: the outer and inner products don\'t add to $5x$ (it expands to $2x^2 - x - 3$).',
        null,
      ],
      keyIdea: 'To solve a quadratic with a number in front of $x^2$: try brackets whose first terms multiply to the $x^2$ term and whose last numbers multiply to the constant. Keep the pair giving the right middle term, then set each bracket to zero.',
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
      asking: 'After multiplying out the brackets, what number sits in front of $x^2$?',
      solution:
        'The **coefficient** of $x^2$ is the number multiplying $x^2$. We do not need the full expansion. We only need the products that give $x^2$.\n\n' +
        'Each term in the first bracket multiplies each term in the second. Powers add when you multiply, so we need powers that add to 2. Two products do this.\n\n' +
        '$2x \\times 3x = 6x^2$, since powers 1 and 1 add to 2. And $-1 \\times x^2 = -x^2$, since powers 0 and 2 add to 2.\n\n' +
        'Add them: $6x^2 - x^2 = 5x^2$. The number in front is 5.',
      conclusion: 'The $x^2$ terms total $5x^2$, so the coefficient is $5$.',
      whyWrong: [
        null,
        'This treats $-1 \\times x^2$ as $+x^2$, losing the minus sign: $6 + 1 = 7$.',
        'This finds only $2x \\times 3x = 6x^2$ and misses the second $x^2$ term, $-1 \\times x^2$.',
        'This is the coefficient of $x$ (from $-10x - 3x$), not of $x^2$.',
      ],
      keyIdea: 'To find one coefficient in a product of brackets, do not expand everything. Pick only the pairs of terms whose powers add to the power you want, and add those results.',
    },
    check: {
      optionValues: [5, 7, 6, -13],
      compute: () => {
        const p = polyMul([2, -1], [1, 3, -5]); // descending: x^3, x^2, x, 1
        return p[p.length - 3];
      },
    },
  },

  {
    id: 'quadratics-016',
    subtopic: 'quadratics',
    difficulty: 'exam',
    stem: 'Solve the inequality $(x - 1)(x + 2) \\ge 4$.',
    options: ['$x \\le -3$ or $x \\ge 2$', '$-3 \\le x \\le 2$', '$x \\le -2$ or $x \\ge 1$', '$x \\ge 2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which values of $x$ make $(x - 1)(x + 2)$ at least 4?',
      solution:
        'If two brackets multiply to 0, one of them must be 0. A product equal to 4 tells us nothing like that, so we need 0 on one side. Start by expanding: $(x - 1)(x + 2) = x^2 + 2x - x - 2 = x^2 + x - 2$.\n\n' +
        'Subtract 4 from both sides to get 0 on the right: $x^2 + x - 2 - 4 \\ge 0$, so $x^2 + x - 6 \\ge 0$.\n\n' +
        'Factorise. We need two numbers that multiply to $-6$ and add to 1. They are 3 and $-2$, so $(x + 3)(x - 2) \\ge 0$.\n\n' +
        'The brackets are zero at $x = -3$ and $x = 2$. The graph of $y = x^2 + x - 6$ is a U-shape crossing the $x$-axis at those two points.\n\n' +
        'We want $\\ge 0$, meaning on or above the axis. A U-shape is above the axis on its two outer sides, not in the middle. The sign includes "equal to", so the ends count.\n\n' +
        'So $x$ is at or below $-3$, or at or above 2: $x \\le -3$ or $x \\ge 2$.',
      conclusion: 'Test $x = 3$: $(3 - 1)(3 + 2) = 10$, which is at least 4. Test $x = 0$: it gives $-2$, which is not. So the answer is $x \\le -3$ or $x \\ge 2$.',
      whyWrong: [
        null,
        'This is the region **between** the roots, where $x^2 + x - 6 \\le 0$. Test $x = 0$: $(0 - 1)(0 + 2) = -2$, which is not $\\ge 4$.',
        'This solves $(x - 1)(x + 2) \\ge 0$, ignoring the 4 on the right. Move everything to one side before factorising.',
        'This misses the negative region. Large negative $x$ also works: $x = -4$ gives $(-5)(-2) = 10 \\ge 4$.',
      ],
      keyIdea: 'For a quadratic inequality, get 0 on one side before factorising. Find the roots and sketch the U-shape. Greater than 0 means the two outer parts. Less than 0 means between the roots. Keep the ends only for $\\ge$ or $\\le$.',
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
];
