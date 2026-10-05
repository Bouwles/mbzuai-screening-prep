import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'variance-sd',
  know:
    '### Why we need a measure of spread\n\n' +
    'Two classes can both average $60\\%$ on a test. In one class everybody scored between $55\\%$ and $65\\%$; in the other, scores ran from $20\\%$ to $100\\%$. The **mean** tells you where the centre is, but not how **spread out** the values are. The range (largest minus smallest) uses only two values, so one odd value can ruin it. The **variance** and **standard deviation** (SD) use every value.\n\n' +
    '### Deviations: distance from the mean\n\n' +
    'The **deviation** of a value is $x - \\bar{x}$ (value minus mean). Values above the mean have positive deviations, values below have negative ones. The deviations always add up to $0$, so their plain average is useless. The fix is to **square** them: squares are never negative, and big deviations count much more than small ones.\n\n' +
    '### Variance\n\n' +
    'The (population) **variance** is the mean of the squared deviations:\n\n' +
    '$$\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}$$\n\n' +
    '1. Find the mean $\\bar{x}$.\n' +
    '2. Subtract the mean from each value.\n' +
    '3. Square each deviation.\n' +
    '4. Add the squares.\n' +
    '5. Divide by $n$, the number of values.\n\n' +
    'For $4, 6, 8, 10$: the mean is $7$, the deviations are $-3, -1, 1, 3$, the squares are $9, 1, 1, 9$ with sum $20$, so $\\sigma^2 = \\frac{20}{4} = 5$.\n\n' +
    '### Standard deviation\n\n' +
    'The **standard deviation** is the square root of the variance: $\\sigma = \\sqrt{\\sigma^2}$. For the data above, $\\sigma = \\sqrt{5} \\approx 2.24$. Think of it as the "typical distance" of a value from the mean.\n\n' +
    '- Variance is in **squared units** (e.g. $\\text{cm}^2$); the SD is in the **same units as the data** (cm).\n' +
    '- The SD is never negative. It is $0$ only when every value is the same.\n' +
    '- A population SD can never be bigger than half the range, which is a quick way to reject silly options.\n\n' +
    '### The computational formula\n\n' +
    'When a question gives you $\\sum x$ and $\\sum x^2$ instead of the data, use\n\n' +
    '$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$$\n\n' +
    'In words: the **mean of the squares** minus the **square of the mean**. Example: $n = 5$, $\\sum x = 30$, $\\sum x^2 = 200$ gives $\\bar{x} = 6$ and $\\sigma^2 = 40 - 36 = 4$. Rearranged, $\\sum x^2 = n(\\sigma^2 + \\bar{x}^2)$, which is how you combine two groups or add a new value.\n\n' +
    'For a **frequency table**, every squared deviation is counted $f$ times and you divide by the total frequency $\\sum f$, not by the number of rows.\n\n' +
    '### Population or sample? ($n$ or $n - 1$)\n\n' +
    'If your data is the **whole population** you care about, divide by $n$ (symbol $\\sigma^2$). If it is a **sample** used to estimate the spread of a bigger population, divide by $n - 1$ (symbol $s^2$). Sample values tend to sit closer to their own mean than to the true mean, so dividing by $n$ would underestimate the spread; $n - 1$ corrects this. So $s^2$ is always **larger** than $\\sigma^2$ (by the factor $\\frac{n}{n - 1}$), unless every value is the same and both are $0$. The difference is big for small samples and tiny for large ones.\n\n' +
    'On a calculator\'s one-variable statistics screen, $\\sigma_x$ is the population SD and $s_x$ is the sample SD. In Python, `statistics.pvariance` and `statistics.pstdev` divide by $n$, while `statistics.variance` and `statistics.stdev` divide by $n - 1$.\n\n' +
    '### Changing every value: shifting and scaling\n\n' +
    '| Change to every value | Mean | SD | Variance |\n' +
    '| --- | --- | --- | --- |\n' +
    '| add $b$ | $+\\,b$ | unchanged | unchanged |\n' +
    '| multiply by $a$ | $\\times a$ | $\\times \\lvert a \\rvert$ | $\\times a^2$ |\n' +
    '| $y = ax + b$ | $a\\bar{x} + b$ | $\\lvert a \\rvert \\, \\sigma$ | $a^2\\sigma^2$ |\n\n' +
    'Adding $b$ slides the whole data set along without spreading it, so only the mean moves. Multiplying by $a$ stretches every gap by $|a|$, so the SD is multiplied by $|a|$ and the variance (a squared quantity) by $a^2$.\n\n' +
    '### Comparing spread\n\n' +
    'The larger the SD, the more spread out (less consistent) the data. Two data sets can share a mean and have very different SDs. Bigger **values** do not mean bigger **spread**: $101, 102, 103$ has the same SD as $1, 2, 3$. Because deviations are squared, one extreme value (an outlier) can increase the SD a lot. Only compare SDs of data measured in the same units.',
  formulas: [
    { label: 'Mean', tex: '\\bar{x} = \\frac{\\sum x}{n}' },
    { label: 'Population variance', tex: '\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}', note: 'The mean of the squared deviations.' },
    { label: 'Population standard deviation', tex: '\\sigma = \\sqrt{\\frac{\\sum (x - \\bar{x})^2}{n}}', note: 'Same units as the data; never negative.' },
    { label: 'Computational formula', tex: '\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2', note: 'Mean of the squares minus the square of the mean.' },
    { label: 'Sum of squares from mean and variance', tex: '\\sum x^2 = n\\left(\\sigma^2 + \\bar{x}^2\\right)', note: 'Use it to combine groups or add or remove a value.' },
    { label: 'Frequency table', tex: '\\sigma^2 = \\frac{\\sum f(x - \\bar{x})^2}{\\sum f} = \\frac{\\sum f x^2}{\\sum f} - \\bar{x}^2' },
    { label: 'Sample variance', tex: 's^2 = \\frac{\\sum (x - \\bar{x})^2}{n - 1}', note: 'Use when a sample estimates the variance of a larger population.' },
    { label: 'Linear transformation', tex: 'y = ax + b: \\quad \\bar{y} = a\\bar{x} + b, \\quad \\sigma_y = |a|\\,\\sigma_x, \\quad \\sigma_y^2 = a^2\\sigma_x^2', note: 'Adding $b$ never changes the spread.' },
  ],
  examples: [
    {
      title: 'Variance and SD from raw data',
      problem: 'Find the population variance and standard deviation of $4, 6, 8, 10$.',
      steps: [
        'Mean: $\\bar{x} = \\frac{4 + 6 + 8 + 10}{4} = \\frac{28}{4} = 7$.',
        'Deviations $x - \\bar{x}$: $-3, -1, 1, 3$ (check: they add to $0$).',
        'Squared deviations: $9, 1, 1, 9$, with sum $20$.',
        'Variance: $\\sigma^2 = \\frac{20}{4} = 5$.',
        'Standard deviation: $\\sigma = \\sqrt{5} \\approx 2.24$.',
      ],
      answer: 'Variance $5$, SD $\\sqrt{5} \\approx 2.24$.',
    },
    {
      title: 'Using the computational formula',
      problem: 'For $8$ values, $\\sum x = 48$ and $\\sum x^2 = 320$. Find the population SD.',
      steps: [
        'Mean: $\\bar{x} = \\frac{48}{8} = 6$.',
        'Mean of the squares: $\\frac{320}{8} = 40$.',
        'Variance: $\\sigma^2 = 40 - 6^2 = 40 - 36 = 4$.',
        'SD: $\\sigma = \\sqrt{4} = 2$.',
      ],
      answer: '$\\sigma = 2$',
    },
    {
      title: 'Scaling test marks',
      problem: 'Test marks have mean $52$ and SD $8$. Every mark is scaled using $y = 1.5x + 10$. Find the new mean, SD and variance.',
      steps: [
        'Mean: multiply by $1.5$, then add $10$: $1.5 \\times 52 + 10 = 78 + 10 = 88$.',
        'SD: multiply by $|1.5| = 1.5$ and ignore the $+10$: $1.5 \\times 8 = 12$.',
        'Variance: square the new SD, $12^2 = 144$ (or $1.5^2 \\times 8^2 = 2.25 \\times 64 = 144$).',
      ],
      answer: 'Mean $88$, SD $12$, variance $144$.',
    },
    {
      title: 'Population versus sample variance',
      problem: 'The values $2, 4, 4, 5, 10$ are a random sample from a large population. Find the population variance of these five values and the sample variance $s^2$.',
      steps: [
        'Mean: $\\bar{x} = \\frac{2 + 4 + 4 + 5 + 10}{5} = \\frac{25}{5} = 5$.',
        'Deviations: $-3, -1, -1, 0, 5$.',
        'Squared deviations: $9, 1, 1, 0, 25$, with sum $9 + 1 + 1 + 25 = 36$.',
        'Population variance (divide by $n = 5$): $\\frac{36}{5} = 7.2$.',
        'Sample variance (divide by $n - 1 = 4$): $s^2 = \\frac{36}{4} = 9$. Because the values are a sample used to estimate the population, $s^2 = 9$ is the one to report.',
      ],
      answer: 'Population variance $7.2$; sample variance $s^2 = 9$.',
    },
  ],
  traps: [
    'Mixing up variance and SD: the SD is the **square root** of the variance. If two options are a number and its square, check which one the question asks for.',
    'Dividing by the wrong thing: divide by $n$ for a population and by $n - 1$ for a sample. In a frequency table, divide by the total frequency $\\sum f$, not by the number of rows.',
    'In $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$, forgetting to **square the mean**, or using $(\\sum x)^2$ in place of $\\sum x^2$.',
    'Thinking that adding a constant to every value changes the SD or variance. It only moves the mean.',
    'Multiplying by $a$: the SD is multiplied by $|a|$ but the variance by $a^2$. A negative multiplier still gives a positive SD.',
    'Averaging variances when two groups are combined. If the group means differ, the combined variance is bigger than the average; rebuild $\\sum x^2$ for each group instead.',
  ],
  examTip:
    'Expect a short calculation with distractors built from the classic slips: the variance offered next to the SD, the $n - 1$ answer next to the $n$ answer, and the sum of squares that was never divided. Before calculating, decide: **variance or SD? population or sample?** Then use your calculator\'s one-variable statistics mode: type in the data (or values with frequencies) and read off $\\bar{x}$, $\\sigma_x$ (population) and $s_x$ (sample); square $\\sigma_x$ if the variance is wanted. Quick eliminations: an SD can never be negative, a population SD cannot exceed half the range, and spread is unchanged by adding a constant, so for $y = ax + b$ cross out every option that used $b$. If two variance options differ by a factor $\\frac{n}{n - 1}$ (or two SD options by a factor $\\sqrt{\\frac{n}{n - 1}}$), one is the population and one the sample version.',
};
