import type { StaticQuestion } from '../../../types';
import { Frac } from '../../../lib/frac';
import { sumOf } from '../../../lib/mathx';

// Independent helpers for the answer checks: they build the sequences term by term.
const arithTerms = (a: number, d: number, n: number): number[] => Array.from({ length: n }, (_, i) => a + i * d);
const geoTerms = (a: number, r: number, n: number): number[] => Array.from({ length: n }, (_, i) => a * r ** i);

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'sequences-series-001',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'An arithmetic sequence begins $7, 11, 15, 19, \\dots$\n\nWhat is its 20th term?',
    options: ['$87$', '$76$', '$83$', '$900$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The first term is $a = 7$ and each term goes up by the same amount, so the common difference is $d = 11 - 7 = 4$.\n\n' +
        'The $n$th term of an arithmetic sequence is $u_n = a + (n-1)d$. To reach the 20th term you start at the 1st term and add $d$ **19 times** (not 20 times).\n\n' +
        '$$u_{20} = 7 + (20-1) \\times 4 = 7 + 19 \\times 4 = 7 + 76 = 83$$',
      whyWrong: [
        'This is $7 + 20 \\times 4$: it uses $n$ instead of $n - 1$. Going from the 1st term to the 20th term takes only 19 steps of $+4$.',
        'This is $19 \\times 4$: the 19 steps are right, but the starting value $a = 7$ was never added on.',
        null,
        'This is the **sum** of the first 20 terms, $\\frac{20}{2}(7 + 83) = 900$, not the 20th term itself.',
      ],
      keyIdea: 'The $n$th term of an arithmetic sequence is $u_n = a + (n-1)d$: start at the first term and add the difference $n - 1$ times.',
    },
    check: {
      optionValues: [87, 76, 83, 900],
      compute: () => arithTerms(7, 11 - 7, 20)[19],
    },
  },
  {
    id: 'sequences-series-002',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'A geometric sequence begins $3, -6, 12, -24, \\dots$\n\nWhat is its 7th term?',
    options: ['$192$', '$-192$', '$-384$', '$-96$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The first term is $a = 3$. Each term is the previous one multiplied by the same number, the common ratio:\n\n' +
        '$$r = \\frac{-6}{3} = -2$$\n\n' +
        'The $n$th term of a geometric sequence is $u_n = ar^{n-1}$, so\n\n' +
        '$$u_7 = 3 \\times (-2)^{6} = 3 \\times 64 = 192$$\n\n' +
        'Sign check: $-2$ raised to an **even** power is positive. The terms in odd positions (1st, 3rd, 5th, 7th) are all positive, which matches $3, 12, \\dots$',
      whyWrong: [
        null,
        'The size is right but the sign is wrong. $(-2)^{6}$ is positive because the power is even; in this sequence every odd-numbered term is positive.',
        'This is $3 \\times (-2)^{7}$: it uses the power $n$ instead of $n - 1$, which gives the 8th term.',
        'This is $3 \\times (-2)^{5}$, the 6th term: the power is one too small, so you have stopped one term early.',
      ],
      keyIdea: 'The $n$th term of a geometric sequence is $u_n = ar^{n-1}$; with a negative ratio, even powers give positive terms.',
    },
    check: {
      optionValues: [192, -192, -384, -96],
      compute: () => geoTerms(3, -6 / 3, 7)[6],
    },
  },
  {
    id: 'sequences-series-003',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'Evaluate $\\displaystyle\\sum_{k=1}^{4} (2k+1)$.',
    options: ['$21$', '$24$', '$16$', '$9$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The sigma sign means: put $k = 1, 2, 3, 4$ into the bracket one at a time and add up the results.\n\n' +
        '| $k$ | term $2k + 1$ |\n|---|---|\n| $1$ | $3$ |\n| $2$ | $5$ |\n| $3$ | $7$ |\n| $4$ | $9$ |\n\n' +
        'Sum: $3 + 5 + 7 + 9 = 24$.\n\n' +
        'Check with the arithmetic series formula: 4 terms, first $3$, last $9$, so $\\frac{4}{2}(3 + 9) = 24$.',
      whyWrong: [
        'This is $2(1 + 2 + 3 + 4) + 1 = 21$: the $+1$ belongs to **every** term, so it must be added 4 times, not once.',
        null,
        'This is $1 + 3 + 5 + 7$, the values for $k = 0, 1, 2, 3$: the counting has been started one place too early. The bottom number says start at $k = 1$, so the terms are $3, 5, 7, 9$.',
        'This is only the last term ($k = 4$). Sigma means add up the terms for every value of $k$ from 1 to 4.',
      ],
      keyIdea: 'In sigma notation, substitute every value of the counter from the bottom number to the top number and add all the results.',
    },
    check: {
      optionValues: [21, 24, 16, 9],
      compute: () => sumOf([1, 2, 3, 4].map((k) => 2 * k + 1)),
    },
  },
  {
    id: 'sequences-series-004',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'Find the sum to infinity of the geometric series $12 + 6 + 3 + \\dots$',
    options: ['$8$', '$21$', 'The sum to infinity does not exist', '$24$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'First term $a = 12$. Common ratio $r = \\frac{6}{12} = \\frac{1}{2}$.\n\n' +
        'Because $|r| = \\frac{1}{2} < 1$, the terms keep halving towards 0, so the sum to infinity exists:\n\n' +
        '$$S_\\infty = \\frac{a}{1 - r} = \\frac{12}{1 - \\frac{1}{2}} = \\frac{12}{\\frac{1}{2}} = 24$$\n\n' +
        'Sense check: $12 + 6 + 3 + 1.5 + 0.75 + \\dots$ gets closer and closer to 24 without passing it.',
      whyWrong: [
        'This is $\\frac{12}{1 + \\frac{1}{2}}$: the formula has $1 - r$ in the denominator, not $1 + r$.',
        'This is only $12 + 6 + 3$, the three terms that are shown. The series continues forever and those extra terms add another 3.',
        'A sum to infinity exists whenever $|r| < 1$. Here $r = \\frac{1}{2}$, so the terms shrink to 0 and the total settles at a finite value.',
        null,
      ],
      keyIdea: 'If $|r| < 1$, a geometric series has a sum to infinity $S_\\infty = \\frac{a}{1-r}$.',
    },
    check: {
      optionValues: [8, 21, null, 24],
      compute: () => {
        const a = 12;
        const r = 6 / 12;
        return a / (1 - r);
      },
    },
  },
  {
    id: 'sequences-series-005',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'Which of these geometric series has a sum to infinity?',
    options: ['$2 + 3 + 4.5 + \\dots$', '$5 - 10 + 20 - \\dots$', '$8 - 4 + 2 - 1 + \\dots$', '$3 + 3 + 3 + \\dots$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A geometric series has a sum to infinity only when the common ratio satisfies $|r| < 1$ (that is, $-1 < r < 1$). Find $r$ for each one by dividing a term by the term before it:\n\n' +
        '- $2 + 3 + 4.5 + \\dots$: $r = \\frac{3}{2} = 1.5$. Not allowed, $|r| > 1$.\n' +
        '- $5 - 10 + 20 - \\dots$: $r = \\frac{-10}{5} = -2$. Not allowed, $|r| = 2 > 1$.\n' +
        '- $8 - 4 + 2 - 1 + \\dots$: $r = \\frac{-4}{8} = -\\frac{1}{2}$. Allowed, $|r| = \\frac{1}{2} < 1$.\n' +
        '- $3 + 3 + 3 + \\dots$: $r = 1$. Not allowed, the sum is $3n$, which grows forever.\n\n' +
        'Only $8 - 4 + 2 - 1 + \\dots$ converges. Its sum is $\\frac{8}{1 - \\left(-\\frac{1}{2}\\right)} = \\frac{8}{\\frac{3}{2}} = \\frac{16}{3}$.',
      whyWrong: [
        'Here $r = 1.5$. The terms get **bigger**, so the total grows without limit.',
        'Here $r = -2$. The signs alternate, but the size of the terms doubles each time, so the total swings further and further and never settles.',
        null,
        'Here $r = 1$. The terms never shrink, so after $n$ terms the total is $3n$, which grows forever. The condition is strictly $|r| < 1$.',
      ],
      keyIdea: 'A geometric series converges (has a sum to infinity) exactly when $-1 < r < 1$; a negative ratio is fine as long as its size is less than 1.',
    },
  },
  {
    id: 'sequences-series-020',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'What is the $n$th term of an arithmetic sequence with first term $a$ and common difference $d$?',
    options: ['$a + (n-1)d$', '$a + nd$', '$ar^{n-1}$', '$\\frac{n}{2}\\left(2a + (n-1)d\\right)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Start at the first term $a$. To reach the $n$th term you add $d$ exactly $n - 1$ times.\n\n' +
        'So $u_n = a + (n-1)d$. For example, the 2nd term is $a + d$.',
      whyWrong: [
        null,
        'This adds $d$ one time too many: with $n = 1$ it gives $a + d$, not the first term $a$.',
        'This is the $n$th term of a **geometric** sequence, with common ratio $r$.',
        'This is the **sum** of the first $n$ terms, not the $n$th term.',
      ],
      keyIdea: 'The $n$th term of an arithmetic sequence is $a + (n-1)d$.',
    },
    check: {
      // each option evaluated at a = 5, d = 3, n = 4 (and r = 3 for the geometric form)
      optionValues: [5 + 3 * 3, 5 + 4 * 3, 5 * 3 ** 3, 2 * (10 + 3 * 3)],
      compute: () => arithTerms(5, 3, 4)[3],
    },
  },
  {
    id: 'sequences-series-021',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'What is the common ratio of the geometric sequence $2, 6, 18, 54, \\dots$?',
    options: ['$3$', '$4$', '$2$', '$\\frac{1}{3}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **common ratio** is what each term is multiplied by to give the next one. Find it by dividing a term by the one before it:\n\n' +
        '$$r = \\frac{6}{2} = 3$$',
      whyWrong: [
        null,
        '$4$ is the difference $6 - 2$. In a geometric sequence you divide, not subtract.',
        '$2$ is the first term, not the ratio.',
        'This divides a term by the one **after** it. The ratio is the next term divided by the previous one.',
      ],
      keyIdea: 'Common ratio $=$ a term divided by the term before it.',
    },
    check: {
      optionValues: [3, 4, 2, 1 / 3],
      compute: () => 18 / 6,
    },
  },
  {
    id: 'sequences-series-022',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'What is the common difference of the arithmetic sequence $5, 2, -1, -4, \\dots$?',
    options: ['$-3$', '$3$', '$-4$', '$\\frac{2}{5}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The **common difference** is what is added to each term to give the next one. Subtract a term from the one after it:\n\n' +
        '$$d = 2 - 5 = -3$$\n\n' +
        'The sequence is falling, so $d$ is negative.',
      whyWrong: [
        null,
        'This subtracts the wrong way round, $5 - 2$. The sequence falls, so the difference is negative.',
        '$-4$ is the 4th term, not the difference.',
        'This divides $\\frac{2}{5}$, which is how you would look for a ratio in a geometric sequence.',
      ],
      keyIdea: 'Common difference $=$ a term minus the term before it; it is negative for a falling sequence.',
    },
    check: {
      optionValues: [-3, 3, -4, 2 / 5],
      compute: () => -1 - 2,
    },
  },
  {
    id: 'sequences-series-023',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'A geometric series with common ratio $r$ has a sum to infinity exactly when:',
    options: ['$|r| < 1$', '$r < 1$', '$r > 1$', '$|r| \\le 1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A sum to infinity exists only if the terms shrink towards 0, which happens exactly when $|r| < 1$, that is, $-1 < r < 1$.\n\n' +
        'Then $S_\\infty = \\frac{a}{1 - r}$.',
      whyWrong: [
        null,
        'This also allows values such as $r = -3$, where the terms grow in size: $1, -3, 9, -27, \\dots$',
        'Here the terms keep growing, so the total grows without limit.',
        'This includes $r = 1$ and $r = -1$, where the terms never shrink. The inequality must be strict.',
      ],
      keyIdea: 'A geometric series has a sum to infinity exactly when $|r| < 1$.',
    },
  },
  {
    id: 'sequences-series-024',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    stem: 'In an arithmetic progression, which quantity is constant?',
    options: ['The difference of consecutive terms', 'The ratio of consecutive terms', 'The sum of consecutive terms', 'The product of consecutive terms'],
    correctIndex: 0,
    markScheme: {
      solution:
        'An **arithmetic progression** (AP) is another name for an arithmetic sequence. Each term is the one before it plus a fixed number $d$, so the difference of consecutive terms is constant.\n\n' +
        'For example, in $4, 7, 10, 13, \\dots$ the difference is always 3.',
      whyWrong: [
        null,
        'A constant ratio defines a **geometric** progression.',
        'The sums change: in $4, 7, 10, \\dots$ they are 11, then 17.',
        'The products change: in $4, 7, 10, \\dots$ they are 28, then 70.',
      ],
      keyIdea: 'Arithmetic: constant difference. Geometric: constant ratio.',
    },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'sequences-series-006',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'Find the sum of the first 25 terms of the arithmetic sequence $4, 7, 10, \\dots$',
    options: ['$1000$', '$2000$', '$1037.5$', '$76$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $a = 4$, $d = 7 - 4 = 3$ and $n = 25$.\n\n' +
        'Use $S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)$:\n\n' +
        '$$S_{25} = \\frac{25}{2}\\left(2 \\times 4 + 24 \\times 3\\right) = \\frac{25}{2} \\times 80 = 1000$$\n\n' +
        'Check with the other form $S_n = \\frac{n}{2}(a + l)$: the last term is $l = 4 + 24 \\times 3 = 76$, so $S_{25} = \\frac{25}{2}(4 + 76) = \\frac{25}{2} \\times 80 = 1000$.',
      whyWrong: [
        null,
        'This is $25 \\times (4 + 76)$: the formula is $\\frac{n}{2}(a + l)$, and the division by 2 was forgotten.',
        'This is $\\frac{25}{2}(8 + 25 \\times 3)$: it uses $nd$ instead of $(n-1)d$ inside the bracket.',
        'This is the 25th **term** $4 + 24 \\times 3$, not the sum of the first 25 terms.',
      ],
      keyIdea: 'The sum of an arithmetic series is $S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)$, which is the number of terms times the average of the first and last terms.',
    },
    check: {
      optionValues: [1000, 2000, 1037.5, 76],
      compute: () => sumOf(arithTerms(4, 3, 25)),
    },
  },
  {
    id: 'sequences-series-007',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'In an arithmetic sequence, the 2nd term is $7$ and the 7th term is $37$. Find the first term $a$ and the common difference $d$.',
    options: ['$a = 2,\\ d = 5$', '$a = 1,\\ d = 6$', '$a = -5,\\ d = 6$', '$a = 7,\\ d = 6$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Write both facts using $u_n = a + (n-1)d$:\n\n' +
        '- $u_2 = a + d = 7$\n' +
        '- $u_7 = a + 6d = 37$\n\n' +
        'Subtract the first equation from the second: $5d = 30$, so $d = 6$.\n\n' +
        'Substitute back: $a + 6 = 7$, so $a = 1$.\n\n' +
        'Check: $1, 7, 13, 19, 25, 31, 37$. The 2nd term is 7 and the 7th term is 37.',
      whyWrong: [
        'This divides the jump of 30 by 6. From the 2nd term to the 7th term there are only $7 - 2 = 5$ steps of $d$ (count the gaps, not the terms).',
        null,
        'The difference is right but the first term is wrong: this treats the 2nd term as $a + 2d$. In fact $u_2 = a + d$, so $a = 7 - 6 = 1$.',
        'This takes the 2nd term, 7, as the first term. The first term comes one step **before** it: $7 - 6 = 1$.',
      ],
      keyIdea: 'Turn each given term into an equation $a + (n-1)d = \\text{value}$ and subtract: the number of gaps between the $p$th and $q$th terms is $q - p$.',
    },
    check: {
      optionValues: ['2,5', '1,6', '-5,6', '7,6'],
      compute: () => {
        const d = (37 - 7) / (7 - 2);
        const a = 7 - d;
        return `${a},${d}`;
      },
    },
  },
  {
    id: 'sequences-series-008',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'Find the sum of the first 6 terms of the geometric series $2 + 6 + 18 + \\dots$',
    options: ['$486$', '$1456$', '$728$', '$2186$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Here $a = 2$, $r = \\frac{6}{2} = 3$ and $n = 6$.\n\n' +
        'Use $S_n = \\frac{a(r^{n} - 1)}{r - 1}$ (the handy form when $r > 1$):\n\n' +
        '$$S_6 = \\frac{2(3^{6} - 1)}{3 - 1} = \\frac{2 \\times 728}{2} = 728$$\n\n' +
        'Check by listing: $2 + 6 + 18 + 54 + 162 + 486 = 728$.',
      whyWrong: [
        'This is $2 \\times 3^{5}$, the 6th **term**, not the sum of the first six terms.',
        'This is $2(3^{6} - 1)$: the division by $r - 1 = 2$ was forgotten.',
        null,
        'This is $\\frac{2(3^{7} - 1)}{2}$: using the power 7 adds one term too many (it is the sum of the first 7 terms).',
      ],
      keyIdea: 'The sum of the first $n$ terms of a geometric series is $S_n = \\frac{a(r^n - 1)}{r - 1}$, with power exactly $n$.',
    },
    check: {
      optionValues: [486, 1456, 728, 2186],
      compute: () => sumOf(geoTerms(2, 3, 6)),
    },
  },
  {
    id: 'sequences-series-009',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'A geometric series has first term $18$ and sum to infinity $27$. Find the common ratio $r$.',
    options: ['$\\frac{2}{3}$', '$-\\frac{1}{3}$', '$\\frac{3}{2}$', '$\\frac{1}{3}$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Use $S_\\infty = \\frac{a}{1 - r}$ with $a = 18$ and $S_\\infty = 27$:\n\n' +
        '$$27 = \\frac{18}{1 - r}$$\n\n' +
        'Multiply both sides by $1 - r$: $27(1 - r) = 18$.\n\n' +
        'Divide by 27: $1 - r = \\frac{18}{27} = \\frac{2}{3}$.\n\n' +
        'So $r = 1 - \\frac{2}{3} = \\frac{1}{3}$.\n\n' +
        'Check: $\\frac{18}{1 - \\frac{1}{3}} = \\frac{18}{\\frac{2}{3}} = 27$. Also $|r| < 1$, so the sum to infinity really exists.',
      whyWrong: [
        'This is the value of $1 - r$, not $r$. The last step, $r = 1 - \\frac{2}{3}$, was skipped.',
        'This comes from using $\\frac{a}{1 + r}$: then $1 + r = \\frac{2}{3}$ and $r = -\\frac{1}{3}$. The formula has $1 - r$.',
        'This is $\\frac{27}{18}$, the sum divided by the first term. A ratio of $\\frac{3}{2}$ is bigger than 1, so the series could not have a sum to infinity at all.',
        null,
      ],
      keyIdea: 'Substitute into $S_\\infty = \\frac{a}{1-r}$ and solve for $1 - r$ first, then for $r$.',
    },
    check: {
      optionValues: [2 / 3, -1 / 3, 3 / 2, 1 / 3],
      compute: () => new Frac(1).sub(new Frac(18, 27)).value(),
    },
  },
  {
    id: 'sequences-series-010',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'Evaluate $\\displaystyle\\sum_{k=1}^{5} 3 \\cdot 2^{k}$.',
    options: ['$186$', '$93$', '$96$', '$378$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Write out the terms by putting $k = 1, 2, 3, 4, 5$ into $3 \\cdot 2^{k}$:\n\n' +
        '$$6 + 12 + 24 + 48 + 96$$\n\n' +
        'This is a geometric series with first term $a = 6$ (the $k = 1$ term, **not** 3), ratio $r = 2$ and $n = 5$ terms:\n\n' +
        '$$S_5 = \\frac{6(2^{5} - 1)}{2 - 1} = 6 \\times 31 = 186$$\n\n' +
        'Adding directly gives the same: $6 + 12 + 24 + 48 + 96 = 186$.',
      whyWrong: [
        null,
        'This is $\\frac{3(2^{5} - 1)}{2 - 1}$: it takes the first term as 3, which would be the $k = 0$ term. The sum starts at $k = 1$, so the first term is $3 \\cdot 2 = 6$.',
        'This is only the last term ($k = 5$), not the sum of all five terms.',
        'This is $6(2^{6} - 1)$: it counts 6 terms. From $k = 1$ to $k = 5$ there are exactly 5 terms.',
      ],
      keyIdea: 'Before using a series formula on a sigma sum, find the first term by substituting the bottom value of $k$, and count the terms as top minus bottom plus 1.',
    },
    check: {
      optionValues: [186, 93, 96, 378],
      compute: () => sumOf([1, 2, 3, 4, 5].map((k) => 3 * 2 ** k)),
    },
  },
  {
    id: 'sequences-series-011',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'How many terms are there in the arithmetic sequence $9, 13, 17, \\dots, 205$?',
    options: ['$49$', '$50$', '$51$', '$196$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Here $a = 9$ and $d = 4$. Let the last term $205$ be the $n$th term:\n\n' +
        '$$9 + (n-1) \\times 4 = 205$$\n\n' +
        'Subtract 9: $(n-1) \\times 4 = 196$.\n\n' +
        'Divide by 4: $n - 1 = 49$.\n\n' +
        'Add 1: $n = 50$.\n\n' +
        'In words: there are 49 jumps of 4 from 9 up to 205, and 49 jumps join up **50** terms (like 49 gaps between 50 fence posts).',
      whyWrong: [
        'This is the number of **gaps** (jumps of 4). The number of terms is one more than the number of gaps.',
        null,
        'This is $\\frac{205}{4} = 51.25$ rounded down: it ignores the fact that the sequence starts at 9, not at 0.',
        'This is $205 - 9$, the total increase. It still needs dividing by the step size 4 (and then adding 1).',
      ],
      keyIdea: 'To count terms, solve $a + (n-1)d = \\text{last term}$: number of terms $= \\frac{\\text{last} - \\text{first}}{d} + 1$.',
    },
    check: {
      optionValues: [49, 50, 51, 196],
      compute: () => {
        let count = 0;
        for (let t = 9; t <= 205; t += 4) count++;
        return count;
      },
    },
  },
  {
    id: 'sequences-series-012',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: 'total = 0\nterm = 2\nfor i = 1 to 5\n   total = total + term\n   term = term * 3\nend for\nprint(total)',
    },
    options: ['`726`', '`80`', '`242`', '`486`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The loop adds the current term to `total`, then multiplies the term by 3. So it adds the first 5 terms of the geometric series $2 + 6 + 18 + \\dots$\n\n' +
        '`for i = 1 to 5` includes both end values, so the body runs 5 times:\n\n' +
        '| `i` | `total` after adding | `term` after multiplying |\n|---|---|---|\n| 1 | 2 | 6 |\n| 2 | 8 | 18 |\n| 3 | 26 | 54 |\n| 4 | 80 | 162 |\n| 5 | 242 | 486 |\n\n' +
        'It prints `242`. Check with the formula: $\\frac{2(3^{5} - 1)}{3 - 1} = 3^{5} - 1 = 242$.',
      whyWrong: [
        'This is $6 + 18 + 54 + 162 + 486$: it multiplies the term by 3 **before** adding it. In the code the line `total = total + term` comes first, so 2 is added.',
        'This stops after 4 passes. `for i = 1 to 5` includes `i = 5`, so the body runs 5 times.',
        null,
        'This is the final value of `term`, not `total`. The code prints `total`.',
      ],
      keyIdea: 'A loop that adds a term and then multiplies it by $r$ is computing a geometric series; `for i = 1 to n` runs exactly $n$ times.',
    },
    check: {
      optionValues: [726, 80, 242, 486],
      compute: () => {
        let total = 0;
        let term = 2;
        for (let i = 1; i <= 5; i++) {
          total += term;
          term *= 3;
        }
        return total;
      },
    },
  },
  {
    id: 'sequences-series-013',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'The 2nd term of a geometric sequence is $12$ and the 5th term is $96$. Find the first term.',
    options: ['$4.5$', '$-16$', '$24$', '$6$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Using $u_n = ar^{n-1}$:\n\n' +
        '- $u_2 = ar = 12$\n' +
        '- $u_5 = ar^{4} = 96$\n\n' +
        'Divide the second equation by the first (the $a$ cancels): $r^{3} = \\frac{96}{12} = 8$.\n\n' +
        'Take the cube root: $r = 2$.\n\n' +
        'Then $a = \\frac{12}{r} = \\frac{12}{2} = 6$.\n\n' +
        'Check: $6, 12, 24, 48, 96$. The 2nd term is 12 and the 5th is 96.',
      whyWrong: [
        'This divides 8 by 3 to get $r = \\frac{8}{3}$. But $r^{3} = 8$ needs a **cube root**, $r = 2$, then $a = 12 \\div 2 = 6$.',
        'This treats the sequence as arithmetic: $d = \\frac{96 - 12}{3} = 28$ and $a = 12 - 28$. In a geometric sequence you divide, not subtract.',
        'This multiplies by $r$ instead of dividing. The first term comes **before** the 2nd term, so $a = \\frac{12}{r}$.',
        null,
      ],
      keyIdea: 'For a geometric sequence, divide one term by another so that $a$ cancels and you get a power of $r$; then take the root.',
    },
    check: {
      optionValues: [4.5, -16, 24, 6],
      compute: () => {
        const r = Math.round(Math.cbrt(96 / 12));
        return 12 / r;
      },
    },
  },
  {
    id: 'sequences-series-014',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'For which values of $x$ does the geometric series $1 + 2x + 4x^{2} + 8x^{3} + \\dots$ have a sum to infinity?',
    options: ['$-\\frac{1}{2} < x < \\frac{1}{2}$', '$-1 < x < 1$', '$x < \\frac{1}{2}$', '$-2 < x < 2$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Find the common ratio by dividing a term by the one before it: $r = \\frac{4x^{2}}{2x} = 2x$ (and $2x \\div 1 = 2x$ too). So each term is the one before times $2x$.\n\n' +
        'A sum to infinity exists when $|r| < 1$:\n\n' +
        '$$|2x| < 1 \\quad\\Longleftrightarrow\\quad -1 < 2x < 1$$\n\n' +
        'Divide every part by 2: $-\\frac{1}{2} < x < \\frac{1}{2}$.',
      whyWrong: [
        null,
        'This applies the condition to $x$ instead of to the ratio. The ratio is $2x$, so it is $|2x| < 1$ that is needed.',
        'This forgets the lower limit. For example $x = -3$ gives $r = -6$, and the terms $1, -6, 36, \\dots$ grow without limit.',
        'This multiplies by 2 instead of dividing: from $-1 < 2x < 1$ you divide every part by 2.',
      ],
      keyIdea: 'Find the ratio as an expression in $x$, then solve $-1 < r < 1$.',
    },
  },
  {
    id: 'sequences-series-018',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    stem: 'Evaluate $\\displaystyle\\sum_{k=11}^{30} (3k - 2)$.',
    options: ['$1335$', '$1130.5$', '$1159$', '$1190$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The terms go up by 3 each time, so this is an arithmetic series.\n\n' +
        '- First term ($k = 11$): $3 \\times 11 - 2 = 31$\n' +
        '- Last term ($k = 30$): $3 \\times 30 - 2 = 88$\n' +
        '- Number of terms: $30 - 11 + 1 = 20$\n\n' +
        'Use $S = \\frac{n}{2}(\\text{first} + \\text{last})$:\n\n' +
        '$$S = \\frac{20}{2}(31 + 88) = 10 \\times 119 = 1190$$\n\n' +
        'Another way: (sum from 1 to 30) minus (sum from 1 to **10**) $= \\frac{30}{2}(1 + 88) - \\frac{10}{2}(1 + 28) = 1335 - 145 = 1190$.',
      whyWrong: [
        'This is the sum from $k = 1$ to $k = 30$. The sum starts at $k = 11$, so the first 10 terms must not be included.',
        'This counts $30 - 11 = 19$ terms. Counting from 11 to 30 **inclusive** gives $30 - 11 + 1 = 20$ terms.',
        'This subtracts the sum from 1 to 11, which removes the $k = 11$ term as well. To keep $k = 11$ you subtract only the sum from 1 to 10.',
        null,
      ],
      keyIdea: 'When a sigma sum does not start at 1, find the first and last terms by substitution and count terms as top $-$ bottom $+ 1$.',
    },
    check: {
      optionValues: [1335, 1130.5, 1159, 1190],
      compute: () => {
        let s = 0;
        for (let k = 11; k <= 30; k++) s += 3 * k - 2;
        return s;
      },
    },
  },
];
