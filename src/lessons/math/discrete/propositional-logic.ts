import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'propositional-logic',
  know:
    '### What is a proposition?\n\n' +
    'A **proposition** is a sentence that makes a claim and is either **true (T)** or **false (F)**, never both. "Abu Dhabi is in the UAE" is a proposition (true). "7 is even" is also a proposition: it is false, but it still has a definite truth value.\n\n' +
    'Not propositions: questions ("Is it raining?"), commands ("Close the door.") and **open sentences** like "$x + 2 = 5$", whose truth depends on an unknown value.\n\n' +
    'We use letters such as $p$, $q$, $r$ to stand for propositions, and **connectives** to build bigger (compound) statements.\n\n' +
    '### The five connectives\n\n' +
    '| Symbol | Name | Read as | True when... |\n' +
    '| --- | --- | --- | --- |\n' +
    '| $\\neg p$ | negation | not $p$ | $p$ is false |\n' +
    '| $p \\land q$ | conjunction | $p$ and $q$ | **both** are true |\n' +
    '| $p \\lor q$ | disjunction | $p$ or $q$ | **at least one** is true |\n' +
    '| $p \\to q$ | implication | if $p$ then $q$ | always, **except** $p$ true and $q$ false |\n' +
    '| $p \\leftrightarrow q$ | biconditional | $p$ if and only if $q$ | both have the **same** value |\n\n' +
    'Two points catch people out:\n\n' +
    '- **OR is inclusive.** $p \\lor q$ is true when both are true. ("Exclusive or" is a different connective.)\n' +
    '- **An implication is a promise.** "If you score 90%, I will buy you a phone." The promise is only broken if you score 90% and get no phone. If you do not score 90%, the promise was never tested, so $p \\to q$ counts as **true** (vacuously true).\n\n' +
    '### Truth tables\n\n' +
    'A truth table lists every possible combination of truth values. With $n$ letters there are $2^n$ rows: 2 letters give 4 rows, 3 letters give 8 rows. The standard order for two letters is TT, TF, FT, FF.\n\n' +
    '| $p$ | $q$ | $p \\land q$ | $p \\lor q$ | $p \\to q$ | $p \\leftrightarrow q$ |\n' +
    '| --- | --- | --- | --- | --- | --- |\n' +
    '| T | T | T | T | T | T |\n' +
    '| T | F | F | T | F | F |\n' +
    '| F | T | F | T | T | F |\n' +
    '| F | F | F | F | T | T |\n\n' +
    'For a complicated statement, work **inside out**: first negate single letters, then do the brackets, then the main connective, adding one column at a time.\n\n' +
    '### Converse, inverse, contrapositive\n\n' +
    'Start from a true implication $p \\to q$: "If a number is divisible by 4, then it is even." Here $p$ = "divisible by 4" (the **hypothesis**) and $q$ = "even" (the **conclusion**).\n\n' +
    '- **Converse** $q \\to p$: swap. ("If a number is even, then it is divisible by 4." False: 6 is even but not divisible by 4.)\n' +
    '- **Inverse** $\\neg p \\to \\neg q$: negate both. ("If a number is not divisible by 4, then it is not even." False again: look at 6.)\n' +
    '- **Contrapositive** $\\neg q \\to \\neg p$: swap **and** negate. ("If a number is not even, then it is not divisible by 4." True, just like the original.)\n\n' +
    'The contrapositive is **always equivalent** to the original. The converse and inverse are equivalent to each other (the inverse is the contrapositive of the converse), but not to the original.\n\n' +
    '### Negating statements and De Morgan\'s laws\n\n' +
    'To negate AND or OR, negate each part **and** swap the connective:\n\n' +
    '$$\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q \\qquad \\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$$\n\n' +
    'Common sense check: "sunny and warm" fails as soon as **one** part fails, so its negation is "not sunny **or** not warm".\n\n' +
    'The negation of an implication is **not** another implication. $p \\to q$ fails only when $p$ happens and $q$ does not, so $\\neg(p \\to q) \\equiv p \\land \\neg q$.\n\n' +
    'The same laws work in code: `not (x > 3 and y < 5)` is the same as `x <= 3 or y >= 5`. (The opposite of `>` is `<=`.)\n\n' +
    '### Equivalence, tautologies and contradictions\n\n' +
    '- Two statements are **logically equivalent** ($\\equiv$) if their truth-table columns are identical.\n' +
    '- A **tautology** is true in every row, e.g. $p \\lor \\neg p$.\n' +
    '- A **contradiction** is false in every row, e.g. $p \\land \\neg p$.\n' +
    '- Anything else (sometimes true, sometimes false) is a **contingency**.\n\n' +
    'Key rewrite: $p \\to q \\equiv \\neg p \\lor q$ ("either $p$ fails, or $q$ happens"). With this and De Morgan you can simplify most exam expressions without a full table.\n\n' +
    'To show a statement is **not** a tautology, you only need **one** row where it is false. That is the fastest way to eliminate options.',
  formulas: [
    { label: 'Number of truth-table rows', tex: '\\text{rows} = 2^{n}', note: '$n$ = number of different letters.' },
    { label: 'Implication as OR', tex: 'p \\to q \\equiv \\neg p \\lor q', note: 'False only when $p$ is true and $q$ is false.' },
    { label: 'Negation of an implication', tex: '\\neg(p \\to q) \\equiv p \\land \\neg q' },
    { label: 'Biconditional', tex: 'p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p)', note: 'True when $p$ and $q$ have the same truth value.' },
    { label: 'Contrapositive (equivalent)', tex: 'p \\to q \\equiv \\neg q \\to \\neg p' },
    { label: 'Converse and inverse (equivalent to each other only)', tex: 'q \\to p \\equiv \\neg p \\to \\neg q', note: 'Neither is equivalent to $p \\to q$.' },
    { label: "De Morgan's law (AND)", tex: '\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q' },
    { label: "De Morgan's law (OR)", tex: '\\neg(p \\lor q) \\equiv \\neg p \\land \\neg q' },
    { label: 'Double negation', tex: '\\neg(\\neg p) \\equiv p' },
    { label: 'Distributive laws', tex: 'p \\land (q \\lor r) \\equiv (p \\land q) \\lor (p \\land r), \\quad p \\lor (q \\land r) \\equiv (p \\lor q) \\land (p \\lor r)' },
    { label: 'Tautology and contradiction', tex: 'p \\lor \\neg p \\equiv \\text{T}, \\qquad p \\land \\neg p \\equiv \\text{F}' },
    { label: 'Identity laws', tex: 'p \\land \\text{T} \\equiv p, \\qquad p \\lor \\text{F} \\equiv p' },
  ],
  examples: [
    {
      title: 'Evaluating a compound statement',
      problem: '$p$ is true, $q$ is false and $r$ is true. Find the truth value of $(p \\lor q) \\to \\neg r$.',
      steps: [
        'Do the bracket first: $p \\lor q = \\text{T} \\lor \\text{F} = \\text{T}$ (at least one part is true).',
        'Negate the single letter: $\\neg r = \\neg \\text{T} = \\text{F}$.',
        'Main connective: $\\text{T} \\to \\text{F}$. A true hypothesis with a false conclusion is the only false case of an implication.',
      ],
      answer: 'False',
    },
    {
      title: 'Building a truth table',
      problem: 'Find the truth-table column of $\\neg p \\to q$, with rows $(p, q)$ = TT, TF, FT, FF.',
      steps: [
        'Column for $\\neg p$: flip $p$, giving F, F, T, T.',
        'Row TT: $\\text{F} \\to \\text{T} = \\text{T}$ (false hypothesis).',
        'Row TF: $\\text{F} \\to \\text{F} = \\text{T}$ (false hypothesis).',
        'Row FT: $\\text{T} \\to \\text{T} = \\text{T}$.',
        'Row FF: $\\text{T} \\to \\text{F} = \\text{F}$, the only false row.',
        'The column T, T, T, F is the same as $p \\lor q$, which matches the rule $\\neg p \\to q \\equiv \\neg\\neg p \\lor q \\equiv p \\lor q$.',
      ],
      answer: 'T, T, T, F',
    },
    {
      title: 'Contrapositive of a compound implication',
      problem: 'Write the contrapositive of "If it is a weekend and it is sunny, then I go to the beach", simplified using De Morgan.',
      steps: [
        'Let $w$ = weekend, $s$ = sunny, $b$ = beach. The statement is $(w \\land s) \\to b$.',
        'Contrapositive: swap and negate, $\\neg b \\to \\neg(w \\land s)$.',
        'De Morgan: $\\neg(w \\land s) \\equiv \\neg w \\lor \\neg s$.',
        'So: $\\neg b \\to (\\neg w \\lor \\neg s)$.',
      ],
      answer: '"If I do not go to the beach, then it is not a weekend or it is not sunny."',
    },
    {
      title: 'Simplifying with the laws (exam level)',
      problem: 'Simplify $\\neg(p \\to q) \\lor q$.',
      steps: [
        'Negation of an implication: $\\neg(p \\to q) \\equiv p \\land \\neg q$.',
        'So the statement is $(p \\land \\neg q) \\lor q$.',
        'Distributive law: $(p \\lor q) \\land (\\neg q \\lor q)$.',
        '$\\neg q \\lor q$ is a tautology (always T), and $X \\land \\text{T} \\equiv X$, so the statement simplifies to $p \\lor q$.',
        'Check row FF: $\\neg(\\text{F} \\to \\text{F}) \\lor \\text{F} = \\neg \\text{T} \\lor \\text{F} = \\text{F}$, and $p \\lor q = \\text{F}$ too.',
      ],
      answer: '$p \\lor q$',
    },
  ],
  traps: [
    'Thinking an implication with a false hypothesis is false. $\\text{F} \\to \\text{T}$ and $\\text{F} \\to \\text{F}$ are both **true**; the only false case is $\\text{T} \\to \\text{F}$.',
    'Mixing up converse, inverse and contrapositive. Only the **contrapositive** ($\\neg q \\to \\neg p$, swap and negate) is equivalent to $p \\to q$.',
    'Half-applying De Morgan: writing $\\neg(p \\land q)$ as $\\neg p \\land \\neg q$. You must negate both parts **and** swap $\\land$ with $\\lor$.',
    'Negating an implication as another implication ($\\neg p \\to \\neg q$). The correct negation is $p \\land \\neg q$.',
    'Treating OR as exclusive: $p \\lor q$ is **true** when both are true.',
    'Forgetting the biconditional is true when both sides are false: $\\text{F} \\leftrightarrow \\text{F} = \\text{T}$.',
  ],
  examTip:
    'In the 4-option MCQ the wrong options are usually built from the classic slips: the converse or inverse instead of the contrapositive, De Morgan without swapping $\\land$/$\\lor$, or an implication column with the vacuous rows marked false. Fast tactics: (1) to find a tautology or an equivalence, test the **critical row** first: for $X \\to Y$ that is the row making $X$ true and $Y$ false, and one counterexample row eliminates an option; (2) for "which column" questions, check just one or two rows (e.g. the FF row, where $p \\to q$ is true but $p \\land q$ and $p \\lor q$ are false; careful, a negated letter flips this) and cross out options that disagree; (3) for "find the truth values" questions, plug each option into every statement rather than solving from scratch; (4) rewrite $p \\to q$ as $\\neg p \\lor q$ to simplify quickly. Never stop after checking three rows: a statement must match in **all** rows to be equivalent.',
};
