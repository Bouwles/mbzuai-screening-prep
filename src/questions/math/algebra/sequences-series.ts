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
      asking: 'What is the 20th number in this list, which goes up by the same amount each time?',
      solution:
        'An **arithmetic sequence** goes up or down by the same amount each time. That amount is the **common difference**, $d$. Here $11 - 7 = 4$, so $d = 4$. The first term is $a = 7$.\n\n' +
        'The formula for the $n$th term is $u_n = a + (n - 1)d$. Why $n - 1$? To reach the 2nd term you add $d$ once, and to reach the 3rd you add it twice. So to reach the 20th term you add it 19 times.\n\n' +
        'Substitute $a = 7$, $n = 20$ and $d = 4$: $u_{20} = 7 + (20 - 1) \\times 4 = 7 + 19 \\times 4$.\n\n' +
        'Multiply first: $19 \\times 4 = 76$. Then add: $7 + 76 = 83$.',
      conclusion: 'Starting at 7 and adding 4 nineteen times reaches 83, so the answer is $83$.',
      whyWrong: [
        'This is $7 + 20 \\times 4$: it uses $n$ instead of $n - 1$. Going from the 1st term to the 20th term takes only 19 steps of $+4$.',
        'This is $19 \\times 4$: the 19 steps are right, but the starting value $a = 7$ was never added on.',
        null,
        'This is the **sum** of the first 20 terms, $\\frac{20}{2}(7 + 83) = 900$, not the 20th term itself.',
      ],
      keyIdea: 'For a term in an arithmetic sequence (equal gaps between numbers), find $a$ and $d$, then use $u_n = a + (n - 1)d$. Count gaps, not terms: the $n$th term is $n - 1$ gaps from the start.',
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
      asking: 'What is the 7th number in this list, where each number is multiplied by the same amount?',
      solution:
        'A **geometric sequence** multiplies by the same number each time, called the **common ratio**, $r$. Divide any term by the one before: $-6 \\div 3 = -2$. So $r = -2$, and the first term is $a = 3$.\n\n' +
        'The formula is $u_n = ar^{n-1}$. Why $n - 1$? To reach the 2nd term you multiply by $r$ once, so to reach the 7th you multiply by it 6 times.\n\n' +
        'Substitute $a = 3$, $r = -2$ and $n = 7$: $u_7 = 3 \\times (-2)^{6}$.\n\n' +
        'A negative number to an even power is positive, because the minus signs pair up and cancel. So $(-2)^6 = 2^6 = 64$.\n\n' +
        'Multiply: $3 \\times 64 = 192$.',
      conclusion: 'The power is even, so the result is positive, and the answer is $192$.',
      whyWrong: [
        null,
        'The size is right but the sign is wrong. $(-2)^{6}$ is positive because the power is even; in this sequence every odd-numbered term is positive.',
        'This is $3 \\times (-2)^{7}$: it uses the power $n$ instead of $n - 1$, which gives the 8th term.',
        'This is $3 \\times (-2)^{5}$, the 6th term: the power is one too small, so you have stopped one term early.',
      ],
      keyIdea: 'For a term in a geometric sequence (a fixed multiplier), find $a$ and $r$, then use $u_n = ar^{n-1}$. If $r$ is negative, an even power gives a positive result and an odd power a negative one.',
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
      asking: 'What do you get by adding $2k + 1$ for $k = 1, 2, 3, 4$?',
      solution:
        'The symbol $\\sum$ (sigma) means add up. The numbers on it tell you to start at $k = 1$ and finish at $k = 4$. For each $k$, work out $2k + 1$, then add the results.\n\n' +
        'Work out each term:\n\n| $k$ | $2k + 1$ | Value |\n|---|---|---|\n| 1 | $2 \\times 1 + 1$ | 3 |\n| 2 | $2 \\times 2 + 1$ | 5 |\n| 3 | $2 \\times 3 + 1$ | 7 |\n| 4 | $2 \\times 4 + 1$ | 9 |\n\n' +
        'Add the values: $3 + 5 + 7 + 9 = 24$.',
      conclusion: 'The four terms 3, 5, 7 and 9 total 24, so the answer is $24$.',
      whyWrong: [
        'This is $2(1 + 2 + 3 + 4) + 1 = 21$: the $+1$ belongs to **every** term, so it must be added 4 times, not once.',
        null,
        'This is $1 + 3 + 5 + 7$, the values for $k = 0, 1, 2, 3$: the counting has been started one place too early. The bottom number says start at $k = 1$, so the terms are $3, 5, 7, 9$.',
        'This is only the last term ($k = 4$). Sigma means add up the terms for every value of $k$ from 1 to 4.',
      ],
      keyIdea: 'For sigma notation, put each value of $k$ from the bottom number to the top number into the expression, in a small table, then add the results. Every term gets the whole expression, including any added number.',
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
      asking: 'What total do these endlessly shrinking terms settle towards?',
      solution:
        'This is a **geometric series**: each term is the previous one multiplied by the same number, the **common ratio** $r$. Here $6 \\div 12 = \\frac{1}{2}$, so $r = \\frac{1}{2}$. The first term is $a = 12$.\n\n' +
        'The terms keep halving and get closer and closer to 0. So the total settles at a fixed value, called the **sum to infinity**. This happens only when $r$ is between $-1$ and 1.\n\n' +
        'The formula is $S_\\infty = \\frac{a}{1 - r}$. Substitute: $S_\\infty = \\frac{12}{1 - \\frac{1}{2}} = \\frac{12}{\\frac{1}{2}}$.\n\n' +
        'Dividing by $\\frac{1}{2}$ is the same as multiplying by 2: $12 \\times 2 = 24$.',
      conclusion: 'Adding more and more terms gets closer and closer to 24, so the answer is $24$.',
      whyWrong: [
        'This is $\\frac{12}{1 + \\frac{1}{2}}$: the formula has $1 - r$ in the denominator, not $1 + r$.',
        'This is only $12 + 6 + 3$, the three terms that are shown. The series continues forever and those extra terms add another 3.',
        'A sum to infinity exists whenever $|r| < 1$. Here $r = \\frac{1}{2}$, so the terms shrink to 0 and the total settles at a finite value.',
        null,
      ],
      keyIdea: 'To spot this type, look for a geometric series with shrinking terms. Find $a$ and $r$, make sure $r$ is between $-1$ and 1, then use $S_\\infty = \\frac{a}{1 - r}$.',
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
      asking: 'In which series do the terms shrink towards 0, so the total can settle?',
      solution:
        'The total of an endless geometric series settles only if the terms shrink towards 0. That happens when the size of the **common ratio** $r$, ignoring its sign, is less than 1. We write this as $|r| < 1$.\n\n' +
        'Find $r$ for each series by dividing a term by the one before:\n\n| Series | $r$ | Size below 1? |\n|---|---|---|\n| $2 + 3 + 4.5 + \\dots$ | $1.5$ | No |\n| $5 - 10 + 20 - \\dots$ | $-2$ | No |\n| $8 - 4 + 2 - 1 + \\dots$ | $-\\frac{1}{2}$ | Yes |\n| $3 + 3 + 3 + \\dots$ | $1$ | No |',
      conclusion: 'Only $r = -\\frac{1}{2}$ has a size below 1, so the answer is $8 - 4 + 2 - 1 + \\dots$',
      whyWrong: [
        'Here $r = 1.5$. The terms get **bigger**, so the total grows without limit.',
        'Here $r = -2$. The signs alternate, but the size of the terms doubles each time, so the total swings further and further and never settles.',
        null,
        'Here $r = 1$. The terms never shrink, so after $n$ terms the total is $3n$, which grows forever. The condition is strictly $|r| < 1$.',
      ],
      keyIdea: 'To test for a sum to infinity: find $r$ by dividing a term by the one before, then see whether $|r| < 1$. A negative $r$ is fine, because only its size matters.',
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
      asking: 'Which formula gives any term of a sequence that adds $d$ each time?',
      solution:
        'An **arithmetic sequence** starts at $a$ and adds the **common difference** $d$ each time. Write out the start: $a$, then $a + d$, then $a + 2d$, then $a + 3d$.\n\n' +
        'Compare the term number with how many $d$s it has: the 1st has 0, the 2nd has 1, the 3rd has 2. The count of $d$s is always one less than the term number, so the $n$th term has $n - 1$ of them: $a + (n-1)d$.',
      conclusion: 'Putting $n = 1$ gives just $a$, the first term, as it should. So the answer is $a + (n-1)d$.',
      whyWrong: [
        null,
        'This adds $d$ one time too many: with $n = 1$ it gives $a + d$, not the first term $a$.',
        'This is the $n$th term of a **geometric** sequence, with common ratio $r$.',
        'This is the **sum** of the first $n$ terms, not the $n$th term.',
      ],
      keyIdea: 'Use $u_n = a + (n-1)d$ for arithmetic and $u_n = ar^{n-1}$ for geometric. Test any formula with $n = 1$: it must give the first term.',
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
      asking: 'What number does each term get multiplied by to reach the next?',
      solution:
        'In a **geometric sequence**, each term is the one before multiplied by a fixed number, the **common ratio**. To find it, divide a term by the term before it.\n\n' +
        '$6 \\div 2 = 3$. Test on the next pairs to be sure: $18 \\div 6 = 3$ and $54 \\div 18 = 3$.',
      conclusion: 'Every pair gives 3, so the common ratio is $3$.',
      whyWrong: [
        null,
        '$4$ is the difference $6 - 2$. In a geometric sequence you divide, not subtract.',
        '$2$ is the first term, not the ratio.',
        'This divides a term by the one **after** it. The ratio is the next term divided by the previous one.',
      ],
      keyIdea: 'Common ratio $=$ any term $\\div$ the term before it. Test on two different pairs: a fixed result means geometric. If instead the gaps are equal, the sequence is arithmetic.',
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
      asking: 'How much is added to each term to get the next one?',
      solution:
        'In an **arithmetic sequence**, the same amount is added each time. That amount is the **common difference**. To find it, take a term and subtract the term before it.\n\n' +
        '$2 - 5 = -3$. Test on the next pairs to be sure: $-1 - 2 = -3$ and $-4 - (-1) = -4 + 1 = -3$.',
      conclusion: 'Every pair gives the same result, because the sequence falls by 3 each time. So the answer is $-3$.',
      whyWrong: [
        null,
        'This subtracts the wrong way round, $5 - 2$. The sequence falls, so the difference is negative.',
        '$-4$ is the 4th term, not the difference.',
        'This divides the second term by the first, $2 \\div 5$. Dividing is how you look for a ratio in a geometric sequence, but this sequence adds the same amount each time.',
      ],
      keyIdea: 'Common difference $=$ any term minus the term before it, in that order. A sequence that falls has a negative difference. Test on two pairs to confirm the gaps are equal.',
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
      asking: 'For which values of $r$ does the total of an endless geometric series settle at a fixed value?',
      solution:
        'The **sum to infinity** exists only if the terms shrink towards 0. Otherwise the total keeps growing or keeps swinging.\n\n' +
        'Each term is the last one times $r$. The terms shrink only if the size of $r$, ignoring its sign, is less than 1. For example, $r = -\\frac{1}{2}$ gives $1, -\\frac{1}{2}, \\frac{1}{4}$ and so on, which shrinks.\n\n' +
        '$r = 1$ and $r = -1$ do not work, because the terms stay the same size. And $r = -3$ gives $1, -3, 9$ and so on, which grows. We write "size of $r$ below 1" as $|r| < 1$.',
      conclusion: 'Only a ratio whose size is below 1 makes the terms shrink, so the answer is $|r| < 1$.',
      whyWrong: [
        null,
        'This also allows values such as $r = -3$, where the terms grow in size: $1, -3, 9, -27, \\dots$',
        'Here the terms keep growing, so the total grows without limit.',
        'This includes $r = 1$ and $r = -1$, where the terms never shrink. The inequality must be strict.',
      ],
      keyIdea: 'The bars mean size, ignoring the sign. $|r| < 1$ means $-1 < r < 1$. Use this to test any series, and to find unknowns when $r$ contains a letter.',
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
      asking: 'What stays the same from one term to the next in an arithmetic progression?',
      solution:
        'An **arithmetic progression** is another name for an arithmetic sequence: a list made by adding the same number each time.\n\n' +
        'Take $4, 7, 10, 13$. The differences are $7 - 4 = 3$, $10 - 7 = 3$ and $13 - 10 = 3$, always the same. The ratios, sums and products of neighbouring terms all change.',
      conclusion: 'Adding the same number every time keeps the gap fixed, so the answer is the difference of consecutive terms.',
      whyWrong: [
        null,
        'A constant ratio defines a **geometric** progression.',
        'The sums change: in $4, 7, 10, \\dots$ they are 11, then 17.',
        'The products change: in $4, 7, 10, \\dots$ they are 28, then 70.',
      ],
      keyIdea: 'Arithmetic means a constant difference, from adding. Geometric means a constant ratio, from multiplying. To classify a list, subtract neighbours, then divide neighbours, and see which result stays the same.',
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
      asking: 'What do the first 25 numbers in this list add up to?',
      solution:
        'This is an **arithmetic sequence**: it goes up by the same amount each time. The first term is $a = 4$ and the **common difference** is $d = 7 - 4 = 3$. We want $n = 25$ terms.\n\n' +
        'Adding 25 terms by hand is slow, so use the sum formula: $S_n = \\frac{n}{2}(2a + (n - 1)d)$. It is the number of terms times the average of the first and last terms.\n\n' +
        'Substitute: $S_{25} = \\frac{25}{2}(2 \\times 4 + 24 \\times 3)$.\n\n' +
        'Work out the bracket: $2 \\times 4 = 8$ and $24 \\times 3 = 72$, so $8 + 72 = 80$.\n\n' +
        'Finish: $\\frac{25}{2} \\times 80 = 25 \\times 40 = 1000$.',
      conclusion: 'The bracket is 80, and half of 25 lots of 80 is the total, so the answer is $1000$.',
      whyWrong: [
        null,
        'This is $25 \\times (4 + 76)$: the formula is $\\frac{n}{2}(a + l)$, and the division by 2 was forgotten.',
        'This is $\\frac{25}{2}(8 + 25 \\times 3)$: it uses $nd$ instead of $(n-1)d$ inside the bracket.',
        'This is the 25th **term** $4 + 24 \\times 3$, not the sum of the first 25 terms.',
      ],
      keyIdea: 'To add up an arithmetic sequence, find $a$, $d$ and $n$, then use $S_n = \\frac{n}{2}(2a + (n - 1)d)$. If you already know the last term $l$, use $S_n = \\frac{n}{2}(a + l)$.',
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
      asking: 'What are the first term and the step size of this sequence?',
      solution:
        'An arithmetic sequence has $n$th term $u_n = a + (n - 1)d$, where $a$ is the first term and $d$ is the **common difference**. Apply this to both facts.\n\n' +
        'The 2nd term gives $a + d = 7$. The 7th term gives $a + 6d = 37$.\n\n' +
        'Subtract the first equation from the second to remove $a$: $(a + 6d) - (a + d) = 37 - 7$, so $5d = 30$.\n\n' +
        'Divide both sides by 5: $d = 6$.\n\n' +
        'Put $d = 6$ into $a + d = 7$: $a + 6 = 7$, so $a = 1$.',
      conclusion: 'The sequence runs $1, 7, 13, 19, 25, 31, 37$, so its 2nd term is 7 and its 7th is 37. The answer is $a = 1,\\ d = 6$.',
      whyWrong: [
        'This divides the jump of 30 by 6. From the 2nd term to the 7th term there are only $7 - 2 = 5$ steps of $d$ (count the gaps, not the terms).',
        null,
        'The difference is right but the first term is wrong: this treats the 2nd term as $a + 2d$. In fact $u_2 = a + d$, so $a = 7 - 6 = 1$.',
        'This takes the 2nd term, 7, as the first term. The first term comes one step **before** it: $7 - 6 = 1$.',
      ],
      keyIdea: 'Given two terms of an arithmetic sequence, write each as $a + (n - 1)d$ and subtract to remove $a$. Divide by the number of gaps to find $d$, then substitute back to find $a$.',
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
      asking: 'What do the first 6 terms of this series add up to?',
      solution:
        'This is a **geometric series**: each term is the last one multiplied by the same number, the **common ratio**. Here $a = 2$ is the first term and $r = 6 \\div 2 = 3$ is the ratio. We want $n = 6$ terms.\n\n' +
        'The formula for the sum of $n$ terms is $S_n = \\frac{a(r^n - 1)}{r - 1}$. This form is the neatest when $r$ is bigger than 1.\n\n' +
        'Substitute: $S_6 = \\frac{2(3^6 - 1)}{3 - 1}$.\n\n' +
        'Work out the power: $3^6 = 729$. So the top is $2 \\times (729 - 1) = 2 \\times 728$, and the bottom is 2.\n\n' +
        'The 2s cancel, leaving 728. Adding by hand agrees: $2 + 6 + 18 + 54 + 162 + 486 = 728$.',
      conclusion: 'Both the formula and the direct sum agree, so the answer is $728$.',
      whyWrong: [
        'This is $2 \\times 3^{5}$, the 6th **term**, not the sum of the first six terms.',
        'This is $2(3^{6} - 1)$: the division by $r - 1 = 2$ was forgotten.',
        null,
        'This is $\\frac{2(3^{7} - 1)}{2}$: using the power 7 adds one term too many (it is the sum of the first 7 terms).',
      ],
      keyIdea: 'To add up a geometric series, find $a$, $r$ and $n$, then use $S_n = \\frac{a(r^n - 1)}{r - 1}$. With only a few terms, you can also list them and add them.',
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
      asking: 'What common ratio gives a first term of 18 and an endless total of 27?',
      solution:
        'The **sum to infinity** of a geometric series is $S_\\infty = \\frac{a}{1 - r}$, where $a$ is the first term and $r$ is the common ratio. We know $a$ and $S_\\infty$, so we solve for $r$.\n\n' +
        'Substitute: $27 = \\frac{18}{1 - r}$.\n\n' +
        'Multiply both sides by $1 - r$ to clear the fraction: $27(1 - r) = 18$.\n\n' +
        'Divide both sides by 27: $1 - r = \\frac{18}{27} = \\frac{2}{3}$.\n\n' +
        'Subtract from 1 to find $r$: $r = 1 - \\frac{2}{3} = \\frac{1}{3}$.',
      conclusion: 'Putting it back gives $18 \\div \\frac{2}{3} = 27$, which matches. So the answer is $\\frac{1}{3}$.',
      whyWrong: [
        'This is the value of $1 - r$, not $r$. The last step, $r = 1 - \\frac{2}{3}$, was skipped.',
        'This comes from using $\\frac{a}{1 + r}$: then $1 + r = \\frac{2}{3}$ and $r = -\\frac{1}{3}$. The formula has $1 - r$.',
        'This is $\\frac{27}{18}$, the sum divided by the first term. A ratio of $\\frac{3}{2}$ is bigger than 1, so the series could not have a sum to infinity at all.',
        null,
      ],
      keyIdea: 'When the sum to infinity is given and $r$ is unknown, put the values into $S_\\infty = \\frac{a}{1 - r}$ and rearrange for $r$. Your result must be between $-1$ and 1.',
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
      asking: 'What do you get by adding $3 \\cdot 2^k$ for $k = 1$ to $5$?',
      solution:
        'The symbol $\\sum$ means add up. Start at $k = 1$, finish at $k = 5$, and for each $k$ work out $3 \\cdot 2^k$, where the dot means multiply.\n\n' +
        'Work out each term:\n\n| $k$ | Working | Value |\n|---|---|---|\n| 1 | $3 \\times 2$ | 6 |\n| 2 | $3 \\times 4$ | 12 |\n| 3 | $3 \\times 8$ | 24 |\n| 4 | $3 \\times 16$ | 48 |\n| 5 | $3 \\times 32$ | 96 |\n\n' +
        'Add them in stages: $6 + 12 = 18$, then $18 + 24 = 42$, then $42 + 48 = 90$, then $90 + 96 = 186$.',
      conclusion: 'The five terms total 186, so the answer is $186$.',
      whyWrong: [
        null,
        'This is $\\frac{3(2^{5} - 1)}{2 - 1}$: it takes the first term as 3, which would be the $k = 0$ term. The sum starts at $k = 1$, so the first term is $3 \\cdot 2 = 6$.',
        'This is only the last term ($k = 5$), not the sum of all five terms.',
        'This is $6(2^{6} - 1)$: it counts 6 terms. From $k = 1$ to $k = 5$ there are exactly 5 terms.',
      ],
      keyIdea: 'With only a few terms, write them out in a table and add them. For many terms of a geometric sigma, find $a$ from the first term and $r$ from the ratio, count the terms, and use the sum formula.',
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
      asking: 'How many numbers are in this list from 9 up to 205?',
      solution:
        'This is an arithmetic sequence: it goes up by 4 each time. We want $n$, the position of 205. The $n$th term is $u_n = a + (n - 1)d$, with first term $a = 9$ and common difference $d = 4$.\n\n' +
        'The last term is 205, so $205 = 9 + (n - 1) \\times 4$.\n\n' +
        'Subtract 9 from both sides: $196 = (n - 1) \\times 4$.\n\n' +
        'Divide both sides by 4: $n - 1 = 49$. This means there are 49 gaps of 4 between the first and last terms.\n\n' +
        'A list has one more term than it has gaps, so $n = 49 + 1 = 50$.',
      conclusion: '49 gaps of 4 take us from 9 to 205, and 49 gaps means one more term. So the answer is $50$.',
      whyWrong: [
        'This is the number of **gaps** (jumps of 4). The number of terms is one more than the number of gaps.',
        null,
        'This is $\\frac{205}{4} = 51.25$ rounded down: it ignores the fact that the sequence starts at 9, not at 0.',
        'This is $205 - 9$, the total increase. It still needs dividing by the step size 4 (and then adding 1).',
      ],
      keyIdea: 'Number of terms $= \\frac{\\text{last} - \\text{first}}{d} + 1$. The fraction counts the gaps, and the $+1$ turns gaps into terms. A small test: $3, 5, 7$ has 2 gaps and 3 terms.',
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
      asking: 'What number is in `total` when the loop ends and it gets printed?',
      solution:
        'Line 1 sets `total` to 0, and line 2 sets `term` to 2. Line 3, `for i = 1 to 5`, repeats lines 4 and 5 five times, with `i` taking the values 1, 2, 3, 4, 5.\n\n' +
        'In each pass, line 4 adds the current `term` to `total`. Then line 5 multiplies `term` by 3. The order matters: the term is added **before** it is multiplied.\n\n' +
        'Trace each pass:\n\n| `i` | `term` at start | `total` becomes | `term` becomes |\n|---|---|---|---|\n| 1 | 2 | 2 | 6 |\n| 2 | 6 | 8 | 18 |\n| 3 | 18 | 26 | 54 |\n| 4 | 54 | 80 | 162 |\n| 5 | 162 | 242 | 486 |\n\n' +
        'After the loop, line 7 prints `total`, which holds 242. `term` is 486 at this point, but it is not printed.',
      conclusion: 'The code adds 2, 6, 18, 54 and 162, then prints the total, so the answer is `242`.',
      whyWrong: [
        'This is $6 + 18 + 54 + 162 + 486$: it multiplies the term by 3 **before** adding it. In the code the line `total = total + term` comes first, so 2 is added.',
        'This stops after 4 passes. `for i = 1 to 5` includes `i = 5`, so the body runs 5 times.',
        null,
        'This is the final value of `term`, not `total`. The code prints `total`.',
      ],
      keyIdea: 'To trace a loop, draw a table with one row per pass and a column for each variable. Update in the same order as the code. This loop builds a geometric series: `term` holds each term, `total` the running sum.',
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
      asking: 'What is the first term of this geometric sequence?',
      solution:
        'A geometric sequence multiplies by the same number each time, the **common ratio** $r$. Its $n$th term is $u_n = ar^{n-1}$, where $a$ is the first term.\n\n' +
        'The 2nd term gives $ar = 12$. The 5th term gives $ar^4 = 96$.\n\n' +
        'Divide the second equation by the first to remove $a$: $\\frac{ar^4}{ar} = \\frac{96}{12}$. This gives $r^3 = 8$.\n\n' +
        'Take the cube root of both sides: $r = 2$, because $2 \\times 2 \\times 2 = 8$.\n\n' +
        'Put $r = 2$ into $ar = 12$: $2a = 12$, so $a = 6$.',
      conclusion: 'The sequence runs $6, 12, 24, 48, 96$, so its 2nd term is 12 and its 5th is 96. The answer is $6$.',
      whyWrong: [
        'This divides 8 by 3 to get $r = \\frac{8}{3}$. But $r^{3} = 8$ needs a **cube root**, $r = 2$, then $a = 12 \\div 2 = 6$.',
        'This treats the sequence as arithmetic: $d = \\frac{96 - 12}{3} = 28$ and $a = 12 - 28$. In a geometric sequence you divide, not subtract.',
        'This multiplies by $r$ instead of dividing. The first term comes **before** the 2nd term, so $a = \\frac{12}{r}$.',
        null,
      ],
      keyIdea: 'Given two terms of a geometric sequence, write both as $ar^{n-1}$ and divide to remove $a$. Take a root to find $r$, then substitute back. With two terms of an arithmetic sequence, subtract instead.',
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
      asking: 'Which values of $x$ make this endless series settle to a fixed total?',
      solution:
        'This is a **geometric series**. Find the **common ratio** by dividing a term by the one before: $2x \\div 1 = 2x$. The next pair agrees: $4x^2 \\div 2x = 2x$. So $r = 2x$.\n\n' +
        'A sum to infinity exists only if the terms shrink, which needs the size of $r$ to be less than 1. So $|r| < 1$, which means $|2x| < 1$.\n\n' +
        'Less than 1 in size means between $-1$ and 1: $-1 < 2x < 1$.\n\n' +
        'Divide all three parts by 2: $-\\frac{1}{2} < x < \\frac{1}{2}$.',
      conclusion: 'In this range the ratio $2x$ has a size below 1, so the answer is $-\\frac{1}{2} < x < \\frac{1}{2}$.',
      whyWrong: [
        null,
        'This applies the condition to $x$ instead of to the ratio. The ratio is $2x$, so it is $|2x| < 1$ that is needed.',
        'This forgets the lower limit. For example $x = -3$ gives $r = -6$, and the terms $1, -6, 36, \\dots$ grow without limit.',
        'This multiplies by 2 instead of dividing: from $-1 < 2x < 1$ you divide every part by 2.',
      ],
      keyIdea: 'When the ratio contains a letter, find $r$ by dividing neighbouring terms, then solve $-1 < r < 1$ for the letter. Do the same to all three parts.',
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
      asking: 'What do you get by adding $3k - 2$ for every $k$ from 11 to 30?',
      solution:
        'The symbol $\\sum$ means add up. As $k$ goes up by 1, $3k - 2$ goes up by 3. So the terms form an **arithmetic sequence**, and we can use the quick formula: sum $= \\frac{n}{2}(\\text{first} + \\text{last})$, where $n$ is the number of terms.\n\n' +
        'Find the first term, with $k = 11$: $3 \\times 11 - 2 = 31$. Find the last term, with $k = 30$: $3 \\times 30 - 2 = 88$.\n\n' +
        'Count the terms. From 11 to 30, including both ends: $30 - 11 + 1 = 20$ terms.\n\n' +
        'Substitute: $\\frac{20}{2}(31 + 88) = 10 \\times 119 = 1190$.',
      conclusion: '20 terms averaging 59.5 total 1190, so the answer is $1190$.',
      whyWrong: [
        'This is the sum from $k = 1$ to $k = 30$. The sum starts at $k = 11$, so the first 10 terms must not be included.',
        'This counts $30 - 11 = 19$ terms. Counting from 11 to 30 **inclusive** gives $30 - 11 + 1 = 20$ terms.',
        'This subtracts the sum from 1 to 11, which removes the $k = 11$ term as well. To keep $k = 11$ you subtract only the sum from 1 to 10.',
        null,
      ],
      keyIdea: 'A sigma of a linear term such as $3k - 2$ is arithmetic. Find the first and last values, count the terms with top $-$ bottom $+ 1$, then use $\\frac{n}{2}(\\text{first} + \\text{last})$.',
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
