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
    stem: 'Inputs $A$ and $B$ enter an AND gate; its output and $C$ enter an OR gate, followed by a NOT gate giving $Q$. For how many of the 8 input combinations is $Q = 1$?',
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
    stem: 'Which condition is equivalent to `not (x > 3 and y < 5)` for all integers `x` and `y`?',
    options: ['`x <= 3 or y >= 5`', '`x <= 3 and y >= 5`', '`x < 3 or y > 5`', '`x > 3 or y < 5`'],
    correctIndex: 0,
    markScheme: {
      solution:
        "Use De Morgan's law: `not (P and Q)` is the same as `(not P) or (not Q)`.\n\n" +
        '1. The `and` becomes `or`.\n' +
        '2. Negate each comparison: the opposite of `x > 3` is `x <= 3` (3 itself makes `x > 3` false, so it belongs on the other side). The opposite of `y < 5` is `y >= 5`.\n\n' +
        'Result: `x <= 3 or y >= 5`.\n\n' +
        'Quick test: `x = 3, y = 0`. The original: `x > 3` is false, so the `and` is false and `not` gives true. The answer: `x <= 3` is true, so true. They agree.',
      whyWrong: [
        null,
        'This negates both comparisons but forgets that De Morgan also turns `and` into `or`. With `x = 3, y = 0` the original is true but this is false.',
        'The opposite of `x > 3` is `x <= 3`, not `x < 3`: the value `x = 3` gets lost (and similarly `y = 5`). With `x = 3, y = 0` the original is true but this is false.',
        'This changes `and` into `or` but does not negate the two comparisons. With `x = 4, y = 0` the original is false but this is true.',
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
      solution:
        'This is **short-circuit evaluation**: the right-hand side is skipped once the result is known.\n\n' +
        '| Step | Call | Prints | Returns | Effect |\n' +
        '| --- | --- | --- | --- | --- |\n' +
        '| 1 | `check(1)` | `1` | false | false `and` anything is false, so `check(5)` is **skipped**; no `A` |\n' +
        '| 2 | `check(3)` | `3` | true | true `or` anything is true, so `check(0)` is **skipped** |\n' +
        '| 3 | `print("B")` | `B` | | |\n\n' +
        'Output: `1 3 B`.',
      whyWrong: [
        'This assumes both sides of `and` and `or` are always evaluated. The stem says evaluation stops as soon as the result is known, so `check(5)` and `check(0)` never run.',
        'This short-circuits the `or` correctly but not the `and`: once `check(1)` returns false, the `and` is already false, so `check(5)` is never called.',
        null,
        'This short-circuits the `and` correctly but not the `or`: once `check(3)` returns true, the `or` is already true, so `check(0)` is never called.',
      ],
      keyIdea: '`and` stops at the first false value and `or` stops at the first true value; the right-hand side is not evaluated.',
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
      solution:
        'Work gate by gate. The first gate gives $X = \\neg(A \\land B)$.\n\n' +
        'The second gate gives $X \\text{ NAND } X = \\neg(X \\land X)$. Since $X \\land X = X$, this is $\\neg X$. (A NAND gate with its inputs tied together is a NOT gate.)\n\n' +
        'So the output is $\\neg X = \\neg\\neg(A \\land B) = A \\land B$ (two NOTs cancel). This is how an AND gate is built from NAND gates only.',
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
    stem: 'Here `not` is done first, then `and`, then `or`. What is printed, in order?',
    code: {
      lang: 'pseudocode',
      source: 'a = true\nb = false\nc = false\nprint(a or b and c)\nprint((a or b) and c)\nprint(not b and c)',
    },
    options: ['`false false false`', '`true false true`', '`true false false`', '`false false true`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Apply the stated order: `not`, then `and`, then `or`. Brackets come first.\n\n' +
        '1. `a or b and c` means `a or (b and c)`, which is true `or` false, so true.\n' +
        '2. `(a or b) and c`: the bracket is true, then true `and` false is false.\n' +
        '3. `not b and c` means `(not b) and c`, which is true `and` false, so false.\n\n' +
        'Output: `true false false`.',
      whyWrong: [
        'This evaluates `a or b and c` left to right as `(a or b) and c`. Because `and` is done before `or`, it is `a or (b and c)`, which is true.',
        'This treats `not b and c` as `not (b and c)`. `not` is done first, so it applies only to `b`: `(not b) and c` is false.',
        null,
        'This makes both precedence mistakes: reading the first expression left to right and applying `not` to the whole of `b and c`.',
      ],
      keyIdea: 'Precedence: not, then and, then or (like minus sign, then multiplication, then addition).',
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
      solution:
        'Each condition is evaluated **left to right** and stops as soon as the result is known.\n\n' +
        '1. `x != 0` is false, so the `and` is false without evaluating `10 / x`. Prints `false`.\n' +
        '2. `x == 0` is true, so the `or` is true without evaluating `10 / x`. Prints `true`.\n' +
        '3. Now `10 / x` is on the **left**, so it is evaluated first: dividing by 0 is an error, before `x != 0` is ever checked.\n\n' +
        'This is why the safety check goes first: `x != 0 and 10 / x > 1`.',
      whyWrong: [
        'This ignores short-circuiting: `x != 0` is false, so `10 / x` is never evaluated on that line.',
        null,
        'This assumes `x != 0` is checked first wherever it is written. `and` evaluates left to right, so on the last line `10 / x` runs first.',
        'This assumes `or` always evaluates both sides. `x == 0` is true, so the `or` is already true and `10 / x` is skipped.',
      ],
      keyIdea: 'Short-circuiting lets a left-hand check (like x != 0) protect the right-hand side from an error, but only if the check comes first.',
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
      solution: 'Each input can be 0 or 1, so each input doubles the number of combinations. With $n$ inputs there are $2^n$ rows, and $2^4 = 16$.',
      whyWrong: [
        'This gives one row per input. A truth table needs one row per **combination** of inputs.',
        'This is $2 \\times 4$. The number of rows doubles for each input, so it is $2^4$, not $2 \\times 4$.',
        null,
        'This is $4!$, the number of ways to order 4 things. The rows are combinations of 0s and 1s.',
      ],
      keyIdea: 'A truth table with $n$ inputs has $2^n$ rows.',
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
      solution: 'AND is 1 in only one row of its truth table: $A = 1$, $B = 1$. In every other row it is 0.',
      whyWrong: [
        null,
        'This describes OR, which is also 1 when only one input is 1.',
        'This describes XOR.',
        'This describes NOR. An AND gate gives 0 when both inputs are 0.',
      ],
      keyIdea: 'AND needs both inputs to be 1; OR needs at least one.',
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
      solution: 'A **NOT** gate has one input and outputs the opposite value: 0 becomes 1, and 1 becomes 0. AND, OR and XOR each have two inputs.',
      whyWrong: [
        null,
        'AND has two inputs and outputs 1 only when both are 1.',
        'OR has two inputs and outputs 1 when at least one is 1.',
        'XOR has two inputs and outputs 1 when they are different.',
      ],
      keyIdea: 'NOT is the only one of the basic gates with a single input: it flips the value.',
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
      solution: 'XOR outputs 1 only when its two inputs are **different**. Here both inputs are 1, so the output is $0$.',
      whyWrong: [
        null,
        'This is $1 \\lor 1$. OR is 1 when both inputs are 1, but XOR is not.',
        'This is ordinary addition. Boolean outputs can only be 0 or 1.',
        'This writes the two inputs side by side. A gate outputs a single value, 0 or 1.',
      ],
      keyIdea: 'XOR is 1 exactly when the two inputs differ.',
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
      solution:
        'The condition counts numbers that are even **and** not multiples of 3.\n\n' +
        '| i | 2 | 4 | 6 | 8 | 10 |\n| --- | --- | --- | --- | --- | --- |\n| mod(i,3) | 2 | 1 | 0 | 2 | 1 |\n| counted? | yes | yes | no | yes | yes |\n\n' +
        'Odd values of `i` fail the first part, so they are never counted. The count is $4$.',
      whyWrong: [
        'This counts all the even numbers and ignores the second part of the `and`, which rules out 6.',
        null,
        'This reads `mod(i,3) != 0` as `mod(i,3) == 0`, which leaves only 6.',
        'This reads `and` as `or`: every number from 1 to 10 except 3 and 9 would then be counted.',
      ],
      keyIdea: 'With `and`, a value is counted only if it passes every part of the condition.',
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
      solution:
        '`x` takes the odd values $1, 3, 5, \\dots$, so `x != 10` is always true. The loop is controlled by `x < 20`.\n\n' +
        '| x at the test | `x != 10` | `x < 20` | loop runs? |\n| --- | --- | --- | --- |\n| 1 | true | true | yes |\n| ... | true | true | yes |\n| 19 | true | true | yes |\n| 21 | true | false | no |\n\n' +
        'The loop stops at $x = 21$, and it prints `21`.',
      whyWrong: [
        '`x` goes up in 2s from 1, so it is always odd and never equals 10.',
        'This forgets that 19 passes the test, so the body runs once more and makes `x` equal to 21.',
        null,
        'This reads `and` as `or`. With `and`, the loop stops as soon as either part is false, and `x < 20` eventually is.',
      ],
      keyIdea: 'A `while` loop with `and` stops as soon as one part of the condition becomes false.',
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
      solution:
        'An `or` condition is false only when **both** parts are false, so the loop stops only when `x == 10` and `x >= 20` at the same time. That can never happen.\n\n' +
        '| x at the test | `x != 10` | `x < 20` | loop runs? |\n| --- | --- | --- | --- |\n| 1 | true | true | yes |\n| 19 | true | true | yes |\n| 21 | true | false | yes |\n| 23 | true | false | yes |\n\n' +
        '`x` stays odd, so `x != 10` is always true. The answer is **Infinite loop**.',
      whyWrong: [
        '`x` goes up in 2s from 1, so it is always odd and never equals 10.',
        'This treats the loop as ending when `x` is about to reach 20, but the `or` keeps it running while `x != 10` is true.',
        'This reads `or` as `and`. With `and` the loop would stop at 21, but with `or` one true part is enough to keep going.',
        null,
      ],
      keyIdea: 'A `while` loop with `or` keeps running while either part is true.',
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
      solution:
        'The loop stops when its condition is false, so we need `not (x > 0 and y > 0)`.\n\n' +
        "By De Morgan's law, `and` becomes `or` and each comparison is negated. The opposite of `x > 0` is `x <= 0`, and the opposite of `y > 0` is `y <= 0`.\n\n" +
        'So when the loop stops, `x <= 0 or y <= 0`.',
      whyWrong: [
        null,
        'This negates both comparisons but keeps the `and`. The loop stops as soon as **one** of them fails, for example `x = 0, y = 5`.',
        'The opposite of `x > 0` is `x <= 0`, not `x < 0`. This misses the case `x = 0`.',
        'This does not negate the comparisons at all. With `x = 5, y = 5` it is true, but the loop would still be running.',
      ],
      keyIdea: 'A loop exits when its condition is false: use De Morgan to write that as a condition.',
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
