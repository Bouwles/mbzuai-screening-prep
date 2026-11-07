import type { Generator, GeneratedCore } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { steps } from '../../../lib/explanation';
import { signed } from '../../../lib/tex';

// ---------------------------------------------------------------- alphabet helpers
const pos = (ch: string): number => ch.charCodeAt(0) - 64;
/** Letter at a position 1..26 (no wrapping). */
const L = (n: number): string => String.fromCharCode(64 + n);
/** Letter at any position, wrapping round the alphabet (27 -> A, 0 -> Z). */
const wrapL = (n: number): string => L(((((n - 1) % 26) + 26) % 26) + 1);
const shiftWord = (w: string, k: number): string =>
  w
    .split('')
    .map((c) => wrapL(pos(c) + k))
    .join('');

const places = (n: number): string => (n === 1 ? '1 place' : `${n} places`);

type Cand = { text: string; value: number | string; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by text). */
function pickDistinct(answerText: string, answerValue: number | string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.value === answerValue || c.text === answerText) continue;
    if (out.some((o) => o.value === c.value || o.text === c.text)) continue;
    out.push(c);
  }
  return out;
}

// ---------------------------------------------------------------- 1. next letter in a sequence
function nextLetter(rng: Rng): GeneratedCore {
  for (;;) {
    const core = tryNextLetter(rng);
    if (core) return core;
  }
}

function tryNextLetter(rng: Rng): GeneratedCore | null {
  const growing = rng.bool(0.45);
  let terms: number[];
  let answer: number;
  let pool: { p: number; why: string }[];
  let gapLine: string;
  let pattern: string;

  if (!growing) {
    const size = rng.int(2, 5);
    const forward = rng.bool(0.7);
    const d = forward ? size : -size;
    const start = forward ? rng.int(1, 26 - 4 * size) : rng.int(1 + 4 * size, 26);
    terms = [0, 1, 2, 3].map((i) => start + i * d);
    answer = start + 4 * d;
    const last = terms[3];
    const dir = forward ? 'forward' : 'back';
    const sgn = forward ? 1 : -1;
    gapLine = `So each letter is ${size} places ${dir} from the one before.`;
    pattern = `The pattern moves ${size} places ${dir} each time`;
    pool = [
      {
        p: last + d - sgn,
        why: `This moves only ${places(size - 1)} from ${L(last)}. It happens if you count ${L(last)} itself as one of the ${size} steps.`,
      },
      { p: last + d + sgn, why: `This moves ${size + 1} places from ${L(last)}, one step too far.` },
      { p: last + sgn, why: `This is just the letter ${forward ? 'after' : 'before'} ${L(last)}, which ignores the rule of moving ${size} places each time.` },
      { p: last + 2 * d, why: `This moves ${2 * size} places from ${L(last)}, skipping a term of the sequence.` },
    ];
  } else {
    const g0 = rng.int(1, 3);
    const start = rng.int(1, 26 - (5 * g0 + 10));
    terms = [start];
    for (let i = 0; i < 4; i++) terms.push(terms[i] + g0 + i);
    const lastGap = g0 + 3;
    answer = terms[4] + lastGap + 1;
    const last = terms[4];
    gapLine = `The gaps themselves go up by 1 each time, so the next gap is ${lastGap + 1}.`;
    pattern = `The gaps grow by 1 each time, which makes the next gap ${lastGap + 1}`;
    pool = [
      { p: last + lastGap, why: `This repeats the last gap of ${lastGap}. The gaps are growing, so the next gap is ${lastGap + 1}.` },
      { p: last + lastGap + 2, why: `This adds ${lastGap + 2}, jumping one gap too far.` },
      {
        p: answer - 1,
        why: `This moves only ${places(lastGap)} after ${L(last)}: it happens if you count ${L(last)} itself as one of the ${lastGap + 1} steps.`,
      },
      { p: last + g0, why: `This reuses the first gap of ${g0}, as if the gaps were constant. They are not: they go up by 1 each time.` },
      { p: answer + 1, why: `This adds ${lastGap + 2} instead of ${lastGap + 1}, overshooting by one letter.` },
    ];
  }

  const ansText = L(answer);
  const cands: Cand[] = pool.filter((c) => c.p >= 1 && c.p <= 26).map((c) => ({ text: L(c.p), value: L(c.p), why: c.why }));
  const distractors = pickDistinct(ansText, ansText, cands);
  // not enough genuine mistakes fit inside A..Z (answer too close to an end): re-roll the parameters
  if (distractors.length < 3) return null;

  const seq = [...terms.map(L), '?'].join(', ');
  const posRow = `| Letter | ${terms.map(L).join(' | ')} |\n|---|${terms.map(() => '---').join('|')}|\n| Position | ${terms.join(' | ')} |`;
  const gaps = terms.slice(1).map((t, i) => t - terms[i]);
  const gapTex = gaps.map((g, i) => `$${terms[i + 1]} - ${terms[i]} = ${g}$`).join(', ');
  const lastT = terms[terms.length - 1];
  const step = answer - lastT;
  const solution = steps(
    `Letters are hard to compare, so turn each one into its position in the alphabet: A = 1, B = 2, up to Z = 26. Anchors help you count: E = 5, J = 10, O = 15, T = 20, Y = 25.\n\n${posRow}`,
    `Find the gap between neighbouring positions: ${gapTex}. ${gapLine}`,
    `Use that for the next position: $${lastT}${signed(step)} = ${answer}$. Position ${answer} is ${ansText}.`,
  );

  return {
    stem: `What letter comes next in the sequence?\n\n**${seq}**`,
    answer: ansText,
    answerValue: ansText,
    distractors,
    asking: `Which letter comes after ${L(lastT)} in this list?`,
    solution,
    conclusion: `${pattern}, so the next letter is ${ansText}.`,
    keyIdea: 'Turn letters into positions (A = 1) and find the gaps. Equal gaps mean you apply that gap once more. If the gaps change, write them in a row and look at how they change, then use the next gap.',
  };
}

// ---------------------------------------------------------------- 2. shift cipher (encode / decode / infer)
const WORDS = [
  'ZOO', 'WAX', 'YES', 'BOX', 'SKY', 'JAZZ', 'QUIZ', 'WAVY', 'TOWN', 'YARD', 'ZERO', 'VERY', 'WORD', 'XRAY',
  'CAT', 'DOG', 'SUN', 'MAP', 'PEN', 'FISH', 'LAMP', 'BIRD', 'MILK', 'ROBOT', 'TIGER', 'WATER', 'PIZZA', 'STORY',
  'HOUSE', 'TRUCK', 'MOUSE', 'VALUE', 'WHEAT', 'YOUTH',
];

function letterTable(word: string, k: number): string {
  const rows = word.split('').map((c) => {
    const p = pos(c);
    const raw = p + k;
    let work: string;
    if (raw > 26) work = `$${p}${signed(k)} = ${raw}$, and $${raw} - 26 = ${raw - 26}$ (wrap past Z)`;
    else if (raw < 1) work = `$${p}${signed(k)} = ${raw}$, and $${raw} + 26 = ${raw + 26}$ (wrap past A)`;
    else work = `$${p}${signed(k)} = ${raw}$`;
    return `| ${c} | ${p} | ${work} | ${wrapL(raw)} |`;
  });
  return `| Letter | Position | Working | New letter |\n|---|---|---|---|\n${rows.join('\n')}`;
}

function shiftCipher(rng: Rng): GeneratedCore {
  const mode = rng.pick(['encode', 'decode', 'infer'] as const);
  const k = rng.int(2, 7);
  const [w1, w2] = rng.sample(WORDS, 2);

  let stem: string;
  let answer: string;
  let pool: Cand[];
  let asking: string;
  let solution: string;
  let conclusion: string;
  let keyIdea: string;

  if (mode === 'encode') {
    answer = shiftWord(w1, k);
    stem = `A shift cipher replaces every letter by the letter **${k} places later** in the alphabet, wrapping round from Z back to A. How is **${w1}** written in this cipher?`;
    pool = [
      { text: shiftWord(w1, -k), value: shiftWord(w1, -k), why: `This shifts every letter ${k} places **backwards**, which is how you would decode, not encode.` },
      { text: shiftWord(w1, k - 1), value: shiftWord(w1, k - 1), why: `This shifts by ${k - 1} instead of ${k}: it happens if you count the starting letter as one of the steps.` },
      { text: shiftWord(w1, k + 1), value: shiftWord(w1, k + 1), why: `This shifts by ${k + 1} instead of ${k}, one place too far.` },
    ];
    asking = `What does ${w1} become when each letter moves ${k} places forward?`;
    solution = steps(
      `A **shift cipher** moves every letter by the same number of places. Here each letter moves ${k} places forward, towards Z.`,
      `Use positions to do this: A = 1, up to Z = 26. Add ${k} to each letter's position. If a result is above 26, subtract 26 to wrap round to the start of the alphabet.`,
      `Work through ${w1} one letter at a time. The last column spells ${answer}:\n\n${letterTable(w1, k)}`,
    );
    conclusion = `Moving each letter of ${w1} forward ${k} places gives ${answer}.`;
    keyIdea = 'A shift cipher adds the same number to every letter position (A = 1). If the result is above 26, subtract 26 to wrap round to the start. To decode, subtract the number instead.';
  } else if (mode === 'decode') {
    const coded = shiftWord(w1, k);
    answer = w1;
    stem = `A word was encoded by moving every letter **${k} places forward** in the alphabet, wrapping round from Z back to A. The encoded word is **${coded}**. What was the original word?`;
    pool = [
      { text: shiftWord(coded, k), value: shiftWord(coded, k), why: `This moves each letter ${k} places **forward** again, encoding twice. To undo the code you must move backwards.` },
      { text: shiftWord(coded, -(k - 1)), value: shiftWord(coded, -(k - 1)), why: `This moves back only ${places(k - 1)} instead of ${k}.` },
      { text: shiftWord(coded, -(k + 1)), value: shiftWord(coded, -(k + 1)), why: `This moves back ${k + 1} places instead of ${k}, one step too many.` },
    ];
    asking = `Which word did ${coded} come from, before each letter moved ${k} places forward?`;
    solution = steps(
      `The word was coded by moving forward ${k} places. To get back, we do the opposite: move each letter back ${k} places.`,
      `Use positions to do this: A = 1, up to Z = 26. Subtract ${k} from each position. If a result is below 1, add 26 to wrap round to the end of the alphabet.`,
      `Work through ${coded} one letter at a time. The last column spells ${answer}:\n\n${letterTable(coded, -k)}`,
    );
    conclusion = `Moving each letter back ${k} places gives ${answer}. To test it, moving ${answer} forward ${k} places gives ${coded}.`;
    keyIdea = 'To decode a shift cipher, apply the opposite shift: subtract from each position (A = 1). If the result is below 1, add 26 to wrap round. Test your answer by encoding it again.';
  } else {
    const c1 = shiftWord(w1, k);
    answer = shiftWord(w2, k);
    stem = `In a code language, **${w1}** is written as **${c1}**. How is **${w2}** written in the same code?`;
    pool = [
      { text: shiftWord(w2, -k), value: shiftWord(w2, -k), why: `This shifts ${k} places **backwards**. In the example each code letter is ${k} places **after** the original, so the shift is forwards.` },
      { text: shiftWord(w2, k - 1), value: shiftWord(w2, k - 1), why: `This shifts by ${k - 1}: the shift in the example was miscounted by counting the starting letter as a step.` },
      { text: shiftWord(w2, k + 1), value: shiftWord(w2, k + 1), why: `This shifts by ${k + 1} instead of ${k}, one place too far.` },
    ];
    const f = w1[0];
    const fc = c1[0];
    const pf = pos(f);
    const pc = pos(fc);
    const findShift =
      pc > pf
        ? `The first letter ${f} (position ${pf}) became ${fc} (position ${pc}): $${pc} - ${pf} = ${k}$, so the shift is ${k} places forward.`
        : `The first letter ${f} (position ${pf}) became ${fc} (position ${pc}). Going forward past Z: $${pc} + 26 - ${pf} = ${k}$, so the shift is ${k} places forward.`;
    asking = `Work out the code from ${w1}, then use it on ${w2}.`;
    solution = steps(
      findShift,
      `Test that on the second letter: ${w1[1]} moved ${k} places forward becomes ${c1[1]}, which matches. So this is a **shift cipher**, where every letter moves by the same amount.`,
      `Apply the same shift to ${w2}. Add ${k} to each position, and if a result is above 26, subtract 26 to wrap round. The last column spells ${answer}:\n\n${letterTable(w2, k)}`,
    );
    conclusion = `The code moves each letter ${k} places forward, so ${w2} becomes ${answer}.`;
    keyIdea = 'Find the shift by comparing the positions of one letter in the example (A = 1), and confirm it on a second letter. Then add that shift to each letter of the new word, subtracting 26 if you pass Z.';
  }

  const distractors = pickDistinct(answer, answer, pool);
  return { stem, answer, answerValue: answer, distractors, asking, solution, conclusion, keyIdea };
}

// ---------------------------------------------------------------- 3. number grid: find the row rule
interface GridRule {
  id: string;
  f: (a: number, b: number) => number;
  tex: (a: number, b: number) => string;
  name: string;
  /** Rule written out with the intermediate arithmetic, e.g. "4 \times 3 + 1 = 12 + 1 = 13". */
  work?: (a: number, b: number) => string;
  /** How a student could spot the rule from the first complete row. */
  hint?: (a: number, b: number, c: number, row: number) => string | null;
}

function gridRules(k: number, m: number): { rule: GridRule; alts: { r: GridRule; why: string }[] }[] {
  const kTex = `$${signed(k).trim()}$`;
  const prodK: GridRule = {
    id: 'prodK',
    f: (a, b) => a * b + k,
    tex: (a, b) => `${a} \\times ${b}${signed(k)}`,
    work: (a, b) => `${a} \\times ${b}${signed(k)} = ${a * b}${signed(k)} = ${a * b + k}`,
    hint: (a, b, c, row) =>
      a + b === c
        ? null
        : `In row ${row}, adding gives $${a} + ${b} = ${a + b}$, not ${c}. Multiplying gives $${a} \\times ${b} = ${a * b}$, which is ${Math.abs(k)} ${k > 0 ? 'less' : 'more'} than ${c}. So try "multiply, then ${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)}".`,
    name: `multiply the two numbers, then ${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)}`,
  };
  const sqsq: GridRule = {
    id: 'sqsq',
    f: (a, b) => a * a + b * b,
    tex: (a, b) => `${a}^2 + ${b}^2`,
    work: (a, b) => `${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}`,
    hint: (a, b, c, row) =>
      a + b === c || a * b === c
        ? null
        : `In row ${row}, neither adding ($${a} + ${b} = ${a + b}$) nor multiplying ($${a} \\times ${b} = ${a * b}$) gives ${c}. Try squares (a number multiplied by itself): $${a}^2 = ${a * a}$ and $${b}^2 = ${b * b}$, and $${a * a} + ${b * b} = ${c}$.`,
    name: 'square both numbers and add',
  };
  const sqb: GridRule = {
    id: 'sqb',
    f: (a, b) => a * a + b,
    tex: (a, b) => `${a}^2 + ${b}`,
    work: (a, b) => `${a}^2 + ${b} = ${a * a} + ${b} = ${a * a + b}`,
    hint: (a, b, c, row) =>
      a + b === c || a * b === c
        ? null
        : `In row ${row}, neither adding ($${a} + ${b} = ${a + b}$) nor multiplying ($${a} \\times ${b} = ${a * b}$) gives ${c}. Try squaring the first number (multiplying it by itself): $${a}^2 = ${a * a}$, and $${c} - ${a * a} = ${b}$, which is exactly the second number.`,
    name: 'square the first number and add the second',
  };
  const sumM: GridRule = {
    id: 'sumM',
    f: (a, b) => (a + b) * m,
    tex: (a, b) => `(${a} + ${b}) \\times ${m}`,
    work: (a, b) => `(${a} + ${b}) \\times ${m} = ${a + b} \\times ${m} = ${(a + b) * m}`,
    hint: (a, b, c, row) => `In row ${row}, $${a} + ${b} = ${a + b}$, and $${c} \\div ${a + b} = ${m}$. So try "add, then multiply by ${m}".`,
    name: `add the two numbers, then multiply by ${m}`,
  };

  const mk = (id: string, f: (a: number, b: number) => number, tex: (a: number, b: number) => string): GridRule => ({ id, f, tex, name: id });
  return [
    {
      rule: prodK,
      alts: [
        { r: mk('ab', (a, b) => a * b, (a, b) => `${a} \\times ${b}`), why: `This multiplies but forgets the ${kTex} part of the rule.` },
        { r: mk('a+b+k', (a, b) => a + b + k, (a, b) => `${a} + ${b}${signed(k)}`), why: 'This adds the two numbers instead of multiplying them.' },
        { r: mk('ab-k', (a, b) => a * b - k, (a, b) => `${a} \\times ${b}${signed(-k)}`), why: `This multiplies but then ${k > 0 ? 'subtracts' : 'adds'} ${Math.abs(k)}, using the wrong sign for the adjustment.` },
        { r: mk('ab+2k', (a, b) => a * b + 2 * k, (a, b) => `${a} \\times ${b}${signed(2 * k)}`), why: `This uses an adjustment of $${signed(2 * k).trim()}$ instead of ${kTex}.` },
      ],
    },
    {
      rule: sqsq,
      alts: [
        { r: mk('a2+b', (a, b) => a * a + b, (a, b) => `${a}^2 + ${b}`), why: 'This squares only the first number.' },
        { r: mk('(a+b)2', (a, b) => (a + b) ** 2, (a, b) => `(${a} + ${b})^2`), why: 'This adds first and then squares, but squaring a sum is not the same as adding the squares.' },
        { r: mk('a+b2', (a, b) => a + b * b, (a, b) => `${a} + ${b}^2`), why: 'This squares only the second number.' },
        { r: mk('a2-b2', (a, b) => a * a - b * b, (a, b) => `${a}^2 - ${b}^2`), why: 'This subtracts the squares instead of adding them.' },
        { r: mk('2a+2b', (a, b) => 2 * a + 2 * b, (a, b) => `2 \\times ${a} + 2 \\times ${b}`), why: 'This doubles the numbers instead of squaring them.' },
      ],
    },
    {
      rule: sqb,
      alts: [
        { r: mk('a2+b2', (a, b) => a * a + b * b, (a, b) => `${a}^2 + ${b}^2`), why: 'This squares both numbers, but only the first one is squared.' },
        { r: mk('a+b2', (a, b) => a + b * b, (a, b) => `${a} + ${b}^2`), why: 'This squares the second number instead of the first.' },
        { r: mk('2a+b', (a, b) => 2 * a + b, (a, b) => `2 \\times ${a} + ${b}`), why: 'This doubles the first number instead of squaring it.' },
        { r: mk('(a+b)2', (a, b) => (a + b) ** 2, (a, b) => `(${a} + ${b})^2`), why: 'This adds first and then squares the total.' },
        { r: mk('a2-b', (a, b) => a * a - b, (a, b) => `${a}^2 - ${b}`), why: 'This subtracts the second number instead of adding it.' },
      ],
    },
    {
      rule: sumM,
      alts: [
        { r: mk('a+bm', (a, b) => a + b * m, (a, b) => `${a} + ${b} \\times ${m}`), why: `This forgets the brackets: it multiplies only the second number by ${m} before adding.` },
        { r: mk('am+b', (a, b) => a * m + b, (a, b) => `${a} \\times ${m} + ${b}`), why: `This multiplies only the first number by ${m}.` },
        { r: mk('a+b+m', (a, b) => a + b + m, (a, b) => `${a} + ${b} + ${m}`), why: `This adds ${m} instead of multiplying by ${m}.` },
        { r: mk('abm', (a, b) => a * b * m, (a, b) => `${a} \\times ${b} \\times ${m}`), why: `This multiplies the two numbers (and ${m}) instead of adding the two numbers first.` },
      ],
    },
  ];
}

/** Plane c = p*a + q*b + r through three rows; null if the rows are degenerate. */
function plane(rows: number[][]): [number, number, number] | null {
  const [[a1, b1, c1], [a2, b2, c2], [a3, b3, c3]] = rows;
  const det = a1 * (b2 - b3) - b1 * (a2 - a3) + (a2 * b3 - a3 * b2);
  if (det === 0) return null;
  const p = (c1 * (b2 - b3) - b1 * (c2 - c3) + (c2 * b3 - c3 * b2)) / det;
  const q = (a1 * (c2 - c3) - c1 * (a2 - a3) + (a2 * c3 - a3 * c2)) / det;
  const r = c1 - p * a1 - q * b1;
  return [p, q, r];
}

/** Other simple rules a student might spot; used to reject ambiguous tables. */
const OTHER_RULES: ((a: number, b: number) => number)[] = [];
for (let j = -6; j <= 6; j++) {
  OTHER_RULES.push((a, b) => a * b + j, (a, b) => a + b + j, (a, b) => a * a + b + j, (a, b) => a + b * b + j, (a, b) => a * a + b * b + j);
  OTHER_RULES.push((a, b) => 2 * a + b + j, (a, b) => a + 2 * b + j, (a, b) => 3 * a + b + j, (a, b) => a + 3 * b + j);
}
for (let j = 1; j <= 6; j++) OTHER_RULES.push((a, b) => (a + b) * j, (a, b) => a * b * j, (a, b) => (a + b) ** 2 + j - 1, (a, b) => a * a - b + j - 1);

function gridRule(rng: Rng): GeneratedCore {
  for (;;) {
    const k = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const m = rng.int(2, 4);
    const pack = rng.pick(gridRules(k, m));
    const { rule, alts } = pack;
    const pairs: [number, number][] = [];
    while (pairs.length < 4) {
      const a = rng.int(1, 9);
      const b = rng.int(1, 9);
      if (pairs.some(([x, y]) => x === a && y === b)) continue;
      pairs.push([a, b]);
    }
    const rows = pairs.slice(0, 3).map(([a, b]) => [a, b, rule.f(a, b)]);
    const [qa, qb] = pairs[3];
    // the question row must not just be a complete row with its two numbers swapped (that gives the answer away)
    if (pairs.slice(0, 3).some(([x, y]) => x === qb && y === qa)) continue;
    const ans = rule.f(qa, qb);
    if ([...rows.map((r) => r[2]), ans].some((c) => c < 1 || c > 150)) continue;
    // the rows must pin the rule down: no listed alternative may fit all three complete rows
    if (alts.some(({ r }) => rows.every(([a, b, c]) => r.f(a, b) === c))) continue;
    // a non-linear rule must not also be explained by a "nice" linear rule p*a + q*b + r
    // no other natural rule may fit all three complete rows yet give a different answer
    if (OTHER_RULES.some((f) => rows.every(([a, b, c]) => f(a, b) === c) && f(qa, qb) !== ans)) continue;
    // the three (first, second) pairs must not lie on one straight line, otherwise simpler rules also fit
    const pl = plane(rows);
    if (!pl) continue;
    if (rule.id !== 'sumM' && pl.every((x) => Number.isInteger(x)) && pl[0] >= 0 && pl[1] >= 0) continue;

    const cands: Cand[] = [];
    for (const { r, why } of alts) {
      const v = r.f(qa, qb);
      if (v < 1) continue;
      const fail = rows.find(([a, b, c]) => r.f(a, b) !== c)!;
      cands.push({
        text: String(v),
        value: v,
        why: `${why} It gives $${r.tex(qa, qb)} = ${v}$ for the last row, but check it on the row (${fail[0]}, ${fail[1]}, ${fail[2]}): $${r.tex(fail[0], fail[1])} = ${r.f(fail[0], fail[1])}$, not ${fail[2]}.`,
      });
    }
    // only rule-based mistakes are used as distractors; if they collide with the answer
    // (e.g. a last row of (1, 1)), re-roll rather than pad with random "arithmetic slips"
    const distractors = pickDistinct(String(ans), ans, cands);
    if (distractors.length < 3) continue;

    const work = rule.work ?? ((a: number, b: number) => `${rule.tex(a, b)} = ${rule.f(a, b)}`);
    const checks = rows.map(([a, b], i) => `- Row ${i + 1}: $${work(a, b)}$ ✓`).join('\n');
    const answer = String(ans);
    let hint = '';
    for (let i = 0; i < rows.length && rule.hint && !hint; i++) {
      const h = rule.hint(rows[i][0], rows[i][1], rows[i][2], i + 1);
      if (h) hint = `${h}\n\n`;
    }
    const solution = steps(
      'Each row has two starting numbers and a result, and one rule must work for every row. So test simple ideas on one row, starting with adding and multiplying.',
      hint.trim(),
      `Written in full, the rule is: **${rule.name}**. Test it on every complete row:\n\n${checks}`,
      `It works for all three complete rows, so apply it to the last row:\n\n$$${work(qa, qb)}$$`,
    );

    return {
      stem: 'Every row of the table follows the same rule, which turns the first two numbers into the third. What number replaces the question mark?',
      table: {
        headers: ['First', 'Second', 'Third'],
        rows: [...rows, [qa, qb, '?']],
      },
      answer,
      answerValue: ans,
      distractors,
      asking: 'What rule turns the first two numbers into the third, and what does it give for the last row?',
      solution,
      conclusion: `The rule "${rule.name}" fits all three complete rows, and for the last row it gives ${answer}.`,
      keyIdea: 'Try adding and multiplying on one row, then adjust by a small amount or try squares. Test your rule on every complete row, and reject it if one fails. Only then apply it to the incomplete row.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-letter-symbol-patterns-next-letter',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'foundation',
    title: 'Next letter in an alphabet-position sequence',
    generate: nextLetter,
  },
  {
    id: 'gen-letter-symbol-patterns-shift-cipher',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    title: 'Encode, decode or crack a shift cipher',
    generate: shiftCipher,
  },
  {
    id: 'gen-letter-symbol-patterns-grid-rule',
    subtopic: 'letter-symbol-patterns',
    difficulty: 'exam',
    title: 'Find the rule in a number grid',
    generate: gridRule,
  },
];
