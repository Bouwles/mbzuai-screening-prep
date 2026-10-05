import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'pigeonhole-counting',
  know:
    '### Counting without listing\n\n' +
    'Counting questions ask "how many ways?". Listing every possibility is slow and easy to get wrong, so we use a few simple rules instead. Almost every question in this topic is one of these rules, or two of them combined.\n\n' +
    '### The sum rule and the product rule\n\n' +
    '- **Sum rule ("OR")**: if you make **one** choice from separate groups that do not overlap, **add**. One book from 5 novels or 7 comics: $5 + 7 = 12$ choices.\n' +
    '- **Product rule ("AND THEN")**: if you make a choice in **stages**, **multiply** the number of options at each stage. A starter (4 options) and then a main (6 options): $4 \\times 6 = 24$ meals.\n\n' +
    'Ask yourself: "Is this one decision, or several decisions one after another?" One decision split into cases means add; several decisions means multiply.\n\n' +
    '### Codes, passwords and licence plates\n\n' +
    'Fill the positions one at a time and multiply.\n\n' +
    '| Situation | Count for $k$ positions, $n$ symbols | Example (4 digits) |\n' +
    '| --- | --- | --- |\n' +
    '| Repeats allowed | $n^k$ | $10^4 = 10\\,000$ |\n' +
    '| No repeats | $n(n-1)(n-2)\\cdots$ ($k$ factors) | $10 \\times 9 \\times 8 \\times 7 = 5040$ |\n\n' +
    'Mixed codes just multiply the parts: 3 letters then 3 digits (repeats allowed) is $26^3 \\times 10^3$. Watch for special rules such as "the first digit cannot be 0" (a 4-digit **number** has only 9 choices for its first digit). If the length can vary ("3 or 4 characters"), count each length separately and **add** the cases.\n\n' +
    '### Complementary counting: "at least one"\n\n' +
    'When a question says **at least one**, count the opposite and subtract:\n\n' +
    '$$\\text{at least one} = \\text{total} - \\text{none}$$\n\n' +
    'For 4-digit codes containing at least one 7: total $10^4 = 10\\,000$, with no 7 at all $9^4 = 6561$, so $10\\,000 - 6561 = 3439$. Fixing a 7 in one position and multiplying ($4 \\times 10^3$) **over-counts** codes with several 7s. The same trick works for "not next to each other" (total minus together) and "at least one repeated digit" (total minus all different).\n\n' +
    '### Inclusion-exclusion: fixing double counting\n\n' +
    'If two groups overlap, adding their sizes counts the overlap twice, so subtract it once:\n\n' +
    '$$|A \\cup B| = |A| + |B| - |A \\cap B|$$\n\n' +
    'Here $|A|$ means "how many in group A", $\\cup$ means "in A or B (or both)" and $\\cap$ means "in both". For "neither", take the total minus $|A \\cup B|$.\n\n' +
    'A classic exam use is divisibility. The number of multiples of $a$ from 1 to $N$ is $N \\div a$ rounded **down**. "Divisible by both 4 and 6" means divisible by the **lowest common multiple** 12, not by $4 \\times 6 = 24$. With three groups: add the singles, subtract the pairs, then **add back** the part in all three.\n\n' +
    '### Handshakes and pairs\n\n' +
    'When $n$ people each shake hands with everyone else once, each person shakes $n - 1$ hands, but each handshake involves two people, so divide by 2:\n\n' +
    '$$\\binom{n}{2} = \\frac{n(n-1)}{2}$$\n\n' +
    'The same formula counts matches in a round-robin league, lines through $n$ points (no three in a line) and pairs of anything. A polygon with $n$ corners has $\\binom{n}{2} - n$ diagonals (all pairs of corners minus the $n$ sides).\n\n' +
    '### Paths on a grid\n\n' +
    'To go from $(0, 0)$ to $(m, n)$ moving only right (R) or up (U), every shortest route has exactly $m$ R steps and $n$ U steps. A route is just a choice of **which** steps are U, so the number of routes is $\\binom{m+n}{n}$. To $(3, 2)$: 5 steps, choose 2 to be U, $\\binom{5}{2} = 10$ routes. For routes **through** a point, multiply (routes to the point) by (routes from the point to the end).\n\n' +
    '### The pigeonhole principle\n\n' +
    'If you put more objects ("pigeons") into boxes ("pigeonholes") than there are boxes, some box gets at least two. With 12 months, 13 people guarantee two share a birth month. 12 people do not: they could all be different.\n\n' +
    '**Generalised version**: $N$ objects in $k$ boxes force some box to hold at least $\\left\\lceil \\frac{N}{k} \\right\\rceil$ objects, where $\\lceil \\; \\rceil$ means round **up**. 50 students and 7 weekdays: $\\frac{50}{7} \\approx 7.14$, so some day has at least 8 students.\n\n' +
    '**Working backwards**: to force at least $r$ objects into one of $k$ boxes, imagine the worst case with $r - 1$ in **every** box, then add one: $k(r - 1) + 1$. Socks in 5 colours, three of a colour: $5 \\times 2 + 1 = 11$.\n\n' +
    'Harder questions hide the boxes. For "choose numbers from 1 to 20 so that two add to 21", the boxes are the pairs $\\{1, 20\\}, \\{2, 19\\}, \\ldots, \\{10, 11\\}$.',
  formulas: [
    { label: 'Sum rule (one choice, separate groups)', tex: '\\text{ways}(A \\text{ or } B) = a + b', note: 'Use when the groups do not overlap and you choose one thing.' },
    { label: 'Product rule (choices in stages)', tex: '\\text{ways}(A \\text{ then } B) = a \\times b' },
    { label: 'Codes with repetition', tex: 'n^k', note: '$k$ positions, $n$ symbols, repeats allowed.' },
    { label: 'Codes without repetition', tex: 'n(n-1)(n-2)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}', note: 'Order matters, no symbol used twice.' },
    { label: 'Complementary counting', tex: '\\text{at least one} = \\text{total} - \\text{none}' },
    { label: 'Inclusion-exclusion (two sets)', tex: '|A \\cup B| = |A| + |B| - |A \\cap B|' },
    {
      label: 'Inclusion-exclusion (three sets)',
      tex: '|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|',
    },
    { label: 'Neither', tex: '\\text{neither} = \\text{total} - |A \\cup B|' },
    { label: 'Multiples of $a$ from 1 to $N$', tex: '\\left\\lfloor \\frac{N}{a} \\right\\rfloor', note: 'Round down. Divisible by both $a$ and $b$ means a multiple of $\\text{lcm}(a, b)$.' },
    { label: 'Handshakes / pairs', tex: '\\binom{n}{2} = \\frac{n(n-1)}{2}' },
    { label: 'Diagonals of an $n$-sided polygon', tex: '\\binom{n}{2} - n = \\frac{n(n-3)}{2}' },
    { label: 'Shortest grid routes', tex: '\\binom{m+n}{n} = \\frac{(m+n)!}{m! \\, n!}', note: '$m$ steps right and $n$ steps up.' },
    { label: 'Pigeonhole principle', tex: 'k + 1 \\text{ objects in } k \\text{ boxes} \\Rightarrow \\text{some box has at least } 2' },
    { label: 'Generalised pigeonhole', tex: '\\text{some box has at least } \\left\\lceil \\frac{N}{k} \\right\\rceil', note: '$N$ objects in $k$ boxes; round up.' },
    { label: 'Minimum to force $r$ in one box', tex: 'k(r-1) + 1', note: 'Worst case: $r - 1$ in every one of the $k$ boxes, then one more.' },
  ],
  examples: [
    {
      title: 'Product rule: a licence code',
      problem: 'A code is 2 letters (A to Z) followed by 3 digits (0 to 9). The two letters must be different; the digits may repeat. How many codes are possible?',
      steps: [
        'The code is filled in stages (letter, letter, digit, digit, digit), so multiply.',
        'First letter: 26 choices. Second letter: it must differ from the first, so 25 choices. Letters: $26 \\times 25 = 650$.',
        'Each digit has 10 choices (repeats allowed): $10 \\times 10 \\times 10 = 1000$.',
        'Total: $650 \\times 1000 = 650\\,000$.',
      ],
      answer: '$650\\,000$ codes',
    },
    {
      title: 'Complementary counting: at least one 5',
      problem: 'How many 3-character codes made from the digits 0 to 9 (repeats allowed) contain at least one 5?',
      steps: [
        '"At least one" means: count the total, then subtract the codes with no 5.',
        'Total: $10^3 = 1000$.',
        'No 5 anywhere: each position has 9 choices, so $9^3 = 729$.',
        'At least one 5: $1000 - 729 = 271$.',
      ],
      answer: '$271$',
    },
    {
      title: 'Inclusion-exclusion: divisible by 2 or 5, and neither',
      problem: 'From the integers 1 to 100, how many are divisible by 2 or 5? How many are divisible by neither?',
      steps: [
        'Multiples of 2: $\\frac{100}{2} = 50$. Multiples of 5: $\\frac{100}{5} = 20$.',
        'Divisible by both means divisible by $\\text{lcm}(2, 5) = 10$: $\\frac{100}{10} = 10$. These were counted in both groups.',
        'Inclusion-exclusion: $50 + 20 - 10 = 60$ are divisible by 2 or 5.',
        'Neither: $100 - 60 = 40$.',
      ],
      answer: '$60$ divisible by 2 or 5; $40$ by neither',
    },
    {
      title: 'Pigeonhole both ways',
      problem: 'A school has 4 houses. (a) If 30 students are in the houses, what is the largest number we can be sure is in one house? (b) How many students are needed to be sure that some house has at least 10?',
      steps: [
        '(a) Spread the 30 students as evenly as possible: $30 \\div 4 = 7$ remainder 2.',
        '7 in each house uses 28 students; the 2 left over must make some house reach 8. So $\\left\\lceil \\frac{30}{4} \\right\\rceil = 8$.',
        '(b) Worst case: 9 in every house, which is $4 \\times 9 = 36$ students with no house at 10.',
        'One more student forces a house to 10: $4(10 - 1) + 1 = 37$.',
      ],
      answer: '(a) $8$ (b) $37$',
    },
    {
      title: 'Grid routes through a point',
      problem: 'Moving only right or up, one unit at a time, how many shortest routes go from $(0, 0)$ to $(4, 3)$, and how many of them pass through $(2, 1)$?',
      steps: [
        'All routes: 4 rights and 3 ups, 7 steps in total. Choose which 3 steps are up: $\\binom{7}{3} = \\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = 35$.',
        'Start to $(2, 1)$: 2 rights and 1 up, 3 steps. Choose which 1 step is up: $\\binom{3}{1} = 3$.',
        '$(2, 1)$ to $(4, 3)$: $4 - 2 = 2$ rights and $3 - 1 = 2$ ups, 4 steps: $\\binom{4}{2} = 6$.',
        'First leg **and then** second leg, so multiply: $3 \\times 6 = 18$ routes pass through $(2, 1)$ (and $35 - 18 = 17$ avoid it).',
      ],
      answer: '$35$ routes in total; $18$ pass through $(2, 1)$',
    },
  ],
  traps: [
    '**Adding instead of multiplying (or the reverse).** "A starter AND a main" multiplies; "one book, a novel OR a comic" adds. A code that is "3 OR 4 characters long" adds the two lengths.',
    '**Over-counting "at least one".** Putting a 7 in one position and letting the rest be anything counts 7707 several times. Use total minus none.',
    '**Forgetting the overlap in inclusion-exclusion.** Numbers divisible by both are counted twice; subtract them once. And "divisible by 4 and 6" means a multiple of the LCM 12, not of 24.',
    '**Not dividing by 2 for handshakes or diagonals.** $n(n-1)$ counts every pair from both ends; the answer is $\\frac{n(n-1)}{2}$.',
    '**Pigeonhole off-by-one.** 12 people might all have different months; you need $12 + 1$. In the generalised version round $\\frac{N}{k}$ **up**, and for "how many to force $r$" use $k(r-1) + 1$, not $kr$.',
    '**Grid routes are not $2^{m+n}$ or $m \\times n$.** You must have exactly $m$ rights and $n$ ups, so choose where the ups go: $\\binom{m+n}{n}$.',
  ],
  examTip:
    'These questions are quick if you name the rule first: product, sum, complement, inclusion-exclusion, handshake, grid or pigeonhole. The wrong options are almost always the classic slips: the sum where a product was needed, the count **before** subtracting the overlap, the complement itself (the "none" or "neither" number), the handshake count without halving, or the pigeonhole answer without the $+1$. If two options add up to the total, one of them is probably the complement trap; if two options differ by exactly the overlap, one of them probably forgot to subtract it. For pigeonhole, test an option with the worst case: if you can build an arrangement that avoids the condition with that many objects, the option is too small. For handshake questions working backwards, plug each option into $\\frac{n(n-1)}{2}$ on your calculator. Big numbers like $26^3 \\times 10^3$ are fine to type straight in; use the $\\text{nCr}$ key for grid routes.',
};
