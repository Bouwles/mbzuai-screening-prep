import type { StaticQuestion } from '../../../types';
import { mean, round } from '../../../lib/mathx';

const SUB = 'regression-gradient-descent';
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
/** Central-difference numerical derivative. */
const numDeriv = (f: (w: number) => number, w: number, h = 1e-5) => (f(w + h) - f(w - h)) / (2 * h);
const mse = (ys: number[], preds: number[]) => mean(ys.map((y, i) => (y - preds[i]) ** 2));

export const questions: StaticQuestion[] = [
  // ---------------------------------------------------------------- foundation
  {
    id: 'regression-gradient-descent-001',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'A linear regression model predicts a delivery time (in minutes) from the distance $x$ (in km) using $\\hat{y} = 2.5x + 4$. What does the model predict for a distance of $6$ km?',
    options: ['$15$ minutes', '$26.5$ minutes', '$19$ minutes', '$25$ minutes'],
    correctIndex: 2,
    markScheme: {
      solution:
        'The model is $\\hat{y} = wx + b$ with weight $w = 2.5$ and bias (intercept) $b = 4$.\n\n' +
        'Substitute $x = 6$:\n\n' +
        '$$\\hat{y} = 2.5 \\times 6 + 4 = 15 + 4 = 19$$\n\n' +
        'So the predicted delivery time is $19$ minutes.',
      whyWrong: [
        'This is $2.5 \\times 6 = 15$: the bias $b = 4$ was forgotten. The prediction is $wx$ **plus** $b$.',
        'This swaps the weight and the bias: $4 \\times 6 + 2.5 = 26.5$. The number multiplying $x$ is $2.5$.',
        null,
        'This is $2.5 \\times (6 + 4) = 25$: the bias was added to $x$ before multiplying. Multiply first, then add $b$.',
      ],
      keyIdea: 'A linear regression prediction is weight times input plus bias: $\\hat{y} = wx + b$.',
    },
    check: { optionValues: [15, 26.5, 19, 25], compute: () => { const w = 2.5, b = 4, x = 6; return w * x + b; } },
  },
  {
    id: 'regression-gradient-descent-002',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'Which of these tasks is **logistic regression** designed for?',
    options: [
      'Predicting the selling price of a flat in AED',
      'Predicting whether an email is spam or not spam',
      'Predicting tomorrow\'s temperature in degrees Celsius',
      'Splitting customers into groups when no labels are given',
    ],
    correctIndex: 1,
    markScheme: {
      solution:
        'Despite its name, **logistic regression is a classification method**. It passes $wx + b$ through the sigmoid function to output a probability between $0$ and $1$, and then a threshold (usually $0.5$) turns that probability into a class.\n\n' +
        '- Spam / not spam has two categories, so it is a **binary classification** task: perfect for logistic regression.\n' +
        '- A price or a temperature is a **continuous** number: that is a job for **linear** regression.\n' +
        '- Grouping unlabelled customers is **clustering** (unsupervised learning, e.g. k-means), not regression at all.',
      whyWrong: [
        'A price is a continuous number, so this is a linear regression task. Logistic regression outputs a probability of belonging to a class.',
        null,
        'A temperature is a continuous quantity, so this needs linear regression. The word "regression" in "logistic regression" is misleading: it classifies.',
        'With no labels this is clustering (unsupervised learning). Logistic regression is supervised: it needs labelled examples of each class.',
      ],
      keyIdea: 'Linear regression predicts a continuous number; logistic regression predicts the probability of a category (classification).',
    },
  },
  {
    id: 'regression-gradient-descent-003',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'During gradient descent, a weight currently has the value $w = 3$. The gradient of the loss with respect to this weight is $\\frac{\\partial L}{\\partial w} = 4$ and the learning rate is $\\eta = 0.1$. What is the new value of $w$ after one update?',
    options: ['$3.4$', '$-1$', '$-0.4$', '$2.6$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The gradient descent update rule is\n\n' +
        '$$w_{\\text{new}} = w - \\eta \\frac{\\partial L}{\\partial w}$$\n\n' +
        'Substitute the values:\n\n' +
        '$$w_{\\text{new}} = 3 - 0.1 \\times 4 = 3 - 0.4 = 2.6$$\n\n' +
        'The gradient is positive, so the loss goes **up** as $w$ increases. To make the loss go down we move $w$ the other way, so $w$ decreases.',
      whyWrong: [
        'This adds the step: $3 + 0.4 = 3.4$. That is gradient **ascent**, which makes the loss bigger. Descent subtracts $\\eta \\times$ gradient.',
        'This forgets the learning rate: $3 - 4 = -1$. The gradient must be multiplied by $\\eta = 0.1$ first, so the step is only $0.4$.',
        'This is just the step $-0.1 \\times 4 = -0.4$: the old weight $3$ was forgotten. The step is added to the current weight.',
        null,
      ],
      keyIdea: 'Update rule: new weight = old weight minus learning rate times gradient.',
    },
    check: { optionValues: [3.4, -1, -0.4, 2.6], compute: () => { const w = 3, g = 4, eta = 0.1; return w - eta * g; } },
  },
  {
    id: 'regression-gradient-descent-004',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'Logistic regression uses the sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$. What is $\\sigma(0)$?',
    options: ['$0$', '$\\frac{1}{2}$', '$1$', '$2$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Substitute $z = 0$. Any number to the power $0$ is $1$, so $e^{-z}$ becomes $e^{0} = 1$.\n\n' +
        '$$\\sigma(0) = \\frac{1}{1 + e^{0}} = \\frac{1}{1 + 1} = \\frac{1}{2}$$\n\n' +
        'This is why $z = 0$ is the **decision boundary**: when $wx + b = 0$ the model is exactly 50/50 between the two classes.',
      whyWrong: [
        'This assumes the sigmoid behaves like $f(z) = z$ (or ReLU) and gives $0$ at $z = 0$. The sigmoid is centred at $\\frac{1}{2}$, not at $0$.',
        null,
        'This uses $e^{0} = 1$ correctly but then stops, taking the answer as $e^{0}$ itself instead of $\\frac{1}{1 + e^{0}}$.',
        'This works out the denominator $1 + e^{0} = 2$ but forgets to take the reciprocal. The sigmoid output is always between $0$ and $1$, so $2$ is impossible.',
      ],
      keyIdea: 'Since $e^0 = 1$, the sigmoid gives exactly $\\frac{1}{2}$ at $z = 0$, the decision boundary.',
    },
    check: { optionValues: [0, 0.5, 1, 2], compute: () => sigmoid(0) },
  },
  {
    id: 'regression-gradient-descent-005',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'Which statement best describes **one step of gradient descent** when training a model?',
    options: [
      'Compute the derivative of the loss with respect to the inputs $x$, then change the training data to reduce the loss',
      'Compute the derivative of the prediction with respect to each weight, then move each weight in the same direction as that derivative',
      'Compute the loss, then set every weight equal to the value of the loss',
      'Compute the derivative of the loss with respect to each weight, then move each weight a small step in the opposite direction to that derivative',
    ],
    correctIndex: 3,
    markScheme: {
      solution:
        'Training means finding the **weights** that make the loss small. The training data is fixed; only the weights change.\n\n' +
        '1. Compute the gradient: $\\frac{\\partial L}{\\partial w}$ for every weight $w$ (how fast the loss changes when that weight changes).\n' +
        '2. The gradient points **uphill** (towards a bigger loss), so step the other way: $w \\leftarrow w - \\eta \\frac{\\partial L}{\\partial w}$.\n\n' +
        'Repeating this walks the weights downhill to a minimum of the loss.',
      whyWrong: [
        'The inputs $x$ are the training data, which are fixed. Gradient descent differentiates with respect to the **weights**, because the weights are what we are allowed to change.',
        'Two errors: it differentiates the prediction instead of the **loss**, and moving in the same direction as the gradient goes uphill, increasing the loss.',
        'The loss is a measure of error, not a weight value. Weights are adjusted by small steps using the gradient, never replaced by the loss.',
        null,
      ],
      keyIdea: 'Gradient descent computes the derivative of the loss with respect to each weight and steps against it.',
    },
  },
  {
    id: 'regression-gradient-descent-006',
    subtopic: SUB,
    difficulty: 'foundation',
    fixedOrder: true,
    stem: 'Which of the following is TRUE about loss functions?\n\nA. Mean squared error (MSE) is the usual loss for linear regression\n\nB. Cross-entropy (log loss) is the usual loss for logistic regression',
    options: ['A only', 'B only', 'Both A and B', 'None of the above'],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Statement A is true.** Linear regression predicts a number, so we measure how far each prediction is from the truth and average the squares: $\\text{MSE} = \\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2$.\n\n' +
        '**Statement B is true.** Logistic regression outputs a probability $p$. Cross-entropy, $L = -[y \\ln p + (1 - y)\\ln(1 - p)]$, punishes confident wrong probabilities very heavily, and it is the standard loss for classification.\n\n' +
        'Both statements are true, so the answer is "Both A and B".',
      whyWrong: [
        'A is true, but B is also true: cross-entropy is the standard loss for logistic regression, so "A only" is incomplete.',
        'B is true, but A is also true: MSE is the standard loss for linear regression, so "B only" is incomplete.',
        null,
        'Both statements are standard facts, so "None of the above" is wrong.',
      ],
      keyIdea: 'Regression (numbers) uses MSE; classification with probabilities (logistic regression) uses cross-entropy.',
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'regression-gradient-descent-007',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'A model makes the predictions $\\hat{y}$ shown in the table for four houses (values in hundreds of thousands of AED). What is the mean squared error (MSE) of these predictions?',
    table: {
      headers: ['House', 'Actual $y$', 'Predicted $\\hat{y}$'],
      rows: [
        [1, 3, 4],
        [2, 5, 5],
        [3, 7, 5],
        [4, 10, 9],
      ],
    },
    options: ['$0.5$', '$1.5$', '$1$', '$6$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Work out each error $y - \\hat{y}$, square it, then take the mean.\n\n' +
        '| House | $y$ | $\\hat{y}$ | $y - \\hat{y}$ | $(y - \\hat{y})^2$ |\n' +
        '|---|---|---|---|---|\n' +
        '| 1 | 3 | 4 | $-1$ | 1 |\n' +
        '| 2 | 5 | 5 | 0 | 0 |\n' +
        '| 3 | 7 | 5 | 2 | 4 |\n' +
        '| 4 | 10 | 9 | 1 | 1 |\n\n' +
        'Sum of squared errors: $1 + 4 + 1 = 6$ (house 2 adds nothing, because its error is $0$).\n\n' +
        '$$\\text{MSE} = \\frac{6}{4} = 1.5$$',
      whyWrong: [
        'This is the mean of the **signed** errors $-1$, $0$, $2$, $1$, which add up to $2$, giving $\\frac{2}{4} = 0.5$. Without squaring, positive and negative errors cancel out.',
        null,
        'This is the mean **absolute** error: the sizes $1$, $0$, $2$, $1$ add up to $4$, and $\\frac{4}{4} = 1$. MSE squares each error, so the error of $2$ counts as $4$.',
        'This is the **sum** of squared errors, $6$. The "mean" in MSE means you must divide by the number of houses, $4$.',
      ],
      keyIdea: 'MSE = square every error, add them up, divide by how many there are.',
    },
    check: {
      optionValues: [0.5, 1.5, 1, 6],
      compute: () => mse([3, 5, 7, 10], [4, 5, 5, 9]),
    },
  },
  {
    id: 'regression-gradient-descent-008',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'The scatter plot shows hours of revision $x$ against test score $y$ for five students, with the fitted regression line $\\hat{y} = 0.5x + 2$. The points are $(2, 3)$, $(4, 4.5)$, $(6, 7)$, $(8, 5.5)$ and $(10, 7)$. What is the **residual** (actual minus predicted) for the student who revised for $6$ hours?',
    chart: {
      kind: 'scatter',
      title: 'Revision time and test score',
      xLabel: 'Hours of revision',
      yLabel: 'Score',
      points: [
        { x: 2, y: 3 },
        { x: 4, y: 4.5 },
        { x: 6, y: 7 },
        { x: 8, y: 5.5 },
        { x: 10, y: 7 },
      ],
      line: { slope: 0.5, intercept: 2 },
    },
    options: ['$-2$', '$5$', '$4$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The student who revised for $6$ hours scored $y = 7$.\n\n' +
        'Predicted score from the line: $\\hat{y} = 0.5 \\times 6 + 2 = 3 + 2 = 5$.\n\n' +
        'Residual $= y - \\hat{y} = 7 - 5 = 2$.\n\n' +
        'A positive residual means the point lies **above** the line (the model under-predicted this student).',
      whyWrong: [
        'This is predicted minus actual, $5 - 7 = -2$. The residual is defined as actual minus predicted, so the sign is reversed.',
        'This is the predicted value $\\hat{y} = 5$, not the residual. You still need to subtract it from the actual score.',
        'This is the **squared** residual $2^2 = 4$, which is what goes into the MSE, not the residual itself.',
        null,
      ],
      keyIdea: 'Residual = actual value minus the value predicted by the line; positive means the point is above the line.',
    },
    check: { optionValues: [-2, 5, 4, 2], compute: () => { const w = 0.5, b = 2, x = 6, y = 7; return y - (w * x + b); } },
  },
  {
    id: 'regression-gradient-descent-009',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'A model with no bias, $\\hat{y} = wx$, is trained on a single example $(x, y) = (3, 10)$ with the squared-error loss $L = (wx - y)^2$. If currently $w = 2$, what is the gradient $\\frac{dL}{dw}$?',
    options: ['$24$', '$16$', '$-24$', '$-8$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'Use the chain rule on $L = (wx - y)^2$. The outside is "something squared" and the inside $wx - y$ has derivative $x$ with respect to $w$:\n\n' +
        '$$\\frac{dL}{dw} = 2(wx - y) \\times x$$\n\n' +
        'Substitute $w = 2$, $x = 3$, $y = 10$:\n\n' +
        '- Prediction: $wx = 2 \\times 3 = 6$\n' +
        '- Error: $wx - y = 6 - 10 = -4$\n' +
        '- Gradient: $2 \\times (-4) \\times 3 = -24$\n\n' +
        'The gradient is negative, so increasing $w$ would decrease the loss (the model is predicting too low).',
      whyWrong: [
        'This has the wrong sign. It uses $2(y - wx)x = 2 \\times 4 \\times 3 = 24$, forgetting that differentiating $y - wx$ with respect to $w$ gives $-x$, not $x$.',
        'This is the loss itself, $(6 - 10)^2 = 16$, not its derivative.',
        null,
        'This is $2 \\times (-4) = -8$: the chain rule factor $x = 3$ (the derivative of $wx - y$ with respect to $w$) was left out.',
      ],
      keyIdea: 'For squared error $(wx - y)^2$, the chain rule gives $\\frac{dL}{dw} = 2(wx - y)x$: error times input, times 2.',
    },
    check: {
      optionValues: [24, 16, -24, -8],
      compute: () => round(numDeriv((w) => (w * 3 - 10) ** 2, 2), 6),
    },
  },
  {
    id: 'regression-gradient-descent-010',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'A loss function is $L(w) = (w - 5)^2 + 1$. Gradient descent starts at $w_0 = 1$ with learning rate $\\eta = 0.1$. What is $w_1$, the value of $w$ after one step?',
    options: ['$1.8$', '$0.2$', '$9$', '$1.4$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'First differentiate. The $+1$ is a constant, so its derivative is $0$:\n\n' +
        '$$L\'(w) = 2(w - 5)$$\n\n' +
        'Gradient at $w_0 = 1$: $L\'(1) = 2(1 - 5) = -8$.\n\n' +
        'Update rule:\n\n' +
        '$$w_1 = w_0 - \\eta L\'(w_0) = 1 - 0.1 \\times (-8) = 1 + 0.8 = 1.8$$\n\n' +
        'Check: the minimum of $L$ is at $w = 5$, and $w$ has moved from $1$ towards $5$, as it should.',
      whyWrong: [
        null,
        'This adds the step instead of subtracting it: $1 + 0.1 \\times (-8) = 0.2$. That moves $w$ away from the minimum at $5$.',
        'This forgets the learning rate: $1 - (-8) = 9$. The gradient must be multiplied by $\\eta = 0.1$.',
        'This drops the factor $2$ when differentiating, using $L\'(w) = w - 5 = -4$, so $w_1 = 1 + 0.4 = 1.4$.',
      ],
      keyIdea: 'Differentiate the loss, evaluate the gradient at the current $w$, then subtract learning rate times gradient.',
    },
    check: {
      optionValues: [1.8, 0.2, 9, 1.4],
      compute: () => { const w0 = 1, eta = 0.1; return round(w0 - eta * numDeriv((w) => (w - 5) ** 2 + 1, w0), 6); },
    },
  },
  {
    id: 'regression-gradient-descent-011',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'A logistic regression model computes $z = 2x - 3$ and outputs $p = \\sigma(z) = \\frac{1}{1 + e^{-z}}$, the probability of class 1. It predicts class 1 when $p \\ge 0.5$. For an input $x = 1$, what are $p$ (to 2 decimal places) and the predicted class?',
    options: ['$p = 0.73$, class 1', '$p = 0.27$, class 0', '$p = 0.37$, class 0', '$p = 0.27$, class 1'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Step 1, the linear part: $z = 2 \\times 1 - 3 = -1$.\n\n' +
        'Step 2, the sigmoid: $e^{-z} = e^{-(-1)} = e \\approx 2.718$, so\n\n' +
        '$$p = \\frac{1}{1 + e} \\approx \\frac{1}{3.718} \\approx 0.27$$\n\n' +
        'Step 3, the threshold: $0.27 < 0.5$, so the model predicts **class 0**.\n\n' +
        'Quick check: $z$ is negative, and a negative $z$ always gives $p < 0.5$.',
      whyWrong: [
        'This is $\\sigma(1) \\approx 0.73$: the minus sign in $e^{-z}$ was lost, so $e^{-1}$ was used instead of $e$. A negative $z$ must give $p < 0.5$.',
        null,
        'This is $e^{-1} \\approx 0.37$: it computes only the exponential, not $\\frac{1}{1 + e^{-z}}$.',
        'The probability is right, but the class is wrong: class 1 needs $p \\ge 0.5$, and $0.27$ is below the threshold.',
      ],
      keyIdea: 'Logistic regression: compute $z = wx + b$, squash it with the sigmoid into a probability, then compare with $0.5$.',
    },
    check: {
      optionValues: ['0.73|1', '0.27|0', '0.37|0', '0.27|1'],
      compute: () => { const p = sigmoid(2 * 1 - 3); return `${round(p, 2)}|${p >= 0.5 ? 1 : 0}`; },
    },
  },
  {
    id: 'regression-gradient-descent-012',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'For one training example whose true label is $y = 1$, a logistic regression model outputs $p = 0.8$. Using the binary cross-entropy loss $L = -[y \\ln p + (1 - y)\\ln(1 - p)]$ with the natural logarithm, what is the loss (to 2 decimal places)?',
    options: ['$1.61$', '$0.20$', '$0.04$', '$0.22$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'With $y = 1$ the second term vanishes because $1 - y = 0$:\n\n' +
        '$$L = -[1 \\times \\ln 0.8 + (1 - 1) \\ln 0.2] = -\\ln 0.8$$\n\n' +
        'On a calculator, $\\ln 0.8 \\approx -0.2231$, so\n\n' +
        '$$L \\approx 0.2231 \\approx 0.22$$\n\n' +
        'Sense check: the model gave the correct class a high probability, so the loss should be small.',
      whyWrong: [
        'This is $-\\ln 0.2 \\approx 1.61$: it uses the probability of the **wrong** class, $1 - p$. When $y = 1$ only the $\\ln p$ term survives.',
        'This is $1 - p = 0.20$, the gap between the label and the probability, not the cross-entropy loss (no logarithm was taken).',
        'This is the squared error $(1 - 0.8)^2 = 0.04$, which is the MSE-style loss, not cross-entropy.',
        null,
      ],
      keyIdea: 'Cross-entropy for a true label of 1 is $-\\ln p$: small when $p$ is near 1, huge when $p$ is near 0.',
    },
    check: {
      optionValues: [1.61, 0.2, 0.04, 0.22],
      compute: () => { const y = 1, p = 0.8; return round(-(y * Math.log(p) + (1 - y) * Math.log(1 - p)), 2); },
    },
  },
  {
    id: 'regression-gradient-descent-013',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'The Python code runs gradient descent on the loss $L(w) = (w - 4)^2$, whose gradient is $2(w - 4)$. What does it print? (The three printed lines are shown separated by spaces.)',
    code: {
      lang: 'python',
      source: 'w = 0.0\nlr = 0.1\nfor step in range(3):\n    grad = 2 * (w - 4)\n    w = w - lr * grad\n    print(round(w, 2))',
    },
    options: ['`0.8 1.6 2.4`', '`0.8 1.44 1.95`', '`-0.8 -1.76 -2.91`', '`8.0 0.0 8.0`'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Trace the loop. The gradient is recomputed from the **current** $w$ every time.\n\n' +
        '| step | $w$ at start | `grad = 2*(w-4)` | `w - lr*grad` | printed |\n' +
        '|---|---|---|---|---|\n' +
        '| 0 | 0.0 | $2 \\times (-4) = -8$ | $0 + 0.8 = 0.8$ | `0.8` |\n' +
        '| 1 | 0.8 | $2 \\times (-3.2) = -6.4$ | $0.8 + 0.64 = 1.44$ | `1.44` |\n' +
        '| 2 | 1.44 | $2 \\times (-2.56) = -5.12$ | $1.44 + 0.512 = 1.952$ | `1.95` |\n\n' +
        'Output (one value per line): `0.8`, `1.44`, `1.95`. Notice the steps get smaller as $w$ approaches the minimum at $4$, because the gradient shrinks.',
      whyWrong: [
        'This keeps using the first gradient $-8$ every time (steps of $0.8$). The gradient is recalculated inside the loop from the new $w$, so it shrinks: $-8$, then $-6.4$, then $-5.12$.',
        null,
        'This adds `lr * grad` instead of subtracting it (gradient ascent), so $w$ runs away from the minimum at $4$: $-0.8$, $-1.76$, $-2.912$.',
        'This ignores `lr` and subtracts the whole gradient: $0 - (-8) = 8$, then $8 - 8 = 0$, then $8$ again, bouncing for ever.',
      ],
      keyIdea: 'Each gradient-descent step recomputes the gradient at the current weight, so steps shrink near the minimum.',
    },
    python: { stdout: '0.8\n1.44\n1.95\n' },
  },
  {
    id: 'regression-gradient-descent-014',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'The graph shows the training loss for three runs of gradient descent on the same model. The runs used learning rates $0.0001$, $0.01$ and $2$, not necessarily in that order. Which matching is most likely?',
    chart: {
      kind: 'line',
      title: 'Training loss by epoch',
      xLabel: 'Epoch',
      yLabel: 'Loss',
      categories: ['0', '1', '2', '3', '4', '5', '6'],
      series: [
        { name: 'Run A', values: [10, 9.6, 9.2, 8.8, 8.4, 8, 7.6] },
        { name: 'Run B', values: [10, 6, 3.6, 2.2, 1.4, 1, 0.9] },
        { name: 'Run C', values: [10, 14, 9, 18, 12, 25, 30] },
      ],
    },
    options: [
      'Run A: $2$, Run B: $0.01$, Run C: $0.0001$',
      'Run A: $0.01$, Run B: $2$, Run C: $0.0001$',
      'Run A: $0.0001$, Run B: $0.01$, Run C: $2$',
      'Run A: $0.0001$, Run B: $2$, Run C: $0.01$',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        'Think about the size of each step, $\\eta \\times \\text{gradient}$:\n\n' +
        '- **Too small** a learning rate ($0.0001$) makes tiny steps: the loss falls, but very slowly. That is **Run A** (down only $0.4$ per epoch).\n' +
        '- A **good** learning rate ($0.01$) falls quickly and then levels off near the minimum. That is **Run B**.\n' +
        '- **Too large** a learning rate ($2$) overshoots the minimum, jumping from one side of the valley to the other and climbing higher each time: the loss bounces and grows (diverges). That is **Run C**.',
      whyWrong: [
        'This reverses the effect of the learning rate. A big learning rate does not make training slow and careful: it makes huge steps that overshoot, which is the zig-zagging, exploding Run C.',
        'This assumes a tiny learning rate causes instability. A tiny learning rate can only make tiny steps, so it gives the slow steady decline of Run A, not the blow-up.',
        null,
        'This assumes the largest learning rate always gives the fastest decrease. Beyond a certain size the steps overshoot the minimum, so $2$ produces the diverging Run C, while $0.01$ gives the fast smooth drop of Run B.',
      ],
      keyIdea: 'Learning rate too small: slow progress; too large: overshooting, oscillating or diverging loss.',
    },
  },
  {
    id: 'regression-gradient-descent-015',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'Two linear regression models are tested on the data in the table: Model A is $\\hat{y} = 2x + 1$ and Model B is $\\hat{y} = 1.5x + 2$. Which model has the lower mean squared error, and what is that MSE?',
    table: {
      headers: ['$x$', '1', '2', '3', '4'],
      rows: [['$y$', 3, 6, 7, 8]],
    },
    options: ['Model A, with MSE $0.5$', 'Model A, with MSE $0$', 'Model B, with MSE $1.5$', 'Model B, with MSE $0.375$'],
    correctIndex: 3,
    markScheme: {
      solution:
        '**Model A** predicts $3, 5, 7, 9$. Errors $y - \\hat{y}$: $0, 1, 0, -1$. Squares: $0, 1, 0, 1$.\n\n' +
        'The squares add up to $2$, so\n\n' +
        '$$\\text{MSE}_A = \\frac{2}{4} = 0.5$$\n\n' +
        '**Model B** predicts $3.5, 5, 6.5, 8$. Errors: $-0.5, 1, 0.5, 0$. Squares: $0.25, 1, 0.25, 0$.\n\n' +
        'The squares add up to $0.25 + 1 + 0.25 = 1.5$, so\n\n' +
        '$$\\text{MSE}_B = \\frac{1.5}{4} = 0.375$$\n\n' +
        'Since $0.375 < 0.5$, **Model B** fits better, with MSE $0.375$.',
      whyWrong: [
        '$0.5$ is Model A\'s MSE, which is correct for Model A, but Model B\'s MSE ($0.375$) is lower, so Model A is not the better model.',
        'This averages Model A\'s signed errors $0$, $1$, $0$, $-1$ without squaring them. They add up to $0$ only because the positive and negative errors cancel, which makes Model A look perfect. MSE squares each error first: Model A\'s squared errors are $0$, $1$, $0$, $1$, so its MSE is $0.5$ (and Model B\'s $0.375$ is lower).',
        'This is Model B\'s **sum** of squared errors, $1.5$. It must be divided by the $4$ data points to get the MSE, $0.375$.',
        null,
      ],
      keyIdea: 'Compare models by MSE: square each error so positive and negative errors cannot cancel, then average.',
    },
    check: {
      optionValues: ['A:0.5', 'A:0', 'B:1.5', 'B:0.375'],
      compute: () => {
        const xs = [1, 2, 3, 4];
        const ys = [3, 6, 7, 8];
        const a = mse(ys, xs.map((x) => 2 * x + 1));
        const b = mse(ys, xs.map((x) => 1.5 * x + 2));
        return a < b ? `A:${a}` : `B:${b}`;
      },
    },
  },

  // ---------------------------------------------------------------- challenge
  {
    id: 'regression-gradient-descent-016',
    subtopic: SUB,
    difficulty: 'challenge',
    stem: 'A model $\\hat{y} = wx + b$ is trained on two points, $(1, 3)$ and $(2, 5)$, using the loss\n\n$$L = \\frac{1}{n}\\sum_{i=1}^{n} (\\hat{y}_i - y_i)^2$$\n\nso that $\\frac{\\partial L}{\\partial w} = \\frac{2}{n}\\sum (\\hat{y}_i - y_i)x_i$ and $\\frac{\\partial L}{\\partial b} = \\frac{2}{n}\\sum (\\hat{y}_i - y_i)$. Starting from $w = 0$, $b = 0$ with learning rate $\\eta = 0.1$, what are $w$ and $b$ after one gradient descent step?',
    options: ['$w = -1.3$, $b = -0.8$', '$w = 2.6$, $b = 1.6$', '$w = 1.3$, $b = 0.8$', '$w = 0.65$, $b = 0.4$'],
    correctIndex: 2,
    markScheme: {
      solution:
        'With $w = b = 0$ both predictions are $0$. Here $n = 2$, so $\\frac{2}{n} = 1$.\n\n' +
        '| $x$ | $y$ | $\\hat{y}$ | $\\hat{y} - y$ | $(\\hat{y} - y)x$ |\n' +
        '|---|---|---|---|---|\n' +
        '| 1 | 3 | 0 | $-3$ | $-3$ |\n' +
        '| 2 | 5 | 0 | $-5$ | $-10$ |\n\n' +
        'Gradients:\n\n' +
        '- $\\frac{\\partial L}{\\partial w} = 1 \\times (-3 - 10) = -13$\n' +
        '- $\\frac{\\partial L}{\\partial b} = 1 \\times (-3 - 5) = -8$\n\n' +
        'Updates:\n\n' +
        '- $w = 0 - 0.1 \\times (-13) = 1.3$\n' +
        '- $b = 0 - 0.1 \\times (-8) = 0.8$\n\n' +
        'Both increase, which makes sense: the model was predicting $0$, far too low.',
      whyWrong: [
        'This adds $\\eta \\times$ gradient instead of subtracting it, moving uphill. With negative gradients, descent must **increase** $w$ and $b$.',
        'This forgets the $\\frac{1}{n}$ in the mean, using gradients $2\\sum(\\ldots) = -26$ and $-16$. That doubles both steps.',
        null,
        'This drops the factor $2$ from differentiating the square, using $\\frac{1}{n}\\sum(\\ldots)$: gradients $-6.5$ and $-4$, which halves both steps.',
      ],
      keyIdea: 'For MSE, each gradient averages error times input (for $w$) or just error (for $b$), times 2; then every parameter steps against its own gradient.',
    },
    check: {
      optionValues: ['-1.3,-0.8', '2.6,1.6', '1.3,0.8', '0.65,0.4'],
      compute: () => {
        const xs = [1, 2];
        const ys = [3, 5];
        const loss = (w: number, b: number) => mse(ys, xs.map((x) => w * x + b));
        const gw = numDeriv((w) => loss(w, 0), 0);
        const gb = numDeriv((b) => loss(0, b), 0);
        return `${round(0 - 0.1 * gw, 4)},${round(0 - 0.1 * gb, 4)}`;
      },
    },
  },
  {
    id: 'regression-gradient-descent-017',
    subtopic: SUB,
    difficulty: 'challenge',
    stem: 'A logistic regression model predicts whether a student passes an exam from $x_1$ = hours of study and $x_2$ = number of practice tests taken:\n\n$$p = \\sigma(0.5x_1 + 2x_2 - 9)$$\n\nIt predicts "pass" when $p \\ge 0.5$. A student studies for $10$ hours. What is the smallest number of practice tests they must take to be predicted to pass?',
    options: ['$4$', '$7$', '$4.5$', '$2$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Since $\\sigma(0) = 0.5$ and the sigmoid is increasing, $p \\ge 0.5$ exactly when $z \\ge 0$.\n\n' +
        'So we need $0.5x_1 + 2x_2 - 9 \\ge 0$.\n\n' +
        'Substitute $x_1 = 10$: $5 + 2x_2 - 9 \\ge 0$, so $2x_2 - 4 \\ge 0$.\n\n' +
        'Therefore $2x_2 \\ge 4$, giving $x_2 \\ge 2$.\n\n' +
        'Check: with $x_2 = 2$, $z = 5 + 4 - 9 = 0$ and $p = 0.5$, so the student is (just) predicted to pass. With $x_2 = 1$, $z = -2$ and $p < 0.5$.',
      whyWrong: [
        'This is $9 - 5 = 4$: it forgets to divide by the weight $2$ on $x_2$. Each practice test adds $2$ to $z$, not $1$.',
        'This makes a sign error, writing $2x_2 = 9 + 5$, so $x_2 = 7$. Moving $+5$ across the inequality should give $2x_2 \\ge 9 - 5$.',
        'This ignores the $10$ hours of study and solves $2x_2 = 9$. The term $0.5x_1 = 5$ must be included.',
        null,
      ],
      keyIdea: 'The decision boundary of logistic regression is where $z = 0$ (because $\\sigma(0) = 0.5$), so solve $wx + b \\ge 0$.',
    },
    check: {
      optionValues: [4, 7, 4.5, 2],
      compute: () => {
        // smallest whole number of tests with p >= 0.5
        for (let t = 0; t <= 20; t++) if (sigmoid(0.5 * 10 + 2 * t - 9) >= 0.5) return t;
        return -1;
      },
    },
  },
  {
    id: 'regression-gradient-descent-018',
    subtopic: SUB,
    difficulty: 'challenge',
    stem: 'For a binary classifier, two training examples have true labels $y = 1$ and $y = 0$. The model outputs probabilities (of class 1) $p = 0.9$ and $p = 0.2$ respectively. What is the **mean** binary cross-entropy loss $-[y \\ln p + (1 - y)\\ln(1 - p)]$ over the two examples, using natural logs, to 2 decimal places?',
    options: ['$0.86$', '$0.16$', '$0.33$', '$0.07$'],
    correctIndex: 1,
    markScheme: {
      solution:
        'Example 1 ($y = 1$, $p = 0.9$): only the first term survives, $L_1 = -\\ln 0.9 \\approx 0.1054$.\n\n' +
        'Example 2 ($y = 0$, $p = 0.2$): only the second term survives, $L_2 = -\\ln(1 - 0.2) = -\\ln 0.8 \\approx 0.2231$.\n\n' +
        'Mean loss:\n\n' +
        '$$\\frac{0.1054 + 0.2231}{2} = \\frac{0.3285}{2} \\approx 0.16$$\n\n' +
        'Both predictions are on the correct side, so a small loss makes sense.',
      whyWrong: [
        'This uses $-\\ln 0.2 \\approx 1.609$ for the second example, giving $\\frac{0.105 + 1.609}{2} \\approx 0.86$. When $y = 0$ the loss uses $\\ln(1 - p) = \\ln 0.8$, because $1 - p$ is the probability given to the true class.',
        null,
        'This is the **total** $0.1054 + 0.2231 \\approx 0.33$; the question asks for the mean, so divide by $2$.',
        'This uses the base-10 $\\log$ key instead of $\\ln$: $-\\log 0.9 \\approx 0.0458$ and $-\\log 0.8 \\approx 0.0969$, whose mean is about $0.07$. The question says to use natural logs, so use the $\\ln$ key.',
      ],
      keyIdea: 'Cross-entropy takes $-\\ln$ of the probability the model gave to the true class, then averages over the examples.',
    },
    check: {
      optionValues: [0.86, 0.16, 0.33, 0.07],
      compute: () => {
        const ex = [
          { y: 1, p: 0.9 },
          { y: 0, p: 0.2 },
        ];
        return round(mean(ex.map(({ y, p }) => -(y * Math.log(p) + (1 - y) * Math.log(1 - p)))), 2);
      },
    },
  },
  {
    id: 'regression-gradient-descent-019',
    subtopic: SUB,
    difficulty: 'challenge',
    stem: 'Gradient descent is run on $L(w) = w^2$ (gradient $2w$) starting from $w_0 = 1$ with learning rate $\\eta = 1.5$. What is $w$ after **two** steps?',
    options: ['$-2$', '$-8$', '$16$', '$4$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'Each step is $w \\leftarrow w - 1.5 \\times 2w = w - 3w = -2w$.\n\n' +
        '- Step 1: gradient $2 \\times 1 = 2$, so $w_1 = 1 - 1.5 \\times 2 = 1 - 3 = -2$.\n' +
        '- Step 2: gradient $2 \\times (-2) = -4$, so $w_2 = -2 - 1.5 \\times (-4) = -2 + 6 = 4$.\n\n' +
        'The minimum is at $w = 0$, but $w$ goes $1 \\to -2 \\to 4$: it jumps across the minimum and gets **further** away each time. The learning rate is too large, so gradient descent **diverges**.',
      whyWrong: [
        'This is $w_1 = -2$, the value after only **one** step. The question asks for two steps.',
        'This uses the size of the gradient but drops its sign in step 2: $-2 - 1.5 \\times 4 = -8$. The gradient at $w = -2$ is $2 \\times (-2) = -4$, which is negative.',
        'This adds $\\eta \\times$ gradient at each step ($w \\leftarrow w + 3w = 4w$), giving $4$ then $16$. Gradient descent subtracts.',
        null,
      ],
      keyIdea: 'If the learning rate is too large, each step overshoots the minimum by more than it started, so the weights oscillate and diverge.',
    },
    check: {
      optionValues: [-2, -8, 16, 4],
      compute: () => {
        let w = 1;
        const eta = 1.5;
        for (let i = 0; i < 2; i++) w = w - eta * numDeriv((v) => v * v, w);
        return round(w, 6);
      },
    },
  },
  {
    id: 'regression-gradient-descent-020',
    subtopic: SUB,
    difficulty: 'challenge',
    stem: 'A loss function is $L(w) = (w - 3)^2$, and gradient descent starts at $w_0 = 7$. Which learning rate $\\eta$ makes the very first step land **exactly** on the minimum?',
    options: ['$1$', '$2$', '$0.875$', '$0.5$'],
    correctIndex: 3,
    markScheme: {
      solution:
        'The minimum of $(w - 3)^2$ is at $w = 3$.\n\n' +
        'Gradient: $L\'(w) = 2(w - 3)$, so at $w_0 = 7$ the gradient is $2 \\times 4 = 8$.\n\n' +
        'One step gives $w_1 = 7 - 8\\eta$. We want $w_1 = 3$:\n\n' +
        '$$7 - 8\\eta = 3 \\quad\\Rightarrow\\quad 8\\eta = 4 \\quad\\Rightarrow\\quad \\eta = 0.5$$\n\n' +
        'Check: $7 - 0.5 \\times 8 = 3$.',
      whyWrong: [
        'This forgets the factor $2$ in the derivative, using a gradient of $4$: $7 - 4\\eta = 3$ gives $\\eta = 1$. With the true gradient $8$, $\\eta = 1$ would jump to $-1$.',
        'This inverts the fraction: $\\frac{8}{4} = 2$ instead of $\\frac{4}{8}$. The learning rate multiplies the gradient, so $\\eta = \\frac{\\text{distance}}{\\text{gradient}}$.',
        'This divides the starting value by the gradient, $\\frac{7}{8} = 0.875$, instead of the distance to the minimum, $7 - 3 = 4$.',
        null,
      ],
      keyIdea: 'Write the update $w_1 = w_0 - \\eta L\'(w_0)$, set it equal to the target, and solve for $\\eta$.',
    },
    check: {
      optionValues: [1, 2, 0.875, 0.5],
      compute: () => {
        const w0 = 7;
        const g = numDeriv((w) => (w - 3) ** 2, w0);
        return round((w0 - 3) / g, 6);
      },
    },
  },
];

