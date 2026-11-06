import type { StaticQuestion } from '../../../types';
import { mod } from '../../../lib/mathx';

/** Join source lines into one code string. */
const L = (...lines: string[]) => lines.join('\n');

const INDEXED = 'Arrays are indexed from 1.';

/** How the interpreter prints an array, used to compare checks with the options. */
const show = (a: number[]) => `[${a.join(', ')}]`;

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
    stem: 'A map stores `a: 1` and `b: 2`. Key `c` is then set to 3 and key `a` is set to 10. What does the map hold now?',
    options: ['`a: 10, b: 2, c: 3`', '`a: 1, b: 2, c: 3`', '`a: 1, b: 2, c: 3, a: 10`', '`a: 10, b: 2`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Go one step at a time.\n\n' +
        '1. Key `c` is **new**, so a new pair is added: `a: 1, b: 2, c: 3`.\n' +
        '2. Key `a` **already exists**, so its value is replaced: `a: 10, b: 2, c: 3`.',
      whyWrong: [
        null,
        'This assumes an existing key cannot be changed. Setting a key that is already there overwrites its value.',
        'A map can never hold the same key twice. Setting an existing key replaces its value instead of adding a second entry.',
        'This forgets the new pair. Setting a key that is not there adds it.',
      ],
      keyIdea: 'Setting a key adds a pair if the key is new, and overwrites the value if it already exists.',
    },
    check: {
      optionValues: ['a: 10, b: 2, c: 3', 'a: 1, b: 2, c: 3', 'a: 1, b: 2, c: 3, a: 10', 'a: 10, b: 2'],
      compute: () => {
        const m = new Map<string, number>([['a', 1], ['b', 2]]);
        m.set('c', 3);
        m.set('a', 10);
        return [...m.entries()].map(([k, v]) => `${k}: ${v}`).join(', ');
      },
    },
  },
  {
    id: 'dicts-sets-004',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'How many elements does the set built from the values 3, 1, 3, 2, 1, 3 contain?',
    options: ['6', '3', '2', '1'],
    correctIndex: 1,
    markScheme: {
      solution:
        'A set keeps only **one copy** of each value, so the repeats disappear.\n\n' +
        'The different values are 1, 2 and 3, so the set is $\\{1, 2, 3\\}$, which has 3 elements.',
      whyWrong: [
        'This counts every value in the list. A set drops the repeats.',
        null,
        'This counts only the values that appear more than once (3 and 1). The set keeps every distinct value, including 2.',
        'This counts only the value that appears exactly once (2). A set keeps one copy of **every** value.',
      ],
      keyIdea: 'The size of a set is the number of distinct values, because a set stores each value only once.',
    },
    check: {
      optionValues: [6, 3, 2, 1],
      compute: () => new Set([3, 1, 3, 2, 1, 3]).size,
    },
  },
  {
    id: 'dicts-sets-005',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'A hash-based set holds $n$ values. On average, how long does testing whether a value is in the set take?',
    options: ['$O(n)$', '$O(\\log n)$', '$O(1)$', '$O(n^2)$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A hash-based set is built on a **hash table**.\n\n' +
        '1. The hash function turns the value into a slot number.\n' +
        '2. The search jumps straight to that slot and compares only the few items stored there.\n' +
        '3. This work does not depend on how many items are in the set, so on average it is constant time, $O(1)$.\n\n' +
        'Compare with an unsorted array, where the items are checked one by one: $O(n)$.',
      whyWrong: [
        'This is the cost of searching an unsorted array, where every item may have to be checked. A hash table jumps to the right slot.',
        'This is the cost of binary search on a **sorted** array. A hash table does not search by halving.',
        null,
        'No membership test needs quadratic time. That would mean comparing every item with every other item.',
      ],
      keyIdea: 'Hash-based sets and maps give $O(1)$ average lookups, compared with $O(n)$ for an unsorted array.',
    },
  },
  {
    id: 'dicts-sets-009',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'In a key-value map, what is used to look up a stored value?',
    options: ['Its key', 'Its position', 'Its value', 'Its size'],
    correctIndex: 0,
    markScheme: {
      solution: 'A map stores key-value pairs. You give it the **key** and it gives you the value stored with that key, like looking up a name in a phone book to find the number.',
      whyWrong: [
        null,
        'Looking up by position is how an array works. A map finds entries by key.',
        'The value is what you are trying to find, so it cannot be what you look up with.',
        'The size only tells you how many pairs the map holds.',
      ],
      keyIdea: 'A map finds a value from its key.',
    },
  },
  {
    id: 'dicts-sets-020',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'Which property does every set have?',
    options: ['No repeated elements', 'Elements are in sorted order', 'Each element has an index', 'Every element is a number'],
    correctIndex: 0,
    markScheme: {
      solution: 'A set is a collection with **no repeats**. Adding a value that is already there changes nothing. A set has no order and no positions.',
      whyWrong: [
        null,
        'A set has no order at all, sorted or otherwise.',
        'Indices belong to arrays. A set only answers whether a value is in it.',
        'A set can hold any values, such as letters or words.',
      ],
      keyIdea: 'A set holds each value at most once.',
    },
  },
  {
    id: 'dicts-sets-021',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'In a key-value map, how many times can the same key appear?',
    options: ['At most once', 'At most twice', 'Any number of times', 'As many times as its value'],
    correctIndex: 0,
    markScheme: {
      solution: 'Keys are **unique**: each key appears at most once, so a lookup always gives one answer. Values, on the other hand, can repeat.',
      whyWrong: [
        null,
        'There is no limit of two. A second entry for a key would make a lookup ambiguous.',
        'This describes values, which can repeat. Keys cannot.',
        'The value has nothing to do with how often a key appears.',
      ],
      keyIdea: 'Map keys are unique; values can repeat.',
    },
  },
  {
    id: 'dicts-sets-022',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'What is a collision in a hash table?',
    options: ['Two keys hash to the same slot', 'A key is inserted twice', 'The table becomes full', 'A search finds nothing'],
    correctIndex: 0,
    markScheme: {
      solution: 'A **collision** happens when two different keys give the same slot number. The table then needs a rule for storing both, such as chaining or linear probing.',
      whyWrong: [
        null,
        'Inserting the same key again just overwrites its value. A collision involves two different keys.',
        'A full table is a separate problem. Collisions can happen when the table is nearly empty.',
        'A failed search just means the key is not there. It says nothing about two keys sharing a slot.',
      ],
      keyIdea: 'A collision is two different keys mapping to the same slot.',
    },
  },
  {
    id: 'dicts-sets-023',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'What does a hash function do?',
    options: ['Turns a key into a slot number', 'Sorts the keys', 'Removes repeated keys', 'Counts the stored keys'],
    correctIndex: 0,
    markScheme: {
      solution: 'A **hash function** takes a key and calculates a slot number, for example $h(k) = k \\bmod m$. The table can then jump straight to that slot.',
      whyWrong: [
        null,
        'A hash table does not keep its keys in order. Slot numbers are not sorted positions.',
        'Keys stay unique because of how the table stores them. The hash function only calculates a number.',
        'Counting the keys needs a counter. The function works on one key at a time.',
      ],
      keyIdea: 'A hash function maps a key to a slot number.',
    },
  },
  {
    id: 'dicts-sets-024',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'Which set operation keeps only the elements found in both sets?',
    options: ['Intersection', 'Union', 'Difference', 'Symmetric difference'],
    correctIndex: 0,
    markScheme: {
      solution: 'The **intersection** $A \\cap B$ holds the elements in both $A$ and $B$. For $\\{1, 2, 3\\}$ and $\\{2, 3, 4\\}$ it is $\\{2, 3\\}$.',
      whyWrong: [
        null,
        'The union holds everything in either set.',
        'The difference $A \\setminus B$ holds what is in $A$ but not in $B$.',
        'The symmetric difference holds what is in exactly one of the sets, which leaves out the shared elements.',
      ],
      keyIdea: 'Intersection means in both; union means in either.',
    },
  },
  {
    id: 'dicts-sets-025',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'The cardinality of a set is its number of elements. Find the cardinality of the set of distinct letters in the word LEVEL.',
    options: ['3', '5', '2', '1'],
    correctIndex: 0,
    markScheme: {
      solution: 'The distinct letters are L, E and V, so the set has **cardinality** (size) 3.',
      whyWrong: [
        null,
        'This counts every letter in the word, including the repeats.',
        'This counts only the letters that repeat (L and E).',
        'This counts only the letter that appears exactly once (V).',
      ],
      keyIdea: 'Cardinality is the number of distinct elements in a set.',
    },
    check: {
      optionValues: [3, 5, 2, 1],
      compute: () => new Set('LEVEL').size,
    },
  },
  {
    id: 'dicts-sets-026',
    subtopic: 'dicts-sets',
    difficulty: 'foundation',
    stem: 'A hash table holds 30 keys in 40 slots. What is its load factor?',
    options: ['$\\frac{3}{4}$', '$\\frac{4}{3}$', '$10$', '$70$'],
    correctIndex: 0,
    markScheme: {
      solution: 'The **load factor** is the number of keys divided by the number of slots: $\\alpha = \\frac{n}{m} = \\frac{30}{40} = \\frac{3}{4}$.',
      whyWrong: [
        null,
        'This divides slots by keys. The load factor is keys divided by slots.',
        'This subtracts. It is the number of free slots at best, not the load factor.',
        'This adds the two numbers. The load factor is a ratio.',
      ],
      keyIdea: 'Load factor is keys divided by slots.',
    },
    check: {
      optionValues: [3 / 4, 4 / 3, 10, 70],
      compute: () => 30 / 40,
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'dicts-sets-006',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: `${INDEXED} \`C\` counts how often each value appears in \`A\`. What does this pseudocode print?`,
    code: {
      lang: 'pseudocode',
      source: L('A = [2, 1, 3, 1, 2, 1]', 'C = [0, 0, 0]', 'for i = 1 to length(A)', '   C[A[i]] = C[A[i]] + 1', 'end for', 'print(C)'),
    },
    options: ['`[3, 2, 1]`', '`[1, 1, 1]`', '`[2, 1, 0]`', '`[1, 2, 3]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each value of `A` is used as an index into `C`, and that count goes up by 1.\n\n' +
        '| i | A[i] | `C` afterwards |\n' +
        '|---|---|---|\n' +
        '| 1 | 2 | `[0, 1, 0]` |\n' +
        '| 2 | 1 | `[1, 1, 0]` |\n' +
        '| 3 | 3 | `[1, 1, 1]` |\n' +
        '| 4 | 1 | `[2, 1, 1]` |\n' +
        '| 5 | 2 | `[2, 2, 1]` |\n' +
        '| 6 | 1 | `[3, 2, 1]` |\n\n' +
        'The value 1 appears 3 times, 2 appears twice and 3 appears once. Output: `[3, 2, 1]`.',
      whyWrong: [
        null,
        'This assumes each count is reset to 1. The line adds 1 to the count so far, so repeated values keep going up.',
        'This is off by one: it stores 0 the first time a value is seen. In fact the count becomes 1 on the first sighting.',
        'This lists the values themselves in order. Each position of `C` holds how many times that value appears.',
      ],
      keyIdea: 'A counting array uses each value as an index and adds 1 there, just as a map counts by key.',
    },
    check: {
      optionValues: ['[3, 2, 1]', '[1, 1, 1]', '[2, 1, 0]', '[1, 2, 3]'],
      compute: () => {
        const C = [0, 0, 0];
        for (const x of [2, 1, 3, 1, 2, 1]) C[x - 1] = C[x - 1] + 1;
        return show(C);
      },
    },
  },
  {
    id: 'dicts-sets-007',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'Let $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5\\}$. Find $|A \\cup B|$, $|A \\cap B|$, $|A \\setminus B|$ and $|B \\setminus A|$, in that order.',
    options: ['7, 2, 2, 1', '5, 2, 2, 2', '5, 2, 1, 2', '5, 2, 2, 1'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Work out each set, then count its elements. The notation $|X|$ means the number of elements of $X$.\n\n' +
        '- $A \\cup B$ (union, in $A$ **or** $B$) is $\\{1, 2, 3, 4, 5\\}$, size 5. The shared values 3 and 4 are counted once.\n' +
        '- $A \\cap B$ (intersection, in **both**) is $\\{3, 4\\}$, size 2.\n' +
        '- $A \\setminus B$ (difference, in $A$ but **not** in $B$) is $\\{1, 2\\}$, size 2.\n' +
        '- $B \\setminus A$ is $\\{5\\}$, size 1.\n\n' +
        'Check: $|A \\cup B| = |A| + |B| - |A \\cap B| = 4 + 3 - 2 = 5$.',
      whyWrong: [
        'This adds the sizes $4 + 3 = 7$ for the union, counting the shared values 3 and 4 twice. A set never contains duplicates.',
        'This assumes $A \\setminus B$ and $B \\setminus A$ are the same size. Set difference is not symmetric: $B \\setminus A$ is just $\\{5\\}$.',
        'This swaps the two differences. $A \\setminus B$ means start with $A$ and remove anything in $B$, giving $\\{1, 2\\}$.',
        null,
      ],
      keyIdea: 'Union is either, intersection is both, difference is one-way, and $|A \\cup B| = |A| + |B| - |A \\cap B|$.',
    },
    check: {
      optionValues: ['7, 2, 2, 1', '5, 2, 2, 2', '5, 2, 1, 2', '5, 2, 2, 1'],
      compute: () => {
        const A = new Set([1, 2, 3, 4]);
        const B = new Set([3, 4, 5]);
        const union = new Set([...A, ...B]).size;
        const inter = [...A].filter((x) => B.has(x)).length;
        const aMinusB = [...A].filter((x) => !B.has(x)).length;
        const bMinusA = [...B].filter((x) => !A.has(x)).length;
        return `${union}, ${inter}, ${aMinusB}, ${bMinusA}`;
      },
    },
  },
  {
    id: 'dicts-sets-008',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: `${INDEXED} \`S\` holds the values of a map, one per key. What does this pseudocode print?`,
    code: {
      lang: 'pseudocode',
      source: L('S = [72, 85, 64, 91]', 't = 0', 'for i = 1 to length(S)', '   if S[i] > 70', '      t = t + S[i]', '   end if', 'end for', 'print(t)'),
    },
    options: ['312', '248', '3', '64'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| i | S[i] | S[i] > 70? | t |\n' +
        '|---|---|---|---|\n' +
        '| 1 | 72 | yes | 72 |\n' +
        '| 2 | 85 | yes | 157 |\n' +
        '| 3 | 64 | no | 157 |\n' +
        '| 4 | 91 | yes | 248 |\n\n' +
        'Output: 248.',
      whyWrong: [
        'This adds all four values ($72 + 85 + 64 + 91 = 312$) and ignores the `if`, which skips 64.',
        null,
        'This counts how many values pass the test instead of adding them. The code does `t = t + S[i]`, not `t = t + 1`.',
        'This is the only value that fails the test. The code adds the ones that pass.',
      ],
      keyIdea: 'A filtered total adds only the values that pass the test.',
    },
    check: {
      optionValues: [312, 248, 3, 64],
      compute: () => {
        const S = [72, 85, 64, 91];
        let t = 0;
        for (const s of S) if (s > 70) t = t + s;
        return t;
      },
    },
  },
  {
    id: 'dicts-sets-010',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'A hash table has slots 0 to 6, with $h(k) = k \\bmod 7$ and linear probing that wraps round. Keys 5, 12, 19, 6 are inserted in that order. Which slot holds 6?',
    options: ['Slot 6', 'Slot 7', 'Slot 0', 'Slot 1'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Linear probing** means that if a slot is taken, you try the next one, wrapping from slot 6 back to slot 0.\n\n' +
        '| key | $k \\bmod 7$ | slots tried | final slot |\n' +
        '|---|---|---|---|\n' +
        '| 5 | 5 | 5 | 5 |\n' +
        '| 12 | 5 | 5 (taken), 6 | 6 |\n' +
        '| 19 | 5 | 5, 6 (taken), 0 | 0 |\n' +
        '| 6 | 6 | 6, 0 (taken), 1 | 1 |\n\n' +
        'Answer: slot 1.',
      whyWrong: [
        'This is just $h(6) = 6$, ignoring the collision. Slot 6 is already occupied by 12, so the key must probe onwards.',
        'There is no slot 7: the slots are numbered 0 to 6. After slot 6 the probe wraps round to slot 0.',
        'This forgets that 19 was already placed in slot 0, so slot 0 is not free either.',
        null,
      ],
      keyIdea: 'With linear probing, a colliding key moves to the next free slot, wrapping round to the start of the table.',
    },
    check: {
      optionValues: [6, 7, 0, 1],
      compute: () => linearProbe([5, 12, 19, 6], 7)[3],
    },
  },
  {
    id: 'dicts-sets-011',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'The words cat, horse, ox, cat, emu are stored in a map, with each word as key and its length as value. How many keys are there, and what do the values add up to?',
    options: ['5 keys, sum 16', '4 keys, sum 10', '4 keys, sum 16', '4 keys, sum 13'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. cat gives `cat: 3`, horse gives `horse: 5`, ox gives `ox: 2`.\n' +
        '2. The second cat sets `cat: 3` again. The key already exists, so it is overwritten with the same value; no new entry is made.\n' +
        '3. emu gives `emu: 3`.\n\n' +
        'So the map holds 4 keys, and the values add up to $3 + 5 + 2 + 3 = 13$.',
      whyWrong: [
        'This counts the repeated cat as a separate entry. Keys are unique, so the second cat only overwrites the first.',
        'This removes the duplicate **values** as well, adding only $3 + 5 + 2$. Values can repeat freely: cat and emu both have value 3.',
        'This assumes the second cat adds 3 onto the existing value (giving 6). Setting a key replaces the value; it does not accumulate.',
        null,
      ],
      keyIdea: 'Keys in a map are unique (a repeated key overwrites), but values can repeat.',
    },
    check: {
      optionValues: ['5 16', '4 10', '4 16', '4 13'],
      compute: () => {
        const m = new Map<string, number>();
        for (const w of ['cat', 'horse', 'ox', 'cat', 'emu']) m.set(w, w.length);
        return `${m.size} ${[...m.values()].reduce((a, b) => a + b, 0)}`;
      },
    },
  },
  {
    id: 'dicts-sets-012',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: `${INDEXED} \`S\` records which values have been seen. What does this pseudocode print? Printed values are shown in order, separated by a space.`,
    code: {
      lang: 'pseudocode',
      source: L('A = [4, 2, 4, 1, 2]', 'S = [0, 0, 0, 0]', 'for i = 1 to length(A)', '   if S[A[i]] == 0', '      S[A[i]] = 1', '      print(A[i])', '   end if', 'end for'),
    },
    options: ['`1 2 4`', '`4 2 1`', '`1`', '`4 1 2`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`S` plays the part of a set of seen values, and a value is printed the **first** time it is met.\n\n' +
        '| i | A[i] | seen before? | printed |\n' +
        '|---|---|---|---|\n' +
        '| 1 | 4 | no | 4 |\n' +
        '| 2 | 2 | no | 2 |\n' +
        '| 3 | 4 | yes | - |\n' +
        '| 4 | 1 | no | 1 |\n' +
        '| 5 | 2 | yes | - |\n\n' +
        'Output: `4 2 1`.',
      whyWrong: [
        'This is the distinct values in sorted order. The code never sorts: values are printed in the order they first appear.',
        null,
        'This keeps only the value that appears exactly once. The code prints every value once, so 4 and 2 are included on their first appearance.',
        'This keeps the **last** appearance of each value. The code prints a value the first time it is seen and skips it afterwards.',
      ],
      keyIdea: 'A record of seen values removes duplicates while keeping the order of first appearance.',
    },
    check: {
      optionValues: ['1 2 4', '4 2 1', '1', '4 1 2'],
      compute: () => {
        const S = [0, 0, 0, 0];
        const out: number[] = [];
        for (const x of [4, 2, 4, 1, 2]) {
          if (S[x - 1] === 0) {
            S[x - 1] = 1;
            out.push(x);
          }
        }
        return out.join(' ');
      },
    },
  },
  {
    id: 'dicts-sets-013',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'A map holds `pen: 3` and `ink: 2`. Then `ink` is set to 5, `pad` is set to 1, `pen` is reduced by 1, and `pad` is removed. What does the map hold?',
    options: ['`pen: 2, ink: 7`', '`pen: 2, ink: 5`', '`pen: 2, ink: 2`', '`pen: 3, ink: 5`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Trace the map one step at a time.\n\n' +
        '1. Start: `pen: 3, ink: 2`.\n' +
        '2. `ink` already exists, so its value is **replaced** by 5: `pen: 3, ink: 5`.\n' +
        '3. `pad` is new, so it is added: `pen: 3, ink: 5, pad: 1`.\n' +
        '4. `pen` becomes $3 - 1 = 2$: `pen: 2, ink: 5, pad: 1`.\n' +
        '5. `pad` is removed: `pen: 2, ink: 5`.',
      whyWrong: [
        'This adds the values together ($2 + 5 = 7$). Setting an existing key overwrites its value; it does not add to it.',
        null,
        'This assumes setting a key leaves an existing value alone. In fact the value is overwritten.',
        'This forgets the step that reduces `pen` by 1.',
      ],
      keyIdea: 'Setting a key overwrites an existing value and adds a new key; removing a key deletes its pair.',
    },
    check: {
      optionValues: ['pen: 2, ink: 7', 'pen: 2, ink: 5', 'pen: 2, ink: 2', 'pen: 3, ink: 5'],
      compute: () => {
        const m = new Map<string, number>([['pen', 3], ['ink', 2]]);
        m.set('ink', 5);
        m.set('pad', 1);
        m.set('pen', m.get('pen')! - 1);
        m.delete('pad');
        return [...m.entries()].map(([k, v]) => `${k}: ${v}`).join(', ');
      },
    },
  },
  {
    id: 'dicts-sets-018',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'A hash table uses chaining, with keys spread evenly. It holds 600 keys in 200 buckets, then gains 400 keys and is resized to 500 buckets. How many keys does an average unsuccessful search examine?',
    options: ['$5$', '$2$', '$1$', '$1000$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'With **chaining**, each bucket holds a list of the keys that hash to it. An unsuccessful search hashes the key to one bucket and must check **every** key in that chain. So the average work equals the average chain length, called the **load factor**:\n\n' +
        '$$\\alpha = \\frac{n}{m} = \\frac{\\text{number of keys}}{\\text{number of buckets}}$$\n\n' +
        '1. Keys after the insertions: $n = 600 + 400 = 1000$.\n' +
        '2. Buckets after resizing: $m = 500$.\n' +
        '3. $\\alpha = \\frac{1000}{500} = 2$.\n\n' +
        'So on average 2 keys are examined.',
      whyWrong: [
        'This uses the new number of keys with the old number of buckets: $\\frac{1000}{200} = 5$. The table was resized to 500 buckets before the search.',
        null,
        '$O(1)$ means the work does not grow with $n$; it does not mean exactly one key is checked. Here each chain holds 2 keys on average.',
        'This is the cost of an unsuccessful search through a plain list, where all $1000$ keys must be checked. A hash table only searches the one bucket that the key hashes to.',
      ],
      keyIdea: 'With chaining, an average search examines about $\\alpha = \\frac{n}{m}$ keys, so keeping the load factor bounded (by resizing) gives $O(1)$ average lookups.',
    },
    check: {
      optionValues: [5, 2, 1, 1000],
      compute: () => (600 + 400) / 500,
    },
  },
  {
    id: 'dicts-sets-027',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'For $A = \\{2, 4, 6, 8\\}$ and $B = \\{4, 8, 10\\}$, what is the size of $(A \\cup B) \\setminus (A \\cap B)$?',
    options: ['3', '5', '2', '7'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. $A \\cup B = \\{2, 4, 6, 8, 10\\}$.\n' +
        '2. $A \\cap B = \\{4, 8\\}$.\n' +
        '3. Removing the shared elements leaves $\\{2, 6, 10\\}$, which has size 3.\n\n' +
        'This set is called the **symmetric difference**: the elements in exactly one of the two sets.',
      whyWrong: [
        null,
        'This is the size of the union alone. The shared elements must then be removed.',
        'This is the size of the intersection, which is the part being removed.',
        'This adds the two sizes, $4 + 3$. That counts the shared elements twice and never removes them.',
      ],
      keyIdea: 'The symmetric difference holds the elements in exactly one of the two sets.',
    },
    check: {
      optionValues: [3, 5, 2, 7],
      compute: () => {
        const A = new Set([2, 4, 6, 8]);
        const B = new Set([4, 8, 10]);
        return [...new Set([...A, ...B])].filter((x) => !(A.has(x) && B.has(x))).length;
      },
    },
  },
  {
    id: 'dicts-sets-028',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'All $n$ keys in a chained hash table land in one bucket. How long does a lookup take in this worst case?',
    options: ['$O(n)$', '$O(1)$', '$O(\\log n)$', '$O(n^2)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A lookup hashes the key to its bucket, then checks the keys in that bucket one by one.\n\n' +
        'If every key is in the same bucket, the chain has length $n$, so the search may check all $n$ keys: $O(n)$. The usual $O(1)$ is only an **average**, when keys are spread evenly.',
      whyWrong: [
        null,
        'This is the average case with keys spread evenly. Here they all share one chain.',
        'This would need the chain to be sorted and searched by halving. A chain is checked one key at a time.',
        'One lookup goes along one chain once, so it cannot need $n^2$ steps.',
      ],
      keyIdea: 'Hash table lookups are $O(1)$ on average but $O(n)$ in the worst case, when all keys collide.',
    },
  },
  {
    id: 'dicts-sets-029',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: `${INDEXED} What does this pseudocode print?`,
    code: {
      lang: 'pseudocode',
      source: L('A = [1, 2, 1]', 'C = [0, 0]', 'i = 1', 'while (i <= length(A))', '   C[A[i]] = C[A[i]] + 1', 'end while', 'print(C)'),
    },
    options: ['`[2, 1]`', '`[1, 1]`', '`[1, 2]`', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Check that the loop variable changes. Nothing in the body changes `i`, so it stays 1.\n\n' +
        '| Pass | i | i <= 3? | `C` afterwards |\n|---|---|---|---|\n' +
        '| 1 | 1 | yes | `[1, 0]` |\n' +
        '| 2 | 1 | yes | `[2, 0]` |\n' +
        '| 3 | 1 | yes | `[3, 0]` |\n\n' +
        'The condition is always true, so the loop never ends and nothing is printed: **Infinite loop**.',
      whyWrong: [
        'This is the correct count if the loop had `i = i + 1`. Without it, the loop never moves past the first element.',
        'This counts each distinct value once. The loop never reaches the later elements at all.',
        'This swaps the two counts, and it also assumes the loop finishes. `i` never changes.',
        null,
      ],
      keyIdea: 'A `while` loop must update its index, or it never ends.',
    },
    check: {
      optionValues: ['[2, 1]', '[1, 1]', '[1, 2]', 'Infinite loop'],
      compute: () => {
        const A = [1, 2, 1];
        const C = [0, 0];
        const i = 1;
        let passes = 0;
        while (i <= A.length) {
          if (++passes > 1000) return 'Infinite loop';
          C[A[i - 1] - 1] = C[A[i - 1] - 1] + 1;
        }
        return show(C);
      },
    },
  },
  {
    id: 'dicts-sets-030',
    subtopic: 'dicts-sets',
    difficulty: 'exam',
    stem: 'Removing duplicates from $n$ values, using a hash-based set of the values seen so far, takes on average:',
    options: ['$O(n)$', '$O(n^2)$', '$O(1)$', '$O(\\log n)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Each of the $n$ values needs one membership test and possibly one insert.\n' +
        '2. Each of these takes $O(1)$ on average in a hash-based set.\n' +
        '3. So the total is $n \\times O(1) = O(n)$.',
      whyWrong: [
        null,
        'This is the time with no set at all, comparing each value with all the earlier ones.',
        'This is the time for one membership test. There are $n$ values to process.',
        'This forgets that every value must be looked at, which alone takes at least $n$ steps.',
      ],
      keyIdea: '$n$ average $O(1)$ set operations take $O(n)$ in total.',
    },
  },
];
