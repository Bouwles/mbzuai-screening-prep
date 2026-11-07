import type { StaticQuestion } from '../../../types';
import { gcd } from '../../../lib/frac';
import { median, sumOf } from '../../../lib/mathx';

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'data-calculations-001',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'The bar chart shows website visitors (in thousands) on five days. What is the percentage increase in visitors from **Monday** to **Wednesday**?',
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
      asking: 'By what percentage did visitors go up between Monday and Wednesday?',
      solution:
        'Read the two bars: Monday is 40 thousand and Wednesday is 50 thousand. Monday comes first, so it is the **original** value.\n\n' +
        'Find the change, which is new minus original: $50 - 40 = 10$ thousand.\n\n' +
        'A percentage change compares the change with where you started, so divide by the original: $\\frac{10}{40} = 0.25$.\n\n' +
        'Multiply by 100 to turn it into a percentage: $0.25 \\times 100 = 25\\%$.',
      conclusion: 'Visitors rose by 10 thousand on a start of 40 thousand, which is a rise of $25\\%$.',
      whyWrong: [
        'This is $\\frac{10}{50} \\times 100$: it divides by the **new** value (Wednesday) instead of the original value (Monday).',
        'This is the raw change, 10 thousand visitors, written as if it were a percentage. You must divide the change by the original value.',
        null,
        'This is $\\frac{50}{40} \\times 100$, Wednesday as a percentage **of** Monday. The increase is $125\\% - 100\\% = 25\\%$.',
      ],
      keyIdea: 'Percentage change $= \\frac{\\text{new} - \\text{original}}{\\text{original}} \\times 100$. Spot it by the words "percentage increase" or "percentage decrease". Always divide by the earlier value.',
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
    stem: 'The pie chart shows how many students use each way of travelling to school. What percentage of the students **walk**?',
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
      asking: 'What percentage of all the students walk to school?',
      solution:
        'A percentage compares a part with the whole. The part is the Walk slice, which is 24 students.\n\n' +
        'The chart shows numbers of students, so find the whole by adding all the slices: $18 + 12 + 24 + 6 = 60$.\n\n' +
        'Divide the part by the whole: $\\frac{24}{60} = 0.4$.\n\n' +
        'Multiply by 100 to get a percentage: $0.4 \\times 100 = 40\\%$.',
      conclusion: '24 out of 60 students walk, which is $40\\%$.',
      whyWrong: [
        'This treats the count 24 as a percentage, which only works if there are exactly 100 students. There are 60.',
        'This is $\\frac{24}{36}$: it compares walkers with the students who do **not** walk (a part-to-part ratio) instead of with all 60 students.',
        'This is $\\frac{36}{60} \\times 100$, the percentage who do **not** walk.',
        null,
      ],
      keyIdea: 'Percentage of a total $= \\frac{\\text{part}}{\\text{total}} \\times 100$. If a chart shows counts, add every slice first to find the total. A slice\'s number is a percentage only if the total is 100.',
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
    difficulty: 'exam',
    stem: 'The table shows the goals a team scored in each of its 20 matches. What is the mean number of goals per match?',
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
      asking: 'On average, how many goals did the team score in each match?',
      solution:
        'The **mean** is the total of all the values divided by how many values there are. So we need the total goals and the number of matches.\n\n' +
        'Each row says how many matches had that score. For example, 5 matches with 2 goals each gives $2 \\times 5 = 10$ goals. Do this for every row:\n\n| Goals in a match | Number of matches | Goals from those matches |\n|---|---|---|\n| 0 | 4 | 0 |\n| 1 | 6 | 6 |\n| 2 | 5 | 10 |\n| 3 | 3 | 9 |\n| 4 | 2 | 8 |\n\n' +
        'Add the last column to get the total goals: $6 + 10 + 9 + 8 = 33$. The 0 adds nothing.\n\n' +
        'Add the middle column to get the number of matches: $4 + 6 + 5 + 3 + 2 = 20$.\n\n' +
        'Divide the total goals by the number of matches: $\\frac{33}{20} = 1.65$.',
      conclusion: '33 goals shared across 20 matches gives a mean of $1.65$.',
      whyWrong: [
        'This is $\\frac{33}{5}$: it divides the total goals by the number of **rows** (5) instead of the number of matches (20).',
        null,
        'This is the mean of the values $0, 1, 2, 3, 4$ on their own; it ignores how many matches had each score.',
        'This is $\\frac{20}{5}$, the mean of the frequency column. The frequencies are counts of matches, not goals.',
      ],
      keyIdea: 'For a frequency table (a value column and a "how many" column), add a third column of value times frequency. Mean $=$ the total of that column divided by the total frequency. Never divide by the number of rows.',
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
    stem: 'The table shows the members of a club. What is the ratio of boys to girls **in the whole club**, in its simplest form?',
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
      asking: 'Across both year groups, how do boys compare with girls in simplest form?',
      solution:
        '"Whole club" means both year groups together, so add each column. Boys: $5 + 7 = 12$. Girls: $9 + 9 = 18$.\n\n' +
        '"Boys to girls" lists boys first, so the ratio is $12:18$.\n\n' +
        'Simplest form means dividing both sides by the largest number that goes into both. That number is 6, because $12 = 6 \\times 2$ and $18 = 6 \\times 3$.\n\n' +
        'Divide both sides by 6: $12 \\div 6 = 2$ and $18 \\div 6 = 3$. That gives $2:3$.',
      conclusion: '12 boys to 18 girls simplifies to $2:3$.',
      whyWrong: [
        'This is girls : boys. The order of a ratio matters: "boys to girls" puts the boys first.',
        'This is $12:30$, boys : **whole club**. The question compares boys with girls, not with the total.',
        null,
        'This uses only the Year 12 row. The question asks about the whole club, so add both rows first.',
      ],
      keyIdea: 'For a ratio: add up the totals the question names, write them in the order the words give ("boys to girls" puts boys first), then divide both sides by the largest number that goes into both.',
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
    stem: 'A van travelled 150 km on 12 litres of fuel. What was its fuel economy in **kilometres per litre**?',
    options: ['$12.5$ km per litre', '$0.08$ km per litre', '$8$ km per litre', '$1800$ km per litre'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many kilometres does the van go on one litre of fuel?',
      solution:
        'The word **per** means "for each one". So kilometres per litre asks how many kilometres we get for each single litre.\n\n' +
        'To share something out per litre, divide by the number of litres: $\\frac{\\text{distance}}{\\text{litres}} = \\frac{150}{12}$.\n\n' +
        'Do the division: $12 \\times 12 = 144$, which leaves $150 - 144 = 6$. Then $\\frac{6}{12} = 0.5$, so $\\frac{150}{12} = 12.5$.',
      conclusion: '150 km shared across 12 litres gives $12.5$ km per litre.',
      whyWrong: [
        null,
        'This is $\\frac{12}{150}$, which is litres per kilometre. The division has been done the wrong way round.',
        'This is $\\frac{12}{150} \\times 100$, the litres used per 100 km, a different measure of fuel use.',
        'This multiplies the distance by the fuel used. A rate "per litre" needs a division.',
      ],
      keyIdea: 'Read a rate\'s name as an instruction: "A per B" means A divided by B. So kilometres per litre is kilometres divided by litres. The thing named first goes on top.',
    },
    check: { optionValues: [12.5, 0.08, 8, 1800], compute: () => 150 / 12 },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'data-calculations-006',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The line graph shows an app\'s subscribers over six months. By what percentage did the number fall from its **highest** month to June? (Options to 1 decimal place where needed.)',
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
      asking: 'By what percentage did subscribers drop from the peak month down to June?',
      solution:
        'Find the highest point on the line. The readings are 2400, 2200, 2500, 2100, 1900 and 1800, so the highest is 2500, in March.\n\n' +
        'March is the starting value, because the question measures from the highest month. The end value is June, which is 1800.\n\n' +
        'Find the fall: $2500 - 1800 = 700$.\n\n' +
        'A percentage change compares the change with where it started, so divide by 2500: $\\frac{700}{2500} = 0.28$.\n\n' +
        'Multiply by 100 to get a percentage: $0.28 \\times 100 = 28\\%$.',
      conclusion: 'Subscribers fell by 700 from a start of 2500, which is a fall of $28\\%$.',
      whyWrong: [
        'This is $\\frac{700}{1800} \\times 100$: it divides by the June value (the end) instead of the March value (the start).',
        null,
        'This is $\\frac{1800}{2500} \\times 100$, June as a percentage of March, which is what is **left**. The fall is $100\\% - 72\\% = 28\\%$.',
        'This is $\\frac{600}{2400} \\times 100$: it starts from January (the first month) instead of the highest month, March.',
      ],
      keyIdea: 'Percentage fall $= \\frac{\\text{start} - \\text{end}}{\\text{start}} \\times 100$. First pick the start the question names, such as the highest month rather than the first month. Then always divide by that start.',
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
    stem: 'After a $20\\%$ price increase, a monthly cost is AED 72. What was the cost **before** the increase?',
    options: ['AED 57.60', 'AED 52', 'AED 60', 'AED 86.40'],
    correctIndex: 2,
    markScheme: {
      asking: 'What was the cost before it went up by $20\\%$?',
      solution:
        'The $20\\%$ rise was worked out on the old cost, which we don\'t know. So treat the old cost as $100\\%$.\n\n' +
        'After the rise, the new cost is $100\\% + 20\\% = 120\\%$ of the old cost. So AED 72 is $120\\%$ of the old cost.\n\n' +
        'As a decimal, $120\\%$ is $120 \\div 100 = 1.2$. That gives us $\\text{old cost} \\times 1.2 = 72$.\n\n' +
        'To undo a multiplication, divide: $\\text{old cost} = 72 \\div 1.2 = 60$.',
      conclusion: 'Test it: $20\\%$ of 60 is 12, and $60 + 12 = 72$. So the cost before the increase was AED 60.',
      whyWrong: [
        'This is $72 \\times 0.8$: it takes $20\\%$ off the **new** price. But the $20\\%$ was calculated on the original price, so you must divide by 1.2.',
        'This subtracts 20 as if $20\\%$ meant AED 20.',
        null,
        'This is $72 \\times 1.2$: it increases the price a second time instead of undoing the increase.',
      ],
      keyIdea: 'To reverse a percentage change, find the multiplier and divide by it. Up $20\\%$ means the multiplier is 1.2, and down $20\\%$ means it is 0.8. Don\'t take the percentage off the new value.',
    },
    check: { optionValues: [57.6, 52, 60, 86.4], compute: () => 72 / (1 + 20 / 100) },
  },
  {
    id: 'data-calculations-008',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'A number **increases by** $50\\%$ and then **decreases by** $30\\%$. What is the overall percentage change?',
    options: ['$20\\%$ increase', '$10\\%$ increase', '$5\\%$ decrease', '$5\\%$ increase'],
    correctIndex: 3,
    markScheme: {
      asking: 'After both changes, how much has the number changed overall compared with where it began?',
      solution:
        'The question doesn\'t give a starting number, so choose an easy one. 100 works well, because the final result can be read as a percentage.\n\n' +
        'Increase by $50\\%$: $50\\%$ of 100 is 50, so the number becomes $100 + 50 = 150$.\n\n' +
        'Decrease by $30\\%$. This $30\\%$ is of the new number, 150, not the original 100. $30\\%$ of 150 is $0.3 \\times 150 = 45$, so the number becomes $150 - 45 = 105$.\n\n' +
        'Compare the end with the start: $105 - 100 = 5$, and 5 out of 100 is $5\\%$. The number finished higher than it began, so it went up.',
      conclusion: 'The number goes from 100 to 105, which is a $5\\%$ increase.',
      whyWrong: [
        'This adds $+50\\%$ and $-30\\%$. Percentages applied one after another do not add, because the $30\\%$ is taken from the larger number reached after the rise, not from the original.',
        'This averages the two changes, $\\frac{50 - 30}{2}$. Successive changes must be combined by multiplying the multipliers.',
        'This has the right size but the wrong direction: the overall multiplier 1.05 is bigger than 1, so the number went **up**.',
        null,
      ],
      keyIdea: 'For changes one after another, multiply the multipliers. Up $50\\%$ is $\\times 1.5$ and down $30\\%$ is $\\times 0.7$, so $1.5 \\times 0.7 = 1.05$. Above 1 is an overall increase, and below 1 is a decrease. Never add the percentages.',
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
    stem: 'A course grade is a weighted average of the three components in the table. What is the student\'s final grade? (Options to 1 decimal place where needed.)',
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
      asking: 'What is the final grade once each part counts according to its weight?',
      solution:
        'In a **weighted average**, some parts count for more than others. The **weight** says how much each part counts. Here the weights add up to $100\\%$.\n\n' +
        'Turn each weight into a decimal by dividing by 100, then multiply it by the score. This gives each part\'s contribution to the grade:\n\n| Component | Weight | Score | Contribution |\n|---|---|---|---|\n| Quizzes | 0.2 | 90 | $0.2 \\times 90 = 18$ |\n| Project | 0.3 | 70 | $0.3 \\times 70 = 21$ |\n| Final exam | 0.5 | 60 | $0.5 \\times 60 = 30$ |\n\n' +
        'Add the contributions: $18 + 21 + 30 = 69$. There is nothing to divide by, because the weights already add up to 1.',
      conclusion: 'The three contributions add up to $69$, which is the final grade.',
      whyWrong: [
        'This is the simple mean $\\frac{90 + 70 + 60}{3} \\approx 73.3$, which treats all three components as equally important and ignores the weights.',
        null,
        'This swaps the weights of the quizzes and the final exam: $0.5 \\times 90 + 0.3 \\times 70 + 0.2 \\times 60 = 78$.',
        'This divides the weighted total 69 by 3. When the weights already add up to 1, the weighted sum **is** the average.',
      ],
      keyIdea: 'Weighted average: multiply each score by its weight as a decimal, then add. If the weights add up to 1, don\'t divide afterwards. Spot this type by a weight or percentage printed beside each score.',
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
    stem: 'The table shows the number of students and the pass rate at two schools. What percentage of **all** the students passed?',
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
      asking: 'Counting both schools together, what percentage of the students passed?',
      solution:
        'We can\'t just average $90\\%$ and $70\\%$, because the schools are different sizes. Instead, count the actual students who passed.\n\n' +
        'Find each school\'s passes by multiplying its pass rate by its number of students:\n\n| School | Working | Students who passed |\n|---|---|---|\n| School P | $0.9 \\times 80$ | 72 |\n| School Q | $0.7 \\times 120$ | 84 |\n\n' +
        'Add to get everyone who passed: $72 + 84 = 156$.\n\n' +
        'Add to get all the students: $80 + 120 = 200$.\n\n' +
        'Divide, then multiply by 100: $\\frac{156}{200} = 0.78$, and $0.78 \\times 100 = 78\\%$.',
      conclusion: '156 of the 200 students passed, which is $78\\%$.',
      whyWrong: [
        'This is $\\frac{90 + 70}{2}$, the simple average of the two pass rates. School Q is bigger, so its lower rate counts for more.',
        'This weights the rates with the school sizes swapped: $\\frac{120 \\times 0.9 + 80 \\times 0.7}{200} = 82\\%$.',
        'This adds the two percentages. A percentage of one whole group can never be more than $100\\%$.',
        null,
      ],
      keyIdea: 'To combine percentages from groups of different sizes, turn each percentage into a count, add the counts, add the group sizes, then divide. A simple average only works when the groups are the same size.',
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
      asking: 'What is the best estimate of the average time, when we only know the time groups?',
      solution:
        'We only know how many students fall in each group, not their exact times. So we estimate: pretend every student in a group took the **midpoint** time, which is halfway between the group\'s two ends.\n\n' +
        'The midpoint is the two ends added and then halved. For $0 \\le t < 10$, it is $\\frac{0 + 10}{2} = 5$.\n\n' +
        'Multiply each midpoint by the number of students to estimate each group\'s total minutes:\n\n| Group | Midpoint | Students | Midpoint times students |\n|---|---|---|---|\n| $0 \\le t < 10$ | 5 | 5 | 25 |\n| $10 \\le t < 20$ | 15 | 12 | 180 |\n| $20 \\le t < 30$ | 25 | 15 | 375 |\n| $30 \\le t < 40$ | 35 | 8 | 280 |\n\n' +
        'Add the last column to get the estimated total time: $25 + 180 + 375 + 280 = 860$ minutes.\n\n' +
        'The mean is the total time divided by the number of students, which is 40: $\\frac{860}{40} = 21.5$.',
      conclusion: '860 minutes shared between 40 students gives an estimated mean of $21.5$ minutes.',
      whyWrong: [
        null,
        'This uses the **lower** end of each class (0, 10, 20, 30) instead of the midpoint, which makes every time too small by 5 minutes.',
        'This divides 860 by the 4 classes instead of by the 40 students.',
        'This uses the **upper** end of each class (10, 20, 30, 40) instead of the midpoint, which makes every time too big by 5 minutes.',
      ],
      keyIdea: 'For a grouped table, use the midpoints as the values. Add columns for midpoint and midpoint times frequency, then divide that column\'s total by the total frequency. Spot it by ranges such as $10 \\le t < 20$ and the word "estimate".',
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
      asking: 'If all 20 students line up by number of siblings, what value is in the middle?',
      solution:
        'The **median** is the middle value when everything is in order. Each bar\'s height tells you how many students have that number of siblings.\n\n' +
        'There are 20 students, which is an even number, so there are two middle students: the 10th and the 11th. The median is halfway between their values.\n\n' +
        'Line the students up from fewest siblings to most, and see which positions each bar covers:\n\n| Siblings | Students | Positions in the line |\n|---|---|---|\n| 0 | 3 | 1st to 3rd |\n| 1 | 8 | 4th to 11th |\n| 2 | 6 | 12th to 17th |\n| 3 | 2 | 18th to 19th |\n| 4 | 1 | 20th |\n\n' +
        'The 10th and 11th students both fall in the 4th to 11th positions, so each has 1 sibling. Halfway between 1 and 1 is 1.',
      conclusion: 'Both middle students have 1 sibling, so the median is $1$.',
      whyWrong: [
        'This is the middle of the category labels $0, 1, 2, 3, 4$. The median is the middle **student**, so you must use the bar heights.',
        'This is the median of the bar heights $1, 2, 3, 6, 8$. The bar heights are counts of students, not numbers of siblings.',
        null,
        'This is the **mean**: $\\frac{0 + 8 + 12 + 6 + 4}{20} = \\frac{30}{20} = 1.5$. The question asks for the median.',
      ],
      keyIdea: 'For the median from a bar chart, find the middle position: for $n$ values it is $\\frac{n + 1}{2}$. Then add up the bars from the left until you reach that position. Read the category, not the bar height.',
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
    stem: 'A share rose from $30\\%$ to $36\\%$. What is the **percentage increase** in the share (the relative change, not the change in percentage points)?',
    options: ['$6\\%$', '$20\\%$', '$16.7\\%$', '$120\\%$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How large is the rise from $30\\%$ to $36\\%$ compared with where it started?',
      solution:
        'There are two ways to describe this rise. **Percentage points** are a plain subtraction. **Percentage increase** compares the rise with the starting value. The question wants percentage increase.\n\n' +
        'Find the rise: $36 - 30 = 6$. That is the change in percentage points, so we need one more step.\n\n' +
        'Divide by the starting share, which is 30: $\\frac{6}{30} = 0.2$.\n\n' +
        'Multiply by 100 to get a percentage: $0.2 \\times 100 = 20\\%$.',
      conclusion: 'A rise of 6 on a start of 30 is a relative increase of $20\\%$.',
      whyWrong: [
        'This is the change in **percentage points**, $36 - 30$. A percentage increase divides that change by the starting value 30.',
        null,
        'This is $\\frac{6}{36} \\times 100$: it divides by the new share (36) instead of the original share (30).',
        'This is $\\frac{36}{30} \\times 100$, the new share as a percentage of the old one. The increase is $120\\% - 100\\% = 20\\%$.',
      ],
      keyIdea: 'Percentage points: new minus old. Percentage increase: (new minus old) divided by old, times 100. When both values are already percentages, look for which of these two the question names.',
    },
    check: { optionValues: [6, 20, 16.7, 120], compute: () => ((36 - 30) / 30) * 100 },
  },
  {
    id: 'data-calculations-014',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'The table shows the population and flu cases of four towns. Which town had the **highest rate** of flu cases per 1000 people?',
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
      asking: 'Which town has the most flu cases for the size of its population?',
      solution:
        'A **rate per 1000** answers this: out of every 1000 people, how many have flu? It makes towns of different sizes fair to compare.\n\n' +
        'To find it, divide the cases by the number of thousands of people. Northfield has 80000 people, which is 80 thousands, so it has $\\frac{200}{80} = 2.5$ cases for each 1000 people.\n\n' +
        'Do the same for every town:\n\n| Town | Population in thousands | Working | Cases per 1000 |\n|---|---|---|---|\n| Northfield | 80 | $\\frac{200}{80}$ | 2.5 |\n| Southport | 50 | $\\frac{210}{50}$ | 4.2 |\n| Eastbrook | 12 | $\\frac{54}{12}$ | 4.5 |\n| Westvale | 20 | $\\frac{100}{20}$ | 5 |\n\n' +
        'Southport has the most cases, but its population is large too. The highest rate is 5 per 1000, in Westvale.',
      conclusion: 'With 5 cases per 1000 people, the highest of the four, the answer is Westvale.',
      whyWrong: [
        'Northfield has the **lowest** rate (2.5 per 1000). You get this town if you work out people per case ($80000 \\div 200 = 400$) and pick the biggest value; more people per case means a lower rate.',
        'Southport has the most cases (210), but it also has a large population, so its rate is only 4.2 per 1000. A rate must divide by the population.',
        'Eastbrook is the smallest town and has a high rate (4.5 per 1000), but not the highest: Westvale has 5 per 1000. Compute every rate before choosing.',
        null,
      ],
      keyIdea: 'To compare groups of different sizes, use rate per 1000 $= \\frac{\\text{cases}}{\\text{population}} \\times 1000$ for every row, then pick the largest. A quick way is to write the population in thousands first. Never compare raw counts.',
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
    stem: 'The line graph shows users of a service, growing by the **same percentage** every year. If this continues, how many users will there be in 2025?',
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
      asking: 'If users keep growing by the same percentage, what will the 2025 number be?',
      solution:
        'Read the line: 1600 in 2022, 2000 in 2023 and 2500 in 2024.\n\n' +
        '"Same percentage" means each year\'s value is last year\'s value times the same number, called the **multiplier**. Find it by dividing: $\\frac{2000}{1600} = 1.25$.\n\n' +
        'Test it on the next pair: $\\frac{2500}{2000} = 1.25$. They match, so users are multiplied by 1.25 each year, which is a $25\\%$ rise.\n\n' +
        'Apply it once more to the latest value: $2500 \\times 1.25 = 3125$.',
      conclusion: 'A $25\\%$ rise from 2500 gives $3125$ users in 2025.',
      whyWrong: [
        null,
        'This adds the last increase again ($2500 + 500$), which is **linear** growth. The same percentage each year means the increase itself grows.',
        'This assumes the yearly increase goes up by 100 each time ($400, 500, 600$). The rule is a constant percentage, so multiply by 1.25.',
        'This adds $25\\%$ of the **first** value ($0.25 \\times 1600 = 400$). Each year the $25\\%$ is taken of the latest value, 2500.',
      ],
      keyIdea: 'For growth at the same percentage, divide a value by the one before it to get the multiplier, test it on another pair, then multiply the latest value. Adding the last increase again would be growth by the same amount, which is different.',
    },
    check: {
      optionValues: [3125, 3000, 3100, 2900],
      compute: () => {
        const v = [1600, 2000, 2500];
        return v[2] * (v[2] / v[1]);
      },
    },
  },
  {
    id: 'data-calculations-017',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: '50 students have a mean test score of 66. The 20 in Class A have a mean score of 72. What is the mean score of the other 30, in Class B?',
    options: ['$60$', '$93$', '$62$', '$37.2$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the average score of the 30 students in Class B?',
      solution:
        'Means can\'t be subtracted directly, but totals can. A **mean** is a total shared out equally, so total $=$ mean $\\times$ number of students.\n\n' +
        'Total marks for all 50 students: $50 \\times 66 = 3300$.\n\n' +
        'Total marks for the 20 in Class A: $20 \\times 72 = 1440$.\n\n' +
        'The rest of the marks must belong to Class B: $3300 - 1440 = 1860$.\n\n' +
        'Share those marks among the 30 students in Class B: $\\frac{1860}{30} = 62$.',
      conclusion: 'Class B has 1860 marks between 30 students, so its mean is $62$.',
      whyWrong: [
        'This assumes the classes are the same size, so that 66 is exactly halfway between 72 and the answer. Class B is bigger, so its mean is closer to 66.',
        'This divides Class B\'s total, 1860, by 20 (the size of Class A) instead of by 30.',
        null,
        'This divides Class B\'s total, 1860, by all 50 students instead of by the 30 students in Class B.',
      ],
      keyIdea: 'For a missing group mean, change means into totals using total $=$ mean $\\times$ number. Subtract the known total from the overall total, then divide by the size of the missing group.',
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
    id: 'data-calculations-019',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    stem: 'A final grade is $40\\%$ coursework and $60\\%$ exam. With 65 in the coursework, what exam score (out of 100) gives a final grade of exactly 80?',
    options: ['$90$', '$95$', '$54$', '$102.5$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What exam score makes the final grade come out at exactly 80?',
      solution:
        'A weighted grade adds up each part\'s score times its weight. As decimals, the weights are 0.4 for coursework and 0.6 for the exam.\n\n' +
        'Let $x$ be the exam score we don\'t know. The grade rule gives this equation: $0.4 \\times 65 + 0.6x = 80$.\n\n' +
        'Work out the coursework part: $0.4 \\times 65 = 26$. So $26 + 0.6x = 80$.\n\n' +
        'Take 26 from both sides to leave the exam part on its own: $0.6x = 80 - 26 = 54$.\n\n' +
        'Divide both sides by 0.6 to get $x$ on its own: $x = \\frac{54}{0.6} = 90$.',
      conclusion: 'Test it: $26 + 0.6 \\times 90 = 26 + 54 = 80$. So the exam score needed is $90$.',
      whyWrong: [
        null,
        'This treats the two parts as equally weighted: $\\frac{65 + x}{2} = 80$ gives $x = 95$. The exam is worth more ($60\\%$), so less is needed.',
        'This stops at $0.6x = 54$ and forgets to divide by 0.6. 54 is the exam\'s **contribution** to the grade, not the exam score.',
        'This swaps the weights: $0.6 \\times 65 + 0.4x = 80$ gives $x = 102.5$, which is impossible for a score out of 100.',
      ],
      keyIdea: 'For "what score do I need?", write the grade as weight times score for each part, added together, with $x$ for the unknown score. Set it equal to the target, then solve for $x$. Finish by dividing by the weight.',
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

  // ---------------------------------------------------------------- recall
  {
    id: 'data-calculations-021',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'Percentage change is the change divided by which value, times 100?',
    options: ['The original value', 'The new value', 'The larger of the two values', 'The sum of the two values'],
    correctIndex: 0,
    markScheme: {
      asking: 'In percentage change, what do you divide by?',
      solution:
        'Percentage change answers one question: how big is the change compared with where we started?\n\n' +
        'Test it on a rise from 40 to 50. The change is 10, and 10 is a quarter of 40, so the rise is $25\\%$. As a calculation, that is $\\frac{10}{40} \\times 100 = 25\\%$.\n\n' +
        'The number on the bottom of that fraction is 40, the value from before the change. That is the original value.',
      conclusion: 'A change is always measured against its starting point, so the answer is The original value.',
      whyWrong: [
        null,
        'Dividing by the new value is the most common slip. For a rise from 40 to 50 it gives $20\\%$ instead of the correct $25\\%$.',
        'For a fall, the larger value happens to be the original, but for a rise it is the new value. The rule is always the original value.',
        'The sum of the two values plays no part in percentage change. The change is compared only with the starting value.',
      ],
      keyIdea: 'Percentage change $= \\frac{\\text{new} - \\text{original}}{\\text{original}} \\times 100$. Whichever way the value moved, the bottom of the fraction is the value from before the change.',
    },
  },
  {
    id: 'data-calculations-022',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'A share rises from $40\\%$ to $50\\%$. By how many **percentage points** has it risen?',
    options: ['$10$', '$25$', '$20$', '$90$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the plain gap between $40\\%$ and $50\\%$?',
      solution:
        '**Percentage points** measure the plain gap between two percentages. You just subtract, with no dividing.\n\n' +
        'Subtract the old share from the new one: $50 - 40 = 10$.',
      conclusion: 'The gap between the two shares is $10$ percentage points.',
      whyWrong: [
        null,
        'This is $\\frac{10}{40} \\times 100$, the relative (percentage) increase. Percentage points are the plain difference.',
        'This is $\\frac{10}{50} \\times 100$: a relative change divided by the new share, which is not what percentage points measure.',
        'This adds the two shares. A rise is found by subtracting.',
      ],
      keyIdea: 'Percentage points: just subtract the two percentages. Percentage increase is different: it divides that gap by the starting value, so the same rise is a $25\\%$ increase. Look for which phrase the question uses.',
    },
    check: { optionValues: [10, 25, 20, 90], compute: () => 50 - 40 },
  },
  {
    id: 'data-calculations-023',
    subtopic: 'data-calculations',
    difficulty: 'foundation',
    stem: 'What does **per capita** mean?',
    options: ['Per person', 'Per year', 'In total', 'Per household'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the phrase "per capita" mean in everyday words?',
      solution:
        '"Per" means "for each". "Capita" comes from the Latin word for "heads", so the phrase literally means "for each head".\n\n' +
        'A head stands for one person. For example, if a town of 1000 people uses 5000 litres of water, it uses $\\frac{5000}{1000} = 5$ litres for each person.',
      conclusion: '"For each head" means for each individual, so the answer is Per person.',
      whyWrong: [
        null,
        'A value per year is an annual rate. Per capita is about dividing by people, not by time.',
        'A total is the amount before any dividing. Per capita divides that total by the number of people.',
        'A household usually has several people. Per capita divides by each individual person.',
      ],
      keyIdea: 'To find a per capita value, divide the total by the number of people. It makes places of different sizes fair to compare, such as water use in a small town and in a big city.',
    },
  },
];
