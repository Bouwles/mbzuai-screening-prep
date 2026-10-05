import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'recursion',
  know:
    '### What is recursion?\n\n' +
    'A function is **recursive** when it calls **itself**. The idea is to solve a big problem by solving a slightly smaller copy of the same problem, then using that answer. For example, $5! = 5 \\times 4!$: to find $5!$ you only need $4!$, and to find $4!$ you only need $3!$, and so on.\n\n' +
    '### The two parts every recursive function needs\n\n' +
    '- **Base case:** the simplest input, answered **directly** with no further call (for factorial, $0! = 1$). This is what stops the recursion.\n' +
    '- **Recursive case:** the function calls itself on a **smaller** input and uses the result (`return n * fact(n - 1)`).\n\n' +
    'Each call must move the input **closer to the base case**. If there is no base case, or the input can jump over it (for example going down in steps of 2 from an odd number to a base case of 0), the calls never stop. Python then raises a `RecursionError` (maximum recursion depth exceeded, about 1000 calls). It does not run forever.\n\n' +
    '### The classic functions\n\n' +
    '| Function | Base case | Recursive case |\n' +
    '| --- | --- | --- |\n' +
    '| factorial `fact(n)` | `fact(0)` = 1 | `n * fact(n - 1)` |\n' +
    '| Fibonacci `fib(n)` | `fib(0)` = 0, `fib(1)` = 1 | `fib(n - 1) + fib(n - 2)` |\n' +
    '| power `power(b, e)` | `power(b, 0)` = 1 | `b * power(b, e - 1)` |\n' +
    '| sum of digits `ds(n)` | `n < 10`: return `n` | `n % 10 + ds(n // 10)` |\n' +
    '| sum to n `sum_to(n)` | `sum_to(0)` = 0 | `n + sum_to(n - 1)` |\n\n' +
    'For the digit sum, remember that `n % 10` is the **last digit** (5083 % 10 = 3) and `n // 10` **chops off** the last digit (5083 // 10 = 508).\n\n' +
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
    '| one call, exponent halved (`e // 2`), down to base 0 | $\\lfloor \\log_2 n \\rfloor + 2$ (for $n \\ge 1$), e.g. $10 \\to 5 \\to 2 \\to 1 \\to 0$ is 5 calls |\n' +
    '| two calls, both `n - 1` | $2^{n+1} - 1$ |\n' +
    '| two calls, `n - 1` and `n - 2` (Fibonacci) | $C(n) = 1 + C(n-1) + C(n-2)$ |\n\n' +
    '(The symbol $\\lfloor x \\rfloor$ means round $x$ down to a whole number, so $\\lfloor \\log_2 10 \\rfloor = 3$ because $2^3 = 8 \\le 10 < 16 = 2^4$.) For the Fibonacci pattern, $C(0) = C(1) = 1$ gives 1, 1, 3, 5, 9, 15, 25, ... The naive Fibonacci function is slow because it recomputes the same values again and again (`fib(5)` calls `fib(2)` three times).\n\n' +
    '### Recursion versus iteration\n\n' +
    'Anything written recursively can be rewritten with a loop, and the other way round. A loop version of `sum_to(n)` starts `total = 0`, adds `i` for `i = 1, 2, ..., n` and must increase `i` each time. Recursion is often shorter and closer to the mathematical definition; loops usually use less memory (no growing call stack) and are a little faster.',
  formulas: [
    { label: 'Factorial (recursive definition)', tex: '0! = 1, \\qquad n! = n \\times (n-1)!', note: 'Base case $0! = 1$. So $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.' },
    { label: 'Fibonacci', tex: 'F(0) = 0, \\quad F(1) = 1, \\quad F(n) = F(n-1) + F(n-2)', note: '0, 1, 1, 2, 3, 5, 8, 13, 21, ... Check which base cases the question uses.' },
    { label: 'Power by repeated multiplication', tex: 'b^0 = 1, \\qquad b^e = b \\times b^{e-1}', note: 'Makes $e + 1$ calls (exponents $e, e - 1, \\dots, 1, 0$).' },
    { label: 'Fast power (halving)', tex: 'b^{e} = \\left(b^{e/2}\\right)^{2} \\text{ if } e \\text{ even}, \\qquad b^{e} = b\\left(b^{(e-1)/2}\\right)^{2} \\text{ if } e \\text{ odd}', note: 'Each call halves the exponent (rounding down), so for $e \\ge 1$ only $\\lfloor \\log_2 e \\rfloor + 2$ calls are needed: for $e = 10$ that is 5 calls instead of 11.' },
    { label: 'Sum of digits', tex: 'S(n) = n \\text{ if } n < 10, \\qquad S(n) = (n \\bmod 10) + S(\\lfloor n/10 \\rfloor)', note: 'In Python: `n % 10` is the last digit, `n // 10` removes it.' },
    { label: 'Sum of 1 to n', tex: '\\text{sum}(0) = 0, \\quad \\text{sum}(n) = n + \\text{sum}(n-1) = \\frac{n(n+1)}{2}' },
    { label: 'Calls for one recursive call on n - 1 (base 0)', tex: '\\text{calls} = n + 1' },
    { label: 'Calls for two recursive calls on n - 1 (base 0)', tex: '\\text{calls} = 1 + 2 + 4 + \\dots + 2^{n} = 2^{n+1} - 1' },
    { label: 'Calls for naive Fibonacci', tex: 'C(0) = C(1) = 1, \\qquad C(n) = 1 + C(n-1) + C(n-2)', note: '1, 1, 3, 5, 9, 15, 25, 41, ...' },
    { label: 'Towers of Hanoi moves', tex: 'M(0) = 0, \\quad M(n) = 2M(n-1) + 1 = 2^{n} - 1' },
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
      problem: 'With `ds(n)` returning `n` when `n < 10` and otherwise `n % 10 + ds(n // 10)`, find `ds(472)`.',
      steps: [
        '`ds(472)`: last digit 472 % 10 = 2, then call `ds(47)`.',
        '`ds(47)`: last digit 7, then call `ds(4)`.',
        '`ds(4)`: $4 < 10$, base case, returns 4.',
        'Back up: `ds(47)` = 7 + 4 = 11, then `ds(472)` = 2 + 11 = 13.',
      ],
      answer: '`ds(472)` = 13 (that is $4 + 7 + 2$).',
    },
    {
      title: 'Where the print goes',
      problem: 'A function `p(n)` does nothing if `n == 0`; otherwise it runs `p(n - 1)` and **then** `print(n)`. What does `p(3)` print?',
      steps: [
        '`p(3)` calls `p(2)` first and waits; `p(2)` calls `p(1)` and waits; `p(1)` calls `p(0)`, which does nothing.',
        'Now the calls finish in reverse order: `p(1)` prints 1.',
        'Then `p(2)` prints 2, then `p(3)` prints 3.',
        'The prints happen on the way back up, so the order is reversed compared with the calls.',
      ],
      answer: 'It prints 1, 2, 3 (one per line).',
    },
    {
      title: 'Counting calls of naive Fibonacci (exam level)',
      problem: 'With `fib(n)` returning `n` for $n \\le 1$ and `fib(n - 1) + fib(n - 2)` otherwise, how many calls are made in total when `fib(6)` is evaluated (counting the first call)?',
      steps: [
        'Let $C(n)$ be the number of calls for `fib(n)`. Base cases make no further calls: $C(0) = C(1) = 1$.',
        'Every other call is itself plus the calls of its two children: $C(n) = 1 + C(n-1) + C(n-2)$.',
        '$C(2) = 1 + 1 + 1 = 3$, $C(3) = 1 + 3 + 1 = 5$, $C(4) = 1 + 5 + 3 = 9$.',
        '$C(5) = 1 + 9 + 5 = 15$, $C(6) = 1 + 15 + 9 = 25$.',
      ],
      answer: '25 calls (even though `fib(6)` is only 8).',
    },
  ],
  traps: [
    '**Stopping one level early or late.** `power(3, 4)` multiplies by 3 four times ($3^4 = 81$), not three times (27) or five times (243). Check the base case: what exactly does it return, and at which input?',
    '**Forgetting the base-case call when counting.** The call that hits the base case is still a call, and so is the very first call from the main program. `fact(6)` with base `n == 1` makes 6 calls, not 5.',
    '**Thinking missing base cases run forever.** In Python, infinite recursion stops with a `RecursionError` after about 1000 calls. Watch for steps that jump over the base case, like `f(n - 2)` from an odd number with base `n == 0`.',
    '**Mixing up `%` and `//`.** `n % 10` gives the last digit, `n // 10` removes it. Swapping them in a digit-sum function gives a completely different answer.',
    '**Ignoring the position of `print`.** A print before the recursive call outputs in call order; a print after it outputs in reverse. With two recursive calls, build the output from small cases: the output of `f(2)` is reused inside `f(3)`.',
    '**Answering with the value instead of the count.** "How many calls" and "what is returned" are different questions: `fib(5)` returns 5 but makes 15 calls.',
  ],
  examTip:
    'Recursion appears as "what does this print/return?", "how many times is the function called?", "what happens when it runs?" (look for a missing or skipped base case: the answer is a `RecursionError`) or "which loop does the same thing?". With about a minute per question, do not draw a huge call tree: **build a table from the base case upwards**, one row per level. For counting calls, write the recurrence $C(n)$ and fill in small values. Eliminate options fast: if you know the answer for $n - 1$ and $n + 1$, those are almost always distractors (off-by-one levels), and the returned value is a typical distractor in a "how many calls" question. For "which loop is equivalent", test every option with a tiny input such as $n = 3$ and also check $n = 0$.',
};
