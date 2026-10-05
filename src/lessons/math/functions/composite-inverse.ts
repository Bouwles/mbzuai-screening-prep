import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'composite-inverse',
  know:
    '### Functions as machines\n\n' +
    'A function is a rule that takes an input and gives exactly one output. Think of it as a machine: $f(x) = 2x + 3$ means "double the input, then add $3$". So $f(4) = 2 \\times 4 + 3 = 11$.\n\n' +
    'The **domain** is the set of inputs you are allowed to use. The **range** is the set of outputs you can get.\n\n' +
    '### Composite functions: one machine after another\n\n' +
    'A composite function feeds the output of one function straight into another. We write\n\n' +
    '$$(f \\circ g)(x) = f(g(x))$$\n\n' +
    'Read it from the **inside out**: the function closest to $x$ acts first. In $f(g(x))$, you apply $g$ first and then $f$.\n\n' +
    'Example with $f(x) = 2x + 3$ and $g(x) = x^2$:\n\n' +
    '- $f(g(3))$: first $g(3) = 9$, then $f(9) = 21$.\n' +
    '- $g(f(3))$: first $f(3) = 9$, then $g(9) = 81$.\n\n' +
    'The answers are different, so **order matters**: in general $f(g(x)) \\ne g(f(x))$.\n\n' +
    'To find the composite as a formula, replace every $x$ in the outer function by the whole inner function (in brackets): $f(g(x)) = 2(x^2) + 3 = 2x^2 + 3$, while $g(f(x)) = (2x + 3)^2 = 4x^2 + 12x + 9$.\n\n' +
    'Composition is **not** multiplication: $f(g(x))$ is not $f(x) \\times g(x)$.\n\n' +
    '### Inverse functions: the undo machine\n\n' +
    'The inverse $f^{-1}$ undoes $f$. If $f$ sends $a$ to $b$, then $f^{-1}$ sends $b$ back to $a$:\n\n' +
    '$$f(a) = b \\iff f^{-1}(b) = a$$\n\n' +
    'Warning: the $-1$ is **not** a power here. $f^{-1}(x)$ is not $\\frac{1}{f(x)}$.\n\n' +
    'Only **one-to-one** functions have inverses (each output comes from just one input). For example $x^2$ on all real numbers is not one-to-one, because $(-3)^2 = 3^2 = 9$; but if we restrict the domain to $x \\ge 0$ it is.\n\n' +
    '### How to find an inverse (the 3-step method)\n\n' +
    '1. Write $y = f(x)$.\n' +
    '2. Swap $x$ and $y$.\n' +
    '3. Rearrange to make $y$ the subject. That $y$ is $f^{-1}(x)$.\n\n' +
    'For $f(x) = 3x - 6$: $y = 3x - 6$, swap to $x = 3y - 6$, so $y = \\frac{x+6}{3}$.\n\n' +
    'Another way to think about it: undo the steps in **reverse order**. $f$ does "times $3$, then minus $6$", so $f^{-1}$ does "plus $6$, then divide by $3$". Like taking off shoes before socks.\n\n' +
    'To find a single value like $f^{-1}(7)$ you do not need the formula: just solve $f(x) = 7$.\n\n' +
    '### Domain and range swap\n\n' +
    'Because the inverse swaps inputs and outputs:\n\n' +
    '| | $f$ | $f^{-1}$ |\n' +
    '|---|---|---|\n' +
    '| inputs | domain of $f$ | range of $f$ |\n' +
    '| outputs | range of $f$ | domain of $f$ |\n\n' +
    'So the domain of $f^{-1}$ is the range of $f$. Example: $f(x) = \\sqrt{x - 2} + 3$, $x \\ge 2$, has range $f(x) \\ge 3$, so $f^{-1}$ has domain $x \\ge 3$.\n\n' +
    '### Cancelling: $f$ and its inverse\n\n' +
    'Doing a function and then its inverse (in either order) brings you back where you started: $f(f^{-1}(x)) = x$ and $f^{-1}(f(x)) = x$. So $f(f^{-1}(6)) = 6$ without any working.\n\n' +
    'For a composite, undo the **outer** function first: $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$.\n\n' +
    '### Graphs: reflection in $y = x$\n\n' +
    'Swapping inputs and outputs swaps the coordinates of every point: $(a, b)$ on $y = f(x)$ becomes $(b, a)$ on $y = f^{-1}(x)$. Geometrically this is a **reflection in the line** $y = x$. If the two graphs meet, an increasing function meets its inverse on that line, so you can find the meeting point by solving $f(x) = x$.\n\n' +
    '### Self-inverse functions\n\n' +
    'A function is **self-inverse** if $f^{-1} = f$, which is the same as $f(f(x)) = x$. Its graph is symmetric about $y = x$. Common examples: $f(x) = -x$, $f(x) = c - x$, $f(x) = \\frac{k}{x}$ (for any $k \\ne 0$), and $f(x) = \\frac{ax + b}{cx - a}$ with $c \\ne 0$ (the **constant** on the bottom is minus the $x$-coefficient on top), as long as it is not a constant function.',
  formulas: [
    { label: 'Composite function', tex: '(f \\circ g)(x) = f(g(x))', note: 'Apply $g$ first (inside), then $f$. Usually $f(g(x)) \\ne g(f(x))$.' },
    { label: 'Definition of the inverse', tex: 'f(a) = b \\iff f^{-1}(b) = a', note: 'To find $f^{-1}(k)$, solve $f(x) = k$.' },
    { label: 'Function and inverse cancel', tex: 'f(f^{-1}(x)) = x \\quad \\text{and} \\quad f^{-1}(f(x)) = x' },
    { label: 'Finding an inverse', tex: 'y = f(x) \\;\\Rightarrow\\; \\text{swap } x \\text{ and } y \\;\\Rightarrow\\; \\text{solve for } y', note: 'Equivalently, undo the steps of $f$ in reverse order.' },
    { label: 'Domain and range swap', tex: '\\text{domain of } f^{-1} = \\text{range of } f, \\qquad \\text{range of } f^{-1} = \\text{domain of } f' },
    { label: 'Inverse of a composite', tex: '(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}', note: 'Undo the outer function first (socks and shoes).' },
    { label: 'Graph of the inverse', tex: '(a, b) \\text{ on } y = f(x) \\iff (b, a) \\text{ on } y = f^{-1}(x)', note: 'A reflection in the line $y = x$.' },
    { label: 'Self-inverse', tex: 'f^{-1} = f \\iff f(f(x)) = x' },
    { label: 'Inverse of a linear function', tex: 'f(x) = ax + b \\;\\Rightarrow\\; f^{-1}(x) = \\frac{x - b}{a}' },
    { label: 'Inverse of a rational function', tex: 'f(x) = \\frac{ax + b}{cx + d} \\;\\Rightarrow\\; f^{-1}(x) = \\frac{dx - b}{a - cx}', note: 'When $c \\ne 0$, it is self-inverse exactly when $d = -a$.' },
  ],
  examples: [
    {
      title: 'Evaluating a composite',
      problem: 'Let $f(x) = 3x - 1$ and $g(x) = x^2 + 2$. Find $f(g(2))$ and $g(f(2))$.',
      steps: [
        'For $f(g(2))$ the inner function is $g$: $g(2) = 2^2 + 2 = 6$.',
        'Then apply $f$: $f(6) = 3 \\times 6 - 1 = 17$.',
        'For $g(f(2))$ the inner function is $f$: $f(2) = 3 \\times 2 - 1 = 5$.',
        'Then apply $g$: $g(5) = 5^2 + 2 = 27$.',
      ],
      answer: '$f(g(2)) = 17$ and $g(f(2)) = 27$: the order changes the answer.',
    },
    {
      title: 'Finding a linear inverse and using it',
      problem: 'Let $f(x) = 5x + 2$. Find $f^{-1}(x)$ and hence $f^{-1}(17)$.',
      steps: [
        'Write $y = 5x + 2$.',
        'Swap $x$ and $y$: $x = 5y + 2$.',
        'Subtract $2$: $x - 2 = 5y$.',
        'Divide by $5$: $y = \\frac{x-2}{5}$, so $f^{-1}(x) = \\frac{x-2}{5}$.',
        'Then $f^{-1}(17) = \\frac{17-2}{5} = 3$. Check: $f(3) = 15 + 2 = 17$.',
      ],
      answer: '$f^{-1}(x) = \\frac{x-2}{5}$ and $f^{-1}(17) = 3$.',
    },
    {
      title: 'Inverse of a fraction function',
      problem: 'Find the inverse of $f(x) = \\frac{x+4}{2x-1}$, $x \\ne \\frac{1}{2}$.',
      steps: [
        'Write $y = \\frac{x+4}{2x-1}$ and swap: $x = \\frac{y+4}{2y-1}$.',
        'Multiply both sides by $(2y - 1)$: $2xy - x = y + 4$.',
        'Collect the $y$ terms on the left: $2xy - y = x + 4$.',
        'Factorise out $y$: $y(2x - 1) = x + 4$.',
        'Divide: $y = \\frac{x+4}{2x-1}$.',
        'This is the same as $f(x)$, so $f$ is self-inverse (the constant on the bottom, $-1$, is minus the $x$-coefficient on top, $1$).',
      ],
      answer: '$f^{-1}(x) = \\frac{x+4}{2x-1}$, $x \\ne \\frac{1}{2}$: the function is self-inverse.',
    },
    {
      title: 'Inverse of a quadratic with a restricted domain',
      problem: 'The function $f(x) = x^2 + 6x + 5$ has domain $x \\ge -3$. Find $f^{-1}(x)$ and state its domain.',
      steps: [
        'Complete the square: $x^2 + 6x + 5 = (x+3)^2 - 9 + 5 = (x+3)^2 - 4$.',
        'Range of $f$: $(x+3)^2 \\ge 0$, so $f(x) \\ge -4$. This will be the domain of $f^{-1}$.',
        'Swap: $x = (y+3)^2 - 4$, so $(y+3)^2 = x + 4$.',
        'Square root: $y + 3 = \\pm\\sqrt{x+4}$. The outputs of $f^{-1}$ must be in the domain of $f$, which is $y \\ge -3$, so take the $+$ sign.',
        'So $y = -3 + \\sqrt{x+4}$.',
        'Check: $f(1) = 1 + 6 + 5 = 12$ and $f^{-1}(12) = -3 + \\sqrt{16} = 1$.',
      ],
      answer: '$f^{-1}(x) = \\sqrt{x+4} - 3$, with domain $x \\ge -4$.',
    },
  ],
  traps: [
    'Doing a composite in the wrong order: $f(g(x))$ means $g$ first. Always start with the function written closest to $x$.',
    'Thinking $f^{-1}(x) = \\frac{1}{f(x)}$. The $-1$ means "inverse function" (undo), not "one over". For $f(x) = 2x$, the inverse is $\\frac{x}{2}$, not $\\frac{1}{2x}$.',
    'Multiplying instead of composing: $f(g(x))$ is not $f(x) \\times g(x)$. Substitute the whole inner function, in brackets, into the outer one.',
    'Forgetting the middle term when squaring a bracket inside a composite: $(2x - 3)^2 = 4x^2 - 12x + 9$, not $4x^2 + 9$.',
    'Giving the domain of $f$ as the domain of $f^{-1}$. The domain of $f^{-1}$ is the range of $f$, so you have to work out the range first.',
    'Choosing the wrong sign of a square root when inverting a quadratic. Use the domain of $f$ (which becomes the range of $f^{-1}$) to pick $+$ or $-$.',
  ],
  examTip:
    'Inverse and composite questions are perfect for **plugging numbers in**, which is fast with a calculator.\n\n' +
    '- **Checking a composite formula:** pick an easy number such as $x = 2$, work out $f(g(2))$ directly, then substitute $x = 2$ into each option. Only the right option matches.\n' +
    '- **Checking an inverse formula:** pick $x$, work out $f(x)$, then put that output into each option. The correct $f^{-1}$ gives back your original $x$. Avoid a value where $f(x) = x$, because then several options can match by luck.\n' +
    '- **Value questions:** for $f^{-1}(k)$, just solve $f(x) = k$; if the options are numbers, put each one into $f$ and see which gives $k$.\n' +
    '- **Spot the traps:** options that are the reciprocal $\\frac{1}{f(x)}$, the composite in the wrong order, or the original function itself are almost always distractors.\n' +
    '- **Domain/range:** the domain of $f^{-1}$ is the range of $f$; sketch $f$ quickly to see its lowest or highest output.\n' +
    '- **Graphs:** $f$ and $f^{-1}$ are reflections in $y = x$, so the point $(a, b)$ becomes $(b, a)$.',
};
