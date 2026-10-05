import type { Generator } from '../../../types';
import { m, num } from '../../../lib/tex';

type Cand = { text: string; value: number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answerText: string, answerValue: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const key = (t: string) => t.replace(/\s+/g, '');
  for (const d of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(d.value)) continue;
    if (Math.abs(d.value - answerValue) < 1e-9 || key(d.text) === key(answerText)) continue;
    if (out.some((x) => Math.abs(x.value - d.value) < 1e-9 || key(x.text) === key(d.text))) continue;
    out.push(d);
  }
  return out;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

// ---------------------------------------------------------------- percentage change contexts
interface ChangeCtx {
  title: string;
  what: string; // "the number of downloads"
  yLabel: string;
  cats: string[];
  catWord: string; // "month"
  kind: 'bar' | 'line';
}

const CHANGE_CTX: ChangeCtx[] = [
  { title: 'Monthly app downloads', what: 'the number of downloads', yLabel: 'Downloads', cats: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], catWord: 'month', kind: 'bar' },
  { title: 'Annual revenue (AED thousands)', what: 'the revenue', yLabel: 'Revenue (AED thousands)', cats: ['2020', '2021', '2022', '2023', '2024', '2025'], catWord: 'year', kind: 'line' },
  { title: 'Weekly website visitors', what: 'the number of visitors', yLabel: 'Visitors', cats: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'], catWord: 'week', kind: 'line' },
  { title: 'Books borrowed from a library', what: 'the number of books borrowed', yLabel: 'Books borrowed', cats: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'], catWord: 'month', kind: 'bar' },
  { title: 'Images labelled by a team', what: 'the number of images labelled', yLabel: 'Images labelled', cats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], catWord: 'day', kind: 'bar' },
];

const OLD_VALUES = [40, 50, 60, 80, 120, 150, 160, 200, 240, 250, 300, 320, 400, 480, 500, 600, 800];
const PCTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75];

const pctText = (p: number, up: boolean) => `${m(`${num(p, 2)}\\%`)} ${up ? 'increase' : 'decrease'}`;

// ---------------------------------------------------------------- grouped data contexts
interface GroupCtx {
  intro: (n: number) => string;
  label: string;
  v: string; // variable letter
  unit: string;
  widths: number[];
  starts: number[];
}

const GROUP_CTX: GroupCtx[] = [
  { intro: (n) => `The table shows the time ${n} students spent on a revision task.`, label: 'Time', v: 't', unit: 'minutes', widths: [5, 10, 20], starts: [0, 10, 20] },
  { intro: (n) => `The table shows the heights of ${n} plants in an experiment.`, label: 'Height', v: 'h', unit: 'cm', widths: [5, 10], starts: [10, 20, 30] },
  { intro: (n) => `The table shows the masses of ${n} parcels at a delivery depot.`, label: 'Mass', v: 'w', unit: 'kg', widths: [2, 4, 5], starts: [0, 2, 10] },
  { intro: (n) => `The table shows the response times of a web server for ${n} requests.`, label: 'Response time', v: 'r', unit: 'ms', widths: [20, 50], starts: [0, 100, 200] },
];

// ---------------------------------------------------------------- combined mean contexts
interface MeanCtx {
  groups: [string, string];
  member: string; // "students"
  measure: string; // "test score"
  unit: string; // '' or ' hours'
}

const MEAN_CTX: MeanCtx[] = [
  { groups: ['Class A', 'Class B'], member: 'students', measure: 'test score', unit: '' },
  { groups: ['the morning shift', 'the afternoon shift'], member: 'workers', measure: 'number of parcels packed per hour', unit: '' },
  { groups: ['Batch 1', 'Batch 2'], member: 'phones', measure: 'battery life', unit: ' hours' },
  { groups: ['the first team', 'the second team'], member: 'annotators', measure: 'number of images labelled per day', unit: '' },
];

export const generators: Generator[] = [
  // ---------------------------------------------------------------- percentage change from a chart
  {
    id: 'gen-data-calculations-percent-change',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    title: 'Percentage change between two values on a chart',
    generate(rng) {
      for (;;) {
        const ctx = rng.pick(CHANGE_CTX);
        const old = rng.pick(OLD_VALUES);
        const p = rng.pick(PCTS);
        const up = rng.bool(0.55);
        const nw = (old * (100 + (up ? p : -p))) / 100;
        if (!Number.isInteger(nw)) continue;
        const i = rng.int(0, 3);
        const j = rng.int(i + 1, 5);
        // other bars: plausible values near the old value (multiples of 10 when the scale allows)
        const step = old >= 100 ? 10 : 5;
        const values = ctx.cats.map(() => Math.max(step, Math.round((old * (0.7 + rng.next() * 0.6)) / step) * step));
        values[i] = old;
        values[j] = nw;
        const diff = Math.abs(nw - old);
        const answer = pctText(p, up);
        const answerValue = up ? p : -p;
        const sign = up ? 1 : -1;

        const byNew = r2((diff / nw) * 100);
        const ratio = (nw / old) * 100;
        const pool: Cand[] = [
          {
            text: pctText(byNew, up),
            value: sign * byNew,
            why: `This is ${m(`\\frac{${diff}}{${nw}} \\times 100`)}: it divides the change by the **new** value (${nw}) instead of the original value (${old}).`,
          },
          {
            text: pctText(ratio, up),
            value: sign * ratio,
            why: `This is ${m(`\\frac{${nw}}{${old}} \\times 100`)}, the new value as a percentage **of** the old value. The change is the difference from ${m('100\\%')}, which is ${m(`${num(p)}\\%`)}.`,
          },
          {
            text: pctText(p, !up),
            value: -sign * p,
            why: `This has the right size but the wrong direction: ${ctx.what} went from ${old} to ${nw}, which is ${up ? 'up' : 'down'}, not ${up ? 'down' : 'up'}.`,
          },
          {
            text: pctText(diff, up),
            value: sign * diff,
            why: `This is the raw change, ${diff}, written as a percentage. You must divide the change by the original value ${old} and multiply by 100.`,
          },
        ];
        // A count cannot fall by 100% or more, so such a "decrease" would be an impossible (giveaway) option.
        const usable = up ? pool : pool.filter((d) => d.value > -100);
        const distractors = pickDistinct(answer, answerValue, usable);
        if (distractors.length < 3) continue;
        const from = ctx.cats[i];
        const to = ctx.cats[j];
        return {
          stem: `The ${ctx.kind === 'bar' ? 'bar chart' : 'line graph'} shows ${ctx.what} in each ${ctx.catWord}. What is the percentage change in ${ctx.what} from ${from} to ${to}? (Percentages are rounded to 2 decimal places where necessary.)`,
          chart: { kind: ctx.kind, title: ctx.title, xLabel: ctx.catWord[0].toUpperCase() + ctx.catWord.slice(1), yLabel: ctx.yLabel, categories: ctx.cats, series: [{ name: ctx.yLabel, values }] },
          answer,
          answerValue,
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution:
            `Read the chart: ${from} $= ${old}$, ${to} $= ${nw}$.\n\n` +
            `Step 1. Change $= \\text{new} - \\text{old} = ${nw} - ${old} = ${nw - old}$` +
            ` (${up ? 'positive, so an increase' : 'negative, so a decrease'}).\n\n` +
            `Step 2. Divide the size of the change by the **original** value (${from}) and multiply by 100:\n\n` +
            `$$\\frac{${diff}}{${old}} \\times 100 = ${num(p)}\\%$$\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'Percentage change = (new - old) divided by the OLD value, times 100; the sign tells you increase or decrease.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- estimated mean from grouped data
  {
    id: 'gen-data-calculations-grouped-mean',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    title: 'Estimate the mean from a grouped frequency table',
    generate(rng) {
      for (;;) {
        const ctx = rng.pick(GROUP_CTX);
        const w = rng.pick(ctx.widths);
        const s = rng.pick(ctx.starts);
        const k = rng.int(4, 5);
        const f = Array.from({ length: k }, () => rng.int(2, 18));
        const N = f.reduce((a, b) => a + b, 0);
        const lows = f.map((_, i) => s + i * w);
        const mids = lows.map((lo) => lo + w / 2);
        // work in halves to stay exact: 2*sum(fx) is an integer
        const twoSumFx = f.reduce((acc, fi, i) => acc + fi * (2 * lows[i] + w), 0);
        // need the mean to be exact to 2 d.p.: 100 * twoSumFx / (2N) integer
        if ((100 * twoSumFx) % (2 * N) !== 0) continue;
        const sumFx = twoSumFx / 2;
        const meanV = sumFx / N;
        const u = ` ${ctx.unit}`;
        const ans = `${m(num(meanV, 2))}${u}`;

        const meanMids = mids.reduce((a, b) => a + b, 0) / k;
        const pool: Cand[] = [
          { text: `${m(num(meanV + w / 2, 2))}${u}`, value: r2(meanV + w / 2), why: `This uses the **upper** end of each class instead of the midpoint, which makes every value ${num(w / 2)} too big.` },
          { text: `${m(num(meanV - w / 2, 2))}${u}`, value: r2(meanV - w / 2), why: `This uses the **lower** end of each class instead of the midpoint, which makes every value ${num(w / 2)} too small.` },
          { text: `${m(num(meanMids, 2))}${u}`, value: r2(meanMids), why: 'This is the mean of the midpoints on their own; it ignores how many values are in each class (the frequencies).' },
          { text: `${m(num(sumFx / k, 2))}${u}`, value: r2(sumFx / k), why: `This divides ${m(`\\sum fx = ${num(sumFx)}`)} by the ${k} classes instead of by the total frequency ${N}.` },
          { text: `${m(num(sumFx, 2))}${u}`, value: r2(sumFx), why: `This is ${m('\\sum fx')}, the estimated total, before dividing by the total frequency ${N}.` },
        ];
        const distractors = pickDistinct(ans, meanV, pool);
        if (distractors.length < 3) continue;

        const rows = f.map((fi, i) => `| ${m(`${lows[i]} \\le ${ctx.v} < ${lows[i] + w}`)} | ${num(mids[i])} | ${fi} | ${num(fi * mids[i])} |`);
        return {
          stem: `${ctx.intro(N)} Estimate the mean ${ctx.label.toLowerCase()}. (Give your answer to 2 decimal places where necessary.)`,
          table: {
            headers: [`${ctx.label} ${m(ctx.v)} (${ctx.unit})`, 'Frequency'],
            rows: f.map((fi, i) => [m(`${lows[i]} \\le ${ctx.v} < ${lows[i] + w}`), fi]),
          },
          answer: ans,
          answerValue: meanV,
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution:
            'The exact values are unknown, so assume every value in a class sits at the class **midpoint** (halfway between the class limits).\n\n' +
            `| Class | Midpoint ${m('x')} | ${m('f')} | ${m('fx')} |\n|---|---|---|---|\n${rows.join('\n')}\n| **Total** | | **${N}** | **${num(sumFx)}** |\n\n` +
            `Estimated mean $= \\frac{\\sum fx}{\\sum f} = \\frac{${num(sumFx)}}{${N}} = ${num(meanV, 2)}$\n\n` +
            `Answer: ${ans}`,
          keyIdea: 'For grouped data use the class midpoints: estimated mean = (sum of f times midpoint) divided by (sum of f).',
        };
      }
    },
  },

  // ---------------------------------------------------------------- combined mean / missing group mean
  {
    id: 'gen-data-calculations-combined-mean',
    subtopic: 'data-calculations',
    difficulty: 'exam',
    title: 'Combine the means of two groups (or find a missing group mean)',
    generate(rng) {
      for (;;) {
        const ctx = rng.pick(MEAN_CTX);
        const n1 = rng.int(2, 8) * 5;
        const n2 = rng.int(2, 8) * 5;
        const m1 = rng.int(40, 90);
        const m2 = rng.int(40, 90);
        if (n1 === n2 || m1 === m2) continue;
        const N = n1 + n2;
        const total = n1 * m1 + n2 * m2;
        // overall mean must be exact to 1 d.p.
        if ((10 * total) % N !== 0) continue;
        const M = total / N;
        const [g1, g2] = ctx.groups;
        const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
        const u = ctx.unit;
        const missing = rng.bool();

        if (!missing) {
          const ans = `${m(num(M, 2))}${u}`;
          const pool: Cand[] = [
            { text: `${m(num((m1 + m2) / 2, 2))}${u}`, value: r2((m1 + m2) / 2), why: `This is the simple average of the two means, ${m(`\\frac{${m1} + ${m2}}{2}`)}. The groups have different sizes, so the larger group must count for more.` },
            { text: `${m(num((n2 * m1 + n1 * m2) / N, 2))}${u}`, value: r2((n2 * m1 + n1 * m2) / N), why: `This weights each mean with the **other** group's size: ${m(`\\frac{${n2} \\times ${m1} + ${n1} \\times ${m2}}{${N}}`)}.` },
            {
              text: `${m(num(n1 > n2 ? m1 : m2))}${u}`,
              value: n1 > n2 ? m1 : m2,
              why: `This is just the mean of the bigger group (${n1 > n2 ? g1 : g2}), as if the smaller group made no difference. The bigger group pulls the combined mean towards its own mean, but the ${Math.min(n1, n2)} ${ctx.member} in the smaller group still count, so the combined mean lies strictly between ${Math.min(m1, m2)} and ${Math.max(m1, m2)}.`,
            },
            { text: `${m(num(total / 2, 2))}${u}`, value: r2(total / 2), why: `This divides the combined total ${total} by the 2 groups instead of by the ${N} ${ctx.member}.` },
            { text: `${m(num(total, 2))}${u}`, value: total, why: `This is the combined total, ${total}, before dividing by the ${N} ${ctx.member}.` },
          ];
          const distractors = pickDistinct(ans, M, pool);
          if (distractors.length < 3) continue;
          return {
            stem: `${cap(g1)} has ${n1} ${ctx.member} with a mean ${ctx.measure} of ${m1}${u}. ${cap(g2)} has ${n2} ${ctx.member} with a mean ${ctx.measure} of ${m2}${u}. What is the mean ${ctx.measure} of all ${N} ${ctx.member} together? (Options are given to 2 decimal places where necessary.)`,
            answer: ans,
            answerValue: M,
            distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
            solution:
              'Means cannot be averaged directly when the groups are different sizes. Convert each mean to a **total** (mean times number), add, then divide by the total number.\n\n' +
              `- ${cap(g1)}: ${m(`${n1} \\times ${m1} = ${n1 * m1}`)}\n` +
              `- ${cap(g2)}: ${m(`${n2} \\times ${m2} = ${n2 * m2}`)}\n\n` +
              `Combined total $= ${n1 * m1} + ${n2 * m2} = ${total}$, shared between ${m(`${n1} + ${n2} = ${N}`)} ${ctx.member}.\n\n` +
              `$$\\text{mean} = \\frac{${total}}{${N}} = ${num(M, 2)}$$\n\n` +
              `Answer: ${ans}`,
            keyIdea: 'Combined mean = (sum of each group size times its mean) divided by the total size: a weighted average.',
          };
        }

        // missing group mean: answer m2 (an integer)
        const left = total - n1 * m1;
        const ans = `${m(num(m2))}${u}`;
        const pool: Cand[] = [
          { text: `${m(num(2 * M - m1, 2))}${u}`, value: r2(2 * M - m1), why: `This assumes both groups are the same size, so that ${num(M, 2)} is exactly halfway between ${m1} and the answer. The groups have ${n1} and ${n2} ${ctx.member}.` },
          { text: `${m(num(left / n1, 2))}${u}`, value: r2(left / n1), why: `This divides the remaining total ${left} by ${n1} (the size of ${g1}) instead of by ${n2}.` },
          { text: `${m(num(left / N, 2))}${u}`, value: r2(left / N), why: `This divides the remaining total ${left} by all ${N} ${ctx.member} instead of by the ${n2} in ${g2}.` },
          { text: `${m(num(left))}${u}`, value: left, why: `This is the total for ${g2}, ${left}, before dividing by its ${n2} ${ctx.member}.` },
        ];
        const distractors = pickDistinct(ans, m2, pool);
        if (distractors.length < 3) continue;
        return {
          stem: `A group of ${N} ${ctx.member} has a mean ${ctx.measure} of ${num(M, 2)}${u}. The ${n1} ${ctx.member} in ${g1} have a mean ${ctx.measure} of ${m1}${u}. The other ${n2} ${ctx.member} are in ${g2}. What is the mean ${ctx.measure} of ${g2}? (Options are given to 2 decimal places where necessary.)`,
          answer: ans,
          answerValue: m2,
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution:
            'Work with **totals** (mean times number), because totals can be subtracted but means cannot.\n\n' +
            `- Total for all ${N}: ${m(`${N} \\times ${num(M, 2)} = ${total}`)}\n` +
            `- Total for ${g1}: ${m(`${n1} \\times ${m1} = ${n1 * m1}`)}\n` +
            `- Total for ${g2}: ${m(`${total} - ${n1 * m1} = ${left}`)}\n\n` +
            `$$\\text{mean} = \\frac{${left}}{${n2}} = ${m2}$$\n\n` +
            `Check: ${m(`\\frac{${n1 * m1} + ${left}}{${N}} = ${num(M, 2)}`)}.\n\n` +
            `Answer: ${ans}`,
          keyIdea: 'Turn means into totals (mean times count), subtract to find the missing total, then divide by that group\'s size.',
        };
      }
    },
  },
];
