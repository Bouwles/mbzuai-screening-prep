import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m, poly, sum, term, signed } from '../../../lib/tex';

/** "y = mx + c" as clean LaTeX (no $). */
function lineTex(grad: number | Frac, c: number | Frac): string {
  return `y = ${sum([
    [grad, 'x'],
    [c, ''],
  ])}`;
}

/** Linear factor "(x - r)", or "x" when r = 0. */
function factor(r: number): string {
  return r === 0 ? 'x' : `(x${signed(-r)})`;
}

interface Cand {
  text: string;
  why: string;
}

/** Keep the first 3 candidates whose rendered text differs from the answer and from each other. */
function pickDistinct(answer: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.text === answer || out.some((o) => o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

export const generators: Generator[] = [
  {
    id: 'gen-derivative-applications-tangent-line',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    title: 'Equation of the tangent to a quadratic at a point',
    generate(rng) {
      const a = rng.pick([-3, -2, -1, 1, 2, 3]);
      const b = rng.int(-6, 6);
      const c = rng.int(-8, 8);
      let p = 1;
      let grad = 0;
      do {
        p = rng.pick([-3, -2, -1, 1, 2, 3]);
        grad = 2 * a * p + b;
      } while (grad === 0);
      const f = (x: number) => a * x * x + b * x + c;
      const yp = f(p);
      const k = yp - grad * p; // y-intercept of the tangent
      const answer = m(lineTex(grad, k));

      // genuine mistakes
      const wrongDeriv = a * p + b; // differentiated ax^2 as ax (forgot to multiply by the power)
      const normalGrad = new Frac(-1, grad);
      const normalC = new Frac(yp).sub(normalGrad.mul(p));
      const pool: Cand[] = [
        {
          text: m(lineTex(grad, yp)),
          why: `This uses the $y$-coordinate ${m(String(yp))} as the $y$-intercept. The point ${m(`(${p}, ${yp})`)} is not on the $y$-axis, so the intercept must come from ${m(`y - y_1 = m(x - x_1)`)}.`,
        },
        {
          text: m(lineTex(grad, yp + grad * p)),
          why: `This makes a sign slip when rearranging ${m(`y - y_1 = m(x - x_1)`)}: the intercept is ${m(`y_1 - mx_1 = ${yp}${signed(-grad * p)} = ${k}`)}, but here ${m(`mx_1`)} was added instead of subtracted.`,
        },
        {
          text: m(lineTex(normalGrad, normalC)),
          why: `This is the **normal** (gradient ${m(normalGrad.tex())}, the negative reciprocal of ${m(String(grad))}), not the tangent.`,
        },
        {
          text: m(lineTex(2 * a, b)),
          why: `This just writes the derivative ${m(`\\frac{dy}{dx} = ${poly([2 * a, b])}`)} as if it were the line. The tangent needs the gradient **at** ${m(`x = ${p}`)} (a single number) and must pass through the point on the curve.`,
        },
        {
          text: m(lineTex(wrongDeriv, yp - wrongDeriv * p)),
          why: `This differentiates ${m(poly([a, 0, 0]))} as ${m(poly([a, 0]))} (forgetting to multiply by the power 2), so the gradient comes out as ${m(String(wrongDeriv))} instead of ${m(String(grad))}.`,
        },
        {
          text: m(lineTex(-grad, yp + grad * p)),
          why: `This has the wrong sign for the gradient: it should be ${m(String(grad))}, not ${m(String(-grad))}.`,
        },
      ];
      const distractors = pickDistinct(answer, pool);

      const yCalc = sum([
        [a, `(${p})^{2}`],
        [b, `(${p})`],
        [c, ''],
      ]);
      const gCalc = sum([
        [2 * a, `(${p})`],
        [b, ''],
      ]);
      // gradient 1: write "x - 1", not "(x - 1)" with a pointless bracket
      const rhs = grad === 1 ? `x${signed(-p)}` : term(grad, factor(p), true);
      const pointForm = `${yp === 0 ? 'y' : `y${signed(-yp)}`} = ${rhs}`;
      const expanded = `y = ${sum([
        [grad, 'x'],
        [-grad * p, ''],
        [yp, ''],
      ])}`;
      const solution =
        `1. Find the point on the curve: ${m(`y = ${yCalc} = ${yp}`)}, so the point is ${m(`(${p}, ${yp})`)}.\n` +
        `2. Differentiate: ${m(`\\frac{dy}{dx} = ${poly([2 * a, b])}`)}.\n` +
        `3. Gradient at ${m(`x = ${p}`)}: ${m(`m = ${gCalc} = ${grad}`)}.\n` +
        `4. Use ${m(`y - y_1 = m(x - x_1)`)}: ${m(pointForm)}.\n` +
        `5. Expand and rearrange: ${m(expanded)}` +
        (expanded === lineTex(grad, k) ? '' : `, so ${m(lineTex(grad, k))}`) +
        `.\n\nAnswer: ${answer}`;

      return {
        stem: `Find the equation of the tangent to the curve ${m(`y = ${poly([a, b, c])}`)} at the point where ${m(`x = ${p}`)}.`,
        answer,
        answerValue: `${grad}|${k}`,
        distractors: distractors.map((d) => ({ text: d.text, why: d.why })),
        solution,
        keyIdea: 'Tangent line: get the point from the curve, the gradient from the derivative at that point, then use $y - y_1 = m(x - x_1)$.',
      };
    },
  },
  {
    id: 'gen-derivative-applications-stationary-cubic',
    subtopic: 'derivative-applications',
    difficulty: 'exam',
    title: 'Find and classify the stationary points of a cubic',
    generate(rng) {
      const k = rng.pick([1, -1, 2, -2]);
      let r1 = 0;
      let r2 = 0;
      do {
        r1 = rng.int(-3, 2);
        r2 = r1 + rng.pick([2, 4]);
      } while (r2 > 4);
      const d = rng.int(-9, 9);
      const s = r1 + r2; // even, so all coefficients are integers
      const c3 = k;
      const c2 = (-3 * k * s) / 2;
      const c1 = 3 * k * r1 * r2;
      const f = (x: number) => c3 * x ** 3 + c2 * x ** 2 + c1 * x + d;
      const f2 = (x: number) => 6 * k * x - 3 * k * s; // second derivative
      const want = rng.pick(['maximum', 'minimum'] as const);
      // f''(r1) = 3k(r1 - r2) has the opposite sign to k: for k > 0, r1 is the maximum.
      const maxX = k > 0 ? r1 : r2;
      const minX = k > 0 ? r2 : r1;
      const xa = want === 'maximum' ? maxX : minX;
      const xo = want === 'maximum' ? minX : maxX;
      const pt = (x: number, y: number) => m(`(${x}, ${y})`);
      const answer = pt(xa, f(xa));
      const mid = s / 2;
      const other = want === 'maximum' ? 'minimum' : 'maximum';

      const pool: Cand[] = [
        {
          text: pt(xo, f(xo)),
          why: `This is the other stationary point, but ${m(`f''(${xo}) = ${f2(xo)}`)}, which is ${f2(xo) > 0 ? 'positive' : 'negative'}, so it is the local **${other}**. Check the sign of the second derivative carefully.`,
        },
        {
          text: pt(mid, f(mid)),
          why: `This is where ${m(`f''(x) = 0`)} (the point of inflection, halfway between the stationary points). It is not stationary: ${m(`f'(${mid}) = ${3 * k * (mid - r1) * (mid - r2)} \\ne 0`)}.`,
        },
        {
          text: pt(-xa, f(-xa)),
          why: `This comes from a sign slip when solving ${m(`f'(x) = 0`)}: the factor ${m(factor(xa))} gives ${m(`x = ${xa}`)}, not ${m(`x = ${-xa}`)}.`,
        },
        {
          text: pt(xa, f2(xa)),
          why: `The ${m('x')}-value is right, but the ${m('y')}-value was found by substituting into ${m(`f''(x)`)} instead of the original function ${m('f(x)')}.`,
        },
        {
          text: pt(xo, f(xa)),
          why: `This mixes up the two stationary points: the ${m('y')}-value belongs to ${m(`x = ${xa}`)}, but the ${m('x')}-value is that of the local ${other}.`,
        },
        {
          text: pt(xa + 1, f(xa + 1)),
          why: `This point is on the curve but is not stationary: ${m(`f'(${xa + 1}) = ${3 * k * (xa + 1 - r1) * (xa + 1 - r2)} \\ne 0`)}.`,
        },
      ];
      const distractors = pickDistinct(answer, pool);

      const lead = 3 * k;
      const leadTex = lead === 3 ? '3' : lead === -3 ? '-3' : String(lead);
      const fTex = poly([c3, c2, c1, d]);
      const f1Tex = poly([3 * c3, 2 * c2, c1]);
      const f2Tex = poly([6 * k, -3 * k * s]);
      const f2Calc = (x: number) =>
        sum([
          [6 * k, `(${x})`],
          [-3 * k * s, ''],
        ]);
      const nature = (x: number) => (f2(x) < 0 ? 'local maximum' : 'local minimum');
      const fCalc = sum([
        [c3, `(${xa})^{3}`],
        [c2, `(${xa})^{2}`],
        [c1, `(${xa})`],
        [d, ''],
      ]);
      const solution =
        `1. Differentiate: ${m(`f'(x) = ${f1Tex}`)}.\n` +
        `2. Factorise: ${m(`f'(x) = ${leadTex}${r2 === 0 ? factor(r2) + factor(r1) : factor(r1) + factor(r2)}`)}, so the stationary points are at ${m(`x = ${r1}`)} and ${m(`x = ${r2}`)}.\n` +
        `3. Second derivative: ${m(`f''(x) = ${f2Tex}`)}.\n` +
        `4. At ${m(`x = ${r1}`)}: ${m(`f''(${r1}) = ${f2Calc(r1)} = ${f2(r1)}`)}, ${f2(r1) < 0 ? 'negative' : 'positive'}, so a **${nature(r1)}**.\n` +
        `5. At ${m(`x = ${r2}`)}: ${m(`f''(${r2}) = ${f2Calc(r2)} = ${f2(r2)}`)}, ${f2(r2) < 0 ? 'negative' : 'positive'}, so a **${nature(r2)}**.\n` +
        `6. The local ${want} is at ${m(`x = ${xa}`)}. Substitute into the original function: ${m(`f(${xa}) = ${fCalc} = ${f(xa)}`)}.\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `Find the coordinates of the local **${want}** of ${m(`f(x) = ${fTex}`)}.`,
        answer,
        answerValue: `${xa},${f(xa)}`,
        distractors: distractors.map((x) => ({ text: x.text, why: x.why })),
        solution,
        keyIdea: 'Solve $f\'(x) = 0$ for the stationary points, use the sign of $f\'\'(x)$ to classify them (negative = maximum, positive = minimum), then find $y$ from the original function.',
      };
    },
  },
];
