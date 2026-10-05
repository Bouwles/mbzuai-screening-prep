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
/** Positions i and j are neighbours on a circle of n seats. */
const adjCircle = (i: number, j: number, n: number) => (i - j + n) % n === 1 || (j - i + n) % n === 1;
/** Number of rotation-distinct circular seatings among the given list of seatings. */
function circularDistinct(seatings: string[][]): number {
  const keys = new Set<string>();
  for (const s of seatings) {
    const k = s.indexOf(s.slice().sort()[0]);
    keys.add([...s.slice(k), ...s.slice(0, k)].join(','));
  }
  return keys.size;
}

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
    stem: 'Five runners take part in a race and there are no ties. In how many different orders can they finish?',
    options: ['$15$', '$60$', '$3125$', '$120$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Fill the places one at a time:\n\n' +
        '- 1st place: any of the 5 runners, so 5 choices.\n' +
        '- 2nd place: one runner is used, so 4 choices.\n' +
        '- 3rd place: 3 choices. 4th place: 2 choices. 5th place: 1 choice.\n\n' +
        'Multiply the choices (the counting principle):\n\n' +
        '$$5 \\times 4 \\times 3 \\times 2 \\times 1 = 5! = 120$$',
      whyWrong: [
        'This is $5 + 4 + 3 + 2 + 1$: the choices were **added**. Each choice for 1st place can be combined with every choice for 2nd place, so you must **multiply**.',
        'This is $5 \\times 4 \\times 3$, the number of ways to fill only the first **three** places (gold, silver, bronze). The question asks for the complete finishing order of all five runners, so keep multiplying down to 1.',
        'This is $5^5$: it allows the same runner to fill more than one place. Once a runner has finished they cannot finish again, so the choices go down by one each time.',
        null,
      ],
      keyIdea: 'The number of ways to arrange $n$ different things in a line is $n! = n \\times (n - 1) \\times \\dots \\times 1$.',
    },
    check: {
      optionValues: [15, 60, 3125, 120],
      compute: () => perms(['A', 'B', 'C', 'D', 'E']).length,
    },
  },
  {
    id: 'ordering-puzzles-004',
    subtopic: 'ordering-puzzles',
    difficulty: 'foundation',
    stem:
      'Five friends sit around a **round** table with five equally spaced seats. Two seatings count as the same if one is just a rotation of the other (everyone has the same left and right neighbours). How many different seatings are there?',
    options: ['$24$', '$120$', '$12$', '$4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'In a row there would be $5! = 120$ orders. Around a round table, rotating everyone one seat gives the **same** seating, and each seating appears in 5 rotations.\n\n' +
        'Quick method: fix one friend in a seat to remove the rotations, then arrange the other 4 around them:\n\n' +
        '$$(5 - 1)! = 4! = 4 \\times 3 \\times 2 \\times 1 = 24$$\n\n' +
        'Check: $\\frac{120}{5} = 24$.',
      whyWrong: [
        null,
        'This is $5! = 120$, the number for a straight **row**. Around a round table each seating has been counted 5 times, once for each rotation.',
        'This is $\\frac{4!}{2}$: it also treats a seating and its mirror image as the same. The question only says rotations are the same, and a mirror image swaps everyone\'s left and right neighbours.',
        'This is $5 - 1 = 4$: it uses the right idea of fixing one person but forgets the factorial. The other 4 people can be arranged in $4!$ ways, not 4.',
      ],
      keyIdea: 'For $n$ people around a round table (rotations the same), fix one person and arrange the rest: $(n - 1)!$ ways.',
    },
    check: {
      optionValues: [24, 120, 12, 4],
      compute: () => circularDistinct(perms(['A', 'B', 'C', 'D', 'E'])),
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
    stem:
      'Arif, Bea, Chloe, Dev and Eman sit in a row of five seats, numbered 1 to 5 from left to right.\n\n' +
      '- Chloe sits in the middle seat.\n' +
      '- Arif sits immediately to the left of Chloe.\n' +
      '- Eman sits at one end of the row.\n' +
      '- Bea does not sit next to Chloe.\n\n' +
      'In which seat does Dev sit?',
    options: ['Seat 2', 'Seat 4', 'Cannot be determined', 'Seat 5'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Place the fixed people first.\n\n' +
        '1. The middle of 5 seats is seat 3, so Chloe is in seat 3.\n' +
        '2. Immediately to the left of seat 3 is seat 2, so Arif is in seat 2.\n' +
        '3. Seats left: 1, 4, 5. Bea is not next to Chloe, so Bea cannot be in seat 4. Bea is in seat 1 or seat 5.\n' +
        '4. Eman is at an end: seat 1 or seat 5.\n' +
        '5. Bea and Eman therefore take seats 1 and 5 between them (in some order), which leaves only seat 4 for Dev.\n\n' +
        '| Seat | 1 | 2 | 3 | 4 | 5 |\n| --- | --- | --- | --- | --- | --- |\n| Person | Bea or Eman | Arif | Chloe | Dev | Eman or Bea |\n\n' +
        'Bea and Eman could swap, but Dev is in **Seat 4** either way.',
      whyWrong: [
        'This comes from putting Arif to the **right** of Chloe (seat 4). With seats numbered left to right, "immediately to the left of seat 3" is seat 2, which is Arif\'s seat.',
        null,
        'It is true that Bea and Eman can swap ends, but both ends are then full, so Dev\'s seat is fixed. Always check whether the person you are asked about is pinned down even if others are not.',
        'This comes from ignoring the clue about Bea. Without it Dev could be at an end, but Bea must avoid seat 4, so Bea and Eman fill both ends.',
      ],
      keyIdea: 'Place the people with fixed seats first, then use "not next to" and "at an end" clues to narrow down the remaining seats.',
    },
    check: {
      optionValues: [2, 4, 'ambiguous', 5],
      compute: () => {
        const sols = perms(['Arif', 'Bea', 'Chloe', 'Dev', 'Eman']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return s('Chloe') === 2 && s('Arif') === s('Chloe') - 1 && (s('Eman') === 0 || s('Eman') === 4) && !adjRow(s('Bea'), s('Chloe'));
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
    id: 'ordering-puzzles-008',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem:
      'Amir, Bilal, Chen, Dana, Elif and Femi sit around a round table at six equally spaced seats.\n\n' +
      '- Bilal sits directly opposite Amir.\n' +
      '- Chen sits immediately clockwise of Amir.\n' +
      '- Dana does not sit next to Amir.\n' +
      '- Elif sits immediately clockwise of Dana.\n\n' +
      'Who sits immediately clockwise of Femi?',
    options: ['Chen', 'Elif', 'Bilal', 'Dana'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Number the seats 0 to 5 going clockwise and put Amir in seat 0 (in a circle you can always fix one person).\n\n' +
        '1. Directly opposite seat 0 in a circle of 6 is $0 + 3 =$ seat 3: Bilal.\n' +
        '2. Immediately clockwise of Amir is seat 1: Chen.\n' +
        '3. Free seats: 2, 4, 5. Amir\'s neighbours are seats 1 and 5, so Dana is in seat 2 or seat 4.\n' +
        '4. If Dana were in seat 2, Elif would need seat 3, but Bilal is there. So Dana is in seat 4 and Elif is in seat 5.\n' +
        '5. Femi takes the last seat, seat 2.\n\n' +
        '| Seat | 0 | 1 | 2 | 3 | 4 | 5 |\n| --- | --- | --- | --- | --- | --- | --- |\n| Person | Amir | Chen | Femi | Bilal | Dana | Elif |\n\n' +
        'Immediately clockwise of Femi (seat 2) is seat 3: **Bilal**.',
      whyWrong: [
        'Chen is immediately **anticlockwise** of Femi. This comes from going the wrong way round the table.',
        'This comes from mixing up Dana and Femi in the last clue (reading it as "Elif sits immediately clockwise of Femi"), which puts Femi in seat 4 and Elif in seat 5. The clue is about Dana: Dana in seat 2 would force Elif into seat 3, which is Bilal\'s, so Dana is in seat 4 and Femi is in seat 2.',
        null,
        'Dana is **two** seats clockwise of Femi, not one. "Immediately clockwise" means the very next seat.',
      ],
      keyIdea: 'In a circle, fix one person, number the seats in the clockwise direction, and test each "either/or" case until only one survives.',
    },
    check: {
      optionValues: ['Chen', 'Elif', 'Bilal', 'Dana'],
      compute: () => {
        const n = 6;
        // o[k] is the person in seat k; seat numbers increase clockwise
        const sols = perms(['Amir', 'Bilal', 'Chen', 'Dana', 'Elif', 'Femi']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return (
            s('Bilal') === (s('Amir') + 3) % n &&
            s('Chen') === (s('Amir') + 1) % n &&
            !adjCircle(s('Dana'), s('Amir'), n) &&
            s('Elif') === (s('Dana') + 1) % n
          );
        });
        return uniqueOr(sols.map((o) => o[(o.indexOf('Femi') + 1) % n]));
      },
    },
  },
  {
    id: 'ordering-puzzles-009',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'Five people, including Xavier and Yusuf, sit in a row of five chairs. In how many ways can they sit if Xavier and Yusuf **must sit next to each other**?',
    options: ['$24$', '$48$', '$120$', '$72$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use the **block method**.\n\n' +
        '1. Glue Xavier and Yusuf together into one block. Now there are 4 "units" to arrange: the block and the other 3 people.\n' +
        '2. Arrange 4 units in a row: $4! = 24$ ways.\n' +
        '3. Inside the block they can sit as Xavier-Yusuf or Yusuf-Xavier: 2 ways.\n' +
        '4. Multiply: $2 \\times 4! = 2 \\times 24 = 48$.',
      whyWrong: [
        'This is $4!$: it arranges the block but forgets that Xavier and Yusuf can swap places inside it, which doubles the count.',
        null,
        'This is $5!$, every possible seating. It ignores the condition that the two must be together.',
        'This is $120 - 48$, the number of seatings where they are **not** next to each other. It answers the opposite question.',
      ],
      keyIdea: '"Must be together": treat them as one block, arrange the units, then multiply by the number of orders inside the block.',
    },
    check: {
      optionValues: [24, 48, 120, 72],
      compute: () => perms(['X', 'Y', 'P', 'Q', 'R']).filter((o) => adjRow(o.indexOf('X'), o.indexOf('Y'))).length,
    },
  },
  {
    id: 'ordering-puzzles-010',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem:
      'Five runners, including Hamad and Isaac, finish a race with no ties. In how many of the possible finishing orders does Hamad finish **before** Isaac (not necessarily immediately before)?',
    options: ['$60$', '$120$', '$24$', '$48$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'There are $5! = 120$ finishing orders altogether.\n\n' +
        'Pair each order with the order you get by **swapping** Hamad and Isaac (everyone else stays put). In exactly one of each pair Hamad is ahead. So exactly half of all orders have Hamad before Isaac:\n\n' +
        '$$\\frac{5!}{2} = \\frac{120}{2} = 60$$',
      whyWrong: [
        null,
        'This is $5!$, all orders. It ignores the condition; in half of these orders Isaac beats Hamad.',
        'This is $4!$, the number of orders where Hamad finishes **immediately** before Isaac (glued together in that order). "Before" allows other runners in between.',
        'This is $2 \\times 4!$, the number of orders where the two finish **next to each other** in either order. That is a different condition.',
      ],
      keyIdea: 'By symmetry, "A before B" holds in exactly half of all orders: $\\frac{n!}{2}$.',
    },
    check: {
      optionValues: [60, 120, 24, 48],
      compute: () => perms(['H', 'I', 'P', 'Q', 'R']).filter((o) => before(o, 'H', 'I')).length,
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
    stem:
      'Five friends compare heights.\n\n' +
      '- Ahmed is 20 cm taller than Bassam.\n' +
      '- Carla is 10 cm shorter than Ahmed.\n' +
      '- Dina is 5 cm taller than Bassam.\n' +
      '- Elena is 15 cm shorter than Carla.\n\n' +
      'Who is the **second shortest**?',
    options: ['Elena', 'Bassam', 'Dina', 'Carla'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Measure everyone relative to Bassam: call Bassam\'s height $0$ (in cm above Bassam).\n\n' +
        '- Ahmed: $0 + 20 = 20$\n' +
        '- Carla: $20 - 10 = 10$\n' +
        '- Dina: $0 + 5 = 5$\n' +
        '- Elena: $10 - 15 = -5$\n' +
        '- Bassam: $0$\n\n' +
        'From shortest to tallest: Elena $(-5)$, Bassam $(0)$, Dina $(5)$, Carla $(10)$, Ahmed $(20)$.\n\n' +
        'The second shortest is **Bassam**.',
      whyWrong: [
        'Elena is the **shortest**, not the second shortest.',
        null,
        'This comes from reading "Elena is 15 cm shorter than Carla" as "taller". Then Elena would be $25$ and Dina would be second shortest. Elena is $10 - 15 = -5$.',
        'This comes from measuring Carla from Bassam instead of from Ahmed ($-10$ instead of $10$). Carla is 10 cm shorter than **Ahmed**: $20 - 10 = 10$.',
      ],
      keyIdea: 'When clues give amounts ("20 cm taller"), choose one person as zero and give everyone a number; then just sort the numbers.',
    },
    check: {
      optionValues: ['Elena', 'Bassam', 'Dina', 'Carla'],
      compute: () => {
        const h: Record<string, number> = { Bassam: 0 };
        h.Ahmed = h.Bassam + 20;
        h.Carla = h.Ahmed - 10;
        h.Dina = h.Bassam + 5;
        h.Elena = h.Carla - 15;
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
      'Which **one** extra clue would make the complete order of heights certain?',
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
    stem:
      'Farah, Gus, Hiro, Isla and Jon sit in a row of five seats, numbered 1 to 5 from left to right.\n\n' +
      '1. Hiro sits next to both Farah and Jon.\n' +
      '2. Gus sits somewhere to the right of Isla.\n' +
      '3. Jon does not sit in an end seat.\n' +
      '4. Farah sits somewhere to the right of Jon.\n' +
      '5. Gus sits in an end seat.\n\n' +
      'Who sits in seat 4?',
    options: ['Hiro', 'Jon', 'Farah', 'Isla'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Clue 1 means Hiro is in the middle of a block of three: Farah, Hiro, Jon in some order with Hiro in the centre. Clue 4 says Farah is to the right of Jon, so the block reads **Jon, Hiro, Farah** from left to right.\n\n' +
        'The block can start in seat 1, 2 or 3:\n\n' +
        '- Start in seat 1: Jon is in seat 1, an end seat. Breaks clue 3.\n' +
        '- Start in seat 2: Jon 2, Hiro 3, Farah 4. Isla and Gus fill seats 1 and 5; Gus is right of Isla, so Isla 1, Gus 5. Gus is at an end. All clues hold.\n' +
        '- Start in seat 3: Jon 3, Hiro 4, Farah 5. Isla 1, Gus 2. Gus is not at an end: breaks clue 5.\n\n' +
        '| Seat | 1 | 2 | 3 | 4 | 5 |\n| --- | --- | --- | --- | --- | --- |\n| Person | Isla | Jon | Hiro | Farah | Gus |\n\n' +
        'Seat 4: **Farah**.',
      whyWrong: [
        'Hiro is in seat 4 in the arrangement Isla, Gus, Jon, Hiro, Farah, which fits clues 1 to 4 but has Gus in seat 2, not at an end. This answer ignores clue 5.',
        'This comes from reading clue 4 backwards (Farah to the left of Jon), which gives the block Farah, Hiro, Jon and allows Isla, Farah, Hiro, Jon, Gus with Jon in seat 4.',
        null,
        'This comes from ignoring clue 3: then Jon, Hiro, Farah, Isla, Gus also fits, with Jon at the end and Isla in seat 4.',
      ],
      keyIdea: 'Combine clues into a fixed block first, then slide the block along the row and reject positions that break a clue.',
    },
    check: {
      optionValues: ['Hiro', 'Jon', 'Farah', 'Isla'],
      compute: () => {
        const sols = perms(['Farah', 'Gus', 'Hiro', 'Isla', 'Jon']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return (
            adjRow(s('Hiro'), s('Farah')) &&
            adjRow(s('Hiro'), s('Jon')) &&
            s('Gus') > s('Isla') &&
            s('Jon') !== 0 &&
            s('Jon') !== 4 &&
            s('Farah') > s('Jon') &&
            (s('Gus') === 0 || s('Gus') === 4)
          );
        });
        return uniqueOr(sols.map((o) => o[3]));
      },
    },
  },
  {
    id: 'ordering-puzzles-015',
    subtopic: 'ordering-puzzles',
    difficulty: 'exam',
    stem: 'This Python program counts arrangements of the letters A, B, C, D that satisfy two conditions. What does it print?',
    code: {
      lang: 'python',
      source:
        "from itertools import permutations\n\ncount = 0\nfor p in permutations('ABCD'):\n    if p.index('A') < p.index('B') and p[0] != 'C':\n        count += 1\nprint(count)",
    },
    options: ['`12`', '`9`', '`18`', '`3`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`permutations(\'ABCD\')` produces all $4! = 24$ orderings, each as a tuple such as `(\'B\', \'A\', \'D\', \'C\')`. An ordering is counted when **both** conditions hold:\n\n' +
        '- `p.index(\'A\') < p.index(\'B\')`: A comes somewhere before B.\n' +
        '- `p[0] != \'C\'`: the first letter is not C.\n\n' +
        'Step 1: orderings with A before B. By symmetry this is half of 24, so $12$.\n\n' +
        'Step 2: remove those that start with C. If C is first, the remaining letters A, B, D fill 3 places in $3! = 6$ ways, and A is before B in half of them: $3$.\n\n' +
        'Step 3: $12 - 3 = 9$.\n\n' +
        'The program prints `9`.',
      whyWrong: [
        'This is $\\frac{24}{2}$: it uses only the first condition and forgets the `and p[0] != \'C\'` part.',
        null,
        'This is $24 - 6$: it uses only the second condition (first letter is not C) and forgets that A must come before B.',
        'This is the number of orderings that start with C and have A before B, which are exactly the ones the program **excludes**.',
      ],
      keyIdea: 'Counting with two conditions joined by `and`: count those meeting the first condition, then subtract those that meet it but break the second.',
    },
    python: { stdout: '9' },
    check: {
      optionValues: [12, 9, 18, 3],
      compute: () => perms(['A', 'B', 'C', 'D']).filter((p) => before(p, 'A', 'B') && p[0] !== 'C').length,
    },
  },

  // ================================================================ challenge
  {
    id: 'ordering-puzzles-016',
    subtopic: 'ordering-puzzles',
    difficulty: 'challenge',
    stem:
      'Leila, Musa, Nour, Omar, Priya and Quinn sit around a round table at six equally spaced seats.\n\n' +
      '- Musa sits directly opposite Leila.\n' +
      '- Priya sits immediately clockwise of Musa.\n' +
      '- Quinn sits next to Leila.\n' +
      '- Nour does not sit next to Leila.\n' +
      '- Omar sits next to Priya.\n\n' +
      'Who sits directly opposite Quinn?',
    options: ['Nour', 'Musa', 'Omar', 'Priya'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Number the seats 0 to 5 clockwise and fix Leila in seat 0.\n\n' +
        '1. Opposite seat 0 (3 seats round, half of 6) is seat 3: Musa.\n' +
        '2. Immediately clockwise of seat 3 is seat 4: Priya.\n' +
        '3. Free seats: 1, 2, 5. Leila\'s neighbours are seats 1 and 5.\n' +
        '4. Nour is not next to Leila, so Nour cannot be in 1 or 5: Nour is in seat 2.\n' +
        '5. Omar is next to Priya (seat 4), whose neighbours are seats 3 and 5. Seat 3 is Musa\'s, so Omar is in seat 5.\n' +
        '6. Quinn takes seat 1, which is next to Leila, as required.\n\n' +
        '| Seat | 0 | 1 | 2 | 3 | 4 | 5 |\n| --- | --- | --- | --- | --- | --- | --- |\n| Person | Leila | Quinn | Nour | Musa | Priya | Omar |\n\n' +
        'Opposite seat 1 is seat $1 + 3 = 4$: **Priya**.',
      whyWrong: [
        'This comes from swapping Quinn and Omar (Quinn in seat 5, opposite seat 2). That ignores the clue that Omar sits next to Priya, which forces Omar into seat 5.',
        'Musa is only **two** seats clockwise of Quinn. In a circle of 6, directly opposite means 3 seats away.',
        'Omar is only **two** seats anticlockwise of Quinn (seat 1 to seat 0 to seat 5). Directly opposite means 3 seats away in either direction.',
        null,
      ],
      keyIdea: 'In a circle of $n$ equally spaced seats, the seat directly opposite seat $k$ is $\\frac{n}{2}$ seats away, in either direction.',
    },
    check: {
      optionValues: ['Nour', 'Musa', 'Omar', 'Priya'],
      compute: () => {
        const n = 6;
        const sols = perms(['Leila', 'Musa', 'Nour', 'Omar', 'Priya', 'Quinn']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return (
            s('Musa') === (s('Leila') + n / 2) % n &&
            s('Priya') === (s('Musa') + 1) % n &&
            adjCircle(s('Quinn'), s('Leila'), n) &&
            !adjCircle(s('Nour'), s('Leila'), n) &&
            adjCircle(s('Omar'), s('Priya'), n)
          );
        });
        return uniqueOr(sols.map((o) => o[(o.indexOf('Quinn') + n / 2) % n]));
      },
    },
  },
  {
    id: 'ordering-puzzles-017',
    subtopic: 'ordering-puzzles',
    difficulty: 'challenge',
    stem:
      'Six people, including Rania and Sami, sit around a round table with six equally spaced seats. Seatings that are rotations of each other count as the same. In how many seatings are Rania and Sami **not** next to each other?',
    options: ['$48$', '$72$', '$120$', '$96$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: all seatings.** Around a round table, $n$ people can sit in $(n - 1)!$ ways: $(6 - 1)! = 5! = 120$.\n\n' +
        '**Step 2: seatings where they ARE together.** Glue Rania and Sami into one block. Now there are 5 units around the table: $(5 - 1)! = 4! = 24$ ways. The block can be Rania-Sami or Sami-Rania: $\\times 2$. Together: $2 \\times 24 = 48$.\n\n' +
        '**Step 3: subtract.** Not together $=$ all $-$ together $= 120 - 48 = 72$.\n\n' +
        'Check another way: fix Rania in a seat. Sami can take any of the other 5 seats, but 2 of them are next to Rania, so 3 seats are allowed. The other 4 people fill the rest in $4! = 24$ ways: $3 \\times 24 = 72$.',
      whyWrong: [
        'This is $2 \\times 4!$, the number of seatings where they **are** together. You still need to subtract it from the total.',
        null,
        'This is $5!$, every circular seating. It ignores the condition.',
        'This is $120 - 24$: it forgot that the glued block can be in either order (Rania-Sami or Sami-Rania), so it subtracted only half of the "together" seatings.',
      ],
      keyIdea: '"Not together" $=$ total $-$ "together"; around a table use $(n - 1)!$ for the total and $2 \\times (n - 2)!$ for "together".',
    },
    check: {
      optionValues: [48, 72, 120, 96],
      compute: () => {
        const seatings = perms(['R', 'S', 'A', 'B', 'C', 'D']).filter((o) => !adjCircle(o.indexOf('R'), o.indexOf('S'), 6));
        return circularDistinct(seatings);
      },
    },
  },
  {
    id: 'ordering-puzzles-018',
    subtopic: 'ordering-puzzles',
    difficulty: 'challenge',
    stem:
      'Aisha, Ben, Carlos and Divya each have a different favourite programming language (Python, Java, C, Rust) and have each been coding for a different whole number of years (1, 2, 3 or 4).\n\n' +
      '1. The Python fan has been coding for 3 years longer than Ben.\n' +
      '2. Divya has been coding for 4 years.\n' +
      '3. Carlos likes C and has been coding for longer than Aisha.\n' +
      '4. The Rust fan has been coding for 1 year.\n\n' +
      'For how many years has the **Java** fan been coding?',
    options: ['$3$', '$2$', '$1$', '$4$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Clue 1: the Python fan has (Ben\'s years) $+ 3$. The years only go up to 4, so Ben has 1 year and the Python fan has 4 years.\n' +
        '2. Clue 2: Divya has 4 years, so Divya is the Python fan.\n' +
        '3. Clue 4: the Rust fan has 1 year, and Ben has 1 year, so Ben likes Rust.\n' +
        '4. Clue 3: Carlos likes C. The only language left is Java, so Aisha likes Java.\n' +
        '5. Years left for Aisha and Carlos: 2 and 3. Carlos has coded longer than Aisha, so Carlos has 3 and Aisha has 2.\n\n' +
        '| Person | Language | Years |\n| --- | --- | --- |\n| Aisha | Java | 2 |\n| Ben | Rust | 1 |\n| Carlos | C | 3 |\n| Divya | Python | 4 |\n\n' +
        'The Java fan (Aisha) has been coding for **2** years.',
      whyWrong: [
        'This comes from reading clue 3 backwards and giving Aisha more years than Carlos. Carlos has coded **longer**, so Carlos gets 3 and Aisha gets 2.',
        null,
        'This is Ben\'s number of years, and Ben is the **Rust** fan. Make sure you answer for the person the question asks about (the Java fan).',
        'This comes from reading clue 1 as "the Python fan has coded for 3 years". That makes Ben the Python fan and leaves Java to Divya with 4 years, but clue 1 says 3 years **longer than Ben**.',
      ],
      keyIdea: 'Start from the most restrictive clue (here "3 years longer" when the maximum is 4), then let each deduction unlock the next.',
    },
    check: {
      optionValues: [3, 2, 1, 4],
      compute: () => {
        const people = ['Aisha', 'Ben', 'Carlos', 'Divya'];
        const answers: number[] = [];
        for (const lang of perms(['Python', 'Java', 'C', 'Rust'])) {
          for (const yrs of perms([1, 2, 3, 4])) {
            const y = (p: string) => yrs[people.indexOf(p)];
            const fan = (l: string) => people[lang.indexOf(l)];
            const ok =
              y(fan('Python')) === y('Ben') + 3 &&
              y('Divya') === 4 &&
              fan('C') === 'Carlos' &&
              y('Carlos') > y('Aisha') &&
              y(fan('Rust')) === 1;
            if (ok) answers.push(y(fan('Java')));
          }
        }
        return uniqueOr(answers);
      },
    },
  },
  {
    id: 'ordering-puzzles-019',
    subtopic: 'ordering-puzzles',
    difficulty: 'challenge',
    stem:
      'Six runners, P, Q, R, S, T and U, finish a race with no ties.\n\n' +
      '1. S finished last.\n' +
      '2. R finished immediately after U.\n' +
      '3. Exactly two runners finished between P and Q.\n' +
      '4. T finished before P.\n' +
      '5. Q finished before U.\n\n' +
      'Who finished **second**?',
    options: ['T', 'P', 'Q', 'U'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Clue 1: S is 6th, so P, Q, R, T, U fill places 1 to 5.\n\n' +
        'Clue 3: exactly two runners between P and Q means their places differ by 3. Within places 1 to 5 the pairs are $\\{1, 4\\}$ and $\\{2, 5\\}$.\n\n' +
        'Try each case (U and R must be consecutive, U first):\n\n' +
        '- P 1st: T cannot finish before P. Rejected.\n' +
        '- P 4th, Q 1st: free places 2, 3, 5. U, R must be 2, 3, leaving T 5th, after P. Breaks clue 4.\n' +
        '- P 2nd, Q 5th: free places 1, 3, 4. U 3rd, R 4th, T 1st. But Q (5th) is after U (3rd). Breaks clue 5.\n' +
        '- P 5th, Q 2nd: free places 1, 3, 4. U 3rd, R 4th, T 1st. T is before P and Q is before U. All clues hold.\n\n' +
        '| Place | 1st | 2nd | 3rd | 4th | 5th | 6th |\n| --- | --- | --- | --- | --- | --- | --- |\n| Runner | T | Q | U | R | P | S |\n\n' +
        'Second place: **Q**.',
      whyWrong: [
        'This comes from reading "exactly two runners between P and Q" as only **one** runner between them (places differing by 2), which gives Q, T, P, U, R, S.',
        'P is second in T, P, U, R, Q, S, which fits clues 1 to 4 but has Q after U. This answer forgets to apply clue 5.',
        null,
        'This comes from ignoring clue 4: then Q, U, R, P, T, S also fits the other clues, with U second. But T must finish before P.',
      ],
      keyIdea: '"Exactly $k$ between X and Y" means their positions differ by $k + 1$: list the possible position pairs and test each case.',
    },
    check: {
      optionValues: ['T', 'P', 'Q', 'U'],
      compute: () => {
        const sols = perms(['P', 'Q', 'R', 'S', 'T', 'U']).filter((o) => {
          const s = (x: string) => o.indexOf(x);
          return s('S') === 5 && s('R') === s('U') + 1 && Math.abs(s('P') - s('Q')) === 3 && s('T') < s('P') && s('Q') < s('U');
        });
        return uniqueOr(sols.map((o) => o[1]));
      },
    },
  },
  {
    id: 'ordering-puzzles-020',
    subtopic: 'ordering-puzzles',
    difficulty: 'challenge',
    stem:
      'Four boys and three girls (all different people) stand in a row of seven. In how many ways can they stand if **no two boys stand next to each other and no two girls stand next to each other**?',
    options: ['$288$', '$5040$', '$144$', '$30$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'No two of the same kind can be neighbours, so boys and girls must **alternate**.\n\n' +
        '1. With 4 boys and 3 girls in 7 places, the only alternating pattern is B G B G B G B. (Starting with a girl, G B G B G B G, would need 4 girls.)\n' +
        '2. Arrange the 4 boys in the 4 B places: $4! = 24$ ways.\n' +
        '3. Arrange the 3 girls in the 3 G places: $3! = 6$ ways.\n' +
        '4. Multiply: $1 \\times 24 \\times 6 = 144$.',
      whyWrong: [
        'This is $2 \\times 4! \\times 3!$: it doubles for "start with a boy or start with a girl". That doubling is right when the groups are the same size, but with 4 boys and 3 girls a row starting with a girl is impossible.',
        'This is $7!$, every possible line-up, ignoring the condition.',
        null,
        'This is $4! + 3!$: the two arrangements were **added**. Every boy order combines with every girl order, so multiply.',
      ],
      keyIdea: 'For alternating arrangements, first find which patterns are possible, then multiply the arrangements within each group.',
    },
    check: {
      optionValues: [288, 5040, 144, 30],
      compute: () =>
        perms(['B1', 'B2', 'B3', 'B4', 'G1', 'G2', 'G3']).filter((o) => o.every((x, i) => i === 0 || x[0] !== o[i - 1][0])).length,
    },
  },
  {
    id: 'ordering-puzzles-021',
    subtopic: 'ordering-puzzles',
    difficulty: 'challenge',
    stem:
      'Five people, Adel, Basma, Chris, Dua and Eli, sit in a row of five seats. Chris must sit in one of the two **end** seats, and Adel and Basma must **not** sit next to each other. How many seatings are possible?',
    options: ['$24$', '$48$', '$72$', '$36$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1: Chris at an end.** Chris has 2 choices (left end or right end). The other 4 people fill the other 4 seats in $4! = 24$ ways. Total: $2 \\times 24 = 48$.\n\n' +
        '**Step 2: of these, count where Adel and Basma ARE next to each other.** With Chris at an end, the other 4 seats form an unbroken row of 4. Glue Adel and Basma into a block: the block and Dua and Eli are 3 units, arranged in $3! = 6$ ways, times 2 for the order inside the block: $12$ per end. For both ends: $2 \\times 12 = 24$.\n\n' +
        '**Step 3: subtract.** $48 - 24 = 24$.\n\n' +
        'Check: with Chris on the left, seats 2 to 5 hold the others. The non-adjacent seat pairs for Adel and Basma are $\\{2, 4\\}$, $\\{2, 5\\}$ and $\\{3, 5\\}$: 3 pairs, times 2 orders, times $2!$ for Dua and Eli $= 12$. Double for Chris on the right: $24$.',
      whyWrong: [
        null,
        'This is $2 \\times 4!$, the seatings with Chris at an end. It forgets the condition that Adel and Basma must not be next to each other.',
        'This is $5! - 2 \\times 4!$, the seatings where Adel and Basma are apart, but it forgets that Chris must be at an end.',
        'This is $48 - 12$: when subtracting the "together" cases it counted only one end for Chris (or only one order of the Adel-Basma block).',
      ],
      keyIdea: 'Apply the "fixed position" condition first, then subtract the unwanted "together" cases counted under the same condition.',
    },
    check: {
      optionValues: [24, 48, 72, 36],
      compute: () =>
        perms(['A', 'B', 'C', 'D', 'E']).filter((o) => (o.indexOf('C') === 0 || o.indexOf('C') === 4) && !adjRow(o.indexOf('A'), o.indexOf('B'))).length,
    },
  },
];
