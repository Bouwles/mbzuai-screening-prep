import type { StaticQuestion } from '../../../types';

/** A JS model of a Python value, used by the answer checks below. */
type PyVal = number | string | boolean | null | PyVal[];

/** Python truthiness: 0, 0.0, '', [], None and False are falsy; everything else is truthy. */
function pyTruthy(v: PyVal): boolean {
  if (v === null) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v.length > 0;
  return v.length > 0;
}

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'conditionals-001',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'x = 5\nprint(x > 5, x >= 5, x != 5)' },
    options: ['`True True False`', '`False True True`', '`False True False`', '`False False False`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`print` with several values separated by commas prints them on one line with a space between them. Work out each comparison with `x = 5`:\n\n' +
        '| Expression | Meaning | With x = 5 | Result |\n' +
        '|---|---|---|---|\n' +
        '| `x > 5` | strictly greater than 5 | `5 > 5` | `False` |\n' +
        '| `x >= 5` | greater than **or equal to** 5 | `5 >= 5` | `True` |\n' +
        '| `x != 5` | **not** equal to 5 | `5 != 5` | `False` |\n\n' +
        'Output: `False True False`.',
      whyWrong: [
        'This treats `x > 5` as if it included 5. "Strictly greater than" means 5 itself does not count, so `5 > 5` is False.',
        'This reads `!=` as "equal to". `!=` means "not equal to", and 5 is equal to 5, so `x != 5` is False.',
        null,
        'This treats `>=` like `>`. `>=` means "greater than OR equal to", and 5 is equal to 5, so `x >= 5` is True.',
      ],
      keyIdea: '`>` and `<` are strict (the boundary value gives False), `>=` and `<=` include the boundary, and `!=` means "not equal".',
    },
    python: { stdout: 'False True False\n' },
  },
  {
    id: 'conditionals-002',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'Which of these values is treated as **True** when it is used as the condition of an `if` statement in Python?',
    options: ['`0`', '`""` (an empty string)', '`None`', '`"0"` (a string containing the character 0)'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Python decides whether a value is "truthy" or "falsy" when it is used as a condition. The **falsy** values you must know are:\n\n' +
        '- the number zero: `0` and `0.0`\n' +
        '- empty containers: `""` (empty string), `[]` (empty list), `{}`, `()`\n' +
        '- `None` and `False`\n\n' +
        'Everything else is truthy. `"0"` is a string of **length 1** (it contains the character 0), so it is not empty, so it is truthy. The other three values are all on the falsy list.',
      whyWrong: [
        'The number zero is falsy: `if 0:` skips its block.',
        'An empty string has length 0, and empty containers are falsy.',
        '`None` means "no value" and is always falsy.',
        null,
      ],
      keyIdea: 'Zero, empty containers, `None` and `False` are falsy; any non-empty string (even `"0"` or `"False"`) is truthy.',
    },
  },
  {
    id: 'conditionals-003',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'What does this Python code print? (If more than one line is printed, the lines are shown separated by spaces.)',
    code: {
      lang: 'python',
      source:
        'temp = 25\nif temp > 30:\n    print("hot")\nelif temp > 20:\n    print("warm")\nelif temp > 10:\n    print("mild")\nelse:\n    print("cold")',
    },
    options: ['`warm mild`', '`warm`', '`mild`', '`warm cold`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'An `if / elif / else` chain is checked **from the top down**, and **only the first branch whose condition is True runs**. Everything after it is skipped.\n\n' +
        '1. `temp > 30`: `25 > 30` is False, so move on.\n' +
        '2. `temp > 20`: `25 > 20` is True, so print `warm` and **leave the chain**.\n' +
        '3. The `elif temp > 10` and the `else` are never looked at, even though `25 > 10` is also True.\n\n' +
        'Output: `warm`.',
      whyWrong: [
        'This treats every `elif` as a separate `if`. In an if/elif/else chain, Python stops at the first condition that is True, so only one branch runs.',
        null,
        'This picks the last condition that is true (`temp > 10`). Python checks the conditions from top to bottom and runs the first true one, and `temp > 20` comes before `temp > 10`.',
        'This assumes the `else` branch always runs at the end, after the branch that was chosen. `else` runs only when every condition above it is False, and here `temp > 20` was True.',
      ],
      keyIdea: 'In an if/elif/else chain exactly one branch runs: the first one (from the top) whose condition is True, or the `else` if none is.',
    },
    python: { stdout: 'warm\n' },
  },
  {
    id: 'conditionals-004',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'Which line correctly checks whether the variable `score` is equal to 100 in Python?',
    options: ['`if score == 100:`', '`if score = 100:`', '`if score === 100:`', '`if score equals 100:`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Python uses two different symbols that look alike:\n\n' +
        '- `=` is **assignment**: `score = 100` *stores* 100 in `score`.\n' +
        '- `==` is **comparison**: `score == 100` *asks* "is score equal to 100?" and gives True or False.\n\n' +
        'An `if` needs a question, so the correct line is `if score == 100:` (with the colon at the end).',
      whyWrong: [
        null,
        'A single `=` is assignment (store a value), not comparison. Python rejects `if score = 100:` with a SyntaxError.',
        '`===` is the strict-equality operator from JavaScript; it does not exist in Python, so this line is a SyntaxError.',
        '`equals` is not a Python operator, so this line is a SyntaxError. Comparison for equality is written `==`.',
      ],
      keyIdea: '`=` stores a value, `==` compares two values; conditions always use `==`.',
    },
  },
  {
    id: 'conditionals-005',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'age = 16\nstatus = "adult" if age >= 18 else "minor"\nprint(status)' },
    options: ['`adult`', '`False`', '`status`', '`minor`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Line 2 is a **conditional expression** (Python\'s one-line if/else): `A if condition else B` gives `A` when the condition is True and `B` when it is False.\n\n' +
        '1. `age = 16`.\n' +
        '2. The condition `age >= 18` is `16 >= 18`, which is False, so the expression gives the value after `else`: `"minor"`. So `status = "minor"`.\n' +
        '3. `print(status)` prints the value stored in `status`, without quotes.\n\n' +
        'Output: `minor`.',
      whyWrong: [
        'This takes the value on the left of `if` even though the condition is False. `A if condition else B` gives A only when the condition is True; `16 >= 18` is False, so it gives B.',
        'This prints the result of the condition `age >= 18` instead of the value the conditional expression chooses. The expression gives one of the two strings, not a Boolean.',
        '`print(status)` prints the value stored in the variable, not the variable\'s name. To print the word itself you would need quotes: `print("status")`.',
        null,
      ],
      keyIdea: '`A if condition else B` evaluates to A when the condition is True and to B otherwise.',
    },
    python: { stdout: 'minor\n' },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'conditionals-006',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'x = 7\nprint(1 < x < 10, 8 < x < 10, 3 < x == 7)' },
    options: [
      '`True False True`',
      '`True True False`',
      '`True False False`',
      'An error is raised, because comparisons cannot be chained',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Python allows **chained comparisons**: `a < b < c` means `a < b and b < c` (with `b` worked out only once). It does **not** mean `(a < b) < c`.\n\n' +
        '1. `1 < x < 10` means `1 < 7 and 7 < 10`: True and True, so `True`.\n' +
        '2. `8 < x < 10` means `8 < 7 and 7 < 10`: the first part is already False, so `False`.\n' +
        '3. `3 < x == 7` means `3 < 7 and 7 == 7`: True and True, so `True`.\n\n' +
        'Output: `True False True`.',
      whyWrong: [
        null,
        'This evaluates left to right like C or Java: `(8 < x) < 10` becomes `False < 10`, i.e. `0 < 10`, which is True, and `(3 < x) == 7` becomes `True == 7`, which is False. Python instead reads `a < b < c` as `a < b and b < c`.',
        'The first two are right, but the third has been evaluated as `(3 < x) == 7`, i.e. `True == 7`, which is False. In Python, `3 < x == 7` means `3 < x and x == 7`, which is True.',
        'Python does allow chained comparisons; `1 < x < 10` is the normal Python way to test whether x lies strictly between 1 and 10.',
      ],
      keyIdea: 'A chained comparison `a op1 b op2 c` means `(a op1 b) and (b op2 c)`, never `(a op1 b) op2 c`.',
    },
    python: { stdout: 'True False True\n' },
  },
  {
    id: 'conditionals-007',
    subtopic: 'conditionals',
    difficulty: 'challenge',
    stem: 'What happens when this Python code is run?',
    code: {
      lang: 'python',
      source:
        'a = 0\nb = 10\nif a == 0 or b / a > 2:\n    print("first")\nif a != 0 and b / a > 2:\n    print("second")\nif b / a > 2 or a == 0:\n    print("third")',
    },
    options: [
      '`first third` is printed and the program finishes normally',
      'A `ZeroDivisionError` is raised before anything is printed',
      '`first` is printed, then a `ZeroDivisionError` is raised',
      '`first` is printed and the program finishes normally',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '`and` and `or` use **short-circuit evaluation**: they work left to right and stop as soon as the answer is known.\n\n' +
        '- `X or Y`: if `X` is True, the whole thing is True, so `Y` is **not evaluated**.\n' +
        '- `X and Y`: if `X` is False, the whole thing is False, so `Y` is **not evaluated**.\n\n' +
        'Trace with `a = 0`, `b = 10`:\n\n' +
        '1. First `if`: `a == 0` is True, so `or` stops. `b / a` is never computed. Prints `first`.\n' +
        '2. Second `if`: `a != 0` is False, so `and` stops. `b / a` is never computed. Nothing printed.\n' +
        '3. Third `if`: the **left** operand `b / a` is evaluated first, and that is `10 / 0`. Python raises `ZeroDivisionError` immediately, the program stops, and `third` is never printed.\n\n' +
        'So `first` is printed, then a `ZeroDivisionError` is raised.',
      whyWrong: [
        'This assumes Python will look at `a == 0` first in the third `if`. Operands are evaluated strictly left to right, so `b / a` (a division by zero) is computed before `a == 0` is ever reached.',
        'This forgets short-circuiting in the first `if`: because `a == 0` is True, `or` never evaluates `b / a`, so `first` is printed safely before the error.',
        null,
        'This assumes an error inside a condition just makes that condition False, so the third `if` is quietly skipped. Python does not do that: evaluating `10 / 0` raises a `ZeroDivisionError`, which stops the program at that line (unless it is caught with `try`/`except`).',
      ],
      keyIdea: '`or` skips its right side when the left is True and `and` skips its right side when the left is False, so the order of the operands decides whether a risky expression is ever evaluated.',
    },
    python: { error: 'ZeroDivisionError' },
  },
  {
    id: 'conditionals-008',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'What does this Python code print? (The three printed lines are shown separated by spaces.)',
    code: { lang: 'python', source: 'print(0 or 5)\nprint(3 and 0)\nprint("" or "hi")' },
    options: ['`True False True`', '`5 3 hi`', '`5 0 hi`', '`5 False hi`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'In Python, `and` and `or` do not always give True/False: they return **one of their two operands**.\n\n' +
        '- `x or y`: if `x` is truthy, return `x`; otherwise return `y`.\n' +
        '- `x and y`: if `x` is falsy, return `x`; otherwise return `y`.\n\n' +
        '1. `0 or 5`: `0` is falsy, so `or` returns the second operand, `5`.\n' +
        '2. `3 and 0`: `3` is truthy, so `and` must check the second operand and returns it, `0`.\n' +
        '3. `"" or "hi"`: the empty string is falsy, so `or` returns `"hi"`, printed without quotes as `hi`.\n\n' +
        'Output: `5 0 hi`.',
      whyWrong: [
        'This assumes `and`/`or` always produce True or False. In Python they return one of the two operands themselves.',
        'This makes `and` return the first truthy value, as `or` does. In `3 and 0`, 3 is truthy, so `and` goes on and returns the second operand, 0.',
        null,
        'This lets `or` return operands but makes `and` return False. Both operators return an operand: `3 and 0` returns 0, the second operand.',
      ],
      keyIdea: '`or` returns the first truthy operand (or the last one), and `and` returns the first falsy operand (or the last one).',
    },
    python: { stdout: '5\n0\nhi\n' },
  },
  {
    id: 'conditionals-009',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'A programmer wanted 90+ to be an A, 70-89 a B, 50-69 a C and below 50 an F, and wrote the code below. What does it print?',
    code: {
      lang: 'python',
      source:
        'def grade(score):\n    if score >= 50:\n        return "C"\n    elif score >= 70:\n        return "B"\n    elif score >= 90:\n        return "A"\n    else:\n        return "F"\n\nscores = [95, 72, 50, 49, 88]\ncount = 0\nfor s in scores:\n    if grade(s) == "C":\n        count += 1\nprint(count)',
    },
    options: ['`4`', '`1`', '`3`', '`5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Python checks the conditions in the order written and returns at the **first** one that is True. Because `score >= 50` is checked first, **every** score of 50 or more returns `"C"`; the `elif` lines for B and A can never be reached.\n\n' +
        '| s | `s >= 50`? | grade(s) | count |\n' +
        '|---|---|---|---|\n' +
        '| 95 | True | C | 1 |\n' +
        '| 72 | True | C | 2 |\n' +
        '| 50 | True | C | 3 |\n' +
        '| 49 | False (then 49 fails 70 and 90 too) | F | 3 |\n' +
        '| 88 | True | C | 4 |\n\n' +
        'Output: `4`. (To fix the bug, test the highest boundary first: `>= 90`, then `>= 70`, then `>= 50`.)',
      whyWrong: [
        null,
        'This is what the programmer *intended* (only 50 is in the C band). But Python stops at the first true condition, and `score >= 50` is tested first, so 95, 72 and 88 also get C.',
        'This treats `>=` as `>`, so 50 would not get a C. But `50 >= 50` is True.',
        'This counts 49 as well. `49 >= 50` is False, and so are the other two tests, so 49 falls through to the `else` and gets F.',
      ],
      keyIdea: 'With overlapping conditions in an if/elif chain, order matters: put the most restrictive test (the highest boundary) first.',
    },
    check: {
      optionValues: [4, 1, 3, 5],
      compute: () => {
        const grade = (s: number) => (s >= 50 ? 'C' : s >= 70 ? 'B' : s >= 90 ? 'A' : 'F');
        return [95, 72, 50, 49, 88].filter((s) => grade(s) === 'C').length;
      },
    },
    python: { stdout: '4\n' },
  },
  {
    id: 'conditionals-010',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'x = 12\ny = 5\nif x > 10:\n    if y > 10:\n        print("P")\n    else:\n        print("Q")\nelif y > 3:\n    print("R")\nelse:\n    print("S")',
    },
    options: ['`Q R`', '`Q`', '`R`', 'Nothing is printed'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Use the **indentation** to see which `else` belongs to which `if`. The inner `if y > 10` / `else` pair is indented inside the outer `if x > 10`. The outer `elif` and `else` line up with the outer `if`.\n\n' +
        '1. Outer test `x > 10`: `12 > 10` is True, so we go **inside** the outer `if`, and the outer `elif` and `else` will be skipped.\n' +
        '2. Inner test `y > 10`: `5 > 10` is False, so the inner `else` runs and prints `Q`.\n' +
        '3. The outer branch is finished. The outer `elif y > 3` is **not** checked, because an earlier branch of that chain already ran.\n\n' +
        'Output: `Q`.',
      whyWrong: [
        'Once the outer `if x > 10` is True, the `elif` and `else` attached to it are skipped completely, so `R` cannot also be printed.',
        null,
        'This thinks that when the inner `if y > 10` fails, Python jumps to the outer `elif`. It does not: the inner `if` has its own `else`, which prints `Q`.',
        'This forgets the inner `else`. The inner `if` is False, so its `else` branch runs and prints `Q`.',
      ],
      keyIdea: 'Indentation decides which `if` an `elif`/`else` belongs to; once a branch of a chain runs, the rest of that chain is skipped.',
    },
    python: { stdout: 'Q\n' },
  },
  {
    id: 'conditionals-011',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'A student wants to count how many numbers in the list are equal to 1 or 2, and writes the code below. What does it actually print?',
    code: {
      lang: 'python',
      source: 'count = 0\nfor x in [1, 2, 3, 4]:\n    if x == 1 or 2:\n        count += 1\nprint(count)',
    },
    options: ['`2`', '`4`', '`1`', 'An error is raised'],
    correctIndex: 1,
    markScheme: {
      solution:
        '`==` is done before `or`, so the condition is read as `(x == 1) or 2`, **not** "x equals 1 or x equals 2".\n\n' +
        '| x | `x == 1` | `(x == 1) or 2` | truthy? | count |\n' +
        '|---|---|---|---|---|\n' +
        '| 1 | True | True | yes | 1 |\n' +
        '| 2 | False | 2 | yes (2 is non-zero) | 2 |\n' +
        '| 3 | False | 2 | yes | 3 |\n' +
        '| 4 | False | 2 | yes | 4 |\n\n' +
        'When `x == 1` is False, `or` returns its right operand, `2`, which is truthy, so the condition is **always** satisfied. Output: `4`.\n\n' +
        'The correct condition would be `x == 1 or x == 2` (or `x in (1, 2)`), which gives 2.',
      whyWrong: [
        'This is what the student *intended*. Python does not repeat `x ==` after `or`: the right-hand side is just the number 2, which is always truthy.',
        null,
        'This reads the condition as `x == (1 or 2)`, which is `x == 1`. But `==` binds more tightly than `or`, so the condition is `(x == 1) or 2`.',
        'Using a number as an operand of `or` is perfectly legal in Python; it is simply judged by its truthiness (non-zero means truthy).',
      ],
      keyIdea: '`x == 1 or 2` means `(x == 1) or 2`, which is always truthy; write `x == 1 or x == 2` instead.',
    },
    check: {
      optionValues: [2, 4, 1, null],
      compute: () => {
        let count = 0;
        for (const x of [1, 2, 3, 4]) {
          const left = x === 1;
          if (left || pyTruthy(2)) count += 1; // (x == 1) or 2
        }
        return count;
      },
    },
    python: { stdout: '4\n' },
  },
  {
    id: 'conditionals-012',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print("apple" < "banana", "Zebra" < "apple", "10" < "9")' },
    options: ['`True False False`', '`True False True`', '`True True False`', '`True True True`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Strings are compared **character by character** using each character\'s code number (its Unicode / ASCII value). The first position where they differ decides.\n\n' +
        'Useful codes: digits `0`-`9` are 48-57, uppercase `A`-`Z` are 65-90, lowercase `a`-`z` are 97-122. So digits < uppercase < lowercase.\n\n' +
        '1. `"apple" < "banana"`: first characters `a` (97) and `b` (98). 97 < 98, so `True`.\n' +
        '2. `"Zebra" < "apple"`: first characters `Z` (90) and `a` (97). 90 < 97, so `True` (every uppercase letter comes before every lowercase letter).\n' +
        '3. `"10" < "9"`: these are **strings**, not numbers. First characters `1` (49) and `9` (57). 49 < 57, so `True`.\n\n' +
        'Output: `True True True`.',
      whyWrong: [
        'This uses everyday dictionary order (ignoring capitals) and compares "10" and "9" as numbers. Python compares strings by character codes: uppercase letters come before lowercase ones, and digit strings are compared character by character.',
        'This ignores capital letters. In character codes, every uppercase letter (Z is 90) comes before every lowercase letter (a is 97), so `"Zebra" < "apple"` is True.',
        'This compares "10" and "9" as the numbers 10 and 9. They are strings, so Python compares the first characters, 1 and 9, and 1 comes first, so `"10" < "9"` is True.',
        null,
      ],
      keyIdea: 'String comparison is lexicographic by character code: digits before uppercase before lowercase, decided at the first differing character.',
    },
    python: { stdout: 'True True True\n' },
  },
  {
    id: 'conditionals-013',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'a = 0.1 + 0.2\nprint(a == 0.3, abs(a - 0.3) < 1e-9)' },
    options: ['`True True`', '`False True`', '`True False`', '`False False`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Computers store decimals like 0.1 and 0.2 in **binary**, where they cannot be written exactly (just as one third is 0.333... in decimal). The tiny rounding errors add up:\n\n' +
        '1. `a = 0.1 + 0.2` is stored as `0.30000000000000004`, not exactly 0.3.\n' +
        '2. `a == 0.3` asks for an **exact** match, so it is `False`.\n' +
        '3. `abs(a - 0.3)` is about `0.00000000000000006`, which is far smaller than `1e-9` (0.000000001), so the second test is `True`.\n\n' +
        'Output: `False True`. This is why float equality is tested with a small tolerance (or `math.isclose`) instead of `==`.',
      whyWrong: [
        'This assumes 0.1 + 0.2 is stored as exactly 0.3. Floats are stored in binary, so the sum is 0.30000000000000004 and `==` gives False.',
        null,
        'This has both tests the wrong way round. The exact test `==` fails because of the tiny rounding error, while the tolerance test succeeds because that error is far below `1e-9`.',
        'This correctly sees that `==` fails but forgets that the error is tiny (about 0.00000000000000006), which is much less than the tolerance `1e-9`.',
      ],
      keyIdea: 'Never compare floats with `==`; compare `abs(a - b)` with a small tolerance instead.',
    },
    python: { stdout: 'False True\n' },
  },
  {
    id: 'conditionals-014',
    subtopic: 'conditionals',
    difficulty: 'challenge',
    stem: 'Consider the following pseudocode. What is printed?',
    code: {
      lang: 'pseudocode',
      source:
        'fizz ← 0\nbuzz ← 0\nfb ← 0\nfor n = 1 to 30\n    if n MOD 3 = 0 then\n        fizz ← fizz + 1\n    else if n MOD 5 = 0 then\n        buzz ← buzz + 1\n    else if n MOD 15 = 0 then\n        fb ← fb + 1\n    end if\nend for\nprint(fizz, buzz, fb)',
    },
    options: ['`8 4 2`', '`10 6 2`', '`10 6 0`', '`10 4 0`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Only the **first** true branch runs for each n. Go through the branches in order:\n\n' +
        '1. **fizz**: every multiple of 3 from 1 to 30 enters the first branch: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30. That is 10 numbers, so `fizz = 10`. Note 15 and 30 are counted here.\n' +
        '2. **buzz**: only numbers that are *not* multiples of 3 reach the second test. Multiples of 5 are 5, 10, 15, 20, 25, 30; remove 15 and 30 (already taken by the first branch), leaving 5, 10, 20, 25. So `buzz = 4`.\n' +
        '3. **fb**: a multiple of 15 is also a multiple of 3, so it is always caught by the first branch. The third branch can **never** run, so `fb = 0`.\n\n' +
        'Output: `10 4 0`. (Proper FizzBuzz tests `n MOD 15 = 0` first.)',
      whyWrong: [
        'This is the result of correct FizzBuzz, where the multiple-of-15 test comes first. Here it comes last, so 15 and 30 are taken by the first branch and the last branch never runs.',
        'This treats the three tests as independent `if` statements, counting all 10 multiples of 3, all 6 multiples of 5 and both multiples of 15. With `else if`, each n is counted at most once.',
        'This correctly sees that the last branch is unreachable but counts 15 and 30 as buzz. They are multiples of 3, so the first branch already took them.',
        null,
      ],
      keyIdea: 'In an else-if chain a later, more specific test is unreachable if an earlier, more general test already catches all its cases.',
    },
    check: {
      optionValues: ['8 4 2', '10 6 2', '10 6 0', '10 4 0'],
      compute: () => {
        let fizz = 0;
        let buzz = 0;
        let fb = 0;
        for (let n = 1; n <= 30; n++) {
          if (n % 3 === 0) fizz++;
          else if (n % 5 === 0) buzz++;
          else if (n % 15 === 0) fb++;
        }
        return `${fizz} ${buzz} ${fb}`;
      },
    },
  },
  {
    id: 'conditionals-015',
    subtopic: 'conditionals',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'calls = []\n\ndef check(name, result):\n    calls.append(name)\n    return result\n\nif check("a", False) and check("b", True):\n    pass\nif check("c", True) or check("d", False):\n    pass\nif check("e", False) or check("f", True) and check("g", False):\n    pass\nprint(calls)',
    },
    options: [
      "`['a', 'b', 'c', 'd', 'e', 'f', 'g']`",
      "`['a', 'c', 'e', 'f', 'g']`",
      "`['a', 'c', 'e', 'f']`",
      "`['a', 'c', 'd', 'e', 'f', 'g']`",
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        '`check` records its name every time it is **actually called**, so `calls` shows exactly which operands were evaluated. Remember short-circuiting, and that `and` binds more tightly than `or`.\n\n' +
        '1. `check("a", False) and ...`: a is called and returns False, so `and` stops; b is **not** called. `calls = [a]`.\n' +
        '2. `check("c", True) or ...`: c is called and returns True, so `or` stops; d is **not** called. `calls = [a, c]`.\n' +
        '3. Because `and` comes before `or`, the third condition is `check("e", False) or (check("f", True) and check("g", False))`. e is called and returns False, so `or` must evaluate its right side.\n' +
        '4. On that right side, f is called and returns True, so `and` must also evaluate its right side: g is called (and returns False). `calls = [a, c, e, f, g]`.\n\n' +
        "Output: `['a', 'c', 'e', 'f', 'g']`.",
      whyWrong: [
        'This ignores short-circuit evaluation and calls every function. `and` stops at a False left side (b is skipped) and `or` stops at a True left side (d is skipped).',
        null,
        'This stops as soon as f returns True, as if the condition were just `e or f`. But `and` binds more tightly than `or`, so the right side of `or` is `check("f", True) and check("g", False)`; after f is True, `and` must still call g.',
        'This short-circuits `and` correctly but not `or`. Since c returns True, `or` already knows the result and never calls d.',
      ],
      keyIdea: 'Short-circuiting means an operand of `and`/`or` may never be evaluated (so its side effects never happen), and `and` groups before `or`.',
    },
    python: { stdout: "['a', 'c', 'e', 'f', 'g']\n" },
  },
  {
    id: 'conditionals-016',
    subtopic: 'conditionals',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'items = [0, 1, "", "0", [], [0], None, False, " "]\ncount = 0\nfor v in items:\n    if not v:\n        count += 1\nprint(count)',
    },
    options: ['`5`', '`7`', '`6`', '`4`'],
    correctIndex: 0,
    markScheme: {
      solution:
        '`not v` is True exactly when `v` is **falsy**, so the code counts the falsy items.\n\n' +
        '| item | falsy? | reason |\n' +
        '|---|---|---|\n' +
        '| `0` | yes | zero |\n' +
        '| `1` | no | non-zero number |\n' +
        '| `""` | yes | empty string |\n' +
        '| `"0"` | no | string of length 1 |\n' +
        '| `[]` | yes | empty list |\n' +
        '| `[0]` | no | list of length 1 |\n' +
        '| `None` | yes | always falsy |\n' +
        '| `False` | yes | always falsy |\n' +
        '| `" "` | no | string of length 1 (a space) |\n\n' +
        'Falsy items: `0`, `""`, `[]`, `None`, `False`. Output: `5`.',
      whyWrong: [
        null,
        'This treats `"0"` and `[0]` as falsy because they "contain zero". A non-empty string or list is truthy whatever it contains.',
        'This treats `" "` (a string holding one space) as empty. It has length 1, so it is truthy.',
        'This treats the empty list `[]` as truthy because the list exists. Empty containers are falsy.',
      ],
      keyIdea: 'Only zero, empty containers, `None` and `False` are falsy; a container holding anything (even 0 or a space) is truthy.',
    },
    check: {
      optionValues: [5, 7, 6, 4],
      compute: () => {
        const items: PyVal[] = [0, 1, '', '0', [], [0], null, false, ' '];
        return items.filter((v) => !pyTruthy(v)).length;
      },
    },
    python: { stdout: '5\n' },
  },
  {
    id: 'conditionals-017',
    subtopic: 'conditionals',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source:
        'def f(n):\n    return "neg" if n < 0 else "zero" if n == 0 else "small" if n < 10 else "big"\n\nprint(f(-3), f(0), f(10))',
    },
    options: [
      '`neg zero small`',
      '`neg small big`',
      '`neg zero big`',
      'An error is raised, because conditional expressions cannot be chained',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'A chained conditional expression is read like an if/elif/else chain, tested **left to right**, stopping at the first True condition:\n\n' +
        '- if `n < 0`: `"neg"`\n' +
        '- elif `n == 0`: `"zero"`\n' +
        '- elif `n < 10`: `"small"`\n' +
        '- else: `"big"`\n\n' +
        '1. `f(-3)`: `-3 < 0` is True, so `neg`.\n' +
        '2. `f(0)`: `0 < 0` is False; `0 == 0` is True, so `zero`.\n' +
        '3. `f(10)`: `10 < 0` False; `10 == 0` False; `10 < 10` False (strict); so `big`.\n\n' +
        'Output: `neg zero big`.',
      whyWrong: [
        'This treats `n < 10` as if it included 10. The test is strict, so `10 < 10` is False and f(10) gives "big".',
        'This tests `n < 10` before `n == 0`, so 0 becomes "small". The conditions are checked left to right, and `n == 0` comes first.',
        null,
        'Conditional expressions can be chained in Python: `A if c1 else B if c2 else C` is valid and means `A if c1 else (B if c2 else C)`.',
      ],
      keyIdea: '`A if c1 else B if c2 else C` works like if/elif/else: conditions are tested left to right and the first True one wins.',
    },
    python: { stdout: 'neg zero big\n' },
  },
  {
    id: 'conditionals-018',
    subtopic: 'conditionals',
    difficulty: 'challenge',
    stem: 'Which condition is equivalent to `not (x > 3 and y <= 5)` for **all** integer values of `x` and `y`?',
    options: ['`x <= 3 and y > 5`', '`x < 3 or y > 5`', '`x <= 3 or y > 5`', '`x > 3 or y <= 5`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**De Morgan\'s law**: `not (A and B)` is the same as `(not A) or (not B)`. So negate each part **and** swap `and` for `or`.\n\n' +
        '1. Negate `x > 3`: the opposite of "greater than 3" is "less than or equal to 3", so `x <= 3`.\n' +
        '2. Negate `y <= 5`: the opposite of "at most 5" is "greater than 5", so `y > 5`.\n' +
        '3. Swap `and` for `or`: `x <= 3 or y > 5`.\n\n' +
        'Quick check with x = 4, y = 0: the original is `not (True and True)` = False, and `4 <= 3 or 0 > 5` = False. They agree.',
      whyWrong: [
        'This negates both comparisons but forgets to swap `and` for `or`. Try x = 0, y = 0: the original is True but this is False.',
        'This negates `x > 3` as `x < 3`, forgetting the equal case. The opposite of `x > 3` is `x <= 3`; with x = 3, y = 5 the original is True but this is False.',
        null,
        'This swaps `and` for `or` but does not negate the comparisons. Try x = 4, y = 0: the original is False but this is True.',
      ],
      keyIdea: 'De Morgan: `not (A and B)` = `not A or not B`; the negation of `>` is `<=` and of `<=` is `>`.',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const original = (x: number, y: number) => !(x > 3 && y <= 5);
        const opts = [
          (x: number, y: number) => x <= 3 && y > 5,
          (x: number, y: number) => x < 3 || y > 5,
          (x: number, y: number) => x <= 3 || y > 5,
          (x: number, y: number) => x > 3 || y <= 5,
        ];
        const equivalent = opts
          .map((f, i) => ({ f, i }))
          .filter(({ f }) => {
            for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) if (f(x, y) !== original(x, y)) return false;
            return true;
          });
        return equivalent.length === 1 ? equivalent[0].i : -1;
      },
    },
  },
  {
    id: 'conditionals-019',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'A year is a leap year if it is divisible by 4, except that years divisible by 100 are only leap years if they are also divisible by 400. What does this code print?',
    code: {
      lang: 'python',
      source:
        'def is_leap(y):\n    return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)\n\ncount = 0\nfor y in [1900, 2000, 2024, 2023, 2100]:\n    if is_leap(y):\n        count += 1\nprint(count)',
    },
    options: ['`4`', '`1`', '`0`', '`2`'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Evaluate `y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)` for each year. (`%` gives the remainder.)\n\n' +
        '| y | `y % 4 == 0` | `y % 100 != 0` | `y % 400 == 0` | bracket | leap? |\n' +
        '|---|---|---|---|---|---|\n' +
        '| 1900 | True | False | False | False | False |\n' +
        '| 2000 | True | False | True | True | True |\n' +
        '| 2024 | True | True | (not needed) | True | True |\n' +
        '| 2023 | False | (not needed) | (not needed) | - | False |\n' +
        '| 2100 | True | False | False | False | False |\n\n' +
        'For 2023 the `and` short-circuits, and for 2024 the `or` short-circuits. Leap years: 2000 and 2024. Output: `2`.',
      whyWrong: [
        'This only checks divisibility by 4. 1900 and 2100 are divisible by 100 but not by 400, so the bracket `(y % 100 != 0 or y % 400 == 0)` is False for them.',
        'This thinks 2000 is not a leap year because it is divisible by 100. But 2000 is divisible by 400, so `y % 400 == 0` makes the bracket True.',
        'This reads the `or` inside the brackets as `and`. With `or`, only one of the two parts needs to be True (2024 passes with `y % 100 != 0`, 2000 with `y % 400 == 0`).',
        null,
      ],
      keyIdea: 'Brackets group a sub-condition; evaluate the bracket first, then combine with `and`, remembering `or` needs only one True part.',
    },
    check: {
      optionValues: [4, 1, 0, 2],
      compute: () => {
        const isLeap = (y: number) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
        return [1900, 2000, 2024, 2023, 2100].filter(isLeap).length;
      },
    },
    python: { stdout: '2\n' },
  },
];
