import type { Generator } from '../../../types';
import { Frac, gcd } from '../../../lib/frac';
import { dm, m, paren, sum, term } from '../../../lib/tex';

type Unit = 'deg' | 'rad';
type Fn = 'sin' | 'cos' | 'tan';

/** Angle given in whole degrees -> LaTeX in degrees or as a multiple of pi. */
function angTex(d: number, unit: Unit): string {
  if (unit === 'deg') return `${d}^\\circ`;
  const f = new Frac(d, 180);
  if (f.n === 0) return '0';
  const sign = f.n < 0 ? '-' : '';
  const a = Math.abs(f.n);
  const top = a === 1 ? '\\pi' : `${a}\\pi`;
  return f.d === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${f.d}}`;
}

const QUAD_NAME = ['', 'first', 'second', 'third', 'fourth'];
/** Quadrants where each function is positive (CAST). */
const POS: Record<Fn, [number, number]> = { sin: [1, 2], cos: [1, 4], tan: [1, 3] };
const NEG: Record<Fn, [number, number]> = { sin: [3, 4], cos: [2, 3], tan: [2, 4] };

/** Angle in quadrant q with reference angle a (degrees). */
const inQuad = (q: number, a: number) => [0, a, 180 - a, 180 + a, 360 - a][q];
/** "x = 180° - 30° = 150°" style working for quadrant q. */
function quadWork(q: number, a: number, unit: Unit): string {
  const A = angTex(a, unit);
  const v = angTex(inQuad(q, a), unit);
  if (q === 1) return `$x = ${A}$`;
  if (q === 2) return `$x = ${angTex(180, unit)} - ${A} = ${v}$`;
  if (q === 3) return `$x = ${angTex(180, unit)} + ${A} = ${v}$`;
  return `$x = ${angTex(360, unit)} - ${A} = ${v}$`;
}

function setText(sols: number[], unit: Unit): string {
  const s = [...sols].sort((p, q) => p - q);
  if (s.length === 1) return `$x = ${angTex(s[0], unit)}$ only`;
  return s.map((d) => `$x = ${angTex(d, unit)}$`).join(' or ');
}
const setValue = (sols: number[]) => [...sols].sort((p, q) => p - q).join(',');

interface BasicVal {
  a: string; // coefficient in front of the function ('' for none)
  b: string; // the constant
  v: number; // value of f(x) = b / a
  vTex: string;
}
const SINCOS_VALS: BasicVal[] = [
  { a: '2', b: '1', v: 1 / 2, vTex: '\\frac{1}{2}' },
  { a: '2', b: '\\sqrt{3}', v: Math.sqrt(3) / 2, vTex: '\\frac{\\sqrt{3}}{2}' },
  { a: '\\sqrt{2}', b: '1', v: 1 / Math.sqrt(2), vTex: '\\frac{1}{\\sqrt{2}}' },
];
const TAN_VALS: BasicVal[] = [
  { a: '', b: '1', v: 1, vTex: '1' },
  { a: '', b: '\\sqrt{3}', v: Math.sqrt(3), vTex: '\\sqrt{3}' },
  { a: '\\sqrt{3}', b: '1', v: 1 / Math.sqrt(3), vTex: '\\frac{1}{\\sqrt{3}}' },
];

const PY_TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];
const QUAD_RANGE = ['', '0^\\circ < \\theta < 90^\\circ', '90^\\circ < \\theta < 180^\\circ', '180^\\circ < \\theta < 270^\\circ', '270^\\circ < \\theta < 360^\\circ'];

// exact angle tables (degrees) for the system generator
const ASIN_DEG = new Map<number, number>([[-1, -90], [-0.5, -30], [0, 0], [0.5, 30], [1, 90]]);
const ACOS_DEG = new Map<number, number>([[-1, 180], [-0.5, 120], [0, 90], [0.5, 60], [1, 0]]);
const ATAN_DEG = new Map<number, number>([[-1, -45], [0, 0], [1, 45]]);

export const generators: Generator[] = [
  // ------------------------------------------------------------------ 1. basic equation in an interval
  {
    id: 'gen-trig-equations-solve-basic',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    title: 'Solve a basic trig equation in one full turn',
    generate(rng) {
      const fn = rng.pick(['sin', 'cos', 'tan'] as const);
      const val = rng.pick(fn === 'tan' ? TAN_VALS : SINCOS_VALS);
      const neg = rng.bool();
      const form = rng.pick(['eq', 'zero'] as const);
      const unit = rng.pick(['deg', 'rad'] as const);
      const F = `\\${fn} x`;
      const lhs = `${val.a}${F}`;
      const eqTex = form === 'eq' ? `${lhs} = ${neg ? '-' : ''}${val.b}` : `${lhs} ${neg ? '+' : '-'} ${val.b} = 0`;
      const kTex = `${neg ? '-' : ''}${val.vTex}`;
      const toDeg = (r: number) => Math.round((r * 180) / Math.PI);
      const ref = fn === 'sin' ? toDeg(Math.asin(val.v)) : fn === 'cos' ? toDeg(Math.acos(val.v)) : toDeg(Math.atan(val.v));
      const quads = neg ? NEG[fn] : POS[fn];
      const sols = quads.map((q) => inQuad(q, ref));
      const interval = unit === 'deg' ? '$0^\\circ \\le x < 360^\\circ$' : '$0 \\le x < 2\\pi$';
      const answer = setText(sols, unit);
      const sgnWord = neg ? 'negative' : 'positive';

      // calculator value moved into [0, 360)
      const calc = fn === 'cos' ? (neg ? 180 - ref : ref) : neg ? 360 - ref : ref;
      const calcRaw = fn === 'cos' ? calc : neg ? -ref : ref;
      const pool: { sols: number[]; why: string }[] = [];
      const opp = neg ? POS[fn] : NEG[fn];
      pool.push({
        sols: opp.map((q) => inQuad(q, ref)),
        why: neg
          ? `This ignores the minus sign: these angles solve ${m(`${F} = ${val.vTex}`)}, but here ${m(`${F} = ${kTex}`)}, so ${m(`\\${fn} x`)} must be **negative**.`
          : form === 'zero'
            ? `A sign slip when rearranging: these angles solve ${m(`${F} = -${val.vTex}`)}. Moving ${m(`-${val.b}`)} across the equals sign makes it positive.`
            : `These are the angles in the quadrants where ${m(`\\${fn} x`)} is **negative**, but here ${m(`${F} = ${kTex}`)}, which is positive (check the CAST diagram).`,
      });
      pool.push({
        sols: [calc],
        why:
          `This is only the calculator value` +
          (calcRaw !== calc ? ` (${m(angTex(calcRaw, unit))}, moved into the interval)` : '') +
          `. ${m(`\\${fn} x`)} is ${sgnWord} in **two** quadrants, so there is a second solution in the interval.`,
      });
      const fns: Fn[] = ['sin', 'cos', 'tan'];
      const others: { sols: number[]; why: string }[] = [];
      for (const g of fns) {
        if (g === fn) continue;
        for (const [qs, w] of [
          [POS[g], 'positive'],
          [NEG[g], 'negative'],
        ] as const) {
          others.push({
            sols: qs.map((q) => inQuad(q, ref)),
            why: `This puts ${m('x')} in the ${QUAD_NAME[qs[0]]} and ${QUAD_NAME[qs[1]]} quadrants, which is where ${m(`\\${g} x`)} is ${w}. For ${m(`\\${fn} x`)} being ${sgnWord} you need the ${QUAD_NAME[quads[0]]} and ${QUAD_NAME[quads[1]]} quadrants.`,
          });
        }
      }
      pool.push(...rng.shuffle(others));
      const ansVal = setValue(sols);
      const distractors: { text: string; value: string; why: string }[] = [];
      for (const d of pool) {
        if (distractors.length === 3) break;
        const text = setText(d.sols, unit);
        const value = setValue(d.sols);
        if (value === ansVal || text === answer || distractors.some((x) => x.value === value || x.text === text)) continue;
        distractors.push({ text, value, why: d.why });
      }

      const refFact =
        fn === 'tan'
          ? `${m(`\\tan ${angTex(ref, unit)} = ${val.vTex}`)}`
          : `${m(`\\${fn} ${angTex(ref, unit)} = ${val.vTex}`)}`;
      const steps: string[] = [];
      if (form === 'zero' || val.a !== '') {
        if (form === 'zero') steps.push(`Rearrange: ${m(`${lhs} = ${neg ? '-' : ''}${val.b}`)}.`);
        if (val.a !== '') steps.push(`Divide by ${m(val.a)}: ${m(`${F} = ${kTex}`)}.`);
      }
      steps.push(`Reference (acute) angle: ${refFact}, so the reference angle is ${m(angTex(ref, unit))}.`);
      steps.push(
        `${m(`\\${fn} x`)} is **${sgnWord}**, so ${m('x')} lies in the ${QUAD_NAME[quads[0]]} and ${QUAD_NAME[quads[1]]} quadrants (CAST diagram).`,
      );
      steps.push(`${QUAD_NAME[quads[0]][0].toUpperCase()}${QUAD_NAME[quads[0]].slice(1)} quadrant: ${quadWork(quads[0], ref, unit)}.`);
      steps.push(`${QUAD_NAME[quads[1]][0].toUpperCase()}${QUAD_NAME[quads[1]].slice(1)} quadrant: ${quadWork(quads[1], ref, unit)}.`);
      steps.push(`Both are inside ${interval}, and adding a full turn would take them outside it.`);
      return {
        stem: `Solve ${m(eqTex)} for ${interval}.`,
        answer,
        answerValue: ansVal,
        distractors,
        solution: steps.map((s, i) => `${i + 1}. ${s}`).join('\n') + `\n\nAnswer: ${answer}`,
        keyIdea: `Find the reference angle, then use the sign of ${m(`\\${fn} x`)} (CAST) to place the solutions in the right two quadrants.`,
      };
    },
  },
  // ------------------------------------------------------------------ 2. Pythagorean identity + double angle
  {
    id: 'gen-trig-equations-ratio-double',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    title: 'Use one trig ratio and the quadrant to find another ratio or a double angle',
    generate(rng) {
      const ask = rng.pick(['other', 'tan', 'sin2', 'cos2'] as const);
      // double angles only with the two smallest triples so the fractions stay calculator-friendly
      const t = rng.pick(ask === 'sin2' || ask === 'cos2' ? PY_TRIPLES.slice(0, 2) : PY_TRIPLES);
      const [opp, adj] = rng.bool() ? [t[0], t[1]] : [t[1], t[0]];
      const hyp = t[2];
      const q = rng.int(1, 4);
      const sSign = q <= 2 ? 1 : -1;
      const cSign = q === 1 || q === 4 ? 1 : -1;
      const sinV = new Frac(sSign * opp, hyp);
      const cosV = new Frac(cSign * adj, hyp);
      const given = rng.pick(['sin', 'cos'] as const);
      const other = given === 'sin' ? 'cos' : 'sin';
      const gV = given === 'sin' ? sinV : cosV;
      const oV = given === 'sin' ? cosV : sinV;
      const tanV = sinV.div(cosV);
      const sin2 = sinV.mul(cosV).mul(2);
      const cos2 = cosV.mul(cosV).sub(sinV.mul(sinV));
      const oSq = new Frac(1).sub(gV.mul(gV));
      const oAbs = new Frac(Math.abs(oV.n), oV.d);
      const oSignWord = oV.n > 0 ? 'positive' : 'negative';

      const askTex = { other: `\\${other}\\theta`, tan: '\\tan\\theta', sin2: '\\sin 2\\theta', cos2: '\\cos 2\\theta' }[ask];
      const ans = { other: oV, tan: tanV, sin2, cos2 }[ask];
      type P = { f: Frac; why: string };
      let pool: P[] = [];
      if (ask === 'other') {
        pool = [
          { f: oV.neg(), why: `The size is right but the sign is wrong: in the ${QUAD_NAME[q]} quadrant ${m(`\\${other}\\theta`)} is ${oSignWord}.` },
          { f: oSq, why: `This is ${m(`\\${other}^2\\theta`)}: the square root was never taken.` },
          { f: new Frac(1).sub(gV), why: `This uses ${m('\\sin\\theta + \\cos\\theta = 1')}, which is false. The identity is ${m('\\sin^2\\theta + \\cos^2\\theta = 1')}.` },
          { f: tanV, why: `This is ${m('\\tan\\theta')}, not ${m(`\\${other}\\theta`)}.` },
          { f: oSq.neg(), why: `This forgets the square root and also has the wrong sign.` },
        ];
      } else if (ask === 'tan') {
        pool = [
          { f: tanV.neg(), why: `The sign is wrong: in the ${QUAD_NAME[q]} quadrant ${m('\\tan\\theta')} is ${tanV.n > 0 ? 'positive' : 'negative'}.` },
          { f: cosV.div(sinV), why: `This is ${m('\\frac{\\cos\\theta}{\\sin\\theta}')}, the fraction upside down. Tangent is sine over cosine.` },
          { f: oV, why: `This stops at ${m(`\\${other}\\theta`)} and never forms ${m('\\frac{\\sin\\theta}{\\cos\\theta}')}.` },
          { f: cosV.div(sinV).neg(), why: `This is ${m('\\frac{\\cos\\theta}{\\sin\\theta}')} (upside down) with the wrong sign as well.` },
          { f: sinV.mul(cosV), why: `This multiplies ${m('\\sin\\theta \\times \\cos\\theta')} instead of dividing.` },
        ];
      } else if (ask === 'sin2') {
        pool = [
          { f: sin2.neg(), why: `This takes ${m(`\\${other}\\theta = ${oV.neg().tex()}`)}: the sign of ${m(`\\${other}\\theta`)} was not chosen from the quadrant.` },
          { f: sinV.mul(cosV), why: `This is ${m('\\sin\\theta\\cos\\theta')}; the factor 2 in ${m('\\sin 2\\theta = 2\\sin\\theta\\cos\\theta')} is missing.` },
          { f: sinV.mul(2), why: `This is ${m('2\\sin\\theta')}. The 2 is inside the sine, so ${m('\\sin 2\\theta \\ne 2\\sin\\theta')}.` },
          { f: cos2, why: `This is ${m('\\cos 2\\theta')}: the cosine double-angle formula was used instead of ${m('2\\sin\\theta\\cos\\theta')}.` },
          { f: sinV.mul(cosV).neg(), why: `This forgets the factor 2 and also gets the sign of ${m(`\\${other}\\theta`)} wrong.` },
        ];
      } else {
        pool = [
          { f: cos2.neg(), why: `This uses ${m('\\sin^2\\theta - \\cos^2\\theta')} (equivalently ${m('1 - 2\\cos^2\\theta')}), which has the signs reversed. The formula is ${m('\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta')}.` },
          { f: cosV.mul(2), why: `This is ${m('2\\cos\\theta')}. The 2 is inside the cosine, so ${m('\\cos 2\\theta \\ne 2\\cos\\theta')}.` },
          { f: cosV.mul(cosV), why: `This is just ${m('\\cos^2\\theta')}; ${m('\\sin^2\\theta')} still has to be subtracted.` },
          { f: sin2, why: `This is ${m('\\sin 2\\theta = 2\\sin\\theta\\cos\\theta')}, the wrong double-angle formula.` },
          { f: new Frac(1).sub(cosV.mul(cosV).mul(2)), why: `This uses ${m('1 - 2\\cos^2\\theta')}; the correct versions are ${m('2\\cos^2\\theta - 1')} or ${m('1 - 2\\sin^2\\theta')}.` },
        ];
      }
      const distractors: { text: string; value: number; why: string }[] = [];
      for (const d of pool) {
        if (distractors.length === 3) break;
        const text = m(d.f.tex());
        if (d.f.equals(ans) || distractors.some((x) => x.text === text)) continue;
        distractors.push({ text, value: d.f.value(), why: d.why });
      }
      // guaranteed-different fallbacks (never needed with these triples, kept for safety)
      for (let k = 2; distractors.length < 3; k++) {
        const f = ans.mul(k);
        const text = m(f.tex());
        if (f.equals(ans) || distractors.some((x) => x.text === text)) continue;
        distractors.push({ text, value: f.value(), why: `This is the correct value multiplied by ${k}: an extra factor of ${k} has crept into the working.` });
      }

      const sq = (f: Frac) => `\\left(${f.tex()}\\right)^{2}`;
      const lines: string[] = [];
      lines.push(
        `Find ${m(`\\${other}\\theta`)} with ${m('\\sin^2\\theta + \\cos^2\\theta = 1')}: ${m(`\\${other}^2\\theta = 1 - ${sq(gV)} = 1 - ${gV.mul(gV).tex()} = ${oSq.tex()}`)}, so ${m(`\\${other}\\theta = \\pm ${oAbs.tex()}`)}.`,
      );
      lines.push(`In the ${QUAD_NAME[q]} quadrant (${m(QUAD_RANGE[q])}) ${m(`\\${other}\\theta`)} is ${oSignWord}, so ${m(`\\${other}\\theta = ${oV.tex()}`)}.`);
      if (ask === 'tan') lines.push(`${m(`\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = ${sinV.tex()} \\div ${paren(cosV)} = ${tanV.tex()}`)}.`);
      if (ask === 'sin2') lines.push(`${m(`\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2 \\times ${paren(sinV)} \\times ${paren(cosV)} = ${sin2.tex()}`)}.`);
      if (ask === 'cos2')
        lines.push(
          `${m(`\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = ${sq(cosV)} - ${sq(sinV)} = ${cosV.mul(cosV).tex()} - ${sinV.mul(sinV).tex()} = ${cos2.tex()}`)}.`,
        );
      if (ask === 'cos2') {
        const g2 = gV.mul(gV);
        const viaGiven =
          given === 'sin'
            ? `\\cos 2\\theta = 1 - 2\\sin^2\\theta = 1 - 2 \\times ${g2.tex()} = ${cos2.tex()}`
            : `\\cos 2\\theta = 2\\cos^2\\theta - 1 = 2 \\times ${g2.tex()} - 1 = ${cos2.tex()}`;
        lines.push(`Shortcut check: ${m(viaGiven)} uses only the given ratio, so for ${m('\\cos 2\\theta')} the quadrant does not change the answer.`);
      }
      const answer = m(ans.tex());
      return {
        stem: `Given that ${m(`\\${given}\\theta = ${gV.tex()}`)} and ${m(QUAD_RANGE[q])}, find the exact value of ${m(askTex)}.`,
        answer,
        answerValue: ans.value(),
        distractors,
        solution: lines.map((s, i) => `${i + 1}. ${s}`).join('\n') + `\n\nAnswer: ${answer}`,
        keyIdea: 'Get the missing ratio from $\\sin^2\\theta + \\cos^2\\theta = 1$, choose its sign from the quadrant, then apply the identity you need.',
      };
    },
  },
  // ------------------------------------------------------------------ 3. system like the official sample
  {
    id: 'gen-trig-equations-system',
    subtopic: 'trig-equations',
    difficulty: 'challenge',
    title: 'Simultaneous equations in sin, cos and tan of three unknown angles',
    generate(rng) {
      const u = new Frac(rng.int(-2, 2), 2); // sin(alpha) in {-1, -1/2, 0, 1/2, 1}
      const v = new Frac(rng.int(-2, 2), 2); // cos(beta)
      const w = new Frac(rng.int(-1, 1)); // tan(gamma)
      let A: number[][];
      const det = (M: number[][]) =>
        M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
      do {
        A = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.intNonZero(-3, 3)));
      } while (det(A) === 0);
      // make the coefficients of half-valued unknowns even so the right-hand sides are integers
      if (!u.isInt()) A.forEach((r) => (r[0] *= 2));
      if (!v.isInt()) A.forEach((r) => (r[1] *= 2));
      const vals = [u, v, w];
      const rhs = A.map((r) => r.reduce((acc, c, j) => acc.add(vals[j].mul(c)), new Frac(0)));
      const names = ['\\sin\\alpha', '\\cos\\beta', '\\tan\\gamma'];
      const sysLines = A.map((r, i) => `${sum(r.map((c, j) => [c, names[j]] as [number, string]))} &= ${rhs[i].tex()}`);
      const uvwLines = A.map((r, i) => `${sum(r.map((c, j) => [c, ['u', 'v', 'w'][j]] as [number, string]))} &= ${rhs[i].tex()}`);
      const al = ASIN_DEG.get(u.value())!;
      const be = ACOS_DEG.get(v.value())!;
      const ga = ATAN_DEG.get(w.value())!;
      const triple = (a: number, b: number, c: number) => `$\\left(${angTex(a, 'rad')}, ${angTex(b, 'rad')}, ${angTex(c, 'rad')}\\right)$`;
      const answer = triple(al, be, ga);
      const uT = u.tex();
      const vT = v.tex();
      const wT = w.tex();

      const angleMix: { t: [number, number, number]; why: string }[] = [
        { t: [ACOS_DEG.get(u.value())!, be, ga], why: `This mixes up sine and cosine for ${m('\\alpha')}: it solves ${m(`\\cos\\alpha = ${uT}`)} instead of ${m(`\\sin\\alpha = ${uT}`)}.` },
        { t: [al, ASIN_DEG.get(v.value())!, ga], why: `This mixes up sine and cosine for ${m('\\beta')}: it solves ${m(`\\sin\\beta = ${vT}`)} instead of ${m(`\\cos\\beta = ${vT}`)}.` },
        w.n === 0
          ? { t: [al, be, 90], why: `This uses ${m('\\gamma = \\frac{\\pi}{2}')} for ${m('\\tan\\gamma = 0')}, confusing tangent with cosine (${m('\\cos\\frac{\\pi}{2} = 0')}). In fact ${m('\\tan 0 = 0')} and ${m('\\tan\\frac{\\pi}{2}')} is not defined.` }
          : { t: [al, be, ASIN_DEG.get(w.value())!], why: `This treats ${m(`\\tan\\gamma = ${wT}`)} as if it were ${m(`\\sin\\gamma = ${wT}`)}. Tangent equals ${m(wT)} at ${m(angTex(ga, 'rad'))}.` },
      ];
      const signSlips: { t: [number, number, number]; why: string }[] = [];
      if (u.n !== 0) signSlips.push({ t: [ASIN_DEG.get(-u.value())!, be, ga], why: `A sign slip while solving the linear system gives ${m(`\\sin\\alpha = ${u.neg().tex()}`)} instead of ${m(uT)}; substituting the values back into the equations catches this.` });
      if (v.n !== 0) signSlips.push({ t: [al, ACOS_DEG.get(-v.value())!, ga], why: `A sign slip while solving the linear system gives ${m(`\\cos\\beta = ${v.neg().tex()}`)} instead of ${m(vT)}; substituting the values back into the equations catches this.` });
      if (w.n !== 0) signSlips.push({ t: [al, be, ATAN_DEG.get(-w.value())!], why: `A sign slip while solving the linear system gives ${m(`\\tan\\gamma = ${w.neg().tex()}`)} instead of ${m(wT)}; substituting the values back into the equations catches this.` });
      // distractors that respect the stated ranges first, so they cannot be ruled out by the ranges alone
      const inRange = (t: [number, number, number]) => t[0] >= -90 && t[0] <= 90 && t[1] >= 0 && t[1] <= 180 && t[2] > -90 && t[2] < 90;
      const mixed = [...rng.shuffle(angleMix), ...rng.shuffle(signSlips)];
      const pool = [...mixed.filter((d) => inRange(d.t)), ...mixed.filter((d) => !inRange(d.t))];
      const distractors: { text: string; value: string; why: string }[] = [];
      for (const d of pool) {
        if (distractors.length === 3) break;
        const text = triple(...d.t);
        if (text === answer || distractors.some((x) => x.text === text)) continue;
        distractors.push({ text, value: d.t.join(','), why: d.why });
      }

      // ---- full elimination working (integer row operations), verified against (u, v, w) ----
      type Row = { c: number[]; r: Frac };
      const VARS = ['u', 'v', 'w'];
      const rowTex = (row: Row) => `${sum(row.c.map((c, j) => [c, VARS[j]] as [number, string]).filter(([c]) => c !== 0))} = ${row.r.tex()}`;
      const lbl = (k: number) => `\\text{(${k})}`;
      /** Eliminate variable j from rows X (label lx) and Y (label ly); returns the new row and the working text. */
      const elim = (X: Row, lx: number, Y: Row, ly: number, j: number): { row: Row; text: string } => {
        const g = gcd(X.c[j], Y.c[j]);
        let kY = X.c[j] / g;
        let kX = Y.c[j] / g;
        if (kY < 0) {
          kY = -kY;
          kX = -kX;
        }
        const c = Y.c.map((y, idx) => kY * y - kX * X.c[idx]);
        let r = Y.r.mul(kY).sub(X.r.mul(kX));
        const op =
          `${kY === 1 ? '' : `${kY} \\times `}${lbl(ly)} ${kX > 0 ? '-' : '+'} ${Math.abs(kX) === 1 ? '' : `${Math.abs(kX)} \\times `}${lbl(lx)}`;
        let text = `${m(op)} gives ${m(rowTex({ c, r }))}`;
        // divide through by the common factor, making the leading coefficient positive
        const lead = c.find((x) => x !== 0) ?? 1;
        const h = c.reduce((acc, x) => gcd(acc, x), r.isInt() ? r.n : 0) * (lead < 0 ? -1 : 1);
        let cc = c;
        if (h !== 1 && r.isInt()) {
          cc = c.map((x) => x / h);
          r = r.div(h);
          text += `; divide by ${h}: ${m(rowTex({ c: cc, r }))}`;
        }
        return { row: { c: cc, r }, text };
      };
      const R = A.map((c, i) => ({ c, r: rhs[i] }));
      const e4 = elim(R[0], 1, R[1], 2, 2);
      const e5 = elim(R[0], 1, R[2], 3, 2);
      const [p1, q1] = e4.row.c;
      const [p2, q2] = e5.row.c;
      const r1 = e4.row.r;
      const r2 = e5.row.r;
      const elimSteps: string[] = [
        `Remove ${m('w')} from equations (1) and (2): ${e4.text}. Call this (4).`,
        `Remove ${m('w')} from equations (1) and (3): ${e5.text}. Call this (5).`,
      ];
      let uS: Frac;
      let vS: Frac;
      const solveOne = (coef: number, name: string, r: Frac, from: string): Frac => {
        const val = r.div(coef);
        if (from === 'this') elimSteps.push(`So ${m(`${name} = ${val.tex()}`)}.`);
        else if (coef !== 1) elimSteps.push(`From ${from}: ${m(`${term(coef, name, true)} = ${r.tex()}`)}, so ${m(`${name} = ${val.tex()}`)}.`);
        else elimSteps.push(`So from ${from}, ${m(`${name} = ${val.tex()}`)}.`);
        return val;
      };
      /** coef*name + other*known = r  ->  name */
      const backSub = (coef: number, name: string, other: number, knownName: string, known: Frac, r: Frac, from: string): Frac => {
        const rest = r.sub(known.mul(other));
        const val = rest.div(coef);
        if (other === 0) {
          // this equation does not contain the known unknown, so no substitution is needed
          if (coef === 1) elimSteps.push(`From ${from} directly: ${m(`${name} = ${val.tex()}`)}.`);
          else elimSteps.push(`From ${from}: ${m(`${term(coef, name, true)} = ${r.tex()}`)}, so ${m(`${name} = ${val.tex()}`)}.`);
          return val;
        }
        elimSteps.push(
          `Substitute ${m(`${knownName} = ${known.tex()}`)} into ${from}: ${m(`${term(coef, name, true)} = ${r.tex()} - ${paren(other)} \\times ${paren(known)} = ${rest.tex()}`)}${coef === 1 ? '' : `, so ${m(`${name} = ${val.tex()}`)}`}.`,
        );
        return val;
      };
      if (q1 === 0) {
        uS = solveOne(p1, 'u', r1, '(4)');
        vS = backSub(q2, 'v', p2, 'u', uS, r2, '(5)');
      } else if (q2 === 0) {
        uS = solveOne(p2, 'u', r2, '(5)');
        vS = backSub(q1, 'v', p1, 'u', uS, r1, '(4)');
      } else if (p1 === 0) {
        vS = solveOne(q1, 'v', r1, '(4)');
        uS = backSub(p2, 'u', q2, 'v', vS, r2, '(5)');
      } else if (p2 === 0) {
        vS = solveOne(q2, 'v', r2, '(5)');
        uS = backSub(p1, 'u', q1, 'v', vS, r1, '(4)');
      } else {
        const e6 = elim(e4.row, 4, e5.row, 5, 1);
        elimSteps.push(`Remove ${m('v')} using (4) and (5): ${e6.text}.`);
        uS = solveOne(e6.row.c[0], 'u', e6.row.r, 'this');
        vS = backSub(q1, 'v', p1, 'u', uS, r1, '(4)');
      }
      const [a1, b1, c1] = A[0];
      const wRest = rhs[0].sub(uS.mul(a1)).sub(vS.mul(b1));
      const wS = wRest.div(c1);
      elimSteps.push(
        `Substitute both into (1): ${m(`${term(c1, 'w', true)} = ${rhs[0].tex()} - ${paren(a1)} \\times ${paren(uS)} - ${paren(b1)} \\times ${paren(vS)} = ${wRest.tex()}`)}${c1 === 1 ? '' : `, so ${m(`w = ${wS.tex()}`)}`}.`,
      );
      if (!uS.equals(u) || !vS.equals(v) || !wS.equals(w)) throw new Error('gen-trig-equations-system: elimination working does not match');

      const checkLine = (r: number[], i: number) =>
        r.map((c, j) => (j === 0 ? `${c}` : c < 0 ? ` - ${-c}` : ` + ${c}`) + ` \\times ${paren(vals[j])}`).join('') + ` = ${rhs[i].tex()}`;
      const solution =
        `Let ${m('u = \\sin\\alpha')}, ${m('v = \\cos\\beta')}, ${m('w = \\tan\\gamma')}. The system becomes ordinary linear simultaneous equations:` +
        dm(`\\begin{aligned} ${uvwLines.map((l, i) => `${l} \\quad ${lbl(i + 1)}`).join(' \\\\ ')} \\end{aligned}`) +
        `**Step 1: solve the linear system by elimination** (a calculator's simultaneous-equation mode gives the same result).\n\n` +
        elimSteps.map((s) => `- ${s}`).join('\n') +
        `\n\nSo ${m(`u = ${uT}`)}, ${m(`v = ${vT}`)}, ${m(`w = ${wT}`)}.\n\n` +
        `**Step 2: check by substituting into every equation.**\n\n` +
        A.map((r, i) => `- ${m(checkLine(r, i))}`).join('\n') +
        `\n\n**Step 3: convert back to angles in the given ranges.**\n\n` +
        `- ${m(`\\sin\\alpha = ${uT}`)} with ${m('-\\frac{\\pi}{2} \\le \\alpha \\le \\frac{\\pi}{2}')} gives ${m(`\\alpha = ${angTex(al, 'rad')}`)}\n` +
        `- ${m(`\\cos\\beta = ${vT}`)} with ${m('0 \\le \\beta \\le \\pi')} gives ${m(`\\beta = ${angTex(be, 'rad')}`)}\n` +
        `- ${m(`\\tan\\gamma = ${wT}`)} with ${m('-\\frac{\\pi}{2} < \\gamma < \\frac{\\pi}{2}')} gives ${m(`\\gamma = ${angTex(ga, 'rad')}`)}\n\n` +
        `Answer: ${answer}`;
      return {
        stem:
          `Find the angles ${m('(\\alpha, \\beta, \\gamma)')}, with ${m('-\\frac{\\pi}{2} \\le \\alpha \\le \\frac{\\pi}{2}')}, ${m('0 \\le \\beta \\le \\pi')} and ${m('-\\frac{\\pi}{2} < \\gamma < \\frac{\\pi}{2}')}, such that` +
          dm(`\\begin{aligned} ${sysLines.join(' \\\\ ')} \\end{aligned}`).trimEnd(),
        answer,
        answerValue: `${al},${be},${ga}`,
        distractors,
        solution,
        keyIdea: 'Substitute single letters for the trig expressions, solve the linear system, then turn each value back into an angle inside its range.',
      };
    },
  },
];
