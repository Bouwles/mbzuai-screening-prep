import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'limits',
  know:
    '### What is a limit?\n\n' +
    'A **limit** describes the value a function *heads towards* as $x$ gets closer and closer to some number, even if the function is not defined exactly there. We write\n\n' +
    '$$\\lim_{x \\to a} f(x) = L$$\n\n' +
    'and read it as "the limit of $f(x)$ as $x$ tends to $a$ is $L$". It means: by taking $x$ close enough to $a$ (but not equal to $a$), $f(x)$ can be made as close to $L$ as we like. What happens **at** $x = a$ itself does not matter, only what happens **near** it.\n\n' +
    '### Step 1: always try substitution first\n\n' +
    'For "nice" functions (polynomials, $e^x$, $\\sin x$, $\\cos x$, and fractions whose bottom is not zero) just put the number in:\n\n' +
    '$$\\lim_{x \\to 2} (x^2 + 3x) = 4 + 6 = 10$$\n\n' +
    'If you get an ordinary number, you are done. There are three possible outcomes:\n\n' +
    '| Substitution gives | What it means | What to do |\n' +
    '| --- | --- | --- |\n' +
    '| a number, e.g. $\\frac{6}{3}$ | that is the limit | stop |\n' +
    '| $\\frac{\\text{non-zero}}{0}$, e.g. $\\frac{5}{0}$ | the function blows up | the limit is infinite or does not exist |\n' +
    '| $\\frac{0}{0}$ | **indeterminate** (unknown yet) | simplify, then substitute again |\n\n' +
    '### Step 2: removing $\\frac{0}{0}$ by factorising\n\n' +
    'For polynomials: if putting $x = a$ makes both top and bottom zero, then $(x - a)$ is a **factor of both** (factor theorem). Factorise, cancel the common factor (allowed, because $x \\ne a$ while approaching), and substitute again:\n\n' +
    '$$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{x - 2} = \\lim_{x \\to 2} (x + 2) = 4$$\n\n' +
    '$\\frac{0}{0}$ never means 0, never means 1, and does not mean "no limit". It means "more work needed". With square roots, use $x - 4 = (\\sqrt{x} - 2)(\\sqrt{x} + 2)$ or multiply top and bottom by the **conjugate**.\n\n' +
    '### Limits at infinity\n\n' +
    '$x \\to \\infty$ means $x$ grows without bound. The key fact is that $\\frac{\\text{number}}{x^k} \\to 0$ for any power $k > 0$. For a fraction of polynomials, divide **every** term by the highest power of $x$ in the denominator. This gives three cases, decided by the **degrees** (highest powers):\n\n' +
    '| Degrees | Limit as $x \\to \\infty$ | Example |\n' +
    '| --- | --- | --- |\n' +
    '| top = bottom | ratio of leading coefficients | $\\frac{6x^2 + 1}{3x^2 - x} \\to 2$ |\n' +
    '| top < bottom | $0$ | $\\frac{5x}{x^2 + 1} \\to 0$ |\n' +
    '| top > bottom | $\\infty$ or $-\\infty$ (no finite limit) | $\\frac{x^3}{2x + 1} \\to \\infty$ |\n\n' +
    'The **leading coefficient** is the number in front of the highest power, which is not always the first number written: in $\\frac{5 - 3x^2}{1 + 2x^2}$ it is $-3$ over $2$, so the limit is $-\\frac{3}{2}$. Under a square root, $x^2$ behaves like $x$ (for large positive $x$, $\\sqrt{x^2} = x$): $\\sqrt{9x^2 + 1} \\approx \\sqrt{9x^2} = 3x$.\n\n' +
    '### Two standard limits to memorise\n\n' +
    '- $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$, with $x$ in **radians**. More generally $\\frac{\\sin(ax)}{bx} \\to \\frac{a}{b}$, because $\\sin(ax) \\approx ax$ for small $x$.\n' +
    '- $\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^{n} = e \\approx 2.718$. More generally $\\left(1 + \\frac{k}{n}\\right)^{n} \\to e^{k}$. This is where continuous compound interest and the number $e$ come from.\n\n' +
    '### One-sided limits\n\n' +
    '$x \\to a^{-}$ means approaching from the **left** (values just below $a$); $x \\to a^{+}$ means from the **right** (just above $a$). The ordinary (two-sided) limit exists **only if both one-sided limits exist and are equal**. For example $\\frac{|x|}{x}$ is $-1$ for every negative $x$ and $1$ for every positive $x$, so the left limit at 0 is $-1$, the right limit is $1$, and $\\lim_{x \\to 0} \\frac{|x|}{x}$ does not exist. For a piecewise function, find each side using its own formula and set them equal if the question wants the limit to exist.\n\n' +
    '### The derivative is a limit (first principles)\n\n' +
    'The gradient of the curve $y = f(x)$ at a point is the limit of the gradients of chords:\n\n' +
    "$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$\n\n" +
    'Putting $h = 0$ straight in always gives $\\frac{0}{0}$, so the method is: expand $f(x + h)$, subtract $f(x)$, cancel the factor $h$, then let $h \\to 0$. For $f(x) = x^2$: $\\frac{(x + h)^2 - x^2}{h} = \\frac{2xh + h^2}{h} = 2x + h \\to 2x$.\n\n' +
    "Exam trick: if you see a limit shaped like $\\frac{f(a + h) - f(a)}{h}$, it is just $f'(a)$, so you can use differentiation rules instead of algebra.\n\n" +
    '### Why this matters for AI\n\n' +
    'Gradient descent, the algorithm that trains neural networks, is built on derivatives, and derivatives are defined by limits. Limits at infinity also describe what happens to a model as the amount of data or the number of training steps grows.',
  formulas: [
    { label: 'Direct substitution', tex: '\\lim_{x \\to a} f(x) = f(a)', note: 'Works whenever $f$ is a polynomial, or a fraction of polynomials whose bottom is not 0 at $a$ (also for $e^x$, $\\sin x$ and $\\cos x$).' },
    { label: 'Difference of two squares (for $\\frac{0}{0}$)', tex: 'x^2 - a^2 = (x - a)(x + a)', note: 'With roots: $x - a = (\\sqrt{x} - \\sqrt{a})(\\sqrt{x} + \\sqrt{a})$.' },
    { label: 'Key fact at infinity', tex: '\\lim_{x \\to \\infty} \\frac{c}{x^k} = 0 \\quad (k > 0)' },
    {
      label: 'Rational function, equal degrees',
      tex: '\\lim_{x \\to \\infty} \\frac{a x^n + \\dots}{b x^n + \\dots} = \\frac{a}{b}',
      note: 'If the top degree is lower the limit is 0; if higher there is no finite limit.',
    },
    { label: 'Standard trig limit', tex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', note: 'Radians only. Also $\\lim_{x \\to 0} \\frac{\\sin(ax)}{bx} = \\frac{a}{b}$.' },
    { label: 'Related trig limit', tex: '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}' },
    { label: 'The number e', tex: '\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^{n} = e \\approx 2.71828' },
    { label: 'Generalised e limit', tex: '\\lim_{n \\to \\infty} \\left(1 + \\frac{k}{n}\\right)^{n} = e^{k}' },
    { label: 'Two-sided limit exists', tex: '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^{-}} f(x) = \\lim_{x \\to a^{+}} f(x) = L' },
    { label: 'Derivative from first principles', tex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}", note: 'Expand, cancel $h$, then let $h \\to 0$.' },
  ],
  examples: [
    {
      title: 'Substitution and 0/0',
      problem: 'Find $\\lim_{x \\to -2} \\dfrac{x^2 + 5x + 6}{x + 2}$.',
      steps: [
        'Try substitution: top $= 4 - 10 + 6 = 0$, bottom $= -2 + 2 = 0$. This is $\\frac{0}{0}$, so $(x + 2)$ is a factor of the top.',
        'Factorise the top: two numbers that multiply to 6 and add to 5 are 2 and 3, so $x^2 + 5x + 6 = (x + 2)(x + 3)$.',
        'Cancel: $\\frac{(x + 2)(x + 3)}{x + 2} = x + 3$ for $x \\ne -2$.',
        'Substitute again: $-2 + 3 = 1$.',
      ],
      answer: '$1$',
    },
    {
      title: 'Limit at infinity',
      problem: 'Find $\\lim_{x \\to \\infty} \\dfrac{4 - 6x^2}{3x^2 + 2x}$.',
      steps: [
        'The highest power in the bottom is $x^2$. Divide every term by $x^2$: $\\frac{\\frac{4}{x^2} - 6}{3 + \\frac{2}{x}}$.',
        'As $x \\to \\infty$, $\\frac{4}{x^2} \\to 0$ and $\\frac{2}{x} \\to 0$.',
        'What is left is $\\frac{-6}{3} = -2$. (Equal degrees, so ratio of leading coefficients: $-6$ over $3$, not 4 over 3.)',
      ],
      answer: '$-2$',
    },
    {
      title: 'Standard trig limit',
      problem: 'With $x$ in radians, find $\\lim_{x \\to 0} \\dfrac{\\sin(4x)}{2x}$.',
      steps: [
        'Substitution gives $\\frac{0}{0}$, so use $\\frac{\\sin u}{u} \\to 1$ with $u = 4x$.',
        'Rewrite so the bottom matches the inside of the sine: $\\frac{\\sin(4x)}{2x} = \\frac{4}{2} \\cdot \\frac{\\sin(4x)}{4x} = 2 \\cdot \\frac{\\sin(4x)}{4x}$.',
        'As $x \\to 0$, $\\frac{\\sin(4x)}{4x} \\to 1$, so the limit is $2 \\times 1 = 2$.',
      ],
      answer: '$2$',
    },
    {
      title: 'Derivative from first principles',
      problem: "Use first principles to find $f'(x)$ for $f(x) = 3x^2 - x$.",
      steps: [
        'Work out $f(x + h) = 3(x + h)^2 - (x + h) = 3x^2 + 6xh + 3h^2 - x - h$.',
        'Subtract $f(x) = 3x^2 - x$: $f(x + h) - f(x) = 6xh + 3h^2 - h$.',
        'Divide by $h$ (allowed, $h \\ne 0$): $\\frac{6xh + 3h^2 - h}{h} = 6x + 3h - 1$.',
        'Let $h \\to 0$: $6x + 3h - 1 \\to 6x - 1$.',
        'Check with the power rule: $\\frac{d}{dx}(3x^2 - x) = 6x - 1$. It matches.',
      ],
      answer: "$f'(x) = 6x - 1$",
    },
  ],
  traps: [
    'Treating $\\frac{0}{0}$ as 0, as 1, or as "the limit does not exist". It is indeterminate: factorise (or use the conjugate or a standard limit) and substitute again.',
    'Using the "ratio of leading coefficients" rule when $x$ tends to a **number**. That rule is only for $x \\to \\infty$; for $x \\to a$ you substitute or factorise.',
    'Reading the leading coefficient as the first number written. In $\\frac{2 - 5x^3}{x^3 + 7}$ the leading coefficients are $-5$ and $1$, so the limit at infinity is $-5$, not 2.',
    'Forgetting to match the bottom to the inside of the sine: $\\frac{\\sin(3x)}{x} \\to 3$, not 1. And $\\frac{\\sin x}{x} \\to 1$ only in radians (in degrees it is $\\frac{\\pi}{180}$).',
    'Thinking $\\left(1 + \\frac{1}{n}\\right)^{n} \\to 1$ because the bracket tends to 1. The power is growing at the same time; the limit is $e$, and $\\left(1 + \\frac{k}{n}\\right)^{n} \\to e^{k}$.',
    'In first principles, expanding $(x + h)^2$ as $x^2 + h^2$ (missing the $2xh$), or letting $h \\to 0$ before cancelling the $h$ on the bottom.',
  ],
  examTip:
    'Limits appear as 4-option MCQs where the wrong options are the results of the classic mistakes: 0 (looked only at the top), 1 (treated $\\frac{0}{0}$ as 1), "does not exist" (gave up at $\\frac{0}{0}$), or the ratio of coefficients used the wrong way round. Fast checks:\n\n' +
    '- **Calculator check**: put in a value very close to the target, e.g. $x = 2.001$ for $x \\to 2$, or $x = 1000000$ for $x \\to \\infty$ (radian mode for trig). The result will be very close to exactly one option.\n' +
    '- **Degrees first** for $x \\to \\infty$: compare the highest powers before doing anything else. Lower on top means 0, equal means ratio of leading coefficients, higher on top means no finite limit.\n' +
    "- **Spot the derivative**: $\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}$ is just $f'(a)$, so differentiate instead of expanding.\n" +
    '- **Unknown constants**: if the bottom tends to 0 but the limit is finite, the top must also tend to 0. Use that equation first, then test the options.',
};
