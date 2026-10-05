import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'valid-conclusions',
  know:
    '### The big idea\n\n' +
    'These questions give you a chart, a table or a claim and ask: **is the conclusion actually supported by the data?** You rarely need hard maths. You need a checklist, and the habit of working from the **numbers**, not from how the picture looks.\n\n' +
    '### Misleading graphs\n\n' +
    '**Truncated axis.** If a bar chart\'s vertical axis starts at, say, 35 instead of 0, the bars only show the part above 35. Profit going from 40 to 50 is a 25% rise, but the visible bars are $40 - 35 = 5$ and $50 - 35 = 15$ tall, so the second bar *looks* 3 times as tall. Always read the real values and calculate.\n\n' +
    'A useful measure is the **lie factor**: the percentage change the picture shows divided by the real percentage change. An honest chart has a lie factor close to 1.\n\n' +
    '**Distorted scales.** Check that the gaps on an axis are even. If 2000, 2010, 2020, 2021, 2022 are drawn equally spaced, 10 years are squashed into the same width as 1 year, and the slope of the line becomes meaningless. Compare **rates per year** instead.\n\n' +
    '**Pictograms.** If a picture is scaled by 2 in height *and* width, its area grows by $2 \\times 2 = 4$, so a doubling looks like a fourfold rise. Scaling by $k$ in both directions multiplies the area by $k^2$.\n\n' +
    '**Cherry-picked ranges.** A claim like "up 25% in three months" may use a short stretch of a line that falls overall. Look at the **whole** time range before accepting a trend.\n\n' +
    '### Percentage change versus actual change\n\n' +
    'A 50% rise from 20 is only 10 extra; a 10% rise from 400 is 40 extra. Big percentages from small starting values can be small real changes. Always divide a change by the **starting** value.\n\n' +
    '### Correlation is not causation\n\n' +
    'A **correlation** means two variables tend to move together (as one goes up, so does the other, or the other goes down). It does **not** prove that one causes the other. Common explanations:\n\n' +
    '- **Confounding variable**: a third thing drives both (hot weather raises ice-cream sales *and* drownings).\n' +
    '- **Reverse causation**: the effect may run the other way.\n' +
    '- **Coincidence**, especially with few data points.\n\n' +
    'The reliable way to show cause and effect is a controlled **experiment** (randomly assigning who gets the treatment). Also, a correlation describes a **tendency**, not a rule for every individual.\n\n' +
    'For a regression line $\\hat{y} = mx + c$, the gradient $m$ is the predicted change in $y$ for each extra 1 unit of $x$. That is a prediction, not a promise that changing $x$ will change $y$.\n\n' +
    '### Samples: size and bias\n\n' +
    '| Problem | What it looks like | Effect |\n' +
    '| --- | --- | --- |\n' +
    '| Small sample | A 100% success rate from 3 trials | Very unreliable; one more value can swing it |\n' +
    '| Sampling bias | Asking people in a library how many books they read | Pushes the estimate one way (here, too high) |\n' +
    '| Self-selection | Online poll anyone can answer | Only keen people respond |\n' +
    '| Survivorship bias | Comparing "classic" old songs with all new songs | Failures were filtered out of one group |\n\n' +
    'A **bigger biased sample is still biased**. Size reduces random error; it does not fix who was asked. To judge the direction of bias, ask which group is over-represented and how that pushes the answer.\n\n' +
    '### Combining groups and Simpson\'s paradox\n\n' +
    'To combine rates from groups of different sizes, **add the counts, then divide**. Never average the percentages: 9 of 10 (90%) and 20 of 40 (50%) give $\\frac{29}{50} = 58\\%$, not 70%.\n\n' +
    'Because the bigger subgroup dominates, a strange thing can happen: one hospital can have a **higher** survival rate for mild cases *and* for severe cases, but a **lower** rate overall, simply because it treats mostly severe cases. This reversal is **Simpson\'s paradox**. When the overall result and the subgroup results disagree, the subgroups usually tell the fairer story, and the cause is a lurking variable (how ill the patients were, which department people applied to).\n\n' +
    '### The exam checklist\n\n' +
    '1. Where does each axis start, and are the gaps even?\n' +
    '2. Is the whole range shown?\n' +
    '3. Percentage or actual change? Divided by the starting value?\n' +
    '4. Correlation or experiment? Any confounder?\n' +
    '5. How big is the sample, and who could be in it?\n' +
    '6. Are groups being combined? Add counts, then divide.',
  formulas: [
    {
      label: 'Percentage change',
      tex: '\\text{percentage change} = \\frac{\\text{new} - \\text{original}}{\\text{original}} \\times 100\\%',
      note: 'Always divide by the starting (original) value.',
    },
    {
      label: 'Visible bar height on a truncated axis',
      tex: '\\text{visible height} = \\text{value} - \\text{axis start}',
    },
    {
      label: 'Lie factor',
      tex: '\\text{lie factor} = \\frac{\\text{percentage change shown by the graphic}}{\\text{percentage change in the data}}',
      note: 'About 1 for an honest chart; bigger than 1 means the chart exaggerates.',
    },
    {
      label: 'Area of a scaled picture',
      tex: '\\text{area scale factor} = k^2',
      note: 'When a picture is scaled by $k$ in both width and height.',
    },
    {
      label: 'Combined rate of two groups',
      tex: '\\text{combined rate} = \\frac{k_1 + k_2}{n_1 + n_2} \\times 100\\%',
      note: '$k$ = number of successes, $n$ = group size. Not the average of the two rates unless the groups are the same size.',
    },
    {
      label: 'Gradient of a regression line',
      tex: '\\hat{y} = mx + c \\quad \\Rightarrow \\quad \\text{change in } \\hat{y} = m \\times (\\text{change in } x)',
      note: 'A predicted change, not proof of cause and effect.',
    },
  ],
  examples: [
    {
      title: 'Spot the truncated axis',
      problem:
        'A bar chart shows sales of 60 thousand for Shop A and 66 thousand for Shop B. Its vertical axis starts at 58. How much taller does B\'s bar look, and what is the real percentage difference?',
      steps: [
        'Visible heights: $60 - 58 = 2$ and $66 - 58 = 8$.',
        'So B\'s bar looks $\\frac{8}{2} = 4$ times as tall as A\'s.',
        'Real difference: $66 - 60 = 6$ thousand.',
        'Real percentage difference: $\\frac{6}{60} \\times 100 = 10\\%$.',
      ],
      answer: 'B\'s bar looks 4 times as tall, but B\'s sales are only 10% higher.',
    },
    {
      title: 'Combine two classes',
      problem: 'In Class P, 27 of 30 students passed (90%). In Class Q, 42 of 70 passed (60%). What is the combined pass rate?',
      steps: [
        'Add the passes: $27 + 42 = 69$.',
        'Add the students: $30 + 70 = 100$.',
        'Combined rate: $\\frac{69}{100} \\times 100 = 69\\%$.',
        'Check the trap: the average of 90% and 60% is 75%, which is wrong because Class Q is much bigger.',
      ],
      answer: '69%',
    },
    {
      title: 'Which conclusion is valid?',
      problem:
        'Data from 50 towns show that towns with more fast-food restaurants have higher rates of heart disease. Which is valid: (i) fast food causes heart disease; (ii) the two are positively correlated, but a confounder such as town size or income could explain it; (iii) every town with more restaurants has more heart disease?',
      steps: [
        'This is observational data, not an experiment, so it cannot prove causation. That rules out (i).',
        'A correlation is a tendency, not a rule for every town. That rules out (iii).',
        'Statement (ii) describes the association and admits possible confounders.',
      ],
      answer: 'Statement (ii)',
    },
    {
      title: 'Simpson\'s paradox',
      problem:
        'Drug A: 18 of 20 young patients and 48 of 80 older patients recovered. Drug B: 68 of 80 young and 11 of 20 older patients recovered. Which drug is better in each age group, and which looks better overall?',
      steps: [
        'Drug A rates: $\\frac{18}{20} = 90\\%$ (young), $\\frac{48}{80} = 60\\%$ (older).',
        'Drug B rates: $\\frac{68}{80} = 85\\%$ (young), $\\frac{11}{20} = 55\\%$ (older).',
        'So A is better in **both** age groups.',
        'Overall A: $\\frac{18 + 48}{20 + 80} = \\frac{66}{100} = 66\\%$. Overall B: $\\frac{68 + 11}{80 + 20} = \\frac{79}{100} = 79\\%$.',
        'B looks better overall only because most of its patients were young, and young patients recover more often whatever the drug.',
      ],
      answer: 'A is better in each group, but B looks better overall (79% vs 66%): Simpson\'s paradox.',
    },
  ],
  traps: [
    'Judging by bar heights when the axis does not start at 0. Read the real values and calculate the percentage change.',
    'Averaging percentages from groups of different sizes. Add the counts first, then divide by the total.',
    'Choosing a causal option ("causes", "will increase", "banning X would reduce Y") from correlational data. Without a controlled experiment, only association is supported.',
    'Thinking a large sample fixes bias. 10,000 people from a biased source still give a biased answer.',
    'Dividing a percentage change by the new value instead of the original value, or writing an actual change (4 thousand) as a percentage (4%).',
    'Picking an over-strong option such as "every", "always", "proves" or "never". Valid conclusions are usually cautious ("tended to", "is associated with", "in this sample").',
  ],
  examTip:
    'These questions are usually "which conclusion is valid?" or "why is this chart misleading?". Eliminate fast: cross out any option that claims **causation** from observational data, any that says "every", "always" or "proves", and any that blames sample **size** when the real issue is **who** was sampled. The correct option is usually the most cautious one that still matches the numbers. For calculation versions (real percentage change, combined rate, lie factor), the distractors are the classic mistakes: the "looks like" figure from the bar heights, the simple average of two rates, the fail rate instead of the pass rate, or dividing by the wrong value. Work out the answer with your calculator from the real numbers, then check that it is not one of those traps. If the overall result and the subgroup results disagree, think Simpson\'s paradox.',
};
