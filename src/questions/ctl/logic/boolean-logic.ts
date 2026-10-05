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

const NOTATION = '($\\land$ = AND, $\\lor$ = OR, $\\neg$ = NOT, $\\oplus$ = XOR; 1 = TRUE, 0 = FALSE.)';

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
      solution:
        'Write out the truth table of each gate for the four input pairs:\n\n' +
        '| $A$ | $B$ | OR | NAND | XOR | NOR |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 0 | 0 | 0 | 1 | 0 | 1 |\n' +
        '| 0 | 1 | 1 | 1 | 1 | 0 |\n' +
        '| 1 | 0 | 1 | 1 | 1 | 0 |\n' +
        '| 1 | 1 | 1 | 0 | 0 | 0 |\n\n' +
        'The inputs are different in the middle two rows only. The only column that is 1 in exactly those two rows (and 0 in the other two) is **XOR** (exclusive OR): "one or the other, but not both".',
      whyWrong: [
        'OR also outputs 1 when **both** inputs are 1, where the inputs are the same, so it is not "only when different". Confusing OR with XOR is the classic mistake here.',
        'NAND outputs 1 whenever at least one input is 0, including when both inputs are 0 (the same), so it is not "only when different".',
        null,
        'NOR outputs 1 only when both inputs are 0, so it is 1 when the inputs are the same, which is the opposite situation to the one asked about.',
      ],
      keyIdea: 'XOR (exclusive OR) is 1 exactly when the two inputs differ; OR is also 1 when both inputs are 1.',
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
      solution:
        'NAND means "NOT AND": first work out $A \\land B$, then flip the result.\n\n' +
        '| $A$ | $B$ | $A \\land B$ | $\\neg(A \\land B)$ |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 0 | 0 | 0 | 1 |\n' +
        '| 0 | 1 | 0 | 1 |\n' +
        '| 1 | 0 | 0 | 1 |\n' +
        '| 1 | 1 | 1 | 0 |\n\n' +
        'So the outputs are 1, 1, 1, 0. A NAND gate is 0 only when **both** inputs are 1.',
      whyWrong: [
        null,
        'This is the AND column: you forgot the NOT part of NAND, which flips every output.',
        'This is the NOR column (NOT OR), which is 1 only when both inputs are 0. NAND is NOT AND.',
        'This is the XOR column. NAND is also 1 when both inputs are 0, because $0 \\land 0 = 0$ and NOT 0 is 1.',
      ],
      keyIdea: 'NAND = NOT(AND): it outputs 0 only when both inputs are 1.',
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
      solution:
        'Substitute $A = 1$, $B = 0$, $C = 0$ into each expression, working out NOTs first, then brackets.\n\n' +
        '- $A \\land B = 1 \\land 0 = 0$.\n' +
        '- $A \\land (B \\lor \\neg C)$: $\\neg C = 1$, so the bracket is $0 \\lor 1 = 1$, then $1 \\land 1 = 1$. **TRUE.**\n' +
        '- $\\neg A \\lor C$: $\\neg A = 0$, so $0 \\lor 0 = 0$.\n' +
        '- $(A \\lor B) \\land C$: the bracket is $1 \\lor 0 = 1$, then $1 \\land 0 = 0$.\n\n' +
        'Only $A \\land (B \\lor \\neg C)$ is TRUE.',
      whyWrong: [
        'AND needs **both** inputs to be 1, and $B = 0$, so $A \\land B = 0$.',
        null,
        'You would pick this if you forgot the NOT and used $A$ instead of $\\neg A$. Since $A = 1$, $\\neg A = 0$, and $0 \\lor 0 = 0$.',
        'The bracket is 1, but it is then ANDed with $C = 0$, giving 0. Choosing it means treating the final $\\land$ as $\\lor$.',
      ],
      keyIdea: 'Evaluate step by step: NOT first, then brackets, then the outer operation.',
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
      solution:
        'OR is 1 when **at least one** input is 1. So it is easier to count the rows where the output is **0**: that only happens when every input is 0.\n\n' +
        '- Rows in total: $2^3 = 8$.\n' +
        '- Rows with output 0: just one, $A = B = C = 0$.\n' +
        '- Rows with output 1: $8 - 1 = 7$.',
      whyWrong: [
        'Only one row (all inputs 1) gives 1 for $A \\land B \\land C$. That is AND, not OR.',
        'This counts only the rows with **exactly one** input equal to 1. OR is also 1 when two or three inputs are 1.',
        'This forgets the row $A = B = C = 0$, where OR gives 0.',
        null,
      ],
      keyIdea: 'An OR of several inputs is 0 only when every input is 0.',
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
      solution:
        "De Morgan's law: to push a NOT into a bracket, **negate each part** and **swap AND with OR**.\n\n" +
        '$$\\neg(A \\land B) = \\neg A \\lor \\neg B$$\n\n' +
        'Check with the truth table:\n\n' +
        '| $A$ | $B$ | $\\neg(A \\land B)$ | $\\neg A \\lor \\neg B$ |\n' +
        '| --- | --- | --- | --- |\n' +
        '| 0 | 0 | 1 | 1 |\n' +
        '| 0 | 1 | 1 | 1 |\n' +
        '| 1 | 0 | 1 | 1 |\n' +
        '| 1 | 1 | 0 | 0 |\n\n' +
        'The columns match in every row, so the expressions are equivalent.',
      whyWrong: [
        null,
        'This negates both letters but forgets to change AND into OR. In fact $\\neg A \\land \\neg B$ equals $\\neg(A \\lor B)$ (NOR), which is 0 when $A = 1, B = 0$, but $\\neg(A \\land B)$ is 1 there.',
        'This swaps AND for OR but forgets to negate each letter. It gives 1 when $A = B = 1$, where $\\neg(A \\land B) = 0$.',
        'This negates only $A$. The NOT must go onto **every** part inside the bracket.',
      ],
      keyIdea: "De Morgan: NOT(A AND B) = (NOT A) OR (NOT B); negate every part and swap AND with OR.",
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
    stem:
      'In a logic circuit, inputs $A$ and $B$ go into an AND gate. The output of the AND gate and input $C$ go into an OR gate. The output of the OR gate then passes through a NOT gate to give the final output $Q$.\n\n' +
      'For how many of the 8 possible combinations of $A$, $B$ and $C$ is $Q = 1$?',
    options: ['5', '7', '3', '1'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Turn the circuit into an expression, gate by gate:\n\n' +
        '1. AND gate: $A \\land B$.\n' +
        '2. OR gate: $(A \\land B) \\lor C$.\n' +
        '3. NOT gate: $Q = \\neg((A \\land B) \\lor C)$.\n\n' +
        '| $A$ | $B$ | $C$ | $A \\land B$ | OR output | $Q$ |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 0 | 0 | 0 | 0 | 0 | 1 |\n' +
        '| 0 | 0 | 1 | 0 | 1 | 0 |\n' +
        '| 0 | 1 | 0 | 0 | 0 | 1 |\n' +
        '| 0 | 1 | 1 | 0 | 1 | 0 |\n' +
        '| 1 | 0 | 0 | 0 | 0 | 1 |\n' +
        '| 1 | 0 | 1 | 0 | 1 | 0 |\n' +
        '| 1 | 1 | 0 | 1 | 1 | 0 |\n' +
        '| 1 | 1 | 1 | 1 | 1 | 0 |\n\n' +
        'Shortcut: $Q = 1$ exactly when the OR output is 0, which needs $C = 0$ **and** $A \\land B = 0$. With $C = 0$ that leaves $(A, B) = (0, 0), (0, 1), (1, 0)$: **3** combinations.',
      whyWrong: [
        'This is the number of rows where the OR gate outputs 1. You forgot the final NOT gate, which flips every output.',
        'This is what you get if you read the second gate as AND: $\\neg(A \\land B \\land C)$ is 1 in 7 rows.',
        null,
        'This is what you get if you read the first gate as OR: $\\neg(A \\lor B \\lor C)$ is 1 only when all inputs are 0.',
      ],
      keyIdea: 'Translate a circuit gate by gate into an expression, then count rows (or count the rows that make it 0 and subtract).',
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
      solution:
        '$Q$ is 0 in only **one** row: $A = 0$, $B = 1$. So $Q$ is "NOT (that row)":\n\n' +
        '$$Q = \\neg(\\neg A \\land B)$$\n\n' +
        "Apply De Morgan's law (negate each part, swap AND for OR) and remove the double negation $\\neg\\neg A = A$:\n\n" +
        '$$Q = A \\lor \\neg B$$\n\n' +
        'Check each row of $A \\lor \\neg B$: (0, 0) gives $0 \\lor 1 = 1$; (0, 1) gives $0 \\lor 0 = 0$; (1, 0) gives $1 \\lor 1 = 1$; (1, 1) gives $1 \\lor 0 = 1$. This matches 1, 0, 1, 1.',
      whyWrong: [
        'This mixes up the two variables: $\\neg A \\lor B$ is 0 only when $A = 1, B = 0$, but the table has its 0 at $A = 0, B = 1$.',
        null,
        'This is XNOR, which is 1 only when the inputs are equal. It gives 0 for $A = 1, B = 0$, but the table has $Q = 1$ there.',
        'This is 1 in only one row ($A = 1, B = 0$). It describes where a single 1 is, but this table has three 1s and a single 0.',
      ],
      keyIdea: 'If a truth table has a single 0, write NOT(that row) and simplify with De Morgan.',
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
      solution:
        '$A$ appears in both brackets, so factor it out (the distributive law works for $\\land$ and $\\lor$ just like multiplying out brackets):\n\n' +
        '$$(A \\land B) \\lor (A \\land \\neg B) = A \\land (B \\lor \\neg B)$$\n\n' +
        'Complement law: $B \\lor \\neg B = 1$ (one of them is always true). Identity law: $A \\land 1 = A$.\n\n' +
        '$$A \\land 1 = A$$\n\n' +
        'Check: if $A = 1$, one of the brackets is 1 (whichever matches $B$); if $A = 0$, both brackets are 0. So the expression is just $A$.',
      whyWrong: [
        'This factors out the wrong variable. $A$ is the variable common to both brackets; $B$ appears as $B$ in one and $\\neg B$ in the other, so it cancels out.',
        'This keeps only the first bracket. The second bracket adds the row $A = 1, B = 0$, so the expression is true whenever $A = 1$.',
        '$B \\lor \\neg B = 1$ is correct, but you forgot it is still ANDed with $A$: $A \\land 1 = A$, not 1.',
        null,
      ],
      keyIdea: 'Factor out the common variable and use $B \\lor \\neg B = 1$ and $A \\land 1 = A$.',
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
    stem: 'Which Python condition is equivalent to `not (x > 3 and y < 5)` for all integers `x` and `y`?',
    options: ['`x <= 3 or y >= 5`', '`x <= 3 and y >= 5`', '`x < 3 or y > 5`', '`x > 3 or y < 5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        "Use De Morgan's law: `not (P and Q)` is the same as `(not P) or (not Q)`.\n\n" +
        '1. The `and` becomes `or`.\n' +
        '2. Negate each comparison: the opposite of `x > 3` is `x <= 3` (3 itself makes `x > 3` false, so it belongs on the other side). The opposite of `y < 5` is `y >= 5`.\n\n' +
        'Result: `x <= 3 or y >= 5`.\n\n' +
        'Quick test: `x = 3, y = 0`. The original: `x > 3` is False, so the `and` is False and `not` gives True. The answer: `x <= 3` is True, so True. They agree.',
      whyWrong: [
        null,
        'This negates both comparisons but forgets that De Morgan also turns `and` into `or`. With `x = 3, y = 0` the original is True but this is False.',
        'The opposite of `x > 3` is `x <= 3`, not `x < 3`: the value `x = 3` gets lost (and similarly `y = 5`). With `x = 3, y = 0` the original is True but this is False.',
        'This changes `and` into `or` but does not negate the two comparisons. With `x = 4, y = 0` the original is False but this is True.',
      ],
      keyIdea: 'not (P and Q) = (not P) or (not Q), and the negation of > is <= (not <).',
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
    stem: 'What does this Python code print? (All of the output appears on one line.)',
    code: {
      lang: 'python',
      source: `def check(n):
    print(n, end=' ')
    return n > 2

if check(1) and check(5):
    print('A')
if check(3) or check(0):
    print('B')`,
    },
    options: ['`1 5 3 0 B`', '`1 5 3 B`', '`1 3 B`', '`1 3 0 B`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Python uses **short-circuit evaluation**: it stops evaluating `and` / `or` as soon as the result is known.\n\n' +
        '| Step | Call | Prints | Returns | Effect |\n' +
        '| --- | --- | --- | --- | --- |\n' +
        '| 1 | `check(1)` | `1` | `False` | `False and ...` is already False, so `check(5)` is **skipped**; no `A` |\n' +
        '| 2 | `check(3)` | `3` | `True` | `True or ...` is already True, so `check(0)` is **skipped** |\n' +
        '| 3 | `print(\'B\')` | `B` | | |\n\n' +
        'Output: `1 3 B`.',
      whyWrong: [
        'This assumes both sides of `and` and `or` are always evaluated. Python stops as soon as the answer is known, so `check(5)` and `check(0)` never run.',
        'This short-circuits the `or` correctly but not the `and`: once `check(1)` returns False, `False and anything` is False, so `check(5)` is never called.',
        null,
        'This short-circuits the `and` correctly but not the `or`: once `check(3)` returns True, `True or anything` is True, so `check(0)` is never called.',
      ],
      keyIdea: '`and` stops at the first False value and `or` stops at the first True value; the right-hand side is not evaluated.',
    },
    python: { stdout: '1 3 B\n' },
  },
  {
    id: 'boolean-logic-011',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: { lang: 'python', source: 'print(3 and 7, 0 and 7, 0 or 4, not 5)' },
    options: ['`True False True False`', '`7 0 4 False`', '`3 0 4 False`', '`7 0 4 -5`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'In Python, `and` and `or` return **one of their operands**, not necessarily `True`/`False`. The number 0 is falsy; every other number is truthy.\n\n' +
        '- `3 and 7`: 3 is truthy, so `and` must look at the right side and returns it: `7`.\n' +
        '- `0 and 7`: 0 is falsy, so `and` stops and returns it: `0`.\n' +
        '- `0 or 4`: 0 is falsy, so `or` moves on and returns the right side: `4`.\n' +
        '- `not 5`: 5 is truthy, so `not` gives `False` (`not` always returns a real bool).\n\n' +
        'Output: `7 0 4 False`.',
      whyWrong: [
        'This assumes `and`/`or` always return `True` or `False`. In Python they return one of the operands (here 7, 0 and 4).',
        null,
        'This treats `3 and 7` as stopping at the first truthy value, which is how `or` behaves. `and` stops only at a falsy value; since 3 is truthy it returns 7.',
        'This treats `not` like a minus sign. `not` is logical negation: `not 5` is `False` because 5 is truthy.',
      ],
      keyIdea: '`a and b` returns a if a is falsy, else b; `a or b` returns a if a is truthy, else b.',
    },
    python: { stdout: '7 0 4 False\n' },
  },
  {
    id: 'boolean-logic-012',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: `Let $X = A \\text{ NAND } B$. A second NAND gate has $X$ connected to **both** of its inputs. Which expression gives the output of the second gate? ${NOTATION}`,
    options: ['$\\neg(A \\land B)$', '$A \\lor B$', '$1$ (always true)', '$A \\land B$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '1. First gate: $X = \\neg(A \\land B)$.\n' +
        '2. Second gate: $X \\text{ NAND } X = \\neg(X \\land X)$. Since $X \\land X = X$, this is $\\neg X$. (A NAND gate with its inputs tied together is a NOT gate.)\n' +
        '3. So the output is $\\neg X = \\neg\\neg(A \\land B) = A \\land B$ (two NOTs cancel).\n\n' +
        'This is how an AND gate is built from NAND gates only.',
      whyWrong: [
        'This is $X$ itself: you forgot that the second NAND gate inverts again ($X \\text{ NAND } X = \\neg X$).',
        'That is the output of $(A \\text{ NAND } A) \\text{ NAND } (B \\text{ NAND } B)$, where each input first gets its own NAND gate. Here both inputs of the second gate are the same signal $X$.',
        'This assumes a NAND gate with identical inputs always outputs 1. It does when $X = 0$, but when $X = 1$, $\\neg(1 \\land 1) = 0$.',
        null,
      ],
      keyIdea: 'X NAND X = NOT X, so NAND followed by a NAND-as-NOT gives AND.',
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
      solution:
        '$A \\oplus B$ is 1 exactly when the inputs differ, i.e. in the rows $(A, B) = (1, 0)$ and $(0, 1)$.\n\n' +
        '- Row (1, 0) is described by $A \\land \\neg B$.\n' +
        '- Row (0, 1) is described by $\\neg A \\land B$.\n\n' +
        'OR them together: $A \\oplus B = (A \\land \\neg B) \\lor (\\neg A \\land B)$.\n\n' +
        '| $A$ | $B$ | $A \\land \\neg B$ | $\\neg A \\land B$ | OR of the two | $A \\oplus B$ |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 0 | 0 | 0 | 0 | 0 | 0 |\n' +
        '| 0 | 1 | 0 | 1 | 1 | 1 |\n' +
        '| 1 | 0 | 1 | 0 | 1 | 1 |\n' +
        '| 1 | 1 | 0 | 0 | 0 | 0 |',
      whyWrong: [
        null,
        'This is 1 when the inputs are the **same** (XNOR), the exact opposite of XOR.',
        'XOR is "OR but not both": $(A \\lor B) \\land \\neg(A \\land B)$. Forgetting the NOT gives this, which simplifies to $A \\land B$.',
        'Joining the two parts with OR instead of AND makes the expression 1 in every row (for example $A = B = 1$ gives 1, but XOR gives 0).',
      ],
      keyIdea: 'XOR = (A AND NOT B) OR (NOT A AND B) = (A OR B) AND NOT(A AND B).',
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
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: 'a, b, c = True, False, False\nprint(a or b and c, (a or b) and c, not b and c)',
    },
    options: ['`False False False`', '`True False True`', '`True False False`', '`False False True`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Python precedence, from tightest to loosest: `not`, then `and`, then `or`.\n\n' +
        '1. `a or b and c` means `a or (b and c)` = `True or False` = `True`.\n' +
        '2. `(a or b) and c`: the bracket is `True`, then `True and False` = `False`.\n' +
        '3. `not b and c` means `(not b) and c` = `True and False` = `False`.\n\n' +
        'Output: `True False False`.',
      whyWrong: [
        'This evaluates `a or b and c` left to right as `(a or b) and c`. In Python `and` binds more tightly than `or`, so it is `a or (b and c)`, which is True.',
        'This treats `not b and c` as `not (b and c)`. `not` binds most tightly, so it applies only to `b`: `(not b) and c` is False.',
        null,
        'This makes both precedence mistakes: reading the first expression left to right and applying `not` to the whole of `b and c`.',
      ],
      keyIdea: 'Precedence: not > and > or (like minus sign > multiplication > addition).',
    },
    python: { stdout: 'True False False\n' },
  },
  {
    id: 'boolean-logic-015',
    subtopic: 'boolean-logic',
    difficulty: 'exam',
    stem: 'What happens when this Python code runs?',
    code: {
      lang: 'python',
      source: 'x = 0\nprint(x != 0 and 10 / x > 1)\nprint(x == 0 or 10 / x > 1)\nprint(10 / x > 1 and x != 0)',
    },
    options: [
      'It raises `ZeroDivisionError` at the first `print`',
      'It prints `False`, then `True`, then raises `ZeroDivisionError` at the last `print`',
      'It prints `False`, then `True`, then `False`',
      'It prints `False`, then raises `ZeroDivisionError` at the second `print`',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Python evaluates `and` / `or` **left to right** and stops as soon as the result is known.\n\n' +
        '1. `x != 0` is `False`, so `False and ...` is False without evaluating `10 / x`. Prints `False`.\n' +
        '2. `x == 0` is `True`, so `True or ...` is True without evaluating `10 / x`. Prints `True`.\n' +
        '3. Now `10 / x` is on the **left**, so it is evaluated first: dividing by 0 raises `ZeroDivisionError` before `x != 0` is ever checked.\n\n' +
        'This is why programmers write the "safety check" first: `x != 0 and 10 / x > 1`.',
      whyWrong: [
        'This ignores short-circuiting: `x != 0` is False, so Python never evaluates `10 / x` on that line.',
        null,
        'This assumes Python checks `x != 0` first wherever it is written. `and` evaluates left to right, so on the last line `10 / x` runs first and crashes.',
        'This assumes `or` always evaluates both sides. `x == 0` is True, so the `or` is already True and `10 / x` is skipped.',
      ],
      keyIdea: 'Short-circuiting lets a left-hand check (like x != 0) protect the right-hand side from an error, but only if the check comes first.',
    },
    python: { error: 'ZeroDivisionError' },
  },

  // ======================================================================= CHALLENGE
  {
    id: 'boolean-logic-016',
    subtopic: 'boolean-logic',
    difficulty: 'challenge',
    stem: `Simplify $(A \\lor B) \\land (A \\lor \\neg B) \\land (\\neg A \\lor B)$. ${NOTATION}`,
    options: ['$A$', '$A \\lor B$', '$B$', '$A \\land B$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1** (first two brackets). Both contain "$A \\lor$", so use the distributive law in reverse:\n\n' +
        '$$(A \\lor B) \\land (A \\lor \\neg B) = A \\lor (B \\land \\neg B)$$\n\n' +
        '$B \\land \\neg B = 0$ (a thing and its opposite are never both true), and $A \\lor 0 = A$. So the first two brackets give $A$.\n\n' +
        '**Step 2** (AND with the third bracket). Expand:\n\n' +
        '$$A \\land (\\neg A \\lor B) = (A \\land \\neg A) \\lor (A \\land B)$$\n\n' +
        '$A \\land \\neg A = 0$, so this is $A \\land B$.\n\n' +
        '**Check** with a row: $A = 1, B = 0$ makes the third bracket $0 \\lor 0 = 0$, so the whole expression is 0, and $A \\land B = 0$ too. Only $A = B = 1$ makes all three brackets 1.',
      whyWrong: [
        'This simplifies the first two brackets to $A$ correctly but forgets to AND with the third bracket $(\\neg A \\lor B)$, which removes the row $A = 1, B = 0$.',
        'This just keeps the first bracket. ANDing more brackets can only make the expression true in **fewer** rows, never the same or more.',
        'This combines the first and third brackets, $(A \\lor B) \\land (\\neg A \\lor B) = B$, and then drops the middle bracket $(A \\lor \\neg B)$, which removes the row $A = 0, B = 1$.',
        null,
      ],
      keyIdea: '$(A \\lor B) \\land (A \\lor \\neg B) = A$; then $A \\land (\\neg A \\lor B) = A \\land B$.',
    },
    check: {
      optionValues: [tt2((a) => a), tt2((a, b) => a || b), tt2((_a, b) => b), tt2((a, b) => a && b)],
      compute: () => tt2((a, b) => (a || b) && (a || !b) && (!a || b)),
    },
  },
  {
    id: 'boolean-logic-017',
    subtopic: 'boolean-logic',
    difficulty: 'challenge',
    stem:
      `Find the Boolean values $(A, B, C)$ (each 0 or 1) that satisfy **all four** equations. ${NOTATION}\n\n` +
      '$$A \\lor B = 1, \\quad A \\oplus C = 0, \\quad \\neg(B \\land C) = 1, \\quad A \\lor \\neg B = 1$$',
    options: ['$(1, 0, 1)$', '$(1, 1, 1)$', '$(0, 1, 0)$', '$(1, 0, 0)$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '1. Suppose $A = 0$. Then $A \\lor B = 1$ forces $B = 1$, and $A \\lor \\neg B = 1$ forces $\\neg B = 1$, i.e. $B = 0$. Contradiction, so $A = 1$.\n' +
        '2. $A \\oplus C = 0$ means $A$ and $C$ are the **same** (XOR is 0 for equal inputs), so $C = 1$.\n' +
        '3. $\\neg(B \\land C) = 1$ means $B \\land C = 0$. With $C = 1$ this needs $B = 0$.\n\n' +
        'So $(A, B, C) = (1, 0, 1)$. Check all four: $1 \\lor 0 = 1$; $1 \\oplus 1 = 0$; $\\neg(0 \\land 1) = 1$; $1 \\lor 1 = 1$.',
      whyWrong: [
        null,
        'This satisfies three equations, but $B \\land C = 1 \\land 1 = 1$, so $\\neg(B \\land C) = 0$, failing the third equation.',
        'This fails the last equation: $A \\lor \\neg B = 0 \\lor 0 = 0$.',
        'This fails $A \\oplus C = 0$, because $1 \\oplus 0 = 1$. It comes from thinking "XOR = 0" means the inputs are different; XOR is 0 when they are the same.',
      ],
      keyIdea: 'Use the equations to force one variable at a time (try a value and look for a contradiction), then check every equation.',
    },
    check: {
      optionValues: ['101', '111', '010', '100'],
      compute: () => {
        const sols: string[] = [];
        for (const a of BITS)
          for (const b of BITS)
            for (const c of BITS)
              if ((a || b) && !xor(a, c) && !(b && c) && (a || !b)) sols.push(bit(a) + bit(b) + bit(c));
        return sols.join(',');
      },
    },
  },
  {
    id: 'boolean-logic-018',
    subtopic: 'boolean-logic',
    difficulty: 'challenge',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: `count = 0

def f(x):
    global count
    count += 1
    return x

r = f(0) and f(1) or f(2) and f(3)
print(r, count)`,
    },
    options: ['`3 4`', '`True 3`', '`3 3`', '`0 1`'],
    correctIndex: 2,
    markScheme: {
      solution:
        '`f` returns its argument unchanged but adds 1 to `count` every time it is **called**. Because `and` binds more tightly than `or`, the line means:\n\n' +
        '`r = (f(0) and f(1)) or (f(2) and f(3))`\n\n' +
        '| Step | What happens | `count` |\n' +
        '| --- | --- | --- |\n' +
        '| 1 | `f(0)` returns 0 (falsy), so `0 and f(1)` stops: value 0; `f(1)` is skipped | 1 |\n' +
        '| 2 | Left side of `or` is 0 (falsy), so evaluate the right side | 1 |\n' +
        '| 3 | `f(2)` returns 2 (truthy), so `and` continues | 2 |\n' +
        '| 4 | `f(3)` returns 3, so `2 and 3` gives 3 | 3 |\n\n' +
        'So `r = 3` and `count = 3`. Output: `3 3`.',
      whyWrong: [
        'This assumes every call runs. `f(1)` is skipped, because `f(0)` returns 0 and `0 and ...` stops immediately.',
        'This assumes `and`/`or` produce `True`/`False`. They return one of the operands, here the 3 returned by `f(3)`.',
        null,
        'This assumes the whole line stops at the first falsy value. But `and` binds more tightly than `or`, so after `f(0) and f(1)` gives 0, Python still evaluates the right side of the `or`.',
      ],
      keyIdea: 'Short-circuiting skips function calls entirely, and and/or return operands, not just True/False.',
    },
    python: { stdout: '3 3\n' },
  },
  {
    id: 'boolean-logic-019',
    subtopic: 'boolean-logic',
    difficulty: 'challenge',
    stem:
      `A circuit computes $Q = (A \\text{ NOR } B) \\oplus (B \\text{ NAND } C)$. ${NOTATION}\n\n` +
      'List the inputs in the usual order $(A, B, C)$ = 000, 001, 010, 011, 100, 101, 110, 111. What is the output column for $Q$?',
    options: ['1, 1, 1, 0, 1, 1, 1, 0', '0, 0, 1, 0, 1, 1, 1, 0', '1, 1, 0, 1, 0, 0, 0, 1', '1, 1, 0, 0, 0, 0, 0, 0'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Let $P = A \\text{ NOR } B$ (1 only when $A = B = 0$) and $R = B \\text{ NAND } C$ (0 only when $B = C = 1$). Then $Q = P \\oplus R$ is 1 when $P$ and $R$ differ.\n\n' +
        '| $A$ | $B$ | $C$ | $P$ | $R$ | $Q$ |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| 0 | 0 | 0 | 1 | 1 | 0 |\n' +
        '| 0 | 0 | 1 | 1 | 1 | 0 |\n' +
        '| 0 | 1 | 0 | 0 | 1 | 1 |\n' +
        '| 0 | 1 | 1 | 0 | 0 | 0 |\n' +
        '| 1 | 0 | 0 | 0 | 1 | 1 |\n' +
        '| 1 | 0 | 1 | 0 | 1 | 1 |\n' +
        '| 1 | 1 | 0 | 0 | 1 | 1 |\n' +
        '| 1 | 1 | 1 | 0 | 0 | 0 |\n\n' +
        'Output column: 0, 0, 1, 0, 1, 1, 1, 0.',
      whyWrong: [
        'This treats $\\oplus$ as ordinary OR. In the first two rows $P = R = 1$, and XOR of two 1s is 0, not 1.',
        null,
        'This forgets the NOT in NOR and uses $A \\lor B$ for $P$. That flips $P$ in every row, so every output comes out flipped.',
        'This treats $\\oplus$ as AND, giving 1 only where $P$ and $R$ are both 1. XOR is 1 where they are **different**.',
      ],
      keyIdea: 'Work out each gate as its own column first, then combine the columns with the final gate.',
    },
    check: {
      optionValues: ['11101110', '00101110', '11010001', '11000000'],
      compute: () => tt3((a, b, c) => xor(nor(a, b), nand(b, c))),
    },
  },
  {
    id: 'boolean-logic-020',
    subtopic: 'boolean-logic',
    difficulty: 'challenge',
    stem: `Which expression is **NOT** logically equivalent to $\\neg(A \\lor (\\neg A \\land B))$? ${NOTATION}`,
    options: ['$\\neg A \\land \\neg B$', '$\\neg(A \\lor B)$', '$\\neg A \\land (A \\lor \\neg B)$', '$\\neg A \\lor \\neg B$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Simplify the given expression.** Inside the NOT, distribute the OR:\n\n' +
        '$$A \\lor (\\neg A \\land B) = (A \\lor \\neg A) \\land (A \\lor B) = 1 \\land (A \\lor B) = A \\lor B$$\n\n' +
        'So the expression is $\\neg(A \\lor B)$, which by De Morgan is $\\neg A \\land \\neg B$ (1 only when $A = B = 0$).\n\n' +
        '**Test each option:**\n\n' +
        '- $\\neg A \\land \\neg B$: equivalent (shown above).\n' +
        '- $\\neg(A \\lor B)$: equivalent (shown above).\n' +
        '- $\\neg A \\land (A \\lor \\neg B) = (\\neg A \\land A) \\lor (\\neg A \\land \\neg B) = \\neg A \\land \\neg B$: equivalent.\n' +
        '- $\\neg A \\lor \\neg B$: with $A = 1, B = 0$ it gives $0 \\lor 1 = 1$, but the original gives $\\neg(1 \\lor 0) = 0$. **Not equivalent.**',
      whyWrong: [
        'This one is equivalent: the original simplifies to $\\neg(A \\lor B)$, and De Morgan turns that into $\\neg A \\land \\neg B$. It can look wrong if you misremember De Morgan as keeping the OR, but $\\neg(A \\lor B)$ really is $\\neg A \\land \\neg B$.',
        'This one is equivalent: $A \\lor (\\neg A \\land B)$ simplifies to $A \\lor B$ (absorption), so the original is exactly $\\neg(A \\lor B)$.',
        'This one is equivalent: expanding gives $(\\neg A \\land A) \\lor (\\neg A \\land \\neg B)$, and $\\neg A \\land A = 0$, leaving $\\neg A \\land \\neg B$. It only looks different.',
        null,
      ],
      keyIdea: 'Simplify the target first ($A \\lor (\\neg A \\land B) = A \\lor B$), then test options with a row such as $A = 1, B = 0$.',
    },
    check: {
      optionValues: ['0', '1', '2', '3'],
      compute: () => {
        const target = tt2((a, b) => !(a || (!a && b)));
        const opts = [
          tt2((a, b) => !a && !b),
          tt2((a, b) => !(a || b)),
          tt2((a, b) => !a && (a || !b)),
          tt2((a, b) => !a || !b),
        ];
        return opts
          .map((t, i) => (t !== target ? String(i) : ''))
          .filter(Boolean)
          .join(',');
      },
    },
  },
];
