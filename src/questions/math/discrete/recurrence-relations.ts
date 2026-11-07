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
      asking: 'Starting at 4 and adding 3 each time, what is the 5th term?',
      solution:
        'A **sequence** is a list of numbers, and $a_n$ means the term in position $n$. So $a_1$ is the first term and $a_5$ is the fifth.\n\n' +
        'The rule $a_n = a_{n-1} + 3$ says each term is the previous term plus 3. Here $a_{n-1}$ means the term just before $a_n$.\n\n' +
        'Start from $a_1 = 4$ and apply the rule once per step:\n\n| Term | Working | Value |\n|---|---|---|\n| $a_2$ | $4 + 3$ | 7 |\n| $a_3$ | $7 + 3$ | 10 |\n| $a_4$ | $10 + 3$ | 13 |\n| $a_5$ | $13 + 3$ | 16 |',
      conclusion: 'Going from $a_1$ to $a_5$ takes four additions of 3, which gives $16$.',
      whyWrong: [
        'This adds 3 five times ($4 + 5 \\times 3$). Going from $a_1$ to $a_5$ takes only **four** steps, so 3 is added four times.',
        'This is $a_4$: the working stopped one step too early.',
        null,
        'This multiplies by 3 each time ($4 \\times 3^4$), treating the rule as $a_n = 3a_{n-1}$. The rule says **add** 3.',
      ],
      keyIdea: 'For a recurrence, make a table with one row per term, starting from the given value. Work out each row from the row above until you reach the term you want. Steps needed $=$ target position $-$ starting position.',
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
      asking: 'Starting at 2 and multiplying by 3 each time, what is $a_4$?',
      solution:
        '$a_n$ means the term in position $n$, and $a_{n-1}$ means the term before it. The rule $a_n = 3a_{n-1}$ says each term is 3 times the previous one.\n\n' +
        'This sequence starts at position 0, with $a_0 = 2$. So reaching $a_4$ takes 4 steps.\n\n' +
        'Apply the rule once per step:\n\n| Term | Working | Value |\n|---|---|---|\n| $a_1$ | $3 \\times 2$ | 6 |\n| $a_2$ | $3 \\times 6$ | 18 |\n| $a_3$ | $3 \\times 18$ | 54 |\n| $a_4$ | $3 \\times 54$ | 162 |',
      conclusion: 'Four multiplications by 3, starting at 2, give $2 \\times 3^4$, which is $162$.',
      whyWrong: [
        'This is $a_3$: it assumes the sequence starts at $a_1$, so it only multiplies by 3 three times. Starting from $a_0$ there are four steps to $a_4$.',
        null,
        'This is $a_5$: one multiplication too many.',
        'This adds 3 four times ($2 + 4 \\times 3$), treating the rule as $a_n = a_{n-1} + 3$ instead of multiplying by 3.',
      ],
      keyIdea: 'Check whether the sequence starts at $a_0$ or $a_1$, as this changes the number of steps. If each term is a fixed number $r$ times the last, then $a_n = a_0 \\times r^n$ gives a quick check.',
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
      asking: 'What is the 8th Fibonacci number?',
      solution:
        '$F_n$ means the term in position $n$. The rule $F_n = F_{n-1} + F_{n-2}$ says each term is the sum of the two terms just before it.\n\n' +
        'We are given $F_1 = 1$ and $F_2 = 1$. Build the rest one at a time:\n\n| Term | Working | Value |\n|---|---|---|\n| $F_3$ | $1 + 1$ | 2 |\n| $F_4$ | $2 + 1$ | 3 |\n| $F_5$ | $3 + 2$ | 5 |\n| $F_6$ | $5 + 3$ | 8 |\n| $F_7$ | $8 + 5$ | 13 |\n| $F_8$ | $13 + 8$ | 21 |',
      conclusion: 'Adding the two previous terms each time reaches position 8 at $21$.',
      whyWrong: [
        'This is $F_7$: one term short. Writing the terms in a table with their index numbers avoids losing count.',
        'This is $F_9 = 21 + 13$: one term too far.',
        'This doubles each term ($1, 1, 2, 4, 8, \\dots$), which is $F_n = 2F_{n-1}$. The rule adds the two previous terms $F_{n-1}$ and $F_{n-2}$; it does not add the last term to itself.',
        null,
      ],
      keyIdea: 'For a rule that looks back two terms, write a table with the position beside each value, and keep the last two values in view. Numbering each term stops you losing your place.',
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
      asking: 'Which rule turns each term into the next for the whole list?',
      solution:
        'A **recurrence relation** is a rule that makes each term from the previous one. Here $a_{n-1}$ is the previous term and $a_n$ is the new term. The rule must work for every step, not just one.\n\n' +
        'Look at the gaps: 4, 8, 16, 32. They double each time, so the rule must multiply by 2 somewhere. A fixed amount added each time would give equal gaps.\n\n' +
        'Test each rule by putting in the previous term and comparing with the next one:\n\n| Rule | From 3 | From 7 | Fits? |\n|---|---|---|---|\n| $a_{n-1} + 4$ | 7 | 11, not 15 | No |\n| $3a_{n-1} - 2$ | 7 | 19, not 15 | No |\n| $2a_{n-1} - 1$ | 5, not 7 | 13, not 15 | No |\n| $2a_{n-1} + 1$ | 7 | 15 | Yes |',
      conclusion: 'It also gives $2 \\times 15 + 1 = 31$ and $2 \\times 31 + 1 = 63$, so it fits every term. The rule is $a_n = 2a_{n-1} + 1$.',
      whyWrong: [
        'This only fits the first step ($7 - 3 = 4$). The gaps are $4, 8, 16, 32$, which are not constant, so the sequence is not arithmetic.',
        'This fits $3 \\to 7$ but gives $3 \\times 7 - 2 = 19$ for the third term, not 15. A rule must fit every step.',
        null,
        'This has the sign wrong: $2 \\times 3 - 1 = 5$, not 7.',
      ],
      keyIdea: 'To match a rule to a list, put the first term into each option and see if it gives the second term. Test the survivors on the next pair too, because a wrong rule can fit a single step.',
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
      asking: 'Starting at 2, tripling and then subtracting 1 each time, what is $a_4$?',
      solution:
        'The rule $a_n = 3a_{n-1} - 1$ says: take the previous term, multiply by 3, then subtract 1. Multiply first, as in ordinary maths.\n\n' +
        'Start at $a_1 = 2$ and apply the rule once per step:\n\n| Term | Working | Value |\n|---|---|---|\n| $a_2$ | $3 \\times 2 - 1$ | 5 |\n| $a_3$ | $3 \\times 5 - 1$ | 14 |\n| $a_4$ | $3 \\times 14 - 1$ | 41 |',
      conclusion: 'Three uses of the rule take 2 to 5, then 14, and finally $41$.',
      whyWrong: [
        null,
        'This is $a_3$: the working stopped one step early.',
        'This is $a_5 = 3 \\times 41 - 1$: one step too many.',
        'This subtracts 1 **before** multiplying, i.e. uses $3(a_{n-1} - 1)$: $3 \\times 1 = 3$, $3 \\times 2 = 6$, $3 \\times 5 = 15$. Order of operations: multiply first.',
      ],
      keyIdea: 'When a rule has two operations, write the full calculation in each row of a table, and multiply before adding or subtracting. Steps needed $=$ target position $-$ starting position.',
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
      asking: 'What does a recurrence relation tell you?',
      solution:
        'The word "recur" means to come back. A **recurrence relation** is a rule that goes back to earlier terms to make the next one.\n\n' +
        'For example, $a_n = a_{n-1} + 3$ says each term is the previous one plus 3. Starting from 1, it gives 1, 4, 7, 10. You can\'t find a term without the one before it.',
      conclusion: 'The rule builds every new term out of the terms before it, so it defines: Each term from earlier terms.',
      whyWrong: [
        null,
        'This describes a direct formula such as $a_n = 3n + 1$, which does not need the earlier terms.',
        'A recurrence builds the terms one by one. Adding them up is a separate calculation.',
        'The first term is the starting value, which is given separately from the rule.',
      ],
      keyIdea: 'Look at the right-hand side of the rule. If it mentions an earlier term such as $a_{n-1}$, it is a recurrence. If it uses only $n$, such as $a_n = 3n + 1$, it is a direct formula.',
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
      asking: 'How many first terms must be given before this rule can start?',
      solution:
        'To make $a_n$, the rule needs two earlier terms: $a_{n-1}$ (one back) and $a_{n-2}$ (two back). "Second-order" means it looks back two terms.\n\n' +
        'With only $a_1$ we can\'t make $a_2$, because that would need a term before $a_1$. Once $a_1$ and $a_2$ are both given, the rule can make $a_3$ and then carry on by itself.',
      conclusion: 'The rule looks back two terms, so it needs $2$ starting values.',
      whyWrong: [
        null,
        'One value is enough for a first-order rule such as $a_n = 2a_{n-1}$. Here the rule looks two terms back.',
        'The rule only looks back two terms, so a third starting value is not needed: it would be worked out by the rule.',
        'Without starting values the rule has nothing to work from, so no term can be computed.',
      ],
      keyIdea: 'Count how far back the rule looks: the largest number subtracted from $n$ in the small numbers below the letter. That is how many starting values you need. A rule with $a_{n-3}$ needs 3.',
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
      asking: 'What number comes after 8 in this sequence?',
      solution:
        'In the Fibonacci sequence, each term is the sum of the two terms just before it. Check this on the list: $1 + 1 = 2$, $1 + 2 = 3$, $2 + 3 = 5$, $3 + 5 = 8$.\n\n' +
        'The last two terms are 5 and 8, so the next term is $5 + 8 = 13$.',
      conclusion: 'The next term is the sum of the last two, so it is $13$.',
      whyWrong: [
        null,
        'This repeats the last gap, $8 + 3 = 11$. The rule adds the two previous terms, not a fixed gap.',
        'This doubles the last term. The rule adds the term before it, which is 5, not 8 again.',
        'This multiplies the last two terms, $5 \\times 8 = 40$. The rule adds them.',
      ],
      keyIdea: 'Test a list for the Fibonacci rule by adding each pair of neighbours and comparing with the next term. If the sums match, continue the pattern using the last two terms.',
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
      asking: 'Starting at 5 and taking off 2 each time, what is $a_3$?',
      solution:
        'The rule $a_n = a_{n-1} - 2$ says each term is the previous term minus 2. $a_1$ is the first term and $a_3$ is the third.\n\n' +
        'Find the second term: $a_2 = a_1 - 2 = 5 - 2 = 3$.\n\n' +
        'Find the third term: $a_3 = a_2 - 2 = 3 - 2 = 1$.',
      conclusion: 'Two subtractions of 2 take 5 down to $1$.',
      whyWrong: [
        null,
        'This is $a_2$: the working stopped one step early.',
        'This is $a_4$: one step too many. From $a_1$ to $a_3$ takes two steps.',
        'This adds 2 at each step instead of subtracting it.',
      ],
      keyIdea: 'Apply the rule one term at a time and write each term\'s position beside it. Going from $a_1$ to $a_k$ takes $k - 1$ steps, so stop as soon as you reach the position asked for.',
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
      asking: 'Using the two starting terms and the rule, what is the fifth term?',
      solution:
        '$a_{n-1}$ is the term just before $a_n$, and $a_{n-2}$ is the one two places back. So the rule says: take the previous term and add double the term before that.\n\n' +
        'We are given $a_1 = 2$ and $a_2 = 5$. Build the rest, always doubling the term two places back:\n\n| Term | Rule at this position | Working | Value |\n|---|---|---|---|\n| $a_3$ | $a_2 + 2a_1$ | $5 + 2 \\times 2$ | 9 |\n| $a_4$ | $a_3 + 2a_2$ | $9 + 2 \\times 5$ | 19 |\n| $a_5$ | $a_4 + 2a_3$ | $19 + 2 \\times 9$ | 37 |',
      conclusion: 'Three uses of the rule give 9, then 19, then $37$.',
      whyWrong: [
        'This is $a_4$: one step short.',
        'This doubles the wrong term, using $a_n = 2a_{n-1} + a_{n-2}$: $12, 29, 70$. The 2 multiplies $a_{n-2}$, the term two places back.',
        null,
        'This is $a_6 = 37 + 2 \\times 19$: one step too many.',
      ],
      keyIdea: 'For a rule looking back two terms, write the rule with the actual positions in each row (such as $a_4 = a_3 + 2a_2$) before substituting. This keeps the multiplier on the correct term.',
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
      asking: 'Starting at 1, doubling and adding 1 each time, what is $H_6$?',
      solution:
        '$H_n$ is just the term in position $n$. The rule says: take the previous term, double it, then add 1.\n\n' +
        'Start at $H_1 = 1$ and apply the rule once per step:\n\n| Term | Working | Value |\n|---|---|---|\n| $H_2$ | $2 \\times 1 + 1$ | 3 |\n| $H_3$ | $2 \\times 3 + 1$ | 7 |\n| $H_4$ | $2 \\times 7 + 1$ | 15 |\n| $H_5$ | $2 \\times 15 + 1$ | 31 |\n| $H_6$ | $2 \\times 31 + 1$ | 63 |',
      conclusion: 'Each term is one less than a power of 2, and $H_6 = 2^6 - 1$, which is $63$.',
      whyWrong: [
        'This is $H_6 + 1$: it adds 1 once more after the last step.',
        'This ignores the $+1$ in the rule and just doubles: $1, 2, 4, 8, 16, 32$.',
        'This is $H_5$: one step short.',
        null,
      ],
      keyIdea: 'Work the table row by row, then look for a pattern. Here 1, 3, 7, 15 are each one below a power of 2, so $H_n = 2^n - 1$, which gives a fast check.',
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
      asking: 'What is the value after multiplying by 1.1 and subtracting 2000, three times over, starting from 10000?',
      solution:
        '$B_n$ is the term in position $n$, and this sequence starts at position 0. The rule says: multiply the previous term by 1.1, then subtract 2000. Multiply first.\n\n' +
        'Think of a balance that grows by 10% and then has 2000 taken out. Reaching $B_3$ takes three rounds:\n\n| Term | Multiply by 1.1 | Subtract 2000 |\n|---|---|---|\n| $B_1$ | $1.1 \\times 10000 = 11000$ | 9000 |\n| $B_2$ | $1.1 \\times 9000 = 9900$ | 7900 |\n| $B_3$ | $1.1 \\times 7900 = 8690$ | 6690 |',
      conclusion: 'After three rounds, the value has fallen from 10000 to $6690$.',
      whyWrong: [
        'This subtracts 2000 **before** multiplying, i.e. uses $1.1(B_{n-1} - 2000)$: $8800, 7480, 6028$. The rule multiplies first.',
        'This adds 10% of $B_0$ at every step ($3 \\times 1000$ added, $3 \\times 2000$ taken away). The 1.1 applies to the **current** term.',
        null,
        'This is $B_2$: one step short.',
      ],
      keyIdea: 'For a "grow then pay" rule, use a table with one column for each operation, and multiply before subtracting. Always apply the percentage to the current value, not the starting value.',
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
      asking: 'What value does the function `f` give back when it is called with 6?',
      solution:
        '`f` calls itself, which is called **recursion**. Line 2 is the stopping case: when `n` is 1 or less, line 3 returns `n` itself. So `f(0)` is 0 and `f(1)` is 1.\n\n' +
        'For larger `n`, line 5 returns `f(n - 1) + 2 * f(n - 2)`: the previous result plus double the one before that.\n\n' +
        'Starting from `f(6)` would repeat many calls. It is easier to work upwards from the bottom, because each row only needs the two rows above it:\n\n| `n` | Working | `f(n)` |\n|---|---|---|\n| 0 | line 3 | 0 |\n| 1 | line 3 | 1 |\n| 2 | $1 + 2 \\times 0$ | 1 |\n| 3 | $1 + 2 \\times 1$ | 3 |\n| 4 | $3 + 2 \\times 1$ | 5 |\n| 5 | $5 + 2 \\times 3$ | 11 |\n| 6 | $11 + 2 \\times 5$ | 21 |',
      conclusion: '`f(6)` returns 21, and line 7 prints that value, so the answer is 21.',
      whyWrong: [
        'This ignores the `2 *` and computes the ordinary Fibonacci number $f(6) = f(5) + f(4)$, which is 8.',
        'This is $f(5)$: one level short.',
        'This puts the 2 on the wrong term, computing $2f(n-1) + f(n-2)$: $0, 1, 2, 5, 12, 29, 70$.',
        null,
      ],
      keyIdea: 'For a recursive function, write the stopping values first, then fill a table upwards from small `n`. Each row uses only earlier rows, so you avoid tracing a huge tree of calls.',
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
      asking: 'Working backwards from $a_4 = 61$, what is $a_1$?',
      solution:
        'The rule goes forwards: double the previous term, then add 3. We know a later term and want an earlier one, so we need to undo the rule.\n\n' +
        'Undo the operations in reverse order. The last thing done was adding 3, so subtract 3 first. Then undo the doubling by halving. So the previous term is $a_{n-1} = \\frac{a_n - 3}{2}$.\n\n' +
        'Go back three steps, from $a_4$ to $a_1$:\n\n| Term | Working | Value |\n|---|---|---|\n| $a_3$ | $\\frac{61 - 3}{2} = \\frac{58}{2}$ | 29 |\n| $a_2$ | $\\frac{29 - 3}{2} = \\frac{26}{2}$ | 13 |\n| $a_1$ | $\\frac{13 - 3}{2} = \\frac{10}{2}$ | 5 |',
      conclusion: 'Going forwards from 5, the rule gives 13, 29 and 61, which matches. So $a_1$ is $5$.',
      whyWrong: [
        'This is $a_2$: it stops after two backward steps instead of three.',
        null,
        'This is $a_0 = \\frac{5 - 3}{2}$: one backward step too many.',
        'This undoes the operations in the wrong order (halving first, then subtracting 3): $61 \\div 2 - 3 = 27.5$, and so on. To reverse "double then add 3" you must subtract 3 first, then halve.',
      ],
      keyIdea: 'To run a recurrence backwards, rearrange the rule to give the earlier term, undoing the last operation first. Then check your result by running forwards to the given term.',
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
      asking: 'Which list shows the first four terms this rule makes?',
      solution:
        'The first term is given: $a_1 = 1$. It belongs in the list, so the list starts with 1.\n\n' +
        'The rule says: double the previous term, then add 3. Double first, because multiplying comes before adding.\n\n' +
        'Find the next three terms:\n\n| Term | Working | Value |\n|---|---|---|\n| $a_2$ | $2 \\times 1 + 3$ | 5 |\n| $a_3$ | $2 \\times 5 + 3$ | 13 |\n| $a_4$ | $2 \\times 13 + 3$ | 29 |',
      conclusion: 'With the starting term first, then each new term in order, the list is $1, 5, 13, 29$.',
      whyWrong: [
        null,
        'This adds 3 **before** doubling, i.e. uses $2(a_{n-1} + 3)$. The rule doubles first.',
        'This starts at $a_2$ and leaves out the first term, $a_1 = 1$.',
        'This only adds 3 and forgets to double.',
      ],
      keyIdea: 'For "first few terms", write down the given start first, then apply the rule one term at a time. When comparing lists, the first entry and the first step usually rule out most wrong options.',
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
      asking: 'Using the two starting terms and the rule, what is the fourth term?',
      solution:
        '$a_{n-1}$ is the term just before $a_n$, and $a_{n-2}$ is two places back. The rule says: 3 times the previous term, minus 2 times the one before that. Multiply before subtracting.\n\n' +
        'Find $a_3$ by putting $n = 3$: $a_3 = 3a_2 - 2a_1 = 3 \\times 3 - 2 \\times 1 = 9 - 2 = 7$.\n\n' +
        'Find $a_4$ by putting $n = 4$: $a_4 = 3a_3 - 2a_2 = 3 \\times 7 - 2 \\times 3 = 21 - 6 = 15$.',
      conclusion: 'Using $a_3 = 7$ and $a_2 = 3$ in the rule, the fourth term is $15$.',
      whyWrong: [
        null,
        'This is $a_3$: one step short.',
        'This is $a_5 = 3 \\times 15 - 2 \\times 7$: one step too many.',
        'This swaps the coefficients, using $2a_{n-1} - 3a_{n-2}$: $a_3 = 3$ and $a_4 = -3$. The 3 goes with the previous term.',
      ],
      keyIdea: 'For a rule that looks back two terms, write it out with the actual positions before you substitute, and build one term at a time. Each new term needs the two terms before it, so keep them all written down.',
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
      asking: 'Adding the position number each time, what is the fifth term?',
      solution:
        'This rule adds $n$, the position of the term being made, so the amount added changes each time. For $a_2$ we add 2, for $a_3$ we add 3, and so on.\n\n' +
        'Start at $a_1 = 1$ and apply the rule once per step:\n\n| Term | Working | Value |\n|---|---|---|\n| $a_2$ | $1 + 2$ | 3 |\n| $a_3$ | $3 + 3$ | 6 |\n| $a_4$ | $6 + 4$ | 10 |\n| $a_5$ | $10 + 5$ | 15 |',
      conclusion: 'The terms add up the numbers 1 to 5, and $1 + 2 + 3 + 4 + 5$ is $15$.',
      whyWrong: [
        null,
        'This is $a_4$: one step short.',
        'This is $a_6 = 15 + 6$: one step too many.',
        'This adds 2 at every step, using $n = 2$ throughout. The value of $n$ goes up by 1 at each step.',
      ],
      keyIdea: 'If the rule contains $n$ itself, write the value of $n$ in each row. A rule that adds $n$ each time, starting from 1, gives the sum of 1 to $n$, which equals $\\frac{n(n+1)}{2}$, so you can check your table.',
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
      asking: 'Which rule turns 5 into 8, 8 into 14, and 14 into 26?',
      solution:
        'The rule must work on every step. In each rule, $a_{n-1}$ is the previous term and $a_n$ is the new one.\n\n' +
        'Look at the gaps: 3, 6, 12. They double each time, which suggests the rule multiplies the previous term by 2.\n\n' +
        'Test each rule on all three steps:\n\n| Rule | From 5 | From 8 | From 14 | Fits? |\n|---|---|---|---|---|\n| $a_{n-1} + 3$ | 8 | 11 | 17 | No |\n| $3a_{n-1} - 7$ | 8 | 17 | 35 | No |\n| $2a_{n-1} + 2$ | 12 | 18 | 30 | No |\n| $2a_{n-1} - 2$ | 8 | 14 | 26 | Yes |',
      conclusion: 'Only one rule gives 8, 14 and 26, so the answer is $a_n = 2a_{n-1} - 2$.',
      whyWrong: [
        null,
        'This fits only the first step. The gaps are $3, 6, 12$, so they are not constant.',
        'This fits only the first step: $3 \\times 8 - 7 = 17$, not 14.',
        'This has the sign wrong: $2 \\times 5 + 2 = 12$, not 8.',
      ],
      keyIdea: 'To match a rule, put each term into each option and compare with the next term. If the gaps double, the multiplier is 2. If the gaps are constant, the rule just adds that number.',
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
      asking: 'What is `a` after the loop has run all its passes?',
      solution:
        '`for i = 1 to 4` runs line 3 four times, with `i` = 1, 2, 3, 4. `i` isn\'t used in the calculation: it only counts the passes.\n\n' +
        'Line 3 replaces `a` with double the old value, minus 1. Trace it, starting from `a = 3`:\n\n| Pass | `i` | `2 * a - 1` | `a` becomes |\n|---|---|---|---|\n| 1 | 1 | $2 \\times 3 - 1$ | 5 |\n| 2 | 2 | $2 \\times 5 - 1$ | 9 |\n| 3 | 3 | $2 \\times 9 - 1$ | 17 |\n| 4 | 4 | $2 \\times 17 - 1$ | 33 |\n\n' +
        'The loop ends after pass 4, and line 5 prints `a`, which holds 33.',
      conclusion: 'Four passes take `a` through 5, 9, 17 and 33, so the answer is 33.',
      whyWrong: [
        null,
        'This is the value after 3 passes. `for i = 1 to 4` includes $i = 4$, so there are 4 passes.',
        'This is the value after 5 passes. The loop stops after $i = 4$.',
        'A `for` loop runs a fixed number of times, here 4, so it always stops.',
      ],
      keyIdea: 'A loop like `a = 2 * a - 1` is a recurrence written in code: each pass makes the next term. Count the passes from the `for` line, then trace with one row per pass.',
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
