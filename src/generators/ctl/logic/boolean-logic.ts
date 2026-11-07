import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps, table } from '../../../lib/explanation';

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

    // ---- solution: the rules, one worked row, then the full truth table
    const opsUsed = [...new Set([s.op1, s.op2])];
    const usesNot = s.negs.some(Boolean) || s.negOuter;
    const eg = ROWS3[5]; // A = 1, B = 0, C = 1
    const v0 = lit(s, 0, eg);
    const v1 = lit(s, 1, eg);
    const v2 = lit(s, 2, eg);
    const inside = applyOp(s.op1, v0, v1);
    const leftEg = leftVal(s, eg);
    const qEg = evalSpec(s, eg);
    const solution = steps(
      'The inputs $A$, $B$ and $C$ can each be 0 or 1, so the truth table has $2 \\times 2 \\times 2 = 8$ rows.',
      `Here is what the symbols do. ${opsUsed.map((o) => `${OP_RULE[o]}.`).join(' ')}${usesNot ? ' $\\neg$ (NOT) flips a value: 0 becomes 1, and 1 becomes 0.' : ''}`,
      `Work from the inside out. Find the bracket first${s.negOuter ? ', including the NOT in front of it' : ''}. Then combine it with $${litTex(s, 2)}$ using ${OP_NAME[s.op2]}.`,
      `Try one row: $A = 1$, $B = 0$, $C = 1$. Here $${litTex(s, 0)}$ is ${bit(v0)} and $${litTex(s, 1)}$ is ${bit(v1)}, so $${innerTex(s)}$ is $${bit(v0)} ${OP_TEX[s.op1]} ${bit(v1)} = ${bit(inside)}$.${s.negOuter ? ` The NOT in front flips that to ${bit(leftEg)}.` : ''} Also $${litTex(s, 2)}$ is ${bit(v2)}, so $Q = ${bit(leftEg)} ${OP_TEX[s.op2]} ${bit(v2)} = ${bit(qEg)}$.`,
      `Do the same for all 8 rows, then count the 1s in the $Q$ column. There are ${count}:\n\n${table(
        ['$A$', '$B$', '$C$', `$${leftTex(s)}$`, '$Q$'],
        ROWS3.map((r) => [bit(r[0]), bit(r[1]), bit(r[2]), bit(leftVal(s, r)), bit(evalSpec(s, r))]),
      )}`,
    );

    return {
      stem: `How many of the 8 rows of the truth table for $Q = ${exprTex(s)}$ give $Q = 1$? ($\\land$ = AND, $\\lor$ = OR, $\\oplus$ = XOR, $\\neg$ = NOT.)`,
      answer,
      answerValue: count,
      distractors: chosen.map((c) => ({ text: String(c.v), value: c.v, why: c.why })),
      asking: 'In how many of the 8 rows does $Q$ come out as 1?',
      solution,
      conclusion: `Counting the 1s in the $Q$ column gives ${answer} out of the 8 rows.`,
      keyIdea: 'Build the truth table one column at a time: list all the input rows, work out the NOTs, then the bracket, then the outer gate. Count the 1s in the last column. With $n$ inputs there are $2^n$ rows.',
    };
  },
};

// ======================================================================= generator 2: De Morgan equivalence
interface Lit {
  v: number;
  neg: B;
}
type Mode = 'math' | 'code';
const MATH_NAMES = [
  ['A', 'B', 'C'],
  ['P', 'Q', 'R'],
  ['X', 'Y', 'Z'],
];
const CODE_NAMES = [
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
    const mode: Mode = rng.bool(0.5) ? 'math' : 'code';
    const names = rng.pick(mode === 'math' ? MATH_NAMES : CODE_NAMES);
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
    const whyLaw =
      op === 'and'
        ? `Why? An ${opWord('and')} is false as soon as any one part is false. So the opposite of an ${opWord('and')} is an ${opWord('or')} of opposites.`
        : `Why? An ${opWord('or')} is false only when every part is false. So the opposite of an ${opWord('or')} is an ${opWord('and')} of opposites.`;
    const check =
      op === 'and'
        ? 'Test it: when every part of the original bracket is true, the original is false, and every flipped part is false, so this is false too.'
        : 'Test it: when every part of the original bracket is false, the original is true, and every flipped part is true, so this is true too.';
    const solution =
      mode === 'math'
        ? steps(
            `$\\neg$ (NOT) in front of a bracket flips the whole result. To move it inside, use **De Morgan's laws**: $\\neg(P \\land Q) = \\neg P \\lor \\neg Q$ and $\\neg(P \\lor Q) = \\neg P \\land \\neg Q$.`,
            whyLaw,
            `First change: the ${OP_NAME[op]} ($${OP_TEX[op]}$) becomes ${OP_NAME[flip]} ($${OP_TEX[flip]}$).`,
            `Second change: flip every part. ${lits
              .map((l) => (l.neg ? `$\\neg\\neg ${names[l.v]}$ is just $${names[l.v]}$` : `$${names[l.v]}$ becomes $\\neg ${names[l.v]}$`))
              .join(', ')}.${doubleNeg ? ' Two NOTs cancel out, because flipping twice returns the original value.' : ''}`,
            `Join the flipped parts with ${OP_NAME[flip]}, which gives ${answer}. ${check}`,
          )
        : steps(
            `\`not\` in front of a bracket flips the whole result. To move it inside, use **De Morgan's laws**: \`not (p and q)\` is the same as \`not p or not q\`, and \`not (p or q)\` is the same as \`not p and not q\`.`,
            whyLaw,
            `First change: the \`${op}\` becomes \`${flip}\`.`,
            `Second change: flip every part. ${lits
              .map((l) => (l.neg ? `\`not not ${names[l.v]}\` is just \`${names[l.v]}\`` : `\`${names[l.v]}\` becomes \`not ${names[l.v]}\``))
              .join(', ')}.${doubleNeg ? ' Two `not`s cancel out, because flipping twice returns the original value.' : ''}`,
            `Join the flipped parts with \`${flip}\`, which gives ${answer}. ${check}`,
          );

    const stem =
      mode === 'math'
        ? `Which expression is logically equivalent to $${original}$? ($\\land$ = AND, $\\lor$ = OR, $\\neg$ = NOT.)`
        : `\`${names.slice(0, n).join('`, `')}\` are Boolean variables. Which condition is equivalent to \`${original}\` for every combination of values?`;

    return {
      stem,
      answer,
      answerValue,
      distractors: chosen,
      asking: mode === 'math' ? `Which expression gives the same result as ${wrap(original, mode)} for all values?` : `Which condition gives the same result as ${wrap(original, mode)} for all values?`,
      solution,
      conclusion: `Swapping ${opWord(op)} for ${opWord(flip)} and flipping every part gives ${answer}.`,
      keyIdea: "De Morgan's law: to move a NOT inside a bracket, flip every part and swap AND with OR. Two NOTs on one letter cancel. To test an option, try one set of values in both expressions.",
    };
  },
};

export const generators: Generator[] = [genCount, genDeMorgan];
