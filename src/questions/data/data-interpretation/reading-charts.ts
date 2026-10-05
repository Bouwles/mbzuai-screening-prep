import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { sumOf } from '../../../lib/mathx';

// ---------------------------------------------------------------- helpers used by the answer checks

/** Index of the largest value (first one if tied). */
const argMax = (xs: number[]): number => xs.reduce((best, v, i) => (v > xs[best] ? i : best), 0);
/** Differences between consecutive values: [x1 - x0, x2 - x1, ...]. */
const steps = (xs: number[]): number[] => xs.slice(1).map((v, i) => v - xs[i]);
/** "08:52" -> minutes after midnight. */
const mins = (t: string): number => {
  const [h, mm] = t.split(':').map(Number);
  return h * 60 + mm;
};

// ---------------------------------------------------------------- raw data (shared by charts and checks)

const BOOKS_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const BOOKS = [30, 45, 20, 50, 35];

const SUBJECTS = [
  { label: 'Maths', value: 50 },
  { label: 'Science', value: 70 },
  { label: 'English', value: 40 },
  { label: 'Art', value: 40 },
];

const TEMP_TIMES = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
const TEMPS = [5, 10, 20, 25, 10, 5];

const REVISION = [
  { x: 1, y: 35 },
  { x: 2, y: 40 },
  { x: 2, y: 50 },
  { x: 3, y: 45 },
  { x: 4, y: 60 },
  { x: 5, y: 55 },
  { x: 6, y: 65 },
  { x: 7, y: 70 },
  { x: 8, y: 80 },
  { x: 9, y: 85 },
];

const FLAVOURS = ['Mango', 'Lemon', 'Berry', 'Mint', 'Peach'];
const JUICE_2023 = [20, 45, 15, 35, 40];
const JUICE_2024 = [30, 40, 35, 50, 15];

const BUDGET = [
  { label: 'Housing', value: 35 },
  { label: 'Food', value: 20 },
  { label: 'Transport', value: 15 },
  { label: 'Savings', value: 10 },
  { label: 'Other', value: 20 },
];

const PLANT_EDGES = [0, 10, 20, 30, 40, 50];
const PLANT_FREQ = [6, 8, 10, 10, 6];

const MONTHS6 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const SITE_A = [20, 25, 35, 30, 40, 45];
const SITE_B = [30, 30, 25, 35, 20, 40];

const BUS_ROWS: string[][] = [
  ['Central Station', '07:50', '08:35', '09:40'],
  ['City Mall', '08:05', '08:52', '09:58'],
  ['University', '08:21', '09:10', '10:15'],
  ['Airport', '08:47', '09:38', '10:47'],
];

const SPORT_Y10 = 24;
const SPORT_TOTAL = 50;

const FIT = { slope: 5, intercept: 40 };
const FIT_X = 7;

const STUDY = [
  { x: 1, y: 42 },
  { x: 2, y: 52 },
  { x: 3, y: 53 },
  { x: 4, y: 62 },
  { x: 5, y: 63 },
  { x: 6, y: 72 },
  { x: 8, y: 78 },
  { x: 9, y: 88 },
  { x: 10, y: 92 },
];

const SPORTS = ['Football', 'Basketball', 'Tennis', 'Swimming', 'Cricket'];
const SPORT_COUNTS = [60, 40, 20, 50, 30];

const SCHOOLS: { name: string; pass: number; fail: number }[] = [
  { name: 'A', pass: 30, fail: 10 },
  { name: 'B', pass: 78, fail: 52 },
  { name: 'C', pass: 72, fail: 18 },
  { name: 'D', pass: 84, fail: 36 },
];

const HOURS = ['0 h', '1 h', '2 h', '3 h', '4 h', '5 h'];
const DISTANCE = [0, 50, 150, 150, 200, 250];

const TOWNS: { name: string; y2015: number; y2025: number }[] = [
  { name: 'A', y2015: 1500, y2025: 2400 },
  { name: 'B', y2015: 6000, y2025: 7500 },
  { name: 'C', y2015: 400, y2025: 720 },
  { name: 'D', y2015: 9000, y2025: 9600 },
];

const PUZZLE_EDGES = [0, 10, 20, 30, 40, 50];
const PUZZLE_FREQ = [5, 15, 20, 10, 10];

const TRAVEL_ANGLES = [
  { label: 'Walk', value: 120 },
  { label: 'Bus', value: 105 },
  { label: 'Car', value: 90 },
  { label: 'Cycle', value: 45 },
];

const APP_TOTAL = [5, 15, 20, 35, 45, 50];

const TESTS = [
  { x: 20, y: 30 },
  { x: 25, y: 20 },
  { x: 30, y: 35 },
  { x: 35, y: 30 },
  { x: 40, y: 45 },
  { x: 45, y: 35 },
  { x: 15, y: 25 },
  { x: 30, y: 20 },
  { x: 40, y: 50 },
  { x: 45, y: 50 },
  { x: 35, y: 35 },
];

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'reading-charts-001',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'The bar chart shows the number of books borrowed from a school library on each day of one week. How many **more** books were borrowed on Thursday than on Wednesday?',
    chart: {
      kind: 'bar',
      title: 'Books borrowed per day',
      xLabel: 'Day',
      yLabel: 'Books borrowed',
      categories: BOOKS_DAYS,
      series: [{ name: 'Books', values: BOOKS }],
    },
    options: ['$15$', '$30$', '$70$', '$2.5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: read the two bars.** The gridlines are every 10 books.\n\n' +
        '- Thursday\'s bar reaches the 50 line, so 50 books.\n' +
        '- Wednesday\'s bar reaches the 20 line, so 20 books.\n\n' +
        '**Step 2: "how many more" means subtract.**\n\n' +
        '$$50 - 20 = 30$$\n\n' +
        'So 30 more books were borrowed on Thursday.',
      whyWrong: [
        'This is $50 - 35$: it compares Thursday with Friday (the bar next to it) instead of with Wednesday.',
        null,
        'This is $50 + 20$: it adds the two days. "How many more" asks for the difference, so you subtract.',
        'This is $50 \\div 20$, which says how many **times** as many books were borrowed. "How many more" asks for a difference, not a ratio.',
      ],
      keyIdea: 'Read each bar against the gridlines, then "how many more" means subtract the smaller value from the larger.',
    },
    check: {
      optionValues: [15, 30, 70, 2.5],
      compute: () => BOOKS[BOOKS_DAYS.indexOf('Thu')] - BOOKS[BOOKS_DAYS.indexOf('Wed')],
    },
  },
  {
    id: 'reading-charts-002',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'Every student in a year group chose one favourite subject. The pie chart shows the **number** of students choosing each subject. What fraction of the students chose Science?',
    chart: { kind: 'pie', title: 'Favourite subject (number of students)', slices: SUBJECTS },
    options: ['$\\frac{7}{13}$', '$\\frac{7}{10}$', '$\\frac{1}{4}$', '$\\frac{7}{20}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: find the total.** Add every slice:\n\n' +
        '$$50 + 70 + 40 + 40 = 200 \\text{ students}$$\n\n' +
        '**Step 2: write Science as a fraction of the total.**\n\n' +
        '$$\\frac{70}{200} = \\frac{7}{20}$$\n\n' +
        '(Divide top and bottom by 10.) As a check, $\\frac{7}{20} = 0.35 = 35\\%$, and the Science slice is a bit more than a third of the circle.',
      whyWrong: [
        'This is $\\frac{70}{130}$: it divides by the students who did **not** choose Science ($50 + 40 + 40 = 130$) instead of by all 200 students.',
        'This is $\\frac{70}{100}$: it assumes the total is 100. Always add up the slices to find the real total, here 200.',
        'This assumes all four slices are the same size, so each is a quarter. The slices are different sizes; Science is the biggest.',
        null,
      ],
      keyIdea: 'A slice\'s share of a pie chart is its value divided by the total of all the slices.',
    },
    check: {
      optionValues: [7 / 13, 7 / 10, 1 / 4, 7 / 20],
      compute: () =>
        new Frac(
          SUBJECTS.find((s) => s.label === 'Science')!.value,
          sumOf(SUBJECTS.map((s) => s.value)),
        ).value(),
    },
  },
  {
    id: 'reading-charts-003',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'The line graph shows the temperature in a desert town, measured every 3 hours on one day. Between which two consecutive readings did the temperature **rise** the most?',
    chart: {
      kind: 'line',
      title: 'Temperature during one day',
      xLabel: 'Time',
      yLabel: 'Temperature (°C)',
      categories: TEMP_TIMES,
      series: [{ name: 'Temperature', values: TEMPS }],
    },
    options: ['12:00 and 15:00', '15:00 and 18:00', '09:00 and 12:00', '06:00 and 09:00'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: read every point** (gridlines every 5 °C): 5, 10, 20, 25, 10, 5.\n\n' +
        '**Step 2: work out the change between each pair of neighbouring readings.**\n\n' +
        '| Interval | Change |\n' +
        '| --- | --- |\n' +
        '| 06:00 to 09:00 | $10 - 5 = 5$ |\n' +
        '| 09:00 to 12:00 | $20 - 10 = 10$ |\n' +
        '| 12:00 to 15:00 | $25 - 20 = 5$ |\n' +
        '| 15:00 to 18:00 | $10 - 25 = -15$ |\n' +
        '| 18:00 to 21:00 | $5 - 10 = -5$ |\n\n' +
        '**Step 3: pick the biggest positive change.** The largest rise is 10 °C, between 09:00 and 12:00. On the graph this is the **steepest upward** section of the line.',
      whyWrong: [
        'The temperature reaches its **highest** value at 15:00, but the rise from 12:00 to 15:00 is only 5 °C. The highest point is not the same as the biggest rise.',
        'This is the biggest **change** (15 °C), but it is a **fall** from 25 °C to 10 °C, not a rise. The line goes down here.',
        null,
        'The temperature does rise here, but only by 5 °C (from 5 to 10), half the rise between 09:00 and 12:00.',
      ],
      keyIdea: 'The largest increase is the steepest upward segment of a line graph: subtract each reading from the next one and pick the biggest positive difference.',
    },
    check: {
      optionValues: ['12:00 and 15:00', '15:00 and 18:00', '09:00 and 12:00', '06:00 and 09:00'],
      compute: () => {
        const i = argMax(steps(TEMPS));
        return `${TEMP_TIMES[i]} and ${TEMP_TIMES[i + 1]}`;
      },
    },
  },
  {
    id: 'reading-charts-004',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'The table shows how many students in Years 10 and 11 joined each club. One value is missing. How many Year 11 students joined the Sport club?',
    table: {
      headers: ['Club', 'Year 10', 'Year 11', 'Total'],
      rows: [
        ['Sport', SPORT_Y10, '?', SPORT_TOTAL],
        ['Music', 18, 22, 40],
        ['Drama', 15, 10, 25],
      ],
    },
    options: ['$74$', '$26$', '$25$', '$22$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'In the Sport row, the Year 10 and Year 11 numbers must add up to the row total.\n\n' +
        '$$24 + ? = 50$$\n\n' +
        'Subtract to find the missing value:\n\n' +
        '$$? = 50 - 24 = 26$$\n\n' +
        'Check: $24 + 26 = 50$. ✓',
      whyWrong: [
        'This is $24 + 50$: it adds the Year 10 value to the total. The total already includes Year 10, so you must subtract.',
        null,
        'This is $50 \\div 2$: it assumes the 50 Sport students are split equally between the two years. The table says 24 are in Year 10, so the split is not equal.',
        'This is the Year 11 value from the **Music** row: it reads the right column but the wrong row.',
      ],
      keyIdea: 'In a table with totals, a missing value is the total minus the other values in the same row (or column).',
    },
    check: { optionValues: [74, 26, 25, 22], compute: () => SPORT_TOTAL - SPORT_Y10 },
  },
  {
    id: 'reading-charts-005',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'The scatter plot shows the number of hours ten students spent revising and their score in a test. Which statement is best supported by the scatter plot?',
    chart: {
      kind: 'scatter',
      title: 'Revision time and test score',
      xLabel: 'Hours of revision',
      yLabel: 'Test score',
      points: REVISION,
    },
    options: [
      'As revision time increases, test scores tend to increase.',
      'As revision time increases, test scores tend to decrease.',
      'Every student who revised for longer scored higher than every student who revised for less time.',
      'There is no relationship between revision time and test score.',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: look at the overall direction of the points.** Reading from left to right, the points go **up**: students with few hours (1 or 2 h) scored around 35 to 50, and students with many hours (8 or 9 h) scored around 80 to 85.\n\n' +
        'This upward pattern is called **positive correlation**: as one variable increases, the other **tends** to increase.\n\n' +
        '**Step 2: check the strong claims.** "Tends to" allows exceptions, but "every" does not. The student who revised 5 hours scored 55, **less** than the student who revised 4 hours (60). So "every student who revised longer scored higher" is false.\n\n' +
        'The best supported statement is that scores **tend to increase** as revision time increases.',
      whyWrong: [
        null,
        'That would be **negative** correlation, where the points slope **down** from left to right. Here they slope up.',
        'Correlation describes a general trend, not a rule for every pair. The student with 5 hours (55) scored lower than the student with 4 hours (60), so "every" is false.',
        'With no relationship the points would be scattered randomly. Here they clearly follow an upward pattern.',
      ],
      keyIdea: 'Points rising from left to right show positive correlation: a tendency, not a guarantee for every individual.',
    },
  },

  // ================================================================ exam
  {
    id: 'reading-charts-006',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'A juice bar sells five flavours. The grouped bar chart shows how many cups (in hundreds) of each flavour were sold in 2023 and in 2024. Which flavour had the **largest increase** in sales from 2023 to 2024?',
    chart: {
      kind: 'bar',
      title: 'Cups sold (hundreds)',
      xLabel: 'Flavour',
      yLabel: 'Cups sold (hundreds)',
      categories: FLAVOURS,
      series: [
        { name: '2023', values: JUICE_2023 },
        { name: '2024', values: JUICE_2024 },
      ],
    },
    options: ['Mint', 'Peach', 'Berry', 'Lemon'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: read both bars for every flavour** (gridlines every 10; bars ending halfway between two lines are worth 5 more).\n\n' +
        '**Step 2: change = 2024 value minus 2023 value.**\n\n' +
        '| Flavour | 2023 | 2024 | Change |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Mango | 20 | 30 | $+10$ |\n' +
        '| Lemon | 45 | 40 | $-5$ |\n' +
        '| Berry | 15 | 35 | $+20$ |\n' +
        '| Mint | 35 | 50 | $+15$ |\n' +
        '| Peach | 40 | 15 | $-25$ |\n\n' +
        '**Step 3: pick the biggest positive change.** Berry increased by 20 hundred cups, more than any other flavour.',
      whyWrong: [
        'Mint has the **tallest** 2024 bar (50), but it only increased by $50 - 35 = 15$. The highest value is not the same as the largest increase.',
        'Peach has the biggest **change** (25), but it is a **decrease**, from 40 down to 15.',
        null,
        'Lemon has the tallest 2023 bar (45), but its sales actually fell by 5 in 2024.',
      ],
      keyIdea: 'For "largest increase", compute (new value minus old value) for every category and choose the biggest positive result, not the tallest bar.',
    },
    check: {
      optionValues: ['Mint', 'Peach', 'Berry', 'Lemon'],
      compute: () => FLAVOURS[argMax(JUICE_2024.map((v, i) => v - JUICE_2023[i]))],
    },
  },
  {
    id: 'reading-charts-007',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'A family\'s monthly budget is AED 12,000. The pie chart shows the **percentage** of the budget spent on each category. How much more does the family spend on Housing than on Transport each month?',
    chart: { kind: 'pie', title: 'Monthly budget (%)', slices: BUDGET },
    options: ['AED 4,200', 'AED 6,000', 'AED 1,800', 'AED 2,400'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: read the two percentages.** Housing is 35% and Transport is 15%.\n\n' +
        '**Step 2: find the difference in percentage points.**\n\n' +
        '$$35\\% - 15\\% = 20\\%$$\n\n' +
        '**Step 3: convert to money.** 20% of AED 12,000:\n\n' +
        '$$0.20 \\times 12000 = 2400$$\n\n' +
        'So the family spends AED 2,400 more on Housing.\n\n' +
        '(Check the long way: Housing $= 0.35 \\times 12000 = 4200$, Transport $= 0.15 \\times 12000 = 1800$, and $4200 - 1800 = 2400$.)',
      whyWrong: [
        'This is the Housing amount on its own ($0.35 \\times 12000$). You still need to subtract the Transport amount.',
        'This is $50\\%$ of the budget: it **adds** the two percentages ($35\\% + 15\\%$) instead of subtracting them.',
        'This is the Transport amount on its own ($0.15 \\times 12000$), not the difference.',
        null,
      ],
      keyIdea: 'To compare two slices of a percentage pie chart in money, subtract the percentages and then take that percentage of the total.',
    },
    check: {
      optionValues: [4200, 6000, 1800, 2400],
      compute: () => {
        const pct = (l: string) => BUDGET.find((s) => s.label === l)!.value;
        return ((pct('Housing') - pct('Transport')) / 100) * 12000;
      },
    },
  },
  {
    id: 'reading-charts-008',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The histogram shows the heights of the plants in a greenhouse. Each class includes its lower boundary but not its upper boundary (for example, the first bar is $0 \\le h < 10$). What percentage of the plants are **at least 20 cm** tall?',
    chart: {
      kind: 'histogram',
      title: 'Plant heights',
      xLabel: 'Height, h (cm)',
      yLabel: 'Frequency',
      edges: PLANT_EDGES,
      frequencies: PLANT_FREQ,
    },
    options: ['$50\\%$', '$65\\%$', '$35\\%$', '$26\\%$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: read every bar** (gridlines every 2 plants):\n\n' +
        '| Height (cm) | 0 to 10 | 10 to 20 | 20 to 30 | 30 to 40 | 40 to 50 |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| Frequency | 6 | 8 | 10 | 10 | 6 |\n\n' +
        '**Step 2: total number of plants.** $6 + 8 + 10 + 10 + 6 = 40$.\n\n' +
        '**Step 3: plants at least 20 cm tall** are in the last three classes: $10 + 10 + 6 = 26$.\n\n' +
        '**Step 4: convert to a percentage.**\n\n' +
        '$$\\frac{26}{40} \\times 100\\% = 65\\%$$',
      whyWrong: [
        'This counts only the 20 to 30 and 30 to 40 classes ($\\frac{20}{40}$) and forgets the 40 to 50 class, which is also at least 20 cm.',
        null,
        'This is the percentage **below** 20 cm ($\\frac{6 + 8}{40}$): the wrong side of 20.',
        'This is the **number** of plants (26) written as a percentage. You must divide by the total of 40 plants and multiply by 100.',
      ],
      keyIdea: 'In a histogram the height of each bar is a frequency: add the bars you need and divide by the total of all bars.',
    },
    check: {
      optionValues: [50, 65, 35, 26],
      compute: () => {
        const tall = PLANT_FREQ.filter((_, i) => PLANT_EDGES[i] >= 20);
        return (sumOf(tall) / sumOf(PLANT_FREQ)) * 100;
      },
    },
  },
  {
    id: 'reading-charts-009',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The line graph shows the monthly number of visitors (in thousands) to two websites. In which month was the **difference** between the numbers of visitors to the two sites the greatest?',
    chart: {
      kind: 'line',
      title: 'Monthly visitors (thousands)',
      xLabel: 'Month',
      yLabel: 'Visitors (thousands)',
      categories: MONTHS6,
      series: [
        { name: 'Site A', values: SITE_A },
        { name: 'Site B', values: SITE_B },
      ],
    },
    options: ['May', 'June', 'January', 'March'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: read both lines for each month** (gridlines every 10 thousand; points halfway between lines are worth 5).\n\n' +
        '**Step 2: find the gap (bigger minus smaller) each month.**\n\n' +
        '| Month | Site A | Site B | Gap |\n' +
        '| --- | --- | --- | --- |\n' +
        '| Jan | 20 | 30 | 10 |\n' +
        '| Feb | 25 | 30 | 5 |\n' +
        '| Mar | 35 | 25 | 10 |\n' +
        '| Apr | 30 | 35 | 5 |\n' +
        '| May | 40 | 20 | 20 |\n' +
        '| Jun | 45 | 40 | 5 |\n\n' +
        '**Step 3:** the biggest gap is 20 thousand, in **May**. On the graph, it is the month where the two lines are furthest apart vertically.',
      whyWrong: [
        null,
        'In June both sites have their highest values, but the lines are close together there: the gap is only $45 - 40 = 5$ thousand.',
        'In January Site B is ahead by 10 thousand, its biggest lead, but the gap in May (20 thousand) is twice as large.',
        'March is just after the lines cross, which catches the eye, but the gap there is only $35 - 25 = 10$ thousand.',
      ],
      keyIdea: 'The difference between two lines is the vertical distance between them: find the month where they are furthest apart, regardless of which is on top.',
    },
    check: {
      optionValues: ['May', 'June', 'January', 'March'],
      compute: () => {
        const full = ['January', 'February', 'March', 'April', 'May', 'June'];
        return full[argMax(SITE_A.map((a, i) => Math.abs(a - SITE_B[i])))];
      },
    },
  },
  {
    id: 'reading-charts-010',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The table is part of a bus timetable. Amira arrives at the City Mall stop at 08:40 and catches the **next** bus to the Airport. How long is her bus journey from City Mall to the Airport?',
    table: {
      caption: 'Bus times at each stop',
      headers: ['Stop', 'Bus 1', 'Bus 2', 'Bus 3'],
      rows: BUS_ROWS,
    },
    options: ['42 minutes', '58 minutes', '46 minutes', '63 minutes'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: find the next bus.** At City Mall, Bus 1 leaves at 08:05 (already gone at 08:40), so the next one is **Bus 2 at 08:52**.\n\n' +
        '**Step 2: read down the Bus 2 column** to the Airport row: Bus 2 arrives at **09:38**.\n\n' +
        '**Step 3: find the time between 08:52 and 09:38.**\n\n' +
        '- 08:52 to 09:00 is 8 minutes.\n' +
        '- 09:00 to 09:38 is 38 minutes.\n\n' +
        '$$8 + 38 = 46 \\text{ minutes}$$',
      whyWrong: [
        'This is the journey time of **Bus 1** (08:05 to 08:47), which had already left City Mall before Amira arrived at 08:40.',
        'This counts from 08:40, when Amira arrived at the stop, so it includes her 12 minutes of waiting. The bus journey starts at 08:52.',
        null,
        'This is the time from **Central Station** (08:35) to the Airport (09:38): it uses the wrong row as the starting stop.',
      ],
      keyIdea: 'In a timetable each column is one bus: find the right column first, then subtract the times in the two rows you need.',
    },
    check: {
      optionValues: [42, 58, 46, 63],
      compute: () => {
        const mall = BUS_ROWS[1];
        const airport = BUS_ROWS[3];
        // first bus leaving City Mall at or after 08:40
        let col = 1;
        while (mins(mall[col]) < mins('08:40')) col++;
        return mins(airport[col]) - mins(mall[col]);
      },
    },
  },
  {
    id: 'reading-charts-011',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The scatter plot shows hours studied, $x$, and test score, $y$, for nine students. The dashed line of best fit has equation $y = 5x + 40$. Use the line to estimate the score of a student who studies for 7 hours.',
    chart: {
      kind: 'scatter',
      title: 'Hours studied and test score',
      xLabel: 'Hours studied, x',
      yLabel: 'Test score, y',
      points: STUDY,
      line: FIT,
    },
    options: ['$35$', '$47$', '$285$', '$75$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: substitute $x = 7$ into the equation of the line.**\n\n' +
        '$$y = 5 \\times 7 + 40$$\n\n' +
        '**Step 2: multiply first, then add.**\n\n' +
        '$$y = 35 + 40 = 75$$\n\n' +
        '**Step 3: sanity check with the graph.** At 6 hours the points are around 70 and at 8 hours around 78 to 80, so 75 at 7 hours fits. Also 7 hours is inside the range of the data (1 to 10 hours), so the estimate is reasonable (interpolation).',
      whyWrong: [
        'This is just $5 \\times 7$: it forgets to add the intercept 40.',
        'This is $7 + 40$: it adds the hours instead of multiplying them by the gradient 5.',
        'This is $40 \\times 7 + 5$: it swaps the gradient and the intercept. A test score of 285 is far off the graph, which is a warning sign.',
        null,
      ],
      keyIdea: 'To estimate from a line of best fit, substitute the given $x$ into $y = mx + c$; check the result looks right on the graph.',
    },
    check: { optionValues: [35, 47, 285, 75], compute: () => FIT.slope * FIT_X + FIT.intercept },
  },
  {
    id: 'reading-charts-012',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'Every student in a year group chose one favourite sport. The bar chart shows the results. What percentage of the students chose Basketball **or** Swimming?',
    chart: {
      kind: 'bar',
      title: 'Favourite sport',
      xLabel: 'Sport',
      yLabel: 'Number of students',
      categories: SPORTS,
      series: [{ name: 'Students', values: SPORT_COUNTS }],
    },
    options: ['$45\\%$', '$90\\%$', '$22.5\\%$', '$25\\%$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: read every bar** (gridlines every 20; halfway between two lines is worth 10 more): Football 60, Basketball 40, Tennis 20, Swimming 50, Cricket 30.\n\n' +
        '**Step 2: total number of students.** $60 + 40 + 20 + 50 + 30 = 200$.\n\n' +
        '**Step 3: students who chose Basketball or Swimming.** "Or" here means add the two groups: $40 + 50 = 90$.\n\n' +
        '**Step 4: percentage.**\n\n' +
        '$$\\frac{90}{200} \\times 100\\% = 45\\%$$',
      whyWrong: [
        null,
        'This is the **number** of students (90) written as a percentage. You must divide by the total of 200 students.',
        'This is the **average** of the two separate percentages, Basketball $20\\%$ and Swimming $25\\%$. For "Basketball or Swimming" you add them: $20\\% + 25\\% = 45\\%$.',
        'This is Swimming alone ($\\frac{50}{200}$). It forgets to include the Basketball students.',
      ],
      keyIdea: 'A percentage of the total needs the total: add all the bars first, then divide the bars you want by that total.',
    },
    check: {
      optionValues: [45, 90, 22.5, 25],
      compute: () => {
        const c = (s: string) => SPORT_COUNTS[SPORTS.indexOf(s)];
        return ((c('Basketball') + c('Swimming')) / sumOf(SPORT_COUNTS)) * 100;
      },
    },
  },
  {
    id: 'reading-charts-013',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The table shows how many students passed and failed the same exam at four schools. Which school had the highest **pass rate** (the percentage of its own students who passed)?',
    table: {
      headers: ['School', 'Passed', 'Failed'],
      rows: SCHOOLS.map((s) => [s.name, s.pass, s.fail]),
    },
    options: ['School D', 'School A', 'School B', 'School C'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The schools have different numbers of students, so compare **rates**, not raw counts.\n\n' +
        '**Step 1: total students at each school = passed + failed.**\n\n' +
        '**Step 2: pass rate = passed $\\div$ total.**\n\n' +
        '| School | Total | Pass rate |\n' +
        '| --- | --- | --- |\n' +
        '| A | $30 + 10 = 40$ | $\\frac{30}{40} = 75\\%$ |\n' +
        '| B | $78 + 52 = 130$ | $\\frac{78}{130} = 60\\%$ |\n' +
        '| C | $72 + 18 = 90$ | $\\frac{72}{90} = 80\\%$ |\n' +
        '| D | $84 + 36 = 120$ | $\\frac{84}{120} = 70\\%$ |\n\n' +
        '**Step 3:** School C has the highest pass rate, 80%.',
      whyWrong: [
        'School D has the **most** passes (84), but it is also a big school: $\\frac{84}{120} = 70\\%$. A larger count is not a larger rate.',
        'School A has the **fewest** fails (10), but it is a small school; its pass rate is $\\frac{30}{40} = 75\\%$, below School C.',
        'School B has the most students in total (130), but size is not success: its pass rate $\\frac{78}{130} = 60\\%$ is the lowest of all.',
        null,
      ],
      keyIdea: 'When groups have different sizes, compare them with rates (part divided by the group total), never with raw counts.',
    },
    check: {
      optionValues: ['School D', 'School A', 'School B', 'School C'],
      compute: () => `School ${SCHOOLS[argMax(SCHOOLS.map((s) => s.pass / (s.pass + s.fail)))].name}`,
    },
  },
  {
    id: 'reading-charts-014',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'A car leaves home and drives away along a straight road. The line graph shows its distance from home, recorded every hour. During which one-hour period was the car travelling **fastest**?',
    chart: {
      kind: 'line',
      title: 'Distance from home',
      xLabel: 'Time since leaving home',
      yLabel: 'Distance from home (km)',
      categories: HOURS,
      series: [{ name: 'Distance', values: DISTANCE }],
    },
    options: ['Between 4 h and 5 h', 'Between 1 h and 2 h', 'Between 2 h and 3 h', 'Between 0 h and 1 h'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Speed is distance covered per hour, so in each one-hour period find **how much the distance increased**. On the graph, faster means a **steeper** line.\n\n' +
        '| Period | Distance covered |\n' +
        '| --- | --- |\n' +
        '| 0 h to 1 h | from $0$ to $50$: $50$ km |\n' +
        '| 1 h to 2 h | $150 - 50 = 100$ km |\n' +
        '| 2 h to 3 h | $150 - 150 = 0$ km |\n' +
        '| 3 h to 4 h | $200 - 150 = 50$ km |\n' +
        '| 4 h to 5 h | $250 - 200 = 50$ km |\n\n' +
        'The car covered the most distance, 100 km, between 1 h and 2 h, so that is when it was fastest (100 km/h).',
      whyWrong: [
        'At 5 h the car is **furthest** from home, but in that hour it only covered 50 km. Being far away is not the same as moving fast.',
        null,
        'The line is **flat** here (150 km at both times), so the car did not move at all: it was stopped.',
        'In the first hour the car covered only 50 km, half of the 100 km covered between 1 h and 2 h.',
      ],
      keyIdea: 'On a distance-time graph the steepness (gradient) shows speed: the steepest section is the fastest, and a flat section means stopped.',
    },
    check: {
      optionValues: ['Between 4 h and 5 h', 'Between 1 h and 2 h', 'Between 2 h and 3 h', 'Between 0 h and 1 h'],
      compute: () => {
        const i = argMax(steps(DISTANCE));
        return `Between ${HOURS[i]} and ${HOURS[i + 1]}`;
      },
    },
  },

  // ================================================================ challenge
  {
    id: 'reading-charts-015',
    subtopic: 'reading-charts',
    difficulty: 'challenge',
    stem: 'The table shows the populations of four towns in 2015 and in 2025. What was the **largest percentage increase** in population among the four towns? (Where needed, percentages are given to 1 decimal place.)',
    table: {
      headers: ['Town', '2015', '2025'],
      rows: TOWNS.map((t) => [t.name, t.y2015, t.y2025]),
    },
    options: ['$180\\%$', '$25\\%$', '$80\\%$', '$44.4\\%$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Percentage increase $= \\dfrac{\\text{new} - \\text{old}}{\\text{old}} \\times 100\\%$, always dividing by the **old** (2015) value.\n\n' +
        '| Town | Increase | Percentage increase |\n' +
        '| --- | --- | --- |\n' +
        '| A | $2400 - 1500 = 900$ | $\\frac{900}{1500} \\times 100\\% = 60\\%$ |\n' +
        '| B | $7500 - 6000 = 1500$ | $\\frac{1500}{6000} \\times 100\\% = 25\\%$ |\n' +
        '| C | $720 - 400 = 320$ | $\\frac{320}{400} \\times 100\\% = 80\\%$ |\n' +
        '| D | $9600 - 9000 = 600$ | $\\frac{600}{9000} \\times 100\\% \\approx 6.7\\%$ |\n\n' +
        'The largest percentage increase is Town C\'s, $80\\%$, even though Town C is the smallest town and has the smallest increase in actual people. Small starting values can give big percentages.',
      whyWrong: [
        'This is $\\frac{720}{400} = 1.8$ written as $180\\%$: it is the **new value as a percentage of the old**, not the increase. The increase is $180\\% - 100\\% = 80\\%$.',
        'This is the percentage increase of Town B, which had the largest increase in **people** (1500). The largest actual increase is not the largest percentage increase.',
        null,
        'This is $\\frac{320}{720} \\times 100\\%$: it divides Town C\'s increase by the **new** value. Percentage change always divides by the original (old) value.',
      ],
      keyIdea: 'Percentage increase divides the change by the old value, so a small town can have the biggest percentage growth even with the smallest change in numbers.',
    },
    check: {
      optionValues: [180, 25, 80, 44.4],
      compute: () => Math.max(...TOWNS.map((t) => ((t.y2025 - t.y2015) / t.y2015) * 100)),
    },
  },
  {
    id: 'reading-charts-016',
    subtopic: 'reading-charts',
    difficulty: 'challenge',
    stem: 'The histogram shows the time taken by a group of people to finish a puzzle. Each class includes its lower boundary but not its upper boundary. Assuming the times are spread evenly within each class, estimate how many people took **more than 25 minutes**.',
    chart: {
      kind: 'histogram',
      title: 'Time to finish the puzzle',
      xLabel: 'Time (minutes)',
      yLabel: 'Frequency',
      edges: PUZZLE_EDGES,
      frequencies: PUZZLE_FREQ,
    },
    options: ['$30$', '$20$', '$40$', '$25$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: read the bars** (gridlines every 5 people):\n\n' +
        '| Time (min) | 0 to 10 | 10 to 20 | 20 to 30 | 30 to 40 | 40 to 50 |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| Frequency | 5 | 15 | 20 | 10 | 10 |\n\n' +
        '**Step 2: whole classes above 25 minutes.** The 30 to 40 and 40 to 50 classes are entirely above 25: $10 + 10 = 20$ people.\n\n' +
        '**Step 3: the split class.** 25 minutes is in the middle of the 20 to 30 class. The part above 25 is 5 minutes out of the class width of 10 minutes, so take that fraction of its frequency:\n\n' +
        '$$\\frac{30 - 25}{30 - 20} \\times 20 = \\frac{5}{10} \\times 20 = 10$$\n\n' +
        '**Step 4: add.** $20 + 10 = 30$ people (an estimate, because we assumed even spread inside the class).',
      whyWrong: [
        null,
        'This counts only the classes completely above 30 minutes and leaves out the people between 25 and 30 minutes.',
        'This includes the **whole** 20 to 30 class, but the people between 20 and 25 minutes did not take more than 25 minutes.',
        'This takes only 5 people from the 20 to 30 class, using the 5 minutes as a number of people. The 5 minutes is half of the class **width** (10), so you need half of the class **frequency** (20), which is 10.',
      ],
      keyIdea: 'When a boundary falls inside a class, take the fraction of the class width that you need and apply it to that class\'s frequency.',
    },
    check: {
      optionValues: [30, 20, 40, 25],
      compute: () => {
        const cut = 25;
        let total = 0;
        PUZZLE_FREQ.forEach((f, i) => {
          const lo = PUZZLE_EDGES[i];
          const hi = PUZZLE_EDGES[i + 1];
          const overlap = Math.max(0, hi - Math.max(lo, cut));
          total += (f * overlap) / (hi - lo);
        });
        return total;
      },
    },
  },
  {
    id: 'reading-charts-017',
    subtopic: 'reading-charts',
    difficulty: 'challenge',
    stem: '240 students were asked how they travel to school. The pie chart shows the **angle** (in degrees) of each sector. How many more students walk than cycle?',
    chart: { kind: 'pie', title: 'Travel to school: sector angles (degrees)', slices: TRAVEL_ANGLES },
    options: ['$50$', '$75$', '$112.5$', '$80$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The whole circle, $360^\\circ$, represents all 240 students.\n\n' +
        '**Step 1: students per degree.** $\\frac{240}{360} = \\frac{2}{3}$ of a student per degree.\n\n' +
        '**Step 2: difference in angle.** Walk $120^\\circ$, Cycle $45^\\circ$, so the difference is $120^\\circ - 45^\\circ = 75^\\circ$.\n\n' +
        '**Step 3: convert the angle to students.**\n\n' +
        '$$75 \\times \\frac{240}{360} = 75 \\times \\frac{2}{3} = 50$$\n\n' +
        'Check the long way: Walk $= \\frac{120}{360} \\times 240 = 80$, Cycle $= \\frac{45}{360} \\times 240 = 30$, and $80 - 30 = 50$.',
      whyWrong: [
        null,
        'This is the difference in **degrees** ($120 - 45$). Angles are not numbers of students: you must multiply by $\\frac{240}{360}$.',
        'This converts the wrong way: $75 \\times \\frac{360}{240}$. Since 240 students share 360 degrees, each degree is **less** than one student, so the answer must be smaller than 75.',
        'This is the number of students who walk ($\\frac{120}{360} \\times 240$). It forgets to subtract the 30 students who cycle.',
      ],
      keyIdea: 'In a pie chart, students = (angle $\\div 360$) $\\times$ total, so convert angles to counts before answering a "how many" question.',
    },
    check: {
      optionValues: [50, 75, 112.5, 80],
      compute: () => {
        const ang = (l: string) => TRAVEL_ANGLES.find((s) => s.label === l)!.value;
        return new Frac(ang('Walk') - ang('Cycle'), 360).mul(240).value();
      },
    },
  },
  {
    id: 'reading-charts-018',
    subtopic: 'reading-charts',
    difficulty: 'challenge',
    stem: 'A new app launched on 1 January. The line graph shows the **total** number of users (in thousands) at the end of each month, counting everyone who has joined since launch. In which month did the **most new users** join?',
    chart: {
      kind: 'line',
      title: 'Total users since launch (thousands)',
      xLabel: 'End of month',
      yLabel: 'Total users (thousands)',
      categories: MONTHS6,
      series: [{ name: 'Total users', values: APP_TOTAL }],
    },
    options: ['June', 'February', 'March', 'April'],
    correctIndex: 3,
    markScheme: {
      solution:
        'This is a **running total** (cumulative) graph. The number who joined **during** a month is the total at the end of that month minus the total at the end of the month before.\n\n' +
        '**Step 1: read the points** (gridlines every 10 thousand): 5, 15, 20, 35, 45, 50.\n\n' +
        '**Step 2: new users each month.**\n\n' +
        '| Month | Total at end | New users |\n' +
        '| --- | --- | --- |\n' +
        '| Jan | 5 | $5$ (the total started at $0$) |\n' +
        '| Feb | 15 | $15 - 5 = 10$ |\n' +
        '| Mar | 20 | $20 - 15 = 5$ |\n' +
        '| Apr | 35 | $35 - 20 = 15$ |\n' +
        '| May | 45 | $45 - 35 = 10$ |\n' +
        '| Jun | 50 | $50 - 45 = 5$ |\n\n' +
        '**Step 3:** the most new users (15 thousand) joined in **April**: the steepest part of the graph, from the March point to the April point.',
      whyWrong: [
        'June has the **highest point**, but that is the running total. Only 5 thousand new users joined in June, so the graph is almost flat there.',
        'February is when the total grew by the biggest **percentage** of any month after January (it tripled from 5 to 15), but only 10 thousand people joined, fewer than the 15 thousand in April.',
        'The steepest segment runs **from** the March point **to** the April point. Each point is an end-of-month total, so that rise happened during April, not March (only 5 thousand joined in March).',
        null,
      ],
      keyIdea: 'On a cumulative (running total) graph, the amount added in each period is the rise between consecutive points, so the steepest segment shows the busiest period.',
    },
    check: {
      optionValues: ['June', 'February', 'March', 'April'],
      compute: () => {
        const full = ['January', 'February', 'March', 'April', 'May', 'June'];
        return full[argMax(steps([0, ...APP_TOTAL]))];
      },
    },
  },
  {
    id: 'reading-charts-019',
    subtopic: 'reading-charts',
    difficulty: 'challenge',
    stem: 'Eleven students took two tests, each marked out of 50. Each point shows one student\'s Test 1 mark ($x$) and Test 2 mark ($y$). The dashed line is $y = x$. How many students scored **strictly higher** on Test 2 than on Test 1?',
    chart: {
      kind: 'scatter',
      title: 'Test 1 and Test 2 marks',
      xLabel: 'Test 1 mark, x',
      yLabel: 'Test 2 mark, y',
      points: TESTS,
      line: { slope: 1, intercept: 0 },
    },
    options: ['$7$', '$6$', '$4$', '$5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'On the line $y = x$ the two marks are equal. A point **above** the line has $y > x$ (better on Test 2); a point **below** it has $y < x$.\n\n' +
        '**Step 1: read each point and compare $y$ with $x$.**\n\n' +
        '| Test 1 ($x$) | Test 2 ($y$) | Compare |\n' +
        '| --- | --- | --- |\n' +
        '| 15 | 25 | higher |\n' +
        '| 20 | 30 | higher |\n' +
        '| 25 | 20 | lower |\n' +
        '| 30 | 35 | higher |\n' +
        '| 30 | 20 | lower |\n' +
        '| 35 | 30 | lower |\n' +
        '| 35 | 35 | equal (on the line) |\n' +
        '| 40 | 45 | higher |\n' +
        '| 40 | 50 | higher |\n' +
        '| 45 | 35 | lower |\n' +
        '| 45 | 50 | higher |\n\n' +
        '**Step 2: count.** 6 points are above the line, 4 below and 1 on it. So **6** students scored strictly higher on Test 2.',
      whyWrong: [
        'This also counts the student on the line (35 on both tests). That student scored the same, not strictly higher.',
        null,
        'This counts the points **below** the line, the students who did better on Test 1. Above the line means $y > x$.',
        'This counts the students who did **not** score higher on Test 2 (4 below the line plus 1 on it).',
      ],
      keyIdea: 'With the line $y = x$ drawn on a scatter plot, points above it have $y > x$, points below have $y < x$, and points on it are equal.',
    },
    check: { optionValues: [7, 6, 4, 5], compute: () => TESTS.filter((p) => p.y > p.x).length },
  },
];
