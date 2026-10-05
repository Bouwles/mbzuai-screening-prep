import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { m, num, sqrtTex } from '../../../lib/tex';

type Cand = { text: string; value: number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answerText: string, answerValue: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const key = (t: string) => t.replace(/\s+/g, '');
  for (const c of pool) {
    if (out.length === 3) break;
    if (Math.abs(c.value - answerValue) < 1e-9 || key(c.text) === key(answerText)) continue;
    if (out.some((o) => Math.abs(o.value - c.value) < 1e-9 || key(o.text) === key(c.text))) continue;
    out.push(c);
  }
  if (out.length < 3) throw new Error('not enough distinct distractors');
  return out;
}

/** k*pi as clean LaTeX: "\pi", "6\pi", "\frac{3\pi}{2}", "\frac{\pi}{4}". */
function piTex(k: Frac): string {
  if (k.n === 0) return '0';
  const sign = k.n < 0 ? '-' : '';
  const a = Math.abs(k.n);
  const top = a === 1 ? '\\pi' : `${a}\\pi`;
  return k.d === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${k.d}}`;
}

// ---------------------------------------------------------------- exact values
type Fn = 'sin' | 'cos' | 'tan';
/** Exact values of sin/cos/tan for reference angles 30, 45, 60: [tex, value]. */
const EXACT: Record<Fn, Record<number, [string, number]>> = {
  sin: { 30: ['\\frac{1}{2}', 1 / 2], 45: ['\\frac{\\sqrt{2}}{2}', Math.SQRT2 / 2], 60: ['\\frac{\\sqrt{3}}{2}', Math.sqrt(3) / 2] },
  cos: { 30: ['\\frac{\\sqrt{3}}{2}', Math.sqrt(3) / 2], 45: ['\\frac{\\sqrt{2}}{2}', Math.SQRT2 / 2], 60: ['\\frac{1}{2}', 1 / 2] },
  tan: { 30: ['\\frac{\\sqrt{3}}{3}', Math.sqrt(3) / 3], 45: ['1', 1], 60: ['\\sqrt{3}', Math.sqrt(3)] },
};
const signedTex = (neg: boolean, t: string) => (neg ? `-${t}` : t);
const QUAD_NAME = ['first', 'second', 'third', 'fourth'];
const CAST = [
  'all three are positive',
  'only $\\sin$ is positive',
  'only $\\tan$ is positive',
  'only $\\cos$ is positive',
];

function genExactValue(rng: Rng) {
  const ref = rng.pick([30, 45, 60]);
  const quad = rng.int(1, 4);
  const deg = quad === 1 ? ref : quad === 2 ? 180 - ref : quad === 3 ? 180 + ref : 360 - ref;
  const fn: Fn = rng.pick(['sin', 'cos', 'tan'] as const);
  const useRad = rng.bool(0.5);
  const angleTex = useRad ? piTex(new Frac(deg, 180)) : `${deg}^\\circ`;
  const shown = useRad && deg % 180 !== 0 ? `\\${fn}\\left(${angleTex}\\right)` : `\\${fn} ${angleTex}`;

  // sign from the quadrant
  const sinPos = quad === 1 || quad === 2;
  const cosPos = quad === 1 || quad === 4;
  const pos = fn === 'sin' ? sinPos : fn === 'cos' ? cosPos : sinPos === cosPos;
  const [mag, magV] = EXACT[fn][ref];
  const ansText = signedTex(!pos, mag);
  const ansVal = (pos ? 1 : -1) * magV;
  const trueVal = fn === 'sin' ? Math.sin((deg * Math.PI) / 180) : fn === 'cos' ? Math.cos((deg * Math.PI) / 180) : Math.tan((deg * Math.PI) / 180);
  if (Math.abs(trueVal - ansVal) > 1e-9) throw new Error('exact value table mismatch');

  const other: Fn = fn === 'sin' ? 'cos' : fn === 'cos' ? 'sin' : 'tan';
  // co-function / swapped-ratio value of the same reference angle
  const [swapMag, swapV] = fn === 'tan' ? EXACT.tan[90 - ref] : EXACT[other][ref];
  const swapName = fn === 'tan' ? `$\\frac{\\text{adj}}{\\text{opp}}$ (the ratio upside down)` : `the $\\${other}$ value`;
  // confusing the reference angle with its complement in the table
  const [compMag, compV] = EXACT[fn][90 - ref];
  const pool: Cand[] = [
    {
      text: m(signedTex(pos, mag)),
      value: -ansVal,
      why: `This has the right size but the wrong sign. ${m(`${deg}^\\circ`)} is in the ${QUAD_NAME[quad - 1]} quadrant, where ${CAST[quad - 1]}.`,
    },
    {
      text: m(signedTex(!pos, swapMag)),
      value: (pos ? 1 : -1) * swapV,
      why: `This uses ${swapName} for the reference angle ${m(`${ref}^\\circ`)} instead of $\\${fn}$.`,
    },
    {
      text: m(signedTex(pos, swapMag)),
      value: (pos ? -1 : 1) * swapV,
      why: `This uses ${swapName} for the reference angle **and** gets the sign wrong for the ${QUAD_NAME[quad - 1]} quadrant.`,
    },
    {
      text: m(signedTex(!pos, compMag)),
      value: (pos ? 1 : -1) * compV,
      why: `This reads the exact-value table for ${m(`${90 - ref}^\\circ`)} instead of the reference angle ${m(`${ref}^\\circ`)}.`,
    },
    {
      text: m(signedTex(pos, compMag)),
      value: (pos ? -1 : 1) * compV,
      why: `This uses the value for ${m(`${90 - ref}^\\circ`)} instead of ${m(`${ref}^\\circ`)} and also has the wrong sign.`,
    },
  ];
  // Fallbacks (needed for 45 degrees, where sin = cos and tan = 1): values of the other reference angles.
  for (const r2 of [30, 45, 60].filter((x) => x !== ref)) {
    const [t2, v2] = EXACT[fn][r2];
    pool.push(
      {
        text: m(signedTex(!pos, t2)),
        value: (pos ? 1 : -1) * v2,
        why: `This uses the exact value of ${m(`\\${fn} ${r2}^\\circ`)} instead of ${m(`\\${fn} ${ref}^\\circ`)}: the reference angle here is ${m(`${ref}^\\circ`)}.`,
      },
      {
        text: m(signedTex(pos, t2)),
        value: (pos ? -1 : 1) * v2,
        why: `This uses the exact value of ${m(`\\${fn} ${r2}^\\circ`)} instead of ${m(`\\${fn} ${ref}^\\circ`)} and also gets the sign wrong for the ${QUAD_NAME[quad - 1]} quadrant.`,
      },
    );
  }
  const distractors = pickDistinct(m(ansText), ansVal, pool);

  const refStep =
    quad === 1
      ? `It is already between ${m('0^\\circ')} and ${m('90^\\circ')}, so the reference angle is ${m(`${ref}^\\circ`)}.`
      : quad === 2
        ? `Reference angle (distance to the ${m('x')}-axis): ${m(`180^\\circ - ${deg}^\\circ = ${ref}^\\circ`)}.`
        : quad === 3
          ? `Reference angle (distance to the ${m('x')}-axis): ${m(`${deg}^\\circ - 180^\\circ = ${ref}^\\circ`)}.`
          : `Reference angle (distance to the ${m('x')}-axis): ${m(`360^\\circ - ${deg}^\\circ = ${ref}^\\circ`)}.`;
  const solution =
    (useRad
      ? `Convert to degrees (replace ${m('\\pi')} by ${m('180^\\circ')}): ${m(`${angleTex} = ${new Frac(deg, 180).tex()} \\times 180^\\circ = ${deg}^\\circ`)}.\n\n`
      : '') +
    `1. **Quadrant:** ${m(`${deg}^\\circ`)} is in the ${QUAD_NAME[quad - 1]} quadrant, where ${CAST[quad - 1]}. So ${m(`\\${fn}`)} is ${pos ? 'positive' : 'negative'} here.\n` +
    `2. ${refStep}\n` +
    `3. **Exact value:** ${m(`\\${fn} ${ref}^\\circ = ${mag}`)}.\n\n` +
    `Combine sign and size: ${m(`${shown} = ${ansText}`)}.\n\n` +
    `Answer: ${m(ansText)}`;
  return {
    stem: `What is the exact value of ${m(shown)}?`,
    answer: m(ansText),
    answerValue: ansVal,
    distractors,
    solution,
    keyIdea: 'Sign from the quadrant (CAST), size from the reference angle and the exact-value table.',
  };
}

// ---------------------------------------------------------------- arc length / sector area
function genArcSector(rng: Rng) {
  const r = rng.int(2, 12);
  const deg = rng.pick([30, 40, 45, 60, 72, 80, 90, 100, 120, 135, 150, 160, 210, 225, 240, 270, 300]);
  const want: 'arc' | 'area' = rng.bool() ? 'arc' : 'area';
  const thetaK = new Frac(deg, 180); // theta = thetaK * pi
  const arcK = thetaK.mul(r); // r*theta, in units of pi
  const areaK = thetaK.mul(r * r).div(2); // r^2 theta / 2, in units of pi
  const circK = new Frac(2 * r); // full circumference
  const discK = new Frac(r * r); // full area
  const thetaTex = piTex(thetaK);
  const unit = want === 'arc' ? '\\text{ cm}' : '\\text{ cm}^2';
  const withUnit = (t: string) => m(`${t}${unit}`);
  const ansK = want === 'arc' ? arcK : areaK;
  const answer = withUnit(piTex(ansK));
  const answerValue = ansK.value() * Math.PI;

  const pool: Cand[] =
    want === 'arc'
      ? [
          {
            text: withUnit(piTex(areaK)),
            value: areaK.value() * Math.PI,
            why: `This uses the sector **area** formula ${m('\\frac{1}{2}r^2\\theta')} instead of the arc length ${m('r\\theta')}.`,
          },
          {
            text: withUnit(num(r * deg)),
            value: r * deg,
            why: `This puts the angle into ${m('s = r\\theta')} in **degrees** (${m(`${r} \\times ${deg}`)}); the formula needs radians.`,
          },
          {
            text: withUnit(piTex(circK)),
            value: circK.value() * Math.PI,
            why: `This is the circumference of the **whole** circle, ${m(`2\\pi \\times ${r}`)}. The arc is only ${m(`\\frac{${deg}}{360}`)} of it.`,
          },
          {
            text: withUnit(piTex(arcK.mul(2))),
            value: arcK.value() * 2 * Math.PI,
            why: `This converts with ${m('180^\\circ = 2\\pi')} (or uses the diameter); a half turn is ${m('\\pi')} radians.`,
          },
          {
            text: withUnit(piTex(arcK.div(2))),
            value: (arcK.value() / 2) * Math.PI,
            why: `This includes a stray ${m('\\frac{1}{2}')}, mixing up the arc formula ${m('r\\theta')} with the area formula ${m('\\frac{1}{2}r^2\\theta')}.`,
          },
        ]
      : [
          {
            text: withUnit(piTex(arcK)),
            value: arcK.value() * Math.PI,
            why: `This is the **arc length** ${m('r\\theta')}, not the area.`,
          },
          {
            text: withUnit(piTex(areaK.mul(2))),
            value: areaK.value() * 2 * Math.PI,
            why: `This forgets the ${m('\\frac{1}{2}')} in ${m('\\frac{1}{2}r^2\\theta')}.`,
          },
          {
            text: withUnit(num((r * r * deg) / 2)),
            value: (r * r * deg) / 2,
            why: `This puts the angle into ${m('\\frac{1}{2}r^2\\theta')} in **degrees**; the formula needs radians.`,
          },
          {
            text: withUnit(piTex(discK)),
            value: discK.value() * Math.PI,
            why: `This is the area of the **whole** circle, ${m(`\\pi \\times ${r}^2`)}. The sector is only ${m(`\\frac{${deg}}{360}`)} of it.`,
          },
          {
            text: withUnit(piTex(thetaK.mul(r).div(2))),
            value: (thetaK.value() * r * Math.PI) / 2,
            why: `This forgets to square the radius: ${m('\\frac{1}{2}r\\theta')} instead of ${m('\\frac{1}{2}r^2\\theta')}.`,
          },
        ];
  const distractors = pickDistinct(answer, answerValue, pool);

  const frac360 = new Frac(deg, 360);
  const solution =
    `**Step 1: convert the angle to radians** (the formulas ${m('s = r\\theta')} and ${m('A = \\frac{1}{2}r^2\\theta')} need radians):` +
    `\n\n$$${deg}^\\circ = ${deg} \\times \\frac{\\pi}{180} = ${thetaTex}$$\n\n` +
    (want === 'arc'
      ? `**Step 2: arc length.**\n\n$$s = r\\theta = ${r} \\times ${thetaTex} = ${piTex(arcK)}$$\n\n` +
        `Check: the sector is ${m(frac360.tex())} of the circle, and ${m(`${frac360.tex()} \\times 2\\pi \\times ${r} = ${piTex(arcK)}`)}.\n\n`
      : `**Step 2: sector area.**\n\n$$A = \\frac{1}{2}r^2\\theta = \\frac{1}{2} \\times ${r}^2 \\times ${thetaTex} = \\frac{1}{2} \\times ${r * r} \\times ${thetaTex} = ${piTex(areaK)}$$\n\n` +
        `Check: the sector is ${m(frac360.tex())} of the circle, and ${m(`${frac360.tex()} \\times \\pi \\times ${r}^2 = ${piTex(areaK)}`)}.\n\n`) +
    `Answer: ${answer}`;

  return {
    stem:
      `A sector of a circle has radius ${m(`${r}\\text{ cm}`)} and an angle of ${m(`${deg}^\\circ`)} at the centre. ` +
      (want === 'arc' ? 'Find the length of its arc, in terms of $\\pi$.' : 'Find its area, in terms of $\\pi$.'),
    answer,
    answerValue,
    distractors,
    solution,
    keyIdea:
      want === 'arc'
        ? 'Arc length $s = r\\theta$, with $\\theta$ in radians.'
        : 'Sector area $A = \\frac{1}{2}r^2\\theta$, with $\\theta$ in radians.',
  };
}

// ---------------------------------------------------------------- cosine rule
const LABELS: [string, string, string][] = [
  ['A', 'B', 'C'],
  ['P', 'Q', 'R'],
  ['X', 'Y', 'Z'],
  ['K', 'L', 'M'],
];

function genCosineRule(rng: Rng) {
  const angle = rng.pick([60, 120]);
  const sgn = angle === 60 ? -1 : 1; // a^2 = b^2 + c^2 + sgn*b*c  (since -2bc cos A = -bc or +bc)
  // Half the time pick a pair that gives a whole-number answer (calculator-friendly).
  const nice: [number, number][] = [];
  for (let b = 2; b <= 16; b++)
    for (let c = 2; c <= 16; c++) {
      if (b === c) continue;
      const s = b * b + c * c + sgn * b * c;
      if (Number.isInteger(Math.sqrt(s))) nice.push([b, c]);
    }
  let b: number;
  let c: number;
  if (rng.bool(0.5) && nice.length) [b, c] = rng.pick(nice);
  else {
    b = rng.int(2, 12);
    c = rng.int(2, 12);
    while (c === b) c = rng.int(2, 12);
  }
  const [V, P, Q] = rng.pick(LABELS); // angle at V, sides VP = c, VQ = b, want PQ
  const n = b * b + c * c + sgn * b * c;
  const ans = sqrtTex(n);
  const answer = m(`${ans}\\text{ cm}`);
  const answerValue = Math.sqrt(n);
  const cosTex = angle === 60 ? '\\frac{1}{2}' : '-\\frac{1}{2}';

  const nSign = b * b + c * c - sgn * b * c;
  const pool: Cand[] = [
    {
      text: m(`${sqrtTex(nSign)}\\text{ cm}`),
      value: Math.sqrt(nSign),
      why:
        angle === 120
          ? `This uses ${m('\\cos 120^\\circ = \\frac{1}{2}')}. Cosine is negative for obtuse angles: ${m('\\cos 120^\\circ = -\\frac{1}{2}')}, so the ${m('2bc\\cos A')} term is **added**.`
          : `This adds the ${m('2bc\\cos A')} term instead of subtracting it (or uses ${m('\\cos 60^\\circ = -\\frac{1}{2}')}).`,
    },
    {
      text: m(`${n}\\text{ cm}`),
      value: n,
      why: `${m(String(n))} is ${m(`${P}${Q}^2`)}. The final step, taking the square root, has been forgotten.`,
    },
    {
      text: m(`${sqrtTex(b * b + c * c)}\\text{ cm}`),
      value: Math.sqrt(b * b + c * c),
      why: `This uses Pythagoras, ${m(`${b}^2 + ${c}^2`)}, which only works when the angle is ${m('90^\\circ')}.`,
    },
    {
      text: m(`${b + c}\\text{ cm}`),
      value: b + c,
      why: `This just adds the two sides. A side of a triangle is always shorter than the sum of the other two.`,
    },
  ];
  // "forgot the 2 in 2bc cos A" only when it gives a whole number under the root
  if ((b * c) % 2 === 0) {
    const nHalf = b * b + c * c + (sgn * b * c) / 2;
    pool.splice(2, 0, {
      text: m(`${sqrtTex(nHalf)}\\text{ cm}`),
      value: Math.sqrt(nHalf),
      why: `This forgets the ${m('2')} in ${m('2bc\\cos A')}, using only ${m(`${c} \\times ${b} \\times \\left(${cosTex}\\right) = ${(sgn * -b * c) / 2}`)} instead of ${m(`2 \\times ${c} \\times ${b} \\times \\left(${cosTex}\\right) = ${sgn * -b * c}`)}.`,
    });
  }
  const distractors = pickDistinct(answer, answerValue, pool);

  const prod = b * c;
  const solution =
    `Two sides and the angle **between** them, so use the cosine rule:\n\n` +
    `$$${P}${Q}^2 = ${V}${P}^2 + ${V}${Q}^2 - 2 \\times ${V}${P} \\times ${V}${Q} \\times \\cos ${V}$$\n\n` +
    `Substitute ${m(`${V}${P} = ${c}`)}, ${m(`${V}${Q} = ${b}`)} and ${m(`\\cos ${angle}^\\circ = ${cosTex}`)}:\n\n` +
    `$$${P}${Q}^2 = ${c * c} + ${b * b} - ${2 * prod} \\times \\left(${cosTex}\\right)$$\n\n` +
    `$$${P}${Q}^2 = ${b * b + c * c} ${sgn < 0 ? '-' : '+'} ${prod} = ${n}$$\n\n` +
    `Take the square root: ${m(
      `${P}${Q} = \\sqrt{${n}}${ans === `\\sqrt{${n}}` ? '' : ` = ${ans}`}` +
        (Number.isInteger(answerValue) ? '' : ` \\approx ${num(answerValue, 2)}`),
    )}` +
    `.\n\nAnswer: ${answer}`;

  return {
    stem:
      `In triangle ${m(`${V}${P}${Q}`)}, ${m(`${V}${P} = ${c}\\text{ cm}`)}, ${m(`${V}${Q} = ${b}\\text{ cm}`)} and angle ${m(`${P}${V}${Q} = ${angle}^\\circ`)}. ` +
      `Find the exact length of ${m(`${P}${Q}`)}.`,
    answer,
    answerValue,
    distractors,
    solution,
    keyIdea: 'Cosine rule $a^2 = b^2 + c^2 - 2bc\\cos A$; remember $\\cos A < 0$ when $A$ is obtuse.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-trig-functions-exact-values',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    title: 'Exact value of sin, cos or tan of an angle in any quadrant',
    generate: genExactValue,
  },
  {
    id: 'gen-trig-functions-arc-sector',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    title: 'Arc length or sector area from an angle in degrees',
    generate: genArcSector,
  },
  {
    id: 'gen-trig-functions-cosine-rule',
    subtopic: 'trig-functions',
    difficulty: 'exam',
    title: 'Cosine rule: third side from two sides and a 60 or 120 degree angle',
    generate: genCosineRule,
  },
];
