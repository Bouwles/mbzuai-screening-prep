import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { m, num, paren, poly } from '../../../lib/tex';

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

/** "$F(x0) = ... = value$" line (just "$F(0) = 0$" at zero, avoiding "- 0" terms). */
function subEq(FC: Frac[], x0: number, val: Frac): string {
  if (x0 === 0) return '$F(0) = 0$';
  return `$F(${num(x0)}) = ${subLine(FC, x0)} = ${val.tex()}$`;
}

/** "A - B = " for the final subtraction, or "" when B is 0. */
function minus(A: Frac, B: Frac): string {
  if (B.n === 0) return '';
  return `${A.tex()} - ${paren(B)} = `;
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
        const termLines = fC
          .map((c, i) => {
            const p = deg - i;
            if (c.n === 0) return '';
            const from = poly([c, ...Array(p).fill(0)]);
            const to = poly([c.div(p + 1), ...Array(p + 1).fill(0)]);
            return `- ${m(from)} becomes ${m(to)}\n`;
          })
          .join('');
        const answer = m(ans.tex());
        const solution =
          '**Step 1: integrate term by term** (add 1 to each power, then divide by the new power):\n\n' +
          termLines +
          `\nSo $F(x) = ${FTex}$ (no $+C$ needed, it cancels in a definite integral).\n\n` +
          '**Step 2: substitute the limits.**\n\n' +
          `- ${subEq(FC, hi, Fhi)}\n` +
          `- ${subEq(FC, lo, Flo)}\n\n` +
          '**Step 3: upper minus lower.**\n\n' +
          `$$${intTex(lo, hi, fTex)} = ${minus(Fhi, Flo)}${ans.tex()}$$\n\n` +
          `Answer: ${answer}`;
        return {
          stem: `Evaluate $${intTex(lo, hi, fTex)}$.`,
          answer,
          answerValue: ans.value(),
          distractors: ds.map((d) => ({ text: m(d.f.tex()), value: d.f.value(), why: d.why })),
          solution,
          keyIdea: 'Integrate with the reverse power rule, then work out $F(\\text{upper}) - F(\\text{lower})$.',
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
          solution:
            `The bracket is linear, ${m(`${inner}`)}, with coefficient of $x$ equal to ${m(num(a))}. Use $\\int (ax + b)^{n}\\,dx = \\frac{(ax + b)^{n+1}}{a(n+1)} + C$.\n\n` +
            `**Step 1:** treat the bracket like $x$: raise the power from ${m(num(n))} to ${m(num(n + 1))} and divide by ${m(num(n + 1))}.\n\n` +
            `**Step 2:** divide by the coefficient of $x$, ${m(num(a))}. The number in front becomes ${m(`${num(c)} \\div \\left(${num(n + 1)} \\times ${paren(a)}\\right) = ${ansC.tex()}`)}.\n\n` +
            `**Check:** differentiating ${m(`${lead(ansC)}${br}^{${n + 1}}`)} gives ${m(`${ansC.tex()} \\times ${num(n + 1)} \\times ${paren(a)}${br}^{${n}}`)}, which is ${m(integrand)}.\n\n` +
            `Answer: ${answer}`,
          keyIdea: 'For a function of $ax + b$, integrate as if the bracket were $x$, then divide by $a$.',
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
          solution:
            `Use $\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C$ with $k = ${num(k)}$.\n\n` +
            `**Step 1:** $e^{x}$ integrates to itself, so start with ${m(ex)}.\n\n` +
            `**Step 2:** the chain rule would bring down a factor ${m(num(k))} when differentiating, so divide by ${m(num(k))}: ${m(`${num(c)} \\div ${paren(k)} = ${ansC.tex()}`)}.\n\n` +
            `**Check:** ${m(`\\frac{d}{dx}\\left(${lead(ansC)}${ex}\\right) = ${ansC.tex()} \\times ${paren(k)}${ex} = ${integrand}`)}.\n\n` +
            `Answer: ${answer}`,
          keyIdea: '$\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C$: divide by the number multiplying $x$.',
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
          solution:
            (isCos
              ? `Use $\\int \\cos kx\\,dx = \\frac{1}{k}\\sin kx + C$ with $k = ${num(k)}$.\n\n**Step 1:** $\\cos$ integrates to $\\sin$ (no sign change).\n\n`
              : `Use $\\int \\sin kx\\,dx = -\\frac{1}{k}\\cos kx + C$ with $k = ${num(k)}$.\n\n**Step 1:** $\\sin$ integrates to $-\\cos$ (because $\\frac{d}{dx}\\cos x = -\\sin x$).\n\n`) +
            `**Step 2:** divide by ${m(num(k))}, the number multiplying $x$: ${m(isCos ? `${num(c)} \\div ${num(k)} = ${ansC.tex()}` : `-\\left(${num(c)} \\div ${num(k)}\\right) = ${ansC.tex()}`)}.\n\n` +
            `**Check:** ${m(`\\frac{d}{dx}\\left(${lead(ansC)}${other} ${arg}\\right) = ${ansC.tex()} \\times ${isCos ? num(k) : `\\left(-${num(k)}\\right)`}${fn} ${arg} = ${integrand}`)}.\n\n` +
            `Answer: ${answer}`,
          keyIdea: isCos
            ? '$\\int \\cos kx\\,dx = \\frac{1}{k}\\sin kx + C$: divide by the number multiplying $x$.'
            : '$\\int \\sin kx\\,dx = -\\frac{1}{k}\\cos kx + C$: watch the minus sign and divide by $k$.',
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
        solution:
          `Use $\\int \\frac{1}{ax + b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C$ with $a = ${num(a)}$.\n\n` +
          `**Step 1:** $\\frac{1}{x}$ integrates to $\\ln|x|$, so start with ${m(`${c === 1 ? '' : num(c)}${lnT}`)}.\n\n` +
          `**Step 2:** divide by the coefficient of $x$, ${m(num(a))}: ${m(`${num(c)} \\div ${paren(a)} = ${ansC.tex()}`)}.\n\n` +
          `**Check:** ${m(`\\frac{d}{dx}\\left(${lead(ansC)}${lnT}\\right) = ${ansC.tex()} \\times \\frac{${num(a)}}{${inner}} = ${integrand}`)}.\n\n` +
          `Answer: ${answer}`,
        keyIdea: '$\\int \\frac{1}{ax + b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C$: a logarithm, divided by the coefficient of $x$.',
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
        const solution =
          `**Step 1: find where the curve meets the $x$-axis.** $${fTex} = ${fact} = 0$, so $x = ${num(p)}$ and $x = ${num(q)}$.\n\n` +
          `**Step 2: above or below?** At $x = ${num(mid)}$, $y = ${num(fmid)} < 0$, so the region between the roots is **below** the axis.\n\n` +
          `**Step 3: integrate between the roots.** $F(x) = ${poly(FC)}$.\n\n` +
          `- ${subEq(FC, q, Fq)}\n` +
          `- ${subEq(FC, p, Fp)}\n\n` +
          `$$${intTex(p, q, fTex)} = ${minus(Fq, Fp)}${net.tex()}$$\n\n` +
          `**Step 4:** the integral is negative because the region is below the axis. The area is its size: ${answer} square units.\n\n` +
          `Answer: ${answer}`;
        return {
          stem: `Find the area of the region enclosed by the curve $y = ${fTex}$ and the $x$-axis.`,
          answer,
          answerValue: area.value(),
          distractors: ds.map((d) => ({ text: m(d.f.tex()), value: d.f.value(), why: d.why })),
          solution,
          keyIdea: 'Find the roots, integrate between them, and take the absolute value: a region below the $x$-axis gives a negative integral.',
        };
      }
    },
  },
];
