import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- brute-force helpers for the answer checks
/** Every ordering of the items (n! of them). */
function perms<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [items.slice()];
  const out: T[][] = [];
  items.forEach((x, i) => {
    for (const rest of perms([...items.slice(0, i), ...items.slice(i + 1)])) out.push([x, ...rest]);
  });
  return out;
}
/** The common value if every solution gives the same answer, otherwise 'ambiguous' ('none' if no solution). */
function uniqueOr<T>(vals: T[]): T | 'ambiguous' | 'none' {
  if (!vals.length) return 'none';
  return vals.every((v) => v === vals[0]) ? vals[0] : 'ambiguous';
}
/** x appears earlier than y in the list. */
const before = <T>(o: T[], x: T, y: T) => o.indexOf(x) < o.indexOf(y);
/** Positions i and j are neighbours in a row. */
const adjRow = (i: number, j: number) => Math.abs(i - j) === 1;

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'ordering-puzzles-001',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem:
      'Four friends compare their heights. No two are the same height.\n\n' +
      '- Amal is taller than Bilal.\n' +
      '- Chen is shorter than Bilal.\n' +
      '- Dana is taller than Amal.\n\n' +
      'Who is the **second tallest**?',
    options: ['Dana', 'Amal', 'Bilal', 'Chen'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Write every clue in the same direction, using ">" to mean "is taller than":\n\n' +
        '- Amal > Bilal\n' +
        '- "Chen is shorter than Bilal" means Bilal > Chen\n' +
        '- Dana > Amal\n\n' +
        'Chain them together: Dana > Amal > Bilal > Chen.\n\n' +
        'So from tallest to shortest the order is Dana, Amal, Bilal, Chen, and the second tallest is **Amal**.',
      whyWrong: [
        'Dana is the **tallest**, not the second tallest. Read the question carefully: it asks for position 2 from the top.',
        null,
        'Bilal is second from the **bottom**. This comes from counting from the shortest end instead of the tallest end.',
        'This comes from reading "Chen is shorter than Bilal" backwards, as if Chen were taller than Bilal; then Chen could slot in above Bilal, even in second place. In fact Chen is below Bilal, so Chen is the shortest of all.',
      ],
      keyIdea: 'Rewrite every comparison in the same direction (all "taller than"), then chain them into one ordered line.',
    },
    check: {
      optionValues: ['Dana', 'Amal', 'Bilal', 'Chen'],
      compute: () => {
        // orderings from tallest to shortest
        const sols = perms(['Amal', 'Bilal', 'Chen', 'Dana']).filter(
          (o) => before(o, 'Amal', 'Bilal') && before(o, 'Bilal', 'Chen') && before(o, 'Dana', 'Amal'),
        );
        return uniqueOr(sols.map((o) => o[1]));
      },
    },
  },
  {
    id: 'ordering-puzzles-002',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem:
      'Four runners finish a race with no ties.\n\n' +
      '- Raya finished before Sam.\n' +
      '- Tom finished after Sam.\n' +
      '- Uma finished before Raya.\n\n' +
      'Who finished **third**?',
    options: ['Raya', 'Tom', 'Sam', 'Cannot be determined'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Turn every clue into "X before Y" (earlier finisher on the left):\n\n' +
        '- Raya before Sam\n' +
        '- "Tom finished after Sam" means Sam before Tom\n' +
        '- Uma before Raya\n\n' +
        'Chain them: Uma, Raya, Sam, Tom. Every runner is linked into one chain, so the order is completely fixed.\n\n' +
        '| Place | 1st | 2nd | 3rd | 4th |\n| --- | --- | --- | --- | --- |\n| Runner | Uma | Raya | Sam | Tom |\n\n' +
        'Third place: **Sam**.',
      whyWrong: [
        'Raya is third only if you count from the **last** runner backwards. Raya finished second.',
        'This comes from misreading "Tom finished after Sam" as "before Sam", which lets Tom move up the order. Tom is after Sam, so Tom is last.',
        null,
        'The three clues join all four runners into one chain (Uma, Raya, Sam, Tom), so there is only one possible order and the answer can be determined.',
      ],
      keyIdea: 'When the clues link everyone into one chain, the order is fully determined: just read off the position you need.',
    },
    check: {
      optionValues: ['Raya', 'Tom', 'Sam', 'ambiguous'],
      compute: () => {
        const sols = perms(['Raya', 'Sam', 'Tom', 'Uma']).filter(
          (o) => before(o, 'Raya', 'Sam') && before(o, 'Sam', 'Tom') && before(o, 'Uma', 'Raya'),
        );
        return uniqueOr(sols.map((o) => o[2]));
      },
    },
  },
  {
    id: 'ordering-puzzles-003',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem: 'Four runners take part in a race and there are no ties. In how many different orders can they finish?',
    options: ['$10$', '$12$', '$256$', '$24$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Fill the places one at a time:\n\n' +
        '- 1st place: any of the 4 runners, so 4 choices.\n' +
        '- 2nd place: one runner is used, so 3 choices.\n' +
        '- 3rd place: 2 choices. 4th place: 1 choice.\n\n' +
        'Multiply the choices (the counting principle):\n\n' +
        '$$4 \\times 3 \\times 2 \\times 1 = 4! = 24$$',
      whyWrong: [
        'This is $4 + 3 + 2 + 1$: the choices were **added**. Each choice for 1st place can be combined with every choice for 2nd place, so you must **multiply**.',
        'This is $4 \\times 3$, the number of ways to fill only the first **two** places. The question asks for the complete finishing order, so keep multiplying down to 1.',
        'This is $4^4$: it allows the same runner to fill more than one place. Once a runner has finished they cannot finish again, so the choices go down by one each time.',
        null,
      ],
      keyIdea: 'The number of ways to arrange $n$ different things in a line is $n! = n \\times (n - 1) \\times \\dots \\times 1$.',
    },
    check: {
      optionValues: [10, 12, 256, 24],
      compute: () => perms(['A', 'B', 'C', 'D']).length,
    },
  },
  {
    id: 'ordering-puzzles-005',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem:
      'Ali, Badr and Cara each own exactly one pet: a cat, a dog or a fish (one pet each, all different).\n\n' +
      '- Badr owns the dog.\n' +
      '- Ali does not own the cat.\n\n' +
      'Who owns the **fish**?',
    options: ['Badr', 'Cara', 'Cannot be determined', 'Ali'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use a grid: people down the side, pets across the top. Tick what is known, cross what is impossible.\n\n' +
        '| | Cat | Dog | Fish |\n| --- | --- | --- | --- |\n| Ali | no | no | **yes** |\n| Badr | no | **yes** | no |\n| Cara | **yes** | no | no |\n\n' +
        '1. Badr owns the dog, so nobody else owns the dog and Badr owns nothing else.\n' +
        '2. Ali does not own the cat and cannot own the dog, so Ali must own the **fish**.\n' +
        '3. Cara gets the only pet left: the cat.\n\n' +
        'So **Ali** owns the fish.',
      whyWrong: [
        'Badr owns the dog, and each person owns exactly one pet, so Badr cannot also own the fish.',
        'Cara would own the fish only if Ali owned the cat, but the second clue says Ali does not own the cat.',
        'It can be determined: once the dog is given to Badr, Ali has only the cat and the fish left, and the cat is ruled out. Remember that each pet goes to exactly one person.',
        null,
      ],
      keyIdea: 'In a matching grid, each row and each column has exactly one "yes": a tick in one cell crosses out the rest of its row and column.',
    },
    check: {
      optionValues: ['Badr', 'Cara', 'ambiguous', 'Ali'],
      compute: () => {
        const people = ['Ali', 'Badr', 'Cara'];
        // p[i] is the pet of people[i]
        const sols = perms(['cat', 'dog', 'fish']).filter((p) => p[1] === 'dog' && p[0] !== 'cat');
        return uniqueOr(sols.map((p) => people[p.indexOf('fish')]));
      },
    },
  },

  // ================================================================ exam
  {
    id: 'ordering-puzzles-006',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Arif, Bea, Chloe and Dev fill seats 1 to 4, left to right.\n\n- Chloe is in seat 3.\n- Arif is immediately left of Chloe.\n- Bea is not next to Chloe.\n\nWhere does Dev sit?',
    options: ['Seat 1', 'Seat 2', 'Seat 4', 'Cannot be determined'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Place the fixed people first.\n\n' +
        '1. Chloe is in seat 3.\n' +
        '2. Immediately to the left of seat 3 is seat 2, so Arif is in seat 2.\n' +
        '3. Seats left: 1 and 4. Seat 4 is next to Chloe, so Bea cannot be there. Bea is in seat 1.\n' +
        '4. Dev takes the last seat.\n\n' +
        '| Seat | 1 | 2 | 3 | 4 |\n| --- | --- | --- | --- | --- |\n| Person | Bea | Arif | Chloe | Dev |\n\n' +
        'Dev is in **Seat 4**.',
      whyWrong: [
        'This reads "not next to" as "next to". Bea would then take seat 4 and leave seat 1 for Dev.',
        'This puts Arif to the **right** of Chloe, in seat 4, which leaves seat 2 for Dev. With seats numbered left to right, "immediately left of seat 3" is seat 2.',
        null,
        'Every clue is needed, but together they fix all four seats, so there is only one arrangement.',
      ],
      keyIdea: 'Place the people with fixed seats first, then use "not next to" clues to narrow down the remaining seats.',
    },
    check: {
      optionValues: [1, 2, 4, 'ambiguous'],
      compute: () => {
        const sols = perms(['Arif', 'Bea', 'Chloe', 'Dev']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return s('Chloe') === 2 && s('Arif') === s('Chloe') - 1 && !adjRow(s('Bea'), s('Chloe'));
        });
        return uniqueOr(sols.map((o) => o.indexOf('Dev') + 1));
      },
    },
  },
  {
    id: 'ordering-puzzles-007',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem:
      'Four students take a test and no two get the same score.\n\n' +
      '- Priya scored more than Quinn.\n' +
      '- Ravi scored less than Quinn.\n' +
      '- Sara scored more than Ravi.\n\n' +
      'Which statement **must** be true?',
    options: ['Priya has the highest score.', 'Sara scored more than Quinn.', 'Ravi has the lowest score.', 'Quinn has the second highest score.'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write the clues with ">" meaning "scored more than": Priya > Quinn, Quinn > Ravi, Sara > Ravi.\n\n' +
        'So Priya > Quinn > Ravi is a chain, and Sara is only known to be above Ravi. Sara can slot in anywhere above Ravi. All orders from highest to lowest:\n\n' +
        '1. Sara, Priya, Quinn, Ravi\n' +
        '2. Priya, Sara, Quinn, Ravi\n' +
        '3. Priya, Quinn, Sara, Ravi\n\n' +
        'Test each statement against **all three** orders:\n\n' +
        '- "Priya highest": false in order 1.\n' +
        '- "Sara above Quinn": false in order 3.\n' +
        '- "Ravi lowest": true in all three, because Ravi is below Quinn, Priya (since Priya is above Quinn) and Sara.\n' +
        '- "Quinn second": false in orders 1 and 2.\n\n' +
        'Only **Ravi has the lowest score** must be true.',
      whyWrong: [
        'This is only *possible*, not certain: Sara is only known to beat Ravi, so Sara could also beat Priya (order Sara, Priya, Quinn, Ravi).',
        'This could be true but need not be: the order Priya, Quinn, Sara, Ravi fits every clue and has Sara below Quinn.',
        null,
        'This is one possibility (Priya, Quinn, Sara, Ravi), but Sara could also sit above Quinn, pushing Quinn to third. "Must be true" means true in **every** possible order.',
      ],
      keyIdea: 'For a "must be true" question, list every order that fits the clues; the answer is the statement that holds in all of them.',
    },
    check: {
      optionValues: ['priya-top', 'sara-above-quinn', 'ravi-bottom', 'quinn-second'],
      compute: () => {
        // orders from highest to lowest
        const sols = perms(['Priya', 'Quinn', 'Ravi', 'Sara']).filter(
          (o) => before(o, 'Priya', 'Quinn') && before(o, 'Quinn', 'Ravi') && before(o, 'Sara', 'Ravi'),
        );
        const statements: [string, (o: string[]) => boolean][] = [
          ['priya-top', (o) => o[0] === 'Priya'],
          ['sara-above-quinn', (o) => before(o, 'Sara', 'Quinn')],
          ['ravi-bottom', (o) => o[3] === 'Ravi'],
          ['quinn-second', (o) => o[1] === 'Quinn'],
        ];
        return statements.filter(([, f]) => sols.every(f)).map(([k]) => k).join('+');
      },
    },
  },
  {
    id: 'ordering-puzzles-009',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Four people, including Xavier and Yusuf, sit in a row of four chairs. In how many ways can they sit if Xavier and Yusuf **must sit next to each other**?',
    options: ['$6$', '$12$', '$24$', '$3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use the **block method**.\n\n' +
        '1. Glue Xavier and Yusuf together into one block. Now there are 3 "units" to arrange: the block and the other 2 people.\n' +
        '2. Arrange 3 units in a row: $3! = 6$ ways.\n' +
        '3. Inside the block they can sit as Xavier-Yusuf or Yusuf-Xavier: 2 ways.\n' +
        '4. Multiply: $2 \\times 3! = 2 \\times 6 = 12$.',
      whyWrong: [
        'This is $3!$: it arranges the block but forgets that Xavier and Yusuf can swap places inside it, which doubles the count.',
        null,
        'This is $4!$, every possible seating. It ignores the condition that the two must be together.',
        'This counts only the 3 pairs of neighbouring chairs. It forgets that the pair can swap and that the other two people can swap.',
      ],
      keyIdea: '"Must be together": treat them as one block, arrange the units, then multiply by the number of orders inside the block.',
    },
    check: {
      optionValues: [6, 12, 24, 3],
      compute: () => perms(['X', 'Y', 'P', 'Q']).filter((o) => adjRow(o.indexOf('X'), o.indexOf('Y'))).length,
    },
  },
  {
    id: 'ordering-puzzles-010',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Four runners, including Hamad and Isaac, finish a race with no ties. In how many finishing orders does Hamad finish **before** Isaac (not necessarily immediately before)?',
    options: ['$12$', '$24$', '$6$', '$2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'There are $4! = 24$ finishing orders altogether.\n\n' +
        'Pair each order with the order you get by **swapping** Hamad and Isaac (everyone else stays put). In exactly one of each pair Hamad is ahead. So exactly half of all orders have Hamad before Isaac:\n\n' +
        '$$\\frac{4!}{2} = \\frac{24}{2} = 12$$',
      whyWrong: [
        null,
        'This is $4!$, all orders. It ignores the condition; in half of these orders Isaac beats Hamad.',
        'This is $3!$, the number of orders where Hamad finishes **immediately** before Isaac (glued together in that order). "Before" allows other runners in between.',
        'This fixes Hamad first and Isaac second, which is only one of the ways for Hamad to beat Isaac.',
      ],
      keyIdea: 'By symmetry, "A before B" holds in exactly half of all orders: $\\frac{n!}{2}$.',
    },
    check: {
      optionValues: [12, 24, 6, 2],
      compute: () => perms(['H', 'I', 'P', 'Q']).filter((o) => before(o, 'H', 'I')).length,
    },
  },
  {
    id: 'ordering-puzzles-011',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem:
      'Hana, Imran, Jae and Kofi each order a different drink: tea, coffee, juice or water.\n\n' +
      '- Imran orders coffee.\n' +
      '- Hana orders neither tea nor juice.\n' +
      '- Kofi does not order tea.\n\n' +
      'Which pairing is correct?',
    options: ['Jae: juice', 'Hana: tea', 'Kofi: water', 'Kofi: juice'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Fill in a grid, crossing out impossible cells.\n\n' +
        '1. Imran has coffee, so cross out coffee for everyone else.\n' +
        '2. Hana: not tea, not juice, not coffee, so Hana has **water**.\n' +
        '3. Kofi: not tea, not coffee, not water (Hana has it), so Kofi has **juice**.\n' +
        '4. Jae gets the drink that is left: tea.\n\n' +
        '| | Tea | Coffee | Juice | Water |\n| --- | --- | --- | --- | --- |\n| Hana | no | no | no | yes |\n| Imran | no | yes | no | no |\n| Jae | yes | no | no | no |\n| Kofi | no | no | yes | no |\n\n' +
        'The correct pairing is **Kofi: juice**.',
      whyWrong: [
        'If Jae had juice, Kofi would be left with tea or water. Hana must have water, so Kofi would have tea, which breaks the third clue.',
        'This breaks the second clue: Hana orders neither tea nor juice.',
        'Water is forced for Hana first (she cannot have tea, juice or coffee). This comes from filling in Kofi\'s row before using Hana\'s clue.',
        null,
      ],
      keyIdea: 'Look for a row or column with only one cell left open: that cell must be a "yes", and it crosses out the rest of its row and column.',
    },
    check: {
      optionValues: ['jae-juice', 'hana-tea', 'kofi-water', 'kofi-juice'],
      compute: () => {
        const people = ['Hana', 'Imran', 'Jae', 'Kofi'];
        const sols = perms(['tea', 'coffee', 'juice', 'water']).filter((d) => d[1] === 'coffee' && d[0] !== 'tea' && d[0] !== 'juice' && d[3] !== 'tea');
        const pairs: [string, string, string][] = [
          ['jae-juice', 'Jae', 'juice'],
          ['hana-tea', 'Hana', 'tea'],
          ['kofi-water', 'Kofi', 'water'],
          ['kofi-juice', 'Kofi', 'juice'],
        ];
        return pairs.filter(([, who, drink]) => sols.every((d) => d[people.indexOf(who)] === drink)).map(([k]) => k).join('+');
      },
    },
  },
  {
    id: 'ordering-puzzles-012',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Four friends compare heights.\n\n- Ahmed is 20 cm taller than Bassam.\n- Carla is 10 cm shorter than Ahmed.\n- Dina is 5 cm taller than Bassam.\n\nWho is the **second shortest**?',
    options: ['Bassam', 'Dina', 'Carla', 'Ahmed'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Measure everyone relative to Bassam: call Bassam\'s height $0$ (in cm above Bassam).\n\n' +
        '- Ahmed: $0 + 20 = 20$\n' +
        '- Carla: $20 - 10 = 10$\n' +
        '- Dina: $0 + 5 = 5$\n' +
        '- Bassam: $0$\n\n' +
        'From shortest to tallest: Bassam $(0)$, Dina $(5)$, Carla $(10)$, Ahmed $(20)$.\n\n' +
        'The second shortest is **Dina**.',
      whyWrong: [
        'Bassam is the **shortest**. You get Bassam in second place by measuring Carla from Bassam instead of from Ahmed, which makes her $-10$.',
        null,
        'Carla is the second **tallest**. This counts from the wrong end of the order.',
        'Ahmed is the tallest, at the opposite end of the order from the one asked about.',
      ],
      keyIdea: 'When clues give amounts ("20 cm taller"), choose one person as zero and give everyone a number; then just sort the numbers.',
    },
    check: {
      optionValues: ['Bassam', 'Dina', 'Carla', 'Ahmed'],
      compute: () => {
        const h: Record<string, number> = { Bassam: 0 };
        h.Ahmed = h.Bassam + 20;
        h.Carla = h.Ahmed - 10;
        h.Dina = h.Bassam + 5;
        return Object.keys(h).sort((a, b) => h[a] - h[b])[1];
      },
    },
  },
  {
    id: 'ordering-puzzles-013',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem:
      'Wafa, Xin, Yara and Zaid are four different heights.\n\n' +
      '- Wafa is taller than Xin.\n' +
      '- Yara is taller than Xin.\n' +
      '- Zaid is shorter than Yara.\n\n' +
      'Which extra clue would make the order certain?',
    options: ['Wafa is taller than Yara.', 'Xin is taller than Zaid.', 'Zaid is taller than Wafa.', 'Yara is taller than Wafa.'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Using ">" for "taller than", the clues are: Wafa > Xin, Yara > Xin, Yara > Zaid. So Yara is above Xin and Zaid, and Wafa is above Xin; nothing compares Wafa with Yara or Zaid, or Zaid with Xin.\n\n' +
        'Test each extra clue:\n\n' +
        '- "Wafa > Yara": then Wafa > Yara > Xin and Yara > Zaid, but Xin and Zaid are still not compared. Two orders remain.\n' +
        '- "Xin > Zaid": then Yara > Xin > Zaid and Wafa > Xin, but Wafa and Yara are not compared. Two orders remain.\n' +
        '- "Zaid > Wafa": then Yara > Zaid > Wafa > Xin. This is a single chain through all four people, so the order is **certain**.\n' +
        '- "Yara > Wafa": then Yara > Wafa > Xin and Yara > Zaid, but Zaid could be in any of three places below Yara. Three orders remain.\n\n' +
        'The clue that fixes the order is **Zaid is taller than Wafa**.',
      whyWrong: [
        'This puts Wafa at the top, but Xin and Zaid are still not compared, so Wafa, Yara, Xin, Zaid and Wafa, Yara, Zaid, Xin both fit.',
        'This orders Yara, Xin, Zaid, but Wafa could be above or below Yara (Wafa only has to beat Xin), so the order is not certain.',
        null,
        'This puts Yara at the top and Wafa above Xin, but Zaid is only known to be shorter than Yara, so Zaid could be second, third or last.',
      ],
      keyIdea: 'The order is certain only when the clues link all the people into one unbroken chain from tallest to shortest.',
    },
    check: {
      optionValues: ['w-gt-y', 'x-gt-z', 'z-gt-w', 'y-gt-w'],
      compute: () => {
        const base = (o: string[]) => before(o, 'W', 'X') && before(o, 'Y', 'X') && before(o, 'Y', 'Z');
        const extras: [string, (o: string[]) => boolean][] = [
          ['w-gt-y', (o) => before(o, 'W', 'Y')],
          ['x-gt-z', (o) => before(o, 'X', 'Z')],
          ['z-gt-w', (o) => before(o, 'Z', 'W')],
          ['y-gt-w', (o) => before(o, 'Y', 'W')],
        ];
        const all = perms(['W', 'X', 'Y', 'Z']).filter(base);
        return extras.filter(([, f]) => all.filter(f).length === 1).map(([k]) => k).join('+');
      },
    },
  },
  {
    id: 'ordering-puzzles-014',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Four people fill seats 1 to 4, left to right.\n\n- Hiro is next to Farah and Jon.\n- Farah is right of Jon.\n- Jon is not at an end.\n\nWho is in seat 3?',
    options: ['Farah', 'Hiro', 'Jon', 'Gus'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The first clue means Hiro is in the middle of a block of three: Farah, Hiro, Jon in some order with Hiro in the centre. Farah is to the right of Jon, so the block reads **Jon, Hiro, Farah** from left to right.\n\n' +
        'The block can start in seat 1 or seat 2:\n\n' +
        '- Start in seat 1: Jon is in seat 1, an end seat. This breaks the last clue.\n' +
        '- Start in seat 2: Jon 2, Hiro 3, Farah 4, and Gus takes seat 1. All clues hold.\n\n' +
        '| Seat | 1 | 2 | 3 | 4 |\n| --- | --- | --- | --- | --- |\n| Person | Gus | Jon | Hiro | Farah |\n\n' +
        'Seat 3: **Hiro**.',
      whyWrong: [
        'This ignores the last clue: Jon, Hiro, Farah, Gus fits the first two clues and puts Farah in seat 3, but it has Jon in an end seat.',
        null,
        'This reads the second clue backwards (Farah left of Jon), which gives Farah, Hiro, Jon, Gus with Jon in seat 3.',
        'Gus has to sit outside the block of three, so he can only be in seat 1 or seat 4.',
      ],
      keyIdea: 'Combine clues into a fixed block first, then slide the block along the row and reject positions that break a clue.',
    },
    check: {
      optionValues: ['Farah', 'Hiro', 'Jon', 'Gus'],
      compute: () => {
        const sols = perms(['Farah', 'Gus', 'Hiro', 'Jon']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return adjRow(s('Hiro'), s('Farah')) && adjRow(s('Hiro'), s('Jon')) && s('Farah') > s('Jon') && s('Jon') !== 0 && s('Jon') !== 3;
        });
        return uniqueOr(sols.map((o) => o[2]));
      },
    },
  },
  {
    id: 'ordering-puzzles-015',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'How many orderings of the letters A, B, C, D have A somewhere before B and do not start with C?',
    options: ['$12$', '$9$', '$18$', '$3$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'There are $4! = 24$ orderings in total.\n\n' +
        'Step 1: orderings with A before B. By symmetry this is half of 24, so $12$.\n\n' +
        'Step 2: remove those that start with C. If C is first, the letters A, B, D fill 3 places in $3! = 6$ ways, and A is before B in half of them: $3$.\n\n' +
        'Step 3: $12 - 3 = 9$.',
      whyWrong: [
        'This is $\\frac{24}{2}$: it uses only the first condition and forgets that the first letter cannot be C.',
        null,
        'This is $24 - 6$: it uses only the second condition (first letter is not C) and forgets that A must come before B.',
        'This is the number of orderings that start with C and have A before B, which are exactly the ones to **exclude**.',
      ],
      keyIdea: 'Counting with two conditions: count those meeting the first condition, then subtract those that meet it but break the second.',
    },
    check: {
      optionValues: [12, 9, 18, 3],
      compute: () => perms(['A', 'B', 'C', 'D']).filter((p) => before(p, 'A', 'B') && p[0] !== 'C').length,
    },
  },
  {
    id: 'ordering-puzzles-022',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem: 'In how many different orders can $3$ people stand in a line?',
    options: ['$3$', '$6$', '$9$', '$27$'],
    correctIndex: 1,
    markScheme: {
      solution: 'There are 3 choices for the first place, 2 for the second and 1 for the third:\n\n$$3 \\times 2 \\times 1 = 3! = 6$$',
      whyWrong: [
        'This counts the people, not the orders. Each person can stand in several different places.',
        null,
        'This is $3 \\times 3$: it multiplies people by places, which is not a counting rule.',
        'This is $3^3$: it lets the same person stand in more than one place.',
      ],
      keyIdea: '$n$ different things can be put in a line in $n!$ ways.',
    },
    check: { optionValues: [3, 6, 9, 27], compute: () => perms(['A', 'B', 'C']).length },
  },
  {
    id: 'ordering-puzzles-023',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem: '"Ann sits immediately to the left of Bo" means:',
    options: ["Ann is in the seat next to Bo, on Bo's left", 'Ann is somewhere to the left of Bo', 'Ann is next to Bo, on either side', 'Ann is in the leftmost seat'],
    correctIndex: 0,
    markScheme: {
      solution: '"Immediately" means the very next seat, and "left of" fixes the side. So Ann is in the seat next to Bo, on Bo\'s left, and nobody sits between them.',
      whyWrong: [
        null,
        'This is "somewhere to the left of", which allows people in between. "Immediately" does not.',
        'This is "next to", which does not say which side. "To the left of" fixes the side.',
        'Ann could be anywhere in the row as long as Bo is in the very next seat on her right.',
      ],
      keyIdea: '"Immediately left of" means the very next seat on that side; "left of" alone allows a gap.',
    },
  },
  {
    id: 'ordering-puzzles-024',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem: 'If Ann is taller than Bo and Bo is taller than Cy, which must be true?',
    options: ['Ann is taller than Cy', 'Cy is taller than Ann', 'Bo is the tallest', 'Ann and Cy are the same height'],
    correctIndex: 0,
    markScheme: {
      solution: 'Write the clues in one chain, with ">" for "is taller than": Ann > Bo > Cy. Reading along the chain, **Ann is taller than Cy**.',
      whyWrong: [
        null,
        'This reverses the chain. Cy is at the bottom, below both of the others.',
        'Bo is in the middle: Ann is taller than Bo.',
        'Ann is above Bo and Cy is below Bo, so they cannot be the same height.',
      ],
      keyIdea: 'Comparisons chain together: if A > B and B > C, then A > C.',
    },
    check: {
      optionValues: ['a>c', 'c>a', 'b top', 'same'],
      compute: () => {
        const sols = perms(['A', 'B', 'C']).filter((o) => before(o, 'A', 'B') && before(o, 'B', 'C'));
        const st: [string, (o: string[]) => boolean][] = [
          ['a>c', (o) => before(o, 'A', 'C')],
          ['c>a', (o) => before(o, 'C', 'A')],
          ['b top', (o) => o[0] === 'B'],
        ];
        return st.filter(([, f]) => sols.every(f)).map(([k]) => k).join('+');
      },
    },
  },
  {
    id: 'ordering-puzzles-025',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem: 'Among four people of different heights, the second shortest is also the:',
    options: ['third tallest', 'second tallest', 'tallest', 'fourth tallest'],
    correctIndex: 0,
    markScheme: {
      solution: 'With $n$ people, position $k$ from the bottom is position $n + 1 - k$ from the top. Here that is $4 + 1 - 2 = 3$, so the second shortest is the **third tallest**.',
      whyWrong: [
        null,
        'This keeps the number 2 when changing ends. The second tallest is a different person from the second shortest.',
        'The tallest is at the opposite end, and is the fourth shortest.',
        'The fourth tallest is the shortest, not the second shortest.',
      ],
      keyIdea: 'Position $k$ from one end of $n$ people is position $n + 1 - k$ from the other end.',
    },
    check: { optionValues: [3, 2, 1, 4], compute: () => 4 + 1 - 2 },
  },
  {
    id: 'ordering-puzzles-026',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Four runners finish with no ties.\n\n- Ann finished second.\n- Bo finished after Ann.\n- Cy finished before Di.\n\nWho finished first?',
    options: ['Bo', 'Cy', 'Di', 'Cannot be determined'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Exactly one runner finished ahead of Ann.\n\n' +
        '- It is not Bo, who finished after Ann.\n' +
        '- It is not Di, because then Cy would have to be even further ahead, and only one place is free.\n\n' +
        'So **Cy** finished first. Bo and Di take the last two places in either order, but that does not change the winner.',
      whyWrong: [
        'This reads "Bo finished after Ann" as "before". Bo is behind Ann, so Bo cannot be first.',
        null,
        'This reads "Cy finished before Di" backwards. Di has Cy ahead of them, so Di cannot be first.',
        'The last two places can swap, but the question asks about first place, which is fixed.',
      ],
      keyIdea: 'An order can be only partly fixed: check whether the position you are asked about is the same in every arrangement.',
    },
    check: {
      optionValues: ['Bo', 'Cy', 'Di', 'ambiguous'],
      compute: () => {
        const sols = perms(['Ann', 'Bo', 'Cy', 'Di']).filter((o) => o[1] === 'Ann' && before(o, 'Ann', 'Bo') && before(o, 'Cy', 'Di'));
        return uniqueOr(sols.map((o) => o[0]));
      },
    },
  },
  {
    id: 'ordering-puzzles-027',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Pam scored more than Quo, and Rae scored more than Sid. Which order, from highest to lowest, is **impossible**?',
    options: ['Pam, Quo, Rae, Sid', 'Rae, Pam, Sid, Quo', 'Pam, Rae, Sid, Quo', 'Quo, Sid, Pam, Rae'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Test each order against both clues: Pam must be above Quo, and Rae must be above Sid.\n\n' +
        '| Order | Pam above Quo? | Rae above Sid? |\n| --- | --- | --- |\n' +
        '| Pam, Quo, Rae, Sid | yes | yes |\n' +
        '| Rae, Pam, Sid, Quo | yes | yes |\n' +
        '| Pam, Rae, Sid, Quo | yes | yes |\n' +
        '| Quo, Sid, Pam, Rae | **no** | **no** |\n\n' +
        'Only **Quo, Sid, Pam, Rae** breaks the clues.',
      whyWrong: [
        'This order fits both clues. The two pairs do not have to mix: nothing links them to each other.',
        'This order fits both clues. Pam and Quo may have other people between them, because "more than" does not mean "next to".',
        'This order fits both clues. Pam is above Quo and Rae is above Sid, even with the pairs overlapping.',
        null,
      ],
      keyIdea: 'To rule out an order, one broken clue is enough; to allow an order, every clue must hold.',
    },
    check: {
      optionValues: ['Pam,Quo,Rae,Sid', 'Rae,Pam,Sid,Quo', 'Pam,Rae,Sid,Quo', 'Quo,Sid,Pam,Rae'],
      compute: () => {
        const opts = ['Pam,Quo,Rae,Sid', 'Rae,Pam,Sid,Quo', 'Pam,Rae,Sid,Quo', 'Quo,Sid,Pam,Rae'];
        return opts.filter((t) => {
          const o = t.split(',');
          return !(before(o, 'Pam', 'Quo') && before(o, 'Rae', 'Sid'));
        }).join('+');
      },
    },
  },
  {
    id: 'ordering-puzzles-028',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Four people fill seats 1 to 4, left to right.\n\n- Amy is in an end seat.\n- Exactly one person sits between Amy and Ben.\n- Cal is in seat 4.\n\nWho is in seat 2?',
    options: ['Ben', 'Cal', 'Dot', 'Amy'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. Cal is in seat 4, so the end seat left for Amy is seat 1.\n' +
        '2. Exactly one person between Amy and Ben means their seat numbers differ by 2, so Ben is in seat 3.\n' +
        '3. Dot takes the last seat, seat 2.\n\n' +
        '| Seat | 1 | 2 | 3 | 4 |\n| --- | --- | --- | --- | --- |\n| Person | Amy | Dot | Ben | Cal |',
      whyWrong: [
        'This reads "exactly one person between" as "next to". One person between means the seat numbers differ by 2.',
        'Cal is fixed in seat 4 by the last clue.',
        null,
        'Seat 2 is not an end seat, and Amy must be in an end seat.',
      ],
      keyIdea: 'Exactly $k$ people between two people means their seat numbers differ by $k + 1$.',
    },
    check: {
      optionValues: ['Ben', 'Cal', 'Dot', 'Amy'],
      compute: () => {
        const sols = perms(['Amy', 'Ben', 'Cal', 'Dot']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return (s('Amy') === 0 || s('Amy') === 3) && Math.abs(s('Amy') - s('Ben')) === 2 && s('Cal') === 3;
        });
        return uniqueOr(sols.map((o) => o[1]));
      },
    },
  },
  {
    id: 'ordering-puzzles-029',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Four people stand in a line. In how many orders is Ann **not** first?',
    options: ['$18$', '$6$', '$24$', '$12$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Count everything, then subtract what is not allowed.\n\n' +
        '- All orders: $4! = 24$.\n' +
        '- Ann first: the other 3 people fill the remaining places in $3! = 6$ ways.\n\n' +
        'Ann not first: $24 - 6 = 18$.',
      whyWrong: [
        null,
        'This is the number of orders where Ann **is** first. It still has to be subtracted from the total.',
        'This is $4!$, every order. It ignores the condition.',
        'This assumes Ann is first in half of all orders. She is first in only 1 of every 4, since there are 4 places.',
      ],
      keyIdea: '"Not" conditions are often easiest as the total minus the cases you do not want.',
    },
    check: {
      optionValues: [18, 6, 24, 12],
      compute: () => perms(['Ann', 'B', 'C', 'D']).filter((o) => o[0] !== 'Ann').length,
    },
  },
];
