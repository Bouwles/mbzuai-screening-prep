import type { StaticQuestion } from '../../../types';
import { mean, median, modes, quartiles, sumOf } from '../../../lib/mathx';

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'descriptive-stats-001',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'Find the **mean** of these six numbers:\n\n3, 8, 4, 15, 5, 7',
    options: ['$6$', '$8.4$', '$7$', '$9$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The mean is the total divided by how many values there are.\n\n' +
        '1. Add them up: $3 + 8 + 4 + 15 + 5 + 7 = 42$.\n' +
        '2. Count them: there are $6$ values.\n' +
        '3. Divide: $\\bar{x} = \\frac{42}{6} = 7$.\n\n' +
        'The mean is $7$.',
      whyWrong: [
        'This is the **median**: in order the data are 3, 4, 5, 7, 8, 15 and the middle two values give $\\frac{5 + 7}{2} = 6$. The question asks for the mean.',
        'This divides the total by $5$ instead of $6$: $\\frac{42}{5} = 8.4$. Count the values carefully; there are six.',
        null,
        'This is halfway between the smallest and largest values, $\\frac{3 + 15}{2} = 9$ (the "mid-range"), not the mean. The mean uses every value.',
      ],
      keyIdea: 'Mean = sum of all the values divided by the number of values.',
    },
    check: {
      optionValues: [6, 8.4, 7, 9],
      compute: () => mean([3, 8, 4, 15, 5, 7]),
    },
  },
  {
    id: 'descriptive-stats-002',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'Find the **median** of these numbers:\n\n12, 5, 9, 20, 7, 15',
    options: ['$14.5$', '$10.5$', '$3.5$', '$9$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Put the data in order first: 5, 7, 9, 12, 15, 20.\n' +
        '2. There are $n = 6$ values, so the median is in position $\\frac{n + 1}{2} = 3.5$, i.e. halfway between the 3rd and 4th values.\n' +
        '3. The 3rd value is $9$ and the 4th is $12$, so the median is $\\frac{9 + 12}{2} = 10.5$.',
      whyWrong: [
        'This takes the middle two values of the list **as written** ($9$ and $20$), without sorting it first: $\\frac{9 + 20}{2} = 14.5$.',
        null,
        'This is the **position** of the median, $\\frac{6 + 1}{2} = 3.5$, not its value. Use the position to find the value in the ordered list.',
        'This takes only the 3rd value of the ordered list. With an even number of values there are two middle values, so you must average $9$ and $12$.',
      ],
      keyIdea: 'Sort the data first; with an even number of values the median is the mean of the two middle values.',
    },
    check: {
      optionValues: [14.5, 10.5, 3.5, 9],
      compute: () => median([12, 5, 9, 20, 7, 15]),
    },
  },
  {
    id: 'descriptive-stats-003',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'For the data below, find the **mode** and the **range**.\n\n4, 7, 7, 2, 9, 7, 3, 9, 12',
    options: ['Mode $= 3$, range $= 10$', 'Mode $= 7$, range $= 8$', 'Mode $= 7$, range $= 12$', 'Mode $= 7$, range $= 10$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Mode** (most common value): $7$ appears three times, $9$ twice and every other value once, so the mode is $7$.\n\n' +
        '**Range** = largest value $-$ smallest value. In order the data are 2, 3, 4, 7, 7, 7, 9, 9, 12, so the range is $12 - 2 = 10$.\n\n' +
        'Mode $= 7$, range $= 10$.',
      whyWrong: [
        'The value $3$ is **how many times** the mode appears (its frequency). The mode is the value itself, $7$.',
        'This range is the last value minus the first value of the unsorted list, $12 - 4 = 8$. The range uses the largest and smallest values, $12 - 2$.',
        'This gives only the largest value, $12$. The range is largest **minus** smallest: $12 - 2 = 10$.',
        null,
      ],
      keyIdea: 'The mode is the most frequent value; the range is the largest value minus the smallest value.',
    },
    check: {
      optionValues: ['3,10', '7,8', '7,12', '7,10'],
      compute: () => {
        const d = [4, 7, 7, 2, 9, 7, 3, 9, 12];
        return `${modes(d)[0]},${Math.max(...d) - Math.min(...d)}`;
      },
    },
  },
  {
    id: 'descriptive-stats-004',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'The table shows the monthly salaries of 7 people in a small company. Which of these gives the best idea of a **typical** salary?',
    table: {
      caption: 'Monthly salaries',
      headers: ['Employee', 'Salary (AED)'],
      rows: [
        ['P', '6,000'],
        ['Q', '6,500'],
        ['R', '7,000'],
        ['S', '7,500'],
        ['T', '8,000'],
        ['U', '8,500'],
        ['V (owner)', '60,000'],
      ],
    },
    options: ['The mean', 'The median', 'The mode', 'The range'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The owner\'s salary (AED 60,000) is an **extreme value** (an outlier).\n\n' +
        '- Mean: total $= 103{,}500$, so the mean is $\\frac{103500}{7} \\approx 14{,}786$ AED. Six of the seven people earn far less than this, so it is not typical.\n' +
        '- Median: the 4th of the 7 ordered salaries is AED 7,500, which sits right in the middle of what most people earn.\n\n' +
        'When there are extreme values, the **median** is the best average because it depends only on the middle of the data.',
      whyWrong: [
        'Using every value is exactly the problem here: the one huge salary drags the mean up to about AED 14,786, more than six of the seven people earn.',
        null,
        'No salary appears more than once, so there is no mode at all.',
        'The range is a measure of **spread**, not an average, so it cannot describe a typical salary.',
      ],
      keyIdea: 'With outliers or skewed data use the median; the mean is pulled towards extreme values.',
    },
  },
  {
    id: 'descriptive-stats-005',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'The box plot shows how long (in minutes) a group of students took to finish a puzzle. What is the **interquartile range** (IQR)?',
    chart: {
      kind: 'boxplot',
      title: 'Puzzle times',
      xLabel: 'Time (minutes)',
      boxes: [{ label: 'Students', min: 12, q1: 20, median: 26, q3: 35, max: 48 }],
    },
    options: ['$36$', '$9$', '$15$', '$26$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Read the five numbers off the box plot: minimum $12$, lower quartile $Q_1 = 20$, median $26$, upper quartile $Q_3 = 35$, maximum $48$.\n\n' +
        'The IQR is the width of the **box**: $\\text{IQR} = Q_3 - Q_1 = 35 - 20 = 15$ minutes.',
      whyWrong: [
        'This is the **range**, maximum minus minimum ($48 - 12 = 36$), which uses the whiskers, not the box.',
        'This is only the right-hand part of the box, $Q_3 - \\text{median} = 35 - 26 = 9$. The IQR is the whole box.',
        null,
        'This is the **median** (the line inside the box), not a measure of spread.',
      ],
      keyIdea: 'On a box plot the box runs from $Q_1$ to $Q_3$, so the IQR is the length of the box.',
    },
    check: {
      optionValues: [36, 9, 15, 26],
      compute: () => {
        const box = { min: 12, q1: 20, median: 26, q3: 35, max: 48 };
        return box.q3 - box.q1;
      },
    },
  },
  // ---------------------------------------------------------------- exam
  {
    id: 'descriptive-stats-006',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'The mean of five numbers is $12$. Four of the numbers are $8$, $15$, $10$ and $14$. What is the fifth number?',
    options: ['$13$', '$1$', '$12$', '$11.75$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1:** Mean $= \\frac{\\text{total}}{n}$, so total $=$ mean $\\times n = 12 \\times 5 = 60$.\n\n' +
        '**Step 2:** The four known numbers add up to $8 + 15 + 10 + 14 = 47$.\n\n' +
        '**Step 3:** The fifth number is $60 - 47 = 13$.\n\n' +
        'Check: $\\frac{8 + 15 + 10 + 14 + 13}{5} = \\frac{60}{5} = 12$.',
      whyWrong: [
        null,
        'This uses $12 \\times 4 = 48$ as the total, multiplying by the number of **known** values instead of all five: $48 - 47 = 1$.',
        'This assumes the missing number must equal the mean. It only would if the other four also averaged $12$, but they average $11.75$.',
        'This is the mean of the four known numbers, $\\frac{47}{4} = 11.75$, not the missing value.',
      ],
      keyIdea: 'Turn a mean back into a total (total $=$ mean $\\times$ number of values), then subtract the values you know.',
    },
    check: {
      optionValues: [13, 1, 12, 11.75],
      compute: () => 12 * 5 - sumOf([8, 15, 10, 14]),
    },
  },
  {
    id: 'descriptive-stats-007',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'The table shows the number of goals a team scored in each of its 20 matches. Find the **mean** number of goals per match.',
    table: {
      headers: ['Goals scored, $x$', 'Number of matches, $f$'],
      rows: [
        [0, 4],
        [1, 6],
        [2, 5],
        [3, 3],
        [4, 2],
      ],
    },
    options: ['$2$', '$4$', '$6.6$', '$1.65$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Multiply each value by its frequency to get the total number of goals.\n\n' +
        '| $x$ | $f$ | $fx$ |\n|---|---|---|\n| 0 | 4 | 0 |\n| 1 | 6 | 6 |\n| 2 | 5 | 10 |\n| 3 | 3 | 9 |\n| 4 | 2 | 8 |\n| **Total** | **20** | **33** |\n\n' +
        '$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{33}{20} = 1.65$$',
      whyWrong: [
        'This is the mean of the goal values $0, 1, 2, 3, 4$ ignoring how often each happened: $\\frac{10}{5} = 2$.',
        'This is the mean of the frequency column, $\\frac{20}{5} = 4$: it averages the counts, not the goals.',
        'This divides the total goals by the number of **rows** in the table, $\\frac{33}{5} = 6.6$, instead of by the number of matches, $20$.',
        null,
      ],
      keyIdea: 'Mean from a frequency table: $\\bar{x} = \\frac{\\sum fx}{\\sum f}$, so divide by the total frequency, not the number of rows.',
    },
    check: {
      optionValues: [2, 4, 6.6, 1.65],
      compute: () => {
        const x = [0, 1, 2, 3, 4];
        const f = [4, 6, 5, 3, 2];
        return sumOf(x.map((v, i) => v * f[i])) / sumOf(f);
      },
    },
  },
  {
    id: 'descriptive-stats-008',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: '25 students were asked how many siblings they have. Find the **median** number of siblings.',
    table: {
      headers: ['Number of siblings', 'Frequency'],
      rows: [
        [0, 8],
        [1, 7],
        [2, 4],
        [3, 3],
        [4, 3],
      ],
    },
    options: ['$2$', '$1$', '$13$', '$4$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1:** There are $n = 25$ students, so the median is the $\\frac{25 + 1}{2} = 13$th value in order.\n\n' +
        '**Step 2:** Running (cumulative) totals: the value $0$ covers positions 1 to 8; the value $1$ covers positions 9 to $8 + 7 = 15$.\n\n' +
        '**Step 3:** Position 13 lies between 9 and 15, so the 13th student has $1$ sibling.\n\n' +
        'Median $= 1$.',
      whyWrong: [
        'This is the middle **row** of the table, ignoring the frequencies. Many more students have 0 or 1 sibling than 3 or 4.',
        null,
        'This is the **position** of the median ($\\frac{25 + 1}{2} = 13$), not the median itself. Find which value the 13th student has.',
        'This is the median of the frequency column (3, 3, 4, 7, 8), which is not a number of siblings at all.',
      ],
      keyIdea: 'For a frequency table, find the median position $\\frac{n + 1}{2}$ and use cumulative frequencies to see which value is there.',
    },
    check: {
      optionValues: [2, 1, 13, 4],
      compute: () => {
        const x = [0, 1, 2, 3, 4];
        const f = [8, 7, 4, 3, 3];
        return median(x.flatMap((v, i) => Array<number>(f[i]).fill(v)));
      },
    },
  },
  {
    id: 'descriptive-stats-009',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'Find the **interquartile range** of $13, 5, 21, 8, 3, 18, 10, 25, 7, 15, 12$, taking the quartiles as the medians of the lower and upper halves (leaving out the median).',
    options: ['$22$', '$11$', '$6$', '$18$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Order the data: 3, 5, 7, 8, 10, **12**, 13, 15, 18, 21, 25.\n' +
        '2. $n = 11$, so the median is the 6th value: $12$.\n' +
        '3. Lower half (below the median): 3, 5, 7, 8, 10, so $Q_1 = 7$.\n' +
        '4. Upper half (above the median): 13, 15, 18, 21, 25, so $Q_3 = 18$.\n' +
        '5. $\\text{IQR} = Q_3 - Q_1 = 18 - 7 = 11$.',
      whyWrong: [
        'This is the **range**, $25 - 3 = 22$, not the interquartile range.',
        null,
        'This is only $Q_3 - \\text{median} = 18 - 12 = 6$, half of the box. The IQR goes from $Q_1$ to $Q_3$.',
        'This is $Q_3$ itself; you still need to subtract $Q_1 = 7$.',
      ],
      keyIdea: 'Sort, find the median, then the medians of each half give $Q_1$ and $Q_3$; $\\text{IQR} = Q_3 - Q_1$.',
    },
    check: {
      optionValues: [22, 11, 6, 18],
      compute: () => {
        const { q1, q3 } = quartiles([13, 5, 21, 8, 3, 18, 10, 25, 7, 15, 12]);
        return q3 - q1;
      },
    },
  },
  {
    id: 'descriptive-stats-010',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'A data set has $Q_1 = 20$, median $25$ and $Q_3 = 32$. An outlier is more than $1.5 \\times \\text{IQR}$ below $Q_1$ or above $Q_3$. Which of these values is an **outlier**?',
    options: ['$46$', '$5$', '$52$', '$44$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. $\\text{IQR} = Q_3 - Q_1 = 32 - 20 = 12$.\n' +
        '2. $1.5 \\times \\text{IQR} = 1.5 \\times 12 = 18$.\n' +
        '3. Lower fence: $Q_1 - 18 = 20 - 18 = 2$. Upper fence: $Q_3 + 18 = 32 + 18 = 50$.\n' +
        '4. An outlier is below $2$ or above $50$. Only $52$ is outside the fences ($52 > 50$).',
      whyWrong: [
        'This is only an outlier if you forget the $1.5$ and use $Q_3 + \\text{IQR} = 44$ as the fence. The real upper fence is $50$, and $46 < 50$.',
        'This is only an outlier if you use $Q_1 - \\text{IQR} = 8$ as the lower fence. The real lower fence is $20 - 18 = 2$, and $5 > 2$.',
        null,
        'This is only an outlier if you measure $1.5 \\times \\text{IQR}$ from the **median**: $25 + 18 = 43$. The fences are measured from the quartiles, so the upper fence is $50$.',
      ],
      keyIdea: 'Outlier fences are $Q_1 - 1.5 \\times \\text{IQR}$ and $Q_3 + 1.5 \\times \\text{IQR}$; anything beyond them is an outlier.',
    },
    check: {
      optionValues: [46, 5, 52, 44],
      compute: () => {
        const q1 = 20;
        const q3 = 32;
        const iqr = q3 - q1;
        const hits = [46, 5, 52, 44].filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);
        return hits.length === 1 ? hits[0] : NaN;
      },
    },
  },
  {
    id: 'descriptive-stats-011',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'The mean score of 8 students in a test is $70$. A ninth student then takes the test and scores $88$. What is the new mean score of all 9 students?',
    options: ['$79$', '$72.25$', '$72$', '$81$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1:** Turn the old mean into a total: old total $= 70 \\times 8 = 560$.\n\n' +
        '**Step 2:** Add the new score: new total $= 560 + 88 = 648$.\n\n' +
        '**Step 3:** Divide by the new count: new mean $= \\frac{648}{9} = 72$.\n\n' +
        'Quick check: the new score is $18$ above the old mean, and that extra $18$ is shared among all $9$ students: $70 + \\frac{18}{9} = 72$.',
      whyWrong: [
        'This averages the old mean and the new score, $\\frac{70 + 88}{2} = 79$, as if the new student counted as much as all 8 others together.',
        'This shares the extra $18$ among only $8$ students ($70 + \\frac{18}{8} = 72.25$). There are now $9$ students.',
        null,
        'This divides the new total $648$ by $8$ instead of $9$: after adding a student there are 9 values.',
      ],
      keyIdea: 'To update a mean, work with totals: $\\text{new mean} = \\frac{\\text{old total} + \\text{new value}}{\\text{new count}}$.',
    },
    check: {
      optionValues: [79, 72.25, 72, 81],
      compute: () => (70 * 8 + 88) / 9,
    },
  },
  {
    id: 'descriptive-stats-012',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'The mean of 10 numbers is $15$. One of the numbers, $33$, is removed. What is the mean of the remaining 9 numbers?',
    options: ['$11.7$', '$17$', '$13.2$', '$13$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1:** Total of all 10 numbers $= 15 \\times 10 = 150$.\n\n' +
        '**Step 2:** Remove $33$: new total $= 150 - 33 = 117$.\n\n' +
        '**Step 3:** There are now $9$ numbers, so the new mean is $\\frac{117}{9} = 13$.\n\n' +
        'Sense check: $33$ is bigger than the mean, so removing it must make the mean **smaller**.',
      whyWrong: [
        'This divides the new total $117$ by $10$; after removing a number only $9$ are left.',
        'This adds the share $\\frac{33 - 15}{9} = 2$ to the old mean ($15 + 2 = 17$) instead of subtracting it. Removing a value **above** the mean lowers the mean, so it cannot go up from $15$.',
        'This spreads the difference $33 - 15 = 18$ over $10$ numbers ($15 - 1.8 = 13.2$) instead of over the $9$ that remain.',
        null,
      ],
      keyIdea: 'Removing a value: subtract it from the total and divide by the new (smaller) count.',
    },
    check: {
      optionValues: [11.7, 17, 13.2, 13],
      compute: () => (15 * 10 - 33) / 9,
    },
  },
  {
    id: 'descriptive-stats-013',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'The box plots show the test scores of two classes. Which statement is **true**?',
    chart: {
      kind: 'boxplot',
      title: 'Test scores',
      xLabel: 'Score',
      boxes: [
        { label: 'Class A', min: 35, q1: 50, median: 62, q3: 70, max: 88 },
        { label: 'Class B', min: 42, q1: 55, median: 60, q3: 78, max: 95 },
      ],
    },
    options: [
      'Class B has the higher median',
      'About half of the students in Class A scored more than 70',
      'Class B has the larger interquartile range',
      'Class A has the larger range',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work out each measure from the five-number summaries.\n\n' +
        '| | Median | IQR | Range |\n|---|---|---|---|\n| Class A | 62 | $70 - 50 = 20$ | $88 - 35 = 53$ |\n| Class B | 60 | $78 - 55 = 23$ | $95 - 42 = 53$ |\n\n' +
        'Class B has the larger IQR ($23 > 20$), so its middle 50% of scores is more spread out. Its median is lower, and the ranges are equal.',
      whyWrong: [
        'Class B\'s median is $60$, which is **lower** than Class A\'s $62$. Read the line inside each box.',
        '$70$ is Class A\'s **upper quartile**, so only about a quarter (25%) of Class A scored more than 70, not half.',
        null,
        'Both ranges are $53$ ($88 - 35$ and $95 - 42$). Class B\'s whiskers are shifted to the right but are the same total length.',
      ],
      keyIdea: 'From a box plot: median = line in the box, IQR = box length, range = whisker end to whisker end; each quarter of the data lies between neighbouring markers.',
    },
  },
  {
    id: 'descriptive-stats-014',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'Class A has 20 students with a mean mark of $64$. Class B has 30 students. The mean mark of all 50 students is $70$. What is the mean mark of Class B?',
    options: ['$76$', '$74$', '$111$', '$44.4$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1:** Work with totals. Total of all 50 marks $= 70 \\times 50 = 3500$.\n\n' +
        '**Step 2:** Total of Class A $= 64 \\times 20 = 1280$.\n\n' +
        '**Step 3:** Total of Class B $= 3500 - 1280 = 2220$.\n\n' +
        '**Step 4:** Mean of Class B $= \\frac{2220}{30} = 74$.\n\n' +
        'Sense check: the overall mean $70$ is closer to Class B\'s mean than to Class A\'s, because Class B is bigger.',
      whyWrong: [
        'This assumes both classes are the same size, so that $70$ is exactly halfway between $64$ and Class B\'s mean ($2 \\times 70 - 64 = 76$). Class B is larger, so it must be weighted more.',
        null,
        'This divides Class B\'s total $2220$ by $20$ (Class A\'s size) instead of by $30$.',
        'This divides Class B\'s total $2220$ by all $50$ students instead of by the $30$ in Class B.',
      ],
      keyIdea: 'Combine groups through totals: $\\text{overall mean} = \\frac{\\text{total of A} + \\text{total of B}}{\\text{size of A} + \\text{size of B}}$.',
    },
    check: {
      optionValues: [76, 74, 111, 44.4],
      compute: () => (70 * 50 - 64 * 20) / 30,
    },
  },
  {
    id: 'descriptive-stats-017',
    subtopic: 'descriptive-stats',
    difficulty: 'exam',
    stem: 'The mean of four numbers is $9$. Adding a fifth number $x$ raises the mean to $10$. Adding a sixth number $y$ brings the mean of all six back to $9$. What is $y$?',
    options: ['$14$', '$4$', '$-5$', '$9$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work with totals at every stage.\n\n' +
        '1. Four numbers, mean $9$: total $= 4 \\times 9 = 36$.\n' +
        '2. Five numbers, mean $10$: total $= 5 \\times 10 = 50$, so $x = 50 - 36 = 14$.\n' +
        '3. Six numbers, mean $9$: total $= 6 \\times 9 = 54$, so $y = 54 - 50 = 4$.\n\n' +
        'Check: $\\frac{36 + 14 + 4}{6} = \\frac{54}{6} = 9$.',
      whyWrong: [
        'This is $x$, the number that raised the mean, not $y$. The question asks for the sixth number.',
        null,
        'This uses $5 \\times 9 = 45$ as the final total, forgetting there are now **six** numbers: $45 - 50 = -5$.',
        'Adding a number equal to $9$ does not bring the mean down to $9$: the five numbers have mean $10$, so the new mean would be $\\frac{50 + 9}{6} \\approx 9.83$. You need a number well below $9$.',
      ],
      keyIdea: 'Each time a value is added, convert means into totals (mean $\\times$ count) and find the new value as the difference of totals.',
    },
    check: {
      optionValues: [14, 4, -5, 9],
      compute: () => {
        const t4 = 4 * 9;
        const t5 = 5 * 10;
        const x = t5 - t4;
        return 6 * 9 - (t4 + x);
      },
    },
  },
  {
    id: 'descriptive-stats-020',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'Which average is most affected by one very large value?',
    options: ['The mean', 'The median', 'The mode', 'All three equally'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The mean uses the size of every value, so one very large value pulls it up.\n\n' +
        'For $1, 2, 2, 3, 100$ the mean is $21.6$, while the median and the mode are both $2$.',
      whyWrong: [
        null,
        'The median depends only on the middle position, so it hardly moves when the largest value grows.',
        'The mode depends only on which value occurs most often, so one large value does not change it.',
        'The three behave differently: only the mean uses the size of every value.',
      ],
      keyIdea: 'The mean is sensitive to extreme values; the median and the mode are not.',
    },
    check: {
      optionValues: ['mean', 'median', 'mode', 'equal'],
      compute: () => {
        const before = [1, 2, 2, 3, 4];
        const after = [1, 2, 2, 3, 100];
        const shift = (f: (d: number[]) => number) => Math.abs(f(after) - f(before));
        const changes: [string, number][] = [
          ['mean', shift(mean)],
          ['median', shift(median)],
          ['mode', shift((d) => modes(d)[0])],
        ];
        return changes.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
      },
    },
  },
  {
    id: 'descriptive-stats-021',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'Which of these is a measure of **spread**?',
    options: ['Interquartile range', 'Mean', 'Median', 'Mode'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A measure of **spread** says how far apart the values are. The interquartile range, $Q_3 - Q_1$, gives the width of the middle half of the data.\n\n' +
        'The mean, median and mode are averages, which say where the centre of the data is.',
      whyWrong: [
        null,
        'The mean is an average: it describes the centre of the data, not how spread out it is.',
        'The median is an average: it is the middle value, and says nothing about how far apart the values are.',
        'The mode is the most common value, so it says nothing about how far apart the values are.',
      ],
      keyIdea: 'Averages describe the centre; the range, interquartile range and standard deviation describe the spread.',
    },
  },
  {
    id: 'descriptive-stats-022',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'The **mode** of a data set is the value that:',
    options: ['Occurs most often', 'Is in the middle when the data are ordered', 'Equals the total divided by the number of values', 'Equals the largest minus the smallest'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The mode is the most frequent value. In $2, 3, 3, 5, 9$ the mode is $3$, because it appears twice and every other value appears once.',
      whyWrong: [
        null,
        'This is the **median**.',
        'This is the **mean**.',
        'This is the **range**, which measures spread.',
      ],
      keyIdea: 'Mode = most frequent; median = middle; mean = total divided by count.',
    },
  },
  {
    id: 'descriptive-stats-023',
    subtopic: 'descriptive-stats',
    difficulty: 'foundation',
    stem: 'The lower quartile $Q_1$ is also known as which percentile?',
    options: ['The 25th percentile', 'The 50th percentile', 'The 75th percentile', 'The 1st percentile'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **percentile** is the value below which that percentage of the data lies.\n\n' +
        'The lower quartile has a quarter of the data below it, so it is the 25th percentile. The median is the 50th and the upper quartile is the 75th.',
      whyWrong: [
        null,
        'The 50th percentile is the **median**, with half of the data below it.',
        'The 75th percentile is the **upper** quartile, $Q_3$.',
        'The "1" in $Q_1$ means the first of the three quartiles, not 1% of the data.',
      ],
      keyIdea: '$Q_1$, the median and $Q_3$ are the 25th, 50th and 75th percentiles.',
    },
  },];
