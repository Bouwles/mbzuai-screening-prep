import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'sequences-series',
  know:
    '### Sequences and series: the words\n\n' +
    'A **sequence** is a list of numbers in order, like $5, 8, 11, 14, \\dots$ Each number is a **term**. We write the first term as $u_1$, the second as $u_2$, and the $n$th term as $u_n$.\n\n' +
    'A **series** is what you get when you **add** the terms: $5 + 8 + 11 + 14$. The sum of the first $n$ terms is written $S_n$.\n\n' +
    'The exam mostly uses two kinds: **arithmetic** (add the same number each time) and **geometric** (multiply by the same number each time).\n\n' +
    '### Arithmetic sequences: add the same amount\n\n' +
    'In $5, 8, 11, 14, \\dots$ you add 3 each time. The first term is $a = 5$ and the **common difference** is $d = 3$. Find $d$ by subtracting any term from the next one: $d = u_2 - u_1$. If the sequence goes down, $d$ is negative.\n\n' +
    'To reach the $n$th term you start at $a$ and add $d$ exactly $n - 1$ times (to get to the 2nd term you add $d$ once, not twice). So\n\n' +
    '$$u_n = a + (n-1)d$$\n\n' +
    'For the sum, pair the first term with the last term, the second with the second-last, and so on: every pair adds to the same total. That gives\n\n' +
    '$$S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right) = \\frac{n}{2}(a + l)$$\n\n' +
    'where $l$ is the last term. In words: number of terms times the average of the first and last terms.\n\n' +
    '### Geometric sequences: multiply by the same amount\n\n' +
    'In $3, 6, 12, 24, \\dots$ you multiply by 2 each time. The first term is $a = 3$ and the **common ratio** is $r = 2$. Find $r$ by dividing a term by the one before it: $r = \\frac{u_2}{u_1}$. The ratio can be a fraction (terms shrink) or negative (signs alternate).\n\n' +
    'To reach the $n$th term, multiply $a$ by $r$ exactly $n - 1$ times:\n\n' +
    '$$u_n = ar^{n-1}$$\n\n' +
    'The sum of the first $n$ terms (for $r \\ne 1$) is\n\n' +
    '$$S_n = \\frac{a(r^{n} - 1)}{r - 1} = \\frac{a(1 - r^{n})}{1 - r}$$\n\n' +
    'Both versions give the same answer; use the first when $r > 1$ and the second when $r < 1$ to avoid negative signs.\n\n' +
    '### Sum to infinity\n\n' +
    'If the terms of a geometric series shrink towards 0, adding "forever" settles down to a fixed total. For example $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$ gets closer and closer to 2. This happens **only** when $-1 < r < 1$, written $|r| < 1$. Then\n\n' +
    '$$S_\\infty = \\frac{a}{1 - r}$$\n\n' +
    'If $|r| \\ge 1$ (for example $r = 2$, $r = -3$ or $r = 1$) the terms do not shrink and there is **no** sum to infinity. An arithmetic series (with $d \\ne 0$) never has a sum to infinity either.\n\n' +
    '### Sigma notation\n\n' +
    '$\\sum$ (the Greek capital letter sigma) means "add up". For example\n\n' +
    '$$\\sum_{k=1}^{4} (2k+1) = 3 + 5 + 7 + 9 = 24$$\n\n' +
    'Put each whole number from the bottom value to the top value into the expression and add. The number of terms is top $-$ bottom $+ 1$. If the expression is linear in $k$ (like $3k - 2$), the sum is arithmetic; if $k$ is in the power (like $5 \\cdot 2^{k}$), it is geometric. Find the first term by substituting the **bottom** value of $k$.\n\n' +
    '### Finding terms from given information\n\n' +
    'Many exam questions give two facts and ask for something else. The method is always the same:\n\n' +
    '1. Write each fact as an equation, for example $u_3 = a + 2d = 11$.\n' +
    '2. Arithmetic: **subtract** the equations to get $d$. Geometric: **divide** them to get a power of $r$.\n' +
    '3. Substitute back to get $a$, then answer the actual question.\n\n' +
    '| | Arithmetic | Geometric |\n|---|---|---|\n| Next term | add $d$ | multiply by $r$ |\n| $n$th term | $a + (n-1)d$ | $ar^{n-1}$ |\n| Sum of $n$ terms | $\\frac{n}{2}\\left(2a + (n-1)d\\right)$ | $\\frac{a(r^{n} - 1)}{r - 1}$ |\n| Sum to infinity | never (if $d \\ne 0$) | $\\frac{a}{1-r}$ if $\\lvert r \\rvert < 1$ |',
  formulas: [
    { label: 'Arithmetic: nth term', tex: 'u_n = a + (n-1)d', note: '$a$ = first term, $d$ = common difference $= u_2 - u_1$.' },
    { label: 'Arithmetic: sum of first n terms', tex: 'S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)' },
    { label: 'Arithmetic: sum using the last term', tex: 'S_n = \\frac{n}{2}(a + l)', note: '$l$ = last term. Number of terms times the average of first and last.' },
    { label: 'Number of terms from first to last', tex: 'n = \\frac{l - a}{d} + 1', note: 'Count the gaps, then add 1.' },
    { label: 'Geometric: nth term', tex: 'u_n = ar^{n-1}', note: '$r$ = common ratio $= \\frac{u_2}{u_1}$.' },
    { label: 'Geometric: sum of first n terms', tex: 'S_n = \\frac{a(r^{n} - 1)}{r - 1} = \\frac{a(1 - r^{n})}{1 - r}', note: 'Valid for any $r \\ne 1$.' },
    { label: 'Geometric: sum to infinity', tex: 'S_\\infty = \\frac{a}{1 - r}', note: 'Exists only when $|r| < 1$, that is $-1 < r < 1$.' },
    { label: 'Sigma notation: number of terms', tex: '\\sum_{k=m}^{n} f(k) \\text{ has } n - m + 1 \\text{ terms}' },
    { label: 'Sum of the first n positive whole numbers', tex: '1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2}' },
  ],
  examples: [
    {
      title: 'Arithmetic nth term and sum',
      problem: 'For the arithmetic sequence $5, 8, 11, \\dots$ find the 30th term and the sum of the first 30 terms.',
      steps: [
        'First term $a = 5$, common difference $d = 8 - 5 = 3$, $n = 30$.',
        '30th term: $u_{30} = 5 + 29 \\times 3 = 5 + 87 = 92$.',
        'Sum using first and last terms: $S_{30} = \\frac{30}{2}(5 + 92) = 15 \\times 97$.',
        '$15 \\times 97 = 1455$.',
      ],
      answer: '$u_{30} = 92$ and $S_{30} = 1455$.',
    },
    {
      title: 'Geometric sum and sum to infinity',
      problem: 'For the geometric series $40 + 20 + 10 + \\dots$ find the sum of the first 5 terms and the sum to infinity.',
      steps: [
        'First term $a = 40$, ratio $r = \\frac{20}{40} = \\frac{1}{2}$.',
        'Since $r < 1$, use $S_n = \\frac{a(1 - r^{n})}{1 - r}$: $S_5 = \\frac{40\\left(1 - \\frac{1}{32}\\right)}{\\frac{1}{2}}$.',
        '$1 - \\frac{1}{32} = \\frac{31}{32}$, so $S_5 = 40 \\times \\frac{31}{32} \\times 2 = 77.5$. (Check: $40 + 20 + 10 + 5 + 2.5 = 77.5$.)',
        '$|r| = \\frac{1}{2} < 1$, so the sum to infinity exists: $S_\\infty = \\frac{40}{1 - \\frac{1}{2}} = \\frac{40}{\\frac{1}{2}} = 80$.',
      ],
      answer: '$S_5 = 77.5$ and $S_\\infty = 80$.',
    },
    {
      title: 'Finding terms from given information',
      problem: 'The 3rd term of a geometric sequence is $18$ and the 6th term is $486$. Find the first term and the 4th term.',
      steps: [
        'Write the facts: $ar^{2} = 18$ and $ar^{5} = 486$.',
        'Divide the second by the first so $a$ cancels: $r^{3} = \\frac{486}{18} = 27$.',
        'Cube root: $r = 3$.',
        'Substitute back: $a \\times 3^{2} = 18$, so $9a = 18$ and $a = 2$.',
        '4th term: $u_4 = ar^{3} = 2 \\times 27 = 54$. (Check: $2, 6, 18, 54, 162, 486$.)',
      ],
      answer: 'First term $2$, 4th term $54$.',
    },
    {
      title: 'Sigma notation that does not start at 1',
      problem: 'Evaluate $\\displaystyle\\sum_{k=5}^{20} (4k + 1)$.',
      steps: [
        'Number of terms: $20 - 5 + 1 = 16$.',
        'First term ($k = 5$): $4 \\times 5 + 1 = 21$. Last term ($k = 20$): $4 \\times 20 + 1 = 81$.',
        'The terms go up by 4 each time, so this is arithmetic. Use $S = \\frac{n}{2}(\\text{first} + \\text{last})$.',
        '$S = \\frac{16}{2}(21 + 81) = 8 \\times 102 = 816$.',
      ],
      answer: '$816$',
    },
  ],
  traps: [
    'Using $n$ instead of $n - 1$: the 20th term of an arithmetic sequence is $a + 19d$, and the 7th term of a geometric sequence is $ar^{6}$. You add or multiply one fewer time than the term number.',
    'Mixing up a **term** and a **sum**. "Find the 10th term" wants $u_{10}$; "find the sum of the first 10 terms" wants $S_{10}$. Wrong options are often the other one.',
    'Forgetting the condition for a sum to infinity. $S_\\infty = \\frac{a}{1 - r}$ only works when $|r| < 1$; with $r = 2$ and a positive first term the formula gives a negative number, which is nonsense, because the sum does not exist.',
    'Writing $1 + r$ instead of $1 - r$, especially with negative ratios: for $r = -\\frac{1}{2}$, $1 - r = 1 - \\left(-\\frac{1}{2}\\right) = \\frac{3}{2}$, not $\\frac{1}{2}$.',
    'Miscounting terms in sigma notation or between two given terms: from $k = 11$ to $k = 30$ there are $30 - 11 + 1 = 20$ terms, but from the 2nd term to the 7th term there are only $7 - 2 = 5$ gaps of $d$.',
    'In a sigma sum like $\\sum_{k=1}^{5} 3 \\cdot 2^{k}$, the first term is the $k = 1$ value ($6$), not the number in front ($3$).',
  ],
  examTip:
    'Expect 1-2 quick questions: an $n$th term, a sum, a sum to infinity, or "find $a$ and $d$ (or $r$) from two terms". The wrong options are built from the classic slips: $n$ instead of $n - 1$, forgetting to halve in $\\frac{n}{2}$, using $1 + r$, giving the term instead of the sum. Fast checks that work in about a minute:\n\n' +
    '- **Plug the options back in.** For "find $a$ and $d$" questions, rebuild the sequence from each option and see which one gives both given terms.\n' +
    '- **List a few terms on the calculator** for small $n$ (up to about 8): it is quicker than the formula and avoids off-by-one errors.\n' +
    '- **Estimate a sum to infinity.** It must be bigger than the first term when $r > 0$ and close to the sum of the first few terms; for $12 + 6 + 3 + \\dots$ the answer must be a bit more than 21.\n' +
    '- **Check $|r| < 1$ first.** If it fails, "does not exist" is the answer; if it holds, cross out "does not exist".\n' +
    '- **Sign check:** with a negative ratio, even powers are positive, so the odd-numbered terms have the same sign as $a$.',
};
