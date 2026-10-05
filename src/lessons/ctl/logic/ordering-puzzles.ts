import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'ordering-puzzles',
  know:
    '### What these puzzles are\n\n' +
    'Ordering and arrangement puzzles give you a few **clues** about people or objects and ask you to work out an order (who is tallest, who finished third), a seating plan (who sits opposite whom), a matching (who owns which pet), or simply **how many** arrangements are possible. No school maths is needed for most of them, just careful, organised thinking. The skill being tested is the same one programmers use: turn messy words into a tidy structure, then check every case.\n\n' +
    '### Ranking from clues\n\n' +
    'Clues like "Amal is taller than Bilal" and "Chen is shorter than Bilal" say the same kind of thing in different directions. The first job is to **rewrite every clue in one direction**, for example always using ">" for "taller than":\n\n' +
    '- "Chen is shorter than Bilal" becomes Bilal > Chen.\n' +
    '- "Tom finished after Sam" becomes Sam before Tom.\n\n' +
    'Then **chain** the clues: if Dana > Amal and Amal > Bilal, then Dana > Amal > Bilal. If the clues join everybody into one unbroken chain, the order is certain. If someone is only compared with one person (for example "Sara beat Ravi" and nothing else about Sara), that person can slide into several places, and the question is usually "which statement **must** be true?" or "who **could** be second?". In that case, list every order that fits.\n\n' +
    'When clues give amounts ("Ahmed is 20 cm taller than Bassam"), pick one person as $0$ and give everyone a number, then sort the numbers.\n\n' +
    '### Seating in a row\n\n' +
    'Draw the seats as numbered boxes: 1, 2, 3, ... from left to right. Then:\n\n' +
    '1. Place anyone whose seat is **fixed** ("in the middle", "in seat 2").\n' +
    '2. Use **blocks**: "Hiro sits next to both Farah and Jon" means Farah, Hiro, Jon sit together with Hiro in the centre.\n' +
    '3. Slide each block along the row and **reject** any position that breaks a clue.\n\n' +
    'Watch the words: "immediately left of" means the very next seat; "somewhere to the left of" means any seat further left. "Exactly two people between X and Y" means their seat numbers differ by **3**.\n\n' +
    '### Seating around a circle\n\n' +
    'In a circle there is no first seat, so **fix one person** in seat 0 and number the other seats clockwise $1, 2, 3, \\dots$. With $n$ equally spaced seats:\n\n' +
    '- the neighbours of seat $k$ are $k + 1$ and $k - 1$ (wrapping round, so seat 0 is next to seat $n - 1$);\n' +
    '- the seat **directly opposite** is $\\frac{n}{2}$ seats away (3 seats away when $n = 6$).\n\n' +
    'Questions usually use "clockwise". If they use left and right with everyone facing the centre, your right-hand neighbour is the next seat **anticlockwise**; draw it to be sure.\n\n' +
    '### Matching grids\n\n' +
    'When each person has exactly one of each attribute (one pet, one drink), draw a **grid**: people down the side, options across the top. Put a tick for a known pairing and a cross for an impossible one. Each row and each column has **exactly one** tick, so a tick crosses out the rest of its row and column, and a row with only one empty cell left must be a tick. With two attributes (language and years), add a second grid or a table and keep cross-checking.\n\n' +
    '### Counting arrangements\n\n' +
    'Sometimes you do not need the actual order, just how many are possible. The building block is the **factorial**: $n$ different things can be put in a line in\n\n' +
    '$$n! = n \\times (n - 1) \\times \\dots \\times 2 \\times 1$$\n\n' +
    'ways, because there are $n$ choices for the first place, $n - 1$ for the second, and so on. For example $5! = 120$. You **multiply** choices (every first choice combines with every second choice); you never add them.\n\n' +
    '| Situation | Count |\n| --- | --- |\n| $n$ people in a row | $n!$ |\n| $n$ people round a table (rotations the same) | $(n - 1)!$ |\n| Two people must be together (row) | $2 \\times (n - 1)!$ |\n| Two people must be apart (row) | $n! - 2 \\times (n - 1)!$ |\n| A before B (not necessarily immediately) | $\\frac{n!}{2}$ |\n| A at one of the two ends of a row | $2 \\times (n - 1)!$ |\n| Two together round a table | $2 \\times (n - 2)!$ |\n\n' +
    'The ideas behind the table matter more than the table itself:\n\n' +
    '- **Together**: glue the pair into one block, arrange the units, then multiply by 2 because the pair can swap.\n' +
    '- **Not together**: count everything, then subtract the "together" cases.\n' +
    '- **A before B**: by symmetry exactly half of all orders.\n' +
    '- **Circle**: fixing one person removes the rotations, so $n$ people give $(n - 1)!$.\n' +
    '- **Alternating** (boy, girl, boy, ...): find which patterns are possible first, then multiply the arrangements of each group.\n\n' +
    'If a problem is small and you are unsure, you can always **list** the cases systematically: that is exactly what a computer does with `itertools.permutations`.',
  formulas: [
    { label: 'Arrangements in a row', tex: 'n! = n \\times (n - 1) \\times \\dots \\times 2 \\times 1', note: '$n$ different things in a line. $4! = 24$, $5! = 120$, $6! = 720$.' },
    { label: 'Ordered selection', tex: '{}^{n}P_{r} = \\frac{n!}{(n - r)!}', note: 'Fill only $r$ places (e.g. gold, silver, bronze from $n$ runners).' },
    { label: 'Round table (rotations the same)', tex: '(n - 1)!', note: 'Fix one person, arrange the rest.' },
    { label: 'Two must be together (row)', tex: '2 \\times (n - 1)!', note: 'Glue the pair into a block: $n - 1$ units, times 2 orders inside the block.' },
    { label: 'Two must be apart (row)', tex: 'n! - 2 \\times (n - 1)!', note: 'Total minus "together".' },
    { label: 'Two together round a table', tex: '2 \\times (n - 2)!', note: '$n - 1$ units around a circle give $(n - 2)!$, times 2.' },
    { label: 'A before B', tex: '\\frac{n!}{2}', note: 'By symmetry, half of all orders.' },
    { label: 'One person at an end of a row', tex: '2 \\times (n - 1)!', note: '2 end seats, then arrange the other $n - 1$ people.' },
    { label: 'Opposite seat in a circle', tex: '\\text{opposite of seat } k = k + \\frac{n}{2} \\pmod{n}', note: 'Only for an even number $n$ of equally spaced seats.' },
    { label: 'Exactly k people between X and Y', tex: '|\\text{pos}(X) - \\text{pos}(Y)| = k + 1' },
  ],
  examples: [
    {
      title: 'Chain the clues',
      problem: 'Four runners finish a race with no ties. Ivy finished after Jack, Kim finished before Jack, and Leo finished after Ivy. Who finished second?',
      steps: [
        'Rewrite every clue as "X before Y" (earlier finisher first): Jack before Ivy; Kim before Jack; Ivy before Leo.',
        'Join the clues where a name repeats: Kim before Jack, Jack before Ivy, Ivy before Leo.',
        'This is one chain through all four runners: Kim, Jack, Ivy, Leo, so the order is certain.',
        'Read off position 2 from the front.',
      ],
      answer: 'Jack',
    },
    {
      title: 'Row seating with a block',
      problem:
        'Kai, Lina, Max, Noor and Omar sit in seats 1 to 5 (numbered left to right). Kai sits next to both Lina and Max. Lina sits somewhere to the left of Max. Max is not in seat 5. Noor is not in an end seat. Who is in seat 4?',
      steps: [
        'Kai is next to both Lina and Max, so the three sit together with Kai in the middle. Lina is left of Max, so the block reads Lina, Kai, Max.',
        'The block can start in seat 1, 2 or 3.',
        'Start at seat 3: Max is in seat 5. Rejected.',
        'Start at seat 2: Lina 2, Kai 3, Max 4. Noor and Omar get seats 1 and 5, both end seats, but Noor cannot be at an end. Rejected.',
        'Start at seat 1: Lina 1, Kai 2, Max 3. Noor and Omar get seats 4 and 5; Noor is not at an end, so Noor 4 and Omar 5. Every clue holds.',
      ],
      answer: 'Noor sits in seat 4 (order: Lina, Kai, Max, Noor, Omar).',
    },
    {
      title: 'Round table: who is opposite?',
      problem:
        'Rami, Sana, Tala, Umar, Vera and Wael sit at a round table with six equally spaced seats. Sana is directly opposite Rami. Tala is immediately clockwise of Rami. Umar is immediately anticlockwise of Sana. Vera is not next to Rami. Who sits directly opposite Tala?',
      steps: [
        'Fix Rami in seat 0 and number the seats 0 to 5 clockwise.',
        'Opposite is $\\frac{6}{2} = 3$ seats away, so Sana is in seat 3. Tala (immediately clockwise of Rami) is in seat 1.',
        'Immediately anticlockwise of seat 3 is seat 2, so Umar is in seat 2.',
        'Free seats: 4 and 5. Rami\'s neighbours are seats 1 and 5, so Vera cannot be in seat 5: Vera is in seat 4 and Wael is in seat 5.',
        'Opposite Tala (seat 1) is seat $1 + 3 = 4$.',
      ],
      answer: 'Vera',
    },
    {
      title: 'Matching grid',
      problem:
        'Lara, Mo, Nia and Omar each play a different one of football, tennis, swimming and chess. Nia plays tennis. Mo plays neither football nor tennis. Lara plays neither football nor chess. Who plays chess?',
      steps: [
        'Draw a grid with the people down the side and the activities across the top. Tick Nia: tennis, and cross out tennis for everyone else.',
        'Lara: not football, not chess, not tennis (Nia has it). Only swimming is left, so tick Lara: swimming and cross out swimming for Mo and Omar.',
        'Mo: not football, not tennis, not swimming. Only chess is left, so Mo plays chess.',
        'Omar gets the activity that is left: football. Each row and each column now has exactly one tick.',
      ],
      answer: 'Mo',
    },
    {
      title: 'Counting with "not together"',
      problem: 'Six people sit in a row. In how many ways can they sit if two of them, Rania and Sami, must not sit next to each other?',
      steps: [
        'All seatings: $6! = 720$.',
        'Together: glue Rania and Sami into a block, so there are 5 units: $5! = 120$ ways.',
        'The block can be Rania-Sami or Sami-Rania: $2 \\times 120 = 240$ together.',
        'Not together $= 720 - 240 = 480$.',
      ],
      answer: '$480$',
    },
  ],
  traps: [
    'Mixing directions: "Chen is shorter than Bilal" puts Bilal **above** Chen. Rewrite every clue in the same direction before chaining them.',
    'Counting from the wrong end: "second shortest" and "second tallest" are different people. With $n$ people, position $k$ from the bottom is position $n + 1 - k$ from the top.',
    'Confusing "before" with "immediately before" (and "left of" with "immediately left of"). "Before" allows other people in between; for counting, "A before B" gives $\\frac{n!}{2}$, while "A immediately before B" gives $(n - 1)!$.',
    'Forgetting the factor of 2 in the block method: the glued pair can be in either order.',
    'Using $n!$ for a round table. When rotations count as the same, fix one person: $(n - 1)!$. Do not also divide by 2 unless the question says mirror images are the same.',
    '"Exactly two people between X and Y" means their positions differ by 3, not 2.',
  ],
  examTip:
    'With about a minute per question, draw first and think second: a row of numbered boxes, a circle with seat numbers, or a quick grid. For "who sits where" questions, **test the options**: put each option into your sketch and see which one breaks a clue; often two options die immediately. Watch out for "Cannot be determined": it is right only if two different arrangements fit **every** clue and give different answers to the question asked (someone else being uncertain is not enough). For "must be true" questions, find one arrangement that fits the clues and breaks a statement, which eliminates it. For counting questions, the wrong options are almost always the classic slips: $n!$ (ignored the condition), the "together" count when "apart" was asked, a missing factor of 2, or $n!$ instead of $(n - 1)!$ for a circle. Work out these slip values quickly on your calculator (it has a factorial key, $x!$) and you can spot which option is the trap.',
};
