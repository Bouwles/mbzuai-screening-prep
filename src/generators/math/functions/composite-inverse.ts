import type { Generator } from '../../../types';
import { steps } from '../../../lib/explanation';
import { Frac, gcd } from '../../../lib/frac';
import { m, num, paren, signed, sum, term } from '../../../lib/tex';

/** A rational function (p x + q) / (r x + s) with integer coefficients. */
type Rat = [number, number, number, number];

/** Same function? (px+q)(r'x+s') must equal (p'x+q')(rx+s) identically. */
function sameRat(u: Rat, v: Rat): boolean {
  const [p, q, r, s] = u;
  const [P, Q, R, S] = v;
  return p * R === P * r && p * S + q * R === P * s + Q * r && q * S === Q * s;
}

/** Make the x-coefficient of the denominator positive (multiply top and bottom by -1 if needed). */
function normRat(u: Rat): Rat {
  const [p, q, r, s] = u;
  return r < 0 || (r === 0 && s < 0) ? [-p, -q, -r, -s] : [p, q, r, s];
}

const ratTex = (u: Rat) => `\\frac{${sum([[u[0], 'x'], [u[1], '']])}}{${sum([[u[2], 'x'], [u[3], '']])}}`;

export const generators: Generator[] = [
  {
    id: 'gen-composite-inverse-evaluate',
    subtopic: 'composite-inverse',
    difficulty: 'foundation',
    title: 'Evaluate a composite function at a number',
    generate(rng) {
      let a = 0;
      let b = 0;
      let c = 0;
      let k = 0;
      // re-roll until the two orders of composition give different answers (otherwise order would not matter)
      for (;;) {
        a = rng.pick([2, 3, 4, 5, -2, -3]);
        b = rng.intNonZero(-7, 7);
        c = rng.intNonZero(-6, 6);
        k = rng.int(-3, 4);
        const fk0 = a * k + b;
        const gk0 = k * k + c;
        if (fk0 !== gk0 && a * gk0 + b !== fk0 * fk0 + c) break;
      }
      const order = rng.pick(['fg', 'gf'] as const);
      const useCirc = rng.bool();

      const f = (x: number) => a * x + b;
      const g = (x: number) => x * x + c;
      const fk = f(k);
      const gk = g(k);
      const fg = f(gk);
      const gf = g(fk);

      const fTex = sum([[a, 'x'], [b, '']]);
      const gTex = sum([[1, 'x^{2}'], [c, '']]);
      const label = (o: 'fg' | 'gf') =>
        useCirc ? (o === 'fg' ? `(f \\circ g)(${k})` : `(g \\circ f)(${k})`) : o === 'fg' ? `f(g(${k}))` : `g(f(${k}))`;

      // worked lines
      const gLine = `g(${k}) = ${paren(k)}^{2}${signed(c)} = ${num(k * k)}${signed(c)} = ${num(gk)}`;
      const fLine = `f(${k}) = ${num(a)} \\times ${paren(k)}${signed(b)} = ${num(fk)}`;

      const answer = order === 'fg' ? fg : gf;
      const pool: { v: number; why: string }[] = [];
      if (order === 'fg') {
        pool.push(
          { v: gf, why: `This is ${m(label('gf'))}, the composition in the wrong order: ${m(fLine)}, then ${m(`g(${fk}) = ${num(gf)}`)}. In ${m(label('fg'))} the inner function $g$ acts first.` },
          { v: fk * gk, why: `This multiplies the two outputs: ${m(`f(${k}) \\times g(${k}) = ${num(fk)} \\times ${paren(gk)} = ${num(fk * gk)}`)}. A composite feeds one output into the other function.` },
          { v: a * k * k + c + b, why: `This forgets to multiply the whole of $g(x)$ by ${m(num(a))}: it uses ${m(`${num(a)}x^{2}${signed(c)}${signed(b)}`)} instead of ${m(`${num(a)}(x^{2}${signed(c)})${signed(b)}`)}, so at ${m(`x = ${k}`)} it gets ${m(`${num(a)} \\times ${paren(k * k)}${signed(c)}${signed(b)} = ${num(a * k * k + c + b)}`)}.` },
          { v: fk + gk, why: `This adds the two outputs: ${m(`f(${k}) = ${num(fk)}`)} and ${m(`g(${k}) = ${num(gk)}`)} sum to ${m(num(fk + gk))}. Composition is not addition.` },
          { v: f(fk), why: `This applies $f$ twice, ${m(`f(f(${k}))`)}, instead of applying $g$ first.` },
          { v: g(gk), why: `This applies $g$ twice, ${m(`g(g(${k}))`)}, and never uses $f$.` },
          { v: gk, why: `This stops halfway: ${m(`g(${k}) = ${num(gk)}`)} is only the inner step, and it still has to go into $f$.` },
        );
      } else {
        pool.push(
          { v: fg, why: `This is ${m(label('fg'))}, the composition in the wrong order: ${m(gLine)}, then ${m(`f(${gk}) = ${num(fg)}`)}. In ${m(label('gf'))} the inner function $f$ acts first.` },
          { v: fk * gk, why: `This multiplies the two outputs: ${m(`f(${k}) \\times g(${k}) = ${paren(fk)} \\times ${paren(gk)} = ${num(fk * gk)}`)}. A composite feeds one output into the other function.` },
          { v: a * a * k * k + b * b + c, why: `This squares ${m(`${num(a)}x${signed(b)}`)} term by term, as ${m(`(${num(a)}x)^{2} + ${paren(b)}^{2}`)}, forgetting the middle term of the bracket squared.` },
          { v: fk * fk, why: `This squares ${m(`f(${k}) = ${num(fk)}`)} but then forgets the constant ${m(num(c))} at the end of $g$.` },
          { v: fk + gk, why: `This adds the two outputs: ${m(`f(${k}) = ${num(fk)}`)} and ${m(`g(${k}) = ${num(gk)}`)} sum to ${m(num(fk + gk))}. Composition is not addition.` },
          { v: g(gk), why: `This applies $g$ twice, ${m(`g(g(${k}))`)}, and never uses $f$.` },
          { v: fk, why: `This stops halfway: ${m(`f(${k}) = ${num(fk)}`)} is only the inner step, and it still has to go into $g$.` },
        );
      }
      const distractors: { text: string; value: number; why: string }[] = [];
      for (const d of pool) {
        if (distractors.length === 3) break;
        if (d.v === answer || distractors.some((x) => x.value === d.v)) continue;
        distractors.push({ text: m(num(d.v)), value: d.v, why: d.why });
      }
      // fallbacks: sign slips with the constants (always different from the answer when they differ in value)
      const fallbacks: [number, string][] =
        order === 'fg'
          ? [
              [a * gk - b, `This uses the wrong sign for the constant of $f$: ${m(`${num(a)} \\times ${paren(gk)}${signed(-b)} = ${num(a * gk - b)}`)}.`],
              [f(k * k - c), `This uses the wrong sign for the constant of $g$, taking ${m(`g(${k}) = ${num(k * k - c)}`)}.`],
            ]
          : [
              [fk * fk - c, `This uses the wrong sign for the constant of $g$: ${m(`${paren(fk)}^{2}${signed(-c)} = ${num(fk * fk - c)}`)}.`],
              [g(a * k - b), `This uses the wrong sign for the constant of $f$, taking ${m(`f(${k}) = ${num(a * k - b)}`)}.`],
            ];
      for (const [v, why] of fallbacks) {
        if (distractors.length === 3) break;
        if (v === answer || distractors.some((x) => x.value === v)) continue;
        distractors.push({ text: m(num(v)), value: v, why });
      }
      if (distractors.length < 3) throw new Error('not enough distinct distractors');

      const ans = m(num(answer));
      const inner = order === 'fg' ? 'g' : 'f';
      const outer = order === 'fg' ? 'f' : 'g';
      const mid = order === 'fg' ? gk : fk;
      const fRule = `$f$ multiplies its input by ${m(num(a))}, then ${b > 0 ? 'adds' : 'subtracts'} ${m(num(Math.abs(b)))}`;
      const gRule = `$g$ squares its input, then ${c > 0 ? 'adds' : 'subtracts'} ${m(num(Math.abs(c)))}`;
      const fFull = (x: number) => `f(${x}) = ${num(a)} \\times ${paren(x)}${signed(b)} = ${num(a * x)}${signed(b)} = ${num(f(x))}`;
      const gFull = (x: number) => `g(${x}) = ${paren(x)}^{2}${signed(c)} = ${num(x * x)}${signed(c)} = ${num(g(x))}`;
      const solution = steps(
        `${m(label(order))} is a **composite**: one function feeding into another.${useCirc ? ` The small circle means "composed with". It does not mean multiply.` : ''} Work from the inside out: $${inner}$ is next to the number, so $${inner}$ acts first.`,
        `Find the inside part. ${order === 'fg' ? gRule : fRule}: ${m(order === 'fg' ? gFull(k) : fFull(k))}.`,
        `Now put ${m(num(mid))} into $${outer}$, where ${order === 'fg' ? fRule : gRule}: ${m(order === 'fg' ? fFull(mid) : gFull(mid))}.`,
      );

      return {
        stem: `Let ${m(`f(x) = ${fTex}`)} and ${m(`g(x) = ${gTex}`)}. Find ${m(label(order))}.`,
        answer: ans,
        answerValue: answer,
        distractors,
        asking: `What do we get if we apply $${inner}$ to ${m(num(k))}, then apply $${outer}$ to the result?`,
        solution,
        conclusion: `$${inner}$ turns ${m(num(k))} into ${m(num(mid))}, and $${outer}$ turns ${m(num(mid))} into the final value, so the answer is ${ans}.`,
        keyIdea: 'In a composite, the function written closest to the number acts first, and its output becomes the input of the other function. Never multiply or add the two outputs.',
      };
    },
  },
  {
    id: 'gen-composite-inverse-rational',
    subtopic: 'composite-inverse',
    difficulty: 'exam',
    title: 'Find the inverse of a rational function',
    generate(rng) {
      let a = 0;
      let b = 0;
      let c = 0;
      let d = 0;
      for (;;) {
        a = rng.intNonZero(-5, 5);
        b = rng.int(-6, 6);
        c = rng.int(1, 3);
        d = rng.intNonZero(-6, 6);
        if (a * d - b * c === 0) continue; // constant function: no inverse
        if (d === -a) continue; // f would equal its own inverse, so "f itself" could not be a wrong option
        if (gcd(gcd(a, b), gcd(c, d)) !== 1) continue; // avoid a common factor top and bottom
        break;
      }
      const correct: Rat = normRat([-d, b, c, -a]);
      const ansTex = `f^{-1}(x) = ${ratTex(correct)}`;
      const ans = m(ansTex);
      const pool: { r: Rat; why: string }[] = [
        { r: [c, d, a, b], why: `This is the reciprocal ${m('\\frac{1}{f(x)}')}. The $-1$ in $f^{-1}$ means the inverse function (undo $f$), not "one over".` },
        { r: [d, -b, c, -a], why: `This has a sign slip when moving terms across: after collecting the $y$ terms the right-hand side should be ${m(sum([[-d, 'x'], [b, '']]))}, not ${m(sum([[d, 'x'], [-b, '']]))}. The result is the negative of the true inverse.` },
        { r: [-a, b, c, -d], why: `This changes the signs of ${m(num(a))} (the $x$-coefficient on top) and ${m(num(d))} (the constant on the bottom), but the correct inverse also swaps those two numbers. Substituting a value shows this does not undo $f$.` },
        { r: [-d, b, c, a], why: `This forgets to change the sign of ${m(term(a, 'y', true))} when moving it to the left-hand side, so the bracket becomes ${m(sum([[c, 'x'], [a, '']]))} instead of ${m(sum([[c, 'x'], [-a, '']]))}.` },
        { r: [a, b, c, d], why: `This is $f(x)$ itself; it was never inverted.` },
        { r: [-d, -b, c, -a], why: `This has a sign slip on the constant: the right-hand side should be ${m(sum([[-d, 'x'], [b, '']]))}, not ${m(sum([[-d, 'x'], [-b, '']]))}.` },
      ];
      const distractors: { text: string; why: string }[] = [];
      const used: Rat[] = [correct];
      for (const d0 of pool) {
        if (distractors.length === 3) break;
        const r = normRat(d0.r);
        const text = m(`f^{-1}(x) = ${ratTex(r)}`);
        if (used.some((u) => sameRat(u, r)) || text === ans || distractors.some((x) => x.text === text)) continue;
        used.push(r);
        distractors.push({ text, why: d0.why });
      }

      // numerical check point x0 (not the excluded value)
      const x0 = [1, 2, 0, -1, 3].find((x) => c * x + d !== 0)!;
      const y0 = new Frac(a * x0 + b, c * x0 + d);
      const back = new Frac(b).sub(y0.mul(d)).div(y0.mul(c).sub(a));

      const excl = new Frac(-d, c);
      const fTex = `\\frac{${sum([[a, 'x'], [b, '']])}}{${sum([[c, 'x'], [d, '']])}}`;
      const yTop = sum([[a, 'y'], [b, '']]);
      const yBot = sum([[c, 'y'], [d, '']]);
      const collect = `${a > 0 ? 'Subtract' : 'Add'} ${m(term(Math.abs(a), 'y', true))} ${a > 0 ? 'from' : 'to'} both sides, and ${d > 0 ? 'subtract' : 'add'} ${m(term(Math.abs(d), 'x', true))} ${d > 0 ? 'from' : 'to'} both sides`;
      const solution = steps(
        `The **inverse** ${m('f^{-1}')} undoes $f$, so it swaps inputs and outputs. To find it, write ${m(`y = ${fTex}`)}, then swap $x$ and $y$: ${m(`x = \\frac{${yTop}}{${yBot}}`)}.`,
        `Now we need $y$ on its own. Multiply both sides by ${m(yBot)} to clear the fraction: ${m(`x(${yBot}) = ${yTop}`)}.`,
        `Multiply out the bracket: ${m(`${sum([[c, 'xy'], [d, 'x']])} = ${yTop}`)}.`,
        `Gather all the $y$ terms on one side, because we want to take $y$ out as a factor. ${collect}: ${m(`${sum([[c, 'xy'], [-a, 'y']])} = ${sum([[-d, 'x'], [b, '']])}`)}.`,
        `Take out $y$ as a common factor: ${m(`y(${sum([[c, 'x'], [-a, '']])}) = ${sum([[-d, 'x'], [b, '']])}`)}.`,
        `Divide both sides by the bracket to get $y$ alone: ${m(`y = ${ratTex(correct)}`)}. This $y$ is the output of the inverse, so it is ${m('f^{-1}(x)')}.`,
      );

      return {
        stem: `The function $f$ is defined by ${m(`f(x) = ${fTex}`)}, ${m(`x \\ne ${excl.tex()}`)}. Find ${m('f^{-1}(x)')}.`,
        answer: ans,
        distractors,
        asking: 'What rule undoes this fraction function?',
        solution,
        conclusion: `Testing: ${m(`f(${x0}) = ${y0.tex()}`)}, and the rule sends ${m(y0.tex())} back to ${m(back.tex())}. So the answer is ${ans}.`,
        keyIdea: 'For a fraction, swap $x$ and $y$, multiply by the denominator, gather the $y$ terms on one side, take out $y$ as a factor, then divide. To test it, put a number through $f$ and then the inverse: it must come back unchanged.',
      };
    },
  },
];
