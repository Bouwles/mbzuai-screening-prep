import type { ChartSpec, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { num } from '../../../lib/tex';

type Cand = { text: string; value: number | string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answer: { text: string; value: number | string }, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (d.value === answer.value || d.text === answer.text) continue;
    if (out.some((x) => x.value === d.value || x.text === d.text)) continue;
    out.push(d);
  }
  return out;
}

const sumOf = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Index of the largest value and whether it is the only one with that value. */
function uniqueMax(xs: number[]): { i: number; unique: boolean } {
  const top = Math.max(...xs);
  return { i: xs.indexOf(top), unique: xs.filter((x) => x === top).length === 1 };
}

// ================================================================ 1. largest increase on a line/bar chart

interface TrendCtx {
  title: string;
  yLabel: string;
  noun: string; // "the number of visitors"
  unit: string; // "thousand"
}

const TREND_CTX: TrendCtx[] = [
  { title: 'Museum visitors per year (thousands)', yLabel: 'Visitors (thousands)', noun: 'the number of visitors', unit: 'thousand' },
  { title: 'Bicycles sold per year (hundreds)', yLabel: 'Bicycles sold (hundreds)', noun: 'bicycle sales', unit: 'hundred' },
  { title: 'App downloads per year (thousands)', yLabel: 'Downloads (thousands)', noun: 'the number of downloads', unit: 'thousand' },
  { title: 'Solar panels installed per year (hundreds)', yLabel: 'Panels installed (hundreds)', noun: 'the number of panels installed', unit: 'hundred' },
  { title: 'Members of a sports club', yLabel: 'Members', noun: 'the number of club members', unit: 'members' },
];

interface TrendData {
  values: number[];
  R: number; // interval with the largest rise
  F: number; // interval with the largest fall
  M: number; // interval that ends at the maximum value
  P: number; // interval with the largest percentage rise
}

function analyseTrend(values: number[]): TrendData | null {
  const d = values.slice(1).map((v, i) => v - values[i]);
  const rise = uniqueMax(d);
  if (d[rise.i] <= 0 || !rise.unique) return null;
  const fall = uniqueMax(d.map((x) => -x));
  if (d[fall.i] >= 0 || !fall.unique || -d[fall.i] <= d[rise.i]) return null;
  const top = uniqueMax(values);
  if (!top.unique || top.i === 0) return null;
  const M = top.i - 1;
  // percentage rise (compare as fractions d / previous value; only rises count)
  const pct = d.map((x, i) => (x > 0 ? x / values[i] : -1));
  const p = uniqueMax(pct);
  if (!p.unique) return null;
  const R = rise.i;
  if (M === R || p.i === R || p.i === M) return null;
  return { values, R, F: fall.i, M, P: p.i };
}

/**
 * Fixed fallback that satisfies every condition (largest rise 2nd interval, bigger fall 3rd,
 * peak reached in the 5th interval, largest percentage rise 1st). Only used if the random search fails.
 */
const TREND_FALLBACK = [5, 15, 40, 10, 25, 45];

function trendData(rng: Rng): TrendData {
  for (let tries = 0; tries < 20000; tries++) {
    const values = Array.from({ length: 6 }, () => 5 * rng.int(1, 10));
    const t = analyseTrend(values);
    if (t) return t;
  }
  return analyseTrend(TREND_FALLBACK)!;
}

// ================================================================ 2. histogram: count above / below a boundary

interface HistCtx {
  title: string;
  xLabel: string;
  things: string; // "seedlings"
  measure: string; // "height"
  measures: string; // "heights" (plural, used in the stem)
  unit: string; // "cm"
  starts: number[];
  widths: number[];
}

const HIST_CTX: HistCtx[] = [
  { title: 'Heights of seedlings', xLabel: 'Height (cm)', things: 'seedlings', measure: 'height', measures: 'heights', unit: 'cm', starts: [0], widths: [5, 10] },
  { title: 'Masses of apples', xLabel: 'Mass (g)', things: 'apples', measure: 'mass', measures: 'masses', unit: 'g', starts: [100, 120, 150], widths: [10, 20] },
  { title: 'Times to finish a 5 km run', xLabel: 'Time (minutes)', things: 'runners', measure: 'time', measures: 'finishing times', unit: 'minutes', starts: [20, 25, 30], widths: [5] },
  { title: 'Ages of gym members', xLabel: 'Age (years)', things: 'gym members', measure: 'age', measures: 'ages', unit: 'years', starts: [10, 15, 20], widths: [10] },
  { title: 'Daily screen time of students', xLabel: 'Screen time (minutes)', things: 'students', measure: 'screen time', measures: 'daily screen times', unit: 'minutes', starts: [0, 60], widths: [30, 60] },
];

/** "a height", "an age": the measure with the right indefinite article. */
const aMeasure = (ctx: HistCtx) => (/^[aeiou]/i.test(ctx.measure) ? 'an ' : 'a ') + ctx.measure;

/** ["a", "b", "c"] -> "a, b and c". */
const listAnd = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

// ================================================================ 3. pie chart: angle of a sector

interface PieCtx {
  question: (n: number) => string;
  labels: string[];
  people: string;
}

const PIE_CTX: PieCtx[] = [
  { question: (n) => `${n} students were asked to name their favourite fruit.`, labels: ['Apple', 'Banana', 'Mango', 'Orange'], people: 'students' },
  { question: (n) => `${n} employees were asked how they usually travel to work.`, labels: ['Car', 'Bus', 'Metro', 'Walk'], people: 'employees' },
  { question: (n) => `${n} cinema visitors were asked their favourite type of film.`, labels: ['Comedy', 'Action', 'Drama', 'Animation'], people: 'visitors' },
  { question: (n) => `${n} teenagers were asked about their main hobby.`, labels: ['Reading', 'Gaming', 'Sport', 'Music'], people: 'teenagers' },
];

/** Totals for which every person is a whole number of degrees. */
const PIE_TOTALS = [40, 60, 72, 90, 120, 180];

const deg = (x: number) => `$${num(x)}^\\circ$`;

export const generators: Generator[] = [
  // ---------------------------------------------------------------- largest increase
  {
    id: 'gen-reading-charts-largest-increase',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    title: 'Largest increase between consecutive years on a chart',
    generate: (rng) => {
      const ctx = rng.pick(TREND_CTX);
      const start = rng.int(2014, 2019);
      const years = Array.from({ length: 6 }, (_, i) => String(start + i));
      const { values, R, F, M, P } = trendData(rng);
      const kind = rng.pick(['line', 'bar'] as const);
      const d = values.slice(1).map((v, i) => v - values[i]);
      const label = (i: number) => `${years[i]} to ${years[i + 1]}`;

      const chart: ChartSpec = {
        kind,
        title: ctx.title,
        xLabel: 'Year',
        yLabel: ctx.yLabel,
        categories: years,
        series: [{ name: ctx.yLabel, values }],
      };

      const answer = label(R);
      const pctOf = (i: number) => {
        const p = (d[i] / values[i]) * 100;
        return Number.isInteger(p) ? `${p}%` : `about ${Math.round(p)}%`;
      };
      const pool: Cand[] = [
        {
          text: label(F),
          value: label(F),
          why: `This is the biggest **change** (${-d[F]} ${ctx.unit}), but it is a **decrease**: ${ctx.noun} fell from ${values[F]} to ${values[F + 1]}.`,
        },
        {
          text: label(M),
          value: label(M),
          why: `${years[M + 1]} has the highest value on the chart (${values[M + 1]}), but the increase into that year was only $${values[M + 1]} - ${values[M]} = ${d[M]}$. The highest value is not the largest increase.`,
        },
        {
          text: label(P),
          value: label(P),
          why: `This interval has the largest **percentage** increase (from ${values[P]} to ${values[P + 1]}, ${pctOf(P)}), but the actual increase is only ${d[P]} ${ctx.unit}, less than ${d[R]} ${ctx.unit}.`,
        },
      ];
      const distractors = pickDistinct({ text: answer, value: answer }, pool);

      const rows = d
        .map((x, i) => `| ${label(i)} | $${values[i + 1]} - ${values[i]} = ${x}$ |`)
        .join('\n');
      const solution =
        `**Step 1: read every ${kind === 'bar' ? 'bar' : 'point'}** from the gridlines: ${values.join(', ')}.\n\n` +
        `**Step 2: subtract each year's value from the next year's value.**\n\n` +
        `| Interval | Change |\n| --- | --- |\n${rows}\n\n` +
        `**Step 3: choose the biggest positive change.** The largest increase is ${d[R]} ${ctx.unit}, from ${values[R]} to ${values[R + 1]}.` +
        (kind === 'line' ? ' On the graph this is the steepest upward segment.' : '') +
        `\n\nAnswer: ${answer}`;

      return {
        stem:
          `The ${kind === 'bar' ? 'bar chart' : 'line graph'} shows ${ctx.noun} each year. ` +
          `Between which two consecutive years was the **increase** largest? (Compare the actual increase, not the percentage increase.)`,
        chart,
        answer,
        answerValue: answer,
        distractors,
        solution,
        keyIdea: 'The largest increase is the biggest positive difference between consecutive values (the steepest rise), not the highest value and not a fall.',
      };
    },
  },

  // ---------------------------------------------------------------- histogram count
  {
    id: 'gen-reading-charts-histogram-count',
    subtopic: 'reading-charts',
    difficulty: 'exam',
    title: 'Count the values above or below a boundary on a histogram',
    generate: (rng) => {
      for (;;) {
        const ctx = rng.pick(HIST_CTX);
        const start = rng.pick(ctx.starts);
        const w = rng.pick(ctx.widths);
        const edges = Array.from({ length: 6 }, (_, i) => start + i * w);
        const freq = Array.from({ length: 5 }, () => 5 * rng.int(1, 5));
        if (Math.max(...freq) < 15) continue; // keeps every bar exactly on a gridline (gridlines every 5)
        const k = rng.int(1, 4); // boundary = edges[k]
        const B = edges[k];
        const atLeast = rng.bool();
        const total = sumOf(freq);
        const sumRange = (a: number, b: number) => sumOf(freq.slice(a, b)); // classes a..b-1
        const ans = atLeast ? sumRange(k, 5) : sumRange(0, k);

        const pool: Cand[] = atLeast
          ? [
              { text: `$${sumRange(k - 1, 5)}$`, value: sumRange(k - 1, 5), why: `This also counts the ${edges[k - 1]} to ${B} class, but those ${ctx.things} are **below** ${B} ${ctx.unit}.` },
              { text: `$${sumRange(k + 1, 5)}$`, value: sumRange(k + 1, 5), why: `This leaves out the ${B} to ${edges[k + 1]} class. "At least ${B}" includes ${B} itself, and that class starts at ${B}.` },
              { text: `$${total - ans}$`, value: total - ans, why: `This is the number **below** ${B} ${ctx.unit}: the wrong side of the boundary.` },
              { text: `$${freq[k]}$`, value: freq[k], why: `This is only the height of the single bar starting at ${B}; the bars to its right are also at least ${B} ${ctx.unit}.` },
              { text: `$${total}$`, value: total, why: `This is the total of all the bars, not just those at least ${B} ${ctx.unit}.` },
            ]
          : [
              { text: `$${sumRange(0, k + 1)}$`, value: sumRange(0, k + 1), why: `This also counts the ${B} to ${edges[k + 1]} class, but those ${ctx.things} have ${aMeasure(ctx)} of at least ${B} ${ctx.unit}, so they are not less than ${B}.` },
              { text: `$${sumRange(0, k - 1)}$`, value: sumRange(0, k - 1), why: `This leaves out the ${edges[k - 1]} to ${B} class, which is entirely below ${B} ${ctx.unit}.` },
              { text: `$${total - ans}$`, value: total - ans, why: `This is the number with ${aMeasure(ctx)} of **at least** ${B} ${ctx.unit}: the wrong side of the boundary.` },
              { text: `$${freq[k - 1]}$`, value: freq[k - 1], why: `This is only the height of the single bar just below ${B}; the bars to its left are also less than ${B} ${ctx.unit}.` },
              { text: `$${total}$`, value: total, why: `This is the total of all the bars, not just those less than ${B} ${ctx.unit}.` },
            ];
        const distractors = pickDistinct({ text: `$${ans}$`, value: ans }, pool.filter((c) => c.value !== 0));
        if (distractors.length < 3) continue;

        const used = atLeast ? freq.slice(k) : freq.slice(0, k);
        const usedClasses = (atLeast ? edges.slice(k, 5) : edges.slice(0, k)).map((e) => `${e} to ${e + w}`);
        const header = `| ${ctx.xLabel} | ${edges.slice(0, 5).map((e) => `${e} to ${e + w}`).join(' | ')} |`;
        const sep = `| --- | ${freq.map(() => '---').join(' | ')} |`;
        const row = `| Frequency | ${freq.join(' | ')} |`;
        const answer = `$${ans}$`;
        const solution =
          `**Step 1: read the height of every bar** (gridlines every 5):\n\n${header}\n${sep}\n${row}\n\n` +
          `**Step 2: decide which classes are needed.** Each class includes its lower boundary but not its upper one, so "${atLeast ? `at least ${B}` : `less than ${B}`}" means the ${usedClasses.length === 1 ? 'class' : 'classes'} ${listAnd(usedClasses)}.\n\n` +
          `**Step 3: add their frequencies.** ${used.length === 1 ? `There is just one class: ${used[0]}.` : `$${used.join(' + ')} = ${ans}$`}\n\n` +
          `Answer: ${answer}`;

        return {
          stem:
            `The histogram shows the ${ctx.measures} of a group of ${ctx.things}. Each class includes its lower boundary but not its upper boundary. ` +
            `How many ${ctx.things} have ${aMeasure(ctx)} of **${atLeast ? 'at least' : 'less than'} ${B} ${ctx.unit}**?`,
          chart: { kind: 'histogram', title: ctx.title, xLabel: ctx.xLabel, yLabel: 'Frequency', edges, frequencies: freq },
          answer,
          answerValue: ans,
          distractors,
          solution,
          keyIdea: 'On a histogram, each bar\'s height is the number in that class: decide exactly which classes satisfy the condition, then add their heights.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- pie chart angle
  {
    id: 'gen-reading-charts-pie-angle',
    subtopic: 'reading-charts',
    difficulty: 'foundation',
    title: 'Angle of a pie chart sector from counts',
    generate: (rng) => {
      for (;;) {
        const ctx = rng.pick(PIE_CTX);
        const N = rng.pick(PIE_TOTALS);
        // four counts, each at least N/10, adding to N
        const minC = Math.ceil(N / 10);
        const a = rng.int(minC, N - 3 * minC);
        const b = rng.int(minC, N - a - 2 * minC);
        const c = rng.int(minC, N - a - b - minC);
        const counts = rng.shuffle([a, b, c, N - a - b - c]);
        if (new Set(counts).size < 4) continue;
        const t = rng.int(0, 3);
        const cnt = counts[t];
        const per = 360 / N; // a whole number for every total in PIE_TOTALS
        const angle = (cnt * 360) / N;
        const pct = (cnt * 100) / N;
        const other = (counts[(t + 1) % 4] * 360) / N;

        const pool: Cand[] = [
          { text: deg(cnt), value: cnt, why: `This uses the number of ${ctx.people} (${cnt}) as the angle. That only works when the total is 360; here the total is ${N}.` },
          ...((cnt * 1000) % N === 0
            ? [{ text: deg(pct), value: pct, why: `This is the **percentage** of ${ctx.people} (${num(pct, 1)}%), not the angle. A whole circle is 360 degrees, not 100.` }]
            : []),
          { text: deg(cnt * 3.6), value: Math.round(cnt * 36) / 10, why: `This is $${cnt} \\times 3.6$, which assumes the total is 100 ${ctx.people}. You need to add the slices: the total is ${N}.` },
          { text: deg(other), value: other, why: `This is the angle of the ${ctx.labels[(t + 1) % 4]} sector: the wrong slice was read from the key.` },
          { text: deg(90), value: 90, why: 'This assumes the four sectors are equal (each a quarter of 360 degrees). They have different sizes.' },
        ];
        const answer = deg(angle);
        const distractors = pickDistinct({ text: answer, value: angle }, pool);
        if (distractors.length < 3) continue;

        const solution =
          `**Step 1: find the total** by adding every slice: $${counts.join(' + ')} = ${N}$ ${ctx.people}.\n\n` +
          `**Step 2: the whole circle (360 degrees) stands for all ${N} ${ctx.people}**, so each person gets $360 \\div ${N} = ${num(per)}$ degrees.\n\n` +
          `**Step 3: angle of the ${ctx.labels[t]} sector.**\n\n` +
          `$$\\frac{${cnt}}{${N}} \\times 360^\\circ = ${cnt} \\times ${num(per)}^\\circ = ${num(angle)}^\\circ$$\n\n` +
          `Check: the four angles are ${listAnd(counts.map((x) => deg((x * 360) / N)))}, and $${counts.map((x) => num((x * 360) / N)).join(' + ')} = 360$, as they should be for a full circle.\n\nAnswer: ${answer}`;

        return {
          stem: `${ctx.question(N)} The pie chart shows how many ${ctx.people} gave each answer. What is the angle of the **${ctx.labels[t]}** sector?`,
          chart: { kind: 'pie', title: 'Number of ' + ctx.people, slices: ctx.labels.map((l, i) => ({ label: l, value: counts[i] })) },
          answer,
          answerValue: angle,
          distractors,
          solution,
          keyIdea: 'A sector\'s angle is its share of the total times 360 degrees: $\\text{angle} = \\frac{\\text{count}}{\\text{total}} \\times 360^\\circ$.',
        };
      }
    },
  },
];
