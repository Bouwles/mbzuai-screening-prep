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
      solution:
        '`G` is an array of three rows. `G[2][3]` is read left to right:\n\n' +
        '1. `G[2]` is the second row: `[4, 5, 6]`.\n' +
        '2. `[3]` then picks the third item of that row: 6.\n\n' +
        'Output: 6.',
      whyWrong: [
        'This swaps rows and columns, reading row 3, column 2. The first index chooses the row.',
        'This reads the first row instead of the second, as if the row index counted from 0.',
        'This reads the second item of the row instead of the third, as if the column index counted from 0.',
        null,
      ],
      keyIdea: 'For a two-dimensional array, `G[r][c]` means row `r`, then item `c` of that row, both counted from 1.',
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
      solution: 'The indices run $1, 2, \\ldots, n$, so the last element is at index $n$.',
      whyWrong: [
        null,
        'This is the last index when counting starts from 0. Here counting starts from 1.',
        'Index $n + 1$ is one place past the end of the array.',
        'Index 1 holds the first element, not the last.',
      ],
      keyIdea: 'In a 1-based array of length $n$, the indices run from 1 to $n$.',
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
      solution: '`length(A)` counts how many elements `A` holds. With indices starting from 1, this is also the index of the last element.',
      whyWrong: [
        null,
        'Finding the largest element needs a loop that compares the values. `length` does not look at the values.',
        'Adding the elements needs a loop with a running total. `length` only counts them.',
        'The last element is the one stored at the last index. `length` gives that position, not the value there.',
      ],
      keyIdea: '`length(A)` is the number of elements, which is also the last index in a 1-based array.',
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
      solution:
        'After `A[i] = A[j]`, the old value of `A[i]` is gone. Saving it first in a temporary variable lets you put it into `A[j]` afterwards:\n\n' +
        '```pseudocode\nt = A[i]\nA[i] = A[j]\nA[j] = t\n```',
      whyWrong: [
        null,
        'A swap never changes the length of the array. It only exchanges two values.',
        'A single swap does not sort anything, though sorting algorithms use many swaps.',
        'Counting needs a counter that goes up by 1. The temporary variable only holds a value for a moment.',
      ],
      keyIdea: 'An assignment overwrites, so save one value before swapping.',
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
      solution: 'An array stores its elements side by side, so the position of `A[i]` can be calculated straight away. The time does not depend on $n$: it is constant, $O(1)$.',
      whyWrong: [
        null,
        'This is the time to **search** an unsorted array. Reading a known index needs no search.',
        'This is the time for binary search on a sorted array. Reading a known index needs no search.',
        'Quadratic time comes from nested loops over the array. One read is a single step.',
      ],
      keyIdea: 'Reading an array element by index takes constant time.',
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
      solution: 'An array of **order** $m \\times n$ has $m$ rows and $n$ columns. Each of the $m$ rows holds $n$ elements, so there are $mn$ elements.',
      whyWrong: [
        null,
        'This adds the number of rows and columns. Each row holds $n$ elements, so multiply.',
        'This is a power. The number of elements is rows times columns.',
        'This is the perimeter of an $m$ by $n$ rectangle, not the number of elements inside it.',
      ],
      keyIdea: 'An $m \\times n$ array holds $mn$ elements.',
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
      solution:
        'Counting from 1: `A[2]` is 2 and `A[4]` is 4.\n\n' +
        '| Index | 1 | 2 | 3 | 4 |\n| --- | --- | --- | --- | --- |\n| Value | 7 | 2 | 9 | 4 |\n\n' +
        'So $2 + 4 = 6$.',
      whyWrong: [
        null,
        'This reads `A[2]` as the third element, 9, as if counting from 0, and then adds the last element, 4.',
        'This adds `A[2]` and `A[3]`: $2 + 9$. The second index is 4, not 3.',
        'Counting from 0 there would be no index 4. Here counting starts from 1, so `A[4]` is the last element.',
      ],
      keyIdea: 'In a 1-based array, `A[1]` is the first element and `A[length]` is the last.',
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
      solution:
        '| Line | `A` | `t` |\n|---|---|---|\n' +
        '| `t = A[1]` | `[4, 7, 9]` | 4 |\n' +
        '| `A[1] = A[3]` | `[9, 7, 9]` | 4 |\n' +
        '| `A[3] = t` | `[9, 7, 4]` | 4 |\n\n' +
        'The first and last elements have swapped. Output: `[9, 7, 4]`.',
      whyWrong: [
        null,
        'This stops before the last line. `A[3] = t` puts the saved 4 into position 3.',
        'This copies `t` into position 3 but forgets that `A[1]` was changed to 9.',
        'This swaps positions 1 and 2. The code uses indices 1 and 3.',
      ],
      keyIdea: 'A swap saves one value, overwrites it, then writes the saved value to the other position.',
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
      solution:
        'Each element is overwritten by the one on its right.\n\n' +
        '| i | Assignment | `A` afterwards |\n|---|---|---|\n' +
        '| 1 | `A[1] = 3` | `[3, 3, 8, 1]` |\n' +
        '| 2 | `A[2] = 8` | `[3, 8, 8, 1]` |\n' +
        '| 3 | `A[3] = 1` | `[3, 8, 1, 1]` |\n\n' +
        'The last element is never overwritten, so it appears twice. Output: `[3, 8, 1, 1]`.',
      whyWrong: [
        'This treats the shift as a rotation, with the first value moved to the end. The first value 5 is overwritten and lost.',
        'This assumes the array gets shorter. Assignments change values, never the length.',
        'This copies each value to its right, `A[i + 1] = A[i]`. The code copies from right to left.',
        null,
      ],
      keyIdea: 'Shifting left overwrites the first value and leaves the last value in place twice.',
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
      solution:
        'Each line uses the **current** values.\n\n' +
        '| Line | `A` afterwards |\n|---|---|\n' +
        '| `A[1] = A[3]` | `[9, 7, 9]` |\n' +
        '| `A[3] = A[1]` | `[9, 7, 9]` |\n\n' +
        'The first line has already overwritten the 4, so the second line copies 9 back onto itself. Output: `[9, 7, 9]`.',
      whyWrong: [
        'This assumes the two lines swap the values. The 4 is lost on the first line because it was not saved in a temporary variable.',
        null,
        'This does the two lines in the opposite order.',
        'This assumes the lines cancel out. The first line really changes `A[1]`, and the 4 cannot come back.',
      ],
      keyIdea: 'Without a temporary variable, two assignments copy one value instead of swapping.',
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
      solution:
        'Each pass swaps `A[i]` with its mirror position `A[n - i + 1]`. Here $n = 4$.\n\n' +
        '| i | Swap positions | `A` afterwards |\n|---|---|---|\n' +
        '| 1 | 1 and 4 | `[8, 4, 6, 2]` |\n' +
        '| 2 | 2 and 3 | `[8, 6, 4, 2]` |\n' +
        '| 3 | 3 and 2 | `[8, 4, 6, 2]` |\n' +
        '| 4 | 4 and 1 | `[2, 4, 6, 8]` |\n\n' +
        'Halfway through, the array is reversed, but the loop keeps going and swaps every pair back. Output: `[2, 4, 6, 8]`.\n\n' +
        'To reverse the array, the loop should only run over the first half: `for i = 1 to div(n,2)`.',
      whyWrong: [
        null,
        'This is the array after $i = 2$. The loop does not stop halfway; passes 3 and 4 swap each pair back again.',
        'This stops one pass early, after $i = 3$. The loop includes $i = 4$, which undoes the first swap too.',
        'This treats each pass as a one-way copy and forgets that `t` puts the old value back, so every step is a real swap.',
      ],
      keyIdea: 'Swapping mirror pairs over the whole array reverses it twice; only loop over the first half.',
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
      solution:
        '| i | A[i] | s |\n|---|---|---|\n' +
        '| 1 | 3 | 3 |\n' +
        '| 2 | 5 | 8 |\n' +
        '| 3 | 2 | 10 |\n' +
        '| 4 | 6 | 16 |\n\n' +
        'Output: 16.',
      whyWrong: [
        null,
        'This stops at $i = 3$, leaving out the last element. The loop runs up to and including the length.',
        'This starts at $i = 2$, leaving out the first element.',
        'This is only the last element, as if the line were `s = A[i]`. The running total keeps every value.',
      ],
      keyIdea: 'A running total starts at 0 and adds each element once.',
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
      solution:
        '`p` holds the **position** of the largest value so far.\n\n' +
        '| i | A[i] | A[p] before | A[i] > A[p]? | p |\n|---|---|---|---|---|\n' +
        '| 2 | 9 | 4 | yes | 2 |\n' +
        '| 3 | 2 | 9 | no | 2 |\n' +
        '| 4 | 9 | 9 | no | 2 |\n' +
        '| 5 | 1 | 9 | no | 2 |\n\n' +
        'The second 9 does not replace the first, because the test is strictly greater. Output: 2.',
      whyWrong: [
        null,
        'This is the largest **value**. The code prints `p`, its position.',
        'This would need the test `A[i] >= A[p]`. With `>`, an equal value does not replace the current one.',
        'This is the last index. `p` only changes when a larger value is found.',
      ],
      keyIdea: 'Track the position of the maximum separately from its value, and note whether ties replace it.',
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
      solution:
        '`m` starts at 0, and every element is greater than 0.\n\n' +
        '| i | A[i] | A[i] < m? | m |\n|---|---|---|---|\n' +
        '| 1 | 6 | no | 0 |\n' +
        '| 2 | 3 | no | 0 |\n' +
        '| 3 | 8 | no | 0 |\n\n' +
        '`m` never changes, so 0 is printed. To find the minimum, start with `m = A[1]`.',
      whyWrong: [
        null,
        'This is the true minimum, which is what the code would find if it started with `m = A[1]`. Starting from 0, the test is never true.',
        'This assumes `m` starts as the first element. The code sets it to 0.',
        'This is the maximum. Besides, the test uses `<`, so `m` could only go down.',
      ],
      keyIdea: 'A minimum search must start from a real element of the array, not from 0.',
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
      solution:
        'The loop works from the right, so each value is copied before it is overwritten.\n\n' +
        '| i | Assignment | `A` afterwards |\n|---|---|---|\n' +
        '| 4 | `A[4] = 3` | `[1, 2, 3, 3]` |\n' +
        '| 3 | `A[3] = 2` | `[1, 2, 2, 3]` |\n' +
        '| 2 | `A[2] = 1` | `[1, 1, 2, 3]` |\n\n' +
        'At $i = 1$ the loop stops. Output: `[1, 1, 2, 3]`.',
      whyWrong: [
        null,
        'This is what happens when the loop runs from the left. Running from the right keeps each value until it has been copied.',
        'This treats the shift as a rotation. The last value 4 is overwritten and lost, and `A[1]` is never changed.',
        '`i` goes down by 1 on each pass, so it reaches 1, the condition `i > 1` becomes false and the loop stops.',
      ],
      keyIdea: 'To shift right without losing values, work from the last index down.',
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
      solution:
        'The loop runs from the left, so each pass copies a value that was **just** overwritten.\n\n' +
        '| i | Assignment | `A` afterwards |\n|---|---|---|\n' +
        '| 2 | `A[2] = 1` | `[1, 1, 3, 4]` |\n' +
        '| 3 | `A[3] = 1` | `[1, 1, 1, 4]` |\n' +
        '| 4 | `A[4] = 1` | `[1, 1, 1, 1]` |\n\n' +
        'Output: `[1, 1, 1, 1]`.',
      whyWrong: [
        'This uses the old values on every pass. By the time $i = 3$, `A[2]` has already been changed to 1.',
        null,
        'This shifts left. The code copies `A[i - 1]` into `A[i]`, so values move to the right.',
        'This treats the shift as a rotation. Nothing here moves the last value to the front.',
      ],
      keyIdea: 'Shifting right from the left end spreads the first value through the whole array.',
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
      solution:
        '`mod(x,2) == 0` is true for even numbers, and each one adds 1 to `c`.\n\n' +
        '| i | A[i] | even? | c |\n|---|---|---|---|\n' +
        '| 1 | 4 | yes | 1 |\n' +
        '| 2 | 7 | no | 1 |\n' +
        '| 3 | 10 | yes | 2 |\n' +
        '| 4 | 3 | no | 2 |\n' +
        '| 5 | 8 | yes | 3 |\n\n' +
        'Output: 3.',
      whyWrong: [
        null,
        'This counts the odd numbers. A remainder of 0 on dividing by 2 means even.',
        'This adds the even values: $4 + 10 + 8$. The code adds 1 each time, not the value.',
        'This counts every element and ignores the `if`.',
      ],
      keyIdea: 'A counter adds 1 for each element that passes the test.',
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
      solution:
        'Check that the loop variable changes inside the loop. Nothing in the body changes `i`, so it stays 1.\n\n' +
        '| Pass | i | i <= 3? | s |\n|---|---|---|---|\n' +
        '| 1 | 1 | yes | 2 |\n' +
        '| 2 | 1 | yes | 4 |\n' +
        '| 3 | 1 | yes | 6 |\n\n' +
        'The condition is always true, so the loop never ends and nothing is printed: **Infinite loop**.',
      whyWrong: [
        'This is the sum the loop was meant to find. Without `i = i + 1`, the loop never moves past the first element.',
        'This assumes the loop runs once. The condition is tested again after each pass and is still true.',
        'This stops after three passes, as if the loop counted them. The `while` only stops when `i` passes the length, and `i` never changes.',
        null,
      ],
      keyIdea: 'A `while` loop over an array must update its index, or it never ends.',
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
      solution:
        'The loop moves along until it reaches the first 8.\n\n' +
        '| i | A[i] | A[i] != 8? |\n|---|---|---|\n' +
        '| 1 | 5 | yes, move on |\n' +
        '| 2 | 8 | no, stop |\n\n' +
        'Output: 2.',
      whyWrong: [
        null,
        'This is the position of the last 8. The loop stops at the first one it meets.',
        'This counts from 0, where the first 8 would be at index 1. Here the first element is at index 1, so the 8 is at index 2.',
        'This is the value being searched for. The code prints the position `i`.',
      ],
      keyIdea: 'A linear search stops at the first match and reports its position.',
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
      solution:
        'Each pass compares neighbours and swaps them if they are out of order.\n\n' +
        '| i | Compare | `A` afterwards |\n|---|---|---|\n' +
        '| 1 | 5 > 1, swap | `[1, 5, 4, 2]` |\n' +
        '| 2 | 5 > 4, swap | `[1, 4, 5, 2]` |\n' +
        '| 3 | 5 > 2, swap | `[1, 4, 2, 5]` |\n\n' +
        'The largest value has moved to the end, but the array is not yet sorted. Output: `[1, 4, 2, 5]`.',
      whyWrong: [
        null,
        'This is the fully sorted array, which needs more passes. One pass only carries the largest value to the end.',
        'This swaps the separate pairs at positions 1 and 2, then 3 and 4. The loop also compares positions 2 and 3.',
        'This uses `<` instead of `>`, which moves the smallest value to the end.',
      ],
      keyIdea: 'One pass of neighbour swaps carries the largest value to the end.',
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
