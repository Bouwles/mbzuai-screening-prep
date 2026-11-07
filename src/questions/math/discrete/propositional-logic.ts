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
      asking: 'Which sentence makes a claim that must be either true or false?',
      solution:
        'A **proposition** is a sentence that makes a claim, so you can answer "true" or "false" to it. A false claim still counts, because it still has a truth value.\n\n' +
        'Test each sentence by asking "is this true or false?":\n\n| Sentence | What kind of sentence | True or false? |\n|---|---|---|\n| "Close the door." | A command | Can\'t say |\n| "Is it raining?" | A question | Can\'t say |\n| "$x + 2 = 5$" | Depends on the unknown $x$ | Can\'t say until $x$ is known |\n| "7 is an even number." | A claim | False |',
      conclusion: 'It is a false claim, but it is a claim, so the proposition is "7 is an even number."',
      whyWrong: [
        'A command (instruction) cannot be true or false, so it is not a proposition.',
        'A question asks something rather than claiming something, so it has no truth value.',
        null,
        'This is an open sentence: its truth depends on the value of $x$ (true only for $x = 3$), so on its own it is not a proposition.',
      ],
      keyIdea: 'Commands, questions and sentences with an unknown variable are not propositions. Try putting "it is true that" in front. If the result makes sense and has a definite truth value, the sentence is a proposition.',
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
      asking: 'With $p$ true and $q$ false, which combined statement comes out true?',
      solution:
        'Each symbol joins two statements. Here is what each one means:\n\n| Symbol | Read it as | True when |\n|---|---|---|\n| $\\land$ | and | both sides are true |\n| $\\lor$ | or | at least one side is true |\n| $\\to$ | if ... then | any case except true then false |\n| $\\leftrightarrow$ | if and only if | both sides match |\n\n' +
        'Now put in $p$ true and $q$ false:\n\n| Statement | Working | Result |\n|---|---|---|\n| $p \\land q$ | T and F: not both true | False |\n| $p \\to q$ | T then F: the one bad case | False |\n| $p \\leftrightarrow q$ | T and F don\'t match | False |\n| $p \\lor q$ | T or F: one side is true | True |',
      conclusion: 'One true side is enough for "or", so the true statement is $p \\lor q$.',
      whyWrong: [
        null,
        'AND needs **both** parts to be true; here $q$ is false, so $p \\land q$ is false.',
        'True then false is the one case where an implication is false.',
        'A biconditional is true only when both sides match; here one is true and one is false, so it is false.',
      ],
      keyIdea: 'Replace each letter with T or F, then use the symbol\'s meaning: $\\land$ needs both true, $\\lor$ needs one true, $\\to$ fails only for T then F, and $\\leftrightarrow$ needs a match.',
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
      asking: 'How many different true and false combinations can three statements have?',
      solution:
        'A truth table has one row for each possible combination of true and false values.\n\n' +
        'Each letter has 2 possible values, T or F. The three letters are chosen separately, so multiply the choices: $2 \\times 2 \\times 2 = 2^3 = 8$.',
      conclusion: 'Three letters with 2 values each give $2^3$ combinations, so the table has $8$ rows.',
      whyWrong: [
        null,
        'This is $2 \\times 3$: it multiplies the 2 truth values by the 3 variables instead of multiplying 2 by itself 3 times.',
        'This is $3^2$: the base and the power are swapped. There are 2 truth values and 3 variables, so it is $2^3$.',
        'This gives one row per variable, but each row must be a whole combination of values for all three variables.',
      ],
      keyIdea: 'A truth table with $n$ different letters has $2^n$ rows. Count only the different letters, however many times each appears. For example, 2 letters need 4 rows and 4 letters need 16.',
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
      asking: 'When is the promise "if $p$, then $q$" broken?',
      solution:
        'Think of $p \\to q$ as a promise: "If it rains, I will bring an umbrella." Here $p$ is the "if" part and $q$ is the "then" part.\n\n' +
        'Check all four cases:\n\n| Rains ($p$) | Umbrella ($q$) | Promise kept? |\n|---|---|---|\n| True | True | Yes |\n| True | False | No |\n| False | True | Yes: it didn\'t rain, so nothing was broken |\n| False | False | Yes: it didn\'t rain, so nothing was broken |',
      conclusion: 'The promise fails only if the "if" part happens and the "then" part doesn\'t, which is when $p$ is true and $q$ is false.',
      whyWrong: [
        'When $p$ is false the promise was never tested, so the implication counts as true. False then true gives true, not false.',
        null,
        'Both false is another untested case: the "if" part never happened, so nothing was broken and the implication is true.',
        'True then true means the promise was kept, so the implication is true.',
      ],
      keyIdea: '$p \\to q$ is false in one row only: T then F. Every other row is true. So to test an implication, ask whether the first part is true while the second is false.',
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
      asking: 'What statement is true exactly when "sunny and warm" is false?',
      solution:
        'The **negation** of a statement is its exact opposite. It must be true whenever the original is false, and false whenever the original is true.\n\n' +
        'An "and" statement needs both parts to be true. So it is false as soon as one part fails: either it isn\'t sunny, or it isn\'t warm, or both.\n\n' +
        'This is **De Morgan\'s law**: to negate an "and", negate each part and change "and" into "or". Here that gives "not sunny or not warm".',
      conclusion: 'A sunny but cold day makes the original false and this statement true, as a negation must. So the negation is: It is not sunny or it is not warm.',
      whyWrong: [
        'This negates both parts but keeps "and". De Morgan\'s law also flips "and" to "or". On a sunny but cold day the original statement is false, so its negation should be true, but this version is also false.',
        'This flips "and" to "or" but forgets to negate the two parts.',
        'This negates only the first part; the negation must apply to both parts and turn "and" into "or".',
        null,
      ],
      keyIdea: 'To negate "A and B", write "not A or not B". To negate "A or B", write "not A and not B". Negate each part and swap the joining word.',
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
      asking: 'What do you get when you swap the two sides of $\\neg p \\to q$?',
      solution:
        'An implication has a left part and a right part. The symbol $\\neg$ means "not", so the left part here is $\\neg p$ and the right part is $q$.\n\n' +
        'The **converse** swaps the two parts and changes nothing else. There is no extra negating, and $\\neg p$ moves as one block.\n\n' +
        'Put $q$ on the left and the block $\\neg p$ on the right: $q \\to \\neg p$.',
      conclusion: 'Swapping the two parts and keeping each exactly as written gives $q \\to \\neg p$.',
      whyWrong: [
        'This is the **contrapositive**: swap and negate both parts ($\\neg q \\to \\neg\\neg p$, and $\\neg\\neg p = p$).',
        null,
        'This is the **inverse**: both parts are negated but not swapped ($\\neg\\neg p \\to \\neg q$, which is $p \\to \\neg q$).',
        'This swaps the parts but drops the negation on $p$. The hypothesis was $\\neg p$, so the whole of $\\neg p$ must move.',
      ],
      keyIdea: 'For $A \\to B$: the converse swaps, giving $B \\to A$. The inverse negates, giving $\\neg A \\to \\neg B$. The contrapositive does both, giving $\\neg B \\to \\neg A$. A part that already has $\\neg$ moves as a whole block.',
    },
  },

  // ================================================================ exam
  {
    id: 'propositional-logic-007',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'Which statement is the **contrapositive** of "If a number is divisible by 6, then it is divisible by 3."?',
    options: [
      'If a number is divisible by 3, then it is divisible by 6.',
      'If a number is not divisible by 6, then it is not divisible by 3.',
      'If a number is not divisible by 3, then it is not divisible by 6.',
      'A number is divisible by 6 and it is not divisible by 3.',
    ],
    correctIndex: 2,
    markScheme: {
      asking: 'What is the "swap and negate" version of this if-then sentence?',
      solution:
        'Name the parts. The "if" part $p$ is "divisible by 6". The "then" part $q$ is "divisible by 3".\n\n' +
        'The **contrapositive** of "if $p$ then $q$" is "if not $q$, then not $p$". You do two things: swap the parts, and put "not" on both.\n\n' +
        'Swapping gives "if divisible by 3, then divisible by 6". Putting "not" on both gives "if not divisible by 3, then not divisible by 6".',
      conclusion: 'Every multiple of 6 is a multiple of 3, so failing the test for 3 means failing for 6 too. The contrapositive is: If a number is not divisible by 3, then it is not divisible by 6.',
      whyWrong: [
        'This is the **converse** ($q \\to p$): the parts are swapped but not negated. It is false, e.g. 9 is divisible by 3 but not by 6.',
        'This is the **inverse** ($\\neg p \\to \\neg q$): both parts are negated but not swapped. It is false, e.g. 9 is not divisible by 6 but is divisible by 3.',
        null,
        'This is the **negation** of the statement ($p \\land \\neg q$), which says the implication fails; it is not a rewritten implication at all.',
      ],
      keyIdea: 'Contrapositive means swap and negate: $p \\to q$ ("if $p$ then $q$") becomes $\\neg q \\to \\neg p$, where $\\neg$ means "not". It always has the same truth value as the original. The converse (swap only) and the inverse (negate only) do not, which makes them the usual traps.',
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
      asking: 'If $p \\to q$ is true and $q$ is false, is $p$ true or false?',
      solution:
        'Start with what an implication rules out: $p \\to q$ is false in only one case, when $p$ is true and $q$ is false.\n\n' +
        'We are told $q$ is false, so only the rows with $q$ false matter. There are two of them, one for each value of $p$.\n\n' +
        'Check those two rows against the fact that $p \\to q$ is true:\n\n| $p$ | $q$ | $p \\to q$ | Fits what we are told? |\n|---|---|---|---|\n| T | F | F | No: we were told it is true |\n| F | F | T | Yes |',
      conclusion: 'Only one row fits both facts, and in that row $p$ is false, so $p$ must be false.',
      whyWrong: [
        'If $p$ were true, the implication would be true $\\to$ false, which is false, contradicting what we were told.',
        null,
        'That would be the case if $q$ were **true** (both T,T and F,T make $p \\to q$ true). With $q$ false only one row survives, so $p$ is forced.',
        'The situation is possible: $p$ false and $q$ false makes $p \\to q$ true, because its first part is false.',
      ],
      keyIdea: 'From $p \\to q$ and "not $q$", you can always conclude "not $p$". For any question like this, write the truth table, cross out the rows that break the given facts, and read what is left.',
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
      asking: 'Which statement has the same truth value as $p \\to q$ in every row?',
      solution:
        '**Logically equivalent** means two statements match in every row of the truth table. $p \\to q$ is false in only one row: $p$ true and $q$ false.\n\n' +
        'So we want a statement that is false only in that row. An "or" ($\\lor$) is false only when both of its sides are false.\n\n' +
        'We need two sides that are both false when $p$ is true and $q$ is false. The symbol $\\neg$ means "not", so $\\neg p$ is false when $p$ is true. And $q$ is false when $q$ is false.\n\n' +
        'Join those two sides with "or" and check all four rows:\n\n| $p$ | $q$ | $\\neg p$ | $\\neg p \\lor q$ | $p \\to q$ |\n|---|---|---|---|---|\n| T | T | F | T | T |\n| T | F | F | F | F |\n| F | T | T | T | T |\n| F | F | T | T | T |',
      conclusion: 'The last two columns match in every row, so $p \\to q$ is equivalent to $\\neg p \\lor q$.',
      whyWrong: [
        null,
        'This negates the wrong letter: $p \\lor \\neg q$ is equivalent to $q \\to p$ (the converse), which is true in the T, F row where $p \\to q$ is false.',
        'This uses "and" instead of "or": $\\neg p \\land q$ is true only in the F, T row.',
        'This is the **inverse**, which is not equivalent: in the F, T row it is false while $p \\to q$ is true.',
      ],
      keyIdea: 'Keep this fact handy: $p \\to q$ always matches $\\neg p \\lor q$. To test any "equivalent" question, write a truth table for both statements. One row that differs rules the statement out.',
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
      asking: 'Which statement can never come out false?',
      solution:
        'A **tautology** is true in every row. An implication $A \\to B$ is false only when $A$ is true and $B$ is false. So for each option, we hunt for values that make the left side true and the right side false.\n\n' +
        'Three options can be broken. Remember $\\land$ means "and" (both true) and $\\lor$ means "or" (at least one true):\n\n| Statement | Try these values | Left side | Right side | Result |\n|---|---|---|---|---|\n| $p \\to (p \\land q)$ | $p$ T, $q$ F | T | F | False |\n| $(p \\lor q) \\to q$ | $p$ T, $q$ F | T | F | False |\n| $(p \\to q) \\to p$ | $p$ F, $q$ F | T | F | False |\n\n' +
        'Now try $(p \\land q) \\to p$. To make the left side true, both $p$ and $q$ must be true. But then the right side, $p$, is true as well. So "true then false" can never happen here.',
      conclusion: 'If $p$ and $q$ are both true then $p$ is true, so the statement that never fails is $(p \\land q) \\to p$.',
      whyWrong: [
        'Fails when $p$ is true and $q$ is false: $p$ is T but $p \\land q$ is F, giving T $\\to$ F, which is false.',
        'Fails when $p$ is true and $q$ is false: $p \\lor q$ is T but $q$ is F, giving T $\\to$ F, which is false.',
        'Fails whenever $p$ is false: $p \\to q$ is then T, giving T $\\to$ F, which is false.',
        null,
      ],
      keyIdea: 'To test an implication for a tautology, try to make the left side true and the right side false. If you can, it isn\'t a tautology. If making the left true always makes the right true, it is.',
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
      asking: 'What are the four truth values of $\\neg p \\leftrightarrow q$?',
      solution:
        '$\\neg p$ means "not $p$", so it is the opposite of $p$ in every row. The symbol $\\leftrightarrow$ means "if and only if": it gives T when its two sides match and F when they differ.\n\n' +
        'Build the table one column at a time. First write $\\neg p$, then compare it with $q$:\n\n| $p$ | $q$ | $\\neg p$ | Do $\\neg p$ and $q$ match? | $\\neg p \\leftrightarrow q$ |\n|---|---|---|---|---|\n| T | T | F | No | F |\n| T | F | F | Yes | T |\n| F | T | T | Yes | T |\n| F | F | T | No | F |',
      conclusion: 'Reading down the last column gives F, T, T, F.',
      whyWrong: [
        'This is the column of $p \\leftrightarrow q$: the negation on $p$ has been forgotten.',
        null,
        'This is the column of $\\neg p \\to q$: the two-way arrow has been treated as a one-way implication.',
        'This is the column of $\\neg p \\land q$: it treats the biconditional as "and", forgetting that it is also true when both sides are false.',
      ],
      keyIdea: 'Add a helper column for each part of the statement, then combine the columns. For $\\leftrightarrow$, ask only "do the two columns match?". A $\\neg$ flips each value.',
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
    stem: 'Which condition always gives the same result as `not (x > 3 and y < 5)` for all integers `x` and `y`?',
    options: ['`x <= 3 and y >= 5`', '`x < 3 or y > 5`', '`x <= 3 or y >= 5`', '`x <= 3 or y < 5`'],
    correctIndex: 2,
    markScheme: {
      asking: 'How can `not (x > 3 and y < 5)` be rewritten without the `not` in front?',
      solution:
        '`not (A and B)` is true when `A and B` is false. An `and` is false as soon as one part is false. So it becomes `(not A) or (not B)`. This is **De Morgan\'s law**.\n\n' +
        'Negate the first part. The opposite of `x > 3` is `x <= 3`. The equals sign matters: when `x` is exactly 3, `x > 3` is false, so its opposite has to be true.\n\n' +
        'Negate the second part. The opposite of `y < 5` is `y >= 5`, for the same reason: `y = 5` must be included.\n\n' +
        'Join the two negated parts with `or`: `x <= 3 or y >= 5`.',
      conclusion: 'De Morgan\'s law turns `and` into `or` and flips each comparison, giving `x <= 3 or y >= 5`.',
      whyWrong: [
        'This negates both comparisons but keeps `and`. De Morgan\'s law turns `and` into `or`; for example `x = 0`, `y = 0` makes the original true but this false.',
        'This flips `and` to `or` but negates the comparisons wrongly: the opposite of `>` is `<=`, not `<`. With `x = 3`, `y = 5` the original is true but this is false.',
        null,
        'This negates only the first comparison. With `x = 4`, `y = 0` the original is false but this is true.',
      ],
      keyIdea: 'To remove a `not` from brackets, swap `and` with `or`, then flip each comparison: `>` becomes `<=`, `<` becomes `>=`, and `==` becomes `!=`. Test with boundary values such as `x = 3` and `y = 5`.',
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
      asking: 'Which statement is false only when $p$ and $q$ are both true?',
      solution:
        'Look at the Output column. It is F in the top row, where $p$ and $q$ are both true, and T in the other three rows.\n\n' +
        'An "or" statement ($\\lor$) is false in just one row: when both of its sides are false. So this looks like an "or" whose two sides are both false when $p$ and $q$ are true.\n\n' +
        'The statement $\\neg p$ (not $p$) is false when $p$ is true, and $\\neg q$ is false when $q$ is true. So those are the two sides we need.\n\n' +
        'Join them with "or" and check every row:\n\n| $p$ | $q$ | $\\neg p$ | $\\neg q$ | $\\neg p \\lor \\neg q$ | Output |\n|---|---|---|---|---|---|\n| T | T | F | F | F | F |\n| T | F | F | T | T | T |\n| F | T | T | F | T | T |\n| F | F | T | T | T | T |',
      conclusion: 'Its column F, T, T, T matches the Output column in every row, so the statement is $\\neg p \\lor \\neg q$.',
      whyWrong: [
        'This is $\\neg(p \\lor q)$, true only when both are false. It comes from using "and" instead of "or" in De Morgan\'s law.',
        'This matches the first three rows but not the last: when both are false, $p \\leftrightarrow \\neg q$ compares F with T and gives F. Always check every row.',
        'This is equivalent to $p \\lor q$ (column T, T, T, F): it is false in the bottom row instead of the top row.',
        null,
      ],
      keyIdea: 'Look for the odd row out. A single F suggests an "or" built to be false in that row. A single T suggests an "and" built to be true in that row. Then check every row, since a rule can fit three rows and fail the fourth.',
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
    stem: 'In how many of the 8 rows of its truth table is $(p \\to q) \\land (q \\lor r)$ **true**?',
    options: ['$5$', '$6$', '$7$', '$1$'],
    correctIndex: 0,
    markScheme: {
      asking: 'In how many rows are both brackets true at the same time?',
      solution:
        'With three letters there are $2^3 = 8$ rows. The $\\land$ in the middle means "and", so a row counts only when both brackets are true.\n\n' +
        'Here is what each bracket means. $p \\to q$ is false only when $p$ is T and $q$ is F. $q \\lor r$ means "or", and it is false only when $q$ and $r$ are both F.\n\n' +
        'Fill in a column for each bracket, then compare them:\n\n| $p$ | $q$ | $r$ | $p \\to q$ | $q \\lor r$ | Both true? |\n|---|---|---|---|---|---|\n| T | T | T | T | T | Yes |\n| T | T | F | T | T | Yes |\n| T | F | T | F | T | No |\n| T | F | F | F | F | No |\n| F | T | T | T | T | Yes |\n| F | T | F | T | T | Yes |\n| F | F | T | T | T | Yes |\n| F | F | F | T | F | No |\n\n' +
        'Count the rows marked Yes: there are 5 of them.',
      conclusion: 'Five of the eight rows make both brackets true, so the answer is $5$.',
      whyWrong: [
        null,
        'This counts the rows where $p \\to q$ is true (6 rows) and ignores the second bracket.',
        'This treats $\\land$ as $\\lor$: the only row where both brackets are false is $p$ T, $q$ F, $r$ F, so "or" would give 7.',
        'This replaces $p \\to q$ by $\\neg(p \\lor q)$, which is true only when $p$ and $q$ are both false. The implication is $\\neg p \\lor q$.',
      ],
      keyIdea: 'For a compound statement, draw all $2^n$ rows with one helper column per bracket, then combine the helper columns and count. Writing the columns down avoids slips from working in your head.',
    },
    check: {
      optionValues: [5, 6, 7, 1],
      compute: () => {
        let c = 0;
        for (const p of TF) for (const q of TF) for (const r of TF) if (imp(p, q) && (q || r)) c++;
        return c;
      },
    },
  },
  {
    id: 'propositional-logic-018',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'Which statement is the **contrapositive** of $(p \\land q) \\to r$?',
    options: [
      '$\\neg r \\to (\\neg p \\land \\neg q)$',
      '$r \\to (p \\land q)$',
      '$\\neg(p \\land q) \\to \\neg r$',
      '$\\neg r \\to (\\neg p \\lor \\neg q)$',
    ],
    correctIndex: 3,
    markScheme: {
      asking: 'What is the "swap and negate" form of $(p \\land q) \\to r$?',
      solution:
        'The **contrapositive** of $A \\to B$ ("if $A$ then $B$") is $\\neg B \\to \\neg A$: swap the two parts and put "not" ($\\neg$) on both. Here $A$ is the whole bracket $p \\land q$, and $B$ is $r$.\n\n' +
        'Substituting gives $\\neg r \\to \\neg(p \\land q)$.\n\n' +
        'Now simplify $\\neg(p \\land q)$. An "and" is false when at least one part is false, so $\\neg(p \\land q)$ means $\\neg p \\lor \\neg q$, where $\\land$ means "and" and $\\lor$ means "or". This is De Morgan\'s law: "and" turns into "or".\n\n' +
        'Put that into the right side: $\\neg r \\to (\\neg p \\lor \\neg q)$.',
      conclusion: 'Swapping and negating, then using De Morgan\'s law on the bracket, gives $\\neg r \\to (\\neg p \\lor \\neg q)$.',
      whyWrong: [
        'This uses the wrong De Morgan law: $\\neg(p \\land q)$ is $\\neg p \\lor \\neg q$, not $\\neg p \\land \\neg q$. This version is false in extra rows such as $p$ T, $q$ F, $r$ F.',
        'This is the **converse** (the parts are swapped but not negated).',
        'This is the **inverse** (both parts negated but not swapped).',
        null,
      ],
      keyIdea: 'Treat a bracket as one block and turn $A \\to B$ into $\\neg B \\to \\neg A$. Then simplify with De Morgan: $\\neg(p \\land q)$ is $\\neg p \\lor \\neg q$, and $\\neg(p \\lor q)$ is $\\neg p \\land \\neg q$.',
    },
    check: {
      // 3-variable columns, rows TTT, TTF, TFT, TFF, FTT, FTF, FFT, FFF
      optionValues: ['TFTFTFTT', 'TTFTFTFT', 'TTFTFTFT', 'TFTTTTTT'],
      compute: () => tt3((p, q, r) => imp(p && q, r)),
    },
  },
  {
    id: 'propositional-logic-020',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'A statement that is **false** in every row of its truth table is called a:',
    options: ['contradiction', 'tautology', 'contingency', 'converse'],
    correctIndex: 0,
    markScheme: {
      asking: 'What do we call a statement that can never be true?',
      solution:
        'Statements are sorted by how the last column of their truth table looks. All T is called a **tautology**. A mix of T and F is called a **contingency**.\n\n' +
        'All F is called a **contradiction**. A tiny example is $p \\land \\neg p$, which says "it is raining and it is not raining". That can never be true.',
      conclusion: 'A statement that is false in every row is a contradiction.',
      whyWrong: [
        null,
        'A tautology is the opposite: it is true in every row.',
        'A contingency is true in some rows and false in others.',
        'A converse is the swapped form $q \\to p$ of an implication, not a type of truth table.',
      ],
      keyIdea: 'Look at the final column of the truth table. All T means tautology, all F means contradiction, and a mix means contingency.',
    },
  },
  {
    id: 'propositional-logic-021',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'The **disjunction** of $p$ and $q$ is written:',
    options: ['$p \\lor q$', '$p \\land q$', '$p \\to q$', '$p \\leftrightarrow q$'],
    correctIndex: 0,
    markScheme: {
      asking: 'Which symbol is used for "or"?',
      solution:
        '**Disjunction** is the formal name for "or": $p$ or $q$, or both. It is true when at least one part is true.\n\n' +
        'The symbol for "or" is $\\lor$, which looks like a small v. So the disjunction of $p$ and $q$ is $p \\lor q$.',
      conclusion: 'Disjunction means "or", and "or" is written with $\\lor$, giving $p \\lor q$.',
      whyWrong: [
        null,
        'This is the **conjunction** ("and"), which is true only when both parts are true.',
        'This is the **implication** ("if $p$ then $q$").',
        'This is the **biconditional** ("$p$ if and only if $q$").',
      ],
      keyIdea: 'Match each name to its word: conjunction is "and" ($\\land$), disjunction is "or" ($\\lor$), implication is "if then" ($\\to$), and biconditional is "if and only if" ($\\leftrightarrow$).',
    },
  },
  {
    id: 'propositional-logic-022',
    subtopic: 'propositional-logic',
    difficulty: 'foundation',
    stem: 'The statement $p \\leftrightarrow q$ is true exactly when:',
    options: ['$p$ and $q$ have the same truth value', '$p$ and $q$ have different truth values', '$p$ is true', 'at least one of $p$, $q$ is true'],
    correctIndex: 0,
    markScheme: {
      asking: 'When does "$p$ if and only if $q$" come out true?',
      solution:
        '$p \\leftrightarrow q$ is read "$p$ if and only if $q$". It means $p$ and $q$ stand or fall together.\n\n' +
        'Here is the full table. It is true in the rows where the two letters match, and that includes both being false:\n\n| $p$ | $q$ | $p \\leftrightarrow q$ |\n|---|---|---|\n| T | T | T |\n| T | F | F |\n| F | T | F |\n| F | F | T |',
      conclusion: 'The true rows are T, T and F, F, so the statement is true exactly when $p$ and $q$ have the same truth value.',
      whyWrong: [
        null,
        'This describes the negation of the biconditional (exclusive or), which is true when the values differ.',
        'The value of $q$ matters as well: with $p$ true and $q$ false the biconditional is false.',
        'This describes $p \\lor q$. A biconditional is also true when both are false, and false when just one is true.',
      ],
      keyIdea: 'Read $\\leftrightarrow$ as "these two match". Compare the two sides: the same value gives T, and different values give F. Both false still counts as a match.',
    },
    check: {
      // truth-table columns, rows TT, TF, FT, FF
      optionValues: [tt2((p, q) => p === q), tt2((p, q) => p !== q), tt2((p) => p), tt2((p, q) => p || q)],
      compute: () => tt2((p, q) => iff(p, q)),
    },
  },
  {
    id: 'propositional-logic-023',
    subtopic: 'propositional-logic',
    difficulty: 'exam',
    stem: 'Which statement is **logically equivalent** to $\\neg(p \\lor \\neg q)$?',
    options: ['$\\neg p \\land q$', '$\\neg p \\lor q$', '$\\neg p \\land \\neg q$', '$p \\land \\neg q$'],
    correctIndex: 0,
    markScheme: {
      asking: 'What does $\\neg(p \\lor \\neg q)$ become once the $\\neg$ outside the bracket is removed?',
      solution:
        '$\\neg$ means "not", and the $\\neg$ outside the bracket applies to everything inside. De Morgan\'s law says $\\neg(A \\lor B)$ is $\\neg A \\land \\neg B$: negate each part and swap "or" for "and".\n\n' +
        'Here $A$ is $p$ and $B$ is $\\neg q$. Substituting gives $\\neg p \\land \\neg(\\neg q)$.\n\n' +
        'Two "not"s cancel: "not not $q$" means the same as $q$. So $\\neg(\\neg q)$ is $q$.\n\n' +
        'Put that back in: $\\neg p \\land q$.',
      conclusion: 'De Morgan\'s law and cancelling the double negation together give $\\neg p \\land q$.',
      whyWrong: [
        null,
        'This negates each part but keeps $\\lor$. De Morgan\'s law also swaps $\\lor$ for $\\land$.',
        'This forgets that $q$ already carried a $\\neg$: negating $\\neg q$ gives $q$, not $\\neg q$.',
        'This swaps the connective but leaves the two parts unchanged. Each part must be negated as well.',
      ],
      keyIdea: 'Move a $\\neg$ into a bracket in three moves: negate each part, swap $\\lor$ with $\\land$, then cancel any double negation.',
    },
    check: {
      optionValues: [tt2((p, q) => !p && q), tt2((p, q) => !p || q), tt2((p, q) => !p && !q), tt2((p, q) => p && !q)],
      compute: () => tt2((p, q) => !(p || !q)),
    },
  },
];
