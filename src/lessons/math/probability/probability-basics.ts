import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'probability-basics',
  know:
    '### What probability means\n\n' +
    'A **probability** is a number from $0$ to $1$ that says how likely something is. $0$ means impossible, $1$ means certain, and $0.5$ means "as likely as not". You can write it as a fraction, a decimal or a percentage: $\\frac{1}{4} = 0.25 = 25\\%$. If you ever get a probability below $0$ or above $1$, you have made a mistake.\n\n' +
    '### Sample spaces and equally likely outcomes\n\n' +
    'The **sample space** is the list of every possible outcome. An **event** is a group of outcomes you care about.\n\n' +
    '- One die: $\\{1, 2, 3, 4, 5, 6\\}$, 6 outcomes.\n' +
    '- Three coins: HHH, HHT, HTH, THH, HTT, THT, TTH, TTT, which is $2 \\times 2 \\times 2 = 8$ outcomes.\n' +
    '- A standard deck: 52 cards, 4 suits (hearts and diamonds are red, clubs and spades are black) of 13 ranks (A, 2 to 10, J, Q, K). The picture cards are J, Q, K: 12 of them.\n\n' +
    'When all outcomes are **equally likely**, probability is just counting:\n\n' +
    '$$P(\\text{event}) = \\frac{\\text{number of outcomes in the event}}{\\text{total number of outcomes}}$$\n\n' +
    '### Two dice: always use the 6 by 6 grid\n\n' +
    'Think of the dice as red and blue. There are $6 \\times 6 = 36$ equally likely **ordered** pairs, and $(2,5)$ is different from $(5,2)$. The totals $2$ to $12$ are **not** equally likely:\n\n' +
    '| Total | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |\n' +
    '|---|---|---|---|---|---|---|---|---|---|---|---|\n' +
    '| Ways | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |\n\n' +
    'So $P(\\text{total} = 7) = \\frac{6}{36} = \\frac{1}{6}$, the most likely total.\n\n' +
    '### The complement rule\n\n' +
    'The **complement** of $A$, written $A\'$, means "$A$ does not happen". Exactly one of $A$ and $A\'$ happens, so\n\n' +
    '$$P(A\') = 1 - P(A)$$\n\n' +
    'Use it whenever the opposite event is easier to count.\n\n' +
    '### "At least one" problems\n\n' +
    'The opposite of "at least one" is "none at all". So\n\n' +
    '$$P(\\text{at least one}) = 1 - P(\\text{none})$$\n\n' +
    'Example: at least one six in 3 rolls of a die is $1 - \\left(\\frac{5}{6}\\right)^3 = 1 - \\frac{125}{216} = \\frac{91}{216}$. Never add $\\frac{1}{6} + \\frac{1}{6} + \\frac{1}{6}$: that counts the rolls with two or three sixes more than once.\n\n' +
    '### "And", "or" and the addition rule\n\n' +
    '$A \\cap B$ ("$A$ and $B$") means both happen. $A \\cup B$ ("$A$ or $B$") means at least one of them happens. When you add $P(A) + P(B)$, the outcomes in both are counted twice, so subtract them once:\n\n' +
    '$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n\n' +
    'Example: King or heart from a deck is $\\frac{4}{52} + \\frac{13}{52} - \\frac{1}{52} = \\frac{16}{52} = \\frac{4}{13}$ (the King of hearts was counted twice).\n\n' +
    '### Mutually exclusive vs independent\n\n' +
    'These two words sound similar but mean very different things.\n\n' +
    '| | Mutually exclusive | Independent |\n' +
    '|---|---|---|\n' +
    '| Meaning | cannot happen together | one does not affect the other |\n' +
    '| Test | $P(A \\cap B) = 0$ | $P(A \\cap B) = P(A) \\times P(B)$ |\n' +
    '| "Or" rule | $P(A \\cup B) = P(A) + P(B)$ | $P(A) + P(B) - P(A)P(B)$ |\n' +
    '| Example | one die: "shows 1" and "shows 6" | a coin and a die |\n\n' +
    'If two events with non-zero probabilities are mutually exclusive, they are **not** independent: knowing one happened tells you the other did not.\n\n' +
    '### Venn diagrams\n\n' +
    'Two overlapping circles split everything into 4 regions: $A$ only, both, $B$ only, neither. The four regions always add to $1$ (or to the total number of people). **Always fill in the overlap first**, then subtract:\n\n' +
    '- $A$ only $= P(A) - P(A \\cap B)$\n' +
    '- $B$ only $= P(B) - P(A \\cap B)$\n' +
    '- neither $= 1 - P(A \\cup B)$\n' +
    '- exactly one $= P(A) + P(B) - 2P(A \\cap B)$\n\n' +
    'If the question gives you three of $P(A)$, $P(B)$, $P(A \\cap B)$ and $P(A \\cup B)$, the addition rule lets you find the fourth.',
  formulas: [
    { label: 'Equally likely outcomes', tex: 'P(A) = \\frac{\\text{number of outcomes in } A}{\\text{total number of outcomes}}', note: 'Only when every outcome is equally likely.' },
    { label: 'Probability range', tex: '0 \\le P(A) \\le 1', note: 'All the probabilities in a sample space add up to $1$.' },
    { label: 'Complement rule', tex: "P(A') = 1 - P(A)" },
    { label: '"At least one"', tex: 'P(\\text{at least one}) = 1 - P(\\text{none})' },
    { label: 'At least one success in $n$ independent tries', tex: '1 - (1 - p)^{n}', note: '$p$ is the probability of success on one try.' },
    { label: 'Addition rule', tex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)' },
    { label: 'Mutually exclusive events', tex: 'P(A \\cap B) = 0, \\qquad P(A \\cup B) = P(A) + P(B)' },
    { label: 'Independent events', tex: 'P(A \\cap B) = P(A) \\times P(B)', note: 'Also the test for independence.' },
    { label: 'Venn regions', tex: "P(A \\cap B') = P(A) - P(A \\cap B), \\qquad P(\\text{neither}) = 1 - P(A \\cup B)" },
    { label: 'Exactly one of $A$, $B$', tex: 'P(A) + P(B) - 2P(A \\cap B)' },
    { label: 'Two dice', tex: '6 \\times 6 = 36 \\text{ equally likely ordered outcomes}', note: 'Totals are not equally likely: a total of 7 has 6 ways, 2 and 12 have 1 way each.' },
  ],
  examples: [
    {
      title: 'Counting with two dice',
      problem: 'Two fair dice are rolled. Find the probability that the total is $9$.',
      steps: [
        'The sample space has $6 \\times 6 = 36$ equally likely ordered pairs.',
        'List the pairs with total 9: $(3,6)$, $(4,5)$, $(5,4)$, $(6,3)$.',
        'That is 4 pairs. Remember $(3,6)$ and $(6,3)$ are different outcomes.',
        '$P(\\text{total } 9) = \\frac{4}{36} = \\frac{1}{9}$.',
      ],
      answer: '$\\frac{1}{9}$',
    },
    {
      title: 'The addition rule with cards',
      problem: 'A card is drawn at random from a standard 52-card deck. Find the probability that it is red or a picture card (J, Q, K).',
      steps: [
        '$P(\\text{red}) = \\frac{26}{52}$, since hearts and diamonds are red.',
        '$P(\\text{picture}) = \\frac{12}{52}$, since there are 3 picture cards in each of 4 suits.',
        'Red picture cards: 3 in hearts and 3 in diamonds, so $P(\\text{red and picture}) = \\frac{6}{52}$.',
        'Addition rule: $\\frac{26}{52} + \\frac{12}{52} - \\frac{6}{52} = \\frac{32}{52}$.',
        'Simplify: $\\frac{32}{52} = \\frac{8}{13}$.',
      ],
      answer: '$\\frac{8}{13}$',
    },
    {
      title: '"At least one" with independent events',
      problem: 'A quiz has 4 questions. For each one, a student guessing has a probability of $0.25$ of being right, independently. Find the probability that the student gets at least one question right.',
      steps: [
        'The opposite of "at least one right" is "all four wrong".',
        'Probability of getting one question wrong: $1 - 0.25 = 0.75$.',
        'All four wrong (independent, so multiply): $0.75^4 = 0.31640625$.',
        '$P(\\text{at least one right}) = 1 - 0.31640625 = 0.68359375$, which is $0.684$ to 3 significant figures.',
      ],
      answer: '$0.684$ (3 s.f.)',
    },
    {
      title: 'Venn diagram algebra (exam level)',
      problem: 'Events $A$ and $B$ have $P(A) = 0.6$, $P(B) = 0.25$ and $P(A \\cup B) = 0.7$. Find $P(A \\cap B)$, and decide whether $A$ and $B$ are independent.',
      steps: [
        'Rearrange the addition rule: $P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$.',
        'Substitute: $P(A \\cap B) = 0.6 + 0.25 - 0.7 = 0.15$.',
        'Independence test: $P(A) \\times P(B) = 0.6 \\times 0.25 = 0.15$.',
        'This equals $P(A \\cap B)$, so $A$ and $B$ are independent.',
        'They are not mutually exclusive, because $P(A \\cap B) = 0.15 \\ne 0$.',
      ],
      answer: '$P(A \\cap B) = 0.15$; $A$ and $B$ are independent.',
    },
  ],
  traps: [
    'Treating the totals of two dice as equally likely (giving $\\frac{1}{11}$ for any total). Always use the 36 ordered pairs: $(2,5)$ and $(5,2)$ are different outcomes.',
    'Adding probabilities for "at least one", such as $\\frac{1}{6} + \\frac{1}{6}$ for at least one six with two dice. This double counts $(6,6)$; use $1 - P(\\text{none}) = 1 - \\frac{25}{36} = \\frac{11}{36}$.',
    'Forgetting to subtract the overlap in the addition rule, so outcomes in both events (like the King of hearts in "King or heart") are counted twice.',
    'Mixing up mutually exclusive and independent. Mutually exclusive means $P(A \\cap B) = 0$; independent means $P(A \\cap B) = P(A)P(B)$. Do not multiply probabilities unless the events are independent.',
    'Doing all the work for $P(\\text{none})$ and then forgetting the final "$1 -$" step. The unfinished number is almost always one of the wrong options.',
    'Reading the wrong Venn region: "$A$ only" is not the same as $P(A)$, and "neither" is not the same as "both".',
  ],
  examTip:
    'Expect short questions on dice, coins, cards or given values of $P(A)$ and $P(B)$, and use the options to help you. The wrong options are usually the results of the classic slips: the "none" probability without the final $1 -$ step, $P(A) + P(B)$ with no overlap subtracted, a product used where the events are not independent, or $\\frac{1}{11}$ from treating dice totals as equally likely. So when your answer matches an option, ask yourself which slip each of the others comes from. Quick checks: a probability must be between $0$ and $1$; "at least one" must be bigger than the probability for a single try; $P(A \\cup B)$ can never be less than the larger of $P(A)$ and $P(B)$; and in a Venn diagram the four regions must add up to $1$. For "smallest $n$" questions, plug the options into $1 - q^n$ on your calculator instead of using logarithms.',
};
