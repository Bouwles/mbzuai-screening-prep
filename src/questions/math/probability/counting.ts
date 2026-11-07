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
      asking: 'What is $8!$ divided by $6!$, worked out by hand?',
      solution:
        'The **!** sign is called a **factorial**. It means multiply the number by every whole number below it, down to 1. For example, $3! = 3 \\times 2 \\times 1 = 6$.\n\n' +
        'Write the top and the bottom in full:\n\n$$\\frac{8!}{6!} = \\frac{8 \\times 7 \\times 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1}{6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1}$$\n\n' +
        'Everything from 6 down to 1 appears on both the top and the bottom, so all of it cancels. Only $8 \\times 7$ is left on top.\n\n' +
        'Multiply what is left: $8 \\times 7 = 56$.',
      conclusion: 'After cancelling, $\\frac{8!}{6!}$ is just $8 \\times 7$, so the answer is $56$.',
      whyWrong: [
        'This is $(8 - 6)! = 2! = 2$. Factorials do not divide by subtracting the numbers; you must write them out and cancel.',
        'This is $8 \\times 7 \\times 6$: one factor too many. The $6$ is part of $6!$ on the bottom, so it cancels too.',
        null,
        'This is $\\frac{8}{6}$ simplified, as if the "!" signs just cancel. They do not: $8!$ and $6!$ are products, not the numbers $8$ and $6$.',
      ],
      keyIdea: 'To divide factorials, write the bigger one down only as far as the smaller one, then cancel. So $\\frac{n!}{(n-2)!} = n \\times (n-1)$. Stop multiplying just before you reach the bottom number.',
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
    stem: 'A set meal is **one** starter, **one** main course and **one** dessert, from a menu of 4 starters, 5 main courses and 3 desserts. How many different set meals are possible?',
    options: ['$12$', '$60$', '$220$', '$1320$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many different meals can you make by picking one dish from each of the three courses?',
      solution:
        'You make three separate choices: a starter **and** a main **and** a dessert.\n\n' +
        'Start with the first two. Each of the 4 starters can go with any of the 5 mains, so that gives $4 \\times 5 = 20$ starter and main pairs.\n\n' +
        'Each of those 20 pairs can go with any of the 3 desserts, so multiply again: $20 \\times 3 = 60$.',
      conclusion: 'Multiplying the choices for the three courses gives $4 \\times 5 \\times 3$, so the answer is $60$.',
      whyWrong: [
        'This adds the choices: $4 + 5 + 3 = 12$. Adding is for "one thing **or** another"; here you choose a starter **and** a main **and** a dessert, so multiply.',
        null,
        'This is $\\binom{12}{3} = 220$: choosing any 3 dishes from all 12. That ignores the rule that you need exactly one dish from each course.',
        'This is $12 \\times 11 \\times 10 = 1320$: picking 3 dishes in order from all 12. The courses are already fixed, and you cannot have three desserts.',
      ],
      keyIdea: 'When you choose one thing **and** then another, multiply the number of options at each stage. This is the **multiplication principle**. Add only when you choose one thing **or** another.',
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
    stem: 'In how many ways can gold, silver and bronze medals be awarded to 3 of 10 runners, with no ties?',
    options: ['$120$', '$1000$', '$30$', '$720$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How many ways can three different medals go to three of the 10 runners?',
      solution:
        'The medals are different, so order matters. Ali with gold and Bea with silver is a different result from Bea with gold and Ali with silver.\n\n' +
        'Hand out one medal at a time. Gold can go to any of the 10 runners.\n\n' +
        'That runner can\'t also win silver, so silver can go to any of the 9 runners left.\n\n' +
        'Two runners now have medals, so bronze can go to any of the 8 runners left.\n\n' +
        'All three medals are given out, so multiply the choices: $10 \\times 9 \\times 8 = 720$.',
      conclusion: 'Filling the three medal places in turn gives $10 \\times 9 \\times 8$, so the answer is $720$.',
      whyWrong: [
        'This is $\\binom{10}{3} = 120$, which only counts **which** three runners get medals. It ignores who gets gold, silver and bronze, but the medals are different.',
        'This is $10^3 = 1000$, which lets the same runner win more than one medal. After gold is given, only 9 runners are left for silver.',
        'This is $10 \\times 3 = 30$. Counting choices means multiplying the options at each stage ($10$, then $9$, then $8$), not multiplying by the number of medals.',
        null,
      ],
      keyIdea: 'When order matters and nothing can repeat, fill the places one at a time and take one off each time: $n \\times (n-1) \\times (n-2) \\times \\dots$. This is a **permutation**, written ${}^{n}P_{r}$.',
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
    stem: 'In how many ways can 4 books be chosen from 9 different books, if the order does not matter?',
    options: ['$126$', '$3024$', '$36$', '$24$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many different groups of 4 books can you make from 9 books?',
      solution:
        'Order does not matter here, because the same 4 books taken in another order are still the same group. Counting groups like this is called a **combination**.\n\n' +
        'First count as if order did matter. The first book can be any of 9, the next any of 8, then 7, then 6: $9 \\times 8 \\times 7 \\times 6 = 3024$.\n\n' +
        'That counts every group many times. One group of 4 books can be put in order in $4 \\times 3 \\times 2 \\times 1 = 24$ ways, and all 24 were counted separately.\n\n' +
        'So divide by 24 to count each group once: $3024 \\div 24 = 126$.',
      conclusion: 'There are 3024 ordered picks and each group appears 24 times among them, so the answer is $126$.',
      whyWrong: [
        null,
        'This is ${}^{9}P_{4} = 3024$, which counts the books in order. Since the order does not matter, each group of 4 has been counted $4! = 24$ times.',
        'This is $9 \\times 4 = 36$, as if choosing 4 books meant adding up 9 options four times ($9 + 9 + 9 + 9$). A book cannot be chosen twice and the order does not matter, so you need $\\binom{9}{4}$.',
        'This is $4! = 24$, the number of ways to **order** 4 chosen books, not the number of ways to choose them.',
      ],
      keyIdea: 'If order doesn\'t matter, use $\\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!}$, the number of ways to pick $r$ items from $n$. Here $n!$ means $n \\times (n-1) \\times \\dots \\times 1$. In practice: multiply $r$ numbers counting down from $n$, then divide by $r!$.',
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
      asking: 'How many different orders can the five letters of MATHS go in?',
      solution:
        'All five letters are different and each is used once. Imagine five empty places, filled from left to right.\n\n' +
        'The first place can take any of the 5 letters. That leaves 4 letters for the second place, then 3, then 2, then 1.\n\n' +
        'Every place gets filled, so multiply: $5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$. This product is written $5!$ and called 5 factorial.',
      conclusion: 'Arranging 5 different letters gives $5!$ orders, so the answer is $120$.',
      whyWrong: [
        'This adds the choices: $5 + 4 + 3 + 2 + 1 = 15$. Each place is filled **and then** the next, so multiply.',
        'This is $5^5 = 3125$, which allows the same letter to be used again and again (like MMMMM). Each letter can be used only once.',
        'This is $4! = 24$: one stage too few. All five places must be filled, giving $5!$.',
        null,
      ],
      keyIdea: 'To arrange $n$ different things in a row, use $n! = n \\times (n-1) \\times \\dots \\times 1$. Spot this type from words like "arrangements" or "in a row" when every item is used once.',
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
      asking: 'How many different-looking orders can the letters of BANANA go in?',
      solution:
        'Count each letter first. BANANA has 6 letters: A appears 3 times, N appears 2 times and B appears once.\n\n' +
        'If all 6 letters were different, there would be $6! = 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 = 720$ orders.\n\n' +
        'But swapping two A\'s gives the same word, so 720 is too many. The 3 A\'s can swap among themselves in $3! = 6$ ways, and the 2 N\'s in $2! = 2$ ways.\n\n' +
        'So each different word was counted $6 \\times 2 = 12$ times. Divide to count each word once: $720 \\div 12 = 60$.',
      conclusion: 'Dividing out the repeats gives $\\frac{6!}{3! \\times 2!}$, so the answer is $60$.',
      whyWrong: [
        'This is $6! = 720$, which treats the three A\'s and the two N\'s as if they were different letters.',
        null,
        'This is $\\frac{6!}{3!} = 120$: it allows for the repeated A\'s but forgets to divide by $2!$ for the two N\'s.',
        'This is $\\frac{6!}{2!} = 360$: it allows for the repeated N\'s but forgets to divide by $3!$ for the three A\'s.',
      ],
      keyIdea: 'For arrangements with repeated letters, use $\\frac{n!}{a! \\times b! \\times \\dots}$. Here $n$ is the total number of letters, and $a, b, \\dots$ are how many times each repeated letter appears.',
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
      asking: 'How many committees of 4 have exactly 2 women, and so 2 men?',
      solution:
        'Exactly 2 women out of 4 people means the other 2 must be men. So make two separate choices: 2 women **and** 2 men.\n\n' +
        'A committee is just a group, so order does not matter. We count groups with $\\binom{n}{r}$, the number of ways to pick $r$ items from $n$: multiply $r$ numbers counting down from $n$, then divide by $r!$, which means $r \\times (r-1) \\times \\dots \\times 1$.\n\n' +
        'Choose 2 of the 5 women: $\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10$.\n\n' +
        'Choose 2 of the 6 men: $\\binom{6}{2} = \\frac{6 \\times 5}{2 \\times 1} = 15$.\n\n' +
        'Any pair of women can go with any pair of men, so multiply: $10 \\times 15 = 150$.',
      conclusion: '10 choices of women times 15 choices of men gives the answer, $150$.',
      whyWrong: [
        'This adds the two parts: $10 + 15 = 25$. You need 2 women **and** 2 men, so multiply.',
        'This is $\\binom{11}{4} = 330$, every committee of 4 with no restriction. Many of those do not have exactly 2 women.',
        null,
        'This is ${}^{5}P_{2} \\times {}^{6}P_{2} = 20 \\times 30 = 600$, which counts the members in order. A committee is just a group, so use combinations.',
      ],
      keyIdea: 'For "exactly $k$ from one group", work out how many come from each group. Choose from each group separately with $\\binom{n}{r}$, then multiply the results.',
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
      asking: 'How many seatings of the six friends keep Ali and Bea side by side?',
      solution:
        'Treat Ali and Bea as one **block** glued together. Wherever the block goes, they stay next to each other.\n\n' +
        'Count the things to arrange: the block plus the other 4 friends, which makes 5 things.\n\n' +
        '5 things can go in a row in $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$ orders. The **!** (factorial) means multiply every whole number down to 1.\n\n' +
        'Inside the block they can sit 2 ways: Ali then Bea, or Bea then Ali.\n\n' +
        'Each of the 120 orders can use either way, so multiply: $120 \\times 2 = 240$.',
      conclusion: '5 things in a row times 2 orders inside the block gives the answer, $240$.',
      whyWrong: [
        null,
        'This is $5! = 120$: it glues the pair together but forgets that Ali and Bea can swap seats inside the block (AB or BA).',
        'This is $6! = 720$, every seating with no restriction at all.',
        'This is $720 - 240 = 480$, the number of seatings where Ali and Bea are **not** next to each other.',
      ],
      keyIdea: 'For "must be together", glue the group into one block, arrange the block with everyone else, then multiply by the ways to order the people inside the block.',
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
      asking: 'How many line-ups of the seven students keep Omar and Sara apart?',
      solution:
        'Counting "apart" directly is awkward, so count the opposite. Every line-up has them either together or apart, so apart $=$ all $-$ together.\n\n' +
        'All line-ups with no rule: $7! = 7 \\times 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 = 5040$. The **!** (factorial) means multiply every whole number down to 1.\n\n' +
        'For together, glue Omar and Sara into one block. That leaves 6 things to arrange: $6! = 720$ orders.\n\n' +
        'Inside the block they can stand 2 ways: Omar then Sara, or Sara then Omar. So together $= 720 \\times 2 = 1440$.\n\n' +
        'Subtract: $5040 - 1440 = 3600$.',
      conclusion: 'Taking the 1440 together line-ups away from all 5040 leaves the answer, $3600$.',
      whyWrong: [
        'This is $6! \\times 2! = 1440$, the number of ways in which Omar and Sara **are** next to each other. You still need to subtract it from the total.',
        'This is $7! = 5040$, every arrangement. It ignores the condition completely.',
        'This is $5040 - 720 = 4320$: it subtracts the "together" cases but forgets that Omar and Sara can swap places inside their block, so the "together" count should be $1440$.',
        null,
      ],
      keyIdea: 'For "must not be together", use total arrangements minus arrangements where they are together. Count the together cases by gluing them into one block, then multiply by the orders inside the block.',
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
      asking: 'If 3 of the 9 members are picked, how likely is it that all 3 are girls?',
      solution:
        'Here probability is (groups we want) divided by (all possible groups). The order people are picked in does not matter, so count groups with $\\binom{n}{r}$, the number of ways to pick $r$ from $n$.\n\n' +
        'All possible groups: pick 3 from the 9 people. $\\binom{9}{3} = \\frac{9 \\times 8 \\times 7}{3 \\times 2 \\times 1} = \\frac{504}{6} = 84$.\n\n' +
        'Groups we want: pick all 3 from the 4 girls. $\\binom{4}{3} = \\frac{4 \\times 3 \\times 2}{3 \\times 2 \\times 1} = \\frac{24}{6} = 4$.\n\n' +
        'Divide, then simplify by dividing top and bottom by 4: $\\frac{4}{84} = \\frac{1}{21}$.',
      conclusion: 'Out of 84 equally likely groups, 4 are all girls, so the answer is $\\frac{1}{21}$.',
      whyWrong: [
        'This is $\\left(\\frac{4}{9}\\right)^3$, which assumes each person is put back before the next is chosen. Once a girl is chosen there are fewer girls and fewer people left.',
        null,
        'This is $\\frac{4}{9}$, only the probability that the **first** person chosen is a girl.',
        'This is $\\frac{1}{84}$, which counts only one all-girl group. There are $\\binom{4}{3} = 4$ different groups of 3 girls.',
      ],
      keyIdea: 'For "chosen at random" questions, use probability = (ways to choose what you want) divided by (ways to choose anything). Use $\\binom{n}{r}$ on both the top and the bottom.',
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
      asking: 'How many 4-digit numbers with different digits from 1 to 7 end in an even digit?',
      solution:
        'A number is even when its **last** digit is even. So the last place has a rule, and we fill it first.\n\n' +
        'The even digits available are 2, 4 and 6. That gives 3 choices for the last place.\n\n' +
        'Now fill the other three places. One digit is used, so the first place has 6 choices left. Then the next has 5, and the next has 4.\n\n' +
        'Every place gets filled, so multiply all the choices: $3 \\times 6 \\times 5 \\times 4 = 360$.',
      conclusion: '3 choices for the last digit times $6 \\times 5 \\times 4$ for the rest gives the answer, $360$.',
      whyWrong: [
        null,
        'This is ${}^{7}P_{4} = 840$, all four-digit numbers with different digits. It ignores the condition that the number must be even.',
        'This is $7 \\times 7 \\times 7 \\times 3 = 1029$, which lets digits repeat. The question says no digit may be used more than once.',
        'This is $6 \\times 5 \\times 4 = 120$: it fills the other three places but forgets the $3$ choices for the even last digit.',
      ],
      keyIdea: 'When one place has a rule (even, odd, not zero), fill that place first. Then fill the other places with what is left, and multiply the choices.',
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
    stem: 'A login code is **2 letters** (A to Z) followed by **3 digits** (0 to 9), and characters **may be repeated**. How many different codes are possible?',
    options: ['$468\\,000$', '$82$', '$676\\,000$', '$60\\,466\\,176$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many codes of 2 letters then 3 digits are possible when repeats are allowed?',
      solution:
        'There are 5 places to fill. Repeats are allowed, so using a character doesn\'t reduce the choices for the next place.\n\n' +
        'Each of the 2 letter places has 26 choices. Each of the 3 digit places has 10 choices, because 0 to 9 is ten digits.\n\n' +
        'Every place gets filled, so multiply: $26 \\times 26 \\times 10 \\times 10 \\times 10$.\n\n' +
        'Work it out in two parts: $26 \\times 26 = 676$ and $10 \\times 10 \\times 10 = 1000$. So $676 \\times 1000 = 676\\,000$.',
      conclusion: 'Multiplying the choices for all five places gives the answer, $676\\,000$.',
      whyWrong: [
        'This is $26 \\times 25 \\times 10 \\times 9 \\times 8 = 468\\,000$, which forbids repeats. The question says letters and digits may be repeated.',
        'This adds the choices: $26 + 26 + 10 + 10 + 10 = 82$. Each position is filled **and** the next, so multiply.',
        null,
        'This is $36^5$, which allows any of the 36 letters or digits in every position. But the first two places must be letters and the last three must be digits.',
      ],
      keyIdea: 'For codes and passwords, draw one blank per position and write the number of choices on each, then multiply. If repeats are allowed the number stays the same. If not, it drops by one each time.',
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
    stem: 'How many pairs of integers $(i, j)$ satisfy $1 \\le i < j \\le 8$?',
    options: ['$56$', '$64$', '$36$', '$28$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How many ways can we pick two different numbers from 1 to 8, calling the smaller one $i$?',
      solution:
        'The condition says $i$ and $j$ are whole numbers from 1 to 8, and $i$ must be smaller than $j$.\n\n' +
        'Pick any two different numbers from 1 to 8, say 3 and 5. There is only one way to label them so that $i < j$: $i = 3$ and $j = 5$.\n\n' +
        'So each pair of numbers gives exactly one valid $(i, j)$. We just need the number of ways to pick 2 numbers from 8, and order does not matter.\n\n' +
        'That count is written $\\binom{8}{2}$, and we work it out as $\\frac{8 \\times 7}{2 \\times 1} = \\frac{56}{2} = 28$.',
      conclusion: 'Each pair of numbers gives one valid $(i, j)$, so the count is $\\binom{8}{2}$, and the answer is $28$.',
      whyWrong: [
        'This is $8 \\times 7 = 56$, the number of **ordered** pairs with $i \\ne j$. Requiring $i < j$ keeps only one order of each pair, so you must halve it.',
        'This is $8 \\times 8 = 64$, all pairs with no condition at all.',
        'This is $8 + 7 + \\dots + 1 = 36$, which also counts the pairs with $i = j$. The condition $i < j$ is strict.',
        null,
      ],
      keyIdea: 'A strict condition like $1 \\le i < j \\le n$ counts unordered pairs, because size decides which number is $i$ and which is $j$. The count is $\\binom{n}{2} = \\frac{n(n-1)}{2}$.',
    },
    check: {
      optionValues: [56, 64, 36, 28],
      compute: () => {
        let count = 0;
        for (let i = 1; i <= 8; i++) for (let j = i + 1; j <= 8; j++) count++;
        return count;
      },
    },
  },
  {
    id: 'counting-014',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'A team of 3 is chosen from 5 men and 4 women. In how many ways can the team be chosen if it must include **at least one woman**?',
    options: ['$112$', '$74$', '$84$', '$10$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many teams of 3 have one or more women in them?',
      solution:
        '"At least one woman" covers 1, 2 or 3 women, which is three cases. The opposite is just one case: no women. So at least one woman $=$ all teams $-$ teams with no women.\n\n' +
        'Order does not matter in a team, so count groups with $\\binom{n}{r}$, the number of ways to pick $r$ from $n$. All teams means picking 3 from all 9 people: $\\binom{9}{3} = \\frac{9 \\times 8 \\times 7}{3 \\times 2 \\times 1} = \\frac{504}{6} = 84$.\n\n' +
        'Teams with no women: all 3 must come from the 5 men. $\\binom{5}{3} = \\frac{5 \\times 4 \\times 3}{3 \\times 2 \\times 1} = \\frac{60}{6} = 10$.\n\n' +
        'Subtract: $84 - 10 = 74$.',
      conclusion: 'Taking the 10 all-male teams from the 84 possible teams leaves the answer, $74$.',
      whyWrong: [
        'This is $4 \\times \\binom{8}{2} = 4 \\times 28 = 112$: "pick one woman, then any 2 others". It double counts: a team with two women, such as Hana and Noor, is counted once when Hana is picked first and again when Noor is picked first.',
        null,
        'This is $\\binom{9}{3} = 84$, every possible team. It forgets to remove the 10 all-male teams.',
        'This is $\\binom{5}{3} = 10$, the number of teams with **no** women: the complement, not the answer.',
      ],
      keyIdea: '"At least one" almost always means total minus "none". Count all the groups, count the groups with none of what you want, and subtract.',
    },
    check: {
      optionValues: [112, 74, 84, 10],
      // people 0-4 are men, 5-8 are women
      compute: () => countSubsets(9, 3, (s) => s.some((p) => p >= 5)),
    },
  },
  {
    id: 'counting-019',
    subtopic: 'counting',
    difficulty: 'exam',
    stem: 'How many four-digit numbers (from 1000 to 9999) have **four different digits**?',
    options: ['$5040$', '$3024$', '$4536$', '$9000$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many numbers from 1000 to 9999 use four different digits?',
      solution:
        'The first digit has a rule: it can\'t be 0, or the number wouldn\'t have four digits. So fill it first. It can be 1 to 9, which is 9 choices.\n\n' +
        'The second digit can be 0, but it can\'t match the first digit. There are 10 digits in total and one is used, so that leaves 9 choices.\n\n' +
        'Two digits are now used, so the third digit has 8 choices. Then the fourth digit has 7 choices.\n\n' +
        'Every place gets filled, so multiply: $9 \\times 9 \\times 8 \\times 7 = 81 \\times 56 = 4536$.',
      conclusion: 'Filling the places from the first digit onwards gives $9 \\times 9 \\times 8 \\times 7$, so the answer is $4536$.',
      whyWrong: [
        'This is ${}^{10}P_{4} = 5040$, which allows 0 as the first digit (like 0123), and that is not a four-digit number.',
        'This is ${}^{9}P_{4} = 9 \\times 8 \\times 7 \\times 6 = 3024$, which never uses 0 at all. 0 is allowed in the second, third and fourth places.',
        null,
        'This is $9 \\times 10 \\times 10 \\times 10 = 9000$, every four-digit number, including ones with repeated digits such as 1123.',
      ],
      keyIdea: 'For digit questions, fill the place with a rule first. A first digit can never be 0, so it has 9 choices at most. Then count down from what is left for each place, and multiply.',
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
  {
    id: 'counting-020',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'What is the value of $0!$?',
    options: ['$1$', '$0$', 'Not defined', '$-1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does $0!$ equal?',
      solution:
        'The **!** (factorial) means multiply by every whole number down to 1. Look at the pattern going down: $3! = 6$, $2! = 2$, $1! = 1$.\n\n' +
        'Each step down divides by the number we just dropped: $3! \\div 3 = 2!$, and $2! \\div 2 = 1!$.\n\n' +
        'Do it once more: $0! = 1! \\div 1 = 1$.',
      conclusion: 'Following the pattern one step further gives $0! = 1$, so the answer is $1$.',
      whyWrong: [
        null,
        'This treats the factorial as a product that contains $0$. The product $n!$ runs from $n$ down to $1$, so $0$ is never a factor.',
        '$0!$ is defined, and formulas such as $\\binom{n}{n} = \\frac{n!}{n! \\, 0!}$ rely on it.',
        'A factorial is never negative: it counts arrangements.',
      ],
      keyIdea: 'To work out a factorial you are unsure of, step down the pattern: each factorial is the one above it divided by that number. This value also makes $\\binom{n}{n} = \\frac{n!}{n! \\, 0!}$, the number of ways to choose all $n$ items, equal 1.',
    },
    check: {
      optionValues: [1, 0, null, -1],
      compute: () => factorial(0),
    },
  },
  {
    id: 'counting-021',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'Which counting method is used when the order of the chosen items does **not** matter?',
    options: ['Combinations', 'Permutations', 'Arrangements in a row', 'Repeated choices with replacement'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which method do we use when the order of the picks makes no difference?',
      solution:
        'Picture picking 2 people from Ann, Ben and Cara. Ann and Ben is the same pair as Ben and Ann, so order makes no difference.\n\n' +
        'If order did matter, as with first and second place, we would use **permutations**. When order doesn\'t matter, as with this pair, we use **combinations**.',
      conclusion: 'Order does not matter here, and that is what Combinations count.',
      whyWrong: [
        null,
        'Permutations count different orders as different results, so order does matter.',
        'An arrangement in a row is an ordering, so order does matter.',
        'Repeated choices, such as digit codes, are counted with $n^r$, and order matters there too.',
      ],
      keyIdea: 'Ask: if I swap two chosen items, is it a different result? Yes means permutations (medals, queues, codes). No means combinations (committees, teams, groups of books).',
    },
  },
  {
    id: 'counting-022',
    subtopic: 'counting',
    difficulty: 'foundation',
    stem: 'Which expression equals $\\binom{n}{r}$, the number of ways to choose $r$ items from $n$?',
    options: ['$\\frac{n!}{r!(n-r)!}$', '$\\frac{n!}{(n-r)!}$', '$\\frac{n!}{r!}$', '$n^r$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the formula for picking $r$ items from $n$ when order does not matter?',
      solution:
        '$n!$ (n factorial) means $n \\times (n-1) \\times \\dots \\times 1$. If we pick $r$ items **in order**, there are $n \\times (n-1) \\times \\dots$ ways, with $r$ numbers multiplied. That equals $\\frac{n!}{(n-r)!}$.\n\n' +
        'That counts each group once for every order it can go in. A group of $r$ items has $r!$ orders, so we must divide by $r!$.\n\n' +
        'Dividing gives $\\binom{n}{r} = \\frac{n!}{r!(n-r)!}$. Check with a small case: picking 2 from 4 gives $\\frac{4!}{2! \\times 2!} = \\frac{24}{4} = 6$ pairs.',
      conclusion: 'Dividing the ordered count by $r!$ gives $\\frac{n!}{r!(n-r)!}$.',
      whyWrong: [
        null,
        'This is the permutation count, which treats different orders as different. It still needs dividing by $r!$.',
        'This divides by $r!$ but forgets the $(n-r)!$ for the items that are not chosen.',
        'This counts ordered choices where items can be picked again. Here each item is chosen at most once and order does not matter.',
      ],
      keyIdea: 'Test any formula with a small case you can list by hand. Picking 2 from 4 gives 6 pairs, so the correct formula must give 6 when $n = 4$ and $r = 2$.',
    },
    check: {
      // n = 7, r = 3
      optionValues: [35, 210, 840, 343],
      compute: () => countSubsets(7, 3),
    },
  },];
