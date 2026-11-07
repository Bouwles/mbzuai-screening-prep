import type { Generator } from '../../../types';
import { steps, table } from '../../../lib/explanation';
import { Frac } from '../../../lib/frac';
import { m, num } from '../../../lib/tex';

type Cand = { f: Frac; why: string };

/** Keep up to 3 candidates that are valid probabilities, differ from the answer and from each other. */
function pickDistractors(answer: Frac, pool: Cand[], allowZero = false): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    const v = c.f.value();
    if (v >= 1 || v < 0 || (!allowZero && v === 0)) continue;
    if (c.f.equals(answer) || out.some((o) => o.f.equals(c.f))) continue;
    out.push(c);
  }
  return out;
}

/** Decimal text of an exact fraction whose denominator is a power of 10. */
const dec = (f: Frac) => num(f.value(), 6);

// ------------------------------------------------------------------ 1. "at least one"
const AT_LEAST_CONTEXTS = [
  { intro: 'An archer hits the target', trials: 'She shoots', unit: 'arrows', hit: 'hit', miss: 'miss' },
  { intro: 'A basketball player scores a free throw', trials: 'He takes', unit: 'free throws', hit: 'successful free throw', miss: 'missed free throw' },
  { intro: 'A seed of a certain plant germinates', trials: 'A gardener plants', unit: 'seeds', hit: 'seed that germinates', miss: 'seed that fails to germinate' },
  { intro: 'A machine part passes a quality test', trials: 'An inspector tests', unit: 'parts', hit: 'part that passes', miss: 'part that fails' },
] as const;

// ------------------------------------------------------------------ 2. Venn / addition rule
const VENN_CONTEXTS = [
  { a: 'plays football', b: 'plays basketball', bBase: 'play basketball', who: 'student' },
  { a: 'owns a laptop', b: 'owns a tablet', bBase: 'own a tablet', who: 'student' },
  { a: 'studies Physics', b: 'studies Chemistry', bBase: 'study Chemistry', who: 'student' },
  { a: 'reads news online', b: 'watches TV news', bBase: 'watch TV news', who: 'adult' },
  { a: 'drinks coffee', b: 'drinks tea', bBase: 'drink tea', who: 'office worker' },
] as const;

// ------------------------------------------------------------------ 3. two dice sums
type DiceKind = 'eq' | 'ge' | 'gt' | 'le' | 'lt';
const DIE = [1, 2, 3, 4, 5, 6];
const pairs = DIE.flatMap((a) => DIE.map((b) => [a, b] as const));
const unordered = pairs.filter(([a, b]) => a <= b);
const test = (kind: DiceKind, s: number) => (t: number) =>
  kind === 'eq' ? t === s : kind === 'ge' ? t >= s : kind === 'gt' ? t > s : kind === 'le' ? t <= s : t < s;
const KIND_WORDS: Record<DiceKind, string> = {
  eq: 'exactly',
  ge: 'at least',
  gt: 'greater than',
  le: 'at most',
  lt: 'less than',
};
const BOUNDARY_SWAP: Partial<Record<DiceKind, DiceKind>> = { ge: 'gt', gt: 'ge', le: 'lt', lt: 'le' };

export const generators: Generator[] = [
  {
    id: 'gen-probability-basics-at-least-one',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    title: '"At least one" with repeated independent attempts',
    generate(rng) {
      for (;;) {
        const ctx = rng.pick(AT_LEAST_CONTEXTS);
        const p10 = rng.int(1, 9); // p = p10 / 10
        const n = rng.int(2, 4);
        const askMiss = rng.bool(0.35);
        const p = new Frac(p10, 10);
        const s = askMiss ? new Frac(10 - p10, 10) : p; // probability of the event asked about, per attempt
        const q = new Frac(1).sub(s); // probability it does NOT happen in one attempt
        const pow = (f: Frac, k: number) => {
          let r = new Frac(1);
          for (let i = 0; i < k; i++) r = r.mul(f);
          return r;
        };
        const none = pow(q, n);
        const answer = new Frac(1).sub(none);
        const event = askMiss ? ctx.miss : ctx.hit;
        const pool: Cand[] = [
          {
            f: none,
            why: `This is the probability of **no** ${event} in any of the ${n} attempts, ${m(`${dec(q)}^{${n}}`)}. The last step, subtracting it from $1$, was forgotten.`,
          },
          {
            f: pow(s, n),
            why: `This is ${m(`${dec(s)}^{${n}}`)}, the probability that **every** attempt gives a ${event}, not at least one.`,
          },
          {
            f: s.mul(n),
            why: `This adds ${m(dec(s))} once for each of the ${n} attempts. Adding double counts the outcomes with more than one ${event}; use $1 - P(\\text{none})$ instead.`,
          },
          {
            f: s.mul(n).mul(pow(q, n - 1)),
            why: `This is the probability of **exactly one** ${event}, ${m(`${n} \\times ${dec(s)} \\times ${dec(q)}${n - 1 === 1 ? '' : `^{${n - 1}}`}`)}. "At least one" also includes two or more.`,
          },
          ...(askMiss
            ? [
                {
                  f: new Frac(1).sub(pow(new Frac(10 - p10, 10), n)),
                  why: `This is $1 - ${dec(new Frac(10 - p10, 10))}^{${n}}$, which uses the miss probability where the success probability belongs: it is the chance of at least one success, not at least one ${event}.`,
                },
              ]
            : []),
          {
            f: s,
            why: `This is the probability for a **single** attempt only; the question is about ${n} attempts.`,
          },
        ];
        const ds = pickDistractors(answer, pool);
        if (ds.length < 3) continue; // re-roll parameters (only happens for a few symmetric cases)
        const ansText = m(dec(answer));
        const noneProduct = Array.from({ length: n }, () => dec(q)).join(' \\times ');
        return {
          stem:
            `${ctx.intro} with probability ${m(dec(p))}, independently each time. ${ctx.trials} ${n} ${ctx.unit}. ` +
            `What is the probability of **at least one** ${event}?`,
          answer: ansText,
          answerValue: answer.value(),
          distractors: ds.map((d) => ({ text: m(dec(d.f)), value: d.f.value(), why: d.why })),
          asking: `What is the chance of at least one ${event} from the ${n} ${ctx.unit}?`,
          solution: steps(
            askMiss && `The question gives the chance of a ${ctx.hit}, but asks about a ${ctx.miss}. On one attempt, that chance is ${m(`1 - ${dec(p)} = ${dec(s)}`)}.`,
            `"At least one ${event}" covers many cases. The opposite is just one case: none at all. The two chances add up to 1, so ${m('P(\\text{at least one}) = 1 - P(\\text{none})')}.`,
            `On one attempt, the chance of it not happening is ${m(`1 - ${dec(s)} = ${dec(q)}`)}.`,
            `**Independently** means one attempt doesn't affect the next, so multiply one chance per attempt: ${m(`P(\\text{none}) = ${noneProduct} = ${dec(none)}`)}.`,
            `Subtract from 1: ${m(`1 - ${dec(none)} = ${dec(answer)}`)}.`,
          ),
          conclusion: `Getting none at all has chance ${m(dec(none))}, and everything else has at least one, so the answer is ${ansText}.`,
          keyIdea: 'When you see "at least one", work out the chance of none and subtract from 1. For independent tries, $P(\\text{none})$ is the one-try "no" chance multiplied once per try.',
        };
      }
    },
  },
  {
    id: 'gen-probability-basics-venn',
    subtopic: 'probability-basics',
    difficulty: 'exam',
    title: 'Addition rule and Venn diagram regions',
    generate(rng) {
      for (;;) {
        // work in hundredths, multiples of 5
        const a = 5 * rng.int(4, 13); // 0.20 .. 0.65
        const b = 5 * rng.int(3, 12); // 0.15 .. 0.60
        const c = 5 * rng.int(1, 6); // 0.05 .. 0.30
        if (c >= Math.min(a, b) || a + b - c > 95 || a === b) continue;
        const ctx = rng.pick(VENN_CONTEXTS);
        const ask = rng.pick(['union', 'neither', 'aOnly', 'exactlyOne'] as const);
        const H = (x: number) => new Frac(x, 100);
        const U = a + b - c;
        const values = { union: U, neither: 100 - U, aOnly: a - c, exactlyOne: a + b - 2 * c };
        const answer = H(values[ask]);
        const ansText = m(dec(answer));
        let question = '';
        let asking = '';
        let working: string[] = [];
        let conclusion = '';
        let pool: Cand[] = [];
        if (ask === 'union') {
          question = `${ctx.a} **or** ${ctx.b} (or both)`;
          asking = `What is the chance that the ${ctx.who} is in $A$ or $B$ or both?`;
          working = [
            `${m('P(A \\cup B)')} means $A$ or $B$ or both. If we add ${m('P(A) + P(B)')}, the overlap gets counted twice, so we subtract it once:\n\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$`,
            `Substitute the numbers: ${m(`P(A \\cup B) = ${dec(H(a))} + ${dec(H(b))} - ${dec(H(c))}`)}.`,
            `Work it out from left to right: ${m(`${dec(H(a))} + ${dec(H(b))} = ${dec(H(a + b))}`)}, then ${m(`${dec(H(a + b))} - ${dec(H(c))} = ${dec(H(U))}`)}.`,
          ];
          conclusion = `Adding the two circles and removing the overlap once gives the answer, ${ansText}.`;
          pool = [
            { f: H(a + b), why: `This is ${m(`${dec(H(a))} + ${dec(H(b))}`)}: the overlap was not subtracted, so people who do both are counted twice.` },
            { f: H(a + b - 2 * c), why: `This subtracts the overlap twice, which gives the probability of **exactly one** of the two, not "or both".` },
            { f: H(100 - U), why: `This is ${m(`1 - ${dec(H(U))}`)}, the probability of **neither**, the complement of what was asked.` },
            { f: H(c), why: 'This is the overlap $P(A \\cap B)$, the probability of **both**, not of either.' },
          ];
        } else if (ask === 'neither') {
          question = `**neither** ${ctx.a} nor ${ctx.b}`;
          asking = `What is the chance that the ${ctx.who} is in neither $A$ nor $B$?`;
          working = [
            `First find the chance of being in at least one circle, written ${m('P(A \\cup B)')}. Adding the circles counts the overlap twice, so subtract it once: ${m(`P(A \\cup B) = ${dec(H(a))} + ${dec(H(b))} - ${dec(H(c))} = ${dec(H(U))}`)}.`,
            `"Neither" is everything outside both circles. All the chances add up to 1, so ${m(`P(\\text{neither}) = 1 - ${dec(H(U))} = ${dec(answer)}`)}.`,
          ];
          conclusion = `The two circles cover ${m(dec(H(U)))}, and what is left outside them is the answer, ${ansText}.`;
          pool = [
            { f: H(U), why: `This is ${m(`P(A \\cup B) = ${dec(H(U))}`)}: the final step, subtracting from $1$, was forgotten.` },
            { f: H(100 - a - b), why: `This is ${m(`1 - (${dec(H(a))} + ${dec(H(b))})`)}: the overlap was not subtracted, so the people who do both were removed twice.` },
            { f: H(100 - (a + b - 2 * c)), why: `This subtracts the overlap twice when finding $P(A \\cup B)$, so the "both" region is wrongly counted as neither.` },
            { f: H(c), why: 'This is $P(A \\cap B)$, the probability of **both**: the wrong region of the Venn diagram.' },
          ];
        } else if (ask === 'aOnly') {
          question = `${ctx.a} but does **not** ${ctx.bBase}`;
          asking = `What is the chance that the ${ctx.who} is in $A$ but not in $B$?`;
          working = [
            `Circle $A$ is made of two parts: the overlap, and the part outside $B$. We want the part outside $B$, so take the overlap away from $A$.`,
            `Writing $B'$ for "not $B$", that is ${m(`P(A \\cap B') = P(A) - P(A \\cap B) = ${dec(H(a))} - ${dec(H(c))} = ${dec(answer)}`)}.`,
          ];
          conclusion = `Removing the overlap from circle $A$ leaves the answer, ${ansText}.`;
          pool = [
            { f: H(a), why: `This is ${m(`P(A)`)} itself, which still includes the ${ctx.who}s who also ${ctx.bBase}.` },
            { f: H(c), why: 'This is the overlap $P(A \\cap B)$, where **both** happen, not $A$ without $B$.' },
            { f: H(b - c), why: `This is ${m(`P(B) - P(A \\cap B)`)}, the region for $B$ only: the two events were swapped.` },
            { f: H(a + b - 2 * c), why: 'This is the probability of **exactly one** of the events; it also includes the "$B$ only" region.' },
          ];
        } else {
          question = `does **exactly one** of these two things`;
          asking = `What is the chance that the ${ctx.who} is in just one of $A$ and $B$?`;
          working = [
            `"Exactly one" means in $A$ only or in $B$ only, and not in the overlap. Take the overlap out of each circle:\n\n` +
              `- $A$ only: ${m(`${dec(H(a))} - ${dec(H(c))} = ${dec(H(a - c))}`)}\n` +
              `- $B$ only: ${m(`${dec(H(b))} - ${dec(H(c))} = ${dec(H(b - c))}`)}`,
            `Add the two parts: ${m(`${dec(H(a - c))} + ${dec(H(b - c))} = ${dec(answer)}`)}.`,
          ];
          conclusion = `The two "only" parts of the circles add up to the answer, ${ansText}.`;
          pool = [
            { f: H(U), why: `This is ${m(`P(A \\cup B) = ${dec(H(U))}`)}, which still includes the "both" region. Exactly one must leave it out.` },
            { f: H(a + b), why: `This is ${m(`${dec(H(a))} + ${dec(H(b))}`)}: it counts the "both" region twice instead of removing it.` },
            { f: H(100 - U), why: 'This is the probability of **neither** event, the region outside both circles.' },
            { f: H(a - c), why: 'This is only the "$A$ only" region; the "$B$ only" region must be added too.' },
          ];
        }
        const ds = pickDistractors(answer, pool);
        if (ds.length < 3) continue;
        return {
          stem:
            `For a random ${ctx.who}, $A$ is "${ctx.a}" and $B$ is "${ctx.b}", with ` +
            `${m(`P(A) = ${dec(H(a))}`)}, ${m(`P(B) = ${dec(H(b))}`)} and ${m(`P(A \\cap B) = ${dec(H(c))}`)}. ` +
            `What is the probability that the ${ctx.who} ${question}?`,
          answer: ansText,
          answerValue: answer.value(),
          distractors: ds.map((d) => ({ text: m(dec(d.f)), value: d.f.value(), why: d.why })),
          asking,
          solution: steps(
            `Picture two overlapping circles, $A$ and $B$. The overlap, written ${m('P(A \\cap B)')}, is the chance of both. Here it is ${m(dec(H(c)))}.`,
            ...working,
          ),
          conclusion,
          keyIdea: 'Draw two overlapping circles and fill in the overlap first. Then $A$ only $= P(A) - P(A \\cap B)$, $B$ only $= P(B) - P(A \\cap B)$, and neither is whatever is left of 1.',
        };
      }
    },
  },
  {
    id: 'gen-probability-basics-two-dice',
    subtopic: 'probability-basics',
    difficulty: 'foundation',
    title: 'Probability of a total when rolling two dice',
    generate(rng) {
      for (;;) {
        const kind = rng.pick(['eq', 'ge', 'gt', 'le', 'lt'] as const);
        const s = kind === 'eq' ? rng.int(3, 11) : rng.int(4, 10);
        const wording = rng.pick(['Two fair six-sided dice are rolled', 'A fair six-sided die is rolled twice'] as const);
        const ok = test(kind, s);
        const count = pairs.filter(([x, y]) => ok(x + y)).length;
        const answer = new Frac(count, 36);
        const totals = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(ok).length;
        const uCount = unordered.filter(([x, y]) => ok(x + y)).length;
        const ex = pairs.find(([x, y]) => x < y && ok(x + y)) ?? [1, 2];
        const pool: Cand[] = [];
        if (kind === 'eq') {
          pool.push(
            { f: new Frac(uCount, 36), why: `This counts each pair of numbers once (for example treats $(${ex[0]},${ex[1]})$ and $(${ex[1]},${ex[0]})$ as the same outcome). The two dice are different, so order matters: there are ${count} ordered pairs.` },
            { f: new Frac(1, 11), why: 'This treats the 11 possible totals $2$ to $12$ as equally likely. They are not: middle totals can be made in more ways.' },
            { f: new Frac(uCount, 21), why: 'This uses the 21 unordered pairs as the sample space, but those are not equally likely (a double like $(3,3)$ happens one way, $(2,5)$ two ways).' },
          );
          if (s % 2 === 0) pool.push({ f: new Frac(count - 1, 36), why: `This misses the double $(${s / 2},${s / 2})$ when listing the pairs.` });
        } else {
          const swap = BOUNDARY_SWAP[kind]!;
          const swapCount = pairs.filter(([x, y]) => test(swap, s)(x + y)).length;
          pool.push(
            {
              f: new Frac(swapCount, 36),
              why:
                kind === 'ge' || kind === 'le'
                  ? `This leaves out the totals equal to ${s}; "${KIND_WORDS[kind]} ${s}" includes ${s} itself.`
                  : `This includes the totals equal to ${s}; "${KIND_WORDS[kind]} ${s}" does not include ${s} itself.`,
            },
            { f: new Frac(36 - count, 36), why: 'This is the probability of the **opposite** event (the complement), not the event asked for.' },
            { f: new Frac(totals, 11), why: `This counts the ${totals} allowed totals out of 11 possible totals, as if every total were equally likely. They are not: there are 36 equally likely ordered pairs.` },
            { f: new Frac(uCount, 21), why: 'This uses the 21 unordered pairs as the sample space, but those are not equally likely (a double happens one way, other pairs two ways).' },
          );
        }
        const ds = pickDistractors(answer, pool);
        if (ds.length < 3 || count === 0 || count === 36) continue;
        const ansText = m(answer.tex());
        const raw = `\\frac{${count}}{36}`;
        const seconds = DIE.map((first) => DIE.filter((y) => ok(first + y)));
        const rowCounts = seconds.map((ys) => ys.length).filter((c) => c > 0);
        const meaning =
          kind === 'eq'
            ? `The sum must be exactly ${s}.`
            : kind === 'ge'
              ? `"At least ${s}" means ${s} or more, so ${s} itself counts.`
              : kind === 'gt'
                ? `"Greater than ${s}" means more than ${s}, so ${s} itself does not count.`
                : kind === 'le'
                  ? `"At most ${s}" means ${s} or less, so ${s} itself counts.`
                  : `"Less than ${s}" means below ${s}, so ${s} itself does not count.`;
        return {
          stem: `${wording}. What is the probability that the **sum** of the two scores is ${KIND_WORDS[kind]} $${s}$?`,
          answer: ansText,
          answerValue: answer.value(),
          distractors: ds.map((d) => ({ text: m(d.f.tex()), value: d.f.value(), why: d.why })),
          asking: `How likely is it that the two scores have a total that is ${KIND_WORDS[kind]} ${s}?`,
          solution: steps(
            `Think of a first score and a second score. Each has 6 possible values, so there are $6 \\times 6 = 36$ equally likely ordered pairs. For example, $(2,5)$ and $(5,2)$ are different results.`,
            `${meaning} Go through each first score and write which second scores work:\n\n` +
              table(
                ['First score', 'Second score can be', 'Pairs that work'],
                DIE.map((first, i) => [first, seconds[i].length ? seconds[i].join(', ') : 'none', seconds[i].length]),
              ),
            `Add the last column: ${m(`${rowCounts.join(' + ')} = ${count}`)}. So ${count} of the 36 pairs work, which gives ${m(`P = ${raw}${answer.d === 36 ? '' : ` = ${answer.tex()}`}`)}.`,
          ),
          conclusion: `${count} of the 36 equally likely pairs work, so the answer is ${ansText}.`,
          keyIdea: 'Two dice give 36 equally likely ordered pairs, not 11 equally likely totals. For each first score, write which second scores work, then count them and divide by 36.',
        };
      }
    },
  },
];
