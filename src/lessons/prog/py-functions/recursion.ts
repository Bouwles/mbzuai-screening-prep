import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'recursion',
  simple:
    'A **recursive** function solves a problem by calling itself on a smaller version of the same problem, like a set of Russian dolls where each doll holds a slightly smaller one. The smallest doll is the **base case**: an input simple enough to answer straight away, which stops the calls. For example, $5!$ is $5 \\times 4!$, and $4!$ is $4 \\times 3!$, and so on down to $0! = 1$. Without a base case the function would call itself forever.',
  methods: [
    { cue: '"What does this print?" for a function such as `return n * f(n - 1)` or `return 3 * F(n - 1) - 1`', method: 'Build a table from the base case upwards, applying the rule once per row until you reach the input asked about.' },
    { cue: 'A function with two recursive calls, such as `f(n - 1) + f(n - 2)`', method: 'Still tabulate bottom-up from **both** base cases; never expand the full call tree for the value.' },
    { cue: 'A `print` placed before or after the recursive call', method: 'Print before the call runs on the way down (largest first); print after the call runs as the calls return (smallest first).' },
    { cue: '"How many calls in total?" or "how deep does the call stack get?"', method: 'One call per level: count the inputs from the start down to the base case, including both. Two calls per level: use $C(n) = 1 + C(n-1) + C(n-2)$ or doubling.' },
    { cue: 'Code with no base case, or a step that can jump over it (e.g. `n - 2` from an odd number to `n == 0`)', method: 'The calls never stop, so the answer is "The function never stops" or "Infinite loop". A test such as `n <= 0` does catch a step that jumps past 0.' },
    { cue: '"What does `mystery(a, b)` compute?" or "which loop gives the same result?"', method: 'Trace one small example, spot the pattern (repeated adding is multiplication, etc.), then test each option with that example.' },
  ],
  know:
    '### What is recursion?\n\n' +
    'A function is **recursive** when it calls **itself**. The idea is to solve a big problem by solving a slightly smaller copy of the same problem, then using that answer. For example, $5! = 5 \\times 4!$: to find $5!$ you only need $4!$, and to find $4!$ you only need $3!$, and so on.\n\n' +
    '### The two parts every recursive function needs\n\n' +
    '- **Base case:** the simplest input, answered **directly** with no further call (for factorial, $0! = 1$). This is what stops the recursion.\n' +
    '- **Recursive case:** the function calls itself on a **smaller** input and uses the result.\n\n' +
    '```pseudocode\nfunction fact(n)\n   if n == 0\n      return 1\n   end if\n   return n * fact(n - 1)\nend function\n```\n\n' +
    'Each call must move the input **closer to the base case**. If there is no base case, or the input can jump over it (for example going down in steps of 2 from an odd number to a base case of `n == 0`), the calls never stop. Nothing returns and nothing is printed. A real program eventually runs out of memory for the call stack, but the function never reaches an answer.\n\n' +
    '### The classic functions\n\n' +
    '| Function | Base case | Recursive case |\n' +
    '| --- | --- | --- |\n' +
    '| factorial `fact(n)` | `fact(0)` = 1 | `n * fact(n - 1)` |\n' +
    '| Fibonacci `fib(n)` | `fib(0)` = 0, `fib(1)` = 1 | `fib(n - 1) + fib(n - 2)` |\n' +
    '| power `power(b, e)` | `power(b, 0)` = 1 | `b * power(b, e - 1)` |\n' +
    '| sum of digits `ds(n)` | `n < 10`: return `n` | `mod(n,10) + ds(div(n,10))` |\n' +
    '| sum to n `sumTo(n)` | `sumTo(0)` = 0 | `n + sumTo(n - 1)` |\n\n' +
    'For the digit sum, remember that `mod(n,10)` is the **last digit** (`mod(5083,10)` is 3) and `div(n,10)` **chops off** the last digit (`div(5083,10)` is 508).\n\n' +
    '### Tracing: down, then back up\n\n' +
    'When `fact(4)` runs, it cannot finish until `fact(3)` returns, which waits for `fact(2)`, and so on. So recursion happens in two phases:\n\n' +
    '1. **Going down:** calls are made, each one waiting: `fact(4)`, `fact(3)`, `fact(2)`, `fact(1)`, `fact(0)`.\n' +
    '2. **Coming back up:** the base case returns 1, then each waiting call finishes its multiplication: 1, 1, 2, 6, 24.\n\n' +
    'The fastest way to trace by hand is usually a **table built from the base case upwards**: write the base value, then apply the rule once per row until you reach the input you were asked about.\n\n' +
    '### The call stack\n\n' +
    'Every call that has started but not yet returned sits on the **call stack**, with its own copy of the variables (its own `n`). The stack is deepest at the moment the base case runs: for `fact(6)` with base case `n == 1`, the six calls `fact(6)` down to `fact(1)` are all on the stack together. Each level costs memory, which is why very deep recursion fails.\n\n' +
    '### Where the print is matters\n\n' +
    '- Code **before** the recursive call runs on the way **down**, in the order the calls are made (`print(n)` then `show(n - 1)` prints 3 2 1).\n' +
    '- Code **after** the recursive call runs on the way **back up**, in reverse order (`show(n - 1)` then `print(n)` prints 1 2 3).\n\n' +
    '### Counting calls\n\n' +
    'Exam questions often ask "how many times is the function called?". Look at **how many calls each call makes** and **how fast the input shrinks**:\n\n' +
    '| Pattern | Calls for input $n$ |\n' +
    '| --- | --- |\n' +
    '| one call, `n - 1`, down to base 0 | $n + 1$ |\n' +
    '| two calls, both `n - 1` | $2^{n+1} - 1$ |\n' +
    '| two calls, `n - 1` and `n - 2` (Fibonacci) | $C(n) = 1 + C(n-1) + C(n-2)$ |\n\n' +
    'For the Fibonacci pattern, $C(0) = C(1) = 1$ gives 1, 1, 3, 5, 9, 15, 25, ... The naive Fibonacci function is slow because it recomputes the same values again and again (`fib(5)` calls `fib(2)` three times).\n\n' +
    '### Recursion versus iteration\n\n' +
    'Anything written recursively can be rewritten with a loop, and the other way round. A loop version of `sumTo(n)` starts `t = 0` and adds `i` in `for i = 1 to n`. Recursion is often shorter and closer to the mathematical definition; loops usually use less memory (no growing call stack) and are a little faster.',
  formulas: [
    { label: 'Factorial (recursive definition)', tex: '0! = 1, \\qquad n! = n \\times (n-1)!', note: 'Base case $0! = 1$. So $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.' },
    { label: 'Fibonacci', tex: 'F(0) = 0, \\quad F(1) = 1, \\quad F(n) = F(n-1) + F(n-2)', note: '0, 1, 1, 2, 3, 5, 8, 13, 21, ... Check which base cases the question uses.' },
    { label: 'Power by repeated multiplication', tex: 'b^0 = 1, \\qquad b^e = b \\times b^{e-1}', note: 'Makes $e + 1$ calls (exponents $e, e - 1, \\dots, 1, 0$).' },
    { label: 'Sum of digits', tex: 'S(n) = n \\text{ if } n < 10, \\qquad S(n) = (n \\bmod 10) + S(\\lfloor n/10 \\rfloor)', note: 'In pseudocode: `mod(n,10)` is the last digit, `div(n,10)` removes it.' },
    { label: 'Sum of 1 to n', tex: '\\text{sum}(0) = 0, \\quad \\text{sum}(n) = n + \\text{sum}(n-1) = \\frac{n(n+1)}{2}' },
    { label: 'Calls for one recursive call on n - 1 (base 0)', tex: '\\text{calls} = n + 1' },
    { label: 'Calls for two recursive calls on n - 1 (base 0)', tex: '\\text{calls} = 1 + 2 + 4 + \\dots + 2^{n} = 2^{n+1} - 1' },
    { label: 'Calls for naive Fibonacci', tex: 'C(0) = C(1) = 1, \\qquad C(n) = 1 + C(n-1) + C(n-2)', note: '1, 1, 3, 5, 9, 15, 25, 41, ...' },
    { label: 'Maximum call-stack depth', tex: '\\text{depth} = \\text{number of calls in the longest chain from the first call to a base case}', note: 'For `fact(n)` with base case `n == 1` the depth is $n$.' },
  ],
  examples: [
    {
      title: 'Factorial, step by step',
      problem: 'What does `fact(4)` return, where `fact(n)` returns 1 if `n == 0` and otherwise returns `n * fact(n - 1)`?',
      steps: [
        'Going down: `fact(4)` needs `fact(3)`, which needs `fact(2)`, which needs `fact(1)`, which needs `fact(0)`.',
        'Base case: `fact(0)` returns 1.',
        'Coming back up: `fact(1)` = $1 \\times 1 = 1$, `fact(2)` = $2 \\times 1 = 2$.',
        '`fact(3)` = $3 \\times 2 = 6$, `fact(4)` = $4 \\times 6 = 24$.',
      ],
      answer: '`fact(4)` returns 24 (that is $4!$).',
    },
    {
      title: 'Sum of digits',
      problem: 'With `ds(n)` returning `n` when `n < 10` and otherwise `mod(n,10) + ds(div(n,10))`, find `ds(472)`.',
      steps: [
        '`ds(472)`: `mod(472,10)` is the last digit 2, then call `ds(47)`.',
        '`ds(47)`: last digit 7, then call `ds(4)`.',
        '`ds(4)`: $4 < 10$, base case, returns 4.',
        'Back up: `ds(47)` = 7 + 4 = 11, then `ds(472)` = 2 + 11 = 13.',
      ],
      answer: '`ds(472)` = 13 (that is $4 + 7 + 2$).',
    },
    {
      title: 'Where the print goes',
      problem: 'What does this print?\n\n```pseudocode\nfunction p(n)\n   if n > 0\n      p(n - 1)\n      print(n)\n   end if\nend function\n\np(3)\n```',
      steps: [
        '`p(3)` calls `p(2)` first and waits; `p(2)` calls `p(1)` and waits; `p(1)` calls `p(0)`, which does nothing.',
        'Now the calls finish in reverse order: `p(1)` prints 1.',
        'Then `p(2)` prints 2, then `p(3)` prints 3.',
        'The prints happen on the way back up, so the order is reversed compared with the calls.',
      ],
      answer: 'It prints 1, 2, 3 (one per line).',
    },
    {
      title: 'A step that jumps over the base case',
      problem: 'What does this print?\n\n```pseudocode\nfunction f(n)\n   if n == 0\n      return 0\n   end if\n   return n + f(n - 2)\nend function\n\nprint(f(3))\n```',
      steps: [
        'The base case needs `n` to be exactly 0, and each call subtracts 2.',
        'Starting from 3, the input goes 3, 1, $-1$, $-3$, and so on.',
        'It jumps from 1 straight to $-1$, so the base case is never reached and no call ever returns.',
      ],
      answer: 'Nothing is printed: the function never stops.',
    },
    {
      title: 'Counting calls of naive Fibonacci (exam level)',
      problem: 'With `fib(n)` returning `n` for $n \\le 1$ and `fib(n - 1) + fib(n - 2)` otherwise, how many calls are made in total when `fib(4)` is evaluated (counting the first call)?',
      steps: [
        'Let $C(n)$ be the number of calls for `fib(n)`. Base cases make no further calls: $C(0) = C(1) = 1$.',
        'Every other call is itself plus the calls of its two children: $C(n) = 1 + C(n-1) + C(n-2)$.',
        '$C(2) = 1 + 1 + 1 = 3$, $C(3) = 1 + 3 + 1 = 5$.',
        '$C(4) = 1 + 5 + 3 = 9$.',
      ],
      answer: '9 calls (even though `fib(4)` is only 3).',
    },
  ],
  traps: [
    '**Stopping one level early or late.** `power(3, 4)` multiplies by 3 four times ($3^4 = 81$), not three times (27) or five times (243). Check the base case: what exactly does it return, and at which input?',
    '**Forgetting the base-case call when counting.** The call that hits the base case is still a call, and so is the very first call from the main program. `fact(6)` with base `n == 1` makes 6 calls, not 5.',
    '**Missing a base case that gets jumped over.** Watch for steps like `f(n - 2)` from an odd number with base `n == 0`: the function never stops. With base `n <= 0` the same step does stop.',
    '**Mixing up `mod` and `div`.** `mod(n,10)` gives the last digit, `div(n,10)` removes it. Swapping them in a digit-sum function gives a completely different answer.',
    '**Ignoring the position of `print`.** A print before the recursive call outputs in call order; a print after it outputs in reverse. With two recursive calls, build the output from small cases: the output of `f(2)` is reused inside `f(3)`.',
    '**Answering with the value instead of the count.** "How many calls" and "what is returned" are different questions: `fib(5)` returns 5 but makes 15 calls.',
  ],
  examTip:
    'Recursion appears as "what does this print/return?", "how many times is the function called?", "what happens when it runs?" (look for a missing or skipped base case: the answer is that the function never stops) or "which loop does the same thing?". With about a minute per question, do not draw a huge call tree: **build a table from the base case upwards**, one row per level. For counting calls, write the recurrence $C(n)$ and fill in small values. Eliminate options fast: if you know the answer for $n - 1$ and $n + 1$, those are almost always distractors (off-by-one levels), and the returned value is a typical distractor in a "how many calls" question. For "which loop is equivalent", test every option with a tiny input such as $n = 3$ and also check $n = 0$.',
};
