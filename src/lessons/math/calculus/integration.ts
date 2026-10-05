import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'integration',
  know:
    '### What integration is\n\n' +
    '**Integration** is differentiation run backwards. If differentiating $F(x)$ gives $f(x)$, then $F(x)$ is called an **antiderivative** (or integral) of $f(x)$. We write\n\n' +
    '$$\\int f(x)\\,dx = F(x) + C$$\n\n' +
    'The $\\int$ sign means "integrate", and $dx$ says that $x$ is the variable. Integration also measures **area under a curve**, which is why it appears in probability, physics and machine learning.\n\n' +
    '### Why there is always a $+C$\n\n' +
    'Differentiating $x^{2}$, $x^{2} + 5$ and $x^{2} - 100$ all give $2x$, because a constant differentiates to $0$. So when we go backwards from $2x$ we cannot know which constant was there. We write $\\int 2x\\,dx = x^{2} + C$, where $C$ is the **constant of integration**. If you are told a point on the curve (for example $f(1) = 5$), substitute it to find $C$.\n\n' +
    '### The reverse power rule\n\n' +
    'For any power except $-1$: **add 1 to the power, then divide by the new power.**\n\n' +
    '| Integrand | Rewrite | Integral |\n' +
    '| --- | --- | --- |\n' +
    '| $x^{4}$ | $x^{4}$ | $\\frac{x^{5}}{5} + C$ |\n' +
    '| $5$ | $5x^{0}$ | $5x + C$ |\n' +
    '| $\\sqrt{x}$ | $x^{\\frac{1}{2}}$ | $\\frac{2}{3}x^{\\frac{3}{2}} + C$ |\n' +
    '| $\\frac{1}{x^{2}}$ | $x^{-2}$ | $-x^{-1} = -\\frac{1}{x} + C$ |\n\n' +
    'Integrate a sum **term by term**, and keep constant multiples in front. Always rewrite roots and fractions as powers of $x$ first. There is no product or quotient rule for integration: if you see $\\frac{x^{3} + 2x}{x}$, simplify it to $x^{2} + 2$ before integrating.\n\n' +
    '### The standard integrals\n\n' +
    '| $f(x)$ | $\\int f(x)\\,dx$ |\n' +
    '| --- | --- |\n' +
    '| $e^{x}$ | $e^{x} + C$ |\n' +
    '| $\\frac{1}{x}$ | $\\ln\\lvert x\\rvert + C$ (this is the missing power $-1$ case) |\n' +
    '| $\\cos x$ | $\\sin x + C$ |\n' +
    '| $\\sin x$ | $-\\cos x + C$ |\n\n' +
    'Memory aid for the trig signs: $\\frac{d}{dx}(\\cos x) = -\\sin x$, so to get back a **positive** $\\sin x$ you need $-\\cos x$. The minus sign goes with the integral of **sine**. Angles must be in radians.\n\n' +
    '### Functions of $ax + b$: divide by $a$\n\n' +
    'When differentiating $(2x + 1)^{5}$, the chain rule **multiplies** by 2. Integration undoes this, so it **divides** by the number in front of $x$:\n\n' +
    '- $\\int (2x + 1)^{4}\\,dx = \\frac{(2x + 1)^{5}}{5 \\times 2} + C = \\frac{(2x + 1)^{5}}{10} + C$\n' +
    '- $\\int e^{3x}\\,dx = \\frac{1}{3}e^{3x} + C$\n' +
    '- $\\int \\cos 4x\\,dx = \\frac{1}{4}\\sin 4x + C$\n' +
    '- $\\int \\frac{1}{2x + 5}\\,dx = \\frac{1}{2}\\ln|2x + 5| + C$\n\n' +
    'This shortcut only works when the inside is **linear** (like $ax + b$). You can always check by differentiating your answer.\n\n' +
    '### Definite integrals\n\n' +
    'A **definite integral** has limits: $\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$. Integrate (no $+C$ needed, it cancels), substitute the **top** limit, then subtract the value at the **bottom** limit. The answer is a number, not a function. Watch out at a lower limit of $0$: $0^{2} = 0$, but $e^{0} = 1$ and $\\cos 0 = 1$, so those terms do not vanish.\n\n' +
    'Two useful rules: swapping the limits changes the sign, $\\int_{b}^{a} f\\,dx = -\\int_{a}^{b} f\\,dx$, and integrating a constant gives the width times the constant, $\\int_{a}^{b} 1\\,dx = b - a$.\n\n' +
    '### Area under a curve, and why area below the axis is negative\n\n' +
    'If $f(x) \\ge 0$ between $x = a$ and $x = b$, the area between the curve and the $x$-axis is $\\int_{a}^{b} f(x)\\,dx$. But where the curve is **below** the $x$-axis, the integral comes out **negative**. An area is always positive, so:\n\n' +
    '1. Find where the curve crosses the $x$-axis (solve $f(x) = 0$).\n' +
    '2. Integrate each piece separately.\n' +
    '3. Take the absolute value of each piece and add them.\n\n' +
    'If you integrate straight across a crossing point, the positive and negative parts cancel and you get the **net** value, not the total area. The same idea gives displacement (net) versus total distance travelled when you integrate a velocity.',
  formulas: [
    { label: 'Indefinite integral', tex: '\\int f(x)\\,dx = F(x) + C \\quad \\text{where } F\'(x) = f(x)', note: 'Always include $+C$ in an indefinite integral.' },
    { label: 'Reverse power rule', tex: '\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\ne -1)', note: 'Add 1 to the power, divide by the new power. Works for negative and fractional powers.' },
    { label: 'Constants and multiples', tex: '\\int k\\,dx = kx + C \\qquad \\int k f(x)\\,dx = k\\int f(x)\\,dx' },
    { label: 'Sum rule', tex: '\\int \\left(f(x) + g(x)\\right)dx = \\int f(x)\\,dx + \\int g(x)\\,dx', note: 'Integrate term by term.' },
    { label: 'Exponential', tex: '\\int e^{x}\\,dx = e^{x} + C \\qquad \\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C' },
    { label: 'Reciprocal', tex: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C', note: 'The power $-1$ case, where the power rule fails.' },
    { label: 'Sine and cosine', tex: '\\int \\cos x\\,dx = \\sin x + C \\qquad \\int \\sin x\\,dx = -\\cos x + C', note: '$x$ in radians. The minus sign goes with the integral of sine.' },
    { label: 'Linear inside, f(ax + b)', tex: '\\int f(ax + b)\\,dx = \\frac{1}{a}F(ax + b) + C', note: 'Integrate as if the bracket were $x$, then divide by $a$.' },
    { label: 'Power of a linear bracket', tex: '\\int (ax + b)^{n}\\,dx = \\frac{(ax + b)^{n+1}}{a(n+1)} + C' },
    { label: 'Reciprocal of a linear expression', tex: '\\int \\frac{1}{ax + b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C' },
    { label: 'Trig with a multiple', tex: '\\int \\cos kx\\,dx = \\frac{1}{k}\\sin kx + C \\qquad \\int \\sin kx\\,dx = -\\frac{1}{k}\\cos kx + C' },
    { label: 'Definite integral', tex: '\\int_{a}^{b} f(x)\\,dx = \\left[F(x)\\right]_{a}^{b} = F(b) - F(a)', note: 'Top limit minus bottom limit; no $+C$ needed.' },
    { label: 'Swapping limits', tex: '\\int_{b}^{a} f(x)\\,dx = -\\int_{a}^{b} f(x)\\,dx' },
    { label: 'Area under a curve', tex: '\\text{Area} = \\int_{a}^{b} \\left|f(x)\\right|dx', note: 'Split at the $x$-axis crossings; a piece below the axis gives a negative integral, so take its size.' },
  ],
  examples: [
    {
      title: 'Reverse power rule, term by term',
      problem: 'Find $\\int \\left(6x^{2} - 4x + 5\\right)dx$.',
      steps: [
        'Integrate each term separately: add 1 to the power, then divide by the new power.',
        '$6x^{2}$: new power 3, so $\\frac{6x^{3}}{3} = 2x^{3}$.',
        '$-4x$ has a hidden power of 1: new power 2, so $\\frac{-4x^{2}}{2} = -2x^{2}$.',
        '$5$ is a constant, so it integrates to $5x$.',
        'Add one constant of integration for the whole answer: $2x^{3} - 2x^{2} + 5x + C$.',
        'Check by differentiating: $6x^{2} - 4x + 5$. Correct.',
      ],
      answer: '$2x^{3} - 2x^{2} + 5x + C$',
    },
    {
      title: 'A definite integral with a root',
      problem: 'Evaluate $\\int_{1}^{4} \\sqrt{x}\\,dx$.',
      steps: [
        'Rewrite as a power: $\\sqrt{x} = x^{\\frac{1}{2}}$.',
        'Integrate: the new power is $\\frac{3}{2}$, so $\\int x^{\\frac{1}{2}}\\,dx = \\frac{x^{\\frac{3}{2}}}{\\frac{3}{2}} = \\frac{2}{3}x^{\\frac{3}{2}}$.',
        'Upper limit: $4^{\\frac{3}{2}} = \\left(\\sqrt{4}\\right)^{3} = 8$, giving $\\frac{2}{3} \\times 8 = \\frac{16}{3}$.',
        'Lower limit: $1^{\\frac{3}{2}} = 1$, giving $\\frac{2}{3}$.',
        'Subtract: $\\frac{16}{3} - \\frac{2}{3} = \\frac{14}{3}$.',
      ],
      answer: '$\\frac{14}{3}$ (about $4.67$)',
    },
    {
      title: 'A function of 2x: divide by 2',
      problem: 'Evaluate $\\int_{0}^{\\frac{\\pi}{4}} \\sin 2x\\,dx$.',
      steps: [
        '$\\int \\sin x\\,dx = -\\cos x$, and the inside is $2x$, so divide by 2: $\\int \\sin 2x\\,dx = -\\frac{1}{2}\\cos 2x$.',
        'Upper limit $x = \\frac{\\pi}{4}$: $2x = \\frac{\\pi}{2}$ and $\\cos\\frac{\\pi}{2} = 0$, so the value is zero.',
        'Lower limit $x = 0$: $\\cos 0 = 1$ (not zero!), so the value is $-\\frac{1}{2}$.',
        'Top minus bottom: $0 - \\left(-\\frac{1}{2}\\right) = \\frac{1}{2}$.',
      ],
      answer: '$\\frac{1}{2}$',
    },
    {
      title: 'Exam level: area of a region below the x-axis',
      problem: 'Find the area enclosed by the curve $y = x^{2} - 2x - 3$ and the $x$-axis.',
      steps: [
        'Find the crossing points: $x^{2} - 2x - 3 = (x + 1)(x - 3) = 0$, so $x = -1$ and $x = 3$.',
        'Test a point in between: at $x = 0$, $y = -3 < 0$, so the region is **below** the axis and the integral will be negative.',
        'Integrate: $F(x) = \\frac{x^{3}}{3} - x^{2} - 3x$.',
        '$F(3) = 9 - 9 - 9 = -9$.',
        '$F(-1) = -\\frac{1}{3} - 1 + 3 = \\frac{5}{3}$.',
        '$\\int_{-1}^{3} \\left(x^{2} - 2x - 3\\right)dx = -9 - \\frac{5}{3} = -\\frac{32}{3}$.',
        'Negative, as expected for a region below the axis. The area is the size: $\\frac{32}{3}$.',
      ],
      answer: '$\\frac{32}{3}$ square units',
    },
  ],
  traps: [
    '**Differentiating instead of integrating.** $\\int x^{4}\\,dx$ is $\\frac{x^{5}}{5} + C$, not $4x^{3}$. Integration **raises** the power; if the power went down, you went the wrong way.',
    '**Dividing by the old power, or not dividing at all.** $\\int 3x^{2}\\,dx = x^{3}$, not $3x^{3}$ and not $\\frac{3x^{3}}{2}$. Divide by the **new** power.',
    '**Multiplying instead of dividing for $f(ax + b)$.** $\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x}$, not $2e^{2x}$ (that is the derivative). The chain rule multiplies when differentiating, so integration divides.',
    '**Trig sign mix-ups.** $\\int \\sin x\\,dx = -\\cos x$ but $\\int \\cos x\\,dx = +\\sin x$. Compare the derivatives: $\\frac{d}{dx}(\\sin x) = \\cos x$ and $\\frac{d}{dx}(\\cos x) = -\\sin x$. When differentiating, the minus goes with cosine; when integrating, it goes with sine.',
    '**Assuming a lower limit of $0$ gives $0$.** It does for powers of $x$, but $e^{0} = 1$ and $\\cos 0 = 1$, so those terms must still be subtracted.',
    '**Leaving an area negative, or integrating across the axis in one go.** Regions below the $x$-axis give negative integrals. Split at the crossing points and add the sizes of the pieces.',
  ],
  examTip:
    'Integration questions usually show four expressions or four numbers, and the wrong options are built from the traps above (derivative instead of integral, missing $\\frac{1}{a}$, wrong trig sign, negative area).\n\n' +
    '- **Indefinite integral options: differentiate each option.** The one whose derivative is the integrand is correct. This takes seconds and is safer than integrating from scratch.\n' +
    '- **Eliminate by power:** integrating raises powers, so any option whose power went **down** is the derivative and can be crossed out.\n' +
    '- **Definite integrals: estimate.** Sketch the curve or use height times width to get a rough size; for example $\\int_{0}^{2} 3x^{2}\\,dx$ must be less than $2 \\times 12 = 24$.\n' +
    '- **Sign check:** if the curve is above the axis the integral is positive; an **area** can never be negative, so a negative option for "area" is a trap.\n' +
    '- **Use your calculator** to turn exact options like $4\\ln 2$ or $\\ln 3$ into decimals and compare them with your own decimal answer.',
};
