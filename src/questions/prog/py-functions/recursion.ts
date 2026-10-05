import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- helpers used only by the answer checks
// Each one re-implements the recursive function from the question in TypeScript, so the
// check re-derives the answer instead of returning a literal.

/** Runs a recursive function while counting calls and tracking the deepest call-stack depth. */
function tracker() {
  const t = { calls: 0, depth: 0, maxDepth: 0 };
  const enter = () => {
    t.calls++;
    t.depth++;
    t.maxDepth = Math.max(t.maxDepth, t.depth);
  };
  const leave = () => {
    t.depth--;
  };
  return { t, enter, leave };
}

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'recursion-001',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'Every correct recursive function needs a **base case**. What is the job of the base case?',
    options: [
      'It is the part of the function that calls itself on a smaller input.',
      'It is the first call made to the function from the main program.',
      'It gives a direct answer for the simplest input, so the function stops calling itself.',
      'It only makes the function faster; the function would still give the right answer without it.',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'A recursive function has two parts:\n\n' +
        '- the **base case**: a simple input (such as $n = 0$) where the answer is returned **directly**, with no further recursive call;\n' +
        '- the **recursive case**: the function calls itself on a **smaller** input and uses that result.\n\n' +
        'Each recursive call moves the input closer to the base case. When the base case is reached, the calls stop and the answers are passed back up. Without a base case the calls never stop (in Python you get a `RecursionError`).\n\n' +
        'So the base case gives a direct answer for the simplest input, which stops the recursion.',
      whyWrong: [
        'This describes the **recursive case**, not the base case. The recursive case is the part that calls the function again.',
        'The first call from the main program is just the initial call. It can be any input; it is not the base case.',
        null,
        'The base case is essential, not an optional speed-up. Without it the function keeps calling itself until Python raises a `RecursionError`, so there is no answer at all.',
      ],
      keyIdea: 'The base case is the stopping condition: it answers the simplest input directly, without another recursive call.',
    },
  },
  {
    id: 'recursion-002',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'def fact(n):\n    if n == 0:\n        return 1\n    return n * fact(n - 1)\n\nprint(fact(5))',
    },
    options: ['`24`', '`120`', '`720`', '`15`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Each call waits for the next one, until the base case `fact(0)` returns 1:\n\n' +
        '- `fact(5)` = 5 times `fact(4)`\n' +
        '- `fact(4)` = 4 times `fact(3)`\n' +
        '- `fact(3)` = 3 times `fact(2)`\n' +
        '- `fact(2)` = 2 times `fact(1)`\n' +
        '- `fact(1)` = 1 times `fact(0)`\n' +
        '- `fact(0)` = 1 (base case)\n\n' +
        'Now the answers come back up: `fact(1)` = 1, `fact(2)` = 2, `fact(3)` = 6, `fact(4)` = 24, `fact(5)` = 120.\n\n' +
        '$$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$$\n\n' +
        'Output: `120`.',
      whyWrong: [
        'This is $4! = 24$, the value of `fact(4)`. You stopped one level too early: the outer call still multiplies by 5.',
        null,
        'This is $6! = 720$. You did one multiplication too many; the first call is `fact(5)`, not `fact(6)`.',
        'This is $5 + 4 + 3 + 2 + 1 = 15$. The function **multiplies** by `n` at each level (`n * fact(n - 1)`), it does not add.',
      ],
      keyIdea: '`fact(n)` returns `n * fact(n - 1)` with base case `fact(0)` = 1, which unwinds to $n! = n \\times (n-1) \\times \\dots \\times 1$.',
    },
    python: { stdout: '120\n' },
    check: {
      optionValues: [24, 120, 720, 15],
      compute: () => {
        const fact = (n: number): number => (n === 0 ? 1 : n * fact(n - 1));
        return fact(5);
      },
    },
  },
  {
    id: 'recursion-003',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What does this Python code print? (Each printed line is shown separated by spaces.)',
    code: {
      lang: 'python',
      source: 'def countdown(n):\n    if n == 0:\n        print("Go!")\n    else:\n        print(n)\n        countdown(n - 1)\n\ncountdown(3)',
    },
    options: ['`1 2 3 Go!`', '`Go! 3 2 1`', '`3 2 1 0 Go!`', '`3 2 1 Go!`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Follow the calls in order. In the recursive case the function **prints first**, then calls itself.\n\n' +
        '| Call | `n == 0`? | What happens |\n' +
        '| --- | --- | --- |\n' +
        '| `countdown(3)` | no | prints 3, calls `countdown(2)` |\n' +
        '| `countdown(2)` | no | prints 2, calls `countdown(1)` |\n' +
        '| `countdown(1)` | no | prints 1, calls `countdown(0)` |\n' +
        '| `countdown(0)` | yes | prints Go! (base case, no more calls) |\n\n' +
        'Output (one item per line): `3 2 1 Go!`.',
      whyWrong: [
        'This reverses the numbers. That would happen only if `print(n)` came **after** the recursive call. Here it comes before, so 3 is printed first.',
        'The base case is reached **last**, not first. `Go!` is printed only when `n` has counted down to 0.',
        'When `n` is 0 the function takes the base-case branch and prints `Go!` instead of the number, so 0 is never printed.',
        null,
      ],
      keyIdea: 'Code before the recursive call runs on the way down, so the numbers appear in the order the calls are made.',
    },
    python: { stdout: '3\n2\n1\nGo!\n' },
    check: {
      optionValues: ['1 2 3 Go!', 'Go! 3 2 1', '3 2 1 0 Go!', '3 2 1 Go!'],
      compute: () => {
        const out: string[] = [];
        const countdown = (n: number): void => {
          if (n === 0) out.push('Go!');
          else {
            out.push(String(n));
            countdown(n - 1);
          }
        };
        countdown(3);
        return out.join(' ');
      },
    },
  },
  {
    id: 'recursion-004',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What happens when this Python code runs?',
    code: {
      lang: 'python',
      source: 'def total(n):\n    return n + total(n - 1)\n\nprint(total(3))',
    },
    options: [
      'It prints `6`',
      'It prints `3`',
      'A `RecursionError` is raised, because the function never stops calling itself',
      'A `SyntaxError` is raised, because a function must contain an `if` statement',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'There is **no base case**: every call to `total` immediately calls `total` again with a smaller number.\n\n' +
        '- `total(3)` calls `total(2)`\n' +
        '- `total(2)` calls `total(1)`\n' +
        '- `total(1)` calls `total(0)`\n' +
        '- `total(0)` calls `total(-1)`, then `total(-2)`, and so on...\n\n' +
        'Nothing ever returns, so no addition is ever finished. Each waiting call takes space on the **call stack**. Python limits how deep the stack can go (about 1000 calls by default), so it stops the program with a `RecursionError: maximum recursion depth exceeded`. Nothing is printed.',
      whyWrong: [
        'This is $3 + 2 + 1 = 6$, which you would get **if** the function had a base case such as `if n == 0: return 0`. Without it, the calls go past 0 into negative numbers forever.',
        'This treats `total(3)` as if it just returned `n`. But `return n + total(n - 1)` must first get the value of `total(2)`, which needs `total(1)`, and so on without end, so nothing is ever returned or printed.',
        null,
        'The code is valid Python syntax: a function does not need an `if`. The problem only appears when it runs (a runtime error), not when it is read.',
      ],
      keyIdea: 'A recursive function with no base case never stops calling itself, and Python raises a RecursionError.',
    },
    python: { error: 'RecursionError' },
  },
  {
    id: 'recursion-005',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem:
      'The Fibonacci numbers are defined recursively by $F(0) = 0$, $F(1) = 1$ and $F(n) = F(n-1) + F(n-2)$ for $n \\ge 2$. What is $F(7)$?',
    options: ['$8$', '$21$', '$13$', '$11$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Build up from the two base cases, adding the previous two values each time:\n\n' +
        '| $n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $F(n)$ | 0 | 1 | 1 | 2 | 3 | 5 | 8 | 13 |\n\n' +
        'For example $F(6) = F(5) + F(4) = 5 + 3 = 8$ and $F(7) = F(6) + F(5) = 8 + 5 = 13$.\n\n' +
        'So $F(7) = 13$.',
      whyWrong: [
        'This is $F(6)$. You were off by one: the list starts at $F(0)$, so 13 is the eighth number in the list but it is $F(7)$.',
        'This is what you get if you start with $F(0) = 1$ instead of $F(0) = 0$ (the sequence 1, 1, 2, 3, 5, 8, 13, 21). Always use the base cases you are given.',
        null,
        'This adds the **inputs** $6 + 5$ instead of the **values** $F(6) + F(5)$. The rule adds the previous two Fibonacci numbers, not $n - 1$ and $n - 2$.',
      ],
      keyIdea: 'Evaluate a recursive sequence bottom-up from its base cases, keeping careful track of the index.',
    },
    check: {
      optionValues: [8, 21, 13, 11],
      compute: () => {
        const F = (n: number): number => (n <= 1 ? n : F(n - 1) + F(n - 2));
        return F(7);
      },
    },
  },
  {
    id: 'recursion-006',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'def power(b, e):\n    if e == 0:\n        return 1\n    return b * power(b, e - 1)\n\nprint(power(3, 4))',
    },
    options: ['`81`', '`27`', '`243`', '`12`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each call multiplies by `b = 3` and lowers the exponent by 1, until `e == 0` returns 1.\n\n' +
        '- `power(3, 0)` = 1 (base case)\n' +
        '- `power(3, 1)` = 3 times 1 = 3\n' +
        '- `power(3, 2)` = 3 times 3 = 9\n' +
        '- `power(3, 3)` = 3 times 9 = 27\n' +
        '- `power(3, 4)` = 3 times 27 = 81\n\n' +
        'This is $3^4 = 81$. Output: `81`.',
      whyWrong: [
        null,
        'This is $3^3$: you stopped one level early. The calls with $e = 4, 3, 2, 1$ each multiply by 3, which is four multiplications.',
        'This is $3^5$: one multiplication too many. The base case `power(3, 0)` returns 1, it does not multiply by 3 again.',
        'This multiplies the two inputs, $3 \\times 4$. The recursion multiplies by 3 **four times**, which is $3^4$, not $3 \\times 4$.',
      ],
      keyIdea: '`power(b, e)` returns `b * power(b, e - 1)` with base case `power(b, 0)` = 1, so it computes $b^e$ by multiplying by $b$ exactly $e$ times.',
    },
    python: { stdout: '81\n' },
    check: {
      optionValues: [81, 27, 243, 12],
      compute: () => {
        const power = (b: number, e: number): number => (e === 0 ? 1 : b * power(b, e - 1));
        return power(3, 4);
      },
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'recursion-007',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'def digit_sum(n):\n    if n < 10:\n        return n\n    return n % 10 + digit_sum(n // 10)\n\nprint(digit_sum(5083))',
    },
    options: ['`11`', '`3`', '`511`', '`16`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`n % 10` is the **last digit** and `n // 10` **removes** the last digit.\n\n' +
        '| Call | `n < 10`? | `n % 10` | next call |\n' +
        '| --- | --- | --- | --- |\n' +
        '| `digit_sum(5083)` | no | 3 | `digit_sum(508)` |\n' +
        '| `digit_sum(508)` | no | 8 | `digit_sum(50)` |\n' +
        '| `digit_sum(50)` | no | 0 | `digit_sum(5)` |\n' +
        '| `digit_sum(5)` | yes | returns 5 | (base case) |\n\n' +
        'Adding on the way back up: 3 + 8 + 0 + 5 = 16.\n\nOutput: `16`.',
      whyWrong: [
        'This is 3 + 8 + 0 = 11: it leaves out the first digit 5. The base case returns `n` itself (5), not 0, so the 5 is included.',
        'This is only the last digit (`5083 % 10`). The function keeps going: it adds the digit sum of 508 as well.',
        'This swaps `%` and `//`, as if the code were `n // 10 + digit_sum(n % 10)`: that gives $508 + 3 = 511$. Here `%` gives the last digit and `//` gives the rest of the number.',
        null,
      ],
      keyIdea: '`n % 10` peels off the last digit and `n // 10` shrinks the number, until a single digit (the base case) is left.',
    },
    python: { stdout: '16\n' },
    check: {
      optionValues: [11, 3, 511, 16],
      compute: () => {
        const ds = (n: number): number => (n < 10 ? n : (n % 10) + ds(Math.floor(n / 10)));
        return ds(5083);
      },
    },
  },
  {
    id: 'recursion-008',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What does this Python code print? (Each printed line is shown separated by spaces.)',
    code: {
      lang: 'python',
      source: 'def show(n):\n    if n > 0:\n        show(n - 1)\n        print(n)\n\nshow(3)',
    },
    options: ['`3 2 1`', '`1 2 3`', '`0 1 2 3`', '`3`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Here the recursive call comes **before** `print(n)`, so each call must wait for the smaller call to finish before it prints.\n\n' +
        '1. `show(3)` calls `show(2)` and waits (3 not printed yet).\n' +
        '2. `show(2)` calls `show(1)` and waits.\n' +
        '3. `show(1)` calls `show(0)` and waits.\n' +
        '4. `show(0)`: $0 > 0$ is false, so it does nothing and returns.\n' +
        '5. Back in `show(1)`: prints 1.\n' +
        '6. Back in `show(2)`: prints 2.\n' +
        '7. Back in `show(3)`: prints 3.\n\n' +
        'The prints happen while the call stack **unwinds**. Output: `1 2 3`.',
      whyWrong: [
        'This would be the output if `print(n)` came **before** `show(n - 1)`. Because the print is after the call, the smallest number is printed first.',
        null,
        '`show(0)` does not print anything: the test `n > 0` is false, so the whole body is skipped.',
        'The inner calls are not lost: each call `show(2)` and `show(1)` also reaches its own `print(n)` when it finishes, so 1 and 2 are printed too.',
      ],
      keyIdea: 'Code placed after the recursive call runs as the call stack unwinds, so it runs in reverse order of the calls.',
    },
    python: { stdout: '1\n2\n3\n' },
    check: {
      optionValues: ['3 2 1', '1 2 3', '0 1 2 3', '3'],
      compute: () => {
        const out: number[] = [];
        const show = (n: number): void => {
          if (n > 0) {
            show(n - 1);
            out.push(n);
          }
        };
        show(3);
        return out.join(' ');
      },
    },
  },
  {
    id: 'recursion-009',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem:
      'The function below is called as `fact(6)`. While it runs, what is the **largest** number of `fact` calls that are on the call stack at the same moment (including the original call and the base-case call)?',
    code: {
      lang: 'python',
      source: 'def fact(n):\n    if n == 1:\n        return 1\n    return n * fact(n - 1)',
    },
    options: ['$5$', '$7$', '$6$', '$720$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A call stays on the call stack until it returns. `fact(6)` cannot return until it has the value of `fact(5)`, and so on down.\n\n' +
        'At the moment the base case `fact(1)` is running, all of these are on the stack, waiting:\n\n' +
        '| Stack (top first) | Waiting to compute |\n' +
        '| --- | --- |\n' +
        '| `fact(1)` | returns 1 now |\n' +
        '| `fact(2)` | 2 times `fact(1)` |\n' +
        '| `fact(3)` | 3 times `fact(2)` |\n' +
        '| `fact(4)` | 4 times `fact(3)` |\n' +
        '| `fact(5)` | 5 times `fact(4)` |\n' +
        '| `fact(6)` | 6 times `fact(5)` |\n\n' +
        'That is $6$ calls at once, the maximum depth. After this the calls return one by one and the stack shrinks.',
      whyWrong: [
        'This forgets to count the base-case call `fact(1)`. It is a real call too, and it sits on top of the other five.',
        'This assumes the calls go down to `fact(0)`. The base case here is `n == 1`, so `fact(1)` returns straight away and `fact(0)` is never called.',
        null,
        'This is the **value** returned, $6! = 720$, not the number of calls on the stack.',
      ],
      keyIdea: 'Each pending call takes a frame on the call stack; the maximum depth equals the length of the longest chain of calls.',
    },
    check: {
      optionValues: [5, 7, 6, 720],
      compute: () => {
        const { t, enter, leave } = tracker();
        const fact = (n: number): number => {
          enter();
          const r = n === 1 ? 1 : n * fact(n - 1);
          leave();
          return r;
        };
        fact(6);
        return t.maxDepth;
      },
    },
  },
  {
    id: 'recursion-010',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem:
      'Which loop-based version returns the **same value** as `sumTo(n)` for every whole number $n \\ge 0$? (Each option is written on one line; `;` separates the lines.)',
    code: {
      lang: 'pseudocode',
      source:
        'FUNCTION sumTo(n)\n    IF n == 0 THEN\n        RETURN 0\n    ELSE\n        RETURN n + sumTo(n - 1)\n    END IF\nEND FUNCTION',
    },
    options: [
      '`total = 0; i = 1; WHILE i < n: total = total + i; i = i + 1; END WHILE; RETURN total`',
      '`total = 0; i = 1; WHILE i <= n: total = total + i; END WHILE; RETURN total`',
      '`total = 0; i = 1; WHILE i <= n: i = i + 1; total = total + i; END WHILE; RETURN total`',
      '`total = 0; i = 1; WHILE i <= n: total = total + i; i = i + 1; END WHILE; RETURN total`',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'First work out what the recursion computes. `sumTo(n)` = `n + sumTo(n - 1)`, down to `sumTo(0) = 0`, so\n\n' +
        '$$\\text{sumTo}(n) = n + (n-1) + \\dots + 2 + 1$$\n\n' +
        'For example `sumTo(3)` = 3 + 2 + 1 + 0 = 6.\n\n' +
        'The loop must add every whole number from 1 up to **and including** `n`, and must move `i` on each time. Test each loop with `n = 3` (answer 6):\n\n' +
        '- `WHILE i <= n` with add then increase: adds 1, 2, 3, total 6. Correct. For `n = 0` the loop never runs and it returns 0, also correct.\n' +
        '- `WHILE i < n`: adds 1, 2 only, total 3. Wrong.\n' +
        '- No `i = i + 1`: `i` stays 1 forever, an infinite loop.\n' +
        '- Increase before adding: adds 2, 3, 4, total 9. Wrong.\n\n' +
        'So the matching loop is `WHILE i <= n`, adding `i` and then increasing it.',
      whyWrong: [
        'The condition `i < n` stops before adding `n` itself: for `n = 3` it gives 1 + 2 = 3 instead of 6.',
        'There is no `i = i + 1`, so `i` stays at 1 and the condition `i <= n` is always true (for $n \\ge 1$): an infinite loop.',
        'It increases `i` **before** adding it, so it adds 2, 3, ..., n + 1 instead of 1, 2, ..., n: for `n = 3` it gives 9 instead of 6.',
        null,
      ],
      keyIdea: 'Every recursive function can be rewritten as a loop: find what it computes, then check the loop condition, the update and the order of steps.',
    },
  },
  {
    id: 'recursion-011',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'def rev(s):\n    if s == "":\n        return ""\n    return rev(s[1:]) + s[0]\n\nprint(rev("code"))',
    },
    options: ['`code`', '`edoc`', '`doc`', '`edo`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`s[0]` is the first character and `s[1:]` is everything after it. Each call puts its first character at the **end** of the reversed rest.\n\n' +
        '| Call | `s[0]` | returns |\n' +
        '| --- | --- | --- |\n' +
        '| `rev("code")` | c | `rev("ode")` + "c" |\n' +
        '| `rev("ode")` | o | `rev("de")` + "o" |\n' +
        '| `rev("de")` | d | `rev("e")` + "d" |\n' +
        '| `rev("e")` | e | `rev("")` + "e" |\n' +
        '| `rev("")` | - | "" (base case) |\n\n' +
        'Coming back up: `rev("e")` = "e", `rev("de")` = "ed", `rev("ode")` = "edo", `rev("code")` = "edoc".\n\nOutput: `edoc`.',
      whyWrong: [
        'This is what `s[0] + rev(s[1:])` would give (first character in front). The code adds `s[0]` at the **end**, which reverses the string.',
        null,
        'This loses the letter e. It is what you get if you think `rev("e")` returns an empty string, but `rev("e")` = `rev("")` + "e" = "e".',
        'This forgets the last step: after `rev("ode")` returns "edo", the very first call still adds its own `s[0]`, which is "c".',
      ],
      keyIdea: '`rev(s[1:]) + s[0]` moves each first character to the end, so the string comes back reversed.',
    },
    python: { stdout: 'edoc\n' },
    check: {
      optionValues: ['code', 'edoc', 'doc', 'edo'],
      compute: () => {
        const rev = (s: string): string => (s === '' ? '' : rev(s.slice(1)) + s[0]);
        return rev('code');
      },
    },
  },
  {
    id: 'recursion-012',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'For positive whole numbers $a$ and $b$, what does `mystery(a, b)` return?',
    code: {
      lang: 'python',
      source: 'def mystery(a, b):\n    if b == 0:\n        return 0\n    return a + mystery(a, b - 1)',
    },
    options: ['$a + b$', '$a^b$', '$a(b - 1)$', '$a \\times b$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Try a small example, `mystery(6, 4)`:\n\n' +
        '- `mystery(6, 4)` = 6 + `mystery(6, 3)`\n' +
        '- `mystery(6, 3)` = 6 + `mystery(6, 2)`\n' +
        '- `mystery(6, 2)` = 6 + `mystery(6, 1)`\n' +
        '- `mystery(6, 1)` = 6 + `mystery(6, 0)`\n' +
        '- `mystery(6, 0)` = 0 (base case)\n\n' +
        'So `mystery(6, 4)` = 6 + 6 + 6 + 6 + 0 = 24. The value $a$ is added once for each of $b = 4, 3, 2, 1$, which is $b$ times.\n\n' +
        'Adding $a$ to itself $b$ times is multiplication: `mystery(a, b)` returns $a \\times b$. Check: $6 \\times 4 = 24$.',
      whyWrong: [
        'This adds the two inputs once. The function adds $a$ again at **every** level of recursion, $b$ times in total (for 6 and 4 it gives 24, not 10).',
        'This would need `a * mystery(a, b - 1)` with base case 1 (repeated **multiplication**). The code uses `+` and returns 0 at the base, which is repeated **addition**.',
        'This undercounts by one level: the calls with $b, b - 1, \\dots, 1$ each add one $a$, which is $b$ additions, not $b - 1$ (the base-case call adds nothing).',
        null,
      ],
      keyIdea: 'Trace a small example, then spot the pattern: adding $a$ once per level for $b$ levels gives $a \\times b$.',
    },
    check: {
      // evaluate each option at a = 6, b = 4 and compare with the real recursion
      optionValues: [6 + 4, 6 ** 4, 6 * (4 - 1), 6 * 4],
      compute: () => {
        const mystery = (a: number, b: number): number => (b === 0 ? 0 : a + mystery(a, b - 1));
        return mystery(6, 4);
      },
    },
  },
  {
    id: 'recursion-013',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'Which statement about **recursion** and **iteration** (loops) is TRUE?',
    options: [
      'Recursion is always faster than a loop that solves the same problem.',
      'Each recursive call that has not yet returned uses extra memory on the call stack, whereas a simple loop does not need this.',
      'Some problems can be solved with recursion but can never be solved with loops.',
      'A recursive function must contain a loop in order to repeat its work.',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Check each statement:\n\n' +
        '- **Memory:** every call that is still waiting (for example `fact(6)` waiting for `fact(5)`) keeps a frame on the call stack holding its own variables. A deep recursion therefore uses memory that grows with the depth, and Python stops it at about 1000 levels with a `RecursionError`. A simple loop just updates the same few variables. TRUE.\n' +
        '- **Speed:** recursion is usually a little **slower** than a loop because each function call has overhead, and naive recursion (like the two-call Fibonacci) can repeat work massively. FALSE.\n' +
        '- **Power:** anything written recursively can be rewritten with loops (if necessary using your own stack), and the other way round. FALSE.\n' +
        '- **Loops inside:** recursion repeats work by the function calling itself. It does not need a loop. FALSE.',
      whyWrong: [
        'Function calls have overhead, so recursion is usually slightly slower than an equivalent loop, and naive recursion can be hugely slower because it repeats the same calls.',
        null,
        'Recursion and iteration are equally powerful: any recursive algorithm can be converted into a loop (possibly using an explicit stack), and the other way round.',
        'Recursion replaces the loop: the repetition comes from the function calling itself, so no loop is needed (look at `fact` or `power`).',
      ],
      keyIdea: 'Recursion and loops can solve the same problems, but each pending recursive call costs a stack frame of memory.',
    },
  },
  {
    id: 'recursion-014',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What value is output by this pseudocode?',
    code: {
      lang: 'pseudocode',
      source:
        'FUNCTION F(n)\n    IF n == 1 THEN\n        RETURN 2\n    ELSE\n        RETURN 3 * F(n - 1) - 1\n    END IF\nEND FUNCTION\n\nOUTPUT F(4)',
    },
    options: ['$14$', '$41$', '$122$', '$54$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Start from the base case and work upwards. Each step: multiply the previous value by 3, then subtract 1.\n\n' +
        '- $F(1) = 2$ (base case)\n' +
        '- $F(2) = 3 \\times 2 - 1 = 5$\n' +
        '- $F(3) = 3 \\times 5 - 1 = 14$\n' +
        '- $F(4) = 3 \\times 14 - 1 = 41$\n\n' +
        'Output: $41$.',
      whyWrong: [
        'This is $F(3)$: you stopped one step early. $F(4)$ needs one more step, $3 \\times 14 - 1 = 41$.',
        null,
        'This is $F(5) = 3 \\times 41 - 1$: one step too many. The base case is $F(1)$, so $F(4)$ needs only three steps after it.',
        'This forgets to subtract 1 at each step: $2 \\times 3 \\times 3 \\times 3 = 54$. The rule is $3F(n-1) - 1$.',
      ],
      keyIdea: 'Evaluate a recursive definition bottom-up from the base case, applying the rule once per level.',
    },
    check: {
      optionValues: [14, 41, 122, 54],
      compute: () => {
        const F = (n: number): number => (n === 1 ? 2 : 3 * F(n - 1) - 1);
        return F(4);
      },
    },
  },
  {
    id: 'recursion-015',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What happens when this Python code runs?',
    code: {
      lang: 'python',
      source: 'def f(n):\n    if n == 0:\n        return 0\n    return n + f(n - 2)\n\nprint(f(5))',
    },
    options: [
      'It prints `9`',
      'It prints `15`',
      'A `RecursionError` is raised',
      'The program runs forever and never stops',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'The base case is `n == 0`, but each call subtracts **2**. Starting from an odd number:\n\n' +
        '$$5 \\to 3 \\to 1 \\to -1 \\to -3 \\to -5 \\to \\dots$$\n\n' +
        '`n` jumps from 1 straight to $-1$, so it **skips over 0** and the base case is never reached. The calls keep piling up on the call stack. Python limits the recursion depth (about 1000 by default), so it stops the program with a `RecursionError`.\n\n' +
        '(With an even input such as `f(4)` it would work: 4 + 2 + 0 = 6.)',
      whyWrong: [
        'This is $5 + 3 + 1$, assuming the recursion stops at 1. But the base case is `n == 0`, and 1 is not 0, so the function calls `f(-1)` next.',
        'This is $5 + 4 + 3 + 2 + 1$, which treats the step as `n - 1`. The code subtracts 2 each time.',
        null,
        'In theory the calls never end, but Python does not run forever: once the call stack gets too deep (about 1000 calls) it raises a `RecursionError`.',
      ],
      keyIdea: 'Every recursive call must move towards the base case; a step that can jump over it causes infinite recursion and a RecursionError.',
    },
    python: { error: 'RecursionError' },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'recursion-016',
    subtopic: 'recursion',
    difficulty: 'challenge',
    stem:
      'Counting the original call `fib(5)` itself, how many times in total is the function `fib` called when `fib(5)` is evaluated?',
    code: {
      lang: 'python',
      source: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)',
    },
    options: ['$5$', '$9$', '$15$', '$6$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $C(n)$ be the number of calls made when `fib(n)` is evaluated (including that call).\n\n' +
        '- Base cases: `fib(0)` and `fib(1)` make no further calls, so $C(0) = 1$ and $C(1) = 1$.\n' +
        '- Otherwise `fib(n)` is one call **plus** all the calls made by `fib(n - 1)` **plus** all the calls made by `fib(n - 2)`:\n\n' +
        '$$C(n) = 1 + C(n-1) + C(n-2)$$\n\n' +
        '| $n$ | 0 | 1 | 2 | 3 | 4 | 5 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $C(n)$ | 1 | 1 | 3 | 5 | 9 | 15 |\n\n' +
        'For example $C(4) = 1 + 5 + 3 = 9$ and $C(5) = 1 + 9 + 5 = 15$.\n\n' +
        'Check by counting the call tree: `fib(5)` once, `fib(4)` once, `fib(3)` twice, `fib(2)` three times, `fib(1)` five times, `fib(0)` three times: $1 + 1 + 2 + 3 + 5 + 3 = 15$.',
      whyWrong: [
        'This is the **value** `fib(5)` returns (0, 1, 1, 2, 3, 5), not the number of calls.',
        'This is $C(4)$, the number of calls for `fib(4)`. You need one more level: $C(5) = 1 + C(4) + C(3) = 1 + 9 + 5 = 15$.',
        null,
        'This counts one call for each value 5, 4, 3, 2, 1, 0, as if every value were computed only once. The naive function recomputes the same values many times (for example `fib(2)` is called three times).',
      ],
      keyIdea: 'The number of calls satisfies its own recurrence: $C(n) = 1 + C(n-1) + C(n-2)$ for the two-call Fibonacci.',
    },
    check: {
      optionValues: [5, 9, 15, 6],
      compute: () => {
        const { t, enter, leave } = tracker();
        const fib = (n: number): number => {
          enter();
          const r = n <= 1 ? n : fib(n - 1) + fib(n - 2);
          leave();
          return r;
        };
        fib(5);
        return t.calls;
      },
    },
  },
  {
    id: 'recursion-017',
    subtopic: 'recursion',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'def f(n):\n    if n == 0:\n        return\n    f(n - 1)\n    print(n, end=" ")\n    f(n - 1)\n\nf(3)',
    },
    options: ['`3 2 1 1 2 1 1`', '`1 2 1 3 1 2 1`', '`1 1 2 1 1 2 3`', '`1 2 3`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Each call does three things in order: (1) run `f(n - 1)`, (2) print `n`, (3) run `f(n - 1)` again. `f(0)` prints nothing.\n\n' +
        'Build it up from small cases:\n\n' +
        '- `f(1)`: `f(0)` (nothing), print 1, `f(0)` (nothing). Output: 1\n' +
        '- `f(2)`: `f(1)` gives 1, print 2, `f(1)` gives 1. Output: 1 2 1\n' +
        '- `f(3)`: `f(2)` gives 1 2 1, print 3, `f(2)` gives 1 2 1. Output: 1 2 1 3 1 2 1\n\n' +
        'Because of `end=" "` everything is on one line. Output: `1 2 1 3 1 2 1`.\n\n' +
        '(In total 7 numbers are printed: one print per non-base call, and the call tree has $1 + 2 + 4 = 7$ such calls.)',
      whyWrong: [
        'This prints `n` **before** both recursive calls. In the code the print sits **between** the two calls, so the left half of the output comes first.',
        null,
        'This prints `n` **after** both recursive calls. In the code the print is in the middle, so 3 appears in the centre of the output, not at the end.',
        'This follows only the first recursive call in each function and ignores the second `f(n - 1)`, which repeats the whole smaller pattern after each print.',
      ],
      keyIdea: 'With two recursive calls, solve small cases first and reuse them: the output of `f(n)` is the output of `f(n - 1)`, then `n`, then the output of `f(n - 1)` again.',
    },
    python: { stdout: '1 2 1 3 1 2 1 ' },
    check: {
      optionValues: ['3 2 1 1 2 1 1', '1 2 1 3 1 2 1', '1 1 2 1 1 2 3', '1 2 3'],
      compute: () => {
        const out: number[] = [];
        const f = (n: number): void => {
          if (n === 0) return;
          f(n - 1);
          out.push(n);
          f(n - 1);
        };
        f(3);
        return out.join(' ');
      },
    },
  },
  {
    id: 'recursion-018',
    subtopic: 'recursion',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'def g(n):\n    if n <= 1:\n        return 1\n    return g(n - 1) + 2 * g(n - 2)\n\nprint(g(6))',
    },
    options: ['`21`', '`85`', '`99`', '`43`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Two base cases: `g(0)` = 1 and `g(1)` = 1 (both have $n \\le 1$). Then each value is the previous value plus **twice** the one before that.\n\n' +
        '| $n$ | Working | `g(n)` |\n' +
        '| --- | --- | --- |\n' +
        '| 0 | base case | 1 |\n' +
        '| 1 | base case | 1 |\n' +
        '| 2 | $1 + 2 \\times 1$ | 3 |\n' +
        '| 3 | $3 + 2 \\times 1$ | 5 |\n' +
        '| 4 | $5 + 2 \\times 3$ | 11 |\n' +
        '| 5 | $11 + 2 \\times 5$ | 21 |\n' +
        '| 6 | $21 + 2 \\times 11$ | 43 |\n\n' +
        'Output: `43`.\n\n' +
        'Tip: building the table bottom-up is much faster than drawing the full call tree, which would have dozens of calls.',
      whyWrong: [
        'This is `g(5)`: you stopped one row too early in the table.',
        'This is `g(7)` = $43 + 2 \\times 21 = 85$: one row too many in the table.',
        'This doubles the wrong term, using `2 * g(n - 1) + g(n - 2)`, which gives 1, 1, 3, 7, 17, 41, 99. The code doubles `g(n - 2)`.',
        null,
      ],
      keyIdea: 'For a recursive function with two calls, tabulate values from the base cases upwards instead of expanding the call tree.',
    },
    python: { stdout: '43\n' },
    check: {
      optionValues: [21, 85, 99, 43],
      compute: () => {
        const g = (n: number): number => (n <= 1 ? 1 : g(n - 1) + 2 * g(n - 2));
        return g(6);
      },
    },
  },
  {
    id: 'recursion-019',
    subtopic: 'recursion',
    difficulty: 'challenge',
    stem:
      'The function below computes $b^e$ using the idea $b^{e} = \\left(b^{e/2}\\right)^{2}$ (with one extra factor of $b$ when $e$ is odd). The main program calls `power(2, 10)` once. Counting that first call, how many calls to `power` are made in total?',
    code: {
      lang: 'python',
      source:
        'def power(b, e):\n    if e == 0:\n        return 1\n    half = power(b, e // 2)\n    if e % 2 == 0:\n        return half * half\n    return b * half * half',
    },
    options: ['$11$', '$10$', '$5$', '$4$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Each call makes **one** recursive call, with the exponent halved (rounded down by `//`):\n\n' +
        '| Call | `e // 2` | next call |\n' +
        '| --- | --- | --- |\n' +
        '| `power(2, 10)` | 5 | `power(2, 5)` |\n' +
        '| `power(2, 5)` | 2 | `power(2, 2)` |\n' +
        '| `power(2, 2)` | 1 | `power(2, 1)` |\n' +
        '| `power(2, 1)` | 0 | `power(2, 0)` |\n' +
        '| `power(2, 0)` | - | base case, returns 1 |\n\n' +
        'That is $5$ calls in total (exponents 10, 5, 2, 1, 0).\n\n' +
        'Coming back up: $1 \\to 2 \\times 1 \\times 1 = 2 \\to 2 \\times 2 = 4 \\to 2 \\times 4 \\times 4 = 32 \\to 32 \\times 32 = 1024 = 2^{10}$, so the function is correct, and it needs far fewer calls than multiplying by 2 ten times.',
      whyWrong: [
        'This is the number of calls for the simple version `b * power(b, e - 1)`, which goes 10, 9, ..., 1, 0. This version **halves** the exponent each time.',
        'This counts one call per multiplication of the simple version (exponents 10 down to 1). This function halves the exponent instead, so it needs far fewer calls.',
        null,
        'This forgets the base-case call `power(2, 0)`. When $e = 1$, `1 // 2` = 0, so one more call is made before the recursion stops.',
      ],
      keyIdea: 'Halving the input at each call means the number of calls grows like the logarithm of the input, not like the input itself.',
    },
    check: {
      optionValues: [11, 10, 5, 4],
      compute: () => {
        const { t, enter, leave } = tracker();
        const power = (b: number, e: number): number => {
          enter();
          let r: number;
          if (e === 0) r = 1;
          else {
            const half = power(b, Math.floor(e / 2));
            r = e % 2 === 0 ? half * half : b * half * half;
          }
          leave();
          return r;
        };
        if (power(2, 10) !== 1024) throw new Error('power is wrong');
        return t.calls;
      },
    },
  },
  {
    id: 'recursion-020',
    subtopic: 'recursion',
    difficulty: 'challenge',
    stem:
      'In the Towers of Hanoi puzzle, moving $n$ discs means: move $n - 1$ discs out of the way, move the biggest disc, then move the $n - 1$ discs back on top. The function counts the moves. What does the code print?',
    code: {
      lang: 'python',
      source: 'def hanoi(n):\n    if n == 0:\n        return 0\n    return hanoi(n - 1) + 1 + hanoi(n - 1)\n\nprint(hanoi(5))',
    },
    options: ['`31`', '`32`', '`15`', '`5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Let $M(n)$ be the value returned. From the code, $M(0) = 0$ and $M(n) = 2M(n-1) + 1$.\n\n' +
        '| $n$ | Working | $M(n)$ |\n' +
        '| --- | --- | --- |\n' +
        '| 0 | base case | 0 |\n' +
        '| 1 | $2 \\times 0 + 1$ | 1 |\n' +
        '| 2 | $2 \\times 1 + 1$ | 3 |\n' +
        '| 3 | $2 \\times 3 + 1$ | 7 |\n' +
        '| 4 | $2 \\times 7 + 1$ | 15 |\n' +
        '| 5 | $2 \\times 15 + 1$ | 31 |\n\n' +
        'The pattern is $M(n) = 2^n - 1$, and $2^5 - 1 = 31$.\n\nOutput: `31`.',
      whyWrong: [
        null,
        'This is $2^5$. The values are always one less than a power of 2 ($M(n) = 2^n - 1$), because the base case returns 0, not 1.',
        'This is $M(4)$: one level short. The outer call doubles it and adds 1 more: $2 \\times 15 + 1 = 31$.',
        'This counts the `+ 1` only once per level, as if `hanoi(n - 1)` were called once. It is called **twice** in each call, so the count doubles at every level.',
      ],
      keyIdea: 'Two recursive calls on $n - 1$ double the work at each level, giving $M(n) = 2M(n-1) + 1 = 2^n - 1$.',
    },
    python: { stdout: '31\n' },
    check: {
      optionValues: [31, 32, 15, 5],
      compute: () => {
        const hanoi = (n: number): number => (n === 0 ? 0 : hanoi(n - 1) + 1 + hanoi(n - 1));
        return hanoi(5);
      },
    },
  },
];
