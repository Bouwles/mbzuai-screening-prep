import type { Generator } from '../../../types';
import { steps, table } from '../../../lib/explanation';
import type { Rng } from '../../../lib/rng';
import { num, paren, signed } from '../../../lib/tex';

type Cand = { v: number; text: string; why: string };

const relu = (z: number) => Math.max(0, z);
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const r3 = (x: number) => Math.round(x * 1000) / 1000;
/** e to the power p, written cleanly (e rather than e^{1}). */
const expTex = (p: number) => (p === 1 ? 'e' : `e^{${num(p)}}`);

/** Keep up to 3 candidates that differ from the answer and from each other (by value and by rendered text). */
function pickDistinct(answer: number, answerText: string, pool: Cand[]): Cand[] {
  const out: Cand[] = [];
  for (const d of pool) {
    if (out.length === 3) break;
    if (!Number.isFinite(d.v)) continue;
    if (Math.abs(d.v - answer) < 1e-9 || d.text === answerText) continue;
    if (out.some((x) => Math.abs(x.v - d.v) < 1e-9 || x.text === d.text)) continue;
    out.push(d);
  }
  return out;
}

/** "w_1x_1 + w_2x_2 + b" written with the actual numbers, e.g. "1.5 x 2 + (-1) x 4 + 1". */
function sumTex(w: number[], x: number[], b: number): string {
  return w.map((wi, i) => `${i === 0 ? '' : ' + '}${paren(wi)} \\times ${paren(x[i])}`).join('') + signed(b);
}

/** A sum of already-worked-out terms, e.g. "3 - 4 + 1". Zero terms add nothing, so they are left out. */
function chain(terms: number[]): string {
  const kept = terms.filter((t) => t !== 0);
  return kept.map((t, i) => (i === 0 ? num(t) : signed(t))).join('');
}

// ---------------------------------------------------------------- single neuron
type Act = 'relu' | 'sigmoid' | 'tanh';
const ACT_INFO: Record<Act, { name: string; formula: string; dp: boolean }> = {
  relu: { name: 'ReLU', formula: '$\\text{ReLU}(z) = \\max(0, z)$', dp: false },
  sigmoid: { name: 'sigmoid', formula: '$\\sigma(z) = \\frac{1}{1 + e^{-z}}$', dp: true },
  tanh: { name: 'tanh', formula: '$\\tanh(z)$', dp: true },
};
const HALVES = [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2];

function actValue(a: Act, z: number): number {
  if (a === 'relu') return relu(z);
  if (a === 'sigmoid') return r3(sigmoid(z));
  return r3(Math.tanh(z));
}

/** The steps that take the weighted sum z through the activation. The last one reaches the output. */
function actSteps(a: Act, z: number, out: number): string[] {
  if (a === 'relu')
    return [
      '**ReLU** means $\\max(0, z)$: take whichever is larger, 0 or $z$. So it keeps a positive $z$ and turns a negative $z$ into 0.',
      `Here $\\max(0, ${num(z)}) = ${num(out)}$, because $z$ is ${z >= 0 ? 'positive, so it passes straight through' : 'negative'}.`,
    ];
  // Rounded first, so the sums shown on screen add up exactly as a student would key them in.
  const pos = Math.round(Math.exp(z) * 10000) / 10000;
  const inv = Math.round(Math.exp(-z) * 10000) / 10000;
  if (a === 'sigmoid')
    return [
      `The **sigmoid** turns $z$ into a number between 0 and 1. First find the power. $e$ is a fixed number, about 2.718. With $z = ${num(z)}$, $e^{-z} = ${expTex(-z)} \\approx ${num(inv, 4)}$.`,
      `Substitute: $\\sigma(${num(z)}) = \\frac{1}{1 + ${num(inv, 4)}} = \\frac{1}{${num(1 + inv, 4)}} \\approx ${out.toFixed(3)}$ to 3 decimal places.`,
    ];
  return [
    '**tanh** turns $z$ into a number between $-1$ and 1, using $\\tanh(z) = \\frac{e^{z} - e^{-z}}{e^{z} + e^{-z}}$, where $e$ is a fixed number, about 2.718. A calculator with a tanh key gives it directly.',
    `With $z = ${num(z)}$, $e^{z} = ${expTex(z)} \\approx ${num(pos, 4)}$ and $e^{-z} = ${expTex(-z)} \\approx ${num(inv, 4)}$.`,
    `Substitute: the top is $${num(pos, 4)} - ${num(inv, 4)} = ${num(pos - inv, 4)}$, and the bottom is $${num(pos, 4)} + ${num(inv, 4)} = ${num(pos + inv, 4)}$. So $\\tanh(${num(z)}) = \\frac{${num(pos - inv, 4)}}{${num(pos + inv, 4)}} \\approx ${out.toFixed(3)}$ to 3 decimal places.`,
  ];
}

function genSingleNeuron(rng: Rng) {
  const act = rng.pick<Act>(['relu', 'relu', 'sigmoid', 'tanh']);
  for (let attempt = 0; ; attempt++) {
    const n = rng.pick([2, 2, 3]);
    const x = Array.from({ length: n }, () => rng.intNonZero(-3, 4));
    const w = Array.from({ length: n }, () => rng.pick(HALVES));
    const b = rng.pick(HALVES);
    const prods = w.map((wi, i) => wi * x[i]);
    const z = prods.reduce((s, p) => s + p, 0) + b;
    const zAbs = prods.reduce((s, p) => s + Math.abs(p), 0) + b;
    const maxZ = act === 'relu' ? 8 : act === 'sigmoid' ? 3 : 2;
    const ok = z !== 0 && Math.abs(z) <= maxZ && prods.some((p) => p < 0) && (act === 'relu' ? true : Math.abs(z) >= 0.5);
    if (!ok && attempt < 200) continue;

    const ans = actValue(act, z);
    const fmtV = (v: number) => `$${num(v, 3)}$`;
    // Output of the activation at argument zz, shown to exactly 3 d.p. when it is a rounded value
    // (sigmoid/tanh of a non-zero number), so every option matches "give your answer to 3 decimal places".
    const actText = (zz: number) => (ACT_INFO[act].dp && zz !== 0 ? `$${actValue(act, zz).toFixed(3)}$` : fmtV(actValue(act, zz)));
    const ansText = actText(z);
    const fTex = act === 'relu' ? '\\text{ReLU}' : act === 'sigmoid' ? '\\sigma' : '\\tanh';
    /** e.g. "sigma(1) approx 0.731" written in LaTeX (maths only, no dollar signs). */
    const outEq = (zz: number) => `${fTex}(${num(zz)}) ${ACT_INFO[act].dp && zz !== 0 ? '\\approx' : '='} ${actText(zz).slice(1, -1)}`;
    const nameA = ACT_INFO[act].name;
    const pool: Cand[] = [
      { v: actValue(act, z - b), text: actText(z - b), why: `This leaves out the bias: $z$ would be $${num(z - b)}$ instead of $${num(z)}$, and then $${outEq(z - b)}$. The bias $b = ${num(b)}$ must be added to the weighted sum.` },
      { v: z, text: fmtV(z), why: `This is the weighted sum $z = ${num(z)}$ **before** the activation. The neuron's output is $f(z)$, so the ${nameA} function still has to be applied.` },
      { v: actValue(act, zAbs), text: actText(zAbs), why: `This drops the minus signs: every product $w_ix_i$ was treated as positive, giving $z = ${num(zAbs)}$ and then $${outEq(zAbs)}$. A negative weight times a positive input (or the other way round) gives a negative product.` },
      { v: actValue(act, z - 2 * b), text: actText(z - 2 * b), why: `This subtracts the bias instead of adding it, giving $z = ${num(z - 2 * b)}$ and then $${outEq(z - 2 * b)}$. The bias is always **added**: $z = w_1x_1 + w_2x_2 + \\dots + b$.` },
    ];
    if (act === 'sigmoid') pool.splice(1, 0, { v: r3(sigmoid(-z)), text: `$${r3(sigmoid(-z)).toFixed(3)}$`, why: `This is $\\frac{1}{1 + ${expTex(z)}}$: the minus sign in $e^{-z}$ was lost, which gives $\\sigma(${num(-z)})$ instead of $\\sigma(${num(z)})$. Check: a ${z > 0 ? 'positive' : 'negative'} $z$ must give an output ${z > 0 ? 'above' : 'below'} $0.5$.` });
    if (act === 'tanh') pool.splice(1, 0, { v: r3(sigmoid(z)), text: `$${r3(sigmoid(z)).toFixed(3)}$`, why: `This is the **sigmoid** of $z$, $\\frac{1}{1 + e^{-z}}$, not tanh. tanh has outputs between $-1$ and $1$, with $\\tanh(0) = 0$.` });
    if (act === 'relu') pool.push({ v: Math.min(0, z), text: fmtV(Math.min(0, z)), why: 'This uses $\\min(0, z)$ instead of $\\max(0, z)$. ReLU keeps positive values and replaces negative values by $0$.' });
    const ds = pickDistinct(ans, ansText, pool);
    if (ds.length < 3 && attempt < 200) continue;
    let k = 1;
    while (ds.length < 3) {
      const v = ans + k;
      if (!ds.some((d) => Math.abs(d.v - v) < 1e-9)) ds.push({ v, text: fmtV(v), why: 'This comes from an arithmetic slip when adding up the products and the bias.' });
      k++;
    }

    const xs = x.map((xi, i) => `$x_{${i + 1}} = ${num(xi)}$`).join(', ');
    const ws = w.map((wi, i) => `$w_{${i + 1}} = ${num(wi)}$`).join(', ');
    const zDef = w.map((_, i) => `w_{${i + 1}}x_{${i + 1}}`).join(' + ') + ' + b';
    const dpNote = ACT_INFO[act].dp ? ', to 3 decimal places' : '';
    const stem = `A neuron with ${nameA} activation, ${ACT_INFO[act].formula}, has inputs ${xs}, weights ${ws} and bias $b = ${num(b)}$. What is its output${dpNote}?`;
    const solution = steps(
      `A neuron works in two stages. First it calculates a **weighted sum** $z = ${zDef}$: each input $x$ times its **weight** $w$, plus the **bias** $b$. Then it puts $z$ through its **activation function**, here ${nameA}.`,
      'Multiply each input by its weight, keeping the signs:\n\n' +
        prods.map((p, i) => `- $w_{${i + 1}}x_{${i + 1}} = ${num(w[i])} \\times ${paren(x[i])} = ${num(p)}$`).join('\n'),
      `Add the products, then add the bias: $z = ${chain([...prods, b])} = ${num(z)}$.`,
      ...actSteps(act, z, ans),
    );
    const actRule =
      act === 'relu'
        ? 'ReLU keeps a positive $z$ and turns a negative $z$ into 0.'
        : act === 'sigmoid'
          ? 'The sigmoid gives $\\frac{1}{1 + e^{-z}}$, which is above 0.5 for positive $z$ and below 0.5 for negative $z$.'
          : 'tanh has the same sign as $z$ and stays between $-1$ and 1.';
    return {
      stem,
      answer: ansText,
      answerValue: ans,
      distractors: ds.slice(0, 3).map((d) => ({ text: d.text, value: d.v, why: d.why })),
      asking: `What number comes out of this ${nameA} neuron?`,
      solution,
      conclusion:
        act === 'relu'
          ? `The weighted sum is $z = ${num(z)}$, which is ${z >= 0 ? 'positive, so ReLU keeps it and' : 'negative, so ReLU turns it into 0 and'} the output is ${ansText}.`
          : `The weighted sum is $z = ${num(z)}$, and the ${nameA} function turns that into ${ansText}.`,
      keyIdea: `For a neuron's output: multiply each input by its weight, keeping the signs, then add the products and the bias to get $z$. Then apply the activation. ${actRule}`,
    };
  }
}

// ---------------------------------------------------------------- forward pass through a 2-2-1 ReLU network
function genForwardPass(rng: Rng) {
  for (let attempt = 0; ; attempt++) {
    const x = [rng.int(-2, 3), rng.int(-2, 3)];
    if (x[0] === 0 && x[1] === 0) continue;
    const W = [
      [rng.intNonZero(-3, 3), rng.intNonZero(-3, 3)],
      [rng.intNonZero(-3, 3), rng.intNonZero(-3, 3)],
    ];
    const bh = [rng.intNonZero(-3, 3), rng.intNonZero(-3, 3)];
    const v = [rng.intNonZero(-3, 3), rng.intNonZero(-3, 3)];
    const c = rng.intNonZero(-3, 3);
    const zh = W.map((row, i) => row[0] * x[0] + row[1] * x[1] + bh[i]);
    // one hidden neuron must be switched off by ReLU and the other must pass a positive value
    const ok = (zh[0] < 0 && zh[1] > 0) || (zh[0] > 0 && zh[1] < 0);
    if (!ok && attempt < 500) continue;
    const h = zh.map(relu);
    const y = v[0] * h[0] + v[1] * h[1] + c;
    const noRelu = v[0] * zh[0] + v[1] * zh[1] + c;
    const hNoBias = W.map((row) => relu(row[0] * x[0] + row[1] * x[1]));
    const yNoHiddenBias = v[0] * hNoBias[0] + v[1] * hNoBias[1] + c;
    const t = (n: number) => `$${num(n)}$`;
    const neg = zh[0] < 0 ? 0 : 1;
    const pool: Cand[] = [
      { v: noRelu, text: t(noRelu), why: `This forgets the ReLU on $h_{${neg + 1}}$ and uses its negative weighted sum $${num(zh[neg])}$. ReLU turns any negative value into $0$.` },
      { v: y - c, text: t(y - c), why: `The hidden layer is right, but the output bias $${num(c)}$ was forgotten.` },
      { v: yNoHiddenBias, text: t(yNoHiddenBias), why: `This forgets the hidden biases: then $h_1 = ${num(hNoBias[0])}$ and $h_2 = ${num(hNoBias[1])}$, giving $${num(yNoHiddenBias)}$. Every neuron adds its own bias before the activation.` },
      { v: noRelu - c, text: t(noRelu - c), why: 'This forgets the ReLU on the switched-off hidden neuron **and** forgets the output bias.' },
      { v: relu(y), text: t(relu(y)), why: 'This applies ReLU to the output as well. The question says the output neuron has **no** activation, so a negative output stays negative.' },
    ];
    const ds = pickDistinct(y, t(y), pool);
    if (ds.length < 3 && attempt < 500) continue;
    let k = 1;
    while (ds.length < 3) {
      if (!ds.some((d) => d.v === y + k)) ds.push({ v: y + k, text: t(y + k), why: 'This comes from an arithmetic slip in the output neuron.' });
      k++;
    }
    const hiddenStep = (i: number) =>
      `$h_${i + 1}$ takes $x_1 = ${num(x[0])}$ and $x_2 = ${num(x[1])}$, with weights $${num(W[i][0])}$ and $${num(W[i][1])}$ and bias $${num(bh[i])}$. So $z = ${sumTex(W[i], x, bh[i])} = ${chain([W[i][0] * x[0], W[i][1] * x[1], bh[i]])} = ${num(zh[i])}$. ` +
      (zh[i] < 0 ? `That is negative, so ReLU turns it into 0: $h_${i + 1} = \\max(0, ${num(zh[i])}) = 0$.` : `That is not negative, so ReLU keeps it: $h_${i + 1} = \\max(0, ${num(zh[i])}) = ${num(h[i])}$.`);
    const solution = steps(
      'Work forwards one layer at a time. Each neuron multiplies each input by its weight, adds its **bias**, then applies its activation. **ReLU** means $\\max(0, z)$: keep $z$ if it is positive, otherwise output 0.',
      hiddenStep(0),
      hiddenStep(1),
      `Now $h_1 = ${num(h[0])}$ and $h_2 = ${num(h[1])}$ are the inputs to $y$. Its weights are $${num(v[0])}$ and $${num(v[1])}$, its bias is $${num(c)}$, and it has no activation. So $y = ${sumTex(v, h, c)} = ${chain([v[0] * h[0], v[1] * h[1], c])} = ${num(y)}$.`,
    );
    return {
      stem: `A network has inputs $x_1 = ${num(x[0])}$ and $x_2 = ${num(x[1])}$, hidden ReLU neurons $h_1$ and $h_2$, and an output $y$ with **no** activation. Using the weights and biases in the table, what is $y$?`,
      table: {
        caption: 'Weights and biases',
        headers: ['Neuron', 'Weight on 1st input', 'Weight on 2nd input', 'Bias', 'Activation'],
        rows: [
          ['$h_1$ (inputs $x_1$, $x_2$)', W[0][0], W[0][1], bh[0], 'ReLU'],
          ['$h_2$ (inputs $x_1$, $x_2$)', W[1][0], W[1][1], bh[1], 'ReLU'],
          ['$y$ (inputs $h_1$, $h_2$)', v[0], v[1], c, 'none'],
        ],
      },
      answer: t(y),
      answerValue: y,
      distractors: ds.slice(0, 3).map((d) => ({ text: d.text, value: d.v, why: d.why })),
      asking: 'What number comes out at $y$ when these inputs pass through the network?',
      solution,
      conclusion: `$h_1 = ${num(h[0])}$ and $h_2 = ${num(h[1])}$ feed into the output neuron, which adds its bias and has no activation, so the answer is ${t(y)}.`,
      keyIdea: 'For a forward pass, compute one neuron at a time, left to right: weighted sum plus bias, then activation. Write each result down, because those results are the inputs of the next layer.',
    };
  }
}

// ---------------------------------------------------------------- counting parameters
function genParamCount(rng: Rng) {
  for (let attempt = 0; ; attempt++) {
    const nIn = rng.pick([3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 64]);
    const hidden = Array.from({ length: rng.pick([1, 1, 2]) }, () => rng.pick([3, 4, 5, 6, 8, 10, 12, 16, 20, 32]));
    const nOut = rng.pick([1, 2, 3, 4, 5, 10]);
    const sizes = [nIn, ...hidden, nOut];
    const pairs = sizes.slice(1).map((n, i) => ({ a: sizes[i], b: n }));
    const weights = pairs.reduce((s, p) => s + p.a * p.b, 0);
    const biases = pairs.reduce((s, p) => s + p.b, 0);
    const total = weights + biases;
    const product = sizes.reduce((s, n) => s * n, 1);
    const t = (n: number) => `$${num(n)}$`;
    const pool: Cand[] = [
      { v: weights, text: t(weights), why: `This is the number of **weights** only. The $${num(biases)}$ biases are trainable parameters too.` },
      { v: total + nIn, text: t(total + nIn), why: `This gives each of the $${nIn}$ inputs a bias as well. Inputs are just data; only hidden and output neurons have biases.` },
      { v: product, text: t(product), why: 'This multiplies all the layer sizes together. Weights only connect **neighbouring** layers, so multiply each neighbouring pair and then add.' },
      { v: total - nOut, text: t(total - nOut), why: `This forgets the $${nOut}$ bias${nOut === 1 ? '' : 'es'} of the output layer. Every output neuron has its own bias too.` },
      { v: weights + pairs.length, text: t(weights + pairs.length), why: 'This gives each layer a single shared bias. In fact every neuron in a hidden or output layer has its **own** bias.' },
    ];
    const ds = pickDistinct(total, t(total), pool);
    if (ds.length < 3 && attempt < 200) continue;
    let k = 1;
    while (ds.length < 3) {
      if (!ds.some((d) => d.v === total + k)) ds.push({ v: total + k, text: t(total + k), why: 'This comes from an addition slip when totalling the layers.' });
      k++;
    }
    const hiddenDesc =
      hidden.length === 1 ? `one hidden layer of $${hidden[0]}$ neurons` : `two hidden layers with $${hidden[0]}$ and $${hidden[1]}$ neurons`;
    const stem = `A fully connected network has $${nIn}$ inputs, ${hiddenDesc} and $${nOut}$ output neuron${nOut === 1 ? '' : 's'}, with a bias on every hidden and output neuron. How many trainable parameters (weights plus biases) does it have?`;
    const solution = steps(
      '**Fully connected** means every neuron in a layer links to every neuron in the next layer. Each link has one **weight**. A **bias** is one extra trainable number on each hidden or output neuron.',
      'Go through each pair of neighbouring layers. The weights are left size times right size. The biases equal the right size, because each receiving neuron has one:\n\n' +
        table(
          ['Layers', 'Weights', 'Biases'],
          pairs.map((p) => [`$${p.a} \\to ${p.b}$`, `$${p.a} \\times ${p.b} = ${num(p.a * p.b)}$`, `$${p.b}$`]),
        ),
      `Add up the weights: $${pairs.map((p) => num(p.a * p.b)).join(' + ')} = ${num(weights)}$.`,
      `Add up the biases: $${pairs.map((p) => num(p.b)).join(' + ')} = ${num(biases)}$. The input layer has none, because inputs are just data.`,
      `Add both totals: $${num(weights)} + ${num(biases)} = ${num(total)}$.`,
    );
    return {
      stem,
      answer: t(total),
      answerValue: total,
      distractors: ds.slice(0, 3).map((d) => ({ text: d.text, value: d.v, why: d.why })),
      asking: 'How many weights and biases does this network have altogether?',
      solution,
      conclusion: `There are ${num(weights)} weights and ${num(biases)} biases, which makes ${t(total)} trainable parameters.`,
      keyIdea: 'For a fully connected network, use a table: for each neighbouring pair, weights $=$ left size $\\times$ right size, and biases $=$ right size. Add the columns. Never multiply all the layers together, and never give inputs a bias.',
    };
  }
}

export const generators: Generator[] = [
  {
    id: 'gen-neural-networks-single-neuron',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    title: 'Output of a single neuron (ReLU, sigmoid or tanh)',
    generate: genSingleNeuron,
  },
  {
    id: 'gen-neural-networks-forward-pass',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    title: 'Forward pass through a small ReLU network',
    generate: genForwardPass,
  },
  {
    id: 'gen-neural-networks-param-count',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    title: 'Count the weights and biases in a network',
    generate: genParamCount,
  },
];
