import type { StaticQuestion } from '../../../types';

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'percentages-ratio-001',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'A phone costs AED 240. To reserve it, you pay a deposit of 35% of the price. How much is the deposit?',
    options: ['AED 156', 'AED 8.40', 'AED 84', 'AED 840'],
    correctIndex: 2,
    markScheme: {
      solution:
        '"Per cent" means "out of 100", so 35% is $\\frac{35}{100} = 0.35$.\n\n' +
        '"Of" means multiply:\n\n' +
        '$$0.35 \\times 240 = 84$$\n\n' +
        'Sense check: 10% of 240 is 24, so 30% is 72 and 5% is 12. Then 35% is $72 + 12 = 84$.\n\n' +
        'The deposit is AED 84.',
      whyWrong: [
        'This is $240 - 84 = 156$, the amount still left to pay (65% of the price), not the deposit.',
        'This uses $0.035$ instead of $0.35$: that is 3.5% of the price, a decimal-place slip when converting the percentage.',
        null,
        'This multiplies by $3.5$ instead of $0.35$. A deposit of 35% must be smaller than the price itself.',
      ],
      keyIdea: 'To find $p\\%$ of an amount, multiply the amount by $\\frac{p}{100}$.',
    },
    check: {
      optionValues: [156, 8.4, 84, 840],
      compute: () => (240 * 35) / 100,
    },
  },
  {
    id: 'percentages-ratio-002',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'A price is **decreased** by 15%. Which single number can you multiply the original price by to get the new price?',
    options: ['$1.15$', '$0.85$', '$0.15$', '$0.985$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The original price is 100% of itself. After a 15% decrease, what is left is\n\n' +
        '$$100\\% - 15\\% = 85\\%$$\n\n' +
        'Write 85% as a decimal: $\\frac{85}{100} = 0.85$.\n\n' +
        'So the multiplier is $0.85$. For example, AED 200 becomes $200 \\times 0.85 = 170$, which is AED 30 (15%) less.',
      whyWrong: [
        'This is the multiplier for a 15% **increase** ($100\\% + 15\\% = 115\\%$), not a decrease.',
        null,
        'Multiplying by $0.15$ gives the size of the **decrease** (the 15% that is removed), not the new price.',
        'This writes 15% as $0.015$ instead of $0.15$, and then works out $1 - 0.015$. That would be a 1.5% decrease.',
      ],
      keyIdea: 'A decrease of $p\\%$ has multiplier $1 - \\frac{p}{100}$; an increase of $p\\%$ has multiplier $1 + \\frac{p}{100}$.',
    },
    check: {
      optionValues: [1.15, 0.85, 0.15, 0.985],
      compute: () => 1 - 15 / 100,
    },
  },
  {
    id: 'percentages-ratio-003',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'Huda and Karim share AED 360 in the ratio $4 : 5$. How much does the person with the **larger** share receive?',
    options: ['AED 160', 'AED 180', 'AED 72', 'AED 200'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1: add the parts of the ratio: $4 + 5 = 9$ parts.\n\n' +
        'Step 2: find one part: $360 \\div 9 = 40$, so one part is AED 40.\n\n' +
        'Step 3: the larger share is 5 parts: $5 \\times 40 = 200$.\n\n' +
        'Check: the smaller share is $4 \\times 40 = 160$, and $160 + 200 = 360$. ✓\n\n' +
        'The larger share is AED 200.',
      whyWrong: [
        'This is the **smaller** share ($4 \\times 40$), not the larger one.',
        'This splits the money equally ($360 \\div 2$) and ignores the ratio completely.',
        'This divides 360 by 5 (one number of the ratio) instead of by the total number of parts, 9.',
        null,
      ],
      keyIdea: 'To share in a ratio: add the parts, divide the total by that sum to get one part, then multiply.',
    },
    check: {
      optionValues: [160, 180, 72, 200],
      compute: () => (360 / (4 + 5)) * Math.max(4, 5),
    },
  },
  {
    id: 'percentages-ratio-004',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'A 750 g bag of rice costs AED 12. At the same price per gram, how much would **2 kg** of rice cost?',
    options: ['AED 32', 'AED 24', 'AED 0.032', 'AED 16'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Step 1: use the same units. $2\\text{ kg} = 2000\\text{ g}$.\n\n' +
        'Step 2: find the unit rate (price of 1 g):\n\n' +
        '$$12 \\div 750 = 0.016 \\text{ dirhams per gram}$$\n\n' +
        'Step 3: multiply by the amount you want:\n\n' +
        '$$0.016 \\times 2000 = 32$$\n\n' +
        'Check another way: 1 kg costs $0.016 \\times 1000 = 16$, so 2 kg cost $2 \\times 16 = 32$.\n\n' +
        'So 2 kg cost AED 32.',
      whyWrong: [
        null,
        'This assumes 2 kg is two bags. Two bags are only $2 \\times 750 = 1500$ g, not 2000 g.',
        'This multiplies the price per gram by 2 instead of by 2000: the kilograms were not converted to grams.',
        'This is the price of **1 kg** ($0.016 \\times 1000$). The question asks for 2 kg, so it must be doubled.',
      ],
      keyIdea: 'Convert to the same units, find the cost of ONE unit (the unit rate), then multiply by the quantity you need.',
    },
    check: {
      optionValues: [32, 24, 0.032, 16],
      compute: () => (12 / 750) * (2 * 1000),
    },
  },
  {
    id: 'percentages-ratio-005',
    subtopic: 'percentages-ratio',
    difficulty: 'foundation',
    stem: 'The number of students in a coding club rises from 80 to 92. What is the percentage increase?',
    options: ['12%', '15%', '13.0% (to 3 s.f.)', '115%'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Step 1: find the actual change: $92 - 80 = 12$.\n\n' +
        'Step 2: divide by the **original** value (80), then multiply by 100:\n\n' +
        '$$\\frac{12}{80} \\times 100 = 0.15 \\times 100 = 15\\%$$\n\n' +
        'Check with a multiplier: $80 \\times 1.15 = 92$. ✓\n\n' +
        'The increase is 15%.',
      whyWrong: [
        'This is the actual increase (12 students), not the **percentage** increase. You still need to divide by the original 80.',
        null,
        'This divides the change by the **new** value: $\\frac{12}{92} \\times 100 \\approx 13.0\\%$. Percentage change is always measured against the original value.',
        'This is $\\frac{92}{80} \\times 100$: the new value as a percentage of the old one. The increase is $115\\% - 100\\% = 15\\%$.',
      ],
      keyIdea: 'Percentage change $= \\frac{\\text{new} - \\text{original}}{\\text{original}} \\times 100\\%$.',
    },
    check: {
      optionValues: [12, 15, 1200 / 92, 115],
      compute: () => ((92 - 80) / 80) * 100,
    },
  },
  // ---------------------------------------------------------------- exam
  {
    id: 'percentages-ratio-006',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'In a sale, all prices are reduced by 20%. A jacket now costs AED 240. What was its price **before** the sale?',
    options: ['AED 288', 'AED 300', 'AED 200', 'AED 192'],
    correctIndex: 1,
    markScheme: {
      solution:
        'This is a **reverse percentage**: we know the price *after* the change and want the original.\n\n' +
        'Step 1: a 20% reduction leaves 80% of the original, so the multiplier is $0.8$:\n\n' +
        '$$\\text{original} \\times 0.8 = 240$$\n\n' +
        'Step 2: undo the multiplication by dividing:\n\n' +
        '$$\\text{original} = 240 \\div 0.8 = 300$$\n\n' +
        'Check: 20% of 300 is 60, and $300 - 60 = 240$. ✓\n\n' +
        'The original price was AED 300.',
      whyWrong: [
        'This adds 20% **of the sale price** ($240 \\times 1.2$). The 20% was taken off the original price, which is bigger than 240, so adding 20% of 240 is not enough.',
        null,
        'This divides by $1.2$ as if the price had gone **up** by 20%. The original price must be more than AED 240.',
        'This takes another 20% off ($240 \\times 0.8$). The original price must be higher than the sale price, not lower.',
      ],
      keyIdea: 'For a reverse percentage, write original $\\times$ multiplier $=$ new value, then DIVIDE by the multiplier.',
    },
    check: {
      optionValues: [288, 300, 200, 192],
      compute: () => 240 / (1 - 20 / 100),
    },
  },
  {
    id: 'percentages-ratio-007',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A restaurant bill of AED 420 **includes** 5% VAT. What was the bill before VAT was added?',
    options: ['AED 399', 'AED 441', 'AED 20', 'AED 400'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Adding 5% VAT means the bill is 105% of the pre-VAT price, so the multiplier is $1.05$:\n\n' +
        '$$\\text{price before VAT} \\times 1.05 = 420$$\n\n' +
        'Divide to reverse it:\n\n' +
        '$$\\text{price before VAT} = 420 \\div 1.05 = 400$$\n\n' +
        'Check: 5% of 400 is 20, and $400 + 20 = 420$. ✓\n\n' +
        'The bill before VAT was AED 400.',
      whyWrong: [
        'This subtracts 5% **of 420** ($420 \\times 0.95$). VAT was 5% of the smaller pre-VAT price, so taking 5% of 420 removes too much.',
        'This adds another 5% ($420 \\times 1.05$) instead of removing the VAT that is already included.',
        'This is the amount of VAT paid ($420 - 400$), not the price before VAT.',
        null,
      ],
      keyIdea: 'A price that includes $p\\%$ VAT is $(100 + p)\\%$ of the original: divide by $1 + \\frac{p}{100}$ to remove it.',
    },
    check: {
      optionValues: [399, 441, 20, 400],
      compute: () => 420 / (1 + 5 / 100),
    },
  },
  {
    id: 'percentages-ratio-008',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A share price rises by 30% on Monday and then falls by 30% on Tuesday. What is the overall percentage change from the start of Monday to the end of Tuesday?',
    options: ['no change', 'a 9% decrease', 'a 9% increase', 'a 91% decrease'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Successive percentage changes **multiply**; they do not add.\n\n' +
        '- Rise of 30%: multiplier $1.3$\n' +
        '- Fall of 30%: multiplier $0.7$\n\n' +
        'Overall multiplier:\n\n' +
        '$$1.3 \\times 0.7 = 0.91$$\n\n' +
        'A multiplier of $0.91$ means the final price is 91% of the starting price, which is $100\\% - 91\\% = 9\\%$ less.\n\n' +
        'Check with numbers: start at 100. After Monday: $100 \\times 1.3 = 130$. After Tuesday: $130 \\times 0.7 = 91$. That is 9 less than 100.\n\n' +
        'Overall: a 9% decrease.',
      whyWrong: [
        'This adds the percentages: $+30\\% - 30\\% = 0$. But the 30% fall is taken from the **bigger** Monday price, so more is lost than was gained.',
        null,
        'The size (9%) is right, but the direction is wrong: the overall multiplier $0.91$ is less than 1, so the price went **down**.',
        'This reads the overall multiplier $0.91$ as the change. The final price is 91% **of** the start, so the decrease is only 9%.',
      ],
      keyIdea: 'For successive percentage changes, multiply the multipliers, then compare the result with 1.',
    },
    check: {
      optionValues: [0, -9, 9, -91],
      compute: () => (1.3 * 0.7 - 1) * 100,
    },
  },
  {
    id: 'percentages-ratio-009',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'AED 5000 is invested at 4% per year **compound** interest, compounded annually. What is the total value of the investment after 3 years? Give your answer to 2 decimal places.',
    options: ['AED 5624.32', 'AED 5600.00', 'AED 624.32', 'AED 5849.29'],
    correctIndex: 0,
    markScheme: {
      solution:
        'With compound interest, each year the value is multiplied by $1 + \\frac{4}{100} = 1.04$.\n\n' +
        '$$A = P\\left(1 + \\frac{r}{100}\\right)^{n} = 5000 \\times 1.04^{3}$$\n\n' +
        'Year by year:\n\n' +
        '- After 1 year: $5000 \\times 1.04 = 5200$\n' +
        '- After 2 years: $5200 \\times 1.04 = 5408$\n' +
        '- After 3 years: $5408 \\times 1.04 = 5624.32$\n\n' +
        'The investment is worth AED 5624.32.',
      whyWrong: [
        null,
        'This is **simple** interest: $5000 \\times 0.04 \\times 3 = 600$ added once. Compound interest also earns interest on previous interest.',
        'This is only the interest earned ($5624.32 - 5000$), not the total value of the investment.',
        'This uses 4 years instead of 3: $5000 \\times 1.04^{4} \\approx 5849.29$. The power must equal the number of years.',
      ],
      keyIdea: 'Compound interest: $A = P\\left(1 + \\frac{r}{100}\\right)^{n}$, the multiplier is applied once per year.',
    },
    check: {
      optionValues: [5624.32, 5600, 624.32, 5849.29],
      compute: () => Math.round(5000 * (1 + 4 / 100) ** 3 * 100) / 100,
    },
  },
  {
    id: 'percentages-ratio-010',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'Sami puts AED 2400 in an account that pays **simple** interest at 3.5% per year. How much **interest** has he earned after 4 years?',
    options: ['AED 2736', 'AED 84', 'AED 336', 'AED 354.06'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Simple interest is paid only on the original amount, so it is the same every year.\n\n' +
        'Interest for one year: $2400 \\times 0.035 = 84$.\n\n' +
        'Interest for 4 years: $84 \\times 4 = 336$.\n\n' +
        'Using the formula: $$I = \\frac{P \\times r \\times t}{100} = \\frac{2400 \\times 3.5 \\times 4}{100} = 336$$\n\n' +
        'Sami earns AED 336 in interest.',
      whyWrong: [
        'This is the total in the account ($2400 + 336$). The question asks only for the interest earned.',
        'This is the interest for **one** year only. It must be multiplied by 4 years.',
        null,
        'This uses **compound** interest: $2400 \\times 1.035^{4} - 2400 \\approx 354.06$. The account pays simple interest.',
      ],
      keyIdea: 'Simple interest $I = \\frac{Prt}{100}$: the same amount of interest is added every year.',
    },
    check: {
      optionValues: [2736, 84, 336, 354.06],
      compute: () => (2400 * 3.5 * 4) / 100,
    },
  },
  {
    id: 'percentages-ratio-011',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: '$y$ is directly proportional to $x^2$. When $x = 2$, $y = 12$. What is the value of $y$ when $x = 5$?',
    options: ['$30$', '$150$', '$1.92$', '$75$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1: write the proportion as an equation with a constant $k$:\n\n' +
        '$$y = kx^2$$\n\n' +
        'Step 2: use $x = 2$, $y = 12$ to find $k$: $12 = k \\times 2^2 = 4k$, so $k = 3$.\n\n' +
        'Step 3: the rule is $y = 3x^2$. When $x = 5$:\n\n' +
        '$$y = 3 \\times 5^2 = 3 \\times 25 = 75$$\n\n' +
        'So $y = 75$.',
      whyWrong: [
        'This treats $y$ as proportional to $x$ (not $x^2$): $\\frac{12}{2} \\times 5 = 30$.',
        'This finds $k$ by dividing by $x$ instead of $x^2$ ($k = \\frac{12}{2} = 6$), then uses $y = 6 \\times 25$.',
        'This uses **inverse** proportion, $y = \\frac{k}{x^2}$, giving $k = 48$ and $y = \\frac{48}{25} = 1.92$.',
        null,
      ],
      keyIdea: '"$y$ is directly proportional to $x^2$" means $y = kx^2$: find $k$ from the given pair, then substitute.',
    },
    check: {
      optionValues: [30, 150, 1.92, 75],
      compute: () => {
        const k = 12 / 2 ** 2;
        return k * 5 ** 2;
      },
    },
  },
  {
    id: 'percentages-ratio-012',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: '6 workers, all working at the same rate, take 10 days to build a wall. How long would 4 workers take to build the same wall?',
    options: ['15 days', '$6\\frac{2}{3}$ days', '12 days', '60 days'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Fewer workers means **more** days, so this is **inverse** proportion.\n\n' +
        'Step 1: find the total amount of work in "worker-days":\n\n' +
        '$$6 \\times 10 = 60 \\text{ worker-days}$$\n\n' +
        'Step 2: share that work between 4 workers:\n\n' +
        '$$60 \\div 4 = 15 \\text{ days}$$\n\n' +
        'Sense check: 4 workers is fewer than 6, so the job should take longer than 10 days. ✓\n\n' +
        'The wall takes 15 days.',
      whyWrong: [
        null,
        'This uses **direct** proportion ($10 \\times \\frac{4}{6}$). Fewer workers cannot finish the job faster.',
        'This says "2 fewer workers, so 2 more days". Proportion works by multiplying, not by adding or subtracting.',
        'This is the total work, $6 \\times 10 = 60$ worker-days. It still has to be divided by the 4 workers.',
      ],
      keyIdea: 'In inverse proportion the product stays the same: workers $\\times$ days is constant.',
    },
    check: {
      optionValues: [15, 20 / 3, 12, 60],
      compute: () => (6 * 10) / 4,
    },
  },
  {
    id: 'percentages-ratio-013',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'In a class, the ratio of boys to girls is $3 : 5$. There are 12 more girls than boys. How many students are in the class altogether?',
    options: ['18', '30', '48', '96'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Step 1: the difference between girls and boys is $5 - 3 = 2$ parts.\n\n' +
        'Step 2: those 2 parts are 12 students, so one part is $12 \\div 2 = 6$ students.\n\n' +
        'Step 3: the whole class is $3 + 5 = 8$ parts: $8 \\times 6 = 48$ students.\n\n' +
        'Check: boys $= 3 \\times 6 = 18$, girls $= 5 \\times 6 = 30$, and $30 - 18 = 12$. ✓\n\n' +
        'There are 48 students.',
      whyWrong: [
        'This is the number of **boys** only ($3 \\times 6$), not the whole class.',
        'This is the number of **girls** only ($5 \\times 6$), not the whole class.',
        null,
        'This treats the difference of 12 as **one** part, giving $8 \\times 12$. The difference is $5 - 3 = 2$ parts.',
      ],
      keyIdea: 'When a difference is given, match it to the difference in ratio parts to find the value of one part.',
    },
    check: {
      optionValues: [18, 30, 48, 96],
      compute: () => (12 / (5 - 3)) * (3 + 5),
    },
  },
  {
    id: 'percentages-ratio-014',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A car uses 6 litres of fuel for every 100 km. Fuel costs AED 3 per litre. How much does the fuel cost for a 450 km trip?',
    options: ['AED 27', 'AED 81', 'AED 13.50', 'AED 225'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Step 1: how many lots of 100 km are in 450 km? $450 \\div 100 = 4.5$.\n\n' +
        'Step 2: fuel used: $4.5 \\times 6 = 27$ litres.\n\n' +
        'Step 3: cost: $27 \\times 3 = 81$.\n\n' +
        'The fuel costs AED 81.',
      whyWrong: [
        'This is the number of **litres** used (27), not the cost. It still needs multiplying by AED 3 per litre.',
        null,
        'This multiplies $4.5 \\times 3$ and forgets the car uses **6** litres per 100 km, not 1 litre.',
        'This divides $450 \\div 6 = 75$ as if the car did 6 km per litre, then multiplies by 3. The rate is 6 litres per **100** km.',
      ],
      keyIdea: 'Chain unit rates step by step: distance to litres (using L per 100 km), then litres to cost.',
    },
    check: {
      optionValues: [27, 81, 13.5, 225],
      compute: () => (450 / 100) * 6 * 3,
    },
  },
  {
    id: 'percentages-ratio-015',
    subtopic: 'percentages-ratio',
    difficulty: 'exam',
    stem: 'A new car is worth AED 80000. Its value **depreciates** (falls) by 15% each year. What is it worth after 2 years?',
    options: ['AED 56000', 'AED 68000', 'AED 105800', 'AED 57800'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each year the car keeps 85% of its value from the previous year, so the yearly multiplier is $0.85$.\n\n' +
        '$$80000 \\times 0.85^{2} = 80000 \\times 0.7225 = 57800$$\n\n' +
        'Year by year:\n\n' +
        '- After 1 year: $80000 \\times 0.85 = 68000$\n' +
        '- After 2 years: $68000 \\times 0.85 = 57800$\n\n' +
        'The car is worth AED 57800.',
      whyWrong: [
        'This takes off $2 \\times 15\\% = 30\\%$ of the **original** value. In year 2 the 15% is taken from the already lower value of AED 68000.',
        'This is the value after only **one** year.',
        'This uses the multiplier $1.15$ (growth) instead of $0.85$. Depreciation means the value goes down.',
        null,
      ],
      keyIdea: 'Depreciation is compound decrease: value $= P\\left(1 - \\frac{r}{100}\\right)^{n}$.',
    },
    check: {
      optionValues: [56000, 68000, 105800, 57800],
      compute: () => Math.round(80000 * (1 - 15 / 100) ** 2),
    },
  },
  // ---------------------------------------------------------------- challenge
  {
    id: 'percentages-ratio-016',
    subtopic: 'percentages-ratio',
    difficulty: 'challenge',
    stem: 'A shop increases the price of a watch by 20%. Later it offers 10% off the new price, and the watch then costs AED 540. What was the price **before** the 20% increase? (Give the answer to 2 decimal places if needed.)',
    options: ['AED 490.91', 'AED 475.20', 'AED 500', 'AED 496.80'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let the original price be $P$.\n\n' +
        'Step 1: overall multiplier for "up 20%, then down 10%":\n\n' +
        '$$1.2 \\times 0.9 = 1.08$$\n\n' +
        'Step 2: so $P \\times 1.08 = 540$.\n\n' +
        'Step 3: divide to reverse it:\n\n' +
        '$$P = 540 \\div 1.08 = 500$$\n\n' +
        'Check: $500 \\times 1.2 = 600$, then $600 \\times 0.9 = 540$. ✓\n\n' +
        'The original price was AED 500.',
      whyWrong: [
        'This adds the percentages ($+20\\% - 10\\% = +10\\%$) and divides by $1.1$. Successive changes multiply: the overall multiplier is $1.08$, not $1.1$.',
        'This "undoes" each change by applying the opposite percentage to the final price ($540 \\times 0.8 \\times 1.1$). Reversing must be done by dividing by the multipliers.',
        null,
        'This finds the overall change (+8%) correctly but then takes 8% **of 540** off ($540 \\times 0.92$). Reverse percentages need a division by $1.08$.',
      ],
      keyIdea: 'Combine successive changes into one multiplier, then divide the final value by it to recover the original.',
    },
    check: {
      optionValues: [490.91, 475.2, 500, 496.8],
      compute: () => 540 / ((1 + 20 / 100) * (1 - 10 / 100)),
    },
  },
  {
    id: 'percentages-ratio-017',
    subtopic: 'percentages-ratio',
    difficulty: 'challenge',
    stem: 'AED 2000 is invested at 5% per year compound interest (compounded annually). After how many **whole** years will the value of the investment first be **more than** AED 3000?',
    options: ['10', '19', '8', '9'],
    correctIndex: 3,
    markScheme: {
      solution:
        'We need the smallest whole number $n$ with\n\n' +
        '$$2000 \\times 1.05^{n} > 3000 \\quad\\Longleftrightarrow\\quad 1.05^{n} > 1.5$$\n\n' +
        '**Method 1 (logs):** $n > \\frac{\\ln 1.5}{\\ln 1.05} \\approx \\frac{0.4055}{0.04879} \\approx 8.31$. The smallest whole number above 8.31 is 9.\n\n' +
        '**Method 2 (test the options on a calculator):**\n\n' +
        '- $n = 8$: $2000 \\times 1.05^{8} \\approx 2954.91$, still less than 3000\n' +
        '- $n = 9$: $2000 \\times 1.05^{9} \\approx 3102.66$, more than 3000 ✓\n\n' +
        'So the value first exceeds AED 3000 after 9 years.',
      whyWrong: [
        'This uses **simple** interest: 5% of 2000 is AED 100 per year, so $1000 \\div 100 = 10$ years to gain AED 1000 (and even then the value only equals AED 3000, it is not more). Compound interest also earns interest on earlier interest, so it grows faster and passes AED 3000 sooner.',
        'This treats AED 3000 as the **interest** wanted, so it solves $2000 \\times 1.05^{n} > 5000$ (that is, $1.05^{n} > 2.5$, giving $n = 19$). The question is about the total value.',
        'This rounds $8.31$ **down**. After 8 years the value is only about AED 2954.91, which is not yet more than 3000.',
        null,
      ],
      keyIdea: 'To find when a compound amount passes a target, solve $\\left(1 + \\frac{r}{100}\\right)^{n} > \\frac{\\text{target}}{P}$ and round UP to a whole year.',
    },
    check: {
      optionValues: [10, 19, 8, 9],
      compute: () => {
        let n = 0;
        let value = 2000;
        while (value <= 3000) {
          value *= 1.05;
          n++;
        }
        return n;
      },
    },
  },
  {
    id: 'percentages-ratio-018',
    subtopic: 'percentages-ratio',
    difficulty: 'challenge',
    stem: 'Three numbers $a$, $b$ and $c$ satisfy $a : b = 2 : 3$ and $b : c = 4 : 5$. If $a + b + c = 175$, what is the value of $c$?',
    options: ['$60$', '$75$', '$62.5$', '$87.5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The two ratios share $b$, but $b$ is "3" in one and "4" in the other. Make the $b$ parts equal first.\n\n' +
        'Step 1: the lowest common multiple of 3 and 4 is 12.\n\n' +
        '- $a : b = 2 : 3 = 8 : 12$ (multiply by 4)\n' +
        '- $b : c = 4 : 5 = 12 : 15$ (multiply by 3)\n\n' +
        'Step 2: so $a : b : c = 8 : 12 : 15$, which is $8 + 12 + 15 = 35$ parts.\n\n' +
        'Step 3: one part is $175 \\div 35 = 5$.\n\n' +
        'Step 4: $c = 15 \\times 5 = 75$.\n\n' +
        'Check: $a = 40$, $b = 60$, $c = 75$; $40 : 60 = 2 : 3$ ✓, $60 : 75 = 4 : 5$ ✓, total 175 ✓.\n\n' +
        'So $c = 75$.',
      whyWrong: [
        'This is the value of $b$ ($12 \\times 5$), not $c$.',
        null,
        'This adds all four ratio numbers ($2 + 3 + 4 + 5 = 14$) and takes $\\frac{5}{14}$ of 175. The ratios must be combined through $b$ first.',
        'This joins the ratios as $2 : 3 : 5$ without making the $b$ parts match, giving $\\frac{5}{10} \\times 175$.',
      ],
      keyIdea: 'To combine $a : b$ and $b : c$, scale both so the shared quantity $b$ has the same number of parts.',
    },
    check: {
      optionValues: [60, 75, 62.5, 87.5],
      compute: () => {
        // brute force: integer a, b, c with a + b + c = 175 and 3a = 2b, 5b = 4c
        for (let a = 1; a < 175; a++)
          for (let b = 1; a + b < 175; b++) {
            const c = 175 - a - b;
            if (3 * a === 2 * b && 5 * b === 4 * c) return c;
          }
        return -1;
      },
    },
  },
  {
    id: 'percentages-ratio-019',
    subtopic: 'percentages-ratio',
    difficulty: 'challenge',
    stem: 'The brightness $I$ of a lamp is **inversely proportional to the square** of the distance $d$ from the lamp. If the distance is increased by 25%, by what percentage does the brightness **decrease**?',
    options: ['36%', '20%', '25%', '56.25%'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Write the relationship: $I = \\frac{k}{d^2}$.\n\n' +
        'Step 1: a 25% increase in distance means the new distance is $1.25d$.\n\n' +
        'Step 2: substitute:\n\n' +
        '$$I_{\\text{new}} = \\frac{k}{(1.25d)^2} = \\frac{k}{1.5625d^2} = \\frac{1}{1.5625} \\times \\frac{k}{d^2} = 0.64 \\, I$$\n\n' +
        'Step 3: the new brightness is 64% of the old, so it has fallen by $100\\% - 64\\% = 36\\%$.\n\n' +
        'Check with numbers: take $k = 100$, $d = 1$: $I = 100$. Then $d = 1.25$ gives $I = \\frac{100}{1.5625} = 64$, a fall of 36.\n\n' +
        'The brightness decreases by 36%.',
      whyWrong: [
        null,
        'This uses plain inverse proportion ($I = \\frac{k}{d}$): $\\frac{1}{1.25} = 0.8$, a 20% fall. The square has been forgotten.',
        'This assumes the brightness falls by the same percentage as the distance rises. Proportion does not work that way, especially with a square.',
        'This works out $1.25^2 = 1.5625$ and reads the 56.25% as the decrease. In fact the brightness is **divided** by $1.5625$, leaving 64%.',
      ],
      keyIdea: 'For proportion questions with percentage changes, replace $d$ by (multiplier $\\times\\, d$) and see what multiplier comes out for the other variable.',
    },
    check: {
      optionValues: [36, 20, 25, 56.25],
      compute: () => {
        const I = (d: number) => 100 / d ** 2;
        return (1 - I(1.25) / I(1)) * 100;
      },
    },
  },
  {
    id: 'percentages-ratio-020',
    subtopic: 'percentages-ratio',
    difficulty: 'challenge',
    stem: 'A jug contains juice and water in the ratio $3 : 2$. After 10 litres of water are added, the ratio of juice to water becomes $2 : 3$. How many litres of liquid were in the jug **before** the water was added?',
    options: ['30 litres', '12 litres', '50 litres', '20 litres'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Let the original amounts be juice $= 3k$ and water $= 2k$ litres.\n\n' +
        'Step 1: after adding 10 litres of water, the juice is still $3k$ and the water is $2k + 10$.\n\n' +
        'Step 2: the new ratio is $2 : 3$, so\n\n' +
        '$$\\frac{3k}{2k + 10} = \\frac{2}{3}$$\n\n' +
        'Step 3: cross-multiply: $9k = 2(2k + 10) = 4k + 20$, so $5k = 20$ and $k = 4$.\n\n' +
        'Step 4: original total $= 3k + 2k = 5k = 20$ litres (12 litres of juice and 8 litres of water).\n\n' +
        'Check: after adding water there are 12 litres of juice and 18 of water, and $12 : 18 = 2 : 3$. ✓\n\n' +
        'There were 20 litres before.',
      whyWrong: [
        'This is the total **after** the water was added ($12 + 18$), not before.',
        'This is the amount of **juice** only ($3k = 12$), not the total liquid.',
        'This compares the two ratios directly: water went from "2" to "3", so it says 1 part is 10 litres and the total is $5 \\times 10$. But the size of a part changes because the juice number also changes (3 to 2).',
        null,
      ],
      keyIdea: 'When a ratio changes, use a letter for one part, keep the quantity that does NOT change, and set up an equation.',
    },
    check: {
      optionValues: [30, 12, 50, 20],
      compute: () => {
        // juice 3k, water 2k; need 3 * (3k) = 2 * (2k + 10)
        for (let k = 1; k <= 100; k++) if (3 * (3 * k) === 2 * (2 * k + 10)) return 5 * k;
        return -1;
      },
    },
  },
];
