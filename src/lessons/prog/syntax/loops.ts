import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'loops',
  know:
    '### What a loop is\n\n' +
    'A **loop** repeats a block of code. Each repeat is called a **pass** (or **iteration**). In Python the repeated block is everything **indented** under the loop line. Lines that are not indented run only once, after the loop has finished. Most exam loop questions ask one of three things: *what is printed*, *how many times does the body run*, or *which loop does the same job*.\n\n' +
    '### `for` loops over a collection\n\n' +
    'A `for` loop walks through the items of a list or string, one at a time, from the first to the last:\n\n' +
    '- `for x in [3, 1, 4]:` gives `x` the values 3, then 1, then 4.\n' +
    '- `for ch in "cat":` gives `ch` the values `c`, `a`, `t`.\n\n' +
    '### `range(start, stop, step)`\n\n' +
    'To loop over numbers, use `range`. The golden rule: **start is included, stop is never included**.\n\n' +
    '| Call | Values | How many |\n|---|---|---|\n| `range(5)` | 0, 1, 2, 3, 4 | 5 |\n| `range(2, 6)` | 2, 3, 4, 5 | $6 - 2 = 4$ |\n| `range(1, 10, 3)` | 1, 4, 7 | 3 |\n| `range(10, 0, -3)` | 10, 7, 4, 1 | 4 |\n| `range(5, 2)` | (nothing) | 0 |\n\n' +
    'So to go from 1 to 10 **inclusive** you write `range(1, 11)`. With a negative step the values count **down** and the loop stops before going past the stop. Pseudocode is different: in the exam style `for i = 1 to 10`, **both** ends are included. Always check which convention a question uses.\n\n' +
    '### `while` loops\n\n' +
    'A `while` loop repeats **as long as** its condition is true. The condition is checked only at the **top**, before each pass. That has two consequences:\n\n' +
    '1. If the condition is false at the start, the body never runs.\n' +
    '2. The variable can **overshoot** the limit on the last pass (for example, doubling from 1 while `n < 20` ends at 32, not 16).\n\n' +
    'Something inside the body must eventually make the condition false. If not (a forgotten `i = i + 1`, or `while i != 0` when `i` jumps over 0) you get an **infinite loop**.\n\n' +
    '### Accumulators and counters\n\n' +
    'An **accumulator** is a variable that builds up a result: set it up **before** the loop (`total = 0` for adding, `product = 1` for multiplying, `result = ""` for building a string), then update it inside the loop. A **counter** is an accumulator that adds 1 each time, often inside an `if`, to count items that pass a test.\n\n' +
    '### Counting passes\n\n' +
    'For `range(a, b)` the body runs $b - a$ times (if $b$ is not bigger than $a$, the range is empty and the body runs 0 times). With a step $s$ it runs $\\lceil \\frac{b - a}{s} \\rceil$ times (divide and round **up**); this works for negative steps too, for example `range(10, 0, -3)` has $\\lceil \\frac{-10}{-3} \\rceil = 4$ passes (10, 7, 4, 1). For a `while` loop there is no formula you can trust blindly: make a **trace table** with one row per pass.\n\n' +
    '### Nested loops\n\n' +
    'A loop inside a loop: the inner loop runs **completely** for every single pass of the outer loop. If the inner loop always has the same length, multiply: 4 outer passes times 5 inner passes is 20. If the inner range depends on the outer variable (like `range(i)`), add up the inner lengths pass by pass: $0 + 1 + 2 + 3 = 6$.\n\n' +
    '### `break`, `continue` and loop `else`\n\n' +
    '- `break` ends the **whole** loop immediately (only the innermost loop, if nested).\n' +
    '- `continue` skips the rest of **this** pass and jumps to the next one.\n' +
    '- A loop can have an `else` block. It runs only if the loop ended **without** `break`. Think of it as "the search found nothing". This works on `while` loops too: the `else` runs when the condition becomes false, but not after a `break`.\n\n' +
    '### Off-by-one errors\n\n' +
    'The most common bug in loop questions is running one pass too many or too few: using `<` instead of `<=`, forgetting that `range` excludes the stop, or starting at 0 instead of 1. Exam distractors are built from exactly these mistakes, so check the **first** and the **last** pass every time.',
  formulas: [
    { label: 'Values of range', tex: '\\texttt{range}(a, b) \\to a, a + 1, \\dots, b - 1', note: 'Start included, stop excluded.' },
    { label: 'Number of passes, step 1', tex: '\\text{passes} = b - a', note: 'For `range(a, b)` when $b > a$; zero passes when $b \\le a$.' },
    { label: 'Number of passes, step s', tex: '\\text{passes} = \\left\\lceil \\frac{b - a}{s} \\right\\rceil', note: 'Divide and round up, e.g. `range(2, 10, 3)` has $\\lceil \\frac{8}{3} \\rceil = 3$ passes (2, 5, 8).' },
    { label: 'Inclusive loop from a to b', tex: '\\texttt{range}(a, b + 1) \\text{ has } b - a + 1 \\text{ passes}', note: 'Pseudocode `for i = a to b` includes both ends.' },
    { label: 'Nested loops, fixed inner length', tex: '\\text{total} = n \\times m', note: 'Outer loop $n$ passes, inner loop $m$ passes each time.' },
    { label: 'Nested loops, inner range(i)', tex: '0 + 1 + \\dots + (n - 1) = \\frac{n(n - 1)}{2}', note: 'For `for i in range(n): for j in range(i):`.' },
    { label: 'Nested loops, inner range(i, n)', tex: 'n + (n - 1) + \\dots + 1 = \\frac{n(n + 1)}{2}' },
    { label: 'Accumulator starting values', tex: '\\text{sum: } 0 \\qquad \\text{product: } 1 \\qquad \\text{string: empty}' },
  ],
  examples: [
    {
      title: 'Reading a range with a step',
      problem: 'What does `print(list(range(3, 15, 4)))` print?',
      steps: [
        'Start at 3 (the start is included).',
        'Add 4: 7, then 11. Both are less than 15, so keep them.',
        'Add 4 again: 15. This is not less than 15, so stop (the stop is excluded).',
        'Check with the formula: $\\lceil \\frac{15 - 3}{4} \\rceil = 3$ values.',
      ],
      answer: '`[3, 7, 11]`',
    },
    {
      title: 'Accumulator with continue',
      problem:
        'What does this print?\n\n`total = 0`, then `for i in range(1, 8):` with body `if i % 2 == 0: continue` and `total = total + i`, then `print(total)` after the loop.',
      steps: [
        '`range(1, 8)` gives 1 to 7.',
        '`i % 2 == 0` is true for even numbers, and `continue` skips the adding line for them.',
        'So only the odd numbers are added: $1 + 3 + 5 + 7$.',
        '$1 + 3 + 5 + 7 = 16$.',
      ],
      answer: '`16`',
    },
    {
      title: 'Tracing a while loop',
      problem: 'What does this print?\n\n`x = 3`, `count = 0`, then `while x < 50:` with body `x = x * 2` and `count = count + 1`, then `print(x, count)`.',
      steps: [
        'Check $3 < 50$: true. $x = 6$, count 1.',
        'Check $6 < 50$: true. $x = 12$, count 2.',
        'Check $12 < 50$: true. $x = 24$, count 3.',
        'Check $24 < 50$: true. $x = 48$, count 4.',
        'Check $48 < 50$: true. $x = 96$, count 5.',
        'Check $96 < 50$: false, so stop. `x` overshot 50, which is normal for a while loop.',
      ],
      answer: '`96 5`',
    },
    {
      title: 'Nested loops with break',
      problem:
        'How many times is `count = count + 1` run?\n\n`for i in range(4):` then inside it `for j in range(4):` with body `if j > i: break` and then `count = count + 1`.',
      steps: [
        'The `break` only ends the **inner** loop. For each $i$, the inner loop counts $j = 0, 1, \\dots$ up to $j = i$, then breaks when $j = i + 1$.',
        '$i = 0$: $j = 0$ counts, $j = 1$ breaks. 1 pass.',
        '$i = 1$: $j = 0, 1$ count. 2 passes.',
        '$i = 2$: $j = 0, 1, 2$ count. 3 passes.',
        '$i = 3$: $j = 0, 1, 2, 3$ count, then the inner loop ends normally. 4 passes.',
        'Total: $1 + 2 + 3 + 4 = 10$.',
      ],
      answer: '$10$',
    },
  ],
  traps: [
    'Including the stop value of `range`: `range(1, 10)` stops at 9. To include 10, write `range(1, 11)`. (Pseudocode `for i = 1 to 10` does include 10.)',
    'Stopping a while loop too early: the condition is only checked at the top, so the last pass can take the variable past the limit. Do not stop your trace at the last value that is "below the limit"; check it.',
    'Mixing up `break` and `continue`: `break` ends the loop completely, `continue` only skips the rest of the current pass. In nested loops, `break` leaves only the inner loop.',
    'Thinking a loop `else` always runs: it runs only when the loop finishes without `break`. It is not attached to the `if` inside the loop.',
    'Indentation: a `print` indented inside the loop runs every pass; one that is not indented runs once at the end. Read the indentation before you trace.',
    'Doing tuple assignment one line at a time: `a, b = b, a + b` uses the **old** `a` and `b` on the right-hand side, which is not the same as `a = b` followed by `b = a + b`.',
  ],
  examTip:
    'Loop questions are usually "what is printed" or "how many times" with four close options, and the wrong options are almost always **off by one pass** (one too many or too few), the result of confusing `break` with `continue`, or the value of the wrong variable. So:\n\n' +
    '- Write a quick **trace table** (one row per pass) for anything longer than three passes. It takes 20 seconds and beats guessing.\n' +
    '- Check the **first** pass (is the start included?) and the **last** pass (is the stop included? does the condition still hold?).\n' +
    '- For plain `range` loops, use $b - a$ passes (or divide by the step and round up) and the sum shortcut, for example $1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}$, then confirm on your calculator.\n' +
    '- If two options differ by exactly one step, the question is testing the boundary: look hard at `<` versus `<=` and at the stop value of `range`.\n' +
    '- For "which while loop matches this for loop", check three things in each option: same start value, same (inclusive or exclusive) condition, and the counter updated **after** the work. One missing update means an infinite loop.',
};
