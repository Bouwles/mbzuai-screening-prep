import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

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

  const solution =
    `Write the rule as "If $P$, then $Q$" with\n\n` +
    `- $P$: ${A}\n` +
    `- $Q$: ${B}\n\n` +
    `The negation of $P$ is "${notA}" and the negation of $Q$ is "${notB}". The related statements are:\n\n` +
    `| Name | Form | Truth value |\n| --- | --- | --- |\n` +
    `| Converse | If $Q$ then $P$ | can differ from the rule |\n` +
    `| Inverse | If not $P$ then not $Q$ | can differ from the rule |\n` +
    `| Contrapositive | If not $Q$ then not $P$ | always the same as the rule |\n\n` +
    (ask === 'equivalent'
      ? `Only the **contrapositive** is always equivalent to the original: if $Q$ fails, $P$ cannot have happened, because $P$ would have forced $Q$.\n\n`
      : `We need the **${ask}**, so we use the form "${ask === 'converse' ? 'If $Q$ then $P$' : ask === 'inverse' ? 'If not $P$ then not $Q$' : 'If not $Q$ then not $P$'}".\n\n`) +
    `Answer: ${answer}`;

  return {
    stem,
    answer,
    answerValue: target,
    distractors,
    solution,
    keyIdea: 'Converse = swap; inverse = negate both; contrapositive = swap and negate both, and only the contrapositive is equivalent to the original.',
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
    `Consider this argument:\n\n"${ifThen(A, B)} ${cap(given)}. Therefore, ${concl}."\n\n` + 'Which description of the argument is correct?';

  // What each form would have needed, in this argument's own words.
  const needs: Record<ArgForm, string> = {
    MP: `Modus ponens needs the second premise to be the "if" part ("${A}") and concludes the "then" part ("${B}").`,
    MT: `Modus tollens needs the second premise to deny the "then" part ("${notB}") and concludes that the "if" part fails ("${notA}").`,
    AC: `Affirming the consequent would start from the "then" part ("${B}") and conclude the "if" part ("${A}").`,
    DA: `Denying the antecedent would start from "${notA}" and conclude "${notB}".`,
  };
  const actually: Record<ArgForm, string> = {
    MP: 'Here the second premise is the "if" part itself, so this is modus ponens, which is valid.',
    MT: 'Here the second premise denies the "then" part, so this is modus tollens, which is valid.',
    AC: 'Here the second premise is the "then" part, so this is affirming the consequent, which is invalid.',
    DA: 'Here the second premise denies the "if" part, so this is denying the antecedent, which is invalid.',
  };
  const all: ArgForm[] = ['MP', 'MT', 'AC', 'DA'];
  const distractors = all
    .filter((f) => f !== form)
    .map((f) => {
      const validityClash =
        (f === 'MP' || f === 'MT') !== (form === 'MP' || form === 'MT')
          ? form === 'MP' || form === 'MT'
            ? ' The argument is in fact valid, so calling it invalid is wrong.'
            : ' The argument is in fact invalid, so calling it valid is wrong.'
          : '';
      return { text: LABEL[f], value: f, why: `${needs[f]} ${actually[form]}${validityClash}` };
    });
  const answer = LABEL[form];

  const explain: Record<ArgForm, string> = {
    MP: `The second premise says the "if" part is true, so the rule forces the "then" part. The conclusion "${B}" is guaranteed, so the argument is **valid**.`,
    MT: `The second premise says the "then" part is false. If the "if" part had been true, the "then" part would have been true too, so the "if" part must be false: "${notA}". The argument is **valid**.`,
    AC: `The second premise says the "then" part is true. But the rule only says what happens when "${A}"; the "then" part could be true for some other reason. So the premises can be true while the conclusion is false, and the argument is **invalid**.`,
    DA: `The second premise says the "if" part is false. But the rule says nothing about what happens then: "${B}" could still happen for another reason. So the premises can be true while the conclusion is false, and the argument is **invalid**.`,
  };
  const pattern: Record<ArgForm, string> = {
    MP: '$P$, therefore $Q$',
    MT: 'not $Q$, therefore not $P$',
    AC: '$Q$, therefore $P$',
    DA: 'not $P$, therefore not $Q$',
  };
  const solution =
    `Label the rule "If $P$, then $Q$":\n\n` +
    `- $P$ (the "if" part, antecedent): ${A}\n` +
    `- $Q$ (the "then" part, consequent): ${B}\n\n` +
    `The second premise "${given}" is ${form === 'MP' ? '$P$' : form === 'MT' ? 'not $Q$' : form === 'AC' ? '$Q$' : 'not $P$'}, and the conclusion "${concl}" is ${form === 'MP' ? '$Q$' : form === 'MT' ? 'not $P$' : form === 'AC' ? '$P$' : 'not $Q$'}. So the pattern is: ${pattern[form]}.\n\n` +
    `${explain[form]}\n\n` +
    `Remember: modus ponens ($P$, so $Q$) and modus tollens (not $Q$, so not $P$) are valid; affirming the consequent ($Q$, so $P$) and denying the antecedent (not $P$, so not $Q$) are not.\n\n` +
    `Answer: ${answer}`;

  return {
    stem,
    answer,
    answerValue: form,
    distractors,
    solution,
    keyIdea: 'Match the second premise to the rule: the "if" part true or the "then" part false gives a valid argument; the "then" part true or the "if" part false proves nothing.',
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
  /** Reasoning, in terms of the three words. */
  steps: (a: string, b: string, c: string) => string;
}
const FORMS: SylForm[] = [
  {
    name: 'all-all',
    prem: [
      ['all', 0, 1],
      ['all', 1, 2],
    ],
    concl: ['all', 0, 2],
    steps: (a, b, c) =>
      `The ${a} circle sits inside the ${b} circle, and the ${b} circle sits inside the ${c} circle. Nested circles stay nested, so every one of the ${a} is inside the ${c} circle.`,
  },
  {
    name: 'all-no',
    prem: [
      ['all', 0, 1],
      ['no', 1, 2],
    ],
    concl: ['no', 0, 2],
    steps: (a, b, c) =>
      `The ${a} circle sits inside the ${b} circle, and the ${b} circle does not overlap the ${c} circle at all. So the ${a} circle cannot reach the ${c} circle either.`,
  },
  {
    name: 'some-all',
    prem: [
      ['some', 0, 1],
      ['all', 1, 2],
    ],
    concl: ['some', 0, 2],
    steps: (a, b, c) =>
      `At least one thing is one of the ${a} and one of the ${b}. Every one of the ${b} is one of the ${c}, so that thing is also one of the ${c}. That one thing proves that some ${a} are ${c}.`,
  },
  {
    name: 'some-no',
    prem: [
      ['some', 0, 1],
      ['no', 1, 2],
    ],
    concl: ['someNot', 0, 2],
    steps: (a, b, c) =>
      `At least one thing is one of the ${a} and one of the ${b}. None of the ${b} are ${c}, so that thing is not one of the ${c}. That one thing proves that some ${a} are not ${c}.`,
  },
  {
    name: 'no-all',
    prem: [
      ['no', 2, 1],
      ['all', 0, 1],
    ],
    concl: ['no', 0, 2],
    steps: (a, b, c) =>
      `The ${a} circle sits inside the ${b} circle, and the ${c} circle does not overlap the ${b} circle at all. So the ${a} circle cannot overlap the ${c} circle.`,
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
      mistake = `This upgrades "some" to "all": the premises only guarantee at least one ${w[cx].replace(/s$/, '')} that is linked through the ${w[1]}, not that every one of them is. `;
    else if (swapped && q === 'all' && cq === 'some') mistake = 'This swaps the two groups and also upgrades "some" to "all". ';
    else if (same && q === 'no' && cq === 'someNot')
      mistake = `This upgrades "some ... are not" to "no ... are": the premises only guarantee at least one ${w[cx].replace(/s$/, '')} outside the ${w[cy]}, not that all of them are. `;
    else if ((same || swapped) && ((q === 'someNot' && cq === 'some') || (q === 'some' && cq === 'someNot')))
      mistake =
        'This treats "some are" as if it also meant "some are not" (or the other way round). In logic "some" just means "at least one", so knowing that some things are inside a group tells you nothing about whether any are outside it. ';
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
  const solution =
    `Ignore what the words "mean" and look only at how the groups are linked. The group that appears in both premises, the ${w[1]}, is the link.\n\n` +
    `${form.steps(w[0], w[1], w[2])}\n\n` +
    `Every other option can be false while both premises are true, so none of them is forced.\n\n` +
    `Answer: ${answer}`;

  return {
    stem,
    answer,
    answerValue: catKey(form.concl),
    distractors: picked.map((c) => ({ text: sentence(c, w), value: catKey(c), why: whyFor(c) })),
    solution,
    keyIdea: 'A conclusion must be true in every situation that fits the premises; the middle group links the other two, and "some" conclusions need a guaranteed member to follow through.',
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
