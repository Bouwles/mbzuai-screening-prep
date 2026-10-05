import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { nCr } from '../../../lib/mathx';
import { m, num } from '../../../lib/tex';

type Cand = { text: string; value: number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistractors(answerText: string, answerValue: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value)) continue;
    if (Math.abs(c.value - answerValue) < 1e-9 || c.text === answerText) continue;
    if (out.some((o) => Math.abs(o.value - c.value) < 1e-9 || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

/** Decimal for a probability given in tenths, e.g. 3 -> "0.3". */
const tenths = (t: number): string => num(t / 10);

export const generators: Generator[] = [
  // ------------------------------------------------------------------ 1. table -> find k -> E(X)
  {
    id: 'gen-expected-binomial-table-mean',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    title: 'Probability table with an unknown: find E(X)',
    generate(rng: Rng): GeneratedCore {
      for (;;) {
        // four distinct values, sorted
        const xs = rng.sample([0, 1, 2, 3, 4, 5, 6], 4).sort((a, b) => a - b);
        // four probabilities in tenths, each >= 1, summing to 10
        const cuts = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3).sort((a, b) => a - b);
        const ts = [cuts[0], cuts[1] - cuts[0], cuts[2] - cuts[1], 10 - cuts[2]];
        const unk = rng.int(0, 3);
        const knownSum = ts.reduce((s, t, i) => (i === unk ? s : s + t), 0);

        // exact arithmetic in tenths: E = sum x*t / 10
        const eTenths = xs.reduce((s, x, i) => s + x * ts[i], 0);
        const ans = eTenths / 10;
        const ex2 = xs.reduce((s, x, i) => s + x * x * ts[i], 0) / 10;
        const meanX = (xs[0] + xs[1] + xs[2] + xs[3]) / 4;
        const missK = (eTenths - xs[unk] * ts[unk]) / 10;
        const maxT = Math.max(...ts);
        const modeUnique = ts.filter((t) => t === maxT).length === 1;
        const modeX = xs[ts.indexOf(maxT)];

        const pool: Cand[] = [
          {
            text: m(num(meanX)),
            value: meanX,
            why: `This is the plain average of the four values, ${m(`\\frac{${xs.join(' + ')}}{4}`)}. It ignores the probabilities, as if every value were equally likely.`,
          },
          {
            text: m(num(ex2)),
            value: ex2,
            why: `This is ${m('E(X^2) = \\sum x^2 \\, P(X = x)')}: the values were squared before multiplying by the probabilities.`,
          },
          {
            text: m(num(missK)),
            value: missK,
            why: `This leaves out the term for ${m(`x = ${xs[unk]}`)}, as if ${m('k')} were 0. Find ${m(`k = ${tenths(ts[unk])}`)} first and include every value.`,
          },
          {
            text: m(num(ans / 4)),
            value: ans / 4,
            why: `This divides the correct total by 4. The probabilities already do the averaging, so nothing should be divided at the end.`,
          },
        ];
        if (modeUnique)
          pool.push({
            text: m(num(modeX)),
            value: modeX,
            why: `This is the **most likely** value (the mode), not the expected value. ${m('E(X)')} is a weighted average of all the values.`,
          });
        const answerText = m(num(ans));
        const ds = pickDistractors(answerText, ans, pool);
        if (ds.length < 3) continue;

        const probCells = ts.map((t, i) => (i === unk ? '$k$' : m(tenths(t))));
        const knownList = ts.filter((_, i) => i !== unk).map(tenths);
        const products = xs.map((x, i) => `${x}(${tenths(ts[i])})`).join(' + ');
        const productVals = xs.map((x, i) => num((x * ts[i]) / 10)).join(' + ');
        const solution =
          `**Step 1: find ${m('k')}.** The probabilities add up to 1:` +
          `\n\n$$${knownList.join(' + ')} + k = 1$$\n\n` +
          `so ${m(`k = 1 - ${tenths(knownSum)} = ${tenths(ts[unk])}`)}.\n\n` +
          `**Step 2: expected value.** Multiply each value by its probability and add:` +
          `\n\n$$E(X) = ${products}$$\n\n` +
          `$$= ${productVals} = ${num(ans)}$$\n\n` +
          `Answer: ${answerText}`;
        return {
          stem: `The discrete random variable ${m('X')} has the probability distribution shown in the table, where ${m('k')} is a constant. Find ${m('E(X)')}.`,
          table: {
            headers: ['$x$', ...xs.map((x) => m(String(x)))],
            rows: [['$P(X = x)$', ...probCells]],
          },
          answer: answerText,
          answerValue: ans,
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea: 'Use "probabilities sum to 1" to find $k$, then $E(X) = \\sum x \\, P(X = x)$.',
        };
      }
    },
  },
  // ------------------------------------------------------------------ 2. binomial P(X = r)
  {
    id: 'gen-expected-binomial-pmf',
    subtopic: 'expected-binomial',
    difficulty: 'exam',
    title: 'Binomial probability P(X = r)',
    generate(rng: Rng): GeneratedCore {
      const contexts = [
        { trial: 'A seed is planted', succ: 'germinates', noun: 'seeds that germinate', many: 'seeds are planted' },
        { trial: 'A light bulb is tested', succ: 'is faulty', noun: 'faulty bulbs', many: 'bulbs are tested' },
        { trial: 'A penalty is taken', succ: 'is scored', noun: 'penalties scored', many: 'penalties are taken' },
        { trial: 'A customer is surveyed', succ: 'says yes', noun: 'customers who say yes', many: 'customers are surveyed' },
        { trial: 'An email is received', succ: 'is spam', noun: 'spam emails', many: 'emails are received' },
      ];
      for (;;) {
        const n = rng.int(3, 6);
        const a = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]); // p = a/10 (0.5 avoided so p and 1-p differ)
        const r = rng.int(1, n - 1);
        const b = 10 - a;
        const ctx = rng.pick(contexts);
        const den = 10 ** n;
        // exact probability as integer / 10^n
        const C = nCr(n, r);
        const exactInt = C * a ** r * b ** (n - r);
        const to4 = round4;
        const fmt4 = (v: number) => v.toFixed(4);
        const ansV = to4(exactInt, den);
        if (ansV < 0.01) continue;
        const ansText = m(fmt4(ansV));

        const p = a / 10;
        const q = b / 10;
        const noC = to4(a ** r * b ** (n - r), den);
        const swapped = to4(C * b ** r * a ** (n - r), den);
        const nPr = C * factorialSmall(r);
        const perm = to4(nPr * a ** r * b ** (n - r), den);
        const noFail = to4(C * a ** r, 10 ** r);
        let cum = 0;
        for (let k = 0; k <= r; k++) cum += nCr(n, k) * a ** k * b ** (n - k);
        const cumV = to4(cum, den);

        const pTex = num(p);
        const qTex = num(q);
        const pool: Cand[] = [
          {
            text: m(fmt4(noC)),
            value: noC,
            why: `This is ${m(`${pw(pTex, r)} \\times ${pw(qTex, n - r)}`)} only, the probability of **one particular order**. It forgets the ${m(`\\binom{${n}}{${r}} = ${C}`)} different orders.`,
          },
          {
            text: m(fmt4(swapped)),
            value: swapped,
            why: `This swaps ${m('p')} and ${m('1-p')}: it uses ${m(`${pw(qTex, r)} \\times ${pw(pTex, n - r)}`)}, which is the probability of exactly ${r} **failure${r === 1 ? '' : 's'}**.`,
          },
          {
            text: m(fmt4(cumV)),
            value: cumV,
            why: `This is the cumulative probability ${m(`P(X \\le ${r})`)}, adding ${m('P(X = 0)')} up to ${m(`P(X = ${r})`)}. The question asks for **exactly** ${r}.`,
          },
          {
            text: m(fmt4(perm)),
            value: perm,
            why: `This counts ordered arrangements, ${m(`{}^{${n}}P_{${r}} = ${nPr}`)}, instead of ${m(`\\binom{${n}}{${r}} = ${C}`)}. The successes are identical, so divide by ${m(`${r}!`)}.`,
          },
          {
            text: m(fmt4(noFail)),
            value: noFail,
            why: `This is ${m(`\\binom{${n}}{${r}} \\times ${pw(pTex, r)}`)} and leaves out the factor ${m(`${pw(qTex, n - r)}`)} for the ${n - r} failure${n - r === 1 ? '' : 's'}.`,
          },
        ].filter((c) => c.value > 0 && c.value < 1);
        const ds = pickDistractors(ansText, ansV, pool);
        if (ds.length < 3) continue;

        const exact = exactInt / den;
        const exactTex = num(exact, n);
        const isExact4 = Math.abs(exact - ansV) < 1e-12;
        const solution =
          `Let ${m('X')} be the number of ${ctx.noun}. There are ${m(`n = ${n}`)} independent trials, each a success with probability ${m(`p = ${pTex}`)}, so ${m(`X \\sim \\text{B}(${n}, ${pTex})`)}.\n\n` +
          `Use ${m('P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}')} with ${m(`r = ${r}`)}:\n\n` +
          `- Number of orders: ${m(`\\binom{${n}}{${r}} = ${C}`)}\n` +
          `- ${r} success${r === 1 ? '' : 'es'}: ${m(`${pw(pTex, r)}`)}\n` +
          `- ${n - r} failure${n - r === 1 ? '' : 's'}: ${m(`${pw(qTex, n - r)}`)}\n\n` +
          `$$P(X = ${r}) = ${C} \\times ${pw(pTex, r)} \\times ${pw(qTex, n - r)} = ${exactTex}$$\n\n` +
          (isExact4 ? '' : `To 4 decimal places this is ${m(fmt4(ansV))}.\n\n`) +
          `Answer: ${ansText}`;
        return {
          stem: `${ctx.trial} and ${ctx.succ} with probability ${m(pTex)}, independently of the others. ${n} ${ctx.many}. What is the probability that **exactly** ${r} of them ${r === 1 ? ctx.succ : ctx.succ.replace(/^is /, 'are ').replace(/^says /, 'say ').replace(/^germinates/, 'germinate')}? Give your answer to 4 decimal places.`,
          answer: ansText,
          answerValue: ansV,
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea: '$P(X = r) = \\binom{n}{r} p^r (1-p)^{n-r}$: count the orders, then multiply the success and failure probabilities.',
        };
      }
    },
  },
  // ------------------------------------------------------------------ 3. binomial mean / variance
  {
    id: 'gen-expected-binomial-mean-var',
    subtopic: 'expected-binomial',
    difficulty: 'foundation',
    title: 'Mean or variance of a binomial distribution',
    generate(rng: Rng): GeneratedCore {
      for (;;) {
        const quarter = rng.bool(0.3);
        const pf = quarter ? new Frac(rng.pick([1, 3]), 4) : new Frac(rng.pick([1, 2, 3, 4, 6, 7, 8, 9]), 10);
        const n = quarter ? 4 * rng.int(2, 15) : 5 * rng.int(2, 12);
        const askVar = rng.bool(0.6);
        const qf = new Frac(1).sub(pf);
        const meanF = pf.mul(n);
        const varF = meanF.mul(qf);
        const pTex = num(pf.value());
        const qTex = num(qf.value());
        const mean = meanF.value();
        const v = varF.value();
        const sd = Math.sqrt(v);
        // show the SD as a plain number when it is a short exact decimal (e.g. 1.5), otherwise as a surd
        const sdIsNice = Math.abs(Math.round(sd * 100) - sd * 100) < 1e-9;
        const sdText = sdIsNice ? m(num(sd)) : m(`\\sqrt{${num(v)}}`);
        const answerValue = askVar ? v : mean;
        const answerText = m(num(answerValue));
        const pool: Cand[] = askVar
          ? [
              { text: m(num(mean)), value: mean, why: `This is the **mean** ${m(`np = ${n} \\times ${pTex}`)}. The variance also needs the factor ${m(`(1-p) = ${qTex}`)}.` },
              { text: sdText, value: sd, why: `This is the **standard deviation** ${m('\\sqrt{np(1-p)}')}. The variance is not square-rooted.` },
              { text: m(num(meanF.mul(pf).value())), value: meanF.mul(pf).value(), why: `This uses ${m('np^2')}, multiplying by ${m('p')} twice instead of by ${m('p')} and then ${m('1-p')}.` },
              { text: m(num(pf.mul(qf).value())), value: pf.mul(qf).value(), why: `This is ${m('p(1-p)')}, the variance of a **single** trial. It forgets to multiply by ${m(`n = ${n}`)}.` },
            ]
          : [
              { text: m(num(v)), value: v, why: `This is the **variance** ${m('np(1-p)')}, not the mean.` },
              { text: m(num(qf.mul(n).value())), value: qf.mul(n).value(), why: `This is ${m(`n(1-p) = ${n} \\times ${qTex}`)}, the expected number of **failures**, not successes.` },
              { text: sdText, value: sd, why: `This is the **standard deviation** ${m('\\sqrt{np(1-p)}')}, not the mean.` },
              { text: m(num(n / 2)), value: n / 2, why: `This assumes success and failure are equally likely (half of ${n}). The success probability here is ${m(pTex)}, not ${m('0.5')}.` },
            ];
        const ds = pickDistractors(answerText, answerValue, pool);
        if (ds.length < 3) continue;
        const what = askVar ? `the variance ${m('\\text{Var}(X)')}` : `the mean ${m('E(X)')}`;
        const solution = askVar
          ? `For ${m('X \\sim \\text{B}(n, p)')} the variance is ${m('\\text{Var}(X) = np(1-p)')}.\n\n` +
            `Here ${m(`n = ${n}`)}, ${m(`p = ${pTex}`)} and ${m(`1 - p = ${qTex}`)}.\n\n` +
            `$$\\text{Var}(X) = ${n} \\times ${pTex} \\times ${qTex} = ${num(mean)} \\times ${qTex} = ${num(v)}$$\n\n` +
            `Answer: ${answerText}`
          : `For ${m('X \\sim \\text{B}(n, p)')} the mean is ${m('E(X) = np')}.\n\n` +
            `Here ${m(`n = ${n}`)} and ${m(`p = ${pTex}`)}.\n\n` +
            `$$E(X) = ${n} \\times ${pTex} = ${num(mean)}$$\n\n` +
            `Answer: ${answerText}`;
        return {
          stem: `The random variable ${m('X')} follows a binomial distribution, ${m(`X \\sim \\text{B}(${n}, ${pTex})`)}. Find ${what}.`,
          answer: answerText,
          answerValue,
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea: 'For $\\text{B}(n, p)$: mean $np$, variance $np(1-p)$, standard deviation $\\sqrt{np(1-p)}$.',
        };
      }
    },
  },
];

/** k / d rounded half-up to 4 d.p., using integer arithmetic (d is a power of 10). */
function round4(k: number, d: number): number {
  if (d <= 10000) return (k * (10000 / d)) / 10000;
  const s = d / 10000;
  return Math.floor((2 * k + s) / (2 * s)) / 10000;
}

/** "b^{e}", or just "b" when e = 1. */
function pw(base: string, e: number): string {
  return e === 1 ? base : `${base}^{${e}}`;
}

function factorialSmall(k: number): number {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return f;
}
