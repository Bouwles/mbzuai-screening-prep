import type { Generator } from '../../../types';
import { Frac, gcd } from '../../../lib/frac';
import { approxEqual } from '../../../lib/mathx';
import { dm, m, sum } from '../../../lib/tex';

/** LaTeX for a Frac used as a base: "8" or "\left(\frac{16}{81}\right)". */
function baseTex(f: Frac): string {
  return f.d === 1 ? String(f.n) : `\\left(${f.tex()}\\right)`;
}

/** n-th root symbol. */
function rootTex(n: number, inner: string): string {
  return n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${n}]{${inner}}`;
}

const powFrac = (f: Frac, p: number): Frac => new Frac(f.n ** p, f.d ** p);

/** Surd form (P + Q*sqrt(b)) / R, reduced, as LaTeX. */
function surdForm(P: number, Q: number, R: number, b: number): { tex: string; value: number } {
  if (R < 0) {
    P = -P;
    Q = -Q;
    R = -R;
  }
  const g = gcd(gcd(Math.abs(P), Math.abs(Q)), R) || 1;
  P /= g;
  Q /= g;
  R /= g;
  const value = (P + Q * Math.sqrt(b)) / R;
  const top = sum([
    [P, ''],
    [Q, `\\sqrt{${b}}`],
  ]);
  if (R === 1) return { tex: top, value };
  if (P === 0) {
    const body = `\\frac{${sum([[Math.abs(Q), `\\sqrt{${b}}`]])}}{${R}}`;
    return { tex: Q < 0 ? `-${body}` : body, value };
  }
  if (P < 0 && Q < 0) {
    const pos = sum([
      [-P, ''],
      [-Q, `\\sqrt{${b}}`],
    ]);
    return { tex: `-\\frac{${pos}}{${R}}`, value };
  }
  return { tex: `\\frac{${top}}{${R}}`, value };
}

export const generators: Generator[] = [
  // ------------------------------------------------------------------ fractional / negative indices
  {
    id: 'gen-indices-surds-fractional-index',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    title: 'Evaluate a number to a fractional (possibly negative) index',
    generate(rng) {
      const q = rng.pick([2, 3, 4]);
      const p = rng.pick(q === 3 ? [1, 2] : [1, 3]);
      const maxS = q === 2 ? 9 : q === 3 ? 5 : 4;
      const s = rng.int(2, maxS);
      let t = 1;
      if (rng.bool(0.4)) {
        const ts = [];
        for (let k = 2; k <= maxS; k++) if (k !== s && gcd(k, s) === 1) ts.push(k);
        if (ts.length) t = rng.pick(ts);
      }
      const neg = rng.bool(0.6);

      const r = new Frac(s, t); // the q-th root of the base
      const base = powFrac(r, q);
      const expTex = `${neg ? '-' : ''}\\frac{${p}}{${q}}`;
      const flipped = new Frac(base.d, base.n);
      const rootUsed = neg ? new Frac(t, s) : r; // root of the (flipped) base
      const answer = powFrac(rootUsed, p);
      const ans = m(answer.tex());
      const question = `${baseTex(base)}^{${expTex}}`;

      const pool: { f: Frac; why: string }[] = [];
      if (neg) {
        pool.push({
          f: powFrac(r, p),
          why: `This ignores the minus sign in the index. A negative index means take the reciprocal, so the base must be flipped to ${m(flipped.tex())} first.`,
        });
        pool.push({
          f: answer.neg(),
          why: 'This makes the answer negative. A negative index never makes the value negative; it only means "one over" (flip the base).',
        });
      } else {
        pool.push({
          f: new Frac(answer.d, answer.n),
          why: 'This takes the reciprocal, as if the index were negative. Only a minus sign in the index means "one over"; this index is positive.',
        });
      }
      if (p !== 1)
        pool.push({
          f: rootUsed,
          why: `This takes the ${q === 2 ? 'square' : q === 3 ? 'cube' : 'fourth'} root but forgets to raise the result to the power ${p} (the numerator of the index).`,
        });
      pool.push({
        f: base.mul(new Frac(neg ? -p : p, q)),
        why: `This multiplies the base by the index ${m(expTex)}. An index is not a multiplier: the denominator ${q} means a root${p === 1 ? '' : ` and the numerator ${p} means a power`}${neg ? ', and the minus sign means flip' : ''}.`,
      });
      const big = powFrac(neg ? flipped : base, p);
      if (Math.max(Math.abs(big.n), big.d) <= 1e6)
        pool.push({
          f: big,
          why:
            p === 1
              ? `This forgets to take the ${q === 2 ? 'square' : q === 3 ? 'cube' : 'fourth'} root: the denominator ${q} of the index means a root.`
              : `This raises to the power ${p} but forgets the ${q === 2 ? 'square' : q === 3 ? 'cube' : 'fourth'} root (the denominator ${q} of the index).`,
        });
      if (p === 1) {
        const swapped = powFrac(neg ? flipped : base, q);
        if (Math.max(Math.abs(swapped.n), swapped.d) <= 1e7)
          pool.push({
            f: swapped,
            why: `This swaps the numerator and denominator of the index, raising to the power ${q} instead of taking the ${q === 2 ? 'square' : q === 3 ? 'cube' : 'fourth'} root.`,
          });
      }
      // guaranteed-different fallbacks (genuine slips)
      pool.push({ f: answer.mul(rootUsed), why: `This applies the power ${p + 1} instead of ${p} after taking the root, an off-by-one slip in the numerator of the index.` });

      const distractors: { text: string; value: number; why: string }[] = [];
      for (const d of pool) {
        if (distractors.length === 3) break;
        const text = m(d.f.tex());
        if (d.f.equals(answer) || text === ans) continue;
        if (distractors.some((x) => x.text === text || approxEqual(x.value, d.f.value(), 1e-12))) continue;
        distractors.push({ text, value: d.f.value(), why: d.why });
      }

      const rootName = q === 2 ? 'square root' : q === 3 ? 'cube root' : 'fourth root';
      const steps: string[] = [];
      steps.push(
        `In ${m(`a^{\\frac{m}{n}}`)} the denominator ${m('n')} is the root and the numerator ${m('m')} is the power${neg ? ', and a minus sign means flip (reciprocal)' : ''}.`,
      );
      let current = base;
      if (neg) {
        steps.push(`1. The minus sign flips the base: ${m(`${question} = ${baseTex(flipped)}^{\\frac{${p}}{${q}}}`)}.`);
        current = flipped;
      }
      const rootLine =
        current.d === 1
          ? `${rootTex(q, String(current.n))} = ${rootUsed.tex()}`
          : `${rootTex(q, current.tex())} = \\frac{${rootTex(q, String(current.n))}}{${rootTex(q, String(current.d))}} = ${rootUsed.tex()}`;
      steps.push(
        `${neg ? '2' : '1'}. The denominator ${q} means take the ${rootName}: ${m(rootLine)}, because ${m(`${baseTex(rootUsed)}^{${q}} = ${current.tex()}`)}.`,
      );
      if (p === 1) steps.push(`${neg ? '3' : '2'}. The numerator is 1, so there is no further power to apply.`);
      else steps.push(`${neg ? '3' : '2'}. The numerator ${p} means raise to the power ${p}: ${m(`${baseTex(rootUsed)}^{${p}} = ${answer.tex()}`)}.`);

      return {
        stem: `Evaluate ${m(question)}.`,
        answer: ans,
        answerValue: answer.value(),
        distractors,
        solution: `${steps[0]}\n\n${steps.slice(1).join('\n')}\n\nAnswer: ${ans}`,
        keyIdea: neg
          ? `${m('a^{-\\frac{m}{n}}')}: flip for the minus sign, take the ${m('n')}th root, then raise to the power ${m('m')}.`
          : `${m('a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^{m}')}: the denominator is the root and the numerator is the power.`,
      };
    },
  },

  // ------------------------------------------------------------------ rationalise with a conjugate
  {
    id: 'gen-indices-surds-rationalise',
    subtopic: 'indices-surds',
    difficulty: 'exam',
    title: 'Rationalise a denominator of the form a ± √b',
    generate(rng) {
      const a = rng.int(2, 7);
      const b = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
      const d = a * a - b; // never 0: b is not a perfect square
      const s = rng.pick([1, -1]); // denominator a + s*sqrt(b)
      // keep the numerator calculator-friendly (at most 60 unless |d| itself is bigger)
      const cMax = Math.max(1, Math.min(3, Math.floor(60 / Math.abs(d))));
      const c = Math.sign(d) * rng.int(1, cMax);
      const k = c * d; // numerator, always positive, divisible by d
      const kp = k === 1 ? '' : String(k); // "6(...)" but "(...)" when k = 1

      const sgn = (x: number) => (x > 0 ? '+' : '-');
      const den = `${a} ${sgn(s)} \\sqrt{${b}}`;
      const conj = `${a} ${sgn(-s)} \\sqrt{${b}}`;
      const ansF = surdForm(k * a, -s * k, d, b);
      const ans = m(ansF.tex);

      const pool: { P: number; Q: number; R: number; why: string }[] = [
        {
          P: k * a,
          Q: -s * k,
          R: a * a + b,
          why: `This uses ${m(`${a * a} + ${b} = ${a * a + b}`)} for the denominator. Multiplying by the conjugate gives a difference of two squares: ${m(`${a}^{2} - (\\sqrt{${b}})^{2} = ${a * a} - ${b} = ${d}`)}.`,
        },
        {
          P: -k * a,
          Q: s * k,
          R: d,
          why: `This works out the denominator the wrong way round, as ${m(`${b} - ${a * a} = ${b - a * a}`)}, which flips the sign of the whole answer. It is ${m(`${a}^{2} - (\\sqrt{${b}})^{2} = ${d}`)}.`,
        },
        {
          P: k * a,
          Q: s * k,
          R: d,
          why: `This gets the sign of the surd wrong in the numerator, as if the top were multiplied by ${m(den)}. Top and bottom must both be multiplied by the conjugate ${m(conj)}, so the top becomes ${m(`${kp}(${conj})`)}.`,
        },
        {
          P: k,
          Q: 0,
          R: d,
          why: `This multiplies only the denominator by the conjugate and forgets to multiply the numerator ${m(String(k))} by ${m(conj)} as well.`,
        },
      ];
      if (a * a !== b * b)
        pool.push({
          P: k * a,
          Q: -s * k,
          R: a * a - b * b,
          why: `This squares ${m(`\\sqrt{${b}}`)} to get ${m(String(b * b))}. In fact ${m(`(\\sqrt{${b}})^{2} = ${b}`)}, so the denominator is ${m(`${a * a} - ${b} = ${d}`)}.`,
        });
      // vary which genuine mistakes appear; the fallback below always stays last
      const shuffled = rng.shuffle(pool);
      pool.length = 0;
      pool.push(...shuffled);
      // fallback: forgot to divide by the denominator at all
      pool.push({
        P: k * a,
        Q: -s * k,
        R: 1,
        why: `This finds the numerator ${m(sum([[k * a, ''], [-s * k, `\\sqrt{${b}}`]]))} but forgets to divide by the denominator ${m(String(d))}.`,
      });

      const distractors: { text: string; value: number; why: string }[] = [];
      for (const x of pool) {
        if (distractors.length === 3) break;
        const f = surdForm(x.P, x.Q, x.R, b);
        const text = m(f.tex);
        if (text === ans || approxEqual(f.value, ansF.value, 1e-12)) continue;
        if (distractors.some((y) => y.text === text || approxEqual(y.value, f.value, 1e-12))) continue;
        distractors.push({ text, value: f.value, why: x.why });
      }

      const numTop = sum([
        [k * a, ''],
        [-s * k, `\\sqrt{${b}}`],
      ]);
      const lines = [
        `Multiply top and bottom by the **conjugate** ${m(conj)} (same terms, opposite sign):`,
        dm(`\\frac{${k}}{${den}} \\times \\frac{${conj}}{${conj}}`),
        `1. Denominator (difference of two squares): ${m(`(${den})(${conj}) = ${a}^{2} - (\\sqrt{${b}})^{2} = ${a * a} - ${b} = ${d}`)}.`,
        `2. Numerator: ${m(`${k === 1 ? '1 \\times ' : kp}(${conj}) = ${numTop}`)}.`,
        d === 1
          ? `3. Dividing by 1 changes nothing, so the result is ${m(numTop)}.`
          : `3. Divide every term by ${m(String(d))}: ${m(`\\frac{${numTop}}{${d}} = ${ansF.tex}`)}.`,
        '',
        `Answer: ${ans}`,
      ];
      return {
        stem: `Rationalise the denominator and simplify ${m(`\\frac{${k}}{${den}}`)}.`,
        answer: ans,
        answerValue: ansF.value,
        distractors,
        solution: lines.join('\n'),
        keyIdea: 'Multiply by the conjugate: $(a + \\sqrt{b})(a - \\sqrt{b}) = a^{2} - b$ is a whole number, so the surd leaves the denominator.',
      };
    },
  },
];
