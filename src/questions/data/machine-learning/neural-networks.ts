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
      asking: 'What number do you get by multiplying each input by its weight and adding the bias?',
      solution:
        'A **neuron** combines its inputs into one number, $z$. Each input $x$ is multiplied by its **weight** $w$, which says how much that input counts. The **bias** $b$ is then added on.\n\n' +
        'Multiply the first input by its weight: $w_1x_1 = 0.4 \\times 2 = 0.8$.\n\n' +
        'Multiply the second: $w_2x_2 = -0.2 \\times 3 = -0.6$. A negative weight makes a negative product.\n\n' +
        'Add everything, including the bias: $z = 0.8 + (-0.6) + 0.5 = 0.2 + 0.5 = 0.7$.',
      conclusion: 'The two products give 0.2, and adding the bias of 0.5 gives $0.7$.',
      whyWrong: [
        'This is $0.8 - 0.6 = 0.2$: the products are right but the bias $b = 0.5$ was never added.',
        'This is $0.8 + 0.6 + 0.5 = 1.9$: the minus sign on $w_2 = -0.2$ was dropped, so the second product was added instead of subtracted.',
        null,
        'This is $0.8 - 0.6 - 0.5 = -0.3$: the bias was subtracted instead of added. The bias is always **added** to the weighted sum.',
      ],
      keyIdea: 'For a weighted sum, multiply each input by its own weight, keeping the signs. Add the products, then add the bias last. Put brackets around negative numbers so that minus signs don\'t get lost.',
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
      asking: 'Which function always gives a number between 0 and 1?',
      solution:
        'An **activation function** is applied to a neuron\'s number $z$ to give its output. A probability must lie between 0 and 1, so we need a function that can\'t go outside that range.\n\n' +
        'Test the others with a big input and a very negative one. ReLU keeps $z$ if it is positive and otherwise gives 0. tanh is an S-shaped curve that runs from $-1$ to 1. Identity gives $z$ back unchanged:\n\n| Function | At $z = -5$ | At $z = 5$ | Problem |\n|---|---|---|---|\n| ReLU | 0 | 5 | 5 is above 1 |\n| tanh | about $-1$ | about 1 | It goes negative |\n| Identity | $-5$ | 5 | It goes both ways |\n\n' +
        'Now take the sigmoid. $e$ is a fixed number, about 2.718, and a positive number to any power stays positive. So $e^{-z}$ is always positive, and the bottom of $\\frac{1}{1 + e^{-z}}$ is always more than 1. One divided by something bigger than 1 stays between 0 and 1.',
      conclusion: 'Its output stays strictly between 0 and 1 for every $z$, so the answer is Sigmoid, $\\sigma(z) = \\frac{1}{1 + e^{-z}}$.',
      whyWrong: [
        null,
        'ReLU outputs $0$ for negative inputs but has **no upper limit**: for example $\\max(0, 7) = 7$, which cannot be a probability.',
        'tanh is S-shaped like the sigmoid, but its outputs lie between $-1$ and $1$, so it can give negative values, which a probability cannot be.',
        'The identity function just passes $z$ through, so the output can be any real number, positive or negative, with no limits at all.',
      ],
      keyIdea: 'To test an output range, try a large positive and a large negative input in each function. For a probability you need the sigmoid: tanh runs from $-1$ to 1, and ReLU has no upper limit.',
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
      asking: 'Which activation function draws this curve?',
      solution:
        'An **activation function** takes a neuron\'s number $z$ and gives its output $f(z)$. Each one has a recognisable shape, so we look for key features in the chart.\n\n' +
        'Read three things from the chart. At $z = 0$ the output is 0. On the left the outputs are negative, levelling off at about $-1$. On the right they are positive, levelling off at about 1.\n\n' +
        'Rule out the others. The **sigmoid** gives 0.5 at $z = 0$ and is never negative. **ReLU** gives 0 for all negative $z$ and keeps growing for positive $z$. A **step function** jumps, with no in-between values.\n\n' +
        '**tanh** (the hyperbolic tangent) is a smooth S-shaped curve that runs from $-1$ to 1 and passes through 0 at $z = 0$. That fits all three features.',
      conclusion: 'A smooth curve through 0, levelling off at $-1$ and 1, is the shape of tanh.',
      whyWrong: [
        'The sigmoid is also S-shaped, but its outputs are always between $0$ and $1$ and $\\sigma(0) = 0.5$. This chart has negative outputs and passes through $0$.',
        null,
        'ReLU gives exactly $0$ for every negative input and keeps growing for positive inputs (ReLU of $3$ is $3$). This chart is negative on the left and levels off at about $1$.',
        'A step function jumps straight from one value to another and has only two output values. This chart changes smoothly through many values.',
      ],
      keyIdea: 'To identify an activation curve, read its value at $z = 0$ and its range. Sigmoid: 0.5, from 0 to 1. tanh: 0, from $-1$ to 1. ReLU: 0, flat then rising with no limit. Step: a sudden jump.',
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
      asking: 'What does the bias $b$ do in a neuron?',
      solution:
        'In $z = w_1x_1 + w_2x_2 + b$, the **weights** $w_1$ and $w_2$ multiply the inputs, but $b$ is added on by itself. So $b$ moves $z$ up or down by a fixed amount, whatever the inputs are.\n\n' +
        'Here is a tiny example with one input. Say a neuron switches on when $z \\ge 0$, and $z = x + b$. With $b = 0$ it switches on from $x = 0$. With $b = -3$ it needs $x$ to reach 3.\n\n' +
        'So changing $b$ changes where the neuron switches on, without changing how much each input counts.',
      conclusion: 'Adding $b$ slides $z$ and so slides the switch-on point, which matches this option: It shifts $z$, moving the point where the neuron switches on.',
      whyWrong: [
        'That describes the **weights**. Each input has its own weight that multiplies it; the bias is not multiplied by any input.',
        'That is the job of the **activation function** (for example the sigmoid squashes into $(0, 1)$), not the bias.',
        'That is the **loss function** (error), which is used during training. The bias is part of the neuron itself.',
        null,
      ],
      keyIdea: 'Match each part of a neuron to its job. Weights scale the inputs. The bias shifts $z$. The activation function squashes or bends $z$. The loss measures error, and it sits outside the neuron.',
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
      asking: 'What number does this neuron output for these inputs?',
      solution:
        'A neuron works in two stages. It calculates a **weighted sum** $z = w_1x_1 + w_2x_2 + b$, then puts $z$ through its **activation function**, here the sigmoid $\\sigma$.\n\n' +
        'Multiply each input by its weight: $w_1x_1 = 1.5 \\times 2 = 3$, and $w_2x_2 = -1 \\times 4 = -4$.\n\n' +
        'Add them, then add the **bias**: $z = 3 + (-4) + 1 = -1 + 1 = 0$.\n\n' +
        'Put $z = 0$ into the sigmoid. The power $-z$ is 0. $e$ is a fixed number, about 2.718, and any non-zero number to the power 0 is 1, so $\\sigma(0) = \\frac{1}{1 + 1} = \\frac{1}{2} = 0.5$.',
      conclusion: 'The weighted sum comes to exactly 0, and the sigmoid of 0 is one half, so the output is $0.5$.',
      whyWrong: [
        'This mixes the sigmoid up with ReLU or tanh, which both give $0$ at $z = 0$. The sigmoid gives $\\frac{1}{1 + 1} = 0.5$ there.',
        null,
        'This is $e^{0} = 1$: you stopped after working out $e^{-z}$ and forgot to put it into $\\frac{1}{1 + e^{-z}}$.',
        'This is $\\sigma(-1) \\approx 0.269$: the bias was left out, so $z = 3 - 4 = -1$ instead of $0$.',
      ],
      keyIdea: 'For a sigmoid neuron, find $z$ first, then substitute into $\\frac{1}{1 + e^{-z}}$. If $z = 0$ you get 0.5 with no calculator. Positive $z$ gives more than 0.5, and negative $z$ gives less.',
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
      asking: 'How many weights and biases does this network have in total?',
      solution:
        '**Fully connected** means every neuron in a layer links to every neuron in the next layer. Each link has one **weight**, a number that training can change.\n\n' +
        'Count the weights between neighbouring layers by multiplying their sizes. Inputs to hidden: $4 \\times 5 = 20$. Hidden to output: $5 \\times 3 = 15$.\n\n' +
        'Add them: $20 + 15 = 35$ weights.\n\n' +
        'A **bias** is one extra trainable number per neuron. Only hidden and output neurons have one, because inputs are just data. So there are $5 + 3 = 8$ biases.\n\n' +
        'Add both kinds: $35 + 8 = 43$ parameters.',
      conclusion: 'There are 35 weights and 8 biases, which makes $43$ trainable parameters.',
      whyWrong: [
        'This is $20 + 15 = 35$, the number of **weights** only. The $5 + 3 = 8$ biases are trainable parameters too.',
        'This is $4 \\times 5 \\times 3 = 60$: the layer sizes were all multiplied together. Weights only connect **neighbouring** layers, so you multiply each neighbouring pair and add.',
        'This is $35 + 4 + 5 + 3 = 47$: it gives a bias to the $4$ input neurons as well. Inputs are just data and have no bias; only hidden and output neurons do.',
        null,
      ],
      keyIdea: 'For a fully connected network, use a table: for each neighbouring pair, weights $=$ left size $\\times$ right size, and biases $=$ right size. Add the columns. Never multiply all the layers together, and never give inputs a bias.',
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
      asking: 'What number comes out at $y$ when the inputs pass through the network?',
      solution:
        'Work forwards one layer at a time. Each neuron multiplies each input by its weight, adds its **bias**, then applies its activation. **ReLU** means $\\max(0, z)$: keep $z$ if it is positive, otherwise output 0.\n\n' +
        '$h_1$ takes $x_1 = 1$ and $x_2 = 2$, with weights 2 and 1 and bias $-1$. So $z = 2 \\times 1 + 1 \\times 2 + (-1) = 2 + 2 - 1 = 3$. That is positive, so ReLU keeps it: $h_1 = \\max(0, 3) = 3$.\n\n' +
        '$h_2$ has weights $-1$ and $-1$ and bias 1. So $z = (-1) \\times 1 + (-1) \\times 2 + 1 = -1 - 2 + 1 = -2$. That is negative, so ReLU turns it into 0: $h_2 = \\max(0, -2) = 0$.\n\n' +
        'Now $h_1$ and $h_2$ are the inputs to $y$. Its weights are 2 and 3, its bias is 1, and it has no activation. So $y = 2 \\times 3 + 3 \\times 0 + 1 = 6 + 1 = 7$.',
      conclusion: '$h_1$ passes on 3, $h_2$ is switched off at 0, and the output neuron adds its bias, so the answer is $7$.',
      whyWrong: [
        null,
        'This is what you get if you forget the ReLU on $h_2$ and use $-2$: $y = 2(3) + 3(-2) + 1 = 1$. ReLU turns any negative value into $0$.',
        'This is $2(3) + 3(0) = 6$: the hidden layer is right but the output bias of $1$ was forgotten.',
        'This is what you get if you forget the hidden biases: $h_1 = \\max(0, 4) = 4$ and $h_2 = \\max(0, -3) = 0$, giving $y = 2(4) + 1 = 9$.',
      ],
      keyIdea: 'For a forward pass, compute one neuron at a time, left to right: weighted sum plus bias, then activation. Write each result down, because those results are the inputs of the next layer.',
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
      asking: 'What can a deep network do if every activation is $f(z) = z$?',
      solution:
        'A **linear layer** works out a weight times the input, plus a bias. An **activation function** normally bends that result. But $f(z) = z$ changes nothing, so here each layer stays linear.\n\n' +
        'Take two such layers with one input each: $h = 2x + 1$, then $y = 3h + 4$. Substitute $h$ into the second: $y = 3(2x + 1) + 4 = 6x + 7$.\n\n' +
        'That result, $6x + 7$, is again one linear formula. More layers only repeat the same substitution, so three hidden layers also collapse into a single linear formula.',
      conclusion: 'However many linear layers are stacked, they combine into one, so the true statement is: It is equivalent to a single linear layer.',
      whyWrong: [
        'This "universal approximation" property only holds when the hidden neurons use a **non-linear** activation. A purely linear network can only produce straight-line boundaries.',
        'A linear function does have a derivative: $f(z) = z$ has $f\'(z) = 1$ everywhere. The network can be trained; it just cannot learn anything that a single linear layer could not.',
        null,
        'XOR is not linearly separable, and a stack of linear layers is still one linear function, so it cannot solve XOR. XOR needs a hidden layer **with a non-linear activation**.',
      ],
      keyIdea: 'Ask whether any activation bends the result. If every activation is linear, substitute one layer into the next: you get one linear function, which can only draw a straight boundary. Depth adds power only with a non-linear activation such as ReLU.',
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
      asking: 'What does this sigmoid neuron output, rounded to 3 decimal places?',
      solution:
        'A neuron first calculates $z = w_1x_1 + w_2x_2 + b$, then applies its activation function, here the **sigmoid** $\\sigma$.\n\n' +
        'Multiply each input by its weight: $0.5 \\times 2 = 1$, and $1.5 \\times 1 = 1.5$.\n\n' +
        'Add them, then add the bias: $z = 1 + 1.5 + (-0.5) = 2$.\n\n' +
        'Now find the power in the sigmoid. $e$ is a fixed number, about 2.718. With $z = 2$, $e^{-z} = e^{-2} \\approx 0.1353$, using the $e^x$ key on a calculator.\n\n' +
        'Substitute: $\\sigma(2) = \\frac{1}{1 + 0.1353} = \\frac{1}{1.1353} \\approx 0.881$.',
      conclusion: '$z = 2$ is positive, so the output must be above one half, and the calculation gives $0.881$.',
      whyWrong: [
        'This is $\\sigma(2.5) \\approx 0.924$: the bias was left out, so $z = 1 + 1.5 = 2.5$.',
        null,
        'This is $\\frac{1}{1 + e^{2}} \\approx 0.119$: the minus sign in $e^{-z}$ was dropped. A positive $z$ must give an output above $0.5$.',
        'This is $z = 2$, the weighted sum **before** the activation. A sigmoid output can never be bigger than $1$.',
      ],
      keyIdea: 'For a sigmoid neuron: compute $z$, then $e^{-z}$, then $\\frac{1}{1 + e^{-z}}$. Use the sign of $z$ as a test: positive $z$ must give more than 0.5, and the output can never be over 1.',
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
      asking: 'What is the weight after one update, given a negative gradient?',
      solution:
        'Gradient descent changes a weight using $w_{\\text{new}} = w - \\eta \\times \\frac{\\partial L}{\\partial w}$. $\\frac{\\partial L}{\\partial w}$ is the gradient, which says how the loss $L$ changes as $w$ rises. $\\eta$ is the learning rate, which sets the step size.\n\n' +
        'A negative gradient means the loss falls as $w$ rises, so $w$ should go up.\n\n' +
        'Multiply the learning rate by the gradient: $0.1 \\times (-2.5) = -0.25$.\n\n' +
        'Subtract from the current weight. Taking away a negative means adding: $0.8 - (-0.25) = 0.8 + 0.25 = 1.05$.',
      conclusion: 'The negative gradient pushes the weight up by 0.25, so the new weight is $1.05$.',
      whyWrong: [
        'This is $0.8 + 0.1 \\times (-2.5) = 0.55$: the step was added instead of subtracted, which moves the weight **uphill** and makes the loss bigger.',
        'This is $0.8 - (-2.5) = 3.3$: the learning rate was forgotten, so the whole gradient was used as the step.',
        'This is $0.8 + (-2.5) = -1.7$: the learning rate was forgotten **and** the step was added instead of subtracted.',
        null,
      ],
      keyIdea: 'Use $w_{\\text{new}} = w - \\eta \\times \\text{gradient}$, putting brackets around a negative gradient. A quick test: a negative gradient must raise $w$, and a positive gradient must lower it.',
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
      asking: 'What does backpropagation work out for each weight?',
      solution:
        'Training changes each **weight** to make the **loss** (the network\'s error) smaller. To do that we need to know how the loss would change if a particular weight changed a little.\n\n' +
        'That amount is a **partial derivative**, written $\\frac{\\partial L}{\\partial w}$: how fast $L$ changes when only $w$ moves and everything else stays fixed.\n\n' +
        '**Backpropagation** calculates this for every weight. It starts at the output and works backwards through the layers, using the chain rule (the rule for differentiating one function inside another).',
      conclusion: 'Gradient descent then uses these values to update the weights, so the answer is The partial derivative of the loss with respect to that weight.',
      whyWrong: [
        null,
        'That is the **forward pass**, which happens before backpropagation. Backpropagation goes in the opposite direction and computes gradients, not neuron outputs.',
        'The inputs are the fixed training data; training never changes them. Gradients are taken with respect to the **weights** (the parameters being learned).',
        'That describes random search. Backpropagation is not random: it uses calculus (the chain rule) to find the exact direction that lowers the loss.',
      ],
      keyIdea: 'Keep the training loop in order. Forward pass: compute the outputs and the loss. Backpropagation: compute the gradient of the loss for every weight. Gradient descent: use those gradients to update the weights.',
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
      asking: 'Which logic gate matches this perceptron\'s outputs?',
      solution:
        'A **perceptron** is a single neuron. Here it calculates $z = w_1x_1 + w_2x_2 + b = x_1 + x_2 - 1.5$, then outputs 1 if $z \\ge 0$, otherwise 0. **Binary** inputs means each $x$ is 0 or 1.\n\n' +
        'There are only four possible input pairs, so test all of them:\n\n| $x_1$ | $x_2$ | $z = x_1 + x_2 - 1.5$ | Output |\n|---|---|---|---|\n| 0 | 0 | $-1.5$ | 0 |\n| 0 | 1 | $-0.5$ | 0 |\n| 1 | 0 | $-0.5$ | 0 |\n| 1 | 1 | $0.5$ | 1 |\n\n' +
        'Now read the output column. It is 1 only when both inputs are 1. A gate that needs both inputs to be 1 is called **AND**.',
      conclusion: 'The output is 1 only for the inputs $(1, 1)$, which is exactly the AND gate.',
      whyWrong: [
        'OR would output $1$ when just one input is $1$, but then $z = 1 - 1.5 = -0.5 < 0$ and the output is $0$. A bias between $-1$ and $0$ (such as $-0.5$) would give OR.',
        'XOR outputs $0$ for inputs $(1, 1)$, but here $z = 0.5 \\ge 0$ gives $1$. In fact no single perceptron can compute XOR, because it can only separate the inputs with one straight line.',
        null,
        'NAND is the opposite of AND: it outputs $1$ for $(0, 0)$. Here $(0, 0)$ gives $z = -1.5 < 0$, so the output is $0$.',
      ],
      keyIdea: 'To identify a gate, write a truth table (all the input pairs) and work out $z$ and the output for each. AND is 1 only for $(1, 1)$. OR is 0 only for $(0, 0)$. NAND is the opposite of AND. XOR is 1 when the inputs differ.',
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
      asking: 'What does the code print when it runs this ReLU neuron?',
      solution:
        '`X` holds the inputs and `W` the weights. `b` on line 3 is the bias, and line 4 starts `z` at the bias, so `z` begins at $-1$.\n\n' +
        'The loop on lines 5 to 7 runs with `i` as 1, 2 and 3. Arrays start at 1, so `X[1]` is 0 and `W[1]` is 2. Each pass, line 6 adds one input times its weight to `z`:\n\n| `i` | `X[i]` | `W[i]` | `X[i] * W[i]` | `z` after line 6 |\n|---|---|---|---|---|\n| 1 | 0 | 2 | 0 | $-1$ |\n| 2 | 3 | $-1$ | $-3$ | $-4$ |\n| 3 | 1 | 1 | 1 | $-3$ |\n\n' +
        'Line 8 doesn\'t print `z` itself. It prints `max(0, z)`, the larger of 0 and `z`, which is how **ReLU** works: negative values become 0. The larger of 0 and $-3$ is 0.',
      conclusion: '`z` ends at $-3$, which is negative, so `max(0, z)` prints $0$.',
      whyWrong: [
        null,
        'This is `z` before the last line. ReLU turns a negative value into $0$, and `max(0, -3)` returns $0$.',
        'This drops the minus sign on the weight $-1$, giving $-1 + 3 + 1 = 3$. The second input must be multiplied by $-1$.',
        'A `for` loop runs a fixed number of times, here 3, so the program always stops.',
      ],
      keyIdea: 'For neuron code, trace `z` in a table, one row per pass. Then look at the last line: `max(0, z)` is ReLU, so any negative `z` gives 0.',
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
      asking: 'How steep is the sigmoid curve at the point where its output is 0.8?',
      solution:
        '$\\sigma(z)$ is the sigmoid, the neuron\'s output. $\\sigma\'(z)$ is its derivative, which tells us how steep the curve is at that point. We don\'t need $z$ itself, because the formula only uses the output.\n\n' +
        'The formula is $\\sigma\'(z) = \\sigma(z) \\times (1 - \\sigma(z))$. Put in $\\sigma(z) = 0.8$, which gives $\\sigma\'(z) = 0.8 \\times (1 - 0.8)$.\n\n' +
        'Do the bracket first: $1 - 0.8 = 0.2$.\n\n' +
        'Multiply: $0.8 \\times 0.2 = 0.16$.',
      conclusion: 'The output times one minus the output is $0.8 \\times 0.2$, so the answer is $0.16$.',
      whyWrong: [
        'This is $\\sigma(z) = 0.8$ itself, the output, not its derivative. You still have to multiply by $1 - \\sigma(z)$.',
        'This is only the factor $1 - \\sigma(z) = 0.2$; it still has to be multiplied by $\\sigma(z) = 0.8$.',
        'This is $0.8 \\times 0.8 = 0.64$: $\\sigma(z)$ was multiplied by itself instead of by $1 - \\sigma(z)$.',
        null,
      ],
      keyIdea: 'When a formula is written in terms of the output, substitute the output directly, with no need to find $z$. The largest possible value of $\\sigma\'(z)$ is 0.25, at an output of 0.5, which helps to rule out options.',
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
      asking: 'What does ReLU give for an input of $-3$?',
      solution:
        '**ReLU** is an activation function, which a neuron applies to its number $z$. $\\max(0, z)$ means take whichever is larger: 0 or $z$.\n\n' +
        'Put in $z = -3$, which gives $\\max(0, -3)$. Comparing the two numbers, 0 is larger than $-3$, so the result is 0.',
      conclusion: 'Any negative input loses to 0, so ReLU outputs $0$.',
      whyWrong: [
        null,
        'This returns the input unchanged, which ReLU only does for positive inputs.',
        'This takes the absolute value. ReLU does not flip negative inputs; it replaces them with $0$.',
        'ReLU has no fixed maximum of $1$, and a negative input gives $0$. A step function is the one with outputs $0$ and $1$.',
      ],
      keyIdea: 'For ReLU, ask one question: is $z$ positive? If yes, the output is $z$. If no, the output is 0. There is no upper limit.',
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
      asking: 'Which logic gate is impossible for one perceptron?',
      solution:
        'A **perceptron** (a single neuron with a yes or no output) outputs 1 on one side of a straight line and 0 on the other. So it can only do gates whose 1s and 0s can be split by one straight line.\n\n' +
        'Picture the four input pairs as the corners of a square. For AND, only $(1, 1)$ is 1, so a line can cut that corner off. For OR, only $(0, 0)$ is 0, so a line cuts that one off. NAND is AND with the outputs swapped, so the same line works.\n\n' +
        '**XOR** outputs 1 when the inputs differ. That puts 1s at $(0, 1)$ and $(1, 0)$, which are opposite corners, and 0s at the other two corners. No single straight line can separate opposite corners like that.',
      conclusion: 'Its outputs can\'t be split by one straight line, so a single perceptron can\'t compute XOR.',
      whyWrong: [
        null,
        'AND is linearly separable: weights $1, 1$ and bias $-1.5$ compute it.',
        'OR is linearly separable: weights $1, 1$ and bias $-0.5$ compute it.',
        'NAND is linearly separable: weights $-1, -1$ and bias $1.5$ compute it.',
      ],
      keyIdea: 'Draw the four input pairs as the corners of a square and mark the outputs. If one straight line can separate the 1s from the 0s, one perceptron can do it. If not, you need a hidden layer.',
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
      asking: 'Why do hidden layers need an activation function that isn\'t a straight line?',
      solution:
        'A **hidden layer** is any layer between the input and the output. Without an activation that bends the result, each layer only multiplies and adds, which makes a straight-line formula.\n\n' +
        'One linear formula fed into another is still linear. For example, $h = 2x$ and $y = 3h$ give $y = 6x$. So any number of such layers acts like just one, and can only draw straight boundaries.\n\n' +
        'A **non-linear** activation such as ReLU bends the result at each layer, and those bends build up into curves. That lets the network model patterns no straight line can, such as XOR (which outputs 1 only when its two inputs differ).',
      conclusion: 'Bends are what let extra layers add power, so the reason is To let the network learn non-linear patterns.',
      whyWrong: [
        null,
        'A network does not store its training data. It keeps only its learned weights and biases.',
        'The number of weights depends on the layer sizes. The activation function does not change it.',
        'The learning rate is a separate setting of gradient descent, chosen before training.',
      ],
      keyIdea: 'For why-questions about activation functions, think of what is lost without one: stacked linear layers collapse into a single straight line. Weight counts depend on layer sizes, and the learning rate is a separate training setting.',
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
      asking: 'How many links are there between neighbouring layers of this network?',
      solution:
        'A layer\'s size is how many neurons it has. **Fully connected** means every neuron in one layer links to every neuron in the next. Each link carries one **weight**.\n\n' +
        'First pair: 3 neurons link to 4 neurons. Each of the 3 sends 4 links, so that is $3 \\times 4 = 12$ weights.\n\n' +
        'Second pair: 4 neurons link to 2 neurons, so that is $4 \\times 2 = 8$ weights.\n\n' +
        'Add the pairs: $12 + 8 = 20$ weights. Biases are left out because the question asks for weights only.',
      conclusion: 'The two pairs of layers give 12 and 8, so the network has $20$ weights.',
      whyWrong: [
        null,
        'This also counts the $4 + 2 = 6$ biases. The question asks for weights only.',
        'This multiplies all three sizes together, $3 \\times 4 \\times 2$. Multiply each neighbouring pair of layers and then add.',
        'This adds the layer sizes, $3 + 4 + 2$, which counts neurons rather than connections.',
      ],
      keyIdea: 'For weights in a fully connected network, multiply each neighbouring pair of layer sizes and add the results. For total parameters, also add one bias for every hidden and output neuron.',
    },
    check: { optionValues: [20, 26, 24, 9], compute: () => paramCount([3, 4, 2]) - (4 + 2) },
  },
];
