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
      asking: 'What two numbers do `div(17,5)` and `mod(17,5)` give?',
      solution:
        '`div(a,b)` asks how many whole times `b` fits into `a`. Any decimal part is thrown away. `mod(a,b)` asks what is left over after that. The leftover is called the **remainder**.\n\n' +
        'Line 1 works out `div(17,5)`. Count up in fives: 5, 10, 15, and the next one, 20, is too big. So 5 fits into 17 three whole times, and line 1 prints 3.\n\n' +
        'Line 2 works out `mod(17,5)`. Three fives make 15, and $17 - 15 = 2$. So 2 is left over, and line 2 prints 2.',
      conclusion: 'Line 1 prints 3 and line 2 prints 2, so the output is `3 2`.',
      whyWrong: [
        'This uses ordinary division for the first value. $17 \\div 5$ is 3.4, but `div` keeps only the whole-number part, 3.',
        null,
        'This swaps the two results. The first line prints the quotient `div(17,5)` and the second prints the remainder `mod(17,5)`.',
        'This treats `mod` as the decimal part of the division (the 0.4 in 3.4). `mod` is the whole-number remainder: 17 minus 15 leaves 2.',
      ],
      keyIdea: 'For `div(a,b)` and `mod(a,b)`, find the biggest multiple of `b` that fits in `a`. How many times `b` fits is the `div`. The gap between that multiple and `a` is the `mod`.',
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
      asking: 'Which of these could a programmer use as the name of a variable?',
      solution:
        'A variable name follows three common rules. It uses only letters, digits and underscores (`_`). It cannot start with a digit. It cannot be a **reserved word**, which is a word the language keeps for itself, such as `for` or `if`.\n\n' +
        'Test each name against those rules:\n\n| Name | Problem |\n|---|---|\n| `2nd_place` | starts with a digit |\n| `total-score` | has a hyphen, which means minus |\n| `for` | reserved word that starts a loop |\n| `_count2` | none |\n\n' +
        'Only `_count2` breaks no rule.',
      conclusion: 'It starts with an underscore and uses only letters and a digit, so the valid name is `_count2`.',
      whyWrong: [
        'A variable name cannot start with a digit. Digits are allowed only after the first character, as in `place_2nd`.',
        null,
        'The hyphen is the minus operator, so this would be read as `total - score`. Use an underscore instead: `total_score`.',
        '`for` is a reserved keyword (it starts a loop), so it cannot be used as a variable name.',
      ],
      keyIdea: 'To test a variable name, check three things: only letters, digits and underscores; no digit at the start; not a reserved word such as `for`, `if` or `while`.',
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
      asking: 'What number does `x` hold by the time line 4 prints it?',
      solution:
        'The `=` sign means "work out the right side, then store the result in the variable on the left". The old value is replaced.\n\n' +
        'Lines run from top to bottom, and each line uses the newest value of `x`:\n\n| Line | Working | `x` becomes |\n|---|---|---|\n| 1 | store 5 | 5 |\n| 2 | $5 + 3$ | 8 |\n| 3 | $8 \\times 2$ | 16 |\n\n' +
        'Line 4 prints `x`, which now holds 16.',
      conclusion: 'After all three assignments `x` holds 16, so the answer is `16`.',
      whyWrong: [
        'This multiplies the original 5 by 2 and ignores the line that added 3. Each line uses the latest value of `x`, which is 8 by then.',
        'This runs the lines in the wrong order: doubling 5 first ($10$) and then adding 3. Code runs top to bottom, so the 3 is added first.',
        'This is the value after `x = x + 3`, forgetting that `x = x * 2` changes `x` again before it is printed.',
        null,
      ],
      keyIdea: 'To trace assignments, draw a table with one row per line and one column per variable. Update only the variable on the left of `=`, and always use its newest value on the right.',
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
      asking: 'What happens when the computer runs `x = 5`?',
      solution:
        'A **variable** is a named box that holds a value. Here the box is called `x`.\n\n' +
        'In code, a single `=` is an instruction, and it doesn\'t ask a question. It means "put the value on the right into the variable on the left".\n\n' +
        'So 5 goes into the box called `x`. Nothing is printed and nothing is compared.',
      conclusion: 'The value on the right goes into the variable on the left, which is exactly this: Stores 5 in `x`.',
      whyWrong: [
        null,
        'That is the job of `==`. A single `=` stores a value and does not ask a question.',
        'Nothing is displayed unless the code calls `print`. Assignment only changes what the variable holds.',
        'Assignment always stores into the variable on the left. A number such as 5 cannot hold a value.',
      ],
      keyIdea: 'Read `=` as "becomes": `x = 5` says "`x` becomes 5". The value moves from right to left. To test whether two things are equal, code uses `==` instead.',
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
      asking: 'What does the function `mod` give you when you put in `a` and `b`?',
      solution:
        'Try a real example, `mod(17,5)`. Share 17 into whole groups of 5. Three groups fit, which uses up 15.\n\n' +
        'That leaves $17 - 15 = 2$, and `mod(17,5)` is 2. So `mod` gives what is left over after dividing, which is called the **remainder**.',
      conclusion: '`mod` gives the leftover part of the division, so the answer is: The remainder of $a \\div b$.',
      whyWrong: [
        null,
        'That is `div(a,b)`, integer division. `mod` returns what is left over after that division.',
        'Multiplication is written `a * b`. `mod` is about division.',
        'That is `a / b`, ordinary division. `mod` returns only the whole-number remainder.',
      ],
      keyIdea: 'Keep the three divisions apart with one example. $17 \\div 5$ is 3 remainder 2, so `div(17,5)` is 3 and `mod(17,5)` is 2. Ordinary `17 / 5` is 3.4.',
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
      asking: 'What is the name of the data type that can only be true or false?',
      solution:
        'A **data type** says what kind of value something is: a whole number, a decimal, some text, and so on.\n\n' +
        'The type with only two possible values, `true` and `false`, is called **Boolean**. A condition such as `x > 3` produces this type.',
      conclusion: 'Only one type is limited to `true` and `false`, and that is Boolean.',
      whyWrong: [
        null,
        'An integer is a whole number such as 7 or $-3$.',
        'A string is text, a sequence of characters such as `"cat"`.',
        'A float is a number with a decimal part, such as 2.5.',
      ],
      keyIdea: 'Match the value to its type: a whole number is an Integer, a number with a decimal point is a Float, text in quotes is a String, and `true` or `false` is a Boolean.',
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
      asking: 'Which type of value is a number with a decimal part, such as `3.75`?',
      solution:
        '`3.75` has a decimal part, the `.75`. An Integer holds whole numbers only, so it can\'t store this value.\n\n' +
        'It has no quote marks, so it isn\'t text. It isn\'t `true` or `false` either.\n\n' +
        'A number with a decimal part is stored as a **Float**.',
      conclusion: 'A number with a decimal point needs a type that keeps the decimal part, and that type is Float.',
      whyWrong: [
        null,
        'Integers are whole numbers only, so they cannot hold the 0.75.',
        'A Boolean can only be `true` or `false`.',
        'A string would need quotes, as in `"3.75"`, and could not be used in arithmetic as a number.',
      ],
      keyIdea: 'Look at the shape of the value: a decimal point means Float, plain whole digits mean Integer, quote marks mean String, and `true` or `false` means Boolean.',
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
      asking: 'What do you get when you use `+` on the two pieces of text `"5"` and `"3"`?',
      solution:
        'Lines 1 and 2 use quote marks, so `a` and `b` hold **strings**, which means text. Here `"5"` is the character 5, and it can\'t be added like the number five.\n\n' +
        'On strings, `+` joins them end to end. This is called concatenation.\n\n' +
        '`a + b` puts `a` first and then `b`, so the characters 5 and 3 sit side by side and line 3 prints 53.',
      conclusion: 'The two characters are joined with `a` first, so the output is `53`.',
      whyWrong: [
        null,
        'This treats `"5"` and `"3"` as numbers. In quotes they are text, and `+` joins text.',
        'This joins them in the wrong order. `a + b` puts `a` first.',
        'Joining two strings with `+` is allowed. Nothing here goes wrong.',
      ],
      keyIdea: 'Before working out a `+`, look for quote marks. Numbers add: `5 + 3` is 8. Strings join from left to right: `"5" + "3"` is `53`.',
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
      asking: 'Which expression picks out the last digit of a number?',
      solution:
        'Take an example: $n = 374$, whose last digit is 4. We need something that turns 374 into 4.\n\n' +
        'Share 374 into whole tens. 37 tens make 370, and $374 - 370 = 4$ is left over.\n\n' +
        'So the last digit is the **remainder** after dividing by 10. `mod` gives the remainder, so the expression is `mod(n,10)`.',
      conclusion: 'The remainder after dividing by 10 is always the last digit, so the answer is `mod(n,10)`.',
      whyWrong: [
        null,
        'This removes the last digit and keeps the rest: `div(374,10)` is 37.',
        'This is ordinary division: 374 divided by 10 is 37.4.',
        'The two inputs are the wrong way round. `mod(10,374)` is 10, the remainder of 10 divided by 374.',
      ],
      keyIdea: 'To split a number into digits, use 10. `mod(n,10)` keeps the last digit and `div(n,10)` removes it. For 374 these give 4 and 37.',
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
      asking: 'What are the results of `7 / 2` and `div(7,2)`?',
      solution:
        'Lines 1 and 2 store 7 in `a` and 2 in `b`.\n\n' +
        'Line 3 prints `a / b`, which is $7 \\div 2$. The question says `/` is ordinary division, so the decimal stays and the result is 3.5.\n\n' +
        'Line 4 prints `div(a,b)`. `div` is integer division: it keeps only the whole-number part and drops the rest. So 3.5 becomes 3.',
      conclusion: 'The first print gives 3.5 and the second gives 3, so the output is `3.5 3`.',
      whyWrong: [
        null,
        'This treats `/` as integer division too. Only `div` drops the decimal part.',
        'This treats `div` as ordinary division. `div` drops the 0.5.',
        'This has the two operators the wrong way round: `/` gives 3.5 and `div` gives 3.',
      ],
      keyIdea: 'When a snippet has both `/` and `div`, do the ordinary division first. `/` keeps that result. `div` cuts off everything after the decimal point, with no rounding up.',
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
      asking: 'What is $2 + 3 \\times 4^2$ when the operations are done in the right order?',
      solution:
        'Operations aren\'t simply done left to right. The order is powers first, then `*` and `/`, then `+` and `-`.\n\n' +
        'Do the power first. `4 ^ 2` means $4 \\times 4 = 16$. It applies only to the 4 right next to it. Now we have $2 + 3 \\times 16$.\n\n' +
        'Next, multiply: $3 \\times 16 = 48$. Now we have $2 + 48$.\n\n' +
        'Add last: $2 + 48 = 50$. That is stored in `x`, and line 2 prints it.',
      conclusion: 'Following the order power, multiply, add gives 50, so the answer is `50`.',
      whyWrong: [
        null,
        'This adds first: $(2 + 3) \\times 16 = 80$. Multiplication comes before addition.',
        'This multiplies before squaring: $2 + (3 \\times 4)^2 = 146$. The power applies only to the 4.',
        'This squares everything to its left: $(2 + 3 \\times 4)^2 = 196$. The power applies only to the 4.',
      ],
      keyIdea: 'For a long expression, rewrite it once per operation: powers, then `*` and `/`, then `+` and `-`. Each `^` applies only to the number directly before it.',
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
      asking: 'What number is in `b` after the last assignment?',
      solution:
        '`a = b` means "copy the value of `b` into `a`". The value goes from right to left, and `b` keeps its value.\n\n' +
        'So line 3 changes `a` from 3 to 8. When line 4 runs, `a` is 8 and no longer 3.\n\n' +
        'Here is every line, with `a` and `b` as they are after that line:\n\n| Line | Code | `a` | `b` |\n|---|---|---|---|\n| 1 | `a = 3` | 3 | |\n| 2 | `b = 8` | 3 | 8 |\n| 3 | `a = b` | 8 | 8 |\n| 4 | `b = a + b` | 8 | $8 + 8 = 16$ |\n\n' +
        'Line 5 prints `b`, which holds 16.',
      conclusion: 'By line 4, `a` has become 8, so `b` becomes $8 + 8 = 16$ and the answer is `16`.',
      whyWrong: [
        null,
        'This uses the old value of `a` in the last line ($3 + 8$). By then `a` has already become 8.',
        'This stops after `a = b` and forgets that `b = a + b` changes `b` before it is printed.',
        'This reads `a = b` backwards, as copying `a` into `b`. Then both would be 3 and the sum 6. Assignment always stores into the variable on the left.',
      ],
      keyIdea: 'Copying with `=` overwrites the left variable at once. Draw a table with one column per variable and change one cell per line. Later lines use the new value, never the old one.',
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
      asking: 'What do you get if you do `div(3874,100)`, and then `mod` of that result with 10?',
      solution:
        'Work from the inside out, like brackets in maths. The inner part is `div(n,100)`, and the outer `mod` uses its result.\n\n' +
        '`div` is integer division: how many whole times one number fits into another. $3874 \\div 100 = 38.74$, and `div` drops the decimal part, which leaves 38. In effect, this chops off the last two digits.\n\n' +
        '`mod` gives the remainder, which is what is left over after dividing. 10 fits into 38 three times, which makes 30, and $38 - 30 = 8$.',
      conclusion: 'The remainder is 8 and line 3 prints it, so the answer is `8`.',
      whyWrong: [
        'This is the tens digit, `div(mod(n,100),10)`. Dividing by 100 first removes the tens and units, so the last digit left is the hundreds digit.',
        'This stops after `div(n,100)` and forgets the `mod`, which keeps only the last digit of 38.',
        'This is the thousands digit, which you would get from `div(n,1000)`. Dividing by 100 leaves 38, whose last digit is 8.',
        null,
      ],
      keyIdea: 'To pick out one digit, first remove the digits to its right using `div` by 10, 100 or 1000. Then use `mod(...,10)` to keep the last digit that remains.',
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
      asking: 'What is in `x` after it has been squared, then put through `div`, then put through `mod`?',
      solution:
        'Each line uses the newest `x` and then replaces it. `div(a,b)` is how many whole times `b` fits in `a`. `mod(a,b)` is what is left over. For example, $7 \\div 2$ is 3 remainder 1.\n\n' +
        'Now go line by line:\n\n| Line | Working | `x` becomes |\n|---|---|---|\n| 1 | store 6 | 6 |\n| 2 | $6^2 = 6 \\times 6$ | 36 |\n| 3 | `div(36,5)`: $5 \\times 7 = 35$ fits and $5 \\times 8 = 40$ is too big | 7 |\n| 4 | `mod(7,4)`: $4 \\times 1 = 4$ fits and $7 - 4 = 3$ is left | 3 |\n\n' +
        'Line 5 prints `x`, which holds 3.',
      conclusion: 'After the three updates `x` holds 3, so the answer is `3`.',
      whyWrong: [
        null,
        'This does `div` as ordinary division, giving $7.2$, and then takes the remainder $3.2$. But `div` drops the decimal part and gives 7.',
        'This is the value after `x = div(x,5)`, forgetting the line that replaces 7 by its remainder when divided by 4.',
        'This reads `x ^ 2` as $2^x$, giving $2^6 = 64$, then 12, then 0. It means $x^2$, so $6^2 = 36$.',
      ],
      keyIdea: 'When one variable is overwritten line after line, keep one column for it and one row per line. For `div` and `mod`, find the biggest multiple that fits: how many times gives `div`, and the gap gives `mod`.',
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
      asking: 'What is the whole-number part of $29 \\div 4$ added to the remainder of $29 \\div 4$?',
      solution:
        '`n // 4` means how many whole times 4 fits into `n`. `n % 4` means what is left over after that.\n\n' +
        '$4 \\times 7 = 28$ fits into 29, and $4 \\times 8 = 32$ is too big. So 4 fits 7 whole times, and line 2 stores 7 in `q`.\n\n' +
        'The leftover is $29 - 28 = 1$, so line 3 stores 1 in `r`.\n\n' +
        'Line 4 prints the sum: $7 + 1 = 8$.',
      conclusion: '`q` is 7 and `r` is 1, and they add to 8, so the answer is `8`.',
      whyWrong: [
        null,
        'This is `q` alone. The last line prints `q + r`.',
        'This is `r` alone. The last line prints `q + r`.',
        'This treats `//` as ordinary division, giving 7.25. `//` drops the decimal part.',
      ],
      keyIdea: 'Spot `//` and `%`, which are Python\'s versions of `div` and `mod`. Find the biggest multiple of the number you divide by that still fits. How many times gives `//`, and the gap gives `%`.',
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
      asking: 'What do `a` and `b` each hold after these two copying lines?',
      solution:
        '`a = b` copies the value of `b` into `a`. Whatever `a` held before is lost, because a variable holds only one value.\n\n' +
        'After lines 1 and 2, `a` is 4 and `b` is 9. Line 3 copies 9 into `a`, so the 4 is gone for good.\n\n' +
        'Line 4 copies `a` into `b`. But `a` is now 9, so `b` receives 9, the value it already had. Lines 5 and 6 print `a` and then `b`.',
      conclusion: 'The 4 was overwritten before it could be copied, so both variables hold 9 and the output is `9 9`.',
      whyWrong: [
        'This is what a correct swap would give. Here the 4 is overwritten before it can be copied into `b`.',
        null,
        'This reads each assignment backwards, as copying from left to right. `a = b` stores `b` into `a`.',
        'This assumes nothing changed. `a = b` does change `a`.',
      ],
      keyIdea: 'A real swap needs a third variable to keep one value safe: `t = a`, then `a = b`, then `b = t`. If you see two copies with no helper, both variables end up equal.',
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
      asking: 'Using the whole-number part and remainder of $200 \\div 60$, what is `m * 100 + s`?',
      solution:
        '`div(a,b)` is how many whole times `b` fits into `a`. `mod(a,b)` is what is left over. Count in sixties: 60, 120, 180, and the next one, 240, is too big.\n\n' +
        'So 60 fits into 200 three whole times, using up 180. Line 2 stores 3 in `m`.\n\n' +
        'The leftover is $200 - 180 = 20$, so line 3 stores 20 in `s`.\n\n' +
        'Line 4 works out `m * 100 + s`. Multiplication comes first: $3 \\times 100 = 300$. Then add: $300 + 20 = 320$.',
      conclusion: '`m` is 3 and `s` is 20, so the expression gives 320 and the answer is `320`.',
      whyWrong: [
        null,
        'This swaps `m` and `s`: $20 \\times 100 + 3$. `div` gives the 3 and `mod` gives the 20.',
        'This adds before multiplying: $3 \\times (100 + 20)$. Multiplication comes first.',
        'This leaves out the multiplication by 100 and just adds $3 + 20$.',
      ],
      keyIdea: '`div` and `mod` by 60 split seconds into minutes and seconds: 200 seconds is 3 minutes 20 seconds. In any mixed expression, work out the function calls first, then `*`, then `+`.',
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
      asking: 'What does `y` hold after all four assignments?',
      solution:
        'Each line works out its right side using the values at that moment, then stores the result in the variable on its left. The other variable stays the same.\n\n' +
        'Go through the four lines:\n\n| Line | Code | Working | `x` | `y` |\n|---|---|---|---|---|\n| 1 | `x = 3` | | 3 | |\n| 2 | `y = x + 4` | $3 + 4$ | 3 | 7 |\n| 3 | `x = y * 3` | $7 \\times 3$ | 21 | 7 |\n| 4 | `y = x - y` | $21 - 7$ | 21 | 14 |\n\n' +
        'Line 5 prints `y`, which holds 14.',
      conclusion: 'On line 4, `x` is 21 and `y` is 7, so `y` becomes 14 and the answer is `14`.',
      whyWrong: [
        null,
        'This is the old value of `y`, forgetting the line `y = x - y`.',
        'This is the value of `x`. The code prints `y`.',
        'This uses the first value of `x` in the last line ($3 - 7$). By then `x` is 21.',
      ],
      keyIdea: 'Draw one column per variable and one row per line, copying unchanged values down. In a line like `y = x - y`, use the old `y` on the right, and only then replace it.',
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
      asking: 'What is 20 minus three times the remainder of $17 \\div 5$?',
      solution:
        '`mod(17,5)` is the remainder when 17 is divided by 5. 5 fits into 17 three times, using up 15, and $17 - 15 = 2$. So `mod(17,5)` is 2.\n\n' +
        'Function calls are worked out first, so the expression becomes `20 - 2 * 3`.\n\n' +
        'Multiplication comes before subtraction: $2 \\times 3 = 6$. That leaves $20 - 6$.\n\n' +
        'Subtract last: $20 - 6 = 14$.',
      conclusion: 'Doing the `mod`, then the `*`, then the `-` gives 14, so the answer is `14`.',
      whyWrong: [
        null,
        'This subtracts first: $(20 - 2) \\times 3 = 54$. Multiplication comes before subtraction.',
        'This forgets the `* 3` and works out $20 - 2$.',
        'This uses the quotient 3 instead of the remainder 2: $20 - 3 \\times 3 = 11$. `mod` gives what is left over.',
      ],
      keyIdea: 'The order in any expression is function calls such as `mod` and `div`, then `*` and `/`, then `+` and `-`. Rewrite the expression after each operation so nothing gets missed.',
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
      asking: 'What is `a + b * 3` once `a` and `b` have been updated?',
      solution:
        '`//` gives how many whole times one number fits in another. `%` gives what is left over. $2 \\times 4 = 8$ and $9 - 8 = 1$, so $9 \\div 2$ is 4 with 1 left over.\n\n' +
        'Line 2 uses `a` as 9, so `b` becomes 4. Line 3 then **replaces** `a`, so `a` becomes 1 and the old 9 is gone.\n\n' +
        'Line 4 works out `a + b * 3` with the new values. Multiplication comes first: $4 \\times 3 = 12$. Then add: $1 + 12 = 13$.',
      conclusion: 'By the last line `a` is 1 and `b` is 4, so it prints 13 and the answer is `13`.',
      whyWrong: [
        null,
        'This adds before multiplying: $(1 + 4) \\times 3$. Multiplication comes first.',
        'This treats `//` as ordinary division, so `b` becomes 4.5. `//` drops the decimal part.',
        'This keeps the old `a` of 9, forgetting that `a = a % 2` changed it to 1.',
      ],
      keyIdea: 'Keep a table with one column per variable and use the values from the most recent line. Then apply the order: `//`, `%` and `*` before `+`.',
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
      asking: 'What rule links a number to the quotient and remainder you get when you divide it?',
      solution:
        'The **quotient** $q$ is `div(a,b)`: how many whole times $b$ fits in $a$. The **remainder** $r$ is `mod(a,b)`: what is left over.\n\n' +
        'Think of packing $a$ sweets into bags of $b$. You fill $q$ bags, which uses $b \\times q$ sweets, and $r$ sweets are left out. Together, those are all the sweets you started with.\n\n' +
        'Test it with $a = 17$ and $b = 5$. Then $q = 3$ and $r = 2$, and $5 \\times 3 + 2 = 17$. So $a = b \\times q + r$ works.',
      conclusion: 'Full bags plus leftovers gives back the number we started with, so the rule is $a = b \\times q + r$.',
      whyWrong: [
        null,
        'This multiplies the quotient by the remainder. With $a = 17$, $b = 5$ it gives $3 \\times 2 + 5 = 11$, not 17.',
        'This has $a$ and $b$ the wrong way round. With $a = 17$, $b = 5$ it gives $17 \\times 3 + 2 = 53$, not 5.',
        'This adds the quotient instead of multiplying by it. With $a = 17$, $b = 5$ it gives $5 + 3 + 2 = 10$, not 17.',
      ],
      keyIdea: 'For "which formula is always true", test each one with real numbers such as $a = 17$ and $b = 5$. A wrong formula fails straight away. For `div` and `mod`, the rule is bags times size plus leftovers.',
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
