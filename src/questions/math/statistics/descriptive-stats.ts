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
      asking: 'What is the average of the six numbers?',
      solution:
        'The **mean** is the total of all the values divided by how many values there are.\n\n' +
        'Add them all: $3 + 8 + 4 + 15 + 5 + 7 = 42$.\n\n' +
        'There are 6 values, so divide by 6: $42 \\div 6 = 7$.',
      conclusion: 'The total of 42 shared across 6 values gives the answer, $7$.',
      whyWrong: [
        'This is the **median**: in order the data are 3, 4, 5, 7, 8, 15 and the middle two values give $\\frac{5 + 7}{2} = 6$. The question asks for the mean.',
        'This divides the total by $5$ instead of $6$: $\\frac{42}{5} = 8.4$. Count the values carefully; there are six.',
        null,
        'This is halfway between the smallest and largest values, $\\frac{3 + 15}{2} = 9$ (the "mid-range"), not the mean. The mean uses every value.',
      ],
      keyIdea: 'Mean $= \\frac{\\text{total of the values}}{\\text{number of values}}$. Count the values as you add them, so that you divide by the right number.',
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
      asking: 'What is the middle value once the numbers are in order?',
      solution:
        'The **median** is the middle value when the numbers are in order, so sort them first: 5, 7, 9, 12, 15, 20.\n\n' +
        'There are 6 values, which is an even number, so no single value is in the middle. The middle pair is the 3rd and 4th values: 9 and 12.\n\n' +
        'The median is halfway between them. Add them and halve: $\\frac{9 + 12}{2} = \\frac{21}{2} = 10.5$.',
      conclusion: 'Halfway between the middle pair, 9 and 12, is the answer, $10.5$.',
      whyWrong: [
        'This takes the middle two values of the list **as written** ($9$ and $20$), without sorting it first: $\\frac{9 + 20}{2} = 14.5$.',
        null,
        'This is the **position** of the median, $\\frac{6 + 1}{2} = 3.5$, not its value. Use the position to find the value in the ordered list.',
        'This takes only the 3rd value of the ordered list. With an even number of values there are two middle values, so you must average $9$ and $12$.',
      ],
      keyIdea: 'Always sort first. With $n$ values, the median is at position $\\frac{n + 1}{2}$. If that ends in $.5$, as position $3.5$ does here, average the two values either side of it.',
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
      asking: 'Which value appears most often, and how far is it from the smallest value to the largest?',
      solution:
        'The **mode** is the value that appears most often. Counting them, 7 appears 3 times, 9 appears twice, and the others appear once each. So the mode is 7.\n\n' +
        'The **range** is the largest value minus the smallest. The largest is 12 and the smallest is 2, so the range is $12 - 2 = 10$.',
      conclusion: 'The two results together give Mode $= 7$, range $= 10$.',
      whyWrong: [
        'The value $3$ is **how many times** the mode appears (its frequency). The mode is the value itself, $7$.',
        'This range is the last value minus the first value of the unsorted list, $12 - 4 = 8$. The range uses the largest and smallest values, $12 - 2$.',
        'This gives only the largest value, $12$. The range is largest **minus** smallest: $12 - 2 = 10$.',
        null,
      ],
      keyIdea: 'Make a quick tally for the mode, and report the value, not how many times it appears. For the range, find the largest and smallest values anywhere in the list, then subtract.',
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
      asking: 'Which measure best shows what a normal person at this company earns?',
      solution:
        'Look at the values. Six salaries are between 6,000 and 8,500, and one is 60,000. A value far away from the rest like that is called an **outlier**.\n\n' +
        'The **mean** uses every value, so the outlier drags it up. The total is 103,500, and $103\\,500 \\div 7 \\approx 14\\,786$. That is more than six of the seven people earn.\n\n' +
        'The **median** is the middle value in order, so it doesn\'t depend on how big the largest value is. The 4th of the 7 salaries is AED 7,500, close to what most people earn.',
      conclusion: 'AED 7,500 fairly describes most salaries and isn\'t pulled up by the owner, so the answer is The median.',
      whyWrong: [
        'Using every value is exactly the problem here: the one huge salary drags the mean up to about AED 14,786, more than six of the seven people earn.',
        null,
        'No salary appears more than once, so there is no mode at all.',
        'The range is a measure of **spread**, not an average, so it cannot describe a typical salary.',
      ],
      keyIdea: 'If the data has a value far from the rest, use the median for a typical value, because the mean gets pulled towards extreme values. With no extreme values, the mean works well.',
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
      asking: 'How wide is the box in the box plot?',
      solution:
        'A box plot shows five numbers. The two whisker ends are the smallest and largest values, the box edges are the **quartiles**, and the line inside the box is the median.\n\n' +
        'The left edge of the box is the lower quartile $Q_1$, which has a quarter of the data below it. Reading the chart, $Q_1 = 20$. The right edge is the upper quartile, $Q_3 = 35$.\n\n' +
        'The **interquartile range** (IQR) is the width of the box, $Q_3 - Q_1$: $35 - 20 = 15$.',
      conclusion: 'The box runs from 20 to 35, so the answer is $15$.',
      whyWrong: [
        'This is the **range**, maximum minus minimum ($48 - 12 = 36$), which uses the whiskers, not the box.',
        'This is only the right-hand part of the box, $Q_3 - \\text{median} = 35 - 26 = 9$. The IQR is the whole box.',
        null,
        'This is the **median** (the line inside the box), not a measure of spread.',
      ],
      keyIdea: 'On a box plot, IQR $=$ right edge of the box $-$ left edge of the box. Ignore the whiskers (they give the range) and the line inside (the median).',
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
      asking: 'What must the missing fifth number be, for the mean to be 12?',
      solution:
        'A mean tells you the total: total $=$ mean $\\times$ how many values. So the five numbers must add up to $12 \\times 5 = 60$.\n\n' +
        'Add the four you know: $8 + 15 + 10 + 14 = 47$.\n\n' +
        'The fifth number is what is missing from the total: $60 - 47 = 13$.',
      conclusion: 'Checking: $\\frac{47 + 13}{5} = \\frac{60}{5} = 12$, so the answer is $13$.',
      whyWrong: [
        null,
        'This uses $12 \\times 4 = 48$ as the total, multiplying by the number of **known** values instead of all five: $48 - 47 = 1$.',
        'This assumes the missing number must equal the mean. It only would if the other four also averaged $12$, but they average $11.75$.',
        'This is the mean of the four known numbers, $\\frac{47}{4} = 11.75$, not the missing value.',
      ],
      keyIdea: 'For a missing value, turn the mean into a total (mean $\\times$ number of values), then subtract the values you know.',
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
      asking: 'What is the average number of goals across all 20 matches?',
      solution:
        'Each row groups matches with the same score. $x$ is the goals and $f$ (the frequency) is how many matches had that score. So the row $x = 1$, $f = 6$ means 6 matches of 1 goal each, which is $1 \\times 6 = 6$ goals.\n\n' +
        'Find the goals from every row by multiplying $f$ by $x$:\n\n| $x$ | $f$ | $f \\times x$ |\n|---|---|---|\n| 0 | 4 | 0 |\n| 1 | 6 | 6 |\n| 2 | 5 | 10 |\n| 3 | 3 | 9 |\n| 4 | 2 | 8 |\n\n' +
        'Add the last column for the total goals: $0 + 6 + 10 + 9 + 8 = 33$.\n\n' +
        'Divide by the number of matches, which is 20, not the 5 rows: $33 \\div 20 = 1.65$.',
      conclusion: '33 goals shared across 20 matches gives the answer, $1.65$.',
      whyWrong: [
        'This is the mean of the goal values $0, 1, 2, 3, 4$ ignoring how often each happened: $\\frac{10}{5} = 2$.',
        'This is the mean of the frequency column, $\\frac{20}{5} = 4$: it averages the counts, not the goals.',
        'This divides the total goals by the number of **rows** in the table, $\\frac{33}{5} = 6.6$, instead of by the number of matches, $20$.',
        null,
      ],
      keyIdea: 'Mean from a frequency table: $\\bar{x} = \\frac{\\sum fx}{\\sum f}$, where $\\sum$ means add up. Add a column for $f \\times x$, add it up, and divide by the total frequency, never by the number of rows.',
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
      asking: 'If all 25 students stood in order of siblings, how many would the middle one have?',
      solution:
        'The **median** is the middle value in order. With 25 students, the middle is position $\\frac{25 + 1}{2} = 13$, so we want the 13th student, with 12 students on either side.\n\n' +
        'Line the students up by number of siblings and keep a running total:\n\n| Siblings | Frequency | Running total | Positions |\n|---|---|---|---|\n| 0 | 8 | 8 | 1st to 8th |\n| 1 | 7 | 15 | 9th to 15th |\n| 2 | 4 | 19 | 16th to 19th |\n| 3 | 3 | 22 | 20th to 22nd |\n| 4 | 3 | 25 | 23rd to 25th |\n\n' +
        'The 13th student falls in the 9th to 15th group, and each of them has 1 sibling.',
      conclusion: 'The 13th student in the line has 1 sibling, so the median is $1$.',
      whyWrong: [
        'This is the middle **row** of the table, ignoring the frequencies. Many more students have 0 or 1 sibling than 3 or 4.',
        null,
        'This is the **position** of the median ($\\frac{25 + 1}{2} = 13$), not the median itself. Find which value the 13th student has.',
        'This is the median of the frequency column (3, 3, 4, 7, 8), which is not a number of siblings at all.',
      ],
      keyIdea: 'For a median from a frequency table, find the position $\\frac{n + 1}{2}$. Then add a running total of the frequencies, and stop at the first row that reaches that position.',
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
      asking: 'How far apart are the upper and lower quartiles of this list?',
      solution:
        'Sort the 11 numbers, because quartiles depend on order: 3, 5, 7, 8, 10, 12, 13, 15, 18, 21, 25.\n\n' +
        'The median is the middle value. With 11 values it is the 6th, which is 12. Leave it out, as the question says.\n\n' +
        'The lower half is 3, 5, 7, 8, 10. Its middle value is the **lower quartile**: $Q_1 = 7$.\n\n' +
        'The upper half is 13, 15, 18, 21, 25. Its middle value is the **upper quartile**: $Q_3 = 18$.\n\n' +
        'The **interquartile range** is the gap between them: $Q_3 - Q_1 = 18 - 7 = 11$.',
      conclusion: 'The quartiles are 7 and 18, so the answer is $11$.',
      whyWrong: [
        'This is the **range**, $25 - 3 = 22$, not the interquartile range.',
        null,
        'This is only $Q_3 - \\text{median} = 18 - 12 = 6$, half of the box. The IQR goes from $Q_1$ to $Q_3$.',
        'This is $Q_3$ itself; you still need to subtract $Q_1 = 7$.',
      ],
      keyIdea: 'To find an IQR from raw data: sort, find the median, split into lower and upper halves, take the median of each half ($Q_1$ and $Q_3$), then subtract $Q_3 - Q_1$.',
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
      asking: 'Which value lies beyond the outlier limits?',
      solution:
        'Find the **interquartile range** (IQR), the gap between the quartiles: $32 - 20 = 12$.\n\n' +
        'Find how far a value may go before it counts as an outlier: $1.5 \\times 12 = 18$.\n\n' +
        'Measure that distance from each quartile. The lower limit is $20 - 18 = 2$, and the upper limit is $32 + 18 = 50$. These limits are called **fences**.\n\n' +
        'A value is an outlier only if it is below 2 or above 50. Test each one:\n\n| Value | Below 2 or above 50? |\n|---|---|\n| 46 | No |\n| 5 | No |\n| 52 | Yes |\n| 44 | No |',
      conclusion: 'Only one value lies outside the fences of 2 and 50, so the answer is $52$.',
      whyWrong: [
        'This is only an outlier if you forget the $1.5$ and use $Q_3 + \\text{IQR} = 44$ as the fence. The real upper fence is $50$, and $46 < 50$.',
        'This is only an outlier if you use $Q_1 - \\text{IQR} = 8$ as the lower fence. The real lower fence is $20 - 18 = 2$, and $5 > 2$.',
        null,
        'This is only an outlier if you measure $1.5 \\times \\text{IQR}$ from the **median**: $25 + 18 = 43$. The fences are measured from the quartiles, so the upper fence is $50$.',
      ],
      keyIdea: 'Outlier fences: lower $= Q_1 - 1.5 \\times \\text{IQR}$ and upper $= Q_3 + 1.5 \\times \\text{IQR}$. Measure from the quartiles, not the median. Anything outside the fences is an outlier.',
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
      asking: 'What is the new average after a ninth score is added?',
      solution:
        'You can\'t just average 70 and 88, because 70 stands for 8 students. Work with totals instead. Total of the 8 scores $=$ mean $\\times$ number of students $= 70 \\times 8 = 560$.\n\n' +
        'Add the new score to the total: $560 + 88 = 648$.\n\n' +
        'There are now 9 students, so divide by 9: $648 \\div 9 = 72$.',
      conclusion: 'The new total of 648 shared across 9 students gives the answer, $72$.',
      whyWrong: [
        'This averages the old mean and the new score, $\\frac{70 + 88}{2} = 79$, as if the new student counted as much as all 8 others together.',
        'This shares the extra $18$ among only $8$ students ($70 + \\frac{18}{8} = 72.25$). There are now $9$ students.',
        null,
        'This divides the new total $648$ by $8$ instead of $9$: after adding a student there are 9 values.',
      ],
      keyIdea: 'When a value joins a group, find the old total (mean $\\times$ count), add the new value, then divide by the new count. Totals can be added, but means can\'t.',
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
      asking: 'What is the average of what is left after 33 is taken out?',
      solution:
        'Work with totals, because a mean can\'t be adjusted directly. Total of the 10 numbers $=$ mean $\\times$ how many $= 15 \\times 10 = 150$.\n\n' +
        'Take out the 33: $150 - 33 = 117$.\n\n' +
        'Now 9 numbers remain, so divide by 9: $117 \\div 9 = 13$.',
      conclusion: 'The remaining 9 numbers add up to 117, so their mean is $13$.',
      whyWrong: [
        'This divides the new total $117$ by $10$; after removing a number only $9$ are left.',
        'This adds the share $\\frac{33 - 15}{9} = 2$ to the old mean ($15 + 2 = 17$) instead of subtracting it. Removing a value **above** the mean lowers the mean, so it cannot go up from $15$.',
        'This spreads the difference $33 - 15 = 18$ over $10$ numbers ($15 - 1.8 = 13.2$) instead of over the $9$ that remain.',
        null,
      ],
      keyIdea: 'When a value is removed, find the old total (mean $\\times$ count), subtract the value, and divide by the new count. Removing a value above the mean always lowers the mean.',
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
      asking: 'Which statement matches what the two box plots show?',
      solution:
        'Read five numbers from each plot. Whisker ends give the smallest and largest values, box edges give the quartiles $Q_1$ and $Q_3$, and the line in the box is the median:\n\n| Class | Min | $Q_1$ | Median | $Q_3$ | Max |\n|---|---|---|---|---|---|\n| A | 35 | 50 | 62 | 70 | 88 |\n| B | 42 | 55 | 60 | 78 | 95 |\n\n' +
        'Median: A has 62 and B has 60, so Class B does not have the higher median.\n\n' +
        'A quarter of a class scores above its upper quartile. For Class A, $Q_3 = 70$, so only about a quarter scored more than 70, not half.\n\n' +
        'Range (largest minus smallest): A has $88 - 35 = 53$ and B has $95 - 42 = 53$. They are equal, so Class A doesn\'t have the larger range.\n\n' +
        'Interquartile range (the width of the box): A has $70 - 50 = 20$ and B has $78 - 55 = 23$. Class B\'s box is wider.',
      conclusion: '23 is more than 20, so the true statement is Class B has the larger interquartile range.',
      whyWrong: [
        'Class B\'s median is $60$, which is **lower** than Class A\'s $62$. Read the line inside each box.',
        '$70$ is Class A\'s **upper quartile**, so only about a quarter (25%) of Class A scored more than 70, not half.',
        null,
        'Both ranges are $53$ ($88 - 35$ and $95 - 42$). Class B\'s whiskers are shifted to the right but are the same total length.',
      ],
      keyIdea: 'To compare box plots, copy the five numbers into a table. The median compares the centre, while the IQR (box width) and range (whisker to whisker) compare spread. Each quartile marks a quarter of the data.',
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
      asking: 'What mean mark must Class B have for the overall mean to be 70?',
      solution:
        'You can\'t average means directly, because the classes differ in size. Work with totals: total marks $=$ mean $\\times$ number of students.\n\n' +
        'Total for all 50 students: $70 \\times 50 = 3500$.\n\n' +
        'Total for Class A: $64 \\times 20 = 1280$.\n\n' +
        'Class B has the rest: $3500 - 1280 = 2220$.\n\n' +
        'Class B has 30 students, so its mean is $2220 \\div 30 = 74$.',
      conclusion: 'Class B\'s 30 students share 2220 marks, so the answer is $74$.',
      whyWrong: [
        'This assumes both classes are the same size, so that $70$ is exactly halfway between $64$ and Class B\'s mean ($2 \\times 70 - 64 = 76$). Class B is larger, so it must be weighted more.',
        null,
        'This divides Class B\'s total $2220$ by $20$ (Class A\'s size) instead of by $30$.',
        'This divides Class B\'s total $2220$ by all $50$ students instead of by the $30$ in Class B.',
      ],
      keyIdea: 'To combine groups, turn every mean into a total. Totals add up across groups, so the missing group\'s total is the whole minus the known part. Then divide by that group\'s size.',
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
      asking: 'What sixth number brings the mean back down to 9?',
      solution:
        'Turn each mean into a total, since total $=$ mean $\\times$ how many. We only need the last two stages, so we don\'t have to find $x$.\n\n' +
        'With five numbers, the mean is 10, so they add up to $10 \\times 5 = 50$.\n\n' +
        'With all six numbers, the mean is 9, so they add up to $9 \\times 6 = 54$.\n\n' +
        'The sixth number $y$ is the only difference between those totals: $y = 54 - 50 = 4$.',
      conclusion: 'Adding $y$ takes the total from 50 to 54, so the answer is $4$.',
      whyWrong: [
        'This is $x$, the number that raised the mean, not $y$. The question asks for the sixth number.',
        null,
        'This uses $5 \\times 9 = 45$ as the final total, forgetting there are now **six** numbers: $45 - 50 = -5$.',
        'Adding a number equal to $9$ does not bring the mean down to $9$: the five numbers have mean $10$, so the new mean would be $\\frac{50 + 9}{6} \\approx 9.83$. You need a number well below $9$.',
      ],
      keyIdea: 'When numbers are added one at a time, write the total after each stage (mean $\\times$ count). The difference between two totals is the number that joined.',
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
      asking: 'Which average changes most when one value is very large?',
      solution:
        'Try a small example. Take the list 1, 2, 2, 3 and change the largest value to 30, giving 1, 2, 2, 30.\n\n' +
        'Work out each average before and after. The **mean** is the total divided by the count, the **median** is the middle value, and the **mode** is the most common value:\n\n| Average | 1, 2, 2, 3 | 1, 2, 2, 30 |\n|---|---|---|\n| Mean | $8 \\div 4 = 2$ | $35 \\div 4 = 8.75$ |\n| Median | 2 | 2 |\n| Mode | 2 | 2 |',
      conclusion: 'Only one average uses the size of every value, and it jumped from 2 to $8.75$, so the answer is The mean.',
      whyWrong: [
        null,
        'The median depends only on the middle position, so it hardly moves when the largest value grows.',
        'The mode depends only on which value occurs most often, so one large value does not change it.',
        'The three behave differently: only the mean uses the size of every value.',
      ],
      keyIdea: 'To compare averages, try a tiny list and make one value huge. Whichever average moves is the one affected. The mean always moves, because it adds up every value.',
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
      asking: 'Which of these tells you how spread out the data is?',
      solution:
        '**Spread** means how far apart the values are. A measure of spread gets bigger when the values are further apart.\n\n' +
        'Mean, median and mode are all averages. The lists 49, 50, 51 and 0, 50, 100 have the same mean and median, 50, even though the second is far more spread out. So averages can\'t show spread.\n\n' +
        'The **interquartile range** is the gap between the upper and lower quartiles. That is the width of the middle half of the data, so it grows as the values spread out.',
      conclusion: 'It measures a gap between values, not a centre, so the answer is Interquartile range.',
      whyWrong: [
        null,
        'The mean is an average: it describes the centre of the data, not how spread out it is.',
        'The median is an average: it is the middle value, and says nothing about how far apart the values are.',
        'The mode is the most common value, so it says nothing about how far apart the values are.',
      ],
      keyIdea: 'Sort measures into two groups. Centre: mean, median, mode. Spread: range, interquartile range, variance, standard deviation. If a measure is a gap or a distance, it measures spread.',
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
      asking: 'What does the word "mode" mean?',
      solution:
        'The **mode** is a kind of average that looks only at how many times each value appears.\n\n' +
        'Take the list 2, 3, 3, 5. The value 3 appears twice and the others appear once, so the mode is 3, the most common value.',
      conclusion: 'The mode is picked by how often a value appears, so it is the value that Occurs most often.',
      whyWrong: [
        null,
        'This is the **median**.',
        'This is the **mean**.',
        'This is the **range**, which measures spread.',
      ],
      keyIdea: 'Match each word to its job. Mode: most common. Median: middle in order. Mean: total divided by count. Range: largest minus smallest.',
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
      asking: 'What percentage of the data lies below $Q_1$?',
      solution:
        'A **percentile** tells you what percentage of the data lies below a value. For example, 90% of the data lies below the 90th percentile.\n\n' +
        '**Quartiles** split ordered data into four equal parts, each holding 25%. The lower quartile $Q_1$ is the first cut, so 25% of the data lies below it.',
      conclusion: '25% of the data lies below it, so $Q_1$ is The 25th percentile.',
      whyWrong: [
        null,
        'The 50th percentile is the **median**, with half of the data below it.',
        'The 75th percentile is the **upper** quartile, $Q_3$.',
        'The "1" in $Q_1$ means the first of the three quartiles, not 1% of the data.',
      ],
      keyIdea: 'Quartiles come every 25%: $Q_1$ is the 25th percentile, $Q_2$ (the median) is the 50th, and $Q_3$ is the 75th.',
    },
  },];
