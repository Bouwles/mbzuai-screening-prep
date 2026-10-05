import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'number-sequences',
  know:
    '### What a sequence question is really asking\n\n' +
    'A **sequence** is a list of numbers that follows a rule, such as $3, 7, 11, 15, \\dots$ Each number is a **term**; $u_1$ is the 1st term, $u_2$ the 2nd, and $u_n$ the $n$th. The exam gives you some terms and asks for the **next term**, a **missing term**, a **later term** (like the 50th), or a **formula** for the $n$th term. Your job is to find the rule, then use it.\n\n' +
    '### Step 1: always look at the differences\n\n' +
    'Write the gap between each pair of neighbouring terms underneath. This one habit cracks most questions.\n\n' +
    '| What you see | Type | Rule |\n|---|---|---|\n| differences all the same | linear (arithmetic) | add $d$ each time |\n| differences change, but the **second** differences are the same | quadratic | $n$th term has an $n^2$ part |\n| differences grow fast; dividing gives the same number | geometric | multiply by $r$ each time |\n| each term is the sum of the two before | Fibonacci-like | $u_{n} = u_{n-1} + u_{n-2}$ |\n\n' +
    '### Linear sequences\n\n' +
    'In $7, 10, 13, 16, \\dots$ you add $d = 3$ each time. To reach the $n$th term you start at the first term $a$ and make $n - 1$ jumps (to reach the 2nd term you jump once, not twice):\n\n' +
    '$$u_n = a + (n-1)d$$\n\n' +
    'Tidy it up to $dn + (a - d)$. For $7, 10, 13, \\dots$: $3n + 4$. Quick method: "the difference times $n$, then fix the first term". The 3 times table starts at 3, we need 7, so add 4.\n\n' +
    'To count the terms in a list like $6, 9, \\dots, 300$: jumps $= \\frac{300 - 6}{3} = 98$, terms $= 98 + 1 = 99$ (fence posts are one more than gaps).\n\n' +
    '### Quadratic sequences (second differences)\n\n' +
    'In $2, 7, 14, 23, 34$ the differences are $5, 7, 9, 11$, and the differences of those are $2, 2, 2$. A constant **second** difference means the $n$th term looks like $an^2 + bn + c$, where\n\n' +
    '- $a$ is **half** the second difference (here $a = 1$; careful, in this formula $a$ is the number in front of $n^2$, not the first term),\n' +
    '- then subtract $an^2$ from each term; what is left is linear, so find its rule as above.\n\n' +
    'Here: terms minus $n^2$ give $1, 3, 5, 7, 9$, which is $2n - 1$, so $u_n = n^2 + 2n - 1$. If you only need the next term, simply continue the differences: next difference $13$, next term $47$.\n\n' +
    '### Geometric sequences\n\n' +
    'In $2, 6, 18, 54, \\dots$ each term is the one before times $r = 3$ (find $r$ by dividing a term by the one before). The $n$th term is $u_n = ar^{n-1}$ (again $n - 1$ multiplications). A ratio between 0 and 1 makes the terms shrink ($96, 48, 24, \\dots$ has $r = \\frac{1}{2}$); a **negative** ratio makes the signs alternate ($96, -48, 24, \\dots$ has $r = -\\frac{1}{2}$).\n\n' +
    '### Fibonacci-like sequences\n\n' +
    'In $2, 5, 7, 12, 19, 31, \\dots$ the differences ($3, 2, 5, 7, 12$) and ratios do not settle down, but each term is the **sum of the two terms before it**: $2 + 5 = 7$, $5 + 7 = 12$, $7 + 12 = 19$. The next term is $19 + 31 = 50$. Tip: from the second difference onwards, the differences of a Fibonacci-like sequence repeat the sequence itself ($2, 5, 7, 12, \\dots$), which is a quick way to spot one.\n\n' +
    'If the first two terms are unknown, call them $a$ and $b$ and build the sequence: $a,\\ b,\\ a + b,\\ a + 2b,\\ 2a + 3b,\\ 3a + 5b, \\dots$ Two given terms then give two simultaneous equations to solve.\n\n' +
    '### Special sequences to recognise on sight\n\n' +
    '| Name | Start | $n$th term |\n|---|---|---|\n| square numbers | $1, 4, 9, 16, 25, 36$ | $n^2$ |\n| cube numbers | $1, 8, 27, 64, 125$ | $n^3$ |\n| triangular numbers | $1, 3, 6, 10, 15, 21$ | $\\frac{n(n+1)}{2}$ |\n| prime numbers | $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$ | no formula |\n| powers of 2 | $2, 4, 8, 16, 32$ | $2^{n}$ |\n| Fibonacci | $1, 1, 2, 3, 5, 8, 13$ | add the last two |\n\n' +
    'Many exam sequences are one of these with a small change: $2, 9, 28, 65$ is "cubes plus 1"; $5, 7, 11, 19, 35$ is "powers of 2 plus 3". If the numbers look familiar, compare them with this table.\n\n' +
    '### Alternating and interleaved sequences\n\n' +
    'In an **alternating** sequence like $3, -6, 9, -12, \\dots$ the sign flips. Deal with the **size** ($3n$) and the **sign** (negative in even positions) separately.\n\n' +
    'In an **interleaved** sequence two sequences take turns: $2, 10, 4, 20, 8, 30, \\dots$ is $2, 4, 8, \\dots$ (doubling) in the odd positions and $10, 20, 30, \\dots$ (add 10) in the even positions. If neighbouring terms look unrelated, look at **every second term**. Position $2k$ is the $k$th term of the even-position sequence.\n\n' +
    '### Missing terms\n\n' +
    'Find the rule from the part of the sequence with **no gaps**, then fill the gap and check that every term fits. For a geometric gap ($6, \\square, \\square, 162$) remember you multiply by $r$ three times, so $r^3 = 27$ and $r = 3$: take a root, do not divide.',
  formulas: [
    { label: 'Linear (arithmetic) nth term', tex: 'u_n = a + (n-1)d = dn + (a - d)', note: '$a$ = first term, $d$ = common difference.' },
    { label: 'Number of terms from first to last', tex: '\\text{terms} = \\frac{\\text{last} - \\text{first}}{d} + 1' },
    { label: 'Geometric nth term', tex: 'u_n = ar^{n-1}', note: '$r$ = common ratio = any term divided by the one before.' },
    { label: 'Quadratic nth term', tex: 'u_n = an^2 + bn + c, \\quad a = \\frac{\\text{second difference}}{2}', note: 'Subtract $an^2$ from each term, then find the linear rule for what is left.' },
    { label: 'Square and cube numbers', tex: 'n^2: 1, 4, 9, 16, 25, \\dots \\qquad n^3: 1, 8, 27, 64, 125, \\dots' },
    { label: 'Triangular numbers', tex: 'T_n = 1 + 2 + \\dots + n = \\frac{n(n+1)}{2}' },
    { label: 'Fibonacci-like rule', tex: 'u_{n} = u_{n-1} + u_{n-2}', note: 'Each term is the sum of the two terms before it.' },
    { label: 'Alternating sign', tex: '(-1)^{n+1} = +1, -1, +1, -1, \\dots', note: 'Multiply the size rule by this to make odd positions positive and even positions negative.' },
  ],
  examples: [
    {
      title: 'Next term of a geometric sequence',
      problem: 'Find the next term of $5, 10, 20, 40, \\dots$',
      steps: [
        'Differences: $5, 10, 20$. Not constant, so it is not linear.',
        'Ratios: $10 \\div 5 = 2$, $20 \\div 10 = 2$, $40 \\div 20 = 2$. Constant ratio $r = 2$, so it is geometric.',
        'Next term: $40 \\times 2 = 80$.',
      ],
      answer: '$80$',
    },
    {
      title: 'The 40th term of a linear sequence',
      problem: 'Find the 40th term of $11, 15, 19, 23, \\dots$',
      steps: [
        'Differences are all $4$, so $d = 4$ and the first term is $a = 11$.',
        'From the 1st term to the 40th there are $40 - 1 = 39$ jumps of 4.',
        '$u_{40} = 11 + 39 \\times 4 = 11 + 156 = 167$.',
        'Check with the formula $4n + 7$: $4 \\times 40 + 7 = 167$.',
      ],
      answer: '$167$',
    },
    {
      title: 'nth term of a quadratic sequence',
      problem: 'Find the $n$th term of $3, 9, 17, 27, 39, \\dots$',
      steps: [
        'First differences: $6, 8, 10, 12$. Second differences: $2, 2, 2$. Constant, so the sequence is quadratic.',
        'Coefficient of $n^2$: half of $2$ is $1$, so start with $n^2$.',
        'Subtract $n^2$ ($1, 4, 9, 16, 25$) from the terms: $2, 5, 8, 11, 14$.',
        'The leftover goes up by 3 and starts at 2, so it is $3n - 1$.',
        'Combine: $u_n = n^2 + 3n - 1$. Check $n = 3$: $9 + 9 - 1 = 17$. Correct.',
      ],
      answer: '$u_n = n^2 + 3n - 1$',
    },
    {
      title: 'A term of an interleaved sequence',
      problem: 'The sequence $4, 1, 8, 4, 12, 9, 16, 16, \\dots$ continues with the same pattern. Find its 15th term.',
      steps: [
        'Neighbouring terms look unrelated, so split it into odd and even positions.',
        'Odd positions (1st, 3rd, 5th, 7th): $4, 8, 12, 16$, which is $4k$ for the $k$th of them.',
        'Even positions: $1, 4, 9, 16$, the square numbers.',
        'Position 15 is odd. Odd positions $1, 3, 5, \\dots, 15$: position $2k - 1 = 15$ gives $k = 8$.',
        'The 8th term of $4, 8, 12, \\dots$ is $4 \\times 8 = 32$.',
      ],
      answer: '$32$',
    },
  ],
  traps: [
    'Using $n$ jumps instead of $n - 1$: the 50th term of a linear sequence is $a + 49d$, and the 8th term of a geometric sequence is $ar^{7}$.',
    'Writing the linear $n$th term as $dn + a$. The constant is $a - d$ (for $5, 9, 13, \\dots$ it is $4n + 1$, not $4n + 5$). Always check $n = 1$ gives the first term.',
    'Using the whole second difference as the coefficient of $n^2$. It is **half** the second difference.',
    'Repeating the last difference when the differences are growing (linear thinking on a quadratic, cubic or geometric sequence). Check the second differences or the ratios first.',
    'Forgetting the sign in alternating sequences: with a negative ratio, odd powers give negative terms.',
    'In interleaved sequences, treating position $2k$ as the $2k$th term of the sub-sequence: it is only the $k$th.',
  ],
  examTip:
    'Sequence questions are quick marks if you work systematically: write the first differences, then the second differences or the ratios, and you will know the type within 15 seconds. For "which formula" questions, **plug $n = 1, 2, 3$ into each option**: wrong options are usually built to match the first term or two, so always test the 3rd term too. For a later term like the 50th, find the $n$th term and use the calculator rather than listing terms. To eliminate options fast, check parity (odd or even), sign (alternating sequences), and size (a geometric sequence with $r = 3$ grows hugely; an answer that is too small is wrong). If a missing-term option is just the average of its neighbours, be suspicious unless the sequence is linear.',
};
