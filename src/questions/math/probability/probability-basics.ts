import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';

// ---- small exact helpers used only by the answer checks ----
const DIE = [1, 2, 3, 4, 5, 6];
/** Exact probability over the 36 equally likely ordered outcomes of two fair dice. */
const twoDice = (pred: (a: number, b: number) => boolean): number => {
  let count = 0;
  for (const a of DIE) for (const b of DIE) if (pred(a, b)) count++;
  return new Frac(count, 36).value();
};
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const DECK = SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'probability-basics-001',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'A spinner can land on red, blue or green. The probability it lands on red is $0.3$ and the probability it lands on blue is $0.45$. What is the probability that it does **not** land on blue?',
    options: ['$0.25$', '$0.7$', '$0.55$', '$0.45$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Use the **complement rule**: "not blue" is everything except blue, so\n\n' +
        '$$P(\\text{not blue}) = 1 - P(\\text{blue}) = 1 - 0.45 = 0.55$$\n\n' +
        'Check another way: green has probability $1 - 0.3 - 0.45 = 0.25$, and "not blue" means red or green: $0.3 + 0.25 = 0.55$.',
      whyWrong: [
        'This is $P(\\text{green}) = 1 - 0.3 - 0.45$. "Not blue" also includes red, so red must be added on.',
        'This is $1 - 0.3 = P(\\text{not red})$: the complement of the wrong colour was taken.',
        null,
        'This is $P(\\text{blue})$ itself: it forgets to subtract from $1$ to get the probability of **not** blue.',
      ],
      keyIdea: 'The complement rule: the probability that an event does not happen is $1$ minus the probability that it does.',
    },
    check: {
      optionValues: [0.25, 0.7, 0.55, 0.45],
      compute: () => {
        const red = 0.3;
        const blue = 0.45;
        const green = 1 - red - blue;
        return red + green;
      },
    },
  },
  {
    id: 'probability-basics-002',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'One card is drawn at random from a standard 52-card deck (4 suits of 13 cards: A, 2 to 10, J, Q, K). What is the probability that it is a **picture card** (a Jack, Queen or King)?',
    options: ['$\\frac{1}{13}$', '$\\frac{3}{13}$', '$\\frac{4}{13}$', '$\\frac{3}{52}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'All 52 cards are equally likely.\n\n' +
        '- Picture cards: 3 ranks (J, Q, K) in each of 4 suits, so $3 \\times 4 = 12$ cards.\n' +
        '- Probability: $\\frac{12}{52}$.\n' +
        '- Simplify by dividing top and bottom by 4: $\\frac{12}{52} = \\frac{3}{13}$.',
      whyWrong: [
        'This is $\\frac{4}{52}$, the probability of just **one** rank (for example a King). Jacks and Queens are picture cards too.',
        null,
        'This is $\\frac{16}{52}$: it counts the Aces as picture cards as well. An Ace is not a picture card.',
        'This counts only the 3 picture cards of **one** suit. Each of the 4 suits has its own J, Q and K, so there are 12.',
      ],
      keyIdea: 'With equally likely outcomes, probability = (number of favourable outcomes) divided by (total number of outcomes).',
    },
    check: {
      optionValues: [1 / 13, 3 / 13, 4 / 13, 3 / 52],
      compute: () => new Frac(DECK.filter((c) => ['J', 'Q', 'K'].includes(c.rank)).length, DECK.length).value(),
    },
  },
  {
    id: 'probability-basics-003',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'Events $A$ and $B$ are **mutually exclusive**, with $P(A) = 0.2$ and $P(B) = 0.5$. What is $P(A \\cup B)$, the probability that $A$ or $B$ happens?',
    options: ['$0.1$', '$0.6$', '$0.3$', '$0.7$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Mutually exclusive means $A$ and $B$ cannot happen together, so $P(A \\cap B) = 0$.\n\n' +
        'The addition rule becomes simply\n\n' +
        '$$P(A \\cup B) = P(A) + P(B) = 0.2 + 0.5 = 0.7$$',
      whyWrong: [
        'This is $0.2 \\times 0.5$. Multiplying gives "$A$ **and** $B$" for **independent** events, not "$A$ or $B$". For mutually exclusive events "$A$ and $B$" is impossible anyway.',
        'This is $0.2 + 0.5 - 0.2 \\times 0.5$, the "or" formula for **independent** events. Mutually exclusive events have $P(A \\cap B) = 0$, so nothing is subtracted.',
        'This is $0.5 - 0.2$: probabilities of "or" events are added, not subtracted.',
        null,
      ],
      keyIdea: 'For mutually exclusive events there is no overlap, so $P(A \\cup B) = P(A) + P(B)$.',
    },
    check: {
      optionValues: [0.1, 0.6, 0.3, 0.7],
      compute: () => {
        const pA = 0.2;
        const pB = 0.5;
        const both = 0; // mutually exclusive
        return pA + pB - both;
      },
    },
  },
  {
    id: 'probability-basics-004',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'Which pair of events is **independent**?',
    options: [
      'Two cards are drawn from a deck **without replacement**: "the first card is an Ace" and "the second card is an Ace"',
      'One die is rolled: "the number is even" and "the number is 2"',
      'A die is rolled and a coin is tossed: "the die shows 6" and "the coin shows heads"',
      'One die is rolled: "the number is less than 3" and "the number is greater than 4"',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Two events are **independent** when one happening does not change the probability of the other, which is the same as $P(A \\cap B) = P(A) \\times P(B)$.\n\n' +
        '- Die and coin: the coin does not know what the die did. $P(6 \\text{ and heads}) = \\frac{1}{12}$ and $\\frac{1}{6} \\times \\frac{1}{2} = \\frac{1}{12}$, so they are independent.\n' +
        '- Two Aces without replacement: $P(\\text{2nd Ace})$ is $\\frac{3}{51}$ if the first was an Ace but $\\frac{4}{51}$ if it was not, so the first draw changes the second: dependent.\n' +
        '- Even and 2: $P(\\text{even and } 2) = \\frac{1}{6}$ but $\\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}$: dependent.\n' +
        '- Less than 3 and greater than 4: they cannot both happen, so $P(\\text{both}) = 0$ but $\\frac{1}{3} \\times \\frac{1}{3} = \\frac{1}{9}$: dependent (these are mutually exclusive).',
      whyWrong: [
        'Without replacement, the first card changes what is left: after an Ace, only 3 of the 51 remaining cards are Aces. So the events are dependent.',
        'If the number is 2 it is certainly even, so knowing one event changes the other. $P(\\text{both}) = \\frac{1}{6}$, not $\\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}$.',
        null,
        'These events are **mutually exclusive**, which is not the same as independent. If one happens the other becomes impossible, so knowing one changes the other: $P(\\text{both}) = 0 \\ne \\frac{1}{3} \\times \\frac{1}{3}$.',
      ],
      keyIdea: 'Independent means one event does not affect the other ($P(A \\cap B) = P(A)P(B)$); mutually exclusive means they cannot happen together, and such events are never independent.',
    },
  },
  {
    id: 'probability-basics-005',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'A fair coin is tossed **three** times. What is the probability of getting **exactly two** heads?',
    options: ['$\\frac{3}{8}$', '$\\frac{1}{8}$', '$\\frac{1}{4}$', '$\\frac{1}{2}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'List the sample space. Each toss has 2 outcomes, so there are $2 \\times 2 \\times 2 = 8$ equally likely outcomes:\n\n' +
        'HHH, HHT, HTH, THH, HTT, THT, TTH, TTT\n\n' +
        'Exactly two heads: HHT, HTH, THH, which is 3 outcomes.\n\n' +
        '$$P(\\text{exactly two heads}) = \\frac{3}{8}$$',
      whyWrong: [
        null,
        'This counts only HHT and forgets the tail can come in any of the 3 positions (HHT, HTH, THH).',
        'This treats "0, 1, 2 or 3 heads" as 4 equally likely results. They are not equally likely: 2 heads can happen in 3 ways but 3 heads in only 1 way.',
        'This is $\\frac{4}{8}$, the probability of **at least** two heads: it wrongly includes HHH.',
      ],
      keyIdea: 'Write out the sample space of equally likely outcomes (here $2^3 = 8$) and count the ones you want.',
    },
    check: {
      optionValues: [3 / 8, 1 / 8, 1 / 4, 1 / 2],
      compute: () => {
        let hits = 0;
        let total = 0;
        for (let mask = 0; mask < 8; mask++) {
          total++;
          const heads = [0, 1, 2].filter((k) => (mask >> k) & 1).length;
          if (heads === 2) hits++;
        }
        return new Frac(hits, total).value();
      },
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'probability-basics-006',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'Two fair six-sided dice are rolled. What is the probability that the **sum** of the two scores is $8$?',
    options: ['$\\frac{5}{36}$', '$\\frac{1}{11}$', '$\\frac{1}{12}$', '$\\frac{1}{9}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Treat the dice as different (say red and blue). Each has 6 outcomes, so there are $6 \\times 6 = 36$ equally likely ordered pairs.\n\n' +
        'Pairs with sum 8: $(2,6)$, $(3,5)$, $(4,4)$, $(5,3)$, $(6,2)$, which is 5 pairs.\n\n' +
        '$$P(\\text{sum} = 8) = \\frac{5}{36}$$',
      whyWrong: [
        null,
        'This treats the 11 possible totals $2, 3, \\dots, 12$ as equally likely. They are not: a total of 7 can be made 6 ways but a total of 2 only 1 way.',
        'This is $\\frac{3}{36}$: it counts $\\{2,6\\}$, $\\{3,5\\}$, $\\{4,4\\}$ as single outcomes and forgets that $(2,6)$ and $(6,2)$ are different outcomes (and so are $(3,5)$ and $(5,3)$).',
        'This is $\\frac{4}{36}$: it counts $(2,6)$, $(6,2)$, $(3,5)$, $(5,3)$ but misses the double $(4,4)$.',
      ],
      keyIdea: 'Two dice give 36 equally likely **ordered** pairs; count the pairs, do not treat the totals as equally likely.',
    },
    check: {
      optionValues: [5 / 36, 1 / 11, 1 / 12, 1 / 9],
      compute: () => twoDice((a, b) => a + b === 8),
    },
  },
  {
    id: 'probability-basics-007',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'Two fair six-sided dice are rolled. What is the probability of getting **at least one** six?',
    options: ['$\\frac{1}{3}$', '$\\frac{11}{36}$', '$\\frac{25}{36}$', '$\\frac{1}{36}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use the complement: "at least one six" is the opposite of "no sixes at all".\n\n' +
        '- $P(\\text{no six on one die}) = \\frac{5}{6}$\n' +
        '- The dice are independent, so $P(\\text{no six on either}) = \\frac{5}{6} \\times \\frac{5}{6} = \\frac{25}{36}$\n' +
        '- $P(\\text{at least one six}) = 1 - \\frac{25}{36} = \\frac{11}{36}$\n\n' +
        'Check by counting: 6 pairs have a six on the first die, 6 have a six on the second, and $(6,6)$ is in both lists, so $6 + 6 - 1 = 11$ pairs.',
      whyWrong: [
        'This is $\\frac{1}{6} + \\frac{1}{6} = \\frac{12}{36}$: it double counts the outcome $(6,6)$, which has a six on both dice.',
        null,
        'This is $P(\\text{no sixes})$: the last step, subtracting from $1$, was forgotten.',
        'This is $\\frac{1}{6} \\times \\frac{1}{6}$, the probability that **both** dice show a six, not at least one.',
      ],
      keyIdea: '$P(\\text{at least one}) = 1 - P(\\text{none})$.',
    },
    check: {
      optionValues: [1 / 3, 11 / 36, 25 / 36, 1 / 36],
      compute: () => twoDice((a, b) => a === 6 || b === 6),
    },
  },
  {
    id: 'probability-basics-008',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'For two events, $P(A) = 0.5$, $P(B) = 0.4$ and $P(A \\cap B) = 0.15$. Find $P(A \\cup B)$.',
    options: ['$0.9$', '$0.6$', '$0.25$', '$0.75$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use the addition rule. Adding $P(A)$ and $P(B)$ counts the overlap $A \\cap B$ twice, so subtract it once:\n\n' +
        '$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.5 + 0.4 - 0.15 = 0.75$$',
      whyWrong: [
        'This is $0.5 + 0.4$: it forgets to subtract the overlap, so outcomes in both $A$ and $B$ are counted twice.',
        'This is $0.9 - 2 \\times 0.15$: subtracting the overlap **twice** removes it completely. That is the probability of **exactly one** of the events, not $A$ or $B$.',
        'This is $1 - 0.75 = P(\\text{neither})$, the complement of the answer.',
        null,
      ],
      keyIdea: 'Addition rule: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.',
    },
    check: {
      optionValues: [0.9, 0.6, 0.25, 0.75],
      compute: () => {
        const pA = 0.5;
        const pB = 0.4;
        const both = 0.15;
        return pA + pB - both;
      },
    },
  },
  {
    id: 'probability-basics-009',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'One card is drawn at random from a standard 52-card deck. What is the probability that it is a **King or a heart**?',
    options: ['$\\frac{4}{13}$', '$\\frac{17}{52}$', '$\\frac{1}{52}$', '$\\frac{1}{4}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '- $P(\\text{King}) = \\frac{4}{52}$\n' +
        '- $P(\\text{heart}) = \\frac{13}{52}$\n' +
        '- $P(\\text{King and heart}) = \\frac{1}{52}$ (the King of hearts)\n\n' +
        'These events overlap, so use the addition rule:\n\n' +
        '$$P(K \\cup H) = \\frac{4}{52} + \\frac{13}{52} - \\frac{1}{52} = \\frac{16}{52} = \\frac{4}{13}$$\n\n' +
        'Check by counting: 13 hearts plus the 3 other Kings gives 16 cards.',
      whyWrong: [
        null,
        'This is $\\frac{4 + 13}{52}$: the King of hearts has been counted twice (once as a King, once as a heart).',
        'This is the probability of a King **and** a heart (only the King of hearts), not King **or** heart.',
        'This is $\\frac{13}{52}$, only the hearts. The 3 Kings that are not hearts also count.',
      ],
      keyIdea: '"Or" with overlapping events: add the probabilities and subtract the overlap once.',
    },
    check: {
      optionValues: [4 / 13, 17 / 52, 1 / 52, 1 / 4],
      compute: () => new Frac(DECK.filter((c) => c.rank === 'K' || c.suit === 'hearts').length, DECK.length).value(),
    },
  },
  {
    id: 'probability-basics-010',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'Events $A$ and $B$ are **independent**, with $P(A) = 0.6$ and $P(B) = 0.3$. Find $P(A \\cup B)$.',
    options: ['$0.18$', '$0.72$', '$0.9$', '$0.28$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Independent events: $P(A \\cap B) = P(A) \\times P(B) = 0.6 \\times 0.3 = 0.18$.\n\n' +
        'Addition rule:\n\n' +
        '$$P(A \\cup B) = 0.6 + 0.3 - 0.18 = 0.72$$\n\n' +
        'Check with the complement: $P(\\text{neither}) = 0.4 \\times 0.7 = 0.28$, and $1 - 0.28 = 0.72$.',
      whyWrong: [
        'This is $P(A \\cap B) = 0.6 \\times 0.3$, the probability of both, not of $A$ or $B$.',
        null,
        'This is $0.6 + 0.3$: it treats the events as mutually exclusive. Independent events can happen together, so the overlap $0.18$ must be subtracted.',
        'This is $0.4 \\times 0.7 = P(\\text{neither})$: the final step $1 - 0.28$ was forgotten.',
      ],
      keyIdea: 'For independent events $P(A \\cap B) = P(A)P(B)$; put this into the addition rule.',
    },
    check: {
      optionValues: [0.18, 0.72, 0.9, 0.28],
      compute: () => {
        const pA = 0.6;
        const pB = 0.3;
        return 1 - (1 - pA) * (1 - pB);
      },
    },
  },
  {
    id: 'probability-basics-011',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'In a class of 30 students, 17 study French, 12 study Spanish and 4 study both. A student is chosen at random. What is the probability that the student studies **neither** language?',
    options: ['$\\frac{1}{30}$', '$\\frac{3}{10}$', '$\\frac{2}{15}$', '$\\frac{1}{6}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Fill in a Venn diagram from the middle outwards.\n\n' +
        '| Region | Students |\n' +
        '|---|---|\n' +
        '| Both | 4 |\n' +
        '| French only | $17 - 4 = 13$ |\n' +
        '| Spanish only | $12 - 4 = 8$ |\n' +
        '| At least one language | $13 + 4 + 8 = 25$ |\n' +
        '| Neither | $30 - 25 = 5$ |\n\n' +
        'So $P(\\text{neither}) = \\frac{5}{30} = \\frac{1}{6}$.',
      whyWrong: [
        'This uses $30 - (17 + 12) = 1$: the 4 students who study both were counted twice.',
        'This subtracts the overlap twice: $17 + 12 - 8 = 21$, leaving $9$, and $\\frac{9}{30} = \\frac{3}{10}$. The overlap should be subtracted only once.',
        'This is $\\frac{4}{30}$, the probability of studying **both** languages: the wrong region of the Venn diagram.',
        null,
      ],
      keyIdea: 'Start a Venn diagram with the overlap, then subtract to fill the other regions; "neither" is the total minus the union.',
    },
    check: {
      optionValues: [1 / 30, 3 / 10, 2 / 15, 1 / 6],
      compute: () => {
        const total = 30;
        const french = 17;
        const spanish = 12;
        const both = 4;
        return new Frac(total - (french + spanish - both), total).value();
      },
    },
  },
  {
    id: 'probability-basics-012',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'For two events, $P(A) = 0.45$, $P(B) = 0.35$ and $P(A \\cup B) = 0.6$. What is the probability that $A$ happens but $B$ does **not**, that is $P(A \\cap B\')$?',
    options: ['$0.2$', '$0.15$', '$0.25$', '$0.45$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'First find the overlap by rearranging the addition rule:\n\n' +
        '$$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 0.45 + 0.35 - 0.6 = 0.2$$\n\n' +
        '"$A$ only" is the part of circle $A$ outside the overlap:\n\n' +
        '$$P(A \\cap B\') = P(A) - P(A \\cap B) = 0.45 - 0.2 = 0.25$$\n\n' +
        'Quick check: $P(A \\cup B) - P(B) = 0.6 - 0.35 = 0.25$, the same.',
      whyWrong: [
        'This is $P(A \\cap B)$, the overlap, where both happen. The question wants $A$ **without** $B$.',
        'This is $0.6 - 0.45 = P(B \\text{ only})$: the roles of $A$ and $B$ were swapped.',
        null,
        'This is $0.45$, the whole of event $A$, which still includes the overlap where $B$ also happens.',
      ],
      keyIdea: 'In a Venn diagram, "$A$ only" $= P(A) - P(A \\cap B)$; find the overlap first from the addition rule.',
    },
    check: {
      optionValues: [0.2, 0.15, 0.25, 0.45],
      compute: () => {
        const pA = 0.45;
        const pB = 0.35;
        const union = 0.6;
        const both = pA + pB - union;
        return pA - both;
      },
    },
  },
  {
    id: 'probability-basics-013',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'Events $A$ and $B$ have $P(A) = 0.3$, $P(B) = 0.4$ and $P(A \\cap B) = 0.12$. Which statement is TRUE?',
    options: [
      '$A$ and $B$ are mutually exclusive but not independent',
      '$A$ and $B$ are both mutually exclusive and independent',
      '$A$ and $B$ are neither mutually exclusive nor independent',
      '$A$ and $B$ are independent but not mutually exclusive',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Test each property separately.\n\n' +
        '- **Mutually exclusive?** That needs $P(A \\cap B) = 0$. Here $P(A \\cap B) = 0.12 \\ne 0$, so they are **not** mutually exclusive.\n' +
        '- **Independent?** That needs $P(A \\cap B) = P(A) \\times P(B)$. Here $0.3 \\times 0.4 = 0.12$, which matches, so they **are** independent.',
      whyWrong: [
        'Mutually exclusive events have $P(A \\cap B) = 0$, but here it is $0.12$, so $A$ and $B$ can happen together.',
        'This is impossible here: mutually exclusive would need $P(A \\cap B) = 0$, while independence needs $P(A \\cap B) = 0.12$. Events with non-zero probabilities can never be both.',
        'The independence test was skipped: $0.3 \\times 0.4 = 0.12$, which equals $P(A \\cap B)$, so they are independent.',
        null,
      ],
      keyIdea: 'Mutually exclusive: $P(A \\cap B) = 0$. Independent: $P(A \\cap B) = P(A)P(B)$. Check each test separately.',
    },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'probability-basics-014',
    subtopic: 'probability-basics',
    difficulty: 'challenge',
    stem: 'A basketball player scores each free throw with probability $0.8$, independently of the other throws. She takes 3 free throws. What is the probability that she **misses at least one**?',
    options: ['$0.488$', '$0.6$', '$0.008$', '$0.512$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The opposite of "misses at least one" is "scores all three".\n\n' +
        '- $P(\\text{scores all 3}) = 0.8 \\times 0.8 \\times 0.8 = 0.8^3 = 0.512$ (independent, so multiply)\n' +
        '- $P(\\text{misses at least one}) = 1 - 0.512 = 0.488$',
      whyWrong: [
        null,
        'This is $3 \\times 0.2$: adding the miss probabilities double counts the outcomes with two or three misses. Use the complement instead.',
        'This is $0.2^3$, the probability she misses **all three**, not at least one.',
        'This is $0.8^3$, the probability she scores all three: the final step, subtracting from $1$, was forgotten.',
      ],
      keyIdea: '"At least one" is the complement of "none": $P(\\text{at least one miss}) = 1 - P(\\text{no misses})$.',
    },
    check: {
      optionValues: [0.488, 0.6, 0.008, 0.512],
      compute: () => {
        const pScore = 0.8;
        let allScore = 1;
        for (let k = 0; k < 3; k++) allScore *= pScore;
        return 1 - allScore;
      },
    },
  },
  {
    id: 'probability-basics-015',
    subtopic: 'probability-basics',
    difficulty: 'challenge',
    stem: 'A fair die is rolled $n$ times. What is the **smallest** value of $n$ for which the probability of getting **at least one six** is $0.5$ or more?',
    options: ['$3$', '$4$', '$6$', '$1$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '$P(\\text{at least one six in } n \\text{ rolls}) = 1 - \\left(\\frac{5}{6}\\right)^n$. We need this to be at least $0.5$, which means $\\left(\\frac{5}{6}\\right)^n \\le 0.5$.\n\n' +
        'Try values on a calculator:\n\n' +
        '| $n$ | $\\left(\\frac{5}{6}\\right)^n$ | $1 - \\left(\\frac{5}{6}\\right)^n$ |\n' +
        '|---|---|---|\n' +
        '| 3 | $0.5787$ | $0.4213$ |\n' +
        '| 4 | $0.4823$ | $0.5177$ |\n\n' +
        'At $n = 3$ the probability is still below $0.5$; at $n = 4$ it first reaches $0.5$ (in fact it goes above it). So the smallest $n$ is $4$.',
      whyWrong: [
        'This adds $\\frac{1}{6}$ for each roll, so that 3 rolls seem to give $3 \\times \\frac{1}{6} = 0.5$. Chances do not simply add up like this (otherwise 7 rolls would give a probability above $1$): for 3 rolls the true probability is $1 - \\frac{125}{216} = \\frac{91}{216}$, which is below $0.5$.',
        null,
        'This assumes 6 rolls are needed because a six has probability $\\frac{1}{6}$. In fact 4 rolls already give more than a 50% chance ($1 - \\left(\\frac{5}{6}\\right)^4 \\approx 0.518$).',
        'This uses $1 - \\left(\\frac{1}{6}\\right)^n$, the complement of "every roll is a six". The complement of "at least one six" is "no sixes", which uses $\\frac{5}{6}$.',
      ],
      keyIdea: 'Set $1 - (\\text{probability of none})^n$ against the target and test whole numbers $n$ until it is reached.',
    },
    check: {
      optionValues: [3, 4, 6, 1],
      compute: () => {
        let n = 1;
        while (1 - (5 / 6) ** n < 0.5) n++;
        return n;
      },
    },
  },
  {
    id: 'probability-basics-016',
    subtopic: 'probability-basics',
    difficulty: 'challenge',
    stem: 'Events $A$ and $B$ are **independent**. $P(A) = 0.4$ and $P(A \\cup B) = 0.7$. Find $P(B)$.',
    options: ['$0.3$', '$0.75$', '$0.25$', '$0.5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Let $P(B) = p$. Independence gives $P(A \\cap B) = 0.4p$. The addition rule then says\n\n' +
        '$$0.7 = 0.4 + p - 0.4p$$\n\n' +
        '- Subtract $0.4$: $0.3 = p - 0.4p = 0.6p$\n' +
        '- Divide by $0.6$: $p = \\frac{0.3}{0.6} = 0.5$\n\n' +
        'Check: $0.4 + 0.5 - 0.4 \\times 0.5 = 0.9 - 0.2 = 0.7$. Correct.',
      whyWrong: [
        'This is $0.7 - 0.4$: it treats $A$ and $B$ as mutually exclusive and ignores the overlap $P(A \\cap B) = 0.4p$.',
        'This divides $0.3$ by $0.4$ instead of by $1 - 0.4 = 0.6$ after collecting the $p$ terms. Check: $0.4 + 0.75 - 0.3 = 0.85$, not $0.7$.',
        'This sets $P(\\text{neither}) = 0.3$ equal to $0.4(1 - p)$, using $0.4$ (the probability of $A$) where $0.6$ (the probability of not $A$) belongs. Check: $0.4 + 0.25 - 0.1 = 0.55$, not $0.7$.',
        null,
      ],
      keyIdea: 'Write the unknown as $p$, replace $P(A \\cap B)$ by $P(A)p$ (independence) and solve the addition rule as a linear equation.',
    },
    check: {
      optionValues: [0.3, 0.75, 0.25, 0.5],
      compute: () => {
        const pA = 0.4;
        const union = 0.7;
        // union = pA + p - pA p  =>  p = (union - pA) / (1 - pA)
        return (union - pA) / (1 - pA);
      },
    },
  },
  {
    id: 'probability-basics-017',
    subtopic: 'probability-basics',
    difficulty: 'challenge',
    stem: 'For two events, $P(A) = 0.5$ and $P(B) = 0.3$. The probability that **neither** $A$ nor $B$ happens is $0.3$. Find $P(A \\cap B)$.',
    options: ['$0.1$', '$0.15$', '$0$', '$0.4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '- Neither has probability $0.3$, so $P(A \\cup B) = 1 - 0.3 = 0.7$.\n' +
        '- Rearrange the addition rule: $P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$.\n' +
        '- $P(A \\cap B) = 0.5 + 0.3 - 0.7 = 0.1$.\n\n' +
        'Venn check: $A$ only $= 0.4$, both $= 0.1$, $B$ only $= 0.2$, neither $= 0.3$, and $0.4 + 0.1 + 0.2 + 0.3 = 1$.',
      whyWrong: [
        null,
        'This is $0.5 \\times 0.3$, which assumes $A$ and $B$ are independent. Nothing in the question says so; the overlap must come from the given information.',
        'This assumes $A$ and $B$ are mutually exclusive. Then $P(A \\cup B)$ would be $0.8$ and neither would be $0.2$, not $0.3$.',
        'This is $0.5 - 0.1 = 0.4$, the probability of $A$ only (the part of $A$ outside $B$), not the overlap.',
      ],
      keyIdea: 'Neither $= 1 - P(A \\cup B)$; then the addition rule rearranged gives the overlap.',
    },
    check: {
      optionValues: [0.1, 0.15, 0, 0.4],
      compute: () => {
        const pA = 0.5;
        const pB = 0.3;
        const neither = 0.3;
        return pA + pB - (1 - neither);
      },
    },
  },
  {
    id: 'probability-basics-018',
    subtopic: 'probability-basics',
    difficulty: 'challenge',
    stem: 'Two cards are drawn at random from a standard 52-card deck **without replacement**. What is the probability that **at least one** of them is an Ace?',
    options: ['$\\frac{2}{13}$', '$\\frac{1}{221}$', '$\\frac{25}{169}$', '$\\frac{33}{221}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use the complement: at least one Ace $= 1 - P(\\text{no Aces})$.\n\n' +
        '- First card not an Ace: $\\frac{48}{52}$\n' +
        '- Second card not an Ace (one non-Ace and one card gone): $\\frac{47}{51}$\n' +
        '- $P(\\text{no Aces}) = \\frac{48}{52} \\times \\frac{47}{51} = \\frac{2256}{2652} = \\frac{188}{221}$\n' +
        '- $P(\\text{at least one Ace}) = 1 - \\frac{188}{221} = \\frac{33}{221}$',
      whyWrong: [
        'This is $\\frac{1}{13} + \\frac{1}{13}$: adding double counts the case where both cards are Aces (and ignores that the cards are not replaced).',
        'This is $\\frac{4}{52} \\times \\frac{3}{51}$, the probability that **both** cards are Aces.',
        'This is $1 - \\left(\\frac{12}{13}\\right)^2$, which treats the draws as **with** replacement. Without replacement the second factor is $\\frac{47}{51}$.',
        null,
      ],
      keyIdea: 'For "at least one", find $P(\\text{none})$ step by step (reducing the counts when there is no replacement) and subtract from $1$.',
    },
    check: {
      optionValues: [2 / 13, 1 / 221, 25 / 169, 33 / 221],
      compute: () => {
        // exact count over all ordered pairs of different cards
        let atLeastOne = 0;
        let total = 0;
        for (let i = 0; i < DECK.length; i++)
          for (let j = 0; j < DECK.length; j++) {
            if (i === j) continue;
            total++;
            if (DECK[i].rank === 'A' || DECK[j].rank === 'A') atLeastOne++;
          }
        return new Frac(atLeastOne, total).value();
      },
    },
  },
];
