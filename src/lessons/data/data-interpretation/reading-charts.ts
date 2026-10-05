import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'reading-charts',
  know:
    '### Why this topic is "free marks"\n\n' +
    'Chart questions need very little maths: read a number carefully, then add, subtract, divide or find a percentage. Nearly every mistake comes from **reading the wrong thing**, not from hard calculation. So slow down for the first 15 seconds: read the title, the axis labels, the units and the key before you look at the numbers.\n\n' +
    '### Step 0 for every chart\n\n' +
    '- **Title and units**: is it "visitors" or "visitors (thousands)"? Is the pie showing counts, percentages or angles?\n' +
    '- **Scale**: how much is one gridline worth? If gridlines go up in 10s, a bar ending halfway between 20 and 30 is 25.\n' +
    '- **Key (legend)**: with two series, which colour is which year or group?\n' +
    '- **The exact question**: "how many more" (subtract), "how many times as many" (divide), "what fraction / percentage" (divide by the **total**).\n\n' +
    '### Tables\n\n' +
    'Find the right **row** and the right **column** first, then read where they meet. If a table has a Total row or column, a missing value is the total minus the others: if $24 + ? = 50$, then $? = 26$. In a timetable each **column** is one bus or train; stay in that column.\n\n' +
    '### Bar charts\n\n' +
    'The **height** of each bar is the value. A **grouped** bar chart puts two or more bars side by side for each category (for example 2023 and 2024), so you can compare a category with itself over time. "Largest increase" means: for every category, work out new minus old, then pick the biggest **positive** answer. The tallest bar is usually a trap.\n\n' +
    '### Line graphs and trends\n\n' +
    'A line graph shows how something changes over time. Upward = increasing, downward = decreasing, flat = no change. The **change** between two neighbouring points is the later value minus the earlier value, and the **steepest** segment is the biggest change. On a distance-time graph, steepness is **speed**, and a flat part means stopped.\n\n' +
    'Watch for **cumulative** (running total) graphs, which never go down. The amount added in one period is the **rise** between two points, not the height of a point.\n\n' +
    'With two lines on one graph, the **difference** between them in a month is the vertical gap. Where the lines cross, the two values are equal.\n\n' +
    '### Pie charts\n\n' +
    'The whole circle is the whole group: $100\\%$, or $360^\\circ$, or the total count. Check which one the labels show.\n\n' +
    '| You know | You want | Do this |\n' +
    '| --- | --- | --- |\n' +
    '| count and total | angle | $\\frac{\\text{count}}{\\text{total}} \\times 360^\\circ$ |\n' +
    '| angle and total | count | $\\frac{\\text{angle}}{360^\\circ} \\times \\text{total}$ |\n' +
    '| percentage and total | count | $\\frac{\\text{percentage}}{100} \\times \\text{total}$ |\n\n' +
    'A pie chart shows **shares**, not sizes: a bigger slice in one school\'s pie does not mean more students than in another school\'s pie unless both totals are known.\n\n' +
    '### Histograms\n\n' +
    'A histogram groups numerical data into **classes** (for example $10 \\le h < 20$). The bars touch because the data is continuous. With equal class widths, each bar\'s height is the **frequency** (how many values are in that class). Read the stem for the boundary rule: "includes the lower boundary but not the upper" means a value of exactly 20 goes in the 20 to 30 class.\n\n' +
    'If a question cuts **inside** a class (for example "more than 25" with a class from 20 to 30), assume the values are spread evenly and take the matching fraction of that bar: half the width means half the frequency. (If class widths are unequal, the height is **frequency density** $= \\frac{\\text{frequency}}{\\text{class width}}$, and the frequency is height times width.)\n\n' +
    '### Scatter plots\n\n' +
    'Each point is one individual with two measurements. Points rising left to right show **positive correlation**; falling shows **negative correlation**; a shapeless cloud shows no correlation. Correlation is a **tendency**, so statements with "every" or "always" are usually false. To estimate with a line of best fit $y = mx + c$, substitute the $x$ value. Estimates inside the range of the data (interpolation) are reasonable; far outside it (extrapolation) they are unreliable. If the line $y = x$ is drawn, points above it have $y > x$.\n\n' +
    '### Comparing groups of different sizes\n\n' +
    'When groups have different totals, compare **rates** (part divided by group total), not raw counts. A school with 84 passes out of 120 ($70\\%$) does worse than one with 72 out of 90 ($80\\%$).',
  formulas: [
    { label: 'Change between two readings', tex: '\\text{change} = \\text{new value} - \\text{old value}', note: 'Positive = increase, negative = decrease. "Largest increase" = biggest positive change.' },
    { label: 'Percentage change', tex: '\\text{percentage change} = \\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100\\%', note: 'Always divide by the old (original) value.' },
    { label: 'Share of the total', tex: '\\text{percentage} = \\frac{\\text{part}}{\\text{total}} \\times 100\\%', note: 'Add up every bar or slice to find the total first.' },
    { label: 'Pie chart: angle of a sector', tex: '\\text{angle} = \\frac{\\text{count}}{\\text{total}} \\times 360^\\circ' },
    { label: 'Pie chart: count from an angle', tex: '\\text{count} = \\frac{\\text{angle}}{360^\\circ} \\times \\text{total}' },
    { label: 'Rate of change (gradient) between two points', tex: '\\text{rate} = \\frac{\\text{change in } y}{\\text{change in } x}', note: 'On a distance-time graph this is the speed.' },
    { label: 'Histogram: part of a class', tex: '\\text{estimate} = \\frac{\\text{width of the part needed}}{\\text{class width}} \\times \\text{class frequency}', note: 'Assumes the values are spread evenly in the class.' },
    { label: 'Histogram with unequal widths', tex: '\\text{frequency density} = \\frac{\\text{frequency}}{\\text{class width}}', note: 'Then frequency = bar height times class width (the bar area).' },
    { label: 'Line of best fit', tex: 'y = mx + c', note: 'Substitute the given $x$ to estimate $y$; $m$ is the gradient and $c$ is where the line crosses the $y$-axis.' },
  ],
  examples: [
    {
      title: 'Reading a bar chart: "how many more"',
      problem: 'A bar chart shows books borrowed each day: Mon 30, Tue 45, Wed 20, Thu 50, Fri 35 (gridlines every 10). How many more books were borrowed on Thursday than on Wednesday?',
      steps: [
        'Read the two bars: Thursday reaches the 50 line, Wednesday reaches the 20 line.',
        '"How many more" means subtract the smaller from the larger: $50 - 20 = 30$.',
        'Sense check: Thursday\'s bar is clearly much taller, and $30$ is less than $50$, so the answer is reasonable.',
      ],
      answer: '$30$ more books.',
    },
    {
      title: 'Pie chart: from angles to people',
      problem: '240 students were asked how they travel to school. The pie chart angles are Walk $120^\\circ$, Bus $105^\\circ$, Car $90^\\circ$, Cycle $45^\\circ$. How many more students walk than cycle?',
      steps: [
        'Check the angles add to $360^\\circ$: $120 + 105 + 90 + 45 = 360$. Good.',
        'The whole circle stands for 240 students, so each degree is $\\frac{240}{360} = \\frac{2}{3}$ of a student.',
        'Difference in angle: $120^\\circ - 45^\\circ = 75^\\circ$.',
        'Convert to students: $75 \\times \\frac{2}{3} = 50$.',
        'Check the long way: Walk $= \\frac{120}{360} \\times 240 = 80$, Cycle $= \\frac{45}{360} \\times 240 = 30$, and $80 - 30 = 50$.',
      ],
      answer: '$50$ more students walk than cycle.',
    },
    {
      title: 'Largest increase on a grouped bar chart',
      problem: 'Cups sold (hundreds) in 2023 and 2024: Mango 20 then 30, Lemon 45 then 40, Berry 15 then 35, Mint 35 then 50, Peach 40 then 15. Which flavour had the largest increase?',
      steps: [
        'For each flavour, change = 2024 value minus 2023 value.',
        'Mango: $30 - 20 = 10$. Lemon: $40 - 45 = -5$. Berry: $35 - 15 = 20$.',
        'Mint: $50 - 35 = 15$. Peach: $15 - 40 = -25$.',
        'The biggest positive change is $20$, for Berry.',
        'Traps avoided: Mint has the tallest 2024 bar (only $+15$), and Peach has the biggest change in size, but it is a decrease.',
      ],
      answer: 'Berry (an increase of 20 hundred cups).',
    },
    {
      title: 'Histogram with a boundary inside a class',
      problem: 'A histogram of puzzle times has classes 0 to 10, 10 to 20, 20 to 30, 30 to 40, 40 to 50 minutes with frequencies 5, 15, 20, 10, 10. Estimate how many people took more than 25 minutes.',
      steps: [
        'Whole classes above 25 minutes: 30 to 40 and 40 to 50, so $10 + 10 = 20$ people.',
        '25 cuts the 20 to 30 class. The part above 25 is $30 - 25 = 5$ minutes out of a class width of $10$ minutes.',
        'Take that fraction of the class frequency: $\\frac{5}{10} \\times 20 = 10$ people.',
        'Add: $20 + 10 = 30$ people (an estimate, since we assumed an even spread within the class).',
      ],
      answer: 'About $30$ people.',
    },
  ],
  traps: [
    '**Highest value is not the largest increase.** The tallest bar or highest point tells you the biggest value; the largest increase is the biggest positive difference between neighbouring values (the steepest upward segment).',
    '**A big fall is not a big rise.** When the question says "increase", ignore segments that go down, even if they are the biggest change.',
    '**Ignoring the scale or units.** Gridlines might go up in 2s, 5s or 20s, and the axis might say "thousands". Read one gridline\'s value before reading any bar.',
    '**Assuming a pie chart total of 100 or 360.** If the pie shows counts, add the slices to get the real total. If it shows angles, divide by $360$, not by $100$.',
    '**Reading a cumulative graph as if it were per-period.** On a running-total graph, the amount added in a month is the rise from the previous point, not the height of the point.',
    '**Comparing counts when groups differ in size.** More passes does not mean a better pass rate; divide by each group\'s own total.',
  ],
  examTip:
    'Expect a chart or table plus four options built from classic misreadings: the tallest bar instead of the biggest increase, a decrease instead of an increase, the wrong row, a count instead of a percentage, or an angle instead of a count. Fast moves:\n\n' +
    '- **Write the values down** in a quick list or table first (about 15 seconds). Then the arithmetic is easy on the calculator.\n' +
    '- **Estimate before calculating.** If a slice looks like about a third of the circle, the answer must be near $33\\%$ or $120^\\circ$; cross out anything far away.\n' +
    '- **Check the direction**: "increase" options must come from segments going up; a running total can never decrease.\n' +
    '- **Check units and size**: an answer of 285 on a test marked out of 100, or more people than the total, is impossible.\n' +
    '- **Plug back in**: for a missing table value, add your answer back into the row and see if it gives the total.',
};
