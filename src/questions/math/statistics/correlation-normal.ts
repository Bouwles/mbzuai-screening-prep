import type { StaticQuestion } from '../../../types';
import { mean, sumOf } from '../../../lib/mathx';

// ---- helpers used only by the answer checks (re-derive answers in code) ----

/** Pearson correlation coefficient of paired data. */
function pearson(pts: { x: number; y: number }[]): number {
  const mx = mean(pts.map((p) => p.x));
  const my = mean(pts.map((p) => p.y));
  const sxy = sumOf(pts.map((p) => (p.x - mx) * (p.y - my)));
  const sxx = sumOf(pts.map((p) => (p.x - mx) ** 2));
  const syy = sumOf(pts.map((p) => (p.y - my) ** 2));
  return sxy / Math.sqrt(sxx * syy);
}

/** Percentage of a normal distribution within k SDs of the mean, by the 68-95-99.7 rule (k = 1, 2, 3). */
function within(k: number): number {
  const table: Record<number, number> = { 1: 68, 2: 95, 3: 99.7 };
  const v = table[Math.abs(k)];
  if (v === undefined) throw new Error(`rule only covers 1, 2, 3 SDs, got ${k}`);
  return v;
}
/** Percentage above mu + k*sigma (k = 1, 2, 3), using symmetry. */
const above = (k: number): number => (100 - within(k)) / 2;
/** Percentage between mu + a*sigma and mu + b*sigma for a <= 0 <= b, using symmetry. */
const between = (a: number, b: number): number => (a === 0 ? 0 : within(a) / 2) + (b === 0 ? 0 : within(b) / 2);

/** Value in the list closest to v. */
const nearest = (v: number, opts: number[]): number => opts.reduce((best, o) => (Math.abs(o - v) < Math.abs(best - v) ? o : best));

/** Classify a scatter by r (used for describing-correlation questions). */
function describe(r: number): string {
  const dir = r > 0 ? 'positive' : 'negative';
  if (Math.abs(r) >= 0.7) return `strong ${dir}`;
  if (Math.abs(r) >= 0.3) return `weak ${dir}`;
  return 'none';
}

// ---- data used by charts and checks ----
const tvScores = [
  { x: 0.5, y: 88 }, { x: 1, y: 85 }, { x: 1.5, y: 80 }, { x: 2, y: 82 }, { x: 2.5, y: 75 }, { x: 3, y: 72 },
  { x: 3.5, y: 74 }, { x: 4, y: 66 }, { x: 4.5, y: 63 }, { x: 5, y: 60 }, { x: 5.5, y: 58 }, { x: 6, y: 52 },
];
const screenSleep = [
  { x: 1, y: 9 }, { x: 2, y: 6 }, { x: 2, y: 9 }, { x: 3, y: 8 }, { x: 4, y: 5 }, { x: 4, y: 8 }, { x: 5, y: 7 },
  { x: 6, y: 4 }, { x: 6, y: 7 }, { x: 7, y: 6 }, { x: 8, y: 3 }, { x: 8, y: 6 }, { x: 9, y: 4 },
];
const studyScores = [
  { x: 1, y: 34 }, { x: 2, y: 33 }, { x: 3, y: 39 }, { x: 4, y: 38 }, { x: 5, y: 44 }, { x: 6, y: 43 },
  { x: 7, y: 49 }, { x: 9, y: 51 }, { x: 10, y: 56 },
];
const outlierBase = [
  { x: 1, y: 3 }, { x: 2, y: 5.5 }, { x: 3, y: 6.5 }, { x: 4, y: 9 }, { x: 5, y: 10.5 }, { x: 6, y: 13.5 }, { x: 7, y: 14.5 }, { x: 8, y: 17 },
];
const outlierPoint = { x: 9, y: 2 };

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'correlation-normal-001',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'The scatter plot shows, for 12 students, the number of hours of TV watched per day and their score in a test. Which statement best describes the correlation?',
    chart: {
      kind: 'scatter',
      title: 'TV time and test score',
      xLabel: 'TV per day (hours)',
      yLabel: 'Test score',
      points: tvScores,
    },
    options: ['Strong positive correlation', 'Strong negative correlation', 'No correlation', 'Weak positive correlation'],
    correctIndex: 1,
    markScheme: {
      asking: 'What pattern do the points show between TV time and test score?',
      solution:
        '**Correlation** describes how two quantities move together. We describe it in two parts: direction and strength.\n\n' +
        '**Direction:** reading from left to right, TV time goes up from $0.5$ to 6 hours while scores go down from 88 to 52. Going down means **negative**.\n\n' +
        '**Strength:** the points stay close to a straight line, with none far from the trend. Close to a line means **strong**.',
      conclusion: 'The points fall from left to right and stay close to a line, which is a Strong negative correlation.',
      whyWrong: [
        'This gets the direction backwards. Positive correlation means both variables rise together, but here the scores **fall** as TV time rises.',
        null,
        'There clearly is a pattern: the points follow a downward line. "No correlation" would look like a random cloud with no trend.',
        'This is wrong on both counts: the trend slopes **down** (negative), and the points sit tightly around a line (strong, not weak).',
      ],
      keyIdea: 'For any scatter plot, ask two questions. Does the pattern go up (positive) or down (negative)? Are the points tight around a line (strong) or loosely scattered (weak)? No pattern means no correlation.',
    },
    check: {
      optionValues: ['strong positive', 'strong negative', 'none', 'weak positive'],
      compute: () => describe(pearson(tvScores)),
    },
  },
  {
    id: 'correlation-normal-002',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'Which of the following **cannot** be the value of a correlation coefficient $r$?',
    options: ['$-0.95$', '$0$', '$0.6$', '$1.3$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which number is outside the allowed values for $r$?',
      solution:
        'The **correlation coefficient** $r$ measures how close points are to a straight line. It runs from $-1$ (a perfect line going down), through 0 (no straight-line pattern), to 1 (a perfect line going up).\n\n' +
        'So $r$ must be between $-1$ and 1. Check each value: $-0.95$, 0 and $0.6$ are inside that range, but $1.3$ is above 1.',
      conclusion: '$1.3$ is the only value above the limit of 1, so it can\'t be a value of $r$.',
      whyWrong: [
        'A value of $-0.95$ is allowed: negative values of $r$ are fine, they just mean the correlation is negative. It is very close to $-1$, so it is a strong negative correlation.',
        '$r = 0$ is allowed: it means there is no linear relationship between the variables.',
        '$r = 0.6$ is inside the range $-1 \\le r \\le 1$, so it is a perfectly possible (moderate positive) correlation.',
        null,
      ],
      keyIdea: '$r$ always satisfies $-1 \\le r \\le 1$. Use this to rule out options fast. If a calculation gives a value outside this range, something in the working has gone wrong.',
    },
    check: {
      optionValues: [-0.95, 0, 0.6, 1.3],
      compute: () => [-0.95, 0, 0.6, 1.3].filter((v) => v < -1 || v > 1)[0],
    },
  },
  {
    id: 'correlation-normal-003',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'A test has mean $70$ and standard deviation $8$. Omar scored $82$. What is Omar\'s $z$-score?',
    options: ['$12$', '$1.5$', '$\\frac{2}{3}$', '$-1.5$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many standard deviations above the mean is Omar\'s mark?',
      solution:
        'A $z$-score says how many standard deviations a value is from the mean. A standard deviation is a typical distance from the mean.\n\n' +
        'The formula is $z = \\frac{x - \\mu}{\\sigma}$. Here $x$ is the value, $\\mu$ (the Greek letter mu) is the mean, and $\\sigma$ (sigma) is the standard deviation. So $x = 82$, $\\mu = 70$ and $\\sigma = 8$.\n\n' +
        'Find how far Omar is above the mean: $82 - 70 = 12$ marks.\n\n' +
        'Divide by the standard deviation to count how many of them fit: $\\frac{12}{8} = 1.5$.',
      conclusion: 'Omar is 12 marks above the mean, and each standard deviation is 8 marks, so the answer is $1.5$.',
      whyWrong: [
        'This is only the distance from the mean, $82 - 70 = 12$. You must then divide by the standard deviation $8$.',
        null,
        'This is the fraction upside down, $\\frac{8}{12}$. The distance from the mean goes on top: $\\frac{12}{8}$.',
        'This subtracts the wrong way round, $\\frac{70 - 82}{8}$. Omar is **above** the mean, so his $z$-score must be positive.',
      ],
      keyIdea: 'Use $z = \\frac{x - \\mu}{\\sigma}$: distance from the mean divided by the standard deviation. Above the mean gives a positive $z$, and below gives a negative one.',
    },
    check: {
      optionValues: [12, 1.5, 2 / 3, -1.5],
      compute: () => (82 - 70) / 8,
    },
  },
  {
    id: 'correlation-normal-004',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'Men\'s heights in a town are normally distributed with mean $170$ cm and standard deviation $6$ cm. By the 68-95-99.7 rule, roughly what percentage are between $164$ cm and $176$ cm?',
    options: ['95%', '34%', '68%', '99.7%'],
    correctIndex: 2,
    markScheme: {
      asking: 'What percentage of men lie within 6 cm either side of the 170 cm mean?',
      solution:
        'The **68-95-99.7 rule** is for normal data. About 68% of values lie within 1 **standard deviation** (SD) of the mean, 95% within 2 SDs, and 99.7% within 3 SDs.\n\n' +
        'See how far each limit is from the mean: $170 - 164 = 6$ and $176 - 170 = 6$. One SD is 6 cm, so each limit is exactly 1 SD from the mean.\n\n' +
        'So this range is within 1 SD on both sides of the mean, and the rule gives 68% for that.',
      conclusion: '164 to 176 cm is the mean plus or minus 1 SD, so the answer is 68%.',
      whyWrong: [
        '95% is the figure for within **2** SDs of the mean (here $158$ to $182$ cm). The interval $164$ to $176$ is only $6$ cm, which is $1$ SD, either side.',
        '34% is only **half** of the interval: from the mean $170$ up to $176$. The question covers both sides of the mean.',
        null,
        '99.7% is the figure for within **3** SDs of the mean ($152$ to $188$ cm), far wider than this interval.',
      ],
      keyIdea: 'Turn each boundary into SDs from the mean: distance from the mean divided by the SD. Then within 1 SD is 68%, within 2 SDs is 95%, and within 3 SDs is 99.7%.',
    },
    check: {
      optionValues: [95, 34, 68, 99.7],
      compute: () => between((164 - 170) / 6, (176 - 170) / 6),
    },
  },
  {
    id: 'correlation-normal-005',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'A city finds $r = 0.9$ between daily ice-cream sales and daily beach rescues. Which conclusion is valid?',
    options: [
      'They tend to rise together, but one need not cause the other',
      'Eating ice cream causes beach rescues',
      'Banning ice cream would reduce beach rescues',
      'Since $r \\ne 1$, there is no real relationship',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'What can we honestly say from a strong link between ice-cream sales and rescues?',
      solution:
        '$r = 0.9$ is close to 1, so the two quantities have a strong positive **correlation**: on days when one is high, the other tends to be high too.\n\n' +
        'Correlation doesn\'t show cause. A third factor can drive both. Here, hot weather brings more ice-cream sales and more swimmers, and so more rescues.\n\n' +
        'So we can say they tend to rise together, but we can\'t say one causes the other. Banning ice cream wouldn\'t change the weather.',
      conclusion: 'The data shows a link and nothing more, so the answer is They tend to rise together, but one need not cause the other.',
      whyWrong: [
        null,
        'This claims cause and effect from a correlation. A strong $r$ does not prove causation; hot weather drives both variables.',
        'This also assumes ice cream **causes** the rescues. Since hot weather is the real driver, banning ice cream would not change how many people swim.',
        'A relationship does not need $r = 1$ to be real. $r = 1$ means a *perfect* straight line; $r = 0.9$ is still a strong positive correlation.',
      ],
      keyIdea: 'A high $r$ only says two things move together. Before accepting a cause, ask: could a third factor drive both? Reject any option claiming that one causes the other, or that changing one would change the other.',
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'correlation-normal-006',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'The scatter plot shows average daily screen time and average nightly sleep for 13 teenagers. Which value is the most likely value of the correlation coefficient $r$?',
    chart: {
      kind: 'scatter',
      title: 'Screen time and sleep',
      xLabel: 'Screen time per day (hours)',
      yLabel: 'Sleep per night (hours)',
      points: screenSleep,
    },
    options: ['$-1$', '$0$', '$0.7$', '$-0.7$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which number best matches the pattern of points in the scatter plot?',
      solution:
        '$r$, the **correlation coefficient**, runs from $-1$ to 1. Its sign gives the direction, and its size gives the strength.\n\n' +
        '**Direction:** as screen time rises, sleep tends to fall. The trend goes down, so $r$ is negative. That rules out 0 and $0.7$.\n\n' +
        '**Strength:** the points follow the trend but are scattered around it, so they aren\'t on one exact line. $r = -1$ needs a perfect line, so $r$ must be weaker than that, which leaves $-0.7$.',
      conclusion: 'A clear downward trend with scatter around it fits the answer, $-0.7$.',
      whyWrong: [
        '$r = -1$ means **perfect** negative correlation, with every point exactly on a straight line. These points are scattered around the trend, so $r$ is not $-1$.',
        '$r = 0$ means no linear trend at all, but these points clearly drift downwards.',
        'This has the right size but the wrong sign. Sleep goes **down** as screen time goes up, so $r$ must be negative.',
        null,
      ],
      keyIdea: 'Estimate $r$ in two moves. The sign comes from the slope (up or down). The size comes from how tight the points are: exactly on a line is 1, tight is about $0.9$, loose is about $0.5$, no pattern is 0.',
    },
    check: {
      optionValues: [-1, 0, 0.7, -0.7],
      compute: () => nearest(pearson(screenSleep), [-1, 0, 0.7, -0.7]),
    },
  },
  {
    id: 'correlation-normal-007',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'The scatter plot shows hours revised, $x$, and test score, $y$, with line of best fit $y = 2.5x + 30$. Predict the score of a student who revises for $8$ hours.',
    chart: {
      kind: 'scatter',
      title: 'Revision and test score',
      xLabel: 'Hours revising (x)',
      yLabel: 'Test score (y)',
      points: studyScores,
      line: { slope: 2.5, intercept: 30 },
    },
    options: ['$20$', '$242.5$', '$50$', '$-8.8$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What score does the line give for 8 hours of revision?',
      solution:
        'The line of best fit is $y = 2.5x + 30$. Here $x$ is hours revised and $y$ is the predicted score. So we put in $x = 8$ and work out $y$.\n\n' +
        'Substitute: $y = 2.5 \\times 8 + 30$.\n\n' +
        'Multiply first: $2.5 \\times 8 = 20$.\n\n' +
        'Then add: $y = 20 + 30 = 50$.',
      conclusion: 'Putting 8 hours into the line gives the answer, $50$.',
      whyWrong: [
        'This is just $2.5 \\times 8$. You forgot to add the intercept $30$.',
        'This swaps the gradient and the intercept: $30 \\times 8 + 2.5$. The number multiplying $x$ is $2.5$.',
        null,
        'This puts $8$ in for $y$ instead of $x$ and solves $8 = 2.5x + 30$. The $8$ hours is the $x$-value (revision time), so substitute it for $x$.',
      ],
      keyIdea: 'To predict from a line of best fit, decide which variable you are given (here hours, so $x$), substitute it into $y = mx + c$, and work out the other. Multiply before adding.',
    },
    check: {
      optionValues: [20, 242.5, 50, -8.8],
      compute: () => {
        const f = (x: number) => 2.5 * x + 30;
        return f(8);
      },
    },
  },
  {
    id: 'correlation-normal-008',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'The line of best fit for daily cold-drink sales $y$ against midday temperature $x$ (in degrees Celsius) is $y = 1.8x + 12$. What does the value $1.8$ tell you?',
    options: [
      'About $1.8$ drinks are sold at $0$ degrees',
      'About $1.8$ more drinks per extra degree, on average',
      'The correlation coefficient is $1.8$',
      'Temperature rises $1.8$ degrees per extra drink',
    ],
    correctIndex: 1,
    markScheme: {
      asking: 'What does the number in front of $x$ mean in this line?',
      solution:
        'The line has the form $y = mx + c$. The number $m$ in front of $x$ is the **gradient**, and it says how much $y$ changes when $x$ goes up by 1.\n\n' +
        'Here $y$ is drinks sold, $x$ is temperature and $m = 1.8$. Test it: at 20 degrees $y = 1.8 \\times 20 + 12 = 48$, and at 21 degrees $y = 1.8 \\times 21 + 12 = 49.8$, which is $1.8$ more.\n\n' +
        'So each extra degree comes with about $1.8$ more drinks sold. It is an average trend, because the line doesn\'t fit every day exactly.',
      conclusion: 'The gradient gives the change per degree, so the answer is About $1.8$ more drinks per extra degree, on average.',
      whyWrong: [
        'This describes the **intercept**, not the gradient. At $x = 0$ the line gives $y = 12$ drinks, not $1.8$.',
        null,
        'The gradient is not the correlation coefficient. In fact $r$ can never be more than $1$, so "$r = 1.8$" is impossible.',
        'This reverses the roles of the variables. The gradient tells you the change in $y$ (drinks) per unit of $x$ (temperature), not the other way round. Selling drinks does not change the weather.',
      ],
      keyIdea: 'In $y = mx + c$, read $m$ as: for each extra 1 of $x$, $y$ changes by $m$, on average. Read $c$ as the value of $y$ when $x = 0$. Use the units of both variables in your sentence.',
    },
  },
  {
    id: 'correlation-normal-009',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'The table shows Lina\'s mark in three exams, with the mean and standard deviation of her class in each. In which exam did she do best **compared with her class**?',
    table: {
      headers: ['Exam', 'Lina\'s mark', 'Class mean', 'Class SD'],
      rows: [
        ['Maths', 72, 60, 8],
        ['Physics', 80, 70, 5],
        ['English', 85, 75, 10],
      ],
    },
    options: ['Maths', 'English', 'All three equally well, since each mark is at least 10 above the mean', 'Physics'],
    correctIndex: 3,
    markScheme: {
      asking: 'In which exam was Lina furthest above her class, measured in standard deviations?',
      solution:
        'Raw marks can\'t be compared, because each exam has its own mean and spread. So turn each mark into a $z$-score: how many **standard deviations** (SD) above the mean it is.\n\n' +
        'The formula is $z = \\frac{\\text{mark} - \\text{mean}}{\\text{SD}}$. Work it out for each exam:\n\n| Exam | Mark $-$ mean | SD | $z$ |\n|---|---|---|---|\n| Maths | $72 - 60 = 12$ | 8 | $12 \\div 8 = 1.5$ |\n| Physics | $80 - 70 = 10$ | 5 | $10 \\div 5 = 2$ |\n| English | $85 - 75 = 10$ | 10 | $10 \\div 10 = 1$ |\n\n' +
        'The largest $z$-score means the best result compared with the class. The largest here is 2, in Physics.',
      conclusion: 'Lina was 2 SDs above the mean there, more than in the other exams, so the answer is Physics.',
      whyWrong: [
        'Maths has the biggest gap above the mean ($12$ marks), but marks are more spread out in Maths (SD $8$) than in Physics (SD $5$). In SD units Maths is only $z = 1.5$.',
        'English has the highest **raw** mark ($85$), but its mean and spread are also high, giving only $z = 1$, the lowest of the three.',
        'Being the same number of marks above the mean does not mean equally good, because the spreads differ. The $z$-scores are $1.5$, $2$ and $1$, which are all different.',
        null,
      ],
      keyIdea: 'To compare results from different tests, find $z = \\frac{x - \\mu}{\\sigma}$ for each one, where $x$ is the mark, $\\mu$ is the mean and $\\sigma$ is the standard deviation. The largest $z$ is the best relative result, whatever the raw marks are.',
    },
    check: {
      optionValues: ['Maths', 'English', 'equal', 'Physics'],
      compute: () => {
        const exams: [string, number, number, number][] = [
          ['Maths', 72, 60, 8],
          ['Physics', 80, 70, 5],
          ['English', 85, 75, 10],
        ];
        const zs = exams.map(([name, x, mu, s]) => ({ name, z: (x - mu) / s }));
        return zs.reduce((a, b) => (b.z > a.z ? b : a)).name;
      },
    },
  },
  {
    id: 'correlation-normal-010',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'A test has mean $65$ and standard deviation $7.5$. Sami\'s mark has a $z$-score of $-2$. What mark did Sami get?',
    options: ['$50$', '$80$', '$63$', '$61.25$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What mark is 2 standard deviations below the mean?',
      solution:
        'A $z$-score counts standard deviations from the mean, and a minus sign means below the mean. So $z = -2$ means 2 standard deviations below 65.\n\n' +
        'Find that distance. One standard deviation is $7.5$, so two are $2 \\times 7.5 = 15$.\n\n' +
        'Go down from the mean by that distance: $65 - 15 = 50$.',
      conclusion: 'Sami is 15 marks below the mean of 65, so the answer is $50$.',
      whyWrong: [
        null,
        'This ignores the minus sign and goes $2$ SDs **above** the mean: $65 + 15$. A negative $z$-score means below the mean.',
        'This adds $z$ straight onto the mean, $65 + (-2)$, forgetting that $z$ counts standard deviations: you must multiply it by $7.5$ first.',
        'This rearranges the formula wrongly, dividing by $z$ instead of multiplying: $65 + \\frac{7.5}{-2}$. The correct rearrangement is $x = \\mu + z\\sigma$.',
      ],
      keyIdea: 'To get a value from a $z$-score, use $x = \\mu + z\\sigma$, where $\\mu$ is the mean and $\\sigma$ is the standard deviation. A negative $z$ automatically subtracts.',
    },
    check: {
      optionValues: [50, 80, 63, 61.25],
      compute: () => {
        const mu = 65;
        const s = 7.5;
        const z = -2;
        return mu + z * s;
      },
    },
  },
  {
    id: 'correlation-normal-011',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'Scores in a national exam are normally distributed with mean $60$ and standard deviation $10$. Using the 68-95-99.7 rule, what percentage of candidates score **more than** $80$?',
    options: ['5%', '2.5%', '47.5%', '97.5%'],
    correctIndex: 1,
    markScheme: {
      asking: 'What percentage of candidates score above 80?',
      solution:
        'See how far 80 is from the mean, in **standard deviations** (SD): $\\frac{80 - 60}{10} = 2$. So 80 is 2 SDs above the mean.\n\n' +
        'The 68-95-99.7 rule says 95% of a normal distribution lies within 2 SDs of the mean, here between 40 and 80. So $100\\% - 95\\% = 5\\%$ lies outside.\n\n' +
        'The normal curve is symmetrical, so that 5% is split equally between its two **tails** (the far ends): below 40 and above 80. The top tail is $5\\% \\div 2 = 2.5\\%$.',
      conclusion: 'Half of the 5% outside lies above 80, so the answer is 2.5%.',
      whyWrong: [
        '5% is the total of **both** tails (below $40$ and above $80$). Only the upper tail is wanted, so halve it.',
        null,
        '47.5% is the percentage **between** the mean ($60$) and $80$, not above $80$.',
        '97.5% is the percentage **below** $80$. "More than $80$" is the small upper tail.',
      ],
      keyIdea: 'For "more than" on a normal curve, find how many SDs the value is from the mean. Take the percentage outside that range, then halve it for one tail.',
    },
    check: {
      optionValues: [5, 2.5, 47.5, 97.5],
      compute: () => above((80 - 60) / 10),
    },
  },
  {
    id: 'correlation-normal-012',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'Which statement about the correlation coefficient $r$ is **true**?',
    options: [
      '$r = 0$ means no relationship of any kind',
      '$r = 0.9$ proves that one variable causes the other',
      '$r = -0.8$ is a stronger linear relationship than $r = 0.6$',
      'A negative $r$ means a weak relationship',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'Which statement about $r$ is correct?',
      solution:
        'The **correlation coefficient** $r$ has a sign and a size. The sign gives the direction: plus means up, minus means down. The size, ignoring the sign, gives the strength.\n\n' +
        'Test each statement:\n\n| Statement | True? | Why |\n|---|---|---|\n| $r = 0$ means no relationship at all | No | $r$ only detects straight lines, so a U-shape can give 0 |\n| $r = 0.9$ proves cause | No | A third factor could drive both |\n| $r = -0.8$ is stronger than $r = 0.6$ | Yes | Ignoring signs, $0.8$ is bigger than $0.6$ |\n| A negative $r$ means weak | No | The sign only gives the direction |',
      conclusion: 'Strength ignores the sign, so $r = -0.8$ is a stronger linear relationship than $r = 0.6$.',
      whyWrong: [
        '$r$ only detects straight-line patterns. Variables can have a strong curved relationship (for example a U-shape) and still have $r = 0$.',
        'No value of $r$ proves cause and effect. A third variable could be driving both, or it could be a coincidence.',
        null,
        'This confuses direction with strength. The sign only tells you the direction (downhill); $r = -0.95$ is a very strong correlation.',
      ],
      keyIdea: 'To compare strength, drop the minus sign and compare sizes. Closer to 1 is stronger, whatever the direction. Keep in mind that $r$ measures only straight-line patterns and never proves a cause.',
    },
  },
  {
    id: 'correlation-normal-013',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'The correlation between height in cm and weight in kg is $r = 0.72$. Heights are converted to inches (divide by $2.54$) and weights to pounds (multiply by $2.2$). What is $r$ for the converted data?',
    options: ['$0.72$', '$1.83$', '$0.28$', '$-0.72$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What happens to $r$ when the units change?',
      solution:
        'The **correlation coefficient** $r$ measures how close the points are to a straight line. It has no units.\n\n' +
        'Converting units multiplies all the heights by one number and all the weights by another. This just stretches the axes: each point moves, but the pattern keeps its shape.\n\n' +
        'Both multipliers are positive ($\\frac{1}{2.54}$ and $2.2$), so taller people are still heavier and the direction doesn\'t flip. So $r$ stays the same.',
      conclusion: 'Changing units changes neither the pattern nor its direction, so the answer is $0.72$.',
      whyWrong: [
        null,
        'This multiplies $r$ by $2.54$ ($0.72 \\times 2.54 \\approx 1.83$) as if $r$ had units. It cannot be right anyway: $r$ can never be bigger than $1$.',
        'This divides $r$ by $2.54$ ($0.72 \\div 2.54 \\approx 0.28$) as if $r$ had units. $r$ has no units, so changing units does not change it.',
        'Making the height numbers smaller does not reverse the trend. Both variables are multiplied by **positive** numbers, so taller people are still heavier and $r$ stays positive.',
      ],
      keyIdea: 'Multiplying a variable by a positive number, or adding a number to it, doesn\'t change $r$. Multiplying one variable by a negative number flips the sign of $r$ but keeps its size.',
    },
    check: {
      optionValues: [0.72, 1.83, 0.28, -0.72],
      compute: () => {
        // any data set shows the effect: r after the change / r before = 1
        const raw = [
          { x: 160, y: 58 }, { x: 165, y: 66 }, { x: 170, y: 64 }, { x: 175, y: 75 }, { x: 180, y: 71 }, { x: 185, y: 82 },
        ];
        const conv = raw.map((p) => ({ x: p.x / 2.54, y: p.y * 2.2 }));
        return 0.72 * (pearson(conv) / pearson(raw));
      },
    },
  },
  {
    id: 'correlation-normal-014',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'A line of best fit has gradient $3$ and passes through the mean point $(\\bar{x}, \\bar{y}) = (4, 20)$. Use it to predict $y$ when $x = 6$.',
    options: ['$18$', '$26$', '$38$', '$22$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What does the line predict for $y$ at $x = 6$?',
      solution:
        'The **gradient** is how much $y$ changes when $x$ goes up by 1. Here it is 3.\n\n' +
        'We know one point on the line, $(4, 20)$. Moving from $x = 4$ to $x = 6$ is a change of $6 - 4 = 2$.\n\n' +
        'So $y$ changes by gradient $\\times$ change in $x$: $3 \\times 2 = 6$.\n\n' +
        'Add that to the $y$ we started from: $y = 20 + 6 = 26$.',
      conclusion: 'Starting at 20 and adding 6 gives the answer, $26$.',
      whyWrong: [
        'This is just $3 \\times 6$, as if the line went through the origin. You need the intercept, found from the mean point: $c = 8$.',
        null,
        'This uses $\\bar{y} = 20$ as the intercept: $3 \\times 6 + 20$. The intercept is the value of $y$ at $x = 0$, not at $x = 4$.',
        'This adds the change in $x$ straight onto $\\bar{y}$: $20 + 2$. Each step of $1$ in $x$ changes $y$ by the gradient $3$, so the change is $3 \\times 2 = 6$.',
      ],
      keyIdea: 'Given a gradient $m$ and a point $(\\bar{x}, \\bar{y})$, use $y = \\bar{y} + m(x - \\bar{x})$. That is: start at the known point, then add gradient times the change in $x$.',
    },
    check: {
      optionValues: [18, 26, 38, 22],
      compute: () => {
        const m = 3;
        const c = 20 - m * 4;
        return m * 6 + c;
      },
    },
  },
  {
    id: 'correlation-normal-015',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'The scatter plot shows 9 data points, including one point far from the others. If that one outlier is removed, what happens to the correlation coefficient $r$?',
    chart: {
      kind: 'scatter',
      title: 'Data with one outlier',
      xLabel: 'x',
      yLabel: 'y',
      points: [...outlierBase, outlierPoint],
    },
    options: [
      '$r$ increases, moving closer to $1$',
      '$r$ does not change, because one point cannot affect $r$',
      '$r$ becomes negative',
      '$r$ decreases towards $0$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'What happens to $r$ if the point far from the pattern is removed?',
      solution:
        '$r$ measures how close points are to a straight line. A value near 1 means a tight line going up.\n\n' +
        'Eight of the points rise steadily from $(1, 3)$ to $(8, 17)$, very close to a straight line. The ninth point, $(9, 2)$, is far below that pattern. A point like this is called an **outlier**.\n\n' +
        'That one point stops the whole set from fitting a straight line well, which keeps $r$ low.\n\n' +
        'Without it, the other eight points fit a rising line almost perfectly. Working it out, $r$ goes up from about $0.44$ to about $0.996$.',
      conclusion: 'Removing the outlier leaves a tight rising line, so $r$ increases, moving closer to $1$.',
      whyWrong: [
        null,
        'A single outlier can change $r$ a lot, especially one far from the trend. Here $r$ jumps from about $0.44$ to about $0.996$.',
        'The remaining 8 points slope clearly **upwards**, so $r$ stays positive. If anything it is the outlier that pulls $r$ down.',
        'This gets the direction backwards. The outlier is the point that **weakens** the pattern; removing it makes the linear pattern stronger, so $r$ moves towards $1$, not $0$.',
      ],
      keyIdea: 'To judge an outlier\'s effect, picture the plot without it. If the other points form a tight line and the outlier sits off it, removing it moves $r$ towards 1 or $-1$.',
    },
    check: {
      optionValues: ['increase', 'same', 'negative', 'decrease'],
      compute: () => {
        const withOut = pearson([...outlierBase, outlierPoint]);
        const without = pearson(outlierBase);
        if (without < 0) return 'negative';
        if (Math.abs(without - withOut) < 1e-9) return 'same';
        return without > withOut ? 'increase' : 'decrease';
      },
    },
  },
  {
    id: 'correlation-normal-016',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'A line of best fit $h = 3w + 4$ is found for plants aged $2$ to $10$ weeks, with height $h$ in cm and age $w$ in weeks. Which prediction is the **least reliable**?',
    options: [
      'The height at $5$ weeks, $19$ cm',
      'The height at $9$ weeks, $31$ cm',
      'The height at $30$ weeks, $94$ cm',
      'The height at $2.5$ weeks, $11.5$ cm',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'Which prediction goes furthest beyond the data the line came from?',
      solution:
        'The line was found from plants aged 2 to 10 weeks. Predicting inside that range is called **interpolation**, and it is usually reliable.\n\n' +
        'Predicting outside the range is called **extrapolation**. It assumes the trend carries on, and we have no data to show that. Plants don\'t keep growing at the same rate for ever.\n\n' +
        'Check each age against the range of 2 to 10 weeks. 5, 9 and $2.5$ weeks are all inside, but 30 weeks is far outside.',
      conclusion: '30 weeks is far beyond the data, so the least reliable is The height at $30$ weeks, $94$ cm.',
      whyWrong: [
        '$5$ weeks is inside the data range of $2$ to $10$ weeks, so this is interpolation and is reasonably reliable.',
        '$9$ weeks is still inside the data range ($2$ to $10$ weeks). Being near the end of the range is fine; only going **beyond** it is extrapolation.',
        null,
        '$2.5$ weeks is not a whole number, but it is still inside the range $2$ to $10$ weeks, so the prediction is interpolation and is reliable.',
      ],
      keyIdea: 'Compare the $x$-value with the range of the data. Inside the range is interpolation, which is reasonably reliable. Outside it is extrapolation, which is unreliable, and the further outside the worse.',
    },
    check: {
      optionValues: [5, 9, 30, 2.5],
      compute: () => {
        // the least reliable prediction is the age furthest outside the data range 2 to 10 weeks
        const lo = 2;
        const hi = 10;
        const outside = (w: number) => Math.max(0, lo - w, w - hi);
        return [5, 9, 30, 2.5].reduce((a, b) => (outside(b) > outside(a) ? b : a));
      },
    },
  },
  {
    id: 'correlation-normal-018',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'For a set of paired data, $S_{xx} = \\sum (x - \\bar{x})^2 = 16$, $S_{yy} = \\sum (y - \\bar{y})^2 = 64$ and $S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y}) = -24$. What is the correlation coefficient $r$?',
    options: ['$-0.75$', '$-1.5$', '$0.75$', '$-0.3$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is $r$, given these three sums?',
      solution:
        'The **correlation coefficient** $r$ compares how $x$ and $y$ vary together with how much each varies alone. The formula is:\n\n$$r = \\frac{S_{xy}}{\\sqrt{S_{xx} \\times S_{yy}}}$$\n\n' +
        'Substitute the values from the question: $r = \\frac{-24}{\\sqrt{16 \\times 64}}$.\n\n' +
        'Work out the bottom: $\\sqrt{16 \\times 64} = \\sqrt{16} \\times \\sqrt{64} = 4 \\times 8 = 32$.\n\n' +
        'Divide: $r = \\frac{-24}{32} = -0.75$.',
      conclusion: 'Dividing $-24$ by 32 gives the answer, $-0.75$.',
      whyWrong: [
        null,
        'This is $\\frac{S_{xy}}{S_{xx}} = \\frac{-24}{16}$, which is the **gradient** of the regression line, not $r$. It cannot be $r$ anyway, because $r$ is never below $-1$.',
        'This drops the minus sign. $S_{xy}$ is negative, so $r$ must be negative too.',
        'This adds instead of multiplying under the square root and forgets the root: $\\frac{-24}{16 + 64}$. The bottom should be $\\sqrt{16 \\times 64} = 32$.',
      ],
      keyIdea: 'Use $r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}$. The sign of $r$ comes from $S_{xy}$, because the bottom is always positive. If your result is outside $-1$ to 1, the working has gone wrong.',
    },
    check: {
      optionValues: [-0.75, -1.5, 0.75, -0.3],
      compute: () => {
        const sxx = 16;
        const syy = 64;
        const sxy = -24;
        return sxy / Math.sqrt(sxx * syy);
      },
    },
  },
  {
    id: 'correlation-normal-019',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'Race times of $400$ runners are normally distributed with mean $14$ s and standard deviation $0.5$ s. Runners qualify with a time **under** $13$ s. By the 68-95-99.7 rule, about how many qualify?',
    options: ['$20$', '$10$', '$190$', '$390$'],
    correctIndex: 1,
    markScheme: {
      asking: 'About how many of the 400 runners finish in under 13 s?',
      solution:
        'See how far 13 is from the mean, in **standard deviations** (SD): $\\frac{14 - 13}{0.5} = 2$. So 13 s is 2 SDs below the mean.\n\n' +
        'The 68-95-99.7 rule says 95% of a normal distribution lies within 2 SDs of the mean. So $100\\% - 95\\% = 5\\%$ lies outside, shared equally between the two ends of the curve.\n\n' +
        'Only the fast end counts, because a lower time means a faster runner. That is half of 5%: $5\\% \\div 2 = 2.5\\%$.\n\n' +
        'Find 2.5% of 400: $0.025 \\times 400 = 10$.',
      conclusion: '2.5% of the 400 runners are faster than 13 s, so the answer is $10$.',
      whyWrong: [
        'This uses 5% of $400$, which counts **both** tails (very fast and very slow runners). Only times under $13$ s qualify, which is half of that.',
        null,
        'This uses 47.5% of $400$: the runners between $13$ s and the mean $14$ s, not those faster than $13$ s.',
        'This uses 97.5% of $400$: the runners slower than $13$ s. Qualifying needs a time **less than** $13$ s.',
      ],
      keyIdea: 'To count people from the 68-95-99.7 rule, turn the cut-off into SDs from the mean, find the percentage on the side asked for, then multiply it by the total number.',
    },
    check: {
      optionValues: [20, 10, 190, 390],
      compute: () => {
        const z = (13 - 14) / 0.5; // -2
        return (above(z) / 100) * 400;
      },
    },
  },
  {
    id: 'correlation-normal-021',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'Aisha scored $78$ on test A (mean $66$, standard deviation $8$). Test B has mean $50$ and standard deviation $12$. What score on test B is **equally good** compared with the other candidates?',
    options: ['$62$', '$84$', '$18$', '$68$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What mark on test B matches Aisha\'s position on test A?',
      solution:
        'Scores on different tests can be compared using the $z$-score: how many standard deviations a score is from the mean. Equally good means the same $z$-score.\n\n' +
        'Find Aisha\'s $z$-score on test A: $z = \\frac{78 - 66}{8} = \\frac{12}{8} = 1.5$.\n\n' +
        'On test B, we want the score $1.5$ standard deviations above the mean. That distance is $1.5 \\times 12 = 18$ marks.\n\n' +
        'Add it to test B\'s mean: $50 + 18 = 68$.',
      conclusion: 'Both scores are $1.5$ standard deviations above their mean, so the answer is $68$.',
      whyWrong: [
        'This keeps the same **raw** gap of $12$ marks above the mean ($50 + 12$). Test B is more spread out (SD $12$ instead of $8$), so the same relative position needs a bigger gap, $1.5 \\times 12 = 18$.',
        'This mixes up the tests: it uses test A\'s mean with test B\'s standard deviation, $66 + 1.5 \\times 12$. Use test B\'s mean, $50$.',
        'This works out $1.5 \\times 12 = 18$ correctly, but that is only the distance above the mean. You must add it to the mean of test B: $50 + 18$.',
        null,
      ],
      keyIdea: 'To match performance across tests, find $z = \\frac{x - \\mu}{\\sigma}$ on the first test, where $x$ is the mark, $\\mu$ is the mean and $\\sigma$ is the standard deviation. Then use $x = \\mu + z\\sigma$ with the mean and standard deviation of the second.',
    },
    check: {
      optionValues: [62, 84, 18, 68],
      compute: () => {
        const z = (78 - 66) / 8;
        return 50 + z * 12;
      },
    },
  },
  {
    id: 'correlation-normal-022',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'A correlation coefficient of $r = -1$ means:',
    options: ['Perfect negative linear correlation', 'Perfect positive linear correlation', 'No correlation', 'Weak negative correlation'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does $r = -1$ tell us?',
      solution:
        '$r$, the **correlation coefficient**, has a sign and a size. The minus sign says the pattern goes down: as $x$ goes up, $y$ goes down.\n\n' +
        'The size is 1, the biggest possible. That means every point lies exactly on a straight line.',
      conclusion: 'A line going down with every point on it is Perfect negative linear correlation.',
      whyWrong: [
        null,
        'Perfect positive correlation is $r = +1$, where the points lie on a line that slopes upwards.',
        'No linear correlation is $r = 0$. Here the size of $r$ is as large as it can be.',
        'A negative sign gives the direction, not the strength. $|r| = 1$ is the strongest value possible.',
      ],
      keyIdea: 'Read $r$ in two parts. Sign: plus goes up, minus goes down. Size: 1 is a perfect line, and close to 0 is no straight-line pattern. Then join the two parts into a description.',
    },
    check: {
      optionValues: [-1, 1, 0, -0.3],
      compute: () => pearson([1, 2, 3, 4].map((x) => ({ x, y: 10 - 2 * x }))),
    },
  },
  {
    id: 'correlation-normal-023',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'In a normal distribution, how do the mean, median and mode compare?',
    options: ['All three are equal', '$\\text{mean} > \\text{median} > \\text{mode}$', '$\\text{mode} > \\text{median} > \\text{mean}$', 'They have no fixed relationship'],
    correctIndex: 0,
    markScheme: {
      asking: 'Where do the mean, median and mode sit on a normal curve?',
      solution:
        'A normal curve is a symmetrical bell shape with one peak in the middle. Its left and right sides are mirror images.\n\n' +
        'The **mode** is the most common value, so it is at the peak. The **median** splits the area in half, and the **mean** is the balance point. By symmetry, both of those are on the centre line, which runs through the peak.',
      conclusion: 'All three land on the line of symmetry, so the answer is All three are equal.',
      whyWrong: [
        null,
        'This order describes a distribution with a long tail to the right. A normal curve has no skew.',
        'This order describes a distribution with a long tail to the left. A normal curve has no skew.',
        'Symmetry fixes the relationship: all three sit on the line of symmetry.',
      ],
      keyIdea: 'A symmetrical curve has mean $=$ median $=$ mode. A long tail to the right (a few very large values) pulls the mean up most, so mean $>$ median $>$ mode. A long tail to the left reverses this.',
    },
  },
  {
    id: 'correlation-normal-024',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'A value has a $z$-score of $0$. What does this mean?',
    options: ['It equals the mean', 'It equals $0$', 'It is one standard deviation above the mean', 'It is the smallest value'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does a $z$-score of 0 tell you about a value?',
      solution:
        'A $z$-score says how many standard deviations a value is from the mean. The formula is $z = \\frac{x - \\mu}{\\sigma}$, where $x$ is the value, $\\mu$ is the mean and $\\sigma$ is the standard deviation.\n\n' +
        'If $z = 0$, the top of the fraction must be 0. So $x - \\mu = 0$, which gives $x = \\mu$. For example, with mean 70, a mark of 70 has $z = 0$.',
      conclusion: 'A $z$-score of 0 means no distance from the mean, so the answer is It equals the mean.',
      whyWrong: [
        null,
        'This confuses the value with its $z$-score. With mean $70$, a mark of $70$ has $z = 0$.',
        'One standard deviation above the mean is $z = 1$.',
        'A $z$-score of $0$ sits in the middle. Values below the mean have negative $z$-scores.',
      ],
      keyIdea: 'Read a $z$-score as a distance from the mean. Positive is above, negative is below, and 0 is exactly at the mean. It tells you nothing about the size of the value itself.',
    },
  },
  {
    id: 'correlation-normal-025',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    stem: 'The **standard normal distribution** has which mean and standard deviation?',
    options: ['Mean $0$, standard deviation $1$', 'Mean $1$, standard deviation $0$', 'Mean $0$, standard deviation $0$', 'Mean $1$, standard deviation $1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What are the mean and standard deviation of the standard normal distribution?',
      solution:
        'The **standard normal distribution** is what you get after turning every value of a normal distribution into a $z$-score, using $z = \\frac{x - \\mu}{\\sigma}$.\n\n' +
        'A value at the old mean gets $z = 0$, so the new mean is 0. A value one standard deviation above the mean gets $z = 1$, so the new standard deviation is 1.',
      conclusion: 'Turning values into $z$-scores gives Mean $0$, standard deviation $1$.',
      whyWrong: [
        null,
        'This swaps the two values. A standard deviation of $0$ would mean no spread at all.',
        'A standard deviation of $0$ would mean that every value equals the mean, which is not a normal curve.',
        'The mean is $0$: $z$-scores are measured from the centre of the data.',
      ],
      keyIdea: 'Any normal distribution can be changed to the standard normal with $z = \\frac{x - \\mu}{\\sigma}$. In this form, $z$ is simply the number of standard deviations from the centre, which is why the 68-95-99.7 rule fits every normal curve.',
    },
  },];
