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
      asking: 'Why does this bar chart make the three battery lives look more different than they are?',
      solution:
        'A bar chart works by comparing heights. That is only fair if a bar twice as tall really means a value twice as big.\n\n' +
        'Test that here. The real values for Alpha and Gamma are 10.2 and 11 hours. The difference is $11 - 10.2 = 0.8$ hours, which is only about $8\\%$ of 10.2.\n\n' +
        'But Gamma\'s bar looks about 5 times as tall as Alpha\'s. So the picture and the numbers disagree, and we need to find out why.\n\n' +
        'Look at the vertical axis (the scale up the side). Its lowest value is 10, not 0, so the first 10 hours of every bar are cut off. Only the parts above 10 are drawn: 0.2 for Alpha and 1 for Gamma.',
      conclusion: 'Cutting off the bottom of the axis makes a small gap look huge. The vertical axis starts at 10, not 0.',
      whyWrong: [
        'A line graph is for data that changes over time or along an ordered scale. Brands are separate categories, so a bar chart is the right choice; the problem is the axis, not the type of chart.',
        null,
        'Sorting bars from shortest to tallest is a normal, honest way to make a chart easier to read. It does not change the heights of the bars.',
        'Changing the unit (hours to minutes) multiplies every value by 60, so the bars keep the same relative sizes. It would not fix the truncated axis.',
      ],
      keyIdea: 'For any bar chart, read the lowest number on the vertical axis first. If it isn\'t 0, the bar heights mislead, so compare the real values instead. Suspect this whenever small differences look huge.',
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
      asking: 'What can we honestly conclude from ice-cream sales and drownings rising together?',
      solution:
        'A **positive correlation** means two things tend to go up together. It does not tell us that one causes the other.\n\n' +
        'So ask: is there a third thing that could push both up? Think about what kind of month has more ice-cream sales and more people swimming.\n\n' +
        'Hot weather does both. In hot months, more people buy ice cream and more people swim, so more people drown. A hidden cause like this is called a **confounding variable**.',
      conclusion: 'The honest statement describes the pattern and its likely hidden cause. The two rise together, probably because of hot weather.',
      whyWrong: [
        'This claims **causation** from a correlation. The data only show the two rise together; hot weather is a much more likely explanation for both.',
        'This assumes ice cream causes drownings, which the data cannot show. Banning ice cream would not stop people swimming on hot days.',
        null,
        'A strong correlation is not a perfect one. It describes the overall trend, so there can still be individual months where sales went up but drownings did not.',
      ],
      keyIdea: 'When two things are correlated, ask: "Could a third thing drive both?" Reject any option saying one causes the other, or any plan relying on that cause. Reject "every" as well, because a correlation is only a trend.',
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
      asking: 'What is wrong with using a website poll to describe all adults?',
      solution:
        'A **sample** is the group of people actually asked. A **population** is the whole group we want to know about. Here the population is all adults.\n\n' +
        'Ask who could answer this poll. It was on a website, so everyone who answered was online. Adults who rarely use the internet were very unlikely to see it.\n\n' +
        'A sample like that doesn\'t fairly represent the population, so we call it **biased**. It leans towards heavy internet users, which pushes the $98\\%$ up.',
      conclusion: '12,000 is plenty of people, but they are the wrong mix. The sample is biased towards internet users.',
      whyWrong: [
        '12,000 is actually a large sample. The problem is *who* was asked, not *how many*: a big biased sample is still biased.',
        'There is nothing wrong with a high percentage in itself. The issue is that the people asked were not representative of all adults.',
        'This goes too far. A well-designed **random** sample can be used to draw conclusions about a population; this particular poll is just badly designed.',
        null,
      ],
      keyIdea: 'For a survey question, ask "who could answer, and who was left out?" If the way of collecting answers is linked to what is being measured, the sample is biased. A bigger sample doesn\'t fix that.',
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
      asking: 'If a picture doubles in both height and width, how many times bigger is its area?',
      solution:
        'A picture\'s area is width $\\times$ height. Try a small example: a picture 3 wide and 2 tall has area $3 \\times 2 = 6$.\n\n' +
        'Double both lengths. Now it is 6 wide and 4 tall, so its area is $6 \\times 4 = 24$.\n\n' +
        'Compare the two areas: $24 \\div 6 = 4$. This works for any picture, because the area is multiplied by 2 for the width and by 2 again for the height: $2 \\times 2 = 4$.',
      conclusion: 'Doubling the height and the width makes the area $4$ times as large.',
      whyWrong: [
        'This is the scale factor of just one dimension. Scaling both the width and the height by 2 multiplies the area by $2 \\times 2$.',
        'This adds the increases instead of multiplying the scale factors: "100% taller plus 100% wider = 200% bigger". Area scale factors multiply.',
        null,
        'This is $2^3$, which would be the change in **volume** of a 3D object scaled by 2 in every direction. A flat picture only has width and height.',
      ],
      keyIdea: 'If every length of a flat shape is scaled by $k$, its area is multiplied by $k^2$. Infographics can mislead this way: a value that only doubles gets a picture with 4 times the area.',
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
      asking: 'Which claim can we trust, comparing 5.0 stars from 2 reviews with 4.6 stars from 850 reviews?',
      solution:
        'An average from a few values can swing a lot. With only 2 reviews, it takes just two happy customers (maybe friends of the owner) to reach 5.0 stars.\n\n' +
        'An average from many values is steady. One extra review hardly moves an average of 850 reviews, because it is just one value among hundreds.\n\n' +
        'So the number of reviews (the **sample size**) tells us how much to trust each average. An average from 850 reviews is far more trustworthy than one from 2.',
      conclusion: '5.0 looks higher, but it rests on only 2 reviews. B\'s rating is more reliable, because it has far more reviews.',
      whyWrong: [
        null,
        'This ignores **sample size**. Two reviews (possibly from friends of the owner) are far too few to be confident that A is better.',
        'An average from 2 values is much less reliable than an average from 850 values. Larger samples give more stable averages.',
        'More reviews does not lower the average by itself; it just makes the average more stable. B\'s 4.6 already includes all its good and bad reviews.',
      ],
      keyIdea: 'When comparing averages, look at the sample size as well as the average. Very small samples can\'t support words like "definitely". Choose the option that talks about how reliable the figure is.',
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
      asking: 'Using the real numbers, not the bar heights, how much higher is App Y than App X in percent?',
      solution:
        'The bars can mislead here, because the vertical axis starts at 78, not 0. Above 78, the visible heights are only $80 - 78 = 2$ and $84 - 78 = 6$. That is why one looks 3 times as tall as the other.\n\n' +
        'So use the real values from the scale: App X has 80 thousand downloads and App Y has 84 thousand.\n\n' +
        'Find the real difference: $84 - 80 = 4$ thousand.\n\n' +
        'We are comparing App Y with App X, so App X is the starting value. Divide by it: $\\frac{4}{80} = 0.05$.\n\n' +
        'Multiply by 100 to get a percentage: $0.05 \\times 100 = 5\\%$.',
      conclusion: 'App Y is only 4 thousand above App X\'s 80 thousand, so it is really 5% higher.',
      whyWrong: [
        'This is how much taller the bar **looks** ($\\frac{6 - 2}{2} = 200\\%$), measured from 78 instead of 0. It describes the picture, not the data.',
        'This takes the difference of 4 thousand downloads and writes it as 4%. A percentage change must be divided by the starting value: $\\frac{4}{80} \\times 100$.',
        'This mixes up "3 times as tall" with "300% more". It is also based on the picture, not the real values.',
        null,
      ],
      keyIdea: 'When the axis doesn\'t start at 0, ignore how the bars look. Read the real values and use $\\frac{\\text{difference}}{\\text{starting value}} \\times 100$. "Higher than X" means X is the starting value.',
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
      asking: 'Over the whole year, what was the percentage change in users from January to December?',
      solution:
        'Ignore the advert\'s figure. It picked September and December because they show a rise. The question wants January to December, so read those two points.\n\n' +
        'January is 2000 users and December is 1500 users. January comes first, so it is the starting value.\n\n' +
        'Find the change: $1500 - 2000 = -500$. The minus sign means users went down by 500.\n\n' +
        'A percentage change compares the change with where it started, so divide its size by 2000: $\\frac{500}{2000} = 0.25$.\n\n' +
        'Multiply by 100: $0.25 \\times 100 = 25\\%$. Since users went down, this $25\\%$ is a fall.',
      conclusion: 'Users fell by 500 from a start of 2000, so over the full year the change was A decrease of 25%.',
      whyWrong: [
        'This is the advert\'s cherry-picked figure from September (1200) to December (1500). Over the full year the number of users went down.',
        'This divides the drop of 500 by the December value (1500) instead of the January value (2000). Percentage change is always divided by the **starting** value.',
        null,
        'This measures the drop from the March peak (2400) to December: $\\frac{900}{2400} = 37.5\\%$. The question asks for January to December.',
      ],
      keyIdea: 'To test a claim from a chart, use the full time range the question names, not the range the claim picked. Then use $\\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100$ and let the sign show rise or fall.',
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
      asking: 'What can the scatter graph honestly tell us about sleep and test scores?',
      solution:
        'Each dot is one student. Going right means more sleep, and going up means a higher score.\n\n' +
        'Test the word "every". One student with 7 hours scored 70, but one with 8 hours scored only 66. So a claim about every student is false.\n\n' +
        'Test the word "causes". The graph only records what happened, and nobody controlled how much anyone slept. Something else, such as being well organised, could explain both.\n\n' +
        'Now look at the whole cloud of dots. At 5 hours the score is 52, and at 9 hours it is 78. The dots rise overall from left to right, which is a **positive correlation**: more sleep generally went with a higher score.',
      conclusion: 'The graph shows a trend, with exceptions and no proof of cause. Students who slept more tended to score higher.',
      whyWrong: [
        'This claims **causation**. The data are observational, so a confounding variable (such as how organised a student is) could explain both more sleep and higher scores.',
        null,
        'Correlation describes the overall trend, not every pair of students. The chart has exceptions: 7 hours with a score of 70, but 8 hours with a score of 66.',
        'A correlation does not need perfect points on a line. The points clearly rise from left to right, which shows a positive (but not perfect) correlation.',
      ],
      keyIdea: 'For scatter-graph conclusions, choose wording like "tended to". Reject "causes", because a graph shows a link only. Reject "every" or "always" if a single pair of dots goes against the trend.',
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
      asking: 'What is wrong with asking people outside a gym how much adults exercise?',
      solution:
        'Who is she trying to learn about? All adults in the city. Who did she actually ask? Only people leaving a gym at 7 am.\n\n' +
        'People at a gym that early exercise more than a typical adult, and adults who never go to a gym can\'t be in her sample. So active people are over-represented, meaning there are too many of them compared with the city.\n\n' +
        'Now decide which way this pushes the estimate. An average made mostly from active people comes out higher than the true city average.',
      conclusion: 'The fault is where she sampled, not how many she asked. It over-represents active people, so the estimate is too high.',
      whyWrong: [
        'Sample size does not fix bias. 400 gym users still only represent gym users, not all adults in the city.',
        null,
        'The bias is identified correctly, but the direction is wrong. A sample full of active people gives an average that is too **high**, not too low.',
        'Changing the time of day still only samples gym users. The bias comes from **where** people were sampled, not when.',
      ],
      keyIdea: 'For a biased sample, ask two things. Who is over-represented, compared with the population? Then, which way does that push the average? A large sample, or sampling at another time in the same place, doesn\'t fix it.',
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
      asking: 'Which claim about the crime figures do the actual numbers support?',
      solution:
        'A percentage rise can sound big just because the starting number is small. So work out the actual rise in crimes for each town.\n\n' +
        'The actual rise is this year minus last year:\n\n| Town | Working | Extra crimes |\n|---|---|---|\n| Town A | $30 - 20$ | 10 |\n| Town B | $440 - 400$ | 40 |\n\n' +
        'Town A\'s $+50\\%$ is only 10 extra crimes, because it started at just 20. Town B\'s $+10\\%$ is 40 extra crimes, because it started at 400.\n\n' +
        'Compare the extra crimes: 40 is bigger than 10, so Town B\'s number of crimes went up by more.',
      conclusion: 'A big percentage on a small number can still be a small rise. Town B had the larger increase in the number of crimes.',
      whyWrong: [
        'This confuses a **percentage** increase with an **actual** increase. 50% of 20 is only 10 crimes, while 10% of 400 is 40 crimes.',
        'Town A has 30 crimes this year and Town B has 440, so Town A has far fewer.',
        'Percentages from groups of different sizes cannot be added. The combined change is $\\frac{470 - 420}{420} \\times 100 \\approx 11.9\\%$.',
        null,
      ],
      keyIdea: 'When a headline quotes a percentage, work out the actual change too: new minus old. A big percentage on a small base can mean fewer extra cases than a small percentage on a large base.',
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
      asking: 'How do the two hospitals compare within each severity group, and overall?',
      solution:
        'Each cell reads "survived / treated". The hospitals treat different numbers in each group, so counts can\'t be compared directly. We need survival rates: survived divided by treated.\n\n' +
        'Turn every cell into a percentage:\n\n| Hospital | Mild | Severe | All patients |\n|---|---|---|---|\n| A | $\\frac{90}{100} = 90\\%$ | $\\frac{120}{400} = 30\\%$ | $\\frac{210}{500} = 42\\%$ |\n| B | $\\frac{320}{400} = 80\\%$ | $\\frac{20}{100} = 20\\%$ | $\\frac{340}{500} = 68\\%$ |\n\n' +
        'Look at who each hospital treats. Most of A\'s patients are severe (400 of 500), while most of B\'s are mild (400 of 500). Severe cases survive less often, so that mix pulls A\'s overall figure down.\n\n' +
        'Now compare column by column. Mild: A\'s $90\\%$ beats B\'s $80\\%$. Severe: A\'s $30\\%$ beats B\'s $20\\%$. All patients: B\'s $68\\%$ beats A\'s $42\\%$.',
      conclusion: 'The reversal comes from the different mix of patients, so there is no error. Hospital A is better for both, but B is better overall.',
      whyWrong: [
        'Hospital B is lower in both groups: 80% vs 90% for mild cases and 20% vs 30% for severe cases. It only wins on the overall figure.',
        null,
        'Hospital A\'s overall rate is only $\\frac{210}{500} = 42\\%$, lower than Hospital B\'s 68%, because most of A\'s patients are severe cases.',
        'This reversal is possible and is called Simpson\'s paradox. It happens because the two hospitals treat very different mixes of patients: most of A\'s patients are severe cases, while most of B\'s are mild.',
      ],
      keyIdea: 'When a table has subgroups and a total, find the percentage in every cell and compare column by column. A group can win every subgroup but lose overall if its mix differs. This is called **Simpson\'s paradox**.',
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
      asking: 'What percentage of all 80 students passed, counting both classes together?',
      solution:
        'Don\'t average $90\\%$ and $50\\%$. That would treat the classes as equal, but Class Y has 60 students and Class X has only 20.\n\n' +
        'Instead, treat them as one big class. Add the passes: $18 + 30 = 48$.\n\n' +
        'Add the students: $20 + 60 = 80$.\n\n' +
        'Divide the passes by the students, then multiply by 100: $\\frac{48}{80} = 0.6$, and $0.6 \\times 100 = 60\\%$.',
      conclusion: '48 of the 80 students passed, so the combined pass rate is 60%.',
      whyWrong: [
        'This averages the two percentages: $\\frac{90 + 50}{2} = 70\\%$. That only works if the classes are the same size; Class Y has three times as many students.',
        'This is the **number** of students who passed (48), not the percentage. Divide by the 80 students in total.',
        null,
        'This is the combined **fail** rate: $\\frac{2 + 30}{80} \\times 100 = 40\\%$. The question asks for the pass rate.',
      ],
      keyIdea: 'To combine rates, add the counts on top and the group sizes on the bottom, then divide. Never average percentages from groups of different sizes. The result must fall between the two rates, closer to the bigger group\'s.',
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
      asking: 'What is the true growth per year, given that the gaps between the plotted years aren\'t equal?',
      solution:
        'Read the bottom axis: 2000, 2010, 2020, 2021, 2022, 2023. They are drawn evenly spaced, but the first two gaps are 10 years long and the others are only 1 year long.\n\n' +
        'So the steepness of the line can\'t be trusted. To compare fairly, find the growth per year, which is the growth divided by the number of years.\n\n' +
        'Do this for each gap:\n\n| Period | Growth (thousand) | Years | Growth per year (thousand) |\n|---|---|---|---|\n| 2000 to 2010 | $30 - 10 = 20$ | 10 | 2 |\n| 2010 to 2020 | $50 - 30 = 20$ | 10 | 2 |\n| 2020 to 2021 | $52 - 50 = 2$ | 1 | 2 |\n| 2021 to 2022 | $54 - 52 = 2$ | 1 | 2 |\n| 2022 to 2023 | $56 - 54 = 2$ | 1 | 2 |\n\n' +
        'Every row gives the same rate. The line only looks flatter after 2020 because those gaps cover just 1 year each.',
      conclusion: 'The rate is the same in every period, so the correct conclusion is this. Steady growth of 2 thousand per year throughout.',
      whyWrong: [
        null,
        'This treats each gap on the axis as one year. From 2000 to 2010 the increase of 20 thousand took **10 years**, so the rate was $\\frac{20}{10} = 2$ thousand per year.',
        'The line still rises by 2 thousand every year after 2020. It only looks flatter because each of those gaps is just one year wide.',
        'This compares totals over periods of different length (3 years against 10 years). Per year, both periods grew by 2 thousand.',
      ],
      keyIdea: 'Before judging how steep a line is, read the spacing of the time axis. If the time gaps differ, work out change divided by time for every gap, then compare those rates.',
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
      asking: 'Once we look inside each department, do the figures really show bias against women?',
      solution:
        'Each cell reads "accepted / applied". The overall figures are 64 of 100 men and 41 of 100 women. To test the claim, look inside each department, where the decisions are made.\n\n' +
        'Work out each department\'s acceptance rate:\n\n| Department | Men | Women |\n|---|---|---|\n| X | $\\frac{60}{80} = 75\\%$ | $\\frac{17}{20} = 85\\%$ |\n| Y | $\\frac{4}{20} = 20\\%$ | $\\frac{24}{80} = 30\\%$ |\n\n' +
        'Look at where people applied. 80 of the 100 women applied to Department Y, which accepts few people. 80 of the 100 men applied to Department X, which accepts many. That pulls the women\'s overall figure down.\n\n' +
        'Compare inside each department. In X, women\'s $85\\%$ is above men\'s $75\\%$. In Y, women\'s $30\\%$ is above men\'s $20\\%$.',
      conclusion: 'The overall gap comes from which department people applied to. Women had the higher rate in each department.',
      whyWrong: [
        'This only looks at the combined figures. Inside each department women were accepted at a **higher** rate, so the gap is explained by which department people applied to.',
        'This is the opposite of the data: men were accepted at 75% vs women 85% in X, and 20% vs 30% in Y.',
        'Averaging $85\\%$ and $30\\%$ ignores that 80 women applied to Y but only 20 to X. The real overall rate is $\\frac{41}{100} = 41\\%$.',
        null,
      ],
      keyIdea: 'When a headline gives an overall gap and a table has subgroups, work out the rate in each subgroup and compare inside them. Then see how each group is spread across the subgroups, which explains any reversal.',
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
      asking: 'What percentage of the 200 patients on each drug recovered?',
      solution:
        'Each cell reads "recovered / treated". An overall rate is the total recovered divided by the total treated. Don\'t average the age-group percentages, because the age groups are different sizes.\n\n' +
        'Drug P: add the recoveries across both age groups, $45 + 90 = 135$. Add the patients too, $50 + 150 = 200$.\n\n' +
        'Drug Q: add the recoveries, $136 + 22 = 158$. Add the patients too, $160 + 40 = 200$.\n\n' +
        'Divide each by 200 and multiply by 100. Drug P: $\\frac{135}{200} \\times 100 = 67.5\\%$. Drug Q: $\\frac{158}{200} \\times 100 = 79\\%$.',
      conclusion: 'Q wins overall because most of its patients were under 50, and they recover more often. The rates are P: 67.5%, Q: 79%.',
      whyWrong: [
        'This averages the two group rates for each drug: $\\frac{90 + 60}{2} = 75\\%$ and $\\frac{85 + 55}{2} = 70\\%$. The groups are different sizes, so you must add the counts and divide by 200.',
        null,
        'These are the correct two numbers but attached to the wrong drugs. P recovered $135$ patients and Q recovered $158$.',
        'This divides each drug\'s recoveries by all 400 patients in the study ($\\frac{135}{400}$ and $\\frac{158}{400}$) instead of the 200 patients who took that drug.',
      ],
      keyIdea: 'To get an overall rate from subgroups, add the counts on top and the totals on the bottom. Never average subgroup percentages. A treatment can win in each subgroup but lose overall if it had a harder mix of cases.',
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
      asking: 'What is the name for a hidden third factor that affects both of two linked variables?',
      solution:
        'Sometimes two variables move together only because something else pushes both of them. Ice-cream sales and drownings both rise in hot weather, for example.\n\n' +
        'Hot weather is a third variable that influences both, so it makes them look linked even though neither causes the other. A variable that does this is called a **confounding variable**.',
      conclusion: 'A third variable that influences both is called a Confounding variable.',
      whyWrong: [
        null,
        'A dependent variable is the outcome being measured in an experiment. It does not describe a hidden third factor.',
        'An outlier is a single data value far from the others, not a variable that influences two others.',
        'A residual is the gap between an actual value and a predicted value on a fitted line.',
      ],
      keyIdea: 'If you see "third variable" or "influences both", think confounding. A dependent variable is the outcome being measured, an outlier is one odd value, and a residual is the gap from a fitted line.',
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
      asking: 'What is the word for a sample that doesn\'t match its population fairly?',
      solution:
        'A **sample** is the group we actually collect data from, and the **population** is the whole group we want to know about. A good sample has the same mix as the population.\n\n' +
        'If a sample leans one way, any result from it leans that way too. For example, asking only gym users about exercise gives figures that are too high. A sample like this is called **biased**.',
      conclusion: 'A sample that doesn\'t fairly represent its population is described as Biased.',
      whyWrong: [
        null,
        'A random sample gives every member a chance of selection, which is how bias is usually avoided.',
        'Size is a separate issue. A large sample can still be biased, and a large biased sample is still misleading.',
        'Paired describes data collected in matched pairs. It says nothing about whether the sample is representative.',
      ],
      keyIdea: 'Ask whether some people were more likely to be included than others. If so, the sample is biased. Random selection is the usual way to avoid this, and a large sample can still be biased.',
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
      asking: 'What does a strong positive correlation between two variables actually tell us?',
      solution:
        '**Correlation** describes how two variables move relative to each other. **Positive** means that when one is higher, the other tends to be higher too. **Strong** means the points sit close to a straight line.\n\n' +
        'For example, taller children tend to weigh more. That is a trend, not a rule: some tall children weigh less than some shorter ones, and height never has to equal weight.\n\n' +
        'Correlation alone can\'t prove a cause, because a third variable might drive both. So the only safe conclusion describes the shared direction, as a general tendency.',
      conclusion: 'Correlation describes a shared direction and nothing more. They tend to increase together.',
      whyWrong: [
        null,
        'Correlation does not imply causation. A third variable could be driving both.',
        'Correlation is about how two variables move together, not about their sizes. Their values can be very different.',
        'Both variables can rise and fall. Positive correlation only means that they tend to move in the same direction.',
      ],
      keyIdea: 'Read correlation words like this. Positive: up together. Negative: one up, the other down. Strong: close to a line. Reject any option claiming a cause, or using "always" or "never".',
    },
  },
];
