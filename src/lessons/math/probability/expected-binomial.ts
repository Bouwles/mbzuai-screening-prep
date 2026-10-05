import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'expected-binomial',
  know:
    '### Random variables and probability tables\n\n' +
    'A **random variable** is a number whose value depends on chance, such as the score on a die or the number of goals in a match. We use a capital letter like $X$ for the variable and a small letter like $x$ for a particular value it can take.\n\n' +
    'A **discrete** random variable takes separate values you can list (0, 1, 2, ...). Its **probability distribution** is usually given as a table:\n\n' +
    '| $x$ | $0$ | $1$ | $2$ | $3$ |\n' +
    '|---|---|---|---|---|\n' +
    '| $P(X = x)$ | $0.2$ | $0.4$ | $0.3$ | $0.1$ |\n\n' +
    'Two rules always hold: every probability is between 0 and 1, and **all the probabilities add up to 1**. That second rule is how you find an unknown like $k$ in a table.\n\n' +
    '### Expected value (the mean)\n\n' +
    'The **expected value** (or mean) $E(X)$ is the long-run average value if you repeated the experiment many times. It is a *weighted* average: multiply each value by its probability, then add.\n\n' +
    '$$E(X) = \\sum x \\, P(X = x)$$\n\n' +
    'For the table above: $E(X) = 0(0.2) + 1(0.4) + 2(0.3) + 3(0.1) = 1.3$. Notice that $E(X)$ does not have to be a value $X$ can actually take (you cannot score 1.3 goals). Do **not** divide by the number of values at the end: the probabilities already do the averaging.\n\n' +
    '### Fair games\n\n' +
    'In a game, let the random variable be your **gain** (what you win minus what you paid). The game is **fair** if the expected gain is 0, which is the same as saying the expected prize equals the cost to play. A positive expected gain favours the player; a negative one favours the organiser. Always check whether the cost is paid on every play (it usually is), so subtract it from every outcome, or subtract it once from the expected prize.\n\n' +
    '### Variance: how spread out X is\n\n' +
    'The **variance** measures spread around the mean $\\mu = E(X)$. By definition it is the expected squared distance from the mean, $\\text{Var}(X) = \\sum (x - \\mu)^2 \\, P(X = x)$, but the easiest formula to use is\n\n' +
    '$$\\text{Var}(X) = E(X^2) - [E(X)]^2$$\n\n' +
    'where $E(X^2) = \\sum x^2 \\, P(X = x)$ (square the **values**, keep the probabilities). The **standard deviation** is $\\sqrt{\\text{Var}(X)}$. Variance can never be negative.\n\n' +
    'If you change a variable to $aX + b$, the mean changes to $aE(X) + b$ but the variance becomes $a^2 \\, \\text{Var}(X)$: adding $b$ slides everything along without changing the spread, and multiplying by $a$ stretches distances by $a$, so squared distances by $a^2$.\n\n' +
    '### The binomial distribution\n\n' +
    'Many questions count successes in repeated trials. $X$ is **binomial**, written $X \\sim \\text{B}(n, p)$, when all four conditions hold:\n\n' +
    '1. A **fixed number** of trials, $n$.\n' +
    '2. Each trial has **two outcomes**: success or failure.\n' +
    '3. The trials are **independent**.\n' +
    '4. The probability of success $p$ is the **same** every time.\n\n' +
    'Examples: heads in 10 coin tosses; correct answers when guessing 20 questions. Not binomial: drawing cards without replacement ($p$ changes), or rolling until a six appears (no fixed $n$).\n\n' +
    '### Binomial probabilities\n\n' +
    'The probability of exactly $r$ successes is\n\n' +
    '$$P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}$$\n\n' +
    'Read it in three parts: $\\binom{n}{r}$ counts the different **orders** in which the $r$ successes can happen; $p^r$ is the chance of the successes; $(1-p)^{n-r}$ is the chance of the failures. For "at least" and "at most" questions, add several of these, or use the complement: $P(X \\ge 1) = 1 - P(X = 0)$.\n\n' +
    '### Mean and variance of a binomial\n\n' +
    'For $X \\sim \\text{B}(n, p)$ you do not need a table: $E(X) = np$ and $\\text{Var}(X) = np(1-p)$. If 30% of 10 trials succeed on average, you expect $10 \\times 0.3 = 3$ successes. If you are given the mean and variance, divide them: $\\frac{np(1-p)}{np} = 1 - p$.',
  formulas: [
    { label: 'Probabilities sum to 1', tex: '\\sum P(X = x) = 1', note: 'Use it to find an unknown such as k in a table.' },
    { label: 'Expected value', tex: 'E(X) = \\sum x \\, P(X = x)' },
    { label: 'Mean of the squares', tex: 'E(X^2) = \\sum x^2 \\, P(X = x)' },
    { label: 'Variance', tex: '\\text{Var}(X) = E(X^2) - [E(X)]^2', note: 'Standard deviation = square root of the variance.' },
    { label: 'Fair game', tex: 'E(\\text{gain}) = E(\\text{prize}) - \\text{cost} = 0' },
    { label: 'Linear change: mean', tex: 'E(aX + b) = aE(X) + b' },
    { label: 'Linear change: variance', tex: '\\text{Var}(aX + b) = a^2 \\, \\text{Var}(X)', note: 'The constant b does not change the spread.' },
    { label: 'Binomial probability', tex: 'P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}', note: 'Only when $X \\sim \\text{B}(n, p)$: fixed $n$, two outcomes, independent trials, constant $p$.' },
    { label: 'At least one', tex: 'P(X \\ge 1) = 1 - P(X = 0) = 1 - (1-p)^n' },
    { label: 'Binomial mean', tex: 'E(X) = np' },
    { label: 'Binomial variance', tex: '\\text{Var}(X) = np(1-p)' },
  ],
  examples: [
    {
      title: 'Find k, then E(X)',
      problem: 'The table gives $P(X = x)$ for $x = 1, 2, 3, 4$ as $0.1$, $0.3$, $k$, $0.2$. Find $k$ and $E(X)$.',
      steps: [
        'Probabilities add to 1: $0.1 + 0.3 + k + 0.2 = 1$.',
        'So $k + 0.6 = 1$, giving $k = 0.4$.',
        'Multiply each value by its probability: $1(0.1) + 2(0.3) + 3(0.4) + 4(0.2)$.',
        'This is $0.1 + 0.6 + 1.2 + 0.8 = 2.7$.',
      ],
      answer: '$k = 0.4$ and $E(X) = 2.7$',
    },
    {
      title: 'Variance from a table',
      problem: 'Using the same distribution ($x = 1, 2, 3, 4$ with probabilities $0.1, 0.3, 0.4, 0.2$), find $\\text{Var}(X)$.',
      steps: [
        'From the first example, $E(X) = 2.7$.',
        'Square the values and weight them: $E(X^2) = 1(0.1) + 4(0.3) + 9(0.4) + 16(0.2)$.',
        'This is $0.1 + 1.2 + 3.6 + 3.2 = 8.1$.',
        'Square the mean: $2.7^2 = 7.29$.',
        '$\\text{Var}(X) = 8.1 - 7.29 = 0.81$ (so the standard deviation is $0.9$).',
      ],
      answer: '$\\text{Var}(X) = 0.81$',
    },
    {
      title: 'Is the game fair?',
      problem: 'It costs AED 5 to play. Two fair coins are tossed. Two heads wins a prize of AED 12, exactly one head wins AED 4, and no heads wins nothing. Find the expected gain per game.',
      steps: [
        'Probabilities: two heads $\\frac{1}{4}$, exactly one head $\\frac{2}{4} = \\frac{1}{2}$, no heads $\\frac{1}{4}$.',
        'Expected prize: $12 \\times \\frac{1}{4} + 4 \\times \\frac{1}{2} = 3 + 2 = 5$ (no heads wins AED 0, which adds nothing).',
        'Expected gain: $5 - 5 = 0$.',
        'The expected gain is zero, so the game is fair.',
      ],
      answer: 'Expected gain AED 0: the game is fair.',
    },
    {
      title: 'Binomial: exactly, at least, mean and variance',
      problem: 'A seed germinates with probability $0.8$, independently. 4 seeds are planted. Find $P(X = 3)$, $P(X \\ge 1)$, $E(X)$ and $\\text{Var}(X)$, where $X$ is the number that germinate.',
      steps: [
        'Fixed $n = 4$, success or failure, independent, constant $p = 0.8$: so $X \\sim \\text{B}(4, 0.8)$.',
        '$P(X = 3) = \\binom{4}{3}(0.8)^3(0.2) = 4 \\times 0.512 \\times 0.2 = 0.4096$.',
        '$P(X = 0) = 0.2^4 = 0.0016$, so $P(X \\ge 1) = 1 - 0.0016 = 0.9984$.',
        '$E(X) = np = 4 \\times 0.8 = 3.2$.',
        '$\\text{Var}(X) = np(1-p) = 4 \\times 0.8 \\times 0.2 = 0.64$.',
      ],
      answer: '$P(X = 3) = 0.4096$, $P(X \\ge 1) = 0.9984$, $E(X) = 3.2$, $\\text{Var}(X) = 0.64$',
    },
  ],
  traps: [
    'Dividing by the number of values when finding $E(X)$. The probabilities already do the averaging: just multiply and add.',
    'Forgetting to subtract $[E(X)]^2$ in the variance, or subtracting $E(X)$ instead of $[E(X)]^2$. Also do not confuse the variance with the standard deviation (its square root).',
    'Forgetting the cost in a game. The expected **prize** is not the expected **gain**: the cost is paid every time, so subtract it.',
    'Leaving out $\\binom{n}{r}$ in a binomial probability. $p^r(1-p)^{n-r}$ is the chance of just one order of successes and failures.',
    'Mixing up "at least" and "at most", or adding only one term. "At least 2" out of 5 is $1 - P(X = 0) - P(X = 1)$.',
    'Using the binomial when it does not apply, for example drawing without replacement (the probability changes between draws).',
  ],
  examTip:
    'Expect a table to fill in, a short $E(X)$ or variance calculation, a "which situation is binomial?" question, or a binomial probability with your calculator. Quick checks to eliminate options:\n\n' +
    '- $E(X)$ must lie between the smallest and largest values of $X$. Anything outside that range is wrong.\n' +
    '- A variance can never be negative, and a probability must be between 0 and 1.\n' +
    '- For a binomial, $np$ is the mean and $np(1-p)$ is always **smaller** than the mean. If two options are $np$ and $np(1-p)$, read carefully which one is asked for; a third option is often the square root (the standard deviation).\n' +
    '- Wrong options are usually the "forgot a step" values: forgot $\\binom{n}{r}$, forgot to subtract from 1, forgot to subtract $[E(X)]^2$, forgot the cost. Compute the correct answer, then check it against these.\n' +
    '- For "at least one", go straight to $1 - (1-p)^n$: one calculator line.',
};
