import type { Generator } from '../../../types';
import type { Rng } from '../../../lib/rng';
import { Frac } from '../../../lib/frac';
import { m, paren, signed, sum } from '../../../lib/tex';

type Cand = { v: Frac; why: string };

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: Frac, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const c of pool) {
    if (out.length === 3) break;
    if (c.v.equals(answer) || c.v.tex() === answer.tex()) continue;
    if (out.some((o) => o.v.equals(c.v) || o.v.tex() === c.v.tex())) continue;
    out.push(c);
  }
  // guaranteed-different fallbacks (rarely needed)
  for (let k = 1; out.length < 3; k++) {
    for (const v of [answer.add(k), answer.sub(k)]) {
      if (out.length === 3) break;
      if (out.some((o) => o.v.equals(v))) continue;
      out.push({ v, why: `This is ${k} away from the correct value: an arithmetic slip in the final step. Always check by running the machine on your answer.` });
    }
  }
  return out;
}

const show = (f: Frac) => m(f.tex());

// ---------------------------------------------------------------- generator 1: linear function machine
function linearMachine(rng: Rng) {
  const a = rng.int(2, 9);
  let b = rng.int(-9, 12);
  if (b === 0) b = rng.pick([3, 5, 7]);
  const s = rng.int(1, 4);
  const step = rng.pick([1, 1, 2]);
  const xs = [0, 1, 2, 3].map((i) => s + i * step);
  const ys = xs.map((x) => a * x + b);
  const N = rng.int(xs[3] + 3, 30);
  const Y = a * N + b;
  const inverse = rng.bool(0.4);
  const addTxt = b > 0 ? `add ${b}` : `subtract ${-b}`;
  const addVerb = b > 0 ? `adds ${m(String(b))}` : `subtracts ${m(String(-b))}`;
  const rule = `\\text{output} = ${a} \\times \\text{input}${signed(b)}`;

  // ----- solution: find the rule
  const di = ys[0] !== 0 ? 0 : 1; // avoid writing "- 0"
  let sol = '**Step 1: find the multiplier.** ';
  sol +=
    step === 1
      ? `Each time the input goes up by $1$, the output goes up by ${m(String(a))} (${m(`${ys[di + 1]} - ${paren(ys[di])} = ${a}`)}). So the rule starts with "multiply by ${a}".\n\n`
      : `The inputs go up in steps of $2$ and the outputs go up by ${m(String(2 * a))} each time (${m(`${ys[di + 1]} - ${paren(ys[di])} = ${2 * a}`)}). So for each $1$ of input the output goes up by ${m(`${2 * a} \\div 2 = ${a}`)}: the rule starts with "multiply by ${a}".\n\n`;
  sol += `**Step 2: find the fixed number.** For input ${m(String(xs[0]))}: ${m(`${a} \\times ${xs[0]} = ${a * xs[0]}`)}, but the output is ${m(String(ys[0]))}, so the machine ${addVerb} (${m(`${ys[0]} - ${a * xs[0]} = ${b}`)}).`;
  sol += `${dmLine(rule)}`;
  sol += `**Step 3: check on the last row.** ${m(`${a} \\times ${xs[3]}${signed(b)} = ${ys[3]}`)}, which matches the table.\n\n`;

  const table = { headers: ['Input', 'Output'], rows: xs.map((x, i) => [x, ys[i]]) };
  const intro = 'A function machine applies the same rule to every input. The table shows four examples.';

  if (!inverse) {
    const answer = new Frac(Y);
    const pool: Cand[] = [
      { v: new Frac(a * N), why: `This is ${m(`${a} \\times ${N} = ${a * N}`)}: it finds the multiplier ${a} but forgets to ${addTxt}.` },
      { v: new Frac(ys[3] + a * step), why: `This is the output for input ${m(String(xs[3] + step))}, the next row of the table. The question asks for input ${m(String(N))}.` },
    ];
    if (step === 2)
      pool.push({
        v: new Frac(2 * a * (N - xs[0]) + ys[0]),
        why: `This uses ${m(String(2 * a))}, the change between rows, as the multiplier. But the inputs go up in steps of 2, so the output only changes by ${m(String(a))} for each $1$ of input.`,
      });
    if ((ys[0] * N) % xs[0] === 0 && ys[0] > 0)
      pool.push({
        v: new Frac((ys[0] * N) / xs[0]),
        why: `This assumes the output is proportional to the input, scaling up the first example ${m(`${xs[0]} \\to ${ys[0]}`)}. The machine also ${addVerb}, so the output is not proportional to the input.`,
      });
    pool.push(
      { v: new Frac(a * N - b), why: `This uses the fixed number with the wrong sign: ${m(`${a} \\times ${N}${signed(-b)} = ${a * N - b}`)}. Check with the first row: the machine must ${addTxt}.` },
      { v: new Frac(a * (N + b)), why: `This does the two steps in the wrong order, ${m(`${a} \\times (${N}${signed(b)}) = ${a * (N + b)}`)}. The machine multiplies first, then ${b > 0 ? 'adds' : 'subtracts'}.` },
    );
    const ds = pickDistinct(answer, rng.shuffle(pool));
    return {
      stem: `${intro} Using the same rule, what is the output when the input is ${m(String(N))}?`,
      table,
      answer: show(answer),
      answerValue: answer.value(),
      distractors: ds.map((d) => ({ text: show(d.v), value: d.v.value(), why: d.why })),
      solution: sol + `**Step 4: apply the rule.** Input ${m(String(N))}: ${m(`${a} \\times ${N}${signed(b)} = ${Y}`)}.\n\nAnswer: ${show(answer)}`,
      keyIdea: 'Find the multiplier from how fast the output changes per 1 of input, then the fixed number from one row, and check the rule on another row before using it.',
    };
  }

  const answer = new Frac(N);
  const pool: Cand[] = [
    { v: new Frac(Y - b), why: `This undoes the "${addTxt}" step (${m(`${Y}${signed(-b)} = ${Y - b}`)}) but forgets to undo the multiplication: you must also divide by ${m(String(a))}.` },
    { v: new Frac(a * Y + b), why: `This runs the machine forwards on ${m(String(Y))}: ${m(`${a} \\times ${Y}${signed(b)} = ${a * Y + b}`)}. The question gives the output and asks for the input.` },
    { v: new Frac(Y - a * b, a), why: `This undoes the steps in the wrong order: ${m(`${Y} \\div ${a}`)} first, then undoing the fixed number. The machine ${b > 0 ? 'adds' : 'subtracts'} last, so that must be undone first.` },
    { v: new Frac(Y + b, a), why: `This undoes the fixed number in the wrong direction (${m(`${Y}${signed(b)}`)}) before dividing by ${m(String(a))}. To undo "${addTxt}" you must do the opposite.` },
  ];
  if (ys[0] > 0)
    pool.push({
      v: new Frac(Y * xs[0], ys[0]),
      why: `This assumes the output is proportional to the input, scaling the first example ${m(`${xs[0]} \\to ${ys[0]}`)}. The machine also ${addVerb}, so it is not proportional.`,
    });
  const ds = pickDistinct(answer, pool);
  const undo = b > 0 ? `subtract ${m(String(b))}` : `add ${m(String(-b))}`;
  return {
    stem: `${intro} Using the same rule, which input gives an output of ${m(String(Y))}?`,
    table,
    answer: show(answer),
    answerValue: answer.value(),
    distractors: ds.map((d) => ({ text: show(d.v), value: d.v.value(), why: d.why })),
    solution:
      sol +
      `**Step 4: work backwards from ${m(String(Y))}**, undoing the steps in reverse order.\n\n` +
      `1. Undo "${addTxt}": ${undo}, ${m(`${Y}${signed(-b)} = ${Y - b}`)}.\n` +
      `2. Undo "multiply by ${a}": divide, ${m(`${Y - b} \\div ${a} = ${N}`)}.\n\n` +
      `Check: ${m(`${a} \\times ${N}${signed(b)} = ${Y}`)}.\n\nAnswer: ${show(answer)}`,
    keyIdea: 'Find the rule from the table, then reverse the machine: undo the last step first, using inverse operations.',
  };
}

/** Display maths as its own paragraph. */
function dmLine(tex: string): string {
  return `\n\n$$${tex}$$\n\n`;
}

// ---------------------------------------------------------------- generator 2: which pair breaks the rule?
interface Fam {
  kind: 'lin' | 'sq' | 'cube';
  f: (x: number) => number;
  tex: string;
  calc: (x: number) => string;
  a: number;
  c: number;
}

function makeFamily(rng: Rng): { fam: Fam; xs: number[] } {
  const kind = rng.pick(['lin', 'lin', 'sq', 'sq', 'cube'] as const);
  if (kind === 'lin') {
    const a = rng.int(2, 7);
    const c = rng.int(-5, 9);
    return {
      fam: { kind, a, c, f: (x) => a * x + c, tex: `y = ${sum([[a, 'x'], [c, '']])}`, calc: (x) => `${a} \\times ${x}${c !== 0 ? signed(c) : ''}` },
      xs: rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4),
    };
  }
  if (kind === 'sq') {
    const c = rng.int(-3, 9);
    return {
      fam: { kind, a: 1, c, f: (x) => x * x + c, tex: `y = ${sum([[1, 'x^{2}'], [c, '']])}`, calc: (x) => `${x}^{2}${c !== 0 ? signed(c) : ''}` },
      xs: rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4),
    };
  }
  const c = rng.int(-2, 6);
  return {
    fam: { kind, a: 1, c, f: (x) => x * x * x + c, tex: `y = ${sum([[1, 'x^{3}'], [c, '']])}`, calc: (x) => `${x}^{3}${c !== 0 ? signed(c) : ''}` },
    xs: rng.sample([1, 2, 3, 4, 5], 4),
  };
}

/**
 * Rules a student might reasonably try, each "g(x) + constant": multiples of x^2 and x^3,
 * x^2 or x^3 plus a small multiple of x, x^4, 2^x and 3^x. (Straight lines are tested separately.)
 */
const SIMPLE_GS: ((x: number) => number)[] = [
  ...[1, 2, 3, 4, 5, 6].map((k) => (x: number) => k * x * x),
  ...[1, 2, 3].map((k) => (x: number) => k * x * x * x),
  ...[-4, -3, -2, -1, 1, 2, 3, 4].flatMap((k) => [(x: number) => x * x + k * x, (x: number) => x * x * x + k * x]),
  (x: number) => x ** 4,
  (x: number) => 2 ** x,
  (x: number) => 3 ** x,
];

/** Does this triple of points fit some simple rule (straight line, or g(x) + constant for a common g)? */
function fitsSimpleRule(pts: number[][]): boolean {
  const [[x1, y1], [x2, y2], [x3, y3]] = pts;
  if ((y2 - y1) * (x3 - x1) === (y3 - y1) * (x2 - x1)) return true;
  return SIMPLE_GS.some((g) => {
    const d = pts.map(([x, y]) => y - g(x));
    return d[0] === d[1] && d[1] === d[2];
  });
}

function pairRule(rng: Rng) {
  let fam: Fam | null = null;
  let xs: number[] = [];
  let ys: number[] = [];
  let k = 0;
  for (let tries = 0; tries < 500 && !fam; tries++) {
    const cand = makeFamily(rng);
    const kk = rng.int(0, 3);
    const delta = rng.pick([-2, -1, 1, 2]);
    const yy = cand.xs.map((x, i) => cand.fam.f(x) + (i === kk ? delta : 0));
    if (yy.some((y) => y < 1)) continue;
    const pts = cand.xs.map((x, i) => [x, yy[i]]);
    // only the triple WITHOUT the impostor may fit a simple rule
    const ok = [0, 1, 2, 3].every((j) => j === kk || !fitsSimpleRule(pts.filter((_, i) => i !== j)));
    if (!ok) continue;
    fam = cand.fam;
    xs = cand.xs;
    ys = yy;
    k = kk;
  }
  if (!fam) {
    // verified safe fallback: y = 3x + 1 with (5, 17) as the impostor
    const a = 3;
    const c = 1;
    fam = { kind: 'lin', a, c, f: (x) => a * x + c, tex: 'y = 3x + 1', calc: (x) => `3 \\times ${x} + 1` };
    xs = [2, 4, 5, 7];
    ys = [7, 13, 17, 22];
    k = 2;
  }
  const F = fam;
  const pairTex = (i: number) => m(`(${xs[i]}, ${ys[i]})`);
  const xmax = Math.max(...xs);
  const xmin = Math.min(...xs);
  const regular = [0, 1, 2, 3].filter((i) => i !== k);

  let howTo: string;
  if (F.kind === 'lin') {
    const [p, q] = regular.slice().sort((i, j) => xs[i] - xs[j]);
    howTo =
      `Find a straight-line rule from two of the pairs, say ${pairTex(p)} and ${pairTex(q)} (if the rule you get fails on both of the other pairs, you happened to pick the odd one out, so try a different two). ` +
      (xs[q] - xs[p] === 1
        ? `When ${m('x')} goes up by $1$, ${m('y')} goes up by ${m(String(F.a))}, so the multiplier is ${m(String(F.a))}. `
        : `When ${m('x')} goes up by ${m(String(xs[q] - xs[p]))}, ${m('y')} goes up by ${m(String(ys[q] - ys[p]))}, which is ${m(`${ys[q] - ys[p]} \\div ${xs[q] - xs[p]} = ${F.a}`)} for each $1$ of ${m('x')}. `) +
      `Then ${m(`${F.a} \\times ${xs[p]} = ${F.a * xs[p]}`)} and ${m(`${ys[p]} - ${F.a * xs[p]} = ${F.c}`)}, so the rule looks like ${m(F.tex)}.`;
  } else {
    const p = F.kind === 'sq' ? 2 : 3;
    const name = F.kind === 'sq' ? 'squares' : 'cubes';
    howTo =
      `The ${m('y')}-values grow quickly, so compare each one with the ${name} of the ${m('x')}-values, ${m(`y - x^{${p}}`)}:\n\n` +
      xs.map((x, i) => `- ${pairTex(i)}: ${m(`${ys[i]} - ${x}^{${p}} = ${ys[i] - x ** p}`)}`).join('\n') +
      `\n\nThree pairs give the same difference ${m(String(F.c))}, so the rule is ${m(F.tex)}.`;
  }
  const tests = xs
    .map((x, i) => (i === k ? `- ${pairTex(i)}: ${m(`${F.calc(x)} = ${F.f(x)} \\ne ${ys[i]}`)}. Does **not** fit.` : `- ${pairTex(i)}: ${m(`${F.calc(x)} = ${ys[i]}`)}. Fits.`))
    .join('\n');

  const answer = pairTex(k);
  const distractors = regular.map((i) => ({
    text: pairTex(i),
    value: `${xs[i]},${ys[i]}`,
    why:
      `${pairTex(i)} fits the shared rule ${m(F.tex)}: ${m(`${F.calc(xs[i])} = ${ys[i]}`)}.` +
      (xs[i] === xmax ? ' It has the largest numbers, but size alone is not a rule.' : xs[i] === xmin ? ' It has the smallest numbers, but that does not make it the odd one out.' : ' A pair that passes the test cannot be the odd one out.'),
  }));
  return {
    stem: `Here are four pairs ${m('(x, y)')}: ${xs.map((_, i) => pairTex(i)).join(', ')}. In three of the pairs, ${m('y')} is made from ${m('x')} by the same rule. Which pair is the odd one out?`,
    answer,
    answerValue: `${xs[k]},${ys[k]}`,
    distractors,
    solution: `${howTo}\n\nNow test every pair against ${m(F.tex)}:\n\n${tests}\n\nOnly one pair breaks the rule. Answer: ${answer}`,
    keyIdea: 'Find a rule from pairs that agree, test it on every pair, and the single pair that fails is the odd one out.',
  };
}

export const generators: Generator[] = [
  {
    id: 'gen-odd-one-out-linear-machine',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    title: 'Function machine: find the rule from a table, then use it (forwards or backwards)',
    generate: (rng) => linearMachine(rng),
  },
  {
    id: 'gen-odd-one-out-pair-rule',
    subtopic: 'odd-one-out',
    difficulty: 'exam',
    title: 'Odd one out: which pair breaks the rule?',
    generate: (rng) => pairRule(rng),
  },
];
