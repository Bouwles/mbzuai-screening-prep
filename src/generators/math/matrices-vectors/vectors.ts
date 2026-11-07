import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps } from '../../../lib/explanation';
import { Frac } from '../../../lib/frac';
import { m, num, paren, signed, sqrtTex, sum, term } from '../../../lib/tex';
import { dot, round } from '../../../lib/mathx';

/** Column vector (pmatrix) from numbers or LaTeX strings. */
const col = (xs: (number | string)[]) =>
  `\\begin{pmatrix} ${xs.map((x) => (typeof x === 'number' ? num(x) : x)).join(' \\\\ ')} \\end{pmatrix}`;

interface Cand {
  text: string;
  value: number;
  why: string;
}

/** First `n` candidates that differ from the answer and from each other, by value AND by text. */
function pickDistinct(answerText: string, answerValue: number, pool: Cand[], n = 3, tol = 1e-9): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === n) break;
    if (!Number.isFinite(c.value)) continue;
    if (Math.abs(c.value - answerValue) <= tol || c.text === answerText) continue;
    if (out.some((o) => Math.abs(o.value - c.value) <= tol || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

const vec3 = (rng: Rng, lo: number, hi: number, nonZero: boolean) =>
  [0, 1, 2].map(() => (nonZero ? rng.intNonZero(lo, hi) : rng.int(lo, hi)));

export const generators: Generator[] = [
  // ---------------------------------------------------------------- perpendicular: find k
  {
    id: 'gen-vectors-perpendicular-k',
    subtopic: 'vectors',
    difficulty: 'exam',
    title: 'Find k so that two vectors are perpendicular',
    generate(rng) {
      for (;;) {
        const pos = rng.int(0, 2);
        const u = vec3(rng, -5, 5, true);
        const v = vec3(rng, -5, 5, true);
        const others = [0, 1, 2].filter((j) => j !== pos);
        const [j1, j2] = others;
        const S = u[j1] * v[j1] + u[j2] * v[j2];
        if (S === 0) continue;
        const c = v[pos];
        const ans = new Frac(-S, c);
        if (ans.d > 5 || Math.abs(ans.value()) > 20) continue;

        const kText = (f: Frac) => m(`k = ${f.tex()}`);
        const pool: { f: Frac; why: string }[] = [
          {
            f: new Frac(S, c),
            why: `This has the sign wrong. Moving ${m(num(S))} to the other side of ${m(`${term(c, 'k', true)}${signed(S)} = 0`)} changes its sign, giving ${m(`${term(c, 'k', true)} = ${num(-S)}`)}; this answer comes from ${m(`${term(c, 'k', true)} = ${num(S)}`)} instead.`,
          },
          {
            f: new Frac(-u[j1] * v[j1], c),
            why: `This only uses one of the two number products (${m(`${paren(u[j1])} \\times ${paren(v[j1])}`)}) and forgets ${m(`${paren(u[j2])} \\times ${paren(v[j2])}`)}. The dot product adds **all three** component products.`,
          },
          {
            f: new Frac(1 - S, c),
            why: `This sets the dot product equal to 1 instead of 0. Perpendicular vectors have dot product **zero**.`,
          },
          {
            f: new Frac(-S * c, 1),
            why: `This multiplies by ${m(num(c))} instead of dividing by it in the last step.`,
          },
          {
            f: new Frac(-c, S),
            why: `This turns the final fraction upside down: from ${m(`${term(c, 'k', true)} = ${num(-S)}`)} you divide ${m(num(-S))} by ${m(num(c))}, not the other way round.`,
          },
          {
            f: new Frac(-u[j2] * v[j2], c),
            why: `This only uses one of the two number products (${m(`${paren(u[j2])} \\times ${paren(v[j2])}`)}) and forgets ${m(`${paren(u[j1])} \\times ${paren(v[j1])}`)}.`,
          },
        ];
        const ds = pickDistinct(
          kText(ans),
          ans.value(),
          pool.map((p) => ({ text: kText(p.f), value: p.f.value(), why: p.why })),
        );
        if (ds.length < 3) continue;

        const uShown = u.map((x, j) => (j === pos ? 'k' : x));
        const products = [0, 1, 2]
          .map((j) => (j === pos ? `k \\times ${paren(c)} = ${term(c, 'k', true)}` : `${paren(u[j])} \\times ${paren(v[j])} = ${num(u[j] * v[j])}`))
          .join(',\\quad ');
        const expanded = sum([0, 1, 2].map((j) => (j === pos ? [c, 'k'] : [u[j] * v[j], '']) as [number, string]));
        const kTerm = term(c, 'k', true);
        const answer = kText(ans);

        return {
          stem: `Find the value of $k$ for which $\\mathbf{u} = ${col(uShown)}$ and $\\mathbf{v} = ${col(v)}$ are perpendicular.`,
          answer,
          answerValue: ans.value(),
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          asking: 'What value of $k$ puts these two vectors at right angles?',
          solution: steps(
            '**Perpendicular** means at right angles. Two vectors are perpendicular exactly when their **dot product** is 0. The dot product multiplies matching components (the numbers in the same position) and adds the results.',
            `Multiply each matching pair: ${m(products)}.`,
            `Add them and set the total to 0: ${m(`${expanded} = 0`)}.`,
            `Collect the plain numbers: ${m(`${num(u[j1] * v[j1])}${signed(u[j2] * v[j2])} = ${num(S)}`)}. That leaves ${m(`${kTerm}${signed(S)} = 0`)}.`,
            `${S > 0 ? `Take ${m(num(S))} from` : `Add ${m(num(-S))} to`} both sides to get ${m(`${kTerm} = ${num(-S)}`)}.` +
              (c === 1 ? '' : ` Divide both sides by ${m(num(c))} to get ${m('k')} on its own: ${m(`k = ${ans.tex()}`)}.`),
          ),
          conclusion: `With ${answer} the dot product is 0, so the vectors are perpendicular.`,
          keyIdea: 'When you see perpendicular with an unknown: write the dot product with the unknown in it, set it equal to 0 and solve the equation.',
        };
      }
    },
  },
  // ---------------------------------------------------------------- magnitude of a combination
  {
    id: 'gen-vectors-magnitude-combination',
    subtopic: 'vectors',
    difficulty: 'foundation',
    title: 'Magnitude of a combination of two vectors',
    generate(rng) {
      for (;;) {
        const a = vec3(rng, -4, 4, false);
        const b = vec3(rng, -4, 4, false);
        if (a.every((x) => x === 0) || b.every((x) => x === 0)) continue;
        const p = rng.pick([2, 3]);
        const q = rng.pick([1, 2, 3]) * rng.pick([1, -1]);
        const w = a.map((x, i) => p * x + q * b[i]);
        if (w.some((x) => x === 0)) continue;
        const S = dot(w, w);
        if (S > 200) continue;
        const wFlip = a.map((x, i) => p * x - q * b[i]);
        const Sflip = dot(wFlip, wFlip);
        const wNoP = a.map((x, i) => x + q * b[i]);
        const SnoP = dot(wNoP, wNoP);
        const compSum = Math.abs(w[0] + w[1] + w[2]);

        const combo = `${term(p, '\\mathbf{a}', true)}${term(q, '\\mathbf{b}', false)}`;
        const flipCombo = `${term(p, '\\mathbf{a}', true)}${term(-q, '\\mathbf{b}', false)}`;
        const noPCombo = `\\mathbf{a}${term(q, '\\mathbf{b}', false)}`;
        const answer = m(sqrtTex(S));
        const pool: Cand[] = [
          { text: m(num(S)), value: S, why: `This is ${m(`|${combo}|^2 = ${S}`)}: the square root at the end was forgotten.` },
          {
            text: m(sqrtTex(Sflip)),
            value: Math.sqrt(Sflip),
            why: `This is ${m(`|${flipCombo}|`)}: the sign in front of ${m('\\mathbf{b}')} was flipped when combining the vectors.`,
          },
          {
            text: m(num(compSum)),
            value: compSum,
            why: `This just adds the components of ${m(combo)} (${m(`${w[0]}${signed(w[1])}${signed(w[2])} = ${w[0] + w[1] + w[2]}`)}${w[0] + w[1] + w[2] < 0 ? ', then drops the minus sign' : ''}) instead of squaring them, adding and taking the square root.`,
          },
          {
            text: m(sqrtTex(SnoP)),
            value: Math.sqrt(SnoP),
            why: `This is ${m(`|${noPCombo}|`)}: ${m('\\mathbf{a}')} was not multiplied by ${m(num(p))}.`,
          },
        ].filter((c) => c.value > 0);
        const ds = pickDistinct(answer, Math.sqrt(S), pool);
        if (ds.length < 3) continue;

        const pa = a.map((x) => p * x);
        const qbAbs = b.map((x) => Math.abs(q) * x);
        const op = q < 0 ? '-' : '+';
        const qbName = term(Math.abs(q), '\\mathbf{b}', true);
        // A zero component needs brackets, so that "+ 0" never appears in the working.
        const working = col(pa.map((x, i) => `${num(x)} ${op} ${qbAbs[i] === 0 ? '(0)' : paren(qbAbs[i])}`));
        // How sqrt(S) simplifies: 12 is 4 x 3, so it becomes 2 sqrt(3).
        let outer = 1;
        let inner = S;
        for (let f = 2; f * f <= inner; f++) {
          while (inner % (f * f) === 0) {
            inner /= f * f;
            outer *= f;
          }
        }
        const simplify = outer === 1 ? '' : inner === 1 ? ` = ${sqrtTex(S)}` : ` = \\sqrt{${outer * outer} \\times ${inner}} = ${sqrtTex(S)}`;

        return {
          stem: `Given $\\mathbf{a} = ${col(a)}$ and $\\mathbf{b} = ${col(b)}$, find $|${combo}|$.`,
          answer,
          answerValue: Math.sqrt(S),
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          asking: `How long is the vector ${m(combo)}?`,
          solution: steps(
            `The bars in ${m(`|${combo}|`)} mean **magnitude**, which is the length of a vector. So first build the single vector ${m(combo)}, then find its length.`,
            `Multiplying a vector by a number multiplies every component: ${m(`${term(p, '\\mathbf{a}', true)} = ${col(a.map((x) => `${p} \\times ${paren(x)}`))} = ${col(pa)}`)}` +
              (Math.abs(q) === 1 ? `, and ${m('\\mathbf{b}')} stays as it is.` : ` and ${m(`${qbName} = ${col(b.map((x) => `${Math.abs(q)} \\times ${paren(x)}`))} = ${col(qbAbs)}`)}.`),
            `${q < 0 ? 'Take away' : 'Add'} matching components:\n\n$$${combo} = ${working} = ${col(w)}$$`,
            `Now find the length with Pythagoras' theorem: square each component, add the squares, then take the square root.\n\n$$|${combo}| = \\sqrt{${w.map((x) => `${paren(x)}^{2}`).join(' + ')}} = \\sqrt{${w.map((x) => x * x).join(' + ')}} = \\sqrt{${S}}${simplify}$$`,
          ),
          conclusion: `The squares of the components add to ${m(num(S))}, so ${m(`|${combo}|`)} is ${answer}.`,
          keyIdea: 'Combine the vectors first, one component at a time. Then find the magnitude: square each component, add the squares and take the square root. Never find the two magnitudes separately and add them.',
        };
      }
    },
  },
  // ---------------------------------------------------------------- angle between two vectors
  {
    id: 'gen-vectors-angle',
    subtopic: 'vectors',
    difficulty: 'exam',
    title: 'Angle between two vectors (degrees, 1 d.p.)',
    generate(rng) {
      const deg = (rad: number) => (rad * 180) / Math.PI;
      const fmt1 = (x: number) => round(x, 1).toFixed(1);
      for (;;) {
        const a = vec3(rng, -3, 4, true);
        const b = vec3(rng, -3, 4, true);
        const d = dot(a, b);
        if (d === 0) continue;
        const A = dot(a, a);
        const B = dot(b, b);
        const cosT = d / Math.sqrt(A * B);
        if (Math.abs(cosT) > 0.98) continue; // avoid (nearly) parallel vectors
        const theta = deg(Math.acos(cosT));
        // keep away from a rounding boundary so every calculator agrees
        const frac10 = theta * 10 - Math.floor(theta * 10);
        if (Math.abs(frac10 - 0.5) < 0.2) continue;
        const ansV = round(theta, 1);
        const answer = m(`${fmt1(theta)}^\\circ`);

        const raw: { v: number; why: string }[] = [
          {
            v: 180 - theta,
            why: `This gets the sign of the dot product wrong (using ${m(`\\cos\\theta \\approx ${num(-cosT, 4)}`)}), giving the supplementary angle ${m('180^\\circ - \\theta')}. ${d < 0 ? 'A negative dot product means the angle is obtuse.' : 'A positive dot product means the angle is acute.'}`,
          },
          {
            v: 90 - theta,
            why: `This uses ${m('\\sin^{-1}')} instead of ${m('\\cos^{-1}')} on the same fraction. The dot product formula involves the **cosine** of the angle.`,
          },
          {
            v: deg(Math.acos(d / (A * B))),
            why: `This forgets the square roots on the magnitudes, dividing by ${m(`|\\mathbf{a}|^2 |\\mathbf{b}|^2 = ${A} \\times ${B}`)} instead of ${m(`|\\mathbf{a}|\\,|\\mathbf{b}| = \\sqrt{${A}} \\times \\sqrt{${B}}`)}.`,
          },
        ];
        const sumMag = Math.sqrt(A) + Math.sqrt(B);
        if (Math.abs(d) <= sumMag)
          raw.push({
            v: deg(Math.acos(d / sumMag)),
            why: `This divides by ${m('|\\mathbf{a}| + |\\mathbf{b}|')} instead of ${m('|\\mathbf{a}| \\times |\\mathbf{b}|')}. The magnitudes must be **multiplied**.`,
          });
        const pool: Cand[] = raw
          .filter((r) => Math.abs(r.v) >= 0.5)
          .map((r) => ({ text: m(`${fmt1(r.v)}^\\circ`), value: round(r.v, 1), why: r.why }));
        // options must be clearly different: at least 1 degree apart
        const ds = pickDistinct(answer, ansV, pool, 3, 0.95);
        if (ds.length < 3) continue;

        const products = a.map((x, i) => `${paren(x)} \\times ${paren(b[i])}`).join(' + ');
        const prodVals = a.map((x, i) => x * b[i]);
        // A length written so a calculator can take it: "sqrt(14)", or "3" when it is a whole number.
        const root = (n: number) => (Number.isInteger(Math.sqrt(n)) ? num(Math.sqrt(n)) : `\\sqrt{${n}}`);
        const lengthOf = (name: string, xs: number[], n: number) =>
          m(`|\\mathbf{${name}}| = \\sqrt{${xs.map((x) => x * x).join(' + ')}} = \\sqrt{${n}}${root(n) === `\\sqrt{${n}}` ? '' : ` = ${root(n)}`}`);

        return {
          stem: `Find the angle between $\\mathbf{a} = ${col(a)}$ and $\\mathbf{b} = ${col(b)}$, in degrees to 1 decimal place.`,
          answer,
          answerValue: ansV,
          distractors: ds.map((x) => ({ text: x.text, value: x.value, why: x.why })),
          asking: 'What is the angle between these two vectors, in degrees?',
          solution: steps(
            `The **dot product** links two vectors to the angle ${m('\\theta')} between them: ${m('\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}')}. Here ${m('\\mathbf{a} \\cdot \\mathbf{b}')} means multiply matching components and add, and ${m('|\\mathbf{a}|')} means the length of ${m('\\mathbf{a}')}.`,
            `Find the dot product: ${m(`${products} = ${prodVals[0]}${signed(prodVals[1])}${signed(prodVals[2])} = ${d}`)}.`,
            `Find each length by squaring the components, adding and taking the square root: ${lengthOf('a', a, A)} and ${lengthOf('b', b, B)}.`,
            `Substitute into the formula: ${m(`\\cos\\theta = \\frac{${num(d)}}{${root(A)} \\times ${root(B)}} \\approx ${num(cosT, 4)}`)}.`,
            `Undo the cosine with ${m('\\cos^{-1}')} on a calculator in degree mode, using the full value rather than the rounded one: ${m(`\\theta \\approx ${fmt1(theta)}^\\circ`)}.`,
          ),
          conclusion: `The dot product is ${d < 0 ? 'negative' : 'positive'}, which fits an angle ${d < 0 ? 'above' : 'below'} ${m('90^\\circ')}, and the calculator gives ${answer}.`,
          keyIdea: 'Angle between vectors: find the dot product and both lengths, then $\\cos\\theta$ = dot product $\\div$ (length $\\times$ length), then $\\cos^{-1}$. A negative dot product means an angle above $90^\\circ$.',
        };
      }
    },
  },
];
