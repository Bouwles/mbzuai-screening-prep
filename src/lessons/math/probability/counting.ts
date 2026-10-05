import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'counting',
  know:
    '### Why counting matters\n\n' +
    'Many probability questions boil down to one fraction: $P = \\frac{\\text{favourable outcomes}}{\\text{total outcomes}}$. When the outcomes are things like "groups of 3 people" or "arrangements of a word", listing them all is far too slow, so you need quick ways to **count** them. Four tools cover almost everything: the multiplication principle, factorials, permutations and combinations.\n\n' +
    '### The multiplication principle\n\n' +
    'If a task happens in stages, multiply the number of choices at each stage. A meal with 4 starters, 5 mains and 3 desserts can be chosen in $4 \\times 5 \\times 3 = 60$ ways.\n\n' +
    '- "**and**" (do this, then that) means **multiply**.\n' +
    '- "**or**" (either this kind or that kind) means **add**.\n\n' +
    'Watch out for repetition. A 3-digit code where digits **can** repeat has $10 \\times 10 \\times 10 = 1000$ options; if digits **cannot** repeat it has $10 \\times 9 \\times 8 = 720$.\n\n' +
    '### Factorials\n\n' +
    '$n!$ (say "$n$ factorial") means $n \\times (n-1) \\times \\dots \\times 2 \\times 1$. It counts the ways to arrange $n$ **different** objects in a row: 5 people can line up in $5! = 120$ ways. By definition $0! = 1$.\n\n' +
    'Factorials grow fast, but ratios cancel nicely: $\\frac{8!}{6!} = 8 \\times 7 = 56$, because everything from 6 down to 1 cancels.\n\n' +
    '### Permutations: order matters\n\n' +
    'A **permutation** is an ordered choice of $r$ items from $n$ different items. Gold, silver and bronze from 10 runners: $10 \\times 9 \\times 8 = 720$. The formula is ${}^{n}P_{r} = \\frac{n!}{(n-r)!}$, which is just "multiply $r$ numbers counting down from $n$".\n\n' +
    '### Combinations: order does not matter\n\n' +
    'A **combination** is a choice of $r$ items where only **which** items matters (a team, a hand of cards, a committee). Every group of $r$ items appears $r!$ times in the ordered list, so divide it out:\n\n' +
    '$$\\binom{n}{r} = \\frac{{}^{n}P_{r}}{r!} = \\frac{n!}{r!\\,(n-r)!}$$\n\n' +
    'Choosing 3 people from 10: $\\binom{10}{3} = \\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = 120$. Useful facts: $\\binom{n}{r} = \\binom{n}{n-r}$, and the number of pairs from $n$ things is $\\binom{n}{2} = \\frac{n(n-1)}{2}$.\n\n' +
    '**The big question every time:** does swapping two chosen items give a different outcome? Yes means permutation; no means combination.\n\n' +
    '| Situation | Order matters? | Tool |\n' +
    '|---|---|---|\n' +
    '| Medals, president and secretary, a PIN | yes | ${}^{n}P_{r}$ or multiply down |\n' +
    '| Team, committee, hand of cards | no | $\\binom{n}{r}$ |\n' +
    '| Arranging everyone in a row | yes | $n!$ |\n\n' +
    '### Repeated letters\n\n' +
    'Swapping two identical letters gives the same word, so divide by $k!$ for every letter that appears $k$ times. BANANA (A three times, N twice): $\\frac{6!}{3!\\,2!} = 60$.\n\n' +
    '### Restrictions\n\n' +
    '- **Fixed position** ("starts with a vowel", "even number"): fill the restricted place **first**, then the rest.\n' +
    '- **Must be together**: glue them into one block, arrange the blocks, then multiply by the ways to arrange inside the block.\n' +
    '- **Must be apart**: total minus together.\n' +
    '- **At least one**: total minus none.\n\n' +
    '### Committees with conditions\n\n' +
    'For "exactly 2 women and 2 men", choose each part separately and multiply: $\\binom{5}{2} \\times \\binom{6}{2}$. For "at least one woman", never pick "one woman, then anyone": that double counts every committee with two or more women. Use total minus none instead.\n\n' +
    '### Counting to find probabilities\n\n' +
    'When every selection is equally likely, $P = \\frac{\\text{number of favourable selections}}{\\text{total number of selections}}$. Count the top and the bottom **the same way** (both ordered or both unordered).',
  formulas: [
    { label: 'Factorial', tex: 'n! = n \\times (n-1) \\times \\dots \\times 2 \\times 1, \\qquad 0! = 1', note: 'Number of ways to arrange $n$ different objects in a row.' },
    { label: 'Multiplication principle', tex: '\\text{stages with } a, b, c \\text{ choices} \\Rightarrow a \\times b \\times c \\text{ outcomes}', note: '"And" means multiply; "or" (separate cases) means add.' },
    { label: 'Permutations (order matters)', tex: '{}^{n}P_{r} = \\frac{n!}{(n-r)!} = n(n-1)\\cdots(n-r+1)' },
    { label: 'Combinations (order does not matter)', tex: '\\binom{n}{r} = {}^{n}C_{r} = \\frac{n!}{r!\\,(n-r)!}' },
    { label: 'Link between them', tex: '{}^{n}P_{r} = r! \\times \\binom{n}{r}' },
    { label: 'Symmetry and pairs', tex: '\\binom{n}{r} = \\binom{n}{n-r}, \\qquad \\binom{n}{2} = \\frac{n(n-1)}{2}' },
    { label: 'With repetition allowed', tex: 'n^{r}', note: 'Each of $r$ positions can be any of $n$ options (codes, PINs).' },
    { label: 'Arrangements with repeated items', tex: '\\frac{n!}{a!\\,b!\\,c!\\cdots}', note: 'Divide by $k!$ for each item repeated $k$ times.' },
    { label: 'Must be together (block of k)', tex: '(n-k+1)! \\times k!' },
    { label: 'Two people must be apart', tex: 'n! - 2 \\times (n-1)!', note: 'Total minus together.' },
    { label: 'Probability by counting', tex: 'P(A) = \\frac{\\text{number of favourable outcomes}}{\\text{total number of outcomes}}', note: 'Only when all outcomes are equally likely.' },
  ],
  examples: [
    {
      title: 'Permutation or combination?',
      problem: 'A class of 12 students must choose a president and a vice-president, and separately a team of 3 to tidy the room. How many ways are there to make each choice?',
      steps: [
        'President and vice-president are different roles, so order matters: permutation.',
        'President: $12$ choices, then vice-president: $11$ choices. ${}^{12}P_{2} = 12 \\times 11 = 132$.',
        'The tidying team has no roles, so order does not matter: combination.',
        '$\\binom{12}{3} = \\frac{12 \\times 11 \\times 10}{3 \\times 2 \\times 1} = \\frac{1320}{6} = 220$.',
      ],
      answer: '$132$ ways for the two roles and $220$ ways for the team.',
    },
    {
      title: 'Repeated letters',
      problem: 'How many different arrangements are there of the letters of the word **LETTER**?',
      steps: [
        'LETTER has 6 letters: E appears 2 times, T appears 2 times, L and R once each.',
        'If all were different: $6! = 720$.',
        'Divide by $2!$ for the E\'s and $2!$ for the T\'s: $\\frac{6!}{2!\\,2!} = \\frac{720}{4} = 180$.',
      ],
      answer: '$180$',
    },
    {
      title: 'Committee with "at least one"',
      problem: 'A committee of 4 is chosen from 7 men and 3 women. How many committees contain at least one woman?',
      steps: [
        'Use the complement: total committees minus committees with no women.',
        'Total: $\\binom{10}{4} = \\frac{10 \\times 9 \\times 8 \\times 7}{4 \\times 3 \\times 2 \\times 1} = 210$.',
        'No women (all 4 from the 7 men): $\\binom{7}{4} = 35$.',
        'At least one woman: $210 - 35 = 175$.',
      ],
      answer: '$175$',
    },
    {
      title: 'Counting to find a probability',
      problem: 'Five people, including Lina and Karim, sit in a row in a random order. What is the probability that Lina and Karim sit next to each other?',
      steps: [
        'Total arrangements: $5! = 120$.',
        'Favourable: glue Lina and Karim into one block. Arrange 4 things: $4! = 24$ ways.',
        'Lina and Karim can swap inside the block: multiply by $2! = 2$, so $24 \\times 2 = 48$.',
        'Probability: $\\frac{48}{120} = \\frac{2}{5}$.',
      ],
      answer: '$\\frac{2}{5}$',
    },
  ],
  traps: [
    'Using permutations when order does not matter (a committee is not a queue). If swapping two people gives the same outcome, use $\\binom{n}{r}$, otherwise every group is counted $r!$ times.',
    'Adding when you should multiply. "A starter **and** a main" means multiply; add only for separate cases joined by "or".',
    'Forgetting the inside of a block. When people must sit together, after arranging the blocks you must also multiply by the ways to order the people inside the block ($2!$ for a pair).',
    'Forgetting a repeated letter. Divide by $k!$ for **every** repeated letter, not just the most common one, and divide by $k!$, not by $k$.',
    '"At least one" by picking one first and then anyone: this double counts. Use total minus none instead.',
    'Leading zeros: a four-digit number cannot start with 0, so fill the first digit first with 9 choices.',
  ],
  examTip:
    'Counting questions are usually one number from four. The wrong options are almost always the results of the classic slips, so you can often spot them: one option will be the unrestricted total, one will be the permutation version of a combination answer (bigger by a factor of $r!$), and one will forget a factor such as $2!$. Before calculating, decide "order matters or not?" and write the structure (for example $\\binom{5}{2} \\times \\binom{6}{2}$). Use your calculator\'s nCr and nPr keys to save time, and sanity-check sizes: a restricted count must be smaller than the unrestricted total, and "together" plus "apart" must add up to the total. For probability answers, the result must be between 0 and 1.',
};
