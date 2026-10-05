import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'derivative-applications',
  know:
    '### The one big idea\n\n' +
    'The derivative $f\'(x)$ (also written $\\frac{dy}{dx}$) is a formula for the **gradient** (steepness) of a curve at any point. Put a value of $x$ into $f\'(x)$ and you get one number: how steep the curve is right there. Everything in this topic is that one idea used in different ways.\n\n' +
    '| If $f\'(x)$ is... | the curve is... |\n' +
    '| --- | --- |\n' +
    '| positive | going **up** (increasing) |\n' +
    '| negative | going **down** (decreasing) |\n' +
    '| zero | flat for a moment (**stationary**) |\n\n' +
    '### Tangents and normals\n\n' +
    'A **tangent** is the straight line that just touches the curve at a point and has the same gradient as the curve there. To find its equation you need a point and a gradient:\n\n' +
    '1. **Point:** put $x = a$ into the original function to get $y_1 = f(a)$.\n' +
    '2. **Gradient:** put $x = a$ into the derivative to get $m = f\'(a)$.\n' +
    '3. **Line:** $y - y_1 = m(x - x_1)$, then rearrange to $y = mx + c$.\n\n' +
    'A **normal** is the line through the same point at right angles to the tangent. Perpendicular gradients multiply to $-1$, so the normal gradient is the **negative reciprocal**: flip the fraction and change the sign. A tangent gradient of $3$ gives a normal gradient of $-\\frac{1}{3}$.\n\n' +
    'If a question says a tangent is **parallel** to a given line, the gradients are equal: set $f\'(x)$ equal to the line\'s gradient and solve for $x$.\n\n' +
    '### Increasing and decreasing\n\n' +
    'A function is **increasing** where $f\'(x) > 0$ and **decreasing** where $f\'(x) < 0$. For a quadratic derivative, find where $f\'(x) = 0$, then test one value in each gap to see the sign. Careful: this is about the **gradient**, not about whether the graph is above or below the $x$-axis.\n\n' +
    '### Stationary points and their nature\n\n' +
    'A **stationary point** is where the gradient is zero. Solve $f\'(x) = 0$ to get the $x$-values, then put each one back into the **original** function to get the $y$-values.\n\n' +
    'To decide what kind of stationary point it is, use the **second derivative** $f\'\'(x)$ (differentiate twice):\n\n' +
    '- $f\'\'(a) < 0$: the curve bends down like a hill, so it is a **local maximum**.\n' +
    '- $f\'\'(a) > 0$: the curve bends up like a valley, so it is a **local minimum**.\n' +
    '- $f\'\'(a) = 0$: the test cannot decide; check the sign of $f\'(x)$ just either side instead.\n\n' +
    'Memory trick: a **negative** second derivative looks like a frown (a hill top), a **positive** one like a smile (a valley).\n\n' +
    '### Maximum and minimum values\n\n' +
    'A **local** maximum is only the highest point nearby. If the question gives an interval such as $0 \\le x \\le 3$, the greatest or least value could be at an **endpoint**, so compare $f$ at the stationary points inside the interval **and** at both ends. Ignore stationary points outside the interval.\n\n' +
    '### Optimisation word problems\n\n' +
    'These ask for the biggest area, smallest cost, largest volume, and so on. The recipe is always the same:\n\n' +
    '1. Draw a sketch and name the variables.\n' +
    '2. Write the quantity to optimise, and use the given fact (the **constraint**, such as a fixed length of fence) to get it in terms of **one** variable.\n' +
    '3. Differentiate, set equal to zero, solve.\n' +
    '4. Check it is a max or min (second derivative) and that it makes physical sense (lengths must be positive).\n' +
    '5. Answer the question actually asked: often the area or volume, not the $x$-value.\n\n' +
    '### Rates of change\n\n' +
    'A derivative is a **rate of change**. If $h$ is height in metres and $t$ is time in seconds, then $\\frac{dh}{dt}$ is velocity in m/s, and differentiating again gives acceleration. When two quantities are linked (such as the side and area of a square), use the **chain rule**: $\\frac{dA}{dt} = \\frac{dA}{ds} \\times \\frac{ds}{dt}$. For shapes like a sliding ladder, write the equation linking the variables (Pythagoras), differentiate both sides with respect to $t$, then substitute the values at that moment.\n\n' +
    '### Why this matters in AI\n\n' +
    'Training a machine learning model means **minimising a loss function**. The idea is exactly this topic: the minimum is where the gradient is zero, and gradient descent walks downhill by following the sign of the derivative.',
  formulas: [
    { label: 'Gradient of the tangent at $x = a$', tex: 'm = f\'(a)' },
    { label: 'Equation of a straight line through a point', tex: 'y - y_1 = m(x - x_1)', note: 'Use the point $(x_1, y_1)$ on the curve and the gradient $m$.' },
    { label: 'Gradient of the normal', tex: 'm_{\\text{normal}} = -\\frac{1}{m_{\\text{tangent}}}', note: 'Perpendicular gradients multiply to $-1$.' },
    { label: 'Parallel lines', tex: 'm_1 = m_2', note: 'A tangent parallel to a line has the same gradient as the line.' },
    { label: 'Increasing and decreasing', tex: 'f\'(x) > 0 \\Rightarrow \\text{increasing}, \\qquad f\'(x) < 0 \\Rightarrow \\text{decreasing}' },
    { label: 'Stationary point', tex: 'f\'(x) = 0', note: 'Then substitute $x$ into the original $f(x)$ to get $y$.' },
    { label: 'Second derivative test', tex: 'f\'\'(a) < 0 \\Rightarrow \\text{max}, \\qquad f\'\'(a) > 0 \\Rightarrow \\text{min}', note: 'If $f\'\'(a) = 0$ the test is inconclusive.' },
    { label: 'Point of inflection (candidate)', tex: 'f\'\'(x) = 0', note: 'Where the curve changes from bending one way to the other.' },
    { label: 'Velocity and acceleration', tex: 'v = \\frac{ds}{dt}, \\qquad a = \\frac{dv}{dt} = \\frac{d^{2}s}{dt^{2}}' },
    { label: 'Connected rates of change (chain rule)', tex: '\\frac{dy}{dt} = \\frac{dy}{dx} \\times \\frac{dx}{dt}' },
  ],
  examples: [
    {
      title: 'Equation of a tangent',
      problem: 'Find the equation of the tangent to $y = x^{2} - 3x + 1$ at $x = 2$.',
      steps: [
        'Point: $y = 2^{2} - 3(2) + 1 = 4 - 6 + 1 = -1$, so the point is $(2, -1)$.',
        'Derivative: $\\frac{dy}{dx} = 2x - 3$.',
        'Gradient at $x = 2$: $m = 2(2) - 3 = 1$.',
        'Line: $y - (-1) = 1(x - 2)$, so $y + 1 = x - 2$.',
        'Rearrange: $y = x - 3$.',
      ],
      answer: '$y = x - 3$',
    },
    {
      title: 'Stationary points and their nature',
      problem: 'Find and classify the stationary points of $y = x^{3} - 3x^{2} - 9x + 2$.',
      steps: [
        'Differentiate: $\\frac{dy}{dx} = 3x^{2} - 6x - 9 = 3(x^{2} - 2x - 3) = 3(x - 3)(x + 1)$.',
        'Set to zero: $x = 3$ or $x = -1$.',
        'Second derivative: $\\frac{d^{2}y}{dx^{2}} = 6x - 6$.',
        'At $x = -1$: $6(-1) - 6 = -12 < 0$, so a local maximum. $y = -1 - 3 + 9 + 2 = 7$.',
        'At $x = 3$: $6(3) - 6 = 12 > 0$, so a local minimum. $y = 27 - 27 - 27 + 2 = -25$.',
      ],
      answer: 'Local maximum at $(-1, 7)$ and local minimum at $(3, -25)$.',
    },
    {
      title: 'An optimisation problem',
      problem: 'Two positive numbers $x$ and $y$ satisfy $x + 2y = 20$. Find the largest possible value of the product $P = xy$.',
      steps: [
        'Use the constraint to remove one variable: $x = 20 - 2y$.',
        'Write $P$ in one variable: $P = (20 - 2y)y = 20y - 2y^{2}$.',
        'Differentiate: $\\frac{dP}{dy} = 20 - 4y$.',
        'Set to zero: $20 - 4y = 0$, so $y = 5$, and then $x = 20 - 10 = 10$.',
        'Check: $\\frac{d^{2}P}{dy^{2}} = -4 < 0$, so this is a maximum.',
        'Largest product: $P = 10 \\times 5 = 50$.',
      ],
      answer: '$50$ (when $x = 10$ and $y = 5$)',
    },
    {
      title: 'Connected rates of change',
      problem: 'The radius of a circle increases at $3$ cm/s. How fast is the area increasing when the radius is $4$ cm? Give your answer in terms of $\\pi$.',
      steps: [
        'Area: $A = \\pi r^{2}$, so $\\frac{dA}{dr} = 2\\pi r$.',
        'Chain rule: $\\frac{dA}{dt} = \\frac{dA}{dr} \\times \\frac{dr}{dt} = 2\\pi r \\times 3 = 6\\pi r$.',
        'At $r = 4$: $\\frac{dA}{dt} = 6\\pi \\times 4 = 24\\pi$.',
      ],
      answer: '$24\\pi \\text{ cm}^{2}/\\text{s}$ (about $75.4 \\text{ cm}^{2}/\\text{s}$)',
    },
  ],
  traps: [
    'Using the $y$-coordinate of the point as the $y$-intercept of the tangent. The intercept $c$ is only equal to $y_1$ when $x_1 = 0$; otherwise use $y - y_1 = m(x - x_1)$.',
    'Getting the normal gradient half right: it must be the **negative reciprocal**. For tangent gradient $4$ the normal gradient is $-\\frac{1}{4}$, not $-4$ and not $\\frac{1}{4}$.',
    'Finding the $y$-value of a stationary point by substituting into $f\'(x)$ or $f\'\'(x)$ instead of the original $f(x)$. Substituting into $f\'(x)$ always gives $0$, which is a big warning sign.',
    'Mixing up the second derivative test: negative means **maximum**, positive means **minimum**. Think of $y = -x^{2}$ (a hill) whose second derivative is $-2$.',
    'On a closed interval, forgetting to check the endpoints, or counting a stationary point that lies outside the interval.',
    'In optimisation questions, giving the $x$-value when the question asks for the area, volume or cost (or forgetting the square root when you minimised a squared distance).',
  ],
  examTip:
    'Expect options that are the results of the traps above, so every wrong option is "nearly right". Fast checks:\n\n' +
    '- **Tangent or normal equation:** plug the $x$-value of the point into each option. The correct line must give the same $y$ as the curve. That alone usually removes two options. Then check the gradient (the number in front of $x$) against $f\'(a)$, and its sign.\n' +
    '- **Stationary points:** substitute the option\'s $x$ into $f\'(x)$; it must give $0$. Then check the $y$-value with the original function.\n' +
    '- **Max or min:** use the sign of $f\'\'(x)$, or sketch: a positive cubic goes up, down, up, so its first stationary point (smaller $x$) is the maximum.\n' +
    '- **Optimisation:** the answer must make physical sense (positive lengths, and the box must exist). If an option needs more material than you have, it is wrong. On a calculator you can test nearby values: the true maximum is bigger than the value just either side.\n' +
    '- **Rates of change:** check the units (area rate is $\\text{cm}^{2}/\\text{s}$) and the sign (decreasing quantities have negative rates).',
};
