import type { StaticQuestion } from '../../../types';

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'lists-tuples-001',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a = [10, 20, 30, 40, 50]\nprint(a[1], a[-1])' },
    options: ['`10 50`', '`20 40`', '`20 50`', '`10 40`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Python counts list positions (indices) from **0**, and negative indices count back from the end, with `-1` meaning the last item.\n\n' +
        '| Value | 10 | 20 | 30 | 40 | 50 |\n| --- | --- | --- | --- | --- | --- |\n| Index | 0 | 1 | 2 | 3 | 4 |\n| Negative index | -5 | -4 | -3 | -2 | -1 |\n\n' +
        '1. `a[1]` is the item at index 1, which is the **second** item: 20.\n' +
        '2. `a[-1]` is the last item: 50.\n\n' +
        '`print` separates its two arguments with a space, so the output is `20 50`.',
      whyWrong: [
        'This counts from 1 instead of 0, so it treats `a[1]` as the first item (10). In Python the first item is `a[0]`.',
        'This treats `a[-1]` as one step back from the last item. In fact `a[-1]` is the last item itself (50); the second-to-last item is `a[-2]`.',
        null,
        'This makes both mistakes: it counts from 1 (giving 10) and treats `-1` as the second-to-last item (giving 40).',
      ],
      keyIdea: 'Indices start at 0, and index `-1` is the last item of the list.',
    },
    check: {
      optionValues: ['10 50', '20 40', '20 50', '10 40'],
      compute: () => {
        const a = [10, 20, 30, 40, 50];
        return `${a[1]} ${a[a.length - 1]}`;
      },
    },
    python: { stdout: '20 50\n' },
  },
  {
    id: 'lists-tuples-002',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'nums = [3, 6, 9, 12, 15, 18]\nprint(nums[1:4])' },
    options: ['`[6, 9, 12]`', '`[6, 9, 12, 15]`', '`[3, 6, 9, 12]`', '`[3, 6, 9]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A slice `nums[start:stop]` starts at index `start` and goes **up to but not including** index `stop`.\n\n' +
        '| Value | 3 | 6 | 9 | 12 | 15 | 18 |\n| --- | --- | --- | --- | --- | --- | --- |\n| Index | 0 | 1 | 2 | 3 | 4 | 5 |\n\n' +
        '1. `nums[1:4]` takes indices 1, 2 and 3 (index 4 is excluded).\n' +
        '2. Those items are 6, 9 and 12.\n' +
        '3. A slice of a list is a new list, so it prints with square brackets: `[6, 9, 12]`.\n\n' +
        'Quick check: the slice has $4 - 1 = 3$ items.',
      whyWrong: [
        null,
        'This includes the item at the stop index 4 (which is 15). The stop index is always excluded, so the slice has $4 - 1 = 3$ items, not 4.',
        'This counts positions from 1 and includes the stop, so it takes the 1st to the 4th items. Python indices start at 0 and the stop is excluded.',
        'This counts positions from 1 (taking the 1st, 2nd and 3rd items). Index 1 is the second item, 6, so the slice starts at 6, not 3.',
      ],
      keyIdea: '`nums[a:b]` contains the items at indices $a, a + 1, \\ldots, b - 1$, so it has $b - a$ items.',
    },
    python: { stdout: '[6, 9, 12]\n' },
  },
  {
    id: 'lists-tuples-003',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'What happens when this Python code is run?',
    code: { lang: 'python', source: 't = (1, 2, 3)\nt[0] = 9\nprint(t)' },
    options: ['It prints `(9, 2, 3)`', 'It prints `(1, 2, 3)`', 'It prints `[9, 2, 3]`', 'An error is raised (a `TypeError`)'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. `t = (1, 2, 3)` creates a **tuple** (round brackets).\n' +
        '2. Tuples are **immutable**: once created, their items cannot be replaced, added or removed.\n' +
        '3. So the line `t[0] = 9` fails with `TypeError: \'tuple\' object does not support item assignment`.\n' +
        '4. The program stops at that line, so `print(t)` never runs.\n\n' +
        'If you need a changed version, build a new tuple, for example `t = (9,) + t[1:]`, or use a list instead.',
      whyWrong: [
        'This treats the tuple like a list. Lists can be changed with `a[0] = 9`, but tuples are immutable, so the assignment raises an error instead.',
        'This assumes Python silently ignores the assignment. Python never ignores it: trying to change a tuple item raises a `TypeError` and the program stops.',
        'This assumes Python converts the tuple into a list so it can be changed. Python never changes the type automatically; it raises a `TypeError`.',
        null,
      ],
      keyIdea: 'Tuples are immutable: assigning to `t[i]` raises a `TypeError`.',
    },
    python: { error: 'TypeError' },
  },
  {
    id: 'lists-tuples-004',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a = [1, 2]\na.append([3, 4])\nprint(a, len(a))' },
    options: ['`[1, 2, 3, 4] 4`', '`[1, 2, [3, 4]] 3`', '`[1, 2, [3, 4]] 4`', 'An error is raised, because `append` only accepts a single number'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. `a.append(x)` adds **one** item, `x`, to the end of the list, whatever `x` is.\n' +
        '2. Here `x` is the list `[3, 4]`, so the whole list is added as a single item: `a` becomes `[1, 2, [3, 4]]`.\n' +
        '3. `len(a)` counts the top-level items: `1`, `2` and `[3, 4]`, which is 3 items.\n\n' +
        'Output: `[1, 2, [3, 4]] 3`.\n\n' +
        '(If the code had used `a.extend([3, 4])`, each item would be added separately, giving `[1, 2, 3, 4]` with length 4.)',
      whyWrong: [
        'This is what `extend` does. `append` adds its argument as one single item, so the list `[3, 4]` goes in as a nested list.',
        null,
        'The list is right, but `len` only counts the top-level items. The nested list `[3, 4]` counts as one item, so the length is 3.',
        'This assumes `append` only takes numbers. A list can hold any objects, including other lists, so `append([3, 4])` works fine.',
      ],
      keyIdea: '`append` adds its argument as ONE item (even a list); `extend` adds each item of an iterable separately.',
    },
    python: { stdout: '[1, 2, [3, 4]] 3\n' },
  },
  {
    id: 'lists-tuples-005',
    subtopic: 'lists-tuples',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'grid = [[1, 2, 3],\n        [4, 5, 6],\n        [7, 8, 9]]\nprint(grid[1][2])' },
    options: ['`8`', '`2`', '`5`', '`6`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`grid` is a list of three lists (the rows). `grid[1][2]` is read left to right:\n\n' +
        '1. `grid[1]` picks the row at index 1, which is the **second** row: `[4, 5, 6]`.\n' +
        '2. `[2]` then picks the item at index 2 of that row, which is the **third** item: 6.\n\n' +
        'So the first index chooses the row and the second index chooses the column. Output: `6`.',
      whyWrong: [
        'This swaps rows and columns, reading `grid[2][1]` (row 2, column 1) instead. The first index chooses the row.',
        'This counts from 1, reading "row 1, column 2" as the first row and second item. Python indices start at 0.',
        'This counts the row from 0 correctly but the column from 1, landing on the second item of the row. Both indices start at 0, so index 2 is the third item.',
        null,
      ],
      keyIdea: 'For a nested list, `grid[r][c]` means: take row `r`, then item `c` of that row (both counted from 0).',
    },
    check: {
      optionValues: [8, 2, 5, 6],
      compute: () => {
        const grid = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ];
        return grid[1][2];
      },
    },
    python: { stdout: '6\n' },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'lists-tuples-006',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'nums = [4, 1, 3]\nresult = nums.sort()\nprint(nums, result)' },
    options: ['`[1, 3, 4] [1, 3, 4]`', '`[4, 1, 3] [1, 3, 4]`', '`[1, 3, 4] None`', '`[4, 1, 3] None`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. `nums.sort()` sorts the list **in place**: the list `nums` itself is changed to `[1, 3, 4]`.\n' +
        '2. Methods that change a list in place (`sort`, `append`, `reverse`, ...) return `None`. So `result` is `None`.\n' +
        '3. `print(nums, result)` shows `[1, 3, 4] None`.\n\n' +
        'Compare: `sorted(nums)` would leave `nums` unchanged and **return** a new sorted list.',
      whyWrong: [
        'This assumes `sort()` also returns the sorted list. It sorts in place and returns `None`; only `sorted()` returns a list.',
        'This mixes up `nums.sort()` with `sorted(nums)`. `sorted` returns a new list and leaves the original alone; `sort` changes the original and returns `None`.',
        null,
        'This assumes the sorted result is thrown away because it was not stored. `sort()` changes `nums` itself, so `nums` is now `[1, 3, 4]`.',
      ],
      keyIdea: '`nums.sort()` changes the list in place and returns `None`; `sorted(nums)` returns a new sorted list.',
    },
    python: { stdout: '[1, 3, 4] None\n' },
  },
  {
    id: 'lists-tuples-007',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a = [1, 2, 3]\nb = a\nc = a[:]\nb.append(4)\nc.append(5)\nprint(a, len(c))' },
    options: ['`[1, 2, 3] 4`', '`[1, 2, 3, 4] 4`', '`[1, 2, 3, 4, 5] 5`', '`[1, 2, 3, 4] 5`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The key question for each name is: does it point to the **same** list object, or to a **copy**?\n\n' +
        '| Line | What happens | `a` | `c` |\n| --- | --- | --- | --- |\n' +
        '| `a = [1, 2, 3]` | one list is created | `[1, 2, 3]` | |\n' +
        '| `b = a` | `b` is another name for the **same** list (an alias) | `[1, 2, 3]` | |\n' +
        '| `c = a[:]` | a full slice makes a **new** list (a copy) | `[1, 2, 3]` | `[1, 2, 3]` |\n' +
        '| `b.append(4)` | changes the shared list, so `a` changes too | `[1, 2, 3, 4]` | `[1, 2, 3]` |\n' +
        '| `c.append(5)` | changes only the copy | `[1, 2, 3, 4]` | `[1, 2, 3, 5]` |\n\n' +
        'So `a` is `[1, 2, 3, 4]` and `len(c)` is 4. Output: `[1, 2, 3, 4] 4`.',
      whyWrong: [
        'This thinks `b = a` makes a copy. Assignment never copies a list: `b` and `a` are two names for one list, so appending through `b` changes `a`.',
        null,
        'This thinks `c = a[:]` is also an alias. A full slice `[:]` builds a brand-new list, so appending 5 to `c` does not affect `a`.',
        'This thinks `c` also picks up the 4. `c` was copied **before** the 4 was appended, and it is a separate list, so it has 3 + 1 = 4 items.',
      ],
      keyIdea: '`b = a` creates an alias (the same list); `a[:]` creates a new copy.',
    },
    python: { stdout: '[1, 2, 3, 4] 4\n' },
  },
  {
    id: 'lists-tuples-008',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a = [5, 3, 8, 3, 1]\na.remove(3)\na.insert(1, 7)\nx = a.pop()\nprint(a, x)' },
    options: ['`[5, 7, 8] 1`', '`[5, 7, 3, 8] 1`', '`[7, 8, 3, 1] 5`', '`[5, 7, 8, 3] 1`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '| Line | Rule | `a` afterwards |\n| --- | --- | --- |\n' +
        '| `a = [5, 3, 8, 3, 1]` | start | `[5, 3, 8, 3, 1]` |\n' +
        '| `a.remove(3)` | removes the **first** item equal to 3 (by value) | `[5, 8, 3, 1]` |\n' +
        '| `a.insert(1, 7)` | puts 7 **at** index 1, shifting the rest right | `[5, 7, 8, 3, 1]` |\n' +
        '| `x = a.pop()` | removes and returns the **last** item | `[5, 7, 8, 3]`, `x` is 1 |\n\n' +
        'Output: `[5, 7, 8, 3] 1`.',
      whyWrong: [
        'This thinks `remove(3)` deletes every 3. It only deletes the **first** matching item, so the second 3 stays.',
        'This treats `remove(3)` as "delete the item at index 3". `remove` works by **value**; deleting by index is `pop(3)` or `del a[3]`.',
        'This thinks `pop()` takes the first item. With no argument, `pop()` removes and returns the **last** item; `pop(0)` would take the first.',
        null,
      ],
      keyIdea: '`remove(x)` deletes the first item equal to `x`; `insert(i, x)` puts `x` at index `i`; `pop()` removes and returns the last item.',
    },
    python: { stdout: '[5, 7, 8, 3] 1\n' },
  },
  {
    id: 'lists-tuples-009',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'squares = [x * x for x in range(1, 8) if x % 2 == 0]\nprint(squares)' },
    options: ['`[4, 16, 36]`', '`[1, 9, 25, 49]`', '`[4, 16, 36, 64]`', '`[0, 4, 16, 36]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Read a list comprehension as: **for each** `x` in the range, **if** the condition holds, put `x * x` in the new list.\n\n' +
        '1. `range(1, 8)` gives 1, 2, 3, 4, 5, 6, 7 (the stop value 8 is excluded).\n' +
        '2. `x % 2 == 0` keeps only the even numbers: 2, 4, 6.\n' +
        '3. Squaring each gives $2^2 = 4$, $4^2 = 16$, $6^2 = 36$.\n\n' +
        'Output: `[4, 16, 36]`.',
      whyWrong: [
        null,
        'These are the squares of the **odd** numbers. `x % 2 == 0` means the remainder on dividing by 2 is 0, which is true for even numbers.',
        'This includes 8 in the range. `range(1, 8)` stops **before** 8, so the last even number is 6.',
        'This starts the range at 0. `range(1, 8)` starts at 1, so 0 is never tested.',
      ],
      keyIdea: '`[expr for x in seq if cond]` applies `expr` to each item that passes `cond`; `range(a, b)` excludes `b`.',
    },
    python: { stdout: '[4, 16, 36]\n' },
  },
  {
    id: 'lists-tuples-010',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a, b, c = 1, 2, 3\na, b = b, a + b\nc, a = a, c\nprint(a, b, c)' },
    options: ['`2 4 2`', '`2 3 2`', '`3 3 2`', '`3 4 2`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'In a multiple assignment like `a, b = b, a + b`, Python works out **every value on the right first**, using the old values, and only then assigns them.\n\n' +
        '1. `a, b, c = 1, 2, 3` gives $a = 1$, $b = 2$, $c = 3$.\n' +
        '2. `a, b = b, a + b`: the right side is $(2, 1 + 2) = (2, 3)$. So $a = 2$, $b = 3$.\n' +
        '3. `c, a = a, c`: the right side is $(2, 3)$ using the current $a = 2$ and $c = 3$. So $c = 2$, $a = 3$.\n\n' +
        'Output: `3 3 2`.',
      whyWrong: [
        'This does both lines one assignment at a time. First line: $a = 2$, then $b = 2 + 2 = 4$. Second line: $c = 2$, then $a = 2$. But the right-hand side is evaluated fully before any name changes.',
        'The first line is right, but the second line is done one assignment at a time ($c = 2$, then $a = c = 2$). Both values on the right are taken before assigning, so $a$ gets the old $c = 3$.',
        null,
        'This does the first line one assignment at a time ($a = 2$, then $b = 2 + 2 = 4$). Python computes $a + b$ with the old $a = 1$, so $b = 3$.',
      ],
      keyIdea: 'Tuple unpacking evaluates the whole right-hand side first, then assigns, so `a, b = b, a` swaps values.',
    },
    check: {
      optionValues: ['2 4 2', '2 3 2', '3 3 2', '3 4 2'],
      compute: () => {
        let a = 1;
        let b = 2;
        let c = 3;
        [a, b] = [b, a + b];
        [c, a] = [a, c];
        return `${a} ${b} ${c}`;
      },
    },
    python: { stdout: '3 3 2\n' },
  },
  {
    id: 'lists-tuples-011',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: "words = ['pear', 'fig', 'banana', 'kiwi']\nprint(sorted(words, key=len))" },
    options: [
      "`['banana', 'fig', 'kiwi', 'pear']`",
      "`['fig', 'pear', 'kiwi', 'banana']`",
      "`['fig', 'kiwi', 'pear', 'banana']`",
      "`['banana', 'pear', 'kiwi', 'fig']`",
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '`key=len` means the words are compared by their **length**, not alphabetically.\n\n' +
        '| Word | `len` |\n| --- | --- |\n| pear | 4 |\n| fig | 3 |\n| banana | 6 |\n| kiwi | 4 |\n\n' +
        '1. Shortest first: fig (3).\n' +
        '2. Then the two words of length 4. Python\'s sort is **stable**: items with equal keys keep their original order. In `words`, pear comes before kiwi, so pear stays first.\n' +
        '3. Then banana (6).\n\n' +
        "Output: `['fig', 'pear', 'kiwi', 'banana']`.",
      whyWrong: [
        'This is plain alphabetical order, which is what `sorted(words)` would give without a key. With `key=len` the words are ordered by length.',
        null,
        'This breaks the tie between pear and kiwi alphabetically. Python only compares the key (the length), and equal keys keep their original order, so pear stays before kiwi.',
        'This sorts from longest to shortest. Sorting is ascending (smallest key first) unless you add `reverse=True`.',
      ],
      keyIdea: '`sorted(..., key=f)` orders by `f(item)`, ascending, and keeps the original order for ties (stable sort).',
    },
    python: { stdout: "['fig', 'pear', 'kiwi', 'banana']\n" },
  },
  {
    id: 'lists-tuples-012',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = [0, 1, 2, 3, 4, 5, 6, 7]\nprint(s[::-2], s[-3:])' },
    options: ['`[6, 4, 2, 0] [5, 6, 7]`', '`[7, 5, 3, 1] [7, 6, 5]`', '`[0, 2, 4, 6] [5, 6, 7]`', '`[7, 5, 3, 1] [5, 6, 7]`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'A slice has the form `s[start:stop:step]`. Missing values take sensible defaults.\n\n' +
        '1. `s[::-2]`: a **negative step** walks backwards. With no start given, it starts at the **last** item (7) and takes every 2nd item going left: 7, 5, 3, 1. So `[7, 5, 3, 1]`.\n' +
        '2. `s[-3:]`: start at index -3 (the third item from the end, which is 5) and go to the end, in the normal left-to-right order: `[5, 6, 7]`.\n\n' +
        'Output: `[7, 5, 3, 1] [5, 6, 7]`.',
      whyWrong: [
        'This starts the backwards walk at the second-to-last item. With a negative step and no start, the slice starts at the very last item (7).',
        'The first slice is right, but `s[-3:]` is not reversed: it has no negative step, so it runs left to right, giving `[5, 6, 7]`.',
        'This ignores the minus sign in the step and walks forwards from the start. A negative step means the slice runs from the end backwards.',
        null,
      ],
      keyIdea: 'A negative step walks backwards starting from the last item; `s[-k:]` gives the last `k` items in their normal order.',
    },
    python: { stdout: '[7, 5, 3, 1] [5, 6, 7]\n' },
  },
  {
    id: 'lists-tuples-013',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: 'What does this Python code print? (If it raises an error, choose the error option.)',
    code: { lang: 'python', source: 't = (1, [2, 3])\nt[1].append(4)\nprint(t)' },
    options: [
      'An error is raised (a `TypeError`), because tuples cannot be changed',
      '`(1, [2, 3])`',
      '`(1, [2, 3, 4])`',
      '`(1, [2, 3], 4)`',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. The tuple `t` holds two things: the number 1 and a **list** `[2, 3]`.\n' +
        '2. Tuple immutability means you cannot replace which objects the tuple holds (for example `t[1] = [9]` would fail).\n' +
        '3. But `t[1].append(4)` does not replace anything in the tuple. It reaches the list stored at `t[1]` and changes **that list**, which is mutable.\n' +
        '4. The tuple still holds the same list object, which is now `[2, 3, 4]`.\n\n' +
        'Output: `(1, [2, 3, 4])`.',
      whyWrong: [
        'This assumes nothing inside a tuple can ever change. The tuple cannot be given different items, but a mutable item inside it (here a list) can still be changed in place.',
        'This assumes `append` worked on a copy of the list. `t[1]` is the actual list stored in the tuple, so appending changes it.',
        null,
        'This adds 4 to the tuple itself. `append` was called on the list `t[1]`, so 4 goes inside the inner list, and the tuple still has 2 items.',
      ],
      keyIdea: 'A tuple cannot be given different items, but a mutable object inside it (like a list) can still be modified.',
    },
    python: { stdout: '(1, [2, 3, 4])\n' },
  },
  {
    id: 'lists-tuples-014',
    subtopic: 'lists-tuples',
    difficulty: 'exam',
    stem: '`data` is a Python list containing 50 numbers. How many items are in the slice `data[5:40:5]`?',
    options: ['$8$', '$7$', '$35$', '$10$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The slice `data[5:40:5]` starts at index 5, adds 5 each time, and stops **before** index 40.\n\n' +
        '1. Indices taken: 5, 10, 15, 20, 25, 30, 35. The next one would be 40, which is excluded.\n' +
        '2. Count them: 7 items.\n\n' +
        'Shortcut: the number of items is $\\frac{40 - 5}{5} = 7$ (when the step divides the gap exactly; otherwise round **up**).',
      whyWrong: [
        'This includes index 40. The stop index is never included in a slice.',
        null,
        'This is $40 - 5 = 35$, which ignores the step of 5. Only every 5th index is taken.',
        'This is $\\frac{50}{5} = 10$, which counts every 5th item of the whole list, ignoring the start 5 and stop 40.',
      ],
      keyIdea: '`data[a:b:s]` takes the indices $a, a + s, a + 2s, \\ldots$ for as long as they are less than $b$.',
    },
    check: {
      optionValues: [8, 7, 35, 10],
      compute: () => {
        const n = 50;
        let count = 0;
        for (let i = 5; i < Math.min(40, n); i += 5) count++;
        return count;
      },
    },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'lists-tuples-015',
    subtopic: 'lists-tuples',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'import copy\n\na = [[1, 2], [3, 4]]\nb = a.copy()\nc = copy.deepcopy(a)\nb[0].append(5)\nb.append([6])\nc[1][0] = 9\nprint(a)',
    },
    options: ['`[[1, 2, 5], [3, 4]]`', '`[[1, 2], [3, 4]]`', '`[[1, 2, 5], [3, 4], [6]]`', '`[[1, 2, 5], [9, 4]]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '- `a.copy()` makes a **shallow copy**: `b` is a new outer list, but its items are the **same inner lists** as in `a`.\n' +
        '- `copy.deepcopy(a)` makes a **deep copy**: `c` gets new copies of the inner lists too, so it shares nothing with `a`.\n\n' +
        'Now trace the changes:\n\n' +
        '1. `b[0].append(5)`: `b[0]` is the very same inner list as `a[0]`, so `a[0]` becomes `[1, 2, 5]`.\n' +
        '2. `b.append([6])`: this changes only the outer list `b`. `a` is a different outer list, so it does not get `[6]`.\n' +
        '3. `c[1][0] = 9`: `c` is completely independent, so `a` is unaffected.\n\n' +
        'Output: `[[1, 2, 5], [3, 4]]`.',
      whyWrong: [
        null,
        'This treats `a.copy()` as a full independent copy. A shallow copy only copies the outer list; the inner lists are shared, so changing `b[0]` changes `a[0]`.',
        'This treats `b` as an alias of `a`. `b` is a new outer list, so appending `[6]` to `b` does not affect `a`; only the shared inner lists are linked.',
        'This assumes the deep copy still shares inner lists with `a`. `deepcopy` copies every level, so changing `c[1][0]` cannot affect `a`.',
      ],
      keyIdea: 'A shallow copy duplicates only the outer list (inner lists are shared); a deep copy duplicates every level.',
    },
    python: { stdout: '[[1, 2, 5], [3, 4]]\n' },
  },
  {
    id: 'lists-tuples-016',
    subtopic: 'lists-tuples',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'grid = [[0] * 3] * 2\ngrid[0][1] = 5\nprint(grid)' },
    options: ['`[[0, 5, 0], [0, 0, 0]]`', '`[[5, 5, 5], [5, 5, 5]]`', '`[[0, 5, 0, 0, 5, 0]]`', '`[[0, 5, 0], [0, 5, 0]]`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. `[0] * 3` builds one row: `[0, 0, 0]`.\n' +
        '2. `[row] * 2` builds an outer list containing that **same row object twice**. It does not copy the row. So `grid[0]` and `grid[1]` are two names for one list.\n' +
        '3. `grid[0][1] = 5` changes index 1 of that one shared row.\n' +
        '4. Printing shows the shared row twice: `[[0, 5, 0], [0, 5, 0]]`.\n\n' +
        'The safe way to build independent rows is a comprehension: `[[0] * 3 for _ in range(2)]`, which creates a new row on each pass.',
      whyWrong: [
        'This assumes the two rows are separate lists. Multiplying a list of lists repeats references to the same inner list, so both rows change together.',
        'This assumes all six cells are linked. Inside a row, `grid[0][1] = 5` replaces just one position; only the two rows are the same object, not the cells.',
        'This assumes `* 2` joins the rows into one long list. `[[0, 0, 0]] * 2` repeats the single item (the row), giving a list of 2 rows.',
        null,
      ],
      keyIdea: '`[[0] * 3] * 2` repeats a reference to ONE inner list, so changing one row changes both.',
    },
    python: { stdout: '[[0, 5, 0], [0, 5, 0]]\n' },
  },
  {
    id: 'lists-tuples-017',
    subtopic: 'lists-tuples',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a = [1, 2]\nb = a\na += [3]\nc = a\na = a + [4]\nprint(b, c, a)' },
    options: [
      '`[1, 2] [1, 2, 3] [1, 2, 3, 4]`',
      '`[1, 2, 3] [1, 2, 3] [1, 2, 3, 4]`',
      '`[1, 2, 3, 4] [1, 2, 3, 4] [1, 2, 3, 4]`',
      '`[1, 2, 3] [1, 2, 3, 4] [1, 2, 3, 4]`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'For lists, `a += [3]` and `a = a + [4]` are **not** the same:\n\n' +
        '- `a += [3]` extends the existing list **in place** (same object).\n' +
        '- `a = a + [4]` builds a **new** list and then points the name `a` at it.\n\n' +
        '| Line | Effect | `b` | `c` | `a` |\n| --- | --- | --- | --- | --- |\n' +
        '| `a = [1, 2]`, `b = a` | one list, two names | `[1, 2]` | | `[1, 2]` |\n' +
        '| `a += [3]` | the shared list grows in place | `[1, 2, 3]` | | `[1, 2, 3]` |\n' +
        '| `c = a` | third name for the same list | `[1, 2, 3]` | `[1, 2, 3]` | `[1, 2, 3]` |\n' +
        '| `a = a + [4]` | new list; only `a` moves to it | `[1, 2, 3]` | `[1, 2, 3]` | `[1, 2, 3, 4]` |\n\n' +
        'Output: `[1, 2, 3] [1, 2, 3] [1, 2, 3, 4]`.',
      whyWrong: [
        'This treats `a += [3]` like `a = a + [3]`, making a new list. For lists, `+=` changes the existing list in place, so `b` sees the 3 as well.',
        null,
        'This treats `a = a + [4]` as an in-place change. The `+` operator builds a new list, and only the name `a` is moved to it; `b` and `c` keep the old list.',
        'This assumes `c = a` ties the name `c` to the name `a`, so `c` follows `a` wherever it goes. Assignment ties `c` to the object `a` pointed to at that moment, which is the same list as `b`.',
      ],
      keyIdea: 'For lists, `a += x` modifies the list in place (aliases see it), while `a = a + x` creates a new list.',
    },
    python: { stdout: '[1, 2, 3] [1, 2, 3] [1, 2, 3, 4]\n' },
  },
  {
    id: 'lists-tuples-018',
    subtopic: 'lists-tuples',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'm = [[1, 2, 3],\n     [4, 5, 6]]\nt = [[row[i] for row in m] for i in range(3)]\nprint(t)' },
    options: ['`[[1, 2, 3], [4, 5, 6]]`', '`[1, 4, 2, 5, 3, 6]`', '`[[1, 4], [2, 5], [3, 6]]`', '`[[1, 2], [3, 4], [5, 6]]`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Work from the **outer** comprehension inwards. The outer one runs `i = 0, 1, 2`, and for each `i` it builds the inner list `[row[i] for row in m]`, which takes item `i` from every row.\n\n' +
        '| `i` | `row[i]` for each row | Inner list |\n| --- | --- | --- |\n' +
        '| 0 | `1` from the first row, `4` from the second | `[1, 4]` |\n' +
        '| 1 | `2`, `5` | `[2, 5]` |\n' +
        '| 2 | `3`, `6` | `[3, 6]` |\n\n' +
        'So `t` is `[[1, 4], [2, 5], [3, 6]]`: the columns of `m` have become rows. This is the **transpose** of the $2 \\times 3$ matrix, which is $3 \\times 2$.\n\n' +
        'Output: `[[1, 4], [2, 5], [3, 6]]`.',
      whyWrong: [
        'This assumes the comprehension copies `m` unchanged. The inner list collects item `i` from each row, so each new row is a column of `m`.',
        'This loses the inner brackets. The inner comprehension is itself in square brackets, so it produces a separate list for each `i`.',
        null,
        'This keeps the numbers in reading order and just regroups them in pairs. The new rows are the **columns** of `m` (1 with 4, 2 with 5, 3 with 6).',
      ],
      keyIdea: '`[[row[i] for row in m] for i in range(cols)]` builds the transpose: column `i` of `m` becomes row `i`.',
    },
    python: { stdout: '[[1, 4], [2, 5], [3, 6]]\n' },
  },
  {
    id: 'lists-tuples-019',
    subtopic: 'lists-tuples',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'def process(items):\n    items.append(0)\n    items = sorted(items)\n    items.append(99)\n    return items\n\ndata = [3, 1, 2]\nresult = process(data)\nprint(data, result)',
    },
    options: [
      '`[3, 1, 2] [0, 1, 2, 3, 99]`',
      '`[0, 1, 2, 3, 99] [0, 1, 2, 3, 99]`',
      '`[3, 1, 2, 0, 99] [0, 1, 2, 3]`',
      '`[3, 1, 2, 0] [0, 1, 2, 3, 99]`',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'When a list is passed to a function, the parameter `items` is a second name for the **same** list as `data` (no copy is made).\n\n' +
        '1. `items.append(0)`: changes the shared list, so `data` becomes `[3, 1, 2, 0]`.\n' +
        '2. `items = sorted(items)`: `sorted` returns a **new** list `[0, 1, 2, 3]`, and the local name `items` now points to it. `data` still points to the old list.\n' +
        '3. `items.append(99)`: changes only the new list: `[0, 1, 2, 3, 99]`.\n' +
        '4. That new list is returned, so `result` is `[0, 1, 2, 3, 99]`.\n\n' +
        'Output: `[3, 1, 2, 0] [0, 1, 2, 3, 99]`.',
      whyWrong: [
        'This assumes the function works on a copy of `data`. The parameter refers to the same list, so the first `append(0)` changes `data`.',
        'This assumes `items = sorted(items)` changes `data` too, as if the list were sorted in place. `sorted` builds a new list and assignment only moves the local name `items`, so `data` keeps the old, unsorted list.',
        'This assumes `items.append(99)` still adds to the original list `data`. After `items = sorted(items)`, the name `items` refers to the new sorted list, so 99 goes onto that new list (which is returned), and `data` does not get it.',
        null,
      ],
      keyIdea: 'Mutating a parameter (`append`) changes the caller\'s list; reassigning the parameter (`items = ...`) does not.',
    },
    python: { stdout: '[3, 1, 2, 0] [0, 1, 2, 3, 99]\n' },
  },
  {
    id: 'lists-tuples-020',
    subtopic: 'lists-tuples',
    difficulty: 'challenge',
    stem: 'A student wants to reverse an array in place. Arrays are indexed from 0, and `for i = 0 to k` includes both 0 and $k$. What is printed by this pseudocode?',
    code: {
      lang: 'pseudocode',
      source:
        'A = [2, 4, 6, 8, 10]\nn = length(A)\nfor i = 0 to n - 1\n    temp = A[i]\n    A[i] = A[n - 1 - i]\n    A[n - 1 - i] = temp\nend for\nprint(A)',
    },
    options: ['`[2, 4, 6, 8, 10]`', '`[10, 8, 6, 4, 2]`', '`[10, 4, 6, 8, 2]`', '`[10, 8, 6, 8, 10]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each pass swaps `A[i]` with its mirror position `A[n - 1 - i]` (using `temp`, so it is a true swap). Here $n = 5$ and the loop runs $i = 0, 1, 2, 3, 4$.\n\n' +
        '| `i` | Swap positions | `A` afterwards |\n| --- | --- | --- |\n' +
        '| 0 | 0 and 4 | `[10, 4, 6, 8, 2]` |\n' +
        '| 1 | 1 and 3 | `[10, 8, 6, 4, 2]` |\n' +
        '| 2 | 2 and 2 | `[10, 8, 6, 4, 2]` |\n' +
        '| 3 | 3 and 1 | `[10, 4, 6, 8, 2]` |\n' +
        '| 4 | 4 and 0 | `[2, 4, 6, 8, 10]` |\n\n' +
        'Halfway through, the array is reversed, but the loop keeps going and swaps every pair **back**. Output: `[2, 4, 6, 8, 10]`.\n\n' +
        'To reverse correctly, the loop should only run over the first half: `for i = 0 to (n div 2) - 1`.',
      whyWrong: [
        null,
        'This is the array after $i = 1$ (or $i = 2$). The loop does not stop halfway; passes $i = 3$ and $i = 4$ swap each pair back again.',
        'This is what you get if you stop one pass early (after $i = 3$), as if `to n - 1` excluded $n - 1$. The loop includes $i = 4$, which undoes the first swap too.',
        'This treats each pass as a one-way copy `A[i] = A[n - 1 - i]` and forgets that `temp` puts the old value back into the mirror position, so nothing is lost and every step is a real swap.',
      ],
      keyIdea: 'Swapping mirror pairs over the WHOLE array reverses it twice; only loop over the first half.',
    },
    check: {
      optionValues: ['2,4,6,8,10', '10,8,6,4,2', '10,4,6,8,2', '10,8,6,8,10'],
      compute: () => {
        const A = [2, 4, 6, 8, 10];
        const n = A.length;
        for (let i = 0; i <= n - 1; i++) {
          const temp = A[i];
          A[i] = A[n - 1 - i];
          A[n - 1 - i] = temp;
        }
        return A.join(',');
      },
    },
  },
];
