import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';

type B = boolean;
type Op = 'and' | 'or' | 'xor';

const OP_TEX: Record<Op, string> = { and: '\\land', or: '\\lor', xor: '\\oplus' };
const OP_NAME: Record<Op, string> = { and: 'AND', or: 'OR', xor: 'XOR' };
const OP_RULE: Record<Op, string> = {
  and: '$\\land$ (AND) is 1 only when both sides are 1',
  or: '$\\lor$ (OR) is 1 when at least one side is 1',
  xor: '$\\oplus$ (XOR) is 1 when the two sides are different',
};
/** The operator a student most often confuses each operator with. */
const CONFUSE: Record<Op, Op> = { and: 'or', or: 'and', xor: 'or' };
const applyOp = (op: Op, x: B, y: B): B => (op === 'and' ? x && y : op === 'or' ? x || y : x !== y);
const bit = (v: B) => (v ? '1' : '0');
const ROWS3: B[][] = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => [(k & 4) > 0, (k & 2) > 0, (k & 1) > 0]);

// ======================================================================= generator 1: count true rows
interface Spec {
  /** Indices into [A, B, C] for the three slots X, Y, Z of  [NOT](X op1 Y) op2 Z. */
  order: number[];
  negs: B[];
  negOuter: B;
  op1: Op;
  op2: Op;
}
const NAMES3 = ['A', 'B', 'C'];

function litTex(spec: Spec, slot: number): string {
  const name = NAMES3[spec.order[slot]];
  return spec.negs[slot] ? `\\neg ${name}` : name;
}
function innerTex(spec: Spec): string {
  return `${litTex(spec, 0)} ${OP_TEX[spec.op1]} ${litTex(spec, 1)}`;
}
function leftTex(spec: Spec): string {
  return spec.negOuter ? `\\neg(${innerTex(spec)})` : `(${innerTex(spec)})`;
}
function exprTex(spec: Spec): string {
  return `${leftTex(spec)} ${OP_TEX[spec.op2]} ${litTex(spec, 2)}`;
}
function lit(spec: Spec, slot: number, row: B[]): B {
  const v = row[spec.order[slot]];
  return spec.negs[slot] ? !v : v;
}
function leftVal(spec: Spec, row: B[]): B {
  const v = applyOp(spec.op1, lit(spec, 0, row), lit(spec, 1, row));
  return spec.negOuter ? !v : v;
}
function evalSpec(spec: Spec, row: B[]): B {
  return applyOp(spec.op2, leftVal(spec, row), lit(spec, 2, row));
}
const countSpec = (spec: Spec): number => ROWS3.filter((r) => evalSpec(spec, r)).length;

/** Counts produced by genuine slips on this expression. */
function mistakePool(s: Spec, count: number): { v: number; why: string }[] {
  const pool: { v: number; why: string }[] = [];
  const anyNot = s.negs.some(Boolean) || s.negOuter;
  if (anyNot) {
    pool.push({
      v: countSpec({ ...s, negs: [false, false, false], negOuter: false }),
      why: 'This is the count you get if you ignore the NOT sign(s) and evaluate the expression without them.',
    });
  }
  s.negs.forEach((n, slot) => {
    if (!n) return;
    const negs = s.negs.slice();
    negs[slot] = false;
    pool.push({
      v: countSpec({ ...s, negs }),
      why: `This is what you get if you forget the NOT on $${NAMES3[s.order[slot]]}$ and use $${NAMES3[s.order[slot]]}$ itself.`,
    });
  });
  if (s.negOuter) {
    pool.push({
      v: countSpec({ ...s, negOuter: false }),
      why: 'This is what you get if you forget the NOT in front of the bracket: every bracket value comes out flipped.',
    });
    pool.push({
      v: countSpec({ ...s, negOuter: false, negs: [!s.negs[0], s.negs[1], s.negs[2]] }),
      why: 'This is what you get if the NOT in front of the bracket is applied only to the first variable instead of to the whole bracket.',
    });
  }
  pool.push({
    v: countSpec({ ...s, op1: CONFUSE[s.op1] }),
    why: `This is what you get if you read the ${OP_NAME[s.op1]} inside the bracket as ${OP_NAME[CONFUSE[s.op1]]}. Remember: ${OP_RULE[s.op1]}.`,
  });
  pool.push({
    v: countSpec({ ...s, op2: CONFUSE[s.op2] }),
    why: `This is what you get if you read the final ${OP_NAME[s.op2]} (outside the bracket) as ${OP_NAME[CONFUSE[s.op2]]}. Remember: ${OP_RULE[s.op2]}.`,
  });
  pool.push({ v: 8 - count, why: 'This is the number of rows where the expression is 0 (FALSE), not the number where it is 1.' });
  pool.push({
    v: ROWS3.filter((r) => leftVal(s, r)).length,
    why: `This counts the rows where the bracket alone is 1, forgetting to combine it with $${litTex(s, 2)}$ using ${OP_NAME[s.op2]}.`,
  });
  return pool;
}

const genCount: Generator = {
  id: 'gen-boolean-logic-truth-count',
  subtopic: 'boolean-logic',
  difficulty: 'exam',
  title: 'Count the true rows of a 3-variable truth table',
  generate(rng: Rng): GeneratedCore {
    const ops: Op[] = ['and', 'or', 'xor'];
    // XOR is only used inside the bracket: (anything) XOR (an independent variable) is always 1 in exactly
    // 4 rows, which makes the question trivial. Re-roll until the count is not 0 or 8 and at least three
    // genuinely different mistakes are available.
    let s: Spec;
    let count: number;
    let chosen: { v: number; why: string }[];
    for (let attempt = 0; ; attempt++) {
      s = {
        order: rng.shuffle([0, 1, 2]),
        negs: [rng.bool(0.3), rng.bool(0.3), rng.bool(0.3)],
        negOuter: rng.bool(0.35),
        op1: rng.pick(ops),
        op2: rng.pick(['and', 'or'] as Op[]),
      };
      count = countSpec(s);
      if (count === 0 || count === 8) continue;
      chosen = [];
      for (const c of rng.shuffle(mistakePool(s, count))) {
        if (chosen.length === 3) break;
        if (c.v === count || chosen.some((x) => x.v === c.v)) continue;
        chosen.push(c);
      }
      if (chosen.length === 3 || attempt > 200) break;
    }
    for (let k = 1; chosen.length < 3 && k <= 8; k++) {
      for (const v of [count + k, count - k]) {
        if (chosen.length === 3 || v < 0 || v > 8 || v === count || chosen.some((x) => x.v === v)) continue;
        chosen.push({ v, why: 'This count does not match a row-by-row evaluation: work through all 8 rows of the truth table, bracket first.' });
      }
    }
    const answer = String(count);

    // ---- solution with the full truth table
    const opsUsed = [...new Set([s.op1, s.op2])];
    const lines: string[] = [];
    lines.push(
      `There are 3 inputs, so the truth table has $2^3 = 8$ rows. Work out the bracket first${s.negOuter ? ' (including the NOT in front of it)' : ''}, then combine it with $${litTex(s, 2)}$.`,
    );
    lines.push(`Rules used: ${opsUsed.map((o) => OP_RULE[o]).join('; ')}${s.negs.some(Boolean) || s.negOuter ? '; $\\neg$ (NOT) flips 0 and 1' : ''}.`);
    const head = `| $A$ | $B$ | $C$ | $${leftTex(s)}$ | $Q$ |`;
    const sep = '| --- | --- | --- | --- | --- |';
    const body = ROWS3.map((r) => `| ${bit(r[0])} | ${bit(r[1])} | ${bit(r[2])} | ${bit(leftVal(s, r))} | ${bit(evalSpec(s, r))} |`).join('\n');
    lines.push(`${head}\n${sep}\n${body}`);
    lines.push(`Counting the 1s in the $Q$ column gives ${count} rows out of 8.`);
    lines.push(`Answer: ${answer}`);

    return {
      stem: `How many of the 8 rows of the truth table for $Q = ${exprTex(s)}$ give $Q = 1$? ($\\land$ = AND, $\\lor$ = OR, $\\oplus$ = XOR, $\\neg$ = NOT.)`,
      answer,
      answerValue: count,
      distractors: chosen.map((c) => ({ text: String(c.v), value: c.v, why: c.why })),
      solution: lines.join('\n\n'),
      keyIdea: 'Build the truth table one column at a time (NOTs, then the bracket, then the outer operation) and count the 1s.',
    };
  },
};

// ======================================================================= generator 2: De Morgan equivalence
interface Lit {
  v: number;
  neg: B;
}
type Mode = 'math' | 'python';
const MATH_NAMES = [
  ['A', 'B', 'C'],
  ['P', 'Q', 'R'],
  ['X', 'Y', 'Z'],
];
const PY_NAMES = [
  ['a', 'b', 'c'],
  ['x', 'y', 'z'],
  ['p', 'q', 'r'],
];

function renderLits(lits: Lit[], op: 'and' | 'or', mode: Mode, names: string[]): string {
  if (mode === 'math') return lits.map((l) => (l.neg ? `\\neg ${names[l.v]}` : names[l.v])).join(` ${OP_TEX[op]} `);
  return lits.map((l) => (l.neg ? `not ${names[l.v]}` : names[l.v])).join(` ${op} `);
}
function wrap(s: string, mode: Mode): string {
  return mode === 'math' ? `$${s}$` : `\`${s}\``;
}
/** Truth table over 3 variables of (lits joined by op), optionally negated as a whole. */
function ttLits(lits: Lit[], op: 'and' | 'or', negAll = false): string {
  return ROWS3.map((row) => {
    const vals = lits.map((l) => (l.neg ? !row[l.v] : row[l.v]));
    const r = op === 'and' ? vals.every(Boolean) : vals.some(Boolean);
    return bit(negAll ? !r : r);
  }).join('');
}

const genDeMorgan: Generator = {
  id: 'gen-boolean-logic-de-morgan',
  subtopic: 'boolean-logic',
  difficulty: 'exam',
  title: "Apply De Morgan's law to find an equivalent expression",
  generate(rng: Rng): GeneratedCore {
    const mode: Mode = rng.bool(0.5) ? 'math' : 'python';
    const names = rng.pick(mode === 'math' ? MATH_NAMES : PY_NAMES);
    const n = rng.bool(0.6) ? 2 : 3;
    const op: 'and' | 'or' = rng.bool(0.5) ? 'and' : 'or';
    const flip: 'and' | 'or' = op === 'and' ? 'or' : 'and';
    const lits: Lit[] = Array.from({ length: n }, (_, i) => ({ v: i, neg: rng.bool(0.4) }));
    const negLits = lits.map((l) => ({ ...l, neg: !l.neg }));

    const inner = renderLits(lits, op, mode, names);
    const original = mode === 'math' ? `\\neg(${inner})` : `not (${inner})`;
    const answerBody = renderLits(negLits, flip, mode, names);
    const answer = wrap(answerBody, mode);
    const answerValue = ttLits(lits, op, true);
    const opWord = (o: 'and' | 'or') => (mode === 'math' ? OP_NAME[o] : `\`${o}\``);

    const cand: { lits: Lit[]; op: 'and' | 'or'; why: string }[] = [
      {
        lits: negLits,
        op,
        why: `This negates every part but forgets the other half of De Morgan's law: ${opWord(op)} must also change to ${opWord(flip)}.`,
      },
      {
        lits,
        op: flip,
        why: `This swaps ${opWord(op)} for ${opWord(flip)} but forgets to negate each part inside the bracket.`,
      },
      {
        lits: [negLits[0], ...lits.slice(1)],
        op: flip,
        why: 'This applies the NOT only to the first part. When the NOT moves inside the bracket it must go onto **every** part.',
      },
      {
        lits: [...lits.slice(0, n - 1), negLits[n - 1]],
        op: flip,
        why: 'This applies the NOT only to the last part. When the NOT moves inside the bracket it must go onto **every** part.',
      },
      {
        lits: [negLits[0], ...lits.slice(1)],
        op,
        why: 'This treats the NOT as if it applied only to the first part, ignoring the brackets around the whole expression.',
      },
      {
        lits,
        op,
        why: 'This simply drops the NOT in front of the bracket, which turns every output into its opposite.',
      },
    ];

    const chosen: { text: string; value: string; why: string }[] = [];
    for (const c of cand) {
      if (chosen.length === 3) break;
      const value = ttLits(c.lits, c.op);
      const text = wrap(renderLits(c.lits, c.op, mode, names), mode);
      if (value === answerValue || text === answer) continue;
      if (chosen.some((x) => x.value === value || x.text === text)) continue;
      chosen.push({ text, value, why: c.why });
    }
    if (chosen.length < 3) throw new Error('de-morgan: not enough distractors');

    const doubleNeg = lits.some((l) => l.neg);
    const steps: string[] = [];
    if (mode === 'math') {
      steps.push(
        `**De Morgan's laws:** $\\neg(P \\land Q) = \\neg P \\lor \\neg Q$ and $\\neg(P \\lor Q) = \\neg P \\land \\neg Q$. To move a NOT inside a bracket, negate **every** part and swap AND with OR.`,
      );
      steps.push(`1. Start with $${original}$.`);
      steps.push(`2. Change ${OP_NAME[op]} ($${OP_TEX[op]}$) to ${OP_NAME[flip]} ($${OP_TEX[flip]}$).`);
      steps.push(
        `3. Negate each part: ${lits
          .map((l) => (l.neg ? `$\\neg\\neg ${names[l.v]} = ${names[l.v]}$` : `$${names[l.v]}$ becomes $\\neg ${names[l.v]}$`))
          .join(', ')}.${doubleNeg ? ' (Two NOTs cancel out.)' : ''}`,
      );
    } else {
      steps.push(
        "**De Morgan's laws in Python:** `not (p and q)` is the same as `not p or not q`, and `not (p or q)` is the same as `not p and not q`. Negate **every** part and swap `and` with `or`.",
      );
      steps.push(`1. Start with \`${original}\`.`);
      steps.push(`2. Change \`${op}\` to \`${flip}\`.`);
      steps.push(
        `3. Negate each part: ${lits
          .map((l) => (l.neg ? `\`not not ${names[l.v]}\` is just \`${names[l.v]}\`` : `\`${names[l.v]}\` becomes \`not ${names[l.v]}\``))
          .join(', ')}.${doubleNeg ? ' (Two `not`s cancel out.)' : ''}`,
      );
    }
    steps.push(`4. Result: ${answer}. Check one row: making every part of the original bracket ${op === 'and' ? 'true makes the original false, and it makes every negated part false, so the result is false too' : 'false makes the original true, and it makes every negated part true, so the result is true too'}.`);
    steps.push(`Answer: ${answer}`);

    const stem =
      mode === 'math'
        ? `Which expression is logically equivalent to $${original}$? ($\\land$ = AND, $\\lor$ = OR, $\\neg$ = NOT.)`
        : `In Python, \`${names.slice(0, n).join('`, `')}\` are Boolean variables. Which condition is equivalent to \`${original}\` for every combination of values?`;

    return {
      stem,
      answer,
      answerValue,
      distractors: chosen,
      solution: steps.join('\n\n'),
      keyIdea: "De Morgan: the NOT of an AND is the OR of the NOTs, and the NOT of an OR is the AND of the NOTs.",
    };
  },
};

// ======================================================================= generator 3: Python and/or return values
const genPyAndOr: Generator = {
  id: 'gen-boolean-logic-python-and-or',
  subtopic: 'boolean-logic',
  difficulty: 'exam',
  title: 'What Python and / or / not return',
  generate(rng: Rng): GeneratedCore {
    const x = rng.bool(0.35) ? 0 : rng.int(1, 9);
    const y = rng.bool(0.35) ? 0 : rng.int(1, 9);
    const notOf = rng.pick(['x', 'y'] as const);
    const nv = notOf === 'x' ? x : y;

    const andV = x ? y : x;
    const orV = x ? x : y;
    const notV = nv === 0 ? 'True' : 'False';
    const outStr = `${andV} ${orV} ${notV}`;
    const answer = `\`${outStr}\``;
    const pyBool = (v: number) => (v ? 'True' : 'False');

    const cand: { s: string; why: string }[] = [
      {
        s: `${pyBool(andV)} ${pyBool(orV)} ${notV}`,
        why: 'This assumes `and` and `or` always give `True` or `False`. In Python they return one of their operands (only `not` always returns a bool).',
      },
      {
        s: `${orV} ${andV} ${notV}`,
        why: 'This swaps the rules for `and` and `or`. `and` returns the first falsy value (or the last value if none is falsy); `or` returns the first truthy value (or the last value if none is truthy).',
      },
      {
        s: `${x} ${orV} ${notV}`,
        why: '`x and y` does not just return `x`. If `x` is truthy, `and` has to look at `y` and returns `y`; it only returns `x` when `x` is falsy (0).',
      },
      {
        s: `${andV} ${orV} ${-nv}`,
        why: '`not` is logical negation, not a minus sign: it returns `True` or `False`.',
      },
      {
        s: `${andV} ${orV} ${notV === 'True' ? 'False' : 'True'}`,
        why: 'This mixes up truthiness: 0 is falsy, so `not 0` is `True`, while any non-zero number is truthy, so `not` of it is `False`.',
      },
      {
        s: `${andV} ${y} ${notV}`,
        why: '`x or y` does not just return `y`. If `x` is truthy, `or` stops straight away and returns `x`.',
      },
    ];
    const chosen: { text: string; value: string; why: string }[] = [];
    for (const c of cand) {
      if (chosen.length === 3) break;
      if (c.s === outStr || chosen.some((d) => d.value === c.s)) continue;
      chosen.push({ text: `\`${c.s}\``, value: c.s, why: c.why });
    }
    if (chosen.length < 3) throw new Error('py-and-or: not enough distractors');

    const truth = (v: number) => (v ? `${v} is truthy` : '0 is falsy');
    const steps = [
      'In Python the number 0 is **falsy** and every other number is **truthy**. `and` and `or` return one of their operands:',
      '- `a and b`: if `a` is falsy, return `a`; otherwise return `b`.\n- `a or b`: if `a` is truthy, return `a`; otherwise return `b`.\n- `not a`: always `True` or `False`.',
      `1. \`x and y\` with \`x = ${x}\`: ${truth(x)}, so ${x ? `\`and\` moves on and returns \`y\`, which is \`${y}\`` : `\`and\` stops and returns \`x\`, which is \`${x}\``}.`,
      `2. \`x or y\`: ${truth(x)}, so ${x ? `\`or\` stops and returns \`x\`, which is \`${x}\`` : `\`or\` moves on and returns \`y\`, which is \`${y}\``}.`,
      `3. \`not ${notOf}\` with \`${notOf} = ${nv}\`: ${truth(nv)}, so the result is \`${notV}\`.`,
      `\`print\` separates its arguments with spaces. Answer: ${answer}`,
    ];

    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: `x = ${x}\ny = ${y}\nprint(x and y, x or y, not ${notOf})` },
      answer,
      answerValue: outStr,
      distractors: chosen,
      solution: steps.join('\n\n'),
      keyIdea: '`and` returns the first falsy operand (else the last one), `or` returns the first truthy operand (else the last one), and `not` always returns a bool.',
      python: { stdout: `${outStr}\n` },
    };
  },
};

export const generators: Generator[] = [genCount, genDeMorgan, genPyAndOr];
