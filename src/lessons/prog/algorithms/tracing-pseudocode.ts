import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'tracing-pseudocode',
  know:
    '### What pseudocode is\n\n' +
    '**Pseudocode** is a way of writing an algorithm that is not tied to any real programming language. The exam uses it so that everyone can read the same code, whatever language they learned. It looks a lot like Python, but with words such as `then`, `end if`, `end while` and `end for` to show where blocks finish.\n\n' +
    'The words you must know:\n\n' +
    '| Pseudocode | Meaning |\n| --- | --- |\n' +
    '| `x = 5` | store 5 in `x` (an instruction, not an equation) |\n' +
    '| `for i = 1 to 5` | `i` takes 1, 2, 3, 4, 5: **both ends included** |\n' +
    '| `for i = 10 to 1 step -3` | `i` takes 10, 7, 4, 1 |\n' +
    '| `while cond` ... `end while` | repeat while `cond` is true, checked **at the top** of each pass |\n' +
    '| `a mod b` | remainder: `17 mod 5` is 2 |\n' +
    '| `a div b` | whole-number division: `17 div 5` is 3 |\n' +
    '| `==`, `!=` | is equal to, is not equal to |\n\n' +
    'The big difference from Python: `for i = 1 to 5` **includes** 5, while Python\'s `range(1, 5)` stops at 4.\n\n' +
    '### Tracing with a trace table\n\n' +
    'To **trace** code means to run it by hand, exactly like a computer would: one line at a time, top to bottom, using the **current** values. The tool for this is a **trace table**: one column per variable (plus one for the condition or the output), and a new row every time something changes.\n\n' +
    'Rules that make tracing reliable:\n\n' +
    '- On the right of `=`, always use the **newest** value of each variable.\n' +
    '- A line like `total = total + i` keeps the old total and adds to it (an **accumulator**). A line like `total = i` throws the old value away.\n' +
    '- Lines inside a loop happen **in order**. If `x` changes on one line, the next line sees the new `x`.\n' +
    '- A `while` condition is checked only at the top. A pass always finishes, even if the condition becomes false halfway through.\n' +
    '- When the loop ends, the counter holds the **first value that failed** the test, not the last value used.\n\n' +
    '### Counting loop passes\n\n' +
    'Many questions ask "how many times is this line executed?". Do not guess: find the **first** value, the **step** and the **last** value the counter actually takes.\n\n' +
    '- `for i = a to b` (step 1) runs $b - a + 1$ times. The "+ 1" is there because both ends count. Forgetting it is the **fencepost error** (10 metres of fence with a post every metre needs 11 posts).\n' +
    '- `i = a` then `while i < b` with `i = i + 1` runs $b - a$ times, because `b` itself is not used.\n' +
    '- With a step of $s$, divide the distance by $s$. For an inclusive end, round down and add 1; for a strict `<`, round up.\n' +
    '- Nested loops: if the inner loop does not depend on the outer counter, **multiply**. If it does (like `for j = i to 5`), add up the inner counts row by row: often $1 + 2 + \\dots + n = \\frac{n(n+1)}{2}$.\n' +
    '- A counter that **doubles** (`i = i * 2`) up to $n$ only takes about $\\log_2 n$ steps: 1, 2, 4, ..., 64 is just 7 values.\n\n' +
    '### Converting between for and while loops\n\n' +
    'Every `for` loop can be rewritten as a `while` loop with three parts: **start** the counter before the loop, put the **condition** in the `while`, and **update** the counter as the last line of the body.\n\n' +
    '```\nfor i = 1 to 100        i = 1\n    body                while i <= 100\nend for                     body\n                            i = i + 1\n                        end while\n```\n\n' +
    'In exam options, check each part: Is the start right? Does the condition still include the last value (`<=` versus `<`)? Is there an update at all (no update means an **infinite loop**)? Does the update come **after** the work (updating first shifts every value by one step)? Is there a `break` that stops the loop too early?\n\n' +
    '### Finding bugs\n\n' +
    'The three bugs that appear again and again:\n\n' +
    '1. **Off-by-one**: the loop starts or stops one value too early or too late (`i = 1` instead of `i = 0`, `<` instead of `<=`).\n' +
    '2. **Wrong condition**: the test is reversed or uses the wrong operator (`>` instead of `<`, `==` instead of `!=`), or checks the wrong variable.\n' +
    '3. **Missing update**: on some path through the loop, the variable in the condition never changes, so the loop runs for ever.\n\n' +
    'To test a suggested fix, trace it on a tiny input (a list of 3 or 4 items) and compare with the answer you expect.\n\n' +
    '### What does this algorithm compute?\n\n' +
    'For "what does `mystery` do?" questions, trace **two small inputs**, write down the outputs, and look for the pattern. Watch whether a variable stores a **value** or a **position** (index), and whether a test is strict (`>`) or not (`>=`): that decides between "first" and "last" when there is a tie. Common patterns: `n mod 10` gets the last digit and `n div 10` removes it; repeated `mod 2` and `div 2` give binary digits; `r = r * 10 + digit` builds a number digit by digit.',
  formulas: [
    { label: 'Passes of `for i = a to b` (step 1)', tex: '\\text{passes} = b - a + 1', note: 'Both ends are included, so add 1 (the fencepost rule).' },
    { label: 'Passes of `i = a; while i < b; i = i + 1`', tex: '\\text{passes} = b - a', note: 'With `<=` instead of `<`, it is $b - a + 1$.' },
    { label: 'Inclusive loop with step $s$', tex: '\\text{passes} = \\left\\lfloor \\frac{b - a}{s} \\right\\rfloor + 1', note: 'Round down, then add 1 for the first value.' },
    { label: 'Strict loop (`while i < b`) with step $s$', tex: '\\text{passes} = \\left\\lceil \\frac{b - a}{s} \\right\\rceil', note: 'Round up: a partial last step still runs the body.' },
    { label: 'Condition checks of a while loop', tex: '\\text{checks} = \\text{passes} + 1', note: 'The last check is the one that fails and ends the loop.' },
    { label: 'Triangular nested loop (`j` from `i` to $n$, or from 1 to `i`)', tex: '1 + 2 + \\dots + n = \\frac{n(n+1)}{2}' },
    { label: 'Independent nested loops', tex: '\\text{passes} = (\\text{outer passes}) \\times (\\text{inner passes})' },
    { label: 'Doubling counter (`i = 1; while i <= n; i = i * 2`)', tex: '\\text{passes} = \\lfloor \\log_2 n \\rfloor + 1', note: 'For $n = 64$: $6 + 1 = 7$ passes (1, 2, 4, 8, 16, 32, 64).' },
    { label: 'For loop as a while loop', tex: '\\texttt{for } i = a \\texttt{ to } b \\;\\equiv\\; i = a,\\ \\texttt{while } i \\le b,\\ \\text{body},\\ i = i + 1', note: 'Start, condition, update at the end of the body.' },
    { label: 'Digit tools', tex: 'n \\bmod 10 = \\text{last digit}, \\qquad n \\,\\text{div}\\, 10 = n \\text{ without its last digit}' },
  ],
  examples: [
    {
      title: 'A simple trace table',
      problem: 'What is printed?\n\n```\nx = 4\ny = 1\nwhile x > 0\n    y = y * 2\n    x = x - 1\nend while\nprint(y)\n```',
      steps: [
        'Start: $x = 4$, $y = 1$.',
        'Check $4 > 0$: yes. $y = 1 \\times 2 = 2$, $x = 3$.',
        'Check $3 > 0$: yes. $y = 4$, $x = 2$.',
        'Check $2 > 0$: yes. $y = 8$, $x = 1$.',
        'Check $1 > 0$: yes. $y = 16$, $x = 0$.',
        'Check $0 > 0$: no, so the loop stops after 4 passes and `print(y)` shows 16.',
      ],
      answer: '16',
    },
    {
      title: 'Counting passes with a step',
      problem: 'How many times is `print(i)` executed?\n\n```\ni = 3\nwhile i < 20\n    print(i)\n    i = i + 4\nend while\n```',
      steps: [
        'List the values of `i` that pass the test: 3, 7, 11, 15, 19.',
        'The next value is 23, and $23 < 20$ is false, so the loop stops.',
        'That is 5 values, so 5 passes.',
        'Check with the formula: $\\left\\lceil \\frac{20 - 3}{4} \\right\\rceil = \\lceil 4.25 \\rceil = 5$.',
      ],
      answer: '5 times (and afterwards `i` is 23)',
    },
    {
      title: 'Choosing the equivalent while loop',
      problem:
        'Which while loop prints the same as `s = 0`, `for i = 1 to 10`, `s = s + i`, then `print(s)`? The options differ in the condition (`<` or `<=`), whether `i = i + 1` is present, and where it is placed.',
      steps: [
        'The for loop adds $1 + 2 + \\dots + 10 = \\frac{10 \\times 11}{2} = 55$.',
        'Start: the while version must set `i = 1` before the loop.',
        'Condition: it must still be true for $i = 10$, so `while i <= 10` (with `i < 10` the 10 is missed and you get 45).',
        'Update: `i = i + 1` must be present (otherwise the loop never ends) and must come **after** `s = s + i` (placing it first adds $2 + 3 + \\dots + 11 = 65$).',
      ],
      answer: '`i = 1`, `while i <= 10`, `s = s + i`, `i = i + 1`, then `print(s)` after the loop.',
    },
    {
      title: 'What does the algorithm compute?',
      problem: 'What does this return for a positive whole number `n`?\n\n```\nc = 0\nwhile n > 0\n    n = n div 10\n    c = c + 1\nend while\nreturn c\n```',
      steps: [
        'Try $n = 7$: `n` becomes 0 after one pass, so $c = 1$.',
        'Try $n = 4072$: `n` becomes 407, 40, 4, 0, which is 4 passes, so $c = 4$.',
        'Each pass removes one digit (`div 10` chops off the last digit), and the loop runs until no digits are left.',
        'So `c` counts the digits.',
      ],
      answer: 'The number of digits of `n`.',
    },
  ],
  traps: [
    '**The fencepost error**: `for i = 5 to 14` runs 10 times, not 9. Both ends are included, so the count is last $-$ first $+ 1$.',
    '**Using an old value**: inside a loop, once a line changes `x`, every later line sees the new `x`. Swapping-style code (`a = b` then `b = a`) loses the old value unless a temporary variable saves it first.',
    '**Stopping in the middle of a pass**: a `while` condition is only checked at the top. A pass that makes the condition false still runs to the end.',
    '**Last value printed versus final value**: after `i = 1; while i < 10; i = i + 3`, the last value printed is 7, but afterwards `i` is 10.',
    '**Missing or misplaced update**: no `i = i + 1` means an infinite loop; putting it before the work shifts every value by one step.',
    '**Value or position?**: if an algorithm stores `p = i`, it returns a position (index), not the item at that position. A strict `>` keeps the first of equal items; `>=` keeps the last.',
  ],
  examTip:
    'You have just over a minute per question, so trace efficiently. Write a small trace table on scrap paper with one column per variable and only write a row when something changes. For "how many times" questions, list the first value, the step and the last value, then use last $-$ first $+ 1$ for inclusive loops. For "which loop is equivalent" questions, check each option against the three parts (start, condition including the last value, update after the work) and cross out any option with a missing update (infinite loop) or `<` where `<=` is needed. For "what does it compute" questions, trace a tiny input such as 3 or a list of 3 items and test every option on it; a wrong option usually fails at once. Distractors are built from exactly the traps above, so if your answer is one away from another option, double-check the first and last pass.',
};
