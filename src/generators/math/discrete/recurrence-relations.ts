import type { Generator } from '../../../types';
import { m, num, paren, signed, sum } from '../../../lib/tex';

type Cand = { v: number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: number, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(d.v) || d.v === answer || num(d.v) === num(answer)) continue;
    if (out.some((x) => x.v === d.v || num(x.v) === num(d.v))) continue;
    out.push(d);
  }
  return out;
}

/** "c \times v" with the coefficient 1 left out. */
function prod(c: number, v: number): string {
  return c === 1 ? paren(v) : `${c} \\times ${paren(v)}`;
}

export const generators: Generator[] = [
  // ---------------------------------------------------------------- a_n = p a_{n-1} + q: compute a term
  {
    id: 'gen-recurrence-relations-linear-term',
    subtopic: 'recurrence-relations',
    difficulty: 'foundation',
    title: 'Compute a term of a recurrence of the form multiply-then-add',
    generate(rng) {
      for (;;) {
        const start = rng.pick([0, 1]);
        const a = rng.int(1, 6);
        const p = rng.pick([2, 3]);
        const q = rng.intNonZero(-5, 5);
        const steps = rng.pick([3, 4]);
        const k = start + steps;
        // Reject a start value equal to the fixed point (a = pa + q): the sequence would be constant.
        if (a * (1 - p) === q) continue;

        const t = [a];
        for (let i = 1; i <= steps + 1; i++) t.push(p * t[i - 1] + q);
        const answer = t[steps];
        const br = [a];
        for (let i = 1; i <= steps; i++) br.push(p * (br[i - 1] + q));
        const once = a * p ** steps + q;
        const addSteps = a * p ** steps + q * steps;
        const opWord = q > 0 ? `add ${q}` : `subtract ${-q}`;

        // Wrong-order candidate only when it is not a constant sequence (a = p(a + q) would just repeat a).
        const pool: Cand[] = [
          {
            v: br[1] === a ? Number.NaN : br[steps],
            why: `This applies the operations in the wrong order, using ${m(`${p}\\left(a_{n-1}${signed(q)}\\right)`)}: it does the "${opWord}" before multiplying by ${p}. The rule says multiply by ${p} first.`,
          },
          {
            v: t[steps - 1],
            why: `This is ${m(`a_{${k - 1}}`)}: one step too few. From ${m(`a_{${start}}`)} to ${m(`a_{${k}}`)} the rule is applied ${steps} times.`,
          },
          {
            v: t[steps + 1],
            why: `This is ${m(`a_{${k + 1}}`)}: one step too many (check where the sequence starts: the first term is ${m(`a_{${start}}`)}).`,
          },
          {
            v: once,
            why: `This multiplies the first term by ${m(`${p}^{${steps}}`)} and then ${q > 0 ? 'adds' : 'subtracts'} ${Math.abs(q)} only once. The constant is applied at every step, and earlier ones are multiplied again later.`,
          },
          {
            v: addSteps,
            why: `This multiplies the first term by ${m(`${p}^{${steps}}`)} and ${q > 0 ? 'adds' : 'subtracts'} ${Math.abs(q)} once per step, forgetting that each earlier constant is also multiplied by ${p} at the later steps.`,
          },
        ];
        const distractors = pickDistinct(answer, pool);
        if (distractors.length < 3) continue;

        const rule = sum([
          [p, 'a_{n-1}'],
          [q, ''],
        ]);
        const lines = [];
        for (let i = 1; i <= steps; i++) {
          lines.push(`- ${m(`a_{${start + i}} = ${p} \\times ${paren(t[i - 1])}${signed(q)} = ${num(t[i])}`)}`);
        }
        const ans = m(num(answer));
        return {
          stem: `A sequence is defined by ${m(`a_{${start}} = ${a}`)} and ${m(`a_n = ${rule}`)} for ${m(`n \\ge ${start + 1}`)}. What is ${m(`a_{${k}}`)}?`,
          answer: ans,
          answerValue: answer,
          distractors: distractors.map((d) => ({ text: m(num(d.v)), value: d.v, why: d.why })),
          solution:
            `Start from ${m(`a_{${start}} = ${a}`)}. At each step multiply the previous term by ${p}, then ${opWord}. ` +
            `Going from ${m(`a_{${start}}`)} to ${m(`a_{${k}}`)} takes ${steps} steps.\n\n` +
            lines.join('\n') +
            `\n\nAnswer: ${ans}`,
          keyIdea: 'Apply the recurrence one step at a time in the order written (multiply, then add), counting steps from the first given term.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- closed form: far-away term
  {
    id: 'gen-recurrence-relations-closed-form-term',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    title: 'Far-away term of an arithmetic or geometric recurrence (closed form)',
    generate(rng) {
      for (;;) {
        const start = rng.pick([0, 1]);
        const geometric = rng.bool(0.4);

        if (!geometric) {
          const a = rng.intNonZero(-10, 25);
          const d = rng.intNonZero(-9, 9);
          const N = rng.int(15, 60);
          const e = N - start; // number of steps
          const answer = a + e * d;
          const rule = sum([
            [1, 'a_{n-1}'],
            [d, ''],
          ]);
          const pool: Cand[] = [
            start === 1
              ? {
                  v: a + N * d,
                  why: `This uses ${m(`a_1 + nd`)} instead of ${m(`a_1 + (n-1)d`)}. From ${m('a_1')} to ${m(`a_{${N}}`)} the difference is added only ${N - 1} times.`,
                }
              : {
                  v: a + (N - 1) * d,
                  why: `This uses the formula ${m('a_1 + (n-1)d')}, but this sequence starts at ${m('a_0')}, so from ${m('a_0')} to ${m(`a_{${N}}`)} the difference is added ${N} times.`,
                },
            {
              v: e * d,
              why: `This is ${m(`${e} \\times ${paren(d)}`)}: it counts the changes but forgets to start from the first term ${m(`a_{${start}} = ${a}`)}.`,
            },
            ...(d < 0
              ? [
                  {
                    v: a - e * d,
                    why: `This adds ${-d} each time instead of subtracting it: the common difference is ${m(`d = ${d}`)}, which is negative.`,
                  },
                ]
              : []),
            {
              v: start === 1 ? a + (N - 2) * d : a + (N + 1) * d,
              why:
                start === 1
                  ? `This adds the difference only ${N - 2} times: one too few. From ${m('a_1')} to ${m(`a_{${N}}`)} there are ${N - 1} steps.`
                  : `This adds the difference ${N + 1} times: one too many. From ${m('a_0')} to ${m(`a_{${N}}`)} there are exactly ${N} steps.`,
            },
          ];
          const distractors = pickDistinct(answer, pool);
          if (distractors.length < 3) continue;
          const ans = m(num(answer));
          return {
            stem: `A sequence is defined by ${m(`a_{${start}} = ${a}`)} and ${m(`a_n = ${rule}`)} for ${m(`n \\ge ${start + 1}`)}. What is ${m(`a_{${N}}`)}?`,
            answer: ans,
            answerValue: answer,
            distractors: distractors.map((x) => ({ text: m(num(x.v)), value: x.v, why: x.why })),
            solution:
              `The rule ${d > 0 ? 'adds' : 'subtracts'} the same amount every time, so the sequence is **arithmetic** with first term ${m(`a_{${start}} = ${a}`)} and common difference ${m(`d = ${d}`)}.\n\n` +
              `From ${m(`a_{${start}}`)} to ${m(`a_{${N}}`)} there are ${start === 0 ? e : m(`${N} - 1 = ${e}`)} steps, so the difference is added ${e} times:` +
              `\n\n$$a_{${N}} = ${a} + ${e} \\times ${paren(d)} = ${a}${signed(e * d)} = ${num(answer)}$$\n\n` +
              `Answer: ${ans}`,
            keyIdea: 'An "add d" recurrence is arithmetic: the term is the first term plus d times the number of steps from the first term.',
          };
        }

        const a = rng.pick([2, 3, 5]);
        const r = rng.pick([2, 3]);
        const e = r === 2 ? rng.int(6, 10) : rng.int(4, 7); // steps from the first term
        const N = e + start;
        const answer = a * r ** e;
        const pool: Cand[] = [
          start === 1
            ? {
                v: a * r ** (e + 1),
                why: `This uses ${m(`a_1 r^{n}`)} instead of ${m(`a_1 r^{n-1}`)}. From ${m('a_1')} to ${m(`a_{${N}}`)} you multiply by ${r} only ${e} times.`,
              }
            : {
                v: a * r ** (e - 1),
                why: `This uses ${m('a_1 r^{n-1}')}, but this sequence starts at ${m('a_0')}, so from ${m('a_0')} to ${m(`a_{${N}}`)} you multiply by ${r} exactly ${e} times.`,
              },
          {
            v: (a * r) ** e,
            why: `This is ${m(`(${a} \\times ${r})^{${e}}`)}: it raises the first term to the power as well. Only the ratio ${r} is repeated; the first term ${a} is used once.`,
          },
          {
            v: r ** e,
            why: `This is ${m(`${r}^{${e}}`)}: it forgets to multiply by the first term ${a}.`,
          },
          {
            v: a + e * r,
            why: `This adds ${r} at each step (an arithmetic sequence) instead of multiplying by ${r}.`,
          },
        ];
        const distractors = pickDistinct(answer, pool);
        if (distractors.length < 3) continue;
        const ans = m(num(answer));
        return {
          stem: `A sequence is defined by ${m(`a_{${start}} = ${a}`)} and ${m(`a_n = ${r}a_{n-1}`)} for ${m(`n \\ge ${start + 1}`)}. What is ${m(`a_{${N}}`)}?`,
          answer: ans,
          answerValue: answer,
          distractors: distractors.map((x) => ({ text: m(num(x.v)), value: x.v, why: x.why })),
          solution:
            `The rule multiplies by the same number every time, so the sequence is **geometric** with first term ${m(`a_{${start}} = ${a}`)} and ratio ${m(`r = ${r}`)}.\n\n` +
            `From ${m(`a_{${start}}`)} to ${m(`a_{${N}}`)} there are ${start === 0 ? e : m(`${N} - 1 = ${e}`)} steps, so we multiply by ${r} exactly ${e} times:` +
            `\n\n$$a_{${N}} = ${a} \\times ${r}^{${e}} = ${a} \\times ${r ** e} = ${num(answer)}$$\n\n` +
            `Answer: ${ans}`,
          keyIdea: 'A "multiply by r" recurrence is geometric: the term is the first term times r to the power of the number of steps from the first term.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- a_n = p a_{n-1} + q a_{n-2}
  {
    id: 'gen-recurrence-relations-second-order',
    subtopic: 'recurrence-relations',
    difficulty: 'exam',
    title: 'Fibonacci-type recurrence: compute a later term',
    generate(rng) {
      for (;;) {
        const x = rng.int(1, 5);
        const y = rng.int(1, 6);
        const p = rng.pick([1, 2, 3]);
        const q = rng.pick([1, 2, 3]);
        const target = rng.pick([5, 6]);

        const run = (c1: number, c2: number, upto: number) => {
          const s = [0, x, y];
          for (let n = 3; n <= upto; n++) s.push(c1 * s[n - 1] + c2 * s[n - 2]);
          return s;
        };
        const seq = run(p, q, target + 1);
        const answer = seq[target];
        const chain = [0, x, y];
        for (let n = 3; n <= target; n++) chain.push((p + q) * chain[n - 1]);

        const pool: Cand[] = [];
        if (p !== q)
          pool.push({
            v: run(q, p, target)[target],
            why: `This swaps the coefficients, using ${m(`a_n = ${sum([[q, 'a_{n-1}'], [p, 'a_{n-2}']])}`)}. The ${p === 1 ? 'coefficient 1' : `factor ${p}`} belongs to ${m('a_{n-1}')} (one term back) and the ${q === 1 ? 'coefficient 1' : `factor ${q}`} to ${m('a_{n-2}')} (two terms back).`,
          });
        pool.push(
          {
            v: seq[target - 1],
            why: `This is ${m(`a_{${target - 1}}`)}: the working stopped one term too early.`,
          },
          {
            v: seq[target + 1],
            why: `This is ${m(`a_{${target + 1}}`)}: one term too far.`,
          },
        );
        if (!(p === 1 && q === 1))
          pool.push({
            v: run(1, 1, target)[target],
            why: `This ignores the coefficients and simply adds the two previous terms, as in the Fibonacci sequence.`,
          });
        pool.push({
          v: chain[target],
          why: `This uses only the previous term, ${m(`a_n = ${p + q}a_{n-1}`)}, instead of combining the two previous **different** terms.`,
        });
        const distractors = pickDistinct(answer, pool);
        if (distractors.length < 3) continue;

        const rule = sum([
          [p, 'a_{n-1}'],
          [q, 'a_{n-2}'],
        ]);
        const lines: string[] = [];
        for (let n = 3; n <= target; n++) {
          const sym = sum([
            [p, `a_{${n - 1}}`],
            [q, `a_{${n - 2}}`],
          ]);
          lines.push(`- ${m(`a_{${n}} = ${sym} = ${prod(p, seq[n - 1])} + ${prod(q, seq[n - 2])} = ${num(seq[n])}`)}`);
        }
        const ans = m(num(answer));
        return {
          stem: `A sequence is defined by ${m(`a_1 = ${x}`)}, ${m(`a_2 = ${y}`)} and ${m(`a_n = ${rule}`)} for ${m('n \\ge 3')}. What is ${m(`a_{${target}}`)}?`,
          answer: ans,
          answerValue: answer,
          distractors: distractors.map((d) => ({ text: m(num(d.v)), value: d.v, why: d.why })),
          solution:
            `Each new term uses the **two** terms before it: ${p === 1 ? 'the previous term' : `${p} times the previous term`} plus ${q === 1 ? 'the term before that' : `${q} times the term before that`}.\n\n` +
            lines.join('\n') +
            `\n\nAnswer: ${ans}`,
          keyIdea: 'In a two-term recurrence, each coefficient goes with a specific earlier term; build the terms one at a time from the two starting values.',
        };
      }
    },
  },
];
