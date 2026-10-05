import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- helpers used by the answer checks
/** Apply a one-step rule `steps` times starting from `start`. */
function iterate(start: number, steps: number, rule: (prev: number, n: number) => number, firstIndex = 1): number {
  let a = start;
  for (let i = 1; i <= steps; i++) a = rule(a, firstIndex + i);
  return a;
}

/** Term number `target` of a two-term recurrence with given a_1, a_2. */
function twoTerm(a1: number, a2: number, target: number, rule: (prev: number, prev2: number) => number): number {
  if (target === 1) return a1;
  let x = a1;
  let y = a2;
  for (let n = 3; n <= target; n++) [x, y] = [y, rule(y, x)];
  return y;
}

/** All binary strings of a given length. */
function binaryStrings(len: number): string[] {
  const out: string[] = [];
  for (let k = 0; k < 2 ** len; k++) out.push(k.toString(2).padStart(len, '0'));
  return out;
}

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'recurrence-relations-001',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'A sequence is defined by $a_1 = 4$ and $a_n = a_{n-1} + 3$ for $n \\ge 2$. What is $a_5$?',
    options: ['$19$', '$13$', '$16$', '$324$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The rule says: to get the next term, take the previous term and add 3. Start from $a_1 = 4$ and apply the rule one step at a time.\n\n' +
        '- $a_2 = a_1 + 3 = 4 + 3 = 7$\n' +
        '- $a_3 = a_2 + 3 = 7 + 3 = 10$\n' +
        '- $a_4 = a_3 + 3 = 10 + 3 = 13$\n' +
        '- $a_5 = a_4 + 3 = 13 + 3 = 16$\n\n' +
        'Check with the closed form of an arithmetic sequence: $a_5 = 4 + (5 - 1) \\times 3 = 16$.',
      whyWrong: [
        'This adds 3 five times ($4 + 5 \\times 3$). Going from $a_1$ to $a_5$ takes only **four** steps, so 3 is added four times.',
        'This is $a_4$: the working stopped one step too early.',
        null,
        'This multiplies by 3 each time ($4 \\times 3^4$), treating the rule as $a_n = 3a_{n-1}$. The rule says **add** 3.',
      ],
      keyIdea: 'A recurrence builds each term from the one before; from $a_1$ to $a_n$ you apply the rule $n - 1$ times.',
    },
    check: { optionValues: [19, 13, 16, 324], compute: () => iterate(4, 4, (p) => p + 3) },
  },
  {
    id: 'recurrence-relations-002',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'A sequence is defined by $a_0 = 2$ and $a_n = 3a_{n-1}$ for $n \\ge 1$. What is $a_4$?',
    options: ['$54$', '$162$', '$486$', '$14$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Note that this sequence starts at $a_0$, not $a_1$. Multiply by 3 at each step.\n\n' +
        '- $a_1 = 3 \\times 2 = 6$\n' +
        '- $a_2 = 3 \\times 6 = 18$\n' +
        '- $a_3 = 3 \\times 18 = 54$\n' +
        '- $a_4 = 3 \\times 54 = 162$\n\n' +
        'From $a_0$ to $a_4$ is four steps, so $a_4 = 2 \\times 3^4 = 2 \\times 81 = 162$.',
      whyWrong: [
        'This is $2 \\times 3^3$: it assumes the sequence starts at $a_1$, so it only multiplies by 3 three times. Starting from $a_0$ there are four steps to $a_4$.',
        null,
        'This is $2 \\times 3^5$: one multiplication too many (that is $a_5$).',
        'This adds 3 four times ($2 + 4 \\times 3$), treating the rule as $a_n = a_{n-1} + 3$ instead of multiplying by 3.',
      ],
      keyIdea: 'Always check where the sequence starts: from $a_0$ to $a_n$ is $n$ steps, from $a_1$ to $a_n$ is $n - 1$ steps.',
    },
    check: { optionValues: [54, 162, 486, 14], compute: () => iterate(2, 4, (p) => 3 * p, 0) },
  },
  {
    id: 'recurrence-relations-003',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'The Fibonacci sequence is defined by $F_1 = 1$, $F_2 = 1$ and $F_n = F_{n-1} + F_{n-2}$ for $n \\ge 3$. What is $F_8$?',
    options: ['$13$', '$34$', '$64$', '$21$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each term is the sum of the **two** terms before it.\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $F_n$ | 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21 |\n\n' +
        'For example $F_3 = 1 + 1 = 2$, $F_4 = 2 + 1 = 3$, ..., $F_8 = F_7 + F_6 = 13 + 8 = 21$.',
      whyWrong: [
        'This is $F_7$: one term short. Writing the terms in a table with their index numbers avoids losing count.',
        'This is $F_9 = 21 + 13$: one term too far.',
        'This doubles each term ($1, 1, 2, 4, 8, \\dots$), which is $F_n = 2F_{n-1}$. The rule adds the two previous terms $F_{n-1}$ and $F_{n-2}$; it does not add the last term to itself.',
        null,
      ],
      keyIdea: 'In a Fibonacci-type recurrence each new term needs the two previous terms, so you need two starting values.',
    },
    check: { optionValues: [13, 34, 64, 21], compute: () => twoTerm(1, 1, 8, (p, q) => p + q) },
  },
  {
    id: 'recurrence-relations-004',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'A sequence begins $3, 7, 15, 31, 63, \\dots$ with $a_1 = 3$. Which recurrence relation (for $n \\ge 2$) generates **all** of these terms?',
    options: ['$a_n = a_{n-1} + 4$', '$a_n = 3a_{n-1} - 2$', '$a_n = 2a_{n-1} + 1$', '$a_n = 2a_{n-1} - 1$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Test each rule on **every** pair of neighbouring terms, not just the first pair.\n\n' +
        '- $a_n = a_{n-1} + 4$: $3 \\to 7$ works, but $7 \\to 11$, not 15.\n' +
        '- $a_n = 3a_{n-1} - 2$: $3 \\to 7$ works, but $7 \\to 19$, not 15.\n' +
        '- $a_n = 2a_{n-1} + 1$: $3 \\to 7$, $7 \\to 15$, $15 \\to 31$, $31 \\to 63$. All work.\n' +
        '- $a_n = 2a_{n-1} - 1$: $3 \\to 5$, not 7.\n\n' +
        'So the rule is $a_n = 2a_{n-1} + 1$ (double, then add 1).',
      whyWrong: [
        'This only fits the first step ($7 - 3 = 4$). The gaps are $4, 8, 16, 32$, which are not constant, so the sequence is not arithmetic.',
        'This fits $3 \\to 7$ but gives $3 \\times 7 - 2 = 19$ for the third term, not 15. A rule must fit every step.',
        null,
        'This has the sign wrong: $2 \\times 3 - 1 = 5$, not 7.',
      ],
      keyIdea: 'To identify a recurrence, check the candidate rule on every consecutive pair of terms; fitting one step is not enough.',
    },
    check: {
      optionValues: ['a+4', '3a-2', '2a+1', '2a-1'],
      compute: () => {
        const seq = [3, 7, 15, 31, 63];
        const rules: [string, (p: number) => number][] = [
          ['a+4', (p) => p + 4],
          ['3a-2', (p) => 3 * p - 2],
          ['2a+1', (p) => 2 * p + 1],
          ['2a-1', (p) => 2 * p - 1],
        ];
        const ok = rules.filter(([, f]) => seq.slice(1).every((t, i) => f(seq[i]) === t));
        return ok.length === 1 ? ok[0][0] : 'none or many';
      },
    },
  },
  {
    id: 'recurrence-relations-005',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'A colony of bacteria doubles every hour. At the start (hour 0) there are 300 bacteria, so $P_0 = 300$ and $P_n = 2P_{n-1}$ for $n \\ge 1$. Which formula gives the number of bacteria after $n$ hours?',
    options: ['$P_n = 300 \\times 2^{n-1}$', '$P_n = 300 + 2n$', '$P_n = 600^{n}$', '$P_n = 300 \\times 2^{n}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each hour the number is multiplied by 2, so this is a geometric sequence with first value 300 and ratio 2.\n\n' +
        '- $P_1 = 300 \\times 2$\n' +
        '- $P_2 = 300 \\times 2 \\times 2 = 300 \\times 2^2$\n' +
        '- $P_3 = 300 \\times 2^3$\n\n' +
        'After $n$ hours we have multiplied by 2 exactly $n$ times: $P_n = 300 \\times 2^{n}$.\n\n' +
        'Quick check with $n = 0$: $300 \\times 2^0 = 300$, which matches $P_0$.',
      whyWrong: [
        'This is the formula for a sequence that starts at $P_1 = 300$. Here the starting value is $P_0$, and $n = 0$ would give $300 \\times 2^{-1} = 150$, not 300.',
        'This adds 2 each hour instead of doubling: it treats the rule as arithmetic.',
        'This multiplies 300 by 2 first and then raises the result to the power $n$. Only the 2 is repeated; the 300 is used once. At $n = 0$ it gives 1, not 300.',
        null,
      ],
      keyIdea: 'For $P_n = rP_{n-1}$ starting at $P_0$, the closed form is $P_n = P_0 r^{n}$; test $n = 0$ to check the index.',
    },
    check: {
      optionValues: [300 * 2 ** 4, 300 + 2 * 5, 600 ** 5, 300 * 2 ** 5],
      compute: () => iterate(300, 5, (p) => 2 * p, 0),
    },
  },

  // ================================================================ exam
  {
    id: 'recurrence-relations-006',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $a_1 = 2$ and $a_n = 3a_{n-1} - 1$ for $n \\ge 2$. What is $a_4$?',
    options: ['$41$', '$14$', '$122$', '$15$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Multiply the previous term by 3, **then** subtract 1.\n\n' +
        '- $a_2 = 3 \\times 2 - 1 = 5$\n' +
        '- $a_3 = 3 \\times 5 - 1 = 14$\n' +
        '- $a_4 = 3 \\times 14 - 1 = 41$',
      whyWrong: [
        null,
        'This is $a_3$: the working stopped one step early.',
        'This is $a_5 = 3 \\times 41 - 1$: one step too many.',
        'This subtracts 1 **before** multiplying, i.e. uses $3(a_{n-1} - 1)$: $3 \\times 1 = 3$, $3 \\times 2 = 6$, $3 \\times 5 = 15$. Order of operations: multiply first.',
      ],
      keyIdea: 'Apply the rule exactly as written (order of operations) one step at a time, keeping track of the index.',
    },
    check: { optionValues: [41, 14, 122, 15], compute: () => iterate(2, 3, (p) => 3 * p - 1) },
  },
  {
    id: 'recurrence-relations-007',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $a_1 = 7$ and $a_n = a_{n-1} - 4$ for $n \\ge 2$. Which of the following is a closed-form formula for $a_n$?',
    options: ['$a_n = 7 - 4n$', '$a_n = 11 - 4n$', '$a_n = 3 + 4n$', '$a_n = 7(-4)^{n-1}$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Subtracting 4 each time makes an **arithmetic** sequence with first term $a_1 = 7$ and common difference $d = -4$.\n\n' +
        'Arithmetic closed form: $a_n = a_1 + (n - 1)d$.\n\n' +
        '$$a_n = 7 + (n - 1)(-4) = 7 - 4n + 4 = 11 - 4n$$\n\n' +
        'Check: $n = 1$ gives $11 - 4 = 7$ and $n = 2$ gives $11 - 8 = 3 = 7 - 4$. Both correct.',
      whyWrong: [
        'This uses $n$ instead of $n - 1$: at $n = 1$ it gives $7 - 4 = 3$, but $a_1$ should be 7.',
        null,
        'This has the sign of the difference wrong ($d = +4$): it gives $7, 11, 15, \\dots$, an increasing sequence.',
        'This treats the rule as **multiplying** by $-4$ (a geometric sequence). The rule subtracts 4.',
      ],
      keyIdea: 'An "add a constant" recurrence is arithmetic: $a_n = a_1 + (n - 1)d$; check your formula at $n = 1$ and $n = 2$.',
    },
    check: {
      optionValues: [7 - 4 * 10, 11 - 4 * 10, 3 + 4 * 10, 7 * (-4) ** 9],
      compute: () => iterate(7, 9, (p) => p - 4),
    },
  },
  {
    id: 'recurrence-relations-008',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $a_1 = 2$, $a_2 = 5$ and $a_n = a_{n-1} + 2a_{n-2}$ for $n \\ge 3$. What is $a_5$?',
    options: ['$19$', '$70$', '$37$', '$75$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Each new term = (previous term) + 2 $\\times$ (the term before that).\n\n' +
        '- $a_3 = a_2 + 2a_1 = 5 + 2 \\times 2 = 9$\n' +
        '- $a_4 = a_3 + 2a_2 = 9 + 2 \\times 5 = 19$\n' +
        '- $a_5 = a_4 + 2a_3 = 19 + 2 \\times 9 = 37$',
      whyWrong: [
        'This is $a_4$: one step short.',
        'This doubles the wrong term, using $a_n = 2a_{n-1} + a_{n-2}$: $12, 29, 70$. The 2 multiplies $a_{n-2}$, the term two places back.',
        null,
        'This is $a_6 = 37 + 2 \\times 19$: one step too many.',
      ],
      keyIdea: 'In a two-term recurrence, match each coefficient to the right earlier term ($a_{n-1}$ is one back, $a_{n-2}$ is two back).',
    },
    check: { optionValues: [19, 70, 37, 75], compute: () => twoTerm(2, 5, 5, (p, q) => p + 2 * q) },
  },
  {
    id: 'recurrence-relations-009',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A staircase has 6 steps. You climb it taking either 1 step or 2 steps at a time. Let $S_n$ be the number of different ways to climb $n$ steps, so $S_1 = 1$ and $S_2 = 2$. How many ways are there to climb all 6 steps?',
    options: ['$8$', '$13$', '$21$', '$64$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Think about the **last move**. To finish on step $n$ you either:\n\n' +
        '- came from step $n - 1$ with a 1-step move ($S_{n-1}$ ways to get there), or\n' +
        '- came from step $n - 2$ with a 2-step move ($S_{n-2}$ ways to get there).\n\n' +
        'So $S_n = S_{n-1} + S_{n-2}$, a Fibonacci-type recurrence.\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $S_n$ | 1 | 2 | 3 | 5 | 8 | 13 |\n\n' +
        'There are 13 ways.',
      whyWrong: [
        'This is $S_5$, or the Fibonacci number $F_6$ using starting values $1, 1$. Here $S_2 = 2$ (you can do 1+1 or 2), so the list is shifted along by one.',
        null,
        'This is $S_7$: one step too far.',
        'This is $2^6$, as if every step offered an independent choice of 2. A 2-step move uses up two steps at once, so the choices are not independent.',
      ],
      keyIdea: 'Counting recurrences come from splitting on the last move: the cases give the terms that are added.',
    },
    check: {
      optionValues: [8, 13, 21, 64],
      compute: () => {
        // brute force: count sequences of 1s and 2s summing to 6
        const ways = (left: number): number => (left === 0 ? 1 : left < 0 ? 0 : ways(left - 1) + ways(left - 2));
        return ways(6);
      },
    },
  },
  {
    id: 'recurrence-relations-010',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'Binary search on a sorted list of $n$ items makes $T(n)$ comparisons in the worst case, where $T(1) = 1$ and $T(n) = T\\left(\\frac{n}{2}\\right) + 1$ for $n$ a power of 2. What is $T(32)$?',
    options: ['$5$', '$16$', '$6$', '$32$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Keep halving until you reach $T(1)$, adding 1 each time.\n\n' +
        '- $T(1) = 1$\n' +
        '- $T(2) = T(1) + 1 = 2$\n' +
        '- $T(4) = T(2) + 1 = 3$\n' +
        '- $T(8) = 4$, $T(16) = 5$, $T(32) = 6$\n\n' +
        'In general $T(n) = \\log_2 n + 1$, and $\\log_2 32 = 5$, so $T(32) = 6$.',
      whyWrong: [
        'This is $\\log_2 32$: it counts the 5 halvings but forgets the 1 comparison made at $T(1)$.',
        'This is $\\frac{32}{2}$: it halves only once instead of repeatedly.',
        null,
        'This is $n$, the worst case for a **linear** search that checks every item. Binary search halves the list each time.',
      ],
      keyIdea: 'A recurrence that halves $n$ and adds a constant grows like $\\log_2 n$: count the halvings, then add the base case.',
    },
    check: {
      optionValues: [5, 16, 6, 32],
      compute: () => {
        const T = (n: number): number => (n === 1 ? 1 : T(n / 2) + 1);
        return T(32);
      },
    },
  },
  {
    id: 'recurrence-relations-011',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'In the Tower of Hanoi puzzle, the minimum number of moves $H_n$ needed to move $n$ discs satisfies $H_1 = 1$ and $H_n = 2H_{n-1} + 1$. What is the minimum number of moves for 6 discs?',
    options: ['$64$', '$32$', '$31$', '$63$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Apply the rule step by step:\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $H_n$ | 1 | 3 | 7 | 15 | 31 | 63 |\n\n' +
        'For example $H_2 = 2 \\times 1 + 1 = 3$ and $H_6 = 2 \\times 31 + 1 = 63$.\n\n' +
        'The pattern is $H_n = 2^{n} - 1$, and indeed $2^6 - 1 = 63$.',
      whyWrong: [
        'This is $2^6$: it forgets the $-1$ in the closed form $H_n = 2^{n} - 1$.',
        'This ignores the $+1$ in the rule and just doubles: $1, 2, 4, 8, 16, 32$. Each extra disc needs the smaller tower moved **twice** plus one more move for the new disc.',
        'This is $H_5$: one disc short.',
        null,
      ],
      keyIdea: 'The recurrence $H_n = 2H_{n-1} + 1$ with $H_1 = 1$ has closed form $H_n = 2^{n} - 1$.',
    },
    check: { optionValues: [64, 32, 31, 63], compute: () => iterate(1, 5, (p) => 2 * p + 1) },
  },
  {
    id: 'recurrence-relations-012',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A loan of AED 10,000 is charged 10% interest at the end of each year, and then a repayment of AED 2,000 is made. So the balance $B_n$ after $n$ years satisfies $B_0 = 10000$ and $B_n = 1.1B_{n-1} - 2000$. What is the balance after 3 years?',
    options: ['AED 6,028', 'AED 7,000', 'AED 6,690', 'AED 7,900'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Each year: multiply by 1.1 (add 10% interest), then subtract 2000.\n\n' +
        '- $B_1 = 1.1 \\times 10000 - 2000 = 11000 - 2000 = 9000$\n' +
        '- $B_2 = 1.1 \\times 9000 - 2000 = 9900 - 2000 = 7900$\n' +
        '- $B_3 = 1.1 \\times 7900 - 2000 = 8690 - 2000 = 6690$\n\n' +
        'The balance after 3 years is AED 6,690.',
      whyWrong: [
        'This subtracts the repayment **before** adding interest, i.e. uses $1.1(B_{n-1} - 2000)$: $8800, 7480, 6028$. The question says interest is charged first.',
        'This uses simple interest on the original AED 10,000 ($3 \\times 1000$ added, $3 \\times 2000$ repaid). Interest is charged on the **current** balance each year.',
        null,
        'This is $B_2$, the balance after only 2 years.',
      ],
      keyIdea: 'Money problems with a percentage change plus a fixed payment give $B_n = rB_{n-1} + d$; apply it in the stated order.',
    },
    check: {
      optionValues: [6028, 7000, 6690, 7900],
      compute: () => iterate(10000, 3, (p) => 1.1 * p - 2000, 0),
    },
  },
  {
    id: 'recurrence-relations-013',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'def f(n):\n    if n <= 1:\n        return n\n    return f(n - 1) + 2 * f(n - 2)\n\nprint(f(6))',
    },
    options: ['`8`', '`11`', '`70`', '`21`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The function defines the recurrence $f(n) = f(n-1) + 2f(n-2)$ with base cases $f(0) = 0$ and $f(1) = 1$ (because `return n` when `n <= 1`). Build up from the bottom:\n\n' +
        '| $n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $f(n)$ | 0 | 1 | 1 | 3 | 5 | 11 | 21 |\n\n' +
        '- $f(2) = 1 + 2 \\times 0 = 1$\n' +
        '- $f(3) = 1 + 2 \\times 1 = 3$\n' +
        '- $f(4) = 3 + 2 \\times 1 = 5$\n' +
        '- $f(5) = 5 + 2 \\times 3 = 11$\n' +
        '- $f(6) = 11 + 2 \\times 5 = 21$\n\n' +
        'It prints `21`.',
      whyWrong: [
        'This ignores the `2 *` and computes the ordinary Fibonacci number $f(6) = f(5) + f(4)$, which is 8.',
        'This is $f(5)$: one level short.',
        'This puts the 2 on the wrong term, computing $2f(n-1) + f(n-2)$: $0, 1, 2, 5, 12, 29, 70$.',
        null,
      ],
      keyIdea: 'A recursive function is a recurrence relation in code: read off the base cases and the rule, then build a table from the bottom up.',
    },
    check: {
      optionValues: [8, 11, 70, 21],
      compute: () => {
        const f = (n: number): number => (n <= 1 ? n : f(n - 1) + 2 * f(n - 2));
        return f(6);
      },
    },
    python: { stdout: '21\n' },
  },
  {
    id: 'recurrence-relations-014',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'Merge sort on $n$ items (where $n$ is a power of 2) makes at most $T(n)$ comparisons, where $T(1) = 0$ and $T(n) = 2T\\left(\\frac{n}{2}\\right) + n$. Using this recurrence, what is $T(8)$?',
    options: ['$14$', '$24$', '$8$', '$32$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work up from $T(1)$, doubling the previous value and adding the current $n$.\n\n' +
        '- $T(2) = 2T(1) + 2 = 2 \\times 0 + 2 = 2$\n' +
        '- $T(4) = 2T(2) + 4 = 2 \\times 2 + 4 = 8$\n' +
        '- $T(8) = 2T(4) + 8 = 2 \\times 8 + 8 = 24$\n\n' +
        'This matches the known result $T(n) = n\\log_2 n$: $8 \\times 3 = 24$.',
      whyWrong: [
        'This forgets the factor 2, using $T(n) = T\\left(\\frac{n}{2}\\right) + n$: $2, 6, 14$. Merge sort sorts **two** halves.',
        null,
        'This is $T(4)$: the working stopped one level early. The question asks for $T(8)$, so one more step $2T(4) + 8$ is needed.',
        'This uses $T(1) = 1$ instead of $T(1) = 0$: $4, 12, 32$. A single item needs no comparisons.',
      ],
      keyIdea: 'Divide-and-conquer recurrences are evaluated by working up from the base case; $T(n) = 2T(\\frac{n}{2}) + n$ gives $n\\log_2 n$.',
    },
    check: {
      optionValues: [14, 24, 8, 32],
      compute: () => {
        const T = (n: number): number => (n === 1 ? 0 : 2 * T(n / 2) + n);
        return T(8);
      },
    },
  },

  // ================================================================ challenge
  {
    id: 'recurrence-relations-015',
    subtopic: 'recurrence-relations',
    difficulty: 'challenge',
    stem: 'A sequence satisfies $a_n = 2a_{n-1} + 3$ for $n \\ge 2$, and $a_4 = 61$. What is $a_1$?',
    options: ['$13$', '$5$', '$1$', '$2.375$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work **backwards** by undoing the rule. If $a_n = 2a_{n-1} + 3$, then $a_{n-1} = \\frac{a_n - 3}{2}$ (undo the $+3$ first, then undo the $\\times 2$).\n\n' +
        '- $a_3 = \\frac{61 - 3}{2} = \\frac{58}{2} = 29$\n' +
        '- $a_2 = \\frac{29 - 3}{2} = \\frac{26}{2} = 13$\n' +
        '- $a_1 = \\frac{13 - 3}{2} = \\frac{10}{2} = 5$\n\n' +
        'Check forwards: $5 \\to 13 \\to 29 \\to 61$. Correct.',
      whyWrong: [
        'This is $a_2$: it stops after two backward steps instead of three.',
        null,
        'This is $a_0 = \\frac{5 - 3}{2}$: one backward step too many.',
        'This undoes the operations in the wrong order (halving first, then subtracting 3): $61 \\div 2 - 3 = 27.5$, and so on. To reverse "double then add 3" you must subtract 3 first, then halve.',
      ],
      keyIdea: 'To run a recurrence backwards, undo the operations in reverse order; check by running forwards again.',
    },
    check: {
      optionValues: [13, 5, 1, 2.375],
      compute: () => iterate(61, 3, (p) => (p - 3) / 2),
    },
  },
  {
    id: 'recurrence-relations-016',
    subtopic: 'recurrence-relations',
    difficulty: 'challenge',
    stem: 'A sequence is defined by $a_0 = 3$ and $a_n = 2a_{n-1} + 5$ for $n \\ge 1$. Which of the following is a closed-form formula for $a_n$?',
    options: ['$a_n = 3 \\times 2^{n} - 5$', '$a_n = 8 \\times 2^{n} + 5$', '$a_n = 8 \\times 2^{n} - 5$', '$a_n = 3 \\times 2^{n} + 5n$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'For $a_n = ra_{n-1} + d$ with $r \\ne 1$, first find the **fixed point** $L$, the value that the rule leaves unchanged:\n\n' +
        '$$L = 2L + 5 \\implies L = -5$$\n\n' +
        'The distance from the fixed point is multiplied by $r = 2$ each step, so\n\n' +
        '$$a_n - L = (a_0 - L) \\times 2^{n} \\implies a_n + 5 = (3 + 5) \\times 2^{n}$$\n\n' +
        'so $a_n = 8 \\times 2^{n} - 5$.\n\n' +
        'Check: $a_0 = 8 - 5 = 3$, $a_1 = 16 - 5 = 11 = 2 \\times 3 + 5$, $a_2 = 32 - 5 = 27 = 2 \\times 11 + 5$. Correct.',
      whyWrong: [
        'This multiplies $a_0$ itself by $2^{n}$ instead of $a_0 - L = 8$. At $n = 0$ it gives $3 - 5 = -2$, not 3.',
        'This has the sign of the fixed point wrong ($L = 5$ instead of $-5$). At $n = 0$ it gives 13, not 3.',
        null,
        'This treats the $+5$ as being added once per step without being doubled later. At $n = 2$ it gives $12 + 10 = 22$, but $a_2 = 27$.',
      ],
      keyIdea: 'For $a_n = ra_{n-1} + d$, the closed form is $a_n = (a_0 - L)r^{n} + L$ where $L = \\frac{d}{1 - r}$; always check $n = 0, 1, 2$.',
    },
    check: {
      optionValues: [3 * 2 ** 5 - 5, 8 * 2 ** 5 + 5, 8 * 2 ** 5 - 5, 3 * 2 ** 5 + 5 * 5],
      compute: () => iterate(3, 5, (p) => 2 * p + 5, 0),
    },
  },
  {
    id: 'recurrence-relations-017',
    subtopic: 'recurrence-relations',
    difficulty: 'challenge',
    stem: 'A sequence is defined by $a_1 = 5$ and $a_n = 3a_{n-1} - 4$ for $n \\ge 2$. What is $a_{10}$?',
    options: ['$59049$', '$59051$', '$19685$', '$98411$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Computing nine steps by hand is slow, so find a closed form.\n\n' +
        'Fixed point: $L = 3L - 4 \\implies 2L = 4 \\implies L = 2$.\n\n' +
        'The gap from 2 is multiplied by 3 each step. At $n = 1$ the gap is $5 - 2 = 3$, so\n\n' +
        '$$a_n - 2 = 3 \\times 3^{n-1} = 3^{n} \\implies a_n = 3^{n} + 2$$\n\n' +
        'Check: $a_1 = 3 + 2 = 5$, $a_2 = 9 + 2 = 11 = 3 \\times 5 - 4$, $a_3 = 27 + 2 = 29 = 3 \\times 11 - 4$.\n\n' +
        'So $a_{10} = 3^{10} + 2 = 59049 + 2 = 59051$.',
      whyWrong: [
        'This is $3^{10}$: it forgets to add back the fixed point 2.',
        null,
        'This is $3^{9} + 2$: it uses the exponent $n - 1$ but forgets that the starting gap is 3, which adds one more factor of 3.',
        'This is $5 \\times 3^{9} - 4$: it multiplies the first term by 3 nine times and subtracts 4 only once, but the $-4$ is applied (and then tripled) at every step.',
      ],
      keyIdea: 'For a far-away term of $a_n = ra_{n-1} + d$, use the fixed point $L$: $a_n = L + (a_1 - L)r^{n-1}$.',
    },
    check: {
      optionValues: [59049, 59051, 19685, 98411],
      compute: () => iterate(5, 9, (p) => 3 * p - 4),
    },
  },
  {
    id: 'recurrence-relations-018',
    subtopic: 'recurrence-relations',
    difficulty: 'challenge',
    stem: 'Let $b_n$ be the number of binary strings of length $n$ (strings of 0s and 1s) that contain **no two consecutive 1s**. For example $b_1 = 2$ and $b_2 = 3$ (00, 01, 10). It can be shown that $b_n = b_{n-1} + b_{n-2}$. How many such strings of length 6 are there?',
    options: ['$13$', '$43$', '$64$', '$21$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Why the recurrence holds: look at the **last** digit of a valid string of length $n$.\n\n' +
        '- If it ends in 0, the first $n - 1$ digits can be any valid string: $b_{n-1}$ ways.\n' +
        '- If it ends in 1, the digit before must be 0, and the first $n - 2$ digits can be any valid string: $b_{n-2}$ ways.\n\n' +
        'Now build the table:\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $b_n$ | 2 | 3 | 5 | 8 | 13 | 21 |\n\n' +
        'There are 21 strings.',
      whyWrong: [
        'This is $b_5$: one step short.',
        'This is $64 - 21$, the number of strings that **do** contain two consecutive 1s. It counts the complement.',
        'This is $2^6$, the number of **all** binary strings of length 6, ignoring the restriction.',
        null,
      ],
      keyIdea: 'Split on how a valid string ends to get a recurrence, then compute terms from the starting values.',
    },
    check: {
      optionValues: [13, 43, 64, 21],
      compute: () => binaryStrings(6).filter((s) => !s.includes('11')).length,
    },
  },
  {
    id: 'recurrence-relations-019',
    subtopic: 'recurrence-relations',
    difficulty: 'challenge',
    stem: 'How many times is "hi" printed when `HELLO(3)` is called?',
    code: {
      lang: 'pseudocode',
      source:
        'procedure HELLO(n)\n    if n = 0 then\n        return\n    end if\n    print("hi")\n    HELLO(n - 1)\n    HELLO(n - 1)\n    HELLO(n - 1)\nend procedure',
    },
    options: ['$27$', '$13$', '$9$', '$40$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let $P(n)$ be the number of prints made by `HELLO(n)`. A call with $n = 0$ prints nothing, so $P(0) = 0$. A call with $n \\ge 1$ prints once and then makes three calls with $n - 1$:\n\n' +
        '$$P(n) = 1 + 3P(n-1)$$\n\n' +
        '- $P(1) = 1 + 3 \\times 0 = 1$\n' +
        '- $P(2) = 1 + 3 \\times 1 = 4$\n' +
        '- $P(3) = 1 + 3 \\times 4 = 13$\n\n' +
        'Level by level: 1 print from `HELLO(3)`, 3 from the `HELLO(2)` calls, 9 from the `HELLO(1)` calls: $1 + 3 + 9 = 13$.',
      whyWrong: [
        'This is $3^3$, the number of `HELLO(0)` calls at the bottom. Those calls return straight away and print nothing.',
        null,
        'This counts only the 9 prints made by the `HELLO(1)` calls and forgets the prints at the higher levels.',
        'This is the total number of **calls**, $1 + 3 + 9 + 27 = 40$, including the 27 calls with $n = 0$ that print nothing.',
      ],
      keyIdea: 'Write the work of a recursive procedure as a recurrence: work per call plus (number of recursive calls) times the work of each.',
    },
    check: {
      optionValues: [27, 13, 9, 40],
      compute: () => {
        let prints = 0;
        const hello = (n: number): void => {
          if (n === 0) return;
          prints++;
          hello(n - 1);
          hello(n - 1);
          hello(n - 1);
        };
        hello(3);
        return prints;
      },
    },
  },
  {
    id: 'recurrence-relations-020',
    subtopic: 'recurrence-relations',
    difficulty: 'challenge',
    stem: 'Straight lines (extending forever in both directions) are drawn on an infinite flat plane so that no two are parallel and no three meet at one point. Let $R_n$ be the number of regions the plane is divided into by $n$ lines: $R_0 = 1$, $R_1 = 2$, $R_2 = 4$, $R_3 = 7$. The $n$th line crosses each of the earlier $n - 1$ lines exactly once. What is $R_6$?',
    options: ['$22$', '$64$', '$21$', '$16$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The $n$th line crosses the $n - 1$ earlier lines at $n - 1$ points, which cut it into $n$ pieces. Each piece splits one existing region into two, so the line adds $n$ new regions:\n\n' +
        '$$R_n = R_{n-1} + n$$\n\n' +
        'Check: $R_3 = R_2 + 3 = 4 + 3 = 7$. Correct. Continue:\n\n' +
        '- $R_4 = 7 + 4 = 11$\n' +
        '- $R_5 = 11 + 5 = 16$\n' +
        '- $R_6 = 16 + 6 = 22$\n\n' +
        'Closed form: $R_n = 1 + \\frac{n(n+1)}{2}$, and $1 + \\frac{6 \\times 7}{2} = 22$.',
      whyWrong: [
        null,
        'This guesses doubling from $2, 4$ ($2^6$). The next value $R_3 = 7$, not 8, already shows the pattern is not doubling.',
        'This is $1 + 2 + \\dots + 6$: it adds up the new regions but forgets that the plane is already 1 region before any lines are drawn.',
        'This is $R_5$: one line short.',
      ],
      keyIdea: 'Find the recurrence by asking how much the $n$th step adds, then test it on the given values before extending.',
    },
    check: {
      optionValues: [22, 64, 21, 16],
      compute: () => iterate(1, 6, (p, n) => p + n, 0),
    },
  },
];
