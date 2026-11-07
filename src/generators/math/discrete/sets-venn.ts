import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps as stepsOf } from '../../../lib/explanation';
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
  bothShort: string; // "study both"
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
    bothShort: 'study both',
    neither: 'study neither language',
    exactlyOne: 'study exactly one of the two languages',
    aOnly: 'study French but not Spanish',
    LA: 'F',
    LB: 'S',
    nameA: 'French',
    nameB: 'Spanish',
  },
  {
    intro: (n) => `Of ${n} people,`,
    group: 'people',
    a: 'own a cat',
    b: 'own a dog',
    both: 'own both a cat and a dog',
    bothShort: 'own both',
    neither: 'own neither pet',
    exactlyOne: 'own exactly one of the two pets',
    aOnly: 'own a cat but not a dog',
    LA: 'C',
    LB: 'D',
    nameA: 'cat',
    nameB: 'dog',
  },
  {
    intro: (n) => `Of ${n} bakery customers,`,
    group: 'customers',
    a: 'bought bread',
    b: 'bought cake',
    both: 'bought both bread and cake',
    bothShort: 'bought both',
    neither: 'bought neither bread nor cake',
    exactlyOne: 'bought exactly one of bread and cake',
    aOnly: 'bought bread but not cake',
    LA: 'B',
    LB: 'K',
    nameA: 'bread',
    nameB: 'cake',
  },
  {
    intro: (n) => `Of ${n} gym members,`,
    group: 'members',
    a: 'use the pool',
    b: 'use the weights room',
    both: 'use both the pool and the weights room',
    bothShort: 'use both',
    neither: 'use neither the pool nor the weights room',
    exactlyOne: 'use exactly one of the pool and the weights room',
    aOnly: 'use the pool but not the weights room',
    LA: 'P',
    LB: 'W',
    nameA: 'pool',
    nameB: 'weights',
  },
  {
    intro: (n) => `Of ${n} job applicants,`,
    group: 'applicants',
    a: 'know Python',
    b: 'know SQL',
    both: 'know both Python and SQL',
    bothShort: 'know both',
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
    const nU = `n(${LA} \\cup ${LB})`;

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
        stem: `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${both} ${ctx.bothShort}. One is chosen at random. What is the probability that they ${ctx.neither}?`,
        answer,
        answerValue: ans.value(),
        distractors: d.map((x) => ({ text: x.text, value: x.v, why: x.why })),
        asking: `What fraction of the ${N} ${ctx.group} ${ctx.neither}?`,
        solution: stepsOf(
          `The probability is the number who ${ctx.neither}, divided by the total of ${N}. So first we need that number.`,
          `Adding the two groups gives ${m(`${a} + ${b} = ${a + b}`)}, but the ${both} who ${ctx.bothShort} were counted twice. Take off one copy: ${m(`${a} + ${b} - ${both} = ${union}`)}. So ${union} ${ctx.group} are in at least one group.`,
          `The rest are in neither group: ${m(`${N} - ${union} = ${neither}`)}.`,
          ans.d === N
            ? `The probability is ${m(`\\frac{${neither}}{${N}}`)}. The top and bottom share no common factor, so this can't be simplified.`
            : `The probability is ${m(`\\frac{${neither}}{${N}}`)}. Divide the top and bottom by ${N / ans.d} to simplify it: ${m(`\\frac{${neither}}{${N}} = ${ans.tex()}`)}.`,
        ),
        conclusion: `${neither} out of ${N} ${ctx.group} are in neither group, so the probability is ${answer}.`,
        keyIdea: 'For a Venn probability, find the count for the region you want, then divide by the total. Here neither $=$ total $-$ (first $+$ second $-$ both).',
      };
    }

    let ansV: number;
    let stem: string;
    let asking: string;
    let solution: string;
    let conclusion: string;
    let pool: Cand[];
    let keyIdea: string;
    if (ask === 'both') {
      ansV = both;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${neither} ${ctx.neither}. How many ${ctx.bothShort}?`;
      asking = `How many ${ctx.group} are in the overlap, in both groups?`;
      solution = stepsOf(
        `Picture two overlapping circles: those who ${ctx.a} and those who ${ctx.b}. The ${neither} who ${ctx.neither} sit outside both circles.`,
        `So the number inside the circles is ${m(`${N} - ${neither} = ${union}`)}. These ${union} are in at least one group.`,
        `Now add the two circle totals: ${m(`${a} + ${b} = ${a + b}`)}. That is more than ${union}, because anyone in both groups was counted once in each circle.`,
        `The extra above ${union} must be exactly those who were counted twice: ${m(`${a + b} - ${union} = ${both}`)}.`,
      );
      conclusion = `Only ${union} are inside the circles but the totals add up to ${a + b}, so the overlap is ${m(String(both))}.`;
      pool = [
        intCand(a + b - N, `This is ${m(`${a} + ${b} - ${N}`)}: it forgets that ${neither} ${ctx.group} are outside both circles, so only ${union} are inside the circles.`),
        intCand(union, `This is ${m(`${N} - ${neither}`)}, the number in **at least one** group, not the number in both.`),
        intCand(aOnly, `This is the number who ${ctx.aOnly} (${m(`${a} - ${both}`)}), one step too far: the question asks for the overlap itself.`),
        intCand(bOnly, `This is the ${ctx.nameB}-only region (${m(`${b} - ${both}`)}), not the overlap.`),
      ];
      keyIdea = 'Remove the "neither" group from the total first. Then overlap $=$ first group $+$ second group $-$ number inside the circles.';
    } else if (ask === 'exactlyOne') {
      ansV = aOnly + bOnly;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${both} ${ctx.bothShort}. How many ${ctx.exactlyOne}?`;
      asking = `How many ${ctx.group} are in one group but not the other?`;
      solution = stepsOf(
        `"Exactly one" means those only in the first group plus those only in the second. The ${both} who ${ctx.bothShort} do not count.`,
        `The ${a} who ${ctx.a} include the ${both} who ${ctx.bothShort}. So ${ctx.nameA} only is ${m(`${a} - ${both} = ${aOnly}`)}.`,
        `The same goes for the second group. ${cap(ctx.nameB)} only is ${m(`${b} - ${both} = ${bOnly}`)}.`,
        `Add the two "only" groups: ${m(`${aOnly} + ${bOnly} = ${aOnly + bOnly}`)}.`,
      );
      conclusion = `${cap(ctx.nameA)} only is ${aOnly} and ${ctx.nameB} only is ${bOnly}, so ${m(String(aOnly + bOnly))} are in exactly one group.`;
      pool = [
        intCand(union, `This is ${m(`${a} + ${b} - ${both} = ${nU}`)}, the number in **at least one** group. It still includes the ${both} who ${ctx.both}.`),
        intCand(a + b, `This is ${m(`${a} + ${b}`)}, which counts the ${both} ${ctx.group} in both groups twice instead of removing them.`),
        intCand(aOnly, `This is only the ${ctx.nameA}-only region. It forgets to add the ${bOnly} in the ${ctx.nameB}-only region.`),
        intCand(bOnly, `This is only the ${ctx.nameB}-only region. It forgets to add the ${aOnly} in the ${ctx.nameA}-only region.`),
      ];
      keyIdea = 'Fill a Venn diagram from the middle out: write the overlap first, then subtract it from each total to get the "only" regions. "Exactly one" is the sum of the "only" regions.';
    } else if (ask === 'neither') {
      ansV = neither;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${both} ${ctx.bothShort}. How many ${ctx.neither}?`;
      asking = `How many of the ${N} ${ctx.group} are in neither group?`;
      solution = stepsOf(
        `Picture two overlapping circles. Those who ${ctx.neither} sit outside both. So first find how many are inside.`,
        `Adding the two groups gives ${m(`${a} + ${b} = ${a + b}`)}, but that counts the ${both} who ${ctx.bothShort} twice.`,
        `Take off one copy of them: ${m(`${a} + ${b} - ${both} = ${union}`)}. So ${union} are in at least one group.`,
        `The rest are in neither: ${m(`${N} - ${union} = ${neither}`)}.`,
      );
      conclusion = `${union} of the ${N} ${ctx.group} are inside the circles, so ${m(String(neither))} are outside both.`;
      pool = [
        intCand(N - a - b, `This is ${m(`${N} - ${a} - ${b}`)}: it forgets that the ${both} ${ctx.group} in both groups were counted twice, so they get subtracted twice.`),
        intCand(union, `This is ${m(`${nU} = ${union}`)}, the number in **at least one** group. The question asks for the region outside both circles.`),
        intCand(neither + both, `This subtracts the overlap twice: ${m(`${a} + ${b} - 2 \\times ${both} = ${aOnly + bOnly}`)}, then ${m(`${N} - ${aOnly + bOnly} = ${neither + both}`)}. The overlap was only counted one extra time.`),
        intCand(N - a, `This is ${m(`${N} - ${a}`)}: it removes only the ${a} who ${ctx.a} and forgets the ${bOnly} who are only in the other group.`),
      ];
      keyIdea = 'Neither $=$ total $-$ (first $+$ second $-$ both). The overlap must be taken off once, because adding the two groups counts it twice.';
    } else {
      ansV = aOnly;
      stem = `${ctx.intro(N)} ${a} ${ctx.a}, ${b} ${ctx.b} and ${neither} ${ctx.neither}. How many ${ctx.aOnly}?`;
      asking = `How many ${ctx.group} ${ctx.aOnly}?`;
      solution = stepsOf(
        `Picture two overlapping circles. The ${neither} who ${ctx.neither} sit outside both. So the number inside the circles is ${m(`${N} - ${neither} = ${union}`)}.`,
        `Those ${union} split into two parts: the ${b} who ${ctx.b}, and the rest, who ${ctx.aOnly}.`,
        `So take the ${b} away: ${m(`${union} - ${b} = ${aOnly}`)}.`,
      );
      conclusion = `${union} are inside the circles and ${b} of them ${ctx.b}, which leaves ${m(String(aOnly))} who ${ctx.aOnly}.`;
      pool = [
        intCand(N - b, `This is ${m(`${N} - ${b}`)}: it forgets to remove the ${neither} ${ctx.group} who ${ctx.neither}.`),
        intCand(both, `This is the number who ${ctx.both} (the overlap), not the ${ctx.nameA}-only region.`),
        intCand(bOnly, `This is the ${ctx.nameB}-only region (${m(`${union} - ${a}`)}), the wrong crescent of the diagram.`),
        intCand(a, `This is all ${a} who ${ctx.a}, including the ${both} who are also in the other group.`),
      ];
      keyIdea = 'Find the number inside the circles from the "neither" count. Then $A$ only $=$ number inside $-$ $n(B)$, because everyone inside who is not in $B$ must be in $A$ only.';
    }
    const answer = m(String(ansV));
    const d = pickDistinct(ansV, answer, pool);
    if (d.length < 3) continue;
    return {
      stem,
      answer,
      answerValue: ansV,
      distractors: d.map((x) => ({ text: x.text, value: x.v, why: x.why })),
      asking,
      solution,
      conclusion,
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

type ThreeAsk = 'none' | 'onlyFirst';

function threeSet(rng: Rng) {
  const ctx = rng.pick(THREE_CTX);
  const ask = rng.pick<ThreeAsk>(['none', 'onlyFirst']);
  const iA = ctx.items[0];
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

    const data = `The table gives counts for ${N} ${ctx.group}; each pair count includes those in all three.`;
    const table = {
      headers: [cap(ctx.noun), `Number of ${ctx.group}`],
      rows: [
        [cA, nA],
        [cB, nB],
        [cC, nC],
        [`${cA} and ${sB}`, nAB],
        [`${cA} and ${sC}`, nAC],
        [`${cB} and ${sC}`, nBC],
        ['All three', x],
      ] as (string | number)[][],
    };

    let ansV: number;
    let stem: string;
    let asking: string;
    let solution: string;
    let conclusion: string;
    let pool: Cand[];
    let keyIdea: string;
    if (ask === 'none') {
      ansV = neither;
      stem = `${data} How many ${ctx.group} ${ctx.verb} **none** of the three?`;
      asking = `How many of the ${N} ${ctx.group} are outside all three groups?`;
      solution = stepsOf(
        `Use **inclusion-exclusion**: a way to count overlapping groups without counting anyone twice. We first find how many are in at least one group, then take that from ${N}.`,
        `Add the three single totals: ${m(`${nA} + ${nB} + ${nC} = ${S1}`)}. This is too many, because anyone in two groups has been counted twice.`,
        `Take off the three pair totals: ${m(`${nAB} + ${nAC} + ${nBC} = ${S2}`)}, and ${m(`${S1} - ${S2} = ${S1 - S2}`)}.`,
        `Now think about the ${x} in all three. They were added 3 times in the singles and taken off 3 times in the pairs, so they are not counted at all. Add them back: ${m(`${S1 - S2} + ${x} = ${union}`)}.`,
        `So ${union} ${ctx.group} are in at least one group. The rest are in none: ${m(`${N} - ${union} = ${neither}`)}.`,
      );
      conclusion = `${union} of the ${N} ${ctx.group} are in at least one group, so ${m(String(neither))} are in none of the three.`;
      pool = [
        intCand(neither - x, `This forgets to add back the ${x} who ${ctx.verb} all three: ${m(`${N} - ${S1 - S2} = ${neither - x}`)}.`),
        intCand(neither + x, `This subtracts the triple instead of adding it back: ${m(`${S1} - ${S2} - ${x} = ${S1 - S2 - x}`)}, then ${m(`${N} - ${S1 - S2 - x} = ${neither + x}`)}.`),
        intCand(union, `This is the number who ${ctx.verb} **at least one** of the three. The question asks for the ${ctx.group} outside all three circles.`),
        intCand(S1 - S2, `This is ${m(`${S1} - ${S2}`)}: it forgets to add back the triple and also stops before subtracting from ${N}.`),
      ];
      keyIdea = 'For three overlapping groups: add the singles, subtract the pairs, add back the triple. That gives the number in at least one group. Subtract it from the total to get "none".';
    } else {
      ansV = oA;
      stem = `${data} How many ${ctx.group} ${ctx.verb} ${iA} **only**?`;
      asking = `How many ${ctx.group} ${ctx.verb} ${iA} and neither of the other two?`;
      solution = stepsOf(
        `Picture three overlapping circles and fill the ${sA} circle from the centre outwards. Its total of ${nA} splits into four parts: ${sA} only, ${sA} and ${sB} only, ${sA} and ${sC} only, and all three.`,
        `The centre is the ${x} in all three.`,
        `The pair totals in the table include that centre, so take it off. ${cA} and ${sB} only is ${m(`${nAB} - ${x} = ${ab}`)}. ${cA} and ${sC} only is ${m(`${nAC} - ${x} = ${ac}`)}.`,
        `Take those three parts away from the total of ${nA} to leave ${sA} only: ${m(`${nA} - ${ab} - ${ac} - ${x} = ${oA}`)}.`,
      );
      conclusion = `The other three parts of the circle hold ${ab}, ${ac} and ${x}, which leaves ${m(String(oA))} in ${sA} only.`;
      pool = [
        intCand(oA - x, `This is ${m(`${nA} - ${nAB} - ${nAC}`)}: the ${x} in the centre belong to both pair totals, so they are subtracted twice and one ${x} must be added back.`),
        intCand(oA + x, `This subtracts the "two only" regions (${ab} and ${ac}) but forgets to subtract the ${x} in the centre.`),
        intCand(nA - x, `This only removes the ${x} who ${ctx.verb} all three, forgetting the ${ab + ac} who ${ctx.verb} ${iA} and exactly one other.`),
        intCand(nA - nAB, `This removes the ${sA}-and-${sB} overlap but forgets the ${sA}-and-${sC} overlap.`),
      ];
      keyIdea = 'For "only in A": write the centre first, subtract it from each pair total, then subtract those parts and the centre from $n(A)$. Working from the centre out stops the centre being removed twice.';
    }
    const answer = m(String(ansV));
    const d = pickDistinct(ansV, answer, pool);
    if (d.length < 3) continue;
    return {
      stem,
      table,
      answer,
      answerValue: ansV,
      distractors: d.map((v) => ({ text: v.text, value: v.v, why: v.why })),
      asking,
      solution,
      conclusion,
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
  let asking: string;
  let solution: string;
  let conclusion: string;
  let pool: Cand[];
  let keyIdea: string;
  const twos = (k: number) => `${Array(k).fill('2').join(' \\times ')} = 2^{${k}}`;
  if (ask === 'all') {
    const els = LETTERS.slice(0, n);
    ansV = P;
    stem = `How many subsets does the set ${m(`\\{${els.join(', ')}\\}`)} have? (Include the empty set and the set itself.)`;
    asking = `How many different selections can be made from these ${n} letters, including no letters and all of them?`;
    solution = stepsOf(
      `A **subset** is any selection of items from a set. It can use all of them, some of them or none of them. For example, ${m('\\{a, c\\}')} is one subset.`,
      `Build a subset by making one decision per letter: is it in, or is it out? So each of the ${n} letters has 2 choices.`,
      'Each pattern of in and out gives a different subset. All out gives the empty set, and all in gives the whole set, so both get counted.',
      `The decisions are separate, so multiply the choices: ${m(`${twos(n)} = ${P}`)}.`,
    );
    conclusion = `${n} letters with 2 choices each give ${m(`2^{${n}}`)} subsets, so the answer is ${m(String(P))}.`;
    pool = [
      intCand(P - 1, `This is ${m(`2^{${n}} - 1`)}: it leaves out the empty set (or the whole set), but the question includes both.`),
      intCand(n * n, `This is ${m(`${n}^{2}`)}: the base and the power are swapped. The number of subsets is ${m('2^{n}')}, not ${m('n^{2}')}.`),
      intCand(2 * n, `This is ${m(`2 \\times ${n}`)}: it multiplies by 2 instead of raising 2 to the power ${n}.`),
      intCand(P / 2, `This is ${m(`2^{${n - 1}}`)}: the power should be the number of elements, ${n}.`),
      intCand(P - 2, `This is ${m(`2^{${n}} - 2`)}: it removes both the empty set and the set itself, but the question says to include them.`),
    ];
    keyIdea = 'A set with $n$ elements has $2^{n}$ subsets, because each element is either in or out. Start from this whenever a question asks how many subsets, then remove any the question excludes.';
  } else if (ask === 'nonEmptyProper') {
    ansV = P - 2;
    stem = `A set $S$ has ${n} elements. How many **non-empty proper** subsets does $S$ have (subsets that are neither ${m('\\varnothing')} nor $S$ itself)?`;
    asking = 'How many subsets are left once we rule out the empty set and the whole set?';
    solution = stepsOf(
      `Each of the ${n} elements is either in a subset or out of it, which is 2 choices per element. So the total number of subsets is ${m(`${twos(n)} = ${P}`)}.`,
      `"Non-empty" rules out ${m('\\varnothing')}, the empty set, which is the subset with nothing in it. That is 1 subset.`,
      '"Proper" rules out $S$ itself, the subset with everything in it. That is 1 more subset.',
      `Take both away: ${m(`${P} - 1 - 1 = ${P - 2}`)}.`,
    );
    conclusion = `There are ${P} subsets in all and 2 of them are excluded, so the answer is ${m(String(P - 2))}.`;
    pool = [
      intCand(P, `This is ${m(`2^{${n}}`)}, the number of **all** subsets. It still includes ${m('\\varnothing')} and $S$.`),
      intCand(P - 1, `This is ${m(`2^{${n}} - 1`)}: it removes only one of the two excluded subsets, but both ${m('\\varnothing')} and $S$ must go.`),
      intCand(n * n - 2, `This is ${m(`${n}^{2} - 2`)}: the base and the power are swapped. The number of subsets is ${m('2^{n}')}.`),
      intCand(2 * n - 2, `This is ${m(`2 \\times ${n} - 2`)}: it multiplies by 2 instead of raising 2 to the power ${n}.`),
    ];
    keyIdea = 'Start from $2^{n}$ subsets, then subtract 1 for each special subset the question excludes. "Non-empty" removes $\\varnothing$, and "proper" removes the whole set.';
  } else if (ask === 'withWithout') {
    const els = LETTERS.slice(0, n);
    const [p, q] = rng.sample(els, 2);
    ansV = P / 4;
    stem = `How many subsets of ${m(`\\{${els.join(', ')}\\}`)} contain ${m(p)} but do **not** contain ${m(q)}?`;
    asking = `How many subsets include ${m(p)} and leave out ${m(q)}?`;
    solution = stepsOf(
      'A subset is built by deciding, for each element, whether it is in or out. Normally that is 2 choices per element.',
      `Here two decisions are already made: ${m(p)} must be in and ${m(q)} must be out. So each of those has only 1 choice.`,
      `That leaves the other ${m(`${n} - 2 = ${n - 2}`)} elements free, with 2 choices each.`,
      `Multiply the choices of the free elements: ${m(`${twos(n - 2)} = ${P / 4}`)}.`,
    );
    conclusion = `Only the ${n - 2} free elements have a choice, so there are ${m(String(P / 4))} such subsets.`;
    pool = [
      intCand(P / 2, `This is ${m(`2^{${n - 1}}`)}: it applies only one of the two conditions (fixing ${m(p)}) and lets ${m(q)} be free.`),
      intCand(P / 4 - 1, `This subtracts 1 as if the empty set had to be removed. No subset counted here is empty (each one contains ${m(p)}); even ${m(`\\{${p}\\}`)}, with every free element left out, is a valid subset.`),
      intCand(P, `This is ${m(`2^{${n}}`)}, the number of all subsets: it ignores both conditions.`),
      intCand(2 * (n - 2), `This is ${m(`2 \\times ${n - 2}`)}: it multiplies by 2 instead of raising 2 to the power ${n - 2}.`),
    ];
    keyIdea = 'Forced elements have 1 choice and free elements have 2, so the count is $2^{\\text{number of free elements}}$. Count how many elements the question leaves free, then raise 2 to that power.';
  } else {
    const ev = Math.floor(n / 2);
    const od = n - ev;
    ansV = P - 2 ** od;
    stem = `How many subsets of ${m(`\\{1, 2, \\dots, ${n}\\}`)} contain **at least one** even number?`;
    asking = `Out of all the subsets of 1 to ${n}, how many include an even number?`;
    solution = stepsOf(
      '"At least one" has many cases: one even number, two even numbers, and so on. It is quicker to count the opposite, subsets with **no** even number, and subtract.',
      `The set has ${n} numbers, each in or out, so there are ${m(`2^{${n}} = ${P}`)} subsets in all.`,
      `There are ${ev} even numbers, so the other ${od} are odd. A subset with no even number can only use those ${od} odd numbers, each in or out, which gives ${m(`2^{${od}} = ${2 ** od}`)} subsets. This includes the empty set, which has no even number either.`,
      `Subtract: ${m(`${P} - ${2 ** od} = ${ansV}`)}.`,
    );
    conclusion = `Of the ${P} subsets, ${2 ** od} have no even number, so ${m(String(ansV))} have at least one.`;
    pool = [
      intCand(P - 1, `This is ${m(`2^{${n}} - 1`)}: it removes only the empty set, but non-empty subsets made only of odd numbers also contain no even number.`),
      intCand(2 ** od, `This is ${m(`2^{${od}}`)}, the number of subsets with **no** even number. It must be subtracted from ${P}.`),
      intCand(2 ** ev - 1, `This is ${m(`2^{${ev}} - 1`)}, the non-empty subsets of the even numbers alone. It forgets that any odd numbers can be added freely.`),
      intCand(P - 2 ** ev, `This subtracts ${m(`2^{${ev}}`)} (subsets of the **even** numbers) instead of ${m(`2^{${od}}`)} (subsets with no even number).`),
    ];
    keyIdea = '"At least one" usually means total minus none. Count all subsets as $2^{n}$, count the subsets using only the other items, then subtract.';
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
    asking,
    solution,
    conclusion,
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
    difficulty: 'exam',
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
