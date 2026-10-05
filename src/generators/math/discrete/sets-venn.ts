import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { m } from '../../../lib/tex';

type Cand = { v: number; text: string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answer: number, answerText: string, pool: Cand[], allowZero = false): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(d.v) || d.v < 0 || (!allowZero && d.v === 0)) continue;
    if (d.v === answer || d.text === answerText) continue;
    if (out.some((x) => x.v === d.v || x.text === d.text)) continue;
    out.push(d);
  }
  return out;
}

const intCand = (v: number, why: string): Cand => ({ v, text: m(String(v)), why });
const cap = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1);

// ================================================================ two-set word problems
interface TwoCtx {
  intro: (n: number) => string;
  group: string; // "students"
  a: string; // "study French"
  b: string; // "study Spanish"
  both: string; // "study both French and Spanish"
  neither: string; // "study neither language"
  exactlyOne: string; // "study exactly one of the two languages"
  aOnly: string; // "study French but not Spanish"
  LA: string; // set letter for A
  LB: string;
  nameA: string; // short name, e.g. "French"
  nameB: string;
}

const TWO_CTX: TwoCtx[] = [
  {
    intro: (n) => `In a class of ${n} students,`,
    group: 'students',
    a: 'study French',
    b: 'study Spanish',
    both: 'study both French and Spanish',
    neither: 'study neither language',
    exactlyOne: 'study exactly one of the two languages',
    aOnly: 'study French but not Spanish',
    LA: 'F',
    LB: 'S',
    nameA: 'French',
    nameB: 'Spanish',
  },
  {
    intro: (n) => `In a survey of ${n} people,`,
    group: 'people',
    a: 'own a cat',
    b: 'own a dog',
    both: 'own both a cat and a dog',
    neither: 'own neither pet',
    exactlyOne: 'own exactly one of the two pets',
    aOnly: 'own a cat but not a dog',
    LA: 'C',
    LB: 'D',
    nameA: 'cat',
    nameB: 'dog',
  },
  {
    intro: (n) => `On one morning, ${n} customers visited a bakery. Of these customers,`,
    group: 'customers',
    a: 'bought bread',
    b: 'bought cake',
    both: 'bought both bread and cake',
    neither: 'bought neither bread nor cake',
    exactlyOne: 'bought exactly one of bread and cake',
    aOnly: 'bought bread but not cake',
    LA: 'B',
    LB: 'K',
    nameA: 'bread',
    nameB: 'cake',
  },
  {
    intro: (n) => `A gym has ${n} members. Of these members,`,
    group: 'members',
    a: 'use the pool',
    b: 'use the weights room',
    both: 'use both the pool and the weights room',
    neither: 'use neither the pool nor the weights room',
    exactlyOne: 'use exactly one of the pool and the weights room',
    aOnly: 'use the pool but not the weights room',
    LA: 'P',
    LB: 'W',
    nameA: 'pool',
    nameB: 'weights',
  },
  {
    intro: (n) => `${n} students applied for an AI internship. Of these applicants,`,
    group: 'applicants',
    a: 'know Python',
    b: 'know SQL',
    both: 'know both Python and SQL',
    neither: 'know neither language',
    exactlyOne: 'know exactly one of the two languages',
    aOnly: 'know Python but not SQL',
    LA: 'P',
    LB: 'Q',
    nameA: 'Python',
    nameB: 'SQL',
  },
];

type TwoAsk = 'both' | 'exactlyOne' | 'neither' | 'aOnly' | 'probNeither';

function twoSet(rng: Rng) {
  const ctx = rng.pick(TWO_CTX);
  const ask = rng.pick<TwoAsk>(['both', 'exactlyOne', 'neither', 'aOnly', 'probNeither']);
  for (;;) {
    const aOnly = rng.int(3, 20);
    const both = rng.int(2, 12);
    const bOnly = rng.int(3, 20);
    const neither = rng.int(2, 12);
    const N = aOnly + both + bOnly + neither;
    const a = aOnly + both;
    const b = bOnly + both;
    const union = a + b - both;
    const { LA, LB } = ctx;
    const nA = `n(${LA})`;
    const nB = `n(${LB})`;
    const nAB = `n(${LA} \\cap ${LB})`;
    const nU = `n(${LA} \\cup ${LB})`;
    const check = `Check with the four Venn regions: ${cap(ctx.nameA)} only $= ${aOnly}$, both $= ${both}$, ${ctx.nameB} only $= ${bOnly}$, neither $= ${neither}$, and $${aOnly} + ${both} + ${bOnly} + ${neither} = ${N}$.`;

    if (ask === 'probNeither') {
      const ans = new Frac(neither, N);
      const answer = m(ans.tex());
      const fc = (num: number, why: string): Cand => {
        const f = new Frac(num, N);
        // say what the unsimplified fraction in the explanation simplifies to, so it visibly matches the option
        const simp = f.d === N ? '' : ` (${m(`\\frac{${num}}{${N}} = ${f.tex()}`)})`;
        return { v: f.value(), text: m(f.tex()), why: why + simp };
      };
      const pool: Cand[] = [
        fc(union, `This is ${m(`\\frac{${union}}{${N}}`)}, the probability that the person is in **at least one** of the two groups, the complement of what was asked.`),
        fc(N - a - b, `This uses ${m(`${N} - ${a} - ${b}`)} for the "neither" group, forgetting that the ${both} ${ctx.group} who ${ctx.both} were subtracted twice.`),
        fc(neither + both, `This subtracts the overlap twice when finding the union (${m(`${a} + ${b} - 2 \\times ${both}`)}), so the ${both} ${ctx.group} in both groups end up counted as "neither".`),
        fc(both, `This is ${m(`\\frac{${both}}{${N}}`)}, the probability of being in **both** groups, not in neither.`),
      ];
      const d = pickDistinct(ans.value(), answer, pool);
      if (d.length < 3) continue;
      return {
        stem: `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${both} ${ctx.both}. One of the ${ctx.group} is chosen at random. What is the probability that they ${ctx.neither}?`,
        answer,
        answerValue: ans.value(),
        distractors: d.map((x) => ({ text: x.text, value: x.v, why: x.why })),
        solution:
          `1. Inclusion-exclusion: ${m(`${nU} = ${nA} + ${nB} - ${nAB} = ${a} + ${b} - ${both} = ${union}`)}. These ${ctx.group} are in at least one group.\n` +
          `2. Neither: ${m(`${N} - ${union} = ${neither}`)}.\n` +
          `3. Probability: ${m(`\\frac{${neither}}{${N}}${ans.d === N ? '' : ` = ${ans.tex()}`}`)}.\n\n` +
          `${check}\n\nAnswer: ${answer}`,
        keyIdea: 'Find the "neither" region with inclusion-exclusion, then divide by the total.',
      };
    }

    let ansV: number;
    let stem: string;
    let steps: string;
    let pool: Cand[];
    let keyIdea: string;
    if (ask === 'both') {
      ansV = both;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${neither} ${ctx.neither}. How many ${ctx.group} ${ctx.both}?`;
      steps =
        `1. In at least one group: ${m(`${N} - ${neither} = ${union}`)}.\n` +
        `2. Inclusion-exclusion: ${m(`${nU} = ${nA} + ${nB} - ${nAB}`)}, so ${m(`${union} = ${a} + ${b} - ${nAB} = ${a + b} - ${nAB}`)}.\n` +
        `3. Rearrange: ${m(`${nAB} = ${a + b} - ${union} = ${both}`)}.`;
      pool = [
        intCand(a + b - N, `This is ${m(`${a} + ${b} - ${N}`)}: it forgets that ${neither} ${ctx.group} are outside both circles, so only ${union} are inside the circles.`),
        intCand(union, `This is ${m(`${N} - ${neither}`)}, the number in **at least one** group, not the number in both.`),
        intCand(aOnly, `This is the number who ${ctx.aOnly} (${m(`${a} - ${both}`)}), one step too far: the question asks for the overlap itself.`),
        intCand(bOnly, `This is the ${ctx.nameB}-only region (${m(`${b} - ${both}`)}), not the overlap.`),
      ];
      keyIdea = 'Remove the "neither" group first, then the overlap is $n(A) + n(B) - n(A \\cup B)$.';
    } else if (ask === 'exactlyOne') {
      ansV = aOnly + bOnly;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${both} ${ctx.both}. How many ${ctx.group} ${ctx.exactlyOne}?`;
      steps =
        `Fill the Venn diagram from the middle outwards.\n\n` +
        `1. Both: ${m(String(both))}.\n` +
        `2. ${cap(ctx.nameA)} only: ${m(`${a} - ${both} = ${aOnly}`)}.\n` +
        `3. ${cap(ctx.nameB)} only: ${m(`${b} - ${both} = ${bOnly}`)}.\n` +
        `4. Exactly one: ${m(`${aOnly} + ${bOnly} = ${aOnly + bOnly}`)}.\n\n` +
        `(Shortcut: ${m(`${nA} + ${nB} - 2\\,${nAB} = ${a} + ${b} - ${2 * both} = ${aOnly + bOnly}`)}.)`;
      pool = [
        intCand(union, `This is ${m(`${a} + ${b} - ${both} = ${nU}`)}, the number in **at least one** group. It still includes the ${both} who ${ctx.both}.`),
        intCand(a + b, `This is ${m(`${a} + ${b}`)}, which counts the ${both} ${ctx.group} in both groups twice instead of removing them.`),
        intCand(aOnly, `This is only the ${ctx.nameA}-only region. It forgets to add the ${bOnly} in the ${ctx.nameB}-only region.`),
        intCand(bOnly, `This is only the ${ctx.nameB}-only region. It forgets to add the ${aOnly} in the ${ctx.nameA}-only region.`),
      ];
      keyIdea = '"Exactly one" means the two "only" regions: $n(A) + n(B) - 2\\,n(A \\cap B)$.';
    } else if (ask === 'neither') {
      ansV = neither;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${both} ${ctx.both}. How many ${ctx.group} ${ctx.neither}?`;
      steps =
        `1. Inclusion-exclusion: ${m(`${nU} = ${nA} + ${nB} - ${nAB} = ${a} + ${b} - ${both} = ${union}`)}.\n` +
        `2. Neither: ${m(`${N} - ${union} = ${neither}`)}.`;
      pool = [
        intCand(N - a - b, `This is ${m(`${N} - ${a} - ${b}`)}: it forgets that the ${both} ${ctx.group} in both groups were counted twice, so they get subtracted twice.`),
        intCand(union, `This is ${m(`${nU} = ${union}`)}, the number in **at least one** group. The question asks for the region outside both circles.`),
        intCand(neither + both, `This subtracts the overlap twice: ${m(`${a} + ${b} - 2 \\times ${both} = ${aOnly + bOnly}`)}, then ${m(`${N} - ${aOnly + bOnly} = ${neither + both}`)}. The overlap was only counted one extra time.`),
        intCand(N - a, `This is ${m(`${N} - ${a}`)}: it removes only the ${a} who ${ctx.a} and forgets the ${bOnly} who are only in the other group.`),
      ];
      keyIdea = 'Neither $= n(U) - n(A \\cup B)$, with $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.';
    } else {
      ansV = aOnly;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${neither} ${ctx.neither}. How many ${ctx.group} ${ctx.aOnly}?`;
      steps =
        `1. In at least one group: ${m(`${N} - ${neither} = ${union}`)}.\n` +
        `2. Everyone in the union who is **not** in the ${ctx.nameB} group is in the ${ctx.nameA}-only region: ${m(`${union} - ${b} = ${aOnly}`)}.\n\n` +
        `(Equivalently: both $= ${a} + ${b} - ${union} = ${both}$, and ${ctx.nameA} only $= ${a} - ${both} = ${aOnly}$.)`;
      pool = [
        intCand(N - b, `This is ${m(`${N} - ${b}`)}: it forgets to remove the ${neither} ${ctx.group} who ${ctx.neither}.`),
        intCand(both, `This is the number who ${ctx.both} (the overlap), not the ${ctx.nameA}-only region.`),
        intCand(bOnly, `This is the ${ctx.nameB}-only region (${m(`${union} - ${a}`)}), the wrong crescent of the diagram.`),
        intCand(a, `This is all ${a} who ${ctx.a}, including the ${both} who are also in the other group.`),
      ];
      keyIdea = 'Find $n(A \\cup B)$ from the "neither" count, then $A$ only $= n(A \\cup B) - n(B)$.';
    }
    const answer = m(String(ansV));
    const d = pickDistinct(ansV, answer, pool);
    if (d.length < 3) continue;
    return {
      stem,
      answer,
      answerValue: ansV,
      distractors: d.map((x) => ({ text: x.text, value: x.v, why: x.why })),
      solution: `${steps}\n\n${check}\n\nAnswer: ${answer}`,
      keyIdea,
    };
  }
}

// ================================================================ three-set inclusion-exclusion
interface ThreeCtx {
  group: string; // "students"
  verb: string; // "take"
  items: [string, string, string];
  letters: [string, string, string];
  /** Short names for region labels, e.g. "film". */
  short: [string, string, string];
  noun: string; // "subjects"
}

const THREE_CTX: ThreeCtx[] = [
  { group: 'students', verb: 'take', items: ['Maths', 'Physics', 'Chemistry'], letters: ['M', 'P', 'C'], short: ['Maths', 'Physics', 'Chemistry'], noun: 'subjects' },
  { group: 'people', verb: 'like', items: ['tea', 'coffee', 'juice'], letters: ['T', 'C', 'J'], short: ['tea', 'coffee', 'juice'], noun: 'drinks' },
  { group: 'households', verb: 'subscribe to', items: ['a film service', 'a music service', 'a sports channel'], letters: ['F', 'M', 'S'], short: ['film', 'music', 'sports'], noun: 'services' },
  { group: 'learners', verb: 'completed', items: ['the Python course', 'the Statistics course', 'the Machine Learning course'], letters: ['P', 'S', 'L'], short: ['Python', 'Statistics', 'ML'], noun: 'courses' },
];

type ThreeAsk = 'none' | 'exactlyOne' | 'onlyFirst';

function threeSet(rng: Rng) {
  const ctx = rng.pick(THREE_CTX);
  const ask = rng.pick<ThreeAsk>(['none', 'exactlyOne', 'onlyFirst']);
  const [A, B, C] = ctx.letters;
  const [iA, iB, iC] = ctx.items;
  const [sA, sB, sC] = ctx.short;
  const [cA, cB, cC] = ctx.short.map(cap);
  for (;;) {
    // at least 2 in the centre so every "x take all three" sentence is grammatical plural
    const x = rng.int(2, 6);
    const ab = rng.int(1, 9);
    const ac = rng.int(1, 9);
    const bc = rng.int(1, 9);
    const oA = rng.int(3, 18);
    const oB = rng.int(3, 18);
    const oC = rng.int(3, 18);
    const neither = rng.int(x + 1, x + 12);
    const nA = oA + ab + ac + x;
    const nB = oB + ab + bc + x;
    const nC = oC + ac + bc + x;
    const nAB = ab + x;
    const nAC = ac + x;
    const nBC = bc + x;
    const N = oA + oB + oC + ab + ac + bc + x + neither;
    const S1 = nA + nB + nC;
    const S2 = nAB + nAC + nBC;
    const union = S1 - S2 + x;

    const data =
      `Of ${N} ${ctx.group}, ${nA} ${ctx.verb} ${iA}, ${nB} ${ctx.verb} ${iB} and ${nC} ${ctx.verb} ${iC}. ` +
      `${nAB} ${ctx.verb} ${iA} and ${iB}, ${nAC} ${ctx.verb} ${iA} and ${iC}, ${nBC} ${ctx.verb} ${iB} and ${iC}, and ${x} ${ctx.verb} all three. ` +
      `(Each "two ${ctx.noun}" count includes the ${ctx.group} who ${ctx.verb} all three.)`;
    const ieFormula = `n(${A} \\cup ${B} \\cup ${C}) = n(${A}) + n(${B}) + n(${C}) - n(${A} \\cap ${B}) - n(${A} \\cap ${C}) - n(${B} \\cap ${C}) + n(${A} \\cap ${B} \\cap ${C})`;
    const regions =
      `- ${cA} and ${sB} only: ${m(`${nAB} - ${x} = ${ab}`)}\n` +
      `- ${cA} and ${sC} only: ${m(`${nAC} - ${x} = ${ac}`)}\n` +
      `- ${cB} and ${sC} only: ${m(`${nBC} - ${x} = ${bc}`)}\n` +
      `- ${cA} only: ${m(`${nA} - ${ab} - ${ac} - ${x} = ${oA}`)}\n` +
      `- ${cB} only: ${m(`${nB} - ${ab} - ${bc} - ${x} = ${oB}`)}\n` +
      `- ${cC} only: ${m(`${nC} - ${ac} - ${bc} - ${x} = ${oC}`)}`;

    let ansV: number;
    let stem: string;
    let steps: string;
    let pool: Cand[];
    let keyIdea: string;
    if (ask === 'none') {
      ansV = neither;
      stem = `${data} How many ${ctx.group} ${ctx.verb} **none** of the three?`;
      steps =
        `Use inclusion-exclusion for three sets:\n\n$$${ieFormula}$$\n\n` +
        `1. Add the singles: ${m(`${nA} + ${nB} + ${nC} = ${S1}`)}.\n` +
        `2. Subtract the pairs: ${m(`${nAB} + ${nAC} + ${nBC} = ${S2}`)}, so ${m(`${S1} - ${S2} = ${S1 - S2}`)}.\n` +
        `3. Add back the triple: ${m(`${S1 - S2} + ${x} = ${union}`)} ${ctx.verb} at least one.\n` +
        `4. None: ${m(`${N} - ${union} = ${neither}`)}.\n\n` +
        `Why add back the ${x}? They were added 3 times in step 1 and subtracted 3 times in step 2, so after step 2 they were not counted at all.`;
      pool = [
        intCand(neither - x, `This forgets to add back the ${x} who ${ctx.verb} all three: ${m(`${N} - ${S1 - S2} = ${neither - x}`)}.`),
        intCand(neither + x, `This subtracts the triple instead of adding it back: ${m(`${S1} - ${S2} - ${x} = ${S1 - S2 - x}`)}, then ${m(`${N} - ${S1 - S2 - x} = ${neither + x}`)}.`),
        intCand(union, `This is the number who ${ctx.verb} **at least one** of the three. The question asks for the ${ctx.group} outside all three circles.`),
        intCand(S1 - S2, `This is ${m(`${S1} - ${S2}`)}: it forgets to add back the triple and also stops before subtracting from ${N}.`),
      ];
      keyIdea = 'Three-set inclusion-exclusion: add the singles, subtract the pairs, add back the triple; then subtract from the total.';
    } else if (ask === 'exactlyOne') {
      ansV = oA + oB + oC;
      stem = `${data} How many ${ctx.group} ${ctx.verb} **exactly one** of the three?`;
      steps =
        `Fill the Venn diagram from the centre outwards. All three: ${m(String(x))}.\n\n${regions}\n\n` +
        `Exactly one: ${m(`${oA} + ${oB} + ${oC} = ${ansV}`)}.`;
      pool = [
        // only offer this slip when it gives non-negative "only" regions (otherwise a student would notice at once)
        ...(Math.min(oA, oB, oC) > x
          ? [intCand(ansV - 3 * x, `This finds each "only" region by subtracting the full pair totals, e.g. ${m(`${nA} - ${nAB} - ${nAC} = ${oA - x}`)}. That removes the ${x} in the centre twice, so ${x} must be added back to each region.`)]
          : []),
        intCand(ansV + 3 * x, `This subtracts the "two only" regions from each single total but forgets to subtract the ${x} in the centre, e.g. ${m(`${nA} - ${ab} - ${ac} = ${oA + x}`)}.`),
        intCand(ab + ac + bc, `This is the number who ${ctx.verb} **exactly two** of the three (${m(`${ab} + ${ac} + ${bc}`)}), not exactly one.`),
        intCand(union, `This is the number who ${ctx.verb} **at least one** (${m(`${S1} - ${S2} + ${x}`)}). It still includes those in two or three groups.`),
      ];
      keyIdea = 'Start in the centre, then the "two only" regions, then the "one only" regions.';
    } else {
      ansV = oA;
      stem = `${data} How many ${ctx.group} ${ctx.verb} ${iA} **only** (and neither of the other two)?`;
      steps =
        `Fill the ${sA} circle from the centre outwards.\n\n` +
        `1. All three: ${m(String(x))}.\n` +
        `2. ${cA} and ${sB} only: ${m(`${nAB} - ${x} = ${ab}`)}.\n` +
        `3. ${cA} and ${sC} only: ${m(`${nAC} - ${x} = ${ac}`)}.\n` +
        `4. ${cA} only: ${m(`${nA} - ${ab} - ${ac} - ${x} = ${oA}`)}.\n\n` +
        `(Equivalent shortcut: ${m(`n(${A}) - n(${A} \\cap ${B}) - n(${A} \\cap ${C}) + n(${A} \\cap ${B} \\cap ${C}) = ${nA} - ${nAB} - ${nAC} + ${x} = ${oA}`)}.)`;
      pool = [
        intCand(oA - x, `This is ${m(`${nA} - ${nAB} - ${nAC}`)}: the ${x} in the centre belong to both pair totals, so they are subtracted twice and one ${x} must be added back.`),
        intCand(oA + x, `This subtracts the "two only" regions (${ab} and ${ac}) but forgets to subtract the ${x} in the centre.`),
        intCand(nA - x, `This only removes the ${x} who ${ctx.verb} all three, forgetting the ${ab + ac} who ${ctx.verb} ${iA} and exactly one other.`),
        intCand(nA - nAB, `This removes the ${sA}-and-${sB} overlap but forgets the ${sA}-and-${sC} overlap.`),
      ];
      keyIdea = 'For "A only", remove both pair overlaps from $n(A)$ and add back the triple, which was removed twice.';
    }
    const answer = m(String(ansV));
    const d = pickDistinct(ansV, answer, pool);
    if (d.length < 3) continue;
    return {
      stem,
      answer,
      answerValue: ansV,
      distractors: d.map((v) => ({ text: v.text, value: v.v, why: v.why })),
      solution: `${steps}\n\nAnswer: ${answer}`,
      keyIdea,
    };
  }
}

// ================================================================ counting subsets
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

type SubAsk = 'all' | 'nonEmptyProper' | 'withWithout' | 'atLeastOneEven';

function subsetCount(rng: Rng) {
  const ask = rng.pick<SubAsk>(['all', 'nonEmptyProper', 'withWithout', 'atLeastOneEven']);
  const n = ask === 'atLeastOneEven' ? rng.int(5, 10) : rng.int(4, 9);
  const P = 2 ** n;
  let ansV: number;
  let stem: string;
  let steps: string;
  let pool: Cand[];
  let keyIdea: string;
  if (ask === 'all') {
    const els = LETTERS.slice(0, n);
    ansV = P;
    stem = `How many subsets does the set ${m(`\\{${els.join(', ')}\\}`)} have? (Include the empty set and the set itself.)`;
    steps =
      `The set has ${n} elements. For each element there are 2 choices: **in** the subset or **out**.\n\n` +
      `Multiply: ${m(`${Array(n).fill('2').join(' \\times ')} = 2^{${n}} = ${P}`)}.\n\n` +
      `All "out" gives ${m('\\varnothing')}, all "in" gives the whole set; both are counted.`;
    pool = [
      intCand(P - 1, `This is ${m(`2^{${n}} - 1`)}: it leaves out the empty set (or the whole set), but the question includes both.`),
      intCand(n * n, `This is ${m(`${n}^{2}`)}: the base and the power are swapped. The number of subsets is ${m('2^{n}')}, not ${m('n^{2}')}.`),
      intCand(2 * n, `This is ${m(`2 \\times ${n}`)}: it multiplies by 2 instead of raising 2 to the power ${n}.`),
      intCand(P / 2, `This is ${m(`2^{${n - 1}}`)}: the power should be the number of elements, ${n}.`),
      intCand(P - 2, `This is ${m(`2^{${n}} - 2`)}: it removes both the empty set and the set itself, but the question says to include them.`),
    ];
    keyIdea = 'A set with $n$ elements has $2^{n}$ subsets.';
  } else if (ask === 'nonEmptyProper') {
    ansV = P - 2;
    stem = `A set $S$ has ${n} elements. How many **non-empty proper** subsets does $S$ have (subsets that are neither ${m('\\varnothing')} nor $S$ itself)?`;
    steps =
      `1. All subsets: ${m(`2^{${n}} = ${P}`)}.\n` +
      `2. "Proper" removes $S$ itself: ${m(`${P} - 1 = ${P - 1}`)}.\n` +
      `3. "Non-empty" removes ${m('\\varnothing')}: ${m(`${P - 1} - 1 = ${P - 2}`)}.`;
    pool = [
      intCand(P, `This is ${m(`2^{${n}}`)}, the number of **all** subsets. It still includes ${m('\\varnothing')} and $S$.`),
      intCand(P - 1, `This is ${m(`2^{${n}} - 1`)}: it removes only one of the two excluded subsets, but both ${m('\\varnothing')} and $S$ must go.`),
      intCand(n * n - 2, `This is ${m(`${n}^{2} - 2`)}: the base and the power are swapped. The number of subsets is ${m('2^{n}')}.`),
      intCand(2 * n - 2, `This is ${m(`2 \\times ${n} - 2`)}: it multiplies by 2 instead of raising 2 to the power ${n}.`),
    ];
    keyIdea = 'Start from $2^{n}$ and subtract 1 for each of $\\varnothing$ and the whole set that is excluded.';
  } else if (ask === 'withWithout') {
    const els = LETTERS.slice(0, n);
    const [p, q] = rng.sample(els, 2);
    ansV = P / 4;
    stem = `How many subsets of ${m(`\\{${els.join(', ')}\\}`)} contain ${m(p)} but do **not** contain ${m(q)}?`;
    steps =
      `1. The element ${m(p)} is forced **in** and ${m(q)} is forced **out**: 1 choice each.\n` +
      `2. Each of the other ${m(`${n} - 2 = ${n - 2}`)} elements is free: in or out, 2 choices each.\n` +
      `3. Number of subsets: ${m(`2^{${n - 2}} = ${P / 4}`)}.`;
    pool = [
      intCand(P / 2, `This is ${m(`2^{${n - 1}}`)}: it applies only one of the two conditions (fixing ${m(p)}) and lets ${m(q)} be free.`),
      intCand(P / 4 - 1, `This subtracts 1 as if the empty set had to be removed. No subset counted here is empty (each one contains ${m(p)}); even ${m(`\\{${p}\\}`)}, with every free element left out, is a valid subset.`),
      intCand(P, `This is ${m(`2^{${n}}`)}, the number of all subsets: it ignores both conditions.`),
      intCand(2 * (n - 2), `This is ${m(`2 \\times ${n - 2}`)}: it multiplies by 2 instead of raising 2 to the power ${n - 2}.`),
    ];
    keyIdea = 'Forced elements have 1 choice and free elements have 2, so the count is $2^{\\text{number of free elements}}$.';
  } else {
    const ev = Math.floor(n / 2);
    const od = n - ev;
    ansV = P - 2 ** od;
    stem = `How many subsets of ${m(`\\{1, 2, \\dots, ${n}\\}`)} contain **at least one** even number?`;
    steps =
      `Use the complement: count the subsets with **no** even number and subtract from the total.\n\n` +
      `1. All subsets: ${m(`2^{${n}} = ${P}`)}.\n` +
      `2. There are ${ev} even numbers and ${od} odd numbers. Subsets with no even number use only the ${od} odd numbers: ${m(`2^{${od}} = ${2 ** od}`)} (this includes ${m('\\varnothing')}).\n` +
      `3. At least one even: ${m(`${P} - ${2 ** od} = ${ansV}`)}.`;
    pool = [
      intCand(P - 1, `This is ${m(`2^{${n}} - 1`)}: it removes only the empty set, but non-empty subsets made only of odd numbers also contain no even number.`),
      intCand(2 ** od, `This is ${m(`2^{${od}}`)}, the number of subsets with **no** even number. It must be subtracted from ${P}.`),
      intCand(2 ** ev - 1, `This is ${m(`2^{${ev}} - 1`)}, the non-empty subsets of the even numbers alone. It forgets that any odd numbers can be added freely.`),
      intCand(P - 2 ** ev, `This subtracts ${m(`2^{${ev}}`)} (subsets of the **even** numbers) instead of ${m(`2^{${od}}`)} (subsets with no even number).`),
    ];
    keyIdea = '"At least one" is easiest by complement: total subsets minus the subsets with none.';
  }
  const answer = m(String(ansV));
  const d = pickDistinct(ansV, answer, pool);
  // Every branch's pool always leaves at least 3 distinct genuine mistakes for the n ranges used,
  // so never pad with made-up numbers; fail loudly instead if that ever changes.
  if (d.length < 3) throw new Error(`gen-sets-venn-subset-count: only ${d.length} distractors for ${ask}, n = ${n}`);
  return {
    stem,
    answer,
    answerValue: ansV,
    distractors: d.map((v) => ({ text: v.text, value: v.v, why: v.why })),
    solution: `${steps}\n\nAnswer: ${answer}`,
    keyIdea,
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-sets-venn-two-set-survey',
    subtopic: 'sets-venn',
    difficulty: 'exam',
    title: 'Two-set Venn word problem',
    generate: twoSet,
  },
  {
    id: 'gen-sets-venn-three-set',
    subtopic: 'sets-venn',
    difficulty: 'challenge',
    title: 'Three-set Venn diagram: inclusion-exclusion',
    generate: threeSet,
  },
  {
    id: 'gen-sets-venn-subset-count',
    subtopic: 'sets-venn',
    difficulty: 'foundation',
    title: 'Counting subsets (powers of 2)',
    generate: subsetCount,
  },
];
