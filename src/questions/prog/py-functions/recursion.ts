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
      asking: 'What does the base case do in a function that calls itself?',
      solution:
        'A **recursive function** is one that calls itself, usually with a smaller input. For example, `fact(3)` calls `fact(2)`, which calls `fact(1)`, and so on.\n\n' +
        'That chain has to end somewhere. The **base case** is the part that gives an answer straight away for the smallest input, such as `if n == 0` followed by `return 1`. It makes no further call, so the calls stop there.',
      conclusion: 'The base case gives a direct answer with no new call: It answers the simplest input directly, so the calls stop.',
      whyWrong: [
        'This describes the **recursive case**, not the base case. The recursive case is the part that calls the function again.',
        'The first call from the main program is just the initial call. It can be any input; it is not the base case.',
        null,
        'The base case is essential, not an optional speed-up. Without it the function keeps calling itself and never gives an answer.',
      ],
      keyIdea: 'To find the base case in a recursive function, look for the `if` whose branch returns without using the function\'s own name. The line that does use its own name is the recursive case.',
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
      asking: 'What number does `fact(5)` hand back for `print` to show?',
      solution:
        '`fact` calls itself, which is called **recursion**. Line 5 cannot finish until it knows `fact(n - 1)`, so each call pauses and waits for a smaller call.\n\n' +
        'Going down, `fact(5)` waits for `fact(4)`, which waits for `fact(3)`, then `fact(2)`, `fact(1)` and `fact(0)`.\n\n' +
        '`fact(0)` is the **base case**: `n == 0` on line 2 is true, so line 3 returns 1 without another call. Now the waiting calls can finish.\n\n' +
        'Coming back up, each call multiplies its own `n` by the value it receives. Line 8 prints the value in the last row:\n\n| Call | Line 5 with numbers | Returns |\n|---|---|---|\n| `fact(1)` | $1 \\times 1$ | 1 |\n| `fact(2)` | $2 \\times 1$ | 2 |\n| `fact(3)` | $3 \\times 2$ | 6 |\n| `fact(4)` | $4 \\times 6$ | 24 |\n| `fact(5)` | $5 \\times 24$ | 120 |',
      conclusion: '`fact(5)` works out $5 \\times 4 \\times 3 \\times 2 \\times 1 \\times 1$, so the answer is 120.',
      whyWrong: [
        'This is $4! = 24$, the value of `fact(4)`. You stopped one level too early: the outer call still multiplies by 5.',
        null,
        'This is $6! = 720$. You did one multiplication too many; the first call is `fact(5)`, not `fact(6)`.',
        'This is $5 + 4 + 3 + 2 + 1 = 15$. The function **multiplies** by `n` at each level (`n * fact(n - 1)`), it does not add.',
      ],
      keyIdea: 'Trace recursion in two stages. Going down, list the calls until you reach the base case. Coming back up, fill a table from the base value, where each row uses the value from the row before.',
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
      asking: 'In what order do the numbers and `Go!` appear on the screen?',
      solution:
        '`countdown` calls itself, which is called **recursion**. It returns nothing: its only effect is printing. So we just need the order of its prints.\n\n' +
        'Line 5 prints `n` **before** line 6 makes the next call. So each call prints its number first and then passes on to a smaller number.\n\n' +
        'The call with `n` equal to 0 is the **base case**: line 3 prints `Go!` and no further call is made. Reading the printed column from top to bottom gives the output:\n\n| Call | `n == 0`? | Prints | Next call |\n|---|---|---|---|\n| `countdown(3)` | no | 3 | `countdown(2)` |\n| `countdown(2)` | no | 2 | `countdown(1)` |\n| `countdown(1)` | no | 1 | `countdown(0)` |\n| `countdown(0)` | yes | Go! | none |',
      conclusion: 'Each number prints before the deeper call, and `Go!` prints at the bottom, so the answer is `3 2 1 Go!`.',
      whyWrong: [
        'This reverses the numbers. That would happen only if `print(n)` came **after** the recursive call. Here it comes before, so 3 is printed first.',
        'The base case is reached **last**, not first. `Go!` is printed only when `n` has counted down to 0.',
        'When `n` is 0 the function takes the base-case branch and prints `Go!` instead of the number, so 0 is never printed.',
        null,
      ],
      keyIdea: 'Check whether the print comes before or after the recursive call. Before: values print on the way down, starting with the first input. After: values print on the way back up, starting with the deepest call. Write one row per call.',
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
      asking: 'Does `total(3)` ever get a value to return?',
      solution:
        'Line 2 cannot return anything until it knows `total(n - 1)`. So every call must make another call first.\n\n' +
        'Follow the calls: `total(3)` needs `total(2)`, which needs `total(1)`, then `total(0)`, then `total(-1)`, then `total(-2)`, and so on.\n\n' +
        'A **base case** is a line that returns without making another call. This function has none: there is no `if`, and nothing tests for 0.\n\n' +
        'So no call ever gets the value it is waiting for, and line 5 never gets a number to print. The calls keep going down forever. On a real computer, it would eventually run out of memory.',
      conclusion: 'With no base case, each call waits on another one forever, so The function never stops.',
      whyWrong: [
        'This is $3 + 2 + 1$, which you would get **if** the function had a base case such as returning 0 when `n == 0`. Without it, the calls go past 0 into negative numbers.',
        'This treats `total(3)` as if it just returned `n`. But `return n + total(n - 1)` must first get the value of `total(2)`, and so on without end.',
        null,
        'This assumes the calls stop by themselves at 0. Nothing in the code tests for 0, so `total(0)` calls `total(-1)`.',
      ],
      keyIdea: 'Before tracing a recursive function, find its base case: a path that returns without calling itself. If there is no such path, or the input can skip past it, the calls never end.',
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
      asking: 'What number does `power(3, 4)` hand back for `print` to show?',
      solution:
        '`power` calls itself, which is called **recursion**. `b` stays 3 on every call, and `e` goes down by 1. Going down, the calls are `power(3, 4)`, `power(3, 3)`, `power(3, 2)`, `power(3, 1)` and `power(3, 0)`.\n\n' +
        '`power(3, 0)` is the **base case**: `e == 0` on line 2 is true, so line 3 returns 1 with no further call.\n\n' +
        'Coming back up, each call does line 5, multiplying 3 by the value it receives. Line 8 prints the value in the last row:\n\n| Call | Line 5 with numbers | Returns |\n|---|---|---|\n| `power(3, 1)` | $3 \\times 1$ | 3 |\n| `power(3, 2)` | $3 \\times 3$ | 9 |\n| `power(3, 3)` | $3 \\times 9$ | 27 |\n| `power(3, 4)` | $3 \\times 27$ | 81 |',
      conclusion: 'Four calls each multiply by 3, which is $3^4$, so the answer is 81.',
      whyWrong: [
        null,
        'This is $3^3$: you stopped one level early. The calls with $e = 4, 3, 2, 1$ each multiply by 3, which is four multiplications.',
        'This is $3^5$: one multiplication too many. The base case `power(3, 0)` returns 1, it does not multiply by 3 again.',
        'This multiplies the two inputs, $3 \\times 4$. The recursion multiplies by 3 **four times**, which is $3^4$, not $3 \\times 4$.',
      ],
      keyIdea: 'Trace down to the base case, then build back up in a table. Count the calls that multiply: `power(b, e)` multiplies by `b` exactly `e` times, which is $b^e$.',
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
      asking: 'What word describes a function that runs itself?',
      solution:
        'Some functions have a call to themselves in their own body. For example, a function `f(n)` might contain the line `return n * f(n - 1)`.\n\n' +
        'This idea is called **recursion**, and a function that does it is called **recursive**.',
      conclusion: 'A function that calls itself is called Recursive.',
      whyWrong: [
        null,
        'Iterative code repeats work with a loop, not by the function calling itself.',
        'An anonymous function is one with no name. That has nothing to do with calling itself.',
        'A constant function always gives the same value, whatever its input.',
      ],
      keyIdea: 'To classify a function, look inside its body. If it uses its own name, it is recursive. If it repeats work with `for` or `while` instead, it is iterative.',
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
      asking: 'Which part of a recursive function is the one that makes a new call to itself?',
      solution:
        'A recursive function (one that calls itself) has two parts. The **base case** answers straight away with no new call, for example `if n == 0` followed by `return 1`.\n\n' +
        'The other part is the **recursive case**, for example `return n * fact(n - 1)`. This is the line that calls the function again on a smaller input.',
      conclusion: 'The line containing `fact(n - 1)` is the part that calls again, so the answer is The recursive case.',
      whyWrong: [
        'The base case is the opposite: it answers directly and makes no further call.',
        null,
        'The parameter list only names the inputs. It does not call anything.',
        'A return value is what a call hands back. The call itself is made in the recursive case.',
      ],
      keyIdea: 'Split any recursive function into two parts. The lines that use the function\'s own name are the recursive case. The path that returns without using its name is the base case.',
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
      asking: 'What goes wrong when a function that calls itself has nothing to stop it?',
      solution:
        'A recursive function (one that calls itself) has a **base case**: the part that answers without making another call. It is the only thing that lets the chain of calls end.\n\n' +
        'Without one, every call starts another call. For example, `f(3)` calls `f(2)`, which calls `f(1)`, then `f(0)`, then `f(-1)`, and there is never a last call.',
      conclusion: 'With no base case, every call starts another, so It never stops calling itself.',
      whyWrong: [
        null,
        'No value is invented: a call can only return once the call it is waiting for has returned, and that never happens.',
        'The recursive case runs on every call, so each call starts another one.',
        'Returning the argument would need a line that does so without another call. That line would be a base case.',
      ],
      keyIdea: 'To test whether a recursion stops, ask two questions. Is there a path with no self-call? Does every input move closer to that path? If either answer is no, the calls never end.',
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
      asking: 'What structure does a computer use to remember function calls that have not finished?',
      solution:
        'When `fact(3)` calls `fact(2)`, `fact(3)` has not finished. It has to wait, so the computer must remember it.\n\n' +
        'The calls finish in the opposite order to how they start. `fact(3)` starts first but finishes last, and the newest call always finishes first. This order is called **last in, first out**.\n\n' +
        'A **stack** works in exactly that order. Think of a pile of plates, where you add to the top and take from the top. So waiting calls are kept on a stack, known as the **call stack**.',
      conclusion: 'The newest unfinished call finishes first, which is last in, first out, so the answer is A stack.',
      whyWrong: [
        null,
        'A queue is first in, first out, so the earliest call would finish first. In recursion the latest call finishes first.',
        'A hash table finds items by key. Calls need to be undone in order, which needs a stack.',
        'A diagram of the calls can look like a tree, but the running program stores only the unfinished calls, on a stack.',
      ],
      keyIdea: 'Match the order to the structure. Last in, first out means a stack. First in, first out means a queue. Calls waiting for a newer call to finish follow last in, first out.',
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
      asking: 'At which small value does the factorial rule stop, and what does it equal there?',
      solution:
        '$n!$ (said "$n$ factorial") means multiplying all the whole numbers from $n$ down to 1. For example, $3! = 3 \\times 2 \\times 1 = 6$.\n\n' +
        'The rule $n! = n \\times (n-1)!$ works out each factorial using a smaller one. It needs a stopping value, called the **base case**, or it would go on forever.\n\n' +
        'Test the rule at $n = 1$. It says $1! = 1 \\times 0!$. We know $1! = 1$, so $1 = 1 \\times 0!$, and $0!$ must equal 1.',
      conclusion: 'Only the value 1 keeps the rule correct, so the usual base case is $0! = 1$.',
      whyWrong: [
        null,
        'If $0!$ were 0, every factorial built on it would be 0, because each step multiplies.',
        'If $1!$ were 0, every larger factorial would be 0 as well. In fact $1! = 1$.',
        'This is not a stopping value. It is false for most $n$, for example $3! = 6$.',
      ],
      keyIdea: 'To find a base case, put the smallest $n$ into the rule and compare the result with a value you know. For products the base value is usually 1, because multiplying by 1 changes nothing. For sums it is usually 0.',
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
      asking: 'Using this rule, what is the number at position 5?',
      solution:
        'The rule says each number is the sum of the two before it. The first two are given: $F(0) = 0$ and $F(1) = 1$. These are the **base cases**, where the rule does not apply.\n\n' +
        'Build a table from the bottom instead of drawing every call. Each row adds the two values before it, and we stop at $n = 5$:\n\n| $n$ | The two values before it | $F(n)$, their sum |\n|---|---|---|\n| 0 | given | 0 |\n| 1 | given | 1 |\n| 2 | $F(1) = 1$ and $F(0) = 0$ | 1 |\n| 3 | $F(2) = 1$ and $F(1) = 1$ | 2 |\n| 4 | $F(3) = 2$ and $F(2) = 1$ | 3 |\n| 5 | $F(4) = 3$ and $F(3) = 2$ | 5 |',
      conclusion: 'Adding the two previous values, 3 and 2, gives $F(5) = 5$, so the answer is $5$.',
      whyWrong: [
        'This is $F(4)$. You were off by one: the list starts at $F(0)$.',
        'This is what you get if you start with $F(0) = 1$ instead of $F(0) = 0$ (the sequence 1, 1, 2, 3, 5, 8). Always use the base cases you are given.',
        null,
        'This adds the **inputs** $4 + 3$ instead of the **values** $F(4) + F(3)$. The rule adds the previous two Fibonacci numbers.',
      ],
      keyIdea: 'For a number rule that uses earlier values, do not draw the full call tree. List the values from the smallest $n$ upwards in a table, using the base cases you are given. Stop at the $n$ you were asked for.',
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
      asking: 'What number does `digitSum(5083)` hand back for `print` to show?',
      solution:
        '`mod(n,10)` is the remainder after dividing by 10, which is always the last digit. For example, $5083 \\div 10$ is 508 remainder 3, so `mod(5083,10)` is 3.\n\n' +
        '`div(n,10)` is the whole-number part of that division, so `div(5083,10)` is 508. It gives the number with its last digit removed.\n\n' +
        'So line 5 says: take the last digit, and add the function\'s answer for the remaining digits. Each call cuts off one digit.\n\n' +
        'Line 2 is the **base case**: a number below 10 has one digit, so line 3 returns it with no further call. Going down, the calls are:\n\n| Call | `n < 10`? | `mod(n,10)` | Next call |\n|---|---|---|---|\n| `digitSum(5083)` | no | 3 | `digitSum(508)` |\n| `digitSum(508)` | no | 8 | `digitSum(50)` |\n| `digitSum(50)` | no | 0 | `digitSum(5)` |\n| `digitSum(5)` | yes | - | returns 5 |\n\n' +
        'Coming back up, each call adds its last digit to the value it receives. Line 8 prints the value in the last row:\n\n| Call | Line 5 with numbers | Returns |\n|---|---|---|\n| `digitSum(50)` | $0 + 5$ | 5 |\n| `digitSum(508)` | $8 + 5$ | 13 |\n| `digitSum(5083)` | $3 + 13$ | 16 |',
      conclusion: 'The digits 5, 0, 8 and 3 add up to 16, so the answer is 16.',
      whyWrong: [
        'This is 3 + 8 + 0 = 11: it leaves out the first digit 5. The base case returns `n` itself (5), not 0, so the 5 is included.',
        'This is only the last digit, `mod(5083,10)`. The function keeps going: it adds the digit sum of 508 as well.',
        'This swaps `mod` and `div`, as if the code were `div(n,10) + digitSum(mod(n,10))`: that gives $508 + 3 = 511$. Here `mod` gives the last digit and `div` gives the rest of the number.',
        null,
      ],
      keyIdea: '`mod(n,10)` gives the last digit and `div(n,10)` removes it. In any digit recursion, list these two values for each call until one digit is left, then build the answer back up.',
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
      asking: 'In what order do the numbers appear on the screen?',
      solution:
        '`show` calls itself, which is called **recursion**. Line 3 makes the next call **before** line 4 prints. So each call must wait for the smaller call to finish completely before printing its own `n`.\n\n' +
        'Going down, `show(3)` pauses at line 3 and calls `show(2)`. `show(2)` pauses and calls `show(1)`. `show(1)` pauses and calls `show(0)`. Nothing has been printed yet.\n\n' +
        '`show(0)` is the **base case**: `n > 0` on line 2 is false, so the whole `if` is skipped. It prints nothing and finishes.\n\n' +
        'Coming back up, each paused call carries on at line 4, printing its own `n`. Reading from top to bottom gives the output:\n\n| Call that carries on | Line 4 prints |\n|---|---|\n| `show(1)` | 1 |\n| `show(2)` | 2 |\n| `show(3)` | 3 |',
      conclusion: 'The smallest call finishes first, so its print comes first and the answer is `1 2 3`.',
      whyWrong: [
        'This would be the output if `print(n)` came **before** `show(n - 1)`. Because the print is after the call, the smallest number is printed first.',
        null,
        '`show(0)` does not print anything: the test `n > 0` is false, so the whole body is skipped.',
        'The inner calls are not lost: each call `show(2)` and `show(1)` also reaches its own `print(n)` when it finishes, so 1 and 2 are printed too.',
      ],
      keyIdea: 'Check whether the print comes before or after the recursive call. After the call means values print on the way back up, starting with the deepest call. Before the call means they print on the way down.',
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
      asking: 'At the busiest moment, how many `fact` calls have started but not finished?',
      solution:
        'The **call stack** is the computer\'s list of calls that have started but not finished. A call leaves the stack when it returns.\n\n' +
        '`fact(6)` cannot finish until `fact(5)` returns, and so on. So each new call joins the stack while all the earlier ones are still waiting.\n\n' +
        'The stack is at its fullest when the deepest call is running. `n == 1` on line 2 is true at `fact(1)`, so line 3 returns from there and `fact(0)` is never called.\n\n' +
        'At that moment the stack holds `fact(6)`, `fact(5)`, `fact(4)`, `fact(3)`, `fact(2)` and `fact(1)`. Counting them gives 6.',
      conclusion: 'All six calls are on the stack while `fact(1)` runs, so the largest number is $6$.',
      whyWrong: [
        'This forgets to count the base-case call `fact(1)`. It is a real call too, and it sits on top of the other five.',
        'This assumes the calls go down to `fact(0)`. The base case here is `n == 1`, so `fact(1)` returns straight away and `fact(0)` is never called.',
        null,
        'This is the **value** returned, $6! = 720$, not the number of calls on the stack.',
      ],
      keyIdea: 'When each call makes one new call, the deepest stack equals the number of values `n` takes, from the first input to the base case, counting both ends. With `n` falling by 1, use first input $-$ base value $+ 1$.',
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
      asking: 'Which loop adds up the same numbers that `sumTo(n)` adds?',
      solution:
        'First find what `sumTo` adds, using $n = 3$. Line 5 says `sumTo(3)` is 3 plus `sumTo(2)`, `sumTo(2)` is 2 plus `sumTo(1)`, and `sumTo(1)` is 1 plus `sumTo(0)`. Line 3 says `sumTo(0)` is 0.\n\n' +
        'Putting those together gives $3 + 2 + 1 = 6$. So `sumTo(n)` adds every whole number from 1 up to `n`.\n\n' +
        'The loop body `t = t + i` adds each value of `i` to `t`, which starts at 0. A `for` loop includes both of its end values. Test each header with $n = 3$, looking for 6:\n\n| Header | `i` takes | `t` ends at |\n|---|---|---|\n| `for i = 1 to n - 1` | 1, 2 | 3 |\n| `for i = 2 to n` | 2, 3 | 5 |\n| `for i = 0 to n - 1` | 0, 1, 2 | 3 |\n| `for i = 1 to n` | 1, 2, 3 | 6 |',
      conclusion: 'Only `for i = 1 to n` reaches 6. It also gives 0 when $n = 0$, because a loop from 1 to 0 has no passes, the same as the base case.',
      whyWrong: [
        'This stops before adding `n` itself: for $n = 3$ it gives 1 + 2 = 3 instead of 6.',
        'This leaves out 1: for $n = 3$ it gives 2 + 3 = 5 instead of 6.',
        'This counts from 0 and so stops one too early: for $n = 3$ it gives 0 + 1 + 2 = 3 instead of 6.',
        null,
      ],
      keyIdea: 'To match recursion to a loop, run both with a small input such as $n = 3$. First write out what the recursion adds. Then list the values each loop header visits and compare the totals.',
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
      asking: 'What does this function work out from $a$ and $b$?',
      solution:
        'Try small numbers to see what happens. Take `mystery(6, 3)`. `b` is not 0, so line 5 gives 6 plus `mystery(6, 2)`.\n\n' +
        'Keep going in the same way. `mystery(6, 2)` is 6 plus `mystery(6, 1)`, and `mystery(6, 1)` is 6 plus `mystery(6, 0)`.\n\n' +
        '`mystery(6, 0)` is the **base case**: `b == 0` on line 2 is true, so line 3 returns 0 and adds nothing more.\n\n' +
        'Put it together: $6 + 6 + 6 = 18$. That is 6 added 3 times, and `a` was 6 and `b` was 3.\n\n' +
        'In general, `b` falls by 1 on each call, so `b` calls add an `a`. Adding $a$ to itself $b$ times is $a \\times b$.',
      conclusion: 'The function adds $a$ exactly $b$ times, which is multiplication, so the answer is $a \\times b$.',
      whyWrong: [
        'This adds the two inputs once. The function adds $a$ again at **every** level of recursion, $b$ times in total (for 6 and 4 it gives 24, not 10).',
        'This would need `a * mystery(a, b - 1)` with base case 1 (repeated **multiplication**). The code uses `+` and returns 0 at the base, which is repeated **addition**.',
        'This undercounts by one level: the calls with $b, b - 1, \\dots, 1$ each add one $a$, which is $b$ additions, not $b - 1$ (the base-case call adds nothing).',
        null,
      ],
      keyIdea: 'To find what a recursive function computes, run it with small numbers and write out the sum or product. A base value of 0 with `+` means repeated adding. A base value of 1 with `*` means repeated multiplying.',
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
      asking: 'Which one of these claims about recursion and loops is true?',
      solution:
        '**Recursion** repeats work by a function calling itself. **Iteration** repeats work with a `for` or `while` loop.\n\n' +
        'Take the recursive function `fact`. While `fact(2)` runs, `fact(3)` has not finished, so the computer must remember its `n` and where to carry on.\n\n' +
        'That information is kept in a memory area called the **call stack**. Each unfinished call takes up space there until it returns.',
      conclusion: 'Waiting calls hold memory until they return, so the true statement is: Each unfinished recursive call uses stack memory.',
      whyWrong: [
        'Function calls have overhead, so recursion is usually slightly slower than an equivalent loop, and naive recursion can be hugely slower because it repeats the same calls.',
        null,
        'Recursion and iteration are equally powerful: any recursive algorithm can be converted into a loop (possibly using an explicit stack), and the other way round.',
        'Recursion replaces the loop: the repetition comes from the function calling itself, so no loop is needed (look at `fact` or `power`).',
      ],
      keyIdea: 'For true-or-false claims, test each one with a small example such as `fact`. Words like always, only or must fail if you find one exception: `fact` contains no loop, so a recursive function does not need one.',
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
      asking: 'What number does `F(4)` hand back for `print` to show?',
      solution:
        '`F` calls itself, which is called **recursion**. Line 5 needs the value from the next smaller call. So going down, `F(4)` needs `F(3)`, `F(3)` needs `F(2)`, and `F(2)` needs `F(1)`.\n\n' +
        '`F(1)` is the **base case**: `n == 1` on line 2 is true, so line 3 returns 2 with no further call.\n\n' +
        'Coming back up, each call uses line 5 with the value it receives, multiplying first and then subtracting 1. Line 9 prints the value in the last row:\n\n| Call | Line 5 with numbers | Returns |\n|---|---|---|\n| `F(2)` | $3 \\times 2 - 1 = 6 - 1$ | 5 |\n| `F(3)` | $3 \\times 5 - 1 = 15 - 1$ | 14 |\n| `F(4)` | $3 \\times 14 - 1 = 42 - 1$ | 41 |',
      conclusion: 'Working up from `F(1)`, which is 2, gives 5, then 14, then 41, so the answer is 41.',
      whyWrong: [
        'This is $F(3)$: you stopped one step early. $F(4)$ needs one more step, $3 \\times 14 - 1 = 41$.',
        null,
        'This is $F(5) = 3 \\times 41 - 1$: one step too many. The base case is $F(1)$, so $F(4)$ needs only three steps after it.',
        'This forgets to subtract 1 at each step: $2 \\times 3 \\times 3 \\times 3 = 54$. The rule is $3F(n-1) - 1$.',
      ],
      keyIdea: 'With one recursive call, start at the base value and apply the rule once per level, up to the input you were given, in a table. Keep the order from the code: here, multiply and then subtract.',
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
      asking: 'Does `f(5)` ever reach the case that stops the calls?',
      solution:
        'Lines 2 and 3 are the **base case**, the only way to stop the function calling itself. They run only when `n` is **exactly** 0.\n\n' +
        'Line 5 makes each new call with `n - 2`. Follow `n` down from 5:\n\n| Call | `n == 0`? | Next call |\n|---|---|---|\n| `f(5)` | no | `f(3)` |\n| `f(3)` | no | `f(1)` |\n| `f(1)` | no | `f(-1)` |\n| `f(-1)` | no | `f(-3)` |\n\n' +
        '`n` goes from 1 straight to $-1$, jumping over 0. Taking 2 from an odd number always leaves an odd number, and 0 is even. So `n` is never 0.\n\n' +
        'So line 3 never runs and the calls go on forever. Each call is waiting for the next one, so nothing ever returns and line 8 never prints.',
      conclusion: '`n` jumps over 0, so the base case is never reached. The function never stops.',
      whyWrong: [
        'This is $5 + 3 + 1$, assuming the recursion stops at 1. But the base case is `n == 0`, and 1 is not 0, so the function calls `f(-1)` next.',
        'This is $5 + 4 + 3 + 2 + 1$, which treats the step as `n - 1`. The code subtracts 2 each time.',
        null,
        'This is $5 + 3$, stopping before 1 is added. The function only stops when `n` is exactly 0, which never happens.',
      ],
      keyIdea: 'Write out the values `n` takes and check that they land exactly on the base case. Taking 2 from an odd number always misses `n == 0`. A test like `n <= 0` would catch it.',
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
      asking: 'How many separate calls to `f` happen in total?',
      solution:
        'We are counting calls here, not working out the value that gets printed. Line 8 makes the first call, `f(4)`.\n\n' +
        'Line 5 makes exactly one new call each time, with `n` one smaller. `f(0)` makes none, because `n == 0` on line 2 is true and line 3 returns straight away. It still counts as a call.\n\n' +
        'List them: `f(4)`, `f(3)`, `f(2)`, `f(1)`, `f(0)`. Counting them gives 5.',
      conclusion: '`n` runs from 4 down to 0, with one call for each value, so the total is 5.',
      whyWrong: [
        null,
        'This forgets the base-case call `f(0)`. It makes no further call, but it is still a call.',
        'This is the value printed, $4! = 24$, not the number of calls.',
        'The input goes down by 1 each time, so it reaches the base case 0 and the calls stop.',
      ],
      keyIdea: 'When each call makes one new call, the total number of calls is the number of values `n` takes, counting the first call and the base case. Do not confuse this with the value returned.',
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
      asking: 'What number does `g(4)` hand back for `print` to show?',
      solution:
        'Lines 2 and 3 say `g(n)` is 1 whenever `n` is 1 or less. So `g(1)` is 1 and `g(0)` is 1. These are the **base cases**: they return with no further call.\n\n' +
        'For larger `n`, line 5 adds the two previous values. Each call makes two more calls, so drawing them all takes a long time. A table built upwards is quicker, because each row only needs the two rows before it.\n\n' +
        'Fill in the table. Line 8 prints the value in the last row:\n\n| `n` | Line 5 with numbers | `g(n)` |\n|---|---|---|\n| 0 | base case | 1 |\n| 1 | base case | 1 |\n| 2 | $g(1) + g(0) = 1 + 1$ | 2 |\n| 3 | $g(2) + g(1) = 2 + 1$ | 3 |\n| 4 | $g(3) + g(2) = 3 + 2$ | 5 |',
      conclusion: '`g(4)` adds `g(3)` and `g(2)`, which is $3 + 2$, so line 8 prints 5.',
      whyWrong: [
        null,
        'This is `g(3)`: one row too few in the table.',
        'This is `g(5)`: one row too many in the table.',
        'This assumes `n - 2` can jump over the base case. The test `n <= 1` catches both 1 and 0, so every chain of calls stops.',
      ],
      keyIdea: 'When a function makes two calls, on `n - 1` and `n - 2`, skip the call tree. Write the base values, then fill rows upwards, each one adding the previous two.',
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
      asking: 'What number does `f(5)` hand back for `print` to show?',
      solution:
        '`f` calls itself, which is called **recursion**. Lines 2 and 3 are the **base case**. `n <= 0` is true for 0 and for any negative number, so the calls stop as soon as `n` reaches 0 or goes below it.\n\n' +
        'Going down with `n - 2`, `f(5)` calls `f(3)`, `f(3)` calls `f(1)`, and `f(1)` calls `f(-1)`. For `f(-1)`, $-1 \\le 0$ is true, so line 3 returns 0.\n\n' +
        'Coming back up, each call adds its own `n` to the value it receives. Line 8 prints the value in the last row:\n\n| Call | Line 5 with numbers | Returns |\n|---|---|---|\n| `f(1)` | `1 + 0` | 1 |\n| `f(3)` | `3 + 1` | 4 |\n| `f(5)` | `5 + 4` | 9 |',
      conclusion: 'The calls add 5, 3 and 1, then stop at $-1$, so the answer is 9.',
      whyWrong: [
        null,
        'This is $5 + 4 + 3 + 2 + 1$, reading the step as 1. The code subtracts 2.',
        'This is $5 + 3$, leaving out the 1. The value 1 is not caught by the base case, so it is added too.',
        'This would be true for a test of `n == 0`, which the odd numbers jump over. The test here is `n <= 0`, which $-1$ satisfies.',
      ],
      keyIdea: 'Check the base-case test. `n <= 0` catches a value that jumps past 0, but `n == 0` does not. Write out the values `n` takes until the test is true, then add them on the way back up.',
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
      asking: 'In what order do the values appear on the screen?',
      solution:
        '`p` calls itself, which is called **recursion**. A call with `n > 0` does three things in order: print `n` (line 3), make the smaller call (line 4), then print `n` again (line 5).\n\n' +
        'Line 5 cannot run until the smaller call on line 4 has completely finished.\n\n' +
        '`p(0)` is the **base case**: `n > 0` on line 2 is false, so it does nothing. Here is each line that runs, in order. Reading the last column from top to bottom gives the output:\n\n| Call | Line | What happens | Prints |\n|---|---|---|---|\n| `p(2)` | 3 | prints `n` | 2 |\n| `p(2)` | 4 | calls `p(1)` | - |\n| `p(1)` | 3 | prints `n` | 1 |\n| `p(1)` | 4 | calls `p(0)`, which does nothing | - |\n| `p(1)` | 5 | prints `n` | 1 |\n| `p(2)` | 5 | prints `n` | 2 |',
      conclusion: 'The prints in order are 2, 1, 1, 2, so the answer is `2 1 1 2`.',
      whyWrong: [
        null,
        'This finishes `p(2)` before `p(1)`. The inner call must finish first, so the second print of `p(1)` comes before the second print of `p(2)`.',
        'This reverses the whole order. The first print of `p(2)` runs before any further call, so 2 comes first.',
        'This leaves out the second `print(n)`, which runs as each call finishes.',
      ],
      keyIdea: 'When a print comes both before and after a recursive call, the output is a mirror: values going down, then the same values coming back up. Trace one row per line that runs, finishing each inner call first.',
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
      asking: 'What number does `h(12, 18)` hand back for `print` to show?',
      solution:
        '`mod(a,b)` is the remainder when `a` is divided by `b`. For example, $18 \\div 12$ is 1 remainder 6, so `mod(18,12)` is 6. If `a` is smaller, the remainder is `a`: $12 \\div 18$ is 0 remainder 12.\n\n' +
        'Line 5 makes a new call in which the old `b` becomes the new `a`, and the remainder becomes the new `b`.\n\n' +
        'Line 2 is the **base case**: when `b` is 0, line 3 returns `a`. Line 5 does no sums with the result, so each waiting call passes the same value straight back. That value is what line 8 prints:\n\n| Call | `b == 0`? | `mod(a,b)` | Next call |\n|---|---|---|---|\n| `h(12, 18)` | no | 12 | `h(18, 12)` |\n| `h(18, 12)` | no | 6 | `h(12, 6)` |\n| `h(12, 6)` | no | 0 | `h(6, 0)` |\n| `h(6, 0)` | yes | - | returns 6 |',
      conclusion: 'The calls reach `h(6, 0)`, which returns its `a`, so the answer is 6.',
      whyWrong: [
        null,
        'This stops one call early, at `h(12, 6)`, returning `a`. The base case needs `b` to be 0.',
        'This stops at `h(18, 12)`, returning `a`. The base case needs `b` to be 0.',
        'This sees that `mod(12,18)` is 12 and assumes the arguments never change. They swap on that call, and after that `b` keeps shrinking until it is 0.',
      ],
      keyIdea: 'This pattern is Euclid\'s algorithm for the highest common factor, the largest number dividing both inputs. Trace it with columns for `a`, `b` and `mod(a,b)`. Stop when `b` is 0 and read off `a`.',
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
      asking: 'How does the number of calls for `f(n)` relate to the number of calls for a smaller input?',
      solution:
        '$T(n)$ means the total number of calls made when `f(n)` runs, including that first call. A **recurrence** is a rule that writes $T(n)$ using $T$ of a smaller input.\n\n' +
        'Take any $n \\ge 1$. The call `f(n)` itself counts as 1 call.\n\n' +
        'Line 5 then makes exactly one further call, `f(n - 1)`. By the meaning of $T$, that call and everything it starts make $T(n-1)$ calls.\n\n' +
        'The 2 on line 5 is only a number added to the result. It is not a call, so it does not count.\n\n' +
        'Add the two parts together: 1 call now, plus $T(n-1)$ calls later. This gives $T(n) = T(n-1) + 1$.',
      conclusion: 'One call now plus $T(n-1)$ from the inner call gives $T(n) = T(n-1) + 1$.',
      whyWrong: [
        null,
        'This is the pattern for two recursive calls. The code calls `f` only once; the 2 is a number added to the result.',
        'This counts the 2 in `2 + f(n - 1)` as calls. It affects the value returned, not the number of calls.',
        'This reads the argument as `n - 2`. The code calls `f(n - 1)`.',
      ],
      keyIdea: 'To write a recurrence for the number of calls, count 1 for the current call, plus one $T$ term for each recursive call in the code, using that call\'s argument. Numbers added or multiplied in the line add no calls.',
    },
  },
];
