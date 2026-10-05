import type { Generator } from '../../../types';
import { Frac, gcd } from '../../../lib/frac';
import { m, num, paren, signed, sum, poly, term } from '../../../lib/tex';

type Cand = { text: string; value: number | string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistractors(answerText: string, answerValue: number | string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (String(c.value) === String(answerValue) || c.text === answerText) continue;
    if (out.some((o) => String(o.value) === String(c.value) || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

const scaleText = (k: number, which: string) =>
  k === 1 ? `leave the ${which} equation as it is` : `multiply the ${which} equation by ${m(num(k))}`;

/** Coefficient times a substituted value inside a sum, e.g. 3 times (-2), written with brackets for negatives. */
const prod = (c: number, val: number, first: boolean) => {
  const sign = first ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + ';
  const body = Math.abs(c) === 1 ? paren(val) : `${num(Math.abs(c))}\\times${paren(val)}`;
  return sign + body;
};

const lin = (a: number, b: number) => sum([
  [a, 'x'],
  [b, 'y'],
]);

export const generators: Generator[] = [
  // ------------------------------------------------------------------ 2x2 linear by elimination
  {
    id: 'gen-simultaneous-equations-linear-2x2',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    title: 'Solve two linear equations by elimination',
    generate(rng) {
      for (;;) {
        const x0 = rng.intNonZero(-6, 6);
        const y0 = rng.intNonZero(-6, 6);
        if (Math.abs(x0) === Math.abs(y0)) continue;
        const a = rng.intNonZero(-5, 5);
        const b = rng.intNonZero(-5, 5);
        const d = rng.intNonZero(-5, 5);
        const e = rng.intNonZero(-5, 5);
        const det = a * e - b * d;
        if (det === 0 || Math.abs(det) === 1) continue;
        const c = a * x0 + b * y0;
        const f = d * x0 + e * y0;
        // keep equations in lowest terms so they look natural (no 5x + 5y = -20)
        if (gcd(gcd(a, b), c) > 1 || gcd(gcd(d, e), f) > 1) continue;
        const askX = rng.bool();
        const ans = askX ? x0 : y0;
        const other = askX ? y0 : x0;
        const v = askX ? 'x' : 'y';
        const w = askX ? 'y' : 'x';

        // Eliminate the variable we are NOT asked for, using the smallest multipliers (lcm idea).
        // To find x: scale eq1 by e/g and eq2 by b/g (g = gcd(b, e)) so the y terms match.
        // To find y: scale eq1 by d/g and eq2 by a/g (g = gcd(a, d)) so the x terms match.
        const g = askX ? gcd(b, e) : gcd(a, d);
        let k1 = (askX ? e : d) / g;
        let k2 = (askX ? b : a) / g;
        if (k1 < 0) {
          k1 = -k1;
          k2 = -k2;
        }
        // k1*eq1 - k2*eq2 removes the other unknown. If k2 < 0 we scale eq2 by |k2| and ADD instead.
        const coef = askX ? a * k1 - d * k2 : b * k1 - e * k2;
        const rhs = c * k1 - f * k2;
        if (Math.abs(coef) < 2) continue; // keep the "forgot to divide" distractor meaningful
        const k2a = Math.abs(k2);
        const adding = k2 < 0;
        const lhsTex = `${term(coef, v, true)} = ${num(rhs)}`;

        const pool: Cand[] = [
          { text: m(num(other)), value: other, why: `${m(num(other))} is the value of ${m(w)}, not ${m(v)}. Read which unknown the question asks for.` },
          {
            text: m(num(-ans)),
            value: -ans,
            why:
              coef < 0
                ? `Sign slip when dividing: ${m(lhsTex)} gives ${m(`${v} = ${num(rhs)} \\div ${paren(coef)} = ${num(ans)}`)}. Dividing by a negative number changes the sign.`
                : `This has the wrong sign. Combining the equations correctly gives ${m(lhsTex)}, so ${m(`${v} = ${num(rhs)} \\div ${num(coef)} = ${num(ans)}`)}. A sign slip when adding or subtracting the equations (or when dividing) flips the answer; substitute back to check.`,
          },
          { text: m(num(rhs)), value: rhs, why: `This stops at ${m(lhsTex)} and forgets to divide by ${m(num(coef))}.` },
        ];
        pool.push({ text: m(num(x0 + y0)), value: x0 + y0, why: `${m(num(x0 + y0))} is ${m('x + y')}, not ${m(v)} on its own.` });
        const answerText = m(num(ans));
        const ds = pickDistractors(answerText, ans, pool);
        if (ds.length < 3) continue;

        const eq1 = `${lin(a, b)} = ${num(c)}`;
        const eq2 = `${lin(d, e)} = ${num(f)}`;
        const s1 = lin(a * k1, b * k1);
        const r1 = c * k1;
        const s2 = lin(d * k2a, e * k2a);
        const r2 = f * k2a;
        const scaleIntro =
          k1 === 1 && k2a === 1
            ? `The ${m(w)} terms already have the same size in both equations, so no scaling is needed:`
            : `Make the ${m(w)} terms the same size: ${scaleText(k1, 'first')} and ${scaleText(k2a, 'second')} (every term, including the constant).`;
        const combineText = adding
          ? `The ${m(w)} terms now have opposite signs, so **add** the two equations:`
          : `The ${m(w)} terms are now identical, so **subtract** the second equation from the first:`;
        // "so 3y = 6 and y = 2"; when the coefficient is 1 just "so y = 2" (no repeated statement).
        const finish = (cf: number, name: string, rhsVal: number, val: number) =>
          cf === 1 ? `so ${m(`${name} = ${num(val)}`)}` : `so ${m(`${term(cf, name, true)} = ${num(rhsVal)}`)} and ${m(`${name} = ${num(val)}`)}`;
        const backStep = askX
          ? `Substitute ${m(`x = ${num(x0)}`)} into the first equation: ${m(`${prod(a, x0, true)}${term(b, 'y', false)} = ${num(c)}`)}, ${finish(b, 'y', c - a * x0, y0)}.`
          : `Substitute ${m(`y = ${num(y0)}`)} into the first equation: ${m(`${term(a, 'x', true)}${prod(b, y0, false)} = ${num(c)}`)}, ${finish(a, 'x', c - b * y0, x0)}.`;
        const solution =
          scaleIntro +
          `\n\n$$${s1} = ${num(r1)}$$\n\n$$${s2} = ${num(r2)}$$\n\n` +
          combineText +
          `\n\n$$${lhsTex}$$\n\n` +
          `Divide by ${m(num(coef))}: ${m(`${v} = ${num(ans)}`)}.\n\n` +
          `${backStep}\n\n` +
          `Check in the second equation: ${m(`${prod(d, x0, true)}${prod(e, y0, false)} = ${num(f)}`)}.\n\n` +
          `Answer: ${answerText}`;
        return {
          stem: `Solve the simultaneous equations\n\n$$${eq1}$$\n\n$$${eq2}$$\n\nWhat is the value of ${m(v)}?`,
          answer: answerText,
          answerValue: ans,
          distractors: ds,
          solution,
          keyIdea: 'Scale the equations so one unknown has the same size of coefficient in both, add (opposite signs) or subtract (same signs) to eliminate it, then back-substitute and check.',
        };
      }
    },
  },

  // ------------------------------------------------------------------ line meets parabola
  {
    id: 'gen-simultaneous-equations-line-parabola',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    title: 'Where a line meets a parabola',
    generate(rng) {
      for (;;) {
        const r1 = rng.intNonZero(-5, 5);
        const r2 = rng.intNonZero(-5, 5);
        if (r1 === r2 || r1 === -r2) continue;
        const mm = rng.intNonZero(-4, 4);
        const c = rng.int(-6, 6);
        // curve: y = x^2 + p x + q with x^2 + (p - mm)x + (q - c) = (x - r1)(x - r2)
        const p = mm - (r1 + r2);
        const q = c + r1 * r2;
        const lo = Math.min(r1, r2);
        const hi = Math.max(r1, r2);
        const yOf = (x: number) => mm * x + c;
        const pts = (xs: [number, number][]) => {
          const s = [...xs].sort((u, w) => u[0] - w[0]);
          return {
            text: `${m(`(${num(s[0][0])}, ${num(s[0][1])})`)} and ${m(`(${num(s[1][0])}, ${num(s[1][1])})`)}`,
            value: s.map((t) => `${t[0]},${t[1]}`).join(';'),
          };
        };
        const ans = pts([
          [lo, yOf(lo)],
          [hi, yOf(hi)],
        ]);
        const signFlip = pts([
          [-lo, yOf(-lo)],
          [-hi, yOf(-hi)],
        ]);
        const onAxis = pts([
          [lo, 0],
          [hi, 0],
        ]);
        const swapped = pts([
          [lo, yOf(hi)],
          [hi, yOf(lo)],
        ]);
        const pool: Cand[] = [
          { ...signFlip, why: `Sign error reading the roots: ${m(`(x${signed(-lo)})(x${signed(-hi)}) = 0`)} gives ${m(`x = ${num(lo)}`)} or ${m(`x = ${num(hi)}`)}, not the opposite signs.` },
          { ...onAxis, why: 'These use the correct $x$ values but take $y = 0$. Those are roots of the combined quadratic, not the meeting points; substitute each $x$ back into the line to get $y$.' },
        ];
        if (c !== 0) {
          const noC = pts([
            [lo, mm * lo],
            [hi, mm * hi],
          ]);
          pool.push({ ...noC, why: `This forgets the constant ${m(num(c))} in the line when finding $y$: use ${m(`y = ${sum([[mm, 'x'], [c, '']])}`)}.` });
        }
        pool.push({ ...swapped, why: 'The $y$ values are paired with the wrong $x$ values. Each $y$ must be worked out from its own $x$ by substituting that $x$ into the line.' });
        const ds = pickDistractors(ans.text, ans.value, pool);
        if (ds.length < 3) continue;

        const curve = poly([1, p, q]);
        const line = sum([
          [mm, 'x'],
          [c, ''],
        ]);
        const combined = poly([1, p - mm, q - c]);
        // "y = 4\times(-5) + 6 = -14"; skip the middle step when it would only repeat the value (y = -x at x = 2).
        const yWork = (x: number) => {
          const mid = `${prod(mm, x, true)}${c === 0 ? '' : signed(c)}`;
          return mid === num(yOf(x)) ? `y = ${num(yOf(x))}` : `y = ${mid} = ${num(yOf(x))}`;
        };
        const solution =
          `At a meeting point the two ${m('y')} values are equal:\n\n$$${curve} = ${line}$$\n\n` +
          `Bring every term to the left-hand side:\n\n$$${combined} = 0$$\n\n` +
          `Factorise (two numbers that multiply to ${m(num(q - c))} and add to ${m(num(p - mm))}):\n\n` +
          `$$(x${signed(-lo)})(x${signed(-hi)}) = 0$$\n\n` +
          `So ${m(`x = ${num(lo)}`)} or ${m(`x = ${num(hi)}`)}.\n\n` +
          `Find each ${m('y')} from the line ${m(`y = ${line}`)}:\n\n` +
          `- ${m(`x = ${num(lo)}`)}: ${m(yWork(lo))}\n` +
          `- ${m(`x = ${num(hi)}`)}: ${m(yWork(hi))}\n\n` +
          `Answer: ${ans.text}`;
        return {
          stem: `Find the points where the line ${m(`y = ${line}`)} meets the curve ${m(`y = ${curve}`)}.`,
          answer: ans.text,
          answerValue: ans.value,
          distractors: ds,
          solution,
          keyIdea: 'Substitute the line into the curve to get a quadratic, solve it, then find each $y$ from the line.',
        };
      }
    },
  },

  // ------------------------------------------------------------------ value of k for no solution
  {
    id: 'gen-simultaneous-equations-no-solution-k',
    subtopic: 'simultaneous-equations',
    difficulty: 'exam',
    title: 'Find k so that a linear system has no solution',
    generate(rng) {
      for (;;) {
        const a = rng.intNonZero(-6, 6);
        const d = rng.int(2, 6);
        const e = rng.int(2, 8);
        if (Math.abs(a) === Math.abs(d)) continue;
        if ((a * e) % d !== 0) continue;
        const k = (a * e) / d;
        if (k === 0 || Math.abs(k) > 24) continue;
        const c = rng.int(1, 12);
        const f = rng.int(1, 12);
        if (c * d === a * f) continue; // would be infinitely many, not none
        if (gcd(gcd(d, e), f) > 1) continue; // second equation in lowest terms (no "3x + 3y = 3")
        const kF = new Frac(k);
        const inverted = new Frac(d * e, a); // a/d = e/k
        const pool: { f: Frac; why: string }[] = [
          { f: kF.neg(), why: `Sign error: the determinant condition ${m(`${num(a)}\\times${paren(e)}${term(-d, 'k', false)} = 0`)} gives ${m(`${term(d, 'k', true)} = ${num(a * e)}`)}, so ${m(`k = ${num(k)}`)}, not its negative.` },
          { f: inverted, why: `This sets up the ratio upside down: ${m(`\\frac{${num(a)}}{${num(d)}} = \\frac{${num(e)}}{k}`)}. Compare ${m('x')}-coefficients with ${m('x')}-coefficients and ${m('y')} with ${m('y')}, in the same order.` },
          { f: new Frac(e), why: `This just copies the ${m('y')}-coefficient of the second equation, but the ${m('x')}-coefficients ${m(num(a))} and ${m(num(d))} are different, so the ${m('y')}-coefficients must be in the same ratio.` },
        ];
        const ds: { f: Frac; why: string }[] = [];
        for (const pc of pool) {
          if (ds.length === 3) break;
          if (pc.f.equals(kF) || ds.some((o) => o.f.equals(pc.f))) continue;
          ds.push(pc);
        }
        if (ds.length < 3) continue;
        const scale = new Frac(d, a);
        const answer = m(`k = ${num(k)}`);
        const solution =
          `Two linear equations have no unique solution when the ${m('x')} and ${m('y')} coefficients are in the same ratio (the lines are parallel):\n\n` +
          `$$\\frac{${num(a)}}{${num(d)}} = \\frac{k}{${num(e)}}$$\n\n` +
          `Equivalently the determinant is zero: ${m(`${num(a)}\\times${paren(e)}${term(-d, 'k', false)} = 0`)}, so ${m(`${term(d, 'k', true)} = ${num(a * e)}`)} and ${m(`k = ${num(k)}`)}.\n\n` +
          `Check the constants: multiplying the first equation by ${m(scale.tex())} gives ${m(`${lin(d, e)} = ${new Frac(c).mul(scale).tex()}`)}, but the second equation says ${m(`${lin(d, e)} = ${num(f)}`)}. ` +
          `These contradict each other, so there is no solution (not infinitely many).\n\n` +
          `Answer: ${answer}`;
        return {
          stem: `For which value of ${m('k')} does the system\n\n$$${sum([[a, 'x'], [1, 'ky']])} = ${num(c)}$$\n\n$$${lin(d, e)} = ${num(f)}$$\n\nhave **no solution**?`,
          answer,
          answerValue: k,
          distractors: ds.map((x) => ({ text: m(`k = ${x.f.tex()}`), value: x.f.value(), why: x.why })),
          solution,
          keyIdea: 'No solution means parallel lines: the coefficients are proportional (determinant zero) but the constants are not in the same ratio.',
        };
      }
    },
  },
];
