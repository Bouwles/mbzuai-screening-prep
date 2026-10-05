import type { Generator } from '../../../types';
import { num } from '../../../lib/tex';

type Cand = { value: number; text: string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: { value: number; text: string }, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  for (const d of pool) {
    if (out.length === 3) break;
    if (same(d.value, answer.value) || d.text === answer.text) continue;
    if (out.some((x) => same(x.value, d.value) || x.text === d.text)) continue;
    out.push(d);
  }
  return out;
}

/** Round to 1 decimal place for display. */
const r1 = (x: number) => Math.round(x * 10) / 10;
/** "25%" or "33.3%" (1 d.p.). */
const pctText = (x: number) => `${num(r1(x), 1)}%`;

// ---------------------------------------------------------------- truncated-axis contexts
interface AxisCtx {
  title: string;
  yLabel: string;
  xLabel: string;
  names: [string, string];
  unit: string; // used in prose: "80 thousand downloads"
  what: string; // "downloads"
}

const AXIS_CTX: AxisCtx[] = [
  { title: 'Monthly downloads', yLabel: 'Downloads (thousands)', xLabel: 'App', names: ['App P', 'App Q'], unit: 'thousand', what: 'downloads' },
  { title: 'Average battery life', yLabel: 'Battery life (minutes)', xLabel: 'Phone', names: ['Phone A', 'Phone B'], unit: 'minutes', what: 'battery life' },
  { title: 'Annual sales', yLabel: 'Sales (AED thousands)', xLabel: 'Shop', names: ['North shop', 'South shop'], unit: 'thousand AED', what: 'sales' },
  { title: 'Weekly website visitors', yLabel: 'Visitors (hundreds)', xLabel: 'Website', names: ['Site X', 'Site Y'], unit: 'hundred visitors', what: 'visitors' },
  { title: 'Daily passengers', yLabel: 'Passengers (hundreds)', xLabel: 'Route', names: ['Route 1', 'Route 2'], unit: 'hundred passengers', what: 'passengers' },
  { title: 'Customers served', yLabel: 'Customers', xLabel: 'Year', names: ['2023', '2024'], unit: 'customers', what: 'customers served' },
];

// ---------------------------------------------------------------- combined-rate contexts
interface RateCtx {
  group: string; // "class"
  names: [string, string];
  item: string; // "students"
  success: string; // "passed the test"
  rateWord: string; // "pass rate"
  failWord: string; // "fail rate"
}

const RATE_CTX: RateCtx[] = [
  { group: 'class', names: ['Class A', 'Class B'], item: 'students', success: 'passed the test', rateWord: 'pass rate', failWord: 'fail rate' },
  { group: 'hospital', names: ['Hospital North', 'Hospital South'], item: 'patients', success: 'recovered', rateWord: 'recovery rate', failWord: 'non-recovery rate' },
  { group: 'model test set', names: ['Test set 1', 'Test set 2'], item: 'images', success: 'were classified correctly', rateWord: 'accuracy', failWord: 'error rate' },
  { group: 'factory', names: ['Factory East', 'Factory West'], item: 'items', success: 'passed the quality check', rateWord: 'pass rate', failWord: 'reject rate' },
  { group: 'campaign', names: ['Email campaign', 'Phone campaign'], item: 'customers contacted', success: 'made a purchase', rateWord: 'success rate', failWord: 'no-purchase rate' },
];

export const generators: Generator[] = [
  // ---------------------------------------------------------------- truncated axis: real percentage change
  {
    id: 'gen-valid-conclusions-truncated-axis',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    title: 'Truncated axis: find the real percentage difference',
    generate(rng) {
      const ctx = rng.pick(AXIS_CTX);
      // a = smaller value, p = real % increase, k = how many times as tall the bigger bar LOOKS
      let a = 0;
      let p = 0;
      let k = 0;
      let d = 0;
      let h = 0;
      for (;;) {
        p = rng.pick([4, 5, 8, 10, 12, 15, 20, 25]);
        a = rng.int(2, 30) * 10;
        k = rng.int(2, 5);
        d = (a * p) / 100;
        if (!Number.isInteger(d)) continue;
        h = d / (k - 1); // visible height of the smaller bar
        if (!Number.isInteger(h) || h < 2) continue;
        if (a - h <= 0) continue;
        if (h > a / 2) continue; // keep the axis clearly truncated
        break;
      }
      const b = a + d;
      const yMin = a - h;
      const [nA, nB] = ctx.names;
      const answer = { value: p, text: `${p}%` };
      const kWord = ['', '', 'twice', '3 times', '4 times', '5 times'][k];
      const pool: Cand[] = [
        {
          value: (k - 1) * 100,
          text: `${(k - 1) * 100}%`,
          why: `This is how much taller ${nB}'s bar **looks**: measured from ${yMin}, the visible heights are ${h} and ${h + d}, an increase of ${(k - 1) * 100}%. That describes the picture, not the data, because the axis does not start at 0.`,
        },
        {
          value: k * 100,
          text: `${k * 100}%`,
          why: `This turns "the bar looks ${kWord} as tall" into ${k * 100}%. It is based on the misleading picture, and "${k} times as big" would only be a ${(k - 1) * 100}% increase anyway.`,
        },
        {
          value: r1((d * 100) / b),
          text: pctText((d * 100) / b),
          why: `This divides the difference of ${d} by ${nB}'s value (${b}) instead of ${nA}'s value (${a}). A percentage increase is always divided by the value you start from.`,
        },
        {
          value: d,
          text: `${d}%`,
          why: `This writes the difference of ${d} ${ctx.unit} as if it were a percentage. You must divide the difference by ${a} and multiply by 100.`,
        },
        {
          value: 100 + p,
          text: `${100 + p}%`,
          why: `This gives ${nB}'s value as a percentage **of** ${nA}'s value (${b} is ${100 + p}% of ${a}). The question asks how much **higher** it is, which is ${100 + p}% minus 100%.`,
        },
      ];
      const distractors = pickDistinct(answer, pool);
      const stem =
        `The bar chart compares ${ctx.what} for ${nA} (${a}) and ${nB} (${b}). Its vertical axis starts at ${yMin}, so on the chart ${nB}'s bar looks ${kWord} as tall as ${nA}'s bar. ` +
        `By what percentage is ${nB}'s value **actually** higher than ${nA}'s? (Give answers to 1 decimal place where needed.)`;
      const solution =
        `Step 1: Read the real values: ${nA} = ${a}, ${nB} = ${b}.\n\n` +
        `Step 2: Difference: $${b} - ${a} = ${d}$.\n\n` +
        `Step 3: Divide by the **starting** value (${nA}) and multiply by 100:\n\n` +
        `$$\\frac{${d}}{${a}} \\times 100 = ${p}\\%$$\n\n` +
        `Why the chart misleads: above ${yMin} the visible bar heights are $${a} - ${yMin} = ${h}$ and $${b} - ${yMin} = ${h + d}$, so ${nB}'s bar looks $\\frac{${h + d}}{${h}} = ${k}$ times as tall, even though the real difference is only ${p}%.\n\n` +
        `Answer: ${answer.text}`;
      return {
        stem,
        chart: {
          kind: 'bar',
          title: ctx.title,
          xLabel: ctx.xLabel,
          yLabel: ctx.yLabel,
          categories: [nA, nB],
          series: [{ name: ctx.yLabel, values: [a, b] }],
          yMin,
        },
        answer: answer.text,
        answerValue: answer.value,
        distractors: distractors.map((x) => ({ text: x.text, value: x.value, why: x.why })),
        solution,
        keyIdea:
          'Ignore the bar heights when the axis is truncated: use the real values, percentage change $= \\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100$.',
      };
    },
  },

  // ---------------------------------------------------------------- combined rate (aggregation)
  {
    id: 'gen-valid-conclusions-combined-rate',
    subtopic: 'valid-conclusions',
    difficulty: 'exam',
    title: 'Combine two groups: the overall rate is not the average of the rates',
    generate(rng) {
      const ctx = rng.pick(RATE_CTX);
      let n1 = 0;
      let n2 = 0;
      let r1p = 0;
      let r2p = 0;
      let combined = 0;
      for (;;) {
        n1 = rng.pick([20, 25, 40, 50, 60, 80, 100, 120, 150, 200]);
        n2 = rng.pick([20, 25, 40, 50, 60, 80, 100, 120, 150, 200]);
        r1p = rng.int(6, 19) * 5; // 30% .. 95%
        r2p = rng.int(6, 19) * 5;
        if (n1 === n2 || Math.abs(r1p - r2p) < 15) continue;
        if (!Number.isInteger((n1 * r1p) / 100) || !Number.isInteger((n2 * r2p) / 100)) continue;
        combined = (n1 * r1p + n2 * r2p) / (n1 + n2);
        if (!Number.isInteger(combined)) continue;
        // the unweighted average must be clearly different from the true combined rate
        if (Math.abs((r1p + r2p) / 2 - combined) < 2) continue;
        break;
      }
      const k1 = (n1 * r1p) / 100;
      const k2 = (n2 * r2p) / 100;
      const N = n1 + n2;
      const K = k1 + k2;
      const [g1, g2] = ctx.names;
      const answer = { value: combined, text: `${combined}%` };
      const avg = (r1p + r2p) / 2;
      const swapped = (n2 * r1p + n1 * r2p) / N;
      const pool: Cand[] = [
        {
          value: avg,
          text: pctText(avg),
          why: `This averages the two percentages: $\\frac{${r1p} + ${r2p}}{2} = ${num(avg)}\\%$. That only works when the groups are the same size, but there are ${n1} ${ctx.item} in ${g1} and ${n2} in ${g2}.`,
        },
        {
          value: 100 - combined,
          text: `${100 - combined}%`,
          why: `This is the combined ${ctx.failWord}: $\\frac{${N - K}}{${N}} \\times 100 = ${100 - combined}\\%$. The question asks for the ${ctx.rateWord}.`,
        },
        {
          value: r1(swapped),
          text: pctText(swapped),
          why: `This weights each rate by the **other** group's size: ${r1p}% of ${n2} plus ${r2p}% of ${n1} gives $${num((n2 * r1p) / 100)} + ${num((n1 * r2p) / 100)} = ${num((n2 * r1p + n1 * r2p) / 100)}$ out of ${N}, which is ${pctText(swapped)}. Each rate must be applied to its own group.`,
        },
        {
          value: r1((K * 100) / Math.max(n1, n2)),
          text: pctText((K * 100) / Math.max(n1, n2)),
          why: `This divides the total of ${K} by the bigger group's size (${Math.max(n1, n2)}) only. The total must be divided by everyone in both groups, ${N}.`,
        },
        {
          value: r1p + r2p,
          text: `${r1p + r2p}%`,
          why: `This adds the two percentages. Percentages of different groups cannot be added; add the counts instead and divide by the total.`,
        },
      ];
      const distractors = pickDistinct(answer, pool);
      const stem =
        `In ${g1}, ${k1} out of ${n1} ${ctx.item} ${ctx.success} (${r1p}%). In ${g2}, ${k2} out of ${n2} ${ctx.item} ${ctx.success} (${r2p}%). ` +
        `What is the ${ctx.rateWord} for the two groups **combined**? (Give answers to 1 decimal place where needed.)`;
      const solution =
        `Step 1: Add the successes: $${k1} + ${k2} = ${K}$.\n\n` +
        `Step 2: Add the group sizes: $${n1} + ${n2} = ${N}$.\n\n` +
        `Step 3: Divide and multiply by 100:\n\n` +
        `$$\\frac{${K}}{${N}} \\times 100 = ${combined}\\%$$\n\n` +
        `The simple average of ${r1p}% and ${r2p}% would be ${pctText(avg)}, which is wrong here because the bigger group (${n1 > n2 ? g1 : g2}) counts for more.\n\n` +
        `Answer: ${answer.text}`;
      return {
        stem,
        table: {
          headers: ['Group', `Number of ${ctx.item}`, 'Successes', 'Rate'],
          rows: [
            [g1, n1, k1, `${r1p}%`],
            [g2, n2, k2, `${r2p}%`],
          ],
        },
        answer: answer.text,
        answerValue: answer.value,
        distractors: distractors.map((x) => ({ text: x.text, value: x.value, why: x.why })),
        solution,
        keyIdea: 'To combine rates from groups of different sizes, add the counts and divide by the total; never average the percentages.',
      };
    },
  },
];
