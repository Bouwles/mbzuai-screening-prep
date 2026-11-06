import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'strings',
  simple:
    'A **string** is text in quotes, like `"CODE"`. Think of it as a row of numbered boxes with one character in each. In pseudocode the boxes are numbered from **1**, so `s[1]` is the first letter and `s[length(s)]` is the last. `length(s)` counts the characters, spaces included, and `+` joins two strings. To work through a string one character at a time, use a loop from 1 to `length(s)`.',
  methods: [
    { cue: 'A single position such as `s[3]` or `s[length(s) - 1]`', method: 'Write the characters with their positions underneath (1, 2, 3, ...), work out the index, then read off the character.' },
    { cue: 'Asked for `length(s)`', method: 'Count every character, including spaces and punctuation. The quote marks do not count.' },
    { cue: 'Two strings joined with `+`', method: 'Put the left string first and the right string straight after it, with nothing added between them.' },
    { cue: 'A loop from 1 to `length(s)` with an `if` inside', method: 'Go through one character per row and add 1 only when the test matches. Capital and small letters are different characters.' },
    { cue: 'A loop that builds a new string', method: 'Check which side the new character goes on: `t = t + s[i]` copies the string and `t = s[i] + t` reverses it.' },
    { cue: 'A loop with `break` when a character is found', method: 'The first match ends the loop, so the code keeps the first position, not the last.' },
    { cue: 'Two strings compared with `==` or `<`', method: 'Compare from the left and stop at the first difference. `==` needs every character to match exactly, and `<` is alphabetical.' },
  ],
  know:
    '### What a string is\n\n' +
    'A **string** is a piece of text: a sequence of characters written between quotes, such as `"cat"` or `"Data Science"`. Every character counts, including **spaces**, digits and punctuation. The quotes themselves are **not** part of the string. `"7"` is a string holding one character, while `7` is a number.\n\n' +
    '### Getting one character\n\n' +
    'Each character has a position number, called its **index**. In pseudocode, strings are indexed from **1**, so the first character is `s[1]`.\n\n' +
    '| position | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| character | C | O | D | E |\n\n' +
    'For a string of length `n`, the positions run from 1 to `n`, so the last character is `s[length(s)]`. Every question using positions says how they are numbered, so read the stem carefully.\n\n' +
    '**Exam habit:** whenever you see an index, write the word out with the position numbers underneath, like the table above. It takes 10 seconds and stops nearly every mistake.\n\n' +
    '### Length and joining\n\n' +
    '- `length(s)` is the number of characters, spaces included. `length("hi there")` is 8.\n' +
    '- `+` **concatenates** (joins) two strings: `"ab" + "cd"` is `"abcd"`. No space is added.\n' +
    '- The lengths add when strings are joined: `length(s + t)` is `length(s) + length(t)`.\n\n' +
    '### Comparing strings\n\n' +
    'Two strings are equal only if every character matches: `"Cat" == "cat"` is false, because `C` and `c` are different characters. The comparison `<` is alphabetical: compare from the left and let the first different character decide. So `"pear" < "apricot"` is false, because `p` comes after `a`. Length does not decide it.\n\n' +
    '### Looping over a string\n\n' +
    'A loop from 1 to `length(s)` visits each character in order, from left to right. Four patterns appear constantly:\n\n' +
    '- **Counting:** add 1 to a counter when `s[i]` matches.\n' +
    '- **Searching:** store `i` and `break` at the first match.\n' +
    '- **Building:** `t = t + s[i]` copies the string, and `t = s[i] + t` builds it in reverse.\n' +
    '- **Comparing:** check `a[i]` against `b[i]`, or `s[i]` against its mirror position `s[n - i + 1]`.\n\n' +
    'With a `while` loop you control the position yourself. `i = i + 2` visits every second character, and forgetting to change `i` on some pass gives an **infinite loop**.',
  formulas: [
    { label: 'First and last character', tex: '\\texttt{s[1]}, \\quad \\texttt{s[length(s)]}', note: 'When strings are indexed from 1.' },
    { label: 'Length of a joined string', tex: '\\texttt{length(s + t)} = \\texttt{length(s)} + \\texttt{length(t)}' },
    { label: 'Mirror position', tex: 'i \\text{ pairs with } n - i + 1', note: 'In a string of length $n$ indexed from 1, position 1 pairs with position $n$.' },
    { label: 'Counting words', tex: '\\text{words} = \\text{spaces} + 1', note: 'When single spaces separate the words.' },
  ],
  examples: [
    {
      title: 'Positions and length',
      problem: 'Strings are indexed from 1. With `s = "COMPUTER"`, what are `s[3]` and `s[length(s) - 1]`?',
      steps: [
        'Write the positions: C=1, O=2, M=3, P=4, U=5, T=6, E=7, R=8. The length is 8.',
        '`s[3]` is `M`.',
        '`length(s) - 1` is 7, and `s[7]` is `E`.',
      ],
      answer: '`s[3]` is `M` and `s[length(s) - 1]` is `E`.',
    },
    {
      title: 'Counting characters in a loop',
      problem: 'Strings are indexed from 1. What does this print?\n\n```pseudocode\ns = "level up"\ncount = 0\nfor i = 1 to length(s)\n   if s[i] == "e"\n      count = count + 1\n   end if\nend for\nprint(count)\n```',
      steps: [
        'The loop visits all 8 characters, including the space.',
        '`e` appears at positions 2 and 4.',
        '`count` goes up once for each, so it ends at 2.',
      ],
      answer: '`2`',
    },
    {
      title: 'Building a string in reverse',
      problem: 'Strings are indexed from 1. What does this print?\n\n```pseudocode\ns = "CAT"\nt = ""\nfor i = 1 to length(s)\n   t = s[i] + t\nend for\nprint(t)\n```',
      steps: [
        '$i = 1$: `t` becomes `C`.',
        '$i = 2$: the `A` goes in front, so `t` becomes `AC`.',
        '$i = 3$: the `T` goes in front, so `t` becomes `TAC`.',
      ],
      answer: '`TAC`',
    },
    {
      title: 'Exam level: moving through a string in jumps',
      problem: 'Strings are indexed from 1. What does this print?\n\n```pseudocode\ns = "STRINGS"\nt = ""\ni = 1\nwhile (i <= length(s))\n   t = t + s[i]\n   i = i + 3\nend while\nprint(t)\n```',
      steps: [
        'The positions are S=1, T=2, R=3, I=4, N=5, G=6, S=7, so the length is 7.',
        '$i = 1$: add `S`. Then `i` is 4.',
        '$i = 4$: add `I`. Then `i` is 7.',
        '$i = 7$: add `S`. Then `i` is 10.',
        '$10 \\le 7$ is false, so the loop stops.',
      ],
      answer: '`SIS`',
    },
  ],
  traps: [
    '**Counting from 0.** When strings are indexed from 1, `s[1]` is the first character. An answer one letter too far to the right usually comes from counting from 0.',
    '**Forgetting that spaces are characters.** `length("hi there")` is 8, and a space takes up a position.',
    '**Counting the quotes.** The quote marks only show where the string starts and ends.',
    '**Ignoring case.** `"Cat" == "cat"` is false, and a capital `A` does not match `"a"`.',
    '**Comparing by length.** `<` on strings is alphabetical, so the first different character decides.',
    '**Changing the position only inside an `if`.** If `i = i + 1` sits inside the `if`, the loop can get stuck on a character that fails the test.',
  ],
  examTip:
    'These questions are almost always "what does this code print?" with four outputs that differ by **one classic slip**: counting from 0, including the wrong end, joining in the wrong order, or missing a space. So:\n\n' +
    '1. Spend 10 seconds writing the string with position numbers underneath.\n' +
    '2. For loops that build a string, make a quick trace table with one row per pass.\n' +
    '3. For a counting loop, mark each match on your written-out string, then count the marks.\n' +
    '4. Check where the position changes in a `while` loop. If it may not change on some pass, "Infinite loop" is a serious candidate.',
};
