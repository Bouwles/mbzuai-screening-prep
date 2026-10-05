import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { median, modes, quartiles, sumOf } from '../../../lib/mathx';
import { m, num } from '../../../lib/tex';

type Cand = { value: number; why: string };

/** Pick up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function tryPick(answer: number, pool: Cand[]): { text: string; value: number; why: string }[] | null {
  const out: { text: string; value: number; why: string }[] = [];
  const ansText = m(num(answer));
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value)) continue;
    const text = m(num(c.value));
    if (Math.abs(c.value - answer) < 1e-9 || text === ansText) continue;
    if (out.some((o) => Math.abs(o.value - c.value) < 1e-9 || o.text === text)) continue;
    out.push({ text, value: c.value, why: c.why });
  }
  return out.length === 3 ? out : null;
}

function pickDistractors(answer: number, pool: Cand[]): { text: string; value: number; why: string }[] {
  const out = tryPick(answer, pool);
  if (!out) throw new Error('not enough distinct distractors');
  return out;
}

/** "$8$, $15$, $10$ and $14$" */
function listAnd(xs: number[]): string {
  const parts = xs.map((x) => m(num(x)));
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** Is x a terminating decimal with at most 2 decimal places? */
const twoDp = (x: number) => Math.abs(Math.round(x * 100) - x * 100) < 1e-9;

// ------------------------------------------------------------------ 1. missing value from a mean
const missingValue: Generator = {
  id: 'gen-descriptive-stats-missing-value',
  subtopic: 'descriptive-stats',
  difficulty: 'exam',
  title: 'Find a missing value from a given mean',
  generate(rng: Rng) {
    const contextDefs = [
      { thing: 'number', stem: (n: number, M: number, k: string) => `The mean of ${n} numbers is ${m(num(M))}. Of these, ${n - 1} numbers are ${k}. What is the remaining number?` },
      { thing: 'mark', stem: (n: number, M: number, k: string) => `A student's mean mark over ${n} quizzes is ${m(num(M))}. Her marks in the first ${n - 1} quizzes were ${k}. What mark did she get in the last quiz?` },
      { thing: 'number of umbrellas', stem: (n: number, M: number, k: string) => `A shop sold a mean of ${m(num(M))} umbrellas per day over ${n} days. On ${n - 1} of those days it sold ${k} umbrellas. How many umbrellas did it sell on the remaining day?` },
      { thing: 'age', stem: (n: number, M: number, k: string) => `The mean age of a group of ${n} people is ${m(num(M))} years. The ages of ${n - 1} of them are ${k}. How old is the remaining person?` },
    ];
    const ctx = rng.pick(contextDefs);
    let n = 0;
    let M = 0;
    let known: number[] = [];
    let x = 0;
    let S = 0;
    let T = 0;
    let distractors: { text: string; value: number; why: string }[] | null = null;
    for (;;) {
      n = rng.int(4, 7);
      M = rng.int(6, 30);
      known = Array.from({ length: n - 1 }, () => rng.int(Math.max(1, M - 9), M + 9));
      S = sumOf(known);
      T = n * M;
      x = T - S;
      if (x < 1 || x > M + 15 || x === M) continue;
      const meanKnown = S / (n - 1);
      const tooSmall = (n - 1) * M - S;
      const pool: Cand[] = [
        ...(tooSmall > 0
          ? [{ value: tooSmall, why: `This multiplies the mean by ${n - 1} (the number of values you were given) instead of ${n}, so the total is too small: ${m(`${n - 1} \\times ${M} - ${S}`)}.` }]
          : []),
        ...(twoDp(meanKnown)
          ? [{ value: meanKnown, why: `This is the mean of the ${n - 1} known values, ${m(`\\frac{${S}}{${n - 1}}`)}, not the missing value.` }]
          : []),
        { value: M, why: `This assumes the missing ${ctx.thing} must equal the mean. That is only true if the other values also average ${m(num(M))}.` },
        { value: T, why: `This is the total of all ${n} values, ${m(`${n} \\times ${M}`)}; you still need to subtract the ${n - 1} known values.` },
        { value: (n + 1) * M - S, why: `This multiplies the mean by ${n + 1} instead of ${n} when finding the total.` },
      ];
      distractors = tryPick(x, pool);
      if (distractors) break;
    }
    const answer = m(num(x));
    return {
      stem: ctx.stem(n, M, listAnd(known)),
      answer,
      answerValue: x,
      distractors,
      solution:
        `1. Total of all ${n} values $=$ mean $\\times$ number of values $= ${M} \\times ${n} = ${T}$.\n` +
        `2. Total of the ${n - 1} known values $= ${known.join(' + ')} = ${S}$.\n` +
        `3. Missing value $= ${T} - ${S} = ${x}$.\n\n` +
        `Check: ${m(`\\frac{${S} + ${x}}{${n}} = \\frac{${T}}{${n}} = ${M}`)}.\n\n` +
        `Answer: ${answer}`,
      keyIdea: 'Turn the mean into a total (mean $\\times$ number of values), then subtract the values you already know.',
    };
  },
};

// ------------------------------------------------------------------ 2. mean from a frequency table
const freqMean: Generator = {
  id: 'gen-descriptive-stats-freq-mean',
  subtopic: 'descriptive-stats',
  difficulty: 'exam',
  title: 'Mean from a frequency table',
  generate(rng: Rng) {
    const contexts = [
      { label: 'Goals scored', who: 'matches', intro: 'the number of goals a team scored in each of its matches', ask: 'number of goals per match', start: () => 0 },
      { label: 'Number of pets', who: 'households', intro: 'the number of pets owned by households in a survey', ask: 'number of pets per household', start: () => 0 },
      { label: 'Shoe size', who: 'customers', intro: 'the shoe sizes of customers in a shop one morning', ask: 'shoe size', start: () => rng.int(36, 39) },
      { label: 'Quiz score', who: 'students', intro: 'the scores (out of 10) of students in a short quiz', ask: 'score', start: () => rng.int(5, 6) },
      { label: 'Number of children', who: 'families', intro: 'the number of children in each family on a street', ask: 'number of children per family', start: () => 0 },
    ];
    const ctx = rng.pick(contexts);
    let xs: number[] = [];
    let fs: number[] = [];
    let N = 0;
    let S = 0;
    let mean = 0;
    let distractors: { text: string; value: number; why: string }[] | null = null;
    for (;;) {
      const k = rng.int(4, 5);
      const s0 = ctx.start();
      xs = Array.from({ length: k }, (_, i) => s0 + i);
      fs = Array.from({ length: k }, () => rng.int(1, 9));
      N = sumOf(fs);
      S = sumOf(xs.map((x, i) => x * fs[i]));
      if ((100 * S) % N !== 0) continue;
      mean = S / N;
      const expanded = xs.flatMap((x, i) => Array<number>(fs[i]).fill(x));
      const med = median(expanded);
      const md = modes(expanded);
      const pool: Cand[] = [
        { value: sumOf(xs) / k, why: `This is the mean of the ${k} values in the first column, ignoring how often each one happened. Each value must be weighted by its frequency.` },
        { value: S / k, why: `This divides the total ${m(`\\sum fx = ${S}`)} by the number of rows (${k}) instead of by the number of ${ctx.who} (${N}).` },
        { value: N / k, why: `This is the mean of the frequency column, ${m(`\\frac{${N}}{${k}}`)}: it averages the counts, not the values.` },
        { value: med, why: `This is the **median** (the middle value when all ${N} values are listed in order), not the mean.` },
        ...(md.length === 1 ? [{ value: md[0], why: `This is the **mode** (the value with the highest frequency), not the mean.` }] : []),
      ];
      distractors = tryPick(mean, pool);
      if (distractors) break;
    }
    const answer = m(num(mean));
    const tableRows = xs.map((x, i) => `| ${x} | ${fs[i]} | ${x * fs[i]} |`).join('\n');
    return {
      stem: `The table shows ${ctx.intro}. Find the **mean** ${ctx.ask}.`,
      table: { headers: [`${ctx.label}, $x$`, 'Frequency, $f$'], rows: xs.map((x, i) => [x, fs[i]]) },
      answer,
      answerValue: mean,
      distractors,
      solution:
        `Multiply each value by its frequency and add up both columns.\n\n` +
        `| $x$ | $f$ | $fx$ |\n|---|---|---|\n${tableRows}\n| **Total** | **${N}** | **${S}** |\n\n` +
        `There are ${N} ${ctx.who} in total (${m(`\\sum f = ${N}`)}), and the ${m('fx')} column adds up to ${m(`\\sum fx = ${S}`)}.` +
        dmLine(`\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{${S}}{${N}} = ${num(mean)}`) +
        `Answer: ${answer}`,
      keyIdea: 'Mean from a frequency table: $\\bar{x} = \\frac{\\sum fx}{\\sum f}$, so divide by the number of items, not the number of rows.',
    };
  },
};

function dmLine(t: string): string {
  return `\n\n$$${t}$$\n\n`;
}

// ------------------------------------------------------------------ 3. quartiles, IQR and outlier fence
const iqrFence: Generator = {
  id: 'gen-descriptive-stats-iqr-fence',
  subtopic: 'descriptive-stats',
  difficulty: 'exam',
  title: 'Quartiles, IQR and the upper outlier fence from raw data',
  generate(rng: Rng) {
    const n = rng.pick([7, 11]);
    // Distinct values clustered around a centre; about half the time one value is pushed far out
    // so that the outlier fence actually catches something.
    const centre = rng.int(20, 50);
    const spread = rng.int(8, 14);
    const pool0 = Array.from({ length: 2 * spread + 1 }, (_, i) => centre - spread + i);
    const raw = rng.sample(pool0, n);
    if (rng.bool()) raw[rng.int(0, n - 1)] = rng.bool(0.7) ? centre + spread + rng.int(12, 40) : Math.max(1, centre - spread - rng.int(12, 25));
    const sorted = [...raw].sort((a, b) => a - b);
    const { q1, q2, q3 } = quartiles(sorted);
    const iqr = q3 - q1;
    const range = sorted[n - 1] - sorted[0];
    const half = (n - 1) / 2;
    const qPos = (n + 1) / 4; // 1-indexed position of Q1 (an integer for n = 7, 11)
    const ask = rng.bool() ? 'iqr' : 'fence';
    const methodNote = 'Find the quartiles as the medians of the lower and upper halves (the median itself is not in either half).';
    const lower = sorted.slice(0, half);
    const upper = sorted.slice(half + 1);
    const steps =
      `1. Order the ${n} values: ${sorted.join(', ')}.\n` +
      `2. The median is the ${half + 1}th value: ${m(num(q2))}.\n` +
      `3. Lower half: ${lower.join(', ')}, so ${m(`Q_1 = ${q1}`)}.\n` +
      `4. Upper half: ${upper.join(', ')}, so ${m(`Q_3 = ${q3}`)}.\n` +
      `5. ${m(`\\text{IQR} = Q_3 - Q_1 = ${q3} - ${q1} = ${iqr}`)}.\n`;
    if (ask === 'iqr') {
      const unsortedDiff = Math.abs(raw[3 * qPos - 1] - raw[qPos - 1]);
      const pool: Cand[] = [
        { value: range, why: `This is the **range** (largest minus smallest, ${m(`${sorted[n - 1]} - ${sorted[0]}`)}), not the interquartile range.` },
        { value: q3 - q2, why: `This is only ${m('Q_3 - \\text{median}')}, the upper half of the box. The IQR runs from ${m('Q_1')} to ${m('Q_3')}.` },
        { value: q2 - q1, why: `This is only ${m('\\text{median} - Q_1')}, the lower half of the box. The IQR runs from ${m('Q_1')} to ${m('Q_3')}.` },
        { value: unsortedDiff, why: `This reads the quartile positions (${qPos} and ${3 * qPos}) from the list **without sorting it first**.` },
        { value: q3, why: `This is ${m('Q_3')} itself; you still need to subtract ${m(`Q_1 = ${q1}`)}.` },
        { value: q1 + q3, why: `This adds the quartiles instead of subtracting them.` },
      ];
      const distractors = pickDistractors(iqr, pool);
      const answer = m(num(iqr));
      return {
        stem: `Find the **interquartile range** of these ${n} values. ${methodNote}\n\n${raw.join(', ')}`,
        answer,
        answerValue: iqr,
        distractors,
        solution: `${steps}\nAnswer: ${answer}`,
        keyIdea: 'Always sort first; $Q_1$ and $Q_3$ are the medians of the lower and upper halves, and $\\text{IQR} = Q_3 - Q_1$.',
      };
    }
    const fence = q3 + 1.5 * iqr;
    const outs = sorted.filter((v) => v > fence);
    const pool: Cand[] = [
      { value: q3 + iqr, why: `This adds just one IQR to ${m('Q_3')}, forgetting to multiply the IQR by ${m('1.5')}.` },
      { value: q2 + 1.5 * iqr, why: `This measures ${m('1.5 \\times \\text{IQR}')} from the **median** instead of from ${m('Q_3')}.` },
      { value: 1.5 * iqr, why: `This is only ${m('1.5 \\times \\text{IQR}')}; it still has to be added to ${m(`Q_3 = ${q3}`)}.` },
      { value: q1 - 1.5 * iqr, why: `This is the **lower** fence, ${m('Q_1 - 1.5 \\times \\text{IQR}')}. The question asks for the upper fence.` },
      { value: q3 + 1.5 * range, why: `This uses the range instead of the interquartile range in the outlier rule.` },
      { value: sorted[n - 1] + 1.5 * iqr, why: `This adds ${m('1.5 \\times \\text{IQR}')} to the largest value instead of to ${m('Q_3')}.` },
    ];
    const distractors = pickDistractors(fence, pool);
    const answer = m(num(fence));
    return {
      stem:
        `For the data below, a value is an outlier if it is more than ${m('1.5 \\times \\text{IQR}')} above the upper quartile. ` +
        `Above what value would a data point count as an outlier? ${methodNote}\n\n${raw.join(', ')}`,
      answer,
      answerValue: fence,
      distractors,
      solution:
        steps +
        `6. ${m(`1.5 \\times \\text{IQR} = 1.5 \\times ${iqr} = ${num(1.5 * iqr)}`)}.\n` +
        `7. Upper fence: ${m(`Q_3 + 1.5 \\times \\text{IQR} = ${q3} + ${num(1.5 * iqr)} = ${num(fence)}`)}.\n\n` +
        (outs.length
          ? `So ${outs.length === 1 ? 'the value' : 'the values'} ${listAnd(outs)} ${outs.length === 1 ? 'is an outlier' : 'are outliers'} at the top end.\n\n`
          : `No value in this data set is above the upper fence.\n\n`) +
        `Answer: ${answer}`,
      keyIdea: 'Upper outlier fence $= Q_3 + 1.5 \\times \\text{IQR}$ (and lower fence $= Q_1 - 1.5 \\times \\text{IQR}$).',
    };
  },
};

export const generators: Generator[] = [missingValue, freqMean, iqrFence];
