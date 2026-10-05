import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { dm, m, num, paren, signed, sqrtTex, sum, term } from '../../../lib/tex';
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
          .map((j) => (j === pos ? `k \\times ${paren(c)}` : `${paren(u[j])} \\times ${paren(v[j])}`))
          .join(' + ');
        const expanded = sum([0, 1, 2].map((j) => (j === pos ? [c, 'k'] : [u[j] * v[j], '']) as [number, string]));
        const collected = `${term(c, 'k', true)}${signed(S)} = 0`;
        const answer = kText(ans);
        const steps =
          'Perpendicular vectors have a dot product of **zero**, so multiply matching components, add, and set the total equal to 0.' +
          dm(`\\mathbf{u} \\cdot \\mathbf{v} = ${products} = 0`) +
          'Multiply out:' +
          dm(`${expanded} = 0`) +
          'Collect the numbers:' +
          dm(collected) +
          (c === 1
            ? `So ${m(`k = ${num(-S)}`)}.`
            : `So ${m(`${term(c, 'k', true)} = ${num(-S)}`)}, and dividing by ${m(num(c))} gives ${m(`k = ${ans.tex()}`)}.`) +
          `\n\nAnswer: ${answer}`;

        return {
          stem: `Find the value of $k$ for which $\\mathbf{u} = ${col(uShown)}$ and $\\mathbf{v} = ${col(v)}$ are perpendicular.`,
          answer,
          answerValue: ans.value(),
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution: steps,
          keyIdea: 'Two vectors are perpendicular exactly when their dot product is zero: set it equal to 0 and solve for the unknown.',
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
        const simplified = sqrtTex(S) !== `\\sqrt{${S}}`;
        const solution =
          `First build the vector ${m(combo)} component by component.` +
          dm(`${combo} = ${col(pa)} ${q < 0 ? '-' : '+'} ${col(qbAbs)} = ${col(w)}`) +
          'Then use Pythagoras: square each component, add, and take the square root.' +
          dm(
            `|${combo}| = \\sqrt{${w.map((x) => `${paren(x)}^2`).join(' + ')}} = \\sqrt{${w.map((x) => x * x).join(' + ')}} = \\sqrt{${S}}` +
              (simplified ? ` = ${sqrtTex(S)}` : ''),
          ) +
          `Answer: ${answer}`;

        return {
          stem: `Given $\\mathbf{a} = ${col(a)}$ and $\\mathbf{b} = ${col(b)}$, find $|${combo}|$.`,
          answer,
          answerValue: Math.sqrt(S),
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea: 'Combine the vectors component by component first, then find the magnitude with the square root of the sum of squares.',
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
        const solution =
          `Use ${m('\\cos\\theta = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|\\,|\\mathbf{b}|}')}.\n\n` +
          `1. Dot product: ${m(`\\mathbf{a} \\cdot \\mathbf{b} = ${products} = ${prodVals[0]}${signed(prodVals[1])}${signed(prodVals[2])} = ${d}`)}.\n` +
          `2. Magnitudes: ${m(`|\\mathbf{a}| = \\sqrt{${a.map((x) => x * x).join(' + ')}} = ${sqrtTex(A)}`)} and ${m(`|\\mathbf{b}| = \\sqrt{${b.map((x) => x * x).join(' + ')}} = ${sqrtTex(B)}`)}.\n` +
          `3. ${m(`\\cos\\theta = \\frac{${num(d)}}{${sqrtTex(A)} \\times ${sqrtTex(B)}} \\approx ${num(cosT, 4)}`)}.\n` +
          `4. ${m(`\\theta = \\cos^{-1}\\left(${num(cosT, 4)}\\right)`)}, which is about ${answer} (calculator in degree mode).\n\n` +
          (d < 0 ? 'The dot product is negative, so the angle is obtuse, as expected.' : 'The dot product is positive, so the angle is acute, as expected.') +
          `\n\nAnswer: ${answer}`;

        return {
          stem: `Find the angle between $\\mathbf{a} = ${col(a)}$ and $\\mathbf{b} = ${col(b)}$, in degrees to 1 decimal place.`,
          answer,
          answerValue: ansV,
          distractors: ds.map((x) => ({ text: x.text, value: x.value, why: x.why })),
          solution,
          keyIdea: 'The angle between two vectors comes from the dot product divided by the product of the magnitudes, then inverse cosine.',
        };
      }
    },
  },
];
