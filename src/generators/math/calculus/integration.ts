import type { Generator } from '../../../types';
import { steps, table } from '../../../lib/explanation';
import { Frac, lcm } from '../../../lib/frac';
import { m, num, paren, poly, signed } from '../../../lib/tex';

type FCand = { f: Frac; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: Frac, pool: FCand[]): FCand[] {
  const out: FCand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (d.f.equals(answer) || d.f.tex() === answer.tex()) continue;
    if (out.some((x) => x.f.equals(d.f) || x.f.tex() === d.f.tex())) continue;
    out.push(d);
  }
  return out;
}

/** Evaluate a polynomial with Frac coefficients in DESCENDING powers at x. */
function evalPoly(coeffs: Frac[], x: number): Frac {
  return coeffs.reduce((acc, c) => acc.mul(x).add(c), new Frac(0));
}

/** "c" in front of a bracket/function: 1 -> "", -1 -> "-", 3/10 -> "\frac{3}{10}". */
function lead(c: Frac): string {
  if (c.equals(1)) return '';
  if (c.equals(-1)) return '-';
  return c.tex();
}

/** "a \times x0^{p}" written cleanly for a substitution line (x0 may be negative). */
function powSub(x0: number, p: number): string {
  if (p === 1) return paren(x0);
  return `${paren(x0)}^{${p}}`;
}

/** Substitution of x0 into sum of c_k x^k (descending powers), shown term by term. */
function subLine(coeffs: Frac[], x0: number): string {
  const n = coeffs.length - 1;
  let out = '';
  coeffs.forEach((c, i) => {
    const p = n - i;
    if (c.n === 0) return;
    const neg = c.n < 0;
    const a = neg ? c.neg() : c;
    let body: string;
    if (p === 0) body = a.tex();
    else body = a.equals(1) ? powSub(x0, p) : `${a.tex()} \\times ${powSub(x0, p)}`;
    if (out === '') out = neg ? `-${body}` : body;
    else out += neg ? ` - ${body}` : ` + ${body}`;
  });
  return out === '' ? '0' : out;
}

/** The value of each term of F at x0, before adding them up. */
function termVals(coeffs: Frac[], x0: number): Frac[] {
  const n = coeffs.length - 1;
  return coeffs.map((c, i) => c.mul(x0 ** (n - i))).filter((v) => v.n !== 0);
}

/** A list of values written as a sum: "\frac{8}{3} + 6". */
const sumTex = (vals: Frac[]): string => vals.map((v, i) => (i === 0 ? v.tex() : signed(v))).join('');

/**
 * The extra working for adding fractions, as " = ..." links to go before the result:
 * everything over a common denominator, then the total before it is reduced.
 */
function fracWorking(vals: Frac[], result: Frac): string {
  const parts = vals.filter((v) => v.n !== 0);
  if (parts.length < 2 || parts.every((v) => v.d === 1)) return '';
  const L = parts.reduce((acc, v) => lcm(acc, v.d), 1);
  const tops = parts.map((v) => v.n * (L / v.d));
  const over = (t: number) => `\\frac{${Math.abs(t)}}{${L}}`;
  const common = tops.map((t, i) => (i === 0 ? (t < 0 ? `-${over(t)}` : over(t)) : t < 0 ? ` - ${over(t)}` : ` + ${over(t)}`)).join('');
  const total = tops.reduce((a, t) => a + t, 0);
  const same = parts.every((v) => v.d === L);
  return `${same ? '' : ` = ${common}`}${result.d === L ? '' : ` = ${total < 0 ? '-' : ''}${over(total)}`}`;
}

/** "$F(x0) = ... = value$" line, showing each term's value (just "$F(0) = 0$" at zero, avoiding "- 0" terms). */
function subEq(FC: Frac[], x0: number, val: Frac): string {
  if (x0 === 0) return '$F(0) = 0$';
  const vals = termVals(FC, x0);
  const mid = sumTex(vals);
  return `$F(${num(x0)}) = ${subLine(FC, x0)}${mid === val.tex() ? '' : ` = ${mid}`}${fracWorking(vals, val)} = ${val.tex()}$`;
}

/** A sentence for putting one limit into F: at 0 it says why the value is 0. */
function limitLine(name: string, FC: Frac[], x0: number, val: Frac): string {
  return `${name} limit, $x = ${num(x0)}$: ${subEq(FC, x0, val)}${x0 === 0 ? ', because every term has an $x$ in it' : ''}.`;
}

/** "A - B = " for the final subtraction, or "" when B is 0. */
function minus(A: Frac, B: Frac): string {
  if (B.n === 0) return '';
  return `${A.tex()} - ${paren(B)}${fracWorking([A, B.neg()], A.sub(B))} = `;
}

/** Integral limit: a limit of exactly 1 is written "{1 }" (renders identically) so it is not read as a power of 1. */
const lim = (x: number) => (x === 1 ? '{1 }' : `{${num(x)}}`);

/** "\int_{lo}^{hi} \left(f\right)dx". */
function intTex(lo: number, hi: number, fTex: string): string {
  return `\\int_${lim(lo)}^${lim(hi)} \\left(${fTex}\\right)dx`;
}

/** Linear expression ax + b. */
function linTex(a: number, b: number): string {
  return poly([a, b]);
}

export const generators: Generator[] = [
  // ------------------------------------------------------------------ definite integral of a polynomial
  {
    id: 'gen-integration-poly-definite',
    subtopic: 'integration',
    difficulty: 'exam',
    title: 'Evaluate a definite integral of a polynomial',
    generate(rng) {
      for (;;) {
        const cubic = rng.bool(0.35);
        // integrand coefficients in descending powers: [c3,] c2, c1, c0
        const c3 = cubic ? rng.pick([4, -4, 8, 2, -2]) : 0;
        const c2 = rng.pick([3, -3, 6, 1, -1, 9, 2, -6]);
        const c1 = rng.intNonZero(-6, 6);
        const c0 = rng.int(-5, 6);
        const lo = rng.int(-2, 2);
        const hi = lo + rng.int(1, 3);
        if (hi > 4) continue;

        const fC = (cubic ? [c3, c2, c1, c0] : [c2, c1, c0]).map((c) => new Frac(c));
        const deg = fC.length - 1;
        // antiderivative (descending powers, constant term 0)
        const FC = [...fC.map((c, i) => c.div(deg - i + 1)), new Frac(0)];
        // mistake: raise the power but do not divide
        const GC = [...fC, new Frac(0)];
        // mistake: divide by the OLD power (constant term: treat as x, i.e. old power 0 -> keep as c x)
        const HC = [...fC.map((c, i) => (deg - i === 0 ? c : c.div(deg - i))), new Frac(0)];

        const Fhi = evalPoly(FC, hi);
        const Flo = evalPoly(FC, lo);
        const ans = Fhi.sub(Flo);
        const fhi = evalPoly(fC, hi);
        const flo = evalPoly(fC, lo);

        const pool: FCand[] = [
          {
            f: Fhi,
            why: `This is only $F(${num(hi)})$: it forgets to subtract the value at the lower limit, $F(${num(lo)}) = ${Flo.tex()}$.`,
          },
          {
            f: Flo.sub(Fhi),
            why: 'This subtracts the wrong way round, lower limit minus upper limit. It is always $F(\\text{upper}) - F(\\text{lower})$.',
          },
          {
            f: fhi.sub(flo),
            why: 'This substitutes the limits into the integrand itself (the expression inside the integral) without integrating it first.',
          },
          {
            f: evalPoly(GC, hi).sub(evalPoly(GC, lo)),
            why: 'This raises each power by 1 but forgets to divide by the new power.',
          },
          {
            f: evalPoly(HC, hi).sub(evalPoly(HC, lo)),
            why: 'This raises each power by 1 but divides by the **old** power instead of the new one.',
          },
        ];
        const ds = pickDistinct(ans, pool);
        if (ds.length < 3) continue;

        const fTex = poly(fC);
        const FTex = poly(FC);
        const termRows = fC.flatMap((c, i) => {
          const p = deg - i;
          if (c.n === 0) return [];
          const from = poly([c, ...Array(p).fill(0)]);
          const to = poly([c.div(p + 1), ...Array(p + 1).fill(0)]);
          return [[m(from), p + 1, m(`${c.tex()} \\div ${p + 1} = ${c.div(p + 1).tex()}`), m(to)]];
        });
        const answer = m(ans.tex());
        const solution = steps(
          `The numbers on the integral sign are **limits**, with $${num(hi)}$ at the top and $${num(lo)}$ at the bottom. We integrate first, then work out the value at the top limit minus the value at the bottom limit.`,
          'Integrate each term: add 1 to the power, then divide the number in front by the new power. A plain number counts as power 0, so it gains an $x$.\n\n' +
            table(['Term', 'New power', 'Number in front', 'Result'], termRows),
          `Call the result $F(x) = ${FTex}$. We can leave out $+ C$, because it would cancel when we subtract.`,
          limitLine('Top', FC, hi, Fhi),
          limitLine('Bottom', FC, lo, Flo),
          `Subtract, top minus bottom:\n\n$$${intTex(lo, hi, fTex)} = ${minus(Fhi, Flo)}${ans.tex()}$$`,
        );
        return {
          stem: `Evaluate $${intTex(lo, hi, fTex)}$.`,
          answer,
          answerValue: ans.value(),
          distractors: ds.map((d) => ({ text: m(d.f.tex()), value: d.f.value(), why: d.why })),
          asking: `What number do you get by integrating this and using the limits $${num(lo)}$ and $${num(hi)}$?`,
          solution,
          conclusion: `The top limit gives $${Fhi.tex()}$ and the bottom limit gives $${Flo.tex()}$, and subtracting leaves ${answer}.`,
          keyIdea: 'Definite integral: integrate each term (add 1 to the power, divide by the new power), then work out $F(\\text{top}) - F(\\text{bottom})$. Put brackets around negative limits when you substitute them.',
        };
      }
    },
  },

  // ------------------------------------------------------------------ indefinite integral of f(ax + b)
  {
    id: 'gen-integration-linear-inside',
    subtopic: 'integration',
    difficulty: 'exam',
    title: 'Integrate a function of a linear expression, f(ax + b)',
    generate(rng) {
      const kind = rng.pick(['power', 'exp', 'cos', 'sin', 'recip'] as const);
      const a = rng.pick([2, 3, 4, 5, -2, -3]);
      const c = rng.pick([1, 2, 3, 4, 5, 6]);
      const C = new Frac(c);
      const K = ' + C';

      if (kind === 'power') {
        const n = rng.int(2, 5);
        const b = rng.intNonZero(-7, 7);
        const inner = linTex(a, b);
        const br = `\\left(${inner}\\right)`;
        const ansC = C.div(a * (n + 1));
        const integrand = `${lead(C)}${br}^{${n}}`;
        const answer = m(`${lead(ansC)}${br}^{${n + 1}}${K}`);
        const pool = [
          { text: m(`${lead(C.div(n + 1))}${br}^{${n + 1}}${K}`), why: `This forgets to divide by ${m(num(a))}, the coefficient of $x$ inside the bracket. Differentiating it gives ${m(num(a))} times the integrand.` },
          { text: m(`${lead(C.mul(a).div(n + 1))}${br}^{${n + 1}}${K}`), why: `This **multiplies** by ${m(num(a))} (as the chain rule does when differentiating) instead of dividing by it.` },
          { text: m(`${lead(C.mul(a * n))}${br}^{${n - 1}}${K}`.replace('^{1}', '')), why: 'This is the **derivative** of the integrand (power down, power reduced, times the inside derivative), not its integral.' },
        ];
        return {
          stem: `Find $\\int ${integrand}\\,dx$.`,
          answer,
          distractors: pool,
          asking: `Which function has $${integrand}$ as its derivative?`,
          solution: steps(
            `The bracket holds ${m(inner)}: just a number times $x$, plus a number. Multiplying it out would be slow. Instead, treat the bracket like $x$, then correct the result.`,
            `Use the reverse power rule on the bracket: raise the power from ${m(num(n))} to ${m(num(n + 1))} and divide by ${m(num(n + 1))}. ${c === 1 ? '' : `The ${m(num(c))} in front stays too. `}That gives a first guess of ${m(`${lead(C.div(n + 1))}${br}^{${n + 1}}`)}.`,
            `Test the guess by differentiating it. The chain rule multiplies by the derivative of the inside, which is ${m(num(a))}. So the guess gives ${m(num(a))} times what we want.`,
            `To fix that, divide by ${m(num(a))} as well. The number in front becomes ${m(`${num(c)} \\div \\left(${num(n + 1)} \\times ${paren(a)}\\right) = ${ansC.tex()}`)}. So the integral is ${answer}.`,
          ),
          conclusion: `Differentiating ${answer} gives back $${integrand}$, the expression we started with, so this is the integral.`,
          keyIdea: 'For $\\int (ax + b)^{n}\\,dx$: treat the bracket like $x$ (raise the power, divide by the new power), then also divide by $a$, the number multiplying $x$. This only works when the inside is $ax + b$.',
        };
      }

      if (kind === 'exp') {
        // c e^{ax}
        const k = a;
        const ex = `e^{${poly([k, 0])}}`;
        const ansC = C.div(k);
        const integrand = `${lead(C)}${ex}`;
        const answer = m(`${lead(ansC)}${ex}${K}`);
        const k1 = k + 1; // never 0 because |k| >= 2
        const pool = [
          { text: m(`${lead(C)}${ex}${K}`), why: `This forgets to divide by ${m(num(k))}. By the chain rule, ${m(`\\frac{d}{dx}${ex} = ${poly([k, 0]).replace('x', '')}${ex}`)}, so you must divide by ${m(num(k))} to undo it.` },
          { text: m(`${lead(C.mul(k))}${ex}${K}`), why: `This **multiplies** by ${m(num(k))}, which is what differentiating does. Integrating divides by ${m(num(k))}.` },
          { text: m(`${lead(C.div(k1))}e^{${poly([k1, 0])}}${K}`), why: 'This treats the exponent like a power of $x$: it adds 1 to the number in the exponent and divides by it. The reverse power rule does not apply to $e^{kx}$.' },
        ];
        return {
          stem: `Find $\\int ${integrand}\\,dx$.`,
          answer,
          distractors: pool,
          asking: `Which function has $${integrand}$ as its derivative?`,
          solution: steps(
            `$e^{x}$ is special: its derivative is itself, so it also integrates to itself. That suggests a first guess of $${integrand}$, keeping the power of $e$ the same.`,
            `Test the guess by differentiating it. The chain rule brings down ${m(num(k))}, the number multiplying $x$: ${m(`\\frac{d}{dx}${ex} = ${num(k)}${ex}`)}. So the guess gives ${m(num(k))} times what we want.`,
            `To fix that, divide by ${m(num(k))}. The number in front becomes ${m(`${num(c)} \\div ${paren(k)} = ${ansC.tex()}`)}. So the integral is ${answer}.`,
          ),
          conclusion: `Differentiating ${answer} brings down ${m(num(k))} and gives back $${integrand}$, so this is the integral.`,
          keyIdea: '$\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C$: keep the $e^{kx}$ and divide by $k$, the number multiplying $x$. Keep the sign of $k$.',
        };
      }

      if (kind === 'cos' || kind === 'sin') {
        const k = Math.abs(a);
        const arg = poly([k, 0]);
        const isCos = kind === 'cos';
        const fn = isCos ? '\\cos' : '\\sin';
        const other = isCos ? '\\sin' : '\\cos';
        const integrand = `${lead(C)}${fn} ${arg}`;
        // cos -> (c/k) sin ; sin -> -(c/k) cos
        const ansC = isCos ? C.div(k) : C.div(k).neg();
        const answer = m(`${lead(ansC)}${other} ${arg}${K}`);
        const derivC = isCos ? C.mul(k).neg() : C.mul(k); // derivative: cos -> -ck sin ; sin -> ck cos
        const pool = [
          {
            text: m(`${lead(ansC.neg())}${other} ${arg}${K}`),
            why: isCos
              ? 'This has the wrong sign: $\\int \\cos x\\,dx = \\sin x$ (positive). The minus sign belongs to the integral of $\\sin x$.'
              : 'This has the wrong sign: $\\int \\sin x\\,dx = -\\cos x$, because $\\frac{d}{dx}(\\cos x) = -\\sin x$.',
          },
          {
            text: m(`${lead(isCos ? C : C.neg())}${other} ${arg}${K}`),
            why: `This forgets to divide by ${m(num(k))}, the number multiplying $x$. Differentiating it gives ${m(num(k))} times the integrand.`,
          },
          {
            text: m(`${lead(derivC)}${other} ${arg}${K}`),
            why: 'This is the **derivative** of the integrand (it multiplies by the inside derivative instead of dividing), not its integral.',
          },
        ];
        return {
          stem: `Find $\\int ${integrand}\\,dx$.`,
          answer,
          distractors: pool,
          asking: `Which function has $${integrand}$ as its derivative?`,
          solution: steps(
            isCos
              ? `Integrating reverses differentiating, so ask what differentiates to a cosine. The derivative of $\\sin x$ is $\\cos x$, so we start from $\\sin ${arg}$.`
              : `Integrating reverses differentiating, so ask what differentiates to a sine. The derivative of $\\cos x$ is $-\\sin x$, which has an unwanted minus sign. So $-\\cos x$ differentiates to $\\sin x$, and we start from $-\\cos ${arg}$.`,
            `Differentiating that with the chain rule would bring down ${m(num(k))}, the number multiplying $x$. That makes it ${m(num(k))} times too big, so we must divide by ${m(num(k))}.`,
            `${c === 1 ? '' : `The ${m(num(c))} in the question stays in front too. `}The number in front becomes ${m(isCos ? `${num(c)} \\div ${num(k)} = ${ansC.tex()}` : `-\\left(${num(c)} \\div ${num(k)}\\right) = ${ansC.tex()}`)}. So the integral is ${answer}.`,
          ),
          conclusion: `Differentiating ${answer} gives back $${integrand}$, so this is the integral.`,
          keyIdea: isCos
            ? '$\\int \\cos kx\\,dx = \\frac{1}{k}\\sin kx + C$: cosine becomes sine with no sign change, then divide by $k$, the number multiplying $x$.'
            : '$\\int \\sin kx\\,dx = -\\frac{1}{k}\\cos kx + C$: sine becomes minus cosine, then divide by $k$, the number multiplying $x$.',
        };
      }

      // recip: c / (ax + b)
      const b = rng.intNonZero(-7, 7);
      const inner = linTex(a, b);
      const ansC = C.div(a);
      const integrand = `\\frac{${num(c)}}{${inner}}`;
      const lnT = `\\ln\\left|${inner}\\right|`;
      const answer = m(`${lead(ansC)}${lnT}${K}`);
      const dC = C.mul(a).neg();
      const pool = [
        { text: m(`${lead(C)}${lnT}${K}`), why: `This forgets to divide by ${m(num(a))}, the coefficient of $x$. Differentiating it gives ${m(`${c * a < 0 ? '-' : ''}\\frac{${num(Math.abs(c * a))}}{${inner}}`)}.` },
        { text: m(`${lead(C.mul(a))}${lnT}${K}`), why: `This **multiplies** by ${m(num(a))} (as when differentiating with the chain rule) instead of dividing by it.` },
        {
          text: m(`${dC.n < 0 ? '-' : ''}\\frac{${num(Math.abs(c * a))}}{\\left(${inner}\\right)^{2}}${K}`),
          why: 'This **differentiates** the integrand instead of integrating it. The power $-1$ is the one case where the reverse power rule fails: it integrates to a logarithm.',
        },
      ];
      return {
        stem: `Find $\\int ${integrand}\\,dx$.`,
        answer,
        distractors: pool,
        asking: `Which function has $${integrand}$ as its derivative?`,
        solution: steps(
          `This looks like $\\frac{1}{x}$, which integrates to $\\ln|x|$. So expect a logarithm. The bars mean the size of the number, since a logarithm needs a positive input.`,
          `Make a first guess by treating the whole bottom like $x$: ${m(`${c === 1 ? '' : num(c)}${lnT}`)}.`,
          `Test the guess by differentiating. The chain rule says a logarithm gives the derivative of its inside divided by the inside. So we get ${m(`${num(c)} \\times \\frac{${num(a)}}{${inner}}`)}, which is ${m(num(a))} times what we want.`,
          `To fix that, divide by ${m(num(a))}. The number in front becomes ${m(`${num(c)} \\div ${paren(a)} = ${ansC.tex()}`)}. So the integral is ${answer}.`,
        ),
        conclusion: `Differentiating ${answer} gives back $${integrand}$, so this is the integral.`,
        keyIdea: '$\\int \\frac{1}{ax + b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C$. Spot a number on top and $ax + b$ on the bottom. Use a logarithm, keep the number on top, then divide by $a$.',
      };
    },
  },

  // ------------------------------------------------------------------ area of a region below the x-axis
  {
    id: 'gen-integration-area-below-axis',
    subtopic: 'integration',
    difficulty: 'exam',
    title: 'Area enclosed by a parabola and the x-axis (region below the axis)',
    generate(rng) {
      for (;;) {
        const p = rng.int(-3, 2);
        const q = p + rng.int(2, 6);
        if (q > 6) continue;
        // y = (x - p)(x - q) = x^2 + B x + D, negative between the roots
        const B = -(p + q);
        const D = p * q;
        const fC = [new Frac(1), new Frac(B), new Frac(D)];
        const FC = [new Frac(1, 3), new Frac(B, 2), new Frac(D), new Frac(0)];
        const Fq = evalPoly(FC, q);
        const Fp = evalPoly(FC, p);
        const net = Fq.sub(Fp); // negative
        const area = net.neg();

        const abs = (f: Frac) => (f.n < 0 ? f.neg() : f);
        const G = [new Frac(1), new Frac(B, 2), new Frac(D), new Frac(0)]; // forgot /3
        const H = [new Frac(1, 3), new Frac(B), new Frac(D), new Frac(0)]; // forgot /2
        const pool: FCand[] = [
          {
            f: net,
            why: `This is the value of the integral, which is negative because the region is **below** the $x$-axis. An area cannot be negative, so take the absolute value.`,
          },
          {
            f: abs(evalPoly(G, q).sub(evalPoly(G, p))),
            why: 'This forgets to divide $x^{2}$ by its new power 3 when integrating (and then takes the size of the result).',
          },
          {
            f: abs(evalPoly(H, q).sub(evalPoly(H, p))),
            why: 'This forgets to divide the $x$ term by its new power 2 when integrating (and then takes the size of the result).',
          },
          {
            f: abs(Fq),
            why: `This uses only the value of $F$ at the upper limit $x = ${num(q)}$ (made positive) and forgets to subtract the value at the lower limit $x = ${num(p)}$.`,
          },
          {
            f: area.mul(2),
            why: 'This doubles the area, as if the region were counted once below and once above the axis.',
          },
        ];
        const ds = pickDistinct(area, pool);
        if (ds.length < 3) continue;

        const fTex = poly(fC);
        const factor = (r: number) => (r === 0 ? 'x' : `\\left(${poly([1, -r])}\\right)`);
        const fact = q === 0 ? `x${factor(p)}` : `${factor(p)}${factor(q)}`;
        const mid = (p + q) / 2;
        const fmid = (mid - p) * (mid - q);
        const answer = m(area.tex());
        const intTerms = [
          '$x^{2}$ becomes $\\frac{x^{3}}{3}$',
          B !== 0 && `${m(poly([B, 0]))} becomes ${m(poly([new Frac(B, 2), 0, 0]))}`,
          D !== 0 && `${m(num(D))} becomes ${m(poly([D, 0]))}`,
        ].filter(Boolean);
        const solution = steps(
          `The region lies between the points where the curve meets the $x$-axis, so set $y = 0$. ${
            D === 0 ? 'Both terms contain $x$, so take it out as a factor' : `Two numbers that multiply to ${m(num(D))} and add to ${m(num(B))} are ${m(num(-p))} and ${m(num(-q))}`
          }: $${fTex} = ${fact} = 0$.`,
          `A product is 0 only when one of its factors is 0, so $x = ${num(p)}$ or $x = ${num(q)}$. The area comes from a **definite integral**, with these two values as its **limits**.`,
          `Is the region above or below the axis? Test halfway between them, at $x = ${num(mid)}$: $y = ${num(mid - p)} \\times ${paren(mid - q)} = ${num(fmid)}$. That is negative, so the region is **below** the axis.`,
          `Integrate: add 1 to each power, then divide by the new power. So ${intTerms.join(', and ')}. That gives $F(x) = ${poly(FC)}$, where $F$ is our name for the integrated function.`,
          limitLine('Top', FC, q, Fq),
          limitLine('Bottom', FC, p, Fp),
          `Subtract, top minus bottom: $${intTex(p, q, fTex)} = ${minus(Fq, Fp)}${net.tex()}$. The minus sign only says the region is below the axis. An area can't be negative, so drop the sign: the area is ${answer}.`,
        );
        return {
          stem: `Find the area of the region enclosed by the curve $y = ${fTex}$ and the $x$-axis.`,
          answer,
          answerValue: area.value(),
          distractors: ds.map((d) => ({ text: m(d.f.tex()), value: d.f.value(), why: d.why })),
          asking: 'How big is the region trapped between this curve and the $x$-axis?',
          solution,
          conclusion: `The integral comes to $${net.tex()}$ because the region is below the axis, so the area is its size, ${answer}.`,
          keyIdea: 'Area enclosed by a curve and the $x$-axis: set $y = 0$ to find the limits, integrate, and subtract top minus bottom. If the result is negative, the region is below the axis, so drop the minus sign.',
        };
      }
    },
  },
];
