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
      solution:
        '**Step 1: mean.** $\\bar{x} = \\frac{2 + 4 + 4 + 4 + 5 + 5 + 7 + 9}{8} = \\frac{40}{8} = 5$.\n\n' +
        '**Step 2: deviations from the mean, then square them.**\n\n' +
        '| $x$ | $x - \\bar{x}$ | $(x - \\bar{x})^2$ |\n' +
        '| --- | --- | --- |\n' +
        '| $2$ | $-3$ | $9$ |\n' +
        '| $4$ | $-1$ | $1$ |\n' +
        '| $4$ | $-1$ | $1$ |\n' +
        '| $4$ | $-1$ | $1$ |\n' +
        '| $5$ | $0$ | $0$ |\n' +
        '| $5$ | $0$ | $0$ |\n' +
        '| $7$ | $2$ | $4$ |\n' +
        '| $9$ | $4$ | $16$ |\n\n' +
        'Sum of the last column: $9 + 1 + 1 + 1 + 4 + 16 = 32$.\n\n' +
        '**Step 3: variance** (divide by $n = 8$): $\\sigma^2 = \\frac{32}{8} = 4$.\n\n' +
        '**Step 4: standard deviation** (square root): $\\sigma = \\sqrt{4} = 2$.',
      whyWrong: [
        'This is the **mean absolute deviation**: the average of the distances $3, 1, 1, 1, 0, 0, 2, 4$ without squaring them ($\\frac{12}{8} = 1.5$). The standard deviation squares the deviations first.',
        null,
        'This is the **variance** ($\\frac{32}{8} = 4$). You forgot the last step: the standard deviation is the square root of the variance.',
        'This divides by $n - 1 = 7$ instead of $n = 8$ ($\\sqrt{\\frac{32}{7}} \\approx 2.14$), which is the **sample** standard deviation, not the population one.',
      ],
      keyIdea: 'Standard deviation is the square root of the mean of the squared deviations from the mean.',
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
      solution:
        '**Step 1: mean.** $\\bar{x} = \\frac{1 + 3 + 5 + 7 + 9}{5} = \\frac{25}{5} = 5$.\n\n' +
        '**Step 2: deviations** $x - \\bar{x}$: $-4, -2, 0, 2, 4$ (they add to $0$, as deviations always do).\n\n' +
        '**Step 3: square them:** $16, 4, 0, 4, 16$. Their sum is $16 + 4 + 4 + 16 = 40$.\n\n' +
        '**Step 4: variance** = mean of the squared deviations: $\\sigma^2 = \\frac{40}{5} = 8$.',
      whyWrong: [
        'This is the **sum** of the squared deviations, $40$. The variance is their **mean**, so you still need to divide by $n = 5$.',
        'This divides by $n - 1 = 4$, which gives the sample variance. For the population variance divide by $n = 5$.',
        null,
        'This is the **standard deviation**, $\\sqrt{8} = 2\\sqrt{2}$. The question asks for the variance, which is not square-rooted.',
      ],
      keyIdea: 'Variance is the mean of the squared deviations: square each distance from the mean, add them, divide by $n$.',
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
      solution:
        'Adding $5$ to every value slides the whole data set $5$ units up the number line.\n\n' +
        '- The centre moves with it: new mean $= 12 + 5 = 17$.\n' +
        '- Every value moves by the same amount, so every **deviation from the mean** $x - \\bar{x}$ stays exactly the same. The spread does not change: new SD $= 3$.\n\n' +
        'Example: the values $9$ and $15$ (mean $12$, SD $3$) become $14$ and $20$. The mean is now $17$ and each value is still $3$ from the mean, so the SD is still $3$.',
      whyWrong: [
        'This adds $5$ to the standard deviation too. Adding a constant shifts the values but does not spread them out, so the SD stays $3$.',
        'This leaves the mean unchanged as well. The spread is unchanged, but the centre of the data moves up by $5$.',
        'This **multiplies** everything by $5$ instead of adding $5$. Multiplying would scale both the mean and the SD; adding only shifts the mean.',
        null,
      ],
      keyIdea: 'Adding a constant to every value shifts the mean by that constant but leaves the SD and variance unchanged.',
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
      solution:
        'The standard deviation is the square root of the variance: $\\sigma = \\sqrt{\\sigma^2}$.\n\n' +
        'So $\\sigma = \\sqrt{2.25} = 1.5$. Check: $1.5^2 = 2.25$.\n\n' +
        'Units: the variance is in squared units ($\\text{s}^2$); taking the square root brings the SD back to the units of the data, seconds. So $\\sigma = 1.5$ s.',
      whyWrong: [
        'This **squares** the variance ($2.25^2 = 5.0625$). To go from variance to SD you take the square root, not the square.',
        'This halves the variance. Taking a square root is not the same as dividing by $2$: check $1.125^2 \\approx 1.27$, not $2.25$.',
        null,
        'This treats the variance as if it were the standard deviation. They are only equal when both are $0$ or both are $1$.',
      ],
      keyIdea: 'SD $= \\sqrt{\\text{variance}}$ and variance $= \\text{SD}^2$.',
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
      solution:
        'The variance is the mean of the squared deviations, $\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}$, and the standard deviation is its square root, $\\sigma = \\sqrt{\\sigma^2}$. So the second statement is true. Checking the others:\n\n' +
        '- Squares are never negative, so the variance is $\\ge 0$ and its square root is $\\ge 0$ too. An SD is never negative.\n' +
        '- The variance is in squared units; the square root puts the SD back in the **same units as the data** (cm, not $\\text{cm}^2$).\n' +
        '- Adding a constant shifts every value equally, so the deviations, and hence the SD, do not change.',
      whyWrong: [
        'The SD is built from **squared** deviations, which are never negative, so it is always $\\ge 0$. Values below the mean have negative deviations, but squaring removes the sign.',
        null,
        'That describes the **variance**. Taking the square root returns the SD to the original units (cm).',
        'Adding the same number to every value shifts the data without spreading it out; the SD is unchanged.',
      ],
      keyIdea: 'The SD is the non-negative square root of the variance and is measured in the same units as the data.',
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
      solution:
        'Use the computational formula $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$ ("mean of the squares minus the square of the mean").\n\n' +
        '1. Mean: $\\bar{x} = \\frac{\\sum x}{n} = \\frac{50}{10} = 5$.\n' +
        '2. Mean of the squares: $\\frac{\\sum x^2}{n} = \\frac{290}{10} = 29$.\n' +
        '3. Variance: $\\sigma^2 = 29 - 5^2 = 29 - 25 = 4$.\n' +
        '4. Standard deviation: $\\sigma = \\sqrt{4} = 2$.',
      whyWrong: [
        null,
        'This is the **variance**, $4$. The standard deviation is its square root.',
        'This forgets to **square** the mean: $29 - 5 = 24$ and $\\sqrt{24} \\approx 4.90$. The formula subtracts $\\bar{x}^2 = 25$.',
        'This is the **sample** SD: $\\sqrt{\\frac{290 - 10 \\times 5^2}{9}} = \\sqrt{\\frac{40}{9}} \\approx 2.11$. The question asks for the population SD, which divides by $n$.',
      ],
      keyIdea: 'Variance = (mean of the squares) minus (square of the mean): $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$.',
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
      solution:
        'The conversion multiplies every value by $1.8$ and then adds $32$.\n\n' +
        '- Multiplying by $1.8$ stretches every distance from the mean by $1.8$, so the SD is multiplied by $1.8$: $1.8 \\times 5 = 9$.\n' +
        '- Adding $32$ slides every value up by the same amount. That changes the mean but **not** the spread.\n\n' +
        'So the SD is $9$ °F. (For comparison, the mean becomes $1.8 \\times 20 + 32 = 68$ °F, and the variance becomes $1.8^2 \\times 5^2 = 3.24 \\times 25 = 81$, which is $9^2$.)',
      whyWrong: [
        'This applies the whole formula to the SD: $1.8 \\times 5 + 32 = 41$. The $+32$ shifts every value equally, so it does not affect the spread.',
        'This multiplies by $1.8^2 = 3.24$, giving $3.24 \\times 5 = 16.2$. The square of the factor is used for the **variance**, not the SD.',
        'This assumes changing units does not affect the spread. The $+32$ does not, but multiplying by $1.8$ does: every gap between values becomes $1.8$ times bigger.',
        null,
      ],
      keyIdea: 'For $y = ax + b$, the SD is multiplied by $|a|$ and the $+b$ has no effect on spread.',
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
      solution:
        'If every value $x$ becomes $y = ax + b$, then $\\text{Var}(y) = a^2 \\, \\text{Var}(x)$: the multiplier is **squared** and the added constant disappears.\n\n' +
        'Here $a = 3$ and $b = -2$, so\n\n' +
        '$$\\text{Var}(y) = 3^2 \\times 16 = 9 \\times 16 = 144$$\n\n' +
        'Check with SDs: the old SD is $\\sqrt{16} = 4$, the new SD is $3 \\times 4 = 12$, and $12^2 = 144$.',
      whyWrong: [
        'This multiplies the variance by $3$ instead of $3^2 = 9$. The variance is in squared units, so the multiplier must be squared.',
        null,
        'This squares the multiplier correctly ($9 \\times 16 = 144$) but then also subtracts $2$. Subtracting a constant from every value does not change the spread.',
        'This applies the transformation to the variance itself ($3 \\times 16 - 2 = 46$): it forgets to square the $3$ and wrongly lets the $-2$ change the spread.',
      ],
      keyIdea: 'Multiplying every value by $a$ multiplies the variance by $a^2$; adding or subtracting a constant leaves it unchanged.',
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
      solution:
        '**Step 1: mean.** $\\bar{x} = \\frac{2 + 5 + 8 + 9 + 11}{5} = \\frac{35}{5} = 7$.\n\n' +
        '**Step 2: deviations** $x - \\bar{x}$: $-5, -2, 1, 2, 4$ (check: they add to $0$).\n\n' +
        '**Step 3: squared deviations:** $25, 4, 1, 4, 16$, with sum $25 + 4 + 1 + 4 + 16 = 50$.\n\n' +
        '**Step 4: divide by** $n - 1 = 4$: $s^2 = \\frac{50}{4} = 12.5$.',
      whyWrong: [
        'This divides by $n = 5$, which gives the population variance. When a sample is used to estimate the variance of a whole population, divide by $n - 1 = 4$.',
        'This is the sum of the squared deviations, $50$; you still need to divide by $n - 1 = 4$.',
        null,
        'This is the sample **standard deviation**, $\\sqrt{12.5} \\approx 3.54$. The question asks for the variance.',
      ],
      keyIdea: 'Sample variance divides the sum of squared deviations by $n - 1$; population variance divides by $n$.',
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
      solution:
        '**Step 1: number of students and mean.** $n = 1 + 2 + 4 + 2 + 1 = 10$ and $\\sum fx = 1 + 4 + 12 + 8 + 5 = 30$, so $\\bar{x} = \\frac{30}{10} = 3$.\n\n' +
        '**Step 2: squared deviations, each counted as often as it occurs.**\n\n' +
        '| $x$ | $f$ | $(x - 3)^2$ | $f(x - 3)^2$ |\n' +
        '| --- | --- | --- | --- |\n' +
        '| $1$ | $1$ | $4$ | $4$ |\n' +
        '| $2$ | $2$ | $1$ | $2$ |\n' +
        '| $3$ | $4$ | $0$ | $0$ |\n' +
        '| $4$ | $2$ | $1$ | $2$ |\n' +
        '| $5$ | $1$ | $4$ | $4$ |\n\n' +
        'Total: $\\sum f(x - \\bar{x})^2 = 4 + 2 + 2 + 4 = 12$.\n\n' +
        '**Step 3: variance.** Divide by the number of students: $\\sigma^2 = \\frac{12}{10} = 1.2$.\n\n' +
        'Check with the computational formula: $\\sum fx^2 = 1 + 8 + 36 + 32 + 25 = 102$, so $\\sigma^2 = \\frac{102}{10} - 3^2 = 10.2 - 9 = 1.2$.',
      whyWrong: [
        null,
        'This ignores the frequencies and finds the variance of $1, 2, 3, 4, 5$ with each score counted once. Each score must be counted as many times as it occurs.',
        'This weights by frequency correctly but divides $12$ by $5$ (the number of different scores) instead of $10$ (the number of students).',
        'This divides by $n - 1 = 9$, giving the sample variance $\\frac{12}{9} \\approx 1.33$. The question asks for the population variance.',
      ],
      keyIdea: 'In a frequency table, multiply each squared deviation by its frequency and divide by the total frequency $\\sum f$.',
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
      solution:
        '1. Mean: $\\bar{x} = \\frac{3 + 5 + 7 + 9}{4} = 6$.\n' +
        '2. Squared deviations: $9, 1, 1, 9$, with sum $20$.\n' +
        '3. Population variance: divide by $n = 4$, giving $\\frac{20}{4} = 5$.\n' +
        '4. Sample variance: divide by $n - 1 = 3$, giving $\\frac{20}{3} \\approx 6.67$.',
      whyWrong: [
        null,
        'This gives the two results in the wrong order. The population variance divides by $n$, so it is the smaller one.',
        'These are the square roots of the two results, which are the standard deviations. The question asks for variances.',
        'This is the sum of squared deviations, which is the same for both. You still have to divide it by $n$ and by $n - 1$.',
      ],
      keyIdea: 'Dividing the sum of squared deviations by $n$ gives the population variance; dividing by $n - 1$ gives the larger sample variance.',
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
      solution:
        'Rearrange the computational formula $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$:\n\n' +
        '$$\\frac{\\sum x^2}{n} = \\sigma^2 + \\bar{x}^2 = 4 + 6^2 = 40$$\n\n' +
        'Multiply by $n = 5$: $\\sum x^2 = 5 \\times 40 = 200$.\n\n' +
        'Check with an example: $3, 5, 6, 7, 9$ has mean $6$ and deviations $-3, -1, 0, 1, 3$, so its variance is $\\frac{9 + 1 + 1 + 9}{5} = \\frac{20}{5} = 4$ (the $6$ contributes $0$), and $3^2 + 5^2 + 6^2 + 7^2 + 9^2 = 9 + 25 + 36 + 49 + 81 = 200$.',
      whyWrong: [
        null,
        'This is $\\frac{\\sum x^2}{n} = 40$, the **mean** of the squares. Multiply by $n = 5$ to get the sum.',
        'This multiplies only the variance by $n$: $5 \\times 4 + 6^2 = 56$. Both terms must be multiplied by $n$: $5 \\times (4 + 36)$.',
        'This subtracts the variance instead of adding it: $5 \\times (36 - 4) = 160$. Since $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$, the mean of the squares is $\\sigma^2 + \\bar{x}^2$.',
      ],
      keyIdea: 'From the computational formula, $\\sum x^2 = n(\\sigma^2 + \\bar{x}^2)$.',
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
      solution:
        '**Means.** Stall A: $\\frac{20 + 22 + 18 + 21 + 19}{5} = \\frac{100}{5} = 20$. Stall B: $\\frac{30 + 10 + 25 + 15 + 20}{5} = \\frac{100}{5} = 20$. Same mean.\n\n' +
        '**Stall A.** Deviations from $20$: $0, 2, -2, 1, -1$. Squares: $0, 4, 4, 1, 1$, sum $10$. Variance $\\frac{10}{5} = 2$, SD $\\sqrt{2}$.\n\n' +
        '**Stall B.** Deviations from $20$: $10, -10, 5, -5, 0$. Squares: $100, 100, 25, 25, 0$, sum $250$. Variance $\\frac{250}{5} = 50$, SD $\\sqrt{50} = 5\\sqrt{2}$.\n\n' +
        '**Compare.** $\\frac{\\sqrt{50}}{\\sqrt{2}} = \\sqrt{25} = 5$, so Stall B\'s SD is $5$ times Stall A\'s: its sales are far less consistent.',
      whyWrong: [
        'Both totals are $100$ over $5$ days, so both means are $20$. One high day does not raise the mean when other days are low.',
        'Equal totals give equal means, but say nothing about spread: Stall B swings between $10$ and $30$, while Stall A stays between $18$ and $22$.',
        null,
        '$25$ is the ratio of the **variances** ($\\frac{50}{2} = 25$). Standard deviations are the square roots, so their ratio is $\\sqrt{25} = 5$.',
      ],
      keyIdea: 'Two data sets can share a mean but have very different spreads; compare spread with the SD, and remember the SD ratio is the square root of the variance ratio.',
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
      solution:
        'Use the two transformation rules: new SD $= |a| \\times$ old SD, and new mean $= a \\times$ old mean $+ b$.\n\n' +
        '1. SD (the $+b$ has no effect on spread): $5 = a \\times 2$, so $a = \\frac{5}{2} = 2.5$.\n' +
        '2. Mean: $23 = 2.5 \\times 10 + b = 25 + b$, so $b = 23 - 25 = -2$.\n\n' +
        'Check: $y = 2.5x - 2$ turns $8$ and $12$ (mean $10$, SD $2$) into $18$ and $28$, which have mean $23$ and SD $5$.',
      whyWrong: [
        'This treats the change as a pure shift, $b = 23 - 10 = 13$. But the SD also changed, which means the values were multiplied by $a = 2.5$ before $b$ was added.',
        'This finds $a$ by **subtracting** the SDs ($5 - 2 = 3$) instead of dividing. Multiplying by $a$ multiplies the SD, so $a = \\frac{5}{2}$; with $a = 3$ you get $b = 23 - 30 = -7$.',
        'This finds $a = 2.5$ correctly but then uses $b = 23 - a = 20.5$, forgetting that it is the **mean** $10$ that gets multiplied by $a$: $b = 23 - 2.5 \\times 10$.',
        null,
      ],
      keyIdea: 'Find the multiplier from the SDs (the shift does not affect spread), then find the shift from the means.',
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
      solution:
        'The mean is $7$, so every deviation from the mean is $0$. The squared deviations are all $0$, so the variance and the standard deviation are both $0$.',
      whyWrong: [
        null,
        'This is the mean. The standard deviation measures the distance from the mean, and here that distance is zero.',
        'A value of $1$ would need the data to differ from the mean. Here no value differs at all.',
        'This squares the mean. Identical values have no spread, whatever their size.',
      ],
      keyIdea: 'If all the values are equal, there is no spread, so the standard deviation is $0$.',
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
      solution:
        'The **sample** variance divides by $n - 1$. The **population** variance divides by $n$.\n\n' +
        'Using $n - 1$ corrects for sample values sitting closer to their own mean than to the true mean.',
      whyWrong: [
        null,
        'Dividing by $n$ gives the **population** variance.',
        'Neither variance divides by $n + 1$. The correction makes the divisor smaller, not larger.',
        'Neither variance divides by $n^2$. You may be thinking of the square of the mean in the computational formula.',
      ],
      keyIdea: 'Sample variance divides by $n - 1$; population variance divides by $n$.',
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
      solution:
        'Multiplying every value by $3$ makes every distance from the mean $3$ times as big. So the standard deviation is multiplied by $3$ too.',
      whyWrong: [
        null,
        'The **variance** is multiplied by $3^2 = 9$. The standard deviation is its square root, so it is multiplied by $3$.',
        'This is what happens when the same number is **added** to every value. Multiplying does stretch the data.',
        'The change is a multiplication, not an increase by a fixed amount. A larger spread grows by more.',
      ],
      keyIdea: 'Multiplying the data by $a$ multiplies the standard deviation by $|a|$ and the variance by $a^2$.',
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
      solution:
        'The standard deviation is roughly the typical distance of a value from the mean. A small value means the data sit close to the mean; a large value means they are widely spread.',
      whyWrong: [
        null,
        'This is an average such as the mean or the median, not a measure of spread.',
        'This is the **mode**.',
        'This is the **range**, which uses only the two extreme values.',
      ],
      keyIdea: 'The standard deviation measures spread around the mean.',
    },
  },];
