import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

const ORDER = 'Printed values are shown in order, separated by a space.';
const NEVER = 'The function never stops';

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

/** Runs a re-implemented function, mapping a call chain past the depth cap to the "never stops" answer. */
function capped(run: (deeper: (depth: number) => number) => number): number | string {
  try {
    return run((depth) => {
      if (depth > 1000) throw new RangeError('depth cap');
      return depth + 1;
    });
  } catch (e) {
    if (e instanceof RangeError) return NEVER;
    throw e;
  }
}

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'recursion-001',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What is the job of the **base case** in a recursive function?',
    options: ['It calls the function on a smaller input', 'It is the first call from the main program', 'It answers the simplest input directly, so the calls stop', 'It only makes the function faster'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A recursive function has two parts:\n\n' +
        '- the **base case**: a simple input (such as $n = 0$) where the answer is returned **directly**, with no further recursive call;\n' +
        '- the **recursive case**: the function calls itself on a **smaller** input and uses that result.\n\n' +
        'Each recursive call moves the input closer to the base case. When the base case is reached, the calls stop and the answers are passed back up. Without a base case the calls never stop.',
      whyWrong: [
        'This describes the **recursive case**, not the base case. The recursive case is the part that calls the function again.',
        'The first call from the main program is just the initial call. It can be any input; it is not the base case.',
        null,
        'The base case is essential, not an optional speed-up. Without it the function keeps calling itself and never gives an answer.',
      ],
      keyIdea: 'The base case is the stopping condition: it answers the simplest input directly, without another recursive call.',
    },
  },
  {
    id: 'recursion-002',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('function fact(n)', '   if n == 0', '      return 1', '   end if', '   return n * fact(n - 1)', 'end function', '', 'print(fact(5))'),
    },
    options: ['24', '120', '720', '15'],
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
        'Output: 120.',
      whyWrong: [
        'This is $4! = 24$, the value of `fact(4)`. You stopped one level too early: the outer call still multiplies by 5.',
        null,
        'This is $6! = 720$. You did one multiplication too many; the first call is `fact(5)`, not `fact(6)`.',
        'This is $5 + 4 + 3 + 2 + 1 = 15$. The function **multiplies** by `n` at each level (`n * fact(n - 1)`), it does not add.',
      ],
      keyIdea: '`fact(n)` returns `n * fact(n - 1)` with base case `fact(0)` = 1, which unwinds to $n! = n \\times (n-1) \\times \\dots \\times 1$.',
    },
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
    stem: `What does this pseudocode print? ${ORDER}`,
    code: {
      lang: 'pseudocode',
      source: L('function countdown(n)', '   if n == 0', '      print("Go!")', '   else', '      print(n)', '      countdown(n - 1)', '   end if', 'end function', '', 'countdown(3)'),
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
        'Output: `3 2 1 Go!`.',
      whyWrong: [
        'This reverses the numbers. That would happen only if `print(n)` came **after** the recursive call. Here it comes before, so 3 is printed first.',
        'The base case is reached **last**, not first. `Go!` is printed only when `n` has counted down to 0.',
        'When `n` is 0 the function takes the base-case branch and prints `Go!` instead of the number, so 0 is never printed.',
        null,
      ],
      keyIdea: 'Code before the recursive call runs on the way down, so the numbers appear in the order the calls are made.',
    },
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
    stem: 'What happens when this pseudocode runs?',
    code: {
      lang: 'pseudocode',
      source: L('function total(n)', '   return n + total(n - 1)', 'end function', '', 'print(total(3))'),
    },
    options: ['It prints 6', 'It prints 3', NEVER, 'It prints 0'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Look for a **base case**: is there any input for which `total` returns without calling itself again?\n\n' +
        'There is **no base case**: every call to `total` immediately calls `total` again with a smaller number.\n\n' +
        '- `total(3)` calls `total(2)`\n' +
        '- `total(2)` calls `total(1)`\n' +
        '- `total(1)` calls `total(0)`\n' +
        '- `total(0)` calls `total(-1)`, then `total(-2)`, and so on\n\n' +
        'Nothing ever returns, so no addition is ever finished and nothing is printed. The function never stops.',
      whyWrong: [
        'This is $3 + 2 + 1$, which you would get **if** the function had a base case such as returning 0 when `n == 0`. Without it, the calls go past 0 into negative numbers.',
        'This treats `total(3)` as if it just returned `n`. But `return n + total(n - 1)` must first get the value of `total(2)`, and so on without end.',
        null,
        'This assumes the calls stop by themselves at 0. Nothing in the code tests for 0, so `total(0)` calls `total(-1)`.',
      ],
      keyIdea: 'A recursive function with no base case keeps calling itself and never returns.',
    },
    check: {
      optionValues: ['6', '3', NEVER, '0'],
      compute: () =>
        capped((deeper) => {
          const total = (n: number, depth: number): number => n + total(n - 1, deeper(depth));
          return total(3, 0);
        }),
    },
  },
  {
    id: 'recursion-006',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('function power(b, e)', '   if e == 0', '      return 1', '   end if', '   return b * power(b, e - 1)', 'end function', '', 'print(power(3, 4))'),
    },
    options: ['81', '27', '243', '12'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each call multiplies by `b = 3` and lowers the exponent by 1, until `e == 0` returns 1.\n\n' +
        '- `power(3, 0)` = 1 (base case)\n' +
        '- `power(3, 1)` = 3 times 1 = 3\n' +
        '- `power(3, 2)` = 3 times 3 = 9\n' +
        '- `power(3, 3)` = 3 times 9 = 27\n' +
        '- `power(3, 4)` = 3 times 27 = 81\n\n' +
        'This is $3^4 = 81$. Output: 81.',
      whyWrong: [
        null,
        'This is $3^3$: you stopped one level early. The calls with $e = 4, 3, 2, 1$ each multiply by 3, which is four multiplications.',
        'This is $3^5$: one multiplication too many. The base case `power(3, 0)` returns 1, it does not multiply by 3 again.',
        'This multiplies the two inputs, $3 \\times 4$. The recursion multiplies by 3 **four times**, which is $3^4$, not $3 \\times 4$.',
      ],
      keyIdea: '`power(b, e)` returns `b * power(b, e - 1)` with base case `power(b, 0)` = 1, so it computes $b^e$ by multiplying by $b$ exactly $e$ times.',
    },
    check: {
      optionValues: [81, 27, 243, 12],
      compute: () => {
        const power = (b: number, e: number): number => (e === 0 ? 1 : b * power(b, e - 1));
        return power(3, 4);
      },
    },
  },
  {
    id: 'recursion-021',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What is a function that calls itself called?',
    options: ['Recursive', 'Iterative', 'Anonymous', 'Constant'],
    correctIndex: 0,
    markScheme: {
      solution: 'A function that calls itself is **recursive**. It solves a problem by solving a smaller copy of the same problem.',
      whyWrong: [
        null,
        'Iterative code repeats work with a loop, not by the function calling itself.',
        'An anonymous function is one with no name. That has nothing to do with calling itself.',
        'A constant function always gives the same value, whatever its input.',
      ],
      keyIdea: 'Recursive means the function calls itself.',
    },
  },
  {
    id: 'recursion-022',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'Which part of a recursive function calls the function again?',
    options: ['The base case', 'The recursive case', 'The parameter list', 'The return value'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The **recursive case** calls the function again on a smaller input and uses the result. The **base case** is the part that does not call it again.',
      whyWrong: [
        'The base case is the opposite: it answers directly and makes no further call.',
        null,
        'The parameter list only names the inputs. It does not call anything.',
        'A return value is what a call hands back. The call itself is made in the recursive case.',
      ],
      keyIdea: 'The recursive case makes the further call; the base case stops the calls.',
    },
  },
  {
    id: 'recursion-023',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'What happens if a recursive function has no base case?',
    options: ['It never stops calling itself', 'It returns 0', 'It runs exactly once', 'It returns its argument'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The base case is what stops the calls. Without one, each call makes another call, none of them ever returns, and the function never finishes.',
      whyWrong: [
        null,
        'No value is invented: a call can only return once the call it is waiting for has returned, and that never happens.',
        'The recursive case runs on every call, so each call starts another one.',
        'Returning the argument would need a line that does so without another call. That line would be a base case.',
      ],
      keyIdea: 'No base case means the calls never stop.',
    },
  },
  {
    id: 'recursion-024',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'Which data structure keeps track of function calls that have not yet returned?',
    options: ['A stack', 'A queue', 'A hash table', 'A tree'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Calls are kept on the **call stack**. The most recent call is on top and must finish first, which is the last in, first out rule of a stack.',
      whyWrong: [
        null,
        'A queue is first in, first out, so the earliest call would finish first. In recursion the latest call finishes first.',
        'A hash table finds items by key. Calls need to be undone in order, which needs a stack.',
        'A diagram of the calls can look like a tree, but the running program stores only the unfinished calls, on a stack.',
      ],
      keyIdea: 'Unfinished calls wait on the call stack, last in, first out.',
    },
  },
  {
    id: 'recursion-025',
    subtopic: 'recursion',
    difficulty: 'foundation',
    stem: 'For the rule $n! = n \\times (n-1)!$, what is the usual base case?',
    options: ['$0! = 1$', '$0! = 0$', '$1! = 0$', '$n! = n$'],
    correctIndex: 0,
    markScheme: {
      solution: 'The rule needs one value that is simply given, and that is $0! = 1$. Then $1! = 1 \\times 0! = 1$, $2! = 2 \\times 1! = 2$, and so on.',
      whyWrong: [
        null,
        'If $0!$ were 0, every factorial built on it would be 0, because each step multiplies.',
        'If $1!$ were 0, every larger factorial would be 0 as well. In fact $1! = 1$.',
        'This is not a stopping value. It is false for most $n$, for example $3! = 6$.',
      ],
      keyIdea: 'Factorial stops at $0! = 1$.',
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'recursion-005',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'The Fibonacci numbers are defined by $F(0) = 0$, $F(1) = 1$ and $F(n) = F(n-1) + F(n-2)$ for $n \\ge 2$. What is $F(5)$?',
    options: ['$3$', '$8$', '$5$', '$7$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Build up from the two base cases, adding the previous two values each time:\n\n' +
        '| $n$ | 0 | 1 | 2 | 3 | 4 | 5 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $F(n)$ | 0 | 1 | 1 | 2 | 3 | 5 |\n\n' +
        'For example $F(4) = F(3) + F(2) = 2 + 1 = 3$ and $F(5) = F(4) + F(3) = 3 + 2 = 5$.\n\n' +
        'So $F(5) = 5$.',
      whyWrong: [
        'This is $F(4)$. You were off by one: the list starts at $F(0)$.',
        'This is what you get if you start with $F(0) = 1$ instead of $F(0) = 0$ (the sequence 1, 1, 2, 3, 5, 8). Always use the base cases you are given.',
        null,
        'This adds the **inputs** $4 + 3$ instead of the **values** $F(4) + F(3)$. The rule adds the previous two Fibonacci numbers.',
      ],
      keyIdea: 'Evaluate a recursive sequence bottom-up from its base cases, keeping careful track of the index.',
    },
    check: {
      optionValues: [3, 8, 5, 7],
      compute: () => {
        const F = (n: number): number => (n <= 1 ? n : F(n - 1) + F(n - 2));
        return F(5);
      },
    },
  },
  {
    id: 'recursion-007',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function digitSum(n)',
        '   if n < 10',
        '      return n',
        '   end if',
        '   return mod(n,10) + digitSum(div(n,10)) // mod is the modulus operator, div is integer division',
        'end function',
        '',
        'print(digitSum(5083))',
      ),
    },
    options: ['11', '3', '511', '16'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`mod(n,10)` is the **last digit** and `div(n,10)` **removes** the last digit.\n\n' +
        '| Call | `n < 10`? | `mod(n,10)` | next call |\n' +
        '| --- | --- | --- | --- |\n' +
        '| `digitSum(5083)` | no | 3 | `digitSum(508)` |\n' +
        '| `digitSum(508)` | no | 8 | `digitSum(50)` |\n' +
        '| `digitSum(50)` | no | 0 | `digitSum(5)` |\n' +
        '| `digitSum(5)` | yes | returns 5 | (base case) |\n\n' +
        'Adding on the way back up: 3 + 8 + 0 + 5 = 16.\n\nOutput: 16.',
      whyWrong: [
        'This is 3 + 8 + 0 = 11: it leaves out the first digit 5. The base case returns `n` itself (5), not 0, so the 5 is included.',
        'This is only the last digit, `mod(5083,10)`. The function keeps going: it adds the digit sum of 508 as well.',
        'This swaps `mod` and `div`, as if the code were `div(n,10) + digitSum(mod(n,10))`: that gives $508 + 3 = 511$. Here `mod` gives the last digit and `div` gives the rest of the number.',
        null,
      ],
      keyIdea: '`mod(n,10)` peels off the last digit and `div(n,10)` shrinks the number, until a single digit (the base case) is left.',
    },
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
    stem: `What does this pseudocode print? ${ORDER}`,
    code: {
      lang: 'pseudocode',
      source: L('function show(n)', '   if n > 0', '      show(n - 1)', '      print(n)', '   end if', 'end function', '', 'show(3)'),
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
    stem: '`fact(6)` runs. What is the largest number of `fact` calls on the call stack at one moment, counting the first call and the base-case call?',
    code: {
      lang: 'pseudocode',
      source: L('function fact(n)', '   if n == 1', '      return 1', '   end if', '   return n * fact(n - 1)', 'end function'),
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
    stem: 'With `t` starting at 0 and loop body `t = t + i`, which loop header gives the same result as `sumTo(n)` for every whole number $n \\ge 0$?',
    code: {
      lang: 'pseudocode',
      source: L('function sumTo(n)', '   if n == 0', '      return 0', '   end if', '   return n + sumTo(n - 1)', 'end function'),
    },
    options: ['`for i = 1 to n - 1`', '`for i = 2 to n`', '`for i = 0 to n - 1`', '`for i = 1 to n`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'First work out what the recursion computes. `sumTo(n)` = `n + sumTo(n - 1)`, down to `sumTo(0) = 0`, so\n\n' +
        '$$\\text{sumTo}(n) = n + (n-1) + \\dots + 2 + 1$$\n\n' +
        'For example `sumTo(3)` is 3 + 2 + 1 = 6.\n\n' +
        'The loop must add every whole number from 1 up to **and including** `n`. Test each header with $n = 3$:\n\n' +
        '- `for i = 1 to n` adds 1, 2, 3, total 6. Correct. For $n = 0$ the loop never runs and $t$ stays 0, also correct.\n' +
        '- `for i = 1 to n - 1` adds 1, 2, total 3.\n' +
        '- `for i = 2 to n` adds 2, 3, total 5.\n' +
        '- `for i = 0 to n - 1` adds 0, 1, 2, total 3.',
      whyWrong: [
        'This stops before adding `n` itself: for $n = 3$ it gives 1 + 2 = 3 instead of 6.',
        'This leaves out 1: for $n = 3$ it gives 2 + 3 = 5 instead of 6.',
        'This counts from 0 and so stops one too early: for $n = 3$ it gives 0 + 1 + 2 = 3 instead of 6.',
        null,
      ],
      keyIdea: 'A recursive function can be rewritten as a loop: find what it computes, then test the loop on a small input.',
    },
    check: {
      // the value of each loop header at n = 5
      optionValues: [1 + 2 + 3 + 4, 2 + 3 + 4 + 5, 0 + 1 + 2 + 3 + 4, 1 + 2 + 3 + 4 + 5],
      compute: () => {
        const sumTo = (n: number): number => (n === 0 ? 0 : n + sumTo(n - 1));
        return sumTo(5);
      },
    },
  },
  {
    id: 'recursion-012',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'For positive whole numbers $a$ and $b$, what does `mystery(a, b)` return?',
    code: {
      lang: 'pseudocode',
      source: L('function mystery(a, b)', '   if b == 0', '      return 0', '   end if', '   return a + mystery(a, b - 1)', 'end function'),
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
        'So `mystery(6, 4)` is 24. The value $a$ is added once for each of $b = 4, 3, 2, 1$, which is $b$ times.\n\n' +
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
    stem: 'Which statement about **recursion** and **iteration** (loops) is true?',
    options: ['Recursion is always faster than a loop', 'Each unfinished recursive call uses stack memory', 'Some problems can only be solved by recursion', 'A recursive function must contain a loop'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Check each statement:\n\n' +
        '- **Memory:** every call that is still waiting (for example `fact(6)` waiting for `fact(5)`) keeps a frame on the call stack holding its own variables, so memory grows with the depth. A simple loop just updates the same few variables. TRUE.\n' +
        '- **Speed:** recursion is usually a little **slower** than a loop because each call has overhead, and naive recursion (like the two-call Fibonacci) can repeat work massively. FALSE.\n' +
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
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('function F(n)', '   if n == 1', '      return 2', '   else', '      return 3 * F(n - 1) - 1', '   end if', 'end function', '', 'print(F(4))'),
    },
    options: ['14', '41', '122', '54'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Start from the base case and work upwards. Each step: multiply the previous value by 3, then subtract 1.\n\n' +
        '- $F(1) = 2$ (base case)\n' +
        '- $F(2) = 3 \\times 2 - 1 = 5$\n' +
        '- $F(3) = 3 \\times 5 - 1 = 14$\n' +
        '- $F(4) = 3 \\times 14 - 1 = 41$\n\n' +
        'Output: 41.',
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
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('function f(n)', '   if n == 0', '      return 0', '   end if', '   return n + f(n - 2)', 'end function', '', 'print(f(5))'),
    },
    options: ['9', '15', NEVER, '8'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The base case is `n == 0`, but each call subtracts **2**. Starting from an odd number:\n\n' +
        '$$5 \\to 3 \\to 1 \\to -1 \\to -3 \\to -5 \\to \\dots$$\n\n' +
        '`n` jumps from 1 straight to $-1$, so it **skips over 0** and the base case is never reached. The calls keep piling up on the call stack, nothing returns and nothing is printed.\n\n' +
        '(With an even input such as `f(4)` it would work: 4 + 2 = 6.)',
      whyWrong: [
        'This is $5 + 3 + 1$, assuming the recursion stops at 1. But the base case is `n == 0`, and 1 is not 0, so the function calls `f(-1)` next.',
        'This is $5 + 4 + 3 + 2 + 1$, which treats the step as `n - 1`. The code subtracts 2 each time.',
        null,
        'This is $5 + 3$, stopping before 1 is added. The function only stops when `n` is exactly 0, which never happens.',
      ],
      keyIdea: 'Every recursive call must move towards the base case; a step that can jump over it means the function never stops.',
    },
    check: {
      optionValues: [9, 15, NEVER, 8],
      compute: () =>
        capped((deeper) => {
          const f = (n: number, depth: number): number => (n === 0 ? 0 : n + f(n - 2, deeper(depth)));
          return f(5, 0);
        }),
    },
  },
  {
    id: 'recursion-026',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'How many times is `f` called in total when this pseudocode runs, including the first call?',
    code: {
      lang: 'pseudocode',
      source: L('function f(n)', '   if n == 0', '      return 1', '   end if', '   return n * f(n - 1)', 'end function', '', 'print(f(4))'),
    },
    options: ['5', '4', '24', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each call makes one further call, with an input one smaller, until the base case.\n\n' +
        'The calls are `f(4)`, `f(3)`, `f(2)`, `f(1)` and `f(0)`, which is 5 calls. In general this pattern makes $n + 1$ calls.',
      whyWrong: [
        null,
        'This forgets the base-case call `f(0)`. It makes no further call, but it is still a call.',
        'This is the value printed, $4! = 24$, not the number of calls.',
        'The input goes down by 1 each time, so it reaches the base case 0 and the calls stop.',
      ],
      keyIdea: 'Count the inputs from the first call down to the base case, including both.',
    },
    check: {
      optionValues: [5, 4, 24, 'Infinite loop'],
      compute: () => {
        const { t, enter, leave } = tracker();
        const f = (n: number): number => {
          enter();
          const r = n === 0 ? 1 : n * f(n - 1);
          leave();
          return r;
        };
        f(4);
        return t.calls;
      },
    },
  },
  {
    id: 'recursion-027',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('function g(n)', '   if n <= 1', '      return 1', '   end if', '   return g(n - 1) + g(n - 2)', 'end function', '', 'print(g(4))'),
    },
    options: ['5', '3', '8', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Build a table upwards from the base cases instead of drawing every call.\n\n' +
        '| n | g(n) | working |\n' +
        '|---|---|---|\n' +
        '| 0 | 1 | base case |\n' +
        '| 1 | 1 | base case |\n' +
        '| 2 | 2 | 1 + 1 |\n' +
        '| 3 | 3 | 2 + 1 |\n' +
        '| 4 | 5 | 3 + 2 |\n\n' +
        'Output: 5.',
      whyWrong: [
        null,
        'This is `g(3)`: one row too few in the table.',
        'This is `g(5)`: one row too many in the table.',
        'This assumes `n - 2` can jump over the base case. The test `n <= 1` catches both 1 and 0, so every chain of calls stops.',
      ],
      keyIdea: 'With two recursive calls, tabulate upwards from the base cases.',
    },
    check: {
      optionValues: [5, 3, 8, 'Infinite loop'],
      compute: () => {
        const g = (n: number): number => (n <= 1 ? 1 : g(n - 1) + g(n - 2));
        return g(4);
      },
    },
  },
  {
    id: 'recursion-028',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('function f(n)', '   if n <= 0', '      return 0', '   end if', '   return n + f(n - 2)', 'end function', '', 'print(f(5))'),
    },
    options: ['9', '15', '8', NEVER],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each call subtracts 2, and the base case is `n <= 0`.\n\n' +
        '$$5 \\to 3 \\to 1 \\to -1$$\n\n' +
        'At $n = -1$ the test `n <= 0` is true, so `f(-1)` returns 0. Adding on the way back up: 1 + 0 = 1, then 3 + 1 = 4, then 5 + 4 = 9.\n\n' +
        'Output: 9.',
      whyWrong: [
        null,
        'This is $5 + 4 + 3 + 2 + 1$, reading the step as 1. The code subtracts 2.',
        'This is $5 + 3$, leaving out the 1. The value 1 is not caught by the base case, so it is added too.',
        'This would be true for a test of `n == 0`, which the odd numbers jump over. The test here is `n <= 0`, which $-1$ satisfies.',
      ],
      keyIdea: 'A base case written with `<=` still catches an input that steps past the boundary.',
    },
    check: {
      optionValues: [9, 15, 8, NEVER],
      compute: () =>
        capped((deeper) => {
          const f = (n: number, depth: number): number => (n <= 0 ? 0 : n + f(n - 2, deeper(depth)));
          return f(5, 0);
        }),
    },
  },
  {
    id: 'recursion-029',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: `What does this pseudocode print? ${ORDER}`,
    code: {
      lang: 'pseudocode',
      source: L('function p(n)', '   if n > 0', '      print(n)', '      p(n - 1)', '      print(n)', '   end if', 'end function', '', 'p(2)'),
    },
    options: ['`2 1 1 2`', '`2 1 2 1`', '`1 2 2 1`', '`2 1`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The first `print` runs on the way down and the second on the way back up.\n\n' +
        '1. `p(2)` prints 2, then calls `p(1)`.\n' +
        '2. `p(1)` prints 1, then calls `p(0)`.\n' +
        '3. `p(0)` does nothing and returns.\n' +
        '4. Back in `p(1)`: prints 1.\n' +
        '5. Back in `p(2)`: prints 2.\n\n' +
        'Output: `2 1 1 2`.',
      whyWrong: [
        null,
        'This finishes `p(2)` before `p(1)`. The inner call must finish first, so the second print of `p(1)` comes before the second print of `p(2)`.',
        'This reverses the whole order. The first print of `p(2)` runs before any further call, so 2 comes first.',
        'This leaves out the second `print(n)`, which runs as each call finishes.',
      ],
      keyIdea: 'Code before the call runs on the way down; code after it runs on the way back up in reverse order.',
    },
    check: {
      optionValues: ['2 1 1 2', '2 1 2 1', '1 2 2 1', '2 1'],
      compute: () => {
        const out: number[] = [];
        const p = (n: number): void => {
          if (n > 0) {
            out.push(n);
            p(n - 1);
            out.push(n);
          }
        };
        p(2);
        return out.join(' ');
      },
    },
  },
  {
    id: 'recursion-030',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function h(a, b)',
        '   if b == 0',
        '      return a',
        '   end if',
        '   return h(b, mod(a,b)) // mod is the modulus operator',
        'end function',
        '',
        'print(h(12, 18))',
      ),
    },
    options: ['6', '12', '18', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Follow the two arguments call by call.\n\n' +
        '| a | b | mod(a,b) |\n' +
        '|---|---|---|\n' +
        '| 12 | 18 | 12 |\n' +
        '| 18 | 12 | 6 |\n' +
        '| 12 | 6 | 0 |\n' +
        '| 6 | 0 | base case, returns 6 |\n\n' +
        'Output: 6. (This is the Euclidean algorithm, which finds the greatest common divisor.)',
      whyWrong: [
        null,
        'This stops one call early, at `h(12, 6)`, returning `a`. The base case needs `b` to be 0.',
        'This stops at `h(18, 12)`, returning `a`. The base case needs `b` to be 0.',
        'This sees that `mod(12,18)` is 12 and assumes the arguments never change. They swap on that call, and after that `b` keeps shrinking until it is 0.',
      ],
      keyIdea: 'Trace each call with its own arguments, in a table, until the base case.',
    },
    check: {
      optionValues: [6, 12, 18, 'Infinite loop'],
      compute: () => {
        const h = (a: number, b: number): number => (b === 0 ? a : h(b, a % b));
        return h(12, 18);
      },
    },
  },
  {
    id: 'recursion-031',
    subtopic: 'recursion',
    difficulty: 'exam',
    stem: 'Let $T(n)$ be the number of calls made when `f(n)` runs. For $n \\ge 1$, which recurrence does $T(n)$ satisfy?',
    code: {
      lang: 'pseudocode',
      source: L('function f(n)', '   if n == 0', '      return 0', '   end if', '   return 2 + f(n - 1)', 'end function'),
    },
    options: ['$T(n) = T(n-1) + 1$', '$T(n) = 2T(n-1)$', '$T(n) = T(n-1) + 2$', '$T(n) = T(n-2) + 1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **recurrence** gives a value in terms of earlier values.\n\n' +
        '1. The call `f(n)` counts as 1 call.\n' +
        '2. It makes one further call, `f(n - 1)`, which makes $T(n-1)$ calls.\n\n' +
        'So $T(n) = T(n-1) + 1$. The 2 in the code is a value being added, not a call.',
      whyWrong: [
        null,
        'This is the pattern for two recursive calls. The code calls `f` only once; the 2 is a number added to the result.',
        'This counts the 2 in `2 + f(n - 1)` as calls. It affects the value returned, not the number of calls.',
        'This reads the argument as `n - 2`. The code calls `f(n - 1)`.',
      ],
      keyIdea: 'To count calls, add 1 for this call to the count from each further call it makes.',
    },
  },
];
