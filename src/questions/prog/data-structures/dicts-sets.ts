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
      asking: 'After adding `c` and changing `a`, which pairs are in the map?',
      solution:
        'A **map** stores pairs: a **key** (the name you look up) and its **value** (what is stored under it). It works like a word and its meaning in a dictionary.\n\n' +
        'Setting a key does one of two things. If the key is new, a new pair is added. If the key is already there, its value is replaced.\n\n' +
        'Apply each change in order:\n\n| Change | Key already there? | Map afterwards |\n|---|---|---|\n| start | - | `a: 1, b: 2` |\n| set `c` to 3 | no, so add a pair | `a: 1, b: 2, c: 3` |\n| set `a` to 10 | yes, so replace 1 | `a: 10, b: 2, c: 3` |',
      conclusion: '`c` was added and `a` was overwritten, so the map holds `a: 10, b: 2, c: 3`.',
      whyWrong: [
        null,
        'This assumes an existing key cannot be changed. Setting a key that is already there overwrites its value.',
        'A map can never hold the same key twice. Setting an existing key replaces its value instead of adding a second entry.',
        'This forgets the new pair. Setting a key that is not there adds it.',
      ],
      keyIdea: 'For map questions, keep one row per change. Ask whether the key is already there. If it is, replace its value. If not, add a pair. A key never appears twice.',
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
      asking: 'How many different values are there among 3, 1, 3, 2, 1, 3?',
      solution:
        'A **set** is a collection in which each value counts once. Adding a value that is already there changes nothing.\n\n' +
        'Build the set one value at a time, then count what is in the last row:\n\n| Value | Already in the set? | Set afterwards |\n|---|---|---|\n| 3 | no | $\\{3\\}$ |\n| 1 | no | $\\{3, 1\\}$ |\n| 3 | yes | $\\{3, 1\\}$ |\n| 2 | no | $\\{3, 1, 2\\}$ |\n| 1 | yes | $\\{3, 1, 2\\}$ |\n| 3 | yes | $\\{3, 1, 2\\}$ |',
      conclusion: 'The different values are 1, 2 and 3, so the set contains 3 elements.',
      whyWrong: [
        'This counts every value in the list. A set drops the repeats.',
        null,
        'This counts only the values that appear more than once (3 and 1). The set keeps every distinct value, including 2.',
        'This counts only the value that appears exactly once (2). A set keeps one copy of **every** value.',
      ],
      keyIdea: 'To find a set\'s size, write down each value the first time you meet it and skip any repeats. The count of what you wrote is the number of **distinct** values, which is the size.',
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
      asking: 'On average, does checking whether a value is in a hash-based set take longer as the set grows?',
      solution:
        'A **hash-based set** stores values in numbered slots. A **hash function** turns a value into a slot number with a quick calculation.\n\n' +
        'To test whether a value is in the set, the computer works out its slot and looks only there. It does not go through the other values.\n\n' +
        'That is a fixed amount of work, however many values are stored. A fixed amount of work is written $O(1)$, called **constant time**. The question says "on average" because a few values can share a slot.',
      conclusion: 'The computer jumps straight to one slot, so the average time is $O(1)$.',
      whyWrong: [
        'This is the cost of searching an unsorted array, where every item may have to be checked. A hash table jumps to the right slot.',
        'This is the cost of binary search on a **sorted** array. A hash table does not search by halving.',
        null,
        'No membership test needs quadratic time. That would mean comparing every item with every other item.',
      ],
      keyIdea: 'Match the structure to its search time. Hash table: $O(1)$ on average, because it calculates the slot. Sorted array with binary search: $O(\\log n)$, because it halves each time. Unsorted array: $O(n)$, because it checks each item.',
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
      asking: 'When you look something up in a map, what do you give it to find the value?',
      solution:
        'A **map** stores pairs of a **key** and a **value**. In a phone book, for example, the name is the key and the phone number is the value.\n\n' +
        'To find a value, you give the key. Giving the name returns that person\'s number, and you do not need to know where in the book it is.',
      conclusion: 'You give the map the key and it hands back the value, so the answer is Its key.',
      whyWrong: [
        null,
        'Looking up by position is how an array works. A map finds entries by key.',
        'The value is what you are trying to find, so it cannot be what you look up with.',
        'The size only tells you how many pairs the map holds.',
      ],
      keyIdea: 'Compare an array with a map. An array looks up by position, as in `A[3]`. A map looks up by key, as with a name in a phone book. If a question mentions keys, the lookup uses the key.',
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
      asking: 'What is always true of every set?',
      solution:
        'A **set** is a collection where only one thing matters about a value: is it in the set or not?\n\n' +
        'So adding a value twice changes nothing. $\\{1, 2, 2\\}$ is the same set as $\\{1, 2\\}$, which means a value cannot appear in a set more than once.',
      conclusion: 'A value is either in a set or not, so every set has No repeated elements.',
      whyWrong: [
        null,
        'A set has no order at all, sorted or otherwise.',
        'Indices belong to arrays. A set only answers whether a value is in it.',
        'A set can hold any values, such as letters or words.',
      ],
      keyIdea: 'To test a claim about sets, try to find one set that breaks it. The set $\\{b, a\\}$ is not sorted, has no indexes and holds letters, which rules out those claims.',
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
      asking: 'Can one key appear more than once in a map?',
      solution:
        'A **map** stores pairs of a **key** and a **value**, and you look up a value by giving its key.\n\n' +
        'If a key appeared twice, say `pen: 3` and `pen: 5`, a lookup of `pen` would not know which value to give. So maps do not allow it.\n\n' +
        'Setting `pen` again replaces its value instead of adding a second entry, so the key still appears only once.',
      conclusion: 'A lookup needs one clear result, so a key can appear At most once.',
      whyWrong: [
        null,
        'There is no limit of two. A second entry for a key would make a lookup ambiguous.',
        'This describes values, which can repeat. Keys cannot.',
        'The value has nothing to do with how often a key appears.',
      ],
      keyIdea: 'Keys are unique, but values can repeat. When a question reuses a key, the new value replaces the old one and the number of keys does not go up.',
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
      asking: 'What does the word collision mean in a hash table?',
      solution:
        'A **hash table** stores keys in numbered **slots**. A **hash function** calculates which slot each key goes to.\n\n' +
        'Try $h(k) = k \\bmod 7$, the remainder after dividing by 7, with keys 5 and 12. $5 \\div 7$ is 0 remainder 5, and $12 \\div 7$ is 1 remainder 5.\n\n' +
        'Both keys get slot 5, even though they are different keys. This clash is called a **collision**.',
      conclusion: 'Different keys wanting one slot is what the word means: Two keys hash to the same slot.',
      whyWrong: [
        null,
        'Inserting the same key again just overwrites its value. A collision involves two different keys.',
        'A full table is a separate problem. Collisions can happen when the table is nearly empty.',
        'A failed search just means the key is not there. It says nothing about two keys sharing a slot.',
      ],
      keyIdea: 'To find collisions, work out the slot for each key and look for a repeated slot number. For $k \\bmod 7$, keys that differ by a multiple of 7 always collide.',
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
      asking: 'What job does a hash function do in a hash table?',
      solution:
        'A **hash table** stores keys in numbered **slots**, so it needs a rule to decide which slot each key goes in. That rule is the **hash function**.\n\n' +
        'For example, with slots 0 to 6, the function $h(k) = k \\bmod 7$ gives the remainder after dividing by 7. $19 \\div 7$ is 2 remainder 5, so key 19 goes to slot 5.',
      conclusion: 'It takes a key and calculates where the key goes, so a hash function Turns a key into a slot number.',
      whyWrong: [
        null,
        'A hash table does not keep its keys in order. Slot numbers are not sorted positions.',
        'Keys stay unique because of how the table stores them. The hash function only calculates a number.',
        'Counting the keys needs a counter. The function works on one key at a time.',
      ],
      keyIdea: 'To apply a hash function, put the key in and read off the slot number. With $\\bmod$, the remainder is the slot, which is always from 0 up to one less than the table size.',
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
      asking: 'What is the name for keeping only the values that two sets share?',
      solution:
        'Try it on $A = \\{1, 2, 3\\}$ and $B = \\{2, 3, 4\\}$. The values in both sets are 2 and 3.\n\n' +
        'The operation that gives $\\{2, 3\\}$ is called **intersection**, written $A \\cap B$. Think of where two roads cross: the part they share.',
      conclusion: '"In both sets" describes the shared part, which is the Intersection.',
      whyWrong: [
        null,
        'The union holds everything in either set.',
        'The difference $A \\setminus B$ holds what is in $A$ but not in $B$.',
        'The symmetric difference holds what is in exactly one of the sets, which leaves out the shared elements.',
      ],
      keyIdea: 'Use a small example and these meanings. Union $\\cup$: in either set. Intersection $\\cap$: in both. Difference $A \\setminus B$: in $A$ only. Symmetric difference: in exactly one.',
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
      asking: 'How many different letters are in the word LEVEL?',
      solution:
        '**Cardinality** is the number of elements in a set. A set holds each value once, so repeats do not count.\n\n' +
        'Go through the letters L, E, V, E, L and keep each letter the first time you see it. L is new, E is new and V is new. The second E and the second L are repeats.\n\n' +
        'That leaves the set $\\{L, E, V\\}$, which has 3 elements.',
      conclusion: 'L, E and V are the only different letters, so the cardinality is 3.',
      whyWrong: [
        null,
        'This counts every letter in the word, including the repeats.',
        'This counts only the letters that repeat (L and E).',
        'This counts only the letter that appears exactly once (V).',
      ],
      keyIdea: 'To find the size of a set made from a word or list, write each item the first time you meet it and skip the repeats. Then count what you wrote.',
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
      asking: 'What fraction measures how full a table is with 30 keys and 40 slots?',
      solution:
        'The **load factor** measures how full a hash table is. The formula is $\\text{load factor} = \\dfrac{\\text{number of keys}}{\\text{number of slots}}$.\n\n' +
        'Put in the numbers. There are 30 keys and 40 slots, which gives $\\frac{30}{40}$.\n\n' +
        'Simplify by dividing the top and bottom by 10: $\\frac{30}{40} = \\frac{3}{4}$.',
      conclusion: '30 keys over 40 slots simplifies to $\\frac{3}{4}$.',
      whyWrong: [
        null,
        'This divides slots by keys. The load factor is keys divided by slots.',
        'This subtracts. It is the number of free slots at best, not the load factor.',
        'This adds the two numbers. The load factor is a ratio.',
      ],
      keyIdea: 'Load factor is keys over slots, in that order. A table that is half full gives $\\frac{1}{2}$. With chaining, where each slot holds a list of its keys, the same fraction is also the average number of keys per slot.',
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
      asking: 'How many times does each of the values 1, 2 and 3 appear in `A`?',
      solution:
        '`C` has three positions, all starting at 0. `C[1]` counts how many 1s there are in `A`, `C[2]` counts the 2s and `C[3]` counts the 3s.\n\n' +
        'Line 4 looks complicated, so read it from the inside. `A[i]` is the current value, and `C[A[i]]` is the counter for that value. If `A[i]` is 2, line 4 becomes `C[2] = C[2] + 1`, adding 1 to the count of 2s.\n\n' +
        'Trace every pass. Line 6 prints `C` from the last row:\n\n| `i` | `A[i]` | Line 4 becomes | `C[1]` | `C[2]` | `C[3]` |\n|---|---|---|---|---|---|\n| 1 | 2 | `C[2] = C[2] + 1` | 0 | 1 | 0 |\n| 2 | 1 | `C[1] = C[1] + 1` | 1 | 1 | 0 |\n| 3 | 3 | `C[3] = C[3] + 1` | 1 | 1 | 1 |\n| 4 | 1 | `C[1] = C[1] + 1` | 2 | 1 | 1 |\n| 5 | 2 | `C[2] = C[2] + 1` | 2 | 2 | 1 |\n| 6 | 1 | `C[1] = C[1] + 1` | 3 | 2 | 1 |',
      conclusion: '`A` has three 1s, two 2s and one 3, so the answer is `[3, 2, 1]`.',
      whyWrong: [
        null,
        'This assumes each count is reset to 1. The line adds 1 to the count so far, so repeated values keep going up.',
        'This is off by one: it stores 0 the first time a value is seen. In fact the count becomes 1 on the first sighting.',
        'This lists the values themselves in order. Each position of `C` holds how many times that value appears.',
      ],
      keyIdea: 'In a **counting array**, `C[v]` holds how many times `v` has appeared. Read `C[A[i]]` from the inside out. For a quick check, count each value in `A`: the results, in order, are `C`.',
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
      asking: 'How many values are in each of these four combinations of $A$ and $B$?',
      solution:
        '$|S|$ means the number of elements in a set $S$. Start by sorting the values. Both $A$ and $B$ contain 3 and 4. Only $A$ contains 1 and 2. Only $B$ contains 5.\n\n' +
        'Now use those groups for each part, in the order asked:\n\n| Symbol | Meaning | Elements | Size |\n|---|---|---|---|\n| $A \\cup B$ | in $A$ or $B$ or both, with no repeats | $\\{1, 2, 3, 4, 5\\}$ | 5 |\n| $A \\cap B$ | in both | $\\{3, 4\\}$ | 2 |\n| $A \\setminus B$ | start with $A$, remove anything in $B$ | $\\{1, 2\\}$ | 2 |\n| $B \\setminus A$ | start with $B$, remove anything in $A$ | $\\{5\\}$ | 1 |',
      conclusion: 'Reading the sizes in the order asked gives 5, 2, 2, 1.',
      whyWrong: [
        'This adds the sizes $4 + 3 = 7$ for the union, counting the shared values 3 and 4 twice. A set never contains duplicates.',
        'This assumes $A \\setminus B$ and $B \\setminus A$ are the same size. Set difference is not symmetric: $B \\setminus A$ is just $\\{5\\}$.',
        'This swaps the two differences. $A \\setminus B$ means start with $A$ and remove anything in $B$, giving $\\{1, 2\\}$.',
        null,
      ],
      keyIdea: 'Sort the values first into three groups: only in $A$, in both, only in $B$. Union is all three groups, intersection is the middle group, and each difference is one outer group. Then count.',
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
      asking: 'What is the total of the values in `S` that are above 70?',
      solution:
        '`length(S)` is 4, so `i` takes the values 1, 2, 3 and 4. `t` is a **running total**, starting at 0 on line 2.\n\n' +
        'Line 4 tests whether the current value is above 70. Only if it is does line 5 add that value to `t`. Anything else is skipped.\n\n' +
        'Trace each pass. Line 8 prints `t` from the last row:\n\n| `i` | `S[i]` | `S[i] > 70`? | `t` afterwards |\n|---|---|---|---|\n| 1 | 72 | yes | $0 + 72 = 72$ |\n| 2 | 85 | yes | $72 + 85 = 157$ |\n| 3 | 64 | no | 157 |\n| 4 | 91 | yes | $157 + 91 = 248$ |',
      conclusion: 'Adding only the values above 70 gives $72 + 85 + 91$, so the answer is 248.',
      whyWrong: [
        'This adds all four values ($72 + 85 + 64 + 91 = 312$) and ignores the `if`, which skips 64.',
        null,
        'This counts how many values pass the test instead of adding them. The code does `t = t + S[i]`, not `t = t + 1`.',
        'This is the only value that fails the test. The code adds the ones that pass.',
      ],
      keyIdea: 'Spot what the `if` filters and what the body does. `t = t + S[i]` adds the value, while `t = t + 1` only counts. Mark the elements that pass the test, then add those values.',
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
      asking: 'After these four keys go in, which slot does key 6 end up in?',
      solution:
        '$k \\bmod 7$ is the remainder after dividing $k$ by 7. For example, $12 \\div 7$ is 1 remainder 5, so $h(12) = 5$. That remainder is the slot each key tries first.\n\n' +
        '**Linear probing** means that if a slot is taken, you try the next one, and keep going. **Wraps round** means that after slot 6 comes slot 0.\n\n' +
        'Insert the keys in the given order. Each key takes the first free slot it finds:\n\n| Key $k$ | $h(k)$ | Slots tried | Placed in |\n|---|---|---|---|\n| 5 | 5 | 5 (free) | 5 |\n| 12 | 5 | 5 (taken), 6 (free) | 6 |\n| 19 | 5 | 5 (taken), 6 (taken), 0 (free) | 0 |\n| 6 | 6 | 6 (taken), 0 (taken), 1 (free) | 1 |',
      conclusion: 'Slots 6 and 0 are already taken when key 6 arrives, so it lands in Slot 1.',
      whyWrong: [
        'This is just $h(6) = 6$, ignoring the collision. Slot 6 is already occupied by 12, so the key must probe onwards.',
        'There is no slot 7: the slots are numbered 0 to 6. After slot 6 the probe wraps round to slot 0.',
        'This forgets that 19 was already placed in slot 0, so slot 0 is not free either.',
        null,
      ],
      keyIdea: 'For linear probing, draw the empty slots and insert keys one at a time, in the given order. Work out the remainder, then move right to the first free slot, wrapping past the last slot to 0.',
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
      asking: 'How many different words get stored, and what is the total of their lengths?',
      solution:
        'A **map** holds pairs of a **key** and a **value**, and each key appears once. Here the key is the word and the value is its number of letters. Setting a key again replaces its value.\n\n' +
        'Go through the words in order:\n\n| Word | Key already there? | What happens |\n|---|---|---|\n| cat | no | adds `cat: 3` |\n| horse | no | adds `horse: 5` |\n| ox | no | adds `ox: 2` |\n| cat | yes | replaces 3 with 3, so no change |\n| emu | no | adds `emu: 3` |\n\n' +
        'The map ends with 4 pairs: `cat: 3`, `horse: 5`, `ox: 2` and `emu: 3`. Values may repeat, so both 3s count. The sum is $3 + 5 + 2 + 3 = 13$.',
      conclusion: 'The word cat is stored only once, so the map has 4 keys, sum 13.',
      whyWrong: [
        'This counts the repeated cat as a separate entry. Keys are unique, so the second cat only overwrites the first.',
        'This removes the duplicate **values** as well, adding only $3 + 5 + 2$. Values can repeat freely: cat and emu both have value 3.',
        'This assumes the second cat adds 3 onto the existing value (giving 6). Setting a key replaces the value; it does not accumulate.',
        null,
      ],
      keyIdea: 'For a map built from a list, keep one row per item. Keys are unique, so a repeated key overwrites instead of adding a pair. Values can repeat, so add every value in the final map.',
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
      asking: 'Which values get printed, and in what order?',
      solution:
        '`S` has one position per value: `S[v]` is 0 if `v` has not been seen yet, and 1 if it has. Read `S[A[i]]` from the inside: find `A[i]`, then use it as an index into `S`.\n\n' +
        'So line 4 asks whether this is the first time we have seen this value. If it is, line 5 marks it as seen and line 6 prints it. If not, nothing happens.\n\n' +
        'Trace every pass. Reading the last column from top to bottom gives the output:\n\n| `i` | `A[i]` | `S[A[i]]` before | `S` afterwards | Prints |\n|---|---|---|---|---|\n| 1 | 4 | 0 | `[0, 0, 0, 1]` | 4 |\n| 2 | 2 | 0 | `[0, 1, 0, 1]` | 2 |\n| 3 | 4 | 1 | `[0, 1, 0, 1]` | - |\n| 4 | 1 | 0 | `[1, 1, 0, 1]` | 1 |\n| 5 | 2 | 1 | `[1, 1, 0, 1]` | - |',
      conclusion: 'Each value prints the first time it is seen, and never again, so the answer is `4 2 1`.',
      whyWrong: [
        'This is the distinct values in sorted order. The code never sorts: values are printed in the order they first appear.',
        null,
        'This keeps only the value that appears exactly once. The code prints every value once, so 4 and 2 are included on their first appearance.',
        'This keeps the **last** appearance of each value. The code prints a value the first time it is seen and skips it afterwards.',
      ],
      keyIdea: 'A "seen" array or set removes duplicates and keeps the order of first appearance. Go through the list: if a value is new, mark and print it. If it has been seen, skip it. Nothing here sorts the values.',
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
      asking: 'After these four changes, which pairs are left in the map?',
      solution:
        'A **map** stores pairs of a **key** and a **value**. Setting an existing key replaces its value, and setting a new key adds a pair. Removing a key deletes its whole pair.\n\n' +
        'Rewrite the map after each change:\n\n| Change | Map afterwards |\n|---|---|\n| start | `pen: 3, ink: 2` |\n| set `ink` to 5, replacing the 2 | `pen: 3, ink: 5` |\n| set `pad` to 1, a new key | `pen: 3, ink: 5, pad: 1` |\n| reduce `pen` by 1, $3 - 1 = 2$ | `pen: 2, ink: 5, pad: 1` |\n| remove `pad` | `pen: 2, ink: 5` |',
      conclusion: '`ink` was replaced, `pen` went down by 1, and `pad` came and went, so the map holds `pen: 2, ink: 5`.',
      whyWrong: [
        'This adds the values together ($2 + 5 = 7$). Setting an existing key overwrites its value; it does not add to it.',
        null,
        'This assumes setting a key leaves an existing value alone. In fact the value is overwritten.',
        'This forgets the step that reduces `pen` by 1.',
      ],
      keyIdea: 'For a sequence of map updates, rewrite the whole map after each change in a table. Setting replaces or adds, removing deletes the pair, and "reduce" works from the current value.',
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
      asking: 'After the changes, how many keys does a search check on average when the key is not there?',
      solution:
        '**Chaining** means each bucket (slot) holds a list, called a **chain**, of the keys that landed there. To search, the computer works out the bucket and checks only that chain.\n\n' +
        'In an **unsuccessful search**, the key is not in the table. So every key in the chain has to be checked before giving up, and the cost is the length of the chain.\n\n' +
        'With keys spread evenly, the average chain length is the **load factor**: $\\frac{\\text{number of keys}}{\\text{number of buckets}}$.\n\n' +
        'Find the numbers after the changes. Keys: $600 + 400 = 1000$. Buckets: 500, because the table was resized. The old 200 buckets no longer apply.\n\n' +
        'Substitute: $\\frac{1000}{500} = 2$.',
      conclusion: 'Each chain holds 2 keys on average, and an unsuccessful search checks them all, so the answer is $2$.',
      whyWrong: [
        'This uses the new number of keys with the old number of buckets: $\\frac{1000}{200} = 5$. The table was resized to 500 buckets before the search.',
        null,
        '$O(1)$ means the work does not grow with $n$; it does not mean exactly one key is checked. Here each chain holds 2 keys on average.',
        'This is the cost of an unsuccessful search through a plain list, where all $1000$ keys must be checked. A hash table only searches the one bucket that the key hashes to.',
      ],
      keyIdea: 'For chained hash tables, an unsuccessful search checks a whole chain, whose average length is keys divided by buckets. Update the numbers of keys and buckets first, and only then divide.',
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
      asking: 'How many values are in exactly one of the sets $A$ and $B$?',
      solution:
        '$A \\cup B$ (the **union**) is everything in $A$ or $B$, with no repeats: $\\{2, 4, 6, 8, 10\\}$.\n\n' +
        '$A \\cap B$ (the **intersection**) is only what is in both sets: $\\{4, 8\\}$.\n\n' +
        '$\\setminus$ means "take away". So remove 4 and 8 from the union: $\\{2, 4, 6, 8, 10\\} \\setminus \\{4, 8\\} = \\{2, 6, 10\\}$. Counting those gives 3.',
      conclusion: 'What is left is $\\{2, 6, 10\\}$, which has 3 elements.',
      whyWrong: [
        null,
        'This is the size of the union alone. The shared elements must then be removed.',
        'This is the size of the intersection, which is the part being removed.',
        'This adds the two sizes, $4 + 3$. That counts the shared elements twice and never removes them.',
      ],
      keyIdea: 'Work out each bracket first, then apply the operation between them. This expression is the **symmetric difference**: values in exactly one set. For its size, add the two sizes and subtract twice the overlap: $4 + 3 - 2 \\times 2$.',
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
      asking: 'How long can a lookup take when every key is in the same bucket?',
      solution:
        'In a **chained hash table**, each bucket holds a list, called a **chain**, of the keys that landed there. A lookup finds the bucket, then checks that chain one key at a time.\n\n' +
        'Here all $n$ keys land in one bucket, so that chain holds all $n$ keys. If the key is at the end or missing, the lookup checks every one of them.\n\n' +
        'That is $n$ checks, so the time grows in step with $n$, which is written $O(n)$.',
      conclusion: 'A worst-case lookup has to go through all $n$ keys, so it takes $O(n)$.',
      whyWrong: [
        null,
        'This is the average case with keys spread evenly. Here they all share one chain.',
        'This would need the chain to be sorted and searched by halving. A chain is checked one key at a time.',
        'One lookup goes along one chain once, so it cannot need $n^2$ steps.',
      ],
      keyIdea: 'To get a hash table\'s lookup time, ask how long the chain is. Keys spread evenly: short chains and $O(1)$ on average. All in one bucket: a plain list of $n$ keys and $O(n)$.',
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
      asking: 'Does this `while` loop ever finish?',
      solution:
        '`length(A)` is 3, so line 4 reads `while (i <= 3)`. The loop keeps going as long as `i` is 3 or less.\n\n' +
        'The only line inside the loop is line 5. It changes `C`, but not `i`. There is no `i = i + 1`, so `i` stays at 1.\n\n' +
        'Trace a few passes. `A[i]` is always `A[1]`, which is 1, so line 5 keeps adding 1 to `C[1]`:\n\n| Pass | `i` | `i <= 3`? | `C[1]` | `C[2]` |\n|---|---|---|---|---|\n| 1 | 1 | yes | 1 | 0 |\n| 2 | 1 | yes | 2 | 0 |\n| 3 | 1 | yes | 3 | 0 |\n| 4 | 1 | yes | 4 | 0 |\n\n' +
        '$1 \\le 3$ is always true, so the condition can never become false. The loop runs forever, and line 7 is never reached.',
      conclusion: '`i` never changes, so `i <= 3` stays true and the answer is Infinite loop.',
      whyWrong: [
        'This is the correct count if the loop had `i = i + 1`. Without it, the loop never moves past the first element.',
        'This counts each distinct value once. The loop never reaches the later elements at all.',
        'This swaps the two counts, and it also assumes the loop finishes. `i` never changes.',
        null,
      ],
      keyIdea: 'Before tracing a `while` loop, check that its body changes the variable in the condition. If no line does and the condition starts true, the loop never ends. A `for` loop counts by itself, but a `while` loop does not.',
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
      asking: 'On average, how does the time to remove duplicates grow with the number of values?',
      solution:
        'The method goes through the $n$ values one at a time. For each value, it tests whether the value is in the set of values seen so far. If not, it adds the value and keeps it.\n\n' +
        'In a **hash-based set**, testing and adding each take $O(1)$ on average: a fixed amount of work, however big the set is.\n\n' +
        'So each value costs the same fixed amount of work. There are $n$ values, so the total is $n \\times O(1) = O(n)$.',
      conclusion: 'A fixed amount of work for each of $n$ values gives $O(n)$ on average.',
      whyWrong: [
        null,
        'This is the time with no set at all, comparing each value with all the earlier ones.',
        'This is the time for one membership test. There are $n$ values to process.',
        'This forgets that every value must be looked at, which alone takes at least $n$ steps.',
      ],
      keyIdea: 'For a loop\'s running time, multiply the number of passes by the cost of one pass. Here $n$ passes at $O(1)$ give $O(n)$. With a plain list, each check costs $O(n)$, giving $O(n^2)$.',
    },
  },
];
