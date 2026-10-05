import type { StaticQuestion } from '../../../types';

// ---------------------------------------------------------------- checking helpers (used only by `check`)
// Propositional logic: brute-force every true/false assignment.
type Env = Record<string, boolean>;
type Prop = (e: Env) => boolean;
const imp = (a: boolean, b: boolean) => !a || b;

function envs(vars: string[]): Env[] {
  const out: Env[] = [];
  for (let mask = 0; mask < 1 << vars.length; mask++) {
    const e: Env = {};
    vars.forEach((v, i) => (e[v] = ((mask >> i) & 1) === 1));
    out.push(e);
  }
  return out;
}
/** True if the conclusion is true in every assignment where all premises are true (and the premises are consistent). */
function entails(vars: string[], prem: Prop[], concl: Prop): boolean {
  const ok = envs(vars).filter((e) => prem.every((p) => p(e)));
  if (ok.length === 0) throw new Error('inconsistent premises');
  return ok.every(concl);
}
function equivalent(vars: string[], a: Prop, b: Prop): boolean {
  return envs(vars).every((e) => a(e) === b(e));
}
/** Key of the only option that follows; 'none' if no option follows. */
function uniqueEntailed(vars: string[], prem: Prop[], opts: [string, Prop][]): string {
  const hits = opts.filter(([, c]) => entails(vars, prem, c)).map(([k]) => k);
  return hits.length === 1 ? hits[0] : hits.length === 0 ? 'none' : `multiple:${hits.join(',')}`;
}
function uniqueEquivalent(vars: string[], target: Prop, opts: [string, Prop][]): string {
  const hits = opts.filter(([, c]) => equivalent(vars, target, c)).map(([k]) => k);
  return hits.length === 1 ? hits[0] : `found:${hits.join(',')}`;
}
/** Names the form of "If P then Q; given; therefore concl" by comparing truth tables. */
function argumentForm(vars: string[], P: Prop, Q: Prop, given: Prop, concl: Prop): string {
  const eq = (a: Prop, b: Prop) => equivalent(vars, a, b);
  const notP: Prop = (e) => !P(e);
  const notQ: Prop = (e) => !Q(e);
  const valid = entails(vars, [(e) => imp(P(e), Q(e)), given], concl);
  if (eq(given, P) && eq(concl, Q)) return valid ? 'MP' : 'error';
  if (eq(given, notQ) && eq(concl, notP)) return valid ? 'MT' : 'error';
  if (eq(given, Q) && eq(concl, P)) return valid ? 'error' : 'AC';
  if (eq(given, notP) && eq(concl, notQ)) return valid ? 'error' : 'DA';
  return 'other';
}

// Categorical statements (all / some / no / some...not): brute-force every Venn diagram.
// A diagram says which regions are non-empty. A term starting with "~" means "not in that set".
type Quant = 'all' | 'some' | 'no' | 'someNot';
type Cat = [Quant, string, string];

function catHolds([q, a, b]: Cat, regions: boolean[], terms: string[]): boolean {
  const inT = (t: string, r: number) => {
    const neg = t.startsWith('~');
    const i = terms.indexOf(neg ? t.slice(1) : t);
    if (i < 0) throw new Error(`unknown term ${t}`);
    const inside = ((r >> i) & 1) === 1;
    return neg ? !inside : inside;
  };
  const any = (f: (r: number) => boolean) => regions.some((ne, r) => ne && f(r));
  if (q === 'all') return !any((r) => inT(a, r) && !inT(b, r));
  if (q === 'no') return !any((r) => inT(a, r) && inT(b, r));
  if (q === 'some') return any((r) => inT(a, r) && inT(b, r));
  return any((r) => inT(a, r) && !inT(b, r));
}
/** existential = also assume every named group has at least one member (the traditional reading). */
function catFollows(terms: string[], prem: Cat[], concl: Cat, existential: boolean): boolean {
  const R = 1 << terms.length;
  let models = 0;
  for (let mask = 0; mask < 1 << R; mask++) {
    const regions = Array.from({ length: R }, (_, r) => ((mask >> r) & 1) === 1);
    if (existential && terms.some((_, i) => !regions.some((ne, r) => ne && ((r >> i) & 1) === 1))) continue;
    if (!prem.every((p) => catHolds(p, regions, terms))) continue;
    models++;
    if (!catHolds(concl, regions, terms)) return false;
  }
  if (models === 0) throw new Error('inconsistent premises');
  return true;
}
/** Follows under BOTH readings; returns null if the two readings disagree (so the question would be ambiguous). */
function catFollowsBoth(terms: string[], prem: Cat[], concl: Cat): boolean | null {
  const a = catFollows(terms, prem, concl, false);
  const b = catFollows(terms, prem, concl, true);
  return a === b ? a : null;
}
function uniqueCat(terms: string[], prem: Cat[], opts: [string, Cat][]): string {
  const res = opts.map(([k, c]) => [k, catFollowsBoth(terms, prem, c)] as const);
  if (res.some(([, v]) => v === null)) return 'ambiguous';
  const hits = res.filter(([, v]) => v).map(([k]) => k);
  return hits.length === 1 ? hits[0] : hits.length === 0 ? 'none' : `multiple:${hits.join(',')}`;
}

/** All orderings of a list (for clue puzzles). */
function perms<T>(xs: T[]): T[][] {
  if (xs.length <= 1) return [xs.slice()];
  return xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));
}

// ---------------------------------------------------------------- questions
export const questions: StaticQuestion[] = [
  // ================================================================ foundation
  {
    id: 'deductive-reasoning-001',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `Assume both statements are true:

1. If a whole number is divisible by 6, then it is divisible by 3.
2. The number 84 is divisible by 6.

Which conclusion follows **logically** from these two statements?`,
    options: [
      `Every whole number that is divisible by 3 is also divisible by 6.`,
      `84 is divisible by 3.`,
      `84 is not divisible by 3.`,
      `Nothing can be concluded, because statement 1 is only a general rule.`,
    ],
    correctIndex: 1,
    markScheme: {
      solution: `Statement 1 has the shape "If $P$, then $Q$" with

- $P$: the number is divisible by 6 (the **if** part, called the *antecedent*)
- $Q$: the number is divisible by 3 (the **then** part, called the *consequent*)

Statement 2 tells us that $P$ is true for the number 84.

A rule "if $P$ then $Q$" promises that **whenever** $P$ happens, $Q$ happens too. So for 84, $Q$ must be true: 84 is divisible by 3.

This pattern ("If $P$ then $Q$. $P$. Therefore $Q$.") is called **modus ponens**, and it is always valid.

Quick check: $84 \\div 3 = 28$, a whole number.`,
      whyWrong: [
        `This is the **converse** of statement 1 (the two parts swapped). The converse is not implied, and here it is actually false: 9 is divisible by 3 but not by 6.`,
        null,
        `This contradicts statement 1. Since 84 meets the "if" part (divisible by 6), the rule forces the "then" part (divisible by 3) to be true.`,
        `A general "if-then" rule applies to **every** case that meets its condition. Applying it to one particular number (84) is exactly what modus ponens does.`,
      ],
      keyIdea: `Modus ponens: from "If $P$ then $Q$" and "$P$", you may conclude "$Q$".`,
    },
  },
  {
    id: 'deductive-reasoning-002',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `Which statement is **logically equivalent** to: "If a shape is a square, then it has four sides"?`,
    options: [
      `If a shape has four sides, then it is a square.`,
      `If a shape is not a square, then it does not have four sides.`,
      `If a shape does not have four sides, then it is not a square.`,
      `Some squares do not have four sides.`,
    ],
    correctIndex: 2,
    markScheme: {
      solution: `Write the rule as "If $P$, then $Q$" with $P$ = "is a square" and $Q$ = "has four sides". There are three related statements:

| Name | Form | This example |
| --- | --- | --- |
| Converse | If $Q$ then $P$ | If four sides, then square |
| Inverse | If not $P$ then not $Q$ | If not a square, then not four sides |
| Contrapositive | If not $Q$ then not $P$ | If not four sides, then not a square |

Only the **contrapositive** always has the same truth value as the original. Think of it this way: every square has four sides, so if a shape does **not** have four sides it cannot possibly be a square.

The converse and the inverse can both fail here: a rectangle has four sides but is not a square.`,
      whyWrong: [
        `This is the **converse** (the two parts swapped). It is false: a rectangle has four sides but is not a square.`,
        `This is the **inverse** (both parts negated, order kept). It is false: a rectangle is not a square but still has four sides.`,
        null,
        `This is the **negation** of the original rule: it says the rule is broken. A negation always has the opposite truth value, so it can never be equivalent.`,
      ],
      keyIdea: `"If $P$ then $Q$" is equivalent to its contrapositive "If not $Q$ then not $P$", but not to its converse or inverse.`,
    },
    check: {
      optionValues: ['converse', 'inverse', 'contrapositive', 'negation'],
      compute: () => {
        const v = ['S', 'F']; // S: is a square, F: has four sides
        const original: Prop = (e) => imp(e.S, e.F);
        return uniqueEquivalent(v, original, [
          ['converse', (e) => imp(e.F, e.S)],
          ['inverse', (e) => imp(!e.S, !e.F)],
          ['contrapositive', (e) => imp(!e.F, !e.S)],
          ['negation', (e) => e.S && !e.F],
        ]);
      },
    },
  },
  {
    id: 'deductive-reasoning-003',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `Consider this argument:

"If the battery is flat, then the car will not start. The car will not start. Therefore, the battery is flat."

Which description of the argument is correct?`,
    options: [
      `Valid: it uses modus ponens.`,
      `Valid: it uses modus tollens.`,
      `Invalid: it denies the antecedent.`,
      `Invalid: it affirms the consequent.`,
    ],
    correctIndex: 3,
    markScheme: {
      solution: `Label the rule "If $P$, then $Q$":

- $P$ (antecedent): the battery is flat
- $Q$ (consequent): the car will not start

The second premise says "the car will not start", which is $Q$. The conclusion is $P$.

So the argument is: If $P$ then $Q$. $Q$. Therefore $P$. This is **affirming the consequent**, a classic fallacy.

Why it fails: the rule only tells us what happens when the battery is flat. A car can fail to start for other reasons (no fuel, a broken starter motor). So both premises can be true while the conclusion is false, which means the argument is **invalid**.`,
      whyWrong: [
        `Modus ponens needs the **if** part (the battery is flat) as the second premise and concludes the **then** part. Here it runs the other way: it starts from the then part.`,
        `Modus tollens needs the **then** part to be denied (the car **does** start) and concludes the if part is false (the battery is not flat). Here the then part is affirmed, not denied.`,
        `Denying the antecedent would be: "The battery is not flat, therefore the car will start." This argument starts from the then part, not from denying the if part.`,
        null,
      ],
      keyIdea: `Knowing the "then" part is true does not tell you the "if" part is true: that mistake is called affirming the consequent.`,
    },
    check: {
      optionValues: ['MP', 'MT', 'DA', 'AC'],
      compute: () => {
        const v = ['B', 'S']; // B: battery flat, S: car starts
        return argumentForm(
          v,
          (e) => e.B,
          (e) => !e.S,
          (e) => !e.S,
          (e) => e.B,
        );
      },
    },
  },
  {
    id: 'deductive-reasoning-004',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `Assume both statements are true: "All roses are flowers." and "All flowers need water."

Which statement **must** also be true?`,
    options: [
      `All roses need water.`,
      `Everything that needs water is a rose.`,
      `All flowers are roses.`,
      `Some flowers are not roses.`,
    ],
    correctIndex: 0,
    markScheme: {
      solution: `Picture the groups as circles (a Venn diagram):

- "All roses are flowers": the roses circle sits **inside** the flowers circle.
- "All flowers need water": the flowers circle sits **inside** the needs-water circle.

So roses are inside flowers, which are inside needs-water. Therefore every rose is inside the needs-water circle: **all roses need water**.

This chain "All $A$ are $B$, all $B$ are $C$, so all $A$ are $C$" is always valid.`,
      whyWrong: [
        null,
        `This reverses the chain. The premises put roses inside the needs-water group, not the other way round. Trees need water but are not roses.`,
        `This is the converse of the first statement. "All roses are flowers" does not mean "all flowers are roses": tulips are flowers too.`,
        `This is true in real life, but it does not follow from the two statements. They would both still be true if roses were the only flowers. A conclusion must be **forced** by the premises.`,
      ],
      keyIdea: `"All $A$ are $B$" and "All $B$ are $C$" force "All $A$ are $C$": nested circles stay nested.`,
    },
    check: {
      optionValues: ['all R W', 'all W R', 'all F R', 'some F not R'],
      compute: () =>
        uniqueCat(
          ['R', 'F', 'W'],
          [
            ['all', 'R', 'F'],
            ['all', 'F', 'W'],
          ],
          [
            ['all R W', ['all', 'R', 'W']],
            ['all W R', ['all', 'W', 'R']],
            ['all F R', ['all', 'F', 'R']],
            ['some F not R', ['someNot', 'F', 'R']],
          ],
        ),
    },
  },
  {
    id: 'deductive-reasoning-005',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `"Being a citizen is a **necessary** condition for voting in the national election."

Which statement means the same thing?`,
    options: [
      `If a person is a citizen, then they vote in the national election.`,
      `If a person votes in the national election, then they are a citizen.`,
      `A person votes in the national election if and only if they are a citizen.`,
      `If a person is not a citizen, then they might still vote in the national election.`,
    ],
    correctIndex: 1,
    markScheme: {
      solution: `"$X$ is **necessary** for $Y$" means you cannot have $Y$ without $X$. In if-then form:

$$\\text{If } Y \\text{, then } X.$$

Here $X$ = "is a citizen" and $Y$ = "votes". So the statement says: **if a person votes, then they are a citizen**.

Compare with "sufficient": "$X$ is **sufficient** for $Y$" means "If $X$, then $Y$" (having $X$ is enough to guarantee $Y$). The original sentence does **not** say citizenship is enough: plenty of citizens do not vote.`,
      whyWrong: [
        `This treats "necessary" as "sufficient". Being a citizen is required to vote, but it does not guarantee that a person votes.`,
        null,
        `This adds the extra claim that every citizen votes. "Necessary" gives only one direction; "if and only if" would mean necessary **and** sufficient.`,
        `This contradicts the statement. If citizenship is necessary, then a non-citizen cannot vote at all.`,
      ],
      keyIdea: `"$X$ is necessary for $Y$" means "If $Y$ then $X$"; "$X$ is sufficient for $Y$" means "If $X$ then $Y$".`,
    },
    check: {
      optionValues: ['C->V', 'V->C', 'V<->C', null],
      compute: () => {
        const v = ['C', 'V']; // C: citizen, V: votes
        const necessary: Prop = (e) => imp(e.V, e.C); // no voting without citizenship
        return uniqueEquivalent(v, necessary, [
          ['C->V', (e) => imp(e.C, e.V)],
          ['V->C', (e) => imp(e.V, e.C)],
          ['V<->C', (e) => e.V === e.C],
        ]);
      },
    },
  },
  {
    id: 'deductive-reasoning-006',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `In logic, what does it mean to say that an argument is **valid**?`,
    options: [
      `If all of its premises were true, its conclusion would have to be true.`,
      `Its conclusion is true.`,
      `All of its premises are true.`,
      `Its premises are true and its conclusion is also true.`,
    ],
    correctIndex: 0,
    markScheme: {
      solution: `**Validity is about the link** between the premises and the conclusion, not about whether the statements are actually true.

An argument is **valid** when it is impossible for all the premises to be true while the conclusion is false. In other words: *if* the premises were true, the conclusion would be guaranteed.

Two examples:

- "All fish can fly. A salmon is a fish. So a salmon can fly." This is **valid** (the conclusion is forced by the premises), even though the first premise and the conclusion are false.
- "Paris is in France. So $2 + 2 = 4$." Everything here is true, but the argument is **invalid**: the premise gives no reason for the conclusion.

An argument that is valid **and** has true premises is called **sound**.`,
      whyWrong: [
        null,
        `A valid argument can have a false conclusion if one of its premises is false (for example "All fish can fly, a salmon is a fish, so a salmon can fly"). Validity is about the link, not the truth of the conclusion.`,
        `True premises are part of being **sound**, not valid. A valid argument can have false premises.`,
        `True premises plus a true conclusion is not enough: "Paris is in France, so $2 + 2 = 4$" has both, yet the conclusion does not follow from the premise.`,
      ],
      keyIdea: `Valid means the conclusion is guaranteed whenever the premises are true; it says nothing about whether the premises actually are true.`,
    },
  },

  // ================================================================ exam
  {
    id: 'deductive-reasoning-007',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `Three facts are known about Sara:

- If Sara studies, she passes the exam.
- If Sara passes the exam, she graduates.
- Sara did **not** graduate.

What can be concluded?`,
    options: [
      `Sara studied but did not pass the exam.`,
      `Sara passed the exam.`,
      `Sara did not study.`,
      `Nothing can be concluded about whether Sara studied.`,
    ],
    correctIndex: 2,
    markScheme: {
      solution: `Let $S$ = studies, $P$ = passes, $G$ = graduates. The facts are: if $S$ then $P$; if $P$ then $G$; not $G$.

**Step 1.** Use the second rule with "not $G$". If she had passed, she would have graduated. She did not graduate, so she **did not pass** (modus tollens).

**Step 2.** Use the first rule with "not $P$". If she had studied, she would have passed. She did not pass, so she **did not study** (modus tollens again).

Shortcut: chain the rules first. "If $S$ then $P$" and "if $P$ then $G$" give "if $S$ then $G$". Its contrapositive is "if not $G$ then not $S$", so Sara did not study.`,
      whyWrong: [
        `The first half is impossible: if she had studied, the first rule says she would have passed. "Did not pass" is right, but the chain then also rules out studying.`,
        `If she had passed, the second rule says she would have graduated, but she did not. Passing is ruled out by modus tollens.`,
        null,
        `This is what you get if you think a "not" result cannot travel backwards through a rule. Modus tollens does exactly that: applied twice, it takes "not graduated" back to "not studied".`,
      ],
      keyIdea: `Modus tollens: from "If $P$ then $Q$" and "not $Q$", conclude "not $P$"; it can be chained back through several rules.`,
    },
    check: {
      optionValues: ['S and not P', 'P', 'not S', 'none'],
      compute: () => {
        const v = ['S', 'P', 'G'];
        const prem: Prop[] = [(e) => imp(e.S, e.P), (e) => imp(e.P, e.G), (e) => !e.G];
        return uniqueEntailed(v, prem, [
          ['S and not P', (e) => e.S && !e.P],
          ['P', (e) => e.P],
          ['not S', (e) => !e.S],
        ]);
      },
    },
  },
  {
    id: 'deductive-reasoning-008',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `Assume both statements are true: "Some students are athletes." and "All athletes are early risers."

Which statement **must** be true?`,
    options: [
      `All students are early risers.`,
      `Some students are early risers.`,
      `All early risers are athletes.`,
      `Some early risers are not students.`,
    ],
    correctIndex: 1,
    markScheme: {
      solution: `**Step 1.** "Some students are athletes" means there is at least one person who is both a student and an athlete. Call her Mona.

**Step 2.** "All athletes are early risers": Mona is an athlete, so Mona is an early riser.

**Step 3.** So Mona is a student **and** an early riser. That proves at least one student is an early riser: **some students are early risers**.

The other options cannot be proved, because the premises say nothing about students who are not athletes, or about early risers who are not athletes.`,
      whyWrong: [
        `This upgrades "some" to "all". Only some students are known to be athletes; the other students might not be early risers.`,
        null,
        `This is the converse of the second statement. "All athletes are early risers" does not mean every early riser is an athlete.`,
        `This could be false: if every early riser happened to be a student, both statements would still be true. Nothing forces an early riser outside the student group.`,
      ],
      keyIdea: `"Some $A$ are $B$" plus "All $B$ are $C$" gives "Some $A$ are $C$": follow the one known member through the chain.`,
    },
    check: {
      optionValues: ['all S E', 'some S E', 'all E A', 'some E not S'],
      compute: () =>
        uniqueCat(
          ['S', 'A', 'E'],
          [
            ['some', 'S', 'A'],
            ['all', 'A', 'E'],
          ],
          [
            ['all S E', ['all', 'S', 'E']],
            ['some S E', ['some', 'S', 'E']],
            ['all E A', ['all', 'E', 'A']],
            ['some E not S', ['someNot', 'E', 'S']],
          ],
        ),
    },
  },
  {
    id: 'deductive-reasoning-009',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `Assume both statements are true: "No reptiles are warm-blooded." and "All snakes are reptiles."

Which statement **must** be true?`,
    options: [
      `No reptiles are snakes.`,
      `Some warm-blooded animals are snakes.`,
      `Some reptiles are not snakes.`,
      `No snakes are warm-blooded.`,
    ],
    correctIndex: 3,
    markScheme: {
      solution: `Draw the groups:

- "No reptiles are warm-blooded": the reptiles circle and the warm-blooded circle do **not** overlap at all.
- "All snakes are reptiles": the snakes circle sits **inside** the reptiles circle.

A circle inside the reptiles circle cannot reach the warm-blooded circle, because the reptiles circle never touches it. So **no snakes are warm-blooded**.

Pattern: "No $B$ are $C$" and "All $A$ are $B$" give "No $A$ are $C$".`,
      whyWrong: [
        `This misreads the second statement. Snakes sit inside the reptile group, so (as long as there are any snakes) some reptiles **are** snakes.`,
        `This contradicts the premises: snakes are reptiles and no reptile is warm-blooded, so no snake can be warm-blooded.`,
        `True in real life, but not forced by the statements: they would both still hold if snakes were the only reptiles.`,
        null,
      ],
      keyIdea: `If group $A$ sits inside group $B$, and $B$ has no overlap with $C$, then $A$ has no overlap with $C$ either.`,
    },
    check: {
      optionValues: ['no R S', 'some W S', 'some R not S', 'no S W'],
      compute: () =>
        uniqueCat(
          ['R', 'W', 'S'],
          [
            ['no', 'R', 'W'],
            ['all', 'S', 'R'],
          ],
          [
            ['no R S', ['no', 'R', 'S']],
            ['some W S', ['some', 'W', 'S']],
            ['some R not S', ['someNot', 'R', 'S']],
            ['no S W', ['no', 'S', 'W']],
          ],
        ),
    },
  },
  {
    id: 'deductive-reasoning-010',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `Each argument below uses the same rule: "If a phone is in flight mode, then it cannot make calls."

1. The phone is in flight mode. So it cannot make calls.
2. The phone cannot make calls. So it is in flight mode.
3. The phone can make calls. So it is not in flight mode.
4. The phone is not in flight mode. So it can make calls.

How many of the four arguments are **valid**?`,
    options: [`1`, `2`, `3`, `4`],
    correctIndex: 1,
    markScheme: {
      solution: `Let $P$ = "in flight mode" and $Q$ = "cannot make calls". The rule is "If $P$ then $Q$".

| Argument | Pattern | Valid? |
| --- | --- | --- |
| 1 | $P$, so $Q$ | Valid (modus ponens) |
| 2 | $Q$, so $P$ | Invalid (affirming the consequent) |
| 3 | not $Q$, so not $P$ | Valid (modus tollens) |
| 4 | not $P$, so not $Q$ | Invalid (denying the antecedent) |

Counterexamples for the invalid ones:

- Argument 2: a phone may be unable to call because it has no signal, not because of flight mode.
- Argument 4: a phone that is not in flight mode might still be unable to call (flat battery).

So exactly **2** arguments are valid.`,
      whyWrong: [
        `This accepts only argument 1 and misses that argument 3 is **modus tollens**: if the phone can make calls, it cannot be in flight mode, otherwise the rule would be broken.`,
        null,
        `This accepts one of the two fallacies as well, usually argument 2 (affirming the consequent). A phone can be unable to call for other reasons, such as having no signal.`,
        `This accepts every argument, including both fallacies. Argument 4 denies the antecedent: a phone not in flight mode might still be unable to call because its battery is flat.`,
      ],
      keyIdea: `Of the four "if-then" patterns, only modus ponens and modus tollens are valid; affirming the consequent and denying the antecedent are fallacies.`,
    },
    check: {
      optionValues: [1, 2, 3, 4],
      compute: () => {
        const v = ['F', 'C']; // F: flight mode, C: can make calls
        const rule: Prop = (e) => imp(e.F, !e.C);
        const args: [Prop, Prop][] = [
          [(e) => e.F, (e) => !e.C],
          [(e) => !e.C, (e) => e.F],
          [(e) => e.C, (e) => !e.F],
          [(e) => !e.F, (e) => e.C],
        ];
        return args.filter(([given, concl]) => entails(v, [rule, given], concl)).length;
      },
    },
  },
  {
    id: 'deductive-reasoning-011',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `"You will get the job **only if** you pass the interview."

Assuming this statement is true, which statement must also be true?`,
    options: [
      `If you fail the interview, you will not get the job.`,
      `If you pass the interview, you will get the job.`,
      `If you do not get the job, then you failed the interview.`,
      `You get the job if and only if you pass the interview.`,
    ],
    correctIndex: 0,
    markScheme: {
      solution: `"$A$ only if $B$" means $B$ is **necessary** for $A$, which in if-then form is "If $A$, then $B$".

Here: "If you get the job, then you passed the interview."

Now take the **contrapositive** (swap the parts and negate both), which is always equivalent:

"If you did **not** pass the interview, then you did **not** get the job."

That is the same as "If you fail the interview, you will not get the job."

Note that passing is **not** said to be enough: you could pass the interview and still not get the job (another candidate might be better).`,
      whyWrong: [
        null,
        `This reads "only if" as plain "if". Passing the interview is necessary for the job, not a guarantee of it.`,
        `This is the inverse of "If you get the job, you passed", which is equivalent to "If you pass, you get the job". That is the same mistake of treating a necessary condition as sufficient.`,
        `This adds the extra direction "passing guarantees the job". "Only if" gives just one direction; "if and only if" would need both.`,
      ],
      keyIdea: `"$A$ only if $B$" means "If $A$ then $B$", so its contrapositive "If not $B$ then not $A$" is also true.`,
    },
    check: {
      optionValues: ['notP->notJ', 'P->J', 'notJ->notP', 'J<->P'],
      compute: () => {
        const v = ['J', 'P']; // J: get the job, P: pass the interview
        const prem: Prop[] = [(e) => imp(e.J, e.P)];
        return uniqueEntailed(v, prem, [
          ['notP->notJ', (e) => imp(!e.P, !e.J)],
          ['P->J', (e) => imp(e.P, e.J)],
          ['notJ->notP', (e) => imp(!e.J, !e.P)],
          ['J<->P', (e) => e.J === e.P],
        ]);
      },
    },
  },
  {
    id: 'deductive-reasoning-012',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `Ali, Bea, Chen and Dana each own exactly one pet. The four pets are a cat, a dog, a fish and a rabbit (one each).

- Ali owns neither the cat nor the dog.
- Bea owns either the rabbit or the fish.
- Chen does not own the cat.
- Dana owns neither the fish nor the rabbit.

Which statement **must** be true?`,
    options: [`Ali owns the fish.`, `Bea owns the rabbit.`, `Dana owns the cat.`, `Chen owns the rabbit.`],
    correctIndex: 2,
    markScheme: {
      solution: `Write down what each person **could** own:

| Person | Possible pets |
| --- | --- |
| Ali | fish, rabbit (not cat, not dog) |
| Bea | fish, rabbit |
| Chen | dog, fish, rabbit (not cat) |
| Dana | cat, dog (not fish, not rabbit) |

**Step 1.** Ali and Bea can only have the fish or the rabbit, and there is one of each. So between them they take **both** the fish and the rabbit.

**Step 2.** That leaves the cat and the dog for Chen and Dana.

**Step 3.** Chen does not own the cat, so Chen owns the **dog** and Dana owns the **cat**.

Ali and Bea could be either way round (Ali fish and Bea rabbit, or Ali rabbit and Bea fish), so only "Dana owns the cat" is certain.`,
      whyWrong: [
        `This is possible but not forced. Ali and Bea share the fish and the rabbit between them, and no clue says which way round.`,
        `This is possible but not forced: Bea could just as well have the fish, with Ali taking the rabbit.`,
        null,
        `Impossible: Ali and Bea between them must take the fish and the rabbit, so Chen is left with the dog.`,
      ],
      keyIdea: `In a "must be true" clue puzzle, list every possibility and keep only facts that hold in all remaining cases.`,
    },
    check: {
      optionValues: ['Ali fish', 'Bea rabbit', 'Dana cat', 'Chen rabbit'],
      compute: () => {
        const pets = ['cat', 'dog', 'fish', 'rabbit'];
        // each solution is [Ali, Bea, Chen, Dana]
        const sols = perms(pets).filter(
          ([a, b, c, d]) =>
            a !== 'cat' && a !== 'dog' && (b === 'rabbit' || b === 'fish') && c !== 'cat' && d !== 'fish' && d !== 'rabbit',
        );
        if (sols.length === 0) return 'no solution';
        const opts: [string, (s: string[]) => boolean][] = [
          ['Ali fish', (s) => s[0] === 'fish'],
          ['Bea rabbit', (s) => s[1] === 'rabbit'],
          ['Dana cat', (s) => s[3] === 'cat'],
          ['Chen rabbit', (s) => s[2] === 'rabbit'],
        ];
        const must = opts.filter(([, f]) => sols.every(f)).map(([k]) => k);
        return must.length === 1 ? must[0] : `found:${must.join(',')}`;
      },
    },
  },
  {
    id: 'deductive-reasoning-013',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `What is the **negation** (the exact logical opposite) of the statement "All the students passed the test"?`,
    options: [
      `No student passed the test.`,
      `At least one student did not pass the test.`,
      `At least one student passed the test.`,
      `Some students passed the test and some did not.`,
    ],
    correctIndex: 1,
    markScheme: {
      solution: `The negation must be true in **exactly** the situations where the original is false.

"All the students passed" is false as soon as **one** student failed. It does not need everybody to fail. So the negation is:

**"At least one student did not pass."** (also written "Not all the students passed".)

Check with a class of 10:

| Situation | "All passed" | "At least one did not pass" |
| --- | --- | --- |
| 10 passed | true | false |
| 9 passed, 1 failed | false | true |
| 0 passed | false | true |

The two columns are always opposite, which is exactly what a negation needs.

Rule: the negation of "all are" is "some are not"; the negation of "some are" is "none are".`,
      whyWrong: [
        `This is too strong: "not all" is not the same as "none". If 9 out of 10 passed, the original is false, but this statement is also false.`,
        null,
        `This can be true at the same time as the original (when everyone passes), so it cannot be its opposite.`,
        `This misses the case where nobody passed. Then the original is false, but this statement is also false, because nobody passed.`,
      ],
      keyIdea: `The negation of "All $A$ are $B$" is "Some $A$ are not $B$" (at least one is not), not "No $A$ are $B$".`,
    },
    check: {
      optionValues: ['none passed', 'at least one failed', 'at least one passed', 'mixed'],
      compute: () => {
        // every class of 1 to 4 students and every pass/fail pattern
        const classes: boolean[][] = [];
        for (let n = 1; n <= 4; n++) for (let mask = 0; mask < 1 << n; mask++) classes.push(Array.from({ length: n }, (_, i) => ((mask >> i) & 1) === 1));
        const allPassed = (c: boolean[]) => c.every((x) => x);
        const opts: [string, (c: boolean[]) => boolean][] = [
          ['none passed', (c) => c.every((x) => !x)],
          ['at least one failed', (c) => c.some((x) => !x)],
          ['at least one passed', (c) => c.some((x) => x)],
          ['mixed', (c) => c.some((x) => x) && c.some((x) => !x)],
        ];
        const hits = opts.filter(([, f]) => classes.every((c) => f(c) === !allPassed(c))).map(([k]) => k);
        return hits.length === 1 ? hits[0] : `found:${hits.join(',')}`;
      },
    },
  },
  {
    id: 'deductive-reasoning-014',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `Which **one** of these arguments is logically valid?`,
    options: [
      `All pilots are trained. No trained people are careless. So no pilots are careless.`,
      `All cats are mammals. Some mammals are black. So some cats are black.`,
      `Some cars are red. Some red things are fast. So some cars are fast.`,
      `No fish are birds. No birds are dogs. So no fish are dogs.`,
    ],
    correctIndex: 0,
    markScheme: {
      solution: `Test each argument by asking: *could the premises be true while the conclusion is false?* If yes, it is invalid.

- **Pilots:** pilots sit inside the trained group, and the trained group has no overlap with the careless group. So pilots cannot overlap with careless people. The conclusion is forced: **valid**.
- **Cats:** the black mammals could all be dogs or horses. Both premises stay true while "some cats are black" fails, so it is invalid. The middle group (mammals) never links cats to black things.
- **Cars:** the red cars and the fast red things could be completely different objects (red cars that are slow, fast red motorbikes). Invalid: two "some" premises never give a conclusion.
- **Fish/dogs:** the conclusion happens to be true, but it is not forced. The same pattern "No cats are birds. No birds are mammals. So no cats are mammals." has true premises and a false conclusion. Invalid: two "no" premises never give a conclusion.

Only the pilots argument is valid.`,
      whyWrong: [
        null,
        `Invalid: the black mammals might all be other animals, such as black dogs, so both premises can be true while no cat is black. Knowing "some mammals" does not tell you which mammals.`,
        `Invalid: two "some" premises can talk about different objects. The red things that are fast might not be cars at all.`,
        `The conclusion is true in real life, but it does not follow. The same form "No cats are birds. No birds are mammals. So no cats are mammals." has true premises and a false conclusion.`,
      ],
      keyIdea: `An argument is valid only if no situation makes all premises true and the conclusion false; a true conclusion alone does not make it valid.`,
    },
    check: {
      optionValues: ['pilots', 'cats', 'cars', 'fish'],
      compute: () => {
        const args: [string, string[], Cat[], Cat][] = [
          ['pilots', ['P', 'T', 'C'], [['all', 'P', 'T'], ['no', 'T', 'C']], ['no', 'P', 'C']],
          ['cats', ['C', 'M', 'B'], [['all', 'C', 'M'], ['some', 'M', 'B']], ['some', 'C', 'B']],
          ['cars', ['C', 'R', 'F'], [['some', 'C', 'R'], ['some', 'R', 'F']], ['some', 'C', 'F']],
          ['fish', ['F', 'B', 'D'], [['no', 'F', 'B'], ['no', 'B', 'D']], ['no', 'F', 'D']],
        ];
        const res = args.map(([k, terms, prem, concl]) => [k, catFollowsBoth(terms, prem, concl)] as const);
        if (res.some(([, v]) => v === null)) return 'ambiguous';
        const hits = res.filter(([, v]) => v).map(([k]) => k);
        return hits.length === 1 ? hits[0] : `found:${hits.join(',')}`;
      },
    },
  },
  {
    id: 'deductive-reasoning-015',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `An argument has a missing premise:

"All managers attend the Monday meeting. [missing premise]. Therefore, Layla attends the Monday meeting."

Which statement, used as the missing premise, makes the argument **valid**?`,
    options: [
      `Everyone who attends the Monday meeting is a manager.`,
      `Layla works in the same office as the managers.`,
      `Some people who attend the Monday meeting are not managers.`,
      `Layla is a manager.`,
    ],
    correctIndex: 3,
    markScheme: {
      solution: `The first premise is a rule: "If a person is a manager, then they attend the meeting".

To conclude that Layla attends using **modus ponens**, we need the "if" part to be true for Layla: **Layla is a manager**.

Then the argument reads: All managers attend. Layla is a manager. Therefore Layla attends. The conclusion is forced, so the argument is valid.

None of the other statements puts Layla inside the managers group, so with any of them Layla could still be absent from the meeting.`,
      whyWrong: [
        `This is the converse of the first premise. It tells us about people who already attend; it never says that Layla attends.`,
        `Sharing an office with the managers does not make Layla a manager, so the rule about managers does not apply to her.`,
        `This only talks about other people at the meeting. Layla could still be absent.`,
        null,
      ],
      keyIdea: `To apply a rule "All $A$ are $B$" to one individual, you need the premise that the individual is an $A$.`,
    },
    check: {
      optionValues: ['attendees are managers', 'same office', 'some non-managers attend', 'Layla is a manager'],
      compute: () => {
        // L = Layla, X = another person. M: manager, A: attends, O: Layla in the managers' office.
        const v = ['ML', 'AL', 'MX', 'AX', 'O'];
        const rule: Prop = (e) => imp(e.ML, e.AL) && imp(e.MX, e.AX);
        const extras: [string, Prop][] = [
          ['attendees are managers', (e) => imp(e.AL, e.ML) && imp(e.AX, e.MX)],
          ['same office', (e) => e.O],
          ['some non-managers attend', (e) => e.AX && !e.MX],
          ['Layla is a manager', (e) => e.ML],
        ];
        const hits = extras.filter(([, x]) => entails(v, [rule, x], (e) => e.AL)).map(([k]) => k);
        return hits.length === 1 ? hits[0] : `found:${hits.join(',')}`;
      },
    },
  },

  // ================================================================ challenge
  {
    id: 'deductive-reasoning-016',
    subtopic: 'deductive-reasoning',
    difficulty: 'challenge',
    stem: `Each of the statements $P$, $Q$, $R$ and $S$ is either true or false. You are told:

- If $P$ is true, then $Q$ is true.
- If $R$ is true, then $Q$ is false.
- If $S$ is false, then $R$ is true.
- $P$ is true.

Which of the following must be true?`,
    options: [`$R$ is true.`, `$R$ is false and $S$ is true.`, `$S$ is false.`, `$Q$ is true, but nothing can be said about $S$.`],
    correctIndex: 1,
    markScheme: {
      solution: `Work forwards from the one fact you know for certain.

**Step 1.** $P$ is true, and "if $P$ then $Q$", so $Q$ is **true** (modus ponens).

**Step 2.** "If $R$ then not $Q$". We know $Q$ is true, so "not $Q$" is false. By modus tollens, $R$ is **false**. (If $R$ were true, $Q$ would have to be false.)

**Step 3.** "If not $S$ then $R$". We know $R$ is false. By modus tollens, "not $S$" is false, so $S$ is **true**.

Result: $P$ true, $Q$ true, $R$ false, $S$ true. Check every rule: rule 1 ($P$ and $Q$ both true) holds; rule 2 has a false "if" part so it holds; rule 3 has a false "if" part so it holds.

So "$R$ is false and $S$ is true" must be true.`,
      whyWrong: [
        `This reads the second rule backwards (as "if $Q$ then $R$"). In fact, $R$ true would force $Q$ false, but $Q$ is true, so $R$ must be false.`,
        null,
        `If $S$ were false, the third rule would make $R$ true, and then the second rule would make $Q$ false. But $Q$ is true, so $S$ cannot be false.`,
        `$Q$ is true, but stopping there misses two modus tollens steps: $Q$ true forces $R$ false, and $R$ false forces $S$ true. So $S$ **is** determined.`,
      ],
      keyIdea: `Chain modus ponens and modus tollens one step at a time from the known fact; a false "then" part sends "false" back to the "if" part.`,
    },
    check: {
      optionValues: ['R', 'not R and S', 'not S', null],
      compute: () => {
        const v = ['P', 'Q', 'R', 'S'];
        const prem: Prop[] = [(e) => imp(e.P, e.Q), (e) => imp(e.R, !e.Q), (e) => imp(!e.S, e.R), (e) => e.P];
        return uniqueEntailed(v, prem, [
          ['R', (e) => e.R],
          ['not R and S', (e) => !e.R && e.S],
          ['not S', (e) => !e.S],
        ]);
      },
    },
  },
  {
    id: 'deductive-reasoning-017',
    subtopic: 'deductive-reasoning',
    difficulty: 'challenge',
    stem: `Omar, Priya and Hana each play a different sport (tennis, swimming, chess) and each come from a different city (Dubai, Abu Dhabi, Sharjah).

1. The swimmer is from Abu Dhabi.
2. The chess player is from Dubai.
3. Omar is not from Abu Dhabi.
4. Priya does not play tennis.
5. Omar does not play tennis.

Which statement **must** be true?`,
    options: [`Priya is from Abu Dhabi.`, `Priya is from Dubai.`, `Omar is from Sharjah.`, `Hana is from Abu Dhabi.`],
    correctIndex: 0,
    markScheme: {
      solution: `**Step 1 (link the attributes).** Clues 1 and 2 tie sport to city: swimmer = Abu Dhabi, chess = Dubai. Since the cities are all different, the tennis player must be from the remaining city, **Sharjah**.

**Step 2.** Clues 4 and 5: neither Priya nor Omar plays tennis, so **Hana plays tennis**, and from Step 1 Hana is from Sharjah.

**Step 3.** Omar and Priya play swimming and chess in some order. Omar is not from Abu Dhabi (clue 3), so Omar is not the swimmer. So **Omar plays chess** (from Dubai) and **Priya swims** (from Abu Dhabi).

| Person | Sport | City |
| --- | --- | --- |
| Omar | chess | Dubai |
| Priya | swimming | Abu Dhabi |
| Hana | tennis | Sharjah |

So "Priya is from Abu Dhabi" must be true.`,
      whyWrong: [
        null,
        `This needs Priya to be the chess player. But Omar cannot swim (he is not from Abu Dhabi) and does not play tennis, so Omar is the chess player from Dubai.`,
        `Sharjah belongs to the tennis player (the city left over after clues 1 and 2), and clue 5 says Omar does not play tennis.`,
        `Hana must play tennis, since clues 4 and 5 rule out the other two. The tennis player is from the leftover city, Sharjah, not Abu Dhabi.`,
      ],
      keyIdea: `In a grid puzzle, use clues that link two attributes to merge them, then eliminate until each person has exactly one option.`,
    },
    check: {
      optionValues: ['Priya Abu Dhabi', 'Priya Dubai', 'Omar Sharjah', 'Hana Abu Dhabi'],
      compute: () => {
        // people order: Omar, Priya, Hana
        const sols: { sport: string[]; city: string[] }[] = [];
        for (const sport of perms(['tennis', 'swimming', 'chess']))
          for (const city of perms(['Dubai', 'Abu Dhabi', 'Sharjah'])) {
            const ok =
              [0, 1, 2].every((i) => sport[i] !== 'swimming' || city[i] === 'Abu Dhabi') &&
              [0, 1, 2].every((i) => sport[i] !== 'chess' || city[i] === 'Dubai') &&
              city[0] !== 'Abu Dhabi' &&
              sport[1] !== 'tennis' &&
              sport[0] !== 'tennis';
            if (ok) sols.push({ sport, city });
          }
        if (sols.length === 0) return 'no solution';
        const opts: [string, (s: { city: string[] }) => boolean][] = [
          ['Priya Abu Dhabi', (s) => s.city[1] === 'Abu Dhabi'],
          ['Priya Dubai', (s) => s.city[1] === 'Dubai'],
          ['Omar Sharjah', (s) => s.city[0] === 'Sharjah'],
          ['Hana Abu Dhabi', (s) => s.city[2] === 'Abu Dhabi'],
        ];
        const must = opts.filter(([, f]) => sols.every(f)).map(([k]) => k);
        return must.length === 1 ? must[0] : `found:${must.join(',')}`;
      },
    },
  },
  {
    id: 'deductive-reasoning-018',
    subtopic: 'deductive-reasoning',
    difficulty: 'challenge',
    stem: `Assume all three statements are true:

- All coders are logical.
- Some logical people are musicians.
- No musicians are impatient.

Which statement **must** be true?`,
    options: [
      `Some coders are musicians.`,
      `No coders are impatient.`,
      `Some logical people are not impatient.`,
      `Some impatient people are not logical.`,
    ],
    correctIndex: 2,
    markScheme: {
      solution: `**Step 1.** "Some logical people are musicians": there is at least one person who is logical and a musician. Call him Karim.

**Step 2.** "No musicians are impatient": Karim is a musician, so Karim is **not** impatient.

**Step 3.** So Karim is logical and not impatient. Therefore **some logical people are not impatient**.

Why the coders drop out: "All coders are logical" puts coders inside the logical group, but the logical musicians (like Karim) might be completely different people from the coders. So nothing definite can be said about coders and musicians, or about coders and impatience.`,
      whyWrong: [
        `This is the "undistributed middle" mistake: coders are only part of the logical group, and the logical people who are musicians might not be coders at all.`,
        `Only musicians are known to be patient. A coder who is not a musician could be impatient without breaking any statement.`,
        null,
        `Not forced: every impatient person could be logical (for example, an impatient coder who is not a musician), and all three statements would still be true.`,
      ],
      keyIdea: `With "some" premises, follow the one guaranteed individual through the other statements, and only claim what holds for that individual.`,
    },
    check: {
      optionValues: ['some C M', 'no C I', 'some L not I', 'some I not L'],
      compute: () =>
        uniqueCat(
          ['C', 'L', 'M', 'I'],
          [
            ['all', 'C', 'L'],
            ['some', 'L', 'M'],
            ['no', 'M', 'I'],
          ],
          [
            ['some C M', ['some', 'C', 'M']],
            ['no C I', ['no', 'C', 'I']],
            ['some L not I', ['someNot', 'L', 'I']],
            ['some I not L', ['someNot', 'I', 'L']],
          ],
        ),
    },
  },
  {
    id: 'deductive-reasoning-019',
    subtopic: 'deductive-reasoning',
    difficulty: 'challenge',
    stem: `At a training centre, these rules always hold:

- Passing the exam is **sufficient** for getting a certificate.
- Getting a certificate is **necessary** for being hired.
- Attending the course is **necessary** for passing the exam.

Which statement must be true?`,
    options: [
      `Anyone who was hired attended the course.`,
      `Anyone with a certificate passed the exam.`,
      `Anyone who attended the course got a certificate.`,
      `Anyone who passed the exam attended the course and got a certificate.`,
    ],
    correctIndex: 3,
    markScheme: {
      solution: `Translate each rule into if-then form. "$X$ is sufficient for $Y$" means "if $X$ then $Y$"; "$X$ is necessary for $Y$" means "if $Y$ then $X$".

1. Pass $\\Rightarrow$ Certificate
2. Hired $\\Rightarrow$ Certificate
3. Pass $\\Rightarrow$ Attend

Now test the options:

- "Passed $\\Rightarrow$ attended and got a certificate": rules 3 and 1 both start from Pass, so both follow. **Must be true.**
- "Hired $\\Rightarrow$ attended": rule 2 takes Hired to Certificate, but no rule goes from Certificate back to Pass, so we cannot reach Attend.
- "Certificate $\\Rightarrow$ passed": the converse of rule 1, not given.
- "Attended $\\Rightarrow$ certificate": no rule starts from Attend (rule 3 ends there).

So only the last statement is guaranteed.`,
      whyWrong: [
        `Hired leads to Certificate, but a certificate need not come from passing the exam (passing is sufficient, not necessary), so the chain cannot reach the course.`,
        `This is the converse of the first rule. Passing guarantees a certificate, but a certificate might be gained another way.`,
        `This reads the third rule backwards (as "attend $\\Rightarrow$ pass") and then chains it with the first rule. But attending is necessary for passing, not sufficient: you can attend and still fail, and then no rule gives you a certificate.`,
        null,
      ],
      keyIdea: `Translate "sufficient" as "if $X$ then $Y$" and "necessary" as "if $Y$ then $X$", then only follow arrows in their given direction.`,
    },
    check: {
      optionValues: ['H->A', 'C->P', 'A->C', 'P->(A and C)'],
      compute: () => {
        const v = ['P', 'C', 'H', 'A']; // pass, certificate, hired, attend
        const prem: Prop[] = [(e) => imp(e.P, e.C), (e) => imp(e.H, e.C), (e) => imp(e.P, e.A)];
        return uniqueEntailed(v, prem, [
          ['H->A', (e) => imp(e.H, e.A)],
          ['C->P', (e) => imp(e.C, e.P)],
          ['A->C', (e) => imp(e.A, e.C)],
          ['P->(A and C)', (e) => imp(e.P, e.A && e.C)],
        ]);
      },
    },
  },
  {
    id: 'deductive-reasoning-020',
    subtopic: 'deductive-reasoning',
    difficulty: 'challenge',
    stem: `In a school, every student who takes Physics also takes Maths, no student who takes Art takes Maths, and at least one student takes Art.

How many of the following conclusions **must** be true?

1. No student who takes Physics takes Art.
2. Some students who take Art do not take Physics.
3. Every student who takes Maths takes Physics.
4. Some students take neither Art nor Maths.`,
    options: [`1`, `2`, `3`, `4`],
    correctIndex: 1,
    markScheme: {
      solution: `Picture the groups: Physics sits **inside** Maths, and Art does **not overlap** Maths at all. The Art group has at least one member.

1. A Physics student also takes Maths, and nobody in Maths takes Art. So no Physics student takes Art. **Must be true.**
2. Pick an Art student (one exists). They do not take Maths, so they cannot take Physics (Physics is inside Maths). So some Art students do not take Physics. **Must be true.**
3. This is the converse of "every Physics student takes Maths". There could be Maths students who do not take Physics. **Not forced.**
4. Nothing says such a student exists: every student might take Art or Maths. **Not forced.**

So **2** of the conclusions must be true.`,
      whyWrong: [
        `This usually misses conclusion 2: an Art student is guaranteed to exist, and since no Art student takes Maths, that student cannot take Physics either.`,
        null,
        `This accepts one extra conclusion: either conclusion 3 (the converse of the first fact) or conclusion 4 (but no student is said to take neither subject).`,
        `This accepts every conclusion, including conclusion 3 (a converse) and conclusion 4 (nothing guarantees a student outside both Art and Maths).`,
      ],
      keyIdea: `Draw the groups as nested or separate circles, then accept a conclusion only if no arrangement of the circles allowed by the facts can break it.`,
    },
    check: {
      optionValues: [1, 2, 3, 4],
      compute: () => {
        const terms = ['P', 'M', 'A'];
        const prem: Cat[] = [
          ['all', 'P', 'M'],
          ['no', 'A', 'M'],
          ['some', 'A', 'A'],
        ];
        const concl: Cat[] = [
          ['no', 'P', 'A'],
          ['someNot', 'A', 'P'],
          ['all', 'M', 'P'],
          ['some', '~A', '~M'],
        ];
        const res = concl.map((c) => catFollowsBoth(terms, prem, c));
        return res.some((r) => r === null) ? -1 : res.filter((r) => r).length;
      },
    },
  },
];
