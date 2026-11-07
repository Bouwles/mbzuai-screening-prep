import type { StaticQuestion } from '../../../types';

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

const INDEXED = 'Arrays are indexed from 1.';
const PRINTS = `${INDEXED} What does this pseudocode print?`;

/** How the interpreter prints an array, used to compare checks with the options. */
const show = (a: number[]) => `[${a.join(', ')}]`;

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'lists-tuples-005',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: `${INDEXED} \`G[r][c]\` is row \`r\`, column \`c\`. What does this pseudocode print?`,
    code: { lang: 'pseudocode', source: L('G = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', 'print(G[2][3])') },
    options: ['8', '3', '5', '6'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which value is in row 2, column 3 of this grid?',
      solution:
        '`G` is a list of three rows. Laid out as a grid, with rows and columns numbered from 1, it looks like this:\n\n| | Column 1 | Column 2 | Column 3 |\n|---|---|---|---|\n| Row 1 | 1 | 2 | 3 |\n| Row 2 | 4 | 5 | 6 |\n| Row 3 | 7 | 8 | 9 |\n\n' +
        'The first index chooses the row. So `G[2]` is row 2, which is `[4, 5, 6]`.\n\n' +
        'The second index chooses the place within that row. So `[3]` picks the third value in `[4, 5, 6]`, which is 6. Line 2 prints it.',
      conclusion: 'Row 2, column 3 of the grid holds 6, so the answer is 6.',
      whyWrong: [
        'This swaps rows and columns, reading row 3, column 2. The first index chooses the row, so `G[2][3]` is row 2, column 3.',
        'This reads row 1, column 3. The first index is 2, so the value must come from the second row, `[4, 5, 6]`.',
        'This reads row 2, column 2. The second index is 3, so it must be the third value in that row, not the second.',
        null,
      ],
      keyIdea: 'For `G[r][c]`, rewrite the array as a grid with its rows and columns numbered. Go to row `r` first, then along to column `c`. Check whether the stem says counting starts at 0 or 1.',
    },
    check: {
      optionValues: [8, 3, 5, 6],
      compute: () => {
        const G = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ];
        return G[2 - 1][3 - 1];
      },
    },
  },
  {
    id: 'lists-tuples-021',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'An array of length $n$ is indexed from 1. What is the index of its last element?',
    options: ['$n$', '$n - 1$', '$n + 1$', '$1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'If an array has $n$ items and counting starts at 1, what number does the last item have?',
      solution:
        'An **index** is an element\'s position number. Counting from 1, the first element is at index 1, the second at index 2, and so on.\n\n' +
        'Try a small example. `A = [7, 2, 9]` has 3 elements, at indexes 1, 2 and 3. The last index is 3, the same as the length.\n\n' +
        'The same happens for any length, so the last of $n$ elements has index $n$.',
      conclusion: 'Counting from 1, the position number of the last element equals the length, so the answer is $n$.',
      whyWrong: [
        null,
        'This is the last index when counting starts from 0. Here counting starts from 1.',
        'Index $n + 1$ is one place past the end of the array.',
        'Index 1 holds the first element, not the last.',
      ],
      keyIdea: 'Test index questions on a tiny array of 3 items. Counting from 1, the first index is 1 and the last is the length. Counting from 0, the first index is 0 and the last is the length $- 1$.',
    },
  },
  {
    id: 'lists-tuples-022',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'What does `length(A)` give for an array `A`?',
    options: ['The number of elements', 'The largest element', 'The sum of the elements', 'The last element'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does the `length` function tell you about an array?',
      solution:
        '`length(A)` counts how many items, called **elements**, are in `A`. It does not look at what the values are.\n\n' +
        'For example, `length([7, 2, 9])` is 3, because there are 3 elements.',
      conclusion: '`length` only counts the items, so it gives The number of elements.',
      whyWrong: [
        null,
        'Finding the largest element needs a loop that compares the values. `length` does not look at the values.',
        'Adding the elements needs a loop with a running total. `length` only counts them.',
        'The last element is the one stored at the last index. `length` gives that position, not the value there.',
      ],
      keyIdea: 'Test the choices on a small array whose values differ from its size, such as `[7, 2, 9]`. The length is 3, which is not the largest value (9), the sum (18) or the last value (9).',
    },
  },
  {
    id: 'lists-tuples-023',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'Why does swapping two array elements need a temporary variable?',
    options: ['To keep a value before it is overwritten', 'To make the array longer', 'To sort the array', 'To count the swaps'],
    correctIndex: 0,
    markScheme: {
      asking: 'Why can\'t you swap two array values without using an extra variable?',
      solution:
        'Try swapping with no extra variable, using `A = [4, 9]`. The line `A[1] = A[2]` makes `A` into `[9, 9]`, because `=` erases what was in `A[1]`. The 4 has gone.\n\n' +
        'The next line, `A[2] = A[1]`, only copies 9 back. `A` stays `[9, 9]`, so there has been no swap.\n\n' +
        'To keep the 4, save it first with `t = A[1]`. Then `A[1] = A[2]` and `A[2] = t` finish the swap, and `A` is `[9, 4]`. So `t` holds the value that would otherwise be lost.',
      conclusion: 'An assignment erases the old value, so the temporary variable is there To keep a value before it is overwritten.',
      whyWrong: [
        null,
        'A swap never changes the length of the array. It only exchanges two values.',
        'A single swap does not sort anything, though sorting algorithms use many swaps.',
        'Counting needs a counter that goes up by 1. The temporary variable only holds a value for a moment.',
      ],
      keyIdea: 'An assignment erases the old value. Before any overwrite, ask whether that value is still needed. If it is, copy it to a spare variable first. A swap is always three lines: save, overwrite, restore.',
    },
  },
  {
    id: 'lists-tuples-024',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'How long does reading `A[i]` take for an array of $n$ elements?',
    options: ['$O(1)$', '$O(n)$', '$O(\\log n)$', '$O(n^2)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Does reading one array position take longer when the array is bigger?',
      solution:
        '**Big-O notation** describes how the time grows as the input size $n$ grows. $O(1)$ means **constant time**: the same time, however big $n$ is.\n\n' +
        'An array\'s elements sit side by side in memory, all the same size. So the computer finds `A[i]` with one sum: the array\'s start, plus $i - 1$ element sizes.\n\n' +
        'It jumps straight there without looking at any other element. That is one step, even in an array of a million elements, so reading `A[i]` is $O(1)$.',
      conclusion: 'A known index takes one jump, whatever the length of the array, so the time is $O(1)$.',
      whyWrong: [
        null,
        'This is the time to **search** an unsorted array. Reading a known index needs no search.',
        'This is the time for binary search on a sorted array. Reading a known index needs no search.',
        'Quadratic time comes from nested loops over the array. One read is a single step.',
      ],
      keyIdea: 'To find a running time, ask how many elements must be looked at as $n$ grows. Just one: $O(1)$. Halving each time: $O(\\log n)$. All of them: $O(n)$. Every pair: $O(n^2)$.',
    },
  },
  {
    id: 'lists-tuples-025',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'A two-dimensional array has order $m \\times n$. How many elements does it hold?',
    options: ['$mn$', '$m + n$', '$m^n$', '$2(m + n)$'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many values fit in a grid with $m$ rows and $n$ columns?',
      solution:
        'Order $m \\times n$ means $m$ rows and $n$ columns. Try a small grid: order $2 \\times 3$ has 2 rows and 3 columns.\n\n' +
        'Each of the 2 rows holds 3 elements, so the total is $2 \\times 3 = 6$.\n\n' +
        'In general, each of the $m$ rows holds $n$ elements, so the total is $m \\times n = mn$.',
      conclusion: 'Multiplying the rows by the elements in each row gives $mn$.',
      whyWrong: [
        null,
        'This adds the number of rows and columns. Each row holds $n$ elements, so multiply.',
        'This is a power. The number of elements is rows times columns.',
        'This is the perimeter of an $m$ by $n$ rectangle, not the number of elements inside it.',
      ],
      keyIdea: 'Count grid elements by multiplying rows by columns. Check any rule on a small grid you can draw, such as $2 \\times 3$, which holds 6 elements.',
    },
  },
  {
    id: 'lists-tuples-026',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [7, 2, 9, 4]', 'print(A[2] + A[4])') },
    options: ['6', '13', '11', 'Error'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do you get by adding the second and fourth values of `A`?',
      solution:
        'Write each index above its value, counting from 1 as the stem says:\n\n| Index | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Value | 7 | 2 | 9 | 4 |\n\n' +
        '`A[2]` means the value at index 2, which is 2. `A[4]` means the value at index 4, which is 4.\n\n' +
        'Line 2 adds them, $2 + 4 = 6$, and `print` shows the result.',
      conclusion: '`A[2]` is 2 and `A[4]` is 4, so the answer is 6.',
      whyWrong: [
        null,
        'This reads `A[2]` as the third element, 9, as if counting from 0, and then adds the last element, 4.',
        'This adds `A[2]` and `A[3]`: $2 + 9$. The second index is 4, not 3.',
        'Counting from 0 there would be no index 4. Here counting starts from 1, so `A[4]` is the last element.',
      ],
      keyIdea: 'Draw an index row above the values before doing anything else. Replace each `A[i]` with the value under that index, then calculate. The number in the brackets is a position, not a value.',
    },
    check: {
      optionValues: [6, 13, 11, 'Error'],
      compute: () => {
        const A = [7, 2, 9, 4];
        return A[2 - 1] + A[4 - 1];
      },
    },
  },
  {
    id: 'lists-tuples-027',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [4, 7, 9]', 't = A[1]', 'A[1] = A[3]', 'A[3] = t', 'print(A)') },
    options: ['`[9, 7, 4]`', '`[9, 7, 9]`', '`[4, 7, 4]`', '`[7, 4, 9]`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does `A` hold after these three lines change it?',
      solution:
        '`=` copies the value on the right into the place on the left, erasing what was there. `t` is a spare variable, used here to save a value before it gets erased.\n\n' +
        'Trace each line, with one column for each index. Line 5 prints the array from the last row:\n\n| Line | What it does | `t` | `A[1]` | `A[2]` | `A[3]` |\n|---|---|---|---|---|---|\n| 1 | creates `A` | - | 4 | 7 | 9 |\n| 2 | saves `A[1]` in `t` | 4 | 4 | 7 | 9 |\n| 3 | copies `A[3]` into `A[1]` | 4 | 9 | 7 | 9 |\n| 4 | copies `t` into `A[3]` | 4 | 9 | 7 | 4 |',
      conclusion: 'The saved 4 ends at index 3 and the 9 ends at index 1, so the answer is `[9, 7, 4]`.',
      whyWrong: [
        null,
        'This stops before the last line. `A[3] = t` puts the saved 4 into position 3.',
        'This copies `t` into position 3 but forgets that `A[1]` was changed to 9.',
        'This swaps positions 1 and 2. The code uses indices 1 and 3.',
      ],
      keyIdea: 'For array changes, draw one row per line, with a column for each index and each variable. Copy the row down and change only the cell that line assigns. The pattern save, overwrite, restore is a swap.',
    },
    check: {
      optionValues: ['[9, 7, 4]', '[9, 7, 9]', '[4, 7, 4]', '[7, 4, 9]'],
      compute: () => {
        const A = [4, 7, 9];
        const t = A[0];
        A[0] = A[2];
        A[2] = t;
        return show(A);
      },
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'lists-tuples-008',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [5, 3, 8, 1]', 'for i = 1 to length(A) - 1', '   A[i] = A[i + 1]', 'end for', 'print(A)') },
    options: ['`[3, 8, 1, 5]`', '`[3, 8, 1]`', '`[5, 5, 5, 5]`', '`[3, 8, 1, 1]`'],
    correctIndex: 3,
    markScheme: {
      asking: 'What does `A` hold after each value is overwritten by the value to its right?',
      solution:
        '`length(A)` is 4, so line 2 runs `i` from 1 to $4 - 1 = 3$.\n\n' +
        'Line 3 copies the value one place to the right into position `i`, erasing what was there. `A[4]` is never written to, because `i` stops at 3.\n\n' +
        'Trace each pass, using the updated array each time. Line 5 prints the last row:\n\n| `i` | Line 3 becomes | `A[1]` | `A[2]` | `A[3]` | `A[4]` |\n|---|---|---|---|---|---|\n| start | - | 5 | 3 | 8 | 1 |\n| 1 | `A[1] = A[2]` | 3 | 3 | 8 | 1 |\n| 2 | `A[2] = A[3]` | 3 | 8 | 8 | 1 |\n| 3 | `A[3] = A[4]` | 3 | 8 | 1 | 1 |',
      conclusion: 'The 5 is overwritten and the final 1 stays in place, so the answer is `[3, 8, 1, 1]`.',
      whyWrong: [
        'This treats the shift as a rotation, with the first value moved to the end. The first value 5 is overwritten and lost.',
        'This assumes the array gets shorter. Assignments change values, never the length.',
        'This copies each value to its right, `A[i + 1] = A[i]`. The code copies from right to left.',
        null,
      ],
      keyIdea: 'Copying `A[i + 1]` into `A[i]` from left to right is a left shift: the first value is lost and the last value appears twice. It is not a rotation. Check with one row per pass, using updated values.',
    },
    check: {
      optionValues: ['[3, 8, 1, 5]', '[3, 8, 1]', '[5, 5, 5, 5]', '[3, 8, 1, 1]'],
      compute: () => {
        const A = [5, 3, 8, 1];
        for (let i = 0; i < A.length - 1; i++) A[i] = A[i + 1];
        return show(A);
      },
    },
  },
  {
    id: 'lists-tuples-010',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [4, 7, 9]', 'A[1] = A[3]', 'A[3] = A[1]', 'print(A)') },
    options: ['`[9, 7, 4]`', '`[9, 7, 9]`', '`[4, 7, 4]`', '`[4, 7, 9]`'],
    correctIndex: 1,
    markScheme: {
      asking: 'What does `A` hold after these two copying lines?',
      solution:
        '`=` copies the value on the right into the place on the left, erasing what was there. It uses whatever value is there at that moment, after any earlier changes.\n\n' +
        'Trace each line, with one column for each index. Line 4 prints the array from the last row:\n\n| Line | What it does | `A[1]` | `A[2]` | `A[3]` |\n|---|---|---|---|---|\n| 1 | creates `A` | 4 | 7 | 9 |\n| 2 | copies `A[3]`, which is 9, into `A[1]` and erases the 4 | 9 | 7 | 9 |\n| 3 | copies `A[1]`, now 9, into `A[3]` | 9 | 7 | 9 |',
      conclusion: 'The 4 was erased on line 2 and never saved, so line 3 changes nothing and the answer is `[9, 7, 9]`.',
      whyWrong: [
        'This assumes the two lines swap the values. The 4 is lost on the first line because it was not saved in a temporary variable.',
        null,
        'This does the two lines in the opposite order.',
        'This assumes the lines cancel out. The first line really changes `A[1]`, and the 4 cannot come back.',
      ],
      keyIdea: 'Two assignments alone cannot swap. When you see `X = Y` followed by `Y = X` with no spare variable, both end up holding the old value of `Y`. Trace one row per line, using updated values.',
    },
    check: {
      optionValues: ['[9, 7, 4]', '[9, 7, 9]', '[4, 7, 4]', '[4, 7, 9]'],
      compute: () => {
        const A = [4, 7, 9];
        A[0] = A[2];
        A[2] = A[0];
        return show(A);
      },
    },
  },
  {
    id: 'lists-tuples-020',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('A = [2, 4, 6, 8]', 'n = length(A)', 'for i = 1 to n', '   t = A[i]', '   A[i] = A[n - i + 1]', '   A[n - i + 1] = t', 'end for', 'print(A)'),
    },
    options: ['`[2, 4, 6, 8]`', '`[8, 6, 4, 2]`', '`[8, 4, 6, 2]`', '`[8, 6, 6, 8]`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does `A` hold after the loop has swapped pairs on all four passes?',
      solution:
        '`n` is 4. Lines 4 to 6 form a **swap**: save `A[i]` in `t`, overwrite `A[i]`, then put the saved value in the other position. So each pass swaps two positions.\n\n' +
        'The other position is `n - i + 1`, the matching place counted from the far end. For example, when `i` is 1, it is $4 - 1 + 1 = 4$.\n\n' +
        'The loop runs all the way to `n`, not just halfway, so trace all four passes. Line 8 prints the last row:\n\n| `i` | `n - i + 1` | Swaps | `A[1]` | `A[2]` | `A[3]` | `A[4]` |\n|---|---|---|---|---|---|---|\n| start | - | - | 2 | 4 | 6 | 8 |\n| 1 | 4 | `A[1]` and `A[4]` | 8 | 4 | 6 | 2 |\n| 2 | 3 | `A[2]` and `A[3]` | 8 | 6 | 4 | 2 |\n| 3 | 2 | `A[3]` and `A[2]` | 8 | 4 | 6 | 2 |\n| 4 | 1 | `A[4]` and `A[1]` | 2 | 4 | 6 | 8 |',
      conclusion: 'Passes 3 and 4 undo passes 2 and 1, so the array goes back to `[2, 4, 6, 8]`.',
      whyWrong: [
        null,
        'This is the array after $i = 2$. The loop does not stop halfway; passes 3 and 4 swap each pair back again.',
        'This stops one pass early, after $i = 3$. The loop includes $i = 4$, which undoes the first swap too.',
        'This treats each pass as a one-way copy and forgets that `t` puts the old value back, so every step is a real swap.',
      ],
      keyIdea: 'In a reversing loop, check where it stops. Swapping `i` with `n - i + 1` reverses the array only if `i` stops halfway. Running to `n` swaps each pair twice, and the array returns to its start.',
    },
    check: {
      optionValues: ['[2, 4, 6, 8]', '[8, 6, 4, 2]', '[8, 4, 6, 2]', '[8, 6, 6, 8]'],
      compute: () => {
        const A = [2, 4, 6, 8];
        const n = A.length;
        for (let i = 1; i <= n; i++) {
          const t = A[i - 1];
          A[i - 1] = A[n - i];
          A[n - i] = t;
        }
        return show(A);
      },
    },
  },
  {
    id: 'lists-tuples-028',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [3, 5, 2, 6]', 's = 0', 'for i = 1 to length(A)', '   s = s + A[i]', 'end for', 'print(s)') },
    options: ['16', '10', '13', '6'],
    correctIndex: 0,
    markScheme: {
      asking: 'What total does `s` reach after the loop goes through `A`?',
      solution:
        '`length(A)` is 4, so the loop runs with `i` as 1, 2, 3 and 4. That visits every index of `A` once.\n\n' +
        '`s` is a **running total**. It starts at 0 on line 2. Line 4 takes the old `s`, adds `A[i]`, and stores the result back in `s`.\n\n' +
        'Trace each pass. Line 6 prints the value of `s` in the last row:\n\n| `i` | `A[i]` | Line 4 with numbers | `s` becomes |\n|---|---|---|---|\n| 1 | 3 | $0 + 3$ | 3 |\n| 2 | 5 | $3 + 5$ | 8 |\n| 3 | 2 | $8 + 2$ | 10 |\n| 4 | 6 | $10 + 6$ | 16 |',
      conclusion: 'Every value is added once, and $3 + 5 + 2 + 6$ gives 16.',
      whyWrong: [
        null,
        'This stops at $i = 3$, leaving out the last element. The loop runs up to and including the length.',
        'This starts at $i = 2$, leaving out the first element.',
        'This is only the last element, as if the line were `s = A[i]`. The running total keeps every value.',
      ],
      keyIdea: 'Spot the pattern `s = s + A[i]` with `s` starting at 0: it adds up the elements. Check the first and last index the loop visits, then add those values.',
    },
    check: {
      optionValues: [16, 10, 13, 6],
      compute: () => {
        const A = [3, 5, 2, 6];
        let s = 0;
        for (const x of A) s = s + x;
        return s;
      },
    },
  },
  {
    id: 'lists-tuples-029',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('A = [4, 9, 2, 9, 1]', 'p = 1', 'for i = 2 to length(A)', '   if A[i] > A[p]', '      p = i', '   end if', 'end for', 'print(p)'),
    },
    options: ['2', '9', '4', '5'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which index does `p` hold when the loop ends?',
      solution:
        'Write each index above its value:\n\n| Index | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| Value | 4 | 9 | 2 | 9 | 1 |\n\n' +
        '`p` holds a **position**, not a value. It starts at 1 on line 2. So `A[p]` is the largest value found so far.\n\n' +
        'Line 4 compares the current value with `A[p]`. `>` means strictly greater, so if the two are equal the test is false and `p` stays where it is.\n\n' +
        'Trace each pass. Line 8 prints `p`, the position, and not the value stored there:\n\n| `i` | `A[i]` | `A[p]` before | `A[i] > A[p]`? | `p` afterwards |\n|---|---|---|---|---|\n| 2 | 9 | 4 | yes | 2 |\n| 3 | 2 | 9 | no | 2 |\n| 4 | 9 | 9 | no, they are equal | 2 |\n| 5 | 1 | 9 | no | 2 |',
      conclusion: 'The second 9 is not greater than the first, so `p` stays at the first 9, and line 8 prints its index, 2.',
      whyWrong: [
        null,
        'This is the largest **value**. The code prints `p`, its position.',
        'This would need the test `A[i] >= A[p]`. With `>`, an equal value does not replace the current one.',
        'This is the last index. `p` only changes when a larger value is found.',
      ],
      keyIdea: 'For a "find the largest" loop, note two things first: does it print the value or the position, and is the test `>` or `>=`? With `>`, ties keep the first position. With `>=`, ties move to the last.',
    },
    check: {
      optionValues: [2, 9, 4, 5],
      compute: () => {
        const A = [4, 9, 2, 9, 1];
        let p = 0;
        for (let i = 1; i < A.length; i++) if (A[i] > A[p]) p = i;
        return p + 1;
      },
    },
  },
  {
    id: 'lists-tuples-030',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('A = [6, 3, 8]', 'm = 0', 'for i = 1 to length(A)', '   if A[i] < m', '      m = A[i]', '   end if', 'end for', 'print(m)'),
    },
    options: ['0', '3', '6', '8'],
    correctIndex: 0,
    markScheme: {
      asking: 'What value does `m` hold when the loop ends?',
      solution:
        'Line 5 changes `m` only when `A[i]` is less than `m`. `m` starts at 0 on line 2, not at an element of the array.\n\n' +
        'Test each element. All of them are above 0, so the test is never true and line 5 never runs. Line 8 prints `m` from the last row:\n\n| `i` | `A[i]` | `A[i] < m`? | `m` afterwards |\n|---|---|---|---|\n| 1 | 6 | $6 < 0$ is false | 0 |\n| 2 | 3 | $3 < 0$ is false | 0 |\n| 3 | 8 | $8 < 0$ is false | 0 |',
      conclusion: 'No element is below the starting value, so `m` never changes and the answer is 0.',
      whyWrong: [
        null,
        'This is the true minimum, which is what the code would find if it started with `m = A[1]`. Starting from 0, the test is never true.',
        'This assumes `m` starts as the first element. The code sets it to 0.',
        'This is the maximum. Besides, the test uses `<`, so `m` could only go down.',
      ],
      keyIdea: 'Look at the starting value of a "smallest so far" variable. If it starts below every element, it never changes. A correct search starts with `m = A[1]`.',
    },
    check: {
      optionValues: [0, 3, 6, 8],
      compute: () => {
        const A = [6, 3, 8];
        let m = 0;
        for (const x of A) if (x < m) m = x;
        return m;
      },
    },
  },
  {
    id: 'lists-tuples-031',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [1, 2, 3, 4]', 'i = 4', 'while (i > 1)', '   A[i] = A[i - 1]', '   i = i - 1', 'end while', 'print(A)') },
    options: ['`[1, 1, 2, 3]`', '`[1, 1, 1, 1]`', '`[4, 1, 2, 3]`', 'Infinite loop'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does `A` hold after the loop copies values from right to left?',
      solution:
        '`i` starts at 4 on line 2, and line 5 lowers it by 1 each pass. Line 3 keeps going while `i` is above 1, so the passes have `i` as 4, 3 and 2. At `i` = 1, $1 > 1$ is false and the loop stops.\n\n' +
        'Line 4 copies the value on the left of position `i` into position `i`. Starting from the right means each value is copied before it gets overwritten.\n\n' +
        'Trace each pass, using the updated array each time. Line 7 prints the last row:\n\n| `i` | Line 4 becomes | `A[1]` | `A[2]` | `A[3]` | `A[4]` |\n|---|---|---|---|---|---|\n| start | - | 1 | 2 | 3 | 4 |\n| 4 | `A[4] = A[3]` | 1 | 2 | 3 | 3 |\n| 3 | `A[3] = A[2]` | 1 | 2 | 2 | 3 |\n| 2 | `A[2] = A[1]` | 1 | 1 | 2 | 3 |',
      conclusion: 'Each value moves one place right, the 4 is lost and `A[1]` stays, so the answer is `[1, 1, 2, 3]`.',
      whyWrong: [
        null,
        'This is what happens when the loop runs from the left. Running from the right keeps each value until it has been copied.',
        'This treats the shift as a rotation. The last value 4 is overwritten and lost, and `A[1]` is never changed.',
        '`i` goes down by 1 on each pass, so it reaches 1, the condition `i > 1` becomes false and the loop stops.',
      ],
      keyIdea: 'To spot a right shift, look for `A[i] = A[i - 1]` with `i` going down from the last index. Going right to left uses old values, so nothing spreads. The last value is lost and the first appears twice.',
    },
    check: {
      optionValues: ['[1, 1, 2, 3]', '[1, 1, 1, 1]', '[4, 1, 2, 3]', 'Infinite loop'],
      compute: () => {
        const A = [1, 2, 3, 4];
        let i = 4;
        let passes = 0;
        while (i > 1) {
          if (++passes > 1000) return 'Infinite loop';
          A[i - 1] = A[i - 2];
          i = i - 1;
        }
        return show(A);
      },
    },
  },
  {
    id: 'lists-tuples-032',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [1, 2, 3, 4]', 'for i = 2 to length(A)', '   A[i] = A[i - 1]', 'end for', 'print(A)') },
    options: ['`[1, 1, 2, 3]`', '`[1, 1, 1, 1]`', '`[2, 3, 4, 4]`', '`[4, 1, 2, 3]`'],
    correctIndex: 1,
    markScheme: {
      asking: 'What does `A` hold after the loop copies values from left to right?',
      solution:
        '`length(A)` is 4, so the passes have `i` as 2, 3 and 4. Line 3 copies the value on the left of position `i` into position `i`.\n\n' +
        'The loop goes left to right, so the value on the left has already been changed by the pass before. Use the updated array each time, not the original. Line 5 prints the last row:\n\n| `i` | Line 3 becomes | `A[1]` | `A[2]` | `A[3]` | `A[4]` |\n|---|---|---|---|---|---|\n| start | - | 1 | 2 | 3 | 4 |\n| 2 | `A[2] = A[1]` | 1 | 1 | 3 | 4 |\n| 3 | `A[3] = A[2]` | 1 | 1 | 1 | 4 |\n| 4 | `A[4] = A[3]` | 1 | 1 | 1 | 1 |',
      conclusion: 'Each pass copies the 1 one place further along, so the answer is `[1, 1, 1, 1]`.',
      whyWrong: [
        'This uses the old values on every pass. By the time $i = 3$, `A[2]` has already been changed to 1.',
        null,
        'This shifts left. The code copies `A[i - 1]` into `A[i]`, so values move to the right.',
        'This treats the shift as a rotation. Nothing here moves the last value to the front.',
      ],
      keyIdea: 'Compare the loop direction with the copy direction. Going left to right while copying from the left spreads the first value everywhere. Going right to left gives a shift. Trace with updated values.',
    },
    check: {
      optionValues: ['[1, 1, 2, 3]', '[1, 1, 1, 1]', '[2, 3, 4, 4]', '[4, 1, 2, 3]'],
      compute: () => {
        const A = [1, 2, 3, 4];
        for (let i = 1; i < A.length; i++) A[i] = A[i - 1];
        return show(A);
      },
    },
  },
  {
    id: 'lists-tuples-033',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('A = [4, 7, 10, 3, 8]', 'c = 0', 'for i = 1 to length(A)', '   if mod(A[i],2) == 0 // mod is the modulus operator', '      c = c + 1', '   end if', 'end for', 'print(c)'),
    },
    options: ['3', '2', '22', '5'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many of the numbers in `A` are even?',
      solution:
        '`mod(x,2)` is the remainder when `x` is divided by 2. For example, $7 \\div 2$ is 3 remainder 1, so `mod(7,2)` is 1. A remainder of 0 means the number is even.\n\n' +
        'So line 4 asks whether `A[i]` is even. Each time it is, line 5 adds 1 to `c`. `c` is a **counter**: it counts the elements and does not add their values.\n\n' +
        'Trace all 5 elements. Line 8 prints the value of `c` in the last row:\n\n| `i` | `A[i]` | `mod(A[i],2)` | Even? | `c` afterwards |\n|---|---|---|---|---|\n| 1 | 4 | 0 | yes | 1 |\n| 2 | 7 | 1 | no | 1 |\n| 3 | 10 | 0 | yes | 2 |\n| 4 | 3 | 1 | no | 2 |\n| 5 | 8 | 0 | yes | 3 |',
      conclusion: 'The even values are 4, 10 and 8, so `c` ends at 3.',
      whyWrong: [
        null,
        'This counts the odd numbers. A remainder of 0 on dividing by 2 means even.',
        'This adds the even values: $4 + 10 + 8$. The code adds 1 each time, not the value.',
        'This counts every element and ignores the `if`.',
      ],
      keyIdea: 'Spot the difference: `c = c + 1` counts, and `s = s + A[i]` adds values. For `mod(x,2) == 0`, mark each even element and count the marks.',
    },
    check: {
      optionValues: [3, 2, 22, 5],
      compute: () => {
        const A = [4, 7, 10, 3, 8];
        let c = 0;
        for (const x of A) if (x % 2 === 0) c = c + 1;
        return c;
      },
    },
  },
  {
    id: 'lists-tuples-034',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [2, 4, 6]', 's = 0', 'i = 1', 'while (i <= length(A))', '   s = s + A[i]', 'end while', 'print(s)') },
    options: ['12', '2', '6', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      asking: 'Does this `while` loop ever finish?',
      solution:
        '`length(A)` is 3, so line 4 reads `while (i <= 3)`. The loop continues as long as `i` is 3 or less.\n\n' +
        'The only line inside the loop is line 5. It changes `s`, but nothing changes `i`. There is no `i = i + 1`, so `i` stays at 1.\n\n' +
        'Trace a few passes. `A[i]` is always `A[1]`, which is 2:\n\n| Pass | `i` | `i <= 3`? | `s` afterwards |\n|---|---|---|---|\n| 1 | 1 | yes | 2 |\n| 2 | 1 | yes | 4 |\n| 3 | 1 | yes | 6 |\n| 4 | 1 | yes | 8 |\n\n' +
        '$1 \\le 3$ is always true, so the condition can never become false. The loop keeps adding 2 to `s` forever, and line 7 is never reached.',
      conclusion: '`i` never changes, so `i <= 3` stays true and the answer is Infinite loop.',
      whyWrong: [
        'This is the sum the loop was meant to find. Without `i = i + 1`, the loop never moves past the first element.',
        'This assumes the loop runs once. The condition is tested again after each pass and is still true.',
        'This stops after three passes, as if the loop counted them. The `while` only stops when `i` passes the length, and `i` never changes.',
        null,
      ],
      keyIdea: 'For any `while` loop, find the variable in its condition and look for a line in the body that changes it. If no line does, and the condition starts true, the loop never ends.',
    },
    check: {
      optionValues: [12, 2, 6, 'Infinite loop'],
      compute: () => {
        const A = [2, 4, 6];
        let s = 0;
        const i = 1;
        let passes = 0;
        while (i <= A.length) {
          if (++passes > 1000) return 'Infinite loop';
          s = s + A[i - 1];
        }
        return s;
      },
    },
  },
  {
    id: 'lists-tuples-035',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: { lang: 'pseudocode', source: L('A = [5, 8, 2, 8]', 'i = 1', 'while (A[i] != 8)', '   i = i + 1', 'end while', 'print(i)') },
    options: ['2', '4', '1', '8'],
    correctIndex: 0,
    markScheme: {
      asking: 'At which index does the search find the first 8?',
      solution:
        '`!=` means "is not equal to". So line 3 keeps looping while the current value is not 8, and it stops as soon as it finds an 8.\n\n' +
        'Write each index above its value:\n\n| Index | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Value | 5 | 8 | 2 | 8 |\n\n' +
        'Trace the loop. Line 6 prints `i`, the position, and not the value stored there:\n\n| `i` | `A[i]` | `A[i] != 8`? | What happens |\n|---|---|---|---|\n| 1 | 5 | true | line 4 makes `i` equal 2 |\n| 2 | 8 | false | the loop stops |',
      conclusion: 'The first 8 is at index 2, so the loop stops there and prints 2.',
      whyWrong: [
        null,
        'This is the position of the last 8. The loop stops at the first one it meets.',
        'This counts from 0, where the first 8 would be at index 1. Here the first element is at index 1, so the 8 is at index 2.',
        'This is the value being searched for. The code prints the position `i`.',
      ],
      keyIdea: 'This is a **linear search**: start at the first index and move along until the value is found. It stops at the first match, so later copies never matter. Check whether it prints the index or the value.',
    },
    check: {
      optionValues: [2, 4, 1, 8],
      compute: () => {
        const A = [5, 8, 2, 8];
        let i = 1;
        while (A[i - 1] !== 8) i = i + 1;
        return i;
      },
    },
  },
  {
    id: 'lists-tuples-036',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('A = [5, 1, 4, 2]', 'for i = 1 to 3', '   if A[i] > A[i + 1]', '      t = A[i]', '      A[i] = A[i + 1]', '      A[i + 1] = t', '   end if', 'end for', 'print(A)'),
    },
    options: ['`[1, 4, 2, 5]`', '`[1, 2, 4, 5]`', '`[1, 5, 2, 4]`', '`[5, 4, 2, 1]`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does `A` hold after one pass of swapping neighbours that are out of order?',
      solution:
        'Line 3 compares two neighbours, `A[i]` and `A[i + 1]`. If the left one is bigger, lines 4 to 6 swap them: save in `t`, overwrite, then restore.\n\n' +
        '`i` goes 1, 2, 3, so the neighbours are at positions 1 and 2, then 2 and 3, then 3 and 4. Use the updated array each time. Line 9 prints the last row:\n\n| `i` | `A[i]` and `A[i + 1]` | Left bigger? | `A[1]` | `A[2]` | `A[3]` | `A[4]` |\n|---|---|---|---|---|---|---|\n| start | - | - | 5 | 1 | 4 | 2 |\n| 1 | 5 and 1 | yes, swap | 1 | 5 | 4 | 2 |\n| 2 | 5 and 4 | yes, swap | 1 | 4 | 5 | 2 |\n| 3 | 5 and 2 | yes, swap | 1 | 4 | 2 | 5 |',
      conclusion: 'One pass carries the 5 to the end, but the array is not fully sorted, so the answer is `[1, 4, 2, 5]`.',
      whyWrong: [
        null,
        'This is the fully sorted array, which needs more passes. One pass only carries the largest value to the end.',
        'This swaps the separate pairs at positions 1 and 2, then 3 and 4. The loop also compares positions 2 and 3.',
        'This uses `<` instead of `>`, which moves the smallest value to the end.',
      ],
      keyIdea: 'This is one pass of **bubble sort**: compare neighbours and swap if they are out of order. After one pass, only the largest value is certain to be in place. Trace one row per pair, using the updated array.',
    },
    check: {
      optionValues: ['[1, 4, 2, 5]', '[1, 2, 4, 5]', '[1, 5, 2, 4]', '[5, 4, 2, 1]'],
      compute: () => {
        const A = [5, 1, 4, 2];
        for (let i = 0; i < 3; i++) {
          if (A[i] > A[i + 1]) {
            const t = A[i];
            A[i] = A[i + 1];
            A[i + 1] = t;
          }
        }
        return show(A);
      },
    },
  },
];
