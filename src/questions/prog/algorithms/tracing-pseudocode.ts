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
      asking: 'What are `a` and `b` after these three calculations?',
      solution:
        'Each line works out the right side with the newest values, then stores the answer in the variable on the left. `print(a, b)` shows `a`, then a space, then `b`.\n\n' +
        'Trace every line:\n\n| Line | Code | Working | `a` | `b` |\n|---|---|---|---|---|\n| 1 | `a = 3` | | 3 | |\n| 2 | `b = 5` | | 3 | 5 |\n| 3 | `a = a + b` | $3 + 5$ | 8 | 5 |\n| 4 | `b = a - b` | $8 - 5$ | 8 | 3 |\n| 5 | `a = a - b` | $8 - 3$ | 5 | 3 |\n\n' +
        'Line 6 prints `a` and then `b`.',
      conclusion: 'The two numbers have swapped places, so the output is `5 3`.',
      whyWrong: [
        'This is what you get if you forget to store the new value of `b` on line 4: with `b` still 5, the last line gives $a = 8 - 5 = 3$. Every assignment really does change the variable.',
        'This stops one line early: it misses the final line `a = a - b`, which changes `a` from 8 to 5.',
        null,
        'This uses the **original** value $a = 3$ on line 4, giving $b = 3 - 5 = -2$, and then the last line gives $a = 8 - (-2) = 10$. Line 4 must use the updated value $a = 8$: always use the newest value in the trace table.',
      ],
      keyIdea: 'For a list of assignments, use a table with one row per line and one column per variable. Change only the variable on the left of `=`, and carry every other value down unchanged.',
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
      asking: 'How many times does the computer print `*`?',
      solution:
        '`k = 5` means the counting starts at 5.\n\n' +
        '`to 14` means it keeps going up to 14, and 14 itself is included.\n\n' +
        'So `k` takes these values, one at a time: 5, 6, 7, 8, 9, 10, 11, 12, 13, 14.\n\n' +
        'The line `print("*")` runs once for each value. Counting the values gives 10, so it runs 10 times.',
      conclusion: 'Each pass prints one star and there are 10 passes, so the answer is 10.',
      whyWrong: [
        null,
        'This is the fencepost error: $14 - 5 = 9$ counts the gaps between the values, not the values themselves. You must add 1 because both 5 and 14 are included.',
        'This counts as if the loop started at 1 (from 1 to 14). The loop starts at 5, so the values 1 to 4 are not used.',
        'This counts every value from 0 to 14. The loop starts at 5, not 0.',
      ],
      keyIdea: 'When a loop counts from one number to another and includes both ends, use: repetitions = end $-$ start $+ 1$. Here that is $14 - 5 + 1 = 10$.',
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
      asking: 'Which branch runs when `x` is 17, and what does it turn `x` into?',
      solution:
        '`mod(x,2)` is the remainder after dividing by 2, which tells you even or odd. 2 fits into 17 eight times, making 16, and $17 - 16 = 1$. So `mod(17,2)` is 1.\n\n' +
        'Line 2 asks whether that remainder equals 0. 1 is not 0, so the test is false. Line 3 is skipped and the `else` block on line 5 runs.\n\n' +
        'Line 5 works out `3 * x + 1`. Multiply first: $3 \\times 17 = 51$. Then add: $51 + 1 = 52$. That goes in `x`, and line 7 prints it.',
      conclusion: '17 is odd, so the `else` branch runs and `x` becomes 52. The answer is 52.',
      whyWrong: [
        'This runs the wrong branch: `div(17,2)` is 8, but that line only runs when `mod(x,2) == 0`. Since `mod(17,2)` is 1, the `else` branch runs instead.',
        null,
        'This adds before multiplying, working out $3 \\times (17 + 1) = 54$. Without brackets, the multiplication is done first: $3 \\times 17 + 1 = 52$.',
        'This runs the wrong branch **and** uses ordinary division ($17 \\div 2 = 8.5$). The odd branch runs, and `div` would give a whole number anyway.',
      ],
      keyIdea: 'Spot `mod(x,2) == 0` as an even test. Work out the test first and follow only the branch it selects. In the chosen line, multiply before adding.',
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
      asking: 'What is left over when 17 is divided by 5?',
      solution:
        '`mod(a,b)` gives the **remainder**: what is left over after taking as many whole `b`s as you can out of `a`.\n\n' +
        'Count up in fives: 5, 10, 15. The next one, 20, is too big. So we can take out 15.\n\n' +
        'What is left is $17 - 15 = 2$.',
      conclusion: 'Taking 15 out of 17 leaves 2, so `mod(17,5)` is 2.',
      whyWrong: [
        null,
        'This is the whole-number quotient, which is `div(17,5)`. `mod` gives the remainder.',
        'This is $17 - 5$, which subtracts once. The remainder comes from taking out every whole 5.',
        'This is the ordinary division $17 \\div 5$. `mod` gives the remainder, which is a whole number here.',
      ],
      keyIdea: 'To work out `mod(a,b)`, find the biggest multiple of `b` that fits in `a`, then subtract it from `a`. What remains is the answer, and it is always smaller than `b`.',
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
      asking: 'How many whole times does 5 fit into 17?',
      solution:
        '`div(a,b)` is integer division: how many whole times `b` fits into `a`. Any leftover is ignored.\n\n' +
        'Count up in fives: $5 \\times 1 = 5$, $5 \\times 2 = 10$, $5 \\times 3 = 15$. The next one, $5 \\times 4 = 20$, is too big.\n\n' +
        'So 5 fits into 17 three whole times, which gives 3.',
      conclusion: 'Three fives fit into 17, with 2 left over that `div` ignores, so `div(17,5)` is 3.',
      whyWrong: [
        'This is the remainder, `mod(17,5)`. `div` gives the quotient.',
        'This rounds up. Integer division rounds down.',
        null,
        'This is ordinary division. `div` keeps only the whole-number part.',
      ],
      keyIdea: 'To work out `div(a,b)`, do the ordinary division and cut off the decimal part, with no rounding up: $17 \\div 5 = 3.4$ becomes 3. For `mod`, take the leftover instead.',
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
      asking: 'What happens at the moment a loop reaches `break`?',
      solution:
        'A loop normally repeats its body. `break` stops that at once: the remaining lines of the body are skipped, and no more passes happen.\n\n' +
        'The computer then moves to the first line after the loop and carries on from there. So `break` finishes only the loop, and the program keeps going.',
      conclusion: 'The loop is over straight away and the program continues below it, so the answer is: Ends the loop at once.',
      whyWrong: [
        'Skipping to the next pass would keep the loop running. `break` leaves the loop altogether.',
        null,
        'The program carries on with the line after the loop, so only the loop ends.',
        'Nothing goes back to the start. Execution continues after the loop.',
      ],
      keyIdea: 'When tracing, treat `break` as a jump to the line just below `end for` or `end while`. Finish your table at that pass, then keep going with the code below.',
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
      asking: 'How do you write the first item of an array whose positions start at 1?',
      solution:
        'An **array** is a numbered list of items, and `A[k]` means the item at position `k`.\n\n' +
        '"Indexed from 1" means the numbering starts at 1. So the first item has position 1, and we write it as `A[1]`.',
      conclusion: 'When numbering starts at 1, the first item is at position 1, so the answer is `A[1]`.',
      whyWrong: [
        'This is the first item only when arrays are indexed from 0. Here index 0 does not exist.',
        null,
        'This is the **last** item of the array.',
        'This is the second item of the array.',
      ],
      keyIdea: 'Draw the array with its position numbers underneath. Indexed from 1, the first item is `A[1]` and the last is `A[length(A)]`. Indexed from 0, those become `A[0]` and `A[length(A) - 1]`.',
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
      asking: 'How long does a `while (true)` loop keep going if nothing inside it can stop it?',
      solution:
        'A `while` loop runs its body again whenever its condition is true. Here the condition is the word `true` itself, which can\'t change.\n\n' +
        'The other way out of a loop is `break`, and this body doesn\'t have one.\n\n' +
        'So every check passes, and after each pass the next one starts. There is no way for it to finish.',
      conclusion: 'With a condition that is always true and no `break`, the loop has no exit: It never stops.',
      whyWrong: [
        'The condition is true at the start, so the body does run.',
        'After the first pass the condition is checked again and is still true, so the loop continues.',
        'Nothing changes the condition after any number of passes, so a second pass is followed by a third.',
        null,
      ],
      keyIdea: 'To decide whether a loop can end, list its exits. A `while` has two: its condition becoming false, and a `break`. `while (true)` has only `break`, so without one the loop never ends.',
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
      asking: 'What is the sum of `2 * i` for `i` from 1 to 4?',
      solution:
        '`for i = 1 to 4` runs the body with `i` = 1, 2, 3, 4. The value 4 is included.\n\n' +
        '`total` starts at 0. `2 * i` means 2 times `i`, and line 3 adds that to the old total.\n\n' +
        'Trace it:\n\n| `i` | `2 * i` | `total` becomes |\n|---|---|---|\n| 1 | 2 | 2 |\n| 2 | 4 | 6 |\n| 3 | 6 | 12 |\n| 4 | 8 | 20 |\n\n' +
        'Line 5 prints `total`, which is 20.',
      conclusion: 'Adding $2 + 4 + 6 + 8$ gives 20, so the answer is 20.',
      whyWrong: [
        'This adds `i` instead of `2 * i`: $1 + 2 + 3 + 4 = 10$. Each pass adds **double** the value of `i`.',
        'This keeps only the last value of `2 * i`, as if the line were `total = 2 * i`. Because the line says `total = total + ...`, the old total is kept and added to.',
        'This stops after `i = 3` ($2 + 4 + 6 = 12$), treating `to 4` as if 4 were excluded. In this pseudocode `for i = 1 to 4` includes 4.',
        null,
      ],
      keyIdea: 'For `total = total + something` in a loop, make a column for the amount added and one for the running total. Use one row per pass, and include the last value of the counter.',
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
      asking: 'What are `count` and `n` when `n` first drops to 0 or below?',
      solution:
        'The loop checks `n > 0` at the top of each pass. Each pass takes 2 off `n`, then adds 1 to `count`.\n\n' +
        'Trace it:\n\n| Pass | `n` at the check | `n > 0`? | `n` becomes | `count` |\n|---|---|---|---|---|\n| 1 | 5 | yes | 3 | 1 |\n| 2 | 3 | yes | 1 | 2 |\n| 3 | 1 | yes | $-1$ | 3 |\n\n' +
        '`-1 > 0` is false, so line 7 prints `count` and `n`.',
      conclusion: 'The loop makes 3 passes and leaves `n` at $-1$, so the output is `3 -1`.',
      whyWrong: [
        null,
        'This stops when `n` reaches 1, as if the condition were `n > 1`. But $1 > 0$ is true, so the loop runs one more time.',
        'This assumes `n` lands exactly on 0. Starting at 5 and subtracting 2 gives 3, 1, $-1$: the odd numbers skip over 0.',
        'This prints the value of `n` from before the last subtraction. The final pass changes `n` from 1 to $-1$ before the loop ends.',
      ],
      keyIdea: 'Starting at an odd number and subtracting 2 skips 0, so `n` ends below it. After a `while` loop, the variable holds the first value that failed the check, not the last one that passed.',
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
      asking: 'Which `while` loop multiplies `p` by exactly 2, 3, 4, 5 and 6?',
      solution:
        'The `for` loop uses `k` = 2, 3, 4, 5, 6. Both ends are included, so it multiplies `p` by all five numbers.\n\n' +
        'A `while` loop needs a condition that is true for `k` = 6 and false for `k` = 7. That condition is `k <= 6`, because `k < 6` would stop before using 6.\n\n' +
        'A `while` loop doesn\'t change `k` by itself, so the body needs the line `k = k + 1`. Without it, the loop never ends.\n\n' +
        'That update must come **after** the multiplication. If it came first, `p` would be multiplied by 3 first, missing the 2, and by 7 at the end. So the update goes last.',
      conclusion: 'It must test `k <= 6` and update `k` after using it, so the answer is `while (k <= 6)`, with `k = k + 1` last in the body.',
      whyWrong: [
        '`k < 6` is false when $k = 6$, so 6 is never multiplied in and it prints 120. The `for` loop includes 6, so the condition must be `k <= 6`.',
        'Without an update `k` never changes, so `k <= 6` stays true for ever and the loop never ends.',
        null,
        'This updates `k` before using it, so the first multiplication is by 3 and the last is by 7, giving 2520. The update must come after the work in the body.',
      ],
      keyIdea: 'To rewrite `for k = a to b` as a `while`: set `k = a` before the loop, use `while (k <= b)`, and make `k = k + 1` the last line of the body.',
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
      asking: 'Why is the total 4 short, and which one change puts that right?',
      solution:
        'Arrays are indexed from 1, so the items are `A[1]` = 4, `A[2]` = 7, `A[3]` = 1 and `A[4]` = 9. Together they make 21.\n\n' +
        'Trace the loop as written. `i` starts at 2 on line 3, so it reads `A[2]`, `A[3]` and `A[4]`. That gives $7 + 1 + 9 = 17$.\n\n' +
        'The total is short by $21 - 17 = 4$, which is the value of `A[1]`. The loop never reads the first item, because `i` starts one place too late.\n\n' +
        'So `i` needs to start at 1. With line 3 as `i = 1`, the loop reads all four items and gives 21.',
      conclusion: 'Starting at position 1 brings in the missing 4, so the fix is: Change `i = 2` to `i = 1`.',
      whyWrong: [
        'This fixes the wrong end of the loop. `i` would reach 5 and the code would read `A[5]`, which does not exist, while `A[1]` is still skipped.',
        null,
        'For whole numbers, `i < 5` and `i <= 4` are the same test, so the loop runs exactly as before and still prints 17.',
        'Updating `i` before using it moves every read one place further on: it skips `A[2]` too and then reads past the end of the array.',
      ],
      keyIdea: 'To debug a loop, compare what it produced with what it should produce. The difference tells you which item was missed or repeated. Then look at the start value, the end test and the update order.',
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
      asking: 'Does `x` ever get down to 1, and if it does, how many passes does that take?',
      solution:
        'The loop stops only when `x` is 1 or less, so `x` has to keep falling. `x` changes only on line 5, which is inside the `if`.\n\n' +
        '`mod(x,2)` is the remainder, what is left over after dividing by 2. A remainder of 0 means `x` is even. `div(x,2)` halves `x` and drops any decimal part. So only even numbers get halved here.\n\n' +
        'Trace it:\n\n| Pass | `x` at start | Even? | `x` becomes | `count` |\n|---|---|---|---|---|\n| 1 | 50 | yes | 25 | 1 |\n| 2 | 25 | no | 25 | 2 |\n| 3 | 25 | no | 25 | 3 |\n\n' +
        '25 is odd, so the `if` is skipped and `x` never changes again. `25 > 1` stays true for ever, and line 9 is never reached.',
      conclusion: '`x` gets stuck at 25 while `count` keeps climbing, so the answer is: Infinite loop.',
      whyWrong: [
        'This assumes `x` keeps halving: 50, 25, 12, 6, 3, 1 (5 halvings). But 25 is odd, so the halving line is skipped and `x` never gets to 12.',
        'This counts 50, 25, 12, 6, 3, 1 as six steps, assuming `x` always halves. The halving only happens when `x` is even, and 25 is odd.',
        null,
        'This thinks the loop ends the moment the `if` test fails (at the start of pass 2, before `count` goes up again). The loop only ends when its own condition `x > 1` is false, and $25 > 1$ is still true.',
      ],
      keyIdea: 'When the line that moves the loop variable is inside an `if`, ask what happens if the test is false. If the variable can reach a value that fails the test, it sticks there and the loop never ends.',
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
      asking: 'What does `p` end up pointing to in the array?',
      solution:
        '`p` holds a **position** in the array, and `A[p]` is the value stored there. `p` starts at 1, the first position.\n\n' +
        'The loop looks at positions 2 onwards. Line 4 asks whether `A[i]` is bigger than the value at `p`. If so, line 5 moves `p` to position `i`. So `p` always marks the biggest value so far.\n\n' +
        'Try it on `A = [5, 9, 2, 9]`:\n\n| `i` | `A[i]` | `A[p]` | `A[i] > A[p]`? | `p` after this pass |\n|---|---|---|---|---|\n| 2 | 9 | 5 | yes | 2 |\n| 3 | 2 | 9 | no | 2 |\n| 4 | 9 | 9 | no | 2 |\n\n' +
        'The second 9 is only equal, so `p` stays at 2. Line 8 returns 2, which is a position, and it is the first place the largest value appears.',
      conclusion: 'The function returns `p`, a position, and `>` keeps the earlier of two equal values. So the answer is: The first position of the largest value.',
      whyWrong: [
        'The function returns `p`, which is a position (index), not `A[p]`, the value stored there. For `[5, 9, 2, 9]` it returns 2, not 9.',
        null,
        'That would need `>=`. With strict `>`, an equal value later in the array does not update `p`, so the first occurrence is kept.',
        'The test `A[i] > A[p]` moves `p` to **bigger** items, so it tracks the largest value. Tracking the smallest would need `<`.',
      ],
      keyIdea: 'For a "mystery" function, trace it on a small array with a repeated largest value. See what is returned (`p` or `A[p]`), and whether `>` or `>=` is used: `>` keeps the first match and `>=` the last.',
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
      asking: 'What number does `mystery` build from the digits of 4072?',
      solution:
        '`mod(n,10)` gives the last digit of `n`, and `div(n,10)` removes that digit. For example, `mod(4072,10)` is 2 and `div(4072,10)` is 407.\n\n' +
        'Line 4 builds `r`. `r * 10` shifts the digits of `r` one place left, leaving a 0 at the end. Then the new digit fills that space.\n\n' +
        'Trace it:\n\n| Pass | `n` at start | `mod(n,10)` | Working for `r` | `r` becomes | `n` becomes |\n|---|---|---|---|---|---|\n| 1 | 4072 | 2 | `0 * 10 + 2` | 2 | 407 |\n| 2 | 407 | 7 | `2 * 10 + 7` | 27 | 40 |\n| 3 | 40 | 0 | `27 * 10 + 0` | 270 | 4 |\n| 4 | 4 | 4 | `270 * 10 + 4` | 2704 | 0 |\n\n' +
        '`n` is now 0, so `r` is returned and printed.',
      conclusion: 'The digits come off the end of 4072 and build up in reverse, including the 0, so the answer is 2704.',
      whyWrong: [
        null,
        'This drops the zero digit. Even when the digit is 0, `r` is still multiplied by 10 (270), which keeps a place for the 0.',
        'This is the sum of the digits ($4 + 7 + 2 = 13$; the 0 adds nothing). It forgets the `r * 10`, which shifts the digits along instead of adding them.',
        'This multiplies by 10 after adding the digit, as if the line were `r = (r + mod(n,10)) * 10`, which leaves an extra 0 on the end.',
      ],
      keyIdea: '`mod(n,10)` with `div(n,10)` in a loop takes a number apart from the right. If the update is `r = r * 10 + digit`, the digits are reversed. If it is `s = s + digit`, they are added.',
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
      asking: 'How many times does `count = count + 1` run when the inner loop starts at `i`?',
      solution:
        'The `count` line is inside both loops, so it runs once for each inner pass. `print` is outside both loops, so it runs once at the end.\n\n' +
        'The inner loop, `for j = i to 5`, starts at the current `i`, and both ends are included. So it runs $5 - i + 1$ times. When `i` is 5, `j` goes from 5 to 5, which is still 1 pass.\n\n' +
        'Count them:\n\n| `i` | Values of `j` | Inner passes |\n|---|---|---|\n| 1 | 1 to 5 | 5 |\n| 2 | 2 to 5 | 4 |\n| 3 | 3 to 5 | 3 |\n| 4 | 4 to 5 | 2 |\n| 5 | 5 to 5 | 1 |\n\n' +
        'Add the column: $5 + 4 + 3 + 2 + 1 = 15$.',
      conclusion: 'The inner passes add up to 15, and `count` goes up once per inner pass, so the answer is 15.',
      whyWrong: [
        'This treats the inner loop as always running 5 times ($5 \\times 5 = 25$). It starts at `j = i`, so it gets shorter each time.',
        'This starts the inner loop at `i + 1` instead of `i` ($4 + 3 + 2 + 1 = 10$, with no pass at all when $i = 5$). `for j = i to 5` includes `j = i` itself.',
        'This forgets the last pass `i = 5`, where `j` goes from 5 to 5. That is still one pass, because both ends are included.',
        null,
      ],
      keyIdea: 'If the inner loop\'s start or end uses `i`, its length changes. Make a table of `i` and inner passes, then add. Here it is $1 + 2 + \\dots + n$, which equals $\\frac{n(n + 1)}{2}$, with $n$ the outer loop\'s end.',
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
      asking: 'What do the even numbers at positions 1, 3 and 5 of `A` add up to?',
      solution:
        '`i` starts at 1 and line 8 adds 2 on each pass. So the loop only visits positions 1, 3 and 5. The next one, 7, is past the end, because `length(A)` is 5.\n\n' +
        '`mod(A[i],2)` is the remainder, what is left over after dividing the item by 2. For example, `mod(3,2)` is 1. It is 0 when the item is even, so line 5 lets only even items through to line 6.\n\n' +
        'Trace it:\n\n| `i` | `A[i]` | Even? | `best` |\n|---|---|---|---|\n| 1 | 3 | no | 0 |\n| 3 | 2 | yes | 2 |\n| 5 | 4 | yes | 6 |\n\n' +
        '`i` becomes 7, so the loop stops and line 10 prints.',
      conclusion: 'Only `A[3]` = 2 and `A[5]` = 4 are visited and even, so `best` is 6 and the answer is 6.',
      whyWrong: [
        'This adds every even number in the array ($8 + 2 + 4$), ignoring `i = i + 2`. The 8 is at position 2, which is never visited.',
        'This adds every visited item ($3 + 2 + 4$), ignoring the test `mod(A[i],2) == 0`. The 3 is odd, so it is not added.',
        null,
        'This starts from the second item, as if `i` started at 2, so it visits 8 and 7 and adds only the 8. The first item is `A[1]`, and the loop starts there.',
      ],
      keyIdea: 'Two filters are at work here: the step in `i` decides which positions are visited, and the `if` decides which values count. Apply the step first, then the test, with a column for each.',
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
      asking: 'What is in `a` and in `passes` when `b` reaches 0?',
      solution:
        '`mod(a,b)` is the remainder after dividing `a` by `b`. For example, 105 fits into 252 twice, making 210, and $252 - 210 = 42$. So `mod(252,105)` is 42.\n\n' +
        'Each pass finds the remainder, moves `b` into `a`, and puts the remainder into `b`. Then `passes` goes up by 1. `r` holds the remainder because line 6 is about to change `a`.\n\n' +
        'The loop continues until `b` is 0:\n\n| Pass | `a` at start | `b` at start | `r` | `a` becomes | `b` becomes | `passes` |\n|---|---|---|---|---|---|---|\n| 1 | 252 | 105 | 42 | 105 | 42 | 1 |\n| 2 | 105 | 42 | 21 | 42 | 21 | 2 |\n| 3 | 42 | 21 | 0 | 21 | 0 | 3 |\n\n' +
        '`b` is now 0, so line 10 prints `a`, then `passes`.',
      conclusion: 'The loop stops with `a` at 21 after 3 passes, so the output is `21 3`.',
      whyWrong: [
        null,
        'This prints the final value of `b` (0) instead of `a`. In the last pass `a` takes the old `b`, which is 21.',
        'This stops as soon as the remainder 21 appears, after 2 passes. The loop only stops when `b` itself becomes 0, which needs a third pass.',
        'The value 21 is right, but this does not count the pass that finds the remainder 0. At the top of that third pass `b` is still 21 (not 0), so the pass runs and adds 1 to `passes`.',
      ],
      keyIdea: 'Euclid\'s algorithm finds the biggest number that divides both `a` and `b`. Keep a row per pass: remainder, then shift. When `b` hits 0, the result is in `a`. Count the pass that produces the 0.',
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
      asking: 'What is in `b` after five rounds of adding the last two numbers?',
      solution:
        '`t` is a temporary helper. It holds the sum while `a` and `b` move along, so `a = b` doesn\'t lose anything. The order of lines 4, 5 and 6 matters.\n\n' +
        'Each pass works out $a + b$, then `a` takes the old `b`, then `b` takes the sum. So each new number is the sum of the two before it.\n\n' +
        'Trace it:\n\n| `i` | `t = a + b` | `a` becomes | `b` becomes |\n|---|---|---|---|\n| 1 | $1 + 1 = 2$ | 1 | 2 |\n| 2 | $1 + 2 = 3$ | 2 | 3 |\n| 3 | $2 + 3 = 5$ | 3 | 5 |\n| 4 | $3 + 5 = 8$ | 5 | 8 |\n| 5 | $5 + 8 = 13$ | 8 | 13 |\n\n' +
        'Line 8 prints `b`, which is 13.',
      conclusion: 'After 5 passes `b` holds 13, so the answer is 13.',
      whyWrong: [
        'This stops after 4 passes. `for i = 1 to 5` runs 5 times, and the fifth pass changes `b` from 8 to 13.',
        null,
        'This does one pass too many (6 passes). Count the rows: `i` = 1, 2, 3, 4, 5 is exactly 5 passes.',
        'This skips the temporary variable: it does `a = b` first and then `b = a + b`, which now uses the **new** `a`, so `b` just doubles (2, 4, 8, 16, 32).',
      ],
      keyIdea: 'Spot `t = a + b`, `a = b`, `b = t` as the Fibonacci pattern, where each number is the sum of the previous two. Trace it with one row per pass, updating in the code\'s order.',
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
      asking: 'What do the values of `x` add up to, while `x` is still below 40?',
      solution:
        'The check `x < 40` is at the top of each pass. A pass adds `x` to `y` first, and then multiplies `x` by 3.\n\n' +
        'Trace it:\n\n| Pass | `x` at the check | `x < 40`? | `y` becomes | `x` becomes |\n|---|---|---|---|---|\n| 1 | 2 | yes | 2 | 6 |\n| 2 | 6 | yes | 8 | 18 |\n| 3 | 18 | yes | 26 | 54 |\n\n' +
        '`54 < 40` is false, so line 7 prints `y`.',
      conclusion: '18 still passes the check, so it gets added, and 54 doesn\'t. $2 + 6 + 18$ gives 26, so the answer is 26.',
      whyWrong: [
        'This tests the value `x` will have **after** the pass instead of the value it has at the top. At the start of pass 3, $x = 18$ and $18 < 40$ is true, so pass 3 runs in full.',
        'This runs a fourth pass with $x = 54$. The condition is re-checked before every pass, and $54 < 40$ is false.',
        null,
        '`x` grows on every pass, so it passes 40 and the loop stops.',
      ],
      keyIdea: 'The check uses the value of the variable at the top of the pass. Put that value in your table first, test it, and only then run the body. The value after the body gets tested on the next row.',
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
      asking: 'What number does the loop build from 13, one remainder at a time?',
      solution:
        '`mod(n,2)` is the remainder, what is left over after dividing by 2, so it is 0 or 1. `div(n,2)` halves `n` and drops any decimal part. For example, `mod(13,2)` is 1 and `div(13,2)` is 6.\n\n' +
        '`p` is a place value: 1, then 10, then 100, and so on. Line 5 multiplies the remainder by `p` and adds it to `r`, so each new remainder goes one place further left.\n\n' +
        'Trace it:\n\n| Pass | `n` at start | `mod(n,2)` | `p` | `r` becomes | `n` becomes |\n|---|---|---|---|---|---|\n| 1 | 13 | 1 | 1 | $0 + 1 \\times 1 = 1$ | 6 |\n| 2 | 6 | 0 | 10 | $1 + 10 \\times 0 = 1$ | 3 |\n| 3 | 3 | 1 | 100 | $1 + 100 \\times 1 = 101$ | 1 |\n| 4 | 1 | 1 | 1000 | $101 + 1000 \\times 1 = 1101$ | 0 |\n\n' +
        '`n` is now 0, so the loop stops and line 9 prints `r`.',
      conclusion: 'The remainders 1, 0, 1, 1 fill the places from right to left, so `r` is 1101. That is 13 written in binary, and the answer is 1101.',
      whyWrong: [
        null,
        'This puts each new digit on the **right** instead of the left, which writes the binary digits in reverse order.',
        'This stops when `n` is 1, as if the condition were `n > 1`. But $1 > 0$ is true, so there is one more pass, which adds the leading 1.',
        '`div(n,2)` shrinks `n` on every pass until it reaches 0, so the loop stops.',
      ],
      keyIdea: 'Repeatedly taking `mod(n,2)` and `div(n,2)` gives the binary digits of `n`, with the last digit first. If a place value `p` is multiplied by 10 each pass, each new digit goes on the left.',
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
      asking: 'How many times in total does the inner line run as `i` and `j` double up to 16?',
      solution:
        'The outer loop doubles `i`, so `i` takes the values 1, 2, 4, 8 and 16. The check uses `<=`, so 16 counts. The next value, 32, fails.\n\n' +
        'For each `i`, `j` starts at `i` and doubles up to 16. Line 6 runs once per inner pass.\n\n' +
        'Count the inner passes:\n\n| `i` | Values of `j` | Inner passes |\n|---|---|---|\n| 1 | 1, 2, 4, 8, 16 | 5 |\n| 2 | 2, 4, 8, 16 | 4 |\n| 4 | 4, 8, 16 | 3 |\n| 8 | 8, 16 | 2 |\n| 16 | 16 | 1 |\n\n' +
        'Add the column: $5 + 4 + 3 + 2 + 1 = 15$.',
      conclusion: 'The inner line runs 15 times in all, so the answer is 15.',
      whyWrong: [
        'This assumes the inner loop always does 5 passes ($5 \\times 5 = 25$). It starts at `j = i`, not at 1, so it gets shorter as `i` grows.',
        null,
        'This treats `<= 16` as `< 16`, so 16 is never used: $4 + 3 + 2 + 1 = 10$. Since $16 \\le 16$ is true, 16 is included.',
        'This counts only the passes of the outer loop (5). The line is inside the inner loop, which runs several times per outer pass.',
      ],
      keyIdea: 'For nested loops that double, list the values the outer variable takes, then the inner variable\'s values for each. Count and add. The inner start often depends on the outer variable, so lengths change.',
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
      asking: 'What number is in `t` when the loop finishes and it gets printed?',
      solution:
        '`mod(n,6)` means the remainder when `n` is divided by 6. For example, $40 \\div 6$ is 6 remainder 4, so `mod(40,6)` is 4.\n\n' +
        '`while (true)` never stops by itself. The only way out is the `break` on line 7, which runs once `n` is below 0.\n\n' +
        'Each pass adds the remainder to `t`, then takes 11 off `n`. Here is every pass:\n\n| Pass | `n` at the start | `mod(n,6)` | `t` becomes | `n` becomes |\n|---|---|---|---|---|\n| 1 | 40 | 4 | 4 | 29 |\n| 2 | 29 | 5 | 9 | 18 |\n| 3 | 18 | 0 | 9 | 7 |\n| 4 | 7 | 1 | 10 | $-4$ |\n\n' +
        'After pass 4, `n` is $-4$. That is below 0, so `break` runs and the loop ends.\n\n' +
        'The next line is `print(t)`, and `t` holds 10.',
      conclusion: 'The loop stops after 4 passes with `t` at 10, so the answer is 10.',
      whyWrong: [
        'This stops one pass early, leaving out the pass with $n = 7$. At that point $n = 7$ is not below 0, so the loop has not broken yet.',
        null,
        'This runs one more pass with $n = -4$, adding 4 as its remainder. The `break` happens as soon as `n` falls below 0, so that pass never runs.',
        '`n` falls by 11 on every pass, so it becomes negative and the `break` runs.',
      ],
      keyIdea: 'For a `while (true)` loop, draw one row per pass with a column for each variable. Update them in the same order as the code, and test the `break` condition straight after the line that changes it.',
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
      asking: 'What total is in `t` by the time `n` goes below 0?',
      solution:
        '`mod(n,4)` is the remainder after dividing `n` by 4. For example, $33 = 8 \\times 4 + 1$, so `mod(33,4)` is 1.\n\n' +
        '`while (true)` only ends through the `break` on line 7, which runs once `n` is below 0. Each pass adds the remainder to `t`, takes 7 off `n`, then tests `n`.\n\n' +
        'Trace it:\n\n| Pass | `n` at start | `mod(n,4)` | `t` becomes | `n` becomes |\n|---|---|---|---|---|\n| 1 | 33 | 1 | 1 | 26 |\n| 2 | 26 | 2 | 3 | 19 |\n| 3 | 19 | 3 | 6 | 12 |\n| 4 | 12 | 0 | 6 | 5 |\n| 5 | 5 | 1 | 7 | $-2$ |\n\n' +
        '$-2$ is below 0, so `break` runs and line 10 prints.',
      conclusion: 'The loop breaks after pass 5 with `t` at 7, so the answer is 7.',
      whyWrong: [
        'This stops one pass early, leaving out the pass with $n = 5$, which adds 1. $n = 5$ is not below 0.',
        null,
        'This runs one extra pass with $n = -2$, adding $\\text{mod}(-2, 4) = 2$. The `break` happens straight after `n` becomes negative.',
        '`n` falls by 7 on every pass, so it becomes negative and the `break` runs.',
      ],
      keyIdea: 'For `while (true)`, use one row per pass, in the code\'s order. The test comes after `n` changes, so a value that triggers `break` never gets a remainder added.',
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
      asking: 'How many times is 6 taken off 30 before `n` is 0 or less?',
      solution:
        '`while (true)` only ends through the `break` on line 7. That runs once `n` is 0 or less, because of `<=`. Each pass adds 1 to `c`, takes 6 off `n`, then tests `n`.\n\n' +
        'Trace it:\n\n| Pass | `c` becomes | `n` becomes | `n <= 0`? |\n|---|---|---|---|\n| 1 | 1 | 24 | no |\n| 2 | 2 | 18 | no |\n| 3 | 3 | 12 | no |\n| 4 | 4 | 6 | no |\n| 5 | 5 | 0 | yes |\n\n' +
        'Line 10 then prints `c`, which holds 5.',
      conclusion: '`n` lands exactly on 0, and `<=` includes 0, so the loop ends with `c` at 5. The answer is 5.',
      whyWrong: [
        'This stops when $n = 6$, before `n` has reached 0. $6 \\le 0$ is false, so one more pass runs.',
        null,
        'This reads the test as `n<0`, which would need one more pass to take `n` below 0. With `n<=0` the loop stops at $n = 0$.',
        '`n` falls by 6 on every pass, so it reaches 0 and the `break` runs.',
      ],
      keyIdea: 'When `n` can land exactly on 0, the difference between `n<0` and `n<=0` matters: `<=` stops at 0, while `<` runs one more pass. Look closely at the row where `n` reaches 0.',
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
      asking: 'What total is in `t` by the time `n` falls to 0 or below?',
      solution:
        '`mod(n,5)` is the remainder after dividing `n` by 5. For example, $24 = 4 \\times 5 + 4$, so `mod(24,5)` is 4.\n\n' +
        'The only exit is the `break` on line 7, which runs once `n` is 0 or less. Each pass adds the remainder to `t`, takes 8 off `n`, then tests `n`.\n\n' +
        'Trace it:\n\n| Pass | `n` at start | `mod(n,5)` | `t` becomes | `n` becomes | `n <= 0`? |\n|---|---|---|---|---|---|\n| 1 | 24 | 4 | 4 | 16 | no |\n| 2 | 16 | 1 | 5 | 8 | no |\n| 3 | 8 | 3 | 8 | 0 | yes |\n\n' +
        '`break` jumps to line 10, which prints `t`.',
      conclusion: 'The loop breaks after pass 3, when `n` hits 0, with `t` at 8. The answer is 8.',
      whyWrong: [
        'This reads the test backwards, as if the loop broke while `n` is still positive, so it stops after the first pass.',
        'This stops one pass early, leaving out the pass with $n = 8$. At that point $8 \\le 0$ is false, so the loop has not broken yet.',
        null,
        '`n` falls by 8 on every pass, so it reaches 0 and the `break` runs.',
      ],
      keyIdea: 'For a `while (true)` loop, draw a row per pass and test the `break` condition at the end of each row. Watch the case where `n` lands exactly on 0: `<=` breaks and `<` does not.',
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
      asking: 'Does `n` ever equal exactly 1, so that the `break` can run?',
      solution:
        '`while (true)` only ends through the `break` on line 7, and that needs `n` to be exactly 1, because of `==`.\n\n' +
        '`n` starts at 25 and falls by 5 on each pass: 20, 15, 10, 5, 0, $-5$, and so on.\n\n' +
        'Every value is a multiple of 5, and 1 isn\'t. `n` jumps from 5 to 0 and misses it. After that, `n` only moves further away.\n\n' +
        'So `n==1` is never true and `break` never runs. Line 4 keeps adding to `t` for ever, and line 10 is never reached.',
      conclusion: '`n` never equals 1, so there is no way out of the loop. The answer is: Infinite loop.',
      whyWrong: [
        'This treats `n==1` as `n<=1`, stopping when `n` reaches 0. The test asks for exactly 1, and `n` jumps past it.',
        'This stops once `n` reaches 5. The test asks for exactly 1, and 5 is not 1.',
        'This reads `n==1` as `n!=1`, so the loop breaks after the first pass.',
        null,
      ],
      keyIdea: 'When a `break` uses `==`, write down the values the variable can take. Starting at 25 and subtracting 5 gives only multiples of 5. If the target isn\'t among them, the loop never ends.',
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
      asking: 'Can `n` ever go below 0 when it starts at 12 and keeps growing?',
      solution:
        '`while (true)` only ends through the `break` on line 7, which needs `n` to be below 0.\n\n' +
        'Line 5 says `n = n + 3`, so `n` goes **up** on every pass: 15, 18, 21, 24, and so on.\n\n' +
        '`n` starts at 12 and only gets bigger, so it can never go below 0. The test `n<0` is false every time, `break` never runs, and `print(t)` is never reached.',
      conclusion: '`n` moves away from the `break` test on every pass, so the loop has no end. The answer is: Infinite loop.',
      whyWrong: [
        'This reads `n + 3` as `n - 3`, so `n` would fall to a negative value: $2 + 4 + 1 + 3 = 10$. The code adds 3, so `n` grows.',
        'This stops after the first pass, reading the test as if it were true at once. $15 < 0$ is false.',
        'This is the starting value of `t`. The `print` is never reached, so nothing is printed at all.',
        null,
      ],
      keyIdea: 'Compare the direction of the update with the exit test. To reach `n<0`, `n` must be falling. If it is rising or stays the same, the `break` can never run and the loop never ends.',
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
      asking: 'What is the sum of the remainders when 1, 2, and so on up to 7 are each divided by 3?',
      solution:
        '`mod(i,3)` is the remainder after dividing `i` by 3. For example, `mod(5,3)` is 2, because 3 fits into 5 once and leaves 2. For `mod(1,3)`, 3 doesn\'t fit at all, so the whole 1 is left over.\n\n' +
        'The loop runs for `i` = 1 to 7, and 7 is included. Each pass adds the remainder to `t`, which starts at 0:\n\n| `i` | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n|---|---|---|---|---|---|---|---|\n| `mod(i,3)` | 1 | 2 | 0 | 1 | 2 | 0 | 1 |\n| `t` | 1 | 3 | 3 | 4 | 6 | 6 | 7 |\n\n' +
        'Line 5 prints `t`, which is 7.',
      conclusion: 'The remainders add up to 7, so the answer is 7.',
      whyWrong: [
        null,
        'This stops at $i = 6$, treating `to 7` as if 7 were excluded. Both ends are included.',
        'This adds `i` itself ($1 + 2 + \\dots + 7$), ignoring the `mod`.',
        'A `for` loop runs a fixed number of times, here 7, so it always ends.',
      ],
      keyIdea: 'Remainders repeat in a cycle: `mod(i,3)` goes 1, 2, 0, 1, 2, 0, and so on. Write out the cycle, add one full round (3 here), and finish off the part round.',
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
      asking: 'What are `a` and `b` at the end of the loop, and what is `a - b`?',
      solution:
        '`mod(i,2)` is the remainder, what is left over after dividing by 2. For example, `mod(3,2)` is 1. A remainder of 0 means `i` is even, so even numbers go to line 5, which adds `i` to `a`.\n\n' +
        'Odd numbers go to the `else` on line 6, which has its own test. If `i > 3`, line 8 adds `i` to `b`. If not, line 10 adds just 1 to `b`.\n\n' +
        'Trace all six passes:\n\n| `i` | Even? | `i > 3`? | Line run | `a` | `b` |\n|---|---|---|---|---|---|\n| 1 | no | no | 10 | 0 | 1 |\n| 2 | yes | | 5 | 2 | 1 |\n| 3 | no | no | 10 | 2 | 2 |\n| 4 | yes | | 5 | 6 | 2 |\n| 5 | no | yes | 8 | 6 | 7 |\n| 6 | yes | | 5 | 12 | 7 |\n\n' +
        'Line 14 prints `a - b`: $12 - 7 = 5$.',
      conclusion: '`a` ends at 12 and `b` at 7, and $12 - 7 = 5$, so the answer is 5.',
      whyWrong: [
        null,
        'This ignores the nested `if` and adds `i` for every odd value, so $b = 1 + 3 + 5 = 9$ and $12 - 9 = 3$.',
        'This is the final value of `a`. The code prints `a - b`.',
        'A `for` loop runs a fixed number of times, here 6, so it always ends.',
      ],
      keyIdea: 'For nested `if`s in a loop, add a column for each test and one for which line ran. Keep the other variable\'s value unchanged in that row. Finish by working out what the `print` asks for.',
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
      asking: 'What do the digits of 507 add up to?',
      solution:
        '`mod(n,10)` gives the last digit of `n`. For example, $507 = 50 \\times 10 + 7$, so `mod(507,10)` is 7.\n\n' +
        '`div(n,10)` divides by 10 and drops the decimal part, which removes the last digit. So `div(507,10)` is 50.\n\n' +
        'The loop keeps going until no digits are left:\n\n| Pass | `n` at start | `mod(n,10)` | `s` becomes | `n` becomes |\n|---|---|---|---|---|\n| 1 | 507 | 7 | 7 | 50 |\n| 2 | 50 | 0 | 7 | 5 |\n| 3 | 5 | 5 | 12 | 0 |\n\n' +
        '`n` is now 0, so line 7 prints `s`.',
      conclusion: 'The digits 7, 0 and 5 add up to 12, so the answer is 12.',
      whyWrong: [
        null,
        'This stops at the digit 0 in the middle. The loop tests `n`, which is 50 at that point, not the digit.',
        'This reverses the digits. That would need `s * 10` in the update, but this code only adds each digit.',
        '`div(n,10)` removes a digit on every pass, so `n` reaches 0 and the loop stops.',
      ],
      keyIdea: 'Spot this pair: `mod(n,10)` takes the last digit and `div(n,10)` removes it. In a loop they visit every digit from the right. What the line does with the digit decides the result: `s + digit` adds the digits.',
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
      asking: 'What total is in `t` by the time `n` goes below 0?',
      solution:
        '`mod(n,4)` is the remainder after dividing `n` by 4. For example, $50 = 12 \\times 4 + 2$, so `mod(50,4)` is 2.\n\n' +
        'The only exit is the `break` on line 7, which runs once `n` is below 0. Each pass adds the remainder to `t`, takes 13 off `n`, then tests `n`.\n\n' +
        'Trace it:\n\n| Pass | `n` at start | `mod(n,4)` | `t` becomes | `n` becomes |\n|---|---|---|---|---|\n| 1 | 50 | 2 | 2 | 37 |\n| 2 | 37 | 1 | 3 | 24 |\n| 3 | 24 | 0 | 3 | 11 |\n| 4 | 11 | 3 | 6 | $-2$ |\n\n' +
        '$-2$ is below 0, so `break` runs and line 10 prints.',
      conclusion: 'The loop breaks after pass 4 with `t` at 6, so the answer is 6.',
      whyWrong: [
        'This stops one pass early, leaving out the pass with $n = 11$, which adds 3. $n = 11$ is not below 0.',
        null,
        'This runs one extra pass with $n = -2$, adding $\\text{mod}(-2, 4) = 2$. The `break` happens straight after `n` becomes negative.',
        '`n` falls by 13 on every pass, so it becomes negative and the `break` runs.',
      ],
      keyIdea: 'When a loop subtracts a fixed amount and adds a remainder, draw a row per pass: start value, remainder, new total, new value. The value that triggers `break` never starts a row of its own.',
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
