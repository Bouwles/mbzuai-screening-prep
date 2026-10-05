import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'boolean-logic',
  know:
    '### True and false as 1 and 0\n\n' +
    'Boolean logic works with only two values: TRUE and FALSE, usually written **1** and **0**. A Boolean expression combines inputs (like $A$, $B$, $C$) with a few operators, and its output is always 1 or 0. This is exactly how computer chips and `if` conditions work.\n\n' +
    '### The basic operators\n\n' +
    '| Operator | Symbols | Output is 1 when... |\n' +
    '| --- | --- | --- |\n' +
    '| NOT | $\\neg A$ (also written $\\overline{A}$) | $A$ is 0 (it flips the value) |\n' +
    '| AND | $A \\land B$ (also $A \\cdot B$) | **both** inputs are 1 |\n' +
    '| OR | $A \\lor B$ | **at least one** input is 1 (including both) |\n' +
    '| XOR | $A \\oplus B$ | the inputs are **different** |\n' +
    '| NAND | NOT AND | not both inputs are 1 (0 only for 1, 1) |\n' +
    '| NOR | NOT OR | both inputs are 0 |\n\n' +
    'The full truth tables for two inputs:\n\n' +
    '| $A$ | $B$ | AND | OR | XOR | NAND | NOR |\n' +
    '| --- | --- | --- | --- | --- | --- | --- |\n' +
    '| 0 | 0 | 0 | 0 | 0 | 1 | 1 |\n' +
    '| 0 | 1 | 0 | 1 | 1 | 1 | 0 |\n' +
    '| 1 | 0 | 0 | 1 | 1 | 1 | 0 |\n' +
    '| 1 | 1 | 1 | 1 | 0 | 0 | 0 |\n\n' +
    'Notice NAND is just AND flipped, and NOR is OR flipped. The big trap is OR versus XOR: in everyday English "or" often means "one or the other but not both" (that is XOR), but in logic OR is also true when both are true.\n\n' +
    '### Evaluating an expression\n\n' +
    'Substitute the values and work in this order: **brackets first, then NOT, then AND, then OR** (like BIDMAS, where NOT is like a minus sign, AND like multiplying and OR like adding). For $A = 1$, $B = 0$, $C = 1$:\n\n' +
    '$$\\neg A \\lor (B \\lor C) = 0 \\lor (0 \\lor 1) = 0 \\lor 1 = 1$$\n\n' +
    '### Truth tables\n\n' +
    'A truth table lists **every** combination of inputs. With $n$ inputs there are $2^n$ rows: 4 rows for 2 inputs, 8 rows for 3 inputs. List rows in binary counting order (000, 001, 010, ..., 111) so you never miss one. For a complicated expression, add a column for each part (NOTs, then each bracket) and build up to the final output one column at a time.\n\n' +
    '**Counting shortcut:** an OR is 0 only when every input is 0; an AND is 1 only when every input is 1. So "how many rows give 1" is often fastest as "8 minus the rows that give 0".\n\n' +
    '### Logic gate circuits\n\n' +
    'A circuit is just an expression drawn as gates. Translate it **gate by gate**, starting at the inputs: if $A$ and $B$ enter an AND gate whose output goes with $C$ into an OR gate and then a NOT gate, the output is $\\neg((A \\land B) \\lor C)$. Two useful facts: a NAND (or NOR) gate with both inputs tied together is a NOT gate, and every other gate can be built from NAND gates alone.\n\n' +
    "### De Morgan's laws\n\n" +
    'To push a NOT inside a bracket, **negate every part and swap AND with OR**:\n\n' +
    '$$\\neg(A \\land B) = \\neg A \\lor \\neg B \\qquad \\neg(A \\lor B) = \\neg A \\land \\neg B$$\n\n' +
    'In words: "not (rich and famous)" means "not rich, or not famous". Two NOTs cancel: $\\neg\\neg A = A$.\n\n' +
    '### Simplifying and equivalence\n\n' +
    'Two expressions are **logically equivalent** if they give the same output in every row of the truth table. You can prove it with a truth table, or simplify using the laws in the formula list. The most useful ones: $A \\lor \\neg A = 1$, $A \\land \\neg A = 0$, $A \\land 1 = A$, $A \\lor 0 = A$, factorising $(A \\land B) \\lor (A \\land C) = A \\land (B \\lor C)$, and absorption $A \\lor (A \\land B) = A$. To show two expressions are **not** equivalent you need only **one** row where they differ.\n\n' +
    '### Boolean logic in Python\n\n' +
    'Python writes the operators as words: `and`, `or`, `not`. `!=` on two bools acts as XOR (`^` also works on bools). Precedence is `not`, then `and`, then `or`, so `a or b and c` means `a or (b and c)`.\n\n' +
    '**Short-circuiting:** Python evaluates left to right and stops as soon as the answer is known. `False and ...` is False whatever comes next, and `True or ...` is True, so the right-hand side is **never run**. That is why `x != 0 and 10 / x > 1` is safe even when `x` is 0.\n\n' +
    '**Return values:** `and` and `or` return one of their operands, not necessarily `True`/`False`. 0, empty strings, empty lists and `None` are falsy; most other values are truthy. `a and b` gives `a` if `a` is falsy, otherwise `b`; `a or b` gives `a` if `a` is truthy, otherwise `b`. So `0 or 4` is `4` and `3 and 7` is `7`. Only `not` always returns a real bool.',
  formulas: [
    { label: 'NOT', tex: '\\neg 0 = 1, \\quad \\neg 1 = 0', note: 'NOT flips the value.' },
    { label: 'AND', tex: 'A \\land B = 1 \\iff A = 1 \\text{ and } B = 1' },
    { label: 'OR', tex: 'A \\lor B = 0 \\iff A = 0 \\text{ and } B = 0', note: 'OR is true when at least one input is true, including both.' },
    { label: 'XOR', tex: 'A \\oplus B = (A \\land \\neg B) \\lor (\\neg A \\land B)', note: '1 exactly when the inputs differ.' },
    { label: 'XOR (second form)', tex: 'A \\oplus B = (A \\lor B) \\land \\neg(A \\land B)', note: '"OR, but not both".' },
    { label: 'NAND and NOR', tex: 'A \\text{ NAND } B = \\neg(A \\land B), \\quad A \\text{ NOR } B = \\neg(A \\lor B)' },
    { label: 'NAND as NOT', tex: 'A \\text{ NAND } A = \\neg A', note: 'Tie both inputs of a NAND (or NOR) gate together to get a NOT gate.' },
    { label: 'Rows in a truth table', tex: '2^n \\text{ rows for } n \\text{ inputs}' },
    { label: "De Morgan's law (AND)", tex: '\\neg(A \\land B) = \\neg A \\lor \\neg B' },
    { label: "De Morgan's law (OR)", tex: '\\neg(A \\lor B) = \\neg A \\land \\neg B' },
    { label: 'Double negation', tex: '\\neg\\neg A = A' },
    { label: 'Complement laws', tex: 'A \\lor \\neg A = 1, \\quad A \\land \\neg A = 0' },
    { label: 'Identity laws', tex: 'A \\land 1 = A, \\quad A \\lor 0 = A' },
    { label: 'Domination laws', tex: 'A \\lor 1 = 1, \\quad A \\land 0 = 0' },
    { label: 'Idempotent laws', tex: 'A \\land A = A, \\quad A \\lor A = A' },
    { label: 'Distributive laws', tex: 'A \\land (B \\lor C) = (A \\land B) \\lor (A \\land C), \\quad A \\lor (B \\land C) = (A \\lor B) \\land (A \\lor C)' },
    { label: 'Absorption laws', tex: 'A \\lor (A \\land B) = A, \\quad A \\land (A \\lor B) = A' },
    { label: 'Useful simplification', tex: 'A \\lor (\\neg A \\land B) = A \\lor B' },
    { label: 'Python precedence', tex: '\\texttt{not} \\; > \\; \\texttt{and} \\; > \\; \\texttt{or}', note: '`a or b and c` means `a or (b and c)`.' },
  ],
  examples: [
    {
      title: 'Evaluate an expression',
      problem: 'Find the value of $(A \\lor \\neg B) \\land (B \\oplus C)$ when $A = 0$, $B = 1$, $C = 1$.',
      steps: [
        'NOT first: $\\neg B = \\neg 1 = 0$.',
        'First bracket: $A \\lor \\neg B = 0 \\lor 0 = 0$.',
        'Second bracket: $B \\oplus C = 1 \\oplus 1 = 0$ (the inputs are the same, so XOR gives 0).',
        'Combine: $0 \\land 0 = 0$.',
      ],
      answer: 'The expression is 0 (FALSE).',
    },
    {
      title: 'Count the true rows of a truth table',
      problem: 'For how many of the 8 combinations of $A$, $B$, $C$ is $(A \\oplus B) \\land \\neg C$ equal to 1?',
      steps: [
        'For an AND to be 1, both parts must be 1.',
        '$\\neg C = 1$ needs $C = 0$: that keeps 4 of the 8 rows.',
        '$A \\oplus B = 1$ needs $A$ and $B$ to be different: $(A, B) = (0, 1)$ or $(1, 0)$.',
        'So the rows are $(A, B, C) = (0, 1, 0)$ and $(1, 0, 0)$.',
      ],
      answer: '2 rows.',
    },
    {
      title: "Simplify using De Morgan's law",
      problem: 'Simplify $\\neg(\\neg A \\land B) \\land B$.',
      steps: [
        "De Morgan: negate each part and swap AND for OR: $\\neg(\\neg A \\land B) = \\neg\\neg A \\lor \\neg B$.",
        'Double negation: $\\neg\\neg A = A$, so this is $A \\lor \\neg B$.',
        'Now AND with $B$ and distribute: $(A \\lor \\neg B) \\land B = (A \\land B) \\lor (\\neg B \\land B)$.',
        'Complement law: $\\neg B \\land B = 0$, so this is $(A \\land B) \\lor 0$, and $X \\lor 0 = X$ leaves $A \\land B$.',
        'Check a row: $A = 0, B = 1$ gives $\\neg(1 \\land 1) \\land 1 = 0$, and $A \\land B = 0$. They agree.',
      ],
      answer: '$A \\land B$',
    },
    {
      title: 'Python short-circuiting (exam level)',
      problem:
        'What does `print(0 and 1/0, 5 or 1/0, 2 and 3)` print?',
      steps: [
        '`0 and 1/0`: 0 is falsy, so `and` stops and returns 0. The division by zero is **never evaluated**, so no error.',
        '`5 or 1/0`: 5 is truthy, so `or` stops and returns 5. Again `1/0` is skipped.',
        '`2 and 3`: 2 is truthy, so `and` moves on and returns the right operand, 3.',
        '`print` separates the values with spaces.',
      ],
      answer: '`0 5 3`',
    },
  ],
  traps: [
    'Treating OR as XOR. In logic, $A \\lor B$ is TRUE when both inputs are TRUE; only XOR excludes that case.',
    "Half-applying De Morgan: $\\neg(A \\land B)$ is $\\neg A \\lor \\neg B$, not $\\neg A \\land \\neg B$. You must negate every part **and** swap AND with OR.",
    'Forgetting the inversion in NAND/NOR (or the final NOT gate in a circuit). Every output then comes out flipped, and the flipped answer is usually one of the options.',
    'Missing rows in a truth table. With 3 inputs there are 8 rows; list them in binary order 000 to 111 and do not forget the all-zero row.',
    'Negating a comparison wrongly in code: the opposite of `x > 3` is `x <= 3`, not `x < 3`.',
    'Assuming Python `and`/`or` return `True`/`False` and that both sides always run. They return an operand, and the right side is skipped once the answer is known.',
  ],
  examTip:
    'Most Boolean questions can be checked by **plugging in values**. For "which expression is equivalent", test a row or two (for example all inputs 1, then one input 0): any option that gives a different output from the original is out, and a single differing row is enough to eliminate it. For "how many rows are true", count the rows that give 0 if that is easier and subtract from $2^n$. The wrong options are usually the result of one specific slip (forgetting a NOT, reading XOR as OR, half-applying De Morgan), so if your answer is the exact opposite of an option in every row, check your NOTs. For Python questions, trace left to right, mark each value truthy or falsy, and stop evaluating `and` at the first falsy value and `or` at the first truthy value.',
};
