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
      solution:
        '`range(start, stop, step)` starts **at** `start`, adds `step` each time, and stops before reaching `stop` (the stop value is never included).\n\n' +
        '1. The values of `i` are 2, 5 and 8. The next would be 11, which is past 10.\n' +
        '2. `total` adds them: $2 + 5 + 8 = 15$.\n\n' +
        'Output: `15`.',
      whyWrong: [
        null,
        'This goes one step too far and also adds 11. The range stops before reaching 10.',
        'This starts at the step (3, 6, 9) instead of at the start value 2.',
        'This ignores the step and adds every whole number from 2 to 9.',
      ],
      keyIdea: '`range(start, stop, step)` begins at start, jumps by step, and never includes stop.',
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
      solution:
        '`range(4, 20)` gives the values $4, 5, 6, \\dots, 19$. It includes the start (4) and stops before the stop value (20).\n\n' +
        'The number of values in `range(a, b)` is simply $b - a$:\n\n' +
        '$$20 - 4 = 16$$\n\n' +
        'So the loop body runs 16 times and `hi` is printed 16 times.',
      whyWrong: [
        'This counts both ends, 4 **and** 20. But 20 is the stop value and is not included; the last value is 19.',
        'This reads only the stop value. The loop starts at 4, not at 0, so it runs fewer than 20 times.',
        'This removes one value too many, as if both the start and the stop were excluded. The start value 4 is included.',
        null,
      ],
      keyIdea: '`range(a, b)` with step 1 produces exactly $b - a$ values: a is included, b is not.',
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
      solution:
        '`total` is an **accumulator**: it starts at 0 and each pass of the loop adds the current item to it.\n\n' +
        '| i | A[i] | total |\n|---|---|---|\n| 1 | 3 | 3 |\n| 2 | 1 | 4 |\n| 3 | 4 | 8 |\n| 4 | 1 | 9 |\n| 5 | 5 | 14 |\n\n' +
        'The `print` comes after `end for`, so it runs once, when the loop has finished.\n\nOutput: `14`.',
      whyWrong: [
        null,
        'This is the last item only. That would happen with `total = A[i]`, which overwrites the total instead of adding to it.',
        'This skips the first item (3), as if the loop started at position 2. The loop starts at $i = 1$.',
        'These are the running totals. They would only all be printed if `print(total)` were inside the loop.',
      ],
      keyIdea: 'An accumulator starts at 0 and adds each item in turn; a `print` after the loop runs only once.',
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
      solution:
        'A `while` loop checks its condition **before** every pass.\n\n' +
        '| check `n < 20` | n after the body |\n|---|---|\n| $1 < 20$ true | 2 |\n| $2 < 20$ true | 4 |\n| $4 < 20$ true | 8 |\n| $8 < 20$ true | 16 |\n| $16 < 20$ true | 32 |\n| $32 < 20$ **false**: stop | |\n\n' +
        'The condition is only checked at the top, so `n` can overshoot 20 on the last pass.\n\nOutput: `32`.',
      whyWrong: [
        'This is the last value that is still less than 20. But $16 < 20$ is true, so the loop runs once more and doubles it to 32.',
        'This assumes the loop stops exactly at the limit. `n` only takes the values 1, 2, 4, 8, 16, 32, so it can never equal 20.',
        null,
        '`n` grows on every pass, so `n < 20` soon becomes false and the loop stops.',
      ],
      keyIdea: 'A while loop checks its condition only at the top, so the variable can overshoot the limit on the final pass.',
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
      solution:
        'The loop visits the characters one at a time. `break` immediately ends the **whole loop**.\n\n' +
        '| i | s[i] | action | t |\n|---|---|---|---|\n| 1 | r | add | r |\n| 2 | o | add | ro |\n| 3 | b | `break` | ro |\n\n' +
        'The test comes before the line that adds to `t`, so `b` is never added.\n\nOutput: `ro`.',
      whyWrong: [
        'This adds the `b` before stopping. The `if` comes **before** the line `t = t + s[i]`.',
        'This skips just this character and carries on. `break` ends the loop, so the rest is never visited.',
        'This assumes `break` only leaves the `if` block. It exits the whole `for` loop.',
        null,
      ],
      keyIdea: '`break` ends the entire loop at once; any lines below it in the loop body are skipped.',
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
      solution:
        '`for i = a to b` includes **both** ends. So the loop starts at 1 and finishes at 10 with `for i = 1 to 10`.',
      whyWrong: [
        null,
        'This also runs with $i = 0$, giving 11 passes.',
        'This stops at 9. The end value is included, so to reach 10 the end must be 10.',
        'This misses $i = 1$. The start value is the first value of `i`.',
      ],
      keyIdea: '`for i = a to b` runs from a to b inclusive.',
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
      solution:
        '`i` takes the values 3, 4, 5, 6, 7, 8, 9, including both ends.\n\n' +
        'The count is last $-$ first $+ 1$: $9 - 3 + 1 = 7$.',
      whyWrong: [
        null,
        'This is $9 - 3$, which forgets that both ends are included.',
        'This reads only the end value. The loop starts at 3, not 1.',
        'This reads only the start value.',
      ],
      keyIdea: '`for i = a to b` runs $b - a + 1$ times.',
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
      solution:
        'The condition is checked **before** the first pass. `10 < 10` is false, so the body never runs.\n\nAnswer: `0`.',
      whyWrong: [
        null,
        'This assumes the body always runs once. A `while` loop tests first, so it can run zero times.',
        'This reads the value of `x` as the number of passes.',
        'The condition is false at the start, so the loop ends straight away.',
      ],
      keyIdea: 'If a `while` condition is false at the start, the body runs zero times.',
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
      solution:
        'Nothing in the loop body changes `i`.\n\n' +
        '1. `i` stays 1, so `i <= 5` is true on every check.\n' +
        '2. The loop never ends, and `print` is never reached.\n\n' +
        'Answer: Infinite loop.',
      whyWrong: [
        'This is the total if the body also had `i = i + 1`. That line is missing.',
        null,
        'This assumes the loop adds 1 to 4 and stops. `i` never changes.',
        'This reads the limit in the condition as the output.',
      ],
      keyIdea: 'A `while` loop needs something in its body that eventually makes the condition false.',
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
      solution:
        '`break` ends the loop immediately, and the program carries on with the first line after the loop. In nested loops it ends only the innermost one.',
      whyWrong: [
        null,
        '`break` does not move on to another pass: it leaves the loop altogether.',
        'Nothing starts again. The loop is finished.',
        'Only the loop ends. Lines after the loop still run.',
      ],
      keyIdea: '`break` leaves the loop at once; the first line after the loop runs next.',
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
      solution:
        'An **inclusive** range counts both of its end values, so the count is last $-$ first $+ 1$.\n\n' +
        'For example, `for i = 3 to 5` runs with 3, 4 and 5, which is $5 - 3 + 1 = 3$ passes.',
      whyWrong: [
        null,
        'This leaves out one end. `for i = 3 to 5` runs 3 times, not 2.',
        'This leaves out both ends. Both are included.',
        'This adds the two ends. `for i = 3 to 5` would then seem to run 8 times.',
      ],
      keyIdea: 'An inclusive range from a to b has $b - a + 1$ values.',
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
      solution:
        'A `while` loop repeats for as long as a condition holds, so it does not need the number of passes up front. A `for` loop is the natural choice when the range is known.',
      whyWrong: [
        null,
        'A `for` loop suits a known range of values, fixed when it starts.',
        'An `if` statement runs its block at most once. It does not repeat.',
        'An assignment stores one value. It does not repeat anything.',
      ],
      keyIdea: 'Use `for` for a known range and `while` when repetition depends on a condition.',
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
      solution:
        '`mod(i,3) != 0` is true when `i` is **not** a multiple of 3, so the multiples of 3 (3, 6, 9) are never added.\n\n' +
        'Numbers that get added: $1, 2, 4, 5, 7, 8, 10$.\n\n' +
        '$$1 + 2 + 4 + 5 + 7 + 8 + 10 = 37$$\n\n' +
        'Quick check: the sum of 1 to 10 is 55, and the skipped numbers add to 18, so $55 - 18 = 37$.\n\nOutput: `37`.',
      whyWrong: [
        'This is the total of the numbers that were **left out** ($3 + 6 + 9$). The condition `!=` adds the numbers that are not multiples of 3.',
        null,
        'This ignores the `if` and adds every number from 1 to 10.',
        'This adds 1 and 2, then stops the loop at $i = 3$. A false `if` skips only its own block, and the loop carries on.',
      ],
      keyIdea: 'A false `if` skips only its own block for that pass; the loop itself carries on to the next value.',
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
      solution:
        'For each value of `i`, the inner loop runs exactly `i` times.\n\n' +
        '| i | values of j | inner passes |\n|---|---|---|\n| 1 | 1 | 1 |\n| 2 | 1, 2 | 2 |\n| 3 | 1, 2, 3 | 3 |\n| 4 | 1, 2, 3, 4 | 4 |\n\n' +
        'Total: $1 + 2 + 3 + 4 = 10$.\n\nOutput: `10`.',
      whyWrong: [
        'This multiplies $4 \\times 4$, as if the inner loop always ran 4 times. Its length changes with `i`.',
        null,
        'This counts only the outer loop passes. The `count` line is inside the inner loop.',
        'This adds $0 + 1 + 2 + 3$, as if the inner loop stopped at $i - 1$. The end value is included.',
      ],
      keyIdea: 'For nested loops, add up the inner passes for each outer value; it is a simple product only if the inner length is fixed.',
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
      solution:
        'The condition `x > 1` is checked before every pass.\n\n' +
        '| check `x > 1` | new x | steps |\n|---|---|---|\n| $100 > 1$ | 50 | 1 |\n| $50 > 1$ | 25 | 2 |\n| $25 > 1$ | 12 | 3 |\n| $12 > 1$ | 6 | 4 |\n| $6 > 1$ | 3 | 5 |\n| $3 > 1$ | 1 | 6 |\n| $1 > 1$ false: stop | | |\n\n' +
        'Output: `6`.',
      whyWrong: [
        'This uses ordinary division: 12.5, 6.25, 3.125, 1.5625, which is still above 1, so one extra pass is needed. With `div` the decimals are dropped and 3 halves straight to 1.',
        null,
        'This stops one pass too early, at $x = 3$. But $3 > 1$ is true, so the loop runs once more.',
        'This is the final value of `x`, not of `steps`.',
      ],
      keyIdea: 'Count while-loop passes with a trace table: check the condition, update, count, and repeat until the check fails.',
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
      solution:
        'The `for` loop runs with $i = 1, 2, 3, 4, 5$, so `product` ends at 120. The `while` loop must also run when $i = 5$, then stop at $i = 6$.\n\n' +
        '- `i <= 5` is true for 1 to 5 and false at 6: five passes, product 120.\n' +
        '- `i < 5` and `i != 5` both stop as soon as $i = 5$: four passes, product 24.\n' +
        '- `i >= 5` is false at the start: no passes, product 1.',
      whyWrong: [
        null,
        'This stops before using 5, so it runs only 4 passes and prints 24.',
        'This is false when $i = 1$, so the body never runs.',
        'This stops as soon as $i$ reaches 5, so 5 is never multiplied in and it prints 24.',
      ],
      keyIdea: 'To rewrite an inclusive `for` as a `while`, keep the start value, use `<=`, and update the counter at the end of the body.',
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
      solution:
        '`range(1, 31)` stops before 31, so `n` runs from 1 to 30. `count` goes up once for every `n` that is a multiple of 3 **or** of 5.\n\n' +
        '- Multiples of 3 up to 30: $30 \\div 3 = 10$ numbers.\n' +
        '- Multiples of 5 up to 30: $30 \\div 5 = 6$ numbers.\n' +
        '- 15 and 30 are multiples of both and have been counted twice: $10 + 6 - 2 = 14$.\n\n' +
        'Output: `14`.',
      whyWrong: [
        'This adds 10 and 6 without noticing that 15 and 30 were counted twice. Each `n` can add at most 1.',
        'This reads `or` as `and`, counting only numbers divisible by both 3 and 5 (15 and 30).',
        null,
        'This leaves out 30, as if `range(1, 31)` stopped at 29. It stops before 31, so the last value is 30.',
      ],
      keyIdea: 'A counter with an `if` inside a loop counts how many items pass the test; `or` passes if at least one part is true.',
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
      solution:
        'Each pass first increases `n` by 1, then adds the new `n` to `total`. The check happens at the top.\n\n' +
        '| check `total <= 20` | n | total |\n|---|---|---|\n| $0 \\le 20$ | 1 | 1 |\n| $1 \\le 20$ | 2 | 3 |\n| $3 \\le 20$ | 3 | 6 |\n| $6 \\le 20$ | 4 | 10 |\n| $10 \\le 20$ | 5 | 15 |\n| $15 \\le 20$ | 6 | 21 |\n| $21 \\le 20$ false: stop | | |\n\n' +
        'Output: `6` then `21`.',
      whyWrong: [
        'This stops at the last total that is still at most 20. But $15 \\le 20$ is true, so the loop runs once more.',
        'This swaps the two lines in the body, adding `n` to `total` before increasing `n`.',
        'This runs one pass too many. After `total` becomes 21, the check $21 \\le 20$ is false and the loop stops.',
        null,
      ],
      keyIdea: 'Trace a while loop row by row: check the condition, then do the body lines in order; stop at the first failed check.',
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
      solution:
        'The loop continues as long as `i` is **not equal** to 0.\n\n' +
        '| i at the check | `i != 0` | new i |\n|---|---|---|\n| 10 | true | 7 |\n| 7 | true | 4 |\n| 4 | true | 1 |\n| 1 | true | -2 |\n| -2 | true | -5 |\n\n' +
        'Counting down by 3 from 10 never lands exactly on 0, so the condition stays true for ever.\n\nAnswer: Infinite loop.',
      whyWrong: [
        null,
        'This assumes the loop stops before going negative, as if the condition were `i > 3`. The condition is `i != 0`.',
        'This assumes the loop stops once `i` drops below 0, as if the condition were `i > 0`. `-2 != 0` is still true.',
        'This assumes `i` reaches 0. The values are 10, 7, 4, 1, then $-2$, jumping over 0.',
      ],
      keyIdea: 'A `!=` stopping condition is dangerous: if the counter can jump over the target value, the loop never ends.',
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
      solution:
        '`mod(i,2) == 0` is true when `i` is **even**. So only 2, 4, 6, 8, 10 are used, and each adds its **square** to `s`.\n\n' +
        '| i | i * i | s |\n|---|---|---|\n| 2 | 4 | 4 |\n| 4 | 16 | 20 |\n| 6 | 36 | 56 |\n| 8 | 64 | 120 |\n| 10 | 100 | 220 |\n\n' +
        'Output: `220`.',
      whyWrong: [
        'This adds the squares of the **odd** numbers. A remainder of 0 picks out the even ones.',
        'This ignores the `if` and adds the squares of all numbers from 1 to 10.',
        'This adds `i` instead of `i * i`.',
        null,
      ],
      keyIdea: 'An `if` inside a loop filters which passes update the accumulator.',
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
      solution:
        '| pass | n before | n after |\n|---|---|---|\n| 1 | 40 | 33 |\n| 2 | 33 | 26 |\n| 3 | 26 | 19 |\n| 4 | 19 | 12 |\n| 5 | 12 | 5 |\n| 6 | 5 | -2 |\n\n' +
        'Now `n > 0` is false, so the body ran **6** times.',
      whyWrong: [
        null,
        'This stops when `n` is 5. But $5 > 0$ is true, so there is one more pass.',
        'This runs one pass too many. After `n` becomes $-2$, the check fails.',
        '`n` falls on every pass, so `n > 0` eventually fails and the loop stops.',
      ],
      keyIdea: 'Count passes by checking the condition before each one; the last pass can take the variable past the limit.',
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
      solution:
        '`while (true)` keeps going until `break` runs. Here `break` runs on the first pass that leaves `n` below 0.\n\n' +
        '| pass | n after | n < 0? |\n|---|---|---|\n| 1 | 42 | no |\n| 2 | 34 | no |\n| 3 | 26 | no |\n| 4 | 18 | no |\n| 5 | 10 | no |\n| 6 | 2 | no |\n| 7 | -6 | yes: `break` |\n\n' +
        'The body ran **7** times.',
      whyWrong: [
        null,
        'This stops when `n` is 2. But $2 < 0$ is false, so the loop carries on.',
        'This runs one pass too many. `break` ends the loop on the pass that makes `n` negative.',
        'The `break` does run, because `n` falls by 8 each pass and soon drops below 0.',
      ],
      keyIdea: 'With `while (true)`, the loop ends on the pass where the `break` test first succeeds.',
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
      solution:
        'The inner loop starts at the current `i`, so it gets shorter each time.\n\n' +
        '| i | values of j | inner passes |\n|---|---|---|\n| 1 | 1, 2, 3, 4 | 4 |\n| 2 | 2, 3, 4 | 3 |\n| 3 | 3, 4 | 2 |\n\n' +
        'Total: $4 + 3 + 2 = 9$.',
      whyWrong: [
        null,
        'This multiplies $3 \\times 4$, as if the inner loop always ran 4 times.',
        'This adds $4 + 3 + 2 + 1$, as if the outer loop went up to 4. It stops at 3.',
        'This adds $1 + 2 + 3$, as if `j` ran from 1 to `i`. Here `j` runs from `i` to 4.',
      ],
      keyIdea: 'When the inner range depends on the outer variable, add the inner lengths pass by pass.',
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
      solution:
        '`n` starts at 1 and goes up by 2, so it takes the values 3, 5, 7, 9, 11, 13, and so on. These are all odd.\n\n' +
        'So `n == 10` is never true, `break` never runs, and the loop never ends.\n\nAnswer: Infinite loop.',
      whyWrong: [
        null,
        'This assumes `n` lands on 10. Starting at 1 and adding 2 only ever gives odd numbers.',
        'This assumes the loop stops at the last value below 10. Only `n == 10` can trigger the `break`.',
        'This assumes the loop stops at the first value above 10. The test is `==`, not `>=`.',
      ],
      keyIdea: 'Check whether the `break` test can ever be true; a variable can jump over the exact value it is compared with.',
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
      solution:
        '| n | mod(n,4) | t |\n|---|---|---|\n| 23 | 3 | 3 |\n| 18 | 2 | 5 |\n| 13 | 1 | 6 |\n| 8 | 0 | 6 |\n| 3 | 3 | 9 |\n\n' +
        'After the last row `n` becomes $-2$, so the loop breaks and prints 9.\n\nOutput: `9`.',
      whyWrong: [
        null,
        'This stops one pass early, at $n = 3$. `n` is 3 after the fourth pass, and $3 \\le 0$ is false, so there is another pass.',
        'This stops after the first pass. `break` runs only when `n` is 0 or below.',
        '`n` falls by 5 each pass, so `n <= 0` soon becomes true and `break` runs.',
      ],
      keyIdea: 'Trace `while (true)` loops row by row and test the `break` condition after each update.',
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
      solution:
        'The loop adds $1 + 2 + \\dots + 100$. No need to trace it: the sum of the first $n$ whole numbers is $\\frac{n(n + 1)}{2}$.\n\n' +
        '$$\\frac{100 \\times 101}{2} = 5050$$\n\n' +
        'Output: `5050`.',
      whyWrong: [
        null,
        'This stops at 99. `for i = 1 to 100` includes 100.',
        'This forgets to divide by 2 in the formula.',
        'This counts the passes, as if the line were `t = t + 1`.',
      ],
      keyIdea: 'For a long accumulator loop, use $1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}$.',
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
      solution:
        '| x | s | new x |\n|---|---|---|\n| 2 | 2 | 4 |\n| 4 | 6 | 6 |\n| 6 | 12 | 8 |\n| 8 | 20 | 10 |\n| 10 | 30 | 12 |\n\n' +
        'Then $12 \\le 10$ is false, so the loop stops.\n\nOutput: `30`.',
      whyWrong: [
        null,
        'This leaves out 10, as if the condition were `x < 10`. `<=` includes 10.',
        'This also adds 12. The check $12 \\le 10$ fails before the body runs again.',
        '`x` goes up on every pass, so it soon passes 10 and the loop stops.',
      ],
      keyIdea: 'Check the last pass carefully: `<=` includes the limit and `<` does not.',
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
      solution:
        'In Python the loop body is the indented block, and the condition is checked before each pass.\n\n' +
        '| check `n < 100` | new n | count |\n|---|---|---|\n| $1 < 100$ | 3 | 1 |\n| $3 < 100$ | 9 | 2 |\n| $9 < 100$ | 27 | 3 |\n| $27 < 100$ | 81 | 4 |\n| $81 < 100$ | 243 | 5 |\n| $243 < 100$ false: stop | | |\n\n' +
        'Output: `5`.',
      whyWrong: [
        null,
        'This stops at 81. But $81 < 100$ is true, so there is one more pass.',
        'This is the final value of `n`. The code prints `count`.',
        'This runs one pass too many. Once `n` is 243 the check fails.',
      ],
      keyIdea: 'A Python `while` works like the pseudocode one: test at the top, then run the indented block.',
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
