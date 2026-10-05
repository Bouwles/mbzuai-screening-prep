import type { Generator } from '../../../types';
import { Frac, lcm } from '../../../lib/frac';
import { m, num, paren, signed, sum } from '../../../lib/tex';

/** "y - 3", "y + 2", or just "y" when the shift is 0 (no "- 0" in LaTeX). */
const shifted = (v: string, k: number) => (k === 0 ? v : `${v}${signed(-k)}`);

// Gradients p/q used for the "line through a point" generator.
const GRADS: [number, number][] = [
  [2, 1], [-2, 1], [3, 1], [-3, 1], [4, 1], [-4, 1],
  [1, 2], [-1, 2], [1, 3], [-1, 3], [1, 4], [-1, 4],
  [2, 3], [-2, 3], [3, 2], [-3, 2],
];

type Cand<T> = { v: T; text: string; why: string };

/** Keep the first 3 candidates whose value and text differ from the answer and from each other. */
function pickDistractors<T>(answerText: string, same: (a: T) => boolean, pool: Cand<T>[], eq: (a: T, b: T) => boolean): Cand<T>[] {
  const out: Cand<T>[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (same(c.v) || c.text === answerText) continue;
    if (out.some((o) => eq(o.v, c.v) || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

export const generators: Generator[] = [
  // ------------------------------------------------------------------ lines
  {
    id: 'gen-function-families-line-through-point',
    subtopic: 'function-families',
    difficulty: 'exam',
    title: 'y-intercept of a parallel or perpendicular line through a point',
    generate(rng) {
      const [p, q] = rng.pick(GRADS);
      const m0 = new Frac(p, q);
      const rel = rng.pick(['parallel', 'perpendicular'] as const);
      const L = lcm(q, Math.abs(p));
      const x1 = (L >= 4 ? rng.pick([-1, 1]) : rng.pick([-2, -1, 1, 2])) * L;
      const y1 = rng.int(-6, 6);
      let c0 = rng.intNonZero(-8, 8);
      const general = rng.bool(0.4);
      // Parallel case: the point must NOT lie on the given line, otherwise L would be the given line itself.
      if (rel === 'parallel') {
        while (new Frac(y1).sub(m0.mul(x1)).equals(c0)) c0 = rng.intNonZero(-8, 8);
      }

      const mPerp = new Frac(-1).div(m0);
      const mNew = rel === 'parallel' ? m0 : mPerp;
      const cOf = (g: Frac) => new Frac(y1).sub(g.mul(x1));
      const ans = cOf(mNew);

      // The given line, either as y = mx + c or as Ax + By = K.
      let given: string;
      let gradStep: string;
      if (general) {
        // q y = p x + q c0  ->  -p x + q y = q c0, made to have a positive x-coefficient
        let A = -p;
        let B = q;
        let K = q * c0;
        if (A < 0) {
          A = -A;
          B = -B;
          K = -K;
        }
        given = `${sum([
          [A, 'x'],
          [B, 'y'],
        ])} = ${num(K)}`;
        gradStep =
          `Rearrange the given line to make $y$ the subject: ${m(given)} becomes ${m(`y = ${sum([[m0, 'x'], [c0, '']])}`)}, ` +
          `so its gradient is ${m(m0.tex())}.`;
      } else {
        given = `y = ${sum([
          [m0, 'x'],
          [c0, ''],
        ])}`;
        gradStep = `The given line ${m(given)} is in the form $y = mx + c$, so its gradient is ${m(m0.tex())}.`;
      }

      const relStep =
        rel === 'parallel'
          ? `Parallel lines have the **same** gradient, so line $L$ has gradient ${m(mNew.tex())}.`
          : `Perpendicular gradients multiply to $-1$, so the gradient of $L$ is the negative reciprocal: ${m(`-\\frac{1}{${paren(m0)}} = ${mNew.tex()}`)}.`;

      const answer = m(ans.tex());
      const F = (f: Frac, why: string): Cand<Frac> => ({ v: f, text: m(f.tex()), why });
      const pool: Cand<Frac>[] = [];
      if (rel === 'parallel') {
        pool.push(F(cOf(mPerp), `This uses the perpendicular gradient ${m(mPerp.tex())}. Parallel lines have exactly the same gradient, ${m(m0.tex())}.`));
        pool.push(F(cOf(m0.neg()), `This uses gradient ${m(m0.neg().tex())}: the sign of the gradient was changed. Parallel lines have exactly the same gradient, sign included.`));
      } else {
        pool.push(F(cOf(m0), `This uses gradient ${m(m0.tex())}, the same as the given line. That gives a **parallel** line, not a perpendicular one.`));
        pool.push(F(cOf(m0.neg()), `This uses gradient ${m(m0.neg().tex())}: the sign was changed but the gradient was not flipped. The perpendicular gradient is ${m(mPerp.tex())}.`));
        pool.push(F(cOf(new Frac(1).div(m0)), `This uses gradient ${m(new Frac(1).div(m0).tex())}: the gradient was flipped but its sign was not changed. The perpendicular gradient is ${m(mPerp.tex())}.`));
      }
      pool.push(
        F(
          new Frac(y1).add(mNew.mul(x1)),
          `This substitutes the point with the wrong sign, working out ${m(`c = y_1 + m x_1`)} instead of ${m(`c = y_1 - m x_1`)}.`,
        ),
      );
      if (!ans.equals(0)) pool.push(F(ans.neg().div(mNew), `This is where $L$ crosses the $x$-axis (set $y = 0$), not the $y$-axis (set $x = 0$).`));
      pool.push(F(new Frac(c0), `This copies the $y$-intercept of the given line. Line $L$ passes through a different point, so its intercept must be worked out from that point.`));
      pool.push(
        F(
          new Frac(x1).sub(mNew.mul(y1)),
          `This swaps the coordinates of the point, using ${m(`(${y1}, ${x1})`)} instead of ${m(`(${x1}, ${y1})`)}. In ${m(`(x_1, y_1)`)} the $x$-coordinate comes first.`,
        ),
      );
      pool.push(
        F(
          new Frac(y1),
          `This is just the $y$-coordinate of the given point. That point is not on the $y$-axis (its $x$-coordinate is ${m(num(x1))}, not $0$), so its $y$-coordinate is not the $y$-intercept.`,
        ),
      );
      // Last resort only (very rare): a slip in the multiplication m x_1.
      for (let k = 1; pool.length < 14; k++) {
        pool.push(F(ans.add(k), `This comes from an arithmetic slip when expanding ${m(`y - y_1 = m(x - x_1)`)}; recheck the multiplication ${m(`m x_1`)}.`));
      }
      const ds = pickDistractors(answer, (v) => v.equals(ans), pool, (a, b) => a.equals(b));

      const pointForm = `${shifted('y', y1)} = ${mNew.equals(1) ? '' : mNew.equals(-1) ? '-' : mNew.tex()}\\left(${shifted('x', x1)}\\right)`;
      const solution =
        `1. ${gradStep}\n` +
        `2. ${relStep}\n` +
        `3. Use the point-gradient form ${m('y - y_1 = m(x - x_1)')} with the point ${m(`(${x1}, ${y1})`)}:\n\n` +
        `$$${pointForm}$$\n\n` +
        `4. The $y$-intercept is the value of $y$ when $x = 0$:\n\n` +
        `$$y = ${num(y1)} - ${paren(mNew)} \\times ${paren(x1)} = ${num(y1)} - ${paren(mNew.mul(x1))} = ${ans.tex()}$$\n\n` +
        `So line $L$ is ${m(`y = ${sum([[mNew, 'x'], [ans, '']])}`)}.\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `Line $L$ passes through the point ${m(`(${x1}, ${y1})`)} and is **${rel}** to the line ${m(given)}. At what value of $y$ does $L$ cross the $y$-axis?`,
        answer,
        answerValue: ans.value(),
        distractors: ds.map((d) => ({ text: d.text, value: d.v.value(), why: d.why })),
        solution,
        keyIdea:
          rel === 'parallel'
            ? 'Parallel lines share the same gradient; then use $y - y_1 = m(x - x_1)$ and set $x = 0$.'
            : 'Perpendicular gradients are negative reciprocals (product $-1$); then use $y - y_1 = m(x - x_1)$ and set $x = 0$.',
      };
    },
  },

  // ------------------------------------------------------------------ quadratics
  {
    id: 'gen-function-families-quadratic-vertex',
    subtopic: 'function-families',
    difficulty: 'exam',
    title: 'Vertex of a quadratic in the form ax^2 + bx + c',
    generate(rng) {
      const a = rng.pick([1, 2, 3, -1, -2, -3]);
      const h = rng.intNonZero(-5, 5);
      const k = rng.int(-9, 9);
      const b = -2 * a * h;
      const c = a * h * h + k;
      const f = (x: number) => a * x * x + b * x + c;
      const P = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
      const answer = m(P(h, k));
      const key = (x: number, y: number) => `${x},${y}`;

      const pool: Cand<string>[] = [
        { v: key(-h, f(-h)), text: m(P(-h, f(-h))), why: `This loses the minus sign in ${m('x = -\\frac{b}{2a}')}, using ${m(`x = ${-h}`)}, and then substitutes that value.` },
        { v: key(2 * h, f(2 * h)), text: m(P(2 * h, f(2 * h))), why: `This forgets the 2 in the denominator, using ${m(`x = -\\frac{b}{a} = ${2 * h}`)} instead of ${m('-\\frac{b}{2a}')}.` },
      ];
      if (h < 0) {
        const wrongY = a * -(h * h) + b * h + c;
        pool.push({
          v: key(h, wrongY),
          text: m(P(h, wrongY)),
          why: `The $x$-coordinate is right, but ${m(`\\left(${h}\\right)^{2}`)} was worked out as ${m(`${-(h * h)}`)} (typing it into a calculator without brackets). Squaring a negative number gives a positive result.`,
        });
      } else {
        const wrongY = a * h * h - b * h + c;
        pool.push({
          v: key(h, wrongY),
          text: m(P(h, wrongY)),
          why: `The $x$-coordinate is right, but the sign of the ${m('bx')} term was lost when substituting ${m(`x = ${h}`)}.`,
        });
      }
      pool.push({ v: key(h, c), text: m(P(h, c)), why: `The $x$-coordinate is right, but this uses the constant term ${m(`c = ${c}`)} (the $y$-intercept) as the $y$-coordinate instead of substituting ${m(`x = ${h}`)}.` });
      pool.push({ v: key(-h, k), text: m(P(-h, k)), why: `This has the right $y$-coordinate but the wrong sign for $x$: the vertex form is ${m(`a(x - h)^2 + k`)}, and the bracket ${m(`(${shifted('x', h)})`)} means ${m(`x = ${h}`)}.` });
      pool.push({ v: key(k, h), text: m(P(k, h)), why: 'This swaps the $x$- and $y$-coordinates of the vertex.' });
      for (let d = 1; pool.length < 12; d++) {
        pool.push({ v: key(h, k + d), text: m(P(h, k + d)), why: `The $x$-coordinate is right, but there is an arithmetic slip when substituting ${m(`x = ${h}`)} to find $y$.` });
      }
      const ds = pickDistractors(answer, (v) => v === key(h, k), pool, (x, y) => x === y);

      const aPart = a === 1 ? '' : a === -1 ? '-' : String(a);
      const subst =
        `y = ${aPart}\\left(${h}\\right)^{2}${signed(b)}\\left(${h}\\right)${c === 0 ? '' : signed(c)}` +
        ` = ${num(a * h * h)}${signed(b * h)}${c === 0 ? '' : signed(c)} = ${num(k)}`;
      const solution =
        `Here $a = ${a}$, $b = ${b}$${c === 0 ? '' : `, $c = ${c}$`}.\n\n` +
        `1. The vertex lies on the axis of symmetry: ${m(`x = -\\frac{b}{2a} = -\\frac{${b}}{2 \\times ${paren(a)}} = ${h}`)}.\n` +
        `2. Substitute ${m(`x = ${h}`)} (in brackets) to find $y$:\n\n` +
        `$$${subst}$$\n\n` +
        `Since ${m(`a = ${a}`)} is ${a > 0 ? 'positive, the parabola opens upwards and the vertex is a **minimum** point' : 'negative, the parabola opens downwards and the vertex is a **maximum** point'}.\n\n` +
        `Check by completing the square: ${m(`y = ${aPart}\\left(${shifted('x', h)}\\right)^{2}${k === 0 ? '' : signed(k)}`)}.\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `What are the coordinates of the vertex (turning point) of ${m(`y = ${sum([[a, 'x^{2}'], [b, 'x'], [c, '']])}`)}?`,
        answer,
        answerValue: key(h, k),
        distractors: ds.map((d) => ({ text: d.text, value: d.v, why: d.why })),
        solution,
        keyIdea: 'The vertex of $y = ax^2 + bx + c$ has $x = -\\frac{b}{2a}$; substitute that $x$ (in brackets) to get $y$.',
      };
    },
  },

  // ------------------------------------------------------------------ exponentials
  {
    id: 'gen-function-families-exp-growth-decay',
    subtopic: 'function-families',
    difficulty: 'exam',
    title: 'Percentage growth or decay over several periods',
    generate(rng) {
      type Ctx = { kind: 'growth' | 'decay'; amounts: number[]; rates: number[]; money: boolean; unit: string; stem: (P: string, r: number, n: number) => string; period: string };
      const ctxs: Ctx[] = [
        {
          kind: 'growth',
          amounts: [1000, 2000, 4000, 5000, 8000, 10000, 20000],
          rates: [4, 5, 8, 10, 20],
          money: true,
          unit: 'AED',
          period: 'year',
          stem: (P, r, n) => `An investment of ${P} earns ${r}% interest per year, compounded annually (each year's interest is added to the balance). What is the investment worth after ${n} years?`,
        },
        {
          kind: 'decay',
          amounts: [20000, 40000, 50000, 60000, 80000, 100000],
          rates: [10, 15, 20, 25, 30],
          money: true,
          unit: 'AED',
          period: 'year',
          stem: (P, r, n) => `A car is bought for ${P}. Its value falls by ${r}% each year (each year it is worth ${r}% less than the year before). What is the car worth after ${n} years?`,
        },
        {
          kind: 'decay',
          amounts: [100, 200, 400, 500, 800, 1000],
          rates: [10, 20, 25, 30, 40, 50],
          money: false,
          unit: 'mg',
          period: 'hour',
          stem: (P, r, n) => `A patient is given ${P} of a medicine. The amount in the body falls by ${r}% every hour. How much of the medicine is left after ${n} hours?`,
        },
        {
          kind: 'growth',
          amounts: [100, 200, 400, 500, 1000, 2000],
          rates: [10, 20, 25, 50],
          money: false,
          unit: 'cells',
          period: 'hour',
          stem: (P, r, n) => `A culture starts with ${P}. The number of cells increases by ${r}% every hour. How many cells are there after ${n} hours?`,
        },
      ];
      const ctx = rng.pick(ctxs);
      const show = (v: Frac | number) => {
        const x = typeof v === 'number' ? v : v.value();
        const s = ctx.money && !Number.isInteger(Math.round(x * 100) / 100) ? (Math.round(x * 100) / 100).toFixed(2) : num(x, 2);
        return ctx.money ? `AED ${s}` : `${s} ${ctx.unit}`;
      };
      const pow = (f: Frac, n: number) => {
        let out = new Frac(1);
        for (let i = 0; i < n; i++) out = out.mul(f);
        return out;
      };

      // Re-roll until the exact answer is "nice" (whole cells; at most 2 decimal places otherwise).
      let P = 0;
      let r = 0;
      let n = 0;
      let ans = new Frac(0);
      for (let tries = 0; ; tries++) {
        P = rng.pick(ctx.amounts);
        r = rng.pick(ctx.rates);
        n = rng.int(2, 4);
        const mult = new Frac(ctx.kind === 'growth' ? 100 + r : 100 - r, 100);
        ans = pow(mult, n).mul(P);
        const nice = ctx.unit === 'cells' ? ans.isInt() : ans.mul(100).isInt();
        if (nice || tries > 50) {
          if (!nice) {
            P = ctx.amounts[ctx.amounts.length - 1];
            r = 10;
            n = 2;
            ans = pow(new Frac(ctx.kind === 'growth' ? 110 : 90, 100), 2).mul(P);
          }
          break;
        }
      }
      const up = ctx.kind === 'growth';
      const mult = new Frac(up ? 100 + r : 100 - r, 100);
      const wrongDir = new Frac(up ? 100 - r : 100 + r, 100);
      const rate = new Frac(r, 100);
      const answer = show(ans);

      const N = (f: Frac, why: string): Cand<number> => ({ v: Math.round(f.value() * 100) / 100, text: show(f), why });
      const rawPool: Cand<number>[] = [
        N(
          new Frac(P).mul(new Frac(up ? 100 + r * n : 100 - r * n, 100)),
          `This ${up ? 'adds' : 'takes off'} ${r}% of the **original** amount every ${ctx.period} (${n} lots of ${r}% = ${r * n}%), which is linear change. Here the ${r}% is applied to the current value each time, so the multiplier ${m(num(mult.value()))} is used ${n} times.`,
        ),
        N(new Frac(P).mul(pow(wrongDir, n)), `This uses the multiplier ${m(num(wrongDir.value()))}, which ${up ? 'decreases' : 'increases'} the amount. A ${r}% ${up ? 'increase' : 'decrease'} means multiplying by ${m(num(mult.value()))}.`),
        N(new Frac(P).mul(pow(mult, n - 1)), `This applies the multiplier only ${n - 1 === 1 ? 'once' : `${n - 1} times`}. After ${n} ${ctx.period}s the multiplier is used ${n} times: ${m(`${num(mult.value())}^{${n}}`)}.`),
        N(new Frac(P).mul(pow(rate, n)), `This multiplies by ${m(num(rate.value()))} each ${ctx.period}, which is the ${up ? 'amount gained' : 'amount lost'}, not the multiplier. The multiplier is ${m(`1 ${up ? '+' : '-'} ${num(rate.value())} = ${num(mult.value())}`)}.`),
        N(new Frac(P).mul(pow(mult, n + 1)), `This applies the multiplier ${n + 1} times instead of ${n}.`),
        N(new Frac(P).mul(mult).mul(n), `This multiplies by ${m(`${num(mult.value())} \\times ${n}`)} instead of raising the multiplier to the power ${n}: ${m(`${num(mult.value())}^{${n}}`)} means multiplying by ${m(num(mult.value()))} ${n} times over.`),
      ];
      // drop impossible values (negative amounts, fractions of a cell)
      const pool = rawPool.filter((c) => c.v > 0 && (ctx.unit !== 'cells' || Number.isInteger(c.v)));
      const ds = pickDistractors(answer, (v) => Math.abs(v - ans.value()) < 1e-9, pool, (x, y) => Math.abs(x - y) < 1e-9);

      const multN = num(mult.value());
      const powVal = num(pow(mult, n).value(), 8);
      const steps: string[] = [];
      let cur = new Frac(P);
      for (let i = 1; i <= n; i++) {
        const next = cur.mul(mult);
        steps.push(`- After ${ctx.period} ${i}: ${m(`${num(cur.value(), 6)} \\times ${multN} = ${num(next.value(), 6)}`)}`);
        cur = next;
      }
      const solution =
        `A ${r}% ${up ? 'increase' : 'decrease'} means the amount is multiplied by ${m(`1 ${up ? '+' : '-'} ${num(rate.value())} = ${multN}`)} every ${ctx.period}. ` +
        `This is exponential ${up ? 'growth' : 'decay'}:\n\n` +
        `$$A = ${P} \\times ${multN}^{t}$$\n\n` +
        `Step by step:\n\n${steps.join('\n')}\n\n` +
        `Or in one go: ${m(`${P} \\times ${multN}^{${n}} = ${P} \\times ${powVal} = ${num(ans.value(), 4)}`)}.\n\n` +
        `Answer: ${answer}`;

      return {
        stem: ctx.stem(show(P), r, n),
        answer,
        answerValue: Math.round(ans.value() * 100) / 100,
        distractors: ds.map((d) => ({ text: d.text, value: d.v, why: d.why })),
        solution,
        keyIdea: `A change of $r$% per period multiplies the amount by $\\left(1 \\pm \\frac{r}{100}\\right)$ each period, so after $n$ periods $A = A_0\\left(1 \\pm \\frac{r}{100}\\right)^n$.`,
      };
    },
  },
];
