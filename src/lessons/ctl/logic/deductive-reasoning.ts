import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'deductive-reasoning',
  know: `### What deductive reasoning is

**Deductive reasoning** means starting from statements you are told to accept (the **premises**) and working out what **must** follow from them (the **conclusion**). No guessing, no real-world knowledge, no "probably": a conclusion only counts if it is **guaranteed** by the premises.

An argument is **valid** when it is impossible for every premise to be true while the conclusion is false. Validity is about the *link*, not about whether the statements are actually true. "All fish can fly; a salmon is a fish; so a salmon can fly" is valid, because the conclusion is forced by the premises, even though the first premise and the conclusion are false. A valid argument with true premises is called **sound**.

**Exam habit:** when a question says "assume the statements are true", treat them as true even if they sound silly, and ignore what you know about the real world.

### If-then statements

Most questions are built on a rule "If $P$, then $Q$" (written $P \\Rightarrow Q$). $P$ is the **antecedent** (the "if" part) and $Q$ is the **consequent** (the "then" part). The rule only promises one thing: whenever $P$ happens, $Q$ happens. It says nothing about what happens when $P$ does not happen.

From the rule, three related statements can be made:

| Name | Form | Same meaning as the rule? |
| --- | --- | --- |
| Converse | If $Q$ then $P$ | No |
| Inverse | If not $P$ then not $Q$ | No |
| Contrapositive | If not $Q$ then not $P$ | **Yes, always** |

Example: "If it is a square, it has four sides." The contrapositive "If it does not have four sides, it is not a square" is true. The converse "If it has four sides, it is a square" is false (a rectangle).

### The four argument patterns

Add a second premise to the rule and you get one of four patterns. Two are valid and two are famous fallacies:

| Second premise | Conclusion | Name | Valid? |
| --- | --- | --- | --- |
| $P$ | $Q$ | Modus ponens | Yes |
| not $Q$ | not $P$ | Modus tollens | Yes |
| $Q$ | $P$ | Affirming the consequent | **No** |
| not $P$ | not $Q$ | Denying the antecedent | **No** |

Why the fallacies fail: $Q$ might happen for some other reason. "If the battery is flat, the car won't start. The car won't start." The car might be out of fuel, so you cannot conclude the battery is flat.

Rules can be **chained**: "If $P$ then $Q$" and "If $Q$ then $R$" give "If $P$ then $R$". Modus tollens can be chained backwards too.

### Necessary and sufficient

- "$X$ is **sufficient** for $Y$" means $X$ is enough: **If $X$ then $Y$**.
- "$X$ is **necessary** for $Y$" means you cannot have $Y$ without $X$: **If $Y$ then $X$**.
- "$Y$ **only if** $X$" means the same as "$X$ is necessary for $Y$": **If $Y$ then $X$**.
- "$Y$ **if and only if** $X$" means both directions: necessary **and** sufficient.

Example: "You can vote only if you are a citizen" means "If you vote, you are a citizen". It does **not** say every citizen votes.

### Syllogisms: all, some, no

A **syllogism** has two premises about groups and a conclusion. Draw each group as a circle:

- "All $A$ are $B$": the $A$ circle is **inside** the $B$ circle.
- "No $A$ are $B$": the circles **do not overlap**.
- "Some $A$ are $B$": at least one thing is in **both** circles.
- "Some $A$ are not $B$": at least one $A$ is **outside** $B$.

The group that appears in both premises (the **middle term**) links the other two. To test a conclusion, try to draw a picture where both premises are true but the conclusion is false. If you can, the conclusion does not follow.

Useful facts:

- "All $A$ are $B$" does **not** mean "All $B$ are $A$". But "Some $A$ are $B$" does mean "Some $B$ are $A$", and "No $A$ are $B$" means "No $B$ are $A$".
- Two "some" premises, or two "no" premises, never force a conclusion.
- The negation of "All $A$ are $B$" is "Some $A$ are not $B$" (not "No $A$ are $B$").

### Deducing facts from clues

For "who owns what" puzzles, make a small table of what each person **could** have, then cross out options clue by clue. Look for a person or item with only one possibility left, or two people who must share two items between them. For "which must be true" questions, a statement only counts if it holds in **every** arrangement that fits the clues.`,
  formulas: [
    { label: 'Modus ponens (valid)', tex: 'P \\Rightarrow Q,\\quad P \\quad\\therefore\\quad Q' },
    { label: 'Modus tollens (valid)', tex: 'P \\Rightarrow Q,\\quad \\neg Q \\quad\\therefore\\quad \\neg P' },
    { label: 'Affirming the consequent (fallacy)', tex: 'P \\Rightarrow Q,\\quad Q \\quad\\not\\therefore\\quad P', note: 'Invalid: $Q$ may happen for another reason.' },
    { label: 'Denying the antecedent (fallacy)', tex: 'P \\Rightarrow Q,\\quad \\neg P \\quad\\not\\therefore\\quad \\neg Q', note: 'Invalid: the rule says nothing about what happens when $P$ is false.' },
    { label: 'Contrapositive', tex: '(P \\Rightarrow Q) \\equiv (\\neg Q \\Rightarrow \\neg P)', note: 'The only rearrangement that always keeps the meaning.' },
    { label: 'Converse and inverse', tex: '\\text{converse: } Q \\Rightarrow P \\qquad \\text{inverse: } \\neg P \\Rightarrow \\neg Q', note: 'Not equivalent to the original (but equivalent to each other).' },
    { label: 'Chaining (hypothetical syllogism)', tex: 'P \\Rightarrow Q,\\quad Q \\Rightarrow R \\quad\\therefore\\quad P \\Rightarrow R' },
    { label: 'Sufficient condition', tex: 'X \\text{ sufficient for } Y \\iff (X \\Rightarrow Y)' },
    { label: 'Necessary condition / only if', tex: 'X \\text{ necessary for } Y \\iff (Y \\Rightarrow X) \\iff (Y \\text{ only if } X)' },
    { label: 'Negating quantifiers', tex: '\\neg(\\text{all } A \\text{ are } B) \\equiv \\text{some } A \\text{ are not } B \\qquad \\neg(\\text{some } A \\text{ are } B) \\equiv \\text{no } A \\text{ are } B' },
    { label: 'Valid syllogism patterns', tex: '\\text{All } A \\text{ are } B,\\ \\text{all } B \\text{ are } C \\;\\therefore\\; \\text{all } A \\text{ are } C \\qquad \\text{Some } A \\text{ are } B,\\ \\text{all } B \\text{ are } C \\;\\therefore\\; \\text{some } A \\text{ are } C', note: 'Also: all $A$ are $B$ and no $B$ are $C$ give no $A$ are $C$; some $A$ are $B$ and no $B$ are $C$ give some $A$ are not $C$.' },
  ],
  examples: [
    {
      title: 'Naming an argument pattern',
      problem: 'Is this argument valid? "If a number ends in 0, it is even. 14 is even. So 14 ends in 0."',
      steps: [
        'Label the rule: $P$ = "ends in 0" (the if part), $Q$ = "is even" (the then part).',
        'The second premise "14 is even" is $Q$. The conclusion "14 ends in 0" is $P$.',
        'The pattern is "$Q$, therefore $P$", which is affirming the consequent.',
        'Counterexample check: 14 itself is even but ends in 4, so the premises are true and the conclusion is false.',
      ],
      answer: 'Invalid: it affirms the consequent.',
    },
    {
      title: 'Turning "only if" into if-then',
      problem: 'Assume "The robot moves only if its battery is charged." Which argument is valid: (i) "The battery is charged, so the robot moves." or (ii) "The battery is not charged, so the robot does not move."?',
      steps: [
        '"$A$ only if $B$" means "If $A$ then $B$". So the rule is: if the robot moves, then the battery is charged.',
        'Argument (i) starts from "the battery is charged", which is the then part, and concludes the if part. That is affirming the consequent: invalid. (A charged robot might be switched off.)',
        'Argument (ii) starts from "the battery is not charged", which denies the then part, and concludes the if part is false. That is modus tollens: valid.',
        'Check with the contrapositive: "If the battery is not charged, then the robot does not move" is equivalent to the rule, and it is exactly argument (ii).',
      ],
      answer: 'Only argument (ii) is valid. "Only if" gives a necessary condition, so a charged battery does not guarantee movement.',
    },
    {
      title: 'Testing a syllogism with circles',
      problem: 'All bakers are early risers. Some early risers are cyclists. Must some bakers be cyclists?',
      steps: [
        'Draw the bakers circle inside the early-risers circle.',
        'Some early risers are cyclists: put a cyclists circle that overlaps the early-risers circle.',
        'Try to break the conclusion: place the cyclists overlap in the part of the early-risers circle that is **outside** the bakers circle.',
        'Both premises are still true, but no baker is a cyclist. So the conclusion is not forced.',
      ],
      answer: 'No. The conclusion does not follow (the middle group, early risers, does not link bakers to cyclists).',
    },
    {
      title: 'A chain of rules (exam level)',
      problem: 'If $A$ then $B$. If $C$ then not $B$. If not $D$ then $C$. $A$ is true. What can you say about $C$ and $D$?',
      steps: [
        '$A$ is true and "if $A$ then $B$", so $B$ is true (modus ponens).',
        '"If $C$ then not $B$": not $B$ is false, so $C$ is false (modus tollens).',
        '"If not $D$ then $C$": $C$ is false, so not $D$ is false, which means $D$ is true (modus tollens).',
        'Check all rules with $A, B, D$ true and $C$ false: every rule holds.',
      ],
      answer: '$C$ is false and $D$ is true.',
    },
  ],
  traps: [
    '**Affirming the consequent.** From "If $P$ then $Q$" and "$Q$" you cannot conclude $P$: $Q$ might have another cause. This is the single most common wrong option.',
    '**Denying the antecedent.** From "If $P$ then $Q$" and "not $P$" you cannot conclude "not $Q$". The rule says nothing about what happens when $P$ is false.',
    '**Mixing up necessary and sufficient.** "$X$ is necessary for $Y$" (or "$Y$ only if $X$") means "If $Y$ then $X$", not "If $X$ then $Y$".',
    '**Using real-world knowledge.** An option can be true in real life but still not follow from the premises. Only pick conclusions the premises force.',
    '**Reversing "all".** "All $A$ are $B$" does not mean "All $B$ are $A$". And "not all" means "at least one is not", not "none".',
    '**Undistributed middle.** "All $A$ are $B$, some $B$ are $C$" does not give "some $A$ are $C$": the $B$s that are $C$ may not be $A$s.',
  ],
  examTip: `These questions are 4-option MCQs where the wrong options are almost always the classic mistakes: the **converse**, the **inverse**, a conclusion that is **true in real life but not forced**, or a "some" upgraded to "all". Fast method:

1. Translate every sentence into "If $P$ then $Q$" or into circles. Rewrite "only if", "necessary" and "sufficient" before doing anything else.
2. For "which is equivalent", go straight to the **contrapositive** (swap and negate both).
3. For "which must be true", try to build a counterexample to each option (a picture or story where all premises hold but the option fails). Any option you can break is out.
4. Watch the words "must", "could" and "cannot": "must be true" means true in **every** case, not just possible.

Do not spend long on one puzzle: about a minute per question. In a "which must be true" or "which is equivalent" question, if two options say the same thing in different words (for example the converse and the inverse), both must be wrong, because only one option can be correct. (This does not apply when the question asks you to *name* the converse or the inverse.)`,
};
