import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

/** Remainder that is never negative, matching the pseudocode `mod`. */
const mod = (a: number, b: number) => ((a % b) + b) % b;

/** Passes allowed before a trace in a check counts as never ending. */
const CAP = 1000;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'tracing-pseudocode-001',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'Trace this pseudocode. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('a = 3', 'b = 5', 'a = a + b', 'b = a - b', 'a = a - b', 'print(a, b)'),
    },
    options: ['`3 5`', '`8 3`', '`5 3`', '`10 -2`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Each line uses the **current** values of the variables, then overwrites the variable on the left. Keep a trace table and update it one line at a time:\n\n' +
        '| Line | `a` | `b` |\n|---|---|---|\n' +
        '| `a = 3` | 3 | - |\n' +
        '| `b = 5` | 3 | 5 |\n' +
        '| `a = a + b` | $3 + 5 = 8$ | 5 |\n' +
        '| `b = a - b` | 8 | $8 - 5 = 3$ |\n' +
        '| `a = a - b` | $8 - 3 = 5$ | 3 |\n\n' +
        'So `print(a, b)` shows `5 3`. (This is a well-known trick for swapping two numbers without a spare variable.)',
      whyWrong: [
        'This is what you get if you forget to store the new value of `b` on line 4: with `b` still 5, the last line gives $a = 8 - 5 = 3$. Every assignment really does change the variable.',
        'This stops one line early: it misses the final line `a = a - b`, which changes `a` from 8 to 5.',
        null,
        'This uses the **original** value $a = 3$ on line 4, giving $b = 3 - 5 = -2$, and then the last line gives $a = 8 - (-2) = 10$. Line 4 must use the updated value $a = 8$: always use the newest value in the trace table.',
      ],
      keyIdea: 'An assignment uses the current values on the right, then overwrites the variable on the left, so trace line by line with the newest values.',
    },
    check: {
      optionValues: ['3 5', '8 3', '5 3', '10 -2'],
      compute: () => {
        let a = 3;
        let b = 5;
        a = a + b;
        b = a - b;
        a = a - b;
        return `${a} ${b}`;
      },
    },
  },
  {
    id: 'tracing-pseudocode-002',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'How many stars are printed?',
    code: {
      lang: 'pseudocode',
      source: L('for k = 5 to 14', '   print("*")', 'end for'),
    },
    options: ['10', '9', '14', '15'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`k` takes every whole number from 5 up to 14, **including both ends**: $5, 6, 7, \\dots, 14$.\n\n' +
        'Counting rule for an inclusive range: last $-$ first $+ 1$.\n\n' +
        '$$14 - 5 + 1 = 10$$\n\n' +
        'Check by listing: 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 is 10 values, so 10 stars are printed.',
      whyWrong: [
        null,
        'This is the fencepost error: $14 - 5 = 9$ counts the gaps between the values, not the values themselves. You must add 1 because both 5 and 14 are included.',
        'This counts as if the loop started at 1 (from 1 to 14). The loop starts at 5, so the values 1 to 4 are not used.',
        'This counts every value from 0 to 14. The loop starts at 5, not 0.',
      ],
      keyIdea: 'A loop `for k = a to b` (both ends included) runs $b - a + 1$ times.',
    },
    check: {
      optionValues: [10, 9, 14, 15],
      compute: () => {
        let c = 0;
        for (let k = 5; k <= 14; k++) c++;
        return c;
      },
    },
  },
  {
    id: 'tracing-pseudocode-003',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'x = 17',
        'if mod(x,2) == 0 // mod is the modulus operator',
        '   x = div(x,2) // div is integer division',
        'else',
        '   x = 3 * x + 1',
        'end if',
        'print(x)',
      ),
    },
    options: ['8', '52', '54', '8.5'],
    correctIndex: 1,
    markScheme: {
      solution:
        'First decide which branch runs: work out `mod(17,2)` and compare it with 0.\n\n' +
        '1. `mod(17,2)` is the remainder when 17 is divided by 2. $17 = 2 \\times 8 + 1$, so the remainder is 1.\n' +
        '2. Is $1 = 0$? No, so the condition is **false** (17 is odd) and the `else` branch runs.\n' +
        '3. `x = 3 * x + 1`: multiply first, then add: $3 \\times 17 + 1 = 51 + 1 = 52$.\n' +
        '4. `print(x)` shows 52.',
      whyWrong: [
        'This runs the wrong branch: `div(17,2)` is 8, but that line only runs when `mod(x,2) == 0`. Since `mod(17,2)` is 1, the `else` branch runs instead.',
        null,
        'This adds before multiplying, working out $3 \\times (17 + 1) = 54$. Without brackets, the multiplication is done first: $3 \\times 17 + 1 = 52$.',
        'This runs the wrong branch **and** uses ordinary division ($17 \\div 2 = 8.5$). The odd branch runs, and `div` would give a whole number anyway.',
      ],
      keyIdea: 'Evaluate the `if` condition first (here with `mod`), then run only the branch it selects.',
    },
    check: {
      optionValues: [8, 52, 54, 8.5],
      compute: () => {
        let x = 17;
        if (x % 2 === 0) x = Math.floor(x / 2);
        else x = 3 * x + 1;
        return x;
      },
    },
  },
  {
    id: 'tracing-pseudocode-031',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'What is the value of `mod(17,5)`, where `mod` is the modulus operator?',
    options: ['2', '3', '12', '3.4'],
    correctIndex: 0,
    markScheme: {
      solution: 'The modulus operator gives the **remainder** after division. $17 = 3 \\times 5 + 2$, so `mod(17,5)` is 2.',
      whyWrong: [
        null,
        'This is the whole-number quotient, which is `div(17,5)`. `mod` gives the remainder.',
        'This is $17 - 5$, which subtracts once. The remainder comes from taking out every whole 5.',
        'This is the ordinary division $17 \\div 5$. `mod` gives the remainder, which is a whole number here.',
      ],
      keyIdea: '`mod(a,b)` is the remainder when `a` is divided by `b`.',
    },
    check: { optionValues: [2, 3, 12, 3.4], compute: () => mod(17, 5) },
  },
  {
    id: 'tracing-pseudocode-032',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'What is the value of `div(17,5)`, where `div` is integer division?',
    options: ['2', '4', '3', '3.4'],
    correctIndex: 2,
    markScheme: {
      solution: 'Integer division gives the **whole-number part** of the quotient and rounds down. $17 \\div 5 = 3.4$, so `div(17,5)` is 3.',
      whyWrong: [
        'This is the remainder, `mod(17,5)`. `div` gives the quotient.',
        'This rounds up. Integer division rounds down.',
        null,
        'This is ordinary division. `div` keeps only the whole-number part.',
      ],
      keyIdea: '`div(a,b)` is the whole-number quotient of `a` divided by `b`, rounded down.',
    },
    check: { optionValues: [2, 4, 3, 3.4], compute: () => Math.floor(17 / 5) },
  },
  {
    id: 'tracing-pseudocode-033',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'What does `break` do inside a loop?',
    options: ['Skips to the next pass', 'Ends the loop at once', 'Ends the whole program', 'Restarts the loop'],
    correctIndex: 1,
    markScheme: {
      solution: '`break` ends the loop straight away. The rest of the body is skipped, and the program continues with the first line after `end while` or `end for`.',
      whyWrong: [
        'Skipping to the next pass would keep the loop running. `break` leaves the loop altogether.',
        null,
        'The program carries on with the line after the loop, so only the loop ends.',
        'Nothing goes back to the start. Execution continues after the loop.',
      ],
      keyIdea: '`break` jumps out of the loop to the line after it.',
    },
  },
  {
    id: 'tracing-pseudocode-034',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'If arrays are indexed from 1, which expression gives the first item of array `A`?',
    options: ['`A[0]`', '`A[1]`', '`A[length(A)]`', '`A[2]`'],
    correctIndex: 1,
    markScheme: {
      solution: 'Indexed from 1 means the first item has index 1 and the last has index `length(A)`. So the first item is `A[1]`.',
      whyWrong: [
        'This is the first item only when arrays are indexed from 0. Here index 0 does not exist.',
        null,
        'This is the **last** item of the array.',
        'This is the second item of the array.',
      ],
      keyIdea: 'With arrays indexed from 1, the items are `A[1]` to `A[length(A)]`.',
    },
  },
  {
    id: 'tracing-pseudocode-035',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: 'What happens to a `while (true)` loop whose body has no `break`?',
    options: ['It never runs', 'It runs once', 'It runs twice', 'It never stops'],
    correctIndex: 3,
    markScheme: {
      solution: 'The condition `true` can never become false, so only a `break` can end the loop. Without one the loop never stops, which is an **infinite loop**.',
      whyWrong: [
        'The condition is true at the start, so the body does run.',
        'After the first pass the condition is checked again and is still true, so the loop continues.',
        'Nothing changes the condition after any number of passes, so a second pass is followed by a third.',
        null,
      ],
      keyIdea: 'A `while (true)` loop can only end through a `break`.',
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'tracing-pseudocode-004',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('total = 0', 'for i = 1 to 4', '   total = total + 2 * i', 'end for', 'print(total)'),
    },
    options: ['10', '8', '12', '20'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`total` is an **accumulator**: each pass adds something to the value it already has.\n\n' +
        '| `i` | `2 * i` | `total` |\n|---|---|---|\n' +
        '| start | - | 0 |\n' +
        '| 1 | 2 | 2 |\n' +
        '| 2 | 4 | 6 |\n' +
        '| 3 | 6 | 12 |\n' +
        '| 4 | 8 | 20 |\n\n' +
        'The loop ends after `i = 4`, so 20 is printed.',
      whyWrong: [
        'This adds `i` instead of `2 * i`: $1 + 2 + 3 + 4 = 10$. Each pass adds **double** the value of `i`.',
        'This keeps only the last value of `2 * i`, as if the line were `total = 2 * i`. Because the line says `total = total + ...`, the old total is kept and added to.',
        'This stops after `i = 3` ($2 + 4 + 6 = 12$), treating `to 4` as if 4 were excluded. In this pseudocode `for i = 1 to 4` includes 4.',
        null,
      ],
      keyIdea: 'An accumulator line `total = total + ...` keeps the old value and adds to it on every pass.',
    },
    check: {
      optionValues: [10, 8, 12, 20],
      compute: () => {
        let t = 0;
        for (let i = 1; i <= 4; i++) t += 2 * i;
        return t;
      },
    },
  },
  {
    id: 'tracing-pseudocode-005',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('n = 5', 'count = 0', 'while (n > 0)', '   n = n - 2', '   count = count + 1', 'end while', 'print(count, n)'),
    },
    options: ['`3 -1`', '`2 1`', '`3 0`', '`3 1`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A `while` loop checks its condition **before** every pass, and stops the first time the condition is false.\n\n' +
        '| Check `n > 0`? | `n` after pass | `count` after pass |\n|---|---|---|\n' +
        '| $5 > 0$ yes | 3 | 1 |\n' +
        '| $3 > 0$ yes | 1 | 2 |\n' +
        '| $1 > 0$ yes | $-1$ | 3 |\n' +
        '| $-1 > 0$ no, stop | | |\n\n' +
        'After the loop `count` is 3 and `n` is $-1$, so the output is `3 -1`.',
      whyWrong: [
        null,
        'This stops when `n` reaches 1, as if the condition were `n > 1`. But $1 > 0$ is true, so the loop runs one more time.',
        'This assumes `n` lands exactly on 0. Starting at 5 and subtracting 2 gives 3, 1, $-1$: the odd numbers skip over 0.',
        'This prints the value of `n` from before the last subtraction. The final pass changes `n` from 1 to $-1$ before the loop ends.',
      ],
      keyIdea: 'A while loop stops the first time its condition is false, and the counter may jump past the boundary value.',
    },
    check: {
      optionValues: ['3 -1', '2 1', '3 0', '3 1'],
      compute: () => {
        let n = 5;
        let c = 0;
        while (n > 0) {
          n -= 2;
          c++;
        }
        return `${c} ${n}`;
      },
    },
  },
  {
    id: 'tracing-pseudocode-006',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'Starting from `k = 2`, which `while` loop does the same as this `for` loop?',
    code: {
      lang: 'pseudocode',
      source: L('p = 1', 'for k = 2 to 6', '   p = p * k', 'end for', 'print(p)'),
    },
    options: [
      '`while (k < 6)`, with `k = k + 1` last in the body',
      '`while (k <= 6)`, with no update of `k`',
      '`while (k <= 6)`, with `k = k + 1` last in the body',
      '`while (k <= 6)`, with `k = k + 1` first in the body',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'First find what the `for` loop prints: $p = 2 \\times 3 \\times 4 \\times 5 \\times 6 = 720$.\n\n' +
        'A correct `while` version needs three things: **start** the counter (`k = 2`), a **condition** that is still true for the last value (`k <= 6`), and an **update** at the end of the body (`k = k + 1`).\n\n' +
        '- `k < 6` stops before $k = 6$, so $p = 2 \\times 3 \\times 4 \\times 5 = 120$.\n' +
        '- With no update `k` stays 2 forever: an infinite loop.\n' +
        '- `k <= 6` with the update last uses $k = 2, 3, 4, 5, 6$ and then stops when $k = 7$. It prints 720, the same as the `for` loop.\n' +
        '- With the update first it multiplies by $3, 4, 5, 6, 7$: $p = 2520$.',
      whyWrong: [
        '`k < 6` is false when $k = 6$, so 6 is never multiplied in and it prints 120. The `for` loop includes 6, so the condition must be `k <= 6`.',
        'Without an update `k` never changes, so `k <= 6` stays true for ever and the loop never ends.',
        null,
        'This updates `k` before using it, so the first multiplication is by 3 and the last is by 7, giving 2520. The update must come after the work in the body.',
      ],
      keyIdea: 'A loop `for k = a to b` becomes: `k = a`, then `while (k <= b)`, the body, then `k = k + 1` as the last line of the body.',
    },
    check: {
      optionValues: ['stops early', 'no update', 'update last', 'update first'],
      compute: () => {
        let target = 1;
        for (let k = 2; k <= 6; k++) target *= k;
        const run = (last: number, step: number, updateFirst: boolean): number | string => {
          let p = 1;
          let k = 2;
          for (let pass = 0; k <= last; pass++) {
            if (pass > CAP) return 'Infinite loop';
            if (updateFirst) k += step;
            p *= k;
            if (!updateFirst) k += step;
          }
          return p;
        };
        const loops: Record<string, number | string> = {
          'stops early': run(5, 1, false),
          'no update': run(6, 0, false),
          'update last': run(6, 1, false),
          'update first': run(6, 1, true),
        };
        const ok = Object.keys(loops).filter((k) => loops[k] === target);
        return ok.length === 1 ? ok[0] : 'none or several';
      },
    },
  },
  {
    id: 'tracing-pseudocode-007',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'This loop should add all 4 items of `A`, but it prints 17 instead of 21. Arrays are indexed from 1. Which single change fixes it?',
    code: {
      lang: 'pseudocode',
      source: L('A = [4, 7, 1, 9]', 'total = 0', 'i = 2', 'while (i <= 4)', '   total = total + A[i]', '   i = i + 1', 'end while', 'print(total)'),
    },
    options: [
      'Change `i <= 4` to `i <= 5`',
      'Change `i = 2` to `i = 1`',
      'Change `i <= 4` to `i < 5`',
      'Swap the two lines inside the loop',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Trace the original: `i` takes the values 2, 3, 4. So it adds `A[2] + A[3] + A[4]` $= 7 + 1 + 9 = 17$. The first item `A[1] = 4` is **never added**: the loop starts one position too late (an off-by-one error).\n\n' +
        'Fix: start at `i = 1`. Then `i` takes 1, 2, 3, 4, and the total is $4 + 7 + 1 + 9 = 21$.\n\n' +
        'Checking the other changes:\n\n' +
        '- `i <= 5` makes `i` go up to 5, but `A[5]` does not exist (error), and `A[1]` is still skipped.\n' +
        '- `i < 5` means exactly the same as `i <= 4` for whole numbers, so nothing changes: still 17.\n' +
        '- Swapping the lines makes `i` become 3, 4, 5 before each addition: it skips `A[2]` as well and then tries to read `A[5]`.',
      whyWrong: [
        'This fixes the wrong end of the loop. `i` would reach 5 and the code would read `A[5]`, which does not exist, while `A[1]` is still skipped.',
        null,
        'For whole numbers, `i < 5` and `i <= 4` are the same test, so the loop runs exactly as before and still prints 17.',
        'Updating `i` before using it moves every read one place further on: it skips `A[2]` too and then reads past the end of the array.',
      ],
      keyIdea: 'When a loop misses the first or last item, check the starting value and the stopping condition of the counter (off-by-one errors).',
    },
    check: {
      optionValues: ['end at 5', 'start at 1', 'same test', 'swapped'],
      compute: () => {
        const a = [4, 7, 1, 9];
        const run = (start: number, last: number) => {
          let total = 0;
          for (let i = start; i <= last; i++) {
            if (i > a.length) return 'error';
            total += a[i - 1];
          }
          return total;
        };
        const fixes: Record<string, number | string> = {
          'end at 5': run(2, 5),
          'start at 1': run(1, 4),
          'same test': run(2, 4),
          swapped: run(3, 5),
        };
        const ok = Object.keys(fixes).filter((k) => fixes[k] === 21);
        return ok.length === 1 ? ok[0] : 'none or several';
      },
    },
  },
  {
    id: 'tracing-pseudocode-008',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'x = 50',
        'count = 0',
        'while (x > 1)',
        '   if mod(x,2) == 0 // mod is the modulus operator',
        '      x = div(x,2) // div is integer division',
        '   end if',
        '   count = count + 1',
        'end while',
        'print(count)',
      ),
    },
    options: ['5', '6', 'Infinite loop', '1'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Trace the first passes:\n\n' +
        '| Pass | `x` at start | `mod(x,2) == 0`? | `x` at end | `count` |\n|---|---|---|---|---|\n' +
        '| 1 | 50 | yes | 25 | 1 |\n' +
        '| 2 | 25 | no | 25 | 2 |\n' +
        '| 3 | 25 | no | 25 | 3 |\n\n' +
        'Once `x` is 25 (odd), the `if` is false, so **nothing changes `x` any more**. The condition `x > 1` stays true for ever, and `count` just keeps growing. The loop never ends and `print(count)` is never reached.\n\n' +
        'This is a **missing update** bug: on some paths through the loop body, the variable in the loop condition is not changed.',
      whyWrong: [
        'This assumes `x` keeps halving: 50, 25, 12, 6, 3, 1 (5 halvings). But 25 is odd, so the halving line is skipped and `x` never gets to 12.',
        'This counts 50, 25, 12, 6, 3, 1 as six steps, assuming `x` always halves. The halving only happens when `x` is even, and 25 is odd.',
        null,
        'This thinks the loop ends the moment the `if` test fails (at the start of pass 2, before `count` goes up again). The loop only ends when its own condition `x > 1` is false, and $25 > 1$ is still true.',
      ],
      keyIdea: 'A while loop ends only if something in its body eventually makes the condition false; if the update can be skipped, the loop may run for ever.',
    },
    check: {
      optionValues: [5, 6, 'Infinite loop', 1],
      compute: () => {
        let x = 50;
        let count = 0;
        while (x > 1) {
          if (count > CAP) return 'Infinite loop';
          if (x % 2 === 0) x = Math.floor(x / 2);
          count++;
        }
        return count;
      },
    },
  },
  {
    id: 'tracing-pseudocode-009',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'Arrays are indexed from 1, and `A` is not empty. What does `mystery(A)` return?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function mystery(A)',
        '   p = 1',
        '   for i = 2 to length(A)',
        '      if A[i] > A[p]',
        '         p = i',
        '      end if',
        '   end for',
        '   return p',
        'end function',
      ),
    },
    options: ['The largest value', 'The first position of the largest value', 'The last position of the largest value', 'The position of the smallest value'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`p` stores a **position**, not a value: it starts at 1 and is set to `i`. The test `A[i] > A[p]` asks "is this item bigger than the best one so far?", so `p` always points to the largest item seen so far.\n\n' +
        'Try a small example with a tie, `A = [5, 9, 2, 9]`:\n\n' +
        '| `i` | `A[i]` | `A[p]` | `A[i] > A[p]`? | `p` |\n|---|---|---|---|---|\n' +
        '| start | | | | 1 |\n' +
        '| 2 | 9 | 5 | yes | 2 |\n' +
        '| 3 | 2 | 9 | no | 2 |\n' +
        '| 4 | 9 | 9 | no ($9 > 9$ is false) | 2 |\n\n' +
        'It returns 2, the position of the **first** 9. Because the test is a strict `>`, a later equal value does not replace the earlier one.',
      whyWrong: [
        'The function returns `p`, which is a position (index), not `A[p]`, the value stored there. For `[5, 9, 2, 9]` it returns 2, not 9.',
        null,
        'That would need `>=`. With strict `>`, an equal value later in the array does not update `p`, so the first occurrence is kept.',
        'The test `A[i] > A[p]` moves `p` to **bigger** items, so it tracks the largest value. Tracking the smallest would need `<`.',
      ],
      keyIdea: 'To see what an algorithm computes, trace a small example (include a tie) and notice whether variables hold values or positions.',
    },
    check: {
      // What each option would give for [5, 9, 2, 9].
      optionValues: [9, 2, 4, 3],
      compute: () => {
        const a = [5, 9, 2, 9];
        let p = 1;
        for (let i = 2; i <= a.length; i++) if (a[i - 1] > a[p - 1]) p = i;
        return p;
      },
    },
  },
  {
    id: 'tracing-pseudocode-010',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function mystery(n)',
        '   r = 0',
        '   while (n > 0)',
        '      r = r * 10 + mod(n,10) // mod is the modulus operator',
        '      n = div(n,10) // div is integer division',
        '   end while',
        '   return r',
        'end function',
        '',
        'print(mystery(4072))',
      ),
    },
    options: ['2704', '274', '13', '27040'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`mod(n,10)` is the **last digit** of `n`, and `div(n,10)` **removes** the last digit. `r * 10 + digit` sticks the digit onto the end of `r`.\n\n' +
        '| `n` at start | `mod(n,10)` | `r` after the pass | `div(n,10)` |\n|---|---|---|---|\n' +
        '| 4072 | 2 | $0 \\times 10 + 2 = 2$ | 407 |\n' +
        '| 407 | 7 | $2 \\times 10 + 7 = 27$ | 40 |\n' +
        '| 40 | 0 | $27 \\times 10 = 270$ (the digit 0 adds nothing) | 4 |\n' +
        '| 4 | 4 | $270 \\times 10 + 4 = 2704$ | 0 |\n\n' +
        'Now $n = 0$, so the loop stops and the function returns 2704: it **reverses the digits**.',
      whyWrong: [
        null,
        'This drops the zero digit. Even when the digit is 0, `r` is still multiplied by 10 (270), which keeps a place for the 0.',
        'This is the sum of the digits ($4 + 7 + 2 = 13$; the 0 adds nothing). It forgets the `r * 10`, which shifts the digits along instead of adding them.',
        'This multiplies by 10 after adding the digit, as if the line were `r = (r + mod(n,10)) * 10`, which leaves an extra 0 on the end.',
      ],
      keyIdea: '`mod(n,10)` takes the last digit and `div(n,10)` removes it; `r * 10 + digit` builds a number digit by digit.',
    },
    check: {
      optionValues: [2704, 274, 13, 27040],
      compute: () => {
        let n = 4072;
        let r = 0;
        while (n > 0) {
          r = r * 10 + (n % 10);
          n = Math.floor(n / 10);
        }
        return r;
      },
    },
  },
  {
    id: 'tracing-pseudocode-011',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('count = 0', 'for i = 1 to 5', '   for j = i to 5', '      count = count + 1', '   end for', 'end for', 'print(count)'),
    },
    options: ['25', '10', '14', '15'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The inner loop **depends on** `i`: it runs from `j = i` to 5, which is $5 - i + 1$ passes.\n\n' +
        '| `i` | values of `j` | inner passes |\n|---|---|---|\n' +
        '| 1 | 1 to 5 | 5 |\n' +
        '| 2 | 2 to 5 | 4 |\n' +
        '| 3 | 3 to 5 | 3 |\n' +
        '| 4 | 4 to 5 | 2 |\n' +
        '| 5 | 5 to 5 | 1 |\n\n' +
        'Total: $5 + 4 + 3 + 2 + 1 = 15$. (Shortcut: $1 + 2 + \\dots + n = \\frac{n(n+1)}{2}$, and $\\frac{5 \\times 6}{2} = 15$.)',
      whyWrong: [
        'This treats the inner loop as always running 5 times ($5 \\times 5 = 25$). It starts at `j = i`, so it gets shorter each time.',
        'This starts the inner loop at `i + 1` instead of `i` ($4 + 3 + 2 + 1 = 10$, with no pass at all when $i = 5$). `for j = i to 5` includes `j = i` itself.',
        'This forgets the last pass `i = 5`, where `j` goes from 5 to 5. That is still one pass, because both ends are included.',
        null,
      ],
      keyIdea: 'When an inner loop depends on the outer counter, count the inner passes for each outer value and add them up.',
    },
    check: {
      optionValues: [25, 10, 14, 15],
      compute: () => {
        let c = 0;
        for (let i = 1; i <= 5; i++) for (let j = i; j <= 5; j++) c++;
        return c;
      },
    },
  },
  {
    id: 'tracing-pseudocode-012',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed? Arrays are indexed from 1.',
    code: {
      lang: 'pseudocode',
      source: L(
        'A = [3, 8, 2, 7, 4]',
        'i = 1',
        'best = 0',
        'while (i <= length(A))',
        '   if mod(A[i],2) == 0 // mod is the modulus operator',
        '      best = best + A[i]',
        '   end if',
        '   i = i + 2',
        'end while',
        'print(best)',
      ),
    },
    options: ['14', '9', '6', '8'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`i` starts at 1 and goes up by **2**, so only the positions 1, 3, 5 are visited (the loop stops when $i = 7$, because $7 \\le 5$ is false).\n\n' +
        '| `i` | `A[i]` | even? | `best` |\n|---|---|---|---|\n' +
        '| 1 | 3 | no | 0 |\n' +
        '| 3 | 2 | yes | 2 |\n' +
        '| 5 | 4 | yes | 6 |\n\n' +
        'It prints 6.',
      whyWrong: [
        'This adds every even number in the array ($8 + 2 + 4$), ignoring `i = i + 2`. The 8 is at position 2, which is never visited.',
        'This adds every visited item ($3 + 2 + 4$), ignoring the test `mod(A[i],2) == 0`. The 3 is odd, so it is not added.',
        null,
        'This starts from the second item, as if `i` started at 2, so it visits 8 and 7 and adds only the 8. The first item is `A[1]`, and the loop starts there.',
      ],
      keyIdea: 'Track exactly which values the loop counter takes (start, step, stop) before applying the condition inside the loop.',
    },
    check: {
      optionValues: [14, 9, 6, 8],
      compute: () => {
        const a = [3, 8, 2, 7, 4];
        let best = 0;
        for (let i = 1; i <= a.length; i += 2) if (a[i - 1] % 2 === 0) best += a[i - 1];
        return best;
      },
    },
  },
  {
    id: 'tracing-pseudocode-013',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: "This is Euclid's algorithm. What is printed?",
    code: {
      lang: 'pseudocode',
      source: L(
        'a = 252',
        'b = 105',
        'passes = 0',
        'while (b != 0)',
        '   r = mod(a,b) // mod is the modulus operator',
        '   a = b',
        '   b = r',
        '   passes = passes + 1',
        'end while',
        'print(a, passes)',
      ),
    },
    options: ['`21 3`', '`0 3`', '`42 2`', '`21 2`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`!=` means "is not equal to", so the loop runs while `b` is not 0.\n\n' +
        '| Pass | `r = mod(a,b)` | new `a` | new `b` | `passes` |\n|---|---|---|---|---|\n' +
        '| 1 | $252 - 2 \\times 105 = 42$ | 105 | 42 | 1 |\n' +
        '| 2 | $105 - 2 \\times 42 = 21$ | 42 | 21 | 2 |\n' +
        '| 3 | $42 - 2 \\times 21 = 0$ | 21 | 0 | 3 |\n\n' +
        'Now `b` is 0, so the loop stops. It prints `21 3`. (21 is the highest common factor of 252 and 105.)',
      whyWrong: [
        null,
        'This prints the final value of `b` (0) instead of `a`. In the last pass `a` takes the old `b`, which is 21.',
        'This stops as soon as the remainder 21 appears, after 2 passes. The loop only stops when `b` itself becomes 0, which needs a third pass.',
        'The value 21 is right, but this does not count the pass that finds the remainder 0. At the top of that third pass `b` is still 21 (not 0), so the pass runs and adds 1 to `passes`.',
      ],
      keyIdea: 'For a while loop, keep tracing passes until the condition is false at the top of the loop, and count every pass that ran.',
    },
    check: {
      optionValues: ['21 3', '0 3', '42 2', '21 2'],
      compute: () => {
        let a = 252;
        let b = 105;
        let p = 0;
        while (b !== 0) {
          const r = a % b;
          a = b;
          b = r;
          p++;
        }
        return `${a} ${p}`;
      },
    },
  },
  {
    id: 'tracing-pseudocode-014',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('a = 1', 'b = 1', 'for i = 1 to 5', '   t = a + b', '   a = b', '   b = t', 'end for', 'print(b)'),
    },
    options: ['8', '13', '21', '32'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`t` is a **temporary** variable: it remembers `a + b` before `a` is overwritten.\n\n' +
        '| `i` | `t = a + b` | `a = b` | `b = t` |\n|---|---|---|---|\n' +
        '| start | | 1 | 1 |\n' +
        '| 1 | 2 | 1 | 2 |\n' +
        '| 2 | 3 | 2 | 3 |\n' +
        '| 3 | 5 | 3 | 5 |\n' +
        '| 4 | 8 | 5 | 8 |\n' +
        '| 5 | 13 | 8 | 13 |\n\n' +
        'After 5 passes `b` is 13 (these are the Fibonacci numbers 1, 1, 2, 3, 5, 8, 13).',
      whyWrong: [
        'This stops after 4 passes. `for i = 1 to 5` runs 5 times, and the fifth pass changes `b` from 8 to 13.',
        null,
        'This does one pass too many (6 passes). Count the rows: `i` = 1, 2, 3, 4, 5 is exactly 5 passes.',
        'This skips the temporary variable: it does `a = b` first and then `b = a + b`, which now uses the **new** `a`, so `b` just doubles (2, 4, 8, 16, 32).',
      ],
      keyIdea: 'A temporary variable saves a value before it is overwritten; trace in the exact order the lines are written.',
    },
    check: {
      optionValues: [8, 13, 21, 32],
      compute: () => {
        let a = 1;
        let b = 1;
        for (let i = 1; i <= 5; i++) {
          const t = a + b;
          a = b;
          b = t;
        }
        return b;
      },
    },
  },
  {
    id: 'tracing-pseudocode-015',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('x = 2', 'y = 0', 'while (x < 40)', '   y = y + x', '   x = x * 3', 'end while', 'print(y)'),
    },
    options: ['8', '80', '26', 'Infinite loop'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The condition `x < 40` is checked **at the top**, before each pass.\n\n' +
        '| Check `x < 40` | `y = y + x` | `x = x * 3` |\n|---|---|---|\n' +
        '| $2 < 40$ yes | $0 + 2 = 2$ | 6 |\n' +
        '| $6 < 40$ yes | $2 + 6 = 8$ | 18 |\n' +
        '| $18 < 40$ yes | $8 + 18 = 26$ | 54 |\n' +
        '| $54 < 40$ no, stop | | |\n\n' +
        'After the third pass $x = 54$, so the loop stops and it prints 26.',
      whyWrong: [
        'This tests the value `x` will have **after** the pass instead of the value it has at the top. At the start of pass 3, $x = 18$ and $18 < 40$ is true, so pass 3 runs in full.',
        'This runs a fourth pass with $x = 54$. The condition is re-checked before every pass, and $54 < 40$ is false.',
        null,
        '`x` grows on every pass, so it passes 40 and the loop stops.',
      ],
      keyIdea: 'A while condition is only checked at the top of each pass: a pass always finishes, and no new pass starts once the condition is false.',
    },
    check: {
      optionValues: [8, 80, 26, 'Infinite loop'],
      compute: () => {
        let x = 2;
        let y = 0;
        let guard = 0;
        while (x < 40) {
          if (++guard > CAP) return 'Infinite loop';
          y += x;
          x *= 3;
        }
        return y;
      },
    },
  },
  {
    id: 'tracing-pseudocode-017',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 13',
        'r = 0',
        'p = 1',
        'while (n > 0)',
        '   r = r + p * mod(n,2) // mod is the modulus operator',
        '   p = p * 10',
        '   n = div(n,2) // div is integer division',
        'end while',
        'print(r)',
      ),
    },
    options: ['1101', '1011', '101', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each pass takes the remainder on division by 2 (a binary digit) and writes it one place further to the left.\n\n' +
        '| `n` | `mod(n,2)` | `r` after the pass | `p` after the pass | `div(n,2)` |\n|---|---|---|---|---|\n' +
        '| 13 | 1 | 1 | 10 | 6 |\n' +
        '| 6 | 0 | 1 | 100 | 3 |\n' +
        '| 3 | 1 | 101 | 1000 | 1 |\n' +
        '| 1 | 1 | 1101 | 10000 | 0 |\n\n' +
        'Now $n = 0$, so the loop stops and 1101 is printed. Check: $8 + 4 + 1 = 13$. The algorithm writes a number in binary.',
      whyWrong: [
        null,
        'This puts each new digit on the **right** instead of the left, which writes the binary digits in reverse order.',
        'This stops when `n` is 1, as if the condition were `n > 1`. But $1 > 0$ is true, so there is one more pass, which adds the leading 1.',
        '`div(n,2)` shrinks `n` on every pass until it reaches 0, so the loop stops.',
      ],
      keyIdea: 'Repeated `mod(n,2)` and `div(n,2)` produce the binary digits from right to left.',
    },
    check: {
      optionValues: [1101, 1011, 101, 'Infinite loop'],
      compute: () => {
        let n = 13;
        let r = 0;
        let p = 1;
        let guard = 0;
        while (n > 0) {
          if (++guard > CAP) return 'Infinite loop';
          r += p * (n % 2);
          p *= 10;
          n = Math.floor(n / 2);
        }
        return r;
      },
    },
  },
  {
    id: 'tracing-pseudocode-018',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'How many times is the line `count = count + 1` executed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'count = 0',
        'i = 1',
        'while (i <= 16)',
        '   j = i',
        '   while (j <= 16)',
        '      count = count + 1',
        '      j = j * 2',
        '   end while',
        '   i = i * 2',
        'end while',
        'print(count)',
      ),
    },
    options: ['25', '15', '10', '5'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The outer counter doubles: $i = 1, 2, 4, 8, 16$ (5 values; then $i = 32$ fails `i <= 16`).\n\n' +
        'For each `i`, the inner loop starts at `j = i` and doubles up to 16:\n\n' +
        '| `i` | values of `j` | inner passes |\n|---|---|---|\n' +
        '| 1 | 1, 2, 4, 8, 16 | 5 |\n' +
        '| 2 | 2, 4, 8, 16 | 4 |\n' +
        '| 4 | 4, 8, 16 | 3 |\n' +
        '| 8 | 8, 16 | 2 |\n' +
        '| 16 | 16 | 1 |\n\n' +
        'Total: $5 + 4 + 3 + 2 + 1 = 15$.',
      whyWrong: [
        'This assumes the inner loop always does 5 passes ($5 \\times 5 = 25$). It starts at `j = i`, not at 1, so it gets shorter as `i` grows.',
        null,
        'This treats `<= 16` as `< 16`, so 16 is never used: $4 + 3 + 2 + 1 = 10$. Since $16 \\le 16$ is true, 16 is included.',
        'This counts only the passes of the outer loop (5). The line is inside the inner loop, which runs several times per outer pass.',
      ],
      keyIdea: 'A counter that doubles up to $n$ takes about $\\log_2 n$ steps; for nested loops add up the inner passes for every outer value.',
    },
    check: {
      optionValues: [25, 15, 10, 5],
      compute: () => {
        let c = 0;
        for (let i = 1; i <= 16; i *= 2) for (let j = i; j <= 16; j *= 2) c++;
        return c;
      },
    },
  },
  {
    id: 'tracing-pseudocode-021',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 40',
        't = 0',
        'while (true)',
        '   t = t + mod(n,6) // mod is the modulus operator',
        '   n = n - 11',
        '   if n<0',
        '      break',
        '   end if',
        'end while',
        'print(t)',
      ),
    },
    options: ['9', '10', '14', 'Infinite loop'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`mod(n,6)` is the remainder when `n` is divided by 6. The table shows each pass, with `n` as it is at the start of the pass:\n\n' +
        '| `n` | `mod(n,6)` | `t` |\n|---|---|---|\n' +
        '| 40 | 4 | 4 |\n' +
        '| 29 | 5 | 9 |\n' +
        '| 18 | 0 | 9 |\n' +
        '| 7 | 1 | 10 |\n\n' +
        'After the last row `n` becomes $-4$, so `n<0` is true, the loop breaks and it prints 10.',
      whyWrong: [
        'This stops one pass early, leaving out the pass with $n = 7$. At that point $n = 7$ is not below 0, so the loop has not broken yet.',
        null,
        'This runs one more pass with $n = -4$, adding 4 as its remainder. The `break` happens as soon as `n` falls below 0, so that pass never runs.',
        '`n` falls by 11 on every pass, so it becomes negative and the `break` runs.',
      ],
      keyIdea: 'In a `while (true)` loop, trace pass by pass and check the `break` condition straight after `n` changes.',
    },
    check: {
      optionValues: [9, 10, 14, 'Infinite loop'],
      compute: () => {
        let n = 40;
        let t = 0;
        for (let pass = 0; pass < CAP; pass++) {
          t += mod(n, 6);
          n -= 11;
          if (n < 0) return t;
        }
        return 'Infinite loop';
      },
    },
  },
  {
    id: 'tracing-pseudocode-022',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 33',
        't = 0',
        'while (true)',
        '   t = t + mod(n,4) // mod is the modulus operator',
        '   n = n - 7',
        '   if n<0',
        '      break',
        '   end if',
        'end while',
        'print(t)',
      ),
    },
    options: ['6', '7', '9', 'Infinite loop'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| `n` | `mod(n,4)` | `t` |\n|---|---|---|\n' +
        '| 33 | 1 | 1 |\n' +
        '| 26 | 2 | 3 |\n' +
        '| 19 | 3 | 6 |\n' +
        '| 12 | 0 | 6 |\n' +
        '| 5 | 1 | 7 |\n\n' +
        'After the last row `n` becomes $-2$, so `n<0` is true, the loop breaks and it prints 7.',
      whyWrong: [
        'This stops one pass early, leaving out the pass with $n = 5$, which adds 1. $n = 5$ is not below 0.',
        null,
        'This runs one extra pass with $n = -2$, adding $\\text{mod}(-2, 4) = 2$. The `break` happens straight after `n` becomes negative.',
        '`n` falls by 7 on every pass, so it becomes negative and the `break` runs.',
      ],
      keyIdea: 'Add `mod(n,m)` for the current `n` first, then update `n`, then test for the `break`, in the order the lines are written.',
    },
    check: {
      optionValues: [6, 7, 9, 'Infinite loop'],
      compute: () => {
        let n = 33;
        let t = 0;
        for (let pass = 0; pass < CAP; pass++) {
          t += mod(n, 4);
          n -= 7;
          if (n < 0) return t;
        }
        return 'Infinite loop';
      },
    },
  },
  {
    id: 'tracing-pseudocode-023',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 30',
        'c = 0',
        'while (true)',
        '   c = c + 1',
        '   n = n - 6',
        '   if n<=0',
        '      break',
        '   end if',
        'end while',
        'print(c)',
      ),
    },
    options: ['4', '5', '6', 'Infinite loop'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| `c` after the pass | `n` after the pass | `n<=0`? |\n|---|---|---|\n' +
        '| 1 | 24 | no |\n' +
        '| 2 | 18 | no |\n' +
        '| 3 | 12 | no |\n' +
        '| 4 | 6 | no |\n' +
        '| 5 | 0 | yes, so `break` |\n\n' +
        'It prints 5. The test `n<=0` includes 0, so the loop stops as soon as `n` reaches exactly 0.',
      whyWrong: [
        'This stops when $n = 6$, before `n` has reached 0. $6 \\le 0$ is false, so one more pass runs.',
        null,
        'This reads the test as `n<0`, which would need one more pass to take `n` below 0. With `n<=0` the loop stops at $n = 0$.',
        '`n` falls by 6 on every pass, so it reaches 0 and the `break` runs.',
      ],
      keyIdea: 'Read the `break` test exactly: `n<=0` stops at 0, while `n<0` needs one more pass.',
    },
    check: {
      optionValues: [4, 5, 6, 'Infinite loop'],
      compute: () => {
        let n = 30;
        let c = 0;
        for (let pass = 0; pass < CAP; pass++) {
          c += 1;
          n -= 6;
          if (n <= 0) return c;
        }
        return 'Infinite loop';
      },
    },
  },
  {
    id: 'tracing-pseudocode-024',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 24',
        't = 0',
        'while (true)',
        '   t = t + mod(n,5) // mod is the modulus operator',
        '   n = n - 8',
        '   if n<=0',
        '      break',
        '   end if',
        'end while',
        'print(t)',
      ),
    },
    options: ['4', '5', '8', 'Infinite loop'],
    correctIndex: 2,
    markScheme: {
      solution:
        '| `n` | `mod(n,5)` | `t` |\n|---|---|---|\n' +
        '| 24 | 4 | 4 |\n' +
        '| 16 | 1 | 5 |\n' +
        '| 8 | 3 | 8 |\n\n' +
        'After the last row `n` becomes 0, so `n<=0` is true, the loop breaks and it prints 8.',
      whyWrong: [
        'This reads the test backwards, as if the loop broke while `n` is still positive, so it stops after the first pass.',
        'This stops one pass early, leaving out the pass with $n = 8$. At that point $8 \\le 0$ is false, so the loop has not broken yet.',
        null,
        '`n` falls by 8 on every pass, so it reaches 0 and the `break` runs.',
      ],
      keyIdea: 'With `n<=0` the loop breaks as soon as `n` reaches 0.',
    },
    check: {
      optionValues: [4, 5, 8, 'Infinite loop'],
      compute: () => {
        let n = 24;
        let t = 0;
        for (let pass = 0; pass < CAP; pass++) {
          t += mod(n, 5);
          n -= 8;
          if (n <= 0) return t;
        }
        return 'Infinite loop';
      },
    },
  },
  {
    id: 'tracing-pseudocode-025',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 25',
        't = 0',
        'while (true)',
        '   t = t + mod(n,3) // mod is the modulus operator',
        '   n = n - 5',
        '   if n==1',
        '      break',
        '   end if',
        'end while',
        'print(t)',
      ),
    },
    options: ['6', '4', '1', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`n` takes the values 25, 20, 15, 10, 5, 0, $-5$, and so on. These are all multiples of 5, so `n` is never exactly 1.\n\n' +
        '| `n` at start of pass | `mod(n,3)` | `t` | `n` after the pass | `n==1`? |\n|---|---|---|---|---|\n' +
        '| 25 | 1 | 1 | 20 | no |\n' +
        '| 20 | 2 | 3 | 15 | no |\n' +
        '| 15 | 0 | 3 | 10 | no |\n' +
        '| 10 | 1 | 4 | 5 | no |\n' +
        '| 5 | 2 | 6 | 0 | no |\n\n' +
        'The test `n==1` is never true, so the `break` never runs and the loop never ends.',
      whyWrong: [
        'This treats `n==1` as `n<=1`, stopping when `n` reaches 0. The test asks for exactly 1, and `n` jumps past it.',
        'This stops once `n` reaches 5. The test asks for exactly 1, and 5 is not 1.',
        'This reads `n==1` as `n!=1`, so the loop breaks after the first pass.',
        null,
      ],
      keyIdea: 'A `break` on an exact value can be missed: check whether the loop variable ever equals that value.',
    },
    check: {
      optionValues: [6, 4, 1, 'Infinite loop'],
      compute: () => {
        let n = 25;
        let t = 0;
        for (let pass = 0; pass < CAP; pass++) {
          t += mod(n, 3);
          n -= 5;
          if (n === 1) return t;
        }
        return 'Infinite loop';
      },
    },
  },
  {
    id: 'tracing-pseudocode-026',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 12',
        't = 0',
        'while (true)',
        '   t = t + mod(n,5) // mod is the modulus operator',
        '   n = n + 3',
        '   if n<0',
        '      break',
        '   end if',
        'end while',
        'print(t)',
      ),
    },
    options: ['10', '2', '0', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`n` starts at 12 and **goes up** by 3 on every pass:\n\n' +
        '| `n` at start of pass | `mod(n,5)` | `t` | `n` after the pass |\n|---|---|---|---|\n' +
        '| 12 | 2 | 2 | 15 |\n' +
        '| 15 | 0 | 2 | 18 |\n' +
        '| 18 | 3 | 5 | 21 |\n\n' +
        'A positive number that keeps growing is never below 0, so the `break` never runs and the loop never ends.',
      whyWrong: [
        'This reads `n + 3` as `n - 3`, so `n` would fall to a negative value: $2 + 4 + 1 + 3 = 10$. The code adds 3, so `n` grows.',
        'This stops after the first pass, reading the test as if it were true at once. $15 < 0$ is false.',
        'This is the starting value of `t`. The `print` is never reached, so nothing is printed at all.',
        null,
      ],
      keyIdea: 'Check which way the loop variable moves: if it moves away from the `break` condition, the loop never ends.',
    },
    check: {
      optionValues: [10, 2, 0, 'Infinite loop'],
      compute: () => {
        let n = 12;
        let t = 0;
        for (let pass = 0; pass < CAP; pass++) {
          t += mod(n, 5);
          n += 3;
          if (n < 0) return t;
        }
        return 'Infinite loop';
      },
    },
  },
  {
    id: 'tracing-pseudocode-027',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('t = 0', 'for i = 1 to 7', '   t = t + mod(i,3) // mod is the modulus operator', 'end for', 'print(t)'),
    },
    options: ['7', '6', '28', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        '| `i` | `mod(i,3)` | `t` |\n|---|---|---|\n' +
        '| 1 | 1 | 1 |\n' +
        '| 2 | 2 | 3 |\n' +
        '| 3 | 0 | 3 |\n' +
        '| 4 | 1 | 4 |\n' +
        '| 5 | 2 | 6 |\n' +
        '| 6 | 0 | 6 |\n' +
        '| 7 | 1 | 7 |\n\n' +
        '`for i = 1 to 7` includes 7, so it prints 7.',
      whyWrong: [
        null,
        'This stops at $i = 6$, treating `to 7` as if 7 were excluded. Both ends are included.',
        'This adds `i` itself ($1 + 2 + \\dots + 7$), ignoring the `mod`.',
        'A `for` loop runs a fixed number of times, here 7, so it always ends.',
      ],
      keyIdea: '`for i = 1 to n` includes $n$, and `mod(i,3)` cycles through 1, 2, 0.',
    },
    check: {
      optionValues: [7, 6, 28, 'Infinite loop'],
      compute: () => {
        let t = 0;
        for (let i = 1; i <= 7; i++) t += mod(i, 3);
        return t;
      },
    },
  },
  {
    id: 'tracing-pseudocode-028',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'a = 0',
        'b = 0',
        'for i = 1 to 6',
        '   if mod(i,2) == 0 // mod is the modulus operator',
        '      a = a + i',
        '   else',
        '      if i > 3',
        '         b = b + i',
        '      else',
        '         b = b + 1',
        '      end if',
        '   end if',
        'end for',
        'print(a - b)',
      ),
    },
    options: ['5', '3', '12', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Even values of `i` add to `a`. Odd values go into the `else`, where the nested `if` decides what to add to `b`.\n\n' +
        '| `i` | Branch | `a` | `b` |\n|---|---|---|---|\n' +
        '| 1 | odd, not above 3 | 0 | 1 |\n' +
        '| 2 | even | 2 | 1 |\n' +
        '| 3 | odd, not above 3 | 2 | 2 |\n' +
        '| 4 | even | 6 | 2 |\n' +
        '| 5 | odd, above 3 | 6 | 7 |\n' +
        '| 6 | even | 12 | 7 |\n\n' +
        'It prints $12 - 7 = 5$.',
      whyWrong: [
        null,
        'This ignores the nested `if` and adds `i` for every odd value, so $b = 1 + 3 + 5 = 9$ and $12 - 9 = 3$.',
        'This is the final value of `a`. The code prints `a - b`.',
        'A `for` loop runs a fixed number of times, here 6, so it always ends.',
      ],
      keyIdea: 'With a nested `if`, follow one branch at a time and update only the variable that branch changes.',
    },
    check: {
      optionValues: [5, 3, 12, 'Infinite loop'],
      compute: () => {
        let a = 0;
        let b = 0;
        for (let i = 1; i <= 6; i++) {
          if (i % 2 === 0) a += i;
          else if (i > 3) b += i;
          else b += 1;
        }
        return a - b;
      },
    },
  },
  {
    id: 'tracing-pseudocode-029',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 507',
        's = 0',
        'while (n > 0)',
        '   s = s + mod(n,10) // mod is the modulus operator',
        '   n = div(n,10) // div is integer division',
        'end while',
        'print(s)',
      ),
    },
    options: ['12', '7', '705', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`mod(n,10)` is the last digit of `n`, and `div(n,10)` removes it.\n\n' +
        '| `n` | `mod(n,10)` | `s` |\n|---|---|---|\n' +
        '| 507 | 7 | 7 |\n' +
        '| 50 | 0 | 7 |\n' +
        '| 5 | 5 | 12 |\n\n' +
        'Now $n = 0$, so the loop stops. It prints the digit sum, 12.',
      whyWrong: [
        null,
        'This stops at the digit 0 in the middle. The loop tests `n`, which is 50 at that point, not the digit.',
        'This reverses the digits. That would need `s * 10` in the update, but this code only adds each digit.',
        '`div(n,10)` removes a digit on every pass, so `n` reaches 0 and the loop stops.',
      ],
      keyIdea: 'Repeated `mod(n,10)` and `div(n,10)` visit the digits of `n` from right to left.',
    },
    check: {
      optionValues: [12, 7, 705, 'Infinite loop'],
      compute: () => {
        let n = 507;
        let s = 0;
        let guard = 0;
        while (n > 0) {
          if (++guard > CAP) return 'Infinite loop';
          s += n % 10;
          n = Math.floor(n / 10);
        }
        return s;
      },
    },
  },
  {
    id: 'tracing-pseudocode-030',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'What is printed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 50',
        't = 0',
        'while (true)',
        '   t = t + mod(n,4) // mod is the modulus operator',
        '   n = n - 13',
        '   if n<0',
        '      break',
        '   end if',
        'end while',
        'print(t)',
      ),
    },
    options: ['3', '6', '8', 'Infinite loop'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| `n` | `mod(n,4)` | `t` |\n|---|---|---|\n' +
        '| 50 | 2 | 2 |\n' +
        '| 37 | 1 | 3 |\n' +
        '| 24 | 0 | 3 |\n' +
        '| 11 | 3 | 6 |\n\n' +
        'After the last row `n` becomes $-2$, so `n<0` is true, the loop breaks and it prints 6.',
      whyWrong: [
        'This stops one pass early, leaving out the pass with $n = 11$, which adds 3. $n = 11$ is not below 0.',
        null,
        'This runs one extra pass with $n = -2$, adding $\\text{mod}(-2, 4) = 2$. The `break` happens straight after `n` becomes negative.',
        '`n` falls by 13 on every pass, so it becomes negative and the `break` runs.',
      ],
      keyIdea: 'Keep one row per pass: the value of `n` at the start of the pass, its remainder and the running total.',
    },
    check: {
      optionValues: [3, 6, 8, 'Infinite loop'],
      compute: () => {
        let n = 50;
        let t = 0;
        for (let pass = 0; pass < CAP; pass++) {
          t += mod(n, 4);
          n -= 13;
          if (n < 0) return t;
        }
        return 'Infinite loop';
      },
    },
  },
];
