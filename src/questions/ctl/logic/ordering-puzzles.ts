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
      asking: 'Put the four friends in height order. Who is second from the top?',
      solution:
        'Turn every clue into the same form, using $>$ to mean "is taller than". "Chen is shorter than Bilal" is the same fact as Bilal $>$ Chen.\n\n- Amal $>$ Bilal\n- Bilal $>$ Chen\n- Dana $>$ Amal\n\n' +
        'Join the clues at the people who appear twice. Dana is above Amal, Amal is above Bilal, and Bilal is above Chen. That makes one line: Dana $>$ Amal $>$ Bilal $>$ Chen.\n\n' +
        'Count from the tallest end. Dana is first, and the next person along is Amal.',
      conclusion: 'Only one order fits all three clues, and the second tallest in it is Amal.',
      whyWrong: [
        'Dana is the **tallest**, not the second tallest. Read the question carefully: it asks for position 2 from the top.',
        null,
        'Bilal is second from the **bottom**. This comes from counting from the shortest end instead of the tallest end.',
        'This comes from reading "Chen is shorter than Bilal" backwards, as if Chen were taller than Bilal; then Chen could slot in above Bilal, even in second place. In fact Chen is below Bilal, so Chen is the shortest of all.',
      ],
      keyIdea: 'Rewrite all comparison clues in one direction using $>$, then link them into one line. Count positions from the end the question names: "second tallest" counts from the tall end.',
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
      asking: 'Put the four runners in finishing order. Who is in third place?',
      solution:
        'Rewrite the clues using "before", with $\\to$ meaning "finished before". "Tom finished after Sam" is the same fact as Sam $\\to$ Tom.\n\n- Raya $\\to$ Sam\n- Sam $\\to$ Tom\n- Uma $\\to$ Raya\n\n' +
        'Join the clues at the shared names: Uma $\\to$ Raya $\\to$ Sam $\\to$ Tom.\n\n' +
        'Count along the line: Uma is 1st, Raya is 2nd, Sam is 3rd and Tom is 4th.',
      conclusion: 'The clues allow only one order, and third in that order is Sam.',
      whyWrong: [
        'Raya is third only if you count from the **last** runner backwards. Raya finished second.',
        'This comes from misreading "Tom finished after Sam" as "before Sam", which lets Tom move up the order. Tom is after Sam, so Tom is last.',
        null,
        'The three clues join all four runners into one chain (Uma, Raya, Sam, Tom), so there is only one possible order and the answer can be determined.',
      ],
      keyIdea: 'Rewrite "after" clues as "before" clues, link the names that appear in two clues, and number the positions. If the clues form one unbroken chain, there is only one possible order.',
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
      asking: 'How many different full finishing orders can four runners have?',
      solution:
        'Fill the places one at a time. Any of the 4 runners can come 1st, so there are 4 choices.\n\n' +
        'One runner has now been used, so there are 3 choices for 2nd place. Then there are 2 choices for 3rd, and 1 runner is left for 4th.\n\n' +
        'Each choice can be paired with every later choice, so we multiply rather than add: $4 \\times 3 \\times 2 \\times 1 = 24$.',
      conclusion: 'Multiplying the choices for each place gives $24$ different finishing orders.',
      whyWrong: [
        'This is $4 + 3 + 2 + 1$: the choices were **added**. Each choice for 1st place can be combined with every choice for 2nd place, so you must **multiply**.',
        'This is $4 \\times 3$, the number of ways to fill only the first **two** places. The question asks for the complete finishing order, so keep multiplying down to 1.',
        'This is $4^4$: it allows the same runner to fill more than one place. Once a runner has finished they cannot finish again, so the choices go down by one each time.',
        null,
      ],
      keyIdea: 'To arrange $n$ different things in a line, multiply the choices for each place: $n \\times (n-1) \\times \\dots \\times 1$. This is written $n!$ and read "$n$ factorial". For example, $4! = 24$.',
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
      asking: 'Match each person to a pet. Who has the fish?',
      solution:
        'Start with the fixed fact. Badr owns the dog, so Ali and Cara must share the cat and the fish.\n\n' +
        'Ali does not own the cat. Out of the cat and the fish, that leaves the fish for Ali, and the cat goes to Cara.',
      conclusion: 'Badr has the dog and Ali cannot have the cat, so the fish belongs to Ali.',
      whyWrong: [
        'Badr owns the dog, and each person owns exactly one pet, so Badr cannot also own the fish.',
        'Cara would own the fish only if Ali owned the cat, but the second clue says Ali does not own the cat.',
        'It can be determined: once the dog is given to Badr, Ali has only the cat and the fish left, and the cat is ruled out. Remember that each pet goes to exactly one person.',
        null,
      ],
      keyIdea: 'In matching puzzles, draw a grid of people and items. Fill in each fixed fact, cross that item out for everyone else, then look for a person with only one item left.',
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
      asking: 'Use the seat clues to find which seat Dev is in.',
      solution:
        'Draw four seats, numbered 1 to 4 from the left. The first clue puts Chloe in seat 3:\n\n| Seat 1 | Seat 2 | Seat 3 | Seat 4 |\n|---|---|---|---|\n|  |  | Chloe |  |\n\n' +
        '"Immediately left of" means the very next seat on the left. That is seat 2, so Arif goes in seat 2.\n\n' +
        'The seats next to Chloe are 2 and 4. Bea cannot be in either of them, so Bea goes in seat 1.\n\n' +
        'Dev is the only person left, and only seat 4 is still empty. So Dev sits in seat 4.',
      conclusion: 'The seats read Bea, Arif, Chloe, Dev from the left, which puts Dev in Seat 4.',
      whyWrong: [
        'This reads "not next to" as "next to". Bea would then take seat 4 and leave seat 1 for Dev.',
        'This puts Arif to the **right** of Chloe, in seat 4, which leaves seat 2 for Dev. With seats numbered left to right, "immediately left of seat 3" is seat 2.',
        null,
        'Every clue is needed, but together they fix all four seats, so there is only one arrangement.',
      ],
      keyIdea: 'Draw the numbered seats first and place the fixed clues. Then use the "immediately left" or "next to" clues, then the "not" clues. Anyone left over goes in the empty seat.',
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
      asking: 'Which statement stays true in every order that fits the clues?',
      solution:
        'Use $>$ to mean "scored more than". The clues say Priya $>$ Quinn, Quinn $>$ Ravi ("Ravi scored less than Quinn" is the same fact), and Sara $>$ Ravi.\n\n' +
        'Link the first two: Priya $>$ Quinn $>$ Ravi. Sara is only known to be above Ravi, so she could fit in anywhere above him.\n\n' +
        'That leaves three possible orders:\n\n| Highest | 2nd | 3rd | Lowest |\n|---|---|---|---|\n| Sara | Priya | Quinn | Ravi |\n| Priya | Sara | Quinn | Ravi |\n| Priya | Quinn | Sara | Ravi |\n\n' +
        'Test each statement against all three rows. Priya is not always top, Sara is not always above Quinn, and Quinn is not always second. But Ravi is lowest in all three rows.',
      conclusion: '"Must be true" means true in all three orders, and only this one is: Ravi has the lowest score.',
      whyWrong: [
        'This is only *possible*, not certain: Sara is only known to beat Ravi, so Sara could also beat Priya (order Sara, Priya, Quinn, Ravi).',
        'This could be true but need not be: the order Priya, Quinn, Sara, Ravi fits every clue and has Sara below Quinn.',
        null,
        'This is one possibility (Priya, Quinn, Sara, Ravi), but Sara could also sit above Quinn, pushing Quinn to third. "Must be true" means true in **every** possible order.',
      ],
      keyIdea: 'For "must be true" questions, list every order that fits the clues in a small table. Cross out any statement that fails in even one row. A person is certain to be last only if everyone else is above them, directly or through a chain of clues.',
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
      asking: 'How many seatings keep Xavier and Yusuf side by side?',
      solution:
        'Treat Xavier and Yusuf as one block, because they must stay together. Now we are arranging 3 things: the block and the two other people.\n\n' +
        'Three things can go in a row in $3 \\times 2 \\times 1 = 6$ ways.\n\n' +
        'Inside the block, the pair can sit in two orders: Xavier then Yusuf, or Yusuf then Xavier.\n\n' +
        'Each of the 6 arrangements can use either order inside the block, so we multiply: $6 \\times 2 = 12$.',
      conclusion: 'Arranging the block and then the pair inside it gives $6 \\times 2$, so the answer is $12$.',
      whyWrong: [
        'This is $3!$: it arranges the block but forgets that Xavier and Yusuf can swap places inside it, which doubles the count.',
        null,
        'This is $4!$, every possible seating. It ignores the condition that the two must be together.',
        'This counts only the 3 pairs of neighbouring chairs. It forgets that the pair can swap and that the other two people can swap.',
      ],
      keyIdea: 'For "must sit together", glue the pair into one block, arrange the block with the others, then multiply by 2 for the two orders inside. With $n$ people this gives $2 \\times (n-1)!$, where $!$ means multiply down to 1.',
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
      asking: 'In how many finishing orders is Hamad somewhere ahead of Isaac?',
      solution:
        'Start with all finishing orders, with no condition: $4 \\times 3 \\times 2 \\times 1 = 24$.\n\n' +
        'Take any order and swap Hamad and Isaac. For example, with two other runners Pat and Tia, the order Hamad, Pat, Isaac, Tia becomes Isaac, Pat, Hamad, Tia. This pairs every order with exactly one other order.\n\n' +
        'In each pair, Hamad is ahead in exactly one of the two orders. So Hamad is ahead in exactly half of all orders.\n\n' +
        'Half of 24 is $24 \\div 2 = 12$.',
      conclusion: 'Hamad is ahead in exactly half of the orders, which gives $12$.',
      whyWrong: [
        null,
        'This is $4!$, all orders. It ignores the condition; in half of these orders Isaac beats Hamad.',
        'This is $3!$, the number of orders where Hamad finishes **immediately** before Isaac (glued together in that order). "Before" allows other runners in between.',
        'This fixes Hamad first and Isaac second, which is only one of the ways for Hamad to beat Isaac.',
      ],
      keyIdea: 'When one person must be somewhere before another, with gaps allowed, use symmetry: each person is ahead in exactly half of all orders. So the answer is $n! \\div 2$, where $n$ is the number of people and $n!$ means $n \\times (n-1) \\times \\dots \\times 1$. Use a block only if the word "immediately" appears.',
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
      asking: 'Match each person to a drink. Which pairing is right?',
      solution:
        'Start with the fixed fact. Imran has coffee, so nobody else has it.\n\n' +
        'Hana cannot have tea or juice, and coffee is taken. That leaves only water for Hana.\n\n' +
        'Tea and juice are left for Jae and Kofi. Kofi does not order tea, so Jae has the tea and Kofi has the juice.',
      conclusion: 'Every drink is now placed: Imran coffee, Hana water, Jae tea, and the pairing that matches is Kofi: juice.',
      whyWrong: [
        'If Jae had juice, Kofi would be left with tea or water. Hana must have water, so Kofi would have tea, which breaks the third clue.',
        'This breaks the second clue: Hana orders neither tea nor juice.',
        'Water is forced for Hana first (she cannot have tea, juice or coffee). This comes from filling in Kofi\'s row before using Hana\'s clue.',
        null,
      ],
      keyIdea: 'In matching puzzles, make a grid of people and items. Place definite facts first, and cross that item out everywhere else. Then look for a person or an item with only one choice left, and repeat.',
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
      asking: 'Put the four friends in height order. Who is second from the shortest end?',
      solution:
        'These clues give amounts, so measure everyone from one person. Bassam is a good choice because two clues use him. Write each height as centimetres above Bassam:\n\n| Person | Working | cm above Bassam |\n|---|---|---|\n| Bassam | starting point | 0 |\n| Ahmed | 20 taller than Bassam | 20 |\n| Carla | 10 shorter than Ahmed: $20 - 10$ | 10 |\n| Dina | 5 taller than Bassam | 5 |\n\n' +
        'Sort the numbers from smallest to largest: 0, 5, 10, 20.\n\n' +
        'Match them back to people. The smallest, 0, is Bassam, so he is the shortest. The next, 5, is Dina.',
      conclusion: 'From shortest to tallest the order is Bassam, Dina, Carla, Ahmed, so the second shortest is Dina.',
      whyWrong: [
        'Bassam is the **shortest**. You get Bassam in second place by measuring Carla from Bassam instead of from Ahmed, which makes her $-10$.',
        null,
        'Carla is the second **tallest**. This counts from the wrong end of the order.',
        'Ahmed is the tallest, at the opposite end of the order from the one asked about.',
      ],
      keyIdea: 'When clues give amounts, pick one person as the zero point and write everyone as a number above or below them. Sort the numbers, then count from the end the question names.',
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
      asking: 'Which one extra clue leaves only one possible height order?',
      solution:
        'Use $>$ for "is taller than". The clues say Wafa $>$ Xin, Yara $>$ Xin and Yara $>$ Zaid. They leave some pairs not compared, such as Wafa and Zaid.\n\n' +
        'The order is certain only when one line joins all four people. Test each clue that does not do this:\n\n| Extra clue | What we get | Still unknown |\n|---|---|---|\n| Wafa $>$ Yara | Wafa $>$ Yara $>$ Xin, and Yara $>$ Zaid | Xin and Zaid |\n| Xin $>$ Zaid | Yara $>$ Xin $>$ Zaid, and Wafa $>$ Xin | Wafa and Yara |\n| Yara $>$ Wafa | Yara $>$ Wafa $>$ Xin, and Yara $>$ Zaid | Where Zaid goes |\n\n' +
        'Now try Zaid $>$ Wafa. Join it to the others: Yara $>$ Zaid, then Zaid $>$ Wafa, then Wafa $>$ Xin. That is one line with nothing left unknown: Yara, Zaid, Wafa, Xin.',
      conclusion: 'Only this clue joins all four into a single line, so the clue we need is: Zaid is taller than Wafa.',
      whyWrong: [
        'This puts Wafa at the top, but Xin and Zaid are still not compared, so Wafa, Yara, Xin, Zaid and Wafa, Yara, Zaid, Xin both fit.',
        'This orders Yara, Xin, Zaid, but Wafa could be above or below Yara (Wafa only has to beat Xin), so the order is not certain.',
        null,
        'This puts Yara at the top and Wafa above Xin, but Zaid is only known to be shorter than Yara, so Zaid could be second, third or last.',
      ],
      keyIdea: 'Draw the clues as arrows. The order is certain only if the arrows form one unbroken line through everyone. Test each extra clue: if two people are still not compared, directly or through others, the order is not certain.',
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
      asking: 'Place the people in seats 1 to 4. Who is in seat 3?',
      solution:
        'Hiro is next to Farah and also next to Jon, so Hiro sits between them. Those three form a block.\n\n' +
        'Farah is to the right of Jon, so the block reads Jon, Hiro, Farah from left to right.\n\n' +
        'The fourth person, Gus, takes the seat outside the block. A block of three fits four seats in only two ways:\n\n| Seat 1 | Seat 2 | Seat 3 | Seat 4 |\n|---|---|---|---|\n| Jon | Hiro | Farah | Gus |\n| Gus | Jon | Hiro | Farah |\n\n' +
        '"Jon is not at an end" rules out the first row, where Jon is in seat 1. In the second row, seat 3 holds Hiro.',
      conclusion: 'Only the order Gus, Jon, Hiro, Farah fits all the clues, so seat 3 holds Hiro.',
      whyWrong: [
        'This ignores the last clue: Jon, Hiro, Farah, Gus fits the first two clues and puts Farah in seat 3, but it has Jon in an end seat.',
        null,
        'This reads the second clue backwards (Farah left of Jon), which gives Farah, Hiro, Jon, Gus with Jon in seat 3.',
        'Gus has to sit outside the block of three, so he can only be in seat 1 or seat 4.',
      ],
      keyIdea: 'Join "next to" clues into a block first, then fix its direction with any left or right clue. List the places the block can slide to, and use the remaining clues to rule places out.',
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
      asking: 'Count the orders of A, B, C, D where A comes before B and C is not first.',
      solution:
        'Start with all orders of 4 letters: $4 \\times 3 \\times 2 \\times 1 = 24$.\n\n' +
        'A comes before B in exactly half of them, because swapping A and B turns each order into one with those two the other way round. So $24 \\div 2 = 12$ orders have A before B.\n\n' +
        'Some of those 12 start with C, and we must remove them. With C first and A before B, the only orders are CABD, CADB and CDAB. That is 3 orders.\n\n' +
        'Take them away: $12 - 3 = 9$.',
      conclusion: 'There are 12 orders with A before B, and 3 of those start with C, which leaves $9$.',
      whyWrong: [
        'This is $\\frac{24}{2}$: it uses only the first condition and forgets that the first letter cannot be C.',
        null,
        'This is $24 - 6$: it uses only the second condition (first letter is not C) and forgets that A must come before B.',
        'This is the number of orderings that start with C and have A before B, which are exactly the ones to **exclude**.',
      ],
      keyIdea: 'With two conditions, handle them one at a time. Count the orders meeting the first condition, then subtract those that meet it but break the second. Use "half" for a before-or-after condition, and multiply down for free places.',
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
      asking: 'How many different line-ups can 3 people make?',
      solution:
        'Fill the line one place at a time. Any of the 3 people can stand first. Then 2 people are left for the second place, and 1 for the last place.\n\n' +
        'Each choice pairs with every later choice, so multiply: $3 \\times 2 \\times 1 = 6$. With people called X, Y and Z, these are XYZ, XZY, YXZ, YZX, ZXY and ZYX.',
      conclusion: 'Multiplying the choices for each place gives $6$ different orders.',
      whyWrong: [
        'This counts the people, not the orders. Each person can stand in several different places.',
        null,
        'This is $3 \\times 3$: it multiplies people by places, which is not a counting rule.',
        'This is $3^3$: it lets the same person stand in more than one place.',
      ],
      keyIdea: 'To count line-ups of $n$ different people, multiply $n \\times (n-1) \\times \\dots \\times 1$, which is written $n!$. For small $n$, list them to confirm the count.',
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
      asking: 'What does "immediately to the left" tell us about Ann\'s seat?',
      solution:
        'Break the phrase into two parts. "To the left of Bo" fixes the side: Ann is on Bo\'s left, not his right.\n\n' +
        '"Immediately" means with nobody in between. So Ann is in the very next seat to Bo, on his left.',
      conclusion: 'Both parts together mean: Ann is in the seat next to Bo, on Bo\'s left.',
      whyWrong: [
        null,
        'This is "somewhere to the left of", which allows people in between. "Immediately" does not.',
        'This is "next to", which does not say which side. "To the left of" fixes the side.',
        'Ann could be anywhere in the row as long as Bo is in the very next seat on her right.',
      ],
      keyIdea: 'Know these three phrases. "Next to" means neighbouring seats, on either side. "To the left of" means that side, with gaps allowed. "Immediately to the left of" means both: the neighbouring seat on that side.',
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
      asking: 'What must be true when we compare Ann with Cy?',
      solution:
        'Write the clues as one line, with $>$ meaning "is taller than": Ann $>$ Bo $>$ Cy.\n\n' +
        'Going down that line you meet Ann first, then Bo, then Cy. So Cy is below Bo, and Bo is below Ann, which puts Ann above Cy.',
      conclusion: 'Height comparisons pass along the chain, so what must be true is: Ann is taller than Cy.',
      whyWrong: [
        null,
        'This reverses the chain. Cy is at the bottom, below both of the others.',
        'Bo is in the middle: Ann is taller than Bo.',
        'Ann is above Bo and Cy is below Bo, so they cannot be the same height.',
      ],
      keyIdea: '"Taller than" passes along a chain: if $A > B$ and $B > C$, then $A > C$. Whenever comparisons share a person, join them into one line and read any comparison from it.',
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
      asking: 'Counting from the tall end, what position is the second shortest person in?',
      solution:
        'Line the four people up from tallest to shortest and number them 1, 2, 3, 4. Position 1 is the tallest and position 4 is the shortest.\n\n' +
        'Second shortest means one step up from the bottom. One step up from position 4 is position 3.\n\n' +
        'Position 3 from the top means exactly two people are taller, so this person is third in the height order.',
      conclusion: 'Position 3 counted from the top is the same person, so the second shortest is also the third tallest.',
      whyWrong: [
        null,
        'This keeps the number 2 when changing ends. The second tallest is a different person from the second shortest.',
        'The tallest is at the opposite end, and is the fourth shortest.',
        'The fourth tallest is the shortest, not the second shortest.',
      ],
      keyIdea: 'To switch ends, use: position from one end $=$ total $+ 1 -$ position from the other end. Here that is $4 + 1 - 2 = 3$.',
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
      asking: 'Using the clues, who came in first place?',
      solution:
        'Write down the fixed fact: Ann is 2nd. So Ann is not 1st, and the places left are 1st, 3rd and 4th.\n\n' +
        'Bo finished after Ann, so Bo is 3rd or 4th. Bo cannot be 1st.\n\n' +
        'Cy finished before Di, so someone is ahead of Di. Di cannot be 1st.\n\n' +
        'That rules out Ann, Bo and Di, which leaves only Cy for 1st place. Bo and Di take 3rd and 4th. We do not know which way round, but the question does not need that.',
      conclusion: 'Everyone else is ruled out of first place, so the person who finished first is Cy.',
      whyWrong: [
        'This reads "Bo finished after Ann" as "before". Bo is behind Ann, so Bo cannot be first.',
        null,
        'This reads "Cy finished before Di" backwards. Di has Cy ahead of them, so Di cannot be first.',
        'The last two places can swap, but the question asks about first place, which is fixed.',
      ],
      keyIdea: 'To find who is first, cross out anyone with someone known to be ahead of them. The person left must be first. You can often answer even when other places are undecided, so do not stop just because the whole order is not fixed.',
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
      asking: 'Which ranking breaks the clues?',
      solution:
        'We have two rules: Pam must be above Quo, and Rae must be above Sid. Nothing else is required, so the two pairs can mix in any way.\n\n' +
        'Test each order against both rules. Only the last order fails, and it fails both:\n\n| Order, highest first | Pam above Quo? | Rae above Sid? |\n|---|---|---|\n| Pam, Quo, Rae, Sid | Yes | Yes |\n| Rae, Pam, Sid, Quo | Yes | Yes |\n| Pam, Rae, Sid, Quo | Yes | Yes |\n| Quo, Sid, Pam, Rae | No | No |',
      conclusion: 'An impossible order breaks at least one clue, and this one breaks both: Quo, Sid, Pam, Rae.',
      whyWrong: [
        'This order fits both clues. The two pairs do not have to mix: nothing links them to each other.',
        'This order fits both clues. Pam and Quo may have other people between them, because "more than" does not mean "next to".',
        'This order fits both clues. Pam is above Quo and Rae is above Sid, even with the pairs overlapping.',
        null,
      ],
      keyIdea: 'To find an impossible order, test each option against each clue in a small table of yes and no. "More than" only fixes who is higher, not whether they are next to each other, so gaps and mixing are allowed.',
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
      asking: 'Place the people in seats 1 to 4. Who is in seat 2?',
      solution:
        'Cal is in seat 4, which is one of the two end seats. Amy must be in an end seat too, so Amy is in seat 1.\n\n' +
        '"Exactly one person between Amy and Ben" means Ben is two seats away from Amy. Two seats along from seat 1 is seat 3.\n\n' +
        'Amy, Ben and Cal now fill seats 1, 3 and 4, so only seat 2 is empty. The fourth person, Dot, is the only one not placed, so Dot sits in seat 2.',
      conclusion: 'The seats read Amy, Dot, Ben, Cal, so seat 2 holds Dot.',
      whyWrong: [
        'This reads "exactly one person between" as "next to". One person between means the seat numbers differ by 2.',
        'Cal is fixed in seat 4 by the last clue.',
        null,
        'Seat 2 is not an end seat, and Amy must be in an end seat.',
      ],
      keyIdea: 'Draw numbered seats and place the fixed person first. "End seat" leaves only seat 1 or seat 4. "Exactly one between" means the seat numbers differ by 2. Whoever is left takes the empty seat.',
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
      asking: 'How many line-ups of four have someone other than Ann at the front?',
      solution:
        'Count everything first. Four people in a line make $4 \\times 3 \\times 2 \\times 1 = 24$ orders.\n\n' +
        'Now count the orders we do not want: Ann first. With Ann fixed at the front, the other 3 people fill the other 3 places: $3 \\times 2 \\times 1 = 6$.\n\n' +
        'Take the unwanted orders away from the total: $24 - 6 = 18$.',
      conclusion: 'Out of 24 orders, 6 have Ann first, which leaves $18$ orders where she is not.',
      whyWrong: [
        null,
        'This is the number of orders where Ann **is** first. It still has to be subtracted from the total.',
        'This is $4!$, every order. It ignores the condition.',
        'This assumes Ann is first in half of all orders. She is first in only 1 of every 4, since there are 4 places.',
      ],
      keyIdea: 'For a "not" condition, count the opposite and subtract: wanted = all orders $-$ unwanted orders. This is usually quicker than counting the wanted orders directly.',
    },
    check: {
      optionValues: [18, 6, 24, 12],
      compute: () => perms(['Ann', 'B', 'C', 'D']).filter((o) => o[0] !== 'Ann').length,
    },
  },
];
