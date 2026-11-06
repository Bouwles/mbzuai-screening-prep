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
        '- $a_5 = a_4 + 3 = 13 + 3 = 16$',
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
        '- $a_4 = 3 \\times 54 = 162$',
      whyWrong: [
        'This is $a_3$: it assumes the sequence starts at $a_1$, so it only multiplies by 3 three times. Starting from $a_0$ there are four steps to $a_4$.',
        null,
        'This is $a_5$: one multiplication too many.',
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
    id: 'recurrence-relations-006',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
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
    id: 'recurrence-relations-021',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'What does a **recurrence relation** define?',
    options: ['Each term from earlier terms', 'Each term directly from $n$', 'The sum of all the terms', 'Only the first term'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **recurrence relation** gives a rule for a term using the term or terms before it, such as $a_n = a_{n-1} + 3$. Together with a starting value, it fixes the whole sequence.',
      whyWrong: [
        null,
        'This describes a direct formula such as $a_n = 3n + 1$, which does not need the earlier terms.',
        'A recurrence builds the terms one by one. Adding them up is a separate calculation.',
        'The first term is the starting value, which is given separately from the rule.',
      ],
      keyIdea: 'A recurrence relation gives each term from the term or terms before it.',
    },
  },
  {
    id: 'recurrence-relations-022',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'How many starting values does a second-order recurrence such as $a_n = a_{n-1} + a_{n-2}$ need?',
    options: ['$2$', '$1$', '$3$', '$0$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Second-order** means each term uses the **two** terms before it, $a_{n-1}$ and $a_{n-2}$.\n\n' +
        'To compute the first new term you must already know two terms, so it needs $2$ starting values.',
      whyWrong: [
        null,
        'One value is enough for a first-order rule such as $a_n = 2a_{n-1}$. Here the rule looks two terms back.',
        'The rule only looks back two terms, so a third starting value is not needed: it would be worked out by the rule.',
        'Without starting values the rule has nothing to work from, so no term can be computed.',
      ],
      keyIdea: 'A rule that looks back $k$ terms needs $k$ starting values.',
    },
  },
  {
    id: 'recurrence-relations-023',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'The Fibonacci sequence begins $1, 1, 2, 3, 5, 8, \\dots$ What is the next term?',
    options: ['$13$', '$11$', '$16$', '$40$'],
    correctIndex: 0,
    markScheme: {
      solution: 'Each term is the sum of the two terms before it, so the next term is $5 + 8 = 13$.',
      whyWrong: [
        null,
        'This repeats the last gap, $8 + 3 = 11$. The rule adds the two previous terms, not a fixed gap.',
        'This doubles the last term. The rule adds the term before it, which is 5, not 8 again.',
        'This multiplies the last two terms, $5 \\times 8 = 40$. The rule adds them.',
      ],
      keyIdea: 'In the Fibonacci sequence each term is the sum of the two terms before it.',
    },
    check: { optionValues: [13, 11, 16, 40], compute: () => twoTerm(1, 1, 7, (p, q) => p + q) },
  },
  {
    id: 'recurrence-relations-024',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    stem: 'A sequence is defined by $a_1 = 5$ and $a_n = a_{n-1} - 2$ for $n \\ge 2$. What is $a_3$?',
    options: ['$1$', '$3$', '$-1$', '$9$'],
    correctIndex: 0,
    markScheme: {
      solution: 'Subtract 2 at each step: $a_2 = 5 - 2 = 3$ and $a_3 = 3 - 2 = 1$.',
      whyWrong: [
        null,
        'This is $a_2$: the working stopped one step early.',
        'This is $a_4$: one step too many. From $a_1$ to $a_3$ takes two steps.',
        'This adds 2 at each step instead of subtracting it.',
      ],
      keyIdea: 'From $a_1$ to $a_3$ you apply the rule twice.',
    },
    check: { optionValues: [1, 3, -1, 9], compute: () => iterate(5, 2, (p) => p - 2) },
  },

  // ================================================================ exam
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
    id: 'recurrence-relations-011',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $H_1 = 1$ and $H_n = 2H_{n-1} + 1$ for $n \\ge 2$. What is $H_6$?',
    options: ['$64$', '$32$', '$31$', '$63$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Apply the rule step by step:\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $H_n$ | 1 | 3 | 7 | 15 | 31 | 63 |\n\n' +
        'For example $H_2 = 2 \\times 1 + 1 = 3$ and $H_6 = 2 \\times 31 + 1 = 63$.',
      whyWrong: [
        'This is $H_6 + 1$: it adds 1 once more after the last step.',
        'This ignores the $+1$ in the rule and just doubles: $1, 2, 4, 8, 16, 32$.',
        'This is $H_5$: one step short.',
        null,
      ],
      keyIdea: 'Apply the rule one step at a time: double, then add 1, counting from $H_1$.',
    },
    check: { optionValues: [64, 32, 31, 63], compute: () => iterate(1, 5, (p) => 2 * p + 1) },
  },
  {
    id: 'recurrence-relations-012',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $B_0 = 10000$ and $B_n = 1.1B_{n-1} - 2000$ for $n \\ge 1$. What is $B_3$?',
    options: ['$6028$', '$7000$', '$6690$', '$7900$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'At each step multiply by 1.1, then subtract 2000.\n\n' +
        '- $B_1 = 1.1 \\times 10000 - 2000 = 11000 - 2000 = 9000$\n' +
        '- $B_2 = 1.1 \\times 9000 - 2000 = 9900 - 2000 = 7900$\n' +
        '- $B_3 = 1.1 \\times 7900 - 2000 = 8690 - 2000 = 6690$',
      whyWrong: [
        'This subtracts 2000 **before** multiplying, i.e. uses $1.1(B_{n-1} - 2000)$: $8800, 7480, 6028$. The rule multiplies first.',
        'This adds 10% of $B_0$ at every step ($3 \\times 1000$ added, $3 \\times 2000$ taken away). The 1.1 applies to the **current** term.',
        null,
        'This is $B_2$: one step short.',
      ],
      keyIdea: 'Apply a "multiply, then subtract" rule in the order written, using the current term each time.',
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
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: 'function f(n)\n   if n <= 1\n      return n\n   end if\n   return f(n - 1) + 2 * f(n - 2)\nend function\nprint(f(6))',
    },
    options: ['8', '11', '70', '21'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The function defines the recurrence $f(n) = f(n-1) + 2f(n-2)$ with base cases $f(0) = 0$ and $f(1) = 1$ (because `return n` runs when `n <= 1`). Build up from the bottom:\n\n' +
        '| $n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $f(n)$ | 0 | 1 | 1 | 3 | 5 | 11 | 21 |\n\n' +
        '- $f(2) = 1 + 2 \\times 0 = 1$\n' +
        '- $f(3) = 1 + 2 \\times 1 = 3$\n' +
        '- $f(4) = 3 + 2 \\times 1 = 5$\n' +
        '- $f(5) = 5 + 2 \\times 3 = 11$\n' +
        '- $f(6) = 11 + 2 \\times 5 = 21$\n\n' +
        'It prints **21**.',
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
  },
  {
    id: 'recurrence-relations-015',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
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
    id: 'recurrence-relations-025',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $a_1 = 1$ and $a_n = 2a_{n-1} + 3$ for $n \\ge 2$. What are its first four terms?',
    options: ['$1, 5, 13, 29$', '$1, 8, 22, 50$', '$5, 13, 29, 61$', '$1, 4, 7, 10$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Start at $a_1 = 1$. At each step double, then add 3.\n\n' +
        '- $a_2 = 2 \\times 1 + 3 = 5$\n' +
        '- $a_3 = 2 \\times 5 + 3 = 13$\n' +
        '- $a_4 = 2 \\times 13 + 3 = 29$',
      whyWrong: [
        null,
        'This adds 3 **before** doubling, i.e. uses $2(a_{n-1} + 3)$. The rule doubles first.',
        'This starts at $a_2$ and leaves out the first term, $a_1 = 1$.',
        'This only adds 3 and forgets to double.',
      ],
      keyIdea: 'The first term is given; each later term comes from applying the rule to the one before.',
    },
    check: {
      optionValues: ['1,5,13,29', '1,8,22,50', '5,13,29,61', '1,4,7,10'],
      compute: () => [0, 1, 2, 3].map((k) => iterate(1, k, (p) => 2 * p + 3)).join(','),
    },
  },
  {
    id: 'recurrence-relations-026',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $a_1 = 1$, $a_2 = 3$ and $a_n = 3a_{n-1} - 2a_{n-2}$ for $n \\ge 3$. What is $a_4$?',
    options: ['$15$', '$7$', '$31$', '$-3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each new term uses the two terms before it.\n\n' +
        '- $a_3 = 3a_2 - 2a_1 = 9 - 2 = 7$\n' +
        '- $a_4 = 3a_3 - 2a_2 = 21 - 6 = 15$',
      whyWrong: [
        null,
        'This is $a_3$: one step short.',
        'This is $a_5 = 3 \\times 15 - 2 \\times 7$: one step too many.',
        'This swaps the coefficients, using $2a_{n-1} - 3a_{n-2}$: $a_3 = 3$ and $a_4 = -3$. The 3 goes with the previous term.',
      ],
      keyIdea: 'In a two-term recurrence, $a_{n-1}$ is one term back and $a_{n-2}$ is two terms back.',
    },
    check: { optionValues: [15, 7, 31, -3], compute: () => twoTerm(1, 3, 4, (p, q) => 3 * p - 2 * q) },
  },
  {
    id: 'recurrence-relations-027',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'A sequence is defined by $a_1 = 1$ and $a_n = a_{n-1} + n$ for $n \\ge 2$. What is $a_5$?',
    options: ['$15$', '$10$', '$21$', '$9$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The amount added changes with $n$.\n\n' +
        '- $a_2 = 1 + 2 = 3$\n' +
        '- $a_3 = 3 + 3 = 6$\n' +
        '- $a_4 = 6 + 4 = 10$\n' +
        '- $a_5 = 10 + 5 = 15$',
      whyWrong: [
        null,
        'This is $a_4$: one step short.',
        'This is $a_6 = 15 + 6$: one step too many.',
        'This adds 2 at every step, using $n = 2$ throughout. The value of $n$ goes up by 1 at each step.',
      ],
      keyIdea: 'When the rule contains $n$, use the index of the term being worked out at each step.',
    },
    check: { optionValues: [15, 10, 21, 9], compute: () => iterate(1, 4, (p, n) => p + n) },
  },
  {
    id: 'recurrence-relations-028',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'Which recurrence (for $n \\ge 2$, with $a_1 = 5$) generates the terms $5, 8, 14, 26$?',
    options: ['$a_n = 2a_{n-1} - 2$', '$a_n = a_{n-1} + 3$', '$a_n = 3a_{n-1} - 7$', '$a_n = 2a_{n-1} + 2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Test each rule on every pair of neighbouring terms.\n\n' +
        '- $a_n = 2a_{n-1} - 2$: $5 \\to 8$, $8 \\to 14$, $14 \\to 26$. All work.\n' +
        '- $a_n = a_{n-1} + 3$: $5 \\to 8$ works, but $8 \\to 11$, not 14.\n' +
        '- $a_n = 3a_{n-1} - 7$: $5 \\to 8$ works, but $8 \\to 17$, not 14.\n' +
        '- $a_n = 2a_{n-1} + 2$: $5 \\to 12$, not 8.',
      whyWrong: [
        null,
        'This fits only the first step. The gaps are $3, 6, 12$, so they are not constant.',
        'This fits only the first step: $3 \\times 8 - 7 = 17$, not 14.',
        'This has the sign wrong: $2 \\times 5 + 2 = 12$, not 8.',
      ],
      keyIdea: 'A rule must fit every consecutive pair of terms, not only the first.',
    },
    check: {
      optionValues: ['2a-2', 'a+3', '3a-7', '2a+2'],
      compute: () => {
        const seq = [5, 8, 14, 26];
        const rules: [string, (p: number) => number][] = [
          ['2a-2', (p) => 2 * p - 2],
          ['a+3', (p) => p + 3],
          ['3a-7', (p) => 3 * p - 7],
          ['2a+2', (p) => 2 * p + 2],
        ];
        const ok = rules.filter(([, f]) => seq.slice(1).every((t, i) => f(seq[i]) === t));
        return ok.length === 1 ? ok[0][0] : 'none or many';
      },
    },
  },
  {
    id: 'recurrence-relations-029',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: 'a = 3\nfor i = 1 to 4\n   a = 2 * a - 1\nend for\nprint(a)',
    },
    options: ['33', '17', '65', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop applies the rule $a_n = 2a_{n-1} - 1$ exactly 4 times, starting from 3.\n\n' +
        '| `i` | `a` |\n' +
        '| --- | --- |\n' +
        '| 1 | 5 |\n' +
        '| 2 | 9 |\n' +
        '| 3 | 17 |\n' +
        '| 4 | 33 |\n\n' +
        'It prints **33**.',
      whyWrong: [
        null,
        'This is the value after 3 passes. `for i = 1 to 4` includes $i = 4$, so there are 4 passes.',
        'This is the value after 5 passes. The loop stops after $i = 4$.',
        'A `for` loop runs a fixed number of times, here 4, so it always stops.',
      ],
      keyIdea: 'A loop that repeats `a = 2 * a - 1` computes the terms of a recurrence, and `for i = 1 to n` runs exactly $n$ times.',
    },
    check: {
      optionValues: [33, 17, 65, 'Infinite loop'],
      compute: () => {
        let a = 3;
        for (let i = 1; i <= 4; i++) a = 2 * a - 1;
        return a;
      },
    },
  },
];
