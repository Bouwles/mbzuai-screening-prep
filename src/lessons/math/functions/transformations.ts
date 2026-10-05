import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'transformations',
  know:
    '### What is a transformation?\n\n' +
    'A transformation takes the graph of $y = f(x)$ and moves it, stretches it or flips it. You do not need to know what $f$ is: every point $(x, y)$ on the old graph moves to a new point by a simple rule, and the new graph is just all the moved points.\n\n' +
    'There are only three basic kinds of move: **translations** (slides), **stretches** and **reflections** (flips). Harder questions simply combine several of them.\n\n' +
    '### The golden rule: inside vs outside\n\n' +
    'Look at *where* the change is written.\n\n' +
    '- **Outside** the function, like $f(x) + 3$ or $2f(x)$: it changes the **output**, so it moves points **up/down** ($y$-values). It does exactly what it looks like.\n' +
    '- **Inside** the bracket, like $f(x + 3)$ or $f(2x)$: it changes the **input**, so it moves points **left/right** ($x$-values). It does the **opposite** of what it looks like.\n\n' +
    'Why the opposite? For $y = f(x - 4)$ the new graph reaches the height $f(0)$ when $x - 4 = 0$, i.e. at $x = 4$. Everything happens 4 units *later*, so the graph moves 4 units **right**, even though you see a minus sign.\n\n' +
    '### The six basic transformations\n\n' +
    '| Equation | What happens | Point $(x, y)$ goes to |\n' +
    '| --- | --- | --- |\n' +
    '| $y = f(x) + a$ | up $a$ (down if $a < 0$) | $(x, y + a)$ |\n' +
    '| $y = f(x + a)$ | **left** $a$ (right if $a < 0$) | $(x - a, y)$ |\n' +
    '| $y = af(x)$ | vertical stretch, factor $a$ | $(x, ay)$ |\n' +
    '| $y = f(ax)$ | horizontal stretch, factor $\\frac{1}{a}$ | $\\left(\\frac{x}{a}, y\\right)$ |\n' +
    '| $y = -f(x)$ | reflect in the $x$-axis | $(x, -y)$ |\n' +
    '| $y = f(-x)$ | reflect in the $y$-axis | $(-x, y)$ |\n\n' +
    'A translation is often written as a vector: $\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$ means 3 right and 2 down, giving $y = f(x - 3) - 2$.\n\n' +
    '### Tracking key points\n\n' +
    'Most exam questions give one point (a vertex, a maximum, an intercept) and ask where it goes. Deal with the two coordinates **separately**:\n\n' +
    '1. **$x$-coordinate:** set the inside of the bracket equal to the old $x$ and solve. For $f(2x + 6)$ and old $x = 4$: $2x + 6 = 4$, so $x = -1$.\n' +
    '2. **$y$-coordinate:** apply the outside operations to the old $y$ in the normal order of operations (multiply first, then add). For $3f(\\dots) - 1$ and old $y = 2$: $3 \\times 2 - 1 = 5$.\n\n' +
    'Useful facts:\n\n' +
    '- Vertical stretches and reflections in the $x$-axis do **not** move roots ($3 \\times 0 = 0$).\n' +
    '- Horizontal stretches and reflections in the $y$-axis do **not** move the $y$-intercept.\n' +
    '- A reflection in the $x$-axis turns a **maximum into a minimum** (and vice versa).\n\n' +
    '### Combined transformations and order\n\n' +
    'For $y = af(x - h) + k$, a point $(p, q)$ goes to $(p + h, aq + k)$: stretch first, then translate. If an equation is written as $f(bx + c)$, factor it first: $f(2x + 6) = f\\big(2(x + 3)\\big)$, so the horizontal shift is 3, not 6.\n\n' +
    'When a question lists steps in words ("reflect, then translate"), build the equation **one step at a time**. A horizontal step replaces **every** $x$: reflecting then moving 2 right gives $f\\big(-(x - 2)\\big) = f(2 - x)$.\n\n' +
    '### Vertices and asymptotes\n\n' +
    'Special features move with the graph:\n\n' +
    '- **Quadratics:** $y = a(x - h)^2 + k$ is $y = x^2$ stretched by $a$ and moved $h$ right and $k$ up, so its vertex is $(h, k)$. To find the vertex of $x^2 + bx + c$, complete the square first.\n' +
    '- **Reciprocal graphs:** $y = \\frac{a}{x - h} + k$ has asymptotes $x = h$ and $y = k$.\n' +
    '- **Exponentials:** $y = a \\cdot 2^x + k$ has horizontal asymptote $y = k$. Only vertical **translations** move a horizontal asymptote; stretches and reflections in the $x$-axis keep $y = 0$ at $y = 0$.',
  formulas: [
    { label: 'Vertical translation', tex: 'y = f(x) + a: \\quad (x, y) \\to (x, y + a)', note: 'Up $a$ units (down if $a$ is negative).' },
    { label: 'Horizontal translation', tex: 'y = f(x - a): \\quad (x, y) \\to (x + a, y)', note: 'Right $a$ units. $f(x + a)$ moves left $a$ units.' },
    { label: 'Vertical stretch', tex: 'y = af(x): \\quad (x, y) \\to (x, ay)', note: 'Scale factor $a$, parallel to the $y$-axis; points on the $x$-axis do not move.' },
    { label: 'Horizontal stretch', tex: 'y = f(ax): \\quad (x, y) \\to \\left(\\frac{x}{a}, y\\right)', note: 'Scale factor $\\frac{1}{a}$, parallel to the $x$-axis; points on the $y$-axis do not move.' },
    { label: 'Reflection in the x-axis', tex: 'y = -f(x): \\quad (x, y) \\to (x, -y)', note: 'Swaps maximum and minimum points.' },
    { label: 'Reflection in the y-axis', tex: 'y = f(-x): \\quad (x, y) \\to (-x, y)' },
    { label: 'Combined transformation', tex: 'y = af(x - h) + k: \\quad (p, q) \\to (p + h, \\; aq + k)', note: 'Multiply the $y$-value first, then add $k$.' },
    { label: 'Inside a bracket: factor first', tex: 'f(bx + c) = f\\left(b\\left(x + \\frac{c}{b}\\right)\\right)', note: 'Stretch factor $\\frac{1}{b}$, then shift $\\frac{c}{b}$ to the left.' },
    { label: 'Vertex form of a quadratic', tex: 'y = a(x - h)^2 + k \\quad \\Rightarrow \\quad \\text{vertex } (h, k)' },
    { label: 'Asymptotes of a reciprocal graph', tex: 'y = \\frac{a}{x - h} + k \\quad \\Rightarrow \\quad x = h, \\; y = k' },
    { label: 'Asymptote of an exponential graph', tex: 'y = a \\cdot b^{x} + k \\quad \\Rightarrow \\quad y = k' },
  ],
  examples: [
    {
      title: 'One transformation at a time',
      problem: 'The point $(6, -2)$ lies on $y = f(x)$. Find the matching point on (a) $y = f(x) - 5$, (b) $y = f(x + 5)$, (c) $y = f(-x)$.',
      steps: [
        '(a) The $-5$ is outside, so it acts on $y$ exactly as written: $-2 - 5 = -7$. The point is $(6, -7)$.',
        '(b) The $+5$ is inside, so it acts on $x$ the opposite way: solve $x + 5 = 6$, so $x = 1$. The point is $(1, -2)$ (5 units left).',
        '(c) The minus is inside, so it acts on $x$: solve $-x = 6$, so $x = -6$. The point is $(-6, -2)$ (reflection in the $y$-axis).',
      ],
      answer: '(a) $(6, -7)$, (b) $(1, -2)$, (c) $(-6, -2)$',
    },
    {
      title: 'Horizontal stretch and the roots',
      problem: 'The graph of $y = f(x)$ crosses the $x$-axis at $x = -3$ and $x = 9$. Where does $y = 2f(3x)$ cross the $x$-axis?',
      steps: [
        'The roots are where $y = 0$. The factor 2 outside is a vertical stretch: $2 \\times 0 = 0$, so it does not move the roots.',
        'The 3 inside: $f$ is zero when its input is $-3$ or $9$, so solve $3x = -3$ and $3x = 9$.',
        '$3x = -3$ gives $x = -1$, and $3x = 9$ gives $x = 3$.',
      ],
      answer: '$x = -1$ and $x = 3$',
    },
    {
      title: 'Vertex of a transformed quadratic',
      problem: 'Let $f(x) = x^2 + 6x + 5$. Find the vertex of $y = 2f(x - 1) + 3$.',
      steps: [
        'Complete the square. Half of 6 is 3: $x^2 + 6x + 5 = (x + 3)^2 - 9 + 5 = (x + 3)^2 - 4$.',
        'The bracket is zero when $x = -3$, so the vertex of $y = f(x)$ is $(-3, -4)$.',
        '$x$-coordinate: inside, $x - 1 = -3$ gives $x = -2$ (1 unit right).',
        '$y$-coordinate: outside, multiply by 2 then add 3: $2 \\times (-4) + 3 = -8 + 3 = -5$.',
        'The stretch factor 2 is positive, so the vertex is still a minimum.',
      ],
      answer: 'Vertex $(-2, -5)$',
    },
    {
      title: 'A chain of transformations (exam level)',
      problem: 'The graph of $y = \\frac{1}{x}$ is translated 2 units right, reflected in the $x$-axis, then translated 4 units up. Find the equation, the asymptotes and the $x$-intercept of the final graph.',
      steps: [
        '2 units right: replace $x$ with $x - 2$: $y = \\frac{1}{x - 2}$.',
        'Reflect in the $x$-axis: $y = -\\frac{1}{x - 2}$.',
        '4 units up: $y = 4 - \\frac{1}{x - 2}$.',
        'Asymptotes: the denominator is zero at $x = 2$, and as $x$ gets large the fraction tends to 0, so $y$ tends to 4. Asymptotes $x = 2$ and $y = 4$.',
        '$x$-intercept: $4 - \\frac{1}{x - 2} = 0$, so $\\frac{1}{x - 2} = 4$, so $x - 2 = \\frac{1}{4}$, so $x = \\frac{9}{4}$.',
      ],
      answer: '$y = 4 - \\frac{1}{x - 2}$; asymptotes $x = 2$, $y = 4$; $x$-intercept $\\left(\\frac{9}{4}, 0\\right)$',
    },
  ],
  traps: [
    '**Wrong direction inside the bracket.** $f(x - 3)$ moves the graph 3 units **right**, and $f(x + 3)$ moves it **left**. Outside changes, like $f(x) - 3$, do what they look like (down 3).',
    '**$f(2x)$ halves, it does not double.** A number multiplying $x$ inside the bracket squashes the graph: divide the $x$-coordinates by 2. Only $2f(x)$ multiplies (the $y$-values) by 2.',
    '**Order of the outside operations.** For $2f(x) + 4$ multiply the $y$-value by 2 **first**, then add 4. Doing it the other way gives $2(y + 4)$, which is wrong.',
    '**Shift of $c$ instead of $\\frac{c}{b}$.** In $f(2x + 6)$ the shift is 3 units left, because $2x + 6 = 2(x + 3)$. Safest: solve $2x + 6 = $ old $x$.',
    '**Squaring a negative.** When replacing $x$ with $-x$, remember $(-x)^2 = x^2$: only odd powers of $x$ change sign in $f(-x)$.',
    '**Forgetting what else moves.** Asymptotes and turning points move with the graph; a reflection in the $x$-axis turns a maximum into a minimum.',
  ],
  examTip:
    'Most questions give a point, vertex or asymptote and ask for its image, or describe the steps and ask for the equation. Fastest method: track **one point**. Pick an easy point (a vertex or an intercept), move it, and see which option fits. For equation answers, plug a simple value such as $x = 0$ or $x = 1$ into each option and compare with the value you expect (calculator friendly). Eliminate options quickly with three checks: (1) is the horizontal shift in the **opposite** direction to the sign in the bracket? (2) did a minus outside turn a maximum into a minimum? (3) does the horizontal asymptote only move with an up/down shift? Distractors are almost always the result of one of these slips, so if two options differ only in one sign, check that sign carefully.',
};
