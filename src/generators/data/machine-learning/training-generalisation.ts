import type { Generator, GeneratedCore } from '../../../types';
import { steps } from '../../../lib/explanation';
import { Frac } from '../../../lib/frac';
import { round } from '../../../lib/mathx';
import { m, num } from '../../../lib/tex';
import type { Rng } from '../../../lib/rng';

type Cand = { value: number; text: string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: Cand, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const same = (a: Cand, b: Cand) => Math.abs(a.value - b.value) < 1e-9 || a.text === b.text;
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value) || same(c, answer) || out.some((o) => same(o, c))) continue;
    out.push(c);
  }
  return out;
}

/** Value rounded to 2 d.p. and shown with exactly 2 decimal places (e.g. 0.60, -1.25). */
const dp2 = (v: number): number => round(v, 2);
const show2 = (v: number): string => m(dp2(v).toFixed(2));
/** " To 2 decimal places, that is 0.60.", unless the working already shows it in that form. */
const toTwoPlaces = (v: number): string => (num(v) === dp2(v).toFixed(2) ? '' : ` To 2 decimal places, that is ${show2(v)}.`);

// ---------------------------------------------------------------- feature scaling contexts
interface ScaleCtx {
  los: number[];
  ranges: number[]; // all multiples of 20
}

const SCALE_CTX: ScaleCtx[] = [
  { los: [40, 50, 60, 80, 100], ranges: [80, 100, 120, 160, 200] },
  { los: [10, 20], ranges: [40, 60] },
  { los: [16, 18, 20, 25], ranges: [40, 60] },
  { los: [60, 100, 120, 150], ranges: [200, 240, 300, 400] },
  { los: [5, 8, 10, 12], ranges: [20, 40, 60] },
];

function minMaxCore(rng: Rng): GeneratedCore {
  for (;;) {
    const ctx = rng.pick(SCALE_CTX);
    const lo = rng.pick(ctx.los);
    const r = rng.pick(ctx.ranges);
    const hi = lo + r;
    const outside = rng.bool(0.25); // a new test value outside the training range
    const j = outside ? rng.pick([-3, -2, -1, 21, 22, 23, 24, 25]) : rng.int(1, 19);
    const x = lo + (j * r) / 20;
    if (x <= 0) continue;
    const exact = new Frac(x - lo, r);
    const ans: Cand = { value: dp2(exact.value()), text: show2(exact.value()), why: '' };

    const mk = (v: number, why: string): Cand => ({ value: dp2(v), text: show2(v), why });
    const pool: Cand[] = [
      mk(x / hi, `This is ${m(`\\frac{${x}}{${hi}}`)}: it divides by the maximum and forgets to subtract the minimum at all.`),
      mk((x - lo) / hi, `This is ${m(`\\frac{${x} - ${lo}}{${hi}}`)}: it subtracts the minimum on top but divides by the maximum instead of the range ${m(`${hi} - ${lo} = ${r}`)}.`),
      mk((hi - x) / r, `This is ${m(`\\frac{${hi} - ${x}}{${r}}`)}: the subtraction is the wrong way round (distance from the maximum instead of from the minimum).`),
      mk(x / r, `This is ${m(`\\frac{${x}}{${r}}`)}: it divides by the correct range but forgets to subtract the minimum from the value first.`),
      ...(outside
        ? [
            mk(
              j > 20 ? 1 : 0,
              `This assumes min-max scaled values must stay between ${m('0')} and ${m('1')}. That is only guaranteed for the training data: with the training minimum and maximum, a value outside the training range scales to outside ${m('[0, 1]')}.`,
            ),
          ]
        : []),
    ];
    const ds = pickDistinct(ans, pool);
    if (ds.length < 3) continue;

    const stem = outside
      ? `A min-max scaler fitted on **training** data has minimum ${m(String(lo))} and maximum ${m(String(hi))}. A **test** example has the value ${m(String(x))}. What is its scaled value, to 2 decimal places?`
      : `A feature has a training minimum of ${m(String(lo))} and a maximum of ${m(String(hi))}. Using **min-max scaling** to the range ${m('[0, 1]')}, what is the scaled value of ${m(String(x))}, to 2 decimal places?`;
    const showFrac = Math.abs(exact.n) === Math.abs(x - lo) && exact.d === r ? '' : ` = ${exact.tex()}`;
    const numer = x - lo < 0 ? `-\\frac{${lo - x}}{${r}}` : `\\frac{${x - lo}}{${r}}`;
    const above = j > 20;
    return {
      stem,
      answer: ans.text,
      answerValue: ans.value,
      distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      asking: `Where does ${m(String(x))} land on the scale where the ${outside ? 'training ' : ''}minimum is ${m('0')} and the maximum is ${m('1')}?`,
      solution: steps(
        `**Min-max scaling** puts values on a ${m('0')} to ${m('1')} scale, so the minimum becomes ${m('0')} and the maximum becomes ${m('1')}. The formula is $x' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$, where $x$ is the value and $x'$ is its scaled value.`,
        outside &&
          `The scaler keeps the training minimum ${m(String(lo))} and maximum ${m(String(hi))}, even though ${m(String(x))} is ${above ? 'above' : 'below'} that range. Changing them would let test data affect the scaler.`,
        `The top of the fraction asks how far the value is from the minimum: ${m(`${x} - ${lo} = ${x - lo}`)}.`,
        `The bottom is the **range**, the distance from minimum to maximum: ${m(`${hi} - ${lo} = ${r}`)}.`,
        `Divide: ${m(`${numer}${showFrac} = ${num(exact.value())}`)}.${toTwoPlaces(exact.value())}`,
      ),
      conclusion: outside
        ? `${m(String(x))} is ${above ? 'above the training maximum' : 'below the training minimum'}, so its scaled value lands ${above ? `above ${m('1')}` : `below ${m('0')}`}, at ${ans.text}.`
        : `${m(String(x))} is ${x - lo} of the way along a range of ${r}, so its scaled value is ${ans.text}.`,
      keyIdea: 'Min-max scaling is $\\frac{\\text{value} - \\text{min}}{\\text{max} - \\text{min}}$, using the training minimum and maximum. The minimum must give 0 and the maximum must give 1. Test values outside the training range land outside 0 to 1, which is normal.',
    };
  }
}

function zScoreCore(rng: Rng): GeneratedCore {
  for (;;) {
    const mu = 5 * rng.int(4, 30);
    const givesVar = rng.bool(0.4);
    const sigma = givesVar ? rng.pick([2, 3, 4, 5, 6, 8, 10]) : rng.pick([2, 4, 5, 8, 10, 12, 15, 20]);
    const jz = rng.intNonZero(-10, 10);
    const z = new Frac(jz, 4);
    const dev = z.mul(sigma);
    if (!dev.isInt()) continue;
    const x = mu + dev.n;
    if (x <= 0) continue;
    const d = x - mu;
    const ans: Cand = { value: dp2(z.value()), text: show2(z.value()), why: '' };
    const mk = (v: number, why: string): Cand => ({ value: dp2(v), text: show2(v), why });
    const v2 = sigma * sigma;
    const dOverV = d < 0 ? `-\\frac{${-d}}{${v2}}` : `\\frac{${d}}{${v2}}`;
    const pool: Cand[] = [
      mk(d, `This is ${m(`${x} - ${mu} = ${d}`)}: it subtracts the mean but forgets to divide by the standard deviation.`),
      mk(x / sigma, `This is ${m(`\\frac{${x}}{${sigma}}`)}: it divides by the standard deviation but forgets to subtract the mean first.`),
      mk(
        d / v2,
        givesVar
          ? `This is ${m(dOverV)}: it divides by the **variance** ${m(String(v2))} instead of the standard deviation ${m(`\\sqrt{${v2}} = ${sigma}`)}.`
          : `This is ${m(dOverV)}: it squares the standard deviation (dividing by the variance ${m(`${sigma}^2 = ${v2}`)}) instead of dividing by ${m(String(sigma))} itself.`,
      ),
      mk(-d / sigma, `This is ${m(`\\frac{${mu} - ${x}}{${sigma}}`)}: the subtraction is the wrong way round, which flips the sign. A value ${d > 0 ? 'above' : 'below'} the mean must have a ${d > 0 ? 'positive' : 'negative'} z-score.`),
    ];
    const ds = pickDistinct(ans, pool);
    if (ds.length < 3) continue;

    const spread = givesVar
      ? `mean ${m(String(mu))} and variance ${m(String(v2))}`
      : `mean ${m(String(mu))} and standard deviation ${m(String(sigma))}`;
    // z = d / sigma, written with the minus sign outside the fraction; show the reduced
    // fraction only when it differs, and the decimal only when z is not a whole number.
    const zFracRaw = d < 0 ? `-\\frac{${-d}}{${sigma}}` : `\\frac{${d}}{${sigma}}`;
    const zReduced = Math.abs(z.n) === Math.abs(d) && z.d === sigma ? '' : ` = ${z.tex()}`;
    const zDecimal = z.isInt() ? '' : ` = ${num(z.value())}`;
    const absZ = Math.abs(z.value());
    return {
      stem: `A feature is **standardised** using its training ${spread}. What is the standardised value (z-score) of ${m(String(x))}, to 2 decimal places?`,
      answer: ans.text,
      answerValue: ans.value,
      distractors: ds.map((c) => ({ text: c.text, value: c.value, why: c.why })),
      asking: `How many standard deviations is ${m(String(x))} from the mean, and on which side?`,
      solution: steps(
        `**Standardising** a value means asking how many standard deviations it is from the mean. The formula is ${m('z = \\frac{x - \\mu}{\\sigma}')}, where ${m('x')} is the value, ${m('\\mu')} is the mean and ${m('\\sigma')} is the standard deviation (the typical distance from the mean).`,
        givesVar &&
          `The question gives the **variance**, which is the standard deviation squared. To undo the squaring, take the square root: ${m(`\\sigma = \\sqrt{${v2}} = ${sigma}`)}.`,
        `Subtract the mean to see how far the value is from it: ${m(`${x} - ${mu} = ${d}`)}. ${d > 0 ? 'It is positive, so the value is above the mean.' : 'The minus sign shows the value is below the mean.'}`,
        `Divide by the standard deviation to count how many standard deviations that is: ${m(`z = ${zFracRaw}${zReduced}${zDecimal}`)}.${toTwoPlaces(z.value())}`,
      ),
      conclusion: `${m(String(x))} is ${m(num(absZ))} standard deviation${absZ === 1 ? '' : 's'} ${d > 0 ? 'above' : 'below'} the mean, so its z-score is ${ans.text}.`,
      keyIdea: 'A z-score is (value minus mean) divided by the standard deviation. If you are given the variance, take its square root first. Values below the mean get negative z-scores, so the sign must match the side.',
    };
  }
}

// ---------------------------------------------------------------- data-split counting
function kfoldTrainCore(rng: Rng): GeneratedCore {
  for (;;) {
    const k = rng.pick([4, 5, 8, 10]);
    const f = 10 * rng.int(2, 30);
    const N = k * f;
    const answer = (k - 1) * f;
    const ans: Cand = { value: answer, text: m(String(answer)), why: '' };
    const mk = (v: number, why: string): Cand => ({ value: v, text: m(String(v)), why });
    const pool: Cand[] = [
      mk(f, `This is the size of **one** fold, ${m(`\\frac{${N}}{${k}} = ${f}`)}, which is the part held out for **validation** in each round.`),
      mk(N, `This forgets that one fold is held out every round; training on all ${m(String(N))} examples would leave nothing to validate on.`),
      mk(answer * k, `This is ${m(`${answer} \\times ${k}`)}, the total number of training examples summed over all ${m(String(k))} rounds, not the number in one round.`),
      mk(N - k, `This holds out only ${m(String(k))} examples (one per fold) instead of a whole fold of ${m(String(f))} examples.`),
    ];
    const ds = pickDistinct(ans, pool);
    if (ds.length < 3) continue;
    return {
      stem: `A model is evaluated with **${k}-fold cross-validation** on a dataset of ${m(String(N))} examples. In each round, how many examples are used to **train** the model?`,
      answer: ans.text,
      answerValue: answer,
      distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      asking: `In one round, how many of the ${m(String(N))} examples does the model train on?`,
      solution: steps(
        `In **${k}-fold cross-validation**, the data is cut into ${m(String(k))} equal parts called **folds**. Each round, one fold is kept aside to check the model, and the rest are used for training.`,
        `Find the size of one fold: ${m(`\\frac{${N}}{${k}} = ${f}`)} examples.`,
        `One fold is kept aside, which leaves ${m(`${k} - 1 = ${k - 1}`)} folds for training.`,
        `Multiply to get the training examples: ${m(`${k - 1} \\times ${f} = ${answer}`)}.`,
      ),
      conclusion: `${m(String(k - 1))} folds of ${m(String(f))} examples each gives ${ans.text} training examples per round.`,
      keyIdea: 'In $k$-fold cross-validation, each round trains on $k - 1$ folds and checks on the other one. So one fold is the total divided by $k$, and training size is $k - 1$ times that.',
    };
  }
}

function modelCountCore(rng: Rng): GeneratedCore {
  for (;;) {
    const h = rng.int(2, 8);
    const k = rng.pick([3, 4, 5, 10]);
    const N = k * 10 * rng.int(5, 40);
    const what = rng.pick(['values of the regularisation strength $\\lambda$', 'polynomial degrees', 'values of the learning rate', 'network sizes']);
    const answer = h * k + 1;
    const ans: Cand = { value: answer, text: m(String(answer)), why: '' };
    const mk = (v: number, why: string): Cand => ({ value: v, text: m(String(v)), why });
    const pool: Cand[] = [
      mk(h * k, `This is ${m(`${h} \\times ${k}`)}, which forgets the final model retrained on all the data.`),
      mk(h + k, `This adds instead of multiplying: ${m(`${h} + ${k}`)}. Every setting needs all ${m(String(k))} folds, so it is ${m(`${h} \\times ${k}`)}.`),
      mk(k + 1, `This is ${m(`${k} + 1`)}: it runs cross-validation for only one setting, forgetting that all ${m(String(h))} settings must be cross-validated.`),
      mk(h * k + h, `This retrains a final model for **every** setting (${m(`${h} \\times ${k} + ${h}`)}). Only the single best setting is retrained on all the data.`),
    ];
    const ds = pickDistinct(ans, pool);
    if (ds.length < 3) continue;
    return {
      stem: `${m(String(h))} different ${what} are compared using **${k}-fold cross-validation** on ${m(String(N))} examples, then one final model is trained on all the data. In total, how many times is a model trained?`,
      answer: ans.text,
      answerValue: answer,
      distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      asking: 'How many training runs does this whole process take in total?',
      solution: steps(
        `In **${k}-fold cross-validation**, the data is cut into ${m(String(k))} equal parts called **folds**. Each fold takes one turn as the part held back, so testing one setting trains a model ${m(String(k))} times.`,
        `There are ${m(String(h))} settings to compare, and each needs its own full cross-validation. So multiply: ${m(`${h} \\times ${k} = ${h * k}`)} training runs.`,
        `The ${m(String(N))} examples only decide the size of each fold, which is ${m(`\\frac{${N}}{${k}} = ${N / k}`)}. They don't change how many times a model is trained.`,
        `The question adds one final model on all the data, which is one more run: ${m(`${h * k} + 1 = ${answer}`)}.`,
      ),
      conclusion: `${m(String(h * k))} runs to compare the settings, plus ${m('1')} final model, gives ${ans.text} training runs.`,
      keyIdea: 'To count training runs: settings $\\times$ folds, plus 1 if a final model is trained on all the data. The number of examples changes the fold size only, not the number of runs.',
    };
  }
}

const SPLITS: [number, number, number][] = [
  [70, 15, 15],
  [60, 20, 20],
  [80, 10, 10],
  [70, 20, 10],
  [75, 15, 10],
  [60, 25, 15],
  [80, 15, 5],
];
const SET_NAMES = ['training', 'validation', 'test'];

function splitCore(rng: Rng): GeneratedCore {
  for (;;) {
    const p = rng.pick(SPLITS);
    const N = 20 * rng.int(25, 250);
    const which = rng.int(0, 2);
    const size = (i: number) => (N * p[i]) / 100;
    const answer = size(which);
    const o1 = (which + 1) % 3;
    const o2 = (which + 2) % 3;
    const ans: Cand = { value: answer, text: m(String(answer)), why: '' };
    const mk = (v: number, why: string): Cand => ({ value: v, text: m(String(v)), why });
    const pool: Cand[] = [
      mk(size(o1), `This is ${m(`${p[o1]}\\%`)} of ${m(String(N))}, the size of the **${SET_NAMES[o1]}** set.`),
      mk(size(o2), `This is ${m(`${p[o2]}\\%`)} of ${m(String(N))}, the size of the **${SET_NAMES[o2]}** set.`),
      mk(N - answer, `This is ${m(`${N} - ${answer}`)}: everything **except** the ${SET_NAMES[which]} set, not the ${SET_NAMES[which]} set itself.`),
      mk(size(o1) + size(o2), `This adds the other two sets together instead of finding the ${SET_NAMES[which]} set.`),
      mk((N * p[which]) / 10, `This is a decimal-point slip: ${m(`${p[which]}\\%`)} is ${m(num(p[which] / 100))}, not ${m(num(p[which] / 10))}.`),
    ];
    const ds = pickDistinct(ans, pool);
    if (ds.length < 3) continue;
    return {
      stem: `A dataset of ${m(String(N))} examples is split into ${m(`${p[0]}\\%`)} training, ${m(`${p[1]}\\%`)} validation and ${m(`${p[2]}\\%`)} test. How many examples are in the **${SET_NAMES[which]}** set?`,
      answer: ans.text,
      answerValue: answer,
      distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      asking: `How many of the ${m(String(N))} examples go into the ${SET_NAMES[which]} set?`,
      solution: steps(
        `The question says the ${SET_NAMES[which]} set is ${m(`${p[which]}\\%`)} of the data, so we need ${m(`${p[which]}\\%`)} of ${m(String(N))}.`,
        `To find a percentage of a number, write it as a decimal by dividing by 100: ${m(`${p[which]} \\div 100 = ${num(p[which] / 100)}`)}. Then multiply: ${m(`${num(p[which] / 100)} \\times ${N} = ${answer}`)}.`,
      ),
      conclusion: `${m(`${p[which]}\\%`)} of ${m(String(N))} gives ${ans.text} examples in the ${SET_NAMES[which]} set.`,
      keyIdea: 'Size of a split $=$ its percentage as a decimal $\\times$ the total. Match each set to its percentage in the order stated. The three sizes must add back to the total.',
    };
  }
}

// ---------------------------------------------------------------- regularised loss
function regLossCore(rng: Rng): GeneratedCore {
  for (;;) {
    const nw = rng.pick([2, 3]);
    const w: number[] = [];
    for (let i = 0; i < nw; i++) w.push(rng.intNonZero(-5, 5));
    if (!w.some((x) => x < 0)) continue; // need a negative weight so the sign mistakes differ
    const isL2 = rng.bool(0.7);
    const mse = new Frac(rng.int(5, 60), 10);
    const lam = rng.pick([new Frac(1, 100), new Frac(1, 20), new Frac(1, 10), new Frac(1, 5), new Frac(1, 2)]);
    const sq = w.reduce((a, x) => a + x * x, 0);
    const ab = w.reduce((a, x) => a + Math.abs(x), 0);
    const signedSq = w.reduce((a, x) => a + Math.sign(x) * x * x, 0);
    const plain = w.reduce((a, x) => a + x, 0);
    const pen = isL2 ? sq : ab;
    const negW = w.find((x) => x < 0) as number;
    const J = mse.add(lam.mul(pen));
    const show = (f: Frac) => m(num(f.value()));
    const ans: Cand = { value: J.value(), text: show(J), why: '' };
    const mk = (f: Frac, why: string): Cand => ({ value: f.value(), text: show(f), why });
    const L = num(lam.value());
    const pool: Cand[] = isL2
      ? [
          mk(mse.add(lam.mul(ab)), `This uses absolute values instead of squares, ${m(`${L} \\times ${ab}`)}, which is the **L1** penalty, not L2.`),
          mk(mse.add(sq), `This forgets to multiply the penalty by ${m('\\lambda')}: ${m(`${num(mse.value())} + ${sq}`)}.`),
          mk(mse.add(lam.mul(signedSq)), `This treats the square of a negative weight as negative (writing ${m(`(${negW})^2 = ${-negW * negW}`)} instead of ${m(String(negW * negW))}). A squared number is never negative.`),
          mk(mse.add(lam.mul(plain * plain)), `This squares the **sum** of the weights, ${m(`\\left(\\sum w_i\\right)^2 = ${plain * plain}`)}, instead of summing the squares.`),
          mk(lam.mul(sq), `This is only the penalty ${m(`${L} \\times ${sq}`)}; it forgets to add the MSE.`),
        ]
      : [
          mk(mse.add(lam.mul(sq)), `This squares the weights, ${m(`${L} \\times ${sq}`)}, which is the **L2** penalty, not L1.`),
          mk(mse.add(ab), `This forgets to multiply the penalty by ${m('\\lambda')}: ${m(`${num(mse.value())} + ${ab}`)}.`),
          mk(mse.add(lam.mul(plain)), `This adds the weights with their signs (${m(`\\sum w_i = ${plain}`)}) instead of their absolute values, so negative weights cancel positive ones.`),
          mk(lam.mul(ab), `This is only the penalty ${m(`${L} \\times ${ab}`)}; it forgets to add the MSE.`),
        ];
    const ds = pickDistinct(ans, pool);
    if (ds.length < 3) continue;

    const wDesc = w.map((x, i) => m(`w_{${i + 1}} = ${x}`)).join(', ');
    const penTex = isL2 ? '\\lambda \\sum w_i^2' : '\\lambda \\sum |w_i|';
    const terms = isL2
      ? w.map((x) => (x < 0 ? `(${x})^2` : `${x}^2`)).join(' + ')
      : w.map((x) => `|${x}|`).join(' + ');
    const vals = isL2 ? w.map((x) => x * x).join(' + ') : w.map((x) => Math.abs(x)).join(' + ');
    return {
      stem:
        `A linear model has a training mean squared error of ${m(num(mse.value()))} and weights ${wDesc}. ` +
        `**${isL2 ? 'L2' : 'L1'} regularisation** with ${m(`\\lambda = ${L}`)} adds the penalty ${m(penTex)} to the loss. What is the regularised loss?`,
      answer: ans.text,
      answerValue: ans.value,
      distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
      asking: `What is the total loss once the ${isL2 ? 'L2' : 'L1'} penalty for large weights is added?`,
      solution: steps(
        `**Regularisation** adds a penalty when a model's weights (the numbers it learns) get large, to discourage an over-complicated model. So regularised loss ${m('=')} mean squared error (MSE) ${m('+')} penalty.`,
        isL2
          ? `In the penalty ${m(penTex)}, the symbol ${m('\\sum')} means "add up" and ${m('w_i')} is each weight. So square each weight, then add: ${m(`${terms} = ${vals} = ${pen}`)}. A negative number squared is positive.`
          : `In the penalty ${m(penTex)}, the symbol ${m('\\sum')} means "add up" and ${m('|w_i|')} is each weight's absolute value (its size, ignoring any minus sign). So add those up: ${m(`${terms} = ${vals} = ${pen}`)}.`,
        `Next, ${m('\\lambda')} (lambda) sets how strong the penalty is, so multiply by it: ${m(`${L} \\times ${pen} = ${num(lam.mul(pen).value())}`)}.`,
        `Add the penalty to the MSE: ${m(`${num(mse.value())} + ${num(lam.mul(pen).value())} = ${num(J.value())}`)}.`,
      ),
      conclusion: `The MSE of ${m(num(mse.value()))} plus the penalty of ${m(num(lam.mul(pen).value()))} gives a regularised loss of ${ans.text}.`,
      keyIdea: isL2
        ? 'L2 regularised loss $=$ MSE $+ \\lambda \\times$ (sum of the squared weights). Square each weight, add, multiply by $\\lambda$, then add the MSE. A negative weight squared is positive.'
        : 'L1 regularised loss $=$ MSE $+ \\lambda \\times$ (sum of the absolute weights). Drop any minus signs, add, multiply by $\\lambda$, then add the MSE. L1 never squares the weights.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-training-generalisation-feature-scaling',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    title: 'Feature scaling: min-max scaling or standardisation (z-score)',
    generate(rng) {
      return rng.bool(0.5) ? minMaxCore(rng) : zScoreCore(rng);
    },
  },
  {
    id: 'gen-training-generalisation-split-counts',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    title: 'Counting examples and models in data splits and k-fold cross-validation',
    generate(rng) {
      const mode = rng.int(0, 2);
      if (mode === 0) return kfoldTrainCore(rng);
      if (mode === 1) return modelCountCore(rng);
      return splitCore(rng);
    },
  },
  {
    id: 'gen-training-generalisation-regularised-loss',
    subtopic: 'training-generalisation',
    difficulty: 'exam',
    title: 'Compute an L2 or L1 regularised loss',
    generate(rng) {
      return regLossCore(rng);
    },
  },
];
