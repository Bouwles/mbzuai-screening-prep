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
      asking: 'What kind of value does the word "string" mean in programming?',
      solution:
        'In programming, a **string** is a piece of text, such as `"cat"` or `"hi there"`.\n\n' +
        'Each letter, digit, space or symbol in it is one **character**. A string keeps its characters in order, like beads on a thread. So `"cat"` is `c`, then `a`, then `t`.',
      conclusion: 'A string is text kept in order, one character after another: A sequence of characters.',
      whyWrong: [
        null,
        'That is an integer. `"7"` in quotes is a string, while `7` is a number.',
        'That is a Boolean.',
        'That is an array of numbers. A string holds characters.',
      ],
      keyIdea: 'Look for the quote marks. `"7"` in quotes is a string of one character, but `7` with no quotes is a number. True or false values are Booleans, and lists of values are arrays.',
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
      asking: 'What is the name for sticking two pieces of text together?',
      solution:
        'Joining end to end means one string is placed straight after the other. For example, `"sun" + "day"` gives `sunday`.\n\n' +
        'The word for this is **concatenation**. Many languages write it with `+`.',
      conclusion: 'Joining strings end to end has its own special name: Concatenation.',
      whyWrong: [
        null,
        'Indexing means picking out one character by its position, such as `s[1]`.',
        'Iteration means repeating, as a loop does.',
        'Assignment means storing a value in a variable.',
      ],
      keyIdea: 'Match each word to its action. Concatenation joins strings. Indexing picks a character by its position. Iteration repeats, as a loop does. Assignment stores a value in a variable.',
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
      asking: 'How do you write the last character of a string when positions start at 1?',
      solution:
        '`s[k]` means the character at position `k`. Indexed from 1 means the first character is at position 1, the next at position 2, and so on.\n\n' +
        '`length(s)` is how many characters `s` has. Try `s = "CAT"`: the length is 3, and the positions are 1, 2 and 3.\n\n' +
        'The last position is 3, which equals the length. So the last character is at position `length(s)`, written `s[length(s)]`.',
      conclusion: 'When counting from 1, the last position always equals the length, so the answer is `s[length(s)]`.',
      whyWrong: [
        null,
        'This is the last position when indexing from 0. When indexing from 1 it gives the second-to-last character.',
        'This is the first character.',
        'Position 0 does not exist when indexing from 1.',
      ],
      keyIdea: 'Test position questions on a short word: write the word with its positions underneath. Counting from 1, the last position is `length(s)`. Counting from 0, it is `length(s) - 1`.',
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
      asking: 'How long is the text you get by joining two strings?',
      solution:
        '`length` counts the characters in a string. `s + t` puts all of `t` straight after all of `s`, and nothing is removed or overlapped.\n\n' +
        'Try an example. `"sun"` has 3 characters and `"day"` has 3 characters. Joined, they make `sunday`, which has 6 characters, and $3 + 3 = 6$.\n\n' +
        'Every character of both strings is kept, so the lengths add up to $m + n$.',
      conclusion: 'Joining keeps all $m$ characters and all $n$ characters, so the new length is $m + n$.',
      whyWrong: [
        null,
        'This would repeat characters. Joining puts one string after the other, so the lengths add.',
        'This assumes one string overlaps the other. Nothing is overwritten when strings are joined.',
        'This loses a character at the join. Every character of both strings is kept.',
      ],
      keyIdea: 'For a question in letters, try small real strings with different lengths, such as `"ab"` and `"cde"`. Joined, they have 5 characters, and only the sum of the two lengths gives 5.',
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
      asking: 'How many characters are in the text `hi there`?',
      solution:
        '`length(s)` counts every character between the quote marks. The quote marks themselves don\'t count, but a space does.\n\n' +
        'Count them one at a time:\n\n| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n|---|---|---|---|---|---|---|---|---|\n| Character | h | i | (space) | t | h | e | r | e |\n\n' +
        'The last position is 8, so `length(s)` is 8.',
      conclusion: 'There are 7 letters and 1 space, so the answer is `8`.',
      whyWrong: [
        null,
        'This forgets the space. A space is a character too.',
        'This counts words. `length` counts characters.',
        'This also counts the two quote marks. They only mark where the string starts and ends.',
      ],
      keyIdea: 'To find a length, write each character under a position number, leaving a box for every space. The last position number is the length.',
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
      asking: 'Which letter is third in `PROGRAM`, counting from 1?',
      solution:
        '`s[3]` means the character at position 3. The question says strings are indexed from 1, so the first character is at position 1.\n\n' +
        'Write each letter under its position:\n\n| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n|---|---|---|---|---|---|---|---|\n| Character | P | R | O | G | R | A | M |\n\n' +
        'Position 3 holds the letter `O`.',
      conclusion: 'Counting from 1, the third character of `PROGRAM` is `O`.',
      whyWrong: [
        null,
        'This counts from 0, which makes `G` position 3. The stem says strings are indexed from 1.',
        'This is position 2, one place too early (or the third character counted from the end).',
        'This is position 1, the first character.',
      ],
      keyIdea: 'For `s[k]`, write the string with position numbers underneath, starting from the number the question gives. Then read off the character below `k`.',
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
      asking: 'What do you get when you join the two words in `a` and `b`?',
      solution:
        '`a` and `b` hold text, because of the quote marks. Text in quotes is called a **string**.\n\n' +
        'With strings, `+` means join: it puts the right string straight after the left one, with no space added.\n\n' +
        '`a + b` has `a` on the left, so `sun` comes first and `day` follows. Line 3 prints `sunday`.',
      conclusion: 'The two strings join with `a` first, so the output is `sunday`.',
      whyWrong: [
        null,
        'This joins them the wrong way round. `a + b` puts `a` first.',
        'This keeps only `a`. `+` joins both whole strings.',
        'Joining two strings with `+` is allowed, so there is no error.',
      ],
      keyIdea: 'For `+` on strings, write the left string, then the right one straight after it. No space appears unless one of the strings contains it.',
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
      asking: 'How many times does the letter `a` appear in `banana`?',
      solution:
        '`length(word)` is 6, so line 3 makes `i` go from 1 to 6, one value per pass. `word[i]` is the letter at position `i`.\n\n' +
        '`count` starts at 0 on line 2. Line 5 adds 1 only when the `if` on line 4 is true, which means the letter is `a`.\n\n' +
        'Trace all six passes:\n\n| `i` | `word[i]` | Equal to `a`? | `count` |\n|---|---|---|---|\n| 1 | b | no | 0 |\n| 2 | a | yes | 1 |\n| 3 | n | no | 1 |\n| 4 | a | yes | 2 |\n| 5 | n | no | 2 |\n| 6 | a | yes | 3 |\n\n' +
        'Line 8 prints the final `count`, which is 3.',
      conclusion: 'The letter `a` is at positions 2, 4 and 6, so `count` ends at 3 and the answer is `3`.',
      whyWrong: [
        null,
        'This is `length(word)`, the total number of characters. The `if` counts only the matching ones.',
        'This is the position of the first `a`. The code counts how many there are.',
        'A `for` loop from 1 to 6 runs exactly 6 times and then stops.',
      ],
      keyIdea: 'A loop with an `if` that adds 1 is a counter: it counts the items that pass the test. Spot this pattern, then go through the string and tally each match.',
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
      asking: 'Does the computer treat `Cat` and `cat` as the same text?',
      solution:
        '`==` compares two strings one character at a time. They are equal only if every character matches exactly.\n\n' +
        'To a computer, a capital `C` and a small `c` are different characters. So the first characters don\'t match, and `a == b` is false.\n\n' +
        'A false condition skips the `if` block and runs the `else` block, so line 6 prints `different`.',
      conclusion: 'The strings differ in their first character, so the `else` branch prints `different`.',
      whyWrong: [
        'This ignores case. A capital `C` and a small `c` are different characters.',
        null,
        'Comparing two strings with `==` is allowed, so there is no error.',
        'The code prints one of the two words in quotes. It never prints `a`.',
      ],
      keyIdea: 'To compare strings, check them character by character, including capitals and spaces. One mismatch makes `==` false, and capital and small letters count as different.',
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
      asking: 'How many small-letter vowels are in `Ice Age Area`?',
      solution:
        'The loop visits every character. Line 5 tests whether the character equals `a`, `e`, `i`, `o` or `u`. `or` means the test passes if at least one of those comparisons is true.\n\n' +
        'All five letters in the test are small letters. A capital such as `I` is a different character from `i`, so capitals fail the test.\n\n' +
        'Consonants and spaces can\'t pass either, so only the vowels matter:\n\n| Position | Character | Passes? | `count` |\n|---|---|---|---|\n| 1 | I | no, capital | 0 |\n| 3 | e | yes | 1 |\n| 5 | A | no, capital | 1 |\n| 7 | e | yes | 2 |\n| 9 | A | no, capital | 2 |\n| 11 | e | yes | 3 |\n| 12 | a | yes | 4 |\n\n' +
        'Line 9 prints the final `count`, which is 4.',
      conclusion: 'Four characters pass the test, the three small `e`s and the small `a`, so the answer is `4`.',
      whyWrong: [
        null,
        'This also counts the capitals `I`, `A` and `A`. The comparisons are case-sensitive.',
        'This is `length(s)`, the number of characters. The `if` counts only lowercase vowels.',
        'This counts the different vowels (a and e). The loop adds 1 for every match, so repeats count each time.',
      ],
      keyIdea: 'When a test compares characters, see whether it lists small letters, capitals or both, because comparison is case-sensitive. Then list only the candidates and tick the ones that match exactly.',
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
      asking: 'What is in `t` after adding each letter of `CODE` to the front of it?',
      solution:
        '`t` starts as `""`, the **empty string**: text with no characters yet.\n\n' +
        'Line 4 says `t = s[i] + t`. `s[i]` is the character at position `i`, and `+` joins text. The new character is on the left of the `+`, so it goes in **front** of what `t` already holds.\n\n' +
        '`length(s)`, the number of characters, is 4. So trace four passes:\n\n| `i` | `s[i]` | Working | `t` becomes |\n|---|---|---|---|\n| 1 | C | `C` + nothing | `C` |\n| 2 | O | `O` + `C` | `OC` |\n| 3 | D | `D` + `OC` | `DOC` |\n| 4 | E | `E` + `DOC` | `EDOC` |\n\n' +
        'Line 6 prints `t`, which is now `EDOC`.',
      conclusion: 'Each letter goes in front of the earlier ones, which reverses the word, so the answer is `EDOC`.',
      whyWrong: [
        null,
        'This is `t = t + s[i]`, which adds each character at the end. Here the new character is on the left of the `+`.',
        'This is `t = s[i]`, which overwrites `t` each time. The line also keeps the old `t`.',
        'The loop runs exactly 4 times, once per character, and then stops.',
      ],
      keyIdea: 'Look at which side of `+` the new character is on. `t = s[i] + t` adds to the front and reverses the string. `t = t + s[i]` adds to the end and copies it.',
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
      asking: 'Which letters of `ABCDEFG` does the loop collect when `i` goes up by 2?',
      solution:
        '`length(s)` is 7, so the loop runs while `i <= 7`, meaning `i` is 7 or less. The condition is checked at the top of each pass.\n\n' +
        'Each pass joins `s[i]`, the letter at position `i`, to the end of `t`, then adds 2 to `i`. So it takes every second letter, starting from position 1.\n\n' +
        'Trace it:\n\n| `i` at the check | `i <= 7`? | `s[i]` | `t` becomes |\n|---|---|---|---|\n| 1 | yes | A | `A` |\n| 3 | yes | C | `AC` |\n| 5 | yes | E | `ACE` |\n| 7 | yes | G | `ACEG` |\n| 9 | no, stop | | |\n\n' +
        'Line 8 prints `t`, which is `ACEG`.',
      conclusion: 'Positions 1, 3, 5 and 7 are collected, so the answer is `ACEG`.',
      whyWrong: [
        null,
        'This counts positions from 0, so position 1 would be `B`. The stem says strings are indexed from 1.',
        'This stops before position 7, as if the condition were `i < length(s)`. The condition uses `<=`, so 7 is included.',
        '`i` increases on every pass, so it passes 7 and the loop stops.',
      ],
      keyIdea: 'With `i = i + 2` the loop visits every second position. List the values of `i` until the condition fails, and see whether the last one is still allowed by `<=` or `<`.',
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
      asking: 'Does this loop ever finish, and if so, what does it print?',
      solution:
        '`length(s)` is 6, so the condition is `i <= 6`. The loop can only end if `i` grows past 6.\n\n' +
        'Look at where `i` changes. Line 7, `i = i + 1`, is **inside** the `if` block, so it runs only when `s[i]`, the letter at position `i`, is `A`.\n\n' +
        'Start tracing. `i` is 1 and `s[1]` is `B`. `B` is not `A`, so the `if` is false and lines 6 and 7 are skipped.\n\n' +
        'Nothing has changed, so `i` is still 1. The next pass does exactly the same thing, and so does every pass after it.\n\n' +
        'The condition `1 <= 6` stays true for ever, so the loop never ends and line 10 is never reached.',
      conclusion: '`i` gets stuck at 1, on the letter `B`, so the answer is: Infinite loop.',
      whyWrong: [
        null,
        'This is what you would get with `i = i + 1` after the `end if`. As written, the loop never gets past the `B`.',
        'This is `length(s)`. It assumes the loop visits every character, but it never moves on from position 1.',
        'This assumes the loop ends with `count` still 0. `count` does stay 0, but the loop never ends, so `print` is never reached.',
      ],
      keyIdea: 'For any `while` loop, find the line that moves the loop variable. If it sits inside an `if`, ask whether that `if` can be false. If it can, the variable stops changing and the loop runs for ever.',
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
      asking: 'At which position is the first `G` in `PROGRAMMING`?',
      solution:
        'The loop looks at each position in turn. When the letter is `G`, line 5 stores the position in `p`, and `break` on line 6 ends the loop straight away.\n\n' +
        'So later `G`s are never looked at. Only the first one matters.\n\n' +
        'Trace from position 1:\n\n| `i` | `s[i]` | Equal to `G`? |\n|---|---|---|\n| 1 | P | no |\n| 2 | R | no |\n| 3 | O | no |\n| 4 | G | yes: `p = 4`, then `break` |\n\n' +
        'Line 9 prints `p`, which holds 4.',
      conclusion: 'The `break` stops the search at the first `G`, at position 4, so the answer is `4`.',
      whyWrong: [
        null,
        'This counts positions from 0. The stem says strings are indexed from 1.',
        'This is the position of the last `G`, which is what you would get without the `break`.',
        'This is how many times `G` appears. The code stores a position.',
      ],
      keyIdea: 'A loop with `break` after a match is a search for the **first** match. Number the characters from 1 and stop at the first match. Without `break`, `p` would end up as the last match.',
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
      asking: 'At how many positions do `CLASS` and `GLOSS` have different letters?',
      solution:
        '`length(a)` is 5, so line 4 makes `i` go from 1 to 5. `!=` means "not equal".\n\n' +
        'So line 6 adds 1 to `d` only when the two letters at the same position differ.\n\n' +
        'Compare position by position:\n\n| `i` | `a[i]` | `b[i]` | Different? | `d` |\n|---|---|---|---|---|\n| 1 | C | G | yes | 1 |\n| 2 | L | L | no | 1 |\n| 3 | A | O | yes | 2 |\n| 4 | S | S | no | 2 |\n| 5 | S | S | no | 2 |\n\n' +
        'Line 9 prints `d`, which holds 2.',
      conclusion: 'The words differ only at positions 1 and 3, so the answer is `2`.',
      whyWrong: [
        null,
        'This counts the positions that match. `!=` counts the ones that differ.',
        'This is `length(a)`, the number of positions checked. `d` goes up only when the characters differ.',
        'This assumes the strings count as equal because they have the same length. Positions 1 and 3 hold different characters.',
      ],
      keyIdea: 'Write one string above the other and compare column by column. `!=` counts the columns that differ, and `==` counts the ones that match.',
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
      asking: 'What does `ok` hold after comparing the letters of `RADAR` from both ends?',
      solution:
        '`length(s)` is 5, so `n` is 5. `ok` starts at 1, and only line 6 can change it to 0, which happens if a pair of letters differs.\n\n' +
        '`div` is integer division, which keeps only the whole-number part. $5 \\div 2 = 2.5$, so `div(5,2)` is 2 and the loop runs for `i` = 1 and 2. The middle letter has no partner, so it isn\'t checked.\n\n' +
        '`s[i]` is the letter at position `i`, and `s[n - i + 1]` is the letter at the matching position from the other end. When `i` is 1, that is position $5 - 1 + 1 = 5$, the last letter.\n\n' +
        'Compare the pairs:\n\n| `i` | `s[i]` | `n - i + 1` | `s[n - i + 1]` | Different? |\n|---|---|---|---|---|\n| 1 | R | 5 | R | no |\n| 2 | A | 4 | A | no |\n\n' +
        'Neither pair differs, so line 6 never runs and `ok` keeps its value. Line 9 prints 1.',
      conclusion: 'Both pairs match, so `ok` stays at 1 and the answer is `1`.',
      whyWrong: [
        null,
        'This compares `s[i]` with `s[n - i]`, one place off. The `+ 1` makes the first position pair with the last.',
        'This counts the matching pairs. `ok` only ever holds 1 or 0.',
        'This is `length(s)`. The code prints `ok`.',
      ],
      keyIdea: 'To test whether a word is a palindrome (reads the same both ways), compare the first and last letters, then move inwards. A flag such as `ok` starts at 1 and drops to 0 on any mismatch.',
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
      asking: 'Which word comes first alphabetically, and which branch does that choose?',
      solution:
        'Alphabetical comparison starts with the first characters. If they differ, those two characters decide it. Length doesn\'t matter.\n\n' +
        'Variable `a` holds `pear` and variable `b` holds `apricot`. Their first letters are p and a.\n\n' +
        '`a < b` asks whether `pear` comes before `apricot` in the alphabet. The letter p comes after the letter a, so `a < b` is false.\n\n' +
        'A false condition runs the `else` block, which is line 6, `print(b)`. `b` holds `apricot`.',
      conclusion: '`pear` does not come before the other word, so the code prints `b`, and the answer is `apricot`.',
      whyWrong: [
        null,
        'This compares lengths, as `pear` is shorter. The comparison is alphabetical, so the first different character decides.',
        'The comparison only chooses the branch. The code then prints one of the two strings.',
        'Comparing two strings with `<` is allowed, as the stem says.',
      ],
      keyIdea: 'To compare strings with `<`, find the first position where they differ and compare those two characters alphabetically. The rest of each string makes no difference. If one word runs out with no difference found, the shorter word comes first.',
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
      asking: 'How many spaces are in `to be or not`, and what does `c` hold after counting them?',
      solution:
        'Line 2 starts `c` at 1, and not at 0. Line 5 adds 1 every time the character at position `i` is a space, written `" "`.\n\n' +
        'Other characters don\'t change `c`, so look only at the spaces:\n\n| Space after | Position | `c` becomes |\n|---|---|---|\n| `to` | 3 | 2 |\n| `be` | 6 | 3 |\n| `or` | 9 | 4 |\n\n' +
        'Line 8 prints `c`, which holds 4.',
      conclusion: 'There are 3 spaces and `c` starts at 1, so $1 + 3 = 4$ and the answer is `4`.',
      whyWrong: [
        null,
        'This counts the spaces but forgets that `c` starts at 1.',
        'This is `length(s)`, the number of characters.',
        'This counts the characters that are not spaces. The `if` is true only for spaces.',
      ],
      keyIdea: 'With one space between words, the number of words is the number of spaces plus 1. Whenever a counter is used, look at its starting value: starting at 1 instead of 0 changes the result.',
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
      asking: 'Which two letters of `COMPUTER` are at positions `i` and `i + 1`, where `i` is 2 less than the length?',
      solution:
        '`COMPUTER` has 8 characters, so `length(s)` is 8. Line 2 gives `i` the value $8 - 2 = 6$.\n\n' +
        'Write the positions, counting from 1:\n\n| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n|---|---|---|---|---|---|---|---|---|\n| Character | C | O | M | P | U | T | E | R |\n\n' +
        '`s[k]` means the character at position `k`. So `s[i]` is `s[6]`, which is `T`. `s[i + 1]` is `s[7]`, which is `E`.\n\n' +
        '`+` joins strings with the left one first, so line 3 prints `TE`.',
      conclusion: 'Position 6 then position 7 gives `T` then `E`, so the answer is `TE`.',
      whyWrong: [
        null,
        'This counts positions from 0, moving both characters one place right. The stem says strings are indexed from 1.',
        'This takes the length as 7, which makes `i` equal to 5. `COMPUTER` has 8 characters.',
        'This joins the characters in the wrong order. `s[i]` comes first.',
      ],
      keyIdea: 'Work out the index first, as a number. Write the word with positions under it, read the letters, and join them in the order they appear around `+`.',
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
