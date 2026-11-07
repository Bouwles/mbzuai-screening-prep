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
    stem: 'How many different meals can be made by choosing **one** starter from 4, **one** main course from 6 and **one** dessert from 3?',
    options: ['$13$', '$72$', '$24$', '$286$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many ways can you pick one starter, one main and one dessert?',
      solution:
        'A meal needs a starter **and** a main **and** a dessert. These are separate decisions made one after another.\n\n' +
        'Each of the 4 starters can go with any of the 6 mains, which makes $4 \\times 6 = 24$ starter-main pairs.\n\n' +
        'Each of these 24 pairs can go with any of the 3 desserts: $24 \\times 3 = 72$.',
      conclusion: 'Three separate choices multiply, and $4 \\times 6 \\times 3$ is $72$.',
      whyWrong: [
        'This is $4 + 6 + 3$: adding is the sum rule, which is for choosing **one** dish from any category ("or"). A meal needs a starter **and** a main **and** a dessert, so you multiply.',
        null,
        'This is $4 \\times 6$: it counts starter-main pairs but forgets to multiply by the 3 choices of dessert.',
        'This is $\\binom{13}{3}$, choosing any 3 dishes out of all 13. That would allow meals such as three desserts, and it ignores the one-from-each-course structure.',
      ],
      keyIdea: 'Use the **product rule** for choices made in stages, joined by "and": multiply the number of options at each stage. If the words say "or" (one choice from several groups), add instead.',
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
    stem: 'In how many ways can you choose **exactly one** book from 5 novels, 7 comics and 3 textbooks, all different?',
    options: ['$105$', '$3$', '$455$', '$15$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How many books could be the single book you pick?',
      solution:
        'You are taking just one book. So you are choosing a novel **or** a comic **or** a textbook, not one of each.\n\n' +
        'The groups don\'t overlap and all the books are different, so each book is one possible choice. We just count the books. This is the **sum rule**.\n\n' +
        'Add the groups: $5 + 7 + 3 = 15$.',
      conclusion: 'Each of the 15 books is one possible choice, so there are $15$ ways.',
      whyWrong: [
        'This is $5 \\times 7 \\times 3$: the product rule counts choosing one novel **and** one comic **and** one textbook (three books). You may only take one book, so you add.',
        'This counts the 3 **categories**, not the books. Each category contains several different books, and each book is a separate choice.',
        'This is $\\binom{15}{3}$, the number of ways to choose **three** books from 15. Only one book is allowed.',
        null,
      ],
      keyIdea: 'Use the **sum rule** for one choice from separate groups ("or"): add the group sizes. Use the product rule when you pick from every group ("and").',
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
      asking: 'How many people do you need before two must share a birth month?',
      solution:
        'The word "guarantee" means we look at the worst case: people being as different as possible. There are 12 months.\n\n' +
        'In the worst case, 12 people could all be born in different months, one per month. So 12 people aren\'t enough to be sure.\n\n' +
        'Now add one more person. Their month must be one that is already taken, so two people share a month. That makes $12 + 1 = 13$ people.',
      conclusion: '12 people might all differ, but one more forces a match, so the smallest number is $13$.',
      whyWrong: [
        null,
        'With 12 people, each could be born in a different month, so a shared month is not guaranteed. You need one more person than there are months.',
        'This is $2 \\times 12$. 24 people would certainly include two with the same month, but so would 13, so 24 is not the **smallest** number.',
        'This halves the 12 months and adds 1. There is no reason to halve: 7 people can easily all have different months.',
      ],
      keyIdea: 'This is the **pigeonhole principle**: with $n$ boxes, you need $n + 1$ objects to force two into the same box. For a guarantee, build the worst case first, then add one.',
    },
    check: { optionValues: [13, 12, 24, 7], compute: () => minToForce(12, 2) },
  },
  {
    id: 'pigeonhole-counting-004',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'Each of 10 people shakes hands **once** with every other person. How many handshakes take place?',
    options: ['$90$', '$100$', '$45$', '$9$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many different pairs can be made from 10 people?',
      solution:
        'Each handshake involves one pair of people, so we want the number of pairs.\n\n' +
        'Each of the 10 people shakes hands with the other 9. Counting from each person\'s point of view gives $10 \\times 9 = 90$.\n\n' +
        'But Ali shaking Bea\'s hand is the same handshake as Bea shaking Ali\'s, so every handshake was counted twice. Halve the total: $90 \\div 2 = 45$.',
      conclusion: 'Counting from each person gives 90, and every handshake is counted twice, so there are $45$ handshakes.',
      whyWrong: [
        'This is $10 \\times 9$: it counts every handshake twice, once from each person\'s point of view. Divide by 2.',
        'This is $10^2$: it lets people shake their own hand and also counts each handshake twice.',
        null,
        'This is the number of handshakes made by **one** person, not the total for the whole group.',
      ],
      keyIdea: 'Whenever each pair from a group appears once (handshakes, matches, lines between points), use $\\frac{n(n-1)}{2}$, where $n$ is the size of the group. This is also written $\\binom{n}{2}$.',
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
    stem: 'A PIN is made of 4 digits from 0 to 9, and digits **may repeat**. How many different PINs are possible?',
    options: ['$5040$', '$6561$', '$40$', '$10\\,000$'],
    correctIndex: 3,
    markScheme: {
      asking: 'How many 4-digit codes can be made when digits may repeat?',
      solution:
        'There are 10 possible digits, 0 to 9, and 0 counts too. A PIN has 4 positions to fill, one after another.\n\n' +
        'Digits may repeat, so each position still has all 10 choices, whatever was picked before.\n\n' +
        'The positions are separate decisions, so multiply: $10 \\times 10 \\times 10 \\times 10 = 10^4 = 10\\,000$.',
      conclusion: 'Four positions with 10 choices each give $10\\,000$ PINs.',
      whyWrong: [
        'This is $10 \\times 9 \\times 8 \\times 7$, which forbids repeated digits. The question says digits may repeat.',
        'This is $9^4$: it forgets that 0 is a digit too, so there are 10 choices per position, not 9.',
        'This is $10 \\times 4$: it multiplies the number of digits by the number of positions. Each position multiplies the count by 10, so you need $10^4$.',
        null,
      ],
      keyIdea: 'For codes with repeats allowed, the count is $c^k$, where $c$ is the choices per position and $k$ is the number of positions. Without repeats, the choices drop by one each time, as in $10 \\times 9 \\times 8 \\times 7$.',
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
      asking: 'How many plates have 3 different letters, followed by any 3 digits?',
      solution:
        'A plate is filled one position at a time, so we multiply the choices at each position. This is the **product rule**.\n\n' +
        'The letters must all be different, so the choices fall by 1 each time: 26 for the first letter, 25 for the second, 24 for the third. $26 \\times 25 \\times 24 = 15\\,600$.\n\n' +
        'The digits may repeat, so each of the three digits has 10 choices: $10 \\times 10 \\times 10 = 1000$.\n\n' +
        'Each block of letters can pair with each block of digits, so multiply: $15\\,600 \\times 1000 = 15\\,600\\,000$.',
      conclusion: 'Three different letters then any three digits gives $15\\,600 \\times 1000$, which is $15\\,600\\,000$ plates.',
      whyWrong: [
        null,
        'This is $26^3 \\times 1000$: it allows repeated letters such as AAB. The letters must all be different, so the choices drop to 25 and then 24.',
        'This is $15\\,600 \\times 10 \\times 9 \\times 8$: it also forbids repeated digits, but the question allows the digits to repeat.',
        'This is $\\binom{26}{3} \\times 1000$: choosing the letters as a **set** treats ABC and CBA as the same plate. On a plate the order matters, so use $26 \\times 25 \\times 24$.',
      ],
      keyIdea: 'Fill the positions one at a time and write the choices above each. Repeats allowed: the same number each time. No repeats: reduce by one each time. Then multiply them all.',
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
      asking: 'How many numbers from 1 to 120 are multiples of 4 or 6?',
      solution:
        'Count the multiples of each number by dividing. Multiples of 4: $120 \\div 4 = 30$. Multiples of 6: $120 \\div 6 = 20$.\n\n' +
        'Numbers such as 12, 24 and 36 are multiples of both, so they have been counted twice. A number divisible by both 4 and 6 is a multiple of their lowest common multiple, or LCM (the smallest number both divide into), which is 12.\n\n' +
        'Multiples of 12: $120 \\div 12 = 10$.\n\n' +
        'This is **inclusion-exclusion**: add the two groups, then take off the overlap once. $30 + 20 - 10 = 40$.',
      conclusion: 'The overlap of 10 was counted twice, so removing one copy from 50 gives $40$.',
      whyWrong: [
        'This is $30 + 20$: numbers such as 12, 24 and 36 are multiples of both 4 and 6, so they are counted twice. Subtract the 10 multiples of 12 once.',
        null,
        'This is $30 + 20 - 5$, using $4 \\times 6 = 24$ for "divisible by both". But 12 is divisible by both 4 and 6 and is not a multiple of 24: "both" means a multiple of the **lowest common multiple**, 12.',
        'This is $120 - 40$, the count of numbers divisible by **neither** 4 nor 6.',
      ],
      keyIdea: 'For "divisible by $a$ or $b$": count the multiples of $a$, add the multiples of $b$, then subtract the multiples of their LCM. Count multiples by dividing the limit and rounding down.',
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
      asking: 'How many 4-digit codes contain a 7 somewhere?',
      solution:
        '"At least one 7" covers many cases: one 7, two 7s, and so on. It is easier to count the opposite, codes with **no** 7, and subtract from the total. This is called **complementary counting**.\n\n' +
        'Total codes: 4 positions with 10 choices each, so $10^4 = 10\\,000$.\n\n' +
        'Codes with no 7: each position can use any digit except 7, which is 9 choices. So $9 \\times 9 \\times 9 \\times 9 = 9^4 = 6561$.\n\n' +
        'Every code either has no 7 or at least one 7. So subtract: $10\\,000 - 6561 = 3439$.',
      conclusion: 'Of the $10\\,000$ codes, 6561 avoid 7, which leaves $3439$ with at least one.',
      whyWrong: [
        'This is $4 \\times 1000$: it puts a 7 in one chosen position and lets the other three be anything. A code such as 7707 then gets counted several times (once for each 7), so the total is too big.',
        'This is $9^4$, the number of codes with **no** 7 at all. You still need to subtract it from the 10 000 total.',
        'This is $4 \\times 9^3$, the codes with **exactly one** 7. It misses codes with two or more 7s, such as 7717.',
        null,
      ],
      keyIdea: 'When you spot "at least one", use total $-$ none. Count the total and the codes avoiding the item, then subtract. Counting a 7 in each position and adding double counts codes with two or more 7s.',
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
    stem: 'How many shortest routes go from $(0, 0)$ to $(5, 3)$ on a square grid, moving only **right** or **up**?',
    options: ['$15$', '$256$', '$56$', '$336$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many ways can you order 5 right moves and 3 up moves?',
      solution:
        'Going from $(0, 0)$ to $(5, 3)$ takes exactly 5 right moves (R) and 3 up moves (U). Any shortest route has exactly these, which makes 8 moves in total.\n\n' +
        'So a route is just a word such as RRURRUUR, made of 5 Rs and 3 Us. Different orders are different routes.\n\n' +
        'To write such a word, choose which 3 of the 8 positions hold a U. The other positions must be R. So we want the number of ways to choose 3 from 8.\n\n' +
        '$\\binom{8}{3}$ means the number of ways to choose 3 items from 8 when order doesn\'t matter. $\\binom{8}{3} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = \\frac{336}{6} = 56$.',
      conclusion: 'Choosing where the 3 up moves go among the 8 moves gives $56$ routes.',
      whyWrong: [
        'This is $5 \\times 3$: multiplying the side lengths of the grid does not count routes.',
        'This is $2^8$: it treats every step as a free choice of R or U. But a shortest route must contain **exactly** 5 R and 3 U, so most of those $2^8$ sequences miss the target.',
        null,
        'This is $8 \\times 7 \\times 6$: it treats the three U steps as different from each other. They are identical, so divide by $3! = 6$.',
      ],
      keyIdea: 'For grid routes moving only right and up: total moves $=$ right $+$ up, then routes $= \\binom{\\text{total}}{\\text{up}}$. You choose which moves are up, and the rest are right.',
    },
    check: { optionValues: [15, 256, 56, 336], compute: () => gridRoutes(0, 0, 5, 3) },
  },
  {
    id: 'pigeonhole-counting-010',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'Among 50 students, what is the **largest** $n$ for which at least $n$ must have been born on the same day of the week?',
    options: ['$7$', '$2$', '$43$', '$8$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the biggest group size that must share a weekday among 50 students?',
      solution:
        'There are 7 days and 50 students to place into them. To find what **must** happen, spread the students as evenly as possible. That is the worst case, with no day getting more than necessary.\n\n' +
        'Give each day 7 students. That uses $7 \\times 7 = 49$ students, with one student left over.\n\n' +
        'The 50th student must join some day, making $7 + 1 = 8$ on that day. In this even spread no day has more than 8, so 9 can\'t be guaranteed.',
      conclusion: 'An even spread still forces 8 on one day and never forces 9, so the largest $n$ is $8$.',
      whyWrong: [
        'This rounds $\\frac{50}{7} \\approx 7.14$ **down**. Seven per day only accounts for 49 students; the 50th forces an eighth on some day, so round **up**.',
        'Two students sharing a day is certainly true, but it is not the **largest** number we can guarantee.',
        'This is $50 - 7$. Subtracting the number of days from the number of students has no meaning here.',
        null,
      ],
      keyIdea: 'General pigeonhole: with $N$ objects in $k$ boxes, some box has at least $\\frac{N}{k}$ rounded **up**. Here $\\frac{50}{7} \\approx 7.14$, which rounds up to 8.',
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
    stem: 'Socks come in 5 colours. What is the **minimum** number of socks you must take to be **certain** of having 3 of the same colour?',
    options: ['$15$', '$10$', '$11$', '$6$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many socks guarantee three of one colour?',
      solution:
        '"Certain" means we look at the worst case: taking as many socks as possible without getting three of a colour.\n\n' +
        'The most you can have without three of a colour is 2 of each colour. With 5 colours, that is $2 \\times 5 = 10$ socks.\n\n' +
        'The next sock must be one of those 5 colours, and that colour already has 2. So it makes three. That is $10 + 1 = 11$ socks.',
      conclusion: '10 socks can still avoid three of a colour, but the next sock can\'t, so the minimum is $11$.',
      whyWrong: [
        'This is $5 \\times 3$. 15 socks do guarantee three of a colour, but fewer are enough: the worst case only holds 2 of each colour (10 socks) before the next sock completes a set of three.',
        'Ten socks could be exactly 2 of each of the 5 colours, with no three the same. This is the worst case itself; you need one more sock.',
        null,
        'This is $5 + 1$, which guarantees a **pair** (two of a colour), not three.',
      ],
      keyIdea: 'To guarantee $r$ of one kind with $k$ kinds, the worst case holds $r - 1$ of each, so take $k(r - 1) + 1$. Spot it from "minimum" together with "certain" or "guarantee".',
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
      asking: 'How many of the 40 students study neither subject?',
      solution:
        'Picture two overlapping circles, Physics and Chemistry. The students who study neither sit outside both. So first find how many are inside.\n\n' +
        'Adding the subjects gives $22 + 18 = 40$, but that counts the 7 who study both twice.\n\n' +
        'Take one copy of them off: $22 + 18 - 7 = 33$. So 33 students study at least one subject.\n\n' +
        'The rest study neither: $40 - 33 = 7$.',
      conclusion: '33 of the 40 students are inside the circles, so $7$ study neither.',
      whyWrong: [
        null,
        'This is $40 - 22 - 18$: it forgets that the 7 students who study both were counted in both the 22 and the 18, so it subtracts them twice.',
        'This is the number who study **at least one** of the subjects. The question asks for neither, so subtract it from 40.',
        'This is $40 - 26$, where $26 = 15 + 11$ is the number who study **exactly one** subject. It wrongly lumps the 7 students who study both in with the "neither" group.',
      ],
      keyIdea: 'Neither $=$ total $-$ (first $+$ second $-$ both). Don\'t be fooled when the first two numbers add up to the total, because the overlap has been counted twice.',
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
    stem: 'How many diagonals does a decagon (a polygon with 10 sides) have?',
    options: ['$45$', '$35$', '$70$', '$25$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many lines join two corners of a 10-sided shape without being a side?',
      solution:
        'A **diagonal** joins two corners of a polygon that aren\'t next to each other. A side isn\'t a diagonal.\n\n' +
        'Stand at one corner. There are 9 other corners, and 2 of them are neighbours joined by sides. That leaves $9 - 2 = 7$ corners you can draw a diagonal to.\n\n' +
        'Do this from all 10 corners: $10 \\times 7 = 70$.\n\n' +
        'Each diagonal has two ends, so it was counted twice. Halve the count: $70 \\div 2 = 35$.',
      conclusion: 'Each of the 10 corners has 7 diagonals, and each diagonal is shared by two corners, so there are $35$.',
      whyWrong: [
        'This is $\\binom{10}{2}$, every segment between two vertices. It includes the 10 sides, which are not diagonals.',
        null,
        'This is $10 \\times 7$: each diagonal has two ends, so it is counted twice. Divide by 2.',
        'This is $45 - 20$: it subtracts each side twice. There are only 10 sides, so subtract 10.',
      ],
      keyIdea: 'A polygon with $n$ sides has $\\frac{n(n-3)}{2}$ diagonals: each corner has $n - 3$ diagonals, then halve for double counting. Another way: all pairs of corners minus the sides, $\\frac{n(n-1)}{2} - n$.',
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
    stem: 'A code is a sequence of **3 or 4** symbols chosen from 5 different symbols, and symbols may repeat. How many different codes are there?',
    options: ['$750$', '$625$', '$78\\,125$', '$180$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many codes are there of length 3 or length 4?',
      solution:
        'A code has length 3 **or** length 4, never both. So count each length separately and add. This is the **sum rule**.\n\n' +
        'Length 3: each of the 3 positions has 5 choices, since symbols may repeat. $5 \\times 5 \\times 5 = 5^3 = 125$.\n\n' +
        'Length 4: each of the 4 positions has 5 choices. $5 \\times 5 \\times 5 \\times 5 = 5^4 = 625$.\n\n' +
        'Add the two cases: $125 + 625 = 750$.',
      conclusion: '125 shorter codes and 625 longer codes make $750$ altogether.',
      whyWrong: [
        null,
        'This is $5^4$: it only counts the codes of length 4 and forgets the 125 codes of length 3.',
        'This is $125 \\times 625$: the product rule is for doing one thing **and then** another. A code has length 3 **or** length 4, so the cases are added.',
        'This is $5 \\times 4 \\times 3 + 5 \\times 4 \\times 3 \\times 2 = 60 + 120$: it forbids using a symbol twice, but repeats are allowed.',
      ],
      keyIdea: 'Split the problem into cases when the words say "or", such as different lengths. Use the product rule inside each case, then add the cases.',
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
      asking: 'How many people produce exactly 66 handshakes?',
      solution:
        'Let $n$ be the number of people. Each person shakes $n - 1$ hands, because you don\'t shake your own. So counting person by person gives $n(n-1)$.\n\n' +
        'Each handshake was counted twice, once for each person, so the real total is $\\frac{n(n-1)}{2}$.\n\n' +
        'Set this equal to 66: $\\frac{n(n-1)}{2} = 66$. Multiply both sides by 2: $n(n-1) = 132$.\n\n' +
        'Find two whole numbers in a row that multiply to 132. Since $11^2 = 121$ is close, try 11 and 12: $12 \\times 11 = 132$. So $n$ is the larger number, 12.',
      conclusion: 'Check: $\\frac{12 \\times 11}{2} = 66$ handshakes, so there were $12$ people.',
      whyWrong: [
        'This solves $\\frac{n(n+1)}{2} = 66$. With $n$ people, the first person shakes $n - 1$ hands, the next $n - 2$ new hands, and so on, so the total is $\\frac{n(n-1)}{2}$, not $\\frac{n(n+1)}{2}$. Check: 11 people give only $\\frac{11 \\times 10}{2} = 55$ handshakes.',
        'This is $66 \\div 2$. The number of handshakes grows like $n^2$, not in proportion to $n$, so you cannot just halve: 33 people would make 528 handshakes.',
        'This comes from $n(n-1) = 66$, forgetting to divide by 2; that gives $n \\approx 8.6$, rounded to 9. A non-whole answer is a sign the equation is wrong. 9 people make only 36 handshakes.',
        null,
      ],
      keyIdea: 'To reverse a handshake count, double it and find two neighbouring whole numbers with that product. The larger is $n$. Start from a number whose square is close to the doubled count.',
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

  {
    id: 'pigeonhole-counting-016',
    subtopic: 'pigeonhole-counting',
    difficulty: 'exam',
    stem: 'You walk on a grid from $A = (0, 0)$ to $B = (6, 4)$, one unit at a time, moving only right or up. How many shortest routes **pass through** the point $C = (2, 2)$?',
    options: ['$210$', '$21$', '$90$', '$120$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many shortest routes from $A$ to $B$ go through $C$?',
      solution:
        'A route through $C$ has two legs: $A$ to $C$, **and then** $C$ to $B$. Any first leg can join any second leg, so we count each leg and multiply.\n\n' +
        'Leg 1, from $(0, 0)$ to $(2, 2)$: 2 right and 2 up, which is 4 moves. Any order of those moves is a route, so choose which 2 of the 4 are up. $\\binom{n}{r}$ means the number of ways to choose $r$ items from $n$, so this is $\\binom{4}{2} = \\frac{4 \\times 3}{2 \\times 1} = 6$.\n\n' +
        'Leg 2, from $(2, 2)$ to $(6, 4)$: $6 - 2 = 4$ right and $4 - 2 = 2$ up, which is 6 moves. Choose which 2 are up: $\\binom{6}{2} = \\frac{6 \\times 5}{2 \\times 1} = 15$.\n\n' +
        'Multiply the two legs: $6 \\times 15 = 90$.',
      conclusion: '6 ways to reach $C$ and 15 ways from there to $B$ give $90$ routes.',
      whyWrong: [
        'This is $\\binom{10}{4}$, the number of **all** shortest routes from A to B. It ignores the condition that the route must pass through C.',
        'This is $6 + 15$: the two legs are done one after the other ("and then"), so the counts are multiplied, not added.',
        null,
        'This is $210 - 90$, the number of routes that **avoid** C.',
      ],
      keyIdea: 'For routes through a point, split at that point: count each leg with $\\binom{\\text{moves}}{\\text{up}}$, then multiply. To count routes that avoid the point, subtract this from the total number of routes.',
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
    id: 'pigeonhole-counting-021',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'If $n + 1$ objects are placed in $n$ boxes, the pigeonhole principle says that:',
    options: ['some box holds at least 2 objects', 'every box holds at least 2 objects', 'every box holds at least 1 object', 'exactly one box is empty'],
    correctIndex: 0,
    markScheme: {
      asking: 'What must happen when there is one more object than there are boxes?',
      solution:
        'Try to avoid having two objects in a box. The best you can do is put one object in each box, which uses up $n$ objects.\n\n' +
        'There is one object left, and it has to go in some box. That box then holds 2. For example, 4 letters going into 3 pigeonholes.',
      conclusion: 'You can\'t give every object its own box, so some box holds at least 2 objects.',
      whyWrong: [
        null,
        'That would need at least $2n$ objects. Only one box is forced to hold 2.',
        'All the objects could go in one box, leaving the other boxes empty.',
        'Nothing forces a box to be empty, and if some are empty there could be several.',
      ],
      keyIdea: 'The pigeonhole principle only says **some** box is forced, not which one, and not every one. Look for objects and boxes in a question, such as people and months, then find the worst case.',
    },
  },
  {
    id: 'pigeonhole-counting-022',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'Which rule counts **one** choice made from separate groups that do not overlap?',
    options: ['Sum rule', 'Product rule', 'Pigeonhole principle', 'Inclusion-exclusion'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which rule counts a single pick from groups that don\'t overlap?',
      solution:
        'You make **one** choice, and it comes from one of several separate groups. For example, pick one fruit from 3 apples or 4 pears.\n\n' +
        'Every item is one possible choice and no item is in two groups, so add the group sizes: $3 + 4 = 7$. Adding like this is called the **sum rule**.',
      conclusion: 'One choice from separate groups means adding, which is the Sum rule.',
      whyWrong: [
        null,
        'The product rule is for choices made in stages ("this **and then** that").',
        'The pigeonhole principle shows that something must happen. It does not count choices.',
        'Inclusion-exclusion is for groups that **do** overlap. With no overlap there is nothing to subtract.',
      ],
      keyIdea: 'Ask what the choice looks like. One pick from separate groups: add, using the sum rule. Picks made in stages: multiply, using the product rule. Overlapping groups: use inclusion-exclusion, which adds the groups then subtracts the overlap.',
    },
  },
  {
    id: 'pigeonhole-counting-023',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'Which rule counts a choice made in **stages**, one decision after another?',
    options: ['Product rule', 'Sum rule', 'Complementary counting', 'Pigeonhole principle'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which rule counts choices made one after another?',
      solution:
        'In stages means you decide one thing and then another. For example, pick a shirt from 3 and then trousers from 2.\n\n' +
        'Each of the 3 shirts can go with each of the 2 trousers, so there are $3 \\times 2 = 6$ outfits. Multiplying like this is called the **product rule**.',
      conclusion: 'Choices made in stages multiply, which is the Product rule.',
      whyWrong: [
        null,
        'The sum rule is for **one** choice from separate groups.',
        'Complementary counting means total minus the opposite case, as in "at least one" questions.',
        'The pigeonhole principle shows that something must happen. It does not count choices.',
      ],
      keyIdea: '"And then" means multiply: the product rule. "Or" from separate groups means add: the sum rule. "At least one" often means total minus none: complementary counting.',
    },
  },
  {
    id: 'pigeonhole-counting-024',
    subtopic: 'pigeonhole-counting',
    difficulty: 'foundation',
    stem: 'What does $\\binom{n}{2}$ count?',
    options: ['Unordered pairs from $n$ items', 'Ordered pairs from $n$ items', 'All subsets of $n$ items', 'Arrangements of $n$ items'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the symbol $\\binom{n}{2}$ stand for?',
      solution:
        '$\\binom{n}{2}$ is read "$n$ choose 2". It counts the ways to choose 2 items from $n$, when order doesn\'t matter.\n\n' +
        'A tiny example: from A, B and C the pairs are AB, AC and BC, so $\\binom{3}{2} = 3$. AB and BA count as the same pair, so we call them **unordered**.',
      conclusion: 'Choosing 2 with order ignored is exactly what it counts: Unordered pairs from $n$ items.',
      whyWrong: [
        null,
        'Ordered pairs number $n(n-1)$. Dividing by 2 removes the order, since each pair is counted twice.',
        'All the subsets number $2^n$. Here only subsets of size 2 are counted.',
        'Arrangements of all $n$ items number $n!$.',
      ],
      keyIdea: 'Use $\\binom{n}{2} = \\frac{n(n-1)}{2}$ whenever each pair of things counts once: handshakes, matches, edges of a complete graph. If order matters, use $n(n-1)$ instead.',
    },
  },
];

