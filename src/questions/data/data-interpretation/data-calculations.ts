import type { StaticQuestion } from '../../../types';
import { gcd } from '../../../lib/frac';
import { median, round, sumOf } from '../../../lib/mathx';

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'data-calculations-001',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'The bar chart shows the number of visitors (in thousands) to a website on five days. What is the percentage increase in visitors from **Monday** to **Wednesday**?',
    chart: {
      kind: 'bar',
      title: 'Website visitors',
      xLabel: 'Day',
      yLabel: 'Visitors (thousands)',
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [{ name: 'Visitors (thousands)', values: [40, 35, 50, 45, 42] }],
    },
    options: ['$20\\%$', '$10\\%$', '$25\\%$', '$125\\%$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Read the two bars: Monday $= 40$ thousand, Wednesday $= 50$ thousand.\n\n' +
        'Step 1. Change $= \\text{new} - \\text{old} = 50 - 40 = 10$ thousand.\n\n' +
        'Step 2. Divide by the **original** (Monday) value and multiply by 100:\n\n' +
        '$$\\text{percentage change} = \\frac{10}{40} \\times 100 = 25\\%$$\n\n' +
        'The change is positive, so it is a $25\\%$ increase.',
      whyWrong: [
        'This is $\\frac{10}{50} \\times 100$: it divides by the **new** value (Wednesday) instead of the original value (Monday).',
        'This is the raw change, 10 thousand visitors, written as if it were a percentage. You must divide the change by the original value.',
        null,
        'This is $\\frac{50}{40} \\times 100$, Wednesday as a percentage **of** Monday. The increase is $125\\% - 100\\% = 25\\%$.',
      ],
      keyIdea: 'Percentage change = (new - old) divided by the OLD value, times 100.',
    },
    check: {
      optionValues: [20, 10, 25, 125],
      compute: () => {
        const v = [40, 35, 50, 45, 42];
        return ((v[2] - v[0]) / v[0]) * 100;
      },
    },
  },
  {
    id: 'data-calculations-002',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'The pie chart shows how a group of students travel to school (the numbers are counts of students). What percentage of the students **walk**? (Percentages are given to 1 decimal place where needed.)',
    chart: {
      kind: 'pie',
      title: 'How students travel to school',
      slices: [
        { label: 'Bus', value: 18 },
        { label: 'Car', value: 12 },
        { label: 'Walk', value: 24 },
        { label: 'Bicycle', value: 6 },
      ],
    },
    options: ['$24\\%$', '$66.7\\%$', '$60\\%$', '$40\\%$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1. Find the total number of students: $18 + 12 + 24 + 6 = 60$.\n\n' +
        'Step 2. The percentage share is part divided by **whole**, times 100:\n\n' +
        '$$\\frac{24}{60} \\times 100 = 40\\%$$',
      whyWrong: [
        'This treats the count 24 as a percentage, which only works if there are exactly 100 students. There are 60.',
        'This is $\\frac{24}{36}$: it compares walkers with the students who do **not** walk (a part-to-part ratio) instead of with all 60 students.',
        'This is $\\frac{36}{60} \\times 100$, the percentage who do **not** walk.',
        null,
      ],
      keyIdea: 'A percentage share is part divided by the whole total, times 100.',
    },
    check: {
      optionValues: [24, 66.7, 60, 40],
      compute: () => {
        const s = { bus: 18, car: 12, walk: 24, bike: 6 };
        return (s.walk / (s.bus + s.car + s.walk + s.bike)) * 100;
      },
    },
  },
  {
    id: 'data-calculations-003',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'The table shows the number of goals a football team scored in each of its 20 matches. What is the mean number of goals per match?',
    table: {
      headers: ['Goals scored', 'Number of matches'],
      rows: [
        [0, 4],
        [1, 6],
        [2, 5],
        [3, 3],
        [4, 2],
      ],
    },
    options: ['$6.6$', '$1.65$', '$2$', '$4$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'For a frequency table, mean $= \\frac{\\sum fx}{\\sum f}$, where $x$ is the value and $f$ is how many times it happens.\n\n' +
        '| Goals $x$ | Matches $f$ | $fx$ |\n|---|---|---|\n| 0 | 4 | 0 |\n| 1 | 6 | 6 |\n| 2 | 5 | 10 |\n| 3 | 3 | 9 |\n| 4 | 2 | 8 |\n| **Total** | **20** | **33** |\n\n' +
        'Mean $= \\frac{33}{20} = 1.65$ goals per match.',
      whyWrong: [
        'This is $\\frac{33}{5}$: it divides the total goals by the number of **rows** (5) instead of the number of matches (20).',
        null,
        'This is the mean of the values $0, 1, 2, 3, 4$ on their own; it ignores how many matches had each score.',
        'This is $\\frac{20}{5}$, the mean of the frequency column. The frequencies are counts of matches, not goals.',
      ],
      keyIdea: 'Mean from a frequency table: multiply each value by its frequency, add, then divide by the total frequency.',
    },
    check: {
      optionValues: [6.6, 1.65, 2, 4],
      compute: () => {
        const x = [0, 1, 2, 3, 4];
        const f = [4, 6, 5, 3, 2];
        return sumOf(x.map((v, i) => v * f[i])) / sumOf(f);
      },
    },
  },
  {
    id: 'data-calculations-004',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'The table shows the members of a school AI club. What is the ratio of boys to girls **in the whole club**, in its simplest form?',
    table: {
      headers: ['Year group', 'Boys', 'Girls'],
      rows: [
        ['Year 11', 5, 9],
        ['Year 12', 7, 9],
      ],
    },
    options: ['$3:2$', '$2:5$', '$2:3$', '$7:9$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Step 1. Total boys $= 5 + 7 = 12$. Total girls $= 9 + 9 = 18$.\n\n' +
        'Step 2. Boys : girls $= 12:18$.\n\n' +
        'Step 3. Simplify by dividing both parts by their highest common factor, 6: $12:18 = 2:3$.',
      whyWrong: [
        'This is girls : boys. The order of a ratio matters: "boys to girls" puts the boys first.',
        'This is $12:30$, boys : **whole club**. The question compares boys with girls, not with the total.',
        null,
        'This uses only the Year 12 row. The question asks about the whole club, so add both rows first.',
      ],
      keyIdea: 'Find the totals first, write them in the order asked, then divide by the highest common factor.',
    },
    check: {
      optionValues: ['3:2', '2:5', '2:3', '7:9'],
      compute: () => {
        const boys = 5 + 7;
        const girls = 9 + 9;
        const g = gcd(boys, girls);
        return `${boys / g}:${girls / g}`;
      },
    },
  },
  {
    id: 'data-calculations-005',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'A delivery van travelled 150 km and used 12 litres of fuel. What was its fuel economy in **kilometres per litre**?',
    options: ['$12.5$ km per litre', '$0.08$ km per litre', '$8$ km per litre', '$1800$ km per litre'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A rate "A per B" means A divided by B. Kilometres per litre means kilometres divided by litres:\n\n' +
        '$$\\frac{150 \\text{ km}}{12 \\text{ litres}} = 12.5 \\text{ km per litre}$$\n\n' +
        'Sense check: 12 litres times 12.5 km per litre $= 150$ km.',
      whyWrong: [
        null,
        'This is $\\frac{12}{150}$, which is litres per kilometre. The division has been done the wrong way round.',
        'This is $\\frac{12}{150} \\times 100$, the litres used per 100 km, a different measure of fuel use.',
        'This multiplies the distance by the fuel used. A rate "per litre" needs a division.',
      ],
      keyIdea: 'A rate "A per B" is A divided by B; check the units of your answer.',
    },
    check: { optionValues: [12.5, 0.08, 8, 1800], compute: () => 150 / 12 },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'data-calculations-006',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The line graph shows the number of subscribers to an app over six months. By what percentage did the number of subscribers fall from its **highest** month to June? (Percentages are given to 1 decimal place where needed.)',
    chart: {
      kind: 'line',
      title: 'App subscribers',
      xLabel: 'Month',
      yLabel: 'Subscribers',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      series: [{ name: 'Subscribers', values: [2400, 2200, 2500, 2100, 1900, 1800] }],
    },
    options: ['$38.9\\%$', '$28\\%$', '$72\\%$', '$25\\%$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Step 1. The highest point is March with 2500 subscribers. June has 1800.\n\n' +
        'Step 2. Decrease $= 2500 - 1800 = 700$.\n\n' +
        'Step 3. Divide by the **starting** value (March):\n\n' +
        '$$\\frac{700}{2500} \\times 100 = 28\\%$$\n\n' +
        'So the number of subscribers fell by $28\\%$.',
      whyWrong: [
        'This is $\\frac{700}{1800} \\times 100$: it divides by the June value (the end) instead of the March value (the start).',
        null,
        'This is $\\frac{1800}{2500} \\times 100$, June as a percentage of March, which is what is **left**. The fall is $100\\% - 72\\% = 28\\%$.',
        'This is $\\frac{600}{2400} \\times 100$: it starts from January (the first month) instead of the highest month, March.',
      ],
      keyIdea: 'For a percentage decrease, divide the fall by the value you started from.',
    },
    check: {
      optionValues: [38.9, 28, 72, 25],
      compute: () => {
        const v = [2400, 2200, 2500, 2100, 1900, 1800];
        const peak = Math.max(...v);
        return ((peak - v[5]) / peak) * 100;
      },
    },
  },
  {
    id: 'data-calculations-007',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'After a $20\\%$ price increase, the monthly cost of a cloud server plan is AED 72. What was the monthly cost **before** the increase?',
    options: ['AED 57.60', 'AED 52', 'AED 60', 'AED 86.40'],
    correctIndex: 2,
    markScheme: {
      solution:
        'An increase of $20\\%$ means the new price is $100\\% + 20\\% = 120\\%$ of the original, so\n\n' +
        '$$1.2 \\times \\text{original} = 72$$\n\n' +
        'Divide both sides by the multiplier:\n\n' +
        '$$\\text{original} = \\frac{72}{1.2} = 60$$\n\n' +
        'Check: $60 \\times 1.2 = 72$. The original cost was AED 60.',
      whyWrong: [
        'This is $72 \\times 0.8$: it takes $20\\%$ off the **new** price. But the $20\\%$ was calculated on the original price, so you must divide by 1.2.',
        'This subtracts 20 as if $20\\%$ meant AED 20.',
        null,
        'This is $72 \\times 1.2$: it increases the price a second time instead of undoing the increase.',
      ],
      keyIdea: 'To undo a percentage change, divide by the multiplier (here 1.2); do not subtract the same percentage from the new value.',
    },
    check: { optionValues: [57.6, 52, 60, 86.4], compute: () => 72 / (1 + 20 / 100) },
  },
  {
    id: 'data-calculations-008',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The number of daily active users of an app **increased by** $50\\%$ during 2024 and then **decreased by** $30\\%$ during 2025. What is the overall percentage change over the two years?',
    options: ['$20\\%$ increase', '$10\\%$ increase', '$5\\%$ decrease', '$5\\%$ increase'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use multipliers: an increase of $50\\%$ is $\\times 1.5$; a decrease of $30\\%$ is $\\times 0.7$.\n\n' +
        '$$1.5 \\times 0.7 = 1.05$$\n\n' +
        'A multiplier of 1.05 means $5\\%$ more than at the start.\n\n' +
        'Check with 1000 users: $1000 \\to 1500$ (up $50\\%$) $\\to 1500 \\times 0.7 = 1050$ (down $30\\%$). From 1000 to 1050 is an increase of 50, which is $5\\%$ of 1000.',
      whyWrong: [
        'This adds $+50\\%$ and $-30\\%$. Percentages applied one after another do not add, because the $30\\%$ is taken from the larger number (1500), not the original.',
        'This averages the two changes, $\\frac{50 - 30}{2}$. Successive changes must be combined by multiplying the multipliers.',
        'This has the right size but the wrong direction: the overall multiplier 1.05 is bigger than 1, so the number went **up**.',
        null,
      ],
      keyIdea: 'Combine successive percentage changes by multiplying their multipliers, never by adding the percentages.',
    },
    check: {
      optionValues: [20, 10, -5, 5],
      compute: () => {
        const start = 1000;
        const end = start * 1.5 * 0.7;
        return ((end - start) / start) * 100;
      },
    },
  },
  {
    id: 'data-calculations-009',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'A course grade is a weighted average of three components, shown in the table. What is the student\'s final grade? (Options are given to 1 decimal place where needed.)',
    table: {
      headers: ['Component', 'Weight', 'Score (out of 100)'],
      rows: [
        ['Quizzes', '20%', 90],
        ['Project', '30%', 70],
        ['Final exam', '50%', 60],
      ],
    },
    options: ['$73.3$', '$69$', '$78$', '$23$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Weighted average $= \\sum (\\text{weight} \\times \\text{score})$ when the weights add up to $100\\%$.\n\n' +
        '- Quizzes: $0.2 \\times 90 = 18$\n' +
        '- Project: $0.3 \\times 70 = 21$\n' +
        '- Final exam: $0.5 \\times 60 = 30$\n\n' +
        'Add them: $18 + 21 + 30 = 69$.\n\n' +
        'The weights $0.2 + 0.3 + 0.5 = 1$, so there is nothing more to divide by. The final grade is 69.',
      whyWrong: [
        'This is the simple mean $\\frac{90 + 70 + 60}{3} \\approx 73.3$, which treats all three components as equally important and ignores the weights.',
        null,
        'This swaps the weights of the quizzes and the final exam: $0.5 \\times 90 + 0.3 \\times 70 + 0.2 \\times 60 = 78$.',
        'This divides the weighted total 69 by 3. When the weights already add up to 1, the weighted sum **is** the average.',
      ],
      keyIdea: 'A weighted average multiplies each score by its weight and divides by the total weight (here 1).',
    },
    check: {
      optionValues: [73.3, 69, 78, 23],
      compute: () => {
        const w = [0.2, 0.3, 0.5];
        const s = [90, 70, 60];
        return sumOf(w.map((wi, i) => wi * s[i])) / sumOf(w);
      },
    },
  },
  {
    id: 'data-calculations-010',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'Two schools sat the same test. The table shows the number of students and the pass rate at each school. What percentage of **all** the students passed?',
    table: {
      headers: ['School', 'Students', 'Pass rate'],
      rows: [
        ['School P', 80, '90%'],
        ['School Q', 120, '70%'],
      ],
    },
    options: ['$80\\%$', '$82\\%$', '$160\\%$', '$78\\%$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Turn each pass rate back into a number of students.\n\n' +
        '- School P: $0.9 \\times 80 = 72$ passed\n' +
        '- School Q: $0.7 \\times 120 = 84$ passed\n\n' +
        'Total passed $= 72 + 84 = 156$ out of $80 + 120 = 200$ students.\n\n' +
        '$$\\frac{156}{200} \\times 100 = 78\\%$$',
      whyWrong: [
        'This is $\\frac{90 + 70}{2}$, the simple average of the two pass rates. School Q is bigger, so its lower rate counts for more.',
        'This weights the rates with the school sizes swapped: $\\frac{120 \\times 0.9 + 80 \\times 0.7}{200} = 82\\%$.',
        'This adds the two percentages. A percentage of one whole group can never be more than $100\\%$.',
        null,
      ],
      keyIdea: 'To combine percentages from groups of different sizes, convert back to counts (a weighted average), never average the percentages.',
    },
    check: {
      optionValues: [80, 82, 160, 78],
      compute: () => {
        const n = [80, 120];
        const rate = [0.9, 0.7];
        return (sumOf(n.map((k, i) => k * rate[i])) / sumOf(n)) * 100;
      },
    },
  },
  {
    id: 'data-calculations-011',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The table shows the time 40 students spent on a homework task. Estimate the mean time.',
    table: {
      headers: ['Time $t$ (minutes)', 'Number of students'],
      rows: [
        ['$0 \\le t < 10$', 5],
        ['$10 \\le t < 20$', 12],
        ['$20 \\le t < 30$', 15],
        ['$30 \\le t < 40$', 8],
      ],
    },
    options: ['$21.5$ minutes', '$16.5$ minutes', '$215$ minutes', '$26.5$ minutes'],
    correctIndex: 0,
    markScheme: {
      solution:
        'We do not know the exact times, so we assume every student in a class took the **midpoint** time of that class.\n\n' +
        '| Class | Midpoint $x$ | $f$ | $fx$ |\n|---|---|---|---|\n| $0 \\le t < 10$ | 5 | 5 | 25 |\n| $10 \\le t < 20$ | 15 | 12 | 180 |\n| $20 \\le t < 30$ | 25 | 15 | 375 |\n| $30 \\le t < 40$ | 35 | 8 | 280 |\n| **Total** | | **40** | **860** |\n\n' +
        'Estimated mean $= \\frac{860}{40} = 21.5$ minutes.',
      whyWrong: [
        null,
        'This uses the **lower** end of each class (0, 10, 20, 30) instead of the midpoint, which makes every time too small by 5 minutes.',
        'This divides 860 by the 4 classes instead of by the 40 students.',
        'This uses the **upper** end of each class (10, 20, 30, 40) instead of the midpoint, which makes every time too big by 5 minutes.',
      ],
      keyIdea: 'For grouped data, use the class midpoints as the $x$-values, then estimated mean $= \\frac{\\sum fx}{\\sum f}$.',
    },
    check: {
      optionValues: [21.5, 16.5, 215, 26.5],
      compute: () => {
        const edges = [0, 10, 20, 30, 40];
        const f = [5, 12, 15, 8];
        const mids = f.map((_, i) => (edges[i] + edges[i + 1]) / 2);
        return sumOf(mids.map((x, i) => x * f[i])) / sumOf(f);
      },
    },
  },
  {
    id: 'data-calculations-012',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The bar chart shows the number of siblings of each of 20 students. What is the **median** number of siblings?',
    chart: {
      kind: 'bar',
      title: 'Number of siblings',
      xLabel: 'Number of siblings',
      yLabel: 'Number of students',
      categories: ['0', '1', '2', '3', '4'],
      series: [{ name: 'Students', values: [3, 8, 6, 2, 1] }],
    },
    options: ['$2$', '$3$', '$1$', '$1.5$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'There are $3 + 8 + 6 + 2 + 1 = 20$ students. With 20 values in order, the median is halfway between the 10th and 11th values.\n\n' +
        'Count along the bars (cumulative frequency):\n\n' +
        '- 0 siblings: students 1 to 3\n' +
        '- 1 sibling: students 4 to 11 (because $3 + 8 = 11$)\n\n' +
        'So the 10th and 11th students both have 1 sibling, and the median is $\\frac{1 + 1}{2} = 1$.',
      whyWrong: [
        'This is the middle of the category labels $0, 1, 2, 3, 4$. The median is the middle **student**, so you must use the bar heights.',
        'This is the median of the bar heights $1, 2, 3, 6, 8$. The bar heights are counts of students, not numbers of siblings.',
        null,
        'This is the **mean**: $\\frac{0 + 8 + 12 + 6 + 4}{20} = \\frac{30}{20} = 1.5$. The question asks for the median.',
      ],
      keyIdea: 'For the median from a bar chart or frequency table, find the position $\\frac{n + 1}{2}$ and count along the cumulative frequencies.',
    },
    check: {
      optionValues: [2, 3, 1, 1.5],
      compute: () => {
        const f = [3, 8, 6, 2, 1];
        const data = f.flatMap((k, x) => Array<number>(k).fill(x));
        return median(data);
      },
    },
  },
  {
    id: 'data-calculations-013',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'In a survey, the share of students who use an AI chatbot for homework rose from $30\\%$ in 2024 to $36\\%$ in 2025. What is the **percentage increase** in this share (the relative change, not the change in percentage points)? (Percentages are given to 1 decimal place where needed.)',
    table: {
      headers: ['Year', 'Share using an AI chatbot'],
      rows: [
        ['2024', '30%'],
        ['2025', '36%'],
      ],
    },
    options: ['$6\\%$', '$20\\%$', '$16.7\\%$', '$120\\%$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The share went up by $36 - 30 = 6$ **percentage points**. The question asks for the relative (percentage) increase, so divide by the original share:\n\n' +
        '$$\\frac{36 - 30}{30} \\times 100 = \\frac{6}{30} \\times 100 = 20\\%$$\n\n' +
        'So the share rose by 6 percentage points, which is a $20\\%$ increase.',
      whyWrong: [
        'This is the change in **percentage points**, $36 - 30$. A percentage increase divides that change by the starting value 30.',
        null,
        'This is $\\frac{6}{36} \\times 100$: it divides by the new share (36) instead of the original share (30).',
        'This is $\\frac{36}{30} \\times 100$, the new share as a percentage of the old one. The increase is $120\\% - 100\\% = 20\\%$.',
      ],
      keyIdea: 'A difference between two percentages is in percentage points; the percentage change divides that difference by the original percentage.',
    },
    check: { optionValues: [6, 20, 16.7, 120], compute: () => ((36 - 30) / 30) * 100 },
  },
  {
    id: 'data-calculations-014',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The table shows the population of four towns and the number of flu cases recorded in each last winter. Which town had the **highest rate** of flu cases per 1000 people?',
    table: {
      headers: ['Town', 'Population', 'Flu cases'],
      rows: [
        ['Northfield', 80000, 200],
        ['Southport', 50000, 210],
        ['Eastbrook', 12000, 54],
        ['Westvale', 20000, 100],
      ],
    },
    options: ['Northfield', 'Southport', 'Eastbrook', 'Westvale'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Rate per 1000 people $= \\frac{\\text{cases}}{\\text{population}} \\times 1000$.\n\n' +
        '| Town | Calculation | Cases per 1000 |\n|---|---|---|\n| Northfield | $\\frac{200}{80000} \\times 1000$ | 2.5 |\n| Southport | $\\frac{210}{50000} \\times 1000$ | 4.2 |\n| Eastbrook | $\\frac{54}{12000} \\times 1000$ | 4.5 |\n| Westvale | $\\frac{100}{20000} \\times 1000$ | 5 |\n\n' +
        'Westvale has the highest rate (5 cases per 1000 people), even though Southport recorded more cases in total.',
      whyWrong: [
        'Northfield has the **lowest** rate (2.5 per 1000). You get this town if you work out people per case ($80000 \\div 200 = 400$) and pick the biggest value; more people per case means a lower rate.',
        'Southport has the most cases (210), but it also has a large population, so its rate is only 4.2 per 1000. A rate must divide by the population.',
        'Eastbrook is the smallest town and has a high rate (4.5 per 1000), but not the highest: Westvale has 5 per 1000. Compute every rate before choosing.',
        null,
      ],
      keyIdea: 'To compare groups of different sizes, compare rates (count divided by size), not raw counts.',
    },
    check: {
      optionValues: ['Northfield', 'Southport', 'Eastbrook', 'Westvale'],
      compute: () => {
        const towns: [string, number, number][] = [
          ['Northfield', 80000, 200],
          ['Southport', 50000, 210],
          ['Eastbrook', 12000, 54],
          ['Westvale', 20000, 100],
        ];
        let best = towns[0];
        for (const t of towns) if (t[2] / t[1] > best[2] / best[1]) best = t;
        return best[0];
      },
    },
  },
  {
    id: 'data-calculations-015',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The line graph shows the number of users of an online service. The number of users grows by the **same percentage** every year. If this continues, how many users will there be in 2025?',
    chart: {
      kind: 'line',
      title: 'Users of an online service',
      xLabel: 'Year',
      yLabel: 'Users',
      categories: ['2022', '2023', '2024'],
      series: [{ name: 'Users', values: [1600, 2000, 2500] }],
    },
    options: ['$3125$', '$3000$', '$3100$', '$2900$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Step 1. Find the yearly growth factor: $\\frac{2000}{1600} = 1.25$ and $\\frac{2500}{2000} = 1.25$. So users grow by $25\\%$ each year.\n\n' +
        'Step 2. Apply it once more to the latest value:\n\n' +
        '$$2500 \\times 1.25 = 3125$$',
      whyWrong: [
        null,
        'This adds the last increase again ($2500 + 500$), which is **linear** growth. The same percentage each year means the increase itself grows.',
        'This assumes the yearly increase goes up by 100 each time ($400, 500, 600$). The rule is a constant percentage, so multiply by 1.25.',
        'This adds $25\\%$ of the **first** value ($0.25 \\times 1600 = 400$). Each year the $25\\%$ is taken of the latest value, 2500.',
      ],
      keyIdea: 'Constant percentage growth means multiply by the same factor each step (find it by dividing consecutive values).',
    },
    check: {
      optionValues: [3125, 3000, 3100, 2900],
      compute: () => {
        const v = [1600, 2000, 2500];
        return v[2] * (v[2] / v[1]);
      },
    },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'data-calculations-016',
    subtopic: 'data-calculations',
    difficulty: 'challenge',
    stem: 'The table shows the scores of 40 students on a quiz, but two frequencies, $a$ and $b$, are missing. The mean score is $3.05$. What is the value of $a$?',
    table: {
      headers: ['Score', '1', '2', '3', '4', '5'],
      rows: [['Frequency', 6, '$a$', 10, '$b$', 4]],
    },
    options: ['$7$', '$13$', '$10$', '$14$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'There are two unknowns, so build two equations.\n\n' +
        '**Equation 1 (total frequency).** $6 + a + 10 + b + 4 = 40$, so $a + b = 20$.\n\n' +
        '**Equation 2 (the mean).** Total of all scores $= \\text{mean} \\times \\text{number of students} = 3.05 \\times 40 = 122$.\n\n' +
        'Also, total of all scores $= 1 \\times 6 + 2a + 3 \\times 10 + 4b + 5 \\times 4 = 56 + 2a + 4b$.\n\n' +
        'So $56 + 2a + 4b = 122$, giving $2a + 4b = 66$, that is $a + 2b = 33$.\n\n' +
        '**Solve.** Subtract equation 1 from this: $(a + 2b) - (a + b) = 33 - 20$, so $b = 13$. Then $a = 20 - 13 = 7$.\n\n' +
        'Check: $6 + 14 + 30 + 52 + 20 = 122$ and $\\frac{122}{40} = 3.05$.',
      whyWrong: [
        null,
        'This is the value of $b$, not $a$. After finding $b = 13$ you still need $a = 20 - b$.',
        'This splits the missing 20 students equally between $a$ and $b$, which ignores the information given by the mean.',
        'This is $2a$, the $fx$ entry for a score of 2, not the frequency itself. Divide by the score 2 to get $a$.',
      ],
      keyIdea: 'Missing frequencies: one equation from the total frequency, one from $\\text{mean} \\times \\sum f = \\sum fx$; then solve simultaneously.',
    },
    check: {
      optionValues: [7, 13, 10, 14],
      compute: () => {
        // brute force every split of the missing 20 students
        for (let a = 0; a <= 20; a++) {
          const b = 20 - a;
          const f = [6, a, 10, b, 4];
          const sumFx = sumOf(f.map((k, i) => k * (i + 1)));
          if (Math.abs(sumFx - 3.05 * 40) < 1e-9) return a;
        }
        return -1;
      },
    },
  },
  {
    id: 'data-calculations-017',
    subtopic: 'data-calculations',
    difficulty: 'challenge',
    stem: 'A year group of 50 students has a mean test score of 66. The 20 students in Class A have a mean score of 72. The other 30 students are in Class B. What is the mean score of Class B?',
    options: ['$60$', '$93$', '$62$', '$37.2$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work with **totals**, because totals can be added and subtracted but means cannot.\n\n' +
        '- Total for all 50 students: $50 \\times 66 = 3300$\n' +
        '- Total for Class A: $20 \\times 72 = 1440$\n' +
        '- Total for Class B: $3300 - 1440 = 1860$\n\n' +
        'Mean for Class B $= \\frac{1860}{30} = 62$.\n\n' +
        'Check: $\\frac{20 \\times 72 + 30 \\times 62}{50} = \\frac{1440 + 1860}{50} = 66$.',
      whyWrong: [
        'This assumes the classes are the same size, so that 66 is exactly halfway between 72 and the answer. Class B is bigger, so its mean is closer to 66.',
        'This divides Class B\'s total, 1860, by 20 (the size of Class A) instead of by 30.',
        null,
        'This divides Class B\'s total, 1860, by all 50 students instead of by the 30 students in Class B.',
      ],
      keyIdea: 'Combined mean problems: convert every mean to a total ($\\text{mean} \\times \\text{count}$), add or subtract totals, then divide by the right count.',
    },
    check: {
      optionValues: [60, 93, 62, 37.2],
      compute: () => {
        const total = 50 * 66;
        const totalA = 20 * 72;
        return (total - totalA) / (50 - 20);
      },
    },
  },
  {
    id: 'data-calculations-018',
    subtopic: 'data-calculations',
    difficulty: 'challenge',
    stem: 'A dataset of 2400 images is split into training, validation and test sets in the ratio $7:2:1$. Later, $25\\%$ of the **training** images are removed because they are duplicates. What percentage of the remaining images are training images, to 1 decimal place?',
    options: ['$52.5\\%$', '$45\\%$', '$70\\%$', '$63.6\\%$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1. Share out 2400 in the ratio** $7:2:1$. There are $7 + 2 + 1 = 10$ parts, so one part $= \\frac{2400}{10} = 240$ images.\n\n' +
        '- Training: $7 \\times 240 = 1680$\n' +
        '- Validation: $2 \\times 240 = 480$\n' +
        '- Test: $1 \\times 240 = 240$\n\n' +
        '**Step 2. Remove** $25\\%$ **of the training images.** $0.25 \\times 1680 = 420$, leaving $1680 - 420 = 1260$ training images.\n\n' +
        '**Step 3. New total.** $1260 + 480 + 240 = 1980$ images (or $2400 - 420 = 1980$).\n\n' +
        '**Step 4. New share.** $\\frac{1260}{1980} \\times 100 = 63.636\\ldots\\% \\approx 63.6\\%$.',
      whyWrong: [
        'This is $0.75 \\times 70\\%$: it reduces the training count but forgets that the total number of images also went down.',
        'This subtracts $25$ from $70\\%$. Removing $25\\%$ of the training images is a relative change, not a drop of 25 percentage points.',
        'This is the original training share, $\\frac{7}{10}$, which ignores the removed images.',
        null,
      ],
      keyIdea: 'When a part changes, the whole changes too: recompute both the part and the new total before finding the share.',
    },
    check: {
      optionValues: [52.5, 45, 70, 63.6],
      compute: () => {
        const total = 2400;
        const parts = [7, 2, 1];
        const unit = total / sumOf(parts);
        const [train, val, test] = parts.map((p) => p * unit);
        const newTrain = train * (1 - 0.25);
        return round((newTrain / (newTrain + val + test)) * 100, 1);
      },
    },
  },
  {
    id: 'data-calculations-019',
    subtopic: 'data-calculations',
    difficulty: 'challenge',
    stem: 'A final grade is worked out as $40\\%$ coursework and $60\\%$ exam. A student scored 65 (out of 100) in the coursework. What exam score (out of 100) does the student need to get a final grade of exactly 80?',
    options: ['$90$', '$95$', '$54$', '$102.5$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Let the exam score be $x$. The weighted average must equal 80:\n\n' +
        '$$0.4 \\times 65 + 0.6x = 80$$\n\n' +
        '$$26 + 0.6x = 80$$\n\n' +
        '$$0.6x = 54$$\n\n' +
        '$$x = \\frac{54}{0.6} = 90$$\n\n' +
        'Check: $0.4 \\times 65 + 0.6 \\times 90 = 26 + 54 = 80$.',
      whyWrong: [
        null,
        'This treats the two parts as equally weighted: $\\frac{65 + x}{2} = 80$ gives $x = 95$. The exam is worth more ($60\\%$), so less is needed.',
        'This stops at $0.6x = 54$ and forgets to divide by 0.6. 54 is the exam\'s **contribution** to the grade, not the exam score.',
        'This swaps the weights: $0.6 \\times 65 + 0.4x = 80$ gives $x = 102.5$, which is impossible for a score out of 100.',
      ],
      keyIdea: 'Write the weighted average as an equation with the unknown score, then solve it step by step.',
    },
    check: {
      optionValues: [90, 95, 54, 102.5],
      compute: () => {
        const wC = 0.4;
        const wE = 0.6;
        return (80 - wC * 65) / wE;
      },
    },
  },
  {
    id: 'data-calculations-020',
    subtopic: 'data-calculations',
    difficulty: 'challenge',
    stem: 'The grouped bar chart shows quarterly sales (in thousands of units) of two products. Considering each product separately, which product had the **greatest percentage increase** from one quarter to the next?',
    chart: {
      kind: 'bar',
      title: 'Quarterly sales',
      xLabel: 'Quarter',
      yLabel: 'Sales (thousands)',
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      series: [
        { name: 'Product X', values: [40, 50, 60, 66] },
        { name: 'Product Y', values: [20, 30, 33, 45] },
      ],
    },
    options: ['Product Y, from Q3 to Q4', 'Product X, from Q1 to Q2', 'Product Y, from Q1 to Q2', 'Product X, from Q3 to Q4'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work out every quarter-to-quarter percentage change: (change divided by the earlier quarter) times 100.\n\n' +
        '| Change | Product X | Product Y |\n|---|---|---|\n| Q1 to Q2 | $\\frac{10}{40} = 25\\%$ | $\\frac{10}{20} = 50\\%$ |\n| Q2 to Q3 | $\\frac{10}{50} = 20\\%$ | $\\frac{3}{30} = 10\\%$ |\n| Q3 to Q4 | $\\frac{6}{60} = 10\\%$ | $\\frac{12}{33} \\approx 36.4\\%$ |\n\n' +
        'The greatest percentage increase is $50\\%$, for Product Y from Q1 to Q2.',
      whyWrong: [
        'Product Y from Q3 to Q4 has the biggest **absolute** increase (12 thousand), but $\\frac{12}{33} \\approx 36.4\\%$, which is smaller than $50\\%$.',
        'Product X from Q1 to Q2 rose by 10 thousand, the same amount as Product Y, but from a bigger starting value, so it is only $\\frac{10}{40} = 25\\%$.',
        null,
        'Product X in Q4 is the tallest bar (the highest sales), but high sales are not the same as fast growth: $\\frac{6}{60} = 10\\%$.',
      ],
      keyIdea: 'The same absolute increase is a bigger percentage when the starting value is smaller; always divide by the earlier value.',
    },
    check: {
      optionValues: ['Product Y, from Q3 to Q4', 'Product X, from Q1 to Q2', 'Product Y, from Q1 to Q2', 'Product X, from Q3 to Q4'],
      compute: () => {
        const series: [string, number[]][] = [
          ['X', [40, 50, 60, 66]],
          ['Y', [20, 30, 33, 45]],
        ];
        let best = { pct: -Infinity, label: '' };
        for (const [name, v] of series)
          for (let q = 1; q < v.length; q++) {
            const pct = ((v[q] - v[q - 1]) / v[q - 1]) * 100;
            if (pct > best.pct) best = { pct, label: `Product ${name}, from Q${q} to Q${q + 1}` };
          }
        return best.label;
      },
    },
  },
];
