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
    stem: 'A spinner lands on red with probability $0.3$, on blue with probability $0.45$, and otherwise on green. What is the probability that it does **not** land on blue?',
    options: ['$0.25$', '$0.7$', '$0.55$', '$0.45$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the chance that the spinner lands on anything except blue?',
      solution:
        '"Blue" and "not blue" together cover every possible result, and they can\'t both happen. So their probabilities add up to 1.\n\n' +
        'That gives $P(\\text{not blue}) = 1 - P(\\text{blue})$, where $P(\\text{blue})$ means the probability of blue.\n\n' +
        'The question gives $P(\\text{blue}) = 0.45$. Substitute: $1 - 0.45 = 0.55$.',
      conclusion: 'Blue takes up $0.45$ of the total of 1, so everything else is $0.55$.',
      whyWrong: [
        'This is $P(\\text{green}) = 1 - 0.3 - 0.45$. "Not blue" also includes red, so red must be added on.',
        'This is $1 - 0.3 = P(\\text{not red})$: the complement of the wrong colour was taken.',
        null,
        'This is $P(\\text{blue})$ itself: it forgets to subtract from $1$ to get the probability of **not** blue.',
      ],
      keyIdea: 'For "not" questions, use $P(\\text{not } A) = 1 - P(A)$. You only need the probability of the thing being ruled out, so the other numbers can be ignored.',
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
    stem: 'One card is drawn at random from a standard 52-card deck. What is the probability that it is a **picture card** (a Jack, Queen or King)?',
    options: ['$\\frac{1}{13}$', '$\\frac{3}{13}$', '$\\frac{4}{13}$', '$\\frac{3}{52}$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What fraction of a deck is Jacks, Queens and Kings?',
      solution:
        'Every card is equally likely, so probability $=$ (cards we want) $\\div$ (all cards).\n\n' +
        'A standard deck has 4 suits: hearts, diamonds, clubs and spades. Each suit has one Jack, one Queen and one King.\n\n' +
        'So there are $3 \\times 4 = 12$ picture cards out of 52.\n\n' +
        'Write the fraction and simplify by dividing top and bottom by 4: $\\frac{12}{52} = \\frac{3}{13}$.',
      conclusion: '12 of the 52 cards are picture cards, so the answer is $\\frac{3}{13}$.',
      whyWrong: [
        'This is $\\frac{4}{52}$, the probability of just **one** rank (for example a King). Jacks and Queens are picture cards too.',
        null,
        'This is $\\frac{16}{52}$: it counts the Aces as picture cards as well. An Ace is not a picture card.',
        'This counts only the 3 picture cards of **one** suit. Each of the 4 suits has its own J, Q and K, so there are 12.',
      ],
      keyIdea: 'With equally likely outcomes, probability = outcomes you want divided by all outcomes. For cards, use 52 cards, 4 suits of 13, and 4 of each rank, so 3 picture ranks give $3 \\times 4$ cards.',
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
      asking: 'What is the chance that $A$ or $B$ happens, when they can\'t both happen?',
      solution:
        '$P(A \\cup B)$ means the probability that $A$ or $B$ happens. **Mutually exclusive** means the two events can\'t happen at the same time, like one die showing both 2 and 5.\n\n' +
        'Since they can\'t overlap, no outcome gets counted twice, so we simply add the two probabilities.\n\n' +
        '$P(A \\cup B) = P(A) + P(B) = 0.2 + 0.5 = 0.7$.',
      conclusion: 'With no overlap to remove, the two probabilities just add, so the answer is $0.7$.',
      whyWrong: [
        'This is $0.2 \\times 0.5$. Multiplying gives "$A$ **and** $B$" for **independent** events, not "$A$ or $B$". For mutually exclusive events "$A$ and $B$" is impossible anyway.',
        'This is $0.2 + 0.5 - 0.2 \\times 0.5$, the "or" formula for **independent** events. Mutually exclusive events have $P(A \\cap B) = 0$, so nothing is subtracted.',
        'This is $0.5 - 0.2$: probabilities of "or" events are added, not subtracted.',
        null,
      ],
      keyIdea: 'For "or", use $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, where $P(A \\cap B)$ is the chance of both. If the events are mutually exclusive, that overlap is 0, so just add.',
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
      'Two cards, no replacement: "first is an Ace", "second is an Ace"',
      'One die: "shows an even number", "shows 2"',
      'A die and a coin: "die shows 6", "coin shows heads"',
      'One die: "less than 3", "greater than 4"',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'In which pair does one event have no effect on the chance of the other?',
      solution:
        'Two events are **independent** if knowing that one happened doesn\'t change the chance of the other.\n\n' +
        'Ask of each pair: does knowing the first change the chance of the second? Only the die and the coin get a no, because they are separate objects:\n\n| Pair | Does the first change the second? |\n|---|---|\n| First and second card are Aces | Yes: after an Ace, only 3 of the 51 cards left are Aces |\n| One die: even, and shows 2 | Yes: knowing it is even raises the chance of 2 from $\\frac{1}{6}$ to $\\frac{1}{3}$ |\n| Die shows 6, coin shows heads | No: heads stays $\\frac{1}{2}$ whatever the die shows |\n| One die: less than 3, greater than 4 | Yes: if it is less than 3, it can\'t be greater than 4 |',
      conclusion: 'The die can\'t affect the coin, so the answer is A die and a coin: "die shows 6", "coin shows heads".',
      whyWrong: [
        'Without replacement, the first card changes what is left: after an Ace, only 3 of the 51 remaining cards are Aces. So the events are dependent.',
        'If the number is 2 it is certainly even, so knowing one event changes the other. $P(\\text{both}) = \\frac{1}{6}$, not $\\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}$.',
        null,
        'These events are **mutually exclusive**, which is not the same as independent. If one happens the other becomes impossible, so knowing one changes the other: $P(\\text{both}) = 0 \\ne \\frac{1}{3} \\times \\frac{1}{3}$.',
      ],
      keyIdea: 'To test independence, ask whether one event changes the chance of the other, or check $P(A \\cap B) = P(A) \\times P(B)$, where $P(A \\cap B)$ is the chance of both. Separate objects are independent. Mutually exclusive events, which can\'t happen together, are not.',
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
      asking: 'How likely are exactly two heads in three coin tosses?',
      solution:
        'List every possible result. Each toss has 2 results, so three tosses give $2 \\times 2 \\times 2 = 8$ outcomes, all equally likely because the coin is fair:\n\n- HHH, HHT, HTH, THH\n- HTT, THT, TTH, TTT\n\n' +
        'Pick out the outcomes with exactly two heads: HHT, HTH and THH. That is 3 outcomes. HHH doesn\'t count, because it has three heads.\n\n' +
        'Probability $=$ outcomes we want $\\div$ all outcomes $= \\frac{3}{8}$.',
      conclusion: '3 of the 8 equally likely outcomes have exactly two heads, so the answer is $\\frac{3}{8}$.',
      whyWrong: [
        null,
        'This counts only HHT and forgets the tail can come in any of the 3 positions (HHT, HTH, THH).',
        'This treats "0, 1, 2 or 3 heads" as 4 equally likely results. They are not equally likely: 2 heads can happen in 3 ways but 3 heads in only 1 way.',
        'This is $\\frac{4}{8}$, the probability of **at least** two heads: it wrongly includes HHH.',
      ],
      keyIdea: 'With a few coin tosses, list all $2^n$ outcomes for $n$ tosses and count the ones you want. With more tosses, the number of outcomes with exactly $r$ heads is $\\binom{n}{r}$, the number of ways to choose which $r$ tosses are heads.',
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
      asking: 'How likely is a total of 8 on two dice?',
      solution:
        'Think of a first die and a second die. Each has 6 faces, so there are $6 \\times 6 = 36$ equally likely ordered pairs. For example, $(2,6)$ means first 2, second 6, and it is different from $(6,2)$.\n\n' +
        'Go through the first die and find what the second die must be to make 8:\n\n| First die | Second die needed | Pair |\n|---|---|---|\n| 1 | 7, which is impossible | none |\n| 2 | 6 | $(2,6)$ |\n| 3 | 5 | $(3,5)$ |\n| 4 | 4 | $(4,4)$ |\n| 5 | 3 | $(5,3)$ |\n| 6 | 2 | $(6,2)$ |\n\n' +
        'That is 5 pairs out of 36, so the probability is $\\frac{5}{36}$.',
      conclusion: '5 of the 36 equally likely pairs add up to 8, so the answer is $\\frac{5}{36}$.',
      whyWrong: [
        null,
        'This treats the 11 possible totals $2, 3, \\dots, 12$ as equally likely. They are not: a total of 7 can be made 6 ways but a total of 2 only 1 way.',
        'This is $\\frac{3}{36}$: it counts $\\{2,6\\}$, $\\{3,5\\}$, $\\{4,4\\}$ as single outcomes and forgets that $(2,6)$ and $(6,2)$ are different outcomes (and so are $(3,5)$ and $(5,3)$).',
        'This is $\\frac{4}{36}$: it counts $(2,6)$, $(6,2)$, $(3,5)$, $(5,3)$ but misses the double $(4,4)$.',
      ],
      keyIdea: 'For two dice, always use the 36 ordered pairs, not the totals 2 to 12, which aren\'t equally likely. For each first-die value, write what the second die must be, then count.',
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
      asking: 'How likely is it that at least one of the two dice shows a six?',
      solution:
        '"At least one six" has several cases: a six on the first die, on the second, or on both. The opposite is one simple case: no sixes. The two add up to 1, so $P(\\text{at least one}) = 1 - P(\\text{none})$.\n\n' +
        'One die avoids a six with probability $\\frac{5}{6}$, because 5 of its 6 faces are not six.\n\n' +
        'The dice don\'t affect each other, so multiply: $P(\\text{none}) = \\frac{5}{6} \\times \\frac{5}{6} = \\frac{25}{36}$.\n\n' +
        'Subtract from 1, writing 1 as $\\frac{36}{36}$: $\\frac{36}{36} - \\frac{25}{36} = \\frac{11}{36}$.',
      conclusion: 'No sixes has probability $\\frac{25}{36}$, and every other roll has a six, so the answer is $\\frac{11}{36}$.',
      whyWrong: [
        'This is $\\frac{1}{6} + \\frac{1}{6} = \\frac{12}{36}$: it double counts the outcome $(6,6)$, which has a six on both dice.',
        null,
        'This is $P(\\text{no sixes})$: the last step, subtracting from $1$, was forgotten.',
        'This is $\\frac{1}{6} \\times \\frac{1}{6}$, the probability that **both** dice show a six, not at least one.',
      ],
      keyIdea: 'When you see "at least one", work out the chance of none and subtract from 1. For repeated independent tries, $P(\\text{none})$ is the one-try "no" chance multiplied once per try.',
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
      asking: 'What is the chance of $A$ or $B$, given the chance of each and the chance of both?',
      solution:
        '$P(A \\cup B)$ means $A$ or $B$ or both happen. $P(A \\cap B)$ means both happen.\n\n' +
        'If we add $P(A) + P(B)$, the outcomes where both happen get counted twice: once in $A$ and once in $B$. So we subtract the overlap once. This is the **addition rule**:\n\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n\n' +
        'Substitute the numbers: $P(A \\cup B) = 0.5 + 0.4 - 0.15$.\n\n' +
        'Work it out from left to right: $0.5 + 0.4 = 0.9$, then $0.9 - 0.15 = 0.75$.',
      conclusion: 'Adding the two chances and removing the overlap once gives the answer, $0.75$.',
      whyWrong: [
        'This is $0.5 + 0.4$: it forgets to subtract the overlap, so outcomes in both $A$ and $B$ are counted twice.',
        'This is $0.9 - 2 \\times 0.15$: subtracting the overlap **twice** removes it completely. That is the probability of **exactly one** of the events, not $A$ or $B$.',
        'This is $1 - 0.75 = P(\\text{neither})$, the complement of the answer.',
        null,
      ],
      keyIdea: 'Given any three of $P(A)$, $P(B)$, $P(A \\cap B)$ and $P(A \\cup B)$, substitute them into the addition rule $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ and solve for the fourth.',
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
      asking: 'How likely is it that one card is a King, a heart, or both?',
      solution:
        'A deck has 4 Kings and 13 hearts. Adding them gives $4 + 13 = 17$.\n\n' +
        'But the King of hearts is in both groups, so it has been counted twice. Take off 1 so that it counts once: $17 - 1 = 16$.\n\n' +
        'So 16 of the 52 cards work. Simplify by dividing top and bottom by 4: $\\frac{16}{52} = \\frac{4}{13}$.',
      conclusion: '16 different cards are a King or a heart, so the answer is $\\frac{4}{13}$.',
      whyWrong: [
        null,
        'This is $\\frac{4 + 13}{52}$: the King of hearts has been counted twice (once as a King, once as a heart).',
        'This is the probability of a King **and** a heart (only the King of hearts), not King **or** heart.',
        'This is $\\frac{13}{52}$, only the hearts. The 3 Kings that are not hearts also count.',
      ],
      keyIdea: 'For "this or that" with cards, count each group, then subtract any card that is in both. This is the rule $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ in counting form, where $\\cup$ means "or" and $\\cap$ means "both".',
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
      asking: 'What is the chance of $A$ or $B$ when the two events don\'t affect each other?',
      solution:
        'Use the addition rule for "or": $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. Here $P(A \\cap B)$ is the chance of both, which we subtract so that it isn\'t counted twice.\n\n' +
        'We aren\'t given $P(A \\cap B)$. But **independent** events let us multiply: $P(A \\cap B) = P(A) \\times P(B) = 0.6 \\times 0.3 = 0.18$.\n\n' +
        'Substitute into the rule: $P(A \\cup B) = 0.6 + 0.3 - 0.18$.\n\n' +
        'Work it out: $0.6 + 0.3 = 0.9$, then $0.9 - 0.18 = 0.72$.',
      conclusion: 'The overlap is $0.18$, and removing it from the total of $0.9$ gives the answer, $0.72$.',
      whyWrong: [
        'This is $P(A \\cap B) = 0.6 \\times 0.3$, the probability of both, not of $A$ or $B$.',
        null,
        'This is $0.6 + 0.3$: it treats the events as mutually exclusive. Independent events can happen together, so the overlap $0.18$ must be subtracted.',
        'This is $0.4 \\times 0.7 = P(\\text{neither})$: the final step $1 - 0.28$ was forgotten.',
      ],
      keyIdea: 'For independent events, find the overlap by multiplying, $P(A \\cap B) = P(A) \\times P(B)$, then use the addition rule. You can confirm with $1 - P(\\text{neither})$, which here is $1 - 0.4 \\times 0.7$.',
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
    stem: 'In a class of 30 students, 17 study French, 12 study Spanish and 4 study both. What is the probability that a randomly chosen student studies **neither** language?',
    options: ['$\\frac{1}{30}$', '$\\frac{3}{10}$', '$\\frac{2}{15}$', '$\\frac{1}{6}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What fraction of the class study neither French nor Spanish?',
      solution:
        'Adding French and Spanish gives $17 + 12 = 29$. But the 4 students who study both were counted twice.\n\n' +
        'Take off those 4 once, so that each student counts once: $29 - 4 = 25$. So 25 students study at least one language.\n\n' +
        'The rest of the class study neither: $30 - 25 = 5$.\n\n' +
        'The probability is the fraction of the class. Simplify by dividing top and bottom by 5: $\\frac{5}{30} = \\frac{1}{6}$.',
      conclusion: '5 of the 30 students study neither language, so the answer is $\\frac{1}{6}$.',
      whyWrong: [
        'This uses $30 - (17 + 12) = 1$: the 4 students who study both were counted twice.',
        'This subtracts the overlap twice: $17 + 12 - 8 = 21$, leaving $9$, and $\\frac{9}{30} = \\frac{3}{10}$. The overlap should be subtracted only once.',
        'This is $\\frac{4}{30}$, the probability of studying **both** languages: the wrong region of the Venn diagram.',
        null,
      ],
      keyIdea: 'Draw a Venn diagram (two overlapping circles) and fill in the overlap first. Here French only is $17 - 4$ and Spanish only is $12 - 4$. Neither is whatever is left of the total.',
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
      asking: 'What is the chance that $A$ happens without $B$?',
      solution:
        'In $P(A \\cap B\')$, the mark $\'$ means "not", so this is $A$ and not $B$. Picture two overlapping circles: we want the part of circle $A$ outside the overlap.\n\n' +
        'First find the overlap, $P(A \\cap B)$, from the addition rule, where $P(A \\cup B)$ means $A$ or $B$ or both: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. Substitute: $0.6 = 0.45 + 0.35 - P(A \\cap B)$.\n\n' +
        'Add the two numbers: $0.6 = 0.8 - P(A \\cap B)$. Rearrange to get the overlap alone: $P(A \\cap B) = 0.8 - 0.6 = 0.2$.\n\n' +
        'Circle $A$ is made of the overlap and the part outside it. So remove the overlap from $A$: $P(A \\cap B\') = 0.45 - 0.2 = 0.25$.',
      conclusion: 'Circle $A$ holds $0.45$ and the overlap holds $0.2$ of that, so the answer is $0.25$.',
      whyWrong: [
        'This is $P(A \\cap B)$, the overlap, where both happen. The question wants $A$ **without** $B$.',
        'This is $0.6 - 0.45 = P(B \\text{ only})$: the roles of $A$ and $B$ were swapped.',
        null,
        'This is $0.45$, the whole of event $A$, which still includes the overlap where $B$ also happens.',
      ],
      keyIdea: 'For "$A$ but not $B$", use $P(A \\cap B\') = P(A) - P(A \\cap B)$. If the overlap isn\'t given, find it first from the addition rule.',
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
      asking: 'Are $A$ and $B$ mutually exclusive, independent, both or neither?',
      solution:
        'Test **mutually exclusive** first. That means the events can\'t happen together, so $P(A \\cap B)$, the chance of both, would be 0. Here it is $0.12$, so they are not mutually exclusive.\n\n' +
        'Now test **independent**. That means the chance of both equals the two chances multiplied: $P(A \\cap B) = P(A) \\times P(B)$.\n\n' +
        'Multiply: $0.3 \\times 0.4 = 0.12$. This matches the given $P(A \\cap B) = 0.12$, so they are independent.',
      conclusion: '$0.12$ isn\'t 0 but does equal the product, so $A$ and $B$ are independent but not mutually exclusive.',
      whyWrong: [
        'Mutually exclusive events have $P(A \\cap B) = 0$, but here it is $0.12$, so $A$ and $B$ can happen together.',
        'This is impossible here: mutually exclusive would need $P(A \\cap B) = 0$, while independence needs $P(A \\cap B) = 0.12$. Events with non-zero probabilities can never be both.',
        'The independence test was skipped: $0.3 \\times 0.4 = 0.12$, which equals $P(A \\cap B)$, so they are independent.',
        null,
      ],
      keyIdea: 'Run two tests on $P(A \\cap B)$. If it equals 0, the events are mutually exclusive. If it equals $P(A) \\times P(B)$, they are independent. Events with non-zero probabilities can\'t pass both.',
    },
  },
  {
    id: 'probability-basics-014',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'A player scores each free throw with probability $0.8$, independently of the others. She takes 3 free throws. What is the probability that she **misses at least one**?',
    options: ['$0.488$', '$0.6$', '$0.008$', '$0.512$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How likely is it that she misses one or more of her 3 throws?',
      solution:
        '"Misses at least one" has several cases. The opposite is one case: she scores all three. So $P(\\text{misses at least one}) = 1 - P(\\text{scores all three})$.\n\n' +
        '**Independently** means one throw doesn\'t affect the next, so we multiply: $P(\\text{scores all three}) = 0.8 \\times 0.8 \\times 0.8$.\n\n' +
        'Work it out: $0.8 \\times 0.8 = 0.64$, then $0.64 \\times 0.8 = 0.512$.\n\n' +
        'Subtract from 1: $1 - 0.512 = 0.488$.',
      conclusion: 'Scoring all three has probability $0.512$, and every other result has a miss, so the answer is $0.488$.',
      whyWrong: [
        null,
        'This is $3 \\times 0.2$: adding the miss probabilities double counts the outcomes with two or three misses. Use the complement instead.',
        'This is $0.2^3$, the probability she misses **all three**, not at least one.',
        'This is $0.8^3$, the probability she scores all three: the final step, subtracting from $1$, was forgotten.',
      ],
      keyIdea: 'To find "at least one" of something, take the opposite event (not a single one). Work out its probability by multiplying across the tries, then subtract from 1.',
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
    id: 'probability-basics-016',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    stem: 'Events $A$ and $B$ are **independent**. $P(A) = 0.4$ and $P(A \\cup B) = 0.7$. Find $P(B)$.',
    options: ['$0.3$', '$0.75$', '$0.25$', '$0.5$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Find the chance of $B$, given the chance of $A$ and the chance of $A$ or $B$.',
      solution:
        'We want $P(B)$, so call it $p$. That is the unknown we will solve for.\n\n' +
        '**Independent** means the chance of both is a product: $P(A \\cap B) = 0.4 \\times p = 0.4p$.\n\n' +
        'Put everything into the addition rule, $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$: $0.7 = 0.4 + p - 0.4p$.\n\n' +
        'Collect the $p$ terms, since $p - 0.4p = 0.6p$: $0.7 = 0.4 + 0.6p$.\n\n' +
        'Subtract $0.4$ from both sides to get the $p$ term alone: $0.3 = 0.6p$.\n\n' +
        'Divide both sides by $0.6$ to get $p$ alone: $p = 0.3 \\div 0.6 = 0.5$.',
      conclusion: 'Checking: $0.4 + 0.5 - 0.4 \\times 0.5 = 0.7$, which matches the question, so the answer is $0.5$.',
      whyWrong: [
        'This is $0.7 - 0.4$: it treats $A$ and $B$ as mutually exclusive and ignores the overlap $P(A \\cap B) = 0.4p$.',
        'This divides $0.3$ by $0.4$ instead of by $1 - 0.4 = 0.6$ after collecting the $p$ terms. Check: $0.4 + 0.75 - 0.3 = 0.85$, not $0.7$.',
        'This sets $P(\\text{neither}) = 0.3$ equal to $0.4(1 - p)$, using $0.4$ (the probability of $A$) where $0.6$ (the probability of not $A$) belongs. Check: $0.4 + 0.25 - 0.1 = 0.55$, not $0.7$.',
        null,
      ],
      keyIdea: 'When a probability is missing, call it $p$ and write the addition rule with the numbers in. Use $P(A \\cap B) = P(A) \\times p$ if the events are independent. Then solve the equation for $p$.',
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
    difficulty: 'exam',
    stem: 'For two events, $P(A) = 0.5$ and $P(B) = 0.3$. The probability that **neither** $A$ nor $B$ happens is $0.3$. Find $P(A \\cap B)$.',
    options: ['$0.1$', '$0.15$', '$0$', '$0.4$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Find the chance that both $A$ and $B$ happen.',
      solution:
        'Every outcome is either in $A$ or $B$ (or both), or in neither. So $P(A \\cup B) = 1 - P(\\text{neither})$, where $P(A \\cup B)$ means the chance of $A$ or $B$ or both.\n\n' +
        'Substitute: $P(A \\cup B) = 1 - 0.3 = 0.7$.\n\n' +
        'Use the addition rule, $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. Substitute: $0.7 = 0.5 + 0.3 - P(A \\cap B)$, so $0.7 = 0.8 - P(A \\cap B)$.\n\n' +
        'Rearrange to get the overlap alone: $P(A \\cap B) = 0.8 - 0.7 = 0.1$.',
      conclusion: 'The two events add up to $0.8$ but cover only $0.7$, so the overlap is $0.1$.',
      whyWrong: [
        null,
        'This is $0.5 \\times 0.3$, which assumes $A$ and $B$ are independent. Nothing in the question says so; the overlap must come from the given information.',
        'This assumes $A$ and $B$ are mutually exclusive. Then $P(A \\cup B)$ would be $0.8$ and neither would be $0.2$, not $0.3$.',
        'This is $0.5 - 0.1 = 0.4$, the probability of $A$ only (the part of $A$ outside $B$), not the overlap.',
      ],
      keyIdea: 'When "neither" is given, first find $P(A \\cup B) = 1 - P(\\text{neither})$. Then the overlap is $P(A) + P(B) - P(A \\cup B)$. Don\'t assume independence unless the question says so.',
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
    id: 'probability-basics-019',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'Which of these values **cannot** be a probability?',
    options: ['$1.2$', '$0$', '$1$', '$0.5$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which number is impossible as a probability?',
      solution:
        'A probability measures how likely something is, on a scale from 0 (impossible) to 1 (certain). Nothing can be less likely than impossible or more likely than certain.\n\n' +
        'Check each value against that scale. $0$, $0.5$ and $1$ are all on it, but $1.2$ is bigger than 1, which would mean "more than certain".',
      conclusion: '$1.2$ is the only value above 1, so it can\'t be a probability.',
      whyWrong: [
        null,
        '$0$ is allowed: it is the probability of an impossible event.',
        '$1$ is allowed: it is the probability of a certain event.',
        '$0.5$ lies between $0$ and $1$: it is the probability of a fair coin landing heads.',
      ],
      keyIdea: 'A valid probability $p$ must satisfy $0 \\le p \\le 1$. Reject any negative value or anything over 1, and use this to catch errors in your own working.',
    },
    check: {
      optionValues: [1.2, 0, 1, 0.5],
      compute: () => [0, 0.5, 1, 1.2].filter((p) => p < 0 || p > 1)[0],
    },
  },
  {
    id: 'probability-basics-020',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'Two events are **mutually exclusive** when:',
    options: ['They cannot both happen', 'One does not affect the other', 'Their probabilities add up to $1$', 'They have equal probabilities'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does "mutually exclusive" mean?',
      solution:
        '**Mutually exclusive** describes two events where one happening rules out the other.\n\n' +
        'For example, on one die roll, "shows 2" and "shows 5" are mutually exclusive, because a single roll can\'t show both numbers.',
      conclusion: 'One roll can\'t give both results, which is the definition: They cannot both happen.',
      whyWrong: [
        null,
        'This describes **independent** events, which is a different idea.',
        'This is true for an event and its complement, but mutually exclusive events need not add up to $1$: "shows 2" and "shows 5" add up to $\\frac{1}{3}$.',
        'The size of the probabilities does not matter. Only whether the events can happen together matters.',
      ],
      keyIdea: 'Test with the question "can both happen at once?". If not, they are mutually exclusive and $P(A \\cap B)$, the chance of both, is 0. Don\'t mix this up with independent, which means one doesn\'t affect the other.',
    },
  },
  {
    id: 'probability-basics-021',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    stem: 'If $P(A) = p$, what is $P(A\')$, the probability that $A$ does **not** happen?',
    options: ['$1 - p$', '$p - 1$', '$\\frac{1}{p}$', '$-p$'],
    correctIndex: 0,
    markScheme: {
      asking: 'If the chance of $A$ is $p$, what is the chance that $A$ doesn\'t happen?',
      solution:
        '$A$ either happens or doesn\'t, and exactly one of these must be true. So their probabilities add up to 1: $P(A) + P(A\') = 1$, where $A\'$ means "not $A$".\n\n' +
        'Take $P(A)$ from both sides to get $P(A\')$ alone: $P(A\') = 1 - P(A)$. Since $P(A) = p$, that is $1 - p$.',
      conclusion: 'The two chances add up to 1, so $P(A\') = 1 - p$.',
      whyWrong: [
        null,
        'This subtracts the wrong way round, and gives a negative value, which cannot be a probability.',
        'A reciprocal has no place here: with $p = 0.5$ it would give $2$, which cannot be a probability.',
        'This is negative, and a probability is never negative. The two probabilities add up to $1$, not to $0$.',
      ],
      keyIdea: 'Use the complement rule $P(A\') = 1 - P(A)$ whenever "not" appears. Test a formula with a number: for $p = 0.3$, the answer must be $0.7$, which is a valid probability.',
    },
    check: {
      // p = 0.3
      optionValues: [1 - 0.3, 0.3 - 1, 1 / 0.3, -0.3],
      compute: () => {
        const outcomes = Array.from({ length: 10 }, (_, i) => i);
        return outcomes.filter((x) => !(x < 3)).length / outcomes.length;
      },
    },
  },];
