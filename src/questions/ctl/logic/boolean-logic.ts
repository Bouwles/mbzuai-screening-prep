import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- truth-table helpers for the answer checks
type B = boolean;
const BITS = [false, true];
const bit = (v: B) => (v ? '1' : '0');
/** Truth table of a 2-input function, rows (A, B) = 00, 01, 10, 11, as a string like "0110". */
const tt2 = (f: (a: B, b: B) => B): string => BITS.flatMap((a) => BITS.map((b) => bit(f(a, b)))).join('');
/** Truth table of a 3-input function, rows (A, B, C) = 000, 001, ..., 111. */
const tt3 = (f: (a: B, b: B, c: B) => B): string =>
  BITS.flatMap((a) => BITS.flatMap((b) => BITS.map((c) => bit(f(a, b, c))))).join('');
/** Number of rows (out of 8) where a 3-input function is true. */
const count3 = (f: (a: B, b: B, c: B) => B): number => tt3(f).split('').filter((x) => x === '1').length;
const xor = (a: B, b: B) => a !== b;
const nand = (a: B, b: B) => !(a && b);
const nor = (a: B, b: B) => !(a || b);

/** Truth table shown in question 007 (A, B, Q). */
const TABLE_007: number[][] = [
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
];

const NOTATION = '($\\land$ AND, $\\lor$ OR, $\\neg$ NOT, $\\oplus$ XOR.)';

export const questions: StaticQuestion[] = [
  // ======================================================================= FOUNDATION
  {
    id: 'boolean-logic-001',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: 'Which logic gate outputs 1 **only** when its two inputs are **different** from each other?',
    options: ['OR', 'NAND', 'XOR', 'NOR'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which gate gives 1 exactly when one input is 0 and the other is 1?',
      solution:
        'A **logic gate** takes inputs that are each 0 or 1, and gives one output: 0 or 1. We want a gate that gives 1 when the inputs differ, and 0 when they match.\n\n' +
        'Compare the four gates. We need 1 in the two middle rows and 0 in the top and bottom rows, and only the XOR column does that:\n\n| Inputs | OR | NAND | NOR | XOR |\n|---|---|---|---|---|\n| 0, 0 | 0 | 1 | 1 | 0 |\n| 0, 1 | 1 | 1 | 0 | 1 |\n| 1, 0 | 1 | 1 | 0 | 1 |\n| 1, 1 | 1 | 0 | 0 | 0 |',
      conclusion: 'Only one column has 1 for just the different-input rows, so the gate is XOR, short for "exclusive or".',
      whyWrong: [
        'OR also outputs 1 when **both** inputs are 1, where the inputs are the same, so it is not "only when different". Confusing OR with XOR is the classic mistake here.',
        'NAND outputs 1 whenever at least one input is 0, including when both inputs are 0 (the same), so it is not "only when different".',
        null,
        'NOR outputs 1 only when both inputs are 0, so it is 1 when the inputs are the same, which is the opposite situation to the one asked about.',
      ],
      keyIdea: 'Know the gates by their key rows. AND: 1 only if both are 1. OR: 1 if at least one is 1. XOR: 1 only if they differ. NAND and NOR flip AND and OR. To compare them, draw the four-row table.',
    },
    check: {
      optionValues: [tt2((a, b) => a || b), tt2(nand), tt2(xor), tt2(nor)],
      // "1 only when the inputs are different": exactly one of the two inputs is 1
      compute: () => tt2((a, b) => (a ? 1 : 0) + (b ? 1 : 0) === 1),
    },
  },
  {
    id: 'boolean-logic-002',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: 'A NAND gate has inputs $A$ and $B$. What are its outputs for the input pairs $(A, B) = (0, 0), (0, 1), (1, 0), (1, 1)$, in that order?',
    options: ['1, 1, 1, 0', '0, 0, 0, 1', '1, 0, 0, 0', '0, 1, 1, 0'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does a NAND gate output for each of the four input pairs?',
      solution:
        'NAND means **NOT AND**. Work out AND first, then flip the result, so 0 becomes 1 and 1 becomes 0.\n\n' +
        'AND gives 1 only when both inputs are 1. So for the four pairs in order, AND gives 0, 0, 0, 1.\n\n' +
        'Now flip each one. The last column reads 1, 1, 1, 0 from top to bottom:\n\n| $A$ | $B$ | $A$ AND $B$ | NAND (flipped) |\n|---|---|---|---|\n| 0 | 0 | 0 | 1 |\n| 0 | 1 | 0 | 1 |\n| 1 | 0 | 0 | 1 |\n| 1 | 1 | 1 | 0 |',
      conclusion: 'Flipping the AND outputs gives the NAND outputs, which in order are 1, 1, 1, 0.',
      whyWrong: [
        null,
        'This is the AND column: you forgot the NOT part of NAND, which flips every output.',
        'This is the NOR column (NOT OR), which is 1 only when both inputs are 0. NAND is NOT AND.',
        'This is the XOR column. NAND is also 1 when both inputs are 0, because $0 \\land 0 = 0$ and NOT 0 is 1.',
      ],
      keyIdea: 'For NAND or NOR, write the AND or OR column first, then flip every value. A quick test: NAND is 0 in only one row, where both inputs are 1. NOR is 1 in only one row, where both inputs are 0.',
    },
    check: {
      optionValues: ['1110', '0001', '1000', '0110'],
      compute: () => tt2(nand),
    },
  },
  {
    id: 'boolean-logic-003',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: `Given $A = 1$, $B = 0$ and $C = 0$, which expression evaluates to 1 (TRUE)? ${NOTATION}`,
    options: ['$A \\land B$', '$A \\land (B \\lor \\neg C)$', '$\\neg A \\lor C$', '$(A \\lor B) \\land C$'],
    correctIndex: 1,
    markScheme: {
      asking: 'With $A = 1$, $B = 0$ and $C = 0$, which expression works out to 1?',
      solution:
        'Here is what the symbols do. $\\land$ (AND) is 1 only if both sides are 1. $\\lor$ (OR) is 1 if at least one side is 1. $\\neg$ (NOT) flips a value, so $\\neg C$ is 1 here because $C = 0$.\n\n' +
        'Put the values into three of the expressions, working out brackets first:\n\n| Expression | With the values | Result |\n|---|---|---|\n| $A \\land B$ | $1 \\land 0$ | 0 |\n| $\\neg A \\lor C$ | $0 \\lor 0$ | 0 |\n| $(A \\lor B) \\land C$ | $(1 \\lor 0) \\land 0 = 1 \\land 0$ | 0 |\n\n' +
        'Now the last one, $A \\land (B \\lor \\neg C)$. The bracket is $0 \\lor 1 = 1$, and then $1 \\land 1 = 1$.',
      conclusion: 'Only this expression reaches 1 with these values: $A \\land (B \\lor \\neg C)$.',
      whyWrong: [
        'AND needs **both** inputs to be 1, and $B = 0$, so $A \\land B = 0$.',
        null,
        'You would pick this if you forgot the NOT and used $A$ instead of $\\neg A$. Since $A = 1$, $\\neg A = 0$, and $0 \\lor 0 = 0$.',
        'The bracket is 1, but it is then ANDed with $C = 0$, giving 0. Choosing it means treating the final $\\land$ as $\\lor$.',
      ],
      keyIdea: 'Substitute the values and work from the inside out: NOTs first, then brackets, then the outer gate. Do every expression in a small table. An AND needs both sides to be 1, so any side equal to 0 rules it out quickly.',
    },
    check: {
      // value of each option at A = 1, B = 0, C = 0; the stem asks for the option that is TRUE
      optionValues: (() => {
        const [a, b, c] = [true, false, false];
        return [a && b, a && (b || !c), !a || c, (a || b) && c].map((v) => (v ? 1 : 0));
      })(),
      compute: () => 1,
    },
  },
  {
    id: 'boolean-logic-004',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: 'The truth table for $A \\lor B \\lor C$ has 8 rows (one for each combination of $A$, $B$, $C$). In how many rows is the output 1?',
    options: ['1', '3', '8', '7'],
    correctIndex: 3,
    markScheme: {
      asking: 'In how many of the 8 rows does $A \\lor B \\lor C$ give 1?',
      solution:
        '$\\lor$ means OR, which gives 1 if **at least one** input is 1. With three inputs, the output is 1 if any of $A$, $B$ or $C$ is 1.\n\n' +
        'So the output is 0 only when no input is 1. That happens in just one row: $A = B = C = 0$.\n\n' +
        'All the other rows give 1, and there are $8 - 1 = 7$ of them.',
      conclusion: 'One row out of 8 gives 0, so the output is 1 in 7 rows.',
      whyWrong: [
        'Only one row (all inputs 1) gives 1 for $A \\land B \\land C$. That is AND, not OR.',
        'This counts only the rows with **exactly one** input equal to 1. OR is also 1 when two or three inputs are 1.',
        'This forgets the row $A = B = C = 0$, where OR gives 0.',
        null,
      ],
      keyIdea: 'For a big OR, count the rows that give 0: only the all-zeros row does. For a big AND, count the rows that give 1: only the all-ones row does. With $n$ inputs there are $2^n$ rows.',
    },
    check: {
      optionValues: [1, 3, 8, 7],
      compute: () => count3((a, b, c) => a || b || c),
    },
  },
  {
    id: 'boolean-logic-005',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: `Which expression is logically equivalent to $\\neg(A \\land B)$? ${NOTATION}`,
    options: ['$\\neg A \\lor \\neg B$', '$\\neg A \\land \\neg B$', '$A \\lor B$', '$\\neg A \\lor B$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which expression always gives the same result as $\\neg(A \\land B)$?',
      solution:
        '$\\neg(A \\land B)$ means: AND the two inputs, then flip the result. AND is 1 only when both inputs are 1. So this expression is 0 when both are 1, and 1 in every other row.\n\n' +
        'Put that into words: it is 1 when at least one input is 0. Saying "$A$ is 0" is the same as saying "$\\neg A$ is 1".\n\n' +
        '"At least one" is OR. So the expression is 1 when $\\neg A$ is 1 or $\\neg B$ is 1, which is $\\neg A \\lor \\neg B$.',
      conclusion: 'Both are 0 only when $A$ and $B$ are both 1, so the equivalent expression is $\\neg A \\lor \\neg B$.',
      whyWrong: [
        null,
        'This negates both letters but forgets to change AND into OR. In fact $\\neg A \\land \\neg B$ equals $\\neg(A \\lor B)$ (NOR), which is 0 when $A = 1, B = 0$, but $\\neg(A \\land B)$ is 1 there.',
        'This swaps AND for OR but forgets to negate each letter. It gives 1 when $A = B = 1$, where $\\neg(A \\land B) = 0$.',
        'This negates only $A$. The NOT must go onto **every** part inside the bracket.',
      ],
      keyIdea: 'De Morgan\'s law: to move a NOT inside a bracket, flip every letter and swap AND with OR. So $\\neg(A \\land B) = \\neg A \\lor \\neg B$, and $\\neg(A \\lor B) = \\neg A \\land \\neg B$. Test any doubtful option on one row.',
    },
    check: {
      optionValues: [tt2((a, b) => !a || !b), tt2((a, b) => !a && !b), tt2((a, b) => a || b), tt2((a, b) => !a || b)],
      compute: () => tt2((a, b) => !(a && b)),
    },
  },

  // ======================================================================= EXAM
  {
    id: 'boolean-logic-006',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'Inputs $A$ and $B$ enter an AND gate; its output and $C$ enter an OR gate, followed by a NOT gate giving $Q$. For how many of the 8 input combinations is $Q = 1$?',
    options: ['5', '7', '3', '1'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many of the 8 input combinations make $Q$ equal 1?',
      solution:
        'Write the circuit as a formula, using $\\land$ for AND, $\\lor$ for OR and $\\neg$ for NOT. The AND gives $A \\land B$. The OR combines that with $C$. The NOT flips the result. So $Q = \\neg((A \\land B) \\lor C)$.\n\n' +
        'Because the NOT is last, $Q = 1$ exactly when the OR gate\'s output is 0.\n\n' +
        'An OR gives 0 only when both of its inputs are 0. So we need $C = 0$ and $A \\land B = 0$.\n\n' +
        '$A \\land B = 0$ means $A$ and $B$ are not both 1. That leaves the pairs $(0, 0)$, $(0, 1)$ and $(1, 0)$. Each one goes with $C = 0$, so there are 3 combinations.',
      conclusion: 'Only the pairs of $A$ and $B$ that are not both 1, with $C = 0$, make $Q = 1$, so the count is 3.',
      whyWrong: [
        'This is the number of rows where the OR gate outputs 1. You forgot the final NOT gate, which flips every output.',
        'This is what you get if you read the second gate as AND: $\\neg(A \\land B \\land C)$ is 1 in 7 rows.',
        null,
        'This is what you get if you read the first gate as OR: $\\neg(A \\lor B \\lor C)$ is 1 only when all inputs are 0.',
      ],
      keyIdea: 'Work backwards from the output. A final NOT needs the gate before it to give the opposite value. An OR gives 0 only if all its inputs are 0, and an AND gives 1 only if all its inputs are 1. Then count the input rows that meet those demands.',
    },
    check: {
      optionValues: [5, 7, 3, 1],
      compute: () => count3((a, b, c) => !((a && b) || c)),
    },
  },
  {
    id: 'boolean-logic-007',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: `Which expression gives the output $Q$ in this truth table? ${NOTATION}`,
    table: {
      headers: ['A', 'B', 'Q'],
      rows: TABLE_007,
    },
    options: ['$\\neg A \\lor B$', '$A \\lor \\neg B$', '$\\neg(A \\oplus B)$', '$A \\land \\neg B$'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which expression gives the $Q$ column in the table?',
      solution:
        'Look for the unusual row. $Q$ is 1 in three rows and 0 in just one: $A = 0$, $B = 1$.\n\n' +
        'So we want an expression that is 0 in only that row. An OR ($\\lor$) is 0 in just one case, when both of its sides are 0. So look for an OR.\n\n' +
        'Both sides must be 0 when $A = 0$ and $B = 1$. $A$ is 0 there. $\\neg B$ (NOT $B$, the flip of $B$) is also 0 there. Join them with OR and test all four rows:\n\n| $A$ | $B$ | $\\neg B$ | $A \\lor \\neg B$ | $Q$ |\n|---|---|---|---|---|\n| 0 | 0 | 1 | 1 | 1 |\n| 0 | 1 | 0 | 0 | 0 |\n| 1 | 0 | 1 | 1 | 1 |\n| 1 | 1 | 0 | 1 | 1 |',
      conclusion: 'It matches $Q$ in all four rows, so the expression is $A \\lor \\neg B$.',
      whyWrong: [
        'This mixes up the two variables: $\\neg A \\lor B$ is 0 only when $A = 1, B = 0$, but the table has its 0 at $A = 0, B = 1$.',
        null,
        'This is XNOR, which is 1 only when the inputs are equal. It gives 0 for $A = 1, B = 0$, but the table has $Q = 1$ there.',
        'This is 1 in only one row ($A = 1, B = 0$). It describes where a single 1 is, but this table has three 1s and a single 0.',
      ],
      keyIdea: 'Count the 1s in the output. A single 0 points to an OR: make each side 0 in that row, using the letter if it is 0 there and its NOT if it is 1. A single 1 points to an AND. Test all the rows.',
    },
    check: {
      optionValues: [tt2((a, b) => !a || b), tt2((a, b) => a || !b), tt2((a, b) => !xor(a, b)), tt2((a, b) => a && !b)],
      compute: () => TABLE_007.map((r) => String(r[2])).join(''),
    },
  },
  {
    id: 'boolean-logic-008',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: `Simplify $(A \\land B) \\lor (A \\land \\neg B)$. ${NOTATION}`,
    options: ['$B$', '$A \\land B$', '$1$ (always true)', '$A$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What simpler expression always gives the same result?',
      solution:
        '$\\land$ means AND, $\\lor$ means OR, and $\\neg B$ means NOT $B$. Both brackets contain $A$, so try each value of $A$.\n\n' +
        'Try $A = 0$. Both brackets are 0, because AND with a 0 is always 0. The whole expression is $0 \\lor 0 = 0$.\n\n' +
        'Try $A = 1$. The brackets become $B$ and $\\neg B$. One of those is always 1, because $B$ is either 1 or 0. So the whole expression is 1.\n\n' +
        'So the output is 0 when $A = 0$ and 1 when $A = 1$, whatever $B$ is. The whole expression always equals $A$, and $B$ makes no difference.',
      conclusion: 'The output copies $A$ in every case, so the simplified form is $A$.',
      whyWrong: [
        'This factors out the wrong variable. $A$ is the variable common to both brackets; $B$ appears as $B$ in one and $\\neg B$ in the other, so it cancels out.',
        'This keeps only the first bracket. The second bracket adds the row $A = 1, B = 0$, so the expression is true whenever $A = 1$.',
        '$B \\lor \\neg B = 1$ is correct, but you forgot it is still ANDed with $A$: $A \\land 1 = A$, not 1.',
        null,
      ],
      keyIdea: 'If a letter appears in both brackets, factor it out: $(A \\land B) \\lor (A \\land \\neg B) = A \\land (B \\lor \\neg B)$. Since $B \\lor \\neg B$ is always 1, this is $A$. Or try each value of the shared letter.',
    },
    check: {
      optionValues: [tt2((_a, b) => b), tt2((a, b) => a && b), tt2(() => true), tt2((a) => a)],
      compute: () => tt2((a, b) => (a && b) || (a && !b)),
    },
  },
  {
    id: 'boolean-logic-009',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'Which condition is equivalent to `not (x > 3 and y < 5)` for all integers `x` and `y`?',
    options: ['`x <= 3 or y >= 5`', '`x <= 3 and y >= 5`', '`x < 3 or y > 5`', '`x > 3 or y < 5`'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which condition is true exactly when `x > 3 and y < 5` is false?',
      solution:
        '`not (...)` flips the bracket. So we want a condition that is true when the bracket is false.\n\n' +
        'An `and` is false when at least one side is false. So we need `x > 3` to be false, **or** `y < 5` to be false. The `and` has become `or`.\n\n' +
        'The opposite of `x > 3` is `x <= 3`: if `x` is not greater than 3, it is 3 or less. The opposite of `y < 5` is `y >= 5`.\n\n' +
        'Join them with `or`, which gives `x <= 3 or y >= 5`. Test with `x = 3, y = 0`: `x > 3` is false, so the bracket is false and the original is true. In the new version `x <= 3` is true, so it is true as well.',
      conclusion: 'Flipping each comparison and swapping `and` for `or` gives `x <= 3 or y >= 5`.',
      whyWrong: [
        null,
        'This negates both comparisons but forgets that De Morgan also turns `and` into `or`. With `x = 3, y = 0` the original is true but this is false.',
        'The opposite of `x > 3` is `x <= 3`, not `x < 3`: the value `x = 3` gets lost (and similarly `y = 5`). With `x = 3, y = 0` the original is true but this is false.',
        'This changes `and` into `or` but does not negate the two comparisons. With `x = 4, y = 0` the original is false but this is true.',
      ],
      keyIdea: 'De Morgan\'s law for code: `not (a and b)` becomes `not a or not b`, and `not (a or b)` becomes `not a and not b`. Then flip each comparison: `>` becomes `<=`, and `<` becomes `>=`. Test with a boundary value such as `x = 3`.',
    },
    check: {
      optionValues: (() => {
        const grid = (f: (x: number, y: number) => boolean) => {
          let s = '';
          for (let x = 0; x <= 8; x++) for (let y = 0; y <= 8; y++) s += f(x, y) ? '1' : '0';
          return s;
        };
        return [grid((x, y) => x <= 3 || y >= 5), grid((x, y) => x <= 3 && y >= 5), grid((x, y) => x < 3 || y > 5), grid((x, y) => x > 3 || y < 5)];
      })(),
      compute: () => {
        let s = '';
        for (let x = 0; x <= 8; x++) for (let y = 0; y <= 8; y++) s += !(x > 3 && y < 5) ? '1' : '0';
        return s;
      },
    },
  },
  {
    id: 'boolean-logic-010',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'Here `and` and `or` stop as soon as the result is known. What is printed, in order?',
    code: {
      lang: 'pseudocode',
      source: `function check(n)
   print(n)
   return n > 2
end function
if check(1) and check(5)
   print("A")
end if
if check(3) or check(0)
   print("B")
end if`,
    },
    options: ['`1 5 3 0 B`', '`1 5 3 B`', '`1 3 B`', '`1 3 0 B`'],
    correctIndex: 2,
    markScheme: {
      asking: 'Which values does this code print, and in what order?',
      solution:
        'Lines 1 to 4 define `check(n)`. Each call first prints `n`, then returns true if `n > 2` and false otherwise. So anything printed shows us which calls really ran.\n\n' +
        'Line 5 runs `check(1)`. It prints 1 and returns false, because 1 is not above 2.\n\n' +
        'An `and` is true only if both sides are true. The left side is false, so the result is already known and `check(5)` is never called. The `if` is false, so line 6 does not run.\n\n' +
        'Line 8 runs `check(3)`. It prints 3 and returns true, because 3 is above 2.\n\n' +
        'An `or` needs just one true side. The left side is true, so `check(0)` is never called. The `if` is true, so line 9 prints B. The printed values, in order, are 1, 3, B.',
      conclusion: 'Only `check(1)` and `check(3)` ran, then the second `if` printed B, so the output is `1 3 B`.',
      whyWrong: [
        'This assumes both sides of `and` and `or` are always evaluated. The stem says evaluation stops as soon as the result is known, so `check(5)` and `check(0)` never run.',
        'This short-circuits the `or` correctly but not the `and`: once `check(1)` returns false, the `and` is already false, so `check(5)` is never called.',
        null,
        'This short-circuits the `and` correctly but not the `or`: once `check(3)` returns true, the `or` is already true, so `check(0)` is never called.',
      ],
      keyIdea: 'This is called short-circuit evaluation. Work left to right: `and` stops at the first false, and `or` stops at the first true. For each call that runs, write down what it prints before using its return value.',
    },
    check: {
      optionValues: ['1 5 3 0 B', '1 5 3 B', '1 3 B', '1 3 0 B'],
      compute: () => {
        const out: (number | string)[] = [];
        const check = (n: number) => {
          out.push(n);
          return n > 2;
        };
        if (check(1) && check(5)) out.push('A');
        if (check(3) || check(0)) out.push('B');
        return out.join(' ');
      },
    },
  },
  {
    id: 'boolean-logic-012',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: `Let $X = A \\text{ NAND } B$. A second NAND gate has $X$ connected to **both** of its inputs. Which expression gives the output of the second gate? ${NOTATION}`,
    options: ['$\\neg(A \\land B)$', '$A \\lor B$', '$1$ (always true)', '$A \\land B$'],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the second gate\'s output, written using $A$ and $B$?',
      solution:
        'NAND means NOT AND: AND the two inputs, then flip the result. So $X = \\neg(A \\land B)$.\n\n' +
        'The second gate receives $X$ on both inputs. Work out $X$ NAND $X$ for each value of $X$:\n\n| $X$ | $X \\land X$ | Flipped: $X$ NAND $X$ |\n|---|---|---|\n| 0 | 0 | 1 |\n| 1 | 1 | 0 |\n\n' +
        'The output is always the opposite of $X$. So a NAND with both inputs joined acts as a NOT gate, and its output is $\\neg X$.\n\n' +
        'Substitute $X$: $\\neg X = \\neg\\neg(A \\land B)$. Two NOTs cancel, because flipping twice returns the original value. That leaves $A \\land B$.',
      conclusion: 'The second gate undoes the flip made by the first, so the output is $A \\land B$.',
      whyWrong: [
        'This is $X$ itself: you forgot that the second NAND gate inverts again ($X \\text{ NAND } X = \\neg X$).',
        'That is the output of $(A \\text{ NAND } A) \\text{ NAND } (B \\text{ NAND } B)$, where each input first gets its own NAND gate. Here both inputs of the second gate are the same signal $X$.',
        'This assumes a NAND gate with identical inputs always outputs 1. It does when $X = 0$, but when $X = 1$, $\\neg(1 \\land 1) = 0$.',
        null,
      ],
      keyIdea: 'Joining both inputs of a NAND makes a NOT: $X$ NAND $X = \\neg X$. So a NAND followed by this NOT gives an AND. Simplify step by step from the first gate, and cancel any pair of NOTs.',
    },
    check: {
      optionValues: [tt2((a, b) => !(a && b)), tt2((a, b) => a || b), tt2(() => true), tt2((a, b) => a && b)],
      compute: () =>
        tt2((a, b) => {
          const x = nand(a, b);
          return nand(x, x);
        }),
    },
  },
  {
    id: 'boolean-logic-013',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: `Which expression is logically equivalent to $A \\oplus B$ (XOR)? ${NOTATION}`,
    options: [
      '$(A \\land \\neg B) \\lor (\\neg A \\land B)$',
      '$(A \\land B) \\lor (\\neg A \\land \\neg B)$',
      '$(A \\lor B) \\land (A \\land B)$',
      '$(A \\lor B) \\lor \\neg(A \\land B)$',
    ],
    correctIndex: 0,
    markScheme: {
      asking: 'Which expression gives 1 exactly when $A$ and $B$ are different?',
      solution:
        'XOR ($\\oplus$) gives 1 when the inputs are different. There are only two ways to be different: $A$ is 1 and $B$ is 0, or $A$ is 0 and $B$ is 1.\n\n' +
        'Write each way using AND ($\\land$). "$A$ is 1 and $B$ is 0" is $A \\land \\neg B$, because $\\neg B$ is 1 when $B$ is 0. "$A$ is 0 and $B$ is 1" is $\\neg A \\land B$.\n\n' +
        'Either way is enough, so join them with OR ($\\lor$): $(A \\land \\neg B) \\lor (\\neg A \\land B)$. Test it on $A = B = 1$: the brackets are $1 \\land 0 = 0$ and $0 \\land 1 = 0$, so the output is 0, as XOR needs.',
      conclusion: 'It lists the two ways of being different, so XOR is equivalent to $(A \\land \\neg B) \\lor (\\neg A \\land B)$.',
      whyWrong: [
        null,
        'This is 1 when the inputs are the **same** (XNOR), the exact opposite of XOR.',
        'XOR is "OR but not both": $(A \\lor B) \\land \\neg(A \\land B)$. Forgetting the NOT gives this, which simplifies to $A \\land B$.',
        'Joining the two parts with OR instead of AND makes the expression 1 in every row (for example $A = B = 1$ gives 1, but XOR gives 0).',
      ],
      keyIdea: 'To turn a table into an expression, write one AND bracket for each row with output 1, using the letter if it is 1 and its NOT if it is 0. Join the brackets with OR. Test one row on each option.',
    },
    check: {
      optionValues: [
        tt2((a, b) => (a && !b) || (!a && b)),
        tt2((a, b) => (a && b) || (!a && !b)),
        tt2((a, b) => (a || b) && a && b),
        tt2((a, b) => a || b || !(a && b)),
      ],
      compute: () => tt2(xor),
    },
  },
  {
    id: 'boolean-logic-014',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'Here `not` is done first, then `and`, then `or`. What is printed, in order?',
    code: {
      lang: 'pseudocode',
      source: 'a = true\nb = false\nc = false\nprint(a or b and c)\nprint((a or b) and c)\nprint(not b and c)',
    },
    options: ['`false false false`', '`true false true`', '`true false false`', '`false false true`'],
    correctIndex: 2,
    markScheme: {
      asking: 'What do the three `print` lines output?',
      solution:
        'Order of work matters here, just as multiplying comes before adding. The stem says `not` goes first, then `and`, then `or`, and brackets always go before all of them. We have `a` = true, `b` = false and `c` = false.\n\n' +
        'Line 4: `a or b and c`. The `and` goes first: `b and c` is false and false, which is false. Then `a or false` is true or false, which is **true**.\n\n' +
        'Line 5: `(a or b) and c`. The bracket goes first: true or false is true. Then true and `c` is true and false, which is **false**.\n\n' +
        'Line 6: `not b and c`. The `not` goes first and applies only to `b`, so `not b` is true. Then true and `c` is true and false, which is **false**.',
      conclusion: 'In order, the lines give true, false and false, so the output is `true false false`.',
      whyWrong: [
        'This evaluates `a or b and c` left to right as `(a or b) and c`. Because `and` is done before `or`, it is `a or (b and c)`, which is true.',
        'This treats `not b and c` as `not (b and c)`. `not` is done first, so it applies only to `b`: `(not b) and c` is false.',
        null,
        'This makes both precedence mistakes: reading the first expression left to right and applying `not` to the whole of `b and c`.',
      ],
      keyIdea: 'Add the missing brackets in order of priority: `not` grabs the next value, then `and` joins its neighbours, and `or` goes last. So `a or b and c` means `a or (b and c)`. Then work from the inside out.',
    },
    check: {
      optionValues: ['false false false', 'true false true', 'true false false', 'false false true'],
      compute: () => {
        const [a, b, c] = [true, false, false];
        return [a || (b && c), (a || b) && c, !b && c].join(' ');
      },
    },
  },
  {
    id: 'boolean-logic-015',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'Here `and` and `or` stop as soon as the result is known, and dividing by 0 is an error. What happens when this runs?',
    code: {
      lang: 'pseudocode',
      source: 'x = 0\nprint(x != 0 and 10 / x > 1)\nprint(x == 0 or 10 / x > 1)\nprint(10 / x > 1 and x != 0)',
    },
    options: ['An error at the first `print`', 'Prints `false`, `true`, then an error', 'Prints `false`, `true`, `false`', 'Prints `false`, then an error'],
    correctIndex: 1,
    markScheme: {
      asking: 'Which lines print, and does any line crash because of dividing by 0?',
      solution:
        '`x` is 0, so `10 / x` would be an error. The only question is whether each line ever reaches `10 / x`. Each expression runs left to right and stops as soon as the result is known.\n\n' +
        'Line 2: `x != 0` means "`x` is not 0", and that is false. An `and` with a false left side is already false, so `10 / x` is skipped. It prints `false`.\n\n' +
        'Line 3: `x == 0` means "`x` equals 0", and that is true. An `or` with a true left side is already true, so `10 / x` is skipped. It prints `true`.\n\n' +
        'Line 4: now `10 / x` comes first, so it has to run. Dividing 10 by 0 is an error, and it happens before anything is printed on this line.',
      conclusion: 'The first two lines skip the division and the last one cannot, so the result is: Prints `false`, `true`, then an error.',
      whyWrong: [
        'This ignores short-circuiting: `x != 0` is false, so `10 / x` is never evaluated on that line.',
        null,
        'This assumes `x != 0` is checked first wherever it is written. `and` evaluates left to right, so on the last line `10 / x` runs first.',
        'This assumes `or` always evaluates both sides. `x == 0` is true, so the `or` is already true and `10 / x` is skipped.',
      ],
      keyIdea: 'For each `and` or `or`, work out the left side first. `and` stops on false, and `or` stops on true. Anything dangerous on the right side is then safe, but the same test written after the danger gives no protection.',
    },
    check: {
      optionValues: ['err1', 'ok-ok-err', 'all', 'ok-err'],
      compute: () => {
        const x = 0 as number;
        const div = () => {
          if (x === 0) throw new Error('division by zero');
          return 10 / x;
        };
        const out: boolean[] = [];
        try {
          out.push(x !== 0 && div() > 1);
          out.push(x === 0 || div() > 1);
          out.push(div() > 1 && x !== 0);
        } catch {
          return ['err1', 'ok-err', 'ok-ok-err'][out.length];
        }
        return 'all';
      },
    },
  },
  {
    id: 'boolean-logic-021',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: 'How many rows does the truth table of an expression with $4$ inputs have?',
    options: ['$4$', '$8$', '$16$', '$24$'],
    correctIndex: 2,
    markScheme: {
      asking: 'How many rows do we need to list every combination of 4 inputs?',
      solution:
        'A truth table has one row for each possible combination of input values. Each input can be 0 or 1, which is two choices.\n\n' +
        'Each new input doubles the number of rows. One input gives 2 rows, two inputs give 4, and three inputs give 8.\n\n' +
        'Four inputs give $2 \\times 2 \\times 2 \\times 2 = 2^4 = 16$.',
      conclusion: 'Four inputs with two choices each give $2^4$ rows, which is $16$.',
      whyWrong: [
        'This gives one row per input. A truth table needs one row per **combination** of inputs.',
        'This is $2 \\times 4$. The number of rows doubles for each input, so it is $2^4$, not $2 \\times 4$.',
        null,
        'This is $4!$, the number of ways to order 4 things. The rows are combinations of 0s and 1s.',
      ],
      keyIdea: 'Number of rows $= 2^n$, where $n$ is the number of inputs. Each input has 2 values, and each new input doubles the rows. For example, 3 inputs give $2^3 = 8$ rows.',
    },
    check: { optionValues: [4, 8, 16, 24], compute: () => 2 ** 4 },
  },
  {
    id: 'boolean-logic-022',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: 'An AND gate outputs 1 when:',
    options: ['both inputs are 1', 'at least one input is 1', 'the inputs are different', 'both inputs are 0'],
    correctIndex: 0,
    markScheme: {
      asking: 'When does an AND gate give 1?',
      solution:
        'A gate takes inputs of 0 or 1 and gives one output. Think of 1 as true. In everyday words, "I need a ticket **and** an ID" means having just one of them is not enough.\n\n' +
        'AND works the same way. A 0 on either input makes the output 0. So the output is 1 only when both inputs are 1.',
      conclusion: 'AND needs everything to be 1, so it outputs 1 when both inputs are 1.',
      whyWrong: [
        null,
        'This describes OR, which is also 1 when only one input is 1.',
        'This describes XOR.',
        'This describes NOR. An AND gate gives 0 when both inputs are 0.',
      ],
      keyIdea: 'Use an everyday sentence to tell gates apart. AND: "I need both". OR: "at least one will do". XOR: "one or the other, not both". NOT: "the opposite". Then read the gate\'s output from the sentence.',
    },
    check: {
      optionValues: [tt2((a, b) => a && b), tt2((a, b) => a || b), tt2(xor), tt2(nor)],
      compute: () => tt2((a, b) => (a ? 1 : 0) + (b ? 1 : 0) === 2),
    },
  },
  {
    id: 'boolean-logic-023',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: 'Which gate has a single input and flips it?',
    options: ['NOT', 'AND', 'OR', 'XOR'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which gate takes one input and outputs its opposite?',
      solution:
        'AND, OR and XOR all compare two values, so each of them needs two inputs.\n\n' +
        'The gate with one input just flips it: 0 becomes 1, and 1 becomes 0. That gate is called NOT.',
      conclusion: 'It needs only one input and gives the opposite value, so the gate is NOT.',
      whyWrong: [
        null,
        'AND has two inputs and outputs 1 only when both are 1.',
        'OR has two inputs and outputs 1 when at least one is 1.',
        'XOR has two inputs and outputs 1 when they are different.',
      ],
      keyIdea: 'Sort gates by their inputs. NOT has one input and flips it. AND, OR, XOR, NAND and NOR have two inputs, and you tell them apart by what they do with those two inputs.',
    },
  },
  {
    id: 'boolean-logic-024',
    subtopic: 'boolean-logic',
    difficulty: 'foundation',
    stem: 'What is $1 \\oplus 1$? ($\\oplus$ is XOR.)',
    options: ['$0$', '$1$', '$2$', '$11$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does an XOR gate output when both inputs are 1?',
      solution:
        '$\\oplus$ is XOR, short for "exclusive or". It gives 1 only when its two inputs are **different**.\n\n' +
        'Here both inputs are 1, so they are the same. So the output is 0.',
      conclusion: 'The inputs match, so $1 \\oplus 1$ gives $0$.',
      whyWrong: [
        null,
        'This is $1 \\lor 1$. OR is 1 when both inputs are 1, but XOR is not.',
        'This is ordinary addition. Boolean outputs can only be 0 or 1.',
        'This writes the two inputs side by side. A gate outputs a single value, 0 or 1.',
      ],
      keyIdea: 'For XOR, just ask: are the two inputs different? Different gives 1, and the same gives 0. So $0 \\oplus 1 = 1$ and $1 \\oplus 1 = 0$. Outputs are always a single 0 or 1.',
    },
    check: { optionValues: [0, 1, 2, 11], compute: () => (xor(true, true) ? 1 : 0) },
  },
  {
    id: 'boolean-logic-025',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'What does this code print?',
    code: {
      lang: 'pseudocode',
      source: 'c = 0\nfor i = 1 to 10\n   if mod(i,2) == 0 and mod(i,3) != 0 // mod is the modulus operator\n      c = c + 1\n   end if\nend for\nprint(c)',
    },
    options: ['`5`', '`4`', '`1`', '`8`'],
    correctIndex: 1,
    markScheme: {
      asking: 'How many numbers from 1 to 10 are even but not multiples of 3?',
      solution:
        '`mod(i,2)` means the remainder when `i` is divided by 2. For example, $7 \\div 2$ is 3 remainder 1, so `mod(7,2)` is 1.\n\n' +
        '`mod(i,2) == 0` is true when `i` divides by 2 with nothing left over, so `i` is even. `mod(i,3) != 0` (`!=` means "not equal") is true when `i` is not a multiple of 3.\n\n' +
        'Line 3 uses `and`, so line 4 adds to `c` only if both parts are true. Odd numbers fail the first part, so test only the even numbers:\n\n| `i` | `mod(i,2) == 0` | `mod(i,3) != 0` | Counted? |\n|---|---|---|---|\n| 2 | true | true | Yes |\n| 4 | true | true | Yes |\n| 6 | true | false | No |\n| 8 | true | true | Yes |\n| 10 | true | true | Yes |\n\n' +
        'Four numbers pass both tests, so `c` goes up 4 times, starting from 0. It ends at 4, and line 7 prints it.',
      conclusion: 'The numbers 2, 4, 8 and 10 are counted, so the code prints `4`.',
      whyWrong: [
        'This counts all the even numbers and ignores the second part of the `and`, which rules out 6.',
        null,
        'This reads `mod(i,3) != 0` as `mod(i,3) == 0`, which leaves only 6.',
        'This reads `and` as `or`: every number from 1 to 10 except 3 and 9 would then be counted.',
      ],
      keyIdea: 'For a counting loop with `and`, list only the values that pass the first condition, then test the second on them. With `or`, count values passing either one. Read `mod(i,k) == 0` as "`i` is a multiple of `k`".',
    },
    check: {
      optionValues: ['5', '4', '1', '8'],
      compute: () => {
        let c = 0;
        for (let i = 1; i <= 10; i++) if (i % 2 === 0 && i % 3 !== 0) c++;
        return String(c);
      },
    },
  },
  {
    id: 'boolean-logic-026',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'What does this code print?',
    code: {
      lang: 'pseudocode',
      source: 'x = 1\nwhile (x != 10 and x < 20)\n   x = x + 2\nend while\nprint(x)',
    },
    options: ['`10`', '`19`', '`21`', 'Infinite loop'],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the value of `x` when the loop stops?',
      solution:
        'A `while` loop repeats while its condition is true. With `and`, both parts must be true to keep going, so the loop stops as soon as either part is false.\n\n' +
        '`x` starts at 1 and line 3 adds 2 on each pass, so `x` takes the values 1, 3, 5, 7 and so on. It is always odd, so it never equals 10. So `x != 10` ("`x` is not 10") is always true.\n\n' +
        'So the only thing that can stop the loop is `x < 20` becoming false. Look at the last few tests:\n\n| `x` at the test | `x != 10` | `x < 20` | Loop continues? |\n|---|---|---|---|\n| 17 | true | true | Yes |\n| 19 | true | true | Yes |\n\n' +
        'At 19 the test passes, so line 3 runs once more and makes `x` equal to 21. Now `x < 20` is false, so the loop stops and line 5 prints 21.',
      conclusion: 'The loop stops the first time `x < 20` fails, which happens at 21, so the code prints `21`.',
      whyWrong: [
        '`x` goes up in 2s from 1, so it is always odd and never equals 10.',
        'This forgets that 19 passes the test, so the body runs once more and makes `x` equal to 21.',
        null,
        'This reads `and` as `or`. With `and`, the loop stops as soon as either part is false, and `x < 20` eventually is.',
      ],
      keyIdea: 'See whether the loop condition uses `and` or `or`. With `and`, the loop stops when either part is false. List the values the variable takes, noting any it skips (here it is only ever odd). The test runs after the last update.',
    },
    check: {
      optionValues: ['10', '19', '21', 'Infinite loop'],
      compute: () => {
        let x = 1;
        for (let n = 0; x !== 10 && x < 20; n++) {
          if (n > 1000) return 'Infinite loop';
          x += 2;
        }
        return String(x);
      },
    },
  },
  {
    id: 'boolean-logic-027',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'What does this code print?',
    code: {
      lang: 'pseudocode',
      source: 'x = 1\nwhile (x != 10 or x < 20)\n   x = x + 2\nend while\nprint(x)',
    },
    options: ['`10`', '`19`', '`21`', 'Infinite loop'],
    correctIndex: 3,
    markScheme: {
      asking: 'Does this loop ever stop and, if it does, what does it print?',
      solution:
        'A `while` loop repeats while its condition is true. With `or`, only one part has to be true to keep going. So the loop stops only when **both** parts are false.\n\n' +
        'For the loop to stop, `x != 10` would have to be false. That means `x` would have to equal exactly 10.\n\n' +
        'But `x` starts at 1 and line 3 adds 2 on each pass: 1, 3, 5, 7, 9, 11 and so on. It is always odd, and it jumps from 9 to 11. So `x` is never 10.\n\n' +
        'So `x != 10` is true on every pass. That keeps the whole `or` true forever, so the loop never ends and line 5 is never reached.',
      conclusion: 'The condition can never become false, so the answer is Infinite loop.',
      whyWrong: [
        '`x` goes up in 2s from 1, so it is always odd and never equals 10.',
        'This treats the loop as ending when `x` is about to reach 20, but the `or` keeps it running while `x != 10` is true.',
        'This reads `or` as `and`. With `and` the loop would stop at 21, but with `or` one true part is enough to keep going.',
        null,
      ],
      keyIdea: 'For a `while` with `or`, work out what would make it stop: both parts false at once. Ask whether the variable can ever reach that state. If it skips the needed value (odd numbers never equal 10), the loop never ends.',
    },
    check: {
      optionValues: ['10', '19', '21', 'Infinite loop'],
      compute: () => {
        let x = 1;
        for (let n = 0; x !== 10 || x < 20; n++) {
          if (n > 1000) return 'Infinite loop';
          x += 2;
        }
        return String(x);
      },
    },
  },
  {
    id: 'boolean-logic-028',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'A loop runs `while (x > 0 and y > 0)`. Which condition is true when it stops?',
    options: ['`x <= 0 or y <= 0`', '`x <= 0 and y <= 0`', '`x < 0 or y < 0`', '`x > 0 or y > 0`'],
    correctIndex: 0,
    markScheme: {
      asking: 'When the loop ends, what do we know about `x` and `y`?',
      solution:
        'A `while` loop keeps running while its condition is true. So it stops at the moment the condition becomes false. We need the opposite of `x > 0 and y > 0`.\n\n' +
        'An `and` is false as soon as one side is false. So the loop stops if `x > 0` is false, **or** `y > 0` is false, or both.\n\n' +
        'The opposite of `x > 0` is `x <= 0`, because 0 itself is not above 0. In the same way, the opposite of `y > 0` is `y <= 0`. Joined with `or`, that gives `x <= 0 or y <= 0`.',
      conclusion: 'The loop ends when at least one part fails, so what is true when it stops is `x <= 0 or y <= 0`.',
      whyWrong: [
        null,
        'This negates both comparisons but keeps the `and`. The loop stops as soon as **one** of them fails, for example `x = 0, y = 5`.',
        'The opposite of `x > 0` is `x <= 0`, not `x < 0`. This misses the case `x = 0`.',
        'This does not negate the comparisons at all. With `x = 5, y = 5` it is true, but the loop would still be running.',
      ],
      keyIdea: 'The stop condition of a `while` is the opposite of its condition. Use De Morgan\'s law: `not (p and q)` is `not p or not q`. Then flip each comparison: `>` becomes `<=`, and `<` becomes `>=`.',
    },
    check: {
      optionValues: (() => {
        const grid = (f: (x: number, y: number) => boolean) => {
          let s = '';
          for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) s += f(x, y) ? '1' : '0';
          return s;
        };
        return [grid((x, y) => x <= 0 || y <= 0), grid((x, y) => x <= 0 && y <= 0), grid((x, y) => x < 0 || y < 0), grid((x, y) => x > 0 || y > 0)];
      })(),
      compute: () => {
        let s = '';
        for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) s += !(x > 0 && y > 0) ? '1' : '0';
        return s;
      },
    },
  },
];
