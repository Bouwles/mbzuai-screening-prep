import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- truth-table helpers (used only by the checks)
type B = boolean;
const TF = [true, false];
const imp = (a: B, b: B): B => !a || b;
const iff = (a: B, b: B): B => a === b;
/** Truth-table column for 2 variables, rows (p, q) = TT, TF, FT, FF, as a string like "TFTT". */
const tt2 = (f: (p: B, q: B) => B): string =>
  TF.flatMap((p) => TF.map((q) => (f(p, q) ? 'T' : 'F'))).join('');
/** Truth-table column for 3 variables, rows TTT, TTF, TFT, TFF, FTT, FTF, FFT, FFF. */
const tt3 = (f: (p: B, q: B, r: B) => B): string =>
  TF.flatMap((p) => TF.flatMap((q) => TF.map((r) => (f(p, q, r) ? 'T' : 'F')))).join('');
/** Label of the unique entry whose formula is true in every row (or false in every row); 'none' / 'many' otherwise. */
function uniqueWhere(cands: [string, (p: B, q: B) => B][], want: 'TTTT' | 'FFFF'): string {
  const hits = cands.filter(([, f]) => tt2(f) === want).map(([k]) => k);
  return hits.length === 1 ? hits[0] : hits.length === 0 ? 'none' : 'many';
}

export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'propositional-logic-001',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'Which of the following is a **proposition** (a statement that is either true or false, but not both)?',
    options: ['"Close the door."', '"Is it raining?"', '"7 is an even number."', '"$x + 2 = 5$"'],
    correctIndex: 2,
    markScheme: {
      solution:
        'A proposition is a **declarative** sentence (it makes a claim) that has one definite truth value: true or false.\n\n' +
        '- "Close the door." is a command. It cannot be true or false.\n' +
        '- "Is it raining?" is a question. It does not claim anything.\n' +
        '- "7 is an even number." makes a clear claim, and that claim is **false**. A false statement is still a proposition, because it has a definite truth value.\n' +
        '- "$x + 2 = 5$" is an **open sentence**: it is true when $x = 3$ and false for every other $x$. Until $x$ is known it has no single truth value, so it is not a proposition.\n\n' +
        'So the only proposition is "7 is an even number."',
      whyWrong: [
        'A command (instruction) cannot be true or false, so it is not a proposition.',
        'A question asks something rather than claiming something, so it has no truth value.',
        null,
        'This is an open sentence: its truth depends on the value of $x$ (true only for $x = 3$), so on its own it is not a proposition.',
      ],
      keyIdea: 'A proposition is a declarative sentence with one definite truth value; a false statement is still a proposition.',
    },
  },
  {
    id: 'propositional-logic-002',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'The proposition $p$ is **true** and the proposition $q$ is **false**. Which of the following is **true**?',
    options: ['$p \\lor q$', '$p \\land q$', '$p \\to q$', '$p \\leftrightarrow q$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Substitute $p = \\text{T}$ and $q = \\text{F}$ into each statement.\n\n' +
        '- $p \\lor q$ ("or"): true if **at least one** part is true. $p$ is true, so $p \\lor q$ is **true**.\n' +
        '- $p \\land q$ ("and"): true only if **both** parts are true. $q$ is false, so it is false.\n' +
        '- $p \\to q$ ("if $p$ then $q$"): the only false case of an implication is true $\\to$ false, which is exactly this case, so it is false.\n' +
        '- $p \\leftrightarrow q$ ("$p$ if and only if $q$"): true only when both sides have the **same** truth value. They differ, so it is false.\n\n' +
        'Only $p \\lor q$ is true.',
      whyWrong: [
        null,
        'AND needs **both** parts to be true; here $q$ is false, so $p \\land q$ is false.',
        'True hypothesis with a false conclusion is the one case where an implication is false.',
        'A biconditional is true only when both sides match; here one is true and one is false, so it is false.',
      ],
      keyIdea: 'OR needs at least one true part, AND needs both, an implication fails only for true-then-false, and a biconditional needs equal truth values.',
    },
    check: {
      optionValues: ['or', 'and', 'imp', 'iff'],
      compute: () => {
        const p = true;
        const q = false;
        const vals: [string, B][] = [
          ['or', p || q],
          ['and', p && q],
          ['imp', imp(p, q)],
          ['iff', iff(p, q)],
        ];
        const t = vals.filter(([, v]) => v).map(([k]) => k);
        return t.length === 1 ? t[0] : 'ambiguous';
      },
    },
  },
  {
    id: 'propositional-logic-003',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'A compound statement uses the three propositions $p$, $q$ and $r$. How many rows does its full truth table have (not counting the heading row)?',
    options: ['$8$', '$6$', '$9$', '$3$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each row of a truth table is one possible combination of truth values.\n\n' +
        '- $p$ can be T or F: 2 choices.\n' +
        '- For each of those, $q$ can be T or F: $2 \\times 2 = 4$ combinations.\n' +
        '- For each of those, $r$ can be T or F: $2 \\times 2 \\times 2 = 8$ combinations.\n\n' +
        'In general $n$ variables give $2^n$ rows, so here $2^3 = 8$ rows: TTT, TTF, TFT, TFF, FTT, FTF, FFT, FFF.',
      whyWrong: [
        null,
        'This is $2 \\times 3$: it multiplies the 2 truth values by the 3 variables instead of multiplying 2 by itself 3 times.',
        'This is $3^2$: the base and the power are swapped. There are 2 truth values and 3 variables, so it is $2^3$.',
        'This gives one row per variable, but each row must be a whole combination of values for all three variables.',
      ],
      keyIdea: 'With $n$ propositional variables a truth table has $2^n$ rows.',
    },
    check: {
      optionValues: [8, 6, 9, 3],
      compute: () => {
        let rows = 0;
        for (const p of TF) for (const q of TF) for (const r of TF) if ([p, q, r].length === 3) rows++;
        return rows;
      },
    },
  },
  {
    id: 'propositional-logic-004',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'The implication $p \\to q$ ("if $p$, then $q$") is **false** exactly when:',
    options: [
      '$p$ is false and $q$ is true',
      '$p$ is true and $q$ is false',
      '$p$ and $q$ are both false',
      '$p$ and $q$ are both true',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Think of $p \\to q$ as a promise: "If you score 90% ($p$), then I will buy you a phone ($q$)."\n\n' +
        '| $p$ | $q$ | $p \\to q$ | Promise |\n' +
        '| --- | --- | --- | --- |\n' +
        '| T | T | T | kept |\n' +
        '| T | F | F | broken |\n' +
        '| F | T | T | not tested |\n' +
        '| F | F | T | not tested |\n\n' +
        'The promise is only broken when you **do** score 90% and you do **not** get the phone. When $p$ is false the promise was never tested, so the implication counts as true (it is *vacuously true*).\n\n' +
        'So $p \\to q$ is false exactly when $p$ is true and $q$ is false.',
      whyWrong: [
        'When the hypothesis $p$ is false the implication is vacuously true, so false-then-true gives true, not false.',
        null,
        'Both false is also a vacuously true case: the hypothesis never happened, so nothing was broken.',
        'True hypothesis with a true conclusion means the promise was kept, so the implication is true.',
      ],
      keyIdea: 'An implication is false only when a true hypothesis leads to a false conclusion; a false hypothesis always makes it true.',
    },
    check: {
      optionValues: ['FT', 'TF', 'FF', 'TT'],
      compute: () => {
        const falseRows: string[] = [];
        for (const p of TF) for (const q of TF) if (!imp(p, q)) falseRows.push((p ? 'T' : 'F') + (q ? 'T' : 'F'));
        return falseRows.join(',');
      },
    },
  },
  {
    id: 'propositional-logic-005',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'Which statement is the **negation** of "It is sunny and it is warm."?',
    options: [
      'It is not sunny and it is not warm.',
      'It is sunny or it is warm.',
      'It is not sunny and it is warm.',
      'It is not sunny or it is not warm.',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Let $s$ = "it is sunny" and $w$ = "it is warm". The statement is $s \\land w$.\n\n' +
        'De Morgan\'s law says that negating an AND gives an OR of the negations:\n\n' +
        '$$\\neg(s \\land w) \\equiv \\neg s \\lor \\neg w$$\n\n' +
        'Check with common sense: "sunny and warm" is false as soon as **at least one** part fails, so the negation is "not sunny **or** not warm".\n\n' +
        'In words: "It is not sunny or it is not warm."',
      whyWrong: [
        'This negates both parts but keeps "and". De Morgan\'s law also flips "and" to "or". On a sunny but cold day the original statement is false, so its negation should be true, but this version is also false.',
        'This flips "and" to "or" but forgets to negate the two parts.',
        'This negates only the first part; the negation must apply to both parts and turn "and" into "or".',
        null,
      ],
      keyIdea: 'De Morgan: $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$, so negate each part AND swap "and" for "or".',
    },
    check: {
      optionValues: ['FFFT', 'TTTF', 'FFTF', 'FTTT'],
      compute: () => tt2((s, w) => !(s && w)),
    },
  },
  {
    id: 'propositional-logic-006',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'What is the **converse** of the implication $\\neg p \\to q$?',
    options: ['$\\neg q \\to p$', '$q \\to \\neg p$', '$p \\to \\neg q$', '$q \\to p$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'For an implication "hypothesis $\\to$ conclusion", the **converse** swaps the two parts and changes nothing else.\n\n' +
        'Here the hypothesis is the whole of $\\neg p$ and the conclusion is $q$.\n\n' +
        'Swapping them gives $q \\to \\neg p$.\n\n' +
        'For comparison: the inverse negates both ($p \\to \\neg q$) and the contrapositive swaps and negates ($\\neg q \\to p$).',
      whyWrong: [
        'This is the **contrapositive**: swap and negate both parts ($\\neg q \\to \\neg\\neg p$, and $\\neg\\neg p = p$).',
        null,
        'This is the **inverse**: both parts are negated but not swapped ($\\neg\\neg p \\to \\neg q$, which is $p \\to \\neg q$).',
        'This swaps the parts but drops the negation on $p$. The hypothesis was $\\neg p$, so the whole of $\\neg p$ must move.',
      ],
      keyIdea: 'Converse = swap; inverse = negate both; contrapositive = swap and negate both.',
    },
  },

  // ================================================================ exam
  {
    id: 'propositional-logic-007',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'Which statement is the **contrapositive** of "If a number is divisible by 6, then it is divisible by 3."?',
    options: [
      'If a number is divisible by 3, then it is divisible by 6.',
      'If a number is not divisible by 6, then it is not divisible by 3.',
      'If a number is not divisible by 3, then it is not divisible by 6.',
      'A number is divisible by 6 and it is not divisible by 3.',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Let $p$ = "divisible by 6" and $q$ = "divisible by 3". The statement is $p \\to q$.\n\n' +
        'The **contrapositive** swaps the two parts **and** negates both: $\\neg q \\to \\neg p$.\n\n' +
        'In words: "If a number is not divisible by 3, then it is not divisible by 6."\n\n' +
        'Sanity check: the original is true (every multiple of 6 is a multiple of 3), and the contrapositive is also true, as it must be, because a statement and its contrapositive are logically equivalent. By contrast the converse fails for 9, which is divisible by 3 but not by 6.',
      whyWrong: [
        'This is the **converse** ($q \\to p$): the parts are swapped but not negated. It is false, e.g. 9 is divisible by 3 but not by 6.',
        'This is the **inverse** ($\\neg p \\to \\neg q$): both parts are negated but not swapped. It is false, e.g. 9 is not divisible by 6 but is divisible by 3.',
        null,
        'This is the **negation** of the statement ($p \\land \\neg q$), which says the implication fails; it is not a rewritten implication at all.',
      ],
      keyIdea: 'The contrapositive of $p \\to q$ is $\\neg q \\to \\neg p$, and it is always logically equivalent to the original.',
    },
    check: {
      // truth-table columns (rows TT, TF, FT, FF) of converse, inverse, contrapositive, negation
      optionValues: ['TTFT', 'TTFT', 'TFTT', 'FTFF'],
      compute: () => tt2((p, q) => imp(p, q)),
    },
  },
  {
    id: 'propositional-logic-008',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'It is known that the statement $p \\to q$ is **true** and that $q$ is **false**. What can be concluded about $p$?',
    options: ['$p$ must be true', '$p$ must be false', '$p$ could be either true or false', 'Nothing: this situation is impossible'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Look only at the rows of the truth table where $q$ is false:\n\n' +
        '| $p$ | $q$ | $p \\to q$ |\n' +
        '| --- | --- | --- |\n' +
        '| T | F | F |\n' +
        '| F | F | T |\n\n' +
        'We are told $p \\to q$ is true, so the first row is ruled out. Only the row with $p$ false is left.\n\n' +
        'So $p$ must be false. This is the contrapositive at work: $p \\to q$ is equivalent to $\\neg q \\to \\neg p$, and since $\\neg q$ is true, $\\neg p$ is true. (This rule of reasoning is called *modus tollens*.)',
      whyWrong: [
        'If $p$ were true, the implication would be true $\\to$ false, which is false, contradicting what we were told.',
        null,
        'That would be the case if $q$ were **true** (both T,T and F,T make $p \\to q$ true). With $q$ false only one row survives, so $p$ is forced.',
        'The situation is possible: $p$ false and $q$ false makes $p \\to q$ (vacuously) true.',
      ],
      keyIdea: 'If $p \\to q$ is true and $q$ is false, then $p$ must be false (modus tollens, the contrapositive).',
    },
    check: {
      optionValues: ['T', 'F', 'TF', null],
      compute: () => {
        const q = false;
        const possible = TF.filter((p) => imp(p, q)).map((p) => (p ? 'T' : 'F'));
        return possible.join('');
      },
    },
  },
  {
    id: 'propositional-logic-009',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'Which statement is **logically equivalent** to $p \\to q$?',
    options: ['$\\neg p \\lor q$', '$p \\lor \\neg q$', '$\\neg p \\land q$', '$\\neg p \\to \\neg q$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Two statements are logically equivalent when their truth-table columns are identical. Rows are $(p, q)$ = TT, TF, FT, FF.\n\n' +
        '| $p$ | $q$ | $p \\to q$ | $\\neg p \\lor q$ | $p \\lor \\neg q$ | $\\neg p \\land q$ | $\\neg p \\to \\neg q$ |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| T | T | T | T | T | F | T |\n' +
        '| T | F | F | F | T | F | T |\n' +
        '| F | T | T | T | F | T | F |\n' +
        '| F | F | T | T | T | F | T |\n\n' +
        'Only $\\neg p \\lor q$ matches the column T, F, T, T. In words: "if $p$ then $q$" means "either $p$ fails, or $q$ happens".',
      whyWrong: [
        null,
        'This negates the wrong letter: $p \\lor \\neg q$ is equivalent to $q \\to p$ (the converse), which is true in the T, F row where $p \\to q$ is false.',
        'This uses "and" instead of "or": $\\neg p \\land q$ is true only in the F, T row.',
        'This is the **inverse**, which is not equivalent: in the F, T row it is false while $p \\to q$ is true.',
      ],
      keyIdea: '$p \\to q \\equiv \\neg p \\lor q$: an implication is the same as "not the hypothesis, or the conclusion".',
    },
    check: {
      optionValues: ['TFTT', 'TTFT', 'FFTF', 'TTFT'],
      compute: () => tt2((p, q) => imp(p, q)),
    },
  },
  {
    id: 'propositional-logic-010',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'Which of the following is a **tautology** (true for every combination of truth values)?',
    options: ['$p \\to (p \\land q)$', '$(p \\lor q) \\to q$', '$(p \\to q) \\to p$', '$(p \\land q) \\to p$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Build the truth table. Rows are $(p, q)$ = TT, TF, FT, FF.\n\n' +
        '| $p$ | $q$ | $p \\to (p \\land q)$ | $(p \\lor q) \\to q$ | $(p \\to q) \\to p$ | $(p \\land q) \\to p$ |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| T | T | T | T | T | T |\n' +
        '| T | F | F | F | T | T |\n' +
        '| F | T | T | T | F | T |\n' +
        '| F | F | T | T | F | T |\n\n' +
        'Only $(p \\land q) \\to p$ is true in every row.\n\n' +
        'Quick reasoning: an implication can only fail when its left side is true. If $p \\land q$ is true then $p$ is certainly true, so it can never be true $\\to$ false.',
      whyWrong: [
        'Fails when $p$ is true and $q$ is false: $p$ is T but $p \\land q$ is F, giving T $\\to$ F, which is false.',
        'Fails when $p$ is true and $q$ is false: $p \\lor q$ is T but $q$ is F, giving T $\\to$ F, which is false.',
        'Fails whenever $p$ is false: $p \\to q$ is then (vacuously) T, giving T $\\to$ F, which is false.',
        null,
      ],
      keyIdea: 'A tautology is true in every row; to rule a statement out, find just one row where it is false.',
    },
    check: {
      optionValues: ['a', 'b', 'c', 'd'],
      compute: () =>
        uniqueWhere(
          [
            ['a', (p, q) => imp(p, p && q)],
            ['b', (p, q) => imp(p || q, q)],
            ['c', (p, q) => imp(imp(p, q), p)],
            ['d', (p, q) => imp(p && q, p)],
          ],
          'TTTT',
        ),
    },
  },
  {
    id: 'propositional-logic-011',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'In a truth table with rows in the order $(p, q)$ = (T, T), (T, F), (F, T), (F, F), which column gives $\\neg p \\leftrightarrow q$?',
    options: ['T, F, F, T', 'F, T, T, F', 'T, T, T, F', 'F, F, T, F'],
    correctIndex: 1,
    markScheme: {
      solution:
        'First work out $\\neg p$, then compare it with $q$. A biconditional is true when the two sides are the **same** (both T or both F).\n\n' +
        '| $p$ | $q$ | $\\neg p$ | $\\neg p \\leftrightarrow q$ |\n' +
        '| --- | --- | --- | --- |\n' +
        '| T | T | F | F (F vs T: different) |\n' +
        '| T | F | F | T (F vs F: same) |\n' +
        '| F | T | T | T (T vs T: same) |\n' +
        '| F | F | T | F (T vs F: different) |\n\n' +
        'The column is F, T, T, F. (Notice it is true exactly when $p$ and $q$ differ, so $\\neg p \\leftrightarrow q$ behaves like "exclusive or".)',
      whyWrong: [
        'This is the column of $p \\leftrightarrow q$: the negation on $p$ has been forgotten.',
        null,
        'This is the column of $\\neg p \\to q$: the two-way arrow has been treated as a one-way implication.',
        'This is the column of $\\neg p \\land q$: it treats the biconditional as "and", forgetting that it is also true when both sides are false.',
      ],
      keyIdea: 'A biconditional $a \\leftrightarrow b$ is true exactly when $a$ and $b$ have the same truth value, including when both are false.',
    },
    check: {
      optionValues: ['TFFT', 'FTTF', 'TTTF', 'FFTF'],
      compute: () => tt2((p, q) => iff(!p, q)),
    },
  },
  {
    id: 'propositional-logic-012',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'In Python, which condition always gives the same result as `not (x > 3 and y < 5)` for all integers `x` and `y`?',
    options: ['`x <= 3 and y >= 5`', '`x < 3 or y > 5`', '`x <= 3 or y >= 5`', '`x <= 3 or y < 5`'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Apply De Morgan\'s law: $\\neg(A \\land B) \\equiv \\neg A \\lor \\neg B$.\n\n' +
        '1. The `and` becomes `or`.\n' +
        '2. Negate each comparison. The opposite of `x > 3` is `x <= 3` (the value 3 itself makes `x > 3` false, so it belongs to the negation). The opposite of `y < 5` is `y >= 5`.\n\n' +
        'Result: `x <= 3 or y >= 5`.\n\n' +
        'Spot check with `x = 3`, `y = 5`: original `not (False and False)` is `True`; `3 <= 3 or 5 >= 5` is `True`. With `x = 4`, `y = 0`: original `not (True and True)` is `False`; `4 <= 3 or 0 >= 5` is `False`. They agree.',
      whyWrong: [
        'This negates both comparisons but keeps `and`. De Morgan\'s law turns `and` into `or`; for example `x = 0`, `y = 0` makes the original `True` but this `False`.',
        'This flips `and` to `or` but negates the comparisons wrongly: the opposite of `>` is `<=`, not `<`. With `x = 3`, `y = 5` the original is `True` but this is `False`.',
        null,
        'This negates only the first comparison. With `x = 4`, `y = 0` the original is `False` but this is `True`.',
      ],
      keyIdea: 'De Morgan in code: `not (A and B)` equals `not A or not B`, and the negation of `>` is `<=`.',
    },
    check: {
      optionValues: (() => {
        const grid = (f: (x: number, y: number) => boolean) => {
          let s = '';
          for (let x = -8; x <= 8; x++) for (let y = -8; y <= 8; y++) s += f(x, y) ? '1' : '0';
          return s;
        };
        return [
          grid((x, y) => x <= 3 && y >= 5),
          grid((x, y) => x < 3 || y > 5),
          grid((x, y) => x <= 3 || y >= 5),
          grid((x, y) => x <= 3 || y < 5),
        ];
      })(),
      compute: () => {
        let s = '';
        for (let x = -8; x <= 8; x++) for (let y = -8; y <= 8; y++) s += !(x > 3 && y < 5) ? '1' : '0';
        return s;
      },
    },
  },
  {
    id: 'propositional-logic-013',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'The truth table below shows the output of an unknown statement built from $p$ and $q$. Which statement is it?',
    table: {
      headers: ['$p$', '$q$', 'Output'],
      rows: [
        ['T', 'T', 'F'],
        ['T', 'F', 'T'],
        ['F', 'T', 'T'],
        ['F', 'F', 'T'],
      ],
    },
    options: ['$\\neg p \\land \\neg q$', '$p \\leftrightarrow \\neg q$', '$\\neg p \\to q$', '$\\neg p \\lor \\neg q$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The output is false only in the row where $p$ and $q$ are both true, so the statement means "not both": $\\neg(p \\land q)$. By De Morgan this is $\\neg p \\lor \\neg q$.\n\n' +
        'Check every option against the column F, T, T, T:\n\n' +
        '| $p$ | $q$ | $\\neg p \\land \\neg q$ | $p \\leftrightarrow \\neg q$ | $\\neg p \\to q$ | $\\neg p \\lor \\neg q$ |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| T | T | F | F | T | F |\n' +
        '| T | F | F | T | T | T |\n' +
        '| F | T | F | T | T | T |\n' +
        '| F | F | T | F | F | T |\n\n' +
        'Only $\\neg p \\lor \\neg q$ matches.',
      whyWrong: [
        'This is $\\neg(p \\lor q)$, true only when both are false. It comes from using "and" instead of "or" in De Morgan\'s law.',
        'This matches the first three rows but not the last: when both are false, $p \\leftrightarrow \\neg q$ compares F with T and gives F. Always check every row.',
        'This is equivalent to $p \\lor q$ (column T, T, T, F): it is false in the bottom row instead of the top row.',
        null,
      ],
      keyIdea: 'Read the rows where the output is false: a single false row at T, T means "not both", i.e. $\\neg p \\lor \\neg q$.',
    },
    check: {
      // columns of the four option formulas, recomputed from the formulas themselves
      optionValues: [
        tt2((p, q) => !p && !q),
        tt2((p, q) => iff(p, !q)),
        tt2((p, q) => imp(!p, q)),
        tt2((p, q) => !p || !q),
      ],
      compute: () =>
        [
          ['T', 'T', 'F'],
          ['T', 'F', 'T'],
          ['F', 'T', 'T'],
          ['F', 'F', 'T'],
        ]
          .map((r) => r[2])
          .join(''),
    },
  },
  {
    id: 'propositional-logic-014',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'What does this Python code print?',
    code: {
      lang: 'python',
      source: [
        'count = 0',
        'for p in [True, False]:',
        '    for q in [True, False]:',
        '        for r in [True, False]:',
        '            if (not p or q) and (q or r):',
        '                count += 1',
        'print(count)',
      ].join('\n'),
    },
    options: ['`5`', '`6`', '`7`', '`1`'],
    correctIndex: 0,
    markScheme: {
      solution:
        'The three loops visit all $2^3 = 8$ combinations. `not p or q` is the implication $p \\to q$ (because `not` binds tighter than `or`, it means `(not p) or q`). The code counts the rows where $(p \\to q) \\land (q \\lor r)$ is true.\n\n' +
        '| `p` | `q` | `r` | `not p or q` | `q or r` | both? | `count` |\n' +
        '| --- | --- | --- | --- | --- | --- | --- |\n' +
        '| T | T | T | T | T | yes | 1 |\n' +
        '| T | T | F | T | T | yes | 2 |\n' +
        '| T | F | T | F | T | no | 2 |\n' +
        '| T | F | F | F | F | no | 2 |\n' +
        '| F | T | T | T | T | yes | 3 |\n' +
        '| F | T | F | T | T | yes | 4 |\n' +
        '| F | F | T | T | T | yes | 5 |\n' +
        '| F | F | F | T | F | no | 5 |\n\n' +
        'The program prints `5`.',
      whyWrong: [
        null,
        'This counts the rows where `not p or q` is `True` (6 rows) and ignores the second condition `(q or r)`.',
        'This treats `and` as `or`: the only row where both brackets are `False` is `p = True, q = False, r = False`, so `or` would give 7.',
        'This reads `not p or q` as `not (p or q)`. In Python `not` applies only to `p`, so the condition is `(not p) or q`.',
      ],
      keyIdea: '`not p or q` is the implication $p \\to q$; count rows by building the 8-row truth table.',
    },
    check: {
      optionValues: [5, 6, 7, 1],
      compute: () => {
        let c = 0;
        for (const p of TF) for (const q of TF) for (const r of TF) if (imp(p, q) && (q || r)) c++;
        return c;
      },
    },
    python: { stdout: '5\n' },
  },

  // ================================================================ challenge
  {
    id: 'propositional-logic-015',
    subtopic: 'propositional-logic',
    difficulty: 'challenge',
    stem: 'Find the truth values of $p$, $q$ and $r$ that make **all four** of these statements true at the same time:\n\n$$p \\lor r, \\qquad p \\to q, \\qquad q \\to \\neg r, \\qquad \\neg q \\to p$$',
    options: [
      '$(p, q, r) = (\\text{F}, \\text{F}, \\text{T})$',
      '$(p, q, r) = (\\text{T}, \\text{F}, \\text{T})$',
      '$(p, q, r) = (\\text{T}, \\text{T}, \\text{F})$',
      '$(p, q, r) = (\\text{T}, \\text{T}, \\text{T})$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Step 1: find $q$.** Suppose $q$ were false. Then $\\neg q$ is true, so $\\neg q \\to p$ forces $p$ to be true. But then $p \\to q$ forces $q$ to be true, a contradiction. So $q$ is **true**.\n\n' +
        '**Step 2: find $r$.** $q$ is true, so $q \\to \\neg r$ forces $\\neg r$ to be true: $r$ is **false**.\n\n' +
        '**Step 3: find $p$.** $p \\lor r$ must be true and $r$ is false, so $p$ is **true**.\n\n' +
        '**Step 4: check all four** with $(p, q, r) = (\\text{T}, \\text{T}, \\text{F})$:\n\n' +
        '- $p \\lor r$: T or F = T\n' +
        '- $p \\to q$: T $\\to$ T = T\n' +
        '- $q \\to \\neg r$: T $\\to$ T = T\n' +
        '- $\\neg q \\to p$: F $\\to$ T = T\n\n' +
        'All four are true, and the steps show no other assignment works.',
      whyWrong: [
        'This satisfies the first three statements but not $\\neg q \\to p$: with $q$ false and $p$ false it is T $\\to$ F, which is false.',
        'This fails $p \\to q$: with $p$ true and $q$ false it is T $\\to$ F, which is false.',
        null,
        'This fails $q \\to \\neg r$: with $q$ true and $r$ true it is T $\\to$ F, which is false.',
      ],
      keyIdea: 'Use the implications to force values one at a time (try a value, follow the arrows, look for a contradiction), then plug the answer back into every statement.',
    },
    check: {
      optionValues: ['FFT', 'TFT', 'TTF', 'TTT'],
      compute: () => {
        const sols: string[] = [];
        for (const p of TF)
          for (const q of TF)
            for (const r of TF)
              if ((p || r) && imp(p, q) && imp(q, !r) && imp(!q, p)) sols.push([p, q, r].map((v) => (v ? 'T' : 'F')).join(''));
        return sols.join(',');
      },
    },
  },
  {
    id: 'propositional-logic-016',
    subtopic: 'propositional-logic',
    difficulty: 'challenge',
    stem: 'Which of the following is logically equivalent to $\\neg(p \\to q) \\lor (p \\land q)$?',
    options: ['$p \\land q$', '$p \\lor \\neg q$', '$p \\leftrightarrow q$', '$p$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Step 1.** Rewrite the implication: $p \\to q \\equiv \\neg p \\lor q$.\n\n' +
        '**Step 2.** Negate with De Morgan: $\\neg(\\neg p \\lor q) \\equiv \\neg\\neg p \\land \\neg q \\equiv p \\land \\neg q$.\n\n' +
        '**Step 3.** The whole statement is now $(p \\land \\neg q) \\lor (p \\land q)$.\n\n' +
        '**Step 4.** Factor out $p$ (distributive law): $p \\land (\\neg q \\lor q)$.\n\n' +
        '**Step 5.** $\\neg q \\lor q$ is always true, and $p \\land \\text{T} \\equiv p$.\n\n' +
        'So the statement is equivalent to $p$. Check with a truth table (rows TT, TF, FT, FF): $\\neg(p \\to q)$ is F, T, F, F and $p \\land q$ is T, F, F, F, so their OR is T, T, F, F, which is exactly the column of $p$.',
      whyWrong: [
        'This keeps only the second bracket, as if $\\neg(p \\to q)$ were always false. It is true in the row $p$ T, $q$ F.',
        'This comes from negating the implication as $\\neg p \\to \\neg q$ (the inverse, equivalent to $p \\lor \\neg q$). The negation of $p \\to q$ is $p \\land \\neg q$, not another implication.',
        'This comes from negating $p \\to q$ as $\\neg p \\land \\neg q$ (negating both parts). The correct negation is $p \\land \\neg q$: only the conclusion is negated.',
        null,
      ],
      keyIdea: '$\\neg(p \\to q) \\equiv p \\land \\neg q$; then use the distributive law and $q \\lor \\neg q \\equiv \\text{T}$ to simplify.',
    },
    check: {
      optionValues: ['TFFF', 'TTFT', 'TFFT', 'TTFF'],
      compute: () => tt2((p, q) => !imp(p, q) || (p && q)),
    },
  },
  {
    id: 'propositional-logic-017',
    subtopic: 'propositional-logic',
    difficulty: 'challenge',
    stem: 'A truth table is drawn for $(p \\to q) \\land (r \\to s)$ using all 16 combinations of $p$, $q$, $r$, $s$. In how many rows is the statement **true**?',
    options: ['$9$', '$6$', '$12$', '$15$'],
    correctIndex: 0,
    markScheme: {
      solution:
        '**Step 1.** $p \\to q$ involves only $p$ and $q$. It is false only for $(p, q) = (\\text{T}, \\text{F})$, so it is true for **3** of the 4 pairs $(p, q)$.\n\n' +
        '**Step 2.** In the same way $r \\to s$ is true for **3** of the 4 pairs $(r, s)$.\n\n' +
        '**Step 3.** The AND needs both to be true. The pairs $(p, q)$ and $(r, s)$ are chosen independently, so by the product rule the number of good rows is\n\n' +
        '$$3 \\times 3 = 9$$\n\n' +
        'Check: the total is $4 \\times 4 = 16$ rows, and $16 - 9 = 7$ rows have at least one implication false.',
      whyWrong: [
        null,
        'This adds the counts ($3 + 3$). Each of the 3 good $(p, q)$ pairs can combine with each of the 3 good $(r, s)$ pairs, so you multiply.',
        'This is $3 \\times 4$: it lets $(r, s)$ take all 4 values, ignoring the condition that $r \\to s$ must also be true.',
        'This treats the AND as an OR: then the statement would fail only when both implications fail ($1 \\times 1 = 1$ row), giving $16 - 1 = 15$.',
      ],
      keyIdea: 'For AND of statements on separate variables, multiply the numbers of true rows (product rule).',
    },
    check: {
      optionValues: [9, 6, 12, 15],
      compute: () => {
        let c = 0;
        for (const p of TF) for (const q of TF) for (const r of TF) for (const s of TF) if (imp(p, q) && imp(r, s)) c++;
        return c;
      },
    },
  },
  {
    id: 'propositional-logic-018',
    subtopic: 'propositional-logic',
    difficulty: 'challenge',
    stem: 'Which statement is the **contrapositive** of $(p \\land q) \\to r$?',
    options: [
      '$\\neg r \\to (\\neg p \\land \\neg q)$',
      '$r \\to (p \\land q)$',
      '$\\neg(p \\land q) \\to \\neg r$',
      '$\\neg r \\to (\\neg p \\lor \\neg q)$',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'The contrapositive of $A \\to B$ is $\\neg B \\to \\neg A$. Here $A = p \\land q$ and $B = r$.\n\n' +
        '**Step 1.** Swap and negate: $\\neg r \\to \\neg(p \\land q)$.\n\n' +
        '**Step 2.** Simplify the negated AND with De Morgan: $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$.\n\n' +
        'So the contrapositive is $\\neg r \\to (\\neg p \\lor \\neg q)$.\n\n' +
        'Check: the original is false only when $p$, $q$ are true and $r$ is false. The contrapositive is false only when $\\neg r$ is true and $\\neg p \\lor \\neg q$ is false, i.e. $r$ false and $p$, $q$ both true: the same single row, so they are equivalent.',
      whyWrong: [
        'This uses the wrong De Morgan law: $\\neg(p \\land q)$ is $\\neg p \\lor \\neg q$, not $\\neg p \\land \\neg q$. This version is false in extra rows such as $p$ T, $q$ F, $r$ F.',
        'This is the **converse** (the parts are swapped but not negated).',
        'This is the **inverse** (both parts negated but not swapped).',
        null,
      ],
      keyIdea: 'Contrapositive = swap and negate, then simplify the negation with De Morgan: $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$.',
    },
    check: {
      // 3-variable columns, rows TTT, TTF, TFT, TFF, FTT, FTF, FFT, FFF
      optionValues: ['TFTFTFTT', 'TTFTFTFT', 'TTFTFTFT', 'TFTTTTTT'],
      compute: () => tt3((p, q, r) => imp(p && q, r)),
    },
  },
  {
    id: 'propositional-logic-019',
    subtopic: 'propositional-logic',
    difficulty: 'challenge',
    stem: 'Which of the following is a **contradiction** (false for every combination of truth values)?',
    options: [
      '$(p \\to q) \\lor (p \\land \\neg q)$',
      '$(p \\lor q) \\land \\neg p$',
      '$(p \\to q) \\land (p \\land \\neg q)$',
      '$p \\land (q \\to \\neg p)$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Key fact: $p \\land \\neg q$ is exactly the negation of $p \\to q$ (an implication fails only when $p$ is true and $q$ is false).\n\n' +
        'So $(p \\to q) \\land (p \\land \\neg q)$ has the form $X \\land \\neg X$: a statement AND its own negation can never both be true. It is a contradiction.\n\n' +
        'Truth table (rows $(p, q)$ = TT, TF, FT, FF):\n\n' +
        '| $p$ | $q$ | $(p \\to q) \\lor (p \\land \\neg q)$ | $(p \\lor q) \\land \\neg p$ | $(p \\to q) \\land (p \\land \\neg q)$ | $p \\land (q \\to \\neg p)$ |\n' +
        '| --- | --- | --- | --- | --- | --- |\n' +
        '| T | T | T | F | F | F |\n' +
        '| T | F | T | F | F | T |\n' +
        '| F | T | T | T | F | F |\n' +
        '| F | F | T | F | F | F |\n\n' +
        'Only $(p \\to q) \\land (p \\land \\neg q)$ is false in every row.',
      whyWrong: [
        'This has the form $X \\lor \\neg X$, so it is true in every row: a **tautology**, the opposite of a contradiction.',
        'This is true when $p$ is false and $q$ is true, so it is a contingency, not a contradiction.',
        null,
        'This is true when $p$ is true and $q$ is false ($q \\to \\neg p$ is then F $\\to$ F, which is true), so it is a contingency.',
      ],
      keyIdea: 'A statement ANDed with its own negation is a contradiction; ORed with its negation it is a tautology.',
    },
    check: {
      optionValues: ['a', 'b', 'c', 'd'],
      compute: () =>
        uniqueWhere(
          [
            ['a', (p, q) => imp(p, q) || (p && !q)],
            ['b', (p, q) => (p || q) && !p],
            ['c', (p, q) => imp(p, q) && p && !q],
            ['d', (p, q) => p && imp(q, !p)],
          ],
          'FFFF',
        ),
    },
  },
];
