import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps } from '../../../lib/explanation';
import { factorial, nCr, nPr } from '../../../lib/mathx';
import { m } from '../../../lib/tex';

/** Integer as LaTeX with thin-space thousands separators for 5+ digits: 50400 -> "50\,400". */
function big(x: number): string {
  if (!Number.isInteger(x)) throw new Error(`big(): not an integer: ${x}`);
  const s = String(Math.abs(x));
  const body = s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return x < 0 ? `-${body}` : body;
}

/** A factorial written out: "4 \times 3 \times 2 \times 1". */
function factProd(k: number): string {
  return Array.from({ length: k }, (_, i) => k - i).join(' \\times ');
}

/** How to work out a combination by hand: "\binom{9}{3} = \frac{9 \times 8 \times 7}{3 \times 2 \times 1} = \frac{504}{6} = 84". */
function chooseWorking(n: number, r: number): string {
  const head = `\\binom{${n}}{${r}}`;
  if (r === 1) return `${head} = ${n}`;
  const top = Array.from({ length: r }, (_, i) => n - i).join(' \\times ');
  return `${head} = \\frac{${top}}{${factProd(r)}} = \\frac{${big(nPr(n, r))}}{${big(factorial(r))}} = ${big(nCr(n, r))}`;
}

/** What "choose" means, for a student meeting it for the first time. */
const CHOOSE_MEANS = `We count groups with ${m('\\binom{n}{r}')}, the number of ways to pick ${m('r')} items from ${m('n')}. To work it out, multiply ${m('r')} numbers counting down from ${m('n')}, then divide by ${m('r!')}, which is every whole number from ${m('r')} down to 1 multiplied together.`;

interface Cand {
  v: number;
  why: string;
}

/** Keep up to 3 candidates that are positive integers, differ from the answer and from each other. */
function pickDistractors(answer: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isInteger(c.v) || c.v <= 0 || c.v === answer) continue;
    if (out.some((o) => o.v === c.v)) continue;
    out.push(c);
  }
  if (out.length < 3) throw new Error(`only ${out.length} distractors for answer ${answer}`);
  return out;
}

/** Re-roll helper: try a builder until it produces enough distinct distractors. */
function retry<T>(rng: Rng, build: (rng: Rng) => T | null): T {
  for (let i = 0; i < 200; i++) {
    const r = build(rng);
    if (r) return r;
  }
  throw new Error('retry: no valid parameters found');
}

// ------------------------------------------------------------------ repeated letters

// Every word has either two or more repeated letters, or a letter repeated at least 3 times,
// so there are always enough distinct "forgot a repeat" mistakes.
const WORDS = [
  'BANANA', 'LETTER', 'PEPPER', 'COFFEE', 'BALLOON', 'SUCCESS', 'ADDRESS', 'LEVEL', 'MAMMAL',
  'CHEESE', 'GOOGLE', 'TOMATO', 'POTATO', 'CANNON', 'DIVIDED', 'ELEVEN',
  'ERROR', 'KAYAK', 'ARRANGE', 'SEESAW', 'COCOA', 'ASSESS', 'TATTOO',
  'DEEDED', 'ACCESS',
];

/** Letter counts in order of first appearance. */
function letterCounts(word: string): [string, number][] {
  const mp = new Map<string, number>();
  for (const ch of word) mp.set(ch, (mp.get(ch) ?? 0) + 1);
  return [...mp.entries()];
}

const arrangements = (counts: [string, number][]) => {
  const n = counts.reduce((a, [, k]) => a + k, 0);
  return counts.reduce((acc, [, k]) => acc / factorial(k), factorial(n));
};

/** "\frac{6!}{3!\,2!}" or "6!" when nothing repeats. */
function arrTex(counts: [string, number][]): string {
  const n = counts.reduce((a, [, k]) => a + k, 0);
  const reps = counts.filter(([, k]) => k > 1).sort((a, b) => b[1] - a[1]);
  if (!reps.length) return `${n}!`;
  return `\\frac{${n}!}{${reps.map(([, k]) => `${k}!`).join('\\,')}}`;
}

/** Full working: "\frac{6!}{3!\,2!} = \frac{720}{12} = 60". */
function arrWorking(counts: [string, number][]): string {
  const n = counts.reduce((a, [, k]) => a + k, 0);
  const reps = counts.filter(([, k]) => k > 1).sort((a, b) => b[1] - a[1]);
  const ans = arrangements(counts);
  if (!reps.length) return `${n}! = ${big(ans)}`;
  const den = reps.reduce((a, [, k]) => a * factorial(k), 1);
  const denParts = reps.map(([, k]) => String(factorial(k)));
  const denStep = denParts.length > 1 ? ` = \\frac{${big(factorial(n))}}{${denParts.join(' \\times ')}}` : '';
  return `${arrTex(counts)}${denStep} = \\frac{${big(factorial(n))}}{${big(den)}} = ${big(ans)}`;
}

/** Plain-English list: "A appears 3 times, N appears 2 times and B appears once". */
function describeCounts(counts: [string, number][]): string {
  const sorted = [...counts].sort((a, b) => b[1] - a[1]);
  const parts = sorted.map(([L, k]) => `${L} appears ${k === 1 ? 'once' : `${k} times`}`);
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** How identical letters swap among themselves: "the 3 A's in $3! = 6$ ways and the 2 N's in $2! = 2$ ways". */
function swapsText(reps: [string, number][]): string {
  const parts = reps.map(([L, k]) => `the ${k} ${L}'s in ${m(`${k}! = ${factorial(k)}`)} ways`);
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** How many times each different word gets counted if the identical letters are treated as different. */
const overCount = (reps: [string, number][]) => reps.reduce((a, [, k]) => a * factorial(k), 1);

const genRepeatedLetters: Generator = {
  id: 'gen-counting-repeated-letters',
  subtopic: 'counting',
  difficulty: 'exam',
  title: 'Arrangements of a word with repeated letters',
  generate(rng) {
    return retry(rng, (r) => {
      const word = r.pick(WORDS);
      const counts = letterCounts(word);
      const n = word.length;
      const reps = counts.filter(([, k]) => k > 1).sort((a, b) => b[1] - a[1]);
      const full = arrangements(counts);
      const restrict = r.bool(0.45);

      if (!restrict) {
        const answer = full;
        const pool: Cand[] = [
          { v: factorial(n), why: `This is ${m(`${n}!`)}, which treats the repeated letters as if they were all different. Swapping two identical letters gives the same arrangement, so you must divide by ${m('k!')} for each repeated letter.` },
        ];
        // forgot one of the repeated letters
        for (const [L, k] of reps) {
          pool.push({
            v: full * factorial(k),
            why: `This divides for the other repeated letters but forgets the ${k} ${L}'s: you also need to divide by ${m(`${k}!`)}.`,
          });
        }
        // divides by k instead of k!
        const byK = reps.reduce((acc, [, k]) => acc / k, factorial(n));
        pool.push({ v: byK, why: `This divides by the **number** of repeats (${reps.map(([, k]) => m(String(k))).join(', ')}) instead of by their **factorials** (${reps.map(([, k]) => m(`${k}!`)).join(', ')}).` });
        // adds the factorials in the denominator
        const sumF = reps.reduce((a, [, k]) => a + factorial(k), 0);
        if (reps.length > 1)
          pool.push({ v: factorial(n) / sumF, why: `This adds the factorials in the denominator (${m(reps.map(([, k]) => `${k}!`).join(' + '))}) instead of multiplying them.` });
        // only placed the most repeated letter
        const [L0, k0] = reps[0];
        pool.push({
          v: nCr(n, k0),
          why: `This is ${m(`\\binom{${n}}{${k0}}`)}: it chooses the places for the ${L0}'s but then forgets to arrange the other letters in the remaining places.`,
        });
        let ds: Cand[];
        try {
          ds = pickDistractors(answer, pool);
        } catch {
          return null;
        }
        return {
          stem: `How many different arrangements are there of all the letters of the word **${word}**?`,
          answer: m(big(answer)),
          answerValue: answer,
          distractors: ds.map((d) => ({ text: m(big(d.v)), value: d.v, why: d.why })),
          asking: `How many different-looking orders can the letters of ${word} go in?`,
          solution: steps(
            `Count each letter first. ${word} has ${n} letters: ${describeCounts(counts)}.`,
            `If all ${n} letters were different, there would be ${m(`${n}! = ${factProd(n)} = ${big(factorial(n))}`)} orders. The **!** (factorial) means multiply every whole number down to 1.`,
            `But swapping identical letters gives the same word, so that count is too big. Identical letters can swap among themselves: ${swapsText(reps)}.`,
            `So each different word was counted ${overCount(reps)} times. Divide to count each word once:\n\n$$${arrWorking(counts)}$$`,
          ),
          conclusion: `Dividing out the repeats gives ${m(arrTex(counts))}, so the answer is ${m(big(answer))}.`,
          keyIdea: 'For arrangements with repeated letters, use $\\frac{n!}{a! \\times b! \\times \\dots}$. Here $n$ is the total number of letters, and $a, b, \\dots$ are how many times each repeated letter appears.',
        };
      }

      // restricted: must begin with a chosen letter
      const [X, kX] = r.pick(counts);
      const an = 'AEFHILMNORSX'.includes(X) ? 'an' : 'a';
      const rest: [string, number][] = counts.map(([L, k]) => [L, L === X ? k - 1 : k] as [string, number]).filter(([, k]) => k > 0);
      const answer = arrangements(rest);
      const restReps = rest.filter(([, k]) => k > 1);
      const pool: Cand[] = [
        { v: full, why: `This is the number of arrangements of all of ${word} with no condition. It ignores the rule that the word must begin with ${X}.` },
      ];
      // forgot to reduce X's count after fixing it
      const notReduced = counts.reduce((acc, [, k]) => acc / factorial(k), factorial(n - 1));
      pool.push({
        v: notReduced,
        why: `This fixes ${an} ${X} in front but still divides by ${m(`${kX}!`)} for the ${X}'s, as if ${kX === 2 ? 'both' : `all ${kX}`} were still in the remaining letters. Only ${kX - 1} ${X}${kX - 1 === 1 ? ' is' : "'s are"} left to arrange.`,
      });
      pool.push({ v: factorial(n - 1), why: `This is ${m(`${n - 1}!`)}: it arranges the remaining ${n - 1} letters as if they were all different, forgetting to divide for the repeated letters.` });
      for (const [L, k] of restReps)
        pool.push({ v: answer * factorial(k), why: `This arranges the remaining ${n - 1} letters but forgets to divide by ${m(`${k}!`)} for the ${k} ${L}'s still among them.` });
      pool.push({ v: full / n, why: `This divides the total by ${n}, as if each letter were equally likely to come first. But ${X} appears ${kX === 1 ? 'only once' : `${kX} times`}, so the share starting with ${X} is ${m(`\\frac{${kX}}{${n}}`)}, not ${m(`\\frac{1}{${n}}`)}.` });
      let ds: Cand[];
      try {
        ds = pickDistractors(answer, pool);
      } catch {
        return null;
      }
      return {
        stem: `How many different arrangements of all the letters of the word **${word}** begin with the letter ${X}?`,
        answer: m(big(answer)),
        answerValue: answer,
        distractors: ds.map((d) => ({ text: m(big(d.v)), value: d.v, why: d.why })),
        asking: `How many different-looking orders of the letters of ${word} start with ${X}?`,
        solution: steps(
          `Count each letter first. ${word} has ${n} letters: ${describeCounts(counts)}.`,
          `Put ${kX === 1 ? 'the' : an} ${X} in the first place. ${kX === 1 ? 'There is only one, so there is only one way to do this.' : `The ${X}'s are identical, so it makes no difference which one goes first.`}`,
          `That leaves ${n - 1} letters to fill the other places: ${describeCounts(rest)}.`,
          restReps.length
            ? `If those letters were all different, there would be ${m(`${n - 1}! = ${factProd(n - 1)} = ${big(factorial(n - 1))}`)} orders. The **!** (factorial) means multiply every whole number down to 1.`
            : `Those letters are all different, so count their orders with a factorial. The **!** means multiply every whole number down to 1:\n\n$$${n - 1}! = ${factProd(n - 1)} = ${big(answer)}$$`,
          restReps.length > 0 && `But swapping identical letters gives the same word, so that count is too big. Identical letters can swap among themselves: ${swapsText(restReps)}.`,
          restReps.length > 0 && `So each different order was counted ${overCount(restReps)} times. Divide to count each one once:\n\n$$${arrWorking(rest)}$$`,
        ),
        conclusion: `With ${X} fixed in front, only the other ${n - 1} letters can move, so the answer is ${m(big(answer))}.`,
        keyIdea: 'When a place is fixed, put that letter there first. Then arrange the remaining letters with $\\frac{n!}{a! \\times b! \\times \\dots}$, dividing only for letters that are still repeated.',
      };
    });
  },
};

// ------------------------------------------------------------------ committees

const GROUPS: { a: string; aOne: string; b: string; bOne: string }[] = [
  { a: 'men', aOne: 'man', b: 'women', bOne: 'woman' },
  { a: 'boys', aOne: 'boy', b: 'girls', bOne: 'girl' },
  { a: 'teachers', aOne: 'teacher', b: 'students', bOne: 'student' },
  { a: 'juniors', aOne: 'junior', b: 'seniors', bOne: 'senior' },
  { a: 'chemists', aOne: 'chemist', b: 'biologists', bOne: 'biologist' },
  { a: 'engineers', aOne: 'engineer', b: 'designers', bOne: 'designer' },
];

const C = (n: number, r: number) => `\\binom{${n}}{${r}}`;

const genCommittee: Generator = {
  id: 'gen-counting-committee',
  subtopic: 'counting',
  difficulty: 'exam',
  title: 'Choosing a committee with a condition',
  generate(rng) {
    return retry(rng, (r) => {
      const g = r.pick(GROUPS);
      const a = r.int(4, 8);
      const b = r.int(3, 7);
      const size = r.int(3, 5);
      const n = a + b;
      const kind = r.pick(['exactly', 'atleast'] as const);

      if (kind === 'exactly') {
        const k = r.int(1, Math.min(b, size - 1));
        const rest = size - k;
        if (rest >= a || k >= b) return null; // avoid trivial "choose all of them" parts
        const cb = nCr(b, k);
        const ca = nCr(a, rest);
        const answer = cb * ca;
        const pool: Cand[] = [
          { v: cb + ca, why: `This adds the two parts (${m(`${cb} + ${ca}`)}). The committee needs ${k} ${k === 1 ? g.bOne : g.b} **and** ${rest} ${rest === 1 ? g.aOne : g.a}, so multiply.` },
          { v: nCr(n, size), why: `This is ${m(C(n, size))}, every committee of ${size} with no condition. Many of these do not have exactly ${k} ${k === 1 ? g.bOne : g.b}.` },
          { v: nPr(b, k) * nPr(a, rest), why: `This uses permutations (${m(`{}^{${b}}P_{${k}} \\times {}^{${a}}P_{${rest}}`)}), which counts the members in order. A committee is just a group, so order does not matter.` },
          { v: cb * nCr(n - k, rest), why: `This picks the ${k} ${k === 1 ? g.bOne : g.b} and then fills the other ${rest} places from **everyone** left, so the committee could end up with more than ${k} ${g.b}. The other places must come from the ${a} ${g.a} only.` },
          { v: answer * factorial(size), why: `This multiplies by ${m(`${size}!`)} as if the committee members were arranged in order. A committee has no order.` },
        ];
        let ds: Cand[];
        try {
          ds = pickDistractors(answer, pool);
        } catch {
          return null;
        }
        return {
          stem: `A committee of ${size} people is to be chosen from ${a} ${g.a} and ${b} ${g.b}. In how many ways can this be done if the committee must contain **exactly ${k}** ${k === 1 ? g.bOne : g.b}?`,
          answer: m(big(answer)),
          answerValue: answer,
          distractors: ds.map((d) => ({ text: m(big(d.v)), value: d.v, why: d.why })),
          asking: `How many committees of ${size} have exactly ${k} ${k === 1 ? g.bOne : g.b}, and so ${rest} ${rest === 1 ? g.aOne : g.a}?`,
          solution: steps(
            `Exactly ${k} ${k === 1 ? g.bOne : g.b} in a committee of ${size} means the other ${rest} must be ${rest === 1 ? g.aOne : g.a}. So make two separate choices: ${k} ${k === 1 ? g.bOne : g.b} **and** ${rest} ${rest === 1 ? g.aOne : g.a}.`,
            `A committee is just a group, so order does not matter. ${CHOOSE_MEANS}`,
            `Choose ${k} of the ${b} ${g.b}: ${m(chooseWorking(b, k))}.`,
            `Choose ${rest} of the ${a} ${g.a}: ${m(chooseWorking(a, rest))}.`,
            `Any choice of ${g.b} can go with any choice of ${g.a}, so multiply: ${m(`${cb} \\times ${ca} = ${big(answer)}`)}.`,
          ),
          conclusion: `${cb} ways to choose the ${k === 1 ? g.bOne : g.b} times ${ca} ways to choose the ${rest === 1 ? g.aOne : g.a} gives the answer, ${m(big(answer))}.`,
          keyIdea: 'For "exactly $k$ from one group", work out how many come from each group. Choose from each group separately with $\\binom{n}{r}$, then multiply the results.',
        };
      }

      // at least one from group b
      if (size > a) return null; // keep the "none" case non-trivial
      const total = nCr(n, size);
      const none = nCr(a, size);
      const answer = total - none;
      const pool: Cand[] = [
        { v: b * nCr(n - 1, size - 1), why: `This is "pick one ${g.bOne}, then any ${size - 1} others": ${m(`${b} \\times ${C(n - 1, size - 1)}`)}. It double counts every committee with two or more ${g.b}, once for each ${g.bOne} who could have been "picked first".` },
        { v: total, why: `This is ${m(C(n, size))}, every possible committee. It forgets to remove the committees with no ${g.b}.` },
        { v: none, why: `This is ${m(C(a, size))}, the number of committees with **no** ${g.b}: the complement, not the answer.` },
        { v: b * nCr(a, size - 1), why: `This is ${m(`${b} \\times ${C(a, size - 1)}`)}, which counts only committees with **exactly one** ${g.bOne}. "At least one" also includes two or more.` },
        { v: total - nCr(b, size), why: `This subtracts the committees made only of ${g.b}, which is the wrong group. You need to remove the committees with **no** ${g.b}.` },
      ];
      let ds: Cand[];
      try {
        ds = pickDistractors(answer, pool);
      } catch {
        return null;
      }
      return {
        stem: `A committee of ${size} people is to be chosen from ${a} ${g.a} and ${b} ${g.b}. In how many ways can this be done if the committee must contain **at least one** ${g.bOne}?`,
        answer: m(big(answer)),
        answerValue: answer,
        distractors: ds.map((d) => ({ text: m(big(d.v)), value: d.v, why: d.why })),
        asking: `How many committees of ${size} include one or more ${g.b}?`,
        solution: steps(
          `"At least one ${g.bOne}" covers several cases: one, two or more ${g.b}. The opposite is just one case: no ${g.b} at all. So at least one $=$ all committees $-$ committees with no ${g.b}.`,
          `A committee is just a group, so order does not matter. ${CHOOSE_MEANS}`,
          `All committees: pick ${size} from all ${n} people. ${m(chooseWorking(n, size))}.`,
          `Committees with no ${g.b}: all ${size} must come from the ${a} ${g.a}. ${m(chooseWorking(a, size))}.`,
          `Subtract: ${m(`${big(total)} - ${big(none)} = ${big(answer)}`)}.`,
        ),
        conclusion: `Taking the ${m(big(none))} committees with no ${g.b} from all ${m(big(total))} leaves the answer, ${m(big(answer))}.`,
        keyIdea: '"At least one" almost always means total minus "none". Count all the groups, count the groups with none of what you want, and subtract. Picking one first and then any others double counts.',
      };
    });
  },
};

// ------------------------------------------------------------------ together / apart in a row

const WORD_NUM: Record<number, string> = { 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight' };
const NAMES = ['Ali', 'Bea', 'Chen', 'Dana', 'Eli', 'Farah', 'Omar', 'Sara', 'Yusuf', 'Mia', 'Noor', 'Zaid'];

function listNames(xs: string[]): string {
  return xs.length === 2 ? `${xs[0]} and ${xs[1]}` : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
}

const genRow: Generator = {
  id: 'gen-counting-row-together-apart',
  subtopic: 'counting',
  difficulty: 'exam',
  title: 'People in a row: must sit together or apart',
  generate(rng) {
    return retry(rng, (r) => {
      const n = r.int(5, 8);
      const kind = r.pick(['together2', 'together3', 'apart'] as const);
      const s = kind === 'together3' ? 3 : 2;
      const who = r.sample(NAMES, s);
      const people = r.pick(['friends', 'students', 'cousins', 'players']);
      const named = listNames(who);
      const units = n - s + 1;
      const together = factorial(units) * factorial(s);
      const all = factorial(n);

      if (kind !== 'apart') {
        const answer = together;
        const pool: Cand[] = [
          { v: factorial(units), why: `This is ${m(`${units}!`)}: it glues ${named} into one block but forgets they can be arranged in ${m(`${s}! = ${factorial(s)}`)} ways inside the block.` },
          { v: all, why: `This is ${m(`${n}!`)}, every arrangement with no restriction.` },
          { v: all - together, why: `This is ${m(`${n}! - ${units}! \\times ${s}!`)}, the number of arrangements where ${named} are **not** ${s === 2 ? 'next to each other' : 'all together'}.` },
          { v: factorial(n - s) * factorial(s), why: `This is ${m(`${n - s}! \\times ${s}!`)}: it removes the ${s} people but forgets to count their block as one of the things being arranged, so there should be ${units} things, not ${n - s}.` },
          { v: factorial(units) + factorial(s), why: `This adds ${m(`${units}!`)} and ${m(`${s}!`)}. Arranging the blocks **and** arranging inside the block are two stages, so multiply.` },
        ];
        let ds: Cand[];
        try {
          ds = pickDistractors(answer, pool);
        } catch {
          return null;
        }
        return {
          stem: `${WORD_NUM[n]} ${people}, including ${named}, sit in a row of ${n} seats. In how many ways can they sit if ${named} must ${s === 2 ? 'sit next to each other' : 'all sit together'}?`,
          answer: m(big(answer)),
          answerValue: answer,
          distractors: ds.map((d) => ({ text: m(big(d.v)), value: d.v, why: d.why })),
          asking: `How many seatings keep ${named} ${s === 2 ? 'next to each other' : 'all together'}?`,
          solution: steps(
            `Treat ${named} as one **block** glued together. Wherever the block goes, they stay together.`,
            `Count the things to arrange: the block plus the other ${n - s} ${people}, which makes ${units} things.`,
            `${units} things can go in a row in ${m(`${units}! = ${factProd(units)} = ${big(factorial(units))}`)} orders. The **!** (factorial) means multiply every whole number down to 1.`,
            `Inside the block, ${named} can sit in ${m(`${s}! = ${factProd(s)} = ${factorial(s)}`)} different orders.`,
            `Each of the ${m(big(factorial(units)))} orders can use any order inside the block, so multiply: ${m(`${big(factorial(units))} \\times ${factorial(s)} = ${big(answer)}`)}.`,
          ),
          conclusion: `${units} things in a row times ${factorial(s)} orders inside the block gives the answer, ${m(big(answer))}.`,
          keyIdea: 'For "must be together", glue the group into one block, arrange the block with everyone else, then multiply by the ways to order the people inside the block.',
        };
      }

      const answer = all - together;
      const pool: Cand[] = [
        { v: together, why: `This is ${m(`${n - 1}! \\times 2!`)}, the number of ways in which ${named} **are** next to each other. It still has to be subtracted from the total.` },
        { v: all, why: `This is ${m(`${n}!`)}, every arrangement. It ignores the condition.` },
        { v: all - factorial(n - 1), why: `This is ${m(`${n}! - ${n - 1}!`)}: it subtracts the "together" cases but forgets that ${named} can swap places inside their block (a factor of ${m('2!')}).` },
        { v: answer / 2, why: `This is half the answer. It comes from the "gaps" method (arrange the other ${n - 2} ${people}, then put ${named} into 2 of the ${n - 1} gaps) but uses ${m(`\\binom{${n - 1}}{2}`)} for the gaps, forgetting that ${named} can be placed in either order.` },
        { v: all / 2, why: `This assumes exactly half of all arrangements have ${named} apart. In fact they are together in ${m(`\\frac{2}{${n}}`)} of all arrangements (not half), so halving ${m(`${n}!`)} does not work.` },
      ];
      let ds: Cand[];
      try {
        ds = pickDistractors(answer, pool);
      } catch {
        return null;
      }
      return {
        stem: `${WORD_NUM[n]} ${people}, including ${named}, stand in a line. In how many ways can they stand if ${named} must **not** stand next to each other?`,
        answer: m(big(answer)),
        answerValue: answer,
        distractors: ds.map((d) => ({ text: m(big(d.v)), value: d.v, why: d.why })),
        asking: `How many line-ups keep ${named} apart?`,
        solution: steps(
          `Counting "apart" directly is awkward, so count the opposite. Every line-up has them either together or apart, so apart $=$ all $-$ together.`,
          `All line-ups with no rule: ${m(`${n}! = ${factProd(n)} = ${big(all)}`)}. The **!** (factorial) means multiply every whole number down to 1.`,
          `For together, glue ${named} into one block. That leaves ${n - 1} things to arrange: ${m(`${n - 1}! = ${big(factorial(n - 1))}`)} orders.`,
          `Inside the block they can stand 2 ways: ${who[0]} then ${who[1]}, or ${who[1]} then ${who[0]}. So together $=$ ${m(`${big(factorial(n - 1))} \\times 2 = ${big(together)}`)}.`,
          `Subtract: ${m(`${big(all)} - ${big(together)} = ${big(answer)}`)}.`,
        ),
        conclusion: `Taking the ${m(big(together))} together line-ups away from all ${m(big(all))} leaves the answer, ${m(big(answer))}.`,
        keyIdea: 'For "must not be together", use total arrangements minus arrangements where they are together. Count the together cases by gluing them into one block, then multiply by the orders inside the block.',
      };
    });
  },
};

export const generators: Generator[] = [genRepeatedLetters, genCommittee, genRow];
