import type { StaticQuestion } from '../../../types';
import { mean, sampleVariance, sd, sumOf, variance } from '../../../lib/mathx';

export const questions: StaticQuestion[] = [
  {
    id: 'variance-sd-001',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'Find the **population** standard deviation of the data set $2, 4, 4, 4, 5, 5, 7, 9$.\n\nGive non-integer answers to 2 decimal places.',
    options: ['$1.50$', '$2$', '$4$', '$2.14$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How spread out are these 8 numbers around their mean, measured by the standard deviation?',
      solution:
        'The **standard deviation** (SD) measures how far values tend to be from the mean. **Population** means these 8 values are all the data, so we divide by $n = 8$, the number of values.\n\n' +
        'Find the mean: $\\frac{2 + 4 + 4 + 4 + 5 + 5 + 7 + 9}{8} = \\frac{40}{8} = 5$.\n\n' +
        'Subtract the mean from each value, then square. Squaring stops the negatives cancelling the positives:\n\n| $x$ | $x - 5$ | $(x - 5)^2$ |\n|---|---|---|\n| 2 | $-3$ | 9 |\n| 4 | $-1$ | 1 |\n| 4 | $-1$ | 1 |\n| 4 | $-1$ | 1 |\n| 5 | 0 | 0 |\n| 5 | 0 | 0 |\n| 7 | 2 | 4 |\n| 9 | 4 | 16 |\n\n' +
        'Add the last column. The zeros add nothing, so this is $9 + 1 + 1 + 1 + 4 + 16 = 32$.\n\n' +
        'Divide by $n = 8$ to get the **variance**, the average squared distance: $32 \\div 8 = 4$.\n\n' +
        'The SD is the square root of the variance: $\\sqrt{4} = 2$.',
      conclusion: 'The variance is 4, and its square root gives the answer, $2$.',
      whyWrong: [
        'This is the **mean absolute deviation**: the average of the distances $3, 1, 1, 1, 0, 0, 2, 4$ without squaring them ($\\frac{12}{8} = 1.5$). The standard deviation squares the deviations first.',
        null,
        'This is the **variance** ($\\frac{32}{8} = 4$). You forgot the last step: the standard deviation is the square root of the variance.',
        'This divides by $n - 1 = 7$ instead of $n = 8$ ($\\sqrt{\\frac{32}{7}} \\approx 2.14$), which is the **sample** standard deviation, not the population one.',
      ],
      keyIdea: 'SD in five moves: find the mean, subtract it from each value, square those, average them (divide by $n$ for a population), and take the square root. A table keeps the working tidy.',
    },
    check: {
      optionValues: [1.5, 2, 4, Math.sqrt(32 / 7)],
      compute: () => sd([2, 4, 4, 4, 5, 5, 7, 9]),
    },
  },
  {
    id: 'variance-sd-002',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'Find the **population** variance of the data set $1, 3, 5, 7, 9$.',
    options: ['$40$', '$10$', '$8$', '$2\\sqrt{2}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the average squared distance of these numbers from their mean?',
      solution:
        '**Variance** measures spread. It is the average of the squared distances from the mean. **Population** variance means you divide by $n$, how many values there are.\n\n' +
        'Find the mean: $\\frac{1 + 3 + 5 + 7 + 9}{5} = \\frac{25}{5} = 5$.\n\n' +
        'Subtract 5 from each value, then square:\n\n| $x$ | $x - 5$ | $(x - 5)^2$ |\n|---|---|---|\n| 1 | $-4$ | 16 |\n| 3 | $-2$ | 4 |\n| 5 | 0 | 0 |\n| 7 | 2 | 4 |\n| 9 | 4 | 16 |\n\n' +
        'Add the last column. The zero adds nothing, so this is $16 + 4 + 4 + 16 = 40$.\n\n' +
        'Divide by $n = 5$: $40 \\div 5 = 8$.',
      conclusion: 'The squared distances total 40 across 5 values, so the variance is $8$.',
      whyWrong: [
        'This is the **sum** of the squared deviations, $40$. The variance is their **mean**, so you still need to divide by $n = 5$.',
        'This divides by $n - 1 = 4$, which gives the sample variance. For the population variance divide by $n = 5$.',
        null,
        'This is the **standard deviation**, $\\sqrt{8} = 2\\sqrt{2}$. The question asks for the variance, which is not square-rooted.',
      ],
      keyIdea: 'Population variance: $\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}$, where $\\bar{x}$ is the mean and $\\sum$ means add up. Build a table with columns $x$, $x - \\bar{x}$ and $(x - \\bar{x})^2$.',
    },
    check: {
      optionValues: [40, 10, 8, 2 * Math.sqrt(2)],
      compute: () => variance([1, 3, 5, 7, 9]),
    },
  },
  {
    id: 'variance-sd-003',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
    stem: 'A data set has mean $12$ and standard deviation $3$. The same number, $5$, is **added** to every value. What are the new mean and standard deviation?',
    options: ['Mean $17$, SD $8$', 'Mean $12$, SD $3$', 'Mean $60$, SD $15$', 'Mean $17$, SD $3$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What happens to the mean and the SD when 5 is added to every value?',
      solution:
        'The **mean** is the centre. If every value goes up by 5, the centre goes up by 5 too: $12 + 5 = 17$.\n\n' +
        'The **standard deviation** (SD) measures how spread out the values are. Adding 5 to every value doesn\'t change the gaps between them. For example, 10 and 14 are 4 apart, and so are 15 and 19. So the SD stays 3.',
      conclusion: 'Adding moves the centre but not the gaps, so the answer is Mean $17$, SD $3$.',
      whyWrong: [
        'This adds $5$ to the standard deviation too. Adding a constant shifts the values but does not spread them out, so the SD stays $3$.',
        'This leaves the mean unchanged as well. The spread is unchanged, but the centre of the data moves up by $5$.',
        'This **multiplies** everything by $5$ instead of adding $5$. Multiplying would scale both the mean and the SD; adding only shifts the mean.',
        null,
      ],
      keyIdea: 'Adding a constant changes the mean by that constant and leaves the SD alone. Multiplying by a constant multiplies the mean by it, and the SD by its size without any minus sign. Try it on two small numbers if unsure.',
    },
    check: {
      optionValues: ['17,8', '12,3', '60,15', '17,3'],
      compute: () => {
        const original = [9, 15]; // mean 12, population SD 3
        if (mean(original) !== 12 || sd(original) !== 3) throw new Error('bad example data');
        const shifted = original.map((x) => x + 5);
        return `${mean(shifted)},${sd(shifted)}`;
      },
    },
  },
  {
    id: 'variance-sd-004',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
    stem: 'The variance of a set of reaction times is $2.25 \\text{ s}^2$. What is the standard deviation?',
    options: ['$5.0625$ s', '$1.125$ s', '$1.5$ s', '$2.25$ s'],
    correctIndex: 2,
    markScheme: {
      asking: 'Turn a variance of $2.25$ into a standard deviation.',
      solution:
        'The **standard deviation** (SD) is the square root of the variance. So we need the number which, multiplied by itself, gives $2.25$.\n\n' +
        'Try $1.5$: $1.5 \\times 1.5 = 2.25$. So $\\sqrt{2.25} = 1.5$, and the units go from $\\text{s}^2$ back to s (seconds).',
      conclusion: 'Taking the square root of $2.25$ gives the answer, $1.5$ s.',
      whyWrong: [
        'This **squares** the variance ($2.25^2 = 5.0625$). To go from variance to SD you take the square root, not the square.',
        'This halves the variance. Taking a square root is not the same as dividing by $2$: check $1.125^2 \\approx 1.27$, not $2.25$.',
        null,
        'This treats the variance as if it were the standard deviation. They are only equal when both are $0$ or both are $1$.',
      ],
      keyIdea: 'Variance to SD: take the square root. SD to variance: square it. The units confirm which is which: variance has squared units, and the SD has the same units as the data.',
    },
    check: {
      optionValues: [5.0625, 1.125, 1.5, 2.25],
      compute: () => Math.sqrt(2.25),
    },
  },
  {
    id: 'variance-sd-005',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
    stem: 'Which statement about the standard deviation of a data set is **true**?',
    options: [
      'It can be negative when most values are below the mean.',
      'It is the square root of the variance.',
      'It is measured in squared units, for example $\\text{cm}^2$ when the data are heights in cm.',
      'Adding the same number to every value makes it larger.',
    ],
    correctIndex: 1,
    markScheme: {
      asking: 'Which one of these statements about the standard deviation is correct?',
      solution:
        'The **standard deviation** (SD) is built in stages. Find each value\'s distance from the mean, square it, then average those squares. That average is the **variance**. Then take the square root.\n\n' +
        'Test each statement against those stages:\n\n| Statement | Verdict | Why |\n|---|---|---|\n| Can be negative | False | Squares are never negative, so neither is their square root |\n| Square root of the variance | True | This is the last stage |\n| In squared units | False | That is the variance, and the root brings back the original units |\n| Adding a number makes it larger | False | Adding moves every value, but the gaps stay the same |',
      conclusion: 'The last stage of the calculation gives the answer: It is the square root of the variance.',
      whyWrong: [
        'The SD is built from **squared** deviations, which are never negative, so it is always $\\ge 0$. Values below the mean have negative deviations, but squaring removes the sign.',
        null,
        'That describes the **variance**. Taking the square root returns the SD to the original units (cm).',
        'Adding the same number to every value shifts the data without spreading it out; the SD is unchanged.',
      ],
      keyIdea: 'Keep these facts together: SD $= \\sqrt{\\text{variance}}$, an SD is never negative, an SD has the same units as the data, and adding a constant leaves it unchanged.',
    },
  },
  {
    id: 'variance-sd-006',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'For a data set of $n = 10$ values, $\\sum x = 50$ and $\\sum x^2 = 290$. What is the **population** standard deviation?\n\nGive non-integer answers to 2 decimal places.',
    options: ['$2$', '$4$', '$4.90$', '$2.11$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the standard deviation, given only the totals $\\sum x$ and $\\sum x^2$?',
      solution:
        '$\\sum x$ means the total of the values, and $\\sum x^2$ means the total of their squares. With totals instead of a list, use this shortcut for the **variance** $\\sigma^2$, where $\\bar{x}$ is the mean:\n\n$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$$\n\n' +
        'Find the mean, which is the total divided by how many values: $\\bar{x} = \\frac{50}{10} = 5$.\n\n' +
        'Substitute: $\\sigma^2 = \\frac{290}{10} - 5^2 = 29 - 25 = 4$.\n\n' +
        'The **standard deviation** is the square root of the variance: $\\sigma = \\sqrt{4} = 2$.',
      conclusion: 'The variance is 4, and its square root gives the answer, $2$.',
      whyWrong: [
        null,
        'This is the **variance**, $4$. The standard deviation is its square root.',
        'This forgets to **square** the mean: $29 - 5 = 24$ and $\\sqrt{24} \\approx 4.90$. The formula subtracts $\\bar{x}^2 = 25$.',
        'This is the **sample** SD: $\\sqrt{\\frac{290 - 10 \\times 5^2}{9}} = \\sqrt{\\frac{40}{9}} \\approx 2.11$. The question asks for the population SD, which divides by $n$.',
      ],
      keyIdea: 'Given $\\sum x$ and $\\sum x^2$, use $\\sigma^2 = \\frac{\\sum x^2}{n} - \\left(\\frac{\\sum x}{n}\\right)^2$. Think "mean of the squares minus square of the mean", then take the square root for the SD.',
    },
    check: {
      optionValues: [2, 4, Math.sqrt(24), Math.sqrt(40 / 9)],
      compute: () => {
        const n = 10;
        const sx = 50;
        const sxx = 290;
        const mu = sx / n;
        return Math.sqrt(sxx / n - mu * mu);
      },
    },
  },
  {
    id: 'variance-sd-007',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'Temperatures have mean $20$°C and standard deviation $5$°C. They are converted to Fahrenheit using $F = 1.8C + 32$. What is the standard deviation in °F?',
    options: ['$41$ °F', '$16.2$ °F', '$5$ °F', '$9$ °F'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the SD of the temperatures after changing them to Fahrenheit?',
      solution:
        'Look at what $F = 1.8C + 32$ does to each temperature: it multiplies by $1.8$, then adds 32. The **standard deviation** (SD) measures spread, so ask what each part does to the gaps between values.\n\n' +
        'Adding 32 moves every temperature up by the same amount. The gaps stay the same, so this part doesn\'t change the SD.\n\n' +
        'Multiplying by $1.8$ makes every gap $1.8$ times as wide, so the SD is multiplied by $1.8$ too.\n\n' +
        'New SD: $1.8 \\times 5 = 9$.',
      conclusion: 'Only the multiplying changes the spread, so the SD becomes $9$ °F.',
      whyWrong: [
        'This applies the whole formula to the SD: $1.8 \\times 5 + 32 = 41$. The $+32$ shifts every value equally, so it does not affect the spread.',
        'This multiplies by $1.8^2 = 3.24$, giving $3.24 \\times 5 = 16.2$. The square of the factor is used for the **variance**, not the SD.',
        'This assumes changing units does not affect the spread. The $+32$ does not, but multiplying by $1.8$ does: every gap between values becomes $1.8$ times bigger.',
        null,
      ],
      keyIdea: 'For $y = ax + b$, new SD $= |a| \\times$ old SD, where $|a|$ is $a$ without any minus sign. The $b$ only moves the values along, so it is ignored. The mean isn\'t needed to find the new SD.',
    },
    check: {
      optionValues: [41, 16.2, 5, 9],
      compute: () => {
        const celsius = [15, 25]; // mean 20, SD 5
        if (mean(celsius) !== 20 || sd(celsius) !== 5) throw new Error('bad example data');
        return sd(celsius.map((c) => 1.8 * c + 32));
      },
    },
  },
  {
    id: 'variance-sd-008',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'A data set has variance $16$. Every value is multiplied by $3$ and then $2$ is subtracted. What is the variance of the new data set?',
    options: ['$48$', '$144$', '$142$', '$46$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the new variance after multiplying by 3 and subtracting 2?',
      solution:
        '**Variance** measures spread, so ask what each change does to the gaps between values.\n\n' +
        'Subtracting 2 moves every value down by the same amount. The gaps don\'t change, so this has no effect on the variance.\n\n' +
        'Multiplying by 3 makes every gap 3 times as wide. Variance uses **squared** distances, so it is multiplied by $3^2 = 9$.\n\n' +
        'Multiply: $9 \\times 16 = 144$.',
      conclusion: 'Only the multiplying changes the spread, and it counts squared, so the answer is $144$.',
      whyWrong: [
        'This multiplies the variance by $3$ instead of $3^2 = 9$. The variance is in squared units, so the multiplier must be squared.',
        null,
        'This squares the multiplier correctly ($9 \\times 16 = 144$) but then also subtracts $2$. Subtracting a constant from every value does not change the spread.',
        'This applies the transformation to the variance itself ($3 \\times 16 - 2 = 46$): it forgets to square the $3$ and wrongly lets the $-2$ change the spread.',
      ],
      keyIdea: 'For $y = ax + b$: new variance $= a^2 \\times$ old variance. Square the multiplier, and ignore the number added or subtracted. If you are given the SD instead, multiply it by $|a|$, which is $a$ without any minus sign.',
    },
    check: {
      optionValues: [48, 144, 142, 46],
      compute: () => {
        const xs = [-4, 4]; // variance 16
        if (variance(xs) !== 16) throw new Error('bad example data');
        return variance(xs.map((x) => 3 * x - 2));
      },
    },
  },
  {
    id: 'variance-sd-009',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'A sample of $5$ values is $2, 5, 8, 9, 11$. Find the sample variance $s^2$, which divides by $n - 1$.\n\nGive non-integer answers to 2 decimal places.',
    options: ['$10$', '$50$', '$12.50$', '$3.54$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the variance of this sample, dividing by $n - 1$?',
      solution:
        'The **sample variance** $s^2$ measures spread using the squared distances from the mean. It divides by $n - 1$, where $n = 5$ is the number of values.\n\n' +
        'Find the mean: $\\frac{2 + 5 + 8 + 9 + 11}{5} = \\frac{35}{5} = 7$.\n\n' +
        'Subtract 7 from each value, then square:\n\n| $x$ | $x - 7$ | $(x - 7)^2$ |\n|---|---|---|\n| 2 | $-5$ | 25 |\n| 5 | $-2$ | 4 |\n| 8 | 1 | 1 |\n| 9 | 2 | 4 |\n| 11 | 4 | 16 |\n\n' +
        'Add the last column: $25 + 4 + 1 + 4 + 16 = 50$.\n\n' +
        'Divide by $n - 1 = 5 - 1 = 4$: $50 \\div 4 = 12.50$.',
      conclusion: 'The squared distances total 50, and dividing by 4 gives the answer, $12.50$.',
      whyWrong: [
        'This divides by $n = 5$, which gives the population variance. When a sample is used to estimate the variance of a whole population, divide by $n - 1 = 4$.',
        'This is the sum of the squared deviations, $50$; you still need to divide by $n - 1 = 4$.',
        null,
        'This is the sample **standard deviation**, $\\sqrt{12.5} \\approx 3.54$. The question asks for the variance.',
      ],
      keyIdea: 'Both kinds of variance use the same table. For a **sample**, divide the sum of squares by $n - 1$. For a **population**, divide by $n$. The question\'s wording tells you which one it wants.',
    },
    check: {
      optionValues: [10, 50, 12.5, Math.sqrt(12.5)],
      compute: () => sampleVariance([2, 5, 8, 9, 11]),
    },
  },
  {
    id: 'variance-sd-010',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'The table shows the scores of $10$ students on a short quiz. Find the **population** variance of the scores.\n\nGive non-integer answers to 2 decimal places.',
    table: {
      caption: 'Quiz scores',
      headers: ['Score $x$', 'Frequency $f$'],
      rows: [
        [1, 1],
        [2, 2],
        [3, 4],
        [4, 2],
        [5, 1],
      ],
    },
    options: ['$1.20$', '$2$', '$2.40$', '$1.33$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the variance of the 10 quiz scores in the frequency table?',
      solution:
        '$f$ (the frequency) is how many students got each score. So score 3 with $f = 4$ means four students scored 3. There are $n = 1 + 2 + 4 + 2 + 1 = 10$ students in total.\n\n' +
        'Find the mean. Multiply each score by its frequency, add, then divide by 10: $\\frac{1 \\times 1 + 2 \\times 2 + 3 \\times 4 + 4 \\times 2 + 5 \\times 1}{10} = \\frac{30}{10} = 3$.\n\n' +
        'Find each score\'s squared distance from the mean. Then count it once per student, by multiplying by $f$:\n\n| $x$ | $f$ | $(x - 3)^2$ | $f \\times (x - 3)^2$ |\n|---|---|---|---|\n| 1 | 1 | 4 | 4 |\n| 2 | 2 | 1 | 2 |\n| 3 | 4 | 0 | 0 |\n| 4 | 2 | 1 | 2 |\n| 5 | 1 | 4 | 4 |\n\n' +
        'Add the last column. The zero adds nothing, so this is $4 + 2 + 2 + 4 = 12$.\n\n' +
        '**Population variance** means dividing by $n = 10$: $12 \\div 10 = 1.20$.',
      conclusion: 'The squared distances total 12 across 10 students, so the answer is $1.20$.',
      whyWrong: [
        null,
        'This ignores the frequencies and finds the variance of $1, 2, 3, 4, 5$ with each score counted once. Each score must be counted as many times as it occurs.',
        'This weights by frequency correctly but divides $12$ by $5$ (the number of different scores) instead of $10$ (the number of students).',
        'This divides by $n - 1 = 9$, giving the sample variance $\\frac{12}{9} \\approx 1.33$. The question asks for the population variance.',
      ],
      keyIdea: 'With a frequency table, use $\\sigma^2 = \\frac{\\sum f(x - \\bar{x})^2}{\\sum f}$, where $\\sigma^2$ is the variance, $\\bar{x}$ is the mean and $\\sum$ means add up. Add a column for $f \\times (x - \\bar{x})^2$, and divide its total by the number of values, not the number of rows.',
    },
    check: {
      optionValues: [1.2, 2, 2.4, 12 / 9],
      compute: () => {
        const table: [number, number][] = [
          [1, 1],
          [2, 2],
          [3, 4],
          [4, 2],
          [5, 1],
        ];
        const data = table.flatMap(([x, f]) => Array<number>(f).fill(x));
        return variance(data);
      },
    },
  },
  {
    id: 'variance-sd-012',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'For the data $3, 5, 7, 9$, find the population variance and the sample variance, in that order, to 2 decimal places.',
    options: ['$5.00$ and $6.67$', '$6.67$ and $5.00$', '$2.24$ and $2.58$', '$20.00$ and $20.00$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the variance when dividing by $n$, and what is it when dividing by $n - 1$?',
      solution:
        'Both variances start from the same sum of squared distances from the mean. So find the mean first: $\\frac{3 + 5 + 7 + 9}{4} = \\frac{24}{4} = 6$.\n\n' +
        'Subtract 6 from each value, then square:\n\n| $x$ | $x - 6$ | $(x - 6)^2$ |\n|---|---|---|\n| 3 | $-3$ | 9 |\n| 5 | $-1$ | 1 |\n| 7 | 1 | 1 |\n| 9 | 3 | 9 |\n\n' +
        'Add the last column: $9 + 1 + 1 + 9 = 20$.\n\n' +
        'The **population variance** divides by $n = 4$: $20 \\div 4 = 5.00$.\n\n' +
        'The **sample variance** divides by $n - 1 = 3$: $20 \\div 3 \\approx 6.67$.',
      conclusion: 'Population first, then sample, as the question asks, gives $5.00$ and $6.67$.',
      whyWrong: [
        null,
        'This gives the two results in the wrong order. The population variance divides by $n$, so it is the smaller one.',
        'These are the square roots of the two results, which are the standard deviations. The question asks for variances.',
        'This is the sum of squared deviations, which is the same for both. You still have to divide it by $n$ and by $n - 1$.',
      ],
      keyIdea: 'Both variances share the same sum of squared distances. Divide by $n$ for the population and by $n - 1$ for a sample. The sample one is always larger, because its bottom number is smaller.',
    },
    check: {
      optionValues: ['5.00,6.67', '6.67,5.00', '2.24,2.58', '20.00,20.00'],
      compute: () => {
        const d = [3, 5, 7, 9];
        return `${variance(d).toFixed(2)},${sampleVariance(d).toFixed(2)}`;
      },
    },
  },
  {
    id: 'variance-sd-013',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'Five numbers have mean $6$ and population variance $4$. What is $\\sum x^2$, the sum of the squares of the five numbers?',
    options: ['$200$', '$40$', '$56$', '$160$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do the squares of the five numbers add up to?',
      solution:
        'We don\'t know the numbers, so use the formula that links variance and the sum of squares. Here $\\sigma^2$ is the variance, $n$ is how many numbers there are, and $\\bar{x}$ is the mean:\n\n$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$$\n\n' +
        'Substitute $\\sigma^2 = 4$, $n = 5$ and $\\bar{x} = 6$: $4 = \\frac{\\sum x^2}{5} - 6^2$, so $4 = \\frac{\\sum x^2}{5} - 36$.\n\n' +
        'Add 36 to both sides to get the fraction alone: $40 = \\frac{\\sum x^2}{5}$.\n\n' +
        'Multiply both sides by 5 to get the sum alone: $\\sum x^2 = 40 \\times 5 = 200$.',
      conclusion: 'The mean of the squares is 40, and there are 5 numbers, so the answer is $200$.',
      whyWrong: [
        null,
        'This is $\\frac{\\sum x^2}{n} = 40$, the **mean** of the squares. Multiply by $n = 5$ to get the sum.',
        'This multiplies only the variance by $n$: $5 \\times 4 + 6^2 = 56$. Both terms must be multiplied by $n$: $5 \\times (4 + 36)$.',
        'This subtracts the variance instead of adding it: $5 \\times (36 - 4) = 160$. Since $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$, the mean of the squares is $\\sigma^2 + \\bar{x}^2$.',
      ],
      keyIdea: 'When a question gives the variance and the mean but not the data, rearrange $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$ to get $\\sum x^2 = n(\\sigma^2 + \\bar{x}^2)$.',
    },
    check: {
      optionValues: [200, 40, 56, 160],
      compute: () => {
        const xs = [3, 5, 6, 7, 9]; // any data with n = 5, mean 6, variance 4
        if (xs.length !== 5 || mean(xs) !== 6 || variance(xs) !== 4) throw new Error('bad example data');
        return sumOf(xs.map((x) => x * x));
      },
    },
  },
  {
    id: 'variance-sd-014',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'The bar chart shows the number of items sold by two market stalls on each of five days. Which statement is correct? (Use population standard deviations.)',
    chart: {
      kind: 'bar',
      title: 'Items sold per day',
      xLabel: 'Day',
      yLabel: 'Items sold',
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [
        { name: 'Stall A', values: [20, 22, 18, 21, 19] },
        { name: 'Stall B', values: [30, 10, 25, 15, 20] },
      ],
    },
    options: [
      'Stall B has the higher mean',
      'Same mean and same standard deviation',
      'Same mean, and Stall B\'s standard deviation is $5$ times Stall A\'s',
      'Same mean, and Stall B\'s standard deviation is $25$ times Stall A\'s',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'How do the means and standard deviations of the two stalls compare?',
      solution:
        'Read the five values for each stall from the chart. Stall A: 20, 22, 18, 21, 19. Stall B: 30, 10, 25, 15, 20.\n\n' +
        'Find each mean. Stall A: $\\frac{20 + 22 + 18 + 21 + 19}{5} = \\frac{100}{5} = 20$. Stall B: $\\frac{30 + 10 + 25 + 15 + 20}{5} = \\frac{100}{5} = 20$. So the means are equal.\n\n' +
        'Find each value\'s squared distance from 20. For example, 22 is 2 away, and $2^2 = 4$:\n\n| Day | Stall A | Squared distance | Stall B | Squared distance |\n|---|---|---|---|---|\n| Mon | 20 | 0 | 30 | 100 |\n| Tue | 22 | 4 | 10 | 100 |\n| Wed | 18 | 4 | 25 | 25 |\n| Thu | 21 | 1 | 15 | 25 |\n| Fri | 19 | 1 | 20 | 0 |\n\n' +
        'Add each squared-distance column, then divide by 5 to get the **variance**. Stall A: $\\frac{10}{5} = 2$. Stall B: $\\frac{250}{5} = 50$.\n\n' +
        'The **standard deviation** (SD) is the square root of the variance. So the ratio of the SDs is $\\frac{\\sqrt{50}}{\\sqrt{2}} = \\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$.',
      conclusion: 'Both means are 20 and the SD ratio is 5, so the answer is: Same mean, and Stall B\'s standard deviation is $5$ times Stall A\'s.',
      whyWrong: [
        'Both totals are $100$ over $5$ days, so both means are $20$. One high day does not raise the mean when other days are low.',
        'Equal totals give equal means, but say nothing about spread: Stall B swings between $10$ and $30$, while Stall A stays between $18$ and $22$.',
        null,
        '$25$ is the ratio of the **variances** ($\\frac{50}{2} = 25$). Standard deviations are the square roots, so their ratio is $\\sqrt{25} = 5$.',
      ],
      keyIdea: 'To compare two data sets, find each mean, then each variance. The ratio of the SDs is the square root of the ratio of the variances, so you don\'t need to work out each square root separately.',
    },
    check: {
      optionValues: [null, 1, 5, 25],
      compute: () => {
        const a = [20, 22, 18, 21, 19];
        const b = [30, 10, 25, 15, 20];
        if (mean(a) !== mean(b)) throw new Error('means differ');
        return sd(b) / sd(a);
      },
    },
  },
  {
    id: 'variance-sd-015',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'A data set has mean $10$ and standard deviation $2$. Each value $x$ becomes $y = ax + b$, with $a > 0$. The new mean is $23$ and the new standard deviation is $5$. Find $b$.',
    options: ['$13$', '$-7$', '$20.5$', '$-2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What number $b$ is added after multiplying, to give the new mean and SD?',
      solution:
        'For $y = ax + b$, the **standard deviation** (SD) changes only through $a$, because adding $b$ moves every value equally and leaves the gaps alone. So new SD $= a \\times$ old SD.\n\n' +
        'Substitute the SDs: $5 = a \\times 2$. Divide both sides by 2 to get $a = 2.5$.\n\n' +
        'The mean goes through the whole formula: new mean $= a \\times$ old mean $+ b$.\n\n' +
        'Substitute: $23 = 2.5 \\times 10 + b$, so $23 = 25 + b$.\n\n' +
        'Subtract 25 from both sides to get $b$ alone: $b = 23 - 25 = -2$.',
      conclusion: 'Checking: $2.5 \\times 10 - 2 = 23$ and $2.5 \\times 2 = 5$, so the answer is $-2$.',
      whyWrong: [
        'This treats the change as a pure shift, $b = 23 - 10 = 13$. But the SD also changed, which means the values were multiplied by $a = 2.5$ before $b$ was added.',
        'This finds $a$ by **subtracting** the SDs ($5 - 2 = 3$) instead of dividing. Multiplying by $a$ multiplies the SD, so $a = \\frac{5}{2}$; with $a = 3$ you get $b = 23 - 30 = -7$.',
        'This finds $a = 2.5$ correctly but then uses $b = 23 - a = 20.5$, forgetting that it is the **mean** $10$ that gets multiplied by $a$: $b = 23 - 2.5 \\times 10$.',
        null,
      ],
      keyIdea: 'For $y = ax + b$ with $a > 0$: find $a$ from the SDs, using $a = \\frac{\\text{new SD}}{\\text{old SD}}$. Then find $b$ from the means, using $b = \\text{new mean} - a \\times \\text{old mean}$.',
    },
    check: {
      optionValues: [13, -7, 20.5, -2],
      compute: () => {
        const old = [8, 12]; // mean 10, SD 2
        const a = 5 / sd(old);
        const b = 23 - a * mean(old);
        const y = old.map((x) => a * x + b);
        if (mean(y) !== 23 || sd(y) !== 5) throw new Error('transformation does not reproduce the data');
        return b;
      },
    },
  },
  {
    id: 'variance-sd-019',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
    stem: 'What is the standard deviation of the data set $7, 7, 7, 7$?',
    options: ['$0$', '$7$', '$1$', '$49$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the spread of a list where every value is the same?',
      solution:
        'The **standard deviation** (SD) measures how far values are from the mean. The mean of $7, 7, 7, 7$ is 7.\n\n' +
        'Every value is exactly at the mean, so each distance is $7 - 7 = 0$. All the squared distances are 0, so the variance is 0.\n\n' +
        'The SD is the square root of the variance: $\\sqrt{0} = 0$.',
      conclusion: 'No value is any distance from the mean, so the answer is $0$.',
      whyWrong: [
        null,
        'This is the mean. The standard deviation measures the distance from the mean, and here that distance is zero.',
        'A value of $1$ would need the data to differ from the mean. Here no value differs at all.',
        'This squares the mean. Identical values have no spread, whatever their size.',
      ],
      keyIdea: 'If all the values are the same, there is no spread, so the SD and the variance are 0, however large the values are. An SD of 0 can only happen when all the values match.',
    },
    check: {
      optionValues: [0, 7, 1, 49],
      compute: () => sd([7, 7, 7, 7]),
    },
  },
  {
    id: 'variance-sd-020',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
    stem: 'When finding the **sample** variance $s^2$ of $n$ values, the sum of squared deviations is divided by:',
    options: ['$n - 1$', '$n$', '$n + 1$', '$n^2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What number do we divide by to get the sample variance?',
      solution:
        'Variance is a sum of squared distances from the mean, divided by a count. A **population** variance uses all the data, so it divides by $n$, the number of values.\n\n' +
        'A **sample** is only part of the data. Its own mean sits closer to its values than the true mean does, so the squared distances come out a little too small.\n\n' +
        'We correct for this by dividing by a smaller number, one less than $n$, which is $n - 1$.',
      conclusion: 'Dividing by one less than the number of values corrects the sample, so the answer is $n - 1$.',
      whyWrong: [
        null,
        'Dividing by $n$ gives the **population** variance.',
        'Neither variance divides by $n + 1$. The correction makes the divisor smaller, not larger.',
        'Neither variance divides by $n^2$. You may be thinking of the square of the mean in the computational formula.',
      ],
      keyIdea: 'Sample variance is $s^2 = \\frac{\\sum (x - \\bar{x})^2}{n - 1}$. Population variance is $\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}$. Here $\\bar{x}$ is the mean and $\\sum$ means add up. The word "sample" or the symbol $s^2$ signals $n - 1$.',
    },
    check: {
      // n = 4
      optionValues: [3, 4, 5, 16],
      compute: () => {
        const d = [3, 5, 7, 9];
        const mu = mean(d);
        return sumOf(d.map((x) => (x - mu) ** 2)) / sampleVariance(d);
      },
    },
  },
  {
    id: 'variance-sd-021',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
    stem: 'Every value in a data set is multiplied by $3$. What happens to the standard deviation?',
    options: ['It is multiplied by $3$', 'It is multiplied by $9$', 'It does not change', 'It increases by $3$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does multiplying every value by 3 do to the standard deviation?',
      solution:
        'The **standard deviation** (SD) measures spread, the typical distance of values from the mean. So look at what happens to distances.\n\n' +
        'Try a small example. 2 and 4 are 2 apart. Times 3, they become 6 and 12, which are 6 apart. Every gap becomes 3 times as wide, so the SD does the same.',
      conclusion: 'Every distance becomes 3 times as wide, so the answer is It is multiplied by $3$.',
      whyWrong: [
        null,
        'The **variance** is multiplied by $3^2 = 9$. The standard deviation is its square root, so it is multiplied by $3$.',
        'This is what happens when the same number is **added** to every value. Multiplying does stretch the data.',
        'The change is a multiplication, not an increase by a fixed amount. A larger spread grows by more.',
      ],
      keyIdea: 'Multiplying every value by $a$ multiplies the SD by $|a|$ ($a$ without any minus sign) and the variance by $a^2$. Adding a number to every value changes neither.',
    },
    check: {
      optionValues: [3, 9, 1, null],
      compute: () => {
        const d = [2, 4, 4, 9];
        return sd(d.map((x) => 3 * x)) / sd(d);
      },
    },
  },
  {
    id: 'variance-sd-022',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
    stem: 'What does the standard deviation of a data set measure?',
    options: ['How spread out the values are around the mean', 'The central value of the data', 'The most common value', 'The largest value minus the smallest'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the standard deviation tell us about a data set?',
      solution:
        'The **standard deviation** is about how far the values typically sit from the mean. It is a measure of **spread**, not of where the centre is.\n\n' +
        'For example, 49, 50, 51 and 10, 50, 90 both have mean 50. The second list\'s values are much further from the mean, so it has a larger standard deviation.',
      conclusion: 'A larger value means the data sits further from the mean, so it measures How spread out the values are around the mean.',
      whyWrong: [
        null,
        'This is an average such as the mean or the median, not a measure of spread.',
        'This is the **mode**.',
        'This is the **range**, which uses only the two extreme values.',
      ],
      keyIdea: 'Match the word to its job. Standard deviation: typical distance from the mean. Range: largest minus smallest. Mean or median: the centre. Mode: the most common value.',
    },
  },];
