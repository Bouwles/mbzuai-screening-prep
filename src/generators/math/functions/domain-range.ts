import type { Generator } from '../../../types';
import { m, num, paren, poly, signed, sum, term } from '../../../lib/tex';

type Cand = { text: string; value: number | string; why: string };

/** Keep the first 3 candidates that differ from the answer and from each other (by value AND by text). */
function pickDistractors(answer: { text: string; value: number | string }, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const key = (s: string) => s.replace(/\s+/g, '');
  for (const c of pool) {
    if (out.length === 3) break;
    if (String(c.value) === String(answer.value) || key(c.text) === key(answer.text)) continue;
    if (out.some((o) => String(o.value) === String(c.value) || key(o.text) === key(c.text))) continue;
    out.push(c);
  }
  if (out.length < 3) throw new Error('not enough distinct distractors');
  return out;
}

/** "3 \times \left(-2\right)^{2}" style product for substitution lines. */
const timesSq = (a: number, x: number) =>
  a === 1
    ? `${paren(x)}^{2}`
    : a === -1
      ? `-\\left(${num(x)}\\right)^{2}` // always bracketed, so -(4)^2 is not misread as (-4)^2 or -4^2
      : `${num(a)} \\times ${paren(x)}^{2}`;
/** " - 4 \times \left(-2\right)" / " + 4 \times 3" for the linear term. */
const timesLin = (b: number, x: number) => `${b < 0 ? ' - ' : ' + '}${num(Math.abs(b))} \\times ${paren(x)}`;

const REL_TEX: Record<string, string> = { ge: '\\ge', gt: '>', le: '\\le', lt: '<' };

export const generators: Generator[] = [
  // ------------------------------------------------------------------ 1. evaluate f(k)
  {
    id: 'gen-domain-range-evaluate',
    subtopic: 'domain-range',
    difficulty: 'foundation',
    title: 'Evaluate a quadratic function at a given input',
    generate(rng) {
      // Re-pick in the (rare) cases where the common mistakes do not give 3 different wrong answers,
      // e.g. f(x) = -x^2 + 2x - 8 at x = -2, where almost every slip gives -8 or 0.
      let a = 0;
      let b = 0;
      let c = 0;
      let k = 0;
      let ans = 0;
      let pool: Cand[] = [];
      for (;;) {
        a = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        b = rng.intNonZero(-6, 6);
        c = rng.intNonZero(-9, 9);
        k = rng.int(-5, -1);
        ans = a * k * k + b * k + c;
        pool = [];
        pool.push({
          value: -a * k * k + b * k + c,
          text: m(num(-a * k * k + b * k + c)),
          why: `This works out ${m(`${paren(k)}^{2}`)} as ${m(num(-k * k))}. A negative number squared is positive: ${m(`${paren(k)}^{2} = ${k * k}`)}.`,
        });
        pool.push({
          value: (a * k) ** 2 + b * k + c,
          text: m(num((a * k) ** 2 + b * k + c)),
          why: `This squares ${m(`${num(a)} \\times ${paren(k)}`)} together, giving ${m(num((a * k) ** 2))}. Only ${m('x')} is squared: work out ${m(`${paren(k)}^{2}`)} first, then multiply by ${m(num(a))}.`,
        });
        pool.push({
          value: a * k * k - b * k + c,
          text: m(num(a * k * k - b * k + c)),
          why: `This gets the sign of the middle term wrong: ${m(`${num(b)} \\times ${paren(k)} = ${num(b * k)}`)}, not ${m(num(-b * k))}.`,
        });
        pool.push({
          value: 2 * a * k + b * k + c,
          text: m(num(2 * a * k + b * k + c)),
          why: `This treats ${m('x^{2}')} as ${m('2x')} (doubling instead of squaring). ${m(`${paren(k)}^{2} = ${paren(k)} \\times ${paren(k)} = ${k * k}`)}.`,
        });
        pool.push({
          value: a * k * k + b * k,
          text: m(num(a * k * k + b * k)),
          why: `This forgets to add the constant term ${m(num(c))} at the end.`,
        });
        pool.push({
          value: -a * k * k - b * k + c,
          text: m(num(-a * k * k - b * k + c)),
          why: `This makes two sign slips: it works out ${m(`${paren(k)}^{2}`)} as ${m(num(-k * k))} (it should be ${m(num(k * k))}), and it gets ${m(`${num(b)} \\times ${paren(k)}`)} as ${m(num(-b * k))} (it should be ${m(num(b * k))}).`,
        });
        const distinct = new Set(pool.map((p) => p.value).filter((v) => v !== ans));
        if (distinct.size >= 3) break;
      }
      const fx = poly([a, b, c]);
      const answer = m(num(ans));
      const distractors = pickDistractors({ text: answer, value: ans }, pool);

      const solution =
        `Replace every ${m('x')} with ${m(paren(k))}, in brackets:\n\n` +
        `$$f(${k}) = ${timesSq(a, k)}${timesLin(b, k)}${signed(c)}$$\n\n` +
        `1. Power first: ${m(`${paren(k)}^{2} = ${k * k}`)}, so the first term is ${m(`${num(a)} \\times ${k * k} = ${num(a * k * k)}`)}.\n` +
        `2. Middle term: ${m(`${num(b)} \\times ${paren(k)} = ${num(b * k)}`)}.\n` +
        `3. Add up: ${m(`${num(a * k * k)}${signed(b * k)}${signed(c)} = ${num(ans)}`)}.\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `Given ${m(`f(x) = ${fx}`)}, find ${m(`f(${k})`)}.`,
        answer,
        answerValue: ans,
        distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution,
        keyIdea: 'Substitute the input in brackets for every $x$, then do powers before multiplication and addition.',
      };
    },
  },

  // ------------------------------------------------------------------ 2. domain from sqrt / log / 1/sqrt
  {
    id: 'gen-domain-range-linear-domain',
    subtopic: 'domain-range',
    difficulty: 'exam',
    title: 'Domain of a square root, log or reciprocal-root function',
    generate(rng) {
      const kind = rng.pick(['sqrt', 'log', 'recip'] as const);
      const q = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      const r = rng.intNonZero(-6, 6);
      const p = -q * r; // q x + p = 0 at x = r
      const inner = rng.bool() ? sum([[q, 'x'], [p, '']]) : sum([[p, ''], [q, 'x']]);
      const fTex =
        kind === 'sqrt' ? `\\sqrt{${inner}}` : kind === 'log' ? `\\ln\\left(${inner}\\right)` : `\\frac{1}{\\sqrt{${inner}}}`;
      const strict = kind !== 'sqrt';
      const up = q > 0; // x >= r (or x > r) when q is positive
      const rel = (dirUp: boolean, isStrict: boolean) => (dirUp ? (isStrict ? 'gt' : 'ge') : isStrict ? 'lt' : 'le');
      const show = (rl: string, v: number) => m(`x ${REL_TEX[rl]} ${num(v)}`);

      const ansRel = rel(up, strict);
      const answer = show(ansRel, r);
      const ansVal = `${ansRel}:${r}`;

      const pool: Cand[] = [];
      // wrong direction
      const flipRel = rel(!up, strict);
      pool.push({
        value: `${flipRel}:${r}`,
        text: show(flipRel, r),
        why:
          q < 0
            ? `This forgets to reverse the inequality when dividing both sides by the negative number ${m(num(q))}.`
            : `This picks the wrong side. Test ${m(`x = ${r - 1}`)}: the inside becomes ${m(num(q * (r - 1) + p))}, which is negative, so those values are not allowed.`,
      });
      // wrong strictness
      const strictRel = rel(up, !strict);
      pool.push({
        value: `${strictRel}:${r}`,
        text: show(strictRel, r),
        why:
          kind === 'sqrt'
            ? `This leaves out ${m(`x = ${r}`)}, but there the inside is 0 and ${m('\\sqrt{0} = 0')} is defined. A square root needs the inside ${m('\\ge 0')}.`
            : kind === 'log'
              ? `This includes ${m(`x = ${r}`)}, but then you need ${m('\\ln 0')}, which is not defined. A log needs its input strictly ${m('> 0')}.`
              : `This includes ${m(`x = ${r}`)}, which makes the denominator ${m('\\sqrt{0} = 0')}: division by zero.`,
      });
      // sign slip moving the constant
      pool.push({
        value: `${ansRel}:${-r}`,
        text: show(ansRel, -r),
        why: `This moves ${m(num(p))} to the other side without changing its sign (writing ${m(`${term(q, 'x', true)} ${REL_TEX[rel(true, strict)]} ${num(p)}`)} instead of ${m(`${term(q, 'x', true)} ${REL_TEX[rel(true, strict)]} ${num(-p)}`)}).`,
      });
      // forgot to divide by q (and so never flipped)
      if (Math.abs(q) !== 1)
        pool.push({
          value: `${rel(true, strict)}:${-p}`,
          text: show(rel(true, strict), -p),
          why: `This stops at ${m(`${term(q, 'x', true)} ${REL_TEX[rel(true, strict)]} ${num(-p)}`)} and forgets to divide both sides by ${m(num(q))}.`,
        });
      pool.push({
        value: 'all',
        text: 'All real numbers',
        why:
          kind === 'log'
            ? 'A logarithm is only defined for positive inputs, so some $x$-values must be excluded.'
            : 'A square root of a negative number is not real, so some $x$-values must be excluded.',
      });
      const distractors = pickDistractors({ text: answer, value: ansVal }, pool);

      const ruleLine =
        kind === 'sqrt'
          ? `A square root needs its inside to be **zero or positive**:`
          : kind === 'log'
            ? `A logarithm needs its input to be **strictly positive**:`
            : `The square root needs its inside ${m('\\ge 0')}, and because it is in the denominator it cannot be 0 either, so the inside must be **strictly positive**:`;
      const r0 = REL_TEX[rel(true, strict)];
      const steps: string[] = [`${ruleLine} ${m(`${inner} ${r0} 0`)}.`];
      steps.push(`Move the constant to the right-hand side: ${m(`${term(q, 'x', true)} ${r0} ${num(-p)}`)}.`);
      if (q === -1) steps.push(`Multiply both sides by ${m('-1')}. Multiplying by a negative number **reverses** the inequality: ${answer}.`);
      else if (q < 0)
        steps.push(`Divide both sides by ${m(num(q))}. Dividing by a negative number **reverses** the inequality: ${answer}.`);
      else if (q !== 1) steps.push(`Divide both sides by ${m(num(q))}: ${answer}.`);
      const solution =
        steps.map((s, i) => `${i + 1}. ${s}`).join('\n') +
        `\n\nCheck with a value inside the domain, e.g. ${m(`x = ${up ? r + 1 : r - 1}`)}: the inside is ${m(num(q * (up ? r + 1 : r - 1) + p))}, which is positive.\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `What is the largest possible domain of the real function ${m(`f(x) = ${fTex}`)}?`,
        answer,
        answerValue: ansVal,
        distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution,
        keyIdea:
          kind === 'sqrt'
            ? 'For a square root, solve inside $\\ge 0$; flip the inequality if you divide by a negative.'
            : kind === 'log'
              ? 'For a logarithm, solve input $> 0$ (strict); flip the inequality if you divide by a negative.'
              : 'A square root in a denominator needs inside $> 0$ (strict); flip the inequality if you divide by a negative.',
      };
    },
  },

  // ------------------------------------------------------------------ 3. range of a quadratic
  {
    id: 'gen-domain-range-quadratic-range',
    subtopic: 'domain-range',
    difficulty: 'exam',
    title: 'Range of a quadratic function',
    generate(rng) {
      const a = rng.pick([-2, -1, 1, 2]);
      const h = rng.intNonZero(-5, 5);
      const k = rng.int(-9, 9);
      const b = -2 * a * h;
      const c = a * h * h + k;
      const f = (x: number) => a * x * x + b * x + c;
      const relA = a > 0 ? 'ge' : 'le';
      const relB = a > 0 ? 'le' : 'ge';
      const show = (rl: string, v: number) => m(`f(x) ${REL_TEX[rl]} ${num(v)}`);
      const answer = show(relA, k);
      const ansVal = `${relA}:${k}`;

      const pool: Cand[] = [
        {
          value: `${relB}:${k}`,
          text: show(relB, k),
          why:
            a > 0
              ? `Right value, wrong direction: the coefficient of ${m('x^{2}')} is positive, so the parabola opens **upwards** and ${m(num(k))} is a **minimum**.`
              : `Right value, wrong direction: the coefficient of ${m('x^{2}')} is negative, so the parabola opens **downwards** and ${m(num(k))} is a **maximum**.`,
        },
        {
          value: `${relA}:${c}`,
          text: show(relA, c),
          why: `This uses ${m(`f(0) = ${num(c)}`)}, the ${m('y')}-intercept. The turning point is at ${m(`x = ${h}`)}, not at ${m('x = 0')}.`,
        },
        {
          value: `${relA}:${h}`,
          text: show(relA, h),
          why: `This uses the ${m('x')}-coordinate of the vertex (${m(num(h))}) instead of the output there, ${m(`f(${h}) = ${num(k)}`)}. The range is about outputs.`,
        },
        {
          value: `${relA}:${f(-h)}`,
          text: show(relA, f(-h)),
          why: `This takes the vertex at ${m(`x = ${-h}`)} by dropping the minus sign in ${m('x = \\frac{-b}{2a}')}, and works out ${m(`f(${-h}) = ${num(f(-h))}`)}.`,
        },
        {
          value: 'all',
          text: 'All real numbers',
          why: 'A quadratic has a turning point, so its outputs are bounded on one side; it cannot take every real value.',
        },
      ];
      const distractors = pickDistractors({ text: answer, value: ansVal }, pool);

      const solution =
        `1. Vertex ${m('x')}-coordinate: ${m(`x = \\frac{-b}{2a} = \\frac{${num(-b)}}{${num(2 * a)}} = ${h}`)}.\n` +
        `2. Output at the vertex: ${m(`f(${h}) = ${timesSq(a, h)}${timesLin(b, h)}${c === 0 ? '' : signed(c)}`)} ` +
        `${m(`= ${num(a * h * h)}${signed(b * h)}${c === 0 ? '' : signed(c)} = ${num(k)}`)}.\n` +
        `3. The coefficient of ${m('x^{2}')} is ${m(num(a))}, which is ${a > 0 ? 'positive, so the parabola opens upwards and the vertex is the **lowest** point' : 'negative, so the parabola opens downwards and the vertex is the **highest** point'}.\n\n` +
        `(Completing the square gives the same result: ${m(`f(x) = ${a === 1 ? '' : a === -1 ? '-' : num(a)}\\left(x${signed(-h)}\\right)^{2}${k === 0 ? '' : signed(k)}`)}.)\n\n` +
        `Answer: ${answer}`;

      return {
        stem: `What is the range of ${m(`f(x) = ${poly([a, b, c])}`)}, ${m('x \\in \\mathbb{R}')}?`,
        answer,
        answerValue: ansVal,
        distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        solution,
        keyIdea: 'The range of a quadratic on all real numbers is bounded by the $y$-value of its vertex: $\\ge$ if it opens up, $\\le$ if it opens down.',
      };
    },
  },
];
