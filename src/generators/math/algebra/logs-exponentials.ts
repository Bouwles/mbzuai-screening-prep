import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m, num, signed, sum, term } from '../../../lib/tex';

type Cand = { text: string; value: number; why: string };

/** Keep the first 3 candidates that differ from the answer and from each other (by value AND by text). */
function pickDistractors(answerText: string, answerValue: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const clean = (s: string) => s.replace(/\s+/g, '');
  for (const c of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(c.value)) continue;
    if (Math.abs(c.value - answerValue) < 1e-9 || clean(c.text) === clean(answerText)) continue;
    if (out.some((o) => Math.abs(o.value - c.value) < 1e-9 || clean(o.text) === clean(c.text))) continue;
    out.push(c);
  }
  return out;
}

/** Fixed decimal places, never "-0.00". */
function fixed(x: number, dp: number): string {
  const s = x.toFixed(dp);
  return /^-0\.?0*$/.test(s) ? s.slice(1) : s;
}

const lnb = (x: number, b: number) => Math.log(x) / Math.log(b);

export const generators: Generator[] = [
  // ------------------------------------------------------------------ 1. solve b^(mx + p) = c
  {
    id: 'gen-logs-exponentials-solve-exp',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    title: 'Solve an exponential equation using logarithms',
    generate(rng) {
      for (;;) {
        const b = rng.pick([2, 3, 5, 6, 7]);
        const mm = rng.pick([1, 1, 2, 3]);
        const p = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.int(10, 200);
        // c must not be an exact power of b (otherwise no logs are needed)
        if (Math.abs(lnb(c, b) - Math.round(lnb(c, b))) < 1e-9) continue;
        const L = Math.log(c) / Math.log(b);
        const x = (L - p) / mm;
        if (Math.abs(x) < 0.05) continue;
        // avoid answers sitting on a rounding boundary (e.g. 1.2350) where 2 d.p. is ambiguous
        if (Math.abs(Math.abs(x) * 100 - Math.floor(Math.abs(x) * 100) - 0.5) < 0.02) continue;
        const ansS = fixed(x, 2);
        const answer = m(`x = ${ansS}`);
        const answerValue = Number(ansS);
        const expTex = sum([
          [mm, 'x'],
          [p, ''],
        ]);
        const opt = (v: number) => ({ text: m(`x = ${fixed(v, 2)}`), value: Number(fixed(v, 2)) });
        const pool: Cand[] = [];
        if (mm > 1)
          pool.push({
            ...opt(L / mm - p),
            why: `This divides only the ${m(term(mm, 'x', true))} by ${mm} and not the ${Math.abs(p)}, going from ${m(`${expTex} = ${num(L, 4)}`)} to ${m(`x${signed(p)} = \\frac{${num(L, 4)}}{${mm}}`)}, so the ${Math.abs(p)} is never divided by ${mm}. Move the ${Math.abs(p)} across first, then divide by ${mm}.`,
          });
        pool.push({
          ...opt((L + p) / mm),
          why: `This moves the ${Math.abs(p)} to the other side with the wrong sign. From ${m(`${expTex} = ${num(L, 4)}`)} you must ${p > 0 ? 'subtract' : 'add'} ${Math.abs(p)}.`,
        });
        pool.push({
          ...opt((Math.log10(c) - p) / mm),
          why: `This uses ${m(`\\log ${c}`)} on its own, forgetting to divide by ${m(`\\log ${b}`)}. Taking logs gives ${m(`\\left(${expTex}\\right)\\log ${b} = \\log ${c}`)}.`,
        });
        pool.push({
          ...opt((Math.log(c / b) - p) / mm),
          why: `This replaces ${m(`\\frac{\\ln ${c}}{\\ln ${b}}`)} by ${m(`\\ln \\frac{${c}}{${b}}`)}. A quotient of logs is **not** the log of a quotient.`,
        });
        if (mm > 1)
          pool.push({
            ...opt(L - p),
            why: `This finds ${m(`${term(mm, 'x', true)} = ${num(L - p, 4)}`)} but forgets the last step of dividing by ${mm}.`,
          });
        pool.push({
          ...opt((Math.log(b) / Math.log(c) - p) / mm),
          why: `This turns the log ratio upside down, using ${m(`\\frac{\\ln ${b}}{\\ln ${c}}`)} instead of ${m(`\\frac{\\ln ${c}}{\\ln ${b}}`)}.`,
        });
        pool.push({
          ...opt((c / b - p) / mm),
          why: `This skips logarithms and divides ${c} by ${b}, treating the power as if it were a multiplier.`,
        });
        const ds = pickDistractors(answer, answerValue, pool);
        if (ds.length < 3) continue;

        const steps: string[] = [];
        steps.push(`Take $\\ln$ of both sides and bring the power down (power law): ${m(`\\left(${expTex}\\right)\\ln ${b} = \\ln ${c}`)}.`);
        steps.push(`Divide by ${m(`\\ln ${b}`)}: ${m(`${expTex} = \\frac{\\ln ${c}}{\\ln ${b}} = ${num(L, 4)}`)} (this is ${m(`\\log_{${b}} ${c}`)}).`);
        const afterP = L - p;
        steps.push(`${p > 0 ? 'Subtract' : 'Add'} ${Math.abs(p)}: ${m(`${term(mm, 'x', true)} = ${num(L, 4)}${signed(-p)} = ${num(afterP, 4)}`)}.`);
        if (mm > 1) steps.push(`Divide by ${mm}: ${m(`x = \\frac{${num(afterP, 4)}}{${mm}} = ${num(x, 4)}`)}.`);
        steps.push(`To 2 decimal places, ${m(`x = ${ansS}`)}.`);
        return {
          stem: `Solve ${m(`${b}^{${expTex}} = ${c}`)}, giving $x$ to 2 decimal places.`,
          answer,
          answerValue,
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution: steps.join('\n\n') + `\n\nAnswer: ${answer}`,
          keyIdea: 'Take logs of both sides so the power comes down as a multiplier, then solve the resulting linear equation.',
        };
      }
    },
  },
  // ------------------------------------------------------------------ 2. simplify with log laws
  {
    id: 'gen-logs-exponentials-log-laws',
    subtopic: 'logs-exponentials',
    difficulty: 'foundation',
    title: 'Combine logarithms with the log laws',
    generate(rng) {
      for (;;) {
        const b = rng.pick([2, 3, 5]);
        const type = rng.pick(['diff', 'power', 'three'] as const);
        const L = (arg: string) => `\\log_{${b}} ${arg}`;
        const coprime = (s: number) => s % b !== 0;
        let stemExpr = '';
        let n = 0;
        let steps: string[] = [];
        const pool: Cand[] = [];
        if (type === 'diff') {
          n = b === 5 ? rng.int(1, 2) : rng.int(1, 3);
          const Y = rng.pick([3, 5, 6, 7, 10, 11, 12, 13].filter(coprime));
          const X = Y * b ** n;
          if (X > 400) continue;
          stemExpr = `${L(String(X))} - ${L(String(Y))}`;
          steps = [
            `Quotient law, ${m('\\log a - \\log b = \\log \\frac{a}{b}')}: ${m(`${stemExpr} = ${L(`\\frac{${X}}{${Y}}`)} = ${L(String(b ** n))}`)}.`,
            n === 1
              ? `The log of the base itself is 1 (because ${b} to the power 1 is ${b}), so ${m(`${L(String(b))} = 1`)}.`
              : `Since ${m(`${b}^{${n}} = ${b ** n}`)}, ${m(`${L(String(b ** n))} = ${n}`)}.`,
          ];
          pool.push({ text: m(String(b ** n)), value: b ** n, why: `This stops at ${m(L(String(b ** n)))} and reports ${b ** n}, forgetting that the log of ${b ** n} is the power ${n}.` });
          pool.push({ text: m(L(String(X - Y))), value: lnb(X - Y, b), why: `This subtracts the numbers inside the logs (${m(`${X} - ${Y} = ${X - Y}`)}). Subtracting logs means **dividing** the numbers.` });
          pool.push({ text: m(`\\log_{${Y}} ${X}`), value: lnb(X, Y), why: `This divides the two logs, ${m(`\\frac{${L(String(X))}}{${L(String(Y))}} = \\log_{${Y}} ${X}`)}. A **difference** of logs is the log of a quotient, not a quotient of logs.` });
          pool.push({ text: m(L(String(X + Y))), value: lnb(X + Y, b), why: `This adds the numbers inside the logs (${m(`${X} + ${Y} = ${X + Y}`)}). Subtracting logs means **dividing** the numbers.` });
        } else if (type === 'power') {
          const k = b === 5 ? 1 : rng.int(1, 2);
          const s = rng.pick([2, 3, 4, 5, 6, 7].filter(coprime));
          const X = s * b ** k;
          const Y = s * s;
          n = 2 * k;
          if (X > 200) continue;
          stemExpr = `2${L(String(X))} - ${L(String(Y))}`;
          steps = [
            `Power law, ${m('k\\log a = \\log a^{k}')}: ${m(`2${L(String(X))} = ${L(`${X}^{2}`)} = ${L(String(X * X))}`)}.`,
            `Quotient law: ${m(`${L(String(X * X))} - ${L(String(Y))} = ${L(`\\frac{${X * X}}{${Y}}`)} = ${L(String(b ** n))}`)}.`,
            `Since ${m(`${b}^{${n}} = ${b ** n}`)}, ${m(`${L(String(b ** n))} = ${n}`)}.`,
          ];
          const dbl = new Frac(2 * X, Y);
          pool.push({ text: m(String(b ** n)), value: b ** n, why: `This stops at ${m(L(String(b ** n)))} and reports ${b ** n}, forgetting that the log of ${b ** n} is the power ${n}.` });
          pool.push({ text: m(L(dbl.tex())), value: lnb(dbl.value(), b), why: `This doubles inside the log (${m(`2 \\times ${X}`)}) instead of squaring: ${m(`2${L('a')} = ${L('a^{2}')}`)}, not ${m(L('2a'))}.` });
          pool.push({ text: m(L(String(X * X - Y))), value: lnb(X * X - Y, b), why: `This squares correctly but then subtracts inside the log (${m(`${X * X} - ${Y} = ${X * X - Y}`)}). Subtracting logs means dividing the numbers.` });
          if (2 * X - Y > 0)
            pool.push({ text: m(L(String(2 * X - Y))), value: lnb(2 * X - Y, b), why: `This doubles instead of squaring and subtracts instead of dividing: ${m(`2 \\times ${X} - ${Y} = ${2 * X - Y}`)}.` });
          const noTwo = new Frac(X, Y);
          pool.push({ text: m(L(noTwo.tex())), value: lnb(noTwo.value(), b), why: `This ignores the coefficient 2 in front of the first log and just divides ${X} by ${Y}. The 2 must first become a power: ${m(`2${L(String(X))} = ${L(`${X}^{2}`)}`)}.` });
        } else {
          const [s, t] = rng.sample([2, 3, 5, 7].filter(coprime), 2);
          const i = rng.int(1, 2);
          const j = b === 5 ? 1 : rng.int(1, 2);
          const X = s * b ** i;
          const Y = t * b ** j;
          const Z = s * t;
          n = i + j;
          stemExpr = `${L(String(X))} + ${L(String(Y))} - ${L(String(Z))}`;
          steps = [
            `Product law, ${m('\\log a + \\log b = \\log(ab)')}: ${m(`${L(String(X))} + ${L(String(Y))} = ${L(String(X * Y))}`)}.`,
            `Quotient law: ${m(`${L(String(X * Y))} - ${L(String(Z))} = ${L(`\\frac{${X * Y}}{${Z}}`)} = ${L(String(b ** n))}`)}.`,
            `Since ${m(`${b}^{${n}} = ${b ** n}`)}, ${m(`${L(String(b ** n))} = ${n}`)}.`,
          ];
          pool.push({ text: m(String(b ** n)), value: b ** n, why: `This stops at ${m(L(String(b ** n)))} and reports ${b ** n}, forgetting that the log of ${b ** n} is the power ${n}.` });
          if (X + Y - Z > 0)
            pool.push({ text: m(L(String(X + Y - Z))), value: lnb(X + Y - Z, b), why: `This adds and subtracts the numbers inside the logs (${m(`${X} + ${Y} - ${Z} = ${X + Y - Z}`)}). Adding logs multiplies the numbers; subtracting logs divides them.` });
          pool.push({ text: m(L(String(X * Y * Z))), value: lnb(X * Y * Z, b), why: `This multiplies all three numbers, ignoring the minus sign. Subtracting a log means **dividing** by its number.` });
          pool.push({ text: m(L(String(X * Y - Z))), value: lnb(X * Y - Z, b), why: `This multiplies ${X} and ${Y} correctly but then subtracts ${Z} instead of dividing by it.` });
        }
        const answer = m(String(n));
        const ds = pickDistractors(answer, n, pool);
        if (ds.length < 3) continue;
        return {
          stem: `Simplify ${m(stemExpr)}.`,
          answer,
          answerValue: n,
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution: steps.join('\n\n') + `\n\nAnswer: ${answer}`,
          keyIdea: 'Combine logs into a single log first (product, quotient and power laws), then ask which power of the base gives the number inside.',
        };
      }
    },
  },
  // ------------------------------------------------------------------ 3. growth / decay model: find the time
  {
    id: 'gen-logs-exponentials-model-time',
    subtopic: 'logs-exponentials',
    difficulty: 'exam',
    title: 'Exponential growth or decay: find the time',
    generate(rng) {
      const contexts = [
        { kind: 'decay', sym: 'C', starts: [100, 200, 400, 500, 800], ks: [0.1, 0.15, 0.2, 0.25, 0.3, 0.4], unit: 'hours', what: (q: string) => `The amount of a medicine in a patient's blood is modelled by ${q} mg, where $t$ is the time in hours after the dose.`, target: (v: number) => `${v} mg`, verb: 'fall to' },
        { kind: 'decay', sym: 'M', starts: [100, 200, 500, 800, 1000], ks: [0.02, 0.03, 0.04, 0.05, 0.08], unit: 'years', what: (q: string) => `The mass of a radioactive sample is modelled by ${q} grams, where $t$ is the time in years.`, target: (v: number) => `${v} grams`, verb: 'fall to' },
        { kind: 'growth', sym: 'N', starts: [200, 500, 1000, 1200], ks: [0.1, 0.2, 0.25, 0.3, 0.4, 0.5], unit: 'hours', what: (q: string) => `The number of bacteria in a culture is modelled by ${q}, where $t$ is the time in hours.`, target: (v: number) => `${v} bacteria`, verb: 'reach' },
        { kind: 'growth', sym: 'V', starts: [1000, 2000, 5000], ks: [0.02, 0.03, 0.04, 0.05, 0.06, 0.08], unit: 'years', what: (q: string) => `The value of an investment is modelled by ${q} dirhams, where $t$ is the time in years.`, target: (v: number) => `AED ${v}`, verb: 'reach' },
      ] as const;
      for (;;) {
        const ctx = rng.pick(contexts);
        const decay = ctx.kind === 'decay';
        const Q0 = rng.pick(ctx.starts);
        const k = rng.pick(ctx.ks);
        const f = decay ? rng.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8]) : rng.pick([1.5, 2, 2.5, 3, 4, 5]);
        const target = Math.round(Q0 * f);
        if (Math.abs(target - Q0 * f) > 1e-9) continue;
        const R = decay ? Q0 / target : target / Q0; // > 1
        const t = Math.log(R) / k;
        if (t < 1 || t > 100) continue;
        const ansS = fixed(t, 1);
        if (Math.abs(t * 10 - Math.floor(t * 10) - 0.5) < 0.002) continue; // avoid borderline rounding
        const answer = m(ansS);
        const answerValue = Number(ansS);
        const kT = num(k);
        const model = `${ctx.sym} = ${Q0}e^{${decay ? '-' : ''}${kT}t}`;
        const o = (v: number) => ({ text: m(fixed(v, 1)), value: Number(fixed(v, 1)) });
        const unit1 = ctx.unit.slice(0, -1); // "hour" / "year"
        const big = Math.max(Q0, target);
        const small = Math.min(Q0, target);
        // correct route: t = ln(R) / k with R = big / small
        const Rtex = new Frac(big, small).tex();
        const pool: Cand[] = [
          { ...o(Math.log10(R) / k), why: `This uses $\\log_{10}$ instead of $\\ln$: ${m(`\\frac{\\log ${Rtex}}{${kT}}`)}. Only the natural log undoes $e$.` },
          { ...o(decay ? (1 - f) / k : (f - 1) / k), why: `This treats the change as linear, as if ${m(ctx.sym)} ${decay ? 'fell' : 'rose'} by the fixed amount ${m(`${kT} \\times ${Q0} = ${num(k * Q0)}`)} every ${unit1}. Exponential change is a fixed **proportion** of the current amount, not a fixed amount.` },
          { ...o(Math.log(R) * k), why: `This multiplies by ${m(kT)} at the end instead of dividing by it.` },
        ];
        if (decay)
          pool.push({
            ...o(-Math.log(1 - f) / k),
            why: `This uses the amount **lost**, ${m(`${Q0} - ${target} = ${Q0 - target}`)}, instead of the amount **left**, ${target}, solving ${m(`e^{-${kT}t} = \\frac{${Q0 - target}}{${Q0}}`)}.`,
          });
        pool.push({
          ...o(Math.log(big - small) / k),
          why: `This subtracts instead of dividing: it takes ${m(`\\ln(${big} - ${small}) = \\ln ${big - small}`)} where the working needs the log of the ratio, ${m(`\\ln \\frac{${big}}{${small}} = \\ln ${Rtex}`)}.`,
        });
        if (!decay)
          pool.push({
            ...o(Math.log(target) / k),
            why: `This forgets to divide by the starting value ${Q0} first, solving ${m(`e^{${kT}t} = ${target}`)}.`,
          });
        else
          pool.push({
            ...o(-t),
            why: `This loses the minus sign: ${m(`-${kT}t = \\ln ${num(f)}`)} and ${m(`\\ln ${num(f)}`)} is negative, so dividing by ${m(`-${kT}`)} gives a **positive** time.`,
          });
        const ds = pickDistractors(answer, answerValue, pool.filter((c) => c.text !== m('0.0') && c.value !== 0));
        if (ds.length < 3) continue;
        const lnf = Math.log(f);
        const steps = [
          `Set ${m(`${ctx.sym} = ${target}`)}: ${m(`${Q0}e^{${decay ? '-' : ''}${kT}t} = ${target}`)}.`,
          `Divide by ${Q0}: ${m(`e^{${decay ? '-' : ''}${kT}t} = \\frac{${target}}{${Q0}} = ${num(f)}`)}.`,
          `Take $\\ln$ of both sides: ${m(`${decay ? '-' : ''}${kT}t = \\ln ${num(f)} = ${num(lnf, 4)}`)}.`,
          `Divide by ${m(decay ? `-${kT}` : kT)}: ${m(`t = \\frac{${num(Math.abs(lnf), 4)}}{${kT}} = ${num(t, 3)}`)}.`,
          `To 1 decimal place, ${m(`t = ${ansS}`)} ${ctx.unit}.`,
        ];
        return {
          stem: `${ctx.what(m(model))} How long does it take for it to ${ctx.verb} ${ctx.target(target)}? Give your answer in ${ctx.unit}, to 1 decimal place.`,
          answer,
          answerValue,
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution: steps.join('\n\n') + `\n\nAnswer: ${answer}`,
          keyIdea: 'Isolate the exponential (divide by the starting amount), take $\\ln$ of both sides, then divide by the rate constant.',
        };
      }
    },
  },
];
