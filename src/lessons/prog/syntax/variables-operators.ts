import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'variables-operators',
  simple:
    'A **variable** is a labelled box that holds a value: `x = 5` puts 5 in the box called `x`, and a later line can replace it. The computer runs the lines from top to bottom, so to predict what code prints you just keep track of what is in each box after every line. Operators are the calculator buttons: `+`, `-`, `*`, `/` work as usual, `div(a,b)` divides and throws away the decimals, `mod(a,b)` gives the remainder, and `^` means "to the power of".',
  methods: [
    { cue: 'Code uses `div(a,b)` and `mod(a,b)`', method: '`div` is the whole-number part of the division and `mod` is the remainder. Check the pair with $a = b \\times q + r$.' },
    { cue: 'One long line with several operators and no brackets', method: 'Work out `div` and `mod` calls first, then `^`, then `*` and `/` left to right, then `+` and `-`. Rewrite the expression after each step.' },
    { cue: 'Several lines that keep updating a variable, such as `x = x * 2`', method: 'Make a trace table: work out the right-hand side with the latest value of `x`, then overwrite `x`.' },
    { cue: 'Two variables that are copied or swapped', method: 'Lines run one at a time, so an old value is lost once it is overwritten. A real swap saves it first: `t = a`, `a = b`, `b = t`.' },
    { cue: 'Values in quotes mixed with numbers', method: 'Track the type as well as the value: `+` adds numbers but joins strings, so `"5" + "3"` is `"53"`.' },
    { cue: 'Asked which variable name is **valid**', method: 'Letters, digits and `_` only, no digit at the start, and not a keyword such as `for` or `if`.' },
    { cue: 'The code is labelled Python', method: 'Read `//` as `div`, `%` as `mod` and `**` as `^`. Everything else works the same way.' },
  ],
  know:
    '### Variables and assignment\n\n' +
    'A **variable** is a name for a stored value. The line `x = 5` means "store 5 in `x`". It is an instruction, not an equation: `x = x + 1` is perfectly sensible and means "work out `x + 1` using the current `x`, then store the result back in `x`".\n\n' +
    'Code runs **top to bottom**, one line at a time. To predict output, keep a small table of every variable and update it after each line (a **trace table**). This one habit answers most exam questions in this topic.\n\n' +
    'Variable names may use letters, digits and `_`, must not start with a digit, and cannot be keywords such as `for`, `if` or `while`. Names are case-sensitive: `Total` and `total` are different variables.\n\n' +
    '### The four basic types\n\n' +
    '| Type | Examples | Notes |\n| --- | --- | --- |\n' +
    '| integer | `7`, `-3`, `0` | whole numbers |\n' +
    '| float | `2.5`, `-0.1` | numbers with a decimal part, also called real numbers |\n' +
    '| string | `"7"`, `"hi"` | text, in quotes; `"7"` is not the number 7 |\n' +
    '| Boolean | `true`, `false` | the result of a comparison |\n\n' +
    'The same operator can mean different things for different types: `"5" + "3"` is `"53"` (joining), while `5 + 3` is `8`.\n\n' +
    '### The arithmetic operators\n\n' +
    '| Operator | Meaning | Example |\n| --- | --- | --- |\n' +
    '| `+` `-` `*` | add, subtract, multiply | `4 * 3` is `12` |\n' +
    '| `/` | ordinary division | `7 / 2` is `3.5` |\n' +
    '| `div(a,b)` | integer division: keep the whole-number part | `div(17,5)` is `3` |\n' +
    '| `mod(a,b)` | remainder (modulus) | `mod(17,5)` is `2` |\n' +
    '| `^` | power | `2 ^ 5` is `32` |\n\n' +
    '`div` and `mod` work as a pair: $17 = 5 \\times 3 + 2$, so `div(17,5)` is 3 and `mod(17,5)` is 2. Handy uses for a positive whole number `n`: `mod(n,10)` is the last digit of `n`, `div(n,10)` removes the last digit, and `mod(n,2) == 0` tests whether `n` is even.\n\n' +
    'In a formal question you may see $q$ called the **integer quotient** and $r$ the **remainder**, with the fact $a = b \\times q + r$ stated for positive integers.\n\n' +
    '### Operator precedence\n\n' +
    'When there are no brackets, the order is:\n\n' +
    '1. brackets and function calls such as `mod(17,5)`\n' +
    '2. `^`\n' +
    '3. `*` and `/` (equal rank, **left to right**)\n' +
    '4. `+` and `-` (equal rank, left to right)\n\n' +
    'So `2 + 3 * 4 ^ 2` is `2 + 3 * 16`, then `2 + 48`, which is `50`. Comparisons such as `<` and `==` come after all of these.\n\n' +
    '### Updating and swapping\n\n' +
    'Each line uses the values left behind by the lines above it. After `a = b`, the old value of `a` is gone, so `a = b` followed by `b = a` does not swap: both variables end up with the old `b`. A swap needs a third variable to hold one value for a moment: `t = a`, then `a = b`, then `b = t`.\n\n' +
    '### Reading the same ideas in Python\n\n' +
    'Some questions use short pieces of Python, and the stem says so. Python writes `div(a,b)` as `a // b`, `mod(a,b)` as `a % b` and `a ^ b` as `a ** b`. Assignment and the order of operations work the same way.',
  formulas: [
    { label: 'Division with remainder', tex: 'a = b \\times q + r', note: 'For positive integers, with $q$ = `div(a,b)` and $r$ = `mod(a,b)`. Use it to check any pair.' },
    { label: 'Remainder', tex: 'r = a - b \\times q', note: 'For example $17 - 5 \\times 3 = 2$.' },
    { label: 'Precedence (highest first)', tex: '(\\,) \\;\\to\\; \\text{powers} \\;\\to\\; \\times\\ \\div \\;\\to\\; +\\ -', note: 'Equal-rank operators go left to right.' },
    { label: 'Digits of a whole number $n$', tex: '\\text{last digit} = n \\bmod 10', note: '`div(n,10)` removes the last digit, so `mod(div(n,100),10)` is the hundreds digit.' },
    { label: 'Swapping two variables', tex: 't \\leftarrow a, \\quad a \\leftarrow b, \\quad b \\leftarrow t', note: 'Three steps, in this order, with a temporary variable.' },
  ],
  examples: [
    {
      title: 'Integer division and remainder',
      problem: 'What does this print?\n\n```pseudocode\nprint(div(23,4)) // div is integer division\nprint(mod(23,4)) // mod is the modulus operator\nprint(23 / 4)\n```',
      steps: [
        '$23 \\div 4 = 5.75$.',
        '`div(23,4)` keeps the whole-number part: `5`.',
        '`mod(23,4)` is the remainder: $23 - 4 \\times 5 = 3$, so `3`.',
        '`23 / 4` is ordinary division: `5.75`.',
      ],
      answer: '`5`, then `3`, then `5.75`',
    },
    {
      title: 'Precedence step by step',
      problem: 'What does this print?\n\n```pseudocode\nprint(10 - 2 * 3 ^ 2)\n```',
      steps: [
        'Power first: `3 ^ 2` is `9`, giving `10 - 2 * 9`.',
        'Then multiply: `2 * 9` is `18`, giving `10 - 18`.',
        'Subtract last: $10 - 18 = -8$.',
      ],
      answer: '`-8`',
    },
    {
      title: 'Picking out one digit',
      problem: 'What does this print?\n\n```pseudocode\nn = 5732\nprint(mod(div(n,10),10)) // div is integer division, mod is the modulus operator\n```',
      steps: [
        'Work from the inside out: `div(5732,10)` is 573, which removes the last digit.',
        '`mod(573,10)` is 3, the last digit of 573.',
        'So this expression picks out the tens digit of 5732.',
      ],
      answer: '`3`',
    },
    {
      title: 'Trace table with a temporary variable',
      problem: 'What does this print?\n\n```pseudocode\na = 2\nb = 5\nt = a\na = b\nb = t * 2\nprint(a + b)\n```',
      steps: [
        'After the first two lines, `a` is 2 and `b` is 5.',
        '`t = a` saves the 2 in `t`.',
        '`a = b` makes `a` equal to 5.',
        '`b = t * 2` uses the saved 2, so `b` becomes 4.',
        '`a + b` is $5 + 4 = 9$.',
      ],
      answer: '`9`',
    },
  ],
  traps: [
    'Treating `mod` as the decimal part of a division. `mod(17,5)` is the whole-number remainder 2, not 0.4.',
    'Using `div` as ordinary division: `div(7,2)` is `3`, while `7 / 2` is `3.5`.',
    'Applying a power to too much: in `2 * 3 ^ 2` only the 3 is squared, so the answer is 18, not 36.',
    'Trying to swap with `a = b` then `b = a`. The first line destroys the old `a`, so both end up equal.',
    'Using an old value in a later line. Each line sees the latest values, not the ones from the start.',
    'Mixing up strings and numbers: `"5" + "3"` is `"53"`, and `print` never shows the quotes of a string.',
  ],
  examTip:
    'These questions are almost always "What does this code print?" with four outputs that differ by one specific mistake: one option uses ordinary division instead of `div`, one swaps quotient and remainder, one ignores precedence and works left to right, and one uses a stale value. So spot what is being tested first, then hunt for the trap. Write a quick trace table on scrap paper, one row per line. For `div` and `mod` pairs, verify with $a = b \\times q + r$ on your calculator, which takes five seconds and often removes two options at once.',
};
