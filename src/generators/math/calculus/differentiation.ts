import type { Generator } from '../../../types';
import { m, num, paren, poly, power, signed, sum } from '../../../lib/tex';

interface Cand {
  v: number;
  why: string;
}

/** Keep up to 3 candidate mistakes whose values differ from the answer and from each other. */
function pickDistinct(answer: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.v) || c.v === answer || out.some((o) => o.v === c.v)) continue;
    out.push(c);
  }
  return out;
}

/** "a \times (x0)^{p}" with sign handling for use inside a sum (p >= 1). */
function subTerm(coef: number, x0: number, p: number, first: boolean): string {
  const mag = Math.abs(coef);
  const base = p === 1 ? paren(x0) : `${paren(x0)}^{${p}}`;
  const body = mag === 1 ? base : `${num(mag)} \\times ${base}`;
  if (first) return coef < 0 ? `-${body}` : body;
  return coef < 0 ? ` - ${body}` : ` + ${body}`;
}

export const generators: Generator[] = [
  {
    id: 'gen-differentiation-poly-at-point',
    subtopic: 'differentiation',
    difficulty: 'foundation',
    title: 'Differentiate a polynomial and evaluate the gradient at a point',
    generate(rng) {
      for (;;) {
        const n = rng.pick([3, 4]);
        const a = rng.intNonZero(-4, 5);
        const b = rng.intNonZero(-6, 6);
        const c = rng.intNonZero(-9, 9);
        const d = rng.intNonZero(-9, 9);
        const x0 = n === 3 ? rng.pick([-2, -1, 1, 2, 3]) : rng.pick([-2, -1, 1, 2]);

        const coeffs = n === 3 ? [a, b, c, d] : [a, 0, b, c, d];
        const dCoeffs = n === 3 ? [3 * a, 2 * b, c] : [4 * a, 0, 2 * b, c];
        const fx = a * x0 ** n + b * x0 ** 2 + c * x0 + d;
        const t1 = a * n * x0 ** (n - 1);
        const t2 = 2 * b * x0;
        const ans = t1 + t2 + c;

        const pool: Cand[] = [
          {
            v: fx,
            why: `This substitutes $x = ${num(x0)}$ into $f(x)$ instead of $f'(x)$, which gives the height of the curve, not its gradient.`,
          },
          {
            v: a * n * x0 ** n + 2 * b * x0 ** 2 + c * x0,
            why: 'This multiplies each term by its power but forgets to **reduce** the power by 1 afterwards.',
          },
          {
            v: a * x0 ** (n - 1) + b * x0 + c,
            why: 'This reduces each power by 1 but forgets to **multiply** by the old power first.',
          },
          {
            v: t1 + t2,
            why: `This treats ${m(sum([[c, 'x']]))} as a constant and differentiates it to $0$. It should become ${m(num(c))}.`,
          },
          {
            v: ans + d,
            why: `This keeps the constant ${m(num(d))} in the derivative. A constant differentiates to $0$.`,
          },
        ];
        const ds = pickDistinct(ans, pool);
        if (ds.length < 3) continue;

        const fTex = poly(coeffs);
        const dTex = poly(dCoeffs);
        const termLines =
          `- ${m(sum([[a, power('x', n)]]))} becomes ${m(sum([[a * n, power('x', n - 1)]]))}\n` +
          `- ${m(sum([[b, 'x^{2}']]))} becomes ${m(sum([[2 * b, 'x']]))}\n` +
          `- ${m(sum([[c, 'x']]))} becomes ${m(num(c))}\n` +
          `- ${m(num(d))} is a constant, so it becomes $0$\n\n`;
        const subst = subTerm(a * n, x0, n - 1, true) + subTerm(2 * b, x0, 1, false) + signed(c);
        const answer = m(num(ans));
        return {
          stem: `Given $f(x) = ${fTex}$, find the value of $f'(${num(x0)})$.`,
          answer,
          answerValue: ans,
          distractors: ds.map((x) => ({ text: m(num(x.v)), value: x.v, why: x.why })),
          solution:
            '**Step 1: differentiate term by term** with the power rule (multiply by the power, then reduce the power by 1):\n\n' +
            termLines +
            `So $f'(x) = ${dTex}$.\n\n` +
            `**Step 2: substitute** $x = ${num(x0)}$ into $f'(x)$:\n\n` +
            `$$f'(${num(x0)}) = ${subst} = ${num(t1)}${signed(t2)}${signed(c)} = ${num(ans)}$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Differentiate first (power rule term by term), then substitute the $x$ value into $f\'(x)$.',
        };
      }
    },
  },
  {
    id: 'gen-differentiation-chain-at-point',
    subtopic: 'differentiation',
    difficulty: 'exam',
    title: 'Chain rule on a bracket raised to a power, evaluated at a point',
    generate(rng) {
      for (;;) {
        const quad = rng.bool(0.4);
        const n = rng.pick([2, 3, 4]);
        const k = rng.pick([1, 1, 2, 3]);
        const p = quad ? rng.int(1, 3) : rng.int(2, 5);
        const q = rng.intNonZero(-6, 6);
        const x0 = rng.pick([-2, -1, 0, 1, 2]);
        const u = quad ? p * x0 * x0 + q : p * x0 + q;
        const gp = quad ? 2 * p * x0 : p;
        if (u === 0 || Math.abs(u) > 3 || gp === 0) continue;

        const kn = k * n;
        const ans = kn * u ** (n - 1) * gp;
        const pool: Cand[] = [
          {
            v: kn * u ** (n - 1),
            why: quad
              ? `This differentiates the outside but forgets to multiply by the derivative of the inside, ${m(`\\frac{du}{dx} = ${sum([[2 * p, 'x']])}`)} (which is ${m(num(gp))} at $x = ${num(x0)}$).`
              : `This differentiates the outside but forgets to multiply by the derivative of the inside, ${m(`\\frac{du}{dx} = ${num(p)}`)}.`,
          },
          {
            v: kn * u ** n * gp,
            why: `This multiplies by the power and by the inside derivative but forgets to reduce the power from ${m(num(n))} to ${m(num(n - 1))}.`,
          },
          {
            v: k * u ** n,
            why: `This substitutes $x = ${num(x0)}$ into $f(x)$ itself, giving the value of the function rather than its gradient.`,
          },
          quad
            ? {
                v: kn * u ** (n - 1) * p,
                why: `This uses ${m(num(p))} as the derivative of the inside, forgetting that ${m(sum([[p, 'x^{2}']]))} differentiates to ${m(sum([[2 * p, 'x']]))}.`,
              }
            : {
                v: kn * gp ** (n - 1),
                why: 'This replaces the inside of the bracket by its derivative. The bracket must stay as it is; its derivative is multiplied on the outside.',
              },
          {
            v: n * u ** (n - 1) * gp,
            why: `This forgets the constant multiple ${m(num(k))} in front of the bracket.`,
          },
        ];
        const ds = pickDistinct(ans, pool);
        if (ds.length < 3) continue;

        const gTex = quad ? sum([[p, 'x^{2}'], [q, '']]) : sum([[p, 'x'], [q, '']]);
        const gpTex = quad ? sum([[2 * p, 'x']]) : num(p);
        const front = k === 1 ? '' : num(k);
        const fTex = `${front}(${gTex})^{${n}}`;
        const outerTex = `${num(kn)}(${gTex})${n - 1 === 1 ? '' : `^{${n - 1}}`}`;
        const uCalc = quad
          ? `${p === 1 ? '' : `${num(p)} \\times `}${paren(x0)}^{2}${signed(q)}`
          : `${num(p)} \\times ${paren(x0)}${signed(q)}`;
        const gpCalc = quad ? `${num(2 * p)} \\times ${paren(x0)} = ${num(gp)}` : num(gp);
        const uPow = n - 1 === 1 ? paren(u) : `${paren(u)}^{${n - 1}}`;
        const answer = m(num(ans));
        return {
          stem: `Given $f(x) = ${fTex}$, find the value of $f'(${num(x0)})$.`,
          answer,
          answerValue: ans,
          distractors: ds.map((x) => ({ text: m(num(x.v)), value: x.v, why: x.why })),
          solution:
            'This is a function inside a function, so use the **chain rule**: differentiate the outside (leaving the inside alone), then multiply by the derivative of the inside.\n\n' +
            `- Outside: ${m(`${front}u^{${n}}`)} differentiates to ${m(`${num(kn)}u${n - 1 === 1 ? '' : `^{${n - 1}}`}`)}, which is ${m(outerTex)}\n` +
            `- Inside: ${m(`u = ${gTex}`)}, so ${m(`\\frac{du}{dx} = ${gpTex}`)}\n\n` +
            `$$f'(x) = ${outerTex} \\times ${quad ? gpTex : num(p)}$$\n\n` +
            `**Substitute** $x = ${num(x0)}$. The inside is ${m(`${uCalc} = ${num(u)}`)} and the inside derivative is ${m(gpCalc)}.\n\n` +
            `$$f'(${num(x0)}) = ${num(kn)} \\times ${uPow} \\times ${paren(gp)}` +
            (n - 1 === 1 ? '' : ` = ${num(kn)} \\times ${paren(u ** (n - 1))} \\times ${paren(gp)}`) +
            ` = ${num(ans)}$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Chain rule: derivative of the outside (inside unchanged) times the derivative of the inside, then substitute.',
        };
      }
    },
  },
];
