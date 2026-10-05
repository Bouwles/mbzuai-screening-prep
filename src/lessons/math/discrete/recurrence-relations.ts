import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'recurrence-relations',
  know:
    '### What is a recurrence relation?\n\n' +
    'Most formulas tell you a term **directly**: for example $a_n = 3n + 1$ gives $a_{10} = 31$ straight away. A **recurrence relation** works differently: it tells you how to get each term **from the term (or terms) before it**. You also need a **starting value**, otherwise you cannot begin.\n\n' +
    'Example: $a_1 = 4$ and $a_n = a_{n-1} + 3$. Read $a_{n-1}$ as "the previous term". So the rule says "next term = previous term + 3":\n\n' +
    '$$4, \\; 7, \\; 10, \\; 13, \\; 16, \\; \\dots$$\n\n' +
    'Two things define the sequence: the **rule** and the **starting value(s)**. Change either one and you get a different sequence.\n\n' +
    '### Computing terms: one step at a time\n\n' +
    'To find a term, start from the given value and apply the rule again and again. Write each step on its own line with its index, for example $a_2 = 3 \\times 2 - 1 = 5$. Two habits prevent most mistakes:\n\n' +
    '- **Watch the starting index.** If the sequence starts at $a_1$, reaching $a_5$ takes 4 steps. If it starts at $a_0$, reaching $a_5$ takes 5 steps.\n' +
    '- **Follow the order of operations.** $a_n = 3a_{n-1} - 1$ means multiply by 3 **first**, then subtract 1.\n\n' +
    'To go **backwards** (given a later term, find an earlier one), undo the operations in reverse order. For $a_n = 2a_{n-1} + 3$, undo the $+3$ first, then halve: $a_{n-1} = \\frac{a_n - 3}{2}$.\n\n' +
    '### Fibonacci-type recurrences\n\n' +
    'Some rules use the **two** previous terms. The famous one is the Fibonacci sequence: $F_1 = 1$, $F_2 = 1$, $F_n = F_{n-1} + F_{n-2}$, which gives $1, 1, 2, 3, 5, 8, 13, 21, \\dots$ Because each term needs two earlier terms, you need **two** starting values. With coefficients, such as $a_n = a_{n-1} + 2a_{n-2}$, be careful to multiply the right term: $a_{n-1}$ is one place back, $a_{n-2}$ is two places back. A small table of $n$ and $a_n$ keeps everything tidy.\n\n' +
    '### From recurrence to closed form\n\n' +
    'A **closed form** is a direct formula for $a_n$, which is much faster for a far-away term like $a_{50}$. Three types are worth knowing:\n\n' +
    '| Recurrence | Type | Closed form (starting at $a_1$) |\n' +
    '| --- | --- | --- |\n' +
    '| $a_n = a_{n-1} + d$ | arithmetic | $a_n = a_1 + (n-1)d$ |\n' +
    '| $a_n = ra_{n-1}$ | geometric | $a_n = a_1 r^{n-1}$ |\n' +
    '| $a_n = ra_{n-1} + d$ | "multiply then add" | $a_n = L + (a_1 - L)r^{n-1}$ |\n\n' +
    'If the sequence starts at $a_0$ instead, replace $n - 1$ by $n$: for example $a_n = a_0 r^{n}$.\n\n' +
    'For the third type, $L$ is the **fixed point**: the number the rule leaves unchanged. Solve $L = rL + d$, which gives $L = \\frac{d}{1 - r}$. The trick is that the **distance from $L$** gets multiplied by $r$ each step. For instance, with $a_n = 3a_{n-1} - 4$: $L = 3L - 4$ gives $L = 2$. Starting from $a_1 = 5$ (distance 3), the distances are $3, 9, 27, \\dots$ so $a_n = 2 + 3^{n}$.\n\n' +
    '### Recurrences from counting problems\n\n' +
    'Many counting questions are solved by asking: **how does the last step happen?** To climb $n$ stairs taking 1 or 2 at a time, your final move came either from stair $n - 1$ or from stair $n - 2$, so $S_n = S_{n-1} + S_{n-2}$. Binary strings with no two 1s next to each other follow the same idea (split on whether the string ends in 0 or in 01). Other examples: Tower of Hanoi ($H_n = 2H_{n-1} + 1$) and regions made by $n$ lines ($R_n = R_{n-1} + n$).\n\n' +
    '### Step counts of recursive algorithms\n\n' +
    'A recursive function is a recurrence in code. Its running time $T(n)$ is "work done in this call" plus "work done by the recursive calls":\n\n' +
    '- Binary search: $T(n) = T\\left(\\frac{n}{2}\\right) + 1$, about $\\log_2 n$ steps.\n' +
    '- Merge sort: $T(n) = 2T\\left(\\frac{n}{2}\\right) + n$, about $n\\log_2 n$ steps.\n' +
    '- A function that calls itself twice on $n - 1$: $T(n) = 2T(n-1) + 1$, about $2^{n}$ steps.\n\n' +
    'To evaluate these, work **up** from the base case (such as $T(1)$) in a table.',
  formulas: [
    { label: 'Arithmetic recurrence', tex: 'a_n = a_{n-1} + d \\implies a_n = a_1 + (n-1)d', note: 'Starting at $a_0$: $a_n = a_0 + nd$.' },
    { label: 'Geometric recurrence', tex: 'a_n = r\\,a_{n-1} \\implies a_n = a_1 r^{n-1}', note: 'Starting at $a_0$: $a_n = a_0 r^{n}$.' },
    { label: 'Fixed point of a "multiply then add" rule', tex: 'L = rL + d \\implies L = \\frac{d}{1 - r} \\quad (r \\ne 1)' },
    {
      label: '"Multiply then add" closed form',
      tex: 'a_n = r\\,a_{n-1} + d \\implies a_n = L + (a_1 - L)\\,r^{n-1}',
      note: 'Starting at $a_0$: $a_n = L + (a_0 - L)r^{n}$.',
    },
    { label: 'Fibonacci sequence', tex: 'F_1 = F_2 = 1, \\quad F_n = F_{n-1} + F_{n-2}', note: '$1, 1, 2, 3, 5, 8, 13, 21, 34, \\dots$' },
    { label: 'Tower of Hanoi', tex: 'H_1 = 1, \\quad H_n = 2H_{n-1} + 1 \\implies H_n = 2^{n} - 1' },
    { label: 'Binary search step count', tex: 'T(1) = 1, \\quad T(n) = T\\left(\\tfrac{n}{2}\\right) + 1 \\implies T(n) = \\log_2 n + 1' },
    { label: 'Merge sort step count', tex: 'T(1) = 0, \\quad T(n) = 2T\\left(\\tfrac{n}{2}\\right) + n \\implies T(n) = n\\log_2 n' },
    { label: 'Regions made by n lines', tex: 'R_0 = 1, \\quad R_n = R_{n-1} + n \\implies R_n = 1 + \\frac{n(n+1)}{2}' },
  ],
  examples: [
    {
      title: 'Computing terms',
      problem: 'A sequence has $a_0 = 3$ and $a_n = 2a_{n-1} - 1$ for $n \\ge 1$. Find $a_4$.',
      steps: [
        'The sequence starts at $a_0$, so reaching $a_4$ takes 4 steps. Each step: double, then subtract 1.',
        '$a_1 = 2 \\times 3 - 1 = 5$',
        '$a_2 = 2 \\times 5 - 1 = 9$',
        '$a_3 = 2 \\times 9 - 1 = 17$',
        '$a_4 = 2 \\times 17 - 1 = 33$',
      ],
      answer: '$a_4 = 33$',
    },
    {
      title: 'A Fibonacci-type recurrence',
      problem: 'A sequence has $a_1 = 1$, $a_2 = 3$ and $a_n = 2a_{n-1} + a_{n-2}$ for $n \\ge 3$. Find $a_5$.',
      steps: [
        'The 2 multiplies the previous term $a_{n-1}$; the term two back, $a_{n-2}$, is added once.',
        '$a_3 = 2a_2 + a_1 = 2 \\times 3 + 1 = 7$',
        '$a_4 = 2a_3 + a_2 = 2 \\times 7 + 3 = 17$',
        '$a_5 = 2a_4 + a_3 = 2 \\times 17 + 7 = 41$',
      ],
      answer: '$a_5 = 41$',
    },
    {
      title: 'Closed form of a "multiply then add" recurrence',
      problem: 'A sequence has $a_0 = 1$ and $a_n = 3a_{n-1} + 4$ for $n \\ge 1$. Find a closed form and use it to find $a_6$.',
      steps: [
        'Find the fixed point: $L = 3L + 4$, so $-2L = 4$ and $L = -2$.',
        'Starting distance from $L$: $a_0 - L = 1 - (-2) = 3$.',
        'Each step multiplies the distance by 3, so $a_n - (-2) = 3 \\times 3^{n}$, which gives $a_n = 3^{n+1} - 2$.',
        'Check: $a_0 = 3 - 2 = 1$ and $a_1 = 9 - 2 = 7 = 3 \\times 1 + 4$. Correct.',
        '$a_6 = 3^{7} - 2 = 2187 - 2 = 2185$.',
      ],
      answer: '$a_n = 3^{n+1} - 2$, so $a_6 = 2185$',
    },
    {
      title: 'Counting with a recurrence',
      problem: 'A path of length $n$ metres is covered with tiles that are 1 m or 2 m long. Let $W_n$ be the number of ways to tile it. Find $W_7$.',
      steps: [
        'Look at the last tile. If it is 1 m long, the remaining $n - 1$ metres can be tiled in $W_{n-1}$ ways. If it is 2 m long, the rest can be tiled in $W_{n-2}$ ways.',
        'So $W_n = W_{n-1} + W_{n-2}$.',
        'Starting values: $W_1 = 1$ (one 1 m tile) and $W_2 = 2$ (two 1 m tiles, or one 2 m tile).',
        '$W_3 = 3$, $W_4 = 5$, $W_5 = 8$, $W_6 = 13$, $W_7 = 13 + 8 = 21$.',
      ],
      answer: '$W_7 = 21$',
    },
  ],
  traps: [
    '**Off-by-one with the starting index.** If the first term is $a_0$, the closed forms use $n$ (for example $a_0 r^{n}$); if it is $a_1$, they use $n - 1$. Always test your formula at the first index.',
    '**Wrong order of operations.** $a_n = 3a_{n-1} - 1$ means multiply first, then subtract. Working out $3(a_{n-1} - 1)$ gives a completely different sequence.',
    '**Mixing up the coefficients in a two-term rule.** In $a_n = a_{n-1} + 2a_{n-2}$ the 2 belongs to the term **two** places back, not the previous term.',
    '**Guessing a pattern from too few terms.** $2, 4, \\dots$ looks like doubling, but the next term might be 7. Check any rule on **every** given pair of terms.',
    '**Forgetting the constant in "multiply then add".** $a_n = 3a_{n-1} - 4$ is not geometric: its closed form is $L + (a_1 - L)r^{n-1}$, not $a_1 r^{n-1}$, and not $a_1 r^{n-1} - 4$.',
    '**Counting calls instead of work.** For a recursive procedure, decide exactly what is being counted (prints, comparisons, or calls) and include the base case correctly.',
  ],
  examTip:
    'Expect questions like "find $a_5$", "find a closed form", "how many ways..." or "how many steps does this recursive algorithm take". The wrong options are usually the term one before or one after the right one, or the result of a common slip (wrong operation order, swapped coefficients, forgetting the constant).\n\n' +
    '- For small terms, just compute in a quick table; it takes under 30 seconds and avoids risky shortcuts. Your calculator can do the repetition: type the start value, press =, then type the rule using Ans (for example $3 \\times \\text{Ans} - 1$) and press = repeatedly.\n' +
    '- To choose between closed-form options, **plug in** $n = 0$, $1$ or $2$ and compare with the terms you know. Usually only one option survives.\n' +
    '- If two options differ by exactly one step of the rule, re-count the steps from the starting index.\n' +
    '- For far-away terms, use the closed form, then sanity-check the size: geometric terms grow fast, arithmetic terms grow steadily.',
};
