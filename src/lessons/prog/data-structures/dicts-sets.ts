import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'dicts-sets',
  simple:
    'A **map** (also called a dictionary) is like a real dictionary or a phone book: you look a value up by its name (the **key**), not by its position, and each key appears only once. A **set** is a bag of values with no repeats and no order, so it is perfect for asking "have I seen this before?". Both use a trick called **hashing** that jumps straight to the right place, so a lookup is fast however big they get.',
  methods: [
    { cue: 'A sequence of steps that set or remove keys in a map', method: 'Trace step by step. A new key is added; an existing key has its value **overwritten**, not added to. Removing a key deletes its whole pair.' },
    { cue: 'A counting array, `C[A[i]] = C[A[i]] + 1`', method: 'Each value is used as an index into `C`. Make a table with `C` after each pass. The counts must add up to the length of `A`.' },
    { cue: 'Union, intersection or difference of two sets', method: 'Write out what is only in A, in both, and only in B. Union is all three, intersection is the middle, $A \\setminus B$ is only in A (order matters), symmetric difference is the two outer parts. Duplicates vanish.' },
    { cue: 'How many distinct values, or the cardinality of a set', method: 'Count each different value once. Cardinality means the number of elements.' },
    { cue: 'A hash table with $h(k) = k \\bmod m$ and **linear probing**', method: 'Insert keys in order: compute $k \\bmod m$; if that slot is taken, try the next slot, wrapping from $m - 1$ back to 0.' },
    { cue: 'Speed of a lookup, or a **chaining** table with $n$ keys and $m$ buckets', method: 'Set and map lookups are $O(1)$ on average and $O(n)$ if everything collides; a search of an unsorted array is $O(n)$. With chaining, an average search checks about $\\alpha = \\frac{n}{m}$ keys.' },
  ],
  know:
    '### Why maps and sets?\n\n' +
    'An array stores items in numbered positions. To find something in an unsorted array, you may have to look at every item. A **map** lets you look things up by a name (a **key**) instead of a position, and a **set** lets you ask "is this value in here?" very quickly. Both are built on the same idea, the **hash table**.\n\n' +
    '### Maps: keys and values\n\n' +
    'A map stores **key-value pairs**, such as `Sara: 17` and `Omar: 18`. The key `Sara` maps to the value 17.\n\n' +
    '- **Look up:** give the key and get its value.\n' +
    '- **Add or change:** setting a new key adds a pair. Setting a key that already exists **overwrites** its value.\n' +
    '- **Remove:** removing a key deletes its pair.\n' +
    '- **Size:** the number of keys.\n\n' +
    'Keys are **unique**: a map can never contain the same key twice. Values can repeat freely. So if the words cat, ox, cat are stored with their lengths as values, the map holds two keys, `cat: 3` and `ox: 2`.\n\n' +
    '### Counting with an array\n\n' +
    'Counting how often each item appears is the classic use of a map: one key per different item, with its count as the value. When the items are small whole numbers, a 1-based array does the same job, with the value itself as the index:\n\n' +
    '```pseudocode\nA = [2, 1, 3, 1, 2, 1]\nC = [0, 0, 0]\nfor i = 1 to length(A)\n   C[A[i]] = C[A[i]] + 1\nend for\nprint(C)\n```\n\n' +
    'This prints `[3, 2, 1]`: the value 1 appears 3 times, 2 appears twice and 3 once. The counts always add up to the length of `A`.\n\n' +
    '### Sets\n\n' +
    'A set is an unordered collection with **no duplicates**: the values 3, 1, 3 give just $\\{1, 3\\}$. The number of elements is its **cardinality** or size, written $|A|$, so the quickest way to count distinct values is to build a set and take its size.\n\n' +
    'To **remove duplicates but keep the order** of first appearance, keep a record of the values seen so far. A set does this directly; with small whole numbers, an array of 0s and 1s does the same:\n\n' +
    '```pseudocode\nA = [4, 2, 4, 1, 2]\nS = [0, 0, 0, 0]\nfor i = 1 to length(A)\n   if S[A[i]] == 0\n      S[A[i]] = 1\n      print(A[i])\n   end if\nend for\n```\n\n' +
    'This prints 4, 2, 1. Each test takes $O(1)$ on average in a hash-based set, so the whole job takes $O(n)$.\n\n' +
    'Set operations, using $A = \\{1, 2, 3\\}$ and $B = \\{2, 3, 4\\}$:\n\n' +
    '| operation | notation | meaning | result |\n' +
    '|---|---|---|---|\n' +
    '| union | $A \\cup B$ | in A or B (or both) | $\\{1, 2, 3, 4\\}$ |\n' +
    '| intersection | $A \\cap B$ | in both | $\\{2, 3\\}$ |\n' +
    '| difference | $A \\setminus B$ | in A, not in B | $\\{1\\}$ |\n' +
    '| symmetric difference | $(A \\cup B) \\setminus (A \\cap B)$ | in exactly one | $\\{1, 4\\}$ |\n\n' +
    'Difference is **not** symmetric: $B \\setminus A$ is $\\{4\\}$, not $\\{1\\}$.\n\n' +
    '### Hash tables and $O(1)$ lookup\n\n' +
    'Behind the scenes, a **hash function** turns the key into a number that picks a **bucket** (slot) in a table. To find the key later, the table computes the hash again and jumps straight to that bucket. It does not scan everything. So looking up a key, or testing whether a value is in a set, takes **constant time on average**, written $O(1)$. An unsorted array needs $O(n)$.\n\n' +
    'Two keys can land in the same bucket. This is called a **collision**. It can be handled by **chaining** (each bucket holds a small list) or by **linear probing** (move to the next free slot, wrapping round to the start). The average chain length is the **load factor** $\\alpha = \\frac{n}{m}$ (keys divided by buckets). Tables resize to keep $\\alpha$ small, which is why lookups stay $O(1)$ on average. In the rare worst case, when everything collides, a lookup is $O(n)$.',
  formulas: [
    { label: 'Union', tex: 'A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}' },
    { label: 'Intersection', tex: 'A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}' },
    { label: 'Difference (not symmetric)', tex: 'A \\setminus B = \\{x : x \\in A \\text{ and } x \\notin B\\}' },
    { label: 'Symmetric difference', tex: 'A \\,\\triangle\\, B = (A \\cup B) \\setminus (A \\cap B)' },
    { label: 'Size of a union', tex: '|A \\cup B| = |A| + |B| - |A \\cap B|' },
    { label: 'Load factor (average chain length)', tex: '\\alpha = \\frac{n}{m} = \\frac{\\text{number of keys}}{\\text{number of buckets}}' },
    { label: 'Average cost of lookups', tex: '\\text{map or set lookup: } O(1) \\qquad \\text{unsorted array search: } O(n)', note: 'The worst case for a hash table, when all keys collide, is $O(n)$.' },
  ],
  examples: [
    {
      title: 'Updating a map',
      problem: 'A map holds `a: 1` and `b: 2`. Key `b` is set to 5, key `c` is set to 7, and key `a` is removed. What does the map hold?',
      steps: [
        'Start with `a: 1, b: 2`.',
        'Key `b` exists, so its value is overwritten: `a: 1, b: 5`.',
        'Key `c` is new, so a pair is added: `a: 1, b: 5, c: 7`.',
        'Removing `a` deletes its pair.',
      ],
      answer: '`b: 5, c: 7`',
    },
    {
      title: 'Counting with an array',
      problem: 'Arrays are indexed from 1. What does this print?\n\n```pseudocode\nA = [1, 2, 1, 1]\nC = [0, 0]\nfor i = 1 to length(A)\n   C[A[i]] = C[A[i]] + 1\nend for\nprint(C)\n```',
      steps: [
        '$i = 1$: the value is 1, so `C` becomes `[1, 0]`.',
        '$i = 2$: the value is 2, so `C` becomes `[1, 1]`.',
        '$i = 3$: the value is 1, so `C` becomes `[2, 1]`.',
        '$i = 4$: the value is 1, so `C` becomes `[3, 1]`. The counts add up to 4, the length of `A`.',
      ],
      answer: '`[3, 1]`',
    },
    {
      title: 'Set operations',
      problem: 'With $A = \\{2, 4, 6, 8\\}$ and $B = \\{4, 8, 10\\}$, find the sizes of $A \\cap B$, $A \\setminus B$, the symmetric difference, and the union.',
      steps: [
        'In both sets: 4 and 8, so $A \\cap B = \\{4, 8\\}$, size 2.',
        'In A but not in B: 2 and 6, so $A \\setminus B = \\{2, 6\\}$, size 2.',
        'In exactly one set: 2 and 6 (only in A) and 10 (only in B), so the symmetric difference is $\\{2, 6, 10\\}$, size 3.',
        'Union size: $|A \\cup B| = 4 + 3 - 2 = 5$, which is $\\{2, 4, 6, 8, 10\\}$.',
      ],
      answer: 'Sizes 2, 2 and 3; the union has 5 elements.',
    },
    {
      title: 'Linear probing (exam level)',
      problem: 'A hash table has 5 slots (0 to 4) and $h(k) = k \\bmod 5$, with linear probing. Insert 7, 12, 3, 17 in that order. Where does 17 go?',
      steps: [
        '$7 \\bmod 5 = 2$, so 7 goes in slot 2.',
        '$12 \\bmod 5 = 2$. Slot 2 is taken, so try slot 3, which is free. 12 goes in slot 3.',
        '$3 \\bmod 5 = 3$. Slot 3 is taken, so try slot 4, which is free. 3 goes in slot 4.',
        '$17 \\bmod 5 = 2$. Slots 2, 3 and 4 are all taken, so wrap round to slot 0, which is free.',
      ],
      answer: '17 goes in slot 0.',
    },
  ],
  traps: [
    'Expecting a repeated key to make a second entry. Setting an existing key **overwrites** the value, and the last value written wins.',
    'Adding to a value when a key is set again. Setting replaces; it does not accumulate. Only a counting line such as `C[x] = C[x] + 1` adds.',
    'Treating $A \\setminus B$ as the same as $B \\setminus A$, or confusing the symmetric difference (in exactly one set) with the union (in either set).',
    'Counting a shared element twice in a union. Use $|A \\cup B| = |A| + |B| - |A \\cap B|$.',
    'Reading $O(1)$ as "exactly one step". It means the work does not grow with $n$. With chaining, a search may check several keys in a bucket.',
    'Forgetting the wrap-round in linear probing. After the last slot comes slot 0, and there is no slot numbered $m$.',
  ],
  examTip:
    'Most questions are short definitions, a set calculation, a small counting trace, or a hash table insert. **Trace on paper**: write the map, set or array after every step. Then eliminate fast:\n\n' +
    '- A set can **never** contain the same value twice, and a map can never contain the same key twice. Cross out any option that shows one.\n' +
    '- In a counting trace, the counts must add up to the length of the input, and each count must be at least 1 for a value that appears.\n' +
    '- For set sizes, check with $|A \\cup B| = |A| + |B| - |A \\cap B|$.\n' +
    '- For theory questions: map and set lookups are $O(1)$ on average and $O(n)$ in the worst case, an unsorted array search is $O(n)$, and the load factor is keys divided by slots.',
};
