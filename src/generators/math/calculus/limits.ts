import type { Generator } from '../../../types';
import { steps } from '../../../lib/explanation';
import { Frac } from '../../../lib/frac';
import { m, num, paren, poly, power, signed, sum, term } from '../../../lib/tex';

type Cand = { text: string; value: number | string; why: string };

/** Pick up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistractors(answerText: string, answerValue: number | string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.text === answerText || String(c.value) === String(answerValue)) continue;
    if (out.some((o) => o.text === c.text || String(o.value) === String(c.value))) continue;
    out.push(c);
  }
  return out;
}

/** Fraction x/y written out (not reduced) for explanations; y = 1 gives just x. */
const ratio = (x: number, y: number): string => (y === 1 ? String(x) : `\\frac{${x}}{${y}}`);

/** Substitution x = r into x^2 + B x + C, written out term by term. */
function subst(B: number, C: number, r: number): string {
  let s = `${paren(r)}^2`;
  if (B === 1) s += ` + ${paren(r)}`;
  else if (B === -1) s += ` - ${paren(r)}`;
  else if (B !== 0) s += `${signed(B)} \\times ${paren(r)}`;
  if (C !== 0) s += signed(C);
  return s;
}

/** The value of each term of x^2 + B x + C at x = r, before adding them up: "4 - 10 + 6". */
const substVals = (B: number, C: number, r: number): string => sum([[r * r, ''], [B * r, ''], [C, '']]);

/** "(x - a)" style linear factor, with a != 0. */
const lin = (r: number): string => `x${signed(-r)}`;

/** LaTeX for coef * x^k divided by x^n, as a signed term of a sum. */
function divTerm(coef: number, k: number, n: number, first: boolean): string {
  if (coef === 0) return '';
  const neg = coef < 0;
  const a = Math.abs(coef);
  let body: string;
  if (k > n) body = a === 1 ? power('x', k - n) : `${a}${power('x', k - n)}`;
  else if (k === n) body = String(a);
  else body = `\\frac{${a}}{${power('x', n - k)}}`;
  if (first) return neg ? `-${body}` : body;
  return neg ? ` - ${body}` : ` + ${body}`;
}

export const generators: Generator[] = [
  {
    id: 'gen-limits-factorise-cancel',
    subtopic: 'limits',
    difficulty: 'exam',
    title: 'Limit of a 0/0 rational function by factorising and cancelling',
    generate(rng) {
      for (;;) {
        const a = rng.intNonZero(-5, 5);
        const p = rng.intNonZero(-6, 6);
        const q = rng.intNonZero(-6, 6);
        if (p === a || q === a || p === q) continue;
        const ans = new Frac(a - p, a - q);
        const ansText = m(ans.tex());
        const top = poly([1, -(a + p), a * p]);
        const bot = poly([1, -(a + q), a * q]);

        const pool: Cand[] = [
          {
            text: m('0'),
            value: 0,
            why: `This looks only at the numerator, which is 0 at ${m(`x = ${a}`)}. The denominator is also 0, so the result is the indeterminate form ${m('\\frac{0}{0}')}, not 0.`,
          },
          {
            text: m('1'),
            value: 1,
            why: `This is the ratio of the ${m('x^2')} coefficients. That shortcut is for limits as ${m('x \\to \\infty')}, not as ${m(`x \\to ${a}`)}.`,
          },
        ];
        if (a + q !== 0) {
          const f = new Frac(a + p, a + q);
          pool.push({
            text: m(f.tex()),
            value: f.value(),
            why: `This gets the signs wrong in the leftover factors, using ${m(`(${lin(-p)})`)} and ${m(`(${lin(-q)})`)} instead of ${m(`(${lin(p)})`)} and ${m(`(${lin(q)})`)}. Each factor ${m('(x - r)')} has root ${m('r')}, so check by expanding.`,
          });
        }
        {
          const f = new Frac(a - q, a - p);
          pool.push({
            text: m(f.tex()),
            value: f.value(),
            why: `This is the correct fraction upside down: the leftover factor from the **top** goes on top, giving ${m(`\\frac{${lin(p)}}{${lin(q)}}`)}.`,
          });
        }
        {
          const f = new Frac(p, q);
          pool.push({
            text: m(f.tex()),
            value: f.value(),
            why: `This is the ratio of the constant terms, ${m(`\\frac{${a * p}}{${a * q}}`)}, which is what you get by putting ${m('x = 0')} instead of ${m(`x = ${a}`)}.`,
          });
        }
        pool.push({
          text: 'The limit does not exist',
          value: 'dne',
          why: `Getting ${m('\\frac{0}{0}')} does not mean there is no limit. It means there is a common factor ${m(`(${lin(a)})`)} to cancel; afterwards the limit is an ordinary number.`,
        });

        const distractors = pickDistractors(ansText, ans.value(), [pool[0], ...rng.shuffle(pool.slice(1))]);
        if (distractors.length < 3) continue;

        // Show the unsimplified fraction (e.g. \frac{-8}{-11}) before the reduced answer, except over 1.
        const raw = a - q !== 1 ? `\\frac{${a - p}}{${a - q}}` : '';
        const finalLine =
          `\\frac{${a}${signed(-p)}}{${a}${signed(-q)}}` + (raw && raw !== ans.tex() ? ` = ${raw}` : '') + ` = ${ans.tex()}`;

        const solution = steps(
          `Try putting in ${m(`x = ${a}`)} first. The top is ${m(`${subst(-(a + p), a * p, a)} = ${substVals(-(a + p), a * p, a)} = 0`)}. The bottom is ${m(`${subst(-(a + q), a * q, a)} = ${substVals(-(a + q), a * q, a)} = 0`)}.`,
          `That gives ${m('\\frac{0}{0}')}, which is not a number, so we must simplify first. Both being 0 at ${m(`x = ${a}`)} tells us ${m(`(${lin(a)})`)} is a factor of each.`,
          `Factorise the top. We need two numbers that multiply to ${m(num(a * p))} and add to ${m(num(-(a + p)))}. They are ${m(num(-a))} and ${m(num(-p))}, so ${m(`${top} = (${lin(a)})(${lin(p)})`)}.`,
          `Factorise the bottom the same way. Two numbers that multiply to ${m(num(a * q))} and add to ${m(num(-(a + q)))} are ${m(num(-a))} and ${m(num(-q))}, so ${m(`${bot} = (${lin(a)})(${lin(q)})`)}.`,
          `A limit only uses ${m('x')} near ${m(String(a))}, never ${m(String(a))} itself. So ${m(lin(a))} is not 0, and we can cancel it:\n\n$$\\frac{(${lin(a)})(${lin(p)})}{(${lin(a)})(${lin(q)})} = \\frac{${lin(p)}}{${lin(q)}}$$`,
          `The bottom is no longer 0, so substitute ${m(`x = ${a}`)}:\n\n$$${finalLine}$$`,
        );

        return {
          stem: `Find ${m(`\\lim_{x \\to ${a}} \\dfrac{${top}}{${bot}}`)}.`,
          answer: ansText,
          answerValue: ans.value(),
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          asking: `What value does this fraction get close to when ${m('x')} gets close to ${m(String(a))}?`,
          solution,
          conclusion: `After cancelling, nothing goes wrong at ${m(`x = ${a}`)}, and the fraction equals ${ansText} there.`,
          keyIdea: `If substituting ${m('x = a')} gives ${m('\\frac{0}{0}')}, then ${m('(x - a)')} is a factor of both top and bottom. Factorise both, cancel it, then substitute again.`,
        };
      }
    },
  },
  {
    id: 'gen-limits-at-infinity',
    subtopic: 'limits',
    difficulty: 'exam',
    title: 'Limit of a rational function as x tends to infinity',
    generate(rng) {
      for (;;) {
        const kind = rng.pick(['equal', 'equal', 'lower', 'higher'] as const);
        let n: number;
        let mDeg: number;
        if (kind === 'equal') {
          n = rng.int(1, 3);
          mDeg = n;
        } else if (kind === 'lower') {
          n = rng.int(2, 3);
          mDeg = rng.int(1, n - 1);
        } else {
          n = rng.int(1, 2);
          mDeg = rng.int(n + 1, 3);
        }
        const a = rng.intNonZero(-9, 9);
        const d = rng.int(1, 9);
        const b = mDeg >= 2 ? rng.int(-9, 9) : 0;
        const c = rng.intNonZero(-9, 9);
        const e = rng.intNonZero(-9, 9);
        const ascending = rng.bool(0.35);

        // terms as [coef, power]
        const topTerms: [number, number][] = [[a, mDeg]];
        if (mDeg >= 2 && b !== 0) topTerms.push([b, 1]);
        topTerms.push([c, 0]);
        const botTerms: [number, number][] = [
          [d, n],
          [e, 0],
        ];
        if (ascending) {
          topTerms.reverse();
          botTerms.reverse();
        }
        const tex = (ts: [number, number][]) => sum(ts.map(([co, k]) => [co, power('x', k)] as [number, string]));
        const top = tex(topTerms);
        const bot = tex(botTerms);
        const divided = (ts: [number, number][]) => ts.map(([co, k], i) => divTerm(co, k, n, i === 0)).join('');

        const lead = new Frac(a, d);
        const flip = new Frac(d, a);
        const consts = new Frac(c, e);
        const sign = a > 0 ? 1 : -1;
        const infText = (s: number) => (s > 0 ? m('\\infty') : m('-\\infty'));

        let ansText: string;
        let ansValue: number | string;
        if (kind === 'equal') {
          ansText = m(lead.tex());
          ansValue = lead.value();
        } else if (kind === 'lower') {
          ansText = m('0');
          ansValue = 0;
        } else {
          ansText = infText(sign);
          ansValue = sign > 0 ? 'inf' : '-inf';
        }

        const pool: Cand[] = [];
        if (kind !== 'equal')
          pool.push({
            text: m(lead.tex()),
            value: lead.value(),
            why: `This is the ratio of the leading coefficients, ${m(ratio(a, d))}. That shortcut only works when the top and bottom have the **same** degree; here the top has degree ${mDeg} and the bottom degree ${n}.`,
          });
        pool.push({
          text: m(flip.tex()),
          value: flip.value(),
          why:
            kind === 'equal'
              ? `This divides the leading coefficients the wrong way round (${m(ratio(d, a))}). The top coefficient goes on top.`
              : `This is the ratio of the leading coefficients upside down (${m(ratio(d, a))}). Two mistakes: the top coefficient should go on top, and in any case the leading-coefficient shortcut only applies when the degrees are equal (here ${mDeg} on top against ${n} on the bottom).`,
        });
        pool.push({
          text: m(consts.tex()),
          value: consts.value(),
          why: `This is the ratio of the constant terms, ${m(ratio(c, e))}, which is the value at ${m('x = 0')}. As ${m('x \\to \\infty')} the constants become negligible and the **highest powers** decide.`,
        });
        if (kind !== 'lower')
          pool.push({
            text: m('0'),
            value: 0,
            why:
              kind === 'equal'
                ? `This assumes every term disappears as ${m('x')} grows. After dividing by ${m(power('x', n))}, only the smaller-power terms go to 0; the leading terms leave ${m(ratio(a, d))}.`
                : `This would be right if the bottom had the higher degree. Here the top has the higher degree (${mDeg} against ${n}), so the fraction grows without bound.`,
          });
        if (kind !== 'higher')
          pool.push({
            text: m('\\infty'),
            value: 'inf',
            why:
              kind === 'equal'
                ? `Top and bottom both grow without bound, but at the same rate (both degree ${n}), so their ratio settles to a finite number.`
                : `The top grows, but the bottom grows faster (degree ${n} against ${mDeg}), so the fraction shrinks to 0 instead of blowing up.`,
          });
        if (kind === 'higher')
          pool.push({
            text: infText(-sign),
            value: sign > 0 ? '-inf' : 'inf',
            why: `This has the wrong sign. For large ${m('x')} the fraction behaves like ${m(term(lead, power('x', mDeg - n), true))}, whose sign is the sign of the leading coefficient ${m(String(a))} (the bottom's leading coefficient ${m(String(d))} is positive).`,
          });

        const distractors = pickDistractors(ansText, ansValue, pool);
        if (distractors.length < 3) continue;

        let last: string;
        let conclusion: string;
        if (kind === 'equal') {
          last = `That leaves just ${m(String(a))} on top and ${m(String(d))} on the bottom, so the limit is:\n\n$$${ratio(a, d) + (lead.tex() === ratio(a, d) ? '' : ` = ${lead.tex()}`)}$$`;
          conclusion = `Top and bottom have the same highest power, so only the numbers in front of those powers count, giving ${ansText}.`;
        } else if (kind === 'lower') {
          last = `Every term on top still has ${m('x')} on its bottom, so the whole top tends to 0. The bottom tends to ${m(String(d))}. And 0 divided by ${m(String(d))} is 0.`;
          conclusion = `The bottom has the higher power (${n} against ${mDeg}), so it outgrows the top and the fraction shrinks to ${ansText}.`;
        } else {
          last = `The bottom tends to ${m(String(d))}. But the top still contains ${m(term(a, power('x', mDeg - n), true))}, which grows without end and is ${a > 0 ? 'positive' : 'negative'} for large ${m('x')}. So the fraction heads to ${ansText}.`;
          conclusion = `The top has the higher power (${mDeg} against ${n}), so the fraction grows without end. Its sign follows the top's ${m(String(a))}, so it heads to ${ansText}.`;
        }

        const solution = steps(
          `${m('x \\to \\infty')} means ${m('x')} grows without end. When ${m('x')} is huge, the highest power on each line matters most: ${m(term(a, power('x', mDeg), true))} on top and ${m(term(d, power('x', n), true))} on the bottom.${ascending ? ' Here each one is written last, so look along the whole line.' : ''}`,
          `Divide every term, top and bottom, by ${m(power('x', n))}, the highest power on the bottom. Doing the same to top and bottom leaves the fraction's value unchanged:\n\n$$\\frac{${top}}{${bot}} = \\frac{${divided(topTerms)}}{${divided(botTerms)}}$$`,
          `When ${m('x')} is huge, a number divided by a power of ${m('x')} is tiny. So every term with ${m('x')} on its bottom shrinks towards 0.`,
          last,
        );

        return {
          stem: `Find ${m(`\\lim_{x \\to \\infty} \\dfrac{${top}}{${bot}}`)}.`,
          answer: ansText,
          answerValue: ansValue,
          distractors: distractors.map((x) => ({ text: x.text, value: x.value, why: x.why })),
          asking: `What does this fraction head towards as ${m('x')} grows without end?`,
          solution,
          conclusion,
          keyIdea: `For ${m('x \\to \\infty')}, compare the highest powers on top and bottom. Same power: the limit is the ratio of the numbers in front. Bottom higher: 0. Top higher: it grows without end.`,
        };
      }
    },
  },
];
