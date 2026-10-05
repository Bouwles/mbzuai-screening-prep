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
      solution:
        'Read the plot from left to right.\n\n' +
        '1. **Direction:** as TV time increases, the test scores go **down**. When one variable goes up while the other goes down, the correlation is **negative**.\n' +
        '2. **Strength:** the points lie close to a straight line sloping downwards (very little scatter), so the correlation is **strong**.\n\n' +
        'So the plot shows a **strong negative correlation**. (For these points $r \\approx -0.99$.)',
      whyWrong: [
        'This gets the direction backwards. Positive correlation means both variables rise together, but here the scores **fall** as TV time rises.',
        null,
        'There clearly is a pattern: the points follow a downward line. "No correlation" would look like a random cloud with no trend.',
        'This is wrong on both counts: the trend slopes **down** (negative), and the points sit tightly around a line (strong, not weak).',
      ],
      keyIdea: 'Direction comes from the slope of the cloud (up = positive, down = negative); strength comes from how tightly the points hug a straight line.',
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
      solution:
        'The correlation coefficient always lies between $-1$ and $1$:\n\n' +
        '$$-1 \\le r \\le 1$$\n\n' +
        '- $-0.95$ is allowed (a strong negative correlation).\n' +
        '- $0$ is allowed (no linear correlation).\n' +
        '- $0.6$ is allowed (a moderate positive correlation).\n' +
        '- $1.3$ is bigger than $1$, so it is **impossible**.',
      whyWrong: [
        'A value of $-0.95$ is allowed: negative values of $r$ are fine, they just mean the correlation is negative. It is very close to $-1$, so it is a strong negative correlation.',
        '$r = 0$ is allowed: it means there is no linear relationship between the variables.',
        '$r = 0.6$ is inside the range $-1 \\le r \\le 1$, so it is a perfectly possible (moderate positive) correlation.',
        null,
      ],
      keyIdea: 'The correlation coefficient is always between $-1$ and $1$ inclusive; anything outside that range is impossible.',
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
      solution:
        'The $z$-score tells you how many standard deviations a value is above (or below) the mean:\n\n' +
        '$$z = \\frac{x - \\mu}{\\sigma}$$\n\n' +
        'Here $x = 82$, $\\mu = 70$, $\\sigma = 8$.\n\n' +
        '1. Distance from the mean: $82 - 70 = 12$.\n' +
        '2. Divide by the standard deviation: $\\frac{12}{8} = 1.5$.\n\n' +
        'So $z = 1.5$: Omar scored one and a half standard deviations above the mean.',
      whyWrong: [
        'This is only the distance from the mean, $82 - 70 = 12$. You must then divide by the standard deviation $8$.',
        null,
        'This is the fraction upside down, $\\frac{8}{12}$. The distance from the mean goes on top: $\\frac{12}{8}$.',
        'This subtracts the wrong way round, $\\frac{70 - 82}{8}$. Omar is **above** the mean, so his $z$-score must be positive.',
      ],
      keyIdea: '$z = \\frac{x - \\mu}{\\sigma}$: subtract the mean, then divide by the standard deviation.',
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
    stem: 'The heights of adult men in a town are normally distributed with mean $170$ cm and standard deviation $6$ cm. According to the 68-95-99.7 rule, roughly what percentage of the men are between $164$ cm and $176$ cm tall?',
    options: ['95%', '34%', '68%', '99.7%'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work out how many standard deviations each end is from the mean.\n\n' +
        '- $164 = 170 - 6$, which is $1$ SD **below** the mean ($z = -1$).\n' +
        '- $176 = 170 + 6$, which is $1$ SD **above** the mean ($z = 1$).\n\n' +
        'The 68-95-99.7 rule says about **68%** of values lie within $1$ SD of the mean.\n\n' +
        'So about 68% of the men are between $164$ cm and $176$ cm.',
      whyWrong: [
        '95% is the figure for within **2** SDs of the mean (here $158$ to $182$ cm). The interval $164$ to $176$ is only $6$ cm, which is $1$ SD, either side.',
        '34% is only **half** of the interval: from the mean $170$ up to $176$. The question covers both sides of the mean.',
        null,
        '99.7% is the figure for within **3** SDs of the mean ($152$ to $188$ cm), far wider than this interval.',
      ],
      keyIdea: 'Within 1, 2 and 3 standard deviations of the mean lie about 68%, 95% and 99.7% of a normal distribution.',
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
    stem: 'Over one year, a city recorded daily ice-cream sales and the daily number of people needing rescue at its beaches. The correlation coefficient was $r = 0.9$. Which conclusion is valid?',
    options: [
      'The two variables tend to rise together, but this does not show that one causes the other; hot weather could increase both.',
      'Eating ice cream causes people to get into trouble while swimming.',
      'Banning ice-cream sales would reduce the number of beach rescues.',
      'Because $r$ is not exactly $1$, there is no real relationship between the two variables.',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '$r = 0.9$ is close to $1$, so there is a **strong positive correlation**: on days with more ice-cream sales there tend to be more rescues.\n\n' +
        'But **correlation is not causation**. A strong correlation only says the variables move together. Here a third (hidden or *confounding*) variable, **hot weather**, makes people buy ice cream **and** makes more people go swimming. Ice cream itself does not cause the rescues.\n\n' +
        'So the only valid conclusion is that the variables rise together, without claiming cause and effect.',
      whyWrong: [
        null,
        'This claims cause and effect from a correlation. A strong $r$ does not prove causation; hot weather drives both variables.',
        'This also assumes ice cream **causes** the rescues. Since hot weather is the real driver, banning ice cream would not change how many people swim.',
        'A relationship does not need $r = 1$ to be real. $r = 1$ means a *perfect* straight line; $r = 0.9$ is still a strong positive correlation.',
      ],
      keyIdea: 'Correlation is not causation: a strong $r$ shows the variables move together, which may be due to a third, confounding variable.',
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
      solution:
        'Decide the **sign** first, then the **size**.\n\n' +
        '1. **Sign:** as screen time increases, sleep tends to decrease, so the correlation is negative. That rules out $0.7$ and $0$.\n' +
        '2. **Size:** the points show a clear downward trend, but they do **not** lie exactly on a straight line. $r = -1$ would need every point exactly on a line. So the correlation is negative but not perfect.\n\n' +
        'The best match is $r = -0.7$, a fairly strong negative correlation. (The exact value for these points is $r \\approx -0.74$.)',
      whyWrong: [
        '$r = -1$ means **perfect** negative correlation, with every point exactly on a straight line. These points are scattered around the trend, so $r$ is not $-1$.',
        '$r = 0$ means no linear trend at all, but these points clearly drift downwards.',
        'This has the right size but the wrong sign. Sleep goes **down** as screen time goes up, so $r$ must be negative.',
        null,
      ],
      keyIdea: 'Find the sign from the direction of the trend, then judge the size by how tightly the points hug a line ($\\pm 1$ only for a perfect line).',
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
    stem: 'The scatter plot shows hours spent revising, $x$, and test score, $y$, for 9 students. The line of best fit is $y = 2.5x + 30$. Use it to predict the score of a student who revises for $8$ hours.',
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
      solution:
        'To predict $y$ from the line of best fit, substitute the value of $x$.\n\n' +
        '$$y = 2.5 \\times 8 + 30$$\n\n' +
        '1. Multiply: $2.5 \\times 8 = 20$.\n' +
        '2. Add the intercept: $20 + 30 = 50$.\n\n' +
        'The predicted score is $50$. This is sensible: $x = 8$ lies inside the range of the data ($1$ to $10$ hours), and the line passes near $50$ there on the graph.',
      whyWrong: [
        'This is just $2.5 \\times 8$. You forgot to add the intercept $30$.',
        'This swaps the gradient and the intercept: $30 \\times 8 + 2.5$. The number multiplying $x$ is $2.5$.',
        null,
        'This puts $8$ in for $y$ instead of $x$ and solves $8 = 2.5x + 30$. The $8$ hours is the $x$-value (revision time), so substitute it for $x$.',
      ],
      keyIdea: 'To predict with a line of best fit $y = mx + c$, substitute the given $x$ into the equation.',
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
    stem: 'A shop finds that the line of best fit for daily cold-drink sales, $y$, against midday temperature in degrees Celsius, $x$, is $y = 1.8x + 12$. What does the value $1.8$ tell you?',
    options: [
      'When the temperature is $0$ degrees, about $1.8$ drinks are sold.',
      'For each extra degree of temperature, about $1.8$ more drinks are sold on average.',
      'The correlation coefficient is $1.8$, so the correlation is very strong.',
      'For each extra drink sold, the temperature rises by about $1.8$ degrees.',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'In a line of best fit $y = mx + c$:\n\n' +
        '- the **gradient** $m$ is the change in $y$ for each increase of $1$ in $x$;\n' +
        '- the **intercept** $c$ is the predicted $y$ when $x = 0$.\n\n' +
        'Here $m = 1.8$, $x$ is temperature and $y$ is drinks sold. So each extra degree is associated with about $1.8$ more drinks sold, on average. (The intercept $12$ means about $12$ drinks at $0$ degrees.)',
      whyWrong: [
        'This describes the **intercept**, not the gradient. At $x = 0$ the line gives $y = 12$ drinks, not $1.8$.',
        null,
        'The gradient is not the correlation coefficient. In fact $r$ can never be more than $1$, so "$r = 1.8$" is impossible.',
        'This reverses the roles of the variables. The gradient tells you the change in $y$ (drinks) per unit of $x$ (temperature), not the other way round. Selling drinks does not change the weather.',
      ],
      keyIdea: 'The gradient of a line of best fit is the change in $y$ for each one-unit increase in $x$; the intercept is the value of $y$ when $x = 0$.',
    },
  },
  {
    id: 'correlation-normal-009',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'Lina\'s results in three exams are shown in the table, together with the mean and standard deviation of the whole class in each exam. In which exam did Lina do best **compared with her class**?',
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
      solution:
        'To compare across different exams, convert each mark to a $z$-score, $z = \\frac{x - \\mu}{\\sigma}$.\n\n' +
        '| Exam | Working | $z$ |\n' +
        '| --- | --- | --- |\n' +
        '| Maths | $\\frac{72 - 60}{8} = \\frac{12}{8}$ | $1.5$ |\n' +
        '| Physics | $\\frac{80 - 70}{5} = \\frac{10}{5}$ | $2$ |\n' +
        '| English | $\\frac{85 - 75}{10} = \\frac{10}{10}$ | $1$ |\n\n' +
        'The highest $z$-score is Physics ($z = 2$): Lina was 2 standard deviations above her class there.\n\n' +
        'So she did best, relative to the class, in **Physics**.',
      whyWrong: [
        'Maths has the biggest gap above the mean ($12$ marks), but marks are more spread out in Maths (SD $8$) than in Physics (SD $5$). In SD units Maths is only $z = 1.5$.',
        'English has the highest **raw** mark ($85$), but its mean and spread are also high, giving only $z = 1$, the lowest of the three.',
        'Being the same number of marks above the mean does not mean equally good, because the spreads differ. The $z$-scores are $1.5$, $2$ and $1$, which are all different.',
        null,
      ],
      keyIdea: 'To compare scores from different distributions, compare $z$-scores, not raw marks or raw gaps.',
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
      solution:
        'Rearrange $z = \\frac{x - \\mu}{\\sigma}$ to make $x$ the subject:\n\n' +
        '$$x = \\mu + z\\sigma$$\n\n' +
        '1. $z\\sigma = -2 \\times 7.5 = -15$, so Sami is $15$ marks **below** the mean.\n' +
        '2. $x = 65 - 15 = 50$.\n\n' +
        'Check: $\\frac{50 - 65}{7.5} = \\frac{-15}{7.5} = -2$. Sami got $50$.',
      whyWrong: [
        null,
        'This ignores the minus sign and goes $2$ SDs **above** the mean: $65 + 15$. A negative $z$-score means below the mean.',
        'This adds $z$ straight onto the mean, $65 + (-2)$, forgetting that $z$ counts standard deviations: you must multiply it by $7.5$ first.',
        'This rearranges the formula wrongly, dividing by $z$ instead of multiplying: $65 + \\frac{7.5}{-2}$. The correct rearrangement is $x = \\mu + z\\sigma$.',
      ],
      keyIdea: 'To turn a $z$-score back into a value, use $x = \\mu + z\\sigma$ (a negative $z$ means below the mean).',
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
      solution:
        '1. Convert to a $z$-score: $z = \\frac{80 - 60}{10} = 2$, so $80$ is $2$ SDs above the mean.\n' +
        '2. About 95% of scores lie within $2$ SDs of the mean (between $40$ and $80$).\n' +
        '3. That leaves $100\\% - 95\\% = 5\\%$ outside, split **equally** between the two tails because the normal curve is symmetric.\n' +
        '4. Upper tail: $\\frac{5\\%}{2} = 2.5\\%$.\n\n' +
        'So 2.5% of candidates score more than $80$.',
      whyWrong: [
        '5% is the total of **both** tails (below $40$ and above $80$). Only the upper tail is wanted, so halve it.',
        null,
        '47.5% is the percentage **between** the mean ($60$) and $80$, not above $80$.',
        '97.5% is the percentage **below** $80$. "More than $80$" is the small upper tail.',
      ],
      keyIdea: 'Outside $k$ SDs is $100\\%$ minus the rule figure, and by symmetry each tail gets half of it.',
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
      '$r = 0$ means there is no relationship of any kind between the two variables.',
      '$r = 0.9$ proves that changes in one variable cause changes in the other.',
      '$r = -0.8$ shows a stronger linear relationship than $r = 0.6$.',
      'A negative value of $r$ means the relationship is weak.',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Check each statement.\n\n' +
        '- **Strength** depends on the size of $r$ (how close it is to $\\pm 1$), ignoring the sign. Since $0.8 > 0.6$, $r = -0.8$ is stronger than $r = 0.6$. **True.**\n' +
        '- $r$ only measures **linear** (straight-line) relationships. A perfect U-shaped pattern can have $r = 0$, so $r = 0$ does not mean "no relationship of any kind". False.\n' +
        '- Correlation never proves causation, however large $r$ is. False.\n' +
        '- The **sign** of $r$ gives the direction, not the strength: $r = -0.95$ is very strong. False.',
      whyWrong: [
        '$r$ only detects straight-line patterns. Variables can have a strong curved relationship (for example a U-shape) and still have $r = 0$.',
        'No value of $r$ proves cause and effect. A third variable could be driving both, or it could be a coincidence.',
        null,
        'This confuses direction with strength. The sign only tells you the direction (downhill); $r = -0.95$ is a very strong correlation.',
      ],
      keyIdea: 'The sign of $r$ gives the direction and the size $|r|$ gives the strength of a linear relationship; $r$ never proves causation.',
    },
  },
  {
    id: 'correlation-normal-013',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    stem: 'For a group of adults, the correlation between height (in cm) and weight (in kg) is $r = 0.72$. All the heights are converted to inches (divide by $2.54$) and all the weights to pounds (multiply by $2.2$). What is the correlation coefficient for the converted data?',
    options: ['$0.72$', '$1.83$', '$0.28$', '$-0.72$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The correlation coefficient has **no units**. It measures how closely the points follow a straight line, not the size of the numbers.\n\n' +
        'Changing units multiplies every height by the same positive number and every weight by the same positive number. This just stretches the scatter plot horizontally and vertically: the points keep exactly the same pattern, and taller people are still heavier.\n\n' +
        'So $r$ is unchanged: $r = 0.72$.',
      whyWrong: [
        null,
        'This multiplies $r$ by $2.54$ ($0.72 \\times 2.54 \\approx 1.83$) as if $r$ had units. It cannot be right anyway: $r$ can never be bigger than $1$.',
        'This divides $r$ by $2.54$ ($0.72 \\div 2.54 \\approx 0.28$) as if $r$ had units. $r$ has no units, so changing units does not change it.',
        'Making the height numbers smaller does not reverse the trend. Both variables are multiplied by **positive** numbers, so taller people are still heavier and $r$ stays positive.',
      ],
      keyIdea: 'The correlation coefficient has no units: multiplying a variable by a positive constant (or adding a constant) does not change $r$.',
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
      solution:
        'The line of best fit always passes through the mean point $(\\bar{x}, \\bar{y})$.\n\n' +
        '1. Write the line as $y = 3x + c$.\n' +
        '2. Substitute the mean point $(4, 20)$: $20 = 3 \\times 4 + c = 12 + c$, so $c = 8$.\n' +
        '3. The line is $y = 3x + 8$.\n' +
        '4. At $x = 6$: $y = 3 \\times 6 + 8 = 18 + 8 = 26$.\n\n' +
        'Quick check: $x$ goes up by $2$ from the mean point, so $y$ goes up by $3 \\times 2 = 6$, giving $20 + 6 = 26$.',
      whyWrong: [
        'This is just $3 \\times 6$, as if the line went through the origin. You need the intercept, found from the mean point: $c = 8$.',
        null,
        'This uses $\\bar{y} = 20$ as the intercept: $3 \\times 6 + 20$. The intercept is the value of $y$ at $x = 0$, not at $x = 4$.',
        'This adds the change in $x$ straight onto $\\bar{y}$: $20 + 2$. Each step of $1$ in $x$ changes $y$ by the gradient $3$, so the change is $3 \\times 2 = 6$.',
      ],
      keyIdea: 'The line of best fit passes through $(\\bar{x}, \\bar{y})$, which lets you find the intercept from the gradient.',
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
      solution:
        'Eight of the points lie very close to an upward-sloping straight line: a strong positive correlation.\n\n' +
        'The outlier at $(9, 2)$ is far **below** that line. It breaks the pattern and drags the correlation down, so with it included $r$ is only moderate (about $0.44$).\n\n' +
        'Remove it and the remaining points almost form a straight line, so $r$ **increases** and gets very close to $1$ (about $0.996$).',
      whyWrong: [
        null,
        'A single outlier can change $r$ a lot, especially one far from the trend. Here $r$ jumps from about $0.44$ to about $0.996$.',
        'The remaining 8 points slope clearly **upwards**, so $r$ stays positive. If anything it is the outlier that pulls $r$ down.',
        'This gets the direction backwards. The outlier is the point that **weakens** the pattern; removing it makes the linear pattern stronger, so $r$ moves towards $1$, not $0$.',
      ],
      keyIdea: 'An outlier that does not follow the trend weakens the correlation; removing it moves $r$ closer to $\\pm 1$.',
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
    stem: 'A biologist uses plants aged between $2$ and $10$ weeks to find the line of best fit $h = 3w + 4$, where $h$ is height in cm and $w$ is age in weeks. Which prediction is the **least reliable**?',
    options: [
      'The height at $5$ weeks, $19$ cm',
      'The height at $9$ weeks, $31$ cm',
      'The height at $30$ weeks, $94$ cm',
      'The height at $2.5$ weeks, $11.5$ cm',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'All four heights are calculated correctly from $h = 3w + 4$ (for example $3 \\times 30 + 4 = 94$). The question is which one we can trust least.\n\n' +
        '- Predicting **inside** the range of the data ($2$ to $10$ weeks) is called **interpolation** and is usually reliable.\n' +
        '- Predicting **outside** the range is called **extrapolation**. The pattern may not continue: plants stop growing at a steady rate.\n\n' +
        'Ages $5$, $9$ and $2.5$ weeks are inside $2$ to $10$ weeks. Age $30$ weeks is far outside, so the prediction of $94$ cm is the least reliable.',
      whyWrong: [
        '$5$ weeks is inside the data range of $2$ to $10$ weeks, so this is interpolation and is reasonably reliable.',
        '$9$ weeks is still inside the data range ($2$ to $10$ weeks). Being near the end of the range is fine; only going **beyond** it is extrapolation.',
        null,
        '$2.5$ weeks is not a whole number, but it is still inside the range $2$ to $10$ weeks, so the prediction is interpolation and is reliable.',
      ],
      keyIdea: 'Predictions inside the data range (interpolation) are reliable; predictions far outside it (extrapolation) are not.',
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

  // ------------------------------------------------------------------ challenge
  {
    id: 'correlation-normal-017',
    subtopic: 'correlation-normal',
    difficulty: 'challenge',
    stem: 'The lifetimes of a type of battery are normally distributed with mean $40$ hours and standard deviation $4$ hours. Using the 68-95-99.7 rule, what percentage of batteries last between $36$ and $48$ hours?',
    options: ['95%', '68%', '47.5%', '81.5%'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The interval is **not** symmetric about the mean, so split it at the mean.\n\n' +
        '1. $36 = 40 - 4$ is $1$ SD below the mean; $48 = 40 + 2 \\times 4$ is $2$ SDs above.\n' +
        '2. From $36$ to $40$ (mean minus 1 SD up to the mean): half of 68%, which is 34%.\n' +
        '3. From $40$ to $48$ (the mean up to 2 SDs above): half of 95%, which is 47.5%.\n' +
        '4. Add: $34\\% + 47.5\\% = 81.5\\%$.\n\n' +
        'So about 81.5% of batteries last between $36$ and $48$ hours.',
      whyWrong: [
        '95% would be correct for $32$ to $48$ hours (2 SDs on **both** sides). The lower end $36$ is only 1 SD below the mean.',
        '68% would be correct for $36$ to $44$ hours (1 SD on both sides). The upper end $48$ is 2 SDs above the mean.',
        '47.5% is only the part from the mean $40$ up to $48$. You also need the 34% between $36$ and $40$.',
        null,
      ],
      keyIdea: 'For an interval that is not symmetric, split it at the mean and add half of each rule percentage.',
    },
    check: {
      optionValues: [95, 68, 47.5, 81.5],
      compute: () => between((36 - 40) / 4, (48 - 40) / 4),
    },
  },
  {
    id: 'correlation-normal-018',
    subtopic: 'correlation-normal',
    difficulty: 'challenge',
    stem: 'For a set of paired data, $S_{xx} = \\sum (x - \\bar{x})^2 = 16$, $S_{yy} = \\sum (y - \\bar{y})^2 = 64$ and $S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y}) = -24$. What is the correlation coefficient $r$?',
    options: ['$-0.75$', '$-1.5$', '$0.75$', '$-0.3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The correlation coefficient (Pearson\'s $r$) is\n\n' +
        '$$r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}$$\n\n' +
        '1. Multiply: $S_{xx} S_{yy} = 16 \\times 64 = 1024$.\n' +
        '2. Square root: $\\sqrt{1024} = 32$.\n' +
        '3. Divide: $r = \\frac{-24}{32} = -0.75$.\n\n' +
        'Sense check: $-0.75$ is between $-1$ and $1$, and it is negative because $S_{xy}$ is negative.',
      whyWrong: [
        null,
        'This is $\\frac{S_{xy}}{S_{xx}} = \\frac{-24}{16}$, which is the **gradient** of the regression line, not $r$. It cannot be $r$ anyway, because $r$ is never below $-1$.',
        'This drops the minus sign. $S_{xy}$ is negative, so $r$ must be negative too.',
        'This adds instead of multiplying under the square root and forgets the root: $\\frac{-24}{16 + 64}$. The bottom should be $\\sqrt{16 \\times 64} = 32$.',
      ],
      keyIdea: '$r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}$, and it always has the same sign as $S_{xy}$.',
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
    difficulty: 'challenge',
    stem: 'The times taken by $400$ runners to complete a $100$ m race are normally distributed with mean $14$ s and standard deviation $0.5$ s. Runners qualify for the final if their time is **less than** $13$ s. Using the 68-95-99.7 rule, about how many runners qualify?',
    options: ['$20$', '$10$', '$190$', '$390$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. $z$-score of $13$ s: $z = \\frac{13 - 14}{0.5} = \\frac{-1}{0.5} = -2$. So $13$ s is 2 SDs **below** the mean (faster than average).\n' +
        '2. About 95% of times are within 2 SDs of the mean, leaving 5% in the two tails.\n' +
        '3. By symmetry, the lower tail (times under $13$ s) is $\\frac{5\\%}{2} = 2.5\\%$.\n' +
        '4. Number of runners: $2.5\\% \\times 400 = 0.025 \\times 400 = 10$.\n\n' +
        'About $10$ runners qualify.',
      whyWrong: [
        'This uses 5% of $400$, which counts **both** tails (very fast and very slow runners). Only times under $13$ s qualify, which is half of that.',
        null,
        'This uses 47.5% of $400$: the runners between $13$ s and the mean $14$ s, not those faster than $13$ s.',
        'This uses 97.5% of $400$: the runners slower than $13$ s. Qualifying needs a time **less than** $13$ s.',
      ],
      keyIdea: 'Convert the cut-off to a $z$-score, use the rule (with symmetry) to get a percentage, then multiply by the total.',
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
    id: 'correlation-normal-020',
    subtopic: 'correlation-normal',
    difficulty: 'challenge',
    stem: 'A quantity is normally distributed. About 16% of values are **greater than** $58$, and about 2.5% of values are **greater than** $66$. Using the 68-95-99.7 rule, find the mean $\\mu$ and standard deviation $\\sigma$.',
    options: ['$\\mu = 54$, $\\sigma = 4$', '$\\mu = 42$, $\\sigma = 8$', '$\\mu = 50$, $\\sigma = 8$', '$\\mu = 58$, $\\sigma = 8$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: turn each percentage into a number of SDs.**\n\n' +
        '- Above $\\mu + \\sigma$: $\\frac{100\\% - 68\\%}{2} = 16\\%$. So $58$ is 1 SD above the mean.\n' +
        '- Above $\\mu + 2\\sigma$: $\\frac{100\\% - 95\\%}{2} = 2.5\\%$. So $66$ is 2 SDs above the mean.\n\n' +
        '**Step 2: write the equations.**\n\n' +
        '$$\\mu + \\sigma = 58 \\qquad \\mu + 2\\sigma = 66$$\n\n' +
        '**Step 3: solve.** Subtract the first from the second: $\\sigma = 66 - 58 = 8$. Then $\\mu = 58 - 8 = 50$.\n\n' +
        'Check: $50 + 8 = 58$ (16% above) and $50 + 16 = 66$ (2.5% above). So $\\mu = 50$, $\\sigma = 8$.',
      whyWrong: [
        'This assumes 2.5% above means 3 SDs above, solving $\\mu + \\sigma = 58$ and $\\mu + 3\\sigma = 66$. In fact 2.5% above is 2 SDs (half of the 5% outside 2 SDs).',
        'This shifts both by one SD, solving $\\mu + 2\\sigma = 58$ and $\\mu + 3\\sigma = 66$. But 16% above is 1 SD ($\\frac{100\\% - 68\\%}{2}$) and 2.5% above is 2 SDs.',
        null,
        'This finds $\\sigma = 8$ correctly but then takes $58$ as the mean. $58$ is 1 SD **above** the mean, so step back: $\\mu = 58 - 8 = 50$.',
      ],
      keyIdea: 'Use the rule backwards: 16% above is $\\mu + \\sigma$ and 2.5% above is $\\mu + 2\\sigma$, then solve the simultaneous equations.',
    },
    check: {
      optionValues: ['54,4', '42,8', '50,8', '58,8'],
      compute: () => {
        // find the k (number of SDs) whose upper tail matches each percentage, then solve mu + k1*s = 58, mu + k2*s = 66
        const kFor = (pct: number) => [1, 2, 3].find((k) => Math.abs(above(k) - pct) < 1e-9)!;
        const k1 = kFor(16);
        const k2 = kFor(2.5);
        const s = (66 - 58) / (k2 - k1);
        const mu = 58 - k1 * s;
        return `${mu},${s}`;
      },
    },
  },
  {
    id: 'correlation-normal-021',
    subtopic: 'correlation-normal',
    difficulty: 'challenge',
    stem: 'Aisha scored $78$ in test A, which had mean $66$ and standard deviation $8$. Test B had mean $50$ and standard deviation $12$. What score in test B would be **equally good** compared with the other candidates?',
    options: ['$62$', '$84$', '$18$', '$68$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '"Equally good" means the **same $z$-score**.\n\n' +
        '1. Aisha\'s $z$-score in test A: $z = \\frac{78 - 66}{8} = \\frac{12}{8} = 1.5$.\n' +
        '2. In test B, find the score with $z = 1.5$: $x = \\mu + z\\sigma = 50 + 1.5 \\times 12$.\n' +
        '3. $1.5 \\times 12 = 18$, so $x = 50 + 18 = 68$.\n\n' +
        'Check: $\\frac{68 - 50}{12} = \\frac{18}{12} = 1.5$. The equivalent score is $68$.',
      whyWrong: [
        'This keeps the same **raw** gap of $12$ marks above the mean ($50 + 12$). Test B is more spread out (SD $12$ instead of $8$), so the same relative position needs a bigger gap, $1.5 \\times 12 = 18$.',
        'This mixes up the tests: it uses test A\'s mean with test B\'s standard deviation, $66 + 1.5 \\times 12$. Use test B\'s mean, $50$.',
        'This works out $1.5 \\times 12 = 18$ correctly, but that is only the distance above the mean. You must add it to the mean of test B: $50 + 18$.',
        null,
      ],
      keyIdea: 'Equivalent performance means equal $z$-scores: find $z$ in one distribution, then use $x = \\mu + z\\sigma$ in the other.',
    },
    check: {
      optionValues: [62, 84, 18, 68],
      compute: () => {
        const z = (78 - 66) / 8;
        return 50 + z * 12;
      },
    },
  },
];
