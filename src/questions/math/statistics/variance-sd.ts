import type { StaticQuestion } from '../../../types';
import { mean, sampleVariance, sd, sumOf, variance } from '../../../lib/mathx';

export const questions: StaticQuestion[] = [
  {
    id: 'variance-sd-001',
    subtopic: 'variance-sd',
    difficulty: 'foundation',
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
    difficulty: 'foundation',
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
        'The standard deviation is the square root of the variance:\n\n' +
        '$$\\sigma = \\sqrt{2.25} = 1.5$$\n\n' +
        'Check: $1.5^2 = 2.25$. Units: the variance is in squared units ($\\text{s}^2$); taking the square root brings the SD back to the units of the data, seconds. So $\\sigma = 1.5$ s.',
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
    stem: 'The daily maximum temperatures in a city over one month have mean $20$°C and standard deviation $5$°C. They are converted to Fahrenheit using $F = 1.8C + 32$. What is the standard deviation of the temperatures in °F?',
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
    stem: 'A random **sample** of $5$ students is asked how many books they read last year: $2, 5, 8, 9, 11$. To estimate the variance for **all** students, the sample variance $s^2$ is used, which divides by $n - 1$. What is $s^2$?\n\nGive non-integer answers to 2 decimal places.',
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
    id: 'variance-sd-011',
    subtopic: 'variance-sd',
    difficulty: 'challenge',
    stem: 'A data set of $9$ values has mean $10$ and population variance $4$. A tenth value, equal to $10$, is added. What is the population variance of the $10$ values?\n\nGive non-integer answers to 2 decimal places.',
    options: ['$4$', '$13.60$', '$4.44$', '$3.60$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1: the mean does not change.** The old total is $9 \\times 10 = 90$; the new total is $90 + 10 = 100$, so the new mean is $\\frac{100}{10} = 10$.\n\n' +
        '**Step 2: recover the sum of squared deviations.** Variance $= \\frac{\\sum (x - \\bar{x})^2}{n}$, so for the original data $\\sum (x - \\bar{x})^2 = 9 \\times 4 = 36$.\n\n' +
        '**Step 3: add the new value.** Its deviation is $10 - 10 = 0$, so it adds $0^2 = 0$. The sum of squared deviations is still $36$.\n\n' +
        '**Step 4: divide by the new $n$.** $\\sigma^2 = \\frac{36}{10} = 3.6$.\n\n' +
        'The variance goes **down**: a value sitting exactly at the mean adds no spread, but it increases $n$.',
      whyWrong: [
        'This assumes adding a value at the mean changes nothing. The sum of squared deviations stays $36$, but it is now shared between $10$ values, so the variance falls.',
        'This adds $10^2 = 100$ (the square of the **value**) instead of the square of its **deviation** from the mean, $0^2 = 0$: $\\frac{36 + 100}{10} = 13.6$.',
        'This scales the variance the wrong way: $4 \\times \\frac{10}{9} \\approx 4.44$. The same total $36$ is divided by a **bigger** $n$, so the variance must decrease, to $4 \\times \\frac{9}{10}$.',
        null,
      ],
      keyIdea: 'Work with the sum of squared deviations ($n \\times$ variance): add the new value\'s squared deviation, then divide by the new $n$.',
    },
    check: {
      optionValues: [4, 13.6, 40 / 9, 3.6],
      compute: () => {
        const nine = [7, 7, 10, 10, 10, 10, 10, 13, 13]; // mean 10, variance 4
        if (mean(nine) !== 10 || variance(nine) !== 4) throw new Error('bad example data');
        return variance([...nine, 10]);
      },
    },
  },
  {
    id: 'variance-sd-012',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    stem: 'What does this program print? (Both numbers are printed on one line, separated by a space.)',
    code: {
      lang: 'python',
      source:
        'data = [3, 5, 7, 9]\n' +
        'm = sum(data) / len(data)\n' +
        'ss = sum((x - m) ** 2 for x in data)\n' +
        'print(ss / len(data), ss / (len(data) - 1))',
    },
    options: ['`6.666666666666667 5.0`', '`5.0 6.666666666666667`', '`2.23606797749979 2.581988897471611`', '`5 6.666666666666667`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Trace the program line by line.\n\n' +
        '| Line | What happens | Value |\n' +
        '| --- | --- | --- |\n' +
        '| 1 | `data` is the list | `[3, 5, 7, 9]` |\n' +
        '| 2 | `m = 24 / 4` | `6.0` (a float, because `/` always gives a float) |\n' +
        '| 3 | squared deviations: $(3 - 6)^2, (5 - 6)^2, (7 - 6)^2, (9 - 6)^2$ | `9.0 + 1.0 + 1.0 + 9.0`, so `ss = 20.0` |\n' +
        '| 4 | `ss / len(data)` is `20.0 / 4` | `5.0` |\n' +
        '| 4 | `ss / (len(data) - 1)` is `20.0 / 3` | `6.666666666666667` |\n\n' +
        'The first number is the **population** variance (divide by $n = 4$), the second is the **sample** variance (divide by $n - 1 = 3$). `print` separates its arguments with a space, so the output is `5.0 6.666666666666667`.',
      whyWrong: [
        'This prints the two results in the wrong order. The first expression divides by `len(data)` (that is $4$), the population variance; the second divides by `len(data) - 1` (that is $3$), the sample variance.',
        null,
        'These are the square roots of the two results, i.e. the standard deviations. The code never takes a square root, so it prints variances.',
        'In Python 3, `/` always produces a float, and `m` is already `6.0`, so `ss` is `20.0` and the first result prints as `5.0`, not `5`.',
      ],
      keyIdea: 'Dividing the sum of squared deviations by $n$ gives the population variance; dividing by $n - 1$ gives the (larger) sample variance.',
    },
    python: { stdout: '5.0 6.666666666666667' },
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
      'Stall B has the higher mean, because its best day is the highest.',
      'Both stalls have the same mean and the same standard deviation, because their totals are equal.',
      'Both stalls have the same mean, and Stall B\'s standard deviation is $5$ times Stall A\'s.',
      'Both stalls have the same mean, and Stall B\'s standard deviation is $25$ times Stall A\'s.',
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
    difficulty: 'challenge',
    stem: 'A data set has mean $10$ and standard deviation $2$. Every value $x$ is transformed to $y = ax + b$, where $a > 0$. The new data set has mean $23$ and standard deviation $5$. What is the value of $b$?',
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
    id: 'variance-sd-016',
    subtopic: 'variance-sd',
    difficulty: 'challenge',
    stem: 'Group P has $5$ values with mean $8$ and population variance $6$. Group Q has $5$ values with mean $12$ and population variance $10$. The two groups are combined into one data set of $10$ values. What is the population variance of the combined data?\n\nGive non-integer answers to 2 decimal places.',
    options: ['$8$', '$12$', '$16$', '$13.33$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: combined mean.** $\\bar{x} = \\frac{5 \\times 8 + 5 \\times 12}{10} = \\frac{100}{10} = 10$.\n\n' +
        '**Step 2: recover** $\\sum x^2$ **for each group**, using $\\sum x^2 = n(\\sigma^2 + \\bar{x}^2)$:\n\n' +
        '- P: $5(6 + 8^2) = 5 \\times 70 = 350$\n' +
        '- Q: $5(10 + 12^2) = 5 \\times 154 = 770$\n\n' +
        'Combined: $\\sum x^2 = 350 + 770 = 1120$.\n\n' +
        '**Step 3: combined variance.** $\\sigma^2 = \\frac{1120}{10} - 10^2 = 112 - 100 = 12$.\n\n' +
        'Why is this bigger than the average variance $8$? The groups are centred in different places ($8$ and $12$, each $2$ away from the overall mean $10$), which adds $2^2 = 4$ of extra spread: $8 + 4 = 12$.',
      whyWrong: [
        'This averages the two variances, $\\frac{6 + 10}{2} = 8$. That only measures the spread **within** each group and ignores that the groups have different means, which adds extra spread.',
        null,
        'This adds the two variances, $6 + 10 = 16$. Variances of separate groups are not simply added when the data are merged; go back to $\\sum x^2$ for each group.',
        'This divides by $n - 1 = 9$: $\\frac{1120 - 10 \\times 10^2}{9} = \\frac{120}{9} \\approx 13.33$, the sample variance. The question asks for the population variance.',
      ],
      keyIdea: 'To combine groups, rebuild each group\'s $\\sum x$ and $\\sum x^2$, add them, then use $\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar{x}^2$ on the whole data set.',
    },
    check: {
      optionValues: [8, 12, 16, 120 / 9],
      compute: () => {
        const p = [4, 7, 8, 10, 11]; // mean 8, variance 6
        const q = [8, 9, 12, 15, 16]; // mean 12, variance 10
        if (mean(p) !== 8 || variance(p) !== 6 || mean(q) !== 12 || variance(q) !== 10) throw new Error('bad example data');
        return variance([...p, ...q]);
      },
    },
  },
  {
    id: 'variance-sd-017',
    subtopic: 'variance-sd',
    difficulty: 'challenge',
    stem: 'Three numbers $a$, $6$ and $b$, with $a < b$, have mean $6$ and population variance $6$. What is the value of $b$?\n\nGive non-integer answers to 2 decimal places.',
    options: ['$9$', '$7.73$', '$8.45$', '$10.24$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: use the mean.** $\\frac{a + 6 + b}{3} = 6$, so $a + 6 + b = 18$ and $a + b = 12$. So $a$ and $b$ sit the same distance $d$ either side of $6$: $a = 6 - d$ and $b = 6 + d$, with $d > 0$.\n\n' +
        '**Step 2: use the variance.** The deviations from the mean are $-d$, $0$ and $d$. The middle one contributes nothing, so\n\n' +
        '$$\\sigma^2 = \\frac{d^2 + d^2}{3} = \\frac{2d^2}{3}$$\n\n' +
        '**Step 3: solve.** $\\frac{2d^2}{3} = 6$, so $2d^2 = 18$, $d^2 = 9$ and $d = 3$.\n\n' +
        'So $a = 3$ and $b = 9$. Check: $3, 6, 9$ has mean $6$ and variance $\\frac{9 + 9}{3} = 6$ (the $6$ itself has deviation $0$).',
      whyWrong: [
        null,
        'This sets the **sum** of squared deviations equal to $6$ ($2d^2 = 6$, so $d = \\sqrt{3} \\approx 1.73$), forgetting that the variance is that sum divided by $n = 3$.',
        'This divides by $n - 1 = 2$ (sample variance): $\\frac{2d^2}{2} = 6$ gives $d = \\sqrt{6} \\approx 2.45$. The question says population variance, so divide by $3$.',
        'This forgets that **both** $a$ and $b$ deviate from the mean: $\\frac{d^2}{3} = 6$ gives $d = \\sqrt{18} \\approx 4.24$. The deviations $-d$ and $d$ each contribute $d^2$.',
      ],
      keyIdea: 'Turn the mean and variance into equations: the mean fixes $a + b$, and the variance fixes the sum of squared deviations ($n \\times \\sigma^2$).',
    },
    check: {
      optionValues: [9, 6 + Math.sqrt(3), 6 + Math.sqrt(6), 6 + Math.sqrt(18)],
      compute: () => {
        // Search b > 6 (with a = 12 - b from the mean) for population variance 6.
        let best = 6;
        let bestErr = Infinity;
        for (let k = 6001; k <= 20000; k++) {
          const b = k / 1000;
          const err = Math.abs(variance([12 - b, 6, b]) - 6);
          if (err < bestErr) {
            bestErr = err;
            best = b;
          }
        }
        return best;
      },
    },
  },
  {
    id: 'variance-sd-018',
    subtopic: 'variance-sd',
    difficulty: 'challenge',
    stem: 'For a data set of $20$ values, $\\sum (x - 10) = 20$ and $\\sum (x - 10)^2 = 240$. What is the **population** standard deviation of $x$?\n\nGive your answer to 2 decimal places.',
    options: ['$3.46$', '$11$', '$3.32$', '$3.40$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work with the coded values $y = x - 10$. Subtracting $10$ from every value does not change the spread, so $\\sigma_x = \\sigma_y$.\n\n' +
        '1. Mean of $y$: $\\bar{y} = \\frac{\\sum y}{n} = \\frac{20}{20} = 1$.\n' +
        '2. Variance of $y$ (computational formula): $\\sigma_y^2 = \\frac{\\sum y^2}{n} - \\bar{y}^2 = \\frac{240}{20} - 1^2 = 12 - 1 = 11$.\n' +
        '3. Standard deviation: $\\sigma_x = \\sigma_y = \\sqrt{11} \\approx 3.32$ (2 d.p.).\n\n' +
        '(The mean of $x$ is $\\bar{y} + 10 = 11$, but it is not needed for the SD.)',
      whyWrong: [
        'This is $\\sqrt{\\frac{240}{20}} = \\sqrt{12} \\approx 3.46$, forgetting to subtract $\\bar{y}^2$. The sum $\\sum (x - 10)^2$ measures spread around $10$, not around the actual mean $11$.',
        'This is the **variance**, $11$. The standard deviation is its square root.',
        null,
        'This divides by $n - 1 = 19$: $\\sqrt{\\frac{240 - 20 \\times 1^2}{19}} = \\sqrt{\\frac{220}{19}} \\approx 3.40$, the sample SD. The question asks for the population SD.',
      ],
      keyIdea: 'Coding $y = x - c$ leaves the SD unchanged, so find the SD of the coded data with $\\sigma^2 = \\frac{\\sum y^2}{n} - \\bar{y}^2$.',
    },
    check: {
      optionValues: [Math.sqrt(12), 11, Math.sqrt(11), Math.sqrt(220 / 19)],
      compute: () => {
        const n = 20;
        const sumY = 20;
        const sumY2 = 240;
        const yBar = sumY / n;
        return Math.sqrt(sumY2 / n - yBar * yBar);
      },
    },
  },
];
