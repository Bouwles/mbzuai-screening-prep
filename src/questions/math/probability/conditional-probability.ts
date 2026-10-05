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
      solution:
        'Nothing is known about the first sweet, so split on its colour (law of total probability).\n\n' +
        '- First green, then green: $\\frac{7}{10} \\times \\frac{6}{9} = \\frac{42}{90}$\n' +
        '- First yellow, then green: $\\frac{3}{10} \\times \\frac{7}{9} = \\frac{21}{90}$\n\n' +
        'Add the two branches: $\\frac{42}{90} + \\frac{21}{90} = \\frac{63}{90} = \\frac{7}{10}$.\n\n' +
        'Shortcut: before anything is revealed, every position is equally likely to hold any sweet, so $P(\\text{2nd green}) = P(\\text{1st green}) = \\frac{7}{10}$.',
      whyWrong: [
        null,
        'This is $\\frac{6}{9}$, which assumes the first sweet was green. We are not told the colour of the first sweet, so the yellow-first branch ($\\frac{3}{10} \\times \\frac{7}{9}$) must be included too.',
        'This is $\\frac{7}{10} \\times \\frac{6}{9} = \\frac{42}{90}$, the probability that **both** sweets are green, not just the second.',
        'This is $\\frac{7}{10} \\times \\frac{7}{10}$, the chance that both sweets are green **with** replacement - the wrong event and the wrong method.',
      ],
      keyIdea: 'Without any information about the first draw, the second item is just as likely to be green as the first: add the probabilities of every branch that ends in green.',
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
      solution:
        'The definition of conditional probability is\n\n' +
        '$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$\n\n' +
        '"Given $B$" means we only look inside $B$, so we divide by $P(B)$.\n\n' +
        'Substitute: $P(A \\mid B) = \\frac{0.12}{0.4} = 0.3$.',
      whyWrong: [
        null,
        'This is $0.12 \\times 0.4$: it multiplies by $0.4$, the probability of $B$, instead of dividing by it.',
        'This is $0.12 + 0.4$: adding probabilities is used for "or" with mutually exclusive events, not for conditional probability.',
        'This is $0.4 - 0.12$, which is $P(B \\text{ and not } A)$, not the probability of $A$ given $B$.',
      ],
      keyIdea: 'Conditional probability is the joint probability divided by the probability of the condition: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$.',
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
      solution:
        'The student is chosen **from the chess players**, so the sample space shrinks to the "Plays chess" column: $6 + 14 = 20$ students.\n\n' +
        'Of these 20, the number in Year 13 is 14.\n\n' +
        '$$P(\\text{Year 13} \\mid \\text{chess}) = \\frac{14}{20} = \\frac{7}{10}$$',
      whyWrong: [
        'This is $\\frac{14}{50}$: it divides by all 50 students, giving $P(\\text{Year 13 and chess})$. The condition means you divide by the 20 chess players only.',
        'This is $\\frac{14}{30}$, which is $P(\\text{chess} \\mid \\text{Year 13})$: the condition has been reversed (dividing by the Year 13 total instead of the chess total).',
        null,
        'This is $\\frac{30}{50}$, the probability of being in Year 13 for **any** student; it ignores the information that the student plays chess.',
      ],
      keyIdea: 'In a two-way table, "given" tells you which row or column total to divide by.',
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
    stem: 'A bag contains 3 red and 5 green counters. A counter is taken at random, its colour is noted and it is **put back**. A second counter is then taken. What is the probability that **both** counters are green?',
    options: ['$\\frac{5}{14}$', '$\\frac{25}{64}$', '$\\frac{5}{8}$', '$\\frac{39}{64}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'There are $3 + 5 = 8$ counters, 5 of them green.\n\n' +
        '- First green: $\\frac{5}{8}$\n' +
        '- The counter is put back, so the bag is the same again. Second green: $\\frac{5}{8}$\n\n' +
        'With replacement the draws are independent, so multiply:\n\n' +
        '$$\\frac{5}{8} \\times \\frac{5}{8} = \\frac{25}{64}$$',
      whyWrong: [
        'This is $\\frac{5}{8} \\times \\frac{4}{7}$, the answer **without** replacement. Here the counter is put back, so the second draw is still 5 green out of 8.',
        null,
        'This is only the probability that the **first** counter is green; the question needs both draws to be green.',
        'This is $1 - \\frac{25}{64}$, the probability that the counters are **not** both green.',
      ],
      keyIdea: 'With replacement the bag resets, so the draws are independent and you multiply the same probability twice.',
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
      solution:
        'Independent means that knowing $B$ happened does **not change** the probability of $A$:\n\n' +
        '$$P(A \\mid B) = P(A)$$\n\n' +
        'This is equivalent to the multiplication rule $P(A \\cap B) = P(A) \\times P(B)$.\n\n' +
        'Check the others:\n\n' +
        '- $P(A \\cap B) = 0$ means $A$ and $B$ cannot happen together (mutually exclusive). Then knowing $B$ happened makes $A$ impossible, so they are actually **dependent**.\n' +
        '- $P(A \\mid B) = P(B \\mid A)$ only says $P(A) = P(B)$ (when they can happen together); it says nothing about independence.\n' +
        '- $P(A) + P(B) = 1$ is just a statement about the sizes of the two probabilities.',
      whyWrong: [
        'This describes **mutually exclusive** events, which is a different idea. With non-zero probabilities, mutually exclusive events are dependent: if $B$ happens, $A$ becomes impossible.',
        'Both conditional probabilities have the same top, $P(A \\cap B)$, so this only forces the bottoms to match: the two events have **equal probabilities** (or never happen together). Events with equal probabilities need not be independent.',
        'This is only about the sizes of the two probabilities (as for an event and its complement), not about whether one event affects the other.',
        null,
      ],
      keyIdea: 'Independent means the condition makes no difference: $P(A \\mid B) = P(A)$, equivalently $P(A \\cap B) = P(A)P(B)$.',
    },
  },
  {
    id: 'conditional-probability-005',
    subtopic: 'conditional-probability',
    difficulty: 'foundation',
    stem: 'The probability that it rains on a given day is $0.3$. If it rains, the probability that Omar is late for school is $0.4$. If it does not rain, the probability that he is late is $0.1$. What is the probability that it rains **and** Omar is late?',
    options: ['$0.4$', '$0.12$', '$0.7$', '$0.19$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Draw a tree: first branch rain ($0.3$) / no rain ($0.7$), then late / not late.\n\n' +
        'The path "rain, then late" has probabilities $0.3$ and $0.4$ along it. Multiply along the branches:\n\n' +
        '$$P(\\text{rain} \\cap \\text{late}) = P(\\text{rain}) \\times P(\\text{late} \\mid \\text{rain}) = 0.3 \\times 0.4 = 0.12$$\n\n' +
        'The no-rain branch is not needed, because the question asks for rain **and** late.',
      whyWrong: [
        'This is $P(\\text{late} \\mid \\text{rain})$ only. It forgets to multiply by the $0.3$ chance that it rains in the first place.',
        null,
        'This is $0.3 + 0.4$. Along a branch ("and") you multiply; you never add the probabilities on one path.',
        'This is $0.3 \\times 0.4 + 0.7 \\times 0.1$, the **total** probability that Omar is late. The question only wants the rainy-and-late path.',
      ],
      keyIdea: 'Multiply along a tree path: $P(A \\cap B) = P(A) \\times P(B \\mid A)$.',
    },
    check: { optionValues: [0.4, 0.12, 0.7, 0.19], compute: () => 0.3 * 0.4 },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'conditional-probability-006',
    subtopic: 'conditional-probability',
    difficulty: 'exam',
    stem: 'A factory has two machines. Machine A makes 60% of the items and 5% of its items are faulty. Machine B makes the other 40% and 10% of its items are faulty. An item is chosen at random. What is the probability that it is faulty?',
    options: ['$0.075$', '$0.15$', '$0.03$', '$0.07$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use the law of total probability: add the "faulty" branch from each machine.\n\n' +
        '- From A and faulty: $0.6 \\times 0.05 = 0.03$\n' +
        '- From B and faulty: $0.4 \\times 0.1 = 0.04$\n\n' +
        '$$P(\\text{faulty}) = 0.03 + 0.04 = 0.07$$',
      whyWrong: [
        'This averages the two fault rates, $\\frac{0.05 + 0.1}{2}$. That would only be right if both machines made the same number of items; A makes more, so its rate must be weighted by $0.6$.',
        'This adds the fault rates $0.05 + 0.1$ without multiplying each by the share of items its machine makes.',
        'This is only the machine A branch, $0.6 \\times 0.05$. Faulty items from machine B must be added too.',
        null,
      ],
      keyIdea: 'Law of total probability: $P(F) = P(A)P(F \\mid A) + P(B)P(F \\mid B)$ - multiply along each branch, then add the branches.',
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
      solution:
        'Step 1 - the two "red" branches of the tree:\n\n' +
        '- Bag 1 and red: $\\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}$\n' +
        '- Bag 2 and red: $\\frac{1}{2} \\times \\frac{1}{5} = \\frac{1}{10}$\n\n' +
        'Step 2 - total probability of red: $P(R) = \\frac{3}{10} + \\frac{1}{10} = \\frac{4}{10}$.\n\n' +
        'Step 3 - Bayes: of all the ways to get red, what fraction came from Bag 1?\n\n' +
        '$$P(\\text{Bag 1} \\mid R) = \\frac{P(\\text{Bag 1} \\cap R)}{P(R)} = \\frac{\\frac{3}{10}}{\\frac{4}{10}} = \\frac{3}{4}$$',
      whyWrong: [
        null,
        'This is $P(\\text{Bag 1} \\cap R) = \\frac{3}{10}$. It forgets to divide by $P(R) = \\frac{4}{10}$, the probability of the information we were given.',
        'This is $P(R \\mid \\text{Bag 1}) = \\frac{3}{5}$, the reverse conditional. The question gives the colour and asks about the bag.',
        'This is the probability of choosing Bag 1 before seeing the ball. Seeing a red ball is evidence for Bag 1 (it has more red), so the probability must go up.',
      ],
      keyIdea: 'Bayes: $P(\\text{cause} \\mid \\text{evidence}) = \\frac{\\text{that branch}}{\\text{sum of all branches giving the evidence}}$.',
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
      solution:
        'There are 10 pens. "Different colours" can happen in **two orders**.\n\n' +
        '- Red then blue: $\\frac{4}{10} \\times \\frac{6}{9} = \\frac{24}{90}$\n' +
        '- Blue then red: $\\frac{6}{10} \\times \\frac{4}{9} = \\frac{24}{90}$\n\n' +
        'Add the two paths: $\\frac{24}{90} + \\frac{24}{90} = \\frac{48}{90} = \\frac{8}{15}$.\n\n' +
        'Check with the complement: $P(\\text{same}) = \\frac{4}{10} \\times \\frac{3}{9} + \\frac{6}{10} \\times \\frac{5}{9} = \\frac{12}{90} + \\frac{30}{90} = \\frac{42}{90}$, and $1 - \\frac{42}{90} = \\frac{48}{90}$.',
      whyWrong: [
        'This is only the red-then-blue path, $\\frac{24}{90}$. Blue-then-red also gives two different colours and must be added.',
        'This is $2 \\times \\frac{4}{10} \\times \\frac{6}{10}$, which treats the draws as **with** replacement. After the first pen is taken only 9 remain.',
        null,
        'This is $\\frac{4}{10} \\times \\frac{6}{10}$: it uses replacement **and** counts only one order.',
      ],
      keyIdea: 'For "one of each", add every order; without replacement the second fraction has one fewer in the denominator.',
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
      solution:
        'Step 1 - fill in the gaps.\n\n' +
        '- Science failed: $60 - 48 = 12$\n' +
        '- Arts passed: $40 - 13 = 27$ (check: $48 + 27 = 75$)\n' +
        '- Total failed: $12 + 13 = 25$ (check: $75 + 25 = 100$)\n\n' +
        'Step 2 - "a student who failed" means the sample space is the 25 students who failed. Of these, 13 are Arts.\n\n' +
        '$$P(\\text{Arts} \\mid \\text{failed}) = \\frac{13}{25}$$',
      whyWrong: [
        'This is $\\frac{13}{40} = P(\\text{failed} \\mid \\text{Arts})$: it divides by the Arts total instead of the failed total, reversing the condition.',
        'This is $\\frac{13}{100} = P(\\text{Arts and failed})$: it divides by all 100 students instead of only those who failed.',
        'This is $\\frac{40}{100} = P(\\text{Arts})$ for any student, ignoring the information that the student failed.',
        null,
      ],
      keyIdea: 'Complete the table first, then divide the cell by the total of the group you are told about.',
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
      solution:
        'Step 1 - find the overlap with the addition rule $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$:\n\n' +
        '$$0.6 = 0.5 + 0.4 - P(A \\cap B) \\quad\\Rightarrow\\quad P(A \\cap B) = 0.3$$\n\n' +
        'Step 2 - conditional probability:\n\n' +
        '$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.3}{0.4} = 0.75$$',
      whyWrong: [
        'This is $P(A \\cap B)$. It stops after Step 1 and forgets to divide by $0.4$, the probability of $B$.',
        null,
        'This is $\\frac{0.3}{0.5} = P(B \\mid A)$: it divides by $0.5$ (the probability of $A$) instead of $0.4$, reversing the condition.',
        'This assumes $A$ and $B$ are independent, so that the condition makes no difference and the answer is just the $0.5$ for $A$. They are not independent: $0.5 \\times 0.4 = 0.2$, but $P(A \\cap B) = 0.3$.',
      ],
      keyIdea: 'Use the addition rule to get $P(A \\cap B)$, then divide by the probability of the condition.',
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
      solution:
        'Imagine 1000 people (natural frequencies).\n\n' +
        '- Have the disease: 1% of 1000 = 10. Of these, 90% test positive: **9** true positives.\n' +
        '- Do not have it: 990. Of these, 10% test positive: **99** false positives.\n\n' +
        'Total positives: $9 + 99 = 108$. Only 9 of them are ill:\n\n' +
        '$$P(D \\mid +) = \\frac{9}{108} = \\frac{1}{12}$$\n\n' +
        'With the formula: $P(D \\mid +) = \\frac{0.01 \\times 0.9}{0.01 \\times 0.9 + 0.99 \\times 0.1} = \\frac{0.009}{0.108} = \\frac{1}{12}$.',
      whyWrong: [
        null,
        'This is $P(+ \\mid D)$, the chance an ill person tests positive. The question asks the reverse, $P(D \\mid +)$; because the disease is rare, most positives are false positives.',
        'This is $\\frac{9}{99}$: true positives divided by false positives. You must divide by **all** positives, $9 + 99 = 108$.',
        'This is $0.01 \\times 0.9 = P(D \\cap +)$, the chance of being ill **and** testing positive. It forgets to divide by $P(+) = 0.108$.',
      ],
      keyIdea: 'For a rare condition, $P(D \\mid +)$ is far smaller than $P(+ \\mid D)$: divide the true positives by all positives.',
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
      solution:
        'The condition "sum is 8" shrinks the sample space. List the ordered outcomes (first die, second die) with sum 8:\n\n' +
        '$(2,6), (3,5), (4,4), (5,3), (6,2)$ - that is **5** equally likely outcomes.\n\n' +
        'Those containing a 6: $(2,6)$ and $(6,2)$ - **2** outcomes.\n\n' +
        '$$P(\\text{at least one 6} \\mid \\text{sum } 8) = \\frac{2}{5}$$',
      whyWrong: [
        'This is $\\frac{2}{36}$: it counts the right outcomes but divides by all 36 rolls. Given the sum is 8, only 5 outcomes are possible.',
        null,
        'This is $P(\\text{at least one 6})$ for any roll, $\\frac{11}{36}$. It ignores the information that the sum is 8.',
        'This lists only the unordered pairs $\\{2,6\\}, \\{3,5\\}, \\{4,4\\}$ and treats them as equally likely. But $(2,6)$ and $(6,2)$ are different outcomes, while $(4,4)$ happens only one way.',
      ],
      keyIdea: 'Conditioning on an event means counting only inside that event: favourable outcomes in the condition divided by all outcomes in the condition.',
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
      solution:
        'Use the complement: "at least one faulty" is the opposite of "both working".\n\n' +
        'There are $12 - 4 = 8$ working bulbs.\n\n' +
        '$$P(\\text{both working}) = \\frac{8}{12} \\times \\frac{7}{11} = \\frac{56}{132} = \\frac{14}{33}$$\n\n' +
        '$$P(\\text{at least one faulty}) = 1 - \\frac{14}{33} = \\frac{19}{33}$$\n\n' +
        'Check: exactly one faulty is $2 \\times \\frac{4}{12} \\times \\frac{8}{11} = \\frac{16}{33}$ and both faulty is $\\frac{4}{12} \\times \\frac{3}{11} = \\frac{1}{11} = \\frac{3}{33}$; together $\\frac{19}{33}$.',
      whyWrong: [
        'This is $1 - \\left(\\frac{8}{12}\\right)^2$, which treats the draws as **with** replacement. After one working bulb is taken, 7 of the remaining 11 work.',
        'This is $\\frac{4}{12} \\times \\frac{3}{11}$, the probability that **both** are faulty. "At least one" also includes exactly one faulty.',
        null,
        'This is the probability of **exactly one** faulty bulb. "At least one" must also include the case where both are faulty.',
      ],
      keyIdea: '"At least one" = $1 - P(\\text{none})$; without replacement, reduce both the count and the total on the second draw.',
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

  // ---------------------------------------------------------------- challenge
  {
    id: 'conditional-probability-014',
    subtopic: 'conditional-probability',
    difficulty: 'challenge',
    stem: 'In a school, 40% of students travel by bus and the rest walk. Half of the bus students were late at least once this term. Overall, 38% of all students were late at least once. What is the probability that a student who **walks** was late at least once?',
    options: ['$0.18$', '$0.3$', '$0.2$', '$0.5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let $p = P(\\text{late} \\mid \\text{walk})$. The walkers are $1 - 0.4 = 0.6$ of the students.\n\n' +
        'Law of total probability:\n\n' +
        '$$P(\\text{late}) = P(\\text{bus})P(\\text{late} \\mid \\text{bus}) + P(\\text{walk})P(\\text{late} \\mid \\text{walk})$$\n\n' +
        '$$0.38 = 0.4 \\times 0.5 + 0.6p = 0.2 + 0.6p$$\n\n' +
        '$$0.6p = 0.18 \\quad\\Rightarrow\\quad p = \\frac{0.18}{0.6} = 0.3$$',
      whyWrong: [
        'This is $0.38 - 0.2 = P(\\text{walk} \\cap \\text{late})$. It forgets the last step of dividing by $P(\\text{walk}) = 0.6$.',
        null,
        'This is $0.4 \\times 0.5 = P(\\text{bus} \\cap \\text{late})$, the bus branch of the tree, not the walkers.',
        'This is $1 - 0.5$, as if "late given walk" were the complement of "late given bus". They are separate groups; the walk branch has its own probability, found from the overall 38%.',
      ],
      keyIdea: 'If the total probability is given, set up $P(L) = \\sum P(\\text{branch})P(L \\mid \\text{branch})$ and solve for the missing conditional probability.',
    },
    check: {
      optionValues: [0.18, 0.3, 0.2, 0.5],
      compute: () => {
        const pBus = F(4, 10);
        const pLateBus = F(1, 2);
        const pLate = F(38, 100);
        return pLate.sub(pBus.mul(pLateBus)).div(F(1).sub(pBus)).value();
      },
    },
  },
  {
    id: 'conditional-probability-015',
    subtopic: 'conditional-probability',
    difficulty: 'challenge',
    stem: 'Three machines make all the parts in a workshop. Machine A makes 50% of the parts, B makes 30% and C makes 20%. The percentages of faulty parts are 2% for A, 3% for B and 5% for C. A part is chosen at random and found to be **faulty**. What is the probability that it was made by machine C?',
    options: ['$\\frac{1}{2}$', '$\\frac{1}{100}$', '$\\frac{10}{29}$', '$\\frac{1}{20}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Step 1 - probability of each "faulty" branch:\n\n' +
        '- A and faulty: $0.5 \\times 0.02 = 0.010$\n' +
        '- B and faulty: $0.3 \\times 0.03 = 0.009$\n' +
        '- C and faulty: $0.2 \\times 0.05 = 0.010$\n\n' +
        'Step 2 - total: $P(\\text{faulty}) = 0.010 + 0.009 + 0.010 = 0.029$.\n\n' +
        'Step 3 - Bayes:\n\n' +
        '$$P(C \\mid \\text{faulty}) = \\frac{0.010}{0.029} = \\frac{10}{29}$$',
      whyWrong: [
        'This is $\\frac{5}{2 + 3 + 5}$: it compares only the fault rates and ignores how many parts each machine makes. A makes more than twice as many parts as C, so the rates must be weighted by the shares.',
        'This is $0.2 \\times 0.05 = P(C \\cap \\text{faulty})$. It forgets to divide by the total probability of a faulty part, $0.029$.',
        null,
        'This is $P(\\text{faulty} \\mid C) = 0.05$, the reverse conditional. We know the part is faulty and want the machine.',
      ],
      keyIdea: 'Bayes with several causes: one branch divided by the sum of all branches that produce the evidence.',
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
    id: 'conditional-probability-016',
    subtopic: 'conditional-probability',
    difficulty: 'challenge',
    stem: 'A condition affects 10% of a group of patients. A test is positive for 90% of patients with the condition and for 20% of patients without it. A patient takes the test **twice**, and the two results are independent given whether or not the patient has the condition. **Both** results are positive. What is the probability that the patient has the condition?',
    options: ['$\\frac{9}{13}$', '$\\frac{1}{3}$', '$\\frac{81}{100}$', '$\\frac{1}{9}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Let $D$ = has the condition and $T$ = both results positive.\n\n' +
        '- $P(D \\cap T) = 0.1 \\times 0.9 \\times 0.9 = 0.081$\n' +
        '- $P(D\' \\cap T) = 0.9 \\times 0.2 \\times 0.2 = 0.036$\n\n' +
        'Total: $P(T) = 0.081 + 0.036 = 0.117$.\n\n' +
        '$$P(D \\mid T) = \\frac{0.081}{0.117} = \\frac{81}{117} = \\frac{9}{13}$$\n\n' +
        'Another way: after one positive, $P(D \\mid +) = \\frac{0.09}{0.09 + 0.18} = \\frac{1}{3}$. Use $\\frac{1}{3}$ as the new prior for the second test: $\\frac{\\frac{1}{3} \\times 0.9}{\\frac{1}{3} \\times 0.9 + \\frac{2}{3} \\times 0.2} = \\frac{0.3}{0.3 + \\frac{2}{15}} = \\frac{9}{13}$.',
      whyWrong: [
        null,
        'This is $P(D \\mid +)$ after only **one** positive test. A second positive result is more evidence, so the probability must rise above $\\frac{1}{3}$.',
        'This is $0.9 \\times 0.9 = P(T \\mid D)$, the chance an ill patient gets two positives. It reverses the condition and ignores that only 10% have the condition.',
        'This squares the one-test answer, $\\left(\\frac{1}{3}\\right)^2$. Evidence is combined by updating with Bayes again, not by multiplying the posterior by itself (that would make more evidence lower the probability).',
      ],
      keyIdea: 'Independent pieces of evidence multiply along each branch; then apply Bayes once (or update the prior step by step).',
    },
    check: {
      optionValues: [9 / 13, 1 / 3, 81 / 100, 1 / 9],
      compute: () => {
        const prior = F(1, 10);
        const sens = F(9, 10);
        const fpr = F(2, 10);
        const ill = prior.mul(sens).mul(sens);
        const well = F(1).sub(prior).mul(fpr).mul(fpr);
        return ill.div(ill.add(well)).value();
      },
    },
  },
  {
    id: 'conditional-probability-017',
    subtopic: 'conditional-probability',
    difficulty: 'challenge',
    stem: 'A family has two children. Each child is equally likely to be a boy or a girl, independently. You are told that **at least one** of the children is a girl. What is the probability that **both** children are girls?',
    options: ['$\\frac{1}{2}$', '$\\frac{1}{4}$', '$\\frac{1}{3}$', '$\\frac{2}{3}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'List the equally likely outcomes (older child first): BB, BG, GB, GG - each has probability $\\frac{1}{4}$.\n\n' +
        '"At least one girl" removes BB, leaving **3** equally likely outcomes: BG, GB, GG.\n\n' +
        'Only GG has both girls:\n\n' +
        '$$P(GG \\mid \\text{at least one G}) = \\frac{P(GG)}{P(\\text{at least one G})} = \\frac{\\frac{1}{4}}{\\frac{3}{4}} = \\frac{1}{3}$$',
      whyWrong: [
        'This answers "the other child is a girl" as if we knew **which** child is the girl. We only know at least one is, so BG and GB both remain possible, as well as GG.',
        'This is $P(GG)$ with no information, $\\frac{1}{2} \\times \\frac{1}{2}$. The condition removes BB, so you divide by $\\frac{3}{4}$.',
        null,
        'This is the probability of **exactly one** girl given at least one ($\\frac{2}{3}$): the right sample space but the wrong event.',
      ],
      keyIdea: 'Write out the full sample space, cross out what the condition rules out, and count what is left.',
    },
    check: {
      optionValues: [1 / 2, 1 / 4, 1 / 3, 2 / 3],
      compute: () => {
        const outcomes = ['BB', 'BG', 'GB', 'GG'];
        const atLeastOne = outcomes.filter((o) => o.includes('G'));
        const both = atLeastOne.filter((o) => o === 'GG');
        return F(both.length, atLeastOne.length).value();
      },
    },
  },
  {
    id: 'conditional-probability-018',
    subtopic: 'conditional-probability',
    difficulty: 'challenge',
    stem: 'A bag contains 5 red and 3 blue balls. Three balls are taken out one at a time **without replacement**. Given that the **first** ball is red, what is the probability that the **third** ball is red?',
    options: ['$\\frac{5}{14}$', '$\\frac{5}{8}$', '$\\frac{1}{2}$', '$\\frac{4}{7}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Once the first ball is known to be red, the bag holds 4 red and 3 blue (7 balls). The second ball is unknown, so split on it:\n\n' +
        '- Second red, third red: $\\frac{4}{7} \\times \\frac{3}{6} = \\frac{12}{42}$\n' +
        '- Second blue, third red: $\\frac{3}{7} \\times \\frac{4}{6} = \\frac{12}{42}$\n\n' +
        'Add: $\\frac{12}{42} + \\frac{12}{42} = \\frac{24}{42} = \\frac{4}{7}$.\n\n' +
        'Shortcut: with the second ball unseen, the third ball is equally likely to be any of the 7 remaining balls, 4 of which are red, so the answer is $\\frac{4}{7}$.',
      whyWrong: [
        'This is $\\frac{5}{8} \\times \\frac{4}{7} = P(\\text{1st red} \\cap \\text{3rd red})$. The first ball being red is **given**, so you should not multiply by $\\frac{5}{8}$ again.',
        'This ignores the given information: $\\frac{5}{8}$ is the chance the third ball is red when nothing is known about the first ball.',
        'This is $\\frac{3}{6}$, which assumes the second ball was also red. The second ball is unknown, so both possibilities for it must be included.',
        null,
      ],
      keyIdea: 'Given information changes the bag; any unseen draws in between are handled by adding the branches (or by symmetry).',
    },
    check: {
      optionValues: [5 / 14, 5 / 8, 1 / 2, 4 / 7],
      compute: () => {
        // brute force over all ordered triples of distinct balls (0-4 red, 5-7 blue)
        const isRed = (i: number) => i < 5;
        let firstRed = 0;
        let firstAndThirdRed = 0;
        for (let a = 0; a < 8; a++)
          for (let b = 0; b < 8; b++)
            for (let c = 0; c < 8; c++) {
              if (a === b || b === c || a === c) continue;
              if (!isRed(a)) continue;
              firstRed++;
              if (isRed(c)) firstAndThirdRed++;
            }
        return F(firstAndThirdRed, firstRed).value();
      },
    },
  },
];
