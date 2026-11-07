import type { GeneratedCore, Generator, TableSpec } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table as mdTable } from '../../../lib/explanation';
import { Frac } from '../../../lib/frac';
import { m, num } from '../../../lib/tex';

// ---------------------------------------------------------------- shared helpers

type Metric = 'accuracy' | 'precision' | 'recall' | 'F1 score';
type Cand = { f: Frac; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value). */
function pickDistinct(answer: Frac, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (d.f.equals(answer)) continue;
    if (out.some((x) => x.f.equals(d.f))) continue;
    out.push(d);
  }
  return out;
}

/** True if f is an exact decimal with at most 3 decimal places. */
function isShortDecimal(f: Frac): boolean {
  return (f.n * 1000) % f.d === 0;
}

/**
 * Render a set of option values consistently: all as decimals when every value is an exact
 * decimal with at most 3 d.p., otherwise all as reduced fractions.
 */
function renderer(values: Frac[]): (f: Frac) => string {
  const dec = values.every(isShortDecimal);
  return (f: Frac) => m(dec ? num(f.value(), 3) : f.tex());
}

/** "\frac{a}{b}", then "= \frac{reduced}" if it simplifies, then "= decimal" if short. */
function fracWorking(n: number, d: number): string {
  const r = new Frac(n, d);
  let s = `\\frac{${n}}{${d}}`;
  if (!(r.n === n && r.d === d)) s += ` = ${r.tex()}`;
  if (isShortDecimal(r) && r.d !== 1) s += ` = ${num(r.value(), 3)}`;
  return s;
}

interface Ctx {
  model: string; // "A spam filter"
  items: string; // "emails"
  pos: string; // "Spam"
  neg: string; // "Not spam"
}

const CONTEXTS: Ctx[] = [
  { model: 'A spam filter', items: 'emails', pos: 'Spam', neg: 'Not spam' },
  { model: 'A medical screening model', items: 'patients', pos: 'Disease', neg: 'Healthy' },
  { model: 'A fraud detector', items: 'transactions', pos: 'Fraud', neg: 'Genuine' },
  { model: 'A factory inspection model', items: 'parts', pos: 'Defective', neg: 'Not defective' },
  { model: 'A customer churn model', items: 'customers', pos: 'Churn', neg: 'Stay' },
  { model: 'An image classifier', items: 'photos', pos: 'Cat', neg: 'Not cat' },
];

interface Counts {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

/** The value of each metric (and of each common wrong formula) as an exact fraction. */
function metricFracs(c: Counts) {
  const n = c.tp + c.fp + c.fn + c.tn;
  const prec = new Frac(c.tp, c.tp + c.fp);
  const rec = new Frac(c.tp, c.tp + c.fn);
  return {
    n,
    acc: new Frac(c.tp + c.tn, n),
    prec,
    rec,
    f1: new Frac(2 * c.tp, 2 * c.tp + c.fp + c.fn),
    tpOverN: new Frac(c.tp, n),
    fpOverPred: new Frac(c.fp, c.tp + c.fp),
    fnOverAct: new Frac(c.fn, c.tp + c.fn),
    spec: new Frac(c.tn, c.tn + c.fp),
    avgPR: prec.add(rec).div(2),
    prodPR: prec.mul(rec),
  };
}

/** The question in simple words, for each metric. */
function metricAsking(metric: Metric, ctx: Ctx): string {
  switch (metric) {
    case 'accuracy':
      return `What fraction of all the ${ctx.items} did the model get right?`;
    case 'precision':
      return `Of the ${ctx.items} predicted as ${ctx.pos}, what fraction really are ${ctx.pos}?`;
    case 'recall':
      return `Of the ${ctx.items} that really are ${ctx.pos}, what fraction did the model find?`;
    case 'F1 score':
      return "What is the single score that combines this model's precision and recall?";
  }
}

/** Worked computation of one metric from the counts, one step per entry. The last step reaches the value. */
function metricSteps(metric: Metric, c: Counts): string[] {
  const n = c.tp + c.fp + c.fn + c.tn;
  const f1Bottom = 2 * c.tp + c.fp + c.fn;
  switch (metric) {
    case 'accuracy':
      return [
        '**Accuracy** is the share of all predictions that are correct. The correct ones are TP and TN, so $\\text{Accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{total}}$.',
        `Correct predictions: $${c.tp} + ${c.tn} = ${c.tp + c.tn}$. The total of all four counts: $${c.tp} + ${c.fp} + ${c.fn} + ${c.tn} = ${n}$.`,
        `Divide: $\\text{Accuracy} = ${fracWorking(c.tp + c.tn, n)}$.`,
      ];
    case 'precision':
      return [
        '**Precision** asks: of everything the model called positive, how much really was? It called positive $\\text{TP} + \\text{FP}$ times and was right TP times, so $\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$.',
        `Substitute: $\\text{Precision} = \\frac{${c.tp}}{${c.tp} + ${c.fp}} = ${fracWorking(c.tp, c.tp + c.fp)}$.`,
      ];
    case 'recall':
      return [
        '**Recall** asks: of everything that really is positive, how much did the model find? There are $\\text{TP} + \\text{FN}$ real positives and it found TP of them, so $\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$.',
        `Substitute: $\\text{Recall} = \\frac{${c.tp}}{${c.tp} + ${c.fn}} = ${fracWorking(c.tp, c.tp + c.fn)}$.`,
      ];
    case 'F1 score':
      return [
        'The **F1 score** combines precision $P$ (the share of positive predictions that are right) and recall $R$ (the share of real positives found) using $F_1 = \\frac{2PR}{P + R}$. When you have the counts, a quicker formula gives the same value: $F_1 = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$.',
        `Work out the top: $2 \\times ${c.tp} = ${2 * c.tp}$.`,
        `Work out the bottom: $2 \\times ${c.tp} + ${c.fp} + ${c.fn} = ${2 * c.tp} + ${c.fp} + ${c.fn} = ${f1Bottom}$.`,
        `Divide: $F_1 = ${fracWorking(2 * c.tp, f1Bottom)}$.`,
      ];
  }
}

/** One or two sentences that link the counts to the marked option. */
function metricConclusion(metric: Metric, c: Counts, ctx: Ctx, ans: string): string {
  switch (metric) {
    case 'accuracy':
      return `The model is right on ${c.tp + c.tn} of the ${c.tp + c.fp + c.fn + c.tn} ${ctx.items}, so the accuracy is ${ans}.`;
    case 'precision':
      return `Of the ${c.tp + c.fp} ${ctx.items} predicted as ${ctx.pos}, ${c.tp} really are, so the precision is ${ans}.`;
    case 'recall':
      return `Of the ${c.tp + c.fn} ${ctx.items} that really are ${ctx.pos}, the model found ${c.tp}, so the recall is ${ans}.`;
    case 'F1 score':
      return `With ${c.tp} true positives, ${c.fp} false positives and ${c.fn} false negatives, the F1 score is ${ans}.`;
  }
}

/** Ordered pool of genuine mistakes for each metric. */
function mistakePool(metric: Metric, c: Counts, swapHint: string): Cand[] {
  const v = metricFracs(c);
  switch (metric) {
    case 'accuracy':
      return [
        { f: v.tpOverN, why: `This is $\\frac{${c.tp}}{${v.n}}$: only the true positives are counted as correct. The ${c.tn} true negatives are correct predictions too.` },
        { f: v.prec, why: 'This is the **precision**, $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$. Accuracy counts every correct prediction (TP and TN) out of all examples.' },
        { f: v.rec, why: 'This is the **recall**, $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$. Accuracy counts every correct prediction (TP and TN) out of all examples.' },
        { f: v.f1, why: 'This is the **F1 score**. Accuracy is simply the number of correct predictions (TP + TN) divided by the total.' },
        { f: v.spec, why: 'This is $\\frac{\\text{TN}}{\\text{TN} + \\text{FP}}$, the fraction of actual negatives cleared (specificity). Accuracy uses all examples.' },
      ];
    case 'precision':
      return [
        { f: v.rec, why: `This is the **recall**, $\\frac{${c.tp}}{${c.tp} + ${c.fn}}$: it divides by all actual positives (using FN instead of FP). ${swapHint}` },
        { f: v.fpOverPred, why: `This is $\\frac{${c.fp}}{${c.tp + c.fp}}$: the denominator is right, but the false positives are on top instead of the true positives. It is the fraction of positive predictions that were false alarms.` },
        { f: v.acc, why: 'This is the **accuracy**, $\\frac{\\text{TP} + \\text{TN}}{\\text{total}}$. Precision only looks at the examples predicted positive.' },
        { f: v.tpOverN, why: `This is $\\frac{${c.tp}}{${v.n}}$: it divides the true positives by every example instead of by the ${c.tp + c.fp} predicted positive.` },
        { f: v.f1, why: 'This is the **F1 score**, which combines precision and recall. The question asks for precision alone.' },
      ];
    case 'recall':
      return [
        { f: v.prec, why: `This is the **precision**, $\\frac{${c.tp}}{${c.tp} + ${c.fp}}$: it divides by all predicted positives (using FP instead of FN). ${swapHint}` },
        { f: v.fnOverAct, why: `This is $\\frac{${c.fn}}{${c.tp + c.fn}}$: the denominator is right, but the false negatives are on top. It is the fraction of actual positives that were **missed**.` },
        { f: v.acc, why: 'This is the **accuracy**, $\\frac{\\text{TP} + \\text{TN}}{\\text{total}}$. Recall only looks at the examples that are actually positive.' },
        { f: v.tpOverN, why: `This is $\\frac{${c.tp}}{${v.n}}$: it divides the true positives by every example instead of by the ${c.tp + c.fn} actual positives.` },
        { f: v.spec, why: 'This is $\\frac{\\text{TN}}{\\text{TN} + \\text{FP}}$, the recall of the **negative** class (specificity), not of the positive class.' },
      ];
    case 'F1 score':
      return [
        { f: v.avgPR, why: 'This is the ordinary average $\\frac{P + R}{2}$ of precision and recall. F1 is the **harmonic** mean $\\frac{2PR}{P + R}$, which is pulled towards the smaller value.' },
        { f: v.acc, why: 'This is the **accuracy**, $\\frac{\\text{TP} + \\text{TN}}{\\text{total}}$. F1 ignores the true negatives completely.' },
        { f: v.prodPR, why: 'This is $P \\times R$: the product of precision and recall without the factor 2 and without dividing by $P + R$.' },
        { f: v.prec, why: 'This is the **precision** alone. F1 combines precision with recall.' },
        { f: v.rec, why: 'This is the **recall** alone. F1 combines recall with precision.' },
      ];
  }
}

function core(
  stem: string,
  table: TableSpec,
  answer: Frac,
  cands: Cand[],
  asking: string,
  solution: string,
  conclusion: (ans: string) => string,
  keyIdea: string,
): GeneratedCore {
  const show = renderer([answer, ...cands.map((d) => d.f)]);
  const ans = show(answer);
  return {
    stem,
    table,
    answer: ans,
    answerValue: answer.value(),
    distractors: cands.map((d) => ({ text: show(d.f), value: d.f.value(), why: d.why })),
    asking,
    solution,
    conclusion: conclusion(ans),
    keyIdea,
  };
}

// ---------------------------------------------------------------- generator 1: metric from a confusion matrix

function genConfusion(rng: Rng): GeneratedCore {
  for (;;) {
    const ctx = rng.pick(CONTEXTS);
    const metric = rng.pick(['accuracy', 'precision', 'recall', 'F1 score'] as const);
    const step = rng.pick([1, 5, 5]);
    const c: Counts =
      step === 5
        ? { tp: 5 * rng.int(2, 12), fp: 5 * rng.int(1, 6), fn: 5 * rng.int(1, 6), tn: 5 * rng.int(6, 30) }
        : { tp: rng.int(12, 60), fp: rng.int(3, 25), fn: rng.int(3, 25), tn: rng.int(30, 150) };
    const rowsArePredicted = rng.bool(0.4);
    const n = c.tp + c.fp + c.fn + c.tn;

    const table: TableSpec = rowsArePredicted
      ? {
          caption: 'Rows: predicted class. Columns: actual class.',
          headers: ['Predicted class', `Actual: ${ctx.pos}`, `Actual: ${ctx.neg}`],
          rows: [
            [`Predicted: ${ctx.pos}`, c.tp, c.fp],
            [`Predicted: ${ctx.neg}`, c.fn, c.tn],
          ],
        }
      : {
          caption: 'Rows: actual class. Columns: predicted class.',
          headers: ['Actual class', `Predicted: ${ctx.pos}`, `Predicted: ${ctx.neg}`],
          rows: [
            [`Actual: ${ctx.pos}`, c.tp, c.fn],
            [`Actual: ${ctx.neg}`, c.fp, c.tn],
          ],
        };

    const swapHint = rowsArePredicted
      ? 'Here the rows are the **predicted** class, so the bottom-left cell is FN and the top-right cell is FP; reading the table the other way round swaps them.'
      : 'Remember FN is an actual positive predicted negative, and FP is an actual negative predicted positive.';

    const v = metricFracs(c);
    const answer = metric === 'accuracy' ? v.acc : metric === 'precision' ? v.prec : metric === 'recall' ? v.rec : v.f1;
    // Unrounded counts can give ugly answers such as 49/65 or 74/109: keep only fairly nice ones.
    if (step === 1 && answer.d > 25) continue;
    const cands = pickDistinct(answer, mistakePool(metric, c, swapHint));
    if (cands.length < 3) continue;

    const stem =
      `${ctx.model} is tested on ${n} ${ctx.items}, with **${ctx.pos}** as the positive class. ` +
      `From the confusion matrix${rowsArePredicted ? ' (the **rows** are the **predicted** class)' : ''}, what is its **${metric}**?`;

    const solution = steps(
      `Here the **rows** are the ${rowsArePredicted ? 'predicted' : 'actual'} class and the columns are the ${rowsArePredicted ? 'actual' : 'predicted'} class. ${ctx.pos} is the positive class. Name each cell by reading both its row and its column:\n\n` +
        mdTable(
          ['Actual', 'Predicted', 'Name', 'Count'],
          [
            [ctx.pos, ctx.pos, 'TP (true positive)', c.tp],
            [ctx.neg, ctx.pos, 'FP (false positive)', c.fp],
            [ctx.pos, ctx.neg, 'FN (false negative)', c.fn],
            [ctx.neg, ctx.neg, 'TN (true negative)', c.tn],
          ],
        ),
      ...metricSteps(metric, c),
    );

    const keyIdea =
      metric === 'accuracy'
        ? 'For accuracy, add the cells where actual and predicted match (TP and TN), then divide by the total of all four cells.'
        : metric === 'precision'
          ? 'For precision, find the cells **predicted** positive and divide the correct one (TP) by their sum. Read the row and column labels first, because tables can be laid out either way round.'
          : metric === 'recall'
            ? 'For recall, find the cells that are **actually** positive and divide the found one (TP) by their sum. Read the row and column labels first, because tables can be laid out either way round.'
            : 'For F1, read TP, FP and FN from the table and use $F_1 = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$. True negatives play no part. Read the row and column labels first, because tables can be swapped.';

    return core(stem, table, answer, cands, metricAsking(metric, ctx), solution, (ans) => metricConclusion(metric, c, ctx, ans), keyIdea);
  }
}

// ---------------------------------------------------------------- generator 2: metric at a threshold

function genThreshold(rng: Rng): GeneratedCore {
  const grid = Array.from({ length: 19 }, (_, i) => (i + 1) * 5); // scores 0.05 ... 0.95, stored as integers (hundredths)
  for (;;) {
    const ctx = rng.pick(CONTEXTS);
    const metric = rng.pick(['accuracy', 'precision', 'recall', 'F1 score'] as const);
    const t = rng.pick([40, 50, 60, 70]);
    const includeTie = rng.bool(0.6);
    let scores = rng.sample(
      grid.filter((s) => s !== t),
      includeTie ? 9 : 10,
    );
    if (includeTie) scores.push(t);
    scores = scores.sort((a, b) => b - a);
    // higher scores are more likely to be real positives
    const rows = scores.map((s) => ({ s, pos: rng.next() < 0.1 + (0.8 * s) / 100 }));

    const countAt = (strict: boolean): Counts => {
      const c = { tp: 0, fp: 0, fn: 0, tn: 0 };
      for (const r of rows) {
        const pred = strict ? r.s > t : r.s >= t;
        if (pred && r.pos) c.tp++;
        else if (pred && !r.pos) c.fp++;
        else if (!pred && r.pos) c.fn++;
        else c.tn++;
      }
      return c;
    };
    const c = countAt(false);
    if (c.tp < 2 || c.fp < 1 || c.fn < 1 || c.tn < 1) continue;
    const strict = countAt(true);
    if (strict.tp < 1) continue;

    const v = metricFracs(c);
    const pick = (x: ReturnType<typeof metricFracs>) =>
      metric === 'accuracy' ? x.acc : metric === 'precision' ? x.prec : metric === 'recall' ? x.rec : x.f1;
    const answer = pick(v);
    const tieWhy = `This uses "score **greater than** ${num(t / 100)}" instead of "at least ${num(t / 100)}", so the example with score exactly ${(t / 100).toFixed(2)} is wrongly treated as predicted negative.`;
    const pool: Cand[] = [];
    if (includeTie) pool.push({ f: pick(metricFracs(strict)), why: tieWhy });
    pool.push(...mistakePool(metric, c, 'Recall divides by the actual positives; precision divides by the predicted positives.'));
    const cands = pickDistinct(answer, pool);
    if (cands.length < 3) continue;

    const tStr = num(t / 100);
    const sStr = (s: number) => (s / 100).toFixed(2);
    const table: TableSpec = {
      headers: ['Example', 'Score', 'Actual class'],
      rows: rows.map((r, i) => [i + 1, sStr(r.s), r.pos ? ctx.pos : ctx.neg]),
    };
    const stem =
      `${ctx.model} scores 10 ${ctx.items} and predicts **${ctx.pos}** (the positive class) when the score is **at least** $${tStr}$. ` +
      `Using the scores and true labels in the table, what is the **${metric}**?`;

    const outcome = (r: { s: number; pos: boolean }) => {
      const pred = r.s >= t;
      return pred ? (r.pos ? 'TP' : 'FP') : r.pos ? 'FN' : 'TN';
    };
    const solution = steps(
      `The model predicts ${ctx.pos} when the score is at least ${tStr}.${includeTie ? ` A score of exactly ${sStr(t)} **counts**, because "at least" includes it.` : ''} Any lower score means ${ctx.neg}.`,
      `Compare each prediction with the actual class. TP (true positive): predicted ${ctx.pos}, actually ${ctx.pos}. FP (false positive): predicted ${ctx.pos}, actually ${ctx.neg}. FN (false negative): predicted ${ctx.neg}, actually ${ctx.pos}. TN (true negative): predicted ${ctx.neg}, actually ${ctx.neg}.`,
      'Label every example:\n\n' +
        mdTable(
          ['Example', 'Score', 'Predicted', 'Actual', 'Outcome'],
          rows.map((r, i) => [i + 1, sStr(r.s), r.s >= t ? ctx.pos : ctx.neg, r.pos ? ctx.pos : ctx.neg, outcome(r)]),
        ),
      `Count each outcome in the last column: $\\text{TP} = ${c.tp}$, $\\text{FP} = ${c.fp}$, $\\text{FN} = ${c.fn}$, $\\text{TN} = ${c.tn}$.`,
      ...metricSteps(metric, c),
    );

    return core(
      stem,
      table,
      answer,
      cands,
      metricAsking(metric, ctx),
      solution,
      (ans) => metricConclusion(metric, c, ctx, ans),
      'Use the threshold to turn each score into a prediction, and treat a score exactly on it as "at least". Label each row TP, FP, FN or TN, count them, then use the formula for the metric.',
    );
  }
}

// ---------------------------------------------------------------- generator 3: work backwards from precision and recall

type ICand = { v: number; why: string };

function genReverse(rng: Rng): GeneratedCore {
  const RECALLS = [new Frac(1, 2), new Frac(3, 5), new Frac(3, 4), new Frac(4, 5), new Frac(9, 10)];
  const PRECS = [new Frac(2, 5), new Frac(1, 2), new Frac(3, 5), new Frac(3, 4), new Frac(4, 5), new Frac(9, 10)];
  for (;;) {
    const ctx = rng.pick(CONTEXTS);
    const r = rng.pick(RECALLS);
    const p = rng.pick(PRECS);
    const kind = rng.pick(['FP', 'FN', 'TN'] as const);
    // TP must be a multiple of both numerators so that TP / r and TP / p are whole numbers
    const base = (r.n * p.n) / gcdInt(r.n, p.n);
    const ks: number[] = [];
    for (let k = 1; k * base <= 90; k++) if (k * base >= 12) ks.push(k);
    if (!ks.length) continue;
    const tp = rng.pick(ks) * base;
    const actual = (tp * r.d) / r.n;
    const predicted = (tp * p.d) / p.n;
    const fn = actual - tp;
    const fp = predicted - tp;
    const tn = 10 * rng.int(8, 40);
    const n = actual + fp + tn;
    const rS = num(r.value());
    const pS = num(p.value());

    let stem: string;
    let answer: number;
    let pool: ICand[];
    let asking: string;
    let solution: string;
    let conclusion: string;
    const ans = m(String(kind === 'FP' ? fp : kind === 'FN' ? fn : tn));
    const formulas =
      'Two formulas link these counts. **Recall** is $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$, where the bottom is all actual positives. **Precision** is $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$, where the bottom is all predicted positives. TP means true positives, FP false positives and FN false negatives.';
    const tpFromRecall =
      `Use recall to find TP. There are ${actual} actual positives, so $\\frac{\\text{TP}}{${actual}} = ${rS}$. Multiply both sides by ${actual} to get TP on its own: $\\text{TP} = ${rS} \\times ${actual} = ${tp}$.`;
    const predictedFromPrecision =
      `Use precision to find all the positive predictions. We know $\\frac{${tp}}{\\text{TP} + \\text{FP}} = ${pS}$. Multiply both sides by the bottom, then divide by ${pS}, to get the bottom on its own: $\\text{TP} + \\text{FP} = \\frac{${tp}}{${pS}} = ${predicted}$.`;

    if (kind === 'FP') {
      stem =
        `${ctx.model} is tested on a set of ${ctx.items} that contains ${actual} actual positives (**${ctx.pos}**). ` +
        `Its recall is $${rS}$ and its precision is $${pS}$. How many **false positives** does it make?`;
      answer = fp;
      pool = [
        { v: fn, why: `This is the number of **false negatives**, $${actual} - ${tp} = ${fn}$: the actual positives that were missed. False positives come from the precision.` },
        { v: predicted, why: `This is $\\text{TP} + \\text{FP} = ${predicted}$, all the positive predictions. The ${tp} true positives still need to be subtracted.` },
        { v: tp, why: `This is the number of **true positives**, $${rS} \\times ${actual} = ${tp}$, which is only the first step.` },
        ...(new Frac(1).sub(p).mul(actual).isInt() ? [{ v: new Frac(1).sub(p).mul(actual).n, why: `This applies $1 - ${pS}$ to the ${actual} **actual** positives. Precision is about the **predicted** positives ($\\text{TP} + \\text{FP}$), not the actual ones.` }] : []),
      ];
      asking = `How many ${ctx.items} does the model wrongly predict as ${ctx.pos}?`;
      solution = steps(
        formulas,
        tpFromRecall,
        predictedFromPrecision,
        `Of those ${predicted} positive predictions, ${tp} were right. The rest are false positives: $\\text{FP} = ${predicted} - ${tp} = ${fp}$.`,
      );
      conclusion = `It predicts positive ${predicted} times and is right ${tp} times, so it makes ${ans} false positives.`;
    } else if (kind === 'FN') {
      stem =
        `${ctx.model} predicts **${ctx.pos}** (the positive class) for ${predicted} ${ctx.items}. ` +
        `Its precision is $${pS}$ and its recall is $${rS}$. How many **false negatives** does it make?`;
      answer = fn;
      pool = [
        { v: fp, why: `This is the number of **false positives**, $${predicted} - ${tp} = ${fp}$: the wrong positive predictions. False negatives come from the recall.` },
        { v: actual, why: `This is $\\text{TP} + \\text{FN} = ${actual}$, all the actual positives. The ${tp} true positives still need to be subtracted.` },
        { v: tp, why: `This is the number of **true positives**, $${pS} \\times ${predicted} = ${tp}$, which is only the first step.` },
        ...(new Frac(1).sub(r).mul(predicted).isInt() ? [{ v: new Frac(1).sub(r).mul(predicted).n, why: `This applies $1 - ${rS}$ to the ${predicted} **predicted** positives. Recall is about the **actual** positives ($\\text{TP} + \\text{FN}$), not the predicted ones.` }] : []),
      ];
      asking = `How many ${ctx.items} that really are ${ctx.pos} does the model miss?`;
      solution = steps(
        formulas,
        `Use precision to find TP. The model predicted positive ${predicted} times, so $\\frac{\\text{TP}}{${predicted}} = ${pS}$. Multiply both sides by ${predicted} to get TP on its own: $\\text{TP} = ${pS} \\times ${predicted} = ${tp}$.`,
        `Use recall to find all the actual positives. We know $\\frac{${tp}}{\\text{TP} + \\text{FN}} = ${rS}$. Multiply both sides by the bottom, then divide by ${rS}, to get the bottom on its own: $\\text{TP} + \\text{FN} = \\frac{${tp}}{${rS}} = ${actual}$.`,
        `Of those ${actual} actual positives, the model found ${tp}. The rest were missed, so they are false negatives: $\\text{FN} = ${actual} - ${tp} = ${fn}$.`,
      );
      conclusion = `There are ${actual} actual positives and the model finds ${tp}, so it makes ${ans} false negatives.`;
    } else {
      stem =
        `${ctx.model} is tested on ${n} ${ctx.items}, of which ${actual} are actual positives (**${ctx.pos}**). ` +
        `Its recall is $${rS}$ and its precision is $${pS}$. How many **true negatives** are there?`;
      answer = tn;
      pool = [
        { v: n - actual, why: `This is $${n} - ${actual} = ${n - actual}$, all the actual negatives ($\\text{TN} + \\text{FP}$). The ${fp} false positives still need to be removed.` },
        { v: n - predicted, why: `This is $${n} - ${predicted}$, everything predicted negative ($\\text{TN} + \\text{FN}$). The ${fn} false negatives still need to be removed.` },
        { v: tp + tn, why: `This is $\\text{TP} + \\text{TN} = ${tp + tn}$, all the correct predictions, not the true negatives alone.` },
        { v: tp, why: `This is the number of **true positives**, $${rS} \\times ${actual} = ${tp}$, not the true negatives.` },
      ];
      asking = `How many ${ctx.items} are correctly predicted as ${ctx.neg}?`;
      solution = steps(
        formulas,
        tpFromRecall,
        predictedFromPrecision,
        `Subtract TP from each total to get the two kinds of mistake: $\\text{FP} = ${predicted} - ${tp} = ${fp}$ and $\\text{FN} = ${actual} - ${tp} = ${fn}$.`,
        `Every one of the ${n} ${ctx.items} is exactly one of TP, FP, FN or TN (true negative, correctly predicted negative). So the true negatives are what is left: $\\text{TN} = ${n} - ${tp} - ${fp} - ${fn} = ${tn}$.`,
      );
      conclusion = `Taking TP, FP and FN away from the ${n} ${ctx.items} leaves ${ans} true negatives.`;
    }

    const out: ICand[] = [];
    for (const d of pool) {
      if (out.length === 3) break;
      if (d.v === answer || d.v < 0 || out.some((x) => x.v === d.v)) continue;
      out.push(d);
    }
    if (out.length < 3) continue;
    return {
      stem,
      answer: ans,
      answerValue: answer,
      distractors: out.map((d) => ({ text: m(String(d.v)), value: d.v, why: d.why })),
      asking,
      solution,
      conclusion,
      keyIdea: 'Recall links TP to the actual positives, and precision links TP to the predicted positives. Use the total you are given to find TP, then the other metric to find the other total. Subtract TP from a total to get FN or FP.',
    };
  }
}

function gcdInt(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

export const generators: Generator[] = [
  {
    id: 'gen-evaluation-metrics-confusion',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    title: 'Accuracy, precision, recall or F1 from a confusion matrix',
    generate: genConfusion,
  },
  {
    id: 'gen-evaluation-metrics-threshold',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    title: 'Apply a threshold to scores, then compute a metric',
    generate: genThreshold,
  },
  {
    id: 'gen-evaluation-metrics-reverse',
    subtopic: 'evaluation-metrics',
    difficulty: 'exam',
    title: 'Work backwards from precision and recall to the counts',
    generate: genReverse,
  },
];
