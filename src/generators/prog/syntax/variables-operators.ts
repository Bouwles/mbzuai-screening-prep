import type { GeneratedCore, Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps } from '../../../lib/explanation';
import { num } from '../../../lib/tex';

/** Integer division and remainder. */
const fdiv = (a: number, b: number): number => Math.floor(a / b);
const pmod = (a: number, b: number): number => a - b * Math.floor(a / b);

const m = (s: string) => `$${s}$`;

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

    return {
      stem: 'What does this pseudocode print? Output lines are shown separated by a space.',
      code: {
        lang: 'pseudocode',
        source: `a = ${a}\nb = ${b}\nprint(div(a,b)) // div is integer division\nprint(mod(a,b)) // mod is the modulus operator`,
      },
      answer,
      answerValue,
      distractors,
      asking: `What are \`div(a,b)\` and \`mod(a,b)\` when \`a\` is ${a} and \`b\` is ${b}?`,
      solution: steps(
        '`div(a,b)` asks how many whole times `b` fits into `a`, and throws away any decimal part. `mod(a,b)` asks what is left over after that. The leftover is called the **remainder**.',
        `Find the biggest multiple of ${b} that fits in ${a}. ${m(`${b} \\times ${q} = ${b * q}`)} fits, but ${m(`${b} \\times ${q + 1} = ${b * (q + 1)}`)} is too big. So ${b} fits ${q} whole times, and line 3 prints ${q}.`,
        `The leftover is ${m(`${a} - ${b * q} = ${r}`)}, so line 4 prints ${r}.`,
      ),
      conclusion: `Line 3 prints ${q} and line 4 prints ${r}, so the output is ${answer}.`,
      keyIdea: 'For `div(a,b)` and `mod(a,b)`, find the biggest multiple of `b` that fits in `a`. How many times `b` fits is the `div`. The gap between that multiple and `a` is the `mod`.',
    };
  }
}

// ---------------------------------------------------------------- 2. operator precedence
interface Built {
  stem: string;
  source: string;
  answer: number;
  asking: string;
  steps: string[];
  because: string;
  keyIdea: string;
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
    asking: `What is ${m(`${a} + ${b} \\times ${c}^2`)} when the operations are done in the right order?`,
    steps: [
      'Operations are not simply done left to right. The order is powers first, then `*` and `/`, then `+` and `-`.',
      `Do the power first. \`${c} ^ 2\` means ${m(`${c} \\times ${c} = ${c2}`)}. It applies only to the ${c} right next to it. Now we have ${m(`${a} + ${b} \\times ${c2}`)}.`,
      `Next, multiply: ${m(`${b} \\times ${c2} = ${prod}`)}. Now we have ${m(`${a} + ${prod}`)}.`,
      `Add last: ${m(`${a} + ${prod} = ${ans}`)}.`,
    ],
    because: 'Following the order power, multiply, add',
    keyIdea: 'For a long expression, rewrite it once per operation: powers, then `*` and `/`, then `+` and `-`. Each `^` applies only to the number directly before it.',
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
    asking: `What is ${a} minus ${d} times the remainder of ${m(`${b} \\div ${c}`)}?`,
    steps: [
      `\`mod(${b},${c})\` is the remainder, which is what is left over after dividing ${b} by ${c}. ${c} goes ${fdiv(b, c)} whole times into ${b}, using up ${c * fdiv(b, c)}, and ${m(`${b} - ${c * fdiv(b, c)} = ${r}`)}.`,
      `Function calls are worked out first, so the expression becomes \`${a} - ${r} * ${d}\`.`,
      `Multiplication comes before subtraction: ${m(`${r} \\times ${d} = ${r * d}`)}. That leaves ${m(`${a} - ${r * d}`)}.`,
      `Subtract last: ${m(`${a} - ${r * d} = ${ans}`)}.`,
    ],
    because: 'Doing the `mod`, then the `*`, then the `-`',
    keyIdea: 'The order in any expression is function calls such as `mod` and `div`, then `*` and `/`, then `+` and `-`. Rewrite the expression after each operation so nothing gets missed.',
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
    asking: 'What does `x` hold after lines 2 and 3 have changed it?',
    steps: [
      'Each line works out its right side using the current `x`, then stores the result back in `x`. The old value is replaced.',
      `Line 2: multiplication comes before addition, so ${m(`${b} \\times ${c} = ${b * c}`)} first. Then add the current \`x\`: ${m(`${a} + ${b * c} = ${total}`)}. So \`x\` is now ${total}.`,
      `Line 3: \`div\` is how many whole times one number fits into another. ${m(`${d} \\times ${ans} = ${d * ans}`)} fits into ${total}, but ${m(`${d} \\times ${ans + 1} = ${d * (ans + 1)}`)} is too big. So \`x\` becomes ${ans}, and line 4 prints it.`,
    ],
    because: 'Working through the lines in order',
    keyIdea: 'When a variable is overwritten line after line, work out each right side with its newest value, then replace it. Multiply before adding, and `div` keeps only the whole-number part.',
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
    return {
      stem: built.stem,
      code: { lang: 'pseudocode', source: built.source },
      answer,
      answerValue,
      distractors,
      asking: built.asking,
      solution: steps(...built.steps),
      conclusion: `${built.because} gives ${answerValue < 0 ? m(String(answerValue)) : answerValue}, so the answer is ${answer}.`,
      keyIdea: built.keyIdea,
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
