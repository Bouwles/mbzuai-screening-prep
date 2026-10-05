import type { Lesson } from '../../../types';

export const lesson: Lesson = {
  subtopic: 'neural-networks',
  know:
    '### The artificial neuron\n\n' +
    'A neural network is built from tiny calculators called **neurons**. Each neuron does just two things:\n\n' +
    '1. **Weighted sum:** multiply every input by its own **weight**, add the results, then add one extra number called the **bias**: $z = w_1x_1 + w_2x_2 + \\dots + w_nx_n + b$.\n' +
    '2. **Activation:** pass $z$ through an **activation function** $f$. The neuron\'s output is $a = f(z)$.\n\n' +
    'The **weights** say how much each input matters (a big positive weight means "this input pushes the output up a lot", a negative weight pushes it down). The **bias** shifts $z$ up or down whatever the inputs are, so it moves the point where the neuron "switches on". Weights and biases together are the network\'s **parameters**: the numbers it learns during training.\n\n' +
    'Example: inputs $x_1 = 2$, $x_2 = 3$, weights $0.4$ and $-0.2$, bias $0.5$ give $z = 0.8 - 0.6 + 0.5 = 0.7$.\n\n' +
    '### The four activation functions you must know\n\n' +
    '| Name | Rule | Outputs | Value at $z = 0$ |\n' +
    '| --- | --- | --- | --- |\n' +
    '| Step | $1$ if $z \\ge 0$, else $0$ | only $0$ or $1$ | $1$ |\n' +
    '| Sigmoid | $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ | between $0$ and $1$ | $0.5$ |\n' +
    '| tanh | $\\tanh(z)$ | between $-1$ and $1$ | $0$ |\n' +
    '| ReLU | $\\max(0, z)$ | $0$ or more, no upper limit | $0$ |\n\n' +
    'Quick facts: the **sigmoid** turns any number into something that looks like a probability, so it is used for yes/no outputs (exactly like logistic regression). A positive $z$ gives a sigmoid output above $0.5$; a negative $z$ gives one below $0.5$. **tanh** is the same S-shape but stretched to run from $-1$ to $1$. **ReLU** ("rectified linear unit") keeps positive numbers and replaces negative numbers by $0$; it is the most popular choice for hidden layers because it is fast and its gradient does not shrink for positive inputs. The **step** function is the original "perceptron": it just fires ($1$) or does not ($0$).\n\n' +
    '### Layers and the forward pass\n\n' +
    'Neurons are arranged in **layers**: an **input layer** (just the data, no calculation), one or more **hidden layers**, and an **output layer**. In a **fully connected** (dense) network, every neuron in one layer feeds every neuron in the next.\n\n' +
    'Computing the output is called the **forward pass**: work out every neuron in the first hidden layer, use those outputs as the inputs for the next layer, and so on until the output. In matrix form, each layer is $\\mathbf{a} = f(W\\mathbf{x} + \\mathbf{b})$, where each **row** of $W$ holds one neuron\'s weights.\n\n' +
    '### Counting parameters\n\n' +
    'Between a layer with $n_{\\text{in}}$ neurons and the next layer with $n_{\\text{out}}$ neurons there are $n_{\\text{in}} \\times n_{\\text{out}}$ weights (one per connection) and $n_{\\text{out}}$ biases (one per receiving neuron). Add this up over every pair of **neighbouring** layers. The input layer has **no** biases.\n\n' +
    'For $4 \\to 5 \\to 3$: $(4 \\times 5 + 5) + (5 \\times 3 + 3) = 25 + 18 = 43$ parameters.\n\n' +
    '### Why non-linearity is needed\n\n' +
    'Without an activation (or with the identity $f(z) = z$) each layer is a linear function, and a linear function of a linear function is still linear: if $h = 2x + 1$ and $y = 3h - 4$ then $y = 6x - 1$. So **any number of linear layers collapses into one linear layer**, which can only draw straight-line boundaries. It cannot even learn **XOR** (output $1$ when exactly one input is $1$). Non-linear activations such as ReLU, sigmoid and tanh are what let extra layers learn curved patterns. A single step-function neuron can make AND, OR and NAND, but XOR needs a hidden layer.\n\n' +
    '### Training: loss, backpropagation and gradient descent\n\n' +
    'Training adjusts the weights and biases so the predictions get closer to the targets. Each step has three parts:\n\n' +
    '1. **Forward pass:** compute the prediction and the **loss** (how wrong it is), for example $L = (y - t)^{2}$.\n' +
    '2. **Backpropagation:** use the **chain rule** to find $\\frac{\\partial L}{\\partial w}$ for **every weight** (and bias), starting at the output and working backwards layer by layer.\n' +
    '3. **Gradient descent update:** $w_{\\text{new}} = w - \\eta \\frac{\\partial L}{\\partial w}$, where the **learning rate** $\\eta$ is a small number like $0.1$ or $0.01$.\n\n' +
    'The gradients that training uses are with respect to the **weights** (and biases), not the inputs: the training data never changes. A negative gradient means increasing $w$ lowers the loss, so the update makes $w$ bigger.\n\n' +
    'Useful derivatives: $\\sigma\'(z) = \\sigma(z)(1 - \\sigma(z))$, which is at most $0.25$; ReLU has derivative $1$ for $z > 0$ and $0$ for $z < 0$. Multiplying many small sigmoid derivatives together makes gradients in early layers tiny (the **vanishing gradient** problem), which is one reason deep networks prefer ReLU.',
  formulas: [
    { label: 'Weighted sum of a neuron', tex: 'z = w_1x_1 + w_2x_2 + \\dots + w_nx_n + b', note: 'Multiply each input by its weight, add, then add the bias.' },
    { label: 'Neuron output', tex: 'a = f(z)', note: '$f$ is the activation function.' },
    { label: 'Layer in matrix form', tex: '\\mathbf{a} = f(W\\mathbf{x} + \\mathbf{b})', note: 'Each row of $W$ holds the weights of one neuron in the layer.' },
    { label: 'Step function', tex: 's(z) = \\begin{cases} 1 & z \\ge 0 \\\\ 0 & z < 0 \\end{cases}' },
    { label: 'Sigmoid', tex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}', note: 'Outputs between $0$ and $1$; $\\sigma(0) = 0.5$.' },
    { label: 'tanh', tex: '\\tanh(z) = \\frac{e^{z} - e^{-z}}{e^{z} + e^{-z}}', note: 'Outputs between $-1$ and $1$; $\\tanh(0) = 0$.' },
    { label: 'ReLU', tex: '\\text{ReLU}(z) = \\max(0, z)', note: 'Negative values become $0$; positive values pass through unchanged.' },
    { label: 'Sigmoid derivative', tex: '\\sigma\'(z) = \\sigma(z)\\left(1 - \\sigma(z)\\right)', note: 'Largest value $0.25$, at $z = 0$.' },
    { label: 'Parameters between two layers', tex: 'n_{\\text{in}} \\times n_{\\text{out}} + n_{\\text{out}}', note: 'Weights plus biases; add over every pair of neighbouring layers. Inputs have no biases.' },
    { label: 'Squared-error loss', tex: 'L = (y - t)^{2}', note: '$y$ is the prediction, $t$ the target.' },
    { label: 'Chain rule (backpropagation)', tex: '\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial y} \\times \\frac{\\partial y}{\\partial w}' },
    { label: 'Gradient descent update', tex: 'w_{\\text{new}} = w - \\eta \\frac{\\partial L}{\\partial w}', note: '$\\eta$ is the learning rate; always subtract.' },
  ],
  examples: [
    {
      title: 'One neuron, two activation functions',
      problem: 'A neuron has inputs $x_1 = 2$, $x_2 = -1$, weights $w_1 = 1.5$, $w_2 = 2$ and bias $b = -0.5$. Find its output with (a) ReLU and (b) the sigmoid, to 3 decimal places.',
      steps: [
        'Products: $w_1x_1 = 1.5 \\times 2 = 3$ and $w_2x_2 = 2 \\times (-1) = -2$.',
        'Weighted sum: $z = 3 - 2 - 0.5 = 0.5$.',
        '(a) ReLU: $\\max(0, 0.5) = 0.5$, because a positive value passes straight through.',
        '(b) Sigmoid: $e^{-0.5} \\approx 0.6065$, so $\\sigma(0.5) = \\frac{1}{1 + 0.6065} \\approx 0.622$.',
        'Check: $z$ is positive, so the sigmoid output must be above $0.5$. It is.',
      ],
      answer: '(a) $0.5$ (b) $0.622$',
    },
    {
      title: 'Counting weights and biases',
      problem: 'A fully connected network has $3$ inputs, a hidden layer of $4$ neurons and $2$ output neurons. How many trainable parameters does it have?',
      steps: [
        'Input to hidden: $3 \\times 4 = 12$ weights and $4$ biases, so $16$.',
        'Hidden to output: $4 \\times 2 = 8$ weights and $2$ biases, so $10$.',
        'The inputs have no biases, so the total is $16 + 10 = 26$.',
      ],
      answer: '$26$ parameters ($20$ weights and $6$ biases)',
    },
    {
      title: 'A forward pass through a hidden layer',
      problem: 'Inputs $x_1 = 2$, $x_2 = 1$. Hidden neuron $h_1$ has weights $1$, $2$ and bias $-1$; hidden neuron $h_2$ has weights $-2$, $1$ and bias $1$; both use ReLU. The output is $y = 2h_1 + 4h_2 - 1$ with no activation. Find $y$.',
      steps: [
        '$h_1$: $z = 1(2) + 2(1) - 1 = 3$, so $h_1 = \\max(0, 3) = 3$.',
        '$h_2$: $z = (-2)(2) + 1(1) + 1 = -2$, so $h_2 = \\max(0, -2) = 0$.',
        'Output: $y = 2(3) + 4(0) - 1 = 5$.',
        'Note: if you forgot the ReLU you would use $h_2 = -2$ and get $y = 6 - 8 - 1 = -3$, a classic wrong option.',
      ],
      answer: '$y = 5$',
    },
    {
      title: 'One step of training with the chain rule',
      problem: 'A neuron with no activation predicts $y = wx + b$ and the loss is $L = (y - t)^{2}$. For $x = 2$, $t = 1$, $w = 1$, $b = 1$ and learning rate $\\eta = 0.1$, find the new $w$ and $b$ after one gradient descent step.',
      steps: [
        'Forward pass: $y = 1 \\times 2 + 1 = 3$, so the error is $y - t = 3 - 1 = 2$ and $L = 4$.',
        'Chain rule for $w$: $\\frac{\\partial L}{\\partial w} = 2(y - t) \\times x = 2 \\times 2 \\times 2 = 8$.',
        'Chain rule for $b$: $\\frac{\\partial L}{\\partial b} = 2(y - t) \\times 1 = 4$.',
        'Update $w$: $w_{\\text{new}} = 1 - 0.1 \\times 8 = 0.2$.',
        'Update $b$: $b_{\\text{new}} = 1 - 0.1 \\times 4 = 0.6$.',
        'Check: the prediction $3$ was too big, so both $w$ and $b$ should go down. They do.',
      ],
      answer: '$w = 0.2$ and $b = 0.6$',
    },
  ],
  traps: [
    'Forgetting the bias, or subtracting it. The bias is always **added** to the weighted sum, and wrong options are often exactly "the answer without the bias".',
    'Giving $z$ as the output. The question usually wants $f(z)$, after the activation. A sigmoid output can never be negative or bigger than $1$.',
    'Forgetting that ReLU turns negative values into $0$ in a hidden layer, then carrying a negative number into the next layer.',
    'Counting parameters wrongly: leaving out the biases, giving the input layer biases, or multiplying all the layer sizes together instead of adding the products of **neighbouring** layers.',
    'Adding the gradient step instead of subtracting it. The update is $w - \\eta \\frac{\\partial L}{\\partial w}$, so a negative gradient makes the weight **increase**.',
    'Thinking that stacking more layers always adds power. Without a non-linear activation, many layers are equivalent to one linear layer and still cannot learn XOR.',
  ],
  examTip:
    'Expect three kinds of question: a short calculation (a neuron output, a forward pass, a parameter count, one gradient descent step), a recall question (which activation has outputs in $(0, 1)$, what backpropagation computes, why non-linearity is needed), and a "which logic gate" question with a step neuron. For calculations, the wrong options are built from the classic slips: no bias, no activation, no ReLU, wrong sign, weights only. So write the weighted sum out in full, one product at a time, before touching the activation. Use quick sign checks to eliminate options: a sigmoid output is above $0.5$ exactly when $z > 0$; a ReLU output is never negative; tanh and sigmoid outputs never exceed $1$. For parameter counts, the answer must be bigger than the weights-only total, and the product of all layer sizes is always a trap. For a gradient descent step, check the direction: the weight always moves the opposite way to the sign of the gradient (for $y = wx + b$ with a positive input $x$, a prediction that is too high means $w$ should go down). For logic gates, just try all four input pairs in a quick table.',
};
