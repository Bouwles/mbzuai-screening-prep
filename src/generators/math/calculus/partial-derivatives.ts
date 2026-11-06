import type { Generator } from '../../../types';
import { m, num, paren, power, signed, sum } from '../../../lib/tex';

// A polynomial in x and y as terms [coefficient, power of x, power of y].
type Poly = [number, number, number][];
const ev = (p: Poly, x: number, y: number): number => p.reduce((s, [c, a, b]) => s + c * x ** a * y ** b, 0);
const dx = (p: Poly): Poly => p.filter(([c, a]) => a > 0 && c !== 0).map(([c, a, b]) => [c * a, a - 1, b] as [number, number, number]);
const dy = (p: Poly): Poly => p.filter(([c, , b]) => b > 0 && c !== 0).map(([c, a, b]) => [c * b, a, b - 1] as [number, number, number]);
const polyTex = (p: Poly, vx = 'x', vy = 'y'): string => sum(p.map(([c, a, b]) => [c, power(vx, a) + power(vy, b)] as [number, string]));

/** "c \times v" as a term of a sum, with clean signs: first -> "3 \times 2", later -> " - 3 \times (-2)". */
function prodTerm(c: number, v: number, first: boolean): string {
  const body = (k: number) => `${num(k)} \\times ${paren(v)}`;
  if (first) return body(c);
  return c < 0 ? ` - ${body(-c)}` : ` + ${body(c)}`;
}

const vecTex = (u: number, v: number) => m(`\\left(${num(u)}, ${num(v)}\\right)`);
const vecKey = (u: number, v: number) => `${num(u)},${num(v)}`;

interface VecCand {
  u: number;
  v: number;
  why: string;
}

/** Pick 3 distractor vectors that differ from the answer and from each other (by value and text). */
function pickVecs(ans: [number, number], pool: VecCand[], fallback: (k: number) => VecCand) {
  const out: VecCand[] = [];
  const seen = new Set<string>([vecKey(...ans)]);
  const tryAdd = (c: VecCand) => {
    if (out.length >= 3) return;
    const k = vecKey(c.u, c.v);
    if (seen.has(k)) return;
    seen.add(k);
    out.push(c);
  };
  pool.forEach(tryAdd);
  for (let k = 1; out.length < 3; k++) tryAdd(fallback(k));
  return out.map((c) => ({ text: vecTex(c.u, c.v), value: vecKey(c.u, c.v), why: c.why }));
}

export const generators: Generator[] = [
  // ---------------------------------------------------------------- gradient at a point
  {
    id: 'gen-partial-derivatives-gradient-at-point',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    title: 'Evaluate the gradient of a quadratic function of two variables at a point',
    generate(rng) {
      // Redraw in the rare case that the point is stationary (gradient (0, 0)): there the
      // usual mistakes collapse onto the answer and only weak distractors would be left.
      let a: number, b: number, c: number, e: number, p: number, q: number, P: Poly, gx: number, gy: number;
      do {
        a = rng.intNonZero(-4, 4);
        b = rng.intNonZero(-4, 4);
        c = rng.intNonZero(-3, 3);
        e = rng.int(-5, 5);
        p = rng.intNonZero(-3, 3);
        q = rng.intNonZero(-3, 3);
        P = [[a, 2, 0], [b, 1, 1], [c, 0, 2], [e, 0, 1]];
        gx = ev(dx(P), p, q);
        gy = ev(dy(P), p, q);
      } while (gx === 0 && gy === 0);
      const fTex = polyTex(P);
      const fxTex = polyTex(dx(P));
      const fyTex = polyTex(dy(P));

      const pool: VecCand[] = [
        { u: gy, v: gx, why: 'The right numbers in the wrong order: the first component of $\\nabla f$ is always $\\frac{\\partial f}{\\partial x}$.' },
        {
          u: 2 * a * p,
          v: 2 * c * q + e,
          why: `This ignores the cross term ${m(polyTex([[b, 1, 1]]))} in both partial derivatives. With the other variable held constant it still contributes ${m(polyTex([[b, 0, 1]]))} to $\\frac{\\partial f}{\\partial x}$ and ${m(polyTex([[b, 1, 0]]))} to $\\frac{\\partial f}{\\partial y}$.`,
        },
        {
          u: a * p + b * q,
          v: b * p + c * q + e,
          why: 'This forgets to bring the power down when differentiating the squared terms: the derivative of $x^2$ is $2x$, not $x$ (and likewise for $y^2$).',
        },
        {
          u: 2 * a * q + b * p,
          v: b * q + 2 * c * p + e,
          why: `This substitutes the coordinates the wrong way round, using $x = ${q}$ and $y = ${p}$. The point ${m(`(${p}, ${q})`)} means $x = ${p}$, $y = ${q}$.`,
        },
        {
          u: 2 * a * p + b,
          v: b + 2 * c * q + e,
          why: `This drops the other variable from the cross term ${m(polyTex([[b, 1, 1]]))}, so it contributes just ${m(num(b))} to each partial derivative. With $y$ held constant its $x$-derivative is ${m(polyTex([[b, 0, 1]]))}, and with $x$ held constant its $y$-derivative is ${m(polyTex([[b, 1, 0]]))}.`,
        },
        { u: -gx, v: -gy, why: 'This has every sign flipped. Check the sign of each term when you differentiate and when you substitute.' },
      ];
      const distractors = pickVecs([gx, gy], pool, (k) => ({
        u: gx + k,
        v: gy,
        why: `An arithmetic slip in $\\frac{\\partial f}{\\partial x}$: substituting into ${m(fxTex)} correctly gives ${m(num(gx))}, not ${m(num(gx + k))}.`,
      }));

      const fyNumbers = prodTerm(b, p, true) + prodTerm(2 * c, q, false) + (e !== 0 ? signed(e) : '');
      const answer = vecTex(gx, gy);
      return {
        stem: `Let ${m(`f(x, y) = ${fTex}`)}. What is the gradient $\\nabla f$ at the point ${m(`(${p}, ${q})`)}?`,
        answer,
        answerValue: vecKey(gx, gy),
        distractors,
        solution:
          `**Step 1: partial derivatives.** For $\\frac{\\partial f}{\\partial x}$ treat $y$ as a constant; for $\\frac{\\partial f}{\\partial y}$ treat $x$ as a constant.\n\n` +
          `- ${m(`\\frac{\\partial f}{\\partial x} = ${fxTex}`)}\n` +
          `- ${m(`\\frac{\\partial f}{\\partial y} = ${fyTex}`)}\n\n` +
          `**Step 2: substitute** $x = ${p}$, $y = ${q}$.\n\n` +
          `- ${m(`\\frac{\\partial f}{\\partial x} = ${prodTerm(2 * a, p, true)}${prodTerm(b, q, false)} = ${num(gx)}`)}\n` +
          `- ${m(`\\frac{\\partial f}{\\partial y} = ${fyNumbers} = ${num(gy)}`)}\n\n` +
          `So ${m(`\\nabla f(${p}, ${q}) = \\left(${num(gx)}, ${num(gy)}\\right)`)}.\n\nAnswer: ${answer}`,
        keyIdea: 'The gradient is the vector of partial derivatives $\\left(f_x, f_y\\right)$: differentiate each way holding the other variable constant, then substitute the point.',
      };
    },
  },
  // ---------------------------------------------------------------- squared-error loss
  {
    id: 'gen-partial-derivatives-squared-error',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    title: 'Partial derivative of a simple squared-error loss',
    generate(rng) {
      for (;;) {
        const x = rng.pick([-3, -2, 2, 3, 4]);
        const y = rng.intNonZero(-6, 9);
        const w = rng.intNonZero(-3, 3);
        const b = rng.intNonZero(-4, 4);
        const e = w * x + b - y;
        if (e === 0) continue;
        const byW = rng.bool();
        const ans = byW ? 2 * e * x : 2 * e;
        const other = byW ? 2 * e : 2 * e * x;
        const v = byW ? 'w' : 'b';
        const otherV = byW ? 'b' : 'w';

        const pool: { n: number; why: string }[] = [
          { n: other, why: `This is ${m(`\\frac{\\partial L}{\\partial ${otherV}}`)}, the partial derivative with respect to the other parameter.` },
          { n: byW ? e * x : e, why: 'This forgets the factor 2 that the power rule brings down from the square.' },
          { n: -ans, why: `This has the sign wrong. The error is ${m('wx + b - y')}, which is ${m(num(e))} here, so keep its sign.` },
          { n: e * e, why: 'This is the value of the loss itself, not its derivative.' },
        ];
        const seen = new Set<number>([ans]);
        const chosen = pool.filter((c) => (seen.has(c.n) ? false : (seen.add(c.n), true))).slice(0, 3);
        if (chosen.length < 3) continue;

        const answer = m(num(ans));
        const inner = byW ? `the derivative of the inside with respect to ${m('w')} is ${m('x')}` : `the derivative of the inside with respect to ${m('b')} is ${m('1')}`;
        const formula = byW ? '2(wx + b - y)x' : '2(wx + b - y)';
        const working = byW ? `2 \\times ${paren(e)} \\times ${paren(x)}` : `2 \\times ${paren(e)}`;
        return {
          stem: `For the squared-error loss ${m('L = (wx + b - y)^{2}')} with ${m(`x = ${x}`)}, ${m(`y = ${y}`)}, ${m(`w = ${w}`)} and ${m(`b = ${b}`)}, find ${m(`\\frac{\\partial L}{\\partial ${v}}`)}.`,
          answer,
          answerValue: ans,
          distractors: chosen.map((c) => ({ text: m(num(c.n)), value: c.n, why: c.why })),
          solution:
            `Use the chain rule, treating every letter except ${m(v)} as a constant. Since ${inner}:\n\n` +
            `$$\\frac{\\partial L}{\\partial ${v}} = ${formula}$$\n\n` +
            `The error is ${m(`wx + b - y = ${paren(w)} \\times ${paren(x)}${signed(b)}${signed(-y)} = ${num(e)}`)}.\n\n` +
            `So ${m(`\\frac{\\partial L}{\\partial ${v}} = ${working} = ${num(ans)}`)}.\n\nAnswer: ${answer}`,
          keyIdea: 'For $L = (wx + b - y)^{2}$, the chain rule gives $\\frac{\\partial L}{\\partial w} = 2(\\text{error}) \\times x$ and $\\frac{\\partial L}{\\partial b} = 2(\\text{error})$.',
        };
      }
    },
  },
];
