import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { factorial } from '../../../lib/mathx';

// ---- brute-force helpers used ONLY by the answer checks (independent of the formulas) ----

/** Every ordering of the items 0..n-1 (n is small in these checks). */
function allOrders(n: number): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const used = new Array<boolean>(n).fill(false);
  const rec = () => {
    if (cur.length === n) {
      out.push(cur.slice());
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      cur.push(i);
      rec();
      cur.pop();
      used[i] = false;
    }
  };
  rec();
  return out;
}

/** Number of k-element subsets of {0..n-1} satisfying pred (bitmask enumeration). */
function countSubsets(n: number, k: number, pred: (members: number[]) => boolean = () => true): number {
  let c = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    const members: number[] = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) members.push(i);
    if (members.length === k && pred(members)) c++;
  }
  return c;
}

/** Number of DISTINCT arrangements of the letters of `word` satisfying pred (multiset backtracking). */
function countWordArrangements(word: string, pred: (s: string) => boolean = () => true): number {
  const counts = new Map<string, number>();
  for (const ch of word) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  const letters = [...counts.keys()];
  let c = 0;
  const rec = (s: string) => {
    if (s.length === word.length) {
      if (pred(s)) c++;
      return;
    }
    for (const L of letters) {
      const left = counts.get(L)!;
      if (left === 0) continue;
      counts.set(L, left - 1);
      rec(s + L);
      counts.set(L, left);
    }
  };
  rec('');
  return c;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'counting-001',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'Without using the factorial button on your calculator, find the value of $\\frac{8!}{6!}$.',
    options: ['$2$', '$336$', '$56$', '$\\frac{4}{3}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write both factorials out as products:\n\n' +
        '$$\\frac{8!}{6!} = \\frac{8 \\times 7 \\times 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1}{6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1}$$\n\n' +
        'Everything from $6$ down to $1$ appears on the top and the bottom, so it cancels. What is left is\n\n' +
        '$$\\frac{8!}{6!} = 8 \\times 7 = 56$$\n\n' +
        'Check on a calculator: $8! = 40320$ and $6! = 720$, and $40320 \\div 720 = 56$.',
      whyWrong: [
        'This is $(8 - 6)! = 2! = 2$. Factorials do not divide by subtracting the numbers; you must write them out and cancel.',
        'This is $8 \\times 7 \\times 6$: one factor too many. The $6$ is part of $6!$ on the bottom, so it cancels too.',
        null,
        'This is $\\frac{8}{6}$ simplified, as if the "!" signs just cancel. They do not: $8!$ and $6!$ are products, not the numbers $8$ and $6$.',
      ],
      keyIdea: 'A ratio of factorials cancels down to a short product: $\\frac{n!}{(n-2)!} = n(n-1)$.',
    },
    check: {
      optionValues: [2, 336, 56, 4 / 3],
      compute: () => factorial(8) / factorial(6),
    },
  },
  {
    id: 'counting-002',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'A restaurant menu has 4 starters, 5 main courses and 3 desserts. A set meal is **one** starter, **one** main course and **one** dessert. How many different set meals are possible?',
    options: ['$12$', '$60$', '$220$', '$1320$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'This is the **multiplication principle**: when you make several choices one after another, multiply the number of options at each stage.\n\n' +
        '- Choose a starter: $4$ ways\n' +
        '- For each starter, choose a main: $5$ ways\n' +
        '- For each of those, choose a dessert: $3$ ways\n\n' +
        'Total: $4 \\times 5 \\times 3 = 60$ different set meals.',
      whyWrong: [
        'This adds the choices: $4 + 5 + 3 = 12$. Adding is for "one thing **or** another"; here you choose a starter **and** a main **and** a dessert, so multiply.',
        null,
        'This is $\\binom{12}{3} = 220$: choosing any 3 dishes from all 12. That ignores the rule that you need exactly one dish from each course.',
        'This is $12 \\times 11 \\times 10 = 1320$: picking 3 dishes in order from all 12. The courses are already fixed, and you cannot have three desserts.',
      ],
      keyIdea: 'Multiplication principle: independent stages with $a$, $b$ and $c$ options give $a \\times b \\times c$ outcomes.',
    },
    check: {
      optionValues: [12, 60, 220, 1320],
      compute: () => {
        let c = 0;
        for (let s = 0; s < 4; s++) for (let mn = 0; mn < 5; mn++) for (let d = 0; d < 3; d++) c++;
        return c;
      },
    },
  },
  {
    id: 'counting-003',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'Ten runners take part in a race. In how many different ways can the gold, silver and bronze medals be awarded? (There are no ties, and a runner can win at most one medal.)',
    options: ['$120$', '$1000$', '$30$', '$720$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The medals are different, so **order matters**: Ali gold and Bea silver is not the same as Bea gold and Ali silver. This is a permutation.\n\n' +
        '- Gold: any of $10$ runners\n' +
        '- Silver: any of the $9$ runners left\n' +
        '- Bronze: any of the $8$ runners left\n\n' +
        '$${}^{10}P_{3} = 10 \\times 9 \\times 8 = 720$$\n\n' +
        'Using the formula: ${}^{10}P_{3} = \\frac{10!}{7!} = 720$.',
      whyWrong: [
        'This is $\\binom{10}{3} = 120$, which only counts **which** three runners get medals. It ignores who gets gold, silver and bronze, but the medals are different.',
        'This is $10^3 = 1000$, which lets the same runner win more than one medal. After gold is given, only 9 runners are left for silver.',
        'This is $10 \\times 3 = 30$. Counting choices means multiplying the options at each stage ($10$, then $9$, then $8$), not multiplying by the number of medals.',
        null,
      ],
      keyIdea: 'When order matters and nothing is repeated, use ${}^{n}P_{r} = n(n-1)\\cdots(n-r+1)$.',
    },
    check: {
      optionValues: [120, 1000, 30, 720],
      compute: () => {
        let c = 0;
        for (let g = 0; g < 10; g++)
          for (let s = 0; s < 10; s++)
            for (let b = 0; b < 10; b++) if (g !== s && s !== b && g !== b) c++;
        return c;
      },
    },
  },
  {
    id: 'counting-004',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'Maya has 9 different books and wants to take 4 of them on holiday. The order of the books does not matter. In how many ways can she choose the 4 books?',
    options: ['$126$', '$3024$', '$36$', '$24$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Only **which** books are chosen matters, not the order, so this is a combination.\n\n' +
        '$$\\binom{9}{4} = \\frac{9!}{4!\\,5!} = \\frac{9 \\times 8 \\times 7 \\times 6}{4 \\times 3 \\times 2 \\times 1} = \\frac{3024}{24} = 126$$\n\n' +
        'Another way to see it: there are $9 \\times 8 \\times 7 \\times 6 = 3024$ ordered choices, and every group of 4 books appears $4! = 24$ times in that list, so divide by $24$.',
      whyWrong: [
        null,
        'This is ${}^{9}P_{4} = 3024$, which counts the books in order. Since the order does not matter, each group of 4 has been counted $4! = 24$ times.',
        'This is $9 \\times 4 = 36$, as if choosing 4 books meant adding up 9 options four times ($9 + 9 + 9 + 9$). A book cannot be chosen twice and the order does not matter, so you need $\\binom{9}{4}$.',
        'This is $4! = 24$, the number of ways to **order** 4 chosen books, not the number of ways to choose them.',
      ],
      keyIdea: 'When order does not matter, use $\\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!}$, which is the number of ordered choices divided by $r!$.',
    },
    check: {
      optionValues: [126, 3024, 36, 24],
      compute: () => countSubsets(9, 4),
    },
  },
  {
    id: 'counting-005',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'How many different arrangements are there of all five letters of the word **MATHS**?',
    options: ['$15$', '$3125$', '$24$', '$120$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The five letters M, A, T, H, S are all different. Fill the five places one at a time:\n\n' +
        '- 1st place: $5$ choices\n' +
        '- 2nd place: $4$ choices left\n' +
        '- 3rd place: $3$ choices\n' +
        '- 4th place: $2$ choices\n' +
        '- 5th place: $1$ choice\n\n' +
        'Total: $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.',
      whyWrong: [
        'This adds the choices: $5 + 4 + 3 + 2 + 1 = 15$. Each place is filled **and then** the next, so multiply.',
        'This is $5^5 = 3125$, which allows the same letter to be used again and again (like MMMMM). Each letter can be used only once.',
        'This is $4! = 24$: one stage too few. All five places must be filled, giving $5!$.',
        null,
      ],
      keyIdea: '$n$ different objects can be arranged in a row in $n!$ ways.',
    },
    check: {
      optionValues: [15, 3125, 24, 120],
      compute: () => countWordArrangements('MATHS'),
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'counting-006',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'How many different arrangements are there of all the letters of the word **BANANA**?',
    options: ['$720$', '$60$', '$120$', '$360$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'BANANA has $6$ letters: A appears $3$ times, N appears $2$ times and B once.\n\n' +
        'If all 6 letters were different there would be $6! = 720$ arrangements. But swapping the three A\'s with each other gives the same word, and so does swapping the two N\'s. So divide by $3!$ for the A\'s and by $2!$ for the N\'s:\n\n' +
        '$$\\frac{6!}{3!\\,2!} = \\frac{720}{6 \\times 2} = \\frac{720}{12} = 60$$',
      whyWrong: [
        'This is $6! = 720$, which treats the three A\'s and the two N\'s as if they were different letters.',
        null,
        'This is $\\frac{6!}{3!} = 120$: it allows for the repeated A\'s but forgets to divide by $2!$ for the two N\'s.',
        'This is $\\frac{6!}{2!} = 360$: it allows for the repeated N\'s but forgets to divide by $3!$ for the three A\'s.',
      ],
      keyIdea: 'With repeated letters, divide $n!$ by $k!$ for every letter that appears $k$ times.',
    },
    check: {
      optionValues: [720, 60, 120, 360],
      compute: () => countWordArrangements('BANANA'),
    },
  },
  {
    id: 'counting-007',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'A committee of 4 people is to be chosen from 6 men and 5 women. In how many ways can this be done if the committee must contain **exactly 2 women**?',
    options: ['$25$', '$330$', '$150$', '$600$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Exactly 2 women means the committee is 2 women **and** 2 men. Choose each part separately, then multiply.\n\n' +
        '- Choose 2 of the 5 women: $\\binom{5}{2} = \\frac{5 \\times 4}{2} = 10$\n' +
        '- Choose 2 of the 6 men: $\\binom{6}{2} = \\frac{6 \\times 5}{2} = 15$\n\n' +
        'Every choice of women can go with every choice of men, so the total is $10 \\times 15 = 150$.',
      whyWrong: [
        'This adds the two parts: $10 + 15 = 25$. You need 2 women **and** 2 men, so multiply.',
        'This is $\\binom{11}{4} = 330$, every committee of 4 with no restriction. Many of those do not have exactly 2 women.',
        null,
        'This is ${}^{5}P_{2} \\times {}^{6}P_{2} = 20 \\times 30 = 600$, which counts the members in order. A committee is just a group, so use combinations.',
      ],
      keyIdea: 'For "exactly k from this group", choose from each group separately with $\\binom{n}{r}$ and multiply.',
    },
    check: {
      optionValues: [25, 330, 150, 600],
      // people 0-5 are men, 6-10 are women
      compute: () => countSubsets(11, 4, (s) => s.filter((p) => p >= 6).length === 2),
    },
  },
  {
    id: 'counting-008',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'Six friends, including Ali and Bea, sit in a row of 6 seats. In how many ways can they sit if Ali and Bea **must sit next to each other**?',
    options: ['$240$', '$120$', '$720$', '$480$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Glue** Ali and Bea together and treat the pair as a single block.\n\n' +
        '1. Now there are $5$ things to arrange: the AB block and the other 4 friends. They can be arranged in $5! = 120$ ways.\n' +
        '2. Inside the block, Ali and Bea can sit as AB or BA: $2! = 2$ ways.\n\n' +
        'Total: $5! \\times 2! = 120 \\times 2 = 240$.',
      whyWrong: [
        null,
        'This is $5! = 120$: it glues the pair together but forgets that Ali and Bea can swap seats inside the block (AB or BA).',
        'This is $6! = 720$, every seating with no restriction at all.',
        'This is $720 - 240 = 480$, the number of seatings where Ali and Bea are **not** next to each other.',
      ],
      keyIdea: '"Must be together": treat the group as one block, arrange the blocks, then multiply by the arrangements inside the block.',
    },
    check: {
      optionValues: [240, 120, 720, 480],
      // seat order lists who sits in seats 0..5; Ali = 0, Bea = 1
      compute: () => allOrders(6).filter((o) => Math.abs(o.indexOf(0) - o.indexOf(1)) === 1).length,
    },
  },
  {
    id: 'counting-009',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'Seven students, including Omar and Sara, stand in a line for a photo. In how many ways can they stand if Omar and Sara must **not** stand next to each other?',
    options: ['$1440$', '$5040$', '$4320$', '$3600$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Counting "not together" directly is messy, so use the **complement**: (all arrangements) minus (arrangements where they are together).\n\n' +
        '1. All arrangements: $7! = 5040$.\n' +
        '2. Together: glue Omar and Sara into one block. That gives $6$ things to arrange, $6! = 720$ ways, and the pair can be OS or SO, $2! = 2$ ways. So $720 \\times 2 = 1440$.\n' +
        '3. Not together: $5040 - 1440 = 3600$.',
      whyWrong: [
        'This is $6! \\times 2! = 1440$, the number of ways in which Omar and Sara **are** next to each other. You still need to subtract it from the total.',
        'This is $7! = 5040$, every arrangement. It ignores the condition completely.',
        'This is $5040 - 720 = 4320$: it subtracts the "together" cases but forgets that Omar and Sara can swap places inside their block, so the "together" count should be $1440$.',
        null,
      ],
      keyIdea: '"Not together" = total arrangements minus "together" arrangements.',
    },
    check: {
      optionValues: [1440, 5040, 4320, 3600],
      compute: () => allOrders(7).filter((o) => Math.abs(o.indexOf(0) - o.indexOf(1)) !== 1).length,
    },
  },
  {
    id: 'counting-010',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'A club has 5 boys and 4 girls. Three members are chosen at random to go to a conference. What is the probability that **all three are girls**?',
    options: ['$\\frac{64}{729}$', '$\\frac{1}{21}$', '$\\frac{4}{9}$', '$\\frac{1}{84}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Every group of 3 is equally likely, so\n\n' +
        '$$P = \\frac{\\text{number of all-girl groups}}{\\text{number of groups of 3}}$$\n\n' +
        '- Groups of 3 from all 9 members: $\\binom{9}{3} = \\frac{9 \\times 8 \\times 7}{3 \\times 2 \\times 1} = 84$\n' +
        '- All-girl groups (3 of the 4 girls): $\\binom{4}{3} = 4$\n\n' +
        'So $P = \\frac{4}{84} = \\frac{1}{21}$.\n\n' +
        'Check with a tree: $\\frac{4}{9} \\times \\frac{3}{8} \\times \\frac{2}{7} = \\frac{24}{504} = \\frac{1}{21}$.',
      whyWrong: [
        'This is $\\left(\\frac{4}{9}\\right)^3$, which assumes each person is put back before the next is chosen. Once a girl is chosen there are fewer girls and fewer people left.',
        null,
        'This is $\\frac{4}{9}$, only the probability that the **first** person chosen is a girl.',
        'This is $\\frac{1}{84}$, which counts only one all-girl group. There are $\\binom{4}{3} = 4$ different groups of 3 girls.',
      ],
      keyIdea: 'Probability = (number of favourable selections) divided by (total number of selections), both counted with $\\binom{n}{r}$.',
    },
    check: {
      optionValues: [64 / 729, 1 / 21, 4 / 9, 1 / 84],
      // members 0-4 are boys, 5-8 are girls
      compute: () => new Frac(countSubsets(9, 3, (s) => s.every((p) => p >= 5)), countSubsets(9, 3)).value(),
    },
  },
  {
    id: 'counting-011',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'Four-digit numbers are made using the digits 1, 2, 3, 4, 5, 6, 7. No digit may be used more than once. How many of these numbers are **even**?',
    options: ['$360$', '$840$', '$1029$', '$120$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A number is even when its **last** digit is even. Deal with the restricted place first.\n\n' +
        '1. Last digit: must be 2, 4 or 6, so $3$ choices.\n' +
        '2. First digit: any of the $6$ digits not yet used.\n' +
        '3. Second digit: $5$ choices left.\n' +
        '4. Third digit: $4$ choices left.\n\n' +
        'Total: $3 \\times 6 \\times 5 \\times 4 = 360$.\n\n' +
        'Sanity check: there are ${}^{7}P_{4} = 840$ numbers in all, and $3$ of the $7$ digits are even, so $840 \\times \\frac{3}{7} = 360$.',
      whyWrong: [
        null,
        'This is ${}^{7}P_{4} = 840$, all four-digit numbers with different digits. It ignores the condition that the number must be even.',
        'This is $7 \\times 7 \\times 7 \\times 3 = 1029$, which lets digits repeat. The question says no digit may be used more than once.',
        'This is $6 \\times 5 \\times 4 = 120$: it fills the other three places but forgets the $3$ choices for the even last digit.',
      ],
      keyIdea: 'Fill the restricted position first, then multiply by the choices left for the other positions.',
    },
    check: {
      optionValues: [360, 840, 1029, 120],
      compute: () => {
        let c = 0;
        for (let a = 1; a <= 7; a++)
          for (let b = 1; b <= 7; b++)
            for (let d = 1; d <= 7; d++)
              for (let e = 1; e <= 7; e++) if (new Set([a, b, d, e]).size === 4 && e % 2 === 0) c++;
        return c;
      },
    },
  },
  {
    id: 'counting-012',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'A login code is made of **2 letters** (A to Z, 26 choices each) followed by **3 digits** (0 to 9). Letters and digits **may be repeated**. How many different codes are possible?',
    options: ['$468\\,000$', '$82$', '$676\\,000$', '$60\\,466\\,176$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'There are 5 positions, and each is filled independently (repeats allowed), so multiply the choices for each position:\n\n' +
        '| Position | 1st letter | 2nd letter | 1st digit | 2nd digit | 3rd digit |\n' +
        '|---|---|---|---|---|---|\n' +
        '| Choices | 26 | 26 | 10 | 10 | 10 |\n\n' +
        '$$26 \\times 26 \\times 10 \\times 10 \\times 10 = 676 \\times 1000 = 676\\,000$$',
      whyWrong: [
        'This is $26 \\times 25 \\times 10 \\times 9 \\times 8 = 468\\,000$, which forbids repeats. The question says letters and digits may be repeated.',
        'This adds the choices: $26 + 26 + 10 + 10 + 10 = 82$. Each position is filled **and** the next, so multiply.',
        null,
        'This is $36^5$, which allows any of the 36 letters or digits in every position. But the first two places must be letters and the last three must be digits.',
      ],
      keyIdea: 'With repetition allowed, each position keeps all its choices: multiply the options position by position.',
    },
    check: {
      optionValues: [468000, 82, 676000, 60466176],
      compute: () => [26, 26, 10, 10, 10].reduce((a, b) => a * b, 1),
    },
  },
  {
    id: 'counting-013',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'count = 0\nfor i in range(8):\n    for j in range(i + 1, 8):\n        count += 1\nprint(count)',
    },
    options: ['`56`', '`64`', '`36`', '`28`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The outer loop runs $i = 0, 1, \\dots, 7$. For each $i$, the inner loop runs $j = i + 1, \\dots, 7$, so it counts each **pair** $i < j$ exactly once.\n\n' +
        '| `i` | values of `j` | inner loop runs |\n' +
        '|---|---|---|\n' +
        '| 0 | 1 to 7 | 7 |\n' +
        '| 1 | 2 to 7 | 6 |\n' +
        '| 2 | 3 to 7 | 5 |\n' +
        '| 3 | 4 to 7 | 4 |\n' +
        '| 4 | 5 to 7 | 3 |\n' +
        '| 5 | 6 to 7 | 2 |\n' +
        '| 6 | 7 | 1 |\n' +
        '| 7 | none | 0 |\n\n' +
        'Adding the last column (the final row adds nothing): `count` $= 7 + 6 + 5 + 4 + 3 + 2 + 1 = 28$.\n\n' +
        'This is exactly the number of ways to choose 2 items from 8: $\\binom{8}{2} = \\frac{8 \\times 7}{2} = 28$. The code prints `28`.',
      whyWrong: [
        'This is $8 \\times 7 = 56$, the number of **ordered** pairs with $i \\ne j$. The inner loop only uses $j > i$, so each pair is counted once, not twice.',
        'This is $8 \\times 8 = 64$, as if the inner loop ran over all 8 values every time. It starts at `i + 1`, so it gets shorter each time.',
        'This is $8 + 7 + \\dots + 1 = 36$, as if the inner loop were `range(i, 8)`, which would also count $j = i$. Because it starts at `i + 1`, the pairs with $j = i$ are skipped.',
        null,
      ],
      keyIdea: 'A double loop over $j > i$ visits every unordered pair once, so it runs $\\binom{n}{2}$ times.',
    },
    check: {
      optionValues: [56, 64, 36, 28],
      compute: () => {
        let count = 0;
        for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) count++;
        return count;
      },
    },
    python: { stdout: '28\n' },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'counting-014',
    subtopic: 'counting',
    difficulty: 'challenge',
    stem: 'A team of 3 is chosen from 5 men and 4 women. In how many ways can the team be chosen if it must include **at least one woman**?',
    options: ['$112$', '$74$', '$84$', '$10$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '"At least one" is easiest with the **complement**: (all teams) minus (teams with no women).\n\n' +
        '1. All teams of 3 from 9 people: $\\binom{9}{3} = \\frac{9 \\times 8 \\times 7}{3 \\times 2 \\times 1} = 84$.\n' +
        '2. Teams with **no** women (all 3 from the 5 men): $\\binom{5}{3} = 10$.\n' +
        '3. At least one woman: $84 - 10 = 74$.\n\n' +
        'Check by cases: exactly 1 woman $\\binom{4}{1}\\binom{5}{2} = 40$, exactly 2 women $\\binom{4}{2}\\binom{5}{1} = 30$, exactly 3 women $\\binom{4}{3} = 4$. Total $40 + 30 + 4 = 74$.',
      whyWrong: [
        'This is $4 \\times \\binom{8}{2} = 4 \\times 28 = 112$: "pick one woman, then any 2 others". It double counts: a team with two women, such as Hana and Noor, is counted once when Hana is picked first and again when Noor is picked first.',
        null,
        'This is $\\binom{9}{3} = 84$, every possible team. It forgets to remove the 10 all-male teams.',
        'This is $\\binom{5}{3} = 10$, the number of teams with **no** women: the complement, not the answer.',
      ],
      keyIdea: '"At least one" = total minus "none"; never "pick one, then pick the rest from everyone", which double counts.',
    },
    check: {
      optionValues: [112, 74, 84, 10],
      // people 0-4 are men, 5-8 are women
      compute: () => countSubsets(9, 3, (s) => s.some((p) => p >= 5)),
    },
  },
  {
    id: 'counting-015',
    subtopic: 'counting',
    difficulty: 'challenge',
    stem: 'The word **STATISTICS** has 10 letters. How many different arrangements of all its letters **begin and end with S**?',
    options: ['$50\\,400$', '$6720$', '$3360$', '$20\\,160$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Count the letters in STATISTICS: S $\\times 3$, T $\\times 3$, I $\\times 2$, A $\\times 1$, C $\\times 1$ (total $10$).\n\n' +
        '1. Put an S in the first place and an S in the last place. Because the S\'s are identical, there is only **one** way to do this.\n' +
        '2. The 8 letters left for the middle are: S $\\times 1$, T $\\times 3$, I $\\times 2$, A $\\times 1$, C $\\times 1$.\n' +
        '3. Arrange these 8 letters, dividing for the repeats:\n\n' +
        '$$\\frac{8!}{3!\\,2!} = \\frac{40320}{6 \\times 2} = \\frac{40320}{12} = 3360$$',
      whyWrong: [
        'This is $\\frac{10!}{3!\\,3!\\,2!} = 50\\,400$, every arrangement of STATISTICS. It ignores the condition about the first and last letters.',
        'This is $\\frac{8!}{3!} = 6720$: it divides for the three T\'s but forgets the two I\'s, which are also repeated.',
        null,
        'This is $3360 \\times 3 \\times 2 = 20\\,160$, which multiplies by the number of ways to choose "which S" goes first and last. The S\'s are identical, so there is only one way to place them.',
      ],
      keyIdea: 'Place the restricted letters first, then arrange what is left, dividing by $k!$ for each letter still repeated $k$ times.',
    },
    check: {
      optionValues: [50400, 6720, 3360, 20160],
      compute: () => countWordArrangements('STATISTICS', (s) => s[0] === 'S' && s[s.length - 1] === 'S'),
    },
  },
  {
    id: 'counting-016',
    subtopic: 'counting',
    difficulty: 'challenge',
    stem: 'Four boys and three girls line up in a random order. What is the probability that the **three girls are all next to each other**?',
    options: ['$\\frac{1}{42}$', '$\\frac{6}{7}$', '$\\frac{1}{35}$', '$\\frac{1}{7}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Treat the 7 people as different people, so every one of the $7! = 5040$ orders is equally likely.\n\n' +
        '1. Favourable orders: glue the 3 girls into one block. That leaves $5$ things to arrange (the block and 4 boys): $5! = 120$ ways.\n' +
        '2. Inside the block the girls can be in $3! = 6$ orders. Favourable total: $120 \\times 6 = 720$.\n' +
        '3. Probability: $\\frac{720}{5040} = \\frac{1}{7}$.\n\n' +
        'Check another way: the girls\' 3 positions are equally likely to be any of the $\\binom{7}{3} = 35$ sets of positions, and $5$ of those sets are three places in a row (starting at place 1, 2, 3, 4 or 5). So $P = \\frac{5}{35} = \\frac{1}{7}$.',
      whyWrong: [
        'This is $\\frac{5!}{7!} = \\frac{120}{5040}$: it glues the girls together but forgets that the girls can be arranged in $3! = 6$ ways inside the block.',
        'This is $1 - \\frac{1}{7}$, the probability that the girls are **not** all together.',
        'This is $\\frac{1}{35}$, which counts only one set of positions for the girls. A block of 3 can start in 5 different places, giving $\\frac{5}{35}$.',
        null,
      ],
      keyIdea: 'Probability from counting: (favourable arrangements) divided by (all arrangements), using the "glue" method for the favourable ones.',
    },
    check: {
      optionValues: [1 / 42, 6 / 7, 1 / 35, 1 / 7],
      // people 4, 5, 6 are the girls
      compute: () => {
        const orders = allOrders(7);
        const fav = orders.filter((o) => {
          const pos = [4, 5, 6].map((g) => o.indexOf(g));
          return Math.max(...pos) - Math.min(...pos) === 2;
        }).length;
        return new Frac(fav, orders.length).value();
      },
    },
  },
  {
    id: 'counting-017',
    subtopic: 'counting',
    difficulty: 'challenge',
    stem: 'From 8 volunteers, a group is formed with a **chair**, a **secretary** and **2 ordinary members** (the two ordinary members have no separate roles). No person can hold two positions. How many different groups are possible?',
    options: ['$840$', '$1680$', '$70$', '$1568$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Fill the named roles first (order matters), then choose the ordinary members (order does not matter).\n\n' +
        '1. Chair: $8$ choices.\n' +
        '2. Secretary: $7$ choices left.\n' +
        '3. Two ordinary members from the $6$ people left, order irrelevant: $\\binom{6}{2} = \\frac{6 \\times 5}{2} = 15$.\n\n' +
        'Total: $8 \\times 7 \\times 15 = 56 \\times 15 = 840$.\n\n' +
        'Check: choose the 4 people, $\\binom{8}{4} = 70$, then pick the chair ($4$ ways) and the secretary ($3$ ways) from them: $70 \\times 4 \\times 3 = 840$.',
      whyWrong: [
        null,
        'This is ${}^{8}P_{4} = 8 \\times 7 \\times 6 \\times 5 = 1680$, which treats the two ordinary members as if they had different roles. Swapping them gives the same group, so this counts every group twice.',
        'This is $\\binom{8}{4} = 70$, which only chooses the 4 people and ignores who is chair and who is secretary.',
        'This is $8 \\times 7 \\times \\binom{8}{2} = 56 \\times 28 = 1568$, which picks the ordinary members from all 8 people, so the chair or secretary could be chosen again.',
      ],
      keyIdea: 'Mix the tools: use ordered choices for distinct roles and $\\binom{n}{r}$ for members whose order does not matter.',
    },
    check: {
      optionValues: [840, 1680, 70, 1568],
      compute: () => {
        let c = 0;
        for (let ch = 0; ch < 8; ch++)
          for (let se = 0; se < 8; se++) {
            if (se === ch) continue;
            for (let a = 0; a < 8; a++)
              for (let b = a + 1; b < 8; b++) if (![ch, se].includes(a) && ![ch, se].includes(b)) c++;
          }
        return c;
      },
    },
  },
  {
    id: 'counting-018',
    subtopic: 'counting',
    difficulty: 'challenge',
    stem: 'Eight people are to be split into **two groups of 4** for a discussion. The two groups are not named or numbered in any way. In how many ways can the split be made?',
    options: ['$70$', '$35$', '$1680$', '$140$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Choose 4 people for "the first group": $\\binom{8}{4} = \\frac{8 \\times 7 \\times 6 \\times 5}{4 \\times 3 \\times 2 \\times 1} = 70$. The other 4 automatically form the second group.\n' +
        '2. But the groups have no names. Choosing {A, B, C, D} (leaving {E, F, G, H}) gives exactly the same split as choosing {E, F, G, H} (leaving {A, B, C, D}). So every split has been counted **twice**.\n' +
        '3. Number of splits: $\\frac{70}{2} = 35$.\n\n' +
        'Quick check: just choose the 3 people who join person A in A\'s group: $\\binom{7}{3} = 35$.',
      whyWrong: [
        'This is $\\binom{8}{4} = 70$, which would be correct if the groups were named (for example "Room 1" and "Room 2"). With unnamed groups, each split is counted twice.',
        null,
        'This is ${}^{8}P_{4} = 1680$, which picks people in order. Order within a group does not matter.',
        'This is $70 \\times 2 = 140$: it multiplies by 2 for "which group is which" when it should divide by 2, because the groups are not named.',
      ],
      keyIdea: 'When groups of equal size are unlabelled, divide by the number of ways to order the groups.',
    },
    check: {
      optionValues: [70, 35, 1680, 140],
      // a split is fixed by the 4-person group containing person 0
      compute: () => countSubsets(8, 4, (s) => s.includes(0)),
    },
  },
  {
    id: 'counting-019',
    subtopic: 'counting',
    difficulty: 'challenge',
    stem: 'How many four-digit numbers (from 1000 to 9999) have **four different digits**?',
    options: ['$5040$', '$3024$', '$4536$', '$9000$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The trap is the digit 0: a four-digit number cannot start with 0. Fill the restricted first place first.\n\n' +
        '1. First digit: 1 to 9, so $9$ choices (not 0).\n' +
        '2. Second digit: any digit except the one used, **including 0**: $9$ choices.\n' +
        '3. Third digit: $8$ choices.\n' +
        '4. Fourth digit: $7$ choices.\n\n' +
        'Total: $9 \\times 9 \\times 8 \\times 7 = 4536$.\n\n' +
        'Check: all ordered choices of 4 different digits ${}^{10}P_{4} = 5040$, minus those starting with 0 (${}^{9}P_{3} = 504$), gives $5040 - 504 = 4536$.',
      whyWrong: [
        'This is ${}^{10}P_{4} = 5040$, which allows 0 as the first digit (like 0123), and that is not a four-digit number.',
        'This is ${}^{9}P_{4} = 9 \\times 8 \\times 7 \\times 6 = 3024$, which never uses 0 at all. 0 is allowed in the second, third and fourth places.',
        null,
        'This is $9 \\times 10 \\times 10 \\times 10 = 9000$, every four-digit number, including ones with repeated digits such as 1123.',
      ],
      keyIdea: 'Handle the most restricted position first (here: the first digit cannot be 0), then count the rest.',
    },
    check: {
      optionValues: [5040, 3024, 4536, 9000],
      compute: () => {
        let c = 0;
        for (let x = 1000; x <= 9999; x++) if (new Set(String(x)).size === 4) c++;
        return c;
      },
    },
  },
];
