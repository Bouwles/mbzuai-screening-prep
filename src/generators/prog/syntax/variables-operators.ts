import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { num } from '../../../lib/tex';

/** Integer division and remainder. */
const fdiv = (a: number, b: number): number => Math.floor(a / b);
const pmod = (a: number, b: number): number => a - b * Math.floor(a / b);

const m = (s: string) => `$${s}$`;

/** "= 4.6" or "\approx 3.29" style description of a / b. */
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

// ---------------------------------------------------------------- 1. div and mod
function genDivMod(rng: Rng): GeneratedCore {
  for (;;) {
    const a = rng.int(10, 99);
    const b = rng.int(2, 9);
    if (a % b === 0) continue;

    const q = fdiv(a, b);
    const r = pmod(a, b);
    const decimal = num(a / b, 2);
    const fraction = num(a / b - q, 2);
    const answerValue = `${q} ${r}`;
    const answer = `\`${answerValue}\``;

    const pool: Cand[] = [
      {
        text: `\`${r} ${q}\``,
        value: `${r} ${q}`,
        why: 'This has the two values the wrong way round: the first line prints `div(a,b)` (the quotient) and the second prints `mod(a,b)` (the remainder).',
      },
      {
        text: `\`${decimal} ${r}\``,
        value: `${decimal} ${r}`,
        why: `This uses ordinary division for the first value. \`div\` keeps only the whole-number part, ${q}.`,
      },
      {
        text: `\`${q} ${fraction}\``,
        value: `${q} ${fraction}`,
        why: `This treats \`mod\` as the decimal part of the division. \`mod\` is the whole-number remainder: ${m(`${a} - ${b} \\times ${q} = ${r}`)}.`,
      },
      {
        text: `\`${q + 1} ${b * (q + 1) - a}\``,
        value: `${q + 1} ${b * (q + 1) - a}`,
        why: `This rounds the division up to ${q + 1}. \`div\` drops the decimal part, so ${b} fits into ${a} only ${q} whole times.`,
      },
    ];
    const distractors = pickDistinct(answer, answerValue, pool);
    if (distractors.length < 3) continue;

    const solution =
      '`div(a,b)` is integer division: divide and keep only the whole-number part. `mod(a,b)` is the remainder left over, so that $a = b \\times q + r$.\n\n' +
      `1. ${m(`${a} \\div ${b} ${quotientTex(a, b)}`)}, and the whole-number part is ${m(`${q}`)}, so \`div(a,b)\` is \`${q}\`.\n` +
      `2. Remainder: ${m(`${a} - ${b} \\times ${q} = ${r}`)}, so \`mod(a,b)\` is \`${r}\`.\n` +
      `3. Check: ${m(`${b} \\times ${q} + ${r} = ${a}`)}.\n\n` +
      `Answer: ${answer}`;

    return {
      stem: 'What does this pseudocode print? Output lines are shown separated by a space.',
      code: {
        lang: 'pseudocode',
        source: `a = ${a}\nb = ${b}\nprint(div(a,b)) // div is integer division\nprint(mod(a,b)) // mod is the modulus operator`,
      },
      answer,
      answerValue,
      distractors,
      solution,
      keyIdea: '`div(a,b)` is how many whole times b fits into a, and `mod(a,b)` is what is left over, so $a = b \\times q + r$.',
    };
  }
}

// ---------------------------------------------------------------- 2. operator precedence
interface Built {
  stem: string;
  source: string;
  answer: number;
  steps: string[];
  pool: { value: number; why: string }[];
}

function buildPowTemplate(rng: Rng): Built | null {
  const a = rng.int(1, 9);
  const b = rng.int(2, 6);
  const c = rng.int(2, 5);
  const c2 = c * c;
  const prod = b * c2;
  const ans = a + prod;
  return {
    stem: 'In this pseudocode, `^` means "to the power of". What is printed?',
    source: `print(${a} + ${b} * ${c} ^ 2)`,
    answer: ans,
    steps: [
      `Power first: \`${c} ^ 2\` is \`${c2}\`. The expression is now \`${a} + ${b} * ${c2}\`.`,
      `Then multiply: \`${b} * ${c2}\` is \`${prod}\`.`,
      `Add last: ${m(`${a} + ${prod} = ${ans}`)}.`,
    ],
    pool: [
      {
        value: (a + b) * c2,
        why: `This adds first: ${m(`(${a} + ${b}) \\times ${c2} = ${(a + b) * c2}`)}. Multiplication comes before addition.`,
      },
      {
        value: a + (b * c) ** 2,
        why: `This multiplies before squaring: ${m(`${a} + (${b} \\times ${c})^2 = ${a + (b * c) ** 2}`)}. The power applies only to the ${c}.`,
      },
      {
        value: (a + b * c) ** 2,
        why: `This squares everything to its left: ${m(`(${a} + ${b} \\times ${c})^2 = ${(a + b * c) ** 2}`)}. The power applies only to the ${c}.`,
      },
      {
        value: a + b * c * 2,
        why: `This reads \`^ 2\` as "times 2": ${m(`${a} + ${b} \\times ${c} \\times 2 = ${a + b * c * 2}`)}. \`^\` means "to the power of".`,
      },
    ],
  };
}

function buildModTemplate(rng: Rng): Built | null {
  const a = rng.int(20, 60);
  const b = rng.int(10, 40);
  const c = rng.int(3, 7);
  const d = rng.int(2, 5);
  const r = pmod(b, c);
  if (r === 0) return null;
  const ans = a - r * d;
  return {
    stem: 'What does this pseudocode print?',
    source: `print(${a} - mod(${b},${c}) * ${d}) // mod is the modulus operator`,
    answer: ans,
    steps: [
      `Function calls are worked out first. \`mod(${b},${c})\`: ${m(`${b} = ${fdiv(b, c)} \\times ${c} + ${r}`)}, so the remainder is \`${r}\`.`,
      `Multiply before subtracting: \`${r} * ${d}\` is \`${r * d}\`.`,
      `Subtract last: ${m(`${a} - ${r * d} = ${ans}`)}.`,
    ],
    pool: [
      {
        value: (a - r) * d,
        why: `This subtracts first: ${m(`(${a} - ${r}) \\times ${d} = ${(a - r) * d}`)}. Multiplication comes before subtraction.`,
      },
      {
        value: a - fdiv(b, c) * d,
        why: `This uses the quotient ${fdiv(b, c)} instead of the remainder, giving ${m(`${a} - ${fdiv(b, c)} \\times ${d}`)}. \`mod\` gives what is **left over**: ${r}.`,
      },
      {
        value: a - pmod(c, b) * d,
        why: `This swaps the inputs and works out \`mod(${c},${b})\`, which is just ${c}. The remainder of ${b} divided by ${c} is ${r}.`,
      },
      {
        value: a - r,
        why: `This forgets the \`* ${d}\` and works out ${m(`${a} - ${r}`)}.`,
      },
    ],
  };
}

function buildUpdateTemplate(rng: Rng): Built | null {
  const a = rng.int(2, 12);
  const b = rng.int(2, 6);
  const c = rng.int(2, 6);
  const d = rng.pick([2, 4, 5, 8]);
  const total = a + b * c;
  if (total % d === 0) return null;
  const ans = fdiv(total, d);
  return {
    stem: 'What does this pseudocode print?',
    source: `x = ${a}\nx = x + ${b} * ${c}\nx = div(x,${d}) // div is integer division\nprint(x)`,
    answer: ans,
    steps: [
      `\`x = x + ${b} * ${c}\`: multiply first, ${m(`${b} \\times ${c} = ${b * c}`)}, then add to the current \`x\`: ${m(`${a} + ${b * c} = ${total}`)}.`,
      `\`x = div(x,${d})\`: ${m(`${total} \\div ${d} ${quotientTex(total, d)}`)}, and the whole-number part is \`${ans}\`.`,
      `\`print(x)\` shows \`${ans}\`.`,
    ],
    pool: [
      {
        value: fdiv((a + b) * c, d),
        why: `This works left to right, ${m(`(${a} + ${b}) \\times ${c} = ${(a + b) * c}`)}, and then uses \`div\`. Multiplication comes before addition.`,
      },
      {
        value: total / d,
        why: `This uses ordinary division, ${m(`${total} \\div ${d} = ${num(total / d)}`)}. \`div\` keeps only the whole-number part.`,
      },
      {
        value: a + fdiv(b * c, d),
        why: `This divides only the ${b * c} that was added, not the whole of \`x\`. \`div(x,${d})\` uses the current value of \`x\`, which is ${total}.`,
      },
      {
        value: total,
        why: `This is the value of \`x\` before the line \`x = div(x,${d})\`, forgetting to apply it.`,
      },
    ],
  };
}

function genPrecedence(rng: Rng): GeneratedCore {
  for (;;) {
    const kind = rng.pick(['pow', 'mod', 'update'] as const);
    const built = kind === 'pow' ? buildPowTemplate(rng) : kind === 'mod' ? buildModTemplate(rng) : buildUpdateTemplate(rng);
    if (!built) continue;
    const answerValue = built.answer;
    const answer = `\`${answerValue}\``;
    const pool: Cand[] = built.pool
      .filter((c) => Number.isFinite(c.value))
      .map((c) => ({ text: `\`${c.value}\``, value: c.value, why: c.why }));
    const distractors = pickDistinct(answer, answerValue, pool);
    if (distractors.length < 3) continue;
    const solution =
      (kind === 'update'
        ? 'Each line works out its right-hand side using the current value of `x`, then stores the result back in `x`.\n\n'
        : 'The order of operations is brackets and function calls, then `^`, then `*` and `/`, then `+` and `-`.\n\n') +
      built.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') +
      `\n\nAnswer: ${answer}`;
    return {
      stem: built.stem,
      code: { lang: 'pseudocode', source: built.source },
      answer,
      answerValue,
      distractors,
      solution,
      keyIdea:
        kind === 'update'
          ? 'Work out the right-hand side first, using the current value of x, then overwrite x.'
          : 'Precedence: powers first, then multiplication and division, then addition and subtraction.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-variables-operators-floor-mod',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    title: 'Integer division and remainder with div and mod',
    generate: genDivMod,
  },
  {
    id: 'gen-variables-operators-precedence',
    subtopic: 'variables-operators',
    difficulty: 'exam',
    title: 'Evaluate an expression using operator precedence',
    generate: genPrecedence,
  },
];
