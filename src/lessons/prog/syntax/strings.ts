import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'strings',
  know:
    '### What a string is\n\n' +
    'A **string** is a piece of text: a sequence of characters written between quotes, such as `"cat"` or `\'Data Science\'`. Single and double quotes do the same job. Every character counts, including **spaces**, digits and punctuation. The quotes themselves are **not** part of the string.\n\n' +
    '### Indexing: getting one character\n\n' +
    'Each character has a position number called its **index**. Python starts counting at **0**, so the first character is `s[0]`. You can also count from the end with **negative** indices: `s[-1]` is the last character, `s[-2]` the one before it.\n\n' +
    '| character | P | Y | T | H | O | N |\n|---|---|---|---|---|---|---|\n| index | 0 | 1 | 2 | 3 | 4 | 5 |\n| negative index | -6 | -5 | -4 | -3 | -2 | -1 |\n\n' +
    'For a string of length `n`, the last index is `n - 1`, and `s[-k]` is the same as `s[n - k]`. Asking for an index that does not exist (here `s[6]`) raises an `IndexError`.\n\n' +
    '**Exam habit:** whenever you see an index, write the word out with the index numbers underneath, like the table above. It takes 10 seconds and stops nearly every mistake.\n\n' +
    '### Slicing: getting a piece\n\n' +
    '`s[start:stop]` gives the characters from `start` up to but **not including** `stop`. So `"PYTHON"[1:4]` is `"YTH"` (indices 1, 2, 3), and the slice has `stop - start` characters.\n\n' +
    '- Leave out `start` to begin at the start: `s[:3]` is the first 3 characters.\n' +
    '- Leave out `stop` to go to the end: `s[2:]` is everything from index 2.\n' +
    '- Negative numbers work too: `s[-3:]` is the last 3 characters.\n' +
    '- Slices never crash: an out-of-range stop is simply cut down to the end of the string.\n\n' +
    'A third number is the **step**: `s[start:stop:step]` takes indices `start`, `start + step`, `start + 2*step`, ... while they are still before `stop`. So `"abcdefgh"[1:7:2]` takes indices 1, 3, 5, giving `"bdf"`.\n\n' +
    'A **negative step** walks backwards. With no start or stop given it begins at the last character and runs to the first, so `s[::-1]` is the string **reversed** and `s[::-2]` is every second character from the end. With numbers, the start must be on the right of the stop (otherwise you get an empty string): `"MACHINE"[5:1:-1]` visits 5, 4, 3, 2 and gives `"NIHC"`. The stop is still excluded.\n\n' +
    '### Length, joining and repeating\n\n' +
    '- `len(s)` is the number of characters (spaces included). `len("hi there")` is 8.\n' +
    '- `+` **concatenates** (joins) two strings: `"ab" + "cd"` is `"abcd"`. Both sides must be strings: `"age " + 5` is a `TypeError`, you need `"age " + str(5)`.\n' +
    '- `*` with a whole number **repeats** the whole string: `"ab" * 3` is `"ababab"`. As in maths, `*` happens before `+`.\n\n' +
    '### Strings are immutable\n\n' +
    'You cannot change a string in place. `s[0] = "b"` raises a `TypeError`. Every string method **returns a new string** and leaves the original alone, so `s.upper()` on its own line does nothing useful. You must store the result: `s = s.upper()`.\n\n' +
    '### The methods you must know\n\n' +
    '| method | what it returns | example |\n|---|---|---|\n' +
    '| `s.upper()` / `s.lower()` | new string in capitals / small letters | `"Hi".upper()` is `"HI"` |\n' +
    '| `s.strip()` | new string with spaces removed from **both ends only** | `"  a b  ".strip()` is `"a b"` |\n' +
    '| `s.split()` | list of words, splitting on any run of spaces | `"a  b c".split()` is `[\'a\', \'b\', \'c\']` |\n' +
    '| `s.split(",")` | list of pieces between **every** comma (empty pieces kept) | `"a,,b".split(",")` is `[\'a\', \'\', \'b\']` |\n' +
    '| `sep.join(items)` | the items glued together with `sep` **between** them | `"-".join(["a", "b"])` is `"a-b"` |\n' +
    '| `s.replace(old, new)` | new string with **every** `old` changed to `new` | `"aaa".replace("a", "b")` is `"bbb"` |\n' +
    '| `s.find(x)` | index of the **first** match, or `-1` if not found | `"hello".find("l")` is `2` |\n' +
    '| `s.count(x)` | number of **non-overlapping** matches | `"aaaa".count("aa")` is `2` |\n\n' +
    'The `in` operator checks whether one string appears inside another: `"ell" in "hello"` is `True`. Comparisons are **case-sensitive**: `"A" == "a"` is `False`, and `"A" in "aeiou"` is `False`.\n\n' +
    '### f-strings\n\n' +
    'Put `f` before the quotes and anything inside `{ }` is worked out and inserted: `f"{name} is {age + 1}"`. A format spec after a colon controls the display: `f"{x:.2f}"` shows `x` rounded to 2 decimal places. The rounding is only for display, the variable keeps its full value. Remember that `/` always gives a float, so `f"{10 / 2}"` shows `5.0`.\n\n' +
    '### Looping over a string\n\n' +
    '`for ch in s:` visits each character in order, from left to right. Use `for i in range(len(s)):` when you also need the index `i` (then the character is `s[i]`). Two building patterns appear constantly:\n\n' +
    '- `out = out + ch` adds each character at the **end** (copies the string).\n' +
    '- `out = ch + out` adds each character at the **front** (builds the string in reverse).',
  formulas: [
    { label: 'First and last character', tex: '\\texttt{s[0]}, \\quad \\texttt{s[-1]} = \\texttt{s[len(s) - 1]}', note: 'Indices start at 0; a negative index counts from the end.' },
    { label: 'Negative index', tex: '\\texttt{s[-k]} = \\texttt{s[n - k]} \\quad \\text{where } n = \\texttt{len(s)}' },
    { label: 'Slice length', tex: '\\texttt{len(s[a:b])} = b - a \\quad (0 \\le a \\le b \\le n)', note: 'The stop index b is always excluded.' },
    { label: 'Slice with a step', tex: '\\texttt{s[a:b:k]} \\to \\text{indices } a,\\ a + k,\\ a + 2k,\\ \\ldots \\text{ (all before } b\\text{)}' },
    { label: 'Reverse a string', tex: '\\texttt{s[::-1]}', note: 'A negative step starts at the last character and walks backwards to the first.' },
    { label: 'Concatenation and repetition', tex: '\\texttt{len(s + t)} = \\texttt{len(s)} + \\texttt{len(t)}, \\quad \\texttt{len(s * k)} = k \\times \\texttt{len(s)}' },
    { label: 'Splitting on a separator', tex: 'k \\text{ separators} \\Rightarrow k + 1 \\text{ pieces}', note: 'With split(",") empty pieces are kept; split() with no argument drops them.' },
    { label: 'Joining', tex: 'n \\text{ items} \\Rightarrow n - 1 \\text{ separators}', note: 'join puts the separator only between items, never at the ends.' },
    { label: 'find when missing', tex: '\\texttt{s.find(x)} = -1 \\text{ if x does not occur}', note: 's.index(x) would raise a ValueError instead.' },
  ],
  examples: [
    {
      title: 'Indexing and a simple slice',
      problem: 'With `s = "COMPUTER"`, what are `s[-2]` and `s[2:5]`?',
      steps: [
        'Write the indices: C=0, O=1, M=2, P=3, U=4, T=5, E=6, R=7. The length is 8.',
        '`s[-2]` is the second character from the end. As a positive index: $8 - 2 = 6$, which is `E`.',
        '`s[2:5]` starts at index 2 and stops **before** index 5, so it takes indices 2, 3, 4.',
        'Those characters are `M`, `P`, `U`. Check: $5 - 2 = 3$ characters.',
      ],
      answer: '`s[-2]` is `E` and `s[2:5]` is `MPU`.',
    },
    {
      title: 'A slice with a negative step',
      problem: 'What does `print("ALGORITHM"[7:2:-2])` print?',
      steps: [
        'Write the indices: A=0, L=1, G=2, O=3, R=4, I=5, T=6, H=7, M=8.',
        'The step is $-2$, so start at index 7 and subtract 2 each time: 7, 5, 3, and the next would be 1.',
        'The stop is index 2, which is excluded, and 1 is already past it, so we stop after 3.',
        'Indices 7, 5, 3 are `H`, `I`, `O`.',
      ],
      answer: '`HIO`',
    },
    {
      title: 'Methods return new strings',
      problem: 'What does this print?\n\n```\ns = "  data, science  "\ns.upper()\nt = s.strip().replace(",", "")\nprint(len(s), t)\n```',
      steps: [
        '`len(s)`: 2 spaces + `data,` (5) + 1 space + `science` (7) + 2 spaces $= 17$.',
        '`s.upper()` returns a new string, but nothing stores it, so `s` is unchanged.',
        '`s.strip()` removes the outer spaces: `"data, science"`.',
        '`.replace(",", "")` removes every comma: `"data science"`. That is stored in `t`.',
        '`print` puts a space between its two values.',
      ],
      answer: '`17 data science`',
    },
    {
      title: 'Exam level: a loop that builds a string',
      problem: 'What does this print?\n\n```\nword = "level up"\nout = ""\nfor ch in word:\n    if ch != " ":\n        out = ch + out\nprint(out, out == word[::-1])\n```',
      steps: [
        'The loop visits each character. Spaces are skipped; every other character is put at the **front** of `out`.',
        'After `l e v e l` the string `out` is `level` (each new letter goes in front, so it builds in reverse; this word reads the same both ways).',
        'The space is skipped. Then `u` gives `ulevel` and `p` gives `pulevel`.',
        '`word[::-1]` reverses the whole original string, space included: `pu level`.',
        '`"pulevel" == "pu level"` is `False`, because the space makes them different.',
      ],
      answer: '`pulevel False`',
    },
  ],
  traps: [
    '**Counting from 1.** The first character is `s[0]`, not `s[1]`. If your answer is "one letter too far to the left" (you picked the character just before the right one), this is why.',
    '**Including the stop index.** `s[2:5]` has only 3 characters (indices 2, 3, 4). The stop is excluded for negative indices and negative steps too.',
    '**Thinking methods change the string.** `s.upper()`, `s.replace(...)` and `s.strip()` return new strings. Unless the result is stored (`s = s.upper()`), `s` is unchanged. Trying `s[0] = "x"` raises a `TypeError`.',
    '**Forgetting that spaces are characters.** `len("hi there")` is 8, and a space takes up an index when you work out `find` results.',
    '**Mixing up `find`, `index` and `count`.** `find` gives the first position (or `-1`), `index` gives the first position but crashes with `ValueError` if missing, and `count` gives how many non-overlapping matches there are.',
    '**Case-sensitivity.** `"Python" == "python"` is `False`, and a capital `A` is not in `"aeiou"`.',
  ],
  examTip:
    'These questions are almost always "what does this code print?" with four outputs that differ by **one classic slip**: off-by-one indexing, including the stop index, reading in the wrong direction, or forgetting immutability. So:\n\n' +
    '1. Spend 10 seconds writing the string with index numbers underneath (and negative indices if the code uses them).\n' +
    '2. Check the **length** first: `s[a:b]` must have `b - a` characters, and a stepped slice `(b - a) / k` characters, rounded up. This often removes two options instantly.\n' +
    '3. Check the **first character** of each option: `s[a]` must be the first character of `s[a:b]` (or of `s[a:b:-1]`).\n' +
    '4. If a method is called but its result is not stored, the variable has **not** changed.\n' +
    '5. For loops that build strings, make a quick trace table with one row per loop pass.\n' +
    '6. An option saying "an error is raised" is right only for real errors: assigning to `s[i]`, `str + int`, an index out of range (slices never crash), or `index` on a missing substring.',
};
