import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m, dm, paren, poly, power, signed, sum, term } from '../../../lib/tex';

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
          `\\frac{${a} - ${paren(p)}}{${a} - ${paren(q)}}` + (raw && raw !== ans.tex() ? ` = ${raw}` : '') + ` = ${ans.tex()}`;

        const solution =
          `**Step 1: try substituting.** At ${m(`x = ${a}`)} the top is ${m(`${subst(-(a + p), a * p, a)} = 0`)} and the bottom is ${m(`${subst(-(a + q), a * q, a)} = 0`)}. ` +
          `This is ${m('\\frac{0}{0}')}, so ${m(`(${lin(a)})`)} must be a factor of both.\n\n` +
          `**Step 2: factorise.**\n\n` +
          `- Top: ${m(`${top} = (${lin(a)})(${lin(p)})`)}\n` +
          `- Bottom: ${m(`${bot} = (${lin(a)})(${lin(q)})`)}\n\n` +
          `**Step 3: cancel** the common factor (allowed because ${m(`x \\ne ${a}`)} while approaching):` +
          dm(`\\frac{(${lin(a)})(${lin(p)})}{(${lin(a)})(${lin(q)})} = \\frac{${lin(p)}}{${lin(q)}}`) +
          `**Step 4: substitute** ${m(`x = ${a}`)}:` +
          dm(finalLine) +
          `Answer: ${ansText}`;

        return {
          stem: `Find ${m(`\\lim_{x \\to ${a}} \\dfrac{${top}}{${bot}}`)}.`,
          answer: ansText,
          answerValue: ans.value(),
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea: `A ${m('\\frac{0}{0}')} result at ${m('x = a')} means ${m('(x - a)')} is a factor of top and bottom: factorise, cancel it, then substitute again.`,
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

        let conclusion: string;
        if (kind === 'equal') {
          conclusion =
            `The top tends to ${m(String(a))} and the bottom to ${m(String(d))}, so the limit is` +
            dm(ratio(a, d) + (lead.tex() === ratio(a, d) ? '' : ` = ${lead.tex()}`)) +
            `Shortcut: equal degrees (both ${n}) means the limit is the ratio of the leading coefficients.\n\n`;
        } else if (kind === 'lower') {
          conclusion =
            `Every term on top now has ${m('x')} in its denominator, so the top tends to 0, while the bottom tends to ${m(String(d))}. The limit is ${m(d === 1 ? '0' : `\\frac{0}{${d}} = 0`)}.\n\n` +
            `Shortcut: the bottom has the higher degree (${n} against ${mDeg}), so the limit is 0.\n\n`;
        } else {
          conclusion =
            `The bottom tends to ${m(String(d))}, but the top still contains ${m(term(a, power('x', mDeg - n), true))}, which grows without bound (${a > 0 ? 'positive' : 'negative'} for large ${m('x')}). So the fraction tends to ${ansText}: there is no finite limit.\n\n` +
            `Shortcut: the top has the higher degree (${mDeg} against ${n}), so the fraction blows up, with the same sign as the top's leading coefficient ${m(String(a))}.\n\n`;
        }

        const solution =
          `The highest power of ${m('x')} in the denominator is ${m(power('x', n))}. Divide **every** term, top and bottom, by ${m(power('x', n))}:` +
          dm(`\\frac{${top}}{${bot}} = \\frac{${divided(topTerms)}}{${divided(botTerms)}}`) +
          `As ${m('x \\to \\infty')}, every term of the form ${m('\\frac{\\text{number}}{x^k}')} tends to 0.\n\n` +
          conclusion +
          `Answer: ${ansText}`;

        return {
          stem: `Find ${m(`\\lim_{x \\to \\infty} \\dfrac{${top}}{${bot}}`)}.`,
          answer: ansText,
          answerValue: ansValue,
          distractors: distractors.map((x) => ({ text: x.text, value: x.value, why: x.why })),
          solution,
          keyIdea: `As ${m('x \\to \\infty')}, only the highest powers matter: compare the degrees of the top and bottom.`,
        };
      }
    },
  },
];
