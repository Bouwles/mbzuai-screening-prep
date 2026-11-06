import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'loops',
  simple:
    'A **loop** tells the computer to repeat the same lines several times, like walking laps of a track. `for i = 1 to 5` does one lap for each number from 1 to 5, **both ends included**. A `while` loop keeps doing laps as long as a yes/no condition stays true, and `while (true)` keeps going until a `break` stops it. To predict the output, write down the variables after each lap.',
  methods: [
    { cue: '`for i = a to b`, or "how many times does the loop body run?"', method: 'Both ends count, so the body runs $b - a + 1$ times. For a `while` loop, count the passes with a trace table.' },
    { cue: 'A total or counter is updated inside a loop', method: 'Trace table, one row per pass: the current value, then the new total. A `print` after the `end` line runs once.' },
    { cue: 'A `while` loop with a condition such as `x < 20`', method: 'Check the condition at the **top** of every pass, then run the body lines in order; stop at the first failed check. The variable may overshoot the limit.' },
    { cue: '`while (true)` or `break` inside the loop', method: '`break` ends the whole (innermost) loop at once, so nothing after it in the body runs. Test the `break` condition after each update.' },
    { cue: 'A loop inside a loop', method: 'For each outer value write how many times the inner loop runs, then add them. It is a simple product only when the inner range does not depend on `i`.' },
    { cue: 'A condition using `!=` or `==`, or a body that may not change the variable', method: 'Check whether the variable can ever hit the target exactly, and whether it changes on every pass. If not, the answer is "Infinite loop".' },
    { cue: 'The code is labelled Python', method: '`range(a, b)` starts at `a` and stops before `b`, so it gives $b - a$ values. The indented block is the body.' },
  ],
  know:
    '### What a loop is\n\n' +
    'A **loop** repeats a block of code. Each repeat is called a **pass** (or **iteration**). In pseudocode the repeated block sits between the loop line and its `end for` or `end while`. Lines after that run only once, when the loop has finished. Most exam loop questions ask one of three things: *what is printed*, *how many times the body runs*, or *which loop does the same job*.\n\n' +
    '### `for` loops\n\n' +
    '`for i = a to b` gives `i` each whole number from `a` to `b`, **including both ends**, then stops.\n\n' +
    '| Loop line | Values of `i` | Passes |\n|---|---|---|\n| `for i = 1 to 5` | 1, 2, 3, 4, 5 | 5 |\n| `for i = 3 to 9` | 3, 4, 5, 6, 7, 8, 9 | $9 - 3 + 1 = 7$ |\n| `for i = 4 to 4` | 4 | 1 |\n\n' +
    'To go through an array or string, use `for i = 1 to length(A)` and read `A[i]`.\n\n' +
    '### `while` loops\n\n' +
    'A `while` loop repeats **as long as** its condition is true. The condition is checked only at the **top**, before each pass. That has two consequences:\n\n' +
    '1. If the condition is false at the start, the body never runs.\n' +
    '2. The variable can **overshoot** the limit on the last pass (for example, doubling from 1 while `n < 20` ends at 32, not 16).\n\n' +
    'To count in steps other than 1, use a `while` loop with a line such as `i = i + 3`.\n\n' +
    '### `while (true)` and `break`\n\n' +
    'The condition `true` never fails, so this loop runs until a `break` inside it runs:\n\n' +
    '```pseudocode\nn = 50\nwhile (true)\n   n = n - 8\n   if n < 0\n      break\n   end if\nend while\n```\n\n' +
    'Here the test comes **after** the update, so the body always runs at least once. Watch whether the test is `<` or `<=`, because that can change the number of passes.\n\n' +
    '### Accumulators and counters\n\n' +
    'An **accumulator** is a variable that builds up a result: set it up **before** the loop (`total = 0` for adding, `product = 1` for multiplying, `result = ""` for building a string), then update it inside the loop. A **counter** is an accumulator that adds 1 each time, often inside an `if`, to count items that pass a test.\n\n' +
    '### Counting passes\n\n' +
    'For `for i = a to b` the body runs $b - a + 1$ times. For a `while` loop there is no formula you can trust blindly: make a **trace table** with one row per pass.\n\n' +
    '### Nested loops\n\n' +
    'A loop inside a loop: the inner loop runs **completely** for every single pass of the outer loop. If the inner loop always has the same length, multiply: 4 outer passes times 5 inner passes is 20. If the inner range depends on the outer variable (like `for j = 1 to i`), add up the inner lengths pass by pass: $1 + 2 + 3 + 4 = 10$.\n\n' +
    '### `break`\n\n' +
    '`break` ends the **whole** loop immediately (only the innermost loop, if nested), and nothing after it in the body runs.\n\n' +
    '### Infinite loops\n\n' +
    'Something inside the body must eventually make the condition false or reach a `break`. If not, the loop never ends, and "Infinite loop" is the right option. Look for three causes:\n\n' +
    '- a forgotten update, such as a missing `i = i + 1`\n' +
    '- a target that gets jumped over, such as `while (i != 0)` when `i` goes 10, 7, 4, 1, -2\n' +
    '- an update that sits inside an `if`, so it may not happen on every pass\n\n' +
    '### Off-by-one errors\n\n' +
    'The most common slip in loop questions is running one pass too many or too few: using `<` instead of `<=`, or forgetting that `for` includes its end value. Exam distractors are built from exactly these mistakes, so check the **first** and the **last** pass every time.\n\n' +
    '### Reading the same ideas in Python\n\n' +
    'Some questions use short pieces of Python, and the stem says so. Python marks the body by indentation, after a line ending in a colon. Its `while` works the same way as above. Its counting loop is different: `for i in range(a, b)` starts at `a` and stops before `b`, so `range(1, 11)` gives 1 to 10. A third number is the step: `range(2, 10, 3)` gives 2, 5, 8.',
  formulas: [
    { label: 'Passes of an inclusive loop', tex: '\\text{passes} = b - a + 1', note: 'For `for i = a to b` with $a \\le b$.' },
    { label: 'Nested loops, fixed inner length', tex: '\\text{total} = n \\times m', note: 'Outer loop $n$ passes, inner loop $m$ passes each time.' },
    { label: 'Nested loops, inner end value i', tex: '1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}', note: 'For an outer loop from 1 to $n$ with `for j = 1 to i` inside. Also the sum of the first $n$ whole numbers.' },
    { label: 'Nested loops, inner end value i - 1', tex: '0 + 1 + \\dots + (n - 1) = \\frac{n(n - 1)}{2}', note: 'For an outer loop from 1 to $n$ with `for j = 1 to i - 1` inside.' },
    { label: 'Accumulator starting values', tex: '\\text{sum: } 0 \\qquad \\text{product: } 1 \\qquad \\text{string: empty}' },
    { label: 'Python range', tex: '\\texttt{range}(a, b) \\to a, a + 1, \\dots, b - 1', note: 'Start included, stop excluded, so $b - a$ values.' },
  ],
  examples: [
    {
      title: 'Counting the passes of a for loop',
      problem: 'How many times does the loop body run?\n\n```pseudocode\nfor i = 4 to 11\n   print(i)\nend for\n```',
      steps: [
        '`i` takes the values 4, 5, 6, 7, 8, 9, 10, 11, including both ends.',
        'Use last minus first plus one: $11 - 4 + 1 = 8$.',
      ],
      answer: '$8$',
    },
    {
      title: 'Accumulator with a condition',
      problem:
        'What does this print?\n\n```pseudocode\ntotal = 0\nfor i = 1 to 7\n   if mod(i,2) != 0 // mod is the modulus operator\n      total = total + i\n   end if\nend for\nprint(total)\n```',
      steps: [
        '`i` runs from 1 to 7.',
        '`mod(i,2) != 0` is true for odd numbers, so the adding line runs only for them.',
        'So only the odd numbers are added: $1 + 3 + 5 + 7$.',
        '$1 + 3 + 5 + 7 = 16$.',
      ],
      answer: '`16`',
    },
    {
      title: 'Tracing a while loop',
      problem: 'What does this print? Output lines are shown separated by a space.\n\n```pseudocode\nx = 3\ncount = 0\nwhile (x < 50)\n   x = x * 2\n   count = count + 1\nend while\nprint(x)\nprint(count)\n```',
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
      title: 'Tracing while (true) with mod',
      problem: 'What does this print?\n\n```pseudocode\nn = 20\nt = 0\nwhile (true)\n   t = t + mod(n,7) // mod is the modulus operator\n   n = n - 5\n   if n < 0\n      break\n   end if\nend while\nprint(t)\n```',
      steps: [
        'Pass 1: $n = 20$, `mod(20,7)` is 6, so `t` is 6. Then `n` is 15.',
        'Pass 2: $n = 15$, `mod(15,7)` is 1, so `t` is 7. Then `n` is 10.',
        'Pass 3: $n = 10$, `mod(10,7)` is 3, so `t` is 10. Then `n` is 5.',
        'Pass 4: $n = 5$, `mod(5,7)` is 5, so `t` is 15. Then `n` is 0, which is not below 0, so the loop carries on.',
        'Pass 5: $n = 0$, `mod(0,7)` is 0, so `t` stays 15. Then `n` is $-5$, which is below 0, so the loop breaks.',
      ],
      answer: '`15`',
    },
    {
      title: 'Nested loops with break',
      problem:
        'How many times does the line `count = count + 1` run?\n\n```pseudocode\ncount = 0\nfor i = 1 to 4\n   for j = 1 to 4\n      if j > i\n         break\n      end if\n      count = count + 1\n   end for\nend for\n```',
      steps: [
        'The `break` only ends the **inner** loop. For each $i$, the inner loop counts $j = 1, \\dots, i$, then breaks when $j = i + 1$.',
        '$i = 1$: $j = 1$ counts, $j = 2$ breaks. 1 pass.',
        '$i = 2$: $j = 1, 2$ count. 2 passes.',
        '$i = 3$: $j = 1, 2, 3$ count. 3 passes.',
        '$i = 4$: $j = 1, 2, 3, 4$ count, then the inner loop ends normally. 4 passes.',
        'Total: $1 + 2 + 3 + 4 = 10$.',
      ],
      answer: '$10$',
    },
  ],
  traps: [
    'Forgetting that `for i = 1 to 10` includes 10. The body runs 10 times, and `for i = 3 to 9` runs 7 times, not 6.',
    'Mixing up pseudocode and Python: `for i = 1 to 10` includes 10, but Python `range(1, 10)` stops at 9.',
    'Stopping a while loop too early: the condition is only checked at the top, so the last pass can take the variable past the limit. Do not stop your trace at the last value that is "below the limit"; check it.',
    'Carrying on after `break`: it ends the loop completely, so nothing after it in the body runs and no more passes happen. In nested loops, `break` leaves only the inner loop.',
    'Assuming every loop ends. If the variable never changes, or jumps over a value tested with `!=` or `==`, the answer is "Infinite loop".',
    'Reading a `print` as inside the loop when it comes after the `end` line. A `print` after `end for` or `end while` runs once.',
  ],
  examTip:
    'Loop questions are usually "what is printed" or "how many times" with four close options, and the wrong options are almost always **off by one pass** (one too many or too few), a `break` tested in the wrong place, or the value of the wrong variable. So:\n\n' +
    '- Write a quick **trace table** (one row per pass) for anything longer than three passes. It takes 20 seconds and beats guessing.\n' +
    '- Check the **first** pass (is the start included?) and the **last** pass (is the end included? does the condition still hold?).\n' +
    '- For plain `for` loops, use $b - a + 1$ passes and the sum shortcut, for example $1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}$, then confirm on your calculator.\n' +
    '- If two options differ by exactly one step, the question is testing the boundary: look hard at `<` versus `<=`.\n' +
    '- When "Infinite loop" is an option, take it seriously: check that the variable in the condition changes on every pass and can actually reach the stopping value.',
};
