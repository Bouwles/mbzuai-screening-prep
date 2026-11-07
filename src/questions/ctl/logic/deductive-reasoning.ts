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
      asking: 'Using only the two statements, what do we now know for certain about 84?',
      solution:
        'Statement 1 is an if-then rule. The "if" part is the condition: divisible by 6, meaning it divides by 6 with nothing left over. The "then" part is what the rule promises: divisible by 3.\n\n' +
        'An if-then rule says: whenever the "if" part is true, the "then" part must be true as well.\n\n' +
        'Statement 2 says that 84 is divisible by 6. So 84 meets the "if" part of the rule.\n\n' +
        'So the rule applies to 84, and its "then" part must be true: 84 is divisible by 3. You can confirm this: $84 \\div 3 = 28$.',
      conclusion: 'The rule\'s condition is met, so its promise holds, which gives exactly: 84 is divisible by 3.',
      whyWrong: [
        `This is the **converse** of statement 1 (the two parts swapped). The converse is not implied, and here it is actually false: 9 is divisible by 3 but not by 6.`,
        null,
        `This contradicts statement 1. Since 84 meets the "if" part (divisible by 6), the rule forces the "then" part (divisible by 3) to be true.`,
        `A general "if-then" rule applies to **every** case that meets its condition. Applying it to one particular number (84) is exactly what modus ponens does.`,
      ],
      keyIdea: 'Spot a rule plus a fact that matches its "if" part. Then the "then" part must be true. This pattern is called modus ponens: if $P$ then $Q$; $P$ is true; so $Q$ is true.',
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
      asking: 'Which sentence says exactly the same thing as the rule about squares?',
      solution:
        'Call the two parts $P$ = "it is a square" and $Q$ = "it has four sides". The rule is "If $P$ then $Q$".\n\n' +
        '**Logically equivalent** means the two statements are true in exactly the same situations. They say the same thing in different words.\n\n' +
        'Think about a shape that does not have four sides, such as a triangle. Could it be a square? No, because the rule would then give it four sides.\n\n' +
        'So if $Q$ is false, $P$ must be false too. That means we swap the two parts and make both negative: "If a shape does not have four sides, then it is not a square." This form is called the **contrapositive**.',
      conclusion: 'Swapping the parts and negating both keeps the meaning, so the equivalent statement is: If a shape does not have four sides, then it is not a square.',
      whyWrong: [
        `This is the **converse** (the two parts swapped). It is false: a rectangle has four sides but is not a square.`,
        `This is the **inverse** (both parts negated, order kept). It is false: a rectangle is not a square but still has four sides.`,
        null,
        `This is the **negation** of the original rule: it says the rule is broken. A negation always has the opposite truth value, so it can never be equivalent.`,
      ],
      keyIdea: 'For "If $P$ then $Q$", the form that always means the same is the contrapositive: "If not $Q$ then not $P$" (swap the parts and negate both). Swapping alone or negating alone can change the meaning, so test those with an example like a rectangle.',
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
      asking: 'Does the conclusion about the battery have to be true, and what is this reasoning called?',
      solution:
        'Split the rule into two parts. The "if" part, called the **antecedent**, is "the battery is flat". The "then" part, called the **consequent**, is "the car will not start".\n\n' +
        'The next sentence says "the car will not start". That matches the "then" part. So the argument starts from the "then" part and works backwards to the "if" part.\n\n' +
        'Does that have to work? No. The car could fail to start because it has no fuel, even with a good battery. The rule would still be true in that situation.\n\n' +
        'So the starting facts can be true while the conclusion is false, which makes the argument **invalid**. Stating that the "then" part is true is called affirming it, so this mistake is called **affirming the consequent**.',
      conclusion: 'The conclusion can be false, and the argument starts from the "then" part, so the correct description is Invalid: it affirms the consequent.',
      whyWrong: [
        `Modus ponens needs the **if** part (the battery is flat) as the second premise and concludes the **then** part. Here it runs the other way: it starts from the then part.`,
        `Modus tollens needs the **then** part to be denied (the car **does** start) and concludes the if part is false (the battery is not flat). Here the then part is affirmed, not denied.`,
        `Denying the antecedent would be: "The battery is not flat, therefore the car will start." This argument starts from the then part, not from denying the if part.`,
        null,
      ],
      keyIdea: 'Label the rule $P$ then $Q$, then see which part the next sentence uses. $P$ so $Q$ and not $Q$ so not $P$ are valid. $Q$ so $P$ (affirming the consequent) and not $P$ so not $Q$ (denying the antecedent) are invalid.',
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
      asking: 'What do the two statements together force to be true?',
      solution:
        'Think of each group as a circle. "All roses are flowers" puts the roses circle completely inside the flowers circle.\n\n' +
        '"All flowers need water" puts the flowers circle completely inside the needs-water circle.\n\n' +
        'A circle inside a circle inside a third circle is still inside the third one. So pick any rose: it is a flower, and every flower needs water, so that rose needs water.\n\n' +
        'That works for every rose, so all roses need water.',
      conclusion: 'The circles nest as roses, flowers, needs water, so the statement that must be true is: All roses need water.',
      whyWrong: [
        null,
        `This reverses the chain. The premises put roses inside the needs-water group, not the other way round. Trees need water but are not roses.`,
        `This is the converse of the first statement. "All roses are flowers" does not mean "all flowers are roses": tulips are flowers too.`,
        `This is true in real life, but it does not follow from the two statements. They would both still be true if roses were the only flowers. A conclusion must be **forced** by the premises.`,
      ],
      keyIdea: 'For "All $A$ are $B$" and "All $B$ are $C$", draw nested circles to get "All $A$ are $C$". The direction matters: "All $A$ are $B$" never tells you that all $B$ are $A$.',
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
      asking: 'Which if-then sentence says that you must be a citizen in order to vote?',
      solution:
        'A **necessary** condition is something you must have, or the thing cannot happen. A ticket is necessary for a train ride: no ticket, no ride.\n\n' +
        'A necessary condition is a requirement, not a guarantee. Having a ticket does not force you to travel.\n\n' +
        'In the same way, every voter must be a citizen, but a citizen does not have to vote.\n\n' +
        'So the voter goes in the "if" part and the requirement goes in the "then" part: if a person votes, then they must have met the requirement of being a citizen.',
      conclusion: 'Anyone who votes must have met the requirement, so the matching statement is: If a person votes in the national election, then they are a citizen.',
      whyWrong: [
        `This treats "necessary" as "sufficient". Being a citizen is required to vote, but it does not guarantee that a person votes.`,
        null,
        `This adds the extra claim that every citizen votes. "Necessary" gives only one direction; "if and only if" would mean necessary **and** sufficient.`,
        `This contradicts the statement. If citizenship is necessary, then a non-citizen cannot vote at all.`,
      ],
      keyIdea: '"$X$ is necessary for $Y$" becomes "If $Y$ then $X$": the requirement goes after "then". Test it with an everyday case: a ticket is necessary for a ride, so if you ride, you have a ticket.',
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
      asking: 'What does the word "valid" mean when we describe an argument?',
      solution:
        'An argument has **premises** (the statements it starts from) and a **conclusion** (what it claims from them).\n\n' +
        'Take this one: "All fish can fly. A salmon is a fish. So a salmon can fly." The first premise is false, and so is the conclusion. Yet the reasoning itself works: if the premises were true, a salmon would have to be able to fly.\n\n' +
        'Logicians call that argument **valid**. Validity is only about the link: if all the premises were true, the conclusion would have to be true.',
      conclusion: 'Validity tests the link rather than real-life truth, so it means: If all of its premises were true, its conclusion would have to be true.',
      whyWrong: [
        null,
        `A valid argument can have a false conclusion if one of its premises is false (for example "All fish can fly, a salmon is a fish, so a salmon can fly"). Validity is about the link, not the truth of the conclusion.`,
        `True premises are part of being **sound**, not valid. A valid argument can have false premises.`,
        `True premises plus a true conclusion is not enough: "Paris is in France, so $2 + 2 = 4$" has both, yet the conclusion does not follow from the premise.`,
      ],
      keyIdea: 'To test validity, pretend the premises are true even if they sound silly, then try to imagine the conclusion being false. If you can, it is invalid. If you cannot, it is valid. A valid argument with true premises is called sound.',
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
      asking: 'Given that Sara did not graduate, what else do we know about her?',
      solution:
        'Write the rules as a chain: studies $\\to$ passes $\\to$ graduates. Each arrow means "if this happens, the next thing happens".\n\n' +
        'We know Sara did not graduate. Could she have passed? No, because passing would have made her graduate by the second rule. So she did not pass.\n\n' +
        'Now use the first rule the same way. Could she have studied? No, because studying would have made her pass, and we have just found that she did not pass.',
      conclusion: '"Not graduated" travels back along the chain through "not passed", which gives: Sara did not study.',
      whyWrong: [
        `The first half is impossible: if she had studied, the first rule says she would have passed. "Did not pass" is right, but the chain then also rules out studying.`,
        `If she had passed, the second rule says she would have graduated, but she did not. Passing is ruled out by modus tollens.`,
        null,
        `This is what you get if you think a "not" result cannot travel backwards through a rule. Modus tollens does exactly that: applied twice, it takes "not graduated" back to "not studied".`,
      ],
      keyIdea: 'Chain the if-then rules with arrows. When the last thing in a chain is false, every earlier thing must be false too, so go backwards one arrow at a time. This backwards step is called modus tollens: if $P$ then $Q$; not $Q$; so not $P$.',
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
      asking: 'What must be true about students and early risers?',
      solution:
        'In logic, **some** means at least one. So "Some students are athletes" means there is at least one person who is both a student and an athlete.\n\n' +
        'Give that person a name: Sam. So Sam is a student and an athlete.\n\n' +
        '"All athletes are early risers" covers every athlete, including Sam. So Sam is an early riser.\n\n' +
        'Sam is a student and also an early riser. One such person is enough to say "some" here.',
      conclusion: 'Sam alone proves the link, so the statement that must be true is: Some students are early risers.',
      whyWrong: [
        `This upgrades "some" to "all". Only some students are known to be athletes; the other students might not be early risers.`,
        null,
        `This is the converse of the second statement. "All athletes are early risers" does not mean every early riser is an athlete.`,
        `This could be false: if every early riser happened to be a student, both statements would still be true. Nothing forces an early riser outside the student group.`,
      ],
      keyIdea: 'With a "some" premise and an "all" premise, name one person from the "some" group and follow them through the "all" rule. Only what is true of that person is forced. Never upgrade "some" to "all".',
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
      asking: 'What must be true about snakes and warm-blooded animals?',
      solution:
        'Draw a circle for reptiles and a circle for warm-blooded animals. "No reptiles are warm-blooded" means the two circles do not touch at all.\n\n' +
        '"All snakes are reptiles" puts a snakes circle completely inside the reptiles circle.\n\n' +
        'Everything inside the reptiles circle stays away from the warm-blooded circle. So the snakes circle cannot touch the warm-blooded circle either.',
      conclusion: 'Snakes sit inside a group that never overlaps warm-blooded animals, so the statement that must be true is: No snakes are warm-blooded.',
      whyWrong: [
        `This misreads the second statement. Snakes sit inside the reptile group, so (as long as there are any snakes) some reptiles **are** snakes.`,
        `This contradicts the premises: snakes are reptiles and no reptile is warm-blooded, so no snake can be warm-blooded.`,
        `True in real life, but not forced by the statements: they would both still hold if snakes were the only reptiles.`,
        null,
      ],
      keyIdea: 'For "No $B$ are $C$" and "All $A$ are $B$", draw $A$ inside $B$ with $C$ separate, which gives "No $A$ are $C$". Reject any option that is only true in real life: a conclusion must come from the statements alone.',
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
    stem: `Rule: "If $P$ then $Q$." How many of these four arguments are **valid**?

1. $P$, so $Q$.
2. $Q$, so $P$.
3. Not $Q$, so not $P$.
4. Not $P$, so not $Q$.`,
    options: [`1`, `2`, `3`, `4`],
    correctIndex: 1,
    markScheme: {
      asking: 'How many of the four ways of using the rule are correct reasoning?',
      solution:
        'The rule says only this: whenever $P$ happens, $Q$ happens. Take an example, with $P$ = it rains and $Q$ = the ground is wet. The ground could also get wet from a hose.\n\n' +
        '**Valid** means the conclusion cannot be false when the starting facts are true. Test each argument with the example:\n\n| Argument | In the example | Is it forced? |\n|---|---|---|\n| 1. $P$, so $Q$ | It rains, so the ground is wet | Yes: the rule says so |\n| 2. $Q$, so $P$ | The ground is wet, so it rained | No: a hose could have done it |\n| 3. Not $Q$, so not $P$ | The ground is dry, so it did not rain | Yes: rain would have made it wet |\n| 4. Not $P$, so not $Q$ | It did not rain, so the ground is dry | No: a hose could still wet it |\n\n' +
        'Count the rows marked Yes. They are arguments 1 and 3, so the count is 2.',
      conclusion: 'Only arguments 1 and 3 are forced, so the number of valid arguments is 2.',
      whyWrong: [
        `This accepts only argument 1 and misses that argument 3 is **modus tollens**: if $Q$ fails, $P$ cannot have happened, otherwise the rule would be broken.`,
        null,
        `This accepts one of the two fallacies as well, usually argument 2 (affirming the consequent). $Q$ can be true for some other reason.`,
        `This accepts every argument, including both fallacies. Argument 4 denies the antecedent: the rule says nothing about what happens when $P$ is false.`,
      ],
      keyIdea: 'Know the four forms for "If $P$ then $Q$". Valid: $P$ so $Q$ (modus ponens) and not $Q$ so not $P$ (modus tollens). Invalid: $Q$ so $P$, and not $P$ so not $Q$. If unsure, test with rain and a wet ground.',
    },
    check: {
      optionValues: [1, 2, 3, 4],
      compute: () => {
        const v = ['P', 'Q'];
        const rule: Prop = (e) => imp(e.P, e.Q);
        const args: [Prop, Prop][] = [
          [(e) => e.P, (e) => e.Q],
          [(e) => e.Q, (e) => e.P],
          [(e) => !e.Q, (e) => !e.P],
          [(e) => !e.P, (e) => !e.Q],
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
      asking: 'If passing the interview is a requirement for the job, what else must be true?',
      solution:
        '"Only if" sets a requirement. "You will get the job only if you pass the interview" means nobody gets the job without passing.\n\n' +
        'As an if-then rule, it reads: if you get the job, then you passed the interview. It does not promise that passing gets you the job, because another candidate might do better.\n\n' +
        'Now think about what the rule forbids: someone who failed the interview and still got the job. That cannot happen.\n\n' +
        'So failing the interview means you cannot get the job. This swaps the rule\'s two parts and negates both, which always keeps the meaning.',
      conclusion: 'Failing means the requirement is missing, so the statement that must be true is: If you fail the interview, you will not get the job.',
      whyWrong: [
        null,
        'This reads "only if" as plain "if". Passing the interview is necessary for the job, not a guarantee of it.',
        'This treats passing as a guarantee. You could pass the interview and still not get the job, for example if another candidate did better.',
        'This adds the extra direction "passing guarantees the job". "Only if" gives just one direction; "if and only if" would need both.',
      ],
      keyIdea: 'Rewrite "$A$ only if $B$" as "If $A$ then $B$": $B$ is the requirement. Its contrapositive, "If not $B$ then not $A$", is also true. "If $B$ then $A$" is not: meeting a requirement is no guarantee.',
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
    stem: `Ali, Bea, Chen and Dana own one pet each: cat, dog, fish, rabbit.

- Ali owns neither cat nor dog.
- Bea owns the rabbit or fish.
- Chen does not own the cat.

What **must** be true?`,
    options: [`Ali owns the fish.`, `Bea owns the rabbit.`, `Dana owns the cat.`, `Chen owns the rabbit.`],
    correctIndex: 2,
    markScheme: {
      asking: 'Which fact about the pets is forced by the clues?',
      solution:
        'Draw a grid of people and pets, and cross out what each clue rules out. A question mark means still possible:\n\n| Person | Cat | Dog | Fish | Rabbit |\n|---|---|---|---|---|\n| Ali | ✗ | ✗ | ? | ? |\n| Bea | ✗ | ✗ | ? | ? |\n| Chen | ✗ | ? | ? | ? |\n| Dana | ? | ? | ? | ? |\n\n' +
        'Ali can only have the fish or the rabbit, and so can Bea. Those two people use up those two pets between them, although we cannot tell who has which.\n\n' +
        'So Chen and Dana must share the cat and the dog. Chen does not own the cat, so Chen owns the dog.\n\n' +
        'That leaves one pet for Dana: the cat.',
      conclusion: 'However Ali and Bea share the fish and rabbit, the cat is left for Dana, so what must be true is: Dana owns the cat.',
      whyWrong: [
        `This is possible but not forced. Ali and Bea share the fish and the rabbit between them, and no clue says which way round.`,
        `This is possible but not forced: Bea could just as well have the fish, with Ali taking the rabbit.`,
        null,
        `Impossible: Ali and Bea between them must take the fish and the rabbit, so Chen is left with the dog.`,
      ],
      keyIdea: 'For matching puzzles, draw a grid of people against items and cross out what each clue rules out. If two people share the same two choices, remove those items from everyone else. "Must be true" means true however the undecided items are shared.',
    },
    check: {
      optionValues: ['Ali fish', 'Bea rabbit', 'Dana cat', 'Chen rabbit'],
      compute: () => {
        const pets = ['cat', 'dog', 'fish', 'rabbit'];
        // each solution is [Ali, Bea, Chen, Dana]
        const sols = perms(pets).filter(
          ([a, b, c]) => a !== 'cat' && a !== 'dog' && (b === 'rabbit' || b === 'fish') && c !== 'cat',
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
      asking: 'Which statement is true exactly when "All the students passed" is false?',
      solution:
        'The **negation** of a statement is true exactly when the statement is false, and false exactly when the statement is true.\n\n' +
        'So ask: what makes "All the students passed" false? One student not passing is enough, because then it is no longer all of them. More students not passing also makes it false.\n\n' +
        'Imagine a class of 10, and write what the negation must do:\n\n| Number who passed | "All passed" is | The negation must be |\n|---|---|---|\n| 10 | true | false |\n| 9 | false | true |\n| 0 | false | true |\n\n' +
        'We need a statement that is false only when everyone passed, and true for 9 passing and for 0 passing. "At least one student did not pass" fits all three rows.',
      conclusion: 'It is true whenever not everyone passed and false only when everyone did, so the negation is: At least one student did not pass the test.',
      whyWrong: [
        `This is too strong: "not all" is not the same as "none". If 9 out of 10 passed, the original is false, but this statement is also false.`,
        null,
        `This can be true at the same time as the original (when everyone passes), so it cannot be its opposite.`,
        `This misses the case where nobody passed. Then the original is false, but this statement is also false, because nobody passed.`,
      ],
      keyIdea: 'The negation of "All $X$ are $Y$" is "At least one $X$ is not $Y$". The negation of "Some $X$ are $Y$" is "No $X$ are $Y$". Test a candidate: exactly one of the statement and its negation is true in every case.',
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
      asking: 'Which argument\'s conclusion cannot be false when its first two sentences are true?',
      solution:
        'A valid argument has a forced conclusion. To test one, try to build a situation where the premises (the first two sentences) are true but the conclusion is false. If you can, the argument is invalid.\n\n' +
        '**Cats:** some mammals are black, but those could all be dogs. Every premise can be true with no black cats, so the conclusion is not forced.\n\n' +
        '**Cars:** some red things are fast, but those could all be red bikes, while the red cars are slow. So the conclusion is not forced.\n\n' +
        '**Fish:** two "no" premises do not link the outer groups. The same pattern, "No cats are birds. No birds are mammals. So no cats are mammals", has true premises and a false conclusion.\n\n' +
        '**Pilots:** every pilot is inside the trained group, and the trained group does not touch the careless group. So no pilot can be careless, and no counterexample can be built.',
      conclusion: 'Only the pilots argument has no counterexample, so the valid one is: All pilots are trained. No trained people are careless. So no pilots are careless.',
      whyWrong: [
        null,
        `Invalid: the black mammals might all be other animals, such as black dogs, so both premises can be true while no cat is black. Knowing "some mammals" does not tell you which mammals.`,
        `Invalid: two "some" premises can talk about different objects. The red things that are fast might not be cars at all.`,
        `The conclusion is true in real life, but it does not follow. The same form "No cats are birds. No birds are mammals. So no cats are mammals." has true premises and a false conclusion.`,
      ],
      keyIdea: 'To test an argument, hunt for a counterexample: true premises with a false conclusion. Watch for the traps: two "some" premises or two "no" premises never force a conclusion, and "some" may refer to different members. A chain joined by "all" is safe.',
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
      asking: 'Which extra fact lets us say for certain that Layla attends?',
      solution:
        'The first premise is a rule: if someone is a manager, then they attend the Monday meeting.\n\n' +
        'We want to conclude that Layla attends. That is the rule\'s "then" part. To reach it, we need the rule\'s "if" part to be true for Layla.\n\n' +
        'The "if" part, applied to Layla, is that she is a manager. With that fact added, the rule covers her and forces her to attend.',
      conclusion: 'With this premise the rule applies to her directly, so the missing premise is: Layla is a manager.',
      whyWrong: [
        `This is the converse of the first premise. It tells us about people who already attend; it never says that Layla attends.`,
        `Sharing an office with the managers does not make Layla a manager, so the rule about managers does not apply to her.`,
        `This only talks about other people at the meeting. Layla could still be absent.`,
        null,
      ],
      keyIdea: 'To find a missing premise, write the rule as "If $A$ then $B$" and compare it with the conclusion. If the conclusion is $B$ for one person, the missing premise is $A$ for that person. Then test that the two premises force the conclusion.',
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

  {
    id: 'deductive-reasoning-016',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    stem: `Given that $P$ is true, $P \\Rightarrow Q$, $R \\Rightarrow \\neg Q$ and $\\neg S \\Rightarrow R$, which of the following must be true?`,
    options: [`$R$ is true.`, `$R$ is false and $S$ is true.`, `$S$ is false.`, `$Q$ is true, but nothing can be said about $S$.`],
    correctIndex: 1,
    markScheme: {
      asking: 'Using all the facts, what must be true of $R$ and $S$?',
      solution:
        'The arrow $\\Rightarrow$ means "if ... then", and $\\neg$ means "not". So $R \\Rightarrow \\neg Q$ reads "if $R$ is true, then $Q$ is false".\n\n' +
        'Start from what we know: $P$ is true. The rule $P \\Rightarrow Q$ then makes $Q$ true.\n\n' +
        'Look at $R \\Rightarrow \\neg Q$. If $R$ were true, $Q$ would be false. But $Q$ is true, so $R$ cannot be true. So $R$ is false.\n\n' +
        'Look at $\\neg S \\Rightarrow R$. If $S$ were false, $\\neg S$ would be true, and that would make $R$ true. But $R$ is false, so $S$ cannot be false. So $S$ is true.',
      conclusion: '$Q$ being true rules out $R$, and $R$ being false rules out $S$ being false, so $R$ is false and $S$ is true.',
      whyWrong: [
        `This reads the second rule backwards (as "if $Q$ then $R$"). In fact, $R$ true would force $Q$ false, but $Q$ is true, so $R$ must be false.`,
        null,
        `If $S$ were false, the third rule would make $R$ true, and then the second rule would make $Q$ false. But $Q$ is true, so $S$ cannot be false.`,
        `$Q$ is true, but stopping there misses two modus tollens steps: $Q$ true forces $R$ false, and $R$ false forces $S$ true. So $S$ **is** determined.`,
      ],
      keyIdea: 'Start with the known fact and apply one rule at a time, writing down each letter\'s value. When a rule\'s "then" part is false, its "if" part must be false too (modus tollens). Continue until every letter in the options has a value.',
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
    id: 'deductive-reasoning-021',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `What is the **contrapositive** of "If $P$ then $Q$"?`,
    options: [`If not $Q$ then not $P$`, `If $Q$ then $P$`, `If not $P$ then not $Q$`, `$P$ and not $Q$`],
    correctIndex: 0,
    markScheme: {
      asking: 'What do you get when you build the contrapositive of this rule?',
      solution:
        'The **contrapositive** is made in two moves: swap the two parts, then make both negative by putting "not" on each.\n\n' +
        'Swapping "If $P$ then $Q$" gives "If $Q$ then $P$". Putting "not" on each part then gives "If not $Q$ then not $P$".',
      conclusion: 'Swapping and negating gives exactly this form: If not $Q$ then not $P$.',
      whyWrong: [
        null,
        `This is the **converse**: it swaps the parts but does not negate them.`,
        `This is the **inverse**: it negates both parts but does not swap them.`,
        `This is the **negation** of the rule, which describes the one situation where the rule is broken.`,
      ],
      keyIdea: 'There are three related forms of "If $P$ then $Q$". The converse swaps the parts, the inverse negates both, and the contrapositive does both. Only the contrapositive always means the same as the original.',
    },
    check: {
      optionValues: ['contrapositive', 'converse', 'inverse', 'negation'],
      compute: () =>
        uniqueEquivalent(['P', 'Q'], (e) => imp(e.P, e.Q), [
          ['contrapositive', (e) => imp(!e.Q, !e.P)],
          ['converse', (e) => imp(e.Q, e.P)],
          ['inverse', (e) => imp(!e.P, !e.Q)],
          ['negation', (e) => e.P && !e.Q],
        ]),
    },
  },
  {
    id: 'deductive-reasoning-022',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `In logic, "Some $A$ are $B$" means:`,
    options: [`At least one $A$ is a $B$`, `Most $A$ are $B$`, `Not every $A$ is a $B$`, `Every $A$ is a $B$`],
    correctIndex: 0,
    markScheme: {
      asking: 'How much does the word "some" claim when it is used in logic?',
      solution:
        'In everyday speech, "some" often hints at "several, but not all". Logic is stricter: "some" makes the smallest possible claim.\n\n' +
        '"Some cats are black" is true if there is even one black cat, and it stays true if every cat is black. In the same way, "Some $A$ are $B$" claims only that at least one $A$ is a $B$.',
      conclusion: 'One example is enough, so "Some $A$ are $B$" means: At least one $A$ is a $B$.',
      whyWrong: [
        null,
        `"Some" says nothing about a majority. One is enough.`,
        `This is the everyday meaning of "some", which suggests "but not all". In logic, "some" is still true when every $A$ is a $B$.`,
        `This upgrades "some" to "all". One $A$ that is a $B$ is enough for "some".`,
      ],
      keyIdea: 'In logic questions, read "some" as "at least one, possibly all". It never means "most" and never means "but not all", so do not conclude that some are not unless a premise says so.',
    },
  },
  {
    id: 'deductive-reasoning-023',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `Which of these argument forms is always valid?`,
    options: [`Modus tollens`, `Affirming the consequent`, `Denying the antecedent`, `Assuming the converse`],
    correctIndex: 0,
    markScheme: {
      asking: 'Which pattern of reasoning always gives a correct conclusion?',
      solution:
        'Take the rule "If it rains ($P$), the ground is wet ($Q$)". The antecedent is the "if" part and the consequent is the "then" part. Test the forms on this rule:\n\n| Form | Pattern | Example | Forced? |\n|---|---|---|---|\n| Affirming the consequent | $Q$, so $P$ | Wet ground, so it rained | No: a hose could do it |\n| Denying the antecedent | Not $P$, so not $Q$ | No rain, so dry ground | No: a hose could do it |\n| Assuming the converse | If $Q$ then $P$ | Wet ground always means rain | No: a rule does not work backwards |\n\n' +
        'The remaining form goes: not $Q$, so not $P$. If the ground is dry, it cannot have rained, because rain would have made it wet. That reasoning is always forced, and it is called **modus tollens**.',
      conclusion: 'It is the only form here that can never go from true facts to a false conclusion, so the answer is Modus tollens.',
      whyWrong: [
        null,
        `"If $P$ then $Q$. $Q$. Therefore $P$." is a fallacy: $Q$ might be true for another reason.`,
        `"If $P$ then $Q$. Not $P$. Therefore not $Q$." is a fallacy: the rule says nothing about what happens when $P$ is false.`,
        `A rule does not imply its converse: "If $P$ then $Q$" does not give "If $Q$ then $P$".`,
      ],
      keyIdea: 'Know the two valid forms for "If $P$ then $Q$": modus ponens ($P$, so $Q$) and modus tollens (not $Q$, so not $P$). Going from $Q$ to $P$, or from not $P$ to not $Q$, is a fallacy (a mistake in reasoning).',
    },
    check: {
      optionValues: ['MT', 'AC', 'DA', null],
      compute: () => {
        const P: Prop = (e) => e.P;
        const Q: Prop = (e) => e.Q;
        const v = ['P', 'Q'];
        const forms: [string, Prop, Prop][] = [
          ['MT', (e) => !Q(e), (e) => !P(e)],
          ['AC', Q, P],
          ['DA', (e) => !P(e), (e) => !Q(e)],
        ];
        return forms.filter(([, given, concl]) => entails(v, [(e) => imp(P(e), Q(e)), given], concl)).map(([k]) => k).join('+');
      },
    },
  },
  {
    id: 'deductive-reasoning-024',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    stem: `"$P$ is **sufficient** for $Q$" means the same as:`,
    options: [`If $P$ then $Q$`, `If $Q$ then $P$`, `If not $P$ then not $Q$`, `$P$ if and only if $Q$`],
    correctIndex: 0,
    markScheme: {
      asking: 'Which if-then rule says that $P$ alone is enough to guarantee $Q$?',
      solution:
        '**Sufficient** means "enough". If something is sufficient, having it is all you need. Scoring 90% is sufficient to pass a test with a pass mark of 50%.\n\n' +
        'So $P$ being sufficient for $Q$ says: once $P$ happens, $Q$ is guaranteed. In the scoring example, if you score 90%, then you pass. In letters, that is "If $P$ then $Q$".',
      conclusion: '$P$ is enough to guarantee $Q$, and that is what this rule says: If $P$ then $Q$.',
      whyWrong: [
        null,
        `This is "$P$ is **necessary** for $Q$". You cannot have $Q$ without $P$.`,
        `This is the inverse, which has the same meaning as "If $Q$ then $P$", so it also describes "necessary".`,
        `This says necessary **and** sufficient, which is more than the statement claims.`,
      ],
      keyIdea: 'Translate before choosing. "$P$ is sufficient for $Q$" becomes "If $P$ then $Q$". "$P$ is necessary for $Q$" becomes "If $Q$ then $P$". So the sufficient thing goes after "if", and the necessary thing goes after "then".',
    },
    check: {
      optionValues: ['P->Q', 'Q->P', 'notP->notQ', 'P<->Q'],
      compute: () =>
        uniqueEquivalent(['P', 'Q'], (e) => !(e.P && !e.Q), [
          ['P->Q', (e) => imp(e.P, e.Q)],
          ['Q->P', (e) => imp(e.Q, e.P)],
          ['notP->notQ', (e) => imp(!e.P, !e.Q)],
          ['P<->Q', (e) => e.P === e.Q],
        ]),
    },
  },
];
