import type { StaticQuestion } from '../../../types';
import { nPr, sumOf } from '../../../lib/mathx';

// ---- brute-force helpers used ONLY by the answer checks (independent of the formulas) ----

/** Count integers 1..n that satisfy pred. */
function countUpTo(n: number, pred: (x: number) => boolean): number {
  let c = 0;
  for (let x = 1; x <= n; x++) if (pred(x)) c++;
  return c;
}

/** Number of shortest right/up lattice routes from (x0, y0) to (x1, y1), by dynamic programming. */
function gridRoutes(x0: number, y0: number, x1: number, y1: number): number {
  const w = x1 - x0;
  const h = y1 - y0;
  const ways: number[][] = Array.from({ length: w + 1 }, () => new Array<number>(h + 1).fill(0));
  for (let i = 0; i <= w; i++)
    for (let j = 0; j <= h; j++) ways[i][j] = i === 0 && j === 0 ? 1 : (i > 0 ? ways[i - 1][j] : 0) + (j > 0 ? ways[i][j - 1] : 0);
  return ways[w][h];
}

/** Every ordering of 0..n-1. */
function allOrders(n: number): number[][] {
  if (n === 0) return [[]];
  const out: number[][] = [];
  for (const rest of allOrders(n - 1))
    for (let pos = 0; pos <= rest.length; pos++) out.push([...rest.slice(0, pos), n - 1, ...rest.slice(pos)]);
  return out;
}

/** Smallest number of objects in k boxes that FORCES some box to hold at least r (checks the most even spread). */
function minToForce(k: number, r: number): number {
  for (let n = 1; ; n++) {
    const mostEvenMax = Math.ceil(n / k); // the best you can do to keep every box small
    if (mostEvenMax >= r) return n;
  }
}

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'pigeonhole-counting-001',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'A café set menu lets you choose **one** starter from 4, **one** main course from 6 and **one** dessert from 3. How many different three-course meals are possible?',
    options: ['$13$', '$72$', '$24$', '$286$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'You choose a starter **and** a main **and** a dessert, so use the **product rule**: multiply the number of choices at each stage.\n\n' +
        '$$4 \\times 6 \\times 3 = 72$$\n\n' +
        'Each of the 4 starters can be paired with each of the 6 mains ($4 \\times 6 = 24$ pairs), and each pair can be finished with any of the 3 desserts ($24 \\times 3 = 72$).',
      whyWrong: [
        'This is $4 + 6 + 3$: adding is the sum rule, which is for choosing **one** dish from any category ("or"). A meal needs a starter **and** a main **and** a dessert, so you multiply.',
        null,
        'This is $4 \\times 6$: it counts starter-main pairs but forgets to multiply by the 3 choices of dessert.',
        'This is $\\binom{13}{3}$, choosing any 3 dishes out of all 13. That would allow meals such as three desserts, and it ignores the one-from-each-course structure.',
      ],
      keyIdea: 'For a choice made in stages ("this AND that"), multiply the number of options at each stage.',
    },
    check: {
      optionValues: [13, 72, 24, 286],
      compute: () => {
        let meals = 0;
        for (let s = 0; s < 4; s++) for (let mn = 0; mn < 6; mn++) for (let d = 0; d < 3; d++) meals++;
        return meals;
      },
    },
  },
  {
    id: 'pigeonhole-counting-002',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'You are allowed to take **exactly one** book on a flight. You own 5 novels, 7 comics and 3 textbooks, all different. How many different choices do you have?',
    options: ['$105$', '$3$', '$455$', '$15$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'You pick **one** book, which is a novel **or** a comic **or** a textbook. The three groups do not overlap, so use the **sum rule**: add.\n\n' +
        '$$5 + 7 + 3 = 15$$',
      whyWrong: [
        'This is $5 \\times 7 \\times 3$: the product rule counts choosing one novel **and** one comic **and** one textbook (three books). You may only take one book, so you add.',
        'This counts the 3 **categories**, not the books. Each category contains several different books, and each book is a separate choice.',
        'This is $\\binom{15}{3}$, the number of ways to choose **three** books from 15. Only one book is allowed.',
        null,
      ],
      keyIdea: 'For a single choice from separate groups ("this OR that"), add the sizes of the groups.',
    },
    check: { optionValues: [105, 3, 455, 15], compute: () => sumOf([5, 7, 3]) },
  },
  {
    id: 'pigeonhole-counting-003',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'What is the **smallest** number of people that must be in a room to **guarantee** that at least two of them were born in the same month?',
    options: ['$13$', '$12$', '$24$', '$7$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Think of the 12 months as 12 **boxes** (pigeonholes) and the people as **objects** (pigeons).\n\n' +
        '- With 12 people it is still possible that every person has a different month (one per box), so 12 is **not** enough.\n' +
        '- With 13 people, the 12 boxes cannot each hold at most one person ($12 < 13$), so some month must contain at least two people.\n\n' +
        'Pigeonhole principle: $12 + 1 = 13$.',
      whyWrong: [
        null,
        'With 12 people, each could be born in a different month, so a shared month is not guaranteed. You need one more person than there are months.',
        'This is $2 \\times 12$. 24 people would certainly include two with the same month, but so would 13, so 24 is not the **smallest** number.',
        'This halves the 12 months and adds 1. There is no reason to halve: 7 people can easily all have different months.',
      ],
      keyIdea: 'Pigeonhole principle: with $n$ boxes, $n + 1$ objects force at least one box to hold two.',
    },
    check: { optionValues: [13, 12, 24, 7], compute: () => minToForce(12, 2) },
  },
  {
    id: 'pigeonhole-counting-004',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'At a meeting there are 10 people. Every person shakes hands **once** with every other person. How many handshakes take place?',
    options: ['$90$', '$100$', '$45$', '$9$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A handshake is a **pair** of people, and the order does not matter (Ali shaking Bea is the same as Bea shaking Ali).\n\n' +
        '- Each of the 10 people shakes 9 hands: $10 \\times 9 = 90$.\n' +
        '- But this counts every handshake **twice** (once for each person in it), so divide by 2.\n\n' +
        '$$\\binom{10}{2} = \\frac{10 \\times 9}{2} = 45$$',
      whyWrong: [
        'This is $10 \\times 9$: it counts every handshake twice, once from each person\'s point of view. Divide by 2.',
        'This is $10^2$: it lets people shake their own hand and also counts each handshake twice.',
        null,
        'This is the number of handshakes made by **one** person, not the total for the whole group.',
      ],
      keyIdea: 'The number of pairs from $n$ people is $\\binom{n}{2} = \\frac{n(n-1)}{2}$; divide by 2 because each pair is counted from both ends.',
    },
    check: {
      optionValues: [90, 100, 45, 9],
      compute: () => {
        let shakes = 0;
        for (let i = 0; i < 10; i++) for (let j = i + 1; j < 10; j++) shakes++;
        return shakes;
      },
    },
  },
  {
    id: 'pigeonhole-counting-005',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'A phone PIN is made of 4 digits, each from 0 to 9, and digits **may repeat** (for example 0070 is allowed). How many different PINs are possible?',
    options: ['$5040$', '$6561$', '$40$', '$10\\,000$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'There are 4 positions and each one can be any of the 10 digits, independently of the others. By the product rule:\n\n' +
        '$$10 \\times 10 \\times 10 \\times 10 = 10^4 = 10\\,000$$\n\n' +
        '(Check: the PINs are exactly 0000, 0001, ..., 9999, which is 10 000 codes.)',
      whyWrong: [
        'This is $10 \\times 9 \\times 8 \\times 7$, which forbids repeated digits. The question says digits may repeat.',
        'This is $9^4$: it forgets that 0 is a digit too, so there are 10 choices per position, not 9.',
        'This is $10 \\times 4$: it multiplies the number of digits by the number of positions. Each position multiplies the count by 10, so you need $10^4$.',
        null,
      ],
      keyIdea: 'With repetition allowed, $k$ positions each with $n$ choices give $n^k$ codes.',
    },
    check: {
      optionValues: [5040, 6561, 40, 10000],
      compute: () => {
        const digits = '0123456789'.split('');
        return digits.length ** 4;
      },
    },
  },

  // ================================================================ exam
  {
    id: 'pigeonhole-counting-006',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'A licence plate has **3 letters** (A to Z) followed by **3 digits** (0 to 9). The three letters must all be **different**, but the digits may repeat. How many different plates are possible?',
    options: ['$15\\,600\\,000$', '$17\\,576\\,000$', '$11\\,232\\,000$', '$2\\,600\\,000$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Fill the six positions one at a time and multiply (product rule).\n\n' +
        '- Letters, no repeats: $26 \\times 25 \\times 24 = 15\\,600$ (each letter used leaves one fewer).\n' +
        '- Digits, repeats allowed: $10 \\times 10 \\times 10 = 1000$.\n\n' +
        '$$15\\,600 \\times 1000 = 15\\,600\\,000$$',
      whyWrong: [
        null,
        'This is $26^3 \\times 1000$: it allows repeated letters such as AAB. The letters must all be different, so the choices drop to 25 and then 24.',
        'This is $15\\,600 \\times 10 \\times 9 \\times 8$: it also forbids repeated digits, but the question allows the digits to repeat.',
        'This is $\\binom{26}{3} \\times 1000$: choosing the letters as a **set** treats ABC and CBA as the same plate. On a plate the order matters, so use $26 \\times 25 \\times 24$.',
      ],
      keyIdea: 'Multiply position by position: "no repeats" makes the choices shrink by one each time, "repeats allowed" keeps them the same.',
    },
    check: { optionValues: [15600000, 17576000, 11232000, 2600000], compute: () => nPr(26, 3) * 10 ** 3 },
  },
  {
    id: 'pigeonhole-counting-007',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'How many integers from 1 to 120 inclusive are divisible by 4 **or** by 6 (or both)?',
    options: ['$50$', '$40$', '$45$', '$80$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use **inclusion-exclusion**: $|A \\cup B| = |A| + |B| - |A \\cap B|$.\n\n' +
        '- Multiples of 4 up to 120: $\\frac{120}{4} = 30$.\n' +
        '- Multiples of 6 up to 120: $\\frac{120}{6} = 20$.\n' +
        '- Divisible by **both** 4 and 6 means divisible by $\\text{lcm}(4, 6) = 12$: $\\frac{120}{12} = 10$. These were counted twice above.\n\n' +
        '$$30 + 20 - 10 = 40$$',
      whyWrong: [
        'This is $30 + 20$: numbers such as 12, 24 and 36 are multiples of both 4 and 6, so they are counted twice. Subtract the 10 multiples of 12 once.',
        null,
        'This is $30 + 20 - 5$, using $4 \\times 6 = 24$ for "divisible by both". But 12 is divisible by both 4 and 6 and is not a multiple of 24: "both" means a multiple of the **lowest common multiple**, 12.',
        'This is $120 - 40$, the count of numbers divisible by **neither** 4 nor 6.',
      ],
      keyIdea: 'Inclusion-exclusion: add the two counts, then subtract the overlap (multiples of the LCM) once.',
    },
    check: { optionValues: [50, 40, 45, 80], compute: () => countUpTo(120, (x) => x % 4 === 0 || x % 6 === 0) },
  },
  {
    id: 'pigeonhole-counting-008',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'A 4-character code uses the digits 0 to 9, and digits may repeat. How many codes contain **at least one** 7?',
    options: ['$4000$', '$6561$', '$2916$', '$3439$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '"At least one" is easiest by **complementary counting**: count everything, then subtract the codes with **no** 7.\n\n' +
        '- All codes: $10^4 = 10\\,000$.\n' +
        '- Codes with no 7: each position has 9 choices, so $9^4 = 6561$.\n\n' +
        '$$10\\,000 - 6561 = 3439$$',
      whyWrong: [
        'This is $4 \\times 1000$: it puts a 7 in one chosen position and lets the other three be anything. A code such as 7707 then gets counted several times (once for each 7), so the total is too big.',
        'This is $9^4$, the number of codes with **no** 7 at all. You still need to subtract it from the 10 000 total.',
        'This is $4 \\times 9^3$, the codes with **exactly one** 7. It misses codes with two or more 7s, such as 7717.',
        null,
      ],
      keyIdea: 'At least one = total minus none.',
    },
    check: {
      optionValues: [4000, 6561, 2916, 3439],
      compute: () => {
        let c = 0;
        for (let x = 0; x < 10000; x++) if (String(x).padStart(4, '0').includes('7')) c++;
        return c;
      },
    },
  },
  {
    id: 'pigeonhole-counting-009',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'A robot walks on a square grid from $(0, 0)$ to $(5, 3)$, one unit at a time, moving only **right** or **up**. How many different shortest routes can it take?',
    options: ['$15$', '$256$', '$56$', '$336$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Every shortest route uses exactly 5 right steps (R) and 3 up steps (U): 8 steps in total, for example RRURRURU.\n\n' +
        'A route is decided completely by **which 3 of the 8 steps are U**. So the number of routes is\n\n' +
        '$$\\binom{8}{3} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = \\frac{336}{6} = 56$$',
      whyWrong: [
        'This is $5 \\times 3$: multiplying the side lengths of the grid does not count routes.',
        'This is $2^8$: it treats every step as a free choice of R or U. But a shortest route must contain **exactly** 5 R and 3 U, so most of those $2^8$ sequences miss the target.',
        null,
        'This is $8 \\times 7 \\times 6$: it treats the three U steps as different from each other. They are identical, so divide by $3! = 6$.',
      ],
      keyIdea: 'Shortest grid routes with $m$ rights and $n$ ups: choose the positions of the ups, $\\binom{m+n}{n}$.',
    },
    check: { optionValues: [15, 256, 56, 336], compute: () => gridRoutes(0, 0, 5, 3) },
  },
  {
    id: 'pigeonhole-counting-010',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'There are 50 students in a year group. What is the **largest** number $n$ for which we can be **certain** that at least $n$ of them were born on the same day of the week?',
    options: ['$7$', '$2$', '$43$', '$8$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Boxes: the 7 days of the week. Objects: 50 students. Spread them as evenly as possible to keep every day small.\n\n' +
        '- 7 students on each day uses $7 \\times 7 = 49$ students.\n' +
        '- The 50th student must go on a day that already has 7, making 8.\n\n' +
        'So some day **must** have at least 8. We cannot guarantee 9, because the spread 8, 7, 7, 7, 7, 7, 7 (total 50) has no day with 9.\n\n' +
        'Generalised pigeonhole principle: $\\left\\lceil \\frac{50}{7} \\right\\rceil = \\lceil 7.14\\ldots \\rceil = 8$.',
      whyWrong: [
        'This rounds $\\frac{50}{7} \\approx 7.14$ **down**. Seven per day only accounts for 49 students; the 50th forces an eighth on some day, so round **up**.',
        'Two students sharing a day is certainly true, but it is not the **largest** number we can guarantee.',
        'This is $50 - 7$. Subtracting the number of days from the number of students has no meaning here.',
        null,
      ],
      keyIdea: 'Generalised pigeonhole: $N$ objects in $k$ boxes force some box to hold at least $\\left\\lceil \\frac{N}{k} \\right\\rceil$.',
    },
    check: {
      optionValues: [7, 2, 43, 8],
      compute: () => {
        // largest n such that every way of giving 50 students to 7 days has a day with >= n:
        // that fails exactly when 7 days of (n - 1) can hold all 50.
        let n = 1;
        while (7 * n < 50) n++;
        return n;
      },
    },
  },
  {
    id: 'pigeonhole-counting-011',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'A drawer contains plenty of socks in 5 different colours. In the dark, what is the **minimum** number of socks you must take out to be **certain** of having at least 3 socks of the same colour?',
    options: ['$15$', '$10$', '$11$', '$6$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Imagine the **worst case**: you are as unlucky as possible and avoid three of a colour for as long as you can.\n\n' +
        '- You can take 2 socks of every colour without having 3 of any: $5 \\times 2 = 10$ socks.\n' +
        '- The next sock (the 11th) must match one of the colours you already hold twice, making 3.\n\n' +
        '$$5 \\times (3 - 1) + 1 = 11$$',
      whyWrong: [
        'This is $5 \\times 3$. 15 socks do guarantee three of a colour, but fewer are enough: the worst case only holds 2 of each colour (10 socks) before the next sock completes a set of three.',
        'Ten socks could be exactly 2 of each of the 5 colours, with no three the same. This is the worst case itself; you need one more sock.',
        null,
        'This is $5 + 1$, which guarantees a **pair** (two of a colour), not three.',
      ],
      keyIdea: 'To force $r$ objects in one of $k$ boxes, take $k(r-1) + 1$: fill every box to $r - 1$, then add one more.',
    },
    check: { optionValues: [15, 10, 11, 6], compute: () => minToForce(5, 3) },
  },
  {
    id: 'pigeonhole-counting-012',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'In a class of 40 students, 22 study Physics, 18 study Chemistry and 7 study **both**. How many students study **neither** subject?',
    options: ['$7$', '$0$', '$33$', '$14$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'First count the students who study **at least one** subject, using inclusion-exclusion:\n\n' +
        '$$22 + 18 - 7 = 33$$\n\n' +
        '(The 7 who study both are inside the 22 **and** inside the 18, so they were counted twice; subtract them once.)\n\n' +
        'Neither $= 40 - 33 = 7$.',
      whyWrong: [
        null,
        'This is $40 - 22 - 18$: it forgets that the 7 students who study both were counted in both the 22 and the 18, so it subtracts them twice.',
        'This is the number who study **at least one** of the subjects. The question asks for neither, so subtract it from 40.',
        'This is $40 - 26$, where $26 = 15 + 11$ is the number who study **exactly one** subject. It wrongly lumps the 7 students who study both in with the "neither" group.',
      ],
      keyIdea: 'Neither $= \\text{total} - (|A| + |B| - |A \\cap B|)$.',
    },
    check: {
      optionValues: [7, 0, 33, 14],
      compute: () => {
        // build a class of 40: students 0-21 take Physics, students 15-32 take Chemistry (overlap 15-21 = 7 students)
        const physics = new Set(Array.from({ length: 22 }, (_, i) => i));
        const chemistry = new Set(Array.from({ length: 18 }, (_, i) => i + 15));
        let neither = 0;
        for (let s = 0; s < 40; s++) if (!physics.has(s) && !chemistry.has(s)) neither++;
        return neither;
      },
    },
  },
  {
    id: 'pigeonhole-counting-013',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'A **diagonal** of a polygon is a straight line joining two corners (vertices) that are **not** next to each other. How many diagonals does a decagon (10 sides) have?',
    options: ['$45$', '$35$', '$70$', '$25$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Any two of the 10 vertices can be joined by a line segment, and the order of the two vertices does not matter:\n\n' +
        '$$\\binom{10}{2} = \\frac{10 \\times 9}{2} = 45 \\text{ segments}$$\n\n' +
        'Of these, 10 are the **sides** of the decagon (adjacent vertices), not diagonals.\n\n' +
        'Diagonals $= 45 - 10 = 35$.\n\n' +
        'Check with the other method: each vertex joins to $10 - 3 = 7$ others by a diagonal (not itself, not its 2 neighbours), giving $\\frac{10 \\times 7}{2} = 35$.',
      whyWrong: [
        'This is $\\binom{10}{2}$, every segment between two vertices. It includes the 10 sides, which are not diagonals.',
        null,
        'This is $10 \\times 7$: each diagonal has two ends, so it is counted twice. Divide by 2.',
        'This is $45 - 20$: it subtracts each side twice. There are only 10 sides, so subtract 10.',
      ],
      keyIdea: 'Count all pairs of vertices with $\\binom{n}{2}$, then remove the $n$ sides.',
    },
    check: {
      optionValues: [45, 35, 70, 25],
      compute: () => {
        const n = 10;
        let d = 0;
        for (let i = 0; i < n; i++)
          for (let j = i + 1; j < n; j++) {
            const gap = j - i;
            if (gap !== 1 && gap !== n - 1) d++;
          }
        return d;
      },
    },
  },
  {
    id: 'pigeonhole-counting-014',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'A toy lock has five buttons labelled A, B, C, D and E. A code is a sequence of **3 or 4** button presses, and a button may be pressed more than once. How many different codes are there?',
    options: ['$750$', '$625$', '$78\\,125$', '$180$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Split into the two separate cases, count each with the product rule, then **add** (a code is 3 presses **or** 4 presses, never both).\n\n' +
        '- 3 presses: $5^3 = 125$\n' +
        '- 4 presses: $5^4 = 625$\n\n' +
        '$$125 + 625 = 750$$',
      whyWrong: [
        null,
        'This is $5^4$: it only counts the 4-press codes and forgets the 125 codes of length 3.',
        'This is $125 \\times 625$: the product rule is for doing one thing **and then** another. A code has length 3 **or** length 4, so the cases are added.',
        'This is $5 \\times 4 \\times 3 + 5 \\times 4 \\times 3 \\times 2 = 60 + 120$: it forbids pressing a button twice, but repeats are allowed.',
      ],
      keyIdea: 'Split into non-overlapping cases, count each with the product rule, and add the cases.',
    },
    check: {
      optionValues: [750, 625, 78125, 180],
      compute: () => {
        const buttons = 5;
        let total = 0;
        for (const len of [3, 4]) total += buttons ** len;
        return total;
      },
    },
  },
  {
    id: 'pigeonhole-counting-015',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'At a meeting, every pair of people shook hands exactly once. There were 66 handshakes altogether. How many people were at the meeting?',
    options: ['$11$', '$33$', '$9$', '$12$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'With $n$ people the number of handshakes is $\\binom{n}{2} = \\frac{n(n-1)}{2}$. Set this equal to 66:\n\n' +
        '$$\\frac{n(n-1)}{2} = 66 \\quad\\Rightarrow\\quad n(n-1) = 132 \\quad\\Rightarrow\\quad n^2 - n - 132 = 0$$\n\n' +
        'Factorise: $(n - 12)(n + 11) = 0$, so $n = 12$ (a number of people cannot be negative).\n\n' +
        'Check: $\\frac{12 \\times 11}{2} = 66$. Quicker in the exam: try the options in $\\frac{n(n-1)}{2}$.',
      whyWrong: [
        'This solves $\\frac{n(n+1)}{2} = 66$. With $n$ people, the first person shakes $n - 1$ hands, the next $n - 2$ new hands, and so on, so the total is $\\frac{n(n-1)}{2}$, not $\\frac{n(n+1)}{2}$. Check: 11 people give only $\\frac{11 \\times 10}{2} = 55$ handshakes.',
        'This is $66 \\div 2$. The number of handshakes grows like $n^2$, not in proportion to $n$, so you cannot just halve: 33 people would make 528 handshakes.',
        'This comes from $n(n-1) = 66$, forgetting to divide by 2; that gives $n \\approx 8.6$, rounded to 9. A non-whole answer is a sign the equation is wrong. 9 people make only 36 handshakes.',
        null,
      ],
      keyIdea: 'Handshakes among $n$ people: $\\frac{n(n-1)}{2}$; to work backwards, solve the quadratic or test the options.',
    },
    check: {
      optionValues: [11, 33, 9, 12],
      compute: () => {
        let n = 1;
        while ((n * (n - 1)) / 2 < 66) n++;
        return n;
      },
    },
  },

  // ================================================================ challenge
  {
    id: 'pigeonhole-counting-016',
    subtopic: 'pigeonhole-counting',
    difficulty: 'challenge',
    stem: 'You walk on a grid from $A = (0, 0)$ to $B = (6, 4)$, one unit at a time, moving only right or up. How many shortest routes **pass through** the point $C = (2, 2)$?',
    options: ['$210$', '$21$', '$90$', '$120$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Split the journey at $C$ and use the **product rule** (first leg **and then** second leg).\n\n' +
        '- $A \\to C$: 2 rights and 2 ups, 4 steps: $\\binom{4}{2} = 6$ routes.\n' +
        '- $C \\to B$: $6 - 2 = 4$ rights and $4 - 2 = 2$ ups, 6 steps: $\\binom{6}{2} = 15$ routes.\n\n' +
        'Each of the 6 first halves can be followed by any of the 15 second halves:\n\n' +
        '$$6 \\times 15 = 90$$',
      whyWrong: [
        'This is $\\binom{10}{4}$, the number of **all** shortest routes from A to B. It ignores the condition that the route must pass through C.',
        'This is $6 + 15$: the two legs are done one after the other ("and then"), so the counts are multiplied, not added.',
        null,
        'This is $210 - 90$, the number of routes that **avoid** C.',
      ],
      keyIdea: 'Routes through a point = (routes to the point) times (routes from the point onwards).',
    },
    check: {
      optionValues: [210, 21, 90, 120],
      compute: () => {
        // brute force: every sequence of 10 steps with exactly 4 ups; keep those that visit (2, 2)
        let c = 0;
        for (let mask = 0; mask < 1 << 10; mask++) {
          let ups = 0;
          for (let i = 0; i < 10; i++) if (mask & (1 << i)) ups++;
          if (ups !== 4) continue;
          let x = 0;
          let y = 0;
          let hit = false;
          for (let i = 0; i < 10; i++) {
            if (mask & (1 << i)) y++;
            else x++;
            if (x === 2 && y === 2) hit = true;
          }
          if (hit) c++;
        }
        return c;
      },
    },
  },
  {
    id: 'pigeonhole-counting-017',
    subtopic: 'pigeonhole-counting',
    difficulty: 'challenge',
    stem: 'How many integers from 1 to 210 inclusive are divisible by **at least one** of 2, 3 or 5?',
    options: ['$154$', '$217$', '$147$', '$56$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Inclusion-exclusion for three sets:\n\n' +
        '$$|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$$\n\n' +
        '- Singles: $\\frac{210}{2} = 105$, $\\frac{210}{3} = 70$, $\\frac{210}{5} = 42$. Sum $= 217$.\n' +
        '- Pairs (multiples of the LCM): by 6: $35$, by 10: $21$, by 15: $14$. Sum $= 70$.\n' +
        '- All three (multiples of 30): $7$.\n\n' +
        '$$217 - 70 + 7 = 154$$',
      whyWrong: [
        null,
        'This is $105 + 70 + 42$: numbers such as 6 or 30 are divisible by more than one of 2, 3, 5 and get counted two or three times.',
        'This is $217 - 70$: it subtracts the pairwise overlaps but forgets to add back the 7 multiples of 30. Those were added three times and then subtracted three times, so after this step they are not counted at all.',
        'This is $210 - 154$, the count of numbers divisible by **none** of 2, 3 and 5.',
      ],
      keyIdea: 'Three-set inclusion-exclusion: add singles, subtract pairs, add back the triple overlap.',
    },
    check: { optionValues: [154, 217, 147, 56], compute: () => countUpTo(210, (x) => x % 2 === 0 || x % 3 === 0 || x % 5 === 0) },
  },
  {
    id: 'pigeonhole-counting-018',
    subtopic: 'pigeonhole-counting',
    difficulty: 'challenge',
    stem: 'Six friends, including Ali and Bea, sit in a row of 6 seats. In how many arrangements are Ali and Bea **not** sitting next to each other?',
    options: ['$240$', '$480$', '$600$', '$720$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use complementary counting: (all arrangements) minus (arrangements where they **are** together).\n\n' +
        '- All arrangements: $6! = 720$.\n' +
        '- Together: glue Ali and Bea into one block. Now arrange 5 items: $5! = 120$. Inside the block they can sit as Ali-Bea or Bea-Ali: $\\times 2$. Total $120 \\times 2 = 240$.\n\n' +
        '$$720 - 240 = 480$$',
      whyWrong: [
        'This is the number of arrangements where Ali and Bea **are** next to each other. Subtract it from the 720 total.',
        null,
        'This is $720 - 120$: when Ali and Bea are glued together it forgets that they can swap places inside the block, so it only removes half of the "together" arrangements.',
        'This is $6!$, every arrangement, ignoring the condition.',
      ],
      keyIdea: '"Not together" = total minus "together"; for "together", glue the pair into one block and remember the pair can swap.',
    },
    check: {
      optionValues: [240, 480, 600, 720],
      compute: () => allOrders(6).filter((p) => Math.abs(p.indexOf(0) - p.indexOf(1)) !== 1).length,
    },
  },
  {
    id: 'pigeonhole-counting-019',
    subtopic: 'pigeonhole-counting',
    difficulty: 'challenge',
    stem: 'Numbers are chosen from the integers 1 to 20 (each number at most once). What is the **smallest** number of integers you must choose to be **certain** that two of the chosen numbers add up to 21?',
    options: ['$10$', '$21$', '$20$', '$11$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Make the **boxes** pairs that add to 21:\n\n' +
        '$$\\{1, 20\\}, \\{2, 19\\}, \\{3, 18\\}, \\ldots, \\{10, 11\\}$$\n\n' +
        'Every number from 1 to 20 is in exactly one pair, so there are 10 boxes.\n\n' +
        '- With 10 numbers you might take one from each pair (for example 1, 2, ..., 10), and no two of those add to 21 (the largest sum is $10 + 9 = 19$). So 10 is not enough.\n' +
        '- With 11 numbers in 10 boxes, two numbers must come from the same pair, and they add to 21.\n\n' +
        'Answer: $10 + 1 = 11$.',
      whyWrong: [
        'Ten numbers could be 1, 2, ..., 10, one from each pair, and no two of them add to 21. This is the worst case; one more number is needed.',
        'This confuses the target sum 21 with the number of choices. There are only 20 integers to choose from, so 21 choices are impossible anyway.',
        'Choosing all 20 numbers certainly works, but it is not the smallest number: 11 already forces a pair adding to 21.',
        null,
      ],
      keyIdea: 'Pigeonhole with clever boxes: group the numbers into pairs that add to the target, then choosing one more number than there are boxes forces a pair.',
    },
    check: {
      optionValues: [10, 21, 20, 11],
      compute: () => {
        // boxes = pairs {i, j} from 1..20 with i + j = 21; the largest "safe" choice takes one from each box
        let boxes = 0;
        for (let i = 1; i <= 20; i++) for (let j = i + 1; j <= 20; j++) if (i + j === 21) boxes++;
        return boxes + 1;
      },
    },
  },
  {
    id: 'pigeonhole-counting-020',
    subtopic: 'pigeonhole-counting',
    difficulty: 'challenge',
    stem: 'How many 4-digit whole numbers (from 1000 to 9999) have **at least one** repeated digit (for example 1231 or 5500)?',
    options: ['$4960$', '$4536$', '$4464$', '$3960$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Complementary counting: (all 4-digit numbers) minus (those with all four digits different).\n\n' +
        '- All 4-digit numbers: $9999 - 1000 + 1 = 9000$.\n' +
        '- All digits different: the first digit cannot be 0, so it has 9 choices; the second can be 0 but not the first digit (9 choices); then 8; then 7. That is $9 \\times 9 \\times 8 \\times 7 = 4536$.\n\n' +
        '$$9000 - 4536 = 4464$$',
      whyWrong: [
        'This is $10\\,000 - 5040$, counting from 0000 to 9999. Codes like 0123 are not 4-digit numbers, so the leading digit cannot be 0.',
        'This is the number of 4-digit numbers with **all digits different**, the complement. Subtract it from 9000.',
        null,
        'This is $9000 - 10 \\times 9 \\times 8 \\times 7$: the "all different" count allows a leading 0, so it subtracts too much. The first digit has only 9 choices (1 to 9).',
      ],
      keyIdea: 'At least one repeat = total minus all-different; watch for the leading digit not being 0.',
    },
    check: {
      optionValues: [4960, 4536, 4464, 3960],
      compute: () => countUpTo(9999, (x) => x >= 1000 && new Set(String(x)).size < 4),
    },
  },
];

