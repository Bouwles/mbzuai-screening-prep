import type { Generator } from '../../../types';
import { steps, table } from '../../../lib/explanation';
import { Frac } from '../../../lib/frac';
import { m, num, poly, sum } from '../../../lib/tex';

type NumCand = { v: number; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinctNums(answer: number, pool: NumCand[]): NumCand[] {
  const out: NumCand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(d.v) || d.v === answer || num(d.v) === num(answer)) continue;
    if (out.some((x) => x.v === d.v || num(x.v) === num(d.v))) continue;
    out.push(d);
  }
  return out;
}

const ordinal = (n: number): string => {
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th';
  return `${n}${s}`;
};

const list = (xs: (number | string)[]) => xs.map((x) => (typeof x === 'number' ? num(x) : x)).join(', ');

export const generators: Generator[] = [
  // ---------------------------------------------------------------- quadratic sequence: k-th term
  {
    id: 'gen-number-sequences-quadratic-term',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    title: 'Find a later term of a quadratic sequence (second differences)',
    generate(rng) {
      for (;;) {
        const a = rng.int(1, 3);
        const b = rng.int(-4, 5);
        const c = rng.int(-5, 6);
        const k = rng.int(8, 12);
        const u = (n: number) => a * n * n + b * n + c;
        const terms = [1, 2, 3, 4, 5].map(u);
        if (terms[0] <= 0 || terms[1] <= terms[0]) continue; // positive and increasing for a friendly start
        const d1 = terms.slice(1).map((v, i) => v - terms[i]);
        const d2 = d1.slice(1).map((v, i) => v - d1[i]);
        const answer = u(k);

        // mistake 1: keep adding the last first difference (treat as linear from here on)
        const linearCont = terms[4] + (k - 5) * d1[3];
        // mistake 2: use the whole second difference as the n^2 coefficient, fit the first two terms
        const A = 2 * a;
        const B = d1[0] - 3 * A;
        const C = terms[0] - A - B;
        const fullSecond = A * k * k + B * k + C;
        // mistake 3: off-by-one (the term before / after)
        const before = u(k - 1);
        const after = u(k + 1);
        // mistake 4: n^2 coefficient right, but only the first leftover used as a constant
        const firstLeftover = a * k * k + (terms[0] - a);

        const pool: NumCand[] = [
          { v: linearCont, why: `This keeps adding the last difference (${d1[3]}) as if the sequence became linear. The differences themselves go up by ${d2[0]} every time.` },
          {
            v: fullSecond,
            why: `This uses the whole second difference (${d2[0]}) as the coefficient of ${m('n^2')} instead of half of it, giving ${m(poly([A, B, C], 'n'))}, which only fits the first two terms.`,
          },
          { v: before, why: `This is the ${ordinal(k - 1)} term: one step was missed when counting along the sequence.` },
          {
            v: firstLeftover,
            why: `This takes ${m(poly([a, 0, terms[0] - a], 'n'))}: it removes ${m(a === 1 ? 'n^2' : `${a}n^2`)} correctly but treats the first leftover value as a constant, although the leftovers still change with ${m('n')}.`,
          },
          { v: after, why: `This is the ${ordinal(k + 1)} term: one step too many was counted.` },
        ];
        const distractors = pickDistinctNums(answer, pool);
        if (distractors.length < 3) continue;

        const sq = (n: number) => a * n * n;
        const leftover = [1, 2, 3, 4, 5].map((n) => terms[n - 1] - sq(n));
        const nth = poly([a, b, c], 'n');
        const aTerm = a === 1 ? 'n^2' : `${a}n^2`;
        const linPart = sum([
          [b, 'n'],
          [c, ''],
        ]);
        // substitution line, e.g. "2 \times 12^2 + 12 + 4", then "288 + 12 + 4"
        const subst =
          `${a === 1 ? '' : `${a} \\times `}${k}^2` +
          (b === 0 ? '' : b > 0 ? ` + ${b === 1 ? '' : `${b} \\times `}${k}` : ` - ${b === -1 ? '' : `${-b} \\times `}${k}`) +
          (c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${-c}`);
        const parts = sum([
          [a * k * k, ''],
          [b * k, ''],
          [c, ''],
        ]);
        const leftoverText =
          b === 0
            ? `The left-over values are all ${m(num(c))}, so nothing else changes with ${m('n')}. The whole formula is ${m(`u_n = ${nth}`)}, where ${m('u_n')} means the term in position ${m('n')}.`
            : `The left-over values ${b > 0 ? `go up by ${b}` : `go down by ${-b}`} each time, so they follow ${m(sum([[b, 'n']]))}, which gives ${m(list([1, 2, 3, 4, 5].map((n) => b * n)))}. ` +
              (c === 0 ? 'That is exactly the left-over list' : `The left-over list is ${Math.abs(c)} ${c > 0 ? 'more' : 'less'} each time`) +
              `, so it is ${m(linPart)}. The whole formula is ${m(`u_n = ${nth}`)}, where ${m('u_n')} means the term in position ${m('n')}.`;
        return {
          stem: `The sequence ${m(`${list(terms)}, \\dots`)} continues with the same pattern. What is its ${ordinal(k)} term?`,
          answer: m(num(answer)),
          answerValue: answer,
          distractors: distractors.map((d) => ({ text: m(num(d.v)), value: d.v, why: d.why })),
          asking: `What is the term in position ${k} of this sequence?`,
          solution: steps(
            `Find the gaps between neighbouring terms, called the **first differences**: ${m(list(d1))}. They are not all equal, so this is not a simple adding pattern.`,
            `Find the gaps between those gaps, called the **second differences**: ${m(list(d2))}. They are all ${d2[0]}. A constant second difference means the formula is **quadratic**: it contains ${m('n^2')}, where ${m('n')} is the position.`,
            `The number in front of ${m('n^2')} is half the second difference: ${m(`\\frac{${d2[0]}}{2} = ${a}`)}. So the formula starts with ${m(aTerm)}.`,
            `Subtract ${m(aTerm)} from each term to see what is left:\n\n${table(
              ['$n$', 1, 2, 3, 4, 5],
              [
                ['Term', ...terms.map((t) => m(num(t)))],
                [m(aTerm), ...[1, 2, 3, 4, 5].map((n) => m(num(sq(n))))],
                ['Left over', ...leftover.map((t) => m(num(t)))],
              ],
            )}`,
            `${leftoverText} As a test, ${m('n = 1')} gives ${m(num(terms[0]))} and ${m('n = 2')} gives ${m(num(terms[1]))}.`,
            `Put in ${m(`n = ${k}`)}: ${m(`u_{${k}} = ${subst}${parts === subst || parts === num(answer) ? '' : ` = ${parts}`} = ${num(answer)}`)}.`,
          ),
          conclusion: `The formula ${m(`u_n = ${nth}`)} gives the listed terms, and at ${m(`n = ${k}`)} it gives ${m(num(answer))}.`,
          keyIdea: 'If the second differences are constant, the sequence is quadratic. The number in front of $n^2$ is half the second difference. Subtract that part from each term, find the linear rule for what is left, then substitute the position.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- geometric sequence: k-th term
  {
    id: 'gen-number-sequences-geometric-term',
    subtopic: 'number-sequences',
    difficulty: 'exam',
    title: 'Find a later term of a geometric sequence',
    generate(rng) {
      for (;;) {
        const kind = rng.pick(['2', '3', '-2', '-3', 'half'] as const);
        let r: Frac;
        let a: number;
        let k: number;
        if (kind === 'half') {
          k = rng.int(6, 8);
          a = rng.pick([1, 3, 5]) * 2 ** (k - 1) * (rng.bool(0.25) ? 3 : 1);
          r = new Frac(1, 2);
        } else {
          const rv = Number(kind);
          r = new Frac(rv);
          a = rng.int(1, 5);
          // k >= 6 for r = 3 so the "one term too few" and "linear" distractors are not terms already printed
          k = Math.abs(rv) === 2 ? rng.int(7, 10) : rng.int(6, 7);
        }
        const term = (n: number) => new Frac(a).mul(powF(r, n - 1));
        const shown = [1, 2, 3, 4].map((n) => term(n).value());
        const answer = term(k).value();
        const d = shown[1] - shown[0];

        const pool: NumCand[] = [
          { v: term(k + 1).value(), why: `This uses ${m(`r^{${k}}`)} instead of ${m(`r^{${k - 1}}`)}: one multiplication too many. From the 1st term to the ${ordinal(k)} there are only ${k - 1} multiplications.` },
          { v: term(k - 1).value(), why: `This is the ${ordinal(k - 1)} term: one multiplication was missed when counting along.` },
          ...(r.n < 0 ? [{ v: -answer, why: `This has the right size but the wrong sign. With a negative ratio the signs alternate, and the ${ordinal(k)} term is ${answer < 0 ? 'negative' : 'positive'} (${k % 2 === 0 ? 'even' : 'odd'} positions match the ${k % 2 === 0 ? '2nd' : '1st'} term).` }] : []),
          { v: shown[0] + (k - 1) * d, why: `This treats the sequence as **linear**, adding the first difference (${m(num(d))}) each time. The terms are multiplied by the same ratio, not increased by the same amount.` },
          { v: a * r.value() * (k - 1), why: `This multiplies the first term by ${m(`r \\times ${k - 1}`)} instead of raising ${m('r')} to the power ${k - 1}.` },
        ];
        // a distractor that is already printed in the stem is a give-away, so drop those
        const distractors = pickDistinctNums(
          answer,
          pool.filter((x) => !shown.includes(x.v)),
        );
        if (distractors.length < 3) continue;

        const rTex = r.n < 0 || r.d !== 1 ? `\\left(${r.tex()}\\right)` : r.tex();
        const ansTex = num(answer);
        const walk = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, k).map((n) => num(term(n).value())).join(', ');
        return {
          stem: `The sequence ${m(`${list(shown)}, \\dots`)} is geometric. What is its ${ordinal(k)} term?`,
          answer: m(ansTex),
          answerValue: answer,
          distractors: distractors.map((x) => ({ text: m(num(x.v)), value: x.v, why: x.why })),
          asking: `What is the term in position ${k} of this sequence?`,
          solution: steps(
            `**Geometric** means each term is the one before multiplied by a fixed number, called the **common ratio**, ${m('r')}. Find it by dividing a term by the one before: ${m(`r = ${num(shown[1])} \\div ${shown[0] < 0 ? `(${num(shown[0])})` : num(shown[0])} = ${r.tex()}`)}.`,
            r.n < 0 && 'The ratio is negative, so each multiplication flips the sign and the signs alternate.',
            `From the 1st term to the ${ordinal(k)}, we multiply by ${m('r')} exactly ${k - 1} times, because the first term needs no multiplying. So we use ${m('u_n = ar^{n-1}')}, where ${m('u_n')} is the term in position ${m('n')} and ${m(`a = ${a}`)} is the first term.`,
            `Substitute ${m(`n = ${k}`)} and work it out. Writing out every term agrees: ${m(walk)}.\n\n$$u_{${k}} = ${a} \\times ${rTex}^{${k - 1}} = ${a} \\times ${paren(powF(r, k - 1))} = ${ansTex}$$`,
          ),
          conclusion: `Multiplying the first term by ${m('r')} a total of ${k - 1} times gives ${m(ansTex)}.`,
          keyIdea: 'For a geometric sequence, $u_n = ar^{n-1}$, where $a$ is the first term, $r$ is the ratio and $n$ is the position. Find $r$ by dividing neighbours. From term 1 to term $n$ there are $n - 1$ multiplications.',
        };
      }
    },
  },

  // ---------------------------------------------------------------- linear sequence: nth-term formula
  {
    id: 'gen-number-sequences-linear-formula',
    subtopic: 'number-sequences',
    difficulty: 'foundation',
    title: 'Find the nth-term formula of a linear sequence',
    generate(rng) {
      for (;;) {
        const a = rng.intNonZero(-10, 20);
        const d = rng.intNonZero(-6, 9);
        if (d === 1 || d === -1) continue;
        const shown = [0, 1, 2, 3].map((i) => a + i * d);
        const c = a - d;
        const fmtLin = (p: number, q: number) =>
          m(
            sum([
              [p, 'n'],
              [q, ''],
            ]),
          );
        const answerPair: [number, number] = [d, c];
        const pool: { p: [number, number]; why: string }[] = [
          { p: [d, a], why: `This uses the first term (${m(num(a))}) as the constant. The constant is the first term minus the difference, ${m(`${a} - ${d < 0 ? `(${d})` : d} = ${c}`)}; this formula gives the sequence one step too far ahead.` },
          { p: [a, d], why: `This swaps the roles of the first term and the common difference. The coefficient of ${m('n')} must be the difference, ${m(num(d))}.` },
          { p: [1, d], why: `This confuses "${d > 0 ? `add ${d}` : `subtract ${-d}`} each time" with "${d > 0 ? `add ${d} to` : `subtract ${-d} from`} ${m('n')}": it gives a sequence that goes up by 1 each time.` },
          { p: [d, -c], why: `This has the right coefficient but the wrong sign on the constant: substituting ${m('n = 1')} gives ${m(num(d - c))}, not ${m(num(a))}.` },
          { p: [d, a + d], why: `This adds the difference to the first term instead of subtracting it: substituting ${m('n = 1')} gives ${m(num(2 * d + a))}, not ${m(num(a))}.` },
        ];
        const used: [number, number][] = [answerPair];
        const distractors: { text: string; why: string }[] = [];
        for (const cand of pool) {
          if (distractors.length === 3) break;
          if (cand.p[0] === 0) continue;
          if (used.some((u) => u[0] === cand.p[0] && u[1] === cand.p[1])) continue;
          const text = fmtLin(cand.p[0], cand.p[1]);
          if (text === fmtLin(d, c) || distractors.some((x) => x.text === text)) continue;
          used.push(cand.p);
          distractors.push({ text, why: cand.why });
        }
        if (distractors.length < 3) continue;

        const answer = fmtLin(d, c);
        const timesTable = [1, 2, 3, 4].map((n) => d * n);
        const dn = m(sum([[d, 'n']]));
        return {
          stem: `Which expression gives the ${m('n')}th term of the sequence ${m(`${list(shown)}, \\dots`)}?`,
          answer,
          distractors,
          asking: `Which formula turns a position ${m('n')} into the term at that position?`,
          solution: steps(
            `${m('n')} is the position in the list: ${m('n = 1')} for the first term, ${m('n = 2')} for the second, and so on. We want a formula that turns ${m('n')} into the term.`,
            `The gap between neighbours is ${m(`${num(shown[1])} - ${shown[0] < 0 ? `(${shown[0]})` : shown[0]} = ${d}`)}, the same each time. So the sequence is linked to the ${m(num(d))} times table, and the formula starts with ${dn}.`,
            `${dn} gives ${m(list(timesTable))}. Compare with the sequence, ${m(list(shown))}: ` +
              (c === 0 ? 'they are the same, so nothing needs to be added.' : `every term is ${c > 0 ? `${c} more` : `${-c} less`}, which is the first term minus the gap: ${m(`${a} - ${d < 0 ? `(${d})` : d} = ${c}`)}.`),
            `${c === 0 ? 'So the formula is just that' : `So we ${c > 0 ? 'add' : 'subtract'} ${Math.abs(c)}`}. Test the result: ${m('n = 1')} gives ${m(num(a))} and ${m('n = 2')} gives ${m(num(a + d))}, matching the sequence.`,
          ),
          conclusion: `It has the right gap of ${m(num(d))} and gives the right first term, so the expression is ${answer}.`,
          keyIdea: 'For a linear sequence the $n$th term is $dn + (a - d)$, where $d$ is the gap and $a$ is the first term. In practice, write the times table of the gap, then see what to add or subtract to match the sequence.',
        };
      }
    },
  },
];

function powF(r: Frac, e: number): Frac {
  let out = new Frac(1);
  for (let i = 0; i < e; i++) out = out.mul(r);
  return out;
}

function paren(f: Frac): string {
  return f.n < 0 ? `\\left(${f.tex()}\\right)` : f.tex();
}
