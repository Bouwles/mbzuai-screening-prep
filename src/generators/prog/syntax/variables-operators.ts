import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { num } from '../../../lib/tex';

/** Python-style floor division and modulo. */
const fdiv = (a: number, b: number): number => Math.floor(a / b);
const pmod = (a: number, b: number): number => a - b * Math.floor(a / b);
/** Truncating (C / Java style) division and remainder. */
const tdiv = (a: number, b: number): number => Math.trunc(a / b) + 0;
const tmod = (a: number, b: number): number => a - b * tdiv(a, b);

const m = (s: string) => `$${s}$`;

/** Number in brackets if negative, for maths steps. */
const p = (x: number): string => (x < 0 ? `(${x})` : `${x}`);
/** "= -4.6" or "\approx -3.29" style description of a / b. */
function quotientTex(a: number, b: number): string {
  const v = a / b;
  // Exact to 3 d.p. (e.g. 21 / 8 = 2.625) is shown exactly; recurring decimals are rounded to 2 d.p.
  const exact = Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9;
  return exact ? `= ${num(v, 3)}` : `\\approx ${num(v, 2)}`;
}

type Cand = { text: string; value: number | string; why: string };

/** Up to 3 candidates that differ from the answer and from each other, by value and by rendered text. */
function pickDistinct(answerText: string, answerValue: number | string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  const key = (t: string) => t.replace(/[`\s]/g, '');
  for (const c of pool) {
    if (out.length === 3) break;
    if (String(c.value) === String(answerValue) || key(c.text) === key(answerText)) continue;
    if (out.some((o) => String(o.value) === String(c.value) || key(o.text) === key(c.text))) continue;
    out.push(c);
  }
  return out;
}

// ---------------------------------------------------------------- 1. // and % with a negative number
function genFloorMod(rng: Rng): GeneratedCore {
  for (;;) {
    const negDivisor = rng.bool(0.35);
    const absA = rng.int(10, 60);
    const absB = rng.int(2, 9);
    if (absA % absB === 0) continue;
    const a = negDivisor ? absA : -absA;
    const b = negDivisor ? -absB : absB;

    const q = fdiv(a, b);
    const r = pmod(a, b);
    const tq = tdiv(a, b);
    const tr = tmod(a, b);
    const aq = fdiv(absA, absB);
    const ar = pmod(absA, absB);
    const answerValue = `${q} ${r}`;
    const answer = `\`${answerValue}\``;

    const pool: Cand[] = [
      {
        text: `\`${tq} ${tr}\``,
        value: `${tq} ${tr}`,
        why: `This rounds ${m(`${a} \\div ${p(b)}`)} towards zero and gives the remainder the sign of ${m(`${a}`)}, which is how C and Java work. Python's \`//\` rounds **down**, and \`%\` takes the sign of the divisor ${m(`${b}`)}.`,
      },
      {
        text: `\`${q} ${tr}\``,
        value: `${q} ${tr}`,
        why: `The quotient is right, but the remainder has the wrong sign: ${m(`${p(b)} \\times ${p(q)} + ${p(tr)} = ${b * q + tr}`)}, not ${m(`${a}`)}. In Python the remainder takes the sign of the divisor.`,
      },
      {
        text: `\`${tq} ${r}\``,
        value: `${tq} ${r}`,
        why: `This rounds the quotient towards zero (to ${m(`${tq}`)}). Python rounds **down** on the number line, which for a negative result means away from zero: ${m(`${q}`)}.`,
      },
      {
        text: `\`${aq} ${ar}\``,
        value: `${aq} ${ar}`,
        why: `This ignores the minus sign and works out ${m(`${absA} \\div ${absB}`)} instead. The sign changes both the quotient and the remainder.`,
      },
      {
        text: `\`${r} ${q}\``,
        value: `${r} ${q}`,
        why: 'This has the two values the wrong way round: the first value printed is `a // b` (the quotient) and the second is `a % b` (the remainder).',
      },
    ];
    const distractors = pickDistinct(answer, answerValue, pool);
    if (distractors.length < 3) continue;

    const solution =
      'Python\'s `//` divides and rounds **down** (towards minus infinity). Then `%` is whatever is left over, so that `a == b * (a // b) + a % b`.\n\n' +
      `1. ${m(`${a} \\div ${p(b)} ${quotientTex(a, b)}`)}. Rounding **down** gives ${m(`${q}`)}, so \`a // b\` is \`${q}\`.\n` +
      `2. Remainder: ${m(`${a} - ${p(b)} \\times ${p(q)} = ${a} - ${p(b * q)} = ${r}`)}, so \`a % b\` is \`${r}\`.\n` +
      `3. Check: ${m(`${p(b)} \\times ${p(q)} + ${p(r)} = ${a}`)}. The remainder has the same sign as the divisor ${m(`${b}`)}.\n\n` +
      `Answer: ${answer}`;

    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: `a = ${a}\nb = ${b}\nprint(a // b, a % b)` },
      answer,
      answerValue,
      distractors,
      solution,
      keyIdea: 'In Python `//` always rounds down and `%` takes the sign of the divisor, so `a == b*(a//b) + a%b`.',
      python: { stdout: `${answerValue}\n` },
    };
  }
}

// ---------------------------------------------------------------- 2. operator precedence
interface Built {
  source: string;
  answer: number;
  steps: string[];
  pool: { value: number; why: string }[];
}

function buildPowTemplate(rng: Rng): Built | null {
  const a = rng.int(1, 9);
  const b = rng.int(2, 6);
  const c = rng.int(2, 5);
  const d = rng.pick([2, 4, 5, 8]);
  const c2 = c * c;
  const prod = b * c2;
  if (prod % d === 0) return null;
  const q = fdiv(prod, d);
  const ans = a + q;
  return {
    source: `print(${a} + ${b} * ${c} ** 2 // ${d})`,
    answer: ans,
    steps: [
      `\`**\` first: \`${c} ** 2\` is \`${c2}\`. The expression is now \`${a} + ${b} * ${c2} // ${d}\`.`,
      `\`*\` and \`//\` have equal rank, so go left to right: \`${b} * ${c2}\` is \`${prod}\`, then \`${prod} // ${d}\` is \`${q}\` (because ${m(`${prod} \\div ${d} = ${num(prod / d)}`)}, rounded down).`,
      `\`+\` last: ${m(`${a} + ${q} = ${ans}`)}.`,
    ],
    pool: [
      {
        value: fdiv(((a + b) * c) ** 2, d),
        why: `This works strictly left to right like a basic calculator: ${m(`${a} + ${b} = ${a + b}`)}, ${m(`${a + b} \\times ${c} = ${(a + b) * c}`)}, ${m(`${(a + b) * c}^2 = ${((a + b) * c) ** 2}`)}, then \`// ${d}\` gives ${fdiv(((a + b) * c) ** 2, d)}. Python does \`**\` first and \`+\` last.`,
      },
      {
        value: a + fdiv((b * c) ** 2, d),
        why: `This multiplies before squaring, ${m(`(${b} \\times ${c})^2 = ${(b * c) ** 2}`)}, then \`${(b * c) ** 2} // ${d}\` is ${fdiv((b * c) ** 2, d)} and adding ${a} gives ${a + fdiv((b * c) ** 2, d)}. But \`**\` binds tighter than \`*\`, so only the ${c} is squared.`,
      },
      {
        value: a + prod / d,
        why: `This uses true division, ${m(`${prod} \\div ${d} = ${num(prod / d)}`)}, and then adds ${a}. The operator is \`//\`, which rounds down to a whole number.`,
      },
      {
        value: a + b * fdiv(c2, d),
        why: `This does \`${c2} // ${d}\` (which is ${fdiv(c2, d)}) before the multiplication, giving ${m(`${a} + ${b} \\times ${fdiv(c2, d)}`)}. \`*\` and \`//\` have equal rank, so they are worked left to right: multiply first, then divide.`,
      },
    ],
  };
}

function buildModTemplate(rng: Rng): Built | null {
  const a = rng.int(20, 60);
  const b = rng.int(10, Math.min(40, a - 2));
  const c = rng.int(3, 7);
  const d = rng.int(2, 5);
  const r = pmod(b, c);
  if (r === 0) return null;
  const ans = a - r * d;
  return {
    source: `print(${a} - ${b} % ${c} * ${d})`,
    answer: ans,
    steps: [
      `There is no \`**\`. \`%\` and \`*\` have equal rank, higher than \`-\`, so do them first, left to right.`,
      `\`${b} % ${c}\`: ${m(`${b} = ${fdiv(b, c)} \\times ${c} + ${r}`)}, so the remainder is \`${r}\`.`,
      `\`${r} * ${d}\` is \`${r * d}\`.`,
      `\`-\` last: ${m(`${a} - ${r * d} = ${ans}`)}.`,
    ],
    pool: [
      {
        value: pmod(a - b, c) * d,
        why: `This works left to right and subtracts first: ${m(`${a} - ${b} = ${a - b}`)}, then \`${a - b} % ${c}\` is ${pmod(a - b, c)}, and times ${d} gives ${pmod(a - b, c) * d}. But \`%\` and \`*\` come before \`-\`.`,
      },
      {
        value: a - pmod(b, c * d),
        why: `This multiplies ${m(`${c} \\times ${d} = ${c * d}`)} before taking the remainder, so it works out \`${b} % ${c * d}\` as ${pmod(b, c * d)} and then ${m(`${a} - ${pmod(b, c * d)}`)}. \`%\` and \`*\` have equal rank and go left to right, so \`${b} % ${c}\` is done first.`,
      },
      {
        value: a - fdiv(b, c) * d,
        why: `This uses the quotient \`${b} // ${c} = ${fdiv(b, c)}\` instead of the remainder, giving ${m(`${a} - ${fdiv(b, c)} \\times ${d}`)}. \`%\` gives what is **left over**: ${r}.`,
      },
      {
        value: a - pmod(c, b) * d,
        why: `This works out \`${c} % ${b}\` (the numbers the wrong way round), which is just ${c}, giving ${m(`${a} - ${c} \\times ${d}`)}. The remainder of ${b} divided by ${c} is ${r}.`,
      },
    ],
  };
}

function buildAugTemplate(rng: Rng): Built | null {
  const a = rng.int(2, 12);
  const b = rng.int(2, 6);
  const c = rng.int(2, 6);
  const d = rng.pick([2, 4, 5, 8]);
  const total = a + b * c;
  if (total % d === 0) return null;
  const ans = fdiv(total, d);
  return {
    source: `x = ${a}\nx += ${b} * ${c}\nx //= ${d}\nprint(x)`,
    answer: ans,
    steps: [
      `\`x += ${b} * ${c}\` means \`x = x + (${b} * ${c})\`: the whole right-hand side is worked out first, ${m(`${b} \\times ${c} = ${b * c}`)}, then added: ${m(`${a} + ${b * c} = ${total}`)}.`,
      `\`x //= ${d}\` means \`x = x // ${d}\`: ${m(`${total} \\div ${d} ${quotientTex(total, d)}`)}, rounded down gives \`${ans}\`.`,
      `\`print(x)\` shows \`${ans}\`.`,
    ],
    pool: [
      {
        value: fdiv((a + b) * c, d),
        why: `This reads \`x += ${b} * ${c}\` as "add ${b}, then multiply by ${c}", giving ${m(`(${a} + ${b}) \\times ${c} = ${(a + b) * c}`)} and then \`${(a + b) * c} // ${d}\`. The right-hand side ${m(`${b} \\times ${c}`)} is worked out first and then added to x.`,
      },
      {
        value: total / d,
        why: `This uses true division, ${m(`${total} \\div ${d} = ${num(total / d)}`)}. \`//=\` uses floor division, which rounds down to a whole number.`,
      },
      {
        value: a + fdiv(b * c, d),
        why: `This only divides the ${b * c} that was added (${m(`${b * c} \\div ${d}`)} rounded down is ${fdiv(b * c, d)}, then adding ${a} gives ${a + fdiv(b * c, d)}), not the whole of x. \`x //= ${d}\` divides the current value of x, which is ${total}.`,
      },
      {
        value: total,
        why: `This is the value of x before the line \`x //= ${d}\`, forgetting to apply the floor division.`,
      },
    ],
  };
}

function genPrecedence(rng: Rng): GeneratedCore {
  for (;;) {
    const kind = rng.pick(['pow', 'mod', 'aug'] as const);
    const built = kind === 'pow' ? buildPowTemplate(rng) : kind === 'mod' ? buildModTemplate(rng) : buildAugTemplate(rng);
    if (!built) continue;
    const answerValue = built.answer;
    const answer = `\`${answerValue}\``;
    const pool: Cand[] = built.pool
      .filter((c) => Number.isFinite(c.value))
      .map((c) => ({ text: `\`${c.value}\``, value: c.value, why: c.why }));
    const distractors = pickDistinct(answer, answerValue, pool);
    if (distractors.length < 3) continue;
    const solution =
      (kind === 'aug'
        ? 'Each augmented assignment `x op= y` means `x = x op (y)`, using the current value of `x`.\n\n'
        : 'Python\'s order of operations (highest first): brackets, then `**`, then `*`, `/`, `//`, `%` (equal rank, left to right), then `+` and `-` (left to right).\n\n') +
      built.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') +
      `\n\nAnswer: ${answer}`;
    return {
      stem: 'What does this Python code print?',
      code: { lang: 'python', source: built.source },
      answer,
      answerValue,
      distractors,
      solution,
      keyIdea:
        kind === 'aug'
          ? '`x op= expr` works out the whole right-hand side first, then combines it with the current x.'
          : 'Precedence: `**` first, then `* / // %` left to right, then `+ -` left to right.',
      python: { stdout: `${answerValue}\n` },
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-variables-operators-floor-mod',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    title: 'Floor division and modulo with a negative number',
    generate: genFloorMod,
  },
  {
    id: 'gen-variables-operators-precedence',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    title: 'Evaluate an expression using operator precedence',
    generate: genPrecedence,
  },
];
