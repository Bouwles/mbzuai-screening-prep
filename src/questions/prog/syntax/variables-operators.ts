import type { StaticQuestion } from '../../../types';

const L = (...lines: string[]) => lines.join('\n');

// Integer division and remainder, used by the answer checks below.
const div = (a: number, b: number): number => Math.floor(a / b);
const mod = (a: number, b: number): number => a - b * Math.floor(a / b);

const TWO_LINES = 'What does this pseudocode print? Output lines are shown separated by a space.';
const POWER = 'In this pseudocode, `^` means "to the power of". What is printed?';

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'variables-operators-001',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: TWO_LINES,
    code: { lang: 'pseudocode', source: L('print(div(17,5)) // div is integer division', 'print(mod(17,5)) // mod is the modulus operator') },
    options: ['`3.4 2`', '`3 2`', '`2 3`', '`3 0.4`'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`div(a,b)` is **integer division**: divide, then keep only the whole-number part. `mod(a,b)` is the **remainder** left over.\n\n' +
        '1. $17 \\div 5 = 3.4$, and the whole-number part is 3, so `div(17,5)` is `3`.\n' +
        '2. Five goes into 17 three times, using up $3 \\times 5 = 15$. What is left is $17 - 15 = 2$, so `mod(17,5)` is `2`.\n\n' +
        'Output: `3` then `2`.',
      whyWrong: [
        'This uses ordinary division for the first value. $17 \\div 5$ is 3.4, but `div` keeps only the whole-number part, 3.',
        null,
        'This swaps the two results. The first line prints the quotient `div(17,5)` and the second prints the remainder `mod(17,5)`.',
        'This treats `mod` as the decimal part of the division (the 0.4 in 3.4). `mod` is the whole-number remainder: 17 minus 15 leaves 2.',
      ],
      keyIdea: '`div(a,b)` is how many whole times b fits into a, and `mod(a,b)` is what is left over.',
    },
    check: { optionValues: ['3.4 2', '3 2', '2 3', '3 0.4'], compute: () => `${div(17, 5)} ${mod(17, 5)}` },
  },
  {
    id: 'variables-operators-003',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'Which of these is a **valid** variable name in most programming languages?',
    options: ['`2nd_place`', '`_count2`', '`total-score`', '`for`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Variable names follow three rules:\n\n' +
        '- use only letters, digits and underscores `_`\n' +
        '- must **not start with a digit**\n' +
        '- must not be a reserved keyword such as `for`, `if` or `while`\n\n' +
        'Checking each one:\n\n' +
        '- `2nd_place` starts with a digit: invalid.\n' +
        '- `_count2` uses only an underscore, letters and a digit, and starts with an underscore: **valid**.\n' +
        '- `total-score` contains `-`, which is read as a minus sign (`total` minus `score`): invalid.\n' +
        '- `for` is a keyword used for loops: invalid.\n\n' +
        'Answer: `_count2`.',
      whyWrong: [
        'A variable name cannot start with a digit. Digits are allowed only after the first character, as in `place_2nd`.',
        null,
        'The hyphen is the minus operator, so this would be read as `total - score`. Use an underscore instead: `total_score`.',
        '`for` is a reserved keyword (it starts a loop), so it cannot be used as a variable name.',
      ],
      keyIdea: 'Names use letters, digits and underscores, cannot start with a digit, and cannot be a keyword.',
    },
  },
  {
    id: 'variables-operators-004',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source: L('x = 5', 'x = x + 3', 'x = x * 2', 'print(x)') },
    options: ['`10`', '`13`', '`8`', '`16`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each line works out the right-hand side using the **current** value of `x`, then stores the result back in `x`. The lines run top to bottom.\n\n' +
        '| Line | x |\n| --- | --- |\n| `x = 5` | 5 |\n| `x = x + 3` | 8 |\n| `x = x * 2` | 16 |\n\n' +
        'Output: `16`.',
      whyWrong: [
        'This multiplies the original 5 by 2 and ignores the line that added 3. Each line uses the latest value of `x`, which is 8 by then.',
        'This runs the lines in the wrong order: doubling 5 first ($10$) and then adding 3. Code runs top to bottom, so the 3 is added first.',
        'This is the value after `x = x + 3`, forgetting that `x = x * 2` changes `x` again before it is printed.',
        null,
      ],
      keyIdea: '`x = x + 3` is an instruction, not an equation: work out the right side with the current x, then overwrite x.',
    },
    check: {
      optionValues: [10, 13, 8, 16],
      compute: () => {
        let x = 5;
        x = x + 3;
        x = x * 2;
        return x;
      },
    },
  },
  {
    id: 'variables-operators-021',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does the statement `x = 5` do?',
    options: ['Stores 5 in `x`', 'Tests whether `x` equals 5', 'Prints 5', 'Stores `x` in 5'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A single `=` is **assignment**. The value on the right is stored in the variable on the left, replacing whatever was there.\n\n' +
        'So `x = 5` stores 5 in `x`. Testing for equality is written with a double equals sign, `x == 5`.',
      whyWrong: [
        null,
        'That is the job of `==`. A single `=` stores a value and does not ask a question.',
        'Nothing is displayed unless the code calls `print`. Assignment only changes what the variable holds.',
        'Assignment always stores into the variable on the left. A number such as 5 cannot hold a value.',
      ],
      keyIdea: '`=` stores the right-hand value in the left-hand variable; `==` compares two values.',
    },
  },
  {
    id: 'variables-operators-022',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does `mod(a,b)` return?',
    options: ['The remainder of $a \\div b$', 'The whole-number part of $a \\div b$', 'The product of $a$ and $b$', 'The decimal value of $a \\div b$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`mod` is the **modulus** operator: it returns the remainder after dividing $a$ by $b$.\n\n' +
        'For example, $17 = 3 \\times 5 + 2$, so `mod(17,5)` is 2.',
      whyWrong: [
        null,
        'That is `div(a,b)`, integer division. `mod` returns what is left over after that division.',
        'Multiplication is written `a * b`. `mod` is about division.',
        'That is `a / b`, ordinary division. `mod` returns only the whole-number remainder.',
      ],
      keyIdea: '`mod(a,b)` is the remainder when a is divided by b.',
    },
    check: { optionValues: [2, 3, 85, 3.4], compute: () => mod(17, 5) },
  },
  {
    id: 'variables-operators-023',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'Which data type holds only the values `true` and `false`?',
    options: ['Boolean', 'Integer', 'String', 'Float'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **Boolean** has exactly two possible values, `true` and `false`. Comparisons such as `x > 3` produce a Boolean.\n\n' +
        'Answer: Boolean.',
      whyWrong: [
        null,
        'An integer is a whole number such as 7 or $-3$.',
        'A string is text, a sequence of characters such as `"cat"`.',
        'A float is a number with a decimal part, such as 2.5.',
      ],
      keyIdea: 'A Boolean is a true or false value.',
    },
  },
  {
    id: 'variables-operators-024',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'Which data type is the best fit for the value `3.75`?',
    options: ['Float', 'Integer', 'Boolean', 'String'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **float** (short for floating-point number, also called a real number) stores a number with a decimal part. `3.75` has a decimal part, so it is a float.\n\n' +
        'Answer: Float.',
      whyWrong: [
        null,
        'Integers are whole numbers only, so they cannot hold the 0.75.',
        'A Boolean can only be `true` or `false`.',
        'A string would need quotes, as in `"3.75"`, and could not be used in arithmetic as a number.',
      ],
      keyIdea: 'Whole numbers are integers; numbers with a decimal part are floats.',
    },
  },
  {
    id: 'variables-operators-025',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source: L('a = "5"', 'b = "3"', 'print(a + b)') },
    options: ['`53`', '`8`', '`35`', '`Error`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The quotes make `a` and `b` **strings** (text), not numbers. With two strings, `+` **joins** them.\n\n' +
        '`"5" + "3"` is `"53"`, and `print` shows it without the quotes.\n\n' +
        'Output: `53`.',
      whyWrong: [
        null,
        'This treats `"5"` and `"3"` as numbers. In quotes they are text, and `+` joins text.',
        'This joins them in the wrong order. `a + b` puts `a` first.',
        'Joining two strings with `+` is allowed. Nothing here goes wrong.',
      ],
      keyIdea: '`+` adds numbers but joins strings, so the type of a value changes what an operator does.',
    },
    check: {
      optionValues: ['53', 8, '35', null],
      compute: () => {
        const a = '5';
        const b = '3';
        return a + b;
      },
    },
  },
  {
    id: 'variables-operators-028',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: 'For a positive whole number $n$, which expression gives its last digit?',
    options: ['`mod(n,10)`', '`div(n,10)`', '`n / 10`', '`mod(10,n)`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Dividing by 10 leaves the last digit as the remainder. For $n = 374$: $374 = 37 \\times 10 + 4$, so `mod(374,10)` is 4.\n\n' +
        'Answer: `mod(n,10)`.',
      whyWrong: [
        null,
        'This removes the last digit and keeps the rest: `div(374,10)` is 37.',
        'This is ordinary division: 374 divided by 10 is 37.4.',
        'The two inputs are the wrong way round. `mod(10,374)` is 10, the remainder of 10 divided by 374.',
      ],
      keyIdea: '`mod(n,10)` keeps the last digit and `div(n,10)` removes it.',
    },
    check: { optionValues: [4, 37, 37.4, 10], compute: () => mod(374, 10) },
  },
  {
    id: 'variables-operators-030',
    subtopic: 'variables-operators',
    difficulty: 'foundation',
    stem: '`/` is ordinary division. What does this pseudocode print? Output lines are shown separated by a space.',
    code: { lang: 'pseudocode', source: L('a = 7', 'b = 2', 'print(a / b)', 'print(div(a,b)) // div is integer division') },
    options: ['`3.5 3`', '`3 3`', '`3.5 3.5`', '`3 3.5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`/` keeps the decimal part, while `div` keeps only the whole-number part.\n\n' +
        '1. `a / b` is $7 \\div 2 = 3.5$.\n' +
        '2. `div(a,b)` is 3, the whole-number part of 3.5.\n\n' +
        'Output: `3.5` then `3`.',
      whyWrong: [
        null,
        'This treats `/` as integer division too. Only `div` drops the decimal part.',
        'This treats `div` as ordinary division. `div` drops the 0.5.',
        'This has the two operators the wrong way round: `/` gives 3.5 and `div` gives 3.',
      ],
      keyIdea: '`a / b` keeps the decimal part and `div(a,b)` drops it.',
    },
    check: { optionValues: ['3.5 3', '3 3', '3.5 3.5', '3 3.5'], compute: () => `${7 / 2} ${div(7, 2)}` },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'variables-operators-007',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: POWER,
    code: { lang: 'pseudocode', source: L('x = 2 + 3 * 4 ^ 2', 'print(x)') },
    options: ['`50`', '`80`', '`146`', '`196`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The order of operations is brackets, then powers, then `*` and `/`, then `+` and `-`.\n\n' +
        '1. Power first: `4 ^ 2` is 16, giving `2 + 3 * 16`.\n' +
        '2. Then multiply: `3 * 16` is 48, giving `2 + 48`.\n' +
        '3. Finally add: `2 + 48` is 50.\n\n' +
        'Output: `50`.',
      whyWrong: [
        null,
        'This adds first: $(2 + 3) \\times 16 = 80$. Multiplication comes before addition.',
        'This multiplies before squaring: $2 + (3 \\times 4)^2 = 146$. The power applies only to the 4.',
        'This squares everything to its left: $(2 + 3 \\times 4)^2 = 196$. The power applies only to the 4.',
      ],
      keyIdea: 'Powers come first, then multiplication and division, then addition and subtraction.',
    },
    check: { optionValues: [50, 80, 146, 196], compute: () => 2 + 3 * 4 ** 2 },
  },
  {
    id: 'variables-operators-008',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source: L('a = 3', 'b = 8', 'a = b', 'b = a + b', 'print(b)') },
    options: ['`16`', '`11`', '`8`', '`6`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Lines run one at a time, so each line sees the changes made by the lines above it.\n\n' +
        '| Line | a | b |\n| --- | --- | --- |\n| `a = 3` | 3 | |\n| `b = 8` | 3 | 8 |\n| `a = b` | 8 | 8 |\n| `b = a + b` | 8 | 16 |\n\n' +
        'Output: `16`.',
      whyWrong: [
        null,
        'This uses the old value of `a` in the last line ($3 + 8$). By then `a` has already become 8.',
        'This stops after `a = b` and forgets that `b = a + b` changes `b` before it is printed.',
        'This reads `a = b` backwards, as copying `a` into `b`. Then both would be 3 and the sum 6. Assignment always stores into the variable on the left.',
      ],
      keyIdea: 'Assignments happen one line at a time, so a later line uses the values already updated.',
    },
    check: {
      optionValues: [16, 11, 8, 6],
      compute: () => {
        let a = 3;
        let b = 8;
        a = b;
        b = a + b;
        return b;
      },
    },
  },
  {
    id: 'variables-operators-012',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('n = 3874', 'd = mod(div(n,100),10) // div is integer division, mod is the modulus operator', 'print(d)'),
    },
    options: ['`7`', '`38`', '`3`', '`8`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Work from the inside out.\n\n' +
        '1. `div(n,100)`: $3874 \\div 100 = 38.74$, and the whole-number part is 38. Integer division by 100 removes the last two digits.\n' +
        '2. `mod(38,10)`: $38 = 3 \\times 10 + 8$, so the remainder is 8. The remainder after dividing by 10 is the last digit.\n\n' +
        'So `d` is the **hundreds digit** of 3874.\n\n' +
        'Output: `8`.',
      whyWrong: [
        'This is the tens digit, `div(mod(n,100),10)`. Dividing by 100 first removes the tens and units, so the last digit left is the hundreds digit.',
        'This stops after `div(n,100)` and forgets the `mod`, which keeps only the last digit of 38.',
        'This is the thousands digit, which you would get from `div(n,1000)`. Dividing by 100 leaves 38, whose last digit is 8.',
        null,
      ],
      keyIdea: 'Integer division by $10^k$ removes the last $k$ digits and `mod` by 10 keeps the last digit, so together they pick out one digit.',
    },
    check: { optionValues: [7, 38, 3, 8], compute: () => mod(div(3874, 100), 10) },
  },
  {
    id: 'variables-operators-013',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: POWER,
    code: {
      lang: 'pseudocode',
      source: L('x = 6', 'x = x ^ 2', 'x = div(x,5) // div is integer division', 'x = mod(x,4) // mod is the modulus operator', 'print(x)'),
    },
    options: ['`3`', '`3.2`', '`7`', '`0`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each line uses the current value of `x`.\n\n' +
        '| Line | Working | x |\n| --- | --- | --- |\n' +
        '| `x = 6` | | 6 |\n' +
        '| `x = x ^ 2` | $6^2$ | 36 |\n' +
        '| `x = div(x,5)` | $36 \\div 5 = 7.2$, whole-number part | 7 |\n' +
        '| `x = mod(x,4)` | $7 = 1 \\times 4 + 3$ | 3 |\n\n' +
        'Output: `3`.',
      whyWrong: [
        null,
        'This does `div` as ordinary division, giving $7.2$, and then takes the remainder $3.2$. But `div` drops the decimal part and gives 7.',
        'This is the value after `x = div(x,5)`, forgetting the line that replaces 7 by its remainder when divided by 4.',
        'This reads `x ^ 2` as $2^x$, giving $2^6 = 64$, then 12, then 0. It means $x^2$, so $6^2 = 36$.',
      ],
      keyIdea: 'Trace updates one line at a time, always using the latest value of the variable.',
    },
    check: {
      optionValues: [3, 3.2, 7, 0],
      compute: () => {
        let x = 6;
        x = x ** 2;
        x = div(x, 5);
        x = mod(x, 4);
        return x;
      },
    },
  },
  {
    id: 'variables-operators-026',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'In Python, `//` is integer division and `%` is the remainder. What does this Python code print?',
    code: { lang: 'python', source: L('n = 29', 'q = n // 4', 'r = n % 4', 'print(q + r)') },
    options: ['`8`', '`7`', '`1`', '`8.25`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Python writes integer division as `//` and the remainder as `%`.\n\n' +
        '1. `n // 4`: $29 \\div 4 = 7.25$, and the whole-number part is 7, so `q` is 7.\n' +
        '2. `n % 4`: $29 = 7 \\times 4 + 1$, so `r` is 1.\n' +
        '3. `q + r` is $7 + 1 = 8$.\n\n' +
        'Output: `8`.',
      whyWrong: [
        null,
        'This is `q` alone. The last line prints `q + r`.',
        'This is `r` alone. The last line prints `q + r`.',
        'This treats `//` as ordinary division, giving 7.25. `//` drops the decimal part.',
      ],
      keyIdea: 'In Python, `//` matches `div` and `%` matches `mod`.',
    },
    check: { optionValues: [8, 7, 1, 8.25], compute: () => div(29, 4) + mod(29, 4) },
    python: { stdout: '8\n' },
  },
  {
    id: 'variables-operators-027',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'This pseudocode tries to swap `a` and `b`. What does it print? Output lines are shown separated by a space.',
    code: { lang: 'pseudocode', source: L('a = 4', 'b = 9', 'a = b', 'b = a', 'print(a)', 'print(b)') },
    options: ['`9 4`', '`9 9`', '`4 4`', '`4 9`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Follow the values line by line.\n\n' +
        '| Line | a | b |\n| --- | --- | --- |\n| `a = 4` | 4 | |\n| `b = 9` | 4 | 9 |\n| `a = b` | 9 | 9 |\n| `b = a` | 9 | 9 |\n\n' +
        'The old value of `a` is lost on the third line. A correct swap saves it first: `t = a`, then `a = b`, then `b = t`.\n\n' +
        'Output: `9` then `9`.',
      whyWrong: [
        'This is what a correct swap would give. Here the 4 is overwritten before it can be copied into `b`.',
        null,
        'This reads each assignment backwards, as copying from left to right. `a = b` stores `b` into `a`.',
        'This assumes nothing changed. `a = b` does change `a`.',
      ],
      keyIdea: 'Swapping two variables needs a temporary variable, because each assignment overwrites a value.',
    },
    check: {
      optionValues: ['9 4', '9 9', '4 4', '4 9'],
      compute: () => {
        let a = 4;
        let b = 9;
        a = b;
        b = a;
        return `${a} ${b}`;
      },
    },
  },
  {
    id: 'variables-operators-029',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: {
      lang: 'pseudocode',
      source: L('t = 200', 'm = div(t,60) // div is integer division', 's = mod(t,60) // mod is the modulus operator', 'print(m * 100 + s)'),
    },
    options: ['`320`', '`2003`', '`360`', '`23`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. `div(200,60)`: $200 \\div 60 \\approx 3.33$, so `m` is 3.\n' +
        '2. `mod(200,60)`: $200 = 3 \\times 60 + 20$, so `s` is 20.\n' +
        '3. Multiply first: $3 \\times 100 = 300$, then add: $300 + 20 = 320$.\n\n' +
        'Output: `320`.',
      whyWrong: [
        null,
        'This swaps `m` and `s`: $20 \\times 100 + 3$. `div` gives the 3 and `mod` gives the 20.',
        'This adds before multiplying: $3 \\times (100 + 20)$. Multiplication comes first.',
        'This leaves out the multiplication by 100 and just adds $3 + 20$.',
      ],
      keyIdea: '`div` and `mod` by the same number split a value into a quotient and a remainder.',
    },
    check: { optionValues: [320, 2003, 360, 23], compute: () => div(200, 60) * 100 + mod(200, 60) },
  },
  {
    id: 'variables-operators-031',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source: L('x = 3', 'y = x + 4', 'x = y * 3', 'y = x - y', 'print(y)') },
    options: ['`14`', '`7`', '`21`', '`-4`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '| Line | x | y |\n| --- | --- | --- |\n| `x = 3` | 3 | |\n| `y = x + 4` | 3 | 7 |\n| `x = y * 3` | 21 | 7 |\n| `y = x - y` | 21 | 14 |\n\n' +
        'Output: `14`.',
      whyWrong: [
        null,
        'This is the old value of `y`, forgetting the line `y = x - y`.',
        'This is the value of `x`. The code prints `y`.',
        'This uses the first value of `x` in the last line ($3 - 7$). By then `x` is 21.',
      ],
      keyIdea: 'Keep a trace table and update one variable per line, using the latest values on the right-hand side.',
    },
    check: {
      optionValues: [14, 7, 21, -4],
      compute: () => {
        let x = 3;
        let y = x + 4;
        x = y * 3;
        y = x - y;
        return y;
      },
    },
  },
  {
    id: 'variables-operators-032',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this pseudocode print?',
    code: { lang: 'pseudocode', source: 'print(20 - mod(17,5) * 3) // mod is the modulus operator' },
    options: ['`14`', '`54`', '`18`', '`11`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Function calls are worked out first: `mod(17,5)` is 2.\n' +
        '2. Multiply before subtracting: $2 \\times 3 = 6$.\n' +
        '3. Subtract: $20 - 6 = 14$.\n\n' +
        'Output: `14`.',
      whyWrong: [
        null,
        'This subtracts first: $(20 - 2) \\times 3 = 54$. Multiplication comes before subtraction.',
        'This forgets the `* 3` and works out $20 - 2$.',
        'This uses the quotient 3 instead of the remainder 2: $20 - 3 \\times 3 = 11$. `mod` gives what is left over.',
      ],
      keyIdea: 'Work out `mod` first, then apply the usual order: multiplication before subtraction.',
    },
    check: { optionValues: [14, 54, 18, 11], compute: () => 20 - mod(17, 5) * 3 },
  },
  {
    id: 'variables-operators-033',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'What does this Python code print? (`//` is integer division and `%` is the remainder.)',
    code: { lang: 'python', source: L('a = 9', 'b = a // 2', 'a = a % 2', 'print(a + b * 3)') },
    options: ['`13`', '`15`', '`14.5`', '`21`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '| Line | a | b |\n| --- | --- | --- |\n| `a = 9` | 9 | |\n| `b = a // 2` | 9 | 4 |\n| `a = a % 2` | 1 | 4 |\n\n' +
        'Then multiply before adding: $1 + 4 \\times 3 = 1 + 12 = 13$.\n\n' +
        'Output: `13`.',
      whyWrong: [
        null,
        'This adds before multiplying: $(1 + 4) \\times 3$. Multiplication comes first.',
        'This treats `//` as ordinary division, so `b` becomes 4.5. `//` drops the decimal part.',
        'This keeps the old `a` of 9, forgetting that `a = a % 2` changed it to 1.',
      ],
      keyIdea: 'Trace Python variables line by line; `//` drops the decimal part and `%` gives the remainder.',
    },
    check: {
      optionValues: [13, 15, 14.5, 21],
      compute: () => {
        let a = 9;
        const b = div(a, 2);
        a = mod(a, 2);
        return a + b * 3;
      },
    },
    python: { stdout: '13\n' },
  },
  {
    id: 'variables-operators-034',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    stem: 'Let $q$ = `div(a,b)` and $r$ = `mod(a,b)` for positive integers $a$ and $b$. Which statement is always true?',
    options: ['$a = b \\times q + r$', '$a = q \\times r + b$', '$b = a \\times q + r$', '$a = b + q + r$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Here $q$ is the **integer quotient**, the number of whole times $b$ fits into $a$, and $r$ is the remainder left over.\n\n' +
        'So $a$ is made up of $q$ copies of $b$ plus the remainder: $a = b \\times q + r$.\n\n' +
        'Check with $a = 17$, $b = 5$: $q = 3$, $r = 2$, and $5 \\times 3 + 2 = 17$.',
      whyWrong: [
        null,
        'This multiplies the quotient by the remainder. With $a = 17$, $b = 5$ it gives $3 \\times 2 + 5 = 11$, not 17.',
        'This has $a$ and $b$ the wrong way round. With $a = 17$, $b = 5$ it gives $17 \\times 3 + 2 = 53$, not 5.',
        'This adds the quotient instead of multiplying by it. With $a = 17$, $b = 5$ it gives $5 + 3 + 2 = 10$, not 17.',
      ],
      keyIdea: 'Division with remainder always satisfies $a = b \\times q + r$.',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const tests = [
          (a: number, b: number, q: number, r: number) => a === b * q + r,
          (a: number, b: number, q: number, r: number) => a === q * r + b,
          (a: number, b: number, q: number, r: number) => b === a * q + r,
          (a: number, b: number, q: number, r: number) => a === b + q + r,
        ];
        const always = tests.map((f, i) => ({ f, i })).filter(({ f }) => {
          for (let a = 1; a <= 40; a++) for (let b = 1; b <= 12; b++) if (!f(a, b, div(a, b), mod(a, b))) return false;
          return true;
        });
        return always.length === 1 ? always[0].i : -1;
      },
    },
  },
];
