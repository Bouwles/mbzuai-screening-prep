import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'domain-range',
  know:
    '### What a function is\n\n' +
    'A **function** is a rule that takes an input and gives back **exactly one** output. Think of it as a machine: put a number in, one number comes out. ' +
    'We write $f(x) = 2x + 1$ to say "the function called $f$ doubles the input and adds 1".\n\n' +
    '### Function notation\n\n' +
    '$f(3)$ means "the output when the input is 3". To find it, replace **every** $x$ with 3: $f(3) = 2(3) + 1 = 7$. ' +
    'Always put the input in brackets, especially when it is negative: with $g(x) = x^2 - x$, $g(-2) = (-2)^2 - (-2) = 4 + 2 = 6$.\n\n' +
    'The input can also be an expression. $f(x + 1)$ means substitute the whole bracket: $f(x + 1) = 2(x + 1) + 1 = 2x + 3$. ' +
    'This is **not** the same as $f(x) + 1 = 2x + 2$. The first changes the input, the second changes the output.\n\n' +
    'Facts like "$f(2) = 5$" are just equations: substitute $x = 2$ into the formula and set it equal to 5. This is how you find unknown coefficients.\n\n' +
    '### Domain: which inputs are allowed\n\n' +
    'The **domain** is the set of all inputs you are allowed to use. When a question asks for the "largest possible domain", start with all real numbers and remove anything that breaks the maths. In this course there are only three things that break:\n\n' +
    '| Danger | Rule | Example |\n' +
    '|---|---|---|\n' +
    '| Dividing by zero | denominator $\\ne 0$ | $\\frac{1}{x - 4}$: $x \\ne 4$ |\n' +
    '| Square root of a negative | inside $\\ge 0$ | $\\sqrt{x - 5}$: $x \\ge 5$ |\n' +
    '| Log of zero or a negative | inside $> 0$ | $\\ln(x + 2)$: $x > -2$ |\n\n' +
    'Notice the difference between the last two: $\\sqrt{0} = 0$ is fine (so use $\\ge$), but $\\ln 0$ does not exist (so use $>$). ' +
    'A square root in a **denominator**, like $\\frac{1}{\\sqrt{x}}$, needs inside $> 0$, because the bottom cannot be 0.\n\n' +
    'When a function has several parts, **every** condition must hold, so the domain is the overlap. ' +
    'Remember the inequality rule: if you multiply or divide both sides by a **negative** number, **reverse** the inequality sign.\n\n' +
    '### Range: which outputs come out\n\n' +
    'The **range** is the set of all outputs the function actually produces. Learn the ranges of the basic functions and then adjust:\n\n' +
    '- $x^2 \\ge 0$, so $x^2 + 3 \\ge 3$.\n' +
    '- $\\sqrt{x} \\ge 0$.\n' +
    '- $\\ln x$ (defined for $x > 0$) gives every real number.\n' +
    '- $2^x > 0$ (never 0), so $2^x + 3 > 3$. The asymptote value is never reached.\n' +
    '- A linear function like $3x - 1$ on all real $x$ gives every real number.\n' +
    '- $\\frac{1}{x}$ gives every real number **except** 0.\n\n' +
    'For a quadratic $ax^2 + bx + c$ on all real $x$, find the vertex: $x = \\frac{-b}{2a}$, then work out the output there. If $a > 0$ (U shape) the range is $\\ge$ that value; if $a < 0$ (upside-down U) it is $\\le$ that value.\n\n' +
    'If the domain is **restricted** (for example $0 \\le x \\le 5$), check the vertex (if it is inside the interval) **and** both endpoints; the smallest and largest of these give the range.\n\n' +
    'For $\\frac{ax + b}{cx + d}$, the value $\\frac{a}{c}$ (the horizontal asymptote) is missing from the range.\n\n' +
    '### Piecewise functions\n\n' +
    'A piecewise function uses different formulas on different parts of the domain. To evaluate one, **first** check which condition the input satisfies, **then** use that formula. Watch the boundary: with "$x < 3$" and "$x \\ge 3$", the input 3 belongs to the second piece. ' +
    'In code, a piecewise function is just an `if` / `elif` / `else` chain.\n\n' +
    '### One-to-one functions\n\n' +
    'A function is **one-to-one** if different inputs always give different outputs. Graph test: every horizontal line crosses the graph **at most once**. ' +
    '$x^3$ and $2x + 1$ are one-to-one; $x^2$ is not, because $f(-2) = f(2) = 4$. ' +
    'You can make a function one-to-one by **restricting the domain**: $x^2$ with $x \\ge 0$ is one-to-one. One-to-one functions are exactly the ones that have an inverse.',
  formulas: [
    { label: 'Function notation', tex: 'f(a) = \\text{the output when every } x \\text{ is replaced by } a', note: 'Use brackets when substituting, especially for negatives.' },
    { label: 'Fraction', tex: '\\frac{p(x)}{q(x)}: \\quad q(x) \\ne 0', note: 'Exclude zeros of the denominator only.' },
    { label: 'Square root', tex: '\\sqrt{g(x)}: \\quad g(x) \\ge 0' },
    { label: 'Logarithm', tex: '\\ln g(x) \\text{ or } \\log g(x): \\quad g(x) > 0', note: 'Strict: $\\ln 0$ is not defined.' },
    { label: 'Root in a denominator', tex: '\\frac{1}{\\sqrt{g(x)}}: \\quad g(x) > 0' },
    { label: 'Vertex of a quadratic', tex: 'x = \\frac{-b}{2a}, \\qquad \\text{range: } f(x) \\ge f\\left(\\frac{-b}{2a}\\right) \\text{ if } a > 0', note: 'Use $\\le$ when $a < 0$.' },
    { label: 'Exponential range', tex: 'a^x + k > k \\quad (a > 0, a \\ne 1)', note: 'The asymptote value $k$ is never reached.' },
    { label: 'Rational function range', tex: 'f(x) = \\frac{ax + b}{cx + d}: \\quad f(x) \\ne \\frac{a}{c}', note: 'Needs $c \\ne 0$; this value is the horizontal asymptote.' },
    { label: 'One-to-one', tex: 'f(x_1) = f(x_2) \\implies x_1 = x_2', note: 'Horizontal line test: every horizontal line meets the graph at most once.' },
    { label: 'Dividing an inequality by a negative', tex: '-2x \\ge -6 \\implies x \\le 3', note: 'Reverse the sign whenever you multiply or divide by a negative number.' },
  ],
  examples: [
    {
      title: 'Evaluating with a negative input',
      problem: 'Given $f(x) = 2x^2 - 5x + 3$, find $f(-1)$.',
      steps: [
        'Substitute $-1$ in brackets for every $x$: $f(-1) = 2(-1)^2 - 5(-1) + 3$.',
        'Power first: $(-1)^2 = 1$, so the first term is $2 \\times 1 = 2$.',
        'Middle term: $-5 \\times (-1) = +5$.',
        'Add: $2 + 5 + 3 = 10$.',
      ],
      answer: '$f(-1) = 10$',
    },
    {
      title: 'Domain with a root and a fraction',
      problem: 'Find the largest possible domain of $f(x) = \\frac{\\sqrt{x + 1}}{x - 2}$.',
      steps: [
        'Square root: the inside must be zero or positive, $x + 1 \\ge 0$, so $x \\ge -1$.',
        'Fraction: the denominator cannot be zero, $x - 2 \\ne 0$, so $x \\ne 2$.',
        'Both must hold: start from $x \\ge -1$ and remove $x = 2$.',
        'Check the ends: $f(-1) = \\frac{0}{-3} = 0$ is fine; $f(2)$ would divide by 0.',
      ],
      answer: '$x \\ge -1$, $x \\ne 2$',
    },
    {
      title: 'Range of a quadratic',
      problem: 'Find the range of $f(x) = -x^2 + 4x + 1$, $x \\in \\mathbb{R}$.',
      steps: [
        'Here $a = -1$, $b = 4$. Vertex: $x = \\frac{-b}{2a} = \\frac{-4}{-2} = 2$.',
        'Output at the vertex: $f(2) = -4 + 8 + 1 = 5$.',
        'Since $a = -1 < 0$ the parabola opens downwards, so 5 is the **maximum**.',
        'Every value at or below 5 is reached.',
      ],
      answer: '$f(x) \\le 5$',
    },
    {
      title: 'Range on a restricted domain (exam level)',
      problem: 'The function $g(x) = x^2 - 2x - 3$ has domain $-2 \\le x \\le 2$. Find its range.',
      steps: [
        'Vertex: $x = \\frac{-b}{2a} = \\frac{2}{2} = 1$, which is inside the domain.',
        'At the vertex: $g(1) = 1 - 2 - 3 = -4$. The parabola opens upwards, so this is the minimum.',
        'Left endpoint: $g(-2) = 4 + 4 - 3 = 5$.',
        'Right endpoint: $g(2) = 4 - 4 - 3 = -3$.',
        'Smallest of $\\{-4, 5, -3\\}$ is $-4$; largest is $5$.',
      ],
      answer: '$-4 \\le g(x) \\le 5$',
    },
  ],
  traps: [
    'Writing $(-3)^2$ as $-9$. On a calculator type the brackets: $(-3)^2 = 9$, but $-3^2$ is read as $-(3^2) = -9$.',
    'Thinking $f(x + 2)$ is the same as $f(x) + 2$. The first replaces the input with $x + 2$; the second adds 2 to the output.',
    'Using $>$ for square roots or $\\ge$ for logs. $\\sqrt{0} = 0$ is allowed, but $\\ln 0$ is not.',
    'Forgetting to reverse the inequality when dividing by a negative: $6 - 2x \\ge 0$ gives $x \\le 3$, not $x \\ge 3$.',
    'Excluding zeros of the numerator from the domain. Only the denominator matters: $\\frac{0}{5} = 0$ is fine.',
    'Mixing up domain and range, or giving the $x$-coordinate of the vertex as the range boundary instead of the $y$-value.',
  ],
  examTip:
    'These questions are quick if you **test numbers instead of doing algebra**. For a domain question, pick an $x$ that is in one option but not another and plug it into the function on your calculator: if you get an error (Math ERROR), that $x$ is not in the domain, so eliminate every option that contains it. ' +
    'Always test the **boundary** value itself to decide between $\\ge$ and $>$. ' +
    'For a range question, the vertex formula $x = \\frac{-b}{2a}$ gives the turning point in seconds; check the sign of $a$ to decide between $\\ge$ and $\\le$. If a range option is just the $y$-intercept $f(0)$ or the vertex $x$-value, it is usually a trap (unless the vertex happens to be at $x = 0$). ' +
    'For "$f(x + 2)$" or "$f(2a)$" type questions, choose a test value such as $x = 1$, work out the true value, and see which option matches. ' +
    'For piecewise functions, circle the boundary sign ($<$ or $\\le$) before substituting.',
};
