import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { isPrime } from '../../../lib/mathx';

// ---------------------------------------------------------------- helpers used by the answer checks
/** Extend a polynomial sequence with the method of differences (keep differencing until constant). */
function extendByDifferences(terms: number[], extra: number): number[] {
  const rows: number[][] = [terms.slice()];
  while (rows[rows.length - 1].length > 1 && new Set(rows[rows.length - 1]).size > 1) {
    const r = rows[rows.length - 1];
    rows.push(r.slice(1).map((v, i) => v - r[i]));
  }
  for (let e = 0; e < extra; e++) {
    // the bottom row is constant: repeat its value, then add upwards
    const bottom = rows[rows.length - 1];
    bottom.push(bottom[bottom.length - 1]);
    for (let k = rows.length - 2; k >= 0; k--) {
      const r = rows[k];
      const below = rows[k + 1];
      r.push(r[r.length - 1] + below[below.length - 1]);
    }
  }
  return rows[0];
}

/** n-th term (1-based) of a polynomial sequence, by extending the difference table. */
const nthByDifferences = (terms: number[], n: number): number => extendByDifferences(terms, Math.max(0, n - terms.length))[n - 1];

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'number-sequences-001',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'What is the next term in the sequence $3, 10, 17, 24, \\dots$?',
    options: ['$27$', '$31$', '$38$', '$48$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which number comes after 24 in this list?',
      solution:
        'Each number in a sequence is called a **term**. Find the gap between neighbouring terms: $10 - 3 = 7$, $17 - 10 = 7$ and $24 - 17 = 7$.\n\n' +
        'The gap is always 7, so each term is the one before it plus 7.\n\n' +
        'Add 7 to the last term: $24 + 7 = 31$.',
      conclusion: 'The sequence goes up by 7 each time, so the next term is $31$.',
      whyWrong: [
        'This is $24 + 3$: it adds the **first term** (3) instead of the common difference (7).',
        null,
        'This is $24 + 14$: it adds two steps of 7 at once, which gives the term **after** the next one.',
        'This is $24 \\times 2$: it treats the sequence as doubling, but the terms go up by the same amount each time, not by the same factor.',
      ],
      keyIdea: 'Start by subtracting neighbouring terms. If the gap is the same each time, the sequence is **linear** (also called arithmetic), and you keep adding that gap.',
    },
    check: { optionValues: [27, 31, 38, 48], compute: () => nthByDifferences([3, 10, 17, 24], 5) },
  },
  {
    id: 'number-sequences-002',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'What is the next term in the sequence $2, 6, 18, 54, \\dots$?',
    options: ['$90$', '$108$', '$72$', '$162$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which number comes after 54 in this list?',
      solution:
        'Try subtracting neighbours: $6 - 2 = 4$, $18 - 6 = 12$ and $54 - 18 = 36$. The gaps are not equal, so this is not an adding pattern.\n\n' +
        'Try dividing neighbours: $6 \\div 2 = 3$, $18 \\div 6 = 3$ and $54 \\div 18 = 3$. Each term is 3 times the one before. This fixed multiplier is called the **common ratio**.\n\n' +
        'Multiply the last term by 3: $54 \\times 3 = 162$.',
      conclusion: 'Every term is multiplied by 3, so the next term is $162$.',
      whyWrong: [
        'This is $54 + 36$: it repeats the last difference (36) as if the sequence were linear. The differences themselves are being multiplied by 3.',
        'This is $54 \\times 2$: it multiplies by 2 instead of the common ratio 3.',
        'This is $54 + 18$: it adds the previous term, as in a Fibonacci-style rule, but $2 + 6 \\ne 18$, so that rule does not fit.',
        null,
      ],
      keyIdea: 'If the gaps keep growing, try dividing neighbouring terms. If the result is the same each time, the sequence is **geometric**: keep multiplying by that number, called the common ratio.',
    },
    check: {
      optionValues: [90, 108, 72, 162],
      compute: () => {
        const t = [2, 6, 18, 54];
        const r = t[1] / t[0];
        return t[t.length - 1] * r;
      },
    },
  },
  {
    id: 'number-sequences-003',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'What is the missing term in the sequence $1, 4, 9, \\square, 25, 36$?',
    options: ['$14$', '$17$', '$16$', '$18$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What number belongs in the empty place?',
      solution:
        'Write each known term with its position: position 1 is 1, position 2 is 4, position 3 is 9, position 5 is 25 and position 6 is 36.\n\n' +
        'Compare each term with its position: $1 = 1 \\times 1$, $4 = 2 \\times 2$, $9 = 3 \\times 3$, $25 = 5 \\times 5$ and $36 = 6 \\times 6$. These are the **square numbers**: a whole number times itself.\n\n' +
        'The missing term is in position 4, so it is $4 \\times 4 = 16$.',
      conclusion: 'Position 4 in the square numbers is $4 \\times 4$, so the missing term is $16$.',
      whyWrong: [
        'This is $9 + 5$: it repeats the previous difference (5). In the square numbers the differences go up by 2 each time ($3, 5, 7, 9, \\dots$).',
        'This is the number halfway between 9 and 25, $\\frac{9 + 25}{2} = 17$. That only works for a linear sequence, and this one is not linear.',
        null,
        'This is $9 \\times 2$: it doubles the previous term, but the terms are not growing by a fixed factor.',
      ],
      keyIdea: 'Know the special lists on sight: squares 1, 4, 9, 16, 25; cubes 1, 8, 27, 64; triangular numbers 1, 3, 6, 10, 15; primes 2, 3, 5, 7, 11. If a list looks familiar, compare each term with its position.',
    },
    check: {
      optionValues: [14, 17, 16, 18],
      compute: () => {
        const shown = [1, 4, 9, null, 25, 36];
        const missingPos = shown.indexOf(null) + 1;
        return missingPos * missingPos;
      },
    },
  },
  {
    id: 'number-sequences-004',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'The **triangular numbers** begin $1, 3, 6, 10, 15, \\dots$ What is the 8th triangular number?',
    options: ['$28$', '$64$', '$36$', '$72$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the eighth number in the triangular list?',
      solution:
        'Find the gaps: $3 - 1 = 2$, $6 - 3 = 3$, $10 - 6 = 4$ and $15 - 10 = 5$. The gap grows by 1 each time, because each triangular number adds one more row of dots to a triangle.\n\n' +
        'To reach position $n$, we add $n$ dots. Keep going from the 5th term, which is 15:\n\n| Term | Working | Value |\n|---|---|---|\n| 6th | $15 + 6$ | 21 |\n| 7th | $21 + 7$ | 28 |\n\n' +
        'The 8th term is $28 + 8 = 36$. The formula agrees: $\\frac{n(n+1)}{2}$ with $n = 8$ is $\\frac{8 \\times 9}{2} = 36$.',
      conclusion: 'Adding the growing gaps up to the 8th place gives $36$.',
      whyWrong: [
        'This is the **7th** triangular number: one step was missed when counting along the sequence.',
        'This is $8^2$, the 8th **square** number, not the 8th triangular number.',
        null,
        'This is $8 \\times 9$: it uses the formula $\\frac{n(n+1)}{2}$ but forgets to divide by 2.',
      ],
      keyIdea: 'The $n$th triangular number is $\\frac{n(n+1)}{2}$, where $n$ is the position. It is the total of $1 + 2 + \\dots + n$. For a small position, add the growing gaps instead. Do not confuse it with the $n$th square number, $n^2$.',
    },
    check: {
      optionValues: [28, 64, 36, 72],
      compute: () => {
        let t = 0;
        for (let i = 1; i <= 8; i++) t += i;
        return t;
      },
    },
  },
  {
    id: 'number-sequences-005',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'What is the next term in the sequence $2, 3, 5, 7, 11, 13, 17, 19, 23, \\dots$?',
    options: ['$25$', '$29$', '$27$', '$31$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which number comes after 23 in this list?',
      solution:
        'Look at what these numbers have in common. Each one can only be divided exactly by 1 and itself. For example, 13 can only be made as $1 \\times 13$. Numbers like that are called **prime numbers**.\n\n' +
        'So the next term is the next prime after 23. Test the numbers above it:\n\n| Number | Test | Prime? |\n|---|---|---|\n| 24 | even, so it divides by 2 | No |\n| 25 | $5 \\times 5$ | No |\n| 26 | even, so it divides by 2 | No |\n| 27 | $3 \\times 9$ | No |\n| 28 | even, so it divides by 2 | No |\n\n' +
        'Now try 29. It does not divide exactly by 2, 3 or 5. We can stop there, because $6 \\times 6 = 36$ is already above 29, so any larger factor would need a smaller partner that we have tested. So 29 is prime.',
      conclusion: 'The list is the primes in order, and the first prime after 23 is $29$.',
      whyWrong: [
        'This is the next odd number after 23, but $25 = 5 \\times 5$ is not prime.',
        null,
        'This is $23 + 4$, repeating the last gap ($19 \\to 23$). Gaps between primes are not constant, and $27 = 3 \\times 9$ is not prime anyway.',
        'This is the prime **after** the next one: 29 was skipped.',
      ],
      keyIdea: 'When the gaps jump about irregularly (1, 2, 2, 4, 2, 4), suspect primes. To test a number, try dividing by 2, 3, 5 and 7, and stop once the divisor squared is larger than your number.',
    },
    check: {
      optionValues: [25, 29, 27, 31],
      compute: () => {
        let k = 24;
        while (!isPrime(k)) k++;
        return k;
      },
    },
  },
  {
    id: 'number-sequences-006',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'In the sequence $2, 5, \\square, 12, 19, 31$, each term after the second is found by the same rule. What is the missing term?',
    options: ['$8$', '$7$', '$10$', '$8.5$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What number fills the gap, given that one rule builds every later term?',
      solution:
        'Start where three known terms sit side by side: 12, 19, 31. The gaps are $19 - 12 = 7$ and $31 - 19 = 12$.\n\n' +
        'The gap of 12 equals the term 12. That suggests each term is the sum of the two terms before it. Test it: $12 + 19 = 31$, which fits.\n\n' +
        'Use this rule to fill the gap: the third term is the first two added, so it is $2 + 5 = 7$. Test it on the later terms: $5 + 7 = 12$ and $7 + 12 = 19$, which both match.',
      conclusion: 'Each term is the sum of the two before it, so the missing term is $7$.',
      whyWrong: [
        'This is $5 + 3$: it assumes the sequence goes up by 3 each time (from $2 \\to 5$), but then the next term would be 11, not 12.',
        null,
        'This is $5 \\times 2$: it doubles the previous term, but then $10 \\to 12$ does not follow the same rule.',
        'This is halfway between 5 and 12, $\\frac{5 + 12}{2}$. A missing term is not simply the average of its neighbours unless the sequence is linear.',
      ],
      keyIdea: 'If a gap matches an earlier term, try the Fibonacci-style rule: each term is the sum of the two before it. Test it on every group of three neighbouring terms you can see, then use it to fill the gap.',
    },
    check: {
      optionValues: [8, 7, 10, 8.5],
      compute: () => {
        const t: (number | null)[] = [2, 5, null, 12, 19, 31];
        const filled = t.slice() as number[];
        filled[2] = filled[0] + filled[1];
        for (let i = 2; i < filled.length; i++) if (filled[i] !== filled[i - 1] + filled[i - 2]) throw new Error('rule fails');
        return filled[2];
      },
    },
  },

  // ================================================================ exam
  {
    id: 'number-sequences-007',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'Which expression gives the $n$th term of the sequence $5, 9, 13, 17, \\dots$?',
    options: ['$n + 4$', '$4n + 5$', '$5n + 4$', '$4n + 1$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which formula gives any term of this list from its position $n$?',
      solution:
        '$n$ is the position in the list: $n = 1$ for the first term, $n = 2$ for the second, and so on. The "$n$th term" is a formula that turns $n$ into the term.\n\n' +
        'The gap is $9 - 5 = 4$ every time. A sequence going up by 4 is linked to the 4 times table, so the formula starts with $4n$.\n\n' +
        '$4n$ gives 4, 8, 12, 16. Compare with 5, 9, 13, 17: every term is 1 more.\n\n' +
        'So we add 1 to $4n$, which gives $4n + 1$. Test it: $n = 1$ gives $4 \\times 1 + 1 = 5$, and $n = 2$ gives $4 \\times 2 + 1 = 9$. Both match the list.',
      conclusion: 'It has the right gap of 4 and the right starting value, so the expression is $4n + 1$.',
      whyWrong: [
        'This confuses "add 4 each time" with "add 4 to $n$". It gives $5, 6, 7, \\dots$, which goes up by 1, not 4.',
        'This uses the first term (5) as the constant. The constant is the first term **minus** the difference: $5 - 4 = 1$. This gives $9, 13, 17, \\dots$, one step ahead.',
        'This swaps the roles of the first term and the difference: it gives $9, 14, 19, \\dots$, which goes up by 5.',
        null,
      ],
      keyIdea: 'For a linear sequence, the $n$th term is (gap)$n$ + adjustment. Write the times table of the gap, then see how much you must add or subtract to match the sequence. Test by putting in $n = 1$.',
    },
    // each option evaluated at n = 10; compute finds the true 10th term
    check: { optionValues: [14, 45, 54, 41], compute: () => nthByDifferences([5, 9, 13, 17], 10) },
  },
  {
    id: 'number-sequences-008',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'What is the 50th term of the sequence $7, 10, 13, 16, \\dots$?',
    options: ['$157$', '$150$', '$154$', '$147$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the term in position 50 of this list?',
      solution:
        'The gap is $10 - 7 = 3$ every time, so we add 3 to move one place along.\n\n' +
        'Count the jumps from position 1 to position 50. There are $50 - 1 = 49$ jumps, not 50, because the first term is already there with no jump.\n\n' +
        'Those jumps add $49 \\times 3 = 147$ to the first term.\n\n' +
        'Start from the first term: $7 + 147 = 154$.',
      conclusion: 'Starting at 7 and making 49 jumps of 3 gives $154$.',
      whyWrong: [
        'This is $7 + 50 \\times 3$: it adds the difference 50 times instead of 49 (only 49 jumps are needed to go from term 1 to term 50).',
        'This is $3 \\times 50$: it uses $3n$ but forgets the constant $+4$.',
        null,
        'This is $49 \\times 3$: it counts the 49 jumps correctly but forgets to start from the first term, 7.',
      ],
      keyIdea: 'For a far-off term of a linear sequence, use $u_n = a + (n - 1)d$. Here $u_n$ is the term in position $n$, $a$ is the first term and $d$ is the gap. The number of jumps is $n - 1$.',
    },
    check: { optionValues: [157, 150, 154, 147], compute: () => nthByDifferences([7, 10, 13, 16], 50) },
  },
  {
    id: 'number-sequences-009',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'The sequence $2, 7, 14, 23, 34, \\dots$ continues with the same pattern. What is its 10th term?',
    options: ['$119$', '$89$', '$98$', '$101$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the term in position 10 of this list?',
      solution:
        'Find the gaps, called the **first differences**: $7 - 2 = 5$, $14 - 7 = 7$, $23 - 14 = 9$ and $34 - 23 = 11$.\n\n' +
        'Find the gaps between those gaps, called the **second differences**: $7 - 5 = 2$, $9 - 7 = 2$ and $11 - 9 = 2$. They are all the same. That means the formula is **quadratic**: it contains $n^2$, where $n$ is the position.\n\n' +
        'The number in front of $n^2$ is half the second difference: $2 \\div 2 = 1$. So the formula starts with $n^2$.\n\n' +
        'Subtract $n^2$ from each term to see what is left:\n\n| $n$ | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| Term | 2 | 7 | 14 | 23 | 34 |\n| $n^2$ | 1 | 4 | 9 | 16 | 25 |\n| Left over | 1 | 3 | 5 | 7 | 9 |\n\n' +
        'The left-over numbers go up by 2, so they follow the 2 times table, minus 1: $2n - 1$. The whole formula is $n^2 + 2n - 1$.\n\n' +
        'Put in $n = 10$: $10^2 + 2 \\times 10 - 1 = 100 + 20 - 1 = 119$.',
      conclusion: 'The formula $n^2 + 2n - 1$ gives every listed term, and at $n = 10$ it gives $119$.',
      whyWrong: [
        null,
        'This is $34 + 5 \\times 11$: it keeps adding the last difference (11) as if the sequence became linear. The differences keep growing by 2.',
        'This is the **9th** term: one step was missed when counting along.',
        'This is $n^2 + 1$ at $n = 10$: that formula matches the first term only ($n = 2$ gives 5, not 7). The leftover after removing $n^2$ is not constant.',
      ],
      keyIdea: 'If the second differences are constant, the sequence is quadratic. Take half the second difference as the number in front of $n^2$. Subtract that part from each term, find the linear rule for what is left, then substitute the position.',
    },
    check: { optionValues: [119, 89, 98, 101], compute: () => nthByDifferences([2, 7, 14, 23, 34], 10) },
  },
  {
    id: 'number-sequences-010',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'The sequence $6, \\square, \\square, 162$ is **geometric**. What is its second term?',
    options: ['$58$', '$54$', '$18$', '$84$'],
    correctIndex: 2,
    markScheme: {
      asking: 'The list multiplies by the same number each time. What is the second number?',
      solution:
        '**Geometric** means each term is the one before multiplied by a fixed number, called the common ratio. Call it $r$.\n\n' +
        'From the first term to the fourth, we multiply by $r$ three times: $6 \\times r \\times r \\times r = 162$, which is $6r^3 = 162$.\n\n' +
        'Divide both sides by 6 to get $r^3$ on its own: $r^3 = 162 \\div 6 = 27$.\n\n' +
        'We need a number that makes 27 when multiplied by itself three times. Since $3 \\times 3 \\times 3 = 27$, we have $r = 3$.\n\n' +
        'The second term is the first term times $r$: $6 \\times 3 = 18$. Test it: $18 \\times 3 = 54$ and $54 \\times 3 = 162$.',
      conclusion: 'The ratio is 3, so the second term is $18$.',
      whyWrong: [
        'This treats the sequence as **linear**: $d = \\frac{162 - 6}{3} = 52$, giving $6 + 52 = 58$. The question says it is geometric.',
        'This divides 27 by 3 to get $r = 9$ instead of taking the **cube root** of 27. (It is also the third term, not the second.)',
        null,
        'This is the average of the two ends, $\\frac{6 + 162}{2}$. That is not how a missing term in a geometric sequence is found.',
      ],
      keyIdea: 'When a geometric sequence has missing terms, count the multiplications between two known terms. If there are $k$, then $r^k$ equals the later term divided by the earlier term. Find the number that gives this value, then fill in the terms.',
    },
    check: {
      optionValues: [58, 54, 18, 84],
      compute: () => {
        for (let r = 1; r <= 20; r++) if (6 * r ** 3 === 162) return 6 * r;
        throw new Error('no ratio');
      },
    },
  },
  {
    id: 'number-sequences-011',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'The sequence $3, -6, 9, -12, 15, \\dots$ continues in the same way. What is its 20th term?',
    options: ['$60$', '$57$', '$-60$', '$-63$'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the term in position 20 of this list, including its sign?',
      solution:
        'Deal with the size and the sign separately. Ignoring signs, the terms are 3, 6, 9, 12, 15.\n\n' +
        'Those are the 3 times table, so the term in position $n$ has size $3n$. At position 20, the size is $3 \\times 20 = 60$.\n\n' +
        'Now the sign. Positions 1, 3 and 5 are positive, and positions 2 and 4 are negative. So odd positions are positive and even positions are negative.\n\n' +
        'Position 20 is even, so the term is negative: $-60$.',
      conclusion: 'The size is 60 and an even position is negative, so the 20th term is $-60$.',
      whyWrong: [
        'This has the right size but the wrong sign: even positions ($-6, -12, \\dots$) are negative.',
        'This is the 19th term ($3 \\times 19$, positive). The position was miscounted by one.',
        null,
        'This uses $3n + 3$ for the size, adding the first term as a constant. The sizes are exactly the 3 times table, $3n$, with no constant.',
      ],
      keyIdea: 'When signs alternate, split the problem in two: find a formula for the size, then use odd or even position to fix the sign. Test your sign rule against the terms you are given.',
    },
    check: {
      optionValues: [60, 57, -60, -63],
      compute: () => {
        // build the sequence term by term: size grows by 3, sign flips
        let size = 3;
        let sign = 1;
        for (let n = 2; n <= 20; n++) {
          size += 3;
          sign = -sign;
        }
        return sign * size;
      },
    },
  },
  {
    id: 'number-sequences-012',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'What is the next term in the sequence $2, 10, 4, 20, 8, 30, 16, \\dots$?',
    options: ['$32$', '$46$', '$60$', '$40$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which number comes after 16 in this list?',
      solution:
        'The terms go up and down, so one rule does not fit. When a list jumps about, it may be two lists woven together. Split it by position:\n\n| Positions | Terms | Rule |\n|---|---|---|\n| 1st, 3rd, 5th, 7th | 2, 4, 8, 16 | doubles each time |\n| 2nd, 4th, 6th | 10, 20, 30 | adds 10 each time |\n\n' +
        'The list shown has 7 terms, so the next term is the 8th. That is an even position, so it belongs to the second list.\n\n' +
        'The second list adds 10, and its last term is 30: $30 + 10 = 40$.',
      conclusion: 'The next term continues the even-position list, so it is $40$.',
      whyWrong: [
        'This continues the doubling sequence ($16 \\times 2$). But the next term is in an even position, which belongs to the "add 10" sequence; 32 is the term after that.',
        'This is $30 + 16$, adding the last two terms as in a Fibonacci-style rule. That rule does not fit the earlier terms ($2 + 10 \\ne 4$).',
        'This doubles 30, applying the doubling rule to the even-position sequence. That sequence goes up by 10, not by a factor of 2.',
        null,
      ],
      keyIdea: 'If terms zigzag, split them into odd and even positions and find a rule for each list. Then work out which list the term you want belongs to before applying a rule.',
    },
    check: {
      optionValues: [32, 46, 60, 40],
      compute: () => {
        const t = [2, 10, 4, 20, 8, 30, 16];
        const nextPos = t.length + 1; // 8, even
        const sub = t.filter((_, i) => (i + 1) % 2 === nextPos % 2); // 10, 20, 30
        return nthByDifferences(sub, sub.length + 1);
      },
    },
  },
  {
    id: 'number-sequences-013',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'What is the next term in the sequence $2, 9, 28, 65, 126, \\dots$?',
    options: ['$187$', '$216$', '$217$', '$252$'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which number comes after 126 in this list?',
      solution:
        'Try the gaps: 7, 19, 37, 61. They grow very fast, which suggests powers rather than adding.\n\n' +
        'Compare each term with the **cube** of its position, which is the position multiplied by itself three times:\n\n| Position $n$ | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| $n^3$ | 1 | 8 | 27 | 64 | 125 |\n| Term | 2 | 9 | 28 | 65 | 126 |\n\n' +
        'Every term is exactly 1 more than the cube, so the rule is $n^3 + 1$.\n\n' +
        'The next term is in position 6: $6^3 + 1 = 216 + 1 = 217$.',
      conclusion: 'Each term is a cube plus 1, and for position 6 that gives $217$.',
      whyWrong: [
        'This is $126 + 61$: it repeats the last difference. The differences are growing quickly ($7, 19, 37, 61$), so the next one is larger.',
        'This is $6^3$: the cubes were spotted but the $+1$ was forgotten.',
        null,
        'This doubles 126, but the terms are not growing by a fixed factor ($9 \\div 2$ and $28 \\div 9$ are different).',
      ],
      keyIdea: 'If terms grow fast, compare them with known lists: squares (1, 4, 9, 16) and cubes (1, 8, 27, 64). If each term is a fixed amount away, the rule is that power plus or minus the amount.',
    },
    check: { optionValues: [187, 216, 217, 252], compute: () => nthByDifferences([2, 9, 28, 65, 126], 6) },
  },
  {
    id: 'number-sequences-014',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'What does this code print, in order?',
    code: {
      lang: 'pseudocode',
      source: 'a = 1\nb = 2\nfor i = 1 to 6\n   print(a)\n   c = a + b\n   a = b\n   b = c\nend for',
    },
    options: ['`1 2 3 5 8 13`', '`1 2 4 8 16 32`', '`2 3 5 8 13 21`', '`1 2 3 5 8`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What six numbers does this loop print?',
      solution:
        'Lines 1 and 2 set `a` to 1 and `b` to 2. The `for` on line 3 repeats lines 4 to 7 six times, with `i` taking the values 1 to 6.\n\n' +
        'Each pass does four things in order. Line 4 prints `a`. Line 5 stores the sum of `a` and `b` in `c`. Line 6 copies `b` into `a`. Line 7 copies `c` into `b`.\n\n' +
        '`c` is needed because line 6 overwrites `a`. Saving the sum first keeps it safe.\n\n' +
        'Trace each pass, using the values at the start of the pass. The printed values are in the `a` column:\n\n| Pass | `a` (printed) | `b` | `c = a + b` |\n|---|---|---|---|\n| 1 | 1 | 2 | 3 |\n| 2 | 2 | 3 | 5 |\n| 3 | 3 | 5 | 8 |\n| 4 | 5 | 8 | 13 |\n| 5 | 8 | 13 | 21 |\n| 6 | 13 | 21 | 34 |',
      conclusion: 'Each printed value after the second is the sum of the two before it, and six passes print `1 2 3 5 8 13`.',
      whyWrong: [
        null,
        'This is what you get from `a = b` followed by `b = a + b` with no `c`: the second step uses the **new** `a`, so `b` doubles each time.',
        'This is what you get if `a` is printed **after** the update, so the starting value 1 is never printed.',
        'This has only 5 values. `for i = 1 to 6` includes both ends, so the loop runs 6 times.',
      ],
      keyIdea: 'For a loop that updates several variables, draw a table with one row per pass and one column per variable. Run the lines in order, using each variable\'s latest value. Record what `print` shows at the moment it runs.',
    },
    check: {
      optionValues: ['1 2 3 5 8 13', '1 2 4 8 16 32', '2 3 5 8 13 21', '1 2 3 5 8'],
      compute: () => {
        let a = 1;
        let b = 2;
        const out: number[] = [];
        for (let i = 1; i <= 6; i++) {
          out.push(a);
          const c = a + b;
          a = b;
          b = c;
        }
        return out.join(' ');
      },
    },
  },
  {
    id: 'number-sequences-015',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'How many terms are there in the sequence $6, 9, 12, 15, \\dots, 300$?',
    options: ['$98$', '$99$', '$100$', '$50$'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many numbers are in this list from 6 up to 300?',
      solution:
        'The gap is $9 - 6 = 3$ every time, so the list goes up in steps of 3.\n\n' +
        'Find how many jumps it takes to get from 6 to 300. The total distance is $300 - 6 = 294$. Each jump is 3, so there are $294 \\div 3 = 98$ jumps.\n\n' +
        'Each jump lands on one new term, and the starting term 6 needs no jump. So the number of terms is $98 + 1 = 99$.',
      conclusion: 'There are 98 jumps plus the first term, so the list has $99$ terms.',
      whyWrong: [
        'This is the number of **jumps** between terms, $\\frac{300 - 6}{3}$. The first term must be counted too, so add 1.',
        null,
        'This is $300 \\div 3$, which counts the multiples of 3 from 3 to 300. The sequence starts at 6, so 3 is not included.',
        'This is $300 \\div 6$: it divides by the first term instead of the common difference.',
      ],
      keyIdea: 'To count the terms in a linear list, use: number of terms = (last $-$ first) $\\div$ gap $+ 1$. The $+ 1$ counts the starting term. Try a tiny list to test it: 6, 9, 12 gives $6 \\div 3 + 1 = 3$.',
    },
    check: {
      optionValues: [98, 99, 100, 50],
      compute: () => {
        let count = 0;
        for (let t = 6; t <= 300; t += 3) count++;
        return count;
      },
    },
  },
  {
    id: 'number-sequences-016',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'The sequence $96, -48, 24, -12, \\dots$ is geometric. What is its 8th term?',
    options: ['$\\frac{3}{4}$', '$\\frac{3}{2}$', '$\\frac{3}{8}$', '$-\\frac{3}{4}$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the term in position 8 of this list, including its sign?',
      solution:
        'Find the common ratio (the fixed multiplier) by dividing a term by the one before: $-48 \\div 96 = -\\frac{1}{2}$. The next pair agrees: $24 \\div (-48) = -\\frac{1}{2}$.\n\n' +
        'Multiplying by $-\\frac{1}{2}$ halves the size and flips the sign. So we can walk along the list from term 4, which is $-12$:\n\n| Position | 5 | 6 | 7 |\n|---|---|---|---|\n| Term | $6$ | $-3$ | $\\frac{3}{2}$ |\n\n' +
        'Position 8 is position 7 times the ratio: $\\frac{3}{2} \\times \\left(-\\frac{1}{2}\\right) = -\\frac{3}{4}$. As a test, going from term 1 to term 8 takes 7 multiplications by the ratio: $96 \\times \\left(-\\frac{1}{2}\\right)^7 = 96 \\times \\left(-\\frac{1}{128}\\right) = -\\frac{3}{4}$.',
      conclusion: 'Halving and flipping the sign at each step leads to the 8th term, $-\\frac{3}{4}$.',
      whyWrong: [
        'This has the right size but the wrong sign. An odd power of a negative ratio is negative, and the even positions ($-48, -12, \\dots$) are all negative.',
        'This is the **7th** term. Counting along, one step was missed.',
        'This uses $r^{8}$ instead of $r^{7}$ (one multiplication too many), giving $96 \\times \\frac{1}{256}$. From the 1st term to the 8th there are only 7 multiplications.',
        null,
      ],
      keyIdea: 'For a geometric sequence, $u_n = ar^{n-1}$, where $a$ is the first term and $r$ is the ratio. From term 1 to term $n$ there are $n - 1$ multiplications. With a negative ratio, even positions have the opposite sign to the first term.',
    },
    check: {
      optionValues: [3 / 4, 3 / 2, 3 / 8, -3 / 4],
      compute: () => {
        const r = new Frac(-48, 96);
        let t = new Frac(96);
        for (let n = 2; n <= 8; n++) t = t.mul(r);
        return t.value();
      },
    },
  },

  {
    id: 'number-sequences-017',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'Which expression gives the $n$th term of the sequence $4, 10, 18, 28, 40, \\dots$?',
    options: ['$2n^2 + 2$', '$n^2 + 3n$', '$6n - 2$', '$n^2 + 3$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which formula gives the terms of this list from position $n$?',
      solution:
        'Find the gaps: 6, 8, 10, 12. Then find the gaps between those gaps: 2, 2, 2. A constant second gap means the formula is **quadratic**: it contains $n^2$.\n\n' +
        'The number in front of $n^2$ is half the second gap: $2 \\div 2 = 1$. So the formula starts with $n^2$.\n\n' +
        'Take $n^2$ away from each term to see what is left:\n\n| $n$ | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| Term | 4 | 10 | 18 | 28 | 40 |\n| $n^2$ | 1 | 4 | 9 | 16 | 25 |\n| Left over | 3 | 6 | 9 | 12 | 15 |\n\n' +
        'The left-over numbers are the 3 times table, which is $3n$. So the formula is $n^2 + 3n$. Test it at $n = 3$: $9 + 9 = 18$, which matches.',
      conclusion: '$n^2$ plus the left-over $3n$ matches every term, so the expression is $n^2 + 3n$.',
      whyWrong: [
        'This uses the full second difference (2) as the coefficient of $n^2$ instead of half of it. It fits the first two terms but gives $20$ for $n = 3$, not $18$.',
        null,
        'This is a linear rule built from the first difference (6) only. It fits $4, 10$ but then gives $16$, not $18$: the differences are not constant.',
        'This takes only the first leftover value (3) as a constant. After removing $n^2$ the leftovers are $3, 6, 9, \\dots$, which still depend on $n$.',
      ],
      keyIdea: 'To get a quadratic\'s formula, take half the second difference as the number in front of $n^2$, subtract that part from each term, then find a linear rule for what is left. To choose between options quickly, test $n = 3$ in each.',
    },
    // each option evaluated at n = 10; compute finds the true 10th term
    check: { optionValues: [202, 130, 58, 103], compute: () => nthByDifferences([4, 10, 18, 28, 40], 10) },
  },
  {
    id: 'number-sequences-018',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'The triangular numbers are $1, 3, 6, 10, 15, \\dots$ What is the **first** triangular number greater than $250$?',
    options: ['$231$', '$256$', '$276$', '$253$'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which triangular number is the first to go above 250?',
      solution:
        'The $n$th triangular number is $T_n = \\frac{n(n+1)}{2}$, where $n$ is its position. It equals $1 + 2 + \\dots + n$.\n\n' +
        'Estimate the position. $T_n$ is roughly $n^2 \\div 2$, so we need $n^2$ near 500. Since $22 \\times 22 = 484$, look near $n = 22$.\n\n' +
        'Try the position just below: $T_{21} = \\frac{21 \\times 22}{2} = 231$. That is below 250.\n\n' +
        'Now the next one: $T_{22} = \\frac{22 \\times 23}{2} = 253$, which is above 250.',
      conclusion: '$T_{21}$ is below 250 and the very next one is above it, so the first triangular number greater than 250 is $253$.',
      whyWrong: [
        'This is $T_{21}$, the **largest triangular number below** 250, not the first one above it.',
        'This is $16^2$, the first **square** number above 250, not a triangular number.',
        'This is $T_{23}$: it overshoots by one. $T_{22} = 253$ is already greater than 250.',
        null,
      ],
      keyIdea: 'To find the first triangular number above a target, estimate $n$ from $n^2 \\approx 2 \\times$ target, then work out $\\frac{n(n+1)}{2}$ for neighbouring values. Include the one just below, so that nothing is skipped.',
    },
    check: {
      optionValues: [231, 256, 276, 253],
      compute: () => {
        let t = 0;
        for (let n = 1; ; n++) {
          t += n;
          if (t > 250) return t;
        }
      },
    },
  },
  {
    id: 'number-sequences-022',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'A sequence with a constant difference between neighbouring terms is called:',
    options: ['linear (arithmetic)', 'geometric', 'quadratic', 'Fibonacci-like'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the name for a list that changes by the same amount at each step?',
      solution:
        'A constant difference means subtracting neighbouring terms always gives the same number. For example, in 3, 7, 11, 15, every gap is 4.\n\n' +
        'Plotted on a graph, those terms lie on a straight line. So this kind of list is called **linear**, and it is also called **arithmetic**.',
      conclusion: 'A fixed difference between neighbours is what defines a linear (arithmetic) sequence.',
      whyWrong: [
        null,
        'A geometric sequence has a constant **ratio**: you multiply by the same number each time.',
        'A quadratic sequence has a constant **second** difference; its first differences change.',
        'In a Fibonacci-like sequence each term is the sum of the two before it, so the differences change.',
      ],
      keyIdea: 'Test sequences in this order. Same difference: linear. Same ratio: geometric. Same second difference: quadratic. Each term the sum of the two before it: Fibonacci-like.',
    },
  },
  {
    id: 'number-sequences-023',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'What is the common ratio of the geometric sequence $3, 12, 48, 192, \\dots$?',
    options: ['$3$', '$4$', '$9$', '$36$'],
    correctIndex: 1,
    markScheme: {
      asking: 'What number do we multiply by to get from each term to the next?',
      solution:
        'The **common ratio** is the fixed number that each term is multiplied by to get the next term. To find it, divide a term by the one before it.\n\n' +
        '$12 \\div 3 = 4$. The other pairs agree: $48 \\div 12 = 4$ and $192 \\div 48 = 4$.',
      conclusion: 'Each term is 4 times the one before, so the common ratio is $4$.',
      whyWrong: [
        'This is the first term, not the ratio.',
        null,
        'This is $12 - 3$, the first **difference**. A ratio comes from dividing.',
        'This is $48 - 12$, a gap between neighbouring terms. A ratio comes from dividing.',
      ],
      keyIdea: 'To find a common ratio, divide any term by the term before it, and never subtract. Do it for two or three pairs to confirm that the result stays the same.',
    },
    check: { optionValues: [3, 4, 9, 36], compute: () => 12 / 3 },
  },
  {
    id: 'number-sequences-024',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'A linear sequence has first term $a$ and common difference $d$. What is its $n$th term?',
    options: ['$a + (n - 1)d$', '$a + nd$', '$ar^{n-1}$', '$(a + n)d$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What formula gives the term in position $n$ of a list that starts at $a$ and goes up by $d$?',
      solution:
        '$a$ is the first term, $d$ is the fixed gap, and $n$ is the position of the term we want.\n\n' +
        'Write the first few terms. Term 1 is $a$. Term 2 is $a + d$ (one jump). Term 3 is $a + 2d$ (two jumps). Term 4 is $a + 3d$ (three jumps).\n\n' +
        'The number of jumps is always one less than the position. So term $n$ has $n - 1$ jumps, each of size $d$, which gives $a + (n - 1)d$.',
      conclusion: 'Start at $a$ and add $n - 1$ jumps of $d$, which gives $a + (n - 1)d$.',
      whyWrong: [
        null,
        'This makes $n$ jumps. At $n = 1$ it gives $a + d$, which is the second term, not the first.',
        'This is the $n$th term of a **geometric** sequence with ratio $r$.',
        'This multiplies by $d$ instead of adding jumps of $d$. At $n = 1$ it does not give $a$.',
      ],
      keyIdea: 'To test an $n$th term formula, substitute $n = 1$: it must give the first term. Then $n = 2$ must give the second term. For a linear sequence, the number of jumps is always $n - 1$.',
    },
    // each option evaluated at a = 5, d = 3, n = 4 (r = d for the geometric form)
    check: { optionValues: [14, 17, 135, 27], compute: () => nthByDifferences([5, 8, 11], 4) },
  },
  {
    id: 'number-sequences-025',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    stem: 'Which of these is a triangular number?',
    options: ['$14$', '$21$', '$25$', '$32$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which of the four numbers is in the triangular list?',
      solution:
        'Triangular numbers count the dots in a triangle with rows of 1, 2, 3 and so on. So each one is a running total of the whole numbers.\n\n' +
        'Build the list by adding the next whole number each time: 1, 3, 6, 10, 15, 21, 28, 36. For example, $6 + 4 = 10$.\n\n' +
        'Compare with the options. 14 falls between 10 and 15, 25 falls between 21 and 28, and 32 falls between 28 and 36. Only 21 is in the list.',
      conclusion: 'The only option that appears in the list is $21$.',
      whyWrong: [
        'This lies between the triangular numbers 10 and 15, so it is not one of them.',
        null,
        'This is $5^2$, a **square** number. The triangular numbers near it are 21 and 28.',
        'This is $2^5$, a **power of 2**. The triangular numbers near it are 28 and 36.',
      ],
      keyIdea: 'To test if a number is triangular, build the list up to it by adding 2, 3, 4 and so on. Or double the number and see if the result is two neighbouring whole numbers multiplied: $2 \\times 21 = 42 = 6 \\times 7$.',
    },
    check: {
      optionValues: [14, 21, 25, 32],
      compute: () => {
        const tri = (x: number) => Array.from({ length: x }, (_, i) => ((i + 1) * (i + 2)) / 2).includes(x);
        return [14, 21, 25, 32].filter(tri).join('+');
      },
    },
  },
  {
    id: 'number-sequences-026',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    stem: 'A sequence is defined by $u_1 = 3$ and $u_{n+1} = 2u_n - 1$. Find $u_5$.',
    options: ['$33$', '$17$', '$65$', '$18$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Start at $u_1 = 3$ and apply the rule repeatedly. What is the 5th term?',
      solution:
        '$u_1$ means the first term, and $u_5$ means the fifth. The rule $u_{n+1} = 2u_n - 1$ says: to get the next term, double the current term, then subtract 1.\n\n' +
        'Getting from $u_1$ to $u_5$ takes 4 uses of the rule. Go one at a time:\n\n| Term | Working | Value |\n|---|---|---|\n| $u_2$ | $2 \\times 3 - 1$ | 5 |\n| $u_3$ | $2 \\times 5 - 1$ | 9 |\n| $u_4$ | $2 \\times 9 - 1$ | 17 |\n\n' +
        'Use the rule once more: $u_5 = 2 \\times 17 - 1 = 34 - 1 = 33$.',
      conclusion: 'Applying the rule four times from 3 gives $33$.',
      whyWrong: [
        null,
        'This is $u_4$: one step too few. From $u_1$ to $u_5$ the rule is applied 4 times.',
        'This is $u_6$: one step too many.',
        'This uses $2(u_n - 1)$, subtracting before doubling. The rule doubles first, then subtracts 1.',
      ],
      keyIdea: 'A rule linking $u_{n+1}$ to $u_n$ is called a recurrence. Apply it one step at a time in a table, and count the uses: getting from $u_1$ to $u_k$ takes $k - 1$ uses. Follow the stated order of operations.',
    },
    check: {
      optionValues: [33, 17, 65, 18],
      compute: () => {
        let u = 3;
        for (let n = 1; n < 5; n++) u = 2 * u - 1;
        return u;
      },
    },
  },
];
