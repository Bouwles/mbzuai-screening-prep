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

const TRAVEL_ANGLES = [
  { label: 'Walk', value: 120 },
  { label: 'Bus', value: 105 },
  { label: 'Car', value: 90 },
  { label: 'Cycle', value: 45 },
];

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'reading-charts-001',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'The bar chart shows the books borrowed from a library on each day of one week. How many **more** books were borrowed on Thursday than on Wednesday?',
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
      asking: 'What is the gap between Thursday\'s bar and Wednesday\'s bar?',
      solution:
        'The words **how many more** ask for a difference, so we read two bars and subtract the smaller from the larger.\n\n' +
        'Find each day along the bottom, go up to the top of its bar, then go across to the scale on the left:\n\n| Day | Books borrowed |\n|---|---|\n| Wed | 20 |\n| Thu | 50 |\n\n' +
        'Subtract: $50 - 20 = 30$.',
      conclusion: 'Thursday\'s bar is 30 higher than Wednesday\'s, so the answer is $30$.',
      whyWrong: [
        'This is $50 - 35$: it compares Thursday with Friday (the bar next to it) instead of with Wednesday.',
        null,
        'This is $50 + 20$: it adds the two days. "How many more" asks for the difference, so you subtract.',
        'This is $50 \\div 20$, which says how many **times** as many books were borrowed. "How many more" asks for a difference, not a ratio.',
      ],
      keyIdea: '"How many more" always means subtract. Read only the two values the question names from the axis, then do larger minus smaller. Don\'t add them, divide them or use a neighbouring bar.',
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
    stem: 'The pie chart shows the **number** of students choosing each favourite subject. What fraction of the students chose Science?',
    chart: { kind: 'pie', title: 'Favourite subject (number of students)', slices: SUBJECTS },
    options: ['$\\frac{7}{13}$', '$\\frac{7}{10}$', '$\\frac{1}{4}$', '$\\frac{7}{20}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What share of all the students picked Science, written as a fraction?',
      solution:
        'A fraction of a group is the part divided by the whole. The part is the Science slice, which is 70 students.\n\n' +
        'The whole is everyone on the chart. It isn\'t printed, so add all the slices: $50 + 70 + 40 + 40 = 200$.\n\n' +
        'That makes the fraction $\\frac{70}{200}$.\n\n' +
        'Simplify it by dividing the top and bottom by the same number. Dividing both by 10 gives $\\frac{7}{20}$. No whole number above 1 divides both 7 and 20, so this is as simple as it gets.',
      conclusion: 'Science is 70 out of 200 students, which simplifies to $\\frac{7}{20}$.',
      whyWrong: [
        'This is $\\frac{70}{130}$: it divides by the students who did **not** choose Science ($50 + 40 + 40 = 130$) instead of by all 200 students.',
        'This is $\\frac{70}{100}$: it assumes the total is 100. Always add up the slices to find the real total, here 200.',
        'This assumes all four slices are the same size, so each is a quarter. The slices are different sizes; Science is the biggest.',
        null,
      ],
      keyIdea: 'For "what fraction" on a pie chart of counts: add every slice to get the whole, put the slice you want on top, then simplify. Never assume the total is 100.',
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
    stem: 'The line graph shows a temperature measured every 3 hours. Between which two consecutive readings did the temperature **rise** the most?',
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
      asking: 'Between which two neighbouring times did the temperature go up by the most?',
      solution:
        '"Consecutive readings" means readings next to each other, so there are 5 pairs to check. Read each point from the scale on the left and work out later minus earlier:\n\n| From | To | Working | Change |\n|---|---|---|---|\n| 06:00 | 09:00 | $10 - 5$ | $+5$ |\n| 09:00 | 12:00 | $20 - 10$ | $+10$ |\n| 12:00 | 15:00 | $25 - 20$ | $+5$ |\n| 15:00 | 18:00 | $10 - 25$ | $-15$ |\n| 18:00 | 21:00 | $5 - 10$ | $-5$ |\n\n' +
        'A minus sign means the temperature fell. The $-15$ is the biggest change in size, but it is a fall, so it can\'t be the biggest rise.\n\n' +
        'Among the plus numbers, the biggest is $+10$, which is the pair 09:00 and 12:00.',
      conclusion: 'The temperature rose by 10 °C in that gap, more than in any other, so the answer is 09:00 and 12:00.',
      whyWrong: [
        'The temperature reaches its **highest** value at 15:00, but the rise from 12:00 to 15:00 is only 5 °C. The highest point is not the same as the biggest rise.',
        'This is the biggest **change** (15 °C), but it is a **fall** from 25 °C to 10 °C, not a rise. The line goes down here.',
        null,
        'The temperature does rise here, but only by 5 °C (from 5 to 10), half the rise between 09:00 and 12:00.',
      ],
      keyIdea: 'For "biggest rise" on a line graph, work out later minus earlier for each neighbouring pair and pick the largest plus number. On the graph it is the steepest climb. The highest point is not the biggest rise.',
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
    stem: 'The table shows club membership in Years 10 and 11, with one value missing. How many Year 11 students joined the Sport club?',
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
      asking: 'What number belongs in the empty Year 11 box in the Sport row?',
      solution:
        'Read along the Sport row. It shows 24 students in Year 10 and a total of 50.\n\n' +
        'The Total column is Year 10 and Year 11 added together. You can test this on the Music row: $18 + 22 = 40$.\n\n' +
        'To find a missing part of a total, take the known part away from the total: $50 - 24 = 26$.',
      conclusion: '24 from Year 10 and 26 from Year 11 make the total of 50, so the answer is $26$.',
      whyWrong: [
        'This is $24 + 50$: it adds the Year 10 value to the total. The total already includes Year 10, so you must subtract.',
        null,
        'This is $50 \\div 2$: it assumes the 50 Sport students are split equally between the two years. The table says 24 are in Year 10, so the split is not equal.',
        'This is the Year 11 value from the **Music** row: it reads the right column but the wrong row.',
      ],
      keyIdea: 'For a missing value in a table with a Total column: use a complete row to see what the total adds up, then do total minus the known parts. Stay in the row the question names.',
    },
    check: { optionValues: [74, 26, 25, 22], compute: () => SPORT_TOTAL - SPORT_Y10 },
  },
  {
    id: 'reading-charts-005',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'The scatter plot shows revision time and test score for ten students. Which statement is best supported by the plot?',
    chart: {
      kind: 'scatter',
      title: 'Revision time and test score',
      xLabel: 'Hours of revision',
      yLabel: 'Test score',
      points: REVISION,
    },
    options: [
      'Scores tend to rise as revision time increases',
      'Scores tend to fall as revision time increases',
      'More revision always gives a higher score',
      'There is no relationship',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'What pattern do the dots show between revision time and test score?',
      solution:
        'Each dot is one student. Going right means more hours of revision, and going up means a higher score.\n\n' +
        'Test the word "always" first. The student with 5 hours scored 55, which is lower than the student with 4 hours, who scored 60. So no exact rule holds for every student.\n\n' +
        'Now look at the whole cloud of dots from left to right. At 1 hour the score is 35, and at 9 hours it is 85. The dots climb overall, so more hours generally goes with a higher score.',
      conclusion: 'The dots climb overall, with a few exceptions, so the best statement is this. Scores tend to rise as revision time increases.',
      whyWrong: [
        null,
        'That would be **negative** correlation, where the points slope **down** from left to right. Here they slope up.',
        'Correlation describes a general trend, not a rule for every pair. The student with 5 hours (55) scored lower than the student with 4 hours (60), so "always" is false.',
        'With no relationship the points would be scattered randomly. Here they clearly follow an upward pattern.',
      ],
      keyIdea: 'On a scatter plot, dots climbing to the right mean the two values tend to rise together. Dots falling to the right mean one falls as the other rises. No pattern means no relationship. Reject "always" if one pair of dots breaks the trend.',
    },
  },

  // ================================================================ exam
  {
    id: 'reading-charts-006',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The grouped bar chart shows cups of juice sold (in hundreds) by flavour in 2023 and 2024. Which flavour had the **largest increase** from 2023 to 2024?',
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
      asking: 'Which flavour\'s sales went up by the most from 2023 to 2024?',
      solution:
        'A flavour\'s increase is its 2024 bar minus its 2023 bar. Read both bars for each flavour and subtract:\n\n| Flavour | 2023 | 2024 | Change |\n|---|---|---|---|\n| Mango | 20 | 30 | $+10$ |\n| Lemon | 45 | 40 | $-5$ |\n| Berry | 15 | 35 | $+20$ |\n| Mint | 35 | 50 | $+15$ |\n| Peach | 40 | 15 | $-25$ |\n\n' +
        'A minus sign means sales fell, so Lemon and Peach did not increase at all.\n\n' +
        'The biggest plus number is $+20$, for Berry.',
      conclusion: 'Berry rose by 20 hundred cups, more than any other flavour, so the answer is Berry.',
      whyWrong: [
        'Mint has the **tallest** 2024 bar (50), but it only increased by $50 - 35 = 15$. The highest value is not the same as the largest increase.',
        'Peach has the biggest **change** (25), but it is a **decrease**, from 40 down to 15.',
        null,
        'Lemon has the tallest 2023 bar (45), but its sales actually fell by 5 in 2024.',
      ],
      keyIdea: 'For "largest increase", make a quick table of new minus old for every category. Ignore the tallest bar: height shows the value, not the change.',
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
    stem: 'A monthly budget of AED 12,000 is split as shown in the **percentage** pie chart. How much more is spent on Housing than on Transport each month?',
    chart: { kind: 'pie', title: 'Monthly budget (%)', slices: BUDGET },
    options: ['AED 4,200', 'AED 6,000', 'AED 1,800', 'AED 2,400'],
    correctIndex: 3,
    markScheme: {
      asking: 'In AED, how much bigger is the Housing share of the budget than the Transport share?',
      solution:
        'The chart gives **percentages**, not money. Housing is $35\\%$ and Transport is $15\\%$ of the AED 12,000 budget.\n\n' +
        'A percentage means "out of 100". To find a percentage of an amount, divide by 100 and multiply by the amount. Housing: $\\frac{35}{100} \\times 12000 = 4200$, so AED 4,200.\n\n' +
        'Do the same for Transport: $\\frac{15}{100} \\times 12000 = 1800$, so AED 1,800.\n\n' +
        '"How much more" means subtract: $4200 - 1800 = 2400$.',
      conclusion: 'Housing costs AED 4,200 and Transport costs AED 1,800, a gap of AED 2,400.',
      whyWrong: [
        'This is the Housing amount on its own ($0.35 \\times 12000$). You still need to subtract the Transport amount.',
        'This is $50\\%$ of the budget: it **adds** the two percentages ($35\\% + 15\\%$) instead of subtracting them.',
        'This is the Transport amount on its own ($0.15 \\times 12000$), not the difference.',
        null,
      ],
      keyIdea: 'With a percentage pie and a total: amount $= \\frac{\\text{percentage}}{100} \\times$ total. For a gap, you can subtract the percentages first, then take that percentage of the total. Here $20\\%$ of 12,000 gives the same result.',
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
    stem: 'The histogram shows plant heights $h$. Each class includes its lower boundary but not its upper boundary. What percentage of the plants are **at least 20 cm** tall?',
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
      asking: 'What percentage of all the plants are 20 cm or taller?',
      solution:
        'Each bar of a histogram covers a range of heights, called a **class**. The bar\'s height is the **frequency**: how many plants are in that class. Read every bar:\n\n| Height $h$ (cm) | Frequency |\n|---|---|\n| 0 to 10 | 6 |\n| 10 to 20 | 8 |\n| 20 to 30 | 10 |\n| 30 to 40 | 10 |\n| 40 to 50 | 6 |\n\n' +
        '"At least 20" means 20 or more. Each class includes its lower boundary, so a plant of exactly 20 cm sits in the 20 to 30 class. So we need the last three classes.\n\n' +
        'Count those plants: $10 + 10 + 6 = 26$.\n\n' +
        'Count all the plants, because a percentage compares a part with the whole: $6 + 8 + 10 + 10 + 6 = 40$.\n\n' +
        'Divide the part by the whole, then multiply by 100: $\\frac{26}{40} = 0.65$, and $0.65 \\times 100 = 65\\%$.',
      conclusion: '26 of the 40 plants are at least 20 cm tall, which is $65\\%$.',
      whyWrong: [
        'This counts only the 20 to 30 and 30 to 40 classes ($\\frac{20}{40}$) and forgets the 40 to 50 class, which is also at least 20 cm.',
        null,
        'This is the percentage **below** 20 cm ($\\frac{6 + 8}{40}$): the wrong side of 20.',
        'This is the **number** of plants (26) written as a percentage. You must divide by the total of 40 plants and multiply by 100.',
      ],
      keyIdea: 'For "at least" or "less than" on a histogram: list the classes on the correct side of the boundary and add their frequencies. If a percentage is wanted, divide by the total of all the frequencies and multiply by 100.',
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
    stem: 'The line graph shows monthly visitors (in thousands) to two websites. In which month was the **difference** between the two sites greatest?',
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
      asking: 'In which month were the two websites\' visitor numbers furthest apart?',
      solution:
        'The **difference** between two lines is the vertical gap between them. It doesn\'t matter which site is ahead, so always take larger minus smaller.\n\n' +
        'Read both lines for each month and subtract:\n\n| Month | Site A | Site B | Gap |\n|---|---|---|---|\n| Jan | 20 | 30 | 10 |\n| Feb | 25 | 30 | 5 |\n| Mar | 35 | 25 | 10 |\n| Apr | 30 | 35 | 5 |\n| May | 40 | 20 | 20 |\n| Jun | 45 | 40 | 5 |\n\n' +
        'The largest number in the Gap column is 20 thousand, and it is in May.',
      conclusion: 'The gap of 20 thousand is bigger than in any other month, so the answer is May.',
      whyWrong: [
        null,
        'In June both sites have their highest values, but the lines are close together there: the gap is only $45 - 40 = 5$ thousand.',
        'In January Site B is ahead by 10 thousand, its biggest lead, but the gap in May (20 thousand) is twice as large.',
        'March is just after the lines cross, which catches the eye, but the gap there is only $35 - 25 = 10$ thousand.',
      ],
      keyIdea: 'For two lines, the difference is the vertical gap at each point. Make a table of larger minus smaller for every point and pick the largest. Ignore where the lines are highest or where they cross.',
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
    stem: 'A passenger reaches the City Mall stop at 08:40 and catches the **next** bus to the Airport. Using the timetable, how long is the bus journey?',
    table: {
      caption: 'Bus times at each stop',
      headers: ['Stop', 'Bus 1', 'Bus 2', 'Bus 3'],
      rows: BUS_ROWS,
    },
    options: ['42 minutes', '58 minutes', '46 minutes', '63 minutes'],
    correctIndex: 2,
    markScheme: {
      asking: 'How long does the ride take on the first bus the passenger can actually catch?',
      solution:
        'Each column is one bus and each row is one stop. Read along the City Mall row: the buses leave at 08:05, 08:52 and 09:58.\n\n' +
        'The passenger arrives at 08:40. The 08:05 bus has already gone, so the next one is the 08:52, which is Bus 2.\n\n' +
        'Stay in the Bus 2 column and read down to the Airport row: this bus arrives at 09:38.\n\n' +
        'The journey starts when the bus leaves at 08:52, not when the passenger arrives. Waiting at the stop isn\'t part of the bus journey.\n\n' +
        'Count in two parts, using 09:00 as a stepping stone. From 08:52 to 09:00 is 8 minutes, and from 09:00 to 09:38 is 38 minutes. Together that is $8 + 38 = 46$ minutes.',
      conclusion: 'Bus 2 leaves City Mall at 08:52 and reaches the Airport at 09:38, which takes 46 minutes.',
      whyWrong: [
        'This is the journey time of **Bus 1** (08:05 to 08:47), which had already left City Mall before the passenger arrived at 08:40.',
        'This counts from 08:40, when the passenger arrived at the stop, so it includes 12 minutes of waiting. The bus journey starts at 08:52.',
        null,
        'This is the time from **Central Station** (08:35) to the Airport (09:38): it uses the wrong row as the starting stop.',
      ],
      keyIdea: 'For a timetable: find the first time in your stop\'s row at or after your arrival, stay in that bus\'s column, then subtract the two times. Count up to the next full hour, then add the minutes after it.',
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
    difficulty: 'foundation',
    stem: 'The dashed line of best fit has equation $y = 5x + 40$, where $x$ is hours studied and $y$ is test score. Estimate the score of a student who studies for 7 hours.',
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
      asking: 'What does the line\'s equation give as the score for 7 hours of study?',
      solution:
        'A **line of best fit** is a straight line showing the general trend, and we use it to make estimates. Its equation turns hours into a score.\n\n' +
        'In $y = 5x + 40$, the letter $x$ is hours studied and $y$ is the estimated score. The 5 is the **gradient**: each extra hour adds 5 marks. The 40 is the **intercept**: the score at 0 hours.\n\n' +
        'Replace $x$ with 7, because the student studies for 7 hours: $y = 5 \\times 7 + 40$.\n\n' +
        'Multiply first, then add: $5 \\times 7 = 35$, and $35 + 40 = 75$.',
      conclusion: 'The line predicts a score of $75$ for 7 hours of study.',
      whyWrong: [
        'This is just $5 \\times 7$: it forgets to add the intercept 40.',
        'This is $7 + 40$: it adds the hours instead of multiplying them by the gradient 5.',
        'This is $40 \\times 7 + 5$: it swaps the gradient and the intercept. A test score of 285 is far off the graph, which is a warning sign.',
        null,
      ],
      keyIdea: 'To estimate from a line of best fit, substitute the given value for $x$ in its equation: multiply by the gradient, then add the intercept. The result should sit within the scale of the graph.',
    },
    check: { optionValues: [35, 47, 285, 75], compute: () => FIT.slope * FIT_X + FIT.intercept },
  },
  {
    id: 'reading-charts-012',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The bar chart shows the favourite sports of a year group. What percentage of the students chose Basketball **or** Swimming?',
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
      asking: 'What percentage of all the students picked one of these two sports?',
      solution:
        '"Basketball or Swimming" means students who chose either one, so add the two bars: $40 + 50 = 90$.\n\n' +
        'A percentage compares a part with the whole, so add all five bars to get the whole: $60 + 40 + 20 + 50 + 30 = 200$.\n\n' +
        'Divide the part by the whole, then multiply by 100: $\\frac{90}{200} = 0.45$, and $0.45 \\times 100 = 45\\%$.',
      conclusion: '90 out of 200 students chose one of the two sports, which is $45\\%$.',
      whyWrong: [
        null,
        'This is the **number** of students (90) written as a percentage. You must divide by the total of 200 students.',
        'This is the **average** of the two separate percentages, Basketball $20\\%$ and Swimming $25\\%$. For "Basketball or Swimming" you add them: $20\\% + 25\\% = 45\\%$.',
        'This is Swimming alone ($\\frac{50}{200}$). It forgets to include the Basketball students.',
      ],
      keyIdea: 'For a percentage across several bars: add the bars you want, add all the bars for the total, then calculate $\\frac{\\text{part}}{\\text{total}} \\times 100$. The bar heights are counts, not percentages, unless the total is 100.',
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
    stem: 'The table shows how many students passed and failed an exam at four schools. Which school had the highest **pass rate**?',
    table: {
      headers: ['School', 'Passed', 'Failed'],
      rows: SCHOOLS.map((s) => [s.name, s.pass, s.fail]),
    },
    options: ['School D', 'School A', 'School B', 'School C'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which school passed the largest share of its own students?',
      solution:
        '**Pass rate** means the share of a school\'s students who passed, which is passed divided by total students. The table doesn\'t print the total, so work it out: total students $=$ passed $+$ failed.\n\n' +
        'Do this for each school:\n\n| School | Passed | Total students | Pass rate |\n|---|---|---|---|\n| A | 30 | $30 + 10 = 40$ | $\\frac{30}{40} = 75\\%$ |\n| B | 78 | $78 + 52 = 130$ | $\\frac{78}{130} = 60\\%$ |\n| C | 72 | $72 + 18 = 90$ | $\\frac{72}{90} = 80\\%$ |\n| D | 84 | $84 + 36 = 120$ | $\\frac{84}{120} = 70\\%$ |\n\n' +
        'Compare the rates, not the counts. School D has the most passes, but it also has more students to pass. The highest rate is $80\\%$, at School C.',
      conclusion: 'Its $80\\%$ beats every other school\'s rate, so the answer is School C.',
      whyWrong: [
        'School D has the **most** passes (84), but it is also a big school: $\\frac{84}{120} = 70\\%$. A larger count is not a larger rate.',
        'School A has the **fewest** fails (10), but it is a small school; its pass rate is $\\frac{30}{40} = 75\\%$, below School C.',
        'School B has the most students in total (130), but size is not success: its pass rate $\\frac{78}{130} = 60\\%$ is the lowest of all.',
        null,
      ],
      keyIdea: 'A rate compares groups of different sizes. For each group, divide the count you want by that group\'s own total, then compare the results. Never compare raw counts. If the total is missing, add the parts first.',
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
    stem: 'The line graph shows a car\'s distance from home, recorded every hour. During which one-hour period was the car travelling **fastest**?',
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
      asking: 'In which single hour did the car cover the most distance?',
      solution:
        'The graph shows how far the car is from home, not its speed. Speed is the distance covered in a given time, so we need how much the distance changed during each hour.\n\n' +
        'Read each point and take the later value minus the earlier value:\n\n| Period | Start (km) | End (km) | Distance covered (km) |\n|---|---|---|---|\n| 0 h to 1 h | 0 | 50 | 50 |\n| 1 h to 2 h | 50 | 150 | 100 |\n| 2 h to 3 h | 150 | 150 | 0 |\n| 3 h to 4 h | 150 | 200 | 50 |\n| 4 h to 5 h | 200 | 250 | 50 |\n\n' +
        'Every period lasts 1 hour, so the most distance means the fastest speed. The largest value is 100 km, between 1 h and 2 h. On the graph, it is the steepest part of the line.',
      conclusion: 'The car covered 100 km in that hour, at least twice as far as in any other hour, so the answer is Between 1 h and 2 h.',
      whyWrong: [
        'At 5 h the car is **furthest** from home, but in that hour it only covered 50 km. Being far away is not the same as moving fast.',
        null,
        'The line is **flat** here (150 km at both times), so the car did not move at all: it was stopped.',
        'In the first hour the car covered only 50 km, half of the 100 km covered between 1 h and 2 h.',
      ],
      keyIdea: 'On a distance-time graph, speed is the steepness. For equal time gaps, find later minus earlier for each gap and pick the largest. Flat means stopped, and being far from home doesn\'t mean moving fast.',
    },
    check: {
      optionValues: ['Between 4 h and 5 h', 'Between 1 h and 2 h', 'Between 2 h and 3 h', 'Between 0 h and 1 h'],
      compute: () => {
        const i = argMax(steps(DISTANCE));
        return `Between ${HOURS[i]} and ${HOURS[i + 1]}`;
      },
    },
  },

  {
    id: 'reading-charts-015',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: 'The table shows the populations of four towns in 2015 and 2025. What was the **largest percentage increase** among the four towns? (Options to 1 decimal place where needed.)',
    table: {
      headers: ['Town', '2015', '2025'],
      rows: TOWNS.map((t) => [t.name, t.y2015, t.y2025]),
    },
    options: ['$180\\%$', '$25\\%$', '$80\\%$', '$44.4\\%$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the biggest percentage growth among the four towns?',
      solution:
        'Percentage increase measures growth compared with the starting size: $\\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100$. Here old is the 2015 population and new is the 2025 population.\n\n' +
        'Work it out for all four towns:\n\n| Town | Increase | Working | Percentage increase |\n|---|---|---|---|\n| A | $2400 - 1500 = 900$ | $\\frac{900}{1500} \\times 100$ | $60\\%$ |\n| B | $7500 - 6000 = 1500$ | $\\frac{1500}{6000} \\times 100$ | $25\\%$ |\n| C | $720 - 400 = 320$ | $\\frac{320}{400} \\times 100$ | $80\\%$ |\n| D | $9600 - 9000 = 600$ | $\\frac{600}{9000} \\times 100$ | about $6.7\\%$ |\n\n' +
        'Town B gained the most people, but it started big, so that gain is a small share of its size. The largest percentage belongs to Town C, at $80\\%$.',
      conclusion: 'Town C grew by 320 on a start of 400, the largest share of any town, so the answer is $80\\%$.',
      whyWrong: [
        'This is $\\frac{720}{400} = 1.8$ written as $180\\%$: it is the **new value as a percentage of the old**, not the increase. The increase is $180\\% - 100\\% = 80\\%$.',
        'This is the percentage increase of Town B, which had the largest increase in **people** (1500). The largest actual increase is not the largest percentage increase.',
        null,
        'This is $\\frac{320}{720} \\times 100\\%$: it divides Town C\'s increase by the **new** value. Percentage change always divides by the original (old) value.',
      ],
      keyIdea: 'For "largest percentage increase", calculate (new minus old) divided by old for every row, then compare. Always divide by the old value, and don\'t stop at the row with the biggest raw increase.',
    },
    check: {
      optionValues: [180, 25, 80, 44.4],
      compute: () => Math.max(...TOWNS.map((t) => ((t.y2025 - t.y2015) / t.y2015) * 100)),
    },
  },
  {
    id: 'reading-charts-017',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    stem: '240 students were asked how they travel to school. The pie chart shows each sector\'s **angle** in degrees. How many more students walk than cycle?',
    chart: { kind: 'pie', title: 'Travel to school: sector angles (degrees)', slices: TRAVEL_ANGLES },
    options: ['$50$', '$75$', '$112.5$', '$80$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many more students walk than cycle, once the angles are turned into numbers of students?',
      solution:
        'The chart gives angles, not students. A full circle is $360^\\circ$, and it stands for all 240 students.\n\n' +
        'Find what one degree is worth by sharing the students around the circle: $\\frac{240}{360} = \\frac{2}{3}$ of a student per degree. A fraction is fine here, because we are about to multiply by it.\n\n' +
        'Multiply each angle by $\\frac{2}{3}$ to get students:\n\n| Way of travelling | Angle | Working | Students |\n|---|---|---|---|\n| Walk | $120^\\circ$ | $120 \\times \\frac{2}{3} = \\frac{240}{3}$ | 80 |\n| Cycle | $45^\\circ$ | $45 \\times \\frac{2}{3} = \\frac{90}{3}$ | 30 |\n\n' +
        '"How many more" means subtract: $80 - 30 = 50$.',
      conclusion: '80 students walk and 30 cycle, so $50$ more students walk.',
      whyWrong: [
        null,
        'This is the difference in **degrees** ($120 - 45$). Angles are not numbers of students: you must multiply by $\\frac{240}{360}$.',
        'This converts the wrong way: $75 \\times \\frac{360}{240}$. Since 240 students share 360 degrees, each degree is **less** than one student, so the answer must be smaller than 75.',
        'This is the number of students who walk ($\\frac{120}{360} \\times 240$). It forgets to subtract the 30 students who cycle.',
      ],
      keyIdea: 'For a pie chart labelled in degrees: students $= \\frac{\\text{angle}}{360} \\times$ total. Convert each sector before you subtract, because a gap in degrees is not a gap in students.',
    },
    check: {
      optionValues: [50, 75, 112.5, 80],
      compute: () => {
        const ang = (l: string) => TRAVEL_ANGLES.find((s) => s.label === l)!.value;
        return new Frac(ang('Walk') - ang('Cycle'), 360).mul(240).value();
      },
    },
  },

  // ================================================================ recall
  {
    id: 'reading-charts-020',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'A sector of a pie chart has an angle of $90^\\circ$. What fraction of the total does it represent?',
    options: ['$\\frac{1}{4}$', '$\\frac{1}{2}$', '$\\frac{9}{10}$', '$\\frac{1}{3}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What fraction of a whole circle is a $90^\\circ$ slice?',
      solution:
        'A whole pie chart is a full circle, which is $360^\\circ$, and it stands for the total.\n\n' +
        'A sector\'s fraction of the total is its angle over the full circle: $\\frac{90}{360}$.\n\n' +
        'Simplify by dividing the top and bottom by 90: $90 \\div 90 = 1$ and $360 \\div 90 = 4$. That gives $\\frac{1}{4}$.',
      conclusion: 'Four $90^\\circ$ sectors fill the circle, so one sector is $\\frac{1}{4}$ of the total.',
      whyWrong: [
        null,
        'This treats the whole circle as $180^\\circ$. A full circle is $360^\\circ$; $180^\\circ$ is only a half turn.',
        'This is $\\frac{90}{100}$: it reads the angle as a percentage. Degrees are out of 360, not 100.',
        'This is $\\frac{90}{270}$: it compares the sector with the rest of the circle instead of with the whole circle.',
      ],
      keyIdea: 'To turn a pie chart angle into a fraction of the total, put the angle over 360 and simplify. To go the other way, multiply the fraction by 360.',
    },
    check: { optionValues: [1 / 4, 1 / 2, 9 / 10, 1 / 3], compute: () => new Frac(90, 360).value() },
  },
  {
    id: 'reading-charts-021',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'Which type of chart is most suitable for showing how one quantity changes over time?',
    options: ['Line graph', 'Pie chart', 'Histogram', 'Scatter plot'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which chart is best for showing how one thing changes as time passes?',
      solution:
        'To show change over time, you need time along the bottom and the readings in order, so the eye can follow them up and down.\n\n' +
        'A **line graph** does exactly this. It plots the value at each time and joins the points, like a temperature taken every hour. A rising line means going up, and a falling line means going down.',
      conclusion: 'It joins readings in time order, so the answer is Line graph.',
      whyWrong: [
        null,
        'A pie chart shows how a whole is shared out at one moment. It has no time axis.',
        'A histogram shows how values are spread across classes, not how a quantity changes from one time to the next.',
        'A scatter plot shows whether two variables are related. It does not join readings in time order.',
      ],
      keyIdea: 'Match the chart to the job. Change over time: line graph. Parts of a whole: pie chart. Spread of values across classes: histogram. Link between two variables: scatter plot. Comparing categories: bar chart.',
    },
  },
  {
    id: 'reading-charts-022',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'On a distance-time graph, what does a horizontal section show?',
    options: ['The object has stopped', 'The object is moving fast', 'The object is speeding up', 'The object is returning to its start'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is happening when a distance-time graph goes flat?',
      solution:
        'On a distance-time graph, the height of the line shows how far the object is from its start. Moving right along the graph means time passing.\n\n' +
        'A horizontal section means time keeps passing but the height stays the same. For example, 150 km at 2 hours and still 150 km at 3 hours.\n\n' +
        'The distance isn\'t changing at all, so the object isn\'t moving. Its speed is zero.',
      conclusion: 'Time passes with no change in distance. The object has stopped.',
      whyWrong: [
        null,
        'Fast movement is a **steep** section. A horizontal section has no slope at all, so the speed is zero.',
        'Speeding up shows as a curve that gets steeper. A horizontal line has a constant slope of zero.',
        'Returning to the start shows as a downward slope, because the distance from the start is falling.',
      ],
      keyIdea: 'Read the slope of a distance-time graph. Flat: stopped. Steep: fast. Gentle: slow. Sloping down: heading back towards the start. Curving more steeply: speeding up.',
    },
  },
  {
    id: 'reading-charts-023',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    stem: 'In a histogram with equal class widths, the **modal class** is the class with:',
    options: ['The tallest bar', 'The widest bar', 'The middle position on the axis', 'The largest values'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does "modal class" mean on a histogram?',
      solution:
        'The **mode** is the most common value. So the **modal class** is the most common group: the class holding the most values.\n\n' +
        'On a histogram with equal class widths, a bar\'s height shows how many values are in that class. More values means a higher bar, so the class we want has the highest bar.',
      conclusion: 'More values means more height, so the answer is The tallest bar.',
      whyWrong: [
        null,
        'The classes here all have the same width, so no bar is wider than another. Width is not what "modal" refers to.',
        'The middle of the data is linked to the **median**, not the mode.',
        'The class with the largest values is at the right-hand end of the axis. It can have a very low frequency.',
      ],
      keyIdea: 'Mode means most common, so the modal class has the highest frequency. With equal class widths, find the tallest bar and read its class from the axis. Don\'t confuse it with the median, which is the middle value.',
    },
  },
];
