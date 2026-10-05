import type { StaticQuestion } from '../../../types';
import { mod } from '../../../lib/mathx';

/** Linear-probing insert into a table of size m with h(k) = k mod m. Returns the slot of every key. */
function linearProbe(keys: number[], m: number): number[] {
  const table: (number | null)[] = new Array(m).fill(null);
  const slots: number[] = [];
  for (const k of keys) {
    let s = mod(k, m);
    while (table[s] !== null) s = (s + 1) % m;
    table[s] = k;
    slots.push(s);
  }
  return slots;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'dicts-sets-001',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `d = {'a': 1, 'b': 2}
d['c'] = 3
d['a'] = 10
print(d)`,
    },
    options: [
      "`{'b': 2, 'c': 3, 'a': 10}`",
      "`{'a': 10, 'b': 2, 'c': 3}`",
      "`{'a': 1, 'b': 2, 'c': 3, 'a': 10}`",
      "`{'a': 1, 'b': 2, 'c': 3}`",
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Go line by line.\n\n' +
        "1. `d = {'a': 1, 'b': 2}` creates a dictionary with two key-value pairs.\n" +
        "2. `d['c'] = 3`: the key `'c'` is **new**, so a new pair is added at the end: `{'a': 1, 'b': 2, 'c': 3}`.\n" +
        "3. `d['a'] = 10`: the key `'a'` **already exists**, so its value is replaced. The key keeps its original position: `{'a': 10, 'b': 2, 'c': 3}`.\n\n" +
        "Output: `{'a': 10, 'b': 2, 'c': 3}`.",
      whyWrong: [
        'This assumes that updating an existing key moves it to the end. Changing the value of a key that is already there keeps it in its original position; only brand-new keys are added at the end.',
        null,
        'A dictionary can never hold the same key twice. Assigning to an existing key replaces its old value instead of adding a second entry.',
        'This assumes an existing key cannot be changed. `d[key] = value` overwrites the old value when the key is already present.',
      ],
      keyIdea: '`d[key] = value` adds a new pair if the key is new, and overwrites the value (keeping the position) if the key already exists.',
    },
    python: { stdout: "{'a': 10, 'b': 2, 'c': 3}\n" },
  },
  {
    id: 'dicts-sets-002',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `stock = {'apple': 5, 'pear': 0}
print(stock.get('pear', 10), stock.get('kiwi', 10), stock.get('kiwi'))`,
    },
    options: ['`10 10 None`', '`0 10 0`', 'A `KeyError` is raised', '`0 10 None`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '`d.get(key, default)` returns the value stored for `key` if the key exists, otherwise it returns `default`. If no default is given, the default is `None`. It **never** raises an error.\n\n' +
        "1. `stock.get('pear', 10)`: `'pear'` exists, its value is `0`, so it returns `0` (the default is ignored).\n" +
        "2. `stock.get('kiwi', 10)`: `'kiwi'` is missing, so it returns the default `10`.\n" +
        "3. `stock.get('kiwi')`: `'kiwi'` is missing and no default was given, so it returns `None`.\n\n" +
        'Output: `0 10 None`.',
      whyWrong: [
        "This treats a stored value of `0` as if the key were missing. `get` only uses the default when the **key** is absent; `'pear'` is present, so its real value `0` is returned.",
        'When no default is passed, `get` returns `None`, not `0`.',
        "Only square brackets, as in `stock['kiwi']`, raise a `KeyError` for a missing key. `get` is the safe version that returns a default instead.",
        null,
      ],
      keyIdea: '`d.get(k, default)` returns the stored value if the key exists (even if it is 0), otherwise the default, which is `None` when not given.',
    },
    python: { stdout: '0 10 None\n' },
  },
  {
    id: 'dicts-sets-003',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'Which of the following **cannot** be used as a key in a Python dictionary?',
    options: ['`(1, 2)`', "`'name'`", '`[1, 2]`', '`3.5`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Dictionary keys (and set elements) must be **hashable**. In practice this means the object must be immutable, so that its hash value can never change while it is stored.\n\n' +
        '- `(1, 2)` is a tuple of numbers: immutable, so hashable. Allowed.\n' +
        "- `'name'` is a string: immutable, so hashable. Allowed.\n" +
        '- `[1, 2]` is a **list**: lists are mutable (you can append, change items), so they are not hashable. Using it as a key raises `TypeError: unhashable type: \'list\'`.\n' +
        '- `3.5` is a float: immutable, so hashable. Allowed.\n\n' +
        'So the list `[1, 2]` cannot be a key.',
      whyWrong: [
        'A tuple is immutable, so a tuple containing only immutable items (here two integers) is hashable and is a perfectly valid key.',
        'Strings are immutable and hashable; they are the most common type of dictionary key.',
        null,
        'Floats are immutable numbers and are hashable, so `3.5` is a valid key (even if floats are an unusual choice of key).',
      ],
      keyIdea: 'Dictionary keys must be hashable (immutable), so lists, sets and dictionaries cannot be keys, but numbers, strings and tuples can.',
    },
  },
  {
    id: 'dicts-sets-004',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `nums = [3, 1, 3, 2, 1, 3]
print(len(set(nums)))`,
    },
    options: ['`6`', '`3`', '`2`', '`1`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A set keeps only **one copy** of each value, so `set(nums)` removes the duplicates.\n\n' +
        '- The list has 6 items: `3, 1, 3, 2, 1, 3`.\n' +
        '- The different values are `1`, `2` and `3`.\n' +
        '- So `set(nums)` is `{1, 2, 3}` and `len(set(nums))` is `3`.\n\n' +
        'Output: `3`.',
      whyWrong: [
        'This is the length of the original list. Converting to a set removes the repeated values, so it is shorter.',
        null,
        'This counts only the values that appear more than once (`3` and `1`). The set keeps every distinct value, including `2`, which appears once.',
        'This counts only the values that appear exactly once (just `2`). A set keeps one copy of **every** value, not just the unique-appearing ones.',
      ],
      keyIdea: '`len(set(xs))` counts the number of distinct values in `xs`, because a set stores each value only once.',
    },
    check: {
      optionValues: [6, 3, 2, 1],
      compute: () => new Set([3, 1, 3, 2, 1, 3]).size,
    },
    python: { stdout: '3\n' },
  },
  {
    id: 'dicts-sets-005',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'A Python **set** `s` contains $n$ numbers. On average, how long does the test `x in s` take as $n$ grows?',
    options: ['$O(n)$', '$O(\\log n)$', '$O(1)$', '$O(n^2)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A set (like a dictionary) is built on a **hash table**.\n\n' +
        '1. To test `x in s`, Python computes `hash(x)`, which tells it which slot (bucket) of the table to look in.\n' +
        '2. It jumps straight to that slot and compares only the few items stored there.\n' +
        '3. This amount of work does not depend on how many items are in the set, so on average it is constant time, $O(1)$.\n\n' +
        'Compare with a list: `x in my_list` checks the items one by one, which is $O(n)$.',
      whyWrong: [
        'This is the cost of `x in some_list`, where every item may have to be checked. A set uses hashing to jump directly to the right place.',
        'This is the cost of binary search on a **sorted** list. A set does not search by halving; it uses a hash to go straight to the right bucket.',
        null,
        'No membership test needs quadratic time. That would mean comparing every item with every other item, which a single lookup never does.',
      ],
      keyIdea: 'Sets and dictionaries are hash tables, so membership tests and key lookups take $O(1)$ time on average, compared with $O(n)$ for a list.',
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'dicts-sets-006',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `text = "banana"
counts = {}
for ch in text:
    counts[ch] = counts.get(ch, 0) + 1
print(counts)`,
    },
    options: [
      "`{'b': 1, 'a': 3, 'n': 2}`",
      "`{'a': 3, 'b': 1, 'n': 2}`",
      "`{'b': 1, 'a': 1, 'n': 1}`",
      "`{'b': 0, 'a': 2, 'n': 1}`",
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        '`counts.get(ch, 0)` gives the current count of `ch`, or `0` if `ch` has not been seen yet. Adding 1 and storing it back increases the count by one.\n\n' +
        '| step | `ch` | `counts` after the step |\n' +
        '|---|---|---|\n' +
        "| 1 | `b` | `{'b': 1}` |\n" +
        "| 2 | `a` | `{'b': 1, 'a': 1}` |\n" +
        "| 3 | `n` | `{'b': 1, 'a': 1, 'n': 1}` |\n" +
        "| 4 | `a` | `{'b': 1, 'a': 2, 'n': 1}` |\n" +
        "| 5 | `n` | `{'b': 1, 'a': 2, 'n': 2}` |\n" +
        "| 6 | `a` | `{'b': 1, 'a': 3, 'n': 2}` |\n\n" +
        'Keys stay in the order they were **first inserted** (b, then a, then n).\n\n' +
        "Output: `{'b': 1, 'a': 3, 'n': 2}`.",
      whyWrong: [
        null,
        'The counts are right, but dictionaries do not sort their keys. They remember insertion order, and `b` was inserted first.',
        'This assumes the count is reset to 1 every time. `counts.get(ch, 0)` returns the count so far, so repeated letters keep going up.',
        'This is off by one: it behaves as if the first time a letter is seen it is stored as 0. In fact `get` returns 0 and then 1 is added, so the first sighting stores 1.',
      ],
      keyIdea: 'The pattern `counts[x] = counts.get(x, 0) + 1` counts how often each item occurs, and the dictionary keeps keys in first-insertion order.',
    },
    python: { stdout: "{'b': 1, 'a': 3, 'n': 2}\n" },
  },
  {
    id: 'dicts-sets-007',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `A = {1, 2, 3, 4}
B = {3, 4, 5}
print(len(A | B), len(A & B), len(A - B), len(B - A))`,
    },
    options: ['`7 2 2 1`', '`5 2 2 2`', '`5 2 1 2`', '`5 2 2 1`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Work out each set, then count its elements.\n\n' +
        '- `A | B` (union, in A **or** B): `{1, 2, 3, 4, 5}`, size 5. The shared values 3 and 4 are counted once.\n' +
        '- `A & B` (intersection, in **both**): `{3, 4}`, size 2.\n' +
        '- `A - B` (difference, in A but **not** in B): `{1, 2}`, size 2.\n' +
        '- `B - A` (in B but not in A): `{5}`, size 1.\n\n' +
        'Check: $|A \\cup B| = |A| + |B| - |A \\cap B| = 4 + 3 - 2 = 5$.\n\n' +
        'Output: `5 2 2 1`.',
      whyWrong: [
        'This adds the sizes $4 + 3 = 7$ for the union, counting the shared values 3 and 4 twice. A set never contains duplicates.',
        'This assumes `A - B` and `B - A` are the same. Set difference is not symmetric: `B - A` keeps only what is in B and not in A, which is just `{5}`.',
        'This swaps the two differences. `A - B` means "start with A and remove anything in B", giving `{1, 2}`.',
        null,
      ],
      keyIdea: '`|` is union, `&` is intersection, `-` is difference (not symmetric), and $|A \\cup B| = |A| + |B| - |A \\cap B|$.',
    },
    check: {
      optionValues: ['7 2 2 1', '5 2 2 2', '5 2 1 2', '5 2 2 1'],
      compute: () => {
        const A = new Set([1, 2, 3, 4]);
        const B = new Set([3, 4, 5]);
        const union = new Set([...A, ...B]).size;
        const inter = [...A].filter((x) => B.has(x)).length;
        const aMinusB = [...A].filter((x) => !B.has(x)).length;
        const bMinusA = [...B].filter((x) => !A.has(x)).length;
        return `${union} ${inter} ${aMinusB} ${bMinusA}`;
      },
    },
    python: { stdout: '5 2 2 1\n' },
  },
  {
    id: 'dicts-sets-008',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `scores = {'Ali': 72, 'Bea': 85, 'Cy': 64, 'Dee': 91}
total = 0
for name, s in scores.items():
    if s > 70:
        total += s
print(total)`,
    },
    options: ['`312`', '`248`', '`3`', 'A `ValueError` is raised'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`scores.items()` gives each (key, value) pair, which the loop unpacks into `name` and `s`.\n\n' +
        '| `name` | `s` | `s > 70`? | `total` |\n' +
        '|---|---|---|---|\n' +
        '| Ali | 72 | yes | 72 |\n' +
        '| Bea | 85 | yes | 157 |\n' +
        '| Cy | 64 | no | 157 |\n' +
        '| Dee | 91 | yes | 248 |\n\n' +
        'Output: `248`.',
      whyWrong: [
        'This adds all four scores ($72 + 85 + 64 + 91 = 312$) and ignores the `if s > 70` condition, which skips Cy.',
        null,
        'This counts how many students passed the condition instead of adding up their scores. The code does `total += s`, not `total += 1`.',
        '`.items()` produces pairs, so unpacking into two variables works. A `ValueError` would only happen when looping over the dictionary itself (which gives keys only) and trying to unpack each key into two names.',
      ],
      keyIdea: '`for k, v in d.items():` loops over key-value pairs; looping over `d` alone gives only the keys.',
    },
    check: {
      optionValues: [312, 248, 3, null],
      compute: () => {
        const scores: [string, number][] = [['Ali', 72], ['Bea', 85], ['Cy', 64], ['Dee', 91]];
        return scores.filter(([, s]) => s > 70).reduce((t, [, s]) => t + s, 0);
      },
    },
    python: { stdout: '248\n' },
  },
  {
    id: 'dicts-sets-009',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `d = {'x': 1, 'y': 2, 3: 'z'}
print('x' in d, 2 in d, 3 in d, 'z' in d.values())`,
    },
    options: ['`True True True True`', '`False True False True`', '`True False True True`', '`True False False True`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'For a dictionary, `in` checks the **keys** only. The keys here are `\'x\'`, `\'y\'` and `3`.\n\n' +
        "1. `'x' in d`: `'x'` is a key, so `True`.\n" +
        '2. `2 in d`: `2` is a **value** (of `\'y\'`), not a key, so `False`.\n' +
        '3. `3 in d`: the integer `3` is a key, so `True`.\n' +
        "4. `'z' in d.values()`: this explicitly searches the values, and `'z'` is a value, so `True`.\n\n" +
        'Output: `True False True True`.',
      whyWrong: [
        'This assumes `in` looks at both keys and values. On a dictionary, `in` only checks keys, so `2 in d` is `False`.',
        'This assumes `in` checks values. It is the other way round: `in d` checks keys, and you must write `in d.values()` to search the values.',
        null,
        'Keys can be of any hashable type and can be mixed, so the integer `3` really is a key, and `3 in d` is `True`.',
      ],
      keyIdea: '`k in d` tests the keys of a dictionary (fast, $O(1)$ on average); use `v in d.values()` to search the values.',
    },
    python: { stdout: 'True False True True\n' },
  },
  {
    id: 'dicts-sets-010',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem:
      'A hash table has 7 slots, numbered 0 to 6. The hash function is $h(k) = k \\bmod 7$. Collisions are resolved by **linear probing**: if the slot is taken, try the next slot, wrapping round from slot 6 to slot 0.\n\n' +
      'The keys 10, 17, 24, 5, 12 are inserted in that order into the empty table. In which slot does 12 end up?',
    options: ['Slot 5', 'Slot 7', 'Slot 6', 'Slot 0'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Insert each key in turn.\n\n' +
        '| key | $k \\bmod 7$ | slots tried | final slot |\n' +
        '|---|---|---|---|\n' +
        '| 10 | 3 | 3 | 3 |\n' +
        '| 17 | 3 | 3 (taken), 4 | 4 |\n' +
        '| 24 | 3 | 3, 4 (taken), 5 | 5 |\n' +
        '| 5 | 5 | 5 (taken), 6 | 6 |\n' +
        '| 12 | 5 | 5, 6 (taken), 0 | 0 |\n\n' +
        'For 12: $12 \\bmod 7 = 5$. Slot 5 holds 24 and slot 6 holds 5, so we wrap round to slot 0, which is free.\n\n' +
        'Answer: slot 0.',
      whyWrong: [
        'This is just $h(12) = 12 \\bmod 7 = 5$, ignoring the collision. Slot 5 is already occupied by 24, so 12 must probe onwards.',
        'There is no slot 7: the slots are numbered 0 to 6. After slot 6 the probe wraps round to slot 0.',
        'This forgets that key 5 was already placed in slot 6 (it collided with 24 in slot 5), so slot 6 is not free either.',
        null,
      ],
      keyIdea: 'With linear probing, a colliding key moves to the next free slot, wrapping round to the start of the table.',
    },
    check: {
      optionValues: [5, 7, 6, 0],
      compute: () => linearProbe([10, 17, 24, 5, 12], 7)[4],
    },
  },
  {
    id: 'dicts-sets-011',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `words = ['cat', 'horse', 'ox', 'cat', 'emu']
lengths = {w: len(w) for w in words}
print(len(lengths), sum(lengths.values()))`,
    },
    options: ['`5 16`', '`4 10`', '`4 16`', '`4 13`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The dictionary comprehension builds `{word: length}` for each word.\n\n' +
        "1. `'cat'` gives `'cat': 3`, `'horse'` gives `'horse': 5`, `'ox'` gives `'ox': 2`.\n" +
        "2. The second `'cat'` sets `'cat': 3` again. The key already exists, so it is simply overwritten with the same value; no new entry is made.\n" +
        "3. `'emu'` gives `'emu': 3`.\n\n" +
        "So `lengths = {'cat': 3, 'horse': 5, 'ox': 2, 'emu': 3}`.\n\n" +
        '- `len(lengths)` = 4 keys.\n' +
        '- `sum(lengths.values())` = $3 + 5 + 2 + 3 = 13$.\n\n' +
        'Output: `4 13`.',
      whyWrong: [
        "This counts the repeated `'cat'` as a separate entry. Keys are unique, so the second `'cat'` only overwrites the first.",
        "This removes the duplicate **values** as well, adding only $3 + 5 + 2$. Values can repeat freely: `'cat'` and `'emu'` both have value 3.",
        "This assumes the second `'cat'` adds 3 onto the existing value (giving 6). Assignment replaces the value; it does not accumulate.",
        null,
      ],
      keyIdea: 'Keys in a dictionary are unique (a repeated key overwrites), but values can repeat.',
    },
    check: {
      optionValues: ['5 16', '4 10', '4 16', '4 13'],
      compute: () => {
        const m = new Map<string, number>();
        for (const w of ['cat', 'horse', 'ox', 'cat', 'emu']) m.set(w, w.length);
        return `${m.size} ${[...m.values()].reduce((a, b) => a + b, 0)}`;
      },
    },
    python: { stdout: '4 13\n' },
  },
  {
    id: 'dicts-sets-012',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `data = [4, 2, 4, 1, 2, 5]
seen = set()
out = []
for x in data:
    if x not in seen:
        seen.add(x)
        out.append(x)
print(out)`,
    },
    options: ['`[1, 2, 4, 5]`', '`[4, 2, 1, 5]`', '`[1, 5]`', '`[4, 1, 2, 5]`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'The set `seen` remembers which values have already appeared; `out` collects each value the **first** time it is met.\n\n' +
        '| `x` | in `seen`? | `out` |\n' +
        '|---|---|---|\n' +
        '| 4 | no, add | `[4]` |\n' +
        '| 2 | no, add | `[4, 2]` |\n' +
        '| 4 | yes, skip | `[4, 2]` |\n' +
        '| 1 | no, add | `[4, 2, 1]` |\n' +
        '| 2 | yes, skip | `[4, 2, 1]` |\n' +
        '| 5 | no, add | `[4, 2, 1, 5]` |\n\n' +
        'Output: `[4, 2, 1, 5]`.',
      whyWrong: [
        'This is the sorted list of distinct values. The code never sorts: `out` is a list, and values are appended in the order they first appear.',
        null,
        'This keeps only the values that appear exactly once. The code keeps every value, just once each, so 4 and 2 are included on their first appearance.',
        'This keeps the **last** occurrence of each value. The code appends a value the first time it is seen and skips it afterwards.',
      ],
      keyIdea: 'Using a set of "seen" values removes duplicates from a list while keeping the order of first appearance, with $O(1)$ membership checks.',
    },
    python: { stdout: '[4, 2, 1, 5]\n' },
  },
  {
    id: 'dicts-sets-013',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `inv = {'pen': 3, 'ink': 2}
inv.update({'ink': 5, 'pad': 1})
inv['pen'] = inv['pen'] - 1
removed = inv.pop('pad')
print(inv, removed)`,
    },
    options: [
      "`{'pen': 2, 'ink': 7} 1`",
      "`{'pen': 2, 'ink': 5} 1`",
      "`{'pen': 2, 'ink': 2} 1`",
      "`{'pen': 2, 'ink': 5} pad`",
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        "1. Start: `{'pen': 3, 'ink': 2}`.\n" +
        "2. `update({'ink': 5, 'pad': 1})` copies each pair in: `'ink'` already exists, so its value is **replaced** by 5; `'pad'` is new, so it is added. Now `{'pen': 3, 'ink': 5, 'pad': 1}`.\n" +
        "3. `inv['pen'] = inv['pen'] - 1` sets `'pen'` to $3 - 1 = 2$: `{'pen': 2, 'ink': 5, 'pad': 1}`.\n" +
        "4. `inv.pop('pad')` removes the key `'pad'` and **returns its value**, 1. Now `{'pen': 2, 'ink': 5}` and `removed = 1`.\n\n" +
        "Output: `{'pen': 2, 'ink': 5} 1`.",
      whyWrong: [
        "This adds the values together ($2 + 5 = 7$). `update` overwrites the value of an existing key; it does not add to it.",
        null,
        "This assumes `update` leaves existing keys alone and only adds new ones. In fact `update` overwrites existing keys too.",
        '`pop(key)` returns the **value** that was stored under the key, not the key itself.',
      ],
      keyIdea: '`d.update(other)` overwrites existing keys and adds new ones; `d.pop(k)` removes key `k` and returns its value.',
    },
    python: { stdout: "{'pen': 2, 'ink': 5} 1\n" },
  },
  {
    id: 'dicts-sets-014',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `a = set('hello')
b = set('world')
print(sorted(a & b), sorted(a ^ b))`,
    },
    options: [
      "`['l', 'o'] ['d', 'e', 'h', 'r', 'w']`",
      "`['l', 'l', 'o'] ['d', 'e', 'h', 'r', 'w']`",
      "`['l', 'o'] ['d', 'e', 'h', 'l', 'o', 'r', 'w']`",
      "`['l', 'o'] ['e', 'h']`",
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        "1. `set('hello')` takes the letters h, e, l, l, o and keeps one of each: `a` = {h, e, l, o}.\n" +
        "2. `set('world')` gives `b` = {w, o, r, l, d}.\n" +
        '3. `a & b` (intersection: in both) = {l, o}. Sorted: `[\'l\', \'o\']`.\n' +
        '4. `a ^ b` (symmetric difference: in exactly one of the two) = {h, e} together with {w, r, d} = {h, e, w, r, d}. Sorted alphabetically: `[\'d\', \'e\', \'h\', \'r\', \'w\']`.\n\n' +
        "Output: `['l', 'o'] ['d', 'e', 'h', 'r', 'w']`.",
      whyWrong: [
        null,
        "A set holds each letter once, so the double l in 'hello' becomes a single `'l'`. The intersection can contain `'l'` only once.",
        'This is the union `a | b` (everything in either set). The symmetric difference `^` leaves out the letters in **both** sets, l and o.',
        'This is the difference `a - b` (letters in a but not in b). The symmetric difference also includes the letters only in b: w, r and d.',
      ],
      keyIdea: '`a ^ b` (symmetric difference) is everything in exactly one of the two sets, which equals `(a | b) - (a & b)`.',
    },
    python: { stdout: "['l', 'o'] ['d', 'e', 'h', 'r', 'w']\n" },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'dicts-sets-015',
    subtopic: 'dicts-sets',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `d = {1: 'a', True: 'b', 1.0: 'c', '1': 'd'}
print(len(d), d[1])`,
    },
    options: ['`4 a`', '`2 a`', '`1 c`', '`2 c`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Two keys count as the **same key** if they are equal (`==`) and have the same hash.\n\n' +
        '- In Python, `1 == True` and `1 == 1.0` are both `True`, and `hash(1) == hash(True) == hash(1.0)`. So `1`, `True` and `1.0` are all the same key.\n' +
        "- `'1'` is a **string**, and `'1' == 1` is `False`, so it is a different key.\n\n" +
        'Building the dictionary from left to right:\n\n' +
        "1. `1: 'a'` creates key `1` with value `'a'`.\n" +
        "2. `True: 'b'` is the same key, so the value becomes `'b'` (the key stays written as `1`).\n" +
        "3. `1.0: 'c'` is again the same key, so the value becomes `'c'`.\n" +
        "4. `'1': 'd'` is a new key.\n\n" +
        "So `d = {1: 'c', '1': 'd'}`: `len(d)` is 2 and `d[1]` is `c` (print shows a string without quotes).\n\n" +
        'Output: `2 c`.',
      whyWrong: [
        'This treats `1`, `True` and `1.0` as different keys. They are equal and hash the same, so they collapse into one key.',
        'The count is right, but a repeated key keeps the **last** value assigned, not the first. The value is overwritten to `\'b\'` and then to `\'c\'`.',
        "This also merges the string `'1'` with the number 1. A string is never equal to a number in Python, so `'1'` is a separate key.",
        null,
      ],
      keyIdea: 'Dictionary keys are matched by equality and hash, so `1`, `True` and `1.0` are one key (last value wins), while the string `\'1\'` is different.',
    },
    python: { stdout: '2 c\n' },
  },
  {
    id: 'dicts-sets-016',
    subtopic: 'dicts-sets',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `pairs = [('a', 3), ('b', 6), ('a', 4), ('c', 5), ('b', 2)]
groups = {}
for k, v in pairs:
    if k not in groups:
        groups[k] = []
    groups[k].append(v)
best = max(groups, key=lambda k: sum(groups[k]))
print(best, groups[best])`,
    },
    options: ['`c [5]`', '`b [2, 6]`', '`b [6, 2]`', '`b 8`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: build the groups.** Each key gets a list of its values, in the order they appear.\n\n' +
        '| pair | `groups` after |\n' +
        '|---|---|\n' +
        "| ('a', 3) | `{'a': [3]}` |\n" +
        "| ('b', 6) | `{'a': [3], 'b': [6]}` |\n" +
        "| ('a', 4) | `{'a': [3, 4], 'b': [6]}` |\n" +
        "| ('c', 5) | `{'a': [3, 4], 'b': [6], 'c': [5]}` |\n" +
        "| ('b', 2) | `{'a': [3, 4], 'b': [6, 2], 'c': [5]}` |\n\n" +
        '**Step 2: pick the best key.** Looping over a dictionary gives its keys. `max` compares them using `key=lambda k: sum(groups[k])`:\n\n' +
        '- `a`: $3 + 4 = 7$\n' +
        '- `b`: $6 + 2 = 8$\n' +
        '- `c`: $5$\n\n' +
        'The largest sum is 8, so `best` is `b`.\n\n' +
        '**Step 3:** print `best` and its list, which is still in insertion order.\n\n' +
        'Output: `b [6, 2]`.',
      whyWrong: [
        "This is `max(groups)` without the `key=` function: it compares the keys themselves alphabetically, and `'c'` is the largest letter. The `key` function makes `max` compare the group sums instead.",
        'The key is right, but the list is not sorted. `append` adds values in the order they appear, so b\'s list is `[6, 2]`.',
        null,
        '`groups[best]` is the list of values, not its sum. The sum is only used inside `max` to choose the key.',
      ],
      keyIdea: 'Grouping into a dictionary of lists keeps values in arrival order, and `max(d, key=f)` returns the **key** with the largest `f(key)`.',
    },
    python: { stdout: 'b [6, 2]\n' },
  },
  {
    id: 'dicts-sets-017',
    subtopic: 'dicts-sets',
    difficulty: 'challenge',
    stem: 'What happens when this Python code runs?',
    code: {
      lang: 'python',
      source: `seen = set()
points = [(1, 2), (2, 1), (1, 2)]
for p in points:
    seen.add(p)
seen.add([3, 4])
print(len(seen))`,
    },
    options: ['It prints `3`', 'It prints `4`', 'A `TypeError` is raised', 'It prints `2`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. The loop adds three tuples. Tuples are immutable and hashable, so they can go in a set. `(1, 2)` appears twice but is stored once, so `seen = {(1, 2), (2, 1)}`.\n' +
        '2. `seen.add([3, 4])` tries to add a **list**. Lists are mutable, so they are not hashable, and set elements must be hashable.\n' +
        "3. Python raises `TypeError: unhashable type: 'list'` at this line, so the `print` is never reached.\n\n" +
        'Answer: a `TypeError` is raised.',
      whyWrong: [
        'This assumes the list can be stored like the tuples (two distinct tuples plus the list). Lists are unhashable, so `add` fails before anything is printed.',
        'This keeps the duplicate tuple `(1, 2)` and also assumes the list can be added. Sets remove duplicates, and lists cannot be added at all.',
        null,
        'This is the size of the set before the bad line, as if Python quietly ignored the list. Python does not skip it; it raises an error, so nothing is printed.',
      ],
      keyIdea: 'Set elements (like dictionary keys) must be hashable: tuples are fine, but adding a list raises a `TypeError`.',
    },
    python: { error: 'TypeError' },
  },
  {
    id: 'dicts-sets-018',
    subtopic: 'dicts-sets',
    difficulty: 'challenge',
    stem:
      'A hash table uses **chaining**: each of its buckets holds a list of the keys that hash to it. The hash function spreads keys evenly over the buckets.\n\n' +
      'The table starts with 200 buckets and 600 keys. Then 400 more keys are inserted and the table is resized to 500 buckets (all keys are re-hashed into the new buckets).\n\n' +
      'On average, how many keys does an **unsuccessful** search (for a key that is not in the table) now have to examine?',
    options: ['$5$', '$2$', '$1$', '$1000$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'An unsuccessful search hashes the key to one bucket and must check **every** key in that bucket\'s chain before concluding the key is absent. So the average work equals the average chain length, called the **load factor**:\n\n' +
        '$$\\alpha = \\frac{n}{m} = \\frac{\\text{number of keys}}{\\text{number of buckets}}$$\n\n' +
        '1. Keys after the insertions: $n = 600 + 400 = 1000$.\n' +
        '2. Buckets after resizing: $m = 500$.\n' +
        '3. $\\alpha = \\frac{1000}{500} = 2$.\n\n' +
        'So on average 2 keys are examined. Because resizing keeps $\\alpha$ small and fixed, lookups stay $O(1)$ on average no matter how many keys there are.',
      whyWrong: [
        'This uses the new number of keys with the old number of buckets: $\\frac{1000}{200} = 5$. The table was resized to 500 buckets before the search.',
        null,
        '$O(1)$ means the work does not grow with $n$; it does not mean exactly one key is checked. Here each chain holds 2 keys on average.',
        'This is the cost of an unsuccessful search through a plain list, where all $1000$ keys must be checked before you can say the key is missing. A hash table only searches the one bucket that the key hashes to.',
      ],
      keyIdea: 'With chaining, an average search examines about $\\alpha = \\frac{n}{m}$ keys, so keeping the load factor bounded (by resizing) gives $O(1)$ average lookups.',
    },
    check: {
      optionValues: [5, 2, 1, 1000],
      compute: () => (600 + 400) / 500,
    },
  },
  {
    id: 'dicts-sets-019',
    subtopic: 'dicts-sets',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `votes = ['red', 'blue', 'red', 'green', 'blue', 'red']
tally = {}
for v in votes:
    tally[v] = tally.get(v, 0) + 1
winners = {c for c, n in tally.items() if n >= 2}
tally['green'] += 2
print(sorted(winners), tally['green'])`,
    },
    options: [
      "`['blue', 'green', 'red'] 3`",
      "`['red'] 3`",
      "`['red', 'blue'] 3`",
      "`['blue', 'red'] 3`",
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        "**Step 1: count the votes.** After the loop, `tally = {'red': 3, 'blue': 2, 'green': 1}`.\n\n" +
        '**Step 2: build `winners`.** The set comprehension keeps each colour with `n >= 2`: red (3) and blue (2). Green (1) is left out. So `winners = {\'red\', \'blue\'}`.\n\n' +
        "**Step 3: `tally['green'] += 2`.** Green's count becomes $1 + 2 = 3$. This changes the dictionary only: `winners` was already built in step 2 and is **not** recalculated.\n\n" +
        "**Step 4: print.** `sorted(winners)` puts the strings in alphabetical order: `['blue', 'red']`. `tally['green']` is 3.\n\n" +
        "Output: `['blue', 'red'] 3`.",
      whyWrong: [
        "This assumes `winners` updates itself when `tally` changes. The set was computed once, while green still had only 1 vote.",
        'This reads `n >= 2` as "more than 2". Blue has exactly 2 votes, and $2 \\ge 2$ is true, so blue is a winner.',
        "`sorted` arranges strings alphabetically, not in insertion order, so `'blue'` comes before `'red'`.",
        null,
      ],
      keyIdea: 'A comprehension builds a new collection from the data at that moment; later changes to the dictionary do not update it.',
    },
    python: { stdout: "['blue', 'red'] 3\n" },
  },
];
