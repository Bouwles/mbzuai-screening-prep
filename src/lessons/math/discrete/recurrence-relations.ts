import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'recurrence-relations',
  simple:
    'A **recurrence relation** is a recipe for a sequence that tells you how to get the next term from the ones before it, like "start with 4 and keep adding 3" ($4, 7, 10, 13, \\dots$). To use it, start from the given first term and apply the rule one step at a time.',
  methods: [
    {
      cue: 'Starting value(s) and a rule given; asked for a nearby term such as $a_4$ or $a_5$, or the first few terms',
      method: 'Apply the rule one step at a time in a list or table, in the order written (multiply before adding). Check whether the sequence starts at $a_0$ or $a_1$ to count the steps.',
    },
    {
      cue: 'The rule uses **two** earlier terms ($a_{n-1}$ and $a_{n-2}$)',
      method: 'You need two starting values; build a table term by term, matching each coefficient to the right earlier term.',
    },
    {
      cue: 'A list of terms is given: "Which recurrence generates them?"',
      method: 'Test each option on **every** consecutive pair of terms. Several rules may fit the first step, but usually only one fits them all.',
    },
    {
      cue: 'A later term is given and an **earlier** term is asked for',
      method: 'Run the rule backwards by undoing the operations in reverse order (undo the $+d$ first, then the $\\times r$), then check forwards.',
    },
    {
      cue: 'A recursive function or a loop in pseudocode that repeats a rule',
      method: 'Write down the base case or starting value and the rule, then work up from there in a table.',
    },
  ],
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
    'Some rules use the **two** previous terms. The famous one is the Fibonacci sequence: $F_1 = 1$, $F_2 = 1$, $F_n = F_{n-1} + F_{n-2}$, which gives $1, 1, 2, 3, 5, 8, 13, 21, \\dots$ Because each term needs two earlier terms, you need **two** starting values. Such a rule is called **second-order**. With coefficients, such as $a_n = a_{n-1} + 2a_{n-2}$, be careful to multiply the right term: $a_{n-1}$ is one place back, $a_{n-2}$ is two places back. A small table of $n$ and $a_n$ keeps everything tidy.\n\n' +
    '### Recurrences in code\n\n' +
    'A recursive function is a recurrence in code. In `f(n - 1) + 2 * f(n - 2)` the base case gives the starting values and the `return` line gives the rule, so build a table from the bottom up. A loop that repeats a line such as `a = 2 * a - 1` does the same job: each pass computes the next term.',
  formulas: [
    { label: 'Add a constant', tex: 'a_n = a_{n-1} + d', note: 'The same amount is added at every step.' },
    { label: 'Multiply by a constant', tex: 'a_n = r\\,a_{n-1}', note: 'The same multiplier is used at every step.' },
    { label: 'Multiply then add', tex: 'a_n = r\\,a_{n-1} + d', note: 'Multiply first, then add.' },
    { label: 'Running the rule backwards', tex: 'a_n = r\\,a_{n-1} + d \\implies a_{n-1} = \\frac{a_n - d}{r}', note: 'Undo the operations in reverse order.' },
    { label: 'Number of steps', tex: '\\text{from } a_1 \\text{ to } a_k: \\; k - 1 \\text{ steps}, \\qquad \\text{from } a_0 \\text{ to } a_k: \\; k \\text{ steps}' },
    { label: 'Fibonacci sequence', tex: 'F_1 = F_2 = 1, \\quad F_n = F_{n-1} + F_{n-2}', note: '$1, 1, 2, 3, 5, 8, 13, 21, 34, \\dots$' },
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
      title: 'Working backwards',
      problem: 'A sequence satisfies $a_n = 3a_{n-1} - 2$ for $n \\ge 2$, and $a_4 = 28$. Find $a_1$.',
      steps: [
        'Undo the rule: add 2 first, then divide by 3, so $a_{n-1} = \\frac{a_n + 2}{3}$.',
        '$a_3 = \\frac{28 + 2}{3} = 10$',
        '$a_2 = \\frac{10 + 2}{3} = 4$',
        '$a_1 = \\frac{4 + 2}{3} = 2$',
        'Check forwards: $2 \\to 4 \\to 10 \\to 28$. Correct.',
      ],
      answer: '$a_1 = 2$',
    },
    {
      title: 'Which rule fits?',
      problem: 'A sequence begins $2, 5, 11, 23$. Which rule generates it: $a_n = a_{n-1} + 3$ or $a_n = 2a_{n-1} + 1$?',
      steps: [
        'Test $a_n = a_{n-1} + 3$: $2 \\to 5$ works, but $5 \\to 8$, not 11. It fails.',
        'Test $a_n = 2a_{n-1} + 1$: $2 \\to 5$, $5 \\to 11$, $11 \\to 23$. Every step works.',
      ],
      answer: '$a_n = 2a_{n-1} + 1$',
    },
  ],
  traps: [
    '**Off-by-one with the starting index.** If the first term is $a_0$, reaching $a_5$ takes 5 steps; if it is $a_1$, it takes 4. Count the steps from the first term you are given.',
    '**Wrong order of operations.** $a_n = 3a_{n-1} - 1$ means multiply first, then subtract. Working out $3(a_{n-1} - 1)$ gives a completely different sequence.',
    '**Mixing up the coefficients in a two-term rule.** In $a_n = a_{n-1} + 2a_{n-2}$ the 2 belongs to the term **two** places back, not the previous term.',
    '**Guessing a pattern from too few terms.** $2, 4, \\dots$ looks like doubling, but the next term might be 7. Check any rule on **every** given pair of terms.',
    '**Undoing in the wrong order.** To reverse "double, then add 3", subtract 3 first and then halve.',
  ],
  examTip:
    'Expect questions like "find $a_5$", "what are the first four terms?" or "which rule generates this sequence?". The wrong options are usually the term one before or one after the right one, or the result of a common slip (wrong operation order, swapped coefficients, forgetting the constant).\n\n' +
    '- Compute in a quick table; it takes under 30 seconds and avoids risky shortcuts. Your calculator can do the repetition: type the start value, press =, then type the rule using Ans (for example $3 \\times \\text{Ans} - 1$) and press = repeatedly.\n' +
    '- To choose between rules, test each option on the terms you know. Usually only one option survives.\n' +
    '- If two options differ by exactly one step of the rule, re-count the steps from the starting index.',
};
