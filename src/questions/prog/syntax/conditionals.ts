import type { StaticQuestion } from '../../../types';

const L = (...lines: string[]) => lines.join('\n');

const INFINITE = 'Infinite loop';
const PRINTS = 'What does this pseudocode print?';
const TWO_LINES = 'What does this pseudocode print? Output lines are shown separated by a space.';

const mod = (a: number, b: number): number => a - b * Math.floor(a / b);

export const questions: StaticQuestion[] = [
  // ------------------------------------------------------------------ foundation
  {
    id: 'conditionals-001',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: TWO_LINES,
    code: { lang: 'pseudocode', source: L('x = 5', 'print(x > 5)', 'print(x >= 5)', 'print(x != 5)') },
    options: ['`true true false`', '`false true true`', '`false true false`', '`false false false`'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which of `x > 5`, `x >= 5` and `x != 5` are true when `x` is 5?',
      solution:
        'A comparison is a question whose answer is `true` or `false`. `print` shows that answer.\n\n' +
        'Put 5 in place of `x` on each line:\n\n| Line | Test | Meaning | Result |\n|---|---|---|---|\n| 2 | `5 > 5` | is 5 bigger than 5? | `false` |\n| 3 | `5 >= 5` | is 5 bigger than or equal to 5? | `true` |\n| 4 | `5 != 5` | is 5 different from 5? | `false` |\n\n' +
        'Lines 2, 3 and 4 print these results in order.',
      conclusion: '5 is equal to 5, so only the test that allows "equal" is true. The output is `false true false`.',
      whyWrong: [
        'This treats `x > 5` as if it included 5. "Strictly greater than" means 5 itself does not count, so `5 > 5` is false.',
        'This reads `!=` as "equal to". `!=` means "not equal to", and 5 is equal to 5, so `x != 5` is false.',
        null,
        'This treats `>=` like `>`. `>=` means "greater than or equal to", and 5 is equal to 5, so `x >= 5` is true.',
      ],
      keyIdea: 'For a comparison at the boundary value, ask "does equal count?". `>` and `<` say no, while `>=` and `<=` say yes. `!=` is true only when the two values differ.',
    },
    check: {
      optionValues: ['true true false', 'false true true', 'false true false', 'false false false'],
      compute: () => {
        const x: number = 5;
        return `${x > 5} ${x >= 5} ${x !== 5}`;
      },
    },
  },
  {
    id: 'conditionals-003',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'What does this Python code print? Output lines are shown separated by a space.',
    code: {
      lang: 'python',
      source:
        'temp = 25\nif temp > 30:\n    print("hot")\nelif temp > 20:\n    print("warm")\nelif temp > 10:\n    print("mild")\nelse:\n    print("cold")',
    },
    options: ['`warm mild`', '`warm`', '`mild`', '`warm cold`'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which branch of the chain runs when `temp` is 25?',
      solution:
        'This is an `if`/`elif`/`else` chain, where `elif` means "else if". Python checks the tests from the top and runs only the **first** one that is true. The rest are skipped.\n\n' +
        'Line 2: is `25 > 30`? No, so skip line 3 and move on.\n\n' +
        'Line 4: is `25 > 20`? Yes, so line 5 runs and prints `warm`. The rest of the chain is skipped, including `temp > 10`, even though that is true as well.',
      conclusion: 'The first true test is `25 > 20`, so only one branch runs and the output is `warm`.',
      whyWrong: [
        'This treats every `elif` as a separate `if`. In an if/elif/else chain, Python stops at the first condition that is True, so only one branch runs.',
        null,
        'This picks the last condition that is true (`temp > 10`). Python checks the conditions from top to bottom and runs the first true one, and `temp > 20` comes before `temp > 10`.',
        'This assumes the `else` branch always runs at the end, after the branch that was chosen. `else` runs only when every condition above it is False, and here `temp > 20` was True.',
      ],
      keyIdea: 'In an `if`/`elif`/`else` chain, go down the tests and stop at the first true one. Exactly one branch runs. `else` runs only if every test above it was false.',
    },
    python: { stdout: 'warm\n' },
  },
  {
    id: 'conditionals-004',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'In this pseudocode, which line correctly tests whether `score` is equal to 100?',
    options: ['`if score == 100`', '`if score = 100`', '`if score === 100`', '`if score equals 100`'],
    correctIndex: 0,
    markScheme: {
      asking: 'How do you ask "is `score` equal to 100?" in this pseudocode?',
      solution:
        'A single `=` is an instruction: `score = 100` stores 100 in `score`. It doesn\'t ask anything.\n\n' +
        'To ask whether two values are equal, this pseudocode uses two equals signs, `==`. So the test is written `if score == 100`.',
      conclusion: 'A comparison after `if` needs `==`, so the correct line is `if score == 100`.',
      whyWrong: [
        null,
        'A single `=` is assignment (store a value), not comparison.',
        'Three equals signs are not used in this pseudocode. Equality is written `==`.',
        '`equals` is not an operator. Equality is written `==`.',
      ],
      keyIdea: 'Tell them apart by meaning: `=` means "store" and `==` means "is it equal?". An `if` always asks a question, so it needs a comparison such as `==`, `!=`, `<` or `>`.',
    },
  },
  {
    id: 'conditionals-005',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('age = 16', 'if age >= 18', '   status = "adult"', 'else', '   status = "minor"', 'end if', 'print(status)'),
    },
    options: ['`adult`', '`false`', '`status`', '`minor`'],
    correctIndex: 3,
    markScheme: {
      asking: 'Which word ends up in `status` when `age` is 16?',
      solution:
        '`age >= 18` asks whether `age` is 18 or more. Here that means: is 16 at least 18? It isn\'t, so the condition is false.\n\n' +
        'A false condition skips line 3 and runs the `else` block, so line 5 stores `minor` in `status`. Line 7 then prints what is stored.',
      conclusion: '16 is below 18, so the `else` branch stores the word and line 7 prints `minor`.',
      whyWrong: [
        'This takes the `if` branch even though the condition is false. $16$ is not at least $18$.',
        'This prints the result of the condition. The code prints `status`, which holds one of the two strings.',
        '`print(status)` prints the value stored in the variable, not its name. To print the word itself you would need quotes.',
        null,
      ],
      keyIdea: 'For `if`/`else`, put the real value into the condition, decide true or false, then follow only that one block. `print(status)` shows the value stored, and never the word `status`.',
    },
    check: {
      optionValues: ['adult', 'false', 'status', 'minor'],
      compute: () => {
        const age: number = 16;
        return age >= 18 ? 'adult' : 'minor';
      },
    },
  },
  {
    id: 'conditionals-020',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'Which operator means "not equal to"?',
    options: ['`!=`', '`==`', '`<=`', '`=`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which symbol asks whether two values are different?',
      solution:
        'In code, `!` means "not". So to say "not equal", we put `!` in front of an equals sign.\n\n' +
        'That gives `!=`, which reads as "not equal". For example, `5 != 3` is true, because 5 and 3 are different.',
      conclusion: '"Not equal to" is the "not" sign followed by an equals sign, which is `!=`.',
      whyWrong: [
        null,
        '`==` means "equal to", the opposite.',
        '`<=` means "less than or equal to".',
        'A single `=` stores a value in a variable. It does not compare.',
      ],
      keyIdea: 'Read the symbols aloud: `==` is "equal to", `!=` is "not equal to", `<=` is "less than or equal to", `>=` is "greater than or equal to", and a single `=` stores a value.',
    },
  },
  {
    id: 'conditionals-021',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'When is `p or q` false?',
    options: ['Only when both are false', 'Only when both are true', 'When exactly one is false', 'Never'],
    correctIndex: 0,
    markScheme: {
      asking: 'In which situation does `p or q` come out false?',
      solution:
        '`or` is true if **at least one** side is true. So one true side is enough to make the whole thing true.\n\n' +
        'List all four cases:\n\n| `p` | `q` | `p or q` |\n|---|---|---|\n| true | true | true |\n| true | false | true |\n| false | true | true |\n| false | false | false |\n\n' +
        'Only the last row comes out false.',
      conclusion: '`or` has nothing to make it true only if neither side is true, so the answer is: Only when both are false.',
      whyWrong: [
        null,
        'When both are true, `or` is true. This is closer to the rule for `not (p and q)`.',
        'With exactly one false, the other is true, so `or` is true.',
        'When both are false there is nothing to make it true, so it is false.',
      ],
      keyIdea: 'To test an `and` or `or` statement, write the four cases of true and false in a table. `or` is false only in the false-false row. `and` is true only in the true-true row.',
    },
    check: {
      optionValues: ['00', '11', '01', 'none'],
      compute: () => {
        const falseCases: string[] = [];
        for (const p of [false, true]) for (const q of [false, true]) if (!(p || q)) falseCases.push(`${Number(p)}${Number(q)}`);
        return falseCases.join(',');
      },
    },
  },
  {
    id: 'conditionals-022',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'When does the `else` block of an `if` statement run?',
    options: ['When the condition is false', 'When the condition is true', 'Always, after the `if` block', 'Never'],
    correctIndex: 0,
    markScheme: {
      asking: 'What has to happen for the `else` part of an `if` to run?',
      solution:
        'An `if` tests a condition, and that test is either true or false. If it is true, the `if` block runs.\n\n' +
        'The `else` block is the other route. It runs only if the test came out false, and then the `if` block is skipped. Exactly one of the two blocks runs.',
      conclusion: 'The `else` block is the route taken after a failed test, so it runs: When the condition is false.',
      whyWrong: [
        null,
        'That is when the `if` block runs.',
        'Only one of the two blocks runs. The `else` block does not follow the `if` block.',
        'It runs whenever the condition is false.',
      ],
      keyIdea: 'Think of `if`/`else` as a fork in the road: one test, two routes, and you take exactly one. Put the value in, decide true or false, and ignore the other block completely.',
    },
  },
  {
    id: 'conditionals-023',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'What is the value of `not (3 > 5)`?',
    options: ['`true`', '`false`', '`3`', '`5`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do you get when you flip the result of `3 > 5`?',
      solution:
        'Brackets come first, so work out `3 > 5`. 3 is not greater than 5, so this is `false`.\n\n' +
        '`not` flips a true or false value: `not true` is `false`, and `not false` is `true`. So we flip `false` to get `true`.',
      conclusion: '`3 > 5` is false and `not` flips it, so the value is `true`.',
      whyWrong: [
        null,
        'This is the value of `3 > 5` before the `not` is applied.',
        'A comparison gives true or false, not one of the numbers.',
        'A comparison gives true or false, not one of the numbers.',
      ],
      keyIdea: 'With `not (...)`, work out the inside first to get true or false, then flip it. A comparison always gives true or false, never one of the numbers.',
    },
    check: {
      optionValues: ['true', 'false', 3, 5],
      compute: () => {
        const a: number = 3;
        const b: number = 5;
        return String(!(a > b));
      },
    },
  },
  {
    id: 'conditionals-024',
    subtopic: 'conditionals',
    difficulty: 'foundation',
    stem: 'If `x` is 5, which comparison is true?',
    options: ['`x >= 5`', '`x > 5`', '`x != 5`', '`x < 5`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which of these tests passes when `x` is exactly 5?',
      solution:
        'Put 5 in place of `x` and answer each one:\n\n| Test | Question | Result |\n|---|---|---|\n| `5 > 5` | is 5 bigger than 5? | false |\n| `5 != 5` | is 5 different from 5? | false |\n| `5 < 5` | is 5 smaller than 5? | false |\n| `5 >= 5` | is 5 bigger than or equal to 5? | true |\n\n' +
        '5 is equal to 5, and only one test allows equal.',
      conclusion: '5 equals 5, so the "or equal" test passes: `x >= 5`.',
      whyWrong: [
        null,
        '`>` is strict, and 5 is not greater than 5.',
        '5 is equal to 5, so `!=` is false.',
        '`<` is strict, and 5 is not less than 5.',
      ],
      keyIdea: 'When a value sits exactly on the boundary, only tests that include equal can pass: `>=`, `<=` and `==`. The strict tests `>` and `<` fail there, and so does `!=`.',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const x: number = 5;
        return [x >= 5, x > 5, x !== 5, x < 5].indexOf(true);
      },
    },
  },

  // ------------------------------------------------------------------ exam
  {
    id: 'conditionals-009',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L(
        's = 95',
        'if s >= 50',
        '   print("pass")',
        'else',
        '   if s >= 70',
        '      print("merit")',
        '   else',
        '      if s >= 90',
        '         print("top")',
        '      else',
        '         print("fail")',
        '      end if',
        '   end if',
        'end if',
      ),
    },
    options: ['`pass`', '`merit`', '`top`', '`fail`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which word is printed when `s` is 95, given the order of the tests?',
      solution:
        'The code tests `s >= 50` first, on line 2. All the other tests sit inside its `else`, from line 4 onwards, so they run only if this first test is false.\n\n' +
        '`>=` means "greater than or equal to". Is `95 >= 50`? Yes, so the first test is true. A true `if` skips its whole `else`, so the tests for 70 and 90 are never reached.\n\n' +
        'Only line 3 runs, and it prints `pass`.',
      conclusion: 'The first test is true and the later tests are skipped, so the output is `pass`, even though 95 looks like a top score.',
      whyWrong: [
        null,
        'The test for 70 sits inside the `else`, which runs only if `s >= 50` is false.',
        'This is the band 95 seems to belong in, but the test for 90 is reached only if `s >= 50` is false.',
        'This is printed only when all three tests fail. `95 >= 50` is true.',
      ],
      keyIdea: 'Trace a nested `if` from the top and stop at the first true test. For bands to work, the highest test must come first, because asking `>= 50` first catches every high score.',
    },
    check: {
      optionValues: ['pass', 'merit', 'top', 'fail'],
      compute: () => {
        const s: number = 95;
        return s >= 50 ? 'pass' : s >= 70 ? 'merit' : s >= 90 ? 'top' : 'fail';
      },
    },
  },
  {
    id: 'conditionals-010',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: TWO_LINES,
    code: {
      lang: 'pseudocode',
      source: L(
        'x = 12',
        'y = 5',
        'if x > 10',
        '   if y > 10',
        '      print("P")',
        '   else',
        '      print("Q")',
        '   end if',
        'else',
        '   if y > 3',
        '      print("R")',
        '   else',
        '      print("S")',
        '   end if',
        'end if',
      ),
    },
    options: ['`Q R`', '`Q`', '`R`', 'Nothing is printed'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which branch of the two nested `if`s runs when `x` is 12 and `y` is 5?',
      solution:
        'Each `if` pairs with the `else` at the same indent. The outer `if` on line 3 has its `else` on line 9. The inner `if` on line 4 has its own `else` on line 6.\n\n' +
        'Line 3: `12 > 10` is true. So we enter the block on lines 4 to 8 and skip the outer `else` completely.\n\n' +
        'Line 4: `5 > 10` is false. So line 5 is skipped, and the inner `else` runs line 7, which prints `Q`.',
      conclusion: 'The outer test is true and the inner test is false, so exactly one print runs and the output is `Q`.',
      whyWrong: [
        'Once the outer `if x > 10` is true, its `else` block is skipped completely, so `R` cannot also be printed.',
        null,
        'This thinks that when the inner `if` fails, the outer `else` runs. It does not: the inner `if` has its own `else`, which prints `Q`.',
        'This forgets the inner `else`. The inner test is false, so its `else` branch runs and prints `Q`.',
      ],
      keyIdea: 'With nested `if`s, match each `else` to its `if` using the indentation. Test the outer condition first, cross out the block not taken, then repeat inside the block you are in. Only one print runs.',
    },
    check: {
      optionValues: ['Q R', 'Q', 'R', null],
      compute: () => {
        const x: number = 12;
        const y: number = 5;
        if (x > 10) return y > 10 ? 'P' : 'Q';
        return y > 3 ? 'R' : 'S';
      },
    },
  },
  {
    id: 'conditionals-018',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'Which condition is equivalent to `not (x > 3 and y <= 5)` for **all** integer values of `x` and `y`?',
    options: ['`x <= 3 and y > 5`', '`x < 3 or y > 5`', '`x <= 3 or y > 5`', '`x > 3 or y <= 5`'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which condition is true exactly when `x > 3 and y <= 5` is false?',
      solution:
        '`not (...)` means the bracket must be false. An `and` is true only when both parts are true. So it is false when **at least one** part is false.\n\n' +
        'So we need: `x > 3` is false, or `y <= 5` is false. Notice that `and` has become `or`.\n\n' +
        'Now flip each part. `x > 3` is false when `x` is 3 or less, which is `x <= 3`. `y <= 5` is false when `y` is more than 5, which is `y > 5`.\n\n' +
        'Put the flipped parts together with `or`: `x <= 3 or y > 5`.',
      conclusion: 'Flipping each comparison and changing `and` to `or` gives `x <= 3 or y > 5`.',
      whyWrong: [
        'This negates both comparisons but forgets to swap `and` for `or`. Try x = 0, y = 0: the original is true but this is false.',
        'This negates `x > 3` as `x < 3`, forgetting the equal case. The opposite of `x > 3` is `x <= 3`; with x = 3, y = 5 the original is true but this is false.',
        null,
        'This swaps `and` for `or` but does not negate the comparisons. Try x = 4, y = 0: the original is false but this is true.',
      ],
      keyIdea: 'To remove a `not` from a bracket, flip each part and swap `and` with `or`. Opposites include the boundary: the opposite of `>` is `<=`, and the opposite of `<` is `>=`. Test your result with values on the boundary.',
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
    stem: 'What does this pseudocode print? Arrays are indexed from 1.',
    code: {
      lang: 'pseudocode',
      source: L(
        'A = [1900, 2000, 2024, 2023]',
        'count = 0',
        'for i = 1 to length(A)',
        '   y = A[i]',
        '   if mod(y,4) == 0 and (mod(y,100) != 0 or mod(y,400) == 0) // mod is the modulus operator',
        '      count = count + 1',
        '   end if',
        'end for',
        'print(count)',
      ),
    },
    options: ['`3`', '`1`', '`0`', '`2`'],
    correctIndex: 3,
    markScheme: {
      asking: 'How many of the four years pass the test on line 5?',
      solution:
        '`mod(y,4)` is the remainder when `y` is divided by 4. A remainder of 0 means it divides exactly. For example, `mod(2024,4)` is 0, because $4 \\times 506 = 2024$.\n\n' +
        'The test has two parts joined by `and`, so both must be true. Part 1 is `mod(y,4) == 0`. Part 2 is the bracket, which needs at least one of its two sides to be true, because of the `or`. `!=` means "not equal to".\n\n' +
        'Work through each year, with `i` as its position in `A`:\n\n| `i` | `y` | `mod(y,4)==0` | `mod(y,100)!=0` | `mod(y,400)==0` | Bracket | Whole test | `count` |\n|---|---|---|---|---|---|---|---|\n| 1 | 1900 | true | false | false | false | false | 0 |\n| 2 | 2000 | true | false | true | true | true | 1 |\n| 3 | 2024 | true | true | false | true | true | 2 |\n| 4 | 2023 | false | true | false | true | false | 2 |\n\n' +
        'Line 9 prints `count`, which holds 2.',
      conclusion: 'Only 2000 and 2024 pass both parts, so `count` ends at 2 and the answer is `2`.',
      whyWrong: [
        'This checks only `mod(y,4) == 0`. For 1900 the bracket is false, because 1900 is divisible by 100 but not by 400.',
        'This rejects 2000 because it is divisible by 100. But 2000 is divisible by 400, which makes the bracket true.',
        'This reads the `or` in the bracket as `and`. No number can be divisible by 400 and not by 100, so nothing would pass.',
        null,
      ],
      keyIdea: 'For a long condition, make a column for each small test, then one for the bracket, then one for the whole test. Fill in one row per value. Work out brackets first, then `and`.',
    },
    check: {
      optionValues: [3, 1, 0, 2],
      compute: () => [1900, 2000, 2024, 2023].filter((y) => mod(y, 4) === 0 && (mod(y, 100) !== 0 || mod(y, 400) === 0)).length,
    },
  },
  {
    id: 'conditionals-025',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: TWO_LINES,
    code: {
      lang: 'pseudocode',
      source: L('x = 8', 'if x > 5', '   print("red")', 'end if', 'if x > 7', '   print("blue")', 'else', '   print("green")', 'end if'),
    },
    options: ['`red blue`', '`red`', '`blue`', '`red green`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which words are printed when `x` is 8 and there are two separate `if` statements?',
      solution:
        'There are two separate `if` statements, on line 2 and line 5. Each has its own `end if`, so both get tested, one after the other.\n\n' +
        'First `if`: `8 > 5` is true, so line 3 prints `red`.\n\n' +
        'Second `if`: `8 > 7` is true, so line 6 prints `blue`, and the `else` on line 7 is skipped.',
      conclusion: 'Both tests are true and they don\'t affect each other, so the output is `red blue`.',
      whyWrong: [
        null,
        'This treats the second `if` as part of one chain with the first. Each `end if` closes its own statement, so the second test still runs.',
        'This skips the first `if`. It is checked too, and `8 > 5` is true.',
        'This runs the `else` of the second `if`, but `8 > 7` is true.',
      ],
      keyIdea: 'Count the `end if`s to see how many separate statements there are. Each separate `if` gets its own test. Only `else` or nesting makes one branch depend on another.',
    },
    check: {
      optionValues: ['red blue', 'red', 'blue', 'red green'],
      compute: () => {
        const x: number = 8;
        const out: string[] = [];
        if (x > 5) out.push('red');
        out.push(x > 7 ? 'blue' : 'green');
        return out.join(' ');
      },
    },
  },
  {
    id: 'conditionals-026',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('x = 4', 'if x > 3', '   x = x - 2', 'end if', 'if x > 3', '   x = x * 10', 'else', '   x = x + 1', 'end if', 'print(x)'),
    },
    options: ['`3`', '`20`', '`40`', '`2`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What is `x` after both `if` statements have run on it?',
      solution:
        'These are two separate `if` statements. The first may change `x`, and the second then tests the new value.\n\n' +
        'Line 2: `4 > 3` is true, so line 3 runs. `x` becomes $4 - 2 = 2$.\n\n' +
        'Line 5 tests the new `x`: `2 > 3` is false. So line 6 is skipped and the `else` runs line 8, where `x` becomes $2 + 1 = 3$. Line 10 prints it.',
      conclusion: 'The second test sees `x` as 2 and not 4, so `x` ends as 3 and the answer is `3`.',
      whyWrong: [
        null,
        'This uses the old `x` of 4 for the second test, then multiplies the new `x` of 2 by 10. Each test uses the value at that moment.',
        'This skips the first `if` and multiplies 4 by 10. `4 > 3` is true, so `x` has already become 2.',
        'This stops after the first `if`. The second statement is separate and still runs.',
      ],
      keyIdea: 'When an `if` changes a variable that a later `if` tests, keep a running value of that variable. Each test uses the value at that moment, never the value from the start.',
    },
    check: {
      optionValues: [3, 20, 40, 2],
      compute: () => {
        let x = 4;
        if (x > 3) x = x - 2;
        if (x > 3) x = x * 10;
        else x = x + 1;
        return x;
      },
    },
  },
  {
    id: 'conditionals-027',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('a = true', 'b = false', 'c = false', 'if a or b and c', '   print("yes")', 'else', '   print("no")', 'end if'),
    },
    options: ['`yes`', '`no`', '`true`', '`Error`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Is `a or b and c` true or false, given that `and` is worked out before `or`?',
      solution:
        '`and` and `or` have an order, like $\\times$ and $+$ in maths: `and` is done first. So the condition means `a or (b and c)`.\n\n' +
        'Work out the `and` first: `b and c` is `false and false`. `and` needs both sides true, so this is `false`.\n\n' +
        'Now the `or`: `a or false` is `true or false`. `or` needs only one side true, so this is `true`.\n\n' +
        'A true condition runs the `if` block, so line 5 prints `yes`.',
      conclusion: 'With `and` done first the condition is true, so the output is `yes`.',
      whyWrong: [
        null,
        'This works left to right: `(a or b) and c` is false. But `and` is done before `or`.',
        'The condition only chooses the branch. The code then prints one of the two words.',
        'Combining Boolean values with `and` and `or` is allowed, so there is no error.',
      ],
      keyIdea: 'In a mixed condition, the order is `not`, then `and`, then `or`. Put brackets around the `and` part before working anything out, then evaluate from the inside out.',
    },
    check: {
      optionValues: ['yes', 'no', 'true', null],
      compute: () => {
        const a: boolean = true;
        const b: boolean = false;
        const c: boolean = false;
        return a || (b && c) ? 'yes' : 'no';
      },
    },
  },
  {
    id: 'conditionals-028',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L(
        'n = 5',
        'c = 0',
        'while (n != 1)',
        '   if mod(n,2) == 0 // mod is the modulus operator',
        '      n = div(n,2) // div is integer division',
        '   else',
        '      n = 3 * n + 1',
        '   end if',
        '   c = c + 1',
        'end while',
        'print(c)',
      ),
    },
    options: ['`5`', '`4`', '`16`', INFINITE],
    correctIndex: 0,
    markScheme: {
      asking: 'How many passes does the loop make before `n` reaches 1?',
      solution:
        '`mod(n,2)` is the remainder, what is left over after dividing by 2. For example, `mod(5,2)` is 1, because $5 = 2 \\times 2 + 1$. It is 0 for even numbers and 1 for odd numbers, so line 4 is an even-or-odd test. `div(n,2)` halves `n`, dropping any decimal part.\n\n' +
        'So each pass does this: if `n` is even, halve it. If it is odd, work out `3 * n + 1`. Then add 1 to `c`. The loop stops once `n` is 1.\n\n' +
        'Trace it:\n\n| Pass | `n` at start | Even or odd | `n` becomes | `c` |\n|---|---|---|---|---|\n| 1 | 5 | odd | $3 \\times 5 + 1 = 16$ | 1 |\n| 2 | 16 | even | 8 | 2 |\n| 3 | 8 | even | 4 | 3 |\n| 4 | 4 | even | 2 | 4 |\n| 5 | 2 | even | 1 | 5 |\n\n' +
        '`!=` means "not equal to". Now `n` is 1, so `n != 1` is false and line 11 prints 5.',
      conclusion: '`n` reaches 1 after 5 passes, and `c` counts the passes, so the answer is `5`.',
      whyWrong: [
        null,
        'This stops when `n` reaches 2. The condition `n != 1` is still true there, so there is one more pass.',
        'This is the largest value of `n`. The code prints the counter `c`.',
        'The trace reaches $n = 1$ after 5 passes, so the loop stops.',
      ],
      keyIdea: 'When an `if` inside a loop changes the loop variable, draw a row per pass: start value, which branch ran, new value, counter. Test the `while` condition after each row.',
    },
    check: {
      optionValues: [5, 4, 16, INFINITE],
      compute: () => {
        let n = 5;
        let c = 0;
        while (n !== 1) {
          if (c > 1000) return INFINITE;
          n = mod(n, 2) === 0 ? Math.floor(n / 2) : 3 * n + 1;
          c++;
        }
        return c;
      },
    },
  },
  {
    id: 'conditionals-029',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('x = 1', 'while (x < 5)', '   if x == 3', '      print("stop")', '   else', '      x = x + 1', '   end if', 'end while'),
    },
    options: [INFINITE, '`stop`', 'Nothing is printed', '`3`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Does this loop ever finish once `x` reaches 3?',
      solution:
        'The loop runs while `x < 5`, so it can only end if `x` gets to 5. `x` changes only on line 6, in the `else` branch.\n\n' +
        'Trace the first few passes:\n\n| Pass | `x` at start | `x == 3`? | What happens |\n|---|---|---|---|\n| 1 | 1 | no | `x` becomes 2 |\n| 2 | 2 | no | `x` becomes 3 |\n| 3 | 3 | yes | prints `stop`, `x` stays 3 |\n| 4 | 3 | yes | prints `stop`, `x` stays 3 |\n\n' +
        'Once `x` is 3, only the `if` branch runs, and it doesn\'t change `x`. Printing a word doesn\'t end a loop, so `x < 5` stays true for ever.',
      conclusion: '`x` is stuck at 3 and `stop` keeps being printed with no end, so the answer is: Infinite loop.',
      whyWrong: [
        null,
        'This treats `print("stop")` as if it ended the loop. Printing a word does not stop anything; `break` would.',
        'The `else` branch raises `x` to 3, so the `if` branch does run and `stop` is printed.',
        'The code never prints `x`. It prints the word `stop`.',
      ],
      keyIdea: 'To test for a never-ending loop, look in every branch for a line that moves the loop variable towards the end. If a reachable branch leaves it unchanged, the loop gets stuck there. Only `break` (end the loop now) or `return` (end the function now) leaves a loop early.',
    },
    check: {
      optionValues: [INFINITE, 'stop', null, 3],
      compute: () => {
        let x = 1;
        const out: string[] = [];
        for (let n = 0; x < 5; n++) {
          if (n > 1000) return INFINITE;
          if (x === 3) out.push('stop');
          else x = x + 1;
        }
        return out.join(' ');
      },
    },
  },
  {
    id: 'conditionals-030',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('a = 7', 'b = 12', 'c = 9', 'm = a', 'if b > m', '   m = b', 'end if', 'if c > m', '   m = c', 'end if', 'print(m)'),
    },
    options: ['`12`', '`9`', '`7`', '`28`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does `m` hold after it has been compared with `b` and `c`?',
      solution:
        '`m` starts as a copy of `a`, so `m` is 7. Each `if` then replaces `m` if it finds a bigger number.\n\n' +
        'Line 5: is `12 > 7`? Yes, so line 6 changes `m` to 12.\n\n' +
        'Line 8 uses the new `m`: is `9 > 12`? No, so `m` stays as it was. Line 11 prints 12.',
      conclusion: '`m` always keeps the biggest value seen so far, so it ends as the largest of the three and the answer is `12`.',
      whyWrong: [
        null,
        'This compares `c` with the original 7. By then `m` is 12, so `9 > m` is false.',
        'This is the starting value of `m`. The first test replaces it.',
        'This is the sum of the three values. `m` is replaced, never added to.',
      ],
      keyIdea: 'This pattern finds the largest value: start `m` at the first item, then replace it whenever a later item is bigger. Spot it by `if x > m` followed by `m = x`. Change `>` to `<` for the smallest.',
    },
    check: {
      optionValues: [12, 9, 7, 28],
      compute: () => {
        let m = 7;
        for (const v of [12, 9]) if (v > m) m = v;
        return m;
      },
    },
  },
  {
    id: 'conditionals-031',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'Which condition is equivalent to `not (x < 2 or y == 7)` for all integer values of `x` and `y`?',
    options: ['`x >= 2 and y != 7`', '`x >= 2 or y != 7`', '`x > 2 and y != 7`', '`x < 2 and y == 7`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which condition is true exactly when `x < 2 or y == 7` is false?',
      solution:
        '`not (...)` means the bracket must be false. An `or` is false only when **both** parts are false.\n\n' +
        'So we need `x < 2` to be false **and** `y == 7` to be false. Notice that `or` has become `and`.\n\n' +
        'Flip each part. `x < 2` is false when `x` is 2 or more, which is `x >= 2`. `y == 7` is false when `y` is anything but 7, which is `y != 7`.\n\n' +
        'Join them with `and`: `x >= 2 and y != 7`.',
      conclusion: 'Flipping each comparison and changing `or` to `and` gives `x >= 2 and y != 7`.',
      whyWrong: [
        null,
        'This negates both parts but keeps `or`. Try x = 0, y = 0: the original is false but this is true.',
        'This negates `x < 2` as `x > 2`, missing the equal case. With x = 2, y = 0 the original is true but this is false.',
        'This swaps `or` for `and` without negating the parts. Try x = 3, y = 0: the original is true but this is false.',
      ],
      keyIdea: 'To remove a `not` from a bracket, flip each part and swap `and` with `or`. The opposite of `<` is `>=`, because the boundary moves across, and the opposite of `==` is `!=`.',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const original = (x: number, y: number) => !(x < 2 || y === 7);
        const opts = [
          (x: number, y: number) => x >= 2 && y !== 7,
          (x: number, y: number) => x >= 2 || y !== 7,
          (x: number, y: number) => x > 2 && y !== 7,
          (x: number, y: number) => x < 2 && y === 7,
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
    id: 'conditionals-032',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'Let $p$ and $q$ be Boolean variables. Which expression is true exactly when one of them is true (exclusive or)?',
    options: ['`(p or q) and not (p and q)`', '`p and q`', '`p or q`', '`not p and not q`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which expression means "one of them is true, but not both"?',
      solution:
        '**Exclusive or** means exactly one is true. Compared with a normal `or`, we have to rule out the case where both are true.\n\n' +
        'So two things must hold: at least one is true, and they are not both true.\n\n' +
        'In code, "at least one" is `p or q`. "Not both" is `not (p and q)`.\n\n' +
        'Both must hold, so join them with `and`, then test all four cases:\n\n| `p` | `q` | `p or q` | `not (p and q)` | `(p or q) and not (p and q)` |\n|---|---|---|---|---|\n| true | true | true | false | false |\n| true | false | true | true | true |\n| false | true | true | true | true |\n| false | false | false | true | false |',
      conclusion: 'It is true in just the two rows where exactly one is true, so the answer is `(p or q) and not (p and q)`.',
      whyWrong: [
        null,
        'This is true only when both are true.',
        'This is also true when both are true, so it is not exclusive.',
        'This is true only when both are false.',
      ],
      keyIdea: 'Build logic expressions from plain words: "at least one" is `or`, "not both" is `not (... and ...)`, and "both of these" joins with `and`. Then test your expression with a four-row truth table.',
    },
    check: {
      optionValues: [0, 1, 2, 3],
      compute: () => {
        const opts = [
          (p: boolean, q: boolean) => (p || q) && !(p && q),
          (p: boolean, q: boolean) => p && q,
          (p: boolean, q: boolean) => p || q,
          (p: boolean, q: boolean) => !p && !q,
        ];
        const match = opts
          .map((f, i) => ({ f, i }))
          .filter(({ f }) => {
            for (const p of [false, true]) for (const q of [false, true]) if (f(p, q) !== (p !== q)) return false;
            return true;
          });
        return match.length === 1 ? match[0].i : -1;
      },
    },
  },
  {
    id: 'conditionals-033',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'What does this Python code print? (`%` is the remainder.)',
    code: {
      lang: 'python',
      source: L('n = 30', 'if n % 3 == 0:', '    print("Fizz")', 'elif n % 5 == 0:', '    print("Buzz")', 'elif n % 15 == 0:', '    print("FizzBuzz")', 'else:', '    print(n)'),
    },
    options: ['`Fizz`', '`Buzz`', '`FizzBuzz`', '`30`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which branch of the chain runs when `n` is 30?',
      solution:
        '`%` gives the remainder, what is left over after dividing. For example, `7 % 3` is 1. So `n % 3 == 0` asks whether 3 divides `n` with nothing left over.\n\n' +
        'This is an `if`/`elif`/`else` chain, where `elif` means "else if". It checks from the top and runs only the first true test. All the later tests are skipped, even if they are true.\n\n' +
        'Line 2: 30 divided by 3 is 10, with remainder 0. So `30 % 3 == 0` is true, and line 3 prints `Fizz`.',
      conclusion: '30 passes the very first test, so the chain stops there and the output is `Fizz`.',
      whyWrong: [
        null,
        '`30 % 5 == 0` is True as well, but the chain stops at the first true branch, and that comes earlier.',
        '30 is a multiple of 15, but that test comes last, so it is never reached. It would have to be checked first.',
        'This is the `else` branch, which runs only if every condition is False.',
      ],
      keyIdea: 'In a chain, order matters, so the most specific case must go first. A test for multiples of 15 placed after tests for 3 and 5 can never be reached, because every multiple of 15 passes those earlier tests.',
    },
    check: {
      optionValues: ['Fizz', 'Buzz', 'FizzBuzz', 30],
      compute: () => {
        const n: number = 30;
        if (mod(n, 3) === 0) return 'Fizz';
        if (mod(n, 5) === 0) return 'Buzz';
        if (mod(n, 15) === 0) return 'FizzBuzz';
        return n;
      },
    },
    python: { stdout: 'Fizz\n' },
  },
  {
    id: 'conditionals-034',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: L('def sign(x):', '    if x > 0:', '        return 1', '    elif x == 0:', '        return 0', '    else:', '        return -1', '', 'print(sign(-4) + sign(0) + sign(9))'),
    },
    options: ['`0`', '`2`', '`1`', '`-1`'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do the three results of `sign` add up to?',
      solution:
        '`def sign(x):` defines a function, which runs only when called. `return` hands a value back to the place that called it, and the function stops there. `elif` means "else if", so it is tested only if the test above it was false.\n\n' +
        'Line 9 calls `sign` three times. Work out each call:\n\n| Call | `x > 0`? | `x == 0`? | Returns |\n|---|---|---|---|\n| `sign(-4)` | False | False | $-1$ |\n| `sign(0)` | False | True | 0 |\n| `sign(9)` | True | not checked | 1 |\n\n' +
        'Line 9 adds the three returned values. $-1$ and 1 cancel each other out, and adding 0 changes nothing, so the total is 0.',
      conclusion: 'A negative, a zero and a positive give $-1$, 0 and 1, which cancel out, so the answer is `0`.',
      whyWrong: [
        null,
        'This treats $-4$ as positive, so that its call returns 1. $-4 > 0$ is False.',
        'This treats 0 as positive, so that its call returns 1. `0 > 0` is False, so the `elif` runs.',
        'This uses only the first call. The last line adds all three.',
      ],
      keyIdea: 'For a function with branches, make one row per call. Go down the tests, stop at the first true one, and write its `return` value. Then replace each call with its value and do the sum.',
    },
    check: {
      optionValues: [0, 2, 1, -1],
      compute: () => {
        const sign = (x: number) => (x > 0 ? 1 : x === 0 ? 0 : -1);
        return sign(-4) + sign(0) + sign(9);
      },
    },
    python: { stdout: '0\n' },
  },
  {
    id: 'conditionals-035',
    subtopic: 'conditionals',
    difficulty: 'exam',
    stem: PRINTS,
    code: {
      lang: 'pseudocode',
      source: L('count = 0', 'for x = 1 to 6', '   if mod(x,2) == 0 or x > 4 // mod is the modulus operator', '      count = count + 1', '   end if', 'end for', 'print(count)'),
    },
    options: ['`4`', '`1`', '`5`', '`3`'],
    correctIndex: 0,
    markScheme: {
      asking: 'How many of the numbers 1 to 6 are even or bigger than 4?',
      solution:
        '`mod(x,2)` is the remainder after dividing by 2. A remainder of 0 means `x` is even. For example, `mod(4,2)` is 0 and `mod(5,2)` is 1.\n\n' +
        '`or` needs at least one side to be true. If both are true, `count` still goes up by only 1, because line 4 runs once per pass.\n\n' +
        'Trace all six values:\n\n| `x` | `mod(x,2) == 0` | `x > 4` | Either true? | `count` |\n|---|---|---|---|---|\n| 1 | false | false | no | 0 |\n| 2 | true | false | yes | 1 |\n| 3 | false | false | no | 1 |\n| 4 | true | false | yes | 2 |\n| 5 | false | true | yes | 3 |\n| 6 | true | true | yes | 4 |\n\n' +
        'Line 7 prints `count`, which holds 4.',
      conclusion: '2, 4, 5 and 6 pass the test, so `count` ends at 4 and the answer is `4`.',
      whyWrong: [
        null,
        'This reads `or` as `and`. Only 6 is both even and above 4.',
        'This adds 3 even numbers to 2 values above 4, so 6 is counted twice. Each `x` adds at most 1.',
        'This checks only the even test and ignores `x > 4`, so it misses 5.',
      ],
      keyIdea: 'For a counter with `or`, test each value in its own row instead of adding the two groups, because values in both groups would be counted twice. Each row adds at most one.',
    },
    check: {
      optionValues: [4, 1, 5, 3],
      compute: () => {
        let count = 0;
        for (let x = 1; x <= 6; x++) if (mod(x, 2) === 0 || x > 4) count++;
        return count;
      },
    },
  },
];
