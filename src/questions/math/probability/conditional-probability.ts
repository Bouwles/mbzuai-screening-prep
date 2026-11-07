import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

const F = (n: number, d = 1) => new Frac(n, d);

export const questions: StaticQuestion[] = [
  {
    id: 'prob-cond-001',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'A jar contains 7 green and 3 yellow sweets. Two sweets are taken at random, one after the other, **without replacement**. What is the probability that the **second** sweet taken is green?',
    options: ['$\\frac{7}{10}$', '$\\frac{2}{3}$', '$\\frac{7}{15}$', '$\\frac{49}{100}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the chance that the second sweet is green, when we don\'t know the colour of the first?',
      solution:
        'The first sweet changes what is left, so split into the two things that could happen first: green or yellow.\n\n' +
        '**First green:** this has chance $\\frac{7}{10}$. That leaves 6 green out of 9, so the second is green with chance $\\frac{6}{9}$. Multiply along this path: $\\frac{7}{10} \\times \\frac{6}{9} = \\frac{42}{90}$.\n\n' +
        '**First yellow:** this has chance $\\frac{3}{10}$. All 7 green are still there, out of 9, so the second is green with chance $\\frac{7}{9}$. Multiply: $\\frac{3}{10} \\times \\frac{7}{9} = \\frac{21}{90}$.\n\n' +
        'Either path gives a green second sweet, so add them: $\\frac{42}{90} + \\frac{21}{90} = \\frac{63}{90}$.\n\n' +
        'Simplify by dividing top and bottom by 9: $\\frac{63}{90} = \\frac{7}{10}$.',
      conclusion: 'The two paths total $\\frac{63}{90}$, so the answer is $\\frac{7}{10}$, the same as the chance for the first sweet.',
      whyWrong: [
        null,
        'This is $\\frac{6}{9}$, which assumes the first sweet was green. We are not told the colour of the first sweet, so the yellow-first branch ($\\frac{3}{10} \\times \\frac{7}{9}$) must be included too.',
        'This is $\\frac{7}{10} \\times \\frac{6}{9} = \\frac{42}{90}$, the probability that **both** sweets are green, not just the second.',
        'This is $\\frac{7}{10} \\times \\frac{7}{10}$, the chance that both sweets are green **with** replacement - the wrong event and the wrong method.',
      ],
      keyIdea: 'Draw a tree with one branch for each possible first result. Multiply along every branch that ends in what you want, then add those branches. With no extra information, the second draw has the same chance as the first.',
    },
    check: {
      optionValues: [7 / 10, 2 / 3, 7 / 15, 49 / 100],
      compute: () => {
        const green = 7;
        const yellow = 3;
        const n = green + yellow;
        return F(green, n).mul(F(green - 1, n - 1)).add(F(yellow, n).mul(F(green, n - 1))).value();
      },
    },
  },

  // ---------------------------------------------------------------- foundation
  {
    id: 'conditional-probability-001',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'Events $A$ and $B$ satisfy $P(A \\cap B) = 0.12$ and $P(B) = 0.4$. What is $P(A \\mid B)$?',
    options: ['$0.3$', '$0.048$', '$0.52$', '$0.28$'],
    correctIndex: 0,
    markScheme: {
      asking: 'If $B$ has happened, how likely is $A$?',
      solution:
        '$P(A \\mid B)$ means the probability of $A$ **given that** $B$ has happened. The bar $\\mid$ is read as "given". $P(A \\cap B)$ means both happen.\n\n' +
        'Since $B$ has happened, we only look inside $B$ and ask what share of it is also $A$. That gives the formula $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$.\n\n' +
        'Substitute: $P(A \\mid B) = \\frac{0.12}{0.4}$. Multiply top and bottom by 10 to make it easier: $\\frac{1.2}{4} = 0.3$.',
      conclusion: 'Both events make up $0.12$ out of the $0.4$ for $B$, so the answer is $0.3$.',
      whyWrong: [
        null,
        'This is $0.12 \\times 0.4$: it multiplies by $0.4$, the probability of $B$, instead of dividing by it.',
        'This is $0.12 + 0.4$: adding probabilities is used for "or" with mutually exclusive events, not for conditional probability.',
        'This is $0.4 - 0.12$, which is $P(B \\text{ and not } A)$, not the probability of $A$ given $B$.',
      ],
      keyIdea: 'For $P(A \\mid B)$, use $\\frac{P(A \\cap B)}{P(B)}$, with both on top and the event after the bar on the bottom. The bar tells you which probability to divide by.',
    },
    check: { optionValues: [0.3, 0.048, 0.52, 0.28], compute: () => 0.12 / 0.4 },
  },
  {
    id: 'conditional-probability-002',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'The table shows whether 50 students play chess. A student is chosen at random from those who **play chess**. What is the probability that this student is in Year 13?',
    table: {
      headers: ['Year group', 'Plays chess', 'Does not play chess', 'Total'],
      rows: [
        ['Year 12', 6, 14, 20],
        ['Year 13', 14, 16, 30],
        ['Total', 20, 30, 50],
      ],
    },
    options: ['$\\frac{7}{25}$', '$\\frac{7}{15}$', '$\\frac{7}{10}$', '$\\frac{3}{5}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Among the chess players only, what fraction are in Year 13?',
      solution:
        'The student is chosen from those who play chess, so ignore everyone else. Use only the "Plays chess" column.\n\n' +
        'The Total row of that column shows 20 chess players. That is our whole group now, so 20 goes on the bottom.\n\n' +
        'In the same column, the Year 13 row shows 14. These are the students we want, so 14 goes on top.\n\n' +
        'Write the fraction and simplify by dividing top and bottom by 2: $\\frac{14}{20} = \\frac{7}{10}$.',
      conclusion: '14 of the 20 chess players are in Year 13, so the answer is $\\frac{7}{10}$.',
      whyWrong: [
        'This is $\\frac{14}{50}$: it divides by all 50 students, giving $P(\\text{Year 13 and chess})$. The condition means you divide by the 20 chess players only.',
        'This is $\\frac{14}{30}$, which is $P(\\text{chess} \\mid \\text{Year 13})$: the condition has been reversed (dividing by the Year 13 total instead of the chess total).',
        null,
        'This is $\\frac{30}{50}$, the probability of being in Year 13 for **any** student; it ignores the information that the student plays chess.',
      ],
      keyIdea: 'In a two-way table, the "given" or "chosen from" group decides the bottom of the fraction. Divide the cell where both conditions meet by that group\'s total, not by the grand total.',
    },
    check: {
      optionValues: [7 / 25, 7 / 15, 7 / 10, 3 / 5],
      compute: () => {
        const chess = { y12: 6, y13: 14 };
        return F(chess.y13, chess.y12 + chess.y13).value();
      },
    },
  },
  {
    id: 'conditional-probability-003',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'A bag has 3 red and 5 green counters. A counter is taken at random and **put back**, then a second is taken. What is the probability that **both** are green?',
    options: ['$\\frac{5}{14}$', '$\\frac{25}{64}$', '$\\frac{5}{8}$', '$\\frac{39}{64}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How likely are two greens when the first counter goes back before the second draw?',
      solution:
        'There are $3 + 5 = 8$ counters, and 5 are green. So the first counter is green with probability $\\frac{5}{8}$.\n\n' +
        'The counter is **put back**, so the bag is the same for the second draw. The second counter is also green with probability $\\frac{5}{8}$.\n\n' +
        'We need the first green **and** the second green, so multiply: $\\frac{5}{8} \\times \\frac{5}{8} = \\frac{25}{64}$.',
      conclusion: 'Each draw is green with chance $\\frac{5}{8}$, and multiplying them gives the answer, $\\frac{25}{64}$.',
      whyWrong: [
        'This is $\\frac{5}{8} \\times \\frac{4}{7}$, the answer **without** replacement. Here the counter is put back, so the second draw is still 5 green out of 8.',
        null,
        'This is only the probability that the **first** counter is green; the question needs both draws to be green.',
        'This is $1 - \\frac{25}{64}$, the probability that the counters are **not** both green.',
      ],
      keyIdea: '"Put back" means the chance stays the same on every draw, so multiply the same fraction each time. Without putting back, the top and the bottom each drop by one for the next draw.',
    },
    check: { optionValues: [5 / 14, 25 / 64, 5 / 8, 39 / 64], compute: () => F(5, 8).mul(F(5, 8)).value() },
  },
  {
    id: 'conditional-probability-004',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'Events $A$ and $B$ both have non-zero probability. Which statement means exactly that $A$ and $B$ are **independent**?',
    options: ['$P(A \\cap B) = 0$', '$P(A \\mid B) = P(B \\mid A)$', '$P(A) + P(B) = 1$', '$P(A \\mid B) = P(A)$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which statement says that $B$ happening makes no difference to the chance of $A$?',
      solution:
        '**Independent** means that one event has no effect on the chance of the other.\n\n' +
        '$P(A \\mid B)$ is the chance of $A$ once we know $B$ has happened. $P(A)$ is the chance of $A$ with no extra information.\n\n' +
        'If knowing $B$ makes no difference, those two numbers are equal: $P(A \\mid B) = P(A)$.',
      conclusion: 'This says knowing $B$ doesn\'t change the chance of $A$, so the answer is $P(A \\mid B) = P(A)$.',
      whyWrong: [
        'This describes **mutually exclusive** events, which is a different idea. With non-zero probabilities, mutually exclusive events are dependent: if $B$ happens, $A$ becomes impossible.',
        'Both conditional probabilities have the same top, $P(A \\cap B)$, so this only forces the bottoms to match: the two events have **equal probabilities** (or never happen together). Events with equal probabilities need not be independent.',
        'This is only about the sizes of the two probabilities (as for an event and its complement), not about whether one event affects the other.',
        null,
      ],
      keyIdea: 'Independence has two matching tests: $P(A \\mid B) = P(A)$, or $P(A \\cap B) = P(A) \\times P(B)$, where $P(A \\cap B)$ is the chance both happen. If $P(A \\cap B) = 0$, they can\'t both happen. That is called mutually exclusive, a different idea.',
    },
  },
  {
    id: 'conditional-probability-005',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'It rains on a given day with probability $0.3$. If it rains, Omar is late with probability $0.4$; if not, he is late with probability $0.1$. What is the probability that it rains **and** Omar is late?',
    options: ['$0.4$', '$0.12$', '$0.7$', '$0.19$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How likely is it that it rains and Omar is late on the same day?',
      solution:
        'Think of the day as two stages: first the weather, then whether Omar is late. We want the path rain, then late.\n\n' +
        'The chance of rain is $0.3$. The $0.4$ is the chance he is late **given** rain, so it applies on rainy days. The $0.1$ is for dry days, so we don\'t need it.\n\n' +
        'For "and" along a path, multiply: $P(\\text{rain and late}) = 0.3 \\times 0.4 = 0.12$.',
      conclusion: 'Rainy days have chance $0.3$, and $0.4$ of those make him late, so the answer is $0.12$.',
      whyWrong: [
        'This is $P(\\text{late} \\mid \\text{rain})$ only. It forgets to multiply by the $0.3$ chance that it rains in the first place.',
        null,
        'This is $0.3 + 0.4$. Along a branch ("and") you multiply; you never add the probabilities on one path.',
        'This is $0.3 \\times 0.4 + 0.7 \\times 0.1$, the **total** probability that Omar is late. The question only wants the rainy-and-late path.',
      ],
      keyIdea: 'Draw a tree. Along a branch, multiply: $P(A \\cap B) = P(A) \\times P(B \\mid A)$, where $\\cap$ means "and" and $\\mid$ means "given". Use only the branch that matches the question. Add branches only when several paths lead to what you want.',
    },
    check: { optionValues: [0.4, 0.12, 0.7, 0.19], compute: () => 0.3 * 0.4 },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'conditional-probability-006',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'Machine A makes 60% of a factory\'s items, and 5% of them are faulty. Machine B makes the other 40%, and 10% of them are faulty. What is the probability that a randomly chosen item is faulty?',
    options: ['$0.075$', '$0.15$', '$0.03$', '$0.07$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Overall, what share of all items are faulty?',
      solution:
        'A faulty item can come from either machine, so there are two paths: machine A then faulty, or machine B then faulty.\n\n' +
        'Write the percentages as decimals and multiply along each path:\n\n| Path | Working | Probability |\n|---|---|---|\n| A, then faulty | $0.6 \\times 0.05$ | $0.03$ |\n| B, then faulty | $0.4 \\times 0.1$ | $0.04$ |\n\n' +
        'Either path gives a faulty item, so add them: $0.03 + 0.04 = 0.07$.',
      conclusion: 'Faulty items from A and from B together make up the answer, $0.07$.',
      whyWrong: [
        'This averages the two fault rates, $\\frac{0.05 + 0.1}{2}$. That would only be right if both machines made the same number of items; A makes more, so its rate must be weighted by $0.6$.',
        'This adds the fault rates $0.05 + 0.1$ without multiplying each by the share of items its machine makes.',
        'This is only the machine A branch, $0.6 \\times 0.05$. Faulty items from machine B must be added too.',
        null,
      ],
      keyIdea: 'When something can happen by several routes, multiply along each route (share of items $\\times$ fault rate), then add all the routes. This is the **law of total probability**.',
    },
    check: { optionValues: [0.075, 0.15, 0.03, 0.07], compute: () => 0.6 * 0.05 + 0.4 * 0.1 },
  },
  {
    id: 'conditional-probability-007',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'Bag 1 contains 3 red and 2 blue balls. Bag 2 contains 1 red and 4 blue balls. A fair coin is tossed to choose a bag, and one ball is taken from that bag. The ball is **red**. What is the probability that it came from Bag 1?',
    options: ['$\\frac{3}{4}$', '$\\frac{3}{10}$', '$\\frac{3}{5}$', '$\\frac{1}{2}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'We already know the ball is red. How likely is it that it came from Bag 1?',
      solution:
        'We know the ball is red, so we only care about the ways of getting red. There are two: Bag 1 then red, or Bag 2 then red.\n\n' +
        'The coin picks each bag with probability $\\frac{1}{2}$. Bag 1 has 3 red out of 5 balls, and Bag 2 has 1 red out of 5. Multiply along each path:\n\n| Path | Working | Probability |\n|---|---|---|\n| Bag 1, then red | $\\frac{1}{2} \\times \\frac{3}{5}$ | $\\frac{3}{10}$ |\n| Bag 2, then red | $\\frac{1}{2} \\times \\frac{1}{5}$ | $\\frac{1}{10}$ |\n\n' +
        'Add the two paths to get the total chance of red: $\\frac{3}{10} + \\frac{1}{10} = \\frac{4}{10}$.\n\n' +
        'Now find what share of that total came from Bag 1: $\\frac{3}{10} \\div \\frac{4}{10} = \\frac{3}{4}$.',
      conclusion: 'Out of every 4 parts of "red", 3 came from Bag 1, so the answer is $\\frac{3}{4}$.',
      whyWrong: [
        null,
        'This is $P(\\text{Bag 1} \\cap R) = \\frac{3}{10}$. It forgets to divide by $P(R) = \\frac{4}{10}$, the probability of the information we were given.',
        'This is $P(R \\mid \\text{Bag 1}) = \\frac{3}{5}$, the reverse conditional. The question gives the colour and asks about the bag.',
        'This is the probability of choosing Bag 1 before seeing the ball. Seeing a red ball is evidence for Bag 1 (it has more red), so the probability must go up.',
      ],
      keyIdea: 'When a question tells you what happened and asks where it came from: list every path to that result, find each path\'s probability, then divide the path you want by the total of all the paths.',
    },
    check: {
      optionValues: [3 / 4, 3 / 10, 3 / 5, 1 / 2],
      compute: () => {
        const b1 = F(1, 2).mul(F(3, 5));
        const b2 = F(1, 2).mul(F(1, 5));
        return b1.div(b1.add(b2)).value();
      },
    },
  },
  {
    id: 'conditional-probability-008',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'A box contains 4 red and 6 blue pens. Two pens are taken at random **without replacement**. What is the probability that the two pens are **different colours**?',
    options: ['$\\frac{4}{15}$', '$\\frac{12}{25}$', '$\\frac{8}{15}$', '$\\frac{6}{25}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How likely is one red and one blue pen when two are taken without putting back?',
      solution:
        'Two different colours can happen in two orders: red then blue, or blue then red.\n\n' +
        'There are 10 pens at first and 9 after one is taken. Multiply along each order:\n\n| Order | First pen | Second pen | Probability |\n|---|---|---|---|\n| Red, then blue | $\\frac{4}{10}$ | $\\frac{6}{9}$ | $\\frac{24}{90}$ |\n| Blue, then red | $\\frac{6}{10}$ | $\\frac{4}{9}$ | $\\frac{24}{90}$ |\n\n' +
        'Either order works, so add: $\\frac{24}{90} + \\frac{24}{90} = \\frac{48}{90}$.\n\n' +
        'Simplify by dividing top and bottom by 6: $\\frac{48}{90} = \\frac{8}{15}$.',
      conclusion: 'The two orders together give $\\frac{48}{90}$, so the answer is $\\frac{8}{15}$.',
      whyWrong: [
        'This is only the red-then-blue path, $\\frac{24}{90}$. Blue-then-red also gives two different colours and must be added.',
        'This is $2 \\times \\frac{4}{10} \\times \\frac{6}{10}$, which treats the draws as **with** replacement. After the first pen is taken only 9 remain.',
        null,
        'This is $\\frac{4}{10} \\times \\frac{6}{10}$: it uses replacement **and** counts only one order.',
      ],
      keyIdea: 'For "different colours" without replacement, list each order, multiply along it with the bottom number dropping by one, then add. You can also use 1 minus the chance of both being the same colour.',
    },
    check: {
      optionValues: [4 / 15, 12 / 25, 8 / 15, 6 / 25],
      compute: () => F(4, 10).mul(F(6, 9)).add(F(6, 10).mul(F(4, 9))).value(),
    },
  },
  {
    id: 'conditional-probability-009',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'The incomplete table shows the test results of 100 students from two streams. A student who **failed** is chosen at random. What is the probability that this student is from the Arts stream?',
    table: {
      headers: ['Stream', 'Passed', 'Failed', 'Total'],
      rows: [
        ['Science', 48, '?', 60],
        ['Arts', '?', 13, 40],
        ['Total', 75, '?', 100],
      ],
    },
    options: ['$\\frac{13}{40}$', '$\\frac{13}{100}$', '$\\frac{2}{5}$', '$\\frac{13}{25}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Among the students who failed, what fraction are from Arts?',
      solution:
        'The student is chosen from those who failed, so the whole group is the "Failed" column. Its total is missing, so we need to find it.\n\n' +
        '100 students took the test and 75 passed, so $100 - 75 = 25$ failed.\n\n' +
        'The Arts row of the Failed column shows 13. As a check, Science failed is $60 - 48 = 12$, and $12 + 13 = 25$, which matches.\n\n' +
        'Put the Arts students who failed on top and all who failed on the bottom: $\\frac{13}{25}$.',
      conclusion: '13 of the 25 students who failed are from Arts, so the answer is $\\frac{13}{25}$.',
      whyWrong: [
        'This is $\\frac{13}{40} = P(\\text{failed} \\mid \\text{Arts})$: it divides by the Arts total instead of the failed total, reversing the condition.',
        'This is $\\frac{13}{100} = P(\\text{Arts and failed})$: it divides by all 100 students instead of only those who failed.',
        'This is $\\frac{40}{100} = P(\\text{Arts})$ for any student, ignoring the information that the student failed.',
        null,
      ],
      keyIdea: 'Fill in the blanks of a two-way table first, since each row and column must add up to its total. Then divide the cell you want by the total of the "given" group.',
    },
    check: {
      optionValues: [13 / 40, 13 / 100, 2 / 5, 13 / 25],
      compute: () => {
        const sciTotal = 60;
        const sciPassed = 48;
        const artsFailed = 13;
        const totalFailed = sciTotal - sciPassed + artsFailed;
        return F(artsFailed, totalFailed).value();
      },
    },
  },
  {
    id: 'conditional-probability-010',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'For two events, $P(A) = 0.5$, $P(B) = 0.4$ and $P(A \\cup B) = 0.6$. What is $P(A \\mid B)$?',
    options: ['$0.3$', '$0.75$', '$0.6$', '$0.5$'],
    correctIndex: 1,
    markScheme: {
      asking: 'If $B$ has happened, how likely is $A$, when the chance of both isn\'t given?',
      solution:
        '$P(A \\mid B)$ means the chance of $A$ given that $B$ has happened. The formula is $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$, where $P(A \\cap B)$ is the chance of both.\n\n' +
        'We need $P(A \\cap B)$. $P(A \\cup B)$ is the chance of at least one of them. Get it from the addition rule, $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, by substituting: $0.6 = 0.5 + 0.4 - P(A \\cap B)$.\n\n' +
        'So $0.6 = 0.9 - P(A \\cap B)$, which rearranges to $P(A \\cap B) = 0.9 - 0.6 = 0.3$.\n\n' +
        'Now use the formula, dividing by $P(B) = 0.4$: $P(A \\mid B) = \\frac{0.3}{0.4} = 0.75$.',
      conclusion: 'Both events make up $0.3$ out of the $0.4$ for $B$, so the answer is $0.75$.',
      whyWrong: [
        'This is $P(A \\cap B)$, the chance of both. It stops there and forgets to divide by $0.4$, the probability of $B$.',
        null,
        'This is $\\frac{0.3}{0.5} = P(B \\mid A)$: it divides by $0.5$ (the probability of $A$) instead of $0.4$, reversing the condition.',
        'This assumes $A$ and $B$ are independent, so that the condition makes no difference and the answer is just the $0.5$ for $A$. They are not independent: $0.5 \\times 0.4 = 0.2$, but $P(A \\cap B) = 0.3$.',
      ],
      keyIdea: 'If the overlap isn\'t given, find it with $P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$. Then divide it by the probability of the event after the bar.',
    },
    check: {
      optionValues: [0.3, 0.75, 0.6, 0.5],
      compute: () => {
        const pA = F(5, 10);
        const pB = F(4, 10);
        const pUnion = F(6, 10);
        return pA.add(pB).sub(pUnion).div(pB).value();
      },
    },
  },
  {
    id: 'conditional-probability-011',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'A disease affects 1% of a population. A test is positive for 90% of people who have the disease, and it is also (wrongly) positive for 10% of people who do not have it. A randomly chosen person tests positive. What is the probability that they actually have the disease?',
    options: ['$\\frac{1}{12}$', '$\\frac{9}{10}$', '$\\frac{1}{11}$', '$\\frac{9}{1000}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'If someone tests positive, how likely is it that they really have the disease?',
      solution:
        'Percentages are easier to follow as people, so imagine 1000 people. The disease affects 1%, so $1000 \\times 0.01 = 10$ people have it, and the other $1000 - 10 = 990$ don\'t.\n\n' +
        'Of the 10 who have it, 90% test positive: $10 \\times 0.9 = 9$ people. These are correct results.\n\n' +
        'Of the 990 who don\'t have it, 10% wrongly test positive: $990 \\times 0.1 = 99$ people. These are **false positives**, meaning positive results for healthy people.\n\n' +
        'So the total testing positive is $9 + 99 = 108$ people.\n\n' +
        'Our person is one of those 108, and 9 of them have the disease. Simplify by dividing top and bottom by 9: $\\frac{9}{108} = \\frac{1}{12}$.',
      conclusion: 'Only 9 of the 108 positive results are people with the disease, so the answer is $\\frac{1}{12}$.',
      whyWrong: [
        null,
        'This is $P(+ \\mid D)$, the chance an ill person tests positive. The question asks the reverse, $P(D \\mid +)$; because the disease is rare, most positives are false positives.',
        'This is $\\frac{9}{99}$: true positives divided by false positives. You must divide by **all** positives, $9 + 99 = 108$.',
        'This is $0.01 \\times 0.9 = P(D \\cap +)$, the chance of being ill **and** testing positive. It forgets to divide by $P(+) = 0.108$.',
      ],
      keyIdea: 'For a test question, imagine a round number of people such as 1000. Split them into those who have it and those who don\'t, find the positives in each group, then divide the true positives by all the positives.',
    },
    check: {
      optionValues: [1 / 12, 9 / 10, 1 / 11, 9 / 1000],
      compute: () => {
        const tp = F(1, 100).mul(F(9, 10));
        const fp = F(99, 100).mul(F(1, 10));
        return tp.div(tp.add(fp)).value();
      },
    },
  },
  {
    id: 'conditional-probability-012',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'Two fair six-sided dice are rolled. Given that the **sum is 8**, what is the probability that at least one die shows a 6?',
    options: ['$\\frac{1}{18}$', '$\\frac{2}{5}$', '$\\frac{11}{36}$', '$\\frac{1}{3}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'When the total is 8, how likely is it that a 6 is showing?',
      solution:
        'We are told the sum is 8, so ignore every other roll. Our whole group is only the ordered pairs (first die, second die) that add up to 8.\n\n' +
        'List them by going through the first die: $(2,6)$, $(3,5)$, $(4,4)$, $(5,3)$, $(6,2)$. That is 5 equally likely pairs. A first die of 1 would need a 7, so it can\'t work.\n\n' +
        'Now see which pairs contain a 6: $(2,6)$ and $(6,2)$. That is 2 pairs.\n\n' +
        'Divide the pairs we want by our whole group: $\\frac{2}{5}$.',
      conclusion: '2 of the 5 pairs that add up to 8 contain a 6, so the answer is $\\frac{2}{5}$.',
      whyWrong: [
        'This is $\\frac{2}{36}$: it counts the right outcomes but divides by all 36 rolls. Given the sum is 8, only 5 outcomes are possible.',
        null,
        'This is $P(\\text{at least one 6})$ for any roll, $\\frac{11}{36}$. It ignores the information that the sum is 8.',
        'This lists only the unordered pairs $\\{2,6\\}, \\{3,5\\}, \\{4,4\\}$ and treats them as equally likely. But $(2,6)$ and $(6,2)$ are different outcomes, while $(4,4)$ happens only one way.',
      ],
      keyIdea: 'For "given that" with dice or cards, list only the outcomes that fit the given fact. That shorter list is your new total. Then count how many of those also fit what is asked.',
    },
    check: {
      optionValues: [1 / 18, 2 / 5, 11 / 36, 1 / 3],
      compute: () => {
        let cond = 0;
        let both = 0;
        for (let a = 1; a <= 6; a++)
          for (let b = 1; b <= 6; b++)
            if (a + b === 8) {
              cond++;
              if (a === 6 || b === 6) both++;
            }
        return F(both, cond).value();
      },
    },
  },
  {
    id: 'conditional-probability-013',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'A pack of 12 light bulbs contains 4 faulty bulbs. Two bulbs are chosen at random **without replacement**. What is the probability that **at least one** of them is faulty?',
    options: ['$\\frac{5}{9}$', '$\\frac{1}{11}$', '$\\frac{19}{33}$', '$\\frac{16}{33}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How likely is it that one or both of the chosen bulbs is faulty?',
      solution:
        '"At least one faulty" covers two cases. The opposite is just one case: both work. So $P(\\text{at least one faulty}) = 1 - P(\\text{both work})$.\n\n' +
        'The number of working bulbs is $12 - 4 = 8$. So the first bulb works with probability $\\frac{8}{12}$.\n\n' +
        '**Without replacement** means the first bulb is not put back. If it worked, 7 working bulbs are left out of 11, so the second works with probability $\\frac{7}{11}$.\n\n' +
        'Multiply, then simplify by dividing top and bottom by 4: $P(\\text{both work}) = \\frac{8}{12} \\times \\frac{7}{11} = \\frac{56}{132} = \\frac{14}{33}$.\n\n' +
        'Subtract from 1, writing 1 as $\\frac{33}{33}$: $\\frac{33}{33} - \\frac{14}{33} = \\frac{19}{33}$.',
      conclusion: 'Both working has chance $\\frac{14}{33}$, and every other result has a faulty bulb, so the answer is $\\frac{19}{33}$.',
      whyWrong: [
        'This is $1 - \\left(\\frac{8}{12}\\right)^2$, which treats the draws as **with** replacement. After one working bulb is taken, 7 of the remaining 11 work.',
        'This is $\\frac{4}{12} \\times \\frac{3}{11}$, the probability that **both** are faulty. "At least one" also includes exactly one faulty.',
        null,
        'This is the probability of **exactly one** faulty bulb. "At least one" must also include the case where both are faulty.',
      ],
      keyIdea: 'For "at least one" without replacement, find the chance of none by multiplying fractions whose top and bottom each drop by one per draw. Then subtract that from 1.',
    },
    check: {
      optionValues: [5 / 9, 1 / 11, 19 / 33, 16 / 33],
      compute: () => {
        const n = 12;
        const faulty = 4;
        const good = n - faulty;
        return F(1).sub(F(good, n).mul(F(good - 1, n - 1))).value();
      },
    },
  },
  {
    id: 'conditional-probability-015',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'Machine A makes 50% of a workshop\'s parts, B makes 30% and C makes 20%. The fault rates are 2% for A, 3% for B and 5% for C. A randomly chosen part is **faulty**. What is the probability that C made it?',
    options: ['$\\frac{1}{2}$', '$\\frac{1}{100}$', '$\\frac{10}{29}$', '$\\frac{1}{20}$'],
    correctIndex: 2,
    markScheme: {
      asking: 'If a part is faulty, how likely is it that machine C made it?',
      solution:
        'A faulty part can come from any of the three machines. For each one, multiply its share of the parts by its fault rate:\n\n| Machine | Working | Made here and faulty |\n|---|---|---|\n| A | $0.5 \\times 0.02$ | $0.01$ |\n| B | $0.3 \\times 0.03$ | $0.009$ |\n| C | $0.2 \\times 0.05$ | $0.01$ |\n\n' +
        'Add these to get the total chance of a faulty part: $0.01 + 0.009 + 0.01 = 0.029$.\n\n' +
        'We know the part is faulty, so that $0.029$ is our whole group now. C\'s share of it is $\\frac{0.01}{0.029}$.\n\n' +
        'Multiply top and bottom by 1000 to clear the decimals: $\\frac{0.01 \\times 1000}{0.029 \\times 1000} = \\frac{10}{29}$.',
      conclusion: 'C accounts for $0.01$ out of a faulty total of $0.029$, so the answer is $\\frac{10}{29}$.',
      whyWrong: [
        'This is $\\frac{5}{2 + 3 + 5}$: it compares only the fault rates and ignores how many parts each machine makes. A makes more than twice as many parts as C, so the rates must be weighted by the shares.',
        'This is $0.2 \\times 0.05 = P(C \\cap \\text{faulty})$. It forgets to divide by the total probability of a faulty part, $0.029$.',
        null,
        'This is $P(\\text{faulty} \\mid C) = 0.05$, the reverse conditional. We know the part is faulty and want the machine.',
      ],
      keyIdea: 'When told the result and asked for the source, make a table of share $\\times$ rate for each source. Add the column for the total, then divide the source you want by that total. This is **Bayes\' rule**.',
    },
    check: {
      optionValues: [1 / 2, 1 / 100, 10 / 29, 1 / 20],
      compute: () => {
        const share = [F(50, 100), F(30, 100), F(20, 100)];
        const fault = [F(2, 100), F(3, 100), F(5, 100)];
        const branches = share.map((s, i) => s.mul(fault[i]));
        const total = branches.reduce((a, b) => a.add(b), F(0));
        return branches[2].div(total).value();
      },
    },
  },
  {
    id: 'conditional-probability-019',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'What does $P(A \\mid B)$ mean?',
    options: ['The probability of $A$, given that $B$ has happened', 'The probability of $B$, given that $A$ has happened', 'The probability that $A$ and $B$ both happen', 'The probability of $A$ divided by the probability of $B$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the bar in $P(A \\mid B)$ mean?',
      solution:
        'The bar $\\mid$ is read as "given", so $P(A \\mid B)$ is read "the probability of $A$ given $B$".\n\n' +
        'The event after the bar is what we already know has happened. The event before it is what we want the chance of. For example, $P(\\text{late} \\mid \\text{rain})$ is the chance of being late on a day we know it rained.',
      conclusion: '$B$ comes after the bar, so it is already known: The probability of $A$, given that $B$ has happened.',
      whyWrong: [
        null,
        'This is $P(B \\mid A)$, the reverse conditional. The event after the bar is the one already known.',
        'This is $P(A \\cap B)$. The conditional probability restricts attention to the cases where $B$ happened.',
        'The bar means "given", not division. The formula divides the overlap $P(A \\cap B)$ by the probability of $B$.',
      ],
      keyIdea: 'Read the bar out loud as "given". Whatever comes after it has already happened. So $P(A \\mid B)$ and $P(B \\mid A)$ are different questions, usually with different answers.',
    },
  },
  {
    id: 'conditional-probability-020',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'Which formula gives $P(A \\mid B)$, when $P(B) > 0$?',
    options: ['$\\frac{P(A \\cap B)}{P(B)}$', '$\\frac{P(A \\cap B)}{P(A)}$', '$P(A) \\times P(B)$', '$\\frac{P(A)}{P(B)}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the formula for the chance of $A$ once we know $B$ has happened?',
      solution:
        '$P(A \\mid B)$ means the chance of $A$ given that $B$ has happened. Since $B$ has happened, $B$ is now our whole group, so $P(B)$ goes on the bottom.\n\n' +
        'The only part of $A$ still possible is the part inside $B$, where both happen. That is $P(A \\cap B)$, and it goes on top.',
      conclusion: 'Both events on top and the known event on the bottom gives $\\frac{P(A \\cap B)}{P(B)}$.',
      whyWrong: [
        null,
        'This is $P(B \\mid A)$: it divides by the wrong event. Divide by the event after the bar.',
        'This equals $P(A \\cap B)$ only for independent events, and it is not a conditional probability.',
        'The top must be the overlap $P(A \\cap B)$, not the whole probability of $A$.',
      ],
      keyIdea: 'The event after the bar goes on the bottom, and the overlap $P(A \\cap B)$ goes on top. In a table, this is the cell for both divided by the total of the known group.',
    },
    check: {
      // 100 equally likely outcomes: 30 in A, 40 in B, 12 in both
      optionValues: [12 / 40, 12 / 30, (30 / 100) * (40 / 100), 30 / 40],
      compute: () => {
        const inA = (x: number) => x < 30;
        const inB = (x: number) => x >= 18 && x < 58;
        const all = Array.from({ length: 100 }, (_, i) => i);
        return all.filter((x) => inA(x) && inB(x)).length / all.filter(inB).length;
      },
    },
  },
  {
    id: 'conditional-probability-021',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'Events $A$ and $B$ are independent. Which expression equals $P(A \\cap B)$?',
    options: ['$P(A) \\times P(B)$', '$P(A) + P(B)$', '$0$', '$\\frac{P(A)}{P(B)}$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How do we find the chance of both $A$ and $B$ when they don\'t affect each other?',
      solution:
        '$P(A \\cap B)$ is the chance that both happen. **Independent** means one doesn\'t change the chance of the other.\n\n' +
        '$A$ happens a share $P(A)$ of the time. Within that, $B$ still happens a share $P(B)$ of the time. A share of a share means multiplying. For example, heads and a six has chance $\\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}$.',
      conclusion: 'A share of a share is a product, so the answer is $P(A) \\times P(B)$.',
      whyWrong: [
        null,
        'Adding is for "or" with mutually exclusive events. "And" with independent events multiplies.',
        'This is true for **mutually exclusive** events, which is a different idea.',
        'Dividing gives no standard probability. For independent events the probabilities multiply.',
      ],
      keyIdea: 'Independent "and" means multiply: $P(A \\cap B) = P(A) \\times P(B)$. If the events are dependent, use $P(A) \\times P(B \\mid A)$, where $P(B \\mid A)$ is the chance of $B$ given $A$. If they are mutually exclusive (they can\'t both happen), the answer is 0.',
    },
  },];
