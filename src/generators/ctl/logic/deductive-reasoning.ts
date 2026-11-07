import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';

// ---------------------------------------------------------------- shared contexts for if-then generators
// Each clause has a positive and a negative wording, both usable after "If ..." / "then ...".
interface Clause {
  pos: string;
  neg: string;
}
interface Ctx {
  p: Clause;
  q: Clause;
  /**
   * The link between the two parts is a fact of maths or geography (not just a hypothetical rule).
   * Such rules are never used with a flipped sign: e.g. "If the number is not a multiple of 10, then it is
   * not a multiple of 5" would make a "denying the antecedent" argument whose conclusion really does follow
   * from arithmetic, so calling it invalid would be disputable.
   */
  fact?: boolean;
}

const CONTEXTS: Ctx[] = [
  { p: { pos: 'it rains', neg: 'it does not rain' }, q: { pos: 'the match is cancelled', neg: 'the match is not cancelled' } },
  {
    p: { pos: 'the number is a multiple of 10', neg: 'the number is not a multiple of 10' },
    q: { pos: 'the number is a multiple of 5', neg: 'the number is not a multiple of 5' },
    fact: true,
  },
  {
    p: { pos: 'the alarm rings', neg: 'the alarm does not ring' },
    q: { pos: 'the students leave the building', neg: 'the students do not leave the building' },
  },
  { p: { pos: 'the shape is a square', neg: 'the shape is not a square' }, q: { pos: 'the shape has four sides', neg: 'the shape does not have four sides' }, fact: true },
  { p: { pos: 'the light is green', neg: 'the light is not green' }, q: { pos: 'the cars move', neg: 'the cars do not move' } },
  {
    p: { pos: 'Maya practises every day', neg: 'Maya does not practise every day' },
    q: { pos: 'Maya wins the competition', neg: 'Maya does not win the competition' },
  },
  { p: { pos: 'the battery is charged', neg: 'the battery is not charged' }, q: { pos: 'the robot moves', neg: 'the robot does not move' } },
  { p: { pos: 'the password is correct', neg: 'the password is not correct' }, q: { pos: 'the account opens', neg: 'the account does not open' } },
  {
    p: { pos: 'the model is overfitting', neg: 'the model is not overfitting' },
    q: { pos: 'the test accuracy is low', neg: 'the test accuracy is not low' },
  },
  { p: { pos: 'the shop is open', neg: 'the shop is not open' }, q: { pos: 'the lights are on', neg: 'the lights are not on' } },
  { p: { pos: 'Omar is in Abu Dhabi', neg: 'Omar is not in Abu Dhabi' }, q: { pos: 'Omar is in the UAE', neg: 'Omar is not in the UAE' }, fact: true },
  { p: { pos: 'the code compiles', neg: 'the code does not compile' }, q: { pos: 'the tests run', neg: 'the tests do not run' } },
  { p: { pos: 'the plant gets sunlight', neg: 'the plant does not get sunlight' }, q: { pos: 'the plant grows', neg: 'the plant does not grow' } },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const ifThen = (a: string, b: string) => `If ${a}, then ${b}.`;

/** Picks a context and a sign pattern; returns A, not-A, B, not-B wordings for the rule "If A, then B". */
function pickRule(rng: Rng) {
  const ctx = rng.pick(CONTEXTS);
  const flipP = !ctx.fact && rng.bool();
  const flipQ = !ctx.fact && rng.bool();
  const A = flipP ? ctx.p.neg : ctx.p.pos;
  const notA = flipP ? ctx.p.pos : ctx.p.neg;
  const B = flipQ ? ctx.q.neg : ctx.q.pos;
  const notB = flipQ ? ctx.q.pos : ctx.q.neg;
  return { A, notA, B, notB };
}

// ---------------------------------------------------------------- generator 1: converse / inverse / contrapositive
type Form = 'converse' | 'inverse' | 'contrapositive' | 'negation';

function genForms(rng: Rng): GeneratedCore {
  const { A, notA, B, notB } = pickRule(rng);
  const rule = ifThen(A, B);
  const text: Record<Form, string> = {
    converse: ifThen(B, A),
    inverse: ifThen(notA, notB),
    contrapositive: ifThen(notB, notA),
    negation: `${cap(A)}, but ${notB}.`,
  };
  const ask = rng.pick(['equivalent', 'converse', 'inverse', 'contrapositive'] as const);
  const target: Form = ask === 'equivalent' ? 'contrapositive' : ask;
  const question =
    ask === 'equivalent'
      ? 'Which statement is **logically equivalent** to this rule?'
      : `Which statement is the **${ask}** of this rule?`;
  const stem = `Consider the rule:\n\n"${rule}"\n\n${question}`;

  const describe: Record<Form, string> = {
    converse: 'the converse (the two parts swapped, nothing negated)',
    inverse: 'the inverse (both parts negated, order kept)',
    contrapositive: 'the contrapositive (the two parts swapped and both negated)',
    negation: 'the negation of the rule (the "if" part happens but the "then" part does not, so the rule is broken)',
  };
  const whyFor = (f: Form): string => {
    if (ask === 'equivalent') {
      if (f === 'converse') return `This is ${describe.converse}. A rule and its converse can have different truth values, so they are not equivalent.`;
      if (f === 'inverse') return `This is ${describe.inverse}. The inverse is equivalent to the converse, not to the original rule.`;
      return `This is ${describe.negation}. A negation always has the opposite truth value, so it can never be equivalent.`;
    }
    const wanted =
      ask === 'converse'
        ? 'The converse just swaps the two parts, with no negation.'
        : ask === 'inverse'
          ? 'The inverse negates both parts and keeps their order.'
          : 'The contrapositive swaps the two parts and negates both.';
    return `This is ${describe[f]}. ${wanted}`;
  };

  const all: Form[] = ['converse', 'inverse', 'contrapositive', 'negation'];
  const distractors = all
    .filter((f) => f !== target)
    .map((f) => ({ text: text[f], value: f, why: whyFor(f) }));
  const answer = text[target];

  const formOf: Record<Exclude<Form, 'negation'>, string> = {
    converse: 'If $Q$ then $P$',
    inverse: 'If not $P$ then not $Q$',
    contrapositive: 'If not $Q$ then not $P$',
  };
  const howBuilt: Record<Exclude<Form, 'negation'>, string> = {
    converse: 'swaps the two parts',
    inverse: 'negates both parts',
    contrapositive: 'swaps the two parts and negates both',
  };
  const solution = steps(
    `Name the two parts of the rule. $P$ is the "if" part: "${A}". $Q$ is the "then" part: "${B}".`,
    `To **negate** a part means to say its opposite. So "not $P$" is "${notA}", and "not $Q$" is "${notB}".`,
    `Three rewordings of an if-then rule have their own names:\n\n${table(
      ['Name', 'Form', 'How it is made', 'Always means the same as the rule?'],
      [
        ['Converse', formOf.converse, 'swap the parts', 'No'],
        ['Inverse', formOf.inverse, 'negate both parts', 'No'],
        ['Contrapositive', formOf.contrapositive, 'swap and negate both', 'Yes'],
      ],
    )}`,
    ask === 'equivalent' &&
      'Only one of them always means the same as the rule. If the "then" part fails, the "if" part cannot have happened, because it would have forced the "then" part.',
    `We need the form "${formOf[target as Exclude<Form, 'negation'>]}". Put our two parts into it: "${answer}"`,
  );

  return {
    stem,
    answer,
    answerValue: target,
    distractors,
    asking: ask === 'equivalent' ? 'Which sentence says exactly the same thing as the rule?' : `Which rewording of the rule is its ${ask}?`,
    solution,
    conclusion:
      ask === 'equivalent'
        ? `The contrapositive always means the same as the rule, so the equivalent sentence is: ${answer}`
        : `The ${ask} ${howBuilt[ask]}, which gives: ${answer}`,
    keyIdea: 'Label the parts $P$ and $Q$, then build the form. Converse means swap the parts. Inverse means negate both. Contrapositive means do both, and it is the only one that always means the same as the original rule.',
  };
}

// ---------------------------------------------------------------- generator 2: name the argument form
type ArgForm = 'MP' | 'MT' | 'AC' | 'DA';
const LABEL: Record<ArgForm, string> = {
  MP: 'Valid: modus ponens',
  MT: 'Valid: modus tollens',
  AC: 'Invalid: affirming the consequent',
  DA: 'Invalid: denying the antecedent',
};

function genArgForm(rng: Rng): GeneratedCore {
  const { A, notA, B, notB } = pickRule(rng);
  const form = rng.pick(['MP', 'MT', 'AC', 'DA'] as const);
  const parts: Record<ArgForm, { given: string; concl: string }> = {
    MP: { given: A, concl: B },
    MT: { given: notB, concl: notA },
    AC: { given: B, concl: A },
    DA: { given: notA, concl: notB },
  };
  const { given, concl } = parts[form];
  const stem =
    `"${ifThen(A, B)} ${cap(given)}. Therefore, ${concl}."\n\n` + 'This argument is:';

  // What each form would have needed, in this argument's own words.
  const needs: Record<ArgForm, string> = {
    MP: `Modus ponens needs the second statement to be the "if" part ("${A}").`,
    MT: `Modus tollens needs the second statement to deny the "then" part ("${notB}").`,
    AC: `Affirming the consequent would start from the "then" part ("${B}").`,
    DA: `Denying the antecedent would start from denying the "if" part ("${notA}").`,
  };
  const actually: Record<ArgForm, string> = {
    MP: 'Here the second statement is the "if" part itself, so this is modus ponens, which is valid.',
    MT: 'Here the second statement denies the "then" part, so this is modus tollens, which is valid.',
    AC: 'Here the second statement is the "then" part, so this is affirming the consequent, which is invalid.',
    DA: 'Here the second statement denies the "if" part, so this is denying the antecedent, which is invalid.',
  };
  const all: ArgForm[] = ['MP', 'MT', 'AC', 'DA'];
  const distractors = all
    .filter((f) => f !== form)
    .map((f) => ({ text: LABEL[f], value: f, why: `${needs[f]} ${actually[form]}` }));
  const answer = LABEL[form];

  const explain: Record<ArgForm, string> = {
    MP: 'The second statement says the "if" part is true. The rule says that whenever that happens, the "then" part happens too. So the conclusion has to be true, and the argument is **valid**.',
    MT: 'The second statement says the "then" part is false. If the "if" part had been true, the rule would have made the "then" part true. So the "if" part must be false, and the argument is **valid**.',
    AC: `The second statement says the "then" part is true. But the rule only says what happens when "${A}". The "then" part could be true for another reason. So the conclusion can be false, and the argument is **invalid**.`,
    DA: `The second statement says the "if" part is false. The rule says nothing about that situation, so "${B}" could still happen for another reason. So the conclusion can be false, and the argument is **invalid**.`,
  };
  const shortPattern: Record<ArgForm, string> = {
    MP: '$P$, so $Q$',
    MT: 'not $Q$, so not $P$',
    AC: '$Q$, so $P$',
    DA: 'not $P$, so not $Q$',
  };
  const givenLabel: Record<ArgForm, string> = { MP: '$P$', MT: 'not $Q$', AC: '$Q$', DA: 'not $P$' };
  const conclLabel: Record<ArgForm, string> = { MP: '$Q$', MT: 'not $P$', AC: '$P$', DA: 'not $Q$' };
  const named: Record<ArgForm, string> = {
    MP: 'A valid argument with the pattern "$P$, so $Q$" is called **modus ponens**.',
    MT: 'A valid argument with the pattern "not $Q$, so not $P$" is called **modus tollens**.',
    AC: 'This mistake has its own name. Stating that the "then" part (the consequent) is true is called affirming it, so this is **affirming the consequent**.',
    DA: 'This mistake has its own name. Stating that the "if" part (the antecedent) is false is called denying it, so this is **denying the antecedent**.',
  };
  const solution = steps(
    `Name the parts of the rule. $P$ is the "if" part, called the **antecedent**: "${A}". $Q$ is the "then" part, called the **consequent**: "${B}".`,
    `Now label the rest of the argument. The second statement, "${given}", is ${givenLabel[form]}. The conclusion, "${concl}", is ${conclLabel[form]}. So the pattern is: ${shortPattern[form]}.`,
    explain[form],
    named[form],
  );

  return {
    stem,
    answer,
    answerValue: form,
    distractors,
    asking: 'Does the conclusion have to follow from the rule, and what is this pattern called?',
    solution,
    conclusion: `The pattern is ${shortPattern[form]}, so the description is: ${answer}`,
    keyIdea: 'Label the rule $P$ then $Q$, then see which part the second statement uses. $P$ or not $Q$ gives a valid argument (modus ponens, modus tollens). $Q$ or not $P$ proves nothing (affirming the consequent, denying the antecedent).',
  };
}

// ---------------------------------------------------------------- generator 3: syllogisms with made-up words
type Quant = 'all' | 'some' | 'no' | 'someNot';
type Cat = [Quant, number, number]; // term indices 0 (A), 1 (B, the middle term), 2 (C)

function catHolds([q, a, b]: Cat, regions: boolean[]): boolean {
  const inT = (t: number, r: number) => ((r >> t) & 1) === 1;
  const any = (f: (r: number) => boolean) => regions.some((ne, r) => ne && f(r));
  if (q === 'all') return !any((r) => inT(a, r) && !inT(b, r));
  if (q === 'no') return !any((r) => inT(a, r) && inT(b, r));
  if (q === 'some') return any((r) => inT(a, r) && inT(b, r));
  return any((r) => inT(a, r) && !inT(b, r));
}
/** existential = every group has at least one member (the traditional reading, which allows MORE conclusions). */
function catFollows(prem: Cat[], concl: Cat, existential: boolean): boolean {
  for (let mask = 0; mask < 256; mask++) {
    const regions = Array.from({ length: 8 }, (_, r) => ((mask >> r) & 1) === 1);
    if (existential && [0, 1, 2].some((t) => !regions.some((ne, r) => ne && ((r >> t) & 1) === 1))) continue;
    if (prem.every((p) => catHolds(p, regions)) && !catHolds(concl, regions)) return false;
  }
  return true;
}

const WORDS = ['blarks', 'zimps', 'wugs', 'floons', 'drells', 'quibs', 'snarps', 'torvs', 'plinks', 'mibs', 'grozzles', 'vemps'];

interface SylForm {
  name: string;
  prem: Cat[];
  concl: Cat;
  /** Reasoning, one step per string, in terms of the three words. */
  reason: (a: string, b: string, c: string) => string[];
}
const FORMS: SylForm[] = [
  {
    name: 'all-all',
    prem: [
      ['all', 0, 1],
      ['all', 1, 2],
    ],
    concl: ['all', 0, 2],
    reason: (a, b, c) => [
      `"All ${a} are ${b}" puts the ${a} circle completely inside the ${b} circle.`,
      `"All ${b} are ${c}" puts the ${b} circle completely inside the ${c} circle.`,
      `A circle inside a circle inside a third circle is still inside the third. So every one of the ${a} is in the ${c} circle.`,
    ],
  },
  {
    name: 'all-no',
    prem: [
      ['all', 0, 1],
      ['no', 1, 2],
    ],
    concl: ['no', 0, 2],
    reason: (a, b, c) => [
      `"All ${a} are ${b}" puts the ${a} circle completely inside the ${b} circle.`,
      `"No ${b} are ${c}" means the ${b} circle and the ${c} circle do not touch at all.`,
      `The ${a} sit inside the ${b}, so they cannot reach the ${c} circle either. None of the ${a} are in it.`,
    ],
  },
  {
    name: 'some-all',
    prem: [
      ['some', 0, 1],
      ['all', 1, 2],
    ],
    concl: ['some', 0, 2],
    reason: (a, b, c) => [
      `In logic, "some" means at least one. So "Some ${a} are ${b}" means at least one thing is in both groups. Call it Item X.`,
      `"All ${b} are ${c}" covers every one of the ${b}, so Item X is also one of the ${c}.`,
      `So Item X is one of the ${a} and also one of the ${c}. One such item is enough for a "some" statement.`,
    ],
  },
  {
    name: 'some-no',
    prem: [
      ['some', 0, 1],
      ['no', 1, 2],
    ],
    concl: ['someNot', 0, 2],
    reason: (a, b, c) => [
      `In logic, "some" means at least one. So "Some ${a} are ${b}" means at least one thing is in both groups. Call it Item X.`,
      `"No ${b} are ${c}" covers every one of the ${b}, so Item X is not one of the ${c}.`,
      `So Item X is one of the ${a} but not one of the ${c}. One such item is enough for a "some ... are not" statement.`,
    ],
  },
  {
    name: 'no-all',
    prem: [
      ['no', 2, 1],
      ['all', 0, 1],
    ],
    concl: ['no', 0, 2],
    reason: (a, b, c) => [
      `"No ${c} are ${b}" means the ${c} circle and the ${b} circle do not touch at all.`,
      `"All ${a} are ${b}" puts the ${a} circle completely inside the ${b} circle.`,
      `The ${a} sit inside the ${b}, so they cannot reach the ${c} circle either. None of the ${a} are in it.`,
    ],
  },
];

function sentence([q, x, y]: Cat, w: string[]): string {
  if (q === 'all') return `All ${w[x]} are ${w[y]}.`;
  if (q === 'no') return `No ${w[x]} are ${w[y]}.`;
  if (q === 'some') return `Some ${w[x]} are ${w[y]}.`;
  return `Some ${w[x]} are not ${w[y]}.`;
}
/** Canonical key: "some"/"no" statements read the same both ways round. */
function catKey([q, x, y]: Cat): string {
  return q === 'some' || q === 'no' ? `${q}:${Math.min(x, y)}:${Math.max(x, y)}` : `${q}:${x}:${y}`;
}

function genSyllogism(rng: Rng): GeneratedCore {
  const form = rng.pick(FORMS);
  const w = rng.sample(WORDS, 3); // w[0] = A, w[1] = B (middle), w[2] = C
  const prem = rng.bool() ? form.prem : [form.prem[1], form.prem[0]];
  const answer = sentence(form.concl, w);

  // Candidate wrong conclusions: every statement about two different words that does NOT follow,
  // even under the generous reading where every group has members. Conclusions about the end words (A and C) first.
  const cands: { c: Cat; tier: number }[] = [];
  const quants: Quant[] = ['all', 'some', 'no', 'someNot'];
  for (const q of quants)
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 3; y++) {
        if (x === y) continue;
        const c: Cat = [q, x, y];
        if (catFollows(prem, c, true)) continue;
        cands.push({ c, tier: x !== 1 && y !== 1 ? 0 : 1 });
      }
  const used = new Set<string>([catKey(form.concl)]);
  const picked: Cat[] = [];
  for (const tier of [0, 1]) {
    for (const { c } of rng.shuffle(cands.filter((k) => k.tier === tier))) {
      if (picked.length === 3) break;
      const k = catKey(c);
      if (used.has(k) || sentence(c, w) === answer) continue;
      used.add(k);
      picked.push(c);
    }
  }
  if (picked.length < 3) throw new Error('not enough distractors');

  const neg = ([q, x, y]: Cat): Cat => [q === 'all' ? 'someNot' : q === 'some' ? 'no' : q === 'no' ? 'some' : 'all', x, y];
  const quote = (c: Cat) => `"${sentence(c, w).slice(0, -1)}"`;
  const whyFor = (c: Cat): string => {
    const [q, x, y] = c;
    const [cq, cx, cy] = form.concl;
    const swapped = x === cy && y === cx;
    // "some" and "no" statements read the same both ways round
    const same = (x === cx && y === cy) || (swapped && (q === 'some' || q === 'no'));
    // A statement the premises rule out completely.
    if (catFollows(prem, neg(c), false))
      return `This contradicts the premises: they guarantee ${quote(neg(c))}, so this statement must be false.`;
    if (catFollows(prem, neg(c), true))
      return `As long as each group has at least one member, this contradicts the premises: they then guarantee ${quote(neg(c))}.`;
    let mistake = '';
    if (swapped && q === cq)
      mistake = `This swaps the two groups in the valid conclusion, and that is not allowed for ${cq === 'all' ? 'an "all"' : 'a "some ... are not"'} statement. `;
    else if (same && q === 'all' && cq === 'some')
      mistake = `This upgrades "some" to "all". The premises only guarantee one ${w[cx].replace(/s$/, '')} linked through the ${w[1]}. `;
    else if (swapped && q === 'all' && cq === 'some') mistake = 'This swaps the two groups and also upgrades "some" to "all". ';
    else if (same && q === 'no' && cq === 'someNot')
      mistake = `This upgrades "some ... are not" to "no ... are". The premises only guarantee one ${w[cx].replace(/s$/, '')} outside the ${w[cy]}. `;
    else if ((same || swapped) && ((q === 'someNot' && cq === 'some') || (q === 'some' && cq === 'someNot')))
      mistake = 'This treats "some are" as if it also meant "some are not" (or the other way round). In logic "some" only means "at least one". ';
    else if (swapped && q === 'someNot' && cq === 'all')
      mistake = `This assumes the ${w[x]} must have extra members that are not ${w[y]}. "All ${w[y]} are ${w[x]}" allows the two groups to be exactly the same. `;
    else if (x === 1 || y === 1) mistake = `This is about the linking group (the ${w[1]}), and the premises do not pin it down. `;
    else if (q === 'all') mistake = `Nothing in the premises places the ${w[x]} inside the ${w[y]}. `;
    else if (q === 'no') mistake = `Nothing in the premises keeps the ${w[x]} and the ${w[y]} apart. `;
    const reason =
      q === 'all'
        ? `Both premises can be true while some of the ${w[x]} are not ${w[y]}, so it does not have to be true.`
        : q === 'no'
          ? `Both premises can be true while something is one of the ${w[x]} and also one of the ${w[y]}, so it does not have to be true.`
          : q === 'some'
            ? `Both premises can be true while none of the ${w[x]} are ${w[y]}, so it does not have to be true.`
            : `Both premises can be true while every one of the ${w[x]} is one of the ${w[y]}, so it does not have to be true.`;
    return mistake + reason;
  };

  const stem =
    `The words below are made up, so you cannot use real-world knowledge. Assume both statements are true:\n\n` +
    `- ${sentence(prem[0], w)}\n- ${sentence(prem[1], w)}\n\n` +
    'Which conclusion **must** be true?';
  const solution = steps(
    'The words are made up, so do not try to picture real things. Treat each word as a group, and draw each group as a circle.',
    `The ${w[1]} appear in both statements, so that group is the link between the ${w[0]} and the ${w[2]}.`,
    ...form.reason(w[0], w[1], w[2]),
  );

  return {
    stem,
    answer,
    answerValue: catKey(form.concl),
    distractors: picked.map((c) => ({ text: sentence(c, w), value: catKey(c), why: whyFor(c) })),
    asking: 'Going only by how the groups link together, which conclusion has to be true?',
    solution,
    conclusion: `The other conclusions can be false while both statements are true, so the only one that is forced is: ${answer}`,
    keyIdea: 'Draw a circle for each group and find the group named in both statements: it links the others. "All" nests circles, "no" separates them, and "some" gives one item to follow. A conclusion must hold in every possible drawing.',
  };
}

// ---------------------------------------------------------------- exports
export const generators: Generator[] = [
  {
    id: 'gen-deductive-reasoning-converse-contrapositive',
    subtopic: 'deductive-reasoning',
    difficulty: 'foundation',
    title: 'Converse, inverse, contrapositive of an if-then rule',
    generate: genForms,
  },
  {
    id: 'gen-deductive-reasoning-argument-form',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    title: 'Valid or fallacy? Name the if-then argument form',
    generate: genArgForm,
  },
  {
    id: 'gen-deductive-reasoning-syllogism',
    subtopic: 'deductive-reasoning',
    difficulty: 'exam',
    title: 'Syllogism with made-up words: which conclusion must follow?',
    generate: genSyllogism,
  },
];
