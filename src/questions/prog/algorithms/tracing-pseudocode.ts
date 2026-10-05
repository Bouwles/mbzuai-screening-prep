import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

/** Pseudocode conventions repeated in stems so every question can be read on its own. */
const CONV = '(`for i = a to b` includes both `a` and `b`; `mod` gives the remainder and `div` gives whole-number division.)';

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
    stem: `How many stars are printed by this pseudocode? ${CONV}`,
    code: {
      lang: 'pseudocode',
      source: L('for k = 5 to 14', '    print("*")', 'end for'),
    },
    options: ['$10$', '$9$', '$14$', '$15$'],
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
      keyIdea: 'A loop `for k = a to b` (step 1, both ends included) runs $b - a + 1$ times.',
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
    stem: `What is printed? ${CONV} Multiplication is done before addition, as in normal maths.`,
    code: {
      lang: 'pseudocode',
      source: L('x = 17', 'if x mod 2 == 0 then', '    x = x div 2', 'else', '    x = 3 * x + 1', 'end if', 'print(x)'),
    },
    options: ['$8$', '$52$', '$54$', '$8.5$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. Test the condition: `17 mod 2` is the remainder when 17 is divided by 2. $17 = 2 \\times 8 + 1$, so the remainder is 1.\n' +
        '2. Is $1 = 0$? No, so the condition is **false** (17 is odd) and the `else` branch runs.\n' +
        '3. `x = 3 * x + 1`: multiply first, then add: $3 \\times 17 + 1 = 51 + 1 = 52$.\n' +
        '4. `print(x)` shows 52.',
      whyWrong: [
        'This runs the wrong branch: `17 div 2` is 8, but that line only runs when `x mod 2 == 0`. Since `17 mod 2` is 1, the `else` branch runs instead.',
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
    id: 'tracing-pseudocode-004',
    subtopic: 'tracing-pseudocode',
    difficulty: 'foundation',
    stem: `What is printed? ${CONV}`,
    code: {
      lang: 'pseudocode',
      source: L('total = 0', 'for i = 1 to 4', '    total = total + 2 * i', 'end for', 'print(total)'),
    },
    options: ['$10$', '$8$', '$12$', '$20$'],
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
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('n = 5', 'count = 0', 'while n > 0:', '    n = n - 2', '    count = count + 1', 'print(count, n)'),
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
    python: { stdout: '3 -1\n' },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'tracing-pseudocode-006',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    fixedOrder: true,
    stem:
      'Here is a FOR loop (`for k = 2 to 6` includes both 2 and 6):\n\n' +
      '```\np = 1\nfor k = 2 to 6\n    p = p * k\nend for\nprint(p)\n```\n\n' +
      'Which of the four WHILE loops shown below prints **the same output** as this FOR loop?',
    code: {
      lang: 'pseudocode',
      source: L(
        '// Loop 1',
        'p = 1',
        'k = 2',
        'while k < 6',
        '    p = p * k',
        '    k = k + 1',
        'end while',
        'print(p)',
        '',
        '// Loop 2',
        'p = 1',
        'k = 2',
        'while k <= 6',
        '    p = p * k',
        'end while',
        'print(p)',
        '',
        '// Loop 3',
        'p = 1',
        'k = 2',
        'while k <= 6',
        '    p = p * k',
        '    k = k + 1',
        'end while',
        'print(p)',
        '',
        '// Loop 4',
        'p = 1',
        'k = 2',
        'while k <= 6',
        '    k = k + 1',
        '    p = p * k',
        'end while',
        'print(p)',
      ),
    },
    options: ['Loop 1', 'Loop 2', 'Loop 3', 'Loop 4'],
    correctIndex: 2,
    markScheme: {
      solution:
        'First find what the FOR loop prints: $p = 2 \\times 3 \\times 4 \\times 5 \\times 6 = 720$.\n\n' +
        'A correct WHILE version needs three things: **start** the counter (`k = 2`), a **condition** that is still true for the last value (`k <= 6`), and an **update** at the end of the body (`k = k + 1`).\n\n' +
        '- Loop 1: condition `k < 6` stops before $k = 6$, so $p = 2 \\times 3 \\times 4 \\times 5 = 120$.\n' +
        '- Loop 2: there is no `k = k + 1`, so `k` stays 2 forever: an infinite loop.\n' +
        '- Loop 3: uses $k = 2, 3, 4, 5, 6$ and then stops when $k = 7$. It prints 720, the same as the FOR loop.\n' +
        '- Loop 4: increases `k` **before** multiplying, so it multiplies by $3, 4, 5, 6, 7$: $p = 2520$.\n\n' +
        'So Loop 3 is the match.',
      whyWrong: [
        'Loop 1 uses `k < 6`, which is false when $k = 6$, so 6 is never multiplied in and it prints 120. The FOR loop includes 6, so the condition must be `k <= 6`.',
        'Loop 2 never changes `k`, so `k <= 6` stays true for ever and the loop never ends (it prints nothing).',
        null,
        'Loop 4 updates `k` before using it, so the first multiplication is by 3 and the last is by 7, giving 2520. The update must come after the work in the body.',
      ],
      keyIdea: 'A loop `for k = a to b` becomes: `k = a`, then `while k <= b`, do the body, then `k = k + 1` as the last line of the body.',
    },
  },
  {
    id: 'tracing-pseudocode-007',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem:
      'This algorithm is meant to add up **all** $n$ items of a list `A`, whose items are numbered from 0: `A[0]`, `A[1]`, ..., `A[n - 1]`. With `A = [4, 7, 1, 9]` (so $n = 4$) it prints 17 instead of 21. Which single change fixes it?',
    code: {
      lang: 'pseudocode',
      source: L('total = 0', 'i = 1', 'while i < n', '    total = total + A[i]', '    i = i + 1', 'end while', 'print(total)'),
    },
    options: [
      'Change `while i < n` to `while i <= n`',
      'Change `i = 1` to `i = 0`',
      'Change `while i < n` to `while i <= n - 1`',
      'Swap the two lines inside the loop, so `i = i + 1` comes first',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Trace the original: `i` takes the values 1, 2, 3 (it stops when $i = 4$ because $4 < 4$ is false). So it adds `A[1] + A[2] + A[3]` $= 7 + 1 + 9 = 17$. The first item `A[0] = 4` is **never added**: the loop starts one position too late (an off-by-one error).\n\n' +
        'Fix: start at `i = 0`. Then `i` takes 0, 1, 2, 3, which are exactly the valid positions, and the total is $4 + 7 + 1 + 9 = 21$.\n\n' +
        'Checking the other changes:\n\n' +
        '- `while i <= n` makes `i` go up to 4, but `A[4]` does not exist (error), and `A[0]` is still skipped.\n' +
        '- `while i <= n - 1` means exactly the same as `while i < n` for whole numbers, so nothing changes: still 17.\n' +
        '- Swapping the lines makes `i` become 2, 3, 4 before each addition: it skips `A[1]` as well and then tries to read `A[4]`.',
      whyWrong: [
        'This fixes the wrong end of the loop. `i` would reach 4 and the algorithm would try to read `A[4]`, which does not exist, while `A[0]` is still skipped.',
        null,
        'For whole numbers, `i <= n - 1` and `i < n` are the same test, so the loop runs exactly as before and still prints 17.',
        'Updating `i` before using it moves every read one place further on: it skips `A[1]` too and then reads past the end of the list.',
      ],
      keyIdea: 'When an algorithm misses the first or last item, check the starting value and the stopping condition of the counter (off-by-one errors).',
    },
  },
  {
    id: 'tracing-pseudocode-008',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: `What happens when this pseudocode runs? ${CONV}`,
    code: {
      lang: 'pseudocode',
      source: L(
        'x = 50',
        'count = 0',
        'while x > 1',
        '    if x mod 2 == 0 then',
        '        x = x div 2',
        '    end if',
        '    count = count + 1',
        'end while',
        'print(count)',
      ),
    },
    options: ['It prints 5', 'It prints 6', 'The loop never ends, so nothing is printed', 'It prints 1'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Trace the first passes:\n\n' +
        '| Pass | `x` at start | `x mod 2 == 0`? | `x` at end | `count` |\n|---|---|---|---|---|\n' +
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
  },
  {
    id: 'tracing-pseudocode-009',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: 'The list `A` is non-empty and its items are numbered from 0. What does `mystery(A)` return?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function mystery(A)',
        '    p = 0',
        '    for i = 1 to length(A) - 1',
        '        if A[i] > A[p] then',
        '            p = i',
        '        end if',
        '    end for',
        '    return p',
        'end function',
      ),
    },
    options: [
      'The largest value in `A`',
      'The position of the first occurrence of the largest value in `A`',
      'The position of the last occurrence of the largest value in `A`',
      'The position of the smallest value in `A`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '`p` stores a **position**, not a value: it starts at 0 and is set to `i`. The test `A[i] > A[p]` asks "is this item bigger than the best one so far?", so `p` always points to the largest item seen so far.\n\n' +
        'Try a small example with a tie, `A = [5, 9, 2, 9]`:\n\n' +
        '| `i` | `A[i]` | `A[p]` | `A[i] > A[p]`? | `p` |\n|---|---|---|---|---|\n' +
        '| start | | | | 0 |\n' +
        '| 1 | 9 | 5 | yes | 1 |\n' +
        '| 2 | 2 | 9 | no | 1 |\n' +
        '| 3 | 9 | 9 | no ($9 > 9$ is false) | 1 |\n\n' +
        'It returns 1, the position of the **first** 9. Because the test is a strict `>`, a later equal value does not replace the earlier one.',
      whyWrong: [
        'The function returns `p`, which is a position (index), not `A[p]`, the value stored there. For `[5, 9, 2, 9]` it returns 1, not 9.',
        null,
        'That would need `>=`. With strict `>`, an equal value later in the list does not update `p`, so the first occurrence is kept.',
        'The test `A[i] > A[p]` moves `p` to **bigger** items, so it tracks the largest value. Tracking the smallest would need `<`.',
      ],
      keyIdea: 'To see what an algorithm computes, trace a small example (include a tie) and notice whether variables hold values or positions.',
    },
  },
  {
    id: 'tracing-pseudocode-010',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: `What does \`mystery(4072)\` return? ${CONV} \`mod\` is worked out before \`+\`, like multiplication.`,
    code: {
      lang: 'pseudocode',
      source: L(
        'function mystery(n)',
        '    r = 0',
        '    while n > 0',
        '        r = r * 10 + n mod 10',
        '        n = n div 10',
        '    end while',
        '    return r',
        'end function',
      ),
    },
    options: ['$2704$', '$274$', '$13$', '$27040$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`n mod 10` is the **last digit** of `n`, and `n div 10` **removes** the last digit. `r * 10 + digit` sticks the digit onto the end of `r`.\n\n' +
        '| `n` at start | `n mod 10` | `r = r * 10 + n mod 10` | `n div 10` |\n|---|---|---|---|\n' +
        '| 4072 | 2 | $0 \\times 10 + 2 = 2$ | 407 |\n' +
        '| 407 | 7 | $2 \\times 10 + 7 = 27$ | 40 |\n' +
        '| 40 | 0 | $27 \\times 10 = 270$ (the digit 0 adds nothing) | 4 |\n' +
        '| 4 | 4 | $270 \\times 10 + 4 = 2704$ | 0 |\n\n' +
        'Now $n = 0$, so the loop stops and the function returns 2704: it **reverses the digits**.',
      whyWrong: [
        null,
        'This drops the zero digit. Even when the digit is 0, `r` is still multiplied by 10 (270), which keeps a place for the 0.',
        'This is the sum of the digits ($4 + 7 + 2 = 13$; the 0 adds nothing). It forgets the `r * 10`, which shifts the digits along instead of adding them.',
        'This multiplies by 10 after adding the digit, as if the line were `r = (r + n mod 10) * 10`, which leaves an extra 0 on the end.',
      ],
      keyIdea: '`n mod 10` takes the last digit and `n div 10` removes it; `r * 10 + digit` builds a number digit by digit.',
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
    stem: `What is printed? ${CONV}`,
    code: {
      lang: 'pseudocode',
      source: L('count = 0', 'for i = 1 to 5', '    for j = i to 5', '        count = count + 1', '    end for', 'end for', 'print(count)'),
    },
    options: ['$25$', '$10$', '$14$', '$15$'],
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
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L(
        'nums = [3, 8, 2, 7, 4]',
        'i = 0',
        'best = 0',
        'while i < len(nums):',
        '    if nums[i] % 2 == 0:',
        '        best = best + nums[i]',
        '    i += 2',
        'print(best)',
      ),
    },
    options: ['`14`', '`9`', '`6`', '`8`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`i` starts at 0 and goes up by **2**, so only the positions 0, 2, 4 are visited (the loop stops when $i = 6$, because $6 < 5$ is false). Python numbers positions from 0.\n\n' +
        '| `i` | `nums[i]` | even? | `best` |\n|---|---|---|---|\n' +
        '| 0 | 3 | no | 0 |\n' +
        '| 2 | 2 | yes | 2 |\n' +
        '| 4 | 4 | yes | 6 |\n\n' +
        'The output is `6`.',
      whyWrong: [
        'This adds every even number in the list ($8 + 2 + 4$), ignoring `i += 2`. The 8 is at position 1, which is never visited.',
        'This adds every visited item ($3 + 2 + 4$), ignoring the test `nums[i] % 2 == 0`. The 3 is odd, so it is not added.',
        null,
        'This numbers the positions from 1, so it visits 8 and 7 instead. In Python the first item is `nums[0]`.',
      ],
      keyIdea: 'Track exactly which values the loop counter takes (start, step, stop) before applying the condition inside the loop.',
    },
    check: {
      optionValues: [14, 9, 6, 8],
      compute: () => {
        const nums = [3, 8, 2, 7, 4];
        let best = 0;
        for (let i = 0; i < nums.length; i += 2) if (nums[i] % 2 === 0) best += nums[i];
        return best;
      },
    },
    python: { stdout: '6\n' },
  },
  {
    id: 'tracing-pseudocode-013',
    subtopic: 'tracing-pseudocode',
    difficulty: 'exam',
    stem: `This is Euclid's algorithm. What is printed? (\`mod\` gives the remainder after division.)`,
    code: {
      lang: 'pseudocode',
      source: L(
        'a = 252',
        'b = 105',
        'passes = 0',
        'while b != 0',
        '    r = a mod b',
        '    a = b',
        '    b = r',
        '    passes = passes + 1',
        'end while',
        'print(a, passes)',
      ),
    },
    options: ['`21 3`', '`0 3`', '`42 2`', '`21 2`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`!=` means "is not equal to", so the loop runs while `b` is not 0.\n\n' +
        '| Pass | `a mod b` = `r` | new `a` | new `b` | `passes` |\n|---|---|---|---|---|\n' +
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
    stem: `What is printed? ${CONV}`,
    code: {
      lang: 'pseudocode',
      source: L('a = 1', 'b = 1', 'for i = 1 to 5', '    t = a + b', '    a = b', '    b = t', 'end for', 'print(b)'),
    },
    options: ['$8$', '$13$', '$21$', '$32$'],
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
    stem:
      'A student traced this pseudocode and wrote the trace table shown (values **after** each pass of the loop). They concluded that the output is 80. Which statement about their work is correct?',
    code: {
      lang: 'pseudocode',
      source: L('x = 2', 'y = 0', 'while x < 40', '    y = y + x', '    x = x * 3', 'end while', 'print(y)'),
    },
    table: {
      caption: "Student's trace table",
      headers: ['Pass', 'y', 'x'],
      rows: [
        [1, 2, 6],
        [2, 8, 18],
        [3, 26, 54],
        [4, 80, 162],
      ],
    },
    options: [
      'Pass 2 is wrong: `y` should be $2 + 18 = 20$',
      'The table is completely correct, so the output is 80',
      'Pass 3 should not happen, because it would make `x` equal 54, which is not less than 40; so the output is 8',
      'Passes 1 to 3 are correct, but pass 4 should not happen, so the output is 26',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Trace it yourself. The condition `x < 40` is checked **at the top**, before each pass.\n\n' +
        '| Check `x < 40` | `y = y + x` | `x = x * 3` |\n|---|---|---|\n' +
        '| $2 < 40$ yes | $0 + 2 = 2$ | 6 |\n' +
        '| $6 < 40$ yes | $2 + 6 = 8$ | 18 |\n' +
        '| $18 < 40$ yes | $8 + 18 = 26$ | 54 |\n' +
        '| $54 < 40$ no, stop | | |\n\n' +
        'The student\'s passes 1 to 3 match. But after pass 3, $x = 54$, and $54 < 40$ is false, so there is **no pass 4**. The output is 26.',
      whyWrong: [
        'This uses the **new** value of `x` (18) in pass 2. Inside a pass, `y = y + x` runs first, while `x` is still 6, so $y = 2 + 6 = 8$, as the student wrote.',
        'The condition must be re-checked before every pass. With $x = 54$ it is false, so the student\'s fourth pass should never run.',
        'This tests the value `x` will have **after** the pass instead of the value it has at the top. At the start of pass 3, $x = 18$ and $18 < 40$ is true, so pass 3 runs in full (`y` becomes 26); the condition is only checked again afterwards.',
        null,
      ],
      keyIdea: 'A while condition is only checked at the top of each pass: a pass always finishes, and no new pass starts once the condition is false.',
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'tracing-pseudocode-016',
    subtopic: 'tracing-pseudocode',
    difficulty: 'challenge',
    stem: `What is printed? ${CONV}`,
    code: {
      lang: 'pseudocode',
      source: L(
        'count = 0',
        'for i = 1 to 6',
        '    for j = 1 to i',
        '        if (i + j) mod 3 == 0 then',
        '            count = count + 1',
        '        end if',
        '    end for',
        'end for',
        'print(count)',
      ),
    },
    options: ['$12$', '$5$', '$7$', '$21$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'For each `i`, `j` runs from 1 to `i`. We count the pairs where $i + j$ is a multiple of 3 (3, 6, 9 or 12).\n\n' +
        '| `i` | `j` values | pairs with $i + j$ a multiple of 3 | count |\n|---|---|---|---|\n' +
        '| 1 | 1 | none ($1 + 1 = 2$) | 0 |\n' +
        '| 2 | 1, 2 | $j = 1$ (sum 3) | 1 |\n' +
        '| 3 | 1 to 3 | $j = 3$ (sum 6) | 2 |\n' +
        '| 4 | 1 to 4 | $j = 2$ (sum 6) | 3 |\n' +
        '| 5 | 1 to 5 | $j = 1$ (sum 6), $j = 4$ (sum 9) | 5 |\n' +
        '| 6 | 1 to 6 | $j = 3$ (sum 9), $j = 6$ (sum 12) | 7 |\n\n' +
        'The final count is 7.',
      whyWrong: [
        'This lets `j` run from 1 to 6 every time (36 pairs, 12 of which work). The inner loop stops at `i`, so for small `i` many pairs never happen.',
        'This leaves out the pairs where $j = i$ (here $i = j = 3$ and $i = j = 6$), as if the inner loop were `for j = 1 to i - 1`. `to i` includes `i`.',
        null,
        'This counts every pass of the inner loop ($1 + 2 + \\dots + 6 = 21$), ignoring the `if`. Only passes where the condition is true add 1.',
      ],
      keyIdea: 'For nested loops with a condition, list each outer value, the inner values it allows, and which of those pass the test.',
    },
    check: {
      optionValues: [12, 5, 7, 21],
      compute: () => {
        let c = 0;
        for (let i = 1; i <= 6; i++) for (let j = 1; j <= i; j++) if ((i + j) % 3 === 0) c++;
        return c;
      },
    },
  },
  {
    id: 'tracing-pseudocode-017',
    subtopic: 'tracing-pseudocode',
    difficulty: 'challenge',
    stem:
      'What is printed? (`mod` gives the remainder, `div` gives whole-number division, `str` turns a number into text, and `+` between two pieces of text joins them, so `"1" + "0"` is `"10"`.)',
    code: {
      lang: 'pseudocode',
      source: L('n = 37', 's = ""', 'while n > 0', '    s = str(n mod 2) + s', '    n = n div 2', 'end while', 'print(s)'),
    },
    options: ['`100101`', '`101001`', '`00101`', '`010010`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each pass takes the remainder on division by 2 (a binary digit) and puts it at the **front** of `s`.\n\n' +
        '| `n` | `n mod 2` | `s` after pass | `n div 2` |\n|---|---|---|---|\n' +
        '| 37 | 1 | `1` | 18 |\n' +
        '| 18 | 0 | `01` | 9 |\n' +
        '| 9 | 1 | `101` | 4 |\n' +
        '| 4 | 0 | `0101` | 2 |\n' +
        '| 2 | 0 | `00101` | 1 |\n' +
        '| 1 | 1 | `100101` | 0 |\n\n' +
        'Now $n = 0$, so the loop stops and `100101` is printed. Check: $32 + 4 + 1 = 37$. The algorithm converts a number to binary.',
      whyWrong: [
        null,
        'This puts each new digit at the **end** (as if the line were `s = s + str(n mod 2)`), which writes the binary digits in reverse order.',
        'This stops when `n` is 1, as if the condition were `n > 1`. But $1 > 0$ is true, so there is one more pass, which adds the leading 1.',
        'This halves `n` **before** taking the remainder (the two lines in the loop swapped), so every digit comes from the wrong number.',
      ],
      keyIdea: 'Repeated `mod 2` and `div 2` produce the binary digits from right to left, so each new digit goes on the front.',
    },
    check: {
      optionValues: ['100101', '101001', '00101', '010010'],
      compute: () => {
        let n = 37;
        let s = '';
        while (n > 0) {
          s = String(n % 2) + s;
          n = Math.floor(n / 2);
        }
        return s;
      },
    },
  },
  {
    id: 'tracing-pseudocode-018',
    subtopic: 'tracing-pseudocode',
    difficulty: 'challenge',
    stem: 'How many times is the line `count = count + 1` executed?',
    code: {
      lang: 'pseudocode',
      source: L(
        'count = 0',
        'i = 1',
        'while i <= 64',
        '    j = i',
        '    while j <= 64',
        '        count = count + 1',
        '        j = j * 2',
        '    end while',
        '    i = i * 2',
        'end while',
        'print(count)',
      ),
    },
    options: ['$49$', '$28$', '$21$', '$7$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The outer counter doubles: $i = 1, 2, 4, 8, 16, 32, 64$ (7 values; then $i = 128$ fails `i <= 64`).\n\n' +
        'For each `i`, the inner loop starts at `j = i` and doubles up to 64:\n\n' +
        '| `i` | values of `j` | inner passes |\n|---|---|---|\n' +
        '| 1 | 1, 2, 4, 8, 16, 32, 64 | 7 |\n' +
        '| 2 | 2, 4, 8, 16, 32, 64 | 6 |\n' +
        '| 4 | 4, 8, 16, 32, 64 | 5 |\n' +
        '| 8 | 8, 16, 32, 64 | 4 |\n' +
        '| 16 | 16, 32, 64 | 3 |\n' +
        '| 32 | 32, 64 | 2 |\n' +
        '| 64 | 64 | 1 |\n\n' +
        'Total: $7 + 6 + 5 + 4 + 3 + 2 + 1 = 28$.',
      whyWrong: [
        'This assumes the inner loop always does 7 passes ($7 \\times 7 = 49$). It starts at `j = i`, not at 1, so it gets shorter as `i` grows.',
        null,
        'This treats `<= 64` as `< 64`, so 64 is never used: $6 + 5 + 4 + 3 + 2 + 1 = 21$. Since $64 \\le 64$ is true, 64 is included.',
        'This counts only the passes of the outer loop (7). The line is inside the inner loop, which runs several times per outer pass.',
      ],
      keyIdea: 'A counter that doubles up to $n$ takes about $\\log_2 n$ steps; for nested loops add up the inner passes for every outer value.',
    },
    check: {
      optionValues: [49, 28, 21, 7],
      compute: () => {
        let c = 0;
        for (let i = 1; i <= 64; i *= 2) for (let j = i; j <= 64; j *= 2) c++;
        return c;
      },
    },
  },
  {
    id: 'tracing-pseudocode-019',
    subtopic: 'tracing-pseudocode',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L(
        'total = 0',
        'i = 0',
        'while True:',
        '    i += 1',
        '    if i % 3 == 0:',
        '        continue',
        '    if i > 10:',
        '        break',
        '    total += i',
        'print(total, i)',
      ),
    },
    options: ['`55 11`', '`37 10`', '`27 10`', '`37 11`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`while True` only stops at a `break`. `continue` skips the rest of the current pass and jumps back to the top.\n\n' +
        '| `i` | multiple of 3? | `i > 10`? | `total` |\n|---|---|---|---|\n' +
        '| 1 | no | no | 1 |\n' +
        '| 2 | no | no | 3 |\n' +
        '| 3 | yes: `continue` | | 3 |\n' +
        '| 4 | no | no | 7 |\n' +
        '| 5 | no | no | 12 |\n' +
        '| 6 | yes: `continue` | | 12 |\n' +
        '| 7 | no | no | 19 |\n' +
        '| 8 | no | no | 27 |\n' +
        '| 9 | yes: `continue` | | 27 |\n' +
        '| 10 | no | no | 37 |\n' +
        '| 11 | no | yes: `break` | 37 |\n\n' +
        'The loop breaks with `total = 37` and `i = 11`, so it prints `37 11`.',
      whyWrong: [
        'This ignores `continue` and adds every number from 1 to 10 ($55$). The multiples of 3 (3, 6, 9) are skipped and never added.',
        'The total is right, but `i` is 11 when the loop stops: `i` is increased to 11 first, and only then does the `break` test catch it.',
        'This treats `i > 10` as `i >= 10`, breaking at `i = 10` before 10 is added. $10 > 10$ is false, so 10 is added.',
        null,
      ],
      keyIdea: '`continue` jumps straight to the next pass and `break` leaves the loop immediately, keeping the variables as they are at that moment.',
    },
    check: {
      optionValues: ['55 11', '37 10', '27 10', '37 11'],
      compute: () => {
        let total = 0;
        let i = 0;
        for (;;) {
          i += 1;
          if (i % 3 === 0) continue;
          if (i > 10) break;
          total += i;
        }
        return `${total} ${i}`;
      },
    },
    python: { stdout: '37 11\n' },
  },
  {
    id: 'tracing-pseudocode-020',
    subtopic: 'tracing-pseudocode',
    difficulty: 'challenge',
    stem: 'For any **odd** positive whole number $n$, what does `mystery(n)` return?',
    code: {
      lang: 'pseudocode',
      source: L(
        'function mystery(n)',
        '    s = 0',
        '    k = 1',
        '    while k <= n',
        '        s = s + k',
        '        k = k + 2',
        '    end while',
        '    return s',
        'end function',
      ),
    },
    options: ['$\\frac{n(n+1)}{2}$', '$n^2$', '$\\left(\\frac{n+1}{2}\\right)^2$', '$\\frac{n(n+1)}{4}$'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`k` takes the values $1, 3, 5, \\dots$ up to $n$, so `mystery(n)` adds up the odd numbers from 1 to $n$.\n\n' +
        'Trace a small case, $n = 9$: `s` becomes $1, 4, 9, 16, 25$. These are square numbers: adding the first $m$ odd numbers gives $m^2$.\n\n' +
        'How many odd numbers are there from 1 to $n$? For $n = 9$ there are 5, which is $\\frac{9 + 1}{2}$. In general there are $m = \\frac{n+1}{2}$.\n\n' +
        '$$\\text{mystery}(n) = m^2 = \\left(\\frac{n+1}{2}\\right)^2$$\n\n' +
        'Check with $n = 9$: $\\left(\\frac{10}{2}\\right)^2 = 25$. Correct. The other options give 45, 81 and 22.5.',
      whyWrong: [
        'This is the sum of **all** whole numbers from 1 to $n$ (45 when $n = 9$). The step `k = k + 2` means only the odd numbers are added.',
        'This mixes up $n$ with the **number** of odd terms. The first $n$ odd numbers add to $n^2$, but here the odd numbers only go up to $n$, so there are $\\frac{n+1}{2}$ of them (81 is wrong for $n = 9$).',
        null,
        'This assumes the odd numbers make up exactly half of the total $\\frac{n(n+1)}{2}$. They are slightly more than half, and for $n = 9$ this gives 22.5, which is not even a whole number.',
      ],
      keyIdea: 'To find what an algorithm computes, trace a small input, spot the pattern, and test each formula option with that input.',
    },
    check: {
      optionValues: [(9 * 10) / 2, 81, ((9 + 1) / 2) ** 2, (9 * 10) / 4],
      compute: () => {
        const n = 9;
        let s = 0;
        for (let k = 1; k <= n; k += 2) s += k;
        return s;
      },
    },
  },
];
