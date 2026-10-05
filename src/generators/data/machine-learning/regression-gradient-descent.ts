import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { dm, m, num, paren, signed } from '../../../lib/tex';

const SUB = 'regression-gradient-descent';

type Cand = { v: number; text: string; why: string };

/** Round away floating-point noise (all our values have at most 4 decimal places). */
const r4 = (x: number) => Math.round(x * 10000) / 10000;

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: number, answerText: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.v)) continue;
    if (r4(c.v) === r4(answer) || c.text === answerText) continue;
    if (out.some((o) => r4(o.v) === r4(c.v) || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

/** Clean LaTeX for w*v + b with decimal coefficients: "2x + 1", "x - 3", "0.5x", "-x + 2". */
function lin(w: number, v: string, b: number): string {
  let s: string;
  if (w === 1) s = v;
  else if (w === -1) s = `-${v}`;
  else s = `${num(w)}${v}`;
  return b === 0 ? s : s + signed(b);
}

// ---------------------------------------------------------------- 1. one gradient descent step
function gdStep(rng: Rng): GeneratedCore {
  for (;;) {
    const eta = rng.pick([0.01, 0.02, 0.05, 0.1]);
    const kind = rng.pick(['example', 'example', 'bowl'] as const);
    let stem: string;
    let w: number;
    let grad: number;
    let gradNo2: number; // derivative without the factor 2
    let gradNoX: number | null; // derivative without the chain-rule factor x
    let workGrad: string;
    if (kind === 'example') {
      const x = rng.int(1, 4);
      w = rng.int(-2, 4);
      const e = rng.intNonZero(-6, 6); // error = wx - y
      const y = w * x - e;
      grad = 2 * e * x;
      gradNo2 = e * x;
      gradNoX = x === 1 ? null : 2 * e;
      const ctx = rng.pick([
        'A simple model with no bias, $\\hat{y} = wx$,',
        'A one-weight linear model $\\hat{y} = wx$',
        'A linear regression model through the origin, $\\hat{y} = wx$,',
      ]);
      stem =
        `${ctx} is trained on a single example $(x, y) = (${num(x)}, ${num(y)})$ using the squared-error loss $L = (wx - y)^2$. ` +
        `The weight is currently $w = ${num(w)}$ and the learning rate is $\\eta = ${num(eta)}$. ` +
        'Using the gradient descent update rule, what is the new value of $w$ after one step?';
      workGrad =
        'Differentiate with the chain rule (outside "squared", inside $wx - y$ whose derivative with respect to $w$ is $x$):' +
        dm('\\frac{dL}{dw} = 2(wx - y)x') +
        `Prediction: $wx = ${paren(w)} \\times ${num(x)} = ${num(w * x)}$.\n\n` +
        (y === 0 ? `Error: $wx - y = ${num(e)}$ (because $y = 0$).\n\n` : `Error: $wx - y = ${num(w * x)} - ${paren(y)} = ${num(e)}$.\n\n`) +
        `Gradient: $\\frac{dL}{dw} = 2 \\times ${paren(e)} \\times ${num(x)} = ${num(grad)}$.\n\n`;
    } else {
      const c = rng.int(-3, 6);
      const k = rng.int(0, 5);
      w = rng.int(-4, 8);
      if (w === c) continue;
      grad = 2 * (w - c);
      gradNo2 = w - c;
      gradNoX = null;
      const inside = c === 0 ? 'w' : `w${signed(-c)}`;
      const lossTex = c === 0 ? `w^2${k ? signed(k) : ''}` : `(${inside})^2${k ? signed(k) : ''}`;
      stem =
        `A loss function is $L(w) = ${lossTex}$. Gradient descent is currently at $w = ${num(w)}$ and uses learning rate $\\eta = ${num(eta)}$. ` +
        'What is the value of $w$ after one gradient descent step?';
      workGrad =
        (k ? `Differentiate. The constant $${num(k)}$ has derivative $0$, so` : 'Differentiate:') +
        dm(`L'(w) = 2${c === 0 ? 'w' : `(${inside})`}`) +
        `At $w = ${num(w)}$: $L'(${num(w)}) = 2${c === 0 ? ` \\times ${paren(w)}` : `(${num(w)}${signed(-c)})`} = ${num(grad)}$.\n\n`;
    }
    const step = eta * grad;
    const ans = r4(w - step);
    const answer = m(num(ans));
    const pool: Cand[] = [
      {
        v: w + step,
        text: m(num(w + step)),
        why: `This adds $\\eta \\times$ gradient instead of subtracting it: $${num(w)} + ${paren(r4(step))} = ${num(r4(w + step))}$. That is gradient ascent, which moves uphill and increases the loss.`,
      },
      {
        v: w - eta * gradNo2,
        text: m(num(w - eta * gradNo2)),
        why: `This forgets the factor $2$ when differentiating the square, using a gradient of $${num(gradNo2)}$ instead of $${num(grad)}$, so the step is half the correct size.`,
      },
      ...(gradNoX === null
        ? []
        : [
            {
              v: w - eta * gradNoX,
              text: m(num(w - eta * gradNoX)),
              why: `This leaves out the chain-rule factor $x$, using a gradient of $2(wx - y) = ${num(gradNoX)}$ instead of $2(wx - y)x = ${num(grad)}$.`,
            },
          ]),
      {
        v: -step,
        text: m(num(-step)),
        why: `This is only the change $-\\eta \\times \\text{gradient} = ${num(r4(-step))}$: the current weight $${num(w)}$ was forgotten. The new weight is the old weight plus this change.`,
      },
      {
        v: w - grad,
        text: m(num(w - grad)),
        why: `This forgets the learning rate and subtracts the whole gradient: $${num(w)} - ${paren(grad)} = ${num(w - grad)}$. The gradient must be multiplied by $\\eta = ${num(eta)}$ first.`,
      },
    ];
    const ds = pickDistinct(ans, answer, pool);
    if (ds.length < 3) continue;
    const solution =
      workGrad +
      'Update rule (step **against** the gradient):' +
      dm(`w_{\\text{new}} = w - \\eta \\frac{dL}{dw} = ${num(w)} - ${num(eta)} \\times ${paren(grad)} = ${num(w)} - ${paren(r4(step))} = ${num(ans)}`) +
      (grad < 0
        ? 'The gradient is negative, so the loss decreases as $w$ increases, and $w$ goes up.'
        : 'The gradient is positive, so the loss increases with $w$, and $w$ goes down.') +
      `\n\nAnswer: ${answer}`;
    return {
      stem,
      answer,
      answerValue: ans,
      distractors: ds.map((d) => ({ text: d.text, value: r4(d.v), why: d.why })),
      solution,
      keyIdea: 'Gradient descent: work out the derivative of the loss with respect to the weight, then $w_{\\text{new}} = w - \\eta \\times \\text{gradient}$.',
    };
  }
}

// ---------------------------------------------------------------- 2. MSE of a linear model on a table
const MSE_CTX = [
  { intro: 'predicts a test score $y$ from hours of revision $x$', xh: 'Hours $x$', yh: 'Score $y$' },
  { intro: 'predicts a taxi fare $y$ (in AED) from the distance $x$ (in km)', xh: 'Distance $x$', yh: 'Fare $y$' },
  { intro: 'predicts daily ice-cream sales $y$ (in hundreds) from $x$, the number of degrees above $20$', xh: '$x$', yh: 'Sales $y$' },
  { intro: 'predicts the yield $y$ of a plant (in kg) from the amount of fertiliser $x$', xh: 'Fertiliser $x$', yh: 'Yield $y$' },
];

function mseTable(rng: Rng): GeneratedCore {
  for (;;) {
    const w = rng.pick([0.5, 1, 1.5, 2, 3]);
    const b = rng.int(-2, 5);
    const n = rng.pick([4, 5]);
    const half = w === 0.5 || w === 1.5;
    const xPool = half ? [0, 2, 4, 6, 8, 10] : [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const xs = rng.sample(xPool, n).sort((a, c) => a - c);
    const es = xs.map(() => rng.int(-3, 3)); // error y - yhat
    if (es.filter((e) => e !== 0).length < 2) continue;
    const preds = xs.map((x) => w * x + b);
    const ys = preds.map((p, i) => p + es[i]);
    if (ys.some((y) => y < 0)) continue;
    const sq = es.map((e) => e * e);
    const sse = sq.reduce((a, c) => a + c, 0);
    const ans = r4(sse / n);
    const answer = m(num(ans));
    const sumE = es.reduce((a, c) => a + c, 0);
    const sumAbs = es.reduce((a, c) => a + Math.abs(c), 0);
    const noBiasMse = b === 0 ? NaN : ys.reduce((a, y, i) => a + (y - w * xs[i]) ** 2, 0) / n;
    const pool: Cand[] = [
      {
        v: sse,
        text: m(num(sse)),
        why: `This is the **sum** of squared errors, $${num(sse)}$. The "mean" in MSE means you must also divide by the number of points, $${n}$.`,
      },
      {
        v: sumAbs / n,
        text: m(num(r4(sumAbs / n))),
        why: `This is the mean **absolute** error, $\\frac{${sumAbs}}{${n}} = ${num(r4(sumAbs / n))}$: the errors were made positive but not squared.`,
      },
      {
        v: sumE / n,
        text: m(num(r4(sumE / n))),
        why: `This is the mean of the **signed** errors, $\\frac{${num(sumE)}}{${n}} = ${num(r4(sumE / n))}$: without squaring, positive and negative errors cancel out.`,
      },
      {
        v: noBiasMse,
        text: Number.isFinite(noBiasMse) ? m(num(r4(noBiasMse))) : '',
        why: `This forgets the bias $${num(b)}$ when making predictions (using $\\hat{y} = ${lin(w, 'x', 0)}$), so every error is off by $${num(Math.abs(b))}$.`,
      },
      {
        v: sse / (n - 1),
        text: m(num(r4(sse / (n - 1)))),
        why: `This divides the sum of squared errors by $n - 1 = ${n - 1}$ (as for a sample variance). MSE divides by the number of points, $n = ${n}$.`,
      },
    ];
    const ds = pickDistinct(ans, answer, pool);
    if (ds.length < 3) continue;
    // reject distractor values that need more than 2 d.p. (keeps every option calculator-clean)
    if (ds.some((d) => Math.abs(d.v * 100 - Math.round(d.v * 100)) > 1e-9)) continue;
    const ctx = rng.pick(MSE_CTX);
    const model = lin(w, 'x', b);
    const stem =
      `A linear regression model ${ctx.intro}. Its equation is $\\hat{y} = ${model}$. ` +
      `It is tested on the ${n} data points in the table. What is the mean squared error (MSE) of the model on these points?`;
    const table = {
      headers: [ctx.xh, ...xs.map((x) => num(x))],
      rows: [[ctx.yh, ...ys.map((y) => num(y))]] as (string | number)[][],
    };
    const nonZeroSq = sq.filter((s) => s !== 0);
    const rows = xs
      .map((x, i) => `| ${num(x)} | ${num(ys[i])} | $${num(preds[i])}$ | $${num(es[i])}$ | ${num(sq[i])} |`)
      .join('\n');
    const solution =
      `Use the model to predict each point, find the error $y - \\hat{y}$, square it, then average.\n\n` +
      '| $x$ | $y$ | $\\hat{y}$ | $y - \\hat{y}$ | $(y - \\hat{y})^2$ |\n|---|---|---|---|---|\n' +
      rows +
      '\n\n' +
      `Sum of squared errors: $${nonZeroSq.map((s) => num(s)).join(' + ')} = ${num(sse)}$` +
      (nonZeroSq.length < n ? ' (points with zero error add nothing).' : '.') +
      dm(`\\text{MSE} = \\frac{${num(sse)}}{${n}} = ${num(ans)}`) +
      `Answer: ${answer}`;
    return {
      stem,
      table,
      answer,
      answerValue: ans,
      distractors: ds.map((d) => ({ text: d.text, value: r4(d.v), why: d.why })),
      solution,
      keyIdea: 'MSE: predict each point, square each error $y - \\hat{y}$, add them up and divide by the number of points.',
    };
  }
}

// ---------------------------------------------------------------- 3. logistic regression prediction
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const p2 = (p: number) => Math.round(p * 100) / 100;
const p2s = (p: number) => p.toFixed(2);
const expTex = (k: number) => (k === 1 ? 'e' : `e^{${num(k)}}`);

const LOGI_CTX = [
  { what: 'whether a student passes an exam', x1: 'hours of study', x2: 'practice tests taken', c1: 'pass', c0: 'fail' },
  { what: 'whether an email is spam', x1: 'number of links', x2: 'number of words in capitals', c1: 'spam', c0: 'not spam' },
  { what: 'whether a customer buys a product', x1: 'minutes on the website', x2: 'items viewed', c1: 'buys', c0: 'does not buy' },
  { what: 'whether a machine part fails this month', x1: 'age in years', x2: 'warning lights shown', c1: 'fails', c0: 'does not fail' },
];

function logisticPredict(rng: Rng): GeneratedCore {
  for (;;) {
    // Positive weights only: every feature in LOGI_CTX makes class 1 MORE likely (e.g. more warning
    // lights must not lower the chance of failure). A negative bias still gives negative z values.
    const w1 = rng.pick([0.5, 1, 1.5, 2]);
    const w2 = rng.pick([0.5, 1, 2, 3]);
    const b = rng.intNonZero(-8, 4);
    const x1 = rng.int(1, 6);
    const x2 = rng.int(1, 5);
    const z = w1 * x1 + w2 * x2 + b;
    const zNoB = z - b;
    // z a non-zero multiple of 0.5 in [-3, 3]; the "forgot bias" value kept in [-5, 5]
    if (z === 0 || Math.abs(z) > 3 || Math.abs(zNoB) > 5) continue;
    const ctx = rng.pick(LOGI_CTX);
    const p = p2(sigmoid(z));
    const cls = (zz: number) => (sigmoid(zz) >= 0.5 ? ctx.c1 : ctx.c0);
    const other = (c: string) => (c === ctx.c1 ? ctx.c0 : ctx.c1);
    const opt = (pp: number, c: string) => `$p = ${p2s(pp)}$, "${c}"`;
    const answer = opt(p, cls(z));
    const pNeg = p2(sigmoid(-z));
    const pNoB = p2(sigmoid(zNoB));
    const pool: { text: string; v: string; why: string }[] = [
      {
        text: opt(pNeg, cls(-z)),
        v: `${p2s(pNeg)}|${cls(-z)}`,
        why: `This loses the minus sign in $e^{-z}$, computing $\\frac{1}{1 + ${expTex(z)}}$ instead of $\\frac{1}{1 + ${expTex(-z)}}$. That gives $\\sigma(-z) = 1 - \\sigma(z)$, the probability of the other class.`,
      },
      {
        text: opt(p, other(cls(z))),
        v: `${p2s(p)}|${other(cls(z))}`,
        why: `The probability is right but the class is wrong: the model predicts "${ctx.c1}" only when $p \\ge 0.5$, and here $p = ${p2s(p)}$.`,
      },
      {
        text: opt(pNoB, cls(zNoB)),
        v: `${p2s(pNoB)}|${cls(zNoB)}`,
        why: `This forgets the bias $${num(b)}$, using $z = ${num(zNoB)}$ instead of $z = ${num(z)}$.`,
      },
      {
        text: opt(pNeg, cls(z)),
        v: `${p2s(pNeg)}|${cls(z)}`,
        why: `This computes $\\sigma(-z) = ${p2s(pNeg)}$ by losing the minus sign in $e^{-z}$ (the class happens to be read correctly from the sign of $z$, but the probability does not match it).`,
      },
    ];
    const ds: typeof pool = [];
    for (const d of pool) {
      if (ds.length === 3) break;
      if (d.text === answer || ds.some((o) => o.text === d.text)) continue;
      ds.push(d);
    }
    if (ds.length < 3) continue;
    const zTerms =
      `${num(w1)} \\times ${num(x1)}` +
      (w2 < 0 ? ` - ${num(-w2)} \\times ${num(x2)}` : ` + ${num(w2)} \\times ${num(x2)}`) +
      signed(b);
    const ez = Math.exp(-z);
    const stem =
      `A logistic regression model predicts ${ctx.what}. With $x_1$ = ${ctx.x1} and $x_2$ = ${ctx.x2}, it computes` +
      dm(`z = ${lin(w1, 'x_1', 0)}${w2 < 0 ? ` - ${w2 === -1 ? '' : num(-w2)}x_2` : ` + ${w2 === 1 ? '' : num(w2)}x_2`}${signed(b)}, \\qquad p = \\sigma(z) = \\frac{1}{1 + e^{-z}}`) +
      `and predicts "${ctx.c1}" when $p \\ge 0.5$, otherwise "${ctx.c0}". For $x_1 = ${x1}$ and $x_2 = ${x2}$, what are $p$ (to 2 decimal places) and the prediction?`;
    const solution =
      `Step 1, the linear part: $z = ${zTerms} = ${num(z)}$.\n\n` +
      `Step 2, the sigmoid: $e^{-z} = ${expTex(-z)} \\approx ${num(ez, 4)}$, so` +
      dm(`p = \\frac{1}{1 + ${num(ez, 4)}} \\approx ${num(sigmoid(z), 4)} \\approx ${p2s(p)}`) +
      `Step 3, the threshold: $${p2s(p)} ${p >= 0.5 ? '\\ge' : '<'} 0.5$, so the prediction is "${cls(z)}".\n\n` +
      `Quick check: $z$ is ${z > 0 ? 'positive, and a positive $z$ always gives $p > 0.5$' : 'negative, and a negative $z$ always gives $p < 0.5$'}.\n\n` +
      `Answer: ${answer}`;
    return {
      stem,
      answer,
      answerValue: `${p2s(p)}|${cls(z)}`,
      distractors: ds.map((d) => ({ text: d.text, value: d.v, why: d.why })),
      solution,
      keyIdea: 'Logistic regression: compute $z = w_1x_1 + w_2x_2 + b$, squash it with the sigmoid into a probability, then compare with $0.5$ (equivalently, check the sign of $z$).',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-regression-gradient-descent-update-step',
    subtopic: SUB,
    difficulty: 'exam',
    title: 'One gradient descent update on a squared-error loss',
    generate: gdStep,
  },
  {
    id: 'gen-regression-gradient-descent-mse-table',
    subtopic: SUB,
    difficulty: 'exam',
    title: 'Mean squared error of a linear model on a data table',
    generate: mseTable,
  },
  {
    id: 'gen-regression-gradient-descent-logistic-predict',
    subtopic: SUB,
    difficulty: 'exam',
    title: 'Logistic regression: sigmoid probability and predicted class',
    generate: logisticPredict,
  },
];
