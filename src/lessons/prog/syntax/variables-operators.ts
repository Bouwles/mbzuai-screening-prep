import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'variables-operators',
  know:
    '### Variables and assignment\n\n' +
    'A **variable** is a name that points to a value. The line `x = 5` means "make `x` refer to 5". It is an instruction, not an equation: `x = x + 1` is perfectly sensible and means "work out `x + 1` using the current `x`, then store the result back in `x`".\n\n' +
    'Code runs **top to bottom**, one line at a time. To predict output, keep a small table of every variable and update it after each line (a **trace table**). This one habit answers most exam questions in this topic.\n\n' +
    'Variable names may use letters, digits and `_`, must not start with a digit, and cannot be keywords such as `for`, `if` or `class`. Names are case-sensitive: `Total` and `total` are different variables.\n\n' +
    '### The four basic types\n\n' +
    '| Type | Examples | Notes |\n| --- | --- | --- |\n' +
    '| `int` | `7`, `-3`, `0` | whole numbers |\n' +
    '| `float` | `2.5`, `7.0`, `-0.1` | always printed with a decimal point |\n' +
    '| `str` | `"7"`, `\'hi\'` | text, in quotes; `"7"` is not the number 7 |\n' +
    '| `bool` | `True`, `False` | in arithmetic `True` counts as 1, `False` as 0 |\n\n' +
    '`type(x)` tells you the type. Converting between types: `int("12")` is `12`, `int(7.9)` is `7` (it chops towards zero, it does not round), `float("2.5")` is `2.5`, `str(14)` is `"14"`. But `int("3.5")` raises a `ValueError`, and `"Age: " + 18` raises a `TypeError` because Python will not mix a string and a number with `+`.\n\n' +
    'The same operator can mean different things for different types: `"5" + "3"` is `"53"` (joining), `5 + 3` is `8`, and `"ab" * 3` is `"ababab"` (repeating).\n\n' +
    '### The arithmetic operators\n\n' +
    '| Operator | Meaning | Example |\n| --- | --- | --- |\n' +
    '| `+` `-` `*` | add, subtract, multiply | `4 * 3` is `12` |\n' +
    '| `/` | true division, **always a float** | `10 / 5` is `2.0` |\n' +
    '| `//` | floor division: divide, then round **down** | `17 // 5` is `3` |\n' +
    '| `%` | remainder (modulo) | `17 % 5` is `2` |\n' +
    '| `**` | power | `2 ** 5` is `32` |\n\n' +
    '`//` gives an int when both numbers are ints, but a float if either is a float: `10 // 4.0` is `2.0`.\n\n' +
    '`//` and `%` work as a pair: $17 = 5 \\times 3 + 2$, so `17 // 5` is 3 and `17 % 5` is 2. Handy uses (for a positive whole number `n`): `n % 10` is the last digit of `n`, `n // 10` removes the last digit, and `n % 2 == 0` tests whether `n` is even.\n\n' +
    '### Negative numbers with // and %\n\n' +
    'This is the favourite trap. Python\'s `//` rounds **down** on the number line (towards minus infinity), not towards zero. So `-7 // 2` is $-4$, because $-3.5$ rounded down is $-4$.\n\n' +
    'Then `%` is chosen so that `a == b * (a // b) + a % b` is always true. For `-7 % 2`: $-7 - 2 \\times (-4) = 1$. A quick rule: **the remainder has the same sign as the divisor** (the number after the `%`). So `-17 % 5` is 3, but `17 % -5` is $-3$. Many other languages (C, Java) round towards zero instead, which is exactly where the wrong options come from.\n\n' +
    '### Operator precedence\n\n' +
    'When there are no brackets, Python works in this order:\n\n' +
    '1. brackets `( )`\n' +
    '2. `**` (worked **right to left**: `2 ** 3 ** 2` is $2^9 = 512$)\n' +
    '3. a minus sign in front of a number, so `-2 ** 2` is $-(2^2) = -4$\n' +
    '4. `*`, `/`, `//`, `%` (equal rank, **left to right**)\n' +
    '5. `+`, `-` (equal rank, left to right)\n\n' +
    'So `2 + 3 * 4 ** 2 // 5` is `2 + 3 * 16 // 5`, then `2 + 48 // 5`, then `2 + 9`, which is `11`. Comparisons such as `<` and `==` come after all of these.\n\n' +
    '### Augmented and multiple assignment\n\n' +
    '`x += 3` is short for `x = x + 3`; likewise `-=`, `*=`, `/=`, `//=`, `%=`, `**=`. The whole right-hand side is worked out first: `x *= 2 + 1` means `x = x * (2 + 1)`.\n\n' +
    '`a, b = 1, 2` assigns two variables at once. In `a, b = b, a + b`, Python works out **all** the values on the right using the old values, and only then assigns them. That is why `a, b = b, a` swaps two variables in one line. Swapping one at a time (`a = b` then `b = a`) fails, because the old value of `a` is lost. A chain like `x = y = 0` gives the same value to every name.',
  formulas: [
    { label: 'Division identity (always true in Python)', tex: 'a = b \\times (a \\,//\\, b) + (a \\bmod b)', note: 'Use it to check any `//` and `%` pair, especially with negatives.' },
    { label: 'Floor division `a // b`', tex: 'a \\,//\\, b = \\left\\lfloor \\frac{a}{b} \\right\\rfloor', note: 'Round **down** (towards minus infinity), not towards zero: `-7 // 2` is $-4$.' },
    { label: 'Remainder `a % b`', tex: 'a \\bmod b = a - b \\times (a \\,//\\, b)', note: 'The result has the same sign as $b$ (or is 0).' },
    { label: 'True division `a / b`', tex: '\\frac{a}{b} \\text{ is always a float}', note: '`10 / 5` is `2.0`.' },
    { label: 'Precedence (highest first)', tex: '(\\,) \\;\\to\\; \\texttt{**} \\;\\to\\; \\text{unary } - \\;\\to\\; \\texttt{*}\\ \\texttt{/}\\ \\texttt{//}\\ \\texttt{\\%} \\;\\to\\; \\texttt{+}\\ \\texttt{-}', note: 'Equal-rank operators go left to right, except `**`.' },
    { label: 'Powers are right-associative', tex: 'a^{b^{c}} = a^{(b^{c})}, \\qquad -a^{b} = -(a^{b})', note: '`2 ** 3 ** 2` is 512, `-2 ** 2` is $-4$.' },
    { label: 'Augmented assignment', tex: 'x \\mathrel{\\texttt{op=}} e \\;\\equiv\\; x = x \\;\\texttt{op}\\; (e)', note: 'The right-hand side is evaluated first, as one whole.' },
    { label: 'Digits of a whole number $n$', tex: '\\text{last digit} = n \\bmod 10, \\qquad \\text{remove last digit} = n \\,//\\, 10', note: '`(n // 100) % 10` is the hundreds digit.' },
    { label: 'Booleans in arithmetic', tex: '\\texttt{True} = 1, \\qquad \\texttt{False} = 0' },
  ],
  examples: [
    {
      title: 'Floor division and remainder',
      problem: 'What does `print(23 // 4, 23 % 4, 23 / 4)` print?',
      steps: [
        '$23 \\div 4 = 5.75$.',
        '`23 // 4` rounds down: `5`.',
        '`23 % 4` is the remainder: $23 - 4 \\times 5 = 3$, so `3`.',
        '`23 / 4` is true division, a float: `5.75`.',
      ],
      answer: '`5 3 5.75`',
    },
    {
      title: 'Precedence step by step',
      problem: 'What does `print(10 - 2 * 3 ** 2 // 4)` print?',
      steps: [
        '`**` first: `3 ** 2` is `9`, giving `10 - 2 * 9 // 4`.',
        '`*` and `//` left to right: `2 * 9` is `18`, then `18 // 4` is `4` (because $18 \\div 4 = 4.5$, rounded down).',
        '`-` last: $10 - 4 = 6$.',
      ],
      answer: '`6`',
    },
    {
      title: 'Negative numbers',
      problem: 'What does `print(-13 // 4, -13 % 4)` print?',
      steps: [
        '$-13 \\div 4 = -3.25$.',
        'Round **down** on the number line: $-4$ (not $-3$, which would be rounding towards zero). So `-13 // 4` is `-4`.',
        'Remainder: $-13 - 4 \\times (-4) = -13 + 16 = 3$. So `-13 % 4` is `3`.',
        'Check with the identity: $4 \\times (-4) + 3 = -13$. Correct, and the remainder is positive like the divisor 4.',
      ],
      answer: '`-4 3`',
    },
    {
      title: 'Trace table with types and multiple assignment',
      problem: 'What does this print?\n\n`a, b = "2", 5`, then `a, b = b * 2, a * 2`, then `print(a + 1, b)`',
      steps: [
        'Line 1: `a` is the string `"2"`, `b` is the int `5`.',
        'Line 2, right-hand side first, using the old values: `b * 2` is $5 \\times 2 = 10$ (int); `a * 2` is `"2" * 2` which repeats the string: `"22"`.',
        'Now assign: `a = 10`, `b = "22"`.',
        'Line 3: `a + 1` is `11`; `b` prints without quotes as `22`.',
      ],
      answer: '`11 22`',
    },
  ],
  traps: [
    'Rounding negatives towards zero. In Python `-7 // 2` is $-4$ (round **down**), and `-7 % 2` is $1$. Check any answer with $a = b \\times q + r$.',
    'Thinking `/` can give an int. `10 / 2` is `2.0`, a float. Only `//` (with two ints) gives an int.',
    'Squaring the minus sign: `-3 ** 2` is $-9$, not 9, and `2 ** 3 ** 2` is 512, not 64.',
    'Updating variables one at a time in `a, b = b, a + b`. Python works out the whole right side first, using the old values.',
    'Mixing strings and numbers: `"4" * 2` is `"44"` (repetition), `"4" + 2` is a `TypeError`, and `print` never shows the quotes of a string.',
    'Believing a conversion changes the variable. `int(c)` returns a new value; `c` itself keeps its old type unless you write `c = int(c)`.',
  ],
  examTip:
    'These questions are almost always "What does this code print?" with four outputs that differ by one specific mistake: one option rounds negatives towards zero, one forgets that `/` gives a float (`2` instead of `2.0`), one ignores precedence and works left to right, one updates a swap in the wrong order. So spot what is being tested first, then hunt for the trap. Write a quick trace table on scrap paper, one row per line. Check the **form** of each option before computing: if `/` was used, any answer without a decimal point is wrong; if the divisor of `%` is positive, any negative remainder is wrong. For negative `//` and `%`, verify the pair with $a = b \\times q + r$ on your calculator, which takes five seconds and kills two options at once.',
};
