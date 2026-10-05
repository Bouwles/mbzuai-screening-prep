import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'data-calculations',
  know:
    '### What this topic is about\n\n' +
    'In data questions you are given a bar chart, line graph, pie chart or table, and asked to *calculate* something from it: a percentage change, a share of a total, an average, a ratio or a rate. The maths is never hard on its own. Marks are lost by dividing by the wrong number, so the whole topic comes down to one habit: **always ask "out of what?"** before you divide.\n\n' +
    '### Step zero: read the data carefully\n\n' +
    '- Check the **units** on the axis or in the column heading (thousands? AED? per cent?).\n' +
    '- Read bar heights against the scale, not by eye. If a value sits between gridlines, use the scale to work it out.\n' +
    '- Find exactly which two values the question names (for example "from its highest month to June", not "from the first month").\n\n' +
    '### Percentage change\n\n' +
    'To find by what percentage something changed, divide the **change** by the **original** (starting) value:\n\n' +
    '$$\\text{percentage change} = \\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100\\%$$\n\n' +
    'From 40 to 50: the change is 10, and $\\frac{10}{40} \\times 100 = 25\\%$, an increase. From 2500 to 1800: the change is $-700$, and $\\frac{700}{2500} \\times 100 = 28\\%$, a decrease. A positive change is an increase; a negative change is a decrease.\n\n' +
    '**Multipliers** make this faster. An increase of $20\\%$ is "$\\times 1.2$"; a decrease of $30\\%$ is "$\\times 0.7$". Three useful consequences:\n\n' +
    '- **Successive changes multiply.** Up $50\\%$ then down $30\\%$ gives $1.5 \\times 0.7 = 1.05$, which is a $5\\%$ increase overall (not $20\\%$).\n' +
    '- **Reverse percentages divide.** If a price is AED 72 *after* a $20\\%$ rise, the original was $72 \\div 1.2 = 60$.\n' +
    '- **Constant percentage growth** means multiply by the same factor each step. If 1600, 2000, 2500 grow by the same percentage, the factor is $\\frac{2000}{1600} = 1.25$, so the next value is $2500 \\times 1.25 = 3125$.\n\n' +
    '### Percentage points are not per cent\n\n' +
    'If a share rises from $30\\%$ to $36\\%$, it went up by **6 percentage points** (a plain subtraction). As a *percentage change* it went up by $\\frac{6}{30} \\times 100 = 20\\%$. Read which one the question wants.\n\n' +
    '### Percentage share (part of a whole)\n\n' +
    'The share of one category is the part divided by the **whole total**:\n\n' +
    '$$\\text{share} = \\frac{\\text{part}}{\\text{total}} \\times 100\\%$$\n\n' +
    'In a pie chart with counts 18, 12, 24 and 6, the total is 60, so the 24 slice is $\\frac{24}{60} = 40\\%$. In a pie chart drawn by angle, the share is $\\frac{\\text{angle}}{360^{\\circ}}$. If one part changes (for example some items are removed), the **total changes too**, so recompute both.\n\n' +
    '### Averages from a frequency table or bar chart\n\n' +
    'A frequency table says how many times ($f$) each value ($x$) happens. The mean is\n\n' +
    '$$\\bar{x} = \\frac{\\sum fx}{\\sum f}$$\n\n' +
    'Multiply each value by its frequency, add these up, then divide by the **total frequency** (the number of people or items), not by the number of rows.\n\n' +
    '- **Median:** with $n$ values in order, it is at position $\\frac{n + 1}{2}$. Add up the frequencies as you go (a running total) until you pass that position.\n' +
    '- **Mode:** the value with the highest frequency (the tallest bar), not the frequency itself.\n\n' +
    '### Estimating the mean from grouped data\n\n' +
    'When data are in classes such as $10 \\le t < 20$, we do not know the exact values. Assume every value sits at the class **midpoint** ($15$ here), then use $\\frac{\\sum fx}{\\sum f}$ with the midpoints as $x$. The answer is an *estimate*, and it must lie inside the range of the data.\n\n' +
    '### Weighted averages and combined means\n\n' +
    'When some items count more than others, use a weighted average:\n\n' +
    '$$\\text{weighted mean} = \\frac{\\sum w x}{\\sum w}$$\n\n' +
    'A grade made of quizzes $20\\%$, project $30\\%$, exam $50\\%$ with scores 90, 70, 60 is $0.2 \\times 90 + 0.3 \\times 70 + 0.5 \\times 60 = 69$.\n\n' +
    'Combining two groups is the same idea, with the group sizes as weights. **Never average two means or two percentages from groups of different sizes.** Convert each mean to a **total** (mean $\\times$ count), add or subtract totals, then divide by the right count. The combined mean always lies between the two group means, closer to the bigger group\'s mean.\n\n' +
    '### Ratios and rates\n\n' +
    '- A **ratio** $a : b$ compares two amounts in the order the question says. Simplify by dividing both parts by their highest common factor: $12 : 18 = 2 : 3$. To share a total in the ratio $7 : 2 : 1$, add the parts (10), find one part, then multiply.\n' +
    '- A **rate** "A per B" is A divided by B: 150 km on 12 litres is $\\frac{150}{12} = 12.5$ km per litre.\n' +
    '- To compare groups of different sizes fairly, use a rate such as "cases per 1000 people" $= \\frac{\\text{cases}}{\\text{population}} \\times 1000$. The group with the most cases is not always the group with the highest rate.',
  formulas: [
    { label: 'Percentage change', tex: '\\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100\\%', note: 'Always divide by the OLD (starting) value. Positive = increase, negative = decrease.' },
    { label: 'Multiplier for a change of p%', tex: '1 + \\frac{p}{100} \\quad \\text{or} \\quad 1 - \\frac{p}{100}', note: 'e.g. +20% is 1.2, -30% is 0.7' },
    { label: 'Successive percentage changes', tex: '\\text{overall multiplier} = m_1 \\times m_2 \\times \\cdots', note: 'Multiply the multipliers; never add the percentages.' },
    { label: 'Reverse percentage', tex: '\\text{original} = \\frac{\\text{new value}}{\\text{multiplier}}' },
    { label: 'Percentage share', tex: '\\frac{\\text{part}}{\\text{total}} \\times 100\\%', note: 'For a pie chart drawn by angle: angle divided by 360 degrees.' },
    { label: 'Percentage points', tex: '\\text{change in points} = p_{\\text{new}} - p_{\\text{old}}', note: 'Different from the percentage change of a percentage.' },
    { label: 'Mean from a frequency table', tex: '\\bar{x} = \\frac{\\sum f x}{\\sum f}', note: 'Divide by the total frequency, not the number of rows.' },
    { label: 'Position of the median', tex: '\\frac{n + 1}{2}\\text{th value}', note: 'Use a running total of the frequencies to find it.' },
    { label: 'Class midpoint (grouped data)', tex: '\\text{midpoint} = \\frac{\\text{lower bound} + \\text{upper bound}}{2}', note: 'Use midpoints as x to ESTIMATE the mean.' },
    { label: 'Weighted mean', tex: '\\bar{x}_w = \\frac{\\sum w x}{\\sum w}', note: 'If the weights add up to 1 (100%), just add up w times x.' },
    { label: 'Combined mean of two groups', tex: '\\bar{x} = \\frac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2}{n_1 + n_2}' },
    { label: 'Total from a mean', tex: '\\text{total} = \\text{mean} \\times \\text{count}' },
    { label: 'Sharing in a ratio a : b : c', tex: '\\text{one part} = \\frac{\\text{total}}{a + b + c}' },
    { label: 'Rate per 1000', tex: '\\text{rate} = \\frac{\\text{count}}{\\text{population}} \\times 1000' },
  ],
  examples: [
    {
      title: 'Percentage change from a chart',
      problem: 'A bar chart shows that an online shop had 320 orders in March and 400 orders in April. What is the percentage change from March to April?',
      steps: [
        'Identify old and new: old (March) $= 320$, new (April) $= 400$.',
        'Change $= 400 - 320 = 80$. It is positive, so it is an increase.',
        'Divide by the **old** value: $\\frac{80}{320} = 0.25$.',
        'Multiply by 100: $0.25 \\times 100 = 25\\%$.',
        'Check with a multiplier: $320 \\times 1.25 = 400$. Correct.',
      ],
      answer: 'A $25\\%$ increase.',
    },
    {
      title: 'Mean from a frequency table',
      problem: 'In a survey, 25 students said how many hours of sport they play per week: 0 hours (3 students), 1 hour (7 students), 2 hours (9 students), 3 hours (6 students). Find the mean number of hours.',
      steps: [
        'Total frequency: $3 + 7 + 9 + 6 = 25$ students.',
        'Multiply each value by its frequency: $0 \\times 3 = 0$, $1 \\times 7 = 7$, $2 \\times 9 = 18$, $3 \\times 6 = 18$.',
        'Add them: $\\sum fx = 0 + 7 + 18 + 18 = 43$.',
        'Divide by the total frequency: $\\frac{43}{25} = 1.72$.',
        'Sense check: 1.72 lies between the smallest value 0 and the largest value 3, and near 2 where most students are.',
      ],
      answer: '$1.72$ hours',
    },
    {
      title: 'Estimating a mean from grouped data',
      problem: 'The masses of 20 parcels are grouped as: $0 \\le m < 4$ kg (6 parcels), $4 \\le m < 8$ kg (10 parcels), $8 \\le m < 12$ kg (4 parcels). Estimate the mean mass.',
      steps: [
        'Midpoints: $\\frac{0 + 4}{2} = 2$, $\\frac{4 + 8}{2} = 6$, $\\frac{8 + 12}{2} = 10$.',
        'Multiply each midpoint by its frequency: $2 \\times 6 = 12$, $6 \\times 10 = 60$, $10 \\times 4 = 40$.',
        'Add them: $\\sum fx = 12 + 60 + 40 = 112$.',
        'Divide by the total frequency 20: $\\frac{112}{20} = 5.6$.',
      ],
      answer: 'About $5.6$ kg (an estimate, because the midpoints are assumed).',
    },
    {
      title: 'Missing group mean (exam level)',
      problem: 'A year group of 40 students has a mean score of 70. The 15 students in Class A have a mean score of 78. What is the mean score of the other 25 students in Class B?',
      steps: [
        'Total for everyone: $40 \\times 70 = 2800$.',
        'Total for Class A: $15 \\times 78 = 1170$.',
        'Total for Class B: $2800 - 1170 = 1630$.',
        'Mean for Class B: $\\frac{1630}{25} = 65.2$.',
        'Check: $\\frac{1170 + 25 \\times 65.2}{40} = \\frac{1170 + 1630}{40} = \\frac{2800}{40} = 70$. Correct.',
      ],
      answer: '$65.2$',
    },
    {
      title: 'Ratio and rate from a table',
      problem: 'A table shows two towns. Town P: population 20000, 100 flu cases. Town Q: population 50000, 210 flu cases. (a) Write the ratio of cases in P to cases in Q in its simplest form. (b) Which town has the higher rate of cases per 1000 people?',
      steps: [
        '(a) Cases P : Q $= 100 : 210$. The highest common factor of 100 and 210 is 10, so divide both parts by 10: $10 : 21$.',
        '(b) Rate per 1000 $= \\frac{\\text{cases}}{\\text{population}} \\times 1000$.',
        'Town P: $\\frac{100}{20000} \\times 1000 = 5$ cases per 1000 people.',
        'Town Q: $\\frac{210}{50000} \\times 1000 = 4.2$ cases per 1000 people.',
        'Town Q has more cases in total, but Town P has the higher **rate**, because it is a much smaller town.',
      ],
      answer: '(a) $10 : 21$; (b) Town P (5 per 1000, against 4.2 per 1000 for Town Q).',
    },
  ],
  traps: [
    'Dividing a percentage change by the NEW value instead of the old one. From 40 to 50 is $\\frac{10}{40} = 25\\%$, not $\\frac{10}{50} = 20\\%$.',
    'Adding successive percentage changes. Up $50\\%$ then down $30\\%$ is $1.5 \\times 0.7 = 1.05$, a $5\\%$ rise, not $20\\%$.',
    'Averaging two means or two pass rates from groups of different sizes. Convert to totals (or counts) first, then divide by the total number.',
    'In a frequency table, dividing $\\sum fx$ by the number of rows, or taking the mean of the values column without using the frequencies.',
    'Confusing percentage points with per cent: $30\\%$ to $36\\%$ is 6 percentage points but a $20\\%$ increase.',
    'Undoing a percentage increase by subtracting the same percentage from the new value. After a $20\\%$ rise to 72, the original is $72 \\div 1.2 = 60$, not $72 \\times 0.8 = 57.6$.',
  ],
  examTip:
    'The wrong options are almost always the results of the classic slips above, so expect to see "divided by the new value", "simple average of the means", "forgot the frequencies" and "new as a percentage of old" (for example $125\\%$ instead of $25\\%$) among the choices. Fast checks: (1) say out loud "out of what?" before dividing; (2) a mean must lie between the smallest and largest values, and a combined mean must lie between the two group means, closer to the bigger group\'s mean; (3) a percentage share can never be above $100\\%$; (4) the direction must match the data (falling values give a decrease); (5) for reverse percentages and missing values, plug each option back in, since multiplying is quicker than solving. Use your calculator for $\\sum fx$ but write the small table of $f$, $x$ and $fx$ first so you do not miss a row.',
};
