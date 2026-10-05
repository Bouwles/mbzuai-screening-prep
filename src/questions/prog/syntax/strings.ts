import type { StaticQuestion } from '../../../types';

/** Python slicing semantics s[start:stop:step], used to re-derive answers independently. */
function pySlice(s: string, start: number | null, stop: number | null, step = 1): string {
  const n = s.length;
  let out = '';
  if (step > 0) {
    let a = start === null ? 0 : start < 0 ? start + n : start;
    let b = stop === null ? n : stop < 0 ? stop + n : stop;
    a = Math.max(0, Math.min(n, a));
    b = Math.max(0, Math.min(n, b));
    for (let i = a; i < b; i += step) out += s[i];
  } else {
    let a = start === null ? n - 1 : start < 0 ? start + n : start;
    let b = stop === null ? -1 : stop < 0 ? stop + n : stop;
    a = Math.max(-1, Math.min(n - 1, a));
    b = Math.max(-1, Math.min(n - 1, b));
    for (let i = a; i > b; i += step) out += s[i];
  }
  return out;
}

/** Non-overlapping count, exactly like Python's str.count. */
function pyCount(s: string, sub: string): number {
  let c = 0;
  let i = 0;
  for (;;) {
    const j = s.indexOf(sub, i);
    if (j < 0) return c;
    c++;
    i = j + sub.length;
  }
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'strings-001',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "PYTHON"\nprint(s[0], s[-1])' },
    options: ['`Y N`', '`P O`', '`P N`', 'An `IndexError` is raised'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Write the indices under each character:\n\n' +
        '| character | P | Y | T | H | O | N |\n|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 |\n| negative index | -6 | -5 | -4 | -3 | -2 | -1 |\n\n' +
        '1. `s[0]` is the **first** character, because Python counts from 0: `P`.\n' +
        '2. `s[-1]` is the **last** character, because negative indices count back from the end: `N`.\n' +
        '3. `print` with two arguments puts one space between them.\n\n' +
        'Output: `P N`.',
      whyWrong: [
        'This mixes up index 0 and index 1: `Y` is `s[1]`, the **second** character. Python starts counting at 0, so `s[0]` is the first character, `P`.',
        'This treats `s[-1]` as the second-to-last character. In Python `-1` is the very last character, `-2` is the one before it.',
        null,
        'Negative indices are allowed in Python: they count from the end. An `IndexError` only happens when the index is outside the range -6 to 5 here.',
      ],
      keyIdea: 'Indices start at 0 for the first character, and -1 always means the last character.',
    },
    check: {
      optionValues: ['Y N', 'P O', 'P N', null],
      compute: () => {
        const s = 'PYTHON';
        return `${s[0]} ${s[s.length - 1]}`;
      },
    },
    python: { stdout: 'P N\n' },
  },
  {
    id: 'strings-002',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'The string below has **two** spaces at the start and **two** spaces at the end. What does the code print?',
    code: { lang: 'python', source: 's = "  Hello World  "\nprint(len(s), len(s.strip()))' },
    options: ['`15 10`', '`15 13`', '`15 11`', '`11 11`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. Count every character of `s`, spaces included: 2 spaces + `Hello` (5) + 1 space + `World` (5) + 2 spaces $= 15$.\n' +
        '2. `s.strip()` removes whitespace from the **two ends only**, giving `"Hello World"`. The space in the middle stays.\n' +
        '3. `len("Hello World")` $= 5 + 1 + 5 = 11$.\n\n' +
        'Output: `15 11`.',
      whyWrong: [
        'This assumes `strip()` removes **every** space, including the one between the words. It only removes spaces at the start and the end.',
        'This removes the spaces from only one end (that is what `lstrip()` or `rstrip()` do). `strip()` cleans both ends.',
        null,
        'This leaves out the spaces at the two ends when working out `len(s)`, as if `s` had already been stripped. `strip()` returns a new string and does not change `s`, and `len` counts every character, so `len(s)` is still 15.',
      ],
      keyIdea: '`len` counts every character including spaces, and `strip()` removes whitespace only from the two ends.',
    },
    check: {
      optionValues: ['15 10', '15 13', '15 11', '11 11'],
      compute: () => {
        const s = '  Hello World  ';
        return `${s.length} ${s.trim().length}`;
      },
    },
    python: { stdout: '15 11\n' },
  },
  {
    id: 'strings-003',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print("ab" * 3 + "c")' },
    options: ['`abcabcabc`', '`abababc`', '`aaabbbc`', 'A `TypeError` is raised'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Just like in maths, `*` is done before `+`.\n\n' +
        '1. `"ab" * 3` repeats the whole string 3 times: `"ababab"`.\n' +
        '2. `"ababab" + "c"` joins (concatenates) the two strings: `"abababc"`.\n\n' +
        'Output: `abababc`.',
      whyWrong: [
        'This does the `+` first, as if it were `("ab" + "c") * 3`. Multiplication happens before addition, so only `"ab"` is repeated.',
        null,
        'This repeats each character in place. String repetition copies the **whole** string end to end: `"ab" * 3` is `"ababab"`.',
        'Multiplying a string by an integer is allowed in Python: it repeats the string. A `TypeError` only happens for things like `"ab" + 3` or `"ab" * "3"`.',
      ],
      keyIdea: '`+` joins strings and `str * int` repeats the whole string, with `*` evaluated before `+`.',
    },
    check: {
      optionValues: ['abcabcabc', 'abababc', 'aaabbbc', null],
      compute: () => 'ab'.repeat(3) + 'c',
    },
    python: { stdout: 'abababc\n' },
  },
  {
    id: 'strings-004',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What happens when this Python code runs?',
    code: { lang: 'python', source: 's = "cat"\ns[0] = "b"\nprint(s)' },
    options: ['It prints `bat`', 'It prints `bcat`', 'It prints `cat`', 'A `TypeError` is raised'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Strings in Python are **immutable**: once a string is made, its characters cannot be changed.\n\n' +
        '1. `s = "cat"` creates the string.\n' +
        '2. `s[0] = "b"` tries to change the first character in place. Python refuses: *TypeError: \'str\' object does not support item assignment*.\n' +
        '3. The program stops, so `print(s)` never runs.\n\n' +
        'To get `"bat"` you must build a **new** string, for example `s = "b" + s[1:]`.',
      whyWrong: [
        'This would be right for a **list** (lists are mutable). Strings are immutable, so item assignment is an error.',
        'Assignment to an index never inserts characters, even for lists. For a string it is an error anyway.',
        'Python does not silently ignore the assignment: it raises an error and stops before the `print` line.',
        null,
      ],
      keyIdea: 'Strings are immutable: you cannot assign to `s[i]`, you must build a new string instead.',
    },
    python: { error: 'TypeError' },
  },
  {
    id: 'strings-005',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'word = "banana"\nprint(word.count("a"))' },
    options: ['`3`', '`6`', '`1`', '`5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`word.count("a")` returns **how many times** `"a"` appears in the string.\n\n' +
        '| character | b | a | n | a | n | a |\n|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 |\n\n' +
        'The letter `a` appears at indices 1, 3 and 5, which is 3 times.\n\n' +
        'Output: `3`.',
      whyWrong: [
        null,
        'This is `len(word)`, the total number of characters. `count` only counts the matching ones.',
        'This is `word.find("a")`, the index of the **first** `a`. `count` gives how many there are, not where the first one is.',
        'This is the index of the **last** `a`. `count` returns a number of occurrences, not a position.',
      ],
      keyIdea: '`s.count(x)` returns how many times `x` occurs, while `s.find(x)` returns where it first occurs.',
    },
    check: {
      optionValues: [3, 6, 1, 5],
      compute: () => pyCount('banana', 'a'),
    },
    python: { stdout: '3\n' },
  },
  // ------------------------------------------------------------------ exam
  {
    id: 'strings-006',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "COMPUTER"\nprint(s[2:5])' },
    options: ['`MPUT`', '`OMP`', '`OMPU`', '`MPU`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '| character | C | O | M | P | U | T | E | R |\n|---|---|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n\n' +
        '1. A slice `s[start:stop]` starts **at** `start` and stops **before** `stop`.\n' +
        '2. So `s[2:5]` takes indices 2, 3, 4 (not 5).\n' +
        '3. Those characters are `M`, `P`, `U`.\n\n' +
        'Check: the slice length is $5 - 2 = 3$ characters.\n\n' +
        'Output: `MPU`.',
      whyWrong: [
        'This includes the character at index 5. The stop index is **excluded**, so the slice ends at index 4.',
        'This counts positions from 1 (2nd, 3rd and 4th letters). Python counts from 0, so index 2 is `M`, the third letter.',
        'This counts from 1 **and** includes the stop position. Both are wrong: start at index 2 (`M`) and stop before index 5.',
        null,
      ],
      keyIdea: '`s[a:b]` gives the characters at indices `a` up to `b - 1`, so it has `b - a` characters.',
    },
    check: {
      optionValues: ['MPUT', 'OMP', 'OMPU', 'MPU'],
      compute: () => pySlice('COMPUTER', 2, 5),
    },
    python: { stdout: 'MPU\n' },
  },
  {
    id: 'strings-007',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "ALGORITHM"\nprint(s[-4:-1])' },
    options: ['`ITH`', '`ITHM`', '`HTI`', '`RIT`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '| character | A | L | G | O | R | I | T | H | M |\n|---|---|---|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n| negative index | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 |\n\n' +
        '1. `-4` is the 4th character from the end: `I` (the same as index $9 - 4 = 5$).\n' +
        '2. `-1` is the last character `M` (index 8), and the stop index is **excluded**.\n' +
        '3. So the slice is indices 5, 6, 7: `I`, `T`, `H`. The step is still $+1$, so it reads left to right.\n\n' +
        'Output: `ITH`.',
      whyWrong: [
        null,
        'This includes the character at the stop index `-1`. The stop is always excluded, even when it is negative. To include the end you would write `s[-4:]`.',
        'This reads the characters backwards because the indices are negative. Negative indices only say **where** to start and stop; the direction is set by the step, which is $+1$ here.',
        'This counts the negative indices one place off, as if `-1` were the second-to-last letter `H`. In Python `-1` is the last letter, so `-4` is `I`.',
      ],
      keyIdea: 'A negative index `-k` means index `len(s) - k`, and the stop of a slice is excluded whether it is positive or negative.',
    },
    check: {
      optionValues: ['ITH', 'ITHM', 'HTI', 'RIT'],
      compute: () => pySlice('ALGORITHM', -4, -1),
    },
    python: { stdout: 'ITH\n' },
  },
  {
    id: 'strings-008',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "abcdefghij"\nprint(s[2:8:3])' },
    options: ['`cfi`', '`cf`', '`be`', '`cg`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| character | a | b | c | d | e | f | g | h | i | j |\n|---|---|---|---|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |\n\n' +
        '`s[2:8:3]` means: start at index 2, jump 3 each time, and stop **before** index 8.\n\n' +
        '1. Index 2: `c`.\n' +
        '2. Index $2 + 3 = 5$: `f`.\n' +
        '3. Index $5 + 3 = 8$: this is the stop index, which is excluded, so we stop.\n\n' +
        'Output: `cf`.',
      whyWrong: [
        'This includes index 8 (`i`). The stop index is excluded, so the slice ends before reaching it.',
        null,
        'This counts positions from 1 (the 2nd and 5th letters). Python indexes from 0, so index 2 is `c`.',
        'This treats a step of 3 as "skip 3 letters" (jumping 4 each time, to index 6). A step of 3 means add 3 to the index each time: 2, 5, 8, ...',
      ],
      keyIdea: 'In `s[a:b:k]` the indices are `a`, `a + k`, `a + 2*k`, ... as long as they stay below `b`.',
    },
    check: {
      optionValues: ['cfi', 'cf', 'be', 'cg'],
      compute: () => pySlice('abcdefghij', 2, 8, 3),
    },
    python: { stdout: 'cf\n' },
  },
  {
    id: 'strings-009',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "PROGRAM"\nprint(s[::-2])' },
    options: ['`MROP`', '`PORM`', '`MARGORP`', '`MRO`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '| character | P | R | O | G | R | A | M |\n|---|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 |\n\n' +
        'With a **negative** step and no start or stop, the slice starts at the **last** character and runs all the way to the first.\n\n' +
        '1. Start at index 6: `M`.\n' +
        '2. Index $6 - 2 = 4$: `R`.\n' +
        '3. Index $4 - 2 = 2$: `O`.\n' +
        '4. Index $2 - 2 = 0$: `P`. Going further would pass the beginning, so we stop.\n\n' +
        'Output: `MROP`.',
      whyWrong: [
        null,
        'This takes every second character going **forwards** (that is `s[::2]`). The minus sign makes the slice start at the end and move backwards.',
        'This is the full reverse `s[::-1]`. It ignores the step size of 2, which skips every other character.',
        'This stops before index 0, as if the start of the string were an excluded stop. With the stop left out, a backwards slice goes all the way to and including index 0.',
      ],
      keyIdea: 'A negative step walks backwards from the end: `s[::-1]` reverses a string and `s[::-2]` takes every second character from the end.',
    },
    check: {
      optionValues: ['MROP', 'PORM', 'MARGORP', 'MRO'],
      compute: () => pySlice('PROGRAM', null, null, -2),
    },
    python: { stdout: 'MROP\n' },
  },
  {
    id: 'strings-010',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'text = "red,green,,blue"\nprint(text.split(","))' },
    options: ["`['red', 'green', 'blue']`", "`['red,green,,blue']`", "`['red', 'green', None, 'blue']`", "`['red', 'green', '', 'blue']`"],
    correctIndex: 3,
    markScheme: {
      solution:
        '`split(",")` cuts the string at **every** comma and returns a list of the pieces between them.\n\n' +
        '1. Before the 1st comma: `red`.\n' +
        '2. Between the 1st and 2nd commas: `green`.\n' +
        '3. Between the 2nd and 3rd commas there is **nothing**, so that piece is the empty string `\'\'`.\n' +
        '4. After the 3rd comma: `blue`.\n\n' +
        '3 commas always give $3 + 1 = 4$ pieces.\n\n' +
        "Output: `['red', 'green', '', 'blue']`.",
      whyWrong: [
        'This drops the empty piece. Only `split()` with **no** argument throws empty pieces away; `split(",")` keeps one piece between every pair of commas.',
        'This assumes `split` always cuts at spaces. Here the separator `","` is given, so the string is cut at the commas.',
        'The piece between two commas is a string with no characters, written `\'\'`. It is not `None`: `split` always returns a list of strings.',
        null,
      ],
      keyIdea: '`s.split(sep)` cuts at every separator, so `k` separators give `k + 1` pieces, including empty strings between adjacent separators.',
    },
    check: {
      optionValues: ["['red', 'green', 'blue']", "['red,green,,blue']", "['red', 'green', None, 'blue']", "['red', 'green', '', 'blue']"],
      compute: () => `[${'red,green,,blue'.split(',').map((p) => `'${p}'`).join(', ')}]`,
    },
    python: { stdout: "['red', 'green', '', 'blue']\n" },
  },
  {
    id: 'strings-011',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print("-".join("abc"))' },
    options: ['`a-b-c-`', '`a-b-c`', '`abc`', '`-a-b-c-`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`sep.join(items)` glues the items together with `sep` placed **between** neighbouring items.\n\n' +
        '1. A string is a sequence of characters, so the items here are `"a"`, `"b"`, `"c"`.\n' +
        '2. Put `"-"` between each neighbouring pair: `a` + `-` + `b` + `-` + `c`.\n' +
        '3. No separator goes before the first item or after the last.\n\n' +
        'Output: `a-b-c`.',
      whyWrong: [
        'This puts the separator after **every** item. `join` only puts it between items, so 3 items get 2 separators.',
        null,
        'This treats `"abc"` as one single item. `join` loops over the string, which gives its characters one by one.',
        'This adds separators at both ends as well. `join` never adds a separator before the first item or after the last one.',
      ],
      keyIdea: '`sep.join(seq)` puts `sep` between the items only, so `n` items get `n - 1` separators.',
    },
    check: {
      optionValues: ['a-b-c-', 'a-b-c', 'abc', '-a-b-c-'],
      compute: () => Array.from('abc').join('-'),
    },
    python: { stdout: 'a-b-c\n' },
  },
  {
    id: 'strings-012',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "banana"\nt = s.replace("a", "o")\nprint(s, t)' },
    options: ['`banana bonono`', '`bonono bonono`', '`banana bonana`', '`banana None`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. `s.replace("a", "o")` builds a **new** string in which **every** `a` becomes `o`: `"bonono"`.\n' +
        '2. That new string is stored in `t`. Strings are immutable, so `s` itself is unchanged: still `"banana"`.\n' +
        '3. `print(s, t)` prints both, separated by a space.\n\n' +
        'Output: `banana bonono`.',
      whyWrong: [
        null,
        'This assumes `replace` changes `s` itself. Strings are immutable: `replace` returns a new string and leaves `s` alone.',
        'This replaces only the first `a`. Without a third argument, `replace` changes **every** occurrence.',
        'This mixes strings up with list methods such as `sort()`, which change the list and return `None`. String methods return a new string.',
      ],
      keyIdea: 'String methods never change the original string; they return a new one, which you must store if you want to keep it.',
    },
    check: {
      optionValues: ['banana bonono', 'bonono bonono', 'banana bonana', 'banana None'],
      compute: () => {
        const s = 'banana';
        return `${s} ${s.split('a').join('o')}`;
      },
    },
    python: { stdout: 'banana bonono\n' },
  },
  {
    id: 'strings-013',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "programming"\nprint(s.find("g"), s.find("z"))' },
    options: ['`3 -1`', '`4 -1`', '`10 -1`', 'A `ValueError` is raised'],
    correctIndex: 0,
    markScheme: {
      solution:
        '| character | p | r | o | g | r | a | m | m | i | n | g |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n\n' +
        '1. `s.find("g")` returns the index of the **first** `g`. There are `g`s at 3 and 10; the first is at index 3.\n' +
        '2. `s.find("z")`: there is no `z`, and `find` returns `-1` when the text is not found (it does not crash).\n\n' +
        'Output: `3 -1`.',
      whyWrong: [
        null,
        'This counts positions from 1 (`g` is the 4th letter). Python indexes from 0, so the first `g` is at index 3.',
        'This is the index of the **last** `g` (what `rfind` returns). `find` searches from the left and stops at the first match.',
        'This confuses `find` with `index`. `s.index("z")` would raise a `ValueError`, but `find` simply returns `-1`.',
      ],
      keyIdea: '`s.find(x)` returns the index of the first match, or `-1` if there is no match.',
    },
    check: {
      optionValues: ['3 -1', '4 -1', '10 -1', null],
      compute: () => {
        const s = 'programming';
        return `${s.indexOf('g')} ${s.indexOf('z')}`;
      },
    },
    python: { stdout: '3 -1\n' },
  },
  {
    id: 'strings-014',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'name = "Sara"\nscore = 18\ntotal = 24\nprint(f"{name} scored {score / total * 100}%")' },
    options: ['`Sara scored 75%`', '`Sara scored 75.0%`', '`{name} scored {score / total * 100}%`', '`name scored 75.0%`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'In an **f-string** (a string with `f` before the opening quote), each `{...}` is replaced by the value of the expression inside it.\n\n' +
        '1. `{name}` becomes `Sara`.\n' +
        '2. `{score / total * 100}`: `/` always gives a **float**, so $18 \\div 24 = 0.75$, then $0.75 \\times 100 = 75.0$. It is shown as `75.0`.\n' +
        '3. The `%` is ordinary text, so it is printed as it is.\n\n' +
        'Output: `Sara scored 75.0%`.',
      whyWrong: [
        'This forgets that `/` always produces a float, even when the answer is a whole number. A float is displayed with `.0`, so it shows `75.0`.',
        null,
        'This ignores the `f` in front of the string. With the `f`, every `{...}` is evaluated and replaced by its value.',
        'Inside the braces `name` is a **variable**, so its value `Sara` is inserted, not the word `name`.',
      ],
      keyIdea: 'f-strings replace each `{expression}` with its value, and `/` always returns a float (so `75.0`, not `75`).',
    },
    check: {
      optionValues: ['Sara scored 75%', 'Sara scored 75.0%', null, 'name scored 75.0%'],
      compute: () => {
        const v = (18 / 24) * 100;
        return `Sara scored ${Number.isInteger(v) ? v.toFixed(1) : String(v)}%`;
      },
    },
    python: { stdout: 'Sara scored 75.0%\n' },
  },
  {
    id: 'strings-015',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 's = "Artificial Intelligence"\ncount = 0\nfor ch in s:\n    if ch in "aeiou":\n        count += 1\nprint(count)',
    },
    options: ['`10`', '`3`', '`8`', '`23`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The loop visits every character of `s` one at a time and adds 1 whenever the character is one of the **lowercase** letters in `"aeiou"`.\n\n' +
        '| word | vowels that are lowercase | count |\n|---|---|---|\n| `Artificial` | i, i, i, a (the capital `A` does not match) | 4 |\n| `Intelligence` | e, i, e, e (the capital `I` does not match) | 4 |\n\n' +
        'The space matches nothing. Total: $4 + 4 = 8$.\n\n' +
        'Output: `8`.',
      whyWrong: [
        'This also counts the capital `A` and `I`. `"A" in "aeiou"` is `False`, because Python treats upper and lower case as different characters.',
        'This counts the **different** vowels (a, e, i). The loop adds 1 for every matching character, so repeated vowels count each time.',
        null,
        'This is `len(s)`, the number of characters. The `if` only adds 1 for lowercase vowels.',
      ],
      keyIdea: 'A for loop over a string visits each character in turn, and comparisons are case-sensitive.',
    },
    check: {
      optionValues: [10, 3, 8, 23],
      compute: () => {
        let c = 0;
        for (const ch of 'Artificial Intelligence') if ('aeiou'.includes(ch)) c++;
        return c;
      },
    },
    python: { stdout: '8\n' },
  },
  {
    id: 'strings-016',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'word = "PyThOn"\na = word.upper()\nb = word.lower()\nprint(a == "PYTHON", b == "Python", word == "PyThOn")',
    },
    options: ['`True True True`', '`True False False`', '`True True False`', '`True False True`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. `word.upper()` returns a new string with every letter in capitals: `a = "PYTHON"`. So `a == "PYTHON"` is `True`.\n' +
        '2. `word.lower()` returns a new string with every letter in lower case: `b = "python"`. Comparison is case-sensitive, and `"python"` is not `"Python"`, so this is `False`.\n' +
        '3. Strings are immutable, so `word` is still `"PyThOn"` and `word == "PyThOn"` is `True`.\n\n' +
        'Output: `True False True`.',
      whyWrong: [
        'This assumes `lower()` keeps a capital first letter, or that `==` ignores case. `lower()` makes every letter small, and `==` is case-sensitive.',
        'This assumes `upper()` and `lower()` changed `word` itself. They return new strings; `word` keeps its original value.',
        'This makes both mistakes: it treats `"python"` and `"Python"` as equal and thinks `word` was changed by the method calls.',
        null,
      ],
      keyIdea: '`upper()` and `lower()` return new strings (the original is unchanged), and string comparison is case-sensitive.',
    },
    check: {
      optionValues: ['True True True', 'True False False', 'True True False', 'True False True'],
      compute: () => {
        const word = 'PyThOn';
        const a = word.toUpperCase();
        const b = word.toLowerCase();
        const py = (x: boolean) => (x ? 'True' : 'False');
        return `${py(a === 'PYTHON')} ${py(b === 'Python')} ${py(word === 'PyThOn')}`;
      },
    },
    python: { stdout: 'True False True\n' },
  },
  // ------------------------------------------------------------------ challenge
  {
    id: 'strings-017',
    subtopic: 'strings',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 's = "MACHINE"\nprint(s[5:1:-1])' },
    options: ['`NIHCA`', 'Nothing visible: it prints an empty line', '`CHIN`', '`NIHC`'],
    correctIndex: 3,
    markScheme: {
      solution:
        '| character | M | A | C | H | I | N | E |\n|---|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 |\n\n' +
        'The step is $-1$, so the slice starts at index 5 and moves **left**, stopping **before** index 1.\n\n' +
        '| index visited | 5 | 4 | 3 | 2 |\n|---|---|---|---|---|\n| character | N | I | H | C |\n\n' +
        'Index 1 is the stop, so `A` is excluded.\n\n' +
        'Output: `NIHC`.',
      whyWrong: [
        'This includes the character at the stop index 1 (`A`). The stop is excluded in backwards slices too.',
        'This assumes the start must be smaller than the stop. That is only true for a positive step; with step $-1$ a start of 5 and stop of 1 is exactly right.',
        'This takes the right characters but reads them forwards. A step of $-1$ produces them in the order visited: 5, 4, 3, 2.',
        null,
      ],
      keyIdea: 'With a negative step the slice walks from start down towards stop, still excluding the stop index.',
    },
    check: {
      optionValues: ['NIHCA', null, 'CHIN', 'NIHC'],
      compute: () => pySlice('MACHINE', 5, 1, -1),
    },
    python: { stdout: 'NIHC\n' },
  },
  {
    id: 'strings-018',
    subtopic: 'strings',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 's = "python"\nout = ""\nfor i in range(len(s)):\n    if i % 2 == 0:\n        out = s[i] + out\n    else:\n        out = out + s[i]\nprint(out)',
    },
    options: ['`nhypto`', '`otpyhn`', '`ptoyhn`', '`nohtyp`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Even indices are put at the **front** of `out`; odd indices are added at the **back**.\n\n' +
        '| `i` | `s[i]` | even? | `out` after this step |\n|---|---|---|---|\n' +
        '| 0 | p | yes, front | `p` |\n| 1 | y | no, back | `py` |\n| 2 | t | yes, front | `tpy` |\n| 3 | h | no, back | `tpyh` |\n| 4 | o | yes, front | `otpyh` |\n| 5 | n | no, back | `otpyhn` |\n\n' +
        'Output: `otpyhn`.',
      whyWrong: [
        'This swaps the two branches (even characters added at the back, odd at the front). Check the condition: `i % 2 == 0` is true for even `i`, and that branch puts `s[i]` **before** `out`.',
        null,
        'This puts the even characters at the front but keeps them in their original order (`p t o`). Each new even character goes in front of the previous ones, so they come out reversed: `o t p`.',
        'This puts **every** character at the front, which reverses the whole word. Only the even-index characters are put at the front.',
      ],
      keyIdea: '`ch + out` puts the new character at the front (building in reverse), while `out + ch` adds it at the end.',
    },
    check: {
      optionValues: ['nhypto', 'otpyhn', 'ptoyhn', 'nohtyp'],
      compute: () => {
        const s = 'python';
        let out = '';
        for (let i = 0; i < s.length; i++) out = i % 2 === 0 ? s[i] + out : out + s[i];
        return out;
      },
    },
    python: { stdout: 'otpyhn\n' },
  },
  {
    id: 'strings-019',
    subtopic: 'strings',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'price = 7.456\nqty = 3\nprint(f"{qty} x {price:.2f} = {qty * price:.2f}")' },
    options: ['`3 x 7.46 = 22.37`', '`3 x 7.46 = 22.38`', '`3 x 7.456 = 22.368`', '`3 x 7.45 = 22.36`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The format spec `:.2f` **displays** a number rounded to 2 decimal places. It does not change the variable.\n\n' +
        '1. `{qty}` gives `3`. The `x` is ordinary text.\n' +
        '2. `{price:.2f}`: $7.456$ rounded to 2 d.p. is `7.46`.\n' +
        '3. `{qty * price:.2f}`: Python first works out the exact product $3 \\times 7.456 = 22.368$, **then** rounds it for display: `22.37`.\n\n' +
        'Output: `3 x 7.46 = 22.37`.',
      whyWrong: [
        null,
        'This multiplies the already-rounded price: $3 \\times 7.46 = 22.38$. The expression `qty * price` uses the real value $7.456$; rounding only happens when it is displayed.',
        'This ignores the `:.2f` format specs, which round each value to 2 decimal places for display.',
        'This chops off (truncates) the extra digits instead of rounding. `:.2f` rounds, so $7.456$ becomes $7.46$ and $22.368$ becomes $22.37$.',
      ],
      keyIdea: 'In an f-string, `{x:.2f}` rounds `x` to 2 decimal places for display only; calculations use the full value.',
    },
    check: {
      optionValues: ['3 x 7.46 = 22.37', '3 x 7.46 = 22.38', '3 x 7.456 = 22.368', '3 x 7.45 = 22.36'],
      compute: () => {
        const price = 7.456;
        const qty = 3;
        return `${qty} x ${price.toFixed(2)} = ${(qty * price).toFixed(2)}`;
      },
    },
    python: { stdout: '3 x 7.46 = 22.37\n' },
  },
  {
    id: 'strings-020',
    subtopic: 'strings',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print("banana".count("ana"), "aaaa".count("aa"))' },
    options: ['`2 3`', '`3 4`', '`1 2`', '`1 3`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`count` scans from left to right and counts **non-overlapping** matches: after a match it carries on searching from the end of that match.\n\n' +
        '1. `"banana"`: `ana` is found at indices 1 to 3. The search restarts at index 4, where only `na` is left, so no more matches. Count: 1.\n' +
        '2. `"aaaa"`: `aa` is found at indices 0 to 1. The search restarts at index 2 and finds `aa` at indices 2 to 3. Count: 2.\n\n' +
        'Output: `1 2`.',
      whyWrong: [
        'This counts **overlapping** matches (`ana` starting at 1 and at 3; `aa` starting at 0, 1 and 2). `count` never re-uses characters from a match it has already counted.',
        'This counts just the letter `a` in each string. `count` looks for the whole substring (`"ana"` or `"aa"`), not its first letter.',
        null,
        'This counts `"banana"` correctly but slides one place at a time through `"aaaa"`, giving 3 overlapping matches. `count` jumps past each match, so there are only 2.',
      ],
      keyIdea: '`s.count(sub)` counts non-overlapping occurrences, restarting the search after the end of each match.',
    },
    check: {
      optionValues: ['2 3', '3 4', '1 2', '1 3'],
      compute: () => `${pyCount('banana', 'ana')} ${pyCount('aaaa', 'aa')}`,
    },
    python: { stdout: '1 2\n' },
  },
  {
    id: 'strings-021',
    subtopic: 'strings',
    difficulty: 'challenge',
    stem: 'What does this Python code print? (The string contains extra spaces at the start, the end and between words.)',
    code: {
      lang: 'python',
      source: 's = "  Data   Science  is fun "\nwords = s.split()\nprint("_".join(words[::-1]), len(words))',
    },
    options: ['`Data_Science_is_fun 4`', '`fun_is_Science_Data 4`', '`nuf_si_ecneicS_ataD 4`', '`fun_is_Science_Data_ 4`'],
    correctIndex: 1,
    markScheme: {
      solution:
        "1. `s.split()` with **no argument** splits on any run of whitespace and ignores spaces at the ends: `words = ['Data', 'Science', 'is', 'fun']`.\n" +
        "2. `words[::-1]` reverses the **list** (the order of the words, not the letters): `['fun', 'is', 'Science', 'Data']`.\n" +
        '3. `"_".join(...)` puts `_` between neighbouring words: `fun_is_Science_Data`.\n' +
        '4. `len(words)` is the number of words: 4.\n' +
        '5. `print` separates its two values with a space.\n\n' +
        'Output: `fun_is_Science_Data 4`.',
      whyWrong: [
        'This forgets the `[::-1]`, which reverses the order of the list before joining.',
        null,
        'This reverses the letters of the whole sentence. `words` is a list, so `[::-1]` reverses the order of its items; each word keeps its own spelling.',
        'This puts the separator after every word. `join` only puts it **between** items, so there is no `_` at the end.',
      ],
      keyIdea: '`split()` with no argument gives the words with all extra spaces removed, and `[::-1]` on a list reverses the order of its items.',
    },
    check: {
      optionValues: ['Data_Science_is_fun 4', 'fun_is_Science_Data 4', 'nuf_si_ecneicS_ataD 4', 'fun_is_Science_Data_ 4'],
      compute: () => {
        const words = '  Data   Science  is fun '.split(/\s+/).filter((w) => w !== '');
        return `${words.slice().reverse().join('_')} ${words.length}`;
      },
    },
    python: { stdout: 'fun_is_Science_Data 4\n' },
  },
];
