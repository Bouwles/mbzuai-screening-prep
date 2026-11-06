import type { StaticQuestion } from '../../../types';

/** Percentage change from a to b, e.g. pct(80, 84) = 5. */
const pct = (a: number, b: number) => ((b - a) * 100) / a;
/** Rate in percent from successes and total. */
const rate = (k: number, n: number) => (k * 100) / n;

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'valid-conclusions-001',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'The bar chart compares the average battery life of three phone brands. What is the **main** reason it is misleading?',
    chart: {
      kind: 'bar',
      title: 'Average battery life',
      xLabel: 'Brand',
      yLabel: 'Hours',
      categories: ['Alpha', 'Beta', 'Gamma'],
      series: [{ name: 'Battery life (hours)', values: [10.2, 10.6, 11] }],
      yMin: 10,
      yMax: 11,
    },
    options: [
      'It should be a line graph',
      'The vertical axis starts at 10, not 0',
      'The bars are in height order',
      'Battery life should be in minutes',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Look at where the vertical axis **starts**. It starts at 10 hours, not 0. This is called a **truncated axis**.\n\n' +
        'Above the 10-hour line, the visible parts of the bars are $0.2$, $0.6$ and $1$ hour tall, so Gamma\'s bar *looks* $\\frac{1}{0.2} = 5$ times as tall as Alpha\'s.\n\n' +
        'The real values are $10.2$ and $11$ hours. Gamma lasts only $0.8$ hours longer, which is only about 8% more (since $\\frac{0.8}{10.2} \\times 100 \\approx 7.8$), not 5 times as much.\n\n' +
        'So the chart is misleading because the truncated axis makes a small difference look enormous.',
      whyWrong: [
        'A line graph is for data that changes over time or along an ordered scale. Brands are separate categories, so a bar chart is the right choice; the problem is the axis, not the type of chart.',
        null,
        'Sorting bars from shortest to tallest is a normal, honest way to make a chart easier to read. It does not change the heights of the bars.',
        'Changing the unit (hours to minutes) multiplies every value by 60, so the bars keep the same relative sizes. It would not fix the truncated axis.',
      ],
      keyIdea: 'When a bar chart\'s vertical axis does not start at zero, the heights of the bars no longer show the true ratio between the values.',
    },
  },
  {
    id: 'valid-conclusions-002',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'Monthly data show a strong positive correlation between ice-cream sales and drownings in a coastal city. Which conclusion is **valid**?',
    options: [
      'Eating ice cream causes drowning',
      'Banning ice cream would reduce drownings',
      'The two rise together, probably because of hot weather',
      'Every month with higher sales had more drownings',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Correlation** means two variables tend to move together. It does **not** tell you that one causes the other.\n\n' +
        'Here a third variable, **hot weather**, explains both: in hot months more people buy ice cream *and* more people go swimming, so there are more drownings. A hidden third variable like this is called a **confounding variable**.\n\n' +
        'So the only safe conclusion is that the two variables are **associated**, most likely through the weather.',
      whyWrong: [
        'This claims **causation** from a correlation. The data only show the two rise together; hot weather is a much more likely explanation for both.',
        'This assumes ice cream causes drownings, which the data cannot show. Banning ice cream would not stop people swimming on hot days.',
        null,
        'A strong correlation is not a perfect one. It describes the overall trend, so there can still be individual months where sales went up but drownings did not.',
      ],
      keyIdea: 'Correlation does not imply causation: a confounding variable (here, hot weather) can make two things rise together.',
    },
  },
  {
    id: 'valid-conclusions-003',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'A website poll finds that 98% of its 12,000 respondents use the internet daily, and reports this for all adults. Why is this conclusion **not** valid?',
    options: [
      '12,000 people is too small a sample',
      'A figure as high as 98% cannot be accurate',
      'Polls can never support conclusions about a population',
      'The sample is biased towards internet users',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Ask: **who could have been in the sample?** Only people who were on the website could answer the poll, and every one of them was using the internet at that moment.\n\n' +
        'People who rarely go online had almost no chance of being included. The sample is therefore **biased** (not representative of all adults), and it is also **self-selected** because visitors chose whether to answer.\n\n' +
        'A biased sample gives a biased answer, however many people respond.',
      whyWrong: [
        '12,000 is actually a large sample. The problem is *who* was asked, not *how many*: a big biased sample is still biased.',
        'There is nothing wrong with a high percentage in itself. The issue is that the people asked were not representative of all adults.',
        'This goes too far. A well-designed **random** sample can be used to draw conclusions about a population; this particular poll is just badly designed.',
        null,
      ],
      keyIdea: 'A sample is only useful if it represents the population; a large but biased sample still gives a biased result.',
    },
  },
  {
    id: 'valid-conclusions-004',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'An infographic picture is redrawn twice as **tall** and twice as **wide**. How many times larger is its **area**?',
    options: ['$2$', '$3$', '$4$', '$8$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The area of a picture scales with **width** $\\times$ **height**.\n\n' +
        '- Width is multiplied by $2$.\n' +
        '- Height is multiplied by $2$.\n\n' +
        'So the area is multiplied by $2 \\times 2 = 4$.\n\n' +
        'If the data only doubled, the picture still looks **4 times** as big, because the eye judges size by area. This is a common way pictograms distort data: the picture should be scaled so its *area* doubles, or simply shown twice.',
      whyWrong: [
        'This is the scale factor of just one dimension. Scaling both the width and the height by 2 multiplies the area by $2 \\times 2$.',
        'This adds the increases instead of multiplying the scale factors: "100% taller plus 100% wider = 200% bigger". Area scale factors multiply.',
        null,
        'This is $2^3$, which would be the change in **volume** of a 3D object scaled by 2 in every direction. A flat picture only has width and height.',
      ],
      keyIdea: 'Scaling a picture by $k$ in both directions multiplies its area by $k^2$, so pictograms scaled by height exaggerate changes.',
    },
    check: {
      optionValues: [2, 3, 4, 8],
      compute: () => {
        const widthFactor = 2;
        const heightFactor = 2;
        return widthFactor * heightFactor;
      },
    },
  },
  {
    id: 'valid-conclusions-005',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'Restaurant A has an average rating of 5.0 stars from 2 reviews. Restaurant B has 4.6 stars from 850 reviews. Which statement is best supported?',
    options: [
      'B\'s rating is more reliable, because it has far more reviews',
      'A is definitely better, because 5.0 is higher than 4.6',
      'Both ratings are equally reliable',
      'B must be worse, because more reviews bring more complaints',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'An average from a **small sample** is very unreliable: it can swing wildly when one more value is added.\n\n' +
        'For Restaurant A, one 1-star review would change the average from $5.0$ to $\\frac{5 + 5 + 1}{3} \\approx 3.7$ stars.\n\n' +
        'For Restaurant B, one 1-star review barely moves the average, because it is one review out of 851.\n\n' +
        'So we cannot conclude that A is better. B\'s 4.6 is the more trustworthy figure.',
      whyWrong: [
        null,
        'This ignores **sample size**. Two reviews (possibly from friends of the owner) are far too few to be confident that A is better.',
        'An average from 2 values is much less reliable than an average from 850 values. Larger samples give more stable averages.',
        'More reviews does not lower the average by itself; it just makes the average more stable. B\'s 4.6 already includes all its good and bad reviews.',
      ],
      keyIdea: 'Results from very small samples are unreliable, so always check how many data values a percentage or average is based on.',
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'valid-conclusions-006',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'On the chart, App Y\'s bar looks **3 times** as tall as App X\'s. By what percentage are App Y\'s downloads **actually** higher than App X\'s?',
    chart: {
      kind: 'bar',
      title: 'Monthly downloads',
      xLabel: 'App',
      yLabel: 'Downloads (thousands)',
      categories: ['App X', 'App Y'],
      series: [{ name: 'Downloads (thousands)', values: [80, 84] }],
      yMin: 78,
      yMax: 85,
    },
    options: ['200%', '4%', '300%', '5%'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1: Read the real values: App X = 80 thousand, App Y = 84 thousand. (The axis starts at 78, which is why the bars look so different.)\n\n' +
        'Step 2: Find the increase: $84 - 80 = 4$ thousand.\n\n' +
        'Step 3: Divide by the **starting** value (App X) and multiply by 100:\n\n' +
        '$$\\frac{4}{80} \\times 100 = 5\\%$$\n\n' +
        'Check the visual effect: above 78 the bars are $80 - 78 = 2$ and $84 - 78 = 6$ units tall, so Y looks $\\frac{6}{2} = 3$ times as tall. The truncated axis turns a 5% difference into a bar that looks 200% taller.',
      whyWrong: [
        'This is how much taller the bar **looks** ($\\frac{6 - 2}{2} = 200\\%$), measured from 78 instead of 0. It describes the picture, not the data.',
        'This takes the difference of 4 thousand downloads and writes it as 4%. A percentage change must be divided by the starting value: $\\frac{4}{80} \\times 100$.',
        'This mixes up "3 times as tall" with "300% more". It is also based on the picture, not the real values.',
        null,
      ],
      keyIdea: 'Always work from the numbers, not the bar heights: percentage change $= \\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100$.',
    },
    check: { optionValues: [200, 4, 300, 5], compute: () => pct(80, 84) },
  },
  {
    id: 'valid-conclusions-007',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'An advert says "Users up 25% in just three months!", using September and December. From the whole chart, what was the percentage change in monthly users from **January to December**?',
    chart: {
      kind: 'line',
      title: 'Monthly users',
      xLabel: 'Month',
      yLabel: 'Users',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [{ name: 'Users', values: [2000, 2200, 2400, 2100, 1900, 1700, 1500, 1300, 1200, 1300, 1400, 1500] }],
      yMin: 0,
    },
    options: ['An increase of 25%', 'A decrease of 33.3%', 'A decrease of 25%', 'A decrease of 37.5%'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The advert has **cherry-picked** a short range (September to December) where the line goes up: $\\frac{1500 - 1200}{1200} \\times 100 = 25\\%$.\n\n' +
        'For the whole year:\n\n' +
        '- January: 2000 users\n' +
        '- December: 1500 users\n' +
        '- Change: $1500 - 2000 = -500$\n\n' +
        'Divide by the **starting** (January) value:\n\n' +
        '$$\\frac{-500}{2000} \\times 100 = -25\\%$$\n\n' +
        'So users actually **fell by 25%** over the year. The recent rise is real, but it only recovers part of the earlier drop.',
      whyWrong: [
        'This is the advert\'s cherry-picked figure from September (1200) to December (1500). Over the full year the number of users went down.',
        'This divides the drop of 500 by the December value (1500) instead of the January value (2000). Percentage change is always divided by the **starting** value.',
        null,
        'This measures the drop from the March peak (2400) to December: $\\frac{900}{2400} = 37.5\\%$. The question asks for January to December.',
      ],
      keyIdea: 'A short, hand-picked time range can show the opposite of the overall trend, so always look at the full data before accepting a claim.',
    },
    check: {
      optionValues: [25, -100 / 3, -25, -37.5],
      compute: () => {
        const users = [2000, 2200, 2400, 2100, 1900, 1700, 1500, 1300, 1200, 1300, 1400, 1500];
        return pct(users[0], users[11]);
      },
    },
  },
  {
    id: 'valid-conclusions-008',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'The scatter graph shows hours of sleep and test score for 10 students. Which conclusion is **valid**?',
    chart: {
      kind: 'scatter',
      title: 'Sleep and test score',
      xLabel: 'Hours of sleep',
      yLabel: 'Test score',
      points: [
        { x: 5, y: 52 },
        { x: 5.5, y: 60 },
        { x: 6, y: 55 },
        { x: 6.5, y: 64 },
        { x: 7, y: 62 },
        { x: 7, y: 70 },
        { x: 7.5, y: 68 },
        { x: 8, y: 75 },
        { x: 8, y: 66 },
        { x: 9, y: 78 },
      ],
    },
    options: [
      'Sleeping more causes higher scores',
      'Students who slept more tended to score higher',
      'Every student who slept more scored higher',
      'There is no relationship',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Step 1: Describe the pattern. As hours of sleep increase, scores generally increase, so there is a **positive correlation**.\n\n' +
        'Step 2: Check for exceptions. One student slept 7 hours and scored 70, while another slept 8 hours and scored only 66. So the pattern is a **tendency**, not a rule for every student.\n\n' +
        'Step 3: Think about causation. This is an **observational** study: nobody controlled how long anyone slept. Other factors (for example, students who revised earlier may also go to bed earlier) could explain the link.\n\n' +
        'So the valid statement is that students who slept more **tended** to score higher.',
      whyWrong: [
        'This claims **causation**. The data are observational, so a confounding variable (such as how organised a student is) could explain both more sleep and higher scores.',
        null,
        'Correlation describes the overall trend, not every pair of students. The chart has exceptions: 7 hours with a score of 70, but 8 hours with a score of 66.',
        'A correlation does not need perfect points on a line. The points clearly rise from left to right, which shows a positive (but not perfect) correlation.',
      ],
      keyIdea: 'A scatter graph can show a tendency (correlation), but it does not prove cause and effect and does not apply to every individual.',
    },
  },
  {
    id: 'valid-conclusions-009',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'To estimate how much adults in a city exercise, a researcher interviews 400 people leaving a gym at 7 am. What is the main problem with her method?',
    options: [
      'None: 400 people is a large sample',
      'It over-represents active people, so the estimate is too high',
      'It over-represents active people, so the estimate is too low',
      'Only the time: interviewing at 6 pm would fix it',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Ask: **who had a chance to be in the sample?** Only people who were at a gym. Adults who never go to a gym had no chance of being chosen.\n\n' +
        'People leaving a gym obviously exercise more than average, so the sample is **biased** towards active people.\n\n' +
        'Think about the **direction** of the bias: if the sample contains too many active people, their average exercise time will be **higher** than the true city average. So the estimate is likely to be **too high**.',
      whyWrong: [
        'Sample size does not fix bias. 400 gym users still only represent gym users, not all adults in the city.',
        null,
        'The bias is identified correctly, but the direction is wrong. A sample full of active people gives an average that is too **high**, not too low.',
        'Changing the time of day still only samples gym users. The bias comes from **where** people were sampled, not when.',
      ],
      keyIdea: 'Sampling bias pushes an estimate in a predictable direction: work out which group is over-represented and how that changes the answer.',
    },
  },
  {
    id: 'valid-conclusions-010',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'The table shows reported crimes in two towns. A headline says "Crime soars in Town A: up 50%!". Which conclusion is supported?',
    table: {
      headers: ['Town', 'Last year', 'This year', 'Percentage change'],
      rows: [
        ['Town A', 20, 30, '+50%'],
        ['Town B', 400, 440, '+10%'],
      ],
    },
    options: [
      'Town A had the larger increase in the number of crimes',
      'Town A now has more crimes than Town B',
      'Crime rose by 60% across the two towns',
      'Town B had the larger increase in the number of crimes',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1: Work out the **actual** increases (the number of extra crimes).\n\n' +
        '- Town A: $30 - 20 = 10$ more crimes\n' +
        '- Town B: $440 - 400 = 40$ more crimes\n\n' +
        'Step 2: Compare. Town B\'s increase (40) is 4 times Town A\'s (10). A big **percentage** in Town A comes from a very small starting number.\n\n' +
        'Step 3: Check the combined change, for completeness: $\\frac{470 - 420}{420} \\times 100 \\approx 11.9\\%$, not 60%.\n\n' +
        'So the supported conclusion is that Town B had the larger increase in the number of crimes.',
      whyWrong: [
        'This confuses a **percentage** increase with an **actual** increase. 50% of 20 is only 10 crimes, while 10% of 400 is 40 crimes.',
        'Town A has 30 crimes this year and Town B has 440, so Town A has far fewer.',
        'Percentages from groups of different sizes cannot be added. The combined change is $\\frac{470 - 420}{420} \\times 100 \\approx 11.9\\%$.',
        null,
      ],
      keyIdea: 'A large percentage change from a small starting value can be a small actual change, so always compare the actual numbers too.',
    },
  },
  {
    id: 'valid-conclusions-011',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'The table shows survivors of an operation at two hospitals, by severity of illness. Which statement is correct?',
    table: {
      caption: 'Survived / patients treated',
      headers: ['Hospital', 'Mild cases', 'Severe cases', 'All patients'],
      rows: [
        ['Hospital A', '90 / 100', '120 / 400', '210 / 500'],
        ['Hospital B', '320 / 400', '20 / 100', '340 / 500'],
      ],
    },
    options: [
      'Hospital B is better for both mild and severe cases',
      'Hospital A is better for both, but B is better overall',
      'Hospital A is better overall and for both',
      'The table must contain an error',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work out every survival rate (survived $\\div$ treated $\\times 100$).\n\n' +
        '| | Mild | Severe | Overall |\n' +
        '|---|---|---|---|\n' +
        '| Hospital A | $\\frac{90}{100} = 90\\%$ | $\\frac{120}{400} = 30\\%$ | $\\frac{210}{500} = 42\\%$ |\n' +
        '| Hospital B | $\\frac{320}{400} = 80\\%$ | $\\frac{20}{100} = 20\\%$ | $\\frac{340}{500} = 68\\%$ |\n\n' +
        'Hospital A is better in **each** group (90% vs 80%, 30% vs 20%), yet Hospital B is better **overall** (68% vs 42%).\n\n' +
        'Why? Hospital A treats mostly **severe** cases (400 of its 500), and severe cases rarely survive anywhere. Hospital B treats mostly **mild** cases. The overall rate is dragged down by the mix of patients, not by the quality of care. This reversal is called **Simpson\'s paradox**.',
      whyWrong: [
        'Hospital B is lower in both groups: 80% vs 90% for mild cases and 20% vs 30% for severe cases. It only wins on the overall figure.',
        null,
        'Hospital A\'s overall rate is only $\\frac{210}{500} = 42\\%$, lower than Hospital B\'s 68%, because most of A\'s patients are severe cases.',
        'This reversal is possible and is called Simpson\'s paradox. It happens because the two hospitals treat very different mixes of patients: most of A\'s patients are severe cases, while most of B\'s are mild.',
      ],
      keyIdea: "Simpson's paradox: one group can be better in every subgroup but worse overall, when the subgroups have very different sizes.",
    },
  },
  {
    id: 'valid-conclusions-012',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: '18 of 20 students passed in Class X (90%) and 30 of 60 passed in Class Y (50%). What is the **combined** pass rate?',
    options: ['70%', '48%', '60%', '40%'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Step 1: Total number who passed: $18 + 30 = 48$.\n\n' +
        'Step 2: Total number of students: $20 + 60 = 80$.\n\n' +
        'Step 3: Combined pass rate:\n\n' +
        '$$\\frac{48}{80} \\times 100 = 60\\%$$\n\n' +
        'You **cannot** just average 90% and 50%, because Class Y is three times as big as Class X, so its 50% counts three times as much.',
      whyWrong: [
        'This averages the two percentages: $\\frac{90 + 50}{2} = 70\\%$. That only works if the classes are the same size; Class Y has three times as many students.',
        'This is the **number** of students who passed (48), not the percentage. Divide by the 80 students in total.',
        null,
        'This is the combined **fail** rate: $\\frac{2 + 30}{80} \\times 100 = 40\\%$. The question asks for the pass rate.',
      ],
      keyIdea: 'To combine rates from groups of different sizes, add the counts first, then divide; never average the percentages.',
    },
    check: { optionValues: [70, 48, 60, 40], compute: () => rate(18 + 30, 20 + 60) },
  },
  {
    id: 'valid-conclusions-013',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'The chart shows club membership, with the plotted years drawn **equally spaced**. Which conclusion is correct?',
    chart: {
      kind: 'line',
      title: 'Club membership',
      xLabel: 'Year',
      yLabel: 'Members (thousands)',
      categories: ['2000', '2010', '2020', '2021', '2022', '2023'],
      series: [{ name: 'Members (thousands)', values: [10, 30, 50, 52, 54, 56] }],
      yMin: 0,
    },
    options: [
      'Steady growth of 2 thousand per year throughout',
      'Growth slowed from 20 thousand per year to 2 thousand',
      'Growth stopped after 2020',
      'Growth slowed: only 6 thousand from 2020 to 2023',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'The first gaps on the horizontal axis are **10 years** each, but the later gaps are **1 year** each, even though they are drawn the same width. This is a **distorted scale**.\n\n' +
        'Work out the growth **per year** for each part:\n\n' +
        '- 2000 to 2020: $\\frac{50 - 10}{20} = \\frac{40}{20} = 2$ thousand per year\n' +
        '- 2020 to 2023: $\\frac{56 - 50}{3} = \\frac{6}{3} = 2$ thousand per year\n\n' +
        'The rate is the same: 2 thousand members per year. The line only looks steeper early on because 10 years are squashed into the same width as 1 year.',
      whyWrong: [
        null,
        'This treats each gap on the axis as one year. From 2000 to 2010 the increase of 20 thousand took **10 years**, so the rate was $\\frac{20}{10} = 2$ thousand per year.',
        'The line still rises by 2 thousand every year after 2020. It only looks flatter because each of those gaps is just one year wide.',
        'This compares totals over periods of different length (3 years against 10 years). Per year, both periods grew by 2 thousand.',
      ],
      keyIdea: 'Check that the axis scale is even: unequal time gaps drawn the same width distort the slope of a line chart.',
    },
  },

  {
    id: 'valid-conclusions-014',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'Overall, 64% of male and 41% of female applicants to a university were accepted. A newspaper claims bias against women. Using the table, which statement is best supported?',
    table: {
      caption: 'Accepted / applied',
      headers: ['Department', 'Men', 'Women'],
      rows: [
        ['Department X', '60 / 80', '17 / 20'],
        ['Department Y', '4 / 20', '24 / 80'],
        ['Total', '64 / 100', '41 / 100'],
      ],
    },
    options: [
      'The data prove bias against women',
      'Men had the higher rate in both departments',
      'Women\'s true overall rate is 57.5%',
      'Women had the higher rate in each department',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Step 1: Department rates.\n\n' +
        '| | Men | Women |\n' +
        '|---|---|---|\n' +
        '| Department X | $\\frac{60}{80} = 75\\%$ | $\\frac{17}{20} = 85\\%$ |\n' +
        '| Department Y | $\\frac{4}{20} = 20\\%$ | $\\frac{24}{80} = 30\\%$ |\n' +
        '| Overall | $\\frac{64}{100} = 64\\%$ | $\\frac{41}{100} = 41\\%$ |\n\n' +
        'Step 2: Compare within each department. Women do **better** in both: 85% vs 75% in X, and 30% vs 20% in Y.\n\n' +
        'Step 3: Explain the overall figure. 80 of the 100 women applied to Department Y, which accepts very few people (20-30%). 80 of the 100 men applied to Department X, which accepts most people (75-85%). The overall gap comes from **where** people applied, not from how each department treated them.\n\n' +
        'This is Simpson\'s paradox. The overall figures alone do not support the newspaper\'s claim.',
      whyWrong: [
        'This only looks at the combined figures. Inside each department women were accepted at a **higher** rate, so the gap is explained by which department people applied to.',
        'This is the opposite of the data: men were accepted at 75% vs women 85% in X, and 20% vs 30% in Y.',
        'Averaging $85\\%$ and $30\\%$ ignores that 80 women applied to Y but only 20 to X. The real overall rate is $\\frac{41}{100} = 41\\%$.',
        null,
      ],
      keyIdea: "When combined data and subgroup data disagree (Simpson's paradox), look for a lurking variable, here the department applied to.",
    },
  },
  {
    id: 'valid-conclusions-015',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    stem: 'Two drugs were each given to 200 patients. The table shows recoveries by age group. Drug P has the higher rate in **both** groups. What are the **overall** recovery rates?',
    table: {
      caption: 'Recovered / treated',
      headers: ['Drug', 'Under 50', '50 and over'],
      rows: [
        ['Drug P', '45 / 50', '90 / 150'],
        ['Drug Q', '136 / 160', '22 / 40'],
      ],
    },
    options: ['P: 75%, Q: 70%', 'P: 67.5%, Q: 79%', 'P: 79%, Q: 67.5%', 'P: 33.75%, Q: 39.5%'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Step 1: Check the group rates.\n\n' +
        '- P: under 50: $\\frac{45}{50} = 90\\%$; 50 and over: $\\frac{90}{150} = 60\\%$\n' +
        '- Q: under 50: $\\frac{136}{160} = 85\\%$; 50 and over: $\\frac{22}{40} = 55\\%$\n\n' +
        'So P is 5 percentage points better in each group.\n\n' +
        'Step 2: Overall rate for P. Recovered: $45 + 90 = 135$ out of $50 + 150 = 200$.\n\n' +
        '$$\\frac{135}{200} \\times 100 = 67.5\\%$$\n\n' +
        'Step 3: Overall rate for Q. Recovered: $136 + 22 = 158$ out of $160 + 40 = 200$.\n\n' +
        '$$\\frac{158}{200} \\times 100 = 79\\%$$\n\n' +
        'Step 4: Interpret. Q looks better overall only because most of its patients were **under 50**, and younger patients recover more often whichever drug they get. Most of P\'s patients were 50 and over. (Simpson\'s paradox.)',
      whyWrong: [
        'This averages the two group rates for each drug: $\\frac{90 + 60}{2} = 75\\%$ and $\\frac{85 + 55}{2} = 70\\%$. The groups are different sizes, so you must add the counts and divide by 200.',
        null,
        'These are the correct two numbers but attached to the wrong drugs. P recovered $135$ patients and Q recovered $158$.',
        'This divides each drug\'s recoveries by all 400 patients in the study ($\\frac{135}{400}$ and $\\frac{158}{400}$) instead of the 200 patients who took that drug.',
      ],
      keyIdea: 'Overall rate = total successes / total in the group; when group sizes differ, this can reverse the comparison seen in every subgroup.',
    },
    check: {
      optionValues: ['75|70', '67.5|79', '79|67.5', '33.75|39.5'],
      compute: () => {
        const P = [
          [45, 50],
          [90, 150],
        ];
        const Q = [
          [136, 160],
          [22, 40],
        ];
        const overall = (g: number[][]) => rate(g[0][0] + g[1][0], g[0][1] + g[1][1]);
        return `${overall(P)}|${overall(Q)}`;
      },
    },
  },

  // ---------------------------------------------------------------- recall
  {
    id: 'valid-conclusions-019',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'A third variable that influences both of two correlated variables is called a:',
    options: ['Confounding variable', 'Dependent variable', 'Outlier', 'Residual'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **confounding variable** (or confounder) affects both variables, which can make them move together even if neither causes the other.\n\n' +
        'For example, hot weather raises both ice-cream sales and swimming accidents.',
      whyWrong: [
        null,
        'A dependent variable is the outcome being measured in an experiment. It does not describe a hidden third factor.',
        'An outlier is a single data value far from the others, not a variable that influences two others.',
        'A residual is the gap between an actual value and a predicted value on a fitted line.',
      ],
      keyIdea: 'A confounding variable is a hidden third factor that can make two variables appear linked.',
    },
  },
  {
    id: 'valid-conclusions-020',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'A sample that does not fairly represent its population is described as:',
    options: ['Biased', 'Random', 'Large', 'Paired'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **population** is the whole group you want to learn about; the **sample** is the part you actually measure.\n\n' +
        'A sample that over-represents or under-represents some part of the population is **biased**, and it gives misleading results however big it is.',
      whyWrong: [
        null,
        'A random sample gives every member a chance of selection, which is how bias is usually avoided.',
        'Size is a separate issue. A large sample can still be biased, and a large biased sample is still misleading.',
        'Paired describes data collected in matched pairs. It says nothing about whether the sample is representative.',
      ],
      keyIdea: 'A biased sample does not represent its population, and a bigger sample does not fix that.',
    },
  },
  {
    id: 'valid-conclusions-021',
    subtopic: 'valid-conclusions',
    difficulty: 'foundation',
    stem: 'Two variables have a strong positive correlation. What can be concluded?',
    options: ['They tend to increase together', 'One causes the other', 'They always have equal values', 'Neither can ever decrease'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **positive correlation** means that as one variable increases, the other **tends** to increase too.\n\n' +
        'It describes a pattern in the data. It does not show cause and effect, and it allows exceptions.',
      whyWrong: [
        null,
        'Correlation does not imply causation. A third variable could be driving both.',
        'Correlation is about how two variables move together, not about their sizes. Their values can be very different.',
        'Both variables can rise and fall. Positive correlation only means that they tend to move in the same direction.',
      ],
      keyIdea: 'Correlation describes a tendency to move together; it does not show cause and effect.',
    },
  },
];
