import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'function-families',
  know:
    '### Why "families"?\n\n' +
    'Most graphs in the exam belong to a few families. Each family has a typical shape, and the numbers in its equation tell you exactly where the key features are. If you know what each number does, you can sketch a graph, or match a graph to its equation, in seconds.\n\n' +
    '| Family | Typical equation | Shape |\n' +
    '| --- | --- | --- |\n' +
    '| Linear | $y = mx + c$ | straight line |\n' +
    '| Quadratic | $y = ax^2 + bx + c$ | U or n-shaped parabola |\n' +
    '| Exponential | $y = a \\cdot b^x + c$ | J-curve that levels off on one side |\n' +
    '| Logarithmic | $y = \\log_b x$ | slow-growing curve with a vertical asymptote |\n\n' +
    '### Straight lines\n\n' +
    'In $y = mx + c$, the number $m$ is the **gradient** (steepness) and $c$ is the **$y$-intercept** (where the line crosses the $y$-axis, at $x = 0$).\n\n' +
    '- The gradient is "rise over run": $m = \\frac{y_2 - y_1}{x_2 - x_1}$. Positive $m$ goes up from left to right, negative $m$ goes down, $m = 0$ is flat.\n' +
    '- If the line is given as something like $3x + 2y = 12$, first rearrange to $y = \\ldots$ (here $y = -\\frac{3}{2}x + 6$) before reading off $m$ and $c$.\n' +
    '- The $x$-intercept is where $y = 0$.\n' +
    '- To write the line through a point $(x_1, y_1)$ with gradient $m$, use $y - y_1 = m(x - x_1)$.\n\n' +
    '**Parallel** lines have the **same gradient**. **Perpendicular** lines (meeting at a right angle) have gradients that multiply to $-1$: flip the fraction and change the sign. So a line perpendicular to gradient $\\frac{2}{3}$ has gradient $-\\frac{3}{2}$, and perpendicular to $4$ is $-\\frac{1}{4}$. (One special case: a horizontal line $y = k$ and a vertical line $x = h$ are also perpendicular, but a vertical line has no gradient, so the rule cannot be used there.)\n\n' +
    '### Quadratics (parabolas)\n\n' +
    'The graph of $y = ax^2 + bx + c$ is a parabola. If $a > 0$ it is U-shaped (has a minimum); if $a < 0$ it is n-shaped (has a maximum). The key features are:\n\n' +
    '- **$y$-intercept**: put $x = 0$, so it is just $c$.\n' +
    '- **Roots** ($x$-intercepts): solve $ax^2 + bx + c = 0$ by factorising or with the quadratic formula.\n' +
    '- **Axis of symmetry**: the vertical line $x = -\\frac{b}{2a}$, exactly halfway between the roots.\n' +
    '- **Vertex** (turning point): its $x$-coordinate is $-\\frac{b}{2a}$; substitute that back in to get the $y$-coordinate.\n\n' +
    'Two other forms show features directly. **Factorised form** $y = a(x - p)(x - q)$ has roots $p$ and $q$ (note the sign flip: $(x + 3)$ means a root at $-3$). **Vertex form** $y = a(x - h)^2 + k$ has vertex $(h, k)$.\n\n' +
    'The **discriminant** $\\Delta = b^2 - 4ac$ tells you how many times the graph meets the $x$-axis: $\\Delta > 0$ two roots, $\\Delta = 0$ just touches once, $\\Delta < 0$ never.\n\n' +
    '### Exponential growth and decay\n\n' +
    'In $y = a \\cdot b^x$ the variable is in the **power**. Each time $x$ goes up by 1, $y$ is **multiplied** by $b$ (a straight line instead **adds** the same amount each time).\n\n' +
    '- $b > 1$: growth. $0 < b < 1$: decay.\n' +
    '- $a$ is the starting value (at $x = 0$, since $b^0 = 1$).\n' +
    '- A change of $r\\%$ per period gives the multiplier $b = 1 + \\frac{r}{100}$ for growth or $1 - \\frac{r}{100}$ for decay. For example, losing 15% a year means multiplying by $0.85$.\n\n' +
    'The graph of $y = b^x$ never touches the $x$-axis: it gets closer and closer to $y = 0$, which is called a **horizontal asymptote**. For $y = a \\cdot b^x + c$ the whole graph is shifted up by $c$, so the asymptote is $y = c$ and the $y$-intercept is $a + c$.\n\n' +
    '### Logarithms and their graphs\n\n' +
    'A logarithm answers "what power?": $\\log_b x = y$ means exactly the same as $b^y = x$. So $\\log_2 8 = 3$ because $2^3 = 8$. The log graph is the exponential graph reflected in the line $y = x$, so the roles of $x$ and $y$ swap:\n\n' +
    '- $y = \\log_b x$ exists only for $x > 0$, so it has a **vertical asymptote** at $x = 0$.\n' +
    '- It always passes through $(1, 0)$ and $(b, 1)$.\n' +
    '- For $y = \\log_b(x - h)$ everything moves $h$ to the right: asymptote $x = h$, $x$-intercept where the bracket equals 1.\n\n' +
    '### Matching graphs to equations\n\n' +
    'Work through a checklist: Is it straight, a parabola, or a curve that levels off? Which way does it go (up or down, U or n)? Where does it cross the axes? Where is the asymptote or the vertex? Then test one or two clear points from the graph in each option. With a table of values, constant **differences** mean linear and constant **ratios** mean exponential.',
  formulas: [
    { label: 'Gradient between two points', tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}' },
    { label: 'Gradient-intercept form of a line', tex: 'y = mx + c', note: '$m$ = gradient, $c$ = $y$-intercept.' },
    { label: 'Line through a point', tex: 'y - y_1 = m(x - x_1)' },
    { label: 'Parallel lines', tex: 'm_1 = m_2' },
    { label: 'Perpendicular lines', tex: 'm_1 \\times m_2 = -1 \\quad\\Longleftrightarrow\\quad m_2 = -\\frac{1}{m_1}', note: 'Flip the fraction and change the sign.' },
    { label: 'Midpoint of two points', tex: '\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)' },
    { label: 'Axis of symmetry / vertex x-coordinate', tex: 'x = -\\frac{b}{2a}', note: 'For $y = ax^2 + bx + c$; substitute back in for the $y$-coordinate of the vertex.' },
    { label: 'Quadratic formula', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { label: 'Discriminant', tex: '\\Delta = b^2 - 4ac', note: 'Positive: 2 roots. Zero: 1 repeated root (touches the axis). Negative: no real roots.' },
    { label: 'Vertex form and factorised form', tex: 'y = a(x - h)^2 + k \\qquad y = a(x - p)(x - q)', note: 'Vertex $(h, k)$; roots $p$ and $q$.' },
    { label: 'Exponential model', tex: 'y = a \\cdot b^x + c', note: '$b > 1$ growth, $0 < b < 1$ decay; asymptote $y = c$; $y$-intercept $a + c$.' },
    { label: 'Percentage growth or decay', tex: 'A = A_0\\left(1 \\pm \\frac{r}{100}\\right)^n', note: 'Use + for growth and - for decay.' },
    { label: 'Definition of a logarithm', tex: '\\log_b x = y \\iff b^y = x' },
    { label: 'Log graph features', tex: 'y = \\log_b(x - h): \\quad \\text{asymptote } x = h, \\quad \\text{passes through } (h + 1, 0)' },
  ],
  examples: [
    {
      title: 'Gradient and intercept from a general-form line',
      problem: 'Find the gradient and $y$-intercept of $4x - 2y = 6$, and the gradient of any line perpendicular to it.',
      steps: [
        'Make $y$ the subject. Subtract $4x$ from both sides: $-2y = -4x + 6$.',
        'Divide every term by $-2$: $y = 2x - 3$.',
        'Read off: gradient $m = 2$, $y$-intercept $c = -3$.',
        'Perpendicular gradient: flip and change sign, $-\\frac{1}{2}$. Check: $2 \\times \\left(-\\frac{1}{2}\\right) = -1$.',
      ],
      answer: 'Gradient $2$, $y$-intercept $-3$; perpendicular gradient $-\\frac{1}{2}$.',
    },
    {
      title: 'Vertex and roots of a quadratic',
      problem: 'For $y = x^2 + 2x - 8$, find the roots, the axis of symmetry and the vertex.',
      steps: [
        'Roots: factorise. Two numbers that multiply to $-8$ and add to $2$ are $4$ and $-2$, so $y = (x + 4)(x - 2)$.',
        'Set each bracket to zero: $x = -4$ or $x = 2$.',
        'Axis of symmetry: $x = -\\frac{b}{2a} = -\\frac{2}{2 \\times 1} = -1$ (and $-1$ is halfway between $-4$ and $2$).',
        'Vertex $y$-coordinate: $(-1)^2 + 2(-1) - 8 = 1 - 2 - 8 = -9$.',
        'Since $a = 1 > 0$ the parabola is U-shaped, so $(-1, -9)$ is a minimum.',
      ],
      answer: 'Roots $x = -4$ and $x = 2$; axis $x = -1$; vertex $(-1, -9)$.',
    },
    {
      title: 'Exponential decay with a percentage',
      problem: 'A phone costs AED 3,000 and loses 20% of its value every year. What is it worth after 2 years, and what is the horizontal asymptote of the value graph?',
      steps: [
        'Losing 20% means keeping 80%, so the multiplier is $0.8$: $V = 3000 \\times 0.8^t$.',
        'After 1 year: $3000 \\times 0.8 = 2400$.',
        'After 2 years: $2400 \\times 0.8 = 1920$ (or $3000 \\times 0.8^2 = 3000 \\times 0.64 = 1920$).',
        'As $t$ grows, $0.8^t$ gets closer to 0 but never reaches it, so the asymptote is $V = 0$.',
      ],
      answer: 'AED 1,920 after 2 years; horizontal asymptote $V = 0$.',
    },
    {
      title: 'Finding an exponential from two points (exam level)',
      problem: 'The graph of $y = a \\cdot b^x$ passes through $(2, 12)$ and $(4, 48)$, with $b > 0$. Find $a$ and $b$, then find the $y$-intercept.',
      steps: [
        'Substitute both points: $a b^2 = 12$ and $a b^4 = 48$.',
        'Divide the second by the first so $a$ cancels: $b^2 = \\frac{48}{12} = 4$, so $b = 2$ (since $b > 0$).',
        'Substitute back: $a \\times 2^2 = 12$, so $4a = 12$ and $a = 3$.',
        'The $y$-intercept is the value at $x = 0$: $3 \\times 2^0 = 3 \\times 1 = 3$.',
        'Check with the second point: $3 \\times 2^4 = 3 \\times 16 = 48$.',
      ],
      answer: '$a = 3$, $b = 2$, so $y = 3 \\cdot 2^x$ with $y$-intercept $3$.',
    },
  ],
  traps: [
    'Reading the gradient straight off a line like $3x + 2y = 12$. You must rearrange to $y = mx + c$ first (here $m = -\\frac{3}{2}$, not $3$).',
    'Getting the perpendicular gradient half right: changing the sign without flipping (giving $-2$ instead of $-\\frac{1}{2}$), or flipping without changing the sign.',
    'Losing the minus sign in $x = -\\frac{b}{2a}$, or forgetting the 2. Also typing $-2^2$ into a calculator gives $-4$: always put negative numbers in brackets, $(-2)^2 = 4$.',
    'Root signs in factorised form: $(x + 3)$ gives the root $x = -3$, not $+3$. Similarly $\\log(x - 2)$ moves the graph 2 to the **right**.',
    'Treating percentage decay as linear: losing 15% for 3 years is NOT losing 45% of the original. Multiply by $0.85$ three times.',
    'Using the $y$-intercept of $y = a \\cdot b^x + c$ as $a$. The $y$-intercept is $a + c$; the asymptote $y = c$ tells you $c$ first.',
  ],
  examTip:
    'These questions usually give four equations, four points or four numbers, so **test the options instead of solving from scratch**. ' +
    'To match a graph, pick one or two easy points you can read clearly (the $y$-intercept at $x = 0$ is usually best, then a root or the vertex) and substitute them into each option: wrong ones fail quickly. ' +
    'Use quick shape checks to cross out options: a U-shape needs $a > 0$; a falling exponential needs $0 < b < 1$; an asymptote at $y = 2$ needs a $+2$ on the end; a log graph moved right needs $(x - h)$. ' +
    'For lines, check the sign of the gradient first (up or down from left to right) and remember perpendicular gradients multiply to $-1$, which you can check on a calculator. ' +
    'For percentage changes, type the whole calculation in one go, such as $80000 \\times 0.85^3$, and sanity-check: decay must give less than the start, growth more.',
};
