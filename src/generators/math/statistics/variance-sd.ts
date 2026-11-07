import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';
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

        const nonZeroSquares = devs.map((d) => d * d).filter((s) => s > 0);
        const hasZero = nonZeroSquares.length < n;
        const solution = steps(
          kind === 'variance'
            ? `**Variance** measures spread. It is the average squared distance from the mean. **Population** means these values are all the data, so we divide by ${m('n')}, the number of values.`
            : `The **standard deviation** (SD) measures how far values tend to be from the mean. **Population** means these values are all the data, so we divide by ${m('n')}, the number of values.`,
          `Find the mean: ${m(`\\frac{${data.join(' + ')}}{${n}} = \\frac{${sumOf(data)}}{${n}} = ${mu}`)}.`,
          `Subtract the mean from each value, then square. Squaring stops the negatives cancelling the positives:\n\n` +
            table(
              ['$x$', m(`x - ${mu}`), m(`(x - ${mu})^2`)],
              data.map((x, i) => [m(String(x)), m(String(devs[i])), m(String(devs[i] * devs[i]))]),
            ),
          `Add the last column${hasZero ? ', where any zero adds nothing' : ''}: ${m(`${nonZeroSquares.join(' + ')} = ${ss}`)}.`,
          kind === 'variance'
            ? `Divide by ${m(`n = ${n}`)}: ${m(`${ss} \\div ${n} = ${num(V)}`)}.`
            : `Divide by ${m(`n = ${n}`)} to get the **variance**, the average squared distance: ${m(`${ss} \\div ${n} = ${num(V)}`)}.`,
          kind !== 'variance' && `The SD is the square root of the variance: ${m(`\\sqrt{${num(V)}} ${isInt(sigma) ? '=' : '\\approx'} ${dp2(sigma)}`)}.`,
        );

        return {
          stem: `${ctx.intro} ${n} ${ctx.unit} are:\n\n${m(data.join(', '))}\n\nFind the **population ${kind}** of these values. Give non-integer answers to 2 decimal places.`,
          answer,
          answerValue,
          distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          asking: `How spread out are these ${n} values, measured by the ${kind}?`,
          solution,
          conclusion:
            kind === 'variance'
              ? `The squared distances total ${ss}, and dividing by ${n} gives the answer, ${answer}.`
              : `The variance is ${num(V)}, and its square root gives the answer, ${answer}.`,
          keyIdea:
            kind === 'variance'
              ? 'Population variance: find the mean, subtract it from each value, square the results, add them, and divide by $n$. A table with one row per value keeps the working tidy.'
              : 'Population SD: find the mean, subtract it from each value, square the results, add them, divide by $n$, then take the square root. A table with one row per value keeps the working tidy.',
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

        // The explanation names a and b, then says what each one does to the gaps between the values.
        const aText = isInt(a) ? `a = ${num(a)}` : `a = ${aF.tex()} = ${num(a)}`;
        const shiftStep = (spreadName: string) =>
          `${b > 0 ? `Adding ${b} moves every value up` : `Subtracting ${-b} moves every value down`} by the same amount. The gaps stay the same, so this part doesn't change the ${spreadName}.`;
        const flip = a < 0 ? ' It also flips the order of the values, but that has no effect on how spread out they are.' : '';
        let stem: string;
        let answerValue: number;
        let pool: Cand[];
        let solution: string;
        let asking: string;
        let conclusion: string;

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
          asking = 'What is the standard deviation after every value is changed this way?';
          solution = steps(
            `The **standard deviation** (SD) measures spread, so ask what the change does to the gaps between values. The mean isn't needed. In the form ${m('y = ax + b')}, the change has ${m(aText)} and ${m(`b = ${b}`)}.`,
            shiftStep('SD'),
            `Multiplying by ${m(num(a))} makes every gap ${m(num(absA))} times as wide.${flip} So the SD is multiplied by ${m(num(absA))}.`,
            `New SD: ${m(`${num(absA)} \\times ${num(sigma)} = ${num(answerValue)}`)}.`,
          );
          conclusion = `Only the multiplying changes the spread, so the SD becomes ${m(num(answerValue))}.`;
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
          stem = `A data set has mean ${m(String(mu))} and variance ${m(String(V))}. ${describe} What is the variance of the new data set?`;
          pool = [
            { signSlip: a < 0, value: a * V, text: m(num(a * V)), why: `This multiplies the variance by ${m(num(a))} instead of ${m(`${paren(a)}^2 = ${num(a * a)}`)}. The variance is in squared units, so the multiplier must be squared.` },
            { value: a * a * V + b, text: m(num(a * a * V + b)), why: `This squares the multiplier correctly but also applies the ${m(signed0(b))}. Adding or subtracting a constant does not change the spread.` },
            { value: absA * Math.sqrt(V), text: m(newSdTex), why: `This is the new **standard deviation** ${m(`${num(absA)} \\times ${oldSdTex} = ${newSdTex}`)}; the question asks for the variance, which is its square.` },
            { value: V, text: m(String(V)), why: `This assumes the variance is unchanged. The added constant has no effect, but multiplying by ${m(num(a))} changes the spread.` },
            { value: a * V + b, text: m(num(a * V + b)), why: `This applies the transformation to the variance itself (${m(`${paren(a)} \\times ${V}${signed0(b, true)}`)}): the multiplier should be squared and the constant ignored.` },
          ];
          asking = 'What is the variance after every value is changed this way?';
          solution = steps(
            `**Variance** measures spread, so ask what the change does to the gaps between values. The mean isn't needed. In the form ${m('y = ax + b')}, the change has ${m(aText)} and ${m(`b = ${b}`)}.`,
            shiftStep('variance'),
            `Multiplying by ${m(num(a))} makes every gap ${m(num(absA))} times as wide.${flip} Variance uses **squared** distances, so it is multiplied by ${m(`${paren(a)}^2 = ${num(a * a)}`)}.`,
            `New variance: ${m(`${num(a * a)} \\times ${V} = ${num(answerValue)}`)}.`,
          );
          conclusion = `Only the multiplying changes the spread, and it counts squared, so the variance becomes ${m(num(answerValue))}.`;
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
          asking,
          solution,
          conclusion,
          keyIdea: 'For $y = ax + b$: new SD $= |a| \\times$ old SD, where $|a|$ is $a$ without any minus sign, and new variance $= a^2 \\times$ old variance. The $b$ only moves the values along, so it never changes the spread.',
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
