import type { StaticQuestion } from '../../../types';

const L = (...lines: string[]) => lines.join('\n');

/** Values produced by Python's range(start, stop, step), re-implemented with a loop. */
function rangeVals(start: number, stop: number, step = 1): number[] {
  const out: number[] = [];
  if (step > 0) for (let v = start; v < stop; v += step) out.push(v);
  else for (let v = start; v > stop; v += step) out.push(v);
  return out;
}
const pyRepr = (xs: number[]) => `[${xs.join(', ')}]`;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'loops-001',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(list(range(2, 10, 3)))' },
    options: ['`[2, 5, 8, 11]`', '`[2, 5, 8]`', '`[3, 6, 9]`', '`[2, 3, 4, 5, 6, 7, 8, 9]`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`range(start, stop, step)` starts **at** `start`, adds `step` each time, and stops **before** reaching `stop` (the stop value is never included).\n\n' +
        '1. Start at 2.\n' +
        '2. Add 3: 5. Still less than 10, keep it.\n' +
        '3. Add 3: 8. Still less than 10, keep it.\n' +
        '4. Add 3: 11. This is not less than 10, so the range stops here and 11 is **not** included.\n\n' +
        'So the list is `[2, 5, 8]`.',
      whyWrong: [
        'This goes one step too far. The range stops as soon as the next value would reach or pass 10, so 11 is never produced.',
        null,
        'This starts counting at the step (3) instead of at the start value. The first value of `range(2, 10, 3)` is always 2.',
        'This ignores the third argument. The step of 3 means jump by 3 each time, not by 1.',
      ],
      keyIdea: '`range(start, stop, step)` begins at start, jumps by step, and never includes stop.',
    },
    check: {
      optionValues: ['[2, 5, 8, 11]', '[2, 5, 8]', '[3, 6, 9]', '[2, 3, 4, 5, 6, 7, 8, 9]'],
      compute: () => pyRepr(rangeVals(2, 10, 3)),
    },
    python: { stdout: '[2, 5, 8]\n' },
  },
  {
    id: 'loops-002',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'How many times is `hi` printed by this loop?',
    code: { lang: 'python', source: L('for i in range(4, 20):', '    print("hi")') },
    options: ['$17$', '$20$', '$15$', '$16$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`range(4, 20)` gives the values $4, 5, 6, \\dots, 19$. It includes the start (4) but **not** the stop (20).\n\n' +
        'The number of values in `range(a, b)` is simply $b - a$:\n\n' +
        '$$20 - 4 = 16$$\n\n' +
        'Check with a small case: `range(4, 6)` gives 4 and 5, which is $6 - 4 = 2$ values. So the loop body runs 16 times and `hi` is printed $16$ times.',
      whyWrong: [
        'This counts both ends, 4 **and** 20, using "last minus first plus one" with last = 20. But 20 is the stop value and is not included; the last value is 19.',
        'This reads only the stop value. The loop starts at 4, not at 0, so it runs fewer than 20 times.',
        'This removes one value too many, as if both the start and the stop were excluded. The start value 4 is included.',
        null,
      ],
      keyIdea: '`range(a, b)` with step 1 produces exactly $b - a$ values: a is included, b is not.',
    },
    check: {
      optionValues: [17, 20, 15, 16],
      compute: () => rangeVals(4, 20).length,
    },
  },
  {
    id: 'loops-003',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does this Python code print? (If more than one line is printed, the lines are shown separated by spaces.)',
    code: {
      lang: 'python',
      source: L('total = 0', 'for x in [3, 1, 4, 1, 5]:', '    total = total + x', 'print(total)'),
    },
    options: ['`14`', '`5`', '`11`', '`3 4 8 9 14`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`total` is an **accumulator**: it starts at 0 and each pass of the loop adds the current item to it.\n\n' +
        '| item `x` | `total` after the line runs |\n|---|---|\n| 3 | $0 + 3 = 3$ |\n| 1 | $3 + 1 = 4$ |\n| 4 | $4 + 4 = 8$ |\n| 1 | $8 + 1 = 9$ |\n| 5 | $9 + 5 = 14$ |\n\n' +
        'The `print` is **not** indented, so it runs once, after the loop has finished. Output: `14`.',
      whyWrong: [
        null,
        'This is the last item only. That would happen with `total = x`, which overwrites the total instead of adding to it.',
        'This skips the first item (3), as if the loop started from the second element. A `for` loop over a list visits every element, starting with the first.',
        'These are the running totals. They would only all be printed if `print(total)` were indented inside the loop; here it runs once, after the loop.',
      ],
      keyIdea: 'An accumulator starts at 0 and adds each item in turn; a print after the loop (not indented) runs only once.',
    },
    check: {
      optionValues: [14, 5, 11, null],
      compute: () => {
        let total = 0;
        for (const x of [3, 1, 4, 1, 5]) total += x;
        return total;
      },
    },
    python: { stdout: '14\n' },
  },
  {
    id: 'loops-004',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: L('n = 1', 'while n < 20:', '    n = n * 2', 'print(n)') },
    options: ['`16`', '`20`', '`32`', '`64`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A `while` loop checks its condition **before** every pass. It keeps going while `n < 20` is true.\n\n' +
        '| check `n < 20` | `n` after `n = n * 2` |\n|---|---|\n| $1 < 20$ true | 2 |\n| $2 < 20$ true | 4 |\n| $4 < 20$ true | 8 |\n| $8 < 20$ true | 16 |\n| $16 < 20$ true | 32 |\n| $32 < 20$ **false**: stop | |\n\n' +
        'The condition is only checked at the top of the loop, so `n` is allowed to "overshoot" 20 on the last pass. Output: `32`.',
      whyWrong: [
        'This is the last value that is still less than 20. But when $n = 16$ the condition $16 < 20$ is true, so the loop runs once more and doubles it to 32.',
        'This assumes the loop stops exactly at the limit. `n` only ever takes the values 1, 2, 4, 8, 16, 32, so it can never equal 20.',
        null,
        'This doubles one time too many. After $n$ becomes 32 the check $32 < 20$ is false, so the loop stops before doubling again.',
      ],
      keyIdea: 'A while loop checks its condition only at the top, so the variable can overshoot the limit on the final pass.',
    },
    check: {
      optionValues: [16, 20, 32, 64],
      compute: () => {
        let n = 1;
        while (n < 20) n *= 2;
        return n;
      },
    },
    python: { stdout: '32\n' },
  },
  {
    id: 'loops-005',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'What does this Python code print? (`end=""` means nothing is printed between the characters.)',
    code: {
      lang: 'python',
      source: L('for ch in "python":', '    if ch == "h":', '        break', '    print(ch, end="")'),
    },
    options: ['`pyth`', '`pyton`', '`python`', '`pyt`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The loop visits the characters of `"python"` one at a time. `break` immediately ends the **whole loop**.\n\n' +
        '1. `p`: not `"h"`, so print `p`.\n' +
        '2. `y`: not `"h"`, so print `y`.\n' +
        '3. `t`: not `"h"`, so print `t`.\n' +
        '4. `h`: equals `"h"`, so `break` runs. The loop ends **before** the `print` line, so `h` is not printed, and `o`, `n` are never visited.\n\n' +
        'Output: `pyt`.',
      whyWrong: [
        'This prints the `h` before stopping. The `if` check comes **before** the `print`, so the loop breaks before `h` can be printed.',
        'This treats `break` like `continue` (skip just this character and carry on). `break` ends the loop completely, so `o` and `n` are never printed.',
        'This assumes `break` only leaves the `if` block. In fact `break` exits the whole `for` loop.',
        null,
      ],
      keyIdea: '`break` ends the entire loop at once; any lines below it in the loop body are skipped.',
    },
    check: {
      optionValues: ['pyth', 'pyton', 'python', 'pyt'],
      compute: () => {
        let out = '';
        for (const ch of 'python') {
          if (ch === 'h') break;
          out += ch;
        }
        return out;
      },
    },
    python: { stdout: 'pyt' },
  },
  {
    id: 'loops-006',
    subtopic: 'loops',
    difficulty: 'foundation',
    stem: 'Which loop prints the whole numbers from 1 to 10 inclusive (1 and 10 both printed), one per line?',
    options: [
      '`for i in range(10): print(i)`',
      '`for i in range(1, 10): print(i)`',
      '`for i in range(1, 11): print(i)`',
      '`for i in range(0, 11): print(i)`',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'The stop value of `range` is **never included**, so to finish at 10 the stop must be one more: 11. To start at 1 the start must be 1.\n\n' +
        '- `range(10)` gives $0, 1, \\dots, 9$.\n' +
        '- `range(1, 10)` gives $1, 2, \\dots, 9$.\n' +
        '- `range(1, 11)` gives $1, 2, \\dots, 10$. This is what we want.\n' +
        '- `range(0, 11)` gives $0, 1, \\dots, 10$.\n\n' +
        'So the correct loop is `for i in range(1, 11): print(i)`.',
      whyWrong: [
        'With one argument, `range(10)` starts at 0 and stops before 10, so it prints 0 to 9: it includes 0 and misses 10.',
        'This is the classic off-by-one error: the stop value 10 is excluded, so it prints only 1 to 9.',
        null,
        'This does reach 10, but it starts at 0, so it prints 11 numbers including an unwanted 0.',
      ],
      keyIdea: 'To loop from a to b inclusive in Python, use `range(a, b + 1)`.',
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'loops-007',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('total = 0', 'for i in range(1, 11):', '    if i % 3 == 0:', '        continue', '    total = total + i', 'print(total)'),
    },
    options: ['`18`', '`37`', '`55`', '`3`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`range(1, 11)` gives 1 to 10. `continue` skips the **rest of this pass only** and jumps to the next value of `i`, so the multiples of 3 (3, 6, 9) are never added.\n\n' +
        'Numbers that get added: $1, 2, 4, 5, 7, 8, 10$.\n\n' +
        '$$1 + 2 + 4 + 5 + 7 + 8 + 10 = 37$$\n\n' +
        'Quick check: the sum of 1 to 10 is 55, and the skipped numbers add to $3 + 6 + 9 = 18$, so $55 - 18 = 37$. Output: `37`.',
      whyWrong: [
        'This is the total of the numbers that were **skipped** ($3 + 6 + 9$). `continue` jumps past the adding line for those values, so they are the ones left out.',
        null,
        'This ignores the `continue` and adds every number from 1 to 10.',
        'This treats `continue` like `break`: it adds 1 and 2, then stops the loop at $i = 3$. `continue` only skips that one pass.',
      ],
      keyIdea: '`continue` skips the rest of the current pass and moves on to the next one; `break` would stop the loop entirely.',
    },
    check: {
      optionValues: [18, 37, 55, 3],
      compute: () => {
        let total = 0;
        for (const i of rangeVals(1, 11)) {
          if (i % 3 === 0) continue;
          total += i;
        }
        return total;
      },
    },
    python: { stdout: '37\n' },
  },
  {
    id: 'loops-008',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('count = 0', 'for i in range(4):', '    for j in range(i):', '        count = count + 1', 'print(count)'),
    },
    options: ['`16`', '`10`', '`4`', '`6`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The outer loop gives $i = 0, 1, 2, 3$. For each one, the inner loop `range(i)` runs exactly $i$ times.\n\n' +
        '| `i` | values of `j` | inner passes |\n|---|---|---|\n| 0 | (none) | 0 |\n| 1 | 0 | 1 |\n| 2 | 0, 1 | 2 |\n| 3 | 0, 1, 2 | 3 |\n\n' +
        'Total: $0 + 1 + 2 + 3 = 6$. Output: `6`.',
      whyWrong: [
        'This multiplies $4 \\times 4$, as if the inner loop always ran 4 times. Here the inner loop is `range(i)`, so its length changes with `i`.',
        'This adds $1 + 2 + 3 + 4$, as if the inner loop were `range(i + 1)`. `range(i)` stops before `i`, so it runs $i$ times, and when $i = 0$ it runs 0 times.',
        'This counts only the outer loop passes. The `count` line is inside the inner loop, so it runs once per inner pass.',
        null,
      ],
      keyIdea: 'For nested loops, add up the number of inner passes for each outer value; when the inner range depends on i, it is not just a product.',
    },
    check: {
      optionValues: [16, 10, 4, 6],
      compute: () => {
        let count = 0;
        for (const i of rangeVals(0, 4)) for (const _j of rangeVals(0, i)) count++;
        return count;
      },
    },
    python: { stdout: '6\n' },
  },
  {
    id: 'loops-009',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print? (`//` is whole-number division, for example `25 // 2` is `12`.)',
    code: {
      lang: 'python',
      source: L('x = 100', 'steps = 0', 'while x > 1:', '    x = x // 2', '    steps = steps + 1', 'print(steps)'),
    },
    options: ['`7`', '`6`', '`5`', '`1`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Trace the loop. The condition `x > 1` is checked before every pass.\n\n' +
        '| check `x > 1` | new `x` | `steps` |\n|---|---|---|\n| $100 > 1$ | 50 | 1 |\n| $50 > 1$ | 25 | 2 |\n| $25 > 1$ | 12 | 3 |\n| $12 > 1$ | 6 | 4 |\n| $6 > 1$ | 3 | 5 |\n| $3 > 1$ | 1 | 6 |\n| $1 > 1$ false: stop | | |\n\n' +
        'Output: `6`.',
      whyWrong: [
        'This uses ordinary division `/` instead of `//`: $25 / 2 = 12.5$, then $6.25$, $3.125$, $1.5625$, which is still above 1, so one extra pass is needed. With `//` the decimals are dropped and 3 halves straight to 1.',
        null,
        'This stops one pass too early, at $x = 3$. But $3 > 1$ is true, so the loop runs once more (3 becomes 1) before stopping.',
        'This is the final value of `x`, not of `steps`. The code prints `steps`.',
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
    python: { stdout: '6\n' },
  },
  {
    id: 'loops-010',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print? (If more than one line is printed, the lines are shown separated by spaces.)',
    code: {
      lang: 'python',
      source: L('n = 15', 'for d in range(2, n):', '    if n % d == 0:', '        print(d)', '        break', 'else:', '    print("prime")'),
    },
    options: ['`3 prime`', '`prime`', '`3`', '`3 5 prime`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A `for ... else` loop runs its `else` block **only if the loop finishes without hitting `break`**.\n\n' +
        '1. $d = 2$: $15 \\div 2$ leaves remainder 1, so `15 % 2` is 1. Not a divisor.\n' +
        '2. $d = 3$: `15 % 3` is 0. Print `3`, then `break`.\n\n' +
        'Because the loop was ended by `break`, the `else` block is skipped, so `prime` is **not** printed. Output: `3`.',
      whyWrong: [
        'This assumes the `else` block always runs after the loop. It only runs when the loop ends normally; a `break` skips it.',
        'This is what happens when no divisor is found and the loop runs to the end. But 3 divides 15, so the loop breaks.',
        null,
        'This ignores the `break`: the loop carries on, prints 5 as well, finishes normally and then runs the `else`. The `break` stops the loop right after printing 3.',
      ],
      keyIdea: 'The `else` of a loop runs only when the loop was not ended by `break`; it means "nothing was found".',
    },
    check: {
      optionValues: ['3 prime', 'prime', '3', '3 5 prime'],
      compute: () => {
        const n = 15;
        const out: string[] = [];
        let broke = false;
        for (const d of rangeVals(2, n)) {
          if (n % d === 0) {
            out.push(String(d));
            broke = true;
            break;
          }
        }
        if (!broke) out.push('prime');
        return out.join(' ');
      },
    },
    python: { stdout: '3\n' },
  },
  {
    id: 'loops-011',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(list(range(10, 0, -3)))' },
    options: ['`[]`', '`[9, 6, 3, 0]`', '`[1, 4, 7, 10]`', '`[10, 7, 4, 1]`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'With a **negative** step, `range` counts **down**. It still includes the start and still excludes the stop; it keeps going while the value is **greater than** the stop.\n\n' +
        '1. Start at 10.\n' +
        '2. $10 - 3 = 7$ (greater than 0, keep).\n' +
        '3. $7 - 3 = 4$ (keep).\n' +
        '4. $4 - 3 = 1$ (keep).\n' +
        '5. $1 - 3 = -2$, which is not greater than 0, so stop.\n\n' +
        'Output: `[10, 7, 4, 1]`.',
      whyWrong: [
        'This is what `range(10, 0)` gives with the default step of +1 (you cannot count up from 10 to 0). The step of $-3$ makes it count down, so it is not empty.',
        'This takes the upward range `range(0, 10, 3)` (0, 3, 6, 9) and just reads it backwards. A negative-step range does not work like that: it starts exactly at its start value, 10, and goes down by 3 from there.',
        'This lists the right numbers in the wrong order. A negative step counts downwards from the start, so 10 comes first.',
        null,
      ],
      keyIdea: 'A negative step makes `range` count down from start, stopping before it reaches stop.',
    },
    check: {
      optionValues: ['[]', '[9, 6, 3, 0]', '[1, 4, 7, 10]', '[10, 7, 4, 1]'],
      compute: () => pyRepr(rangeVals(10, 0, -3)),
    },
    python: { stdout: '[10, 7, 4, 1]\n' },
  },
  {
    id: 'loops-012',
    subtopic: 'loops',
    difficulty: 'exam',
    stem:
      'In this pseudocode, `for i = 1 to 5` runs with $i = 1, 2, 3, 4, 5$ (both ends included). Which of the four WHILE loops prints the same output as the FOR loop?',
    code: {
      lang: 'pseudocode',
      source: L(
        'FOR loop:',
        'product = 1',
        'for i = 1 to 5',
        '    product = product * i',
        'print(product)',
        '',
        'Loop P:',
        'product = 1',
        'i = 1',
        'while i < 5',
        '    product = product * i',
        '    i = i + 1',
        'print(product)',
        '',
        'Loop Q:',
        'product = 1',
        'i = 1',
        'while i <= 5',
        '    product = product * i',
        '    i = i + 1',
        'print(product)',
        '',
        'Loop R:',
        'product = 1',
        'i = 1',
        'while i <= 5',
        '    i = i + 1',
        '    product = product * i',
        'print(product)',
        '',
        'Loop S:',
        'product = 1',
        'i = 0',
        'while i <= 5',
        '    product = product * i',
        '    i = i + 1',
        'print(product)',
      ),
    },
    options: ['Loop P', 'Loop Q', 'Loop R', 'Loop S'],
    correctIndex: 1,
    markScheme: {
      solution:
        'First find what the FOR loop prints: $1 \\times 1 \\times 2 \\times 3 \\times 4 \\times 5 = 120$.\n\n' +
        'Now trace each WHILE loop:\n\n' +
        '- **Loop P**: the condition `i < 5` is false when $i = 5$, so 5 is never multiplied in: $1 \\times 2 \\times 3 \\times 4 = 24$.\n' +
        '- **Loop Q**: multiplies by $i = 1, 2, 3, 4, 5$, then $i$ becomes 6 and `6 <= 5` is false: $120$. Same as the FOR loop.\n' +
        '- **Loop R**: increases `i` **before** multiplying, so it multiplies by $2, 3, 4, 5, 6$: $720$.\n' +
        '- **Loop S**: starts at $i = 0$, so the very first multiplication makes `product` 0, and it stays 0.\n\n' +
        'So Loop Q matches. A correct WHILE version needs: the same starting value, the same (inclusive) condition, and the update **after** the work.',
      whyWrong: [
        'Loop P uses `i < 5`, so the loop stops before using 5 and prints 24. To include the last value the condition must be `i <= 5`.',
        null,
        'Loop R adds 1 to `i` before using it, so it multiplies by 2 up to 6 and prints 720. The update must come after the work, as in the FOR loop.',
        'Loop S starts the counter at 0, and multiplying by 0 makes the product 0 for good. The FOR loop starts at 1.',
      ],
      keyIdea: 'To rewrite a FOR loop as a WHILE loop, copy its start value, use an inclusive condition for an inclusive range, and update the counter after the loop body.',
    },
    check: {
      optionValues: [24, 120, 720, 0],
      compute: () => {
        let product = 1;
        for (let i = 1; i <= 5; i++) product *= i;
        return product;
      },
    },
  },
  {
    id: 'loops-013',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('count = 0', 'for n in range(1, 31):', '    if n % 3 == 0 or n % 5 == 0:', '        count = count + 1', 'print(count)'),
    },
    options: ['`16`', '`2`', '`14`', '`13`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`range(1, 31)` gives 1 to 30 (30 is included because the stop is 31). `count` goes up once for every $n$ that is a multiple of 3 **or** of 5.\n\n' +
        '- Multiples of 3 up to 30: $3, 6, \\dots, 30$, that is $30 \\div 3 = 10$ numbers.\n' +
        '- Multiples of 5 up to 30: $5, 10, \\dots, 30$, that is $30 \\div 5 = 6$ numbers.\n' +
        '- 15 and 30 are multiples of both, and have been counted twice. Each $n$ only adds 1 once, so subtract them: $10 + 6 - 2 = 14$.\n\n' +
        'Listing them as a check: 3, 5, 6, 9, 10, 12, 15, 18, 20, 21, 24, 25, 27, 30 (14 numbers). Output: `14`.',
      whyWrong: [
        'This adds 10 and 6 without noticing that 15 and 30 were counted twice. Each `n` passes through the `if` once, so it can add at most 1.',
        'This reads `or` as `and`, counting only numbers divisible by both 3 and 5 (15 and 30).',
        null,
        'This leaves out 30, as if `range(1, 31)` stopped at 29. The stop value 31 is excluded, so the last value is 30.',
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
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('total = 0', 'n = 0', 'while total <= 20:', '    n = n + 1', '    total = total + n', 'print(n, total)'),
    },
    options: ['`5 15`', '`7 21`', '`7 28`', '`6 21`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each pass first increases `n` by 1, then adds the new `n` to `total`. The check `total <= 20` happens at the top.\n\n' +
        '| check `total <= 20` | `n` | `total` |\n|---|---|---|\n| $0 \\le 20$ | 1 | 1 |\n| $1 \\le 20$ | 2 | 3 |\n| $3 \\le 20$ | 3 | 6 |\n| $6 \\le 20$ | 4 | 10 |\n| $10 \\le 20$ | 5 | 15 |\n| $15 \\le 20$ | 6 | 21 |\n| $21 \\le 20$ false: stop | | |\n\n' +
        '`print(n, total)` prints both values separated by a space: `6 21`.',
      whyWrong: [
        'This stops at the last total that is still at most 20. But the check $15 \\le 20$ is true, so the loop runs once more.',
        'This swaps the two lines in the body (adding `n` to `total` before increasing `n`). In this code `n` is increased first, so the pass that makes `total` 21 leaves `n` at 6.',
        'This runs one pass too many. After `total` becomes 21, the check $21 \\le 20$ is false and the loop stops.',
        null,
      ],
      keyIdea: 'Trace a while loop row by row: check the condition, then do the body lines in order; the loop stops at the first failed check.',
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
    python: { stdout: '6 21\n' },
  },
  {
    id: 'loops-015',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'What happens when this Python code runs?',
    code: { lang: 'python', source: L('i = 10', 'while i != 0:', '    print(i)', '    i = i - 3') },
    options: [
      'It prints 10, 7, 4, 1 and then stops.',
      'It prints 10, 7, 4, 1, -2 and then stops.',
      'It never stops (an infinite loop), because `i` jumps from 1 to -2 and is never exactly 0.',
      'It prints nothing, because the condition is false at the start.',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'The loop continues as long as `i != 0` (i is **not equal** to 0).\n\n' +
        '1. $i = 10$: print 10, then $i = 7$.\n' +
        '2. $i = 7$: print 7, then $i = 4$.\n' +
        '3. $i = 4$: print 4, then $i = 1$.\n' +
        '4. $i = 1$: print 1, then $i = -2$.\n' +
        '5. $i = -2$: still not 0, so it carries on: $-5, -8, -11, \\dots$\n\n' +
        'Counting down by 3 from 10 never lands exactly on 0, so `i != 0` is always true and the loop never ends. Using `while i > 0:` instead would stop safely after printing 1.',
      whyWrong: [
        'This assumes the loop stops once `i` drops below 0, as if the condition were `i > 0`. The condition `i != 0` is still true for negative numbers.',
        'This stops after one negative value, but nothing in the condition treats negatives differently. `i` keeps decreasing forever.',
        null,
        'At the start $i = 10$, and $10 \\ne 0$ is true, so the loop body does run.',
      ],
      keyIdea: 'A `!=` stopping condition is dangerous: if the counter can jump over the target value, the loop never ends.',
    },
  },
  {
    id: 'loops-016',
    subtopic: 'loops',
    difficulty: 'exam',
    stem: 'In this pseudocode, `for i = 1 to 10` includes both 1 and 10, and `mod` gives the remainder after division. What is printed?',
    code: {
      lang: 'pseudocode',
      source: L('s = 0', 'for i = 1 to 10', '    if i mod 2 == 0 then', '        s = s + i * i', '    end if', 'end for', 'print(s)'),
    },
    options: ['$165$', '$385$', '$30$', '$220$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`i mod 2 == 0` is true when $i$ is **even**. So only $i = 2, 4, 6, 8, 10$ are used, and each one adds its **square** to `s`.\n\n' +
        '| `i` | `i * i` | `s` |\n|---|---|---|\n| 2 | 4 | 4 |\n| 4 | 16 | 20 |\n| 6 | 36 | 56 |\n| 8 | 64 | 120 |\n| 10 | 100 | 220 |\n\n' +
        'Printed value: $220$.',
      whyWrong: [
        'This adds the squares of the **odd** numbers ($1 + 9 + 25 + 49 + 81$). `i mod 2 == 0` picks out numbers with remainder 0, which are the even ones.',
        'This ignores the `if` and adds the squares of all numbers from 1 to 10.',
        'This adds `i` instead of `i * i` ($2 + 4 + 6 + 8 + 10$).',
        null,
      ],
      keyIdea: 'An `if` inside a loop filters which passes update the accumulator; trace only the passes that pass the test.',
    },
    check: {
      optionValues: [165, 385, 30, 220],
      compute: () => {
        let s = 0;
        for (let i = 1; i <= 10; i++) if (i % 2 === 0) s += i * i;
        return s;
      },
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'loops-017',
    subtopic: 'loops',
    difficulty: 'challenge',
    stem: 'What does this Python code print? (Everything is printed on one line.)',
    code: {
      lang: 'python',
      source: L(
        'for i in range(1, 4):',
        '    for j in range(1, 4):',
        '        if j == i:',
        '            break',
        '        print(i * j, end=" ")',
      ),
    },
    options: ['`2 3 2 6 3 6`', '`2 3 6`', '`1 2 4 3 6 9`', 'Nothing is printed.'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A `break` inside the **inner** loop only ends the inner loop. The outer loop then moves on to its next value.\n\n' +
        '- $i = 1$: $j = 1$ equals $i$, so break straight away. Nothing printed.\n' +
        '- $i = 2$: $j = 1$, print $2 \\times 1 = 2$. Then $j = 2$ equals $i$: break.\n' +
        '- $i = 3$: $j = 1$, print 3. $j = 2$, print 6. Then $j = 3$ equals $i$: break.\n\n' +
        'Output: `2 3 6`.',
      whyWrong: [
        'This treats `break` like `continue`: it skips only the case $j = i$ and keeps going, giving $2, 3$ (for $i = 1$), $2, 6$ (for $i = 2$) and $3, 6$ (for $i = 3$).',
        null,
        'This prints before checking, so each inner loop also prints the case $j = i$ before stopping. In the code the `if` comes first, so $i \\times i$ is never printed.',
        'This assumes `break` exits both loops at once when $i = 1, j = 1$. A `break` only leaves the innermost loop it is in.',
      ],
      keyIdea: 'In nested loops, `break` exits only the innermost loop; the outer loop carries on.',
    },
    check: {
      optionValues: ['2 3 2 6 3 6', '2 3 6', '1 2 4 3 6 9', null],
      compute: () => {
        const out: number[] = [];
        for (const i of rangeVals(1, 4)) {
          for (const j of rangeVals(1, 4)) {
            if (j === i) break;
            out.push(i * j);
          }
        }
        return out.join(' ');
      },
    },
    python: { stdout: '2 3 6 ' },
  },
  {
    id: 'loops-018',
    subtopic: 'loops',
    difficulty: 'challenge',
    stem: 'What does this Python code print? (Everything is printed on one line.)',
    code: {
      lang: 'python',
      source: L(
        'for n in range(10, 20):',
        '    for d in range(2, n):',
        '        if n % d == 0:',
        '            break',
        '    else:',
        '        print(n, end=" ")',
      ),
    },
    options: ['`10 12 14 15 16 18`', '`11 13 15 17 19`', 'Nothing is printed.', '`11 13 17 19`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Look at the indentation: the `else` lines up with the inner `for`, so it belongs to the **inner loop**, not to the `if`. It runs only when the inner loop finishes **without** a `break`, which means no divisor $d$ between 2 and $n - 1$ was found, so $n$ is **prime**.\n\n' +
        '| `n` | first divisor found | break? | printed? |\n|---|---|---|---|\n| 10 | 2 | yes | no |\n| 11 | none | no | yes |\n| 12 | 2 | yes | no |\n| 13 | none | no | yes |\n| 14 | 2 | yes | no |\n| 15 | 3 | yes | no |\n| 16 | 2 | yes | no |\n| 17 | none | no | yes |\n| 18 | 2 | yes | no |\n| 19 | none | no | yes |\n\n' +
        'Output: `11 13 17 19` (the primes between 10 and 19).',
      whyWrong: [
        'These are the numbers that **did** break. The loop `else` runs when there was no `break`, so it prints the numbers with no divisor.',
        'This only tests division by 2, so it lets 15 through. The inner loop also tries $d = 3$, and $15 \\div 3 = 5$ exactly, so 15 breaks.',
        'This assumes the `break` at $n = 10$ exits both loops. A `break` only leaves the inner loop; the outer loop carries on with 11, 12, and so on.',
        null,
      ],
      keyIdea: 'A loop `else` runs only if the loop finished without `break`, which is a neat way to say "no divisor was found".',
    },
    check: {
      optionValues: ['10 12 14 15 16 18', '11 13 15 17 19', null, '11 13 17 19'],
      compute: () => {
        const out: number[] = [];
        for (const n of rangeVals(10, 20)) {
          let broke = false;
          for (const d of rangeVals(2, n)) {
            if (n % d === 0) {
              broke = true;
              break;
            }
          }
          if (!broke) out.push(n);
        }
        return out.join(' ');
      },
    },
    python: { stdout: '11 13 17 19 ' },
  },
  {
    id: 'loops-019',
    subtopic: 'loops',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L(
        'count = 0',
        'i = 1',
        'while i < 100:',
        '    for j in range(i):',
        '        count = count + 1',
        '    i = i * 3',
        'print(count)',
      ),
    },
    options: ['`40`', '`121`', '`364`', '`5`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The outer `while` loop runs for $i = 1, 3, 9, 27, 81$ (each time multiplied by 3). The next value, 243, fails `i < 100`. For each $i$, the inner loop `range(i)` adds exactly $i$ to `count`.\n\n' +
        '| `i` | `i < 100`? | added to `count` | `count` |\n|---|---|---|---|\n| 1 | yes | 1 | 1 |\n| 3 | yes | 3 | 4 |\n| 9 | yes | 9 | 13 |\n| 27 | yes | 27 | 40 |\n| 81 | yes | 81 | 121 |\n| 243 | no: stop | | |\n\n' +
        'Output: `121`.',
      whyWrong: [
        'This stops before $i = 81$. But $81 < 100$ is true, so that pass runs and adds another 81.',
        null,
        'This also includes $i = 243$. The check $243 < 100$ is false, so that pass never happens.',
        'This counts the outer loop passes only. The `count` line is inside the inner loop, so each outer pass adds $i$, not 1.',
      ],
      keyIdea: 'With nested loops, total work = sum over the outer passes of the inner loop length.',
    },
    check: {
      optionValues: [40, 121, 364, 5],
      compute: () => {
        let count = 0;
        let i = 1;
        while (i < 100) {
          for (const _j of rangeVals(0, i)) count++;
          i *= 3;
        }
        return count;
      },
    },
    python: { stdout: '121\n' },
  },
  {
    id: 'loops-020',
    subtopic: 'loops',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('s = "loops"', 'result = ""', 'for i in range(len(s) - 1, 0, -1):', '    result = result + s[i]', 'print(result)'),
    },
    options: ['`spool`', '`spoo`', '`oops`', '`poo`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`len(s)` is 5, so the loop is `range(4, 0, -1)`. Counting down from 4 and stopping **before** 0 gives $i = 4, 3, 2, 1$. Index 0 is never used.\n\n' +
        'The characters of `"loops"` by index: 0 is `l`, 1 is `o`, 2 is `o`, 3 is `p`, 4 is `s`.\n\n' +
        '| `i` | `s[i]` | `result` |\n|---|---|---|\n| 4 | `s` | `s` |\n| 3 | `p` | `sp` |\n| 2 | `o` | `spo` |\n| 1 | `o` | `spoo` |\n\n' +
        'Output: `spoo`. (This is an off-by-one bug: to reverse the whole string the stop would need to be $-1$, i.e. `range(len(s) - 1, -1, -1)`.)',
      whyWrong: [
        'This assumes the loop reaches index 0. The stop value of `range` is never included, so `range(4, 0, -1)` ends at 1 and the `l` is missed.',
        null,
        'This walks forwards through indices 1 to 4. The step of $-1$ makes the loop go backwards, starting at index 4.',
        'This treats the start value as excluded too, starting at index 3. `range` always includes its start, so index 4 (`s`) is used first.',
      ],
      keyIdea: 'Counting down with `range(start, stop, -1)` still excludes stop, so reaching index 0 needs a stop of $-1$.',
    },
    check: {
      optionValues: ['spool', 'spoo', 'oops', 'poo'],
      compute: () => {
        const s = 'loops';
        let result = '';
        for (const i of rangeVals(s.length - 1, 0, -1)) result += s[i];
        return result;
      },
    },
    python: { stdout: 'spoo\n' },
  },
  {
    id: 'loops-021',
    subtopic: 'loops',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('a, b = 0, 1', 'for _ in range(6):', '    a, b = b, a + b', 'print(a)'),
    },
    options: ['`32`', '`13`', '`8`', '`5`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`range(6)` makes the loop run 6 times (the variable `_` is just a placeholder). The line `a, b = b, a + b` works out **both** right-hand values first, using the old `a` and `b`, and only then assigns them.\n\n' +
        '| pass | new `a` (old `b`) | new `b` (old `a + b`) |\n|---|---|---|\n| start | 0 | 1 |\n| 1 | 1 | $0 + 1 = 1$ |\n| 2 | 1 | $1 + 1 = 2$ |\n| 3 | 2 | $1 + 2 = 3$ |\n| 4 | 3 | $2 + 3 = 5$ |\n| 5 | 5 | $3 + 5 = 8$ |\n| 6 | 8 | $5 + 8 = 13$ |\n\n' +
        'Output: `8` (the Fibonacci numbers appear in `a`).',
      whyWrong: [
        'This does the assignments one after the other (`a = b` and then `b = a + b` using the **new** `a`), which doubles both numbers each pass. Tuple assignment uses the old values for both.',
        'This is the final value of `b`, not `a`. The code prints `a`.',
        null,
        'This runs only 5 passes. `range(6)` gives 0 to 5, which is 6 values, so the loop runs 6 times.',
      ],
      keyIdea: '`a, b = b, a + b` evaluates the whole right-hand side with the old values before assigning, so it steps through the Fibonacci sequence.',
    },
    check: {
      optionValues: [32, 13, 8, 5],
      compute: () => {
        let a = 0;
        let b = 1;
        for (let k = 0; k < 6; k++) [a, b] = [b, a + b];
        return a;
      },
    },
    python: { stdout: '8\n' },
  },
];
