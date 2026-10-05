import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { m, num } from '../../../lib/tex';

/** Show an exact value: terminating decimals as decimals (1.5, -0.25), others as reduced fractions. */
function show(f: Frac): string {
  let d = f.d;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d === 1 ? num(f.value()) : f.tex();
}

interface Cand {
  text: string;
  value: number;
  why: string;
}

/** Keep the first 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answer: Cand, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const key = (s: string) => s.replace(/\s+/g, '');
  for (const c of pool) {
    if (out.length === 3) break;
    const clash = [answer, ...out].some((o) => Math.abs(o.value - c.value) < 1e-9 || key(o.text) === key(c.text));
    if (!clash) out.push(c);
  }
  return out;
}

// ------------------------------------------------------------------ z-scores
const Z_CONTEXTS = [
  { intro: 'Marks in a test', unit: '', item: 'a student\'s mark', mus: [50, 55, 58, 60, 62, 64, 65, 68, 70, 72, 75], sds: [4, 5, 6, 8, 10, 12] },
  { intro: 'The heights of a type of plant (in cm)', unit: ' cm', item: 'a plant\'s height', mus: [20, 24, 30, 36, 40, 45, 50, 60], sds: [2, 3, 4, 5, 6] },
  { intro: 'The masses of apples from a farm (in grams)', unit: ' g', item: 'an apple\'s mass', mus: [120, 140, 150, 160, 175, 180, 200], sds: [8, 10, 12, 15, 20] },
  { intro: 'Daily commuting times of workers (in minutes)', unit: ' minutes', item: 'a worker\'s commute', mus: [25, 30, 32, 35, 40, 45], sds: [3, 4, 5, 6] },
] as const;

const Z_CHOICES: Frac[] = [
  new Frac(-5, 2), new Frac(-2), new Frac(-3, 2), new Frac(-5, 4), new Frac(-1), new Frac(-3, 4), new Frac(-1, 2),
  new Frac(1, 2), new Frac(3, 4), new Frac(1), new Frac(5, 4), new Frac(3, 2), new Frac(2), new Frac(5, 2),
];

function zScoreQuestion(rng: Rng) {
  const ctx = rng.pick(Z_CONTEXTS);
  const mu = rng.pick(ctx.mus);
  let sigma = 0;
  let z = Z_CHOICES[0];
  // re-roll until z * sigma is a whole number (so the value x is a whole number)
  for (;;) {
    sigma = rng.pick(ctx.sds);
    z = rng.pick(Z_CHOICES);
    if (z.mul(sigma).isInt()) break;
  }
  const x = z.mul(sigma).add(mu).value();
  const diff = x - mu;
  const useVar = rng.bool(0.3);
  const spread = useVar
    ? `variance ${m(num(sigma * sigma))}`
    : `standard deviation ${m(num(sigma))}`;
  const findX = rng.bool(0.45);
  const u = ctx.unit;
  const varStep = useVar ? `The variance is ${m(`\\sigma^2 = ${sigma * sigma}`)}, so the standard deviation is ${m(`\\sigma = \\sqrt{${sigma * sigma}} = ${sigma}`)}.\n\n` : '';

  if (!findX) {
    const ans: Cand = { text: m(show(z)), value: z.value(), why: '' };
    const pool: Cand[] = [];
    if (useVar)
      pool.push({
        text: m(show(new Frac(diff, sigma * sigma))),
        value: diff / (sigma * sigma),
        why: `This divides by the **variance** ${m(num(sigma * sigma))} instead of the standard deviation. Take the square root first: ${m(`\\sigma = ${sigma}`)}.`,
      });
    pool.push(
      { text: m(show(z.neg())), value: -z.value(), why: `This subtracts the wrong way round, ${m(`\\frac{${mu} - ${x}}{${sigma}}`)}. The value is ${diff > 0 ? 'above' : 'below'} the mean, so ${m('z')} must be ${diff > 0 ? 'positive' : 'negative'}.` },
      { text: m(num(diff)), value: diff, why: `This is only the distance from the mean, ${m(`${x} - ${mu}`)}. You still have to divide by the standard deviation ${m(num(sigma))}.` },
      { text: m(show(new Frac(sigma, diff))), value: sigma / diff, why: `This is the fraction upside down, ${m(`${sigma} \\div ${diff < 0 ? `\\left(${num(diff)}\\right)` : num(diff)}`)}. The distance from the mean goes on top and the standard deviation on the bottom.` },
      { text: m(show(new Frac(x, sigma))), value: x / sigma, why: `This divides the value itself by the standard deviation, ${m(`\\frac{${x}}{${sigma}}`)}, forgetting to subtract the mean first.` },
      { text: m(show(new Frac(diff * sigma))), value: diff * sigma, why: `This multiplies the distance from the mean by the standard deviation instead of dividing by it.` },
    );
    const distractors = pickDistinct(ans, pool);
    return {
      stem: `${ctx.intro} have mean ${m(num(mu))} and ${spread}. Find the ${m('z')}-score of ${ctx.item} of ${m(num(x))}${u}.`,
      answer: ans.text,
      answerValue: ans.value,
      distractors,
      solution:
        varStep +
        `Use ${m('z = \\frac{x - \\mu}{\\sigma}')} with ${m(`x = ${x}`)}, ${m(`\\mu = ${mu}`)} and ${m(`\\sigma = ${sigma}`)}.\n\n` +
        `1. Distance from the mean: ${m(`${x} - ${mu} = ${num(diff)}`)}.\n` +
        `2. Divide by the standard deviation: ${m(`\\frac{${num(diff)}}{${sigma}} = ${show(z)}`)}.\n\n` +
        `So the value is ${m(show(z.value() < 0 ? z.neg() : z))} standard deviation${Math.abs(z.value()) === 1 ? '' : 's'} ${diff > 0 ? 'above' : 'below'} the mean.\n\n` +
        `Answer: ${ans.text}`,
      keyIdea: 'The $z$-score $z = \\frac{x - \\mu}{\\sigma}$ counts how many standard deviations a value is above (positive) or below (negative) the mean.',
    };
  }

  // find x from z
  const zs = z.value();
  const ans: Cand = { text: m(num(x)), value: x, why: '' };
  const pool: Cand[] = [];
  if (useVar)
    pool.push({
      text: m(num(mu + zs * sigma * sigma)),
      value: mu + zs * sigma * sigma,
      why: `This multiplies ${m('z')} by the **variance** ${m(num(sigma * sigma))} instead of the standard deviation ${m(num(sigma))}.`,
    });
  pool.push(
    { text: m(num(mu - zs * sigma)), value: mu - zs * sigma, why: `This goes the wrong way from the mean. A ${zs > 0 ? 'positive' : 'negative'} ${m('z')}-score means the value is ${zs > 0 ? 'above' : 'below'} the mean.` },
    { text: m(num(mu + zs)), value: mu + zs, why: `This adds ${m('z')} straight onto the mean, forgetting that ${m('z')} counts standard deviations: multiply it by ${m(num(sigma))} first.` },
    { text: m(num(zs * sigma)), value: zs * sigma, why: `This is only ${m('z\\sigma')}, the distance from the mean. You must add it to the mean ${m(num(mu))}.` },
    { text: m(show(new Frac(sigma).div(z).add(mu))), value: mu + sigma / zs, why: `This rearranges the formula wrongly and divides by ${m('z')}: ${m('\\mu + \\frac{\\sigma}{z}')}. The correct rearrangement is ${m('x = \\mu + z\\sigma')}.` },
    { text: m(num(zs * sigma - mu)), value: zs * sigma - mu, why: `This subtracts the mean instead of adding it. Rearranging ${m('z = \\frac{x - \\mu}{\\sigma}')} gives ${m('x = \\mu + z\\sigma')}.` },
  );
  const distractors = pickDistinct(ans, pool);
  return {
    stem: `${ctx.intro} have mean ${m(num(mu))} and ${spread}. One value has a ${m('z')}-score of ${m(show(z))}. What is the value?`,
    answer: ans.text,
    answerValue: ans.value,
    distractors,
    solution:
      varStep +
      `Rearrange ${m('z = \\frac{x - \\mu}{\\sigma}')} to get ${m('x = \\mu + z\\sigma')}.\n\n` +
      `1. Distance from the mean: ${m(`z\\sigma = ${zs < 0 ? `\\left(${show(z)}\\right)` : show(z)} \\times ${sigma} = ${num(zs * sigma)}`)}.\n` +
      `2. Add it to the mean: ${m(`x = ${mu} ${zs < 0 ? '-' : '+'} ${num(Math.abs(zs * sigma))} = ${num(x)}`)}.\n\n` +
      `Check: ${m(`\\frac{${num(x)} - ${mu}}{${sigma}} = ${show(z)}`)}.\n\n` +
      `Answer: ${ans.text}`,
    keyIdea: 'To turn a $z$-score back into a value use $x = \\mu + z\\sigma$; a negative $z$ means below the mean.',
  };
}

// ------------------------------------------------------------------ 68-95-99.7 rule
/** Percentages (in hundredths of a percent) of the normal curve in each band between -3, -2, ..., 3 SDs. */
const SEG = [15, 235, 1350, 3400, 3400, 1350, 235, 15];
const WITHIN: Record<number, number> = { 1: 6800, 2: 9500, 3: 9970 };
/** Hundredths of a percent between mu + a*sigma and mu + b*sigma (a < b, each in -4..4 where +-4 means +-infinity). */
function band(a: number, b: number): number {
  let s = 0;
  for (let i = a + 4; i < b + 4; i++) s += SEG[i];
  return s;
}

const RULE_CONTEXTS = [
  { what: 'The lifetimes of a type of light bulb', unit: 'hours', things: 'bulbs', pre: 'last', preB: 'last', mus: [800, 1000, 1200, 1500], sds: [50, 100, 150, 200] },
  { what: 'The heights of adult women in a city', unit: 'cm', things: 'women', pre: 'have a height of', preB: 'have a height', mus: [160, 162, 164, 165], sds: [5, 6, 7, 8] },
  { what: 'Scores in a national test', unit: 'marks', things: 'candidates', pre: 'score', preB: 'score', mus: [50, 55, 60, 65, 70], sds: [5, 8, 10, 12] },
  { what: 'The masses of bags of rice', unit: 'g', things: 'bags', pre: 'have a mass of', preB: 'have a mass', mus: [500, 1000, 2000], sds: [5, 10, 20, 25] },
  { what: 'Reaction times in a driving test', unit: 'ms', things: 'drivers', pre: 'have a reaction time of', preB: 'have a reaction time', mus: [250, 300, 350, 400], sds: [20, 25, 30, 40] },
] as const;

function empiricalRuleQuestion(rng: Rng) {
  const ctx = rng.pick(RULE_CONTEXTS);
  const mu = rng.pick(ctx.mus);
  const sd = rng.pick(ctx.sds);
  const kind = rng.pick(['between', 'between', 'above', 'below'] as const);
  let a = -4;
  let b = 4;
  if (kind === 'between') {
    for (;;) {
      a = rng.int(-3, 2);
      b = rng.int(a + 1, 3);
      if (!(a === 0 && b === 0)) break;
    }
  } else if (kind === 'above') {
    a = rng.pick([-3, -2, -1, 1, 2, 3]);
  } else {
    b = rng.pick([-3, -2, -1, 1, 2, 3]);
  }
  const ans = band(a, b);
  const val = (k: number) => mu + k * sd;
  const counting = rng.bool(0.4);
  let N = 0;
  if (counting) {
    for (;;) {
      N = rng.pick([200, 400, 500, 1000, 2000, 4000]);
      if ((ans * N) % 10000 === 0) break;
    }
  }
  const fmtH = (h: number) => (counting ? m(num((h * N) / 10000)) : `${num(h / 100)}%`);
  const valueOf = (h: number) => (counting ? (h * N) / 10000 : h / 100);
  const okValue = (h: number) => h >= 0 && h <= 10000 && (!counting || (h * N) % 10000 === 0);

  // ---- describe the interval
  const sdWord = (k: number) => {
    const n = Math.abs(k);
    if (k === 0) return 'the mean';
    return `${n === 1 ? '1 SD' : `${n} SDs`} ${k > 0 ? 'above' : 'below'} the mean`;
  };
  let region: string;
  if (kind === 'between') region = `${ctx.preB} between ${m(num(val(a)))} and ${m(num(val(b)))} ${ctx.unit}`;
  else if (kind === 'above') region = `${ctx.pre} more than ${m(num(val(a)))} ${ctx.unit}`;
  else region = `${ctx.pre} less than ${m(num(val(b)))} ${ctx.unit}`;

  // ---- step-by-step solution: list the bands that make up the region
  const steps: string[] = [];
  const boundaryLines: string[] = [];
  const boundary = (k: number) =>
    k === 0
      ? `- ${m(num(val(k)))} is the mean itself.`
      : `- ${m(`${num(val(k))} = ${mu} ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : `${Math.abs(k)} \\times `}${sd}`)} is ${sdWord(k)}.`;
  if (a > -4) boundaryLines.push(boundary(a));
  if (b < 4) boundaryLines.push(boundary(b));
  // split at the mean using symmetry
  const parts: { label: string; h: number }[] = [];
  const addSide = (lo: number, hi: number) => {
    // lo < hi, both on the same side of 0 (lo >= 0 or hi <= 0), +-4 = infinity
    if (lo >= 0) {
      if (hi === 4) parts.push({ label: lo === 0 ? 'above the mean' : `beyond ${sdWord(lo)}`, h: lo === 0 ? 5000 : (10000 - WITHIN[lo]) / 2 });
      else if (lo === 0) parts.push({ label: `from the mean up to ${sdWord(hi)}`, h: WITHIN[hi] / 2 });
      else parts.push({ label: `from ${sdWord(lo)} to ${sdWord(hi)}`, h: (WITHIN[hi] - WITHIN[lo]) / 2 });
    } else {
      if (lo === -4) parts.push({ label: hi === 0 ? 'below the mean' : `beyond ${sdWord(hi)}`, h: hi === 0 ? 5000 : (10000 - WITHIN[-hi]) / 2 });
      else if (hi === 0) parts.push({ label: `from ${sdWord(lo)} up to the mean`, h: WITHIN[-lo] / 2 });
      else parts.push({ label: `from ${sdWord(lo)} to ${sdWord(hi)}`, h: (WITHIN[-lo] - WITHIN[-hi]) / 2 });
    }
  };
  if (a < 0 && b > 0) {
    addSide(a, 0);
    addSide(0, b);
  } else addSide(a, b);
  parts.forEach((p) => {
    steps.push(`- ${p.label.charAt(0).toUpperCase() + p.label.slice(1)}: ${num(p.h / 100)}%`);
  });
  const total = parts.reduce((s, p) => s + p.h, 0);
  if (total !== ans) throw new Error('band bookkeeping mismatch');

  // ---- genuine mistakes
  const pool: { h: number; why: string }[] = [];
  const isTail = (kind === 'above' && a > 0) || (kind === 'below' && b < 0);
  const kOne = kind === 'above' ? a : kind === 'below' ? b : 0;
  if (isTail) {
    pool.push({ h: 2 * ans, why: `This is the percentage in **both** tails, ${m(`100\\% - ${num(WITHIN[Math.abs(kOne)] / 100)}\\%`)}. Only one tail is wanted, so it must be halved.` });
    pool.push({ h: WITHIN[Math.abs(kOne)] / 2, why: `This is the percentage between the mean and ${m(num(val(kOne)))}, not beyond it.` });
  }
  if (kind !== 'between' && !isTail) {
    pool.push({ h: WITHIN[Math.abs(kOne)], why: `This uses the whole ${num(WITHIN[Math.abs(kOne)] / 100)}% for within ${Math.abs(kOne)} SD${Math.abs(kOne) > 1 ? 's' : ''} of the mean, but the region is the whole ${kind === 'above' ? 'upper' : 'lower'} half of the curve (50%) plus only **half** of that band (${num(WITHIN[Math.abs(kOne)] / 200)}%).` });
    pool.push({ h: WITHIN[Math.abs(kOne)] / 2, why: `This only counts the part between ${m(num(val(kOne)))} and the mean, forgetting the whole ${kind === 'above' ? 'upper' : 'lower'} half of the curve (50%) on the other side of the mean.` });
  }
  if (kind === 'between') {
    const big = Math.max(Math.abs(a), Math.abs(b));
    const small = Math.min(Math.abs(a), Math.abs(b));
    if (a < 0 && b > 0) {
      pool.push({ h: WITHIN[big], why: `This treats the interval as if it went ${big} SDs **both** ways from the mean. Split it at the mean and add the halves: ${num(WITHIN[-a] / 200)}% + ${num(WITHIN[b] / 200)}%.` });
      if (small !== big) pool.push({ h: WITHIN[small], why: `This uses only the ${small}-SD figure on both sides. The interval goes ${Math.abs(a)} SD${Math.abs(a) > 1 ? 's' : ''} below but ${Math.abs(b)} SD${Math.abs(b) > 1 ? 's' : ''} above the mean, so split it at the mean.` });
      pool.push({ h: parts[1].h, why: `This only counts the part above the mean, from ${m(`${mu}`)} to ${m(num(val(b)))}, and leaves out the part below the mean.` });
    } else {
      const lo = Math.min(Math.abs(a), Math.abs(b));
      const hi = Math.max(Math.abs(a), Math.abs(b));
      if (lo > 0) {
        pool.push({ h: WITHIN[hi] - WITHIN[lo], why: `This finds the difference ${m(`${num(WITHIN[hi] / 100)}\\% - ${num(WITHIN[lo] / 100)}\\%`)} but forgets that this covers **both** sides of the mean; only one side is wanted, so halve it.` });
        pool.push({ h: WITHIN[hi] / 2, why: `This counts everything from the mean out to ${hi} SDs, forgetting to remove the part within ${lo} SD${lo > 1 ? 's' : ''} of the mean.` });
      } else {
        pool.push({ h: WITHIN[hi], why: `This uses the full ${num(WITHIN[hi] / 100)}% for within ${hi} SD${hi > 1 ? 's' : ''} on **both** sides of the mean, but the interval only goes on one side, so halve it.` });
      }
    }
  }
  pool.push({ h: 10000 - ans, why: `This is the part **outside** the region (the complement), so it answers the opposite question.` });
  // miscounting how many SDs a boundary is from the mean (e.g. calling 2 SDs "3 SDs")
  for (const [which, k] of [['a', a], ['b', b]] as const) {
    if (k === 0 || Math.abs(k) === 4) continue;
    for (const step of [1, -1]) {
      const k2 = k + Math.sign(k) * step;
      if (Math.abs(k2) < 1 || Math.abs(k2) > 3) continue;
      const a2 = which === 'a' ? k2 : a;
      const b2 = which === 'b' ? k2 : b;
      if (a2 >= b2) continue;
      pool.push({ h: band(a2, b2), why: `This miscounts the standard deviations: ${m(num(val(k)))} has ${m(`z = \\frac{${num(val(k))} - ${mu}}{${sd}} = ${k}`)}, so it is ${Math.abs(k)} SD${Math.abs(k) > 1 ? 's' : ''} from the mean, not ${Math.abs(k2)}.` });
    }
  }
  // band-counting slips as last-resort fallbacks
  for (const d of [3400, -3400, 1350, -1350, 235, -235, 5000, -5000])
    pool.push({ h: ans + d, why: `This includes or leaves out one band of the curve (${num(Math.abs(d) / 100)}%) by mistake when adding up the pieces.` });

  const answerText = fmtH(ans);
  const answerC: Cand = { text: answerText, value: valueOf(ans), why: '' };
  const cands: Cand[] = pool.filter((p) => okValue(p.h)).map((p) => ({ text: fmtH(p.h), value: valueOf(p.h), why: p.why }));
  const distractors = pickDistinct(answerC, cands);

  const question = counting
    ? `Out of ${m(num(N))} ${ctx.things}, about how many ${region}?`
    : `About what percentage of the ${ctx.things} ${region}?`;
  return {
    stem: `${ctx.what} are normally distributed with mean ${m(num(mu))} ${ctx.unit} and standard deviation ${m(num(sd))} ${ctx.unit}. Using the 68-95-99.7 rule: ${question}`,
    answer: answerText,
    answerValue: answerC.value,
    distractors,
    solution:
      `**Step 1: count standard deviations from the mean.**\n\n${boundaryLines.join('\n')}\n\n` +
      `**Step 2: use the rule and symmetry.** Within 1, 2 and 3 SDs of the mean lie 68%, 95% and 99.7%; each half of the curve holds 50%, and each side of the mean gets half of each figure.\n\n` +
      `${steps.join('\n')}\n\n` +
      (parts.length > 1 ? `Add the pieces: ${parts.map((p) => `${num(p.h / 100)}%`).join(' + ')} = ${num(ans / 100)}%.\n\n` : `So the percentage is ${num(ans / 100)}%.\n\n`) +
      (counting ? `**Step 3: convert to a number.** ${m(`${num(ans / 100)}\\% \\times ${N} = ${num(ans / 10000)} \\times ${N} = ${num((ans * N) / 10000)}`)}.\n\n` : '') +
      `Answer: ${answerText}`,
    keyIdea: 'Mark the boundaries in SDs from the mean, then build the area from 68-95-99.7 using symmetry (each side of the mean gets half).',
  };
}

// ------------------------------------------------------------------ line of best fit prediction
const GRADIENTS = [-3, -2.5, -2, -1.5, -0.5, 0.5, 1.5, 2, 2.5, 3, 4];
const OFFSETS = [-2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5];

function bestFitQuestion(rng: Rng) {
  let grad = 1;
  let xbar = 0;
  let ybar = 0;
  // re-roll until the intercept is non-zero (keeps the working free of "+ 0")
  do {
    grad = rng.pick(GRADIENTS);
    xbar = rng.int(4, 10);
    ybar = rng.int(25, 60);
  } while (ybar - grad * xbar === 0);
  const d0 = rng.pick(OFFSETS);
  const x0 = xbar + d0;
  const c = ybar - grad * xbar;
  const ans = grad * x0 + c;

  // scatter with residuals symmetric in d and summing to 0, so the least-squares line is exactly y = grad*x + c
  const s = rng.pick([0.5, 1, 1.5]);
  const r1 = rng.pick([-2, -1, 1, 2]) * s;
  const r2 = rng.pick([-1, 0, 1]) * s;
  const r3 = rng.pick([-1, 1]) * s;
  const res: Record<number, number> = { 3: r1, 2: r2, 1: r3, 0: -2 * (r1 + r2 + r3), [-1]: r3, [-2]: r2, [-3]: r1 };
  const points = [-3, -2, -1, 0, 1, 2, 3].map((d) => ({ x: xbar + d, y: ybar + grad * d + res[d] }));

  const answerC: Cand = { text: m(num(ans)), value: ans, why: '' };
  const pool: Cand[] = [
    { text: m(num(grad * x0)), value: grad * x0, why: `This is just ${m(`${num(grad)} \\times ${num(x0)}`)}, as if the line went through the origin. You need the intercept, found from the mean point.` },
    { text: m(num(grad * x0 + ybar)), value: grad * x0 + ybar, why: `This uses ${m(`\\bar{y} = ${ybar}`)} as the intercept. The intercept is the value of ${m('y')} at ${m('x = 0')}, not at ${m(`x = ${xbar}`)}.` },
    { text: m(num(ybar + d0)), value: ybar + d0, why: `This adds the change in ${m('x')} (${m(num(d0))}) straight onto ${m('\\bar{y}')}, forgetting to multiply it by the gradient ${m(num(grad))}.` },
    { text: m(num(ybar - grad * d0)), value: ybar - grad * d0, why: `This moves ${m('y')} the wrong way: with gradient ${m(num(grad))}, a change of ${m(num(d0))} in ${m('x')} changes ${m('y')} by ${m(num(grad * d0))}, not ${m(num(-grad * d0))}.` },
    { text: m(num(grad * x0 + ybar + grad * xbar)), value: grad * x0 + ybar + grad * xbar, why: `This makes a sign error finding the intercept: from ${m(`${ybar} = ${num(grad)} \\times ${xbar} + c`)} you subtract, giving ${m(`c = ${num(c)}`)}.` },
  ];
  const distractors = pickDistinct(answerC, pool);
  const gTimesX = grad < 0 ? `\\left(${num(grad)}\\right) \\times` : `${num(grad)} \\times`;
  return {
    stem: `The scatter plot shows 7 data points. Their line of best fit has gradient ${m(num(grad))} and passes through the mean point ${m(`(\\bar{x}, \\bar{y}) = (${xbar}, ${ybar})`)}. Use the line to predict ${m('y')} when ${m(`x = ${num(x0)}`)}.`,
    chart: { kind: 'scatter' as const, title: 'Data and line of best fit', xLabel: 'x', yLabel: 'y', points, line: { slope: grad, intercept: c } },
    answer: answerC.text,
    answerValue: ans,
    distractors,
    solution:
      `The line of best fit always passes through the mean point ${m('(\\bar{x}, \\bar{y})')}.\n\n` +
      `1. Write the line as ${m(`y = ${num(grad)}x + c`)}.\n` +
      `2. Substitute ${m(`(${xbar}, ${ybar})`)}: ${m(`${ybar} = ${gTimesX} ${xbar} + c = ${num(grad * xbar)} + c`)}, so ${m(`c = ${ybar} ${grad * xbar < 0 ? '+' : '-'} ${num(Math.abs(grad * xbar))} = ${num(c)}`)}.\n` +
      `3. At ${m(`x = ${num(x0)}`)}: ${m(`y = ${gTimesX} ${num(x0)} ${c < 0 ? '-' : '+'} ${num(Math.abs(c))} = ${num(grad * x0)} ${c < 0 ? '-' : '+'} ${num(Math.abs(c))} = ${num(ans)}`)}.\n\n` +
      `Quick check: ${m('x')} changes by ${m(num(d0))} from the mean point, so ${m('y')} changes by ${m(`${num(grad)} \\times ${d0 < 0 ? `\\left(${num(d0)}\\right)` : num(d0)} = ${num(grad * d0)}`)}, giving ${m(`${ybar} ${grad * d0 < 0 ? '-' : '+'} ${num(Math.abs(grad * d0))} = ${num(ans)}`)}.\n\n` +
      `Answer: ${answerC.text}`,
    keyIdea: 'A line of best fit passes through $(\\bar{x}, \\bar{y})$; use it with the gradient to find the intercept, then substitute the new $x$.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-correlation-normal-z-score',
    subtopic: 'correlation-normal',
    difficulty: 'foundation',
    title: 'Find a z-score, or a value from its z-score',
    generate: zScoreQuestion,
  },
  {
    id: 'gen-correlation-normal-empirical-rule',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    title: 'Percentages and counts with the 68-95-99.7 rule',
    generate: empiricalRuleQuestion,
  },
  {
    id: 'gen-correlation-normal-best-fit',
    subtopic: 'correlation-normal',
    difficulty: 'exam',
    title: 'Predict from a line of best fit through the mean point',
    generate: bestFitQuestion,
  },
];
