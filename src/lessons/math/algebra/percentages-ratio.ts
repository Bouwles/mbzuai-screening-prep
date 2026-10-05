import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'percentages-ratio',
  know:
    '### What a percentage really is\n\n' +
    '"Per cent" means "out of 100". So 35% is $\\frac{35}{100} = 0.35$. To turn a percentage into a decimal, divide by 100 (move the decimal point two places left): 7% is $0.07$, 120% is $1.2$, 2.5% is $0.025$.\n\n' +
    'The word "of" means **multiply**. So 35% of 240 is $0.35 \\times 240 = 84$.\n\n' +
    'Mental check: 10% is "divide by 10" and 5% is half of that. For 35% of 240: 10% is 24, 30% is 72, 5% is 12, so 35% is $72 + 12 = 84$.\n\n' +
    '### Multipliers: the single most useful idea\n\n' +
    'Instead of finding the percentage and then adding or subtracting it, multiply by **one number**:\n\n' +
    '| Change | New value as a % of the original | Multiplier |\n' +
    '| --- | --- | --- |\n' +
    '| increase by 15% | 115% | $1.15$ |\n' +
    '| decrease by 15% | 85% | $0.85$ |\n' +
    '| increase by 5% (e.g. VAT) | 105% | $1.05$ |\n' +
    '| decrease by 40% | 60% | $0.6$ |\n\n' +
    'A multiplier bigger than 1 means an increase; smaller than 1 means a decrease.\n\n' +
    '### Percentage change\n\n' +
    'To find by what percentage something changed, divide the change by the **original** value:\n\n' +
    '$$\\text{percentage change} = \\frac{\\text{new} - \\text{original}}{\\text{original}} \\times 100\\%$$\n\n' +
    'From 80 to 92 the change is 12, and $\\frac{12}{80} = 0.15$, so it is a 15% increase.\n\n' +
    '### Reverse percentages (finding the original)\n\n' +
    'If you know the value **after** a change, write: original $\\times$ multiplier $=$ new value. Then **divide**. After a 20% discount a jacket costs AED 240, so the original is $240 \\div 0.8 = 300$. Never "add 20% back on": 20% of 240 is not the same as 20% of 300.\n\n' +
    '### Successive changes multiply\n\n' +
    'A rise of 30% followed by a fall of 30% is **not** "no change". Multiply the multipliers: $1.3 \\times 0.7 = 0.91$, which is a 9% decrease overall.\n\n' +
    '### Simple and compound interest\n\n' +
    '- **Simple interest** is paid only on the original amount, so the interest is the same every year: $I = \\frac{Prt}{100}$.\n' +
    '- **Compound interest** is paid on the original amount *plus earlier interest*, so the multiplier is used once per year: $A = P\\left(1 + \\frac{r}{100}\\right)^{n}$.\n' +
    '- **Depreciation** (losing value each year) is the same idea with a multiplier below 1: $V = P\\left(1 - \\frac{r}{100}\\right)^{n}$.\n\n' +
    'Read carefully whether the question wants the **total amount** or just the **interest** ($A - P$).\n\n' +
    '### Ratio\n\n' +
    'A ratio such as $4 : 5$ compares two amounts: for every 4 of the first there are 5 of the second. To share AED 360 in the ratio $4 : 5$:\n\n' +
    '1. Add the parts: $4 + 5 = 9$.\n' +
    '2. One part: $360 \\div 9 = 40$.\n' +
    '3. Shares: $4 \\times 40 = 160$ and $5 \\times 40 = 200$.\n\n' +
    'Note: $4 : 5$ does **not** mean the first person gets $\\frac{4}{5}$ of the money. They get $\\frac{4}{9}$.\n\n' +
    'If you are told a **difference** (e.g. "12 more girls than boys" with ratio $3 : 5$), the difference is $5 - 3 = 2$ parts, so one part is 6.\n\n' +
    'To combine $a : b = 2 : 3$ with $b : c = 4 : 5$, make the $b$ numbers match (LCM 12): $8 : 12 : 15$.\n\n' +
    '### Direct and inverse proportion\n\n' +
    '- **Direct**: $y = kx$. Double $x$, double $y$. (More kilograms of rice, more cost.)\n' +
    '- **Inverse**: $y = \\frac{k}{x}$, so $xy$ is constant. Double $x$, halve $y$. (More workers, fewer days.)\n' +
    '- Variations like $y = kx^2$ or $y = \\frac{k}{x^2}$ follow the same method: write the equation, find $k$ from the given pair, then substitute.\n\n' +
    '### Unit rates\n\n' +
    'A unit rate is "how much for **one**": price per gram, litres per km, km per hour. Convert units first (2 kg $= 2000$ g), find the cost of one unit, then multiply by the amount you need.',
  formulas: [
    { label: 'Percentage of an amount', tex: 'p\\% \\text{ of } x = \\frac{p}{100} \\times x' },
    { label: 'Multiplier for an increase of $p\\%$', tex: '1 + \\frac{p}{100}', note: 'e.g. an increase of 15% gives $1.15$' },
    { label: 'Multiplier for a decrease of $p\\%$', tex: '1 - \\frac{p}{100}', note: 'e.g. a decrease of 15% gives $0.85$' },
    {
      label: 'Percentage change',
      tex: '\\frac{\\text{new} - \\text{original}}{\\text{original}} \\times 100\\%',
      note: 'Always divide by the ORIGINAL value.',
    },
    { label: 'Reverse percentage', tex: '\\text{original} = \\frac{\\text{new value}}{\\text{multiplier}}' },
    { label: 'Successive changes', tex: '\\text{overall multiplier} = m_1 \\times m_2 \\times \\cdots', note: 'Multiply the multipliers, never add the percentages.' },
    { label: 'Simple interest', tex: 'I = \\frac{P r t}{100}', note: '$P$ = amount invested (principal), $r$ = rate per year as a percentage, $t$ = number of years.' },
    { label: 'Compound interest (yearly)', tex: 'A = P\\left(1 + \\frac{r}{100}\\right)^{n}', note: '$A$ is the total amount; the interest alone is $A - P$.' },
    { label: 'Depreciation', tex: 'V = P\\left(1 - \\frac{r}{100}\\right)^{n}' },
    { label: 'Sharing in a ratio $a : b$', tex: '\\text{first share} = \\frac{a}{a + b} \\times \\text{total}' },
    { label: 'Direct proportion', tex: 'y = kx' },
    { label: 'Inverse proportion', tex: 'y = \\frac{k}{x} \\quad (xy = k)' },
    { label: 'Unit rate', tex: '\\text{rate per unit} = \\frac{\\text{total amount}}{\\text{number of units}}' },
  ],
  examples: [
    {
      title: 'Percentage increase',
      problem: 'A club grows from 80 members to 92 members. What is the percentage increase?',
      steps: [
        'Change: $92 - 80 = 12$.',
        'Divide by the original: $\\frac{12}{80} = 0.15$.',
        'Convert to a percentage: $0.15 \\times 100 = 15\\%$.',
        'Check with the multiplier: $80 \\times 1.15 = 92$. ✓',
      ],
      answer: 'A 15% increase.',
    },
    {
      title: 'Reverse percentage with VAT',
      problem: 'A bill of AED 420 includes 5% VAT. What was the bill before VAT?',
      steps: [
        'Adding 5% gives the multiplier $1.05$, so: before $\\times 1.05 = 420$.',
        'Divide: $420 \\div 1.05 = 400$.',
        'Check: 5% of 400 is 20, and $400 + 20 = 420$. ✓',
      ],
      answer: 'AED 400',
    },
    {
      title: 'Compound interest',
      problem: 'AED 5000 is invested at 4% per year compound interest. Find the total value after 3 years.',
      steps: [
        'Multiplier per year: $1 + \\frac{4}{100} = 1.04$.',
        'Use the formula: $A = 5000 \\times 1.04^{3}$.',
        'Calculator: $1.04^{3} = 1.124864$, and $5000 \\times 1.124864 = 5624.32$.',
        'Compare: simple interest would give only $5000 + 3 \\times 200 = 5600$.',
      ],
      answer: 'AED 5624.32',
    },
    {
      title: 'Combining two ratios (exam level)',
      problem: 'Given $a : b = 2 : 3$, $b : c = 4 : 5$ and $a + b + c = 175$, find $c$.',
      steps: [
        'The shared quantity $b$ is 3 parts in one ratio and 4 in the other. The LCM of 3 and 4 is 12.',
        'Scale: $a : b = 8 : 12$ and $b : c = 12 : 15$, so $a : b : c = 8 : 12 : 15$.',
        'Total parts: $8 + 12 + 15 = 35$. One part: $175 \\div 35 = 5$.',
        '$c = 15 \\times 5 = 75$.',
      ],
      answer: '$c = 75$',
    },
    {
      title: 'Inverse proportion',
      problem: '6 workers, all working at the same rate, take 10 days to build a wall. How long would 4 workers take?',
      steps: [
        'Fewer workers means more days, so this is inverse proportion: workers $\\times$ days stays the same.',
        'Total work: $6 \\times 10 = 60$ worker-days.',
        'Share it between 4 workers: $60 \\div 4 = 15$ days.',
        'Sense check: 15 days is more than 10 days, as it should be with fewer workers. ✓',
      ],
      answer: '15 days',
    },
  ],
  traps: [
    'Adding successive percentages: +30% then -30% is a 9% DECREASE overall ($1.3 \\times 0.7 = 0.91$), not "no change".',
    'Reverse percentages: after a 20% discount to AED 240, the original is $240 \\div 0.8 = 300$, not $240 \\times 1.2 = 288$. The percentage was taken from the original, not the new price.',
    'Dividing by the wrong value in percentage change: always divide by the ORIGINAL value, not the new one.',
    'Mixing up simple and compound interest, or giving the total when the question asks for the interest only (or the other way round).',
    'Reading a ratio $4 : 5$ as the fraction $\\frac{4}{5}$. The first share is $\\frac{4}{4 + 5} = \\frac{4}{9}$ of the total.',
    'Using direct proportion when it should be inverse: fewer workers means MORE days, so multiply workers by days, then divide.',
  ],
  examTip:
    'These questions are quick wins if you use multipliers on your calculator. Typical distractors are exactly the traps above: the "added the percentages" answer, the "took the percentage of the new price" answer, the interest-only versus total answer, and the "one part" or "other person\'s share" answer in ratio questions.\n\n' +
    '- **Plug the options back in.** For a reverse percentage, multiply each option by the multiplier: only the right one gives the stated price.\n' +
    '- **Sense-check the size.** An original price before a discount must be bigger than the sale price; compound interest is always a bit more than simple interest; inverse proportion moves the other way.\n' +
    '- **Check ratio shares add up** to the total and have the right ratio.\n' +
    '- For "after how many years" questions, test the options with $P \\times m^{n}$ instead of using logs; remember to round UP to the first whole year that passes the target.',
};
