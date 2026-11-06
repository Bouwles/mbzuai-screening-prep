import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'lists-tuples',
  simple:
    'An **array** is like a row of numbered lockers, each holding one value. In the pseudocode used here the numbering starts at **1**, so `A[1]` is the first locker and `A[length(A)]` is the last. You can open any locker straight away by its number, walk along the row with a loop to add things up or find the largest value, or move values between lockers. Moving values needs care, because putting a new value in a locker throws away what was there.',
  methods: [
    { cue: 'A single index like `A[3]` or `A[length(A)]`', method: 'Write the indices 1, 2, 3, ... above the values first, then read off the position. `length(A)` is the last index.' },
    { cue: 'A `for i = 1 to length(A)` loop adding or counting', method: 'Make a table with one row per pass: `i`, `A[i]` and the running total or counter.' },
    { cue: 'Finding a maximum or minimum, or its position', method: 'Track the best so far. Check what it starts as (a real element, or 0?), whether the test is `>` or `>=`, and whether the code prints the value or the index.' },
    { cue: 'A swap of two elements', method: 'With `t` saving a value, the two elements exchange. Without `t`, the first assignment destroys a value and both positions end up the same.' },
    { cue: 'A shift: `A[i] = A[i + 1]` or `A[i] = A[i - 1]`', method: 'Write the array after each pass. Going against the direction of the copy keeps every value; going with it spreads one value along the array.' },
    { cue: 'A `while` loop with an index', method: 'Check that the index changes inside the loop. If nothing changes it, the answer is "Infinite loop".' },
    { cue: 'A two-dimensional array `G[r][c]`', method: 'Choose the row first, then the item in that row, both counted from 1. An $m \\times n$ array has $mn$ elements.' },
  ],
  know:
    '### Arrays: an ordered row of boxes\n\n' +
    'An **array** stores several values in order: `A = [10, 20, 30, 40, 50]`. Each value sits at a numbered position called an **index**. The pseudocode here counts from **1**, and the question will say so ("Arrays are indexed from 1").\n\n' +
    '| Index | 1 | 2 | 3 | 4 | 5 |\n| --- | --- | --- | --- | --- | --- |\n| Value | 10 | 20 | 30 | 40 | 50 |\n\n' +
    'So `A[1]` is 10, `A[5]` is 50 and `length(A)` is 5. An array of length $n$ has indices 1 to $n$, so the last element is `A[length(A)]`. Reading or changing an element by its index takes the same time however long the array is: $O(1)$.\n\n' +
    '### Traversing: visiting every element\n\n' +
    'A loop from 1 to `length(A)` visits each element once. Almost every array question is a small change to this pattern:\n\n' +
    '```pseudocode\nA = [3, 5, 2, 6]\ns = 0\nfor i = 1 to length(A)\n   s = s + A[i]\nend for\nprint(s)\n```\n\n' +
    'Watch the limits: starting at `i = 2` misses the first element, and stopping at `length(A) - 1` misses the last.\n\n' +
    '### Counting and filtering\n\n' +
    'Put an `if` inside the loop. Adding 1 counts the elements that pass the test; adding `A[i]` totals them. Options often include both, so read which one the code does.\n\n' +
    '### Maximum and minimum\n\n' +
    'Start with the first element, then replace it whenever a better one appears:\n\n' +
    '```pseudocode\nm = A[1]\nfor i = 2 to length(A)\n   if A[i] > m\n      m = A[i]\n   end if\nend for\n```\n\n' +
    'Finding the minimum is the same with `<`. Starting from `m = 0` is a classic bug: with all positive values, a minimum search never replaces it. To report **where** the maximum is, keep its index `p` and compare `A[i] > A[p]`. With `>`, the first of two equal values is kept; with `>=`, the last.\n\n' +
    '### Swapping\n\n' +
    'An assignment overwrites, so a swap needs a temporary variable:\n\n' +
    '```pseudocode\nt = A[i]\nA[i] = A[j]\nA[j] = t\n```\n\n' +
    'Without `t`, the lines `A[i] = A[j]` and `A[j] = A[i]` leave both positions holding the old `A[j]`.\n\n' +
    '### Shifting\n\n' +
    'Inserting or removing an element in the middle means moving the others along, one assignment at a time. With `A = [1, 2, 3, 4]`:\n\n' +
    '| Shift | Direction of loop | Result |\n| --- | --- | --- |\n' +
    '| `A[i] = A[i + 1]` | from the left | `[2, 3, 4, 4]` |\n' +
    '| `A[i] = A[i - 1]` | from the right | `[1, 1, 2, 3]` |\n' +
    '| `A[i] = A[i - 1]` | from the left | `[1, 1, 1, 1]` |\n\n' +
    'A shift is not a rotation: the value at one end is overwritten and lost, and the value at the other end appears twice. To reverse an array, swap mirror pairs `A[i]` and `A[n - i + 1]`, and only over the first half; a loop over the whole array swaps each pair back again.\n\n' +
    '### Two-dimensional arrays\n\n' +
    'An array can hold other arrays: `G = [[1, 2, 3], [4, 5, 6]]`. Then `G[r]` is a whole row and `G[r][c]` is one item: first choose the row, then the column, both counted from 1. So `G[2][1]` is 4. An array of **order** $m \\times n$ has $m$ rows and $n$ columns, so it holds $mn$ elements.',
  formulas: [
    { label: 'Valid indices', tex: '1, 2, \\ldots, n', note: 'For an array of length $n$ indexed from 1. The last element is `A[length(A)]`.' },
    { label: 'Mirror position', tex: 'i \\leftrightarrow n - i + 1', note: 'Position 1 pairs with position $n$, position 2 with $n - 1$, and so on.' },
    { label: 'Elements in a grid', tex: 'm \\times n \\text{ array} \\Rightarrow mn \\text{ elements}' },
    { label: 'Two-dimensional index', tex: '\\text{G}[r][c] = \\text{item in row } r \\text{, column } c' },
    { label: 'Cost of access', tex: '\\text{read by index: } O(1), \\qquad \\text{search an unsorted array: } O(n)' },
  ],
  examples: [
    {
      title: 'Indexing',
      problem: 'Arrays are indexed from 1. What does this print?\n\n```pseudocode\nA = [4, 8, 15, 16, 23]\nprint(A[2] + A[length(A)])\n```',
      steps: [
        'Write the indices above the values: 4 is at 1, 8 at 2, 15 at 3, 16 at 4, 23 at 5.',
        '`A[2]` is 8.',
        '`length(A)` is 5, so `A[length(A)]` is `A[5]`, which is 23.',
        '$8 + 23 = 31$.',
      ],
      answer: '31',
    },
    {
      title: 'Finding the position of the maximum',
      problem: 'Arrays are indexed from 1. What does this print?\n\n```pseudocode\nA = [3, 7, 7, 2]\np = 1\nfor i = 2 to length(A)\n   if A[i] > A[p]\n      p = i\n   end if\nend for\nprint(p)\n```',
      steps: [
        '$i = 2$: $7 > 3$, so `p` becomes 2.',
        '$i = 3$: $7 > 7$ is false, so `p` stays 2.',
        '$i = 4$: $2 > 7$ is false, so `p` stays 2.',
        'The code prints the position, not the value 7.',
      ],
      answer: '2',
    },
    {
      title: 'Shifting left',
      problem: 'Arrays are indexed from 1. What does this print?\n\n```pseudocode\nA = [6, 1, 9]\nfor i = 1 to length(A) - 1\n   A[i] = A[i + 1]\nend for\nprint(A)\n```',
      steps: [
        '$i = 1$: `A[1] = A[2]` gives `[1, 1, 9]`.',
        '$i = 2$: `A[2] = A[3]` gives `[1, 9, 9]`.',
        'The first value 6 is lost, and the last value stays where it is, so it appears twice.',
      ],
      answer: '`[1, 9, 9]`',
    },
    {
      title: 'A loop that never ends (exam level)',
      problem: 'Arrays are indexed from 1. What does this print?\n\n```pseudocode\nA = [5, 2]\ni = 1\nwhile (i <= length(A))\n   print(A[i])\nend while\n```',
      steps: [
        '$i = 1$ and the condition $1 \\le 2$ is true, so 5 is printed.',
        'Nothing in the body changes `i`, so the condition is still true.',
        'The same line runs again and again, and the loop never ends.',
      ],
      answer: 'Infinite loop',
    },
  ],
  traps: [
    'Counting from the wrong place. In this pseudocode `A[1]` is the first element and `A[length(A)]` is the last, so `A[length(A)]` is a valid element, not one past the end.',
    'Off-by-one loop limits. `for i = 1 to length(A) - 1` misses the last element, and `for i = 2 to length(A)` misses the first.',
    'Swapping without a temporary variable. `A[1] = A[3]` then `A[3] = A[1]` copies one value into both positions.',
    'Treating a shift as a rotation. A shift loses the value at one end, and the value at the other end appears twice.',
    'Shifting right from the left end. Each pass copies the value just written, so the first value spreads across the whole array.',
    'Printing the wrong thing. A maximum search can store the value or the position, so check which one reaches `print`.',
  ],
  examTip:
    'These questions are almost always "what does this code print?" with four outputs that differ by **one** misconception each: counting from 0, a loop that stops one short, a value lost in a swap, or a shift mistaken for a rotation. Work as follows:\n\n' +
    '1. Write the index numbers (1, 2, 3, ...) above the array on your scrap paper before reading any index.\n' +
    '2. Make a table with one row per pass, writing the array or the running value after each pass.\n' +
    '3. Use each assignment on the **current** array, not the original one.\n' +
    '4. Use quick checks to eliminate options: the length of the array never changes in these questions, and a counter can never be larger than the length.\n' +
    '5. If "Infinite loop" is an option and the loop is a `while`, check that its index really changes inside the body.',
};
