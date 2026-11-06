import type { StaticQuestion } from '../../../types';

const L = (...lines: string[]) => lines.join('\n');

const INDEXED = 'What does this pseudocode print? Strings are indexed from 1.';
const INFINITE = 'Infinite loop';

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'strings-022',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What is a string?',
    options: ['A sequence of characters', 'A whole number', 'A true or false value', 'A list of numbers'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **string** is text: a sequence of characters such as letters, digits, spaces and punctuation, written in quotes. `"cat"` and `"7 up"` are both strings.',
      whyWrong: [
        null,
        'That is an integer. `"7"` in quotes is a string, while `7` is a number.',
        'That is a Boolean.',
        'That is an array of numbers. A string holds characters.',
      ],
      keyIdea: 'A string is a sequence of characters.',
    },
  },
  {
    id: 'strings-023',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What is joining two strings end to end called?',
    options: ['Concatenation', 'Indexing', 'Iteration', 'Assignment'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Concatenation** means joining strings end to end. In pseudocode it is written with `+`, so `"sun" + "day"` is `"sunday"`.',
      whyWrong: [
        null,
        'Indexing means picking out one character by its position, such as `s[1]`.',
        'Iteration means repeating, as a loop does.',
        'Assignment means storing a value in a variable.',
      ],
      keyIdea: 'Concatenation is joining strings, written with `+`.',
    },
  },
  {
    id: 'strings-024',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'If strings are indexed from 1, which expression gives the last character of `s`?',
    options: ['`s[length(s)]`', '`s[length(s) - 1]`', '`s[1]`', '`s[0]`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'With indexing from 1, the positions run from 1 to `length(s)`. So the last character is at position `length(s)`.\n\n' +
        'For `s = "CAT"`, `length(s)` is 3 and `s[3]` is `T`.',
      whyWrong: [
        null,
        'This is the last position when indexing from 0. When indexing from 1 it gives the second-to-last character.',
        'This is the first character.',
        'Position 0 does not exist when indexing from 1.',
      ],
      keyIdea: 'Indexed from 1, a string of length $n$ has positions 1 to $n$.',
    },
    check: {
      optionValues: ['T', 'A', 'C', null],
      compute: () => {
        const s = 'CAT';
        return s[s.length - 1];
      },
    },
  },
  {
    id: 'strings-036',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'If `length(s)` is $m$ and `length(t)` is $n$, what is `length(s + t)`?',
    options: ['$m + n$', '$m \\times n$', 'The larger of $m$ and $n$', '$m + n - 1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Concatenation (joining with `+`) keeps every character of both strings, so the lengths add.\n\n' +
        'For example, `"abc" + "de"` is `"abcde"`, and $3 + 2 = 5$.',
      whyWrong: [
        null,
        'This would repeat characters. Joining puts one string after the other, so the lengths add.',
        'This assumes one string overlaps the other. Nothing is overwritten when strings are joined.',
        'This loses a character at the join. Every character of both strings is kept.',
      ],
      keyIdea: 'The length of a joined string is the sum of the two lengths.',
    },
    check: { optionValues: [5, 6, 3, 4], compute: () => ('abc' + 'de').length },
  },
  {
    id: 'strings-025',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source: L('s = "hi there"', 'print(length(s))') },
    options: ['`8`', '`7`', '`2`', '`10`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`length` counts **every** character, including spaces: `hi` (2) + the space (1) + `there` (5) $= 8$.\n\n' +
        'Output: `8`.',
      whyWrong: [
        null,
        'This forgets the space. A space is a character too.',
        'This counts words. `length` counts characters.',
        'This also counts the two quote marks. They only mark where the string starts and ends.',
      ],
      keyIdea: '`length(s)` counts every character, including spaces, but not the quotes.',
    },
    check: { optionValues: [8, 7, 2, 10], compute: () => 'hi there'.length },
  },
  {
    id: 'strings-026',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: INDEXED,
    code: { lang: 'pseudocode', source: L('s = "PROGRAM"', 'print(s[3])') },
    options: ['`O`', '`G`', '`R`', '`P`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Write the positions under the characters:\n\n' +
        '| position | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n|---|---|---|---|---|---|---|---|\n| character | P | R | O | G | R | A | M |\n\n' +
        'Position 3 holds `O`.\n\nOutput: `O`.',
      whyWrong: [
        null,
        'This counts from 0, which makes `G` position 3. The stem says strings are indexed from 1.',
        'This is position 2, one place too early (or the third character counted from the end).',
        'This is position 1, the first character.',
      ],
      keyIdea: 'Indexed from 1, `s[k]` is the $k$-th character counted from the left.',
    },
    check: { optionValues: ['O', 'G', 'R', 'P'], compute: () => 'PROGRAM'[3 - 1] },
  },
  {
    id: 'strings-027',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source: L('a = "sun"', 'b = "day"', 'print(a + b)') },
    options: ['`sunday`', '`daysun`', '`sun`', '`Error`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'With two strings, `+` joins them, keeping the left one first and adding no space.\n\n' +
        '`"sun" + "day"` is `"sunday"`.\n\nOutput: `sunday`.',
      whyWrong: [
        null,
        'This joins them the wrong way round. `a + b` puts `a` first.',
        'This keeps only `a`. `+` joins both whole strings.',
        'Joining two strings with `+` is allowed, so there is no error.',
      ],
      keyIdea: '`a + b` joins two strings with `a` first and nothing added between them.',
    },
    check: { optionValues: ['sunday', 'daysun', 'sun', null], compute: () => 'sun' + 'day' },
  },
  {
    id: 'strings-005',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L('word = "banana"', 'count = 0', 'for i = 1 to length(word)', '   if word[i] == "a"', '      count = count + 1', '   end if', 'end for', 'print(count)'),
    },
    options: ['`3`', '`6`', '`2`', INFINITE],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop looks at each character in turn and adds 1 to `count` when it is `a`.\n\n' +
        '| i | word[i] | count |\n|---|---|---|\n| 1 | b | 0 |\n| 2 | a | 1 |\n| 3 | n | 1 |\n| 4 | a | 2 |\n| 5 | n | 2 |\n| 6 | a | 3 |\n\n' +
        'Output: `3`.',
      whyWrong: [
        null,
        'This is `length(word)`, the total number of characters. The `if` counts only the matching ones.',
        'This is the position of the first `a`. The code counts how many there are.',
        'A `for` loop from 1 to 6 runs exactly 6 times and then stops.',
      ],
      keyIdea: 'A loop over positions with an `if` inside counts the characters that match.',
    },
    check: {
      optionValues: [3, 6, 2, INFINITE],
      compute: () => {
        const word = 'banana';
        let count = 0;
        for (let i = 1; i <= word.length; i++) if (word[i - 1] === 'a') count++;
        return count;
      },
    },
  },
  {
    id: 'strings-016',
    subtopic: 'strings',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('a = "Cat"', 'b = "cat"', 'if a == b', '   print("same")', 'else', '   print("different")', 'end if'),
    },
    options: ['`same`', '`different`', '`Error`', '`Cat`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Two strings are equal only if every character matches exactly, including capital letters.\n\n' +
        '1. Compare the first characters: `C` and `c` are different characters.\n' +
        '2. So `a == b` is false and the `else` branch runs.\n\n' +
        'Output: `different`.',
      whyWrong: [
        'This ignores case. A capital `C` and a small `c` are different characters.',
        null,
        'Comparing two strings with `==` is allowed, so there is no error.',
        'The code prints one of the two words in quotes. It never prints `a`.',
      ],
      keyIdea: 'String comparison is case-sensitive: every character must match exactly.',
    },
    check: {
      optionValues: ['same', 'different', null, 'Cat'],
      compute: () => {
        const a: string = 'Cat';
        const b: string = 'cat';
        return a === b ? 'same' : 'different';
      },
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'strings-015',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L(
        's = "Ice Age Area"',
        'count = 0',
        'for i = 1 to length(s)',
        '   c = s[i]',
        '   if c == "a" or c == "e" or c == "i" or c == "o" or c == "u"',
        '      count = count + 1',
        '   end if',
        'end for',
        'print(count)',
      ),
    },
    options: ['`4`', '`7`', '`12`', '`2`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop adds 1 for every character that is a **lowercase** vowel. Capitals are different characters, so they do not match.\n\n' +
        '| word | lowercase vowels | count so far |\n|---|---|---|\n| `Ice` | e | 1 |\n| `Age` | e | 2 |\n| `Area` | e, a | 4 |\n\n' +
        'Spaces match nothing.\n\nOutput: `4`.',
      whyWrong: [
        null,
        'This also counts the capitals `I`, `A` and `A`. The comparisons are case-sensitive.',
        'This is `length(s)`, the number of characters. The `if` counts only lowercase vowels.',
        'This counts the different vowels (a and e). The loop adds 1 for every match, so repeats count each time.',
      ],
      keyIdea: 'A loop visits each character in turn, and comparisons are case-sensitive.',
    },
    check: {
      optionValues: [4, 7, 12, 2],
      compute: () => {
        const s = 'Ice Age Area';
        let count = 0;
        for (let i = 1; i <= s.length; i++) if ('aeiou'.includes(s[i - 1])) count++;
        return count;
      },
    },
  },
  {
    id: 'strings-028',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L('s = "CODE"', 't = ""', 'for i = 1 to length(s)', '   t = s[i] + t', 'end for', 'print(t)'),
    },
    options: ['`EDOC`', '`CODE`', '`E`', INFINITE],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each new character goes in **front** of what is already in `t`.\n\n' +
        '| i | s[i] | t |\n|---|---|---|\n| 1 | C | C |\n| 2 | O | OC |\n| 3 | D | DOC |\n| 4 | E | EDOC |\n\n' +
        'Output: `EDOC`.',
      whyWrong: [
        null,
        'This is `t = t + s[i]`, which adds each character at the end. Here the new character is on the left of the `+`.',
        'This is `t = s[i]`, which overwrites `t` each time. The line also keeps the old `t`.',
        'The loop runs exactly 4 times, once per character, and then stops.',
      ],
      keyIdea: '`t = s[i] + t` builds the string in reverse, while `t = t + s[i]` copies it.',
    },
    check: {
      optionValues: ['EDOC', 'CODE', 'E', INFINITE],
      compute: () => {
        const s = 'CODE';
        let t = '';
        for (let i = 1; i <= s.length; i++) t = s[i - 1] + t;
        return t;
      },
    },
  },
  {
    id: 'strings-029',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L('s = "ABCDEFG"', 't = ""', 'i = 1', 'while (i <= length(s))', '   t = t + s[i]', '   i = i + 2', 'end while', 'print(t)'),
    },
    options: ['`ACEG`', '`BDF`', '`ACE`', INFINITE],
    correctIndex: 0,
    markScheme: {
      solution:
        '`i` goes up by 2 each pass, so the loop visits every second position.\n\n' +
        '| i | s[i] | t |\n|---|---|---|\n| 1 | A | A |\n| 3 | C | AC |\n| 5 | E | ACE |\n| 7 | G | ACEG |\n\n' +
        'Then `i` becomes 9, and $9 \\le 7$ is false, so the loop stops.\n\nOutput: `ACEG`.',
      whyWrong: [
        null,
        'This counts positions from 0, so position 1 would be `B`. The stem says strings are indexed from 1.',
        'This stops before position 7, as if the condition were `i < length(s)`. The condition uses `<=`, so 7 is included.',
        '`i` increases on every pass, so it passes 7 and the loop stops.',
      ],
      keyIdea: 'Adding 2 to the position each pass visits every second character.',
    },
    check: {
      optionValues: ['ACEG', 'BDF', 'ACE', INFINITE],
      compute: () => {
        const s = 'ABCDEFG';
        let t = '';
        let i = 1;
        for (let n = 0; i <= s.length; n++) {
          if (n > 1000) return INFINITE;
          t += s[i - 1];
          i += 2;
        }
        return t;
      },
    },
  },
  {
    id: 'strings-030',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L(
        's = "BANANA"',
        'i = 1',
        'count = 0',
        'while (i <= length(s))',
        '   if s[i] == "A"',
        '      count = count + 1',
        '      i = i + 1',
        '   end if',
        'end while',
        'print(count)',
      ),
    },
    options: [INFINITE, '`3`', '`6`', '`0`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Look at where `i` changes: the line `i = i + 1` is **inside** the `if`.\n\n' +
        '1. `i` is 1 and `s[1]` is `B`, so the `if` is false.\n' +
        '2. `i` does not change, so the next pass looks at `s[1]` again.\n' +
        '3. This repeats for ever, because `i <= length(s)` stays true.\n\n' +
        'Answer: Infinite loop.',
      whyWrong: [
        null,
        'This is what you would get with `i = i + 1` after the `end if`. As written, the loop never gets past the `B`.',
        'This is `length(s)`. It assumes the loop visits every character, but it never moves on from position 1.',
        'This assumes the loop ends with `count` still 0. `count` does stay 0, but the loop never ends, so `print` is never reached.',
      ],
      keyIdea: 'If the counter only changes inside an `if`, the loop can get stuck on a value that fails the test.',
    },
    check: {
      optionValues: [INFINITE, 3, 6, 0],
      compute: () => {
        const s = 'BANANA';
        let i = 1;
        let count = 0;
        for (let n = 0; i <= s.length; n++) {
          if (n > 1000) return INFINITE;
          if (s[i - 1] === 'A') {
            count++;
            i++;
          }
        }
        return count;
      },
    },
  },
  {
    id: 'strings-031',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L('s = "PROGRAMMING"', 'p = 0', 'for i = 1 to length(s)', '   if s[i] == "G"', '      p = i', '      break', '   end if', 'end for', 'print(p)'),
    },
    options: ['`4`', '`3`', '`11`', '`2`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop stops at the first `G`, because `break` ends the loop at once.\n\n' +
        '| position | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| character | P | R | O | G |\n\n' +
        'At $i = 4$ the test is true, so `p` becomes 4 and the loop ends.\n\nOutput: `4`.',
      whyWrong: [
        null,
        'This counts positions from 0. The stem says strings are indexed from 1.',
        'This is the position of the last `G`, which is what you would get without the `break`.',
        'This is how many times `G` appears. The code stores a position.',
      ],
      keyIdea: 'A search with `break` keeps the first match; without `break` it would keep the last.',
    },
    check: {
      optionValues: [4, 3, 11, 2],
      compute: () => {
        const s = 'PROGRAMMING';
        let p = 0;
        for (let i = 1; i <= s.length; i++) {
          if (s[i - 1] === 'G') {
            p = i;
            break;
          }
        }
        return p;
      },
    },
  },
  {
    id: 'strings-032',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L('a = "CLASS"', 'b = "GLOSS"', 'd = 0', 'for i = 1 to length(a)', '   if a[i] != b[i]', '      d = d + 1', '   end if', 'end for', 'print(d)'),
    },
    options: ['`2`', '`3`', '`5`', '`0`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop counts the positions where the two strings **differ**.\n\n' +
        '| i | a[i] | b[i] | different? | d |\n|---|---|---|---|---|\n| 1 | C | G | yes | 1 |\n| 2 | L | L | no | 1 |\n| 3 | A | O | yes | 2 |\n| 4 | S | S | no | 2 |\n| 5 | S | S | no | 2 |\n\n' +
        'Output: `2`.',
      whyWrong: [
        null,
        'This counts the positions that match. `!=` counts the ones that differ.',
        'This is `length(a)`, the number of positions checked. `d` goes up only when the characters differ.',
        'This assumes the strings count as equal because they have the same length. Positions 1 and 3 hold different characters.',
      ],
      keyIdea: 'Comparing two strings position by position counts how many characters differ.',
    },
    check: {
      optionValues: [2, 3, 5, 0],
      compute: () => {
        const a = 'CLASS';
        const b = 'GLOSS';
        let d = 0;
        for (let i = 1; i <= a.length; i++) if (a[i - 1] !== b[i - 1]) d++;
        return d;
      },
    },
  },
  {
    id: 'strings-033',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L(
        's = "RADAR"',
        'n = length(s)',
        'ok = 1',
        'for i = 1 to div(n,2) // div is integer division',
        '   if s[i] != s[n - i + 1]',
        '      ok = 0',
        '   end if',
        'end for',
        'print(ok)',
      ),
    },
    options: ['`1`', '`0`', '`2`', '`5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop compares each character with its mirror image from the other end. `div(5,2)` is 2, so there are two passes.\n\n' +
        '| i | s[i] | n - i + 1 | s[n - i + 1] | ok |\n|---|---|---|---|---|\n| 1 | R | 5 | R | 1 |\n| 2 | A | 4 | A | 1 |\n\n' +
        'No pair differs, so `ok` stays 1. The string reads the same both ways (a palindrome).\n\nOutput: `1`.',
      whyWrong: [
        null,
        'This compares `s[i]` with `s[n - i]`, one place off. The `+ 1` makes the first position pair with the last.',
        'This counts the matching pairs. `ok` only ever holds 1 or 0.',
        'This is `length(s)`. The code prints `ok`.',
      ],
      keyIdea: 'Position $i$ pairs with position $n - i + 1$ when a string is indexed from 1.',
    },
    check: {
      optionValues: [1, 0, 2, 5],
      compute: () => {
        const s = 'RADAR';
        const n = s.length;
        let ok = 1;
        for (let i = 1; i <= Math.floor(n / 2); i++) if (s[i - 1] !== s[n - i]) ok = 0;
        return ok;
      },
    },
  },
  {
    id: 'strings-034',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: '`<` compares strings alphabetically, one character at a time. What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('a = "pear"', 'b = "apricot"', 'if a < b', '   print(a)', 'else', '   print(b)', 'end if'),
    },
    options: ['`apricot`', '`pear`', '`true`', '`Error`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Compare from the first character and stop at the first difference.\n\n' +
        '1. The first characters are `p` and `a`. `p` comes after `a` in the alphabet.\n' +
        '2. So `"pear" < "apricot"` is false, and the `else` branch runs.\n\n' +
        'Output: `apricot`.',
      whyWrong: [
        null,
        'This compares lengths, as `pear` is shorter. The comparison is alphabetical, so the first different character decides.',
        'The comparison only chooses the branch. The code then prints one of the two strings.',
        'Comparing two strings with `<` is allowed, as the stem says.',
      ],
      keyIdea: 'Strings compare character by character from the left, and length matters only if one is the start of the other.',
    },
    check: {
      optionValues: ['apricot', 'pear', 'true', null],
      compute: () => {
        const a: string = 'pear';
        const b: string = 'apricot';
        return a < b ? a : b;
      },
    },
  },
  {
    id: 'strings-037',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: {
      lang: 'pseudocode',
      source: L('s = "to be or not"', 'c = 1', 'for i = 1 to length(s)', '   if s[i] == " "', '      c = c + 1', '   end if', 'end for', 'print(c)'),
    },
    options: ['`4`', '`3`', '`12`', '`9`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop adds 1 for every space, and `c` starts at 1.\n\n' +
        '1. The string has 3 spaces: after `to`, after `be` and after `or`.\n' +
        '2. So `c` is $1 + 3 = 4$, which is the number of words.\n\n' +
        'Output: `4`.',
      whyWrong: [
        null,
        'This counts the spaces but forgets that `c` starts at 1.',
        'This is `length(s)`, the number of characters.',
        'This counts the characters that are not spaces. The `if` is true only for spaces.',
      ],
      keyIdea: 'With single spaces between words, the number of words is the number of spaces plus 1.',
    },
    check: {
      optionValues: [4, 3, 12, 9],
      compute: () => {
        const s = 'to be or not';
        let c = 1;
        for (let i = 1; i <= s.length; i++) if (s[i - 1] === ' ') c++;
        return c;
      },
    },
  },
  {
    id: 'strings-038',
    subtopic: 'strings',
    difficulty: 'exam',
    stem: INDEXED,
    code: { lang: 'pseudocode', source: L('s = "COMPUTER"', 'i = length(s) - 2', 'print(s[i] + s[i + 1])') },
    options: ['`TE`', '`ER`', '`UT`', '`ET`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '| position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n|---|---|---|---|---|---|---|---|---|\n| character | C | O | M | P | U | T | E | R |\n\n' +
        '1. `length(s)` is 8, so `i` is 6.\n' +
        '2. `s[6]` is `T` and `s[7]` is `E`.\n' +
        '3. Joining them gives `TE`.\n\n' +
        'Output: `TE`.',
      whyWrong: [
        null,
        'This counts positions from 0, moving both characters one place right. The stem says strings are indexed from 1.',
        'This takes the length as 7, which makes `i` equal to 5. `COMPUTER` has 8 characters.',
        'This joins the characters in the wrong order. `s[i]` comes first.',
      ],
      keyIdea: 'Write the positions under the characters, work out the index, then read off the characters.',
    },
    check: {
      optionValues: ['TE', 'ER', 'UT', 'ET'],
      compute: () => {
        const s = 'COMPUTER';
        const i = s.length - 2;
        return s[i - 1] + s[i];
      },
    },
  },
];
