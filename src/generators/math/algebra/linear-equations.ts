import type { Generator } from '../../../types';
import { Frac } from '../../../lib/frac';
import { dm, m, num, paren, signed, sum, term } from '../../../lib/tex';

type Cand = { key: string; text: string; why: string; value?: number };

/** Keep the first 3 candidates that differ from the answer and from each other (by key AND rendered text). */
function pickThree(answerKey: string, answerText: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.key === answerKey || c.text === answerText) continue;
    if (out.some((o) => o.key === c.key || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

// ---------------------------------------------------------------- inequality helpers
type Op = '<' | '>' | 'le' | 'ge';
const OP_TEX: Record<Op, string> = { '<': '<', '>': '>', le: '\\le', ge: '\\ge' };
const FLIP: Record<Op, Op> = { '<': '>', '>': '<', le: 'ge', ge: 'le' };
const TOGGLE_STRICT: Record<Op, Op> = { '<': 'le', le: '<', '>': 'ge', ge: '>' };
const ineqText = (op: Op, b: Frac) => m(`x ${OP_TEX[op]} ${b.tex()}`);
const ineqKey = (op: Op, b: Frac) => `${op}${b.toString()}`;

// ---------------------------------------------------------------- absolute value helpers
/** "$x = a$ or $x = b$" (ascending) or "$x = a$ only" for a single value. */
function solSetText(vals: Frac[]): { key: string; text: string } {
  const uniq: Frac[] = [];
  for (const v of vals) if (!uniq.some((u) => u.equals(v))) uniq.push(v);
  uniq.sort((a, b) => a.value() - b.value());
  const key = uniq.map((u) => u.toString()).join(',');
  if (uniq.length === 1) return { key, text: `${m(`x = ${uniq[0].tex()}`)} only` };
  return { key, text: uniq.map((u) => m(`x = ${u.tex()}`)).join(' or ') };
}

export const generators: Generator[] = [
  // ============================================================ 1. bracket equation, x on both sides
  {
    id: 'gen-linear-equations-brackets',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    title: 'Solve a linear equation with a bracket and x on both sides',
    generate(rng) {
      for (;;) {
        const p = rng.pick([2, 3, 4, 5, 6, 7, -2, -3, -4, -5]);
        const q = rng.intNonZero(-6, 6);
        const r = rng.intNonZero(-5, 5);
        const x0 = rng.int(-6, 9);
        if (r === p || r === -p) continue;
        const s = p * (x0 - q) - r * x0; // so that p(x - q) = rx + s has solution x0
        const A = p - r;
        const B = s + p * q; // A x = B
        const ans = new Frac(x0);
        const inner = sum([[1, 'x'], [-q, '']]);
        const lhs = `${p}(${inner})`;
        const rhs = sum([[r, 'x'], [s, '']]);
        const expanded = sum([[p, 'x'], [-p * q, '']]);

        const pool: { f: Frac; why: string }[] = [
          {
            f: new Frac(s + q, A),
            why: `This expands ${m(lhs)} as ${m(sum([[p, 'x'], [-q, '']]))}, multiplying only the ${m('x')} by ${m(num(p))}. The ${m(num(p))} multiplies **both** terms in the bracket: ${m(`${lhs} = ${expanded}`)}.`,
          },
          {
            f: new Frac(s + p * q, p + r),
            why: `This moves ${m(term(r, 'x', true))} to the left-hand side without changing its sign, getting ${m(sum([[p + r, 'x']]))}. Moving it across means ${r > 0 ? 'subtracting' : 'adding'} ${m(term(Math.abs(r), 'x', true))} on both sides, which gives ${m(sum([[A, 'x']]))}.`,
          },
          {
            f: new Frac(s - p * q, A),
            why: `This moves the constant ${m(num(-p * q))} to the right-hand side without changing its sign, getting ${m(`${sum([[A, 'x']])} = ${num(s - p * q)}`)} instead of ${m(`${sum([[A, 'x']])} = ${num(B)}`)}.`,
          },
          {
            f: new Frac(B),
            why: `This stops at ${m(`${sum([[A, 'x']])} = ${num(B)}`)} and forgets the last step: divide both sides by ${m(num(A))}.`,
          },
          ...(B !== 0
            ? [
                {
                  f: new Frac(A, B),
                  why: `This divides the wrong way round at the end. From ${m(`${sum([[A, 'x']])} = ${num(B)}`)}, ${m('x')} is ${m(num(B))} divided by ${m(num(A))}, not the other way round.`,
                },
              ]
            : []),
          {
            f: new Frac(s - p * q, p + r),
            why: `This moves both ${m(term(r, 'x', true))} and ${m(num(-p * q))} across without changing their signs, giving ${m(`${sum([[p + r, 'x']])} = ${num(s - p * q)}`)}.`,
          },
        ];
        const cands: Cand[] = pool.map((d) => ({ key: d.f.toString(), text: m(`x = ${d.f.tex()}`), why: d.why, value: d.f.value() }));
        const answer = m(`x = ${x0}`);
        const ds = pickThree(ans.toString(), answer, cands);
        if (ds.length < 3) continue;

        const step1 =
          r > 0
            ? `Subtract ${m(term(r, 'x', true))} from both sides`
            : `Add ${m(term(-r, 'x', true))} to both sides`;
        const step2 = p * q > 0 ? `Add ${m(num(p * q))} to both sides` : `Subtract ${m(num(-p * q))} from both sides`;
        const step3 =
          A === 1
            ? `So ${m(`x = ${x0}`)}.`
            : `Divide both sides by ${m(num(A))}: ${m(`x = ${num(B)} \\div ${paren(A)} = ${x0}`)}.`;
        const rTerm = r === 1 ? paren(x0) : r === -1 && x0 !== 0 ? `-${paren(x0)}` : `${r} \\times ${paren(x0)}`;
        const leftCheck = p * (x0 - q);
        const rightCheck = r * x0 + s;
        const solution =
          `Expand the bracket (the ${m(num(p))} multiplies both terms): ${m(`${lhs} = ${expanded}`)}, so the equation is` +
          dm(`${expanded} = ${rhs}`) +
          `1. ${step1}: ${m(`${sum([[A, 'x'], [-p * q, '']])} = ${num(s)}`)}.\n` +
          `2. ${step2}: ${m(`${sum([[A, 'x']])} = ${num(B)}`)}.\n` +
          `3. ${step3}\n\n` +
          `Check: left side ${m(`${p}\\left(${num(x0)}${signed(-q)}\\right) = ${num(leftCheck)}`)}, right side ${m(`${rTerm}${s === 0 ? '' : signed(s)} = ${num(rightCheck)}`)}. They match.\n\n` +
          `Answer: ${answer}`;
        return {
          stem: `Solve ${m(`${lhs} = ${rhs}`)}.`,
          answer,
          answerValue: x0,
          distractors: ds.map((d) => ({ text: d.text, value: d.value, why: d.why })),
          solution,
          keyIdea: 'Expand brackets fully, collect the $x$ terms on one side and the numbers on the other (changing sign when a term crosses), then divide.',
        };
      }
    },
  },

  // ============================================================ 2. linear inequality (with or without flipping)
  {
    id: 'gen-linear-equations-inequality',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    title: 'Solve a linear inequality (watch out for the flip)',
    generate(rng) {
      for (;;) {
        const A = rng.bool(0.6) ? -rng.int(2, 7) : rng.int(2, 7); // coefficient of x after collecting
        const d = rng.bool(0.5) ? 0 : rng.intNonZero(-5, 5);
        const a = A + d;
        if (a === 0) continue;
        const x0 = rng.intNonZero(-8, 8);
        const b = rng.int(-12, 12);
        const e = A * x0 + b; // ax + b op dx + e  <=>  A x op e - b = A x0
        const op = rng.pick(['<', '>', 'le', 'ge'] as const);
        const ansOp: Op = A < 0 ? FLIP[op] : op;
        const bound = new Frac(x0);
        const answer = ineqText(ansOp, bound);
        const lhs = sum([[a, 'x'], [b, '']]);
        const rhs = d === 0 ? num(e) : sum([[d, 'x'], [e, '']]);
        const stemTex = `${lhs} ${OP_TEX[op]} ${rhs}`;

        const pool: Cand[] = [];
        if (A < 0)
          pool.push({
            key: ineqKey(op, bound),
            text: ineqText(op, bound),
            why: `This forgets to flip the inequality sign. You divide by ${m(num(A))}, a **negative** number, so ${m(OP_TEX[op])} must become ${m(OP_TEX[FLIP[op]])}.`,
          });
        else
          pool.push({
            key: ineqKey(FLIP[op], bound),
            text: ineqText(FLIP[op], bound),
            why: `This flips the inequality sign when it should not. You divide by ${m(num(A))}, which is **positive**, so the sign stays the same. Only multiplying or dividing by a negative flips it.`,
          });
        if (b !== 0) {
          const wrong = new Frac(e + b, A);
          pool.push({
            key: ineqKey(ansOp, wrong),
            text: ineqText(ansOp, wrong),
            why: `This moves the ${m(num(b))} to the other side without changing its sign, getting ${m(`${sum([[A, 'x']])} ${OP_TEX[op]} ${num(e + b)}`)}. To remove ${m(num(b))} from the left you must ${b > 0 ? 'subtract' : 'add'} ${m(num(Math.abs(b)))} on both sides.`,
          });
        }
        if (A < 0)
          pool.push({
            key: ineqKey(op, bound.neg()),
            text: ineqText(op, bound.neg()),
            why: `This divides by ${m(num(-A))} instead of ${m(num(A))}, losing the minus sign: the number comes out with the wrong sign and the inequality is not flipped.`,
          });
        if (d !== 0 && a + d !== 0) {
          const wrong = new Frac(e - b, a + d);
          const wOp: Op = a + d < 0 ? FLIP[op] : op;
          pool.push({
            key: ineqKey(wOp, wrong),
            text: ineqText(wOp, wrong),
            why: `This moves ${m(term(d, 'x', true))} to the left-hand side without changing its sign, getting ${m(sum([[a + d, 'x']]))}. Moving it across means ${d > 0 ? 'subtracting' : 'adding'} ${m(term(Math.abs(d), 'x', true))} on both sides, which gives ${m(sum([[A, 'x']]))}.`,
          });
        }
        pool.push({
          key: ineqKey(TOGGLE_STRICT[ansOp], bound),
          text: ineqText(TOGGLE_STRICT[ansOp], bound),
          why: `This changes the type of inequality. The original uses ${m(OP_TEX[op])}, so the end value ${m(num(x0))} ${op === 'le' || op === 'ge' ? '**is**' : 'is **not**'} included; dividing never turns a strict inequality into a non-strict one or the other way round.`,
        });
        const ds = pickThree(ineqKey(ansOp, bound), answer, pool);
        if (ds.length < 3) continue;

        const steps: string[] = [];
        let cur = lhs;
        if (d !== 0) {
          cur = sum([[A, 'x'], [b, '']]);
          steps.push(
            `${d > 0 ? 'Subtract' : 'Add'} ${m(term(Math.abs(d), 'x', true))} ${d > 0 ? 'from' : 'to'} both sides: ${m(`${cur} ${OP_TEX[op]} ${num(e)}`)}.`,
          );
        }
        if (b !== 0)
          steps.push(
            `${b > 0 ? 'Subtract' : 'Add'} ${m(num(Math.abs(b)))} ${b > 0 ? 'from' : 'to'} both sides: ${m(`${sum([[A, 'x']])} ${OP_TEX[op]} ${num(e - b)}`)}.`,
          );
        steps.push(
          A < 0
            ? `Divide both sides by ${m(num(A))}. This is **negative**, so the inequality sign flips: ${m(`x ${OP_TEX[ansOp]} ${num(e - b)} \\div \\left(${num(A)}\\right)`)}, which is ${answer}.`
            : `Divide both sides by ${m(num(A))} (positive, so the sign stays the same): ${m(`x ${OP_TEX[ansOp]} ${num(e - b)} \\div ${num(A)}`)}, which is ${answer}.`,
        );
        const t = ansOp === '>' || ansOp === 'ge' ? x0 + 1 : x0 - 1;
        const L = a * t + b;
        const R = d * t + e;
        const solution =
          steps.map((s, i) => `${i + 1}. ${s}`).join('\n') +
          `\n\nCheck with a number in the answer: ${m(`x = ${t}`)} gives left side ${m(num(L))} and right side ${m(num(R))}, and ${m(`${num(L)} ${OP_TEX[op]} ${num(R)}`)} is true.\n\n` +
          `Answer: ${answer}`;
        return {
          stem: `Solve the inequality ${m(stemTex)}.`,
          answer,
          answerValue: ineqKey(ansOp, bound),
          distractors: ds.map((c) => ({ text: c.text, value: c.key, why: c.why })),
          solution,
          keyIdea: 'Solve an inequality like an equation, but flip the sign whenever you multiply or divide both sides by a negative number.',
        };
      }
    },
  },

  // ============================================================ 3. absolute value equation
  {
    id: 'gen-linear-equations-abs-value',
    subtopic: 'linear-equations',
    difficulty: 'exam',
    title: 'Solve an absolute value equation (two cases)',
    generate(rng) {
      for (;;) {
        const a = rng.pick([1, 1, 2, 3, 4, 5]);
        const b = rng.intNonZero(-9, 9);
        const c = rng.int(1, 12);
        const k = rng.bool(0.4) ? rng.intNonZero(-6, 6) : 0;
        const x1 = new Frac(c - b, a);
        const x2 = new Frac(-c - b, a);
        if (!x1.isInt() || !x2.isInt()) continue;
        const inner = sum([[a, 'x'], [b, '']]);
        const stemTex = `|${inner}|${k === 0 ? '' : signed(k)} = ${num(c + k)}`;
        const correct = solSetText([x1, x2]);

        const raw: { vals: Frac[]; why: string }[] = [];
        if (k !== 0)
          raw.push({
            vals: [new Frac(c + k - b, a), new Frac(-(c + k) - b, a)],
            why: `This splits into cases before isolating the absolute value, i.e. it uses ${m(`|${inner}| = ${num(c + k)}`)}. First ${k > 0 ? 'subtract' : 'add'} ${m(num(Math.abs(k)))} to get ${m(`|${inner}| = ${num(c)}`)}.`,
          });
        raw.push({
          vals: [x1],
          why: `This only solves the positive case ${m(`${inner} = ${num(c)}`)}. An absolute value equals ${m(num(c))} when the inside is ${m(num(c))} **or** ${m(num(-c))}, so there is a second solution.`,
        });
        raw.push({
          vals: [x1, new Frac(b - c, a)],
          why: `This writes ${m(`-(${inner})`)} as ${m(sum([[-a, 'x'], [b, '']]))} in the second case. The minus sign multiplies both terms: ${m(`-(${inner}) = ${sum([[-a, 'x'], [-b, '']])}`)}.`,
        });
        if (!x1.equals(0))
          raw.push({
            vals: [x1, x1.neg()],
            why: `This solves only ${m(`${inner} = ${num(c)}`)} and then puts ${m('\\pm')} on the answer. The ${m('\\pm')} belongs on the ${m(num(c))}: solve ${m(`${inner} = ${num(c)}`)} and ${m(`${inner} = ${num(-c)}`)} separately.`,
          });
        raw.push({
          vals: [new Frac(c + b, a), new Frac(-c + b, a)],
          why: `This ${b > 0 ? 'adds' : 'subtracts'} ${m(num(Math.abs(b)))} instead of ${b > 0 ? 'subtracting' : 'adding'} it in both cases, moving ${m(num(b))} across without changing its sign.`,
        });
        const pool: Cand[] = raw.map((r) => ({ ...solSetText(r.vals), why: r.why }));
        const ds = pickThree(correct.key, correct.text, pool);
        if (ds.length < 3) continue;

        const solveCase = (rhs: number, val: Frac) =>
          a === 1
            ? `${m(`${inner} = ${num(rhs)}`)}, so ${m(`x = ${num(rhs)}${signed(-b)} = ${val.tex()}`)}`
            : `${m(`${inner} = ${num(rhs)}`)}, so ${m(`${a}x = ${num(rhs - b)}`)} and ${m(`x = ${val.tex()}`)}`;
        const check = (v: Frac) => m(`|${a === 1 ? '' : `${a} \\times `}${paren(v)}${signed(b)}| = |${num(a * v.value() + b)}| = ${num(c)}`);
        const solution =
          (k !== 0
            ? `First isolate the absolute value: ${k > 0 ? 'subtract' : 'add'} ${m(num(Math.abs(k)))} ${k > 0 ? 'from' : 'to'} both sides to get ${m(`|${inner}| = ${num(c)}`)}.\n\n`
            : '') +
          `${m(`|${inner}| = ${num(c)}`)} means the inside is either ${m(num(c))} or ${m(num(-c))}.\n\n` +
          `- Case 1: ${solveCase(c, x1)}.\n` +
          `- Case 2: ${solveCase(-c, x2)}.\n\n` +
          `Check: ${check(x1)} and ${check(x2)}. Both work.\n\n` +
          `Answer: ${correct.text}`;
        return {
          stem: `Solve ${m(stemTex)}.`,
          answer: correct.text,
          answerValue: correct.key,
          distractors: ds.map((d) => ({ text: d.text, value: d.key, why: d.why })),
          solution,
          keyIdea: 'Isolate the absolute value first, then split $|A| = c$ into the two equations $A = c$ and $A = -c$.',
        };
      }
    },
  },
];
