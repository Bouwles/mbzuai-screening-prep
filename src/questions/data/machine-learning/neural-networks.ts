import type { StaticQuestion } from '../../../types';
import { round } from '../../../lib/mathx';

// Small helpers used by the answer checks (they re-derive every answer from the raw inputs).
const relu = (z: number) => Math.max(0, z);
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const step = (z: number) => (z >= 0 ? 1 : 0);
const weighted = (x: number[], w: number[], b: number) => x.reduce((acc, xi, i) => acc + xi * w[i], 0) + b;
/** Total parameters (weights + biases) of a fully connected network with these layer sizes. */
const paramCount = (sizes: number[]) => sizes.slice(1).reduce((acc, n, i) => acc + sizes[i] * n + n, 0);
/** Name of the 2-input logic gate with this truth table (inputs 00, 01, 10, 11). */
function gateName(f: (a: number, b: number) => number): string {
  const tt = [f(0, 0), f(0, 1), f(1, 0), f(1, 1)].join('');
  const names: Record<string, string> = { '0001': 'AND', '0111': 'OR', '0110': 'XOR', '1110': 'NAND', '1001': 'XNOR', '1000': 'NOR' };
  return names[tt] ?? tt;
}

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'neural-networks-001',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'A neuron has inputs $x_1 = 2$, $x_2 = 3$, weights $w_1 = 0.4$, $w_2 = -0.2$ and bias $b = 0.5$. What is the weighted sum $z = w_1x_1 + w_2x_2 + b$?',
    options: ['$0.2$', '$1.9$', '$0.7$', '$-0.3$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Multiply each input by its own weight, add the products, then add the bias.\n\n' +
        '- $w_1x_1 = 0.4 \\times 2 = 0.8$\n' +
        '- $w_2x_2 = -0.2 \\times 3 = -0.6$\n\n' +
        'Now add them together with the bias:\n\n' +
        '$$z = 0.8 - 0.6 + 0.5 = 0.7$$',
      whyWrong: [
        'This is $0.8 - 0.6 = 0.2$: the products are right but the bias $b = 0.5$ was never added.',
        'This is $0.8 + 0.6 + 0.5 = 1.9$: the minus sign on $w_2 = -0.2$ was dropped, so the second product was added instead of subtracted.',
        null,
        'This is $0.8 - 0.6 - 0.5 = -0.3$: the bias was subtracted instead of added. The bias is always **added** to the weighted sum.',
      ],
      keyIdea: 'A neuron first computes $z = w_1x_1 + w_2x_2 + \\dots + b$: multiply each input by its weight, add everything up, then add the bias.',
    },
    check: {
      optionValues: [0.2, 1.9, 0.7, -0.3],
      compute: () => weighted([2, 3], [0.4, -0.2], 0.5),
    },
  },
  {
    id: 'neural-networks-002',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'Which activation function always outputs a value strictly between $0$ and $1$, so that it can be read as a probability?',
    options: [
      'Sigmoid, $\\sigma(z) = \\frac{1}{1 + e^{-z}}$',
      'ReLU, $f(z) = \\max(0, z)$',
      'tanh, $f(z) = \\tanh(z)$',
      'Identity, $f(z) = z$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Look at the range (the set of possible outputs) of each function:\n\n' +
        '| Function | Range |\n' +
        '| --- | --- |\n' +
        '| Sigmoid | between $0$ and $1$ |\n' +
        '| ReLU | $0$ up to any positive number |\n' +
        '| tanh | between $-1$ and $1$ |\n' +
        '| Identity | any real number |\n\n' +
        'For the sigmoid, $e^{-z}$ is always positive, so the denominator $1 + e^{-z}$ is always bigger than $1$. That makes $\\sigma(z)$ always less than $1$ and always more than $0$. Only the sigmoid stays inside $(0, 1)$, so it can be read as a probability (this is exactly what logistic regression uses).',
      whyWrong: [
        null,
        'ReLU outputs $0$ for negative inputs but has **no upper limit**: for example $\\max(0, 7) = 7$, which cannot be a probability.',
        'tanh is S-shaped like the sigmoid, but its outputs lie between $-1$ and $1$, so it can give negative values, which a probability cannot be.',
        'The identity function just passes $z$ through, so the output can be any real number, positive or negative, with no limits at all.',
      ],
      keyIdea: 'Sigmoid squashes any number into the interval $(0, 1)$; tanh squashes into $(-1, 1)$; ReLU is $0$ or more with no upper limit.',
    },
  },
  {
    id: 'neural-networks-003',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'The chart shows the output $f(z)$ of an activation function (rounded to 2 decimal places). Which function is it?',
    chart: {
      kind: 'line',
      title: 'Output of an activation function',
      xLabel: 'Input z',
      yLabel: 'Output f(z)',
      categories: ['-3', '-2', '-1', '0', '1', '2', '3'],
      series: [{ name: 'f(z)', values: [-1, -0.96, -0.76, 0, 0.76, 0.96, 1] }],
      yMin: -1.2,
      yMax: 1.2,
    },
    options: ['Sigmoid', 'tanh', 'ReLU', 'Step function'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Read three facts off the chart:\n\n' +
        '1. The outputs go **negative** for negative inputs (down to about $-1$).\n' +
        '2. The curve passes through the origin: $f(0) = 0$.\n' +
        '3. It is a smooth S-shape that levels off just below $1$ and just above $-1$.\n\n' +
        'An S-shaped curve with range $(-1, 1)$ through the origin is the **tanh** function. Check one value on a calculator: $\\tanh(1) \\approx 0.76$, which matches the chart.',
      whyWrong: [
        'The sigmoid is also S-shaped, but its outputs are always between $0$ and $1$ and $\\sigma(0) = 0.5$. This chart has negative outputs and passes through $0$.',
        null,
        'ReLU gives exactly $0$ for every negative input and keeps growing for positive inputs (ReLU of $3$ is $3$). This chart is negative on the left and levels off below $1$.',
        'A step function jumps straight from one value to another and has only two output values. This chart changes smoothly through many values.',
      ],
      keyIdea: 'tanh is the S-shaped activation with outputs between $-1$ and $1$ and $\\tanh(0) = 0$; the sigmoid is S-shaped too but lives between $0$ and $1$ with $\\sigma(0) = 0.5$.',
    },
    check: {
      optionValues: ['sigmoid', 'tanh', 'relu', 'step'],
      compute: () => {
        const zs = [-3, -2, -1, 0, 1, 2, 3];
        const ys = [-1, -0.96, -0.76, 0, 0.76, 0.96, 1];
        const fns: Record<string, (z: number) => number> = { sigmoid, tanh: Math.tanh, relu, step };
        const fits = Object.keys(fns).filter((k) => zs.every((z, i) => Math.abs(fns[k](z) - ys[i]) < 0.01));
        return fits.join(',');
      },
    },
  },
  {
    id: 'neural-networks-004',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'A neuron computes $z = w_1x_1 + w_2x_2 + b$ and outputs $f(z)$. What is the job of the **bias** $b$?',
    options: [
      'It scales each input by its importance',
      'It squashes $z$ into a fixed range',
      'It measures the prediction error',
      'It shifts $z$, moving the point where the neuron switches on',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each part of a neuron has its own job:\n\n' +
        '- **Weights** $w_1, w_2$: multiply the inputs, so they control how much each input matters.\n' +
        '- **Bias** $b$: a single number **added** to the weighted sum. It shifts $z$ up or down whatever the inputs are.\n' +
        '- **Activation function** $f$: turns $z$ into the output (for example squashing it between $0$ and $1$).\n\n' +
        'Example: with a step activation that switches on when $z \\ge 0$, a bias of $b = -3$ means the weighted inputs must add up to at least $3$ before the neuron fires. So the bias sets the threshold. Even if every input is $0$, the bias still lets $z$ be non-zero. Like the weights, the bias is learned during training.',
      whyWrong: [
        'That describes the **weights**. Each input has its own weight that multiplies it; the bias is not multiplied by any input.',
        'That is the job of the **activation function** (for example the sigmoid squashes into $(0, 1)$), not the bias.',
        'That is the **loss function** (error), which is used during training. The bias is part of the neuron itself.',
        null,
      ],
      keyIdea: 'The bias is a learned number added to the weighted sum; it shifts the neuron\'s switch-on point, while the weights scale the inputs.',
    },
  },
  {
    id: 'neural-networks-005',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A sigmoid neuron, $\\sigma(z) = \\frac{1}{1 + e^{-z}}$, has inputs $x_1 = 2$, $x_2 = 4$, weights $w_1 = 1.5$, $w_2 = -1$ and bias $b = 1$. What is its output?',
    options: ['$0$', '$0.5$', '$1$', '$0.269$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: weighted sum.**\n\n' +
        '$$z = 1.5 \\times 2 + (-1) \\times 4 + 1 = 3 - 4 + 1 = 0$$\n\n' +
        '**Step 2: activation.** Put $z = 0$ into the sigmoid. Since $e^{0} = 1$:\n\n' +
        '$$\\sigma(0) = \\frac{1}{1 + e^{0}} = \\frac{1}{1 + 1} = 0.5$$\n\n' +
        'A sigmoid neuron outputs exactly $0.5$ when its weighted sum is $0$: it is "undecided".',
      whyWrong: [
        'This mixes the sigmoid up with ReLU or tanh, which both give $0$ at $z = 0$. The sigmoid gives $\\frac{1}{1 + 1} = 0.5$ there.',
        null,
        'This is $e^{0} = 1$: you stopped after working out $e^{-z}$ and forgot to put it into $\\frac{1}{1 + e^{-z}}$.',
        'This is $\\sigma(-1) \\approx 0.269$: the bias was left out, so $z = 3 - 4 = -1$ instead of $0$.',
      ],
      keyIdea: 'Compute $z$ first, then apply the activation; the sigmoid always gives $\\sigma(0) = 0.5$.',
    },
    check: {
      optionValues: [0, 0.5, 1, 0.269],
      compute: () => round(sigmoid(weighted([2, 4], [1.5, -1], 1)), 3),
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'neural-networks-006',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A fully connected network has $4$ inputs, one hidden layer of $5$ neurons and $3$ output neurons, with a bias on every hidden and output neuron. How many trainable parameters (weights plus biases) does it have?',
    options: ['$35$', '$60$', '$47$', '$43$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Count layer by layer. Between a layer of $n_{\\text{in}}$ neurons and a layer of $n_{\\text{out}}$ neurons there are $n_{\\text{in}} \\times n_{\\text{out}}$ weights (every neuron connects to every neuron in the next layer) plus $n_{\\text{out}}$ biases (one per receiving neuron).\n\n' +
        '- Input to hidden: $4 \\times 5 = 20$ weights and $5$ biases, so $25$.\n' +
        '- Hidden to output: $5 \\times 3 = 15$ weights and $3$ biases, so $18$.\n\n' +
        'Total: $25 + 18 = 43$ parameters.\n\n' +
        'The input layer has no bias: it just holds the data.',
      whyWrong: [
        'This is $20 + 15 = 35$, the number of **weights** only. The $5 + 3 = 8$ biases are trainable parameters too.',
        'This is $4 \\times 5 \\times 3 = 60$: the layer sizes were all multiplied together. Weights only connect **neighbouring** layers, so you multiply each neighbouring pair and add.',
        'This is $35 + 4 + 5 + 3 = 47$: it gives a bias to the $4$ input neurons as well. Inputs are just data and have no bias; only hidden and output neurons do.',
        null,
      ],
      keyIdea: 'Each layer-to-layer connection contributes $n_{\\text{in}} \\times n_{\\text{out}}$ weights plus $n_{\\text{out}}$ biases; add these up over all neighbouring pairs of layers.',
    },
    check: { optionValues: [35, 60, 47, 43], compute: () => paramCount([4, 5, 3]) },
  },
  {
    id: 'neural-networks-007',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A network has inputs $x_1 = 1$ and $x_2 = 2$, hidden ReLU neurons $h_1$ and $h_2$, and an output $y$ with **no** activation. Using the weights and biases in the table, what is $y$?',
    table: {
      caption: 'Weights and biases',
      headers: ['Neuron', 'Weight on 1st input', 'Weight on 2nd input', 'Bias', 'Activation'],
      rows: [
        ['$h_1$ (inputs $x_1$, $x_2$)', 2, 1, -1, 'ReLU'],
        ['$h_2$ (inputs $x_1$, $x_2$)', -1, -1, 1, 'ReLU'],
        ['$y$ (inputs $h_1$, $h_2$)', 2, 3, 1, 'none'],
      ],
    },
    options: ['$7$', '$1$', '$6$', '$9$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Work forwards one layer at a time (the **forward pass**). Remember $\\text{ReLU}(z) = \\max(0, z)$.\n\n' +
        '**Hidden layer**\n\n' +
        '- $h_1$: $z = 2(1) + 1(2) - 1 = 3$, so $h_1 = \\max(0, 3) = 3$.\n' +
        '- $h_2$: $z = (-1)(1) + (-1)(2) + 1 = -2$, so $h_2 = \\max(0, -2) = 0$.\n\n' +
        '**Output layer** (inputs are $h_1 = 3$ and $h_2 = 0$, no activation):\n\n' +
        '$$y = 2(3) + 3(0) + 1 = 7$$',
      whyWrong: [
        null,
        'This is what you get if you forget the ReLU on $h_2$ and use $-2$: $y = 2(3) + 3(-2) + 1 = 1$. ReLU turns any negative value into $0$.',
        'This is $2(3) + 3(0) = 6$: the hidden layer is right but the output bias of $1$ was forgotten.',
        'This is what you get if you forget the hidden biases: $h_1 = \\max(0, 4) = 4$ and $h_2 = \\max(0, -3) = 0$, giving $y = 2(4) + 1 = 9$.',
      ],
      keyIdea: 'In a forward pass, compute each layer\'s weighted sums, apply the activation, and feed those outputs into the next layer.',
    },
    check: {
      optionValues: [7, 1, 6, 9],
      compute: () => {
        const x = [1, 2];
        const h1 = relu(weighted(x, [2, 1], -1));
        const h2 = relu(weighted(x, [-1, -1], 1));
        return weighted([h1, h2], [2, 3], 1);
      },
    },
  },
  {
    id: 'neural-networks-008',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A network has three hidden layers, but every neuron uses the identity activation $f(z) = z$. Which statement is TRUE?',
    options: [
      'With enough neurons it can learn any curved boundary',
      'It cannot be trained, because a linear function has no derivative',
      'It is equivalent to a single linear layer',
      'It can solve XOR, because it has more than one layer',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Each layer computes a linear function of its input (multiply by weights, add biases). A linear function of a linear function is still linear. For example, if $h = 2x + 1$ and $y = 3h - 4$, then\n\n' +
        '$$y = 3(2x + 1) - 4 = 6x - 1$$\n\n' +
        'which is a single linear neuron. However many linear layers you stack, the whole network collapses into **one** linear layer. So it can only draw straight-line (flat) decision boundaries, exactly like a single layer.\n\n' +
        'This is why hidden layers need a **non-linear** activation such as ReLU, sigmoid or tanh: the non-linearity is what lets depth add power.',
      whyWrong: [
        'This "universal approximation" property only holds when the hidden neurons use a **non-linear** activation. A purely linear network can only produce straight-line boundaries.',
        'A linear function does have a derivative: $f(z) = z$ has $f\'(z) = 1$ everywhere. The network can be trained; it just cannot learn anything that a single linear layer could not.',
        null,
        'XOR is not linearly separable, and a stack of linear layers is still one linear function, so it cannot solve XOR. XOR needs a hidden layer **with a non-linear activation**.',
      ],
      keyIdea: 'Without non-linear activations, any number of layers collapses into one linear layer; non-linearity is what makes depth useful.',
    },
  },
  {
    id: 'neural-networks-009',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A sigmoid neuron, $\\sigma(z) = \\frac{1}{1 + e^{-z}}$, has inputs $x_1 = 2$, $x_2 = 1$, weights $w_1 = 0.5$, $w_2 = 1.5$ and bias $b = -0.5$. What is its output, to 3 decimal places?',
    options: ['$0.924$', '$0.881$', '$0.119$', '$2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        '**Step 1: weighted sum.**\n\n' +
        '$$z = 0.5 \\times 2 + 1.5 \\times 1 - 0.5 = 1 + 1.5 - 0.5 = 2$$\n\n' +
        '**Step 2: sigmoid.** On a calculator, $e^{-2} \\approx 0.1353$, so\n\n' +
        '$$\\sigma(2) = \\frac{1}{1 + e^{-2}} \\approx \\frac{1}{1.1353} \\approx 0.881$$\n\n' +
        'Sanity check: $z$ is positive, so the output must be above $0.5$ and below $1$.',
      whyWrong: [
        'This is $\\sigma(2.5) \\approx 0.924$: the bias was left out, so $z = 1 + 1.5 = 2.5$.',
        null,
        'This is $\\frac{1}{1 + e^{2}} \\approx 0.119$: the minus sign in $e^{-z}$ was dropped. A positive $z$ must give an output above $0.5$.',
        'This is $z = 2$, the weighted sum **before** the activation. A sigmoid output can never be bigger than $1$.',
      ],
      keyIdea: 'Weighted sum first, then the sigmoid; a positive $z$ always gives an output between $0.5$ and $1$.',
    },
    check: {
      optionValues: [0.924, 0.881, 0.119, 2],
      compute: () => round(sigmoid(weighted([2, 1], [0.5, 1.5], -0.5)), 3),
    },
  },
  {
    id: 'neural-networks-010',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'A weight is $w = 0.8$, the gradient of the loss is $\\frac{\\partial L}{\\partial w} = -2.5$ and the learning rate is $\\eta = 0.1$. What is $w$ after one gradient descent update?',
    options: ['$0.55$', '$3.3$', '$-1.7$', '$1.05$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The gradient descent rule moves each weight a small step **against** the gradient (downhill on the loss):\n\n' +
        '$$w_{\\text{new}} = w - \\eta \\frac{\\partial L}{\\partial w}$$\n\n' +
        'Substitute:\n\n' +
        '$$w_{\\text{new}} = 0.8 - 0.1 \\times (-2.5) = 0.8 + 0.25 = 1.05$$\n\n' +
        'Sense check: the gradient is negative, which means the loss **decreases** as $w$ increases, so $w$ should go up. It does.',
      whyWrong: [
        'This is $0.8 + 0.1 \\times (-2.5) = 0.55$: the step was added instead of subtracted, which moves the weight **uphill** and makes the loss bigger.',
        'This is $0.8 - (-2.5) = 3.3$: the learning rate was forgotten, so the whole gradient was used as the step.',
        'This is $0.8 + (-2.5) = -1.7$: the learning rate was forgotten **and** the step was added instead of subtracted.',
        null,
      ],
      keyIdea: 'Gradient descent update: $w_{\\text{new}} = w - \\eta \\frac{\\partial L}{\\partial w}$; a negative gradient makes the weight increase.',
    },
    check: { optionValues: [0.55, 3.3, -1.7, 1.05], compute: () => 0.8 - 0.1 * -2.5 },
  },
  {
    id: 'neural-networks-011',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'In **backpropagation**, what is calculated for every weight in the network?',
    options: [
      'The partial derivative of the loss with respect to that weight',
      'The output of each neuron, working forwards',
      'The derivative of the loss with respect to the input data',
      'A new random value, kept if the loss falls',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'One training step has three parts:\n\n' +
        '1. **Forward pass:** feed the input through the network to get a prediction and compute the loss (the error).\n' +
        '2. **Backward pass (backpropagation):** use the chain rule to work out $\\frac{\\partial L}{\\partial w}$ for every weight (and bias), starting at the output layer and moving backwards layer by layer, re-using the results from the layer after.\n' +
        '3. **Update:** gradient descent changes each weight, $w \\leftarrow w - \\eta \\frac{\\partial L}{\\partial w}$.\n\n' +
        'So backpropagation computes the gradient of the loss with respect to each **weight**: how much the loss would change if that weight changed a little.',
      whyWrong: [
        null,
        'That is the **forward pass**, which happens before backpropagation. Backpropagation goes in the opposite direction and computes gradients, not neuron outputs.',
        'The inputs are the fixed training data; training never changes them. Gradients are taken with respect to the **weights** (the parameters being learned).',
        'That describes random search. Backpropagation is not random: it uses calculus (the chain rule) to find the exact direction that lowers the loss.',
      ],
      keyIdea: 'Backpropagation uses the chain rule, from the output backwards, to compute the gradient of the loss with respect to every weight; gradient descent then uses those gradients.',
    },
  },
  {
    id: 'neural-networks-012',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A perceptron has binary inputs $x_1, x_2$, weights $w_1 = w_2 = 1$, bias $b = -1.5$ and a step activation: output $1$ if $z \\ge 0$, otherwise $0$. Which logic gate does it implement?',
    options: ['OR', 'XOR', 'AND', 'NAND'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Here $z = x_1 + x_2 - 1.5$. Try all four input pairs:\n\n' +
        '| $x_1$ | $x_2$ | $z$ | output |\n' +
        '| --- | --- | --- | --- |\n' +
        '| $0$ | $0$ | $-1.5$ | $0$ |\n' +
        '| $0$ | $1$ | $-0.5$ | $0$ |\n' +
        '| $1$ | $0$ | $-0.5$ | $0$ |\n' +
        '| $1$ | $1$ | $0.5$ | $1$ |\n\n' +
        'The output is $1$ only when **both** inputs are $1$: this is the **AND** gate. The bias of $-1.5$ acts as a threshold that one input alone cannot reach.',
      whyWrong: [
        'OR would output $1$ when just one input is $1$, but then $z = 1 - 1.5 = -0.5 < 0$ and the output is $0$. A bias between $-1$ and $0$ (such as $-0.5$) would give OR.',
        'XOR outputs $0$ for inputs $(1, 1)$, but here $z = 0.5 \\ge 0$ gives $1$. In fact no single perceptron can compute XOR, because it can only separate the inputs with one straight line.',
        null,
        'NAND is the opposite of AND: it outputs $1$ for $(0, 0)$. Here $(0, 0)$ gives $z = -1.5 < 0$, so the output is $0$.',
      ],
      keyIdea: 'To identify a perceptron\'s logic gate, compute $z$ for all four binary input pairs and read off the truth table.',
    },
    check: {
      optionValues: ['OR', 'XOR', 'AND', 'NAND'],
      compute: () => gateName((a, b) => step(weighted([a, b], [1, 1], -1.5))),
    },
  },
  {
    id: 'neural-networks-013',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'Arrays are indexed from 1. This pseudocode computes the output of a ReLU neuron. What does it print?',
    code: {
      lang: 'pseudocode',
      source:
        'X = [0, 3, 1]\n' +
        'W = [2, -1, 1]\n' +
        'b = -1\n' +
        'z = b\n' +
        'for i = 1 to 3\n' +
        '   z = z + X[i] * W[i]\n' +
        'end for\n' +
        'print(max(0, z)) // max gives the larger value',
    },
    options: [
      '$0$',
      '$-3$',
      '$3$',
      'Infinite loop',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'The loop adds each input times its weight to `z`, which starts at the bias $-1$.\n\n' +
        '| $i$ | `X[i]` | `W[i]` | `X[i] * W[i]` | `z` |\n' +
        '|---|---|---|---|---|\n' +
        '| 1 | 0 | 2 | 0 | $-1$ |\n' +
        '| 2 | 3 | $-1$ | $-3$ | $-4$ |\n' +
        '| 3 | 1 | 1 | 1 | $-3$ |\n\n' +
        'The last line is ReLU: `max(0, -3)` is $0$, so it prints $0$.',
      whyWrong: [
        null,
        'This is `z` before the last line. ReLU turns a negative value into $0$, and `max(0, -3)` returns $0$.',
        'This drops the minus sign on the weight $-1$, giving $-1 + 3 + 1 = 3$. The second input must be multiplied by $-1$.',
        'A `for` loop runs a fixed number of times, here 3, so the program always stops.',
      ],
      keyIdea: 'A neuron adds up input times weight, adds the bias and applies the activation; ReLU is just the larger of $0$ and $z$.',
    },
    check: {
      optionValues: [0, -3, 3, 'Infinite loop'],
      compute: () => relu(weighted([0, 3, 1], [2, -1, 1], -1)),
    },
  },
  {
    id: 'neural-networks-014',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A sigmoid neuron has derivative $\\sigma\'(z) = \\sigma(z)\\,(1 - \\sigma(z))$. If its output is $\\sigma(z) = 0.8$, what is $\\sigma\'(z)$?',
    options: ['$0.8$', '$0.2$', '$0.64$', '$0.16$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The formula only needs the output value $\\sigma(z) = 0.8$, not $z$ itself.\n\n' +
        '$$\\sigma\'(z) = 0.8 \\times (1 - 0.8) = 0.8 \\times 0.2 = 0.16$$\n\n' +
        'Note: the largest possible value of $\\sigma\'(z)$ is $0.5 \\times 0.5 = 0.25$ (at $z = 0$). Small sigmoid derivatives multiplied together across many layers make gradients shrink, which is one reason ReLU is popular in deep networks.',
      whyWrong: [
        'This is $\\sigma(z) = 0.8$ itself, the output, not its derivative. You still have to multiply by $1 - \\sigma(z)$.',
        'This is only the factor $1 - \\sigma(z) = 0.2$; it still has to be multiplied by $\\sigma(z) = 0.8$.',
        'This is $0.8 \\times 0.8 = 0.64$: $\\sigma(z)$ was multiplied by itself instead of by $1 - \\sigma(z)$.',
        null,
      ],
      keyIdea: 'The sigmoid derivative is $\\sigma(1 - \\sigma)$, so it can be found from the output alone, and it is never more than $0.25$.',
    },
    check: {
      optionValues: [0.8, 0.2, 0.64, 0.16],
      compute: () => {
        const z = Math.log(4); // sigma(ln 4) = 4/5 = 0.8
        const h = 1e-5;
        return (sigmoid(z + h) - sigmoid(z - h)) / (2 * h);
      },
    },
  },

  // ---------------------------------------------------------------- recall and counting
  {
    id: 'neural-networks-020',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'What does ReLU, $f(z) = \\max(0, z)$, output when its input is $-3$?',
    options: ['$0$', '$-3$', '$3$', '$1$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'ReLU returns the larger of $0$ and $z$:\n\n' +
        '$$f(-3) = \\max(0, -3) = 0$$\n\n' +
        'Every negative input gives $0$, and every positive input passes straight through.',
      whyWrong: [
        null,
        'This returns the input unchanged, which ReLU only does for positive inputs.',
        'This takes the absolute value. ReLU does not flip negative inputs; it replaces them with $0$.',
        'ReLU has no fixed maximum of $1$, and a negative input gives $0$. A step function is the one with outputs $0$ and $1$.',
      ],
      keyIdea: 'ReLU turns negative inputs into 0 and leaves positive inputs unchanged.',
    },
    check: { optionValues: [0, -3, 3, 1], compute: () => relu(-3) },
  },
  {
    id: 'neural-networks-021',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'Which logic gate can a single perceptron **not** compute?',
    options: ['XOR', 'AND', 'OR', 'NAND'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A single perceptron separates its inputs with one straight line.\n\n' +
        'XOR outputs $1$ for $(0, 1)$ and $(1, 0)$ and $0$ for $(0, 0)$ and $(1, 1)$. No single straight line can separate these two pairs, so XOR is **not linearly separable** and needs a hidden layer.',
      whyWrong: [
        null,
        'AND is linearly separable: weights $1, 1$ and bias $-1.5$ compute it.',
        'OR is linearly separable: weights $1, 1$ and bias $-0.5$ compute it.',
        'NAND is linearly separable: weights $-1, -1$ and bias $1.5$ compute it.',
      ],
      keyIdea: 'A single perceptron draws one straight line, so it cannot compute XOR.',
    },
  },
  {
    id: 'neural-networks-022',
    subtopic: 'neural-networks',
    difficulty: 'foundation',
    stem: 'Why do the hidden layers of a network need a **non-linear** activation function?',
    options: ['To let the network learn non-linear patterns', 'To store the training data', 'To reduce the number of weights', 'To set the learning rate'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A linear function of a linear function is still linear, so without non-linear activations any number of layers collapses into one linear layer.\n\n' +
        'A non-linear activation such as ReLU is what lets extra layers add power, so that the network can learn curved decision boundaries.',
      whyWrong: [
        null,
        'A network does not store its training data. It keeps only its learned weights and biases.',
        'The number of weights depends on the layer sizes. The activation function does not change it.',
        'The learning rate is a separate setting of gradient descent, chosen before training.',
      ],
      keyIdea: 'Non-linear activations are what make extra layers useful.',
    },
  },
  {
    id: 'neural-networks-023',
    subtopic: 'neural-networks',
    difficulty: 'exam',
    stem: 'A fully connected network has layer sizes $3$, $4$ and $2$. How many **weights** does it have, not counting biases?',
    options: ['$20$', '$26$', '$24$', '$9$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Weights connect neighbouring layers only, with one weight for every pair of neurons.\n\n' +
        '- $3 \\to 4$: $3 \\times 4 = 12$ weights.\n' +
        '- $4 \\to 2$: $4 \\times 2 = 8$ weights.\n\n' +
        'Total: $12 + 8 = 20$ weights.',
      whyWrong: [
        null,
        'This also counts the $4 + 2 = 6$ biases. The question asks for weights only.',
        'This multiplies all three sizes together, $3 \\times 4 \\times 2$. Multiply each neighbouring pair of layers and then add.',
        'This adds the layer sizes, $3 + 4 + 2$, which counts neurons rather than connections.',
      ],
      keyIdea: 'Weights $= \\sum n_{\\text{in}} \\times n_{\\text{out}}$ over each neighbouring pair of layers.',
    },
    check: { optionValues: [20, 26, 24, 9], compute: () => paramCount([3, 4, 2]) - (4 + 2) },
  },
];
