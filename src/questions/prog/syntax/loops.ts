import type { StaticQuestion } from '../../../types';

const L = (...lines: string[]) => lines.join('\n');

const INFINITE = 'Infinite loop';
const PRINTS = 'What does this pseudocode print?';
const BODY_RUNS = 'How many times does the loop body run?';
const CAP = 100000;

const mod = (a: number, b: number): number => a - b * Math.floor(a / b);

/** Values produced by Python's range(start, stop, step), re-implemented with a loop. */
function rangeVals(start: number, stop: number, step = 1): number[] {
  const out: number[] = [];
  for (let v = start; v < stop; v += step) out.push(v);
  return out;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'loops-001',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: L('total = 0', 'for i in range(2, 10, 3):', '    total = total + i', 'print(total)') },
    options: ['`15`', '`26`', '`18`', '`44`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do the values of `i` add up to?',
      solution:
        '`range(start, stop, step)` gives a run of values: begin at `start`, jump by `step` each time, and stop **before** reaching `stop`. The `stop` value itself is not included.\n\n' +
        'Here that means begin at 2 and jump by 3. We get 2, 5 and 8. The next would be 11, which is past the stop value 10, so the loop ends.\n\n' +
        'Each pass adds `i` to `total`, which starts at 0:\n\n| `i` | `total` becomes |\n|---|---|\n| 2 | $0 + 2 = 2$ |\n| 5 | $2 + 5 = 7$ |\n| 8 | $7 + 8 = 15$ |\n\n' +
        'Line 4 prints `total`, which is 15.',
      conclusion: 'The values 2, 5 and 8 add up to 15, so the answer is `15`.',
      whyWrong: [
        null,
        'This goes one step too far and also adds 11. The range stops before reaching 10.',
        'This starts at the step (3, 6, 9) instead of at the start value 2.',
        'This ignores the step and adds every whole number from 2 to 9.',
      ],
      keyIdea: 'For `range(a, b, c)`, write out the values: start at `a`, add `c`, and stop before `b`. If `c` is missing it is 1. Then add, count or print them as the code says.',
    },
    check: { optionValues: [15, 26, 18, 44], compute: () => rangeVals(2, 10, 3).reduce((s, v) => s + v, 0) },
    python: { stdout: '15\n' },
  },
  {
    id: 'loops-002',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'How many times is `hi` printed by this Python loop?',
    code: { lang: 'python', source: L('for i in range(4, 20):', '    print("hi")') },
    options: ['`17`', '`20`', '`15`', '`16`'],
    correctIndex: 3,
    markScheme: {
      asking: 'How many values does `range(4, 20)` give?',
      solution:
        '`range(4, 20)` starts at 4, goes up by 1 each time, and stops **before** 20. So 20 itself is not included.\n\n' +
        'So `i` takes the values 4, 5, 6, and so on up to 19. `print("hi")` runs once for each value.\n\n' +
        'To count them without listing them all, use stop minus start: $20 - 4 = 16$.',
      conclusion: 'The loop runs once for each value from 4 to 19, which makes 16 passes, so the answer is `16`.',
      whyWrong: [
        'This counts both ends, 4 **and** 20. But 20 is the stop value and is not included; the last value is 19.',
        'This reads only the stop value. The loop starts at 4, not at 0, so it runs fewer than 20 times.',
        'This removes one value too many, as if both the start and the stop were excluded. The start value 4 is included.',
        null,
      ],
      keyIdea: '`range(a, b)` runs exactly $b - a$ times, because `a` is included and `b` is not. Try a small case to confirm: `range(1, 4)` gives 1, 2, 3, which is $4 - 1 = 3$ values.',
    },
    check: { optionValues: [17, 20, 15, 16], compute: () => rangeVals(4, 20).length },
  },
  {
    id: 'loops-003',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print? Arrays are indexed from 1.',
    code: {
      lang: 'pseudocode',
      source: L('A = [3, 1, 4, 1, 5]', 'total = 0', 'for i = 1 to length(A)', '   total = total + A[i]', 'end for', 'print(total)'),
    },
    options: ['`14`', '`5`', '`11`', '`3 4 8 9 14`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do all the numbers in array `A` add up to?',
      solution:
        '`length(A)` is the number of items, which is 5. So line 3 makes `i` go from 1 to 5. `A[i]` means the item at position `i`.\n\n' +
        '`total` starts at 0. Line 4 adds the current item to it on each pass:\n\n| `i` | `A[i]` | `total` becomes |\n|---|---|---|\n| 1 | 3 | 3 |\n| 2 | 1 | 4 |\n| 3 | 4 | 8 |\n| 4 | 1 | 9 |\n| 5 | 5 | 14 |\n\n' +
        'Line 6 prints `total` once, after the loop.',
      conclusion: 'Adding every item gives 14, and the `print` sits after the loop so it runs once. The answer is `14`.',
      whyWrong: [
        null,
        'This is the last item only. That would happen with `total = A[i]`, which overwrites the total instead of adding to it.',
        'This skips the first item (3), as if the loop started at position 2. The loop starts at $i = 1$.',
        'These are the running totals. They would only all be printed if `print(total)` were inside the loop.',
      ],
      keyIdea: '`total = total + A[i]` inside a loop is a running total. See whether `print` is inside or after the loop: inside it prints every step, after it prints only the final value.',
    },
    check: {
      optionValues: [14, 5, 11, null],
      compute: () => {
        const A = [3, 1, 4, 1, 5];
        let total = 0;
        for (let i = 1; i <= A.length; i++) total += A[i - 1];
        return total;
      },
    },
  },
  {
    id: 'loops-004',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('n = 1', 'while (n < 20)', '   n = n * 2', 'end while', 'print(n)') },
    options: ['`16`', '`20`', '`32`', INFINITE],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the first doubling of 1 that reaches 20 or more?',
      solution:
        'A `while` loop checks its condition at the top. If it is true, the body runs, and then it checks again. It stops only when the check is false.\n\n' +
        'Trace it:\n\n| `n` at the check | `n < 20`? | `n` becomes |\n|---|---|---|\n| 1 | yes | 2 |\n| 2 | yes | 4 |\n| 4 | yes | 8 |\n| 8 | yes | 16 |\n| 16 | yes | 32 |\n| 32 | no, stop | |\n\n' +
        'Line 5 prints `n`, which is 32.',
      conclusion: '16 is still below 20, so it doubles once more and `n` ends at 32. The answer is `32`.',
      whyWrong: [
        'This is the last value that is still less than 20. But $16 < 20$ is true, so the loop runs once more and doubles it to 32.',
        'This assumes the loop stops exactly at the limit. `n` only takes the values 1, 2, 4, 8, 16, 32, so it can never equal 20.',
        null,
        '`n` grows on every pass, so `n < 20` soon becomes false and the loop stops.',
      ],
      keyIdea: 'A `while` loop stops at the first value that fails the check, which is usually past the limit. Draw a row per check and keep going until one says no.',
    },
    check: {
      optionValues: [16, 20, 32, INFINITE],
      compute: () => {
        let n = 1;
        for (let c = 0; n < 20; c++) {
          if (c > CAP) return INFINITE;
          n *= 2;
        }
        return n;
      },
    },
  },
  {
    id: 'loops-005',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print? Strings are indexed from 1.',
    code: {
      lang: 'pseudocode',
      source: L('s = "robot"', 't = ""', 'for i = 1 to length(s)', '   if s[i] == "b"', '      break', '   end if', '   t = t + s[i]', 'end for', 'print(t)'),
    },
    options: ['`rob`', '`root`', '`robot`', '`ro`'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which letters get added to `t` before the loop reaches `b`?',
      solution:
        '`break` ends the whole loop at once. Any lines left in the body, and any passes left, are skipped.\n\n' +
        'Look at the order. The `if` on line 4 comes **before** line 7, which adds the letter to `t`. So the `b` is tested first and never gets added.\n\n' +
        '`s[i]` is the letter at position `i`. Trace it:\n\n| `i` | `s[i]` | Is it `b`? | `t` after this pass |\n|---|---|---|---|\n| 1 | r | no | `r` |\n| 2 | o | no | `ro` |\n| 3 | b | yes, `break` | `ro` |\n\n' +
        'Line 9 prints `t`, which is `ro`.',
      conclusion: 'The loop ends on reaching `b`, before adding it, so the output is `ro`.',
      whyWrong: [
        'This adds the `b` before stopping. The `if` comes **before** the line `t = t + s[i]`.',
        'This skips just this character and carries on. `break` ends the loop, so the rest is never visited.',
        'This assumes `break` only leaves the `if` block. It exits the whole `for` loop.',
        null,
      ],
      keyIdea: 'With `break`, see whether the work comes before or after the test. Work placed after the test doesn\'t happen on the pass that breaks. Then trace until the test is true and stop.',
    },
    check: {
      optionValues: ['rob', 'root', 'robot', 'ro'],
      compute: () => {
        const s = 'robot';
        let t = '';
        for (let i = 1; i <= s.length; i++) {
          if (s[i - 1] === 'b') break;
          t += s[i - 1];
        }
        return t;
      },
    },
  },
  {
    id: 'loops-006',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'Which loop header runs its body with $i = 1, 2, \\dots, 10$?',
    options: ['`for i = 1 to 10`', '`for i = 0 to 10`', '`for i = 1 to 9`', '`for i = 2 to 10`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which loop starts `i` at 1 and finishes with `i` at 10?',
      solution:
        'In `for i = a to b`, the first value of `i` is `a` and the last value is `b`. Both ends are included.\n\n' +
        'We want `i` to start at 1, so `a` is 1. We want it to finish at 10, so `b` is 10. That gives `for i = 1 to 10`.',
      conclusion: 'Starting at 1 and finishing at 10, with both included, gives `for i = 1 to 10`.',
      whyWrong: [
        null,
        'This also runs with $i = 0$, giving 11 passes.',
        'This stops at 9. The end value is included, so to reach 10 the end must be 10.',
        'This misses $i = 1$. The start value is the first value of `i`.',
      ],
      keyIdea: 'Read `for i = a to b` as "first value `a`, last value `b`". The number after `=` is the first value, and the number after `to` is the last one.',
    },
  },
  {
    id: 'loops-022',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: BODY_RUNS,
    code: { lang: 'pseudocode', source: L('t = 0', 'for i = 3 to 9', '   t = t + i', 'end for') },
    options: ['`7`', '`6`', '`9`', '`3`'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many values does `i` take when it goes from 3 to 9?',
      solution:
        '`for i = 3 to 9` starts `i` at 3, goes up by 1 and includes 9. The body runs once for each value.\n\n' +
        'List them: 3, 4, 5, 6, 7, 8, 9. Counting them gives 7.',
      conclusion: 'There are 7 values of `i` from 3 to 9, so the body runs 7 times and the answer is `7`.',
      whyWrong: [
        null,
        'This is $9 - 3$, which forgets that both ends are included.',
        'This reads only the end value. The loop starts at 3, not 1.',
        'This reads only the start value.',
      ],
      keyIdea: 'For a `for` loop, use: passes = end $-$ start $+ 1$. Here that is $9 - 3 + 1 = 7$. The $+ 1$ is needed because both ends are included.',
    },
    check: {
      optionValues: [7, 6, 9, 3],
      compute: () => {
        let c = 0;
        for (let i = 3; i <= 9; i++) c++;
        return c;
      },
    },
  },
  {
    id: 'loops-025',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: BODY_RUNS,
    code: { lang: 'pseudocode', source: L('x = 10', 'while (x < 10)', '   x = x + 1', 'end while') },
    options: ['`0`', '`1`', '`10`', INFINITE],
    correctIndex: 0,
    markScheme: {
      asking: 'How many passes does this loop make when `x` starts at 10?',
      solution:
        'A `while` loop checks its condition **before** running the body, including the very first time.\n\n' +
        '`x` starts at 10, so the first check is `10 < 10`. 10 is not less than 10, so this is false.\n\n' +
        'The check failed straight away, so line 3 never runs. That is 0 passes.',
      conclusion: 'The first check fails, so the body never runs and the answer is `0`.',
      whyWrong: [
        null,
        'This assumes the body always runs once. A `while` loop tests first, so it can run zero times.',
        'This reads the value of `x` as the number of passes.',
        'The condition is false at the start, so the loop ends straight away.',
      ],
      keyIdea: 'Always test a `while` condition with the starting value first. If it is false, the body runs zero times. A `while` loop does not promise even one pass.',
    },
    check: {
      optionValues: [0, 1, 10, INFINITE],
      compute: () => {
        let x = 10;
        let c = 0;
        while (x < 10) {
          if (c > CAP) return INFINITE;
          x += 1;
          c++;
        }
        return c;
      },
    },
  },
  {
    id: 'loops-028',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('i = 1', 'total = 0', 'while (i <= 5)', '   total = total + i', 'end while', 'print(total)'),
    },
    options: ['`15`', INFINITE, '`10`', '`5`'],
    correctIndex: 1,
    markScheme: {
      asking: 'Does this loop ever finish, and if it does, what does it print?',
      solution:
        'The loop keeps going while `i <= 5`. For it to stop, `i` has to become bigger than 5.\n\n' +
        'Look at the body, line 4: `total = total + i`. It changes `total`, but no line changes `i`.\n\n' +
        'So `i` stays at 1 and the check `1 <= 5` is true every time. `total` goes 1, 2, 3 and on with no end, and line 6 is never reached.',
      conclusion: 'Nothing ever changes `i`, so the condition can\'t become false. The answer is: Infinite loop.',
      whyWrong: [
        'This is the total if the body also had `i = i + 1`. That line is missing.',
        null,
        'This assumes the loop adds 1 to 4 and stops. `i` never changes.',
        'This reads the limit in the condition as the output.',
      ],
      keyIdea: 'For every `while` loop, find the variable in the condition and look for a line in the body that changes it. If there is no such line and the loop starts at all, it never ends.',
    },
    check: {
      optionValues: [15, INFINITE, 10, 5],
      compute: () => {
        const i = 1;
        let total = 0;
        for (let c = 0; i <= 5; c++) {
          if (c > CAP) return INFINITE;
          total += i;
        }
        return total;
      },
    },
  },
  {
    id: 'loops-031',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does `break` do inside a loop?',
    options: ['Ends the loop at once', 'Skips to the next pass', 'Restarts the loop', 'Ends the whole program'],
    correctIndex: 0,
    markScheme: {
      asking: 'What happens when a loop reaches `break`?',
      solution:
        '`break` means "leave this loop now". The rest of the body is skipped, and no more passes happen.\n\n' +
        'The program then carries on from the first line after the loop. So only the loop has finished, and the rest of the program still runs.',
      conclusion: '`break` leaves the loop immediately with no further passes, so the answer is: Ends the loop at once.',
      whyWrong: [
        null,
        '`break` does not move on to another pass: it leaves the loop altogether.',
        'Nothing starts again. The loop is finished.',
        'Only the loop ends. Lines after the loop still run.',
      ],
      keyIdea: 'In a trace, when `break` runs, draw a line under your table and jump to the first line below the `end for` or `end while`. That is where the program carries on.',
    },
  },
  {
    id: 'loops-033',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'For integers $a \\le b$, how many times does the body of `for i = a to b` run?',
    options: ['$b - a + 1$', '$b - a$', '$b - a - 1$', '$a + b$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the formula for how many values `i` takes going from $a$ to $b$?',
      solution:
        'Try real numbers first. `for i = 3 to 5` gives `i` the values 3, 4 and 5, which is 3 passes.\n\n' +
        'Subtraction alone gives $5 - 3 = 2$. That counts the gaps between the values, and it is one too few, because both ends are included.\n\n' +
        'So add 1 to the subtraction: $b - a + 1$. For our example, $5 - 3 + 1 = 3$, which matches.',
      conclusion: 'The gaps between the values number $b - a$, and there is one more value than gaps, so the answer is $b - a + 1$.',
      whyWrong: [
        null,
        'This leaves out one end. `for i = 3 to 5` runs 3 times, not 2.',
        'This leaves out both ends. Both are included.',
        'This adds the two ends. `for i = 3 to 5` would then seem to run 8 times.',
      ],
      keyIdea: 'For a formula question in letters, try small real numbers such as 3 and 5 and count by hand. Keep only the formula that gives your count. For loops with both ends included: end $-$ start $+ 1$.',
    },
    check: {
      optionValues: [3, 2, 1, 8],
      compute: () => {
        let c = 0;
        for (let i = 3; i <= 5; i++) c++;
        return c;
      },
    },
  },
  {
    id: 'loops-034',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'Which suits a task where the number of passes is not known in advance?',
    options: ['A `while` loop', 'A `for` loop', 'An `if` statement', 'An assignment'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which tool repeats work when you don\'t know how many repeats you\'ll need?',
      solution:
        'A `for` loop has its range fixed when it starts, such as `for i = 1 to 10`. So it suits tasks where the count is known.\n\n' +
        'A `while` loop keeps checking a condition and stops when it fails. Halving a number until it reaches 1 is an example. You don\'t have to know the number of passes in advance.',
      conclusion: 'Repeating until a condition fails, with no fixed count, is the job of A `while` loop.',
      whyWrong: [
        null,
        'A `for` loop suits a known range of values, fixed when it starts.',
        'An `if` statement runs its block at most once. It does not repeat.',
        'An assignment stores one value. It does not repeat anything.',
      ],
      keyIdea: 'Ask: can I say how many passes there will be before starting? If yes, use a `for` loop. If the stopping point depends on what happens during the loop, use a `while` loop.',
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'loops-007',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('total = 0', 'for i = 1 to 10', '   if mod(i,3) != 0 // mod is the modulus operator', '      total = total + i', '   end if', 'end for', 'print(total)'),
    },
    options: ['`18`', '`37`', '`55`', '`3`'],
    correctIndex: 1,
    markScheme: {
      asking: 'What do the numbers from 1 to 10 add up to, if you leave out the multiples of 3?',
      solution:
        '`mod(i,3)` is the remainder after dividing `i` by 3. For example, `mod(7,3)` is 1, because $7 = 2 \\times 3 + 1$. A remainder of 0 means `i` is a multiple of 3.\n\n' +
        '`!=` means "not equal". So line 3 is true when the remainder isn\'t 0, which is when `i` is **not** a multiple of 3. That means 3, 6 and 9 are skipped.\n\n' +
        'Add up the rest, keeping a running total:\n\n| `i` | 1 | 2 | 4 | 5 | 7 | 8 | 10 |\n|---|---|---|---|---|---|---|---|\n| `total` | 1 | 3 | 7 | 12 | 19 | 27 | 37 |\n\n' +
        'Line 7 prints `total`, which is 37.',
      conclusion: 'Adding every number except 3, 6 and 9 gives 37, so the answer is `37`.',
      whyWrong: [
        'This is the total of the numbers that were **left out** ($3 + 6 + 9$). The condition `!=` adds the numbers that are not multiples of 3.',
        null,
        'This ignores the `if` and adds every number from 1 to 10.',
        'This adds 1 and 2, then stops the loop at $i = 3$. A false `if` skips only its own block, and the loop carries on.',
      ],
      keyIdea: 'An `if` with `mod` inside a loop filters the numbers. List the ones that pass, then add. A shortcut for "all except": the total of 1 to 10 is 55, and taking off the left-out 18 gives 37.',
    },
    check: {
      optionValues: [18, 37, 55, 3],
      compute: () => {
        let total = 0;
        for (let i = 1; i <= 10; i++) {
          if (mod(i, 3) !== 0) total += i;
        }
        return total;
      },
    },
  },
  {
    id: 'loops-008',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('count = 0', 'for i = 1 to 4', '   for j = 1 to i', '      count = count + 1', '   end for', 'end for', 'print(count)'),
    },
    options: ['`16`', '`10`', '`4`', '`6`'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many times does the inner line run in total?',
      solution:
        'The `count` line is inside both loops. So it runs once for every pass of the inner loop.\n\n' +
        'The inner loop is `for j = 1 to i`, so its length depends on `i`. When `i` is 3, `j` goes 1, 2, 3, which is 3 passes.\n\n' +
        'Work it out for each pass of the outer loop:\n\n| `i` | Inner passes | `count` after this `i` |\n|---|---|---|\n| 1 | 1 | 1 |\n| 2 | 2 | 3 |\n| 3 | 3 | 6 |\n| 4 | 4 | 10 |\n\n' +
        'Line 7 prints `count`, which is 10.',
      conclusion: 'The total is $1 + 2 + 3 + 4 = 10$, so the answer is `10`.',
      whyWrong: [
        'This multiplies $4 \\times 4$, as if the inner loop always ran 4 times. Its length changes with `i`.',
        null,
        'This counts only the outer loop passes. The `count` line is inside the inner loop.',
        'This adds $0 + 1 + 2 + 3$, as if the inner loop stopped at $i - 1$. The end value is included.',
      ],
      keyIdea: 'For nested loops, make a table with one row per outer value and write how many times the inner loop runs. Then add the column. Only multiply when the inner loop\'s length never changes.',
    },
    check: {
      optionValues: [16, 10, 4, 6],
      compute: () => {
        let count = 0;
        for (let i = 1; i <= 4; i++) for (let j = 1; j <= i; j++) count++;
        return count;
      },
    },
  },
  {
    id: 'loops-009',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('x = 100', 'steps = 0', 'while (x > 1)', '   x = div(x,2) // div is integer division', '   steps = steps + 1', 'end while', 'print(steps)'),
    },
    options: ['`7`', '`6`', '`5`', '`1`'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many times can 100 be halved with `div` before it reaches 1?',
      solution:
        '`div(x,2)` is integer division: it halves `x` and throws away any decimal part. For example, $25 \\div 2 = 12.5$, so `div(25,2)` is 12.\n\n' +
        'The loop runs while `x > 1`. Each pass halves `x` and adds 1 to `steps`:\n\n| Pass | `x` at start | `x` becomes | `steps` |\n|---|---|---|---|\n| 1 | 100 | 50 | 1 |\n| 2 | 50 | 25 | 2 |\n| 3 | 25 | 12 | 3 |\n| 4 | 12 | 6 | 4 |\n| 5 | 6 | 3 | 5 |\n| 6 | 3 | 1 | 6 |\n\n' +
        'Now `1 > 1` is false, so line 7 prints `steps`.',
      conclusion: 'It takes 6 halvings to bring `x` down to 1, and `steps` counts them, so the answer is `6`.',
      whyWrong: [
        'This uses ordinary division: 12.5, 6.25, 3.125, 1.5625, which is still above 1, so one extra pass is needed. With `div` the decimals are dropped and 3 halves straight to 1.',
        null,
        'This stops one pass too early, at $x = 3$. But $3 > 1$ is true, so the loop runs once more.',
        'This is the final value of `x`, not of `steps`.',
      ],
      keyIdea: 'Halving with `div` drops decimals, so trace the real values. Keep one row per pass and test the condition after each row. The loop stops only when the test is false.',
    },
    check: {
      optionValues: [7, 6, 5, 1],
      compute: () => {
        let x = 100;
        let steps = 0;
        while (x > 1) {
          x = Math.floor(x / 2);
          steps++;
        }
        return steps;
      },
    },
  },
  {
    id: 'loops-012',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'This loop must run its body exactly as `for i = 1 to 5` does. Which condition should replace `cond`?',
    code: {
      lang: 'pseudocode',
      source: L('product = 1', 'i = 1', 'while (cond)', '   product = product * i', '   i = i + 1', 'end while', 'print(product)'),
    },
    options: ['`i <= 5`', '`i < 5`', '`i >= 5`', '`i != 5`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which condition makes `i` run through 1, 2, 3, 4 and 5 and then stop?',
      solution:
        '`for i = 1 to 5` runs the body with `i` = 1, 2, 3, 4, 5. The value 5 is included.\n\n' +
        'In the `while` version, the condition is checked at the top of each pass. It has to be true for each of those values, and false for the next value, 6.\n\n' +
        'Test each condition at the values that matter:\n\n| Condition | `i` = 1 | `i` = 5 | `i` = 6 |\n|---|---|---|---|\n| `i <= 5` | true | true | false |\n| `i < 5` | true | false | false |\n| `i >= 5` | false | true | true |\n| `i != 5` | true | false | true |\n\n' +
        'Only the first row is true, true, then false.',
      conclusion: 'It keeps going up to and including 5 and then stops, so the condition must be `i <= 5`.',
      whyWrong: [
        null,
        'This stops before using 5, so it runs only 4 passes and prints 24.',
        'This is false when $i = 1$, so the body never runs.',
        'This stops as soon as $i$ reaches 5, so 5 is never multiplied in and it prints 24.',
      ],
      keyIdea: 'To turn `for i = a to b` into a `while`, start `i` at `a`, use `while (i <= b)`, and put `i = i + 1` last in the body. Test the condition at the first, last and next values.',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const run = (cond: (i: number) => boolean) => {
          let product = 1;
          let i = 1;
          while (cond(i)) {
            product *= i;
            i += 1;
          }
          return product;
        };
        let target = 1;
        for (let i = 1; i <= 5; i++) target *= i;
        const conds = [(i: number) => i <= 5, (i: number) => i < 5, (i: number) => i >= 5, (i: number) => i !== 5];
        const match = conds.map((c, k) => ({ c, k })).filter(({ c }) => run(c) === target);
        return match.length === 1 ? match[0].k : -1;
      },
    },
  },
  {
    id: 'loops-013',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print? (`%` is the remainder.)',
    code: {
      lang: 'python',
      source: L('count = 0', 'for n in range(1, 31):', '    if n % 3 == 0 or n % 5 == 0:', '        count = count + 1', 'print(count)'),
    },
    options: ['`16`', '`2`', '`14`', '`13`'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many numbers from 1 to 30 are multiples of 3 or multiples of 5?',
      solution:
        '`range(1, 31)` gives 1, 2, and so on up to 30. It stops before 31, so 31 is not included.\n\n' +
        '`n % 3` is the remainder, what is left over after dividing `n` by 3. For example, `7 % 3` is 1. A remainder of 0 means `n` is a multiple of 3. The same goes for 5.\n\n' +
        'List the multiples:\n\n- Multiples of 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30. That is 10 numbers.\n- Multiples of 5: 5, 10, 15, 20, 25, 30. That is 6 numbers.\n\n' +
        '`count` goes up by 1 at most once per number, even if both tests pass. 15 and 30 appear in both lists, so they must be counted only once.\n\n' +
        'Add the two lists and take off the repeats: $10 + 6 - 2 = 14$.',
      conclusion: '10 multiples of 3 plus 6 multiples of 5, minus the 2 counted twice, gives 14. The answer is `14`.',
      whyWrong: [
        'This adds 10 and 6 without noticing that 15 and 30 were counted twice. Each `n` can add at most 1.',
        'This reads `or` as `and`, counting only numbers divisible by both 3 and 5 (15 and 30).',
        null,
        'This leaves out 30, as if `range(1, 31)` stopped at 29. It stops before 31, so the last value is 30.',
      ],
      keyIdea: 'To count "A or B", add the two counts and subtract the overlap: count(A) $+$ count(B) $-$ count(both). Multiples of 3 and 5 overlap at multiples of 15.',
    },
    check: {
      optionValues: [16, 2, 14, 13],
      compute: () => rangeVals(1, 31).filter((n) => n % 3 === 0 || n % 5 === 0).length,
    },
    python: { stdout: '14\n' },
  },
  {
    id: 'loops-014',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this pseudocode print? Output lines are shown separated by a space.',
    code: {
      lang: 'pseudocode',
      source: L('total = 0', 'n = 0', 'while (total <= 20)', '   n = n + 1', '   total = total + n', 'end while', 'print(n)', 'print(total)'),
    },
    options: ['`5 15`', '`7 21`', '`7 28`', '`6 21`'],
    correctIndex: 3,
    markScheme: {
      asking: 'What are `n` and `total` when `total` first goes over 20?',
      solution:
        'The check `total <= 20` is at the top of the loop, so the loop carries on until `total` is more than 20. Inside, `n` goes up by 1 first, then the new `n` is added to `total`.\n\n' +
        'Trace it:\n\n| Pass | `n` becomes | `total` becomes | `total <= 20`? |\n|---|---|---|---|\n| 1 | 1 | 1 | yes |\n| 2 | 2 | 3 | yes |\n| 3 | 3 | 6 | yes |\n| 4 | 4 | 10 | yes |\n| 5 | 5 | 15 | yes |\n| 6 | 6 | 21 | no, stop |\n\n' +
        'Lines 7 and 8 print `n` and then `total`.',
      conclusion: 'The loop stops when `total` reaches 21, at which point `n` is 6, so the output is `6 21`.',
      whyWrong: [
        'This stops at the last total that is still at most 20. But $15 \\le 20$ is true, so the loop runs once more.',
        'This swaps the two lines in the body, adding `n` to `total` before increasing `n`.',
        'This runs one pass too many. After `total` becomes 21, the check $21 \\le 20$ is false and the loop stops.',
        null,
      ],
      keyIdea: 'Keep the body\'s lines in their order when tracing: here `n` changes first, then `total` uses the new `n`. Swap them and the answer changes. Test the condition only after each full pass.',
    },
    check: {
      optionValues: ['5 15', '7 21', '7 28', '6 21'],
      compute: () => {
        let total = 0;
        let n = 0;
        while (total <= 20) {
          n += 1;
          total += n;
        }
        return `${n} ${total}`;
      },
    },
  },
  {
    id: 'loops-015',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('i = 10', 'while (i != 0)', '   i = i - 3', 'end while', 'print(i)') },
    options: [INFINITE, '`1`', '`-2`', '`0`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Will subtracting 3 from 10 over and over ever land exactly on 0?',
      solution:
        '`!=` means "not equal to". The loop only stops when `i != 0` is false. That happens only if `i` is exactly 0.\n\n' +
        'Follow `i`: it goes 10, 7, 4, 1, then $-2$, then $-5$, and keeps falling.\n\n' +
        'It jumps from 1 to $-2$, straight over 0. After that, `i` only gets further from 0. So the test is true every time, and line 5 is never reached.',
      conclusion: '`i` never equals 0, so the loop condition never becomes false. The answer is: Infinite loop.',
      whyWrong: [
        null,
        'This assumes the loop stops before going negative, as if the condition were `i > 3`. The condition is `i != 0`.',
        'This assumes the loop stops once `i` drops below 0, as if the condition were `i > 0`. `-2 != 0` is still true.',
        'This assumes `i` reaches 0. The values are 10, 7, 4, 1, then $-2$, jumping over 0.',
      ],
      keyIdea: 'A `!=` stopping test is risky. See whether the variable can land exactly on the target: 10 minus multiples of 3 gives 10, 7, 4, 1, $-2$, and 0 isn\'t there. A miss means the loop never ends.',
    },
    check: {
      optionValues: [INFINITE, 1, -2, 0],
      compute: () => {
        let i = 10;
        for (let c = 0; i !== 0; c++) {
          if (c > CAP) return INFINITE;
          i -= 3;
        }
        return i;
      },
    },
  },
  {
    id: 'loops-016',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('s = 0', 'for i = 1 to 10', '   if mod(i,2) == 0 // mod is the modulus operator', '      s = s + i * i', '   end if', 'end for', 'print(s)'),
    },
    options: ['`165`', '`385`', '`30`', '`220`'],
    correctIndex: 3,
    markScheme: {
      asking: 'What do the squares of the even numbers from 1 to 10 add up to?',
      solution:
        '`mod(i,2)` is the remainder, what is left over after dividing `i` by 2. For example, `mod(7,2)` is 1. It is 0 when `i` is even, so line 3 lets through only the even values: 2, 4, 6, 8 and 10.\n\n' +
        'Line 4 adds `i * i`, which is `i` multiplied by itself (its **square**). `s` starts at 0.\n\n' +
        'Trace the even values:\n\n| `i` | `i * i` | `s` becomes |\n|---|---|---|\n| 2 | 4 | 4 |\n| 4 | 16 | 20 |\n| 6 | 36 | 56 |\n| 8 | 64 | 120 |\n| 10 | 100 | 220 |\n\n' +
        'Line 7 prints `s`, which is 220.',
      conclusion: 'The even squares add to 220, so the answer is `220`.',
      whyWrong: [
        'This adds the squares of the **odd** numbers. A remainder of 0 picks out the even ones.',
        'This ignores the `if` and adds the squares of all numbers from 1 to 10.',
        'This adds `i` instead of `i * i`.',
        null,
      ],
      keyIdea: 'Split a filter-and-add loop into two questions: which values pass the `if`, and what gets added for each? Make a table of only the passing values, with a column for the amount added and one for the running total.',
    },
    check: {
      optionValues: [165, 385, 30, 220],
      compute: () => {
        let s = 0;
        for (let i = 1; i <= 10; i++) if (mod(i, 2) === 0) s += i * i;
        return s;
      },
    },
  },
  {
    id: 'loops-023',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: BODY_RUNS,
    code: { lang: 'pseudocode', source: L('n = 40', 'while (n > 0)', '   n = n - 7', 'end while') },
    options: ['`6`', '`5`', '`7`', INFINITE],
    correctIndex: 0,
    markScheme: {
      asking: 'How many times can 7 be taken from 40 while `n` is still positive at the check?',
      solution:
        'The check `n > 0` happens at the top of each pass. `n` falls by 7 each time, and the body keeps running as long as `n` is above 0.\n\n' +
        'Trace it:\n\n| Pass | `n` at the check | `n > 0`? | `n` becomes |\n|---|---|---|---|\n| 1 | 40 | yes | 33 |\n| 2 | 33 | yes | 26 |\n| 3 | 26 | yes | 19 |\n| 4 | 19 | yes | 12 |\n| 5 | 12 | yes | 5 |\n| 6 | 5 | yes | $-2$ |\n\n' +
        '`-2 > 0` is false, so there is no further pass.',
      conclusion: '5 is still above 0, so one more pass runs and takes `n` to $-2$. That makes 6 passes, and the answer is `6`.',
      whyWrong: [
        null,
        'This stops when `n` is 5. But $5 > 0$ is true, so there is one more pass.',
        'This runs one pass too many. After `n` becomes $-2$, the check fails.',
        '`n` falls on every pass, so `n > 0` eventually fails and the loop stops.',
      ],
      keyIdea: 'To count passes of `while (n > 0)` with `n = n - d`, divide `n` by `d` and round **up**: $40 \\div 7$ is about 5.7, which rounds up to 6. A table confirms it.',
    },
    check: {
      optionValues: [6, 5, 7, INFINITE],
      compute: () => {
        let n = 40;
        let c = 0;
        while (n > 0) {
          if (c > CAP) return INFINITE;
          n -= 7;
          c++;
        }
        return c;
      },
    },
  },
  {
    id: 'loops-024',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: BODY_RUNS,
    code: { lang: 'pseudocode', source: L('n = 50', 'while (true)', '   n = n - 8', '   if n < 0', '      break', '   end if', 'end while') },
    options: ['`7`', '`6`', '`8`', INFINITE],
    correctIndex: 0,
    markScheme: {
      asking: 'How many times is 8 subtracted from 50 before `n` goes below 0?',
      solution:
        '`while (true)` has no stopping test of its own. It only ends when `break` on line 5 runs, and this happens when `n < 0`.\n\n' +
        'Each pass takes 8 off first, then tests `n`:\n\n| Pass | `n` becomes | `n < 0`? |\n|---|---|---|\n| 1 | 42 | no |\n| 2 | 34 | no |\n| 3 | 26 | no |\n| 4 | 18 | no |\n| 5 | 10 | no |\n| 6 | 2 | no |\n| 7 | $-6$ | yes, `break` |\n\n' +
        'The pass that breaks still counts as a pass.',
      conclusion: '2 is not below 0, so pass 7 runs and takes `n` to $-6$. The `break` ends that pass, so the answer is `7`.',
      whyWrong: [
        null,
        'This stops when `n` is 2. But $2 < 0$ is false, so the loop carries on.',
        'This runs one pass too many. `break` ends the loop on the pass that makes `n` negative.',
        'The `break` does run, because `n` falls by 8 each pass and soon drops below 0.',
      ],
      keyIdea: 'In a `while (true)` loop, the pass on which `break` runs still counts. Make one row per pass and test straight after the line that changes the variable, following the order in the code.',
    },
    check: {
      optionValues: [7, 6, 8, INFINITE],
      compute: () => {
        let n = 50;
        let c = 0;
        for (;;) {
          if (c > CAP) return INFINITE;
          c++;
          n -= 8;
          if (n < 0) break;
        }
        return c;
      },
    },
  },
  {
    id: 'loops-026',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'How many times does the line `c = c + 1` run?',
    code: { lang: 'pseudocode', source: L('c = 0', 'for i = 1 to 3', '   for j = i to 4', '      c = c + 1', '   end for', 'end for') },
    options: ['`9`', '`12`', '`10`', '`6`'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many times does the inner loop\'s line run altogether?',
      solution:
        '`c = c + 1` is inside both loops, so it runs once per pass of the inner loop.\n\n' +
        'The inner loop is `for j = i to 4`. It starts at the current `i`, so it gets shorter as `i` grows. When `i` is 2, `j` goes 2, 3, 4, which is 3 passes.\n\n' +
        'Count for each `i`:\n\n| `i` | Values of `j` | Inner passes |\n|---|---|---|\n| 1 | 1, 2, 3, 4 | 4 |\n| 2 | 2, 3, 4 | 3 |\n| 3 | 3, 4 | 2 |\n\n' +
        'Add the last column: $4 + 3 + 2 = 9$.',
      conclusion: 'The inner passes add to 9, so the line runs 9 times and the answer is `9`.',
      whyWrong: [
        null,
        'This multiplies $3 \\times 4$, as if the inner loop always ran 4 times.',
        'This adds $4 + 3 + 2 + 1$, as if the outer loop went up to 4. It stops at 3.',
        'This adds $1 + 2 + 3$, as if `j` ran from 1 to `i`. Here `j` runs from `i` to 4.',
      ],
      keyIdea: 'When the inner range uses `i`, make a table with each `i` and its inner passes, found by end $-$ start $+ 1$. Then add the column. The outer loop\'s end tells you when to stop.',
    },
    check: {
      optionValues: [9, 12, 10, 6],
      compute: () => {
        let c = 0;
        for (let i = 1; i <= 3; i++) for (let j = i; j <= 4; j++) c++;
        return c;
      },
    },
  },
  {
    id: 'loops-029',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('n = 1', 'while (true)', '   n = n + 2', '   if n == 10', '      break', '   end if', 'end while', 'print(n)') },
    options: [INFINITE, '`10`', '`9`', '`11`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Will adding 2 repeatedly to 1 ever give exactly 10?',
      solution:
        '`while (true)` never stops by itself. The only way out is the `break` on line 5, which needs `n` to be exactly 10.\n\n' +
        '`n` starts at 1 and goes up by 2 on each pass: 3, 5, 7, 9, 11, 13, and so on.\n\n' +
        'An odd number plus 2 is always odd, so `n` is never even. It goes from 9 to 11, jumping over 10. So `n == 10` is never true, and line 5 never runs.',
      conclusion: '`n` only ever takes odd values, so the `break` never runs. The answer is: Infinite loop.',
      whyWrong: [
        null,
        'This assumes `n` lands on 10. Starting at 1 and adding 2 only ever gives odd numbers.',
        'This assumes the loop stops at the last value below 10. Only `n == 10` can trigger the `break`.',
        'This assumes the loop stops at the first value above 10. The test is `==`, not `>=`.',
      ],
      keyIdea: 'When a `break` test uses `==`, see whether the variable can land exactly on the target. Starting at 1 with jumps of 2 gives only odd numbers. A test like `n >= 10` would not have this problem.',
    },
    check: {
      optionValues: [INFINITE, 10, 9, 11],
      compute: () => {
        let n = 1;
        for (let c = 0; ; c++) {
          if (c > CAP) return INFINITE;
          n += 2;
          if (n === 10) break;
        }
        return n;
      },
    },
  },
  {
    id: 'loops-030',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('n = 23', 't = 0', 'while (true)', '   t = t + mod(n,4) // mod is the modulus operator', '   n = n - 5', '   if n <= 0', '      break', '   end if', 'end while', 'print(t)'),
    },
    options: ['`9`', '`6`', '`3`', INFINITE],
    correctIndex: 0,
    markScheme: {
      asking: 'What total does `t` reach before `n` falls to 0 or below?',
      solution:
        '`mod(n,4)` is the remainder after dividing `n` by 4. For example, $23 = 5 \\times 4 + 3$, so `mod(23,4)` is 3.\n\n' +
        '`while (true)` only ends through `break`, on line 7. Each pass adds the remainder to `t`, takes 5 off `n`, then tests `n <= 0`.\n\n' +
        'Trace it:\n\n| Pass | `n` at start | `mod(n,4)` | `t` becomes | `n` becomes | `n <= 0`? |\n|---|---|---|---|---|---|\n| 1 | 23 | 3 | 3 | 18 | no |\n| 2 | 18 | 2 | 5 | 13 | no |\n| 3 | 13 | 1 | 6 | 8 | no |\n| 4 | 8 | 0 | 6 | 3 | no |\n| 5 | 3 | 3 | 9 | $-2$ | yes |\n\n' +
        '`break` jumps to line 10, which prints `t`.',
      conclusion: 'The loop breaks after pass 5 with `t` at 9, so the answer is `9`.',
      whyWrong: [
        null,
        'This stops one pass early, at $n = 3$. `n` is 3 after the fourth pass, and $3 \\le 0$ is false, so there is another pass.',
        'This stops after the first pass. `break` runs only when `n` is 0 or below.',
        '`n` falls by 5 each pass, so `n <= 0` soon becomes true and `break` runs.',
      ],
      keyIdea: 'For a `while (true)` loop, draw a row per pass with a column for each variable, in the same order as the code. Test the `break` straight after the line that changes the variable.',
    },
    check: {
      optionValues: [9, 6, 3, INFINITE],
      compute: () => {
        let n = 23;
        let t = 0;
        for (let c = 0; ; c++) {
          if (c > CAP) return INFINITE;
          t += mod(n, 4);
          n -= 5;
          if (n <= 0) break;
        }
        return t;
      },
    },
  },
  {
    id: 'loops-035',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('t = 0', 'for i = 1 to 100', '   t = t + i', 'end for', 'print(t)') },
    options: ['`5050`', '`4950`', '`10100`', '`100`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is the sum of all the whole numbers from 1 to 100?',
      solution:
        '`t` starts at 0 and each pass adds `i`. So by the end `t` holds $1 + 2 + 3 + \\dots + 100$. Tracing 100 passes by hand is too slow, so we use a trick.\n\n' +
        'Pair the numbers from the outside in: $1 + 100 = 101$, $2 + 99 = 101$, $3 + 98 = 101$. Every pair adds to 101.\n\n' +
        'There are 100 numbers, so there are $100 \\div 2 = 50$ pairs.\n\n' +
        'The total is $50 \\times 101 = 5050$.',
      conclusion: 'The loop adds 1 to 100, and each of the 50 pairs makes 101, so the answer is `5050`.',
      whyWrong: [
        null,
        'This stops at 99. `for i = 1 to 100` includes 100.',
        'This forgets to divide by 2 in the formula.',
        'This counts the passes, as if the line were `t = t + 1`.',
      ],
      keyIdea: 'To add the whole numbers from 1 to $n$, use $\\frac{n(n + 1)}{2}$, where $n$ is the last number. Spot it from `t = t + i` in a loop starting at 1. Here that is $\\frac{100 \\times 101}{2}$.',
    },
    check: {
      optionValues: [5050, 4950, 10100, 100],
      compute: () => {
        let t = 0;
        for (let i = 1; i <= 100; i++) t += i;
        return t;
      },
    },
  },
  {
    id: 'loops-036',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('x = 2', 's = 0', 'while (x <= 10)', '   s = s + x', '   x = x + 2', 'end while', 'print(s)') },
    options: ['`30`', '`20`', '`42`', INFINITE],
    correctIndex: 0,
    markScheme: {
      asking: 'What do the values of `x` add up to as it goes up in twos to 10?',
      solution:
        'The loop runs while `x <= 10`, and the `<=` means 10 itself is allowed. `s` adds the current `x`, and then `x` goes up by 2.\n\n' +
        'Trace it:\n\n| Pass | `x` at the check | `s` becomes | `x` becomes |\n|---|---|---|---|\n| 1 | 2 | 2 | 4 |\n| 2 | 4 | 6 | 6 |\n| 3 | 6 | 12 | 8 |\n| 4 | 8 | 20 | 10 |\n| 5 | 10 | 30 | 12 |\n\n' +
        '`12 <= 10` is false, so line 7 prints `s`.',
      conclusion: '10 is included because of `<=`, and 12 fails the check, so $2 + 4 + 6 + 8 + 10$ gives 30. The answer is `30`.',
      whyWrong: [
        null,
        'This leaves out 10, as if the condition were `x < 10`. `<=` includes 10.',
        'This also adds 12. The check $12 \\le 10$ fails before the body runs again.',
        '`x` goes up on every pass, so it soon passes 10 and the loop stops.',
      ],
      keyIdea: 'List the values the loop variable takes, and test the first value that might fail. `<=` includes the limit and `<` doesn\'t. Then add only the values that passed the check.',
    },
    check: {
      optionValues: [30, 20, 42, INFINITE],
      compute: () => {
        let x = 2;
        let s = 0;
        for (let c = 0; x <= 10; c++) {
          if (c > CAP) return INFINITE;
          s += x;
          x += 2;
        }
        return s;
      },
    },
  },
  {
    id: 'loops-037',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: L('n = 1', 'count = 0', 'while n < 100:', '    n = n * 3', '    count = count + 1', 'print(count)') },
    options: ['`5`', '`4`', '`243`', '`6`'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many times must you multiply 1 by 3 to reach 100 or more?',
      solution:
        'The loop checks `n < 100` at the top. Each pass multiplies `n` by 3 and adds 1 to `count`.\n\n' +
        'Trace it:\n\n| Pass | `n` at the check | `n` becomes | `count` |\n|---|---|---|---|\n| 1 | 1 | 3 | 1 |\n| 2 | 3 | 9 | 2 |\n| 3 | 9 | 27 | 3 |\n| 4 | 27 | 81 | 4 |\n| 5 | 81 | 243 | 5 |\n\n' +
        '`243 < 100` is false, so line 6 prints `count`.',
      conclusion: '81 is still below 100, so pass 5 runs and `count` ends at 5. The answer is `5`.',
      whyWrong: [
        null,
        'This stops at 81. But $81 < 100$ is true, so there is one more pass.',
        'This is the final value of `n`. The code prints `count`.',
        'This runs one pass too many. Once `n` is 243 the check fails.',
      ],
      keyIdea: 'For a loop that multiplies, write out the powers until one fails the condition. The count is how many multiplications happened. Keep it apart from the final value of `n`, which here is 243.',
    },
    check: {
      optionValues: [5, 4, 243, 6],
      compute: () => {
        let n = 1;
        let count = 0;
        while (n < 100) {
          n *= 3;
          count++;
        }
        return count;
      },
    },
    python: { stdout: '5\n' },
  },
];
