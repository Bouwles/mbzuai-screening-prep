import type { Generator } from '../../../types';
import { steps } from '../../../lib/explanation';
import { Frac } from '../../../lib/frac';
import { m, num, paren, signed } from '../../../lib/tex';

type Cand = { value: number; text: string; why: string };

/** Keep the first 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistractors(answerValue: number, answerText: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value)) continue;
    if (Math.abs(c.value - answerValue) < 1e-9 || c.text === answerText) continue;
    if (out.some((o) => Math.abs(o.value - c.value) < 1e-9 || o.text === c.text)) continue;
    out.push(c);
  }
  if (out.length < 3) throw new Error('not enough distinct distractors');
  return out;
}

function ordinal(n: number): string {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  const u = n % 10;
  return `${n}${u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'}`;
}

export const generators: Generator[] = [
  // ------------------------------------------------------------------ arithmetic sum
  {
    id: 'gen-sequences-series-arith-sum',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    title: 'Sum of the first n terms of an arithmetic sequence',
    generate(rng) {
      const a = rng.intNonZero(-10, 20);
      const d = rng.intNonZero(-6, 9);
      const n = rng.int(10, 40);
      const S = (n * (2 * a + (n - 1) * d)) / 2; // always an integer
      const inner = 2 * a + (n - 1) * d;
      const last = a + (n - 1) * d;
      const sumTo = (k: number) => (k * (2 * a + (k - 1) * d)) / 2;
      const answer = m(num(S));
      const pool: Cand[] = [
        { value: 2 * S, text: m(num(2 * S)), why: `This is ${m(`${n}\\left(2a + (n-1)d\\right)`)}: the division by 2 was forgotten. The formula is ${m(`\\frac{n}{2}\\left(2a + (n-1)d\\right)`)}.` },
        { value: (n * (2 * a + n * d)) / 2, text: m(num((n * (2 * a + n * d)) / 2)), why: `This uses ${m('nd')} instead of ${m('(n-1)d')} inside the bracket, which adds one difference too many.` },
        { value: last, text: m(num(last)), why: `This is the ${ordinal(n)} **term** ${m(`a + (n-1)d = ${num(last)}`)}, not the sum of the first ${n} terms.` },
        { value: (n * last) / 2, text: m(num((n * last) / 2)), why: `This uses ${m('a')} instead of ${m('2a')} inside the bracket, ${m(`\\frac{n}{2}\\left(a + (n-1)d\\right)`)}. The bracket must be first term plus last term, which is ${m('2a + (n-1)d')}.` },
        { value: sumTo(n - 1), text: m(num(sumTo(n - 1))), why: `This is the sum of only the first ${n - 1} terms: one term short.` },
        { value: sumTo(n + 1), text: m(num(sumTo(n + 1))), why: `This is the sum of the first ${n + 1} terms: one term too many.` },
      ];
      const ds = pickDistractors(S, answer, pool);
      const seq = `${a}, ${a + d}, ${a + 2 * d}, \\dots`;
      const solution = steps(
        `This is an **arithmetic sequence**: it changes by the same amount each time. The first term is ${m(`a = ${a}`)}, and the **common difference** is ${m(`d = ${a + d} - ${paren(a)} = ${d}`)}. We want ${m(`n = ${n}`)} terms.`,
        `Adding ${n} terms by hand is slow, so use the sum formula: ${m('S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)')}. It is the number of terms times the average of the first and last terms.`,
        `Substitute: ${m(`S_{${n}} = \\frac{${n}}{2}\\left(2 \\times ${paren(a)} + ${n - 1} \\times ${paren(d)}\\right)`)}.`,
        `Work out the bracket: ${m(`2 \\times ${paren(a)} = ${2 * a}`)} and ${m(`${n - 1} \\times ${paren(d)} = ${(n - 1) * d}`)}, so the bracket is ${m(`${2 * a}${signed((n - 1) * d)} = ${inner}`)}.`,
        `Finish: ${m(`\\frac{${n}}{2} \\times ${paren(inner)} = ${num(S)}`)}.`,
      );
      return {
        stem: `Find the sum of the first ${n} terms of the arithmetic sequence ${m(seq)}`,
        answer,
        answerValue: S,
        distractors: ds.map((c) => ({ text: c.text, value: c.value, why: c.why })),
        asking: `What do the first ${n} numbers in this list add up to?`,
        solution,
        conclusion: `The bracket is ${m(num(inner))}, and multiplying it by half of ${n} gives the total. So the answer is ${answer}.`,
        keyIdea: 'To add up an arithmetic sequence, find $a$, $d$ and $n$, then use $S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)$. If you know the last term $l$, use $S_n = \\frac{n}{2}(a + l)$.',
      };
    },
  },
  // ------------------------------------------------------------------ geometric sum to infinity
  {
    id: 'gen-sequences-series-sum-to-infinity',
    subtopic: 'sequences-series',
    difficulty: 'foundation',
    title: 'Sum to infinity of a geometric series',
    generate(rng) {
      const ratios: [number, number][] = [
        [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
        [-1, 2], [-1, 3], [-2, 3], [-1, 4], [-3, 4], [-1, 5], [-2, 5],
      ];
      const [rn, rd] = rng.pick(ratios);
      const r = new Frac(rn, rd);
      const kMax = Math.max(2, Math.floor(100 / (rd * rd)));
      const a = rd * rd * rng.int(1, kMax);
      const t2 = (a * rn) / rd;
      const t3 = (a * rn * rn) / (rd * rd);
      const oneMinus = new Frac(1).sub(r);
      const S = new Frac(a).div(oneMinus);
      const answer = m(S.tex());
      const fr = (f: Frac, why: string): Cand => ({ value: f.value(), text: m(f.tex()), why });
      const pool: Cand[] = [
        fr(new Frac(a).div(new Frac(1).add(r)), `This uses ${m('\\frac{a}{1 + r}')}. The formula is ${m('S_\\infty = \\frac{a}{1 - r}')}${rn < 0 ? `; with a negative ratio, ${m(`1 - r = 1 - ${paren(r)}`)} is **bigger** than 1` : ''}.`),
        fr(new Frac(t2).div(oneMinus), `This uses the second term ${m(String(t2))} as ${m('a')}. The first term of the series is ${m(String(a))}.`),
        fr(new Frac(a + t2 + t3), `This adds only the three terms shown. The series goes on forever, and the later terms still change the total.`),
        fr(new Frac(a).mul(oneMinus), `This multiplies by ${m('1 - r')} instead of dividing by it.`),
        fr(new Frac(a).div(new Frac(1).sub(new Frac(rd, rn))), `This uses the ratio upside down, ${m(`\\frac{u_1}{u_2} = ${new Frac(rd, rn).tex()}`)}. The ratio is each term divided by the one **before** it.`),
      ];
      const ds = pickDistractors(S.value(), answer, pool);
      const series = `${a}${signed(t2)}${signed(t3)} + \\dots`;
      const absR = new Frac(Math.abs(rn), rd);
      const recip = new Frac(oneMinus.d, oneMinus.n);
      const solution = steps(
        `This is a **geometric series**: each term is the last one multiplied by the same number, the **common ratio** ${m('r')}. Divide the second term by the first: ${m(`${t2} \\div ${a} = ${r.tex()}`)}. So ${m(`r = ${r.tex()}`)}, and the first term is ${m(`a = ${a}`)}.`,
        `The size of ${m('r')}, ignoring its sign, is ${m(absR.tex())}, which is less than 1. So the terms shrink towards 0, and the total settles at a fixed value called the **sum to infinity**.`,
        `The formula is ${m('S_\\infty = \\frac{a}{1 - r}')}. First work out the bottom: ${m(`1 - ${paren(r)} = ${oneMinus.tex()}`)}. So ${m(`S_\\infty = \\frac{${a}}{${oneMinus.tex()}}`)}.`,
        `Dividing by a fraction is the same as multiplying by that fraction flipped, which is ${m(recip.tex())}: ${m(`${a} \\times ${recip.tex()} = ${S.tex()}`)}.`,
      );
      return {
        stem: `Find the sum to infinity of the geometric series ${m(series)}`,
        answer,
        answerValue: S.value(),
        distractors: ds.map((c) => ({ text: c.text, value: c.value, why: c.why })),
        asking: 'What total do these endlessly shrinking terms settle towards?',
        solution,
        conclusion: `Adding more and more terms gets closer and closer to this total, so the answer is ${answer}.`,
        keyIdea: 'To spot this type, look for a geometric series with shrinking terms. Find $a$ and $r$, make sure $r$ is between $-1$ and 1, then use $S_\\infty = \\frac{a}{1 - r}$.',
      };
    },
  },
  // ------------------------------------------------------------------ arithmetic: find a term from two given terms
  {
    id: 'gen-sequences-series-two-terms',
    subtopic: 'sequences-series',
    difficulty: 'exam',
    title: 'Arithmetic sequence: find a term from two given terms',
    generate(rng) {
      let a = 0;
      let d = 0;
      let p = 0;
      let q = 0;
      let k = 0;
      const term = (i: number) => a + (i - 1) * d;
      // re-roll until the given p-th term is non-zero (keeps the working free of "- 0")
      do {
        a = rng.intNonZero(-15, 30);
        d = rng.intNonZero(-8, 9);
        p = rng.int(3, 7);
        q = p + rng.int(2, 6);
        k = rng.int(q + 5, 50);
      } while (term(p) === 0);
      const Up = term(p);
      const Uq = term(q);
      const Uk = term(k);
      const answer = m(num(Uk));
      const pool: Cand[] = [];
      const diff = Uq - Up;
      if (diff % (q - p + 1) === 0) {
        const dWrong = diff / (q - p + 1);
        const aWrong = Up - (p - 1) * dWrong;
        const v = aWrong + (k - 1) * dWrong;
        pool.push({ value: v, text: m(num(v)), why: `This divides ${m(String(diff))} by ${q - p + 1}, the number of terms from the ${ordinal(p)} to the ${ordinal(q)}. You must divide by the number of **gaps**, ${m(`${q} - ${p} = ${q - p}`)}.` });
      }
      pool.push({ value: a + k * d, text: m(num(a + k * d)), why: `This uses ${m(`a + ${k}d`)} instead of ${m(`a + (${k} - 1)d`)}: from the 1st term to the ${ordinal(k)} there are only ${k - 1} steps.` });
      pool.push({ value: Up + (k - 1) * d, text: m(num(Up + (k - 1) * d)), why: `This treats the ${ordinal(p)} term, ${m(String(Up))}, as the first term. The first term is ${m(`a = ${a}`)}.` });
      pool.push({ value: term(k - 1), text: m(num(term(k - 1))), why: `This is the ${ordinal(k - 1)} term: it adds ${m(`(${k} - 2)d`)} to ${m('a')}, which is one step of ${m('d')} too few.` });
      pool.push({ value: (k - 1) * d, text: m(num((k - 1) * d)), why: `This is ${m(`(${k} - 1)d`)} on its own: the first term ${m(`a = ${a}`)} was never added.` });
      pool.push({ value: term(k + 1), text: m(num(term(k + 1))), why: `This is the ${ordinal(k + 1)} term, one step too far.` });
      const ds = pickDistractors(Uk, answer, pool);
      const solution = steps(
        `An arithmetic sequence has ${m('n')}th term ${m('u_n = a + (n-1)d')}, where ${m('a')} is the first term and ${m('d')} is the **common difference**, the amount added each time. Write both facts this way.`,
        `The ${ordinal(p)} term gives ${m(`a + ${p - 1}d = ${Up}`)}. The ${ordinal(q)} term gives ${m(`a + ${q - 1}d = ${Uq}`)}.`,
        `Subtract the first equation from the second to remove ${m('a')}. There are ${m(`${q} - ${p} = ${q - p}`)} gaps between these terms, so ${m(`${q - p}d = ${Uq} - ${paren(Up)} = ${diff}`)}.`,
        `Divide both sides by ${q - p}: ${m(`d = ${diff} \\div ${q - p} = ${d}`)}.`,
        `Find the first term by rearranging the first equation: ${m(`a = ${Up} - ${p - 1} \\times ${paren(d)} = ${a}`)}.`,
        `Now use the formula for the ${ordinal(k)} term: ${m(`u_{${k}} = ${a} + ${k - 1} \\times ${paren(d)} = ${a}${signed((k - 1) * d)} = ${num(Uk)}`)}.`,
      );
      return {
        stem: `In an arithmetic sequence, the ${ordinal(p)} term is ${m(String(Up))} and the ${ordinal(q)} term is ${m(String(Uq))}. Find the ${ordinal(k)} term.`,
        answer,
        answerValue: Uk,
        distractors: ds.map((c) => ({ text: c.text, value: c.value, why: c.why })),
        asking: `What is the ${ordinal(k)} term of this sequence?`,
        solution,
        conclusion: `With first term ${m(String(a))} and common difference ${m(String(d))}, the ${ordinal(k)} term is ${answer}.`,
        keyIdea: 'Given two terms of an arithmetic sequence, write each as $a + (n-1)d$ and subtract to remove $a$. Divide by the number of gaps to find $d$, then find $a$ and the term you need.',
      };
    },
  },
];
