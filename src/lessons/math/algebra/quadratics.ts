import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'quadratics',
  know:
    '### What is a quadratic?\n\n' +
    'A **quadratic** is an expression like $ax^2 + bx + c$, where $a \\ne 0$. The highest power of $x$ is 2. Its graph is a **parabola**: a U-shape when $a > 0$ and an upside-down U when $a < 0$. The **roots** (solutions of $ax^2 + bx + c = 0$) are where the graph crosses the $x$-axis.\n\n' +
    'A **polynomial** is the same idea with any whole-number powers, e.g. the cubic $x^3 - 2x^2 + 5$.\n\n' +
    '### Expanding brackets\n\n' +
    'Multiply **every** term in one bracket by **every** term in the other, then collect like terms. For two brackets there are four products:\n\n' +
    '$$(2x - 3)(x + 5) = 2x^2 + 10x - 3x - 15 = 2x^2 + 7x - 15$$\n\n' +
    'Keep each sign with its number: the $-3$ is negative in every product it appears in.\n\n' +
    '### Factorising\n\n' +
    'Factorising is expanding in reverse. For $x^2 + bx + c$, find two numbers that **multiply to** $c$ and **add to** $b$. For $x^2 + 2x - 15$: $5 \\times (-3) = -15$ and $5 + (-3) = 2$, so $x^2 + 2x - 15 = (x + 5)(x - 3)$.\n\n' +
    'When $a \\ne 1$, use the **ac method**: find two numbers that multiply to $ac$ and add to $b$, split the middle term with them, and factorise in pairs.\n\n' +
    'Two special patterns are worth recognising instantly: $a^2 - b^2 = (a - b)(a + b)$ and $a^2 + 2ab + b^2 = (a + b)^2$.\n\n' +
    '### Solving by factorising\n\n' +
    'If two things multiply to give 0, at least one of them is 0. So once $(x + 5)(x - 3) = 0$, either $x = -5$ or $x = 3$. Notice the root has the **opposite sign** to the number in the bracket. The equation must equal **zero** first: never factorise $x^2 + 2x = 15$ as it stands.\n\n' +
    '### The quadratic formula\n\n' +
    'Works for every quadratic, even ones that do not factorise:\n\n' +
    '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n' +
    'Put negative values in brackets when substituting, and remember the **whole** top is divided by $2a$.\n\n' +
    '### Completing the square\n\n' +
    'Rewrite $x^2 + bx + c$ using a perfect square. Halve $b$, square the bracket, then subtract what the bracket adds by mistake:\n\n' +
    '$$x^2 - 6x + 11 = (x - 3)^2 - 9 + 11 = (x - 3)^2 + 2$$\n\n' +
    'Because a square is never negative, the smallest value of $(x - 3)^2 + 2$ is $2$, at $x = 3$. So the **vertex** (turning point) is $(3, 2)$. If $a \\ne 1$, factor $a$ out of the $x^2$ and $x$ terms first.\n\n' +
    '### The discriminant\n\n' +
    'The part under the square root, $\\Delta = b^2 - 4ac$, tells you how many real roots there are without solving:\n\n' +
    '| Discriminant | Real roots | Graph |\n' +
    '| --- | --- | --- |\n' +
    '| $\\Delta > 0$ | two different roots | crosses the $x$-axis twice |\n' +
    '| $\\Delta = 0$ | one repeated root | touches the axis |\n' +
    '| $\\Delta < 0$ | no real roots | misses the axis |\n\n' +
    'Exam questions often hide a letter $k$ in the equation and ask for which $k$ there are equal roots, two roots or no roots: set up $\\Delta = 0$, $\\Delta > 0$ or $\\Delta < 0$ and solve for $k$.\n\n' +
    '### Sum and product of roots\n\n' +
    'If $\\alpha$ and $\\beta$ are the roots of $ax^2 + bx + c = 0$, then $\\alpha + \\beta = -\\frac{b}{a}$ and $\\alpha\\beta = \\frac{c}{a}$. Other expressions are rewritten in terms of these, e.g. $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$.\n\n' +
    '### Quadratic inequalities\n\n' +
    '1. Move everything to one side so the other side is 0.\n' +
    '2. Solve the equation to find the **critical values**.\n' +
    '3. Sketch the parabola. For $a > 0$: "$< 0$" means **between** the roots, "$> 0$" means **outside** them.\n\n' +
    'Use $\\le$ or $\\ge$ (endpoints included) only if the question does.\n\n' +
    '### Factor and remainder theorems\n\n' +
    'When a polynomial $f(x)$ is divided by $(x - h)$, the **remainder is** $f(h)$. If that remainder is 0, then $(x - h)$ is a **factor**. To use them, set the divisor equal to zero: for $(x + 2)$, substitute $x = -2$.\n\n' +
    '### Polynomial division\n\n' +
    'To divide by $(x - h)$ quickly, use **synthetic division**: write the coefficients, bring the first one down, then repeatedly multiply by $h$ and add to the next coefficient. The last number is the remainder; the others are the quotient, one power lower. This is how you finish factorising a cubic once you have found one factor.\n\n' +
    'You may also see **long division**, which does the same job in the style of ordinary long division. Repeat three moves: divide the leading term by $x$, multiply the whole divisor by that result, and **subtract** (watch the signs). For $(x^3 + 2x^2 - 5x - 6) \\div (x - 2)$:\n\n' +
    '1. $x^3 \\div x = x^2$. Multiply: $x^2(x - 2) = x^3 - 2x^2$. Subtract: $2x^2 - (-2x^2) = 4x^2$, leaving $4x^2 - 5x - 6$.\n' +
    '2. $4x^2 \\div x = 4x$. Multiply: $4x(x - 2) = 4x^2 - 8x$. Subtract: $-5x - (-8x) = 3x$, leaving $3x - 6$.\n' +
    '3. $3x \\div x = 3$. Multiply: $3(x - 2) = 3x - 6$. Subtract: remainder $0$.\n\n' +
    'So the quotient is $x^2 + 4x + 3$ and the remainder is $0$, i.e. $x^3 + 2x^2 - 5x - 6 = (x - 2)(x^2 + 4x + 3) = (x - 2)(x + 1)(x + 3)$. The remainder theorem agrees: $f(2) = 8 + 8 - 10 - 6 = 0$.',
  formulas: [
    { label: 'Quadratic formula', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', note: 'Roots of $ax^2 + bx + c = 0$.' },
    { label: 'Discriminant', tex: '\\Delta = b^2 - 4ac', note: 'Positive: 2 real roots. Zero: 1 repeated root. Negative: no real roots.' },
    { label: 'Completing the square', tex: 'x^2 + bx + c = \\left(x + \\frac{b}{2}\\right)^2 - \\left(\\frac{b}{2}\\right)^2 + c' },
    { label: 'Vertex form', tex: 'a(x - h)^2 + k', note: 'Vertex (turning point) at $(h, k)$; for $a > 0$ the minimum value is $k$.' },
    { label: 'Vertex x-coordinate', tex: 'x = -\\frac{b}{2a}', note: 'The axis of symmetry, halfway between the roots.' },
    { label: 'Sum of roots', tex: '\\alpha + \\beta = -\\frac{b}{a}' },
    { label: 'Product of roots', tex: '\\alpha\\beta = \\frac{c}{a}' },
    { label: 'Sum of squares of roots', tex: '\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta' },
    { label: 'Square of difference of roots', tex: '(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta' },
    { label: 'Quadratic from its roots', tex: 'x^2 - (\\alpha + \\beta)x + \\alpha\\beta = 0' },
    { label: 'Difference of two squares', tex: 'a^2 - b^2 = (a - b)(a + b)' },
    { label: 'Perfect squares', tex: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2' },
    { label: 'Remainder theorem', tex: 'f(x) \\div (x - h) \\text{ leaves remainder } f(h)' },
    { label: 'Factor theorem', tex: 'f(h) = 0 \\iff (x - h) \\text{ is a factor of } f(x)' },
    { label: 'Division identity', tex: 'f(x) = (x - h)\\,q(x) + r', note: '$q(x)$ is the quotient and $r = f(h)$ is the remainder.' },
  ],
  examples: [
    {
      title: 'Solve by factorising',
      problem: 'Solve $x^2 + 2x = 15$.',
      steps: [
        'Make one side zero: $x^2 + 2x - 15 = 0$.',
        'Find two numbers that multiply to $-15$ and add to $2$: $5$ and $-3$.',
        'Factorise: $(x + 5)(x - 3) = 0$.',
        'Set each bracket to zero: $x + 5 = 0$ gives $x = -5$; $x - 3 = 0$ gives $x = 3$.',
        'Check $x = 3$: $9 + 6 = 15$. Check $x = -5$: $25 - 10 = 15$.',
      ],
      answer: '$x = -5$ or $x = 3$',
    },
    {
      title: 'Use the quadratic formula',
      problem: 'Solve $x^2 + 2x - 4 = 0$, giving exact answers.',
      steps: [
        'Two numbers that multiply to $-4$ and add to $2$ do not exist among the whole numbers, so use the formula with $a = 1$, $b = 2$, $c = -4$.',
        'Discriminant first: $b^2 - 4ac = 2^2 - 4(1)(-4) = 4 + 16 = 20$. It is positive, so there are two real roots.',
        'Substitute: $x = \\dfrac{-2 \\pm \\sqrt{20}}{2(1)} = \\dfrac{-2 \\pm \\sqrt{20}}{2}$.',
        'Simplify the surd: $\\sqrt{20} = \\sqrt{4 \\times 5} = 2\\sqrt{5}$, so $x = \\dfrac{-2 \\pm 2\\sqrt{5}}{2}$.',
        'Divide **every** term on top by 2: $x = -1 \\pm \\sqrt{5}$.',
        'Calculator check: $-1 + \\sqrt{5} \\approx 1.236$, and $1.236^2 + 2(1.236) - 4 \\approx 0$.',
      ],
      answer: '$x = -1 + \\sqrt{5}$ or $x = -1 - \\sqrt{5}$',
    },
    {
      title: 'Complete the square to find the minimum',
      problem: 'Write $x^2 + 8x + 5$ in the form $(x + p)^2 + q$ and state its minimum value.',
      steps: [
        'Halve the coefficient of $x$: half of 8 is 4, so the bracket is $(x + 4)$.',
        'Expand it: $(x + 4)^2 = x^2 + 8x + 16$, which is 16 too much.',
        'So $x^2 + 8x + 5 = (x + 4)^2 - 16 + 5 = (x + 4)^2 - 11$.',
        'A square is never negative, so the smallest value of $(x + 4)^2$ is 0, at $x = -4$.',
        'The minimum value is therefore $-11$, at $x = -4$.',
      ],
      answer: '$(x + 4)^2 - 11$, minimum value $-11$ (at $x = -4$)',
    },
    {
      title: 'Factor theorem with an unknown',
      problem: 'Given that $(x + 2)$ is a factor of $f(x) = x^3 + kx^2 - x - 2$, find $k$ and then factorise $f(x)$ fully.',
      steps: [
        'Factor $(x + 2)$ means $f(-2) = 0$.',
        '$f(-2) = (-2)^3 + k(-2)^2 - (-2) - 2 = -8 + 4k + 2 - 2 = 4k - 8$.',
        'Set $4k - 8 = 0$, so $k = 2$ and $f(x) = x^3 + 2x^2 - x - 2$.',
        'Synthetic division by $(x + 2)$ uses $-2$ with coefficients $1, 2, -1, -2$: bring down 1; $1 \\times (-2) = -2$, add to 2 gives 0; $0 \\times (-2) = 0$, add to $-1$ gives $-1$; $-1 \\times (-2) = 2$, add to $-2$ gives 0 (remainder).',
        'Quotient: $x^2 - 1 = (x - 1)(x + 1)$ (difference of two squares).',
        'So $f(x) = (x + 2)(x - 1)(x + 1)$.',
      ],
      answer: '$k = 2$ and $f(x) = (x + 2)(x - 1)(x + 1)$',
    },
    {
      title: 'Discriminant and an inequality in k',
      problem: 'Find the values of $k$ for which $x^2 + kx + 4 = 0$ has **no** real roots.',
      steps: [
        'No real roots means $\\Delta < 0$.',
        'With $a = 1$, $b = k$, $c = 4$: $\\Delta = k^2 - 4(1)(4) = k^2 - 16$.',
        'Solve $k^2 - 16 < 0$, i.e. $(k - 4)(k + 4) < 0$. Critical values: $k = -4$ and $k = 4$.',
        'The graph of $k^2 - 16$ is a U-shape, so it is negative **between** the critical values.',
        'Check $k = 0$: $x^2 + 4 = 0$ has no real roots. Correct.',
      ],
      answer: '$-4 < k < 4$',
    },
  ],
  traps: [
    'Sign of the roots: $(x - 3)(x + 5) = 0$ gives $x = 3$ and $x = -5$, the **opposite** signs to the numbers in the brackets.',
    'Not making the equation equal to zero first. $(x - 1)(x + 2) = 4$ does **not** mean $x - 1 = 4$ or $x + 2 = 4$; expand and rearrange to $x^2 + x - 6 = 0$.',
    'Quadratic formula slips: forgetting that $-b$ flips the sign of $b$, not bracketing negatives (so $(-4)^2$ becomes $-16$), and dividing only the square root by $2a$ instead of the whole top.',
    'Completing the square with $a \\ne 1$: after taking out the factor $a$, the number you subtract must also be multiplied by $a$.',
    'Inequalities: solving $k^2 > 36$ as just $k > 6$ (it is $k < -6$ or $k > 6$), or using $\\le$ when the question says $<$.',
    'Remainder theorem: dividing by $(x + 2)$ means substituting $x = -2$, not $x = 2$. Also, the sum of roots is $-\\frac{b}{a}$, not $\\frac{b}{a}$ or $-b$.',
  ],
  examTip:
    'Most quadratic MCQs can be checked by **plugging the options back in**, which is often faster than solving. For "solve" questions, substitute the values from an option into the equation on your calculator: the right option makes it equal 0 for **both** values. For "factorise" or "expand" questions, pick a simple number like $x = 2$ and evaluate the original and each option: the correct option gives the same value. For inequalities, test a point inside each option range (e.g. $x = 0$) and a point outside it in the original inequality. For "how many roots", work out $b^2 - 4ac$ and look only at its sign. Wrong options are usually built from one sign slip, so always check the signs of your answer carefully before moving on.',
};
