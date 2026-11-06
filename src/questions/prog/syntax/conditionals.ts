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
      solution:
        'Work out each comparison with `x = 5`:\n\n' +
        '| Expression | Meaning | With x = 5 | Result |\n' +
        '|---|---|---|---|\n' +
        '| `x > 5` | strictly greater than 5 | `5 > 5` | `false` |\n' +
        '| `x >= 5` | greater than **or equal to** 5 | `5 >= 5` | `true` |\n' +
        '| `x != 5` | **not** equal to 5 | `5 != 5` | `false` |\n\n' +
        'Output: `false`, `true`, `false`.',
      whyWrong: [
        'This treats `x > 5` as if it included 5. "Strictly greater than" means 5 itself does not count, so `5 > 5` is false.',
        'This reads `!=` as "equal to". `!=` means "not equal to", and 5 is equal to 5, so `x != 5` is false.',
        null,
        'This treats `>=` like `>`. `>=` means "greater than or equal to", and 5 is equal to 5, so `x >= 5` is true.',
      ],
      keyIdea: '`>` and `<` are strict (the boundary value gives false), `>=` and `<=` include the boundary, and `!=` means "not equal".',
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
      solution:
        'Python writes "else if" as `elif`. An `if / elif / else` chain is checked **from the top down**, and **only the first branch whose condition is True runs**. Everything after it is skipped.\n\n' +
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
    stem: 'In this pseudocode, which line correctly tests whether `score` is equal to 100?',
    options: ['`if score == 100`', '`if score = 100`', '`if score === 100`', '`if score equals 100`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Two symbols look alike:\n\n' +
        '- `=` is **assignment**: `score = 100` *stores* 100 in `score`.\n' +
        '- `==` is **comparison**: `score == 100` *asks* "is score equal to 100?" and gives true or false.\n\n' +
        'An `if` needs a question, so the correct line is `if score == 100`.',
      whyWrong: [
        null,
        'A single `=` is assignment (store a value), not comparison.',
        'Three equals signs are not used in this pseudocode. Equality is written `==`.',
        '`equals` is not an operator. Equality is written `==`.',
      ],
      keyIdea: '`=` stores a value, `==` compares two values; an equality test uses `==`.',
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
      solution:
        '1. `age >= 18` is `16 >= 18`, which is false.\n' +
        '2. So the `else` branch runs and `status` becomes `"minor"`.\n' +
        '3. `print(status)` prints the value stored in `status`, without quotes.\n\n' +
        'Output: `minor`.',
      whyWrong: [
        'This takes the `if` branch even though the condition is false. $16$ is not at least $18$.',
        'This prints the result of the condition. The code prints `status`, which holds one of the two strings.',
        '`print(status)` prints the value stored in the variable, not its name. To print the word itself you would need quotes.',
        null,
      ],
      keyIdea: 'An `if`/`else` runs exactly one of its two blocks, depending on the condition.',
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
      solution: '`!=` means "not equal to". For example, `3 != 4` is true and `3 != 3` is false.',
      whyWrong: [
        null,
        '`==` means "equal to", the opposite.',
        '`<=` means "less than or equal to".',
        'A single `=` stores a value in a variable. It does not compare.',
      ],
      keyIdea: '`==` tests for equal and `!=` tests for not equal.',
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
      solution:
        '`p or q` is true if **at least one** of them is true. So it is false in just one case: when both are false.\n\n' +
        '| p | q | p or q |\n|---|---|---|\n| true | true | true |\n| true | false | true |\n| false | true | true |\n| false | false | false |',
      whyWrong: [
        null,
        'When both are true, `or` is true. This is closer to the rule for `not (p and q)`.',
        'With exactly one false, the other is true, so `or` is true.',
        'When both are false there is nothing to make it true, so it is false.',
      ],
      keyIdea: '`or` needs at least one true part; `and` needs both.',
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
      solution:
        'An `if`/`else` runs exactly one of its two blocks: the `if` block when the condition is true, and the `else` block when it is false.',
      whyWrong: [
        null,
        'That is when the `if` block runs.',
        'Only one of the two blocks runs. The `else` block does not follow the `if` block.',
        'It runs whenever the condition is false.',
      ],
      keyIdea: 'Exactly one block of an `if`/`else` runs.',
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
      solution:
        '1. Brackets first: `3 > 5` is false.\n' +
        '2. `not` flips it: `not false` is true.\n\n' +
        'Answer: `true`.',
      whyWrong: [
        null,
        'This is the value of `3 > 5` before the `not` is applied.',
        'A comparison gives true or false, not one of the numbers.',
        'A comparison gives true or false, not one of the numbers.',
      ],
      keyIdea: '`not` flips true and false.',
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
      solution:
        '`>=` means "greater than or equal to". Since 5 is equal to 5, `x >= 5` is true.\n\n' +
        'The other three all leave out the value 5 itself.',
      whyWrong: [
        null,
        '`>` is strict, and 5 is not greater than 5.',
        '5 is equal to 5, so `!=` is false.',
        '`<` is strict, and 5 is not less than 5.',
      ],
      keyIdea: '`>=` and `<=` include the boundary value; `>` and `<` do not.',
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
      solution:
        'Conditions are checked in the order written, and the inner ones are reached only when the outer one is false.\n\n' +
        '1. `s >= 50`: `95 >= 50` is true, so `pass` is printed.\n' +
        '2. The whole `else` part is skipped, so the tests for 70 and 90 never run.\n\n' +
        'In fact any score of 50 or more prints `pass`. To fix this, test the highest boundary first.\n\n' +
        'Output: `pass`.',
      whyWrong: [
        null,
        'The test for 70 sits inside the `else`, which runs only if `s >= 50` is false.',
        'This is the band 95 seems to belong in, but the test for 90 is reached only if `s >= 50` is false.',
        'This is printed only when all three tests fail. `95 >= 50` is true.',
      ],
      keyIdea: 'With overlapping conditions, order matters: put the most restrictive test first.',
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
      solution:
        'Use the **indentation** and the `end if` lines to see which `else` belongs to which `if`.\n\n' +
        '1. Outer test `x > 10`: `12 > 10` is true, so go inside the first block. The outer `else` will be skipped.\n' +
        '2. Inner test `y > 10`: `5 > 10` is false, so the inner `else` runs and prints `Q`.\n' +
        '3. The outer `else` block is not entered, because the outer test was true.\n\n' +
        'Output: `Q`.',
      whyWrong: [
        'Once the outer `if x > 10` is true, its `else` block is skipped completely, so `R` cannot also be printed.',
        null,
        'This thinks that when the inner `if` fails, the outer `else` runs. It does not: the inner `if` has its own `else`, which prints `Q`.',
        'This forgets the inner `else`. The inner test is false, so its `else` branch runs and prints `Q`.',
      ],
      keyIdea: 'Each `else` belongs to the `if` it lines up with; once an outer branch is chosen, the other outer branch is skipped.',
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
      solution:
        '**De Morgan\'s law**: `not (A and B)` is the same as `(not A) or (not B)`. So negate each part **and** swap `and` for `or`.\n\n' +
        '1. Negate `x > 3`: the opposite of "greater than 3" is "less than or equal to 3", so `x <= 3`.\n' +
        '2. Negate `y <= 5`: the opposite of "at most 5" is "greater than 5", so `y > 5`.\n' +
        '3. Swap `and` for `or`: `x <= 3 or y > 5`.\n\n' +
        'Quick check with x = 4, y = 0: the original is `not (true and true)`, which is false, and `4 <= 3 or 0 > 5` is false. They agree.',
      whyWrong: [
        'This negates both comparisons but forgets to swap `and` for `or`. Try x = 0, y = 0: the original is true but this is false.',
        'This negates `x > 3` as `x < 3`, forgetting the equal case. The opposite of `x > 3` is `x <= 3`; with x = 3, y = 5 the original is true but this is false.',
        null,
        'This swaps `and` for `or` but does not negate the comparisons. Try x = 4, y = 0: the original is false but this is true.',
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
      solution:
        'Evaluate the condition for each value, working out the bracket as one unit.\n\n' +
        '| y | `mod(y,4) == 0` | `mod(y,100) != 0` | `mod(y,400) == 0` | bracket | whole condition |\n' +
        '|---|---|---|---|---|---|\n' +
        '| 1900 | true | false | false | false | false |\n' +
        '| 2000 | true | false | true | true | true |\n' +
        '| 2024 | true | true | false | true | true |\n' +
        '| 2023 | false | true | false | true | false |\n\n' +
        'The condition holds for 2000 and 2024.\n\nOutput: `2`.',
      whyWrong: [
        'This checks only `mod(y,4) == 0`. For 1900 the bracket is false, because 1900 is divisible by 100 but not by 400.',
        'This rejects 2000 because it is divisible by 100. But 2000 is divisible by 400, which makes the bracket true.',
        'This reads the `or` in the bracket as `and`. No number can be divisible by 400 and not by 100, so nothing would pass.',
        null,
      ],
      keyIdea: 'Work out a bracket first, then combine it with `and`; an `or` needs only one true part.',
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
      solution:
        'These are **two separate** `if` statements, so both are checked.\n\n' +
        '1. `8 > 5` is true, so `red` is printed.\n' +
        '2. `8 > 7` is true, so `blue` is printed and the `else` is skipped.\n\n' +
        'Output: `red` then `blue`.',
      whyWrong: [
        null,
        'This treats the second `if` as part of one chain with the first. Each `end if` closes its own statement, so the second test still runs.',
        'This skips the first `if`. It is checked too, and `8 > 5` is true.',
        'This runs the `else` of the second `if`, but `8 > 7` is true.',
      ],
      keyIdea: 'Separate `if` statements are all checked, so more than one can run.',
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
      solution:
        'The second test uses the **new** value of `x`.\n\n' +
        '1. `4 > 3` is true, so `x` becomes 2.\n' +
        '2. `2 > 3` is false, so the `else` runs and `x` becomes 3.\n\n' +
        'Output: `3`.',
      whyWrong: [
        null,
        'This uses the old `x` of 4 for the second test, then multiplies the new `x` of 2 by 10. Each test uses the value at that moment.',
        'This skips the first `if` and multiplies 4 by 10. `4 > 3` is true, so `x` has already become 2.',
        'This stops after the first `if`. The second statement is separate and still runs.',
      ],
      keyIdea: 'A test uses the current value of a variable, including changes made by earlier lines.',
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
      solution:
        '`and` is done before `or`, so the condition means `a or (b and c)`.\n\n' +
        '1. `b and c` is `false and false`, which is false.\n' +
        '2. `a or false` is `true or false`, which is true.\n\n' +
        'Output: `yes`.',
      whyWrong: [
        null,
        'This works left to right: `(a or b) and c` is false. But `and` is done before `or`.',
        'The condition only chooses the branch. The code then prints one of the two words.',
        'Combining Boolean values with `and` and `or` is allowed, so there is no error.',
      ],
      keyIdea: 'Order of logical operators: `not`, then `and`, then `or`.',
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
      solution:
        'Each pass halves an even `n` or replaces an odd `n` by $3n + 1$.\n\n' +
        '| n at start of pass | even? | new n | c |\n|---|---|---|---|\n| 5 | no | 16 | 1 |\n| 16 | yes | 8 | 2 |\n| 8 | yes | 4 | 3 |\n| 4 | yes | 2 | 4 |\n| 2 | yes | 1 | 5 |\n\n' +
        'Now `n` is 1, so the loop stops.\n\nOutput: `5`.',
      whyWrong: [
        null,
        'This stops when `n` reaches 2. The condition `n != 1` is still true there, so there is one more pass.',
        'This is the largest value of `n`. The code prints the counter `c`.',
        'The trace reaches $n = 1$ after 5 passes, so the loop stops.',
      ],
      keyIdea: 'For an `if` inside a loop, trace one row per pass and decide the branch from the current value.',
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
      solution:
        '1. `x` goes from 1 to 2 to 3, using the `else` branch.\n' +
        '2. When `x` is 3 the `if` branch runs. It prints `stop` but does not change `x`.\n' +
        '3. `3 < 5` is still true, so the same thing happens on every later pass.\n\n' +
        'Answer: Infinite loop.',
      whyWrong: [
        null,
        'This treats `print("stop")` as if it ended the loop. Printing a word does not stop anything; `break` would.',
        'The `else` branch raises `x` to 3, so the `if` branch does run and `stop` is printed.',
        'The code never prints `x`. It prints the word `stop`.',
      ],
      keyIdea: 'A loop ends only when its condition becomes false or `break` runs, so check that the variable keeps changing.',
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
      solution:
        '`m` holds the largest value seen so far.\n\n' +
        '| Line | test | m |\n|---|---|---|\n| `m = a` | | 7 |\n| `if b > m` | $12 > 7$ true | 12 |\n| `if c > m` | $9 > 12$ false | 12 |\n\n' +
        'Output: `12`.',
      whyWrong: [
        null,
        'This compares `c` with the original 7. By then `m` is 12, so `9 > m` is false.',
        'This is the starting value of `m`. The first test replaces it.',
        'This is the sum of the three values. `m` is replaced, never added to.',
      ],
      keyIdea: 'To find a maximum, keep the largest value so far and replace it only when something bigger appears.',
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
      solution:
        '**De Morgan\'s law**: `not (A or B)` is the same as `(not A) and (not B)`.\n\n' +
        '1. Negate `x < 2`: this gives `x >= 2`.\n' +
        '2. Negate `y == 7`: this gives `y != 7`.\n' +
        '3. Swap `or` for `and`: `x >= 2 and y != 7`.',
      whyWrong: [
        null,
        'This negates both parts but keeps `or`. Try x = 0, y = 0: the original is false but this is true.',
        'This negates `x < 2` as `x > 2`, missing the equal case. With x = 2, y = 0 the original is true but this is false.',
        'This swaps `or` for `and` without negating the parts. Try x = 3, y = 0: the original is true but this is false.',
      ],
      keyIdea: 'De Morgan: `not (A or B)` = `not A and not B`; the negation of `<` is `>=`.',
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
      solution:
        'A **Boolean variable** holds true or false. **Exclusive or** means one or the other, but not both.\n\n' +
        '| p | q | `p or q` | `not (p and q)` | both together |\n|---|---|---|---|---|\n| true | true | true | false | false |\n| true | false | true | true | true |\n| false | true | true | true | true |\n| false | false | false | true | false |\n\n' +
        'The last column is true exactly when one of them is true.',
      whyWrong: [
        null,
        'This is true only when both are true.',
        'This is also true when both are true, so it is not exclusive.',
        'This is true only when both are false.',
      ],
      keyIdea: 'Exclusive or is "at least one, but not both".',
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
      solution:
        'Python checks an `if / elif / else` chain from the top and runs only the first true branch.\n\n' +
        '1. `30 % 3` is 0, so `n % 3 == 0` is True.\n' +
        '2. `Fizz` is printed and the rest of the chain is skipped.\n\n' +
        'Output: `Fizz`.',
      whyWrong: [
        null,
        '`30 % 5 == 0` is True as well, but the chain stops at the first true branch, and that comes earlier.',
        '30 is a multiple of 15, but that test comes last, so it is never reached. It would have to be checked first.',
        'This is the `else` branch, which runs only if every condition is False.',
      ],
      keyIdea: 'In a chain, only the first true branch runs, so test the most specific condition first.',
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
      solution:
        'Work out each call on its own. `return` sends a value back and ends the function.\n\n' +
        '| Call | Branch | Returns |\n|---|---|---|\n| `sign(-4)` | `else` | -1 |\n| `sign(0)` | `elif` | 0 |\n| `sign(9)` | `if` | 1 |\n\n' +
        'The three returned values add up to 0.\n\nOutput: `0`.',
      whyWrong: [
        null,
        'This treats $-4$ as positive, so that its call returns 1. $-4 > 0$ is False.',
        'This treats 0 as positive, so that its call returns 1. `0 > 0` is False, so the `elif` runs.',
        'This uses only the first call. The last line adds all three.',
      ],
      keyIdea: 'Each function call runs one branch and returns one value; add the returned values afterwards.',
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
      solution:
        '| x | even? | x > 4? | condition | count |\n|---|---|---|---|---|\n| 1 | no | no | false | 0 |\n| 2 | yes | no | true | 1 |\n| 3 | no | no | false | 1 |\n| 4 | yes | no | true | 2 |\n| 5 | no | yes | true | 3 |\n| 6 | yes | yes | true | 4 |\n\n' +
        'Output: `4`.',
      whyWrong: [
        null,
        'This reads `or` as `and`. Only 6 is both even and above 4.',
        'This adds 3 even numbers to 2 values above 4, so 6 is counted twice. Each `x` adds at most 1.',
        'This checks only the even test and ignores `x > 4`, so it misses 5.',
      ],
      keyIdea: '`or` passes if at least one part is true, and each pass of the loop adds at most 1.',
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
