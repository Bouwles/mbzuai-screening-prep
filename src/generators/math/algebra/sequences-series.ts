import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { frac, m, num, paren, signed } from '../../../lib/tex';

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
      const solution =
        `Here ${m(`a = ${a}`)}, ${m(`d = ${a + d} - ${paren(a)} = ${d}`)} and ${m(`n = ${n}`)}.\n\n` +
        `Use ${m(`S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)`)}:` +
        `\n\n$$S_{${n}} = \\frac{${n}}{2}\\left(2 \\times ${paren(a)} + ${n - 1} \\times ${paren(d)}\\right)$$\n\n` +
        `The bracket is ${m(`${2 * a}${signed((n - 1) * d)} = ${inner}`)}, so\n\n` +
        `$$S_{${n}} = ${frac(n, 2)} \\times ${paren(inner)} = ${num(S)}$$\n\n` +
        `Check with ${m('S_n = \\frac{n}{2}(a + l)')}: the last term is ${m(`l = ${a}${signed((n - 1) * d)} = ${last}`)}, and first plus last is ${last === 0 ? m(`a + l = ${a}`) : m(`${a}${signed(last)} = ${a + last}`)}, the same as the bracket above, so the sum is confirmed.\n\n` +
        `Answer: ${answer}`;
      return {
        stem: `Find the sum of the first ${n} terms of the arithmetic sequence ${m(seq)}`,
        answer,
        answerValue: S,
        distractors: ds.map((c) => ({ text: c.text, value: c.value, why: c.why })),
        solution,
        keyIdea: 'The sum of an arithmetic series is $S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)$: the number of terms times the average of the first and last terms.',
      };
    },
  },
  // ------------------------------------------------------------------ geometric sum to infinity
  {
    id: 'gen-sequences-series-sum-to-infinity',
    subtopic: 'sequences-series',
    difficulty: 'exam',
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
      const solution =
        `The first term is ${m(`a = ${a}`)}.\n\n` +
        `The common ratio is each term divided by the one before: ${m(`r = \\frac{${t2}}{${a}} = ${r.tex()}`)}.\n\n` +
        `Since ${m(`|r| = ${absR.tex()} < 1`)}, the sum to infinity exists.\n\n` +
        `$$S_\\infty = \\frac{a}{1 - r} = \\frac{${a}}{1 - ${paren(r)}} = \\frac{${a}}{${oneMinus.tex()}}$$\n\n` +
        `Dividing by ${m(oneMinus.tex())} is the same as multiplying by ${m(recip.tex())}: ${m(`${a} \\times ${recip.tex()} = ${S.tex()}`)}.\n\n` +
        `Answer: ${answer}`;
      return {
        stem: `Find the sum to infinity of the geometric series ${m(series)}`,
        answer,
        answerValue: S.value(),
        distractors: ds.map((c) => ({ text: c.text, value: c.value, why: c.why })),
        solution,
        keyIdea: 'If $|r| < 1$, the sum to infinity of a geometric series is $S_\\infty = \\frac{a}{1-r}$.',
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
      const solution =
        `Write both facts using ${m('u_n = a + (n-1)d')}:\n\n` +
        `- ${m(`u_{${p}} = a + ${p - 1}d = ${Up}`)}\n` +
        `- ${m(`u_{${q}} = a + ${q - 1}d = ${Uq}`)}\n\n` +
        `Subtract the first from the second (there are ${m(`${q} - ${p} = ${q - p}`)} gaps between these terms):\n\n` +
        `$$${q - p}d = ${Uq} - ${paren(Up)} = ${diff} \\quad\\Rightarrow\\quad d = \\frac{${diff}}{${q - p}} = ${d}$$\n\n` +
        `Find the first term: ${m(`a = ${Up} - ${p - 1} \\times ${paren(d)} = ${a}`)}.\n\n` +
        `Now the ${ordinal(k)} term: ${m(`u_{${k}} = ${a} + ${k - 1} \\times ${paren(d)} = ${num(Uk)}`)}.\n\n` +
        `Answer: ${answer}`;
      return {
        stem: `In an arithmetic sequence, the ${ordinal(p)} term is ${m(String(Up))} and the ${ordinal(q)} term is ${m(String(Uq))}. Find the ${ordinal(k)} term.`,
        answer,
        answerValue: Uk,
        distractors: ds.map((c) => ({ text: c.text, value: c.value, why: c.why })),
        solution,
        keyIdea: 'Turn each given term into $a + (n-1)d = \\text{value}$, subtract to find $d$ (divide by the number of gaps), then find $a$ and the term you need.',
      };
    },
  },
];
