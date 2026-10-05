import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'correlation-normal',
  know:
    '### Scatter plots and correlation\n\n' +
    'When each person or object gives you **two** numbers (hours revised and test score, temperature and drinks sold), you can plot one point per pair. This is a **scatter plot**. Put the variable you think does the influencing on the $x$-axis.\n\n' +
    '**Correlation** describes the pattern of the points:\n\n' +
    '- **Positive correlation:** as $x$ goes up, $y$ tends to go up (points rise from left to right).\n' +
    '- **Negative correlation:** as $x$ goes up, $y$ tends to go down (points fall from left to right).\n' +
    '- **No correlation:** a shapeless cloud with no trend.\n\n' +
    'The **strength** is how tightly the points hug a straight line: tight = strong, loose = weak.\n\n' +
    '### The correlation coefficient $r$\n\n' +
    'The number $r$ (Pearson\'s correlation coefficient) measures the strength and direction of a **linear** (straight-line) relationship. It always satisfies $-1 \\le r \\le 1$.\n\n' +
    '| Value of $r$ | Meaning |\n' +
    '| --- | --- |\n' +
    '| $r = 1$ | perfect positive: every point exactly on a rising line |\n' +
    '| $r$ from about $0.8$ to $1$ | strong positive |\n' +
    '| $r$ around $0.4$ to $0.7$ | moderate positive |\n' +
    '| $r$ near $0$ | no linear correlation |\n' +
    '| $r$ around $-0.4$ to $-0.7$ | moderate negative |\n' +
    '| $r$ from about $-0.8$ to $-1$ | strong negative |\n' +
    '| $r = -1$ | perfect negative: every point exactly on a falling line |\n\n' +
    'Two separate facts come from $r$: the **sign** gives the direction, and the **size** (ignoring the sign) gives the strength. So $r = -0.9$ is **stronger** than $r = 0.7$.\n\n' +
    'Useful facts:\n\n' +
    '- $r$ has **no units**. Changing units (cm to inches, kg to pounds) does not change $r$.\n' +
    '- $r$ only detects straight-line patterns. A perfect U-shaped curve can have $r = 0$.\n' +
    '- A single **outlier** far from the trend can change $r$ a lot. Removing it usually moves $r$ closer to $\\pm 1$.\n\n' +
    'If you are given the sums $S_{xx} = \\sum (x - \\bar{x})^2$, $S_{yy} = \\sum (y - \\bar{y})^2$ and $S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y})$, then $r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}$.\n\n' +
    '### Correlation is not causation\n\n' +
    'A strong correlation only says two things move together. It does **not** prove that one causes the other. Often a hidden third variable (a **confounding** variable) drives both: ice-cream sales and beach rescues both rise in hot weather. In an exam, any option saying a correlation "proves" a cause is wrong.\n\n' +
    '### Line of best fit\n\n' +
    'A **line of best fit** (regression line) $y = mx + c$ summarises a linear trend.\n\n' +
    '- The **gradient** $m$ is the change in $y$ for each increase of $1$ in $x$.\n' +
    '- The **intercept** $c$ is the predicted $y$ when $x = 0$.\n' +
    '- It always passes through the **mean point** $(\\bar{x}, \\bar{y})$.\n\n' +
    'To predict, substitute $x$. Predictions **inside** the range of the data (**interpolation**) are reliable; predictions far **outside** it (**extrapolation**) are not, because the pattern may not continue.\n\n' +
    '### z-scores\n\n' +
    'A **z-score** says how many standard deviations a value is from the mean:\n\n' +
    '$$z = \\frac{x - \\mu}{\\sigma}$$\n\n' +
    'Here $\\mu$ is the mean and $\\sigma$ the standard deviation. A positive $z$ means above the mean, negative means below, and $z = 0$ is exactly the mean. To go back from $z$ to the value, use $x = \\mu + z\\sigma$.\n\n' +
    '**Comparing scores:** to decide which of two marks from different tests is better *relative to the others*, compare their $z$-scores, not the raw marks. A mark 10 above the mean is impressive when the SD is 5 ($z = 2$) but ordinary when the SD is 20 ($z = 0.5$).\n\n' +
    '### The normal distribution\n\n' +
    'Many measurements (heights, test scores, masses of products) follow a **normal distribution**: a symmetric bell-shaped curve, highest at the mean, with mean = median = mode. Half the values lie above the mean and half below.\n\n' +
    '### The 68-95-99.7 rule\n\n' +
    'For any normal distribution, about:\n\n' +
    '- **68%** of values lie within $1$ SD of the mean ($\\mu - \\sigma$ to $\\mu + \\sigma$);\n' +
    '- **95%** lie within $2$ SDs ($\\mu - 2\\sigma$ to $\\mu + 2\\sigma$);\n' +
    '- **99.7%** lie within $3$ SDs.\n\n' +
    'Because the curve is symmetric, each side of the mean gets half of these. That gives the band percentages:\n\n' +
    '| From | To | Percentage |\n' +
    '| --- | --- | --- |\n' +
    '| mean | $1$ SD above | 34% |\n' +
    '| $1$ SD above | $2$ SDs above | 13.5% |\n' +
    '| $2$ SDs above | $3$ SDs above | 2.35% |\n' +
    '| $3$ SDs above | beyond | 0.15% |\n\n' +
    'The same numbers mirror below the mean. Two tails worth memorising: **16%** of values are above $\\mu + \\sigma$ (that is, $\\frac{100 - 68}{2}$), and **2.5%** are above $\\mu + 2\\sigma$ (that is, $\\frac{100 - 95}{2}$).\n\n' +
    '**Method for any question:** turn each boundary into a $z$-score (it should come out as a whole number), sketch the curve, shade the region, and add up the bands. For a count, multiply the percentage by the total.',
  formulas: [
    { label: 'Range of the correlation coefficient', tex: '-1 \\le r \\le 1', note: 'Sign = direction, size = strength of the linear relationship.' },
    { label: 'Correlation coefficient from sums', tex: 'r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}', note: '$S_{xx} = \\sum (x - \\bar{x})^2$, $S_{yy} = \\sum (y - \\bar{y})^2$, $S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y})$.' },
    { label: 'Line of best fit', tex: 'y = mx + c', note: '$m$ = change in $y$ per unit of $x$; $c$ = value of $y$ when $x = 0$.' },
    { label: 'Line of best fit passes through the mean point', tex: '\\bar{y} = m\\bar{x} + c', note: 'Use it to find $c$ when you know the gradient and the means.' },
    { label: 'Gradient of the regression line from sums', tex: 'm = \\frac{S_{xy}}{S_{xx}}' },
    { label: 'z-score', tex: 'z = \\frac{x - \\mu}{\\sigma}', note: 'Number of standard deviations above (positive) or below (negative) the mean.' },
    { label: 'Value from a z-score', tex: 'x = \\mu + z\\sigma' },
    { label: '68-95-99.7 rule', tex: 'P(|X - \\mu| < \\sigma) \\approx 68\\%, \\quad P(|X - \\mu| < 2\\sigma) \\approx 95\\%, \\quad P(|X - \\mu| < 3\\sigma) \\approx 99.7\\%' },
    { label: 'One tail beyond k standard deviations', tex: 'P(X > \\mu + k\\sigma) = \\frac{100\\% - (\\text{within } k \\text{ SDs})}{2}', note: 'Gives 16% for 1 SD, 2.5% for 2 SDs, 0.15% for 3 SDs.' },
    { label: 'Band percentages (each side of the mean)', tex: '34\\%, \\quad 13.5\\%, \\quad 2.35\\%, \\quad 0.15\\%', note: 'Mean to 1 SD, 1 to 2 SDs, 2 to 3 SDs, beyond 3 SDs.' },
  ],
  examples: [
    {
      title: 'Computing and interpreting a z-score',
      problem: 'A test has mean $64$ and standard deviation $6$. Rania scored $55$. Find her $z$-score and say what it means.',
      steps: [
        'Write the formula: $z = \\frac{x - \\mu}{\\sigma}$ with $x = 55$, $\\mu = 64$, $\\sigma = 6$.',
        'Distance from the mean: $55 - 64 = -9$ (negative, so she is below the mean).',
        'Divide by the standard deviation: $z = \\frac{-9}{6} = -1.5$.',
        'Interpret: Rania scored one and a half standard deviations below the mean.',
      ],
      answer: '$z = -1.5$, i.e. $1.5$ SDs below the mean.',
    },
    {
      title: 'Which result is better?',
      problem: 'Karim scored $68$ in Chemistry (mean $56$, SD $8$) and $74$ in Biology (mean $65$, SD $4$). In which subject did he do better compared with the other students?',
      steps: [
        'Chemistry: $z = \\frac{68 - 56}{8} = \\frac{12}{8} = 1.5$.',
        'Biology: $z = \\frac{74 - 65}{4} = \\frac{9}{4} = 2.25$.',
        'Compare: $2.25 > 1.5$, so Biology is further above the mean in SD units.',
        'Notice that the raw gap was bigger in Chemistry ($12$ marks against $9$), which is why you must not compare raw gaps.',
      ],
      answer: 'Biology ($z = 2.25$ against $z = 1.5$).',
    },
    {
      title: 'Using the 68-95-99.7 rule for a non-symmetric interval',
      problem: 'Bags of flour have masses normally distributed with mean $1000$ g and SD $10$ g. Out of $2000$ bags, about how many have a mass between $990$ g and $1020$ g?',
      steps: [
        'Convert the ends to $z$-scores: $\\frac{990 - 1000}{10} = -1$ and $\\frac{1020 - 1000}{10} = 2$.',
        'Split at the mean. From $1$ SD below up to the mean: half of 68%, which is 34%.',
        'From the mean up to $2$ SDs above: half of 95%, which is 47.5%.',
        'Add: 34% + 47.5% = 81.5%.',
        'Convert to a count: $0.815 \\times 2000 = 1630$.',
      ],
      answer: 'About $1630$ bags.',
    },
    {
      title: 'Working backwards to the mean and SD',
      problem: 'A normal distribution has 16% of its values below $42$ and 2.5% of its values above $63$. Find the mean and standard deviation.',
      steps: [
        '16% below means this is the lower tail beyond $1$ SD, because $\\frac{100\\% - 68\\%}{2} = 16\\%$. So $42 = \\mu - \\sigma$.',
        '2.5% above is the upper tail beyond $2$ SDs, because $\\frac{100\\% - 95\\%}{2} = 2.5\\%$. So $63 = \\mu + 2\\sigma$.',
        'Subtract the first equation from the second: $63 - 42 = 3\\sigma$, so $21 = 3\\sigma$ and $\\sigma = 7$.',
        'Then $\\mu = 42 + 7 = 49$.',
        'Check: $49 - 7 = 42$ and $49 + 14 = 63$.',
      ],
      answer: '$\\mu = 49$, $\\sigma = 7$.',
    },
  ],
  traps: [
    'Thinking a negative $r$ means a weak relationship. The sign is only the direction: $r = -0.95$ is a very strong (negative) correlation, stronger than $r = 0.8$.',
    'Concluding that one variable **causes** the other because $r$ is large. Correlation is not causation; look for a confounding variable such as the weather or age.',
    'Forgetting to halve the tails. Outside $2$ SDs is 5% in total, but above $\\mu + 2\\sigma$ alone is only 2.5%.',
    'Comparing raw marks or raw gaps from different tests. Always convert to $z$-scores first, because the spreads can differ.',
    'Getting the sign of $z$ wrong: subtract in the order $x - \\mu$. A value below the mean must give a negative $z$, and in $x = \\mu + z\\sigma$ a negative $z$ moves you down from the mean.',
    'Dividing by the variance instead of the standard deviation. If you are given $\\sigma^2$, take the square root first. Also, trusting a prediction far outside the data range (extrapolation).',
  ],
  examTip:
    'Expect quick one-idea questions: pick the description of a scatter plot, spot the impossible value of $r$ (anything above $1$ or below $-1$ is out instantly), choose the statement that avoids claiming causation, compute a $z$-score, or apply 68-95-99.7.\n\n' +
    '- **Eliminate first.** Any $r$ outside $-1$ to $1$ is wrong. A falling trend needs a negative $r$. Any option saying a correlation "proves" something is wrong.\n' +
    '- **Rule questions:** the boundaries are almost always a whole number of SDs from the mean, so compute the $z$-scores, sketch the bell curve and shade. The wrong options are usually the classic slips: the un-halved tail (5% instead of 2.5%), the complement (97.5% instead of 2.5%) or the mean-to-boundary piece (47.5%).\n' +
    '- **Sanity checks:** a region that contains a whole half of the curve plus a bit more (for example "more than $\\mu - \\sigma$") must be more than 50%; a tail beyond $2$ SDs must be small (2.5% or less).\n' +
    '- **Plug back in:** for "find the value" questions, test an option in $z = \\frac{x - \\mu}{\\sigma}$ on your calculator; only the right one gives the stated $z$.',
};
