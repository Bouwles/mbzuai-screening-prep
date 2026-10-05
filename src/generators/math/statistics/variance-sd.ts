import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { approxEqual, sumOf } from '../../../lib/mathx';
import { m, num, paren, sqrtTex, sum } from '../../../lib/tex';

/** Integer as-is, otherwise rounded to 2 decimal places (as the stems ask). */
function dp2(x: number): string {
  if (Math.abs(x - Math.round(x)) < 1e-9) return num(Math.round(x));
  return x.toFixed(2);
}

const isInt = (x: number) => Math.abs(x - Math.round(x)) < 1e-9;

interface Cand {
  value: number;
  text: string;
  why: string;
  /** The deliberate "kept the minus sign" slip; the only candidate allowed to be negative. */
  signSlip?: boolean;
}

/** Keeps the first 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistractors(answerValue: number, answerText: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value)) continue;
    if (approxEqual(c.value, answerValue, 1e-9) || c.text === answerText) continue;
    if (out.some((o) => approxEqual(o.value, c.value, 1e-9) || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

/** n integer deviations from the mean that add to 0, with an integer population variance. */
function pickDeviations(rng: Rng): number[] {
  for (;;) {
    const n = rng.pick([4, 5, 6, 8]);
    const devs = Array.from({ length: n - 1 }, () => rng.int(-6, 6));
    const last = -sumOf(devs);
    if (Math.abs(last) > 7) continue;
    devs.push(last);
    const ss = sumOf(devs.map((d) => d * d));
    if (ss === 0 || ss % n !== 0) continue;
    if (new Set(devs).size < 3) continue;
    return devs;
  }
}

const CONTEXTS = [
  { intro: 'The numbers of goals scored by a team in', unit: 'matches' },
  { intro: 'The numbers of minutes a bus was late on', unit: 'days' },
  { intro: 'The quiz scores of', unit: 'students' },
  { intro: 'The numbers of emails received by', unit: 'employees' },
  { intro: 'The daily rainfall totals (in mm) over', unit: 'days' },
];

export const generators: Generator[] = [
  {
    id: 'gen-variance-sd-from-data',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    title: 'Population variance or standard deviation of a small data set',
    generate(rng) {
      for (;;) {
        const devs = pickDeviations(rng);
        const n = devs.length;
        const mu = rng.int(8, 30);
        const data = devs.map((d) => mu + d);
        const ss = sumOf(devs.map((d) => d * d));
        const V = ss / n;
        const sigma = Math.sqrt(V);
        const sampleVar = ss / (n - 1);
        const absSum = sumOf(devs.map((d) => Math.abs(d)));
        const mad = absSum / n;
        const kind = rng.pick(['variance', 'standard deviation'] as const);
        const ctx = rng.pick(CONTEXTS);

        const answerValue = kind === 'variance' ? V : sigma;
        const answer = m(dp2(answerValue));

        const pool: Cand[] =
          kind === 'variance'
            ? [
                { value: sampleVar, text: m(dp2(sampleVar)), why: `This divides the sum of squared deviations ${m(String(ss))} by ${m(`n - 1 = ${n - 1}`)} (the sample variance). The question asks for the population variance, so divide by ${m(`n = ${n}`)}.` },
                { value: ss, text: m(String(ss)), why: `This is the **sum** of the squared deviations. The variance is their mean, so divide ${m(String(ss))} by ${m(`n = ${n}`)}.` },
                { value: sigma, text: m(dp2(sigma)), why: `This is the **standard deviation** ${m(`\\sqrt{${num(V)}}`)}. The variance is not square-rooted.` },
                { value: mad, text: m(dp2(mad)), why: `This averages the distances from the mean **without squaring** them (the mean absolute deviation, ${m(`\\frac{${absSum}}{${n}}`)}). Variance uses the squared deviations.` },
                { value: V + mu * mu - mu, text: m(dp2(V + mu * mu - mu)), why: `This uses ${m('\\frac{\\sum x^2}{n} - \\bar{x}^2')} but forgets to square the mean, subtracting ${m(String(mu))} instead of ${m(`${mu}^2 = ${mu * mu}`)}.` },
              ]
            : [
                { value: V, text: m(dp2(V)), why: `This is the **variance** ${m(num(V))}. You forgot the last step: the standard deviation is its square root.` },
                { value: Math.sqrt(sampleVar), text: m(dp2(Math.sqrt(sampleVar))), why: `This divides by ${m(`n - 1 = ${n - 1}`)} before taking the square root, which gives the sample SD. The question asks for the population SD, so divide by ${m(`n = ${n}`)}.` },
                { value: mad, text: m(dp2(mad)), why: `This averages the distances from the mean **without squaring** them (the mean absolute deviation, ${m(`\\frac{${absSum}}{${n}}`)}). The SD squares the deviations, averages, then takes the square root.` },
                { value: Math.sqrt(ss), text: m(dp2(Math.sqrt(ss))), why: `This takes the square root of the **sum** of squared deviations, ${m(`\\sqrt{${ss}}`)}, forgetting to divide by ${m(`n = ${n}`)} first.` },
              ];
        const distractors = pickDistractors(answerValue, answer, pool);
        if (distractors.length < 3) continue;

        const rows = data.map((x, i) => `| ${m(String(x))} | ${m(String(devs[i]))} | ${m(String(devs[i] * devs[i]))} |`).join('\n');
        const nonZeroSquares = devs.map((d) => d * d).filter((s) => s > 0);
        const rootStep =
          kind === 'variance'
            ? ''
            : isInt(sigma)
              ? `**Step 5: standard deviation.** ${m(`\\sigma = \\sqrt{${num(V)}} = ${num(sigma)}`)}.\n\n`
              : `**Step 5: standard deviation.** ${m(`\\sigma = \\sqrt{${num(V)}} \\approx ${dp2(sigma)}`)} (2 d.p.).\n\n`;
        const solution =
          `**Step 1: mean.** ${m(`\\bar{x} = \\frac{${data.join(' + ')}}{${n}} = \\frac{${sumOf(data)}}{${n}} = ${mu}`)}.\n\n` +
          `**Step 2: deviations and their squares.**\n\n` +
          `| ${m('x')} | ${m('x - \\bar{x}')} | ${m('(x - \\bar{x})^2')} |\n| --- | --- | --- |\n${rows}\n\n` +
          `**Step 3: add the squared deviations.** ${m(`\\sum (x - \\bar{x})^2 = ${nonZeroSquares.length > 1 ? `${nonZeroSquares.join(' + ')} = ` : ''}${ss}`)}.\n\n` +
          `**Step 4: variance** (divide by ${m(`n = ${n}`)}). ${m(`\\sigma^2 = \\frac{${ss}}{${n}} = ${num(V)}`)}.\n\n` +
          rootStep +
          `Answer: ${answer}`;

        return {
          stem: `${ctx.intro} ${n} ${ctx.unit} are:\n\n${m(data.join(', '))}\n\nFind the **population ${kind}** of these values. Give non-integer answers to 2 decimal places.`,
          answer,
          answerValue,
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea:
            kind === 'variance'
              ? 'Population variance = (sum of squared deviations from the mean) divided by $n$.'
              : 'Population SD = square root of (sum of squared deviations from the mean divided by $n$).',
        };
      }
    },
  },
  {
    id: 'gen-variance-sd-linear-transform',
    subtopic: 'variance-sd',
    difficulty: 'exam',
    title: 'Effect of y = ax + b on the standard deviation or variance',
    generate(rng) {
      for (;;) {
        const kind = rng.pick(['sd', 'var'] as const);
        const mu = rng.int(10, 60);
        const a = kind === 'sd' ? rng.pick([2, 3, 4, 5, -2, -3, -4, 0.5, 1.5]) : rng.pick([2, 3, 4, 5, -2, -3, 0.5]);
        const b = rng.intNonZero(-15, 25);
        const aF = a === 0.5 ? new Frac(1, 2) : a === 1.5 ? new Frac(3, 2) : new Frac(a);
        const absA = Math.abs(a);

        // How the transformation is described.
        const useFormula = a < 0 || a === 1.5 || rng.bool(0.5);
        const formula = a < 0 ? sum([[b, ''], [aF, 'x']]) : sum([[aF, 'x'], [b, '']]);
        const describe = useFormula
          ? `Every value ${m('x')} is replaced by ${m(`y = ${formula}`)}.`
          : `Every value is multiplied by ${m(num(a))} and then ${b > 0 ? `${m(String(b))} is added` : `${m(String(-b))} is subtracted`}.`;

        const newMean = a * mu + b;
        let stem: string;
        let answerValue: number;
        let pool: Cand[];
        let solution: string;

        if (kind === 'sd') {
          const sigma = rng.pick([2, 3, 4, 5, 6, 8, 10, 1.5, 2.5]);
          answerValue = absA * sigma;
          stem = `A data set has mean ${m(String(mu))} and standard deviation ${m(num(sigma))}. ${describe} What is the standard deviation of the new data set?`;
          pool = [
            ...(a < 0
              ? [{ signSlip: true, value: a * sigma, text: m(num(a * sigma)), why: `This multiplies the SD by ${m(num(a))} including its sign. A standard deviation can never be negative: multiply by ${m(`|${num(a)}| = ${num(absA)}`)}.` }]
              : []),
            { value: absA * sigma + b, text: m(num(absA * sigma + b)), why: `This applies the ${m(signed0(b))} to the SD as well. Adding or subtracting the same number shifts every value equally and does not change the spread.` },
            { value: a * a * sigma, text: m(num(a * a * sigma)), why: `This multiplies the SD by ${m(`${paren(a)}^2 = ${num(a * a)}`)}. Squaring the multiplier is the rule for the **variance**; the SD is multiplied by ${m(num(absA))}.` },
            { value: sigma, text: m(num(sigma)), why: `This assumes the SD is unchanged. The added constant does not change it, but multiplying by ${m(num(a))} scales every distance from the mean by ${m(num(absA))}.` },
            { value: (absA * sigma) ** 2, text: m(num((absA * sigma) ** 2)), why: `This is the new **variance** ${m(`${num(absA * sigma)}^2`)}; the question asks for the standard deviation.` },
          ];
          solution =
            `For ${m('y = ax + b')}: the SD is multiplied by ${m('|a|')}, and adding ${m('b')} has **no effect** on spread (it only shifts the values).\n\n` +
            `Here ${m(`a = ${num(a)}`)} and ${m(`b = ${b}`)}, so\n\n` +
            `$$\\sigma_y = |${num(a)}| \\times ${num(sigma)} = ${num(absA)} \\times ${num(sigma)} = ${num(answerValue)}$$\n\n` +
            `(For comparison, the mean does change: ${m(`${paren(a)} \\times ${mu}${signed0(b, true)} = ${num(newMean)}`)}.)\n\n` +
            `Answer: ${m(num(answerValue))}`;
        } else {
          const V = rng.pick([4, 9, 16, 25, 36, 2, 5, 8, 10, 12, 20]);
          answerValue = a * a * V;
          const oldSdTex = sqrtTex(V);
          // New SD = |a| * sqrt(V). Exact surd form, but a plain decimal when it terminates (e.g. 0.5 * 3 = 1.5),
          // so it matches the decimal style of the other options.
          const newSdTex = isInt(absA)
            ? sqrtTex(V * absA * absA)
            : isInt(Math.sqrt(V))
              ? num(absA * Math.sqrt(V))
              : V % 4 === 0
                ? sqrtTex(V / 4)
                : `\\frac{${sqrtTex(V)}}{2}`;
          const oldSdStep = oldSdTex === `\\sqrt{${V}}` ? oldSdTex : `\\sqrt{${V}} = ${oldSdTex}`;
          stem = `A data set has mean ${m(String(mu))} and variance ${m(String(V))}. ${describe} What is the variance of the new data set?`;
          pool = [
            { signSlip: a < 0, value: a * V, text: m(num(a * V)), why: `This multiplies the variance by ${m(num(a))} instead of ${m(`${paren(a)}^2 = ${num(a * a)}`)}. The variance is in squared units, so the multiplier must be squared.` },
            { value: a * a * V + b, text: m(num(a * a * V + b)), why: `This squares the multiplier correctly but also applies the ${m(signed0(b))}. Adding or subtracting a constant does not change the spread.` },
            { value: absA * Math.sqrt(V), text: m(newSdTex), why: `This is the new **standard deviation** ${m(`${num(absA)} \\times ${oldSdTex} = ${newSdTex}`)}; the question asks for the variance, which is its square.` },
            { value: V, text: m(String(V)), why: `This assumes the variance is unchanged. The added constant has no effect, but multiplying by ${m(num(a))} changes the spread.` },
            { value: a * V + b, text: m(num(a * V + b)), why: `This applies the transformation to the variance itself (${m(`${paren(a)} \\times ${V}${signed0(b, true)}`)}): the multiplier should be squared and the constant ignored.` },
          ];
          solution =
            `For ${m('y = ax + b')}: the variance is multiplied by ${m('a^2')}, and adding ${m('b')} has **no effect** on spread.\n\n` +
            `Here ${m(`a = ${num(a)}`)} and ${m(`b = ${b}`)}, so\n\n` +
            `$$\\text{Var}(y) = ${paren(a)}^2 \\times ${V} = ${num(a * a)} \\times ${V} = ${num(answerValue)}$$\n\n` +
            `(Check with SDs: the old SD is ${m(oldSdStep)}, the new SD is ${m(`${num(absA)} \\times ${oldSdTex} = ${newSdTex}`)}, and squaring it gives ${m(num(answerValue))}.)\n\n` +
            `Answer: ${m(num(answerValue))}`;
        }

        const answer = m(num(answerValue));
        // A spread can never be negative or zero here. Allow at most one negative option (the sign slip),
        // so a student cannot eliminate two options just by spotting minus signs.
        const distractors = pickDistractors(answerValue, answer, pool.filter((c) => c.signSlip || c.value > 0));
        if (distractors.length < 3) continue;
        return {
          stem,
          answer,
          answerValue,
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea: 'For $y = ax + b$: mean becomes $a\\bar{x} + b$, SD becomes $|a|\\sigma$, variance becomes $a^2\\sigma^2$; the $+b$ never affects spread.',
        };
      }
    },
  },
];

/** "+5" / "-5" as LaTeX for describing the constant; with spaced=true gives " + 5" / " - 5" for appending. */
function signed0(b: number, spaced = false): string {
  if (spaced) return b < 0 ? ` - ${-b}` : ` + ${b}`;
  return b < 0 ? `-${-b}` : `+${b}`;
}
