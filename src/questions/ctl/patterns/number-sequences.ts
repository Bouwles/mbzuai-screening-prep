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
      solution:
        'Find the gap between neighbouring terms:\n\n' +
        '- $10 - 3 = 7$\n- $17 - 10 = 7$\n- $24 - 17 = 7$\n\n' +
        'The difference is always $7$, so this is a **linear** (arithmetic) sequence: add $7$ each time.\n\n' +
        'Next term: $24 + 7 = 31$.',
      whyWrong: [
        'This is $24 + 3$: it adds the **first term** (3) instead of the common difference (7).',
        null,
        'This is $24 + 14$: it adds two steps of 7 at once, which gives the term **after** the next one.',
        'This is $24 \\times 2$: it treats the sequence as doubling, but the terms go up by the same amount each time, not by the same factor.',
      ],
      keyIdea: 'If the differences between terms are all the same, keep adding that common difference.',
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
      solution:
        'The differences are $4, 12, 36$: not constant, so it is not linear.\n\n' +
        'Try dividing each term by the one before:\n\n' +
        '- $6 \\div 2 = 3$\n- $18 \\div 6 = 3$\n- $54 \\div 18 = 3$\n\n' +
        'The ratio is always $3$, so this is a **geometric** sequence: multiply by $3$ each time.\n\n' +
        'Next term: $54 \\times 3 = 162$.',
      whyWrong: [
        'This is $54 + 36$: it repeats the last difference (36) as if the sequence were linear. The differences themselves are being multiplied by 3.',
        'This is $54 \\times 2$: it multiplies by 2 instead of the common ratio 3.',
        'This is $54 + 18$: it adds the previous term, as in a Fibonacci-style rule, but $2 + 6 \\ne 18$, so that rule does not fit.',
        null,
      ],
      keyIdea: 'If dividing each term by the previous one always gives the same number, the sequence is geometric: keep multiplying by that ratio.',
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
      solution:
        'Recognise the terms: $1 = 1^2$, $4 = 2^2$, $9 = 3^2$, $25 = 5^2$, $36 = 6^2$. These are the **square numbers**.\n\n' +
        'The missing term is in position 4, so it is $4^2 = 16$.\n\n' +
        'Check with differences: $1, 4, 9, 16, 25, 36$ has differences $3, 5, 7, 9, 11$ (the odd numbers), which fits.',
      whyWrong: [
        'This is $9 + 5$: it repeats the previous difference (5). In the square numbers the differences go up by 2 each time ($3, 5, 7, 9, \\dots$).',
        'This is the number halfway between 9 and 25, $\\frac{9 + 25}{2} = 17$. That only works for a linear sequence, and this one is not linear.',
        null,
        'This is $9 \\times 2$: it doubles the previous term, but the terms are not growing by a fixed factor.',
      ],
      keyIdea: 'Learn to recognise the square numbers $1, 4, 9, 16, 25, 36, \\dots$ on sight; their differences are the odd numbers.',
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
      solution:
        'The $n$th triangular number is $1 + 2 + 3 + \\dots + n$, which equals $\\frac{n(n+1)}{2}$.\n\n' +
        'Method 1 (keep going): $15 + 6 = 21$ (6th), $21 + 7 = 28$ (7th), $28 + 8 = 36$ (8th).\n\n' +
        'Method 2 (formula): $\\frac{8 \\times 9}{2} = \\frac{72}{2} = 36$.',
      whyWrong: [
        'This is the **7th** triangular number: one step was missed when counting along the sequence.',
        'This is $8^2$, the 8th **square** number, not the 8th triangular number.',
        null,
        'This is $8 \\times 9$: it uses the formula $\\frac{n(n+1)}{2}$ but forgets to divide by 2.',
      ],
      keyIdea: 'The $n$th triangular number is $1 + 2 + \\dots + n = \\frac{n(n+1)}{2}$.',
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
      solution:
        'These are the **prime numbers**: whole numbers greater than 1 whose only factors are 1 and themselves.\n\n' +
        'Test the numbers after 23 one by one:\n\n' +
        '- $24 = 2 \\times 12$ (not prime)\n- $25 = 5 \\times 5$ (not prime)\n- $26 = 2 \\times 13$ (not prime)\n- $27 = 3 \\times 9$ (not prime)\n- $28 = 2 \\times 14$ (not prime)\n- $29$: not divisible by 2, 3 or 5 (and $6^2 > 29$, so no other factor is possible). Prime.\n\n' +
        'The next term is $29$.',
      whyWrong: [
        'This is the next odd number after 23, but $25 = 5 \\times 5$ is not prime.',
        null,
        'This is $23 + 4$, repeating the last gap ($19 \\to 23$). Gaps between primes are not constant, and $27 = 3 \\times 9$ is not prime anyway.',
        'This is the prime **after** the next one: 29 was skipped.',
      ],
      keyIdea: 'Primes have no regular gap: test each candidate for factors (2, 3, 5, 7, ...) to find the next prime.',
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
      solution:
        'Look at the end of the sequence, where no term is missing: $12 + 19 = 31$. So each term might be the **sum of the two terms before it** (a Fibonacci-like rule).\n\n' +
        'Apply the rule to fill the gap: $2 + 5 = 7$.\n\n' +
        'Check the rest: $5 + 7 = 12$ and $7 + 12 = 19$ and $12 + 19 = 31$. Every term fits, so the missing term is $7$.',
      whyWrong: [
        'This is $5 + 3$: it assumes the sequence goes up by 3 each time (from $2 \\to 5$), but then the next term would be 11, not 12.',
        null,
        'This is $5 \\times 2$: it doubles the previous term, but then $10 \\to 12$ does not follow the same rule.',
        'This is halfway between 5 and 12, $\\frac{5 + 12}{2}$. A missing term is not simply the average of its neighbours unless the sequence is linear.',
      ],
      keyIdea: 'Find the rule from the part of the sequence with no gaps, then check it works for every term.',
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
      solution:
        'The common difference is $9 - 5 = 4$, so the $n$th term starts with $4n$.\n\n' +
        'Compare with the 4 times table: $4n$ gives $4, 8, 12, 16, \\dots$ Each term of our sequence is $1$ more ($5 - 4 = 1$).\n\n' +
        'So the $n$th term is $4n + 1$.\n\n' +
        'Check: $n = 1$ gives $5$, $n = 2$ gives $9$, $n = 3$ gives $13$. Correct.',
      whyWrong: [
        'This confuses "add 4 each time" with "add 4 to $n$". It gives $5, 6, 7, \\dots$, which goes up by 1, not 4.',
        'This uses the first term (5) as the constant. The constant is the first term **minus** the difference: $5 - 4 = 1$. This gives $9, 13, 17, \\dots$, one step ahead.',
        'This swaps the roles of the first term and the difference: it gives $9, 14, 19, \\dots$, which goes up by 5.',
        null,
      ],
      keyIdea: 'For a linear sequence, the $n$th term is $dn + (a - d)$, where $d$ is the common difference and $a$ the first term.',
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
      solution:
        'First term $a = 7$, common difference $d = 3$.\n\n' +
        'To get from the 1st term to the 50th term you add $d$ exactly $50 - 1 = 49$ times:\n\n' +
        '$$u_{50} = 7 + 49 \\times 3 = 7 + 147 = 154$$\n\n' +
        'Or use the $n$th term $3n + 4$: $3 \\times 50 + 4 = 154$.',
      whyWrong: [
        'This is $7 + 50 \\times 3$: it adds the difference 50 times instead of 49 (only 49 jumps are needed to go from term 1 to term 50).',
        'This is $3 \\times 50$: it uses $3n$ but forgets the constant $+4$.',
        null,
        'This is $49 \\times 3$: it counts the 49 jumps correctly but forgets to start from the first term, 7.',
      ],
      keyIdea: 'The $n$th term of a linear sequence is $a + (n-1)d$: there are $n - 1$ jumps from the first term to the $n$th.',
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
      solution:
        'First differences: $5, 7, 9, 11$. Second differences: $2, 2, 2$. A constant **second** difference means the sequence is **quadratic**.\n\n' +
        'Half the second difference is the coefficient of $n^2$: $\\frac{2}{2} = 1$, so start with $n^2$.\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| term | 2 | 7 | 14 | 23 | 34 |\n| $n^2$ | 1 | 4 | 9 | 16 | 25 |\n| term $- n^2$ | 1 | 3 | 5 | 7 | 9 |\n\n' +
        'The leftover $1, 3, 5, 7, 9$ is linear with $n$th term $2n - 1$.\n\n' +
        'So $u_n = n^2 + 2n - 1$, and $u_{10} = 100 + 20 - 1 = 119$.\n\n' +
        'Check by continuing the differences $13, 15, 17, 19, 21$: $34 \\to 47 \\to 62 \\to 79 \\to 98 \\to 119$.',
      whyWrong: [
        null,
        'This is $34 + 5 \\times 11$: it keeps adding the last difference (11) as if the sequence became linear. The differences keep growing by 2.',
        'This is the **9th** term: one step was missed when counting along.',
        'This is $n^2 + 1$ at $n = 10$: that formula matches the first term only ($n = 2$ gives 5, not 7). The leftover after removing $n^2$ is not constant.',
      ],
      keyIdea: 'A constant second difference means a quadratic $n$th term whose $n^2$ coefficient is half the second difference.',
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
      solution:
        'In a geometric sequence each term is the previous one times the ratio $r$. From the 1st term to the 4th term you multiply by $r$ three times:\n\n' +
        '$$6r^3 = 162$$\n\n' +
        '$$r^3 = \\frac{162}{6} = 27 \\quad\\Rightarrow\\quad r = \\sqrt[3]{27} = 3$$\n\n' +
        'Second term: $6 \\times 3 = 18$. (The full sequence is $6, 18, 54, 162$.)',
      whyWrong: [
        'This treats the sequence as **linear**: $d = \\frac{162 - 6}{3} = 52$, giving $6 + 52 = 58$. The question says it is geometric.',
        'This divides 27 by 3 to get $r = 9$ instead of taking the **cube root** of 27. (It is also the third term, not the second.)',
        null,
        'This is the average of the two ends, $\\frac{6 + 162}{2}$. That is not how a missing term in a geometric sequence is found.',
      ],
      keyIdea: 'Between term 1 and term $k$ you multiply by $r$ exactly $k - 1$ times, so take a root, not a division.',
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
      solution:
        'Split the pattern into **size** and **sign**.\n\n' +
        '- Size: $3, 6, 9, 12, 15, \\dots$ is the 3 times table, so the size of the $n$th term is $3n$.\n' +
        '- Sign: odd positions are positive, even positions are negative.\n\n' +
        'Position 20 is even, so the term is negative: $-(3 \\times 20) = -60$.\n\n' +
        'As a formula: $u_n = (-1)^{n+1} \\times 3n$, and $(-1)^{21} = -1$.',
      whyWrong: [
        'This has the right size but the wrong sign: even positions ($-6, -12, \\dots$) are negative.',
        'This is the 19th term ($3 \\times 19$, positive). The position was miscounted by one.',
        null,
        'This uses $3n + 3$ for the size, adding the first term as a constant. The sizes are exactly the 3 times table, $3n$, with no constant.',
      ],
      keyIdea: 'For an alternating sequence, find the rule for the size and the rule for the sign separately.',
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
      solution:
        'No single rule links neighbouring terms, so try splitting the sequence into two **interleaved** sequences.\n\n' +
        '- Odd positions (1st, 3rd, 5th, 7th): $2, 4, 8, 16$. Doubling each time.\n' +
        '- Even positions (2nd, 4th, 6th): $10, 20, 30$. Adding 10 each time.\n\n' +
        'The next term is the 8th, an **even** position, so it continues $10, 20, 30, \\dots$: $30 + 10 = 40$.',
      whyWrong: [
        'This continues the doubling sequence ($16 \\times 2$). But the next term is in an even position, which belongs to the "add 10" sequence; 32 is the term after that.',
        'This is $30 + 16$, adding the last two terms as in a Fibonacci-style rule. That rule does not fit the earlier terms ($2 + 10 \\ne 4$).',
        'This doubles 30, applying the doubling rule to the even-position sequence. That sequence goes up by 10, not by a factor of 2.',
        null,
      ],
      keyIdea: 'If neighbouring terms seem unrelated, look at every second term: two sequences may be interleaved.',
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
      solution:
        'Compare with the **cube numbers** $1, 8, 27, 64, 125$: each term is exactly 1 more.\n\n' +
        '- $1^3 + 1 = 2$, $2^3 + 1 = 9$, $3^3 + 1 = 28$, $4^3 + 1 = 65$, $5^3 + 1 = 126$\n\n' +
        'So the $n$th term is $n^3 + 1$, and the 6th term is $6^3 + 1 = 216 + 1 = 217$.\n\n' +
        'Check with differences: first differences $7, 19, 37, 61$; second $12, 18, 24$; third $6, 6$. Continue: second difference $30$, first difference $91$, term $126 + 91 = 217$.',
      whyWrong: [
        'This is $126 + 61$: it repeats the last difference. The differences are growing quickly ($7, 19, 37, 61$), so the next one is larger.',
        'This is $6^3$: the cubes were spotted but the $+1$ was forgotten.',
        null,
        'This doubles 126, but the terms are not growing by a fixed factor ($9 \\div 2$ and $28 \\div 9$ are different).',
      ],
      keyIdea: 'Compare a sequence with the squares or cubes: a constant gap from $n^2$ or $n^3$ gives the rule immediately.',
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
      solution:
        'The loop runs 6 times. Each time it prints `a` **before** updating, and `c` holds the sum so that the old values are used.\n\n' +
        '| i | printed `a` | `c` | new `a` | new `b` |\n|---|---|---|---|---|\n| 1 | 1 | 3 | 2 | 3 |\n| 2 | 2 | 5 | 3 | 5 |\n| 3 | 3 | 8 | 5 | 8 |\n| 4 | 5 | 13 | 8 | 13 |\n| 5 | 8 | 21 | 13 | 21 |\n| 6 | 13 | 34 | 21 | 34 |\n\n' +
        'So it prints `1 2 3 5 8 13`: a Fibonacci-like sequence where each term is the sum of the two before it.',
      whyWrong: [
        null,
        'This is what you get from `a = b` followed by `b = a + b` with no `c`: the second step uses the **new** `a`, so `b` doubles each time.',
        'This is what you get if `a` is printed **after** the update, so the starting value 1 is never printed.',
        'This has only 5 values. `for i = 1 to 6` includes both ends, so the loop runs 6 times.',
      ],
      keyIdea: 'Saving the sum in a third variable before updating generates a Fibonacci-like sequence.',
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
      solution:
        'First term $a = 6$, difference $d = 3$, last term $300$.\n\n' +
        'Count the jumps from 6 to 300: $\\frac{300 - 6}{3} = \\frac{294}{3} = 98$ jumps.\n\n' +
        'The number of terms is one more than the number of jumps (like fence posts and gaps): $98 + 1 = 99$.\n\n' +
        'Check with the $n$th term $3n + 3$: $3n + 3 = 300$ gives $3n = 297$, so $n = 99$.',
      whyWrong: [
        'This is the number of **jumps** between terms, $\\frac{300 - 6}{3}$. The first term must be counted too, so add 1.',
        null,
        'This is $300 \\div 3$, which counts the multiples of 3 from 3 to 300. The sequence starts at 6, so 3 is not included.',
        'This is $300 \\div 6$: it divides by the first term instead of the common difference.',
      ],
      keyIdea: 'Number of terms $= \\frac{\\text{last} - \\text{first}}{d} + 1$.',
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
      solution:
        'The ratio is $r = \\frac{-48}{96} = -\\frac{1}{2}$: each term is halved and the sign flips.\n\n' +
        'Keep going: $96, -48, 24, -12, 6, -3, \\frac{3}{2}, -\\frac{3}{4}$.\n\n' +
        'Or with the formula $u_n = ar^{n-1}$:\n\n' +
        '$$u_8 = 96 \\times \\left(-\\frac{1}{2}\\right)^{7} = 96 \\times \\left(-\\frac{1}{128}\\right) = -\\frac{96}{128} = -\\frac{3}{4}$$',
      whyWrong: [
        'This has the right size but the wrong sign. An odd power of a negative ratio is negative, and the even positions ($-48, -12, \\dots$) are all negative.',
        'This is the **7th** term. Counting along, one step was missed.',
        'This uses $r^{8}$ instead of $r^{7}$ (one multiplication too many), giving $96 \\times \\frac{1}{256}$. From the 1st term to the 8th there are only 7 multiplications.',
        null,
      ],
      keyIdea: 'A negative ratio makes the signs alternate; the $n$th term is $ar^{n-1}$, with $n - 1$ multiplications.',
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
      solution:
        'First differences: $6, 8, 10, 12$. Second differences: $2, 2, 2$. Constant second difference, so the sequence is **quadratic**.\n\n' +
        'Coefficient of $n^2$ is half the second difference: $\\frac{2}{2} = 1$.\n\n' +
        'Subtract $n^2$ from each term: $4 - 1 = 3$, $10 - 4 = 6$, $18 - 9 = 9$, $28 - 16 = 12$, $40 - 25 = 15$.\n\n' +
        'The leftover $3, 6, 9, 12, 15$ is $3n$. So $u_n = n^2 + 3n$.\n\n' +
        'Check $n = 3$: $9 + 9 = 18$. Correct. (Each wrong option fails by $n = 3$, so always test at least three terms.)',
      whyWrong: [
        'This uses the full second difference (2) as the coefficient of $n^2$ instead of half of it. It fits the first two terms but gives $20$ for $n = 3$, not $18$.',
        null,
        'This is a linear rule built from the first difference (6) only. It fits $4, 10$ but then gives $16$, not $18$: the differences are not constant.',
        'This takes only the first leftover value (3) as a constant. After removing $n^2$ the leftovers are $3, 6, 9, \\dots$, which still depend on $n$.',
      ],
      keyIdea: 'For a quadratic sequence, the $n^2$ coefficient is half the second difference; subtract it and find the linear part that is left.',
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
      solution:
        'The $n$th triangular number is $T_n = \\frac{n(n+1)}{2}$, so $n(n+1)$ must be just over $500$.\n\n' +
        'Estimate: $n^2 \\approx 500$ gives $n \\approx 22$.\n\n' +
        '- $T_{21} = \\frac{21 \\times 22}{2} = 231$ (not greater than 250)\n' +
        '- $T_{22} = \\frac{22 \\times 23}{2} = 253$ (greater than 250)\n\n' +
        'So the first triangular number greater than 250 is $253$.',
      whyWrong: [
        'This is $T_{21}$, the **largest triangular number below** 250, not the first one above it.',
        'This is $16^2$, the first **square** number above 250, not a triangular number.',
        'This is $T_{23}$: it overshoots by one. $T_{22} = 253$ is already greater than 250.',
        null,
      ],
      keyIdea: 'Estimate with $n^2 \\approx 2 \\times \\text{target}$, then check $T_n = \\frac{n(n+1)}{2}$ for the nearby values of $n$.',
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
      solution: 'A constant **difference** means you add the same amount each time, as in $7, 10, 13, 16, \\dots$ This is a linear, or arithmetic, sequence.',
      whyWrong: [
        null,
        'A geometric sequence has a constant **ratio**: you multiply by the same number each time.',
        'A quadratic sequence has a constant **second** difference; its first differences change.',
        'In a Fibonacci-like sequence each term is the sum of the two before it, so the differences change.',
      ],
      keyIdea: 'Constant difference: linear. Constant ratio: geometric. Constant second difference: quadratic.',
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
      solution: 'Divide any term by the one before it: $12 \\div 3 = 4$. Check: $48 \\div 12 = 4$. The common ratio is $4$.',
      whyWrong: [
        'This is the first term, not the ratio.',
        null,
        'This is $12 - 3$, the first **difference**. A ratio comes from dividing.',
        'This is $48 - 12$, a gap between neighbouring terms. A ratio comes from dividing.',
      ],
      keyIdea: 'The common ratio is any term divided by the term before it.',
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
      solution: 'From the 1st term to the $n$th term there are $n - 1$ jumps of size $d$, so the $n$th term is $a + (n - 1)d$.',
      whyWrong: [
        null,
        'This makes $n$ jumps. At $n = 1$ it gives $a + d$, which is the second term, not the first.',
        'This is the $n$th term of a **geometric** sequence with ratio $r$.',
        'This multiplies by $d$ instead of adding jumps of $d$. At $n = 1$ it does not give $a$.',
      ],
      keyIdea: 'The $n$th term of a linear sequence is $a + (n - 1)d$: there are $n - 1$ jumps.',
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
      solution: 'The triangular numbers are $1, 3, 6, 10, 15, 21, 28, \\dots$, each found by adding the next whole number. So $21 = 1 + 2 + 3 + 4 + 5 + 6$ is triangular.',
      whyWrong: [
        'This lies between the triangular numbers 10 and 15, so it is not one of them.',
        null,
        'This is $5^2$, a **square** number. The triangular numbers near it are 21 and 28.',
        'This is $2^5$, a **power of 2**. The triangular numbers near it are 28 and 36.',
      ],
      keyIdea: 'The triangular numbers are $1, 3, 6, 10, 15, 21, 28, 36, \\dots$',
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
      solution:
        'Here $u_n$ means the $n$th term, and the rule gives each term from the one before it: double, then subtract 1.\n\n' +
        '| $n$ | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| $u_n$ | 3 | 5 | 9 | 17 | 33 |\n\n' +
        'So $u_5 = 2 \\times 17 - 1 = 33$.',
      whyWrong: [
        null,
        'This is $u_4$: one step too few. From $u_1$ to $u_5$ the rule is applied 4 times.',
        'This is $u_6$: one step too many.',
        'This uses $2(u_n - 1)$, subtracting before doubling. The rule doubles first, then subtracts 1.',
      ],
      keyIdea: 'For a term-to-term rule, apply it one step at a time and keep track of the position.',
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
