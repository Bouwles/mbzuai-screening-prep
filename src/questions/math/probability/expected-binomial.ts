import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { nCr, sumOf } from '../../../lib/mathx';

/** Binomial probability P(X = r) for X ~ B(n, p). */
const pmf = (n: number, r: number, p: number): number => nCr(n, r) * p ** r * (1 - p) ** (n - r);
/** E(X) from value and probability lists. */
const ev = (xs: number[], ps: number[]): number => sumOf(xs.map((x, i) => x * ps[i]));

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'expected-binomial-001',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'The discrete random variable $X$ has the probability distribution shown in the table, where $k$ is a constant. Find the value of $k$.',
    table: {
      headers: ['$x$', '$1$', '$2$', '$3$', '$4$'],
      rows: [['$P(X = x)$', '$0.1$', '$2k$', '$k$', '$0.3$']],
    },
    options: ['$0.6$', '$0.3$', '$0.2$', '$\\frac{1}{3}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What value of $k$ makes the probabilities in the table add up correctly?',
      solution:
        'The table lists every possible value of $X$, and one of them must happen. So all the probabilities must add up to 1.\n\n' +
        'Write that as an equation: $0.1 + 2k + k + 0.3 = 1$.\n\n' +
        'Collect like terms: $0.1 + 0.3 = 0.4$ and $2k + k = 3k$. So $0.4 + 3k = 1$.\n\n' +
        'Take $0.4$ from both sides to get $3k$ alone: $3k = 0.6$.\n\n' +
        'Divide both sides by 3 to get $k$ alone: $k = 0.6 \\div 3 = 0.2$.',
      conclusion: 'With $k = 0.2$, the probabilities are $0.1$, $0.4$, $0.2$ and $0.3$, which add up to 1, so the answer is $0.2$.',
      whyWrong: [
        'This is the value of $3k$. You set up $3k = 0.6$ correctly but stopped before dividing by $3$.',
        'This comes from counting $2k + k$ as only $2k$, i.e. solving $2k = 0.6$.',
        null,
        'This ignores the two known probabilities and solves $3k = 1$. The $0.1$ and $0.3$ must be taken away from $1$ first.',
      ],
      keyIdea: 'If a probability table has an unknown, add every probability, set the total equal to 1, and solve. Then confirm that no probability comes out negative.',
    },
    check: {
      optionValues: [0.6, 0.3, 0.2, 1 / 3],
      compute: () => {
        const known = 0.1 + 0.3;
        const kCoefficients = 2 + 1;
        return (1 - known) / kCoefficients;
      },
    },
  },
  {
    id: 'expected-binomial-002',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'The number of goals $X$ scored by a team in a match has the probability distribution shown. Find the expected value $E(X)$.',
    table: {
      headers: ['$x$', '$0$', '$1$', '$2$', '$3$'],
      rows: [['$P(X = x)$', '$0.2$', '$0.4$', '$0.3$', '$0.1$']],
    },
    options: ['$1.5$', '$1.3$', '$2.5$', '$0.325$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What is the long-run average number of goals per match?',
      solution:
        'The **expected value** $E(X)$ is the average you would get over many matches. More likely values count for more, so each value is weighted by its probability.\n\n' +
        'The formula is $E(X) = \\sum x \\, P(X = x)$, where $\\sum$ means add up. So multiply each $x$ by its probability:\n\n| $x$ | $P(X = x)$ | $x \\times P(X = x)$ |\n|---|---|---|\n| 0 | $0.2$ | $0$ |\n| 1 | $0.4$ | $0.4$ |\n| 2 | $0.3$ | $0.6$ |\n| 3 | $0.1$ | $0.3$ |\n\n' +
        'Add the last column: $0 + 0.4 + 0.6 + 0.3 = 1.3$.',
      conclusion: 'Each number of goals, weighted by how likely it is, adds up to the answer, $1.3$.',
      whyWrong: [
        'This is the plain average of the values $0, 1, 2, 3$. It ignores the probabilities, so it treats every value as equally likely.',
        null,
        'This is $E(X^2) = \\sum x^2 \\, P(X = x) = 0 + 0.4 + 1.2 + 0.9 = 2.5$. The values were squared by mistake.',
        'This divides the correct total $1.3$ by $4$. The probabilities already do the averaging, so there is nothing to divide by.',
      ],
      keyIdea: 'For $E(X)$ from a table, multiply each value by its probability and add. Don\'t divide at the end, because the probabilities have already done the averaging.',
    },
    check: {
      optionValues: [1.5, 1.3, 2.5, 0.325],
      compute: () => ev([0, 1, 2, 3], [0.2, 0.4, 0.3, 0.1]),
    },
  },
  {
    id: 'expected-binomial-003',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'Which of the following random variables can be modelled by a **binomial distribution**?',
    options: [
      'Number of aces in 5 cards dealt without replacement',
      'Number of rolls of a die until the first six',
      'Total score on three fair dice',
      'Number of heads in 10 tosses of a fair coin',
    ],
    correctIndex: 3,
    markScheme: {
      asking: 'Which of these counts successes out of a fixed number of identical, independent tries?',
      solution:
        'A **binomial** model counts successes. It needs a fixed number of trials, only two results per trial (success or failure), the same chance of success each time, and trials that don\'t affect each other.\n\n' +
        'Test each situation. Only one passes every test:\n\n| Situation | Fixed number of trials? | Two results? | Same chance each time? |\n|---|---|---|---|\n| Aces in 5 cards, no replacement | Yes | Yes | No, the deck changes |\n| Rolls until the first six | No | Yes | Yes |\n| Total score on three dice | Yes | No, scores 1 to 6 | Yes |\n| Heads in 10 tosses | Yes | Yes | Yes |',
      conclusion: 'Only the coin passes all the tests, so the answer is Number of heads in 10 tosses of a fair coin.',
      whyWrong: [
        'Dealing without replacement makes the cards dependent: the chance of an ace changes after each card (from $\\frac{4}{52}$ to $\\frac{3}{51}$ or $\\frac{4}{51}$), so $p$ is not constant.',
        'There is no fixed number of trials here: you keep rolling until a six appears. Counting trials "until the first success" is a different (geometric) model.',
        'This adds up scores from 1 to 6; it does not count successes. Each roll has six outcomes, not just success or failure.',
        null,
      ],
      keyIdea: 'Check **BINS**: **B**inary results (success or failure), **I**ndependent trials, a fixed **N**umber of trials, and the **S**ame probability each time. If any one fails, it isn\'t binomial.',
    },
  },
  {
    id: 'expected-binomial-004',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'The random variable $X$ follows a binomial distribution, $X \\sim \\text{B}(10, 0.3)$. What is the mean $E(X)$?',
    options: ['$2.1$', '$0.3$', '$7$', '$3$'],
    correctIndex: 3,
    markScheme: {
      asking: 'On average, how many successes does $\\text{B}(10, 0.3)$ give?',
      solution:
        '$X \\sim \\text{B}(10, 0.3)$ means $X$ counts successes in $n = 10$ trials, where each trial succeeds with probability $p = 0.3$.\n\n' +
        'If each trial succeeds $0.3$ of the time, then 10 trials give $10 \\times 0.3$ successes on average. That is the rule for the mean: $E(X) = np$.\n\n' +
        'Work it out: $E(X) = 10 \\times 0.3 = 3$.',
      conclusion: '10 trials at a success chance of $0.3$ give the answer, $3$, on average.',
      whyWrong: [
        'This is the **variance** $np(1-p) = 10 \\times 0.3 \\times 0.7 = 2.1$, not the mean.',
        'This is just $p$, the probability of success on **one** trial. The mean counts expected successes over all 10 trials.',
        'This is $n(1-p) = 10 \\times 0.7 = 7$, the expected number of **failures**.',
        null,
      ],
      keyIdea: 'In $\\text{B}(n, p)$, the first number is $n$ and the second is $p$. Mean $= np$, variance (a measure of spread) $= np(1-p)$, and standard deviation is the square root of the variance.',
    },
    check: {
      optionValues: [2.1, 0.3, 7, 3],
      compute: () => sumOf(Array.from({ length: 11 }, (_, r) => r * pmf(10, r, 0.3))),
    },
  },
  {
    id: 'expected-binomial-005',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'A game costs AED 4. A fair die is rolled once: a six wins a prize of AED $x$, and anything else wins nothing. For what value of $x$ is the game **fair** (expected gain zero)?',
    options: ['AED 20', 'AED 24', 'AED 28', 'AED 4'],
    correctIndex: 1,
    markScheme: {
      asking: 'What prize makes the game break even on average?',
      solution:
        '**Fair** means the expected gain is zero: on average, what you get back equals what you pay.\n\n' +
        'The prize comes only with a six, which has chance $\\frac{1}{6}$. Anything else pays nothing. So the expected prize is $\\frac{1}{6} \\times x = \\frac{x}{6}$.\n\n' +
        'You pay AED 4 every time. For a fair game, the expected prize must equal the cost: $\\frac{x}{6} = 4$.\n\n' +
        'Multiply both sides by 6 to get $x$ alone: $x = 4 \\times 6 = 24$.',
      conclusion: 'That prize gives an expected prize of $\\frac{24}{6} = 4$, matching the cost, so the answer is AED 24.',
      whyWrong: [
        'This treats the prize as pure profit, solving $\\frac{1}{6}x = \\frac{5}{6} \\times 4$. But the AED 4 is paid even when you win, so the net gain on a win is $x - 4$, not $x$.',
        null,
        'This finds 24 and then adds the AED 4 stake on top, as if the stake had to be handed back on a win. With a prize of AED 28 the expected gain is $\\frac{28}{6} - 4 = \\frac{2}{3}$, not 0: only the expected **prize** has to equal the cost.',
        'Setting the prize equal to the cost ignores that you only win 1 time in 6. The expected gain would be $\\frac{4}{6} - 4 < 0$.',
      ],
      keyIdea: 'For a fair game, set the expected prize equal to the cost to play, and solve. The expected prize is the sum of (prize $\\times$ its probability). The cost is paid on every play, win or lose.',
    },
    check: {
      optionValues: [20, 24, 28, 4],
      compute: () => {
        const cost = 4;
        const pWin = new Frac(1, 6);
        // expected gain = x * pWin - cost = 0
        return new Frac(cost).div(pWin).value();
      },
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'expected-binomial-006',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'The random variable $X$ has the probability distribution below, where $k$ is a constant. Find $E(X)$.',
    table: {
      headers: ['$x$', '$1$', '$2$', '$3$', '$4$'],
      rows: [['$P(X = x)$', '$k$', '$2k$', '$3k$', '$4k$']],
    },
    options: ['$30$', '$10$', '$3$', '$2.5$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the expected value of $X$, once we have found $k$?',
      solution:
        'We need $k$ first. All the probabilities must add up to 1: $k + 2k + 3k + 4k = 1$.\n\n' +
        'Add the terms: $10k = 1$. Divide both sides by 10 to get $k = 0.1$.\n\n' +
        'Put that in, so the probabilities are $0.1$, $0.2$, $0.3$ and $0.4$. The **expected value** $E(X)$ is each value times its probability, all added:\n\n| $x$ | $P(X = x)$ | $x \\times P(X = x)$ |\n|---|---|---|\n| 1 | $0.1$ | $0.1$ |\n| 2 | $0.2$ | $0.4$ |\n| 3 | $0.3$ | $0.9$ |\n| 4 | $0.4$ | $1.6$ |\n\n' +
        'Add the last column: $0.1 + 0.4 + 0.9 + 1.6 = 3$.',
      conclusion: 'With $k = 0.1$, the weighted values add up to the answer, $3$.',
      whyWrong: [
        'This uses $k = 1$ instead of solving for $k$: $1 + 4 + 9 + 16 = 30$. An expected value of 30 is impossible when $X$ is at most 4.',
        'This is $E(X^2) = 1(0.1) + 4(0.2) + 9(0.3) + 16(0.4) = 10$. The values were squared.',
        null,
        'This is the plain average of $1, 2, 3, 4$. It ignores that larger values are more likely here.',
      ],
      keyIdea: 'First use "the probabilities add up to 1" to find $k$. Then multiply each value by its probability and add to get $E(X)$. A useful test: $E(X)$ must lie between the smallest and largest values of $X$.',
    },
    check: {
      optionValues: [30, 10, 3, 2.5],
      compute: () => {
        const xs = [1, 2, 3, 4];
        const k = 1 / sumOf(xs); // weights k, 2k, 3k, 4k
        return ev(xs, xs.map((x) => x * k));
      },
    },
  },
  {
    id: 'expected-binomial-007',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'The random variable $X$ has the probability distribution shown. Find the variance $\\text{Var}(X)$.',
    table: {
      headers: ['$x$', '$1$', '$2$', '$3$'],
      rows: [['$P(X = x)$', '$0.2$', '$0.5$', '$0.3$']],
    },
    options: ['$4.9$', '$0.7$', '$2.8$', '$0.49$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How spread out is $X$ around its mean?',
      solution:
        '**Variance** measures how far values tend to fall from the mean. The formula is $\\text{Var}(X) = E(X^2) - [E(X)]^2$, which is the average of the squares minus the square of the average.\n\n' +
        'Find the mean $E(X)$ by multiplying each value by its probability and adding: $E(X) = 1(0.2) + 2(0.5) + 3(0.3) = 0.2 + 1 + 0.9 = 2.1$.\n\n' +
        'Find $E(X^2)$ the same way, but square each value first: $E(X^2) = 1(0.2) + 4(0.5) + 9(0.3) = 0.2 + 2 + 2.7 = 4.9$.\n\n' +
        'Square the mean: $[E(X)]^2 = 2.1 \\times 2.1 = 4.41$.\n\n' +
        'Subtract: $\\text{Var}(X) = 4.9 - 4.41 = 0.49$.',
      conclusion: 'The average of the squares minus the square of the average gives the answer, $0.49$.',
      whyWrong: [
        'This is $E(X^2)$ only. You must still subtract $[E(X)]^2 = 4.41$.',
        'This is the **standard deviation** $\\sqrt{0.49} = 0.7$. The question asks for the variance, which is not square-rooted.',
        'This subtracts $E(X)$ instead of $[E(X)]^2$: $4.9 - 2.1 = 2.8$. The mean must be squared.',
        null,
      ],
      keyIdea: 'Make a table with columns $x$, $P$, $xP$ and $x^2P$. The last two totals give $E(X)$ and $E(X^2)$, and $\\text{Var}(X) = E(X^2) - [E(X)]^2$. A variance is never negative.',
    },
    check: {
      optionValues: [4.9, 0.7, 2.8, 0.49],
      compute: () => {
        const xs = [1, 2, 3];
        const ps = [0.2, 0.5, 0.3];
        const mu = ev(xs, ps);
        return sumOf(xs.map((x, i) => (x - mu) ** 2 * ps[i]));
      },
    },
  },
  {
    id: 'expected-binomial-008',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'Given $X \\sim \\text{B}(5, 0.2)$, find $P(X = 2)$.',
    options: ['$0.2048$', '$0.02048$', '$0.4096$', '$0.4$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How likely are exactly 2 successes in 5 tries, with a success chance of $0.2$ each time?',
      solution:
        '$X \\sim \\text{B}(5, 0.2)$ means $X$ counts successes in 5 independent trials, each with success chance $0.2$. So each failure has chance $1 - 0.2 = 0.8$.\n\n' +
        'Exactly 2 successes means 3 failures. One particular order, such as success, success, fail, fail, fail, has probability $0.2 \\times 0.2 \\times 0.8 \\times 0.8 \\times 0.8$.\n\n' +
        'Work that out: $0.2 \\times 0.2 = 0.04$ and $0.8 \\times 0.8 \\times 0.8 = 0.512$. So one order has probability $0.04 \\times 0.512 = 0.02048$.\n\n' +
        'The 2 successes can fall in different places. The number of orders is the number of ways to pick 2 places from 5: $\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10$.\n\n' +
        'Each order has the same probability, so multiply: $10 \\times 0.02048 = 0.2048$.',
      conclusion: '10 orders, each with probability $0.02048$, give the answer, $0.2048$.',
      whyWrong: [
        null,
        'This is $0.2^2 \\times 0.8^3$ only: the probability of **one particular order** (such as SSFFF). It forgets the $\\binom{5}{2} = 10$ different orders.',
        'This counts ordered arrangements $5 \\times 4 = 20$ instead of $\\binom{5}{2} = 10$. The two successes are identical, so divide by $2!$.',
        'This is $10 \\times 0.2^2$ and leaves out the factor $0.8^3$ for the three failures.',
      ],
      keyIdea: 'Use $P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}$. That is: count the orders, times the chance of $r$ successes, times the chance of the $n - r$ failures.',
    },
    check: {
      optionValues: [0.2048, 0.02048, 0.4096, 0.4],
      compute: () => {
        // brute force over all 2^5 success/failure strings
        let total = 0;
        for (let mask = 0; mask < 32; mask++) {
          let s = 0;
          let pr = 1;
          for (let t = 0; t < 5; t++) {
            if ((mask >> t) & 1) {
              s++;
              pr *= 0.2;
            } else pr *= 0.8;
          }
          if (s === 2) total += pr;
        }
        return total;
      },
    },
  },
  {
    id: 'expected-binomial-009',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'A basketball player scores each free throw with probability $0.4$, independently of the others. She takes 3 free throws. What is the probability that she scores **at least one**?',
    options: ['$0.216$', '$0.784$', '$0.064$', '$0.432$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How likely is it that she scores one or more of her 3 throws?',
      solution:
        '"At least one" covers 1, 2 or 3 scores. The opposite is only one case: she scores none. So $P(\\text{at least one}) = 1 - P(\\text{none})$.\n\n' +
        'On one throw she misses with probability $1 - 0.4 = 0.6$.\n\n' +
        'The throws are independent, so multiply: $P(\\text{none}) = 0.6 \\times 0.6 \\times 0.6 = 0.216$.\n\n' +
        'Subtract from 1: $1 - 0.216 = 0.784$.',
      conclusion: 'Scoring none has probability $0.216$, and everything else is at least one, so the answer is $0.784$.',
      whyWrong: [
        'This is $P(X = 0) = 0.6^3$, the chance she scores **none**. You still need to subtract it from 1.',
        null,
        'This is $0.4^3$, the chance she scores **all three**, not at least one.',
        'This is $P(X = 1) = 3 \\times 0.4 \\times 0.6^2 = 0.432$, exactly one. "At least one" also includes scoring 2 or 3.',
      ],
      keyIdea: 'Whenever you see "at least one" among $n$ independent tries, use $P(X \\ge 1) = 1 - P(X = 0) = 1 - (1-p)^n$, where $X$ counts the successes and $p$ is the chance of success on one try. It saves adding up all the other cases.',
    },
    check: {
      optionValues: [0.216, 0.784, 0.064, 0.432],
      compute: () => pmf(3, 1, 0.4) + pmf(3, 2, 0.4) + pmf(3, 3, 0.4),
    },
  },
  {
    id: 'expected-binomial-010',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'A student guesses all 25 questions on a quiz, each correct with probability $0.2$, independently. If $X$ is the number correct, what is the **standard deviation** of $X$?',
    options: ['$4$', '$5$', '$\\sqrt{5}$', '$2$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How spread out is the number of correct guesses?',
      solution:
        '$X$ counts successes in a fixed number of independent tries with the same chance, so it is **binomial**, with $n = 25$ trials and $p = 0.2$.\n\n' +
        '**Variance** measures spread. For a binomial, $\\text{Var}(X) = np(1-p)$. Here $1 - p = 0.8$, the chance of a wrong guess.\n\n' +
        'Substitute: $\\text{Var}(X) = 25 \\times 0.2 \\times 0.8 = 5 \\times 0.8 = 4$.\n\n' +
        'The **standard deviation** is the square root of the variance: $\\sqrt{4} = 2$.',
      conclusion: 'The variance is 4, and its square root gives the answer, $2$.',
      whyWrong: [
        'This is the **variance** $np(1-p) = 4$. The standard deviation is its square root.',
        'This is the **mean** $np = 25 \\times 0.2 = 5$.',
        'This square-roots the mean, $\\sqrt{np}$. The factor $(1-p) = 0.8$ is missing: the standard deviation is $\\sqrt{np(1-p)}$.',
        null,
      ],
      keyIdea: 'For a binomial: mean $np$, variance $np(1-p)$, standard deviation $\\sqrt{np(1-p)}$. Underline which one the question names, since the other two usually appear among the wrong options.',
    },
    check: {
      optionValues: [4, 5, Math.sqrt(5), 2],
      compute: () => {
        const n = 25;
        const p = 0.2;
        const mu = n * p;
        const v = sumOf(Array.from({ length: n + 1 }, (_, r) => (r - mu) ** 2 * pmf(n, r, p)));
        return Math.sqrt(v);
      },
    },
  },
  {
    id: 'expected-binomial-011',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'A game costs AED 10 per play. The prize is AED 0 with probability $0.5$, AED 10 with probability $0.3$ and AED 40 with probability $0.2$. What is the expected gain (prize minus cost) per game?',
    options: ['A gain of AED 1', 'A gain of AED 11', 'A gain of AED 6', 'A loss of AED 1'],
    correctIndex: 0,
    markScheme: {
      asking: 'On average, how much does a player gain or lose per game?',
      solution:
        'First find the **expected prize**, the average prize per game. Multiply each prize by its probability:\n\n| Prize (AED) | Probability | Prize $\\times$ probability |\n|---|---|---|\n| 0 | $0.5$ | $0$ |\n| 10 | $0.3$ | $3$ |\n| 40 | $0.2$ | $8$ |\n\n' +
        'Add the last column: $0 + 3 + 8 = 11$. So the average prize is AED 11.\n\n' +
        'Every game costs AED 10, whatever the prize. So the expected gain is the average prize minus the cost: $11 - 10 = 1$.',
      conclusion: 'A player gets back AED 11 on average for AED 10 paid, which is A gain of AED 1.',
      whyWrong: [
        null,
        'This is the expected **prize**. The AED 10 cost of playing must be subtracted.',
        'This treats each prize as pure profit and only subtracts the AED 10 when the prize is zero: $-10(0.5) + 10(0.3) + 40(0.2) = 6$. The cost is paid on every play.',
        'This is $10 - 11$: the organiser\'s expected gain per game. The sign is the wrong way round for the player.',
      ],
      keyIdea: 'Expected gain $=$ expected prize $-$ cost. Find the expected prize by multiplying each prize by its probability and adding. Subtract the cost once, at the end.',
    },
    check: {
      optionValues: [1, 11, 6, -1],
      compute: () => ev([0, 10, 40].map((prize) => prize - 10), [0.5, 0.3, 0.2]),
    },
  },
  {
    id: 'expected-binomial-012',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'A random variable $X$ has $E(X) = 4$ and $\\text{Var}(X) = 3$. The random variable $Y$ is defined by $Y = 2X + 5$. Find $\\text{Var}(Y)$.',
    options: ['$11$', '$17$', '$12$', '$6$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What happens to the variance when every value of $X$ is doubled and then has 5 added?',
      solution:
        '**Variance** measures how spread out the values are. So ask what each part of $Y = 2X + 5$ does to the spread.\n\n' +
        'Adding 5 moves every value by the same amount. The gaps between values stay the same, so the $+5$ has no effect on the variance.\n\n' +
        'Multiplying by 2 doubles every gap. Variance uses squared distances, so it is multiplied by $2^2 = 4$. The rule is $\\text{Var}(aX + b) = a^2 \\, \\text{Var}(X)$.\n\n' +
        'Substitute $a = 2$ and $\\text{Var}(X) = 3$: $\\text{Var}(Y) = 4 \\times 3 = 12$.',
      conclusion: 'Only the multiplying changes the spread, and it counts squared, so the answer is $12$.',
      whyWrong: [
        'This applies the transformation to the variance as if it were a value: $2 \\times 3 + 5$. The $+5$ does not affect spread and the $2$ must be squared.',
        'This squares the $2$ correctly but then adds $5$: $4 \\times 3 + 5$. Adding a constant does not change the variance.',
        null,
        'This multiplies by $2$ instead of $2^2 = 4$. Variance scales with the **square** of the multiplier.',
      ],
      keyIdea: 'For $Y = aX + b$: $E(Y) = aE(X) + b$, where $E$ means the mean, but $\\text{Var}(Y) = a^2\\text{Var}(X)$. Square the multiplier and ignore the constant when finding the variance. The given mean isn\'t needed.',
    },
    check: {
      optionValues: [11, 17, 12, 6],
      compute: () => {
        // build a concrete X with mean 4 and variance 3: values 4 - sqrt3 and 4 + sqrt3, each with probability 1/2
        const s = Math.sqrt(3);
        const ys = [4 - s, 4 + s].map((x) => 2 * x + 5);
        const my = (ys[0] + ys[1]) / 2;
        return ((ys[0] - my) ** 2 + (ys[1] - my) ** 2) / 2;
      },
    },
  },
  {
    id: 'expected-binomial-013',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'A fair coin is tossed 4 times. What is the probability of getting **at most one** head?',
    options: ['$\\frac{1}{16}$', '$\\frac{1}{4}$', '$\\frac{11}{16}$', '$\\frac{5}{16}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How likely is 0 or 1 head in 4 coin tosses?',
      solution:
        '"At most one" means 0 heads or 1 head. We count each and add them, because they can\'t both happen.\n\n' +
        'Each toss has 2 results, so 4 tosses give $2 \\times 2 \\times 2 \\times 2 = 16$ equally likely outcomes.\n\n' +
        '0 heads is only TTTT, so 1 outcome. 1 head can be in any of the 4 positions (HTTT, THTT, TTHT, TTTH), so 4 outcomes.\n\n' +
        'Add the ones we want: $1 + 4 = 5$ outcomes out of 16, which gives $\\frac{5}{16}$.',
      conclusion: '5 of the 16 equally likely outcomes have at most one head, so the answer is $\\frac{5}{16}$.',
      whyWrong: [
        'This is only $P(X = 0)$. "At most one" also includes exactly one head.',
        'This is only $P(X = 1) = \\frac{4}{16}$. "At most one" also includes zero heads.',
        'This is $P(X \\ge 2) = 1 - \\frac{5}{16}$, the complement of the event asked for.',
        null,
      ],
      keyIdea: 'Turn words into values: "at most 1" means 0 or 1, and "at least 2" means 2 or more. For a fair coin tossed $n$ times, $r$ heads has $\\binom{n}{r}$ outcomes out of $2^n$, so add those. Here $\\binom{n}{r}$ is the number of ways to choose which $r$ tosses are heads.',
    },
    check: {
      optionValues: [1 / 16, 1 / 4, 11 / 16, 5 / 16],
      compute: () => {
        let count = 0;
        for (let mask = 0; mask < 16; mask++) {
          const heads = [0, 1, 2, 3].filter((t) => (mask >> t) & 1).length;
          if (heads <= 1) count++;
        }
        return new Frac(count, 16).value();
      },
    },
  },
  {
    id: 'expected-binomial-014',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'A random variable $X \\sim \\text{B}(n, p)$ has mean $E(X) = 12$ and variance $\\text{Var}(X) = 3$. Find $n$.',
    options: ['$48$', '$16$', '$9$', '$4$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many trials $n$ give this mean and this variance?',
      solution:
        'For a binomial, the mean is $np$ and the variance is $np(1-p)$, where $n$ is the number of trials and $p$ is the success chance. So $np = 12$ and $np(1-p) = 3$.\n\n' +
        'The variance is the mean times $(1-p)$. Swap $np$ for 12 in the second equation: $12(1-p) = 3$.\n\n' +
        'Divide both sides by 12: $1 - p = \\frac{3}{12} = 0.25$. So $p = 1 - 0.25 = 0.75$.\n\n' +
        'Put $p$ into $np = 12$: $0.75n = 12$.\n\n' +
        'Divide both sides by $0.75$ to get $n$ alone: $n = 12 \\div 0.75 = 16$.',
      conclusion: 'Checking: $16 \\times 0.75 = 12$ and $12 \\times 0.25 = 3$, so the answer is $16$.',
      whyWrong: [
        'This takes $\\frac{\\text{Var}}{\\text{mean}} = 0.25$ to be $p$ instead of $1 - p$, giving $n = \\frac{12}{0.25} = 48$. Check: then the variance would be $48 \\times 0.25 \\times 0.75 = 9$, not 3.',
        null,
        'This finds $p = 0.75$ correctly but then multiplies instead of dividing: $12 \\times 0.75 = 9$. Since $np = 12$, you need $n = \\frac{12}{p} = \\frac{12}{0.75}$. Check: $9 \\times 0.75 = 6.75$, not 12.',
        'This divides the mean by the variance, $\\frac{12}{3}$. That ratio is $\\frac{1}{1-p}$, not $n$.',
      ],
      keyIdea: 'Given a binomial\'s mean and variance, divide them to find $p$, since $\\frac{\\text{variance}}{\\text{mean}} = 1 - p$. Then $n = \\frac{\\text{mean}}{p}$.',
    },
    check: {
      optionValues: [48, 16, 9, 4],
      compute: () => {
        // search for the (n, p) pair with p in hundredths that matches both facts
        for (let n = 1; n <= 200; n++)
          for (let h = 1; h < 100; h++) {
            const p = h / 100;
            if (Math.abs(n * p - 12) < 1e-9 && Math.abs(n * p * (1 - p) - 3) < 1e-9) return n;
          }
        return -1;
      },
    },
  },
  {
    id: 'expected-binomial-016',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    stem: 'Each item from a machine is defective with probability $0.1$, independently of the others. In a random sample of 5 items, what is the exact probability that **at least two** are defective?',
    options: ['$0.40951$', '$0.0729$', '$0.08146$', '$0.67195$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How likely is it that 2 or more of the 5 items are defective?',
      solution:
        '"At least two" means 2, 3, 4 or 5, which is four cases. The opposite is only two cases: 0 or 1. So $P(X \\ge 2) = 1 - P(X = 0) - P(X = 1)$, where $X$ is the number defective.\n\n' +
        '$X$ counts successes in a fixed number of independent tries with the same chance, so it is **binomial**, with $n = 5$ trials and $p = 0.1$. So each item is fine with chance $1 - 0.1 = 0.9$.\n\n' +
        'For no defectives, all 5 are fine, so multiply $0.9$ five times. Step by step: $0.9 \\times 0.9 = 0.81$, then $0.81 \\times 0.81 = 0.6561$, then $0.6561 \\times 0.9 = 0.59049$. So $P(X = 0) = 0.59049$.\n\n' +
        'For one defective, there are 5 places it could be, and the other 4 items are fine. So $P(X = 1) = 5 \\times 0.1 \\times 0.9^4 = 5 \\times 0.1 \\times 0.6561 = 0.32805$.\n\n' +
        'Subtract both from 1: $1 - 0.59049 - 0.32805 = 0.08146$.',
      conclusion: 'Zero or one defective covers $0.91854$ of the chance, and what is left is the answer, $0.08146$.',
      whyWrong: [
        'This is $1 - P(X = 0) = P(X \\ge 1)$, at least **one**. You also need to remove $P(X = 1)$.',
        'This is $P(X = 2) = 10 \\times 0.01 \\times 0.729$, **exactly** two. "At least two" also includes 3, 4 and 5 defectives.',
        null,
        'This is $1 - P(X = 1)$: it removes exactly one defective but forgets to remove zero defectives as well.',
      ],
      keyIdea: 'Use $P(X \\ge 2) = 1 - P(X = 0) - P(X = 1)$. For "at least $k$" with a small $k$, the opposite has fewer cases to work out.',
    },
    check: {
      optionValues: [0.40951, 0.0729, 0.08146, 0.67195],
      compute: () => sumOf([2, 3, 4, 5].map((r) => pmf(5, r, 0.1))),
    },
  },
  {
    id: 'expected-binomial-019',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'What must the probabilities in a discrete probability distribution add up to?',
    options: ['$1$', '$0$', '$100$', '$E(X)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the total of all the probabilities in a distribution?',
      solution:
        'A **probability distribution** lists every possible value of a variable, with the chance of each.\n\n' +
        'One of those values must happen, and something certain has probability 1. So all the probabilities add up to exactly 1. For example, a fair coin gives $0.5 + 0.5 = 1$.',
      conclusion: 'The list covers everything that can happen, so the total is $1$.',
      whyWrong: [
        null,
        'A total of $0$ would mean that nothing can happen. Probabilities are never negative, so they cannot cancel out.',
        '$100$ would be the total if the probabilities were written as percentages. As decimals or fractions, the total is $1$.',
        '$E(X)$ is the sum of each value times its probability. The sum of the probabilities alone is always $1$.',
      ],
      keyIdea: 'Whenever a table of probabilities has an unknown, use the fact that they add up to 1 to find it. If the total isn\'t 1, the table isn\'t a valid distribution.',
    },
  },
  {
    id: 'expected-binomial-020',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'For $X \\sim \\text{B}(n, p)$, which expression gives the mean $E(X)$?',
    options: ['$np$', '$np(1-p)$', '$n + p$', '$\\frac{n}{p}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the formula for the mean of a binomial?',
      solution:
        '$X \\sim \\text{B}(n, p)$ means $X$ counts successes in $n$ trials, each succeeding with probability $p$.\n\n' +
        'On average, a share $p$ of the trials succeed. For example, 10 tosses of a fair coin give $10 \\times 0.5 = 5$ heads on average. In letters, that is $n \\times p$.',
      conclusion: 'A share $p$ of $n$ trials gives $np$ successes on average.',
      whyWrong: [
        null,
        'This is the **variance** of $X$, not the mean.',
        '$n$ counts trials and $p$ is a probability, so adding them has no meaning. Multiply them.',
        'This divides by $p$, so the mean would fall as $p$ rises. More likely successes must give a larger mean.',
      ],
      keyIdea: 'Test a formula on a simple case: 10 fair coin tosses must average 5 heads. Only $np$ gives $10 \\times 0.5 = 5$. The other formulas give different numbers.',
    },
    check: {
      // n = 5, p = 0.2
      optionValues: [5 * 0.2, 5 * 0.2 * 0.8, 5 + 0.2, 5 / 0.2],
      compute: () => sumOf([0, 1, 2, 3, 4, 5].map((r) => r * pmf(5, r, 0.2))),
    },
  },
  {
    id: 'expected-binomial-021',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'For $X \\sim \\text{B}(n, p)$, which expression gives the variance $\\text{Var}(X)$?',
    options: ['$np(1-p)$', '$np$', '$\\sqrt{np(1-p)}$', '$np^2$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the formula for the variance of a binomial?',
      solution:
        '$X \\sim \\text{B}(n, p)$ counts successes in $n$ trials with success chance $p$. So $1 - p$ is the chance of failure.\n\n' +
        '**Variance** measures spread. One trial has variance $p(1-p)$. Variances of independent trials add up, so $n$ trials give $n$ times that.',
      conclusion: 'Adding $p(1-p)$ across $n$ independent trials gives $np(1-p)$.',
      whyWrong: [
        null,
        'This is the **mean**. The variance has the extra factor $(1-p)$.',
        'This is the **standard deviation**, the square root of the variance.',
        'This squares $p$, but the second factor should be $(1-p)$, the probability of failure.',
      ],
      keyIdea: 'Know the three together: mean $np$, variance $np(1-p)$, standard deviation $\\sqrt{np(1-p)}$. Variance is the mean times the chance of failure, and the standard deviation is its square root.',
    },
    check: {
      // n = 5, p = 0.2
      optionValues: [5 * 0.2 * 0.8, 5 * 0.2, Math.sqrt(5 * 0.2 * 0.8), 5 * 0.2 ** 2],
      compute: () => {
        const rs = [0, 1, 2, 3, 4, 5];
        const mu = sumOf(rs.map((r) => r * pmf(5, r, 0.2)));
        return sumOf(rs.map((r) => (r - mu) ** 2 * pmf(5, r, 0.2)));
      },
    },
  },];
