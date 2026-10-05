import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'dicts-sets',
  know:
    '### Why dictionaries and sets?\n\n' +
    'A list stores items in positions 0, 1, 2, and so on. To find something in a list, Python may have to look at every item. A **dictionary** lets you look things up by a name (a **key**) instead of a position, and a **set** lets you ask "is this value in here?" very quickly. Both are built on the same idea, the **hash table**.\n\n' +
    '### Dictionaries: keys and values\n\n' +
    "A dictionary stores **key-value pairs**: `ages = {'Sara': 17, 'Omar': 18}`. The key `'Sara'` maps to the value `17`.\n\n" +
    "Ways to **create** a dictionary:\n\n" +
    "- Curly braces with `key: value` pairs, as above. An empty dictionary is `{}` or `dict()`.\n" +
    "- From pairs: `dict([('a', 1), ('b', 2)])` gives `{'a': 1, 'b': 2}`.\n" +
    "- A **dictionary comprehension**: `{w: len(w) for w in ['ox', 'cat']}` gives `{'ox': 2, 'cat': 3}`. If the same key comes up twice, the later value overwrites the earlier one.\n\n" +
    "- **Read** a value: `ages['Sara']` gives `17`. A missing key, as in `ages['Zed']`, raises a `KeyError`.\n" +
    "- **Safe read**: `ages.get('Zed', 0)` gives `0` (the default) instead of an error. With no default, `get` returns `None`.\n" +
    "- **Add or change**: `ages['Lina'] = 16` adds a new pair at the end. If the key already exists, the old value is **overwritten** and the key keeps its place.\n" +
    "- **Merge**: `ages.update({'Omar': 19, 'Ali': 20})` overwrites `'Omar'` and adds `'Ali'`.\n" +
    "- **Remove**: `del ages['Omar']`, or `ages.pop('Omar')`, which also **returns the value** it removed.\n" +
    '- **Size**: `len(ages)` is the number of keys.\n\n' +
    'Keys are **unique**: a dictionary can never contain the same key twice. Values can repeat freely. Since Python 3.7, dictionaries remember the order in which keys were first inserted. They are **not** sorted.\n\n' +
    '### Looping over a dictionary\n\n' +
    '| code | what you get each time |\n' +
    '|---|---|\n' +
    '| `for k in d:` | each key |\n' +
    '| `for v in d.values():` | each value |\n' +
    '| `for k, v in d.items():` | each (key, value) pair |\n\n' +
    'Also, `x in d` checks the **keys** only. To search the values, write `x in d.values()`.\n\n' +
    '### Counting with a dictionary\n\n' +
    'This is the most common exam pattern:\n\n' +
    '```\ncounts = {}\nfor x in items:\n    counts[x] = counts.get(x, 0) + 1\n```\n\n' +
    'The first time `x` appears, `get` returns 0, so the count becomes 1. Each later time it goes up by 1. In the end there is one key per **different** item, and each value is how many times that item appeared.\n\n' +
    '### Sets\n\n' +
    'A set is an unordered collection with **no duplicates**: `{3, 1, 3}` is just `{1, 3}`. Create an empty set with `set()`, because `{}` makes an empty **dictionary**. Add an item with `s.add(x)`. The quickest way to count distinct values is `len(set(my_list))`. Note that converting to a set loses the original order.\n\n' +
    'To **remove duplicates but keep the order** of first appearance, use a "seen" set:\n\n' +
    '```\nseen = set()\nout = []\nfor x in data:\n    if x not in seen:\n        seen.add(x)\n        out.append(x)\n```\n\n' +
    'For `data = [4, 2, 4, 1, 2]` this gives `out = [4, 2, 1]`. Each `x not in seen` test is $O(1)$ on average, so the whole loop is $O(n)$.\n\n' +
    'Set operations, using A = {1, 2, 3} and B = {2, 3, 4}:\n\n' +
    '| operation | method | meaning | result |\n' +
    '|---|---|---|---|\n' +
    '| union | `A.union(B)` | in A or B (or both) | {1, 2, 3, 4} |\n' +
    '| intersection | `A.intersection(B)` | in both | {2, 3} |\n' +
    '| difference | `A.difference(B)` | in A, not in B | {1} |\n' +
    '| symmetric difference | `A.symmetric_difference(B)` | in exactly one | {1, 4} |\n\n' +
    'In exams you will usually see the short operators instead:\n\n' +
    '- `A | B` is the union (vertical bar).\n' +
    '- `A & B` is the intersection.\n' +
    '- `A - B` is the difference. It is **not** symmetric: `B - A` is {4}, not {1}.\n' +
    '- `A ^ B` is the symmetric difference.\n\n' +
    '### Hash tables and $O(1)$ lookup\n\n' +
    'Behind the scenes, Python computes `hash(key)`, a number that picks a **bucket** (slot) in a table. To find the key later, it computes the hash again and jumps straight to that bucket. It does not scan everything. So looking up a key, or testing `x in s`, takes **constant time on average**, written $O(1)$. A list needs $O(n)$.\n\n' +
    'Two keys can land in the same bucket. This is called a **collision**. It can be handled by **chaining** (each bucket holds a small list) or by **linear probing** (move to the next free slot, wrapping round to the start). The average chain length is the **load factor** $\\alpha = \\frac{n}{m}$ (keys divided by buckets). Tables resize to keep $\\alpha$ small, which is why lookups stay $O(1)$ on average. In the rare worst case, when everything collides, a lookup is $O(n)$.\n\n' +
    '### Hashable keys\n\n' +
    'A key\'s hash must never change, so keys and set elements must be **hashable**, which in practice means **immutable**. Numbers, strings, booleans and tuples of these are fine. Lists, sets and dictionaries are not. Using one raises `TypeError: unhashable type`. A tricky detail: `1`, `True` and `1.0` are equal and have the same hash, so they count as the **same key**.',
  formulas: [
    { label: 'Safe lookup with a default', tex: '\\texttt{d.get(k, default)} = \\begin{cases} \\texttt{d[k]} & \\text{if } k \\text{ is a key} \\\\ \\texttt{default} & \\text{otherwise (None if not given)} \\end{cases}' },
    { label: 'Counting pattern', tex: '\\texttt{counts[x] = counts.get(x, 0) + 1}', note: 'One key per distinct item; the value is how many times it occurs.' },
    { label: 'Union (bar operator)', tex: 'A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}', note: 'Python: `A | B`' },
    { label: 'Intersection', tex: 'A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}', note: 'Python: `A & B`' },
    { label: 'Difference (not symmetric)', tex: 'A \\setminus B = \\{x : x \\in A \\text{ and } x \\notin B\\}', note: 'Python: `A - B`' },
    { label: 'Symmetric difference', tex: 'A \\,\\triangle\\, B = (A \\cup B) \\setminus (A \\cap B)', note: 'Python: `A ^ B`' },
    { label: 'Size of a union', tex: '|A \\cup B| = |A| + |B| - |A \\cap B|' },
    { label: 'Load factor (average chain length)', tex: '\\alpha = \\frac{n}{m} = \\frac{\\text{number of keys}}{\\text{number of buckets}}' },
    { label: 'Average cost of lookups', tex: '\\text{dict/set lookup: } O(1) \\qquad \\text{list search: } O(n)', note: 'The worst case for a hash table, when all keys collide, is $O(n)$.' },
  ],
  examples: [
    {
      title: 'Updating a dictionary',
      problem: "What is `d` after these lines?\n\n```\nd = {'a': 1, 'b': 2}\nd['b'] = 5\nd['c'] = d.get('a', 0) + d.get('z', 10)\n```",
      steps: [
        "Start with `{'a': 1, 'b': 2}`.",
        "`d['b'] = 5`: the key `'b'` exists, so its value is overwritten: `{'a': 1, 'b': 5}`.",
        "`d.get('a', 0)` is 1, because `'a'` exists. `d.get('z', 10)` is 10, because `'z'` is missing, so the default is used.",
        "`d['c'] = 1 + 10 = 11` adds a new key at the end: `{'a': 1, 'b': 5, 'c': 11}`.",
      ],
      answer: "`{'a': 1, 'b': 5, 'c': 11}`",
    },
    {
      title: 'Counting letters',
      problem: "What does `counts` hold after counting the letters of `'level'` with `counts[ch] = counts.get(ch, 0) + 1`?",
      steps: [
        "`l`: new, count 1, giving `{'l': 1}`.",
        "`e`: new, count 1, giving `{'l': 1, 'e': 1}`.",
        "`v`: new, count 1, giving `{'l': 1, 'e': 1, 'v': 1}`.",
        "`e`: seen before, count becomes 2.",
        "`l`: seen before, count becomes 2.",
        'Keys stay in first-seen order (l, e, v); they are not sorted.',
      ],
      answer: "`{'l': 2, 'e': 2, 'v': 1}`",
    },
    {
      title: 'Set operations',
      problem: 'With `A = {2, 4, 6, 8}` and `B = {4, 8, 10}`, find the sizes of `A & B`, `A - B` and `A ^ B`, and the size of the union.',
      steps: [
        'In both sets: 4 and 8, so `A & B` = {4, 8}, size 2.',
        'In A but not in B: 2 and 6, so `A - B` = {2, 6}, size 2.',
        'In exactly one set: 2 and 6 (only in A) and 10 (only in B), so `A ^ B` = {2, 6, 10}, size 3.',
        'Union size: $|A \\cup B| = 4 + 3 - 2 = 5$, which is {2, 4, 6, 8, 10}.',
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
    "Thinking `x in d` searches the values. It checks the **keys** only; use `x in d.values()` for values.",
    "Mixing up `d[k]` and `d.get(k)`: square brackets raise a `KeyError` for a missing key, while `get` returns the default (or `None`). Also, `get` returns a stored value of 0 as it is. It only uses the default when the key is missing.",
    'Expecting a repeated key to make a second entry. Assigning to an existing key (or using `update`) **overwrites** the value. The key keeps its original position, and the last value written wins.',
    'Writing `{}` for an empty set. That is an empty **dictionary**; an empty set is `set()`.',
    'Treating `A - B` as the same as `B - A`, or confusing `^` (in exactly one set) with `|` (in either set).',
    'Using a list as a dictionary key or set element. Lists are mutable, so they are unhashable and raise a `TypeError`. Use a tuple instead.',
  ],
  examTip:
    'Most questions show a short snippet and ask what it prints. **Trace it in a small table**: write the dictionary or set after every line. Then eliminate fast:\n\n' +
    '- A set can **never** contain the same value twice, and a dictionary can never contain the same key twice. Cross out any option that shows one.\n' +
    '- Dictionaries print in **insertion order**, not sorted order. A sorted-looking option is often a trap, unless the code calls `sorted`.\n' +
    '- In counting code, the values must add up to the length of the input list, and the number of keys equals the number of distinct items.\n' +
    '- For set sizes, check with $|A \\cup B| = |A| + |B| - |A \\cap B|$.\n' +
    '- For theory questions: dict and set lookups are $O(1)$ on average, list search is $O(n)$, and "unhashable" means a list, set or dict was used as a key.',
};
