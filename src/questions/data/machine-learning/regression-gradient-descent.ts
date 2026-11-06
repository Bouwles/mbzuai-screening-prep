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
    stem: 'A linear regression model predicts delivery time in minutes from distance $x$ in km: $\\hat{y} = 2.5x + 4$. What does it predict for $x = 6$?',
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
      'Predicting the selling price of a flat',
      'Predicting whether an email is spam or not spam',
      'Predicting tomorrow\'s temperature',
      'Grouping customers when no labels are given',
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
    stem: 'A weight is $w = 3$, the gradient of the loss is $\\frac{\\partial L}{\\partial w} = 4$ and the learning rate is $\\eta = 0.1$. What is $w$ after one gradient descent update?',
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
      'Differentiate the loss with respect to the inputs, then change the data',
      'Differentiate the prediction, then step with the derivative',
      'Set every weight equal to the loss',
      'Differentiate the loss with respect to each weight, then step against it',
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
    stem: 'Statement 1: mean squared error (MSE) is the usual loss for linear regression.\n\nStatement 2: cross-entropy (log loss) is the usual loss for logistic regression.\n\nWhich is true?',
    options: [
      'Statement 1 only',
      'Statement 2 only',
      'Both statements',
      'Neither statement',
    ],
    correctIndex: 2,
    markScheme: {
      solution:
        '**Statement 1 is true.** Linear regression predicts a number, so we measure how far each prediction is from the truth and average the squares: $\\text{MSE} = \\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2$.\n\n' +
        '**Statement 2 is true.** Logistic regression outputs a probability $p$. Cross-entropy, $L = -[y \\ln p + (1 - y)\\ln(1 - p)]$, punishes confident wrong probabilities very heavily, and it is the standard loss for classification.\n\n' +
        'Both statements are true.',
      whyWrong: [
        'Statement 1 is true, but so is Statement 2: cross-entropy is the standard loss for logistic regression.',
        'Statement 2 is true, but so is Statement 1: MSE is the standard loss for linear regression.',
        null,
        'Both statements are standard facts, so it cannot be that neither is true.',
      ],
      keyIdea: 'Regression (numbers) uses MSE; classification with probabilities (logistic regression) uses cross-entropy.',
    },
  },

  // ---------------------------------------------------------------- exam
  {
    id: 'regression-gradient-descent-007',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'The table shows a model\'s predictions $\\hat{y}$ for four houses. What is the mean squared error (MSE) of these predictions?',
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
    stem: 'The scatter plot shows revision hours $x$ against score $y$, with the fitted line $\\hat{y} = 0.5x + 2$. What is the **residual** (actual minus predicted) at $x = 6$?',
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
        'Read the point at $x = 6$ from the plot: $y = 7$.\n\n' +
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
    stem: 'A model $\\hat{y} = wx$ is trained on the single example $(x, y) = (3, 10)$ with loss $L = (wx - y)^2$. If $w = 2$, what is the gradient $\\frac{dL}{dw}$?',
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
    stem: 'A loss is $L(w) = (w - 5)^2 + 1$. Gradient descent starts at $w_0 = 1$ with learning rate $\\eta = 0.1$. What is $w_1$, the value after one step?',
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
    stem: 'A logistic regression model has $z = 2x - 3$ and $p = \\sigma(z) = \\frac{1}{1 + e^{-z}}$, and predicts class 1 when $p \\ge 0.5$. For $x = 1$, what are $p$ (to 2 decimal places) and the predicted class?',
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
    stem: 'For a true label $y = 1$, a logistic regression model outputs $p = 0.8$. Using the binary cross-entropy loss $L = -[y \\ln p + (1 - y)\\ln(1 - p)]$, what is the loss (to 2 decimal places)?',
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
    stem: 'This pseudocode runs gradient descent on the loss $L(w) = (w - 4)^2$, whose gradient is $2(w - 4)$. What does it print?',
    code: {
      lang: 'pseudocode',
      source: 'w = 0\nlr = 0.1\nfor i = 1 to 3\n   grad = 2 * (w - 4)\n   w = w - lr * grad\nend for\nprint(w)',
    },
    options: [
      '$1.952$',
      '$2.4$',
      '$-2.912$',
      '$8$',
    ],
    correctIndex: 0,
    markScheme: {
      solution:
        'Trace the loop. The gradient is recomputed from the **current** $w$ every time.\n\n' +
        '| $i$ | $w$ at start | `grad` | new $w$ |\n' +
        '|---|---|---|---|\n' +
        '| 1 | 0 | $2 \\times (-4) = -8$ | $0 + 0.8 = 0.8$ |\n' +
        '| 2 | 0.8 | $2 \\times (-3.2) = -6.4$ | $0.8 + 0.64 = 1.44$ |\n' +
        '| 3 | 1.44 | $2 \\times (-2.56) = -5.12$ | $1.44 + 0.512 = 1.952$ |\n\n' +
        'After the loop it prints $1.952$. The steps get smaller as $w$ approaches the minimum at $4$, because the gradient shrinks.',
      whyWrong: [
        null,
        'This keeps using the first gradient $-8$ every time, giving steps of $0.8$. The gradient is recalculated inside the loop from the new $w$, so it shrinks.',
        'This adds `lr * grad` instead of subtracting it (gradient ascent), so $w$ runs away from the minimum at $4$: $-0.8$, $-1.76$, $-2.912$.',
        'This ignores `lr` and subtracts the whole gradient: $w$ goes $8$, then $0$, then $8$ again, bouncing for ever.',
      ],
      keyIdea: 'Each gradient-descent step recomputes the gradient at the current weight, so steps shrink near the minimum.',
    },
    check: {
      optionValues: [1.952, 2.4, -2.912, 8],
      compute: () => {
        let w = 0;
        const lr = 0.1;
        for (let i = 1; i <= 3; i++) {
          const grad = 2 * (w - 4);
          w = w - lr * grad;
        }
        return round(w, 6);
      },
    },
  },
  {
    id: 'regression-gradient-descent-014',
    subtopic: SUB,
    difficulty: 'exam',
    stem: 'The graph shows training loss for three runs on one model, using learning rates $0.0001$, $0.01$ and $2$ in some order. Which matching is most likely?',
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
    stem: 'On the data in the table, Model A is $\\hat{y} = 2x + 1$ and Model B is $\\hat{y} = 1.5x + 2$. Which model has the lower mean squared error, and what is that MSE?',
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
  {
    id: 'regression-gradient-descent-019',
    subtopic: SUB,
    difficulty: 'exam',
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

  // ---------------------------------------------------------------- recall
  {
    id: 'regression-gradient-descent-021',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'In the model $\\hat{y} = wx + b$, which symbol is the slope (gradient) of the line?',
    options: ['$w$', '$b$', '$x$', '$\\hat{y}$'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Compare with the straight line $y = mx + c$: the number multiplying $x$ is the slope, also called the gradient.\n\n' +
        'So $w$ (the **weight**) is the slope, and $b$ (the **bias**) is the intercept.',
      whyWrong: [
        null,
        '$b$ is the **intercept**: the value of $\\hat{y}$ when $x = 0$. It moves the line up or down without changing its slope.',
        '$x$ is the input variable, not a fixed property of the line.',
        '$\\hat{y}$ is the prediction, the output of the model.',
      ],
      keyIdea: 'In $\\hat{y} = wx + b$, the weight $w$ is the slope and the bias $b$ is the intercept.',
    },
  },
  {
    id: 'regression-gradient-descent-022',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'What does the **learning rate** control in gradient descent?',
    options: ['The size of each update step', 'The number of input features', 'The number of training examples', 'The value of the final loss'],
    correctIndex: 0,
    markScheme: {
      solution:
        'Each update is $w \\leftarrow w - \\eta \\frac{\\partial L}{\\partial w}$, and the learning rate $\\eta$ multiplies the gradient.\n\n' +
        'So $\\eta$ sets the **size of each step**. Too small and training is slow; too large and the steps overshoot the minimum.',
      whyWrong: [
        null,
        'The number of features is fixed by the data, not by the update rule.',
        'The number of examples is fixed by the dataset. The learning rate only scales the step taken with them.',
        'The final loss is a result of training. The learning rate affects it only indirectly, through the steps taken.',
      ],
      keyIdea: 'The learning rate $\\eta$ scales the gradient, so it sets the size of each step.',
    },
  },
  {
    id: 'regression-gradient-descent-023',
    subtopic: SUB,
    difficulty: 'foundation',
    stem: 'What is a **residual** in regression?',
    options: ['Actual value minus predicted value', 'Predicted value minus actual value', 'The square of the predicted value', 'The gradient of the fitted line'],
    correctIndex: 0,
    markScheme: {
      solution:
        'A **residual** is what is left over after the prediction: $y - \\hat{y}$, the actual value minus the predicted value.\n\n' +
        'A positive residual means the point lies above the fitted line.',
      whyWrong: [
        null,
        'This has the sign reversed. The residual is defined as actual minus predicted.',
        'Squaring is used on the **residual** in the MSE. The square of a prediction is not a measure of error.',
        'The gradient describes the slope of the line. A residual is a vertical gap between a point and the line.',
      ],
      keyIdea: 'Residual $= y - \\hat{y}$, the vertical gap from the fitted line to the point.',
    },
  },
];

