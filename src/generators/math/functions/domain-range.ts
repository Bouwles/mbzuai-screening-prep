import type { Generator } from '../../../types';
import { steps } from '../../../lib/explanation';
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

      const parts = `${num(a * k * k)}${signed(b * k)}${signed(c)}`;
      const solution = steps(
        `${m(`f(x)`)} is a rule that takes a number ${m('x')} and gives back an answer. ${m(`f(${k})`)} means: use the rule with ${m(`x = ${k}`)}.`,
        `Replace every ${m('x')} with ${m(paren(k))}. Keep the brackets so the minus sign stays attached:\n\n$$f(${k}) = ${timesSq(a, k)}${timesLin(b, k)}${signed(c)}$$`,
        `Do the power first, because powers come before multiplying. Two negatives multiply to a positive: ${m(`${paren(k)}^{2} = ${paren(k)} \\times ${paren(k)} = ${k * k}`)}.`,
        a !== 1 && `Multiply that by the number in front of ${m('x^{2}')}: ${m(`${paren(a)} \\times ${k * k} = ${num(a * k * k)}`)}.`,
        `Next, the middle part: ${m(`${paren(b)} \\times ${paren(k)} = ${num(b * k)}`)}.`,
        `Add the three parts: ${m(`${parts} = ${num(ans)}`)}.`,
      );

      return {
        stem: `Given ${m(`f(x) = ${fx}`)}, find ${m(`f(${k})`)}.`,
        answer,
        answerValue: ans,
        distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        asking: `What number comes out of the function when we put in ${m(`x = ${k}`)}?`,
        solution,
        conclusion: `Putting ${m(`x = ${k}`)} into the rule gives ${m(parts)}, so the answer is ${answer}.`,
        keyIdea: 'To find $f(\\text{number})$, rewrite the rule with the number in brackets wherever $x$ appears. Then do powers first, then multiplying, then adding. Brackets stop sign slips with negative inputs.',
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

      const def = `The **domain** is the set of all inputs a function can accept.`;
      const r0 = REL_TEX[rel(true, strict)];
      const r1 = REL_TEX[rel(false, strict)];
      const ruleLine =
        kind === 'sqrt'
          ? `${def} A negative number has no real square root, but ${m('\\sqrt{0} = 0')} is fine. So the inside must be 0 or more: ${m(`${inner} \\ge 0`)}.`
          : kind === 'log'
            ? `${def} ${m('\\ln')} is the natural logarithm. It asks what power of ${m('e')} gives its input, and powers of ${m('e')} are always positive. So the input must be above 0: ${m(`${inner} > 0`)}.`
            : `${def} A square root needs its inside to be 0 or more, and the bottom of a fraction can't be 0. Together, the inside must be above 0: ${m(`${inner} > 0`)}.`;
      const moved = `${term(q, 'x', true)} ${r0} ${num(-p)}`;
      const moveLine = `${p > 0 ? 'Subtract' : 'Add'} ${m(num(Math.abs(p)))} ${p > 0 ? 'from' : 'to'} both sides, to leave only the ${m('x')} term on the left: ${m(moved)}.`;
      const solution = steps(
        ruleLine,
        moveLine,
        q < 0 &&
          `To get ${m('x')} alone we ${q === -1 ? 'multiply both sides by $-1$' : `divide both sides by ${m(num(q))}`}. Using a negative number here flips the inequality sign. For example, ${m('2 > 1')}, but ${m('-2 < -1')}. So ${m(r0)} becomes ${m(r1)}: ${answer}.`,
        q > 1 && `Divide both sides by ${m(num(q))} to get ${m('x')} alone: ${answer}.`,
      );
      const xIn = up ? r + 1 : r - 1;
      const xOut = up ? r - 1 : r + 1;

      return {
        stem: `What is the largest possible domain of the real function ${m(`f(x) = ${fTex}`)}?`,
        answer,
        answerValue: ansVal,
        distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        asking: `Which values of ${m('x')} can we put into this function and get a real number?`,
        solution,
        conclusion: `Testing: at ${m(`x = ${xIn}`)} the inside is ${m(num(q * xIn + p))}, which works, and at ${m(`x = ${xOut}`)} it is ${m(num(q * xOut + p))}, which doesn't. So the domain is ${answer}.`,
        keyIdea:
          kind === 'sqrt'
            ? 'For a square root, write inside $\\ge 0$ and solve. If you multiply or divide by a negative number, flip the inequality sign. Then test one value on each side of the boundary.'
            : kind === 'log'
              ? 'For a logarithm, write inside $> 0$ and solve. The sign is strict because $\\ln 0$ does not exist. If you multiply or divide by a negative number, flip the inequality sign.'
              : 'For a square root on the bottom of a fraction, write inside $> 0$ and solve. The sign is strict because the bottom cannot be 0. If you multiply or divide by a negative number, flip the sign.',
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

      const extreme = a > 0 ? 'lowest' : 'highest';
      const parts = `${num(a * h * h)}${signed(b * h)}${c === 0 ? '' : signed(c)}`;
      const solution = steps(
        `The **range** is the set of all possible outputs. The graph here is a parabola, a U-shaped curve. The number in front of ${m('x^{2}')} is ${m(num(a))}, which is ${a > 0 ? 'positive, so it opens upwards' : 'negative, so it opens downwards'} and has a ${extreme} point.`,
        `That turning point is the **vertex**. Its ${m('x')} value is ${m('\\frac{-b}{2a}')}, where ${m('a')} is the number in front of ${m('x^{2}')} and ${m('b')} is the number in front of ${m('x')}. Here ${m(`a = ${a}`)} and ${m(`b = ${b}`)}, so ${m(`x = \\frac{${num(-b)}}{${num(2 * a)}} = ${h}`)}.`,
        `The output there is the ${extreme} output. Substitute ${m(`x = ${h}`)}, with brackets: ${m(`f(${h}) = ${timesSq(a, h)}${timesLin(b, h)}${c === 0 ? '' : signed(c)}`)}.`,
        `Work it out, doing the power first: ${m(`${paren(h)}^{2} = ${h * h}`)}.${a === 1 ? '' : ` Multiply by the number in front: ${m(`${paren(a)} \\times ${h * h} = ${num(a * h * h)}`)}.`} The middle part is ${m(`${paren(b)} \\times ${paren(h)} = ${num(b * h)}`)}. Adding the parts gives ${m(`f(${h}) = ${parts} = ${num(k)}`)}.`,
        `As ${m('x')} moves away from ${m(num(h))}, the outputs keep ${a > 0 ? 'rising' : 'falling'} with no limit. So the outputs are ${m(num(k))} and everything ${a > 0 ? 'above' : 'below'} it: ${answer}.`,
      );

      return {
        stem: `What is the range of ${m(`f(x) = ${poly([a, b, c])}`)}, ${m('x \\in \\mathbb{R}')}?`,
        answer,
        answerValue: ansVal,
        distractors: distractors.map((d) => ({ text: d.text, value: d.value, why: d.why })),
        asking: `What output values can this function produce?`,
        solution,
        conclusion: `The ${extreme} output is ${m(num(k))}, reached at ${m(`x = ${h}`)}, so the range is ${answer}.`,
        keyIdea: 'For the range of $ax^2 + bx + c$, find the height of the vertex by putting $x = \\frac{-b}{2a}$ into the function. If $a > 0$ the range is $\\ge$ that height. If $a < 0$ it is $\\le$ that height.',
      };
    },
  },
];
