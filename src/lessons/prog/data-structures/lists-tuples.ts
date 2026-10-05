import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'lists-tuples',
  know:
    '### Lists: an ordered row of boxes\n\n' +
    'A **list** stores several values in order: `a = [10, 20, 30, 40, 50]`. Each value sits at a numbered position called an **index**, and Python counts from **0**. Negative indices count back from the end, so `a[-1]` is always the last item.\n\n' +
    '| Value | 10 | 20 | 30 | 40 | 50 |\n| --- | --- | --- | --- | --- | --- |\n| Index | 0 | 1 | 2 | 3 | 4 |\n| Negative index | -5 | -4 | -3 | -2 | -1 |\n\n' +
    'So `a[0]` is 10, `a[4]` is 50 and `a[-2]` is 40. A list of length $n$ has indices 0 to $n - 1$; `a[5]` here raises an `IndexError`. `len(a)` gives the number of items.\n\n' +
    '### Slicing: taking a piece\n\n' +
    '`a[start:stop]` gives a **new list** from index `start` up to **but not including** `stop`. So `a[1:4]` is `[20, 30, 40]`, which has $4 - 1 = 3$ items. Leave a number out to mean "from the beginning" or "to the end": `a[:2]` is the first 2 items, `a[-2:]` is the last 2 items, and `a[:]` is a copy of the whole list.\n\n' +
    'A third number is the **step**: `a[::2]` takes every 2nd item (`[10, 30, 50]`). A **negative step** walks backwards from the end, so `a[::-1]` reverses the list. Slices never raise an error for going past the end; they just stop.\n\n' +
    '### Changing a list: the methods\n\n' +
    '| Code | What it does | Returns |\n| --- | --- | --- |\n' +
    '| `a.append(x)` | adds `x` as ONE item at the end | `None` |\n' +
    '| `a.extend([x, y])` | adds `x` and `y` separately at the end | `None` |\n' +
    '| `a.insert(i, x)` | puts `x` **at** index `i`, shifting later items right | `None` |\n' +
    '| `a.pop()` | removes the **last** item | that item |\n' +
    '| `a.pop(i)` | removes the item at index `i` | that item |\n' +
    '| `a.remove(x)` | removes the **first** item equal to `x` (by value) | `None` |\n' +
    '| `a.sort()` | sorts `a` itself | `None` |\n\n' +
    'Notice the pattern: methods that change the list in place return `None`. That is why `b = a.sort()` leaves `b` as `None`. The function `sorted(a)` is different: it leaves `a` alone and **returns** a new sorted list. Both accept `reverse=True` and `key=...`, for example `sorted(words, key=len)` sorts by length. Python\'s sort is **stable**: items with equal keys keep their original order.\n\n' +
    '### List comprehensions\n\n' +
    'A comprehension builds a list in one line. Read `[x * x for x in range(1, 6) if x % 2 == 1]` as: for each `x` from 1 to 5, if `x` is odd, keep `x * x`. Result: `[1, 9, 25]`. Remember `range(a, b)` stops **before** `b`.\n\n' +
    '### Nested lists (grids and matrices)\n\n' +
    'A list can hold other lists: `grid = [[1, 2, 3], [4, 5, 6]]`. Then `grid[r]` is a whole row and `grid[r][c]` is one item: first choose the row, then the column, both counted from 0. So `grid[1][0]` is 4. `len(grid)` counts rows (2), not numbers (6).\n\n' +
    '### Tuples and unpacking\n\n' +
    'A **tuple** is like a list in round brackets, `t = (1, 2, 3)`, but it is **immutable**: `t[0] = 9` raises a `TypeError`, and tuples have no `append` or `remove`. Indexing, slicing and `len` work exactly as for lists. A one-item tuple needs a comma: `(5,)`. Careful: a tuple holding a list, like `(1, [2, 3])`, cannot swap the list for another object, but the list inside can still be changed with `append`.\n\n' +
    '**Unpacking** splits a sequence into names: `x, y = (3, 4)` sets $x = 3$, $y = 4$. In `a, b = b, a + b` Python works out the **whole right side first** using the old values, then assigns. That is why `a, b = b, a` swaps two values without a temporary variable.\n\n' +
    '### Names, aliasing and copies (the big exam topic)\n\n' +
    'A variable is a **name tag** stuck on an object. `b = a` does **not** copy the list; it sticks a second tag on the **same** list. Any change made through `b` (append, `b[0] = ...`, sort) shows up in `a`. The same happens when you pass a list to a function: the parameter is another tag on the caller\'s list.\n\n' +
    'Reassigning is different: `b = [9]` or `b = b + [9]` builds a new list and moves only the tag `b`. For lists, `b += [9]` changes the list in place, so aliases see it.\n\n' +
    'To get an independent list, copy it:\n\n' +
    '- **Shallow copy**: `a[:]`, `a.copy()` or `list(a)`. The outer list is new, but any inner lists are **shared**.\n' +
    '- **Deep copy**: `copy.deepcopy(a)` (after `import copy`). Every level is copied, so nothing is shared.\n\n' +
    'For a flat list of numbers a shallow copy is enough. For a list of lists, changing `b[0].append(5)` after a shallow copy also changes `a[0]`. The same trap appears in `[[0] * 3] * 2`, which repeats **one** row object twice; build grids with `[[0] * 3 for _ in range(2)]` instead.',
  formulas: [
    { label: 'Valid indices', tex: '0, 1, \\ldots, n - 1 \\quad \\text{and} \\quad -1, -2, \\ldots, -n', note: 'For a list of length $n$. Index $-1$ is the last item.' },
    { label: 'Negative index', tex: 'a[-k] = a[n - k]' },
    { label: 'Length of a slice', tex: '\\text{len}(a[i:j]) = j - i', note: 'When $0 \\le i \\le j \\le n$. The stop index $j$ is excluded.' },
    { label: 'Length of a stepped slice', tex: '\\text{len}(a[i:j:s]) = \\left\\lceil \\frac{j - i}{s} \\right\\rceil', note: 'For a positive step $s$ and $0 \\le i \\le j \\le n$: the indices are $i, i + s, i + 2s, \\ldots$ while they are less than $j$. Round **up**: `a[1:8:3]` takes indices 1, 4, 7, which is $\\lceil 7 \\div 3 \\rceil = 3$ items.' },
    { label: 'Last k items / all but last k', tex: 'a[-k:] \\quad \\text{vs} \\quad a[:-k]' },
    { label: 'Nested list', tex: '\\text{grid}[r][c] = \\text{item in row } r \\text{, column } c' },
    { label: 'Sorting', tex: '\\text{a.sort()} \\to \\text{None (changes a)}, \\quad \\text{sorted(a)} \\to \\text{new list}' },
    { label: 'Aliasing vs copying', tex: '\\text{b = a: same list}, \\quad \\text{b = a[:]: new list}' },
  ],
  examples: [
    {
      title: 'Indexing and slicing',
      problem: 'Given `a = [4, 8, 15, 16, 23, 42]`, what is printed by `print(a[2], a[-2], a[1:4])`?',
      steps: [
        'Write the indices under the values: 4 is at 0, 8 at 1, 15 at 2, 16 at 3, 23 at 4, 42 at 5.',
        '`a[2]` is the item at index 2: 15.',
        '`a[-2]` is the second-to-last item: 23.',
        '`a[1:4]` takes indices 1, 2, 3 (4 is excluded): `[8, 15, 16]`.',
      ],
      answer: '`15 23 [8, 15, 16]`',
    },
    {
      title: 'Tracing list methods',
      problem: 'What is printed?\n\n`a = [3, 1, 4, 1]`, then `a.remove(1)`, `a.insert(0, 9)`, `a.extend([2, 6])`, `x = a.pop(2)`, then `print(a, x)`.',
      steps: [
        '`a.remove(1)` removes the **first** 1: `[3, 4, 1]`.',
        '`a.insert(0, 9)` puts 9 at index 0: `[9, 3, 4, 1]`.',
        '`a.extend([2, 6])` adds 2 and 6 separately: `[9, 3, 4, 1, 2, 6]`.',
        '`a.pop(2)` removes the item at index 2, which is 4, and returns it: `a` is `[9, 3, 1, 2, 6]` and `x` is 4.',
      ],
      answer: '`[9, 3, 1, 2, 6] 4`',
    },
    {
      title: 'Aliasing and sort',
      problem: 'What is printed?\n\n`a = [5, 2, 7]`, `b = a`, `c = sorted(a)`, `b.append(1)`, `d = a.sort()`, then `print(a, c, d)`.',
      steps: [
        '`b = a`: `b` is another name for the same list.',
        '`c = sorted(a)`: a new list `[2, 5, 7]`; `a` is unchanged.',
        '`b.append(1)`: the shared list becomes `[5, 2, 7, 1]`, so `a` changes too. `c` is separate and stays `[2, 5, 7]`.',
        '`d = a.sort()`: sorts the shared list in place to `[1, 2, 5, 7]` and returns `None`, so `d` is `None`.',
      ],
      answer: '`[1, 2, 5, 7] [2, 5, 7] None`',
    },
    {
      title: 'Shallow copy of a nested list (exam level)',
      problem: 'What is printed?\n\n`a = [[1], [2]]`, `b = a[:]`, `b[0].append(3)`, `b[1] = [9]`, then `print(a)`.',
      steps: [
        '`b = a[:]` is a **shallow** copy: `b` is a new outer list, but `b[0]` and `a[0]` are the same inner list (likewise `b[1]` and `a[1]`).',
        '`b[0].append(3)` changes that shared inner list, so `a[0]` becomes `[1, 3]`.',
        '`b[1] = [9]` puts a brand-new list into position 1 of `b` only. It does not change the old inner list, so `a[1]` is still `[2]`.',
        'So `a` is `[[1, 3], [2]]`.',
      ],
      answer: '`[[1, 3], [2]]`',
    },
  ],
  traps: [
    'Counting from 1. The first item is `a[0]`, and `a[-1]` is the last item (not the second-to-last).',
    'Including the stop index in a slice. `a[2:5]` has $5 - 2 = 3$ items: indices 2, 3, 4.',
    'Writing `b = a.sort()` and expecting a sorted list. In-place methods (`sort`, `append`, `insert`, `extend`, `remove`, `reverse`) return `None`; use `sorted(a)` for a new list.',
    'Mixing up `append` and `extend`: `a.append([1, 2])` adds ONE nested item; `a.extend([1, 2])` adds two items.',
    'Thinking `b = a` copies a list. It creates an alias, so changes through either name show in both. Use `a[:]` or `a.copy()` to copy, and `copy.deepcopy` for nested lists.',
    'Building a grid with `[[0] * 3] * 3`: all rows are the same object, so changing one cell changes that column in every row.',
  ],
  examTip:
    'These questions are almost always "what does this code print?" with four printed outputs that differ by **one** misconception each: counting from 1, including the slice stop, append versus extend, `sort()` returning `None`, alias versus copy, or shallow versus deep copy. Work as follows:\n\n' +
    '1. Write the index numbers (0, 1, 2, ...) under the list on your scrap paper before reading any index or slice.\n' +
    '2. Trace one line at a time, writing the list after each line, like a trace table.\n' +
    '3. For every `=` with a list on the right, ask "new list or same list?" Slicing, `copy()`, `list()`, `sorted()`, `+`, list literals like `[1, 2]` and comprehensions make new lists; plain `b = a` and passing a list to a function never copy it.\n' +
    '4. Use quick checks to eliminate options: a slice `a[i:j]` must have $j - i$ items; `len` counts a nested list as one item; an in-place method stored in a variable gives `None`.\n' +
    '5. If one option says "error", check for a tuple being changed, an index past the end, or `remove` of a value that is not there.',
};
