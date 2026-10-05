import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m, dm, num, paren, power, signed, sum } from '../../../lib/tex';

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
        { u: -gx, v: -gy, why: 'This is $-\\nabla f$ (the direction of steepest descent), not the gradient itself: every sign is flipped.' },
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
  // ---------------------------------------------------------------- one gradient descent step
  {
    id: 'gen-partial-derivatives-gd-step',
    subtopic: 'partial-derivatives',
    difficulty: 'exam',
    title: 'One step of gradient descent on a two-weight loss',
    generate(rng) {
      // Keep the loss a genuine bowl (c^2 < 4ab, so its only minimum is at (0, 0)) and make sure
      // neither partial derivative is zero at the starting point, so both weights move.
      let a: number, b: number, c: number, u: number, v: number;
      do {
        a = rng.int(1, 3);
        b = rng.int(1, 3);
        c = rng.intNonZero(-3, 3);
        u = rng.intNonZero(-3, 3);
        v = rng.intNonZero(-3, 3);
      } while (c * c >= 4 * a * b || 2 * a * u + c * v === 0 || c * u + 2 * b * v === 0);
      const etas: [Frac, string][] = [
        [new Frac(1, 10), '0.1'],
        [new Frac(1, 20), '0.05'],
        [new Frac(1, 5), '0.2'],
        [new Frac(1, 4), '0.25'],
        [new Frac(1, 2), '0.5'],
      ];
      const [eta, etaS] = rng.pick(etas);
      const P: Poly = [[a, 2, 0], [c, 1, 1], [b, 0, 2]];
      const g1 = ev(dx(P), u, v);
      const g2 = ev(dy(P), u, v);
      const step = (w: number, g: number, k: Frac = eta) => new Frac(w).sub(k.mul(g)).value();
      const n1 = step(u, g1);
      const n2 = step(v, g2);
      const lTex = polyTex(P, 'w_1', 'w_2');
      const d1Tex = polyTex(dx(P), 'w_1', 'w_2');
      const d2Tex = polyTex(dy(P), 'w_1', 'w_2');

      const pool: VecCand[] = [
        {
          u: new Frac(u).add(eta.mul(g1)).value(),
          v: new Frac(v).add(eta.mul(g2)).value(),
          why: `This **adds** ${m(`\\eta \\nabla L`)} instead of subtracting it. That is a step of gradient ascent, which increases the loss.`,
        },
        { u: u - g1, v: v - g2, why: `This forgets the learning rate and subtracts the whole gradient. Each component must be multiplied by ${m(`\\eta = ${etaS}`)} first.` },
        {
          u: step(u, 2 * a * u),
          v: step(v, 2 * b * v),
          why: `This leaves out the cross term ${m(polyTex([[c, 1, 1]], 'w_1', 'w_2'))} when differentiating. It contributes ${m(polyTex([[c, 0, 1]], 'w_1', 'w_2'))} to ${m('\\frac{\\partial L}{\\partial w_1}')} and ${m(polyTex([[c, 1, 0]], 'w_1', 'w_2'))} to ${m('\\frac{\\partial L}{\\partial w_2}')}.`,
        },
        {
          u: step(u, a * u + c * v),
          v: step(v, c * u + b * v),
          why: 'This forgets to bring the power down for the squared terms: the derivative of $w_1^2$ is $2w_1$, not $w_1$ (and likewise for $w_2^2$).',
        },
        {
          u: step(u, g2),
          v: step(v, g1),
          why: `This swaps the two gradient components, updating $w_1$ with ${m('\\frac{\\partial L}{\\partial w_2}')} and $w_2$ with ${m('\\frac{\\partial L}{\\partial w_1}')}. Each weight must use its own partial derivative.`,
        },
        {
          u: step(u, g1, eta.mul(2)),
          v: step(v, g2, eta.mul(2)),
          why: 'This applies the update with twice the learning rate (as if the step were taken twice with the same gradient). One step subtracts the gradient times $\\eta$ exactly once.',
        },
        {
          u: new Frac(0).sub(eta.mul(g1)).value(),
          v: new Frac(0).sub(eta.mul(g2)).value(),
          why: `This is only the change in the weights, ${m('-\\eta \\nabla L')}: it forgets to add that change to the current weights ${m(`(${u}, ${v})`)}.`,
        },
      ];
      const distractors = pickVecs([n1, n2], pool, (k) => ({
        u: n1,
        v: new Frac(v).add(new Frac(k)).sub(eta.mul(g2)).value(),
        why: `An arithmetic slip in the second weight: ${m(`${num(v)} - ${etaS} \\times ${paren(g2)} = ${num(n2)}`)}.`,
      }));

      const answer = vecTex(n1, n2);
      return {
        stem:
          `A model's loss is ${m(`L(w_1, w_2) = ${lTex}`)}. The current weights are ${m(`(w_1, w_2) = (${u}, ${v})`)} and the learning rate is ${m(`\\eta = ${etaS}`)}. ` +
          `What are the weights after **one** step of gradient descent, ${m(`\\mathbf{w} := \\mathbf{w} - \\eta \\nabla L`)}?`,
        answer,
        answerValue: vecKey(n1, n2),
        distractors,
        solution:
          `**Step 1: partial derivatives.**\n\n` +
          `- ${m(`\\frac{\\partial L}{\\partial w_1} = ${d1Tex}`)}\n` +
          `- ${m(`\\frac{\\partial L}{\\partial w_2} = ${d2Tex}`)}\n\n` +
          `**Step 2: gradient at** ${m(`(${u}, ${v})`)}:\n\n` +
          `- ${m(`\\frac{\\partial L}{\\partial w_1} = ${prodTerm(2 * a, u, true)}${prodTerm(c, v, false)} = ${num(g1)}`)}\n` +
          `- ${m(`\\frac{\\partial L}{\\partial w_2} = ${prodTerm(c, u, true)}${prodTerm(2 * b, v, false)} = ${num(g2)}`)}\n\n` +
          `**Step 3: update each weight** with ${m(`w_i := w_i - \\eta \\frac{\\partial L}{\\partial w_i}`)}:\n\n` +
          `- ${m(`w_1 = ${num(u)} - ${etaS} \\times ${paren(g1)} = ${num(n1)}`)}\n` +
          `- ${m(`w_2 = ${num(v)} - ${etaS} \\times ${paren(g2)} = ${num(n2)}`)}\n\nAnswer: ${answer}`,
        keyIdea: 'Gradient descent subtracts the learning rate times each partial derivative from its own weight: $w_i := w_i - \\eta \\frac{\\partial L}{\\partial w_i}$.',
      };
    },
  },
  // ---------------------------------------------------------------- mixed partial at a point
  {
    id: 'gen-partial-derivatives-mixed-partial',
    subtopic: 'partial-derivatives',
    difficulty: 'challenge',
    title: 'Evaluate a mixed second partial derivative at a point',
    generate(rng) {
      let mx = 1;
      let ny = 1;
      while (mx + ny < 3) {
        mx = rng.int(1, 3);
        ny = rng.int(1, 3);
      }
      const A = rng.intNonZero(-4, 4);
      const B = rng.intNonZero(-5, 5);
      const C = rng.intNonZero(-5, 5);
      const r = rng.int(2, 3);
      const s = rng.int(2, 3);
      const p = rng.intNonZero(-2, 2);
      const q = rng.intNonZero(-2, 2);
      const P: Poly = [[A, mx, ny], [B, r, 0], [C, 0, s]];
      const fx = dx(P);
      const fxy = dy(fx);
      const val = ev(fxy, p, q);
      const k = A * mx * ny;

      type Cand = { v: number; why: string };
      const pool: Cand[] = [
        { v: ev(fx, p, q), why: `This stops after the first derivative: it is ${m('\\frac{\\partial f}{\\partial x}')} at the point, not the mixed second derivative.` },
        { v: ev(dy(P), p, q), why: `This is ${m('\\frac{\\partial f}{\\partial y}')} at the point: only one differentiation was done.` },
        { v: ev(dx(fx), p, q), why: `This differentiates with respect to $x$ twice, giving ${m('\\frac{\\partial^2 f}{\\partial x^2}')} instead of differentiating with respect to $x$ and then $y$.` },
        { v: ev(dy(dy(P)), p, q), why: `This differentiates with respect to $y$ twice, giving ${m('\\frac{\\partial^2 f}{\\partial y^2}')} instead of the mixed derivative.` },
        { v: k * p ** (mx - 1) * q ** ny, why: 'This multiplies by the power of $y$ but forgets to reduce that power by one when differentiating with respect to $y$.' },
        { v: ev(fxy, q, p), why: `This substitutes the coordinates the wrong way round, using $x = ${q}$ and $y = ${p}$.` },
        {
          v: A * ny * p ** (mx - 1) * q ** (ny - 1),
          why: `This forgets to bring down the power of $x$ (a factor of ${m(num(mx))}) when differentiating ${m(polyTex([[A, mx, ny]]))} with respect to $x$.`,
        },
        {
          v: A * mx * p ** (mx - 1) * q ** (ny - 1),
          why: `This forgets to bring down the power of $y$ (a factor of ${m(num(ny))}) when differentiating with respect to $y$ in the second step.`,
        },
      ];
      const chosen: Cand[] = [];
      const seen = new Set<number>([val]);
      for (const cd of pool) {
        if (chosen.length === 3) break;
        if (seen.has(cd.v)) continue;
        seen.add(cd.v);
        chosen.push(cd);
      }
      if (chosen.length < 3 && !seen.has(-val)) {
        seen.add(-val);
        chosen.push({ v: -val, why: `This loses a minus sign at the final step: ${m(polyTex(fxy))} at the point is ${m(num(val))}, not ${m(num(-val))}. Track the sign of the coefficient, and of every negative coordinate (kept in brackets), when substituting.` });
      }
      for (let j = 1; chosen.length < 3; j++) {
        const alt = { v: val + j, why: `An arithmetic slip when substituting the point into ${m(polyTex(fxy))}: it evaluates to ${m(num(val))}.` };
        if (!seen.has(alt.v)) {
          seen.add(alt.v);
          chosen.push(alt);
        }
      }

      // substitution line for f_xy = k x^(mx-1) y^(ny-1)
      const factors = [num(k)];
      if (mx - 1 > 0) factors.push(mx - 1 === 1 ? paren(p) : `${paren(p)}^{${mx - 1}}`);
      if (ny - 1 > 0) factors.push(ny - 1 === 1 ? paren(q) : `${paren(q)}^{${ny - 1}}`);
      const subLine = factors.length > 1 ? `${factors.join(' \\times ')} = ${num(val)}` : `${num(val)}`;
      const answer = m(num(val));
      return {
        stem:
          `Let ${m(`f(x, y) = ${polyTex(P)}`)}. Find the value of the mixed partial derivative ${m('\\frac{\\partial^2 f}{\\partial y \\, \\partial x}')} ` +
          `(differentiate with respect to $x$, then with respect to $y$) at the point ${m(`(${p}, ${q})`)}.`,
        answer,
        answerValue: val,
        distractors: chosen.map((cd) => ({ text: m(num(cd.v)), value: cd.v, why: cd.why })),
        solution:
          `**Step 1: differentiate with respect to $x$** (treat $y$ as a constant; the term ${m(polyTex([[C, 0, s]]))} has no $x$, so it disappears):` +
          dm(`\\frac{\\partial f}{\\partial x} = ${polyTex(fx)}`) +
          `**Step 2: differentiate that with respect to $y$** (treat $x$ as a constant; the term with no $y$ disappears):` +
          dm(`\\frac{\\partial^2 f}{\\partial y \\, \\partial x} = ${polyTex(fxy)}`) +
          `**Step 3: substitute** $x = ${p}$, $y = ${q}$:` +
          dm(subLine) +
          `Notice that the terms involving only $x$ or only $y$ never affect a mixed partial derivative.\n\nAnswer: ${answer}`,
        keyIdea: 'A mixed partial derivative differentiates once with respect to each variable; any term containing only one of the variables vanishes.',
      };
    },
  },
];
