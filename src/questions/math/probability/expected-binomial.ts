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
      solution:
        'In any probability distribution the probabilities must add up to $1$.\n\n' +
        '$$0.1 + 2k + k + 0.3 = 1$$\n\n' +
        'Collect the numbers and the $k$ terms: $3k + 0.4 = 1$.\n\n' +
        'Subtract $0.4$: $3k = 0.6$.\n\n' +
        'Divide by $3$: $k = 0.2$.\n\n' +
        'Check: $0.1 + 0.4 + 0.2 + 0.3 = 1$. Correct.',
      whyWrong: [
        'This is the value of $3k$. You set up $3k = 0.6$ correctly but stopped before dividing by $3$.',
        'This comes from counting $2k + k$ as only $2k$, i.e. solving $2k = 0.6$.',
        null,
        'This ignores the two known probabilities and solves $3k = 1$. The $0.1$ and $0.3$ must be taken away from $1$ first.',
      ],
      keyIdea: 'The probabilities in a probability distribution always add up to exactly 1.',
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
      solution:
        'The expected value is the probability-weighted average: multiply each value by its probability and add.\n\n' +
        '$$E(X) = \\sum x \\, P(X = x)$$\n\n' +
        '| $x$ | $P(X = x)$ | $x \\, P(X = x)$ |\n' +
        '|---|---|---|\n' +
        '| $0$ | $0.2$ | $0$ |\n' +
        '| $1$ | $0.4$ | $0.4$ |\n' +
        '| $2$ | $0.3$ | $0.6$ |\n' +
        '| $3$ | $0.1$ | $0.3$ |\n\n' +
        'Add the last column: $E(X) = 0 + 0.4 + 0.6 + 0.3 = 1.3$.',
      whyWrong: [
        'This is the plain average of the values $0, 1, 2, 3$. It ignores the probabilities, so it treats every value as equally likely.',
        null,
        'This is $E(X^2) = \\sum x^2 \\, P(X = x) = 0 + 0.4 + 1.2 + 0.9 = 2.5$. The values were squared by mistake.',
        'This divides the correct total $1.3$ by $4$. The probabilities already do the averaging, so there is nothing to divide by.',
      ],
      keyIdea: '$E(X)$ is found by multiplying each value by its probability and adding the results; no dividing at the end.',
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
      'The number of aces when 5 cards are dealt from a standard pack of 52 cards, without replacement',
      'The number of times a die is rolled until the first six appears',
      'The total score when three fair dice are rolled',
      'The number of heads when a fair coin is tossed 10 times',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'A binomial model $X \\sim \\text{B}(n, p)$ needs **all four** conditions:\n\n' +
        '1. A **fixed number** $n$ of trials.\n' +
        '2. Each trial has only **two outcomes** (success or failure).\n' +
        '3. The trials are **independent**.\n' +
        '4. The probability of success $p$ is the **same** on every trial.\n\n' +
        'Coin tosses: $n = 10$ fixed, each toss is head or not, tosses are independent and $p = 0.5$ every time. So $X \\sim \\text{B}(10, 0.5)$.\n\n' +
        'Each of the other options breaks at least one condition (see the explanations).',
      whyWrong: [
        'Dealing without replacement makes the cards dependent: the chance of an ace changes after each card (from $\\frac{4}{52}$ to $\\frac{3}{51}$ or $\\frac{4}{51}$), so $p$ is not constant.',
        'There is no fixed number of trials here: you keep rolling until a six appears. Counting trials "until the first success" is a different (geometric) model.',
        'This adds up scores from 1 to 6; it does not count successes. Each roll has six outcomes, not just success or failure.',
        null,
      ],
      keyIdea: 'Binomial needs a fixed number of independent trials, each with two outcomes and the same success probability, and $X$ counts the successes.',
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
      solution:
        'For $X \\sim \\text{B}(n, p)$ the mean is $E(X) = np$.\n\n' +
        'Here $n = 10$ and $p = 0.3$, so\n\n' +
        '$$E(X) = 10 \\times 0.3 = 3$$\n\n' +
        'This makes sense: if 30% of trials succeed on average, 10 trials give 3 successes on average.',
      whyWrong: [
        'This is the **variance** $np(1-p) = 10 \\times 0.3 \\times 0.7 = 2.1$, not the mean.',
        'This is just $p$, the probability of success on **one** trial. The mean counts expected successes over all 10 trials.',
        'This is $n(1-p) = 10 \\times 0.7 = 7$, the expected number of **failures**.',
        null,
      ],
      keyIdea: 'The mean of a binomial distribution $\\text{B}(n, p)$ is $np$.',
    },
    check: {
      optionValues: [2.1, 0.3, 7, 3],
      compute: () => sumOf(Array.from({ length: 11 }, (_, r) => r * pmf(10, r, 0.3))),
    },
  },
  {
    id: 'expected-binomial-005',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    stem: 'A game costs AED 4 to play. A fair six-sided die is rolled once. If it shows a six, the player receives a prize of AED $x$; otherwise the player receives nothing. The AED 4 is never returned. For what value of $x$ is the game **fair** (the player\'s expected gain is zero)?',
    options: ['AED 20', 'AED 24', 'AED 28', 'AED 4'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A game is **fair** when the expected gain (prize minus cost) is $0$, i.e. the expected prize equals the cost.\n\n' +
        'Expected prize: $x \\times \\frac{1}{6} = \\frac{x}{6}$ (the other $\\frac{5}{6}$ of the time the prize is 0, which adds nothing).\n\n' +
        'Set the expected gain to zero:\n\n' +
        '$$\\frac{x}{6} - 4 = 0$$\n\n' +
        'So $\\frac{x}{6} = 4$ and $x = 24$.\n\n' +
        'Check with net gains: win gives $24 - 4 = 20$ with probability $\\frac{1}{6}$, lose gives $-4$ with probability $\\frac{5}{6}$. Expected gain $= \\frac{20}{6} - \\frac{20}{6} = 0$. Fair.',
      whyWrong: [
        'This treats the prize as pure profit, solving $\\frac{1}{6}x = \\frac{5}{6} \\times 4$. But the AED 4 is paid even when you win, so the net gain on a win is $x - 4$, not $x$.',
        null,
        'This finds 24 and then adds the AED 4 stake on top, as if the stake had to be handed back on a win. With a prize of AED 28 the expected gain is $\\frac{28}{6} - 4 = \\frac{2}{3}$, not 0: only the expected **prize** has to equal the cost.',
        'Setting the prize equal to the cost ignores that you only win 1 time in 6. The expected gain would be $\\frac{4}{6} - 4 < 0$.',
      ],
      keyIdea: 'A game is fair when the expected gain is zero, i.e. the expected prize equals the cost to play.',
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
      solution:
        '**Step 1: find $k$.** Probabilities add to $1$: $k + 2k + 3k + 4k = 10k = 1$, so $k = 0.1$.\n\n' +
        'The probabilities are $0.1, 0.2, 0.3, 0.4$.\n\n' +
        '**Step 2: expected value.**\n\n' +
        '$$E(X) = 1(0.1) + 2(0.2) + 3(0.3) + 4(0.4)$$\n\n' +
        '$$= 0.1 + 0.4 + 0.9 + 1.6 = 3$$',
      whyWrong: [
        'This uses $k = 1$ instead of solving for $k$: $1 + 4 + 9 + 16 = 30$. An expected value of 30 is impossible when $X$ is at most 4.',
        'This is $E(X^2) = 1(0.1) + 4(0.2) + 9(0.3) + 16(0.4) = 10$. The values were squared.',
        null,
        'This is the plain average of $1, 2, 3, 4$. It ignores that larger values are more likely here.',
      ],
      keyIdea: 'First use "probabilities sum to 1" to find the unknown, then $E(X) = \\sum x \\, P(X = x)$.',
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
      solution:
        'Use $\\text{Var}(X) = E(X^2) - [E(X)]^2$.\n\n' +
        '**Mean:** $E(X) = 1(0.2) + 2(0.5) + 3(0.3) = 0.2 + 1 + 0.9 = 2.1$.\n\n' +
        '**Mean of the squares:** $E(X^2) = 1^2(0.2) + 2^2(0.5) + 3^2(0.3) = 0.2 + 2 + 2.7 = 4.9$.\n\n' +
        '**Variance:**\n\n' +
        '$$\\text{Var}(X) = 4.9 - 2.1^2 = 4.9 - 4.41 = 0.49$$',
      whyWrong: [
        'This is $E(X^2)$ only. You must still subtract $[E(X)]^2 = 4.41$.',
        'This is the **standard deviation** $\\sqrt{0.49} = 0.7$. The question asks for the variance, which is not square-rooted.',
        'This subtracts $E(X)$ instead of $[E(X)]^2$: $4.9 - 2.1 = 2.8$. The mean must be squared.',
        null,
      ],
      keyIdea: '$\\text{Var}(X) = E(X^2) - [E(X)]^2$: square the values for the first part and square the mean for the second.',
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
      solution:
        'The binomial formula is $P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}$.\n\n' +
        'Here $n = 5$, $r = 2$, $p = 0.2$, $1 - p = 0.8$.\n\n' +
        '- Number of ways to place the 2 successes among 5 trials: $\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10$\n' +
        '- Two successes: $0.2^2 = 0.04$\n' +
        '- Three failures: $0.8^3 = 0.512$\n\n' +
        '$$P(X = 2) = 10 \\times 0.04 \\times 0.512 = 0.2048$$',
      whyWrong: [
        null,
        'This is $0.2^2 \\times 0.8^3$ only: the probability of **one particular order** (such as SSFFF). It forgets the $\\binom{5}{2} = 10$ different orders.',
        'This counts ordered arrangements $5 \\times 4 = 20$ instead of $\\binom{5}{2} = 10$. The two successes are identical, so divide by $2!$.',
        'This is $10 \\times 0.2^2$ and leaves out the factor $0.8^3$ for the three failures.',
      ],
      keyIdea: '$P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}$: count the orders, then multiply the success and failure probabilities.',
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
      solution:
        'Let $X$ be the number scored, so $X \\sim \\text{B}(3, 0.4)$.\n\n' +
        '"At least one" is everything except "none", so use the complement:\n\n' +
        '$$P(X \\ge 1) = 1 - P(X = 0)$$\n\n' +
        '$P(X = 0)$ means all three are missed: $0.6^3 = 0.216$.\n\n' +
        '$$P(X \\ge 1) = 1 - 0.216 = 0.784$$',
      whyWrong: [
        'This is $P(X = 0) = 0.6^3$, the chance she scores **none**. You still need to subtract it from 1.',
        null,
        'This is $0.4^3$, the chance she scores **all three**, not at least one.',
        'This is $P(X = 1) = 3 \\times 0.4 \\times 0.6^2 = 0.432$, exactly one. "At least one" also includes scoring 2 or 3.',
      ],
      keyIdea: 'For "at least one", use $P(X \\ge 1) = 1 - P(X = 0)$.',
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
    stem: 'A multiple-choice quiz has 25 questions. A student guesses every answer and is correct on each with probability $0.2$, independently. Let $X$ be the number of correct answers. What is the **standard deviation** of $X$?',
    options: ['$4$', '$5$', '$\\sqrt{5}$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '$X \\sim \\text{B}(25, 0.2)$: 25 independent trials, each a success with probability $0.2$.\n\n' +
        'Variance: $\\text{Var}(X) = np(1-p) = 25 \\times 0.2 \\times 0.8 = 4$.\n\n' +
        'Standard deviation is the square root of the variance:\n\n' +
        '$$\\sigma = \\sqrt{4} = 2$$',
      whyWrong: [
        'This is the **variance** $np(1-p) = 4$. The standard deviation is its square root.',
        'This is the **mean** $np = 25 \\times 0.2 = 5$.',
        'This square-roots the mean, $\\sqrt{np}$. The factor $(1-p) = 0.8$ is missing: the standard deviation is $\\sqrt{np(1-p)}$.',
        null,
      ],
      keyIdea: 'For $\\text{B}(n, p)$ the variance is $np(1-p)$, and the standard deviation is its square root, $\\sqrt{np(1-p)}$.',
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
    stem: 'A game costs AED 10 per play. A spinner then gives a prize of AED 0 with probability $0.5$, AED 10 with probability $0.3$, and AED 40 with probability $0.2$. What is the player\'s expected gain (prize minus cost) per game?',
    options: ['A gain of AED 1', 'A gain of AED 11', 'A gain of AED 6', 'A loss of AED 1'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Expected prize:**\n\n' +
        '$$E(\\text{prize}) = 0(0.5) + 10(0.3) + 40(0.2) = 0 + 3 + 8 = 11$$\n\n' +
        '**Expected gain** = expected prize minus cost $= 11 - 10 = 1$.\n\n' +
        'Check using net gains $-10, 0, 30$:\n\n' +
        '$$-10(0.5) + 30(0.2) = -5 + 6 = 1$$\n\n' +
        '(The net gain of AED 0, when the prize is AED 10, adds nothing.)\n\n' +
        'The player gains AED 1 per game on average, so the game is **not** fair (it favours the player).',
      whyWrong: [
        null,
        'This is the expected **prize**. The AED 10 cost of playing must be subtracted.',
        'This treats each prize as pure profit and only subtracts the AED 10 when the prize is zero: $-10(0.5) + 10(0.3) + 40(0.2) = 6$. The cost is paid on every play.',
        'This is $10 - 11$: the organiser\'s expected gain per game. The sign is the wrong way round for the player.',
      ],
      keyIdea: 'Expected gain = expected prize minus the cost, because the cost is paid every time.',
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
      solution:
        'Rules for $Y = aX + b$:\n\n' +
        '- $E(aX + b) = aE(X) + b$\n' +
        '- $\\text{Var}(aX + b) = a^2 \\, \\text{Var}(X)$\n\n' +
        'Adding $5$ shifts every value by the same amount, so the spread does not change: $b$ disappears. Multiplying by $2$ doubles every distance from the mean, and variance uses **squared** distances, so it is multiplied by $2^2 = 4$.\n\n' +
        '$$\\text{Var}(Y) = 2^2 \\times 3 = 4 \\times 3 = 12$$\n\n' +
        '($E(X) = 4$ is not needed for the variance; it would give $E(Y) = 2(4) + 5 = 13$.)',
      whyWrong: [
        'This applies the transformation to the variance as if it were a value: $2 \\times 3 + 5$. The $+5$ does not affect spread and the $2$ must be squared.',
        'This squares the $2$ correctly but then adds $5$: $4 \\times 3 + 5$. Adding a constant does not change the variance.',
        null,
        'This multiplies by $2$ instead of $2^2 = 4$. Variance scales with the **square** of the multiplier.',
      ],
      keyIdea: '$\\text{Var}(aX + b) = a^2 \\, \\text{Var}(X)$: constants added do not change the spread.',
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
      solution:
        'Let $X$ be the number of heads: $X \\sim \\text{B}(4, 0.5)$. Every sequence of 4 tosses has probability $0.5^4 = \\frac{1}{16}$.\n\n' +
        '"At most one" means $X = 0$ or $X = 1$.\n\n' +
        '- $P(X = 0) = \\binom{4}{0} \\times \\frac{1}{16} = \\frac{1}{16}$ (TTTT)\n' +
        '- $P(X = 1) = \\binom{4}{1} \\times \\frac{1}{16} = \\frac{4}{16}$ (HTTT, THTT, TTHT, TTTH)\n\n' +
        '$$P(X \\le 1) = \\frac{1}{16} + \\frac{4}{16} = \\frac{5}{16}$$',
      whyWrong: [
        'This is only $P(X = 0)$. "At most one" also includes exactly one head.',
        'This is only $P(X = 1) = \\frac{4}{16}$. "At most one" also includes zero heads.',
        'This is $P(X \\ge 2) = 1 - \\frac{5}{16}$, the complement of the event asked for.',
        null,
      ],
      keyIdea: '"At most $r$" means add $P(X = 0)$ up to $P(X = r)$.',
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
  // ------------------------------------------------------------------ challenge
  {
    id: 'expected-binomial-014',
    subtopic: 'expected-binomial',
    difficulty: 'challenge',
    stem: 'A random variable $X \\sim \\text{B}(n, p)$ has mean $E(X) = 12$ and variance $\\text{Var}(X) = 3$. Find $n$.',
    options: ['$48$', '$16$', '$9$', '$4$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Write down both facts:\n\n' +
        '$$np = 12 \\qquad np(1-p) = 3$$\n\n' +
        'Divide the second equation by the first (the $np$ cancels):\n\n' +
        '$$1 - p = \\frac{3}{12} = 0.25$$\n\n' +
        'So $p = 0.75$.\n\n' +
        'Substitute back: $n \\times 0.75 = 12$, so $n = \\frac{12}{0.75} = 16$.\n\n' +
        'Check: $16 \\times 0.75 = 12$ and $16 \\times 0.75 \\times 0.25 = 3$. Both correct.',
      whyWrong: [
        'This takes $\\frac{\\text{Var}}{\\text{mean}} = 0.25$ to be $p$ instead of $1 - p$, giving $n = \\frac{12}{0.25} = 48$. Check: then the variance would be $48 \\times 0.25 \\times 0.75 = 9$, not 3.',
        null,
        'This finds $p = 0.75$ correctly but then multiplies instead of dividing: $12 \\times 0.75 = 9$. Since $np = 12$, you need $n = \\frac{12}{p} = \\frac{12}{0.75}$. Check: $9 \\times 0.75 = 6.75$, not 12.',
        'This divides the mean by the variance, $\\frac{12}{3}$. That ratio is $\\frac{1}{1-p}$, not $n$.',
      ],
      keyIdea: 'Dividing $\\text{Var}(X) = np(1-p)$ by $E(X) = np$ gives $1 - p$ directly; then $n = \\frac{E(X)}{p}$.',
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
    id: 'expected-binomial-015',
    subtopic: 'expected-binomial',
    difficulty: 'challenge',
    stem: 'The random variable $X$ has the probability distribution below, where $a$ and $b$ are constants. Given that $E(X) = 2.4$, find $\\text{Var}(X)$.',
    table: {
      headers: ['$x$', '$1$', '$2$', '$5$'],
      rows: [['$P(X = x)$', '$a$', '$b$', '$0.2$']],
    },
    options: ['$1.84$', '$7.6$', '$5.2$', '$0.64$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Two equations for two unknowns.**\n\n' +
        '- Probabilities sum to 1: $a + b + 0.2 = 1$, so $a + b = 0.8$.\n' +
        '- Mean: $a + 2b + 5(0.2) = 2.4$, so $a + 2b = 1.4$.\n\n' +
        'Subtract the first from the second: $b = 0.6$, then $a = 0.2$.\n\n' +
        '**Variance.** $E(X^2) = 1^2(0.2) + 2^2(0.6) + 5^2(0.2) = 0.2 + 2.4 + 5 = 7.6$.\n\n' +
        '$$\\text{Var}(X) = E(X^2) - [E(X)]^2 = 7.6 - 2.4^2 = 7.6 - 5.76 = 1.84$$',
      whyWrong: [
        null,
        'This is $E(X^2)$ only; $[E(X)]^2 = 5.76$ still has to be subtracted.',
        'This subtracts $E(X)$ instead of $[E(X)]^2$: $7.6 - 2.4 = 5.2$.',
        'This swaps $a$ and $b$ ($a = 0.6$, $b = 0.2$), giving $E(X^2) = 6.4$ and $6.4 - 5.76 = 0.64$. Those values would make the mean 2, not 2.4.',
      ],
      keyIdea: 'Use "probabilities sum to 1" and the given mean as two simultaneous equations, then $\\text{Var}(X) = E(X^2) - [E(X)]^2$.',
    },
    check: {
      optionValues: [1.84, 7.6, 5.2, 0.64],
      compute: () => {
        // a + b = 1 - 0.2 ; 1a + 2b = 2.4 - 5(0.2)  -> solve by elimination
        const s1 = 1 - 0.2;
        const s2 = 2.4 - 5 * 0.2;
        const b = s2 - s1;
        const a = s1 - b;
        const xs = [1, 2, 5];
        const ps = [a, b, 0.2];
        const mu = ev(xs, ps);
        return sumOf(xs.map((x, i) => (x - mu) ** 2 * ps[i]));
      },
    },
  },
  {
    id: 'expected-binomial-016',
    subtopic: 'expected-binomial',
    difficulty: 'challenge',
    stem: 'Each item made by a machine is defective with probability $0.1$, independently of the others. A random sample of 5 items is checked. What is the exact probability that **at least two** of them are defective?',
    options: ['$0.40951$', '$0.0729$', '$0.08146$', '$0.67195$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $X \\sim \\text{B}(5, 0.1)$ be the number of defective items. Use the complement:\n\n' +
        '$$P(X \\ge 2) = 1 - P(X = 0) - P(X = 1)$$\n\n' +
        '- $P(X = 0) = 0.9^5 = 0.59049$\n' +
        '- $P(X = 1) = \\binom{5}{1}(0.1)(0.9^4) = 5 \\times 0.1 \\times 0.6561 = 0.32805$\n\n' +
        '$$P(X \\ge 2) = 1 - 0.59049 - 0.32805 = 0.08146$$',
      whyWrong: [
        'This is $1 - P(X = 0) = P(X \\ge 1)$, at least **one**. You also need to remove $P(X = 1)$.',
        'This is $P(X = 2) = 10 \\times 0.01 \\times 0.729$, **exactly** two. "At least two" also includes 3, 4 and 5 defectives.',
        null,
        'This is $1 - P(X = 1)$: it removes exactly one defective but forgets to remove zero defectives as well.',
      ],
      keyIdea: '$P(X \\ge 2) = 1 - P(X = 0) - P(X = 1)$: the complement of "at least 2" is "0 or 1".',
    },
    check: {
      optionValues: [0.40951, 0.0729, 0.08146, 0.67195],
      compute: () => sumOf([2, 3, 4, 5].map((r) => pmf(5, r, 0.1))),
    },
  },
  {
    id: 'expected-binomial-017',
    subtopic: 'expected-binomial',
    difficulty: 'challenge',
    stem: 'A test has 25 multiple-choice questions, each with 5 options and one correct answer. A correct answer scores $+4$ and a wrong answer scores $-1$. A student guesses all 25 answers at random. What is the student\'s expected total score?',
    options: ['$5$', '$0$', '$20$', '$-5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let $X$ be the number of correct answers: $X \\sim \\text{B}(25, 0.2)$, so $E(X) = 25 \\times 0.2 = 5$.\n\n' +
        'The number wrong is $25 - X$, so the score is\n\n' +
        '$$S = 4X - (25 - X) = 5X - 25$$\n\n' +
        '$$E(S) = 5E(X) - 25 = 5(5) - 25 = 0$$\n\n' +
        'Quick check per question: expected score $= 4(0.2) + (-1)(0.8) = 0.8 - 0.8 = 0$. So random guessing gains nothing on average with this marking.',
      whyWrong: [
        'This is $E(X) = np = 5$, the expected number of **correct answers**, not the score.',
        null,
        'This scores the 5 expected correct answers ($4 \\times 5 = 20$) but forgets the $-1$ penalty for the 20 expected wrong answers.',
        'This subtracts 1 for **all** 25 questions ($20 - 25$), but only the wrong answers lose a mark.',
      ],
      keyIdea: 'Write the score as a linear function of the binomial count, then use $E(aX + b) = aE(X) + b$.',
    },
    check: {
      optionValues: [5, 0, 20, -5],
      compute: () => sumOf(Array.from({ length: 26 }, (_, r) => (4 * r - (25 - r)) * pmf(25, r, 0.2))),
    },
  },
  {
    id: 'expected-binomial-018',
    subtopic: 'expected-binomial',
    difficulty: 'challenge',
    stem: 'A test has 25 multiple-choice questions, each with 5 options and one correct answer. A correct answer scores $+4$ and a wrong answer scores $-1$. A student guesses all 25 answers at random, independently. What is the **variance** of the student\'s total score?',
    options: ['$20$', '$4$', '$100$', '$75$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Number correct: $X \\sim \\text{B}(25, 0.2)$, so $\\text{Var}(X) = 25 \\times 0.2 \\times 0.8 = 4$.\n\n' +
        'Score: $S = 4X - (25 - X) = 5X - 25$.\n\n' +
        'Use $\\text{Var}(aX + b) = a^2 \\, \\text{Var}(X)$ with $a = 5$, $b = -25$:\n\n' +
        '$$\\text{Var}(S) = 5^2 \\times 4 = 25 \\times 4 = 100$$\n\n' +
        '(So the standard deviation of the score is $\\sqrt{100} = 10$ marks.)',
      whyWrong: [
        'This multiplies the variance by $5$ instead of $5^2 = 25$.',
        'This is $\\text{Var}(X)$, the variance of the **number correct**, not of the score $S = 5X - 25$.',
        null,
        'This computes $25 \\times 4$ and then also subtracts the constant 25. Adding or subtracting a constant never changes the variance.',
      ],
      keyIdea: '$\\text{Var}(aX + b) = a^2 \\, \\text{Var}(X)$, and for a binomial count $\\text{Var}(X) = np(1-p)$.',
    },
    check: {
      optionValues: [20, 4, 100, 75],
      compute: () => {
        const scores = Array.from({ length: 26 }, (_, r) => 4 * r - (25 - r));
        const ps = scores.map((_, r) => pmf(25, r, 0.2));
        const mu = ev(scores, ps);
        return sumOf(scores.map((s, i) => (s - mu) ** 2 * ps[i]));
      },
    },
  },
];
