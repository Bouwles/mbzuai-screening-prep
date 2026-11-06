import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m, paren } from '../../../lib/tex';

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
        solution:
          `Get ${m(`\\${fn} x`)} on its own, find the reference angle, then use the sign of ${m(`\\${fn} x`)} (CAST) to decide which two quadrants the solutions are in.\n\n` +
          steps.map((s, i) => `${i + 1}. ${s}`).join('\n') +
          `\n\nAnswer: ${answer}`,
        keyIdea: `Find the reference angle, then use the sign of ${m(`\\${fn} x`)} (CAST) to place the solutions in the right two quadrants.`,
      };
    },
  },
  // ------------------------------------------------------------------ 2. Pythagorean identity
  {
    id: 'gen-trig-equations-ratio-double',
    subtopic: 'trig-equations',
    difficulty: 'exam',
    title: 'Use one trig ratio and the quadrant to find another ratio',
    generate(rng) {
      const ask = rng.pick(['other', 'tan'] as const);
      const t = rng.pick(PY_TRIPLES);
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
      const oSq = new Frac(1).sub(gV.mul(gV));
      const oAbs = new Frac(Math.abs(oV.n), oV.d);
      const oSignWord = oV.n > 0 ? 'positive' : 'negative';

      const askTex = { other: `\\${other}\\theta`, tan: '\\tan\\theta' }[ask];
      const ans = { other: oV, tan: tanV }[ask];
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
      } else {
        pool = [
          { f: tanV.neg(), why: `The sign is wrong: in the ${QUAD_NAME[q]} quadrant ${m('\\tan\\theta')} is ${tanV.n > 0 ? 'positive' : 'negative'}.` },
          { f: cosV.div(sinV), why: `This is ${m('\\frac{\\cos\\theta}{\\sin\\theta}')}, the fraction upside down. Tangent is sine over cosine.` },
          { f: oV, why: `This stops at ${m(`\\${other}\\theta`)} and never forms ${m('\\frac{\\sin\\theta}{\\cos\\theta}')}.` },
          { f: cosV.div(sinV).neg(), why: `This is ${m('\\frac{\\cos\\theta}{\\sin\\theta}')} (upside down) with the wrong sign as well.` },
          { f: sinV.mul(cosV), why: `This multiplies ${m('\\sin\\theta \\times \\cos\\theta')} instead of dividing.` },
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
      const answer = m(ans.tex());
      return {
        stem: `Given that ${m(`\\${given}\\theta = ${gV.tex()}`)} and ${m(QUAD_RANGE[q])}, find the exact value of ${m(askTex)}.`,
        answer,
        answerValue: ans.value(),
        distractors,
        solution:
          `Start by finding the missing ratio ${m(`\\${other}\\theta`)} from ${m('\\sin^2\\theta + \\cos^2\\theta = 1')}, and choose its sign from the quadrant.\n\n` +
          lines.map((s, i) => `${i + 1}. ${s}`).join('\n') +
          `\n\nAnswer: ${answer}`,
        keyIdea: 'Get the missing ratio from $\\sin^2\\theta + \\cos^2\\theta = 1$, choose its sign from the quadrant, then apply the identity you need.',
      };
    },
  },
];
