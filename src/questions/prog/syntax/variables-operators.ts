import type { StaticQuestion } from '../../../types';

// Python-style floor division and modulo, used by the answer checks below.
const fdiv = (a: number, b: number): number => Math.floor(a / b);
const pmod = (a: number, b: number): number => a - b * Math.floor(a / b);

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'variables-operators-001',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(17 // 5, 17 % 5)' },
    options: ['`3.4 2`', '`3 2`', '`2 3`', '`3 0.4`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`//` is **floor division**: divide, then round **down** to a whole number. `%` is the **remainder** left over.\n\n' +
        '1. $17 \\div 5 = 3.4$, rounded down gives `17 // 5` = `3`.\n' +
        '2. Five goes into 17 three times, using up $3 \\times 5 = 15$. What is left is $17 - 15 = 2$, so `17 % 5` = `2`.\n' +
        '3. `print` with two values separates them with one space.\n\n' +
        'Output: `3 2`.',
      whyWrong: [
        'This uses true division `/` for the first value. `17 / 5` would give `3.4`, but `//` throws away the fractional part and gives the whole number `3`.',
        null,
        'This swaps the two results. The first value printed is the quotient `17 // 5`, and the second is the remainder `17 % 5`.',
        'This treats `%` as "the decimal part of the division" (the 0.4 in 3.4). In Python `%` is the whole-number remainder: 17 minus 15 leaves 2.',
      ],
      keyIdea: '`a // b` is how many whole times b fits into a, and `a % b` is what is left over.',
    },
    check: { optionValues: ['3.4 2', '3 2', '2 3', '3 0.4'], compute: () => `${fdiv(17, 5)} ${pmod(17, 5)}` },
    python: { stdout: '3 2\n' },
  },
  {
    id: 'variables-operators-002',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a = 10\nb = 2\nc = a / b\nprint(c, type(c))' },
    options: ["`5.0 <class 'float'>`", "`5 <class 'int'>`", "`5 <class 'float'>`", "`5.0 <class 'int'>`"],
    correctIndex: 0,
    markScheme: {
      solution:
        "In Python 3 the single slash `/` is **true division** and **always** gives a `float`, even when the answer is a whole number.\n\n" +
        '1. `a = 10` and `b = 2` are both `int`.\n' +
        '2. `c = a / b` gives `5.0` (a float), not `5`.\n' +
        "3. `type(c)` is `<class 'float'>`.\n\n" +
        "Output: `5.0 <class 'float'>`.",
      whyWrong: [
        null,
        'This assumes that dividing two ints that "go exactly" gives an int. That is true for `//`, but `/` always returns a float in Python 3.',
        'The type is right, but a float is always printed with a decimal point, so it shows as `5.0`, not `5`.',
        'The value is right, but the type is not: a value printed as `5.0` is a float. `/` never produces an int.',
      ],
      keyIdea: 'In Python 3, `/` always returns a float; use `//` when you want a whole-number result.',
    },
    check: {
      optionValues: ["5.0 <class 'float'>", "5 <class 'int'>", "5 <class 'float'>", "5.0 <class 'int'>"],
      compute: () => {
        const c = 10 / 2; // Python's / always gives a float, printed with a decimal point
        return `${c.toFixed(1)} <class 'float'>`;
      },
    },
    python: { stdout: "5.0 <class 'float'>\n" },
  },
  {
    id: 'variables-operators-003',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'Which of these is a **valid** Python variable name?',
    options: ['`2nd_place`', '`_count2`', '`total-score`', '`for`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Python variable names must follow three rules:\n\n' +
        '- use only letters, digits and underscores `_`\n' +
        '- must **not start with a digit**\n' +
        '- must not be a reserved keyword such as `for`, `if`, `while`, `class`, `True`\n\n' +
        'Checking each one:\n\n' +
        '- `2nd_place` starts with a digit: invalid.\n' +
        '- `_count2` uses only an underscore, letters and a digit, and starts with an underscore: **valid**.\n' +
        '- `total-score` contains `-`, which Python reads as a minus sign (`total` minus `score`): invalid.\n' +
        '- `for` is a keyword used for loops: invalid.\n\n' +
        'Answer: `_count2`.',
      whyWrong: [
        'A variable name cannot start with a digit. Digits are allowed only after the first character, as in `place_2nd`.',
        null,
        'The hyphen is the minus operator, so Python would try to compute `total - score`. Use an underscore instead: `total_score`.',
        '`for` is a reserved keyword (it starts a loop), so it cannot be used as a variable name.',
      ],
      keyIdea: 'Names use letters, digits and underscores, cannot start with a digit, and cannot be a keyword.',
    },
  },
  {
    id: 'variables-operators-004',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'x = 5\nx += 3\nx *= 2\nprint(x)' },
    options: ['`10`', '`13`', '`8`', '`16`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Augmented assignment updates the variable using its **current** value: `x += 3` means `x = x + 3`, and `x *= 2` means `x = x * 2`. The lines run top to bottom.\n\n' +
        '| Line | x |\n| --- | --- |\n| `x = 5` | 5 |\n| `x += 3` | 8 |\n| `x *= 2` | 16 |\n\n' +
        'Output: `16`.',
      whyWrong: [
        'This reads `x *= 2` as "add 2" ($8 + 2$). The operator in front of `=` tells you what to do: `*=` multiplies.',
        'This runs the lines in the wrong order: doubling 5 first ($10$) and then adding 3. Code runs top to bottom, so the 3 is added first.',
        'This is the value after `x += 3`, forgetting that `x *= 2` changes `x` again before it is printed.',
        null,
      ],
      keyIdea: '`x op= y` means `x = x op y`, applied to the current value of x, line by line.',
    },
    check: {
      optionValues: [10, 13, 8, 16],
      compute: () => {
        let x = 5;
        x += 3;
        x *= 2;
        return x;
      },
    },
    python: { stdout: '16\n' },
  },
  {
    id: 'variables-operators-005',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does this Python code print? (The two lines of output are shown on one line, separated by a space.)',
    code: { lang: 'python', source: 'a = "5"\nb = "3"\nprint(a + b)\nprint(int(a) + int(b))' },
    options: ['`53 8`', '`8 8`', '`53 53`', '`8 53`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The quotes make `a` and `b` **strings** (text), not numbers.\n\n' +
        '1. `a + b` with two strings **joins** them (concatenation): `"5" + "3"` is `"53"`. `print` shows it without quotes: `53`.\n' +
        '2. `int(a)` converts `"5"` to the number `5`, and `int(b)` gives `3`. Now `+` is ordinary addition: `5 + 3` is `8`.\n\n' +
        'Output: `53` then `8`, shown as `53 8`.',
      whyWrong: [
        null,
        'This treats `"5"` and `"3"` as numbers on the first line. With quotes they are strings, and `+` on strings joins them.',
        'This forgets that `int()` converts the strings to numbers, so the second `+` is real addition.',
        'This has the two lines the wrong way round: the first `print` uses the strings, the second uses the converted numbers.',
      ],
      keyIdea: '`+` joins strings but adds numbers; `int()` converts a digit string into a number.',
    },
    check: {
      optionValues: ['53 8', '8 8', '53 53', '8 53'],
      compute: () => {
        const a = '5';
        const b = '3';
        return `${a + b} ${parseInt(a, 10) + parseInt(b, 10)}`;
      },
    },
    python: { stdout: '53\n8\n' },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'variables-operators-006',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(-7 // 2, -7 % 2)' },
    options: ['`-3 -1`', '`-4 -1`', '`-4 1`', '`-3 1`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Python\'s `//` rounds **down** (towards minus infinity), not towards zero. Python\'s `%` then gives whatever makes this true:\n\n' +
        '$$a = b \\times (a \\,//\\, b) + (a \\bmod b)$$\n\n' +
        '1. $-7 \\div 2 = -3.5$. Rounding **down** gives $-4$ (because $-4$ is below $-3.5$). So `-7 // 2` is `-4`.\n' +
        '2. Remainder: $-7 - 2 \\times (-4) = -7 + 8 = 1$. So `-7 % 2` is `1`.\n' +
        '3. Check: $2 \\times (-4) + 1 = -7$. Correct.\n\n' +
        'Output: `-4 1`.',
      whyWrong: [
        'This rounds $-3.5$ towards zero to get $-3$ and gives the remainder the sign of $-7$. That is how C and Java work, but Python rounds down and the remainder takes the sign of the divisor 2.',
        'The quotient is right, but the remainder is not: $2 \\times (-4) + (-1) = -9$, not $-7$. With a positive divisor, `%` in Python is never negative.',
        null,
        'This rounds $-3.5$ towards zero for the quotient. Python rounds down, so `-7 // 2` is $-4$. (Check: $2 \\times (-3) + 1 = -5$, not $-7$.)',
      ],
      keyIdea: '`//` always rounds down (towards minus infinity), and `%` takes the sign of the divisor, so `a == b*(a//b) + a%b` holds.',
    },
    check: { optionValues: ['-3 -1', '-4 -1', '-4 1', '-3 1'], compute: () => `${fdiv(-7, 2)} ${pmod(-7, 2)}` },
    python: { stdout: '-4 1\n' },
  },
  {
    id: 'variables-operators-007',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(2 + 3 * 4 ** 2 // 5)' },
    options: ['`11`', '`80`', '`30`', '`11.6`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Python\'s order of operations (highest first): brackets, then `**`, then `*`, `/`, `//`, `%` (equal rank, worked **left to right**), then `+` and `-`.\n\n' +
        '1. `**` first: `4 ** 2` is `16`. The expression is now `2 + 3 * 16 // 5`.\n' +
        '2. `*` and `//` have equal rank, so go left to right: `3 * 16` is `48`, then `48 // 5` is `9` (because $48 \\div 5 = 9.6$, rounded down).\n' +
        '3. Finally `+`: `2 + 9` is `11`.\n\n' +
        'Output: `11`.',
      whyWrong: [
        null,
        'This works strictly left to right like a basic calculator: $2 + 3 = 5$, $5 \\times 4 = 20$, $20^2 = 400$, $400 \\,//\\, 5 = 80$. Python does `**` first, then `*` and `//`, and `+` last.',
        'This multiplies before squaring: $(3 \\times 4)^2 = 144$, $144 \\,//\\, 5 = 28$, $2 + 28 = 30$. But `**` binds tighter than `*`, so only the 4 is squared.',
        'This uses true division: $48 \\div 5 = 9.6$ and $2 + 9.6 = 11.6$. The operator is `//`, which rounds down to `9`, so the answer is a whole number.',
      ],
      keyIdea: 'Precedence: `**`, then `* / // %` left to right, then `+ -`.',
    },
    check: { optionValues: [11, 80, 30, 11.6], compute: () => 2 + fdiv(3 * 4 ** 2, 5) },
    python: { stdout: '11\n' },
  },
  {
    id: 'variables-operators-008',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a, b = 3, 8\na, b = b, a + b\nprint(a, b)' },
    options: ['`8 16`', '`3 11`', '`8 3`', '`8 11`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'In a multiple assignment, Python works out **every value on the right first**, using the old values, and only then assigns them to the names on the left.\n\n' +
        '1. `a, b = 3, 8` gives `a = 3`, `b = 8`.\n' +
        '2. Right-hand side of line 2, using the old values: `b` is `8` and `a + b` is `3 + 8 = 11`.\n' +
        '3. Now assign: `a = 8`, `b = 11`.\n\n' +
        'Output: `8 11`.',
      whyWrong: [
        'This updates `a` first and then uses the **new** `a` to work out `b` ($8 + 8 = 16$). In `a, b = b, a + b` the whole right side is evaluated before anything is assigned.',
        'This only updates `b`. Both names on the left get new values: `a` becomes the old `b`.',
        'This treats the line as a plain swap. The second value is `a + b`, not `a`, so `b` becomes $3 + 8 = 11$.',
        null,
      ],
      keyIdea: 'In `a, b = x, y`, both right-hand values are computed from the old values before either assignment happens.',
    },
    check: {
      optionValues: ['8 16', '3 11', '8 3', '8 11'],
      compute: () => {
        let a = 3;
        let b = 8;
        [a, b] = [b, a + b];
        return `${a} ${b}`;
      },
    },
    python: { stdout: '8 11\n' },
  },
  {
    id: 'variables-operators-009',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'x = "4"\ny = 2\nz = x * y\nprint(z + "0")' },
    options: ['`80`', '`440`', 'A `TypeError` is raised', "`'440'`"],
    correctIndex: 1,
    markScheme: {
      solution:
        '`x` is the **string** `"4"`, and `y` is the int `2`.\n\n' +
        '1. A string times an int **repeats** the string: `"4" * 2` is `"44"`. So `z = "44"` (still a string).\n' +
        '2. `z + "0"` joins two strings: `"44" + "0"` is `"440"`.\n' +
        '3. `print` shows a string without its quotes: `440`.\n\n' +
        'Output: `440`.',
      whyWrong: [
        'This treats `"4"` as the number 4, so `x * y` would be 8, and then sticks a 0 on the end. But `"4"` is a string, so `* 2` repeats it to give `"44"`.',
        null,
        'Multiplying a string by an int is allowed (it repeats the string), and adding two strings is allowed. An error would only happen if you added a string and a number, such as `"44" + 0`.',
        'The value is right, but `print` never shows the quotes around a string. The quotes only appear if you print `repr(z)` or look at the value in a list.',
      ],
      keyIdea: '`str * int` repeats the string and `str + str` joins strings; `print` shows strings without quotes.',
    },
    check: {
      optionValues: ['80', '440', null, "'440'"],
      compute: () => {
        const x = '4';
        const z = x.repeat(2);
        return z + '0';
      },
    },
    python: { stdout: '440\n' },
  },
  {
    id: 'variables-operators-010',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What happens when this Python code runs?',
    code: { lang: 'python', source: 'age = 17\nage += 1\nprint("Age: " + age)' },
    options: ['It prints `Age: 18`', 'It prints `Age: 17`', 'A `TypeError` is raised', 'It prints `Age: age`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '1. `age = 17` makes `age` an int. `age += 1` makes it the int `18`.\n' +
        '2. `"Age: " + age` tries to `+` a **string** and an **int**. Python will not guess whether you mean "join" or "add", so it stops with a `TypeError` (can only concatenate str to str).\n\n' +
        'To print `Age: 18` you must convert first: `"Age: " + str(age)`, or use `print("Age:", age)` or an f-string `f"Age: {age}"`.\n\n' +
        'Answer: a `TypeError` is raised.',
      whyWrong: [
        'This is what you would get with `"Age: " + str(age)`. Without `str()`, Python refuses to join a string and an int.',
        'This both ignores the `age += 1` line and ignores the type problem. The value is 18, and anyway the `+` fails.',
        null,
        '`age` without quotes is a variable name, so Python uses its value, not the word "age". The real problem is that the value is an int.',
      ],
      keyIdea: 'You cannot `+` a str and an int in Python; convert with `str()` first.',
    },
    python: { error: 'TypeError' },
  },
  {
    id: 'variables-operators-011',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'passed = 7 > 3\nfailed = 2 > 5\nprint(passed + passed + failed)' },
    options: ['`True`', '`2`', '`TrueTrueFalse`', 'A `TypeError` is raised'],
    correctIndex: 1,
    markScheme: {
      solution:
        '1. `7 > 3` is `True`, so `passed = True`. `2 > 5` is `False`, so `failed = False`.\n' +
        '2. In Python, `bool` is a kind of int: `True` behaves as `1` and `False` as `0` in arithmetic.\n' +
        '3. `True + True + False` is `1 + 1 + 0 = 2`.\n\n' +
        'Output: `2`.',
      whyWrong: [
        'This treats `+` as a logical "or". Arithmetic on booleans gives a number: True counts as 1, False as 0.',
        null,
        'This treats the booleans as strings being joined. They are not strings; `True` and `False` act as the numbers 1 and 0.',
        'Adding booleans is allowed because `bool` is a subtype of `int`, so no error occurs.',
      ],
      keyIdea: 'In arithmetic, `True` counts as 1 and `False` counts as 0.',
    },
    check: { optionValues: [null, 2, null, null], compute: () => Number(7 > 3) + Number(7 > 3) + Number(2 > 5) },
    python: { stdout: '2\n' },
  },
  {
    id: 'variables-operators-012',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'In this pseudocode, `DIV` is integer division (like Python\'s `//`) and `MOD` is the remainder (like Python\'s `%`). What is output?',
    code: { lang: 'pseudocode', source: 'n ← 3874\nd ← (n DIV 100) MOD 10\nOUTPUT d' },
    options: ['`7`', '`38`', '`3`', '`8`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Brackets first.\n\n' +
        '1. `n DIV 100`: $3874 \\div 100 = 38.74$, keep the whole part: `38`. (Integer division by 100 chops off the last two digits.)\n' +
        '2. `38 MOD 10`: $38 = 3 \\times 10 + 8$, so the remainder is `8`. (Remainder after dividing by 10 is the last digit.)\n\n' +
        'So `d` is the **hundreds digit** of 3874.\n\n' +
        'Output: `8`.',
      whyWrong: [
        'This is the tens digit, `(n MOD 100) DIV 10`. Dividing by 100 first removes the tens and units, so the last digit left is the hundreds digit.',
        'This stops after `n DIV 100` and forgets the `MOD 10`, which keeps only the last digit of 38.',
        'This is the thousands digit, which you would get from `n DIV 1000`. Dividing by 100 leaves 38, whose last digit is 8.',
        null,
      ],
      keyIdea: 'Integer division (`DIV`) by $10^k$ removes the last $k$ digits and `MOD 10` keeps the last digit, so together they pick out one digit.',
    },
    check: { optionValues: [7, 38, 3, 8], compute: () => pmod(fdiv(3874, 100), 10) },
  },
  {
    id: 'variables-operators-013',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'x = 10\nx -= 4\nx **= 2\nx //= 5\nx %= 4\nprint(x)' },
    options: ['`3`', '`3.2`', '`7`', '`0`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each augmented assignment `x op= y` means `x = x op y`, using the current `x`.\n\n' +
        '| Line | Working | x |\n| --- | --- | --- |\n' +
        '| `x = 10` | | 10 |\n' +
        '| `x -= 4` | $10 - 4$ | 6 |\n' +
        '| `x **= 2` | $6^2$ | 36 |\n' +
        '| `x //= 5` | $36 \\div 5 = 7.2$, round down | 7 |\n' +
        '| `x %= 4` | $7 = 1 \\times 4 + 3$ | 3 |\n\n' +
        'Output: `3`.',
      whyWrong: [
        null,
        'This does `x //= 5` as true division, giving $7.2$, and then $7.2 \\bmod 4 = 3.2$. But `//` rounds down to the whole number 7.',
        'This is the value after `x //= 5`, forgetting the last line `x %= 4`, which replaces 7 by its remainder when divided by 4.',
        'This reads `x **= 2` as $2^x$ (giving $2^6 = 64$, then $64 \\,//\\, 5 = 12$ and $12 \\bmod 4 = 0$). It actually means `x = x ** 2`, so $6^2 = 36$.',
      ],
      keyIdea: 'Trace augmented assignments one line at a time, always using the latest value of the variable.',
    },
    check: {
      optionValues: [3, 3.2, 7, 0],
      compute: () => {
        let x = 10;
        x -= 4;
        x = x ** 2;
        x = fdiv(x, 5);
        x = pmod(x, 4);
        return x;
      },
    },
    python: { stdout: '3\n' },
  },
  {
    id: 'variables-operators-014',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(10 / 5, 10 // 5, 10 // 4.0)' },
    options: ['`2 2 2`', '`2.0 2 2.0`', '`2.0 2 2.5`', '`2.0 2.0 2.0`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Two rules decide the **type** of the result:\n\n' +
        '- `/` always gives a float.\n' +
        '- `//` gives an int if both numbers are ints, but a float if either number is a float. It still rounds down.\n\n' +
        '1. `10 / 5` is `2.0` (float, because of `/`).\n' +
        '2. `10 // 5` is `2` (both are ints, so the result is an int).\n' +
        '3. `10 // 4.0`: $10 \\div 4 = 2.5$, rounded down is 2, but `4.0` is a float, so the result is the float `2.0`.\n\n' +
        'Output: `2.0 2 2.0`.',
      whyWrong: [
        'This forgets that `/` always returns a float (so `10 / 5` is `2.0`), and that `//` with a float operand also returns a float.',
        null,
        'This does not round down in the last one. `//` is floor division even when a float is involved: $2.5$ rounds down to `2.0`.',
        'This thinks `//` always returns a float. With two ints, `10 // 5` returns the int `2`.',
      ],
      keyIdea: '`/` always gives a float; `//` rounds down and gives a float only if one of the numbers is a float.',
    },
    check: {
      optionValues: ['2 2 2', '2.0 2 2.0', '2.0 2 2.5', '2.0 2.0 2.0'],
      compute: () => {
        // render a Python float the way print() does for whole values
        const asFloat = (v: number) => (Number.isInteger(v) ? `${v}.0` : `${v}`);
        return `${asFloat(10 / 5)} ${fdiv(10, 5)} ${asFloat(fdiv(10, 4.0))}`;
      },
    },
    python: { stdout: '2.0 2 2.0\n' },
  },
  {
    id: 'variables-operators-020',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What happens when this Python code runs?',
    code: { lang: 'python', source: 'x = "3.5"\ny = int(x)\nprint(y + 1)' },
    options: ['A `ValueError` is raised', 'It prints `4`', 'It prints `4.5`', 'It prints `5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. `x` is the **string** `"3.5"`.\n' +
        '2. `int()` can turn a float into an int (`int(3.5)` is `3`, it chops off the decimals), and it can turn a string of **whole-number digits** into an int (`int("3")` is `3`).\n' +
        '3. But `int("3.5")` is a string that does not look like a whole number, so Python raises a `ValueError` (invalid literal for int).\n\n' +
        'To make it work you would write `int(float(x))`, which gives `3`, and then `y + 1` would be `4`.\n\n' +
        'Answer: a `ValueError` is raised.',
      whyWrong: [
        null,
        'This is what `int(float(x)) + 1` would print. `int()` cannot read the decimal point in the string `"3.5"` directly.',
        'This treats the string as the float 3.5 and adds 1. `int()` never returns a decimal, and here it fails before any adding happens.',
        'This rounds 3.5 up to 4 and adds 1. `int()` never rounds (it chops towards zero), and here the string cannot be converted at all.',
      ],
      keyIdea: '`int()` accepts a float or a whole-number string, but not a string containing a decimal point.',
    },
    python: { error: 'ValueError' },
  },

  // ------------------------------------------------------------------ challenge
  {
    id: 'variables-operators-015',
    subtopic: 'variables-operators',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(-2 ** 2, 2 ** 3 ** 2)' },
    options: ['`4 512`', '`-4 64`', '`-4 512`', '`4 64`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Two special rules about `**`:\n\n' +
        '- `**` binds **tighter** than a minus sign in front, so `-2 ** 2` means $-(2^2)$.\n' +
        '- `**` is worked **right to left**, so `2 ** 3 ** 2` means $2^{(3^2)}$.\n\n' +
        '1. `-2 ** 2` $= -(2^2) = -4$.\n' +
        '2. `3 ** 2` $= 9$ first, then `2 ** 9` $= 512$.\n\n' +
        'Output: `-4 512`.',
      whyWrong: [
        'This squares $-2$ to get 4. Python applies `**` before the minus sign, so it is $-(2^2) = -4$. You would need `(-2) ** 2` to get 4.',
        'The first value is right, but this works `2 ** 3 ** 2` left to right as $(2^3)^2 = 64$. Powers are grouped from the right: $2^9 = 512$.',
        null,
        'This makes both mistakes: it squares $-2$ (instead of $-(2^2)$) and works the powers left to right (instead of $2^{(3^2)}$).',
      ],
      keyIdea: '`**` is right-associative and binds tighter than unary minus: `-a ** b` is $-(a^b)$ and `a ** b ** c` is $a^{(b^c)}$.',
    },
    check: { optionValues: ['4 512', '-4 64', '-4 512', '4 64'], compute: () => `${-(2 ** 2)} ${2 ** (3 ** 2)}` },
    python: { stdout: '-4 512\n' },
  },
  {
    id: 'variables-operators-016',
    subtopic: 'variables-operators',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(17 % -5, -17 // 5, -17 % 5)' },
    options: ['`-3 -4 3`', '`2 -3 -2`', '`-3 -3 3`', '`2 -4 3`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Python rule: `a // b` is $a \\div b$ rounded **down**, and `a % b` $= a - b \\times (a \\,//\\, b)$. As a result, the remainder always has the **same sign as the divisor** $b$ (or is 0).\n\n' +
        '1. `17 % -5`: $17 \\div (-5) = -3.4$, rounded down is $-4$. Remainder $= 17 - (-5)(-4) = 17 - 20 = -3$.\n' +
        '2. `-17 // 5`: $-17 \\div 5 = -3.4$, rounded down is $-4$.\n' +
        '3. `-17 % 5`: $-17 - 5 \\times (-4) = -17 + 20 = 3$.\n\n' +
        'Output: `-3 -4 3`.',
      whyWrong: [
        null,
        'This uses "round towards zero" for every part, like C or Java: $17 \\bmod (-5) = 2$, $-17 \\div 5 \\to -3$, $-17 \\bmod 5 = -2$. Python rounds down, so the signs follow the divisor.',
        'The remainders are right but the middle value is not: $-3.4$ rounded **down** is $-4$, not $-3$. Rounding down on the number line moves away from zero for negatives.',
        'This gives the first remainder the sign of the dividend 17. In Python the remainder takes the sign of the divisor $-5$, so `17 % -5` is $-3$ (check: $(-5)(-4) + (-3) = 17$).',
      ],
      keyIdea: 'In Python, `//` floors and `%` takes the sign of the divisor, so always check with $a = b \\times q + r$.',
    },
    check: {
      optionValues: ['-3 -4 3', '2 -3 -2', '-3 -3 3', '2 -4 3'],
      compute: () => `${pmod(17, -5)} ${fdiv(-17, 5)} ${pmod(-17, 5)}`,
    },
    python: { stdout: '-3 -4 3\n' },
  },
  {
    id: 'variables-operators-017',
    subtopic: 'variables-operators',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'a = "7"\nb = int(a) * 2\nc = str(b) + a\nd = int(c) // 4\nprint(d, type(c).__name__)',
    },
    options: ['`5 str`', '`36.75 str`', '`36 int`', '`36 str`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Track the **type** as well as the value of each variable.\n\n' +
        '| Line | Value | Type |\n| --- | --- | --- |\n' +
        '| `a = "7"` | `"7"` | str |\n' +
        '| `b = int(a) * 2` | $7 \\times 2 = 14$ | int |\n' +
        '| `c = str(b) + a` | `"14" + "7"` = `"147"` | str |\n' +
        '| `d = int(c) // 4` | $147 \\div 4 = 36.75$, round down: 36 | int |\n\n' +
        '`type(c).__name__` is the name of the type of `c`, which is still a string: `str`. (Converting with `int(c)` creates a new value; it does not change `c` itself.)\n\n' +
        'Output: `36 str`.',
      whyWrong: [
        'This adds 14 and 7 as numbers on the third line ($21 \\,//\\, 4 = 5$). But `str(b)` and `a` are both strings, so `+` joins them into `"147"`.',
        'This uses true division: $147 \\div 4 = 36.75$. The operator `//` rounds down to the int 36.',
        'This thinks `int(c)` turned `c` into an int. `int(c)` only makes a new value for the calculation; `c` itself is still the string `"147"`.',
        null,
      ],
      keyIdea: 'Conversions like `int(c)` return a new value and never change the original variable\'s type; `+` on two strings joins them.',
    },
    check: {
      optionValues: ['5 str', '36.75 str', '36 int', '36 str'],
      compute: () => {
        const a = '7';
        const b = parseInt(a, 10) * 2;
        const c = String(b) + a;
        const d = fdiv(parseInt(c, 10), 4);
        return `${d} ${typeof c === 'string' ? 'str' : 'int'}`;
      },
    },
    python: { stdout: '36 str\n' },
  },
  {
    id: 'variables-operators-018',
    subtopic: 'variables-operators',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'x, y, z = 1, 2, 3\nx, y = y, x\nz = x = y + z\nx += z\nprint(x, y, z)' },
    options: ['`10 2 5`', '`8 1 4`', '`6 1 4`', '`7 1 4`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '| Line | What happens | x | y | z |\n| --- | --- | --- | --- | --- |\n' +
        '| `x, y, z = 1, 2, 3` | three values unpacked | 1 | 2 | 3 |\n' +
        '| `x, y = y, x` | right side `(2, 1)` worked out first, then assigned: a swap | 2 | 1 | 3 |\n' +
        '| `z = x = y + z` | `y + z` is $1 + 3 = 4$; the **same** value goes to both `z` and `x` | 4 | 1 | 4 |\n' +
        '| `x += z` | $4 + 4$ | 8 | 1 | 4 |\n\n' +
        'Output: `8 1 4`.',
      whyWrong: [
        'This does the swap one name at a time (`x = y`, then `y = x`), so both become 2. A tuple assignment evaluates the right side first, so it is a true swap.',
        null,
        'This thinks `z = x = y + z` only changes `z`. A chained assignment gives the value to **every** name in the chain, so `x` also becomes 4.',
        'This uses the old `z` (3) in `x += z`. By that line `z` has already been changed to 4, so $x = 4 + 4 = 8$.',
      ],
      keyIdea: 'Tuple assignment evaluates the whole right side first (so swaps work), and `a = b = value` gives the value to every name.',
    },
    check: {
      optionValues: ['10 2 5', '8 1 4', '6 1 4', '7 1 4'],
      compute: () => {
        let [x, y, z] = [1, 2, 3];
        [x, y] = [y, x];
        z = x = y + z;
        x += z;
        return `${x} ${y} ${z}`;
      },
    },
    python: { stdout: '8 1 4\n' },
  },
  {
    id: 'variables-operators-019',
    subtopic: 'variables-operators',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(7 + 3 % 4 * 2 - 10 // 3 ** 2)' },
    options: ['`12`', '`4`', '`-1`', '`8`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Precedence (highest first): `**`; then `*`, `/`, `//`, `%` left to right; then `+`, `-` left to right.\n\n' +
        '1. `**`: `3 ** 2` is `9`. Now: `7 + 3 % 4 * 2 - 10 // 9`.\n' +
        '2. `%`, `*`, `//` from left to right: `3 % 4` is `3` (4 goes into 3 zero times, remainder 3); `3 * 2` is `6`; `10 // 9` is `1`. Now: `7 + 6 - 1`.\n' +
        '3. `+` and `-` left to right: $7 + 6 = 13$, $13 - 1 = 12$.\n\n' +
        'Output: `12`.',
      whyWrong: [
        null,
        'This does `10 // 3` before the power, then squares: $(10 \\,//\\, 3)^2 = 9$, giving $7 + 6 - 9 = 4$. But `**` comes first, so it is $10 \\,//\\, 9 = 1$.',
        'This does `**` first but then everything else strictly left to right, including the `+`: $(7 + 3) \\bmod 4 = 2$, $2 \\times 2 = 4$, $4 - 10 = -6$, $-6 \\,//\\, 9 = -1$. In Python `%`, `*` and `//` all happen before `+` and `-`.',
        'This works out `3 % 4` as 1 (as if it were $4 \\bmod 3$). When the first number is smaller, the remainder is the first number itself: `3 % 4` is 3.',
      ],
      keyIdea: '`**` first, then `* / // %` left to right, then `+ -`; and when a is a smaller positive number than b, `a % b` is just a.',
    },
    check: { optionValues: [12, 4, -1, 8], compute: () => 7 + pmod(3, 4) * 2 - fdiv(10, 3 ** 2) },
    python: { stdout: '12\n' },
  },
];
